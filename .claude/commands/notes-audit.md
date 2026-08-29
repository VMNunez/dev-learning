---
description: Build or audit exactly one planned study note (orchestrator, runs inside Claude Code)
argument-hint: TOPIC=<topic> LEVEL=junior|middle|senior NOTE=01
---

Read `notes/prompts/knowledge/notes/notes-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- Resolve exactly one current persistent-plan entry and run its four-stage chain.
- If the configuration is empty or incomplete, ask for the missing config-block values before launching any subagent.
- Never accept an arbitrary file path or a folder/all run.
