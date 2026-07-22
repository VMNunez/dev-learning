# SQL — mistake log

**What this is:** every concept that came back ⚠️ or ❌ in a `sql-exercises MODE = review` run, one
row each. Written by the prompt, never by hand during a session.

**Why it exists:** the grading run used to name the conceptual gaps in the chat and nothing kept
them. `PROGRESS.md` records what was learned; this file records what was *failed*, which is the
more useful list. It is the `FOCUS` source for every revision batch — see `PLANNING.md` §8b,
revision points **R1–R5**.

**How to read it:** open rows are still owed a re-drill. A row closes only when a later review run
scores its concept correct again — the closing run appends the date, it is never deleted.

- **Coverage section** is the heading from `notes/sql/coverage.md`, copied verbatim. It is what makes
  this file aggregable: it answers "which area do I actually fail?" instead of listing loose symptoms,
  and it lets a revision point derive its focus mechanically rather than by re-reading prose.
- **Times** is how often the concept has come back ⚠️/❌ across runs. A re-failure **increments this
  row** and updates *Last seen* — it never opens a second row for the same concept. This column is the
  priority order for a revision batch: highest first.
- **Sev** is the worst grade the concept has ever received (❌ outranks ⚠️).
- **Step** is the plan step the failed exercise belongs to, as a bare number. It is what makes a
  revision point executable: `TOPIC = R2` filters this table to steps 2–4, sorts by *Times*, and drills
  exactly those concepts. Write `4`, never `Step 4` or the step's name.

---

## Open

| Logged | Last seen | Times | Step | Coverage section | Concept | Sev | What went wrong | Exercises |
|--------|-----------|-------|------|------------------|---------|-----|-----------------|-----------|
| — | — | — | — | — | *(nothing yet — no review run has produced a ⚠️ or ❌)* | — | — | — |

## Closed — re-drilled and correct

| Logged | Closed | Times | Step | Coverage section | Concept |
|--------|--------|-------|------|------------------|---------|
| — | — | — | — | — | — |
