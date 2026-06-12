# Minimum Coverage — Spring Boot

Every item below must be covered by at least one note file.
Files 01–09 are the complete junior goal. Each section below maps to one of those files.

## 01 — Project setup
- [ ] `@SpringBootApplication` — what it does, what Boot auto-configures under the hood
- [ ] `application.properties` / `application.yml` — configuring datasource, JPA, custom properties
- [ ] Profiles: `application-dev.properties`, `spring.profiles.active` — different config per environment
- [ ] Maven: `pom.xml` structure, adding a dependency, `mvn clean install`
- [ ] Lombok: `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@RequiredArgsConstructor`

## 02 — REST controllers
- [ ] `@RestController`, `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`
- [ ] `@PathVariable`, `@RequestParam`, `@RequestBody`
- [ ] `ResponseEntity<T>` — returning the right HTTP status code
- [ ] Why 200 for GET, 201 for POST, 204 for DELETE, 404 for not found, 409 for conflict
- [ ] DTOs: request DTO vs response DTO — why you never expose the entity directly
- [ ] `toResponse()` mapping pattern — converting entity to DTO in the service layer

## 03 — Dependency injection
- [ ] `@Service`, `@Repository`, `@Component`, `@Controller` — what each annotation tells Spring
- [ ] Constructor injection vs `@Autowired` — why constructor injection is preferred and easier to test
- [ ] `@Value("${property.name}")` — injecting config values from `application.properties`
- [ ] `@ConfigurationProperties` — binding a group of properties to a class

## 04 — Spring Data JPA
- [ ] `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column` — mapping a class to a database table
- [ ] Relationships: `@ManyToOne`, `@OneToMany`, `@ManyToMany`, `@JoinColumn` — when each is used
- [ ] `JpaRepository`: `findAll`, `findById`, `save`, `deleteById` — built-in CRUD
- [ ] Custom queries: derived method names (`findByEmail`) and `@Query` with JPQL
- [ ] Pagination: `Pageable`, `Page<T>`, `PageRequest.of(page, size)` — returning paginated results
- [ ] **N+1 problem** — what it is, how JPA causes it, how to fix it (`JOIN FETCH`, `@EntityGraph`)
- [ ] Lazy vs Eager fetching — `FetchType.LAZY` vs `FetchType.EAGER`, why LAZY is the default

## 05 — Exception handling
- [ ] `@RestControllerAdvice` — global exception handler for all controllers
- [ ] `@ExceptionHandler(SomeException.class)` — catches one specific exception type
- [ ] Custom exception classes — how to create and throw them with the right HTTP status
- [ ] Error response DTO — returning a consistent JSON body on errors (`{ "message": "...", "status": 404 }`)
- [ ] Soft delete pattern — `active = false` instead of `deleteById`, why production apps avoid hard delete

## 06 — Spring Security + JWT
- [ ] `@Configuration` + `@EnableWebSecurity` + `@EnableMethodSecurity`
- [ ] `SecurityFilterChain` — configuring CSRF, sessions (STATELESS), route permissions, filters
- [ ] `UserDetailsService` — where Spring loads the user from your database
- [ ] `OncePerRequestFilter` — base class for `JwtFilter`; reads the token, validates it, sets context
- [ ] `SecurityContextHolder` — thread-local storage where the current authenticated user lives
- [ ] `BCryptPasswordEncoder` — one-way password hashing; why you never store plaintext
- [ ] `AuthenticationManager` — Spring's login coordinator; delegates to `DaoAuthenticationProvider`
- [ ] `.permitAll()` vs `.authenticated()` — making routes public or protected
- [ ] `@PreAuthorize("hasRole('ADMIN')")` — method-level role check after JWT is validated
- [ ] CORS configuration inside `SecurityFilterChain`

## 07 — Bean Validation
- [ ] `@Valid` on `@RequestBody` — trigger validation on the incoming DTO
- [ ] `@NotBlank`, `@NotNull`, `@Positive`, `@Size`, `@Email`, `@Min`, `@Max`
- [ ] `spring-boot-starter-validation` dependency — required for annotations to work
- [ ] `@Validated` — used on path variables and query params when `@Valid` is not enough

## 08 — Transactions
- [ ] `@Transactional` — ensures multiple DB operations either all succeed or all roll back
- [ ] `@Transactional(readOnly = true)` — performance optimization for read-only service methods
- [ ] Private method gotcha — `@Transactional` on a private method is silently ignored
- [ ] `LazyInitializationException` — what causes it and how `@Transactional` fixes it
- [ ] When to put `@Transactional` — on the service, not the repository or controller

## 09 — Testing
- [ ] JUnit 5: `@Test`, `@BeforeEach`, `@AfterEach`, assertions (`assertEquals`, `assertThrows`, `assertThat`)
- [ ] Mockito: `@Mock`, `@InjectMocks`, `when().thenReturn()`, `doThrow()`, `verify()`
- [ ] `@ExtendWith(MockitoExtension.class)` — activating Mockito in a plain JUnit test
- [ ] `@WebMvcTest` — testing only the controller layer, mocking the service
- [ ] `@SpringBootTest` — full integration test, loads the whole context
- [ ] `@DataJpaTest` — testing the repository layer against an in-memory H2 database
- [ ] Layered testing strategy — unit test the service, integration test the controller

## Tooling and deployment
- [ ] Docker: `Dockerfile` for a Spring Boot app (`FROM eclipse-temurin`, `COPY`, `ENTRYPOINT`)
- [ ] `docker-compose.yml` — running Spring Boot + PostgreSQL together with one command
- [ ] Flyway — database migrations as versioned SQL scripts (`V1__init.sql`, `V2__add_column.sql`); why teams use it instead of `ddl-auto=update`
