# Last run report — notes-plan-prompt

Date: 2026-10-03
Target: Angular / junior / update
Status: applied in a4e8f944

- **Plan vs reality** — The delta was 24 new bullets and 1 reworded one, 10 of them in routing, and it
  did not fit the 18-entry route: the reconciled draft had 25 entries and the committed plan has 28.
  Evidence is the cold reviewer's read of the whole draft, which outranks the orchestrator's own route
  validation: step 14 had passed a draft that taught signals in chapter 08 while `input()` in 04 is a
  signal. The reviewer returned BLOCKED with 4 blocking and 23 non-blocking corrections; all were
  applied. 13 of its findings were assigned bullets no `Must answer` commissioned, every one under a
  question carried verbatim from the 2026-09-04 plan — the fifth run reproducing `REC-248`, added to
  that row in `55e6bebf`. The corrected 28-entry route was re-checked mechanically (173/173 exact, no
  forward dependency, entry number = file prefix, `audit` ⇔ file on disk) and was **not** reviewed
  again: the prompt asks for no second review, so three splits adopted from the reviewer are its
  proposals as the orchestrator wrote them.
- **Report discipline** — One reviewer, one round, complete acceptance proof (5 inputs read to EOF,
  25 entries, intro and prerequisite verdicts). Nothing trimmed.
- **Failures & retries** — Required dispatches: 1. Actual: 1. Re-dispatches: 0. The 13 `git mv`
  renumbers ran without a denial.
- **Rule friction and rule breaches** — One deviation, `BRCH-0004`: `Required plan format` names no
  field for the section moves an entry owes, so the plan commit `2738c480` wrote them under
  `Existing-content migration:`, the label this plan had carried since 2026-09-04. `notes-audit`
  forwards only `Audit note` in `LINK_TARGETS`, so 26 lines reached neither stage A's task, stage T,
  nor any sibling entry's run; the close-out relabelled them in `2a81400d`. (Stages B and C are handed
  the entry itself, so "readable by no stage", as the `BRCH-0004` row words it, overstates.) Guard 2 was met on a non-empty population — the 4 unowned `_legacy`
  notes were read end to end — so `BRCH-0002` and `BRCH-0003` advance to `confirmed 2/3`. Friction,
  not routed: the configuration gives `MODE` no default and the launcher makes it optional; the run
  took `update` (condition 3: no output differed).
- **Verdict** — change applied: `Required plan format` now names `Audit note` as the one optional
  entry field and its position. `REC-248` stays open in the ledger. The prompt is 501 lines, at the
  smoke alarm, net-neutral after the edit (+3, −3); its largest section is `Planning algorithm`.
  cold reviewer: approve-with-tightening
  maps unaffected.
  map: verified — `README.md` interface-index row and catalogue row for `/notes-plan`,
  `_system-map.md` §7 `notes-plan-{LEVEL}.md` row.
