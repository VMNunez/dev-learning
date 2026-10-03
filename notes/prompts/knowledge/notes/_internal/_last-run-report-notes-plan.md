# Last run report — notes-plan-prompt

Date: 2026-10-03
Target: Angular / junior / update
Status: rejected

- **Plan vs reality** — The coverage fingerprint matched the plan committed the same day
  (`090fc362`), so reconciliation moved nothing and the run's whole yield came from the cold review:
  PASS-WITH-CORRECTIONS, 25 non-blocking corrections on a route that had passed the same deep review
  hours earlier. 24 were applied, 10 of them in a modified form after the orchestrator checked their
  premises against the note files, `middle.md` and angular.dev; 1 was rejected (splitting entry 18,
  which the reviewer itself made conditional). Evidence is the reviewer's read of the whole plan,
  which outranks the orchestrator's mechanical validation — green before the review and after it. 5
  of the 25 were clauses no `Must answer` commissioned: the seventh run reproducing `REC-248`, added
  to that row. The corrected plan was re-checked mechanically (173/173 exact, no forward dependency,
  entry number = file prefix, `audit` ⇔ file on disk) and was not reviewed again.
- **Report discipline** — One reviewer, one round, complete acceptance proof (5 inputs read to EOF,
  28 entries, intro, prerequisite-order and used-before-taught verdicts, a verdict token). Nothing
  trimmed; it opened no file outside its five inputs.
- **Failures & retries** — Required dispatches: 1. Actual: 1. Re-dispatches: 0.
- **Rule friction and rule breaches** — One deviation, `BRCH-0006`: no step asks the planner to look
  for a section of a plan-owned file that a sibling-level bullet owns, and the reviewer is given the
  selected coverage only, so the run wrote that ownership into two `Audit note` fields on its own
  reading of `middle.md` (13 `fromSignal()`, 22 `ChangeDetectorRef`); the run earlier today had
  committed 22 with no note. `Audit note` was written under the label the format names, so
  `BRCH-0004` advances to `confirmed 2/3`. `BRCH-0005` is unchanged: no renumber, so step 6's link
  rewrite was not reached. Friction, not routed: `MODE` has no default (took `update`).
- **Verdict** — pipeline clean, no prompt change. `BRCH-0006` fails condition 3: `Audit note` is
  optional and each entry's bullets and questions already exclude the sibling-level concept, so no
  output was wrong or missing a required part. `REC-248` stays open in the ledger. The prompt is 501
  lines, at the smoke alarm; its largest section is `Required plan format` (125 lines, 275–399).
  maps unaffected.
  map: verified — `README.md` interface-index row and catalogue row for `/notes-plan`,
  `_system-map.md` §7 `notes-plan-{LEVEL}.md` row.
