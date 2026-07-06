# REST Controllers

> 📖 [Baeldung — Building a REST API with Spring Boot](https://www.baeldung.com/building-a-restful-web-service-with-spring-and-java-based-configuration)
> 📖 [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)

## The three-layer architecture — the most important pattern

Every Spring Boot API follows three layers. This is the first thing an interviewer will ask about.

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
    public ResponseEntity<List<TransactionResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
```

A few things to read off this example:

- **Yes — each layer holds a reference to the one below it.** The controller declares `private final TransactionService service`. `private` because no other class needs it; `final` because once Spring sets it in the constructor it never changes. You will see this exact `private final` dependency line in every controller, service, and repository-using class.
- **The constructor is `public` and must be named exactly like the class** (`TransactionController`). That is the Java rule for any constructor. Spring calls it at startup and passes in the `TransactionService` bean automatically (constructor injection — see [03-dependency-injection.md](./03-dependency-injection.md)).
- **`this.service = service`** — the parameter and the field share the name `service`. `this.service` means "the field of this object"; the bare `service` is the parameter. The line copies the injected parameter into the field so the rest of the class can use it.
- **`TransactionResponse` is a DTO** (Data Transfer Object) — the shape the API sends back instead of the raw entity. DTOs are explained fully in the "DTOs" section below and in [layer-reference.md](./layer-reference.md).

---

## @RestController and @RequestMapping

Docs: https://www.baeldung.com/spring-controller-vs-restcontroller → read: the `@RestController` section

`@RestController` tells Spring "this class handles HTTP requests, and every value I return should be sent straight back to the client as JSON". It is shorthand for `@Controller` + `@ResponseBody`: `@Controller` registers the class as a web component, and `@ResponseBody` is what serialises the return value to JSON (via Jackson) instead of treating it as the name of an HTML page.

> **`@Controller` vs `@RestController`:** `@Controller` is for server-rendered HTML views (it returns the name of a template to render). For a REST API consumed by Angular, always use `@RestController` so you get JSON.

`@RequestMapping("/api/transactions")` on the class sets the **base URL path** shared by every method inside it. Each method-level annotation (`@GetMapping`, `@PostMapping`…) then only adds the part that differs. So `@GetMapping("/{id}")` inside this class answers `GET /api/transactions/{id}`.

```java
@RestController
@RequestMapping("/api/transactions")   // base path for all methods in this class
public class TransactionController { ... }
```

---

## HTTP methods — what each one means

Docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods → read: the summary of each verb

| Annotation       | HTTP method | Purpose                    | Has body? |
| ---------------- | ----------- | -------------------------- | --------- |
| `@GetMapping`    | GET         | Read data                  | No        |
| `@PostMapping`   | POST        | Create a new resource      | Yes       |
| `@PutMapping`    | PUT         | Replace an entire resource | Yes       |
| `@PatchMapping`  | PATCH       | Update part of a resource  | Yes       |
| `@DeleteMapping` | DELETE      | Remove a resource          | No        |

```java
@GetMapping              // GET    /api/transactions
@GetMapping("/{id}")     // GET    /api/transactions/42
@PostMapping             // POST   /api/transactions
@PutMapping("/{id}")     // PUT    /api/transactions/42
@DeleteMapping("/{id}")  // DELETE /api/transactions/42
```

The string inside the annotation is appended to the class-level `@RequestMapping` base path. `"/{id}"` is **not** a literal word — the `{id}` part is a *path placeholder*: a slot that matches any value (`/42`, `/7`, …) and captures it. How you read that captured value inside the method is the next section (`@PathVariable`).

---

## ResponseEntity — controlling the HTTP response

Docs: https://www.baeldung.com/spring-response-entity

`ResponseEntity<T>` is **not** a DTO. It is a wrapper a controller method returns to control two things at once: the **HTTP status code** and the **response body**. The `<T>` is the type of the body it carries (often a DTO, e.g. `ResponseEntity<TransactionResponse>`). You reach for it because a REST API must communicate *what happened* (created? not found? deleted?), not just hand back data — and the status code is how it says that.

Without `ResponseEntity`, every method would return plain `200 OK`, even a `POST` that should say `201 Created` or a `DELETE` that should say `204 No Content`.

Each line below builds a different response — same idea, different status + body:

```java
// 200 OK, body = the transaction object (serialised to JSON)
return ResponseEntity.ok(transaction);

// 201 Created, body = the resource that was just created
return ResponseEntity.status(201).body(created);

// 204 No Content — success, empty body (common for DELETE)
return ResponseEntity.noContent().build();

// 404 Not Found — empty body
return ResponseEntity.notFound().build();

// 400 Bad Request, body = an error message
return ResponseEntity.badRequest().body("Invalid input");
```

The relation to `@RestController`: the controller method returns the `ResponseEntity`, and Spring reads the status from it and serialises the body to JSON with Jackson before sending it to the client.

**Two shortcuts you will use constantly:**

- `ResponseEntity.ok(value)` is exactly `ResponseEntity.status(200).body(value)` — GET and PUT use it, and it *does* include a body (the JSON object or array). These two lines are identical:
  ```java
  return ResponseEntity.ok(projectService.getAll());
  return ResponseEntity.status(200).body(projectService.getAll());
  ```
- `ResponseEntity.noContent().build()` is status 204 with an empty body — DELETE uses it. Every `ResponseEntity` ends in either `.body(value)` (finish with a body) or `.build()` (finish with no body). `noContent()` is just a named shortcut for status 204, the same way `ok()` is for 200.

**Key status codes to know:**

| Code                      | Meaning                       | When to use               |
| ------------------------- | ----------------------------- | ------------------------- |
| 200 OK                    | Success                       | GET, PUT success          |
| 201 Created               | Resource created              | POST success              |
| 204 No Content            | Success, nothing to return    | DELETE success            |
| 400 Bad Request           | Client sent invalid data      | Validation failure        |
| 401 Unauthorized          | Not authenticated             | Missing or invalid token  |
| 403 Forbidden             | Authenticated but not allowed | Wrong role                |
| 404 Not Found             | Resource does not exist       | `findById` returned empty |
| 409 Conflict              | Duplicate resource            | Email already exists      |
| 500 Internal Server Error | Unhandled server error        | Bug                       |

---

## Reading input — @PathVariable, @RequestParam, @RequestBody

### @PathVariable — read a value from the URL path

Docs: https://www.baeldung.com/spring-pathvariable

Sometimes the URL itself carries a value — *which* resource you want. `GET /api/projects/42` means "the project with id 42". The `42` is not a fixed word; it changes per request. `@PathVariable` is how the controller reads that value out of the path and into a method parameter. Three things to be clear about:

**1. The `{}` mark a placeholder, not a literal word.** In the mapping, `"/{id}"` tells Spring "this segment is a variable". Compare it with a static segment on the same base path `@RequestMapping("/api/projects")`:

```java
@GetMapping("/active")   // STATIC  → matches only the literal URL /api/projects/active
@GetMapping("/{id}")     // DYNAMIC → matches /api/projects/1, /api/projects/42, ...
```

`/active` is a fixed word — it matches that exact text and nothing else. `/{id}` matches any value and captures it.

**2. `@PathVariable` reads the captured value and passes it to the method as an argument.** Spring takes whatever matched `{id}` in the URL and injects it into the parameter, so you use it like a normal variable:

```java
// client calls GET /api/projects/42  →  Spring puts 42 into `id`
@GetMapping("/{id}")
public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) {
    return ResponseEntity.ok(projectService.getById(id)); // use it like any argument
}
```

**3. The name in `{}` must match the parameter name** — that is how Spring knows which placeholder fills which parameter. If you want the parameter to have a different name, state the path name explicitly inside `@PathVariable("...")`:

```java
// names match → no argument needed
@GetMapping("/{id}")
public ProjectResponse getById(@PathVariable Long id) { ... }

// rename: the URL placeholder is still {id}, but the parameter is called projectId
@GetMapping("/{id}")
public ProjectResponse getById(@PathVariable("id") Long projectId) { ... }
```

In the second case, `@PathVariable("id")` says "take the `{id}` from the path and put it in `projectId`". Without the explicit `("id")`, Spring would look for a placeholder named `projectId`, not find it, and fail at startup. **That is why `@PathVariable` has to exist at all:** a method can have several parameters, and the annotation is the explicit link that tells Spring "this one comes from the URL path".

---

### @RequestParam — read a value from the query string

Docs: https://www.baeldung.com/spring-request-param

Query parameters are the optional `key=value` pairs after the `?` in a URL: `GET /api/entries?month=2025-05&status=SUBMITTED`. They are the right tool for **optional filters, sorting, and pagination** — not for the resource identity (that is `@PathVariable`). `@RequestParam` reads one of them into a method parameter, the same way `@PathVariable` reads from the path:

```java
// GET /api/entries?month=2025-05&page=0
@GetMapping
public ResponseEntity<List<EntryResponse>> getFiltered(
    @RequestParam(required = false) String month,
    @RequestParam(defaultValue = "0") int page
) { ... }
```

- `required = false` — the parameter is optional; if the client omits it the value is `null` and the request still works
- `defaultValue = "0"` — if omitted, Spring uses `"0"` instead of `null` (setting a default also makes it optional)

> **`@PathVariable` vs `@RequestParam`:** path variable = *which* resource (`/projects/42`), mandatory, part of the address. Query param = *how* to filter the result (`?status=active`), usually optional, an extra on top of the address.

---

### @RequestBody — read the JSON body sent by the client

Docs: https://www.baeldung.com/spring-request-response-body → read: the `@RequestBody` section

For `POST` and `PUT`, the client sends data in the **body** of the request as JSON. `@RequestBody` tells Spring "take that JSON, convert it into this Java object (Jackson does the conversion), and give it to me as a parameter":

```java
// POST /api/projects  with body { "name": "...", "description": "..." }
@PostMapping
public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest request) {
    return ResponseEntity.status(201).body(projectService.create(request));
}
```

`@RequestBody` is only about *receiving* — it is the mirror image of the response. Do not confuse the two directions:

|                              | Direction       | Where it appears                          |
| ---------------------------- | --------------- | ----------------------------------------- |
| `@RequestBody`               | client → server | a method parameter — what you receive     |
| `ResponseEntity.body(value)` | server → client | the return statement — what you send back |

`@Valid` next to `@RequestBody` triggers Bean Validation on the incoming object — if the DTO's `@NotBlank` / `@NotNull` fields fail, Spring returns 400 automatically before your method body runs (see [07-validation.md](./07-validation.md)).

**When to use each one — the simple rule:**

| Annotation      | Data comes from                  | Typical usage                                |
| --------------- | -------------------------------- | -------------------------------------------- |
| `@PathVariable` | URL path — `/{id}`               | GET, PUT, DELETE — identifies which resource |
| `@RequestBody`  | Request body — the JSON you send | POST, PUT — sends data to create or update   |
| `@RequestParam` | Query string — `?month=2025-05`  | GET — optional filters                       |

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

### void vs Void

`delete` returns `ResponseEntity<Void>` because the `<>` needs a *class* and there is no value to send back. The full explanation of the keyword `void` vs the class `Void` lives in the Java notes — see [java/03-methods.md](../java/03-methods.md#void-vs-void).

---

## @JsonIgnore — preventing fields from appearing in JSON

Purpose: `@JsonIgnore` tells Jackson to skip that field when serialising to JSON. Used on entity fields that must never travel over the API — most importantly the `password` field on `User`.

Docs: https://www.baeldung.com/jackson-annotations → read: "@JsonIgnore"

File: `src/main/java/com/victor/timetrack/model/User.java`

```java
@Entity
@Table(name = "users")
public class User {

    @JsonIgnore
    private String password;  // never appears in any JSON response from any endpoint
}
```

This is a defence-in-depth measure. The right approach is DTOs (described below), which give you full control over what goes out. But if code ever accidentally returns a `User` entity directly, `@JsonIgnore` ensures the hash is not exposed. Interviewers ask: "Why doesn't your `/api/users` endpoint return the password?" — either DTOs or `@JsonIgnore` is the expected answer. Using DTOs is better; `@JsonIgnore` is the backup.

---

## DTOs — never expose JPA entities directly

Docs: https://www.baeldung.com/java-dto-pattern

A **DTO** (Data Transfer Object) is a plain class whose only job is to define the *shape* of the data that crosses the API boundary — what the client sends in, and what you send back. It is not a database table and it holds no business logic: just fields. DTOs are how you give a clean shape to your responses instead of returning the raw entity.

**Why not return the JPA entity directly?** The entity is tied to the database schema and can hold fields the client must never see — a password hash, internal foreign keys, lazy-loaded collections. Returning it leaks those fields and couples your public API to your tables: change a column and you accidentally change the API. A DTO lets you control exactly which fields go out and which come in.

> **When do you create the DTO?** Before the service and controller that use it — they name its type in their method signatures, so it has to exist first. The order for a feature is: entity → repository → **DTO** → service → controller (the same flow as [layer-reference.md](./layer-reference.md)).

You keep two DTOs per resource — one per direction:

**`dto/request/CreateProjectRequest.java`** — what the client sends. You validate it, because you can never trust incoming data:

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectRequest {
    @NotBlank
    private String name;

    private String description;
}
```

**`dto/response/ProjectResponse.java`** — what the API returns. You build it yourself in the service, so it needs no validation:

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private Boolean active;
    private LocalDateTime createdAt;
}
```

The **service** converts between the entity and these DTOs; the **controller** only ever deals with DTOs, never the entity. These are the real class-based DTOs from the TimeTrack `projects` feature — `@Data` with Lombok, the style used across the project (not Java `record`s).

---

## Project 07 — TimeTrack (first working endpoint)

This is the first Controller → Service → Repository chain built in the TimeTrack project. Step 1 returns the entity directly — DTOs are introduced in Step 2.

### UserRepository

The repository comes first because the service depends on it. It is just an interface that extends `JpaRepository<User, Long>` — that alone gives you `findAll()`, `findById()`, `save()`, and `deleteById()` with no implementation to write:

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
```

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
- Constructor injection — Spring detects the single constructor and injects `UserRepository` automatically
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

Step 2 introduces DTOs and full CRUD. The key pattern: a private `toResponse()` helper, placed at the **bottom of the class**, avoids repeating the entity-to-DTO mapping in every method.

> This is the *worked, explained* version of the vertical slice. [layer-reference.md](./layer-reference.md) has the same flow as a quick-reference set of tables (using a `Transaction` example) — open that when you just need to recall the structure; read this when you want the reasoning behind each line.

**Why `.map(this::toResponse)`?** `this::toResponse` is a *method reference* — shorthand for the lambda `project -> this.toResponse(project)` (see [java/09-streams-lambdas.md](../java/09-streams-lambdas.md)). `stream().map(...)` calls it once per entity, turning each `Project` into a `ProjectResponse`, and `toList()` collects the results. The `this::` form works because the helper is a method on this same class.

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

- `toResponse()` is `private` and sits at the **bottom of the class** — it converts a `Project` entity into a `ProjectResponse` DTO; no other class needs it, so it goes after the public methods that call it
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

---

## A complete controller example — generic reference

After building it up step by step with TimeTrack above, here is a clean, all-in-one CRUD controller to keep as a template. It is a generic `Transaction` example — the same shape as the real `ProjectController`, with every verb in one place.

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
