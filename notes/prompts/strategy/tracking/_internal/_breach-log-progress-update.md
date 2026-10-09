# Progress-update breach log

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-09-26 | MODE=active (projects/07-timetrack + SQL + simulations) | `_pipeline-self-report.md` → `Run-start check — surface anything the last run left open` | shared | Completed the verified EOF read of session rules only after both required dispatches had launched. | open |
| BRCH-0002 | 2026-10-09 | MODE=active (projects/07-timetrack + SQL + simulations) | `progress-update-prompt.md` → `Step B — Subagent: audit SQL exercises` | own | The dispatch asked for a per-ref raw-count line under the table, against the step's "Return **only** one row per topic"; no cost, no figure changed. | open |
