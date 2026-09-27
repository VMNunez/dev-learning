# Progress-update drift report

Date: 2026-09-27 · MODE = all · Branch: projects/07-timetrack
Scope: projects/01-todo-list, projects/02-weather-app, projects/03-expense-tracker, projects/04-meal-finder, projects/05-task-manager, projects/06-hr-portal, projects/07-timetrack · SQL: audited
Verdict: 1 drift row — open until each Owner named below has re-run

## 1 — Level matrix, what changed

| Topic | Field | Was | Now | Why |
|---|---|---|---|---|
| Spring Boot | Knowledge consolidation | Notes plan current but owed a remap (tracker flags +1 bullet) | Plan declares itself current but its coverage fingerprint no longer matches (tracker flags +4 unmapped bullets) | Marker-stripped digest ≠ plan SHA; coverage 140 bullets vs 136 assigned; tracker Plan J flag +4 |
| Java | Knowledge consolidation | Notes plan current but owed a remap (tracker flags +1 bullet) | Notes plan current, fingerprint matching | Digest matches plan SHA `bad12930`; 132/132 bullets assigned; tracker Plan J carries no stale flag (consumed 2026-09-16) |
| Java | Next gate | Consume the plan's stale flag, then author the remaining 14 junior notes | Author the remaining 14 junior notes | No stale flag left to consume |
| Architecture | Knowledge consolidation | +7 unmapped bullets | +12 unmapped bullets | Coverage 84 bullets vs 72 assigned; tracker flag +12 |
| Security | Knowledge consolidation | Notes plan current | Plan declares itself current but its coverage fingerprint no longer matches (tracker flags +1 unmapped bullet) | Digest ≠ plan SHA; 108 bullets vs 107 assigned; tracker flag +1 |
| Security | Next gate | Author the 14 junior notes | Consume the plan's stale flag, then author the 14 junior notes | Stale plan is the first unmet consolidation condition |
| TypeScript | Knowledge consolidation | +4 unmapped bullets | +6 unmapped bullets | Tracker Plan J flag +6 |
| SQL | Knowledge consolidation | Notes plan current | Plan declares itself current but its coverage fingerprint no longer matches (tracker flags +1 unmapped bullet) | Digest ≠ plan SHA `39aa0cfc`; 152 bullets vs 151 assigned; tracker flag +1 |
| SQL | Next gate | Author the 17 junior notes | Consume the plan's stale flag, then author the 17 junior notes | Stale plan is the first unmet consolidation condition |
| JavaScript | Knowledge consolidation | +3 unmapped bullets | +5 unmapped bullets | Tracker Plan J flag +5 |
| CSS | Knowledge consolidation | +2 unmapped bullets | +8 unmapped bullets | Tracker Plan J flag +8 |
| General | Knowledge consolidation | +4 unmapped bullets | +9 unmapped bullets | Coverage 125 bullets vs 116 assigned; tracker flag +9 |

No level changed: every topic stays `Junior — building`. `Practical evidence` untouched — this run verified no new evidence.

## 2 — Drift report

| Section | What PROGRESS.md says | What the sources say | Owner to re-run |
|---|---|---|---|
| Coverage demonstrated · legend prose (D11) | "projects 01, 02, 03, 04, 05, 06 and the **backend** of 07 have been backfilled; only the Angular tier of 07 has not." | The sentence dates from 2026-07-30 (`ea842437`), when 07 had no Angular app; the app was scaffolded 2026-09-09 (`8c144990`) and marked per piece as it was built (`coverage-mark`, `REC-230`) — 36 Angular, 30 Angular Material, 23 HTML and 15 CSS junior bullets already carry `✅ 07-timetrack`. No tier is owed a backfill, so 07's Angular tier is no longer an example of one. | Victor — by hand |

Measured clean: Coverage demonstrated (42 cells, 3 totals, all `*` flags), Authoring progress (Notes 4/213* 2%, interview rows `—`, project rows 01–05), Study progress (all `—`; `routes/` does not exist), Projects (01–06 Format A Done ✓; 07 ✅ on Steps 1–7, 11, 12), Exercise route (target 209, 40/40 corrected, 20/209, 0/14), Timed simulations (0/15, 0/5 per track).
