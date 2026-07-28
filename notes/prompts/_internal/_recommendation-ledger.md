# Prompt-system recommendation ledger

Self-report recommendations use one of four states:

- `open` — observed and not yet adjudicated.
- `accepted` — agreed, with implementation still pending.
- `applied` — implemented and verified.
- `rejected` — intentionally not implemented; the reason is recorded.

| ID | Source | Recommendation | State | Resolution |
|---|---|---|---|---|
| REC-001 | notes audit self-report | Add a live-repo/dependency fact-check gate to the notes author | applied | `_notes-write-prompt.md` contains the fact-check gate |
| REC-002 | coverage self-report | Permit a controlled diff input when coverage sections are restructured | applied | `coverage-prompt.md` documents the inherited-but-moved shortcut |
| REC-003 | progress self-report | Make Step F follow the active-branch rule | applied | `progress-update-prompt.md` now states that `main` only receives merges |
| REC-004 | progress self-report | Clarify Java-section cleanup when the section already exists | applied | D2 now requires moving misplaced pure-Java entries before additions |
| REC-005 | SQL exercises self-report | Keep blocking clarification questions brief | applied | SQL shell now requires options, consequence, and recommendation only |
| REC-006 | portability audit | Separate canonical workflows from Claude/Codex runtime syntax | applied | Shared session/runtime standards and dual launcher catalogs added |
| REC-007 | coverage prompt audit | Remove platform-specific tools, shell syntax, and literal tier names from the canonical coverage workflow | applied | `coverage-prompt.md` now translates runtime capabilities through `_agent-runtime-standard.md` and uses portable validation |
| REC-008 | coverage/content audit | Bound coverage to the junior hiring floor and stop unbounded adversarial expansion | applied | `coverage-prompt.md` now has topic budgets, an evidence-backed stopping rule, final-artifact reviewers, and explicit ownership boundaries |
| REC-009 | coverage/content audit | Recalibrate the 12 generated topic files and correct factual/coverage-future defects | applied | All topic coverage files were restored to the compact baseline, fact-corrected, ownership-cleaned, budget-checked, and mirrored into `notes/coverage.md` |
| REC-010 | coverage prompt run (Java junior, 2026-07-26) | Add a verify-gap fast path so a run that only consumes already-verified gaps skips the full market-floor re-derivation (Step 1) and the second Step 4 reviewer, while still judging each gap | applied | `coverage-prompt.md` "Run scope" section + Step 0/1/2/4 pointers; cold-reviewer verdict `approve-with-tightening`, tightening applied |
| REC-011 | notes-plan run (Java junior, 2026-07-26); reproduced (Spring Boot junior, 2026-07-27) | Planning algorithm rule 6 says allocate new files from the next unused two-digit number, but says nothing about a chapter inserted mid-route: the new file then sorts last in the folder while being read third, which breaks the standard's "00 → N reads as one journey". State whether within-level renumbering of an existing bilingual pair is permitted, or require the plan to declare the study-order/filename divergence | applied | `notes-plan-prompt.md` rule 6 now permits same-level renumbering of a bilingual pair (both languages together, prose byte-for-byte, links updated, reported as `renumber NN -> MM`, `Action: audit` preserved, never populating the split section), plus companion edits to the classification vocabulary, Update mode's declared outputs and the Final report fields. Applied in 9b4d4b1; cold-reviewer verdict `approve-with-tightening`, tightening applied verbatim. Second run's cost before the fix: reviewer-endorsed splits of two 24-concept Spring Boot entries were rejected, one on a 2384-line file |
| REC-012 | plan-audit run (07-timetrack, 2026-07-21); reproduced (07-timetrack, 2026-07-28) | Give the specialist order an adjudication rule for cross-concern ripples, and state whether a reconciliation re-dispatch must be a cold subagent or may resume the original specialist's context | rejected | Bar condition 3: the ripple protocol reached the correct result both runs (2026-07-28: `rules-security` → `data-model-api`, one re-dispatch, cap held). Friction only — the run would have been faster, not different. The cold/warm question is recorded here so it is not re-proposed as new |

New self-reports append or update a row here. A historical report remains immutable evidence; its
wording does not determine current status. The ledger does.
