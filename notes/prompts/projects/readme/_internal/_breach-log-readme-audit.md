# Breach log — readme-audit

Append-only. Rows are never deleted; a closed row stays as the evidence that this step was once a
problem. Contract: `notes/prompts/_internal/_pipeline-self-report.md` → "The breach log".

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-09-27 | `PROJECT_PATH = projects/04-meal-finder` | `_pipeline-self-report.md` → `Refine the prompt when this run earned it — the last step` | shared | The close-out held two findings on their third sighting — an applier deleting where the cited rule merges or rewrites, which the literal `REC-202` check passes, and an undeclared backlog write — and dismissed both on condition 3 by its own judgement, so no ledger row was opened; `REC-254` and `REC-255` were opened only after Victor asked (`b1872472`) | routed to REC-256 |
| BRCH-0002 | 2026-09-27 | `PROJECT_PATH = projects/05-task-manager` | `_pipeline-self-report.md` → `Refine the prompt when this run earned it — the last step` | shared | The close-out dismissed the undeclared backlog channel on condition 3 ("the README output is unaffected") by its own judgement, the run before `BRCH-0001` did the same; its report also credited the author with reporting the two defects, when the orchestrator had added the dispatch line asking for them (`a5b352c5`) | routed to REC-256 |
| BRCH-0003 | 2026-09-28 | `PROJECT_PATH = projects/03-expense-tracker` | `readme-audit.md` → `Finishing` | own | `git status` before the commit showed a parallel run's staged `projects/02-weather-app/README.md`, and the commit ran without a pathspec anyway, sweeping it into `83b354ee`; soft-reset and recommitted with `-- <path>` as `8445bb55` | open |
| BRCH-0004 | 2026-09-28 | `PROJECT_PATH = projects/03-expense-tracker` | `readme-audit.md` → `Hard rules` | own | Two README commits for one project (`8445bb55` + corrective `b58d05b7`): an orchestrator objection to an `effect-only` rule-6 cut, which `_readme-effect-prompt.md:90-92` rules as standing, was sustained and committed before being overruled | open |
