# Learning Progress

**Goal:** Junior / junior-mid developer role (Angular + Java) — Spain, August 2026
**Background:** React, Node.js, Express, TypeScript, Tailwind, CSS, HTML, JavaScript

**What this file is.** A status instrument: demonstrated level per topic, share of coverage applied in
code, projects, SQL exercises, simulations. It is **not** an inventory of concepts learned — that lives
in `notes/{topic}/coverage/{level}.md` and its mirror `notes/coverage/{level}.md`, where every bullet
carries its ` ✅ NN-slug — {evidence}` marker naming the project that proves it. The per-technology
concept lists this file used to keep were a second, evidence-free copy of that inventory and were
removed on 2026-08-03. Do not reintroduce them: a concept goes to coverage, and only its *effect* on
level, percentage, or project status is recorded here.

---

## Professional level by topic

This table is the source of truth for Victor's **demonstrated level**, not merely which syllabus or
files exist. Coverage defines the target; notes and interview prep consolidate it; projects,
exercises, simulations, and unaided explanation demonstrate it.

**Level labels:**

- `Junior — building`: the junior scope is active, but at least one consolidation or practical gate remains open.
- `Junior — demonstrated`: junior notes and Q&A are current and Victor has applied and explained the
  topic without assistance.
- `Middle — building/demonstrated`: available only after junior is demonstrated; demonstrated middle
  additionally requires evidence of autonomous feature or service ownership.
- `Senior — building/demonstrated`: available only after middle is demonstrated; senior cannot be
  awarded from notes or personal projects alone—it requires production, platform, or multi-team ownership.

| Topic | Current tracked level | Knowledge consolidation | Practical evidence | Next gate |
|---|---|---|---|---|
| Angular | Junior — building | Notes 0/9; junior Q&A pending full audit | Projects 01–06; project 07 frontend pending | Complete junior notes, Q&A, then an unaided Angular simulation |
| Angular Material | Junior — building | Notes 0/14; shares Angular junior Q&A | Projects 05–06 | Complete junior notes and the Material sections of Angular Q&A |
| Spring | Junior — planned | Coverage and notes plan pending first run | Core mechanisms already used inside project 07; evidence migration pending | Run Spring junior coverage, then build its notes plan |
| Spring Boot | Junior — building | Notes 0/10; junior Q&A pending full audit | Project 07 backend | Complete junior notes/Q&A and rebuild one backend slice unaided |
| Java | Junior — building | Notes 0/11; junior Q&A pending full audit | Applied in project 07 | Complete junior notes/Q&A and pass an unaided Java/Spring explanation check |
| Architecture | Junior — building | Notes 0/7; junior Q&A pending full audit | Layered and coordinator patterns across projects | Complete junior notes/Q&A and defend project 07 decisions unaided |
| Security | Junior — building | Notes 0/4; junior Q&A pending full audit | Guards/interceptors in project 06; JWT/RBAC in project 07 | Complete junior notes/Q&A and explain the auth flow unaided |
| TypeScript | Junior — building | Notes 0/8; junior Q&A pending full audit | Projects 01–07 | Complete junior notes/Q&A and demonstrate typed implementation unaided |
| SQL | Junior — building | Notes 0/10; junior Q&A pending full audit | PostgreSQL project work; exercises in progress | Complete junior notes/Q&A and pass the planned SQL reviews/simulation |
| JavaScript | Junior — building | Notes 0/13; junior Q&A pending full audit | Applied throughout Angular projects | Complete junior notes/Q&A and pass an unaided fundamentals check |
| CSS | Junior — building | Notes 0/16; junior Q&A pending full audit | Projects 01–06 | Complete junior notes/Q&A and reproduce a responsive layout unaided |
| Git | Junior — building | Notes 0/8; junior Q&A pending full audit | Daily feature-branch workflow | Complete junior notes/Q&A and explain the collaboration workflow |
| General | Junior — building | Notes 0/11; junior Q&A pending full audit | HTTP, testing, debugging, configuration across projects | Complete junior notes/Q&A and demonstrate the cross-cutting concepts |

Promotion is evidence-based. Completing files alone never changes `building` to `demonstrated`;
practical evidence alone also does not bypass incomplete or stale knowledge artifacts.

---

## Coverage demonstrated

Share of each level's coverage bullets applied in project code (the `✅ NN-slug — {evidence}` marker). Counted from the
per-topic coverage files. This is evidence of application, not of study, and it never promotes a
level in the table above.

| Topic | Junior | Middle | Senior |
|---|---|---|---|
| Angular | 66/127 (52%) | 0/12 (0%)* | 0/6 (0%)* |
| Angular Material | 46/76 (61%) | 3/13 (23%)* | 0/3 (0%)* |
| Spring | 7/58 (12%) | 0/25 (0%)* | 0/7 (0%)* |
| Spring Boot | 79/128 (62%) | 1/14 (7%)* | 0/5 (0%)* |
| Java | 47/128 (37%) | 1/14 (7%)* | 0/5 (0%)* |
| Architecture | 33/66 (50%) | 0/17 (0%)* | 0/5 (0%)* |
| Security | 41/97 (42%) | 1/10 (10%)* | 0/5 (0%)* |
| TypeScript | 19/81 (23%) | 0/15 (0%)* | 0/4 (0%)* |
| SQL | 19/134 (14%) | 0/16 (0%)* | 0/5 (0%)* |
| JavaScript | 33/129 (26%) | 0/13 (0%)* | 0/4 (0%)* |
| CSS | 46/112 (41%) | 0/10 (0%)* | 0/4 (0%)* |
| Git | 26/92 (28%) | 0/4 (0%)* | 0/4 (0%)* |
| General | 29/116 (25%) | 0/13 (0%)* | 0/5 (0%)* |
| **Total** | **491/1344 (37%)** | **6/176 (3%)** | **0/62 (0%)** |

`*` provisional denominator — that level's coverage has not been generated by the coverage pipeline
yet (no run recorded in `notes/prompts/_internal/_run-tracker.md`), so its total will move.

The `✅ NN-slug` marker went live on 2026-07-30 (its `— {evidence}` clause was added to the format on
2026-08-01 and is not backfilled, so older markers are bare), so these cells are still filling in: projects 01, 02, 03,
04, 05, 06 and the **backend** of 07 have been backfilled; only the Angular tier of 07 has not. An
unmarked bullet in a topic those projects would touch still means "not yet marked", not "not yet
applied". Git is the one topic whose evidence is not project-shaped — its markers attribute the daily
workflow to the first project that established it rather than to code inside that project.

---

## Projects

| # | Project | Key concepts | Status | Live |
|---|---------|--------------|--------|------|
| 01 | To-do list | Components, routing, binding, directives, services | Done ✓ | [Live demo](https://01angulartodolist.netlify.app/) |
| 02 | Weather app | HTTP Client, forkJoin, signals, computed, ngOnInit, pipes, CSS animations | Done ✓ | [Live demo](https://02angularweatherapp.netlify.app/) |
| 03 | Expense tracker | Reactive forms, routing, localStorage, signals, form validation | Done ✓ | [Live demo](https://03angularexpensetracker.netlify.app/) |
| 04 | Meal finder | Route parameters, ActivatedRoute, effect(), computed(), localStorage, favourites | Done ✓ | [Live demo](https://04mealfinder.netlify.app/) |
| 05 | Task manager | Angular Material, MatTable, MatDialog, CRUD, coordinator pattern, context-specific themes | Done ✓ | — |
| 06 | HR portal | Route guards, lazy loading, HTTP interceptors, role-based access, MatSidenav, role-aware dashboard | Done ✓ | — |
| 07 | TimeTrack | Spring Boot REST API, JWT, PostgreSQL, Angular full stack, TimeEntry workflow | In progress ⏳ — Steps 1–6 done, Step 7 next | — |

---

## SQL

### Exercises completed

50 total exercises across 1 topic (40 answered, 10 pending)

| Topic | Folder | Exercises | Status |
|-------|--------|-----------|--------|
| basics / SELECT (part 1) | practice/sql/junior/01-basics.sql | 40 | closed ✅ — 40/40 scored 2026-07-22 (20 first-pass + 20 repaso); old schema, no longer extended |
| basics / SELECT (part 2) | practice/sql/junior/02-execution-order-set-ops.sql | 10 | in progress ⏳ — written 2026-07-22, unanswered |
| joins | practice/sql/junior/03-joins.sql | 0 | not started (file deleted 2026-07-22, to regenerate) |

---

## Simulations

- Angular: 0 completed (0 Pass, 0 Borderline, 0 Fail)
- Spring Boot: 0 completed (0 Pass, 0 Borderline, 0 Fail)
- SQL: 0 completed (0 Pass, 0 Borderline, 0 Fail)
- Total: 0 / 15 minimum target

---

## Useful resources

- [Official Angular tutorial](https://angular.dev/tutorials/learn-angular)
- [Angular components guide](https://angular.dev/guide/components)
- [Oracle Java tutorials](https://docs.oracle.com/javase/tutorial/)
- [Spring Boot guides](https://spring.io/guides)
