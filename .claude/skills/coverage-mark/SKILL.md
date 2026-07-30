---
name: coverage-mark
description: >
  Mark a coverage bullet as demonstrated in project code, with the project number, WHENEVER a concept
  has just been applied in a project — called by the `step-complete` and `backlog-task-close` rituals as
  their coverage sub-step, and directly when Victor asks ("marca esto como visto en el coverage", "esto
  ya lo hemos aplicado en el 07", "mark this bullet as covered"). It appends the `✅ NN` evidence marker
  to the matching bullet in both the topic coverage file and the global mirror, so the level file doubles
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
before editing anything.** It only auto-loads inside the `/coverage` pipeline, and it owns the marker's
format and its preservation contract.

This skill only ever *appends a marker to an existing bullet*. It never writes, rewords, or deletes a
bullet. If the concept has no bullet, that is `coverage-bullet-add`'s job (or `/coverage`) — say so and
stop; do not author scope here. The calling ritual runs that skill *before* this one, so a missing bullet at
this point usually means it was deliberately not authored.

---

## 1 — Establish what was demonstrated, and in which project

State in one sentence the concept and the project number (`NN`, two digits, from the project folder
name). "Demonstrated" has one meaning: **Victor wrote code in that project that uses the concept**. All
of these are *not* demonstrations, and each must be reported as skipped rather than marked:

- the concept appears in a review finding, a backlog task, or a note, but no code was written;
- the concept was explained in session and Victor understood it;
- a **design decision with no code change** — nothing was built, so nothing is demonstrated;
- generated or scaffolded code Victor did not write (a Spring Initializr `application.properties`, an
  `ng generate` skeleton).

A backlog-task fix *is* code Victor wrote, so it does earn the marker.

## 2 — Find the bullet, in the right topic and level

Route the concept to its owning `notes/` topic with the **topic-ownership block in
`_coverage-standard.md`** ("Security owns threats and defences…"). The test is **altitude, not subject
matter** — the same rule `backlog-task-close` step 1 applies, and if that ritual is what called you, reuse
the topic it already determined rather than re-deriving it.

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

Cross-level check: if the bullet lives at a level **above** the one Victor is working at, mark it there
anyway and say so — demonstrating a middle-level concept in a junior project is real evidence, and one of
the few honest signals about his trajectory.

## 3 — Append the marker to both files

Append ` ✅ NN` to the end of the bullet, after the concept sentence, nothing following it. Verbatim
identical edit in both:

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
grep -cE ' ✅ [0-9]{2}$' notes/{topic}/coverage/{LEVEL}.md
```

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
| declarative transaction boundaries | `spring-boot` / junior | marked ✅ 07 (topic + mirror, 24/139 marked) |
| proxy-based annotation behaviour | `spring-boot` / junior | already marked ✅ 06 — left as is |
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
only if the same run also wrote the bullet; otherwise keep it separate. When the calling ritual hands
its commits to Victor rather than running them (the in-session `backlog-task-close` rule), hand this
one over too instead of committing behind it.

## Backfill

Projects 01–07 predate this mechanism, so their demonstrations are unmarked. Do **not** backfill
opportunistically while closing a step — a partial backfill is worse than none, because a low count then
reads as a low-progress signal instead of an incomplete pass. Backfill is a deliberate, project-by-project
run: for one project, read its README "What I learned" and its PROGRESS.md entries, and mark what the code
actually demonstrates. If Victor has not asked for it, mention once that it is owed and move on.
