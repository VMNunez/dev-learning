# Skill friction

Durable evidence for an **observable failed step** in one of the thirteen in-session skills. The source
contract is `_session-rules.md` → "When a skill cannot finish — durable friction"; this file is only its
event sink and must not restate or widen that trigger.

Rows are append-only evidence. `ID` uses the next zero-padded `FRIC-NNNN` value. `ID`, `Date`, `Skill`,
`Target`, `Failed step`, and `Evidence` never change after insertion. Only `Disposition` changes:

- `open` — not yet adjudicated.
- `REC-NNN` — reconciled into that recommendation-ledger item.
- `dismissed — condition N: reason` — failed the runnable close-out's four-condition bar.

The next runnable prompt close-out serially adjudicates every `open` row before its own recommendation
reconciliation. Escape a literal table pipe as `\|` and keep evidence falsifiable: name the missing,
contradictory, failed, or partially written artefact rather than describing frustration.

| ID | Date | Skill | Target | Failed step | Evidence | Disposition |
|---|---|---|---|---|---|---|
