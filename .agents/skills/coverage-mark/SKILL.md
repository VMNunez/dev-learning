---
name: coverage-mark
description: >
  Mark a coverage bullet as demonstrated in project code, with the project's folder name, WHENEVER a concept
  has just been applied in a project — called by the `step-complete` and `backlog-task-close` rituals as
  their coverage sub-step, and directly when Victor asks ("marca esto como visto en el coverage", "esto
  ya lo hemos aplicado en el 07", "mark this bullet as covered"). It appends the
  `✅ NN-slug — {evidence}` marker to the matching bullet in both the topic coverage file and the global
  mirror — the project that proves it, and the one falsifiable clause saying what in that project proves
  it — so the level file doubles
  as a progress instrument: how much of the junior floor Victor can prove with something he built. The
  failure mode this exists for is a concept applied in a project that leaves no trace on the coverage
  checklist, so months later the file cannot distinguish "never studied" from "shipped it in project 06".
  Do NOT use it to add new bullets (that is `coverage-bullet-add`, or `/coverage`), to
  mark something merely studied in notes, or inside the `coverage` / `coverage-audit` pipelines — those
  passes preserve markers, they never author them.
---

# Coverage evidence marking

A concept was just **applied in project code**. This skill records that on the coverage checklist.

**Read `notes/prompts/knowledge/coverage/_internal/_coverage-standard.md`, section "Evidence markers",
and `_topic-ownership.md` before editing anything.** They own the marker's format, preservation
contract, and topic boundary.

This skill only ever *appends a marker to an existing bullet*. It never writes, rewords, or deletes a
bullet. If the concept has no bullet, that is `coverage-bullet-add`'s job (or `/coverage`) — say so and
stop; do not author scope here. The calling ritual runs that skill *before* this one, so a missing bullet at
this point usually means it was deliberately not authored.

---

## 1 — Establish what was demonstrated, and in which project

State in one sentence the concept and the project's folder name (`NN-slug`, e.g. `07-timetrack`, taken
from `projects/` verbatim). "Demonstrated" has one meaning: **Victor wrote code in that project that uses the concept**. All
of these are *not* demonstrations, and each must be reported as skipped rather than marked:

- the concept appears in a review finding, a backlog task, or a note, but no code was written;
- the concept was explained in session and Victor understood it;
- a **design decision with no code change** — nothing was built, so nothing is demonstrated;
- generated or scaffolded code Victor did not write (a Spring Initializr `application.properties`, an
  `ng generate` skeleton).

A backlog-task fix *is* code Victor wrote, so it does earn the marker.

## 2 — Find the bullet, in the right topic and level

Route the concept to its owning `notes/` topic with **`_topic-ownership.md`**. The test is **altitude, not subject
matter** — the same rule `coverage-bullet-add` applies.

**When a ritual called you — `backlog-task-close` or `step-complete`, either one — reuse the topic that
`coverage-bullet-add` reported in the same run rather than re-deriving it.** The bullet was authored
under that topic; re-deriving here is how a marker goes looking for a bullet in a topic that never
received it, and reports "no bullet exists" for one written minutes earlier.

If that topic's selected Coverage tracker cell has no completed run, stop: its files are scaffolding and
there is no calibrated bullet to mark. Route the concept through `coverage-bullet-add`; the first
`/coverage` run will move any existing adjacent bullet together with its marker.

Open `notes/{topic}/coverage/{junior|middle|senior}.md` for the level in question and grep for the
concept's key symbol, not the wording of the step or task. Then:

- **One clear match** — normal case, proceed.
- **No match** — the concept is not in coverage. Report it as unmarked and name it; the calling ritual's
  coverage step decides whether it is a genuine gap. Never invent the bullet to have something to mark.
- **Several plausible matches** — mark only the bullet whose *concept* the code demonstrates, not every
  bullet in the neighbourhood. A step that used `@Transactional` demonstrates declarative transaction
  boundaries; it does not demonstrate proxy-based annotation behaviour just because the same proxy is
  involved. When two bullets are genuinely both demonstrated, mark both and say so.
- **Already marked** — leave it alone and report the existing marker. First project wins; a later project
  reusing the concept never overwrites it, and this is the expected outcome for common concepts.

If the matching bullet was moved between topics or levels, the complete existing marker must already
have moved verbatim with it. Never remove and recreate the marker; report any mismatch as blocking drift.

Cross-level check: if the bullet lives at a level **above** the one Victor is working at, mark it there
anyway and say so — demonstrating a middle-level concept in a junior project is real evidence, and one of
the few honest signals about his trajectory.

## 3 — Write the evidence clause

The marker says *where*; the clause says **why that project is judged to demonstrate this bullet**. Read
the "Evidence markers" rules in `_coverage-standard.md` for the format; what this step owns is finding the
sentence.

Derive it from the **code**, not from the step or task that produced it. Name the concrete thing a reader
could open and check — the class, annotation, endpoint, query or mechanism:

| Bullet | Good clause | Why the bad one fails |
|---|---|---|
| Constructor injection | `every service takes its collaborators through a single constructor, no @Autowired field anywhere` | ~~`uses constructor injection`~~ — restates the bullet |
| Dynamic query composition | `Specification<TimeEntry> composes the four optional filters on GET /api/entries` | ~~`built dynamic queries`~~ — not checkable |
| Segregation of duties | `approve/reject refuse a manager whose id matches the entry's owner` | ~~`closed a backlog finding about self-approval`~~ — describes the session, not the code |

**If the only honest clause is a restatement of the bullet, stop and say so** rather than padding the
line: it means the code touched the concept without really demonstrating it, and that is worth telling
Victor. Marking it anyway with filler is how the level file stops meaning anything.

## 3b — Append the marker to both files

Append ` ✅ NN-slug — {evidence}` to the end of the bullet, after the concept sentence, nothing following
it. Verbatim identical edit in both:

1. `notes/{topic}/coverage/{LEVEL}.md` — the source of truth.
2. `notes/coverage/{LEVEL}.md` — the global mirror, inside `## {TOPIC}`, same bullet.

Change **nothing else on the line**. Do not rewrite the concept sentence to read better, do not fix a
typo you notice, do not convert the bullet to a checkbox. The bullet's text is another prompt's output;
your write is the marker and only the marker.

Then verify, because a marker landing in one file and not the other is the drift this skill would
otherwise introduce into a diff-verified pair: grep `✅` in the topic file and in the mirror's
`## {TOPIC}` section and confirm the two sets of marked bullets are identical. Report both counts.

## 4 — Update the PROGRESS.md coverage table

The `## Coverage demonstrated` table in `PROGRESS.md` is the instrument this marker feeds. A marker
written without refreshing it leaves the table reading lower than reality until the next
`progress-update` run — the same silent-staleness failure the marker itself exists to prevent.

**`progress-update-prompt.md` step D8 owns the table's format, its counting rule, and the `*`
provisional mark. Read D8 and follow it; never restate or re-derive its arithmetic here.** Your job is
narrower: refresh only the cells you just changed.

For each topic+level you marked, **recount — never increment**. Arithmetic on the old cell silently
inherits any error already in it:

```bash
grep -cE '^- ' notes/{topic}/coverage/{LEVEL}.md
grep -cE ' ✅ [0-9]{2}-[a-z0-9-]+' notes/{topic}/coverage/{LEVEL}.md
```

The marker pattern is deliberately **unanchored**: a marker written before 2026-08-01 ends the line, a
newer one is followed by its evidence clause, and both must count. Anchoring it with `$` would silently
count only the old ones and report a collapsed numerator.

Rewrite that one cell, then the level's `**Total**` cell (recount as the sum of the column's
numerators over the sum of its denominators — do not add your delta to the printed total). Change no
other row, and never touch `Professional level by topic`: a rising percentage is not a promotion, per
D7. If the topic has no row, the table predates that topic — say so and stop rather than inventing one.

Only the numerator moves here. If the same run also added a bullet, `coverage-bullet-add` moved the
denominator; one recount after both writes covers them together.

## 5 — Report

One row per concept, inside the calling ritual's report table when there is one:

| Concept | Topic / level | Result |
|---|---|---|
| declarative transaction boundaries | `spring` / junior | marked ✅ 07-timetrack — "every service write method carries `@Transactional`, reads `readOnly = true`" (topic + mirror, 24/139 marked) |
| proxy-based annotation behaviour | `spring` / junior | already marked ✅ 06-hr-portal — left as is, clause not backfilled |
| BOLA on the mutation endpoints | `security` / junior | not marked — no bullet exists yet, flagged as a possible gap |
| fail-fast manual checks | `spring-boot` / junior | not marked — DECISION, no code change |

Include the marked/total count for the level file you touched, and state the PROGRESS.md cell as it
now reads (`spring-boot / junior: 24/139 (17%)`). That number is the point of the whole mechanism, so
it belongs in every report.

## Commits

`notes/{topic}/coverage/*.md` and `notes/coverage/*.md` are `notes/` study files — covered by the standing
authorization, so **you commit them yourself**, on the active branch, `git status` immediately before the
`add` and before the `commit`. One atomic commit for the marking, separate from any commit that added a
new bullet in the same session:

```
docs(coverage): mark <concept> as demonstrated in project NN
```

`PROGRESS.md` goes **in that same commit** — the table edit is the same logical change as the marker,
and splitting them lets one land without the other.

When called from `step-complete` or `backlog-task-close`, fold this into that ritual's coverage commit
only if the same run also wrote the bullet; otherwise keep it separate. **Both rituals commit their own
doc files now** (authorized 2026-07-30 for `PROJECT-BACKLOG.md`, 2026-08-01 for `PLANNING.md` /
`PROGRESS.md` / `README.md`), so there is no longer any flow that hands coverage commits back to Victor
— the old "in-session `backlog-task-close` hands its commits over" carve-out is gone. His side is the
project code and `practice/`, and nothing this skill writes is either.

## Backfill

**Evidence clauses are never backfilled onto existing markers.** The clause entered the format on
2026-08-01; the ~495 markers written before it stay bare, and that is deliberate — reconstructing why
`01-todo-list` demonstrated a bullet months later invents a memory instead of recording one, and an
invented clause is worse than none because it looks equally checkable. A bare marker is old, not broken.
If a *new* marker lands on a bullet in a file full of bare ones, that is expected; do not "even them up".

Projects 01–07 predate this mechanism, so their demonstrations are unmarked. Do **not** backfill
opportunistically while closing a step — a partial backfill is worse than none, because a low count then
reads as a low-progress signal instead of an incomplete pass. Backfill is a deliberate, project-by-project
run: for one project, read its README "What I learned" and its PROGRESS.md entries, and mark what the code
actually demonstrates. If Victor has not asked for it, mention once that it is owed and move on.
