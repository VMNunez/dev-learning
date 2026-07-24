---
description: Global convergence + market-fit pass over all of notes/coverage.md (runs inside Codex)
argument-hint: (no args — global by design)
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/knowledge/coverage/coverage-audit-prompt.md` and execute it in full, running inside Codex.

Extra input from the user (if any): $ARGUMENTS

Rules:
- The prompt is global by design — it sweeps every topic coverage file and runs the market-fit check. Execute its instructions exactly, including the job-market-evidence step and any new-topic-folder logic.
- ▶ Run first: this expects every topic to already have a coverage file. If that is not true, say so before running.
