# Spring Boot — Preguntas de entrevista

## Spring Boot básico

**¿Qué es Spring Boot y por qué lo usan las empresas en lugar de Spring puro?**

Spring Boot es un framework construido sobre Spring que elimina la configuración manual — auto-configura la aplicación según las dependencias del pom.xml e incluye un servidor Tomcat embebido. Las empresas lo usan porque un proyecto nuevo está listo para ejecutarse en minutos en lugar de días de configuración en XML.

> **Junior tip:** the two key phrases are "auto-configuration" and "embedded server" — those are what distinguish Spring Boot from plain Spring.
> **Consejo de entrevista:** las dos frases clave son "auto-configuración" y "servidor embebido" — eso es lo que distingue Spring Boot de Spring puro.

---

**¿Qué hace @SpringBootApplication?**

Combina tres anotaciones: @Configuration (marca la clase como fuente de beans de Spring), @EnableAutoConfiguration (activa la auto-configuración según el classpath) y @ComponentScan (escanea el paquete actual y los subpaquetes buscando componentes). Cada aplicación Spring Boot tiene exactamente una clase con esta anotación — es el punto de entrada.

> **Junior tip:** knowing the three annotations it combines signals real understanding — most candidates just say "it starts the app."
> **Consejo de entrevista:** conocer las tres anotaciones que combina demuestra comprensión real — la mayoría de candidatos solo dice "arranca la aplicación."

---

**¿Qué es la auto-configuración en Spring Boot?**

La auto-configuración lee el classpath y configura beans automáticamente. Si spring-boot-starter-data-jpa está en el pom.xml, Spring Boot crea el DataSource, el EntityManagerFactory y el gestor de transacciones sin ningún código extra. Puedes sobreescribir cualquier bean auto-configurado definiendo el tuyo propio.

> **Junior tip:** give a concrete example — "if JPA is on the classpath, Spring Boot configures the database connection automatically." That is clearer than an abstract definition.
> **Consejo de entrevista:** da un ejemplo concreto — "si JPA está en el classpath, Spring Boot configura la conexión a la base de datos automáticamente."

---

**¿Para qué sirve application.properties?**

Es el fichero de configuración central — URL de base de datos, puerto del servidor, secreto JWT, modo DDL de Hibernate. En el proyecto 07 guardo la conexión a PostgreSQL, el puerto 8080 y la configuración JWT. En producción, los secretos se reemplazan con variables de entorno para que no queden en el repositorio git.

> **Junior tip:** always mention that secrets should come from environment variables in production — it shows security awareness without needing to go deep into the topic.
> **Consejo de entrevista:** menciona siempre que los secretos deben venir de variables de entorno en producción — demuestra conciencia de seguridad sin profundizar en el tema.

---

**¿Por qué elegiste Spring Boot en lugar de Spring puro para el proyecto 07?**

Spring puro requiere configuración en XML, declaraciones explícitas de beans y un servidor instalado por separado. Spring Boot elimina todo eso — pude empezar a escribir endpoints REST inmediatamente tras generar el proyecto en start.spring.io. Para un proyecto de portfolio que demuestra habilidades full-stack, eliminar esa ceremonia es la decisión correcta.

Respuesta de alerta: "Porque el tutorial usaba Spring Boot." Demuestra que seguiste instrucciones sin entender la decisión.

---

**¿Por qué usas inyección por constructor en lugar de @Autowired en un campo?**

Tres razones: el campo puede ser `final` (no se puede cambiar tras la inyección), las dependencias son visibles en la firma del constructor (ves exactamente qué necesita la clase) y la clase es fácil de probar unitariamente (pasas un mock en el constructor sin necesitar contexto Spring). Desde Spring Framework 4.3, si una clase tiene un solo constructor, @Autowired ni siquiera es necesario.

Respuesta de alerta: "Siempre uso @Autowired en campos porque es más sencillo." Demuestra que no piensas en la testabilidad.

---

**La aplicación falla al arrancar con "Failed to configure a DataSource" — ¿qué compruebas primero?**

Reviso application.properties — la URL de base de datos, el usuario y la contraseña. Si están correctos, compruebo si PostgreSQL está ejecutándose y si la base de datos existe. La causa más común es un spring.datasource.url incorrecto o ausente. Si spring-boot-starter-data-jpa está en el pom.xml pero no hay DataSource configurado, Spring Boot no puede arrancar.

---

**¿Qué es @Transactional y dónde lo pones?**

@Transactional envuelve un método de servicio en una transacción de base de datos — o todas las operaciones tienen éxito juntas, o ninguna lo hace y todo se revierte. Va en métodos de servicio, no en controladores ni en repositorios. Los repositorios ya gestionan sus propias transacciones. En el proyecto 07 uso @Transactional en métodos de servicio que hacen más de una escritura en base de datos, para que un fallo parcial no deje la base de datos en un estado inconsistente.

> **Junior tip:** the rule is simple — put @Transactional on service methods that do multiple writes. One write — usually not needed. Multiple writes — always needed.
> **Consejo de entrevista:** la regla es simple — pon @Transactional en métodos de servicio que hacen múltiples escrituras. Una escritura — normalmente no hace falta. Múltiples escrituras — siempre necesario.

Respuesta de alerta: "Lo pongo en el controlador." Demuestra una mala comprensión de dónde pertenecen la lógica de negocio y las transacciones.

---

**¿Qué ocurre cuando accedes a una relación LAZY fuera de una transacción?**

Obtienes una LazyInitializationException — la sesión de Hibernate ya está cerrada y no puede ejecutar la consulta extra para cargar la relación. La solución correcta es convertir la entidad a DTO dentro del método @Transactional del servicio, mientras la sesión está aún abierta — no acceder a campos lazy en el controlador después de que la sesión se haya cerrado.

---

## REST controllers

**¿Cuál es la diferencia entre @Controller y @RestController?**

@Controller es para aplicaciones que devuelven vistas HTML. @RestController combina @Controller y @ResponseBody — cada método devuelve datos directamente como JSON sin capa de vistas. En el proyecto 07 uso @RestController en todos los endpoints porque el backend es una API REST pura consumida por Angular.

> **Junior tip:** if you are building a REST API — which you are — you always use @RestController. You would never use plain @Controller in a backend-only project.
> **Consejo de entrevista:** si construyes una API REST — que es tu caso — siempre usas @RestController. Nunca usarías @Controller a secas en un proyecto solo backend.

---

**¿Por qué devuelves ResponseEntity en lugar de devolver el objeto directamente?**

ResponseEntity permite establecer el código de estado HTTP de forma explícita. Devolver solo el objeto siempre da 200. Con ResponseEntity puedo devolver 201 cuando algo se crea, 204 cuando un borrado tiene éxito o 404 cuando algo no existe. En el proyecto 07 cada método del controlador devuelve ResponseEntity para que el frontend Angular sepa exactamente qué ocurrió.

Respuesta de alerta: "Solo devuelvo el objeto — Spring se ocupa del resto." Demuestra que no controlas la capa HTTP.

---

**¿Cuál es la diferencia entre @PathVariable y @RequestParam?**

@PathVariable lee un valor del path de la URL: GET /transactions/{id} — el id forma parte de la estructura de la URL. @RequestParam lee de los parámetros de query: GET /transactions?category=food — viene después del ?. La convención: @PathVariable para identificadores de recurso (obligatorio), @RequestParam para filtros opcionales.

> **Junior tip:** a quick memory trick — path variable is mandatory (no id, no route); request param is usually optional (it comes after the ?).
> **Consejo de entrevista:** truco de memoria — la variable de path es obligatoria (sin id no hay ruta); el request param suele ser opcional (viene después del ?).

---

**¿Qué es @RequestBody y cómo funciona?**

@RequestBody le dice a Spring que lea el cuerpo de la petición HTTP y lo convierta de JSON a un objeto Java usando Jackson, la librería JSON que Spring Boot incluye automáticamente. Los nombres de los campos JSON deben coincidir con los nombres de los campos Java. En el proyecto 07 POST /transactions recibe un TransactionCreateDTO mediante @RequestBody.

> **Junior tip:** you do not configure Jackson — it works automatically as long as your DTO is a record or has a no-argument constructor.
> **Consejo de entrevista:** no configuras Jackson — funciona automáticamente siempre que tu DTO sea un record o tenga un constructor sin argumentos.

---

**¿Qué es la arquitectura en capas de Spring Boot y por qué importa?**

Las tres capas son: controller (gestiona HTTP), service (toda la lógica de negocio) y repository (acceso a base de datos). Cada capa solo llama a la capa directamente por debajo. En el proyecto 07 el TransactionController nunca accede al repositorio — si la lógica de negocio cambia, solo cambio el servicio. Esto es separación de responsabilidades.

> **Junior tip:** name the three layers and say "separation of concerns" — that phrase is what most interviewers want to hear.
> **Consejo de entrevista:** nombra las tres capas y di "separación de responsabilidades" — esa frase es lo que la mayoría de entrevistadores quieren escuchar.

Respuesta de alerta: "Pongo todo en el controlador porque es más sencillo." Es una señal de alerta para cualquier consultora.

---

**¿Por qué usar @Service y @Repository en lugar de @Component para todo?**

Las tres registran la clase como bean de Spring, pero la diferencia semántica importa. @Repository también traduce las excepciones de JPA a la jerarquía DataAccessException de Spring, de modo que el servicio nunca necesita gestionar errores específicos de Hibernate. Usar la anotación correcta hace el código auto-documentado — cualquier desarrollador identifica la capa inmediatamente.

---

**¿Por qué usar DTOs en lugar de devolver entidades JPA directamente desde el controlador?**

Las entidades están vinculadas al esquema de base de datos — pueden exponer campos que no debes enviar al cliente (hash de contraseña, claves foráneas internas, colecciones cargadas de forma perezosa). Los DTOs permiten controlar exactamente qué devuelve la API. En el proyecto 07 la entidad Transaction tiene un campo user con el objeto User completo — el TransactionDTO solo expone los campos que Angular necesita.

Respuesta de alerta: "Devuelvo entidades porque hay menos código." Las entidades pueden causar errores de serialización en relaciones lazy y exponen la estructura de la base de datos a los clientes.

---

**Un endpoint POST siempre devuelve 200 en lugar de 201 — ¿qué olvidaste?**

Olvidé devolver ResponseEntity.status(201).body(created). Devolver el objeto directamente o usar ResponseEntity.ok() siempre da 200. La solución es explícita en la sentencia return del controlador.

---

**¿Qué es CORS y por qué tu aplicación Angular recibe un error CORS al llamar a la API Spring Boot?**

CORS (Cross-Origin Resource Sharing) es una política de seguridad del navegador que bloquea que JavaScript llame a un servidor en un origen diferente. El servidor de desarrollo de Angular corre en localhost:4200 y la API Spring Boot corre en localhost:8080 — puertos diferentes significan orígenes diferentes. La solución es configurar Spring Boot para que acepte peticiones de localhost:4200 usando un bean CorsConfigurationSource en la configuración de SecurityFilterChain.

> **Junior tip:** the CORS error only happens in the browser — it is not a backend bug. The browser blocks the request before it even reaches Spring Boot. The fix is always on the server side.
> **Consejo de entrevista:** el error CORS solo ocurre en el navegador — no es un fallo del backend. El navegador bloquea la petición antes de que llegue a Spring Boot. La solución siempre es en el servidor.

Respuesta de alerta: "Añadí @CrossOrigin a cada controlador." Funciona pero no es el enfoque correcto en un proyecto real — debe configurarse de forma centralizada en SecurityFilterChain.

---

**¿Qué anotaciones de Bean Validation usas en los DTOs de petición y qué activa @Valid?**

Anotaciones comunes: @NotNull (el valor no puede ser null), @NotBlank (el string no puede ser null ni vacío — preferida para strings), @Size(min, max) (longitud), @Min/@Max (rango numérico), @Email (formato de email válido). @Valid en un parámetro @RequestBody le dice a Spring que ejecute todas las validaciones antes de que el método del controlador se ejecute — si alguna restricción falla, Spring lanza MethodArgumentNotValidException y @ControllerAdvice lo mapea a 400.

> **Junior tip:** use @NotBlank for strings — it also rejects empty strings and whitespace. @NotNull is for non-string types. The pair @Valid + @ControllerAdvice handles all invalid input centrally, so controllers never need manual if-checks.
> **Consejo de entrevista:** usa @NotBlank para strings — también rechaza strings vacíos y espacios. @NotNull es para otros tipos. El par @Valid + @ControllerAdvice gestiona toda la entrada inválida de forma centralizada.

---

## Spring Data JPA

**¿Cuál es la diferencia entre JPA e Hibernate?**

JPA (Jakarta Persistence API) es la especificación — define las anotaciones estándar (@Entity, @Id, @ManyToOne) y las interfaces. Hibernate es la implementación más común — traduce esas anotaciones a SQL. Spring Boot usa Hibernate por defecto. Tú escribes contra la especificación JPA; Hibernate ejecuta las consultas.

> **Junior tip:** "JPA is the spec, Hibernate is the implementation" — one sentence that satisfies most interviewers.
> **Consejo de entrevista:** "JPA es la especificación, Hibernate es la implementación" — una frase que satisface a la mayoría de entrevistadores.

---

**¿Qué te da JpaRepository de forma gratuita?**

Extender JpaRepository<Transaction, Long> te da save(), findById(), findAll(), findAllById(), deleteById(), count() y existsById() sin escribir ningún código. Spring Data JPA genera la implementación al arrancar. Solo escribes métodos adicionales cuando los incorporados no son suficientes.

> **Junior tip:** "Spring Data generates the implementation automatically" is the key phrase — it shows you understand the pattern, not just the syntax.
> **Consejo de entrevista:** "Spring Data genera la implementación automáticamente" es la frase clave — demuestra que entiendes el patrón, no solo la sintaxis.

---

**¿Qué es un derived query method en Spring Data JPA?**

Es un método que declaras en el repositorio cuyo nombre Spring Data JPA analiza para generar el SQL automáticamente. findByCategory(String category) genera SELECT * FROM transactions WHERE category = ?. Puedes combinar condiciones con And/Or, añadir ordenación con OrderBy y contar con countBy. En el proyecto 07 uso findByUserAndDateBetween para obtener las transacciones de un usuario en un rango de fechas.

---

**¿Cuándo un derived query method no es suficiente y necesitas @Query?**

Cuando la lógica no puede expresarse con el nombre del método — por ejemplo, joins entre múltiples tablas, funciones de agregado o cargar una entidad relacionada con JOIN FETCH para evitar el problema N+1. En el proyecto 07 uso @Query cuando el nombre del método derivado se volvería ilegiblemente largo o cuando necesito controlar exactamente qué relaciones se cargan.

> **Junior tip:** derived methods handle the 80% case. When you hit something complex, @Query is the answer. Knowing both and when to use each one shows you understand the tradeoffs.
> **Consejo de entrevista:** los métodos derivados cubren el 80% de los casos. Cuando necesitas algo complejo, usa @Query. Conocer ambos y cuándo usarlos demuestra que entiendes los compromisos.

---

**¿Cómo sabe save() si debe insertar o actualizar?**

save() comprueba el campo @Id. Si es null, JPA inserta una nueva fila. Si tiene un valor existente, JPA hace un merge (actualiza) la fila existente. No necesitas métodos insert() y update() separados.

---

**¿Cuál es la diferencia entre @OneToMany y @ManyToOne, y cómo decides dónde va cada uno?**

@ManyToOne va en la entidad cuya tabla de base de datos tiene la columna de clave foránea. En el proyecto 07 la tabla transactions tiene una columna user_id, por lo que la entidad Transaction tiene @ManyToOne apuntando a User. @OneToMany va en el otro lado — User tiene @OneToMany(mappedBy = "user") apuntando a sus transacciones. La columna de clave foránea en la base de datos determina dónde va @ManyToOne.

> **Junior tip:** think from the database side — where is the foreign key column? That table's entity gets @ManyToOne.
> **Consejo de entrevista:** piensa desde la base de datos — ¿dónde está la columna de clave foránea? La entidad de esa tabla es la que lleva @ManyToOne.

---

**¿Por qué usas FetchType.LAZY en lugar de FetchType.EAGER?**

LAZY carga la entidad relacionada solo cuando accedes al campo en el código. EAGER la carga inmediatamente con la entidad padre, aunque no la necesites. EAGER puede lanzar consultas extra inesperadas y cargar grafos de objetos enormes. En el proyecto 07 uso LAZY en todas las relaciones — al consultar transacciones no cargo automáticamente el objeto User completo con cada fila.

Respuesta de alerta: "Siempre uso EAGER porque es más sencillo." Demuestra que no piensas en el rendimiento de la base de datos.

---

**¿Qué es el problema N+1?**

El problema N+1 ocurre cuando cargas N entidades y luego accedes a una relación lazy en cada una — eso lanza N consultas adicionales. Cargar 100 transacciones y llamar a transaction.getUser().getName() en un bucle envía 100 SELECT extra a la base de datos. La solución es JOIN FETCH en un @Query para cargar ambas entidades en una sola consulta.

---

**¿Qué anotaciones necesita una entidad JPA como mínimo?**

@Entity en la clase, @Id en el campo de clave primaria y @GeneratedValue(strategy = GenerationType.IDENTITY) para que la base de datos auto-incremente el id usando una columna SERIAL en PostgreSQL. Todo lo demás (@Table, @Column) es configuración opcional.

> **Junior tip:** if you forget @Entity, Spring Data will not recognize the class as a table and will fail at startup with a clear error.
> **Consejo de entrevista:** si olvidas @Entity, Spring Data no reconocerá la clase como tabla y fallará al arrancar con un error claro.

---

**Tu aplicación registra cientos de SELECT para una sola petición de lista — ¿qué ocurrió?**

Es el problema N+1. La consulta carga entidades y luego cada acceso a una relación lazy lanza un SELECT separado. Identificaría qué relación es LAZY y lo corregiría con JOIN FETCH en un @Query del repositorio para cargar todo en una sola consulta.

---

**¿Qué es Pageable en Spring Data JPA y cuándo lo usarías?**

Pageable permite cargar un subconjunto de datos en lugar de la tabla completa — pasas un número de página y un tamaño de página, y el repositorio devuelve un objeto Page<T> con los resultados, el recuento total y metadatos. En el proyecto 07 añado paginación a GET /transactions para que el frontend Angular pueda cargar 20 transacciones a la vez en lugar del historial completo. La firma del método del repositorio cambia a Page<Transaction> findAll(Pageable pageable).

> **Junior tip:** any real app with a growing dataset needs pagination. "We load everything with findAll()" is a performance red flag in any interview. Mention Pageable proactively when talking about list endpoints.
> **Consejo de entrevista:** cualquier app real con datos crecientes necesita paginación. "Cargamos todo con findAll()" es una señal de alerta en cualquier entrevista.

Respuesta de alerta: "Simplemente llamo a findAll() — la lista no es tan larga todavía." Demuestra que no eres consciente de cómo crecen los datos en producción.

---

## Seguridad y JWT

**¿Cómo funciona la autenticación JWT en Spring Boot a alto nivel?**

El usuario envía credenciales a POST /auth/login. El servicio las verifica y devuelve un token JWT. En cada petición posterior el frontend Angular envía el token en la cabecera Authorization como "Bearer token". Un filtro que extiende OncePerRequestFilter intercepta cada petición, valida el token, extrae el usuario y establece el SecurityContext. Spring Security luego permite o deniega el acceso según las reglas de SecurityFilterChain.

> **Junior tip:** draw the flow in your head before answering — "login → get token → send token on every request → filter validates → SecurityContext set." That is the whole pattern.
> **Consejo de entrevista:** visualiza el flujo antes de responder — "login → obtener token → enviar token en cada petición → el filtro valida → SecurityContext establecido." Ese es todo el patrón.

---

**¿Qué es SecurityFilterChain y qué configuras en él?**

SecurityFilterChain define las reglas de seguridad de la aplicación — qué endpoints son públicos, cuáles requieren autenticación, configuración de CORS, CSRF y qué filtros personalizados añadir. En el proyecto 07 configuro POST /auth/login y POST /auth/register como públicos y todos los demás endpoints como autenticados. También añado el filtro JWT antes del filtro de autenticación por defecto de Spring.

> **Junior tip:** think of SecurityFilterChain as the one place where all security rules are defined — any endpoint not explicitly permitted is protected by default.
> **Consejo de entrevista:** piensa en SecurityFilterChain como el único lugar donde se definen todas las reglas de seguridad — cualquier endpoint no listado explícitamente está protegido por defecto.

---

**¿Cuál es la diferencia entre autenticación y autorización?**

La autenticación es demostrar quién eres — iniciar sesión con email y contraseña. La autorización es controlar qué puedes hacer — solo los usuarios ADMIN pueden borrar datos de otros usuarios. Spring Security gestiona ambas: la autenticación JWT ocurre en el filtro; la autorización se impone con roles y @PreAuthorize.

> **Junior tip:** simple summary — authentication: are you who you say you are? Authorization: are you allowed to do this?
> **Consejo de entrevista:** resumen simple — autenticación: ¿eres quien dices ser? Autorización: ¿tienes permiso para hacer esto?

---

**¿Por qué deshabilitas CSRF en una API REST?**

La protección CSRF está diseñada para aplicaciones HTML renderizadas en el servidor que usan cookies para las sesiones. Una API REST con JWT no usa cookies — cada petición lleva el token en una cabecera. Activar CSRF rechazaría todas las peticiones no-GET sin un token CSRF coincidente, rompiendo la API. Por eso se deshabilita en APIs sin estado basadas en tokens.

Respuesta de alerta: "Lo deshabilité porque estaba en el tutorial." Necesitas saber por qué — los entrevistadores preguntan esto específicamente para evaluar la conciencia de seguridad.

---

**¿Qué es @PreAuthorize y cuándo lo usarías?**

@PreAuthorize añade autorización a nivel de método. @PreAuthorize("hasRole('ADMIN')") bloquea a los usuarios no administradores antes de que el método se ejecute. En el proyecto 07 lo uso en endpoints solo de administrador como DELETE /users/{id}. Requiere @EnableMethodSecurity en la clase de configuración de seguridad.

---

**¿Por qué guardar el secreto JWT en application.properties o una variable de entorno en lugar de hardcodearlo?**

Un secreto hardcodeado en el código fuente se sube a git y es visible para cualquiera con acceso al repositorio. application.properties no se sube en producción — el secreto viene de una variable de entorno configurada en el servidor. Si el secreto se filtra, cualquier JWT firmado con él puede ser verificado por atacantes. En el proyecto 07 uso @Value("${app.jwt.secret}") para leerlo del fichero de configuración.

Respuesta de alerta: "Lo puse en el código porque es más fácil." Eso es una vulnerabilidad de seguridad — el entrevistador está comprobando si lo sabes.

---

**Tu filtro JWT rechaza tokens válidos — ¿qué compruebas primero?**

Compruebo tres cosas: la clave secreta (¿es la misma que se usó para firmar el token?), la expiración del token (¿ha caducado?) y el formato de la cabecera Authorization (debe ser exactamente "Bearer token" con un espacio). También reviso la configuración de SecurityFilterChain para confirmar que el endpoint no está marcado accidentalmente como que requiere un rol que el usuario no tiene.

---

**¿Qué es UserDetailsService y por qué lo implementas?**

UserDetailsService es una interfaz de Spring Security con un solo método — loadUserByUsername(String username). La implementas para decirle a Spring Security cómo encontrar un usuario en tu base de datos durante la autenticación. En el proyecto 07 UserDetailsServiceImpl llama al UserRepository, carga el usuario por email y devuelve un objeto UserDetails con el email, la contraseña hasheada y los roles. Sin esto, Spring Security no sabe cómo verificar las credenciales.

> **Junior tip:** you do not call UserDetailsService yourself — Spring Security calls it during login. Your job is to implement it so Spring knows where to look for the user.
> **Consejo de entrevista:** no llamas a UserDetailsService tú mismo — Spring Security lo llama durante el login. Tu trabajo es implementarlo para que Spring sepa dónde buscar al usuario.

---

**¿Qué es BCryptPasswordEncoder y por qué no almacenas nunca una contraseña en texto plano?**

BCryptPasswordEncoder hashea las contraseñas usando el algoritmo BCrypt antes de almacenarlas. Una contraseña en texto plano en la base de datos es una vulnerabilidad de seguridad crítica — si la base de datos se compromete, todas las cuentas quedan expuestas inmediatamente. Con BCrypt, cada contraseña produce un hash único que no puede revertirse. En el proyecto 07 defino un bean PasswordEncoder y lo uso en el servicio de registro para hashear la contraseña antes de guardarla.

Respuesta de alerta: "Guardo la contraseña directamente — es solo un proyecto de portfolio." Demuestra una mala comprensión de la seguridad básica — los entrevistadores filtran por esto.

---

**¿Qué significa gestión de sesión sin estado (stateless) en SecurityFilterChain?**

Sin estado significa que Spring Security no crea ni usa una sesión HTTP para recordar usuarios autenticados entre peticiones. Cada petición debe llevar su propio token JWT y validarse de forma independiente. La configuración es SessionCreationPolicy.STATELESS. Sin esto, Spring crea sesiones por defecto, lo que entra en conflicto con la autenticación JWT y consume memoria del servidor innecesariamente.

> **Junior tip:** stateless + JWT always go together. If you use JWT, you set stateless session management. If you forget this, Spring creates sessions unnecessarily and auth behaviour becomes unpredictable.
> **Consejo de entrevista:** stateless + JWT siempre van juntos. Si usas JWT, configuras gestión de sesión sin estado. Si lo olvidas, Spring crea sesiones innecesariamente y el comportamiento de autenticación se vuelve impredecible.

---

## Gestión de excepciones

**¿Qué es @ControllerAdvice y cuándo lo usas?**

@ControllerAdvice es un manejador global de excepciones. Defines métodos @ExceptionHandler dentro de él y Spring los llama automáticamente cuando esas excepciones se lanzan desde cualquier controlador. En el proyecto 07 tengo un GlobalExceptionHandler que mapea ResourceNotFoundException a 404, IllegalArgumentException a 400 y un manejador fallback de Exception a 500.

> **Junior tip:** the selling point is "one central place" — without @ControllerAdvice you need try/catch in every controller method.
> **Consejo de entrevista:** el punto clave es "un único lugar central" — sin @ControllerAdvice necesitarías try/catch en cada método del controlador.

---

**¿Por qué extender RuntimeException para excepciones personalizadas en Spring Boot en lugar de extender Exception?**

RuntimeException es no comprobada — los llamadores no necesitan declararla con throws. Las excepciones comprobadas (que extienden Exception) obligan a cada método en la pila de llamadas a gestionarlas o re-declararlas, lo que contamina el código del servicio con gestión de errores para problemas que no puede resolver. La convención en Spring Boot es: lanza excepciones no comprobadas desde el servicio, captúralas globalmente con @ControllerAdvice.

---

**Un compañero junior tiene un bloque try/catch en cada método del controlador — ¿qué le dices?**

Le explicaría que Spring Boot tiene @ControllerAdvice para esto — defines toda la gestión de errores en una clase y Spring enruta las excepciones allí automáticamente. Elimina la duplicación, mantiene los controladores enfocados en el camino feliz y hace que las respuestas de error sean consistentes en toda la API. Le mostraría el GlobalExceptionHandler del proyecto 07 como ejemplo.

---

## Testing

**¿Qué es @SpringBootTest y cuándo lo usas?**

@SpringBootTest carga el contexto de aplicación completo — todos los beans, la auto-configuración y la conexión a base de datos. Úsalo para tests de integración que verifican el flujo completo desde la petición HTTP hasta la escritura en base de datos. Es lento, así que úsalo solo para los caminos críticos, no para cada método.

> **Junior tip:** reserve @SpringBootTest for integration tests. For testing a single class in isolation, use plain JUnit + Mockito without loading Spring at all.
> **Consejo de entrevista:** reserva @SpringBootTest para tests de integración. Para probar una clase aislada, usa JUnit + Mockito directamente sin cargar Spring.

---

**¿Qué es @WebMvcTest y qué problema resuelve?**

@WebMvcTest carga solo la capa web — controladores, filtros y @ControllerAdvice. Los servicios y repositorios no se cargan; los simulas con @MockBean. Los tests se ejecutan mucho más rápido que con @SpringBootTest y se centran exclusivamente en la capa HTTP: códigos de estado correctos, mapeo de rutas y forma de la respuesta JSON. En el proyecto 07 uso @WebMvcTest para probar TransactionController sin base de datos real.

---

**¿Qué es Mockito y cómo usas @MockBean en un test de Spring Boot?**

Mockito crea implementaciones falsas de tus dependencias. when(service.getAll()).thenReturn(List.of(transaction)) le dice a Mockito qué devolver cuando se llama a ese método. @MockBean reemplaza el bean real en el contexto Spring por un mock de Mockito, permitiéndote probar el controlador de forma aislada sin servicio ni base de datos reales.

---

**¿Por qué usar @WebMvcTest en lugar de @SpringBootTest para probar un controlador?**

@WebMvcTest es más rápido (carga solo la capa web), más enfocado (los fallos apuntan directamente al controlador o filtro) y no requiere una base de datos en ejecución. Si un test de controlador falla con @WebMvcTest, el problema está en la capa HTTP. @SpringBootTest también fallaría o pasaría por razones del servicio y el repositorio, dificultando localizar el error. Menos alcance significa retroalimentación más rápida.

Respuesta de alerta: "Siempre uso @SpringBootTest porque prueba todo." Demuestra que no piensas en la velocidad de los tests ni en el aislamiento.

---

**Tu @WebMvcTest pasa pero el mismo flujo falla en el test de integración completo — ¿qué te dice eso?**

La capa HTTP es correcta — el controlador, el mapeo de rutas y el formato de respuesta están bien. El problema está en la capa de servicio o de repositorio, o en la interacción entre ellas. El mock en el test unitario ocultó el error real. Por eso se necesitan tanto tests unitarios como tests de integración — detectan tipos diferentes de errores.

---

**¿Qué es @DataJpaTest y cuándo lo usarías?**

@DataJpaTest carga solo la capa de persistencia — entidades JPA, repositorios y una base de datos H2 en memoria por defecto. No carga controladores ni servicios. Úsalo para probar métodos de repositorio y derived queries de forma aislada — por ejemplo, verificar que findByUserAndDateBetween devuelve los resultados correctos para un rango de fechas. Es más rápido que @SpringBootTest porque carga mucho menos de la aplicación.

> **Junior tip:** test each layer in isolation — @WebMvcTest for controllers, @DataJpaTest for repositories, @SpringBootTest for full integration. Each one catches a different kind of bug.
> **Consejo de entrevista:** prueba cada capa de forma aislada — @WebMvcTest para controladores, @DataJpaTest para repositorios, @SpringBootTest para la integración completa. Cada uno detecta un tipo diferente de error.
