# System-check breach log

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-10-15 | `FLOW = strategy` | `system-check-prompt.md` → `Step 3 — the acceptance gate` | own | The orchestrator accepted the `roadmap-review-prompt.md` return although three of its rows ruled absences outside the prompt licence (a `What it does` cell, a "Typical run order" step, a §3 chain step), where item 2 requires a cold re-dispatch; it held them out of the patch instead, and the final reviewer confirmed all three stay out, so no map changed on them. | routed to REC-347 |
| BRCH-0002 | 2026-10-15 | `FLOW = knowledge` | `system-check-prompt.md` → `Step 3 — the acceptance gate` | own | The orchestrator temporarily persisted the first `_interview-prep-review-prompt.md` return as accepted although its proposed corrections paraphrased rather than quoted exact source text; it removed the return and cold re-dispatched before any draft patch or map edit. | routed to REC-347 |
