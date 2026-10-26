# Spring Boot — Interview Questions

Coverage SHA-256: b7cb1dbcde90bef75bb05fb7fe680d9ec762b6d627b0c4340eed48e174e4285c

<a id="study-index"></a>

## Study index

Start with the first pass. Within each pass, follow the topics from top to bottom and work through a small group of questions at a time. If a question needs a concept from another pass, consult that question and then return to where you were.

| Pass | Priority | Questions |
|---|---|---:|
| [1. Essentials](#study-pass-1) | ⭐⭐⭐ | 28 |
| [2. Deeper understanding](#study-pass-2) | ⭐⭐ | 61 |
| [3. Details](#study-pass-3) | ⭐ | 10 |

Read the question, try to answer without looking, check your answer against the written one and explain it again in your own words. In the next block, recall an earlier question without consulting its answer.

Links lead to the original questions. The numbers are their identifiers, not the study order. This index supports independent study. Record your progress in the Spanish index: ✅ and the date at the end of the line of each question you have worked on, then · PASS and the date when you pass it in a recall exam.

<a id="study-pass-1"></a>

### First pass — Essentials — ⭐⭐⭐

**Spring Boot basics**

- [001 — What Spring Boot is and why companies use it](#SB-J-001)
- [002 — What auto-configuration is](#SB-J-002)
- [003 — Constructor injection versus field @Autowired](#SB-J-003)
- [004 — @Transactional and where it goes](#SB-J-004)
- [006 — What @SpringBootApplication does](#SB-J-006)

**REST controllers**

- [014 — @Controller versus @RestController](#SB-J-014)
- [015 — @PathVariable versus @RequestParam](#SB-J-015)
- [016 — Layered architecture in Spring Boot](#SB-J-016)
- [017 — DTOs versus returning JPA entities](#SB-J-017)
- [018 — CORS and the Angular CORS error](#SB-J-018)
- [019 — Why return ResponseEntity](#SB-J-019)
- [024 — Bean Validation annotations and @Valid](#SB-J-024)

**Spring Data JPA**

- [027 — JPA versus Hibernate](#SB-J-027)
- [028 — What JpaRepository gives you](#SB-J-028)
- [029 — FetchType.LAZY versus FetchType.EAGER](#SB-J-029)
- [030 — The N+1 problem](#SB-J-030)
- [032 — What a derived query method is](#SB-J-032)
- [035 — @OneToMany versus @ManyToOne](#SB-J-035)

**Security and JWT**

- [042 — How JWT authentication works](#SB-J-042)
- [043 — SecurityFilterChain and what it configures](#SB-J-043)
- [044 — Authentication versus authorization](#SB-J-044)
- [045 — BCryptPasswordEncoder and plain-text passwords](#SB-J-045)
- [046 — JWT versus server-side sessions](#SB-J-046)

**Exception handling**

- [056 — @ControllerAdvice and when to use it](#SB-J-056)

**Testing**

- [063 — @SpringBootTest and when to use it](#SB-J-063)
- [064 — Mockito and @MockBean](#SB-J-064)
- [093 — Unit testing a service with Mockito](#SB-J-093)

**Tooling**

- [069 — Containerising a Spring Boot application](#SB-J-069)

<a id="study-pass-2"></a>

### Second pass — Deeper understanding — ⭐⭐

**Spring Boot basics**

- [005 — Lombok's @Data and the service-class annotation](#SB-J-005)
- [007 — What application.properties is for](#SB-J-007)
- [008 — ddl-auto options per environment](#SB-J-008)
- [009 — Why Spring Boot for project 07](#SB-J-009)
- [010 — LAZY relationship outside a transaction](#SB-J-010)
- [011 — @Bean methods in a @Configuration class](#SB-J-011)
- [012 — Separate configuration for development and production](#SB-J-012)
- [071 — Spring Boot starters and the web starter](#SB-J-071)
- [073 — Service interface plus Impl class](#SB-J-073)

**REST controllers**

- [020 — @RequestBody and how it works](#SB-J-020)
- [021 — @Service and @Repository versus @Component](#SB-J-021)
- [022 — @PatchMapping versus @PutMapping](#SB-J-022)
- [023 — Converting an entity to a DTO](#SB-J-023)
- [025 — Keeping the password hash out of the JSON](#SB-J-025)
- [074 — Building a CRUD endpoint](#SB-J-074)
- [075 — A request's path to the JSON response](#SB-J-075)
- [076 — Infinite recursion on bidirectional relationships](#SB-J-076)

**Spring Data JPA**

- [031 — Mapping an enum with @Enumerated(EnumType.STRING)](#SB-J-031)
- [033 — Derived query method versus @Query](#SB-J-033)
- [034 — How save() chooses insert or update](#SB-J-034)
- [036 — Minimum annotations of a JPA entity](#SB-J-036)
- [037 — Hundreds of SELECTs for one list request](#SB-J-037)
- [038 — Pageable and when to use it](#SB-J-038)
- [040 — CascadeType.ALL versus orphanRemoval](#SB-J-040)
- [041 — Soft delete versus deleting the row](#SB-J-041)
- [078 — Connecting Spring Boot to PostgreSQL](#SB-J-078)
- [079 — findById and the 404](#SB-J-079)
- [080 — Changes saved without calling save](#SB-J-080)
- [081 — Many-to-many and the join entity](#SB-J-081)
- [082 — Lombok @Data on a JPA entity](#SB-J-082)

**Security and JWT**

- [047 — Disabling CSRF in a REST API](#SB-J-047)
- [048 — @PreAuthorize and when to use it](#SB-J-048)
- [049 — Where the JWT secret is stored](#SB-J-049)
- [050 — What a JWT contains and generateToken()](#SB-J-050)
- [051 — 401 Unauthorized versus 403 Forbidden](#SB-J-051)
- [052 — UserDetailsService and why implement it](#SB-J-052)
- [053 — Stateless session management](#SB-J-053)
- [054 — Invalidating a JWT before it expires](#SB-J-054)
- [084 — Where the JWT is validated](#SB-J-084)
- [085 — Getting the authenticated user](#SB-J-085)

**Exception handling**

- [057 — Extending RuntimeException versus Exception](#SB-J-057)
- [087 — Field errors when @Valid fails](#SB-J-087)
- [088 — @ControllerAdvice versus @RestControllerAdvice](#SB-J-088)
- [089 — @ResponseStatus versus @ExceptionHandler](#SB-J-089)
- [090 — Duplicate email returning a 500](#SB-J-090)
- [091 — Catch-all handler leaking error details](#SB-J-091)

**Transactions**

- [060 — @Transactional(readOnly = true) on read methods](#SB-J-060)
- [061 — @Transactional on private methods](#SB-J-061)
- [062 — Catching a RuntimeException inside @Transactional](#SB-J-062)
- [092 — Why services still need @Transactional](#SB-J-092)

**Testing**

- [065 — What @WebMvcTest is](#SB-J-065)
- [067 — @DataJpaTest and when to use it](#SB-J-067)
- [094 — Secured endpoints in @WebMvcTest](#SB-J-094)
- [095 — A test that always passes](#SB-J-095)

**Tooling**

- [070 — Flyway versus ddl-auto=update](#SB-J-070)
- [096 — Building and running the executable jar](#SB-J-096)
- [097 — Server port and property precedence](#SB-J-097)
- [098 — @Value versus @ConfigurationProperties](#SB-J-098)
- [099 — Logging and per-package log levels](#SB-J-099)
- [100 — Documenting the API with OpenAPI](#SB-J-100)
- [101 — javax to jakarta and Boot 3 changes](#SB-J-101)

<a id="study-pass-3"></a>

### Third pass — Details — ⭐

**Spring Boot basics**

- [013 — Failed to configure a DataSource at startup](#SB-J-013)
- [072 — Running code once at startup](#SB-J-072)

**REST controllers**

- [026 — POST returning 200 instead of 201](#SB-J-026)
- [077 — RestTemplate, RestClient or WebClient](#SB-J-077)

**Spring Data JPA**

- [039 — Why the User entity needs @Table](#SB-J-039)
- [083 — UPDATE in @Query needs @Modifying](#SB-J-083)

**Security and JWT**

- [055 — JWT filter rejecting valid tokens](#SB-J-055)
- [086 — hasRole and the ROLE_ prefix](#SB-J-086)

**Exception handling**

- [059 — MethodArgumentNotValidException versus ConstraintViolationException](#SB-J-059)

**Tooling**

- [102 — Actuator endpoints in production](#SB-J-102)

---

## Spring Boot basics

<a id="SB-J-001"></a>

**[SB-J-001] What is Spring Boot, and what does it give you over plain Spring or plain Java?** ⭐⭐⭐

Spring is the framework, and it gives me things like dependency injection or transactions. Spring Boot sits on top and saves me almost all the setup: I add a starter, for example the web or the JPA one, and Boot configures what is needed on its own. It also comes with a Tomcat inside, so the application starts without installing any server. With plain Java I would have to set all of that up by hand. In TimeTrack, for example, I only added the web, JPA, security and validation starters.

> **Junior tip:** separate the two layers out loud — "Spring is the framework, Boot is the layer that comes with the setup decisions already made" — then name the three things Boot adds: auto-configuration, starters and the embedded server.

---

<a id="SB-J-002"></a>

**[SB-J-002] What is auto-configuration, and how does Spring Boot decide what to configure for you?** ⭐⭐⭐

At startup Boot evaluates a set of conditional configuration classes, and each one creates its beans only when its conditions hold: a library is on the classpath, a property is set, and no bean of that type has been declared already. In project 07 the JPA starter and a `spring.datasource.url` are enough for Boot to build the HikariCP `DataSource`, the `EntityManagerFactory` and the transaction manager without a line of my code; and because I declare my own `SecurityFilterChain` bean in `SecurityConfig`, Boot's default chain — every endpoint behind a login — backs off.

> **Junior tip:** give the three conditions (classpath, properties, existing beans) and one real "backs off" example. If they ask how you would check what Boot configured, say you start the app with `--debug` and read the conditions evaluation report.

---

<a id="SB-J-003"></a>

**[SB-J-003] Field injection with `@Autowired` or constructor injection: which do you use, and why?** ⭐⭐⭐

Constructor injection. The dependencies become `private final` fields that cannot change after construction, they are visible in the constructor signature, and a unit test can pass mocks straight into the constructor without starting a Spring context; with field injection the dependencies are hidden and the object can exist half-built. In project 07 there is not a single `@Autowired`: `TimeEntryService` receives `TimeEntryRepository`, `ProjectRepository` and `AuthenticatedUserProvider` through its only constructor, and since Spring 4.3 a single constructor is used for injection without the annotation.

Red flag answer: "I put `@Autowired` on the fields because it is shorter." — It hides what the class needs, and the class can no longer be built in a test without Spring or reflection.

---

<a id="SB-J-004"></a>

**[SB-J-004] What is `@Transactional`, and where do you put it?** ⭐⭐⭐

It wraps a method in one database transaction: everything the method writes is committed together, or an unchecked exception that escapes it rolls all of it back. It goes on the public service method that represents one business operation — not on the controller, and not around each repository call, which already runs in its own short transaction. In project 07 every write method of the services is `@Transactional` and the reads are `@Transactional(readOnly = true)`; `TimeEntryService.submit`, for example, loads the entry, checks that it is still a DRAFT and that its project is active, and changes its status inside one transaction.

> **Junior tip:** the boundary is the business operation, not the number of writes — "one use case, one transaction, on the service". Add that a checked exception does not roll back unless you configure it.

Red flag answer: "I put it on the controller." — The controller handles HTTP; the transaction belongs to the service method that holds the business logic, which is also where every other caller of that logic gets it.

---

<a id="SB-J-006"></a>

**[SB-J-006] What does `@SpringBootApplication` do?** ⭐⭐⭐

It combines three annotations: `@SpringBootConfiguration` (a `@Configuration`, so the class can declare beans), `@EnableAutoConfiguration` (switches auto-configuration on) and `@ComponentScan` (finds components in this class's package and every package below it). It goes on the main class that calls `SpringApplication.run`; in project 07 that is `TimetrackApplication` in `com.victor.timetrack`, and `controller`, `service`, `repository` and `security` all sit below it, which is why every component is found without any extra configuration.

> **Junior tip:** most candidates only say "it starts the app" — naming the three annotations is what signals real understanding. Add the package rule: a `@Service` placed outside the main class's package tree is never scanned, so whatever injects it fails at startup because no bean of that type exists.

---

<a id="SB-J-005"></a>

**[SB-J-005] What does Lombok's `@Data` generate, and which Lombok annotations do you use on entities and on services?** ⭐⭐

`@Data` generates getters, setters, `toString()`, `equals()`, `hashCode()` and a constructor for the required fields, so in project 07 I use it on the request and response DTOs. Entities do not get it: they carry `@Getter`/`@Setter` and `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` with only the `id` included. On services I write the constructor myself; `@RequiredArgsConstructor` would generate exactly that constructor from the `private final` fields, and it is what many teams use for constructor injection.

> **Junior tip:** the trap is `@Data` on a JPA entity — the generated `equals()`, `hashCode()` and `toString()` use every field, including lazy relationships, which can trigger queries or infinite recursion. Say "`@Data` for DTOs, `@Getter`/`@Setter` on entities".

---

<a id="SB-J-007"></a>

**[SB-J-007] What is `application.properties` used for?** ⭐⭐

It is where the application's configuration lives outside the code, and Boot reads it at startup. In project 07 it holds the datasource URL, username and password, `ddl-auto`, `open-in-view=false`, the JWT secret and expiry and the CORS allowed origins — and every sensitive value is a `${...}` placeholder: `${JWT_SECRET}` and `${DB_PASSWORD}` have no default, so the secrets themselves live only in environment variables and never in git.

> **Junior tip:** the point to land is that the file is committed and the secrets are not — show it with the `${VARIABLE}` placeholder, which also lets one file serve every environment.

---

<a id="SB-J-008"></a>

**[SB-J-008] What are the options for `spring.jpa.hibernate.ddl-auto`, and which one do you use in each environment?** ⭐⭐

The values to know are `create` (drops and recreates the tables at every startup, so all data is lost), `create-drop` (the same, plus a drop at shutdown — the default for an embedded in-memory database), `update` (adds missing tables and columns and never drops anything), `validate` (checks that the schema matches the entities and refuses to start if not) and `none`. In project 07 I run `update` everywhere, the hosted demo included, because I am the only developer, the schema is still changing and the demo data can be reloaded; with a team, or data that must survive a schema change, I would move to `validate` with a migration tool such as Flyway owning the schema, because `update` changes a live database with nothing anyone can review.

Red flag answer: "I always use `create` — it is easier to develop with." — It wipes the database on every restart; using it outside a throwaway environment shows you do not see the risk of losing data.

---

<a id="SB-J-009"></a>

**[SB-J-009] Why did you choose Spring Boot instead of plain Spring for project 07?** ⭐⭐

Without Boot I would have had to declare the `DispatcherServlet`, the `DataSource`, the `EntityManagerFactory`, the transaction manager and the security filter wiring myself, pick a compatible version of every library, and deploy a WAR into a separately installed Tomcat. With Boot I generated the project on start.spring.io with the starters I needed and could start on the endpoints straight away, and the result is one JAR that the Dockerfile starts with `java -jar`. For a project whose point is the API and its decisions rather than the infrastructure wiring, that was the right trade, and the price — configuration I did not write myself — is one I can inspect when I need to.

Red flag answer: "Because the tutorial used Spring Boot." — That is following instructions, not a decision; the interviewer wants to hear what Boot removed and what it costs you.

---

<a id="SB-J-010"></a>

**[SB-J-010] What happens when you access a LAZY relationship outside a transaction?** ⭐⭐

You get a `LazyInitializationException`: the persistence context that loaded the entity is already closed, so Hibernate has nowhere to run the query that would load the relationship. In project 07 I switched `spring.jpa.open-in-view` off, so the session never stays open into the controller — which is why the services map each entity to its response DTO before returning, inside their own `@Transactional` methods.

Red flag answer: "I make the relationship EAGER." — That hides the exception by loading the relationship on every query, even where nobody needs it, and trades one error for a performance problem; the fix is to map to a DTO inside the transaction or to fetch the relationship deliberately in the query.

---

<a id="SB-J-011"></a>

**[SB-J-011] What is a `@Bean` method in a `@Configuration` class, and why did you need one for `BCryptPasswordEncoder`?** ⭐⭐

`@Bean` registers the object a method returns as a Spring-managed bean, which is how I register a class I cannot annotate with `@Component` because it comes from a library. `BCryptPasswordEncoder` belongs to Spring Security, so in `SecurityConfig` a `@Bean` method returns `new BCryptPasswordEncoder()`, and Spring injects that one instance wherever a `PasswordEncoder` is asked for — `UserService`, the dev `DataInitializer`, and Spring Security itself when it checks a password at login. I publish the `AuthenticationManager` the same way, because Spring Security builds it but does not expose it for injection, and my `AuthService` needs to call it.

> **Junior tip:** the distinction is "`@Component` for your own classes, `@Bean` for library classes you cannot edit." That one line answers the follow-up cleanly.

---

<a id="SB-J-012"></a>

**[SB-J-012] How do you keep different configuration for development and production in Spring Boot?** ⭐⭐

With profiles plus environment variables. In project 07 `application.properties` is the shared base, and `application-dev.properties` is loaded only when the `dev` profile is active: it adds the seed manager's settings and `show-sql`, and the `DataInitializer` that creates that account is `@Profile("dev")`, so in any other environment the bean does not even exist. Everything that changes between environments — the database URL and credentials, the JWT secret — comes from environment variables, so the same JAR runs locally under `docker compose` with `SPRING_PROFILES_ACTIVE=dev` and runs hosted with no profile at all.

> **Junior tip:** mention the "fail fast" point — a `${JWT_SECRET}` with no default stops startup with an unresolved-placeholder error when the variable is missing, far better than discovering a null secret at the first login.

---

<a id="SB-J-071"></a>

**[SB-J-071] What is a Spring Boot starter, and what does `spring-boot-starter-web` bring into your project?** ⭐⭐

A starter is one dependency that brings a tested, compatible set of libraries for one capability, and it is what auto-configuration then reacts to — it generates no code of its own. The web starter brings Spring MVC, Jackson for JSON, an embedded Tomcat and the core Boot starter with logging; in Boot 4, which project 07 uses, it is published as `spring-boot-starter-webmvc`, while `spring-boot-starter-web` is the name you see in Boot 3 projects. None of my starters declares a version, because `spring-boot-starter-parent` manages them; only `jjwt`, which Boot does not manage, carries its own.

```xml
<!-- projects/07-timetrack · pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
```

> **Junior tip:** say "a starter is a curated dependency set, not generated code" and list what the web one brings — MVC, Jackson, embedded Tomcat. The version point (the parent manages them) is the follow-up that shows you have read your own pom.

---

<a id="SB-J-073"></a>

**[SB-J-073] Many projects have a `UserService` interface and a `UserServiceImpl` class. Do you need the interface?** ⭐⭐

Not technically. Spring can proxy the class itself by generating a subclass of it, and Spring Boot makes that class-based proxy the default, so `@Transactional` and the other proxy-based annotations work on a concrete service with no interface — which is how the services in project 07 are written; the only `Impl` there is `UserDetailsServiceImpl`, and only because it implements Spring Security's own `UserDetailsService` interface. The interface earns its place when there really are several implementations, or when a team wants the contract kept apart from the code so it can be substituted in tests; in a maintained codebase I follow the convention it already uses.

Red flag answer: "Spring needs the interface to create the proxy." — Only a JDK dynamic proxy needs one; Spring proxies a concrete class by subclassing it, which is Boot's default, so the split is a convention and a design choice, not a requirement.

---

<a id="SB-J-013"></a>

**[SB-J-013] The app fails to start with "Failed to configure a DataSource" — what do you check first?** ⭐

I read the failure analysis Boot prints under "APPLICATION FAILED TO START": this message means the JPA starter is on the classpath but Boot found no `spring.datasource.url` and no embedded database, so it is a configuration problem, not a database one. I check that the property exists and is spelt correctly, and that the profile or environment variable meant to supply it is really active. If PostgreSQL were simply down, the error would be different — the datasource is configured, and what fails is the connection to the database.

Red flag answer: "I restart PostgreSQL." — The message is about missing configuration, so restarting the database changes nothing; reading the failure analysis first is what tells a configuration failure from a connection failure.

---

<a id="SB-J-072"></a>

**[SB-J-072] How do you run code once when the application starts — say, to seed an admin user — and why not just put it in a constructor?** ⭐

I implement `CommandLineRunner` in a bean: Boot calls its `run` method once the context is fully built and every bean is available, which a constructor cannot promise. In project 07 `DataInitializer` seeds the first manager account this way; it is `@Profile("dev")`, and it checks `existsByEmail` first, because it runs on every boot and must not create the user twice.

```java
// projects/07-timetrack · DataInitializer.java
@Component
@Profile("dev")
public class DataInitializer implements CommandLineRunner {
    @Override
    public void run(String... args) {
        String email = EmailNormalizer.normalize(adminEmail);
        if (userRepository.existsByEmail(email)) {
            return;
        }
        // ... builds the MANAGER user, encodes the password and saves it
    }
}
```

Red flag answer: "I put it in a service's constructor." — The constructor fires while the context is still being built, before the application is ready, and without a guard the seed runs again on every restart.

---
## REST controllers

<a id="SB-J-014"></a>

**[SB-J-014] What is the difference between `@Controller` and `@RestController`?** ⭐⭐⭐

`@Controller` marks a class whose methods return a view for a template engine to render as HTML; `@RestController` is `@Controller` plus `@ResponseBody`, so whatever a method returns is written straight into the response body by a message converter — Jackson, for JSON. Project 07's backend is an API that Angular consumes, so all five of its controllers — `AuthController`, `ProjectController`, `TimeEntryController`, `UserController` and `ReportController` — are `@RestController`, and none of them renders a page. With a plain `@Controller` I would need `@ResponseBody` on every method to get the same behaviour.

Red flag answer: "`@RestController` is just the newer name for `@Controller`." — They behave differently: without `@ResponseBody`, the value a method returns is resolved as a view — a `String` is taken as a template name — so the endpoint goes looking for a page instead of answering JSON.

---

<a id="SB-J-015"></a>

**[SB-J-015] When do you use `@PathVariable`, `@RequestParam` and `@RequestBody`?** ⭐⭐⭐

`@PathVariable` takes a value from the route and identifies the resource, `@RequestParam` takes it from the query string for filters and options, and `@RequestBody` turns the JSON body into a Java object holding the data to create or change. In project 07 `PATCH /api/entries/{id}/reject` uses the first and the last — the entry's id in the path, the rejection note in the body — while the list `GET /api/entries?projectId=3&status=SUBMITTED` takes every filter as `@RequestParam(required = false)`, because each one can be left out.

```java
// projects/07-timetrack · TimeEntryController.java
@GetMapping
public ResponseEntity<Page<TimeEntryResponse>> findByFilter(
        @RequestParam(required = false) Long userId,
        @RequestParam(required = false) Long projectId,
        @RequestParam(required = false) EntryStatus status,
        // ... month and the Pageable
) {

@PatchMapping("/{id}/reject")
public ResponseEntity<TimeEntryResponse> reject(@PathVariable Long id, @Valid @RequestBody RejectRequest request) {
```

Red flag answer: "I send the id in the body and the filters in the path." — The URL then no longer names the resource, and optional values in the path need one route per combination. Also, `@RequestParam` is required by default, so a filter declared without `required = false` turns a request that simply omits it into a 400.

---

<a id="SB-J-016"></a>

**[SB-J-016] What is the layered architecture in Spring Boot and why does it matter?** ⭐⭐⭐

Three layers with one job each: the controller handles HTTP — mapping, binding, validation and the status code — the service holds the business rules and the transaction, and the repository talks to the database; each layer calls only the one below it. In project 07 `TimeEntryController` never touches a repository: it hands the request to `TimeEntryService`, which checks, for example, that an entry is still a DRAFT before it can be submitted, and saves it through `TimeEntryRepository` — so a rule like that lives in one place that every endpoint shares.

> **Junior tip:** name the three layers, say "separation of concerns", and give the consequence: logic written in a controller cannot be reused by another endpoint or unit-tested without going through HTTP.

---

<a id="SB-J-017"></a>

**[SB-J-017] Why use DTOs instead of returning JPA entities directly from the controller?** ⭐⭐⭐

Because the entity is my database model and the DTO is my API contract, and I do not want them to be the same thing. In project 07 the `User` entity holds the BCrypt password hash and `TimeEntry` holds lazy `user` and `project` associations; `TimeEntryResponse` sends instead the flat fields Angular shows — `userId`, `userName`, `projectId`, `projectName` — so no hash can leak, no lazy association has to load while the JSON is written, and I can change the schema without breaking the frontend. On the way in, the request DTOs carry the validation and only the fields a client may set, so nobody can send their own `id` or `status`.

Red flag answer: "I return the entity because it is less code." — It ties the API to the schema and exposes fields like the password hash, and a lazy association either fails to serialize once the session is closed or, in a bidirectional mapping, recurses until the response breaks.

---

<a id="SB-J-018"></a>

**[SB-J-018] What is CORS and why does your Angular app get a CORS error when calling the Spring Boot API?** ⭐⭐⭐

CORS is the browser's rule that a page may call a different origin — scheme, host and port — only if that server allows it through `Access-Control-Allow-*` response headers; the Angular dev server on `localhost:4200` and the API on `localhost:8080` are different origins, so without that permission the browser blocks the call. In project 07 I configure it once in `SecurityConfig`: a `CorsConfigurationSource` bean wired into the security chain with `.cors(...)`, whose allowed origins come from the `app.cors.allowed-origins` property, so the hosted frontend's origin is set through an environment variable and the chain also answers the browser's preflight `OPTIONS` request.

> **Junior tip:** say the error lives in the browser — Postman calls the same endpoint without trouble, because only browsers enforce CORS — and the fix is on the server, by allowing the origin. If they ask about `@CrossOrigin`: it is valid for one controller's local policy, but with Spring Security a central source keeps one policy for the whole API.

---

<a id="SB-J-019"></a>

**[SB-J-019] Which status code do you return when you create a resource, when it is not found and when the input is invalid, and how do you set it with `ResponseEntity`?** ⭐⭐⭐

201 Created when something is created, 404 Not Found when the id does not exist and 400 Bad Request when the input breaks the contract — plus 200 for a normal read or update and 204 No Content for a delete with nothing to return. In project 07 the controllers set the success statuses with the `ResponseEntity` factories — `ok(...)`, `created(location).body(...)`, `noContent().build()` — so each status reads as a named constant, and the error statuses come from `GlobalExceptionHandler`: the service throws `ResourceNotFoundException`, which becomes a 404, and a failed `@Valid` becomes a 400 with the errors listed by field.

```java
// projects/07-timetrack · ProjectController.java
@PostMapping
public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest request){
    ProjectResponse created = projectService.create(request);
    URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(created.getId())
            .toUri();
    return ResponseEntity.created(location).body(created);
}
```

> **Junior tip:** give the three codes first, then the "how": `ResponseEntity` when the status or the headers depend on the outcome, `@ResponseStatus` when the status is always the same. Mention that `created()` also sends the `Location` header with the new resource's URL.

---

<a id="SB-J-024"></a>

**[SB-J-024] How do you validate the body of a request in Spring Boot?** ⭐⭐⭐

I put Bean Validation constraints on the fields of the request DTO and `@Valid` next to `@RequestBody` in the controller, so Spring validates the object right after deserializing it and, if a rule fails, throws `MethodArgumentNotValidException` before my method runs. In project 07 `CreateUserRequest` has `@NotBlank`, `@Email` and `@Size(max = 255)` on the email and `@NotNull` on the role, `CreateTimeEntryRequest` bounds the hours with `@DecimalMin("0.5")` and `@DecimalMax("24")`, and `GlobalExceptionHandler` turns the exception into a 400 with the messages grouped by field. It only works because `spring-boot-starter-validation` is on the classpath: without a validation provider the annotations are metadata that nothing checks.

```java
// projects/07-timetrack · CreateUserRequest.java and UserController.java
@NotBlank
@Email
@Size(max = 255)
private String email;
@NotNull
private Role role;

public ResponseEntity<CreateUserResponse> create(@Valid @RequestBody CreateUserRequest request){
```

> **Junior tip:** choose the constraint by what it rejects — `@NotNull` only null, `@NotEmpty` also an empty value, `@NotBlank` also whitespace-only text — so `@NotBlank` for strings and `@NotNull` for numbers, dates and enums. Then say why it belongs on the DTO: a `nullable = false` column only stops the null at the database, once the request has already reached the service, while `@Valid` rejects it at the door with a 400 that names the field.

---

<a id="SB-J-020"></a>

**[SB-J-020] What is `@RequestBody` and how does it work?** ⭐⭐

It tells Spring MVC to read the request body and turn it into the parameter's type through a message converter — for JSON that is Jackson, which the web starter brings and Boot configures — so I never parse the payload by hand. Spring picks the converter from the request's `Content-Type`, so a body sent without `application/json` is refused with a 415 before my method runs; Jackson then matches the JSON properties to the DTO's properties by name, and it needs a way to build the object: a record's constructor, an annotated creator, or a no-argument constructor plus setters. In project 07 `POST /api/entries` receives a `CreateTimeEntryRequest`, a Lombok `@Data` class, so Jackson uses the no-argument constructor and the setters Lombok generates, and malformed JSON is answered with a 400 by the `HttpMessageNotReadableException` handler.

> **Junior tip:** the usual follow-up is "why did my DTO arrive with every field null?" — the JSON names did not match the DTO's properties, or the class gave Jackson no way to set them. Knowing that answer shows you understand what `@RequestBody` does under the hood.

---

<a id="SB-J-021"></a>

**[SB-J-021] Why use `@Service` and `@Repository` instead of `@Component` for everything?** ⭐⭐

All three register the class as a bean, so for most classes the stereotype states the layer: in project 07 every service is `@Service`, while small helpers such as `AuthenticatedUserProvider` and `JwtUtil` stay plain `@Component`. The functional difference is `@Repository`'s exception translation — persistence errors arrive as Spring's `DataAccessException` hierarchy — and yet my repositories carry no `@Repository` at all: they are Spring Data interfaces extending `JpaRepository`, and Spring Data applies that translation to the repository it generates. That is why `ProjectService.create` can catch a duplicate name as Spring's `DataIntegrityViolationException` rather than a Hibernate exception; I would write `@Repository` only on a DAO class I implemented myself.

Red flag answer: "Every repository needs `@Repository` or Spring will not find it." — A Spring Data interface is detected because it extends a repository interface, and the translation the annotation would add is already applied to the generated proxy; the annotation matters on a hand-written DAO class.

---

<a id="SB-J-022"></a>

**[SB-J-022] What is the difference between PUT and PATCH, and which HTTP methods are idempotent?** ⭐⭐

PUT replaces the whole resource with the representation the client sends, while PATCH changes only part of it — a few fields, or in my case a state transition. In project 07 `PUT /api/entries/{id}` takes the complete `UpdateTimeEntryRequest` — project, date, hours and description, all required — while the workflow steps are `PATCH /api/entries/{id}/submit`, `/approve`, `/reject` and `/reopen`, because each one changes only the entry's status. Idempotent means that sending the same request twice leaves the server as sending it once does: GET, PUT and DELETE are idempotent, POST is not, and PATCH is not guaranteed to be — which is why the manager's password reset in `UserController` is a POST: every call generates a new password.

Red flag answer: "PATCH is just a newer PUT, they do the same." — The body means different things: a PUT that leaves a field out is asking for it to be emptied, while a PATCH leaves it alone; and mapping a non-idempotent operation to PUT tells clients it is safe to retry when it is not.

---

<a id="SB-J-023"></a>

**[SB-J-023] How do you convert a JPA entity to a DTO in the service layer?** ⭐⭐

By hand, in a private `toResponse` method in each service, called inside the service's transaction so every lazy association it reads can still load. In project 07 `TimeEntryService.toResponse` copies the entry's own fields and flattens its `user` and `project` into an id and a name each, and every service method that returns an entry goes through it, so the conversion lives in one place. On a bigger codebase a team may generate it with MapStruct, an annotation processor whose implementation class only exists after a build — so a missing mapper bean there means the build is misconfigured, not that someone forgot to write the class.

```java
// projects/07-timetrack · TimeEntryService.java
private TimeEntryResponse toResponse(TimeEntry timeEntry) {
    TimeEntryResponse response = new TimeEntryResponse();
    response.setId(timeEntry.getId());
    response.setUserId(timeEntry.getUser().getId());
    response.setUserName(timeEntry.getUser().getName());
    response.setProjectId(timeEntry.getProject().getId());
    response.setProjectName(timeEntry.getProject().getName());
    // ... date, hours, description, status, rejectionNote
    return response;
}
```

> **Junior tip:** say why the mapping runs inside the transaction: with open-in-view off, mapping after the service has returned would throw `LazyInitializationException` on `getUser().getName()`. Present MapStruct as what you expect to meet on a team, not as something a handful of DTOs needs.

---

<a id="SB-J-025"></a>

**[SB-J-025] How do you stop your API from ever returning the password hash in the JSON response?** ⭐⭐

By never letting the entity reach the response: every endpoint in project 07 returns a response DTO, and none of them has a field for the hash — `UserResponse` carries the id, name, email, role and active flag, and the only password that ever leaves the API is the generated one-time password in `CreateUserResponse` and `PasswordResetResponse`, on purpose, because the manager has to pass it on. I do not put `@JsonIgnore` on `User.password`, because no endpoint returns the entity; and as a fallback it has a catch — it hides the field in both directions, so a class annotated that way could not read a password from a request either unless the access mode is narrowed to write-only.

> **Junior tip:** lead with the DTO as the real boundary and present `@JsonIgnore` as a local Jackson rule, not a substitute for a response type. That it works in both directions is the detail most candidates miss.

---

<a id="SB-J-074"></a>

**[SB-J-074] Walk me through building a CRUD endpoint for a resource. Which classes do you create?** ⭐⭐

Taking `Project` in project 07 as the example, from the database up: the `Project` entity; `ProjectRepository`, an interface extending `JpaRepository<Project, Long>` that Spring Data implements; the request DTOs `CreateProjectRequest` and `UpdateProjectRequest`, which carry the validation, and the response DTO `ProjectResponse`; `ProjectService`, which holds the rules — no duplicate names, a delete that deactivates instead of removing — in `@Transactional` methods and maps each entity to the response; and `ProjectController`, which maps `GET`, `GET /{id}`, `POST`, `PUT /{id}` and `DELETE /{id}` under `/api/projects` and answers 200, 201 with a `Location` header, and 204. The error side closes it: the service throws `ResourceNotFoundException` or `DuplicateResourceException`, and the single `GlobalExceptionHandler` turns them into 404 and 409 for every resource.

> **Junior tip:** go in order and say what each layer is allowed to do — the controller only handles HTTP, the service owns the rules and the transaction, the repository only persists. Ending with the status codes and the error mapping is what makes it sound like an endpoint you have actually shipped.

---

<a id="SB-J-075"></a>

**[SB-J-075] Walk me through what happens from the moment an HTTP request reaches your Spring Boot app until the JSON goes back.** ⭐⭐

The embedded Tomcat receives it and runs the servlet filters first — in project 07 that includes Spring Security's chain, where `JwtFilter` validates the token and stores the user in the `SecurityContextHolder`, or the request is answered with a 401 by `JwtAuthenticationEntryPoint` without reaching any controller. Then the `DispatcherServlet` asks the handler mappings which controller method matches the verb and the path; the argument resolvers bind `@PathVariable`, `@RequestParam` and `@RequestBody` — Jackson reading the JSON — and run `@Valid`; method security checks the `@PreAuthorize`; and the controller calls the service. On the way back the same Jackson converter writes the `ResponseEntity` body as JSON, and if anything in the controller or the service throws, `GlobalExceptionHandler` builds the error response instead.

> **Junior tip:** tell it as a numbered path — filters, `DispatcherServlet`, handler mapping, binding and validation, controller, service, converter — and add the debugging consequence: an error raised in a filter never reaches `@RestControllerAdvice`, which is why the 401 has its own entry point.

---

<a id="SB-J-076"></a>

**[SB-J-076] You return an entity with a bidirectional `@OneToMany`/`@ManyToOne` and the response fails with infinite recursion (`StackOverflowError`). Why, and how do you fix it?** ⭐⭐

Jackson serializes by following the getters, and the two sides point at each other: the user's `entries` list holds entries whose `user` holds the same list again, so it recurses until the stack overflows — or until Jackson's own nesting-depth limit stops it with an error. The fix I would choose is at the boundary: return a response DTO that flattens the other side into an id and a name, so there is no cycle to follow. That is how project 07 is built — its entities map only the `@ManyToOne` side, and `TimeEntryResponse` carries `userId` and `userName` instead of the `User` — so the cycle cannot form there.

```java
// illustrative — not from a project
@Entity
class User {
    @OneToMany(mappedBy = "user")
    private List<TimeEntry> entries;   // User → entries → each entry's user → entries → ...
}

@Entity
class TimeEntry {
    @ManyToOne
    private User user;
}
```

Red flag answer: "I add `@JsonIgnore`, or `@JsonManagedReference` and `@JsonBackReference`, to the entity." — That hides the symptom while the API keeps returning the database model; the cycle is a sign the entity is crossing the boundary, and a response DTO removes the cause.

---

<a id="SB-J-026"></a>

**[SB-J-026] A POST endpoint always returns 200 instead of 201 — what did you forget?** ⭐

To set the status: the controller returns the created object directly, or wraps it in `ResponseEntity.ok(...)`, and both give the default 200. The fix is in the return statement: in project 07 every create endpoint ends with `ResponseEntity.created(location).body(created)`, which sends 201 together with a `Location` header pointing at the new resource, built from the current request with `ServletUriComponentsBuilder`.

Red flag answer: "Spring returns 201 for a POST automatically." — The default is 200 for every method; the status has to be stated, with `ResponseEntity` or `@ResponseStatus(HttpStatus.CREATED)`.

---

<a id="SB-J-077"></a>

**[SB-J-077] Your backend has to call another team's REST API. Do you use `RestTemplate`, `RestClient` or `WebClient`, and which would you pick today?** ⭐

In a Spring MVC application like project 07 I would pick `RestClient`: it is the synchronous client Spring Framework 6.1 introduced, with a fluent API — `get().uri(...).retrieve().body(...)` — and it runs on the same blocking model as the rest of the app. `RestTemplate` does the same job with the older template API; the Spring team has put it in maintenance mode and points new code to `RestClient`, but it is what I would expect to find in a maintained codebase, and there I would follow it rather than mix two clients. `WebClient` is WebFlux's reactive, non-blocking client, which earns its place when the application is reactive or has to make many calls concurrently. Project 07 does not call any external API yet, so I have not written one of these calls in it.

Red flag answer: "`WebClient`, because it is the modern one." — It is the reactive client: in a blocking MVC app it pulls in WebFlux and a different programming model for a single call, while the current synchronous answer is `RestClient`.

---
## Spring Data JPA

<a id="SB-J-027"></a>

**[SB-J-027] What is the difference between JPA, Hibernate and Spring Data JPA?** ⭐⭐⭐

JPA — Jakarta Persistence — is the specification: the mapping annotations such as `@Entity`, `@Id` and `@ManyToOne` and the `EntityManager` API, with no code that runs on its own. Hibernate is the implementation that does the work: it reads those mappings, generates the SQL and keeps track of the entities it has loaded. Spring Data JPA sits on top of both and removes the repository boilerplate — I declare an interface and it generates the implementation that calls the `EntityManager` for me. In project 07 `spring-boot-starter-data-jpa` brings all three: the entities import `jakarta.persistence.*`, Hibernate is the provider Boot configures, and `UserRepository` is only an interface extending `JpaRepository<User, Long>`.

> **Junior tip:** give one line per layer — "JPA is the spec, Hibernate implements it, Spring Data generates the repositories on top" — then add that the mapping annotations come from `jakarta.persistence`, and that a Hibernate-only one such as `@CreationTimestamp` ties that entity to Hibernate.

---

<a id="SB-J-028"></a>

**[SB-J-028] What do you get from extending `JpaRepository`, and how is it different from `CrudRepository`?** ⭐⭐⭐

Extending `JpaRepository<User, Long>` gives me the whole CRUD contract without writing an implementation — `save`, `findById`, `findAll`, `existsById`, `count`, `delete`, `deleteById` — because Spring Data generates a proxy for the interface at startup. The interfaces build on one another: `CrudRepository` has the basic operations, the paging-and-sorting interface adds `findAll(Sort)` and `findAll(Pageable)`, and `JpaRepository` combines both and adds the JPA-specific extras — `saveAndFlush`, batch deletes, and `List` results instead of `Iterable`. I extend `JpaRepository` in project 07 because I use those extras: `ProjectService.create` calls `saveAndFlush` so that a duplicate name fails inside its own `try`, and `ProjectService.getAll` passes a `Sort` to `findAll`.

Red flag answer: "They are the same thing." — `JpaRepository` contains everything `CrudRepository` has plus flushing, batch operations, paging and sorting; knowing the hierarchy is what tells you, in a codebase you inherit, which methods each repository can call.

---

<a id="SB-J-032"></a>

**[SB-J-032] How do derived query methods like `findByEmail` work in Spring Data JPA?** ⭐⭐⭐

At startup Spring Data parses the method name — the subject (`find`, `exists`, `count`), then `By`, then entity properties joined with `And` or `Or` and keywords such as `IgnoreCase`, `True` or `Between` — and builds the query from it, so I only write the signature. In project 07 `UserRepository.findByEmail` returns an `Optional<User>` for the login lookup, `existsByEmail` answers yes or no without loading the user, and `ProjectRepository.existsByNameIgnoreCase` checks for duplicate project names regardless of case. Because the name refers to entity properties, a typo such as `findByEmial` stops the application at startup rather than at the first request; when a name stops reading clearly, I switch to `@Query`.

```java
// projects/07-timetrack · UserRepository.java and ProjectRepository.java
Optional<User> findByEmail(String email);
boolean existsByEmail(String email);

List<Project> findByActiveTrue(Sort sort);
boolean existsByNameIgnoreCase(String name);
```

> **Junior tip:** split a name into its three parts — what it does (`find`, `exists`, `count`), `By`, and the property — and say that it is checked against the entity when the application starts. A `Sort` or `Pageable` as the last parameter is the natural follow-up.

---

<a id="SB-J-035"></a>

**[SB-J-035] How do you map a one-to-many relationship? Which side owns it, and what does `mappedBy` do?** ⭐⭐⭐

The owning side is the entity whose table holds the foreign key, mapped with `@ManyToOne` and a `@JoinColumn` naming that column; the other side, if I want it, is `@OneToMany(mappedBy = "user")`, where `mappedBy` names the field that owns the relationship and tells Hibernate that this side writes no column of its own. In project 07 `time_entries` holds `user_id` and `project_id`, so `TimeEntry` carries both `@ManyToOne` associations — and I have not mapped the inverse side at all, because every list of entries comes from `TimeEntryRepository` with filters and paging, never from `user.getEntries()`. A `@OneToMany` with neither `mappedBy` nor `@JoinColumn` is read as a separate relationship, and Hibernate expects a join table nobody meant to create.

```java
// projects/07-timetrack · TimeEntry.java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id", nullable = false)
private User user;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "project_id", nullable = false)
private Project project;
```

> **Junior tip:** start from the database — "the table with the foreign key owns the relationship, and its entity gets `@ManyToOne`" — then add that only the owner is written: changing `user.getEntries()` alone writes no foreign key; the entry's `setUser(...)` is what does.

---

<a id="SB-J-029"></a>

**[SB-J-029] Why do you use `FetchType.LAZY` instead of `FetchType.EAGER`?** ⭐⭐⭐

LAZY loads the associated entity only when the code first touches it, while EAGER loads it together with the owner every time, whether the use case needs it or not. The defaults are asymmetric — `@ManyToOne` and `@OneToOne` are EAGER, collections are LAZY — so in project 07 I set `fetch = FetchType.LAZY` explicitly on both `@ManyToOne` of `TimeEntry`; otherwise every query that loads entries would also load their user and their project. Where a use case does need them, I fetch them on purpose in that query: the entries list brings user and project in the same SELECT.

Red flag answer: "EAGER is simpler: everything is always there." — EAGER is fixed on the mapping, so every query of that entity pays for the association, often with extra SELECTs, even where nobody reads it; how much to load is decided per use case, in the query.

---

<a id="SB-J-030"></a>

**[SB-J-030] What is the N+1 problem, and how do you avoid it?** ⭐⭐⭐

It is one query that loads a list, followed by one more query for each row as soon as the code touches a lazy association of each element — 1 + N round trips for what should be one. In project 07 the entries list is that case: `toResponse` reads each entry's user name and project name, so a page of 20 entries could fire a SELECT for every user and every project not loaded yet. I avoid it with a fetch join: the `fetchUserAndProject` specification adds `user` and `project` to the same SELECT, and it skips the join on the count query that pagination runs, where a fetch join is not allowed. In a `@Query` the same fix is `JOIN FETCH`, and `@EntityGraph` is the annotation-based way to ask for it.

```java
// projects/07-timetrack · TimeEntrySpecifications.java
public static Specification<TimeEntry> fetchUserAndProject() {
    return (root, query, criteriaBuilder) -> {
        if (Long.class != query.getResultType() && long.class != query.getResultType()) {
            root.fetch("user", JoinType.LEFT);
            root.fetch("project", JoinType.LEFT);
        }
        return criteriaBuilder.conjunction();
    };
}
```

> **Junior tip:** describe it as a count of queries — "one for the list, then one per row" — and say how you would see it: with `show-sql` on, the same SELECT repeats with a different id. Then name the fixes — `JOIN FETCH`, `@EntityGraph` or a query that returns a DTO — and say that switching the association to EAGER is not one of them.

---

<a id="SB-J-078"></a>

**[SB-J-078] How do you connect Spring Boot to PostgreSQL? Which dependencies and properties do you need?** ⭐⭐

Two dependencies and three properties. The JPA starter brings Hibernate, Spring Data and the HikariCP connection pool, and the PostgreSQL JDBC driver goes in with `runtime` scope because only the running application needs it; then `spring.datasource.url`, `username` and `password`, and Boot builds the `DataSource` from them on its own — it even infers the driver class from the `jdbc:postgresql:` URL. In project 07 each of the three is an environment-variable placeholder: the URL and the user have local defaults and the password has none, so the password never sits in git. HikariCP keeps a set of connections open and lends one to each unit of work instead of opening a new connection per request.

```properties
# projects/07-timetrack · application.properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/timetrack}
spring.datasource.username=${DB_USERNAME:timetrack_app}
spring.datasource.password=${DB_PASSWORD}
```

> **Junior tip:** answer in order — dependencies, properties, and what Boot builds from them (`DataSource`, `EntityManagerFactory`, transaction manager). If they push on the pool, name HikariCP and say its settings live under `spring.datasource.hikari.*`.

---

<a id="SB-J-036"></a>

**[SB-J-036] Which annotations does a JPA entity need, and which ID generation strategies do you know?** ⭐⭐

`@Entity` on the class and `@Id` on the primary key are the only required annotations; the class also needs a no-argument constructor and must not be `final`, because Hibernate instantiates it and subclasses it for lazy proxies, and `@GeneratedValue` lets the database side produce the id. The strategies are `IDENTITY` (an identity or auto-increment column, so the id is known only after the INSERT), `SEQUENCE` (a database sequence, which PostgreSQL has and which lets Hibernate reserve ids ahead and batch inserts), `TABLE` (rarely used) and `AUTO`, the default, where the provider chooses. In project 07 the entities use a bare `@GeneratedValue`, so it is `AUTO`, which Hibernate resolves to a sequence on PostgreSQL; Lombok's `@NoArgsConstructor` provides the constructor, and `@Table` and `@Column` are there to name the table and declare constraints, not because JPA requires them.

```java
// projects/07-timetrack · User.java
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    private Long id;
    // ...
}
```

> **Junior tip:** the minimum is two annotations, `@Entity` and `@Id`, and the follow-up is the strategy: say what `IDENTITY` and `SEQUENCE` do and that a sequence is the natural choice on PostgreSQL. A class without `@Entity` is not mapped at all, so a repository for it stops the application at startup with "Not a managed type".

---

<a id="SB-J-038"></a>

**[SB-J-038] How do you paginate and sort results in Spring Data (`Pageable`, `Page`)?** ⭐⭐

The controller takes a `Pageable` parameter, which Spring binds from the `page`, `size` and `sort` query parameters, and the repository method that receives it returns a `Page<T>`: the rows of that page plus the total number of elements and pages, which Spring Data gets with an extra count query. In project 07 `GET /api/entries` declares `@PageableDefault(size = 20, sort = {"date", "id"}, direction = DESC)`, the service hands the `Pageable` to `findAll(spec, pageable)` and maps the page to DTOs with `.map(this::toResponse)`, and `WebConfig` caps the size at 100, so a client cannot ask for the whole table in one call. When the client only needs to know whether there is a next page, a `Slice<T>` avoids the count query.

```java
// projects/07-timetrack · TimeEntryController.java and TimeEntryService.java
@PageableDefault(size = 20, sort = {"date", "id"},
        direction = Sort.Direction.DESC) Pageable pageable

return timeEntryRepository.findAll(spec, pageable)
        .map(this::toResponse);
```

> **Junior tip:** name the three request parameters and the two types — `Pageable` in, `Page<T>` out — then the cost: `Page` runs a second query to count, `Slice` does not. A cap on the page size is the detail that shows you thought about a client asking for everything.

---

<a id="SB-J-079"></a>

**[SB-J-079] What does `findById` return, and how do you turn "not found" into a 404?** ⭐⭐

It returns an `Optional<T>` — empty when no row has that id, never `null` — so the missing case has to be handled where the entity is loaded. In project 07 `ProjectService`, `TimeEntryService` and `UserService` unwrap it with `orElseThrow` and a custom `ResourceNotFoundException`, and `GlobalExceptionHandler` maps that exception to a 404 with the API's error body, so no controller checks for absence itself.

```java
// projects/07-timetrack · ProjectService.java
Project project = projectRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
```

> **Junior tip:** say "an `Optional`, never `null`" and show `orElseThrow`. The usual follow-up is `getReferenceById`: it returns a proxy without running a query and fails only when you touch it, so it is useful for setting a foreign key, not for checking that a row exists.

---

<a id="SB-J-033"></a>

**[SB-J-033] When do you write a query with `@Query`, and what is the difference between JPQL and a native query?** ⭐⭐

I use `@Query` when the method name stops expressing the query — an aggregate, a projection, a join with conditions — and I write it in JPQL by default: it queries entities and their fields (`FROM TimeEntry te`, `te.project.name`), so Hibernate translates it into the database's SQL and checks it against the mappings at startup. A native query, with `nativeQuery = true`, is plain SQL against tables and columns; I would use one only for something JPQL cannot express, such as a PostgreSQL-specific function, and I would pay with portability and with that startup check, because Hibernate hands native SQL to the database without reading it. In project 07 the three report queries in `TimeEntryRepository` are JPQL aggregates — `SUM`, grouped with `GROUP BY` in the per-project and per-user reports — with aliases that fill an interface projection, so each report comes from one query instead of loading every entry; none of them needed native SQL.

```java
// projects/07-timetrack · TimeEntryRepository.java
@Query("""
        SELECT te.project.id AS projectId, te.project.name AS projectName, round(SUM(te.hours), 2) AS totalHours, te.project.active AS active
        FROM TimeEntry te
        WHERE te.date BETWEEN :start AND :end AND te.status = com.victor.timetrack.model.EntryStatus.APPROVED
        GROUP BY te.project.id, te.project.name, te.project.active
        ORDER BY SUM(te.hours) DESC, te.project.name ASC
        """)
List<ProjectHoursReportResponse> getHoursByProject(@Param("start") LocalDate start, @Param("end") LocalDate end);
```

Red flag answer: "I always write native SQL because I already know SQL." — It ties the repository to one database and to table and column names, and gives up the startup check that catches a renamed field; native SQL is the exception you justify, not the default.

---

<a id="SB-J-034"></a>

**[SB-J-034] How does `save()` know whether to insert or update?** ⭐⭐

Spring Data first asks whether the entity is new — by default, whether its `@Id` is still `null` — and calls `persist` for a new one, which ends in an INSERT, or `merge` for one that already has an id, which ends in an UPDATE; so `save()` is not a synonym for INSERT. In project 07 `TimeEntryService.create` saves a `new TimeEntry()` with a null id and gets an INSERT and a generated id, while `submit` calls `save` on an entry it has just loaded with `findById`; that entry is already managed, so `merge` returns it unchanged and the UPDATE comes from dirty checking at commit.

> **Junior tip:** "a null id means new: `persist`; anything else: `merge`." Then add the consequence: calling `save` with an id you made up does not insert a row with that id — it goes down the `merge` path.

---

<a id="SB-J-080"></a>

**[SB-J-080] Inside a `@Transactional` method you load an entity, change a field and never call `save()`. Is the change persisted, and why?** ⭐⭐

Yes. An entity loaded inside the transaction is managed by the persistence context, which keeps a snapshot of it; at flush, just before the commit, Hibernate compares every managed entity with its snapshot and writes an UPDATE for whatever changed — that is dirty checking. In project 07 the workflow methods still call `save` after changing the status, as `submit` does below, but on an entry that is already managed that call is redundant: the change would reach the database without it. It is lost only if the entity is detached — loaded outside the transaction or kept after it ended — or if the method runs in a `readOnly` transaction, where nothing is flushed.

```java
// projects/07-timetrack · TimeEntryService.java
@Transactional
public TimeEntryResponse submit(Long id) {
    User user = authenticatedUserProvider.currentUser();
    TimeEntry timeEntry = findOwnedEntry(id, user);
    // ... DRAFT and active-project checks
    timeEntry.setStatus(EntryStatus.SUBMITTED);
    TimeEntry saved = timeEntryRepository.save(timeEntry);
    return toResponse(saved);
}
```

Red flag answer: "No — without `save()` nothing reaches the database." — It shows you do not know the persistence context: managed entities are written at flush, which also means that a setter called by mistake inside a transaction is saved too.

---

<a id="SB-J-037"></a>

**[SB-J-037] Your app logs hundreds of SELECT queries for a single list request — what happened?** ⭐⭐

Almost certainly N+1: the list query ran once, and then a lazy association was loaded row by row. I would confirm it in the log — with `spring.jpa.show-sql=true`, which project 07's `dev` profile sets, the same SELECT on `users` or `projects` repeats with a different id for each row — find which association the code touches in the loop, usually in the DTO mapping, and fetch it in the list query itself with a fetch join or an `@EntityGraph`, the way the entries list fetches user and project. Then I read the log again: one SELECT for the page, plus the count query.

Red flag answer: "I switch the relationship to EAGER." — EAGER does not fix N+1: for a list it often still loads each association with its own SELECT, and now it does so on every query of that entity; the fix is to fetch the association in the query that needs it.

---

<a id="SB-J-031"></a>

**[SB-J-031] How do you map an enum field to the database, and why is `@Enumerated(EnumType.STRING)` the safe choice?** ⭐⭐

With `@Enumerated`, and the decision is what gets stored. The default, `EnumType.ORDINAL`, stores the constant's position (0, 1, 2), so inserting or reordering a constant later silently changes the meaning of every row already saved; `EnumType.STRING` stores the name, which survives that. In project 07 `TimeEntry.status` and `User.role` are both `@Enumerated(EnumType.STRING)`, so the table holds `DRAFT` or `SUBMITTED` — readable in pgAdmin, and safe if a status is ever added between two existing ones. The cost is a few more bytes per row, and renaming a constant becomes a data migration.

Red flag answer: "I leave the default, it works." — It works until someone reorders the enum; then existing rows point at the wrong constant with no error, the kind of corruption nobody notices until the reports are wrong.

---

<a id="SB-J-040"></a>

**[SB-J-040] What is the difference between `cascade = CascadeType.ALL` and `orphanRemoval = true`?** ⭐⭐

`cascade` propagates the operations I run on the parent — persist, merge, remove — to its children, so saving or deleting an order also saves or deletes its lines; `orphanRemoval = true` deletes a child as soon as it is taken out of the parent's collection, even though the parent itself is not deleted. Both go on the parent's `@OneToMany`, and I would combine them only when a child has no life outside its parent, like an order's lines. Project 07 uses neither: its entities map only the `@ManyToOne` side, and a time entry has to outlive its project — deleting a project only deactivates it — so cascading a delete there would erase the hours already logged.

Red flag answer: "I put `CascadeType.ALL` on every relationship so I do not have to save each entity." — On a relationship where the child has a life of its own, a cascaded remove deletes data you meant to keep; a cascade states that the child belongs to the parent, and that has to be true.

---

<a id="SB-J-081"></a>

**[SB-J-081] How do you map a many-to-many relationship, and why do many teams replace `@ManyToMany` with an explicit join entity?** ⭐⭐

With `@ManyToMany` on both sides: the owning side declares `@JoinTable` with the join table and its two foreign keys, and the other side points back with `mappedBy`, so the two fields describe one relationship rather than two. Teams replace it with an entity of its own as soon as the link carries data — a date, a quantity, a status — because a plain join table holds only the two keys, and the day it needs one more column it has to become an entity anyway. Project 07 is that case: users and projects are related many-to-many, and the link is `TimeEntry`, an entity with its own date, hours and status and one `@ManyToOne` towards each side.

```java
// illustrative — not from a project
@Entity
class Student {
    @ManyToMany
    @JoinTable(name = "student_course",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Set<Course> courses = new HashSet<>();
}

@Entity
class Course {
    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}
```

Red flag answer: "I put `@ManyToMany` on both entities and that is it." — Without `mappedBy` on one side Hibernate sees two independent relationships and creates two join tables, and a link that later needs a column forces you to rewrite the mapping.

---

<a id="SB-J-082"></a>

**[SB-J-082] Is there a risk in using Lombok's `@Data` on a JPA entity? What do you use instead?** ⭐⭐

Yes, two. Its `toString` includes every field, associations too, so logging an entity can trigger lazy loading or, with a bidirectional mapping, recurse until the stack overflows; and its `equals` and `hashCode` use every field, so they change whenever a field changes and can load lazy associations just to compare two objects. In project 07 the entities carry `@Getter` and `@Setter` and `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` with only the `id` included, and `TimeEntry`'s `@ToString` excludes `user` and `project`. Id-based equality has its own catch: before the first save the id is `null`, so two new entities compare equal and the hash code changes once the id is assigned — which is why an unsaved entity should not go into a `HashSet`.

```java
// projects/07-timetrack · TimeEntry.java
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"user","project"})
// ...
@Entity
@Table(name = "time_entries")
public class TimeEntry {
    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    private Long id;
```

Red flag answer: "I put `@Data` on the entities, it saves code." — It is the classic Lombok-on-JPA mistake: an innocent log line can fire queries or a `StackOverflowError`, and a `HashSet` of entities misbehaves as soon as a field changes.

---

<a id="SB-J-041"></a>

**[SB-J-041] What is a soft delete, and when would you use it instead of deleting the row?** ⭐⭐

A soft delete marks the row as inactive — `active = false` — instead of running a `DELETE`, so the row stays and normal queries filter it out. I use it when the data has history that must survive: in project 07 deleting a project only deactivates it, because the time entries already logged against it still reference it through `project_id` and still count in the reports, and a real `DELETE` would be refused by that foreign key or, if it went through, would take the history with it. The cost is that every read has to remember the filter: `ProjectRepository.findByActiveTrue` is the list employees see, while managers still see the inactive projects.

Red flag answer: "I always call `deleteById()`." — In a business application that destroys audit history or fails on the foreign keys; the interviewer wants to hear that you thought about what still references the row.

---

<a id="SB-J-039"></a>

**[SB-J-039] Why does your `User` entity need `@Table(name = "users")`?** ⭐

Because `user` is a reserved word in PostgreSQL: by default the table would take the entity's name, `user`, and the `CREATE TABLE` and every query against it would fail with a syntax error unless the name were quoted. `@Table(name = "users")` gives it an explicit name, and in project 07 every table follows the same convention — plural and lowercase: `users`, `projects`, `time_entries` — which avoids reserved words and reads consistently.

> **Junior tip:** present it as a PostgreSQL-specific gotcha — "`user` is reserved" — and mention the two alternatives you did not choose: quoting the identifier, or a global naming strategy.

---

<a id="SB-J-083"></a>

**[SB-J-083] Your `@Query` that runs an `UPDATE` fails at runtime. What is missing?** ⭐

`@Modifying`: without it Spring Data runs the query as a read and expects rows back, so an `UPDATE` or a `DELETE` fails; with it, the method returns the number of rows changed. It also needs an active transaction — `@Transactional` on the service method that calls it — or it fails for lack of one. And the statement goes straight to the database, past the persistence context, so an entity already loaded in that transaction keeps its old values unless I set `clearAutomatically = true`. Project 07 has no bulk update yet — every change loads the entity and lets dirty checking write it — so this is not something I have written there.

```java
// illustrative — not from a project
@Modifying(clearAutomatically = true)
@Query("UPDATE User u SET u.active = false WHERE u.id IN :ids")
int deactivateAll(@Param("ids") Collection<Long> ids);
```

Red flag answer: "I add `nativeQuery = true`." — The query language is not the problem: JPQL or native, a write query needs `@Modifying` and a transaction, and a native one also loses the startup check.

---
## Security and JWT

<a id="SB-J-042"></a>

**[SB-J-042] What is a JWT, and how does stateless authentication with it work in your Spring Boot API?** ⭐⭐⭐

A JWT is a signed token in three Base64url parts — a header, a payload of claims and a signature — that the server issues at login and the client sends back on every request, so the server knows who is calling without keeping a session. In project 07 the Angular app posts the email and password to `POST /api/auth/login`, `AuthService` checks them through the `AuthenticationManager` and answers with a token signed with the server's secret; Angular's `authInterceptor` then adds it as `Authorization: Bearer <token>` to every call, and on each request `JwtFilter` verifies the signature and the expiry, loads the user the token names and puts it in the `SecurityContextHolder`, where the URL rules and `@PreAuthorize` read it. Nothing about the login is kept on the server between requests: each one carries its own proof.

> **Junior tip:** tell it as a loop — "log in once, get a signed token, send it on every request, a filter verifies it and sets the user" — and add that signed is not encrypted: anyone can decode the payload, so it never carries a secret.

---

<a id="SB-J-043"></a>

**[SB-J-043] What is Spring Security, and how do you secure a REST API with it?** ⭐⭐⭐

Spring Security is a chain of servlet filters that runs before any controller and decides who is calling and whether they may make the request; I configure that chain by declaring a `SecurityFilterChain` bean. In project 07's `SecurityConfig` that bean disables CSRF and the session because the API is stateless, plugs in the CORS policy, declares one public rule — `POST /api/auth/login` — before `anyRequest().authenticated()`, sends unauthenticated requests to my `JwtAuthenticationEntryPoint` so they get a JSON 401, and adds `JwtFilter` before `UsernamePasswordAuthenticationFilter`; the per-role rules live on the controller methods as `@PreAuthorize`, which `@EnableMethodSecurity` switches on. There is no public register endpoint — a manager creates accounts through `POST /api/users` — so everything except the login needs a token.

```java
// projects/07-timetrack · SecurityConfig.java
return http
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        // ... .cors(...)
        .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .anyRequest().authenticated()
        )
        // ... .exceptionHandling(...) with the 401 entry point
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
```

> **Junior tip:** open with "a chain of filters in front of the controllers", then walk the bean in order — CSRF, session, CORS, rules, entry point, your filter. Add the deny-by-default point: the `authenticated()` catch-all protects an endpoint added tomorrow without anyone remembering to, and the public rule names the method and the exact path, so it opens nothing else.

---

<a id="SB-J-044"></a>

**[SB-J-044] What is the difference between authentication and authorization?** ⭐⭐⭐

Authentication is proving who you are; authorization is deciding what that identity is allowed to do. In project 07 authentication happens in two forms — the login checks the email and password once, and after that `JwtFilter` recognises the caller from the token on every request — and authorization comes after it: `@PreAuthorize("hasRole('MANAGER')")` lets only managers approve or reject time entries, so an EMPLOYEE who tries is refused. A failed authentication is a 401; a failed authorization is a 403.

> **Junior tip:** one line each — "authentication: who are you? authorization: are you allowed to do this?" — then one real example of each from your project and the status code each failure returns.

---

<a id="SB-J-045"></a>

**[SB-J-045] How do you store users' passwords, and why never in plain text?** ⭐⭐⭐

As a BCrypt hash, never the password itself: `SecurityConfig` publishes a `PasswordEncoder` bean that is a `BCryptPasswordEncoder`, `UserService` saves `passwordEncoder.encode(...)` when a manager creates an account, resets a password or a user changes theirs, and at login Spring Security checks the submitted password with `passwordEncoder.matches(...)` — nothing compares the strings or tries to reverse the hash. If the table leaks, a plain-text column hands over every account at once; a BCrypt hash cannot be reversed, carries its own random salt so two equal passwords are stored differently, and is deliberately slow, so guessing passwords against a stolen hash is expensive.

```java
// projects/07-timetrack · SecurityConfig.java and UserService.java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

newUser.setPassword(passwordEncoder.encode(generatedPassword));
```

Red flag answer: "I hash it with SHA-256 — it is one-way." — A fast hash is built to be computed billions of times a second, which is exactly what brute force needs, and without a salt equal passwords share a hash; passwords need a slow, salted algorithm such as BCrypt.

---

<a id="SB-J-046"></a>

**[SB-J-046] Why did you choose JWT instead of server-side sessions?** ⭐⭐⭐

Because project 07 is a REST API consumed by a separate Angular app, and a JWT lets every request carry its own proof of identity: the server keeps no session, so any instance can verify the token with the secret alone, and the API does not depend on a cookie travelling between two origins. A server-side session is easier to end — deleting it on the server logs the user out at once — but it keeps state in the API's memory, needs a shared store as soon as there are two instances, and, travelling as a cookie, brings CSRF with it. The price I accepted is revocation: a token stays valid until it expires, which is why mine lasts one hour and the filter checks on every request that the account is still active.

Red flag answer: "JWT is more modern and more secure." — Neither is a reason: the argument is statelessness and a separate client, and a candidate who never mentions that a JWT cannot be revoked before it expires has not seen what the choice costs.

---

<a id="SB-J-047"></a>

**[SB-J-047] Why do you disable CSRF protection in a stateless JWT API?** ⭐⭐

Because CSRF abuses credentials the browser attaches on its own — a session cookie travels with any request to the site, even one fired from a malicious page — and my API has none: the JWT goes in the `Authorization` header, which only my Angular code sets, so a forged request from another site arrives without it and is refused with a 401. Left on, CSRF protection would demand a CSRF token on every POST, PUT, PATCH and DELETE that my Angular app does not send, so in project 07 `SecurityConfig` turns it off with `.csrf(AbstractHttpConfigurer::disable)`. The decision follows from where the credential travels: if I moved the token into a cookie, CSRF protection would have to come back.

Red flag answer: "I disabled it because the tutorial did, and my POSTs were getting 403." — Turning a protection off to make an error go away, without saying why the attack does not apply, is exactly what the question tests; the reason is that no credential travels in a cookie.

---

<a id="SB-J-048"></a>

**[SB-J-048] How do you restrict an endpoint to a role — with a URL rule or with `@PreAuthorize`?** ⭐⭐

Both work. A URL rule in the `SecurityFilterChain` — `requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("MANAGER")` — refuses the request in the filter chain before any controller, while `@PreAuthorize("hasRole('MANAGER')")` on the controller method is checked by method security just before the method runs, and is silently ignored unless `@EnableMethodSecurity` is on. In project 07 I chose `@PreAuthorize` for every role rule — `DELETE /api/users/{id}` and approving or rejecting an entry are MANAGER-only, creating and submitting entries EMPLOYEE-only — because the rule sits next to the endpoint it protects, and the chain keeps only the coarse part: the login public, everything else authenticated. The two checks are independent, so a request has to pass both.

```java
// projects/07-timetrack · UserController.java
@PreAuthorize("hasRole('MANAGER')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id){
```

Red flag answer: "I hide the delete button for employees in Angular." — That is UX, not security: anyone can call the API with Postman, so the role check has to be on the server, on every protected endpoint.

---

<a id="SB-J-049"></a>

**[SB-J-049] Where do you keep the JWT signing secret, and why not in the code?** ⭐⭐

In an environment variable: project 07's `application.properties`, which is committed, holds only `app.jwt.secret=${JWT_SECRET}` with no default, and `JwtUtil` receives the value through `@Value("${app.jwt.secret}")`. Whoever has that secret can sign tokens the API will accept — a token claiming to be any user, a manager included — so a secret written in the source would sit in the git history for everyone with access to the repository. With no default, the application refuses to start when the variable is missing instead of running with an empty key, and the value itself has to be long and random: `Keys.hmacShaKeyFor` refuses a key shorter than 256 bits, and moving a weak password out of the code does not make it strong.

Red flag answer: "I put it in `application.properties`, so it is not in the code." — A committed properties file is in git just like the code; and the danger is not that someone reads tokens — anyone can decode them — but that they can forge them.

---

<a id="SB-J-050"></a>

**[SB-J-050] What goes inside a JWT, and how does your `generateToken()` build it?** ⭐⭐

Three Base64url parts separated by dots: a header naming the signing algorithm, a payload of claims, and a signature over both. In project 07 the payload carries three standard claims — `sub`, the user's id; `iat`, when it was issued; and `exp`, one hour later, because `app.jwt.expiration` is 3600000 milliseconds — and `JwtUtil.generateToken` builds them with jjwt and signs them with an HMAC key derived from the secret. The subject is the id rather than the email on purpose, because a manager can change a user's email and the token must keep pointing at the same account; and the role is not in the token at all, because the filter loads the user on every request and takes the role from the database.

```java
// projects/07-timetrack · JwtUtil.java
public String generateToken(Long userId) {
    return Jwts.builder()
            .subject(String.valueOf(userId))
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey())
            .compact();
}
```

> **Junior tip:** name the three claims and what each one is for, then say that the payload is only encoded, not encrypted — paste a token into a decoder and you can read it — so it identifies the user but never carries a password or anything secret.

---

<a id="SB-J-051"></a>

**[SB-J-051] What is the difference between 401 Unauthorized and 403 Forbidden, and when does Spring Security return each?** ⭐⭐

401 means the API does not know who is calling — no token, an expired one, a bad signature — and 403 means it knows exactly who it is, and that user is not allowed to do this. In project 07 a request without a valid token is stopped by the chain's `anyRequest().authenticated()`, and my `JwtAuthenticationEntryPoint` answers it with a 401 in the API's JSON error format; an EMPLOYEE calling `PATCH /api/entries/{id}/approve` is authenticated but fails `@PreAuthorize("hasRole('MANAGER')")`, and `GlobalExceptionHandler` turns the resulting `AccessDeniedException` into a 403. Without that entry point, a stateless API with no login form answers a missing token with a 403 by default, and the Angular interceptor, which logs the user out on a 401, could not tell an expired session from a forbidden action.

> **Junior tip:** "401: who are you? 403: I know who you are, and the answer is no." Then say where each one is produced — the entry point in the filter chain for the 401, method security or a URL rule for the 403 — because that is where you look when the wrong one comes back.

---

<a id="SB-J-052"></a>

**[SB-J-052] What is `UserDetailsService`, and why do you implement it?** ⭐⭐

It is the Spring Security interface with one method, `loadUserByUsername`, through which the framework asks my application for a user: I implement it and Spring calls it — I never do. In project 07 `UserDetailsServiceImpl` finds the user by the normalised email and returns a `UserDetails` with the email, the BCrypt hash, the role through `.roles(...)` and `disabled` when the account is inactive; at login, `AuthService` calls the `AuthenticationManager`, whose `DaoAuthenticationProvider` calls my method and then checks the password with the `PasswordEncoder`. I added a second method, `loadUserById`, for `JwtFilter`, because the token identifies the user by id.

> **Junior tip:** say "I implement it, Spring calls it", then trace the login: `AuthenticationManager` → provider → `loadUserByUsername` → `PasswordEncoder.matches`. The "username" is whatever identifies your users — in project 07, the email.

---

<a id="SB-J-053"></a>

**[SB-J-053] What does `SessionCreationPolicy.STATELESS` do in your `SecurityFilterChain`?** ⭐⭐

It tells Spring Security never to create an `HttpSession` and never to use one to remember who is logged in, so an authentication exists only for the request in hand and every request has to prove it again. In project 07 that proof is the JWT: `JwtFilter` rebuilds the authentication from the token on every request, and with no session there is no `JSESSIONID` cookie, no per-user state in the server's memory and nothing to share if the API ran on two instances. Without it, the default policy lets the framework create a session whenever it needs one — to save the request a 401 interrupted, for example — so session cookies and per-user state appear in an API that should hold none.

> **Junior tip:** "stateless means every request proves who it is" — pair it with the JWT filter that does the proving, and add that no session also means no session cookie, which is part of why disabling CSRF is safe here.

---

<a id="SB-J-054"></a>

**[SB-J-054] Once you have issued a JWT, can you invalidate it before it expires?** ⭐⭐

Not the token itself: the server keeps no record of it, so a correctly signed token passes verification until its `exp`, and logging out in Angular only deletes the browser's copy — whoever else holds it can keep using it. What I can do is limit the damage: in project 07 tokens live one hour, and `JwtFilter` loads the user on every request and runs `AccountStatusUserDetailsChecker`, so a manager who deactivates an account cuts off that user's existing token on the next request, without waiting for the expiry. Revoking one specific token would need state on the server — a denylist of token ids, or short access tokens with refresh tokens — which brings back what JWT avoids, so I would add it only when the product needs it.

Red flag answer: "Yes — when the user logs out I delete the token." — That deletes one copy in one browser; the token stays valid on the server until it expires, which is the trade-off of stateless tokens a candidate is expected to know.

---

<a id="SB-J-084"></a>

**[SB-J-084] Where in the request flow is the JWT validated, and why does your filter extend `OncePerRequestFilter`?** ⭐⭐

In a filter of my own inside Spring Security's chain, before any controller: `SecurityConfig` adds `JwtFilter` before `UsernamePasswordAuthenticationFilter`, so by the time the authorization rules run, the user is already in the `SecurityContextHolder`. It extends `OncePerRequestFilter` so the check runs exactly once per request, even if the request is dispatched again internally, for an error or a forward. Inside, it reads the `Bearer` header and takes the user id from the token — parsing it with the secret already checks the signature and the expiry — then loads that user, checks that the account is still active, and stores a three-argument `UsernamePasswordAuthenticationToken` — the one with authorities, which means authenticated; if anything fails it stores nothing and lets the request continue, and the entry point answers 401.

```java
// projects/07-timetrack · JwtFilter.java
Long userId = jwtUtil.extractUserId(token);
if (SecurityContextHolder.getContext().getAuthentication() == null) {
    UserDetails userDetails = userDetailsService.loadUserById(userId);
    if (jwtUtil.isValid(token, userId)) {
        accountStatusUserDetailsChecker.check(userDetails);
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}
```

> **Junior tip:** walk it as numbered steps — header, token, user, checks, security context, `filterChain.doFilter` — and stress that the filter never writes the error itself: it leaves a bad request unauthenticated and lets the chain refuse it, so a broken token fails closed.

---

<a id="SB-J-085"></a>

**[SB-J-085] How do you get the currently authenticated user inside a controller or a service?** ⭐⭐

From the `SecurityContextHolder`, where the JWT filter stored the authentication for this request: `getContext().getAuthentication()` gives me the principal, and its name is the user's email. In project 07 I wrapped that in one component, `AuthenticatedUserProvider`, whose `currentUser()` loads the `User` entity by that email and whose `isManager()` checks the authorities, so services such as `TimeEntryService` ask it who is calling. In a controller, Spring can also inject the principal as a method parameter with `@AuthenticationPrincipal UserDetails user`, which avoids reaching into the static holder; I have not used it in project 07, because there the services, not the controllers, need the current user.

```java
// projects/07-timetrack · AuthenticatedUserProvider.java
public User currentUser() {
    String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
    return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
}
```

> **Junior tip:** name both ways — the holder, which works anywhere in the request's thread, and `@AuthenticationPrincipal` for a controller parameter — and say why the identity comes from there and not from the request: a client can send any user id it likes, but it cannot change what the filter verified.

---

<a id="SB-J-055"></a>

**[SB-J-055] Your JWT filter is rejecting valid tokens — what do you check first?** ⭐

The status code first: a 403 means the token was accepted and the problem is the role, while a 401 points at the filter — and then the log says why, because in project 07 `JwtFilter` catches the parser's and the user lookup's exceptions and writes `Authentication rejected:` with the message: an expired token, a signature that does not match, an unknown user, a disabled account. After that, the usual causes: the header must be exactly `Bearer ` followed by the token, or the filter skips it without logging anything and the request arrives anonymous; the token must have been signed with the same `JWT_SECRET` the API is running with now, so a secret that differs between environments invalidates every token issued by the other one; and it must not be past its one-hour expiry.

Red flag answer: "I raise the expiration to a few days." — It treats a symptom without reading why the token was rejected — a wrong secret or a disabled account would still fail — and a long-lived token widens the window in which a stolen one can be used.

---

<a id="SB-J-086"></a>

**[SB-J-086] `@PreAuthorize("hasRole('MANAGER')")` returns 403 even though the user's role in the database is `MANAGER`. What is going on?** ⭐

Almost certainly the prefix: `hasRole('MANAGER')` does not look for `MANAGER`, it looks for the authority `ROLE_MANAGER`, so if the `UserDetails` was built with the bare role name — `new SimpleGrantedAuthority("MANAGER")` — the user is authenticated and still fails the check. In project 07 `UserDetailsServiceImpl` builds the authorities with the builder's `.roles(user.getRole().name())`, which adds `ROLE_` for me, and the one place that compares the string by hand, `AuthenticatedUserProvider.isManager()`, compares it with `"ROLE_" + Role.MANAGER.name()`. The fix is to make storage and check agree: store `ROLE_MANAGER`, or check with `hasAuthority('MANAGER')`, which compares the string literally.

```java
// projects/07-timetrack · UserDetailsServiceImpl.java
return org.springframework.security.core.userdetails.User
        .withUsername(user.getEmail())
        .password(user.getPassword())
        .roles(user.getRole().name())   // MANAGER → authority ROLE_MANAGER
        .disabled(!user.isActive())
        .build();
```

Red flag answer: "The role must be wrong in the database, so I would change the user's data." — The data is right; the mismatch is between how the authority is built and how `hasRole` compares it, and no change to the user's row fixes the code that builds the authorities.

---
## Exception handling

<a id="SB-J-056"></a>

**[SB-J-056] How do you handle exceptions globally in a Spring Boot REST API?** ⭐⭐⭐

With one class annotated `@RestControllerAdvice` whose `@ExceptionHandler` methods each take one exception type and turn it into a status and a JSON body, so the controllers and services only throw. In project 07 that class is `GlobalExceptionHandler`: `ResourceNotFoundException` becomes a 404, `DuplicateResourceException` and `InvalidStateTransitionException` a 409, a failed `@Valid` a 400 with the errors listed by field, `AccessDeniedException` a 403, and a last handler for `RuntimeException` answers 500 with a generic message — all of them in the same `ErrorResponse` body: timestamp, status, error, message, and the field errors when there are any. When several handlers could match, Spring picks the one whose declared type is closest to the thrown exception, so the specific handlers win over the `RuntimeException` one.

```java
// projects/07-timetrack · GlobalExceptionHandler.java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException e) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(buildError(HttpStatus.NOT_FOUND, e.getMessage()));
    }
    // ... one handler per exception type, and a RuntimeException handler as the 500 fallback
}
```

> **Junior tip:** sum it up as "the controllers throw, one advice translates", then give two or three real mappings with their status and the payoff: no try/catch in any controller method, and one error format for the whole API. The usual follow-up is which handler wins when several match: the most specific exception type, not the order of the methods in the class.

---

<a id="SB-J-087"></a>

**[SB-J-087] When `@Valid` fails on a request body, what does the client receive, and how do you return the field errors in a clean 400?** ⭐⭐

Spring throws `MethodArgumentNotValidException` before my method runs. Left to the framework's defaults, the client gets a 400, but with Boot's generic error body — timestamp, status, error and path — and none of the field messages Angular needs to show under each input. So in project 07 `GlobalExceptionHandler` handles it: it reads the `FieldError`s from the exception's `BindingResult`, groups their messages by field name and returns a 400 whose `fieldErrors` is, for example, `{"email": ["Must be a valid email address"]}`, inside the same `ErrorResponse` every other error uses.

```java
// projects/07-timetrack · GlobalExceptionHandler.java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
    Map<String, List<String>> errors = e.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.groupingBy(
                    FieldError::getField,
                    Collectors.mapping(FieldError::getDefaultMessage, Collectors.toList())
            ));
    ErrorResponse errorResponse = buildError(HttpStatus.BAD_REQUEST, "Validation failed");
    errorResponse.setFieldErrors(errors);
    return ResponseEntity.badRequest().body(errorResponse);
}
```

> **Junior tip:** name the exception first, then say what the default body lacks and what yours adds: one list of messages per field, so the frontend can show each error next to its input.

---

<a id="SB-J-057"></a>

**[SB-J-057] How do you design the custom exceptions of your API, and why do they extend `RuntimeException`?** ⭐⭐

One exception per kind of failure, named after what went wrong rather than after a status: in project 07 they include `ResourceNotFoundException`, `DuplicateResourceException`, `InvalidStateTransitionException`, `BusinessRuleViolationException` and `ForbiddenOperationException`, which `GlobalExceptionHandler` maps to 404, 409, 409, 400 and 403 — so the service says what happened and the advice decides how HTTP reports it. They extend `RuntimeException` for two reasons: no method between the service and the advice has to declare them with `throws`, and `@Transactional` rolls back by default only on unchecked exceptions, so a checked business exception would let the transaction commit what it had already written. When the message belongs to one input, the exception carries the field: `DuplicateResourceException("email", ...)` lets one handler put the message under `fieldErrors.email`.

Red flag answer: "I throw `new RuntimeException("not found")` everywhere and check the message in the handler." — The handler can then only tell failures apart by parsing text, so they all end up with the same status, and rewording a message silently breaks the mapping; a dedicated type is what gives each failure its own status.

---

<a id="SB-J-088"></a>

**[SB-J-088] `@ControllerAdvice` or `@RestControllerAdvice`: which do you use in a REST API, and why?** ⭐⭐

`@RestControllerAdvice`, which is `@ControllerAdvice` plus `@ResponseBody`: whatever a handler returns is written as JSON by Jackson, just as `@RestController` does for controllers. With a plain `@ControllerAdvice`, a handler returning an object such as my `ErrorResponse` would make Spring look for a view to render, unless the method carries `@ResponseBody` or returns a `ResponseEntity`, whose body is always written. In project 07 `GlobalExceptionHandler` is a `@RestControllerAdvice` and every handler returns `ResponseEntity<ErrorResponse>`, so it would work either way; I keep the REST variant because it states that this advice serves a JSON API, and a handler added later that returns a plain object still answers JSON.

Red flag answer: "There is no difference, they are interchangeable." — Only while every handler returns a `ResponseEntity`; a handler that returns a plain object in a `@ControllerAdvice` sends Spring looking for a view, and the client gets an error instead of the JSON body.

---

<a id="SB-J-089"></a>

**[SB-J-089] When would you put `@ResponseStatus` on a custom exception instead of mapping it in an `@ExceptionHandler`?** ⭐⭐

When the status is all I need: `@ResponseStatus(HttpStatus.NOT_FOUND)` on the exception class makes Spring answer that status whenever the exception escapes a controller, with no handler at all — but the body is Boot's default error body, which by default does not even include the message. In project 07 I mapped everything in `GlobalExceptionHandler` instead, because the API promises one `ErrorResponse` format with the message and, for some errors, `fieldErrors`, and Angular reads them. Mixing the two there would also be a trap: the `@ExceptionHandler` methods are consulted before the annotation on the exception, so a new exception carrying only `@ResponseStatus` would be caught by my `RuntimeException` fallback and come back as a 500. For a one-off status at the throw site there is `ResponseStatusException`, which I expect to meet in maintained code; I have not used either of them in project 07.

```java
// illustrative — not from a project
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProjectNotFoundException extends RuntimeException { /* ... */ }

throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
```

Red flag answer: "They do the same, so I put `@ResponseStatus` on every exception and skip the advice." — That gives up the API's error body: the client gets Boot's generic body without the message or the field errors, and next to a catch-all handler in an advice the annotation is never even reached.

---

<a id="SB-J-090"></a>

**[SB-J-090] A manager creates a user with an email that already exists, and the API answers 500 with a `DataIntegrityViolationException` in the log. What should it return, and where do you handle it?** ⭐⭐

A 409 Conflict that names the field — the request is valid, it clashes with data that already exists — and the place to decide that is the service, which knows what the clash means. In project 07 `UserService.create`, behind `POST /api/users`, checks `existsByEmail` first and throws `DuplicateResourceException("email", "Email already in use")`, which `GlobalExceptionHandler` turns into a 409 with `fieldErrors.email`. The check alone is not enough, because two requests can pass it at the same time; the `unique` constraint on the email column then stops the second one, so I save with `saveAndFlush` inside a `try` — the INSERT runs there, not at commit — and translate that `DataIntegrityViolationException` into the same exception. The advice also maps any `DataIntegrityViolationException` that escapes to a 409, but only as a coarse net: it would answer "A resource with this value already exists" to a not-null violation too, so the precise message has to come from the service.

```java
// projects/07-timetrack · UserService.java
if (userRepository.existsByEmail(email)) {
    throw new DuplicateResourceException("email", "Email already in use");
}
// ...
try {
    User saved = userRepository.saveAndFlush(newUser);
    // ... builds the response with the generated password
} catch (DataIntegrityViolationException e) {
    throw new DuplicateResourceException("email", "Email already in use");
}
```

Red flag answer: "I check `existsByEmail` before saving, so it cannot happen." — The check and the INSERT are two separate steps, so two concurrent requests can both pass it; only the database constraint is final, and its exception has to be translated into a 409 rather than left to become a 500.

---

<a id="SB-J-091"></a>

**[SB-J-091] Your catch-all exception handler sends `e.getMessage()`, or the whole stack trace, back to the client. What is wrong with that, and what should it do instead?** ⭐⭐

The fallback is reached by the failures nobody planned for, and their messages are written for developers: a SQL error with table and constraint names, a class name, a file path — details that tell an attacker how the system is built and tell the user nothing they can act on. The fallback should log the whole exception on the server and send the client a fixed, generic body. In project 07 that is the last handler of `GlobalExceptionHandler`: it catches `RuntimeException`, writes it to the log with `log.error`, stack trace included, and answers 500 with "Internal server error" in the usual `ErrorResponse`; the exceptions whose message is written for the client, such as `ResourceNotFoundException`, have their own handlers, which Spring prefers because their type is more specific. Boot's own `/error` makes the same choice: it leaves out the message and the stack trace unless the `server.error.include-*` properties switch them on.

```java
// projects/07-timetrack · GlobalExceptionHandler.java
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException e) {
    log.error("Unhandled exception", e);
    return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"));
}
```

Red flag answer: "Returning the real message helps the frontend debug." — Debugging belongs in the server log, which keeps the full stack trace; the response reaches every caller, an attacker included, and a raw exception message can expose SQL, class names or data.

---

<a id="SB-J-059"></a>

**[SB-J-059] What is the difference between `MethodArgumentNotValidException` and `ConstraintViolationException`?** ⭐

They come from different kinds of validation. `MethodArgumentNotValidException` is thrown when a `@Valid @RequestBody` object fails, with one `FieldError` per broken property of the DTO. A constraint placed directly on a method parameter — `@RequestParam @Min(1) int page` — is method validation: since Spring 6.1, Spring MVC runs it itself and throws `HandlerMethodValidationException`, while the older approach, `@Validated` on the controller class, runs it through a proxy and throws `ConstraintViolationException`, which many maintained codebases still handle. Each one needs its own handler. Project 07 validates only request bodies — its query parameters are just type-checked, and a bad value such as `status=FOO` gets a 400 from the `MethodArgumentTypeMismatchException` handler — so if I added parameter constraints I would add a handler with them, because otherwise my `RuntimeException` fallback would turn their failures into a 500.

> **Junior tip:** tie each exception to where the constraint sits — on the DTO's fields or on the method's parameters — and say that each needs its own handler. Naming `HandlerMethodValidationException` shows you know current Spring, not only older tutorials.

---
## Transactions

<a id="SB-J-092"></a>

**[SB-J-092] Spring Data's repository methods are already transactional. Why do you still put `@Transactional` on your service methods?** ⭐⭐

Because a repository method such as `save` is transactional only on its own: each call opens and commits its own transaction. So a service method without the annotation that saves twice keeps the first save even when the second one fails, and, with `open-in-view` off as in project 07, an entity it loads is already detached on the next line. On the service method, `@Transactional` makes the whole use case one transaction that the repository calls join, so it commits or rolls back as a unit. In project 07 a code review raised exactly this, and since then every service write method carries it; `TimeEntryService.approve`, for example, loads the entry, checks its owner and its status, changes it and maps it with `toResponse` — and that mapping can load the lazy `user` and `project` only because the transaction is still open.

Red flag answer: "The repository is already transactional, so the service does not need it." — Each `save` commits on its own, so a use case with two writes is not atomic: a failure halfway leaves the first write in the database.

---

<a id="SB-J-060"></a>

**[SB-J-060] What does `@Transactional(readOnly = true)` do, and why do you put it on your read methods?** ⭐⭐

It declares that the transaction will not write. Spring passes that on to Hibernate, which then never flushes the session on its own and keeps no snapshot of the entities it loads, so there is no dirty checking at commit and each request uses less memory; Spring also hands the flag down to the JDBC connection, but what the database does with it depends on the driver, so it is a hint, not a guarantee that a write is refused. In project 07 every service method that only reads — `ProjectService.getAll` and `getById`, `TimeEntryService.findByFilter` and the three `ReportService` reports among them — is `@Transactional(readOnly = true)`, and every write is a plain `@Transactional`. The reads still run in a transaction because `open-in-view` is off: the mapping to response DTOs happens inside the service while the persistence context is open, so any lazy association it reads can still load.

> **Junior tip:** give the rule — reads `readOnly = true`, writes a plain `@Transactional` — then say what it saves (no flush, no dirty checking) and what it is not: a promise that the database will reject a write. A change made inside a read-only transaction is simply never written, because nothing is flushed.

---

<a id="SB-J-061"></a>

**[SB-J-061] You put `@Transactional` on a method and no transaction opens: the method is private, or it is public but called from another method of the same class. Why?** ⭐⭐

Because the annotation works through a proxy: other beans receive a generated subclass of my service that opens the transaction and then calls the real method, so only a call that passes through that proxy gets one. A private method cannot be overridden by the subclass, so the annotation on it is ignored without any error — since Spring 6, class-based proxies also cover protected and package-private methods, but never private ones. A call from another method of the same class goes to `this`, the real object, so it skips the proxy even when the method is public. The fix is to put the boundary on the public method that is called from outside, or to move the inner method to another bean. In project 07 every `@Transactional` sits on a public service method that another bean calls — a controller or the security layer — and the shared steps, such as `findOwnedEntry`, `resolveProject` and `toResponse` in `TimeEntryService`, are private helpers with no annotation that run inside the transaction the public method already opened.

```java
// illustrative — not from a project
@Service
public class ImportService {
    public void importAll(List<Row> rows) {
        rows.forEach(this::importRow);   // call on `this`: it never goes through the proxy
    }

    @Transactional
    public void importRow(Row row) { /* ... */ }
}
```

Red flag answer: "I make the method public and it works." — Public is not enough when the call comes from the same class: it still lands on `this` and never on the proxy, so the boundary has to be on the method called from outside, or the method has to live in another bean.

---

<a id="SB-J-062"></a>

**[SB-J-062] Does `@Transactional` roll back on every exception? What happens with a checked exception, or with a `RuntimeException` you catch inside the method?** ⭐⭐

No. By default it rolls back only when an unchecked exception — a `RuntimeException` or an `Error` — leaves the method. A checked exception that leaves it lets the transaction commit whatever was already written, unless I declare it with `rollbackFor`; and a `RuntimeException` I catch inside the method without rethrowing it looks like a normal return to the proxy, so that commits too, and the half-finished work is saved. One case differs: if the exception came out of a repository method such as `saveAndFlush`, that method's own transactional proxy has already marked the transaction rollback-only, so swallowing it ends in an `UnexpectedRollbackException` at commit. In project 07 every domain exception extends `RuntimeException`, so a rule broken halfway rolls the whole operation back with no `rollbackFor`; and every `catch` inside a service rethrows: the `DataIntegrityViolationException` of a duplicate name or email in `ProjectService` and `UserService` becomes a `DuplicateResourceException`, so an unchecked exception still leaves the method and the transaction rolls back.

```java
// illustrative — not from a project
@Transactional(rollbackFor = IOException.class)   // without it, the IOException commits the first save
public void importEntries(Path file) throws IOException {
    repository.save(header);
    List<String> lines = Files.readAllLines(file);  // checked: may throw IOException
}
```

Red flag answer: "Yes, any exception rolls it back." — Only unchecked ones do by default: a checked exception commits what was written, and so does a `RuntimeException` swallowed inside the method — which is how a failed operation ends up half-saved.

---
## Testing

<a id="SB-J-063"></a>

**[SB-J-063] What is the difference between a plain unit test, a slice test and `@SpringBootTest`, and when do you use each?** ⭐⭐⭐

`@SpringBootTest` starts the whole application context — every bean, the auto-configuration and the real datasource unless the test configures another — so it proves the wiring and a flow across layers, at the cost of seconds per context and whatever infrastructure that context needs. A slice loads one layer: `@WebMvcTest` the MVC side with the services mocked, `@DataJpaTest` the entities and repositories. A plain JUnit test with Mockito starts no Spring at all, and it is where the business rules belong: in project 07 they live in the services — `TimeEntryService.submit` refusing anything that is not a DRAFT, for example — so Step 8, the project's next step, tests them with JUnit 5 and Mockito, one test class per service and no database running. The only `@SpringBootTest` in the project today is the Initializr's `contextLoads()`, which asserts nothing and cannot even start without a live PostgreSQL and the `DB_PASSWORD` and `JWT_SECRET` variables, so Step 8 deletes it; the slices come in my next project.

Red flag answer: "I use `@SpringBootTest` for everything because it tests the real thing." — Every rule then pays for a full context and a database, the suite gets slow and depends on the machine it runs on, and a failure no longer says which layer broke.

---

<a id="SB-J-064"></a>

**[SB-J-064] What is the difference between `@Mock` and `@MockitoBean` (formerly `@MockBean`), and when do you use each?** ⭐⭐⭐

`@Mock` is plain Mockito: with `@ExtendWith(MockitoExtension.class)` it creates a fake of the class, and `@InjectMocks` builds the class under test with those fakes through its constructor — no Spring involved, which is what I use for a service. `@MockitoBean` is Spring's: it replaces a bean inside a Spring test context with a Mockito mock, so I need it only when the test starts a context — a `@WebMvcTest` whose controller needs its service, for example. `@MockBean` is Spring Boot's older annotation for the same thing: deprecated in Boot 3.4 and gone from Boot 4, which is what project 07 runs, but you still see it in a lot of Boot 3 code. In project 07 the services take every dependency through the constructor, so `TimeEntryService` can be built in a test with three `@Mock`s and no context at all.

```java
// illustrative — not from a project
@ExtendWith(MockitoExtension.class)
class TimeEntryServiceTest {
    @Mock TimeEntryRepository timeEntryRepository;
    @Mock ProjectRepository projectRepository;
    @Mock AuthenticatedUserProvider authenticatedUserProvider;
    @InjectMocks TimeEntryService timeEntryService;   // built with the three mocks
}

@WebMvcTest(TimeEntryController.class)
class TimeEntryControllerTest {
    @MockitoBean TimeEntryService timeEntryService;   // replaces the bean in the slice's context
}
```

Red flag answer: "I put `@MockBean` on every dependency, also in service tests." — `@MockBean` only works inside a Spring context, so a service test that uses it has to start one just to get its mocks, and in Boot 4 the annotation no longer exists.

---

<a id="SB-J-093"></a>

**[SB-J-093] How would you unit test a service with JUnit and Mockito? Walk me through it with one of your services.** ⭐⭐⭐

I test the service on its own and fake what it depends on: the repositories and the component that says who is calling become Mockito mocks, so the test needs no database and no Spring. Each test follows given/when/then: given — I stub the mocks with `when(...).thenReturn(...)`; when — I call the method; then — I assert on what it returned or threw, and use `verify(...)` only when the call itself is the outcome, such as checking that nothing was saved after a refusal. The tests for project 07's services are its next step, Step 8, so I have not written them yet; `TimeEntryService.submit` is the one I would start with, because it holds a rule an interviewer can check — only a DRAFT entry can be submitted, and only for an active project.

```java
// projects/07-timetrack · TimeEntryService.java (the code under test)
TimeEntry timeEntry = findOwnedEntry(id, user);
if (timeEntry.getStatus() != EntryStatus.DRAFT) {
    throw new InvalidStateTransitionException("Employee can only submit DRAFT entries");
}
```

```java
// illustrative — not from a project (the test Step 8 will add)
@Test
void submit_throwsWhenEntryIsNotDraft() {
    when(authenticatedUserProvider.currentUser()).thenReturn(employee);   // given: entry owned by employee
    entry.setStatus(EntryStatus.SUBMITTED);
    when(timeEntryRepository.findById(10L)).thenReturn(Optional.of(entry));

    assertThatThrownBy(() -> timeEntryService.submit(10L))               // when + then
            .isInstanceOf(InvalidStateTransitionException.class);
    verify(timeEntryRepository, never()).save(any());
}
```

> **Junior tip:** say the three steps out loud — mock the collaborators, call the method, assert the result — and add the rule that makes the test worth having: assert on what the method returns or throws, and keep `verify` for when the interaction is the point. A happy path plus one broken rule per method is the honest junior answer.

---

<a id="SB-J-065"></a>

**[SB-J-065] How do you test a controller without starting the server, and what does `@WebMvcTest` load?** ⭐⭐

`@WebMvcTest` starts only the MVC part of the application — controllers, `@ControllerAdvice`, filters, converters and Jackson — and no services or repositories, so whatever the controller calls has to be supplied as a `@MockitoBean`. `MockMvc` then sends a request through the real `DispatcherServlet` without opening a port: the mapping, the binding, `@Valid`, the JSON conversion and the exception handler all run as they would in production. I check the status with `status()` and individual fields of the body with `jsonPath(...)`, rather than comparing the whole JSON as a string. Project 07 has no slice tests: its plan keeps it to the unit level, and `@WebMvcTest` comes in my next project; on project 07 the first one I would write is `PATCH /api/entries/{id}/submit` answering 409 with the API's error body when the entry is not a DRAFT.

```java
// projects/07-timetrack · TimeEntryController.java (the endpoint under test)
@PreAuthorize("hasRole('EMPLOYEE')")
@PatchMapping("/{id}/submit")
public ResponseEntity<TimeEntryResponse> submit(@PathVariable Long id) {
    return ResponseEntity.ok(timeEntryService.submit(id));
}
```

```java
// illustrative — not from a project
when(timeEntryService.submit(10L))
        .thenThrow(new InvalidStateTransitionException("Employee can only submit DRAFT entries"));

mockMvc.perform(patch("/api/entries/10/submit"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.status").value(409))
        .andExpect(jsonPath("$.message").value("Employee can only submit DRAFT entries"));
```

> **Junior tip:** name what the slice loads and what it leaves out — the web layer in, the services mocked — then `perform` → `andExpect(status())` → `andExpect(jsonPath(...))`. Mention that with Spring Security on the classpath this request needs an authenticated user; that is the usual follow-up.

---

<a id="SB-J-094"></a>

**[SB-J-094] After adding Spring Security, every request in your `@WebMvcTest` comes back 401 or 403. Why, and how do you test secured endpoints?** ⭐⭐

Because the slice keeps Spring Security: the request reaches the filter chain with no authenticated user, so it is refused before the controller — a 401, or a 403 on a POST or PATCH that the default chain's CSRF protection rejects first. I would not switch security off; I give the request a user with `@WithMockUser(roles = "EMPLOYEE")`, or `.with(user(...))` on the request, both from Spring Security's test support. A project like 07 has two more traps. The slice does not scan `@Configuration` classes, so my `SecurityConfig` — the chain with CSRF off, the JSON 401 and `@EnableMethodSecurity` — is not loaded unless I `@Import` it, together with the `JwtAuthenticationEntryPoint` it injects, and without it no `@PreAuthorize` is active in the test. And it does pick up `JwtFilter`, because it is a servlet `Filter`, so its `JwtUtil` and `UserDetailsServiceImpl` have to be supplied as `@MockitoBean`s or the context does not start. With all that in place, the test worth writing is the role one: an EMPLOYEE calling `PATCH /api/entries/{id}/approve` must get a 403. Project 07 has no slice tests yet, and its pom does not have `spring-boot-starter-security-test` — in Boot 4 that is the dependency that brings both the security set-up into the slice and `@WithMockUser`; its testing plan leaves to a `@WebMvcTest` in my next project the one security rule no service test can reach — a deactivated user's still-valid token being refused on the next request.

Red flag answer: "I exclude the security auto-configuration in the tests so they pass." — Then the tests no longer prove any access rule, and an endpoint that lost its `@PreAuthorize` stays green.

---

<a id="SB-J-067"></a>

**[SB-J-067] What is `@DataJpaTest`, and would you run your repository tests on H2 or on PostgreSQL?** ⭐⭐

`@DataJpaTest` loads only the persistence layer — the entities, the Spring Data repositories and the `EntityManager` — and runs each test in a transaction that is rolled back at the end, so tests do not see each other's data. By default it swaps the datasource for an in-memory database such as H2 if one is on the classpath, which is fast but only proves the query on H2's dialect: a function, a reserved word or a constraint can behave differently on the PostgreSQL that runs in production. For a query that depends on the database I would point the test at the real engine with `@AutoConfigureTestDatabase(replace = Replace.NONE)` and start PostgreSQL in Docker with Testcontainers, so the test runs on the same database as production. In project 07 the obvious candidate is `getHoursByProject`, a JPQL aggregate with `round(SUM(...), 2)` and `GROUP BY` that fills an interface projection; but repository tests are not in this project's plan — it stays at the unit level, with the repositories mocked — and the slices come in my next project.

Red flag answer: "H2 is enough, it is SQL anyway." — Each database has its own dialect, functions and reserved words; a test that is green on H2 can hide a query that fails, or returns something else, on PostgreSQL.

---

<a id="SB-J-095"></a>

**[SB-J-095] This test always passes: it mocks the repository and asserts only what the mock returns — or asserts nothing. What is wrong with it?** ⭐⭐

It cannot fail, so it proves nothing: the assertion checks the value I stubbed a line earlier, not anything the service did with it, and a test with no assertion passes as long as no exception escapes. If I deleted the rule inside the service, it would stay green. A useful test asserts what the method itself produces — the status it set, the exception it threw, the total it computed — or, when the outcome is a call, verifies that call with the right arguments. Project 07's testing plan makes this a rule for Step 8, the tests I write next: every test asserts real behaviour — the returned value or the saved object's state — never only that a mock was called. And the only Spring test the project has today is of the weak kind: `contextLoads()` asserts nothing and fails only if the context cannot start, which is why Step 8 deletes it.

```java
// illustrative — not from a project
@Test
void findById_returnsProject() {
    when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
    assertThat(projectRepository.findById(1L)).contains(project);   // asserts the stub, not ProjectService
}
```

Red flag answer: "It is fine, the coverage report shows those lines as covered." — Coverage only says the lines ran; without an assertion on what they produced, a broken rule still leaves the report green.

---
## Tooling

<a id="SB-J-069"></a>

**[SB-J-069] How do you containerise a Spring Boot application, and how does someone run your project without installing PostgreSQL?** ⭐⭐⭐

I put the executable jar in an image with a two-stage `Dockerfile`: the first stage, on a JDK image, builds the jar with the Maven wrapper, and the second starts from a JRE-only image, copies just that jar and runs it with `java -jar` as a non-root user — so neither Maven nor the source code ships in the final image. The configuration stays outside the image: the database URL and credentials and the JWT secret arrive as environment variables, which is why the same image runs locally and as the hosted demo on Render. For the database, project 07's `docker-compose.yml` defines two services: `db`, from `postgres:17-alpine` with a volume and a healthcheck, and `api`, built from that Dockerfile, which starts only once the database is healthy and receives a `DB_URL` pointing at `db`, the `dev` profile and the secrets from a git-ignored `.env`. So `docker compose up --build` starts the whole backend, and Docker is the only thing anyone has to install.

```dockerfile
# projects/07-timetrack · backend/timetrack/Dockerfile
FROM eclipse-temurin:25-jdk AS build
# ... copies the wrapper, the pom and src
RUN ./mvnw -B package -DskipTests

FROM eclipse-temurin:25-jre
# ... creates the non-root spring user and switches to it
COPY --from=build /app/target/timetrack-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

> **Junior tip:** separate the two files out loud — the Dockerfile builds one image, compose runs several containers together — then say why no setting is baked into the image: the same image runs in every environment, and each environment hands it its own variables.

---

<a id="SB-J-096"></a>

**[SB-J-096] How do you build your Spring Boot application and run it outside the IDE? What is inside the jar that lets `java -jar` start a web server?** ⭐⭐

With Maven: `./mvnw clean package` — the wrapper committed in the repository, so nobody needs Maven installed — deletes `target/`, compiles, runs the tests and leaves the jar there, and `java -jar target/timetrack-0.0.1-SNAPSHOT.jar` then starts the API; project 07's Dockerfile runs that same `package`, and to run the API without Docker, the backend README uses `./mvnw spring-boot:run`, which starts it from the compiled classes without packaging. What makes the jar runnable is the Spring Boot Maven plugin: in the `package` phase it repackages the plain jar Maven produced into an executable one, with my classes, the jar of every runtime dependency — the embedded Tomcat the web starter brings among them — and Boot's own launcher, which the manifest names as the main class and which then calls the `main` of my `TimetrackApplication`. In project 07 the plugin carries no version, because `spring-boot-starter-parent` manages it just as it manages the dependencies, and its configuration leaves Lombok out of the jar, because Lombok only works at compile time.

```xml
<!-- projects/07-timetrack · pom.xml -->
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <excludes>
            <exclude>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
            </exclude>
        </excludes>
    </configuration>
</plugin>
```

> **Junior tip:** answer in two halves — the commands (`package`, then `java -jar`) and the reason they work (the plugin repackages a jar that carries its own server). The usual follow-up is "and without the plugin?": a plain jar has neither the dependencies nor a main class, so `java -jar` refuses it with "no main manifest attribute".

---

<a id="SB-J-097"></a>

**[SB-J-097] How would you change the port your Spring Boot API listens on? And if the same property is set both in `application.properties` and in an environment variable, which value wins?** ⭐⭐

With `server.port=8081` in `application.properties` — or `server:` with `port: 8081` nested under it in `application.yml`, the same keys written in YAML — and, without touching the file, with the environment variable `SERVER_PORT` or the argument `--server.port=8081` after `java -jar`. Boot reads all of those sources and the more specific one wins: a command-line argument beats an environment variable, which beats a profile file such as `application-dev.properties`, which beats `application.properties` — so the file holds the defaults and each environment overrides only what differs. Project 07 never sets the port, so Tomcat listens on its default 8080; on Render I set the platform's own `PORT` variable to 8080 to tell the host where to route, rather than make the code read it. The override I do rely on is CORS: the file says `app.cors.allowed-origins=http://localhost:4200`, and on Render `APP_CORS_ALLOWEDORIGINS` replaces it with the allowed origins, the hosted frontend's included — the property's name uppercased, the dots turned into underscores and the dash dropped — with no change to the backend.

> **Junior tip:** give the property first, then the order — command line, environment variable, profile file, `application.properties` — and one real override. Saying that the environment variable wins over the committed file is what shows you understand how one jar runs in every environment.

---

<a id="SB-J-070"></a>

**[SB-J-070] Why would a team use Flyway instead of `spring.jpa.hibernate.ddl-auto=update`?** ⭐⭐

Because `update` changes the schema of whatever database the application starts against, from the entities and with no file anyone reviews, and it only adds: it never drops, renames or retypes a column, nor alters one that already exists, so those changes end up as SQL someone runs by hand. Flyway turns every change into a versioned SQL script in `src/main/resources/db/migration` — `V1__init.sql`, `V2__add_status.sql` — that is reviewed in the PR and applied in order at startup, and its `flyway_schema_history` table records which scripts each database already has, so every environment ends up with the same schema; Hibernate is then set to `validate`. Project 07 runs on `update`, and I hit exactly those limits: the `UNIQUE` I added to `email` after the column existed never reached the table, so I ran the `ALTER TABLE` by hand in pgAdmin, and a new not-null `active` column failed on a table that already had rows until I gave it a default with `@ColumnDefault`. I have used Flyway before, in my internship, on a MySQL schema running in Docker — not with Spring Boot — and wrote the team's maintenance notes for it, `flyway repair` after a failed migration included.

Red flag answer: "`ddl-auto=update` is fine in production — Hibernate keeps the schema in sync." — It does not: it never drops, renames or retypes a column, so the database drifts away from the entities without any error, and every change reaches production data without anyone having reviewed it.

---

<a id="SB-J-098"></a>

**[SB-J-098] How do you read your own properties into your code: with `@Value` or with `@ConfigurationProperties`, and why?** ⭐⭐

`@Value("${...}")` injects one value, and it is what project 07 uses: `JwtUtil` receives `app.jwt.secret` and `app.jwt.expiration` through its constructor, and `SecurityConfig` receives `app.cors.allowed-origins` as a `List<String>`, which Boot splits on the commas for me. `@ConfigurationProperties(prefix = "app.jwt")` binds a whole group to one typed class or record instead: the settings travel together, they can be validated with constraints so an empty or invalid value stops startup with a message naming the property, and a test can build the object directly. I use `@Value` for an isolated value and `@ConfigurationProperties` once several settings belong to one feature — `app.jwt.*` and the `app.admin.*` that seed the dev manager are the two groups in project 07 I would move to it as they grow. Either way the value comes from Spring's configuration, so profiles, environment variables and command-line arguments can override it.

```java
// projects/07-timetrack · JwtUtil.java
public JwtUtil(@Value("${app.jwt.secret}") String secret,
               @Value("${app.jwt.expiration}") long expiration) {

// illustrative — not from a project (registered with @ConfigurationPropertiesScan)
@Validated
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(@NotBlank String secret, @Positive long expiration) {}
```

Red flag answer: "I read it with `System.getenv("JWT_SECRET")` wherever I need it." — That bypasses Spring's configuration: no default in a properties file, no profile, no command-line override, and the class can only be tested by setting real environment variables; injecting the value keeps one source of truth.

---

<a id="SB-J-099"></a>

**[SB-J-099] How do you log in a Spring Boot application, and how would you turn on DEBUG logs for one package without changing the code?** ⭐⭐

Through SLF4J, the logging facade, with Logback underneath — the implementation every Spring Boot starter brings by default — so the code depends only on the facade. In project 07 `GlobalExceptionHandler` gets its logger from `LoggerFactory.getLogger` — Lombok's `@Slf4j` generates that same field — and its fallback handler calls `log.error("Unhandled exception", e)`, passing the exception as the last argument so the stack trace reaches the log. The root level defaults to INFO, and each package's level is configuration: `logging.level.org.springframework.security=DEBUG` in a profile's properties file, or `LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_SECURITY=DEBUG` as an environment variable on the container, which needs only a restart, not a new build. That is also why `spring.jpa.show-sql=true` in my `dev` profile is the crude option: it prints the SQL straight to standard output, past the logging system, while `logging.level.org.hibernate.SQL=DEBUG` sends the same statements through the logger, with a timestamp and a level.

```java
// projects/07-timetrack · GlobalExceptionHandler.java
private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
// ...
log.error("Unhandled exception", e);
```

```properties
# illustrative — not from a project
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

> **Junior tip:** "SLF4J is the API I call, Logback is what writes" — then the payoff: the level is configuration, so you can raise one package to DEBUG on a running environment without a new build. If they ask why not `System.out.println`, keep it short: no levels, no timestamps, and no way to switch it off.

---

<a id="SB-J-100"></a>

**[SB-J-100] How do you document your REST API so the frontend team can use it? Have you used Swagger/OpenAPI with springdoc?** ⭐⭐

Not in a project yet: in project 07 I documented it by hand, with one table per resource in the backend README giving the method, the URL, the role and what each endpoint does. That works for one developer, but a hand-written table drifts the first time someone changes an endpoint and forgets the document. On a team I would generate the contract from the code with springdoc: one dependency, `springdoc-openapi-starter-webmvc-ui`, reads the controllers, their mappings and the DTOs — Bean Validation constraints such as `@NotBlank` included — and publishes the OpenAPI JSON at `/v3/api-docs` and Swagger UI at `/swagger-ui.html`, where the frontend or QA can read every endpoint and try it. With Spring Security, as in project 07, the documentation paths, `/v3/api-docs/**` and `/swagger-ui/**`, have to be permitted in the chain, and the UI needs a bearer-token scheme declared before its Authorize button can send the JWT.

> **Junior tip:** separate the contract from the page — OpenAPI is the JSON description of the API, Swagger UI is the page that renders it and lets you call it — and say that springdoc builds the contract from the code you already wrote, so it cannot drift from it.

---

<a id="SB-J-101"></a>

**[SB-J-101] A snippet from an old tutorial — or from an AI assistant — imports `javax.persistence.Entity`, and it does not compile in your project. Why, and what else changed from Spring Boot 2 to 3?** ⭐⭐

Because Spring Boot 3 moved to Jakarta EE, whose APIs were renamed from `javax.*` to `jakarta.*` when Java EE moved to the Eclipse Foundation, which could not keep the `javax` name: persistence, validation and servlets now live in `jakarta.persistence`, `jakarta.validation` and `jakarta.servlet`, so the old class is simply not on the classpath. The fix is the import, not the pom: in project 07, on Boot 4, the entities import `jakarta.persistence.*`, the DTOs `jakarta.validation.constraints.*` and `JwtFilter` `jakarta.servlet.*` — while `JwtUtil` still imports `javax.crypto.SecretKey`, because that one is part of the JDK and never moved. Adding the old `javax.validation` jar to make it compile is the dangerous fix: the annotations compile, but the validator reads only the `jakarta` ones, so the constraints are silently ignored. The other changes I would look for in a Boot 2 codebase are Java 17 as the minimum version and Spring Security 6, where `WebSecurityConfigurerAdapter` is gone and the configuration is a `SecurityFilterChain` bean with `requestMatchers` instead of `antMatchers`.

```java
// projects/07-timetrack · User.java and JwtUtil.java
import jakarta.persistence.*;    // moved: Jakarta EE
import javax.crypto.SecretKey;   // unchanged: part of the JDK
```

Red flag answer: "I add the `javax` dependency back to the pom so it compiles." — The namespace changed, not the jar's availability: the old annotations compile but nothing reads them — a `javax` `@Entity` is not mapped at all and the `javax` constraints are skipped without an error; the fix is to migrate the imports.

---

<a id="SB-J-102"></a>

**[SB-J-102] What is Spring Boot Actuator, and which of its endpoints would you expose in production?** ⭐

Actuator is the starter that adds operational endpoints under `/actuator`: `health` answers `{"status":"UP"}` — or a 503 when a check such as the database fails — and is what a load balancer, a Kubernetes probe or a Docker healthcheck calls to know whether the instance can take traffic; `info` gives information about the application; and `metrics`, through Micrometer, exposes measurements such as request times and JVM memory, which the Prometheus registry can publish for monitoring. Over HTTP only `health` is exposed by default, and I would keep it that way, adding `info` or `metrics` explicitly with `management.endpoints.web.exposure.include` — never `*`: `heapdump` hands over the process's memory, secrets such as the JWT key included, and `env` and `beans` map the application's internals. Project 07 does not have Actuator: I verified the hosted API by calling `GET /api/projects` without a token and expecting the 401, which a real `/actuator/health` would replace — and with its `anyRequest().authenticated()` catch-all, that one path would have to be permitted explicitly.

Red flag answer: "I set `management.endpoints.web.exposure.include=*` so everything is available." — It publishes heap dumps, the environment and the bean graph to anyone who can reach the API; expose only what monitoring needs, and keep the rest off or behind authentication.
