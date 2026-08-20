---
description: Explicit machinery audit of prompts, skills, launchers, validator, and both derived maps (orchestrator, runs inside Codex)
argument-hint: [MODE=full|carry-forward] (default carry-forward; global and on demand)
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/system/system-check-prompt.md` and execute it in full as the hands-off orchestrator it describes, running inside Codex.

Extra input from the user (if any): $ARGUMENTS

Rules:
- Run only when Victor explicitly invokes `/system-check`; never infer it from an ordinary commit or a `map-sync` event.
- Default `MODE = carry-forward`: reuse the last `Status: complete` run's accepted evidence for every concern whose own inputs are byte-identical, derive the rest cold, and degrade to `full` when no complete run exists. `MODE = full` derives everything in this run. Neither mode narrows the inventory or the verdict.
- It audits the complete prompt-and-skill machinery, corrects only the two derived maps, writes its audit report, and routes machinery improvements — and every source contradiction it proves, blocked or not, unless a reviewer `reject` or a validator reversal withholds it — to the recommendation ledger.
- Live project, learning, SQL, practice, application, tracker, and debt state is outside its inventory and can never block its verdict; path patterns and ownership contracts remain in scope.
- It never edits prompts, skills, standards, or live artifacts to make the audit pass.
- If the inventory or cold-review gates do not close, finish as `blocked` through the prompt's pipeline close-out; never publish a partial global verdict.
