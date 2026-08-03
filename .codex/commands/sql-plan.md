---
description: Plan the SQL exercise route for one level from its coverage file, without generating exercises (orchestrator, runs inside Codex)
argument-hint: LEVEL=junior|middle|senior [MODE=update|dry-run]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/practice/sql/sql-plan-prompt.md` and execute it in full, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- If the user left the configuration empty, default to `LEVEL = junior`, `MODE = update`.
- This command plans only. It never generates an exercise, never grades one, and never edits a `.sql`
  file — `sql-exercises` owns that.
- It writes `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`. The only time it may touch
  `practice/sql/PLANNING.md` is the one-time doctrine/route migration the prompt describes; every other
  doctrine finding is reported for `sql-plan-audit`.
- The exercise files under `practice/sql/` are Victor's work: never edited, never staged.
- Never schedule, run or edit the SQL notes, interview Q&A or simulations.
