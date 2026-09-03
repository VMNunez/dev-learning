# Skill breach log

Durable evidence that a skill run **completed its work and still did not go as its own text says** — it
improvised where the `SKILL.md` was silent, asked a question its contract forbids, re-derived state the
trigger declared resolved, or wrote outside its writer set. The source contract is `_session-rules.md` →
"When a skill's own text is what went wrong — the skill breach log"; this file is only its event sink and
must not restate or widen that trigger.

## Why this is neither of the other two sinks

`_skill-friction.md` records a **failed declared step** (`FRIC-NNNN`) — the ritual could not finish.
`_ritual-friction.md` records a run that finished and **was not worth its cost** (`RITF-NNNN`). This file
records the third case, which was previously unrecordable: the ritual finished, was worth it, and the
**text** is what made the run work around something.

The three sinks have three different consumers and none reads another. A run that fails a step *and*
deviates on a step it completed writes to both files: the `Evidence` cell here names the `FRIC-NNNN` and
the account of the failure stays there, never duplicated into this table.

## What a row must contain

`ID` uses the next zero-padded `SBRC-NNNN`. `ID`, `Date`, `Skill`, `Target`, `Breached step`, `Scope` and
`Evidence` never change after insertion; only `Disposition` does. Escape a literal table pipe as `\|`.

**`Breached step` is the field the whole file exists for.** It is `` `<file>` → `<heading>` `` — the file
that states the step, then that step's own heading or gate name **copied verbatim and never composed**,
because two rows count as the same defect only when that string matches exactly, and free prose does not
survive the count. Copy the heading; never describe what happened. `Evidence` is where the one falsifiable
clause goes.

`Scope` is `own` when the step is written in that `SKILL.md`, and `shared` when it is written in a
contract the skill merely executes (`_session-rules.md`, `_agent-runtime-standard.md`, a `_*-standard.md`).
A `shared` row is never fixed by `skill-refine` — that step is not the skill's to edit — and is never
routed on sight either; it goes to `_recommendation-ledger.md` only once this file holds **two** rows
naming that same step.

`Disposition` takes exactly one of: `open` · `fixed in <hash>` · `closed` ·
`recurred — see SBRC-NNNN` · `routed to REC-NNN` · `dismissed — condition N: reason`.

## Who consumes it

`skill-refine` only, and nothing else may read it as a work queue. It also reads the local
`_skill-runs.md` counter when that file is present — a gitignored, machine-local row per `Skill`
invocation, written by a `PostToolUse` hook rather than by any ritual. That counter is the
denominator and never evidence: it is what tells "this skill ran twenty times and logged nothing"
apart from "this skill ran clean", and its absence changes no verdict here. A row is evidence, **not automatically
a recommendation** — the same rule `_skill-friction.md` and `_ritual-friction.md` state, for the same
reason. When it fires is decided by `_pipeline-self-report.md` → "The bar", condition 2: a text that was
genuinely ambiguous or silent clears it on the **first** row; a clearly stated rule breached anyway needs
**two** rows carrying the identical `Breached step`.

| ID | Date | Skill | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|---|
| SBRC-0001 | 2026-08-26 | `sql-block-open` | junior, Step 0 — run of 2026-08-26 opening the SQL block | `sql-block-open/SKILL.md` → `2 — The theory behind this step, and whether it is worth reading yet` | own | Three notes-plan chapters (03, 04, 05) each claim part of Step 0. Item 2 says to name the one that claims most and "say the step spans two chapters", while the output table mandates "exactly one of these, in one line" and gives no slot for the span — so the run improvised the parenthetical "(el step abarca 03/04/05; 05 reclama la mayoria)", in a format no line of the contract states, against a hardcoded count that was wrong for the real case | fixed in 2741d8f4 |
| SBRC-0002 | 2026-08-26 | `skill-refine` | `sql-block-open`, first real run of the loop | `skill-refine/SKILL.md` → `5 — Dispositions, commit, report` | own | Step 5a orders "set `Disposition` to `fixed in <hash>`" before 5b commits, so the hash cannot exist yet. Amending to fold it in rewrote the commit and invalidated the very hash just recorded (`aa9b8076` → `2741d8f4`); the disposition had to be corrected in a second commit, which 5b does not license | open |
| SBRC-0003 | 2026-09-03 | `backlog-task-close` | `06-hr-portal`, closing the plaintext-password High task | `backlog-task-close/SKILL.md` → `3b — PLANNING §0: keep the session quick reference true` | own | Step 3b assumes the plan has a §0 and mandates `Last updated` on every close "without exception", but projects 01-06 use the pre-§0 PLANNING format — `06-hr-portal/PLANNING.md` has no §0, no §15 and no §23. The step gives no branch for that, so the run improvised a bare "n/a — old format" and skipped the cell the contract calls never-n/a; the `Next gate` derivation and the §22 open-task-count grep are unreachable there for the same reason | open |
| SBRC-0004 | 2026-09-03 | `backlog-task-close` | `06-hr-portal`, closing the unique-email High task | `backlog-task-close/SKILL.md` → `3b — PLANNING §0: keep the session quick reference true` | own | Second occurrence of SBRC-0003 on the same pre-§0 plan: the step's `Last updated` cell is declared never-n/a and its `Current step` / `Next gate` / §22 open-task-count reads all address structures `06-hr-portal/PLANNING.md` does not have, so the run again had no branch to take and skipped the whole step. The concept row landed in that plan's `Key patterns introduced` table instead, which step 3 reaches and 3b does not name | open |
