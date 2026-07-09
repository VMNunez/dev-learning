---
description: Build or audit study notes for a topic or a single file (orchestrator, runs inside Claude Code)
argument-hint: SCOPE=folder|file TOPIC=<topic>|all [FILE=path]
---

Read `notes/prompts/knowledge/notes/notes-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — execute them exactly (plan → one cold inspector per existing file → per-file author + English/structure reviewer + en-blind Spanish reviewer subagents, en/es sync, atomic commit per file).
- If the configuration is empty or incomplete, ask for the missing config-block values before launching any subagent.
- The pipeline always commits — one atomic commit per file, made by the Spanish reviewer (the last stage).
