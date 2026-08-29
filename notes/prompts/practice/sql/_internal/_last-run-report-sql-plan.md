# Last run report — sql-plan

Date: 2026-08-28
Target: `LEVEL = junior`, `MODE = update`
Status: clean
cold reviewer: n/a — no prompt edit drafted (see Verdict)

Outcome: **completed**. No coverage drift — the fingerprint was unchanged, so nothing in the
reconciliation half of the run had anything to do. The whole value came from the cold route review:
15 findings, 7 BLOCKING, 13 applied. No status, count or `[x]` moved; `PROGRESS.md` was already
in sync and was not rewritten.

1. **Plan vs reality** — the reconciliation stage did nothing and the review stage did everything, and
   that ratio is the finding. Every mechanical check was green on entry and still green on exit
   (151/151 bullets assigned once and verbatim, §1 and §3 both 209, all 14 steps carrying every
   Section C field, ceilings held, cadence held) — and the reviewer returned seven blocking defects
   against that same plan. Two are the sharpest this pipeline has produced: Step 12's done condition
   (`Terminal: \dt inside psql produces users, projects and time_entries`) was **already true** because
   project 07's database exists, so it gated nothing and would have fired R5 on an undrilled step; and
   Step 11's required 100 000 seeded rows had no seeder anywhere in the route, so nobody else could run
   it and get a verdict. Both are B6 failures that every count in the file passes over, because a
   done condition's *format* is checkable mechanically and its *satisfiability* is not.
2. **Report discipline** — nothing trimmed. Four-part acceptance proof present on the first dispatch;
   no re-dispatch.
3. **Failures & retries** — none.
4. **Rule friction and rule breaches** — no mandatory step skipped, no guard bypassed, no rule broken;
   the breach log stays absent. `REC-178` is closed: doctrine §8c now holds the rule only and the
   readiness mapping is a column of route §3, so the ordering finding that two consecutive runs accepted
   and could not apply would today be applicable. It did not recur — the reviewer did not re-raise the
   DML ordering — so the fix is untested by this run rather than confirmed by it.
5. **Verdict** — **no prompt change drafted.** `sql-plan-prompt.md` behaved correctly end to end and
   the run needed no workaround. Bar condition 2 fails: the prompt was neither wrong nor ambiguous.

   **What is worth recording beyond that:** this is the first run whose blocking findings were *all*
   invisible to the invariants, and the pattern in them is one thing — the plan is checked for
   **internal** consistency and never against the world it asserts facts about. Invariant 7 checks a
   `Done:` line against §3's format list; nothing checks whether the condition is already satisfied, or
   whether the state it presumes is ever created by the route. Two of the seven were exactly that.
   A third class was the same shape one level down: `**Focus:**` and `**Concepts:**` lines naming
   `USING`/`NATURAL JOIN`, `LAG`/`LEAD` and CTE pre-aggregation — scope with no coverage bullet, or
   scope a later step teaches — which invariant 9's second direction is worded for but only in the
   plan→prompt direction, never plan→coverage. If a third run finds the same class again, the candidate
   is an invariant over done-condition satisfiability, and it belongs to `_sql-plan-standard.md`
   (owner `sql-plan-audit`), not here.

   Prompt length: `sql-plan-prompt.md` 395 lines, `_sql-plan-standard.md` 327 — both under budget, so
   one-in-one-out did not apply.
