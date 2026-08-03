---
description: Generate SQL exercises for the current plan step, or grade the ones you answered (runs inside Codex)
argument-hint: MODE=practice|review TOPIC=basics|joins|nulls|...  (LEVEL, COUNT and FILE optional — the plan supplies them)
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/practice/sql/sql-exercises-prompt.md` and execute it in full, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- The config is exactly five keys — `MODE`, `TOPIC`, `LEVEL`, `COUNT`, `FILE`. Do not accept or invent others: `FOCUS` and `REVIEW` are derived from the matching step in `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`, never pasted.
- Blank `LEVEL`/`COUNT`/`FILE` is the normal state — `LEVEL` defaults to `junior`, the rest resolve from the plan. Print what you derived and continue without asking.
- If `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` does not exist, stop and tell the user to run `/sql-plan {LEVEL}` first.
- A `Coverage SHA-256` mismatch against the coverage file is reported in one line and does **not** stop the run — it means `/sql-plan {LEVEL}` is owed, not that the batch is invalid.
- Read only the branch the resolved `MODE` names (`_sql-exercises-practice.md` or `_sql-exercises-review.md`), and only the `{TOPIC}` block of `_sql-exercise-seeds.md`.
- The exercise files are Victor's work: in `practice` mode append exercises, never rewrite his answers; in `review` mode write correction markers and `MISTAKES.md`, and give him the commit command rather than committing.
