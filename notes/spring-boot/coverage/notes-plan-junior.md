# Spring Boot Junior Notes Plan

Plan status: current
Coverage: notes/spring-boot/coverage/junior.md
Coverage SHA-256: 43a1261ffb5b6c97fac6c115e6785cceabbab620ec29885247101ac1ac453b98
Generated: 2026-07-27

## 00 — What Spring Boot is and how this topic is organised

Status: pending
Action: audit
English: notes/spring-boot/junior/en/00-intro-spring-boot.md
Spanish: notes/spring-boot/junior/es/00-introduccion-spring-boot.md
Depends on: none

Narrative role: the entry point of the whole topic. Victor arrives knowing JavaScript, TypeScript and
Angular but never having run a Java backend, so this chapter has to establish what Spring Boot is,
what problem it was built for, the one mental model (a container that builds and wires your objects
for you) that every later chapter reuses, and the route the rest of the files take. It must also
state the assumed Java baseline — classes, interfaces, generics, records and exceptions — and link to
`notes/java/junior/en/` for it, so the reader knows what this topic does not re-teach.

Learning outcome: Victor can explain in his own words what Spring Boot is, what work it takes off a
backend developer, how a request travels through the layers of a Spring Boot application, where it
sits in the Angular + Java stack he is being hired for, and why the files that follow are ordered the
way they are.

Prerequisites: none.

Must answer:

- What is actually running when someone says "the Spring Boot application is up"?
- Who creates the objects in a Spring Boot application if the code never calls `new` on them?
- What are the layers of this kind of application, what does each one own, and why does the boundary
  between them turn out to be where transactions and DTOs live?
- Where does an incoming HTTP request go, layer by layer, before a response comes back?
- Which parts of this map onto things already known from Angular's dependency injection, and where
  does that comparison stop being true?
- Where does Spring Boot sit in the stack Victor is targeting — what is on the other side of the API
  he will build, and what does a Spanish consultancy expect a junior to own here?
- What order do the following files come in, why is that the order that works, and which files in the
  folder are not part of this route?

Coverage concepts:

- Spring Framework vs Spring Boot — distinguish the core container and framework modules from Boot's opinionated auto-configuration, starters, executable packaging, and operational defaults

Rationale: the introduction owns the single distinction that names the topic — framework versus
Boot — and hangs the orientation, the mental model, the stack context and the route map off it.

Handoff: once the reader knows there is a container, a set of layers and an opinionated startup, the
next question is entirely practical — how a real project is created, configured and started. That is
chapter 01.

## 01 — Creating, configuring and packaging a Spring Boot application

Status: pending
Action: audit
English: notes/spring-boot/junior/en/01-basics.md
Spanish: notes/spring-boot/junior/es/01-basicos.md
Depends on: 00

Narrative role: chapter 00 described what Boot does; this chapter is where Victor actually has one
running. It covers the mechanisms behind the project he generated — the starters and the
auto-configuration that make a dependency "just work", the annotation on the main class, the build
that produces a runnable artifact, and the properties that connect the application to a real database
without hardcoding anything.

Learning outcome: Victor can create a Spring Boot project, explain what each starter and the Maven
parent contribute, describe how auto-configuration decides what to configure, package and run the
application, and externalise its environment-specific settings including database connection and
startup SQL.

Prerequisites: 00.

Must answer:

- Why does adding one dependency give a working web server with no configuration file?
- What is a starter actually made of, and why is it not code generation?
- What three things does `@SpringBootApplication` switch on, and what breaks if the class sits in the
  wrong package?
- If the same property is set in a properties file, an environment variable and the command line,
  which one wins, and why is that ordering useful?
- The parent POM and the Boot Maven plugin are both "Spring Boot build things" — which one decides
  dependency versions and which one produces the runnable artifact?
- What does each `ddl-auto` value do to a database that already has tables and rows in it?
- When does Boot run `schema.sql` and `data.sql`, and why can a seeding script silently do nothing?

Coverage concepts:

- `@SpringBootApplication` — combines configuration, auto-configuration, and component scanning; place it in a root package so the default scan reaches application components
- Auto-configuration and starters — Boot configures infrastructure conditionally from the classpath, properties, and existing beans, while starters provide a compatible dependency set rather than generating application code
- Embedded server and executable JAR — a servlet web starter supplies an embedded server so the packaged application can run without deploying a WAR to an external container
- `spring-boot-starter-parent` and dependency management — inherit compatible dependency and plugin versions while distinguishing that Boot-specific build behaviour from Maven's generic lifecycle
- Spring Boot Maven plugin — package an executable archive and run the application through Boot-specific goals without confusing the plugin with dependency management
- Externalized configuration and property precedence — keep environment-specific values outside code and recognise that command-line arguments, environment variables, profile files, and base configuration can override one another
- Datasource and persistence properties — connect the application to a real database through its URL, credentials, and driver settings, and recognise what each `ddl-auto` value does to an existing schema
- SQL initialization — understand when Boot runs `schema.sql` and `data.sql` and how initialization differs for embedded and external databases

Rationale: these concepts are the single act of getting one application built, started and pointed at
its environment — the dependency set, the entry point, the packaging, and the settings the running
process reads.

Handoff: the application now starts and talks to a database, but it answers no HTTP request yet. The
next chapter opens the door that clients actually knock on.

## 02 — REST controllers: the HTTP boundary

Status: pending
Action: audit
English: notes/spring-boot/junior/en/02-rest-controllers.md
Spanish: notes/spring-boot/junior/es/02-controladores-rest.md
Depends on: 00, 01

Narrative role: the first chapter where the application does something a client can see. It follows
one request from the servlet dispatcher to a controller method and back out as JSON, draws the line —
the DTO boundary — that every later chapter respects, and ends by publishing that boundary as a
contract other people can read. Two terms arrive here before they are taught and must carry the
standard's forward-reference callout rather than being used bare: `@Valid` (taught in 07 — read it
for now as "reject this body if its constraints fail") and *entity* / *bidirectional relationship*
(taught in 04 — here they appear only as the shape that makes a response recurse).

Learning outcome: Victor can write a controller that maps each HTTP verb correctly, bind identity,
filters and bodies from a request, return a deliberate status and body, shape what leaves the
application through dedicated request and response types rather than exposing persistence classes,
and expose the resulting contract as browsable generated documentation.

Prerequisites: 00, 01.

Must answer:

- What happens between the browser sending a request and the controller method running?
- Why does the controller receive a ready-made service instance it never created?
- The id of the thing and the filter applied to a list both arrive as text in a URL — which one goes
  in the path and which in the query string, and why?
- When should the return type be `ResponseEntity` instead of the object itself?
- A POST created a row — what does a well-behaved API return besides 201, and where does that value
  come from?
- Why does a valid-looking request get rejected with 415 before any of the controller's code runs?
- Why does a perfectly valid JSON body sometimes arrive with every field null?
- Why does returning an entity that points back at its owner crash the response instead of just
  printing more JSON?
- The mapper class "does not exist" according to the IDE but the project compiles on a colleague's
  machine — what kind of problem is that?
- `@JsonIgnore` hides a field on the way out, but the field is still being set on the way in — why,
  and what changes that?
- Where does the generated API documentation get its operations and fields from, and what makes it
  go stale?

Coverage concepts:

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
- OpenAPI generation — expose a browsable, generated HTTP contract for frontend and QA consumers from the existing controller and DTO declarations

Rationale: every one of these concepts is a step on the same journey of a single HTTP request —
matching it to a method, reading its parts, converting its body, and writing a deliberate response —
so they can only be taught as one continuous trace; generated documentation closes the chapter
because it is that same trace read back out of the controllers and DTOs the reader has just written,
not a separate tool.

Handoff: the controller worked only because something handed it a service instance. Chapter 03 opens
that box: how the container discovers, builds, selects and injects every object in the application.

## 03 — Beans and dependency injection

Status: pending
Action: audit
English: notes/spring-boot/junior/en/03-dependency-injection.md
Spanish: notes/spring-boot/junior/es/03-inyeccion-dependencias.md
Depends on: 00, 02

Narrative role: chapter 02 used injected collaborators without explaining where they came from. This
chapter replaces that orientation-level picture from 00 with the real mechanism, because bean
lifecycle, scope and proxying are what make transactions, security and testing behave the way later
chapters describe. The `@Repository` example touches persistence, which is only taught in 04: it must
be marked as a preview of that chapter, not written as if repositories were already known.

Learning outcome: Victor can explain how Spring discovers, creates, selects and injects beans, choose
between stereotype scanning and `@Bean` methods, resolve an ambiguous dependency deliberately, and
read a startup failure report well enough to name which stage of bean creation failed.

Prerequisites: 00, 02.

Must answer:

- What does the container actually do between `main()` starting and the first request being served?
- If every service is a single shared instance, what happens to a field one request writes to?
- Why does an annotation like `@Transactional` do nothing when the method is called from inside the
  same class?
- Two classes implement the same interface — how does Spring decide, and how do you decide for it?
- All the stereotypes do the same discovery job, so what does marking a data-access class with its
  own stereotype actually buy — and what kind of exception does it hand the rest of the application?
- One setting can be injected straight into a field; at what point does that stop being the right
  shape for a group of related settings?

Coverage concepts:

- Component stereotypes — use `@Component` and its layer-specific stereotypes to make application classes discoverable while keeping each layer's responsibility explicit
- `@Repository` exception translation — the stereotype converts provider-specific persistence failures into Spring's `DataAccessException` family, so a constraint breach surfaces as `DataIntegrityViolationException` and can be mapped to a deliberate status
- `@Bean` vs component scanning — register third-party instances or explicit construction logic in configuration and use scanning for application-owned component classes
- Constructor injection — prefer it over field injection so dependencies are explicit, final, and easy to supply in tests; Spring infers injection when a component has one constructor
- Lombok constructors and Spring injection — `@RequiredArgsConstructor` can express constructor injection for final dependencies, while all-argument constructors are usually the wrong service boundary
- `@Qualifier` vs `@Primary` — select one bean explicitly at an injection point or declare a default candidate when several beans satisfy the same dependency type
- Bean scope and the singleton default — application beans are singleton-scoped by default, so mutable request-specific state on a service can leak across users and threads
- Proxy-based annotation behaviour — Spring applies transaction, security, and similar annotations by wrapping the bean in a proxy, so the annotation only takes effect on an injected bean invoked from outside and silently does nothing on a `new` instance or an internal call
- Bean lifecycle and startup failures — distinguish component scanning, bean creation, dependency resolution, and application startup so missing beans, ambiguous injection, and circular dependencies can be diagnosed from the failure report
- `@Value` vs `@ConfigurationProperties` — inject an isolated value directly or bind and validate a cohesive typed configuration group when several related settings belong together

Rationale: discovery, construction, selection, scope, proxying and configuration binding are all the
same act — the container assembling the object graph — and the failure modes only make sense when
that act is understood as one sequence.

Handoff: the services the container wires up have nothing to work on yet. Chapter 04 gives them a
database.

## 04 — Spring Data JPA: entities, relationships and repositories

Status: pending
Action: audit
English: notes/spring-boot/junior/en/04-spring-data-jpa.md
Spanish: notes/spring-boot/junior/es/04-spring-data-jpa.md
Depends on: 01, 03

Narrative role: the persistence chapter. It turns the Java classes of the domain into rows and the
repositories into queries, and it is the chapter that has to explain the persistence context, because
almost every surprising behaviour in later chapters — stale reads, lazy loading failures, rollbacks —
traces back to it. Several of its claims are about how many SQL statements really run, which the
reader cannot see yet: show the Hibernate SQL logging property inline where it is first needed and
forward-reference 12, rather than asserting query counts on trust.

Learning outcome: Victor can map an entity and its relationships to a schema, choose identifier,
enum, timestamp and fetch strategies deliberately, and obtain data through inherited, derived and
declared repository queries while explaining what SQL each one produces.

Prerequisites: 01, 03.

Must answer:

- What does "managed" mean, and why does changing a loaded object update the row without calling
  `save()`?
- Which side of a relationship owns the foreign key, and what goes wrong when neither side declares
  it?
- Why does `save()` sometimes issue an UPDATE when the intent was to insert a new row?
- Deleting a child from a parent's collection leaves the row in the table — which setting was
  missing, and how is that different from cascading a delete?
- The enum was reordered and last month's rows now mean something else — what was stored, and what
  should have been?
- Why can the generated `equals`, `hashCode` and `toString` on an entity be actively dangerous when
  the same annotations are harmless on a DTO?
- Both `findById` and `getReferenceById` return "the entity" — what is actually different, and when
  does the cheap one blow up?
- A declared update query ran successfully and the object in memory still shows the old value — why?
- Why does one innocent-looking loop over a list fire a hundred queries?
- When is a derived method name the right tool and when does it need replacing with a written query?
- The client only wants to know whether there is another page — what does asking for the total count
  as well actually cost?

Coverage concepts:

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
- `FetchType.LAZY` vs `FetchType.EAGER` — deferred versus mandatory relationship loading, with the defaults deliberately asymmetric: to-one associations load eagerly and to-many associations lazily, so fetching must be chosen per use case rather than fixed globally
- N+1 problem — one query loads the list, then N extra queries load each lazy relationship in a loop; fix with `JOIN FETCH` in `@Query` or with `@EntityGraph`

Rationale: mapping and querying are one learning unit because the repository method Victor writes is
only meaningful against the mapping it reads, and the two most common junior failures — the
accidental join table and the N+1 — are caused by a mapping decision and observed through a query.
This is the largest chapter of the level, so the note must follow a declared internal route rather
than one flat list: (a) the persistence context and what "managed" means, (b) mapping one class to
one table, (c) mapping relationships between classes, (d) getting data back out through the
repository, (e) how much data and how many statements. Splitting it into two files was considered and
rejected: new files can only take the next unused number, which would push repositories and queries
behind testing and security in the study route even though chapters 05 to 09 all depend on them.

Handoff: the persistence layer now throws real failures — absent rows, constraint breaches, invalid
state. Chapter 05 decides what the client sees when that happens.

## 05 — Exception handling and the error contract

Status: pending
Action: audit
English: notes/spring-boot/junior/en/05-exception-handling.md
Spanish: notes/spring-boot/junior/es/05-manejo-excepciones.md
Depends on: 02, 04

Narrative role: the chapter that closes the failure half of the HTTP boundary opened in 02. Until now
every example assumed the happy path; here every way a request can fail gets a deliberate status and
a stable JSON body. Two of its concepts reach forward and must be written as marked previews rather
than assumed knowledge: `@Valid`, whose failure this chapter handles but which is only taught in 07,
and the servlet filter chain, which is only built in 06 — here it appears strictly as the answer to
why some failures never reach an advice at all.

Learning outcome: Victor can define domain exceptions, map each one to its intended status through
advice, produce one consistent error body across the API, and explain which failures never reach his
handlers at all.

Prerequisites: 02, 04.

Must answer:

- Two handlers could match the exception that was thrown — which one runs?
- Three different places can set the status of a failure; how do you tell which one is in play in
  code you did not write?
- Why does an unhandled exception come back as a body with a timestamp and a path but no message?
- What fields does every error response carry, and how does the Angular side tell a validation
  failure from a missing resource without parsing prose?
- Why does an authentication failure ignore the exception handler that works everywhere else?

Coverage concepts:

- `@RestControllerAdvice` — combines `@ControllerAdvice` with `@ResponseBody` for JSON-oriented handlers; plain advice can also return JSON when its handler uses `ResponseEntity` or `@ResponseBody`
- `@ExceptionHandler` resolution — the most specific declared exception type wins over a supertype handler, and an advice's scope decides which controllers it serves, so an unexpectedly generic response usually means the wrong handler matched
- `ResponseStatusException` and `@ResponseStatus` on an exception — a status can be attached at the throw site or to the exception type instead of through advice; recognise all three routes because maintained code mixes them and the advice never fires for a status already resolved
- Domain exceptions — represent meaningful application failures as dedicated types so a handler can map each one to its intended status
- `MethodArgumentNotValidException` — Spring throws this when `@Valid` on a `@RequestBody` fails; handle it in `@RestControllerAdvice` to return 400 with field-level error messages; not catching it results in a verbose default Spring error body
- Error response contract — map failures to consistent status and body fields so API clients can handle validation, absence, conflict, and unexpected errors predictably
- Boot's default error handling — an exception no handler claims is forwarded to the built-in `/error` endpoint, which builds the status, timestamp, and path body and omits the exception message and binding details until the matching `server.error.include-*` properties are enabled
- Filter-chain exceptions vs controller advice — exceptions raised before controller dispatch do not automatically pass through `@RestControllerAdvice`, so authentication failures need handling at the security boundary
- Filter vs MVC interceptor vs controller advice — use servlet filters for request-chain concerns, interceptors around mapped handlers, and advice for controller exception/response behaviour

Rationale: these concepts are one path — a failure is raised somewhere, something decides its status,
and a body is written — and the junior mistakes all come from not knowing which link in that path
handled it.

Handoff: the error contract now covers everything a controller can throw, and its one blind spot is
the request-chain stage before dispatch. That stage is exactly where security lives, which is chapter
06.

## 06 — Spring Security and JWT authentication

Status: pending
Action: audit
English: notes/spring-boot/junior/en/06-security-jwt.md
Spanish: notes/spring-boot/junior/es/06-seguridad-jwt.md
Depends on: 02, 03, 04, 05

Narrative role: the chapter that puts a guarded door in front of everything built so far. It is the
longest one at this level for a reason: an authenticated request is a single continuous mechanism
that runs from the filter chain through credential verification and token issuance to the authority
check on a method, and stopping halfway leaves an endpoint that is either open or unusable.

Learning outcome: Victor can configure a stateless bearer-token security chain, implement login
against encoded passwords, issue and validate a signed token, place the authenticated principal where
services and controllers read it, and enforce access at both the route and the method level.

Prerequisites: 02, 03, 04, 05.

Must answer:

- Where in the request's journey does security run, and what has already happened when the custom
  filter executes?
- Why does a token-based API switch sessions off, and what exactly is it giving up by doing so?
- Why is disabling CSRF correct here and wrong for the cookie-authenticated endpoint in the same
  application?
- The browser sends an `OPTIONS` request nobody wrote a handler for — what is it, and why does the
  security chain reject it before the real call is ever made?
- Two tokens of the same class appear in the login code, one with authorities and one without — what
  does each one mean, and what breaks if they are swapped?
- The request has no token at all, so why is the authentication object in the context not null?
- What does the application compare when it checks a password, given that the stored value cannot be
  reversed?
- What exactly is inside a JWT, and what stops a client editing its own role claim?
- Why does a correctly authenticated user get rejected by `hasRole` while `hasAuthority` lets them
  through?
- Why does the security layer need its own error components instead of reusing the advice from 05?
- Why does an endpoint annotated with `@PreAuthorize` sometimes let everyone in and log nothing?

Coverage concepts:

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

Rationale: chain configuration and JWT authentication are inseparable at this level because the chain
is what runs the filter, the filter is what turns a token into a principal, and the authority checks
only work on the principal the filter stored — teaching either half alone produces an application
that authenticates but authorises nothing, or guards routes nobody can pass. Because this is the
longest note of the level, it must follow a declared internal route: (a) the filter chain and where
security sits in the request, (b) proving who the caller is — users, encoded passwords, the
authentication manager, (c) issuing and validating the token, (d) placing and reading the principal,
(e) deciding what that principal may do, at the route and at the method, (f) the browser-policy layer
— CORS, preflight, CSRF — which is a separate model and must be signposted as one.

Handoff: the login endpoint that chapter used accepts whatever JSON arrives and trusts it. Chapter 07
takes the `@Valid` annotation it used without explanation and makes input validation deliberate.

## 07 — Bean Validation at the input boundary

Status: pending
Action: audit
English: notes/spring-boot/junior/en/07-validation.md
Spanish: notes/spring-boot/junior/es/07-validacion.md
Depends on: 02, 04, 05

Narrative role: chapters 02 and 06 both put `@Valid` on a request body without saying what it does.
This chapter makes the input contract explicit and explains why a rule enforced only by the database
produces the wrong HTTP status.

Learning outcome: Victor can declare the right constraint for each field, trigger validation at the
controller boundary including nested objects and collections, and handle the two distinct validation
failure families deliberately.

Prerequisites: 02, 04, 05.

Must answer:

- Which of `@NotNull`, `@NotEmpty` and `@NotBlank` does a text field actually need, and what does
  each one let through?
- The outer DTO is valid but the object inside it is nonsense — why did nothing reject it?
- Why does the same broken rule return 400 when it is a constraint and 500 when it is a column
  definition?
- Why does validating a path variable throw a different exception than validating a body?
- When is `@Validated` the right annotation rather than `@Valid`?

Coverage concepts:

- `@Valid` on `@RequestBody` — trigger cascaded validation of the deserialized request DTO at the controller boundary before business logic runs
- Nested and collection cascading — a nested object's own constraints run only when the field or the collection's type argument is marked `@Valid`, while container element constraints such as `List<@NotBlank String>` are checked without it, so a validated outer DTO can silently accept an invalid inner payload
- Validation starter and runtime integration — include Jakarta Validation plus its implementation and Spring integration so constraints are discovered and executed rather than merely present as metadata
- `@NotNull` vs `@NotEmpty` vs `@NotBlank` — choose whether null, emptiness, or whitespace-only text violates the input contract rather than applying one constraint to every field type
- Constraint selection — choose semantic constraints for sign, size, format, range, or pattern so the annotation matches the business rule rather than merely rejecting some bad examples
- Bean constraints vs database constraints — a validation annotation rejects bad input before business logic with a client error, while a column constraint fails at flush time as a server error, so the same rule expressed only in the schema produces the wrong response
- Controller method validation — apply constraints to controller parameters and handle their failures separately from request-body binding errors
- Body vs method validation failures — invalid `@RequestBody` binding and invalid method parameters use different exception families; handle both deliberately instead of assuming every violation is a `ConstraintViolationException`
- `@Valid` vs `@Validated` — use standard cascaded validation for request objects and Spring's validation groups or method-level proxy features only when those additional semantics are required

Rationale: these concepts form one gate — activating constraints, choosing them, cascading them, and
handling the two ways they can fail — and the gate only makes sense placed against the alternative of
letting the database reject the data instead.

Handoff: input is now trustworthy by the time it reaches the service, which raises the next question:
what happens when a service does several database writes and the third one fails. That is chapter 08.

## 08 — Transactions

Status: pending
Action: audit
English: notes/spring-boot/junior/en/08-transactions.md
Spanish: notes/spring-boot/junior/es/08-transacciones.md
Depends on: 03, 04, 05

Narrative role: the chapter that makes a multi-step business operation safe. It reuses the proxy
mechanism from 03 and the persistence context from 04, and it finally explains the exception that
every junior meets — the lazy relationship accessed after the session closed.

Learning outcome: Victor can place a transaction boundary on the right method, predict whether a
given exception rolls the work back, and explain why a lazily-loaded relationship fails outside that
boundary.

Prerequisites: 03, 04, 05.

Must answer:

- The service saved two rows and the second failed — is the first one still in the database?
- Two annotations called `@Transactional` are offered by the IDE; what changes depending on which one
  is imported?
- Why does an unannotated service that calls three repository methods have no atomicity at all?
- Why does catching an exception inside a transactional method quietly commit the broken work?
- Why does `getUser().getProjects()` work inside the service and throw in the controller?

Coverage concepts:

- `@Transactional` atomicity and rollback — group one business operation in a transaction and know that the default rollback rules differ for unchecked and checked exceptions
- Spring's `@Transactional` vs the Jakarta annotation — two importable annotations of the same name carry different rollback defaults, so the import decides the behaviour
- `@Transactional(readOnly = true)` — declares read intent so the provider can skip dirty checking, while whether writes are actually refused depends on the driver and database rather than on Spring
- Transaction boundary placement — put the annotation on the externally invoked, proxy-eligible service method that spans the whole business operation, not on a controller, a private method, or a single repository call
- Spring Data repository default transactionality — repository CRUD methods carry their own `@Transactional`, so an unannotated service commits every call as its own transaction with no atomicity across them, which is why the service boundary is a deliberate decision rather than an optional annotation
- `LazyInitializationException` — thrown when you access a `LAZY` relationship after the Hibernate session is closed (outside the `@Transactional` boundary); fix by converting to DTO inside the `@Transactional` method, or by using `JOIN FETCH` to load the relationship eagerly in the query
- Caught exceptions and rollback — swallowing a failure inside a transactional method can let the proxy observe normal completion and commit unless rollback is re-established deliberately

Rationale: every one of these concepts is a consequence of the same boundary — where the proxy opens
and closes the transaction — so atomicity, rollback rules and session lifetime have to be taught as
one mechanism rather than three annotations.

Handoff: the application is now correct by construction in Victor's head. Chapter 09 makes that claim
testable by a machine.

## 09 — Testing a Spring Boot application

Status: pending
Action: audit
English: notes/spring-boot/junior/en/09-testing.md
Spanish: notes/spring-boot/junior/es/09-testing.md
Depends on: 02, 03, 04, 06, 07, 08

Narrative role: the chapter that turns everything built so far into something a team can change
safely. It works outward from a plain unit test to a full context, choosing the smallest tool that
can actually catch the risk in question.

Learning outcome: Victor can write and justify a unit test, an MVC slice test and a persistence slice
test, decide when the full context is warranted, and recognise a test that passes no matter what the
production code does.

Prerequisites: 02, 03, 04, 06, 07, 08.

Must answer:

- Which failures does a Mockito unit test catch, and which ones can it never catch?
- Why does a controller slice test return 401 for an endpoint that works in Postman?
- `@Mock`, `@MockitoBean`, `@MockBean` — which one belongs where, and why do maintained projects
  import the third?
- Why does a repository test leave the database exactly as it found it without any cleanup code?
- Why assert on individual JSON fields instead of comparing the whole response to an expected string?
- Where do a test's database URL and credentials come from, given that production settings must not
  be weakened to make the test pass?
- Why can a repository test that passes against H2 still break in production?
- How do you spot a test that would still be green with the method body deleted?

Coverage concepts:

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

Rationale: the testing tools only mean something as a ladder — each rung buys more realism at the
cost of speed — so they belong in one chapter that ends with the judgement of which rung a given risk
deserves and how to tell a real test from a decorative one.

Handoff: a tested application still has to leave the developer's machine. Chapter 10 packages it and
gives its schema a version history.

## 10 — Reproducible builds: the artifact and the schema are versioned outputs

Status: pending
Action: audit
English: notes/spring-boot/junior/en/10-tooling.md
Spanish: notes/spring-boot/junior/es/10-herramientas.md
Depends on: 01, 04

Narrative role: everything so far has been true on Victor's laptop, where the code is whatever the
IDE compiled and the schema is whatever Hibernate last decided to do to it. This chapter replaces
both of those runtime side-effects with reviewed, versioned outputs: an image built once from a
Dockerfile, and a schema built by an ordered list of migration files. That single idea — the thing
that runs is produced deliberately, not improvised at startup — is what makes both halves one lesson.

Learning outcome: Victor can explain why the running artifact and the running schema must both be
build outputs rather than startup side-effects, package the application as an image configured
entirely from outside, and evolve a schema through ordered migrations instead of letting the ORM
alter it.

Prerequisites: 01, 04.

Must answer:

- What actually goes inside the image, given that the machine running it has no JDK, no Maven and no
  source code?
- The image was built once — how does the same image point at a different database in another
  environment, and what would go wrong if the settings were baked in?
- Why is `ddl-auto=update` acceptable on a laptop and unacceptable on a durable database, when it
  appears to do the right thing in both places?
- What does a migration tool record so it knows which changes already ran, and why must an
  already-applied migration file never be edited afterwards?

Coverage concepts:

- Spring Boot container packaging — build and run the executable application artifact in a container while supplying configuration externally and leaving generic container orchestration to the General topic
- Flyway vs `ddl-auto=update` — evolve schemas through ordered, reviewable migrations rather than allowing runtime ORM metadata to mutate a durable production database implicitly

Rationale: both halves teach the same mechanism seen twice — a reviewed artifact produced by a build
step and identified by a version, versus something improvised by the process at startup — which is
why the image and the migration history belong in one chapter rather than in a tooling list.

Handoff: once the application runs on a machine Victor cannot attach a debugger to, the only evidence
left is what it prints. Chapter 12 reads that evidence. (File `11-business-logic-domain-modeling.md`
sits between them in the folder but is not part of this route — see the unassigned list below.)

## 12 — Diagnosing a running application

Status: pending
Action: audit
English: notes/spring-boot/junior/en/12-production-debugging.md
Spanish: notes/spring-boot/junior/es/12-depuracion-en-produccion.md
Depends on: 01, 03, 04, 08

Narrative role: the chapter that converts every mechanism already learned into a diagnostic skill. It
is placed after packaging because that is when the application stops being something Victor can step
through, and it works from a failure symptom back to the stage that produced it. It switches
diagnostics on by raising a package's log level, which chapter 13 then formalises — say so where the
property first appears, so the reader knows the trick is a preview and not a one-off incantation.

Learning outcome: Victor can read a Boot startup failure and name which stage failed, make the
statements the persistence layer really issues visible, and explain why a failure is reported at a
line other than the one that caused it.

Prerequisites: 01, 03, 04, 08.

Must answer:

- The application refuses to start — how do you tell a configuration problem from a bean problem from
  a database problem without changing any code?
- The Java code looks like one call; how many SQL statements actually ran?
- Why does the constraint violation appear at the end of the method instead of on the line that saved
  the row?
- Why does a relationship load fine while rendering the response and fail as soon as mapping moves
  into the service?

Coverage concepts:

- Startup diagnostics — read Boot's condition and failure-analysis output to distinguish configuration, bean creation, port, and datasource failures before changing code
- Generated-statement logging — enable Hibernate's SQL and binding output to see the statements the repository layer actually issues, because query count and shape are invisible from Java code alone
- Write timing and deferred failure — a persistence call stages work that reaches the database at flush or commit, so a constraint violation is reported at the transaction boundary rather than on the line that appeared to cause it
- Open EntityManager in View — recognise that Boot's web default can keep lazy loading available during response rendering, why this can hide query behaviour, and why DTO mapping should happen inside an explicit service transaction

Rationale: all four concepts are about the gap between what the code appears to do and what the
running process actually did — at startup, at query time, and at flush time — which is exactly the
skill an incident demands.

Handoff: diagnosis depends on the application having said something useful in the first place.
Chapter 13 is about producing that evidence deliberately.

## 13 — Application logging

Status: pending
Action: audit
English: notes/spring-boot/junior/en/13-logging-observability.md
Spanish: notes/spring-boot/junior/es/13-logging-observabilidad.md
Depends on: 03

Narrative role: the counterpart to chapter 12. Diagnosis read evidence the framework produced; this
chapter is about the evidence Victor's own code leaves behind, and the habits that get a pull request
rejected when it does not. It also formalises the level-raising property that 12 used ad hoc to see
Hibernate's SQL: there it was a trick, here it is the mechanism.

Learning outcome: Victor can obtain a logger correctly, choose a level and a message that will still
be useful during an incident, log an exception so its stack trace survives, and change what a running
application records without redeploying it.

Prerequisites: 03.

Must answer:

- Why is `System.out.println` unacceptable in a Spring Boot service when it clearly prints?
- Which level does a given event belong to, and who reads that level in practice?
- What is lost by logging `e.getMessage()` instead of passing the exception itself?
- A bug only reproduces in one environment — how do you get more detail out of it without a new
  build?
- Which values must never appear in a log line, no matter how convenient?

Coverage concepts:

- Application logging — obtain a logger through the SLF4J facade rather than printing to standard output, and raise or lower a package's level from configuration so a running application can be investigated without editing code

Rationale: this chapter is the whole of the logging concept — the facade, the levels, the message
format, exception logging and runtime level control are one skill, and the coverage bullet defines
its required scope rather than the depth needed to make it a habit.

Handoff: logging levels are the first thing that must differ between a laptop and a real environment,
which raises the general question of how one build behaves differently per environment. Chapter 15
answers it. (File `14-specifications-criteria-api.md` sits between them in the folder but is not part
of this route — see the unassigned list below.)

## 15 — Profiles and environment-specific startup

Status: pending
Action: audit
English: notes/spring-boot/junior/en/15-spring-profiles.md
Spanish: notes/spring-boot/junior/es/15-perfiles-spring.md
Depends on: 01, 03

Narrative role: chapter 01 externalised configuration values and 13 changed one of them per
environment by hand; this chapter makes whole beans and whole files environment-dependent, which is
what lets development conveniences exist without ever reaching a real deployment. `@Value` was taught
in 03 and must be linked back to rather than re-explained here.

Learning outcome: Victor can activate a profile, split configuration between a shared file and
profile-specific ones, and restrict a bean so that it only exists in the environments where it is
appropriate.

Prerequisites: 01, 03.

Must answer:

- What actually happens to a bean annotated with a profile when that profile is not active?
- Which values belong in the shared file and which in the profile-specific one?
- Two ways exist to write profile configuration in one project — how do you read both?
- Why is a profile the wrong place to keep a password even though it looks like the natural home?

Coverage concepts:

- Profile-specific configuration files — profile values live either in an `application-{profile}` file or in one multi-document file whose sections are separated by `---` in YAML or `#---` in properties and selected with `spring.config.activate.on-profile`
- Profiles — activate environment-specific beans and configuration deliberately without treating a profile as a secrets store

Rationale: the file mechanism and the bean mechanism are the same feature seen from two sides —
one environment label deciding what configuration loads and what objects exist.

Handoff: profiles are the last mechanism this level adds, and they are also the first one Victor will
find already in place in somebody else's project — usually written in an older style, next to an
older security configuration and an older set of imports. Chapter 16 teaches him to read that.

## 16 — Reading maintained Spring Boot code

Status: pending
Action: create
English: notes/spring-boot/junior/en/16-maintained-code-recognition.md
Spanish: notes/spring-boot/junior/es/16-reconocer-codigo-heredado.md
Depends on: 02, 03, 04, 06

Narrative role: the chapter written for the first week in a consultancy. Every earlier chapter taught
the current idiom; this one teaches the previous generation of the same idioms, so that unfamiliar
code reads as an older convention rather than as evidence that Victor learned it wrong.

Learning outcome: Victor can open an unfamiliar Spring Boot codebase, recognise the older namespace,
security configuration, repository interface and injection styles it uses, and explain what each
older choice gives up compared with the current one.

Prerequisites: 02, 03, 04, 06.

Must answer:

- A copied snippet does not compile and the only difference is one word in the import — what
  happened and why?
- The security configuration extends a base class instead of declaring a bean; is that code wrong or
  just old?
- The repository extends `CrudRepository` and the pagination method is missing — what does that
  interface not provide?
- Why does so much existing code use `@Autowired` on a field, and what does that cost in tests?
- Every service has an interface and an `Impl` class — is that required by Spring or a convention?

Coverage concepts:

- `jakarta.*` vs `javax.*` imports — recognise that current Boot versions moved the persistence, validation, and servlet namespaces, so a maintained codebase or a copied snippet on the wrong namespace fails to compile or is silently ignored
- `SecurityFilterChain` bean vs `WebSecurityConfigurerAdapter` — current configuration declares a chain bean with the lambda DSL, while the removed adapter base class survives in maintained codebases and in most copied examples, so recognise both and know why one no longer compiles
- Repository interface hierarchy — `CrudRepository`, `PagingAndSortingRepository`, and `JpaRepository` extend one another with progressively more operations, so recognise which one a maintained codebase declared and what that choice does and does not provide
- Field injection and `@Autowired` — recognise the older field- and setter-injected style still common in maintained code, and be able to state what constructor injection gives up when it is replaced
- Service interface plus `Impl` implementation — recognise the pervasive split where the injected type is an interface and the behaviour lives in a separate implementation class, and know that Boot proxies classes by default, so the interface is a maintained-code convention and a test-substitution seam rather than a technical requirement for proxying

Rationale: these five recognitions share one purpose and one method — each pairs an older form with
the current form Victor already knows and names what changed between them — so they teach a single
reading skill rather than five unrelated facts.

Handoff: Victor can now read and write the service. The final chapter turns it outward: publishing
its contract to the people who consume it and calling the services it depends on.

## 17 — Calling another service over HTTP

Status: pending
Action: create
English: notes/spring-boot/junior/en/17-http-clients.md
Spanish: notes/spring-boot/junior/es/17-clientes-http.md
Depends on: 02, 05

Narrative role: every chapter so far has treated the application as the thing being called. This one
turns it around: the same request-and-response mechanics from 02, seen from the caller's side, which
is the position Victor's service is in whenever it depends on somebody else's API. It closes the
junior journey by making the boundary symmetrical.

Learning outcome: Victor can call an external HTTP API from a Spring Boot service using the
framework's own synchronous client, read the older client style he will find in existing projects,
and explain what a caller owes a service it does not control.

Prerequisites: 02, 05.

Must answer:

- Which client does current Spring Boot code use for an outbound call, and which one will be found in
  projects written a few years ago?
- Where does the client belong — can a controller call the remote API directly, and why is the answer
  the same as it was for repositories?
- The remote service returns 500, or does not answer at all — what does that turn into for the client
  of *this* API?
- Why is a call to another service the one line in the code where "it worked locally" says almost
  nothing?

Coverage concepts:

- Outbound HTTP calls — a Spring Boot service that consumes another API uses the framework's synchronous HTTP client; recognise the current fluent client and the older template still present in maintained codebases

Rationale: this is one mental model — the application as HTTP client rather than HTTP server — and it
is deliberately the whole chapter rather than being bundled with contract publication, which belongs
in 02 where the controllers and DTOs it documents are written.

Handoff: this closes the junior Spring Boot journey. Victor can build, secure, test, ship, diagnose
and document a conventional REST service, read the older code he will inherit, and integrate with the
services around it — the point at which the middle-level coverage takes over with production
ownership, distributed systems and testing depth.

## Unassigned existing notes

- notes/spring-boot/junior/en/11-business-logic-domain-modeling.md — teaches anemic-versus-rich domain models and state-machine encapsulation, which no Spring Boot coverage bullet owns at any level. Recommended disposition: keep the pair intact and route it to the `architecture` topic through that topic's own coverage and plan; this planner cannot relocate across topics, only across levels, so the files stay where they are until that plan claims them. Chapter 10's handoff names the gap so the numeric route does not appear broken.
- notes/spring-boot/junior/en/14-specifications-criteria-api.md — teaches `Specification`, `JpaSpecificationExecutor` and the Criteria API, a dynamic-query mechanism named by no bullet at junior, middle, or senior level. Recommended disposition: raise it with `coverage-prompt` for Spring Boot `middle`, where dynamic query construction belongs next to the other production-persistence concerns; until a bullet owns it, it is not a required junior study file. Chapter 13's handoff names the gap.
