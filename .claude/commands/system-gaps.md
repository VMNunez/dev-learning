---
description: Detect and register what the machinery does not cover, from the two derived maps alone (orchestrator, runs inside Claude Code)
argument-hint: [MODE=update|dry-run] (default update)
---

Read `notes/prompts/system/system-gaps-prompt.md` and execute it in full as the hands-off orchestrator it describes, running inside Claude Code.

Extra input from the user (if any): $ARGUMENTS

Rules:
- Run only when Victor explicitly invokes `/system-gaps`; never infer it from a commit, a `map-sync` event, or a `/system-check` run.
- Its evidence is the prompt catalogue (`README.md`) and the wiring map (`_internal/_system-map.md`), read whole, plus the recommendation ledger and its own previous report for deduplication and continuity. No prompt, skill, standard, launcher, validator or live artifact is ever opened — not even the one file a finding is about.
- It corrects nothing. A finding that turns out to be a map defect is routed to `/system-check` or `map-sync`, never repaired here.
- A finding resting on absence names both branches — the machinery lacks it, or the maps failed to record it — and the one file that would settle it. Stating one branch as fact is the failure this prompt is built to avoid.
- At most five ledger rows per run; everything else stays in the durable report and keeps its rank for the next run. `MODE = dry-run` writes the report and touches no ledger row.
- If the cold reviewer cannot be dispatched or rejects, finish as `blocked` through the prompt's pipeline close-out; write the report, create no ledger row.
