# Last run report — notes-plan-prompt

Date: 2026-09-04
Target: Angular / junior / update
Status: clean

- **Plan vs reality** — The largest reconciliation this prompt has run (22 new bullets, +18% on a
  127-bullet plan) and the first where the mechanical half and the reviewer disagreed about *where the
  work was*. The arithmetic gate certified 149/149 exact, zero duplicates, zero paraphrases,
  entry-number-equals-file-number clean across 18 entries — and then returned `BLOCKED` with 5 blocking
  findings, **four of which were about entries the delta never touched**: entry 00 commissioned neither
  invariant 6 (the map of the introduction's own sections) nor invariant 7 (what `01` silently assumes),
  entry 01 carried a `Must answer` answerable only from entry 04's bullet — and its own migration line
  sends that material to 04 — and entry 08 introduced `Observable`, `subscribe()` and "cold" with no
  question defining any of them. Those four have been in the plan since 2026-08-02 and survived that
  run's cold review. The generalisable fact is that a bullet-delta run's attention follows the delta,
  and this prompt has no step that reads the finished plan whole against the standard other than the
  reviewer — so the reviewer is not a check on the delta, it is the only reader of the other 90%.
  The one finding the delta *did* produce was the fifth: entry 11 gained `Child routes and nested
  outlets` a `Must answer` had never covered, and splitting the chapter is what made the omission visible.
- **Report discipline** — One cold reviewer, one round, foreground, `deep`, with a scratch path. Nothing
  trimmed; the return carried complete acceptance proof on the first dispatch.
- **Failures & retries** — None. Required dispatches: 1; actual: 1; re-dispatches: 0.
- **Rule friction and rule breaches** — No breach. Guard 2 was reached and met for the first time under
  its post-`5870ed6b` wording: the unowned population was the 4 `_legacy/` English-only notes (580
  lines), read end-to-end, and the 14 numbered notes were classified from the entries that commission
  them. `BRCH-0002` and `BRCH-0003` therefore advance to `confirmed 1/3`. One friction point, low cost:
  the entry-number-equals-file-number rule and Planning algorithm step 6 make a same-level renumber
  mandatory and expensive to reason about, but neither says to **measure the link surface first** — this
  run's turned out to be zero (no file anywhere links to an Angular junior note by number), which is
  what made a 4-file renumber a non-decision. A run that assumed the surface was large would have
  declined a repair the prompt does not permit declining. Not worth a prompt edit on one occurrence.
  One rejection: the reviewer's non-blocking finding 6 proposed multi-number `Prerequisites` on entries
  12, 13 and 15. Rejected — `Depends on` is a linear chain in all 18 entries, and truthful dependency
  sets on three of them make the field mean two things in one file. The substance was applied instead as
  explicit borrow clauses in those entries' `Rationale`, the form entry 04 already used.
- **Verdict** — pipeline clean. No prompt edit drafted, so no cold reviewer was dispatched for one.
