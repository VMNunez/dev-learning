# Architecture Junior Notes Plan

Plan status: current
Coverage: notes/architecture/coverage/junior.md
Coverage SHA-256: fcaf714b23d80537eb98b990fc54ccb79d5fe63f29ada53525d5078fad628c3b
Generated: 2026-07-24

## 01 — REST

Status: pending
Action: audit
English: notes/architecture/junior/en/02-rest-api.md
Spanish: notes/architecture/junior/es/02-rest-api.md
Depends on: none

Coverage concepts:

- REST principles: stateless, resources, HTTP verbs, uniform interface — the four constraints that define REST; interviewers ask "is your API RESTful and how do you know?"
- Resource naming: plural nouns, no verbs in URLs (`/api/projects`, not `/api/getProjects`) — why REST uses nouns and the HTTP verb carries the action
- Resource modelling — paths identify resources and relationships, while HTTP methods express the
  operation; interviewers use verb-heavy endpoints to test whether the API has a coherent model
- Why REST and not GraphQL or RPC — the standard for Spanish consultancy APIs; REST is simpler to implement and understand at junior level

Rationale: These concepts form the coherent coverage group “REST”.

## 02 — Layered architecture

Status: pending
Action: audit
English: notes/architecture/junior/en/03-layered-architecture.md
Spanish: notes/architecture/junior/es/03-layered-architecture.md
Depends on: 01

Coverage concepts:

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

Rationale: These concepts form the coherent coverage group “Layered architecture”.

## 03 — DTO pattern

Status: pending
Action: audit
English: notes/architecture/junior/en/05-component-patterns.md
Spanish: notes/architecture/junior/es/05-component-patterns.md
Depends on: 02

Coverage concepts:

- Why not expose entities directly — the entity belongs to the database layer; exposing it couples your API shape to your DB schema; a field rename breaks all clients
- Request DTO vs Response DTO — validate on the way in (client data is untrusted); control what goes out (you built it, you trust it)
- Where mapping happens — in the service layer, not the controller; the controller never sees the entity
- What changes when you add a field to the entity but not the DTO — nothing visible to the client; the DTO is the public contract
- Smart / dumb component pattern — the smart component fetches data and handles events; the dumb component only displays and emits; separation makes testing easier and code more readable
- Coordinator pattern — a smart page that delegates display to multiple dumb children; all state lives in the coordinator; interviewers ask "how do you manage state in Angular?"
- HTTP interceptor as a cross-cutting concern — one interceptor adds auth headers and handles global errors for the entire app; the alternative (doing it in every service) breaks DRY
- When a coordinator grows too large — the signal to extract a service or split the feature into sub-pages; Single Responsibility applied at the component level

Rationale: These concepts form the coherent coverage group “DTO pattern, Angular patterns”.

## 04 — Data access decisions

Status: pending
Action: audit
English: notes/architecture/junior/en/01-architecture-decisions.md
Spanish: notes/architecture/junior/es/01-architecture-decisions.md
Depends on: 03

Coverage concepts:

- Soft delete vs hard delete — `active = false` instead of `DELETE FROM`; preserves historical data, prevents orphaned records, allows recovery
- Pagination — why you always paginate list endpoints in production; returning 100,000 rows crashes the server and the client
- Consistency boundary — one business operation may require several writes to succeed or fail as a
  unit; Architecture chooses the boundary while SQL and Spring Boot own its concrete transaction mechanics

Rationale: These concepts form the coherent coverage group “Data access decisions”.

## 05 — Testing strategy

Status: pending
Action: create
English: notes/architecture/junior/en/06-testing-strategy.md
Spanish: notes/architecture/junior/es/06-testing-strategy.md
Depends on: 04

Coverage concepts:

- Why you test the service layer independently — business rules live there; testing them directly without HTTP gives fast, focused feedback
- Testability as a design signal — a class that cannot be exercised without booting unrelated layers
  often has hidden dependencies or mixed responsibilities
- Contract tests at boundaries — when two layers or services exchange a DTO, test the contract where
  drift would break integration rather than duplicating every unit test

Rationale: These concepts form the coherent coverage group “Testing strategy”.

## 06 — Design qualities and boundaries

Status: pending
Action: create
English: notes/architecture/junior/en/07-design-qualities-and-boundaries.md
Spanish: notes/architecture/junior/es/07-design-qualities-and-boundaries.md
Depends on: 05

Coverage concepts:

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
- Technical debt — a deliberate shortcut has a known cost and follow-up condition; accidental
  complexity without ownership is simply a defect
- Monolith vs microservices awareness — a monolith deploys one application and keeps local calls and
  transactions simple; microservices add independent deployment but also network failure, distributed
  data, and operational cost, so a junior project should not split without a real scaling boundary

Rationale: These concepts form the coherent coverage group “Design qualities and boundaries”.

## 07 — SOLID

Status: pending
Action: create
English: notes/architecture/junior/en/08-solid.md
Spanish: notes/architecture/junior/es/08-solid.md
Depends on: 06

Coverage concepts:

- Single Responsibility — one class, one reason to change; controllers handle HTTP, services handle rules, repositories handle data
- Open/Closed — extend behaviour without modifying existing code; add a new feature by adding new code, not changing existing code
- Liskov Substitution — a subtype can replace its parent without breaking the caller; why `JpaRepository` implementations are interchangeable
- Interface Segregation — prefer small specific interfaces over one large one; `UserDetailsService` has one method, not fifteen
- Dependency Inversion — depend on abstractions, not concrete classes; the entire Spring DI model and Angular's `inject()` are built on this principle

Rationale: These concepts form the coherent coverage group “SOLID”.

## Unassigned existing notes

- notes/architecture/junior/en/04-mvc.md — no junior coverage group is assigned to this legacy file.
