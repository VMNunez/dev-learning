# Minimum Coverage — Architecture

Patterns and decisions a junior at a Spanish consultancy must be able to explain.
Not just what they are — but why they were chosen and what the tradeoff is.
Every answer must be anchored to a real example from Victor's projects.

## REST
- [ ] REST principles: stateless, resources, HTTP verbs, uniform interface
- [ ] Resource naming: plural nouns, hierarchy, no verbs in URLs (`/api/projects`, not `/api/getProjects`)
- [ ] Idempotency — GET, PUT, DELETE are idempotent; POST is not — what this means in practice
- [ ] Why REST and not GraphQL or RPC — the tradeoff consultancies want you to explain

## Layered architecture
- [ ] Controller → Service → Repository — what each layer owns and what it must not do
- [ ] Why business logic belongs in the service, not the controller
- [ ] Why database queries belong in the repository, not the service
- [ ] Why the controller must not call the repository directly

## DTO pattern
- [ ] Why not expose entities directly from the controller (coupling, over-fetching, security)
- [ ] Request DTO vs Response DTO — separating input shape from output shape
- [ ] Where mapping happens — in the service layer, not the controller
- [ ] What changes when you add a field to the entity but not the DTO (or vice versa)

## Auth design
- [ ] JWT vs session-based auth — stateless vs stateful, the tradeoff
- [ ] Why stateless auth matters for APIs consumed by Angular (no server-side session needed)
- [ ] Access token vs refresh token — why they have different lifetimes
- [ ] Where to store the JWT in the browser — localStorage vs HttpOnly cookie, the security tradeoff

## Data access decisions
- [ ] **N+1 problem** — what it is, how JPA causes it silently, how to detect and fix it
- [ ] Soft delete vs hard delete — why production apps rarely delete rows permanently
- [ ] Pagination design — why you always paginate in production; what happens without it at scale
- [ ] `@Transactional` as a design decision — when a service method needs a transaction boundary

## Angular patterns
- [ ] Smart / dumb component pattern — what each owns, why the split makes testing easier
- [ ] Coordinator pattern — a smart component that delegates display to dumb children
- [ ] When a coordinator grows too large — the signal to extract a service or split the page
- [ ] HTTP interceptor as a cross-cutting concern — one place for auth headers and error handling

## Testing strategy
- [ ] Unit test vs integration test — what each tests and what it costs
- [ ] Why you test the service layer independently of the controller
- [ ] What a mock is and what it hides — the risk of over-mocking
- [ ] Test pyramid — many unit tests, fewer integration tests, even fewer E2E tests

## Monolith vs Microservices (concept only — no implementation needed)
- [ ] What a monolith is — one codebase, one deployable unit, simpler to build and debug
- [ ] What microservices are — independent services, each owning one domain and its own database
- [ ] The tradeoff — monolith: simple to start, hard to scale teams; microservices: complex to run, needed when teams deploy independently
- [ ] What to say in an interview — when to start with a monolith, why microservices are not always better
- [ ] What it means for a junior joining a consultancy — you work in one service, communicate via REST with others

## SOLID (brief — enough for an interview)
- [ ] Single Responsibility — one reason to change; applied to controllers and services daily
- [ ] Open/Closed — extend without modifying; how Spring beans apply this
- [ ] Liskov Substitution — subtypes honour the contract; why `JpaRepository` can be swapped
- [ ] Interface Segregation — specific interfaces over fat ones
- [ ] Dependency Inversion — depend on abstractions; the entire Spring DI model relies on this
