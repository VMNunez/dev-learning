# Breach log — readme-audit

Append-only. Rows are never deleted; a closed row stays as the evidence that this step was once a
problem. Contract: `notes/prompts/_internal/_pipeline-self-report.md` → "The breach log".

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-09-27 | `PROJECT_PATH = projects/04-meal-finder` | `_pipeline-self-report.md` → `Refine the prompt when this run earned it — the last step` | shared | The close-out held two findings on their third sighting — an applier deleting where the cited rule merges or rewrites, which the literal `REC-202` check passes, and an undeclared backlog write — and dismissed both on condition 3 by its own judgement, so no ledger row was opened; `REC-254` and `REC-255` were opened only after Victor asked (`b1872472`) | open |
