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

### Events inside the app — `ApplicationEventPublisher`

The clean way to decouple a side effect (send an e-mail, write an audit row) from the business method that triggers it, and `@TransactionalEventListener` to run that side effect only *after* the transaction commits. Genuinely useful, but a junior is not filtered out for not knowing it.

### HTTP caching and rate limiting

`ETag` / `If-None-Match` / `Cache-Control` so a client can skip re-downloading unchanged data, and rate limiting (Bucket4j or at the gateway) so one client cannot hammer the API. Real REST design, but never asked of a junior in Spain.

### Background work — `@Async` and `@Scheduled`

`@Async` + `@EnableAsync` moves a slow side effect (an e-mail, a report) off the HTTP thread; `@Scheduled` + `@EnableScheduling` runs cron jobs. Both are proxy-based, so a self-invoked call silently runs synchronously — the same trap as `@Transactional`. Left out of coverage because TimeTrack has neither, no target posting asks for them, and they are not a junior filter; the moment a job needs a nightly task, start here (and with the two-instances problem: both replicas fire unless you add a distributed lock).

### File upload and downloads

`MultipartFile` with `consumes = MULTIPART_FORM_DATA_VALUE`, `spring.servlet.multipart.max-file-size`, never trusting the client-supplied filename (path traversal), and whether to store the bytes in a `BYTEA` column or the file in object storage with the path in the DB. Real and common on the job, but TimeTrack uploads nothing and no target posting asks for it.

### Operating a service in production

Diagnosing HikariCP connection-pool exhaustion (`Connection is not available, request timed out` — a long transaction, an HTTP call inside `@Transactional`, or a slow query under load; raising `maximum-pool-size` hides the leak), and correlation ids via MDC so one user's failed request maps to real log lines. Coverage keeps the failures a take-home actually hits (startup errors, a slow endpoint, an unbounded `findAll()`); these two belong to someone who already operates a service.

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

- **Testcontainers** — real PostgreSQL container for integration tests. Coverage already requires knowing *why* H2 is not PostgreSQL and that Testcontainers is the answer; actually wiring it up is the mid-level step.
- **WireMock** — mock external HTTP services in tests
- **ArchUnit** — verify layer boundaries in code (controller cannot call repository directly, etc.)

### JVM forensics and performance tuning

Thread dumps and heap dumps (`jstack`, `jmap`, Eclipse MAT) when an app hangs or runs out of memory; GC flags and heap sizing; `EXPLAIN ANALYZE` and index tuning driven by the query plan. Coverage requires *naming the symptom* (pool exhaustion, `OutOfMemoryError`, an unindexed column); analysing a dump or a query plan is the growth step beyond it.

### Hibernate performance internals

Second-level cache, `@BatchSize`, `hibernate.jdbc.batch_size`, and fetch-strategy tuning beyond `JOIN FETCH` / `@EntityGraph`.

### Resilience and distributed concerns

Circuit breakers and retries (Resilience4j), distributed scheduling locks (ShedLock — coverage only asks that you *see* the two-instances problem), distributed tracing and correlation across services, Kubernetes probes, load testing (JMeter, Gatling).

### Spring Boot internals

Auto-configuration, `@Conditional` annotations, writing custom starters. Relevant when you need to understand why Spring Boot does something automatically or when you need to override it.

---

## What NOT to study prematurely

- **EJBs** — old Java EE dependency injection, before Spring. Never write it.
- **JSP / Servlets** — old Java web pages. Replaced by Spring Boot REST + Angular.
- **Spring MVC XML configuration** — the old way before annotations. You will see it in legacy code but never write it.
- **Spring Batch** — framework for batch processing jobs. Only relevant in specific data pipeline projects.
