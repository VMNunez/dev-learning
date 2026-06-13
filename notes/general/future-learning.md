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

## Caching

HTTP cache headers (`Cache-Control`, `ETag`), application-level caching (`@Cacheable` in Spring Boot), Redis as a cache layer. Reduces database load. Topic for mid-level roles.

---

## SSL / TLS

How HTTPS works — certificates, handshake, public/private key pairs. Knowing conceptually what HTTPS does is enough for a junior. Configuring certificates in production (Let's Encrypt, Nginx, reverse proxies) is a mid/senior or DevOps concern.

---

## API versioning

Strategies for evolving a REST API without breaking existing clients: URL versioning (`/api/v1/`), header versioning, content negotiation. Relevant when an API has multiple consumers with different release cycles.

---

## Big O notation and algorithmic complexity

Time and space complexity. Needed for LeetCode Medium+ problems. Start after Angular + Java are solid and the LeetCode Easy phase begins (daily 12:30 block, stage 2).

---

## Functional programming concepts

Pure functions, immutability, function composition, monads. You already use lambdas and streams in Java and arrow functions in TypeScript. A formal study of FP concepts comes after the OOP foundation is secure.

---

## OpenAPI / Swagger

Documentation format for describing REST APIs. Spring Boot integrates with Springdoc (`springdoc-openapi-starter-webmvc-ui`) to generate interactive API docs at `/swagger-ui.html` automatically from your controllers and annotations. Used at most consultancies to document internal APIs. Not needed to land the junior role, but you will work with it from day one on the job.
