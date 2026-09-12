# Progress-update drift report

Date: 2026-09-12 · MODE = all · Branch: chore/portfolio-audit-04
Scope: projects/01-todo-list, projects/02-weather-app, projects/03-expense-tracker, projects/04-meal-finder, projects/05-task-manager, projects/06-hr-portal, projects/07-timetrack · SQL: audited
Verdict: 1 drift row — open until each Owner named below has re-run

## 1 — Level matrix, what changed

| Topic | Field | Was | Now | Why |
|---|---|---|---|---|
| Security | Next gate | `Refresh the junior notes plan` | `Author the 14 junior notes` | The plan is genuinely current, not stale: `Plan status: current`, its `Coverage SHA-256` recomputes byte-identical off `notes/security/coverage/junior.md` under `_coverage-standard.md`'s canonical command, and its `Plan J` tracker cell (2026-09-04 — completed) carries no `⚠ stale` flag. With no refresh owed, the first unmet consolidation condition is authoring, at 0/14 |
| SQL | Next gate | `Refresh the junior notes plan` | `Author the 17 junior notes` | Same measurement: `Plan status: current`, recorded digest `39aa0cfc…` matches the live scope bytes, and the `Plan J` cell (2026-08-28 — completed) records its stale flag **consumed** rather than outstanding. First unmet consolidation condition is authoring, at 0/17 |

No other cell moved. `Current tracked level` stays `Junior — building` for all 14 topics — no topic has a studied note, a stable-ID Q&A bank or a recorded unaided check, so nothing was promotable. `Practical evidence` was preserved untouched: this run verified no new project, exercise, simulation or unaided-recall evidence to append.

## 2 — Drift report

| Section | What PROGRESS.md says | What the sources say | Owner to re-run |
|---|---|---|---|
| Study progress · Project banks | The table carries **one** row, `01-todo-list`, with `—` | The population is the eligibility list `interview-prep-route-projects-prompt.md` → "Eligibility" resolves, and it holds **three** projects: 02-weather-app closed `✅ Ready` on 2026-09-07 and 03-expense-tracker on 2026-09-09 (both G7-signed in their `_run-tracker.md` `portfolio-audit` cells), and the twin table under `## Authoring progress` already lists all three. Both owe a row, each valued `—` — `notes/interview-prep/routes/projects.md` still does not exist, so no project has a study denominator | `study-block-close` — recount the `## Study progress` per-project table over the current eligibility list. 04-meal-finder is correctly absent: its 2026-09-12 run closed `blocked`, computing no verdict |

### Sections measured clean

- **Coverage demonstrated (D8)** — all 42 cells recounted from the topic files with the two canonical `grep -c`s; every one matches, including all three `Total` rows (609/1510, 9/191, 0/68) re-summed from the column numerators and denominators. Every `*` is justified — no topic has a `Coverage M` or `Coverage S` entry in `_run-tracker.md` — and no junior cell carries one it should have dropped.
- **Authoring progress (D10)** — `Notes authored` junior recounts to 5/213 across the 13 registered junior plans (Java entries 00 and 01 `refined` with `Pending additions: none`, 02–04 `complete`); its `*` is justified by 7 stale plans. `Interview CORE refined` and `Interview bank refined` are correctly `—`: no levelled bank carries a `{TOPIC}-J-{NNN}` stable ID. Project rows 01 1/118, 02 0/109, 03 0/122 all verified against the bilingual `[refined]` markers.
- **Study progress (D9)** — the three levelled rows are correctly `—`: zero dated `Studied:` fields, HTML has no plan at all, and no CORE route exists. Only the per-project table drifted (above).
- **Projects (D5)** — seven subagent reports, each carrying its read verification. 01–06 returned Format A / all steps complete against six `Done ✓` rows. 07 returned `Steps 1–6 done, Step 7 in progress (from ✅ markers)` against a row reading `Steps 1–6 done, backend backlog fully closed, Step 7a next` — plan and row agree that 1–6 are done and 7 is not, and the row's sub-step and backlog detail is exactly the prose D5 forbids overwriting from a `✅` scan.
- **Practice completed · Exercise route (D3)** — measured against `_sql-exercises-review.md` §4b and `practice/sql/junior/PLANNING-junior.md` §1. The 209 route target re-sums from §1's `First-pass target` column; `Corrected` 40/40 matches the 40 committed headers in `01-basics.sql` (identical on `HEAD` and `main`); every one of the 15 route files has its row with its §1 target; both `Total` rows sum their own columns. Middle and senior are correctly blank — neither directory exists.
- **Practice completed · Timed simulations (D4)** — `TRACKER.md`, 52 lines. All 15 rows carry `Level: Junior` and `⏳ Pending`, so 0/15 completed and 0/0/0 per track, counted off the `Status` column. Middle and senior are correctly `—` (no rows).
- **Legend prose (D11)** — every sentence citing a named topic, level, project or figure was compared against this run's measurement, not against the printed cell. All hold: HTML junior really is `0/81 (0%)` with its 2026-09-04 coverage run; the backfill paragraph's claim that only 07's Angular tier is unbackfilled holds (markers exist for all seven projects, 323 of them naming `07-timetrack`, and no committed Angular tier exists in 07 yet); Git's markers really are project-attributed rather than code-shaped (24 `01-todo-list`, 2 `02-weather-app`); `notes/interview-prep/routes/projects.md` really has never been built; `practice/leetcode/` really does not exist; `practice/sql/middle|senior/` really are unplanned. No prose row.

### One consequence worth naming

`projects/04-meal-finder`'s portfolio gate stopped **today** at Check 3 (`_run-tracker.md`: *"`progress-update MODE = all` is owed"*), because the previous drift report was dated 2026-09-07 while PROGRESS.md's newest commit was 2026-09-09. This run is that `MODE = all` run and its `Scope:` names 04, so the date and scope halves of Check 3 are now satisfied. The gate still does not close on this report: the shared session rules make all nine consumers close on an **empty** report, and the one Study-progress row above holds it open until `study-block-close` has recounted that table.
