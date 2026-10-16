# System-check report — knowledge

Date: 2026-10-16 · Flow: knowledge · Starting commit: `b2ac5e192d306be3ecbd733b2c0b4b02e1ee1974` · Branch: `projects/07-timetrack`
Status: blocked

## 1. Frozen inventory and accepted concerns

The inventory contains 44 paths: 20 knowledge-family prompt/component files, six paired skills (the `.claude/skills/` copies), and nine launcher pairs. All were clean at admission and matched `snapshot.tsv` on resume. Nine file concerns passed Step 3; the other 11 file concerns, six skill concerns and launcher concern have no accepted ruling. **No knowledge-flow or map verdict is published.**

Prompt blob `c8337184e21becab43d00177fac9b4e4813dc11e`; mandate blob `cd60ab694e617051255f7962a6b6e17fc551d522`. The 44-path blob list and accepted returns are in `.system-check/flows/knowledge/20261015-190000-b2ac5e19/`.

| Accepted path | Blob id | Lines | correct / incorrect / missing / fenced / source-contradiction |
|---|---|---:|---|
| `knowledge/coverage/coverage-audit-prompt.md` | `d0e260befc4aa3a7d80c9a0f20b8fdeea0159206` | 206 | 30 / 2 / 4 / 1 / 0 |
| `knowledge/coverage/coverage-prompt.md` | `ce2cc5dad19537aebbd4c560990f46a510aa68af` | 416 | 35 / 3 / 2 / 2 / 0 |
| `knowledge/coverage/coverage-verify-prompt.md` | `02ac6d1680575ea9b1a71cd484c7f38e01ae90e0` | 278 | 23 / 2 / 4 / 1 / 0 |
| `knowledge/coverage/evidence-intake-prompt.md` | `4334b3ec388eed8b1201823d6c135c25ed653083` | 178 | 18 / 0 / 1 / 0 / 0 |
| `knowledge/interview-prep/interview-prep-audit.md` | `a0865c7eb10b4cbfa1482e208a3ec90708949dbc` | 611 | 18 / 1 / 8 / 1 / 0 |
| `knowledge/interview-prep/interview-prep-route-projects-prompt.md` | `5605efdfb4b6d05b09d2cc61300cf3b7f6c9cffb` | 208 | 17 / 0 / 3 / 0 / 0 |
| `knowledge/interview-prep/interview-prep-route-prompt.md` | `6f33cc715ab993b2722672d5e0177354d62c1dd3` | 144 | 18 / 0 / 1 / 0 / 0 |
| `knowledge/notes/notes-audit.md` | `c851a4e93e04184e7dc36e3ddf546200921865be` | 484 | 23 / 1 / 6 / 1 / 0 |
| `knowledge/notes/notes-plan-prompt.md` | `b66d6ce8efa2fa39494a2bf4520b8545d3a263da` | 579 | 24 / 2 / 2 / 1 / 0 |

Three proposed `missing` rows were struck: `notes-audit`'s report/tracker row and `interview-prep-audit`'s two report/tracker rows. `README.md` lines 428–433 explicitly declare these universal outputs and say they are not repeated in family rows. The verbatim returns retain those raw counts; none of the struck rows enters a patch.

## 2. Validator and corrections

Baseline and final `validate-prompt-system.ps1 -MachineryOnly` exited 0, with one proposed ledger path reported and live state skipped. The final run compared 44 distinct open ledger rows.

Map corrections: **none**. No draft patch or cold final review was reached. Final-review state: `not completed — reviewer unavailable`.

## 3. Machinery findings

- `REC-346` remains open from the prior blocked run: the note standard's unmarked-coverage exception conflicts with its unconditional no-marker instruction.
- `REC-348` records a distinct source contradiction checked at `_note-quality-standard.md` lines 405, 591 and 798: a `Why not X?` subheading is recommended where question-shaped section headings are forbidden. The source standard was not edited.

## 4. Blocking gate and next action

Step 3 failed on `_note-quality-standard.md`. Its first completed return omitted the previously documented unmarked-coverage contradiction. The one cold re-dispatch identified that and the heading contradiction but began with a heading instead of the required `N lines, read to EOF` declaration. The second failed return blocks the run. The other unfinished concerns were stopped without acceptance.

Next action: start a new explicit `/system-check FLOW=knowledge` run. Its concerns must put the EOF declaration on the first line, rule every assertion in each licensed cell, and quote both clauses of a source contradiction.
