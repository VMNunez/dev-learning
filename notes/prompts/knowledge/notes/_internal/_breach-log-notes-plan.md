# Breach log — notes-plan-prompt

Append-only. One row per rule this prompt's runs actually broke, in the words of the file that states
the step. Owned by `_pipeline-self-report.md` → `The breach log`; rows are never deleted.

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-08-27 | Architecture / junior / update | `_pipeline-self-report.md` → `What to write` | shared | the ledger reconciliation was committed with the report and tracker already staged, so `f419e0c0` carries `_recommendation-ledger.md` **plus** `_run-tracker.md` and `_last-run-report-notes-plan.md` instead of the ledger alone; content on disk is correct, the commit boundary the step exists to keep is not, and the REC row is no longer separable from the run that filed it | open |
| BRCH-0002 | 2026-08-28 | Spring Boot / junior / update | `notes-plan-prompt.md` → `Guards` 2 | this prompt | Guard 2 requires every English note in all three level directories to be read end-to-end before classification; the run read none of the 16 (9,508 lines) and instead carried the 2026-08-02 classifications forward after proving with `git log --name-status` that no file in the level had been added, removed, renamed or relocated since that run. The classifications on disk are almost certainly right — the trigger was eight added coverage bullets, not a changed inventory — but "almost certainly" is the cost: a `keep` verdict was reported this run that nothing in this run verified, and a note whose *content* drifted across a level boundary through ordinary edits is exactly what the git check cannot see | open |
