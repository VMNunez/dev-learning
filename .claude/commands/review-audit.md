---
description: Code + correctness + security + tests review of a built project (orchestrator, runs inside Claude Code)
argument-hint: PROJECT_PATH=<path>|all
---

Read `notes/prompts/projects/review/review-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — execute them exactly (code-quality + learning-objectives subagent, and for full-stack the cold attacker-hat security subagent; merge findings into the backlog).
- This prompt is NOT auto-committed — it writes PROJECT-BACKLOG.md and hands Victor the commit (feature-branch workflow). Follow that.
- If the configuration is empty or incomplete, ask for the missing config-block values before launching any subagent.
