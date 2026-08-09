---
name: simulation-block-open
description: >
  Orient a timed-simulation block whenever Victor starts one ("vamos con una simulación", "abro el
  bloque de simulations", "qué test toca"). Read the level doctrine, route, tracker, current spec and
  open simulation mistakes; state the one next moment, timer, allowed conditions, and any correction
  gate. Read-only: never generate, start the timer, grade, or edit tracking files.
---

# Open a timed-simulation block

Read `_session-rules.md` and apply its shared durable-friction close-out on a failed declared step.
Write nothing and ask nothing.

## 0 — Resolve

Resolve LEVEL from Victor's message, else from `practice/simulations/PLANNING.md` §0. Read:

1. doctrine §0 and §§2–6;
2. `practice/simulations/{LEVEL}/PLANNING-{LEVEL}.md` §0, §2 and current §3 step;
3. the current spec, if it exists;
4. its TRACKER row;
5. open `practice/simulations/MISTAKES.md` rows for this track and recent friction.

If the route is missing, say `No existe la ruta de {LEVEL}. Corre /simulation-plan LEVEL={LEVEL}.` and
stop. Prefer route+disk over doctrine §0; report a disagreement, never repair it.

## 1 — Name exactly one next moment

| State | Next moment |
|---|---|
| planned spec missing | Moment 2 — `/simulation-generator LEVEL={LEVEL}` |
| ready | Moment 3 — timed attempt |
| attempted, unreviewed | Moment 4 — say `corrige la simulación` with the solution attached/pasted |
| correction-required | Moment 4c — correct only the open gaps, then say `corrige las correcciones` |
| closed | next open route step |
| blocked | name the exact gate and owner; no substitute test |

Before Moment 3 state: exact time limit; no notes, docs or AI; timer stops at the limit; a hint makes
the attempt Assisted and ineligible for the Pass gate. Never start a timer or claim the attempt began.

## 2 — Report

Return at most six lines: step/track/level, spec/state, next moment, timer and conditions, up to three
open gaps/friction items, and one drift line if needed. No encouragement and no menu.

