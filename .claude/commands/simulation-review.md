---
description: Cold-review a planned timed simulation, its corrections, or give an assisted hint (runs inside Claude Code)
argument-hint: LEVEL=junior STEP=N SIMULATION_FILE=... [MODE=review|correction|hint]
---

Read `notes/prompts/practice/simulations/simulation-review-prompt.md` and execute it in full, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- Direct use requires the solution plus exact TIME_USED and SELF_ASSESSMENT; daily sessions normally trigger `simulation-grade` instead.
- Resolve the file against the selected level route before scoring.
- Correction mode never rewrites the original timed verdict or time.
