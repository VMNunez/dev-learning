---
description: Materialise the next timed test already defined by a level's simulation route (runs inside Claude Code)
argument-hint: LEVEL=junior|middle|senior [STEP=current|N]
---

Read `notes/prompts/practice/simulations/simulation-generator-prompt.md` and execute it in full, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- `/simulation-plan` must already have created the selected level route.
- Focus, difficulty, time, track and path come from that route; never accept free-form replacements.
- Match the existing bank's format and preserve the SQL unlocked-technique fence.
