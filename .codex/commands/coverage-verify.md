---
description: Verify a generated coverage level is complete for the job target before notes-plan (runs inside Codex)
argument-hint: TOPIC=<topic> LEVEL=junior|middle|senior [MODE=update|dry-run]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/knowledge/coverage/coverage-verify-prompt.md` and execute it in full, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- Read-only over coverage: this gate never edits a coverage file. Middle checks junior prerequisite
  integrity; senior checks junior and middle. It writes only its level-targeted findings file,
  self-report, and tracker.
- Execute the cold completeness reviewer through canonical runtime tiers; never treat tier names as literal model IDs, and do not pass it size or freshness priors.
- A `gaps` verdict is advisory and never blocks notes-plan. **Do not invoke `coverage-prompt`,
  `notes-plan`, or any other runnable workflow from this command.** Finish `coverage-verify` after
  writing its findings, self-report, and tracker update, then report the suggested next command for
  Victor to launch manually. Any later re-verification is an optional new reassessment, never a loop
  that must reach zero gaps.
