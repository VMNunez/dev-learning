# Cross-topic inbox — coverage gaps routed between topics

**Internal component. Not runnable.** This file is the durable handoff between coverage runs.

A run on topic X regularly surfaces a genuine gap that belongs to topic Y (a JUnit concept found while
running Java, an Angular template-compiler concept found while running TypeScript). The run correctly
declines to write it into X's file — but before this file existed, the routing was recorded only in the
run's chat summary, which nobody reads later. The item then depended on Y's own future run
independently rediscovering it.

**That is not hypothetical.** The TypeScript run (2026-07-18) routed four Angular-owned concepts out;
Angular's own coverage run had already happened that same day and had *not* found them. Nothing in the
pipeline would have caught it: `coverage-audit`'s Analyst D reads `notes/coverage.md` for duplicates,
misplaced items and post-junior demotions, so a concept **absent from every section** is invisible to it.

## Contract

- **A run WRITES here** whenever Step 4a routes a gap out as "owned by another topic" — one bullet per
  concept, under that topic's heading, in the standard's item format, with the run that found it.
- **A run READS here** at Step 1: the pending entries under its own `## {TOPIC}` heading are treated as
  proposed items, judged against the standard exactly like any other proposed gap (they are not
  pre-approved — the owning run may still discard one as out of scope, and says so in its summary).
- **A run CLEARS what it consumed**: delete the entries it acted on, whether it added or discarded them,
  and say which in the summary. An entry left behind means it was not yet looked at.
- An empty heading (or no heading for a topic) means nothing is pending — that is the normal state.

Entries are proposals, not commitments. This file is never a second source of truth for scope: the job
is still the source, and `{NOTES_PATH}coverage.md` is still the topic's only coverage file.

---

*(No entries pending. The four Angular items routed from the TypeScript run on 2026-07-18 were consumed by the Angular coverage run the same day — all four added to `notes/angular/coverage.md`.)*

## Spring Boot

- Spring beans are singletons, so a service must be stateless — one instance is shared by every concurrent request, which makes an instance field holding request data (`private User currentUser`) a data-leak bug under load; bean scope and constructor injection are already covered, but not this consequence; interviewers ask "your service has a `currentUser` field — what happens with two simultaneous requests?" *(routed from the Architecture run, 2026-07-18)*
- Lombok `@Data` on a JPA entity — the generated `equals`/`hashCode`/`toString` touch every field including lazy relations, so putting the entity in a `HashSet` or logging it triggers loading or a `LazyInitializationException`; `@Data` is already covered on DTOs but not this entity-specific trap, which interviewers use as the "did you copy this from AI?" probe *(routed from the Architecture run, 2026-07-18)*
- The owning side of a bidirectional relationship — the side holding the foreign key (`@ManyToOne`, or the side without `mappedBy`) is the only one Hibernate reads when deciding what to persist, so setting only the `@OneToMany` side saves nothing and the developer sees a silent no-op; interviewers ask why the child was not saved *(routed from the Architecture run, 2026-07-18)*

- The OpenAPI document as the contract the frontend codes against — springdoc is already covered from the producer side, but not the consumer side: deriving the client's interfaces, endpoints, and response shapes from `/swagger-ui.html` rather than guessing, which is what a full-stack take-home actually exercises; interviewers ask how the Angular side knows the response shape before the backend is finished *(routed from the Angular run, 2026-07-18)*

- An exception thrown inside a security filter escapes `@RestControllerAdvice` — the filter chain runs before `DispatcherServlet`, so an `ExpiredJwtException` thrown while parsing the token becomes a raw container 500 instead of the API's JSON error shape; the fix is catching it in the filter and delegating to the `AuthenticationEntryPoint`; the filter chain and the entry point are both already covered, but not this consequence; interviewers ask why the global handler never fires for auth errors *(routed from the Security run, 2026-07-18)*
- `ExpiredJwtException` vs `SignatureException` vs `MalformedJwtException` — expiry means a legitimate but stale token, a signature failure means the secret differs or the payload was tampered with, malformed means the string is not a JWT at all; interviewers name one exception and ask what the client did to cause it; JWT validation is covered but not the failure taxonomy *(routed from the Security run, 2026-07-18)*
- `There is no PasswordEncoder mapped for the id "null"` — thrown by `DelegatingPasswordEncoder` when the stored hash lacks a `{bcrypt}` prefix, i.e. the user row was inserted without going through `PasswordEncoder.encode()`; the encoder bean and `matches()` are covered, but not this startup-adjacent error; interviewers use it to check you know encoding happens at registration, not at login *(routed from the Security run, 2026-07-18)*
- Anonymous authentication is not `null` — an unauthenticated request still carries an `AnonymousAuthenticationToken` in the `SecurityContextHolder`, so a hand-rolled `getAuthentication() != null` ownership check passes for a logged-out caller; `SecurityContextHolder` is covered but not this trap; interviewers plant the null-check and ask who gets through *(routed from the Security run, 2026-07-18)*
- A custom filter must call `filterChain.doFilter` even when there is no token — returning early on a missing `Authorization` header silently breaks every `permitAll()` endpoint, because the request never reaches the rest of the chain; `OncePerRequestFilter` is covered but not this control-flow rule; interviewers ask why login itself started returning nothing *(routed from the Security run, 2026-07-18)*
- Preflight `OPTIONS` rejected with 401 — the browser sends the preflight without the `Authorization` header, so a chain that authenticates every request kills it before CORS headers are ever written; the fix is enabling `cors()` in the chain so the CORS filter runs first; CORS config in `SecurityFilterChain` is covered, but not this interaction with the auth rules *(routed from the Security run, 2026-07-18)*
