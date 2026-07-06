# Spring Data JPA

> 📖 [Baeldung — Introduction to Spring Data JPA](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa)
> 📖 [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/reference/)

## JPA vs Hibernate — the spec vs the implementation

**JPA** (Jakarta Persistence API) is the specification — it defines the standard annotations (`@Entity`, `@Id`, `@ManyToOne`) and interfaces (`EntityManager`, `JpaRepository`). JPA itself does not execute queries.

**Hibernate** is the most common JPA implementation — it translates your annotated classes into actual SQL. Spring Boot uses Hibernate by default.

You write against the JPA spec; Hibernate does the work. This is the same pattern as `List<T>` (interface) vs `ArrayList<T>` (implementation) — you depend on the contract, not the specific library.

---

## @Entity — mapping a class to a table

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
- `@Table(name = "...")` — override the default table name; **convention: always use plural lowercase** (`users`, `projects`, `time_entries`) — avoids reserved word conflicts and is the standard in real projects
- `@Column(nullable = false)` — marks the column as NOT NULL in the database
- `@Column(unique = true)` — adds a unique constraint; combine with `nullable = false` when the field is required and must be unique: `@Column(nullable = false, unique = true)`
- `@Column(...)` — other properties: `length`, `name`, `updatable`
- `@CreationTimestamp` — Hibernate annotation; sets the field automatically to the current date and time when the entity is first saved; you never set this field manually in your code

**Default field values** — set directly on the field declaration; JPA respects the default when creating a new entity:

```java
private Boolean active = true;   // new projects are active by default
```
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
