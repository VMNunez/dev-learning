---
name: simulation-grade
description: >
  Grade a finished timed simulation or its corrections whenever Victor says it is ready for review
  ("corrige la simulación", "he terminado el test", "corrige las correcciones"). Resolve the planned
  step, refuse incomplete review inputs, and run simulation-review-prompt.md in one cold subagent so
  teaching context cannot contaminate the score. Hand Borderline/Fail to the correction loop; preserve
  the original timed verdict forever.
---

# Grade a timed simulation

Read `_session-rules.md`; qualifying execution failures use its durable-friction close-out. Never edit
Victor's solution code.

## 0 — Resolve or stop

Resolve LEVEL, ROUTE, current step, spec, track, and mode (`review` or `correction`) from the route and
Victor's words. Require the solution to be attached, pasted, or available at an explicitly named path.
For first review also require exact time used and a self-assessment already stated in the session/spec.
If one is missing, state the missing field and stop; do not score from a guess and do not ask a ritual
question.

Quote the resolved route step and spec before dispatch.

## 1 — Cold review

Dispatch one cold subagent with no conversation context beyond:

- instruction to read `notes/prompts/practice/simulations/simulation-review-prompt.md` in full to EOF
  and execute it;
- resolved LEVEL, ROUTE, STEP, SIMULATION_FILE, TIME_USED, SELF_ASSESSMENT, and MODE;
- the solution/corrections only.

Do not tell it what was taught, what looked good, or the expected verdict. Reject a return that lacks
the prompt line count and `read to EOF`.

## 2 — Traffic light

- Pass: route step closes unless the reviewer opened a mandatory correction.
- Borderline: step becomes `correction-required`; name the open gaps and the correction command.
- Fail: same correction gate, and the route must also contain or create a later reinforcement step.
- Correction clean: close the MISTAKES rows; Borderline may close its learning step, while a Fail still
  needs the reinforcement Pass. Never change the original tracker/spec verdict or time.
- Correction incomplete: keep the step open and name only the remaining gaps.

Report which branch ran. The review prompt owns all tracking writes and commits; do not reproduce them.

