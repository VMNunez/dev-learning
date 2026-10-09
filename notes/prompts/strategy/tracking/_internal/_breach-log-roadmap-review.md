# Roadmap-review breach log

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-10-09 | `ROADMAP.md` (branch `projects/07-timetrack`) | `roadmap-review-prompt.md` → `Step 2 — Fan out two cold fact-gathering subagents` | own | Two workarounds of the step's own text: 2a's dispatch replaced "All 13 topics" with "every topic in the registry" (the registry holds 14 since HTML, in an instruction that itself forbids a second hard-coded list), and the blocked report names `/notes-plan` on three topics as the repair where the step orders "name `/coverage-audit` as the repair", because the validator failed on notes-plan fingerprints and reported no mirror drift; `ROADMAP.md` stayed untouched either way. | fixed in 2656e651 |
