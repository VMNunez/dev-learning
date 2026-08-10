# Pipeline self-report — `system-gaps`

**Date:** 2026-08-10 · **Target:** `MODE = update`, global (no per-target scope) · first run of this prompt
**Status:** applied in `fde81947`

## Close-out check — against disk

**(a) Declared files** (README's `system-gaps` row + the two universal ones):
`system/_internal/_system-gaps-report.md` ✓ written this run (`8fcd60a7`, `0ba5ad5f`) ·
`_internal/_recommendation-ledger.md` ✓ five rows `REC-088`–`REC-092` (`8fcd60a7`) ·
this report ✓ · `_internal/_run-tracker.md` ✓ (same commit as this report).
The row's negative half also holds: `git show --stat` on both content commits lists no map, prompt,
skill or live artifact.

**(b) Probe:** `git status` + `git log --name-only` across `8fcd60a7`, `0ba5ad5f`, `fde81947`. Every
declared file appears in one of them. `.claude/settings.local.json` was modified before the run started
and was never staged.

**(c) Declared dispatches:** 2 required, 2 dispatched. One `analyst` (Step 5, deep, cold, both maps +
the ten detector definitions, **not** the candidate list) and one `reviewer` (Step 7, deep, cold, scratch
path). Neither was skipped; no single-agent fallback was taken, which this prompt forbids for the final
review.

## The five bullets

1. **Plan vs reality.** The split held, and the evidence is the Step 7 reviewer, which reads the finished
   candidate table and both maps and is not written by the sweep that produced them — so its findings
   outrank the two green traces. It failed the run on **14 findings, 4 of which changed the outcome**:
   the top-ranked row was demoted out of the ledger entirely, a quote in it was found truncated in its
   own favour, the cap turned out not to be applied by rank (a hub file was sitting in the deferred set),
   and one candidate held back as a map contradiction was shown not to be one. A run whose reviewer
   changes four outcomes is a run whose orchestrator half was not sound on its own.
2. **Report discipline.** Nothing had to be trimmed or discarded; both subagents returned inside their
   contracts. One defect: the analyst's own summary line said 27 candidates over a table of 28. Trivial
   in isolation, load-bearing here — Step 5's reconciliation is arithmetic over exactly those counts, and
   it is where the run's worst draft error came from.
3. **Failures & retries.** None. Both dispatches returned on the first attempt; the standard's ladder was
   never entered.
4. **Rule friction and rule breaches.** One breach, mine. Step 3 states in its own words that §13's four
   asymmetries "are observations awaiting a `REC-054` ruling" and are dispositioned `observed`, out of the
   ledger — and I ranked one of them **first** and drafted it as the run's headline ledger row. The prompt
   was not ambiguous; I read that clause and promoted against it anyway, so it is a discipline lapse and
   not a prompt defect (bar condition 2). What it cost: two of the reviewer's fourteen findings, and had
   the mandatory gate not run, a row would have entered the ledger against an explicit prohibition — which
   is exactly the failure the no-single-agent-fallback rule exists to stop. Second, smaller: I nearly
   wrote a report that satisfied Step 8's item 4 and failed the acceptance gate's "every one of the ten
   detectors ran and is reported". Caught by reading the gate, rejected as an edit on **condition 4** —
   the acceptance gate already covers it, so a clause in Step 8 would be a second copy.
5. **Verdict.** Change worth considering, and applied: **Step 5 was silent on what to do when the two
   sweeps key the same subject at different granularity** — the orchestrator merged two candidates the
   analyst had split, "every key only one side found" had no well-defined answer, and the draft reported
   three set sizes that added up to nothing. Step 5 now requires re-keying both sides to the finer subject
   *before* comparing and reporting a real partition of the union.
   `cold reviewer: approve-with-tightening` — it replaced the drafted accounting check with the re-key
   rule, because detecting a lost subject after the merge is weaker than not merging before the compare,
   and added the guard that Step 6 may still draft a row over merged subjects.
   **maps unaffected** (the edit changed no file's contents, writer, timing, or the set of prompts and
   skills) · **map: verified** — README l.141, l.146-152, l.201, l.226-231, l.362, l.607 and
   `_system-map.md` §2 l.152-158, §7 l.260/l.262/l.264, §11 l.400, §12 l.495-518 all check out against
   the prompt read whole. One observation, deliberately **not** corrected: README l.362 and §12 l.499-500
   both gloss the edge-ledger types as seven where Step 1's table has eight (`licence` is the eighth).
   Both are em-dash glosses claiming no exhaustiveness, so correcting them would be over-reading a
   compression, and `REC-055`'s rule cuts the other way — a derived section states only what its source
   cannot say.
   Prompt length: **289 lines**, well under the ~500-line budget; no one-in-one-out was owed.
