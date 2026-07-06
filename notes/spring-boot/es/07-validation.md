# Bean Validation

> 📖 [Baeldung — Validation with Spring Boot](https://www.baeldung.com/spring-boot-bean-validation)
> 📖 [Spring Boot — Validation](https://docs.spring.io/spring-boot/reference/io/validation.html)

## La dependencia requerida

Propósito: las anotaciones de Bean Validation (`@NotBlank`, `@Email`, `@Positive`) compilan y no dan error aunque falte la dependencia — pero en tiempo de ejecución son completamente ignoradas. Hay que añadir `spring-boot-starter-validation` de forma explícita.

Docs: https://docs.spring.io/spring-boot/reference/io/validation.html → leer: "Validating Method Arguments"

Archivo: `pom.xml`

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

No hace falta versión — la gestiona `spring-boot-starter-parent`. Es un fallo silencioso: las anotaciones compilan, el código arranca, pero el input inválido nunca se rechaza. Añade siempre la dependencia antes de usar anotaciones de validación.

---

## El problema sin validación

Sin validación, los clientes pueden enviar cualquier cosa: un importe negativo, un email vacío, una fecha nula. O escribes comprobaciones `if` manuales en cada método de servicio, o dejas que los datos malos lleguen a la base de datos. Ambas opciones son incorrectas.

Bean Validation resuelve esto con anotaciones en los DTOs. Una anotación en un campo + `@Valid` en el parámetro del controlador = rechazo automático del input inválido con una respuesta 400, antes de que el cuerpo del método llegue siquiera a ejecutarse.

---

## Las anotaciones más usadas

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

| Anotación | Usar para | Qué rechaza |
|-----------|-----------|-------------|
| `@NotNull` | Cualquier tipo | null |
| `@NotBlank` | Solo String | null, cadena vacía, solo espacios |
| `@NotEmpty` | String, Collection | null y vacío (pero permite espacios) |
| `@Size(min, max)` | String, Collection | fuera del rango de longitud |
| `@Min(value)` | Número | por debajo del mínimo |
| `@Max(value)` | Número | por encima del máximo |
| `@Positive` | Número | cero y negativos |
| `@PositiveOrZero` | Número | solo negativos |
| `@Email` | String | formato de email no válido |
| `@Pattern(regexp)` | String | no coincide con la regex |

**`@NotBlank` vs `@NotNull` para Strings — usa siempre `@NotBlank`.**
`@NotNull` permite `""` (cadena vacía). `@NotBlank` también rechaza cadenas vacías y solo espacios. En la práctica casi nunca quieres permitir una cadena vacía, así que `@NotBlank` es el valor por defecto correcto para cualquier campo String.

---

## Activar la validación — @Valid en @RequestBody

```java
@PostMapping
public ResponseEntity<TransactionDTO> create(@Valid @RequestBody TransactionCreateDTO dto) {
    // Spring solo llega aquí si @NotBlank, @NotNull, etc. han pasado
    TransactionDTO created = service.create(dto);
    return ResponseEntity.status(201).body(created);
}
```

Si falla alguna constraint, Spring lanza `MethodArgumentNotValidException` antes de que el método se ejecute. Tu `@ControllerAdvice` lo captura y devuelve un 400 con errores por campo — véase [05-exception-handling.md](05-exception-handling.md) para el código del handler.

---

## Validar donde entran los datos — DTOs, no entidades

La validación va en los DTOs de request, no en las entidades JPA. La entidad vive en la capa de base de datos y puede tener estado que es válido en la BD pero no debería aceptarse de clientes externos. El DTO es el contrato público de la API — ahí es donde defines lo que los clientes tienen permitido enviar.

> El patrón que se repite: los DTOs son el límite. Valida en el límite. Todo lo que está dentro (service, repository, entity) confía en que los datos ya son válidos.

---

## Validar path variables y query params

Para parámetros individuales (no un objeto `@RequestBody`), usa `@Validated` en la clase del controlador:

```java
@RestController
@RequestMapping("/api/transactions")
@Validated   // activa las anotaciones de constraint en parámetros individuales
public class TransactionController {

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getById(
        @PathVariable @Positive(message = "Id must be positive") Long id
    ) {
        return ResponseEntity.ok(service.getById(id));
    }
}
```

`@Positive` en `@PathVariable` rechaza automáticamente IDs negativos o cero. Spring lanza `ConstraintViolationException` en lugar de `MethodArgumentNotValidException` — gestiona ambas en `@ControllerAdvice`.

---

## Mensajes de error personalizados

Cada anotación acepta un parámetro `message`. Escribe mensajes que tengan sentido para el cliente — el frontend Angular los mostrará:

```java
@NotBlank(message = "Email is required")
@Email(message = "Please enter a valid email address")
String email;

@Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
String password;
```

Los mensajes por defecto (como "must not be blank") son técnicos. Los mensajes personalizados son amigables. Usa siempre mensajes personalizados en los DTOs de cara al público.

---

## ConstraintViolationException vs MethodArgumentNotValidException

Propósito: se lanzan dos tipos de excepción diferentes según DÓNDE se active la validación. Necesitas un `@ExceptionHandler` separado para cada uno en `GlobalExceptionHandler`.

Docs: https://www.baeldung.com/spring-mvc-custom-validator → leer: "Spring Boot Controller-Level Validation"

Archivo: `src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java`

| Disparador | Excepción lanzada |
|---|---|
| `@Valid` en `@RequestBody` (DTO) | `MethodArgumentNotValidException` |
| `@Validated` en path variable / query param | `ConstraintViolationException` |

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Gestiona @Valid en @RequestBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .findFirst().orElse("Validation failed");
        return ResponseEntity.badRequest().body(new ErrorResponse(400, message));
    }

    // Gestiona @Validated en path variables / query params
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException e) {
        String message = e.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .findFirst().orElse("Constraint violation");
        return ResponseEntity.badRequest().body(new ErrorResponse(400, message));
    }
}
```

Sin el segundo handler, un `@PathVariable` id negativo lanza `ConstraintViolationException` que sube hasta el handler genérico 500 — el cliente recibe un error poco útil en lugar de un 400 claro.
