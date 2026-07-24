# Bean Validation

> 📖 [Baeldung — Validation with Spring Boot](https://www.baeldung.com/spring-boot-bean-validation)
> 📖 [Spring Boot — Validation](https://docs.spring.io/spring-boot/reference/io/validation.html)

## Picking up the thread — the annotations 06 used and never explained

[06-security-jwt.md](./06-security-jwt.md) built the machine that decides **who** is calling: a JWT filter puts the user in the `SecurityContextHolder`, `.anyRequest().authenticated()` guards the route, `@PreAuthorize("hasRole('MANAGER')")` guards the method. But look again at the very first class that file touched — `LoginRequest`:

```java
// src/main/java/com/victor/timetrack/dto/request/LoginRequest.java — the real file
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
```

and the controller that receives it:

```java
@PostMapping("/login")
public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
}
```

`@NotBlank` and `@Valid` were used there without a word of explanation. That is the hole this file closes, and the hole is bigger than two annotations. Authentication answers *"is this really Victor?"* — it says nothing about whether the **body** he sent makes any sense. A manager with a perfectly valid token can `POST` a project whose `name` is `""`, or a time entry with `hours: null` and no `projectId`. Every security check passes. The garbage goes straight into PostgreSQL.

> **The airport analogy — and it is the whole file in one image.** Security (file 06) is passport control: it checks *who you are* and whether you are allowed past the barrier. Validation is the gate agent checking your **boarding pass** before you step onto the plane: right flight, right date, seat that exists. Both checks happen at the **boundary** of the airport — nobody re-checks your ticket once you are seated, and nobody checks it in the cockpit. That is exactly the rule this file ends on: validate at the boundary (the DTO), and everything inside the boundary — service, repository, entity — is allowed to trust the data.

## The required dependency

Purpose: Bean Validation annotations (`@NotBlank`, `@Email`, `@Positive`) compile and run without errors even when the dependency is missing — but they are completely ignored at runtime. You must add `spring-boot-starter-validation` explicitly.

Docs: https://www.baeldung.com/spring-boot-bean-validation → read: "Adding the Maven Dependencies" — it shows this exact block and explains that the starter is what brings Hibernate Validator in

File: `pom.xml`

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

No version needed — managed by `spring-boot-starter-parent`. This is a silent failure trap: annotations compile, code runs, but invalid input is never rejected. Always add the dependency before adding validation annotations.

> **Why does it fail silently instead of throwing an error?** `@NotBlank`, `@Positive`, and the rest are just plain annotations — metadata attached to a field, nothing more. On their own they don't run any check; something has to read them and act. That something is Hibernate Validator (the Jakarta Bean Validation reference implementation), and `spring-boot-starter-validation` is what pulls it onto the classpath and lets Spring auto-configure the `Validator` bean that scans and enforces those annotations. Without the starter, the annotations still compile — the compiler only checks that the annotation exists as a type — but no validator is ever registered to look at them, so `@Valid` finds nothing to run and the request sails through unchecked.

---

## The problem without validation

Docs: https://www.baeldung.com/spring-boot-bean-validation → read: the opening sections, up to and including "Validating a REST Controller"

Without validation, clients can send anything: a blank project name, a null `projectId`, `hours` missing entirely. You have exactly two alternatives, and both are bad. Either you write manual `if` checks at the top of every service method:

```java
// MAL — hand-rolled validation, repeated in every service method
public ProjectResponse create(CreateProjectRequest request) {
    if (request.getName() == null || request.getName().isBlank()) {
        throw new BusinessRuleViolationException("Name is required");
    }
    // ... and the same three lines again in update(), and in every other service
    Project project = new Project();
    ...
}
```

— which means the same check duplicated in `create()` and `update()`, an inconsistent error shape per method, and a rule that lives *inside* your business logic instead of at the door. Or you skip the checks and let a blank name reach PostgreSQL, where it is either accepted (a project literally named `""`) or rejected by a `NOT NULL` constraint that surfaces as a `DataIntegrityViolationException` → 409, a status that tells the client nothing useful.

Bean Validation replaces both. One annotation on the field + `@Valid` on the controller parameter, and the request is rejected with a `400` **before your method body ever runs** — the service is never even called:

```java
// BIEN — the rule is declared once, on the field it belongs to
@Data
public class CreateProjectRequest {
    @NotBlank
    private String name;

    private String description;   // no annotation → optional, by design
}
```

> **Why "before the method body runs" is the important half of that sentence.** `@Valid` is not something your controller code calls. Spring MVC resolves the arguments of a controller method *before* invoking it — it deserialises the JSON into a `CreateProjectRequest`, and if the parameter carries `@Valid`, it hands the object to Hibernate Validator at that point. If any constraint fails, Spring never calls your method at all: it throws instead, and the exception is caught by `GlobalExceptionHandler`. Your service therefore has a hard guarantee — by the time it runs, the DTO already satisfies every annotation on it.

---

## The annotations you use most

Docs: https://www.baeldung.com/javax-validation → read: the section listing the standard constraint annotations (`@NotNull`, `@Size`, `@Min`/`@Max`, etc.)

Project 07's real DTOs only use three of these (`@NotBlank`, `@NotNull`, and nothing else — `CreateTimeEntryRequest` is the richest one, with `@NotNull` on `projectId`, `date` and `hours` plus `@NotBlank` on `description`). The DTO below is **proposed, not project code** — it is a fuller example that exercises the rest of the table so you see each annotation in place:

```java
// proposed example — not a file in project 07
public record TransactionCreateDTO(

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    BigDecimal amount,

    @NotBlank(message = "Description cannot be empty")
    @Size(max = 255, message = "Description is too long")
    String description,

    @NotBlank(message = "Category is required")
    String category,

    @NotNull(message = "Date is required")
    LocalDate date

) {}
```

| Annotation | Use for | What it rejects |
|-----------|---------|----------------|
| `@NotNull` | Any type | null |
| `@NotBlank` | String only | null, empty string, whitespace-only |
| `@NotEmpty` | String, Collection | null and empty (but allows whitespace) |
| `@Size(min, max)` | String, Collection | outside the length range |
| `@Min(value)` | Number | below the minimum value |
| `@Max(value)` | Number | above the maximum value |
| `@Positive` | Number | zero and negative numbers |
| `@PositiveOrZero` | Number | negative numbers only |
| `@DecimalMin(value)` | `BigDecimal`, Number | below the minimum — the decimal-safe `@Min` |
| `@DecimalMax(value)` | `BigDecimal`, Number | above the maximum — the decimal-safe `@Max` |
| `@Email` | String | not a valid email format |
| `@Pattern(regexp)` | String | does not match the regex |

Read the table by the **middle column first**: it is the field's Java type that decides which annotations are even legal on it, not your preference. Putting `@NotBlank` on a `BigDecimal` does not fail silently — the app refuses to start with `HV000030: No validator could be found for constraint 'jakarta.validation.constraints.NotBlank' validating type 'java.math.BigDecimal'`. The right-hand column is the one to memorise, because it is where the traps live: `@NotEmpty` accepts `"   "` (whitespace passes — the string is not empty), and `@Positive` **rejects zero**, while `@PositiveOrZero` allows it — a one-word difference in the name and a completely different rule.

### Where a rule stops being validation and becomes business logic

`CreateTimeEntryRequest.hours` is the field that makes this distinction concrete, and it is worth being exact about what project 07 actually does, because it is not what you would guess. `hours` carries **only `@NotNull`** — no `@Positive`, no `@Min`. So `{"hours": -5}` passes Bean Validation completely: the value is not null, and null is the only thing the annotation forbids.

The request is still rejected — just not by the validator. `TimeEntryService.create()` checks the range itself:

```java
// src/main/java/com/victor/timetrack/service/TimeEntryService.java — the real guard
BigDecimal min = new BigDecimal("0.5");
BigDecimal max = new BigDecimal("24");

if (request.getHours().compareTo(min) < 0 || request.getHours().compareTo(max) > 0) {
    throw new BusinessRuleViolationException("Hours must be between 0.5 and 24");
}
```

`compareTo` returns a negative int if the left value is smaller, zero if equal, positive if larger — so `hours.compareTo(min) < 0` reads as "hours is below 0.5". (`BigDecimal` is compared with `compareTo`, never with `==` or `equals`, because `equals` also compares the *scale*: `2.0` and `2.00` are `equals`-different but `compareTo`-equal.) `BusinessRuleViolationException` is project 07's own exception, mapped to a `400` by `GlobalExceptionHandler` — see [05-exception-handling.md](./05-exception-handling.md#custom-exceptions), which is where custom exceptions and their handlers were built.

> **So `-5` hours is refused — but by the service, not by `@Valid`, and the two refusals do not look the same.** Both come back as a `400`, yet a validation failure carries a `fieldErrors` map naming the field (`{"hours": "must not be null"}`), whereas the business-rule failure carries only a flat `"message": "Hours must be between 0.5 and 24"` and no `fieldErrors` key at all (`@JsonInclude(NON_NULL)` drops it). The frontend cannot paint the second one under the `hours` input without hard-coding a string match.
>
> **Which is why the honest reading of project 07 is: this rule is in the wrong place.** "Between 0.5 and 24" is a *shape* rule about a single field — it depends on nothing but the value itself, so it belongs on the DTO (`@DecimalMin("0.5") @DecimalMax("24")` — `@Min`/`@Max` take a `long` and so cannot express `0.5` at all, while `@DecimalMin` takes its bound as a **String** precisely so the number is never routed through a binary `double` that cannot hold `0.5`-style values exactly), where it would be enforced at the door and reported as a `fieldError` like every other field rule. A rule earns its place in the service only when it needs something the DTO cannot see: `TimeEntryService`'s other checks — "the project must be active", "the date cannot be in the future", "you can only edit your own DRAFT entries" — all need the database or the logged-in user, and no annotation on a field can know any of that. That is the line: **if the rule can be decided by looking at the field alone, it is validation; if it needs other rows, other fields, or who is calling, it is business logic.** The `hours` range is currently on the wrong side of that line, and duplicated in `create()` and `update()` — exactly the copy-pasted `if` this file opened by arguing against.

**`@NotBlank` vs `@NotNull` for strings — always use `@NotBlank`.**
`@NotNull` allows `""` (empty string). `@NotBlank` also rejects empty strings and pure whitespace. In practice you almost never want to allow an empty string, so `@NotBlank` is the correct default for every string field.

---

## Triggering validation — @Valid on @RequestBody

Docs: https://www.baeldung.com/spring-boot-bean-validation → read: the section on validating the request body with `@Valid`

The annotations on the DTO are inert on their own — they are metadata sitting on fields. `@Valid` on the controller parameter is the switch that tells Spring "run the validator on this object before you call me". This is the real `create` from `ProjectController`:

```java
// src/main/java/com/victor/timetrack/controller/ProjectController.java
@PreAuthorize("hasRole('MANAGER')")
@PostMapping
public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest request) {
    return ResponseEntity.status(201).body(projectService.create(request));
}
```

Forgetting `@Valid` is the single most common validation bug, and it is invisible: the code compiles, the annotations are still on the DTO, the endpoint works — it just never rejects anything.

```java
// MAL — @NotBlank on the DTO is never checked. A blank name is accepted, 201 Created.
@PostMapping
public ResponseEntity<ProjectResponse> create(@RequestBody CreateProjectRequest request) { ... }

// BIEN — @Valid is what actually triggers Hibernate Validator
@PostMapping
public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest request) { ... }
```

> **Two independent ways to get the same silent failure.** Missing `spring-boot-starter-validation` (no validator exists at all) and missing `@Valid` (a validator exists but nobody asks it to run) produce *identical* symptoms: invalid input sails through with a `201`. When validation "doesn't work", check both, in that order — the dependency first, because it breaks every endpoint at once, while a forgotten `@Valid` only breaks the one method it is missing from.

If a constraint does fail, Spring throws `MethodArgumentNotValidException` before the method runs, and `GlobalExceptionHandler` turns it into a `400` whose body names each failing field. `POST /api/projects` with `{"name": ""}` returns exactly this:

```json
{
    "timestamp": "2026-07-14T09:12:31.884Z",
    "status": 400,
    "error": "Bad Request",
    "message": "Validation failed",
    "fieldErrors": {
        "name": "must not be blank"
    }
}
```

`"must not be blank"` is Hibernate Validator's **default** message for `@NotBlank` — you get it for free because `CreateProjectRequest` writes `@NotBlank` with no arguments. The "Custom error messages" section below is how you replace it. The handler that produces this body lives in [05-exception-handling.md](05-exception-handling.md) — one line summary: it reads the failing fields out of the exception's `BindingResult` into a `Map<String, String>` field → message, and hangs that map on the `ErrorResponse` as `fieldErrors`.

---

## Validate where the data enters — DTOs, not entities

Docs: https://www.baeldung.com/java-entity-vs-dto → read: the whole article — it is short, and the "why they are separate objects" argument is exactly the one this section makes

Validation belongs on request DTOs, not on JPA entities. The entity lives in the database layer and can have state that is valid in the database but should not be accepted from external clients. The DTO is the public API contract — that is where you enforce what clients are allowed to send.

> The repeating pattern: DTOs are the boundary. Validate at the boundary. Everything inside the boundary (service, repository, entity) trusts that the data is already valid. This is the gate agent from the opening analogy — the boarding pass is checked once, at the gate, and never again on board.

```
    client JSON
        │
        ▼
┌───────────────────────────────┐
│  CreateProjectRequest  (DTO)  │ ← @NotBlank lives HERE   ← the boundary
└───────────────────────────────┘
        │  (@Valid passed — data is now trusted)
        ▼
   ProjectService   → no null checks, no isBlank() checks
        │
        ▼
   ProjectRepository
        │
        ▼
   Project (@Entity)  ← NO validation annotations
```

> **Why not just put `@NotBlank` on the `@Entity` and be done with it?** Two reasons, and the second is the one that bites. First, the entity is not the API contract: fields like `id`, `createdAt` or `status` are set by *you*, not by the client, so a rule expressed there is answering the wrong question. Second, entity constraints fire at **flush time** — when Hibernate pushes the row to the database, which is deep inside a transaction, long after your service has already done work. The failure arrives as a `ConstraintViolationException` from the persistence layer, not as a clean `400` with `fieldErrors`, and it is far harder to map back to the field the user typed. Validating on the DTO fails the request at the door, before a single line of business logic runs.

---

## Validating path variables and query params

Docs: TODO — add link (Baeldung, "Validating RequestParams and PathVariables in Spring" — read the whole article, it is short and covers exactly this case)

For individual parameters (not a `@RequestBody` object), use `@Validated` on the controller class. Project 07 does **not** do this today — `ProjectController.getById(@PathVariable Long id)` takes the id unvalidated — so the controller below is **proposed code**, shown on project 07's real shape so you can see where it would go:

```java
// proposed — project 07's ProjectController has no @Validated today
@RestController
@RequestMapping("/api/projects")
@Validated   // enables constraint annotations on individual parameters
public class ProjectController {

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(
        @PathVariable @Positive(message = "Id must be positive") Long id
    ) {
        return ResponseEntity.ok(projectService.getById(id));
    }
}
```

`@Positive` on `@PathVariable` rejects negative or zero IDs automatically, so `GET /api/projects/-1` is refused before the service runs and before Hibernate wastes a `SELECT` looking for a row that cannot exist. Spring throws `ConstraintViolationException` here, **not** `MethodArgumentNotValidException` — a different exception type, needing a different handler, which is what the closing section of this file is about.

> **Why does `@Validated` have to go on the *class* and not on the parameter?** Because the two mechanisms work at completely different levels. `@Valid` on a `@RequestBody` is handled by Spring MVC's argument resolver: Spring is already building that object, so it can hand it to the validator on the spot. A `@PathVariable Long id` has no object to hand over — the constraint is on the *method signature*, and checking it means intercepting the call to the method itself. `@Validated` on the class is what tells Spring to wrap that bean in a proxy (`MethodValidationPostProcessor`) which validates the arguments on every call before delegating to the real method. The annotation is on the class because the proxy wraps the whole class, not one parameter of it.

> **`@Valid` vs `@Validated` — not interchangeable.** `@Valid` is the Java/Jakarta Bean Validation standard annotation — it works on `@RequestBody` objects and cascades into nested objects, but Spring MVC does not process it on individual method parameters like `@PathVariable` or `@RequestParam`. `@Validated` is Spring's own annotation; put it on the *class* to enable constraint checking on individual parameters, and it additionally supports validation groups (running different rules depending on context) which `@Valid` cannot do. Rule of thumb: `@Valid` on a `@RequestBody` DTO, `@Validated` on the controller class when validating loose parameters.

---

## Custom error messages

Docs: https://www.baeldung.com/spring-custom-validation-message-source → read: the first sections, on overriding the default constraint message (the `messages.properties` / i18n part at the end is beyond what project 07 needs)

Every annotation accepts a `message` parameter. Without it you get Hibernate Validator's default — `"must not be blank"`, `"must not be null"`, `"must be greater than 0"` — which is exactly what project 07's DTOs currently return, since they all write bare `@NotBlank` / `@NotNull`. Those strings are the *validator's* vocabulary, not the user's: `fieldErrors: { "projectId": "must not be null" }` is unhelpful in a toast. Write messages that make sense to the client — the Angular frontend prints them under the input:

```java
// proposed — this is what LoginRequest's fields would look like with messages;
// the real LoginRequest in project 07 writes a bare @NotBlank on both fields
@NotBlank(message = "Email is required")
@Email(message = "Please enter a valid email address")
private String email;

@Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
private String password;
```

Default messages (like "must not be blank") are technical. Custom messages are user-friendly. Use custom messages on public-facing DTOs.

> **The message is not a plain string — it is a template.** Hibernate Validator *interpolates* it before returning, which means you can drop the constraint's own attributes into the text with `{}` placeholders: `@Size(min = 8, max = 100, message = "Password must be between {min} and {max} characters")` renders as `"Password must be between 8 and 100 characters"`, and the text stays correct the day you change `min` to `10`. That is also why a literal `{` or `$` in a message needs escaping (`\{`) — the interpolator would otherwise try to resolve it as an expression.

> **Whichever string you choose, the delivery path is the same.** The custom message replaces `FieldError::getDefaultMessage`'s value, and nothing else changes: `handleValidation` still collects it into the `fieldErrors` map, so `{"email": "Email is required"}` arrives in exactly the same body shape as `{"email": "must not be blank"}` did. You are changing the *content* of the error, never its *structure* — which is what lets the Angular form keep reading `fieldErrors[controlName]` without knowing anything about which annotation fired.

---

## Two validation failures, two exceptions — and the second one has no handler yet

Purpose: `@Valid` and `@Validated` do not fail in the same way. Each throws a different exception type, so each needs its own `@ExceptionHandler` — and project 07 currently has only one of the two.

Docs: TODO — add link (Baeldung, "Validating RequestParams and PathVariables in Spring" → its final "Exception Handling" section, the `ConstraintViolationException` handler)

File: `src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java`

| Where validation fired | Triggered by | Exception thrown | Handler in project 07? |
|---|---|---|---|
| A `@RequestBody` DTO | `@Valid` on the parameter | `MethodArgumentNotValidException` | yes — `handleValidation` |
| A loose `@PathVariable` / `@RequestParam` | `@Validated` on the class | `ConstraintViolationException` | **no** |

Read the table left to right as a cause chain: the **left** column is what you annotated, and it fully determines the **right** column — you do not choose the exception type, the *location* of the constraint chooses it for you. The last column is the thing to act on: the first row is already solved, the second is a hole.

**Row one is already built, in file 05.** The `MethodArgumentNotValidException` handler is not repeated here — [05-exception-handling.md → "Handling Bean Validation errors"](./05-exception-handling.md#handling-bean-validation-errors) is its canonical home, and that is the version in the real `GlobalExceptionHandler`. One-sentence reminder so the flow is not broken: it collects the exception's `BindingResult` field errors into a `Map<String, String>` with `Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage, …)`, builds the standard `ErrorResponse` with `buildError(...)`, attaches the map with `setFieldErrors(...)`, and returns a `400`. That is the handler that produced the `"fieldErrors": {"name": "must not be blank"}` body you saw earlier.

**Row two is the new piece — and it does not exist in the repo.** Project 07 uses no `@Validated` anywhere and no `@Positive` on a `@PathVariable`, so no `ConstraintViolationException` is ever thrown, and `GlobalExceptionHandler` has no handler for it. The handler below is therefore **proposed code**, not project code — the moment you add `@Validated` to a controller (as in the section above), you must add this alongside it:

```java
// proposed — add to GlobalExceptionHandler if you introduce @Validated
@ExceptionHandler(ConstraintViolationException.class)
public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException e) {
    Map<String, String> errors = e.getConstraintViolations().stream()
            .collect(Collectors.toMap(
                    v -> v.getPropertyPath().toString(),
                    ConstraintViolation::getMessage,
                    (existing, replacement) -> existing
            ));
    ErrorResponse errorResponse = buildError(HttpStatus.BAD_REQUEST, "Validation failed");
    errorResponse.setFieldErrors(errors);
    return ResponseEntity.badRequest().body(errorResponse);
}
```

It is deliberately shaped like `handleValidation`: same `buildError(...)` + `setFieldErrors(...)`, same `400`, same body — so the frontend keeps reading one and only one error shape no matter where the constraint lived. The only difference is where the field name and the message come from, because `ConstraintViolationException` carries a different payload:

- **`e.getConstraintViolations()`** — a `Set<ConstraintViolation<?>>`, one per failed constraint. There is no `BindingResult` here: `BindingResult` is a Spring MVC object that only exists when Spring bound a JSON body to an object, and a path variable was never bound to anything.
- **`v.getPropertyPath()`** — the path to what failed, and it is **not** a plain field name. For a method parameter it reads `getById.id`, i.e. `method.parameter`, so `.toString()` is required (it returns a `Path`, not a `String`), and the key your frontend sees is `"getById.id"` rather than `"id"`. That leak of the Java method name into the JSON is the reason many teams strip it down to the last segment before returning it.
- **`v.getMessage()`** — the interpolated message (`"Id must be positive"`), the direct counterpart of `FieldError::getDefaultMessage`.

> **Why not skip the handler and let the catch-all deal with it?** Because `ConstraintViolationException` **is** a `RuntimeException`, so it *does* reach `@ExceptionHandler(RuntimeException.class)` — and gets mapped to `500 Internal Server Error` with `"message": "Internal server error"`. The client sent bad input and is told the server is broken. This is the exact trap file 05 named: "reaches some handler" is not the same as "reaches the *right* handler". You do not find this by reading logs full of errors; you find it because the status code is a lie.

> **Confusable name — there are two `ConstraintViolationException` classes.** The one here is `jakarta.validation.ConstraintViolationException` (Bean Validation, thrown by Hibernate Validator, a 400). There is also `org.hibernate.exception.ConstraintViolationException` (a *database* constraint rejected the row — a duplicate unique key), which in project 07 you never see directly because Spring wraps it into `DataIntegrityViolationException` → 409, handled in file 05. Same simple name, different package, different HTTP status: check the import before you write the handler.

---

## Where this leaves you — and what comes next

The boundary is now sealed. A request reaching `ProjectService.create()` cannot carry a blank name, and one reaching `TimeEntryService.create()` cannot carry a null `projectId` or null `hours` — not because the service checks, but because `@Valid` refused the request at the door and `GlobalExceptionHandler` already answered the client with a `400` naming the field. Security says *who*; validation says *what*; the service is finally free to only contain business logic — with the one honest exception noted above, the `hours` range check that project 07 still keeps in `TimeEntryService` and that belongs on the DTO.

And that is precisely where the next problem appears. `TimeEntryService` does not do one thing per request — it reads an entry, checks its status, changes it, saves it, and touches more than one row on the way. The data is valid on the way in, but what happens if the third step throws after the first two already wrote? A half-applied operation is invalid data that no `@NotBlank` in the world can prevent, because it was your own code that produced it.

[08-transactions.md](./08-transactions.md) closes that gap: `@Transactional`, why "all of it or none of it" is a database guarantee rather than a Java one, and which exceptions actually trigger a rollback (the answer surprises most people the first time).
