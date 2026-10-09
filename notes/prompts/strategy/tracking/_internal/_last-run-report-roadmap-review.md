# Pipeline self-report — roadmap-review

**Date:** 2026-10-09 · **Target:** `ROADMAP.md` (branch `projects/07-timetrack`) · **Status:** open

1. **Plan vs reality** — the split never completed: 2 of the 4 mandated dispatches ran (both
   fact-gatherers), 2a returned `STOPPED` at its parity gate, and Steps 3–6 with both reviewers were
   not reached. Evidence is the orchestrator's own re-run of the validator, not 2a's word: exit 1,
   three errors, no `PASS: coverage mirror parity` line. No step read a finished artefact, because
   none was produced — `ROADMAP.md` is untouched and nothing is claimed about it.
2. **Report discipline** — both reports held their contract: 2a stopped without a gap list and quoted
   the validator's errors; 2b opened with `2840 lines, read to EOF` and stayed under its bound.
3. **Failures & retries** — no dispatch failed and none was re-dispatched; a missing parity proof is
   the one report this prompt forbids working around. The `▶ Run first` was met by repair, not by the
   run having happened: the 2026-10-09 drift report named two rows and both owners ran first
   (`94651084`, `c30c8ede`). The second owner's own text forbade that write (`SBRC-0032`).
4. **Rule friction and rule breaches** — no rule broken by the run; two workarounds of Step 2's text,
   both logged as `BRCH-0001`. (i) The doer paragraph orders "name `/coverage-audit` as the repair"
   while 2a's instruction forbids reporting a mirror problem it did not observe: the validator failed
   on three notes plans claiming `current` over a mismatching Coverage SHA-256 (architecture,
   security, spring-boot), so this run named `/notes-plan` on those three instead. (ii) The step says
   "All 13 topics", "thirteen topic files" and "~1359 junior bullets"; the registry holds 14 since
   HTML and the junior total is 1589, so 2a's dispatch said "every topic in the registry". Friction
   with no row: the parity line is hostage to every other invariant of the validator, and those three
   plans have carried `⚠ stale` tracker flags since 2026-09-22/24 — this prompt has been unrunnable
   since then, by a stop the prompt states clearly.
5. **Verdict** — change worth considering: Step 2's stale counts and its unconditional
   `/coverage-audit` repair. The prompt is 519 lines, over the ~500 alarm; its largest section is
   Step 2 at 127. The validator coupling is recorded, not applied — condition 2: the stop is stated
   clearly, and the debt is three `⚠ stale` tracker cells `/notes-plan` clears, a cell and not a row.
