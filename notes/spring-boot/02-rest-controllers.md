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

- **The rule:** each layer only calls the one directly below it. Controller → Service → Repository.
- Business logic changes → only touch the service. Database changes → only touch the repository.
- A controller that imports a repository is a red flag in any code review.

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

`@RestController` = `@Controller` + `@ResponseBody`. Every return value is serialized to JSON automatically.

> **`@Controller` vs `@RestController`:** `@Controller` is for server-rendered HTML views. For a REST API consumed by Angular, always use `@RestController`.

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

### @PathVariable — three things to understand

**1. The `{}` are not optional.**
They tell Spring "this part of the URL is a variable, not a literal word".

```java
@GetMapping("/id")    // matches the literal URL /api/projects/id — never what you want
@GetMapping("/{id}")  // matches /api/projects/1, /api/projects/42, etc.
```

**2. The name inside `{}` must match the parameter name.**
Spring maps `{id}` to the parameter named `id`. If they don't match, Spring throws an error at startup.

```java
@GetMapping("/{id}")
public ProjectResponse getById(@PathVariable Long id) { ... }  // ✓ names match

// If the names must differ, be explicit:
@GetMapping("/{id}")
public ProjectResponse getById(@PathVariable("id") Long projectId) { ... }  // ✓ explicit mapping
```

**3. `{id}` is a placeholder — never a literal.**
When a client calls `GET /api/projects/42`, Spring puts `42` into the `id` parameter. The URL is never literally `/api/projects/id`.

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

**When to use each one — the simple rule:**

| Annotation | Data comes from | Typical usage |
|---|---|---|
| `@PathVariable` | URL path — `/{id}` | GET, PUT, DELETE — identifies which resource |
| `@RequestBody` | Request body — the JSON you send | POST, PUT — sends data to create or update |
| `@RequestParam` | Query string — `?month=2025-05` | GET — optional filters |

```
GET    /api/projects        → no annotation (no input)
GET    /api/projects/42     → @PathVariable
POST   /api/projects        → @RequestBody
PUT    /api/projects/42     → @PathVariable + @RequestBody
DELETE /api/projects/42     → @PathVariable
```

**The pattern:** use `@PathVariable` for the resource identifier (it is mandatory — no ID, no resource). Use `@RequestParam` for optional filters. Use `@RequestBody` when the client sends JSON in the body.

`@Valid` triggers Bean Validation on the `@RequestBody` — if the DTO has `@NotNull` or `@NotBlank` fields and the input fails them, Spring returns 400 automatically.

---

### Why does @PathVariable need to exist at all?

Spring sees a method with several parameters — `Long id`, `UpdateProjectRequest request`, etc. Without `@PathVariable`, Spring does not know which parameter should come from the URL. The annotation is the explicit connection between `{id}` in the path and `Long id` in the method.

```java
// Spring reads @PathVariable and knows: "fill id with whatever is in {id} in the URL"
@PutMapping("/{id}")
public ResponseEntity<ProjectResponse> update(@PathVariable Long id, @RequestBody UpdateProjectRequest request)
```

That is why the names must match — Spring reads `@PathVariable`, looks for `{id}` in the URL template, and puts that value into `id`.

---

### @RequestBody is only about receiving — not returning

`@RequestBody` and `ResponseEntity.body()` look similar but they are opposite directions:

| | Direction | Used on |
|---|---|---|
| `@RequestBody` | Client → Server | Method parameter — what you receive |
| `ResponseEntity.body(value)` | Server → Client | Return statement — what you send back |

```java
// @RequestBody = you receive JSON from the client and Spring converts it to a Java object
public ResponseEntity<ProjectResponse> create(@RequestBody CreateProjectRequest request)

// .body() = you send a Java object back to the client and Spring converts it to JSON
return ResponseEntity.status(201).body(projectService.create(request));
```

`@RequestBody` has nothing to do with what you return.

---

### ResponseEntity.ok() does include a body

`.ok(value)` is a shortcut for `.status(200).body(value)`. GET methods do return a body — the JSON array or object. The client receives it the same way.

```java
// These two are identical:
return ResponseEntity.ok(projectService.getAll());
return ResponseEntity.status(200).body(projectService.getAll());
```

The only case with no body is 204 (DELETE):
```java
return ResponseEntity.noContent().build(); // status 204, empty body
```

---

### noContent() and .build()

`ResponseEntity` always needs two things: a status and a body. When there is a body you use `.body(value)`. When there is no body you use `.build()` — it tells Spring "build the response with nothing in the body".

```java
// With body — status + body
ResponseEntity.status(201).body(projectService.create(request));
ResponseEntity.ok(projectService.getAll());   // ok() = status(200) + body in one step

// No body — status + build
ResponseEntity.noContent().build();           // noContent() = status(204), no body
```

`noContent()` is a named shortcut for status 204, the same way `ok()` is a shortcut for 200.

---

### void vs Void

`void` (lowercase) is a Java keyword — it means a method returns nothing. Used in method signatures:

```java
public void delete(Long id) { ... }  // the method returns nothing
```

`Void` (uppercase) is a class. Used as a generic type parameter when you need to say "this generic has no value". Java only accepts classes inside `<>`, not keywords:

```java
ResponseEntity<Void>   // ✓ — Void is a class
ResponseEntity<void>   // ✗ — void is a keyword, not valid inside <>
```

This pattern appears in `delete` — the service returns nothing, but the controller still returns a `ResponseEntity` so Spring can send the 204 status to the client:

```java
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) {
    projectService.delete(id);          // void — returns nothing
    return ResponseEntity.noContent().build();  // 204, no body
}
```

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

---

## Project 07 — TimeTrack (first working endpoint)

This is the first Controller → Service → Repository chain built in the TimeTrack project. Step 1 returns the entity directly — DTOs are introduced in Step 2.

### UserService

```java
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }
}
```

- `@Service` — Spring finds this class, creates one instance (a bean), and keeps it available for injection
- `private final UserRepository userRepository` — declare the dependency; `final` because it never changes after the constructor runs
- Constructor injection — Spring detects the single constructor and injects `UserRepository` automatically; no `@Autowired` needed
- `userRepository.findAll()` — built-in method from `JpaRepository`; no SQL needed

### UserController

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAll() {
        return userService.getAll();
    }
}
```

- `@RestController` — marks this class as a REST controller; every return value is serialized to JSON automatically
- `@RequestMapping("/api/users")` — base URL for all methods in this class
- `@GetMapping` — responds to `GET /api/users`; no path needed because the base URL is already set on the class
- The controller injects the service the same way the service injects the repository — same constructor injection pattern

### Project 07 — ProjectService — full CRUD with DTOs and toResponse()

Step 2 introduces DTOs and full CRUD. The key pattern: a private `toResponse()` helper avoids repeating the entity-to-DTO mapping in every method.

```java
@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectResponse> getAll() {
        return projectRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public ProjectResponse getById(Long id) {
        return projectRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    public ProjectResponse create(CreateProjectRequest request) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        Project saved = projectRepository.save(project);
        return toResponse(saved);
    }

    public ProjectResponse update(Long id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        Project saved = projectRepository.save(project);
        return toResponse(saved);
    }

    public void delete(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        project.setActive(false);   // soft delete — keeps data, marks as inactive
        projectRepository.save(project);
    }

    private ProjectResponse toResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        response.setActive(project.getActive());
        response.setCreatedAt(project.getCreatedAt());
        return response;
    }
}
```

**Key decisions:**
- `toResponse()` is `private` — internal detail, no other class needs it
- `create()` starts with `new Project()` — entity does not exist yet
- `update()` starts with `findById()` — entity must exist to be modified; `orElseThrow()` handles the "not found" case and stops the method immediately
- `save()` handles both insert and update — JPA decides based on whether `id` is null
- `delete()` returns `void` — nothing to return after a soft delete
- Soft delete: `active = false` instead of removing the row — keeps historical data intact

### Project 07 — ProjectController — full CRUD with ResponseEntity

```java
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAll() {
        return ResponseEntity.ok(projectService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> create(@RequestBody CreateProjectRequest request) {
        return ResponseEntity.status(201).body(projectService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(@PathVariable Long id, @RequestBody UpdateProjectRequest request) {
        return ResponseEntity.ok(projectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

**Key decisions:**
- `getAll` and `getById` use `ResponseEntity.ok()` — shortcut for status 200 + body
- `create` uses `status(201).body()` — POST must return 201, not 200
- `update` uses `ResponseEntity.ok()` — updating an existing resource returns 200
- `delete` returns `ResponseEntity<Void>` — no body; `Void` (uppercase) because `<>` only accepts classes, not the `void` keyword
- `delete` calls the service first, then builds the response — two separate lines because the service returns `void`
- `@RequestMapping("/api/projects")` on the class sets the base path; each method only adds what is different (`/{id}`, nothing, etc.)

---

### What happens when the browser calls GET /api/users

```
Browser → GET /api/users
  → UserController.getAll()
    → UserService.getAll()
      → UserRepository.findAll()
        → Hibernate generates: SELECT id, email, name FROM users
          → PostgreSQL returns rows
        → returned as List<User>
      → returned to controller
    → Jackson serializes List<User> to JSON
  → browser receives []  (empty array — no users yet)
```

Hibernate logs the SQL to the console because `spring.jpa.show-sql=true` is set in `application.properties`.
