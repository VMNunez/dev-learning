# Bean Validation

> 📖 [Baeldung — Validation with Spring Boot](https://www.baeldung.com/spring-boot-bean-validation)
> 📖 [Spring Boot — Validation](https://docs.spring.io/spring-boot/reference/io/validation.html)

## Retomando el hilo — las anotaciones que 06 usó y nunca explicó

[06-seguridad-jwt.md](./06-seguridad-jwt.md) construyó la máquina que decide **quién** está llamando: un filtro JWT mete al usuario en el `SecurityContextHolder`, `.anyRequest().authenticated()` protege la ruta, `@PreAuthorize("hasRole('MANAGER')")` protege el método. Pero vuelve a mirar la primera clase que tocaba ese archivo — `LoginRequest`:

```java
// src/main/java/com/victor/timetrack/dto/request/LoginRequest.java — el archivo real
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

y el controller que lo recibe:

```java
@PostMapping("/login")
public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
}
```

`@NotBlank` y `@Valid` se usaron ahí sin una palabra de explicación. Ese es el hueco que cierra este archivo, y el hueco es más grande que dos anotaciones. La autenticación responde a *"¿es esto realmente Victor?"* — no dice nada sobre si el **cuerpo** que envió tiene algún sentido. Un manager con un token perfectamente válido puede hacer `POST` de un proyecto cuyo `name` sea `""`, o un time entry con `hours: null` y sin `projectId`. Todas las comprobaciones de seguridad pasan. La basura llega directa a PostgreSQL.

> **La analogía del aeropuerto — y es todo el archivo en una imagen.** La seguridad (archivo 06) es el control de pasaportes: comprueba *quién eres* y si tienes permiso para pasar la barrera. La validación es el agente de puerta comprobando tu **tarjeta de embarque** antes de subir al avión: vuelo correcto, fecha correcta, un asiento que existe. Ambas comprobaciones ocurren en el **límite** del aeropuerto — nadie te vuelve a comprobar el billete una vez estás sentado, y nadie lo comprueba en la cabina. Esa es exactamente la regla con la que termina este archivo: valida en el límite (el DTO), y todo lo que está dentro del límite — service, repository, entity — tiene permiso para confiar en los datos.

## La dependencia requerida

Propósito: las anotaciones de Bean Validation (`@NotBlank`, `@Email`, `@Positive`) compilan y se ejecutan sin errores incluso cuando falta la dependencia — pero en tiempo de ejecución son completamente ignoradas. Hay que añadir `spring-boot-starter-validation` de forma explícita.

Docs: https://www.baeldung.com/spring-boot-bean-validation → leer: "Adding the Maven Dependencies" — muestra exactamente este bloque y explica que el starter es lo que trae Hibernate Validator

Archivo: `pom.xml`

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

No hace falta versión — la gestiona `spring-boot-starter-parent`. Esto es una trampa de fallo silencioso: las anotaciones compilan, el código funciona, pero el input inválido nunca se rechaza. Añade siempre la dependencia antes de añadir anotaciones de validación.

> **¿Por qué falla en silencio en vez de lanzar un error?** `@NotBlank`, `@Positive` y el resto son solo anotaciones — metadatos pegados a un campo, nada más. Por sí solas no ejecutan ninguna comprobación; algo tiene que leerlas y actuar. Ese algo es Hibernate Validator (la implementación de referencia de Jakarta Bean Validation), y `spring-boot-starter-validation` es lo que lo mete en el classpath y permite que Spring autoconfigure el bean `Validator` que escanea y aplica esas anotaciones. Sin el starter, las anotaciones compilan igual — el compilador solo comprueba que la anotación existe como tipo — pero no se registra ningún validador que las lea, así que `@Valid` no encuentra nada que ejecutar y el request pasa sin comprobarse.

---

## El problema sin validación

Docs: https://www.baeldung.com/spring-boot-bean-validation → leer: las secciones de apertura, hasta "Validating a REST Controller" inclusive

Sin validación, los clientes pueden enviar cualquier cosa: un nombre de proyecto en blanco, un `projectId` nulo, `hours` sin enviar. Tienes exactamente dos alternativas, y ambas son malas. O escribes comprobaciones `if` manuales al principio de cada método de servicio:

```java
// MAL — validación hecha a mano, repetida en cada método de servicio
public ProjectResponse create(CreateProjectRequest request) {
    if (request.getName() == null || request.getName().isBlank()) {
        throw new BusinessRuleViolationException("Name is required");
    }
    // ... y las mismas tres líneas otra vez en update(), y en cada otro service
    Project project = new Project();
    ...
}
```

— lo que significa la misma comprobación duplicada en `create()` y `update()`, una forma de error inconsistente según el método, y una regla que vive *dentro* de tu lógica de negocio en vez de en la puerta. O te saltas las comprobaciones y dejas que un nombre en blanco llegue a PostgreSQL, donde o se acepta (un proyecto literalmente llamado `""`) o se rechaza por una constraint `NOT NULL` que aparece como una `DataIntegrityViolationException` → 409, un estado que no le dice nada útil al cliente.

Bean Validation reemplaza ambas cosas. Una anotación en el campo + `@Valid` en el parámetro del controller, y el request se rechaza con un `400` **antes de que el cuerpo de tu método llegue siquiera a ejecutarse** — el service ni siquiera se llega a invocar:

```java
// BIEN — la regla se declara una vez, en el campo al que pertenece
@Data
public class CreateProjectRequest {
    @NotBlank
    private String name;

    private String description;   // sin anotación → opcional, a propósito
}
```

> **Por qué "antes de que el cuerpo del método se ejecute" es la mitad importante de esa frase.** `@Valid` no es algo que tu código del controller llame. Spring MVC resuelve los argumentos de un método de controller *antes* de invocarlo — deserializa el JSON en un `CreateProjectRequest`, y si el parámetro lleva `@Valid`, le pasa el objeto a Hibernate Validator en ese momento. Si falla alguna constraint, Spring nunca llega a llamar a tu método: lanza una excepción en su lugar, y la captura `GlobalExceptionHandler`. Tu service, por tanto, tiene una garantía firme — cuando se ejecuta, el DTO ya cumple todas las anotaciones que tiene.

---

## Las anotaciones más usadas

Docs: https://www.baeldung.com/javax-validation → leer: la sección que lista las anotaciones de constraint estándar (`@NotNull`, `@Size`, `@Min`/`@Max`, etc.)

Los DTOs reales del proyecto 07 solo usan tres de estas (`@NotBlank`, `@NotNull`, y nada más — `CreateTimeEntryRequest` es la más rica, con `@NotNull` en `projectId`, `date` y `hours` más `@NotBlank` en `description`). El DTO de abajo es **propuesto, no código del proyecto** — es un ejemplo más completo que recorre el resto de la tabla para que veas cada anotación en su sitio:

```java
// ejemplo propuesto — no es un archivo del proyecto 07
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
| `@DecimalMin(value)` | `BigDecimal`, Número | por debajo del mínimo — el `@Min` seguro para decimales |
| `@DecimalMax(value)` | `BigDecimal`, Número | por encima del máximo — el `@Max` seguro para decimales |
| `@Email` | String | formato de email no válido |
| `@Pattern(regexp)` | String | no coincide con la regex |

Lee la tabla empezando por la **columna del medio**: es el tipo Java del campo lo que decide qué anotaciones son siquiera legales sobre él, no tu preferencia. Poner `@NotBlank` en un `BigDecimal` no falla en silencio — la app se niega a arrancar con `HV000030: No validator could be found for constraint 'jakarta.validation.constraints.NotBlank' validating type 'java.math.BigDecimal'`. La columna de la derecha es la que hay que memorizar, porque es donde están las trampas: `@NotEmpty` acepta `"   "` (los espacios pasan — la cadena no está vacía), y `@Positive` **rechaza el cero**, mientras que `@PositiveOrZero` lo permite — una diferencia de una palabra en el nombre y una regla completamente distinta.

### Dónde una regla deja de ser validación y pasa a ser lógica de negocio

`CreateTimeEntryRequest.hours` es el campo que hace concreta esta distinción, y merece la pena ser exacto sobre lo que hace realmente el proyecto 07, porque no es lo que adivinarías. `hours` lleva **solo `@NotNull`** — nada de `@Positive`, nada de `@Min`. Así que `{"hours": -5}` pasa Bean Validation por completo: el valor no es nulo, y nulo es lo único que la anotación prohíbe.

El request se rechaza igualmente — solo que no lo hace el validador. `TimeEntryService.create()` comprueba el rango él mismo:

```java
// src/main/java/com/victor/timetrack/service/TimeEntryService.java — la comprobación real
BigDecimal min = new BigDecimal("0.5");
BigDecimal max = new BigDecimal("24");

if (request.getHours().compareTo(min) < 0 || request.getHours().compareTo(max) > 0) {
    throw new BusinessRuleViolationException("Hours must be between 0.5 and 24");
}
```

`compareTo` devuelve un `int` negativo si el valor de la izquierda es más pequeño, cero si son iguales, positivo si es mayor — así que `hours.compareTo(min) < 0` se lee como "hours está por debajo de 0.5". (`BigDecimal` se compara con `compareTo`, nunca con `==` ni `equals`, porque `equals` también compara la *escala*: `2.0` y `2.00` son `equals`-distintos pero `compareTo`-iguales.) `BusinessRuleViolationException` es la excepción propia del proyecto 07, mapeada a un `400` por `GlobalExceptionHandler` — ver [05-manejo-excepciones.md](./05-manejo-excepciones.md#excepciones-personalizadas), que es donde se construyeron las excepciones personalizadas y sus handlers.

> **Así que `-5` horas se rechaza — pero lo rechaza el service, no `@Valid`, y los dos rechazos no tienen la misma forma.** Ambos vuelven como un `400`, pero un fallo de validación lleva un mapa `fieldErrors` que nombra el campo (`{"hours": "must not be null"}`), mientras que el fallo de regla de negocio lleva solo un `"message": "Hours must be between 0.5 and 24"` plano, sin ninguna clave `fieldErrors` (`@JsonInclude(NON_NULL)` la elimina). El frontend no puede pintar el segundo debajo del input `hours` sin hacer un `match` de string a mano.
>
> **Y por eso la lectura honesta del proyecto 07 es: esta regla está en el sitio equivocado.** "Entre 0.5 y 24" es una regla de *forma* sobre un único campo — no depende de nada más que del propio valor, así que pertenece al DTO (`@DecimalMin("0.5") @DecimalMax("24")` — `@Min`/`@Max` toman un `long` y por tanto no pueden expresar `0.5` en absoluto, mientras que `@DecimalMin` toma su límite como un **String** precisamente para que el número nunca pase por un `double` binario que no puede representar valores tipo `0.5` con exactitud), donde se aplicaría en la puerta y se reportaría como un `fieldError` igual que cualquier otra regla de campo. Una regla se gana su sitio en el service solo cuando necesita algo que el DTO no puede ver: las otras comprobaciones de `TimeEntryService` — "el proyecto debe estar activo", "la fecha no puede ser futura", "solo puedes editar tus propias entradas en DRAFT" — todas necesitan la base de datos o el usuario logueado, y ninguna anotación sobre un campo puede saber nada de eso. Esa es la línea: **si la regla se puede decidir mirando solo el campo, es validación; si necesita otras filas, otros campos, o quién está llamando, es lógica de negocio.** El rango de `hours` está ahora mismo en el lado equivocado de esa línea, y duplicado en `create()` y en `update()` — exactamente el `if` copiado y pegado contra el que arrancaba argumentando este archivo.

**`@NotBlank` vs `@NotNull` para Strings — usa siempre `@NotBlank`.**
`@NotNull` permite `""` (cadena vacía). `@NotBlank` también rechaza cadenas vacías y las que son solo espacios. En la práctica casi nunca quieres permitir una cadena vacía, así que `@NotBlank` es el valor por defecto correcto para cualquier campo String.

---

## Activar la validación — @Valid en @RequestBody

Docs: https://www.baeldung.com/spring-boot-bean-validation → leer: la sección sobre validar el cuerpo del request con `@Valid`

Las anotaciones del DTO son inertes por sí solas — son metadatos sentados en campos. `@Valid` en el parámetro del controller es el interruptor que le dice a Spring "ejecuta el validador sobre este objeto antes de llamarme". Este es el `create` real de `ProjectController`:

```java
// src/main/java/com/victor/timetrack/controller/ProjectController.java
@PreAuthorize("hasRole('MANAGER')")
@PostMapping
public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest request) {
    return ResponseEntity.status(201).body(projectService.create(request));
}
```

Olvidar `@Valid` es el bug de validación más común, y es invisible: el código compila, las anotaciones siguen en el DTO, el endpoint funciona — simplemente nunca rechaza nada.

```java
// MAL — @NotBlank en el DTO nunca se comprueba. Un name en blanco se acepta, 201 Created.
@PostMapping
public ResponseEntity<ProjectResponse> create(@RequestBody CreateProjectRequest request) { ... }

// BIEN — @Valid es lo que realmente dispara Hibernate Validator
@PostMapping
public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest request) { ... }
```

> **Dos formas independientes de llegar al mismo fallo silencioso.** No tener `spring-boot-starter-validation` (no existe ningún validador) y no tener `@Valid` (existe un validador pero nadie le pide que se ejecute) producen síntomas *idénticos*: el input inválido pasa de largo con un `201`. Cuando la validación "no funciona", comprueba ambas cosas, en ese orden — la dependencia primero, porque rompe todos los endpoints a la vez, mientras que un `@Valid` olvidado solo rompe el método al que le falta.

Si falla alguna constraint, Spring lanza `MethodArgumentNotValidException` antes de que el método se ejecute, y `GlobalExceptionHandler` lo convierte en un `400` cuyo cuerpo nombra cada campo que falla. `POST /api/projects` con `{"name": ""}` devuelve exactamente esto:

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

`"must not be blank"` es el mensaje **por defecto** de Hibernate Validator para `@NotBlank` — lo obtienes gratis porque `CreateProjectRequest` escribe `@NotBlank` sin argumentos. La sección "Mensajes de error personalizados" de más abajo es cómo lo reemplazas. El handler que produce este cuerpo vive en [05-manejo-excepciones.md](05-manejo-excepciones.md) — resumen en una línea: lee los campos que fallan del `BindingResult` de la excepción hacia un `Map<String, String>` campo → mensaje, y cuelga ese mapa en el `ErrorResponse` como `fieldErrors`.

---

## Validar donde entran los datos — DTOs, no entidades

Docs: https://www.baeldung.com/java-entity-vs-dto → leer: el artículo completo — es corto, y el argumento de "por qué son objetos separados" es exactamente el que hace esta sección

La validación va en los DTOs de request, no en las entidades JPA. La entidad vive en la capa de base de datos y puede tener un estado que es válido en la base de datos pero no debería aceptarse de clientes externos. El DTO es el contrato público de la API — ahí es donde defines lo que los clientes tienen permitido enviar.

> El patrón que se repite: los DTOs son el límite. Valida en el límite. Todo lo que está dentro del límite (service, repository, entity) confía en que los datos ya son válidos. Este es el agente de puerta de la analogía de apertura — la tarjeta de embarque se comprueba una vez, en la puerta, y nunca más.

```
    client JSON
        │
        ▼
┌───────────────────────────────┐
│  CreateProjectRequest  (DTO)  │ ← @NotBlank vive AQUÍ   ← el límite
└───────────────────────────────┘
        │  (@Valid ha pasado — los datos ya son de confianza)
        ▼
   ProjectService   → sin null checks, sin isBlank()
        │
        ▼
   ProjectRepository
        │
        ▼
   Project (@Entity)  ← SIN anotaciones de validación
```

> **¿Por qué no poner `@NotBlank` directamente en el `@Entity` y listo?** Dos razones, y la segunda es la que muerde. Primero, la entidad no es el contrato de la API: campos como `id`, `createdAt` o `status` los pones *tú*, no el cliente, así que una regla expresada ahí está respondiendo a la pregunta equivocada. Segundo, las constraints de entidad se disparan en el **flush** — cuando Hibernate empuja la fila a la base de datos, que está muy dentro de una transacción, mucho después de que tu service ya haya hecho trabajo. El fallo llega como una `ConstraintViolationException` desde la capa de persistencia, no como un `400` limpio con `fieldErrors`, y es mucho más difícil de mapear de vuelta al campo que escribió el usuario. Validar en el DTO hace fallar el request en la puerta, antes de que se ejecute una sola línea de lógica de negocio.

---

## Validar path variables y query params

Docs: TODO — add link (Baeldung, "Validating RequestParams and PathVariables in Spring" — leer el artículo completo, es corto y cubre exactamente este caso)

Para parámetros individuales (no un objeto `@RequestBody`), usa `@Validated` en la clase del controller. El proyecto 07 **no** hace esto hoy — `ProjectController.getById(@PathVariable Long id)` recibe el id sin validar — así que el controller de abajo es **código propuesto**, mostrado sobre la forma real del proyecto 07 para que veas dónde iría:

```java
// propuesto — el ProjectController real del proyecto 07 no tiene @Validated hoy
@RestController
@RequestMapping("/api/projects")
@Validated   // activa las anotaciones de constraint en parámetros individuales
public class ProjectController {

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(
        @PathVariable @Positive(message = "Id must be positive") Long id
    ) {
        return ResponseEntity.ok(projectService.getById(id));
    }
}
```

`@Positive` en `@PathVariable` rechaza automáticamente IDs negativos o cero, así que `GET /api/projects/-1` se rechaza antes de que se ejecute el service y antes de que Hibernate desperdicie un `SELECT` buscando una fila que no puede existir. Spring lanza aquí `ConstraintViolationException`, **no** `MethodArgumentNotValidException` — un tipo de excepción distinto, que necesita un handler distinto, que es de lo que trata la sección de cierre de este archivo.

> **¿Por qué `@Validated` tiene que ir en la *clase* y no en el parámetro?** Porque los dos mecanismos funcionan en niveles completamente distintos. `@Valid` en un `@RequestBody` lo gestiona el argument resolver de Spring MVC: Spring ya está construyendo ese objeto, así que puede pasárselo al validador en el acto. Un `@PathVariable Long id` no tiene ningún objeto que entregar — la constraint está en la *firma del método*, y comprobarla significa interceptar la llamada al propio método. `@Validated` en la clase es lo que le dice a Spring que envuelva ese bean en un proxy (`MethodValidationPostProcessor`) que valida los argumentos en cada llamada antes de delegar al método real. La anotación va en la clase porque el proxy envuelve la clase entera, no un parámetro suelto de ella.

> **`@Valid` vs `@Validated` — no son intercambiables.** `@Valid` es la anotación estándar de Java/Jakarta Bean Validation — funciona en objetos `@RequestBody` y se propaga en cascada a objetos anidados, pero Spring MVC no la procesa en parámetros individuales como `@PathVariable` o `@RequestParam`. `@Validated` es la anotación propia de Spring; ponla en la *clase* para activar la comprobación de constraints en parámetros individuales, y además soporta grupos de validación (ejecutar reglas distintas según el contexto), algo que `@Valid` no puede hacer. Regla práctica: `@Valid` en un DTO de `@RequestBody`, `@Validated` en la clase del controller cuando validas parámetros sueltos.

---

## Mensajes de error personalizados

Docs: https://www.baeldung.com/spring-custom-validation-message-source → leer: las primeras secciones, sobre sobrescribir el mensaje de constraint por defecto (la parte de `messages.properties` / i18n al final va más allá de lo que necesita el proyecto 07)

Cada anotación acepta un parámetro `message`. Sin él obtienes el valor por defecto de Hibernate Validator — `"must not be blank"`, `"must not be null"`, `"must be greater than 0"` — que es exactamente lo que devuelven ahora mismo los DTOs del proyecto 07, ya que todos escriben `@NotBlank` / `@NotNull` a secas. Esas cadenas son el vocabulario del *validador*, no el del usuario: `fieldErrors: { "projectId": "must not be null" }` no ayuda nada en un toast. Escribe mensajes que tengan sentido para el cliente — el frontend Angular los imprime debajo del input:

```java
// propuesto — así se verían los campos de LoginRequest con mensajes;
// el LoginRequest real del proyecto 07 escribe un @NotBlank a secas en ambos
@NotBlank(message = "Email is required")
@Email(message = "Please enter a valid email address")
private String email;

@Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
private String password;
```

Los mensajes por defecto (como "must not be blank") son técnicos. Los mensajes personalizados son amigables. Usa mensajes personalizados en los DTOs de cara al público.

> **El mensaje no es una cadena plana — es una plantilla.** Hibernate Validator lo *interpola* antes de devolverlo, lo que significa que puedes meter los propios atributos de la constraint en el texto con placeholders `{}`: `@Size(min = 8, max = 100, message = "Password must be between {min} and {max} characters")` se renderiza como `"Password must be between 8 and 100 characters"`, y el texto se mantiene correcto el día que cambies `min` a `10`. Por eso también un `{` o un `$` literal en un mensaje necesita escaparse (`\{`) — si no, el interpolador intentaría resolverlo como una expresión.

> **Elijas la cadena que elijas, el camino de entrega es el mismo.** El mensaje personalizado reemplaza el valor de `FieldError::getDefaultMessage`, y nada más cambia: `handleValidation` sigue recogiéndolo en el mapa `fieldErrors`, así que `{"email": "Email is required"}` llega exactamente en la misma forma de cuerpo que llegaba `{"email": "must not be blank"}`. Estás cambiando el *contenido* del error, nunca su *estructura* — que es lo que permite que el formulario Angular siga leyendo `fieldErrors[controlName]` sin saber nada de qué anotación lo disparó.

---

## Dos fallos de validación, dos excepciones — y el segundo todavía no tiene handler

Propósito: `@Valid` y `@Validated` no fallan de la misma forma. Cada uno lanza un tipo de excepción distinto, así que cada uno necesita su propio `@ExceptionHandler` — y el proyecto 07 ahora mismo solo tiene uno de los dos.

Docs: TODO — add link (Baeldung, "Validating RequestParams and PathVariables in Spring" → su sección final "Exception Handling", el handler de `ConstraintViolationException`)

Archivo: `src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java`

| Dónde se disparó la validación | Disparado por | Excepción lanzada | ¿Handler en el proyecto 07? |
|---|---|---|---|
| Un DTO de `@RequestBody` | `@Valid` en el parámetro | `MethodArgumentNotValidException` | sí — `handleValidation` |
| Un `@PathVariable` / `@RequestParam` suelto | `@Validated` en la clase | `ConstraintViolationException` | **no** |

Lee la tabla de izquierda a derecha como una cadena causal: la columna de la **izquierda** es lo que anotaste, y determina por completo la columna de la **derecha** — tú no eliges el tipo de excepción, la *ubicación* de la constraint lo elige por ti. La última columna es la que hay que atacar: la primera fila ya está resuelta, la segunda es un agujero.

**La fila uno ya está construida, en el archivo 05.** El handler de `MethodArgumentNotValidException` no se repite aquí — [05-manejo-excepciones.md → "Gestionar errores de Bean Validation"](./05-manejo-excepciones.md#gestionar-errores-de-bean-validation) es su hogar canónico, y esa es la versión que hay en el `GlobalExceptionHandler` real. Recordatorio de una frase para no romper el hilo: recoge los field errors del `BindingResult` de la excepción en un `Map<String, String>` con `Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage, …)`, construye el `ErrorResponse` estándar con `buildError(...)`, le adjunta el mapa con `setFieldErrors(...)`, y devuelve un `400`. Ese es el handler que produjo el cuerpo `"fieldErrors": {"name": "must not be blank"}` que viste antes.

**La fila dos es la pieza nueva — y no existe en el repo.** El proyecto 07 no usa `@Validated` en ningún sitio ni `@Positive` en ningún `@PathVariable`, así que nunca se lanza ninguna `ConstraintViolationException`, y `GlobalExceptionHandler` no tiene handler para ella. El handler de abajo es por tanto **código propuesto**, no código del proyecto — en el momento en que añadas `@Validated` a un controller (como en la sección de arriba), debes añadir esto junto a él:

```java
// propuesto — añadir a GlobalExceptionHandler si introduces @Validated
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

Está deliberadamente calcado a `handleValidation`: el mismo `buildError(...)` + `setFieldErrors(...)`, el mismo `400`, el mismo cuerpo — para que el frontend siga leyendo una y solo una forma de error sin importar dónde viviera la constraint. La única diferencia es de dónde salen el nombre del campo y el mensaje, porque `ConstraintViolationException` lleva un payload distinto:

- **`e.getConstraintViolations()`** — un `Set<ConstraintViolation<?>>`, uno por cada constraint que falla. Aquí no hay `BindingResult`: `BindingResult` es un objeto de Spring MVC que solo existe cuando Spring ha vinculado un cuerpo JSON a un objeto, y una path variable nunca se vincula a nada.
- **`v.getPropertyPath()`** — la ruta a lo que falló, y **no** es un nombre de campo plano. Para un parámetro de método se lee `getById.id`, es decir `metodo.parametro`, así que hace falta `.toString()` (devuelve un `Path`, no un `String`), y la clave que ve tu frontend es `"getById.id"` en vez de `"id"`. Esa fuga del nombre del método Java al JSON es la razón por la que muchos equipos lo recortan al último segmento antes de devolverlo.
- **`v.getMessage()`** — el mensaje interpolado (`"Id must be positive"`), la contraparte directa de `FieldError::getDefaultMessage`.

> **¿Por qué no saltarse el handler y dejar que se encargue el catch-all?** Porque `ConstraintViolationException` **es** una `RuntimeException`, así que *sí* llega a `@ExceptionHandler(RuntimeException.class)` — y se mapea a un `500 Internal Server Error` con `"message": "Internal server error"`. El cliente envió un input malo y se le dice que el servidor está roto. Esta es exactamente la trampa que nombró el archivo 05: "llega a algún handler" no es lo mismo que "llega al handler *correcto*". Esto no se descubre leyendo logs llenos de errores; se descubre porque el código de estado miente.

> **Nombre confundible — hay dos clases `ConstraintViolationException`.** La de aquí es `jakarta.validation.ConstraintViolationException` (Bean Validation, lanzada por Hibernate Validator, un 400). También existe `org.hibernate.exception.ConstraintViolationException` (una constraint de *base de datos* rechazó la fila — una clave única duplicada), que en el proyecto 07 nunca ves directamente porque Spring la envuelve en `DataIntegrityViolationException` → 409, gestionada en el archivo 05. Mismo nombre simple, paquete distinto, código HTTP distinto: comprueba el import antes de escribir el handler.

---

## Dónde te deja esto — y qué viene después

El límite ya está sellado. Un request que llega a `ProjectService.create()` no puede llevar un name en blanco, y uno que llega a `TimeEntryService.create()` no puede llevar un `projectId` nulo ni `hours` nulo — no porque el service lo compruebe, sino porque `@Valid` rechazó el request en la puerta y `GlobalExceptionHandler` ya le respondió al cliente con un `400` nombrando el campo. La seguridad dice *quién*; la validación dice *qué*; el service por fin queda libre de contener solo lógica de negocio — con la única excepción honesta señalada arriba, la comprobación del rango de `hours` que el proyecto 07 todavía mantiene en `TimeEntryService` y que pertenece al DTO.

Y ahí es precisamente donde aparece el siguiente problema. `TimeEntryService` no hace una sola cosa por request — lee una entrada, comprueba su estado, la cambia, la guarda, y toca más de una fila por el camino. Los datos son válidos a la entrada, pero ¿qué pasa si el tercer paso lanza una excepción después de que los dos primeros ya hayan escrito? Una operación aplicada a medias es un dato inválido que ningún `@NotBlank` del mundo puede evitar, porque lo produjo tu propio código.

[08-transacciones.md](./08-transacciones.md) cierra ese hueco: `@Transactional`, por qué "todo o nada" es una garantía de base de datos y no de Java, y qué excepciones realmente disparan un rollback (la respuesta sorprende a la mayoría la primera vez).
