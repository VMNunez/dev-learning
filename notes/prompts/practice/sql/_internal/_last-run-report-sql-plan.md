# Last run report — sql-plan

Date: 2026-08-03
Target: `LEVEL = junior`, `MODE = update`
Status: applied in 49c1e62
cold reviewer: approve-with-tightening (edits A and C) · reject (edit B)

Outcome: **completed**. Guard 4 now passes (149/149 bullets, 18/18 sections identical to the mirror), so
the run that was blocked on 2026-08-03 went through: the one-time doctrine migration ran, and
`practice/sql/junior/PLANNING-junior.md` was written and reconciled against the recalibrated coverage.

1. **Plan vs reality** — the split was right, and this pipeline has the whole-artefact step the spec asks
   about: the cold route reviewer reads the finished plan end to end and is not written by any slice
   owner, so its findings outrank the traces. It returned 18 numbered corrections against a plan that had
   already passed every mechanical check (149/149 assigned once, verbatim, ceilings held) — which is the
   measure that matters: the mechanical half of this prompt cannot see a `Why here` that is a label, a
   done condition that is not verbatim, or a step whose target is a flat 12 inherited from a coverage file
   that no longer exists. Eleven were applied. The mechanical checks were run locally rather than by a
   dispatched checker; that is within the prompt's contract (only the route reviewer is mandated) and
   they were scripted against disk, not eyeballed.
2. **Report discipline** — nothing trimmed. The reviewer returned findings only, with the four-part
   acceptance proof present on the first dispatch; no re-dispatch was needed.
3. **Failures & retries** — none.
4. **Rule friction and rule breaches** — no mandatory step skipped; no guard bypassed. One genuine
   friction point, and it cost a finding: the prompt tells this run to **apply** every accepted reviewer
   finding, but two accepted ones (reorder DML ahead of the window-function and date steps, per
   `ROADMAP.md`'s own Stage-2 switch gate; and the "screening core" claim that depends on that order)
   cannot be applied here — the revision points' **spans are still level-specific content sitting in the
   doctrine's §8b**, which this prompt may not edit outside the migration. So a correct, blocking,
   route-level finding is only reportable, and the file it needs changed belongs to `sql-plan-audit`.
   That is a real seam in the doctrine/route split, not friction with this run's wording: §8b was
   supposed to keep the *mechanism* and hand the *points* to the route, and the migration spec (§5/§6/§8
   only) does not move them.
5. **Verdict** — change applied: **the standard's A2 never gave the revision points' spans and triggers a
   home in the route, so the doctrine kept the authoritative copy and a step-ordering correction became
   unapplicable.** Evidence is this run: two accepted BLOCKING findings from the cold route reviewer
   (reorder DML ahead of the date/string and window-function steps per `ROADMAP.md`'s Stage-2 switch
   gate, and the "screening core" claim depending on it) went unapplied for exactly that reason. Clears
   the bar: real, the standard was silent where it needed to speak, and it changed the result.

   **This bullet was first written as "the migration spec should have moved §8b's table", which is
   wrong and is corrected here.** A1 §8b already assigned the points to the route; the migration had
   nowhere to move them *to*, because A2 lists only header/§1/§2/§3 and its §1 cell names the revision
   *files* and not their spans. The cold reviewer caught the misdiagnosis and also established that the
   migration section must not be touched at all — it is junior-only, one-time, and already spent.

   Two edits applied in `49c1e62`, both as tightenings of existing lines rather than additions:
   `_sql-plan-standard.md` A2 §1 now requires the span and trigger columns and names the route their
   single source, and A1 §8b now forbids the doctrine from restating them. A third proposal — adding a
   `Learning outcome` field to Section C, raised by Victor after the run — was **rejected by the cold
   reviewer on bar condition 3**: the route reviewer caught label-shaped `Why here` lines and mis-sized
   targets without it, and `Done`, `Q&A seed` and `Concepts` already carry the observable-outcome
   information three times over. Recorded so it is not re-proposed; if the pedagogical bite is wanted,
   the place to spend it is tightening Section C's `Why here` line, not a fourteenth field.

   One follow-up this prompt may not perform, left for `sql-plan-audit`: the doctrine's own R1–R5 table
   and its Spanish paragraph restating the step spans are now the duplicate the tightened A1 forbids,
   and the route's revision table needs the `Trigger` column when they are stripped.
   Prompt length: `sql-plan-prompt.md` 395 lines, `_sql-plan-standard.md` 278 — both under budget, so
   one-in-one-out did not apply.
