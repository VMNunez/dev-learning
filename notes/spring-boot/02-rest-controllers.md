# REST Controllers

> 📖 [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)

## The three-layer architecture — the most important pattern

Every Spring Boot API follows three layers. This is the first thing a consultancy interviewer will ask about.

```
HTTP request
     ↓
Controller      — receives the request, validates input, returns a response
     ↓
Service         — all business logic lives here
     ↓
Repository      — talks to the database
     ↓
Database
```

**The rule:** each layer only calls the layer directly below it. A controller never imports a repository. A service never imports a controller. This is called **separation of concerns** — each class has one job.

Why it matters: if the business logic changes, you only change the service. If the database changes, you only change the repository. The controller stays the same.

```java
// Controller — only knows about the service
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
```

---

## @RestController

`@RestController` = `@Controller` + `@ResponseBody`. Every method return value is serialized to JSON automatically. Use it for all REST API controllers.

`@Controller` is only for apps that return HTML views (server-rendered pages). In a backend API consumed by Angular, you always use `@RestController`.

```java
@RestController
@RequestMapping("/api/transactions")   // base path for all methods in this class
public class TransactionController { ... }
```

---

## HTTP methods — what each one means

| Annotation | HTTP method | Purpose | Has body? |
|-----------|------------|---------|----------|
| `@GetMapping` | GET | Read data | No |
| `@PostMapping` | POST | Create a new resource | Yes |
| `@PutMapping` | PUT | Replace an entire resource | Yes |
| `@PatchMapping` | PATCH | Update part of a resource | Yes |
| `@DeleteMapping` | DELETE | Remove a resource | No |

```java
@GetMapping              // GET /api/transactions
@GetMapping("/{id}")     // GET /api/transactions/42
@PostMapping             // POST /api/transactions
@PutMapping("/{id}")     // PUT /api/transactions/42
@DeleteMapping("/{id}")  // DELETE /api/transactions/42
```

---

## ResponseEntity — controlling the HTTP response

`ResponseEntity<T>` wraps your return value with an HTTP status code. This matters because a REST API must communicate what happened, not just return data.

```java
// 200 OK with body
return ResponseEntity.ok(transaction);

// 201 Created with body (resource was just created)
return ResponseEntity.status(201).body(created);

// 204 No Content — success but nothing to return (common for DELETE)
return ResponseEntity.noContent().build();

// 404 Not Found
return ResponseEntity.notFound().build();

// 400 Bad Request
return ResponseEntity.badRequest().body("Invalid input");
```

**Key status codes to know:**

| Code | Meaning | When to use |
|------|---------|------------|
| 200 OK | Success | GET, PUT success |
| 201 Created | Resource created | POST success |
| 204 No Content | Success, nothing to return | DELETE success |
| 400 Bad Request | Client sent invalid data | Validation failure |
| 401 Unauthorized | Not authenticated | Missing or invalid token |
| 403 Forbidden | Authenticated but not allowed | Wrong role |
| 404 Not Found | Resource does not exist | `findById` returned empty |
| 409 Conflict | Duplicate resource | Email already exists |
| 500 Internal Server Error | Unhandled server error | Bug |

---

## Reading input — @PathVariable, @RequestParam, @RequestBody

```java
// From the URL path: GET /api/transactions/42
@GetMapping("/{id}")
public ResponseEntity<TransactionDTO> getById(@PathVariable Long id) { ... }

// From query parameters: GET /api/transactions?category=food&page=1
@GetMapping
public ResponseEntity<List<TransactionDTO>> getFiltered(
    @RequestParam(required = false) String category,
    @RequestParam(defaultValue = "0") int page
) { ... }

// From the request body: POST /api/transactions { ... }
@PostMapping
public ResponseEntity<TransactionDTO> create(@Valid @RequestBody TransactionCreateDTO dto) { ... }
```

**The pattern:** use `@PathVariable` for the resource identifier (it is mandatory — no ID, no resource). Use `@RequestParam` for optional filters.

`@Valid` triggers Bean Validation on the `@RequestBody` — if the DTO has `@NotNull` or `@NotBlank` fields and the input fails them, Spring returns 400 automatically.

---

## DTOs — never expose JPA entities directly

**Why:** entities are tied to the database schema. They can contain fields you should not expose (password hash, internal foreign keys, lazy-loaded collections). DTOs let you control exactly what the API sends and receives.

```java
// Entity — database representation (never send this directly to the frontend)
@Entity
public class Transaction {
    @Id private Long id;
    private BigDecimal amount;
    private String description;
    @ManyToOne private User user;   // contains password hash — never expose
}

// Response DTO — what the API returns (only the fields the frontend needs)
public record TransactionDTO(
    Long id,
    BigDecimal amount,
    String description,
    LocalDate date,
    String category
) {}

// Create DTO — what the frontend sends when creating
public record TransactionCreateDTO(
    @NotNull BigDecimal amount,
    @NotBlank String description,
    @NotBlank String category,
    @NotNull LocalDate date
) {}
```

The service converts between entities and DTOs. The controller only deals with DTOs.

---

## A complete controller example

```java
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
        // service throws ResourceNotFoundException if not found
        // @ControllerAdvice maps that to 404 — see 05-exception-handling.md
    }

    @PostMapping
    public ResponseEntity<TransactionDTO> create(@Valid @RequestBody TransactionCreateDTO dto) {
        TransactionDTO created = service.create(dto);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> update(
        @PathVariable Long id,
        @Valid @RequestBody TransactionCreateDTO dto
    ) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```
