# Last run report — notes-plan-prompt

Date: 2026-10-03
Target: Angular Material / junior / update
Status: rejected

- **Plan vs reality** — The delta was 21 new bullets and 1 removed one, and it did not fit the
  16-entry route: the committed plan has 25 entries. Evidence is the cold reviewer's read of the whole
  draft, which outranks the orchestrator's own route validation: step 14 had passed a draft that
  taught a Sass theme with no Sass, chose between a tab group and routes without teaching the tab
  group, and taught the loading pattern six chapters before the bullet that corrects it. The reviewer
  returned BLOCKED with 10 blocking and 20 non-blocking corrections; all 30 were applied, 5 in a
  modified form after the orchestrator checked their premises against the files and the installed
  library. 6 of the 10 blocking ones were assigned clauses no `Must answer` commissioned — the sixth
  run reproducing `REC-248`, and the first where a lead-phrase match would have passed every hit;
  added to that row. The corrected route was re-checked mechanically (96/96 exact, no forward
  dependency, entry number = file prefix, `audit` ⇔ file on disk, every handoff names the next
  chapter) and was **not** reviewed again: the prompt asks for no second review, so the reorder that
  put the button before theming and the bullet moved from 23 to 17 are the reviewer's proposals as
  the orchestrator wrote them.
- **Report discipline** — One reviewer, one round, complete acceptance proof (5 inputs read to EOF,
  25 entries, intro and prerequisite verdicts, a verdict token). Nothing trimmed. It also read
  `_session-rules.md`, outside its five inputs, as rules and not as evidence.
- **Failures & retries** — Required dispatches: 1. Actual: 1. Re-dispatches: 0. The 13 `git mv`
  renumbers ran without a denial.
- **Rule friction and rule breaches** — One breach, `BRCH-0005`: `Planning algorithm` step 6 says
  only the link target changes in a file that links to a renumbered note, and the plan commit
  `5c0a9d4a` also rewrote one link's label (`[05-select.md]` → `[07-select.md]`); `f1fb8467` restored
  it, so the note now shows a label naming the old number until entry 09 is audited. Guard 2 was met
  on a non-empty population — the 2 unowned notes were read end to end — so `BRCH-0002` and
  `BRCH-0003` close at 3/3; `Audit note` was written as the format names it, so `BRCH-0004` advances
  to `confirmed 1/3`. Friction, not routed: `MODE` has no default (took `update`); the reviewer is
  given the selected coverage only, so an `Audit note` that says a section belongs to a sibling level
  is a claim it cannot check — the orchestrator checked it against `middle.md`.
- **Verdict** — pipeline clean, no prompt change. `BRCH-0005` fails condition 2 (the rule is stated
  clearly; first row for that step). The two frictions fail condition 3 (no output differed).
  `REC-248` stays open in the ledger. The prompt is 501 lines, at the smoke alarm; its largest section
  is `Required plan format` (125 lines, 275–399).
  maps unaffected.
  map: verified — `README.md` interface-index row and catalogue row for `/notes-plan`,
  `_system-map.md` §7 `notes-plan-{LEVEL}.md` row.
