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

Propósito: modela el cuerpo JSON de cualquier error de la API en un formato único y predecible, para que el frontend siempre lea las mismas claves (`message`, `fieldErrors`...) sin necesidad de saber qué excepción concreta lo produjo.

Archivo: `src/main/java/com/victor/timetrack/dto/response/ErrorResponse.java`

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

---

## Cómo averiguar el nombre exacto de la clase de una excepción no gestionada

Cada `@ExceptionHandler` nuevo que añades empieza igual: algo falla con el código de estado equivocado, y necesitas saber exactamente qué clase de excepción lanzó Spring antes de poder escribir `@ExceptionHandler(AlgunaExcepcion.class)` para ella. Nunca hace falta adivinarlo — Spring te lo dice, en uno de dos sitios según si algo ya atrapó la excepción o no.

**Caso A — nada la atrapa, así que la gestiona `DefaultHandlerExceptionResolver`.** Cuando una excepción no es una `RuntimeException` que tu `GlobalExceptionHandler` reconozca, el resolutor propio de Spring entra en acción y registra el nombre completo de la clase con nivel `WARN` en la consola:

```
WARN ... DefaultHandlerExceptionResolver : Resolved [org.springframework.web.bind.MissingServletRequestParameterException: Required request parameter 'month' for method parameter type YearMonth is not present]
```

El nombre de la clase está ahí mismo, paquete incluido (`org.springframework.web.bind.MissingServletRequestParameterException`) — reproduce la request que falla, lee la consola, copia el nombre en un `@ExceptionHandler` nuevo.

**Caso B — tu propio catch-all ya se la traga en silencio.** Un `@ExceptionHandler(RuntimeException.class)` genérico gestiona cualquier subtipo de `RuntimeException`, incluidos los que todavía no tienen un handler específico — y en cuanto tu propio código la gestiona, `DefaultHandlerExceptionResolver` de Spring nunca llega a ejecutarse, así que ese `WARN` nunca aparece. En esa situación, imprime tú mismo el nombre de la clase temporalmente, dentro del catch-all, justo antes de que devuelva:

```java
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException e) {
    System.out.println(e.getClass().getName());   // temporal — bórralo en cuanto lo hayas leído
    return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"));
}
```

Reproduce la request que falla, lee la línea impresa en la consola, y bórrala después — solo estaba ahí para revelar el tipo, el mismo propósito que un breakpoint que quitarías después.

> Las dos técnicas responden a la misma pregunta — "¿qué excepción es esta?" — la única diferencia es **quién** la está atrapando en ese momento: el resolutor por defecto de Spring (Caso A, te lo registra automáticamente) o tu propio catch-all (Caso B, tienes que pedirle que te lo diga, porque para Spring tu código ya la ha "gestionado").

---

## No toda excepción es una RuntimeException — el hueco que un catch-all genérico no cubre

`@ExceptionHandler(RuntimeException.class)` parece una red de seguridad para "cualquier cosa inesperada", pero solo atrapa subtipos de `RuntimeException`. Algunos fallos muy comunes de Spring MVC **no son** `RuntimeException` en absoluto — `MissingServletRequestParameterException` (un `@RequestParam` obligatorio que no se envió) es uno de ellos; desciende de `ServletException`, una familia de excepciones más antigua y no relacionada, propia de la API de Servlets, no de `RuntimeException`. Tu catch-all simplemente nunca la ve — no coincide, igual que un bloque `catch (IOException e)` nunca atraparía un `NullPointerException`.

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

`e.getParameterName()` es el método que hace este handler más útil que un mensaje genérico — te dice exactamente qué query param faltaba (`"month"`), sacado directamente de la excepción en vez de escrito a mano.

> **Contraste con `MethodArgumentTypeMismatchException`** — un fallo relacionado pero distinto: el parámetro **sí** se envió, pero Spring no pudo convertir su valor al tipo esperado (por ejemplo, `?month=2025-13`, un `YearMonth` inválido). Esta **sí es** una `RuntimeException`, así que sí llega a un catch-all genérico — pero en silencio, con el código equivocado (`500` en vez de `400`), que es justo por lo que "llega a algún handler" no es lo mismo que "llega al handler correcto". Dale su propio `@ExceptionHandler`, mismo patrón que el de arriba, usando `e.getName()` para indicar qué parámetro tenía el valor inválido.

---

## La trampa de `/error` — por qué un parámetro ausente puede devolver 401 en vez de 400

Esta es una trampa real que solo aparece cuando Spring Security entra en juego, y merece la pena trazarla de principio a fin porque el síntoma (código de estado equivocado, sin relación aparente con autenticación) no tiene sentido hasta que ves el mecanismo completo.

**La cadena de sucesos:**

1. `MissingServletRequestParameterException` se lanza mientras Spring resuelve los argumentos del método del controller — **antes** de que el propio método del controller (y por tanto cualquier `@PreAuthorize` sobre él) llegue a ejecutarse.
2. Si nada en tu `@RestControllerAdvice` la atrapa (ver la sección anterior), el `DefaultHandlerExceptionResolver` de Spring la recoge y llama a `response.sendError(400, ...)`.
3. `sendError()` no escribe la respuesta directamente — le dice al contenedor de servlets "esta request ha fallado, redirígela internamente a la página de error de la app". La página de error por defecto de Spring Boot es `/error`, servida por `BasicErrorController`.
4. Ese salto hacia `/error` es, desde el punto de vista de Spring Security, **una request completamente nueva** — que vuelve a pasar por toda la cadena de filtros.
5. `JwtFilter` extiende `OncePerRequestFilter`, cuyo comportamiento por defecto es **saltarse los error dispatches** (`shouldNotFilterErrorDispatch()` devuelve `true` salvo que lo sobrescribas) — así que no se vuelve a ejecutar en esta segunda pasada, y no se establece ninguna `Authentication` para ella.
6. La regla `.anyRequest().authenticated()` de `SecurityConfig` también se aplica a `/error`, porque nunca quedó excluida. Sin ninguna `Authentication` presente, esa regla falla.
7. `ExceptionTranslationFilter` atrapa ese fallo y llama a `jwtAuthenticationEntryPoint.commence(...)` — el mismo entry point exacto que salta cuando de verdad falta el token — produciendo un `401 Unauthorized` con `"Authentication required"`.

```
Request original (con un JWT válido)
        │
        ▼
DispatcherServlet: resuelve @RequestParam → FALLA (falta el parámetro)
        │
        ▼
DefaultHandlerExceptionResolver: sendError(400)
        │
        ▼
Contenedor: forward → /error   (una request/dispatch NUEVA)
        │
        ▼
JwtFilter: se salta (error dispatch) → no se establece ninguna Authentication
        │
        ▼
.anyRequest().authenticated() → falla → 401, no 400
```

> El código de estado que ves (`401`) no tiene nada que ver con el problema original (un query param ausente) — es un efecto secundario de que la propia página de error es una request sin autenticar que Spring Security bloquea. Por eso el arreglo que de verdad importa es **no dejar nunca que la excepción llegue a `/error`**: atrapa `MissingServletRequestParameterException` (y cualquier otra excepción que de otro modo caería en el resolutor por defecto) directamente en `GlobalExceptionHandler`, tal como hace la sección anterior. En cuanto tu propio `@ExceptionHandler` construye la respuesta, el paso 2 de arriba nunca llega a llamar a `sendError()`, así que nunca se produce el segundo forward, y toda la cadena de los pasos 3-7 se evita por completo.

Un añadido de defensa en profundidad, además de atrapar cada excepción explícitamente: excluir `/error` de `.anyRequest().authenticated()` en `SecurityConfig`, para que *cualquier* excepción futura que se escape igualmente llegue a la página de error en vez de reportarse como un `401` engañoso:

```java
.authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**").permitAll()
        .requestMatchers("/error").permitAll()   // deja que la propia página de error sea accesible
        .anyRequest().authenticated()
)
```

> **Los entrevistadores preguntan:** "¿Por qué un bug de nivel 400 podría aparecer como un 401 en una app con Spring Security?" — este mecanismo exacto (el forward interno a `/error` tratado como una request sin autenticar) es la respuesta de manual, y es lo bastante específica como para demostrar que has depurado algo así de verdad, no que solo has leído sobre `@ExceptionHandler` de forma aislada.
