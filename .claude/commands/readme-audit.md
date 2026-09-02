---
description: Review and fix a project's README(s) to the standard (orchestrator, runs inside Claude Code)
argument-hint: PROJECT_PATH=<path>|all
---

Read `notes/prompts/projects/readme/readme-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — execute them exactly, including which subagents it dispatches per README and in what order. Do not take that list from this launcher.
- Commit behaviour is the prompt's and is read there, never from here: its **Auto-committed** note and `notes/prompts/projects/readme/_internal/_readme-standard.md` → "Summary + commit rule". Do not take a commit rule from this launcher.
- If the configuration is empty or incomplete, ask for the missing config-block values before launching any subagent.
