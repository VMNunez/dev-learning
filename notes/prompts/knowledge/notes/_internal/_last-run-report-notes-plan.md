# Last run report — notes-plan-prompt

Date: 2026-08-28
Target: Java / junior / update
Status: clean

- **Plan vs reality** — A one-bullet reconciliation, and the cold reviewer was again the only evidence
  beyond "the machinery ran". The mechanical half certified 130/130 exact bullets, zero duplicates,
  zero paraphrases, entry-number-equals-file-number clean across all 18 entries — and the reviewer
  still returned 8 corrections, 2 of them blocking, on a delta of one bullet and one question. Both
  blocking ones were the same seam: the new `Must answer` on entry 06 asks what the compiler hands a
  class that declares no constructor, which is entry **08**'s `Constructor defaults and chaining`
  bullet, so the run had written a concept-used-before-taught into an entry that declares its other
  two scaffolding borrows (`throw`, `protected`) explicitly. Fixed by declaring the borrow in 06's
  `Rationale` and marking the seam in 08's own question. Worth recording because it generalises: the
  arithmetic gate cannot see a *question* that reaches outside its entry, only a *bullet* that does,
  and a one-bullet delta is exactly the size at which a run stops expecting to be corrected.
- **Report discipline** — One cold reviewer, one round, foreground, `deep`. Nothing trimmed.
- **Failures & retries** — None. Required dispatches: 1; actual: 1; re-dispatches: 0. Acceptance proof
  complete on the first return (`N entries reviewed: 18`, intro verdict, prerequisite-order verdict,
  8 numbered corrections with blocking marks).
- **Rule friction and rule breaches** — One breach, `BRCH-0003` (`this prompt`, Guard 2, `open`): the
  16 English notes (8,245 lines, 700K) were not read end-to-end; the 2026-08-26 classifications were
  carried forward on a content-commit proof plus a complete heading inventory. The named cause is new
  and is not cost: ~200k tokens of prose against a 200k context window means the read does not fit in
  the run obliged to perform it. Filed as the third data point on `REC-177` (`5b0b5b8a`, committed
  alone, which is `BRCH-0001`'s lesson applied). The three runs now disagree only on size — 2,024
  lines met the guard, 8,245 and 9,508 did not — so the row is no longer about "reconciliation" at
  all. One acceptance, one rejection on the reviewer's non-blocking findings: correction 4 was applied
  without its closing clause, which asserted that entry 00 "is not eligible for `Studied`" — a rule no
  contract in this system states, and `Studied` is not this prompt's field to gate.
- **Verdict** — pipeline clean. No prompt edit drafted, so no cold reviewer was dispatched for one.
  The Guard 2 finding is not a prompt edit this run may make: it is `REC-177`'s to resolve, and
  editing the guard inside the run that breached it is the entangled pattern the refinement step
  forbids.
