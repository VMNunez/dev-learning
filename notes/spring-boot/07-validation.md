# Bean Validation

> 📖 [Spring Boot — Validation](https://docs.spring.io/spring-boot/reference/io/validation.html)

## The problem without validation

Without validation, clients can send anything: a negative amount, an empty email, a null date. You either write manual `if` checks in every service method, or you let bad data reach the database. Both are wrong.

Bean Validation solves this with annotations on DTOs. One annotation on a field + `@Valid` on the controller parameter = automatic rejection of invalid input with a 400 response, before the method body even runs.

---

## The annotations you use most

```java
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
| `@Email` | String | not a valid email format |
| `@Pattern(regexp)` | String | does not match the regex |

**`@NotBlank` vs `@NotNull` for strings — always use `@NotBlank`.**
`@NotNull` allows `""` (empty string). `@NotBlank` also rejects empty strings and pure whitespace. In practice you almost never want to allow an empty string, so `@NotBlank` is the correct default for every string field.

---

## Triggering validation — @Valid on @RequestBody

```java
@PostMapping
public ResponseEntity<TransactionDTO> create(@Valid @RequestBody TransactionCreateDTO dto) {
    // Spring only reaches here if all @NotBlank, @NotNull, etc. passed
    TransactionDTO created = service.create(dto);
    return ResponseEntity.status(201).body(created);
}
```

If any constraint fails, Spring throws `MethodArgumentNotValidException` before the method runs. Your `@ControllerAdvice` catches it and returns a 400 with field-level error messages — see [05-exception-handling.md](05-exception-handling.md) for the handler code.

---

## Validate where the data enters — DTOs, not entities

Validation belongs on request DTOs, not on JPA entities. The entity lives in the database layer and can have state that is valid in the database but should not be accepted from external clients. The DTO is the public API contract — that is where you enforce what clients are allowed to send.

> The repeating pattern: DTOs are the boundary. Validate at the boundary. Everything inside the boundary (service, repository, entity) trusts that the data is already valid.

---

## Validating path variables and query params

For individual parameters (not a `@RequestBody` object), use `@Validated` on the controller class:

```java
@RestController
@RequestMapping("/api/transactions")
@Validated   // enables constraint annotations on individual parameters
public class TransactionController {

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getById(
        @PathVariable @Positive(message = "Id must be positive") Long id
    ) {
        return ResponseEntity.ok(service.getById(id));
    }
}
```

`@Positive` on `@PathVariable` rejects negative or zero IDs automatically. Spring throws `ConstraintViolationException` instead of `MethodArgumentNotValidException` — handle both in `@ControllerAdvice`.

---

## Custom error messages

Every annotation accepts a `message` parameter. Write messages that make sense to the client — the Angular frontend will display them:

```java
@NotBlank(message = "Email is required")
@Email(message = "Please enter a valid email address")
String email;

@Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
String password;
```

Default messages (like "must not be blank") are technical. Custom messages are user-friendly. Always use custom messages on public-facing DTOs.
