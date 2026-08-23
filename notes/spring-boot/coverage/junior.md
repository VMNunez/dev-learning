# Junior Coverage — Spring Boot

Concepts needed to build, test, explain, and debug a conventional Spring Boot REST application at junior level.

## Startup callbacks and diagnosis

- `CommandLineRunner` startup callback — run one-off work once after the context is fully built and every bean is available, instead of a constructor or static initialiser that fires before the application is ready; it runs on every boot, so the work must be idempotent ✅ 07-timetrack
- Startup diagnostics — read Boot's condition and failure-analysis output to distinguish configuration, bean creation, port, and datasource failures before changing code
- Application logging — obtain a logger through the SLF4J facade rather than printing to standard output, and raise or lower a package's level from configuration so a running application can be investigated without editing code ✅ 07-timetrack

## REST controllers

- Spring MVC request dispatch — follow a request through the servlet dispatcher, handler mapping, argument resolution, message conversion, controller, and exception handling when diagnosing a failed endpoint
- `@Controller` vs `@RestController` — use view-oriented controller semantics for rendered responses and response-body semantics for APIs whose return values are written through message converters ✅ 07-timetrack
- `@RequestMapping` without a method attribute — a class-level mapping contributes the shared path prefix, but the same annotation on a method matches every HTTP verb unless the verb is narrowed ✅ 07-timetrack
- HTTP method mappings — select a method-specific mapping that matches the operation's HTTP semantics, including partial updates or state transitions rather than treating every write as POST ✅ 07-timetrack
- `@PathVariable` vs `@RequestParam` — bind resource identity from the route and optional filtering or control values from the query string, with names and required/default behaviour declared explicitly ✅ 07-timetrack
- `@RequestBody` — bind the request body to a Java object through the configured message converters instead of parsing the payload manually ✅ 07-timetrack
- Unsupported media type on a request body — body binding is selected by the request's declared content type, so a missing or non-JSON `Content-Type` is rejected before the controller runs rather than surfacing as a validation failure
- `ResponseEntity<T>` — use it when status or headers vary dynamically; fixed statuses can use `@ResponseStatus`, while returning a body directly intentionally uses the framework's normal status ✅ 07-timetrack
- `ResponseEntity` status factories — `ok`, `created`, `noContent`, and `badRequest` state the response's meaning at the call site, so the status is a checked constant rather than an integer literal no compiler can validate ✅ 07-timetrack
- Created responses and the resource location — build the new resource's URI from the current request when reporting a successful creation, rather than returning the entity with a default status ✅ 07-timetrack
- HTTP message conversion and Jackson — content negotiation and configured message converters turn request and response bodies into Java values and JSON rather than the controller serialising text manually ✅ 07-timetrack
- Jackson response shaping — rename, omit, or format individual fields through serialization annotations, and know that Boot registers Java date/time support so temporal fields serialise as ISO text rather than numeric objects ✅ 07-timetrack
- Jackson deserialization requirements — an incoming body is populated through a record's canonical constructor, an annotated creator, or a no-argument constructor plus mutators, which is why an otherwise valid DTO can arrive with every field null ✅ 07-timetrack
- Bidirectional relationship serialization — returning an entity whose association points back at its owner makes Jackson recurse until the response fails, so break the cycle at the boundary with a response DTO rather than patching it with reference annotations
- Request and response DTO implementation — implement incoming and outgoing contracts as separate records or classes and attach validation constraints to the untrusted input type only ✅ 07-timetrack
- Entity-to-DTO mapping implementation — write the conversion by hand or generate it with an annotation-processor mapper whose implementation class exists only after a build, which is why a missing generated mapper is a build-configuration problem rather than absent source code ✅ 07-timetrack
- `@JsonIgnore` and serialization access — an ignore annotation suppresses a field in both directions unless the access mode is narrowed, so it is a local serialization rule rather than a substitute for a dedicated response type
- Outbound HTTP calls — a Spring Boot service that consumes another API uses the framework's synchronous HTTP client; recognise the current fluent client and the older template still present in maintained codebases

## Request validation

- `@Valid` on `@RequestBody` — trigger cascaded validation of the deserialized request DTO at the controller boundary before business logic runs ✅ 07-timetrack
- Nested and collection cascading — a nested object's own constraints run only when the field or the collection's type argument is marked `@Valid`, while container element constraints such as `List<@NotBlank String>` are checked without it, so a validated outer DTO can silently accept an invalid inner payload
- Validation starter and runtime integration — include Jakarta Validation plus its implementation and Spring integration so constraints are discovered and executed rather than merely present as metadata ✅ 07-timetrack
- `@NotNull` vs `@NotEmpty` vs `@NotBlank` — choose whether null, emptiness, or whitespace-only text violates the input contract rather than applying one constraint to every field type ✅ 07-timetrack
- Constraint selection — choose semantic constraints for sign, size, format, range, or pattern so the annotation matches the business rule rather than merely rejecting some bad examples ✅ 07-timetrack
- Bean constraints vs database constraints — a validation annotation rejects bad input before business logic with a client error, while a column constraint fails at flush time as a server error, so the same rule expressed only in the schema produces the wrong response ✅ 07-timetrack
- Controller method validation — apply constraints to controller parameters and handle their failures separately from request-body binding errors
- Body vs method validation failures — invalid `@RequestBody` binding and invalid method parameters use different exception families; handle both deliberately instead of assuming every violation is a `ConstraintViolationException`

## Exception handling and error responses

- `@RestControllerAdvice` — combines `@ControllerAdvice` with `@ResponseBody` for JSON-oriented handlers; plain advice can also return JSON when its handler uses `ResponseEntity` or `@ResponseBody` ✅ 07-timetrack
- `@ExceptionHandler` resolution — the most specific declared exception type wins over a supertype handler, and an advice's scope decides which controllers it serves, so an unexpectedly generic response usually means the wrong handler matched ✅ 07-timetrack
- `ResponseStatusException` and `@ResponseStatus` on an exception — a status can be attached at the throw site or to the exception type instead of through advice; recognise all three routes because maintained code mixes them and the advice never fires for a status already resolved
- Domain exceptions — represent meaningful application failures as dedicated types so a handler can map each one to its intended status ✅ 07-timetrack
- A custom exception vs Spring Security's `AccessDeniedException` — a hand-thrown business-rule exception has no inheritance relationship with the framework's own, even when both are mapped to 403; each needs its own `@ExceptionHandler` ✅ 07-timetrack
- `MethodArgumentNotValidException` — Spring throws this when `@Valid` on a `@RequestBody` fails; handle it in `@RestControllerAdvice` to return 400 with field-level error messages; not catching it results in a verbose default Spring error body ✅ 07-timetrack
- Error response contract — map failures to consistent status and body fields so API clients can handle validation, absence, conflict, and unexpected errors predictably ✅ 07-timetrack
- Boot's default error handling — an exception no handler claims is forwarded to the built-in `/error` endpoint, which builds the status, timestamp, and path body and omits the exception message and binding details until the matching `server.error.include-*` properties are enabled
- Filter-chain exceptions vs controller advice — exceptions raised before controller dispatch do not automatically pass through `@RestControllerAdvice`, so authentication failures need handling at the security boundary ✅ 07-timetrack
- Filter vs MVC interceptor vs controller advice — use servlet filters for request-chain concerns, interceptors around mapped handlers, and advice for controller exception/response behaviour

## Spring Data JPA — entity and relationship mapping

- Persistence context and entity state — recognise managed, detached, and removed entities and understand why dirty checking can flush a managed change without another repository `save()`
- `@Entity` requirements — a mapped type needs an identifier, an accessible no-argument constructor, and a non-final class, and a class missing the annotation entirely is not mapped at all ✅ 07-timetrack
- Entity table naming — use `@Table` when the mapped table differs from the default and avoid reserved-word conflicts through a deliberate physical name, quoting policy, or naming strategy ✅ 07-timetrack
- Identifier mapping and generation — mark the primary key and choose between identity columns and sequences according to the target database, because a bootstrap failure over a missing or unsupported identifier is reported before the application serves a request ✅ 07-timetrack
- JPA column nullability and uniqueness — express schema intent on the mapping so the generated or validated schema matches the domain rules ✅ 07-timetrack
- Lombok generated equality on entities — identifier-based `equals` and `hashCode` behave inconsistently while an entity is still unsaved, so generated implementations must be chosen deliberately rather than accepted by default ✅ 07-timetrack
- Lombok generated `toString` on entities — including associations in a generated string can trigger lazy loading or recurse across a bidirectional relationship, so relationship fields must be excluded ✅ 07-timetrack
- Boxed vs primitive boolean fields and Lombok getter naming — a `Boolean` field defaults to `getX()`, while a primitive `boolean` field defaults to `isX()` (JavaBean convention); switching a field's type to close a nullable-unboxing bug renames every call site's getter, and the compiler catches the mismatch ✅ 07-timetrack
- Many-to-one ownership — map the foreign-key side with `@ManyToOne` and name its column with `@JoinColumn` ✅ 07-timetrack
- `@OneToMany(mappedBy = "user")` — the inverse side of the relationship; `mappedBy` points to the field in the other entity that owns the FK; a one-to-many with neither `mappedBy` nor `@JoinColumn` produces an unexpected join table
- Many-to-many ownership — map the join table on one owning side with `@JoinTable` and point the inverse side back with `mappedBy` rather than creating two independent associations
- Cascade vs orphan removal — propagate selected persistence operations to related entities or delete a managed child when it is removed from its parent's collection
- Enum string vs ordinal persistence — store stable names when enum reordering or insertion must not silently change the meaning of existing rows ✅ 07-timetrack
- Hibernate timestamps vs JPA lifecycle callbacks — choose provider convenience or portable entity callbacks deliberately when populating audit timestamps ✅ 07-timetrack
- Flyway vs `ddl-auto=update` — evolve schemas through ordered, reviewable migrations rather than allowing runtime ORM metadata to mutate a durable production database implicitly

## Spring Data JPA — repositories and queries

- `JpaRepository` CRUD contract — recognise the inherited persistence, lookup, existence, listing, and deletion operations before declaring redundant repository methods ✅ 07-timetrack
- `Optional` single-result contract — Spring Data returns an absent value rather than null from a single-result finder, which is what makes the "not found" branch explicit at the service boundary ✅ 07-timetrack
- `findById` vs `getReferenceById` — one loads the row immediately and reports absence, the other returns an uninitialised reference that is cheap for setting a foreign key but fails on first access outside an open persistence context
- `save()` insert vs update — recognise that Spring Data decides whether an entity is new before delegating to persistence, so `save()` is not a synonym for SQL INSERT ✅ 07-timetrack
- Derived query methods — let Spring Data derive simple lookups and existence checks from repository method names, switching approach when the name stops expressing the query clearly ✅ 07-timetrack
- `Sort` as a repository parameter — hand a `Sort` to `findAll` or add it as the last parameter of a derived query, and Spring Data applies the ordering on top of the query rather than parsing it as a criterion; `Sort.Order` gives each key its own direction when one blanket `.ascending()` would be wrong ✅ 07-timetrack
- JPQL vs native SQL in `@Query` — prefer entity and attribute names for portable persistence queries and opt into database SQL only when the required behaviour justifies tighter coupling ✅ 07-timetrack
- Interface-based projections — declare a getter-only interface matching the `AS` aliases of a `@Query` (or a derived query's implicit column names) and Spring Data populates it without a full entity or DTO class; read-only, and the getter names must match the aliases exactly ✅ 07-timetrack
- `@Modifying` write queries — a declared update or delete query needs the modifying marker and an active transaction, and it bypasses the persistence context, so already-loaded entities can be left stale afterwards
- Spring Data pagination — accept a `Pageable` and return a bounded result, and know that page number, size, and sort arrive as request parameters bound automatically ✅ 07-timetrack
- `Page<T>` vs `Slice<T>` — return total-count metadata only when the client needs it, because a slice can answer whether another chunk exists without an additional count query

## Query behaviour and diagnosis

- Generated-statement logging — enable Hibernate's SQL and binding output to see the statements the repository layer actually issues, because query count and shape are invisible from Java code alone ✅ 07-timetrack
- N+1 problem — one query loads the list, then N extra queries load each lazy relationship in a loop; fix with `JOIN FETCH` in `@Query` or with `@EntityGraph` ✅ 07-timetrack
- `FetchType.LAZY` vs `FetchType.EAGER` — deferred versus mandatory relationship loading, with the defaults deliberately asymmetric: to-one associations load eagerly and to-many associations lazily, so fetching must be chosen per use case rather than fixed globally ✅ 07-timetrack
- Write timing and deferred failure — a persistence call stages work that reaches the database at flush or commit, so a constraint violation is reported at the transaction boundary rather than on the line that appeared to cause it
- Open EntityManager in View — recognise that Boot's web default can keep lazy loading available during response rendering, why this can hide query behaviour, and why DTO mapping should happen inside an explicit service transaction ✅ 07-timetrack

## Transaction-aware persistence

- Spring Data repository default transactionality — repository CRUD methods carry their own transaction boundary, so an unannotated service commits every call independently with no atomicity across the whole use case ✅ 07-timetrack
- `LazyInitializationException` — thrown when you access a `LAZY` relationship after the Hibernate session is closed; fix by converting to a DTO inside the service transaction or loading the relationship deliberately in the query ✅ 07-timetrack

## Spring Security — chain configuration and access rules

- Web security activation — Boot activates web security from the classpath without an explicit enabling annotation, while method security is a separate switch that must be turned on deliberately ✅ 07-timetrack
- `SecurityFilterChain` — declare the chain as a bean and place a custom authentication filter at the correct position relative to the framework's own filters, because order decides what has already run when it executes ✅ 07-timetrack
- Security route rules — declare specific public and role-protected matchers before the authenticated catch-all because matcher order controls which rule applies ✅ 07-timetrack
- `@PreAuthorize("hasRole('MANAGER')")` — a method-level check evaluated after authentication, which is silently ignored unless method security is enabled ✅ 07-timetrack
- URL rules vs method-level checks — the two enforcement points are independent, so a permitted route can still be refused by an annotation and a protected route is refused before the method is ever reached ✅ 07-timetrack
- `hasRole` vs `hasAuthority` and the `ROLE_` prefix — role checks add the prefix for you while authority checks compare the stored string literally, so a mismatch between how authorities are persisted and how they are checked rejects a correctly authenticated user ✅ 07-timetrack
- `AuthenticationEntryPoint` — produces the response when a request arrives unauthenticated, and is the only way to give that failure the same JSON error contract as the rest of the API, because it fires in the filter chain before any controller advice can see it ✅ 07-timetrack
- `AccessDeniedHandler` — produces the response when an authenticated caller lacks the required authority, the security-boundary counterpart to handling `AccessDeniedException` in controller advice; where the refusal happens decides which one fires
- Re-checking account status per request, not just at login — a token issued before an account is disabled stays technically valid until it expires, so a stateless JWT filter must re-run an account-status check (`AccountStatusUserDetailsChecker`) on every request against the freshly loaded `UserDetails`, not rely on the check `loadUserByUsername` already ran once at login ✅ 07-timetrack
- Stateless session configuration — a bearer-token API sets the session creation policy so no server session is established, which is what makes each request stand alone ✅ 07-timetrack
- CSRF configuration for a bearer-token API — the decision to disable or retain CSRF follows from how credentials travel, so a cookie-authenticated endpoint in the same application still needs it ✅ 07-timetrack
- CORS with Spring Security — a shared `CorsConfigurationSource` keeps policy central and lets the security chain handle preflight; `@CrossOrigin` can still be valid for deliberately local controller policy ✅ 07-timetrack
- Preflight through the security chain — permit or correctly process browser `OPTIONS` requests so authentication rules do not reject the preflight before the real cross-origin request is sent ✅ 07-timetrack

## Spring Security — authentication and JWT

- `UserDetailsService.loadUserByUsername()` — the one method you implement to tell Spring how to load your users from the database; called automatically by `DaoAuthenticationProvider` during login; you never call it yourself ✅ 07-timetrack
- `PasswordEncoder` contract — verify a submitted password by matching it against the stored encoded value through the encoder, never by comparing or reversing the stored string ✅ 07-timetrack
- `DelegatingPasswordEncoder` and encoded-id prefixes — recognise stored values such as `{bcrypt}...` and understand that the prefix is what selects the encoder used to verify them
- `AuthenticationManager` delegation — authenticating a submitted credential runs the configured provider, which loads the user through `UserDetailsService` and verifies the password through the encoder ✅ 07-timetrack
- Exposing the authentication manager — the manager is not injectable by default, so a login service that authenticates programmatically must publish it as a bean from the security configuration ✅ 07-timetrack
- `OncePerRequestFilter` — process JWT authentication once in the normal request dispatch and always continue or terminate the filter chain deliberately ✅ 07-timetrack
- `SecurityContextHolder` — thread-local storage where the authentication filter places the authenticated principal for the current request, and where a service reads it from ✅ 07-timetrack
- `@AuthenticationPrincipal` — resolve the authenticated user as a controller method argument instead of reaching into the static context holder
- Anonymous authentication — an unauthenticated request may still have an anonymous `Authentication` object, so code must check authentication state rather than assuming the context value is null
- `UsernamePasswordAuthenticationToken` 2-arg vs 3-arg — 2-arg (no authorities) is unverified credentials passed to `authenticate()`; 3-arg (with authorities) is a confirmed authentication stored in `SecurityContextHolder`; the distinction matters when reading JwtFilter code ✅ 07-timetrack
- JWT issuance — derive a signing key from configured secret material and sign the claims the application will later trust, keeping that material out of the source tree ✅ 07-timetrack
- JWT validation failure modes — parsing under the same algorithm and key distinguishes an expired token, a malformed token, and a bad signature, and each should reach the client as a deliberate response rather than a server error
- A library's exception hierarchy is not the whole failure surface — a JWT parser signals an absent, empty, or blank token with `IllegalArgumentException`, which is unrelated to its own `JwtException` family, so a filter catching only that family lets the case escape past the security boundary and the caller receives the container's default error page instead of the API's error contract ✅ 07-timetrack — `JwtFilter`'s catch lists `IllegalArgumentException` beside `JwtException`, so `Authorization: Bearer ` with an empty token returns the `JwtAuthenticationEntryPoint` 401 body instead of a container 500
- JWT claim-to-authority mapping — load the user or map trusted role claims into Spring Security authorities before placing the authenticated token in `SecurityContextHolder` ✅ 07-timetrack

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

- Externalized configuration and property precedence — keep environment-specific values outside code and recognise that command-line arguments, environment variables, profile files, and base configuration can override one another ✅ 07-timetrack
- Profile-specific configuration files — profile values live either in an `application-{profile}` file or in one multi-document file whose sections are separated by `---` in YAML or `#---` in properties and selected with `spring.config.activate.on-profile` ✅ 07-timetrack
- Datasource and persistence properties — connect the application to a real database through its URL, credentials, and driver settings, and recognise what each `ddl-auto` value does to an existing schema ✅ 07-timetrack
- Profiles — activate environment-specific beans and configuration deliberately without treating a profile as a secrets store ✅ 07-timetrack
- `@Value` vs `@ConfigurationProperties` — inject an isolated value directly or bind and validate a cohesive typed configuration group when several related settings belong together ✅ 07-timetrack
- SQL initialization — understand when Boot runs `schema.sql` and `data.sql` and how initialization differs for embedded and external databases ✅ 07-timetrack

## Boot runtime model and packaging

- Spring Framework vs Spring Boot — distinguish the core container and framework modules from Boot's opinionated auto-configuration, starters, executable packaging, and operational defaults
- `@SpringBootApplication` — combines configuration, auto-configuration, and component scanning; place it in a root package so the default scan reaches application components
- Auto-configuration and starters — Boot configures infrastructure conditionally from the classpath, properties, and existing beans, while starters provide a compatible dependency set rather than generating application code ✅ 07-timetrack
- Embedded server and executable JAR — a servlet web starter supplies an embedded server so the packaged application can run without deploying a WAR to an external container
- `spring-boot-starter-parent` and dependency management — inherit compatible dependency and plugin versions while distinguishing that Boot-specific build behaviour from Maven's generic lifecycle
- Spring Boot Maven plugin — package an executable archive and run the application through Boot-specific goals without confusing the plugin with dependency management

## Maintained-code recognition

- `jakarta.*` vs `javax.*` imports — recognise that current Boot versions moved the persistence, validation, and servlet namespaces, so a maintained codebase or a copied snippet on the wrong namespace fails to compile or is silently ignored
- `SecurityFilterChain` bean vs `WebSecurityConfigurerAdapter` — current configuration declares a chain bean with the lambda DSL, while the removed adapter base class survives in maintained codebases and in most copied examples, so recognise both and know why one no longer compiles
- Repository interface hierarchy — `CrudRepository`, `PagingAndSortingRepository`, and `JpaRepository` extend one another with progressively more operations, so recognise which one a maintained codebase declared and what that choice does and does not provide
- Service interface plus `Impl` implementation — recognise the pervasive split where the injected type is an interface and the behaviour lives in a separate implementation class, and know that Boot proxies classes by default, so the interface is a maintained-code convention and a test-substitution seam rather than a technical requirement for proxying

## Delivery and API contract

- Spring Boot container packaging — build and run the executable application artifact in a container while supplying configuration externally and leaving generic container orchestration to the General topic
- OpenAPI generation — expose a browsable, generated HTTP contract for frontend and QA consumers from the existing controller and DTO declarations
