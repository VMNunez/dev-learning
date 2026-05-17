# Exception Handling in Spring Boot

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

## @ControllerAdvice — the global exception handler

`@ControllerAdvice` marks a class whose `@ExceptionHandler` methods apply to **all controllers**. Spring automatically calls the right handler when an exception is thrown anywhere:

```java
@ControllerAdvice
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

Instead of returning a plain string as the error body, return a consistent structured object. The Angular frontend can then read `error.status` and `error.message` for every error:

```java
public record ErrorResponse(
    int status,
    String message,
    LocalDateTime timestamp
) {
    // Convenience constructor — timestamp is always now
    public ErrorResponse(int status, String message) {
        this(status, message, LocalDateTime.now());
    }
}
```

---

## Handling Bean Validation errors

When `@Valid` on a `@RequestBody` fails, Spring throws `MethodArgumentNotValidException`. Handle it in `@ControllerAdvice` to return field-level errors:

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
    String message = e.getBindingResult()
        .getFieldErrors()
        .stream()
        .map(err -> err.getField() + ": " + err.getDefaultMessage())
        .collect(Collectors.joining(", "));

    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(400, message));
}
```

---

## HTTP status codes — when to return each

| Status | When |
|--------|------|
| 400 Bad Request | Validation failure, missing required field, invalid format |
| 401 Unauthorized | No authentication token or token is invalid |
| 403 Forbidden | Token is valid but the user does not have permission |
| 404 Not Found | The requested resource does not exist |
| 409 Conflict | Duplicate email, unique constraint violation |
| 500 Internal Server Error | Unhandled exception — the catch-all fallback |

The repeating pattern: **throw in the service, map to HTTP in `@ControllerAdvice`**. The service only knows about domain concepts (resource not found, duplicate entry), not HTTP status codes. `@ControllerAdvice` does the translation.
