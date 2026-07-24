---
description: Grade a finished timed simulation and give the ideal solution, or guide you mid-test in hint mode (runs inside Codex)
argument-hint: SIMULATION_FILE=practice/simulations/{type}/NN-name.md [MODE=review|hint]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/practice/simulations/simulation-review-prompt.md` and execute it in full, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- Ask for the solution code if the user has not pasted it — in `review` mode the prompt has nothing to grade without it.
- Fill in `Status` and `Date` in TRACKER.md; `Self-assessment` is Victor's own column and is never written by the prompt.
