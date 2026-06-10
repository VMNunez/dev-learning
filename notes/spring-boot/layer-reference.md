# Spring Boot — Layer Reference

> 📖 [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/reference/)

This file is a quick reference. When you start a new feature, open this file and follow the flow top to bottom.

---

## The full flow

```
Database table
     ↓
Entity          — maps the table to a Java class
     ↓
Repository      — queries the database (Spring writes the SQL for you)
     ↓
Service         — business logic (what the app actually does)
     ↓
DTO             — the shape of the data you send/receive over HTTP
     ↓
Controller      — receives HTTP requests, calls the service, returns the DTO
     ↓
HTTP response
```

**The rule:** each layer only knows about the one directly below it. Controller → Service → Repository. Never skip a layer.

---

## Full vertical slice — Transaction feature

This is what a complete feature looks like from database to HTTP response.

### 1. Entity

| Annotation | What it does |
|---|---|
| `@Entity` | Marks the class as a database table |
| `@Table(name = "...")` | Sets the table name (optional — defaults to class name in lowercase) |
| `@Id` | Marks the primary key field |
| `@GeneratedValue(strategy = GenerationType.IDENTITY)` | Auto-increment — the database assigns the ID |
| `@Column(nullable = false)` | Adds a NOT NULL constraint |
| `@ManyToOne` | This entity belongs to one of another entity (many transactions → one user) |
| `@JoinColumn(name = "user_id")` | The foreign key column that links to the other table |
| `@CreationTimestamp` | Sets the field to the current time when the row is inserted — Hibernate does this automatically |
| `@Data` | Lombok — generates getters, setters, `equals`, `hashCode`, `toString` |
| `@NoArgsConstructor` | Lombok — generates an empty constructor (required by JPA) |
| `@AllArgsConstructor` | Lombok — generates a constructor with all fields |

```java
@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String type; // "income" or "expense"

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
```

### 2. Repository

| Annotation / pattern | What it does |
|---|---|
| `extends JpaRepository<Entity, IdType>` | Gives you `findAll()`, `findById()`, `save()`, `deleteById()` for free |
| `@Repository` | Optional — `JpaRepository` already marks it as a Spring bean |
| `findByUserId(Long userId)` | Spring reads the method name and generates the SQL automatically |
| `findByUserIdAndType(Long userId, String type)` | Combine fields with `And` — Spring generates `WHERE user_id = ? AND type = ?` |

```java
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Spring generates the SQL automatically from the method name
    List<Transaction> findByUserId(Long userId);
    List<Transaction> findByUserIdAndType(Long userId, String type);
}
```

### 3. DTO

| Annotation | What it does |
|---|---|
| `@Data` | Lombok — generates getters, setters, `equals`, `hashCode`, `toString` |
| `@NoArgsConstructor` | Lombok — required for Jackson to deserialize JSON into the object |
| `@AllArgsConstructor` | Lombok — useful for building response DTOs in the service |
| `@NotBlank` | Validation — field must not be null or empty string |
| `@NotNull` | Validation — field must not be null (allows empty string) |
| `@Positive` | Validation — number must be greater than zero |

Two types of DTOs — keep them separate:
- **Request DTO** — what the client sends (has validation annotations)
- **Response DTO** — what the server returns (no validation needed — you build it yourself)

```java
// What the API receives (POST body)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {
    @NotBlank
    private String description;

    @NotNull
    @Positive
    private BigDecimal amount;

    @NotBlank
    private String type;
}

// What the API returns (response body)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private String description;
    private BigDecimal amount;
    private String type;
    private LocalDateTime createdAt;
}
```

### 4. Service

| Annotation | What it does |
|---|---|
| `@Service` | Marks the class as a Spring bean — Spring creates one instance and injects it wherever needed |
| `@Transactional` | Wraps the method in a database transaction — if anything fails, all database changes roll back |

```java
@Service
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public List<TransactionResponse> getAllByUser(Long userId) {
        return repository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TransactionResponse create(TransactionRequest request, User user) {
        Transaction transaction = new Transaction();
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setUser(user);

        Transaction saved = repository.save(transaction);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private TransactionResponse toResponse(Transaction t) {
        return new TransactionResponse(t.getId(), t.getDescription(), t.getAmount(), t.getType(), t.getCreatedAt());
    }
}
```

### 5. Controller

| Annotation | What it does |
|---|---|
| `@RestController` | Every return value is serialized to JSON automatically |
| `@RequestMapping("/api/...")` | Base URL path for all methods in this controller |
| `@GetMapping` / `@PostMapping` / `@PutMapping` / `@DeleteMapping` | Maps a method to an HTTP verb |
| `@GetMapping("/{id}")` | The `{id}` part becomes a variable you can read |
| `@PathVariable` | Reads `{id}` from the URL path |
| `@RequestBody` | Reads the JSON body and maps it to a Java object |
| `@Valid` | Runs all validation annotations (`@NotBlank`, etc.) on the request body before the method runs |
| `ResponseEntity<T>` | Lets you control the HTTP status code and the response body |

```java
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAll() {
        // TODO: replace 1L with the real authenticated user ID when JWT is ready
        return ResponseEntity.ok(service.getAllByUser(1L));
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> create(@Valid @RequestBody TransactionRequest request) {
        // TODO: replace null with the real authenticated user when JWT is ready
        TransactionResponse created = service.create(request, null);
        return ResponseEntity.status(201).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## What Spring Boot does automatically

| You write | Spring Boot does |
|---|---|
| `extends JpaRepository<Transaction, Long>` | Generates `findAll()`, `save()`, `deleteById()`, etc. |
| `findByUserId(Long userId)` | Generates `SELECT * FROM transactions WHERE user_id = ?` |
| `@Transactional` | Opens a transaction before the method, commits on success, rolls back on exception |
| `@RestController` + return value | Serializes the return value to JSON via Jackson |
| `@Valid @RequestBody` | Runs all `@NotBlank`, `@NotNull`, etc. checks before the method runs |
| Constructor with one dependency | Injects the bean automatically (no `@Autowired` needed) |
