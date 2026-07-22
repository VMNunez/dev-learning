---
description: Audit a practice track's PLANNING.md against the practice-plan standard (orchestrator, runs inside Claude Code)
argument-hint: TRACK=sql
---

Read `notes/prompts/practice/practice-plan-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — do not summarize it, execute it (evidence snapshot → four specialist subagents in order → history gate → single commit → pipeline self-report).
- If the user left the configuration empty, default to `TRACK = sql` — it is the only practice track with a plan today. If they name a track with no `practice/{track}/PLANNING.md`, say so and stop; this prompt never writes a plan from scratch.
- The exercise files are Victor's work and are never edited or staged by this flow, only the plan.
