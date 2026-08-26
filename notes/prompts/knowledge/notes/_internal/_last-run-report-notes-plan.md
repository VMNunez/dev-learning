# Last run report — notes-plan-prompt

Date: 2026-08-26
Target: Java / junior / update
Status: open

- **Plan vs reality** — The trigger was one added coverage bullet (128 → 129 concepts), and the split that
  earned its keep was not the classification fan-out but the single cold pedagogical reviewer. Seventeen
  per-file analysts returned seventeen level verdicts, of which the orchestrator used two; the reviewer
  returned nineteen corrections, eleven blocking, and the three that mattered were ones no per-file
  analyst could reach because they are properties of the *route*, not of a file: the new bullet was
  filed in the wrong chapter (coverage files it under exceptions, so the run assigned it to entry 11 —
  the reviewer produced `Objects.requireNonNull` already taught in notes 03 and 05, entry 04 already
  owning boundary validation, and the frozen `00-intro-java.md` promising constructor rejection at
  entry 06, and the bullet moved to 06), entry 12 carried two mental models in 22 bullets and was split
  into 12 + 13 with 13–16 renumbered to 14–17, and four entries carried audit notes describing work
  their own files had already had done to them. Two analysts returned `requires split` and both were
  overturned — see the Verdict.
- **Report discipline** — Nothing had to be discarded. Every analyst returned the mandated
  `N lines, read to EOF` and a per-section ownership table; the reviewer returned all five proof
  elements including a corrected count for entry 00's intro invariants.
- **Failures & retries** — None. Required dispatches: 1 cold reviewer / 1 dispatched / 1 completed on
  the first attempt, plus 17 discretionary classification analysts, 17 returned.
- **Rule friction and rule breaches** — No breach; no row added to a breach log (none exists for this
  prompt). One correction was **rejected on fact**: the reviewer called the stored `Coverage SHA-256`
  fabricated, having computed the raw digest of the coverage file instead of the scope-byte digest the
  canonical command in `_coverage-standard.md` defines — the marker stripping is exactly what makes the
  two differ, and the stored value verifies against that command. It cost one verification round trip;
  the reviewer's dispatch quotes the plan but not the digest rule, and that is worth remembering before
  blaming a cold reviewer for a false positive it had no way to check.
- **Verdict** — change worth considering: `## Legacy notes requiring split` still has no graded form.
  An analyst that finds a sub-section of higher-level prose inside a junior-owned chapter can only say
  `requires split`, which blocks the entire run, or say nothing. Five analysts across two runs have now
  hit that boundary — three on 2026-08-02, two today (the record compact constructor in `06-oop-classes.md`
  for the second time, and `Collectors.groupingBy` in `12-streams-lambdas.md`) — and all five were
  correctly resolved as prose trims routed into per-entry audit notes, every one of them by the
  orchestrator overruling a subagent verdict rather than by the vocabulary offering the right one. The
  previous report declined to propose this on the grounds that one run is not evidence. Two runs are.
  Prompt is 466 lines, inside the ~500-line budget, so the draft is an addition with nothing owed out.

  cold reviewer: **reject** — it ruled the finding fails condition 3 (no run was blocked; the harm is the hypothetical run with less headroom) and condition 4 (step 2's `keep` already *is* the graded verdict, and `Action: audit` already routes the trim), and it caught a real defect in the draft: `keep + trim` named a per-entry "audit note" that the Required plan format does not list as a field. The finding therefore stays open with the reviewer's own cheaper form on record — tighten step 7's "substantive sections" to "**whole** substantive sections" rather than add a sixth vocabulary value. Nothing was applied to the prompt.

  maps: **corrected** in 0a92412f, its own commit — `_system-map.md` §7's `notes/{topic}/{level}/en|es/*.md` row and `README.md`'s catalogue `Generates` cell both omitted that this prompt renames note pairs and repairs their inbound links; this run renamed 8 files and repaired 80 links across 21 files, including prompt-system machinery.
