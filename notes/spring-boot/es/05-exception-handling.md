# Manejo de excepciones en Spring Boot

> 📖 [Baeldung — Error Handling for REST with Spring](https://www.baeldung.com/exception-handling-for-rest-with-spring)
> 📖 [@ControllerAdvice](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html)

## El problema — sin un handler global

Sin un handler central de excepciones, cada método del controlador necesita su propio try/catch. Con 10 endpoints, esto genera 30 líneas extra de manejo de errores idéntico:

```java
// Sin @ControllerAdvice — duplicado en cada método del controlador
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

La solución: una clase central que gestiona todas las excepciones de toda la API.

---

## @RestControllerAdvice vs @ControllerAdvice

Propósito: ambas marcan una clase como handler global de excepciones, pero `@RestControllerAdvice` es la elección correcta para una REST API. Combina `@ControllerAdvice` (interceptar excepciones de todos los controladores) y `@ResponseBody` (serializar el valor de retorno a JSON automáticamente).

Docs: https://www.baeldung.com/exception-handling-for-rest-with-spring → leer: "@RestControllerAdvice"

Archivo: `src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java`

Sin `@ResponseBody`, `@ControllerAdvice` devuelve el valor de retorno del handler como el nombre de una vista HTML a renderizar — no como JSON. En una REST API no hay motor de plantillas, así que Spring devuelve un 500 en lugar del error limpio que definiste. `@RestControllerAdvice` lo soluciona sin configuración extra.

```java
// Correcto — usar @RestControllerAdvice en una REST API
@RestControllerAdvice
public class GlobalExceptionHandler { ... }

// Incorrecto — devuelve HTML o un 500, no JSON
@ControllerAdvice
public class GlobalExceptionHandler { ... }
```

> **Trampa de entrevista:** `@ControllerAdvice` aparece en muchos tutoriales y libros antiguos. Los entrevistadores comprueban específicamente qué anotación usaste y preguntan "¿por qué no `@ControllerAdvice`?" — la respuesta esperada es la distinción con `@ResponseBody`.

---

## @RestControllerAdvice — el handler global de excepciones

Docs: https://www.baeldung.com/exception-handling-for-rest-with-spring → leer: el ejemplo de métodos `@ExceptionHandler`

`@RestControllerAdvice` marca una clase cuyos métodos `@ExceptionHandler` se aplican a **todos los controladores**. Spring llama automáticamente al handler correcto cuando se lanza una excepción en cualquier lugar:

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

    @ExceptionHandler(Exception.class)   // fallback catch-all
    public ResponseEntity<ErrorResponse> handleGeneric(Exception e) {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse(500, "Internal server error"));
    }
}
```

Con esto en su lugar, los controladores quedan limpios — solo contienen el happy path:

```java
// Controlador limpio — no hay try/catch
@GetMapping("/{id}")
public ResponseEntity<TransactionDTO> getById(@PathVariable Long id) {
    return ResponseEntity.ok(service.getById(id));
    // el service lanza ResourceNotFoundException si no encuentra → @ControllerAdvice devuelve 404
}
```

---

## Excepciones personalizadas

Docs: https://www.baeldung.com/java-new-custom-exception

Las clases de excepción personalizadas dan nombres con significado a tus errores y permiten que `@ControllerAdvice` las enrute a handlers específicos:

```java
// No comprobada — extiende RuntimeException (la convención en Spring Boot)
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

// Uso en el service
public Transaction getById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
}
```

**Por qué extender `RuntimeException` (no comprobada) y no `Exception` (comprobada):**

Las excepciones comprobadas obligan a cada llamador en la pila a gestionarlas o redeclararlas con `throws`. Esto contamina el código de service y controlador con manejo de errores para excepciones que no pueden solucionar. La convención de Spring Boot es: lanza excepciones no comprobadas desde los servicios, captúralas globalmente con `@ControllerAdvice`.

Esto ya está explicado en [08-exceptions.md](../java/08-exceptions.md) — el patrón es el mismo, aplicado a la capa de la REST API.

---

## DTO de respuesta de error

En lugar de devolver un String simple como cuerpo del error, devuelve un objeto estructurado consistente. El frontend Angular puede entonces leer `error.status` y `error.message` para cualquier error:

```java
public record ErrorResponse(
    int status,
    String message,
    LocalDateTime timestamp
) {
    // Constructor de conveniencia — el timestamp siempre es ahora
    public ErrorResponse(int status, String message) {
        this(status, message, LocalDateTime.now());
    }
}
```

---

## Gestionar errores de Bean Validation

Docs: https://www.baeldung.com/spring-boot-bean-validation → leer: la sección sobre gestionar `MethodArgumentNotValidException`

Cuando `@Valid` en un `@RequestBody` falla, Spring lanza `MethodArgumentNotValidException`. Gestiónalo en `@ControllerAdvice` para devolver errores a nivel de campo:

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

## Códigos de estado HTTP — cuándo devolver cada uno

Docs: https://developer.mozilla.org/es/docs/Web/HTTP/Status

| Estado | Cuándo |
|--------|------|
| 400 Bad Request | Fallo de validación, campo requerido que falta, formato inválido |
| 401 Unauthorized | No hay token de autenticación o el token es inválido |
| 403 Forbidden | El token es válido pero el usuario no tiene permiso |
| 404 Not Found | El recurso solicitado no existe |
| 409 Conflict | Email duplicado, violación de constraint única |
| 500 Internal Server Error | Excepción no gestionada — el fallback catch-all |

El patrón que se repite: **lanza en el service, mapea a HTTP en `@ControllerAdvice`**. El service solo conoce conceptos de dominio (recurso no encontrado, entrada duplicada), no códigos de estado HTTP. `@ControllerAdvice` hace la traducción.
