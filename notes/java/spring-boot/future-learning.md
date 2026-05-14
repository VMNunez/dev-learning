# Spring Boot — Future Learning Roadmap

Topics to study once the numbered files (01–onwards) are solid. Nothing here is needed for the first interview — needed to grow into a mid-level developer and work on more complex backend systems.

---

## What the numbered files will cover (junior goal)

These are the topics that will become numbered files as Victor studies Spring Boot:

- Project setup — `@SpringBootApplication`, `application.properties`, Maven structure
- REST API — `@RestController`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`
- Dependency injection — `@Service`, `@Repository`, `@Component`, constructor injection
- JPA / Hibernate — `@Entity`, `@Id`, `@GeneratedValue`, `@OneToMany`, `@ManyToOne`, `JpaRepository`
- Request handling — `@RequestBody`, `@PathVariable`, `@RequestParam`, `ResponseEntity`
- Exception handling — `@ControllerAdvice`, `@ExceptionHandler`, custom error responses
- Spring Security + JWT — `SecurityFilterChain`, `UserDetailsService`, token validation
- Testing — `JUnit 5`, `Mockito`, `@SpringBootTest`, `@WebMvcTest`

---

## Phase 1 — After landing the first job

### Spring Boot Actuator

Health checks, metrics, and management endpoints that ops teams use to monitor the app in production. Automatically exposes `/actuator/health`, `/actuator/info`, and more. Essential in any production-deployed Spring Boot app.

### Application profiles

Different configuration per environment:

```properties
# application-dev.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/dev_db

# application-prod.properties
spring.datasource.url=${DATABASE_URL}
```

Switch with `spring.profiles.active=dev`. Every consultancy project uses this pattern.

### Spring Boot Caching

```java
@Cacheable("employees")
public List<Employee> findAll() { ... }

@CacheEvict(value = "employees", allEntries = true)
public void save(Employee e) { ... }
```

Used to avoid hitting the database repeatedly for data that does not change often.

### JPA advanced

- **JPQL and `@Query`** — custom queries beyond what `JpaRepository` generates automatically
- **`FetchType.LAZY` vs `EAGER`** — control when related entities are loaded from the database
- **N+1 problem** — what it is and how `JOIN FETCH` or `@EntityGraph` solves it
- **Pagination** — `Pageable` and `Page<T>` for returning paginated results to the frontend

---

## Phase 2 — After 6–12 months

### Reactive programming — Spring WebFlux

Non-blocking API built on Project Reactor. Returns `Mono<T>` and `Flux<T>` instead of plain objects. Useful for high-throughput services. Requires a different mental model — study after the standard MVC stack is solid.

### Microservices with Spring Cloud

- **Eureka** — service discovery
- **Spring Cloud Gateway** — API gateway
- **OpenFeign** — declarative HTTP client for calling other services
- **Config Server** — centralised configuration for multiple services

### Message queues

- **Kafka** — high-throughput event streaming; `@KafkaListener`
- **RabbitMQ** — traditional message broker; `@RabbitListener`

---

## Phase 3 — Mid-level

### Advanced testing

- **Testcontainers** — real PostgreSQL container for integration tests
- **WireMock** — mock external HTTP services in tests
- **ArchUnit** — verify layer boundaries in code (controller cannot call repository directly, etc.)

### Spring Boot internals

Auto-configuration, `@Conditional` annotations, writing custom starters. Relevant when you need to understand why Spring Boot does something automatically or when you need to override it.

---

## What NOT to study prematurely

- **EJBs** — old Java EE dependency injection, before Spring. Never write it.
- **JSP / Servlets** — old Java web pages. Replaced by Spring Boot REST + Angular.
- **Spring MVC XML configuration** — the old way before annotations. You will see it in legacy code but never write it.
- **Spring Batch** — framework for batch processing jobs. Only relevant in specific data pipeline projects.
