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

New self-reports append or update a row here. A historical report remains immutable evidence; its
wording does not determine current status. The ledger does.

