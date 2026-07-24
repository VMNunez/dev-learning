---
description: Keep ROADMAP.md forward-looking, gate-based, and in sync with coverage/PROGRESS (runs inside Codex)
argument-hint: (no args — global by design)
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/strategy/tracking/roadmap-review-prompt.md` and execute it in full as the orchestrator it describes, running inside Codex.

Extra input from the user (if any): $ARGUMENTS

Rules:
- Global by design — the doer applies edits, then a cold reviewer subagent re-verifies the invariants (date scan, LeetCode gate, study-block sync). Execute its instructions exactly.
