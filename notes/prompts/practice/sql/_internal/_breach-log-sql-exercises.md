# Breach log — `sql-exercises`

Contract: `notes/prompts/_internal/_pipeline-self-report.md` → "The breach log". Append-only; only `Disposition` is mutable.

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-11-04 | junior · `practice` · `joins` · `03-joins.sql` · `COUNT = 11` | `_single-shot-self-report.md` → `Step 5 — Run-start check (this prompt's step 0, not its last)` | shared | `_session-rules.md` not read to EOF before the first write; outputs (new `.sql`, `PROGRESS.md` Corrected commit) are fully specified by the practice branch, so no output changed | open |
