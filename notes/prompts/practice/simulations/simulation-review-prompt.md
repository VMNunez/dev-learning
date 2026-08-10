# Simulation Review Prompt

> **Runtime contract:** Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching any
> role and use its active-platform mapping.

This is the internal canonical cold reviewer for one planned timed simulation. It is never a direct
state-writing entry point: `simulation-grade` resolves the route and dispatches this prompt without
teaching context. A direct `/simulation-review` request is routed to that skill by the platform launcher.

> **▶ Run first:** `simulation-plan-prompt` for this LEVEL, then complete/close the timed attempt.

```
LEVEL           = [junior | middle | senior]
STEP            = [route step number]
SIMULATION_FILE = [exact spec path]
TIME_USED       = [exact minutes; required for first review]
SELF_ASSESSMENT = [Solid | Good | Weak | Failed; required for first review]
MODE            = [review | correction | hint] -> default: review
```

The solution or correction is pasted/attached after the prompt. Track is derived from the spec path.
The dispatching skill also supplies an out-of-band envelope line `ENTRYPOINT: simulation-grade`; it is
not user configuration and the platform launchers never accept it as an argument.

## 0 — Guards

Read `_session-rules.md`, `_shared-context.md`, `_simulation-plan-standard.md`, doctrine, selected route,
spec, TRACKER, MISTAKES, PROGRESS, selected-level Q&A pair, and the previous review self-report.

Require the dispatch envelope `ENTRYPOINT: simulation-grade` before every mode. If absent, stop without grading or writing
and instruct the caller to use `simulation-grade`. This is the only door to a state-writing review.

Require route STEP to own SIMULATION_FILE and LEVEL to agree across route/spec/tracker. A legacy spec
without level may migrate to junior only. In first review require exact time and self-assessment. In
correction mode require an immutable prior verdict plus open MISTAKES rows. Hint writes nothing.

First review additionally requires route `State: attempted` and matching spec/TRACKER
`Attempted — awaiting review` or `Assisted — awaiting review` status written by
`simulation-block-close`. A `ready` step has not closed its timer handoff and cannot be graded.

Never review a different step because the named file looks similar. Never edit Victor's solution.

## 1 — Requirements before code

Read the spec before the solution. List each acceptance requirement, numbered. In correction mode list
only the open recorded gaps; in hint mode list all requirements and continue at Hint below.

## 2 — Score a first review

Score 1–3 with evidence. Requirements plus the two marked core dimensions decide the verdict.

### Angular

| Dimension | Core |
|---|---|
| Requirements met (X/Y) | yes |
| Reactive forms and validation | yes |
| HTTP/service correctness | yes |
| TypeScript types; no `any` | no |
| Component/service boundaries | no |
| loading/empty/error/success states | no |

### Spring Boot

| Dimension | Core |
|---|---|
| Requirements met (X/Y) | yes |
| Layered architecture | yes |
| DTO boundary | yes |
| Bean Validation | no |
| Error handling | no |
| HTTP conventions | no |

### SQL

| Dimension | Core |
|---|---|
| Requirements met (X/Y) | yes |
| Query correctness | yes |
| JOIN/relationship logic | yes |
| aggregates/grouping | no |
| NULL handling | no |
| appropriate PostgreSQL features | no |

Add a tests dimension only when the spec requires tests.

- Pass: Requirements ≥2 and neither other core is 1.
- Borderline: Requirements ≥2 and exactly one other core is 1.
- Fail: Requirements is 1 or both other cores are 1.
- Assisted: a hint was used; report the quality verdict too, but it does not satisfy the route Pass gate.

Compare exact time to the limit and distinguish syntax friction from design friction. Give requirement-
by-requirement corrections and one complete ideal solution that would score 3. Quote only the minimum
problematic code needed.

## 3 — Correction review

Do not rescore the whole test. For each open MISTAKES row, mark `fixed` or `still open` against the
submitted correction. A fixed row moves atomically from `## Open` to `## Closed`; it never remains
selectable by planning or opening. Show only remaining defects and the minimal corrected reference.

Closing every row never changes the original tracker/spec verdict or TIME_USED:

- a corrected Pass closes its route step;
- a corrected Borderline closes its route learning step;
- a corrected Fail moves to `reinforcement-required` until `/simulation-plan` authors a linked
  reinforcement step and that step earns a Pass;
- a partial correction leaves only unresolved rows open.

## 4 — Record gaps and Q&A

On first review, upsert one `practice/simulations/MISTAKES.md` `## Open` row per unmet requirement or
score-1 dimension. IDs are monotonic `SIM-NNNN`, derived from the highest ID in both sections; never
reuse an ID. Store ID, date, level:step, track, concept, evidence, verdict, status open. A score-2
dimension is feedback in this report and never becomes a row; every row written here is a mandatory
correction row whatever the verdict, so a Pass that left a requirement unmet or scored 1 on a non-core
dimension is `correction-required` until they close (standard, *Review and correction semantics*).
Correction mode removes every fixed row from `## Open` and
appends `ID | closed date | level:step | concept | correction evidence` to `## Closed`; unresolved rows
remain byte-for-byte except for appended evidence. Verify that no closed ID remains under `## Open`.

For Borderline/Fail add 2–3 targeted bilingual questions; for Pass add one. First require the selected-
level bank fingerprints to match current coverage and follow the interview-prep standard's outside-audit
rules. A stale bank receives proposed questions in the report only.

## 5 — Synchronise tracking

First review:

- spec: Level, Route step, Status, Date completed, Time used, Self-assessment;
- TRACKER: same level/status/date/self-assessment (add Time used only if the table carries that column);
- route: review history and timed verdict; `closed ✅`, `correction-required`, or
  `reinforcement-required` for an Assisted attempt after any corrections;
- doctrine/route §0: next correction moment or next open step;
- PROGRESS timed simulations: recount from TRACKER by level and track. Completed = Pass + Borderline;
  Fail and Assisted appear in breakdown but do not count as completed.

Correction mode updates only MISTAKES, route, and §0 pointers. It never increments PROGRESS or rewrites
spec/TRACKER history.

If first-review verdict is Fail, record `Reinforcement required: <SIM-NNNN IDs>` on the failed step. Do
not add a step here: set or retain `correction-required`, and after corrections close set
`reinforcement-required`. `/simulation-plan` is the only writer that may author the linked successor.

Those IDs remain the stable pointer after correction moves their rows to MISTAKES Closed.

An Assisted first review records timed verdict `Assisted` plus its quality verdict. If quality opens
corrections, close those first; afterwards set `reinforcement-required`. If no mandatory correction
opens, set it immediately with `Reinforcement required: assisted-attempt`. Never close an Assisted
learning step without a later unaided Pass.

On an unaided Pass for a step whose `Redeems` field names a Fail/Assisted step, close the reinforcement
step and also set the linked step to `closed ✅` only when all its MISTAKES rows are closed. Record
`Redeemed by: <current step> · <date>` on the linked step. Preserve its original timed verdict, time, review history,
spec, TRACKER row, and PROGRESS statistics exactly.

After every Pass/correction transition, evaluate the level-close condition **exactly as
`_simulation-plan-standard.md` defines it under "Revision points and level close"** — that section owns
the condition and this one only executes it: every planned step `closed ✅`, no correction open for this
level, and every admitted track with at least one Pass. Never re-derive it as a MISTAKES row count:
`## Friction` rows and rows recorded at another level are not corrections and never enter the test. When
it holds, set `Level status: closed ✅`, repoint doctrine/route §0 to `/progress-update`, and name that
audit as the next gate. Otherwise leave level status open.

## 6 — Commits and report

All changed simulation specs/tracking files, PROGRESS, and Q&A are system-authored tracking artifacts
under the session-rule exception. Make atomic commits by concern with status immediately before staging
and committing:

1. `docs(simulations): review {track} simulation {NN} — {verdict}` — spec, tracker, route, doctrine,
   MISTAKES, PROGRESS.
2. `docs(interview-prep): add {track} simulation review questions` — only when Q&A changed.

Report requirements, scorecard/correction matrix, verdict, time, open/closed gaps, recurring pattern
from same-track MISTAKES, tracking parity, next route moment, and commits.

## Hint

Hint mode writes nothing. Mark each requirement done/started/missing from the partial solution, select
the first unfinished one, explain its concept and exact target file/class, and ask Victor to try it.
Never give code. Record in chat that using the hint makes a later review Assisted.

## Final step — self-report

Execute `_single-shot-self-report.md` in full. Write `_internal/_last-run-report-simulation-review.md`,
update `_run-tracker.md`, and commit those two prompt-system files separately.

[paste or attach the solution/correction below]
