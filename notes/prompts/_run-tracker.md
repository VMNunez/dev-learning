# Run tracker — which targets each prompt has been run on

**What this is.** A permanent ledger of pipeline runs, one cell per prompt × target. It answers one
question at a glance: *which topics/projects has each orchestrator already covered, and which are
still pending?* The per-run detail (what happened, verdicts) stays in each orchestrator's
`_last-run-report.md` — that file is overwritten every run; this one only accumulates.

**Who updates it.** Every orchestrator, as part of the shared final step
(`_pipeline-self-report.md`): after writing its self-report, it updates its own cell/row here with
the run date and a short scope note, and commits both files together. Victor never fills it by hand
(though he may correct it).

**How to read it:** each cell is the **date of the last completed run** on that target, with a scope
note when the run was partial. An empty cell means **pending** — the current version of that prompt
has not been run on that target. Output files that predate the prompt (e.g. the old `coverage.md`
files created before `coverage-prompt` existed) do NOT count as runs — the cell stays empty until the
prompt itself has been executed. Prompts may read this file as a gate (e.g. `coverage-audit` only
runs once the whole coverage-prompt column is filled).

## Per-topic prompts

| Topic | coverage-prompt | notes-audit | interview-prep-audit |
|---|---|---|---|
| Angular | 2026-07-18 | | |
| Angular Material | 2026-07-18 | | |
| Spring Boot | 2026-07-13 | 2026-07-15 | |
| Java | 2026-07-18 | | |
| Architecture | 2026-07-18 | | |
| Security | 2026-07-18 | | |
| TypeScript | 2026-07-18 | | |
| JavaScript | 2026-07-18 | | |
| CSS | | | |
| SQL | 2026-07-18 | | |
| Git | | | |
| General | | | |

## Per-project prompts

| Project | plan-audit | review-audit | readme-audit | portfolio-audit |
|---|---|---|---|---|
| 01-todo-list | | | | |
| 02-weather-app | | | | |
| 03-expense-tracker | | | | |
| 04-meal-finder | | | | |
| 05-task-manager | | | | |
| 06-hr-portal | | | | |
| 07-timetrack | 2026-07-16 (MODE = review) | 2026-07-17 (backend only, FORCE) | | |

## Global prompts (no per-target scope)

| Prompt | Last run |
|---|---|
| coverage-audit | |
| evidence-intake | |
| progress-update | 2026-07-16 (MODE = active) |
| roadmap-review | |
