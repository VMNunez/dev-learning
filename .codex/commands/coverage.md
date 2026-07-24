---
description: Define or refresh one topic at junior, middle, or senior level (runs inside Codex)
argument-hint: TOPIC=Angular|Angular Material|SQL|Java|Spring Boot|... LEVEL=junior|middle|senior
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/knowledge/coverage/coverage-prompt.md` and execute it in full, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative. Execute its market analyst and
  final cold reviewers through canonical runtime tiers; never treat tier names as literal model IDs.
- If NOTES_PATH is blank, derive it from TOPIC rather than asking.
- Coverage is the root of the system: notes, interview-prep, plan-audit, roadmap-review and the SQL track all read what this writes. Do not shortcut the evidence steps.
