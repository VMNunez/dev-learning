---
description: Global convergence pass for one coverage level (runs inside Codex)
argument-hint: LEVEL=junior|middle|senior MODE=update|dry-run
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/knowledge/coverage/coverage-audit-prompt.md` and execute it in full, running inside Codex.

Extra input from the user (if any): $ARGUMENTS

Rules:
- The prompt is global across topics for one selected level. Execute its market, level-boundary, ownership, and mirror checks. Execute its instructions exactly, including the job-market-evidence step and any new-topic-folder logic.
- Run first: this expects every topic to already have a coverage file for the selected level. If that is not true, say so before running.
