# Breach log — notes-audit

Append-only event sink for `notes-audit.md`, governed by `_pipeline-self-report.md` → "The breach log",
which owns every field and disposition below.

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-09-29 | Java junior note 03 | `notes-audit.md` → `Stage C — Spanish reviewer and commit` | own | Stage C wrote its review, trace and `Status: complete` to disk, then the session hit a usage limit before its atomic commit; a resumed session landed that commit as orchestrator (`aeb3b068`), a case the prompt is silent on between "The Spanish reviewer owns the atomic commit" and "There is no single-agent fallback" | open |
