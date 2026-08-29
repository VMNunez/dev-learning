---
description: Code + correctness + security + tests review of a built project (orchestrator, runs inside Claude Code)
argument-hint: PROJECT_PATH=<path>|all [REVIEW_SCOPE=full|backend|frontend]
---

Read `notes/prompts/projects/review/review-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — execute them exactly (one flow reviewer per vertical slice, one security reviewer per backend slice, the per-tier consistency pass and the learning-objectives pass; merge every slice's findings into the backlog).
- It commits PROJECT-BACKLOG.md itself, as a docs commit on the active branch, separate from the self-report commit — the file is written by the pipeline, never by Victor. Follow that.
- If the configuration is empty or incomplete, ask for the missing config-block values before launching any subagent.
