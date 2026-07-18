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
- Sub-resource URL vs flat collection with a filter — `GET /api/projects/{id}/entries` says the child only exists inside the parent; `GET /api/entries?projectId=5` says it is a flat collection you happen to filter; interviewers ask which you chose because it exposes whether you designed the URL space or just grew it one endpoint at a time
- Why REST and not GraphQL or RPC — the standard for Spanish consultancy APIs; REST is simpler to implement and understand at junior level

## API evolution and compatibility

- Who your consumer is — an Angular app you deploy yourself versus another team's service you do not control; the answer decides whether changing a field is a five-minute edit or a coordinated release, and interviewers ask it before any versioning discussion
- Why the frontend and the backend are never live at the same instant — during a rollout the old client is still calling the new API, so every change must stay compatible with the previous client for at least one release; interviewers ask "you deployed the API first — what does the old Angular bundle see?"
- Expand and contract (parallel change) — add the new field, migrate every consumer, then remove the old one in a later release; the standard way to make a breaking change without breaking anyone, and the answer interviewers want instead of "I'd just rename it"
- Tolerant reader — a client should ignore JSON fields it does not recognise rather than fail on them; interviewers ask what happens to your Angular app when the backend adds a field, and "nothing" is only true if the client is tolerant

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
- Dependencies point downward only — the controller may call the service and the service the repository, never the reverse; an entity or repository that references a service is an inverted dependency, and interviewers show a class diagram and ask what is wrong with it
- Change amplification as a design smell — when adding one field forces an edit in the controller, the DTO, the mapper, the service, the entity and the test, the layers have become pass-through boilerplate; interviewers ask when layering earns its cost and when it is ceremony

## Where a responsibility belongs

- Why the service must not know about HTTP — a service that returns `ResponseEntity` or a status code can no longer be called from a scheduled job, another service, or a test without inventing a fake request; interviewers ask "could you call this method without a web request?"
- A domain exception as the contract between the service and the controller — the service throws `ProjectNotFoundException` and stays ignorant of 404; the translation to a status code happens at the edge, which is what lets one rule serve every entry point
- Swallowing an exception and returning success — a `catch` that logs and lets the method return `200 OK` leaves the caller unable to tell success from silent failure; the most common junior bug and a favourite pressure question
- Where a validation rule belongs when three layers could host it — bean validation on the request DTO checks shape, the service checks rules that need the database or another entity, a database constraint is the last line; juniors scatter the same rule across all three and the copies drift apart
- Where a cross-cutting backend concern belongs — request logging or an auth check goes in a filter or an interceptor, never copied into every controller method; interviewers ask where you would add logging to every endpoint and expect one insertion point, not thirty edits
- `UserService` + `UserServiceImpl` — the interface-plus-implementation convention that fills legacy Spring codebases; interviewers ask whether the interface is genuine abstraction or ritual, and the honest answer (one implementation, Spring proxies fine without it) scores higher than repeating the habit

## System shape and structure

- Package by layer vs package by feature — `controller/ service/ repository/` at the top level versus `project/ user/ timeentry/` each holding their own layers; interviewers ask how you would structure the project at 40 entities, and knowing both is what lets you navigate a legacy codebase and defend a new one
- Monolith vs microservices — one deployable versus many independently deployed services; what a split actually buys (independent deploy and scaling) against what it costs (network calls, distributed transactions, ops); "microservices are more modern" is a failing answer and interviewers ask this of juniors specifically to hear the tradeoff
- Layered vs hexagonal (ports and adapters) — hexagonal puts the domain in the centre and pushes the database and HTTP out to interchangeable adapters; consultancy interviewers drop the word to see whether you can say what it means and why layered was enough for your project
- Why the Angular app and the Spring Boot API are separate deployables — the frontend is a folder of static files on nginx or a CDN, the backend is a running JVM process; interviewers ask whether CORS still exists in production, and the answer depends entirely on this choice
- One repository with `backend/` and `frontend/` versus two repositories — how the project gets cloned, built, versioned and reviewed in one pass; interviewers ask because the answer reveals whether you thought past your own machine

## DTO pattern

- Why not expose entities directly — the entity belongs to the database layer; exposing it couples your API shape to your DB schema; a field rename breaks all clients
- Request DTO vs Response DTO — validate on the way in (client data is untrusted); control what goes out (you built it, you trust it)
- Where mapping happens — in the service layer, not the controller; the controller never sees the entity
- What changes when you add a field to the entity but not the DTO — nothing visible to the client; the DTO is the public contract
- One DTO per use case vs one shared DTO — a DTO reused by create, update and read drifts into a bag of nullable fields serving three endpoints badly; interviewers ask why the create payload and the response are separate classes
- A response DTO that mirrors every entity field — the DTO exists but insulates nothing; recognising a "DTO in name only" is what separates having read about the pattern from having applied it
- Why a response DTO should be immutable — nothing downstream of the mapping should be able to alter what the client receives; interviewers ask what a Java `record` buys you over a mutable class here

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
- Sequence-generated id vs UUID as the primary key — a sequence is compact and index-friendly but leaks how many rows exist and collides when two databases merge; a UUID is globally unique and larger; interviewers ask which you chose and expect a reason, not a default
- Enum column vs lookup table for a status — an enum is type-safe and readable but a new status needs a redeploy; a table makes the set of statuses data the business can change; interviewers ask what happens when the client invents a sixth status
- Audit columns on every table (`createdAt`, `updatedAt`, who changed it) — real systems need to answer "when did this row change and who did it", and interviewers ask because a schema without them signals someone who has never supported a system in production
- Storing every timestamp in UTC and converting at the edge — the database holds one canonical instant and the client renders local time; interviewers probe this hard on any time-tracking or booking domain, where a user in the Canaries and one in Madrid must see the same entry differently

## Angular patterns

- Smart / dumb component pattern — the smart component fetches data and handles events; the dumb component only displays and emits; separation makes testing easier and code more readable
- Coordinator pattern — a smart page that delegates display to multiple dumb children; all state lives in the coordinator; interviewers ask "how do you manage state in Angular?"
- HTTP interceptor as a cross-cutting concern — one interceptor adds auth headers and handles global errors for the entire app; the alternative (doing it in every service) breaks DRY
- When a coordinator grows too large — the signal to extract a service or split the feature into sub-pages; Single Responsibility applied at the component level

## Working in a codebase you did not write

- Identifying a class's layer from its annotation — `@RestController`, `@Service`, `@Repository`, `@Entity` and `@Configuration` each pin a class to exactly one layer; interviewers open an unfamiliar class and ask what it is and what it is allowed to call
- Identifying a class's layer from its name suffix — `...Controller`, `...ServiceImpl`, `...Repository`, `...Mapper`, `...Config`, `...Exception`; naming convention is the fastest navigation tool in a codebase with no documentation, which is every consultancy codebase
- Following a request end to end from a URL — find the mapped path, then the service method it calls, then the repository query underneath; this is the literal first task a junior is given on day one and interviewers simulate it
- Blast radius before editing — a service method called from four controllers is not a local change, and finding its callers comes before changing its signature; interviewers ask what you check before you touch a shared method
- The ripple of adding one field — how many artifacts a single new column touches before it reaches the client; interviewers give exactly this task and count how many of them you forget
- Reading the existing tests as the specification — in an undocumented codebase the test suite is the closest thing to a statement of intended behaviour, and a test that fails after your change is telling you what you broke

## Justifying architectural choices

- The "what + why + result" formula — every architecture decision must be explainable as: what you chose, why you chose it, and what problem it avoids or enables; answers like "I used coordinator because the page is big" do not pass a technical interview
- Comparing real alternatives — an architecture decision only exists when there was a real alternative; interviewers ask "why not the simpler option?" and expect a specific tradeoff, not a general preference
- Anchoring decisions to your own projects — in 2026 interviewers expect you to refer to code you actually wrote; "in project 05 I used coordinator because three siblings shared the same task list and lifting state to a parent avoided prop drilling" is a passing answer; a textbook definition is not
- Coupling and cohesion — the two words that explain why a change in one place broke three others (coupling) and why a class that does one thing is easier to change (cohesion); interviewers expect this vocabulary when you criticise a design, not "it was messy"
- Recognising a pattern in code you did not write — naming the structure from its shape (a coordinator, a repository, a state machine) and stating its tradeoff on the spot; the 2026 stage-4 interview now shows an unfamiliar, often AI-generated snippet and asks what the structure is doing, not what the syntax means

## Testing strategy

- Unit test vs integration test — unit tests one method in isolation (fast, no context); integration test loads the full stack (slow, catches wiring issues)
- Why you test the service layer independently — business rules live there; testing them directly without HTTP gives fast, focused feedback
- What a mock is and what it hides — a controlled replacement for a real dependency; the risk is that the mock behaves differently from the real thing
- Test pyramid — many unit tests, fewer integration tests, very few E2E tests; the shape that balances speed and confidence
- A test that asserts nothing — a body that calls the method and ends, or checks only `assertNotNull`; it passes forever and guarantees nothing, and in 2026 it is the named tell of an AI-generated suite that interviewers specifically hunt for
- Asserting on the mock instead of the result — when `verify(repo).save(...)` is the only assertion, the test still passes while the service returns the wrong object; interviewers show one and ask what it actually proves
- Stub vs mock — a stub only returns canned data, a mock also asserts that the interaction happened; interviewers ask which one `verify(repo).save(...)` actually makes your double, because "I used Mockito" means nothing on its own
- Spy vs mock — a spy wraps a real object and lets every unstubbed call reach the real method; interviewers ask when you would ever want the real code to run inside a test double
- Deciding what to mock and what to keep real — mocking everything produces a suite that only exercises the mocks while the query, the transaction and the mapping go untested; interviewers ask what your service test would still catch if the SQL underneath were wrong
- Why you do not test a private method directly — it is reached through the public method that uses it, and wanting to test it alone is the signal that it should be its own class

## SOLID

- Single Responsibility — one class, one reason to change; controllers handle HTTP, services handle rules, repositories handle data
- Open/Closed — extend behaviour without modifying existing code; add a new feature by adding new code, not changing existing code
- Liskov Substitution — a subtype can replace its parent without breaking the caller; why `JpaRepository` implementations are interchangeable
- Interface Segregation — prefer small specific interfaces over one large one; `UserDetailsService` has one method, not fifteen
- Dependency Inversion — depend on abstractions, not concrete classes; the entire Spring DI model and Angular's `inject()` are built on this principle
