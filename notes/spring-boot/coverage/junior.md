# Junior Coverage — Spring Boot

Concepts needed to build, test, explain, and debug a conventional Spring Boot REST application at junior level.

## Project setup

- Spring Framework vs Spring Boot — distinguish the core container and framework modules from Boot's opinionated auto-configuration, starters, executable packaging, and operational defaults
- `@SpringBootApplication` — combines configuration, auto-configuration, and component scanning; place it in a root package so the default scan reaches application components
- Auto-configuration and starters — Boot configures infrastructure conditionally from the classpath, properties, and existing beans, while starters provide a compatible dependency set rather than generating application code
- Embedded server and executable JAR — a servlet web starter supplies an embedded server so the packaged application can run without deploying a WAR to an external container
- Externalized configuration and property precedence — keep environment-specific values outside code and recognise that command-line arguments, environment variables, profile files, and base configuration can override one another
- Profiles — activate environment-specific beans and configuration deliberately without treating a profile as a secrets store
- `spring-boot-starter-parent` and dependency management — inherit compatible dependency and plugin versions while distinguishing that Boot-specific build behaviour from Maven's generic lifecycle
- Spring Boot Maven plugin — package an executable archive and run the application through Boot-specific goals without confusing the plugin with dependency management
- Lombok on managed entities — generated equality, hash, string, and constructors can interact badly with identifiers, lazy relationships, and JPA's accessible no-argument construction requirement, so generated members must be chosen deliberately
- Lombok constructors and Spring injection — `@RequiredArgsConstructor` can express constructor injection for final dependencies, while all-argument constructors are usually the wrong service boundary
- SQL initialization — understand when Boot runs `schema.sql` and `data.sql`, how initialization differs for embedded and external databases, and why migrations are safer for durable production schema changes

## REST controllers

- Spring MVC request dispatch — follow a request through the servlet dispatcher, handler mapping, argument resolution, message conversion, controller, and exception handling when diagnosing a failed endpoint
- `@Controller` vs `@RestController` — use view-oriented controller semantics for rendered responses and response-body semantics for APIs whose return values are written through message converters
- `@RequestMapping` — sets the base URL path for all methods in the class; combined with method-level annotations (`@GetMapping`, `@PostMapping`) to form the full URL
- HTTP method mappings — select a method-specific mapping that matches the operation's HTTP semantics, including partial updates or state transitions rather than treating every write as POST
- `@PathVariable` vs `@RequestParam` — bind resource identity from the route and optional filtering or control values from the query string, with names and required/default behaviour declared explicitly
- `@RequestBody` — reads the JSON body and converts it to a Java object via Jackson; requires the client to send `Content-Type: application/json`; used with `@Valid` to trigger validation
- `ResponseEntity<T>` — use it when status or headers vary dynamically; fixed statuses can use
  `@ResponseStatus`, while returning a body directly intentionally uses the framework's normal status
- HTTP message conversion and Jackson — content negotiation and configured message converters turn request and response bodies into Java values and JSON rather than the controller serialising text manually
- Request and response DTO implementation — define separate Java records/classes for incoming and
  outgoing contracts, attach validation only to untrusted input, and map explicitly at the service
  boundary
- `toResponse()` mapping pattern — entity-to-DTO conversion extracted to one private helper in the service layer; keeps controllers free of mapping logic and avoids repeating the same field assignments in every method
- DTO allow-listing vs `@JsonIgnore` — shape public responses with dedicated DTOs; use ignore annotations as a local serialization rule, not as the only protection against exposing entity secrets

## Dependency injection and beans

- Component stereotypes — use `@Component` and its layer-specific stereotypes to make application classes discoverable while preserving responsibility and repository exception translation
- `@Bean` vs component scanning — register third-party instances or explicit construction logic in configuration and use scanning for application-owned component classes
- Constructor injection — prefer it over field injection so dependencies are explicit, final, and easy to supply in tests; Spring infers injection when a component has one constructor
- `@Value` vs `@ConfigurationProperties` — inject an isolated value directly or bind and validate a cohesive typed configuration group when several related settings belong together
- `@Qualifier` vs `@Primary` — select one bean explicitly at an injection point or declare a default candidate when several beans satisfy the same dependency type
- Bean scope and the singleton default — application beans are singleton-scoped by default, so mutable request-specific state on a service can leak across users and threads
- Bean lifecycle and startup failures — distinguish component scanning, bean creation, dependency resolution, and application startup so missing beans, ambiguous injection, and circular dependencies can be diagnosed from the failure report

## Spring Data JPA — entity and relationship mapping

- Persistence context and entity state — recognise managed, detached, and removed entities and understand why dirty checking can flush a managed change without another repository `save()`
- `@Entity` — marks a class as a managed persistence type; without it Hibernate does not map the class and repositories or relationships that expect an entity fail during configuration or use
- Entity table naming — use `@Table` when the mapped table differs from the default and avoid reserved-word conflicts through a deliberate physical name, quoting policy, or naming strategy
- `@Id` — marks the primary key field; without it Hibernate throws a `MappingException` on startup
- `IDENTITY` vs sequence id generation — recognise the database mechanisms behind generated identifiers and choose a strategy compatible with the target database
- JPA column nullability and uniqueness — map schema intent while remembering that durable database constraints should be delivered through reviewed migrations rather than relying on `ddl-auto=update`
- Many-to-one ownership — map the foreign-key side with `@ManyToOne` and name its column with `@JoinColumn`
- `@OneToMany(mappedBy = "user")` — the inverse side of the relationship; `mappedBy` points to the field in the other entity that owns the FK; omitting `mappedBy` causes JPA to create an unexpected join table
- Many-to-many ownership — map the join table on one owning side with `@JoinTable` and point the inverse side back with `mappedBy` rather than creating two independent associations
- Cascade vs orphan removal — propagate selected persistence operations to related entities or delete a managed child when it is removed from its parent's collection
- Enum string vs ordinal persistence — store stable names when enum reordering or insertion must not silently change the meaning of existing rows
- Hibernate timestamps vs JPA lifecycle callbacks — choose provider convenience or portable entity callbacks deliberately when populating audit timestamps

## Spring Data JPA — repositories, queries, and performance

- `JpaRepository` CRUD contract — recognise the inherited persistence, lookup, existence, listing, and deletion operations before declaring redundant repository methods
- `save()` insert vs update — recognise that Spring Data decides whether an entity is new before delegating to persistence, so `save()` is not a synonym for SQL INSERT
- Derived query methods — let Spring Data derive simple lookups and existence checks from repository method names, switching approach when the name stops expressing the query clearly
- JPQL vs native SQL in `@Query` — prefer entity and attribute names for portable persistence queries and opt into database SQL only when the required behaviour justifies tighter coupling
- Spring Data pagination — accept `Pageable` and return a bounded result instead of loading an unbounded table through `findAll()`
- `Page<T>` vs `Slice<T>` — return total-count metadata only when the client needs it, because a slice can answer whether another chunk exists without an additional count query
- N+1 problem — one query loads the list, then N extra queries load each lazy relationship in a loop; fix with `JOIN FETCH` in `@Query` or with `@EntityGraph`; one of the most common JPA interview questions
- `FetchType.LAZY` vs `FetchType.EAGER` — distinguish deferred from mandatory relationship loading, know the JPA defaults, and select fetching from each use case rather than treating global eager loading as an N+1 fix
- Open EntityManager in View — recognise that Boot's web default can keep lazy loading available during response rendering, why this can hide query behaviour, and why DTO mapping should happen inside an explicit service transaction

## Exception handling

- `@RestControllerAdvice` — combines `@ControllerAdvice` with `@ResponseBody` for JSON-oriented
  handlers; plain advice can also return JSON when its handler uses `ResponseEntity` or `@ResponseBody`
- `@ExceptionHandler(SomeException.class)` — handles one specific exception type and maps it to the right HTTP status code; Spring calls it automatically when the exception propagates from any controller
- Domain exceptions — represent meaningful application failures and understand why unchecked exceptions cross service boundaries without compulsory `throws` declarations
- `MethodArgumentNotValidException` — Spring throws this when `@Valid` on a `@RequestBody` fails; handle it in `@RestControllerAdvice` to return 400 with field-level error messages; not catching it results in a verbose default Spring error body
- Error response contract — map failures to consistent status and body fields so API clients can handle validation, absence, conflict, and unexpected errors predictably
- Filter-chain exceptions vs controller advice — exceptions raised before controller dispatch do not automatically pass through `@RestControllerAdvice`, so authentication failures need handling at the security boundary
- Filter vs MVC interceptor vs controller advice — use servlet filters for request-chain concerns, interceptors around mapped handlers, and advice for controller exception/response behaviour

## Spring Security — setup and authorization

- `@Configuration`, `@EnableWebSecurity`, and `@EnableMethodSecurity` — Boot can activate web
  security without explicitly adding `@EnableWebSecurity`; `@EnableMethodSecurity` is the separate
  switch required for `@PreAuthorize`
- `SecurityFilterChain` — configure CSRF, session policy, route permissions, and custom filter order in the request security chain
- Security route rules — declare specific public and role-protected matchers before the authenticated catch-all because matcher order controls which rule applies
- `@PreAuthorize("hasRole('MANAGER')")` — method-level role check that runs after the JWT is validated; requires `@EnableMethodSecurity` on `SecurityConfig`; silently ignored without it — the most common authorization bug in junior code
- CORS with Spring Security — a shared `CorsConfigurationSource` keeps policy central and lets the
  security chain handle preflight; `@CrossOrigin` can still be valid for deliberately local
  controller policy
- Preflight through the security chain — permit or correctly process browser `OPTIONS` requests so authentication rules do not reject the preflight before the real cross-origin request is sent
- Authentication vs authorization failures — return an authentication response when credentials are missing or invalid and an access-denied response when an authenticated principal lacks authority
- CSRF in stateless bearer-token APIs — justify disabling or retaining CSRF from how credentials are transported, rather than assuming every REST API is automatically safe
- Stateless JWT vs server sessions — configure bearer-token APIs with stateless session management and explain the scalability, revocation, and browser-security trade-offs rather than choosing JWT by default

## Spring Security — authentication and JWT

- `UserDetailsService.loadUserByUsername()` — the one method you implement to tell Spring how to load your users from the database; called automatically by `DaoAuthenticationProvider` during login; you never call it yourself
- `PasswordEncoder` and BCrypt — verify salted adaptive password hashes through the encoder contract rather than decrypting or comparing raw values
- `DelegatingPasswordEncoder` and encoded-id prefixes — recognise stored values such as `{bcrypt}...` and preserve an upgrade path when password encoding schemes change
- `AuthenticationManager.authenticate()` — Spring's login coordinator; calling it internally triggers `DaoAuthenticationProvider`, which calls `UserDetailsService` and `BCryptPasswordEncoder`; you expose it as a `@Bean` so `AuthService` can inject it
- `OncePerRequestFilter` — process JWT authentication once in the normal request dispatch and always continue or terminate the filter chain deliberately
- `SecurityContextHolder` — thread-local storage where `JwtFilter` places the authenticated user for the current request; services call it to get the logged-in user without trusting client-supplied IDs in the request body
- Anonymous authentication — an unauthenticated request may still have an anonymous `Authentication` object, so code must check authentication state rather than assuming the context value is null
- `UsernamePasswordAuthenticationToken` 2-arg vs 3-arg — 2-arg (no authorities) is unverified credentials passed to `authenticate()`; 3-arg (with authorities) is a confirmed authentication stored in `SecurityContextHolder`; the distinction matters when reading JwtFilter code
- JJWT signing and parsing — convert the configured key into a `SecretKey`, sign issued claims, and
  parse through the same algorithm/key so tampering, expiry, and malformed tokens fail before the
  request reaches a controller
- JWT claim-to-authority mapping — load the user or map trusted role claims into Spring Security
  authorities before placing the authenticated token in `SecurityContextHolder`

## Bean validation

- `@Valid` on `@RequestBody` — trigger cascaded validation of the deserialized request DTO at the controller boundary before business logic runs
- Validation starter and runtime integration — include Jakarta Validation plus its implementation and Spring integration so constraints are discovered and executed rather than merely present as metadata
- `@NotNull` vs `@NotEmpty` vs `@NotBlank` — choose whether null, emptiness, or whitespace-only text violates the input contract rather than applying one constraint to every field type
- Constraint selection — choose semantic constraints for sign, size, format, range, or pattern so the annotation matches the business rule rather than merely rejecting some bad examples
- Controller method validation — apply constraints to controller parameters and handle their failures separately from request-body binding errors
- Body vs method validation failures — invalid `@RequestBody` binding and invalid method parameters
  use different exception families; handle both deliberately instead of assuming every violation is
  a `ConstraintViolationException`
- `@Valid` vs `@Validated` — use standard cascaded validation for request objects and Spring's validation groups or method-level proxy features only when those additional semantics are required

## Transactions

- `@Transactional` atomicity and rollback — group one business operation in a transaction and know that the default rollback rules differ for unchecked and checked exceptions
- `@Transactional(readOnly = true)` — declares read intent and may let the transaction manager or persistence provider optimise work, but it is not a database-enforced ban on writes
- Transaction proxy boundaries — a private or self-invoked method bypasses normal proxy interception, so place transactional entry points on externally invoked, proxy-eligible service methods
- `LazyInitializationException` — thrown when you access a `LAZY` relationship after the Hibernate session is closed (outside the `@Transactional` boundary); fix by converting to DTO inside the `@Transactional` method, or by using `JOIN FETCH` to load the relationship eagerly in the query
- Service transaction boundaries — place business-operation transactions around coordinated repository work rather than stretching persistence concerns into controllers
- Caught exceptions and rollback — swallowing a failure inside a transactional method can let the proxy observe normal completion and commit unless rollback is re-established deliberately

## Testing

- Plain service unit tests — use JUnit and Mockito without a Spring context when the risk is business logic and collaborator interaction rather than framework wiring
- Mockito mock vs context bean override — `@Mock` creates a standalone test double; current Spring
  tests use `@MockitoBean` to replace a context bean, while `@MockBean` is legacy Boot syntax
- `@WebMvcTest` — loads a focused MVC slice; collaborators must be supplied through explicit mock
  bean overrides or imports rather than being replaced automatically
- `MockMvc` — exercise mapped controller requests without a live server and assert status, headers, JSON, validation, and exception mapping at the MVC boundary
- JSON-path MVC assertions — verify specific response fields and structures through `MockMvc` instead of comparing an entire JSON string
- `@SpringBootTest` — loads the full Spring application context, but external infrastructure is real
  only when the test config chooses it; use it for wiring and end-to-end application integration
  rather than every service rule
- `@DataJpaTest` — load a focused persistence slice and use its default embedded-database replacement or an explicitly configured real database according to query-fidelity risk
- Test database fidelity — an in-memory replacement is fast but can hide PostgreSQL-specific behaviour, so database-sensitive integration tests need deliberately configured real infrastructure
- Test configuration and profiles — override external dependencies and settings for tests without weakening production configuration or relying on a developer's local environment
- Unit vs slice vs full-context tests — choose an isolated class test, a focused Spring layer, or the complete application context according to the mechanism and configuration risk under test

## Tooling

- Spring Boot container packaging — build and run the executable application artifact in a container while supplying configuration externally and leaving generic container orchestration to the General topic
- Flyway vs `ddl-auto=update` — evolve schemas through ordered, reviewable migrations rather than allowing runtime ORM metadata to mutate a durable production database implicitly
- OpenAPI generation — expose a reviewable HTTP contract for frontend and QA consumers while verifying that generated operations, validation, and error responses match actual behaviour
- Startup diagnostics and logging — read Boot's condition/failure output and structured application logs to distinguish configuration, bean creation, port, and datasource failures before changing code
