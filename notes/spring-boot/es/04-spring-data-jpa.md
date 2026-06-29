# Spring Data JPA

> 📖 [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/reference/)

## JPA vs Hibernate — la especificación vs la implementación

**JPA** (Jakarta Persistence API) es la especificación — define las anotaciones estándar (`@Entity`, `@Id`, `@ManyToOne`) e interfaces (`EntityManager`, `JpaRepository`). JPA por sí solo no ejecuta queries.

**Hibernate** es la implementación JPA más común — traduce tus clases anotadas a SQL real. Spring Boot usa Hibernate por defecto.

Escribes contra la especificación JPA; Hibernate hace el trabajo. Es el mismo patrón que `List<T>` (interfaz) vs `ArrayList<T>` (implementación) — dependes del contrato, no de la librería específica.

---

## @Entity — mapear una clase a una tabla

```java
@Entity
@Table(name = "transactions")     // opcional — por defecto es el nombre de la clase, en minúscula
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "transaction_date", nullable = false)
    private LocalDate date;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private TransactionType type;   // INCOME o EXPENSE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // constructores, getters, setters
}
```

**Anotaciones obligatorias:**
- `@Entity` — marca la clase como entidad JPA; Spring sabe que debe gestionarla
- `@Id` — marca el campo de clave primaria
- `@GeneratedValue(strategy = GenerationType.IDENTITY)` — la base de datos auto-incrementa el id (`SERIAL` / `BIGSERIAL` en PostgreSQL)

**Opcionales pero comunes:**
- `@Table(name = "...")` — sobreescribir el nombre de tabla por defecto; **convención: usa siempre plural en minúscula** (`users`, `projects`, `time_entries`) — evita conflictos con palabras reservadas y es el estándar en proyectos reales
- `@Column(nullable = false)` — marca la columna como NOT NULL en la base de datos
- `@Column(unique = true)` — añade una constraint única; combínala con `nullable = false` cuando el campo es obligatorio y debe ser único: `@Column(nullable = false, unique = true)`
- `@Column(...)` — otras propiedades: `length`, `name`, `updatable`
- `@CreationTimestamp` — anotación de Hibernate; establece el campo automáticamente a la fecha y hora actuales cuando la entidad se guarda por primera vez; nunca estableces este campo manualmente en tu código

**Valores por defecto de campo** — se establecen directamente en la declaración del campo; JPA respeta el valor por defecto al crear una nueva entidad:

```java
private Boolean active = true;   // los nuevos proyectos están activos por defecto
```
- `@PrePersist` — se ejecuta antes de que la entidad se inserte por primera vez

> **Trampa de palabra reservada:** `user` es una palabra reservada en PostgreSQL. Una clase llamada `User` sin `@Table` causa un error de sintaxis al arrancar. Usa siempre `@Table(name = "users")` para la entidad User. Lo mismo aplica a otras palabras reservadas como `order`, `group`, `table`. Convención: usa nombres de tabla en plural (`users`, `projects`) — esto evita la mayoría de conflictos.

**`@GeneratedValue` — opciones de strategy:**

| Strategy | Qué hace | Resultado en PostgreSQL |
|---|---|---|
| `@GeneratedValue` (sin strategy) | Usa `AUTO` — Hibernate elige la mejor strategy | Crea una secuencia compartida (`users_seq`) |
| `@GeneratedValue(strategy = GenerationType.IDENTITY)` | Usa el auto-incremento nativo de la BD | Usa columna `BIGSERIAL` |
| `@GeneratedValue(strategy = GenerationType.SEQUENCE)` | Usa una secuencia con nombre | Más control sobre la config de la secuencia |

`IDENTITY` es la elección más común en proyectos reales — usa el mecanismo nativo de la base de datos y genera ids de uno en uno. `AUTO` (por defecto) crea una secuencia que incrementa en 50, lo que puede dejar huecos en los ids.

---

## @Enumerated(EnumType.STRING) — persistencia segura de enums

Purpose: controla cómo JPA almacena un valor de enum en la base de datos. `STRING` guarda el nombre (`"MANAGER"`); `ORDINAL` (el valor por defecto) guarda el número de posición (`0`, `1`, `2`). Usa siempre `STRING`.

Docs: https://www.baeldung.com/jpa-enumerated-type → leer: "Mapping Enum to String" y el gotcha del ordinal

File: `src/main/java/com/victor/timetrack/model/User.java` y `TimeEntry.java`

```java
@Enumerated(EnumType.STRING)   // guarda "MANAGER" o "EMPLOYEE" en la columna
@Column(nullable = false)
private Role role;

@Enumerated(EnumType.STRING)   // guarda "DRAFT", "SUBMITTED", "APPROVED", "REJECTED"
private EntryStatus status;
```

**Por qué `ORDINAL` es peligroso — la trampa clásica:**

```java
// Tu enum hoy:
enum Role { EMPLOYEE, MANAGER }
// Almacenado como: 0=EMPLOYEE, 1=MANAGER

// Añades un nuevo rol en medio la semana que viene:
enum Role { EMPLOYEE, ADMIN, MANAGER }
// Ahora: 0=EMPLOYEE, 1=ADMIN, 2=MANAGER
// ¡Pero la BD sigue teniendo filas con valor 1 — ahora significan ADMIN, no MANAGER!
// Cada MANAGER existente se convirtió en ADMIN. Corrupción silenciosa de datos, sin error.
```

Con `STRING`, el valor almacenado es `"MANAGER"` — añadir un nuevo valor enum en medio nunca cambia lo que significan las filas existentes.

> **Los entrevistadores preguntan:** "¿Por qué usaste `EnumType.STRING` y no el valor por defecto?" — explica el riesgo de corrupción con ordinal. Esta es una de las preguntas que separa a los candidatos que entienden JPA de los que solo siguieron un tutorial.

---

## Timestamps automáticos — @CreationTimestamp, @UpdateTimestamp, @PrePersist

Casi nunca estableces `createdAt` / `updatedAt` a mano. Hay dos formas de rellenarlos automáticamente — un atajo de Hibernate y el callback estándar de JPA.

Docs: https://docs.jboss.org/hibernate/orm/current/javadocs/org/hibernate/annotations/CreationTimestamp.html → leer: "@CreationTimestamp" y "@UpdateTimestamp"

```java
@CreationTimestamp                 // Hibernate lo establece una vez, en el primer insert
private LocalDateTime createdAt;

@UpdateTimestamp                   // Hibernate lo refresca en cada update
private LocalDateTime updatedAt;
```

- `@CreationTimestamp` / `@UpdateTimestamp` son anotaciones de **Hibernate** (no JPA). Hibernate rellena el campo por ti — `createdAt` una vez cuando se inserta la fila, `updatedAt` en cada save.
- `@PrePersist` (y `@PreUpdate`) son los equivalentes estándar de **JPA** — callbacks de ciclo de vida que escribes tú mismo:

```java
@PrePersist
public void onCreate() {
    this.createdAt = LocalDateTime.now();
}
```

> ¿Cuál usar? `@CreationTimestamp` es menos código y es la elección común en proyectos Spring Boot. `@PrePersist` es portable (JPA puro, funciona con cualquier proveedor) y te permite ejecutar lógica extra, no solo establecer un timestamp. Los entrevistadores preguntan "¿estableciste `createdAt` manualmente?" — la buena respuesta es "no, `@CreationTimestamp` lo hace", y saber que `@PrePersist` es la alternativa estándar.

---

## JpaRepository — lo que obtienes gratis

El patrón que se repite: defines una interfaz; Spring genera la implementación.

```java
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Spring genera: save, findById, findAll, deleteById, count, existsById, etc.
}
```

Los dos parámetros de tipo: `Transaction` (tipo de entidad) y `Long` (tipo del campo `@Id`).

**Métodos built-in que más usas:**

```java
repository.save(transaction);          // insert o update
repository.findById(id);               // Optional<Transaction> — comprueba siempre si está vacío
repository.findAll();                  // List<Transaction>
repository.deleteById(id);             // delete por id
repository.existsById(id);             // true/false
repository.count();                    // total de filas
```

`findById` siempre devuelve `Optional<Transaction>`. Usa `.orElseThrow()` para gestionar el caso "not found":

```java
Transaction transaction = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
```

---

## Derived query methods

Spring Data JPA parsea el nombre del método y genera el SQL — sin implementación necesaria.

```java
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // findBy + nombre de campo → cláusula WHERE
    List<Transaction> findByType(TransactionType type);
    // SELECT * FROM transactions WHERE type = ?

    // Combinando condiciones
    List<Transaction> findByTypeAndUserId(TransactionType type, Long userId);
    // SELECT * FROM transactions WHERE type = ? AND user_id = ?

    // Ordenación
    List<Transaction> findByUserOrderByDateDesc(User user);
    // SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC

    // Comprobar existencia
    boolean existsByDescriptionAndUser(String description, User user);

    // Contar
    long countByType(TransactionType type);
}
```

**Patrón:** `findBy` + nombres de campo (PascalCase) + `And`/`Or` opcionales + `OrderBy` opcional + campo + `Asc`/`Desc`.

Cuando la convención de nomenclatura no es suficiente (joins complejos, agregados), usa `@Query` con JPQL:

```java
@Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND YEAR(t.date) = :year")
List<Transaction> findByUserIdAndYear(@Param("userId") Long userId, @Param("year") int year);
```

---

## Paginación — Pageable y Page<T>

Devolver todas las filas está bien en una demo y es peligroso en producción. `repository.findAll()` en una tabla con 100.000 filas las carga todas en memoria y las serializa a JSON en una sola respuesta — lento, y puede tumbar la app. La pregunta de entrevista es exactamente esta: "¿qué pasa si llamas a `findAll()` en una tabla enorme?"

Docs: https://docs.spring.io/spring-data/jpa/reference/repositories/query-methods-details.html → leer: "Paging, Iterating Large Results, Sorting & Limiting"

La solución está integrada en `JpaRepository`: acepta un `Pageable` y devuelve un `Page<T>`.

```java
// repositorio — JpaRepository ya declara findAll(Pageable); los derived queries también pueden usarlo
Page<Transaction> findByType(TransactionType type, Pageable pageable);
```

```java
// controlador — Spring construye el Pageable de ?page=0&size=20&sort=date,desc automáticamente
@GetMapping
public Page<TransactionResponse> getAll(Pageable pageable) {
    return service.getAll(pageable);
}

// service — Page tiene un map() para que conviertas entidades a DTOs sin perder los metadatos
public Page<TransactionResponse> getAll(Pageable pageable) {
    return repository.findAll(pageable).map(this::toResponse);
}
```

- `Pageable` describe *qué* página: número de página, tamaño y orden. Spring lo construye automáticamente de la query string (`?page=0&size=20&sort=date,desc`), así que no parseas nada tú mismo.
- `Page<T>` es el resultado: las filas de esa página **más** metadatos — `getTotalElements()`, `getTotalPages()`, `getNumber()`. El cliente Angular usa esos metadatos para renderizar el paginador.
- `PageRequest.of(0, 20)` es cómo construyes un `Pageable` a mano cuando no hay request (un test, un job programado).

> Bajo el capó Spring Data ejecuta dos queries: un `LIMIT ... OFFSET ...` para las filas de la página y un `COUNT(*)` para el total — así es como `Page` sabe `getTotalPages()`. En una tabla masiva puedes devolver `Slice<T>` en su lugar (sin query de conteo) cuando solo necesitas "¿hay una página siguiente?".

---

## Relaciones — @ManyToOne y @OneToMany

Un usuario tiene muchas transacciones. En la base de datos, la tabla `transactions` tiene una columna FK `user_id`. La regla: **la entidad cuya tabla tiene la columna FK recibe `@ManyToOne`**.

```java
// Transaction — el lado "muchos" — tiene la columna FK (user_id)
@Entity
public class Transaction {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")    // la columna FK en la tabla transactions
    private User user;
}

// User — el lado "uno" — sin columna FK, usa mappedBy para apuntar de vuelta a Transaction
@Entity
public class User {

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();
}
```

`mappedBy = "user"` le dice a JPA que el campo `user` en `Transaction` es dueño de la relación. JPA lee la columna FK desde ahí, no desde el lado `User`.

`cascade = CascadeType.ALL` — cuando guardas/borras un User, la operación se propaga a sus transacciones automáticamente.

### cascade vs orphanRemoval

Parecen similares pero responden preguntas diferentes:

- **`cascade = CascadeType.ALL`** — propaga una operación en el padre a sus hijos. Guarda el usuario → sus transacciones se guardan también; borra el usuario → sus transacciones se borran también.
- **`orphanRemoval = true`** — borra un hijo cuando se *elimina de la colección del padre*, incluso si nunca borras el padre: `user.getTransactions().remove(t)` → esa fila de transacción se borra.

> La distinción que quieren los entrevistadores: `cascade` es sobre operaciones que fluyen padre → hijo; `orphanRemoval` es sobre un hijo que ya no pertenece a ningún padre siendo eliminado. Usa `orphanRemoval` para hijos realmente propiedad del padre (un proyecto y sus time entries). Ten cuidado con `cascade = ALL` en `@ManyToOne` — rara vez quieres que borrar una transacción borre a su usuario.

---

## @ManyToMany — relaciones mediante una tabla de unión

`@ManyToOne` / `@OneToMany` modela "un usuario tiene muchas transacciones". `@ManyToMany` es para "muchos en ambos lados" — un `Project` puede tener muchos `User`s y un `User` puede trabajar en muchos `Project`s. Ninguna tabla puede contener la FK, así que JPA necesita una tercera tabla — una **join table** — que solo guarda pares de ids.

Docs: https://jakarta.ee/specifications/persistence/3.1/apidocs/jakarta.persistence/jakarta/persistence/manytomany → leer: "@ManyToMany" y "@JoinTable"

```java
@Entity
@Table(name = "projects")
public class Project {

    @ManyToMany
    @JoinTable(
        name = "project_members",                          // la join table
        joinColumns = @JoinColumn(name = "project_id"),    // FK de esta entidad en la join table
        inverseJoinColumns = @JoinColumn(name = "user_id") // FK de la otra entidad
    )
    private List<User> members = new ArrayList<>();
}

@Entity
@Table(name = "users")
public class User {

    @ManyToMany(mappedBy = "members")  // lado inverso — apunta al campo de arriba
    private List<Project> projects = new ArrayList<>();
}
```

- El lado con `@JoinTable` es el lado **dueño** — controla la join table. El lado con `mappedBy` es el lado inverso (misma regla de `mappedBy` que `@OneToMany`).
- La join table (`project_members`) tiene solo dos columnas: `project_id` y `user_id`. En el caso simple nunca creas una entidad para ella.

> **El gotcha que buscan los entrevistadores:** en el momento en que el enlace en sí necesita datos — *cuándo* se unió un usuario a un proyecto, o su rol en él — `@ManyToMany` no es suficiente. Lo reemplazas con una entidad de unión real (`ProjectMembership` con su propio `@Id`, `joinedAt`, `role`) y dos relaciones `@ManyToOne` apuntando a ella. "¿Y si la relación tiene atributos?" es la pregunta de seguimiento estándar.

---

## FetchType.LAZY vs FetchType.EAGER

| | LAZY | EAGER |
|---|------|-------|
| Cuándo se carga | Solo cuando accedes al campo | Inmediatamente con el padre |
| Por defecto para `@ManyToOne` | No (¡EAGER es el por defecto!) | — |
| Por defecto para `@OneToMany` | Sí | — |
| Rendimiento | Mejor — carga solo lo que necesitas | Puede disparar queries extra inesperadas |
| Cuándo usarlo | Casi siempre | Solo cuando siempre necesitas los datos relacionados |

**Declara siempre `FetchType.LAZY` explícitamente** — incluso en `@ManyToOne` donde EAGER es el sorprendente valor por defecto:

```java
@ManyToOne(fetch = FetchType.LAZY)   // LAZY explícito — no dejes el EAGER por defecto
@JoinColumn(name = "user_id")
private User user;
```

---

## El problema N+1

Este es uno de los errores de rendimiento más comunes en aplicaciones JPA.

```java
// Cargar 100 transacciones — 1 query
List<Transaction> transactions = repository.findAll();

// Acceder a user.getName() en cada una — 100 queries más (una por transacción)
for (Transaction t : transactions) {
    System.out.println(t.getUser().getName());  // la carga LAZY se dispara aquí, 1 query por item
}
// Total: 1 + 100 = 101 queries
```

**Fix — usa JOIN FETCH en un `@Query`** para cargar ambas entidades en una sola query:

```java
@Query("SELECT t FROM Transaction t JOIN FETCH t.user WHERE t.user.id = :userId")
List<Transaction> findAllWithUser(@Param("userId") Long userId);
// Total: 1 query
```

O usa `@EntityGraph` en el método del repositorio:

```java
@EntityGraph(attributePaths = {"user"})
List<Transaction> findAll();
```

---

## save() — insert o update

`save()` decide comprobando el campo `@Id`:
- `id == null` → **INSERT** (nueva entidad)
- `id != null` → **UPDATE** (merge de entidad existente)

```java
Transaction t = new Transaction();
t.setAmount(BigDecimal.valueOf(100));
repository.save(t);   // INSERT — id es null, JPA lo establece tras el insert

t.setAmount(BigDecimal.valueOf(200));
repository.save(t);   // UPDATE — id ya está establecido por la base de datos
```

No necesitas métodos separados `insert()` y `update()` — `save()` gestiona ambos.
