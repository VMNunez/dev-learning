# Middle Coverage — Spring Boot

Concepts expected from a Spring Boot developer who owns production behaviour beyond straightforward CRUD services.

## Production boundaries and diagnostics

- Custom Spring Data entity newness — use version/id inspection or `Persistable.isNew()` deliberately when assigned identifiers or unusual lifecycle rules make the default decision incorrect
- Identifier generation performance — evaluate sequence allocation and identity batching trade-offs only when measured persistence throughput or database portability makes them relevant
- Multiple security chains — order matcher-specific `SecurityFilterChain` beans when one application exposes genuinely different security boundaries
- Filter dispatch control — decide whether a `OncePerRequestFilter` participates in async or error dispatches and test those paths explicitly
- MVC method-validation models — align exception handling with built-in method validation or the older AOP-based `@Validated` path when maintaining mixed framework generations
- Spring Boot Actuator — expose and secure health, metrics, and diagnostic endpoints for operations
- Scheduled task execution — enable scheduling deliberately and size the scheduler pool, because the single-threaded default lets one slow fixed-rate or cron task delay every other scheduled method
- Application caching — place `@Cacheable`, eviction, and cache keys around stable reads without serving stale business state
- OpenAPI contract maintenance — keep generated documentation aligned with validation, error responses, and consumer-visible DTOs

## Distributed application foundations

- Microservice boundaries — split by business capability only when independent ownership and deployment justify distributed complexity
- Spring Cloud configuration and discovery awareness — recognise the infrastructure patterns commonly surrounding Spring microservices
- Message-driven processing — design idempotent consumers, retries, and dead-letter handling for queues or event brokers
- Resilience patterns — apply timeouts, circuit breakers, and bounded retries to remote calls without multiplying failure traffic

## Testing depth

- Testcontainers — run integration tests against disposable real infrastructure instead of relying only on in-memory substitutes
- Contract and integration testing — verify database, HTTP, and messaging boundaries where unit mocks cannot expose configuration errors
