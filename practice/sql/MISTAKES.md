# SQL — mistake log

**What this is:** every concept that came back ⚠️ or ❌ in a `sql-exercises MODE = review` run, one
row each. Written by the prompt, never by hand during a session.

**Why it exists:** the grading run used to name the conceptual gaps in the chat and nothing kept
them. `PROGRESS.md` records what was learned; this file records what was *failed*, which is the
more useful list. It is the `FOCUS` source for every revision batch — see `PLANNING.md` §8b,
revision points **R1–R5**.

**How to read it:** open rows are still owed a re-drill. A row closes only when a later review run
scores its concept correct again — the closing run appends the date, it is never deleted.

- **Coverage section** is the heading from `notes/sql/coverage/{LEVEL}.md`, copied verbatim. It is what makes
  this file aggregable: it answers "which area do I actually fail?" instead of listing loose symptoms,
  and it lets a revision point derive its focus mechanically rather than by re-reading prose.
- **Times** is how often the concept has come back ⚠️/❌ across runs. A re-failure **increments this
  row** and updates *Last seen* — it never opens a second row for the same concept. This column is the
  priority order for a revision batch: highest first.
- **Sev** is the worst grade the concept has ever received (❌ outranks ⚠️).
- **Step** is the plan step the failed exercise belongs to, **qualified by its level**: `junior:4`.
  It is what makes a revision point executable: `TOPIC = R2` filters this table to its span, sorts by
  *Times*, and drills exactly those concepts. Write `junior:4` — never `4`, never `Step 4`, never the
  step's name. The level prefix is not decoration: step numbers restart at 0 in every level and the
  spans R1–R5 are the route's, so a bare `4` would let a middle revision point silently drag in a
  junior row (and vice versa). A filter that matches on the number alone is wrong even while only one
  level exists.

**One file, all levels — on purpose.** The temptation is a `MISTAKES-{LEVEL}.md` per level, and it
would destroy the only thing this file contributes. A concept failed at junior and failed again at
middle must *increment its row*, not open a second one somewhere else: `Times` across levels is the
signal that separates "flojo aquel día" from "esto se te resiste de verdad". Length is not a reason to
split — `## Open` drains itself as rows close, and `## Closed` holds one row per concept, not per run.

---

## Open

| Logged | Last seen | Times | Step | Coverage section | Concept | Sev | What went wrong | Exercises |
|--------|-----------|-------|------|------------------|---------|-----|-----------------|-----------|
| — | — | — | — | — | *(nothing yet — no review run has produced a ⚠️ or ❌)* | — | — | — |

## Closed — re-drilled and correct

| Logged | Closed | Times | Step | Coverage section | Concept |
|--------|--------|-------|------|------------------|---------|
| — | — | — | — | — | — |
