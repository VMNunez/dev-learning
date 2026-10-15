---
description: Explicit machinery audit of prompts, skills, launchers, validator, and both derived maps, one flow per run (orchestrator, runs inside Codex)
argument-hint: [FLOW=next|knowledge|projects|practice|strategy|system|cross] (default next; one flow per run, on demand)
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/system/system-check-prompt.md` and execute it in full as the hands-off orchestrator it describes, running inside Codex.

Extra input from the user (if any): $ARGUMENTS

Rules:
- Run only when Victor explicitly invokes `/system-check`; never infer it from an ordinary commit or a `map-sync` event.
- One flow per run. Default `FLOW = next` audits the first flow that is not fresh; naming a flow audits that one. The prompt's `## Freshness and the record` section owns what fresh means and where each flow's record lives.
- It corrects only the two derived maps, writes its flow's report, and routes machinery defects to the recommendation ledger, per the prompt's Steps 5 and 6.
- Live project, learning, SQL, practice, application, tracker, and debt state is outside its inventory and can never block its verdict; path patterns and ownership contracts remain in scope.
- It never edits prompts, skills, standards, or live artifacts to make the audit pass.
- If a gate does not close, finish as `blocked` through the prompt's pipeline close-out; never publish a partial verdict for the flow.
