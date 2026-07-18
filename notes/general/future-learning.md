# General concepts — future learning

Concepts to study after the junior role is secured. Not needed for the August–September 2026 target.

---

## Design patterns (GoF)

The 23 classic patterns from the "Gang of Four" book. You already apply some without knowing the name (Strategy, Observer). Worth studying properly after SOLID is solid.

Most asked in mid-level interviews: **Factory**, **Singleton**, **Observer**, **Strategy**, **Builder**, **Decorator**.

---

## OAuth2 / OpenID Connect

Authentication via third-party providers (Google, GitHub, Azure AD). Common in enterprise Spring Boot projects. Spring Security has full OAuth2 support. Not needed for project 07 — JWT covers the junior interview.

---

## WebSockets / Server-Sent Events

Real-time bidirectional communication. Used for chat apps, live dashboards, notifications. Spring Boot supports both via WebSocket and SSE. Out of scope until the main stack is solid.

---

## GraphQL

Alternative to REST. The client specifies exactly which fields it wants. Spring Boot has `spring-graphql`. Relevant in some companies but REST is still the standard for Spanish consultancies at junior level.

---

## Caching — application and infrastructure layers only

**Partially promoted 2026-07-19.** The HTTP layer of this entry is now in scope and lives in coverage under "Caching and conditional requests" — `Cache-Control`, `ETag`/`If-None-Match`, `Last-Modified`, `304`, and why `GET` is cacheable — because a junior is shown a Network tab and asked why a stale bundle is being served.

What stays post-junior is caching as an *architecture*: application-level caching (`@Cacheable` in Spring Boot, eviction policies), Redis as a shared cache layer, and cache invalidation strategy. Knowing the headers is in scope; designing a cache tier is not.

---

## SSL / TLS

How HTTPS works — certificates, handshake, public/private key pairs. Knowing conceptually what HTTPS does is enough for a junior. Configuring certificates in production (Let's Encrypt, Nginx, reverse proxies) is a mid/senior or DevOps concern.

---

## API versioning — the strategy comparison

**Scope boundary clarified 2026-07-19.** The junior-level concept is already covered, and not by this topic: breaking vs non-breaking change and URL versioning (`/api/v1/`) live in Spring Boot and Architecture coverage, because that is where an interviewer asks it ("you must change a field the frontend depends on — what do you do?").

What remains post-junior is the *comparison* of strategies — header versioning, content negotiation, and choosing between them when an API has multiple consumers on different release cycles.

---

## Big O notation and algorithmic complexity

Time and space complexity. Needed for LeetCode Medium+ problems. Start after Angular + Java are solid and the LeetCode Easy phase begins (daily 12:30 block, stage 2).

---

## Functional programming concepts

Pure functions, immutability, function composition, monads. You already use lambdas and streams in Java and arrow functions in TypeScript. A formal study of FP concepts comes after the OOP foundation is secure.

---

## HTTP/2, HTTP/3 and TLS internals

_Added 2026-07-19 from the coverage run's discarded gaps._ Multiplexing, header compression (HPACK), server push, QUIC; and below them the TLS handshake itself — cipher suites, certificate chain validation, SNI, session resumption. Also the deeper reaches of content negotiation (`Accept-Encoding`, `q=` quality values) and byte-range requests (`Range` / `206`). A junior explains what HTTPS guarantees; none of this is probed at that level.

---

## Resilience patterns

_Added 2026-07-19._ Retry with backoff, circuit breakers, bulkheads (Resilience4j), and idempotency keys for exactly-once delivery. Real in consultancy microservice work, but a junior is only asked whether retrying a `POST` is safe — which is already covered by the safe-vs-idempotent item.

---

## Observability

_Added 2026-07-19._ Structured/JSON logging pipelines, correlation IDs propagated across services, log aggregation (ELK, Grafana Loki), metrics (Prometheus) and distributed tracing (OpenTelemetry, Jaeger). Coverage holds the single-application version — log levels, what must never be logged — and stops there.

---

## Orchestration and CI/CD authoring

_Added 2026-07-19._ Kubernetes (pods, deployments, Helm, service meshes), container registries and image scanning, and writing CI pipelines rather than merely consuming them (GitHub Actions/Jenkins syntax, caching, matrix builds). Also deployment strategies: blue/green, canary, and feature-flag platforms. Coverage stops at `docker-compose up`, the CI pipeline as a merge gate, and rollback as a concept.

---

## Advanced testing practices

_Added 2026-07-19._ Contract testing (Pact), mutation testing (PIT), performance and load testing, and Testcontainers-vs-embedded-DB trade-offs. JUnit 5 + Mockito plus the "what makes a test worth writing" items are the junior floor; these raise the ceiling afterwards.

---

## Scaled agile and delivery metrics

_Added 2026-07-19._ SAFe, LeSS, Nexus and scrum-of-scrums; burndown/burnup and cumulative flow diagrams; SLA/SLO/error budgets and incident severity classification; formal post-mortems. Real inside large consultancies, but never a junior filter — the ceremonies and the story lifecycle already in coverage are what gets asked.

---

## OpenAPI / Swagger

Documentation format for describing REST APIs. Spring Boot integrates with Springdoc (`springdoc-openapi-starter-webmvc-ui`) to generate interactive API docs at `/swagger-ui.html` automatically from your controllers and annotations. Used at most consultancies to document internal APIs. Not needed to land the junior role, but you will work with it from day one on the job.
