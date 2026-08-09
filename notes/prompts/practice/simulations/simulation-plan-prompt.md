# Simulation Plan Prompt

> **Runtime contract:** Before dispatching any role, read
> `notes/prompts/_internal/_agent-runtime-standard.md` and translate canonical roles, tiers, and
> execution modes through the active platform adapter.

Use in a separate conversation. This orchestrator turns coverage plus demonstrated readiness into one
ordered timed-simulation route for a concrete professional level. It plans only: it never writes a test
spec, grades an attempt, or edits Victor's solution.

> **▶ Run first:** `progress-update` if its last run is stale or reported drift; repair that drift with
> the owner it names. Coverage for every track admitted at this level must already exist.

```
LEVEL = [junior | middle | senior]
MODE  = [update | dry-run]  -> default: update
```

## 0 — Resolve and guard

Read, in full:

- `notes/prompts/_internal/_session-rules.md`
- `notes/prompts/_internal/_agent-runtime-standard.md`
- `notes/prompts/_internal/_shared-context.md`
- `notes/prompts/knowledge/coverage/_internal/_coverage-standard.md`
- `notes/prompts/practice/simulations/_internal/_simulation-plan-standard.md`
- the previous `_internal/_last-run-report-simulation-plan.md`, if it exists

Validate `LEVEL`; default only `MODE`. Resolve:

- `DOCTRINE = practice/simulations/PLANNING.md`
- `ROUTE = practice/simulations/{LEVEL}/PLANNING-{LEVEL}.md`
- `TRACKER = practice/simulations/TRACKER.md`
- `MISTAKES = practice/simulations/MISTAKES.md`

Check the active branch. If it is `main`, close out as blocked and do not write target artifacts.

Read `PROGRESS.md`, `ROADMAP.md`, TRACKER, MISTAKES when present, every existing simulation spec, the
selected-level topic coverage files named by the standard, and the SQL doctrine/route inputs. Count
lines before every whole-file read and read to EOF. Missing middle/senior coverage blocks that track;
it does not block planning the tracks whose sources exist.

## 1 — Build the evidence manifest

For each selected-level coverage file that exists, compute the scope digest using the coverage
standard's canonical evidence-marker stripping rule. Store the path and digest in the §1 table. Sort
the exact `path<TAB>digest` rows, join them with LF including a final LF, hash those UTF-8 bytes, and
record the manifest SHA-256. Compute a separate SHA-256 of `PROGRESS.md` and record it as the progress
snapshot.

Derive readiness independently per track:

- Angular: relevant Angular/Material/TypeScript/CSS scope exists and PROGRESS names practical Angular
  evidence at this level.
- Spring Boot: Java/Spring/Spring Boot/Architecture/Security scope exists and PROGRESS names practical
  backend evidence at this level.
- SQL: selected SQL scope exists and only techniques whose SQL steps are closed in doctrine §8c are
  admissible. A realistic first SQL simulation still requires the doctrine's minimum closed-step gate.

Coverage is a ceiling, never readiness evidence by itself.

## 2 — Draft doctrine and route

If DOCTRINE is missing, author it once from the standard's twelve required sections. If it exists,
preserve it byte-for-byte; findings about doctrine go in the final report, never into an opportunistic
rewrite during route planning.

Create or reconcile ROUTE to every required section in the standard. Preserve all prior attempt,
verdict, correction, and review-history fields exactly. Reuse pending existing specs when their actual
requirements fit the selected level and readiness fence. A legacy spec without `Level` may be admitted
as junior only; record the migration for the generator/reviewer, do not edit the spec here.

Order steps by dependency and interview usefulness, not by filename. Never schedule a blocked track.
Keep its gate visible in §1 and §5. Add a revision point after every three reviewed tests and ensure the
route contains a balanced mix of tracks that are genuinely ready.

For each existing step in `reinforcement-required`, create exactly one later reinforcement step when
none already names it in `Redeems`. Resolve every `SIM-NNNN` in `Reinforcement required` against
MISTAKES Closed; reaching this state while one of those IDs remains Open is route corruption and blocks
planning. Its focus comes from those stable Closed-row concepts. When the reason is `assisted-attempt`
and there are no gap IDs, reuse the original step's coverage focus. The successor receives the full
normal step contract and the same cold route review as every other planned test. Never let the grading
prompt author or insert this step.

## 3 — Cold review

Dispatch one cold `reviewer`, reasoning tier `deep`, with only:

- LEVEL, DOCTRINE, ROUTE;
- the full simulation-plan standard;
- the evidence manifest and readiness facts, without the author's rationale.

It checks every required section, all fourteen invariants, history preservation, coverage traceability,
readiness fences, route balance, existing-spec reuse, SQL limits, and whether each step is completable
in its time limit. It returns `approve`, `approve-with-fixes`, or `reject`, beginning with line counts
and `read to EOF` for every whole file. Apply approved fixes. A reject or unusable review blocks the run
without committing target artifacts.

## 4 — Acceptance and commit

Before writing in update mode, prove:

- every planned step has all required fields;
- every focus item traces to selected-level coverage;
- every ready track has positive evidence beyond coverage;
- existing attempt history is unchanged;
- SQL requirements fit the unlocked technique fence;
- DOCTRINE and ROUTE satisfy the standard.
- every reinforcement step has one valid `Redeems` target and every `reinforcement-required` step has
  exactly one planned reinforcement successor.

`MODE = dry-run` prints the proposed doctrine/route and reconciliation summary without writing either.

In update mode, write the accepted files. These are system-owned tracking files under the session-rule
exception. Run `git status --short` immediately before staging and committing; stage only DOCTRINE when
created and ROUTE. Commit:

`docs: plan {LEVEL} timed simulation route`

## 5 — Final report and close-out

Report: level, manifest digest, readiness verdict per track, steps admitted/generated later, legacy
specs reused, blocked gates, preserved history, cold-review verdict, and commit/dry-run/blocked result.

Then execute `notes/prompts/_internal/_pipeline-self-report.md` in full. Write
`notes/prompts/practice/simulations/_internal/_last-run-report-simulation-plan.md`, update the Simulation
track section of `_run-tracker.md`, and commit those two files separately. A blocked or dry-run outcome
still performs this close-out after target resolution.
