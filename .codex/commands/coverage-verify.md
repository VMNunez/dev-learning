---
description: Verify a generated coverage level is complete for the job target before notes-plan (runs inside Codex)
argument-hint: TOPIC=<topic> LEVEL=junior|middle|senior [MODE=update|dry-run]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/knowledge/coverage/coverage-verify-prompt.md` and execute it in full, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- Read-only over coverage: this gate never edits a coverage file. It writes only its findings file, self-report, and tracker.
- Execute the cold completeness reviewer through canonical runtime tiers; never treat tier names as literal model IDs, and do not pass it size or freshness priors.
- A `gaps` verdict is advisory and never blocks notes-plan. Feed the findings through one
  `coverage-prompt` update; once consumed, continue to notes-plan. Any later re-verification is an
  optional new reassessment, never a loop that must reach zero gaps.
