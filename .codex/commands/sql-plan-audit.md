---
description: Audit and extend the SQL exercise plan — doctrine + one level's route — against the SQL plan standard (orchestrator, runs inside Codex)
argument-hint: SCOPE=full|extend LEVEL=junior|middle|senior
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/practice/sql/sql-plan-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — do not summarize it, execute it (evidence snapshot → specialist subagents in order → history gate → single commit → pipeline self-report).
- If the user left the configuration empty, default to `SCOPE = full`, `LEVEL = junior`.
- If `practice/sql/PLANNING-{LEVEL}.md` does not exist, stop and tell the user to run `/sql-plan {LEVEL}` first. This prompt audits and extends; it never writes a route from nothing.
- The plan covers **exercises only**. Never schedule, run or edit the SQL notes, interview Q&A or simulations — Victor runs those separately with their own prompts.
- The exercise files under `practice/sql/` are Victor's work: never edited, never staged. Only `practice/sql/PLANNING.md` and `practice/sql/PLANNING-{LEVEL}.md` are committed.
