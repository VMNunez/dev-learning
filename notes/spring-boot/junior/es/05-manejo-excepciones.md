# Manejo de excepciones en Spring Boot

> 📖 [Baeldung — Error Handling for REST with Spring](https://www.baeldung.com/exception-handling-for-rest-with-spring)
> 📖 [Baeldung — Custom Error Message Handling for REST API (@ControllerAdvice)](https://www.baeldung.com/global-error-handler-in-a-spring-rest-api)

## El problema — sin un handler global

[03-spring-data-jpa.md](./03-spring-data-jpa.md) dejó la capa de persistencia funcionando, pero fallando mal. Ya se lanzan tres excepciones dentro de tus services: `ResourceNotFoundException` desde `findById(id).orElseThrow(...)`, `BusinessRuleViolationException` cuando un manager intenta aprobar una entrada que no está en `SUBMITTED`, y una violación de constraint de Hibernate que la propia base de datos lanza en cuanto alguien se registra con un email que ya existe en `users` (eso es `@Column(unique = true)` haciendo su trabajo). Ahora mismo, las tres llegan al cliente como exactamente lo mismo: un `500 Internal Server Error`. Un proyecto que no existe no es un error de servidor — es un `404`. Una regla de negocio rota es un `400`. Un email duplicado es un `409`. Algo tiene que colocarse entre la excepción y la respuesta HTTP y traducir una en la otra, **en un solo sitio, para toda la API**. Ese algo es este archivo.

El arreglo ingenuo es un `try/catch` en cada método del controller. Con 10 endpoints eso son 30 líneas extra de manejo de errores idéntico, y en el momento en que añades un nuevo tipo de excepción tienes que acordarte de capturarla en los 10:

Docs: https://www.baeldung.com/exception-handling-for-rest-with-spring → leer: primero la solución a nivel de controller con `@ExceptionHandler`, y fíjate en la limitación que señala el artículo — solo aplica al controller donde vive.

```java
// MAL — sin @ControllerAdvice, duplicado en cada método del controller
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

La solución: una clase central que gestiona todas las excepciones de toda la API — tu `GlobalExceptionHandler`.

---

## @RestControllerAdvice vs @ControllerAdvice

Propósito: ambas marcan una clase como handler global de excepciones, pero `@RestControllerAdvice` es la elección correcta para una REST API. Combina `@ControllerAdvice` (interceptar excepciones de todos los controllers) y `@ResponseBody` (serializar el valor de retorno a JSON automáticamente).

Docs: https://www.baeldung.com/exception-handling-for-rest-with-spring → leer: "@RestControllerAdvice"

Archivo: `src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java`

Sin `@ResponseBody`, `@ControllerAdvice` devuelve el valor de retorno del handler como el nombre de una vista HTML a renderizar — no como JSON. En una REST API no hay motor de plantillas, así que Spring devuelve un 500 en lugar de tu cuerpo de error limpio. `@RestControllerAdvice` lo soluciona sin configuración extra.

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

Propósito: una única clase, fuera de todo controller, cuyos métodos `@ExceptionHandler` Spring llama cada vez que una excepción escapa de *cualquier* controller de la app — así cada tipo de excepción se mapea a su código HTTP exactamente una vez, en un solo sitio.

Archivo: `src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java`

Docs: https://www.baeldung.com/exception-handling-for-rest-with-spring → leer: la sección `@ControllerAdvice` (la solución global, después de la de nivel de controller)

`@RestControllerAdvice` marca una clase cuyos métodos `@ExceptionHandler` aplican a **todos los controllers**. Cada método declara, en la anotación, la clase de excepción de la que es responsable; Spring guarda ese mapeo y llama al método correcto cuando se lanza una excepción coincidente en cualquier punto por debajo del controller — en un service, en un repository, en Hibernate. Este es el esqueleto real del proyecto 07, recortado a tres de sus once handlers (la lista completa está en la tabla justo después):

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

- **`@ExceptionHandler(X.class)`** — registra este método como el handler de `X`. El parámetro del método (`X e`) es el propio objeto excepción: Spring te pasa la instancia que capturó, que es lo que permite que `e.getMessage()` lleve el mensaje que el service escribió al lanzarla.
- **`buildError(...)`** — un helper privado de esta misma clase que ensambla el cuerpo de la respuesta. Se explica en la sección "DTO de respuesta de error" más abajo; por ahora léelo como "construye el JSON de error estándar con este código y este mensaje".

La clase tiene **doce** métodos `@ExceptionHandler` en total. Lee la tabla como la tabla de enrutamiento de toda la API: columna izquierda, la clase de excepción que llegó al advice; columna derecha, el código que el cliente termina viendo y de dónde viene esa excepción. Cuatro de los doce son tus propias clases; las otras ocho son de Spring.

| Excepción gestionada | Código | Lanzada por |
|---|---|---|
| `BadCredentialsException` | 401 | Spring Security, en un login fallido |
| `MethodArgumentNotValidException` | 400 | Spring MVC, cuando `@Valid` en un `@RequestBody` falla |
| `DataIntegrityViolationException` | 409 | Spring Data, cuando la BD rechaza una constraint única |
| `ResourceNotFoundException` | 404 | tu service, en `.orElseThrow(...)` |
| `BusinessRuleViolationException` | 400 | tu service, en una regla de negocio sobre los *datos enviados* |
| `InvalidStateTransitionException` | 409 | tu service, cuando la request es válida pero el *estado actual* del recurso la prohíbe |
| `UnauthorizedException` | 403 | tu service, cuando quien llama no es dueño de nada aquí |
| `AccessDeniedException` | 403 | Spring Security, cuando falla la comprobación de rol |
| `HttpMessageNotReadableException` | 400 | Spring MVC, cuando el cuerpo JSON falta o está malformado |
| `MissingServletRequestParameterException` | 400 | Spring MVC, cuando falta un `@RequestParam` obligatorio |
| `MethodArgumentTypeMismatchException` | 400 | Spring MVC, cuando un parámetro no se puede convertir a su tipo |
| `RuntimeException` | 500 | cualquier cosa no gestionada — el catch-all |

> **`UnauthorizedException` devuelve 403, no 401 — y el nombre engaña un poco.** Se lanza cuando un usuario intenta enviar o editar el time entry de otra persona: Spring Security ya sabe exactamente quién es (un JWT válido lo trajo hasta aquí), simplemente no tiene permiso para tocar esa fila. "Conocido pero sin permiso" es 403 por definición — ver la tabla de códigos de estado más abajo. El nombre es un resto de una versión anterior; el código sí es el correcto.

### Cómo elige Spring un handler cuando los tipos se solapan

Mira de cerca los tres handlers de arriba y aparece un problema real: `ResourceNotFoundException extends RuntimeException`. Así que cuando tu service lanza una `ResourceNotFoundException`, **dos** handlers técnicamente coinciden con ella — el específico, y el catch-all de `RuntimeException`. Ambos son destinos legales. ¿Por qué obtienes un `404` y no un `500`?

Porque Spring no elige la primera coincidencia, y tampoco elige la última que se declaró. Al arrancar, `ExceptionHandlerMethodResolver` escanea la clase advice y construye un mapa de *clase de excepción* → *método handler*. Cuando se lanza una excepción, toma la clase real en tiempo de ejecución de esa excepción y sube **por su cadena de herencia**, nivel a nivel, buscando la clase más cercana que esté en ese mapa. El primer nivel que tenga una entrada gana — el handler **más específico**, medido como profundidad en la jerarquía de clases, no como orden en el archivo.

```
        se lanza: ResourceNotFoundException
                    │
   nivel 0 ─── ResourceNotFoundException  → ¿handler registrado?  SÍ  ✅ se detiene aquí → 404
                    │  (extiende)
   nivel 1 ─── RuntimeException           → ¿handler registrado?  SÍ  (nunca se alcanza)
                    │  (extiende)
   nivel 2 ─── Exception                  → ¿handler registrado?  no
```

> **La analogía:** piénsalo como un simulacro de incendio en un edificio. La excepción empieza en su propia planta (su clase exacta) y busca una salida en esa planta. Solo si no hay salida ahí sube una planta (su superclase) y vuelve a mirar. Toma la primera salida que encuentra en el camino hacia arriba — así que una salida especializada en tu propia planta siempre se usa antes que la salida de emergencia del tejado. El catch-all de `RuntimeException` *es* esa salida del tejado: solo la toman las excepciones que no tenían salida propia.

Por eso el catch-all es seguro de mantener aunque coincida con casi todo: nunca puede robarle una request a un handler más específico. Y también por eso añadir un nuevo `@ExceptionHandler` específico cambia inmediatamente el comportamiento de excepciones que antes caían en el catch-all — estás abriendo una salida en una planta más baja.

> **Dónde se vuelve ambiguo "más específico".** Si dos métodos **dentro de la misma clase advice** declaran la *misma* clase de excepción — digamos que escribes por accidente dos métodos `@ExceptionHandler(ResourceNotFoundException.class)` — `ExceptionHandlerMethodResolver` no puede ordenarlos mientras construye su mapa, y se niega a arrancar: `IllegalStateException: Ambiguous @ExceptionHandler method mapped for [class com.victor.timetrack.exception.ResourceNotFoundException]: {handleResourceNotFound, handleNotFound}`. Nunca es una moneda al aire en tiempo de ejecución — te enteras en el instante en que la app arranca. Fíjate en el alcance exacto de ese fallo: que dos clases advice *distintas* gestionen ambas la misma excepción **no** es un error — Spring simplemente las consulta en el orden de `@Order` y gana el primer advice que tenga coincidencia. El fallo de arranque es solo para un duplicado dentro de una misma clase.

Con esto en su lugar, los controllers quedan limpios — solo contienen el happy path:

```java
// Controller limpio — no hace falta try/catch
@GetMapping("/{id}")
public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) {
    return ResponseEntity.ok(service.getById(id));
    // el service lanza ResourceNotFoundException si no encuentra → GlobalExceptionHandler devuelve 404
}
```

> El `ErrorResponse` que construye `buildError` es la única forma de cuerpo que esta API devuelve para un error, siempre. El DTO completo — sus campos y la regla que oculta los que no aplican — está en la sección "DTO de respuesta de error" más abajo.

---

## Excepciones personalizadas

Propósito: dar a tus fallos de dominio su propio tipo, para que el service pueda decir *qué salió mal en términos de negocio* y `GlobalExceptionHandler` tenga algo específico a lo que enrutar hacia un código HTTP — en vez de que todo llegue como una `RuntimeException` anónima que solo puede convertirse en un 500.

Archivo: `src/main/java/com/victor/timetrack/exception/ResourceNotFoundException.java` (y `BusinessRuleViolationException.java`, `UnauthorizedException.java` justo al lado)

Docs: https://www.baeldung.com/java-new-custom-exception → leer: la sección sobre crear una excepción no comprobada personalizada

El proyecto 07 tiene cuatro, y todas son así de pequeñas — la clase *es* la información. No hay lógica dentro, ni campos; lo único que cada una añade a `RuntimeException` es su **nombre**, y ese nombre es con el que hace match el `@ExceptionHandler`:

```java
// src/main/java/com/victor/timetrack/exception/ResourceNotFoundException.java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

// BusinessRuleViolationException.java, UnauthorizedException.java e
// InvalidStateTransitionException.java son idénticas en forma — solo cambia el nombre de la clase.
```

- **`extends RuntimeException`** — la hace *no comprobada* (unchecked, ver más abajo).
- **`super(message)`** — pasa el string del mensaje hacia arriba, al propio constructor de `RuntimeException`, que es quien lo almacena. Ese es el string que `e.getMessage()` devuelve luego dentro del handler, y por tanto el string que el frontend termina mostrándole al usuario. Si te olvidas de la llamada `super(message)`, la excepción sigue funcionando pero `getMessage()` devuelve `null` y tu cuerpo del 404 llega con `"message": null`.

Así es como el service la lanza — la línea real de `TimeEntryService`:

```java
// service — la entrada existe, o la request es un 404
TimeEntry timeEntry = timeEntryRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));
```

> **Qué hace `.orElseThrow()` aquí.** `findById(id)` no devuelve un `TimeEntry` — devuelve un `Optional<TimeEntry>`, un pequeño objeto envoltorio que o bien contiene la entrada o bien no contiene nada. Spring Data lo devuelve a propósito, para que "no encontrado" nunca te llegue como un `null` silencioso que se te olvida comprobar. `.orElseThrow(...)` es cómo abres ese envoltorio: si contiene un valor recuperas el `TimeEntry`, y si está vacío lanza la excepción que construye la lambda que va dentro. La parte `() -> new ResourceNotFoundException(...)` es una lambda — una pequeña función que Java solo ejecuta *si* la caja resulta estar vacía, así que el objeto excepción nunca se crea en el happy path. Ambos son Java puro, no Spring: `Optional<T>` en detalle en [java/10-genericos.md — `Optional<T>`](../../../java/junior/es/10-genericos.md#optionalt), lambdas en [java/09-streams-lambdas.md](../../../java/junior/es/09-streams-lambdas.md#sintaxis-de-lambdas).

**Por qué extender `RuntimeException` (no comprobada) y no `Exception` (comprobada):**

Las excepciones comprobadas obligan a cada llamador en la pila a gestionarlas o redeclararlas con `throws`. Tu service lanza desde tres capas por debajo del controller, así que una excepción comprobada significaría `throws ResourceNotFoundException` en el método del service, en el método del controller, y en cualquier cosa intermedia — cada uno de ellos declarando un error que no puede arreglar y que no quiere ni conocer. La convención de Spring Boot es la opuesta: lanza excepciones no comprobadas desde los services, deja que vuelen sin que nadie las toque a través de cada capa, y captúralas una única vez, globalmente, en `@RestControllerAdvice`. Por eso exactamente la clase extiende `RuntimeException` y no `Exception`.

La distinción comprobada/no comprobada en sí, y qué hace el compilador con cada una, está en [java/08-excepciones.md](../../../java/junior/es/08-excepciones.md) — el patrón es el mismo, aplicado aquí a la capa de la REST API.

> **El email duplicado no tiene su propia excepción personalizada — y es a propósito.** Podrías esperar una `DuplicateResourceException` junto a estas tres, pero no existe: el fallo de email duplicado no lo lanza tu código en absoluto. PostgreSQL rechaza el insert por la constraint `@Column(unique = true)` de [03-spring-data-jpa.md](./03-spring-data-jpa.md), Hibernate convierte ese rechazo en la propia `DataIntegrityViolationException` de Spring, y `GlobalExceptionHandler` captura *esa* clase directamente y la mapea a `409 Conflict`. Escribir una excepción personalizada solo tiene sentido cuando *tú* eres quien detecta el fallo.

```java
@ExceptionHandler(DataIntegrityViolationException.class)
public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException e) {
    return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(buildError(HttpStatus.CONFLICT, "A resource with this value already exists"));
}
```

> **Por qué el mensaje es genérico** (`"A resource with this value already exists"`) en vez de repetir el texto propio de la base de datos: la violación de constraint en bruto contiene el nombre de la tabla, el nombre de la columna y el nombre de la constraint — detalles internos del esquema que nunca quieres entregarle a un caller anónimo. El handler descarta deliberadamente `e.getMessage()` y escribe el suyo propio.

### `BusinessRuleViolationException` vs `InvalidStateTransitionException` — ¿400 o 409?

`TimeEntryService` lanza excepciones de regla de negocio por dos motivos genuinamente distintos, y hasta este punto del proyecto ambos usaban la misma clase, `BusinessRuleViolationException`, mapeada al mismo `400`. Dos ejemplos, uno junto al otro:

```java
// create() — rechazado por LO QUE ENVIÓ EL CLIENTE
if (request.getHours().compareTo(min) < 0 || request.getHours().compareTo(max) > 0) {
    throw new BusinessRuleViolationException("Hours must be between 0.5 and 24");
}

// reopen() — rechazado por el ESTADO ACTUAL DEL RECURSO
if (timeEntry.getStatus() != EntryStatus.REJECTED) {
    throw new InvalidStateTransitionException("Employee can only reopen REJECTED entries");
}
```

Las dos son legítimamente "reglas de negocio" en el sentido cotidiano de la palabra — pero fallan por razones opuestas, y esa diferencia es exactamente lo que la distinción `400` vs `409` del estándar HTTP existe para comunicarle a quien llama:

- **`hours: 30`** está mal sin importar en qué estado esté nada. Manda la misma petición otra vez, mañana, contra otra entry distinta — sigue estando mal, porque el problema vive por completo dentro del body de la petición. Ese es el caso de manual para **`400 Bad Request`**: *la propia petición es inválida.*
- **`reopen` sobre una entry en `DRAFT`** no está mal por nada que el cliente enviara — la petición `PATCH` no lleva body en absoluto. Falla por lo que la **entry es ahora mismo** en el servidor. Rechaza la entry #52, y vuelve a intentar ese mismo `PATCH /api/entries/52/reopen` — ahora funciona, sin ningún cambio en la petición. El problema vive en el estado del recurso, no en la petición. Ese es el caso de manual para **`409 Conflict`**: *la petición está bien, pero choca con el estado actual del recurso.*

> **La prueba a aplicar cada vez que no tengas claro cuál toca:** "¿arreglar esto exige que el cliente mande datos distintos, o exige que el estado del recurso cambie primero?" Primer caso → `400`. Segundo caso → `409`. `hours: 30` necesita datos distintos → `400`. `reopen` sobre una entry que no está `REJECTED` necesita que la *entry* cambie primero (que la rechacen) → `409`.

`InvalidStateTransitionException` es ahora la que lanza cada guardia de la máquina de estados en `TimeEntryService` — `submit` (debe estar en `DRAFT`), `reopen` (debe estar en `REJECTED`), `approve`/`reject` (debe estar en `SUBMITTED`), e incluso `update`/`delete` (debe estar en `DRAFT`, porque editar o borrar una entry `SUBMITTED`/`APPROVED` es exactamente el mismo tipo de conflicto). `BusinessRuleViolationException` se queda para las reglas sobre los *datos entrantes* — el rango de horas, la comprobación de fecha futura, la comprobación de proyecto inactivo.

```java
@ExceptionHandler(InvalidStateTransitionException.class)
public ResponseEntity<ErrorResponse> handleInvalidStateTransition(InvalidStateTransitionException e) {
    return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(buildError(HttpStatus.CONFLICT, e.getMessage()));
}
```

> **Este es un segundo motivo, sin relación con el primero, por el que dos peticiones distintas pueden devolver ambas `409`** — el primero era `DataIntegrityViolationException`, arriba (un valor único duplicado). Las dos son genuinamente `409`, pero por mecanismos diferentes: una es la base de datos rechazando guardar un valor que ya existe, la otra es tu propio service rechazando una transición de estado que el flujo de trabajo no permite. El código de estado es el mismo; la causa y la clase de excepción no lo son.

---

## DTO de respuesta de error

Antes de que este DTO existiera, cada handler inventaba su propia forma de cuerpo, y esas formas se alejaban entre sí casi al instante.

> **Este párrafo es historia, no el código actual.** En un commit anterior del proyecto 07 no existía ningún `ErrorResponse`: `handleBadCredentials` devolvía un `Map` serializado como `{"error": "..."}` (un valor String), mientras que `handleValidation` devolvía `{"errors": {...}}` (un valor mapa) — dos claves distintas, `error` frente a `errors`, para el mismo concepto. El código de Angular que leía el fallo tenía que saber *de antemano* qué clave esperar según qué excepción había saltado, así que cualquier cambio en el backend rompía el frontend en silencio. Ambos handlers se reescribieron para devolver `ErrorResponse`; si abres hoy `GlobalExceptionHandler` no encontrarás esas formas en ningún sitio. Sigue leyendo — el resto de esta sección es el código que de verdad está en el repo.

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

- **`timestamp: Instant`** — el momento exacto en que ocurrió el error, en UTC. Se explica en detalle (y por qué `Instant` y no `LocalDateTime`) en [12-fechas.md](../../../java/junior/es/12-fechas.md#instant--un-punto-exacto-en-el-tiempo-sin-ambigüedad-de-zona-horaria) — resumen rápido: un timestamp técnico necesita ser el mismo instante para cualquiera que lo lea, independientemente de la zona horaria del servidor.
- **`status: int`**, no `HttpStatus` — porque este objeto se serializa a JSON, y JSON no tiene el concepto de enum de Spring. Se rellena con `status.value()`, el método que convierte el enum `HttpStatus` a su número (`404`, `400`...).
- **`error: String`** — el nombre corto del código HTTP (`"Not Found"`, `"Bad Request"`), obtenido con `status.getReasonPhrase()`. Es información derivable de `status`, pero tenerla explícita en el JSON evita que quien lo lea tenga que memorizar qué significa cada número.
- **`message: String`** — el único campo que cambia de verdad excepción a excepción; el texto que normalmente muestra el frontend en un toast.
- **`fieldErrors: Map<String, String>`** — solo tiene contenido cuando el error viene de validar campos de un formulario (ver la sección de Bean Validation, abajo). En el resto de casos vale `null`.

> **`@JsonInclude(JsonInclude.Include.NON_NULL)`** entra en juego en el momento de la serialización — cuando Spring Boot convierte el objeto Java a texto JSON para la respuesta HTTP, justo antes de mandarlo al cliente. Sin esta anotación, un `fieldErrors` en `null` aparecería igualmente como `"fieldErrors": null` en el JSON de salida. Con ella, Jackson omite esa clave por completo en cuanto detecta un valor `null` — así un 404 devuelve un JSON limpio sin la clave `fieldErrors`, y solo un error de validación la incluye rellena.

Para no repetir la construcción de `timestamp`, `status`, `error` y `message` en cada uno de los métodos `@ExceptionHandler` (11 handlers en este proyecto), un método privado dentro del propio `GlobalExceptionHandler` centraliza esa parte común:

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

`fieldErrors` no forma parte de los parámetros de `buildError` a propósito: es el único campo que no aplica a la mayoría de los handlers, así que convertirlo en parámetro obligaría a los otros 10 handlers a pasar `null` explícitamente sin usarlo nunca. En el único handler que sí lo necesita (`handleValidation`, ver abajo), se llama a `buildError` para la parte común y luego se le hace un `.setFieldErrors(...)` extra al objeto ya construido.

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

Propósito: convertir un `@Valid` fallido en un `@RequestBody` en un `400` cuyo cuerpo diga **qué campo** falló y **por qué**, para que el formulario de Angular pueda pintar el mensaje debajo del input correspondiente en vez de mostrar un único toast poco concreto.

Archivo: `src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java` (el método `handleValidation`)

Docs: https://www.baeldung.com/spring-boot-bean-validation → leer: la sección sobre gestionar `MethodArgumentNotValidException`

> **Esta es la versión canónica de este handler.** Las *anotaciones* de validación (`@NotBlank`, `@Email`, `@Min`…) y dónde colocarlas se cubren en [07-validacion.md](./07-validacion.md); el *handler* que convierte su fallo en una respuesta HTTP vive aquí, y el código de abajo es el que está en el `GlobalExceptionHandler` real. Si encuentras un `handleValidation` distinto, más simple, en otro punto de estas notas, este es el que coincide con el proyecto.

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

> **¿Por qué no simplemente unir todos los mensajes en un único String** (como haría `Collectors.joining(", ")`)? Porque entonces el frontend recibiría algo como `"email: must not be blank, password: must not be blank"` y tendría que **parsear ese texto** para saber a qué campo del formulario pertenece cada error. Con un `Map<String, String>`, el frontend accede directamente por clave (`fieldErrors["email"]`) y lo coloca debajo del input correcto, sin ningún parsing.

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
| 409 Conflict | Email duplicado, violación de constraint única, o una transición de estado que el status actual del recurso prohíbe (p. ej. reabrir una entry que no está `REJECTED`) |
| 500 Internal Server Error | Excepción no gestionada — el fallback catch-all |

Lee la tabla como una búsqueda que funciona en una sola dirección: nunca partes del código de estado, partes de la **columna "Cuándo"** — la situación que tu service acaba de encontrar — y ella te dice qué código debe devolver el handler. La línea que más importa es la frontera entre `401` y `403`: `401` significa *no sé quién eres* (sin token, o con uno inválido), `403` significa *sé exactamente quién eres y aun así no puedes hacer esto* (token válido, rol insuficiente). Confundir estos dos es el error más común de toda la tabla, y los entrevistadores preguntan por la diferencia directamente.

El patrón que se repite: **lanza en el service, mapea a HTTP en `@ControllerAdvice`**. El service solo conoce conceptos de dominio (recurso no encontrado, entrada duplicada), no códigos de estado HTTP. `@ControllerAdvice` hace la traducción.

---

## Cómo averiguar el nombre exacto de la clase de una excepción no gestionada

Cada `@ExceptionHandler` nuevo que añades empieza igual: algo falla con el código de estado equivocado, y necesitas saber exactamente qué clase de excepción lanzó Spring antes de poder escribir `@ExceptionHandler(AlgunaExcepcion.class)` para ella. Nunca hace falta adivinarlo — Spring te lo dice, en uno de dos sitios según si algo ya atrapó la excepción o no.

**Caso A — nada la atrapa, así que la gestiona `DefaultHandlerExceptionResolver`.** Cuando una excepción no es una `RuntimeException` que tu `GlobalExceptionHandler` reconozca, el resolutor propio de Spring entra en acción y registra el nombre completo de la clase con nivel `WARN` en la consola:

```
WARN ... DefaultHandlerExceptionResolver : Resolved [org.springframework.web.bind.MissingServletRequestParameterException: Required request parameter 'month' for method parameter type YearMonth is not present]
```

El nombre de la clase está ahí mismo, paquete incluido (`org.springframework.web.bind.MissingServletRequestParameterException`) — reproduce la request que falla, lee la consola, copia el nombre en un `@ExceptionHandler` nuevo.

**Caso B — tu propio catch-all ya se la traga en silencio.** Un `@ExceptionHandler(RuntimeException.class)` genérico gestiona cualquier subtipo de `RuntimeException`, incluidos los que todavía no tienen un handler específico escrito — y en cuanto tu propio código la gestiona, `DefaultHandlerExceptionResolver` de Spring nunca llega a ejecutarse, así que ese `WARN` nunca aparece. En esa situación, imprime tú mismo el nombre de la clase temporalmente, dentro del catch-all, justo antes de que devuelva:

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

> **Contraste con `MethodArgumentTypeMismatchException`** — un fallo relacionado pero distinto: el parámetro **sí** se envió, pero Spring no pudo convertir su valor al tipo esperado (por ejemplo, `?month=2025-13`, un `YearMonth` inválido). Esta **sí es** una `RuntimeException`, así que *sí* llega al catch-all genérico — pero en silencio, con el código equivocado (`500` en vez de `400`), que es justo por lo que "llega a algún handler" no es lo mismo que "llega al handler *correcto*". Por eso el proyecto 07 también le da su propio handler, el undécimo de la tabla:

```java
@ExceptionHandler(MethodArgumentTypeMismatchException.class)
public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException e) {
    return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(buildError(HttpStatus.BAD_REQUEST,
                    "Invalid value for parameter '" + e.getParameter().getParameterName() + "'"));
}
```

`e.getParameter()` devuelve un `MethodParameter` — la descripción que hace Spring del argumento del método del controller que estaba intentando rellenar — y `.getParameterName()` sobre él te da el nombre de ese argumento (`"month"`). Es un salto más largo que el `MissingServletRequestParameterException.getParameterName()` de arriba porque esta excepción la lanza el paso de *conversión de tipo*, que razona sobre parámetros de método, no sobre nombres de query string.

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

---

## Dónde te deja esto — y qué viene después

Ahora la API falla con honestidad. Una excepción lanzada tres capas por debajo, dentro de un service, ya no se escapa como un 500 con un stack trace: `@RestControllerAdvice` la intercepta, Spring elige el `@ExceptionHandler` más específico subiendo por la jerarquía de clases de la excepción, `buildError` le da la única forma de cuerpo que usa toda la API, y `@JsonInclude(NON_NULL)` oculta los campos que no aplican. Cada controller del proyecto ha vuelto a ser solo el happy path.

Pero las dos últimas secciones ya han dado alguna pista. `BadCredentialsException` → `401`. `AccessDeniedException` → `403`. `JwtFilter`, `SecurityConfig`, `.anyRequest().authenticated()`, un `AuthenticationEntryPoint` que salta cuando no hay token presente — la trampa de `/error` solo existe *porque* hay una cadena de filtros de seguridad delante de cada request, decidiendo quién entra antes de que tu controller llegue siquiera a ejecutarse. Esos handlers ya están en `GlobalExceptionHandler` y todavía no has construido lo que los lanza.

[06-seguridad-jwt.md](./06-seguridad-jwt.md) lo construye: cómo una request que lleva un JWT se autentica mediante un filtro antes de llegar al controller, qué hace Spring Security de verdad con el token, y por qué las excepciones que lanza (`BadCredentialsException`, `AccessDeniedException`) llegan exactamente a la misma clase advice que acabas de escribir.
