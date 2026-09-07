# Progress-update drift report

Date: 2026-09-07 · MODE = all · Branch: prompts/portfolio-audit-ledger
Scope: projects/01-todo-list, projects/02-weather-app, projects/03-expense-tracker, projects/04-meal-finder, projects/05-task-manager, projects/06-hr-portal, projects/07-timetrack · SQL: audited
Verdict: 2 drift rows — open until each Owner named below has re-run

## 1 — Level matrix, what changed

| Topic | Field | Was | Now | Why |
|---|---|---|---|---|
| Angular | Knowledge consolidation | `Notes plan stale (0/17 complete); junior Q&A pending full audit` | `Notes plan stale (0/18 authored, 0 studied); junior Q&A bank carries no stable IDs and no CORE route exists` | the plan gained an entry on the 2026-09-04 run (18 entries on disk); Q&A state made falsifiable |
| Angular Material | Knowledge consolidation · Next gate | `Notes 0/16; shares Angular junior Q&A` · `Complete junior notes and the Material sections of Angular Q&A` | `Notes plan stale (0/16 authored, 0 studied); shares Angular's junior Q&A, which carries no stable IDs` · `Refresh the junior notes plan, then author its 16 notes` | the plan is `Plan status: stale` and the tracker flags +2 unmapped bullets; the old cell claimed neither |
| Spring | Knowledge consolidation · Next gate | `Notes 0/12; junior Q&A pending full audit` · `Complete junior notes/Q&A and explain the core mechanisms unaided` | `Notes plan current (0/12 authored, 0 studied); no junior Q&A bank` · `Author the 12 junior notes and explain the core mechanisms unaided` | the plan is current and unflagged; there is no `spring` file under `notes/interview-prep/junior/`, so "pending audit" overstated what exists |
| Spring Boot | Knowledge consolidation · Next gate | `Notes plan stale (0/16 complete); junior Q&A pending full audit` · `Refresh the junior notes plan` | `Notes plan current but owed a remap (tracker flags +1 bullet); 0/16 authored, 0 studied; junior Q&A bank carries no stable IDs` · `Consume the plan's stale flag, then author the 16 junior notes` | the plan declares itself current; what it owes is the tracker's +1-bullet remap, not a refresh |
| Java | Knowledge consolidation · Next gate | `Notes plan current, fingerprint matches (1/17 authored, 0 studied); junior Q&A pending full audit` · `Author the remaining 16 junior notes` | `Notes plan current but owed a remap (tracker flags +1 bullet); 5/18 authored, 0 studied; junior Q&A bank carries no stable IDs` · `Consume the plan's stale flag, then author the remaining 13 junior notes` | 4 `Status: complete` plus 1 `refined` owing no `Pending additions`, over 18 entries |
| Architecture | Knowledge consolidation | `Notes plan stale (0/18 complete); junior Q&A pending full audit` | `Plan declares itself current but the tracker flags +7 unmapped bullets; 0/20 authored, 0 studied; junior Q&A bank carries no stable IDs` | the plan holds 20 entries; the two sources disagree and the cell now says so |
| Security | Knowledge consolidation | `Notes plan stale (0/13 complete); junior Q&A pending full audit` | `Notes plan current (0/14 authored, 0 studied); junior Q&A bank carries no stable IDs` | the 2026-09-04 plan run landed 14 entries and left no stale flag |
| TypeScript | Knowledge consolidation | `Notes plan stale (0/15 complete); junior Q&A pending full audit` | `Notes plan stale, +4 unmapped bullets (0/15 authored, 0 studied); junior Q&A bank carries no stable IDs` | names the size of the debt the tracker records |
| SQL | Knowledge consolidation | `Notes plan stale (0/17 complete); junior Q&A pending full audit` | `Notes plan current (0/17 authored, 0 studied); junior Q&A bank carries no stable IDs` | the 2026-08-28 run consumed the stale flag; the cell still reported the pre-run state |
| JavaScript | Knowledge consolidation | `Notes plan stale (0/22 complete); junior Q&A pending full audit` | `Notes plan stale, +3 unmapped bullets (0/22 authored, 0 studied); junior Q&A bank carries no stable IDs` | names the size of the debt |
| HTML | Knowledge consolidation · Next gate | `Coverage never generated (topic admitted 2026-08-30); no notes plan; no Q&A bank` · `Run the first /coverage html junior, which owes the boundary migration…` | `Coverage generated 2026-09-04 (81 junior bullets, boundary migration consumed); no notes plan yet; no Q&A bank` · `Run the first /notes-plan html junior` | the run tracker records that run as `completed`; the gate it named is closed |
| CSS | Knowledge consolidation | `Notes plan stale (0/16 complete); junior Q&A pending full audit` | `Notes plan stale, +2 unmapped bullets and no run recorded in the tracker (0/16 authored, 0 studied); junior Q&A bank carries no stable IDs` | the `Plan J` cell carries a flag with no execution record under it |
| Git | Knowledge consolidation | `Notes plan stale (0/8 complete); junior Q&A pending full audit` | `Notes plan stale and never run through the plan pipeline (0/8 authored, 0 studied); junior Q&A bank carries no stable IDs` | the plan exists on disk but the `Plan J` cell is empty |
| General | Knowledge consolidation | `Notes plan stale (0/21 complete); junior Q&A pending full audit` | `Notes plan stale, +4 unmapped bullets (0/21 authored, 0 studied); junior Q&A bank carries no stable IDs` | names the size of the debt |

`Current tracked level` moved on no topic: every junior row keeps `building`, and no unaided practical
or explanation check was verified this run. `Practical evidence` was preserved on all 14 rows and
nothing was appended — this run read no project code and verified no new evidence.

## 2 — Drift report

| Section | What PROGRESS.md says | What the sources say | Owner to re-run |
|---|---|---|---|
| Authoring progress · Notes authored, Junior | `5/211* (2%)` | `5/213* (2%)` — 213 numbered entries across the 13 junior notes plans on disk (angular 18, angular-material 16, architecture 20, css 16, general 21, git 8, java 18, javascript 22, security 14, spring 12, spring-boot 16, sql 17, typescript 15); numerator unchanged at 4 `complete` plus 1 `refined` owing no `Pending additions` | `authoring-progress-recount` |
| Coverage demonstrated · the `—` explanatory paragraph | "HTML was admitted as a topic on 2026-08-30 and its first `/coverage` run, which owes a boundary migration from `css`, `angular`, `angular-material` and `general`, has not happened yet" | `_run-tracker.md` records `HTML · Coverage J — 2026-09-04 — completed — 81 junior items; FIRST_RUN full recalibration + boundary migration`, and the table's own HTML junior cell is a real `0/81 (0%)`, not `—` | `coverage-audit junior`, or `coverage-mark` on its next write — the prose belongs to that section's writers, not to this prompt |

Clean this run, measured against primary sources:

- **Coverage demonstrated (D8)** — all 42 cells recounted from `notes/{topic}/coverage/{LEVEL}.md`; every
  cell and all three `Total` rows agree (`609/1510`, `9/191`, `0/68`). Every `*` is justified: no
  `Coverage M` or `Coverage S` cell in the run tracker carries an execution record.
- **Projects (D5)** — seven subagent reports. Projects 01–06 returned Format A / all steps complete,
  matching `Done ✓`; project 07 returned `Steps 1–6 done (from ✅ markers)` over a 2003-line plan read
  to EOF, which the row's `Steps 1–6 done, backend backlog fully closed, Step 7a next` is consistent
  with — 7a carries no `✅`.
- **Exercise route (D3)** — `01-basics.sql` holds 40 exercise headers in committed history on both refs;
  §1 of `PLANNING-junior.md` sums to a 209 first-pass target across 15 files. `40/40`, `20/209 (10%)`
  and `0/14` all hold, and every route row matches §1.
- **Timed simulations (D4)** — all 15 `TRACKER.md` rows are `⏳ Pending` at Junior; `0/15 (0%)` per track
  and in both roll-ups is correct, and Middle/Senior correctly carry `—`.
- **Study progress (D9)** — every cell correctly `—`: no `notes/interview-prep/routes/` directory exists,
  the junior banks carry no stable IDs, and `html` has no notes plan, so no denominator gate is met.
  The `01-todo-list` study row is correctly `—` for the missing projects route.
- **Authoring progress · project banks (D10)** — `01-todo-list` is `1/118 (1%)`: 118 stable IDs and one
  `[refined]` in both `en/` and `es/`. `02-weather-app` correctly has no row — its portfolio gate is
  blocked, not `✅ Ready`.
