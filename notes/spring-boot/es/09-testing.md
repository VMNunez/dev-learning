# Testing en Spring Boot

> 📖 [Baeldung — Testing in Spring Boot](https://www.baeldung.com/spring-boot-testing)
> 📖 [Spring Boot Testing Reference](https://docs.spring.io/spring-boot/reference/testing/)

## El problema sin tests

Sin tests, encuentras los bugs en producción — o peor, el entrevistador los encuentra cuando haces la demo de tu proyecto. Más importante aún: las consultoras españolas en 2026 preguntan explícitamente si los candidatos saben escribir tests. Un proyecto sin tests es una señal de alarma.

El testing en Spring Boot no es una sola herramienta — son tres herramientas con una regla clara sobre cuándo usar cada una.

---

## La estrategia de testing por capas — una herramienta por capa

```
Capa           Herramienta               Qué carga Spring
─────────────────────────────────────────────────────────────
Controlador    @WebMvcTest               Solo capa web — sin BD
Service        JUnit 5 + Mockito         Nada — Java puro, más rápido
Repositorio    @DataJpaTest              JPA + H2 en memoria
Flujo completo @SpringBootTest           Todo — más lento
```

**La regla:** testea cada capa de forma aislada. Un test de service no debería arrancar un servidor web. Un test de controlador no debería conectarse a una base de datos. Usar la herramienta incorrecta desperdicia tiempo y hace que los fallos sean difíciles de localizar.

---

## JUnit 5 — el test runner

Docs: https://junit.org/junit5/docs/current/user-guide/#writing-tests-annotations → leer: la tabla de anotaciones

JUnit 5 es el framework de test Java estándar. Spring Boot lo incluye automáticamente a través de la dependencia `spring-boot-starter-test` — ya está en el `pom.xml` cuando generas el proyecto.

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

class TransactionServiceTest {

    @BeforeEach
    void setUp() {
        // se ejecuta antes de cada @Test — resetea el estado aquí
    }

    @Test
    void shouldReturnTransaction_whenFound() {
        // código del test aquí
    }

    @Test
    void shouldThrow_whenNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> {
            service.getById(999L);
        });
    }
}
```

**Anotaciones de ciclo de vida clave:**

| Anotación | Cuándo se ejecuta |
|---|---|
| `@Test` | Marca un método como test |
| `@BeforeEach` | Antes de cada test — resetea mocks, prepara datos |
| `@AfterEach` | Después de cada test — limpieza |
| `@BeforeAll` | Una vez antes de todos los tests de la clase (debe ser `static`) |

**Aserciones comunes:**

```java
assertEquals(expected, actual);        // los valores son iguales
assertNotNull(result);                 // el resultado no es null
assertTrue(result.isPresent());        // la condición es verdadera
assertFalse(result.isEmpty());         // la condición es falsa
assertThrows(SomeException.class, () -> { /* llamada que lanza */ });
```

---

## Testar un service — JUnit 5 + Mockito (sin Spring)

Docs: https://www.baeldung.com/mockito-annotations → leer: las secciones de `@Mock` e `@InjectMocks`

Este es el test más rápido que escribes. No cargas Spring en absoluto — creas el service con un repositorio mock pasado por el constructor, igual que funciona la inyección por constructor en producción.

```java
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)    // activa las anotaciones de Mockito
class TransactionServiceTest {

    @Mock
    TransactionRepository repository;  // Mockito crea un falso — devuelve null por defecto

    @InjectMocks
    TransactionService service;        // service real, con el mock inyectado

    @Test
    void getById_returnsDTO_whenFound() {
        // Arrange — decirle al mock qué devolver
        Transaction t = new Transaction(1L, BigDecimal.valueOf(50), "Lunch");
        when(repository.findById(1L)).thenReturn(Optional.of(t));

        // Act
        TransactionDTO result = service.getById(1L);

        // Assert
        assertEquals(1L, result.id());
        assertEquals(BigDecimal.valueOf(50), result.amount());
    }

    @Test
    void getById_throws_whenNotFound() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.getById(999L));
    }
}
```

> **Qué hace realmente `@ExtendWith(MockitoExtension.class)`.** JUnit 5 no sabe por sí solo qué significan `@Mock` o `@InjectMocks` — son anotaciones de Mockito, no de JUnit. `@ExtendWith` conecta una *extensión* de JUnit 5 al ciclo de vida del test; `MockitoExtension` es ese conector para Mockito. Antes de que se ejecute cada test, escanea la clase buscando campos `@Mock` y crea un falso para cada uno, luego busca `@InjectMocks` y construye ese objeto, pasándole los falsos que acaba de crear — la misma inyección por constructor que usa Spring en producción, solo que aquí la monta Mockito en lugar de Spring. Sin `@ExtendWith(MockitoExtension.class)`, cada campo `@Mock` se queda en `null` y el test falla con una `NullPointerException` en la primera llamada.

**Arrange / Act / Assert** — estructura siempre los tests así:
- **Arrange** — configura los datos de test y el comportamiento del mock
- **Act** — llama al método que estás testeando
- **Assert** — comprueba el resultado

**¿Por qué no llamar a `repository.findById()` en un test de service sin mocking?** Porque `repository` es un bean generado por Spring — solo existe cuando Spring está ejecutándose. Sin un mock, el test fallaría con una `NullPointerException` antes de llegar siquiera a tu código.

---

## Mockito — los métodos más útiles

Docs: https://www.baeldung.com/mockito-behavior → leer: las secciones de `when()`/`thenReturn()` y `verify()`

```java
// Hacer que el mock devuelva algo
when(repository.findById(1L)).thenReturn(Optional.of(transaction));
when(repository.findAll()).thenReturn(List.of(t1, t2));

// Hacer que el mock lance una excepción
when(repository.findById(999L)).thenThrow(new ResourceNotFoundException("Transaction", 999L));

// Hacer que un método void lance una excepción — when().thenThrow() no funciona aquí, no hay valor de retorno al que encadenar
doThrow(new ResourceNotFoundException("Transaction", 999L)).when(repository).deleteById(999L);

// Verificar que se llamó a un método
verify(repository).save(any(Transaction.class));
verify(repository, times(1)).deleteById(1L);
verify(repository, never()).delete(any());

// Matchers — cuando no te importa el valor exacto
when(repository.findById(anyLong())).thenReturn(Optional.empty());
```

> **`any()` y `anyLong()` son matchers de Mockito.** Coinciden con cualquier argumento del tipo dado. Úsalos cuando el valor exacto no importa para lo que estás testeando.

---

## @WebMvcTest — solo capa de controlador

Docs: https://www.baeldung.com/spring-boot-testing → leer: la sección de `@WebMvcTest`

Carga solo la capa web: controladores, filtros y `@ControllerAdvice`. Los services y repositorios no se cargan — los reemplazas con `@MockBean`.

```java
@WebMvcTest(TransactionController.class)
class TransactionControllerTest {

    @Autowired
    MockMvc mockMvc;               // simula requests HTTP sin un servidor real

    @MockBean
    TransactionService service;    // reemplaza el service real en el contexto de Spring

    @Test
    void getAll_returns200_withList() throws Exception {
        TransactionDTO dto = new TransactionDTO(1L, BigDecimal.valueOf(50), "Lunch", LocalDate.now(), "food");
        when(service.getAll()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/transactions"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].amount").value(50));
    }

    @Test
    void create_returns400_whenAmountMissing() throws Exception {
        mockMvc.perform(post("/api/transactions")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"description": "Lunch", "category": "food", "date": "2026-05-01"}"""))
            .andExpect(status().isBadRequest());
    }
}
```

**Qué testear con @WebMvcTest:**
- Códigos de estado HTTP correctos (200, 201, 400, 404)
- Forma del JSON de respuesta (`jsonPath("$.field").value(...)`)
- La validación rechaza input inválido (devuelve 400)
- `@ControllerAdvice` mapea excepciones al código de estado correcto

> **¿Por qué no llamar al método del controlador directamente?** Porque el comportamiento del controlador depende del mapping de requests de Spring, la serialización de Jackson y `@ControllerAdvice`. Llamar al método evita todo eso. `MockMvc` testea el stack HTTP completo sin un servidor real.

**@MockBean vs @Mock:**

| | Dónde | Qué hace |
|---|---|---|
| `@Mock` | JUnit + Mockito puro (sin Spring) | Crea un falso de Mockito |
| `@MockBean` | Dentro de `@WebMvcTest` o `@SpringBootTest` | Crea un falso de Mockito Y reemplaza el bean de Spring |

Usa `@MockBean` siempre que Spring esté involucrado. Usa `@Mock` para tests de service puros.

---

## @SpringBootTest — test de integración completo

Docs: https://www.baeldung.com/spring-boot-testing → leer: la sección de `@SpringBootTest`

Carga todo el contexto de la aplicación: todos los beans, auto-configuración y una conexión real a la base de datos. Úsalo para los flujos críticos — verificar que un POST request realmente escribe una fila en la base de datos.

```java
@SpringBootTest
@AutoConfigureMockMvc
class TransactionIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    TransactionRepository repository;

    @Test
    void createTransaction_savesToDatabase() throws Exception {
        mockMvc.perform(post("/api/transactions")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"amount": 50.00, "description": "Lunch", "category": "food", "date": "2026-05-01"}
            """))
            .andExpect(status().isCreated());

        assertEquals(1, repository.count());
    }
}
```

**Cuándo usarlo:** solo para los flujos críticos — login, registro, escrituras clave. No para cada método.

> **Lento pero real.** @SpringBootTest arranca la aplicación completa. Captura bugs que los tests unitarios no detectan — SQL incorrecto, `@Transactional` que falta, seguridad mal configurada. Úsalo con moderación porque es 10–100× más lento que un @WebMvcTest.

---

## @DataJpaTest — solo capa de repositorio

Docs: https://www.baeldung.com/spring-boot-testing → leer: la sección de `@DataJpaTest`

Carga solo entidades JPA, repositorios y una base de datos H2 en memoria. No carga controladores ni services.

```java
@DataJpaTest
class TransactionRepositoryTest {

    @Autowired
    TransactionRepository repository;

    @Test
    void findByType_returnsOnlyExpenses() {
        Transaction expense = new Transaction(null, BigDecimal.valueOf(50), "Lunch", TransactionType.EXPENSE, null);
        Transaction income = new Transaction(null, BigDecimal.valueOf(2000), "Salary", TransactionType.INCOME, null);
        repository.saveAll(List.of(expense, income));

        List<Transaction> result = repository.findByType(TransactionType.EXPENSE);

        assertEquals(1, result.size());
        assertEquals("Lunch", result.get(0).getDescription());
    }
}
```

**Cuándo usarlo:** para verificar que los derived query methods y los métodos `@Query` devuelven los datos correctos.

> **H2 no es PostgreSQL.** `@DataJpaTest` usa H2 (en memoria) por defecto — es rápido pero no idéntico a PostgreSQL. Si tu query usa sintaxis específica de PostgreSQL (como `RETURNING` o SQL nativo), el test puede pasar en H2 pero fallar en la base de datos real. Para queries que te importan, ejecuta un test de integración contra PostgreSQL real.

---

## Qué detecta cada tipo de test

| Qué salió mal | @WebMvcTest | JUnit+Mockito | @DataJpaTest | @SpringBootTest |
|---|:---:|:---:|:---:|:---:|
| Mapeo de URL incorrecto | ✓ | | | ✓ |
| Código de estado HTTP incorrecto | ✓ | | | ✓ |
| Regla de validación incorrecta | ✓ | | | ✓ |
| Lógica de negocio incorrecta | | ✓ | | ✓ |
| Query SQL incorrecta | | | ✓ | ✓ |
| @Transactional que falta | | | | ✓ |
| Seguridad mal configurada | | | | ✓ |

Lee un ✓ como "este tipo de test realmente falla si se introduce este bug" — una celda vacía no significa que esa capa esté a salvo del bug, significa que ese tipo de test no tiene forma de detectarlo aunque esté presente (por ejemplo, un test de service `JUnit+Mockito` no puede detectar un mapeo de URL incorrecto, porque nunca toca la capa web).

Por eso se necesitan tanto tests unitarios como de integración — detectan diferentes tipos de bugs. Un @WebMvcTest que pasa no garantiza que la lógica de negocio sea correcta.

---

## El mínimo para el proyecto 07

1. Un test de service `@ExtendWith(MockitoExtension.class)` — al menos el happy path de `getById` y el caso not-found
2. Un test de controlador `@WebMvcTest` — al menos GET list (200) y POST inválido (400)
3. Un test de integración `@SpringBootTest` — al menos un flujo create completo (POST → fila en BD)

Esto es lo que se espera que entregue un desarrollador junior. Tests en tres capas, un test por caso crítico por capa.
