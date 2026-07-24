---
description: Reconcile PROGRESS.md with what each PLANNING.md declares (not the code — it never reads code) — one cold subagent per project, then merge (runs inside Codex)
argument-hint: (no args — global by design)
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/strategy/tracking/progress-update-prompt.md` and execute it in full as the orchestrator it describes, running inside Codex.

Extra input from the user (if any): $ARGUMENTS

Rules:
- Global by design — it fans out one cold subagent per project (+ SQL, + simulations) and merges into PROGRESS.md. Execute its instructions exactly, including the concept-extraction standard and commit rule.
- Run this before `/plan-audit` (new mode) so the gap analysis reads an accurate PROGRESS.md.
