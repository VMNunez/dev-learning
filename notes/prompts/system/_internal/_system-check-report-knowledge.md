# System-check report — knowledge

Date: 2026-10-15 · Flow: knowledge · Starting commit: `7c60e840baa3967bf81d0399bea8ccf55aef9f5a` · Branch: `projects/07-timetrack`
Status: blocked

## 1. Frozen inventory and accepted concerns

The frozen inventory contains 44 paths: 20 knowledge-family prompt/component files, six paired skills (the `.claude/skills/` copies), and nine launcher pairs. All were clean at admission. The two maps were also clean and recorded in the snapshot. This run accepted six file concerns; the other 20 file/skill concerns and the launcher concern received no accepted ruling. **No verdict on the knowledge flow or either map is published.**

Prompt `notes/prompts/system/system-check-prompt.md` blob `31ff7f33ebadeb25a35ca588fee32ea08a5e4736`; mandate `notes/prompts/system/_internal/_system-check-reconcile-prompt.md` blob `397e27d6a1e60ee152f66a33db56346431b51652`. The exact 44-path snapshot and six verbatim accepted returns are in `.system-check/flows/knowledge/20261015-174036-7c60e840/`.

| Accepted path | Blob id | Lines | correct / incorrect / missing / fenced / source-contradiction |
|---|---|---:|---|
| `knowledge/coverage/_internal/_coverage-standard.md` | `2342f6a1ce2fbd19ca0d3791ce91fc68eb748413` | 427 | 5 / 0 / 0 / 0 / 0 |
| `knowledge/coverage/_internal/_coverage-prompt-rationale.md` | `3db536a5763e8ae900801d2c3e2313157731c43d` | 308 | 3 / 0 / 0 / 0 / 0 |
| `knowledge/coverage/_internal/_topic-ownership.md` | `4fde7a60fde1965bfdd2c46abaab6885fd6ec764` | 88 | 6 / 0 / 0 / 0 / 0 |
| `knowledge/interview-prep/_internal/_interview-prep-standard.md` | `3586736e5642dcbc39be261592f562c65effe5cc` | 586 | 5 / 0 / 0 / 0 / 0 |
| `knowledge/notes/_internal/_note-quality-standard.md` | `7b77d94437eba02dd813a0f33f9302405ae84461` | 1247 | 6 / 0 / 0 / 0 / 1 |
| `knowledge/interview-prep/_internal/_interview-prep-review-prompt.md` | `90beb374ed2932e3dccb6ca3923f7eaa18533af1` | 204 | 2 / 1 / 3 / 1 / 0 |

## 2. Validator

Baseline `validate-prompt-system.ps1 -MachineryOnly`: exit 0; all checks passed, with one `REPORT` for a proposed ledger path and one live-state `SKIP`. After the ledger finding, the same command exited 0; the open-ledger uniqueness check compared 43 distinct rows instead of 42. No live state was checked.

## 3. Corrections and rulings

Map corrections applied: **none**. The accepted returns ruled 27 cells `correct`, one `incorrect`, three `missing`, one `fenced`, and one `source-contradiction`. Those are partial concern results, not a flow verdict. No draft patch was applied and no cold final reviewer was dispatched.

## 4. Machinery finding

- `REC-346`: `_note-quality-standard.md` lines 100–103 allow an unmarked bullet to mean a missing marker in a tier not yet backfilled; line 112 says categorically that no marker means no project covers the concept. The accepted concern quoted both clauses. The source standard was not edited.

## 5. Blocking gate and next action

Step 3 failed on `_notes-review-prompt.md`. Its first return did not open with an `N lines, read to EOF` declaration. The one cold re-dispatch opened correctly but failed to rule every licensed claim: its `README.md` `Reads` disposition did not address the row's forward-reference assertion against the source's separate `LINK_TARGETS` authority, and it did not rule the row's moved-out-section assertion. The mandate allows one re-dispatch; a second failed return blocks this run. The incomplete return was not accepted. Other running concerns were stopped. The final-review state is `not completed — reviewer unavailable` because the acceptance gate never closed.

Next action: start a new explicit `/system-check FLOW=knowledge` run. Its fresh concerns must rule each licensed cell, including every claim within a cell, and quote exact source text for every proposed correction.
