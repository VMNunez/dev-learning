---
name: simulation-block-close
description: >
  Close a timed-simulation block whenever Victor stops the timer or ends the block. Record only facts
  already stated: time used, self-assessment, attempt state, and friction that did not become a known
  failure. Never grade, infer a self-assessment, or change the timed verdict. It prepares the exact
  handoff to simulation-grade and asks zero questions.
---

# Close a timed-simulation block

Read `_session-rules.md`; qualifying failed ritual steps use its durable-friction close-out. Ask
End every run by printing `desvíos: ninguno` or `desvíos: SBRC-NNNN`; a run that finished but
deviated from this text also applies that file's "When a skill's own text is what went wrong — the
skill breach log" close-out.
nothing. Missing facts remain missing and are reported as the next required input.

## 0 — Resolve the attempt

Read doctrine §0, the selected route current step, current spec, and TRACKER row. From the session only,
resolve exact minutes used, whether the timer expired, whether a hint was used, and Victor's stated
self-assessment. Never infer any of them from code quality.

## 1 — Record state

When exact time and self-assessment are present, update the route step's Review history with
`attempted — awaiting review`, set its `State: attempted`, update doctrine/route §0 next moment to
review, and copy the self-assessment into the spec and TRACKER row. Set the spec and TRACKER status to
`Attempted — awaiting review`. If a hint was used, keep route `State: attempted` but label its Review
history plus the spec/TRACKER statuses `Assisted — awaiting review`, preserving that a timed verdict has
not yet been assigned.

If either required fact is absent, do not partially write attempt state. Report `Falta para cerrar el
intento: TIME_USED` and/or `SELF_ASSESSMENT`; this is an expected incomplete handoff, not friction.

## 2 — Friction without a graded failure

Append to `practice/simulations/MISTAKES.md` `## Friction` only concepts Victor explicitly said slowed
him down and that are not already open graded gaps. Row fields: date, level:step, track, concept,
evidence, resolved yes/no. Repeated friction on later dates gets a new row.

## 3 — Commit and handoff

Doctrine, route, MISTAKES, spec, and TRACKER are system/tracking artifacts under the session-rule
exception; commit only files actually changed, with status immediately before staging and committing:
`docs(simulations): close {track} attempt {NN}`.

Before committing, re-open the route step, both §0 pointers, spec header, and TRACKER row and prove that
all four agree on attempted/Assisted state, exact time, and self-assessment.

End with: attempt facts, friction count, and exactly one next action — attach/paste the solution and say
`corrige la simulación`, or provide the missing close field. Never grade here.
