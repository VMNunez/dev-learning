# Middle Coverage — Spring Boot

Concepts expected from a Spring Boot developer who owns production behaviour beyond straightforward CRUD services.

## Production boundaries and diagnostics

- `AuthenticationEntryPoint` and `AccessDeniedHandler` — control unauthenticated and forbidden responses at the security boundary
- Spring Boot Actuator — expose and secure health, metrics, and diagnostic endpoints for operations
- Application caching — place `@Cacheable`, eviction, and cache keys around stable reads without serving stale business state
- OpenAPI contract maintenance — keep generated documentation aligned with validation, error responses, and consumer-visible DTOs

## Distributed application foundations

- Microservice boundaries — split by business capability only when independent ownership and deployment justify distributed complexity
- Spring Cloud configuration and discovery awareness — recognise the infrastructure patterns commonly surrounding Spring microservices
- Message-driven processing — design idempotent consumers, retries, and dead-letter handling for queues or event brokers
- Resilience patterns — apply timeouts, circuit breakers, and bounded retries to remote calls without multiplying failure traffic

## Testing depth

- Spring test slices — choose `@WebMvcTest`, `@DataJpaTest`, or a full context according to the boundary under test
- Testcontainers — run integration tests against disposable real infrastructure instead of relying only on in-memory substitutes
- Contract and integration testing — verify database, HTTP, and messaging boundaries where unit mocks cannot expose configuration errors
