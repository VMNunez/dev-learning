# Batch mode — run a prompt on every target at once

This file is **not a prompt**. Many prompts work on one target at a time — one topic, one
interview-prep file, one project, one type. To avoid running them by hand folder by folder, their
target field also accepts **`all`**. This file defines how `all` behaves, so every prompt does it
the same way. Each prompt links here and lists its own ordered targets under a "Batch targets" note.

---

## How to trigger it

In the configuration block, set the target field to `all` instead of a single value. The exact field
name depends on the prompt (it is named in each prompt's "Batch targets" note):

- coverage / notes → `TOPIC = all`
- interview-prep audit → `FILE = all`
- readme-audit / review-audit / portfolio-audit → `PROJECT_PATH = all`
- plan-audit (review mode only) → `PROJECT = all` (**review mode only** — new mode plans a single next project, so it stays one at a time)
- sql-exercises → `TOPIC = all` (**practice mode only** — review mode needs a pasted file, so it stays one at a time)
- simulation-generator / code-review → `TYPE = all`

Any second field tied to the target (e.g. `NOTES_PATH`, `PROJECT_TYPE`) is **ignored in `all` mode** —
derive it automatically per target from the prompt's "Batch targets" note. Do not ask.

---

## How `all` runs

1. Expand `all` into the ordered target list from the prompt's "Batch targets" note.
2. Run the prompt's **entire procedure once per target**, fully finishing one target — including its
   output and its commit — before starting the next.
3. Put each target's output under a clear `### [target name]` heading so the run is easy to follow.
4. Continue in order until every target is done, then print a final summary table:

   | Target | Result | Files changed |
   |--------|--------|---------------|
   | ... | ✅ / 🔧 / ➕ / no changes | ... |

---

## Commits

**One commit per target** — keep history atomic, exactly as the shared session rules requires. Never squash several
targets into one commit. Show all commit blocks together at the end, in order, each as its own
`git add` + `git commit` pair (one command per code block).

If a target needed no changes, say so and produce no commit for it.

---

## If the run gets too long

A full pass over every target can be large for a single conversation. Never leave a target
half-finished:

- Finish the target you are on completely, including its commit.
- Then stop and print:
  "Completed: [list]. Remaining: [list]. Re-run with the same configuration to continue —
  finished targets that need no changes will be reported as 'no changes' and skipped quickly."
- The next run resumes from the first unfinished target.

This makes `all` safe to run repeatedly: it is idempotent — a target already in good shape is a
fast no-op.
