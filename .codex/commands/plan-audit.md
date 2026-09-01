---
description: Plan the next project or audit an existing PLANNING.md (orchestrator, runs inside Codex)
argument-hint: MODE=new|review [PROJECT=path|all (review only; leave blank for new)]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/projects/plan/plan-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — do not summarize it, execute it (author → architecture advisor → reviewer subagents, commit rules, batch mode, etc.).
- In `new` mode `PROJECT` must be blank because Phase 0 reads the brief; in `review` mode `PROJECT` is required as a project folder path or `all`.
- If the user left the configuration empty or incomplete, ask for the missing config-block values before launching any subagent.
- The orchestrator takes no `DRY_RUN` — it was retired 2026-07-16. If Victor passes one, say it no longer exists and proceed; the prompt owns its own commit and gate rules.
