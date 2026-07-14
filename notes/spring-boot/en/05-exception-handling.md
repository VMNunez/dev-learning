# Exception Handling in Spring Boot

> 📖 [Baeldung — Error Handling for REST with Spring](https://www.baeldung.com/exception-handling-for-rest-with-spring)
> 📖 [Baeldung — Custom Error Message Handling for REST API (@ControllerAdvice)](https://www.baeldung.com/global-error-handler-in-a-spring-rest-api)

## The problem — without a global handler

[04-spring-data-jpa.md](./04-spring-data-jpa.md) left the persistence layer working but failing badly. Three exceptions are already being thrown inside your services: `ResourceNotFoundException` from `findById(id).orElseThrow(...)`, `BusinessRuleViolationException` when a manager tries to approve an entry that is not `SUBMITTED`, and a Hibernate constraint violation the database raises by itself the moment someone registers with an email that already exists in `users` (that is `@Column(unique = true)` doing its job). Right now every single one of them reaches the client as the same thing: a `500 Internal Server Error`. A missing project is not a server error — it is a `404`. A broken business rule is a `400`. A duplicate email is a `409`. Something has to sit between the exception and the HTTP response and translate one into the other, **in one place, for the whole API**. That something is this file.

The naive fix is a `try/catch` in every controller method. With 10 endpoints that is 30 extra lines of identical error handling, and the moment you add a new exception type you have to remember to catch it in all 10:

Docs: https://www.baeldung.com/exception-handling-for-rest-with-spring → read: the controller-level `@ExceptionHandler` solution first, and note the limitation the article states — it only applies to the controller it lives in.

```java
// MAL — without @ControllerAdvice, duplicated in every controller method
@GetMapping("/{id}")
public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) {
    try {
        return ResponseEntity.ok(service.getById(id));
    } catch (ResourceNotFoundException e) {
        return ResponseEntity.notFound().build();
    } catch (Exception e) {
        return ResponseEntity.internalServerError().build();
    }
}
```

The solution: one central class that handles all exceptions for the entire API — your `GlobalExceptionHandler`.

---

## @RestControllerAdvice vs @ControllerAdvice

Purpose: both mark a class as a global exception handler, but `@RestControllerAdvice` is the correct choice for a REST API. It combines `@ControllerAdvice` (intercept exceptions from all controllers) and `@ResponseBody` (serialise the return value to JSON automatically).

Docs: https://www.baeldung.com/exception-handling-for-rest-with-spring → read: "@RestControllerAdvice"

File: `src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java`

Without `@ResponseBody`, `@ControllerAdvice` returns the handler's return value as the name of an HTML view to render — not as JSON. In a REST API there is no template engine, so Spring returns a 500 instead of your clean error body. `@RestControllerAdvice` fixes this with no extra configuration.

```java
// Correct — use @RestControllerAdvice in a REST API
@RestControllerAdvice
public class GlobalExceptionHandler { ... }

// Wrong — returns HTML or a 500, not JSON
@ControllerAdvice
public class GlobalExceptionHandler { ... }
```

> **Interview trap:** `@ControllerAdvice` is seen in many older tutorials and textbooks. Interviewers specifically check which annotation you used and ask "why not `@ControllerAdvice`?" — the expected answer is the `@ResponseBody` distinction.

---

## @RestControllerAdvice — the global exception handler

Purpose: one class, outside every controller, whose `@ExceptionHandler` methods Spring calls whenever an exception escapes *any* controller in the app — so each exception type is mapped to its HTTP status exactly once, in one place.

File: `src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java`

Docs: https://www.baeldung.com/exception-handling-for-rest-with-spring → read: the `@ControllerAdvice` section (the global solution, after the controller-level one)

`@RestControllerAdvice` marks a class whose `@ExceptionHandler` methods apply to **all controllers**. Each method declares, in the annotation, the exception class it is responsible for; Spring keeps that mapping and calls the right method when a matching exception is thrown anywhere below the controller — in a service, in a repository, in Hibernate. This is the real skeleton from project 07, trimmed to three of its eleven handlers (the full list is in the table right after it):

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException e) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(buildError(HttpStatus.NOT_FOUND, e.getMessage()));
    }

    @ExceptionHandler(BusinessRuleViolationException.class)
    public ResponseEntity<ErrorResponse> handleBusinessRuleViolation(BusinessRuleViolationException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(buildError(HttpStatus.BAD_REQUEST, e.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)   // catch-all fallback
    public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"));
    }
}
```

- **`@ExceptionHandler(X.class)`** — registers this method as the handler for `X`. The method parameter (`X e`) is the exception object itself: Spring passes you the instance it caught, which is how `e.getMessage()` can carry the message the service wrote when it threw.
- **`buildError(...)`** — a private helper of this same class that assembles the response body. It is explained in the "Error response DTO" section below; for now read it as "make the standard error JSON with this status and this message".

The class holds **eleven** `@ExceptionHandler` methods in total. Read the table as the routing table of the whole API: left column, the exception class that reached the advice; right column, the status the client ends up seeing and where that exception came from. Three of the eleven are your own classes; the other eight are Spring's.

| Exception handled | Status | Thrown by |
|---|---|---|
| `BadCredentialsException` | 401 | Spring Security, on a failed login |
| `MethodArgumentNotValidException` | 400 | Spring MVC, when `@Valid` on a `@RequestBody` fails |
| `DataIntegrityViolationException` | 409 | Spring Data, when the DB rejects a unique constraint |
| `ResourceNotFoundException` | 404 | your service, on `.orElseThrow(...)` |
| `BusinessRuleViolationException` | 400 | your service, on a broken business rule |
| `UnauthorizedException` | 403 | your service, when the caller owns nothing here |
| `AccessDeniedException` | 403 | Spring Security, when the role check fails |
| `HttpMessageNotReadableException` | 400 | Spring MVC, when the JSON body is missing or malformed |
| `MissingServletRequestParameterException` | 400 | Spring MVC, when a required `@RequestParam` is absent |
| `MethodArgumentTypeMismatchException` | 400 | Spring MVC, when a param can't be converted to its type |
| `RuntimeException` | 500 | anything unhandled — the catch-all |

> **`UnauthorizedException` returns 403, not 401 — and the name lies a little.** It is thrown when a user tries to submit or edit someone else's time entry: Spring Security already knows exactly who they are (a valid JWT got them this far), they just aren't allowed to touch that row. "Known but not permitted" is 403 by definition — see the status-code table further down. The name is a leftover; the status is right.

### How Spring picks a handler when the types overlap

Look closely at the three handlers above and a real problem appears: `ResourceNotFoundException extends RuntimeException`. So when your service throws a `ResourceNotFoundException`, **two** handlers technically match it — the specific one, and the `RuntimeException` catch-all. Both are legal targets. Why do you get a `404` and not a `500`?

Because Spring does not pick the first match, and it does not pick the last one declared either. At startup, `ExceptionHandlerMethodResolver` scans the advice class and builds a map from *exception class* → *handler method*. When an exception is thrown, it takes the exception's actual runtime class and walks **up its inheritance chain**, level by level, looking for the closest class in that map. The first level that has an entry wins — the **most specific** handler, measured as depth in the class hierarchy, not order in the file.

```
        thrown: ResourceNotFoundException
                    │
   depth 0 ─── ResourceNotFoundException  → handler registered?  YES  ✅ stops here → 404
                    │  (extends)
   depth 1 ─── RuntimeException           → handler registered?  YES  (never reached)
                    │  (extends)
   depth 2 ─── Exception                  → handler registered?  no
```

> **The analogy:** think of it as a fire drill in a building. The exception starts on its own floor (its exact class) and looks for an exit on that floor. Only if there is no exit there does it go up one floor (its superclass) and look again. It takes the first exit it finds on the way up — so a specialised exit on your own floor is always used before the emergency exit on the roof. The `RuntimeException` catch-all *is* that roof exit: it is only ever taken by exceptions that had no exit of their own.

That is why the catch-all is safe to keep even though it matches almost everything: it can never steal a request from a more specific handler. And it is also why adding a new specific `@ExceptionHandler` immediately changes the behaviour of exceptions that were previously falling into the catch-all — you are opening an exit on a lower floor.

> **Where "most specific" gets ambiguous.** If two methods **inside the same advice class** declare the *same* exception class — say you accidentally write two `@ExceptionHandler(ResourceNotFoundException.class)` methods — `ExceptionHandlerMethodResolver` cannot rank them while it is building its map, and it refuses to start: `IllegalStateException: Ambiguous @ExceptionHandler method mapped for [class com.victor.timetrack.exception.ResourceNotFoundException]: {handleResourceNotFound, handleNotFound}`. It is never a runtime coin flip — you find out the moment the app boots. Note the exact scope of that failure: two *different* advice classes both handling the same exception is **not** an error — Spring simply consults them in `@Order` sequence and the first advice that has a match wins. The startup failure is only for a duplicate inside one class.

With this in place, controllers become clean — they only contain the happy path:

```java
// Clean controller — no try/catch needed
@GetMapping("/{id}")
public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) {
    return ResponseEntity.ok(service.getById(id));
    // service throws ResourceNotFoundException if not found → GlobalExceptionHandler returns 404
}
```

> The `ErrorResponse` built by `buildError` is the one and only body shape this API ever returns for an error. The full DTO — its fields and the rule that hides the ones that don't apply — is in the "Error response DTO" section below.

---

## Custom exceptions

Purpose: give your domain failures their own type, so the service can say *what went wrong in business terms* and `GlobalExceptionHandler` has something specific to route to an HTTP status — instead of everything arriving as an anonymous `RuntimeException` that can only become a 500.

File: `src/main/java/com/victor/timetrack/exception/ResourceNotFoundException.java` (and `BusinessRuleViolationException.java`, `UnauthorizedException.java` next to it)

Docs: https://www.baeldung.com/java-new-custom-exception → read: the section on creating a custom unchecked exception

Project 07 has exactly three of them, and they are all this small — the class *is* the information. There is no logic inside, no fields; the only thing each one adds to `RuntimeException` is its **name**, and the name is what the `@ExceptionHandler` matches on:

```java
// src/main/java/com/victor/timetrack/exception/ResourceNotFoundException.java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

// BusinessRuleViolationException.java and UnauthorizedException.java are identical
// in shape — only the class name differs.
```

- **`extends RuntimeException`** — makes it *unchecked* (see below).
- **`super(message)`** — hands the message string up to `RuntimeException`'s own constructor, which is what stores it. That is the string `e.getMessage()` returns later inside the handler, and therefore the string the frontend ends up showing the user. If you forget the `super(message)` call, the exception still works but `getMessage()` returns `null` and your 404 body arrives with `"message": null`.

Here is how the service throws it — the real line from `TimeEntryService`:

```java
// service — the entry either exists, or the request is a 404
TimeEntry timeEntry = timeEntryRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));
```

> **What `.orElseThrow()` is doing here.** `findById(id)` does not return a `TimeEntry` — it returns an `Optional<TimeEntry>`, a small wrapper object that either holds the entry or holds nothing. Spring Data returns it deliberately, so that "not found" can never reach you as a silent `null` you forget to check. `.orElseThrow(...)` is how you open that wrapper: if it holds a value you get the `TimeEntry` back, and if it is empty it throws the exception the lambda inside it builds. The `() -> new ResourceNotFoundException(...)` part is a lambda — a small function Java only executes *if* the box turns out to be empty, so the exception object is never created on the happy path. Both are pure Java, not Spring: `Optional<T>` in full in [java/10-generics.md — `Optional<T>`](../../java/en/10-generics.md#optionalt), lambdas in [java/09-streams-lambdas.md](../../java/en/09-streams-lambdas.md#lambda-syntax).

**Why extend `RuntimeException` (unchecked) and not `Exception` (checked):**

Checked exceptions force every caller in the stack to either handle them or re-declare them with `throws`. Your service throws from three layers below the controller, so a checked exception would mean `throws ResourceNotFoundException` on the service method, on the controller method, and on anything in between — every one of them declaring an error it cannot fix and does not want to know about. Spring Boot's convention is the opposite: throw unchecked exceptions from services, let them fly untouched through every layer, and catch them once, globally, in `@RestControllerAdvice`. That is exactly why the class extends `RuntimeException` and not `Exception`.

The checked/unchecked distinction itself, and what the compiler does with each, is in [java/08-exceptions.md](../../java/en/08-exceptions.md) — the pattern is the same, applied here to the REST API layer.

> **Duplicate email doesn't get a custom exception — and that is on purpose.** You might expect a `DuplicateResourceException` next to these three, but there is none: the duplicate-email failure is not thrown by your code at all. PostgreSQL rejects the insert because of the `@Column(unique = true)` constraint from [04-spring-data-jpa.md](./04-spring-data-jpa.md), Hibernate turns that rejection into Spring's own `DataIntegrityViolationException`, and `GlobalExceptionHandler` catches *that* class directly and maps it to `409 Conflict`. Writing a custom exception only makes sense when *you* are the one detecting the failure.

```java
@ExceptionHandler(DataIntegrityViolationException.class)
public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException e) {
    return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(buildError(HttpStatus.CONFLICT, "A resource with this value already exists"));
}
```

> **Why the message is generic** (`"A resource with this value already exists"`) instead of echoing the database's own text: the raw constraint violation contains the table name, the column name and the constraint name — internal schema details you never want to hand to an anonymous caller. The handler deliberately drops `e.getMessage()` and writes its own.

---

## Error response DTO

Before this DTO existed, each handler invented its own body shape, and they drifted apart immediately.

> **This paragraph is history, not the current code.** In an earlier commit of project 07 there was no `ErrorResponse` at all: `handleBadCredentials` returned a `Map` serialised as `{"error": "..."}` (a String value), while `handleValidation` returned `{"errors": {...}}` (a map value) — two different keys, `error` vs `errors`, for the same concept. The Angular code reading the failure had to know *in advance* which key to expect depending on which exception fired, so any backend change silently broke the frontend. Both handlers were rewritten to return `ErrorResponse`; if you open `GlobalExceptionHandler` today you will not find those shapes anywhere. Keep reading — the rest of this section is the code that is actually in the repo.

The fix is a single error DTO, with **the same shape every time**, regardless of which exception produced it:

Purpose: models the JSON body of any API error in one predictable format, so the frontend always reads the same keys (`message`, `fieldErrors`...) without needing to know which specific exception produced it.

File: `src/main/java/com/victor/timetrack/dto/response/ErrorResponse.java`

Docs: https://www.baeldung.com/jackson-ignore-null-fields → read: "@JsonInclude(Include.NON_NULL)"

```java
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private Instant timestamp;
    private int status;
    private String error;
    private String message;
    private Map<String, String> fieldErrors;
}
```

- **`timestamp: Instant`** — the exact moment the error happened, in UTC. Explained in full (and why `Instant` and not `LocalDateTime`) in [12-dates.md](../../java/en/12-dates.md#instant--an-exact-point-in-time-with-no-timezone-ambiguity) — quick summary: a technical timestamp needs to be the same instant for anyone reading it, regardless of the server's timezone.
- **`status: int`**, not `HttpStatus` — because this object gets serialized to JSON, and JSON has no concept of a Spring enum. It's filled with `status.value()`, the method that converts the `HttpStatus` enum to its number (`404`, `400`...).
- **`error: String`** — the short name of the HTTP code (`"Not Found"`, `"Bad Request"`), obtained with `status.getReasonPhrase()`. This is derivable from `status`, but having it explicit in the JSON saves whoever reads it from memorizing what each number means.
- **`message: String`** — the only field that truly changes exception to exception; the text the frontend normally shows in a toast.
- **`fieldErrors: Map<String, String>`** — only has content when the error comes from validating form fields (see the Bean Validation section below). For every other case it's `null`.

> **`@JsonInclude(JsonInclude.Include.NON_NULL)`** kicks in at serialization time — when Spring Boot converts the Java object to JSON text for the HTTP response, right before sending it to the client. Without this annotation, a `null` `fieldErrors` would still show up as `"fieldErrors": null` in the output JSON. With it, Jackson omits that key entirely whenever it detects a `null` value — so a 404 returns a clean JSON with no `fieldErrors` key, and only a validation error includes it filled in.

To avoid repeating the `timestamp`, `status`, `error`, and `message` construction in every one of the `@ExceptionHandler` methods (11 handlers in this project), a private method inside `GlobalExceptionHandler` itself centralizes that shared part:

```java
private ErrorResponse buildError(HttpStatus status, String message) {
    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setTimestamp(Instant.now());
    errorResponse.setStatus(status.value());
    errorResponse.setError(status.getReasonPhrase());
    errorResponse.setMessage(message);
    return errorResponse;
}
```

`fieldErrors` is deliberately not one of `buildError`'s parameters: it's the only field that doesn't apply to most handlers, so making it a parameter would force the other 10 handlers to pass `null` explicitly without ever using it. In the one handler that does need it (`handleValidation`, see below), `buildError` is called for the shared part, then an extra `.setFieldErrors(...)` is called on the already-built object.

With `buildError`, a typical handler shrinks down to:

```java
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException e) {
    return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(buildError(HttpStatus.NOT_FOUND, e.getMessage()));
}
```

---

## Handling Bean Validation errors

Purpose: turn a failed `@Valid` on a `@RequestBody` into a `400` whose body says **which field** failed and **why**, so the Angular form can paint the message under the matching input instead of showing one vague toast.

File: `src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java` (the `handleValidation` method)

Docs: https://www.baeldung.com/spring-boot-bean-validation → read: the section on handling `MethodArgumentNotValidException`

> **This is the canonical version of this handler.** The validation *annotations* (`@NotBlank`, `@Email`, `@Min`…) and where you put them are covered in [07-validation.md](./07-validation.md); the *handler* that turns their failure into an HTTP response lives here, and the code below is the one in the real `GlobalExceptionHandler`. If you find a different, simpler `handleValidation` elsewhere in these notes, this one is the one that matches the project.

When `@Valid` on a `@RequestBody` fails, Spring throws `MethodArgumentNotValidException`. That exception carries a `BindingResult` inside it — the full report of which fields failed and with what message. `getFieldErrors()` gives you the list of those failures as `FieldError` objects, each with a field name (`getField()`) and a message (`getDefaultMessage()`).

Instead of returning a single String with every message concatenated together, the correct shape is a `Map<String, String>` field → message, so the frontend can render each error under its matching input without having to parse text:

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
    Map<String, String> errors = e.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(
                    FieldError::getField,
                    FieldError::getDefaultMessage,
                    (existing, replacement) -> existing
            ));

    ErrorResponse errorResponse = buildError(HttpStatus.BAD_REQUEST, "Validation failed");
    errorResponse.setFieldErrors(errors);

    return ResponseEntity.badRequest().body(errorResponse);
}
```

Breaking down `Collectors.toMap(...)`:

- **`.stream()`** turns the `List<FieldError>` into a Stream — Java's mechanism for chaining transformations (map, filter, collect) over a collection without writing a manual `for` loop.
- **`Collectors.toMap(keyExtractor, valueExtractor, mergeFunction)`** is the stream's terminal operation: instead of producing another list, it produces a `Map`. It needs you to say, for each element in the stream, what to use as the key and what to use as the value.
- **`FieldError::getField`** is a *method reference* — shorthand for `fieldError -> fieldError.getField()`. It tells the collector: "for each `FieldError`, use the result of `.getField()` as the map key" (`"email"`, `"password"`...).
- **`FieldError::getDefaultMessage`** does the same for the value: "use the result of `.getDefaultMessage()`" (`"must not be blank"`...).
- **`(existing, replacement) -> existing`** is the "merge" function, and it only fires if two `FieldError`s would produce the **same key** — for example, if the `email` field had two validation annotations failing at once (`@NotBlank` and `@Email`). Without this third function, `Collectors.toMap` would throw a runtime exception on that collision (`IllegalStateException: Duplicate key`); with it, you simply keep the first message found and discard the second.

> **Why not just join every message into a single String** (like `Collectors.joining(", ")` would)? Because then the frontend would receive something like `"email: must not be blank, password: must not be blank"` and would have to **parse that text** to know which form field each error belongs to. With a `Map<String, String>`, the frontend accesses it directly by key (`fieldErrors["email"]`) and places it under the correct input, with no parsing at all.

The resulting JSON for a validation error with two empty fields at once:

```json
{
    "timestamp": "2026-07-09T10:15:00.123Z",
    "status": 400,
    "error": "Bad Request",
    "message": "Validation failed",
    "fieldErrors": {
        "email": "must not be blank",
        "password": "must not be blank"
    }
}
```

And a 404 (e.g. `ResourceNotFoundException`), where `fieldErrors` is never populated — note the key doesn't even appear, thanks to `@JsonInclude(NON_NULL)`:

```json
{
    "timestamp": "2026-07-09T10:16:00.456Z",
    "status": 404,
    "error": "Not Found",
    "message": "Project not found with id 9999"
}
```

---

## HTTP status codes — when to return each

Docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

| Status | When |
|--------|------|
| 400 Bad Request | Validation failure, missing required field, invalid format |
| 401 Unauthorized | No authentication token or token is invalid |
| 403 Forbidden | Token is valid but the user does not have permission |
| 404 Not Found | The requested resource does not exist |
| 409 Conflict | Duplicate email, unique constraint violation |
| 500 Internal Server Error | Unhandled exception — the catch-all fallback |

Read the table as a lookup that runs in one direction only: you never start from the status, you start from the **"When" column** — the situation your service just hit — and it tells you which status the handler must return. The line that matters most is the boundary between `401` and `403`: `401` means *I don't know who you are* (no token, or an invalid one), `403` means *I know exactly who you are and you still can't do this* (valid token, insufficient role). Mixing those two up is the single most common mistake in this table, and interviewers ask for the difference by name.

The repeating pattern: **throw in the service, map to HTTP in `@ControllerAdvice`**. The service only knows about domain concepts (resource not found, duplicate entry), not HTTP status codes. `@ControllerAdvice` does the translation.

---

## Finding an unhandled exception's exact class name

Every new `@ExceptionHandler` you add starts the same way: something breaks with the wrong status code, and you need to know exactly which exception class Spring threw before you can write `@ExceptionHandler(SomeException.class)` for it. You never have to guess this — Spring tells you, in one of two places depending on whether anything already caught the exception.

**Case A — nothing catches it, so `DefaultHandlerExceptionResolver` handles it.** When an exception isn't a `RuntimeException` your `GlobalExceptionHandler` recognizes, Spring's own built-in resolver steps in and logs the full class name at `WARN` level in the console:

```
WARN ... DefaultHandlerExceptionResolver : Resolved [org.springframework.web.bind.MissingServletRequestParameterException: Required request parameter 'month' for method parameter type YearMonth is not present]
```

The class name is right there, package included (`org.springframework.web.bind.MissingServletRequestParameterException`) — reproduce the failing request, read the console, copy the name into a new `@ExceptionHandler`.

**Case B — your own catch-all already swallows it silently.** A generic `@ExceptionHandler(RuntimeException.class)` handles every subtype of `RuntimeException`, including ones you haven't written a specific handler for yet — and once your own code handles it, Spring's `DefaultHandlerExceptionResolver` never runs, so that `WARN` log never appears. In that situation, temporarily print the class name yourself, inside the catch-all, right before it returns:

```java
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException e) {
    System.out.println(e.getClass().getName());   // temporary — delete once you've read it
    return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"));
}
```

Reproduce the failing request, read the printed line in the console, then delete it — it was only there to reveal the type, same purpose as a breakpoint you'd remove afterward.

> Both techniques answer the same question — "what exception is this?" — the only difference is *who* is currently catching it: Spring's default resolver (Case A, it logs for you automatically) or your own catch-all (Case B, you have to ask it to tell you, because your code already "handled" it as far as Spring is concerned).

---

## Not every exception is a RuntimeException — the gap a generic catch-all misses

`@ExceptionHandler(RuntimeException.class)` looks like a safety net for "anything unexpected", but it only catches subtypes of `RuntimeException`. Some very common Spring MVC failures are **not** `RuntimeException`s at all — `MissingServletRequestParameterException` (a required `@RequestParam` wasn't sent) is one of them; it descends from `ServletException`, an older, unrelated exception family from the Servlet API, not from `RuntimeException`. Your catch-all simply never sees it — it isn't a match, the same way a `catch (IOException e)` block would never catch a `NullPointerException`.

```java
@ExceptionHandler(MissingServletRequestParameterException.class)
public ResponseEntity<ErrorResponse> handleMissingServletRequestParameter(
        MissingServletRequestParameterException e) {
    return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(buildError(HttpStatus.BAD_REQUEST,
                    "Required parameter '" + e.getParameterName() + "' is missing"));
}
```

`e.getParameterName()` is the method that makes this handler more useful than a generic message — it tells you exactly which query param was missing (`"month"`), pulled straight from the exception rather than hardcoded.

> **Contrast with `MethodArgumentTypeMismatchException`** — a related but different failure: the parameter *was* sent, but Spring couldn't convert its value to the target type (e.g. `?month=2025-13`, an invalid `YearMonth`). This one **is** a `RuntimeException`, so it *does* reach the generic catch-all — but silently, with the wrong status (`500` instead of `400`), which is exactly why "reaches some handler" isn't the same as "reaches the *right* handler". That is why project 07 gives it its own handler too, the eleventh in the table:

```java
@ExceptionHandler(MethodArgumentTypeMismatchException.class)
public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException e) {
    return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(buildError(HttpStatus.BAD_REQUEST,
                    "Invalid value for parameter '" + e.getParameter().getParameterName() + "'"));
}
```

`e.getParameter()` returns a `MethodParameter` — Spring's description of the controller-method argument it was trying to fill — and `.getParameterName()` on it gives you that argument's name (`"month"`). It is one hop longer than `MissingServletRequestParameterException.getParameterName()` above because this exception is raised by the *type conversion* step, which reasons about method parameters, not about query-string names.

---

## The `/error` gotcha — why a missing parameter can return 401 instead of 400

This is a genuine trap that only shows up once Spring Security is in the picture, and it's worth tracing end to end because the symptom (wrong status code, unrelated to authentication) makes no sense until you see the mechanism.

**The chain of events:**

1. `MissingServletRequestParameterException` is thrown while Spring resolves the controller method's arguments — **before** the controller method itself (and therefore any `@PreAuthorize` check on it) ever runs.
2. If nothing in your `@RestControllerAdvice` catches it (see the section above), Spring's `DefaultHandlerExceptionResolver` picks it up and calls `response.sendError(400, ...)`.
3. `sendError()` does not write the response directly — it tells the servlet container "this request failed, forward it internally to the app's error page". Spring Boot's default error page is `/error`, served by `BasicErrorController`.
4. That forward to `/error` is, from Spring Security's point of view, **a brand new request** — hitting the whole filter chain again.
5. `JwtFilter` extends `OncePerRequestFilter`, whose default behavior is to **skip error dispatches** (`shouldNotFilterErrorDispatch()` returns `true` unless overridden) — so it never runs again on this second pass, and no `Authentication` gets set for it.
6. `SecurityConfig`'s rule `.anyRequest().authenticated()` applies to `/error` too, since it was never excluded. With no `Authentication` present, that rule fails.
7. `ExceptionTranslationFilter` catches that failure and calls `jwtAuthenticationEntryPoint.commence(...)` — the exact same entry point that fires for a genuinely missing token — producing a `401 Unauthorized` with `"Authentication required"`.

```
Original request (has a valid JWT)
        │
        ▼
DispatcherServlet: resolves @RequestParam → FAILS (param missing)
        │
        ▼
DefaultHandlerExceptionResolver: sendError(400)
        │
        ▼
Container: forward → /error   (a NEW request/dispatch)
        │
        ▼
JwtFilter: skipped (error dispatch) → no Authentication set
        │
        ▼
.anyRequest().authenticated() → fails → 401, not 400
```

> The status code you see (`401`) has nothing to do with the original problem (a missing query param) — it's a side effect of the error page itself being an unauthenticated request that Spring Security blocks. This is why the fix that matters most is **never letting the exception reach `/error` in the first place**: catch `MissingServletRequestParameterException` (and any other exception that would otherwise fall through to the default resolver) directly in `GlobalExceptionHandler`, the way the section above does. Once your own `@ExceptionHandler` builds the response, step 2 above never triggers `sendError()`, so no second forward ever happens, and the whole chain of steps 3–7 is avoided entirely.

A defense-in-depth addition, on top of catching every exception explicitly: exclude `/error` from `.anyRequest().authenticated()` in `SecurityConfig`, so that *any* future exception that does slip through still reaches the error page instead of being reported as a misleading `401`:

```java
.authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**").permitAll()
        .requestMatchers("/error").permitAll()   // let the error page itself be reachable
        .anyRequest().authenticated()
)
```

> **Interviewers ask:** "Why would a 400-level bug show up as a 401 in a Spring Security app?" — this exact mechanism (internal forward to `/error` treated as an unauthenticated request) is the textbook answer, and it's specific enough that giving it shows you've actually debugged something like this, not just read about `@ExceptionHandler` in isolation.

---

## Where this leaves you — and what comes next

The API now fails honestly. An exception thrown three layers deep in a service no longer leaks out as a 500 with a stack trace: `@RestControllerAdvice` intercepts it, Spring picks the most specific `@ExceptionHandler` by walking up the exception's class hierarchy, `buildError` gives it the one body shape the whole API uses, and `@JsonInclude(NON_NULL)` hides the fields that don't apply. Every controller in the project is back to being nothing but a happy path.

But the last two sections gave the game away. `BadCredentialsException` → `401`. `AccessDeniedException` → `403`. `JwtFilter`, `SecurityConfig`, `.anyRequest().authenticated()`, an `AuthenticationEntryPoint` that fires when no token is present — the `/error` trap only exists *because* there is a security filter chain sitting in front of every request, deciding who gets in before your controller ever runs. Those handlers are already in `GlobalExceptionHandler` and you have not built the thing that throws them.

[06-security-jwt.md](./06-security-jwt.md) builds it: how a request carrying a JWT is authenticated by a filter before it reaches the controller, what Spring Security actually does with the token, and why the exceptions it throws (`BadCredentialsException`, `AccessDeniedException`) arrive at the very same advice class you just wrote.
