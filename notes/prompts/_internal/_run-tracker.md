# Run tracker — which targets each prompt has been run on

**What this is.** A permanent dashboard of every runnable prompt's latest execution, with target-level
progress for pipelines and file-level progress for study notes. It answers at a glance what completed,
what remains pending, and what last stopped as blocked or dry-run. Detailed machinery verdicts stay in
each prompt's `_last-run-report*.md`; this file stores concise operational state.

**Who updates it.** Every runnable prompt through `_pipeline-self-report.md` or
`_single-shot-self-report.md`. After writing its report, it updates the applicable row with the run
date, target/mode, outcome, and concise result, then commits report and tracker together. Victor never
fills it by hand (though he may correct it).

**How to read it:** new records use `YYYY-MM-DD — completed|blocked|dry-run — concise result`. An
empty cell means **pending**: the current prompt version has not run on that target. Historical cells
that contain only a date are legacy completed runs. Output files that predate the prompt do not count
as executions. Prompts may read this file as a gate, but only a `completed` result (including legacy
completed dates) satisfies a prerequisite; `blocked` and `dry-run` do not.

## Per-topic prompts

| Topic | Coverage J | Coverage M | Coverage S | Plan J | Plan M | Plan S | Notes J | Notes M | Notes S | Interview J | Interview M | Interview S | Sync J | Sync M | Sync S |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Angular | 2026-07-24 | | | 2026-07-24 (migration seed) | | | 0/9 complete — pending | | | | | | | | |
| Angular Material | 2026-07-18 | | | 2026-07-24 (migration seed) | | | 0/14 complete — pending | | | | | | | | |
| Spring Boot | 2026-07-13 | | | 2026-07-24 (migration seed) | | | 0/10 complete — pending | | | | | | | | |
| Java | 2026-07-24 — completed — 111 items; mirror parity; notes plan stale | | | 2026-07-24 (migration seed) | | | 0/11 complete — pending | | | | | | | | |
| Architecture | 2026-07-18 | | | 2026-07-24 (migration seed) | | | 0/7 complete — pending | | | | | | | | |
| Security | 2026-07-18 | | | 2026-07-24 (migration seed) | | | 0/4 complete — pending | | | | | | | | |
| TypeScript | 2026-07-18 | | | 2026-07-24 (migration seed) | | | 0/8 complete — pending | | | | | | | | |
| JavaScript | 2026-07-18 | | | 2026-07-24 (migration seed) | | | 0/13 complete — pending | | | | | | | | |
| CSS | 2026-07-19 | | | 2026-07-24 (migration seed) | | | 0/16 complete — pending | | | | | | | | |
| SQL | 2026-07-18 | | | 2026-07-24 (migration seed) | | | 0/10 complete — pending | | | | | | | | |
| Git | 2026-07-19 | | | 2026-07-24 (migration seed) | | | 0/8 complete — pending | | | | | | | | |
| General | 2026-07-19 | | | 2026-07-24 (migration seed) | | | 0/11 complete — pending | | | | | | | | |

The Notes J/M/S cells are summaries, written as `X/Y complete` plus the last outcome. Their denominator
comes from the corresponding notes plan, never from counting files on disk.

## Notes file executions

One row per planned pair, upserted by `notes-audit`. `Plan status` mirrors the selected plan entry;
`Last outcome` records the execution independently, so a failed retry remains visible without falsely
marking the note complete.

| Topic | Level | Note | English | Spanish | Plan status | Last run | Last outcome |
|---|---|---|---|---|---|---|---|

## Per-project prompts

| Project | plan-audit | review-audit | readme-audit | portfolio-audit |
|---|---|---|---|---|
| 01-todo-list | 2026-07-21 (MODE = review) | | | |
| 02-weather-app | | | | |
| 03-expense-tracker | | | | |
| 04-meal-finder | | | | |
| 05-task-manager | | | | |
| 06-hr-portal | | | | |
| 07-timetrack | 2026-07-21 (MODE = review) | 2026-07-23 (backend only) | | |

## Global pipeline prompts (no per-target scope)

| Prompt | Last run |
|---|---|
| coverage-audit | 2026-07-19 (junior, legacy pre-level split) |
| sql-plan-audit | 2026-07-22 (SCOPE = full) |
| progress-update | 2026-07-16 (MODE = active) |
| roadmap-review | 2026-07-21 |

## Single-shot prompt executions

One latest-run row per single-shot prompt. Target/mode contains the configuration that identifies the
work; prompts with no target use `global`.

| Prompt | Last run | Target / mode | Outcome | Result |
|---|---|---|---|---|
| code-review-prompt | | | pending | |
| cover-letter-prompt | | | pending | |
| cv-prompt | | | pending | |
| evidence-intake-prompt | 2026-07-21 | search | completed | 4 postings added; 12 total |
| hr-screen-prompt | | | pending | |
| linkedin-prompt | | | pending | |
| profile-readme-prompt | | | pending | |
| simulation-generator-prompt | | | pending | |
| simulation-review-prompt | | | pending | |
| simulator-prompt | | | pending | |
| sql-exercises-prompt | | | pending | |
| tracker-prompt | | | pending | |
