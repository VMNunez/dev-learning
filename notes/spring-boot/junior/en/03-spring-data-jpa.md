# Spring Data JPA

> 📖 [Baeldung — Introduction to Spring Data JPA](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa)
> 📖 [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/reference/)

---

[18-dependency-injection.md](./18-dependency-injection.md) closed on a bean that should not exist. `TimeEntryRepository` is an **interface**. It has no body, no `@Repository`, no `@Component`, and there is no class anywhere in TimeTrack that implements it — yet `TimeEntryService`'s constructor asks for one, Spring finds one, and `findByUser(user)` comes back with rows from PostgreSQL. A container that only instantiates classes *you* wrote cannot explain that.

Here is what actually happens at startup. Spring Boot sees `spring-boot-starter-data-jpa` on the classpath and switches on **Spring Data's repository scanning**: it walks your packages looking not for annotated *classes* but for **interfaces that extend `Repository`** (which `JpaRepository` does, several levels up). For each one it finds, it does two things:

```
1. FIND       TimeEntryRepository  extends JpaRepository<TimeEntry, Long>
                                                          ↑        ↑
                                            the entity ───┘        └─── its @Id type
2. GENERATE   a proxy object implementing that interface, at runtime, in memory
                 · methods declared by JpaRepository (save, findById, findAll…)
                   → delegate to SimpleJpaRepository, which calls the EntityManager
                 · methods YOU declared (findByUser, findByActiveTrue…)
                   → the method NAME is parsed into a query (see "Derived query methods")
                 · methods carrying @Query
                   → the JPQL string you wrote is used directly
3. REGISTER   put that proxy in the ApplicationContext under "timeEntryRepository"
```

So the object Spring injects is not an instance of a class in your source tree — it is a **proxy**, a class synthesised in memory at startup whose only job is to implement your interface. That is why there is no file to open, no `new` to find, and no `@Repository` needed: the annotation exists to register a class *you* wrote, and here there is no class. (The exception translation `@Repository` normally provides is applied to the proxy anyway — Spring Data does it for you. That is the loose end left in file 03.)

Everything else in this file follows from those three steps. Step 1 needs an **entity** — a class mapped to a table, which is what `@Entity` does. Step 2 needs a way to turn Java into SQL — that is Hibernate. Start there.

---

## JPA vs Hibernate — the spec vs the implementation

Purpose: separate the two names you will see used interchangeably — one is a set of interfaces you code against, the other is the engine that actually produces SQL — because every "why did Hibernate generate *that* query?" question depends on knowing which of the two is doing the work.

File: `src/main/java/com/victor/timetrack/model/TimeEntry.java` — every annotation on it (`@Entity`, `@Id`, `@ManyToOne`, `@Column`) is JPA; the `@CreationTimestamp` and `@UpdateTimestamp` right next to them are Hibernate

Docs: https://www.baeldung.com/jpa-hibernate-difference → read: "JPA" and "Hibernate" — what the spec defines vs what the implementation adds

**JPA** (Jakarta Persistence API) is a **specification**: a set of interfaces and annotations, plus a written contract describing what an implementation must do with them. `@Entity`, `@Id`, `@Column`, `@ManyToOne`, `EntityManager` — all JPA. Ship an app with only the JPA jar on the classpath and nothing happens: a specification contains no executable persistence logic. It is a contract, not an engine.

**Hibernate** is the engine — the most widely used JPA implementation, and the one `spring-boot-starter-data-jpa` pulls in by default. It is what reads your annotations and emits SQL.

```
your code   →   JPA annotations/interfaces   →   Hibernate   →   JDBC   →   PostgreSQL
(TimeEntry)     (the contract: @Entity, @Id)     (the engine)   (driver)   (the database)
```

You already know this shape from plain Java: you declare `List<String> names` (the interface) and get an `ArrayList` (the implementation) at runtime. Same move, one layer up — your code names the contract, the framework supplies the engine.

**How Hibernate actually turns an annotation into SQL.** This is the part that is usually skipped, and it is what makes the generated queries stop feeling arbitrary. At startup Hibernate does a **bootstrap** pass, and at runtime a **translation** pass:

1. **Bootstrap (once, at startup).** Hibernate scans the classes carrying `@Entity` and reads their annotations **by reflection** — the same mechanism that lets Java inspect a class's fields and their annotations at runtime, without the class telling it anything. From that it builds an in-memory **metamodel**: a data structure that records, for each entity, "the Java class `TimeEntry` ↔ the table `time_entries`; the field `date` ↔ the column `date`, type `LocalDate` → SQL `date`, `NOT NULL`; the field `project` ↔ a foreign-key column `project_id` pointing at `projects.id`". Nothing has touched the database yet — this is Hibernate building its own map of your domain.

   ```
   TimeEntry.java  ──reflection──▶  metamodel entry
     @Table(name="time_entries")      table:   time_entries
     @Id Long id                      pk:      id (bigint)
     @Column(nullable=false)          column:  date (date, NOT NULL)
     LocalDate date
     @ManyToOne @JoinColumn(          column:  project_id (bigint) → FK projects(id)
       name="project_id")
     Project project
   ```

2. **Translation (on every operation).** When your code calls `timeEntryRepository.save(entry)`, Hibernate never inspects the annotations again — it looks the entity up in that metamodel and **assembles a SQL string from it**: table name from the metamodel, one column per mapped field, one `?` placeholder per value. It hands that string plus the values to JDBC as a `PreparedStatement`, and JDBC sends it to PostgreSQL.

   ```sql
   -- what Hibernate assembles for a save() on a new TimeEntry
   insert into time_entries (created_at, date, description, hours, project_id,
                             rejection_note, status, updated_at, user_id, id)
   values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   ```

The same two passes explain the tables appearing in pgAdmin without you writing a line of DDL: with `spring.jpa.hibernate.ddl-auto=update`, Hibernate compares its metamodel against the real schema at startup and emits the `create table` / `alter table` statements needed to close the gap. Every generated statement in this file — including the failing `alter table` in the `@ColumnDefault` section below — comes out of that comparison.

> **Turn the SQL on and stop guessing.** `spring.jpa.show-sql=true` in `application.properties` prints every statement Hibernate sends. This is not a debugging luxury — it is how you *see* the N+1 problem at the end of this file instead of theorising about it, and the first thing to switch on when a query behaves strangely. Docs: https://www.baeldung.com/sql-logging-spring-boot.

> **So why write to the spec at all, if Hibernate is always the one running?** Because your *code* only ever names JPA types, swapping the implementation would be a dependency change, not a rewrite. That is the theory. In practice nobody swaps Hibernate — the real payoff is smaller and more honest: it tells you which annotations are portable JPA (`@Entity`, `@Column`, `@Enumerated`) and which are Hibernate extras (`@CreationTimestamp`, `@ColumnDefault`), and that distinction is a standard interview question. TimeTrack's `TimeEntry` carries both kinds, side by side.

---

## @Entity — mapping a class to a table

Purpose: mark a class as one that Hibernate should map onto a database table — this is the annotation that puts the class into the metamodel above, without which the class is an ordinary Java object and no repository can persist it.

File: `src/main/java/com/victor/timetrack/model/TimeEntry.java`, `.../model/User.java`, `.../model/Project.java`

Docs: https://www.baeldung.com/jpa-entities → read: "The Entity Annotation", "The Id Annotation" and "The Table Annotation"

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

> **The code block above is a generic `Transaction` entity, not a TimeTrack class** — it is deliberately dense so every annotation appears in one place. The three real entities are `User`, `Project` and `TimeEntry` (the `File:` line above), and they are quoted directly throughout the rest of this file.

**`@GeneratedValue` — strategy options:**

> **Reading the table:** the **Strategy** column is what you type in Java; the **PostgreSQL result** column is what that choice makes Hibernate create *in the database* — and it is the column that decides for you, because the two differ in where the next id is produced (in the database's own column counter, or in a separate sequence object Hibernate reads from).

| Strategy | What it does | PostgreSQL result |
|---|---|---|
| `@GeneratedValue` (no strategy) | Uses `AUTO` — Hibernate picks the best strategy | Creates a sequence (e.g. `users_seq`) |
| `@GeneratedValue(strategy = GenerationType.IDENTITY)` | Uses the database's own auto-increment | Uses `BIGSERIAL` column |
| `@GeneratedValue(strategy = GenerationType.SEQUENCE)` | Uses a named sequence | More control over sequence config |

`IDENTITY` is the most common choice in real projects — it uses the database's native mechanism and generates ids one at a time. `AUTO` (the default) creates a sequence that increments by **50**, which is why ids in a fresh table can jump from `1` to `52`: Hibernate reserves a block of 50 values in one round trip and hands them out in memory, so it does not have to ask the database for every single insert. Fast, and gap-prone.

> **What TimeTrack actually does.** All three entities declare the bare `@Id @GeneratedValue` — **no strategy**, so they are on `AUTO`, and Hibernate creates `users_seq`, `projects_seq` and `time_entries_seq` with the 50-increment behaviour above. It works, and the gaps are cosmetic (an id is an identifier, not a count). Knowing you are on `AUTO` matters for the interview answer, though: "the default is `AUTO`, which is sequence-backed with `allocationSize = 50`; I would write `IDENTITY` explicitly if I wanted the database's own `BIGSERIAL` counter and contiguous ids." Docs: https://www.baeldung.com/hibernate-identifiers.

---

## @Enumerated(EnumType.STRING) — safe enum persistence

Purpose: controls how JPA stores an enum value in the database. `STRING` stores the name (`"MANAGER"`); `ORDINAL` (the default) stores the position number (`0`, `1`, `2`). Always use `STRING`.

Docs: https://www.baeldung.com/jpa-persisting-enums-in-jpa → read: "@Enumerated(EnumType.ORDINAL)" and "@Enumerated(EnumType.STRING)" — the two options, side by side

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

Docs: https://www.baeldung.com/jpa-default-column-values → read: the `@ColumnDefault` section (and note how the annotation shows up in the generated DDL)

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

**The trap: `@ColumnDefault` does NOT set the default for new rows your app creates.**

This is the easy thing to get wrong, and it hides a real bug. There are **two different doors** a row can enter the `users` table through, and each door has its **own** default — they are set in different places and do not cover each other:

```
Door 1 — through your app (Hibernate)      Door 2 — through raw SQL
new User(...)  →  Hibernate INSERT          INSERT INTO users (...) VALUES (...)
                                            (pgAdmin by hand, data.sql, another program)
        │                                            │
        ▼                                            ▼
default comes from the JAVA FIELD           default comes from the DB COLUMN
   private boolean active = true;              @ColumnDefault("true")
```

The reason they don't overlap is how Hibernate builds the `INSERT`. When you save a `new User(...)`, Hibernate reads the current value of every field on the object and writes each one **explicitly** into the SQL. A `@ColumnDefault` only fires when the `INSERT` **doesn't mention the column at all** — and Hibernate always mentions it, because the object always has a value for it.

Now the bug. A primitive `boolean` in Java is never empty — if you don't assign it, Java sets it to `false` automatically (that is the language rule for `boolean`, not something Hibernate does). So with this field:

```java
@ColumnDefault("true")   // ← Door 2 only: raw SQL inserts
private boolean active;  // ← Java sets this to false before you touch it
```

every `User` created in code is born `active = false`, and Hibernate faithfully writes `active = false` into the `INSERT`. The `@ColumnDefault("true")` never gets a say, because the column *was* mentioned. Result: a brand-new user is saved deactivated — and once "inactive users can't log in" is enforced, that user can never log in.

> **So is `@ColumnDefault` dead code?** No — it still guards Door 2. If someone runs a raw `INSERT` that omits `active` (a `data.sql` seed, a manual pgAdmin insert, another service writing to the same table), PostgreSQL falls back to `DEFAULT true`. It is genuinely useful there. It is just the *wrong tool* for Door 1, which is the door your app actually uses every day. The lesson is not "remove it" — it is "you need both".

The fix is to give the **Java field** its own default, so the object is born `true` before Hibernate ever looks at it:

```java
// MAL — @ColumnDefault alone; every User created in Java is born active = false
@ColumnDefault("true")
private boolean active;

// BIEN — both doors covered: Java default for app inserts, @ColumnDefault for raw SQL
@ColumnDefault("true")
@Column(nullable = false)
private boolean active = true;
```

> **Why also `@Column(nullable = false)`?** The Java-side `= true` protects rows *your app* creates, but it lives only in Java — it cannot stop a raw SQL `INSERT` from writing `NULL`. `@Column(nullable = false)` pushes the guarantee down to the database itself, so the invariant "a user is always either active or inactive, never unknown" holds no matter which door the row came through. (A primitive `boolean` can never *be* `null` in Java — but the DB column, written directly, could.)

> **`@ColumnDefault` and `@Column(nullable = false)` are read at the same moment, but they don't protect the same way afterwards.** Both are read once, when Hibernate generates the DDL at startup (`ddl-auto=update`) — so far they look identical. But what each one produces behaves differently from then on: `@ColumnDefault` becomes a `DEFAULT` clause that PostgreSQL only consults **per insert**, and only when that specific insert omits the column. `@Column(nullable = false)` becomes a `NOT NULL` constraint baked permanently into the table's schema — after that one-time DDL step, Hibernate is no longer involved at all. PostgreSQL itself rejects any future `NULL` write on that column, forever, no matter who sends it — Hibernate, pgAdmin, a script, another service. Hibernate only writes the rule once; the database is what enforces it after that, for every writer, not just Hibernate.

---

## Automatic timestamps — @CreationTimestamp, @UpdateTimestamp, @PrePersist

Purpose: fill `createdAt` / `updatedAt` without ever assigning them in your service code — the value is produced by Hibernate (or by a JPA lifecycle callback) at the moment the row is written, so it cannot be forgotten, faked, or set to a client-supplied time.

File: `src/main/java/com/victor/timetrack/model/TimeEntry.java` (both annotations) and `.../model/Project.java` (`@CreationTimestamp` only — a project is never "updated at" anything the UI shows)

Docs: https://www.baeldung.com/hibernate-creationtimestamp-updatetimestamp → read: "@CreationTimestamp" and "@UpdateTimestamp"

You almost never set `createdAt` / `updatedAt` by hand. There are two ways to fill them automatically — a Hibernate shortcut and the JPA-standard callback. TimeTrack uses the shortcut, and this is the real `TimeEntry` code (the whole declaration — no `@Column`, no setter, nothing else):

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

> **Where does the value come from — the database's clock or the app's?** From the **JVM's** clock, by default. `@CreationTimestamp` is not translated into SQL's `now()`; Hibernate calls the Java clock while assembling the `insert`, and sends the resulting timestamp as one more `?` parameter, exactly like `hours` or `description`. That matters the day the app server and the database server sit in different time zones or drift apart — the row's `created_at` reflects *the application's* idea of now, not PostgreSQL's. (Hibernate 6 can be told to use the database instead, with `@CreationTimestamp(source = SourceType.DB)`, at the cost of an extra round trip to ask for its time.)

> Which to use? `@CreationTimestamp` is less code and is the common choice in Spring Boot projects. `@PrePersist` is portable (pure JPA, works on any provider) and lets you run extra logic, not just set a timestamp. Interviewers ask "did you set `createdAt` manually?" — the good answer is "no, `@CreationTimestamp` does it", and knowing `@PrePersist` is the standard alternative.

---

## JpaRepository — what you get for free

Purpose: get a working data-access object for an entity by writing nothing but an interface declaration — the CRUD methods every table needs (`save`, `findById`, `findAll`, `deleteById`…) are inherited, and the proxy from the top of this file implements them.

File: `src/main/java/com/victor/timetrack/repository/UserRepository.java`, `.../ProjectRepository.java`, `.../TimeEntryRepository.java`

Docs: https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa → read: the `JpaRepository` section

The repeating pattern: you define an interface; Spring generates the implementation. TimeTrack's three repositories are literally this — an `extends` clause and, at most, two or three declared methods:

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByActiveTrue();
}
```

The two type parameters: the **entity type** (`User`) and the type of its **`@Id` field** (`Long`). Get the second one wrong — write `JpaRepository<User, Integer>` when the id is a `Long` — and `findById(1L)` will not compile, because the inherited method's parameter type is whatever you put in that slot. The generics are not decoration: they are what makes `save(User)` return a `User` and `findById(Long)` return an `Optional<User>` instead of an `Optional<Object>`.

> **No `@Repository`, no implementation class — and that is correct.** None of TimeTrack's three repositories carry an annotation of any kind. They do not need one: Spring Data finds them by the `extends JpaRepository` in the declaration, not by a marker on top (the scan-and-generate sequence at the top of this file). Writing `@Repository` on them changes nothing; leaving it off is what real Spring Data code looks like.

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

## Repositories group by entity, not by feature — a different axis than controllers/services

Purpose: decide *which* repository a new query belongs in — the rule is the entity in its `FROM` clause, not the feature that asked for it, and getting this wrong is how a project ends up with a repository that has no entity behind it.

File: `src/main/java/com/victor/timetrack/repository/TimeEntryRepository.java` — it holds both `findByUser` and the two report aggregations, and there is no `ReportRepository` in the project

Docs: https://www.baeldung.com/spring-data-repositories → read: the sections on the `Repository` hierarchy and what a repository interface is bound to

Controllers and services in this project are organized by **feature** — one pair per resource the API exposes: `ProjectController`/`ProjectService`, `TimeEntryController`/`TimeEntryService`, `ReportController`/`ReportService`. Every new endpoint gets its own pair, following that pattern strictly (see [11-business-logic-domain-modeling.md](11-business-logic-domain-modeling.md) for why controllers never skip straight to the repository).

Repositories follow a **different rule entirely**: one repository per **entity**, fixed by the `extends JpaRepository<Entity, Long>` declaration itself. `TimeEntryRepository extends JpaRepository<TimeEntry, Long>` is permanently tied to the `TimeEntry` entity — that relationship isn't a naming convention you could break, it's baked into the generic type parameter, which is what lets Spring generate `save()`, `findById()`, etc. for that specific entity.

This matters the moment you build a feature — like a report — that has its own controller and service but produces data that **isn't a persisted entity**. There is no `Report` table, no `@Entity Report`, so there's nothing for a hypothetical `ReportRepository` to `extends JpaRepository<..., ...>` against. Its `@Query` would just be a loose method with no entity binding — breaking the one-repository-per-entity pattern every other repository in the project follows.

The fix: put the query where its `FROM` clause actually points. A report built with `FROM TimeEntry te ...` is a query *about* `TimeEntry` rows (grouped and aggregated, but still `TimeEntry` rows) — so it belongs on `TimeEntryRepository`, the same repository that already owns `findByUser`. The feature-shaped grouping (`ReportController` → `ReportService`) still exists one layer up; it just calls into the entity-shaped repository underneath, same as any other service does:

```
ReportController  →  ReportService  →  TimeEntryRepository   (query's FROM is TimeEntry)
```

> **The two axes side by side:**
>
> | Layer | Grouped by | Example |
> |---|---|---|
> | Controller / Service | Feature (the resource the API exposes) | `ReportController`/`ReportService` for reports |
> | Repository | Entity (what `JpaRepository<X, Long>` is bound to) | `TimeEntryRepository` for anything reading `TimeEntry` rows, aggregated or not |
>
> A new feature almost always means a new controller+service pair. It does **not** automatically mean a new repository — check first whether the query's `FROM` targets an entity you already have a repository for.

TimeTrack's `getHoursByProject` aggregation query is the concrete example of this rule, and you will see it in full at the end of this file ("Aggregation queries and interface projections"): its `@Query` lives in `TimeEntryRepository`, not in a `ReportRepository`, precisely because its `FROM` clause reads `FROM TimeEntry te`. `ReportService` — the feature-shaped layer — is the thing that calls it.

---

## Derived query methods

Purpose: get a custom `WHERE` clause by *naming a method* — Spring Data parses the name into a query, so a filter like "only the active projects" costs one line in an interface and no SQL at all.

File: `src/main/java/com/victor/timetrack/repository/ProjectRepository.java` (`findByActiveTrue()`), `.../UserRepository.java` (`findByEmail(String)`), `.../TimeEntryRepository.java` (`findByUser(User)`)

Docs: https://www.baeldung.com/spring-data-derived-queries → read: "Method Names Query Creation" and the keyword table

Spring Data JPA parses the method name and generates the SQL — no implementation needed. This is step 2 of the proxy generation at the top of the file, and it happens **at startup**: Spring splits the name into a *subject* (`findBy`, `existsBy`, `countBy`) and a *predicate* (everything after `By`), matches each word of the predicate against the entity's field names from the metamodel, and builds the query once. A name it cannot resolve is a **startup crash**, not a runtime one:

```
org.springframework.data.repository.query.QueryCreationException: Could not create query for
public abstract java.util.List com.victor.timetrack.repository.ProjectRepository.findByActivo();
Reason: Failed to create query for method ...; No property 'activo' found for type 'Project'
```

Same philosophy as the missing bean in file 03: a typo in a method name is caught before the app serves a request, because the name *is* the query.

TimeTrack's three derived methods, and what each one becomes:

```java
Optional<User> findByEmail(String email);
// SELECT * FROM users WHERE email = ?          → Optional: an email may match nobody

List<Project> findByActiveTrue();
// SELECT * FROM projects WHERE active = true   → "True" is a keyword, so no parameter at all

List<TimeEntry> findByUser(User user);
// SELECT * FROM time_entries WHERE user_id = ? → you pass the OBJECT, Hibernate sends its id
```

> **`findByUser(User user)` takes an object, but the column is `user_id` — how?** Because you are querying the *entity* graph, not the table. `TimeEntry` has a field `user` of type `User`, and the metamodel already knows that field is stored as the FK column `user_id`. So Spring Data builds `WHERE user_id = ?` and Hibernate binds `user.getId()` as the parameter. You never extract the id yourself — and you *cannot* pass one instead: `findByUser(5L)` would not compile, since the parameter type must match the field's type. To query by the raw id you would declare `findByUserId(Long id)` — the `Id` in the name walks one step further into the object graph (`TimeEntry.user.id`).

> **`True` is not a field name — it is a keyword.** `findByActiveTrue()` has zero parameters, and that is not a mistake: the parser reads `Active` as the field and `True` as one of the built-in comparison keywords (`True`, `False`, `Between`, `LessThan`, `Like`, `In`, `IsNull`, `Containing`…), which supplies the value itself. `findByActive(boolean active)` would work too and would let the caller choose — `findByActiveTrue()` is the version that says "this endpoint only ever wants the active ones", in the signature.

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

Purpose: return one slice of a result set plus the metadata a UI paginator needs, instead of every row — the difference between an endpoint that survives a real table and one that dies on it.

File: proposed — **TimeTrack does not paginate anything today.** `TimeEntryController` returns a plain `List`, which is fine at demo scale and is exactly the gap an interviewer probes. Everything below is the shape the refactor would take; do not go looking for a `Pageable` in the repo.

Docs: https://www.baeldung.com/spring-data-jpa-pagination-sorting → read: "Pagination" and "Page vs Slice"

Returning every row is fine in a demo and dangerous in production. `repository.findAll()` on a table with 100,000 rows loads all of them into memory and serialises them to JSON in one response — slow, and it can crash the app. The interview question is exactly this: "what happens if you call `findAll()` on a huge table?"

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

Purpose: turn a foreign key into a Java field — instead of storing a `Long userId` and looking the user up by hand, the entity holds a `User user` and Hibernate keeps the FK column and the object reference in sync.

File: `src/main/java/com/victor/timetrack/model/TimeEntry.java` — the two `@ManyToOne` fields (`user`, `project`) are the only relationships in TimeTrack; **there is no `@OneToMany` anywhere in the project** (see the callout at the end of this section for why that is a choice, not an omission)

Docs: https://www.baeldung.com/hibernate-one-to-many → read: "@OneToMany", "@ManyToOne" and the section on `mappedBy` (the owning vs inverse side)

TimeTrack's real code — a time entry belongs to one user and one project, so `time_entries` carries both foreign keys:

```java
@ManyToOne
@JoinColumn(name = "user_id", nullable = false)
private User user;

@ManyToOne
@JoinColumn(name = "project_id", nullable = false)
private Project project;
```

`nullable = false` on the `@JoinColumn` is what makes the FK column `NOT NULL` — a time entry with no user or no project is meaningless, and the database now refuses to store one even if a bug in the service tries.

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

> **Why TimeTrack has no `@OneToMany` at all — and why that is the right default.** `User` could perfectly well declare `@OneToMany(mappedBy = "user") private List<TimeEntry> entries`, and it does not. The relationship is already fully expressed by the FK column on `time_entries`; the `@OneToMany` side adds **no data**, only a second Java path to the same rows. What it does add is a way to accidentally load a user's entire six-month history every time you fetch the user, and a collection you must remember to keep in sync in memory. When the code needs a user's entries, it asks the repository the question directly — `timeEntryRepository.findByUser(user)` — which returns exactly the rows wanted, paginated or filtered if needed. **Map the inverse side only when you actually navigate it**; an unused `@OneToMany` is a liability, not completeness.

---

## @ManyToMany — relationships through a join table

Purpose: model "many on both sides", where neither table can hold the foreign key — the relationship lives in a third table that stores nothing but pairs of ids.

File: proposed — **there is no `@ManyToMany` in TimeTrack.** The project's only relationships are the two `@ManyToOne` fields above; a `Project` has no member list. The example below is the shape the feature would take if projects gained assigned users, and it is standard interview material either way. Do not go looking for `project_members` in the database.

Docs: https://www.baeldung.com/jpa-many-to-many → read: the join-table section and the parts on the owning side and `@JoinTable`. The follow-up — a join table that carries its own columns — is https://www.baeldung.com/hibernate-many-to-many → "Many-to-Many With Extra Columns"

`@ManyToOne` / `@OneToMany` model "one user has many transactions". `@ManyToMany` is for "many on both sides" — a `Project` can have many `User`s and a `User` can work on many `Project`s. Neither table can hold the foreign key, so JPA needs a third table — a **join table** — that just stores pairs of ids.

Why can neither table hold it? A FK column stores **one** value per row. `projects.user_id` could point at a single user; the moment a project has three members there is nowhere to put the other two — and widening the column to a list is exactly what relational databases refuse to do. The join table sidesteps it by making each *pair* a row of its own:

```
projects                users              project_members
┌────┬───────────┐      ┌────┬───────┐     ┌────────────┬─────────┐
│ id │ name      │      │ id │ name  │     │ project_id │ user_id │
├────┼───────────┤      ├────┼───────┤     ├────────────┼─────────┤
│  1 │ TimeTrack │      │  7 │ Ana   │     │     1      │    7    │   Ana → TimeTrack
│  2 │ Marketing │      │  8 │ Luis  │     │     1      │    8    │   Luis → TimeTrack
└────┴───────────┘      └────┴───────┘     │     2      │    7    │   Ana → Marketing too
                                           └────────────┴─────────┘
```

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

Purpose: decide *when* the related entity is loaded — with the parent, or only if someone touches the field. It is one word in an annotation and it is the single biggest lever on how many queries your endpoint fires.

File: `src/main/java/com/victor/timetrack/model/TimeEntry.java` — its two `@ManyToOne` fields declare **no** fetch type, so both are on the EAGER default (below)

Docs: https://www.baeldung.com/hibernate-lazy-eager-loading → read: "Lazy Loading", "Eager Loading" and the section on the proxy Hibernate substitutes for a lazy field

> **Reading the table:** the two **Default for…** rows are the ones to memorise — they are the surprising part, and they are backwards from what most people guess. Every other row follows from them. Read a row as: *this* is what you get on a field you did not annotate, so *this* is what you are shipping unless you say otherwise.

| | LAZY | EAGER |
|---|------|-------|
| When loaded | Only when you access the field | Immediately with the parent |
| Default for `@ManyToOne` | No (EAGER is the default!) | — |
| Default for `@OneToMany` | Yes | — |
| Performance | Better — loads only what you need | Can trigger unexpected extra queries |
| When to use | Almost always | Only when you always need the related data |

**The mechanism behind LAZY.** Hibernate cannot leave the field `null` — your code would NPE. So when a field is LAZY it puts a **proxy** there instead: a generated subclass of `User` that holds only the id and a reference to the open session. Call any getter on it and the proxy fires the `SELECT` at that moment and fills itself in. That is why the field "loads when you access it": accessing it is literally a method call on an object whose methods are a trigger. And it is why a LAZY field accessed *after* the transaction closes throws — the proxy still exists, but the session it was going to ask is gone:

```
org.hibernate.LazyInitializationException: could not initialize proxy
    [com.victor.timetrack.model.User#3] - no Session
```

The bracketed part is the giveaway: Hibernate names the exact entity and id it was still holding a placeholder for, which tells you *which* field you touched too late. ([08-transactions.md](./08-transactions.md) is where that session boundary is drawn.)

**Always declare `FetchType.LAZY` explicitly** — even on `@ManyToOne` where EAGER is the surprising default:

```java
@ManyToOne(fetch = FetchType.LAZY)   // explicit LAZY — do not leave it as the EAGER default
@JoinColumn(name = "user_id")
private User user;
```

> **TimeTrack does not do this — and it is a real, observable consequence, not a style nit.** The actual code is `@ManyToOne @JoinColumn(name = "user_id", nullable = false)`: **no fetch type**, so JPA applies the `@ManyToOne` default, which is **EAGER**. Every single `TimeEntry` Hibernate loads therefore drags its `User` *and* its `Project` along with it, whether the caller wanted them or not — a `findByUser(user)` returning 40 entries pulls 40 users and 40 projects too. With `show-sql` on, you can watch it happen. It is harmless at TimeTrack's size and it is exactly the kind of default that becomes a production incident at scale; the honest interview answer is "the `@ManyToOne` fields are on the EAGER default, which I would change to LAZY, and here is why that matters" — which is worth more than pretending it was deliberate.

---

## The N+1 problem

Purpose: recognise the performance bug that LAZY loading creates as a side effect — one query to fetch a list, then one *more* query per element the moment you touch its relation — and know the two annotations that collapse them back into one.

File: proposed — **no `JOIN FETCH` or `@EntityGraph` exists in TimeTrack** (its `@ManyToOne` fields are EAGER, which trades this bug for a different one — see the callout below). The fixes below are the standard ones and are asked about in every interview that touches JPA.

Docs: https://www.baeldung.com/spring-hibernate-n1-problem → read: the worked example and the fetch-strategy fixes. For `@EntityGraph` specifically, read https://www.baeldung.com/jpa-entity-graph → "Defining an Entity Graph"

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

`JOIN FETCH` and `@EntityGraph` do the same thing by different routes: both tell Hibernate "load this relation *in the same `SELECT`*, as a join, not later". `JOIN FETCH` says it inside the query string; `@EntityGraph` says it as an annotation on top, leaving the derived-query name untouched — which is why it is the tidier fix for a method you did not want to hand-write a `@Query` for.

> **Does EAGER "fix" N+1? No — it moves it.** TimeTrack's EAGER `@ManyToOne` fields mean Hibernate does not wait for you to touch `entry.getUser()`: it loads the user up front. But "up front" does not mean "in the same query" — unless Hibernate chooses a join, it issues a separate `SELECT` per parent row anyway, and you get the same 1 + N, just fired earlier and without you having written the loop that triggers it. **The real fix is always the same: state what you need in the query itself** (`JOIN FETCH` / `@EntityGraph`) rather than hoping a fetch-type default produces the right SQL. That is the answer interviewers are listening for, because it is the one that shows you know EAGER is not a performance setting.

---

## save() — insert or update

Purpose: write an entity to the database without deciding yourself whether it is an `INSERT` or an `UPDATE` — one method covers both, and picking wrong is not possible because Spring Data reads the `@Id` rather than trusting you.

File: `src/main/java/com/victor/timetrack/service/TimeEntryService.java` — `timeEntryRepository.save(entry)` is called on the freshly built entity in `create()` (insert) and again on the loaded entity in the approve/reject flow (update). Same method, both times.

Docs: https://www.baeldung.com/spring-data-crud-repository-save → read: "The save() Method" and the insert-vs-update decision

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

TimeTrack's `TimeEntryService` uses each branch without ever saying which one it wants:

```java
// create() — INSERT: the entity was built with new, so id is still null
TimeEntry timeEntry = new TimeEntry();
timeEntry.setUser(user);
timeEntry.setProject(project);
// ...
TimeEntry saved = timeEntryRepository.save(timeEntry);

// approve() — UPDATE: the entity came back from findById, so id is set
TimeEntry timeEntry = timeEntryRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));
timeEntry.setStatus(EntryStatus.APPROVED);
TimeEntry saved = timeEntryRepository.save(timeEntry);
```

> **Why reassign the result — `TimeEntry saved = ...save(entry)` — when `save()` mutates the entity you passed in?** On an insert it does write the generated id back into your object, so `entry.getId()` works afterwards and you *could* ignore the return value. But that is a Hibernate-specific courtesy, not a guarantee of the contract: `save()` is specified to return **the persisted instance**, and it is allowed to be a *different* object from the one you handed in (that is exactly what `merge()` does for a detached entity — it copies your state onto a managed copy and returns the copy, leaving your original untouched). Use the returned reference and the code is correct under either behaviour; use the argument and you are relying on an implementation detail. `TimeEntry saved = repository.save(timeEntry)` is the habit to keep — and it is what every one of `TimeEntryService`'s five write methods (`create`, `submit`, `approve`, `reject`, `update`) actually does. Docs: https://www.baeldung.com/spring-data-jpa-save-use-returned-instance.

---

## Aggregation queries and interface projections

Every repository method you've seen so far returns entities — `Transaction`, `List<Transaction>`, `Page<Transaction>`. But a report like "total hours per project this month" is not an entity. There is no `Report` table, no `@Id`, no single row you could `save()` — it is a **computed** result: one row per project, with a `SUM()` of a related table's column. Returning a `List<Project>` for this makes no sense — a `Project` doesn't have a `totalHours` field, and it shouldn't, because that number depends on a date range you pick at request time, not on anything stored on the project itself.

Purpose: an interface projection tells Spring Data JPA the *shape* of a computed result — which fields exist and their types — without you writing a class or any mapping code. Spring generates the implementation for you at runtime.

File: `src/main/java/com/victor/timetrack/dto/response/ProjectHoursReportResponse.java` (and `EmployeeHoursReportResponse.java` next to it — the same pattern for the per-employee report)

Docs: https://www.baeldung.com/spring-data-jpa-projections → read: "Interface-based Projections"

```java
public interface ProjectHoursReportResponse {
    String getProjectName();
    BigDecimal getTotalHours();
}
```

> **Why does the interface only have two methods if the report returns many projects?** Don't confuse the *list* with the *shape of one row*. `List<ProjectHoursReportResponse>` is what carries "how many rows" — one element per project that had entries in the range. `ProjectHoursReportResponse` itself describes the shape of a *single* one of those rows — the two fields every row needs, not "two rows total". Spring instantiates one proxy object per row that comes back from the query; each of those objects implements the interface, so each one has both `getProjectName()` and `getTotalHours()` available — but calling `getProjectName()` on the object built from row 1 returns `"TimeTrack"`, while calling it on the object built from row 2 returns `"Marketing"`. Same two methods on every object (the fixed contract), different values per object (because each is built from a different row). This is the exact same relationship as a regular class and its instances: `new Project()` twice gives you two objects that share the same `getName()` method but each returns its own data — the only difference here is that you never write `new` yourself, Spring does it once per row.
>
> **Why an interface and not a class with `@Data`, like every other response DTO in this project?** Every other DTO (`ProjectResponse`, `UserResponse`...) is a class you instantiate yourself — you write `new ProjectResponse()` (or a mapper does it) and fill each field by hand in your own Java code. A projection is different: **you never construct it**. Spring Data reads the column aliases coming back from the database query (`SUM(te.hours) AS totalHours`) and, because Java can generate a proxy object that implements any interface at runtime, it builds an object on the fly whose `getTotalHours()` returns exactly that column's value — no class body, no constructor, no manual mapping needed. A `class` cannot be built this way because a class needs a constructor Spring would have to call with the right arguments in the right order; an interface only promises "something with this method exists", which is all a runtime proxy needs to satisfy.

> **Practical rule — memorize this one:** every time you write an interface projection (for JPQL, as here, or for native SQL with `@Query(nativeQuery = true)`), each getter must match, by name, one `AS alias` in the `SELECT`. Decide the `SELECT ... AS alias` list first, then write one getter per alias — never the other way around. `AS totalHours` needs `getTotalHours()`; `AS employeeName` needs `getEmployeeName()`. No aliases, no projection.

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

### Filtering by a fixed enum value — the JPQL literal, not a parameter

The `WHERE` above only checks `te.date BETWEEN :start AND :end` — it sums every `TimeEntry` in the range regardless of `status`. That is a real bug in TimeTrack's first version of this query: a manager's report ended up summing hours from entries still in `DRAFT` (never even submitted) and entries in `REJECTED` (explicitly rejected) as if they were confirmed work. The whole point of the `DRAFT → SUBMITTED → APPROVED/REJECTED` state machine is that `APPROVED` is the only status a manager has actually signed off on — a report is supposed to be a number people can trust, and summing unconfirmed or rejected hours breaks that trust silently, with no error to warn you.

The fix is one more `AND` — but the way you reference the enum value is worth stopping on, because it is different from every other query in this file:

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

`com.victor.timetrack.model.EntryStatus.APPROVED` is a **JPQL enum literal** — you write the enum's fully-qualified Java path (package + class + constant) directly inside the query string, and JPQL resolves it to the same constant your Java code would reference as `EntryStatus.APPROVED`. No `@Param`, no extra method argument — the value never varies per call, so it does not belong in the method signature at all.

> **Why not just add a fifth `@Param("status") EntryStatus status` instead?** Because that would say "the caller decides which status counts", when the whole point of this fix is the opposite: **`APPROVED` is not a caller's choice, it is the report's own definition of "real hours".** Every future caller of `getHoursByProject` — this endpoint today, any other report you add later — must get the same trustworthy number, not a number that depends on what someone happened to pass in. A parameter would let a future bug (or a careless new caller) accidentally request `DRAFT` hours in a "totals" report; a literal makes that mistake structurally impossible, because the rule lives inside the query itself, not in whoever happens to call it.

> **Contrast with the dynamic filters in [14-specifications-criteria-api.md](./14-specifications-criteria-api.md).** `GET /api/entries`'s `status` filter is a `Specification` built from a `@RequestParam` precisely *because* the caller is supposed to choose it (an employee might want to see only their `SUBMITTED` entries). This report's `status = APPROVED` is the opposite case: a business rule that never changes per request. Same underlying question both times — "does this value vary per caller, or is it fixed by the rule?" — different answer, different tool: a parameter for the first, a literal for the second.

This is why `GROUP BY` order matters here too: the enum comparison in `WHERE` runs **before** the grouping (see the clause table above — `WHERE` decides which rows are considered *at all*, before `GROUP BY` even sees them), so a `REJECTED` entry is discarded before it ever reaches a bucket, rather than being summed and then somehow subtracted afterward.

### From `?month=2025-05` to a date range — YearMonth

File: `src/main/java/com/victor/timetrack/service/ReportService.java` — note this is `ReportService`, **not** `TimeEntryService`: the method sits in the *feature*-shaped service, and reaches into the *entity*-shaped `TimeEntryRepository` underneath, exactly as the two-axes rule earlier in this file predicts.

The controller receives `month=2025-05` as a query string. `java.time.YearMonth` represents exactly that — a year plus a month, no day — and Spring can bind it straight from the query string because its `toString()`/parsing format is the same ISO shape (`yyyy-MM`) the URL already uses, so no custom converter is needed. The controller's only job is to receive that `YearMonth` and hand it to the service — turning it into an actual date range is business logic (deciding *how* a month maps to concrete dates), so it belongs in the service, following the same layered-architecture split used everywhere else in this project: **controller receives, service decides, repository fetches.**

```java
// service — ReportService.java (the real code, both report methods follow this shape)
public List<ProjectHoursReportResponse> getHoursByProject(YearMonth month) {
    LocalDate start = month.atDay(1);          // 2025-05-01
    LocalDate end = month.atEndOfMonth();       // 2025-05-31 (handles 28/29/30/31 correctly)
    return timeEntryRepository.getHoursByProject(start, end);
}
```

`atDay(1)` and `atEndOfMonth()` are **instance methods of `YearMonth`** — they operate on the specific year-month value the object holds (May 2025 in this example), the same way a `String` has instance methods like `.toUpperCase()` that operate on the text it holds. The difference here is the *return type*: these two methods don't give back another `YearMonth`, they give back a `LocalDate` — a method is free to return a different type than the class it belongs to; nothing forces `YearMonth`'s methods to return more `YearMonth` values.

```
month.atDay(1)         →  LocalDate  (the 1st day of that year-month)
month.atEndOfMonth()   →  LocalDate  (the last day — 28/29/30/31, resolved automatically)
```

> **Why not just parse `month` as a `String` and slice it?** You could split `"2025-05"` on `-` and build a `LocalDate` by hand, but then you own the edge cases yourself — how many days does May have? Does the app still work correctly in a leap-year February? `YearMonth.atEndOfMonth()` already knows the answer for every month, including February 28 vs 29, so the calendar logic never has to be reasoned about by hand.

> **Why both report endpoints carry `@PreAuthorize("hasRole('MANAGER')")`.** `@PreAuthorize` is a Spring Security annotation you put on a controller method: it runs the expression inside it *before* the method body executes, and rejects the request with a `403` if it evaluates to false — `hasRole('MANAGER')` meaning "the authenticated caller must have the `MANAGER` role". It is on `ReportController`'s two methods for a reason that comes straight from the query above: a report `SUM`s hours **across the whole team**, so it hands the caller other people's data — unlike `GET /api/time-entries`, where `TimeEntryService.getAll()` narrows the result to `findByUser(user)` for a non-manager. Any endpoint that exposes data beyond "my own" needs an explicit role check, because the JWT filter only proves *who* is calling, never *what* they are allowed to see. The same annotation guards `GET /api/users` and the project mutation endpoints. Full treatment in [06-security-jwt.md](./06-security-jwt.md) — for now, read it as "manager-only endpoint, enforced by the framework, not by an `if` in your service".

---

## Where this leaves you — and what comes next

The interface with no body is no longer a mystery. Spring Data scans for interfaces extending `JpaRepository`, reads the entity and id types out of the generic parameters, and **generates a proxy** that implements the whole interface at runtime: inherited CRUD methods delegate to Hibernate's `EntityManager`, method *names* like `findByActiveTrue` are parsed into queries at startup, and a `@Query` string is used as written. Underneath, Hibernate holds a metamodel built by reflection from your `@Entity` classes and assembles every SQL statement from it. That is the whole chain: annotation → metamodel → SQL → JDBC → PostgreSQL.

The persistence layer now works. What it does *not* do is fail gracefully. Look at what the code in this file actually throws when reality does not cooperate: `findById(id).orElseThrow(() -> new ResourceNotFoundException(...))` when the entry does not exist, a `BusinessRuleViolationException` when a manager tries to approve an entry that is not `SUBMITTED`, and — with no help from you at all — a Hibernate constraint violation the moment someone registers with an email that is already in `users`, because you wrote `@Column(unique = true)` and the database is enforcing it. Every one of those is an exception thrown deep in a service, several layers below the HTTP response.

Left alone, each of them reaches the client as the same thing: a `500 Internal Server Error` with a stack trace in it. A "user not found" is not a server error — it is a `404`, and "hours must be between 0.5 and 24" is a `400` with a readable message. Something has to sit between the exception and the response and translate one into the other, in one place, for the whole API.

[05-exception-handling.md](./05-exception-handling.md) is that something: `@ControllerAdvice`, `@ExceptionHandler`, custom exception classes, and how a `ResourceNotFoundException` thrown in `TimeEntryService` becomes a clean `404` JSON body without a single `try/catch` in any controller.
