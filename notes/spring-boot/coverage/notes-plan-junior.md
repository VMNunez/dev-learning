# Spring Boot Junior Notes Plan

Plan status: current
Coverage: notes/spring-boot/coverage/junior.md
Coverage SHA-256: a73b6f28cf85c94d458b83137a0cda66c5fb82db0375771f147db5e5f5421838
Generated: 2026-07-24

## 01 — Project setup

Status: pending
Action: audit
English: notes/spring-boot/junior/en/00-intro-spring-boot.md
Spanish: notes/spring-boot/junior/es/00-introduccion-spring-boot.md
Depends on: none

Coverage concepts:

- `@SpringBootApplication` — combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`; interviewers ask "what does this annotation replace in a traditional Spring app?" and "why must the class be in the root package?"
- `application.properties` — where datasource, JPA settings, and JWT config go; interviewers ask how you keep credentials out of source control (environment variables with `${VAR_NAME}` syntax; app fails at startup if the variable is missing — better than a silent null at runtime)
- Profiles: `application-dev.properties`, `spring.profiles.active` — separating config per environment; asked in any interview about real-world deployment
- Maven: `pom.xml` structure, adding a dependency, `mvn clean install` — how the project is built and how libraries are pulled in; interviewers ask what `spring-boot-starter-parent` does (manages all dependency versions via a BOM so you do not write version tags)
- Lombok `@Data` — generates getters, setters, `equals()`, `hashCode()`, and `toString()`; interviewers ask "what does `@Data` generate?" — a standard question when reviewing entity code
- Lombok `@NoArgsConstructor` — generates an empty constructor required by JPA to instantiate entities when reading from the database; omitting it causes a runtime error on startup
- Lombok `@AllArgsConstructor` vs `@RequiredArgsConstructor` — `@AllArgsConstructor` takes every field; `@RequiredArgsConstructor` takes only `final` and `@NonNull` fields; interviewers ask which to use for a service class with constructor injection (`@RequiredArgsConstructor` — it picks up only the `private final` dependencies)
- `@Slf4j` — Lombok annotation that generates a `log` field; `log.info()`, `log.warn()`, `log.error()`; seen in every production codebase and asked about in code reviews
- `data.sql` — Spring Boot runs this file on startup to seed the database; used in TimeTrack to create the first manager account; interviewers ask "how did you create the first user if there is no register endpoint?"

Rationale: These concepts form the coherent coverage group “Project setup”.

## 02 — REST controllers

Status: pending
Action: audit
English: notes/spring-boot/junior/en/02-rest-controllers.md
Spanish: notes/spring-boot/junior/es/02-controladores-rest.md
Depends on: 01

Coverage concepts:

- `@RestController` — combines `@Controller` and `@ResponseBody`; every return value is serialised to JSON by Jackson automatically; interviewers ask "what is the difference between `@Controller` and `@RestController`?" — `@Controller` is for server-rendered HTML; always use `@RestController` for a REST API
- `@RequestMapping` — sets the base URL path for all methods in the class; combined with method-level annotations (`@GetMapping`, `@PostMapping`) to form the full URL
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping` — method-level annotations for each HTTP verb; `@PatchMapping` is used for partial updates and state transitions (submit, approve, reject); tested in every technical screening
- `@PathVariable` — reads a variable from the URL path (`/{id}`); the name inside `{}` must match the parameter name or be declared explicitly with `@PathVariable("id")`; interviewers ask "what happens if the names don't match?"
- `@RequestBody` — reads the JSON body and converts it to a Java object via Jackson; requires the client to send `Content-Type: application/json`; used with `@Valid` to trigger validation
- `@RequestParam` — reads query string parameters (`?month=2025-05`); can be `required = false` with a `defaultValue`; used for optional filters, not for required resource identifiers
- `ResponseEntity<T>` — use it when status or headers vary dynamically; fixed statuses can use
  `@ResponseStatus`, while returning a body directly intentionally uses the framework's normal status
- Jackson serialisation — Spring Boot uses Jackson automatically to convert Java objects to JSON on the way out and JSON to Java on the way in; interviewers ask "how does Spring Boot convert your return value to JSON?" — Jackson is the answer; it reads public getters or Lombok-generated ones
- Request and response DTO implementation — define separate Java records/classes for incoming and
  outgoing contracts, attach validation only to untrusted input, and map explicitly at the service
  boundary
- `toResponse()` mapping pattern — entity-to-DTO conversion extracted to one private helper in the service layer; keeps controllers free of mapping logic and avoids repeating the same field assignments in every method
- `@JsonIgnore` — prevents a field from appearing in the JSON response; used on the `password` field so the API never returns hashed passwords; interviewers ask "why doesn't your API expose the password?"

Rationale: These concepts form the coherent coverage group “REST controllers”.

## 03 — Dependency injection and beans

Status: pending
Action: audit
English: notes/spring-boot/junior/en/03-dependency-injection.md
Spanish: notes/spring-boot/junior/es/03-inyeccion-dependencias.md
Depends on: 02

Coverage concepts:

- `@Service`, `@Repository`, `@Component`, `@Controller` — all four register the class as a Spring bean; `@Repository` also translates JPA/Hibernate exceptions into Spring's `DataAccessException`; interviewers ask "what is the difference between `@Service` and `@Component`?" — semantics and layer readability
- `@Bean` in a `@Configuration` class — the way to register library classes you cannot annotate with `@Component`; used in `SecurityConfig` to expose `BCryptPasswordEncoder` and `AuthenticationManager`; interviewers ask "why did you define a `@Bean` for `BCryptPasswordEncoder`?"
- Constructor injection — preferred over `@Autowired` field injection; makes dependencies explicit, `final`, and easy to mock in tests without starting Spring; Spring infers it automatically when the class has one constructor; interviewers ask "why not field injection?"
- `@Value("${property.name}")` — injects a single config value from `application.properties` at startup; the app fails fast if the key is missing rather than throwing a `NullPointerException` at runtime
- `@ConfigurationProperties` — binds a group of related properties to a class at once; cleaner than many individual `@Value` annotations when you have grouped config like `app.jwt.secret` and `app.jwt.expiration`
- `@Qualifier` / `@Primary` — needed when two classes implement the same interface and Spring cannot decide which one to inject; `@Primary` sets a default, `@Qualifier("beanName")` picks one explicitly at the injection point; interviewers ask "what happens if you have two `@Service` classes implementing the same interface and inject the interface type?" (Spring throws at startup unless you resolve the ambiguity with one of these)

Rationale: These concepts form the coherent coverage group “Dependency injection and beans”.

## 04 — Spring Data JPA — entity and relationship mapping

Status: pending
Action: audit
English: notes/spring-boot/junior/en/04-spring-data-jpa.md
Spanish: notes/spring-boot/junior/es/04-spring-data-jpa.md
Depends on: 03

Coverage concepts:

- `@Entity` — marks the Java class as a JPA entity; Hibernate manages its lifecycle and maps it to a database table; omitting it means Hibernate ignores the class completely with no error
- `@Table(name = "users")` — sets the table name; always required for the `User` entity because `user` is a reserved word in PostgreSQL; convention: use plural lowercase names (`users`, `projects`, `time_entries`) to avoid reserved-word conflicts
- `@Id` — marks the primary key field; without it Hibernate throws a `MappingException` on startup
- `IDENTITY` vs sequence id generation — both work with PostgreSQL; identity requires the insert to
  obtain each id and can limit batching, while sequences support allocation, whose gaps are normal
  and not evidence of missing rows
- `@Column(nullable = false)` and `@Column(unique = true)` — add `NOT NULL` and `UNIQUE` constraints; Hibernate reflects them in the schema when `ddl-auto=update`; interviewers inspect entity annotations for missing constraints
- `@ManyToOne(fetch = FetchType.LAZY)` and `@JoinColumn(name = "user_id")` — the entity on the "many" side holds the FK column; `@JoinColumn` names that column; interviewers ask "which entity owns the foreign key and why?"
- `@OneToMany(mappedBy = "user")` — the inverse side of the relationship; `mappedBy` points to the field in the other entity that owns the FK; omitting `mappedBy` causes JPA to create an unexpected join table
- `@ManyToMany` — models a many-to-many relationship; requires a join table; interviewers ask about relationships and this is the third type they expect you to know after `@ManyToOne` and `@OneToMany`
- `cascade = CascadeType.ALL` and `orphanRemoval = true` — `cascade` propagates save/delete operations to children automatically; `orphanRemoval` deletes a child when it is removed from the parent's collection; interviewers ask the difference between the two
- `@Enumerated(EnumType.STRING)` — stores the enum name (`DRAFT`, `SUBMITTED`) instead of its position number; using the default `ORDINAL` means inserting a new value in the middle of the enum silently corrupts every existing row; interviewers always ask why `STRING` is the safe choice
- `@CreationTimestamp` / `@UpdateTimestamp` (Hibernate) vs `@PrePersist` (JPA) — `@CreationTimestamp` is Hibernate-specific and sets the field automatically; `@PrePersist` is the JPA-standard lifecycle callback that runs before the first insert; interviewers ask "did you set `createdAt` manually?" and which approach you chose and why
- `JpaRepository` built-in methods: `save()`, `findById()`, `findAll()`, `deleteById()`, `existsById()` — what Spring provides without writing any SQL; interviewers ask "what does `JpaRepository` give you for free?"
- `save()` insert vs update — Spring Data delegates to entity-newness detection, normally using
  version/id state or `Persistable.isNew()`; it is not universally equivalent to checking only
  `id == null`
- Derived query methods: `findByEmail(String email)` — Spring reads the method name and generates the SQL; no `@Query` needed for simple lookups; interviewers test how far the naming convention goes (`findByTypeAndUserId`, `existsByEmail`)
- `@Query` with JPQL — custom queries for aggregations and complex filtering; JPQL uses entity class names and field names, not table names and column names; needed for the reports endpoint in TimeTrack
- Pagination: `Pageable`, `Page<T>`, `PageRequest.of(page, size)` — the standard way to return lists in production; interviewers ask "what happens if you return `findAll()` on a table with 100,000 rows?"
- N+1 problem — one query loads the list, then N extra queries load each lazy relationship in a loop; fix with `JOIN FETCH` in `@Query` or with `@EntityGraph`; one of the most common JPA interview questions
- `FetchType.LAZY` vs `FetchType.EAGER` — `LAZY` loads the relationship only when you access the field; `EAGER` loads it on every query; `@ManyToOne` defaults to `EAGER` — a surprising gotcha; always declare `FetchType.LAZY` explicitly on `@ManyToOne`; interviewers ask "what is the default fetch type for `@ManyToOne`?"

Rationale: These concepts form the coherent coverage group “Spring Data JPA — entity and relationship mapping, Spring Data JPA — repositories, queries, and performance”.

## 05 — Exception handling

Status: pending
Action: audit
English: notes/spring-boot/junior/en/05-exception-handling.md
Spanish: notes/spring-boot/junior/es/05-manejo-excepciones.md
Depends on: 04

Coverage concepts:

- `@RestControllerAdvice` — combines `@ControllerAdvice` with `@ResponseBody` for JSON-oriented
  handlers; plain advice can also return JSON when its handler uses `ResponseEntity` or `@ResponseBody`
- `@ExceptionHandler(SomeException.class)` — handles one specific exception type and maps it to the right HTTP status code; Spring calls it automatically when the exception propagates from any controller
- Custom exception classes extending `RuntimeException` — unchecked so they propagate without `throws` declarations; named after what went wrong (`ResourceNotFoundException`); interviewers ask "why `RuntimeException` and not `Exception`?"
- `MethodArgumentNotValidException` — Spring throws this when `@Valid` on a `@RequestBody` fails; handle it in `@RestControllerAdvice` to return 400 with field-level error messages; not catching it results in a verbose default Spring error body
- Error response format — always return a consistent `{ "message": "...", "status": 404 }` body; the Angular client must be able to parse any error the same way; interviewers ask "what does your API return when a resource is not found?"
- Soft delete — `active = false` instead of `deleteById()`; preserves historical data and audit trail; interviewers ask "what happens to existing time entries when a project is deleted?"

Rationale: These concepts form the coherent coverage group “Exception handling”.

## 06 — Spring Security — setup and authorization

Status: pending
Action: audit
English: notes/spring-boot/junior/en/06-security-jwt.md
Spanish: notes/spring-boot/junior/es/06-seguridad-jwt.md
Depends on: 05

Coverage concepts:

- `@Configuration`, `@EnableWebSecurity`, and `@EnableMethodSecurity` — Boot can activate web
  security without explicitly adding `@EnableWebSecurity`; `@EnableMethodSecurity` is the separate
  switch required for `@PreAuthorize`
- `SecurityFilterChain` — a bean that configures CSRF, session policy, route permissions, and filter
  order; applications may define multiple ordered chains for different request matchers
- Route rules: `.requestMatchers("/api/auth/**").permitAll()` and `.anyRequest().authenticated()` — all public and protected routes in one place; order matters — specific rules must be declared before the catch-all; interviewers ask "how do you make the login endpoint public without exposing everything?"
- `@PreAuthorize("hasRole('MANAGER')")` — method-level role check that runs after the JWT is validated; requires `@EnableMethodSecurity` on `SecurityConfig`; silently ignored without it — the most common authorization bug in junior code
- CORS with Spring Security — a shared `CorsConfigurationSource` keeps policy central and lets the
  security chain handle preflight; `@CrossOrigin` can still be valid for deliberately local
  controller policy
- `UserDetailsService.loadUserByUsername()` — the one method you implement to tell Spring how to load your users from the database; called automatically by `DaoAuthenticationProvider` during login; you never call it yourself
- `BCryptPasswordEncoder` — one-way hashing with a random salt; interviewers ask "why hash and not encrypt?" — there is no need to recover the original password, and hashing is irreversible even if the database is compromised; also ask "why BCrypt?" — the work factor makes brute-force slow
- `AuthenticationManager.authenticate()` — Spring's login coordinator; calling it internally triggers `DaoAuthenticationProvider`, which calls `UserDetailsService` and `BCryptPasswordEncoder`; you expose it as a `@Bean` so `AuthService` can inject it
- `OncePerRequestFilter` — the base class for `JwtFilter`; guaranteed to run exactly once per request; reads the `Authorization: Bearer` header, validates the token, and sets the authenticated user in `SecurityContextHolder`
- `SecurityContextHolder` — thread-local storage where `JwtFilter` places the authenticated user for the current request; services call it to get the logged-in user without trusting client-supplied IDs in the request body
- `UsernamePasswordAuthenticationToken` 2-arg vs 3-arg — 2-arg (no authorities) is unverified credentials passed to `authenticate()`; 3-arg (with authorities) is a confirmed authentication stored in `SecurityContextHolder`; the distinction matters when reading JwtFilter code
- JJWT signing and parsing — convert the configured key into a `SecretKey`, sign issued claims, and
  parse through the same algorithm/key so tampering, expiry, and malformed tokens fail before the
  request reaches a controller
- JWT claim-to-authority mapping — load the user or map trusted role claims into Spring Security
  authorities before placing the authenticated token in `SecurityContextHolder`

Rationale: These concepts form the coherent coverage group “Spring Security — setup and authorization, Spring Security — authentication and JWT”.

## 07 — Bean validation

Status: pending
Action: audit
English: notes/spring-boot/junior/en/07-validation.md
Spanish: notes/spring-boot/junior/es/07-validacion.md
Depends on: 06

Coverage concepts:

- `@Valid` on `@RequestBody` — activates validation on the incoming DTO at the controller boundary; without it all the constraint annotations on the DTO are compiled but silently ignored at runtime; this is tested by every interviewer who looks at controller code
- `spring-boot-starter-validation` dependency — the required Maven dependency; without it `@NotBlank` and `@Email` compile fine but do nothing at runtime; a common source of confusing bugs when setting up a project from scratch
- `@NotNull` vs `@NotEmpty` vs `@NotBlank` — `@NotNull` rejects only null; `@NotEmpty` rejects null and empty string but allows whitespace; `@NotBlank` rejects null, empty, and whitespace-only strings; for String fields always use `@NotBlank`; interviewers ask the difference between all three
- `@Positive`, `@Size`, `@Email`, `@Min`, `@Max`, `@Pattern` — common validators for positive numbers, string length, email format, numeric bounds, and custom regex; interviewers expect you to recall at least three without checking the docs
- Controller method validation — current Spring MVC validates constrained method parameters and may
  raise `HandlerMethodValidationException`; type-level `@Validated` selects the older AOP validation
  path, so exception handling must match the chosen model
- Body vs method validation failures — invalid `@RequestBody` binding and invalid method parameters
  use different exception families; handle both deliberately instead of assuming every violation is
  a `ConstraintViolationException`

Rationale: These concepts form the coherent coverage group “Bean validation”.

## 08 — Transactions

Status: pending
Action: audit
English: notes/spring-boot/junior/en/08-transactions.md
Spanish: notes/spring-boot/junior/es/08-transacciones.md
Depends on: 07

Coverage concepts:

- `@Transactional` — wraps the service method in a database transaction; if any unchecked exception propagates out, all DB writes in that method roll back automatically; required for any method that writes to more than one table
- `@Transactional(readOnly = true)` — signals Hibernate to skip dirty-checking at the end of the method; interviewers ask "what is the benefit?" — Hibernate no longer needs to compare entity state against snapshots, which saves memory and time on large queries
- Private method gotcha — `@Transactional` on a `private` method is silently ignored because Spring creates a proxy and proxies cannot intercept private calls; must be on a `public` method; a classic interview trap that catches candidates who memorised the annotation but did not understand how it works
- `LazyInitializationException` — thrown when you access a `LAZY` relationship after the Hibernate session is closed (outside the `@Transactional` boundary); fix by converting to DTO inside the `@Transactional` method, or by using `JOIN FETCH` to load the relationship eagerly in the query
- Where `@Transactional` belongs — on the service layer; Spring Data repositories are already transactional per method; controllers do not interact with the database directly and should never have it
- Catching exceptions swallows the rollback — if you catch a `RuntimeException` inside a `@Transactional` method and do not re-throw it, Spring sees no exception and commits the transaction; the data is written even though the operation failed; a hidden gotcha interviewers include in code review questions

Rationale: These concepts form the coherent coverage group “Transactions”.

## 09 — Testing

Status: pending
Action: audit
English: notes/spring-boot/junior/en/09-testing.md
Spanish: notes/spring-boot/junior/es/09-testing.md
Depends on: 08

Coverage concepts:

- JUnit 5: `@Test`, `@BeforeEach`, `assertEquals`, `assertThrows` — the minimum annotations and assertions to write a service unit test; included automatically via `spring-boot-starter-test`
- `@ExtendWith(MockitoExtension.class)` — activates Mockito in a plain JUnit test without loading any Spring context; the fastest test type; interviewers ask "why not use `@SpringBootTest` for all tests?" — startup cost and isolation
- Mockito: `@Mock`, `@InjectMocks`, `when().thenReturn()`, `doThrow()`, `verify()` — mocking dependencies to test one class in isolation without a database or Spring context
- Arrange / Act / Assert — the standard three-part structure every test must follow; interviewers expect to see it named in test comments or test method bodies and will ask you to explain it if the pattern is missing
- Mockito mock vs context bean override — `@Mock` creates a standalone test double; current Spring
  tests use `@MockitoBean` to replace a context bean, while `@MockBean` is legacy Boot syntax
- `@WebMvcTest` — loads a focused MVC slice; collaborators must be supplied through explicit mock
  bean overrides or imports rather than being replaced automatically
- `jsonPath()` — the assertion method inside `@WebMvcTest` tests that reads a field from the JSON response: `.andExpect(jsonPath("$.id").value(1))`; interviewers ask "how do you verify the response body in a controller test?"
- `@SpringBootTest` — loads the full Spring application context, but external infrastructure is real
  only when the test config chooses it; use it for wiring and end-to-end application integration
  rather than every service rule
- `@DataJpaTest` — tests only the repository layer against an in-memory H2 database; does not load controllers or services; used to verify that derived query methods and `@Query` methods return the correct data
- Layered testing strategy — service tests (JUnit + Mockito, fast, isolated), controller tests (`@WebMvcTest`, no DB), integration tests (`@SpringBootTest`, slow); consultancies ask "how do you test your backend?" — naming the three layers is the expected answer

Rationale: These concepts form the coherent coverage group “Testing”.

## 10 — Tooling

Status: pending
Action: audit
English: notes/spring-boot/junior/en/10-tooling.md
Spanish: notes/spring-boot/junior/es/10-herramientas.md
Depends on: 09

Coverage concepts:

- Docker: `Dockerfile` for a Spring Boot app — `FROM eclipse-temurin`, `COPY target/*.jar app.jar`, `ENTRYPOINT`; interviewers ask "how do you containerise a Spring Boot application?"
- `docker-compose.yml` — runs Spring Boot and PostgreSQL together with one command; interviewers ask "how does someone run your project locally without installing PostgreSQL separately?"
- Flyway — database migrations as versioned SQL scripts (`V1__init.sql`); why teams use it instead of `ddl-auto=update` (scripts are reviewable, tracked in git, and safe to run in production — `update` can silently alter a production table); interviewers ask about migration strategy in any production-focused screening

Rationale: These concepts form the coherent coverage group “Tooling”.

## Unassigned existing notes

- notes/spring-boot/junior/en/01-basics.md — no junior coverage group is assigned to this legacy file.
- notes/spring-boot/junior/en/11-business-logic-domain-modeling.md — no junior coverage group is assigned to this legacy file.
- notes/spring-boot/junior/en/12-production-debugging.md — no junior coverage group is assigned to this legacy file.
- notes/spring-boot/junior/en/13-logging-observability.md — no junior coverage group is assigned to this legacy file.
- notes/spring-boot/junior/en/14-specifications-criteria-api.md — no junior coverage group is assigned to this legacy file.
- notes/spring-boot/junior/en/15-spring-profiles.md — no junior coverage group is assigned to this legacy file.
