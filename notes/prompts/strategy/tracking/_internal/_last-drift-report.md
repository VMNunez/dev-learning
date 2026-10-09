# Progress-update drift report

Date: 2026-10-09 · MODE = active · Branch: projects/07-timetrack
Scope: projects/07-timetrack · SQL: audited
Verdict: 2 drift rows — open until each Owner named below has re-run

## 1 — Level matrix, what changed

| Topic | Field | Was | Now | Why |
|---|---|---|---|---|
| Angular | Knowledge consolidation | `Notes plan stale (0/18 authored, 0 studied)` | `Notes plan current, fingerprint matching (0/28 authored, 0 studied)` | `/notes-plan` re-ran 2026-10-03: `Plan status: current`, 28 entries, stored digest `090fc362` equals the recomputed one |
| Angular | Next gate | `Refresh the junior notes plan` | `Author the 28 junior notes` | the plan is current, so the first unmet condition is the notes themselves |
| Angular Material | Knowledge consolidation | `Notes plan stale (0/16 authored, 0 studied)` | `Notes plan current, fingerprint matching (0/25 authored, 0 studied)` | `/notes-plan` re-ran 2026-10-03: `Plan status: current`, 25 entries, stored digest `d0d8de6e` equals the recomputed one |
| Angular Material | Next gate | `Refresh the junior notes plan, then author its 16 notes` | `Author the 25 junior notes` | the refresh is done; the route now holds 25 entries |
| Java | Knowledge consolidation | `4/18 authored` | `6/18 authored` | the plan carries 1 `complete` + 5 `refined` entries, none owing a `Pending addition` |
| Java | Next gate | `Author the remaining 14 junior notes` | `Author the remaining 12 junior notes` | 18 − 6 |
| SQL | Knowledge consolidation | `Plan declares itself current but its coverage fingerprint no longer matches (tracker flags +1 unmapped bullet); 0/17 authored, 0 studied` | `Notes plan current, fingerprint matching (1/17 authored, 0 studied)` | `/notes-plan` re-ran 2026-10-03 and consumed the flag: stored digest `bded1b85` equals the recomputed one; entry 00 is `complete` |
| SQL | Next gate | `Consume the plan's stale flag, then author the 17 junior notes` | `Author the remaining 16 junior notes` | the flag is consumed; 17 − 1 |

No `Current tracked level` moved and no `Practical evidence` cell was touched.

## 2 — Drift report

| Section | What PROGRESS.md says | What the sources say | Owner to re-run |
|---|---|---|---|
| Authoring progress · Notes authored · Junior | `7/213* (3%)` | `7/232* (3%)` — the 13 junior notes plans on disk hold 232 numbered entries (Angular 28 and Angular Material 25 since their 2026-10-03 `/notes-plan` runs; the printed denominator still counts them as 18 and 16). Numerator agrees: Java 6 + SQL 1. The `*` stays justified — eight plans fail their fingerprint | `authoring-progress-recount` (junior) |
| Study progress · Project banks — studied | rows `01-todo-list` … `05-task-manager` | `06-hr-portal` is eligible (portfolio gate `✅ Ready`, 2026-09-27) and is listed in the twin table under `Authoring progress`, but has no row here. Its cell is `—`: `notes/interview-prep/routes/projects.md` does not exist | `study-block-close` |

Measured and in agreement: Coverage demonstrated (42 cells, 3 totals, `*` flags against `_run-tracker.md`); Authoring progress interview rows (`—`, the levelled banks carry no stable IDs) and project rows 01–06; Study progress levelled rows (all `—`; HTML has no notes plan, eight plans fail their fingerprint, `notes/interview-prep/routes/` does not exist); Projects · 07 (plan: ✅ on Steps 1–7 incl. 7a–7d, 11 and 12; none on 8, 9, 10); Exercise route (target 216 = §1's column sum, 50 written, 40 graded, 20/216, 0/14, every per-file target); Timed simulations (0/15, 0/5 per track, all rows `⏳ Pending`); D11 legend prose. `Short exercises` is not measured — no detector reads that table (`REC-275` (b)).

Notes-plan fingerprints recomputed with the canonical command: Angular, Angular Material, Spring, Java and SQL match; Spring Boot, Architecture, Security, TypeScript, JavaScript, CSS, Git and General do not; HTML has no plan. The matrix states each one.
