# Minimum Coverage — Spring Boot

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real example from the TimeTrack project.

## Project setup

- `@SpringBootApplication` — combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`; interviewers ask "what does this annotation replace in a traditional Spring app?" and "why must the class be in the root package?"
- Auto-configuration mechanism — `@EnableAutoConfiguration` inspects the classpath and conditionally creates beans (`@ConditionalOnClass`, `@ConditionalOnMissingBean`), which is why adding a starter "just works" with no XML; interviewers ask "how does Spring Boot know how to configure your `DataSource`?" and expect the classpath-scanning + conditional-beans answer, not just "it is automatic"
- Spring Boot starters — a starter (`spring-boot-starter-web`, `-data-jpa`, `-security`) is a curated dependency bundle that pulls in a whole layer's libraries with compatible versions in one line; interviewers ask "what is a starter and what does `spring-boot-starter-web` actually bring in?" — it separates someone who added dependencies from someone who understands the build
- Embedded server (Tomcat) — Spring Boot packages an embedded servlet container inside the fat jar, so `java -jar app.jar` starts Tomcat on port 8080 with no external application server and no WAR to deploy; interviewers ask "how does your app serve HTTP without a Tomcat installed?" — a classic Spring-Boot-vs-classic-Spring differentiator
- `application.properties` — where datasource, JPA settings, and JWT config go; interviewers ask how you keep credentials out of source control (environment variables with `${VAR_NAME}` syntax; app fails at startup if the variable is missing — better than a silent null at runtime)
- Profiles: `application-dev.properties`, `spring.profiles.active` — separating config per environment; asked in any interview about real-world deployment
- Maven: `pom.xml` structure, adding a dependency, `mvn clean install` — how the project is built and how libraries are pulled in; interviewers ask what `spring-boot-starter-parent` does (manages all dependency versions via a BOM so you do not write version tags)
- Lombok `@Data` — generates getters, setters, `equals()`, `hashCode()`, and `toString()`; interviewers ask "what does `@Data` generate?" — a standard question when reviewing entity code
- Lombok `@NoArgsConstructor` — generates an empty constructor required by JPA to instantiate entities when reading from the database; omitting it causes a runtime error on startup
- Lombok `@AllArgsConstructor` vs `@RequiredArgsConstructor` — `@AllArgsConstructor` takes every field; `@RequiredArgsConstructor` takes only `final` and `@NonNull` fields; interviewers ask which to use for a service class with constructor injection (`@RequiredArgsConstructor` — it picks up only the `private final` dependencies)
- `@Slf4j` — Lombok annotation that generates a `log` field; `log.info()`, `log.warn()`, `log.error()`; seen in every production codebase and asked about in code reviews
- `data.sql` — Spring Boot runs this file on startup to seed the database; used in TimeTrack to create the first manager account; interviewers ask "how did you create the first user if there is no register endpoint?"

## REST controllers

- Layered architecture: controller → service → repository — the controller handles HTTP and DTO mapping, the service holds business logic and the transaction boundary, the repository handles persistence; interviewers ask "why have a service layer instead of calling the repository from the controller?" — separation of concerns, testability, and one place for `@Transactional` and business rules (the general layered/service-layer pattern is owned by the Architecture coverage; this item is its Spring Boot framing)
- `@RestController` — combines `@Controller` and `@ResponseBody`; every return value is serialised to JSON by Jackson automatically; interviewers ask "what is the difference between `@Controller` and `@RestController`?" — `@Controller` is for server-rendered HTML; always use `@RestController` for a REST API
- `@RequestMapping` — sets the base URL path for all methods in the class; combined with method-level annotations (`@GetMapping`, `@PostMapping`) to form the full URL
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping` — method-level annotations for each HTTP verb; `@PatchMapping` is used for partial updates and state transitions (submit, approve, reject); tested in every technical screening
- `@PathVariable` — reads a variable from the URL path (`/{id}`); the name inside `{}` must match the parameter name or be declared explicitly with `@PathVariable("id")`; interviewers ask "what happens if the names don't match?"
- `@RequestBody` — reads the JSON body and converts it to a Java object via Jackson; requires the client to send `Content-Type: application/json`; used with `@Valid` to trigger validation
- `@RequestParam` — reads query string parameters (`?month=2025-05`); can be `required = false` with a `defaultValue`; used for optional filters, not for required resource identifiers
- `ResponseEntity<T>` — the correct way to control the HTTP status code; interviewers ask "why not just return the object directly?" — because the status code is part of the API contract and without it every method returns 200
- HTTP status conventions: 200 GET/PUT success, 201 POST success, 204 DELETE success, 400 validation error, 401 missing or invalid token, 403 authenticated but not allowed, 404 not found, 409 duplicate — tested in every technical interview
- Jackson serialisation — Spring Boot uses Jackson automatically to convert Java objects to JSON on the way out and JSON to Java on the way in; interviewers ask "how does Spring Boot convert your return value to JSON?" — Jackson is the answer; it reads public getters or Lombok-generated ones
- `DispatcherServlet` and the request lifecycle — the single front controller Spring Boot registers to receive every HTTP request; it consults handler mappings to find the `@RequestMapping` method matching the URL and verb, invokes it, and runs the return value through Jackson; interviewers open with "walk me through how a request reaches your controller method" — knowing the annotations but not the servlet that routes to them exposes surface-level knowledge
- Request DTO vs Response DTO — why you never expose the JPA entity directly over the API (couples the API to the DB schema, risks leaking sensitive fields like password hash, over-fetches data the client does not need); interviewers always ask this
- `toResponse()` mapping pattern — entity-to-DTO conversion extracted to one private helper in the service layer; keeps controllers free of mapping logic and avoids repeating the same field assignments in every method
- `@JsonIgnore` — prevents a field from appearing in the JSON response; used on the `password` field so the API never returns hashed passwords; interviewers ask "why doesn't your API expose the password?"

## Dependency injection and beans

- Inversion of Control (IoC) and dependency injection — the Spring container creates your objects and wires their dependencies instead of you calling `new`; interviewers open the topic with "what is dependency injection?" and expect the IoC container as the answer, plus why it makes code testable (you inject a mock in a test instead of the real dependency)
- Bean scope and the singleton default — Spring beans are singleton-scoped by default (one shared instance for the whole app), which is why a `@Service` must be stateless and thread-safe; interviewers ask "what scope is a `@Service` by default, and is it safe for two concurrent requests?" — the gotcha is storing mutable per-request state in a field of a singleton bean
- `@Service`, `@Repository`, `@Component`, `@Controller` — all four register the class as a Spring bean; `@Repository` also translates JPA/Hibernate exceptions into Spring's `DataAccessException`; interviewers ask "what is the difference between `@Service` and `@Component`?" — semantics and layer readability
- `@Bean` in a `@Configuration` class — the way to register library classes you cannot annotate with `@Component`; used in `SecurityConfig` to expose `BCryptPasswordEncoder` and `AuthenticationManager`; interviewers ask "why did you define a `@Bean` for `BCryptPasswordEncoder`?"
- Constructor injection — preferred over `@Autowired` field injection; makes dependencies explicit, `final`, and easy to mock in tests without starting Spring; Spring infers it automatically when the class has one constructor; interviewers ask "why not field injection?"
- `@Value("${property.name}")` — injects a single config value from `application.properties` at startup; the app fails fast if the key is missing rather than throwing a `NullPointerException` at runtime
- `@ConfigurationProperties` — binds a group of related properties to a class at once; cleaner than many individual `@Value` annotations when you have grouped config like `app.jwt.secret` and `app.jwt.expiration`
- `@Qualifier` / `@Primary` — needed when two classes implement the same interface and Spring cannot decide which one to inject; `@Primary` sets a default, `@Qualifier("beanName")` picks one explicitly at the injection point; interviewers ask "what happens if you have two `@Service` classes implementing the same interface and inject the interface type?" (Spring throws at startup unless you resolve the ambiguity with one of these)

## Spring Data JPA — entity and relationship mapping

- `@Entity` — marks the Java class as a JPA entity; Hibernate manages its lifecycle and maps it to a database table; omitting it means Hibernate ignores the class completely with no error
- `@Table(name = "users")` — sets the table name; always required for the `User` entity because `user` is a reserved word in PostgreSQL; convention: use plural lowercase names (`users`, `projects`, `time_entries`) to avoid reserved-word conflicts
- `@Id` — marks the primary key field; without it Hibernate throws a `MappingException` on startup
- `@GeneratedValue(strategy = GenerationType.IDENTITY)` — delegates id generation to the database's auto-increment (`BIGSERIAL` in PostgreSQL); the default `AUTO` strategy creates a shared sequence that increments by 50, leaving large gaps — always use `IDENTITY` in PostgreSQL projects
- `@Column(nullable = false)` and `@Column(unique = true)` — add `NOT NULL` and `UNIQUE` constraints; Hibernate reflects them in the schema when `ddl-auto=update`; interviewers inspect entity annotations for missing constraints
- `@ManyToOne(fetch = FetchType.LAZY)` and `@JoinColumn(name = "user_id")` — the entity on the "many" side holds the FK column; `@JoinColumn` names that column; interviewers ask "which entity owns the foreign key and why?"
- `@OneToMany(mappedBy = "user")` — the inverse side of the relationship; `mappedBy` points to the field in the other entity that owns the FK; omitting `mappedBy` causes JPA to create an unexpected join table
- `@ManyToMany` — models a many-to-many relationship; requires a join table; interviewers ask about relationships and this is the third type they expect you to know after `@ManyToOne` and `@OneToMany`
- `cascade = CascadeType.ALL` and `orphanRemoval = true` — `cascade` propagates save/delete operations to children automatically; `orphanRemoval` deletes a child when it is removed from the parent's collection; interviewers ask the difference between the two
- `@Enumerated(EnumType.STRING)` — stores the enum name (`DRAFT`, `SUBMITTED`) instead of its position number; using the default `ORDINAL` means inserting a new value in the middle of the enum silently corrupts every existing row; interviewers always ask why `STRING` is the safe choice
- `@CreationTimestamp` / `@UpdateTimestamp` (Hibernate) vs `@PrePersist` (JPA) — `@CreationTimestamp` is Hibernate-specific and sets the field automatically; `@PrePersist` is the JPA-standard lifecycle callback that runs before the first insert; interviewers ask "did you set `createdAt` manually?" and which approach you chose and why
- Lombok `@Data` on a JPA entity — a gotcha: `@Data` generates `equals()`, `hashCode()`, and `toString()` over every field including relationships, so on a bidirectional `@ManyToOne`/`@OneToMany` `toString()` recurses into a `StackOverflowError` and `equals`/`hashCode` can trigger lazy loading; interviewers show an `@Data` entity and ask "any problem with this?" — the safe answer is to exclude relations or use `@Getter`/`@Setter` with id-based equality
- `spring.jpa.hibernate.ddl-auto` values (`none`, `validate`, `update`, `create`, `create-drop`) — controls whether Hibernate touches the schema at startup; `update` is convenient in development but dangerous in production because it silently alters tables and never drops columns, so real deployments use `validate` or `none` plus Flyway migrations; interviewers ask "what does `ddl-auto` do and which value do you run in production?"

## Spring Data JPA — repositories, queries, and performance

- JPA vs Hibernate — JPA is the specification (the `@Entity`, `@Id` annotations and the `EntityManager` interface); Hibernate is the default implementation Spring Boot ships; interviewers ask "are JPA and Hibernate the same thing?" — the spec/implementation distinction separates a candidate who understands the stack from one who memorised annotations
- `JpaRepository` built-in methods: `save()`, `findById()`, `findAll()`, `deleteById()`, `existsById()` — what Spring provides without writing any SQL; interviewers ask "what does `JpaRepository` give you for free?"
- `findById()` returns `Optional<T>`, not the entity or `null` — forces you to handle the not-found case explicitly with `.orElseThrow(...)`; interviewers ask "what does `findById` return and why not the entity directly?" — returning `Optional` instead of `null` is the design that prevents a `NullPointerException`
- `save()` insert vs update — `save()` inserts when `id == null` and merges (updates) when `id` is already set; no separate `insert()` and `update()` methods needed; interviewers ask how Spring Data decides which operation to run
- Derived query methods: `findByEmail(String email)` — Spring reads the method name and generates the SQL; no `@Query` needed for simple lookups; interviewers test how far the naming convention goes (`findByTypeAndUserId`, `existsByEmail`)
- `@Query` with JPQL — custom queries for aggregations and complex filtering; JPQL uses entity class names and field names, not table names and column names; needed for the reports endpoint in TimeTrack
- Pagination: `Pageable`, `Page<T>`, `PageRequest.of(page, size)` — the standard way to return lists in production; interviewers ask "what happens if you return `findAll()` on a table with 100,000 rows?"
- N+1 problem — one query loads the list, then N extra queries load each lazy relationship in a loop; fix with `JOIN FETCH` in `@Query` or with `@EntityGraph`; one of the most common JPA interview questions
- `FetchType.LAZY` vs `FetchType.EAGER` — `LAZY` loads the relationship only when you access the field; `EAGER` loads it on every query; `@ManyToOne` defaults to `EAGER` — a surprising gotcha; always declare `FetchType.LAZY` explicitly on `@ManyToOne`; interviewers ask "what is the default fetch type for `@ManyToOne`?"

## Exception handling

- `@RestControllerAdvice` — marks the global exception handler; combines `@ControllerAdvice` and `@ResponseBody`; using `@ControllerAdvice` alone returns HTML error pages, not JSON; interviewers ask "why `@RestControllerAdvice` and not `@ControllerAdvice`?"
- `@ExceptionHandler(SomeException.class)` — handles one specific exception type and maps it to the right HTTP status code; Spring calls it automatically when the exception propagates from any controller
- Custom exception classes extending `RuntimeException` — unchecked so they propagate without `throws` declarations; named after what went wrong (`ResourceNotFoundException`); interviewers ask "why `RuntimeException` and not `Exception`?"
- `MethodArgumentNotValidException` — Spring throws this when `@Valid` on a `@RequestBody` fails; handle it in `@RestControllerAdvice` to return 400 with field-level error messages; not catching it results in a verbose default Spring error body
- Error response format — always return a consistent `{ "message": "...", "status": 404 }` body; the Angular client must be able to parse any error the same way; interviewers ask "what does your API return when a resource is not found?"
- Soft delete — `active = false` instead of `deleteById()`; preserves historical data and audit trail; interviewers ask "what happens to existing time entries when a project is deleted?"

## Spring Security — setup and authorization

- `@Configuration` + `@EnableWebSecurity` + `@EnableMethodSecurity` — the three annotations that activate Spring Security and method-level role checks; `@EnableMethodSecurity` is silently ignored if missing — `@PreAuthorize` will compile and run but protect nothing
- `SecurityFilterChain` — the single `@Bean` that configures CSRF (disabled for JWT), session policy (`STATELESS`), route permissions, and the JWT filter order; every JWT-secured Spring Boot app has exactly one
- Route rules: `.requestMatchers("/api/auth/**").permitAll()` and `.anyRequest().authenticated()` — all public and protected routes in one place; order matters — specific rules must be declared before the catch-all; interviewers ask "how do you make the login endpoint public without exposing everything?"
- `@PreAuthorize("hasRole('MANAGER')")` — method-level role check that runs after the JWT is validated; requires `@EnableMethodSecurity` on `SecurityConfig`; silently ignored without it — the most common authorization bug in junior code
- CORS configuration in `SecurityFilterChain` — required when Angular (port 4200) calls Spring Boot (port 8080); must be configured inside the Security layer via a `CorsConfigurationSource` bean, not with `@CrossOrigin` on controllers, because the Security filter runs before controllers see the request
- `AuthenticationEntryPoint` — the hook Spring Security calls when an unauthenticated request hits a protected route; by default Spring returns an empty 403, so you implement it to return the semantically correct 401 with a JSON body; interviewers ask "should a missing or invalid token return 401 or 403, and how do you control it?" — 401 means "not authenticated" (who are you?), 403 means "authenticated but not allowed" (valid token, wrong role)

## Spring Security — authentication and JWT

- `UserDetailsService.loadUserByUsername()` — the one method you implement to tell Spring how to load your users from the database; called automatically by `DaoAuthenticationProvider` during login; you never call it yourself
- `BCryptPasswordEncoder` — one-way hashing with a random salt; interviewers ask "why hash and not encrypt?" — there is no need to recover the original password, and hashing is irreversible even if the database is compromised; also ask "why BCrypt?" — the work factor makes brute-force slow
- `AuthenticationManager.authenticate()` — Spring's login coordinator; calling it internally triggers `DaoAuthenticationProvider`, which calls `UserDetailsService` and `BCryptPasswordEncoder`; you expose it as a `@Bean` so `AuthService` can inject it
- `OncePerRequestFilter` — the base class for `JwtFilter`; guaranteed to run exactly once per request; reads the `Authorization: Bearer` header, validates the token, and sets the authenticated user in `SecurityContextHolder`
- `SecurityContextHolder` — thread-local storage where `JwtFilter` places the authenticated user for the current request; services call it to get the logged-in user without trusting client-supplied IDs in the request body
- `UsernamePasswordAuthenticationToken` 2-arg vs 3-arg — 2-arg (no authorities) is unverified credentials passed to `authenticate()`; 3-arg (with authorities) is a confirmed authentication stored in `SecurityContextHolder`; the distinction matters when reading JwtFilter code
- JWT structure: `header.payload.signature` — header encodes the algorithm (HS256), payload encodes the claims (`sub`, `iat`, `exp`), signature proves the token was not tampered with; interviewers ask "what is inside a JWT?" — this is the expected answer
- JWT cannot be invalidated before expiry — once issued a JWT is valid until its `exp` claim passes; there is no server-side state to delete; the practical solution is a short expiry time (15–60 min); a token blacklist in Redis restores revocability but reintroduces server state; interviewers test this trade-off directly
- Session-based vs JWT — sessions store state on the server (can revoke instantly, harder to scale horizontally); JWT stores state on the client (stateless, scales easily, cannot revoke before expiry); interviewers ask "why JWT instead of sessions?" — the REST statelessness argument is the expected answer
- HS256 vs RS256 — HS256 uses one shared secret (correct for a single backend service); RS256 uses a public/private key pair (needed when multiple services verify the same token without sharing a secret); interviewers ask which you chose and why
- Access token vs refresh token — the access token is short-lived and sent on every request; the refresh token is long-lived and used only to obtain a new access token without forcing the user to log in again; interviewers ask "since a JWT cannot be revoked before it expires, how do you keep expiry short without logging the user out every 15 minutes?" — the refresh token is the expected answer

## Bean validation

- `@Valid` on `@RequestBody` — activates validation on the incoming DTO at the controller boundary; without it all the constraint annotations on the DTO are compiled but silently ignored at runtime; this is tested by every interviewer who looks at controller code
- `spring-boot-starter-validation` dependency — the required Maven dependency; without it `@NotBlank` and `@Email` compile fine but do nothing at runtime; a common source of confusing bugs when setting up a project from scratch
- `@NotNull` vs `@NotEmpty` vs `@NotBlank` — `@NotNull` rejects only null; `@NotEmpty` rejects null and empty string but allows whitespace; `@NotBlank` rejects null, empty, and whitespace-only strings; for String fields always use `@NotBlank`; interviewers ask the difference between all three
- `@Positive`, `@Size`, `@Email`, `@Min`, `@Max`, `@Pattern` — common validators for positive numbers, string length, email format, numeric bounds, and custom regex; interviewers expect you to recall at least three without checking the docs
- `@Validated` on the controller class — required to validate `@PathVariable` and `@RequestParam` parameters directly; `@Valid` only works on `@RequestBody`; without `@Validated` on the class, a negative ID in the URL will not be rejected
- `ConstraintViolationException` vs `MethodArgumentNotValidException` — `@Valid` on `@RequestBody` throws `MethodArgumentNotValidException`; `@Validated` on path variables throws `ConstraintViolationException`; you need a separate `@ExceptionHandler` for each or the second one falls through to the generic 500 handler

## Transactions

- `@Transactional` — wraps the service method in a database transaction; if any unchecked exception propagates out, all DB writes in that method roll back automatically; required for any method that writes to more than one table
- `@Transactional(readOnly = true)` — signals Hibernate to skip dirty-checking at the end of the method; interviewers ask "what is the benefit?" — Hibernate no longer needs to compare entity state against snapshots, which saves memory and time on large queries
- Private method gotcha — `@Transactional` on a `private` method is silently ignored because Spring creates a proxy and proxies cannot intercept private calls; must be on a `public` method; a classic interview trap that catches candidates who memorised the annotation but did not understand how it works
- `LazyInitializationException` — thrown when you access a `LAZY` relationship after the Hibernate session is closed (outside the `@Transactional` boundary); fix by converting to DTO inside the `@Transactional` method, or by using `JOIN FETCH` to load the relationship eagerly in the query
- Where `@Transactional` belongs — on the service layer; Spring Data repositories are already transactional per method; controllers do not interact with the database directly and should never have it
- Catching exceptions swallows the rollback — if you catch a `RuntimeException` inside a `@Transactional` method and do not re-throw it, Spring sees no exception and commits the transaction; the data is written even though the operation failed; a hidden gotcha interviewers include in code review questions
- `REQUIRES_NEW` propagation — always starts a new, independent transaction regardless of whether one already exists; used when an inner operation (such as writing to an audit log) must commit even if the outer transaction rolls back

## Testing

- JUnit 5: `@Test`, `@BeforeEach`, `assertEquals`, `assertThrows` — the minimum annotations and assertions to write a service unit test; included automatically via `spring-boot-starter-test`
- `@ExtendWith(MockitoExtension.class)` — activates Mockito in a plain JUnit test without loading any Spring context; the fastest test type; interviewers ask "why not use `@SpringBootTest` for all tests?" — startup cost and isolation
- Mockito: `@Mock`, `@InjectMocks`, `when().thenReturn()`, `doThrow()`, `verify()` — mocking dependencies to test one class in isolation without a database or Spring context
- Arrange / Act / Assert — the standard three-part structure every test must follow; interviewers expect to see it named in test comments or test method bodies and will ask you to explain it if the pattern is missing
- `@MockBean` vs `@Mock` — `@Mock` creates a Mockito mock without Spring; `@MockBean` creates a mock AND replaces the real Spring bean in the application context; use `@MockBean` inside `@WebMvcTest` and `@SpringBootTest`; using `@Mock` inside a Spring test results in `NullPointerException` because Spring never injects it
- `@WebMvcTest` — loads only the web layer and replaces services with `@MockBean`; tests HTTP request/response, status codes, and validation without a real database; the correct tool for testing controller behavior
- `jsonPath()` — the assertion method inside `@WebMvcTest` tests that reads a field from the JSON response: `.andExpect(jsonPath("$.id").value(1))`; interviewers ask "how do you verify the response body in a controller test?"
- `@SpringBootTest` — full integration test; loads the whole application context including the database; slow but catches wiring issues and missing `@Transactional`; reserve for critical paths only
- `@DataJpaTest` — tests only the repository layer against an in-memory H2 database; does not load controllers or services; used to verify that derived query methods and `@Query` methods return the correct data
- Layered testing strategy — service tests (JUnit + Mockito, fast, isolated), controller tests (`@WebMvcTest`, no DB), integration tests (`@SpringBootTest`, slow); consultancies ask "how do you test your backend?" — naming the three layers is the expected answer

## Tooling

- Docker: `Dockerfile` for a Spring Boot app — `FROM eclipse-temurin`, `COPY target/*.jar app.jar`, `ENTRYPOINT`; interviewers ask "how do you containerise a Spring Boot application?"
- `docker-compose.yml` — runs Spring Boot and PostgreSQL together with one command; interviewers ask "how does someone run your project locally without installing PostgreSQL separately?"
- Flyway — database migrations as versioned SQL scripts (`V1__init.sql`); why teams use it instead of `ddl-auto=update` (scripts are reviewable, tracked in git, and safe to run in production — `update` can silently alter a production table); interviewers ask about migration strategy in any production-focused screening
