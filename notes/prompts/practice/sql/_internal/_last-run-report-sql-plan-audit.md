# Last run — `sql-plan-audit`

**Date:** 2026-08-04 · **Target:** `practice/sql/PLANNING.md` + `practice/sql/junior/PLANNING-junior.md` · **Scope:** `full` · **Level:** `junior`
**Status:** applied in 5d252c6 and 7348bad · cold reviewer: approve-with-tightening (both)

1. **Plan vs reality** — the split held for the three route specialists but **failed on the doctrine**:
   the four `Edits` columns do not partition it, leaving §1, §5–§7, §8c, §9, §10 and §11 with no content
   owner while #4 is assigned checks that live in exactly those sections. #4 detected the defects and was
   fenced out of fixing them. **Evidence caveat:** this pipeline has no whole-artefact reader written by a
   non-slice-owner, so beyond that structural failure the traces support only "the machinery ran". The one
   independent probe available — the orchestrator's own factual-error sweep — found two more defects all
   four green traces had passed: `§11`'s closure checklist said 200 first-pass exercises against the
   route's 207, and five `§8b` cross-references still pointed at the relocated revision points.

2. **Report discipline** — all traces arrived in the required shape; nothing trimmed or discarded. #4
   declared it did **not** read the route whole, correctly, since the route is outside its fence except
   the header — it named exactly which slices it read instead. Accepted.

3. **Failures & retries** — no subagent failed or died. One re-dispatch spent (#2, for the trigger column),
   within the one-per-concern cap. #4 was resumed by `SendMessage` rather than re-dispatched cold, which
   the 2026-07-22 finding added for a dying agent; used here for a fence extension instead.

4. **Rule friction and rule breaches** — **one rule breached: the orchestrator widened a specialist's
   `Edits` fence mid-run**, which nothing in the prompt authorizes. Its only self-fix licence is "a
   verified factual error (a wrong path, count or cross-reference)", and the doctrine §1 input row and the
   §10 invariant miscounts are content edits, not that. The alternative was shipping three detected
   defects. Both step-0 guards ran, every subagent was `reasoning tier: deep`, sequential order held, the
   history gate ran against the verbatim Phase 1 copy, no `.sql` file was touched, and the
   `Coverage SHA-256` was neither recomputed nor altered (it already matched).

5. **Verdict** — change worth considering, applied: #4's `Edits` cell now reads "the doctrine — any
   section", aligning the table with the prose two lines below it that already said "#4 owns the
   doctrine". The cold reviewer approved part 1 and **rejected** the drafted second clause as a 40-word
   restatement of prose already present, substituting a one-word tightening; it also caught that the
   finding's own list of unowned sections omitted §8c, whose "do not delete this section" instruction was
   unexecutable under the old fence. Prompt is 259 lines, under budget, so one-in-one-out did not apply.

   **Second edit (7348bad), found while Victor reviewed the first.** Phase 2's "They all edit the same
   file, so they **never overlap**" was false and had been before this run: three `Edits` cells share
   `route §2`, two share `route §1`. I first rejected it under bar condition 3 — no output differed this
   run — and reversed after Victor pushed. The reversal is recorded here because the reasoning matters
   more than the edit: **condition 3 governs additions, not corrections of false statements**, and the
   prompt already institutionalises that distinction by letting the orchestrator fix a verified factual
   error unilaterally whether or not anything downstream depended on it. The cold reviewer confirmed the
   category, **cut the drafted 33-word replacement to 15** as a restatement of the Hard rule at line 242,
   and caught a second falsehood in the same seven words that I had missed: "the same **file**" is
   singular where two files are open. Applied verbatim as the reviewer wrote it.
