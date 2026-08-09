---
description: Generate SQL exercises, use the legacy grading path, or append a [Repaso] batch (runs inside Claude Code)
argument-hint: MODE=practice|review|reinforce TOPIC=R1|R2|R3|R4|R5|basics|joins|group-by|join-pitfalls|nulls|subqueries|ctes|dates-strings|window-functions|dml|transactions|schema-design|normalization|data-types|ddl|indexes|live-database|report-queries|all [LEVEL=junior|middle|senior] [COUNT=N] [FILE=path]
---

Read `notes/prompts/practice/sql/sql-exercises-prompt.md` and execute it in full, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- The config is exactly five keys — `MODE`, `TOPIC`, `LEVEL`, `COUNT`, `FILE`. Do not accept or invent others: `FOCUS` and `REVIEW` are derived from the matching step in `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`, never pasted.
- Blank `LEVEL`/`COUNT`/`FILE` is the normal state — `LEVEL` defaults to `junior`, the rest resolve from the plan. Print what you derived and continue without asking.
- Exceptions: `reinforce` requires `FILE`; `TOPIC=all` is practice-only; an explicit `COUNT` that is not a positive integer or is below 4 normalizes to 4.
- If `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` does not exist, stop and tell the user to run `/sql-plan {LEVEL}` first.
- A `Coverage SHA-256` mismatch against the coverage file is reported in one line and does **not** stop the run — it means `/sql-plan {LEVEL}` is owed, not that the batch is invalid.
- Read `_sql-exercises-practice.md` for `practice` or `reinforce`, and `_sql-exercises-review.md` for `review`; read only the `{TOPIC}` block of `_sql-exercise-seeds.md`.
- The exercise files are Victor's work: in `practice`/`reinforce` append exercises, never rewrite his answers; in `review` write correction markers and `MISTAKES.md`, and give him the commit command rather than committing.
- **Grading has its own door now: the `sql-grade` skill** (say "corrige el 02"), which runs the review branch in a cold subagent and hands off to `sql-step-close`. `MODE = review` here is the legacy path — it grades correctly but closes nothing. If the user passes it, run it and say so in one line.
