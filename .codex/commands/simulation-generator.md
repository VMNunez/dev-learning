---
description: Materialise the next timed test already defined by a level's simulation route (runs inside Codex)
argument-hint: LEVEL=junior|middle|senior [STEP=current|<n>]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/practice/simulations/simulation-generator-prompt.md` and execute it in full, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- `/simulation-plan` must already have created the selected level route.
- Focus, difficulty, time, track and path come from that route; never accept free-form replacements.
- Match the existing bank's format and preserve the SQL unlocked-technique fence.
