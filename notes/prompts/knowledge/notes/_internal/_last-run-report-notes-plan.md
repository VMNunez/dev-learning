# Last run report — notes-plan-prompt

Date: 2026-10-03
Target: SQL / junior / update
Status: open

- **Plan vs reality** — The delta was one bullet (sequence drift, routed to 08). The cold reviewer's
  blocking findings were again outside the delta. They sat in entries 00, 02, 07 and 14, and in the
  08→12 handoffs, of a plan that a deep review passed and that was committed on 2026-08-28. 5 of its
  15 corrections were assigned bullets with no `Must answer` question commissioning them. That makes
  four consecutive runs reproducing `REC-248`, and the evidence was added to that row (`d0d08200`).
  Evidence: the reviewer's read of the whole plan. After the fixes, the mechanical re-check came back
  clean: 152/152 exact, no forward dependency, entry number = file prefix.
- **Report discipline** — One reviewer, one round, with complete acceptance proof (5 inputs read to
  EOF, 17 entries, intro and prerequisite verdicts). Nothing was trimmed. Its claims about headings
  were checked against `headings.txt` before being applied.
- **Failures & retries** — Required dispatches: 1. Actual: 1. Re-dispatches: 0. The runtime denied
  one tool call: the reviewer's preferred fix was a `git mv` renumbering five English notes, and the
  harness permission classifier blocked it. No file moved, as `git status` confirmed. The reviewer's
  own fallback was applied instead: keep the order and rewrite the 08, 10 and 11 handoffs plus 00's
  route question. Filename order still equals study order. The reorder is left for Victor to authorise.
- **Rule friction and rule breaches** — No breach and no deviation. Guard 2 was met with an empty
  unowned population: every one of the 14 English notes is plan-owned, and none was read end to end.
  As on 2026-09-16, that is not evidence for `BRCH-0002`/`BRCH-0003`, so their dispositions are
  unchanged. One piece of friction: Planning step 6 makes renumbering a standing requirement, but it
  says nothing for a runtime that refuses the file move. That cost nothing here, because the fallback
  kept the numbering equal to the order. It is recorded and not routed (condition 3: no output
  differed).
- **Verdict** — change worth considering: `REC-248`, open in the ledger and not drafted in this run.
  The prompt is 501 lines, at the smoke alarm; its largest section is `Planning algorithm`.
  map: verified — `README.md` interface-index row and catalogue row for `/notes-plan`, `_system-map.md`
  §7 `notes-plan-{LEVEL}.md` row.
