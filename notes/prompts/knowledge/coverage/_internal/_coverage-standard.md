# Coverage standard — levelled learning scope

This is the shared contract for `coverage-prompt.md` and `coverage-audit-prompt.md`.

## Artifact model

Every topic owns three non-overlapping scope files:

- `coverage/junior.md` — everything Victor must know to obtain and perform well in the current target junior or junior-mid role.
- `coverage/middle.md` — the next professional level: concepts expected once the junior foundation is complete and the developer works with growing autonomy.
- `coverage/senior.md` — concepts expected at senior level, including multi-team ownership, deep production diagnosis, platform concerns, and justified specialisation.

Two global mirrors provide cross-topic analysis:

- `notes/coverage/junior.md`
- `notes/coverage/middle.md`
- `notes/coverage/senior.md`

The mirrors are generated artifacts. Topic files are the sources of truth.

## Progression gate

Levels are sequential:

1. Build, study, practise, and consolidate the junior level.
2. Start middle material only after junior notes and interview preparation cover every junior item and practical checks show that Victor can explain and apply them without assistance.
3. Start senior material only after the middle level is consolidated or a real job responsibility makes it immediately relevant.

The gate controls study order, not file existence. Middle coverage may be mapped in advance so the progression is visible, but downstream middle authoring must not become active while the junior gate is open.

## The job target defines scope

Read `ROADMAP.md` and `_shared-context.md` before making scope decisions. Current examples such as “Angular + Spring Boot”, named consultancies, or a target date are illustrations only; the source files win whenever the target changes.

Use two evidence sources:

1. A deep analysis of current screenings, practical tests, maintained codebases, and day-to-day expectations for the target level. Use live web evidence when available.
2. `_job-market-evidence.md` as corroboration and frequency signal. Its junior postings can raise the junior floor. Its `## Techo` section may inform middle or senior placement but can never raise the junior floor.

Sparse evidence never proves that a fundamental is unnecessary.

## Level definitions

### Junior

Include a concept when its absence would materially weaken Victor's candidacy or early job performance:

- recurring requirement in target junior postings;
- ordinary framework/language mechanism needed to read and write common code;
- standard screening, take-home, debugging, or code-review filter;
- important confusable pair that exposes shallow understanding;
- inexpensive practical differentiator such as meaningful unit testing;
- maintained-code recognition required on day one at a consultancy.

Do not require production-scale ownership, specialist tuning, framework internals, or distributed-system design.

### Middle

Include a concept when it normally becomes expected from a developer with autonomy beyond assigned junior tasks:

- owns a feature or service boundary end to end;
- diagnoses production behaviour rather than only implementing the happy path;
- designs reusable APIs, shared state, integration boundaries, or testing strategy;
- evaluates trade-offs across several valid approaches;
- handles performance, resilience, security, or maintainability at application/team scale;
- reviews junior work and prevents recurring design defects.

Do not import senior organisational architecture, platform ownership, deep internals, or rare specialisation.

### Senior

Include when the responsibility normally requires senior-level ownership:

- multi-team or organisational architecture;
- specialist performance, runtime, database, security, or compiler work;
- experimental or emerging APIs not yet a realistic level requirement;
- infrastructure/product-specific tools learned when a real role requires them;
- concepts whose value depends on production scale and responsibility beyond middle autonomy.

## No numeric budgets

There is no minimum, target, or maximum item count.

Item count is an outcome of evidence and level calibration, never a quota or brake. A correct topic may contain 20, 50, 100, or 200 items.

Stop only when all conditions hold:

1. every recurring market requirement for the selected level maps to an item;
2. ordinary fundamentals, practical decisions, pressure cases, and important confusable pairs are covered;
3. every retained item belongs to this topic and this level;
4. a fresh adversarial pass finds only duplicates, another topic's ownership, another level, or unjustified specialisation.

Never use “could an interviewer ask this?”; that criterion is unbounded. Use “would not knowing this materially weaken performance at the selected level?”

## Topic isolation

One coverage-prompt execution processes exactly one topic and one level. `TOPIC = all` is not supported.

Related topics remain independent. In particular:

- Angular and Angular Material always run separately.
- Security owns threats and defences; Angular/Spring Boot keep concrete client/server integration.
- General owns neutral HTTP, JSON, testing vocabulary, configuration, and container awareness.
- Architecture owns framework-neutral boundaries and design decisions.
- SQL owns database behaviour; Spring Boot owns JPA/Spring implementation.
- Java owns language semantics; Spring Boot owns framework behaviour.
- JavaScript owns Promise semantics; Angular owns Observable/RxJS integration.
- CSS owns cascade and layout; Angular Material owns Material APIs, overlays, tokens, and components.

When a run discovers another topic's concept, route a proposal to `_cross-topic-inbox.md`; never author it in the current topic.

## Item and file format

- One independently studyable concept per bullet.
- Comparisons may name both sides when the comparison itself is the concept.
- Format: `concept — one concise sentence naming the practical decision, mechanism, or level signal`.
- Plain `- ` bullets; no checkboxes, numbered lists, or fenced code.
- Functional section names.
- Split a section when it becomes difficult to scan; merge sections that do not represent a useful concern. Do not use numeric section-size rules.
- Order by filtering/competency risk within the selected level.
- No conduct, storytelling scripts, ticket workflow, or generic interview behaviour.
- No concept may appear in more than one of `coverage/junior.md`, `coverage/middle.md`, and `coverage/senior.md`.

## Quality test

For each section verify:

- conceptual understanding: what mechanism is operating;
- decision quality: when and why to choose an approach;
- pressure resistance: common failure, edge case, or misleading alternative;
- factual accuracy against current primary documentation;
- correct topic and level ownership.

The final question is:

> If Victor mastered only this file, would he cover the realistic expectations of this topic at this level without studying the next level prematurely?
