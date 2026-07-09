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

> El `ErrorResponse` de este ejemplo está simplificado a propósito, para centrarte primero en cómo `@RestControllerAdvice` enruta cada excepción a su handler. La versión completa — con más campos y una regla para no mostrar alguno cuando no aplica — está en la sección "DTO de respuesta de error" más abajo.

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

Con solo `status` y `message`, aparece un problema en cuanto tienes más de un tipo de error: cada `@ExceptionHandler` decide su propia forma de cuerpo JSON, y acaban sin ser consistentes entre sí. Un ejemplo real: `handleBadCredentials` devolvía `{"error": "..."}` (un String), pero `handleValidation` devolvía `{"errors": {...}}` (un mapa) — dos claves distintas (`error` vs `errors`) para el mismo concepto. En Angular, el código que lee la respuesta de error necesita saber de antemano cuál de las dos claves esperar según qué excepción disparó el fallo — y eso es frágil: cualquier cambio en el backend rompe el frontend en silencio.

La solución es un único DTO de error, con **la misma forma siempre**, sin importar qué excepción lo generó:

Purpose: modela el cuerpo JSON de cualquier error de la API en un formato único y predecible, para que el frontend siempre lea las mismas claves (`message`, `fieldErrors`...) sin necesidad de saber qué excepción concreta lo produjo.

File: `src/main/java/com/victor/timetrack/dto/response/ErrorResponse.java`

Docs: https://www.baeldung.com/jackson-ignore-null-fields → leer: "@JsonInclude(Include.NON_NULL)"

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

- **`timestamp: Instant`** — el momento exacto en que ocurrió el error, en UTC. Se explica en detalle (y por qué `Instant` y no `LocalDateTime`) en [12-fechas.md](../../java/es/12-fechas.md#instant--un-punto-exacto-en-el-tiempo-sin-ambigüedad-de-zona-horaria) — resumen rápido: un timestamp técnico necesita ser el mismo instante para cualquiera que lo lea, independientemente de la zona horaria del servidor.
- **`status: int`**, no `HttpStatus` — porque este objeto se serializa a JSON, y JSON no tiene el concepto de enum de Spring. Se rellena con `status.value()`, el método que convierte el enum `HttpStatus` a su número (`404`, `400`...).
- **`error: String`** — el nombre corto del código HTTP (`"Not Found"`, `"Bad Request"`), obtenido con `status.getReasonPhrase()`. Es información derivable de `status`, pero tenerla explícita en el JSON evita que quien lo lea tenga que memorizar qué significa cada número.
- **`message: String`** — el único campo que cambia de verdad excepción a excepción; el texto que normalmente muestra el frontend en un toast.
- **`fieldErrors: Map<String, String>`** — solo tiene contenido cuando el error viene de validar campos de un formulario (ver la sección de Bean Validation, abajo). En el resto de casos vale `null`.

> **`@JsonInclude(JsonInclude.Include.NON_NULL)`** actúa en el momento de serializar — cuando Spring Boot convierte el objeto Java a texto JSON para la respuesta HTTP, justo antes de mandarlo al cliente. Sin esta anotación, un `fieldErrors` en `null` aparecería igualmente como `"fieldErrors": null` en el JSON de salida. Con la anotación, Jackson omite esa clave por completo cuando detecta que el valor es `null` — así un 404 devuelve un JSON limpio, sin la clave `fieldErrors`, y solo un error de validación la incluye rellena.

Para no repetir la construcción de `timestamp`, `status`, `error` y `message` en cada uno de los `@ExceptionHandler` (7 handlers en este proyecto), un método privado dentro del propio `GlobalExceptionHandler` centraliza esa parte común:

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

`fieldErrors` no forma parte de los parámetros de `buildError` a propósito: es el único campo que no aplica a la mayoría de los handlers, así que meterlo como parámetro obligaría a que los otros 6 handlers pasaran `null` explícitamente sin usarlo nunca. En el único handler que sí lo necesita (`handleValidation`, ver abajo), se llama a `buildError` para la parte común y luego se le hace un `.setFieldErrors(...)` extra al objeto ya construido.

Con `buildError`, un handler típico queda así de corto:

```java
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException e) {
    return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(buildError(HttpStatus.NOT_FOUND, e.getMessage()));
}
```

---

## Gestionar errores de Bean Validation

Docs: https://www.baeldung.com/spring-boot-bean-validation → leer: la sección sobre gestionar `MethodArgumentNotValidException`

Cuando `@Valid` en un `@RequestBody` falla, Spring lanza `MethodArgumentNotValidException`. Esa excepción lleva dentro un `BindingResult` — el informe completo de qué campos fallaron y con qué mensaje. `getFieldErrors()` te da la lista de esos fallos como objetos `FieldError`, cada uno con un nombre de campo (`getField()`) y un mensaje (`getDefaultMessage()`).

En vez de devolver un único String con todos los mensajes concatenados, la forma correcta es un `Map<String, String>` campo → mensaje, para que el frontend pueda pintar cada error debajo de su input correspondiente sin tener que parsear texto:

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

Desglosando el `Collectors.toMap(...)`:

- **`.stream()`** convierte la `List<FieldError>` en un Stream — el mecanismo de Java para encadenar transformaciones (map, filter, collect) sobre una colección sin escribir un `for` manual.
- **`Collectors.toMap(keyExtractor, valueExtractor, mergeFunction)`** es la operación final del stream: en vez de producir otra lista, produce un `Map`. Necesita que le digas, para cada elemento del stream, qué usar como clave y qué usar como valor.
- **`FieldError::getField`** es una *method reference* — una forma abreviada de escribir `fieldError -> fieldError.getField()`. Le dice al collector: "para cada `FieldError`, usa el resultado de `.getField()` como clave del mapa" (`"email"`, `"password"`...).
- **`FieldError::getDefaultMessage`** hace lo mismo para el valor: "usa el resultado de `.getDefaultMessage()`" (`"must not be blank"`...).
- **`(existing, replacement) -> existing`** es la función de "merge", y solo se dispara si dos `FieldError` generaran la **misma clave** — por ejemplo, si el campo `email` tuviera dos anotaciones de validación fallando a la vez (`@NotBlank` y `@Email`). Sin esta tercera función, `Collectors.toMap` lanzaría una excepción en tiempo de ejecución ante esa colisión (`IllegalStateException: Duplicate key`); con ella, simplemente te quedas con el primer mensaje que encontró y descarta el segundo.

> **¿Por qué no simplemente unir todos los mensajes en un único String** (como haría `Collectors.joining(", ")`)? Porque entonces el frontend recibiría algo como `"email: must not be blank, password: must not be blank"` y tendría que **parsear ese texto** para saber a qué campo del formulario pertenece cada error. Con un `Map<String, String>`, el frontend accede directamente por clave (`fieldErrors["email"]`) y lo pone debajo del input correcto, sin ningún parsing.

El JSON resultante de un error de validación con dos campos vacíos a la vez:

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

Y el de un 404 (por ejemplo, `ResourceNotFoundException`), donde `fieldErrors` nunca se rellena — nótese que la clave ni siquiera aparece, gracias a `@JsonInclude(NON_NULL)`:

```json
{
    "timestamp": "2026-07-09T10:16:00.456Z",
    "status": 404,
    "error": "Not Found",
    "message": "Project not found with id 9999"
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
