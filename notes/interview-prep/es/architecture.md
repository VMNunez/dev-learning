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
