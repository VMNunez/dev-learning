# Breach log — portfolio-audit

Append-only. Rows are never deleted; a closed row stays as the evidence that this step was once a
problem. Contract: `notes/prompts/_internal/_pipeline-self-report.md` → "The breach log".

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-09-09 | `PROJECT_PATH = projects/03-expense-tracker`, `PORTFOLIO_SCOPE = full`, `DRY_RUN = true` | `CLAUDE.md` → `Claude Code adapter` | shared | The adapter mandates reading `_session-rules.md` completely before giving guidance or changing files; it was read only at Phase 3, after the bank, the twin and the CV bullet had been written. No commit was made under the gap and nothing had to be undone, but the boundary reads came after the writes rather than before | open |
