# Breach log — `sql-plan-audit`

Contract: `notes/prompts/_internal/_pipeline-self-report.md` → "The breach log". Append-only; only `Disposition` is mutable.

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-10-07 | junior · `SCOPE = full` | `sql-plan-audit.md` → `Phase 2 — Specialists, one concern each, sequential` | own | deviation: recovering specialist 4 after its death, a second session parked four `.sql-audit-*.tmp` files in the repo root, where the prompt says nothing about where recovery artefacts go; they were moved out before the commit and no output changed | routed to REC-287 |
| BRCH-0002 | 2026-10-07 | junior · `SCOPE = full` | `sql-plan-audit.md` → `Phase 2 — Specialists, one concern each, sequential` | own | deviation: an accepted ledger ruling (`REC-288`) addressed to this prompt needed edits in route §1, §2 and §3, which no one concern may make; the orchestrator split it across #2 (§1/§2) and #3 (§3) in the dispatch text where Phase 2 is silent; output correct, history gate passed | routed to REC-287 |
