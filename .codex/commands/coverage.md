---
description: Define or refresh the required scope for one topic — what a junior must know, what is deferred (runs inside Codex)
argument-hint: TOPIC=Angular|SQL|Java|Spring Boot|...|all  (NOTES_PATH optional — derived from TOPIC)
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/knowledge/coverage/coverage-prompt.md` and execute it in full, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative. Execute its market analyst and
  final cold reviewers through canonical runtime tiers; never treat tier names as literal model IDs.
- If NOTES_PATH is blank, derive it from TOPIC rather than asking.
- Coverage is the root of the system: notes, interview-prep, plan-audit, roadmap-review and the SQL track all read what this writes. Do not shortcut the evidence steps.
