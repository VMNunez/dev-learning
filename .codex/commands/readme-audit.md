---
description: Review and fix a project's README(s) to the standard (orchestrator, runs inside Codex)
argument-hint: PROJECT_PATH=<path>|all
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/projects/readme/readme-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — execute them exactly (per-README author + cold reviewer subagents for global/backend/frontend).
- Commit behaviour is the prompt's and is read there, never from here: its **Auto-committed** note and `notes/prompts/projects/readme/_internal/_readme-standard.md` → "Summary + commit rule". Do not take a commit rule from this launcher.
- If the configuration is empty or incomplete, ask for the missing config-block values before launching any subagent.
