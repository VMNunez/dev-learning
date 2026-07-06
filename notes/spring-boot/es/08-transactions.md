# Transacciones — @Transactional

> 📖 [Baeldung — Transactions with Spring and JPA](https://www.baeldung.com/transaction-configuration-with-jpa-and-spring)
> 📖 [Spring Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction.html)

## Qué es una transacción

Una transacción es un grupo de operaciones de base de datos que o todas tienen éxito o todas fallan juntas. Sin transacciones, un fallo parcial deja la base de datos en un estado inconsistente:

```
// Sin @Transactional — si el paso 2 falla, el paso 1 ya está committed
1. Guardar el nuevo registro de transacción  ✓ (guardado en BD)
2. Actualizar el saldo de la cuenta          ✗ (lanza una excepción)
→ El registro existe pero el saldo está mal
```

`@Transactional` envuelve el método en una transacción de base de datos. Si se lanza cualquier excepción, todo lo hecho dentro del método se hace rollback automáticamente.

---

## Dónde poner @Transactional

Docs: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html → leer: "Using @Transactional"

En los **métodos de service** que hacen más de una operación de base de datos. No en los controladores (no acceden directamente a la base de datos). No en los métodos de repositorio (Spring Data JPA ya envuelve cada llamada al repositorio en su propia transacción).

```java
@Service
public class TransactionService {

    @Transactional
    public TransactionDTO create(TransactionCreateDTO dto) {
        // Paso 1 — guardar el registro de transacción
        Transaction t = new Transaction(dto.amount(), dto.description(), dto.date());
        repository.save(t);

        // Paso 2 — actualizar el saldo de la cuenta (tabla separada)
        accountService.updateBalance(dto.userId(), dto.amount());

        // Si el paso 2 lanza, el paso 1 hace rollback — sin registros huérfanos
        return mapper.toDto(t);
    }
}
```

---

## Transacciones de solo lectura — @Transactional(readOnly = true)

Docs: https://www.baeldung.com/transaction-configuration-with-jpa-and-spring → leer: la sección sobre `readOnly = true` y su efecto en el rendimiento

Para métodos que solo leen datos, márcalos como read-only. Hibernate omite el dirty-checking (comparar el estado de la entidad para detectar cambios) al final de la transacción, lo que hace las lecturas más rápidas.

```java
@Transactional(readOnly = true)
public List<TransactionDTO> getAll() {
    return repository.findAll().stream()
        .map(mapper::toDto)
        .collect(Collectors.toList());
}
```

Buena práctica: anota todos los métodos del service. Los métodos de escritura tienen `@Transactional`, los de lectura tienen `@Transactional(readOnly = true)`.

---

## @Transactional no funciona en métodos privados

Docs: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html → leer: la nota sobre visibilidad de métodos y auto-invocación

`@Transactional` funciona a través de un proxy de Spring — un wrapper que intercepta la llamada al método y gestiona la transacción. Si el método es privado, el proxy no puede interceptarlo. La anotación se ignora silenciosamente sin ningún error.

```java
// Incorrecto — @Transactional en un método privado no tiene efecto
@Transactional
private void saveAndUpdateBalance(Transaction t) { ... }

// Correcto — public para que el proxy pueda interceptarlo
@Transactional
public void saveAndUpdateBalance(Transaction t) { ... }
```

> **Misma causa raíz, forma más traicionera — llamarlo desde dentro de la misma clase.** Incluso un método `public @Transactional` pierde su transacción si lo llamas *desde otro método de la misma clase* en lugar de pasar por Spring:
>
> ```java
> @Service
> public class TransactionService {
>
>     public void createWithBalance(TransactionCreateDTO dto) {
>         save(dto);   // ← auto-llamada: se salta el proxy por completo, @Transactional en save() nunca se ejecuta
>     }
>
>     @Transactional
>     public void save(TransactionCreateDTO dto) { ... }
> }
> ```
>
> La razón: cuando Spring crea el bean `TransactionService`, lo que realmente se inyecta en otras clases no es tu clase tal cual — es un **proxy**, una subclase generada (o un proxy dinámico de JDK) que envuelve tu clase y añade la lógica de transacción alrededor de cada llamada a un método. Las llamadas que llegan *desde fuera* del bean (por ejemplo, un controller llamando a `transactionService.createWithBalance(...)`) pasan primero por ese proxy, así que la lógica de transacción se ejecuta. Pero `save(dto)` de arriba se llama como `this.save(dto)` desde *dentro* del mismo objeto — Java resuelve esa llamada directamente contra la clase real, sin pasar nunca por el proxy que la envuelve. Sin proxy en el camino no hay transacción, exactamente igual que en el caso del método privado, solo que más difícil de detectar porque el método en sí es `public` y parece correctamente anotado. No hay forma de arreglar esto desde dentro de la misma clase — la solución estándar es mover `save()` a otro `@Service` distinto e inyectar ese bean, para forzar que la llamada pase por su propio proxy.

---

## LazyInitializationException — el error JPA más común

Docs: https://www.baeldung.com/hibernate-lazy-initialization-exception

Cuando accedes a una relación `FetchType.LAZY` después de que la sesión de Hibernate se ha cerrado, obtienes una `LazyInitializationException`. La sesión se cierra al final del método `@Transactional`:

```java
// Service — la sesión está abierta mientras @Transactional está ejecutándose
@Transactional(readOnly = true)
public Transaction getById(Long id) {
    return repository.findById(id).orElseThrow(...);
}

// Controller — la sesión ya está cerrada aquí
Transaction t = service.getById(1L);
t.getUser().getName();  // LazyInitializationException — la sesión se fue, no puede hacer la query extra
```

**Dos soluciones:**

**Fix 1 — convertir a DTO dentro de la transacción** (el enfoque correcto):

```java
@Transactional(readOnly = true)
public TransactionDTO getById(Long id) {
    Transaction t = repository.findById(id).orElseThrow(...);
    // Acceder a user.getName() aquí — la sesión sigue abierta
    return new TransactionDTO(t.getId(), t.getAmount(), t.getUser().getName());
}
```

**Fix 2 — usar JOIN FETCH** cuando necesitas la relación cargada con la query:

```java
@Query("SELECT t FROM Transaction t JOIN FETCH t.user WHERE t.id = :id")
Optional<Transaction> findByIdWithUser(@Param("id") Long id);
```

Usar DTOs es la mejor solución — mantiene la capa del controlador limpia e impide que la entidad se filtre a la capa HTTP (véase [02-rest-controllers.md](02-rest-controllers.md) sobre el patrón DTO).

---

## Propagación de transacciones — REQUIRED (el valor por defecto)

Docs: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html

La propagación controla qué pasa cuando un método `@Transactional` llama a otro método `@Transactional`.

| Propagación | Comportamiento |
|-----------|----------|
| `REQUIRED` (por defecto) | Unirse a la transacción existente si hay una; crear una nueva si no |
| `REQUIRES_NEW` | Siempre iniciar una nueva transacción; suspender la existente |
| `SUPPORTS` | Unirse si hay una; ejecutarse sin transacción si no |

En la mayoría de casos nunca estableces la propagación explícitamente — el `REQUIRED` por defecto es correcto. El único caso donde necesitas `REQUIRES_NEW` es cuando quieres que una operación haga commit aunque la transacción exterior haga rollback. Ejemplo: escribir en un log de auditoría cuando falla una operación de negocio — quieres el registro de auditoría aunque la transacción principal haya hecho rollback.

---

## Error común — capturar la excepción dentro del método

Docs: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html → leer: "Rolling Back a Declarative Transaction"

`@Transactional` hace rollback en excepciones no comprobadas (que extienden `RuntimeException`) por defecto. Si capturas la excepción dentro del método y no la relanzas, Spring no la ve y no hace rollback:

```java
// Incorrecto — el catch engulle la excepción, Spring no ve ningún error, no hay rollback
@Transactional
public void createWithBalance(TransactionCreateDTO dto) {
    repository.save(mapper.toEntity(dto));
    try {
        accountService.updateBalance(dto.userId(), dto.amount());
    } catch (Exception e) {
        log.error("Balance update failed", e);  // excepción engullida — ¡sin rollback!
    }
}

// Correcto — dejar que las excepciones se propaguen para que @Transactional pueda hacer rollback
@Transactional
public void createWithBalance(TransactionCreateDTO dto) {
    repository.save(mapper.toEntity(dto));
    accountService.updateBalance(dto.userId(), dto.amount());
    // la excepción se propaga → @ControllerAdvice la captura → respuesta 500 → rollback de la transacción
}
```
