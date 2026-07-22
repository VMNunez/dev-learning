---
description: Define or refresh the required scope for one topic — what a junior must know, what is deferred (runs inside Claude Code)
argument-hint: TOPIC=Angular|SQL|Java|Spring Boot|...|all  (NOTES_PATH optional — derived from TOPIC)
---

Read `notes/prompts/knowledge/coverage/coverage-prompt.md` and execute it in full, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — execute them exactly, including the market-analysis subagent (Step 2) and the adversarial interviewer (Step 4a), each on the model the prompt names.
- If NOTES_PATH is blank, derive it from TOPIC rather than asking.
- Coverage is the root of the system: notes, interview-prep, plan-audit, roadmap-review and the SQL track all read what this writes. Do not shortcut the evidence steps.
