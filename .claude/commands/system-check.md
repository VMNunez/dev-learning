---
description: Explicit machinery audit of prompts, skills, launchers, validator, and both derived maps (orchestrator, runs inside Claude Code)
argument-hint: (no args — global and on demand)
---

Read `notes/prompts/system/system-check-prompt.md` and execute it in full as the hands-off orchestrator it describes, running inside Claude Code.

Extra input from the user (if any): $ARGUMENTS

Rules:
- Run only when Victor explicitly invokes `/system-check`; never infer it from an ordinary commit or a `map-sync` event.
- It audits the complete prompt-and-skill machinery, corrects only the two derived maps, writes its audit report, and routes machinery improvements to the recommendation ledger.
- Live project, learning, SQL, practice, application, tracker, and debt state is outside its inventory and can never block its verdict; path patterns and ownership contracts remain in scope.
- It never edits prompts, skills, standards, or live artifacts to make the audit pass.
- If the inventory or cold-review gates do not close, finish as `blocked` through the prompt's pipeline close-out; never publish a partial global verdict.
