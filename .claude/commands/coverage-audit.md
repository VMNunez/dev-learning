---
description: Global convergence + market-fit pass over all of notes/coverage.md (runs inside Claude Code)
argument-hint: (no args — global by design)
---

Read `notes/prompts/knowledge/coverage/coverage-audit-prompt.md` and execute it in full, running inside Claude Code.

Extra input from the user (if any): $ARGUMENTS

Rules:
- The prompt is global by design — it sweeps every topic coverage file and runs the market-fit check. Execute its instructions exactly, including the job-market-evidence step and any new-topic-folder logic.
- ▶ Run first: this expects every topic to already have a coverage file. If that is not true, say so before running.
