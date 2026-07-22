---
description: Audit and extend practice/sql/PLANNING.md against the SQL plan standard (orchestrator, runs inside Claude Code)
argument-hint: SCOPE=full|extend
---

Read `notes/prompts/practice/sql/sql-plan-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — do not summarize it, execute it (evidence snapshot → specialist subagents in order → history gate → single commit → pipeline self-report).
- If the user left the configuration empty, default to `SCOPE = full`.
- The plan covers **exercises only**. Never schedule, run or edit the SQL notes, interview Q&A or simulations — Victor runs those separately with their own prompts.
- The exercise files under `practice/sql/` are Victor's work: never edited, never staged. Only `practice/sql/PLANNING.md` is committed.
