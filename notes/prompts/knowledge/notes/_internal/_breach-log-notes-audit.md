# Breach log — notes-audit

Append-only event sink for `notes-audit.md`, governed by `_pipeline-self-report.md` → "The breach log",
which owns every field and disposition below.

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-09-29 | Java junior note 03 | `notes-audit.md` → `Stage C — Spanish reviewer and commit` | own | Stage C wrote its review, trace and `Status: complete` to disk, then the session hit a usage limit before its atomic commit; a resumed session landed that commit as orchestrator (`aeb3b068`), a case the prompt is silent on between "The Spanish reviewer owns the atomic commit" and "There is no single-agent fallback" | routed to REC-269 |
| BRCH-0002 | 2026-09-30 | Java junior note 04 | `notes-audit.md` → `Stage C — Spanish reviewer and commit` | own | Deviation: stage T flagged a LINK_TARGETS claim mismatch (`parseInt` → 01, owned by 02); the section says such a mismatch is repaired by one re-dispatch of Stage B but not whether before Stage C, nor that T then re-syncs — the orchestrator re-dispatched B before C and resumed T for a scoped two-sentence re-sync; committed result unaffected | routed to REC-269 |
