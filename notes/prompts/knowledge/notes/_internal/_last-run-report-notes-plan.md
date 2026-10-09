# Last run report — notes-plan-prompt

Date: 2026-10-09
Target: Architecture / junior / update
Status: open

- **Plan vs reality** — The route was rebuilt for 12 new bullets (20 → 25 entries) and the first
  draft did not survive the cold review: BLOCKED, 1 blocking correction and 25 non-blocking. The
  blocking one was a bullet assigned to one entry while another entry's outcome and questions
  already taught it; three more moved entries, so the committed order is not the drafted one.
  Evidence is the reviewer's read of the whole plan, which outranks the orchestrator's mechanical
  check — green on the draft and green again after the corrections (84/84 verbatim and assigned
  once, no forward dependency, entry number = file prefix, `audit` ⇔ file on disk). The corrected
  plan was not reviewed again; the prompt asks for one review. 9 of the 26 corrections were
  clauses no `Must answer` commissioned, under questions carried from the plan committed
  2026-08-27 after the same deep review: the eighth run reproducing `REC-248`, added to that row.
- **Report discipline** — One reviewer, one round, complete acceptance proof (5 inputs read to
  EOF, 25 entries, intro, prerequisite-order and used-before-taught verdicts, a verdict token),
  persisted to its scratch path before returning. Nothing trimmed; it opened no file outside its
  five inputs.
- **Failures & retries** — Required dispatches: 1. Actual: 1. Re-dispatches: 0.
- **Rule friction and rule breaches** — Two deviations, both under `Required plan format`.
  `BRCH-0007`: three coverage bullets carry an evidence clause that wraps onto a continuation
  line, the scope-byte rule strips per line, and the format does not say what the exact bullet is
  then; the run wrote the three without the tail, as the previous plan had for one of them.
  `BRCH-0008`: the previous plan carried four audit instructions as `Must answer` items, which the
  format forbids; the run moved them to `Audit note`, and two of them (05, 24) are a rebuild and
  an expansion, outside that field's stated job. Reached and clean: `BRCH-0004` (the four notes
  were written under the label the format names) → `closed`. Not reached: `BRCH-0005` — the one
  renumber (18 → 24, English-only) had no inbound link in the repository — and `BRCH-0006`.
  Friction, not routed: `MODE` has no default (took `update`).
- **Verdict** — change worth considering, both routed to the ledger and neither applied here:
  `REC-311` (a wrapped evidence clause stays inside the coverage digest and leaves the plan's
  exact bullet undefined; its owner is `_coverage-standard.md`, which a run may not edit) and
  `REC-312` (`Audit note` has no licence for a rebuild or expansion; the second row naming that
  step, routed under the breach log's two-row rule). No edit drafted, so no cold reviewer ran.
  The prompt is 501 lines, at the smoke alarm; its largest section is `Required plan format`
  (125 lines, 275–399).
  maps unaffected.
  map: verified — `README.md` interface-index row and catalogue row for `/notes-plan`,
  `_system-map.md` §7 `notes-plan-{LEVEL}.md` row and the §11 `⚠ stale` symptom row.
