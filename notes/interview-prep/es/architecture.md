# Arquitectura — Preguntas de entrevista

## REST API

**¿Qué es REST y cómo lo usa tu app Angular?**

REST es una convención para diseñar APIs usando HTTP — cada URL identifica un recurso y el método HTTP indica qué hacer con él. Antes de REST, los equipos diseñaban APIs de formas incompatibles; REST dio a todos un lenguaje común. Angular usa `HttpClient` para hacer llamadas REST: `http.get()`, `http.post()`, `http.put()`, `http.delete()`. En el HR portal, cada método del servicio mapea a una operación REST — `getAll()` llama a `GET /employees`, `create()` llama a `POST /employees`.

> **Junior tip:** Emphasise that REST is a convention, not a protocol you install. It is a shared agreement about how to use HTTP — any team that follows it can be understood by any HTTP client.
> **Consejo de entrevista:** Enfatiza que REST es una convención, no un protocolo que instalas. Es un acuerdo compartido sobre cómo usar HTTP — cualquier cliente que lo entienda puede trabajar con cualquier API REST.

**¿Cuál es la diferencia entre GET, POST, PUT y DELETE?**

GET lee datos sin efectos secundarios. POST crea un nuevo recurso — cada llamada puede crear un nuevo registro. PUT reemplaza un recurso completamente — envías todos los campos; si omites uno, se borra. DELETE elimina un recurso. PATCH es la alternativa a PUT: PATCH envía solo los campos que cambiaron, mientras que PUT reemplaza todo. En la práctica, la mayoría de proyectos Angular + Spring Boot usan PUT para las actualizaciones porque es más simple cuando los objetos son pequeños.

> **Junior tip:** The interviewer may ask about idempotency — GET, PUT, and DELETE are idempotent (safe to call multiple times); POST is not. Know the term even if they do not ask it directly.
> **Consejo de entrevista:** El entrevistador puede preguntar sobre idempotencia — GET, PUT y DELETE son idempotentes (seguros de llamar varias veces); POST no. Conoce el término aunque no te lo pregunten directamente.

**¿Qué códigos de estado HTTP conoces y qué significan?**

200 es éxito para GET y PUT. 201 es creado — se devuelve tras POST. 204 es sin contenido — se devuelve tras DELETE. 400 es una petición incorrecta — el cliente envió datos inválidos. 401 es no autorizado — el token falta o no es válido. 403 es prohibido — autenticado pero sin permiso. 404 es no encontrado. 500 es un error del servidor. La distinción entre 401 y 403 importa: 401 significa "no sé quién eres", 403 significa "sé quién eres, pero no puedes hacer esto". En el HR portal, un empleado intentando acceder a una ruta de admin recibiría un 403.

> **Junior tip:** You do not need to memorise every code. Knowing the families (2xx = success, 4xx = client error, 5xx = server error) and the most common ones is enough for a junior screening.
> **Consejo de entrevista:** No necesitas memorizar todos los códigos. Conocer las familias (2xx = éxito, 4xx = error del cliente, 5xx = error del servidor) y los más comunes es suficiente para un screening junior.

**¿Qué es CORS y cuándo ocurre?**

CORS es una regla de seguridad del navegador que bloquea peticiones entre orígenes distintos. Cuando Angular corre en `localhost:4200` y llama a Spring Boot en `localhost:8080`, el navegador lo bloquea — puertos distintos significan orígenes distintos. La solución está en el backend: Spring Boot debe incluir cabeceras en la respuesta que permitan el origen de Angular. CORS no afecta a Postman ni a llamadas servidor a servidor — solo los navegadores lo aplican. Si una petición funciona en Postman pero falla en el navegador, CORS es casi siempre la causa.

> **Junior tip:** The key insight is that CORS is a browser restriction, not a server restriction. The server decides which origins to allow — the browser is the one that enforces it.
> **Consejo de entrevista:** Lo clave es que CORS es una restricción del navegador, no del servidor. El servidor decide qué orígenes permitir — el navegador es quien lo impone.

**¿Cómo nombras los endpoints REST? ¿Qué convenciones sigues?**

Usa sustantivos, no verbos — la URL nombra el recurso, el método HTTP expresa la acción. Usa sustantivos en plural: `/employees`, no `/employee`. Usa minúsculas con guiones para recursos de varias palabras: `/leave-requests`. Anida recursos para relaciones: `/employees/1/leaves`. Nunca pongas verbos en la URL como `/getEmployee` o `/deleteEmployee/1` — eso es estilo RPC, no REST.

> **Junior tip:** A common mistake is putting the action in the URL. The HTTP method IS the action. `DELETE /employees/1` is correct; `/deleteEmployee/1` is not REST.
> **Consejo de entrevista:** Un error común es poner la acción en la URL. El método HTTP ES la acción. `DELETE /employees/1` es correcto; `/deleteEmployee/1` no es REST.

**¿Qué es la idempotencia y por qué importa en REST?**

Una operación es idempotente si llamarla varias veces produce el mismo resultado que llamarla una sola vez. GET, PUT y DELETE son idempotentes — reintentarlos es seguro. POST no es idempotente — reintentar un POST puede crear un registro duplicado. Esto importa cuando construyes sistemas fiables: si un fallo de red provoca un reintento, quieres saber si el reintento es seguro o potencialmente destructivo.

> **Junior tip:** You will not implement idempotency logic in a junior project, but knowing the concept shows you understand REST at a deeper level than just using `http.get()`.
> **Consejo de entrevista:** No implementarás lógica de idempotencia en un proyecto junior, pero conocer el concepto demuestra que entiendes REST a un nivel más profundo que solo usar `http.get()`.

---

## Principios SOLID

**¿Qué son los principios SOLID?**

Cinco principios de diseño que hacen el código más fácil de mantener y testear. S — Single Responsibility: una clase, una responsabilidad. O — Open/Closed: extender sin modificar el código existente. L — Liskov Substitution: los subtipos deben respetar el contrato del padre. I — Interface Segregation: interfaces pequeñas en lugar de una grande. D — Dependency Inversion: inyectar dependencias, no crearlas dentro de la clase. Aplico S y D cada día tanto en Angular como en Spring Boot.

> **Junior tip:** Know all five by name and definition. Be ready to explain S and D with project examples — those are the two interviewers actually probe at junior level.
> **Consejo de entrevista:** Conoce los cinco por nombre y definición. Sé capaz de explicar S y D con ejemplos de proyectos — esos son los dos que los entrevistadores realmente exploran a nivel junior.

**¿Qué es el principio de Responsabilidad Única y dónde lo aplicas?**

Una clase debe tener solo una razón para cambiar. En el HR portal: `EmployeeService` es responsable de los datos del empleado — si cambia el formato de la API, solo cambia el servicio. `EmployeeListComponent` es responsable de la UI — si cambia el diseño, solo cambia el componente. Mezclar ambas responsabilidades en una clase es la violación más común de SRP en código junior, y hace que testear sea mucho más difícil.

> **Junior tip:** "One reason to change" means one stakeholder owns the class. If both the business team and the API team can force changes in the same class, it violates SRP.
> **Consejo de entrevista:** "Una razón para cambiar" significa que un solo stakeholder es dueño de la clase. Si el equipo de negocio Y el equipo de API pueden forzar cambios en la misma clase, viola SRP.

**¿Qué es la Inversión de Dependencias y cómo la aplica Angular?**

La Inversión de Dependencias significa que una clase no debe crear sus propias dependencias — debe recibirlas desde fuera. Esto hace la clase testeable porque puedes inyectar un mock en lugar de la implementación real. El `inject(EmployeeService)` de Angular y la inyección por constructor de Spring Boot implementan este principio. Sin él, no puedes escribir unit tests — la clase está vinculada a una implementación específica y no puedes cambiarla.

> **Junior tip:** Focus on WHY it matters, not just the mechanism. "Testability and decoupling" is the real answer. `inject()` is just how Angular implements the principle.
> **Consejo de entrevista:** Céntrate en POR QUÉ importa, no solo en el mecanismo. "Testeabilidad y desacoplamiento" es la respuesta real. `inject()` es solo cómo Angular implementa el principio.

Respuesta mala: "Significa usar `inject()` en Angular." — Ese es el mecanismo, no el principio. La respuesta real es sobre testeabilidad y desacoplamiento.

**¿Qué es el principio Open/Closed?**

Una clase debe estar abierta para la extensión pero cerrada para la modificación — añades nuevo comportamiento sin cambiar el código existente que ya funciona. En el HR portal, añadir un nuevo guard a una ruta: `canActivate: [authGuard, adminGuard]` — añades al array sin reescribir `authGuard`. En Angular, añadir un nuevo filtro: añades una nueva señal y extiendes `computed()` sin tocar la lógica de filtros existente. La violación clásica es un gran `if/else` o `switch` que debes modificar cada vez que aparece un caso nuevo.

> **Junior tip:** The interviewer wants to know if you can recognise when a design violates OCP — not if you can recite the definition. Think of a project example where you added behaviour without breaking existing code.
> **Consejo de entrevista:** El entrevistador quiere saber si puedes reconocer cuándo un diseño viola OCP, no si puedes recitar la definición.

**¿Qué es el principio de Sustitución de Liskov?**

Si la clase B extiende la clase A, deberías poder usar B en cualquier lugar donde se espera A y seguir funcionando correctamente. La lección práctica: cuidado con la herencia. Si `AdminService extends EmployeeService`, cada método sobreescrito debe comportarse de forma consistente con lo que `EmployeeService` promete. La señal de alerta: si los llamadores tienen que comprobar `instanceof` antes de llamar a un método, probablemente LSP esté violado. Prefiere la composición sobre la herencia cuando no puedes garantizar el contrato.

> **Junior tip:** LSP violations show up as surprises — you call a method expecting one behaviour and the subclass does something different. If that can happen, break the inheritance apart.
> **Consejo de entrevista:** Las violaciones de LSP se manifiestan como sorpresas — llamas a un método esperando un comportamiento y la subclase hace algo diferente. Si eso puede ocurrir, rompe la herencia.

---

## MVC y patrones de arquitectura

**¿Conoces algún patrón de diseño? ¿Has usado alguno en tus proyectos?**

Un patrón de diseño es una solución reutilizable a un problema común de programación. Los dos que uso cada día: Singleton — una sola instancia compartida en toda la app; los servicios de Angular con `providedIn: 'root'` son singletons, igual que los beans `@Service` de Spring Boot. Observer — un objeto notifica a muchos oyentes cuando cambia; los Observables de RxJS son una implementación directa, y los signals de Angular funcionan con el mismo principio. En el proyecto 05 también apliqué el patrón Coordinator — un componente padre posee todo el estado compartido y coordina la tabla, la barra de filtros y el diálogo que dependen de él.

> **Junior tip:** Do not wait for the interviewer to ask about patterns — bring them up when describing your project architecture. It signals that you think in patterns, not just in code.
> **Consejo de entrevista:** No esperes a que el entrevistador te pregunte sobre patrones — menciónalos al describir la arquitectura de tu proyecto. Indica que piensas en patrones, no solo en código.

**¿Qué es MVC y cómo se relaciona con Spring Boot?**

MVC divide la app en Model (datos y lógica de negocio), View (lo que ve el usuario) y Controller (recibe la entrada y coordina los otros dos). En Spring Boot, la arquitectura en capas extiende esto: el `@RestController` es el Controller, la respuesta JSON es la View, y el Service + Repository forman juntos el Model. En la práctica, "MVC" y "arquitectura en capas" describen la misma idea — separar responsabilidades para que cada parte pueda cambiar de forma independiente.

> **Junior tip:** When an interviewer asks about MVC, they usually mean the general idea of separating concerns, not the strict three-layer definition. Your layered architecture answer covers it — just connect the vocabulary.
> **Consejo de entrevista:** Cuando un entrevistador pregunta sobre MVC, suele referirse a la idea general de separar responsabilidades. Tu respuesta sobre arquitectura en capas lo cubre — solo conecta el vocabulario.

**¿Cuál es la diferencia entre un monolito y microservicios?**

Un monolito es una aplicación desplegada como una sola unidad — todas las features en el mismo código. Los microservicios dividen el sistema en muchos servicios pequeños, cada uno responsable de un dominio de negocio, cada uno con su propia base de datos y despliegue. El monolito es más simple de desarrollar y depurar — bueno para equipos pequeños y proyectos en etapa temprana. Los microservicios permiten a equipos grandes trabajar de forma independiente y escalar una parte sin escalar todo el sistema. El trade-off es la complejidad operacional: los microservicios necesitan infraestructura (service discovery, API gateway, logging distribuido) que un monolito no necesita.

> **Junior tip:** Most consultancies already run microservices. Your job as a junior is to understand the service you own and how it communicates with others via REST — not to design the whole system.
> **Consejo de entrevista:** La mayoría de consultoras ya tienen microservicios. Tu trabajo como junior es entender el servicio asignado y cómo se comunica con los demás vía REST — no diseñar todo el sistema.

**¿Elegirías un monolito o microservicios para un proyecto nuevo?**

Para un proyecto nuevo con un equipo pequeño, empezaría con un monolito — es más rápido de construir, más fácil de depurar y simple de desplegar. Una vez que el dominio está bien entendido y el equipo crece, puedes extraer servicios donde tenga sentido. Empezar con microservicios antes de entender el dominio es uno de los errores de arquitectura más comunes. La mayoría de proyectos en una consultora ya serán microservicios cuando me incorpore — mi trabajo es entender el servicio que tengo asignado y cómo se comunica con los demás.

Respuesta mala: "Microservicios, porque escalan mejor." — Optimización prematura. La respuesta real depende del tamaño del equipo, la complejidad del dominio y la fase del proyecto.

---

## Patrones de componentes

**¿Qué es el patrón smart/dumb y cuándo lo has usado?**

Los componentes smart gestionan el estado y toman decisiones — llaman a servicios, gestionan eventos y pasan datos a los hijos. Los componentes dumb (o presentacionales) solo muestran datos y emiten eventos hacia arriba — no tienen conocimiento de la capa de servicios. La ventaja: los componentes dumb son reutilizables y fáciles de testear porque no tienen dependencias. Lo apliqué por primera vez en el proyecto 03 (expense tracker) — el componente de página tenía todo el estado y el componente de formulario solo emitía eventos.

> **Junior tip:** The names "smart" and "dumb" are being replaced in some teams by "container" and "presentational". Same concept, different words — use whichever the interviewer uses.
> **Consejo de entrevista:** Los nombres "smart" y "dumb" están siendo reemplazados en algunos equipos por "container" y "presentational". Mismo concepto, palabras diferentes — usa el que use el entrevistador.

**¿Qué es el patrón coordinator y dónde lo has usado?**

El patrón coordinator es una extensión del smart/dumb para situaciones donde múltiples componentes hermanos comparten el mismo estado. Un componente padre (el coordinator) posee todos los datos y los pasa a cada hijo por separado. En el proyecto 05 (task manager), el componente de página coordina una barra de filtros, una tabla y un diálogo — los tres dependen de la misma lista de tareas. Sin el coordinator, habría tenido que elegir un hijo como fuente de verdad y pasar datos de forma incómoda entre hermanos.

Respuesta mala: "Puse el estado en el componente de tabla." — Eso hace de la tabla la fuente de verdad, pero el diálogo y la barra de filtros no pueden verlo sin comunicación compleja entre hermanos. El coordinator eleva el estado a un solo lugar y evita esto.

**¿Por qué elegiste el patrón coordinator en el proyecto 05 en lugar de smart/dumb?**

Smart/dumb funciona bien para un padre smart con uno o dos hijos dumb. El coordinator es la elección correcta cuando tienes múltiples componentes hermanos que todos necesitan los mismos datos. En el proyecto 05, cuando añadí la barra de filtros junto a la tabla y el diálogo ya existentes, tres hermanos necesitaban la lista de tareas — el coordinator fue la mejora natural. La regla: empieza con el patrón más simple que funcione, y promueve a uno más estructurado cuando la complejidad lo justifique.

---

## Arquitectura en capas

**¿Qué es una arquitectura en capas y por qué importa?**

Dividir la app en capas donde cada una tiene una sola responsabilidad: el controller recibe peticiones HTTP, el service contiene la lógica de negocio, el repository lee y escribe la base de datos. Ninguna mezcla responsabilidades. Esto importa porque si la base de datos cambia, solo cambia el repository. Si el formato de la API cambia, solo cambia el controller. El service — la parte más valiosa — permanece estable. En Angular aplica la misma idea: los componentes gestionan la plantilla, los servicios gestionan la lógica y las llamadas HTTP, los modelos definen la forma de los datos.

> **Junior tip:** The rule is simple: only call the layer directly below you. Controllers call services, services call repositories. Never skip a layer or call the repository from the controller — business logic leaks into the HTTP layer and cannot be reused or tested independently.
> **Consejo de entrevista:** La regla es simple: solo llama a la capa directamente por debajo de ti. Controllers llaman servicios, servicios llaman repositorios. Nunca saltes una capa.

**¿Qué es un DTO y por qué no devolver la entidad directamente desde la API?**

Un DTO (Data Transfer Object) es una clase simple que lleva solo los datos que el cliente necesita. La entidad es el objeto de base de datos — puede tener campos que el cliente nunca debería ver (hash de contraseña, flags internos) u objetos anidados que causan referencias circulares al serializar a JSON. Devolver la entidad directamente también acopla la API al esquema de base de datos — si el esquema cambia, la API cambia también. El service mapea la entidad a un DTO antes de que el controller la devuelva.

> **Junior tip:** DTOs decouple the API contract from the database schema. The benefit is not obvious until you have to change the schema and realise the API is broken for all clients.
> **Consejo de entrevista:** Los DTOs desacoplan el contrato de la API del esquema de base de datos. El beneficio no es obvio hasta que cambias el esquema y te das cuenta de que la API está rota para todos los clientes.

**¿Por qué pones la lógica de negocio en el service y no en el controller?**

El controller es la interfaz HTTP — lee la petición y devuelve la respuesta. Si pongo lógica de negocio ahí, no puedo reutilizarla cuando un segundo endpoint necesite la misma regla. En el HR portal, la comprobación de email duplicado vive en el service — tanto el flujo de creación como el de actualización llaman al mismo método. Si estuviera en el controller, tendría que duplicarla. Los controllers deben ser ligeros — delegan todo al service.

Respuesta mala: "Porque así se hace." — Demuestra que no entiendes el motivo. La respuesta real es sobre reutilización y testeabilidad — si la lógica está en el controller, no puedes testarla de forma independiente del HTTP.

**¿Cómo estructuras las carpetas en un proyecto Angular para una consultora?**

El estándar en las consultoras españolas es Core/Feature/Shared: `core/` tiene las cosas singleton que se ejecutan una vez (servicio de auth, interceptors, guards); `features/` tiene cada dominio de negocio como un slice independiente (employees, departments, leave requests — cada uno con sus propios componentes, servicios y modelos); `shared/` tiene componentes UI reutilizables usados entre features (confirm dialog, status badge). Apliqué esta estructura en el proyecto 06 (HR portal). Hace el código navegable para alguien que nunca lo ha visto.

Respuesta mala: "Pongo todo en una carpeta components." — Funciona para proyectos pequeños, se convierte en un desastre cuando la app crece. Las consultoras usan estructura por features para que los equipos puedan ser dueños de slices independientes sin pisarse.

---

## Autenticación

**¿Qué es JWT y cómo funciona el flujo de autenticación?**

JWT es un token que el servidor genera tras el login. Contiene el email del usuario, el rol y el tiempo de expiración en un payload firmado. El cliente Angular lo guarda en `localStorage` y el interceptor HTTP lo añade como cabecera `Bearer` en cada petición. El backend de Spring Boot verifica la firma en cada petición — sin consulta de sesión en la base de datos. En el HR portal lo simulo: el interceptor añade el token, pero `json-server` no lo valida realmente. El proyecto 07 usará Spring Boot real con validación JWT de verdad.

> **Junior tip:** Remember the three parts: header (algorithm), payload (user data), signature (proof the token is genuine). The payload is Base64-encoded but not encrypted — anyone can read it. Never put passwords in a JWT.
> **Consejo de entrevista:** Recuerda las tres partes: header (algoritmo), payload (datos del usuario), signature (prueba de que el token es genuino). El payload está en Base64 pero no está cifrado — nunca pongas contraseñas en un JWT.

**¿Cuál es la diferencia entre autenticación y autorización?**

La autenticación es demostrar quién eres — hacer login con email y contraseña para obtener un token. La autorización es decidir qué se te permite hacer — comprobar el rol dentro del token para decidir si puedes acceder a una ruta de admin. En el HR portal, `authGuard` gestiona la autenticación (¿hay un token?) y `adminGuard` gestiona la autorización (¿el rol es `admin`?). La distinción importa para los códigos HTTP: 401 es un fallo de autenticación, 403 es un fallo de autorización.

> **Junior tip:** Authentication asks "who are you?", authorisation asks "what can you do?". Keep this distinction clear — interviewers use the terms precisely and mix-ups stand out.
> **Consejo de entrevista:** Autenticación pregunta "¿quién eres?", autorización pregunta "¿qué puedes hacer?". Mantén esta distinción clara — los entrevistadores usan los términos con precisión y los errores se notan.

**¿Por qué JWT en lugar de autenticación basada en sesiones para una REST API?**

Las sesiones almacenan estado en el servidor — cada petición necesita una consulta a la base de datos para encontrar la sesión. JWT es stateless — el token lleva la información del usuario y el servidor solo verifica la firma. Para una REST API consumida por un frontend Angular, la autenticación stateless escala mejor y simplifica el backend. El trade-off es que no puedes invalidar un JWT antes de que expire — para eso necesitas una lista negra de tokens o una expiración corta con refresh tokens.

Respuesta mala: "JWT es más seguro." — Esto no siempre es cierto. La seguridad depende de la implementación. La razón real es la ausencia de estado y la escalabilidad.

**¿Dónde guardas el token JWT y cuáles son los trade-offs de seguridad?**

`localStorage` es el enfoque más simple y lo que uso en el HR portal — persiste entre pestañas y reinicios del navegador. El riesgo: JavaScript puede leer `localStorage`, así que un ataque XSS podría robar el token. `sessionStorage` se borra cuando se cierra la pestaña, reduciendo la ventana de exposición. Las `httpOnly cookies` son las más seguras — el navegador las envía automáticamente y JavaScript no puede leerlas — pero requieren protección CSRF. Para apps de negocio internas, `localStorage` con prevención de XSS es la elección común en consultoras españolas.

Respuesta mala: "Uso localStorage." — Aceptable, pero debes mencionar inmediatamente el riesgo de XSS. Si dices `localStorage` sin mencionar el trade-off, el entrevistador asumirá que no eres consciente de las implicaciones de seguridad.

**¿Qué ocurre cuando un JWT expira? ¿Cómo lo gestiona tu app Angular?**

Cuando el token expira, el backend devuelve 401 Unauthorized. En una app Angular de producción, el interceptor HTTP captura las respuestas 401 y o bien redirige al usuario a la página de login o usa un refresh token para obtener un nuevo token de acceso silenciosamente. En el HR portal lo gestiono de forma simple: con 401, el interceptor limpia `localStorage` y redirige al login. El proyecto 07 implementará esto correctamente en el interceptor.

> **Junior tip:** Handling token expiry in the HTTP interceptor is one of the most common Spring Boot + Angular interview topics. Know that 401 = expired or invalid token, and the response is either redirect to login or silent refresh.
> **Consejo de entrevista:** Gestionar la expiración del token en el interceptor es uno de los temas más comunes en entrevistas Spring Boot + Angular. Sabe que 401 = token expirado o inválido.

**¿Qué es un refresh token y cuándo lo usarías?**

Un refresh token es un token de larga duración emitido junto al token de acceso de corta duración. Cuando el token de acceso expira, la app Angular envía el refresh token a un endpoint especial para obtener un nuevo token de acceso sin que el usuario tenga que hacer login de nuevo. La ventaja: puedes mantener los tokens de acceso de corta duración (15 minutos) por seguridad sin forzar a los usuarios a hacer login constantemente. Para un proyecto de aprendizaje, un solo token con una expiración más larga es más simple y aceptable.

> **Junior tip:** You do not need to have implemented refresh tokens — just know what the pattern is and why it exists. "Short access token for security, long refresh token for convenience" is the one-line summary.
> **Consejo de entrevista:** No necesitas haberlos implementado — solo conoce qué son y por qué existen. "Token de acceso corto por seguridad, token de refresco largo por comodidad" es el resumen en una línea.

---

## Gestión de errores

**¿Cómo gestiona tu app Angular los errores HTTP del backend?**

El `HttpClient` de Angular lanza errores de Observable para cualquier respuesta que no sea 2xx. Gestiono los errores en el servicio usando `catchError` de RxJS — intercepta el error y devuelve un fallback seguro o relanza un error limpio para que el componente lo gestione. Para la capa de cara al usuario, uso una señal `isError` en el componente que muestra un mensaje de error en la plantilla. En el HR portal, el interceptor HTTP también gestiona 401 globalmente — limpia la sesión y redirige al login.

> **Junior tip:** Handle errors in the service when you want a safe fallback (empty array, null). Handle them in the component when you need to show the user a message. Handle global errors (401) in the interceptor — not in every service individually.
> **Consejo de entrevista:** Gestiona errores en el servicio cuando quieres un fallback seguro. Gestiónalos en el componente cuando necesitas mostrar un mensaje. Gestiona errores globales (401) en el interceptor — no en cada servicio individualmente.

**¿Qué devuelve Spring Boot cuando algo va mal?**

Por defecto, Spring Boot devuelve un objeto JSON de error con `timestamp`, `status`, `error` y `message`. Para errores de validación, devuelve 400 con detalles a nivel de campo. Para errores de lógica de negocio personalizada, el service lanza una excepción y una clase `@ControllerAdvice` la captura globalmente y devuelve el código de estado y mensaje correctos. Sin `@ControllerAdvice`, cada excepción no gestionada devuelve 500 — el cliente no recibe información útil sobre qué salió mal.

> **Junior tip:** `@ControllerAdvice` is a global exception handler — one class handles exceptions thrown by any controller in the app. You will see this on day one in a Spring Boot project.
> **Consejo de entrevista:** `@ControllerAdvice` es un manejador global de excepciones — una clase gestiona las excepciones de todos los controllers. Lo verás desde el primer día en un proyecto Spring Boot.

---

## Preguntas de presión

**¿Qué cambiarías de la arquitectura de uno de tus proyectos si empezaras de nuevo?**

En el HR portal extraería la gestión del estado de autenticación en un módulo auth propio desde el principio, en lugar de tenerlo distribuido entre el componente raíz y el auth service. A medida que la app creció, referencié `authService.currentUser()` desde muchos lugares sin un límite claro de propiedad. Un módulo auth dedicado con una API pública limpia habría sido más ordenado. También habría añadido la gestión global de errores en el interceptor HTTP desde el primer día en lugar de añadirla feature a feature.

**¿Cuál fue la decisión de arquitectura más difícil que tomaste y por qué?**

En el proyecto 05 (task manager), decidir entre smart/dumb y el patrón coordinator. Empecé con smart/dumb — un padre, una tabla hija. Cuando añadí la barra de filtros, tres hermanos necesitaban la misma lista de tareas. Actualizar al coordinator fue lo correcto pero requirió elevar estado que ya estaba en el componente de tabla. La lección: empieza con el patrón más simple que funcione, y promueve a uno más estructurado cuando la complejidad lo justifique — no sobre-diseñes demasiado pronto.
