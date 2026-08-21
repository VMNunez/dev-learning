# REST Controllers

> 📖 [Baeldung — Building a REST API with Spring Boot](https://www.baeldung.com/building-a-restful-web-service-with-spring-and-java-based-configuration)
> 📖 [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)

---

[01-basicos.md](./01-basicos.md) te dejó con una app que arranca y no tiene nada que decir: Tomcat está escuchando en el 8080, la base de datos está conectada, `data.sql` ya sembró el primer manager — y `@ComponentScan` recorre tus paquetes y encuentra **cero controladores que registrar**. Cada URL que escribes devuelve un 404 porque ninguna clase ha reclamado esa ruta todavía. Este archivo cierra ese hueco. A partir de aquí, todo lo que escribes es la aplicación en sí misma: las clases que son dueñas de una URL, leen lo que envió el cliente, y deciden qué vuelve.

---

## La arquitectura de tres capas — el patrón más importante

Docs: https://www.baeldung.com/spring-component-repository-service → leer: las secciones sobre `@Controller`, `@Service` y `@Repository` — qué significa cada estereotipo y por qué están separados

Toda API de Spring Boot sigue tres capas. Es lo primero que te preguntará un entrevistador.

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

> **El restaurante.** El controlador es el **camarero**: toma el pedido, comprueba que tiene sentido ("eso no lo servimos") y saca el plato — nunca cocina. El service es la **cocina**: ahí ocurren todas las decisiones de verdad (qué lleva el plato, en qué orden, qué hacer si falta un ingrediente). El repository es la **despensa**: solo sabe traer y guardar ingredientes, y no tiene opinión sobre la receta. Un camarero que entra en la despensa y coge carne cruda se ha saltado la cocina — eso es exactamente lo que parece un controlador llamando directamente a un repository, y por qué los revisores lo detectan a la primera. El valor de esta separación es que puedes cambiar la despensa (Postgres → MongoDB) sin que la cocina se entere, y reescribir la receta sin tener que reentrenar al camarero.

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

Algunas cosas que merece la pena notar en este ejemplo:

- **Sí — cada capa tiene una referencia a la que tiene debajo.** El controlador declara `private final TransactionService service`. `private` porque ninguna otra clase lo necesita; `final` porque una vez que Spring lo establece en el constructor nunca cambia. Verás exactamente esta línea `private final` en cada controlador, service y clase que use un repositorio.
- **El constructor es `public` y debe tener exactamente el mismo nombre que la clase** (`TransactionController`). Esa es la regla Java para cualquier constructor. Spring lo llama al arrancar y pasa el bean `TransactionService` automáticamente (inyección por constructor — ver [18-inyeccion-dependencias.md](./18-inyeccion-dependencias.md)).
- **`this.service = service`** — el parámetro y el campo comparten el nombre `service`. `this.service` significa "el campo de este objeto"; el `service` a secas es el parámetro. La línea copia el parámetro inyectado en el campo para que el resto de la clase pueda usarlo.
- **`TransactionResponse` es un DTO** (Data Transfer Object) — la forma que el API devuelve en lugar de la entidad raw. Los DTOs se explican completamente en la sección "DTOs" más abajo y en [layer-reference.md](../.../../../layer-reference.md).

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

Docs: https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Methods → leer: el resumen de cada verbo

| Anotación        | Método HTTP | Propósito                       | ¿Tiene body? |
| ---------------- | ----------- | -------------------------------- | ------------ |
| `@GetMapping`    | GET         | Leer datos                       | No           |
| `@PostMapping`   | POST        | Crear un nuevo recurso           | Sí           |
| `@PutMapping`    | PUT         | Reemplazar un recurso completo   | Sí           |
| `@PatchMapping`  | PATCH       | Actualizar parte de un recurso   | Sí           |
| `@DeleteMapping` | DELETE      | Eliminar un recurso              | No           |

Lee esta tabla de izquierda a derecha como *una anotación = un verbo HTTP*: la anotación que pones sobre el método es lo único que decide qué verbo llega a él — `@GetMapping` y `@PostMapping` sobre la *misma* URL son dos endpoints distintos y nunca chocan entre sí. La columna que realmente cambia cómo escribes el método es la última: **"¿Tiene body? = Sí" es exactamente el conjunto de métodos que necesitan un parámetro `@RequestBody`** (POST, PUT, PATCH), y "No" es el conjunto donde la única entrada puede venir de la URL (`@PathVariable`, `@RequestParam`) — un GET con body JSON no es algo que escribas, porque el cliente no tiene un sitio natural donde ponerlo.

```java
@GetMapping              // GET    /api/transactions
@GetMapping("/{id}")     // GET    /api/transactions/42
@PostMapping             // POST   /api/transactions
@PutMapping("/{id}")     // PUT    /api/transactions/42
@DeleteMapping("/{id}")  // DELETE /api/transactions/42
```

El string dentro de la anotación se añade a la ruta base `@RequestMapping` de la clase. `"/{id}"` **no** es una palabra literal — la parte `{id}` es un *placeholder de ruta*: un slot que coincide con cualquier valor (`/42`, `/7`, …) y lo captura. Cómo lees ese valor capturado dentro del método es la siguiente sección (`@PathVariable`).

---

## Por qué los endpoints PATCH llevan sufijo en la URL y PUT/POST/DELETE no

`PUT /api/entries/{id}`, `POST /api/entries` y `DELETE /api/entries/{id}` nunca necesitan nada añadido a la ruta — el verbo HTTP ya dice toda la acción: reemplazar el recurso, crearlo, eliminarlo. Para un recurso dado solo hay una cosa que un PUT puede significar, así que la URL nunca necesita desambiguar más.

`PATCH` es distinto. "Actualizar parcialmente" es vago por sí solo — un recurso puede tener muchas actualizaciones parciales distintas, sobre todo uno que sigue una máquina de estados (ver `notes/architecture` para el patrón de workflow). Un `TimeEntry` puede pasar de `DRAFT → SUBMITTED`, `SUBMITTED → APPROVED`, o `SUBMITTED → REJECTED` — tres transiciones distintas, todas técnicamente "PATCH". Sin sufijo, un `PATCH /api/entries/{id}` a secas no le dice al servidor qué transición quiere el cliente. El sufijo nombra la sub-acción concreta:

```java
@PatchMapping("/{id}/submit")   // PATCH /api/entries/42/submit
@PatchMapping("/{id}/approve")  // PATCH /api/entries/42/approve
@PatchMapping("/{id}/reject")   // PATCH /api/entries/42/reject
```

> **Regla práctica:** si un verbo solo puede significar una cosa para ese recurso (PUT, POST, DELETE), la ruta se queda desnuda — `/{id}`. Si el mismo verbo (PATCH) puede significar varias transiciones distintas sobre el mismo recurso, el sufijo nombra cuál — `/{id}/submit`, `/{id}/approve`.

---

## ResponseEntity — controlar la respuesta HTTP

Docs: https://www.baeldung.com/spring-response-entity

`ResponseEntity<T>` **no** es un DTO. Es un wrapper que devuelve un método del controlador para controlar dos cosas a la vez: el **código de estado HTTP** y el **body de la respuesta**. El `<T>` es el tipo del body que lleva (a menudo un DTO, p.ej. `ResponseEntity<TransactionResponse>`). Lo usas porque un REST API debe comunicar *qué pasó* (¿creado? ¿no encontrado? ¿eliminado?), no solo devolver datos — y el código de estado es precisamente cómo lo comunica.

Sin `ResponseEntity`, cada método devolvería un `200 OK` simple, incluso un `POST` que debería decir `201 Created` o un `DELETE` que debería decir `204 No Content`.

> **¿Por qué no devolver el objeto directamente?** Porque un método que devuelve `ProjectResponse` no le da a Spring nada con qué trabajar salvo el body — así que Spring recurre a su valor por defecto, `200 OK`, en *cada* respuesta. Compila, Postman muestra el JSON, y el endpoint parece estar bien. Aun así está mal: un cliente (o un interceptor de Angular, o un dashboard de monitorización) que lee el código de estado se está enterando de que "no se creó nada" después de una creación exitosa.

```java
// ❌ MAL — compila, funciona, y siempre responde 200 OK aunque haya creado un recurso
@PostMapping
public ProjectResponse create(@Valid @RequestBody CreateProjectRequest request) {
    return projectService.create(request);
}

// ✅ BIEN — el código de estado es parte de la respuesta: 201 Created + el recurso nuevo como body
@PostMapping
public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest request) {
    return ResponseEntity.status(201).body(projectService.create(request));
}
```

La versión incorrecta no es un error de compilación y nunca lo será — precisamente eso es lo que hace fácil que se cuele en producción. `ResponseEntity` es lo que convierte el código de estado de un valor por defecto de Spring en una decisión que tú tomas.

> **El paquete postal.** Piensa en `ResponseEntity` como enviar un paquete. El **contenido de la caja** es el body (el JSON), y la **etiqueta pegada por fuera** es el código de estado. Devolver el objeto directamente es entregar una caja sin etiquetar: el contenido puede ser perfecto, pero el mensajero escribe la misma etiqueta genérica en todo. `ResponseEntity.status(201).body(created)` es escribir tú mismo la etiqueta, y luego meter el contenido — que es exactamente el orden que fuerza el builder, como muestra el siguiente bloque.

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

**Cómo se construye, paso a paso — `ResponseEntity.status(201).body(created)`**

Esta línea se lee de dentro hacia fuera:

1. Primero se ejecuta lo que está más adentro: `created` ya es el objeto que devolvió el service (por ejemplo, el `ProjectResponse` recién guardado en base de datos).
2. `ResponseEntity.status(201)` es un método **estático** que empieza a construir la respuesta, fijando el código de estado a `201`. Devuelve un objeto a medio construir (un *builder*), no el `ResponseEntity` final todavía.
3. `.body(created)` se encadena sobre ese builder y le añade el dato que quieres enviar como body. Aquí es donde termina de construirse: el resultado ya es el `ResponseEntity<ProjectResponse>` completo — estado 201 + ese body.
4. El método devuelve ese objeto con `return`. Spring lo recibe, serializa el body a JSON con Jackson, y arma la respuesta HTTP real que llega a Postman: cabecera de estado `201`, y el JSON en el body.

**El `<T>` y la seguridad de tipos**

`ResponseEntity<T>` es una clase **genérica** — el mismo mecanismo que ya conoces de `List<String>` u `Optional<T>`. El `<T>` fija, en tiempo de compilación, qué tipo concreto de objeto puede ir dentro del body. Por eso la firma del método y lo que pones en `.body(...)` tienen que coincidir: si el método declara `ResponseEntity<ProjectResponse>`, el compilador rechaza que le pases un `String` o cualquier otro tipo en `.body(...)` — es el mismo tipo de error que `List<String> list = new ArrayList<Integer>()` daría.

**Dos atajos que usarás constantemente:**

- `ResponseEntity.ok(value)` es exactamente `ResponseEntity.status(200).body(value)` — GET y PUT lo usan, y *sí* incluye un body (el objeto o array JSON). Estas dos líneas son idénticas:
  ```java
  return ResponseEntity.ok(projectService.getAll());
  return ResponseEntity.status(200).body(projectService.getAll());
  ```
- `ResponseEntity.noContent().build()` es el estado 204 con body vacío — DELETE lo usa. Cada `ResponseEntity` termina en `.body(value)` (terminar con un body) o `.build()` (terminar sin body). `noContent()` es solo un atajo con nombre para el estado 204, igual que `ok()` lo es para 200.

**Códigos de estado clave que debes conocer:**

| Código                    | Significado                     | Cuándo usarlo              |
| ------------------------- | -------------------------------- | -------------------------- |
| 200 OK                    | Éxito                            | GET, PUT con éxito         |
| 201 Created               | Recurso creado                   | POST con éxito             |
| 204 No Content            | Éxito, nada que devolver         | DELETE con éxito           |
| 400 Bad Request           | El cliente envió datos inválidos | Fallo de validación        |
| 401 Unauthorized          | No autenticado                   | Token ausente o inválido   |
| 403 Forbidden             | Autenticado pero sin permiso     | Rol incorrecto             |
| 404 Not Found             | El recurso no existe             | `findById` devolvió vacío  |
| 409 Conflict              | Recurso duplicado                | Email ya existe            |
| 500 Internal Server Error | Error de servidor no gestionado  | Bug                        |

Lee la tabla por su **primer dígito**, no fila por fila — eso es lo que tienes que recordar bajo presión en una entrevista. `2xx` = funcionó. `4xx` = la culpa es *del cliente* (envió datos incorrectos, sin token, el rol equivocado, un id que no existe) — el servidor está sano y quien llama tiene que cambiar algo antes de reintentar. `5xx` = la culpa es *del servidor*; el cliente no hizo nada mal y reintentar la misma petición puede funcionar perfectamente. La columna "Cuándo usarlo" es donde se juntan las capas de este archivo: las tres filas `4xx` que escribes a mano casi nunca aparecen en el controlador — el 400 viene de `@Valid` (ver [07-validacion.md](./07-validacion.md)), y el 404/409 se lanzan como excepciones en el *service* y se traducen a un código de estado mediante un `@ControllerAdvice` (ver [05-manejo-excepciones.md](./05-manejo-excepciones.md)). El controlador en sí normalmente solo elige entre 200, 201 y 204.

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

**El mecanismo, paso a paso**

Lo que viaja por la red no es un objeto Java — es texto plano con formato JSON. Tu método necesita un objeto de verdad (`request.getName()`, etc.), así que algo tiene que traducir ese texto a un objeto antes de que tu código se ejecute:

1. Postman (o Angular) envía el `POST` con el JSON `{"name": "Project Beta", "description": "..."}` en el body de la petición.
2. Spring recibe la petición y, por `@PostMapping`, ya sabe que debe ejecutar este método `create(...)`.
3. Antes de ejecutarlo, Spring inspecciona los parámetros del método y ve `@RequestBody CreateProjectRequest request`.
4. Esa anotación le dice: "el texto del body hay que convertirlo a un objeto `CreateProjectRequest`, y pasárselo a este parámetro".
5. Jackson lee el JSON clave por clave: ve `"name"`, busca un campo llamado `name` en `CreateProjectRequest`, y le asigna `"Project Beta"`. Lo mismo con `"description"`.
6. El resultado es un objeto `CreateProjectRequest` real, ya en memoria, con sus campos rellenados.
7. Ese objeto ya construido es lo que recibe tu método al empezar a ejecutarse — nunca escribes tú el código que parsea el JSON.

> Sin `@RequestBody`, Spring no sabría que ese parámetro debe rellenarse desde el body — por defecto busca los parámetros en la URL (como hace `@RequestParam`), así que el objeto llegaría `null` o vacío.

`@RequestBody` es solo sobre *recibir* — es la imagen especular de la respuesta. No confundas las dos direcciones:

|                               | Dirección        | Dónde aparece                              |
| ----------------------------- | ---------------- | ------------------------------------------- |
| `@RequestBody`               | cliente → servidor | un parámetro del método — lo que recibes  |
| `ResponseEntity.body(value)` | servidor → cliente | el return statement — lo que envías       |

`@Valid` junto a `@RequestBody` dispara Bean Validation en el objeto entrante — si los campos `@NotBlank` / `@NotNull` del DTO fallan, Spring devuelve 400 automáticamente antes de que se ejecute el cuerpo de tu método (ver [07-validacion.md](./07-validacion.md)).

**Cuándo usar cada uno — la regla simple:**

| Anotación       | Los datos vienen de                | Uso típico                                    |
| ---------------- | ----------------------------------- | ----------------------------------------------- |
| `@PathVariable` | Ruta URL — `/{id}`                 | GET, PUT, DELETE — identifica qué recurso      |
| `@RequestBody`  | Body del request — el JSON que envías | POST, PUT — envía datos para crear o actualizar |
| `@RequestParam` | Query string — `?month=2025-05`    | GET — filtros opcionales                       |

```
GET    /api/projects        → sin anotación (sin entrada)
GET    /api/projects/42     → @PathVariable
POST   /api/projects        → @RequestBody
PUT    /api/projects/42     → @PathVariable + @RequestBody
DELETE /api/projects/42     → @PathVariable
```

**El patrón:** usa `@PathVariable` para el identificador del recurso (es obligatorio — sin ID, sin recurso). Usa `@RequestParam` para filtros opcionales. Usa `@RequestBody` cuando el cliente envía JSON en el body.

---

### void vs Void

`delete` devuelve `ResponseEntity<Void>` porque `<>` necesita una *clase* y no hay valor que devolver. La explicación completa de la palabra clave `void` vs la clase `Void` está en las notas de Java — ver [java/04-metodos.md](../../../java/junior/es/04-metodos.md#void-vs-void).

---

## DTOs — nunca expongas entidades JPA directamente

Propósito: una clase simple que define la *forma* de los datos que cruzan la frontera del API — una para lo que el cliente envía, otra para lo que tú devuelves — así el controlador nunca toca la entidad JPA.

Archivo: `src/main/java/com/victor/timetrack/dto/request/CreateProjectRequest.java` y `src/main/java/com/victor/timetrack/dto/response/ProjectResponse.java`

Docs: https://www.baeldung.com/java-dto-pattern → leer: la sección "The DTO Pattern" y el ejemplo de mapeo

Un **DTO** (Data Transfer Object) no es una tabla de base de datos y no contiene lógica de negocio: solo campos. Es cómo das una forma limpia a tus respuestas en lugar de devolver la entidad raw.

**¿Por qué no devolver la entidad JPA directamente?** La entidad está ligada al esquema de base de datos y puede contener campos que el cliente nunca debe ver — un hash de contraseña, claves foráneas internas, colecciones cargadas perezosamente. Devolverla filtra esos campos *y* acopla tu API pública a tus tablas: renombras una columna y has hecho, sin querer, un breaking change para cada cliente. Aquí está el fallo exacto, sobre la entidad `User` real de este proyecto:

```java
// ❌ MAL — devuelve la entidad. Jackson serializa TODOS los campos con getter,
//          y @Data generó getPassword() — así que el hash de BCrypt sale por cable.
@GetMapping
public List<User> getAll() {
    return userRepository.findAll();
}
// GET /api/users  →  [{ "id":1, "name":"Ana", "email":"...", "password":"$2a$10$Xy...", ... }]

// ✅ BIEN — devuelve un DTO. UserResponse no tiene campo password,
//           así que no hay nada que Jackson pueda filtrar, sin importar lo que crezca la entidad después.
@GetMapping
public List<UserResponse> getAll() {
    return userService.getAll();
}
// GET /api/users  →  [{ "id":1, "name":"Ana", "email":"...", "role":"EMPLOYEE", "active":true }]
```

Vale la pena hacer explícito el mecanismo detrás de la fuga, porque no es algo que tú escribiste: Jackson decide qué serializa **reflejando los getters públicos de la clase**, no leyendo ninguna lista que tú hayas configurado. El `@Data` de Lombok en `User` genera un getter para cada campo — incluido `password` — así que Jackson lo encuentra y lo imprime. Nadie "devolvió la contraseña"; devolviste un objeto que *tiene* una. El DTO lo arregla estructuralmente: `UserResponse` no tiene ese campo, así que el hash no puede escaparse ni por accidente.

> **La alternativa `@JsonIgnore` — y por qué TimeTrack no la usa.** Jackson tiene una anotación, `@JsonIgnore`, que puedes poner en `private String password` dentro de la entidad para decirle a Jackson "omite este campo al serializar". Funciona, y te la encontrarás en código real como medida de defensa en profundidad. **La entidad `User` de TimeTrack no la lleva** — el proyecto confía en los DTOs en su lugar, que es la respuesta más fuerte: `@JsonIgnore` protege un campo que recordaste marcar, un DTO protege cada campo que no marcaste. Conoce ambos, porque la pregunta de entrevista es "¿por qué tu endpoint `/api/users` no devuelve la contraseña?" y la respuesta esperada nombra primero los DTOs, `@JsonIgnore` como respaldo. Docs: https://www.baeldung.com/jackson-annotations → leer: "@JsonIgnore".

> **¿Cuándo creas el DTO?** Antes del service y el controlador que lo usan — las firmas de sus métodos mencionan ese tipo, así que tiene que existir primero. El orden para una feature es: entity → repository → **DTO** → service → controller (el mismo flujo que [layer-reference.md](../.../../../layer-reference.md)).

Mantienes dos DTOs por recurso — uno por dirección:

**`dto/request/CreateProjectRequest.java`** — lo que el cliente envía. Lo validas, porque nunca puedes confiar en los datos entrantes:

```java
@Data
public class CreateProjectRequest {

    @NotBlank
    private String name;

    private String description;
}
```

**`dto/response/ProjectResponse.java`** — lo que el API devuelve. Lo construyes tú mismo en el service, así que no necesita validación:

```java
@Data
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private Boolean active;
    private LocalDateTime createdAt;
}
```

Ambos llevan solo `@Data` — los getters, setters, `equals()`, `hashCode()` y `toString()` de Lombok en una sola anotación. No hace falta `@NoArgsConstructor` aquí: una clase sin ningún otro constructor ya recibe el constructor implícito sin argumentos de Java, y eso es todo lo que Jackson necesita para construir el objeto antes de llamar a los setters. (Las entidades son distintas — declaran `@AllArgsConstructor`, que *elimina* el implícito, así que tienen que añadir `@NoArgsConstructor` de vuelta explícitamente. Ver [01-basicos.md](./01-basicos.md#lombok--eliminando-codigo-repetitivo).)

El **service** convierte entre la entidad y estos DTOs; el **controlador** solo trata con DTOs, nunca con la entidad. Estos son los DTOs reales basados en clases de la feature `projects` de TimeTrack — clases de Lombok, el estilo usado en todo el proyecto, no `record`s de Java.

---

## Proyecto 07 — TimeTrack (primer endpoint funcional)

Esta es la primera cadena Controller → Service → Repository construida en el proyecto TimeTrack — el slice de `users`, el más pequeño que demuestra que las tres capas están conectadas entre sí.

> **Lo que estás leyendo es el código del Paso 2, no el del Paso 1.** El endpoint se construyó primero en el Paso 1 devolviendo `List<User>` — la entidad raw, exactamente la versión `// ❌ MAL` de arriba — precisamente para que la fuga fuera visible en Postman antes de introducir los DTOs que la arreglan en el Paso 2. Los archivos de abajo son lo que hay en el repo **hoy**, después de ese refactor. Cuando el diagrama al final de esta sección dice `List<UserResponse>`, es por eso.

### UserRepository

Propósito: la capa de persistencia de `User` — una interfaz que Spring Data implementa en tiempo de ejecución, dándote los métodos CRUD gratis.

Archivo: `src/main/java/com/victor/timetrack/repository/UserRepository.java`

Docs: https://www.baeldung.com/spring-data-derived-queries → leer: las secciones iniciales sobre cómo Spring Data convierte el *nombre* de un método en una query (`findBy…`)

El repositorio va primero porque el service depende de él. Es solo una interfaz que extiende `JpaRepository<User, Long>` — eso solo ya te da `findAll()`, `findById()`, `save()` y `deleteById()` sin ninguna implementación que escribir:

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

- Los dos type arguments son **la entidad** y **el tipo de su `@Id`** — `<User, Long>` porque `User.id` es un `Long`. Ponlos al revés y no compilará.
- `findByEmail` es una **derived query** (query derivada): declaras el método, no escribes cuerpo, y Spring Data lee el *nombre* para generar `SELECT * FROM users WHERE email = ?`. Devuelve `Optional<User>` porque un email que no coincide con nada es un resultado normal, no un error. No lo usa `/api/users` — el login lo necesita (ver [06-seguridad-jwt.md](./06-seguridad-jwt.md)) — pero está en el archivo, así que está aquí.
- **No lleva anotación `@Repository`**, y no hace falta ninguna: Spring Data detecta cada interfaz que extiende `JpaRepository` y registra el bean por sí mismo. Añadir `@Repository` es inofensivo y lo verás en muchos codebases; simplemente es redundante. El mecanismo completo está en [03-spring-data-jpa.md](./03-spring-data-jpa.md).

### UserService

Propósito: la capa de negocio de `User` — obtiene las entidades del repositorio y las convierte en la forma de DTO que el API puede exponer.

Archivo: `src/main/java/com/victor/timetrack/service/UserService.java`

Docs: https://www.baeldung.com/spring-component-repository-service → leer: la sección de `@Service`

```java
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setActive(user.isActive());

        return response;
    }
}
```

- **`@Service`** — Spring encuentra esta clase durante el `@ComponentScan` del archivo 01, crea una instancia (un bean) y la mantiene disponible para inyección
- **`private final UserRepository userRepository`** — declara la dependencia; `final` porque nunca cambia después de que se ejecuta el constructor
- **Inyección por constructor** — Spring ve el constructor único e inyecta el bean `UserRepository` automáticamente ([18-inyeccion-dependencias.md](./18-inyeccion-dependencias.md))
- **`userRepository.findAll()`** — método built-in de `JpaRepository`; ningún SQL escrito por ti
- **`user.isActive()`, no `getActive()`** — el campo es un `boolean` primitivo, y Lombok sigue la convención de JavaBeans de usar `isXxx()` para primitivos. `ProjectResponse.active` es el wrapper `Boolean`, así que *ese* sí es `getActive()`. Ambos aparecen en este archivo; la única diferencia es el tipo del campo, nada más.
- **`toResponse()` es `private` y está al final** — ninguna otra clase lo necesita, así que va después de los métodos públicos que lo llaman. Este helper es el único sitio donde vive el mapeo entidad→DTO.

### UserController

Propósito: la capa web de `User` — es dueña de la URL `/api/users`, y le pasa cada request directamente al service.

Archivo: `src/main/java/com/victor/timetrack/controller/UserController.java`

Docs: https://www.baeldung.com/spring-controller-vs-restcontroller → leer: la sección de `@RestController`

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping
    public List<UserResponse> getAll(){
        return userService.getAll();
    }
}
```

- **`@RestController`** — marca esta clase como controlador REST; cada valor de retorno se serializa a JSON automáticamente
- **`@RequestMapping("/api/users")`** — URL base para todos los métodos de esta clase
- **`@GetMapping`** — responde a `GET /api/users`; sin argumento de ruta porque la URL base ya está establecida en la clase
- **`@PreAuthorize("hasRole('MANAGER')")`** — un guardián de Spring Security añadido más adelante en el proyecto: solo un token cuyo rol sea `MANAGER` llega al método; cualquier otro recibe un 403 antes de que el cuerpo se ejecute. Ignora el mecanismo por ahora — es el tema de [06-seguridad-jwt.md](./06-seguridad-jwt.md); se cita aquí solo porque quitarlo convertiría esto en un archivo fabricado en lugar del real.
- **El tipo de retorno es un `List<UserResponse>` a secas, no un `ResponseEntity`** — y este es el único endpoint del proyecto al que esto no le pasa factura, precisamente porque un GET exitoso *debe* responder 200, que es el valor por defecto de Spring. Es la excepción que confirma la regla: en el momento en que un método necesita decir 201 o 204, el tipo de retorno a secas no tiene forma de expresarlo. Compáralo con `ProjectController` más abajo, donde cada método envuelve su resultado.
- El controlador inyecta el service exactamente igual que el service inyecta el repositorio — un constructor, un campo `private final`. Mismo patrón, una capa más arriba.

### Proyecto 07 — ProjectService — CRUD completo con DTOs y toResponse()

Propósito: la capa de negocio de `Project` — el CRUD completo, incluida la lectura dependiente del rol y el soft delete.

Archivo: `src/main/java/com/victor/timetrack/service/ProjectService.java`

Docs: https://www.baeldung.com/spring-component-repository-service → leer: la sección de `@Service`

> Esta es la versión *trabajada y explicada* del vertical slice. [layer-reference.md](../.../../../layer-reference.md) tiene el mismo flujo como un conjunto de tablas de referencia rápida (usando un ejemplo de `Transaction`) — ábrelo cuando solo necesites recordar la estructura; lee esto cuando quieras el razonamiento detrás de cada línea.

**¿Por qué `.map(this::toResponse)`?** `this::toResponse` es una *referencia a método* — abreviatura del lambda `project -> this.toResponse(project)` (ver [java/12-streams-lambdas.md](../../../java/junior/es/12-streams-lambdas.md)). `stream().map(...)` lo llama una vez por entidad, convirtiendo cada `Project` en un `ProjectResponse`, y `toList()` recoge los resultados. La forma `this::` funciona porque el helper es un método en esta misma clase.

```java
@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectResponse> getAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean isManager = Objects.requireNonNull(auth).getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_MANAGER"));

        return isManager
                ? projectRepository.findAll().stream().map(this::toResponse).toList()
                : projectRepository.findByActiveTrue().stream().map(this::toResponse).toList();
    }

    public ProjectResponse getById(Long id) {
        return projectRepository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
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
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project saved = projectRepository.save(project);

        return toResponse(saved);
    }

    public void delete(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        project.setActive(false);   // soft delete — conserva la fila, la marca como inactiva
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

- **`getAll()` lee el rol de quien llama y bifurca** — un manager ve cada proyecto, un empleado solo los activos (`findByActiveTrue()`, otra derived query). `SecurityContextHolder` es el holder estático que Spring Security rellena con el usuario autenticado antes de que se ejecute tu método, así que el service puede preguntar "¿quién está llamando?" sin que el controlador se lo pase como parámetro. Que la regla *de negocio* ("quién puede ver proyectos archivados") viva en el service y no en el controlador es la regla de capas haciendo su trabajo. Mecanismo completo en [06-seguridad-jwt.md](./06-seguridad-jwt.md).
- **`orElseThrow(() -> new ResourceNotFoundException(...))`** — `findById` devuelve un `Optional<Project>`, y `orElseThrow` o bien desenvuelve el valor o lanza. `ResourceNotFoundException` es una excepción propia de este proyecto (no `RuntimeException`), y es lo que un `@ControllerAdvice` convierte más tarde en una respuesta `404` real — precisamente por eso el controlador de abajo nunca tiene que escribir `notFound()` a mano ([05-manejo-excepciones.md](./05-manejo-excepciones.md)).
- **`create()` empieza con `new Project()`** — la entidad aún no existe; `update()` empieza con `findById()` — debe existir para poder modificarse.
- **`save()` gestiona tanto insert como update** — JPA decide según si el `id` es null.
- **`delete()` devuelve `void`** y realiza un **soft delete**: `active = false` en lugar de eliminar la fila, para que las entradas de tiempo históricas nunca apunten a un proyecto que desapareció.

### Proyecto 07 — ProjectController — CRUD completo con ResponseEntity

Propósito: la capa web de `Project` — mapea cada verbo HTTP a una llamada al service y elige el código de estado que vuelve.

Archivo: `src/main/java/com/victor/timetrack/controller/ProjectController.java`

Docs: https://www.baeldung.com/spring-response-entity → leer: los ejemplos de "Using ResponseEntity"

```java
@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService){
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>>  getAll(){
        return ResponseEntity.ok(projectService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable Long id){
        return ResponseEntity.ok(projectService.getById(id));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping
    public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest request){
        return ResponseEntity.status(201).body(projectService.create(request));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateProjectRequest request){
        return ResponseEntity.ok(projectService.update(id, request));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

**Decisiones clave:**

- **Cada cuerpo de método tiene una línea** — y ese es precisamente el punto. El controlador decide la URL, el verbo y el código de estado; no toma ninguna decisión sobre *qué* pasa. Los cinco cuerpos son "llama al service, envuelve el resultado".
- **`getAll` y `getById` usan `ResponseEntity.ok()`** — el atajo para estado 200 + body
- **`create` usa `status(201).body()`** — un POST que creó algo debe decir 201, no 200
- **`update` usa `ResponseEntity.ok()`** — actualizar un recurso existente devuelve 200; no se creó nada
- **`delete` devuelve `ResponseEntity<Void>`** — sin body; `Void` (mayúscula) porque `<>` solo acepta clases, no la palabra clave `void`
- **`delete` necesita dos líneas, no una** — el service devuelve `void`, así que no hay ningún valor que envolver: lo llamas, y luego construyes la respuesta 204 vacía por separado
- **`@Valid` va junto a `@RequestBody` en los dos métodos de escritura** — la validación se ejecuta *antes* del cuerpo del método, así que un `name` vacío se rechaza con un 400 y `create()` nunca llega a ejecutarse ([07-validacion.md](./07-validacion.md))
- **Nada aquí captura un "not found"** — `getById` sobre un id inexistente parece que devolvería un 200 vacío. No es así: el service lanza, y el exception handler lo convierte en 404 antes de que se serialice nada.

---

### Qué pasa cuando el MANAGER llama a GET /api/users

```
Postman → GET /api/users  (con un token de MANAGER)
  → JwtFilter autentica el token, @PreAuthorize lo deja pasar
    → UserController.getAll()
      → UserService.getAll()
        → UserRepository.findAll()
          → Hibernate genera: SELECT id, name, email, password, role, active FROM users
            → PostgreSQL devuelve las filas
          → devuelto como List<User>          ← entidades, con el hash de la contraseña incluido
        → .map(this::toResponse)              ← la frontera: aquí las entidades se convierten en DTOs
      → devuelto al controlador como List<UserResponse>
    → Jackson serializa List<UserResponse> a JSON
  → Postman recibe [{ "id":1, "name":"Admin Manager", "email":"manager@timetrack.com", ... }]
```

Sigue la contraseña a través de ese diagrama: *sí* se carga de la base de datos a las entidades `User` — Hibernate selecciona la columna, no hay forma de evitarlo. Lo que nunca ocurre es el último paso: `toResponse()` copia cinco campos a un `UserResponse` y el hash simplemente no es uno de ellos, así que cuando Jackson entra en acción ya no hay nada que filtrar. **La conversión a DTO en el service es la línea exacta donde termina la forma de la base de datos y empieza la forma del API.**

Hibernate imprime ese `SELECT` en consola porque `spring.jpa.show-sql=true` está establecido en `application.properties` — la forma más rápida de confirmar que tu endpoint realmente llegó a la base de datos y no respondió de la nada.

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
        // @ControllerAdvice lo mapea a 404 — ver 05-manejo-excepciones.md
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

---

## Hasta dónde llegaste — y qué viene después

El 404 con el que empezaste este archivo ya desapareció. `@ComponentScan` ahora encuentra clases `@RestController` reales, cada una dueña de una URL; `@GetMapping`/`@PostMapping` enrutan el verbo hacia un método; `@PathVariable`, `@RequestParam` y `@RequestBody` extraen la entrada del cliente hacia tus parámetros; `ResponseEntity` decide qué vuelve y con qué estado; y los DTOs garantizan que lo que vuelve es una forma que tú elegiste, no una fila de base de datos.

Pero mira otra vez la primerísima línea de cada controlador de este archivo — `private final ProjectService projectService`, rellenada por un constructor que tú nunca llamas. Nada en este archivo explicó *quién* lo llama. Escribiste `new` exactamente una vez, sobre una entidad `Project` dentro de un service; nunca escribiste `new ProjectService(...)` ni `new ProjectController(...)`, y sin embargo ambos objetos existen y están correctamente conectados entre sí en tiempo de ejecución. Las tres capas solo se mantienen desacopladas si algo externo a ellas hace el ensamblaje — y ese algo es el contenedor IoC.

[18-inyeccion-dependencias.md](./18-inyeccion-dependencias.md) es donde eso deja de ser magia: qué es realmente un bean, cómo `@Service`/`@Repository`/`@RestController` registran uno, cómo Spring elige el constructor y empareja cada parámetro con un bean, y por qué la inyección por constructor — no `@Autowired` en un campo — es la forma que cualquier revisor espera ver.
