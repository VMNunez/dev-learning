---
description: Rebuild PROGRESS.md from reality — one cold subagent per project, then merge (runs inside Claude Code)
argument-hint: (no args — global by design)
---

Read `notes/prompts/strategy/tracking/progress-update-prompt.md` and execute it in full as the orchestrator it describes, running inside Claude Code.

Extra input from the user (if any): $ARGUMENTS

Rules:
- Global by design — it fans out one cold subagent per project (+ SQL, + simulations) and merges into PROGRESS.md. Execute its instructions exactly, including the concept-extraction standard and commit rule.
- Run this before `/plan-audit` (new mode) so the gap analysis reads an accurate PROGRESS.md.
