# Skill friction

Durable evidence for an **observable failed step** in one of the nineteen in-session skills. The source
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
| FRIC-0001 | 2026-09-22 | `step-complete` | `projects/07-timetrack` Step 7d pieces — Team page and user dialog (`612497a9`, `a536a9c5`): discriminated union `UserDialogResult`, disabled control read with `getRawValue()`, locale `Intl.Collator` sort | `3 — verification: no record existed to verify` | The whole-step diff `ec50e268..HEAD -- projects/07-timetrack` demonstrates `typescript/junior` "Discriminated unions" and `angular/junior` "Disabled controls and `getRawValue()`" with no `✅ 07-timetrack` on either, and a locale-aware comparison with no bullet in `javascript/junior`; none of the three was recorded as its piece landed because the session deferred every closing ritual to its end on Victor's instruction, so the per-piece triggers of `coverage-bullet-add` / `coverage-mark` never fired. Authored and marked by the close in `bf726173` | open |
