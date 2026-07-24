---
description: Global convergence pass for one coverage level (runs inside Claude Code)
argument-hint: LEVEL=junior|middle|senior
---

Read `notes/prompts/knowledge/coverage/coverage-audit-prompt.md` and execute it in full, running inside Claude Code.

Extra input from the user (if any): $ARGUMENTS

Rules:
- The prompt is global across topics for one selected level. Execute its market, level-boundary, ownership, and mirror checks.
- ▶ Run first: this expects every topic to already have a coverage file for the selected level. If that is not true, say so before running.
