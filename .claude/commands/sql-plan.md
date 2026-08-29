---
description: Plan the SQL exercise route for one level from its coverage file, without generating exercises
argument-hint: LEVEL=junior|middle|senior [MODE=update|dry-run]
---

Read `notes/prompts/practice/sql/sql-plan-prompt.md` and execute it in full inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- If the user left the configuration empty, default to `LEVEL = junior`, `MODE = update`.
- This command plans only. It never generates an exercise, never grades one, and never edits a `.sql`
  file — `sql-exercises` owns that.
- It writes `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` and, in a separate commit, `{LEVEL}`'s two
  `Exercise route` tables in `PROGRESS.md`. The only time it may touch
  `practice/sql/PLANNING.md` is the one-time doctrine/route migration the prompt describes; every other
  doctrine finding is reported for `sql-plan-audit`.
- The exercise files under `practice/sql/` are Victor's work: never edited, never staged.
- Never schedule, run or edit the SQL notes, interview Q&A or simulations.
