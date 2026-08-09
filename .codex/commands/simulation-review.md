---
description: Route a planned simulation review, correction, or hint through the cold simulation-grade skill
argument-hint: LEVEL=junior|middle|senior STEP=N SIMULATION_FILE=... [MODE=review|correction|hint] [TIME_USED=minutes] [SELF_ASSESSMENT=Solid|Good|Weak|Failed]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Do not execute `notes/prompts/practice/simulations/simulation-review-prompt.md` in this conversation.
Invoke the mirrored `simulation-grade` skill with the configuration and solution below. That skill is
the only entry point and dispatches one cold subagent to read
`notes/prompts/practice/simulations/simulation-review-prompt.md` and execute it in full.

Configuration from the user: $ARGUMENTS

Rules:
- `MODE` defaults to `review`; first review requires the solution plus exact `TIME_USED` and `SELF_ASSESSMENT`, while hint mode requires the partial solution only.
- Never grade locally or bypass the skill if dispatch fails.
- Correction mode never rewrites the original timed verdict or time.
