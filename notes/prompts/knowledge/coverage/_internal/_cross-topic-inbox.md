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

Writing and consuming are two different populations, and each bullet below names its own:

- **Five writers, and the list is exhaustive.** Any coverage run that routes a gap to another topic —
  `coverage-prompt`, `coverage-audit`, the read-only `coverage-verify` gate — plus the inline
  `coverage-bullet-add` skill, plus a **by-hand** entry on a boundary change, which
  `_topic-ownership.md` mandates: until the changed topic and every adjacent topic have rerun, the
  affected topic/levels are recorded here as pending. That last one is not a coverage run, and it is a
  writer anyway. One bullet per concept, under that topic's heading, in the standard item format,
  tagged with the proposed level and source run. Writing here is not editing coverage: this file is a
  handoff, so a run forbidden to touch a coverage file may still file a proposal.
- **The owning topic's `coverage-prompt` run READS here**, and `coverage-audit` sweeps every heading:
  the pending entries under the run's own `## {TOPIC}` heading are treated as proposed items, judged
  against the standard exactly like any other proposed gap (they are not pre-approved — the owning run
  may still discard one as out of scope, and says so in its summary). Each of those two prompts owns
  which of its own steps performs the read; that is stated there and never restated here.
  `coverage-verify` is a writer only — it never consumes an entry.
- **A run that reads CLEARS what it consumed**: delete the entries it acted on, whether it added or
  discarded them, and say which in the summary. An entry left behind means it was not yet looked at.
  A run that only wrote here clears nothing.
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

- Spring MVC configuration extension — customise converters, argument resolvers, interceptors, and CORS without replacing useful framework defaults accidentally (proposed level: middle · source run: Spring junior first-run boundary migration, 2026-08-01)

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

## HTML

- Decorative vs informative images — an image whose information is already carried by adjacent text is decorative and takes `alt=""`, which gives it `role="presentation"` and removes it from the accessibility tree, whereas an *absent* `alt` leaves `role="img"` and lets the accessible name fall back to the `src` filename (proposed level: junior · source run: `backlog-task-close` on 02-weather-app, 2026-08-30). Routed to General on 2026-08-30 when no topic owned it, and moved here the same day when the HTML topic was admitted. Already applied in project code (`02-weather-app` gives both weather icons `alt=""` because the forecast and card templates render the description as adjacent text), so the run that authors the bullet leaves a `coverage-mark` evidence marker owed.

- Accessible name of a form control — a `<label for>` bound to the control's `id` is what names the field in the accessibility tree, while a `placeholder` is an example value that the accessible-name computation only reaches as a last resort and discards as soon as a higher-priority source exists, so a control whose only text is a placeholder is announced unnamed and loses even that hint once the user types (proposed level: junior · source run: `backlog-task-close` on 04-meal-finder, 2026-09-01). Already applied in project code (`04-meal-finder` names its search input with a `<label for="meal">` while keeping the placeholder as an example value), so the run that authors the bullet leaves a `coverage-mark` evidence marker owed.

- Visually hidden but announced — text meant only for assistive technology is removed from the visual layout while it stays in the accessibility tree, which `display: none` and `visibility: hidden` cannot do because they remove it from both; the pattern is a positioned one-pixel box that is clipped rather than sized to zero (proposed level: junior · source run: `backlog-task-close` on 04-meal-finder, 2026-09-01). Borders CSS, which already owns `display: none` vs `visibility: hidden` as a *layout* distinction (`css/junior.md:15`); the accessibility-tree consequence is what makes this HTML's, and the migration should decide whether the CSS bullet gains a cross-reference. Already applied in project code (`04-meal-finder` carries a `.visually-hidden` utility in `styles.css` used by the search label), so the run that authors the bullet leaves a `coverage-mark` evidence marker owed.

- **Pending boundary migration — HTML admitted 2026-08-30.** Until HTML's first `/coverage` run and a rerun of every adjacent topic complete, these topic/levels are recorded pending per `_topic-ownership.md`: `html` junior/middle/senior (never generated), and `css`, `angular`, `angular-material` and `general` at all three levels, whose bullets the migration must classify and **move** — never copy — with their evidence markers verbatim.
