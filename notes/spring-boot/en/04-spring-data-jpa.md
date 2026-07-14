# Spring Data JPA

> 📖 [Baeldung — Introduction to Spring Data JPA](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa)
> 📖 [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/reference/)

## JPA vs Hibernate — the spec vs the implementation

**JPA** (Jakarta Persistence API) is the specification — it defines the standard annotations (`@Entity`, `@Id`, `@ManyToOne`) and interfaces (`EntityManager`, `JpaRepository`). JPA itself does not execute queries.

**Hibernate** is the most common JPA implementation — it translates your annotated classes into actual SQL. Spring Boot uses Hibernate by default.

You write against the JPA spec; Hibernate does the work. This is the same pattern as `List<T>` (interface) vs `ArrayList<T>` (implementation) — you depend on the contract, not the specific library.

---

## @Entity — mapping a class to a table

Docs: https://www.baeldung.com/jpa-entities

```java
@Entity
@Table(name = "transactions")     // optional — default is the class name, lowercase
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
    private TransactionType type;   // INCOME or EXPENSE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // constructors, getters, setters
}
```

**Required annotations:**
- `@Entity` — marks the class as a JPA entity; Spring knows to manage it
- `@Id` — marks the primary key field
- `@GeneratedValue(strategy = GenerationType.IDENTITY)` — the database auto-increments the id (`SERIAL` / `BIGSERIAL` in PostgreSQL)

**Optional but common:**
- `@Table(name = "...")` — override the default table name; **convention: always use plural lowercase** (`users`, `projects`, `time_entries`) — avoids reserved word conflicts and is the standard in real projects. This is a deliberate mismatch with the class name: the Java class stays singular (`User`, `TimeEntry`) because it represents **one** instance — one object, one row. The table is plural because it holds a **collection** of those rows. Same split shows up on `@JoinColumn`: the field is a singular object (`private Project project`), but the column it generates is named after what it stores — a foreign key, e.g. `project_id` — never after the field name or the related class.
- `@Column(nullable = false)` — marks the column as NOT NULL in the database
- `@Column(unique = true)` — adds a unique constraint; combine with `nullable = false` when the field is required and must be unique: `@Column(nullable = false, unique = true)`
- `@Column(...)` — other properties: `length`, `name`, `updatable`
- `@CreationTimestamp` — Hibernate annotation; sets the field automatically to the current date and time when the entity is first saved; you never set this field manually in your code

**Default field values** — set directly on the field declaration; JPA respects the default when creating a new entity:

```java
private Boolean active = true;   // new projects are active by default

@Enumerated(EnumType.STRING)
private EntryStatus status = EntryStatus.DRAFT;   // new entries start as DRAFT
```

The enum case is a common trap: `status = 'DRAFT'` (single quotes) does not compile — `'DRAFT'` looks like a `char` literal but has 5 characters, which is invalid. An enum constant is never a string or a char; you always reference it through the enum type itself: `EntryStatus.DRAFT`.
- `@PrePersist` — runs before the entity is inserted for the first time

> **Reserved word trap:** `user` is a reserved word in PostgreSQL. A class named `User` without `@Table` causes a syntax error on startup. Always use `@Table(name = "users")` for the User entity. The same applies to other reserved words like `order`, `group`, `table`. Convention: use plural table names (`users`, `projects`) — this avoids most conflicts.

**`@GeneratedValue` — strategy options:**

| Strategy | What it does | PostgreSQL result |
|---|---|---|
| `@GeneratedValue` (no strategy) | Uses `AUTO` — Hibernate picks the best strategy | Creates a shared sequence (`users_seq`) |
| `@GeneratedValue(strategy = GenerationType.IDENTITY)` | Uses the database's own auto-increment | Uses `BIGSERIAL` column |
| `@GeneratedValue(strategy = GenerationType.SEQUENCE)` | Uses a named sequence | More control over sequence config |

`IDENTITY` is the most common choice in real projects — it uses the database's native mechanism and generates ids one at a time. `AUTO` (default) creates a sequence that increments by 50, which can leave gaps in ids.

---

## @Enumerated(EnumType.STRING) — safe enum persistence

Purpose: controls how JPA stores an enum value in the database. `STRING` stores the name (`"MANAGER"`); `ORDINAL` (the default) stores the position number (`0`, `1`, `2`). Always use `STRING`.

Docs: https://www.baeldung.com/jpa-enumerated-type → read: "Mapping Enum to String" and the ordinal gotcha

File: `src/main/java/com/victor/timetrack/model/User.java` and `TimeEntry.java`

```java
@Enumerated(EnumType.STRING)   // stores "MANAGER" or "EMPLOYEE" in the column
@Column(nullable = false)
private Role role;

@Enumerated(EnumType.STRING)   // stores "DRAFT", "SUBMITTED", "APPROVED", "REJECTED"
private EntryStatus status;
```

**Why `ORDINAL` is dangerous — the classic trap:**

```java
// Your enum today:
enum Role { EMPLOYEE, MANAGER }
// Stored as: 0=EMPLOYEE, 1=MANAGER

// You add a new role in the middle next week:
enum Role { EMPLOYEE, ADMIN, MANAGER }
// Now: 0=EMPLOYEE, 1=ADMIN, 2=MANAGER
// But the database still has rows with value 1 — they now mean ADMIN, not MANAGER!
// Every existing MANAGER became an ADMIN. Silent data corruption, no error.
```

With `STRING`, the stored value is `"MANAGER"` — adding a new enum value in the middle never changes what the existing rows mean.

> **Interviewers ask:** "Why did you use `EnumType.STRING` and not the default?" — explain the ordinal corruption risk. This is one of the questions that separates candidates who understand JPA from those who just followed a tutorial.

---

## Adding a NOT NULL column to a table that already has rows — @ColumnDefault

Purpose: `@ColumnDefault` makes Hibernate add a `DEFAULT` clause to the generated `ALTER TABLE`, so PostgreSQL has a value to backfill existing rows with. Without it, adding a required (`NOT NULL`) column to a table that already has data fails outright.

Docs: https://www.baeldung.com/hibernate-column-default-value → read: "Using @ColumnDefault"

File: `src/main/java/com/victor/timetrack/model/User.java`

```java
@ColumnDefault("true")
private boolean active;
```

**Why the plain `NOT NULL` column fails:**

```
Hibernate: alter table if exists users add column active boolean not null
ERROR: column "active" of relation "users" contains null values
```

Adding a column always starts the same way for every existing row: the new cell has nothing in it, so the database's first instinct is to put `NULL` there. But `NOT NULL` forbids exactly that value. The two rules contradict each other — "fill this with `NULL`" vs. "this can never be `NULL`" — and PostgreSQL aborts the whole `ALTER TABLE` rather than leave the table in a broken state. This has nothing to do with your Java code being wrong; it is a genuine gap in information: the database was never told what the old rows should have in that column.

**How `@ColumnDefault` closes that gap:**

```
Hibernate: alter table if exists users add column active boolean not null default true
```

With `DEFAULT true` inside the same statement, PostgreSQL now has an answer to "what goes in the old rows?" — it fills every existing row with `true` and adds the column in one atomic step. No contradiction, no manual data migration.

`@ColumnDefault` takes a **`String`**, not a typed Java value — its job is to paste literal SQL text after `DEFAULT` in the generated DDL, not to represent a Java boolean. That is why the same annotation works for any column type, with the quoting rules of SQL itself, not Java:

```java
@ColumnDefault("0")           // numeric literal — no quotes needed in SQL
@ColumnDefault("true")        // boolean literal — no quotes needed in SQL
@ColumnDefault("'PENDING'")   // text/enum literal — SQL requires single quotes around strings
```

> This is a Hibernate-specific annotation (`org.hibernate.annotations.ColumnDefault`), not part of the JPA spec — same category as `@CreationTimestamp` above: a convenience Hibernate adds on top of the standard.

> **Interviewers ask:** "What happens when you add a required column to a table with existing data?" — the answer is exactly this trade-off: either give the column a `DEFAULT` so the database can backfill it, or leave it nullable and backfill the data yourself before tightening the constraint later.

---

## Automatic timestamps — @CreationTimestamp, @UpdateTimestamp, @PrePersist

You almost never set `createdAt` / `updatedAt` by hand. There are two ways to fill them automatically — a Hibernate shortcut and the JPA-standard callback.

Docs: https://docs.jboss.org/hibernate/orm/current/javadocs/org/hibernate/annotations/CreationTimestamp.html → read: "@CreationTimestamp" and "@UpdateTimestamp"

```java
@CreationTimestamp                 // Hibernate sets it once, on the first insert
private LocalDateTime createdAt;

@UpdateTimestamp                   // Hibernate refreshes it on every update
private LocalDateTime updatedAt;
```

- `@CreationTimestamp` / `@UpdateTimestamp` are **Hibernate** annotations (not JPA). Hibernate fills the field for you — `createdAt` once when the row is inserted, `updatedAt` on every save.
- `@PrePersist` (and `@PreUpdate`) are the **JPA-standard** equivalents — lifecycle callbacks you write yourself:

```java
@PrePersist
public void onCreate() {
    this.createdAt = LocalDateTime.now();
}
```

> Which to use? `@CreationTimestamp` is less code and is the common choice in Spring Boot projects. `@PrePersist` is portable (pure JPA, works on any provider) and lets you run extra logic, not just set a timestamp. Interviewers ask "did you set `createdAt` manually?" — the good answer is "no, `@CreationTimestamp` does it", and knowing `@PrePersist` is the standard alternative.

---

## JpaRepository — what you get for free

Docs: https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa → read: the `JpaRepository` section

The repeating pattern: you define an interface; Spring generates the implementation.

```java
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Spring generates: save, findById, findAll, deleteById, count, existsById, etc.
}
```

The two type parameters: `Transaction` (entity type) and `Long` (type of the `@Id` field).

**Built-in methods you use most:**

```java
repository.save(transaction);          // insert or update
repository.findById(id);               // Optional<Transaction> — always check for empty
repository.findAll();                  // List<Transaction>
repository.deleteById(id);             // delete by id
repository.existsById(id);             // true/false
repository.count();                    // total row count
```

`findById` always returns `Optional<Transaction>`. Use `.orElseThrow()` to handle the "not found" case:

```java
Transaction transaction = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
```

---

## Derived query methods

Docs: https://www.baeldung.com/spring-data-derived-queries

Spring Data JPA parses the method name and generates the SQL — no implementation needed.

```java
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // findBy + field name → WHERE clause
    List<Transaction> findByType(TransactionType type);
    // SELECT * FROM transactions WHERE type = ?

    // Combining conditions
    List<Transaction> findByTypeAndUserId(TransactionType type, Long userId);
    // SELECT * FROM transactions WHERE type = ? AND user_id = ?

    // Ordering
    List<Transaction> findByUserOrderByDateDesc(User user);
    // SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC

    // Checking existence
    boolean existsByDescriptionAndUser(String description, User user);

    // Counting
    long countByType(TransactionType type);
}
```

**Pattern:** `findBy` + field names (PascalCase) + optional `And`/`Or` + optional `OrderBy` + field + `Asc`/`Desc`.

When the naming convention is not enough (complex joins, aggregates), use `@Query` with JPQL:

```java
@Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND YEAR(t.date) = :year")
List<Transaction> findByUserIdAndYear(@Param("userId") Long userId, @Param("year") int year);
```

---

## Pagination — Pageable and Page<T>

Returning every row is fine in a demo and dangerous in production. `repository.findAll()` on a table with 100,000 rows loads all of them into memory and serialises them to JSON in one response — slow, and it can crash the app. The interview question is exactly this: "what happens if you call `findAll()` on a huge table?"

Docs: https://docs.spring.io/spring-data/jpa/reference/repositories/query-methods-details.html → read: "Paging, Iterating Large Results, Sorting & Limiting"

The fix is built into `JpaRepository`: accept a `Pageable` and return a `Page<T>`.

```java
// repository — JpaRepository already declares findAll(Pageable); derived queries can take it too
Page<Transaction> findByType(TransactionType type, Pageable pageable);
```

```java
// controller — Spring builds the Pageable from ?page=0&size=20&sort=date,desc automatically
@GetMapping
public Page<TransactionResponse> getAll(Pageable pageable) {
    return service.getAll(pageable);
}

// service — Page has a map() so you convert entities to DTOs without losing the metadata
public Page<TransactionResponse> getAll(Pageable pageable) {
    return repository.findAll(pageable).map(this::toResponse);
}
```

- `Pageable` describes *which* page: page number, page size, and sort order. Spring builds it automatically from the query string (`?page=0&size=20&sort=date,desc`), so you parse nothing yourself.
- `Page<T>` is the result: the rows for that page **plus** metadata — `getTotalElements()`, `getTotalPages()`, `getNumber()`. The Angular client uses that metadata to render its paginator.
- `PageRequest.of(0, 20)` is how you build a `Pageable` by hand when there is no request (a test, a scheduled job).

> Under the hood Spring Data runs two queries: a `LIMIT ... OFFSET ...` for the page rows and a `COUNT(*)` for the total — that is how `Page` knows `getTotalPages()`. On a massive table you can return `Slice<T>` instead (no count query) when you only need "is there a next page?".

---

## Relationships — @ManyToOne and @OneToMany

Docs: https://www.baeldung.com/hibernate-one-to-many

One user has many transactions. In the database, the `transactions` table has a `user_id` foreign key column. The rule: **the entity whose table has the FK column gets `@ManyToOne`**.

```java
// Transaction — the "many" side — has the FK column (user_id)
@Entity
public class Transaction {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")    // the FK column in the transactions table
    private User user;
}

// User — the "one" side — no FK column, uses mappedBy to point back to Transaction
@Entity
public class User {

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();
}
```

`mappedBy = "user"` tells JPA that the `user` field in `Transaction` owns the relationship. JPA reads the FK column from there, not from the `User` side.

`cascade = CascadeType.ALL` — when you save/delete a User, the operation cascades to their transactions automatically.

### cascade vs orphanRemoval

These look similar but answer different questions:

- **`cascade = CascadeType.ALL`** — propagates an operation on the parent to its children. Save the user → its transactions are saved too; delete the user → its transactions are deleted too.
- **`orphanRemoval = true`** — deletes a child when it is *removed from the parent's collection*, even if you never delete the parent: `user.getTransactions().remove(t)` → that transaction row is deleted.

> The distinction interviewers want: `cascade` is about operations flowing parent → child; `orphanRemoval` is about a child that no longer belongs to any parent being deleted. Use `orphanRemoval` for true parent-owned children (a project and its time entries). Be careful with `cascade = ALL` on `@ManyToOne` — you rarely want deleting one transaction to delete its user.

---

## @ManyToMany — relationships through a join table

`@ManyToOne` / `@OneToMany` model "one user has many transactions". `@ManyToMany` is for "many on both sides" — a `Project` can have many `User`s and a `User` can work on many `Project`s. Neither table can hold the foreign key, so JPA needs a third table — a **join table** — that just stores pairs of ids.

Docs: https://jakarta.ee/specifications/persistence/3.1/apidocs/jakarta.persistence/jakarta/persistence/manytomany → read: "@ManyToMany" and "@JoinTable"

```java
@Entity
@Table(name = "projects")
public class Project {

    @ManyToMany
    @JoinTable(
        name = "project_members",                          // the join table
        joinColumns = @JoinColumn(name = "project_id"),    // this entity's FK in the join table
        inverseJoinColumns = @JoinColumn(name = "user_id") // the other entity's FK
    )
    private List<User> members = new ArrayList<>();
}

@Entity
@Table(name = "users")
public class User {

    @ManyToMany(mappedBy = "members")  // inverse side — points to the field above
    private List<Project> projects = new ArrayList<>();
}
```

- The side with `@JoinTable` is the **owning** side — it controls the join table. The side with `mappedBy` is the inverse side (same `mappedBy` rule as `@OneToMany`).
- The join table (`project_members`) has only two columns: `project_id` and `user_id`. In the simple case you never create an entity for it.

> **The gotcha interviewers reach for:** the moment the link itself needs data — *when* a user joined a project, or their role on it — `@ManyToMany` is not enough. You replace it with a real join entity (`ProjectMembership` with its own `@Id`, `joinedAt`, `role`) and two `@ManyToOne` relationships pointing at it. "What if the relationship has attributes?" is the standard follow-up.

---

## FetchType.LAZY vs FetchType.EAGER

Docs: https://www.baeldung.com/hibernate-lazy-eager-loading

| | LAZY | EAGER |
|---|------|-------|
| When loaded | Only when you access the field | Immediately with the parent |
| Default for `@ManyToOne` | No (EAGER is the default!) | — |
| Default for `@OneToMany` | Yes | — |
| Performance | Better — loads only what you need | Can trigger unexpected extra queries |
| When to use | Almost always | Only when you always need the related data |

**Always declare `FetchType.LAZY` explicitly** — even on `@ManyToOne` where EAGER is the surprising default:

```java
@ManyToOne(fetch = FetchType.LAZY)   // explicit LAZY — do not leave it as the EAGER default
@JoinColumn(name = "user_id")
private User user;
```

---

## The N+1 problem

Docs: https://www.baeldung.com/spring-data-jpa-n-plus-1-problem

This is one of the most common performance mistakes in JPA applications.

```java
// Loading 100 transactions — 1 query
List<Transaction> transactions = repository.findAll();

// Accessing user.getName() on each — 100 more queries (one per transaction)
for (Transaction t : transactions) {
    System.out.println(t.getUser().getName());  // LAZY load triggers here, 1 query per item
}
// Total: 1 + 100 = 101 queries
```

**Fix — use JOIN FETCH in a `@Query`** to load both entities in one query:

```java
@Query("SELECT t FROM Transaction t JOIN FETCH t.user WHERE t.user.id = :userId")
List<Transaction> findAllWithUser(@Param("userId") Long userId);
// Total: 1 query
```

Or use `@EntityGraph` on the repository method:

```java
@EntityGraph(attributePaths = {"user"})
List<Transaction> findAll();
```

---

## save() — insert or update

Docs: https://www.baeldung.com/jpa-persist-merge → read: the contrast with `save()`'s insert-or-update behaviour

`save()` decides by checking the `@Id` field:
- `id == null` → **INSERT** (new entity)
- `id != null` → **UPDATE** (merge existing entity)

```java
Transaction t = new Transaction();
t.setAmount(BigDecimal.valueOf(100));
repository.save(t);   // INSERT — id is null, JPA sets it after insert

t.setAmount(BigDecimal.valueOf(200));
repository.save(t);   // UPDATE — id is now set by the database
```

You do not need separate `insert()` and `update()` methods — `save()` handles both.

---

## Aggregation queries and interface projections

Every repository method you've seen so far returns entities — `Transaction`, `List<Transaction>`, `Page<Transaction>`. But a report like "total hours per project this month" is not an entity. There is no `Report` table, no `@Id`, no single row you could `save()` — it is a **computed** result: one row per project, with a `SUM()` of a related table's column. Returning a `List<Project>` for this makes no sense — a `Project` doesn't have a `totalHours` field, and it shouldn't, because that number depends on a date range you pick at request time, not on anything stored on the project itself.

**Purpose:** an interface projection tells Spring Data JPA the *shape* of a computed result — which fields exist and their types — without you writing a class or any mapping code. Spring generates the implementation for you at runtime.

**File:** `src/main/java/com/victor/timetrack/dto/response/ProjectHoursReportResponse.java`

**Docs:** https://www.baeldung.com/spring-data-jpa-projections → read: "Interface-based Projections"

```java
public interface ProjectHoursReportResponse {
    String getProjectName();
    BigDecimal getTotalHours();
}
```

> **Why does the interface only have two methods if the report returns many projects?** Don't confuse the *list* with the *shape of one row*. `List<ProjectHoursReportResponse>` is what carries "how many rows" — one element per project that had entries in the range. `ProjectHoursReportResponse` itself describes the shape of a *single* one of those rows — the two fields every row needs, not "two rows total". Spring instantiates one proxy object per row that comes back from the query; each of those objects implements the interface, so each one has both `getProjectName()` and `getTotalHours()` available — but calling `getProjectName()` on the object built from row 1 returns `"TimeTrack"`, while calling it on the object built from row 2 returns `"Marketing"`. Same two methods on every object (the fixed contract), different values per object (because each is built from a different row). This is the exact same relationship as a regular class and its instances: `new Project()` twice gives you two objects that share the same `getName()` method but each returns its own data — the only difference here is that you never write `new` yourself, Spring does it once per row.
>
> **Why an interface and not a class with `@Data`, like every other response DTO in this project?** Every other DTO (`ProjectResponse`, `UserResponse`...) is a class you instantiate yourself — you write `new ProjectResponse()` (or a mapper does it) and fill each field by hand in your own Java code. A projection is different: **you never construct it**. Spring Data reads the column aliases coming back from the database query (`SUM(te.hours) AS totalHours`) and, because Java can generate a proxy object that implements any interface at runtime, it builds an object on the fly whose `getTotalHours()` returns exactly that column's value — no class body, no constructor, no manual mapping needed. A `class` cannot be built this way because a class needs a constructor Spring would have to call with the right arguments in the right order; an interface only promises "something with this method exists", which is all a runtime proxy needs to satisfy.

**The alias-to-getter contract — this is the actual mechanism, not just a convention:**

Spring matches each getter to a column alias using the standard Java Bean naming rule: strip `get` from the method name, lowercase the first letter, and that is the name it looks for among the query's aliases.

```
getProjectName()   →   looks for alias "projectName"
getTotalHours()    →   looks for alias "totalHours"
```

This is exactly why the JPQL query below writes `AS projectName` and `AS totalHours` — those strings are not decoration, they are the literal contract the interface depends on. Rename a getter to `getHours()` without renaming the alias to `hours`, and that field silently comes back `null` — Spring doesn't error, because from its point of view "no alias named `hours`" is a perfectly valid case (the field is just unset).

> **MAL** — alias and getter name don't match, no error, silent bug:
> ```java
> // interface says getTotalHours()
> // query says:
> SELECT te.project.name AS projectName, SUM(te.hours) AS hours   // ← "hours", not "totalHours"
> // result: report.getTotalHours() always returns null, and nothing tells you why
> ```
> **BIEN** — alias matches the getter name exactly:
> ```java
> SELECT te.project.name AS projectName, SUM(te.hours) AS totalHours
> ```

### The aggregation query itself — SUM + GROUP BY in JPQL

JPQL (Jakarta Persistence Query Language) looks like SQL but queries your **entities and their fields**, not tables and columns directly — `te.project.name` walks the Java object graph (`TimeEntry.project.name`), and Hibernate translates that path into the SQL join for you.

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

- `SUM(te.hours)` — a JPQL aggregate function; it works the same way `SUM()` does in raw SQL, adding up `hours` across every `TimeEntry` row that matches the `WHERE`, per group.
- `GROUP BY te.project.name` — **this is what turns many rows into one row per project.** Without it, `SUM()` would collapse the *entire* result set into a single total across all projects. `GROUP BY` tells the database "first split the matching rows into buckets by this value, then aggregate within each bucket separately" — one bucket per distinct `project.name`, one `SUM()` result per bucket.

  Worked example — say the `WHERE` clause leaves these three `TimeEntry` rows for May 2025:

  ```
  TimeTrack  — 3h
  TimeTrack  — 5h
  Marketing  — 2h
  ```

  `GROUP BY te.project.name` splits them into two buckets by project name, and `SUM(te.hours)` runs **separately inside each bucket**:

  ```
  bucket "TimeTrack":  3 + 5  →  totalHours = 8
  bucket "Marketing":  2      →  totalHours = 2
  ```

  Final result: two rows — `{projectName: "TimeTrack", totalHours: 8}` and `{projectName: "Marketing", totalHours: 2}`. Remove `GROUP BY` and you'd get one row with `totalHours = 10` (everything summed together, project identity lost).
- `WHERE te.date BETWEEN :start AND :end` — the month filter. `TimeEntry` has no `month` field (only `date`, a `LocalDate`), so "May 2025" has to become a range: the first and last day of that month. This is exactly what `YearMonth` (see the callout below) is built to produce.
- `List<ProjectHoursReportResponse>` as the return type is what tells Spring Data to build proxy objects of that interface from the result — not entities.

> **Reading the table below:** each row pairs a JPQL clause with the plain-English question it answers about the final result — useful when a report query stops returning what you expect and you need to check each clause in isolation.

| Clause | Question it answers |
|---|---|
| `SELECT ... AS alias` | Which columns come back, and what getter do they map to? |
| `WHERE` | Which rows are considered at all, before any grouping? |
| `GROUP BY` | How are the surviving rows split into buckets? |
| `SUM(...)` (inside `SELECT`) | What is computed *within* each bucket? |

### From `?month=2025-05` to a date range — YearMonth

The controller receives `month=2025-05` as a query string. `java.time.YearMonth` represents exactly that — a year plus a month, no day — and Spring can bind it straight from the query string because its `toString()`/parsing format is the same ISO shape (`yyyy-MM`) the URL already uses, so no custom converter is needed.

```java
@GetMapping("/by-project")
@PreAuthorize("hasRole('MANAGER')")
public List<ProjectHoursReportResponse> getByProject(@RequestParam YearMonth month) {
    LocalDate start = month.atDay(1);          // 2025-05-01
    LocalDate end = month.atEndOfMonth();       // 2025-05-31 (handles 28/29/30/31 correctly)
    return timeEntryRepository.getHoursByProject(start, end);
}
```

> **Why not just parse `month` as a `String` and slice it?** You could split `"2025-05"` on `-` and build a `LocalDate` by hand, but then you own the edge cases yourself — how many days does May have? Does the app still work correctly in a leap-year February? `YearMonth.atEndOfMonth()` already knows the answer for every month, including February 28 vs 29, so the calendar logic never has to be reasoned about by hand.

**Why `@PreAuthorize("hasRole('MANAGER')")` here specifically:** reports aggregate hours across the whole team, not just the caller's own entries — the same review-concept rule already used on `GET /api/users` and project mutation endpoints (see the reserved-word callout pattern above): any endpoint that exposes data beyond "my own" needs an explicit role check, because Spring Security's JWT filter only proves *who* is calling, never *what* they're allowed to see.
