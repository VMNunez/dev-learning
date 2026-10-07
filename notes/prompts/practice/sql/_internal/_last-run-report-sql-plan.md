# Last run report — sql-plan

Date: 2026-10-08
Target: `LEVEL = junior`, `MODE = update`
Status: clean
cold reviewer: n/a — no prompt edit drafted (see Verdict)

Outcome: **completed**. Fingerprint restamped `39aa0cfc` → `bded1b85` (152 bullets; the one new bullet
was already claimed by Step 10). Cold route review: 12 findings, 3 BLOCKING; 10 applied (one in a
different form), 1 out of this prompt's writer set, 1 sub-part declined. History gate passed. Commits
`e592aec0` (route) and `d29e9041` (projection).

1. **Plan vs reality** — same ratio as the last run: every mechanical check was green on entry
   (152/152 exact, all Section C fields, ceilings, cadence, §1 = §3 = 210), and the cold reviewer still
   returned three blocking defects that no invariant reaches. Two are done-condition satisfiability:
   Step 10's `pgAdmin:` condition was passed by three bare `CREATE TABLE`s, and Step 11's named an
   `Index Scan` that the seed would plan as a bitmap scan. The third is a dependency fault inside
   Step 0's bullet list. No separate whole-artefact pass exists beyond that reviewer, whose findings are
   this bullet's evidence.
2. **Report discipline** — nothing trimmed; the acceptance proof (lines-to-EOF, step count,
   dependency, ceiling and cadence verdicts) was present on the first dispatch.
3. **Failures & retries** — none.
4. **Rule friction and rule breaches** — no step skipped and no rule broken. Friction, not a defect:
   the reviewer is not given `sql-exercises-prompt.md`, so its proposed Step 11 repair (rewrite the
   condition over a seeded `time_entries`) contradicted the `indexes` topic's bookstore seed, which it
   could not see. The orchestrator caught that by reading the prompt and applied a `Review:` condition
   instead. The output was right, so this fails bar condition 3.
5. **Verdict** — pipeline clean; no prompt change drafted. The last report's tripwire ("a third run
   finding done-condition satisfiability → an invariant in `_sql-plan-standard.md`") fired in substance.
   It is still rejected on **condition 4**: B6 already states it, and this prompt's cold-review list
   already makes the reviewer challenge it, so both runs caught it. The leak is upstream: the 2026-10-07
   `sql-plan-audit` run rewrote Step 10's condition and kept it ungated. That evidence belongs to that
   prompt's own close-out, not here. Prompt length: 399 lines, under budget.
