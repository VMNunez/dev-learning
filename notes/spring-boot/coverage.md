# Minimum Coverage — Spring Boot

Every item below must be covered by at least one note file.
An item is covered when a junior can answer an interview question about it using only the notes.

## Core
- [ ] `@SpringBootApplication` — what it does, what Boot auto-configures, why it exists
- [ ] `application.properties` / `application.yml` — configuring the app
- [ ] Profiles: `spring.profiles.active`, `@Profile` — dev vs prod config
- [ ] Constructor injection vs `@Autowired` — why constructor is preferred
- [ ] `@Value` and `@ConfigurationProperties` — reading config values in code

## REST layer
- [ ] `@RestController`, `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`
- [ ] `@PathVariable`, `@RequestParam`, `@RequestBody`
- [ ] `ResponseEntity` — returning the right HTTP status code (200, 201, 204, 404, 409)
- [ ] Why 201 for POST, 204 for DELETE, 404 for not found, 409 for conflict

## Validation and error handling
- [ ] Bean Validation: `@Valid`, `@NotBlank`, `@NotNull`, `@Size`, `@Min`, `@Email`
- [ ] `@ControllerAdvice` and `@ExceptionHandler` — global error handling
- [ ] Custom exceptions: creating and throwing them with the right HTTP status

## Data layer — JPA
- [ ] `@Entity`, `@Id`, `@GeneratedValue`, `@Column` — entity basics
- [ ] Relationships: `@ManyToOne`, `@OneToMany`, `@ManyToMany`, `@JoinColumn`
- [ ] `JpaRepository`: `findAll`, `findById`, `save`, `deleteById`
- [ ] Custom queries: `@Query` (JPQL), derived method names
- [ ] Pagination: `Pageable`, `Page<T>`, `PageRequest` — how to use and return in response
- [ ] Soft delete pattern: `active` flag, why not `deleteById` in production

## DTOs
- [ ] Why DTOs exist — separating API contract from database structure
- [ ] Request DTO vs Response DTO — different shapes for input and output
- [ ] Mapping entity → DTO in the service layer (not in the controller)

## Security
- [ ] `SecurityFilterChain` — how Spring Security is configured
- [ ] JWT filter: how it intercepts requests, validates the token, sets authentication
- [ ] `@PreAuthorize`, `hasRole` — role-based endpoint protection

## Testing
- [ ] JUnit 5: `@Test`, `@BeforeEach`, assertions (`assertEquals`, `assertThrows`)
- [ ] Mockito: `@Mock`, `@InjectMocks`, `when().thenReturn()`, `verify()`
- [ ] `@SpringBootTest` vs `@WebMvcTest` — when to use each
- [ ] Testing a service method with a mocked repository

## Tooling
- [ ] Lombok: `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@RequiredArgsConstructor`
- [ ] Maven: `pom.xml` structure, adding a dependency, `mvn clean install`
- [ ] Docker: `Dockerfile` for a Spring Boot app, `docker-compose.yml` with a database service
