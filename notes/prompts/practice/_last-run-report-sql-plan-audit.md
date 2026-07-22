# Last run — `sql-plan-audit`

**Date:** 2026-07-22 · **Target:** `practice/sql/PLANNING.md` · **Scope:** `full` (first run)
**Status:** applied in d571c0f

1. **Plan vs reality** — the 2 → 1 → 3 → 4 order held: #2 found no coverage gaps, so the "extension
   engine first" rationale was never exercised, but #4 running last was decisive — it deleted sections
   #1 and #3 had just edited, and the two collision warnings passed to it (§3's condition sentence,
   R3-vs-G6-R) both landed on real edits. Slice sizing was uneven: #4 owned Section A cell-by-cell
   *plus* the whole scope fence and returned 40 tool uses to #2's 6.

2. **Report discipline** — all four traces arrived in the required shape, read-to-EOF line present,
   no plan content pasted back. Nothing trimmed or discarded.

3. **Failures & retries** — **#1 was killed mid-run by an API session limit**, after its audit was
   complete but before it wrote a single fix; the tree held only #2's edits. Recovered by `SendMessage`
   to the same agent id, which resumed from transcript and applied everything. No re-dispatch was spent
   and no work was redone. The prompt has no protocol for this: it covers a subagent returning a bad
   report, not one dying with good conclusions unwritten.

4. **Rule friction and rule breaches** — no rule breached: both step-0 guards ran, every subagent was
   `model: opus`, sequential order held, no `.sql` file or `sql-exercises-prompt.md` was touched, the
   history gate ran against the verbatim Phase 1 copy. Friction: the prompt names the file table as §5
   and the progress table as §9, but the plan's live numbering puts progress at §8 and gates at §9 —
   the orchestrator had to resolve which table the history gate protects. Second: the plan had no §Z at
   all, so the scope fence's "collapsed into one §Z line" required #4 to create the section first.

5. **Verdict** — change worth considering: the prompt should say what to do when a subagent dies with
   its audit done but its edits unwritten (resume by agent id, do not re-dispatch cold). Real evidence
   (#1), the prompt is silent where it needed to speak, and it changed the result — a cold re-dispatch
   would have re-derived a 90k-token audit. Held `open` rather than applied: the recovery worked, so
   the finding needs a second occurrence to prove the resume is the right general answer rather than
   luck of a warm transcript. **Overturned by the cold reviewer**, which approved-with-tightening: the
   token-saving framing above fails condition 3, but the real defect is that no gate fires on a
   *silent* specialist, so the default is to advance to #3/#4 and ship a plan whose Section B/C fixes
   were never written — a wrong artifact, not a slow one. Applied in that reviewed form, with the
   fallback the draft lacked.
