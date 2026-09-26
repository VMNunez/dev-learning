# Progress-update drift report

Date: 2026-09-26 · MODE = active · Branch: projects/07-timetrack
Scope: projects/07-timetrack · SQL: audited
Verdict: 4 drift rows — open until each Owner named below has re-run

## 1 — Level matrix, what changed

| Topic | Field | Was | Now | Why |
|---|---|---|---|---|
| Java | Knowledge consolidation | 5/18 authored, 0 studied | 4/18 authored, 0 studied | The Java junior notes plan has 4 authored entries under the Status/Pending additions rule. |
| Java | Next gate | Consume the plan's stale flag, then author the remaining 13 junior notes | Consume the plan's stale flag, then author the remaining 14 junior notes | 18 entries minus 4 authored leaves 14 to author after the stale flag is consumed. |

## 2 — Drift report

| Section | What PROGRESS.md says | What the sources say | Owner to re-run |
|---|---|---|---|
| Projects · 07 | `Steps 1–7, 11 and 12 done … Step 8 (Backend tests) next` | `PLANNING.md` has ✅ on Steps 1–7 and 11–12; Step 8 is in progress | `step-complete`, or correct the status row to say Step 8 is in progress |
| Study progress · Project banks studied · 04-meal-finder | No row | Project 04 is eligible (`portfolio-audit` records ✅ Ready); `routes/projects.md` does not exist, so its value is `—` | `study-block-close` |
| Study progress · Project banks studied · 05-task-manager | No row | Project 05 is eligible (`portfolio-audit` records ✅ Ready); `routes/projects.md` does not exist, so its value is `—` | `study-block-close` |
| Authoring progress · Notes authored · Junior | `5/213* (2%)` | `4/213* (2%)` from the 13 junior notes plans; Java contributes 4 authored entries | `authoring-progress-recount` — junior |

The matrix changed only in its Java consolidation and next-gate cells. The other measured sections matched their sources: all 42 coverage cells and three totals, the SQL route target and 40 committed exercise headers, and 15 pending junior simulations. The junior Q&A bank and CORE route are absent, so the levelled authoring/study cells correctly remain `—`. The five eligible project banks have matching EN/ES question identities and their refined counts match the authoring table.
