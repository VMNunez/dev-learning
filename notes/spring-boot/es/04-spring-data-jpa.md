# Spring Data JPA

> 📖 [Baeldung — Introduction to Spring Data JPA](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa)
> 📖 [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/reference/)

---

[03-inyeccion-dependencias.md](./03-inyeccion-dependencias.md) se cerró con un bean que no debería existir. `TimeEntryRepository` es una **interfaz**. No tiene cuerpo, ni `@Repository`, ni `@Component`, y no hay ninguna clase en todo TimeTrack que la implemente — y aun así el constructor de `TimeEntryService` pide una, Spring encuentra una, y `findByUser(user)` devuelve filas reales de PostgreSQL. Un contenedor que solo instancia clases que *tú* escribiste no puede explicar esto.

Esto es lo que ocurre de verdad al arrancar. Spring Boot ve `spring-boot-starter-data-jpa` en el classpath y activa el **escaneo de repositorios de Spring Data**: recorre tus paquetes buscando no *clases* anotadas, sino **interfaces que extienden `Repository`** (que es justo lo que hace `JpaRepository`, varios niveles por encima). Por cada una que encuentra, hace dos cosas:

```
1. FIND       TimeEntryRepository  extends JpaRepository<TimeEntry, Long>
                                                          ↑        ↑
                                            la entidad ───┘        └─── su tipo @Id
2. GENERATE   un objeto proxy que implementa esa interfaz, en tiempo de ejecución, en memoria
                 · métodos declarados por JpaRepository (save, findById, findAll…)
                   → delegan en SimpleJpaRepository, que llama al EntityManager
                 · métodos que TÚ declaraste (findByUser, findByActiveTrue…)
                   → el NOMBRE del método se parsea en una query (ver "Derived query methods")
                 · métodos con @Query
                   → se usa directamente la cadena JPQL que escribiste
3. REGISTER   registra ese proxy en el ApplicationContext bajo "timeEntryRepository"
```

Así que el objeto que Spring inyecta no es una instancia de una clase en tu árbol de código fuente — es un **proxy**, una clase sintetizada en memoria al arrancar cuya única función es implementar tu interfaz. Por eso no hay ningún archivo que abrir, ningún `new` que buscar, y ningún `@Repository` necesario: esa anotación existe para registrar una clase que *tú* escribiste, y aquí no hay ninguna clase. (La traducción de excepciones que normalmente aporta `@Repository` se aplica igualmente sobre el proxy — Spring Data lo hace por ti. Ese era el cabo suelto que quedó en el archivo 03.)

Todo lo demás en este archivo se deriva de esos tres pasos. El paso 1 necesita una **entidad** — una clase mapeada a una tabla, que es lo que hace `@Entity`. El paso 2 necesita una forma de convertir Java en SQL — eso es Hibernate. Empecemos por ahí.

---

## JPA vs Hibernate — la especificación vs la implementación

Propósito: separar los dos nombres que verás usados como si fueran intercambiables — uno es un conjunto de interfaces contra las que programas, el otro es el motor que de verdad produce SQL — porque cualquier pregunta del tipo "¿por qué Hibernate generó *esa* query?" depende de saber cuál de los dos está haciendo el trabajo.

Archivo: `src/main/java/com/victor/timetrack/model/TimeEntry.java` — cada anotación en ella (`@Entity`, `@Id`, `@ManyToOne`, `@Column`) es JPA; `@CreationTimestamp` y `@UpdateTimestamp`, justo al lado, son Hibernate

Docs: https://www.baeldung.com/jpa-hibernate-difference → leer: "JPA" y "Hibernate" — qué define la especificación frente a qué añade la implementación

**JPA** (Jakarta Persistence API) es una **especificación**: un conjunto de interfaces y anotaciones, más un contrato escrito que describe qué debe hacer una implementación con ellas. `@Entity`, `@Id`, `@Column`, `@ManyToOne`, `EntityManager` — todo eso es JPA. Envía una app con solo el jar de JPA en el classpath y no pasa nada: una especificación no contiene ninguna lógica de persistencia ejecutable. Es un contrato, no un motor.

**Hibernate** es el motor — la implementación de JPA más usada, y la que `spring-boot-starter-data-jpa` incluye por defecto. Es lo que lee tus anotaciones y emite SQL.

```
tu código   →   anotaciones/interfaces JPA   →   Hibernate   →   JDBC   →   PostgreSQL
(TimeEntry)     (el contrato: @Entity, @Id)     (el motor)     (driver)   (la base de datos)
```

Ya conoces esta forma de Java puro: declaras `List<String> names` (la interfaz) y en tiempo de ejecución obtienes un `ArrayList` (la implementación). El mismo movimiento, una capa más arriba — tu código nombra el contrato, el framework aporta el motor.

**Cómo convierte Hibernate una anotación en SQL, de verdad.** Esta es la parte que normalmente se salta, y es lo que hace que las queries generadas dejen de parecer arbitrarias. Al arrancar, Hibernate hace una pasada de **bootstrap**, y en tiempo de ejecución, una pasada de **traducción**:

1. **Bootstrap (una vez, al arrancar).** Hibernate escanea las clases que llevan `@Entity` y lee sus anotaciones **por reflexión** — el mismo mecanismo que permite a Java inspeccionar los campos de una clase y sus anotaciones en tiempo de ejecución, sin que la clase le diga nada por su cuenta. A partir de eso construye un **metamodelo** en memoria: una estructura de datos que registra, para cada entidad, "la clase Java `TimeEntry` ↔ la tabla `time_entries`; el campo `date` ↔ la columna `date`, tipo `LocalDate` → SQL `date`, `NOT NULL`; el campo `project` ↔ una columna foreign key `project_id` que apunta a `projects.id`". Nada ha tocado todavía la base de datos — esto es Hibernate construyendo su propio mapa de tu dominio.

   ```
   TimeEntry.java  ──reflexión──▶  entrada del metamodelo
     @Table(name="time_entries")      tabla:   time_entries
     @Id Long id                      pk:      id (bigint)
     @Column(nullable=false)          columna: date (date, NOT NULL)
     LocalDate date
     @ManyToOne @JoinColumn(          columna: project_id (bigint) → FK projects(id)
       name="project_id")
     Project project
   ```

2. **Traducción (en cada operación).** Cuando tu código llama a `timeEntryRepository.save(entry)`, Hibernate nunca vuelve a inspeccionar las anotaciones — busca la entidad en ese metamodelo y **ensambla una cadena SQL a partir de él**: el nombre de la tabla sale del metamodelo, una columna por cada campo mapeado, un placeholder `?` por cada valor. Le entrega esa cadena más los valores a JDBC como un `PreparedStatement`, y JDBC se lo envía a PostgreSQL.

   ```sql
   -- lo que Hibernate ensambla para un save() sobre un TimeEntry nuevo
   insert into time_entries (created_at, date, description, hours, project_id,
                             rejection_note, status, updated_at, user_id, id)
   values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   ```

Las mismas dos pasadas explican que las tablas aparezcan en pgAdmin sin que escribas una sola línea de DDL: con `spring.jpa.hibernate.ddl-auto=update`, Hibernate compara su metamodelo con el esquema real al arrancar y emite las sentencias `create table` / `alter table` necesarias para cerrar la diferencia. Cada sentencia generada en este archivo — incluido el `alter table` que falla en la sección `@ColumnDefault` de más abajo — sale de esa comparación.

> **Activa el SQL y deja de adivinar.** `spring.jpa.show-sql=true` en `application.properties` imprime cada sentencia que Hibernate envía. No es un lujo de depuración — es cómo *ves* el problema N+1 al final de este archivo en lugar de teorizar sobre él, y lo primero que hay que activar cuando una query se comporta de forma extraña. Docs: https://www.baeldung.com/sql-logging-spring-boot.

> **Entonces, ¿por qué programar contra la especificación si Hibernate es siempre quien ejecuta?** Porque tu *código* solo nombra tipos de JPA; cambiar de implementación sería un cambio de dependencia, no una reescritura. Esa es la teoría. En la práctica nadie cambia Hibernate — la ganancia real es más pequeña y más honesta: te dice qué anotaciones son JPA portable (`@Entity`, `@Column`, `@Enumerated`) y cuáles son extras de Hibernate (`@CreationTimestamp`, `@ColumnDefault`), y esa distinción es una pregunta de entrevista estándar. El `TimeEntry` de TimeTrack lleva ambos tipos, uno junto al otro.

---

## @Entity — mapear una clase a una tabla

Propósito: marcar una clase como una que Hibernate debe mapear sobre una tabla de base de datos — esta es la anotación que mete la clase en el metamodelo de arriba, sin la cual la clase es un objeto Java corriente y ningún repositorio puede persistirla.

Archivo: `src/main/java/com/victor/timetrack/model/TimeEntry.java`, `.../model/User.java`, `.../model/Project.java`

Docs: https://www.baeldung.com/jpa-entities → leer: "The Entity Annotation", "The Id Annotation" y "The Table Annotation"

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

> **El bloque de código de arriba es una entidad `Transaction` genérica, no una clase de TimeTrack** — es deliberadamente densa para que aparezcan todas las anotaciones en un solo sitio. Las tres entidades reales son `User`, `Project` y `TimeEntry` (la línea `File:` de arriba), y se citan directamente durante el resto de este archivo.

**`@GeneratedValue` — opciones de strategy:**

> **Cómo leer la tabla:** la columna **Strategy** es lo que escribes en Java; la columna **Resultado en PostgreSQL** es lo que esa elección hace que Hibernate cree *en la base de datos* — y es la columna que decide por ti, porque las dos opciones difieren en dónde se produce el siguiente id (en el contador propio de la columna de la base de datos, o en un objeto secuencia aparte que Hibernate consulta).

| Strategy | Qué hace | Resultado en PostgreSQL |
|---|---|---|
| `@GeneratedValue` (sin strategy) | Usa `AUTO` — Hibernate elige la mejor strategy | Crea una secuencia (ej. `users_seq`) |
| `@GeneratedValue(strategy = GenerationType.IDENTITY)` | Usa el auto-incremento nativo de la base de datos | Usa columna `BIGSERIAL` |
| `@GeneratedValue(strategy = GenerationType.SEQUENCE)` | Usa una secuencia con nombre | Más control sobre la configuración de la secuencia |

`IDENTITY` es la elección más común en proyectos reales — usa el mecanismo nativo de la base de datos y genera ids de uno en uno. `AUTO` (el valor por defecto) crea una secuencia que incrementa de **50 en 50**, que es la razón por la que los ids en una tabla recién creada pueden saltar de `1` a `52`: Hibernate reserva un bloque de 50 valores en un único viaje de ida y vuelta y los reparte en memoria, así no tiene que preguntarle a la base de datos en cada insert individual. Rápido, y propenso a dejar huecos.

> **Lo que hace TimeTrack de verdad.** Las tres entidades declaran el `@Id @GeneratedValue` a secas — **sin strategy**, así que están en `AUTO`, y Hibernate crea `users_seq`, `projects_seq` y `time_entries_seq` con el comportamiento de incremento de 50 explicado arriba. Funciona, y los huecos son cosméticos (un id es un identificador, no un recuento). Aun así, saber que estás en `AUTO` importa para la respuesta de entrevista: "el valor por defecto es `AUTO`, respaldado por una secuencia con `allocationSize = 50`; escribiría `IDENTITY` explícitamente si quisiera el contador `BIGSERIAL` propio de la base de datos e ids contiguos." Docs: https://www.baeldung.com/hibernate-identifiers.

---

## @Enumerated(EnumType.STRING) — persistencia segura de enums

Propósito: controla cómo JPA almacena un valor de enum en la base de datos. `STRING` guarda el nombre (`"MANAGER"`); `ORDINAL` (el valor por defecto) guarda el número de posición (`0`, `1`, `2`). Usa siempre `STRING`.

Docs: https://www.baeldung.com/jpa-persisting-enums-in-jpa → leer: "@Enumerated(EnumType.ORDINAL)" y "@Enumerated(EnumType.STRING)" — las dos opciones, una junto a la otra

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
// ¡Pero la base de datos sigue teniendo filas con valor 1 — ahora significan ADMIN, no MANAGER!
// Cada MANAGER existente se convirtió en ADMIN. Corrupción silenciosa de datos, sin error.
```

Con `STRING`, el valor almacenado es `"MANAGER"` — añadir un nuevo valor de enum en medio nunca cambia lo que significan las filas existentes.

> **Los entrevistadores preguntan:** "¿Por qué usaste `EnumType.STRING` y no el valor por defecto?" — explica el riesgo de corrupción con ordinal. Esta es una de las preguntas que separa a los candidatos que entienden JPA de los que solo siguieron un tutorial.

---

## Añadir una columna NOT NULL a una tabla que ya tiene filas — @ColumnDefault

Propósito: `@ColumnDefault` hace que Hibernate añada una cláusula `DEFAULT` al `ALTER TABLE` que genera, para que PostgreSQL tenga un valor con el que rellenar las filas ya existentes. Sin esto, añadir una columna obligatoria (`NOT NULL`) a una tabla que ya tiene datos falla directamente.

Docs: https://www.baeldung.com/jpa-default-column-values → leer: la sección `@ColumnDefault` (y fíjate en cómo aparece la anotación en el DDL generado)

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
@ColumnDefault("0")           // literal numérico — no hace falta comillas en SQL
@ColumnDefault("true")        // literal booleano — no hace falta comillas en SQL
@ColumnDefault("'PENDING'")   // literal de texto/enum — SQL exige comillas simples alrededor del texto
```

> Es una anotación específica de Hibernate (`org.hibernate.annotations.ColumnDefault`), no forma parte de la especificación JPA — misma categoría que `@CreationTimestamp` de arriba: una comodidad que Hibernate añade encima del estándar.

> **Los entrevistadores preguntan:** "¿Qué pasa cuando añades una columna obligatoria a una tabla con datos existentes?" — la respuesta es exactamente este trade-off: o le das a la columna un `DEFAULT` para que la base de datos pueda rellenarla, o la dejas nullable y rellenas los datos tú mismo antes de apretar la restricción más adelante.

---

## Timestamps automáticos — @CreationTimestamp, @UpdateTimestamp, @PrePersist

Propósito: rellenar `createdAt` / `updatedAt` sin asignarlos nunca en tu código de service — el valor lo produce Hibernate (o un callback de ciclo de vida de JPA) en el momento en que se escribe la fila, así que no se puede olvidar, falsear, ni establecer con una hora que venga del cliente.

Archivo: `src/main/java/com/victor/timetrack/model/TimeEntry.java` (ambas anotaciones) y `.../model/Project.java` (solo `@CreationTimestamp` — un proyecto nunca "se actualiza" en nada que muestre la UI)

Docs: https://www.baeldung.com/hibernate-creationtimestamp-updatetimestamp → leer: "@CreationTimestamp" y "@UpdateTimestamp"

Casi nunca estableces `createdAt` / `updatedAt` a mano. Hay dos formas de rellenarlos automáticamente — un atajo de Hibernate y el callback estándar de JPA. TimeTrack usa el atajo, y este es el código real de `TimeEntry` (la declaración completa — sin `@Column`, sin setter, nada más):

```java
@CreationTimestamp                 // Hibernate lo establece una vez, en el primer insert
private LocalDateTime createdAt;

@UpdateTimestamp                   // Hibernate lo refresca en cada update
private LocalDateTime updatedAt;
```

- `@CreationTimestamp` / `@UpdateTimestamp` son anotaciones de **Hibernate** (no JPA). Hibernate rellena el campo por ti — `createdAt` una vez cuando se inserta la fila, `updatedAt` en cada save.
- `@PrePersist` (y `@PreUpdate`) son los equivalentes **estándar de JPA** — callbacks de ciclo de vida que escribes tú mismo:

```java
@PrePersist
public void onCreate() {
    this.createdAt = LocalDateTime.now();
}
```

> **¿De dónde viene el valor — del reloj de la base de datos o del de la app?** Del reloj de la **JVM**, por defecto. `@CreationTimestamp` no se traduce al `now()` de SQL; Hibernate llama al reloj de Java mientras ensambla el `insert`, y envía el timestamp resultante como un parámetro `?` más, exactamente igual que `hours` o `description`. Eso importa el día en que el servidor de la app y el de la base de datos están en zonas horarias distintas o se desincronizan — el `created_at` de la fila refleja la idea de "ahora" *de la aplicación*, no la de PostgreSQL. (A Hibernate 6 se le puede indicar que use la base de datos en su lugar, con `@CreationTimestamp(source = SourceType.DB)`, al coste de un viaje de ida y vuelta extra para preguntar su hora.)

> ¿Cuál usar? `@CreationTimestamp` es menos código y es la elección común en proyectos Spring Boot. `@PrePersist` es portable (JPA puro, funciona con cualquier proveedor) y te permite ejecutar lógica extra, no solo establecer un timestamp. Los entrevistadores preguntan "¿estableciste `createdAt` manualmente?" — la buena respuesta es "no, `@CreationTimestamp` lo hace", y saber que `@PrePersist` es la alternativa estándar.

---

## JpaRepository — lo que obtienes gratis

Propósito: conseguir un objeto de acceso a datos funcional para una entidad sin escribir nada más que la declaración de una interfaz — los métodos CRUD que necesita cualquier tabla (`save`, `findById`, `findAll`, `deleteById`…) se heredan, y el proxy del principio de este archivo los implementa.

Archivo: `src/main/java/com/victor/timetrack/repository/UserRepository.java`, `.../ProjectRepository.java`, `.../TimeEntryRepository.java`

Docs: https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa → leer: la sección `JpaRepository`

El patrón que se repite: defines una interfaz; Spring genera la implementación. Los tres repositorios de TimeTrack son literalmente esto — una cláusula `extends` y, a lo sumo, dos o tres métodos declarados:

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByActiveTrue();
}
```

Los dos parámetros de tipo: el **tipo de entidad** (`User`) y el tipo de su campo **`@Id`** (`Long`). Equivócate en el segundo — escribe `JpaRepository<User, Integer>` cuando el id es un `Long` — y `findById(1L)` no compilará, porque el tipo del parámetro del método heredado es justo lo que pusiste en ese hueco. Los genéricos no son decoración: son lo que hace que `save(User)` devuelva un `User` y `findById(Long)` devuelva un `Optional<User>` en lugar de un `Optional<Object>`.

> **Sin `@Repository`, sin clase de implementación — y eso es correcto.** Ninguno de los tres repositorios de TimeTrack lleva ninguna anotación. No necesitan una: Spring Data los encuentra por el `extends JpaRepository` de la declaración, no por una marca encima (la secuencia de escaneo-y-generación del principio de este archivo). Escribir `@Repository` sobre ellos no cambia nada; dejarlo fuera es justo el aspecto que tiene código real de Spring Data.

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

## Los repositorios se agrupan por entidad, no por feature — un eje distinto al de controllers/services

Propósito: decidir a *qué* repositorio pertenece una query nueva — la regla es la entidad de su cláusula `FROM`, no la feature que la pidió, y equivocarse en esto es como un proyecto acaba con un repositorio que no tiene ninguna entidad detrás.

Archivo: `src/main/java/com/victor/timetrack/repository/TimeEntryRepository.java` — contiene tanto `findByUser` como las dos agregaciones de informes, y no existe ningún `ReportRepository` en el proyecto

Docs: https://www.baeldung.com/spring-data-repositories → leer: las secciones sobre la jerarquía `Repository` y a qué está atada una interfaz de repositorio

Los controllers y services de este proyecto se organizan por **feature** — un par por cada recurso que expone la API: `ProjectController`/`ProjectService`, `TimeEntryController`/`TimeEntryService`, `ReportController`/`ReportService`. Cada endpoint nuevo tiene su propio par, siguiendo ese patrón sin excepciones (ver [11-logica-de-negocio-modelado-dominio.md](11-logica-de-negocio-modelado-dominio.md) para saber por qué los controllers nunca saltan directamente al repositorio).

Los repositorios siguen una regla **completamente distinta**: un repositorio por **entidad**, fijado por la propia declaración `extends JpaRepository<Entidad, Long>`. `TimeEntryRepository extends JpaRepository<TimeEntry, Long>` está atado de forma permanente a la entidad `TimeEntry` — esa relación no es una convención de nombres que podrías romper, está incrustada en el parámetro de tipo genérico, que es justo lo que permite a Spring generar `save()`, `findById()`, etc. para esa entidad concreta.

Esto importa en el momento en que construyes una feature — como un informe — que tiene su propio controller y service pero produce datos que **no son una entidad persistida**. No existe una tabla `Report`, ni un `@Entity Report`, así que no hay nada contra lo que un hipotético `ReportRepository` pudiera hacer `extends JpaRepository<..., ...>`. Su `@Query` sería simplemente un método suelto sin ninguna entidad asociada — rompiendo el patrón de un-repositorio-por-entidad que sigue el resto de repositorios del proyecto.

La solución: pon la query donde de verdad apunta su cláusula `FROM`. Un informe construido con `FROM TimeEntry te ...` es una query *sobre* filas de `TimeEntry` (agrupadas y agregadas, pero siguen siendo filas de `TimeEntry`) — así que pertenece a `TimeEntryRepository`, el mismo repositorio que ya tiene `findByUser`. El agrupamiento por feature (`ReportController` → `ReportService`) sigue existiendo una capa por encima; simplemente llama al repositorio agrupado por entidad que hay debajo, igual que hace cualquier otro service:

```
ReportController  →  ReportService  →  TimeEntryRepository   (el FROM de la query es TimeEntry)
```

> **Los dos ejes, lado a lado:**
>
> | Capa | Se agrupa por | Ejemplo |
> |---|---|---|
> | Controller / Service | Feature (el recurso que expone la API) | `ReportController`/`ReportService` para informes |
> | Repositorio | Entidad (a qué está atado `JpaRepository<X, Long>`) | `TimeEntryRepository` para cualquier lectura de filas de `TimeEntry`, agregadas o no |
>
> Una feature nueva casi siempre significa un par controller+service nuevo. **No** significa automáticamente un repositorio nuevo — comprueba primero si la cláusula `FROM` de la query apunta a una entidad para la que ya tienes repositorio.

La query de agregación `getHoursByProject` de TimeTrack es el ejemplo concreto de esta regla, y la verás completa al final de este archivo ("Queries de agregación y proyecciones por interfaz"): su `@Query` vive en `TimeEntryRepository`, no en un `ReportRepository`, precisamente porque su cláusula `FROM` dice `FROM TimeEntry te`. `ReportService` — la capa agrupada por feature — es quien la llama.

---

## Derived query methods

Propósito: conseguir una cláusula `WHERE` personalizada simplemente *nombrando un método* — Spring Data parsea el nombre y genera la query, así que un filtro como "solo los proyectos activos" cuesta una línea en una interfaz y ningún SQL escrito a mano.

Archivo: `src/main/java/com/victor/timetrack/repository/ProjectRepository.java` (`findByActiveTrue()`), `.../UserRepository.java` (`findByEmail(String)`), `.../TimeEntryRepository.java` (`findByUser(User)`)

Docs: https://www.baeldung.com/spring-data-derived-queries → leer: "Method Names Query Creation" y la tabla de keywords

Spring Data JPA parsea el nombre del método y genera el SQL — sin implementación necesaria. Este es el paso 2 de la generación del proxy del principio del archivo, y ocurre **al arrancar**: Spring divide el nombre en un *subject* (`findBy`, `existsBy`, `countBy`) y un *predicate* (todo lo que va después de `By`), compara cada palabra del predicate contra los nombres de campo de la entidad tomados del metamodelo, y construye la query una sola vez. Un nombre que no puede resolver es un **fallo al arrancar**, no en tiempo de ejecución:

```
org.springframework.data.repository.query.QueryCreationException: Could not create query for
public abstract java.util.List com.victor.timetrack.repository.ProjectRepository.findByActivo();
Reason: Failed to create query for method ...; No property 'activo' found for type 'Project'
```

Misma filosofía que el bean ausente del archivo 03: una errata en el nombre de un método se detecta antes de que la app atienda ninguna petición, porque el nombre *es* la query.

Los tres métodos derivados de TimeTrack, y en qué se convierte cada uno:

```java
Optional<User> findByEmail(String email);
// SELECT * FROM users WHERE email = ?          → Optional: un email puede no encontrar a nadie

List<Project> findByActiveTrue();
// SELECT * FROM projects WHERE active = true   → "True" es una keyword, así que no hay parámetro

List<TimeEntry> findByUser(User user);
// SELECT * FROM time_entries WHERE user_id = ? → pasas el OBJETO, Hibernate envía su id
```

> **`findByUser(User user)` recibe un objeto, pero la columna es `user_id` — ¿cómo?** Porque estás consultando el *grafo de entidades*, no la tabla. `TimeEntry` tiene un campo `user` de tipo `User`, y el metamodelo ya sabe que ese campo se almacena como la columna FK `user_id`. Así que Spring Data construye `WHERE user_id = ?` y Hibernate vincula `user.getId()` como parámetro. Nunca extraes el id tú mismo — y *no puedes* pasar uno en su lugar: `findByUser(5L)` no compilaría, porque el tipo del parámetro tiene que coincidir con el tipo del campo. Para consultar por el id en bruto declararías `findByUserId(Long id)` — el `Id` en el nombre avanza un paso más en el grafo de objetos (`TimeEntry.user.id`).

> **`True` no es un nombre de campo — es una keyword.** `findByActiveTrue()` no tiene parámetros, y eso no es un error: el parser lee `Active` como el campo y `True` como una de las keywords de comparación incluidas de serie (`True`, `False`, `Between`, `LessThan`, `Like`, `In`, `IsNull`, `Containing`…), que aporta el valor por sí misma. `findByActive(boolean active)` también funcionaría y dejaría elegir a quien llame — `findByActiveTrue()` es la versión que dice "este endpoint solo quiere los activos", ya en la propia firma.

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

Propósito: devolver una única porción de un conjunto de resultados más los metadatos que necesita un paginador de UI, en lugar de todas las filas — la diferencia entre un endpoint que sobrevive a una tabla real y uno que muere sobre ella.

Archivo: proposed — **TimeTrack no pagina nada hoy.** `TimeEntryController` devuelve un `List` a secas, lo cual está bien a escala de demo y es exactamente el hueco que un entrevistador sondea. Todo lo que sigue es la forma que tomaría el refactor; no busques ningún `Pageable` en el repositorio.

Docs: https://www.baeldung.com/spring-data-jpa-pagination-sorting → leer: "Pagination" y "Page vs Slice"

Devolver todas las filas está bien en una demo y es peligroso en producción. `repository.findAll()` en una tabla con 100.000 filas las carga todas en memoria y las serializa a JSON en una sola respuesta — lento, y puede tumbar la app. La pregunta de entrevista es exactamente esta: "¿qué pasa si llamas a `findAll()` en una tabla enorme?"

La solución está integrada en `JpaRepository`: acepta un `Pageable` y devuelve un `Page<T>`.

```java
// repositorio — JpaRepository ya declara findAll(Pageable); los derived queries también pueden usarlo
Page<Transaction> findByType(TransactionType type, Pageable pageable);
```

```java
// controller — Spring construye el Pageable de ?page=0&size=20&sort=date,desc automáticamente
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
- `Page<T>` es el resultado: las filas de esa página **más** metadatos — `getTotalElements()`, `getTotalPages()`, `getNumber()`. El cliente Angular usa esos metadatos para renderizar su paginador.
- `PageRequest.of(0, 20)` es cómo construyes un `Pageable` a mano cuando no hay request (un test, un job programado).

> Bajo el capó Spring Data ejecuta dos queries: un `LIMIT ... OFFSET ...` para las filas de la página y un `COUNT(*)` para el total — así es como `Page` sabe `getTotalPages()`. En una tabla masiva puedes devolver `Slice<T>` en su lugar (sin query de conteo) cuando solo necesitas "¿hay una página siguiente?".

---

## Relaciones — @ManyToOne y @OneToMany

Propósito: convertir una foreign key en un campo Java — en lugar de guardar un `Long userId` y buscar al usuario a mano, la entidad contiene un `User user` y Hibernate mantiene sincronizados la columna FK y la referencia al objeto.

Archivo: `src/main/java/com/victor/timetrack/model/TimeEntry.java` — los dos campos `@ManyToOne` (`user`, `project`) son las únicas relaciones de TimeTrack; **no hay ningún `@OneToMany` en todo el proyecto** (ver el callout al final de esta sección para saber por qué eso es una elección, no un olvido)

Docs: https://www.baeldung.com/hibernate-one-to-many → leer: "@OneToMany", "@ManyToOne" y la sección sobre `mappedBy` (el lado dueño frente al inverso)

El código real de TimeTrack — una entrada de tiempo pertenece a un usuario y a un proyecto, así que `time_entries` lleva ambas foreign keys:

```java
@ManyToOne
@JoinColumn(name = "user_id", nullable = false)
private User user;

@ManyToOne
@JoinColumn(name = "project_id", nullable = false)
private Project project;
```

`nullable = false` en el `@JoinColumn` es lo que hace que la columna FK sea `NOT NULL` — una entrada de tiempo sin usuario o sin proyecto no tiene sentido, y ahora la base de datos se niega a guardar una aunque un bug en el service lo intente.

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

> **Por qué TimeTrack no tiene ningún `@OneToMany` — y por qué ese es el valor por defecto correcto.** `User` perfectamente podría declarar `@OneToMany(mappedBy = "user") private List<TimeEntry> entries`, y no lo hace. La relación ya queda completamente expresada por la columna FK en `time_entries`; el lado `@OneToMany` no añade **ningún dato**, solo un segundo camino Java hacia las mismas filas. Lo que sí añade es una forma de cargar por accidente todo el historial de seis meses de un usuario cada vez que lo obtienes, y una colección que hay que recordar mantener sincronizada en memoria. Cuando el código necesita las entries de un usuario, le hace la pregunta directamente al repositorio — `timeEntryRepository.findByUser(user)` — que devuelve exactamente las filas que se quieren, paginadas o filtradas si hace falta. **Mapea el lado inverso solo cuando de verdad lo navegas**; un `@OneToMany` sin usar es un pasivo, no una muestra de completitud.

---

## @ManyToMany — relaciones mediante una tabla de unión

Propósito: modelar "muchos en ambos lados", donde ninguna de las dos tablas puede contener la foreign key — la relación vive en una tercera tabla que solo guarda pares de ids.

Archivo: proposed — **no hay ningún `@ManyToMany` en TimeTrack.** Las únicas relaciones del proyecto son los dos campos `@ManyToOne` de arriba; un `Project` no tiene lista de miembros. El ejemplo de abajo es la forma que tomaría la feature si los proyectos ganaran usuarios asignados, y es material de entrevista estándar de todas formas. No busques `project_members` en la base de datos.

Docs: https://www.baeldung.com/jpa-many-to-many → leer: la sección de la join table y las partes sobre el lado dueño y `@JoinTable`. La continuación — una join table que lleva sus propias columnas — está en https://www.baeldung.com/hibernate-many-to-many → "Many-to-Many With Extra Columns"

`@ManyToOne` / `@OneToMany` modela "un usuario tiene muchas transacciones". `@ManyToMany` es para "muchos en ambos lados" — un `Project` puede tener muchos `User`s y un `User` puede trabajar en muchos `Project`s. Ninguna tabla puede contener la foreign key, así que JPA necesita una tercera tabla — una **join table** — que solo guarda pares de ids.

¿Por qué no puede contenerla ninguna de las dos tablas? Una columna FK guarda **un** valor por fila. `projects.user_id` podría apuntar a un único usuario; en el momento en que un proyecto tiene tres miembros no hay dónde poner a los otros dos — y ensanchar la columna a una lista es justo lo que las bases de datos relacionales se niegan a hacer. La join table lo esquiva convirtiendo cada *pareja* en una fila propia:

```
projects                users              project_members
┌────┬───────────┐      ┌────┬───────┐     ┌────────────┬─────────┐
│ id │ name      │      │ id │ name  │     │ project_id │ user_id │
├────┼───────────┤      ├────┼───────┤     ├────────────┼─────────┤
│  1 │ TimeTrack │      │  7 │ Ana   │     │     1      │    7    │   Ana → TimeTrack
│  2 │ Marketing │      │  8 │ Luis  │     │     1      │    8    │   Luis → TimeTrack
└────┴───────────┘      └────┴───────┘     │     2      │    7    │   Ana → Marketing también
                                           └────────────┴─────────┘
```

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

Propósito: decidir *cuándo* se carga la entidad relacionada — junto con el padre, o solo si alguien toca el campo. Es una sola palabra en una anotación, y es la palanca individual más grande sobre cuántas queries dispara tu endpoint.

Archivo: `src/main/java/com/victor/timetrack/model/TimeEntry.java` — sus dos campos `@ManyToOne` **no** declaran fetch type, así que ambos están en el valor por defecto EAGER (más abajo)

Docs: https://www.baeldung.com/hibernate-lazy-eager-loading → leer: "Lazy Loading", "Eager Loading" y la sección sobre el proxy que Hibernate sustituye en un campo lazy

> **Cómo leer la tabla:** las dos filas **Por defecto para…** son las que hay que memorizar — son la parte sorprendente, y van al revés de lo que la mayoría adivina. El resto de filas se deducen de ellas. Lee cada fila como: *esto* es lo que obtienes en un campo que no anotaste, así que *esto* es lo que estás enviando a producción salvo que digas lo contrario.

| | LAZY | EAGER |
|---|------|-------|
| Cuándo se carga | Solo cuando accedes al campo | Inmediatamente con el padre |
| Por defecto para `@ManyToOne` | No (¡EAGER es el por defecto!) | — |
| Por defecto para `@OneToMany` | Sí | — |
| Rendimiento | Mejor — carga solo lo que necesitas | Puede disparar queries extra inesperadas |
| Cuándo usarlo | Casi siempre | Solo cuando siempre necesitas los datos relacionados |

**El mecanismo detrás de LAZY.** Hibernate no puede dejar el campo en `null` — tu código lanzaría un NPE. Así que cuando un campo es LAZY, pone ahí un **proxy** en su lugar: una subclase de `User` generada que solo guarda el id y una referencia a la sesión abierta. Llama a cualquier getter sobre él y el proxy dispara el `SELECT` en ese mismo instante y se rellena a sí mismo. Por eso el campo "se carga cuando accedes a él": acceder a él es literalmente una llamada a un método sobre un objeto cuyos métodos son un disparador. Y por eso un campo LAZY al que accedes *después* de que la transacción se cierre lanza una excepción — el proxy todavía existe, pero la sesión a la que iba a preguntar ya no está:

```
org.hibernate.LazyInitializationException: could not initialize proxy
    [com.victor.timetrack.model.User#3] - no Session
```

La parte entre corchetes es la pista: Hibernate nombra la entidad y el id exactos para los que todavía guardaba un placeholder, lo cual te dice *qué* campo tocaste demasiado tarde. ([08-transacciones.md](./08-transacciones.md) es donde se traza esa frontera de sesión.)

**Declara siempre `FetchType.LAZY` explícitamente** — incluso en `@ManyToOne` donde EAGER es el sorprendente valor por defecto:

```java
@ManyToOne(fetch = FetchType.LAZY)   // LAZY explícito — no dejes el EAGER por defecto
@JoinColumn(name = "user_id")
private User user;
```

> **TimeTrack no hace esto — y es una consecuencia real y observable, no una manía de estilo.** El código real es `@ManyToOne @JoinColumn(name = "user_id", nullable = false)`: **sin fetch type**, así que JPA aplica el valor por defecto de `@ManyToOne`, que es **EAGER**. Por lo tanto, cada `TimeEntry` que Hibernate carga arrastra consigo su `User` *y* su `Project`, los quiera o no quien llama — un `findByUser(user)` que devuelve 40 entries trae 40 usuarios y 40 proyectos de propina. Con `show-sql` activado, puedes ver que ocurre. Es inofensivo al tamaño de TimeTrack y es exactamente el tipo de valor por defecto que se convierte en un incidente de producción a escala; la respuesta honesta de entrevista es "los campos `@ManyToOne` están en el valor por defecto EAGER, que cambiaría a LAZY, y esta es la razón" — lo cual vale más que fingir que fue deliberado.

---

## El problema N+1

Propósito: reconocer el bug de rendimiento que la carga LAZY crea como efecto secundario — una query para traer una lista, y después una query *más* por cada elemento en el momento en que tocas su relación — y conocer las dos anotaciones que las colapsan de vuelta en una sola.

Archivo: proposed — **no existe ningún `JOIN FETCH` ni `@EntityGraph` en TimeTrack** (sus campos `@ManyToOne` están en EAGER, lo que cambia este bug por otro distinto — ver el callout de abajo). Los fixes de abajo son los estándar y se preguntan en cualquier entrevista que toque JPA.

Docs: https://www.baeldung.com/spring-hibernate-n1-problem → leer: el ejemplo trabajado y los fixes de estrategia de fetch. Para `@EntityGraph` en concreto, leer https://www.baeldung.com/jpa-entity-graph → "Defining an Entity Graph"

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

`JOIN FETCH` y `@EntityGraph` hacen lo mismo por caminos distintos: ambos le dicen a Hibernate "carga esta relación *en el mismo `SELECT`*, como un join, no más tarde". `JOIN FETCH` lo dice dentro de la cadena de la query; `@EntityGraph` lo dice como una anotación encima, dejando intacto el nombre del derived query — por eso es el fix más ordenado para un método al que no querías escribirle a mano un `@Query`.

> **¿EAGER "arregla" N+1? No — lo desplaza.** Los campos `@ManyToOne` EAGER de TimeTrack hacen que Hibernate no espere a que toques `entry.getUser()`: carga el usuario por adelantado. Pero "por adelantado" no significa "en la misma query" — a menos que Hibernate elija un join, igualmente emite un `SELECT` separado por cada fila padre, y obtienes el mismo 1 + N, solo que disparado antes y sin que tú hayas escrito el bucle que lo dispara. **El fix real es siempre el mismo: declara lo que necesitas dentro de la propia query** (`JOIN FETCH` / `@EntityGraph`) en lugar de esperar que un valor por defecto de fetch type produzca el SQL correcto. Esa es la respuesta que escuchan los entrevistadores, porque es la que demuestra que sabes que EAGER no es un ajuste de rendimiento.

---

## save() — insert o update

Propósito: escribir una entidad en la base de datos sin decidir tú mismo si es un `INSERT` o un `UPDATE` — un único método cubre ambos, y equivocarse no es posible porque Spring Data lee el `@Id` en lugar de fiarse de ti.

Archivo: `src/main/java/com/victor/timetrack/service/TimeEntryService.java` — `timeEntryRepository.save(entry)` se llama sobre la entidad recién construida en `create()` (insert) y de nuevo sobre la entidad cargada en el flujo de aprobar/rechazar (update). El mismo método, las dos veces.

Docs: https://www.baeldung.com/spring-data-crud-repository-save → leer: "The save() Method" y la decisión insert-vs-update

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

El `TimeEntryService` de TimeTrack usa las dos ramas sin decir nunca cuál quiere:

```java
// create() — INSERT: la entidad se construyó con new, así que el id sigue siendo null
TimeEntry timeEntry = new TimeEntry();
timeEntry.setUser(user);
timeEntry.setProject(project);
// ...
TimeEntry saved = timeEntryRepository.save(timeEntry);

// approve() — UPDATE: la entidad vino de findById, así que el id ya está establecido
TimeEntry timeEntry = timeEntryRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));
timeEntry.setStatus(EntryStatus.APPROVED);
TimeEntry saved = timeEntryRepository.save(timeEntry);
```

> **¿Por qué reasignar el resultado — `TimeEntry saved = ...save(entry)` — cuando `save()` muta la entidad que le pasaste?** En un insert sí escribe el id generado de vuelta en tu objeto, así que `entry.getId()` funciona después y *podrías* ignorar el valor de retorno. Pero eso es una cortesía específica de Hibernate, no una garantía del contrato: `save()` está especificado para devolver **la instancia persistida**, y se le permite ser un objeto *distinto* del que le entregaste (que es exactamente lo que hace `merge()` con una entidad detached — copia tu estado sobre una copia gestionada y devuelve la copia, dejando tu original intacto). Usa la referencia devuelta y el código es correcto bajo cualquiera de los dos comportamientos; usa el argumento y estás confiando en un detalle de implementación. `TimeEntry saved = repository.save(timeEntry)` es el hábito a mantener — y es lo que hacen de verdad los cinco métodos de escritura de `TimeEntryService` (`create`, `submit`, `approve`, `reject`, `update`). Docs: https://www.baeldung.com/spring-data-jpa-save-use-returned-instance.

---

## Queries de agregación y proyecciones por interfaz

Todos los métodos de repositorio que has visto hasta ahora devuelven entidades — `Transaction`, `List<Transaction>`, `Page<Transaction>`. Pero un informe como "total de horas por proyecto este mes" no es una entidad. No existe una tabla `Report`, ni un `@Id`, ni una fila única que pudieras guardar con `save()` — es un resultado **calculado**: una fila por proyecto, con un `SUM()` de una columna de otra tabla relacionada. Devolver un `List<Project>` para esto no tiene sentido — un `Project` no tiene un campo `totalHours`, y no debería tenerlo, porque ese número depende de un rango de fechas que eliges en el momento de la petición, no de nada guardado en el propio proyecto.

Propósito: una proyección por interfaz le dice a Spring Data JPA la *forma* de un resultado calculado — qué campos existen y de qué tipo son — sin que tengas que escribir una clase ni ningún código de mapeo. Spring genera la implementación por ti en tiempo de ejecución.

Archivo: `src/main/java/com/victor/timetrack/dto/response/ProjectHoursReportResponse.java` (y `EmployeeHoursReportResponse.java` justo al lado — el mismo patrón para el informe por empleado)

Docs: https://www.baeldung.com/spring-data-jpa-projections → leer: "Interface-based Projections"

```java
public interface ProjectHoursReportResponse {
    String getProjectName();
    BigDecimal getTotalHours();
}
```

> **¿Por qué la interfaz solo tiene dos métodos si el informe devuelve varios proyectos?** No confundas la *lista* con la *forma de una fila*. `List<ProjectHoursReportResponse>` es lo que representa "cuántas filas hay" — un elemento por cada proyecto que tuvo entries en el rango. `ProjectHoursReportResponse` en sí describe la forma de **una sola** de esas filas — los dos campos que necesita cada fila, no "dos filas en total". Spring instancia un objeto proxy por cada fila que devuelve la query; cada uno de esos objetos implementa la interfaz, así que todos tienen disponibles `getProjectName()` y `getTotalHours()` — pero llamar a `getProjectName()` sobre el objeto construido a partir de la fila 1 devuelve `"TimeTrack"`, mientras que llamarlo sobre el objeto de la fila 2 devuelve `"Marketing"`. Mismos dos métodos en cada objeto (el contrato fijo), distintos valores por objeto (porque cada uno se construye a partir de una fila distinta). Es exactamente la misma relación que ya conoces entre una clase normal y sus instancias: `new Project()` dos veces te da dos objetos que comparten el mismo método `getName()` pero cada uno devuelve su propio dato — la única diferencia aquí es que tú nunca escribes `new`, lo hace Spring una vez por fila.
>
> **¿Por qué una interfaz y no una clase con `@Data`, como el resto de DTOs de respuesta de este proyecto?** Cualquier otro DTO (`ProjectResponse`, `UserResponse`...) es una clase que tú mismo instancias — escribes `new ProjectResponse()` (o lo hace un mapper) y rellenas cada campo a mano en tu propio código Java. Una proyección es distinta: **tú nunca la construyes**. Spring Data lee los alias de columna que devuelve la query (`SUM(te.hours) AS totalHours`) y, como Java puede generar en tiempo de ejecución un objeto proxy que implemente cualquier interfaz, construye sobre la marcha un objeto cuyo `getTotalHours()` devuelve exactamente el valor de esa columna — sin cuerpo de clase, sin constructor, sin mapeo manual. Una `class` no se puede construir así porque necesitaría un constructor que Spring tendría que llamar con los argumentos correctos en el orden correcto; una interfaz solo promete "existe algo con este método", que es todo lo que necesita un proxy generado en tiempo de ejecución.

> **Regla práctica — memoriza esta:** cada vez que escribas una interfaz de proyección (para JPQL, como aquí, o para SQL nativo con `@Query(nativeQuery = true)`), cada getter tiene que coincidir, por nombre, con un `AS alias` del `SELECT`. Decide primero la lista `SELECT ... AS alias`, y luego escribe un getter por cada alias — nunca al revés. `AS totalHours` necesita `getTotalHours()`; `AS employeeName` necesita `getEmployeeName()`. Sin alias, no hay proyección.

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

### Filtrar por un valor de enum fijo — el literal JPQL, no un parámetro

El `WHERE` de arriba solo comprueba `te.date BETWEEN :start AND :end` — suma cualquier `TimeEntry` del rango sin importar su `status`. Eso es un bug real en la primera versión de esta query en TimeTrack: el reporte de un manager terminaba sumando horas de entries todavía en `DRAFT` (ni siquiera enviadas) y entries en `REJECTED` (rechazadas explícitamente) como si fueran trabajo confirmado. Todo el sentido de la máquina de estados `DRAFT → SUBMITTED → APPROVED/REJECTED` es que `APPROVED` es el único status que un manager de verdad ha validado — se supone que un reporte es un número del que la gente puede fiarse, y sumar horas no confirmadas o rechazadas rompe esa confianza en silencio, sin ningún error que te avise.

El arreglo es un `AND` más — pero la forma de referenciar el valor del enum merece detenerse en ella, porque es distinta de cualquier otra query de este archivo:

```java
@Query("""
        SELECT te.project.name AS projectName, SUM(te.hours) AS totalHours
        FROM TimeEntry te
        WHERE te.date BETWEEN :start AND :end
              AND te.status = com.victor.timetrack.model.EntryStatus.APPROVED
        GROUP BY te.project.name
        """)
List<ProjectHoursReportResponse> getHoursByProject(@Param("start") LocalDate start, @Param("end") LocalDate end);
```

`com.victor.timetrack.model.EntryStatus.APPROVED` es un **literal de enum en JPQL** — escribes la ruta completa en Java del enum (paquete + clase + constante) directamente dentro del string de la query, y JPQL lo resuelve a la misma constante que tu código Java referenciaría como `EntryStatus.APPROVED`. Sin `@Param`, sin argumento extra en el método — el valor nunca cambia entre llamadas, así que no pertenece a la firma del método en absoluto.

> **¿Por qué no simplemente añadir un quinto `@Param("status") EntryStatus status`?** Porque eso diría "quien llama decide qué status cuenta", cuando todo el sentido de este arreglo es justo lo contrario: **`APPROVED` no es una elección de quien llama, es la propia definición del reporte de "horas reales".** Cualquier futuro llamador de `getHoursByProject` — este endpoint hoy, cualquier otro reporte que añadas más adelante — debe obtener el mismo número fiable, no un número que dependa de lo que a alguien se le ocurriera pasar. Un parámetro dejaría que un futuro bug (o un nuevo llamador descuidado) pidiera por accidente horas en `DRAFT` en un reporte de "totales"; un literal hace ese error estructuralmente imposible, porque la regla vive dentro de la propia query, no en quien la llama.

> **Contraste con los filtros dinámicos de [14-especificaciones-criteria-api.md](./14-especificaciones-criteria-api.md).** El filtro `status` de `GET /api/entries` es una `Specification` construida a partir de un `@RequestParam` precisamente *porque* se supone que quien llama lo elige (un empleado podría querer ver solo sus entries `SUBMITTED`). El `status = APPROVED` de este reporte es el caso opuesto: una regla de negocio que nunca cambia por petición. La misma pregunta de fondo las dos veces — "¿este valor varía según quien llama, o lo fija la regla?" — respuesta distinta, herramienta distinta: un parámetro para el primer caso, un literal para el segundo.

Por eso el orden del `GROUP BY` también importa aquí: la comparación del enum en `WHERE` se ejecuta **antes** de la agrupación (ver la tabla de cláusulas de arriba — `WHERE` decide qué filas se tienen en cuenta *en absoluto*, antes de que `GROUP BY` siquiera las vea), así que una entry `REJECTED` se descarta antes de llegar a ningún cubo, en vez de sumarse y luego restarse de algún modo después.

### De `?month=2025-05` a un rango de fechas — YearMonth

Archivo: `src/main/java/com/victor/timetrack/service/ReportService.java` — nota que es `ReportService`, **no** `TimeEntryService`: el método vive en el service agrupado por *feature*, y llega hasta el `TimeEntryRepository` agrupado por *entidad* que hay debajo, exactamente como predice la regla de los dos ejes de antes en este archivo.

El controller recibe `month=2025-05` como parámetro de query string. `java.time.YearMonth` representa exactamente eso — un año más un mes, sin día — y Spring puede vincularlo directamente desde el query string porque su formato de `toString()`/parsing es la misma forma ISO (`yyyy-MM`) que ya usa la URL, así que no hace falta ningún conversor personalizado. El único trabajo del controller es recibir ese `YearMonth` y pasárselo al service — convertirlo en un rango de fechas real es lógica de negocio (decidir *cómo* un mes se traduce a fechas concretas), así que vive en el service, siguiendo el mismo reparto de arquitectura por capas que se usa en todo el resto del proyecto: **el controller recibe, el service decide, el repositorio consulta.**

```java
// service — ReportService.java (el código real, los dos métodos de informe siguen esta forma)
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

> **Por qué los dos endpoints de informe llevan `@PreAuthorize("hasRole('MANAGER')")`.** `@PreAuthorize` es una anotación de Spring Security que pones en un método de controller: ejecuta la expresión que lleva dentro *antes* de que se ejecute el cuerpo del método, y rechaza la petición con un `403` si evalúa a false — `hasRole('MANAGER')` significa "quien llama, ya autenticado, debe tener el rol `MANAGER`". Está en los dos métodos de `ReportController` por una razón que sale directamente de la query de arriba: un informe `SUM`a horas **de todo el equipo**, así que entrega a quien llama datos de otras personas — a diferencia de `GET /api/time-entries`, donde `TimeEntryService.getAll()` reduce el resultado a `findByUser(user)` para quien no es manager. Cualquier endpoint que exponga datos más allá de "los míos" necesita una comprobación de rol explícita, porque el filtro JWT solo demuestra *quién* llama, nunca *qué* tiene permiso de ver. La misma anotación protege `GET /api/users` y los endpoints de mutación de proyectos. Tratamiento completo en [06-seguridad-jwt.md](./06-seguridad-jwt.md) — por ahora, léelo como "endpoint solo para managers, aplicado por el framework, no por un `if` en tu service".

---

## Dónde te deja esto — y qué viene después

La interfaz sin cuerpo ya no es un misterio. Spring Data escanea buscando interfaces que extienden `JpaRepository`, lee los tipos de entidad e id de sus parámetros genéricos, y **genera un proxy** que implementa toda la interfaz en tiempo de ejecución: los métodos CRUD heredados delegan en el `EntityManager` de Hibernate, los *nombres* de método como `findByActiveTrue` se parsean en queries al arrancar, y una cadena `@Query` se usa tal cual está escrita. Por debajo, Hibernate mantiene un metamodelo construido por reflexión a partir de tus clases `@Entity` y ensambla cada sentencia SQL a partir de él. Esa es toda la cadena: anotación → metamodelo → SQL → JDBC → PostgreSQL.

La capa de persistencia ya funciona. Lo que *no* hace es fallar con elegancia. Mira lo que el código de este archivo lanza de verdad cuando la realidad no coopera: `findById(id).orElseThrow(() -> new ResourceNotFoundException(...))` cuando la entrada no existe, una `BusinessRuleViolationException` cuando un manager intenta aprobar una entrada que no está `SUBMITTED`, y — sin ninguna ayuda tuya — una violación de constraint de Hibernate en el momento en que alguien se registra con un email que ya está en `users`, porque escribiste `@Column(unique = true)` y la base de datos lo está haciendo cumplir. Cada una de estas es una excepción lanzada en lo profundo de un service, varias capas por debajo de la respuesta HTTP.

Dejado así, cada una de ellas llega al cliente como lo mismo: un `500 Internal Server Error` con una traza de pila dentro. Un "usuario no encontrado" no es un error de servidor — es un `404`, y "las horas deben estar entre 0,5 y 24" es un `400` con un mensaje legible. Algo tiene que situarse entre la excepción y la respuesta y traducir una en la otra, en un solo sitio, para toda la API.

[05-manejo-excepciones.md](./05-manejo-excepciones.md) es ese algo: `@ControllerAdvice`, `@ExceptionHandler`, clases de excepción propias, y cómo una `ResourceNotFoundException` lanzada en `TimeEntryService` se convierte en un `404` limpio con cuerpo JSON sin un solo `try/catch` en ningún controller.
