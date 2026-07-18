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

- A CORS-blocked request reports no status code — the browser surfaces a rejected preflight as a generic network error with `status 0`, not the real backend status, so the Network tab shows a failure that looks nothing like the 401 or 500 the server actually sent; interviewers ask why the error has no status and expect you to distinguish a CORS block from an auth failure. Security already owns CORS and the `OPTIONS` preflight, but not this symptom *(routed from the Angular run, 2026-07-18)*

## Spring Boot

- The OpenAPI document as the contract the frontend codes against — springdoc is already covered from the producer side, but not the consumer side: deriving the client's interfaces, endpoints, and response shapes from `/swagger-ui.html` rather than guessing, which is what a full-stack take-home actually exercises; interviewers ask how the Angular side knows the response shape before the backend is finished *(routed from the Angular run, 2026-07-18)*
