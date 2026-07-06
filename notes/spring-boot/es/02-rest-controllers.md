# REST Controllers

> 📖 [Baeldung — Building a REST API with Spring Boot](https://www.baeldung.com/building-a-restful-web-service-with-spring-and-java-based-configuration)
> 📖 [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)

## La arquitectura de tres capas — el patrón más importante

Todo API Spring Boot sigue tres capas. Es lo primero que te preguntará un entrevistador.

```
HTTP request
     ↓
Controller      — recibe el request, valida la entrada, devuelve una respuesta
     ↓
Service         — toda la lógica de negocio vive aquí
     ↓
Repository      — habla con la base de datos
     ↓
Database
```

- **La regla:** cada capa solo llama a la que tiene directamente debajo. Controller → Service → Repository.
- Cambios de lógica de negocio → solo tocas el service. Cambios de base de datos → solo tocas el repository.
- Un controlador que importa un repositorio es una señal de alarma en cualquier code review.

```java
// Controller — solo conoce el service
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
```

Algunas cosas que leer de este ejemplo:

- **Sí — cada capa tiene una referencia a la que tiene debajo.** El controlador declara `private final TransactionService service`. `private` porque ninguna otra clase lo necesita; `final` porque una vez que Spring lo establece en el constructor nunca cambia. Verás esta exacta línea `private final` en cada controlador, service y clase que use un repositorio.
- **El constructor es `public` y debe tener exactamente el mismo nombre que la clase** (`TransactionController`). Esa es la regla Java para cualquier constructor. Spring lo llama al arrancar y pasa el bean `TransactionService` automáticamente (inyección por constructor — ver [03-dependency-injection.md](./03-dependency-injection.md)).
- **`this.service = service`** — el parámetro y el campo comparten el nombre `service`. `this.service` significa "el campo de este objeto"; el `service` a secas es el parámetro. La línea copia el parámetro inyectado en el campo para que el resto de la clase pueda usarlo.
- **`TransactionResponse` es un DTO** (Data Transfer Object) — la forma que el API devuelve en lugar de la entidad raw. Los DTOs se explican completamente en la sección "DTOs" más abajo y en [layer-reference.md](../layer-reference.md).

---

## @RestController y @RequestMapping

Docs: https://www.baeldung.com/spring-controller-vs-restcontroller → leer: la sección de `@RestController`

`@RestController` le dice a Spring "esta clase gestiona peticiones HTTP, y cada valor que devuelva debe enviarse directamente al cliente como JSON". Es una abreviatura de `@Controller` + `@ResponseBody`: `@Controller` registra la clase como componente web, y `@ResponseBody` es lo que serializa el valor de retorno a JSON (via Jackson) en lugar de tratarlo como el nombre de una página HTML.

> **`@Controller` vs `@RestController`:** `@Controller` es para vistas HTML renderizadas en el servidor (devuelve el nombre de una plantilla a renderizar). Para un REST API consumido por Angular, usa siempre `@RestController` para obtener JSON.

`@RequestMapping("/api/transactions")` en la clase establece la **ruta URL base** compartida por todos los métodos dentro. Cada anotación a nivel de método (`@GetMapping`, `@PostMapping`…) solo añade la parte que difiere. Así que `@GetMapping("/{id}")` dentro de esta clase responde a `GET /api/transactions/{id}`.

```java
@RestController
@RequestMapping("/api/transactions")   // ruta base para todos los métodos de esta clase
public class TransactionController { ... }
```

---

## Métodos HTTP — qué significa cada uno

Docs: https://developer.mozilla.org/es/docs/Web/HTTP/Methods → leer: el resumen de cada verbo

| Anotación | Método HTTP | Propósito | ¿Tiene body? |
|---|---|---|---|
| `@GetMapping` | GET | Leer datos | No |
| `@PostMapping` | POST | Crear un nuevo recurso | Sí |
| `@PutMapping` | PUT | Reemplazar un recurso completo | Sí |
| `@PatchMapping` | PATCH | Actualizar parte de un recurso | Sí |
| `@DeleteMapping` | DELETE | Eliminar un recurso | No |

```java
@GetMapping              // GET    /api/transactions
@GetMapping("/{id}")     // GET    /api/transactions/42
@PostMapping             // POST   /api/transactions
@PutMapping("/{id}")     // PUT    /api/transactions/42
@DeleteMapping("/{id}")  // DELETE /api/transactions/42
```

El string dentro de la anotación se añade a la ruta base `@RequestMapping` de la clase. `"/{id}"` **no** es una palabra literal — la parte `{id}` es un *placeholder de ruta*: un slot que coincide con cualquier valor (`/42`, `/7`, …) y lo captura. Cómo lees ese valor capturado dentro del método es la siguiente sección (`@PathVariable`).

---

## ResponseEntity — controlar la respuesta HTTP

Docs: https://www.baeldung.com/spring-response-entity

`ResponseEntity<T>` **no** es un DTO. Es un wrapper que devuelve un método del controlador para controlar dos cosas a la vez: el **código de estado HTTP** y el **body de la respuesta**. El `<T>` es el tipo del body que lleva (a menudo un DTO, p.ej. `ResponseEntity<TransactionResponse>`). Lo usas porque un REST API debe comunicar *qué pasó* (¿creado? ¿no encontrado? ¿eliminado?), no solo devolver datos — y el código de estado es como lo dice.

Sin `ResponseEntity`, cada método devolvería un `200 OK` simple, incluso un `POST` que debería decir `201 Created` o un `DELETE` que debería decir `204 No Content`.

Cada línea abajo construye una respuesta diferente — misma idea, diferente estado + body:

```java
// 200 OK, body = el objeto transaction (serializado a JSON)
return ResponseEntity.ok(transaction);

// 201 Created, body = el recurso que se acaba de crear
return ResponseEntity.status(201).body(created);

// 204 No Content — éxito, body vacío (común para DELETE)
return ResponseEntity.noContent().build();

// 404 Not Found — body vacío
return ResponseEntity.notFound().build();

// 400 Bad Request, body = un mensaje de error
return ResponseEntity.badRequest().body("Invalid input");
```

La relación con `@RestController`: el método del controlador devuelve el `ResponseEntity`, y Spring lee el estado y serializa el body a JSON con Jackson antes de enviarlo al cliente.

**Dos atajos que usarás constantemente:**

- `ResponseEntity.ok(value)` es exactamente `ResponseEntity.status(200).body(value)` — GET y PUT lo usan, y *sí* incluye un body (el objeto o array JSON). Estas dos líneas son idénticas:
  ```java
  return ResponseEntity.ok(projectService.getAll());
  return ResponseEntity.status(200).body(projectService.getAll());
  ```
- `ResponseEntity.noContent().build()` es el estado 204 con body vacío — DELETE lo usa. Cada `ResponseEntity` termina en `.body(value)` (terminar con un body) o `.build()` (terminar sin body). `noContent()` es solo un atajo con nombre para el estado 204, igual que `ok()` lo es para 200.

**Códigos de estado clave que debes conocer:**

| Código | Significado | Cuándo usarlo |
|---|---|---|
| 200 OK | Éxito | GET, PUT con éxito |
| 201 Created | Recurso creado | POST con éxito |
| 204 No Content | Éxito, nada que devolver | DELETE con éxito |
| 400 Bad Request | El cliente envió datos inválidos | Fallo de validación |
| 401 Unauthorized | No autenticado | Token ausente o inválido |
| 403 Forbidden | Autenticado pero sin permiso | Rol incorrecto |
| 404 Not Found | El recurso no existe | `findById` devolvió vacío |
| 409 Conflict | Recurso duplicado | Email ya existe |
| 500 Internal Server Error | Error de servidor no gestionado | Bug |

---

## Leyendo la entrada — @PathVariable, @RequestParam, @RequestBody

### @PathVariable — leer un valor de la ruta URL

Docs: https://www.baeldung.com/spring-pathvariable

A veces la URL en sí lleva un valor — *qué* recurso quieres. `GET /api/projects/42` significa "el proyecto con id 42". El `42` no es una palabra fija; cambia por request. `@PathVariable` es como el controlador lee ese valor de la ruta y lo mete en un parámetro del método. Tres cosas que entender bien:

**1. Los `{}` marcan un placeholder, no una palabra literal.** En el mapping, `"/{id}"` le dice a Spring "este segmento es una variable". Compáralo con un segmento estático en la misma ruta base `@RequestMapping("/api/projects")`:

```java
@GetMapping("/active")   // ESTÁTICO  → solo coincide con la URL literal /api/projects/active
@GetMapping("/{id}")     // DINÁMICO  → coincide con /api/projects/1, /api/projects/42, ...
```

`/active` es una palabra fija — coincide exactamente con ese texto y nada más. `/{id}` coincide con cualquier valor y lo captura.

**2. `@PathVariable` lee el valor capturado y lo pasa al método como argumento.** Spring toma lo que coincidió con `{id}` en la URL y lo inyecta en el parámetro, así que lo usas como una variable normal:

```java
// el cliente llama GET /api/projects/42  →  Spring pone 42 en `id`
@GetMapping("/{id}")
public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) {
    return ResponseEntity.ok(projectService.getById(id)); // úsalo como cualquier argumento
}
```

**3. El nombre en `{}` debe coincidir con el nombre del parámetro** — así es como Spring sabe qué placeholder rellena qué parámetro. Si quieres que el parámetro tenga un nombre diferente, indica el nombre de la ruta explícitamente dentro de `@PathVariable("...")`:

```java
// los nombres coinciden → no se necesita argumento
@GetMapping("/{id}")
public ProjectResponse getById(@PathVariable Long id) { ... }

// renombrar: el placeholder en la URL sigue siendo {id}, pero el parámetro se llama projectId
@GetMapping("/{id}")
public ProjectResponse getById(@PathVariable("id") Long projectId) { ... }
```

En el segundo caso, `@PathVariable("id")` dice "toma el `{id}` de la ruta y ponlo en `projectId`". Sin el `("id")` explícito, Spring buscaría un placeholder llamado `projectId`, no lo encontraría y fallaría al arrancar. **Por eso `@PathVariable` tiene que existir:** un método puede tener varios parámetros, y la anotación es el enlace explícito que le dice a Spring "este viene de la ruta URL".

---

### @RequestParam — leer un valor del query string

Docs: https://www.baeldung.com/spring-request-param

Los query parameters son los pares `clave=valor` opcionales después del `?` en una URL: `GET /api/entries?month=2025-05&status=SUBMITTED`. Son la herramienta correcta para **filtros opcionales, ordenación y paginación** — no para la identidad del recurso (eso es `@PathVariable`). `@RequestParam` lee uno de ellos en un parámetro del método, igual que `@PathVariable` lee de la ruta:

```java
// GET /api/entries?month=2025-05&page=0
@GetMapping
public ResponseEntity<List<EntryResponse>> getFiltered(
    @RequestParam(required = false) String month,
    @RequestParam(defaultValue = "0") int page
) { ... }
```

- `required = false` — el parámetro es opcional; si el cliente lo omite el valor es `null` y el request sigue funcionando
- `defaultValue = "0"` — si se omite, Spring usa `"0"` en lugar de `null` (establecer un valor por defecto también lo hace opcional)

> **`@PathVariable` vs `@RequestParam`:** path variable = *qué* recurso (`/projects/42`), obligatorio, parte de la dirección. Query param = *cómo* filtrar el resultado (`?status=active`), normalmente opcional, un extra sobre la dirección.

---

### @RequestBody — leer el body JSON enviado por el cliente

Docs: https://www.baeldung.com/spring-request-response-body → leer: la sección de `@RequestBody`

Para `POST` y `PUT`, el cliente envía datos en el **body** del request como JSON. `@RequestBody` le dice a Spring "toma ese JSON, conviértelo en este objeto Java (Jackson hace la conversión) y dámelo como parámetro":

```java
// POST /api/projects  con body { "name": "...", "description": "..." }
@PostMapping
public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest request) {
    return ResponseEntity.status(201).body(projectService.create(request));
}
```

`@RequestBody` es solo sobre *recibir* — es la imagen especular de la respuesta. No confundas las dos direcciones:

| | Dirección | Dónde aparece |
|---|---|---|
| `@RequestBody` | cliente → servidor | un parámetro del método — lo que recibes |
| `ResponseEntity.body(value)` | servidor → cliente | el return statement — lo que envías |

`@Valid` junto a `@RequestBody` dispara Bean Validation en el objeto entrante — si los campos `@NotBlank` / `@NotNull` del DTO fallan, Spring devuelve 400 automáticamente antes de que se ejecute el cuerpo de tu método (ver [07-validation.md](./07-validation.md)).

**Cuándo usar cada uno — la regla simple:**

| Anotación | Los datos vienen de | Uso típico |
|---|---|---|
| `@PathVariable` | Ruta URL — `/{id}` | GET, PUT, DELETE — identifica qué recurso |
| `@RequestBody` | Body del request — el JSON que envías | POST, PUT — envía datos para crear o actualizar |
| `@RequestParam` | Query string — `?month=2025-05` | GET — filtros opcionales |

```
GET    /api/projects        → sin anotación (sin entrada)
GET    /api/projects/42     → @PathVariable
POST   /api/projects        → @RequestBody
PUT    /api/projects/42     → @PathVariable + @RequestBody
DELETE /api/projects/42     → @PathVariable
```

**El patrón:** usa `@PathVariable` para el identificador del recurso (es obligatorio — sin ID, sin recurso). Usa `@RequestParam` para filtros opcionales. Usa `@RequestBody` cuando el cliente envía JSON en el body.

`@Valid` dispara Bean Validation en el `@RequestBody` — si el DTO tiene campos `@NotNull` o `@NotBlank` y la entrada falla, Spring devuelve 400 automáticamente.

---

### void vs Void

`delete` devuelve `ResponseEntity<Void>` porque `<>` necesita una *clase* y no hay valor que devolver. La explicación completa de la palabra clave `void` vs la clase `Void` está en las notas de Java — ver [java/03-methods.md](../java/03-methods.md#void-vs-void).

---

## @JsonIgnore — evitar que campos aparezcan en el JSON

Propósito: `@JsonIgnore` le dice a Jackson que omita ese campo al serializar a JSON. Se usa en campos de entidad que nunca deben viajar por el API — sobre todo el campo `password` en `User`.

Docs: https://www.baeldung.com/jackson-annotations → leer: "@JsonIgnore"

Archivo: `src/main/java/com/victor/timetrack/model/User.java`

```java
@Entity
@Table(name = "users")
public class User {

    @JsonIgnore
    private String password;  // nunca aparece en ninguna respuesta JSON de ningún endpoint
}
```

Esta es una medida de defensa en profundidad. El enfoque correcto son los DTOs (descritos abajo), que te dan control total sobre lo que sale. Pero si algún código devuelve accidentalmente una entidad `User` directamente, `@JsonIgnore` garantiza que el hash no se exponga. Los entrevistadores preguntan: "¿Por qué tu endpoint `/api/users` no devuelve la contraseña?" — DTOs o `@JsonIgnore` es la respuesta esperada. Usar DTOs es mejor; `@JsonIgnore` es el respaldo.

---

## DTOs — nunca expongas entidades JPA directamente

Docs: https://www.baeldung.com/java-dto-pattern

Un **DTO** (Data Transfer Object) es una clase simple cuyo único trabajo es definir la *forma* de los datos que cruzan la frontera del API — lo que el cliente envía, y lo que tú devuelves. No es una tabla de base de datos y no contiene lógica de negocio: solo campos. Los DTOs son cómo das una forma limpia a tus respuestas en lugar de devolver la entidad raw.

**¿Por qué no devolver la entidad JPA directamente?** La entidad está ligada al esquema de base de datos y puede contener campos que el cliente nunca debe ver — un hash de contraseña, claves foráneas internas, colecciones cargadas perezosamente. Devolverla filtra esos campos y acopla tu API pública a tus tablas: cambia una columna y accidentalmente cambias el API. Un DTO te permite controlar exactamente qué campos salen y cuáles entran.

> **¿Cuándo creas el DTO?** Antes del service y el controlador que lo usan — nombran su tipo en sus firmas de método, así que tiene que existir primero. El orden para una feature es: entity → repository → **DTO** → service → controller (el mismo flujo que [layer-reference.md](../layer-reference.md)).

Mantienes dos DTOs por recurso — uno por dirección:

**`dto/request/CreateProjectRequest.java`** — lo que el cliente envía. Lo validas, porque nunca puedes confiar en los datos entrantes:

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectRequest {
    @NotBlank
    private String name;

    private String description;
}
```

**`dto/response/ProjectResponse.java`** — lo que el API devuelve. Lo construyes tú mismo en el service, así que no necesita validación:

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private Boolean active;
    private LocalDateTime createdAt;
}
```

El **service** convierte entre la entidad y estos DTOs; el **controlador** solo trata con DTOs, nunca con la entidad. Estos son los DTOs reales basados en clases de la feature `projects` de TimeTrack — `@Data` con Lombok, el estilo usado en todo el proyecto (no `record`s de Java).

---

## Proyecto 07 — TimeTrack (primer endpoint funcional)

Esta es la primera cadena Controller → Service → Repository construida en el proyecto TimeTrack. El Paso 1 devuelve la entidad directamente — los DTOs se introducen en el Paso 2.

### UserRepository

El repositorio va primero porque el service depende de él. Es solo una interfaz que extiende `JpaRepository<User, Long>` — eso solo ya te da `findAll()`, `findById()`, `save()` y `deleteById()` sin ninguna implementación que escribir:

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
```

### UserService

```java
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }
}
```

- `@Service` — Spring encuentra esta clase, crea una instancia (un bean) y la mantiene disponible para inyección
- `private final UserRepository userRepository` — declara la dependencia; `final` porque nunca cambia después de que se ejecuta el constructor
- Inyección por constructor — Spring detecta el constructor único e inyecta `UserRepository` automáticamente
- `userRepository.findAll()` — método built-in de `JpaRepository`; sin SQL necesario

### UserController

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAll() {
        return userService.getAll();
    }
}
```

- `@RestController` — marca esta clase como controlador REST; cada valor de retorno se serializa a JSON automáticamente
- `@RequestMapping("/api/users")` — URL base para todos los métodos de esta clase
- `@GetMapping` — responde a `GET /api/users`; sin ruta porque la URL base ya está establecida en la clase
- El controlador inyecta el service igual que el service inyecta el repositorio — mismo patrón de inyección por constructor

### Proyecto 07 — ProjectService — CRUD completo con DTOs y toResponse()

El Paso 2 introduce DTOs y CRUD completo. El patrón clave: un helper privado `toResponse()`, colocado al **final de la clase**, evita repetir el mapeo entity-to-DTO en cada método.

> Esta es la versión *trabajada y explicada* del vertical slice. [layer-reference.md](../layer-reference.md) tiene el mismo flujo como un conjunto de tablas de referencia rápida (usando un ejemplo de `Transaction`) — ábrelo cuando solo necesites recordar la estructura; lee esto cuando quieras el razonamiento detrás de cada línea.

**¿Por qué `.map(this::toResponse)`?** `this::toResponse` es una *referencia a método* — abreviatura del lambda `project -> this.toResponse(project)` (ver [java/09-streams-lambdas.md](../java/09-streams-lambdas.md)). `stream().map(...)` lo llama una vez por entidad, convirtiendo cada `Project` en un `ProjectResponse`, y `toList()` recoge los resultados. La forma `this::` funciona porque el helper es un método en esta misma clase.

```java
@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectResponse> getAll() {
        return projectRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public ProjectResponse getById(Long id) {
        return projectRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    public ProjectResponse create(CreateProjectRequest request) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        Project saved = projectRepository.save(project);
        return toResponse(saved);
    }

    public ProjectResponse update(Long id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        Project saved = projectRepository.save(project);
        return toResponse(saved);
    }

    public void delete(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        project.setActive(false);   // soft delete — conserva los datos, marca como inactivo
        projectRepository.save(project);
    }

    private ProjectResponse toResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        response.setActive(project.getActive());
        response.setCreatedAt(project.getCreatedAt());
        return response;
    }
}
```

**Decisiones clave:**

- `toResponse()` es `private` y está al **final de la clase** — convierte una entidad `Project` en un DTO `ProjectResponse`; ninguna otra clase lo necesita, así que va después de los métodos públicos que lo llaman
- `create()` empieza con `new Project()` — la entidad aún no existe
- `update()` empieza con `findById()` — la entidad debe existir para modificarse; `orElseThrow()` gestiona el caso "not found" y detiene el método inmediatamente
- `save()` gestiona tanto insert como update — JPA decide según si `id` es null
- `delete()` devuelve `void` — nada que devolver después de un soft delete
- Soft delete: `active = false` en lugar de eliminar la fila — conserva los datos históricos intactos

### Proyecto 07 — ProjectController — CRUD completo con ResponseEntity

```java
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAll() {
        return ResponseEntity.ok(projectService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> create(@RequestBody CreateProjectRequest request) {
        return ResponseEntity.status(201).body(projectService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(@PathVariable Long id, @RequestBody UpdateProjectRequest request) {
        return ResponseEntity.ok(projectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

**Decisiones clave:**

- `getAll` y `getById` usan `ResponseEntity.ok()` — atajo para estado 200 + body
- `create` usa `status(201).body()` — POST debe devolver 201, no 200
- `update` usa `ResponseEntity.ok()` — actualizar un recurso existente devuelve 200
- `delete` devuelve `ResponseEntity<Void>` — sin body; `Void` (mayúscula) porque `<>` solo acepta clases, no la palabra clave `void`
- `delete` llama al service primero, luego construye la respuesta — dos líneas separadas porque el service devuelve `void`
- `@RequestMapping("/api/projects")` en la clase establece la ruta base; cada método solo añade lo que es diferente (`/{id}`, nada, etc.)

---

### Qué pasa cuando el navegador llama a GET /api/users

```
Browser → GET /api/users
  → UserController.getAll()
    → UserService.getAll()
      → UserRepository.findAll()
        → Hibernate genera: SELECT id, email, name FROM users
          → PostgreSQL devuelve las filas
        → devuelto como List<User>
      → devuelto al controlador
    → Jackson serializa List<User> a JSON
  → el navegador recibe []  (array vacío — aún no hay usuarios)
```

Hibernate registra el SQL en la consola porque `spring.jpa.show-sql=true` está establecido en `application.properties`.

---

## Un ejemplo completo de controlador — referencia genérica

Después de construirlo paso a paso con TimeTrack arriba, aquí hay un controlador CRUD limpio y completo para guardar como plantilla. Es un ejemplo genérico de `Transaction` — la misma forma que el `ProjectController` real, con todos los verbos en un sitio.

```java
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
        // el service lanza ResourceNotFoundException si no se encuentra
        // @ControllerAdvice lo mapea a 404 — ver 05-exception-handling.md
    }

    @PostMapping
    public ResponseEntity<TransactionDTO> create(@Valid @RequestBody TransactionCreateDTO dto) {
        TransactionDTO created = service.create(dto);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> update(
        @PathVariable Long id,
        @Valid @RequestBody TransactionCreateDTO dto
    ) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```
