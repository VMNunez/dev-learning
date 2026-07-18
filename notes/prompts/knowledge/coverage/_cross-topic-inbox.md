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

## Security

- Least privilege for the application's database role — the app connects with a role that can read and write rows but cannot `DROP` a table or read another schema, so a successful SQL injection is capped at what that role can reach; Security already owns SQL injection and parameterised queries, but not the blast-radius argument; interviewers ask "injection got through — how bad is it?" *(routed from the SQL run, 2026-07-18)*
- Mapping a database constraint violation to an HTTP response — a unique violation is a `409 Conflict` and a foreign key violation a `400`/`404`, never a raw `500` echoing the SQL, because the constraint name and table names leak the schema to the client; the SQL side (the error text, the SQLSTATE code) is owned by SQL coverage, the information-disclosure side is not covered anywhere *(routed from the SQL run, 2026-07-18)*

- What must never appear in a log line — an access token, a password, a full request body containing personal data; logs are shipped to a central system half the company can read, so a logged JWT is a credential leak with a long tail; Security owns secrets in config and tokens in storage, but not the logging surface; interviewers ask how you would debug a production failure you cannot reproduce and expect you to name what you would *not* print *(routed from the Architecture run, 2026-07-18)*

- A CORS-blocked request reports no status code — the browser surfaces a rejected preflight as a generic network error with `status 0`, not the real backend status, so the Network tab shows a failure that looks nothing like the 401 or 500 the server actually sent; interviewers ask why the error has no status and expect you to distinguish a CORS block from an auth failure. Security already owns CORS and the `OPTIONS` preflight, but not this symptom *(routed from the Angular run, 2026-07-18)*

## Spring Boot

- Spring beans are singletons, so a service must be stateless — one instance is shared by every concurrent request, which makes an instance field holding request data (`private User currentUser`) a data-leak bug under load; bean scope and constructor injection are already covered, but not this consequence; interviewers ask "your service has a `currentUser` field — what happens with two simultaneous requests?" *(routed from the Architecture run, 2026-07-18)*
- Lombok `@Data` on a JPA entity — the generated `equals`/`hashCode`/`toString` touch every field including lazy relations, so putting the entity in a `HashSet` or logging it triggers loading or a `LazyInitializationException`; `@Data` is already covered on DTOs but not this entity-specific trap, which interviewers use as the "did you copy this from AI?" probe *(routed from the Architecture run, 2026-07-18)*
- The owning side of a bidirectional relationship — the side holding the foreign key (`@ManyToOne`, or the side without `mappedBy`) is the only one Hibernate reads when deciding what to persist, so setting only the `@OneToMany` side saves nothing and the developer sees a silent no-op; interviewers ask why the child was not saved *(routed from the Architecture run, 2026-07-18)*

- The OpenAPI document as the contract the frontend codes against — springdoc is already covered from the producer side, but not the consumer side: deriving the client's interfaces, endpoints, and response shapes from `/swagger-ui.html` rather than guessing, which is what a full-stack take-home actually exercises; interviewers ask how the Angular side knows the response shape before the backend is finished *(routed from the Angular run, 2026-07-18)*
