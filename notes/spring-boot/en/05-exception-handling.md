# Exception Handling in Spring Boot

> 📖 [Baeldung — Error Handling for REST with Spring](https://www.baeldung.com/exception-handling-for-rest-with-spring)
> 📖 [@ControllerAdvice](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html)

## The problem — without a global handler

Without a central exception handler, every controller method needs its own try/catch. With 10 endpoints, this creates 30 extra lines of identical error handling:

```java
// Without @ControllerAdvice — duplicated in every controller method
@GetMapping("/{id}")
public ResponseEntity<TransactionDTO> getById(@PathVariable Long id) {
    try {
        return ResponseEntity.ok(service.getById(id));
    } catch (ResourceNotFoundException e) {
        return ResponseEntity.notFound().build();
    } catch (Exception e) {
        return ResponseEntity.internalServerError().build();
    }
}
```

The solution: one central class that handles all exceptions for the entire API.

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

Docs: https://www.baeldung.com/exception-handling-for-rest-with-spring → read: the `@ExceptionHandler` methods example

`@RestControllerAdvice` marks a class whose `@ExceptionHandler` methods apply to **all controllers**. Spring automatically calls the right handler when an exception is thrown anywhere:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException e) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(404, e.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse(400, e.getMessage()));
    }

    @ExceptionHandler(Exception.class)   // catch-all fallback
    public ResponseEntity<ErrorResponse> handleGeneric(Exception e) {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse(500, "Internal server error"));
    }
}
```

> This `ErrorResponse` is deliberately simplified here, to focus first on how `@RestControllerAdvice` routes each exception to its handler. The full version — with more fields and a rule to hide some of them when they don't apply — is in the "Error response DTO" section below.

With this in place, controllers become clean — they only contain the happy path:

```java
// Clean controller — no try/catch needed
@GetMapping("/{id}")
public ResponseEntity<TransactionDTO> getById(@PathVariable Long id) {
    return ResponseEntity.ok(service.getById(id));
    // service throws ResourceNotFoundException if not found → @ControllerAdvice returns 404
}
```

---

## Custom exceptions

Docs: https://www.baeldung.com/java-new-custom-exception

Custom exception classes give meaningful names to your errors and let `@ControllerAdvice` route them to specific handlers:

```java
// Unchecked — extends RuntimeException (the convention in Spring Boot)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " not found with id: " + id);
    }
}

public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}

// Usage in the service
public Transaction getById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
}
```

**Why extend `RuntimeException` (unchecked) and not `Exception` (checked):**

Checked exceptions force every caller in the stack to either handle them or re-declare them with `throws`. This pollutes service and controller code with error handling for exceptions they cannot fix. Spring Boot's convention is: throw unchecked exceptions from services, catch them globally with `@ControllerAdvice`.

This is already explained in [08-exceptions.md](../java/08-exceptions.md) — the pattern is the same, applied to the REST API layer.

---

## Error response DTO

With only `status` and `message`, a problem shows up as soon as you have more than one kind of error: every `@ExceptionHandler` decides its own JSON body shape, and they end up inconsistent with each other. A real example: `handleBadCredentials` returned `{"error": "..."}` (a String), but `handleValidation` returned `{"errors": {...}}` (a map) — two different keys (`error` vs `errors`) for the same concept. In Angular, the code that reads the error response needs to know in advance which of the two keys to expect depending on which exception triggered the failure — and that's fragile: any backend change silently breaks the frontend.

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

To avoid repeating the `timestamp`, `status`, `error`, and `message` construction in every one of the `@ExceptionHandler` methods (7 handlers in this project), a private method inside `GlobalExceptionHandler` itself centralizes that shared part:

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

`fieldErrors` is deliberately not one of `buildError`'s parameters: it's the only field that doesn't apply to most handlers, so making it a parameter would force the other 6 handlers to pass `null` explicitly without ever using it. In the one handler that does need it (`handleValidation`, see below), `buildError` is called for the shared part, then an extra `.setFieldErrors(...)` is called on the already-built object.

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

Docs: https://www.baeldung.com/spring-boot-bean-validation → read: the section on handling `MethodArgumentNotValidException`

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

The repeating pattern: **throw in the service, map to HTTP in `@ControllerAdvice`**. The service only knows about domain concepts (resource not found, duplicate entry), not HTTP status codes. `@ControllerAdvice` does the translation.
