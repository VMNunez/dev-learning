# Spring Boot — Interview Questions

## Spring Boot basics

**What is Spring Boot and why do companies use it instead of plain Spring?**

Spring Boot is a framework built on top of Spring that removes manual configuration — it auto-configures the application based on the dependencies in the pom.xml and includes an embedded Tomcat server. Companies use it because a new project is ready to run in minutes instead of days of XML setup.

> **Junior tip:** the two key phrases are "auto-configuration" and "embedded server" — those are what distinguish Spring Boot from plain Spring.
> **Consejo de entrevista:** las dos frases clave son "auto-configuración" y "servidor embebido" — eso es lo que distingue Spring Boot de Spring puro.

---

**What does @SpringBootApplication do?**

It combines three annotations: @Configuration (marks the class as a source of Spring beans), @EnableAutoConfiguration (activates auto-configuration based on the classpath), and @ComponentScan (scans the current package and sub-packages for components). Every Spring Boot application has exactly one class with this annotation — it is the entry point.

> **Junior tip:** knowing the three annotations it combines signals real understanding — most candidates just say "it starts the app."
> **Consejo de entrevista:** conocer las tres anotaciones que combina demuestra comprensión real — la mayoría de candidatos solo dice "arranca la aplicación."

---

**What is auto-configuration in Spring Boot?**

Auto-configuration reads the classpath and configures beans automatically. If spring-boot-starter-data-jpa is in the pom.xml, Spring Boot creates the DataSource, EntityManagerFactory, and transaction manager without any extra code from you. You can override any auto-configured bean by defining your own.

> **Junior tip:** give a concrete example — "if JPA is on the classpath, Spring Boot configures the database connection automatically." That is clearer than an abstract definition.
> **Consejo de entrevista:** da un ejemplo concreto — "si JPA está en el classpath, Spring Boot configura la conexión a la base de datos automáticamente."

---

**What is application.properties used for?**

It is the central configuration file — database URL, server port, JWT secret, Hibernate DDL mode. In project 07 I store the PostgreSQL connection, server port 8080, and JWT configuration there. In production, secrets are replaced with environment variables so they are not committed to the git repository.

> **Junior tip:** always mention that secrets should come from environment variables in production — it shows security awareness without needing to go deep into the topic.
> **Consejo de entrevista:** menciona siempre que los secretos deben venir de variables de entorno en producción — demuestra conciencia de seguridad sin profundizar en el tema.

---

**Why did you choose Spring Boot instead of plain Spring for project 07?**

Plain Spring requires XML configuration, explicit bean declarations, and a separately installed server. Spring Boot eliminates all of that — I could start writing REST endpoints immediately after generating the project on start.spring.io. For a portfolio project built to demonstrate full-stack skills, removing the setup ceremony is the right decision.

Red flag answer: "Because the tutorial used Spring Boot." That shows you followed instructions without understanding the decision.

---

**Why use constructor injection instead of @Autowired on a field?**

Three reasons: the field can be `final` (cannot be changed after injection), the dependencies are visible in the constructor signature (you see exactly what the class needs), and the class is easy to unit test (pass a mock in the constructor without needing a Spring context at all). Since Spring Framework 4.3, if a class has a single constructor, @Autowired is not even required.

Red flag answer: "I always use @Autowired on fields because it is simpler." That shows you do not think about testability.

---

**The app fails to start with "Failed to configure a DataSource" — what do you check first?**

I check application.properties — the database URL, username, and password. If those are correct, I check if PostgreSQL is running and the database exists. The most common cause is a missing or incorrect spring.datasource.url. If spring-boot-starter-data-jpa is in the pom.xml but no DataSource is configured, Spring Boot cannot start.

---

**What is @Transactional and where do you put it?**

@Transactional wraps a service method in a database transaction — either all operations succeed together, or none do and everything is rolled back. It goes on service methods, not on controllers or repositories. Repositories already manage their own transactions. In project 07 I use @Transactional on service methods that do more than one database write, so a partial failure does not leave the database in an inconsistent state.

> **Junior tip:** the rule is simple — put @Transactional on service methods that do multiple writes. One write — usually not needed. Multiple writes — always needed.
> **Consejo de entrevista:** la regla es simple — pon @Transactional en métodos de servicio que hacen múltiples escrituras. Una escritura — normalmente no hace falta. Múltiples escrituras — siempre necesario.

Red flag answer: "I put it on the controller." That shows a misunderstanding of where business logic and transactions belong.

---

**What happens when you access a LAZY relationship outside a transaction?**

You get a LazyInitializationException — the Hibernate session is already closed, so it cannot execute the extra query to load the relationship. The correct fix is to convert the entity to a DTO inside the @Transactional service method, while the session is still open — not to access lazy fields in the controller after the session has closed.

---

## REST controllers

**What is the difference between @Controller and @RestController?**

@Controller is for applications that return HTML views. @RestController combines @Controller and @ResponseBody — every method returns data directly as JSON without a view layer. In project 07 I use @RestController for all endpoints because the backend is a pure REST API consumed by Angular.

> **Junior tip:** if you are building a REST API — which you are — you always use @RestController. You would never use plain @Controller in a backend-only project.
> **Consejo de entrevista:** si construyes una API REST — que es tu caso — siempre usas @RestController. Nunca usarías @Controller a secas en un proyecto solo backend.

---

**Why do you return ResponseEntity instead of the object directly?**

ResponseEntity lets you set the HTTP status code explicitly. Returning just an object always gives 200. With ResponseEntity I can return 201 when something is created, 204 when a delete succeeds, or 404 when something is not found. In project 07 every controller method returns ResponseEntity so the Angular frontend knows exactly what happened.

Red flag answer: "I just return the object — Spring handles the rest." That shows you do not control the HTTP layer.

---

**What is the difference between @PathVariable and @RequestParam?**

@PathVariable reads a value from the URL path: GET /transactions/{id} — the id is part of the URL structure. @RequestParam reads from query parameters: GET /transactions?category=food — it comes after the ?. The convention: @PathVariable for resource identifiers (mandatory), @RequestParam for optional filters.

> **Junior tip:** a quick memory trick — path variable is mandatory (no id, no route); request param is usually optional (it comes after the ?).
> **Consejo de entrevista:** truco de memoria — la variable de path es obligatoria (sin id no hay ruta); el request param suele ser opcional (viene después del ?).

---

**What is @RequestBody and how does it work?**

@RequestBody tells Spring to read the HTTP request body and convert it from JSON to a Java object using Jackson, the JSON library Spring Boot includes automatically. The JSON field names must match the Java field names. In project 07 POST /transactions receives a TransactionCreateDTO via @RequestBody.

> **Junior tip:** you do not configure Jackson — it works automatically as long as your DTO is a record or has a no-argument constructor.
> **Consejo de entrevista:** no configuras Jackson — funciona automáticamente siempre que tu DTO sea un record o tenga un constructor sin argumentos.

---

**What is the layered architecture in Spring Boot and why does it matter?**

The three layers are controller (handles HTTP), service (all business logic), and repository (database access). Each layer only calls the layer directly below it. In project 07 the TransactionController never touches the repository — if the business logic changes, I only change the service. This is separation of concerns.

> **Junior tip:** name the three layers and say "separation of concerns" — that phrase is what most interviewers want to hear.
> **Consejo de entrevista:** nombra las tres capas y di "separación de responsabilidades" — esa frase es lo que la mayoría de entrevistadores quieren escuchar.

Red flag answer: "I put everything in the controller because it is simpler." That is a red flag for any consultancy.

---

**Why use @Service and @Repository instead of @Component for everything?**

All three register the class as a Spring bean, but the semantic difference matters. @Repository also translates JPA exceptions into Spring's DataAccessException hierarchy so the service never needs to handle Hibernate-specific errors. Using the right annotation makes the code self-documenting — any developer can identify the layer immediately.

---

**Why use DTOs instead of returning JPA entities directly from the controller?**

Entities are tied to the database schema — they can expose fields you should not send to the client (password hash, internal foreign keys, lazy-loaded collections). DTOs let you control exactly what the API returns. In project 07 the Transaction entity has a user field with the full User object — the TransactionDTO exposes only the fields the Angular frontend actually needs.

Red flag answer: "I return entities because it is less code." Entities can cause serialization errors on lazy-loaded relationships and expose database internals to clients.

---

**A POST endpoint always returns 200 instead of 201 — what did you forget?**

I forgot to return ResponseEntity.status(201).body(created). Returning the object directly or using ResponseEntity.ok() always gives 200. The fix is explicit in the controller's return statement.

---

**What is CORS and why does your Angular app get a CORS error when calling the Spring Boot API?**

CORS (Cross-Origin Resource Sharing) is a browser security policy that blocks JavaScript from calling a server on a different origin. The Angular dev server runs on localhost:4200 and the Spring Boot API runs on localhost:8080 — different ports mean different origins. The fix is to configure Spring Boot to allow requests from localhost:4200 using a CorsConfigurationSource bean in the SecurityFilterChain configuration.

> **Junior tip:** the CORS error only happens in the browser — it is not a backend bug. The browser blocks the request before it even reaches Spring Boot. The fix is always on the server side.
> **Consejo de entrevista:** el error CORS solo ocurre en el navegador — no es un fallo del backend. El navegador bloquea la petición antes de que llegue a Spring Boot. La solución siempre es en el servidor.

Red flag answer: "I added @CrossOrigin to every controller." That works but it is not the correct approach in a production project — CORS should be configured centrally in the SecurityFilterChain.

---

**What Bean Validation annotations do you use on request DTOs and what does @Valid trigger?**

Common annotations: @NotNull (value cannot be null), @NotBlank (string cannot be null or empty — preferred for strings), @Size(min, max) (length), @Min/@Max (number range), @Email (valid email format). @Valid on a @RequestBody parameter tells Spring to run all validations before the controller method executes — if any constraint fails, Spring throws MethodArgumentNotValidException and @ControllerAdvice maps it to 400.

> **Junior tip:** use @NotBlank for strings — it also rejects empty strings and whitespace. @NotNull is for non-string types. The pair @Valid + @ControllerAdvice handles all invalid input centrally, so controllers never need manual if-checks.
> **Consejo de entrevista:** usa @NotBlank para strings — también rechaza strings vacíos y espacios. @NotNull es para otros tipos. El par @Valid + @ControllerAdvice gestiona toda la entrada inválida de forma centralizada.

---

## Spring Data JPA

**What is the difference between JPA and Hibernate?**

JPA (Jakarta Persistence API) is the specification — it defines the standard annotations (@Entity, @Id, @ManyToOne) and interfaces. Hibernate is the most common implementation — it translates those annotations into SQL. Spring Boot uses Hibernate by default. You write against the JPA spec; Hibernate executes the queries.

> **Junior tip:** "JPA is the spec, Hibernate is the implementation" — one sentence that satisfies most interviewers.
> **Consejo de entrevista:** "JPA es la especificación, Hibernate es la implementación" — una frase que satisface a la mayoría de entrevistadores.

---

**What does JpaRepository give you for free?**

Extending JpaRepository<Transaction, Long> gives you save(), findById(), findAll(), findAllById(), deleteById(), count(), and existsById() without writing any code. Spring Data JPA generates the implementation at startup. You only write additional methods when the built-in ones are not enough.

> **Junior tip:** "Spring Data generates the implementation automatically" is the key phrase — it shows you understand the pattern, not just the syntax.
> **Consejo de entrevista:** "Spring Data genera la implementación automáticamente" es la frase clave — demuestra que entiendes el patrón, no solo la sintaxis.

---

**What is a derived query method in Spring Data JPA?**

A derived query method is a method you declare in the repository whose name Spring Data JPA parses to generate the SQL automatically. findByCategory(String category) generates SELECT * FROM transactions WHERE category = ?. You can combine conditions with And/Or, add ordering with OrderBy, and count with countBy. In project 07 I use findByUserAndDateBetween to get a user's transactions in a date range.

---

**When is a derived query method not enough and you need @Query?**

When the logic cannot be expressed through method naming — for example, joining multiple tables, using aggregate functions, or loading a related entity with JOIN FETCH to avoid the N+1 problem. In project 07 I use @Query when the derived method name would become unreadably long or when I need to control exactly which relationships are loaded.

> **Junior tip:** derived methods handle the 80% case. When you hit something complex, @Query is the answer. Knowing both and when to use each one shows you understand the tradeoffs.
> **Consejo de entrevista:** los métodos derivados cubren el 80% de los casos. Cuando necesitas algo complejo, usa @Query. Conocer ambos y cuándo usarlos demuestra que entiendes los compromisos.

---

**How does save() know whether to insert or update?**

save() checks the @Id field. If it is null, JPA inserts a new row. If it has an existing value, JPA merges (updates) the existing row. You do not need separate insert() and update() methods.

---

**What is the difference between @OneToMany and @ManyToOne, and how do you decide which goes where?**

@ManyToOne goes on the entity whose database table has the foreign key column. In project 07 the transactions table has a user_id column, so the Transaction entity has @ManyToOne pointing to User. @OneToMany is the other side — User has @OneToMany(mappedBy = "user") pointing to its transactions. The foreign key column in the database determines where @ManyToOne goes.

> **Junior tip:** think from the database side — where is the foreign key column? That table's entity gets @ManyToOne.
> **Consejo de entrevista:** piensa desde la base de datos — ¿dónde está la columna de clave foránea? La entidad de esa tabla es la que lleva @ManyToOne.

---

**Why do you use FetchType.LAZY instead of FetchType.EAGER?**

LAZY loads the related entity only when you access it in code. EAGER loads it immediately with the parent, even when you do not need it. EAGER can trigger unexpected extra queries and load large object graphs. In project 07 I use LAZY on all relationships — when I query transactions, I do not automatically load the full User object with every row.

Red flag answer: "I always use EAGER because it is simpler." That shows no awareness of database performance.

---

**What is the N+1 problem?**

The N+1 problem happens when you load N entities and then access a lazy relationship on each one — that triggers N additional queries. Loading 100 transactions and calling transaction.getUser().getName() in a loop sends 100 extra SELECT queries to the database. The fix is JOIN FETCH in a @Query to load both entities in one query instead of N+1.

---

**What annotations does a JPA entity need at minimum?**

@Entity on the class, @Id on the primary key field, and @GeneratedValue(strategy = GenerationType.IDENTITY) to let the database auto-increment the id using a SERIAL column in PostgreSQL. Everything else (@Table, @Column) is optional configuration.

> **Junior tip:** if you forget @Entity, Spring Data will not recognize the class as a table and will fail at startup with a clear error.
> **Consejo de entrevista:** si olvidas @Entity, Spring Data no reconocerá la clase como tabla y fallará al arrancar con un error claro.

---

**Your app logs hundreds of SELECT queries for a single list request — what happened?**

This is the N+1 problem. The query loads entities and then each access to a lazy relationship triggers a separate SELECT. I would identify which relationship is LAZY, then fix it with JOIN FETCH in a @Query on the repository method to load everything in one query.

---

**What is Pageable in Spring Data JPA and when would you use it?**

Pageable lets you load a slice of data instead of the full table — you pass a page number and page size, and the repository returns a Page<T> with the results, total count, and metadata. In project 07 I add pagination to GET /transactions so the Angular frontend can load 20 transactions at a time instead of the full history. The repository method signature becomes Page<Transaction> findAll(Pageable pageable).

> **Junior tip:** any real app with a growing dataset needs pagination. "We load everything with findAll()" is a performance red flag in any interview. Mention Pageable proactively when talking about list endpoints.
> **Consejo de entrevista:** cualquier app real con datos crecientes necesita paginación. "Cargamos todo con findAll()" es una señal de alerta en cualquier entrevista.

Red flag answer: "I just call findAll() — the list is not that long yet." That shows no awareness of how data grows in production.

---

## Security and JWT

**How does JWT authentication work in Spring Boot at a high level?**

The user sends credentials to POST /auth/login. The service verifies them and returns a JWT token. On every subsequent request the Angular frontend sends the token in the Authorization header as "Bearer token". A filter extending OncePerRequestFilter intercepts each request, validates the token, extracts the user, and sets the SecurityContext. Spring Security then allows or denies access based on the SecurityFilterChain rules.

> **Junior tip:** draw the flow in your head before answering — "login → get token → send token on every request → filter validates → SecurityContext set." That is the whole pattern.
> **Consejo de entrevista:** visualiza el flujo antes de responder — "login → obtener token → enviar token en cada petición → el filtro valida → SecurityContext establecido."

---

**What is SecurityFilterChain and what do you configure in it?**

SecurityFilterChain defines the security rules for the application — which endpoints are public, which require authentication, CORS settings, CSRF configuration, and which custom filters to add. In project 07 I configure POST /auth/login and POST /auth/register as public and all other endpoints as authenticated. I also add the JWT filter before Spring's default authentication filter.

> **Junior tip:** think of SecurityFilterChain as the one place where all security rules are defined — any endpoint not explicitly permitted is protected by default.
> **Consejo de entrevista:** piensa en SecurityFilterChain como el único lugar donde se definen todas las reglas de seguridad — cualquier endpoint no listado está protegido por defecto.

---

**What is the difference between authentication and authorization?**

Authentication is proving who you are — logging in with email and password. Authorization is controlling what you can do — only ADMIN users can delete other users' data. Spring Security handles both: JWT authentication happens in the filter; authorization is enforced with roles and @PreAuthorize.

> **Junior tip:** simple summary — authentication: are you who you say you are? Authorization: are you allowed to do this?
> **Consejo de entrevista:** resumen simple — autenticación: ¿eres quien dices ser? Autorización: ¿tienes permiso para hacer esto?

---

**Why do you disable CSRF in a REST API?**

CSRF protection is designed for server-rendered HTML apps that use cookies for sessions. A REST API with JWT does not use cookies — each request carries the token in a header. Enabling CSRF would reject all non-GET requests without a matching CSRF token, breaking the API. So you disable it for stateless, token-based APIs.

Red flag answer: "I disabled CSRF because it was in the tutorial." You need to understand why — interviewers ask this specifically to test security awareness.

---

**What is @PreAuthorize and when would you use it?**

@PreAuthorize adds method-level authorization. @PreAuthorize("hasRole('ADMIN')") blocks non-admin users before the method runs. In project 07 I use it on admin-only endpoints like DELETE /users/{id}. It requires @EnableMethodSecurity on the security configuration class.

---

**Why store the JWT secret in application.properties or an environment variable instead of hardcoding it?**

A secret hardcoded in the source code is committed to git and visible to anyone with repository access. application.properties is not committed in production — the secret comes from an environment variable set on the server. If the secret leaks, any JWT signed with it can be verified by attackers. In project 07 I use @Value("${app.jwt.secret}") to read it from the config file.

Red flag answer: "I put it in the code because it is easier." That is a security vulnerability — the interviewer is testing whether you know this.

---

**Your JWT filter is rejecting valid tokens — what do you check first?**

I check three things: the secret key (is it the same one used to sign the token?), the token expiration (has it expired?), and the Authorization header format (must be exactly "Bearer token" with a space). I also check the SecurityFilterChain configuration to confirm the endpoint is not accidentally marked as requiring a role the user does not have.

---

**What is UserDetailsService and why do you implement it?**

UserDetailsService is a Spring Security interface with one method — loadUserByUsername(String username). You implement it to tell Spring Security how to find a user in your database during authentication. In project 07 UserDetailsServiceImpl calls the UserRepository, loads the user by email, and returns a UserDetails object with the email, hashed password, and roles. Without this, Spring Security does not know how to verify credentials.

> **Junior tip:** you do not call UserDetailsService yourself — Spring Security calls it during login. Your job is to implement it so Spring knows where to look for the user.
> **Consejo de entrevista:** no llamas a UserDetailsService tú mismo — Spring Security lo llama durante el login. Tu trabajo es implementarlo para que Spring sepa dónde buscar al usuario.

---

**What is BCryptPasswordEncoder and why do you never store a plain text password?**

BCryptPasswordEncoder hashes passwords using the BCrypt algorithm before storing them. A plain text password in the database is a critical security vulnerability — if the database is compromised, every account is exposed immediately. With BCrypt, each password produces a unique hash that cannot be reversed. In project 07 I define a PasswordEncoder bean and use it in the registration service to hash the password before saving.

Red flag answer: "I store the password directly — it is just a portfolio project." That shows a misunderstanding of basic security — interviewers filter on this.

---

**What does stateless session management mean in the SecurityFilterChain?**

Stateless means Spring Security does not create or use an HTTP session to remember authenticated users between requests. Each request must carry its own JWT token and be validated independently. The configuration is SessionCreationPolicy.STATELESS. Without this, Spring creates sessions by default, which conflicts with JWT auth and wastes server memory.

> **Junior tip:** stateless + JWT always go together. If you use JWT, you set stateless session management. If you forget this, Spring creates sessions unnecessarily and auth behaviour becomes unpredictable.
> **Consejo de entrevista:** stateless + JWT siempre van juntos. Si usas JWT, configuras gestión de sesión sin estado. Si lo olvidas, Spring crea sesiones innecesariamente.

---

## Exception handling

**What is @ControllerAdvice and when do you use it?**

@ControllerAdvice is a global exception handler. You define @ExceptionHandler methods inside it and Spring calls them automatically when those exceptions are thrown from any controller. In project 07 I have one GlobalExceptionHandler that maps ResourceNotFoundException to 404, IllegalArgumentException to 400, and a fallback Exception handler to 500.

> **Junior tip:** the selling point is "one central place" — without @ControllerAdvice you need try/catch in every controller method.
> **Consejo de entrevista:** el punto clave es "un único lugar central" — sin @ControllerAdvice necesitarías try/catch en cada método del controlador.

---

**Why extend RuntimeException for custom exceptions in Spring Boot instead of extending Exception?**

RuntimeException is unchecked — callers do not need to declare it with throws. Checked exceptions (extending Exception) force every method in the call stack to either handle or re-declare the exception, which clutters service code with error handling for problems it cannot fix. Spring Boot's convention is: throw unchecked exceptions from the service, catch them globally with @ControllerAdvice.

---

**A junior colleague has a try/catch block in every controller method — what do you tell them?**

I would explain that Spring Boot has @ControllerAdvice for this — you define all error handling in one class and Spring routes exceptions there automatically. It removes duplication, keeps controllers focused on the happy path, and makes error responses consistent across the entire API. I would show them the GlobalExceptionHandler from project 07 as an example.

---

## Testing

**What is @SpringBootTest and when do you use it?**

@SpringBootTest loads the full application context — all beans, auto-configuration, and the database connection. Use it for integration tests that verify the full flow from HTTP request to database write. It is slow, so use it only for the critical paths — not for every method.

> **Junior tip:** reserve @SpringBootTest for integration tests. For testing a single class in isolation, use plain JUnit + Mockito without loading Spring at all.
> **Consejo de entrevista:** reserva @SpringBootTest para tests de integración. Para probar una clase aislada, usa JUnit + Mockito directamente sin cargar Spring.

---

**What is @WebMvcTest and what problem does it solve?**

@WebMvcTest loads only the web layer — controllers, filters, and @ControllerAdvice. Services and repositories are not loaded; you mock them with @MockBean. Tests run much faster than @SpringBootTest and focus exclusively on the HTTP layer: correct status codes, request mapping, and JSON response shape. In project 07 I use @WebMvcTest to test TransactionController without a real database.

---

**What is Mockito and how do you use @MockBean in a Spring Boot test?**

Mockito creates fake implementations of your dependencies. when(service.getAll()).thenReturn(List.of(transaction)) tells Mockito what to return when that method is called. @MockBean replaces the real bean in the Spring context with a Mockito mock, letting you test the controller in isolation without a real service or database connection.

---

**Why use @WebMvcTest instead of @SpringBootTest for testing a controller?**

@WebMvcTest is faster (loads only the web layer), more focused (failures point directly to the controller or filter), and does not require a running database. If a controller test fails with @WebMvcTest, the problem is in the HTTP layer. @SpringBootTest would also pass or fail for reasons inside the service and repository, making it harder to locate the bug. Smaller scope means faster feedback.

Red flag answer: "I always use @SpringBootTest because it tests everything." That shows you do not think about test speed or isolation.

---

**Your @WebMvcTest passes but the same flow fails in the full integration test — what does that tell you?**

The HTTP layer is correct — the controller, request mapping, and response format are fine. The problem is in the service or repository layer, or in the interaction between layers. The mock in the unit test hid the real bug. This is exactly why both unit tests and integration tests are needed — they catch different kinds of bugs.

---

**What is @DataJpaTest and when would you use it?**

@DataJpaTest loads only the persistence layer — JPA entities, repositories, and an in-memory H2 database by default. It does not load controllers or services. Use it to test repository methods and derived queries in isolation — for example, verifying that findByUserAndDateBetween returns the correct results for a given date range. It is faster than @SpringBootTest because it loads much less of the application.

> **Junior tip:** test each layer in isolation — @WebMvcTest for controllers, @DataJpaTest for repositories, @SpringBootTest for full integration. Each one catches a different kind of bug.
> **Consejo de entrevista:** prueba cada capa de forma aislada — @WebMvcTest para controladores, @DataJpaTest para repositorios, @SpringBootTest para la integración completa.
