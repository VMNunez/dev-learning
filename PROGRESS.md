# Learning Progress

**Goal:** Junior / junior-mid developer role (Angular + Java) — Spain, August 2026
**Background:** React, Node.js, Express, TypeScript, Tailwind, CSS, HTML, JavaScript

**What this file is.** A status instrument: demonstrated level per topic, share of coverage applied in
code, notes/interview study, projects, SQL exercises, simulations. It is **not** an inventory of concepts learned — that lives
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
| Angular | Junior — building | Notes plan stale (0/17 complete); junior Q&A pending full audit | Projects 01–06, including a detail page driven by a route-param signal and an `effect()` whose cleanup cancels the in-flight request when the router reuses the component instance, and an application shell whose nav sits outside the `router-outlet` and derives its live count with `computed()` from the service signal, and a search page whose term lives in the URL as `?q=` so results survive navigation, and a presentational meal card that injects no service and is driven by two different pages through `input.required()` and `output()`, and icon-only favourite toggles whose accessible name is derived with `computed()` and bound with `[attr.aria-label]`, and a single `computed()` `Set` of favourite ids in the service that the three pages query instead of each re-scanning the array, and a `MealService` that translates every transport failure once with `catchError` and rethrows a domain `Error` so no page reinvents it, and dialog specs that supply `MatDialogRef` and `MAT_DIALOG_DATA` as `useValue` doubles so the unit is tested without `MatDialog.open()`, and a project 06 root `AuthService` whose session is re-read through a shape check, so a corrupt `localStorage` entry cannot throw out of a field initializer and blank the app, and a project 06 filter child whose `input()`/`output()` are typed to the status union so the value the page validated at the query-param read cannot re-widen at the component boundary, and a dashboard split into three presentational children whose panel shell receives its rows through `ng-content` instead of one configuration input per entity shape; project 07 frontend pending | Refresh the junior notes plan |
| Angular Material | Junior — building | Notes 0/16; shares Angular junior Q&A | Projects 05–06 | Complete junior notes and the Material sections of Angular Q&A |
| Spring | Junior — building | Notes 0/12; junior Q&A pending full audit | Core mechanisms already used inside project 07; evidence migration pending | Complete junior notes/Q&A and explain the core mechanisms unaided |
| Spring Boot | Junior — building | Notes plan stale (0/16 complete); junior Q&A pending full audit | Project 07 backend | Refresh the junior notes plan |
| Java | Junior — building | Notes plan current, fingerprint matches (1/17 authored, 0 studied); junior Q&A pending full audit | Applied in project 07 | Author the remaining 16 junior notes |
| Architecture | Junior — building | Notes plan stale (0/18 complete); junior Q&A pending full audit | Layered and coordinator patterns across projects; workflow invariants enforced in the state's owner (06) | Refresh the junior notes plan |
| Security | Junior — building | Notes plan stale (0/13 complete); junior Q&A pending full audit | Guards/interceptors in project 06, plus a persisted session shape there that carries email and role only, sanitised on read so an entry written before the fix drops its password; JWT/RBAC, query-input allow-listing, login throttling, a token identity bound to the immutable user id, and a password change that refuses an unchanged credential in project 07 | Refresh the junior notes plan |
| TypeScript | Junior — building | Notes plan stale (0/15 complete); junior Q&A pending full audit | Projects 01–07, including a project 03 reactive form whose control types match the model so the submitted value needs no `as` assertion, a project 04 API model that types `MealResponse.meals` as `Meal[] | null` because the endpoint returns `null` on no match, and a project 05 `Task.id` widened from `number` to `string` where the compiler enumerated every signature naming it, and a project 06 query-param read where a `value is T` predicate over an `as const` list replaced the `as` cast that let `?status=foo` through, and a project 06 dialog contract named at both ends — `open<T, D, R>` at every call site and `MatDialogRef<T, R>` on the dialog — so `afterClosed()` is checked instead of yielding `any` | Refresh the junior notes plan |
| SQL | Junior — building | Notes plan stale (0/17 complete); junior Q&A pending full audit | PostgreSQL project work, including a least-privilege application role in project 07; exercises in progress | Refresh the junior notes plan |
| JavaScript | Junior — building | Notes plan stale (0/22 complete); junior Q&A pending full audit | Applied throughout Angular projects, including a localStorage read in project 03 that survives both a corrupt stored value and a well-formed one of the wrong shape, a default form date built from the local clock rather than `toISOString()`, and entity ids generated with `crypto.randomUUID()` instead of `Date.now()` | Refresh the junior notes plan |
| CSS | Junior — building | Notes plan stale (0/16 complete); junior Q&A pending full audit | Projects 01–06, including a `prefers-reduced-motion` guard that drops the decorative hover and slows the loading spinner in project 02, and a project 04 `.visually-hidden` utility that takes the search label out of the flex row with `position: absolute` while keeping it in the accessibility tree, and a keyboard-only focus ring raised with `:focus-visible` and lifted to the whole card with `:has()`, and a text-styled `<button>` whose user-agent background, border, padding, font and cursor are reset explicitly | Refresh the junior notes plan |
| Git | Junior — building | Notes plan stale (0/8 complete); junior Q&A pending full audit | Daily feature-branch workflow | Refresh the junior notes plan |
| General | Junior — building | Notes plan stale (0/21 complete); junior Q&A pending full audit | HTTP, testing, debugging, configuration across projects | Refresh the junior notes plan |

Promotion is evidence-based. Completing files alone never changes `building` to `demonstrated`;
practical evidence alone also does not bypass incomplete or stale knowledge artifacts.

---

## Coverage demonstrated

Share of each level's coverage bullets applied in project code (the `✅ NN-slug — {evidence}` marker). Counted from the
per-topic coverage files. This is evidence of application, not of study, and it never promotes a
level in the table above.

| Topic | Junior | Middle | Senior |
|---|---|---|---|
| Angular | 96/148 (65%) | 0/12 (0%)* | 0/6 (0%)* |
| Angular Material | 47/77 (61%) | 3/13 (23%)* | 0/3 (0%)* |
| Spring | 8/58 (14%) | 0/25 (0%)* | 0/7 (0%)* |
| Spring Boot | 89/137 (65%) | 1/14 (7%)* | 0/5 (0%)* |
| Java | 54/131 (41%) | 3/14 (21%)* | 0/5 (0%)* |
| Architecture | 47/79 (59%) | 0/17 (0%)* | 0/5 (0%)* |
| Security | 53/107 (50%) | 1/10 (10%)* | 0/5 (0%)* |
| TypeScript | 35/83 (42%) | 0/15 (0%)* | 0/4 (0%)* |
| SQL | 26/151 (17%) | 0/16 (0%)* | 0/5 (0%)* |
| JavaScript | 39/131 (30%) | 0/13 (0%)* | 0/4 (0%)* |
| CSS | 54/114 (47%) | 1/10 (10%)* | 0/4 (0%)* |
| Git | 26/92 (28%) | 0/4 (0%)* | 0/4 (0%)* |
| General | 30/118 (25%) | 0/13 (0%)* | 0/5 (0%)* |
| **Total** | **604/1426 (42%)** | **9/176 (5%)** | **0/62 (0%)** |

`*` provisional denominator — that level's coverage has not been generated by the coverage pipeline
yet (no run recorded in `notes/prompts/_internal/_run-tracker.md`), so its total will move.

The `✅ NN-slug` marker went live on 2026-07-30 (its `— {evidence}` clause was added to the format on
2026-08-01 and is not backfilled, so older markers are bare), so these cells are still filling in: projects 01, 02, 03,
04, 05, 06 and the **backend** of 07 have been backfilled; only the Angular tier of 07 has not. An
unmarked bullet in a topic those projects would touch still means "not yet marked", not "not yet
applied". Git is the one topic whose evidence is not project-shaped — its markers attribute the daily
workflow to the first project that established it rather than to code inside that project.

---

## Authoring progress

Share of the accepted study route that has been **written**. This is independent from study: a note
counts here the moment its prose is finished, whether or not Victor has since sat down with it, and a
question counts once he has accepted its answer as correct. `authoring-progress-recount` recounts these
cells from the notes plans' `Status:` fields and the exact bilingual `[refined]` question markers.

| Track | Junior | Middle | Senior |
|---|---|---|---|
| Notes authored | 5/211* (2%) | — | — |
| Interview CORE refined | — | — | — |
| Interview bank refined | — | — | — |

`*` provisional denominator — at least one of the level's notes plans is not `Plan status: current`, or
its `Plan` cell in `notes/prompts/_internal/_run-tracker.md` is flagged stale, so the denominator will
grow as those plans absorb their missing coverage bullets. Unlike `Study progress` below, a stale plan
marks this count rather than blanking it: the numerator is a fact about files that already exist, and a
denominator that can only grow makes the fraction an honest floor.

`—` means the level has no denominator at all: no notes plan exists for it, or the question bank has no
stable IDs yet. It never means `0%`; an honest zero over a real denominator is printed as `0/N (0%)`.

---

## Study progress

Share of the accepted study route Victor has actively studied. This is independent from authoring:
a notes file can exist without having been studied, and a Q&A bank can be authored while its questions
remain unrefined or unpractised. `study-block-close` recounts these cells from notes-plan `Studied:`
dates, the current CORE route, and exact bilingual `[refined] [studied]` question markers.

| Track | Junior | Middle | Senior |
|---|---|---|---|
| Notes studied | — | — | — |
| Interview CORE studied | — | — | — |
| Interview bank studied | — | — | — |

`—` means the level has no complete, current denominator yet: at least one required notes plan, Q&A
bank or CORE route is missing, stale, or has not passed bilingual ID/state parity. It never means `0%`;
once the relevant denominator is current, an honest zero is printed as `0/N (0%)`.

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
| 07 | TimeTrack | Spring Boot REST API, JWT, PostgreSQL, Angular full stack, TimeEntry workflow | In progress ⏳ — Steps 1–6 done, backend backlog fully closed, Step 7a next | — |

---

## Practice completed

Share of each practice track actually finished, counted from `practice/`. Exercises and simulations
are **never added into one figure**: a graded exercise and a 90-minute timed test under interview
conditions are not the same unit of work, and a total that mixed them would hide which of the two is
missing. Like `Coverage demonstrated`, this is evidence of doing, and it never promotes a level.

### Exercise route — `practice/sql/`

Two different questions, so two different denominators — neither one alone is honest:

- **Corrected** — of the exercises that *exist right now*, how many are graded. The denominator grows
  every time `sql-exercises` writes a batch, extras and `[Repaso]` included. This is the working rhythm.
- **Route progress** — how much of the level's planned route is done. The denominator is fixed: the sum
  of the `First-pass target` column of that level's route file, `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`
  §1 — the **whole** route including the
  files not written yet. `[Repaso]` and extra batches do not count here — they are work on top of the
  route, and counting them would show progress the route never made.

A single figure would lie in one direction or the other: corrected alone sits near 100% forever while
twelve files remain unwritten; route progress alone makes extra practice invisible.

**Levels never share a figure.** Each level has its own route, its own target and its own files
(`practice/sql/{LEVEL}/`), so a level is a row in the roll-up and a table of its own below. A middle
exercise never counts toward the junior route, and a junior file never appears in the middle table.

#### Roll-up — one row per level

| Level | Corrected | Route progress | Steps closed |
|---|---|---|---|
| **Junior** | 40/40 (100%) | 20/209 (10%) | 0/14 |
| **Middle** | — | — | — |
| **Senior** | — | — | — |
| **Total** | — | **20/209 (10%)** | **0/14** |

The `Total` row spans levels, so today its route figure equals Junior — the only planned route. It
exists so the number stays honest the day a second route appears: middle exercises add to the total
without ever touching the junior row.

**`Corrected` has no total, deliberately.** It is a correction backlog, not an achievement: it moves up
when you generate and down when you grade, so an aggregate percentage of it measures nothing you would
act on. Read it per level, where it tells you what is waiting to be graded.

Middle and senior are blank because their routes are **not planned yet** — no coverage run, no route
target, so there is no denominator to divide by. A blank cell here means "no route exists", never
"route exists and nothing done"; the day `sql-plan` writes one, its target fills in.

#### Junior — `practice/sql/junior/`, 15 files across 14 steps

Every file of the route has a row from the moment the route is planned, including the ones not written
yet — the plan already knows their name, step and target (`practice/sql/junior/PLANNING-junior.md` §1), so a
collapsed "12 files pending" row would hide exactly what is left to do. A row appears here when the
**plan** declares the file, not when the file is created.

| Step | File | Corrected | First-pass / target | Status |
|---|---|---|---|---|
| 0 | `01-basics.sql` | 40/40 | 20/20 | closed ✅ — graded 2026-07-22; 20 first-pass + 20 `[Repaso]`, only the first-pass ones move the route |
| 0 | `02-execution-order-set-ops.sql` | — | 0/10 | not started — file deleted 2026-08-04, to regenerate |
| 1 | `03-joins.sql` | — | 0/22 | not started — file deleted 2026-07-22, to regenerate |
| 2 | `04-aggregates.sql` | — | 0/14 | not created |
| 3 | `05-join-pitfalls.sql` | — | 0/12 | not created |
| 4 | `06-nulls.sql` | — | 0/12 | not created |
| 5 | `07-subqueries-ctes.sql` | — | 0/16 | not created |
| 6 | `08-dates-strings.sql` | — | 0/12 | not created |
| 7 | `09-window-functions.sql` | — | 0/12 | not created |
| 8 | `10-dml-transactions.sql` | — | 0/16 | not created |
| 9 | `11-schema-design.sql` | — | 0/15 | not created |
| 10 | `12-data-types-ddl.sql` | — | 0/16 | not created |
| 11 | `13-indexes.sql` | — | 0/12 | not created |
| 12 | `14-live-database.sql` | — | 0/12 | not created |
| 13 | `15-report-queries.sql` | — | 0/8 | not created |
| **Total** | **15 files** | — | **20/209 (10%)** | **0/14 steps closed** |

#### Middle — `practice/sql/middle/`

Route not planned. No files.

#### Senior — `practice/sql/senior/`

Route not planned. No files.

### Timed simulations — `practice/simulations/`

Counted from the tracker row's explicit level. The original 15-test bank is Junior; future Middle
and Senior banks keep their own denominators.

#### Roll-up — one row per level

| Level | Completed | Pass | Borderline | Fail |
|---|---|---|---|---|
| **Junior** | 0/15 (0%) | 0 | 0 | 0 |
| **Middle** | — | — | — | — |
| **Senior** | — | — | — | — |
| **Total** | **0/15 (0%)** | **0** | **0** | **0** |

#### Junior — by track

| Track | Completed | Pass | Borderline | Fail |
|---|---|---|---|---|
| Angular | 0/5 (0%) | 0 | 0 | 0 |
| Spring Boot | 0/5 (0%) | 0 | 0 | 0 |
| SQL | 0/5 (0%) | 0 | 0 | 0 |
| **Total** | **0/15 (0%)** | **0** | **0** | **0** |

### LeetCode — `practice/leetcode/`

Not started, and deliberately so: it is gated behind the Angular and Spring Boot gates in `ROADMAP.md`.
Folder does not exist yet.

---

## Useful resources

- [Official Angular tutorial](https://angular.dev/tutorials/learn-angular)
- [Angular components guide](https://angular.dev/guide/components)
- [Oracle Java tutorials](https://docs.oracle.com/javase/tutorial/)
- [Spring Boot guides](https://spring.io/guides)
