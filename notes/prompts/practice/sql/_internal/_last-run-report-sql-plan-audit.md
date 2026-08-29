# Last run — `sql-plan-audit`

**Date:** 2026-08-28 · **Target:** `practice/sql/PLANNING.md` + `practice/sql/junior/PLANNING-junior.md` · **Scope:** `full` · **Level:** `junior`
**Status:** applied in 58a9fa53 · cold reviewer: approve-with-tightening

1. **Plan vs reality** — the split worked, and the evidence for that is **not** the four green traces.
   This pipeline still has no whole-artefact reader written by a non-slice-owner (`plan-audit`'s
   `whole-plan` pass has no equivalent here), so on their own the traces support only "the machinery
   ran". What they do support this time is stronger than usual because the split **routed a finding
   across two fences and it landed**: #3 detected a stale doctrine sentence outside its own fence,
   declared it as a ripple, and #4 — the one specialist that owns the whole doctrine — resolved it.
   That is the `2026-08-04` structural failure (§1, §5–§7, §8c, §9, §10, §11 with no content owner)
   confirmed fixed by the widened `Edits` cell, exercised for the first time. The orchestrator's own
   factual-error sweep, the one independent probe available, found nothing the traces had passed: it
   re-verified #4's key-set claim against `sql-exercises-prompt.md`'s `## Configuration` block and
   #3/#4's 209 against the §1 column sum, and both held. **What the sweep did catch is a false positive
   in a trace, and it is the one machinery fact worth keeping:** #4 reported route Step 12's
   `Terminal: \dt inside psql` as suspect against Victor's pgAdmin environment, without reading the
   sentence two lines above the done condition that declares psql deliberate ("the one step where you
   deliberately leave pgAdmin"). A specialist reporting *outside* its own fence reads the line, not the
   step around it — cheap to check and cheap to dismiss, but a run that applied it would have broken a
   step on purpose.

2. **Report discipline** — all four traces arrived in the required shape; nothing trimmed or discarded.
   #4 correctly declared it read the route in named slices only (header-only fence) rather than whole,
   as did #2 for the doctrine. Accepted.

3. **Failures & retries** — no subagent failed, died or returned `BLOCKED`. Zero re-dispatches spent;
   both budgets (acceptance-check and Ripples) untouched.

4. **Rule friction and rule breaches** — **no rule breached.** Both step-0 guards ran, the branch guard
   passed (`fix/backend-backlog`, not `main`), every subagent was `reasoning tier: deep`, the 2 → 1 → 3
   → 4 order held sequentially, the history gate ran against the verbatim Phase 1 copy of §1 and §3, no
   `.sql` file was touched or staged, `PROGRESS.md` was audited and not edited, and the
   `Coverage SHA-256` was neither recomputed into the file nor altered. **One friction, and it is the
   candidate below:** Phase 1 cites the digest command's home as "`_coverage-standard.md`" with no path.
   The file is at `notes/prompts/knowledge/coverage/_internal/_coverage-standard.md`; the bare name
   resolves to nothing and cost one failed lookup before a repo-wide grep found it.

5. **Verdict** — change worth considering: **Phase 1's `Coverage SHA-256` bullet names
   `_coverage-standard.md` without its path and without the "never a plain `sha256sum`" warning that
   `plan-audit.md` and `_plan-write-prompt.md` both carry at their own digest sites.** This is not
   cost-only friction: the canonical command strips `✅` evidence markers before hashing, so an executor
   that cannot find the file and falls back to a plain `sha256sum` gets a mismatch on a route that is
   in fact current, and this prompt's contract then prints `route stale — /sql-plan junior owed` and
   sends Victor to re-run the planner for nothing. The output differs and is wrong, which is condition
   3 met. **Applied in `58a9fa53`, tightened by the cold reviewer**: it ruled condition 1 met for the
   path half only and killed the drafted three-line explanation of the consequence as theory — the
   plain-`sha256sum` failure did not happen this run — and as redundant against the Hard rule at line
   328, which already forbids repairing the digest. What survives is the path plus the four-word warning
   the two sibling prompts carry verbatim, at zero net lines. No breach log exists for this prompt (none has ever been written), so no `fixed`/`confirmed`
   row was ruled on. Prompt is 259 lines, well under the ~500 budget, so one-in-one-out does not apply.
