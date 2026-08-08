---
description: Explicit whole-system audit of prompts, skills, maps, writers, gates, and recorded debt (orchestrator, runs inside Codex)
argument-hint: (no args — global and on demand)
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/system/system-check-prompt.md` and execute it in full as the hands-off orchestrator it describes, running inside Codex.

Extra input from the user (if any): $ARGUMENTS

Rules:
- Run only when Victor explicitly invokes `/system-check`; never infer it from an ordinary commit or a `map-sync` event.
- It audits the full system, corrects only the two derived maps, writes its audit report, and routes machinery improvements to the recommendation ledger.
- It never edits prompts, skills, standards, project plans, backlogs, or recorded debt to make the audit pass.
- If the inventory or cold-review gates do not close, finish as `blocked` through the prompt's pipeline close-out; never publish a partial global verdict.
