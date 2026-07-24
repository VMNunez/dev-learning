---
description: Define or refresh one topic at junior, middle, or senior level (runs inside Claude Code)
argument-hint: TOPIC=Angular|Angular Material|SQL|Java|Spring Boot|... LEVEL=junior|middle|senior
---

Read `notes/prompts/knowledge/coverage/coverage-prompt.md` and execute it in full, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's config is authoritative; execute its market analyst and two cold reviewers through the runtime mapping.
- If NOTES_PATH is blank, derive it from TOPIC rather than asking.
- Coverage is the root of the system: notes, interview-prep, plan-audit, roadmap-review and the SQL track all read what this writes. Do not shortcut the evidence steps.
