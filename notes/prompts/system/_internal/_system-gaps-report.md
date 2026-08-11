# System gaps — report

**Date:** 2026-08-11 · **Starting commit:** `6f61cf563456b474ee803685abe28382627d6df9`
· **Branch:** `fix/backend-backlog` · **MODE:** `update` · **Status:** `complete`

The previous run's five promoted rows (`REC-088`–`REC-092`) are closed. Its deferred candidates were
re-tested against the current maps rather than copied forward. The unrelated working-tree change in
`.claude/settings.local.json` was preserved and excluded from every commit.

## 1 — Evidence

| Map | Lines | Read | SHA-256 (start = end) |
|---|---:|---|---|
| `notes/prompts/README.md` | 710 | **710 lines, read to EOF** by the orchestrator | `15a15767f409ec65ead7fd695907d8fbd8433784a4f30b854a9fb407a09135b2` |
| `notes/prompts/_internal/_system-map.md` | 597 | **597 lines, read to EOF** by the orchestrator | `cdf0851f71614f97c243b2889f08a008025f844c677a367ff0b39c83a58f78bf` |

Both hashes were recomputed immediately before this report was written and matched the Step 0 values.
No candidate was settled by opening the file it names.

## 2 — Edge ledger

| Edge | Count | Sections swept |
|---|---:|---|
| `writes` | ≈120 | map §7 (writer registry), §8; README hub table, family `Generates / updates`, feed list |
| `reads` | ≈270 | the same five sources' `Read by` / `Reads` cells, plus map §9 primary reads |
| `fires-on` | 17 skill triggers + 4 block designations | map §9 and §13 |
| `follows` | ≈140 | map §2–§6; README pipeline view and Typical run order |
| `gates` | 19 | map §4, §10, §11; README public-interface gate cells |
| `clears` | 10 | map §10–§12 |
| `hands-off` | ≈27 | map §2–§6 arrows and §9 handoffs |
| `licence` | 25 quoted design sentences | both maps, whole |

## 3 — Detector results and full candidate table

All ten detectors ran. Detector hits before subject reconciliation: D1 ×4 · D2 ×3 · D3 ×2 · D4 ×5 ·
D5 ×0 · D6 ×1 · D7 ×4 · D8 ×3 · D9 ×0 · D10 ×2. D7 and D8 hit the same stale-route subject, so the
union is 23 fine-grained subjects. D5 returned no broken component handoff. D9 returned no current
unpartitioned write: the previously suspected profile, inbox, plan-§0 and Q&A-bank cases now have chain
order, producer→consumer sequence, or an explicit partition.

| Content key | Det. | Evidence in the maps | Disposition | Outcome |
|---|---|---|---|---|
| `D1:projects/README.md` | D1 | README project-brief row reads it; map §7 has no writer | absence | promoted `REC-097` |
| `D1:personal/job-search/internship-daw.md` | D1 | README cover-letter/profile-readme rows and map §7 give two readers; §7 names no writer | absence | promoted `REC-098` |
| `D1:personal/job-search/archive/` | D1 | map §7 says `/cv` reads it when no CV is pasted; no writer | absence | deferred — over cap (one direct reader, below `internship-daw.md`'s two) |
| `D2:interview-prep/hr-screen.md` | D2 | README hr-screen row/feed list declare the optional write; neither map declares a reader | absence | promoted `REC-096` |
| `D7/D8:interview-prep-route-stale` | D7/D8 | README standard row says outside insertions owe a route-stale handoff; map §10/§11 has no debt/symptom row | absence | duplicate of closed `REC-092`; possible map defect routed to `map-sync`/`system-check` |
| `D10:code-review-practice` | D10 | catalogued with file edges; absent from map §3–§6, README Typical run order and map §11 | absence | promoted `REC-094` |
| `D10:hr-screen` | D10 | catalogued with file edges; absent from map §3–§6, README Typical run order and map §11 | absence | promoted `REC-095` |
| `D4:interview-prep-block-open#BORDERLINE-FAIL` | D4 | map §9 returns a read-only failure; no durable failure trace | accruing | observed — deduplicated against `REC-054`, not licensed |
| `D4:08:00#friction-without-failure` | D4 | map §13 has no morning closer or friction-without-failure sink | accruing | observed — deduplicated against `REC-054`, not licensed |
| `D7:_ritual-friction#three-open` | D7 | map §11 makes three open rows due a ruling, but no component counts them | accruing | `REC-054`; lived use must size it |
| `D8:coverage-mirror-drift#§11` | D8 | map §10 routes the validator; §11 lacks the symptom row | absence in map | routed to `map-sync`; no machinery row |
| `D1:by-hand-contract-files` | D1 | map §7 explicitly says standards/contracts, shared context, topic ownership and session rules are by hand | licensed | quoted writer licence |
| `D2:linkedin-chat-output` | D2 | README: “Output only” and ready to paste | licensed | declared human terminal consumer |
| `D2:cover-letter-chat-output` | D2 | README: “Output only” and no repo file | licensed | declared terminal output |
| `D3:PROGRESS#Professional-level` | D3 | map §8: one prompt needs all 13 topics, which no ritual can compute | licensed | global writer deliberately cold |
| `D3:PROGRESS#LeetCode` | D3 | map §8: “nothing yet — gated behind the ROADMAP gates” | licensed | intentional absence |
| `D4:08:00#no-step-or-task` | D4 | map §13: closing is per step/task, never per block | licensed | intentional event-driven trace |
| `D4:12:30#clean-close` | D4 | map §13: closer returns tomorrow's start when no friction exists | licensed | conditional trace explicitly accepted |
| `D4:13:30#no-pass-or-completion` | D4 | map §13: every block trace is conditional | licensed | no state change to record |
| `D6:SQL-G1-G4` | D6 | map §4 delegates those gates to the live SQL doctrine | licensed | deliberate derived-map boundary |
| `D7:notes-plan-stale` | D7 | map §10: only a real `/notes-plan` run clears it | licensed | named clearer exists |
| `D7:system-gaps-deferred-queue` | D7 | map §7: the next `/system-gaps` must read the report | licensed | named clearer/consumer exists |
| `D8:silent-wrong-skill-result` | D8 | map §12 explicitly leaves this to human review, map-sync, validator or system-check | licensed | stated limit with fallbacks |

The two D10 subjects remain separate even though the previous report merged them: HR rehearsal and code
critique are different capabilities, have different inputs and outputs, and need separate run-order
entries. Merging them would let one route hide the other's absence.

## 4 — Independent sweep

One cold deep analyst received only the two maps and D1–D10, not the orchestrator's candidates. It
proved **710 lines, read to EOF** and **597 lines, read to EOF**. After reconciling the stale-route D7/D8
views to one primary subject, the union partitions exactly:

- both — 5: `projects/README.md`, `internship-daw.md`, `hr-screen.md`, code-review reachability, HR reachability;
- analyst only — 8: stale interview route, both output-only cases, professional-level writer, three
  conditional block traces, delegated SQL gates;
- orchestrator only — 10: `archive/`, the two `REC-054` observations, ritual-friction count,
  coverage-mirror symptom, LeetCode, notes-plan debt, deferred-report queue, silent-wrong-skill limit,
  and the grouped by-hand licences.

Sizes add up: 5 + 8 + 10 = 23.

## 5 — Promotion and cold review

The cap is five. All five promoted findings pass the ledger's scope tests, describe missing machinery
capabilities rather than unrun prompt instances, and name a conditional correction target. The inherited
practice/interview candidate was split into two finer capabilities. `internship-daw.md` takes the final
slot ahead of `archive/` because two prompts read it directly while only `/cv` reads `archive/`.

One cold deep reviewer read both maps to EOF and persisted its verdict to the required scratch path.
Verdict: **approve-with-tightening**. Applied tightenings: the two `REC-054` subjects remain surviving
observations rather than licences; both D10 rows keep both conditional branches; the split D10 ranking is
justified; and the final-slot tiebreak is explicit.

## 6 — Promoted rows

- `REC-094` — no chain, run-order step or symptom route tells Victor to use code-review practice.
- `REC-095` — no chain, run-order step or symptom route tells Victor to use the HR-screen practice.
- `REC-096` — polished HR answers have a writer but no declared consumer.
- `REC-097` — `project-brief` consumes `projects/README.md`, whose producer is absent from the maps.
- `REC-098` — two application prompts consume `internship-daw.md`, whose provenance is absent.

## 7 — Verdict

**23 gaps found in the system as the two maps describe it — 5 promoted, 1 unsettled between the two
branches and deferred over the cap.** The complete split is 5 promoted absence findings · 1 deferred
absence · 1 closed-row duplicate/possible map defect · 2 observed under `REC-054` · 1 accruing under
`REC-054` · 1 routed map defect · 12 licensed designs.

This is a claim about the maps, never a claim that the machinery has no other gaps. Each promoted or
deferred absence keeps both branches conditional until its named settling file is read by a permitted
workflow.

**Maps unaffected.** This prompt changed no machinery contract, writer, trigger, chain or map.
