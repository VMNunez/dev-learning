---
description: Plan the next project or audit an existing PLANNING.md (orchestrator, runs inside Claude Code)
argument-hint: MODE=new|review [PROJECT=path|all] [DRY_RUN=true|false]
---

Read `notes/prompts/projects/plan/plan-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — do not summarize it, execute it (author → architecture advisor → reviewer subagents, commit rules, batch mode, etc.).
- If the user left the configuration empty or incomplete, ask for the missing config-block values before launching any subagent.
- If DRY_RUN was not given, default it to `true` on a first run so Victor can read the diff before it commits.
