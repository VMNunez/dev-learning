# Notes-audit — last run self-report

**Date:** 2026-08-20 · **Target:** Java / junior / note 00

**Status:** rejected

1. **Plan vs reality** — The four sequential stages were sized correctly for one bilingual pair. Evidence beyond the traces: Stage C reads the finished Spanish artefact whole and did not author it, and it caught a defect that had survived Stage T — an English filename (`16-strings.md`) left in a column the translation had relabelled `Archivo en es/`, which T had reported as a deliberate decision. A post-slice catch on the one file it owns is what says the split held.
2. **Report discipline** — Nothing had to be trimmed or discarded. All four returns carried their complete heading trace and `N lines, read to EOF` on the first dispatch.
3. **Failures & retries** — None. Zero re-dispatches; the trace gate passed first time on every stage.
4. **Rule friction and rule breaches** — Stage A removed one pre-existing line under `REWRITE_MODE = standard`: the introduction's own structure-preview paragraph ("this first note follows that journey in two steps"), which the mandated introduction contract falsified once the file grew to six sections. No guard, dispatch, validation, or commit boundary was skipped. Required dispatches: 4; actual dispatches: 4.
5. **Verdict** — pipeline clean. One candidate considered and **rejected on condition 4**: a clause stating whether the introduction-contract override licenses *removing* pre-existing prose the contract falsifies, not only appending to it. `_notes-write-prompt.md` Step 3 already says "Existing prose protection never protects an incomplete introduction: TASK explicitly requires that contract", and the removed paragraph was part of that incomplete introduction — the text handles it where the friction was felt. `notes-audit.md` is 233 lines, under the ~500-line budget.
