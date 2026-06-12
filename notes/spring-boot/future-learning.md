# Spring Boot — Future Learning Roadmap

Topics to study once the numbered files (01–09) are solid. Nothing here is needed for the first interview — needed to grow into a mid-level developer and work on more complex backend systems.

---

## What the numbered files cover (junior goal — all done ✓)

- 01 — Project setup: `@SpringBootApplication`, `application.properties`, Maven structure, Lombok
- 02 — REST controllers: `@RestController`, HTTP methods, `ResponseEntity`, DTOs, layered architecture
- 03 — Dependency injection: `@Service`, `@Repository`, `@Component`, constructor injection, `@Value`
- 04 — Spring Data JPA: `@Entity`, `JpaRepository`, derived queries, `@Query`, relationships, N+1, Pageable
- 05 — Exception handling: `@ControllerAdvice`, `@ExceptionHandler`, custom exceptions, error response DTO
- 06 — Spring Security + JWT: `SecurityFilterChain`, `UserDetailsService`, `OncePerRequestFilter`, BCrypt, CORS
- 07 — Bean Validation: `@Valid`, `@NotBlank`, `@Positive`, `@Size`, `@Validated` on path variables
- 08 — Transactions: `@Transactional`, `readOnly = true`, private method gotcha, `LazyInitializationException`, propagation
- 09 — Testing: JUnit 5, Mockito, `@WebMvcTest`, `@SpringBootTest`, `@DataJpaTest`, layered testing strategy

---

## Phase 1 — After landing the first job

### Spring Boot Actuator

Health checks, metrics, and management endpoints that ops teams use to monitor the app in production. Automatically exposes `/actuator/health`, `/actuator/info`, and more. Essential in any production-deployed Spring Boot app.

### Spring Boot Caching

```java
@Cacheable("employees")
public List<Employee> findAll() { ... }

@CacheEvict(value = "employees", allEntries = true)
public void save(Employee e) { ... }
```

Used to avoid hitting the database repeatedly for data that does not change often.

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
