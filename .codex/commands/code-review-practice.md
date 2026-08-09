---
description: Practise critiquing flawed code you did not write — the stage-3 filter — then get graded on what you found and missed
argument-hint: TYPE=angular|spring-boot|sql|all LEVEL=junior|middle|senior [DIFFICULTY=intro|standard|challenge] [ISSUE_COUNT=4] [FOCUS=...]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/practice/interview/code-review-prompt.md` and execute it in full.

Configuration from the user: $ARGUMENTS

Rules:
- Named `/code-review-practice` because `/code-review` is Codex's own diff review — different tool, do not confuse them.
- `DIFFICULTY` defaults to `standard`; a blank or below-2 `ISSUE_COUNT` normalizes to 4.
- Show the snippet and wait. Never reveal the planted issues before Victor has given his critique.
- Grade what he found, what he missed, and what he over-flagged — the false positives matter as much as the misses.
