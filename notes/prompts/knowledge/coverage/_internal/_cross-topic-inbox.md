# Cross-topic inbox — coverage gaps routed between topics

**Internal component. Not runnable.** This file is the durable handoff between coverage runs.

A run on topic X regularly surfaces a genuine gap that belongs to topic Y (a JUnit concept found while
running Java, an Angular template-compiler concept found while running TypeScript). The run correctly
declines to write it into X's file — but before this file existed, the routing was recorded only in the
run's chat summary, which nobody reads later. The item then depended on Y's own future run
independently rediscovering it.

**That is not hypothetical.** The TypeScript run (2026-07-18) routed four Angular-owned concepts out;
Angular's own coverage run had already happened that same day and had *not* found them. Nothing in the
pipeline would have caught it: `coverage-audit`'s analysts read the level mirror
(`notes/coverage/{LEVEL}.md`) for duplicates, misplaced items and cross-level moves, so a concept
**absent from every section** is invisible to them.

## Contract

- **A run WRITES here** whenever it routes a gap to another topic — one bullet per concept, under that
  topic's heading, in the standard item format, tagged with the proposed level and source run.
- **A run READS here** at Step 1: the pending entries under its own `## {TOPIC}` heading are treated as
  proposed items, judged against the standard exactly like any other proposed gap (they are not
  pre-approved — the owning run may still discard one as out of scope, and says so in its summary).
- **A run CLEARS what it consumed**: delete the entries it acted on, whether it added or discarded them,
  and say which in the summary. An entry left behind means it was not yet looked at.
- An empty heading (or no heading for a topic) means nothing is pending — that is the normal state.

Entries are proposals, not commitments. This file is never a second source of truth for scope: the job
is still the source, and the owning topic's three level files remain its only scope sources of truth.

---

*(No entries pending. The four Angular items routed from the TypeScript run on 2026-07-18 were consumed by the Angular coverage run the same day — all four added to `notes/angular/coverage/junior.md`.)*

## Angular

*(Empty — the two items routed from the CSS run on 2026-07-19 were both consumed and added by the coverage-audit run on 2026-07-19: `styleUrls` vs inline `styles` and the production-build-only style problem, both in the "Component styles" section.)*

## Angular Material

*(Empty — the Angular CDK proposal routed from the Angular junior coverage run on 2026-07-29 was consumed by the Angular Material junior recalibration on 2026-07-29 and accepted as already represented in Angular Material middle.)*

## Spring Boot

*(Empty — all 12 entries were consumed by the coverage-audit run on 2026-07-19. **Nine were added**: Lombok `@Data` on an entity, the owning side, the OpenAPI consumer view, the filter exception escaping `@RestControllerAdvice`, the JWT exception taxonomy, `DelegatingPasswordEncoder`/`{bcrypt}`, anonymous authentication not being null, the `doFilter` control-flow rule, and the preflight `OPTIONS` 401. **Three were discarded as already covered**: the singleton/stateless data-leak consequence is already the explicit gotcha on the "Bean scope and the singleton default" item, the JDBC URL anatomy is already carried by the datasource-properties item, and the three-way `Connection refused` discrimination is already spelled out in the Hikari pool-initialization item.)*

## Java

- Lombok as an annotation processor (proposed level: junior · source run: Spring Boot junior coverage-verify, 2026-07-27) — Lombok generates accessors, constructors, and `equals`/`hashCode` at compile time rather than at runtime, so the methods exist in the compiled class but never in the source file, and a build with annotation processing disabled or the processor missing from the build fails with `cannot find symbol` on every generated method. Absent from all three Java level files: `middle.md` owns designing annotation contracts and `senior.md` owns writing processors, so the *user* side of the mechanism is unowned at junior. Spring Boot junior deliberately keeps only Lombok's Spring-specific interactions (`@RequiredArgsConstructor` injection, generated entity `equals`, generated entity `toString`); per the standard, Java owns language semantics and generic build mechanics, and Java junior's "Maven fundamentals" section already declares that scope. Note: Java junior currently carries `Verdict: complete` — accepting this item invalidates that verdict and requires a fresh coverage-verify run.

## Security

- **From Git junior coverage recalibration (2026-07-30):** classify the response to a credential committed in repository history, including rotation or revocation after exposure; Git owns the fact that deleting or ignoring the current file does not erase existing commits, while Security owns credential invalidation and incident response.

*(Empty — all three entries routed from the General run on 2026-07-19 were consumed by the coverage-audit run the same day and **all three discarded as already covered**: the CORS section already opens with the scheme+host+port definition of an origin, already names the `Authorization` header and a JSON content type as what triggers the preflight, and already carries "CORS is not authorisation" verbatim along with the Postman-versus-browser framing. The General run routed items Security already had.)*

## Git

*(Empty — the three items routed from the General run on 2026-07-19 were all consumed and added by the Git coverage run the same day.)*

## General

*(Empty — the three proposals were consumed by the General junior full recalibration on 2026-07-30: framework-specific Jackson and TestBed ownership was removed, while neutral serialization, test structure, setup, and meaningful assertions were retained or added.)*

## JavaScript

*(Empty — the Promise/Observable ownership proposal routed from the Angular junior run on 2026-07-29 was consumed by the JavaScript junior recalibration on 2026-07-29; JavaScript now owns Promise semantics only, while Angular retains Observable/RxJS integration.)*

## TypeScript

*(Empty — the barrel re-export proposal routed from the JavaScript junior run on 2026-07-29 was consumed and accepted by the TypeScript junior recalibration on 2026-07-29.)*
