# Breach log — notes-plan-prompt

Append-only. One row per rule this prompt's runs actually broke, in the words of the file that states
the step. Owned by `_pipeline-self-report.md` → `The breach log`; rows are never deleted.

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-08-27 | Architecture / junior / update | `_pipeline-self-report.md` → `What to write` | shared | the ledger reconciliation was committed with the report and tracker already staged, so `f419e0c0` carries `_recommendation-ledger.md` **plus** `_run-tracker.md` and `_last-run-report-notes-plan.md` instead of the ledger alone; content on disk is correct, the commit boundary the step exists to keep is not, and the REC row is no longer separable from the run that filed it | open |
