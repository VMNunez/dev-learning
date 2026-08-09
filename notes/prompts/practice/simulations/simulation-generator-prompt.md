# Simulation Generator Prompt

> **Runtime contract:** Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching any
> role and use its active-platform mapping.

Use in a separate conversation. This prompt materialises the next spec already designed by the selected
level route. It never chooses free-form focus or difficulty: `/simulation-plan` owns scope and order.

> **▶ Run first:** `simulation-plan-prompt` for this exact LEVEL.

```
LEVEL = [junior | middle | senior]
STEP  = [current | number]  -> default: current
```

## 0 — Resolve and guard

Read `_session-rules.md`, `_shared-context.md`,
`practice/simulations/_internal/_simulation-plan-standard.md`, the doctrine, the selected route,
TRACKER, and the previous generator self-report. Resolve STEP from route §0 when `current`.

Stop with an exact message when:

- the route is missing (`/simulation-plan LEVEL={LEVEL}` owns it);
- its `Plan status` is stale;
- the step is blocked, already generated/admitted, attempted, or closed;
- the step lacks any required contract field;
- the active branch is `main`.

For SQL, independently re-check doctrine §8/§8c. If any planned requirement exceeds currently unlocked
techniques, stop and report route drift; never weaken the spec silently.

## 1 — Inventory and numbering

Read the two most recent specs for the step's track and every existing title/path needed for dedupe.
Use the exact `Spec:` path and number declared by the route. If that path now exists, verify its format
and admit it instead of overwriting it. A route/path collision with different content blocks the run.

The step supplies all generation inputs: track, title/domain intent, difficulty, time, coverage focus,
prerequisites, and generation state. Do not accept replacements from chat.

## 2 — Write the planned spec

All types start with:

```markdown
# {Type} — Test NN: {Title}

**Level:** {LEVEL}
**Route step:** {STEP}
**Time limit:** {minutes} minutes
**Status:** ⏳ Pending
**Date completed:** —
**Time used:** —
**Self-assessment:** —

---
```

Match the existing bank's section order for the track:

- Angular: Scenario; What to build; Interfaces and mock; Evaluation; Bonus.
- Spring Boot: Scenario; Entities; What to build; Expected HTTP status codes; Evaluation; Bonus.
- SQL: Schema; Queries to write; Evaluation; Bonus.

Quality gates:

- every requirement traces to the route's focus and selected-level scope;
- acceptance criteria are observable;
- at least one real business/edge-case decision is required;
- the work is completable in the route's time;
- Angular requires loading, error, empty/success state as applicable and service boundaries;
- Spring Boot requires DTOs, validation, service-layer logic, and one explicit error path;
- SQL uses only unlocked techniques, with the hardest requirement matching the route ceiling;
- no scenario duplicates an existing spec.

## 3 — Register and advance

Add one TRACKER row under the correct track with number, link, LEVEL, time limit, Pending status, blank
date, and blank self-assessment. Update only that section's denominator.

In the route step set `Generation: generated YYYY-MM-DD` and `State: ready`; repoint route §0 and doctrine
§0 to Moment 3. Preserve every other step and all review history byte-for-byte.

## 4 — Verify and commit

Re-open the written spec, its TRACKER row, route step, and both §0 pointers. Prove path/level/time/state
agree. Run `git diff --check`.

These specs and tracking files are system-authored artifacts under the simulation exception in the
session rules. Run status immediately before staging and committing; stage only the new spec, TRACKER,
route, and doctrine when §0 changed. Commit:

`docs: generate {track} simulation {NN} from {LEVEL} route`

Report the step, title, focus clauses, time, SQL fence when applicable, and commit.

## Final step — self-report

Execute `_single-shot-self-report.md` in full. Write
`_internal/_last-run-report-simulation-generator.md`, update `_run-tracker.md`, and commit those two
prompt-system files separately. The run-start check reads the previous report before target work.
