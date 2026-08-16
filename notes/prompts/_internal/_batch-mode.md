# Batch mode — run a prompt on every target at once

This file is **not a prompt**. Many prompts work on one target at a time — one topic, one
interview-prep file, one project, one type. To avoid running them by hand folder by folder, their
target field also accepts **`all`**. This file defines how `all` behaves, so every prompt does it
the same way. Each prompt links here and states its own **ordered target list** beside its target
field; the heading varies by prompt (`## Batch targets`, an `## Order:` line, the target field's own
arrow, or — in `sql-exercises` — the topic order under its `TOPIC = all` validation bullet), and only
the list is required. Expand from that ordered list, never from the target field's enum:
`sql-exercises`'s `TOPIC` key also offers `R1`–`R5`, which are revision points and not batch targets.

---

## How to trigger it

In the configuration block, set the target field to `all` instead of a single value. The exact field
name depends on the prompt (it is the field the prompt's own target list is stated under):

- coverage / notes → `TOPIC = all`
- interview-prep audit → `FILE = all`
- readme-audit / review-audit / portfolio-audit → `PROJECT_PATH = all`
- plan-audit (review mode only) → `PROJECT = all` (**review mode only** — new mode plans a single next project, so it stays one at a time)
- sql-exercises → `TOPIC = all` (**practice mode only** — review mode needs a pasted file, so it stays one at a time)
- code-review → `TYPE = all` (`simulation-generator` takes no target field: its config is `LEVEL` +
  `STEP` and the route owns the order, so it is one at a time — `README.md` → "Batch mode" lists it
  under *One target only*)

Any second field tied to the target (e.g. `NOTES_PATH`, `PROJECT_TYPE`) is **ignored in `all` mode** —
derive it automatically per target from that list. Do not ask.

---

## How `all` runs

1. Expand `all` into the prompt's own ordered target list, as the note above locates it.
2. Run the prompt's **entire procedure once per target**, fully finishing one target — including its
   output and its commit — before starting the next. Every placeholder the procedure resolves from the
   target field (`{TYPE}`, `{FILE}`, `{TOPIC}`, `{PROJECT}`, `{PROJECT_PATH}`) binds to the **current
   member**, never to `all`; a path built from the literal `all` — `.../all.md` — is the symptom of
   having skipped step 1.
3. Put each target's output under a clear `### [target name]` heading so the run is easy to follow.
4. Continue in order until every target is done, then print a final summary table:

   | Target | Result | Files changed |
   |--------|--------|---------------|
   | ... | ✅ / 🔧 / ➕ / no changes | ... |

**The run-level close-out is not part of step 2's "entire procedure" and is not repeated per target.**
A batch run reads its last-run report **once, before the first target**, and writes **one** self-report
at the end, for the run. What that report and the tracker record then contain is owned by the two
contracts — `_pipeline-self-report.md` → "Update the run tracker" for orchestrators,
`_single-shot-self-report.md` → Step 2 for the single-shot prompts that accept `all`.

---

## Commits

**One commit per target** — keep history atomic, exactly as the shared session rules requires. Never squash several
targets into one commit.

That granularity binds every commit; **when it lands depends on who runs it.** A commit the run makes
itself lands with its target, before the next one starts (step 2 above). A commit the prompt **hands
to Victor** is one the run cannot make at all, so those blocks are collected and shown together at the
end, in target order, each as its own `git add` + `git commit` pair (one command per code block).

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
- That stop **is** this run's end: write the single self-report and the tracker record there, naming
  the finished targets and the remaining ones. A batch that stops early is still an invocation, and
  both self-report contracts require every invocation to leave a record.

This makes `all` safe to run repeatedly: it is idempotent — a target already in good shape is a
fast no-op.
