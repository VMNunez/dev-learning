# REST Controllers

> 📖 [Baeldung — Building a REST API with Spring Boot](https://www.baeldung.com/building-a-restful-web-service-with-spring-and-java-based-configuration)
> 📖 [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)

---

[01-basics.md](./01-basics.md) left you with an app that boots and has nothing to say: Tomcat is listening on 8080, the database is connected, `data.sql` has seeded the first manager — and `@ComponentScan` is walking your packages finding **zero controllers to register**. Every URL you type returns a 404 because no class has ever claimed one. This file closes that hole. From here on, everything you write is the application itself: the classes that own a URL, read what the client sent, and decide what comes back.

---

## The three-layer architecture — the most important pattern

Docs: https://www.baeldung.com/spring-component-repository-service → read: the sections on `@Controller`, `@Service` and `@Repository` — what each stereotype means and why they are separate

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

> **The restaurant.** The controller is the **waiter**: he takes the order, checks it makes sense ("we don't serve that"), and carries the plate back out — he never cooks. The service is the **kitchen**: all the actual decisions happen there (what goes in the dish, in what order, what to do when an ingredient is missing). The repository is the **pantry**: it only knows how to fetch and store ingredients, and it has no opinion about the recipe. A waiter who walks into the pantry and grabs raw meat has skipped the kitchen — that is exactly what a controller calling a repository directly looks like, and why reviewers flag it on sight. The value of the split is that you can replace the pantry (Postgres → MongoDB) without the kitchen noticing, and rewrite the recipe without retraining the waiter.

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
- **`TransactionResponse` is a DTO** (Data Transfer Object) — the shape the API sends back instead of the raw entity. DTOs are explained fully in the "DTOs" section below and in [layer-reference.md](../layer-reference.md).

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

Docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods → read: the summary of each verb

| Annotation       | HTTP method | Purpose                    | Has body? |
| ---------------- | ----------- | -------------------------- | --------- |
| `@GetMapping`    | GET         | Read data                  | No        |
| `@PostMapping`   | POST        | Create a new resource      | Yes       |
| `@PutMapping`    | PUT         | Replace an entire resource | Yes       |
| `@PatchMapping`  | PATCH       | Update part of a resource  | Yes       |
| `@DeleteMapping` | DELETE      | Remove a resource          | No        |

Read this table left to right as *one annotation = one HTTP verb*: the annotation you put on the method is the only thing that decides which verb reaches it — `@GetMapping` and `@PostMapping` on the *same* URL are two different endpoints and never collide. The column that actually changes how you write the method is the last one: **"Has body? = Yes" is exactly the set of methods that need a `@RequestBody` parameter** (POST, PUT, PATCH), and "No" is the set where the only input can come from the URL (`@PathVariable`, `@RequestParam`) — a GET with a JSON body is not something you write, because the client has nowhere natural to put it.

```java
@GetMapping              // GET    /api/transactions
@GetMapping("/{id}")     // GET    /api/transactions/42
@PostMapping             // POST   /api/transactions
@PutMapping("/{id}")     // PUT    /api/transactions/42
@DeleteMapping("/{id}")  // DELETE /api/transactions/42
```

The string inside the annotation is appended to the class-level `@RequestMapping` base path. `"/{id}"` is **not** a literal word — the `{id}` part is a *path placeholder*: a slot that matches any value (`/42`, `/7`, …) and captures it. How you read that captured value inside the method is the next section (`@PathVariable`).

---

## Why PATCH endpoints get a URL suffix and PUT/POST/DELETE don't

`PUT /api/entries/{id}`, `POST /api/entries`, and `DELETE /api/entries/{id}` never need anything appended to the path — the HTTP verb alone already says the whole action: replace the resource, create it, remove it. There is exactly one thing a PUT can mean for a given resource, so the URL never needs to disambiguate further.

`PATCH` is different. "Partially update" is vague on its own — a resource can have many different partial updates, especially one that follows a state machine (see `notes/architecture` for the workflow pattern). A `TimeEntry` can move `DRAFT → SUBMITTED`, `SUBMITTED → APPROVED`, or `SUBMITTED → REJECTED` — three distinct transitions, all technically "PATCH". Without a suffix, `PATCH /api/entries/{id}` alone can't tell the server which transition the client means. The suffix names the specific sub-action:

```java
@PatchMapping("/{id}/submit")   // PATCH /api/entries/42/submit
@PatchMapping("/{id}/approve")  // PATCH /api/entries/42/approve
@PatchMapping("/{id}/reject")   // PATCH /api/entries/42/reject
```

> **Rule of thumb:** if a verb can only mean one thing for that resource (PUT, POST, DELETE), the path stays bare — `/{id}`. If the same verb (PATCH) could mean several different transitions on the same resource, the suffix names which one — `/{id}/submit`, `/{id}/approve`.

---

## ResponseEntity — controlling the HTTP response

Docs: https://www.baeldung.com/spring-response-entity

`ResponseEntity<T>` is **not** a DTO. It is a wrapper a controller method returns to control two things at once: the **HTTP status code** and the **response body**. The `<T>` is the type of the body it carries (often a DTO, e.g. `ResponseEntity<TransactionResponse>`). You reach for it because a REST API must communicate *what happened* (created? not found? deleted?), not just hand back data — and the status code is how it says that.

Without `ResponseEntity`, every method would return plain `200 OK`, even a `POST` that should say `201 Created` or a `DELETE` that should say `204 No Content`.

> **Why not just return the object directly?** Because a method that returns `ProjectResponse` gives Spring nothing to work with except the body — so Spring falls back to its default, `200 OK`, on *every* response. It compiles, Postman shows the JSON, and the endpoint looks fine. It is still wrong: a client (or an Angular interceptor, or a monitoring dashboard) that reads the status code is being told "nothing was created" after a successful creation.

```java
// ❌ MAL — compiles, works, and always answers 200 OK even though it created a resource
@PostMapping
public ProjectResponse create(@Valid @RequestBody CreateProjectRequest request) {
    return projectService.create(request);
}

// ✅ BIEN — the status code is part of the answer: 201 Created + the new resource as the body
@PostMapping
public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest request) {
    return ResponseEntity.status(201).body(projectService.create(request));
}
```

The wrong version is not a compiler error and never will be — that is precisely what makes it easy to ship. `ResponseEntity` is what turns the status code from a Spring default into a decision you make.

> **The parcel.** Think of `ResponseEntity` as posting a parcel. The **box contents** are the body (the JSON), and the **label stuck on the outside** is the status code. Returning the object directly is handing over an unlabelled box: the contents may be perfect, but the courier writes the same generic label on everything. `ResponseEntity.status(201).body(created)` is you writing the label yourself, then putting the contents in — which is exactly the order the builder forces, as the next block shows.

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

**How it gets built, step by step — `ResponseEntity.status(201).body(created)`**

Read this line from the inside out:

1. What is innermost runs first: `created` is already the object the service returned (e.g. the `ProjectResponse` that was just saved to the database).
2. `ResponseEntity.status(201)` is a **static** method that starts building the response, fixing the status code to `201`. It returns a half-built object (a *builder*), not the final `ResponseEntity` yet.
3. `.body(created)` is chained onto that builder and adds the data you want to send as the body. This is where construction finishes: the result is now the complete `ResponseEntity<ProjectResponse>` — status 201 + that body.
4. The method `return`s that object. Spring receives it, serialises the body to JSON with Jackson, and assembles the real HTTP response that reaches Postman: a `201` status header, and the JSON in the body.

**The `<T>` and type safety**

`ResponseEntity<T>` is a **generic** class — the same mechanism you already know from `List<String>` or `Optional<T>`. The `<T>` fixes, at compile time, which concrete object type is allowed inside the body. That is why the method signature and what you pass to `.body(...)` must match: if the method declares `ResponseEntity<ProjectResponse>`, the compiler rejects passing a `String` or any other type into `.body(...)` — the same kind of error `List<String> list = new ArrayList<Integer>()` would produce.

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

Read the table by its **first digit**, not row by row — that is the part you have to recall under pressure in an interview. `2xx` = it worked. `4xx` = *the client* is at fault (it sent bad data, no token, the wrong role, a non-existent id) — the server is healthy and the caller must change something before retrying. `5xx` = *the server* is at fault; the client did nothing wrong and retrying the identical request may well work. The "When to use" column is where the layers of this file meet: the three `4xx` rows you write by hand almost never appear in the controller — 400 comes from `@Valid` (see [07-validation.md](./07-validation.md)), and 404/409 are thrown as exceptions in the *service* and translated into a status by a `@ControllerAdvice` (see [05-exception-handling.md](./05-exception-handling.md)). The controller itself typically only ever chooses between 200, 201 and 204.

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

**The mechanism, step by step**

What actually travels over the network is not a Java object — it is plain text formatted as JSON. Your method needs a real object (`request.getName()`, etc.), so something has to translate that text into an object before your code runs:

1. Postman (or Angular) sends the `POST` with the JSON `{"name": "Project Beta", "description": "..."}` in the request body.
2. Spring receives the request and, because of `@PostMapping`, already knows it must run this `create(...)` method.
3. Before running it, Spring inspects the method's parameters and sees `@RequestBody CreateProjectRequest request`.
4. That annotation tells it: "the text in the body needs to be converted into a `CreateProjectRequest` object, and passed to this parameter".
5. Jackson reads the JSON key by key: it sees `"name"`, looks for a field called `name` in `CreateProjectRequest`, and assigns it `"Project Beta"`. Same for `"description"`.
6. The result is a real `CreateProjectRequest` object, already in memory, with its fields filled in.
7. That already-built object is what your method receives once it starts running — you never write the code that parses the JSON.

> Without `@RequestBody`, Spring would not know that parameter should be filled from the body — by default it looks for parameters in the URL instead (the way `@RequestParam` does), so the object would arrive `null` or empty.

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

---

### void vs Void

`delete` returns `ResponseEntity<Void>` because the `<>` needs a *class* and there is no value to send back. The full explanation of the keyword `void` vs the class `Void` lives in the Java notes — see [java/03-methods.md](../../java/en/03-methods.md#void-vs-void).

---

## DTOs — never expose JPA entities directly

Purpose: a plain class that defines the *shape* of the data crossing the API boundary — one for what the client sends in, one for what you send back — so the controller never touches the JPA entity.

File: `src/main/java/com/victor/timetrack/dto/request/CreateProjectRequest.java` and `src/main/java/com/victor/timetrack/dto/response/ProjectResponse.java`

Docs: https://www.baeldung.com/java-dto-pattern → read: the "The DTO Pattern" section and the mapping example

A **DTO** (Data Transfer Object) is not a database table and it holds no business logic: just fields. It is how you give a clean shape to your responses instead of returning the raw entity.

**Why not return the JPA entity directly?** The entity is tied to the database schema and can hold fields the client must never see — a password hash, internal foreign keys, lazy-loaded collections. Returning it leaks those fields *and* couples your public API to your tables: rename a column and you have silently made a breaking change to every client. Here is the exact failure, on the real `User` entity of this project:

```java
// ❌ MAL — returns the entity. Jackson serialises EVERY field with a getter,
//          and @Data generated getPassword() — so the BCrypt hash goes out over the wire.
@GetMapping
public List<User> getAll() {
    return userRepository.findAll();
}
// GET /api/users  →  [{ "id":1, "name":"Ana", "email":"...", "password":"$2a$10$Xy...", ... }]

// ✅ BIEN — returns a DTO. UserResponse has no password field at all,
//           so there is nothing for Jackson to leak, no matter what the entity grows later.
@GetMapping
public List<UserResponse> getAll() {
    return userService.getAll();
}
// GET /api/users  →  [{ "id":1, "name":"Ana", "email":"...", "role":"EMPLOYEE", "active":true }]
```

The mechanism behind the leak is worth being explicit about, because it is not something you wrote: Jackson decides what to serialise by **reflecting over the class's public getters**, not by reading some list you configured. Lombok's `@Data` on `User` generates a getter for every field — including `password` — so Jackson finds it and prints it. Nobody "returned the password"; you returned an object that *has* one. The DTO fixes it structurally: `UserResponse` has no such field, so the hash cannot escape even by accident.

> **The `@JsonIgnore` alternative — and why TimeTrack does not use it.** Jackson has an annotation, `@JsonIgnore`, that you can put on `private String password` in the entity to tell Jackson "skip this field when serialising". It works, and you will meet it in real codebases as a defence-in-depth measure. **TimeTrack's `User` entity does not carry it** — the project relies on DTOs instead, which is the stronger answer: `@JsonIgnore` protects one field you remembered, a DTO protects every field you did not. Know both, because the interview question is "why doesn't your `/api/users` endpoint return the password?" and the expected answer names DTOs first, `@JsonIgnore` as the backup. Docs: https://www.baeldung.com/jackson-annotations → read: "@JsonIgnore".

> **When do you create the DTO?** Before the service and controller that use it — they name its type in their method signatures, so it has to exist first. The order for a feature is: entity → repository → **DTO** → service → controller (the same flow as [layer-reference.md](../layer-reference.md)).

You keep two DTOs per resource — one per direction:

**`dto/request/CreateProjectRequest.java`** — what the client sends. You validate it, because you can never trust incoming data:

```java
@Data
public class CreateProjectRequest {

    @NotBlank
    private String name;

    private String description;
}
```

**`dto/response/ProjectResponse.java`** — what the API returns. You build it yourself in the service, so it needs no validation:

```java
@Data
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private Boolean active;
    private LocalDateTime createdAt;
}
```

Both carry only `@Data` — Lombok's getters, setters, `equals()`, `hashCode()` and `toString()` in one annotation. No `@NoArgsConstructor` is needed here: a class with no other constructor already gets Java's implicit no-args one, which is all Jackson requires to build the object before calling the setters. (Entities are different — they declare `@AllArgsConstructor`, which *removes* the implicit one, so they must add `@NoArgsConstructor` back explicitly. See [01-basics.md](./01-basics.md#lombok--eliminating-boilerplate-code).)

The **service** converts between the entity and these DTOs; the **controller** only ever deals with DTOs, never the entity. These are the real class-based DTOs from the TimeTrack `projects` feature — Lombok classes, the style used across the project, not Java `record`s.

---

## Project 07 — TimeTrack (first working endpoint)

This is the first Controller → Service → Repository chain built in the TimeTrack project — the `users` slice, the smallest one that proves all three layers are wired together.

> **What you are reading is the Step 2 code, not the Step 1 code.** The endpoint was first built in Step 1 returning `List<User>` — the raw entity, exactly the `// ❌ MAL` version above — precisely so the leak was visible in Postman before DTOs were introduced to fix it in Step 2. The files below are what is in the repo **today**, after that refactor. When the diagram at the end of this section says `List<UserResponse>`, that is why.

### UserRepository

Purpose: the persistence layer for `User` — an interface Spring Data implements at runtime, giving you the CRUD methods for free.

File: `src/main/java/com/victor/timetrack/repository/UserRepository.java`

Docs: https://www.baeldung.com/spring-data-derived-queries → read: the opening sections on how Spring Data turns a method *name* into a query (`findBy…`)

The repository comes first because the service depends on it. It is just an interface extending `JpaRepository<User, Long>` — that alone gives you `findAll()`, `findById()`, `save()` and `deleteById()` with no implementation to write:

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

- The two type arguments are **the entity** and **the type of its `@Id`** — `<User, Long>` because `User.id` is a `Long`. Get them the wrong way round and it will not compile.
- `findByEmail` is a **derived query**: you declare the method, write no body, and Spring Data reads the *name* to generate `SELECT * FROM users WHERE email = ?`. It returns `Optional<User>` because an email that matches nothing is a normal outcome, not an error. It is not used by `/api/users` — login needs it (see [06-security-jwt.md](./06-security-jwt.md)) — but it is in the file, so it is here.
- **There is no `@Repository` annotation on it**, and none is needed: Spring Data detects every interface extending `JpaRepository` and registers the bean itself. Adding `@Repository` is harmless and you will see it in plenty of codebases; it is simply redundant. The full mechanism is in [04-spring-data-jpa.md](./04-spring-data-jpa.md).

### UserService

Purpose: the business layer for `User` — fetches the entities from the repository and converts them into the DTO shape the API is allowed to expose.

File: `src/main/java/com/victor/timetrack/service/UserService.java`

Docs: https://www.baeldung.com/spring-component-repository-service → read: the `@Service` section

```java
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setActive(user.isActive());

        return response;
    }
}
```

- **`@Service`** — Spring finds this class during the `@ComponentScan` from file 01, creates one instance (a bean), and keeps it available for injection
- **`private final UserRepository userRepository`** — declare the dependency; `final` because it never changes after the constructor runs
- **Constructor injection** — Spring sees the single constructor and passes in the `UserRepository` bean automatically ([03-dependency-injection.md](./03-dependency-injection.md))
- **`userRepository.findAll()`** — built-in method from `JpaRepository`; no SQL written by you
- **`user.isActive()`, not `getActive()`** — the field is a primitive `boolean`, and Lombok follows the JavaBeans convention of `isXxx()` for primitives. `ProjectResponse.active` is the wrapper `Boolean`, so *that* one is `getActive()`. Both appear in this file; the difference is the field type, nothing else.
- **`toResponse()` is `private` and sits at the bottom** — no other class needs it, so it goes after the public methods that call it. This helper is the single place the entity→DTO mapping lives.

### UserController

Purpose: the web layer for `User` — owns the `/api/users` URL, and hands every request straight to the service.

File: `src/main/java/com/victor/timetrack/controller/UserController.java`

Docs: https://www.baeldung.com/spring-controller-vs-restcontroller → read: the `@RestController` section

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping
    public List<UserResponse> getAll(){
        return userService.getAll();
    }
}
```

- **`@RestController`** — marks this class as a REST controller; every return value is serialised to JSON automatically
- **`@RequestMapping("/api/users")`** — base URL for all methods in this class
- **`@GetMapping`** — responds to `GET /api/users`; no path argument needed because the base URL is already set on the class
- **`@PreAuthorize("hasRole('MANAGER')")`** — a Spring Security guard added later in the project: only a token whose role is `MANAGER` reaches the method; anyone else gets a 403 before the body runs. Ignore the mechanism for now — it is the subject of [06-security-jwt.md](./06-security-jwt.md); it is quoted here only because removing it would make this a fabricated file rather than the real one.
- **The return type is a bare `List<UserResponse>`, not a `ResponseEntity`** — and this is the one endpoint in the project that gets away with it, precisely because a successful GET *should* answer 200, which is Spring's default. It is the exception that shows the rule: as soon as a method needs to say 201 or 204, the bare return type has no way to express it. Compare it with `ProjectController` below, where every method wraps its result.
- The controller injects the service exactly the way the service injects the repository — one constructor, one `private final` field. Same pattern, one layer up.

### Project 07 — ProjectService — full CRUD with DTOs and toResponse()

Purpose: the business layer for `Project` — the full CRUD, including the role-dependent read and the soft delete.

File: `src/main/java/com/victor/timetrack/service/ProjectService.java`

Docs: https://www.baeldung.com/spring-component-repository-service → read: the `@Service` section

> This is the *worked, explained* version of the vertical slice. [layer-reference.md](../layer-reference.md) has the same flow as a quick-reference set of tables (using a `Transaction` example) — open that when you just need to recall the structure; read this when you want the reasoning behind each line.

**Why `.map(this::toResponse)`?** `this::toResponse` is a *method reference* — shorthand for the lambda `project -> this.toResponse(project)` (see [java/09-streams-lambdas.md](../../java/en/09-streams-lambdas.md)). `stream().map(...)` calls it once per entity, turning each `Project` into a `ProjectResponse`, and `toList()` collects the results. The `this::` form works because the helper is a method on this same class.

```java
@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectResponse> getAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean isManager = Objects.requireNonNull(auth).getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_MANAGER"));

        return isManager
                ? projectRepository.findAll().stream().map(this::toResponse).toList()
                : projectRepository.findByActiveTrue().stream().map(this::toResponse).toList();
    }

    public ProjectResponse getById(Long id) {
        return projectRepository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
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
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project saved = projectRepository.save(project);

        return toResponse(saved);
    }

    public void delete(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        project.setActive(false);   // soft delete — keeps the row, marks it inactive
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

- **`getAll()` reads the caller's role and branches** — a manager sees every project, an employee only the active ones (`findByActiveTrue()`, another derived query). `SecurityContextHolder` is the static holder Spring Security fills with the authenticated user before your method runs, so the service can ask "who is calling?" without the controller passing it down. That the *business* rule ("who may see archived projects") lives in the service and not the controller is the layering rule doing its job. Full mechanism in [06-security-jwt.md](./06-security-jwt.md).
- **`orElseThrow(() -> new ResourceNotFoundException(...))`** — `findById` returns an `Optional<Project>`, and `orElseThrow` either unwraps the value or throws. `ResourceNotFoundException` is a custom exception of this project (not `RuntimeException`), and it is what a `@ControllerAdvice` later turns into a real `404` response — which is exactly why the controller below never has to write `notFound()` by hand ([05-exception-handling.md](./05-exception-handling.md)).
- **`create()` starts with `new Project()`** — the entity does not exist yet; `update()` starts with `findById()` — it must exist to be modified.
- **`save()` handles both insert and update** — JPA decides based on whether the `id` is null.
- **`delete()` returns `void`** and performs a **soft delete**: `active = false` instead of removing the row, so historical time entries never point at a project that vanished.

### Project 07 — ProjectController — full CRUD with ResponseEntity

Purpose: the web layer for `Project` — maps each HTTP verb to a service call and chooses the status code that goes back.

File: `src/main/java/com/victor/timetrack/controller/ProjectController.java`

Docs: https://www.baeldung.com/spring-response-entity → read: the "Using ResponseEntity" examples

```java
@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService){
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>>  getAll(){
        return ResponseEntity.ok(projectService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable Long id){
        return ResponseEntity.ok(projectService.getById(id));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping
    public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest request){
        return ResponseEntity.status(201).body(projectService.create(request));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateProjectRequest request){
        return ResponseEntity.ok(projectService.update(id, request));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

**Key decisions:**

- **Every method body is one line** — and that is the point. The controller decides the URL, the verb and the status code; it makes no decision about *what* happens. All five bodies are "call the service, wrap the result".
- **`getAll` and `getById` use `ResponseEntity.ok()`** — the shortcut for status 200 + body
- **`create` uses `status(201).body()`** — a POST that created something must say 201, not 200
- **`update` uses `ResponseEntity.ok()`** — updating an existing resource returns 200; nothing was created
- **`delete` returns `ResponseEntity<Void>`** — no body; `Void` (uppercase) because `<>` only accepts classes, not the `void` keyword
- **`delete` needs two lines, not one** — the service returns `void`, so there is no value to wrap: you call it, then build the empty 204 response separately
- **`@Valid` sits next to `@RequestBody` on the two write methods** — the validation runs *before* the method body, so an empty `name` is rejected with a 400 and `create()` never runs ([07-validation.md](./07-validation.md))
- **Nothing here catches a "not found"** — `getById` on a missing id looks like it would return an empty 200. It does not: the service throws, and the exception handler converts it to 404 before anything is serialised.

---

### What happens when the manager calls GET /api/users

```
Postman → GET /api/users  (with a MANAGER token)
  → JwtFilter authenticates the token, @PreAuthorize lets it through
    → UserController.getAll()
      → UserService.getAll()
        → UserRepository.findAll()
          → Hibernate generates: SELECT id, name, email, password, role, active FROM users
            → PostgreSQL returns rows
          → returned as List<User>          ← entities, password hash included
        → .map(this::toResponse)            ← the boundary: entities become DTOs HERE
      → returned to the controller as List<UserResponse>
    → Jackson serialises List<UserResponse> to JSON
  → Postman receives [{ "id":1, "name":"Admin Manager", "email":"manager@timetrack.com", ... }]
```

Trace the password through that diagram: it *is* loaded from the database into the `User` entities — Hibernate selects the column, there is no way not to. What never happens is the last step: `toResponse()` copies five fields into a `UserResponse` and the hash is simply not one of them, so by the time Jackson runs there is nothing to leak. **The DTO conversion in the service is the exact line where the database's shape stops and the API's shape begins.**

Hibernate prints that `SELECT` to the console because `spring.jpa.show-sql=true` is set in `application.properties` — the fastest way to confirm your endpoint really hit the database and did not just answer from nowhere.

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

---

## Where this leaves you — and what comes next

The 404 you started this file with is gone. `@ComponentScan` now finds real `@RestController` classes, each one owning a URL; `@GetMapping`/`@PostMapping` route the verb to a method; `@PathVariable`, `@RequestParam` and `@RequestBody` pull the client's input into your parameters; `ResponseEntity` decides what goes back and with which status; and DTOs guarantee that what goes back is a shape you chose, not a database row.

But look again at the very first line of every controller in this file — `private final ProjectService projectService`, filled by a constructor you never call. Nothing in this file explained *who* calls it. You wrote `new` exactly once, on a `Project` entity inside a service; you never wrote `new ProjectService(...)` or `new ProjectController(...)`, and yet both objects exist and are correctly wired to each other at runtime. Three layers only stay decoupled if something outside them does the assembling — and that something is the IoC container.

[03-dependency-injection.md](./03-dependency-injection.md) is where that stops being magic: what a bean actually is, how `@Service`/`@Repository`/`@RestController` register one, how Spring picks the constructor and matches each parameter to a bean, and why constructor injection — not `@Autowired` on a field — is the form every reviewer expects to see.
