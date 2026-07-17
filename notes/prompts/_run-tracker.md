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
note when the run was partial. An empty cell means *never run* (or run before this tracker existed,
2026-07-17 — cells known from surviving reports are pre-filled).

## Per-topic prompts

| Topic | coverage-prompt | notes-audit | interview-prep-audit |
|---|---|---|---|
| Angular | ✔ pre-tracker | | |
| Angular Material | ✔ pre-tracker | | |
| Spring Boot | 2026-07-13 | 2026-07-15 | |
| Java | ✔ pre-tracker | | |
| Architecture | ✔ pre-tracker | | |
| Security | ✔ pre-tracker | | |
| TypeScript | ✔ pre-tracker | | |
| JavaScript | ✔ pre-tracker | | |
| CSS | ✔ pre-tracker | | |
| SQL | ✔ pre-tracker | | |
| Git | ✔ pre-tracker | | |
| General | ✔ pre-tracker | | |

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
