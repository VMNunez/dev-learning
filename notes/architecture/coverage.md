# Minimum Coverage — Architecture

Patterns and decisions a junior at a Spanish consultancy must explain confidently.
Not just what they are — but why they were chosen and what the tradeoff is.
Every answer must be anchored to a real example from Victor's projects.

## REST

- REST principles: stateless, resources, HTTP verbs, uniform interface — the four constraints that define REST; interviewers ask "is your API RESTful and how do you know?"
- Resource naming: plural nouns, no verbs in URLs (`/api/projects`, not `/api/getProjects`) — why REST uses nouns and the HTTP verb carries the action
- Idempotency — `GET`, `PUT`, `DELETE` are idempotent; `POST` is not; interviewers ask "what happens if the client sends the same DELETE request twice?"
- `PATCH` vs `PUT` — `PUT` replaces the whole resource; `PATCH` changes one part; used in TimeTrack for status transitions (submit, approve, reject)
- HTTP status codes — `200 OK` (success with body), `201 Created` (POST that creates a resource), `204 No Content` (DELETE with no body), `400 Bad Request` (invalid client data), `404 Not Found` (wrong ID); sending the wrong code misleads clients and tools
- `401 Unauthorized` vs `403 Forbidden` — 401 means no valid credentials (who are you?); 403 means valid credentials but insufficient permissions (you are not allowed); interviewers ask this because it tests whether the candidate understands authentication vs authorisation
- CORS — a browser security rule that blocks requests from a different origin (e.g. Angular on port 4200 calling Spring Boot on port 8080); the fix is always on the server, never in the browser or client code; if Postman works but the Angular app does not, CORS is the cause; interviewers ask where the fix lives
- Query parameters for filtering and pagination — `GET /api/entries?month=2025-05&status=SUBMITTED`; query params carry optional filtering; the backend reads them with `@RequestParam`, the frontend sends them with `HttpParams`; never use a request body on `GET` requests
- Why REST and not GraphQL or RPC — the standard for Spanish consultancy APIs; REST is simpler to implement and understand at junior level

## Layered architecture

- Frontend/backend separation — Angular runs in the browser and Spring Boot runs on a server; they communicate only through HTTP; Angular never queries the database directly; the backend controls what data is exposed and who can access it
- Controller → Service → Repository — what each layer owns and what it must not do; interviewers ask "where does business logic live?"
- Service layer — the class (`@Service`) that holds business rules, validation beyond bean validation, and orchestration between repositories; interviewers ask "why not put this logic in the controller?" — because the controller would then be impossible to reuse from another entry point (a scheduled job, a CLI command) and impossible to unit test without starting the whole web layer
- Repository pattern — an interface (`JpaRepository<Entity, Id>`) that hides how data is actually fetched from the database behind method calls like `findByEmail()`; interviewers ask "what does the repository pattern give you?" — the service does not know or care if the data comes from PostgreSQL, an in-memory list, or a different ORM; this is what makes the service testable with a mock repository
- Why business logic belongs in the service — the controller must not decide; the repository must not know the rules; the service is the only place
- Why the controller must not call the repository directly — bypasses the business rules layer; makes the code impossible to test in isolation
- MVC — Model (data + business logic), View (what the user sees), Controller (receives input, coordinates the other two); interviewers ask "do you know MVC?" expecting you to map it onto your own stack, not recite the textbook triangle
- MVC vs Layered Architecture — MVC is for apps that render HTML (controller returns a View); Layered Architecture is for REST APIs (controller returns JSON, the View is a separate SPA); layered architecture is really MVC with the Model split into Service (business logic) and Repository (data access) because one combined Model layer gets too large for a real application
- State machine pattern — a workflow where status transitions follow fixed rules (DRAFT → SUBMITTED → APPROVED/REJECTED); the service enforces which transitions are valid

## DTO pattern

- Why not expose entities directly — the entity belongs to the database layer; exposing it couples your API shape to your DB schema; a field rename breaks all clients
- Request DTO vs Response DTO — validate on the way in (client data is untrusted); control what goes out (you built it, you trust it)
- Where mapping happens — in the service layer, not the controller; the controller never sees the entity
- What changes when you add a field to the entity but not the DTO — nothing visible to the client; the DTO is the public contract

## Auth design

- JWT vs session-based auth — JWT is stateless (no server memory per user); session is stateful (server stores session); JWT scales better for APIs consumed by multiple clients
- Why stateless auth matters for APIs consumed by Angular — no shared session state; the API can run on multiple servers without sticky sessions
- Access token vs refresh token — access token is short-lived (minutes to hours); refresh token is long-lived and used only to get a new access token; limits damage if a token is stolen
- Where to store the JWT in the browser — localStorage is simple but vulnerable to XSS; HttpOnly cookie is safer but vulnerable to CSRF; localStorage is the common choice for SPAs that already prevent XSS

## Data access decisions

- N+1 problem — when JPA loads a list of entities and fires one extra query per entity to load a related field; causes serious performance problems silently; fix with `JOIN FETCH` or `@EntityGraph`
- Soft delete vs hard delete — `active = false` instead of `DELETE FROM`; preserves historical data, prevents orphaned records, allows recovery
- Pagination — why you always paginate list endpoints in production; returning 100,000 rows crashes the server and the client
- `@Transactional` as a design decision — when a service method writes to two tables, both operations must succeed or both must roll back

## Angular patterns

- Smart / dumb component pattern — the smart component fetches data and handles events; the dumb component only displays and emits; separation makes testing easier and code more readable
- Coordinator pattern — a smart page that delegates display to multiple dumb children; all state lives in the coordinator; interviewers ask "how do you manage state in Angular?"
- HTTP interceptor as a cross-cutting concern — one interceptor adds auth headers and handles global errors for the entire app; the alternative (doing it in every service) breaks DRY
- When a coordinator grows too large — the signal to extract a service or split the feature into sub-pages; Single Responsibility applied at the component level

## Justifying architectural choices

- The "what + why + result" formula — every architecture decision must be explainable as: what you chose, why you chose it, and what problem it avoids or enables; answers like "I used coordinator because the page is big" do not pass a technical interview
- Comparing real alternatives — an architecture decision only exists when there was a real alternative; interviewers ask "why not the simpler option?" and expect a specific tradeoff, not a general preference
- Anchoring decisions to your own projects — in 2026 interviewers expect you to refer to code you actually wrote; "in project 05 I used coordinator because three siblings shared the same task list and lifting state to a parent avoided prop drilling" is a passing answer; a textbook definition is not

## Testing strategy

- Unit test vs integration test — unit tests one method in isolation (fast, no context); integration test loads the full stack (slow, catches wiring issues)
- Why you test the service layer independently — business rules live there; testing them directly without HTTP gives fast, focused feedback
- What a mock is and what it hides — a controlled replacement for a real dependency; the risk is that the mock behaves differently from the real thing
- Test pyramid — many unit tests, fewer integration tests, very few E2E tests; the shape that balances speed and confidence

## SOLID

- Single Responsibility — one class, one reason to change; controllers handle HTTP, services handle rules, repositories handle data
- Open/Closed — extend behaviour without modifying existing code; add a new feature by adding new code, not changing existing code
- Liskov Substitution — a subtype can replace its parent without breaking the caller; why `JpaRepository` implementations are interchangeable
- Interface Segregation — prefer small specific interfaces over one large one; `UserDetailsService` has one method, not fifteen
- Dependency Inversion — depend on abstractions, not concrete classes; the entire Spring DI model and Angular's `inject()` are built on this principle
