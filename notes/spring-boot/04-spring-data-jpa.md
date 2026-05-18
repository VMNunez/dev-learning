# Spring Data JPA

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
- `@Table(name = "...")` — override the default table name (useful when the table name differs from the class name, or when the class name is a reserved word in SQL)
- `@Column(...)` — configure column properties: `nullable`, `length`, `name`, `updatable`
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
