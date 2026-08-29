---
name: simulation-grade
description: >
  Grade a finished timed simulation or its corrections whenever Victor says it is ready for review
  ("corrige la simulación", "he terminado el test", "corrige las correcciones") — and give the one
  allowed hint whenever he is stuck inside an attempt still running ("dame una pista", "estoy
  atascado"), which needs only the partial solution and labels that attempt Assisted. Resolve the planned
  step, refuse incomplete review inputs, and run simulation-review-prompt.md in one cold subagent so
  teaching context cannot contaminate the score. Hand Borderline/Fail to the correction loop; preserve
  the original timed verdict forever.
---

# Grade a timed simulation

Read `_session-rules.md`; qualifying execution failures use its durable-friction close-out. Never edit
End every run by printing `desvíos: ninguno` or `desvíos: SBRC-NNNN`; a run that finished but
deviated from this text also applies that file's "When a skill's own text is what went wrong — the
skill breach log" close-out.
Victor's solution code.

## 0 — Resolve or stop

Resolve LEVEL, ROUTE, current step, spec, track, and mode (`review`, `correction`, or `hint`) from the route and
Victor's words. Require the solution to be attached, pasted, or available at an explicitly named path.
For first review also require exact time used and a self-assessment already stated in the session/spec;
hint mode requires only the partial solution.
If one is missing, state the missing field and stop; do not score from a guess and do not ask a ritual
question.

Quote the resolved route step and spec before dispatch.

## 1 — Cold review

Dispatch one cold subagent with no conversation context beyond:

- instruction to read `notes/prompts/practice/simulations/simulation-review-prompt.md` in full to EOF
  and execute it;
- resolved LEVEL, ROUTE, STEP, SIMULATION_FILE, TIME_USED, SELF_ASSESSMENT, MODE, and the mandatory
  out-of-band `ENTRYPOINT: simulation-grade` dispatch envelope;
- the solution/corrections only.

Do not tell it what was taught, what looked good, or the expected verdict. Reject a return that lacks
the prompt line count and `read to EOF`.

## 2 — Traffic light

- Pass: route step closes unless the reviewer opened a mandatory correction.
- Borderline: step becomes `correction-required`; name the open gaps and the correction command.
- Fail: same correction gate, and the route must also contain or create a later reinforcement step.
- Correction clean: close the MISTAKES rows; Pass and Borderline may close their learning step, while a
  Fail still needs the reinforcement Pass. Never change the original tracker/spec verdict or time.
- Correction incomplete: keep the step open and name only the remaining gaps.
- Hint: the cold subagent writes no simulation state, explains the first unfinished concept, and labels
  the later attempt Assisted.

Report which branch ran. The review prompt owns all tracking writes and commits; do not reproduce them.
