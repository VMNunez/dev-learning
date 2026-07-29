# Minimum Coverage — Architecture

Patterns and decisions a junior at a Spanish consultancy must explain confidently.
Not just what they are — but why they were chosen and what the tradeoff is.
Every answer must be anchored to a real example from Victor's projects.

## REST

- REST principles: stateless, resources, HTTP verbs, uniform interface — the four constraints that define REST; interviewers ask "is your API RESTful and how do you know?"
- Resource naming: plural nouns, no verbs in URLs (`/api/projects`, not `/api/getProjects`) — why REST uses nouns and the HTTP verb carries the action
- Resource modelling — paths identify resources and relationships, while HTTP methods express the
  operation; interviewers use verb-heavy endpoints to test whether the API has a coherent model
- Why REST and not GraphQL or RPC — the standard for Spanish consultancy APIs; REST is simpler to implement and understand at junior level

## Layered architecture

- Frontend/backend separation — Angular runs in the browser and Spring Boot runs on a server; they communicate only through HTTP; Angular never queries the database directly; the backend controls what data is exposed and who can access it
- Controller → Service → Repository — what each layer owns and what it must not do; interviewers ask "where does business logic live?"
- Service layer — the class (`@Service`) that holds business rules, validation beyond bean validation, and orchestration between repositories; interviewers ask "why not put this logic in the controller?" — because the controller would then be impossible to reuse from another entry point (a scheduled job, a CLI command) and impossible to unit test without starting the whole web layer
- Repository pattern — places data-access operations behind an interface so application logic does
  not contain queries directly; a JPA repository still carries persistence semantics and is not a
  promise that every storage technology is interchangeable
- Why business logic belongs in the service — the controller must not decide; the repository must not know the rules; the service is the only place
- Why the controller must not call the repository directly — bypasses the business rules layer; makes the code impossible to test in isolation
- MVC — separates input coordination, presentation, and application/domain state; it is not limited
  to server-rendered HTML and is a different design axis from controller/service/repository layering
- MVC vs layered architecture — MVC organises interaction and presentation responsibilities, while
  layers organise dependency direction; a system can use both without one being a subtype of the other
- State machine pattern — a workflow where status transitions follow fixed rules (DRAFT → SUBMITTED → APPROVED/REJECTED); the service enforces which transitions are valid

## DTO pattern

- Why not expose entities directly — the entity belongs to the database layer; exposing it couples your API shape to your DB schema; a field rename breaks all clients
- Request DTO vs Response DTO — validate on the way in (client data is untrusted); control what goes out (you built it, you trust it)
- Where mapping happens — in the service layer, not the controller; the controller never sees the entity
- What changes when you add a field to the entity but not the DTO — nothing visible to the client; the DTO is the public contract
- Separate Create/Update request DTOs even when their fields match today — they represent distinct
  intents on the same resource, and an update-only field (e.g. reactivating a soft-deleted record) can
  be added to one without disturbing the creation contract; picking one pattern for one resource and a
  different one for another reads as inconsistency, not pragmatism

## Data access decisions

- Soft delete vs hard delete — `active = false` instead of `DELETE FROM`; preserves historical data, prevents orphaned records, allows recovery
- Pagination — why you always paginate list endpoints in production; returning 100,000 rows crashes the server and the client
- Consistency boundary — one business operation may require several writes to succeed or fail as a
  unit; Architecture chooses the boundary while SQL and Spring Boot own its concrete transaction mechanics

## Angular patterns

- Smart / dumb component pattern — the smart component fetches data and handles events; the dumb component only displays and emits; separation makes testing easier and code more readable
- Coordinator pattern — a smart page that delegates display to multiple dumb children; all state lives in the coordinator; interviewers ask "how do you manage state in Angular?"
- HTTP interceptor as a cross-cutting concern — one interceptor adds auth headers and handles global errors for the entire app; the alternative (doing it in every service) breaks DRY
- When a coordinator grows too large — the signal to extract a service or split the feature into sub-pages; Single Responsibility applied at the component level

## Testing strategy

- Why you test the service layer independently — business rules live there; testing them directly without HTTP gives fast, focused feedback
- Testability as a design signal — a class that cannot be exercised without booting unrelated layers
  often has hidden dependencies or mixed responsibilities
- Contract tests at boundaries — when two layers or services exchange a DTO, test the contract where
  drift would break integration rather than duplicating every unit test

## Design qualities and boundaries

- Coupling — the number and strength of dependencies between modules; lower coupling limits the
  blast radius of a change
- Cohesion — how strongly a module's responsibilities belong together; high cohesion is the reason
  related business rules stay in one service or feature
- Dependency direction — outer delivery and persistence details may depend on application contracts,
  while business rules should not depend on HTTP or database APIs
- Package by feature vs package by layer — feature packaging keeps one use case together; layer
  packaging makes technical roles obvious but scatters a change across the tree
- Composition over inheritance — assembling focused collaborators avoids inheriting behaviour and
  state a subtype does not need
- Over-engineering — an abstraction is justified by a real variation or repeated pressure, not by a
  hypothetical future requirement
- Extract Method / DRY — identical business logic copy-pasted across two methods (e.g. the same
  validation block in a service's `create` and `update`) is a bug waiting to diverge, not just
  duplication; pulling it into one private helper (plus hoisting repeated literals to named constants)
  means a rule changes in exactly one place
- Technical debt — a deliberate shortcut has a known cost and follow-up condition; accidental
  complexity without ownership is simply a defect
- Monolith vs microservices awareness — a monolith deploys one application and keeps local calls and
  transactions simple; microservices add independent deployment but also network failure, distributed
  data, and operational cost, so a junior project should not split without a real scaling boundary

## SOLID

- Single Responsibility — one class, one reason to change; controllers handle HTTP, services handle rules, repositories handle data
- Open/Closed — extend behaviour without modifying existing code; add a new feature by adding new code, not changing existing code
- Liskov Substitution — a subtype can replace its parent without breaking the caller; why `JpaRepository` implementations are interchangeable
- Interface Segregation — prefer small specific interfaces over one large one; `UserDetailsService` has one method, not fifteen
- Dependency Inversion — depend on abstractions, not concrete classes; the entire Spring DI model and Angular's `inject()` are built on this principle
