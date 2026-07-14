# Spring Data JPA

> 📖 [Baeldung — Introduction to Spring Data JPA](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa)
> 📖 [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/reference/)

## JPA vs Hibernate — la especificación vs la implementación

**JPA** (Jakarta Persistence API) es la especificación — define las anotaciones estándar (`@Entity`, `@Id`, `@ManyToOne`) e interfaces (`EntityManager`, `JpaRepository`). JPA por sí solo no ejecuta queries.

**Hibernate** es la implementación JPA más común — traduce tus clases anotadas a SQL real. Spring Boot usa Hibernate por defecto.

Escribes contra la especificación JPA; Hibernate hace el trabajo. Es el mismo patrón que `List<T>` (interfaz) vs `ArrayList<T>` (implementación) — dependes del contrato, no de la librería específica.

---

## @Entity — mapear una clase a una tabla

Docs: https://www.baeldung.com/jpa-entities

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
- `@Table(name = "...")` — sobreescribir el nombre de tabla por defecto; **convención: usa siempre plural en minúscula** (`users`, `projects`, `time_entries`) — evita conflictos con palabras reservadas y es el estándar en proyectos reales. Es un desajuste deliberado con el nombre de la clase: la clase Java se queda en singular (`User`, `TimeEntry`) porque representa **una** instancia — un objeto, una fila. La tabla va en plural porque contiene una **colección** de esas filas. La misma separación aparece en `@JoinColumn`: el campo es un objeto singular (`private Project project`), pero la columna que genera se llama según lo que guarda — una foreign key, ej. `project_id` — nunca según el nombre del campo ni el de la clase relacionada.
- `@Column(nullable = false)` — marca la columna como NOT NULL en la base de datos
- `@Column(unique = true)` — añade una constraint única; combínala con `nullable = false` cuando el campo es obligatorio y debe ser único: `@Column(nullable = false, unique = true)`
- `@Column(...)` — otras propiedades: `length`, `name`, `updatable`
- `@CreationTimestamp` — anotación de Hibernate; asigna automáticamente al campo la fecha y hora actuales cuando la entidad se guarda por primera vez; nunca rellenas este campo manualmente en tu código

**Valores por defecto de campo** — se establecen directamente en la declaración del campo; JPA respeta el valor por defecto al crear una nueva entidad:

```java
private Boolean active = true;   // los nuevos proyectos están activos por defecto

@Enumerated(EnumType.STRING)
private EntryStatus status = EntryStatus.DRAFT;   // las nuevas entradas empiezan como DRAFT
```

El caso del enum es una trampa habitual: `status = 'DRAFT'` (comillas simples) no compila — `'DRAFT'` parece un literal `char`, pero tiene 5 caracteres, lo cual no es válido. Una constante de enum nunca es un string ni un char; siempre se referencia a través del propio tipo enum: `EntryStatus.DRAFT`.
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

Propósito: controla cómo JPA almacena un valor de enum en la base de datos. `STRING` guarda el nombre (`"MANAGER"`); `ORDINAL` (el valor por defecto) guarda el número de posición (`0`, `1`, `2`). Usa siempre `STRING`.

Docs: https://www.baeldung.com/jpa-enumerated-type → leer: "Mapping Enum to String" y el gotcha del ordinal

Archivo: `src/main/java/com/victor/timetrack/model/User.java` y `TimeEntry.java`

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

// La semana que viene añades un nuevo rol en medio:
enum Role { EMPLOYEE, ADMIN, MANAGER }
// Ahora: 0=EMPLOYEE, 1=ADMIN, 2=MANAGER
// ¡Pero la BD sigue teniendo filas con valor 1 — ahora significan ADMIN, no MANAGER!
// Cada MANAGER existente se convirtió en ADMIN. Corrupción silenciosa de datos, sin error.
```

Con `STRING`, el valor almacenado es `"MANAGER"` — añadir un nuevo valor enum en medio nunca cambia lo que significan las filas existentes.

> **Los entrevistadores preguntan:** "¿Por qué usaste `EnumType.STRING` y no el valor por defecto?" — explica el riesgo de corrupción con ordinal. Esta es una de las preguntas que separa a los candidatos que entienden JPA de los que solo siguieron un tutorial.

---

## Añadir una columna NOT NULL a una tabla que ya tiene filas — @ColumnDefault

Propósito: `@ColumnDefault` hace que Hibernate añada una cláusula `DEFAULT` al `ALTER TABLE` que genera, para que PostgreSQL tenga un valor con el que rellenar las filas ya existentes. Sin esto, añadir una columna obligatoria (`NOT NULL`) a una tabla que ya tiene datos falla directamente.

Docs: https://www.baeldung.com/hibernate-column-default-value → leer: "Using @ColumnDefault"

Archivo: `src/main/java/com/victor/timetrack/model/User.java`

```java
@ColumnDefault("true")
private boolean active;
```

**Por qué la columna `NOT NULL` a secas falla:**

```
Hibernate: alter table if exists users add column active boolean not null
ERROR: column "active" of relation "users" contains null values
```

Añadir una columna empieza siempre igual para cada fila existente: la celda nueva no tiene nada dentro, así que el primer instinto de la base de datos es poner `NULL` ahí. Pero `NOT NULL` prohíbe exactamente ese valor. Las dos reglas se contradicen — "rellena esto con `NULL`" contra "esto nunca puede ser `NULL`" — y PostgreSQL aborta el `ALTER TABLE` entero antes que dejar la tabla en un estado roto. Esto no tiene nada que ver con que tu código Java esté mal; es un vacío de información real: nunca le dijiste a la base de datos qué debían tener las filas viejas en esa columna.

**Cómo `@ColumnDefault` cierra ese vacío:**

```
Hibernate: alter table if exists users add column active boolean not null default true
```

Con `DEFAULT true` dentro de la misma sentencia, PostgreSQL ya tiene respuesta a "¿qué pongo en las filas viejas?" — rellena cada fila existente con `true` y añade la columna en un solo paso atómico. Sin contradicción, sin migración de datos manual.

`@ColumnDefault` recibe un **`String`**, no un valor Java tipado — su trabajo es pegar texto SQL literal después de `DEFAULT` en el DDL generado, no representar un booleano de Java. Por eso la misma anotación sirve para cualquier tipo de columna, con las reglas de comillas de SQL, no de Java:

```java
@ColumnDefault("0")           // literal numérico — SQL no necesita comillas
@ColumnDefault("true")        // literal booleano — SQL no necesita comillas
@ColumnDefault("'PENDING'")   // literal de texto/enum — SQL exige comillas simples alrededor del texto
```

> Es una anotación específica de Hibernate (`org.hibernate.annotations.ColumnDefault`), no forma parte de la especificación JPA — misma categoría que `@CreationTimestamp` de arriba: una comodidad que Hibernate añade encima del estándar.

> **Los entrevistadores preguntan:** "¿Qué pasa cuando añades una columna obligatoria a una tabla con datos existentes?" — la respuesta es exactamente este trade-off: o le das a la columna un `DEFAULT` para que la base de datos pueda rellenarla, o la dejas nullable y rellenas los datos tú mismo antes de apretar la restricción más adelante.

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

Docs: https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa → leer: la sección de `JpaRepository`

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

Docs: https://www.baeldung.com/spring-data-derived-queries

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

Docs: https://www.baeldung.com/hibernate-one-to-many

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

Docs: https://www.baeldung.com/hibernate-lazy-eager-loading

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

Docs: https://www.baeldung.com/spring-data-jpa-n-plus-1-problem

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

Docs: https://www.baeldung.com/jpa-persist-merge → leer: el contraste con el comportamiento insert-o-update de `save()`

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

---

## Queries de agregación y proyecciones por interfaz

Todos los métodos de repositorio que has visto hasta ahora devuelven entidades — `Transaction`, `List<Transaction>`, `Page<Transaction>`. Pero un informe como "total de horas por proyecto este mes" no es una entidad. No existe una tabla `Report`, ni un `@Id`, ni una fila única que pudieras guardar con `save()` — es un resultado **calculado**: una fila por proyecto, con un `SUM()` de una columna de otra tabla relacionada. Devolver un `List<Project>` para esto no tiene sentido — un `Project` no tiene un campo `totalHours`, y no debería tenerlo, porque ese número depende de un rango de fechas que eliges en el momento de la petición, no de nada guardado en el propio proyecto.

**Propósito:** una proyección por interfaz le dice a Spring Data JPA la *forma* de un resultado calculado — qué campos existen y de qué tipo son — sin que tengas que escribir una clase ni ningún código de mapeo. Spring genera la implementación por ti en tiempo de ejecución.

**Archivo:** `src/main/java/com/victor/timetrack/dto/response/ProjectHoursReportResponse.java`

**Docs:** https://www.baeldung.com/spring-data-jpa-projections → leer: "Interface-based Projections"

```java
public interface ProjectHoursReportResponse {
    String getProjectName();
    BigDecimal getTotalHours();
}
```

> **¿Por qué la interfaz solo tiene dos métodos si el informe devuelve varios proyectos?** No confundas la *lista* con la *forma de una fila*. `List<ProjectHoursReportResponse>` es lo que representa "cuántas filas hay" — un elemento por cada proyecto que tuvo entries en el rango. `ProjectHoursReportResponse` en sí describe la forma de **una sola** de esas filas — los dos campos que necesita cada fila, no "dos filas en total". Spring instancia un objeto proxy por cada fila que devuelve la query; cada uno de esos objetos implementa la interfaz, así que todos tienen disponibles `getProjectName()` y `getTotalHours()` — pero llamar a `getProjectName()` sobre el objeto construido a partir de la fila 1 devuelve `"TimeTrack"`, mientras que llamarlo sobre el objeto de la fila 2 devuelve `"Marketing"`. Mismos dos métodos en cada objeto (el contrato fijo), distintos valores por objeto (porque cada uno se construye a partir de una fila distinta). Es exactamente la misma relación que ya conoces entre una clase normal y sus instancias: `new Project()` dos veces te da dos objetos que comparten el mismo método `getName()` pero cada uno devuelve su propio dato — la única diferencia aquí es que tú nunca escribes `new`, lo hace Spring una vez por fila.
>
> **¿Por qué una interfaz y no una clase con `@Data`, como el resto de DTOs de respuesta de este proyecto?** Cualquier otro DTO (`ProjectResponse`, `UserResponse`...) es una clase que tú mismo instancias — escribes `new ProjectResponse()` (o lo hace un mapper) y rellenas cada campo a mano en tu propio código Java. Una proyección es distinta: **tú nunca la construyes**. Spring Data lee los alias de columna que devuelve la query (`SUM(te.hours) AS totalHours`) y, como Java puede generar en tiempo de ejecución un objeto proxy que implemente cualquier interfaz, construye sobre la marcha un objeto cuyo `getTotalHours()` devuelve exactamente el valor de esa columna — sin cuerpo de clase, sin constructor, sin mapeo manual. Una `class` no se puede construir así porque necesitaría un constructor que Spring tendría que llamar con los argumentos correctos en el orden correcto; una interfaz solo promete "existe algo con este método", que es todo lo que necesita un proxy generado en tiempo de ejecución.

**El contrato alias-getter — este es el mecanismo real, no solo una convención:**

Spring empareja cada getter con un alias de columna usando la regla estándar de nomenclatura de Java Beans: quita `get` del nombre del método, pon en minúscula la primera letra, y ese es el nombre que busca entre los alias de la query.

```
getProjectName()   →   busca el alias "projectName"
getTotalHours()    →   busca el alias "totalHours"
```

Por eso exactamente la query JPQL de abajo escribe `AS projectName` y `AS totalHours` — esas cadenas no son decoración, son el contrato literal del que depende la interfaz. Si renombras un getter a `getHours()` sin renombrar el alias a `hours`, ese campo vuelve silenciosamente `null` — Spring no da ningún error, porque desde su punto de vista "no hay ningún alias llamado `hours`" es un caso perfectamente válido (el campo simplemente no está establecido).

> **MAL** — el alias y el nombre del getter no coinciden, sin error, bug silencioso:
> ```java
> // la interfaz tiene getTotalHours()
> // la query dice:
> SELECT te.project.name AS projectName, SUM(te.hours) AS hours   // ← "hours", no "totalHours"
> // resultado: report.getTotalHours() siempre devuelve null, y nada te avisa por qué
> ```
> **BIEN** — el alias coincide exactamente con el nombre del getter:
> ```java
> SELECT te.project.name AS projectName, SUM(te.hours) AS totalHours
> ```

### La query de agregación en sí — SUM + GROUP BY en JPQL

JPQL (Jakarta Persistence Query Language) se parece a SQL pero consulta tus **entidades y sus campos**, no tablas y columnas directamente — `te.project.name` recorre el grafo de objetos Java (`TimeEntry.project.name`), y Hibernate traduce ese camino al join SQL correspondiente por ti.

```java
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {

    @Query("""
        SELECT te.project.name AS projectName, SUM(te.hours) AS totalHours
        FROM TimeEntry te
        WHERE te.date BETWEEN :start AND :end
        GROUP BY te.project.name
        """)
    List<ProjectHoursReportResponse> getHoursByProject(
        @Param("start") LocalDate start,
        @Param("end") LocalDate end
    );
}
```

- `SUM(te.hours)` — una función de agregación de JPQL; funciona igual que `SUM()` en SQL puro, sumando `hours` de cada fila de `TimeEntry` que cumple el `WHERE`, dentro de cada grupo.
- `GROUP BY te.project.name` — **esto es lo que convierte muchas filas en una fila por proyecto.** Sin él, `SUM()` colapsaría *todo* el resultado en un único total mezclando todos los proyectos. `GROUP BY` le dice a la base de datos "primero divide las filas que cumplen el `WHERE` en cubos según este valor, y luego agrega dentro de cada cubo por separado" — un cubo por cada `project.name` distinto, un resultado de `SUM()` por cubo.

  Ejemplo con datos concretos — imagina que el `WHERE` deja estas tres filas de `TimeEntry` de mayo de 2025:

  ```
  TimeTrack  — 3h
  TimeTrack  — 5h
  Marketing  — 2h
  ```

  `GROUP BY te.project.name` las reparte en dos cubos según el nombre del proyecto, y `SUM(te.hours)` se calcula **por separado dentro de cada cubo**:

  ```
  cubo "TimeTrack":  3 + 5  →  totalHours = 8
  cubo "Marketing":  2      →  totalHours = 2
  ```

  Resultado final: dos filas — `{projectName: "TimeTrack", totalHours: 8}` y `{projectName: "Marketing", totalHours: 2}`. Sin `GROUP BY` obtendrías una sola fila con `totalHours = 10` (todo sumado junto, sin distinguir proyecto).
- `WHERE te.date BETWEEN :start AND :end` — el filtro por mes. `TimeEntry` no tiene un campo `month` (solo `date`, un `LocalDate`), así que "mayo de 2025" tiene que convertirse en un rango: el primer y el último día de ese mes. Esto es justo lo que `YearMonth` (ver el callout de abajo) está pensado para producir.
- `List<ProjectHoursReportResponse>` como tipo de retorno es lo que le indica a Spring Data que construya objetos proxy de esa interfaz a partir del resultado — no entidades.

> **Cómo leer la tabla de abajo:** cada fila empareja una cláusula JPQL con la pregunta en lenguaje llano que responde sobre el resultado final — útil cuando una query de informe deja de devolver lo esperado y necesitas comprobar cada cláusula por separado.

| Cláusula | Pregunta que responde |
|---|---|
| `SELECT ... AS alias` | ¿Qué columnas vuelven, y a qué getter se mapean? |
| `WHERE` | ¿Qué filas se tienen en cuenta, antes de cualquier agrupación? |
| `GROUP BY` | ¿Cómo se dividen en cubos las filas que sobreviven? |
| `SUM(...)` (dentro de `SELECT`) | ¿Qué se calcula *dentro* de cada cubo? |

### De `?month=2025-05` a un rango de fechas — YearMonth

El controller recibe `month=2025-05` como parámetro de query string. `java.time.YearMonth` representa exactamente eso — un año más un mes, sin día — y Spring puede vincularlo directamente desde el query string porque su formato de `toString()`/parsing es la misma forma ISO (`yyyy-MM`) que ya usa la URL, así que no hace falta ningún conversor personalizado. El único trabajo del controller es recibir ese `YearMonth` y pasárselo al service — convertirlo en un rango de fechas real es lógica de negocio (decidir *cómo* un mes se traduce a fechas concretas), así que vive en el service, siguiendo el mismo reparto de arquitectura por capas que usas en todo el proyecto: **el controller recibe, el service decide, el repositorio consulta.**

```java
// service — TimeEntryService.java
public List<ProjectHoursReportResponse> getHoursByProject(YearMonth month) {
    LocalDate start = month.atDay(1);          // 2025-05-01
    LocalDate end = month.atEndOfMonth();       // 2025-05-31 (gestiona bien 28/29/30/31)
    return timeEntryRepository.getHoursByProject(start, end);
}
```

`atDay(1)` y `atEndOfMonth()` son **métodos de instancia de `YearMonth`** — operan sobre el año-mes concreto que contiene ese objeto (mayo de 2025 en este ejemplo), igual que un `String` tiene métodos de instancia como `.toUpperCase()` que operan sobre el texto que contiene. La diferencia aquí está en el **tipo de retorno**: estos dos métodos no devuelven otro `YearMonth`, devuelven un `LocalDate` — un método puede devolver un tipo distinto al de la clase a la que pertenece; nada obliga a que los métodos de `YearMonth` devuelvan más valores `YearMonth`.

```
month.atDay(1)         →  LocalDate  (el día 1 de ese año-mes)
month.atEndOfMonth()   →  LocalDate  (el último día — 28/29/30/31, resuelto automáticamente)
```

> **¿Por qué no simplemente tratar `month` como un `String` y trocearlo?** Podrías dividir `"2025-05"` por el `-` y construir un `LocalDate` a mano, pero entonces los casos límite son cosa tuya — ¿cuántos días tiene mayo? ¿Sigue funcionando bien la app en un febrero bisiesto? `YearMonth.atEndOfMonth()` ya conoce la respuesta para cada mes, incluyendo 28 vs 29 de febrero, así que la lógica del calendario nunca hay que razonarla a mano.

**Por qué `@PreAuthorize("hasRole('MANAGER')")` aquí en concreto:** los informes agregan horas de todo el equipo, no solo las entries propias del que llama — la misma regla de concepto de repaso ya usada en `GET /api/users` y en los endpoints de mutación de proyectos (ver el patrón de callout de palabra reservada más arriba): cualquier endpoint que exponga datos más allá de "los míos" necesita una comprobación de rol explícita, porque el filtro JWT de Spring Security solo demuestra *quién* llama, nunca *qué* tiene permiso de ver.
