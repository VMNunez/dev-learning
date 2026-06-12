# Minimum Coverage — Architecture

Patterns and decisions a junior at a Spanish consultancy must be able to explain.
Not just what they are — but why they were chosen and what the tradeoff is.

## REST
- [ ] REST principles: stateless, resources, HTTP verbs, status codes
- [ ] Why REST and not RPC or GraphQL — the tradeoff consultancies care about
- [ ] Resource naming conventions: plural nouns, hierarchy, no verbs in URLs

## Layered architecture
- [ ] Controller → Service → Repository — what each layer owns, what it does not own
- [ ] Why business logic belongs in the service, not the controller
- [ ] Why queries belong in the repository, not the service

## DTO pattern
- [ ] Why not return entities directly from the controller
- [ ] Request DTO vs Response DTO — separating input shape from output shape
- [ ] Where mapping happens (service layer) and why not in the controller

## Auth design
- [ ] JWT vs session-based auth — when to choose each and the tradeoff
- [ ] Why stateless auth matters for APIs that Angular consumes
- [ ] Access token vs refresh token — why and when to use both

## Angular patterns
- [ ] Smart / dumb component pattern — what each component is responsible for
- [ ] Coordinator pattern — a smart component that orchestrates multiple dumb ones
- [ ] When a coordinator becomes too large — the signal to extract a service or split the page

## Database decisions
- [ ] Soft delete vs hard delete — why production apps often avoid hard delete
- [ ] Why you return DTOs and not entities in paginated responses
- [ ] One-to-many vs many-to-many — when each relationship appears and what it costs

## SOLID (brief — enough for an interview)
- [ ] Single Responsibility — one reason to change
- [ ] Open/Closed — extend without modifying
- [ ] Liskov Substitution — subtypes must honour the contract
- [ ] Interface Segregation — specific interfaces over fat ones
- [ ] Dependency Inversion — depend on abstractions (Spring's whole model)
