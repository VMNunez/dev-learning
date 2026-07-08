---
description: Keep ROADMAP.md forward-looking, gate-based, and in sync with coverage/PROGRESS (runs inside Claude Code)
argument-hint: (no args — global by design)
---

Read `notes/prompts/strategy/tracking/roadmap-review-prompt.md` and execute it in full as the orchestrator it describes, running inside Claude Code.

Extra input from the user (if any): $ARGUMENTS

Rules:
- Global by design — the doer applies edits, then a cold reviewer subagent re-verifies the invariants (date scan, LeetCode gate, study-block sync). Execute its instructions exactly.
