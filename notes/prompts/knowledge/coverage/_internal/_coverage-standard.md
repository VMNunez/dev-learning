# Coverage standard — levelled learning scope

This is the shared contract for `coverage-prompt.md` and `coverage-audit-prompt.md`.

## Artifact model

Every topic owns three non-overlapping scope files:

- `coverage/junior.md` — everything Victor must know to obtain and perform well in the current target junior or junior-mid role.
- `coverage/middle.md` — the next professional level: concepts expected once the junior foundation is complete and the developer works with growing autonomy.
- `coverage/senior.md` — concepts expected at senior level, including multi-team ownership, deep production diagnosis, platform concerns, and justified specialisation.

Three global mirrors — one per level — provide cross-topic analysis:

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

Coverage calibration is cumulative. A middle run treats junior as its prerequisite floor; a senior
run treats both junior and middle as prerequisite floors. The selected level remains the run's main
authoring target, but if that work exposes a genuine missing prerequisite in an earlier level, the run
adds it there instead of duplicating it at the selected level or merely reporting it. This is an
incidental prerequisite-integrity pass, not a substitute for running `coverage-prompt` and
`coverage-verify` explicitly for every level.

## Refined-note coverage lock

Coverage remains recalibratable only until Victor freezes the study material built from it. The lock
authority is the persistent notes plan:

- an exact bullet marked `[x]` under `Coverage concepts` in an entry with `Status: refined` is
  **locked**; a `[ ]` concept is only planned or pending append and is not locked yet;
- a locked bullet's **scope text** — the complete line with its trailing evidence marker stripped —
  never changes, nor may its section, topic, level, or order relative to the other locked bullets in
  that note; it is never deleted, merged, split, or routed;
- `Status: complete` is not a lock: it means the notes pipeline finished, but Victor has not declared
  the pair final. `pending` is not a lock either, even when the plan already assigns the bullet;
- therefore a bullet assigned to a planned note that has not been generated, or to any non-refined
  entry, may still move and the notes plan must be refreshed afterwards;
- new coverage may still be added after a note is refined. `notes-plan` assigns it as `[ ]` through
  that entry's `Pending additions`; Stage C changes it to `[x]` only after both languages contain it,
  and only then does it join the entry's already locked bullets;
- only Victor can remove the lock by changing the entry from `refined` back to `pending`.

Evidence metadata is the only allowed mutation: `coverage-mark` may append a new trailing
`✅ NN-slug — {evidence}` marker to a locked bullet, and every later coverage run preserves it under
the normal marker rules. That records project demonstration without changing the locked scope bytes.

Market or level calibration never overrides this study lock. If later evidence says a locked bullet
would now be placed elsewhere, report a **locked placement conflict** and leave the bullet exactly
where it is. Never create a duplicate at the preferred destination to simulate a move.

## The job target defines scope

`_shared-context.md` defines the target role, stack, market, and personal constraints.
`_job-market-evidence.md`, current live evidence, and the level definitions in this standard determine
which competencies that target requires.

`ROADMAP.md` is a downstream planning artifact. It may organise the order, timing, practice, and
demonstration of coverage, but its topic lists, phase tables, project ideas, and learning gates must
never add, remove, or raise a coverage requirement. The same boundary applies to notes, exercise
plans, project plans, and existing project code: they may provide examples or evidence that a concept
has been encountered, but their contents do not establish the professional-level floor.

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

One coverage-prompt execution processes exactly one topic with one selected level as its primary
target. It may correct sibling levels when classification or prerequisite-integrity findings require
it. `TOPIC = all` is not supported.

`_topic-ownership.md` is the boundary registry. Every topic must be registered before authoring, and
every full recalibration reads its row plus the coverage of its declared adjacent topics. The registry
does not define scope bullets; it prevents two topic files from claiming the same concept family.

A new topic is a schema change to the curriculum, not an empty folder. Admit it only with explicit user
authorization, an independently useful professional competency, an ownership statement, exclusions,
and a complete adjacent-topic set. Its first coverage run performs a boundary migration: classify the
relevant bullets in all three levels of every adjacent topic, keep one owner, preserve evidence markers,
and move rather than copy. Rebuilding only the new topic while leaving the old owners unchanged is an
invalid run.

Related topics remain independent. In particular:

- Angular and Angular Material always run separately.
- Security owns threats and defences; Angular/Spring/Spring Boot keep concrete framework integration.
- General owns neutral HTTP, JSON, testing vocabulary, configuration, and container awareness.
- Architecture owns framework-neutral boundaries and design decisions.
- SQL owns database behaviour; Spring Boot owns Spring Data/JPA and Boot datasource integration.
- Java owns language semantics; Spring owns core framework behaviour; Spring Boot owns Boot behaviour
  and concrete Boot-stack integration.
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

## Evidence markers

A coverage bullet may carry one trailing **evidence marker** recording the project where the concept
was first applied in code, **and what in that project demonstrates it**:

```
- Constructor injection — prefer it over field injection so dependencies are explicit, final, and easy to supply in tests ✅ 07-timetrack — every service takes its collaborators through a single constructor, no `@Autowired` field anywhere
```

Rules:

- **Format is exactly `✅ NN-slug — {evidence}`**, after the concept sentence and after the drill marker
  below if the bullet carries one,
  where `NN-slug` is the project's folder name under `projects/` verbatim — the two-digit number, a
  hyphen, and the kebab-case name (`07-timetrack`, `03-expense-tracker`). One marker per bullet, and the
  evidence clause is the last thing on the line. The number alone would be unreadable in a file scanned
  months later; the folder name is the identifier that already exists, so it never has to be invented or
  kept in sync with a second list of names.
- **The evidence clause names what the project actually built.** It answers *why this project is judged
  to demonstrate this bullet*, and its bar is **falsifiable**: a reader must be able to open the project
  and confirm or refute it. Name the class, annotation, endpoint or mechanism — `Specification<TimeEntry>
  composes the four optional filters`, not `uses specifications`. Roughly 8–20 words, present tense, no
  trailing period.
  - **Restating the bullet is the failure mode.** "uses constructor injection" adds nothing the bullet
    did not already say and the marker did not already imply; it lengthens the file without making it
    more checkable. If the only honest sentence available is a restatement, that is a signal the
    demonstration is thin — say so rather than padding the line.
  - **The evidence is the project's, not the session's.** It describes code that exists on disk, never
    the step or review that led to it: "closed a backlog finding" is not evidence.
  - It is written **once, by the project that first earns the marker**, and preserved verbatim
    afterwards under the same rules as the marker itself.
- **Markers written before 2026-08-01 carry no evidence clause**, and are valid without one — the clause
  was added to the format on that date and is not applied retroactively, because reconstructing why a
  project demonstrated a bullet months later invents a memory rather than recording one. A bare
  `✅ NN-slug — {evidence}` is therefore an *old* marker, never a malformed one. Every tool that reads markers must
  accept both forms; only newly written markers require the clause.
- **Applied in project code only.** The marker means Victor wrote code that uses the concept in that
  project. Studying the concept in `notes/` does not earn it, and neither does reading about it in a
  review finding. An unmarked bullet therefore means "not yet demonstrated", never "not yet studied".
- **First project wins.** The marker is never updated when a later project uses the same concept again;
  its purpose is to date the first demonstration.
- **The marker is state, not scope.** It is written by the `coverage-mark` skill from a completed step or
  a closed backlog task — never by a coverage authoring or audit pass, and never by hand while writing
  bullets. Both mirrors of a bullet carry the same marker (see below).
- **Preserve it verbatim when rewording.** A converging or reformulating pass may rewrite a bullet's
  concept sentence freely, but must carry the existing marker onto the rewritten bullet unchanged. A
  bullet whose concept survives in different words has not lost its demonstration. Dropping a marker
  silently destroys the only record of it — treat it exactly as seriously as the notes-plan coverage SHA.
- **Markers are not checkboxes.** The prohibition on `- [ ]` / `- [x]` bullets in *Item and file format*
  stands unchanged for coverage files; the marker is trailing text on a plain `- ` bullet. Persistent
  notes plans may wrap the exact bullet in `[ ]`/`[x]` delivery metadata, which is stripped before
  matching and never copied into coverage or its mirrors.
- A bullet may only be **removed** with its marker if the concept genuinely leaves the level. When a
  concept moves between levels or topics, the marker moves with it.

### The drill marker — `✅ sql:{file-slug}`

A second, narrower marker exists, and it answers a different question. The project marker above means
*Victor built something that uses this*. The **drill marker** means *Victor solved graded exercises on
this*, and it is written only by `sql-step-close`, only from exercises a cold grader scored:

```
- `LEFT JOIN` — returns all rows from the left table with `NULL` on the right when there is no match ✅ sql:03-joins ✅ 07-timetrack — the unassigned-entries report joins `time_entries` to `projects` and keeps the orphans
```

- **Format is exactly `✅ sql:{file-slug}`** — the exercise file's name under `practice/sql/{LEVEL}/`
  without the `.sql` extension. **No evidence clause**: the file is the evidence, and a reader can open
  it and find the graded exercises. Adding prose there would only restate the bullet.
- **It sits before the project marker**, immediately after the concept sentence. That order is forced by
  the project marker's free-text evidence clause — anything written after it is indistinguishable from
  it, to a reader and to the digest command below.
- **A bullet may carry both, one, or neither**, and the two never substitute for each other. Conflating
  them costs the file its only honest answer to "can I prove this with something I built?" — the whole
  reason markers exist.
- **Only a scored exercise marks.** Written or answered is not enough, and a `[Repaso]` exercise marks
  nothing (it drills ground already taken). A marker is never removed, and the first file wins.
- **Level-local.** A junior exercise marks a junior bullet. It never reaches up into `middle.md`.
- It is state, not scope: it obeys every rule above about preservation on reword and exclusion from the
  digest.

### Markers are excluded from the coverage digest

Four downstream prompts — `notes-plan`, `notes-audit`, `coverage-verify`, `interview-prep-audit` — store a
`Coverage SHA-256` over a coverage file to certify *which scope their output was mapped against*. Evidence
markers are not scope. If they entered the digest, every closed step would change the bytes and forge a
"the plan owes a remap" signal for work that has not moved an inch.

So the digest is computed over the file's **scope bytes**: the exact UTF-8 bytes of the file with every
trailing evidence marker removed — for each line, drop a trailing ` ✅ NN-slug — {evidence}` (the space, the mark, the
space, the project folder name) **together with its ` — {evidence}` clause when one is present**, and
nothing else. No other normalisation: no trimming, case folding, or reordering. Two files that differ
only in their markers therefore have the same digest, which is exactly the intent.

The evidence clause is stripped for the same reason the marker is: it records what a *project* built, so
it changes whenever a step or backlog task closes, while the curriculum's scope has not moved. Leaving it
in the digest would forge a "the plan owes a remap" signal on every close — and a signal that fires
without cause stops being read at all.

One canonical command, so every prompt produces the same digest for the same scope. The clause is
**optional** in the pattern, so pre-2026-08-01 bare markers strip identically and no stored digest is
invalidated by the format change:

```bash
sed -E 's/ ✅ [0-9]{2}-[a-z0-9-]+( — .*)?$//; s/ ✅ sql:[0-9]{2}-[a-z0-9-]+$//' notes/{topic}/coverage/{LEVEL}.md | sha256sum
```

**The two expressions run in that order and the order is load-bearing.** The project marker is stripped
first because its evidence clause is free text that would otherwise swallow anything to its left; only
once it is gone does a drill marker sit at end of line where the second expression can see it. Reversing
them leaves every bullet that carries both markers with its project marker intact in the digest.

Every prompt that computes or compares a coverage digest must use it, and any run that
reports a digest mismatch must state that it stripped markers first — otherwise a false mismatch and a
real one are indistinguishable in the report.

Because the markers make the level file a progress instrument as well as a scope file, an unmarked
majority is expected and correct: coverage is the hiring floor, and most of it is met by study and by
practice, not by project code. The count of marked bullets answers one specific question — how much of
the floor Victor can prove with something he built.

## Quality test

For each section verify:

- conceptual understanding: what mechanism is operating;
- decision quality: when and why to choose an approach;
- pressure resistance: common failure, edge case, or misleading alternative;
- factual accuracy against current primary documentation;
- correct topic and level ownership.

The final question is:

> If Victor mastered only this file, would he cover the realistic expectations of this topic at this level without studying the next level prematurely?
