# Arquitectura — Preguntas de entrevista

## REST API

**¿Qué es REST y cómo lo usa tu app Angular?**
REST es una convención para diseñar APIs usando HTTP — cada URL identifica un recurso y el método HTTP indica qué hacer con él. Angular usa `HttpClient` para hacer llamadas REST: `http.get()`, `http.post()`, `http.put()`, `http.delete()`. En el HR portal cada método del servicio mapea a una operación REST — `getAll()` llama a `GET /employees`, `create()` llama a `POST /employees`.

**¿Cuál es la diferencia entre GET, POST, PUT y DELETE?**
GET lee datos sin efectos secundarios. POST crea un nuevo recurso. PUT reemplaza un recurso completamente — envías todos los campos. DELETE elimina un recurso. La diferencia entre PUT y PATCH: PATCH envía solo los campos que cambiaron, PUT reemplaza todo. En la práctica la mayoría de mis proyectos usan PUT para las actualizaciones.

**¿Qué códigos de estado HTTP conoces y qué significan?**
200 es éxito para GET y PUT. 201 es creado — se devuelve tras POST. 204 es sin contenido — se devuelve tras DELETE. 400 es una petición incorrecta — el cliente envió datos inválidos. 401 es no autorizado — el token falta o no es válido. 403 es prohibido — autenticado pero sin permiso. 404 es no encontrado. 500 es un error del servidor. La distinción entre 401 y 403 importa en el HR portal: una petición sin token recibe 401, un empleado intentando acceder a una ruta de admin recibe 403.

**¿Qué es CORS y cuándo ocurre?**
CORS es una regla de seguridad del navegador que bloquea peticiones entre orígenes distintos. Cuando Angular corre en `localhost:4200` y llama a Spring Boot en `localhost:8080`, el navegador lo bloquea — los puertos son distintos así que los orígenes son diferentes. La solución está en el backend: Spring Boot debe incluir cabeceras en la respuesta que permitan el origen de Angular. CORS no afecta a Postman ni a llamadas servidor a servidor — solo los navegadores lo aplican.

---

## Principios SOLID

**¿Qué son los principios SOLID?**
Cinco principios de diseño que hacen el código más fácil de mantener y testear. S — Single Responsibility (una clase, una responsabilidad). O — Open/Closed (extender sin modificar). L — Liskov Substitution (los subtipos respetan el contrato del padre). I — Interface Segregation (interfaces pequeñas en lugar de una grande). D — Dependency Inversion (inyectar dependencias, no crearlas). Aplico S y D cada día tanto en Angular como en Spring Boot.

**¿Qué es el principio de Responsabilidad Única y dónde lo aplicas?**
Una clase debe tener solo una razón para cambiar. En el HR portal: `EmployeeService` es responsable de los datos, `EmployeeListComponent` es responsable de la UI — si cambia la API, solo cambia el servicio; si cambia el diseño, solo cambia el componente. Mezclar ambas responsabilidades en una clase es la violación más común en código junior.

**¿Qué es la Inversión de Dependencias y cómo la aplica Angular?**
Lo que realmente quieren saber: ¿Entiendes qué resuelve la inyección de dependencias, o simplemente la usas porque Angular lo exige?
R: La Inversión de Dependencias significa que una clase no debe crear sus propias dependencias — debe recibirlas desde fuera. Esto hace la clase testeable porque puedes inyectar un mock en lugar de la implementación real. El `inject(EmployeeService)` de Angular y la inyección por constructor de Spring Boot son implementaciones de este principio. Sin él, no puedes escribir unit tests — la clase está vinculada a una implementación específica.
Respuesta mala: "Significa usar `inject()` en Angular." — Ese es el mecanismo, no el principio. La respuesta real es sobre testeabilidad y desacoplamiento.

---

## MVC y patrones de arquitectura

**¿Conoces algún patrón de diseño? ¿Has usado alguno en tus proyectos?**
Un patrón de diseño es una solución reutilizable a un problema común de programación. Los dos que uso cada día sin siempre nombrarlos: Singleton — una sola instancia compartida en toda la app; los servicios de Angular con `providedIn: 'root'` son singletons, igual que los beans `@Service` de Spring Boot. Observer — un objeto notifica a muchos oyentes cuando cambia; los Observables de RxJS son una implementación directa de esto, y los signals de Angular funcionan con el mismo principio. Conocer los nombres me permite comunicarme con desarrolladores senior que usan el vocabulario de patrones de forma natural.

**¿Qué es MVC y cómo se relaciona con Spring Boot?**
MVC divide la app en Model (datos y lógica de negocio), View (lo que ve el usuario) y Controller (recibe la entrada y coordina los otros dos). En Spring Boot la arquitectura en capas extiende esto: el `@RestController` es el Controller, la respuesta JSON es la View, y el Service + Repository forman juntos el Model. En la práctica "MVC" y "arquitectura en capas" se refieren a la misma idea — separar responsabilidades para que cada parte pueda cambiar de forma independiente.

**¿Cuál es la diferencia entre un monolito y microservicios?**
Un monolito es una aplicación desplegada como una sola unidad — todas las features en el mismo código. Los microservicios dividen el sistema en muchos servicios pequeños, cada uno responsable de un dominio de negocio, cada uno con su propia base de datos y su propio despliegue. El monolito es más simple de desarrollar y es bueno para equipos pequeños. Los microservicios permiten a equipos grandes trabajar de forma independiente y escalar una parte sin escalar todo el sistema. El trade-off es la complejidad operacional — los microservicios necesitan infraestructura que un monolito no necesita.

**¿Elegirías un monolito o microservicios para un proyecto nuevo?**
Lo que realmente quieren saber: ¿Entiendes los trade-offs, o crees que los microservicios son siempre la respuesta?
R: Para un proyecto nuevo con un equipo pequeño, empezaría con un monolito — es más rápido de construir, más fácil de depurar y simple de desplegar. Una vez que el dominio está bien entendido y el equipo crece, puedes extraer servicios donde tenga sentido. Empezar con microservicios antes de entender el dominio es uno de los errores de arquitectura más comunes. La mayoría de proyectos en una consultora ya serán microservicios cuando me incorpore, así que mi trabajo es entender el servicio que tengo asignado y cómo se comunica con los demás.
Respuesta mala: "Microservicios, porque escalan mejor." — Optimización prematura. La respuesta real depende del tamaño del equipo, la complejidad del dominio y la fase del proyecto.

---

## Arquitectura en capas

**¿Qué es una arquitectura en capas y por qué importa?**
Dividir la app en capas donde cada una tiene una sola responsabilidad: el controller recibe peticiones HTTP, el service contiene la lógica de negocio, el repository lee y escribe la base de datos. Ninguna mezcla responsabilidades. Esto importa porque si la base de datos cambia, solo cambia el repository. Si el formato de la API cambia, solo cambia el controller. El service — la parte más valiosa — permanece estable. En Angular aplica la misma idea: los componentes gestionan la plantilla, los servicios gestionan la lógica y el HTTP, los modelos definen la forma de los datos.

**¿Qué es un DTO y por qué no devolver la entidad directamente desde la API?**
Un DTO (Data Transfer Object) es una clase simple que lleva solo los datos que el cliente necesita. La entidad es el objeto de base de datos — puede tener campos que el cliente nunca debería ver (hash de contraseña, flags internos) u objetos anidados que causan referencias circulares. Devolver la entidad directamente también acopla la API al esquema de base de datos — si el esquema cambia, la API se rompe. El service mapea la entidad a un DTO antes de que el controller la devuelva.

**¿Por qué pones la lógica de negocio en el service y no en el controller?**
Lo que realmente quieren saber: ¿Entiendes por qué existen las capas, o simplemente seguiste un tutorial?
R: El controller es la interfaz HTTP — lee la petición y devuelve la respuesta. Si pongo lógica de negocio ahí, no puedo reutilizarla cuando un segundo endpoint necesite la misma regla. En el HR portal la comprobación de email duplicado vive en el service — tanto el flujo de creación como el de actualización llaman al mismo método. Si estuviera en el controller, tendría que duplicarla.
Respuesta mala: "Porque así se hace." — Demuestra que no entiendes el motivo.

---

## Autenticación

**¿Qué es JWT y cómo funciona el flujo de autenticación?**
JWT es un token que el servidor genera tras el login. Contiene el email del usuario, el rol y el tiempo de expiración en un payload firmado. El cliente Angular lo guarda en localStorage y el interceptor lo añade como cabecera `Bearer` en cada petición. El backend de Spring Boot verifica la firma en cada petición — sin consulta de sesión en la base de datos. En el HR portal lo simulo: el interceptor añade el token, pero `json-server` no lo valida realmente. El proyecto 07 usará Spring Boot real con validación JWT de verdad.

**¿Cuál es la diferencia entre autenticación y autorización?**
La autenticación es demostrar quién eres — hacer login con email y contraseña para obtener un token. La autorización es decidir qué se te permite hacer — comprobar el rol dentro del token para decidir si puedes acceder a una ruta de admin. En el HR portal, `authGuard` gestiona la autenticación (¿hay un token?) y `adminGuard` gestiona la autorización (¿el rol es `admin`?).

**¿Por qué JWT en lugar de autenticación basada en sesiones para una REST API?**
Lo que realmente quieren saber: ¿Entiendes el trade-off, no solo la implementación?
R: Las sesiones almacenan estado en el servidor — cada petición necesita una consulta a la base de datos para encontrar la sesión. JWT es stateless — el token lleva la información del usuario y el servidor solo verifica la firma. Para una REST API consumida por un frontend Angular, la autenticación stateless escala mejor y simplifica el backend. El trade-off es que no puedes invalidar un JWT antes de que expire — para eso necesitas una lista negra de tokens o una expiración corta con refresh tokens.
Respuesta mala: "JWT es más seguro." — Esto no siempre es cierto. La seguridad depende de la implementación. La razón real es la ausencia de estado y la escalabilidad.
