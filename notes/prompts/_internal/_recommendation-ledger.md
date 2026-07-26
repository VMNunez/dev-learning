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
| REC-011 | notes-plan run (Java junior, 2026-07-26) | Planning algorithm rule 6 says allocate new files from the next unused two-digit number, but says nothing about a chapter inserted mid-route: the new file then sorts last in the folder while being read third, which breaks the standard's "00 → N reads as one journey". State whether within-level renumbering of an existing bilingual pair is permitted, or require the plan to declare the study-order/filename divergence | open | Not applied. Cost this run: a reviewer-endorsed split of the values chapter was rejected and its 17 concepts stayed in one entry; the plan declares the divergence in a `Study order:` header line instead |

New self-reports append or update a row here. A historical report remains immutable evidence; its
wording does not determine current status. The ledger does.
