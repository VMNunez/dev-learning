# Last run report — sql-plan

Date: 2026-08-28
Target: `LEVEL = junior`, `MODE = update`
Status: open
cold reviewer: n/a — no prompt edit drafted (see Verdict)

Outcome: **completed**. Coverage had grown 149 → 151 bullets since the last plan, so the route was
reconciled: both new bullets landed on Step 10, its target rose 14 → 16 (runs 8 + 8), totals 207 → 209,
and the fingerprint was refreshed. Eight of the cold reviewer's ten findings were applied, one rejected,
one accepted-and-unapplicable.

1. **Plan vs reality** — the split held, and this pipeline has the whole-artefact step the spec asks
   about: the cold route reviewer reads the finished plan end to end and owns no slice of it, so its
   findings outrank the mechanical traces. That distinction did real work here. Every mechanical check
   came back green — 151/151 bullets assigned exactly once and verbatim, §1 and §3 both summing to 209,
   all fourteen steps carrying every Section C field, ceilings held — and the reviewer still returned
   ten findings against that plan, four BLOCKING. The two that matter were invisible to any count:
   Step 1's `**Focus:**` line named `EXISTS`/`NOT EXISTS`, whose bullets belong to Steps 4 and 5, and
   the prompt greps that exact line — so the route would have generated correlated-subquery exercises
   four steps before the syntax is taught, and nothing that counts bullets could have seen it. Step 4's
   `Concepts:` line likewise named `IS DISTINCT FROM`, which has no coverage bullet at any level. Both
   are dead instructions of invariant 9's second direction, and both predate this run.
2. **Report discipline** — nothing trimmed. The four-part acceptance proof was present on the first
   dispatch; no re-dispatch needed.
3. **Failures & retries** — none.
4. **Rule friction and rule breaches** — no mandatory step skipped, no guard bypassed, no rule broken;
   the breach log stays absent. One friction point, and it is the same seam as the last run in a
   different section. The prompt tells this run to apply every accepted reviewer finding. The
   reviewer's BLOCKING ordering finding — DML sits behind 24 exercises of dates and window functions,
   which `ROADMAP.md`'s Stage-2 gate names as *not worth delaying simulations for* — is the finding the
   2026-08-03 run also accepted and also could not apply. Last time the blocker was the revision spans
   sitting in doctrine §8b; `49c1e62` fixed that. This time it is **§8c**, one section below, whose
   technique→step table is keyed by step number and is doctrine. Applying the reorder would silently
   falsify the table another track reads to decide whether a simulation is possible. Filed as
   `REC-178`, and the route was left in its current order rather than half-corrected.
5. **Verdict** — **no prompt change drafted; the defect is not this prompt's.** `sql-plan-prompt.md`
   behaved correctly at every step: it dispatched the reviewer, got the finding, and correctly refused
   to edit a file it does not own. Bar condition 2 fails — the prompt was neither wrong nor ambiguous,
   and rewriting an already-correct fence would bury the lesson. The defect is in `_sql-plan-standard.md`
   A1 §8c, whose owner is `sql-plan-audit`, so it is a ledger row (`REC-178`) and not an edit here.

   **What is worth saying beyond that row:** the same class of finding has now been raised, accepted and
   left unapplied by two consecutive runs of this prompt, each time blocked by a *different* section of
   the doctrine holding a level-specific copy. That is the signal — not that §8b or §8c is individually
   wrong, but that the 2026-08-03 doctrine/route split enumerated which sections moved (§5, §6, §8)
   instead of stating the principle, so the level-specific residue is being found one section at a time
   by whichever run next trips over it. If `REC-178`'s resolver finds a third site, the fix is the rule,
   not the section.

   Prompt length: `sql-plan-prompt.md` 395 lines, `_sql-plan-standard.md` 316 — both under budget, so
   one-in-one-out did not apply.
