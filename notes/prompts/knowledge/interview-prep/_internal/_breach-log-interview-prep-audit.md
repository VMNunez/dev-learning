# Breach log — interview-prep-audit

Append-only event sink for `interview-prep-audit.md`, governed by `_pipeline-self-report.md` → "The breach log",
which owns every field and disposition below.

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-10-13 | SQL junior · `MODE = index` | `_pipeline-self-report.md` → `How to commit it` | shared | Deviation: a parallel `MODE = index` run (`security`) held uncommitted text in the working copies of both `_run-tracker.md` and the shared `_last-run-report-interview-prep-audit.md`; the step stages the two files whole and is silent on that case, so the run staged index blobs instead (`HEAD`'s tracker plus its own SQL cell, and its own report) and left the other run's working-tree text in place — the working-tree report never held this run's text | open |
