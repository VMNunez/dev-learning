---
description: Verify a generated coverage level is complete for the job target before notes-plan (runs inside Claude Code)
argument-hint: TOPIC=<topic> LEVEL=junior|middle|senior [MODE=update|dry-run]
---

Read `notes/prompts/knowledge/coverage/coverage-verify-prompt.md` and execute it in full, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- Read-only over coverage: this gate never edits a coverage file. It writes its findings file, self-report and tracker, plus one `_cross-topic-inbox.md` proposal — in its own commit — for each gap it rejects on ownership alone; the inbox is a handoff file, not coverage.
- Execute the cold completeness reviewer through the runtime mapping; do not pass it size or freshness priors.
- A `gaps` verdict does not block notes-plan. **Do not invoke `coverage-prompt`, `notes-plan`, or any
  other runnable workflow from this command.** Finish `coverage-verify` after its findings, any inbox
  routing, self-report, and tracker update, then report the suggested next command for Victor to launch
  manually. Re-verification is optional and must also be launched manually.
