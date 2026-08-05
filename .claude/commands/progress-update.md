---
description: Audit PROGRESS.md against what each PLANNING.md declares (not the code — it never reads code) — writes the level matrix, reports drift everywhere else (runs inside Claude Code)
argument-hint: (no args — global by design)
---

Read `notes/prompts/strategy/tracking/progress-update-prompt.md` and execute it in full as the orchestrator it describes, running inside Claude Code.

Extra input from the user (if any): $ARGUMENTS

Rules:
- Global by design — it fans out one cold subagent per project (+ SQL, + simulations), then measures every section of PROGRESS.md against its sources. Execute its instructions exactly, including the concept-extraction standard and commit rule.
- **It writes exactly one section — `Professional level by topic`.** Every other section has its own writer and is reported as drift, never edited (demoted 2026-08-05, REC-039). An empty drift report is the good outcome.
- Run this before `/cv` and `/project-brief`, which read PROGRESS.md, and to close gate G6.
