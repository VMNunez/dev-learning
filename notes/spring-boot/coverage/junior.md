# Junior Coverage — Spring Boot

Concepts needed to build, test, explain, and debug a conventional Spring Boot REST application at junior level.

## Beans, injection, and startup diagnosis

- Component stereotypes — use `@Component` and its layer-specific stereotypes to make application classes discoverable while keeping each layer's responsibility explicit
- `@Repository` exception translation — the stereotype converts provider-specific persistence failures into Spring's `DataAccessException` family, so a constraint breach surfaces as `DataIntegrityViolationException` and can be mapped to a deliberate status
- `@Bean` vs component scanning — register third-party instances or explicit construction logic in configuration and use scanning for application-owned component classes
- Constructor injection — prefer it over field injection so dependencies are explicit, final, and easy to supply in tests; Spring infers injection when a component has one constructor
- Lombok constructors and Spring injection — `@RequiredArgsConstructor` can express constructor injection for final dependencies, while all-argument constructors are usually the wrong service boundary
- `@Qualifier` vs `@Primary` — select one bean explicitly at an injection point or declare a default candidate when several beans satisfy the same dependency type
- Bean scope and the singleton default — application beans are singleton-scoped by default, so mutable request-specific state on a service can leak across users and threads
- Proxy-based annotation behaviour — Spring applies transaction, security, and similar annotations by wrapping the bean in a proxy, so the annotation only takes effect on an injected bean invoked from outside and silently does nothing on a `new` instance or an internal call
- Bean lifecycle and startup failures — distinguish component scanning, bean creation, dependency resolution, and application startup so missing beans, ambiguous injection, and circular dependencies can be diagnosed from the failure report
- Startup diagnostics — read Boot's condition and failure-analysis output to distinguish configuration, bean creation, port, and datasource failures before changing code
- Application logging — obtain a logger through the SLF4J facade rather than printing to standard output, and raise or lower a package's level from configuration so a running application can be investigated without editing code

## REST controllers

- Spring MVC request dispatch — follow a request through the servlet dispatcher, handler mapping, argument resolution, message conversion, controller, and exception handling when diagnosing a failed endpoint
- `@Controller` vs `@RestController` — use view-oriented controller semantics for rendered responses and response-body semantics for APIs whose return values are written through message converters
- `@RequestMapping` without a method attribute — a class-level mapping contributes the shared path prefix, but the same annotation on a method matches every HTTP verb unless the verb is narrowed
- HTTP method mappings — select a method-specific mapping that matches the operation's HTTP semantics, including partial updates or state transitions rather than treating every write as POST
- `@PathVariable` vs `@RequestParam` — bind resource identity from the route and optional filtering or control values from the query string, with names and required/default behaviour declared explicitly
- `@RequestBody` — bind the request body to a Java object through the configured message converters instead of parsing the payload manually
- Unsupported media type on a request body — body binding is selected by the request's declared content type, so a missing or non-JSON `Content-Type` is rejected before the controller runs rather than surfacing as a validation failure
- `ResponseEntity<T>` — use it when status or headers vary dynamically; fixed statuses can use `@ResponseStatus`, while returning a body directly intentionally uses the framework's normal status
- Created responses and the resource location — build the new resource's URI from the current request when reporting a successful creation, rather than returning the entity with a default status
- HTTP message conversion and Jackson — content negotiation and configured message converters turn request and response bodies into Java values and JSON rather than the controller serialising text manually
- Jackson response shaping — rename, omit, or format individual fields through serialization annotations, and know that Boot registers Java date/time support so temporal fields serialise as ISO text rather than numeric objects
- Jackson deserialization requirements — an incoming body is populated through a record's canonical constructor, an annotated creator, or a no-argument constructor plus mutators, which is why an otherwise valid DTO can arrive with every field null
- Bidirectional relationship serialization — returning an entity whose association points back at its owner makes Jackson recurse until the response fails, so break the cycle at the boundary with a response DTO rather than patching it with reference annotations
- Request and response DTO implementation — implement incoming and outgoing contracts as separate records or classes and attach validation constraints to the untrusted input type only
- Entity-to-DTO mapping implementation — write the conversion by hand or generate it with an annotation-processor mapper whose implementation class exists only after a build, which is why a missing generated mapper is a build-configuration problem rather than absent source code
- `@JsonIgnore` and serialization access — an ignore annotation suppresses a field in both directions unless the access mode is narrowed, so it is a local serialization rule rather than a substitute for a dedicated response type
- Outbound HTTP calls — a Spring Boot service that consumes another API uses the framework's synchronous HTTP client; recognise the current fluent client and the older template still present in maintained codebases

## Request validation

- `@Valid` on `@RequestBody` — trigger cascaded validation of the deserialized request DTO at the controller boundary before business logic runs
- Nested and collection cascading — a nested object's own constraints run only when the field or the collection's type argument is marked `@Valid`, while container element constraints such as `List<@NotBlank String>` are checked without it, so a validated outer DTO can silently accept an invalid inner payload
- Validation starter and runtime integration — include Jakarta Validation plus its implementation and Spring integration so constraints are discovered and executed rather than merely present as metadata
- `@NotNull` vs `@NotEmpty` vs `@NotBlank` — choose whether null, emptiness, or whitespace-only text violates the input contract rather than applying one constraint to every field type
- Constraint selection — choose semantic constraints for sign, size, format, range, or pattern so the annotation matches the business rule rather than merely rejecting some bad examples
- Bean constraints vs database constraints — a validation annotation rejects bad input before business logic with a client error, while a column constraint fails at flush time as a server error, so the same rule expressed only in the schema produces the wrong response
- Controller method validation — apply constraints to controller parameters and handle their failures separately from request-body binding errors
- Body vs method validation failures — invalid `@RequestBody` binding and invalid method parameters use different exception families; handle both deliberately instead of assuming every violation is a `ConstraintViolationException`
- `@Valid` vs `@Validated` — use standard cascaded validation for request objects and Spring's validation groups or method-level proxy features only when those additional semantics are required

## Exception handling and error responses

- `@RestControllerAdvice` — combines `@ControllerAdvice` with `@ResponseBody` for JSON-oriented handlers; plain advice can also return JSON when its handler uses `ResponseEntity` or `@ResponseBody`
- `@ExceptionHandler` resolution — the most specific declared exception type wins over a supertype handler, and an advice's scope decides which controllers it serves, so an unexpectedly generic response usually means the wrong handler matched
- `ResponseStatusException` and `@ResponseStatus` on an exception — a status can be attached at the throw site or to the exception type instead of through advice; recognise all three routes because maintained code mixes them and the advice never fires for a status already resolved
- Domain exceptions — represent meaningful application failures as dedicated types so a handler can map each one to its intended status
- `MethodArgumentNotValidException` — Spring throws this when `@Valid` on a `@RequestBody` fails; handle it in `@RestControllerAdvice` to return 400 with field-level error messages; not catching it results in a verbose default Spring error body
- Error response contract — map failures to consistent status and body fields so API clients can handle validation, absence, conflict, and unexpected errors predictably
- Boot's default error handling — an exception no handler claims is forwarded to the built-in `/error` endpoint, which builds the status, timestamp, and path body and omits the exception message and binding details until the matching `server.error.include-*` properties are enabled
- Filter-chain exceptions vs controller advice — exceptions raised before controller dispatch do not automatically pass through `@RestControllerAdvice`, so authentication failures need handling at the security boundary
- Filter vs MVC interceptor vs controller advice — use servlet filters for request-chain concerns, interceptors around mapped handlers, and advice for controller exception/response behaviour

## Spring Data JPA — entity and relationship mapping

- Persistence context and entity state — recognise managed, detached, and removed entities and understand why dirty checking can flush a managed change without another repository `save()`
- `@Entity` requirements — a mapped type needs an identifier, an accessible no-argument constructor, and a non-final class, and a class missing the annotation entirely is not mapped at all
- Entity table naming — use `@Table` when the mapped table differs from the default and avoid reserved-word conflicts through a deliberate physical name, quoting policy, or naming strategy
- Identifier mapping and generation — mark the primary key and choose between identity columns and sequences according to the target database, because a bootstrap failure over a missing or unsupported identifier is reported before the application serves a request
- JPA column nullability and uniqueness — express schema intent on the mapping so the generated or validated schema matches the domain rules
- Lombok generated equality on entities — identifier-based `equals` and `hashCode` behave inconsistently while an entity is still unsaved, so generated implementations must be chosen deliberately rather than accepted by default
- Lombok generated `toString` on entities — including associations in a generated string can trigger lazy loading or recurse across a bidirectional relationship, so relationship fields must be excluded
- Boxed vs primitive boolean fields and Lombok getter naming — a `Boolean` field defaults to `getX()`, while a primitive `boolean` field defaults to `isX()` (JavaBean convention); switching a field's type to close a nullable-unboxing bug renames every call site's getter, and the compiler catches the mismatch
- Many-to-one ownership — map the foreign-key side with `@ManyToOne` and name its column with `@JoinColumn`
- `@OneToMany(mappedBy = "user")` — the inverse side of the relationship; `mappedBy` points to the field in the other entity that owns the FK; a one-to-many with neither `mappedBy` nor `@JoinColumn` produces an unexpected join table
- Many-to-many ownership — map the join table on one owning side with `@JoinTable` and point the inverse side back with `mappedBy` rather than creating two independent associations
- Cascade vs orphan removal — propagate selected persistence operations to related entities or delete a managed child when it is removed from its parent's collection
- Enum string vs ordinal persistence — store stable names when enum reordering or insertion must not silently change the meaning of existing rows
- Hibernate timestamps vs JPA lifecycle callbacks — choose provider convenience or portable entity callbacks deliberately when populating audit timestamps
- Flyway vs `ddl-auto=update` — evolve schemas through ordered, reviewable migrations rather than allowing runtime ORM metadata to mutate a durable production database implicitly

## Spring Data JPA — repositories and queries

- `JpaRepository` CRUD contract — recognise the inherited persistence, lookup, existence, listing, and deletion operations before declaring redundant repository methods
- `Optional` single-result contract — Spring Data returns an absent value rather than null from a single-result finder, which is what makes the "not found" branch explicit at the service boundary
- `findById` vs `getReferenceById` — one loads the row immediately and reports absence, the other returns an uninitialised reference that is cheap for setting a foreign key but fails on first access outside an open persistence context
- `save()` insert vs update — recognise that Spring Data decides whether an entity is new before delegating to persistence, so `save()` is not a synonym for SQL INSERT
- Derived query methods — let Spring Data derive simple lookups and existence checks from repository method names, switching approach when the name stops expressing the query clearly
- JPQL vs native SQL in `@Query` — prefer entity and attribute names for portable persistence queries and opt into database SQL only when the required behaviour justifies tighter coupling
- Interface-based projections — declare a getter-only interface matching the `AS` aliases of a `@Query` (or a derived query's implicit column names) and Spring Data populates it without a full entity or DTO class; read-only, and the getter names must match the aliases exactly
- `@Modifying` write queries — a declared update or delete query needs the modifying marker and an active transaction, and it bypasses the persistence context, so already-loaded entities can be left stale afterwards
- Spring Data pagination — accept a `Pageable` and return a bounded result, and know that page number, size, and sort arrive as request parameters bound automatically
- `Page<T>` vs `Slice<T>` — return total-count metadata only when the client needs it, because a slice can answer whether another chunk exists without an additional count query

## Query behaviour and diagnosis

- Generated-statement logging — enable Hibernate's SQL and binding output to see the statements the repository layer actually issues, because query count and shape are invisible from Java code alone
- N+1 problem — one query loads the list, then N extra queries load each lazy relationship in a loop; fix with `JOIN FETCH` in `@Query` or with `@EntityGraph`
- `FetchType.LAZY` vs `FetchType.EAGER` — deferred versus mandatory relationship loading, with the defaults deliberately asymmetric: to-one associations load eagerly and to-many associations lazily, so fetching must be chosen per use case rather than fixed globally
- Write timing and deferred failure — a persistence call stages work that reaches the database at flush or commit, so a constraint violation is reported at the transaction boundary rather than on the line that appeared to cause it
- Open EntityManager in View — recognise that Boot's web default can keep lazy loading available during response rendering, why this can hide query behaviour, and why DTO mapping should happen inside an explicit service transaction

## Transactions

- `@Transactional` atomicity and rollback — group one business operation in a transaction and know that the default rollback rules differ for unchecked and checked exceptions
- Spring's `@Transactional` vs the Jakarta annotation — two importable annotations of the same name carry different rollback defaults, so the import decides the behaviour
- `@Transactional(readOnly = true)` — declares read intent so the provider can skip dirty checking, while whether writes are actually refused depends on the driver and database rather than on Spring
- Transaction boundary placement — put the annotation on the externally invoked, proxy-eligible service method that spans the whole business operation, not on a controller, a private method, or a single repository call
- Spring Data repository default transactionality — repository CRUD methods carry their own `@Transactional`, so an unannotated service commits every call as its own transaction with no atomicity across them, which is why the service boundary is a deliberate decision rather than an optional annotation
- `LazyInitializationException` — thrown when you access a `LAZY` relationship after the Hibernate session is closed (outside the `@Transactional` boundary); fix by converting to DTO inside the `@Transactional` method, or by using `JOIN FETCH` to load the relationship eagerly in the query
- Caught exceptions and rollback — swallowing a failure inside a transactional method can let the proxy observe normal completion and commit unless rollback is re-established deliberately

## Spring Security — chain configuration and access rules

- Web security activation — Boot activates web security from the classpath without an explicit enabling annotation, while method security is a separate switch that must be turned on deliberately
- `SecurityFilterChain` — declare the chain as a bean and place a custom authentication filter at the correct position relative to the framework's own filters, because order decides what has already run when it executes
- Security route rules — declare specific public and role-protected matchers before the authenticated catch-all because matcher order controls which rule applies
- `@PreAuthorize("hasRole('MANAGER')")` — a method-level check evaluated after authentication, which is silently ignored unless method security is enabled
- URL rules vs method-level checks — the two enforcement points are independent, so a permitted route can still be refused by an annotation and a protected route is refused before the method is ever reached
- `hasRole` vs `hasAuthority` and the `ROLE_` prefix — role checks add the prefix for you while authority checks compare the stored string literally, so a mismatch between how authorities are persisted and how they are checked rejects a correctly authenticated user
- `AuthenticationEntryPoint` and `AccessDeniedHandler` — the two components that produce the response when the request is unauthenticated or authenticated without sufficient authority, and the only way to give those failures the same JSON error contract as the rest of the API
- Stateless session configuration — a bearer-token API sets the session creation policy so no server session is established, which is what makes each request stand alone
- CSRF configuration for a bearer-token API — the decision to disable or retain CSRF follows from how credentials travel, so a cookie-authenticated endpoint in the same application still needs it
- CORS with Spring Security — a shared `CorsConfigurationSource` keeps policy central and lets the security chain handle preflight; `@CrossOrigin` can still be valid for deliberately local controller policy
- Preflight through the security chain — permit or correctly process browser `OPTIONS` requests so authentication rules do not reject the preflight before the real cross-origin request is sent

## Spring Security — authentication and JWT

- `UserDetailsService.loadUserByUsername()` — the one method you implement to tell Spring how to load your users from the database; called automatically by `DaoAuthenticationProvider` during login; you never call it yourself
- `PasswordEncoder` contract — verify a submitted password by matching it against the stored encoded value through the encoder, never by comparing or reversing the stored string
- `DelegatingPasswordEncoder` and encoded-id prefixes — recognise stored values such as `{bcrypt}...` and understand that the prefix is what selects the encoder used to verify them
- `AuthenticationManager` delegation — authenticating a submitted credential runs the configured provider, which loads the user through `UserDetailsService` and verifies the password through the encoder
- Exposing the authentication manager — the manager is not injectable by default, so a login service that authenticates programmatically must publish it as a bean from the security configuration
- `OncePerRequestFilter` — process JWT authentication once in the normal request dispatch and always continue or terminate the filter chain deliberately
- `SecurityContextHolder` — thread-local storage where the authentication filter places the authenticated principal for the current request, and where a service reads it from
- `@AuthenticationPrincipal` — resolve the authenticated user as a controller method argument instead of reaching into the static context holder
- Anonymous authentication — an unauthenticated request may still have an anonymous `Authentication` object, so code must check authentication state rather than assuming the context value is null
- `UsernamePasswordAuthenticationToken` 2-arg vs 3-arg — 2-arg (no authorities) is unverified credentials passed to `authenticate()`; 3-arg (with authorities) is a confirmed authentication stored in `SecurityContextHolder`; the distinction matters when reading JwtFilter code
- JWT issuance — derive a signing key from configured secret material and sign the claims the application will later trust, keeping that material out of the source tree
- JWT validation failure modes — parsing under the same algorithm and key distinguishes an expired token, a malformed token, and a bad signature, and each should reach the client as a deliberate response rather than a server error
- JWT claim-to-authority mapping — load the user or map trusted role claims into Spring Security authorities before placing the authenticated token in `SecurityContextHolder`

## Testing

- Plain service unit tests — use JUnit and Mockito without a Spring context when the risk is business logic and collaborator interaction rather than framework wiring
- Mockito mock vs context bean override — `@Mock` creates a standalone test double, while replacing a bean in a Spring test context uses `@MockitoBean`; `@MockBean` is the legacy Boot annotation from a different package and is still what maintained projects import
- `@WebMvcTest` — loads a focused MVC slice; collaborators must be supplied through explicit mock bean overrides or imports rather than being replaced automatically
- Security in an MVC slice test — the slice applies the security filter chain, so requests are rejected before reaching the controller unless the test supplies an authenticated principal or the chain is deliberately excluded
- `MockMvc` — exercise mapped controller requests through the real dispatcher, converters, and advice without starting a server
- JSON-path MVC assertions — verify specific response fields and structures through `MockMvc` instead of comparing an entire JSON string
- `@SpringBootTest` — loads the full Spring application context, but external infrastructure is real only when the test config chooses it; use it for wiring and end-to-end application integration rather than every service rule
- `@DataJpaTest` — load a focused persistence slice with a transactional, rolled-back test so repository queries run against a real mapping
- Test database fidelity — an in-memory replacement is fast but can hide PostgreSQL-specific behaviour, so database-sensitive integration tests need deliberately configured real infrastructure
- Test configuration and profiles — override external dependencies and settings for tests without weakening production configuration or relying on a developer's local environment
- Tests that cannot fail — recognise the mocked-collaborator test that asserts only on its own stubbing, the interaction check with no state assertion, and the slice test whose subject is itself replaced by a mock, because such a test reports green regardless of the production code
- Unit vs slice vs full-context tests — choose an isolated class test, a focused Spring layer, or the complete application context according to the mechanism and configuration risk under test

## Configuration and profiles

- Externalized configuration and property precedence — keep environment-specific values outside code and recognise that command-line arguments, environment variables, profile files, and base configuration can override one another
- Profile-specific configuration files — profile values live either in an `application-{profile}` file or in one multi-document file whose sections are separated by `---` in YAML or `#---` in properties and selected with `spring.config.activate.on-profile`
- Datasource and persistence properties — connect the application to a real database through its URL, credentials, and driver settings, and recognise what each `ddl-auto` value does to an existing schema
- Profiles — activate environment-specific beans and configuration deliberately without treating a profile as a secrets store
- `@Value` vs `@ConfigurationProperties` — inject an isolated value directly or bind and validate a cohesive typed configuration group when several related settings belong together
- SQL initialization — understand when Boot runs `schema.sql` and `data.sql` and how initialization differs for embedded and external databases

## Boot runtime model and packaging

- Spring Framework vs Spring Boot — distinguish the core container and framework modules from Boot's opinionated auto-configuration, starters, executable packaging, and operational defaults
- `@SpringBootApplication` — combines configuration, auto-configuration, and component scanning; place it in a root package so the default scan reaches application components
- Auto-configuration and starters — Boot configures infrastructure conditionally from the classpath, properties, and existing beans, while starters provide a compatible dependency set rather than generating application code
- Embedded server and executable JAR — a servlet web starter supplies an embedded server so the packaged application can run without deploying a WAR to an external container
- `spring-boot-starter-parent` and dependency management — inherit compatible dependency and plugin versions while distinguishing that Boot-specific build behaviour from Maven's generic lifecycle
- Spring Boot Maven plugin — package an executable archive and run the application through Boot-specific goals without confusing the plugin with dependency management

## Maintained-code recognition

- `jakarta.*` vs `javax.*` imports — recognise that current Boot versions moved the persistence, validation, and servlet namespaces, so a maintained codebase or a copied snippet on the wrong namespace fails to compile or is silently ignored
- `SecurityFilterChain` bean vs `WebSecurityConfigurerAdapter` — current configuration declares a chain bean with the lambda DSL, while the removed adapter base class survives in maintained codebases and in most copied examples, so recognise both and know why one no longer compiles
- Repository interface hierarchy — `CrudRepository`, `PagingAndSortingRepository`, and `JpaRepository` extend one another with progressively more operations, so recognise which one a maintained codebase declared and what that choice does and does not provide
- Field injection and `@Autowired` — recognise the older field- and setter-injected style still common in maintained code, and be able to state what constructor injection gives up when it is replaced
- Service interface plus `Impl` implementation — recognise the pervasive split where the injected type is an interface and the behaviour lives in a separate implementation class, and know that Boot proxies classes by default, so the interface is a maintained-code convention and a test-substitution seam rather than a technical requirement for proxying

## Delivery and API contract

- Spring Boot container packaging — build and run the executable application artifact in a container while supplying configuration externally and leaving generic container orchestration to the General topic
- OpenAPI generation — expose a browsable, generated HTTP contract for frontend and QA consumers from the existing controller and DTO declarations
