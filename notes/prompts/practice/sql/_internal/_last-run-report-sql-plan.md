# Last run report — sql-plan

Date: 2026-08-03
Target: `LEVEL = junior`, `MODE = update`
Status: open

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
5. **Verdict** — change worth considering: **the migration spec should move §8b's per-point table
   (points, spans, and the files each re-drills) into the route alongside §5/§6/§8**, leaving the cadence
   and the failure-driven focus mechanism in the doctrine. Evidence is this run: the route now owns its
   revision-file table while the spans that define those same points stayed behind, and the first
   ordering change the cold reviewer asked for was blocked by exactly that split. It clears the bar —
   real (it happened), the prompt is silent where it needed to speak, and it changed the result (two
   accepted findings went unapplied). Not drafted as an edit here: the fix belongs to
   `_sql-plan-standard.md` §A1/§A2 and the doctrine as much as to this prompt, so it is a
   `sql-plan-audit` scope decision rather than a one-line prompt tightening, and the tie goes to `open`.
   Prompt length: `sql-plan-prompt.md` is 392 lines, under budget.
