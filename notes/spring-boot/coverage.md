# Minimum Coverage — Spring Boot

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real code example from the TimeTrack project.

## Project setup
- `@SpringBootApplication` — combines three annotations and enables auto-configuration; interviewers ask "what does this annotation replace in a traditional Spring app?"
- `application.properties` — where datasource, JPA settings, and secrets go; interviewers ask how you keep credentials out of source control (environment variables)
- Profiles: `application-dev.properties`, `spring.profiles.active` — separating config per environment; asked in any interview about real-world deployment
- Maven: `pom.xml` structure, adding a dependency, `mvn clean install` — how the project is built and how new libraries are pulled in
- Lombok: `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@RequiredArgsConstructor` — what each generates and why it removes boilerplate
- `@Slf4j` (Lombok) — generates a `log` field on the class; `log.info()`, `log.warn()`, `log.error()` — the standard way to add logging in Spring Boot; seen in every production codebase and code review
- `data.sql` — Spring Boot runs this file on startup to seed the database; used in TimeTrack to create the first manager account; interviewers ask "how did you create the first user if there is no register endpoint?"

## REST controllers
- `@RestController`, `@RequestMapping` — marks the class as an HTTP handler; combines `@Controller` and `@ResponseBody` so every method returns JSON
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping` — method-level annotations for each HTTP verb; `@PatchMapping` is used for state transitions like submit/approve/reject
- `@PathVariable`, `@RequestParam`, `@RequestBody` — reading data from the URL path, query string, or JSON body respectively
- `ResponseEntity<T>` — the correct way to control the HTTP status code; interviewers ask "why not just return the object directly?"
- HTTP status conventions: 200 GET, 201 POST, 204 DELETE, 400 validation error, 401 missing or invalid token, 403 forbidden (authenticated but not allowed), 404 not found — tested in every technical interview
- Request DTO vs Response DTO — why you never expose the entity directly from the API (coupling, security, over-fetching); interviewers always ask this
- `toResponse()` mapping pattern — entity-to-DTO conversion in one place in the service layer; keeps the controller free of mapping logic
- `@JsonIgnore` — prevents a field from appearing in the JSON response; used on the `password` field so the API never returns hashed passwords; interviewers ask "why doesn't your API expose the password?"

## Dependency injection
- `@Service`, `@Repository`, `@Component`, `@Controller` — what each tells Spring and which layer each belongs to
- Constructor injection vs `@Autowired` — why constructor injection is preferred: dependencies are explicit, immutable, and the class can be unit-tested without a Spring context
- `@Value("${property.name}")` — injecting a single config value from `application.properties` at startup
- `@ConfigurationProperties` — binding a group of related properties to a class; cleaner than many individual `@Value` annotations for grouped config

## Spring Data JPA
- `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column` — the minimum annotations to map a Java class to a PostgreSQL table
- `@ManyToOne`, `@OneToMany`, `@ManyToMany`, `@JoinColumn` — the most common JPA relationships; `@ManyToOne` and `@OneToMany` are used on TimeEntry to link to User and Project
- `@Enumerated(EnumType.STRING)` — stores the enum name (`DRAFT`, `SUBMITTED`) instead of its position number; interviewers ask why `STRING` is safer than the default
- `@CreationTimestamp`, `@UpdateTimestamp` — Hibernate sets these fields automatically; interviewers ask why you do not set them manually in the service
- `JpaRepository`: `findAll`, `findById`, `save`, `deleteById` — built-in CRUD without writing SQL; interviewers ask "what does JpaRepository give you for free?"
- Custom repository methods: `findByEmail(String email)` — Spring reads the method name and generates the SQL; no `@Query` needed for simple lookups
- `@Query` with JPQL — writing custom queries for aggregations and complex filtering; needed for the reports endpoint
- Pagination: `Pageable`, `Page<T>`, `PageRequest.of(page, size)` — the standard way to return lists in production; never return an unbounded list
- N+1 problem — what it is, how JPA causes it silently when you access a lazy relationship in a loop, and how `JOIN FETCH` or `@EntityGraph` fixes it; one of the most common JPA interview questions
- `FetchType.LAZY` vs `FetchType.EAGER` — LAZY is the default and correct for most cases; EAGER loads related data on every query and causes performance problems

## Exception handling
- `@RestControllerAdvice` — one class that catches exceptions from all controllers and returns clean JSON error responses
- `@ExceptionHandler(SomeException.class)` — handles one specific exception type and maps it to the right HTTP status code
- Custom exception classes — how to create `ResourceNotFoundException extends RuntimeException` and throw it; it propagates automatically to `@RestControllerAdvice`
- `MethodArgumentNotValidException` — what Spring throws when `@Valid` fails; caught in `@RestControllerAdvice` to return a consistent 400 body
- Error response format — returning `{ "message": "...", "status": 404 }` consistently so clients always know the structure of an error
- Soft delete — `active = false` instead of `deleteById`; why production apps rarely delete permanently (orphan data, audit trail, data recovery)

## Spring Security + JWT
- `@Configuration` + `@EnableWebSecurity` + `@EnableMethodSecurity` — the three annotations that activate Spring Security and enable method-level role checks
- `SecurityFilterChain` — the single bean that configures CSRF (disabled for JWT), session policy (STATELESS), route permissions, and custom filters
- `UserDetailsService` — the interface you implement to tell Spring how to load your users from the database; `loadUserByUsername()` is the only method
- `BCryptPasswordEncoder` — one-way password hashing with a random salt; interviewers ask "why hash and not encrypt?"
- `AuthenticationManager` — Spring's login coordinator; you expose it as a `@Bean` so `AuthService` can call `authenticate()` on login
- `OncePerRequestFilter` — the base class for `JwtFilter`; reads the `Authorization` header, validates the token, and sets the user in `SecurityContextHolder`
- `SecurityContextHolder` — thread-local storage where `JwtFilter` stores the authenticated user for the current request; services read it to know who is logged in without trusting client-supplied IDs
- `UsernamePasswordAuthenticationToken` (2 params vs 3 params) — 2 params is unverified credentials passed to `authenticate()`; 3 params is a confirmed authentication stored in `SecurityContextHolder`; the difference matters for understanding the filter
- `.requestMatchers("/api/auth/**").permitAll()` and `.anyRequest().authenticated()` — making specific routes public and protecting everything else
- `@PreAuthorize("hasRole('MANAGER')")` — method-level role check that runs after the JWT is validated and the user is in the context
- CORS configuration inside `SecurityFilterChain` — required when Angular (port 4200) calls Spring Boot (port 8080); the browser blocks cross-origin requests without it

## Bean validation
- `@Valid` on `@RequestBody` — activates validation on the incoming DTO at the controller boundary; without it all the annotations on the DTO are ignored
- `spring-boot-starter-validation` — the required dependency; without it `@NotBlank` etc. compile fine but do nothing at runtime
- `@NotBlank` vs `@NotNull` — `@NotBlank` rejects null, empty, and whitespace-only strings; `@NotNull` only rejects null; interviewers ask the difference
- `@Positive`, `@Size`, `@Email`, `@Min`, `@Max` — common validators for numbers, string length, and email format

## Transactions
- `@Transactional` — ensures multiple DB operations either all succeed or all roll back; the standard annotation for any write service method
- `@Transactional(readOnly = true)` — performance hint for read-only methods; Spring and Hibernate skip dirty checking
- Private method gotcha — `@Transactional` on a `private` method is silently ignored because Spring cannot create a proxy; must be on a `public` method
- `LazyInitializationException` — thrown when you access a lazy-loaded relationship outside a transaction; adding `@Transactional` to the service method fixes it
- Where `@Transactional` belongs — on the service layer, not the repository (already transactional) or the controller

## Testing
- JUnit 5: `@Test`, `@BeforeEach`, `assertEquals`, `assertThrows`, `assertThat` — the minimum to write a service unit test
- Mockito: `@Mock`, `@InjectMocks`, `when().thenReturn()`, `doThrow()`, `verify()` — mocking dependencies so you test one layer in isolation
- `@ExtendWith(MockitoExtension.class)` — activates Mockito in a plain JUnit test without loading the Spring context
- `@WebMvcTest` — loads only the controller layer and mocks the service; tests HTTP request/response without a real database
- `@SpringBootTest` — full integration test; loads the whole context; slow but catches wiring issues
- `@DataJpaTest` — tests only the repository layer against an in-memory H2 database; does not load the full context; used to test custom JPA queries
- Layered testing strategy — unit tests for services (fast, isolated), `@WebMvcTest` for controllers; consultancies ask "how do you test your backend?"

## Tooling
- Docker: `Dockerfile` for a Spring Boot app — `FROM eclipse-temurin`, `COPY`, `ENTRYPOINT`; how to containerise the app
- `docker-compose.yml` — running Spring Boot + PostgreSQL together with one command; interviewers ask "how do you run this project locally?"
- Flyway — database migrations as versioned SQL scripts (`V1__init.sql`); why teams use it instead of `ddl-auto=update` (predictable, reviewable, safe in production)
