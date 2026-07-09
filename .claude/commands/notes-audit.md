---
description: Build or audit study notes for a topic or a single file (orchestrator, runs inside Claude Code)
argument-hint: SCOPE=folder|file TOPIC=<topic>|all [FILE=path] [DRY_RUN=true|false]
---

Read `notes/prompts/knowledge/notes/notes-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — execute them exactly (plan → one cold inspector per existing file → per-file author + cold reviewer subagents, en/es sync, atomic commit per file).
- If the configuration is empty or incomplete, ask for the missing config-block values before launching any subagent.
- If DRY_RUN was not given, default it to `true` so nothing commits until Victor has read the diff.
