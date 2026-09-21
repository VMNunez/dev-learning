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
| SBRC-0003 | 2026-09-08 | `study-content-writer` | `notes/interview-prep/junior/{en,es}/angular.md`, REC-224 step 2 | `study-content-writer/SKILL.md` → `Step 4 — A note edit must belong to the plan` | own | The levelled-bank paragraph orders "Allocate the next stable bilingual question ID" with no branch for a bank that has none. That file carries 0 IDs across 144 questions and its migration belongs to `interview-prep-audit`, so an ID allocated here would collide with the one that run assigns. The neighbouring project-bank route states exactly that prohibition ("Never allocate one yourself to have something to cite"); the levelled route is silent, so the run added its new question ID-less by borrowing the sibling rule | open |
| SBRC-0004 | 2026-09-13 | `study-block-close` | `PROGRESS.md` `## Study progress` per-project table, recount-only run routed by the 2026-09-12 `progress-update MODE = all` drift report | `study-block-close/SKILL.md` → `1 — Resolve evidence without questions` | own | Step 1 says "If the session names no completed study unit, write nothing", with no branch for a recount-only invocation — yet the `progress-update` drift report names this skill as the owner of the per-project table repair (02-weather-app and 03-expense-tracker missing after closing `✅ Ready`), and that drift holds G6 open for the `04-meal-finder` `portfolio-audit`. Obeying step 1 leaves the drift unrepairable until an unrelated study block happens; the run executed step 4 anyway (two `—` rows, no study state written, commit `b1a90f99`) | open |
| SBRC-0005 | 2026-09-16 | `step-complete` | `projects/07-timetrack` Step 7a close, coverage verification range | `step-complete/SKILL.md` → `3 — Coverage: land the step's concepts on the checklist` | own | The range rule derives the step start as `git log -1 -G'Current step' -- PLANNING.md` and gives one sanity branch only, "if it is older [than the branch point] … the branch point is the range". On 07 it returned `99f0adf1`, a same-day `backlog-task-close` commit — that ritual also rewrites the `Current step` cell whenever no §15 step closed earlier in the session, which the §0 partition in step 5 licenses — so the SHA was **newer** than the step start and scoped the diff to 6 files instead of the 69 the step added. The text is silent on that direction; the run improvised the branch point (`93e90a38`, merge-base with `projects/07-timetrack`) as the range | open |
| SBRC-0006 | 2026-09-18 | `step-complete` | `projects/07-timetrack` Step 7b close, concept extraction | `step-complete/SKILL.md` → `2 — Extract the step's concepts, and update PROGRESS.md *status*` | own | Step 7b carries no `**New concepts:**` line — only `**Review concepts:**` — so the extraction came back empty, and the step says to "say so and stop". The run said so and did not stop: it wrote a `**Concept learned:**` line into §15 from the concepts the step's own in-progress block had recorded as owed, then extracted from it. Steps 7c and 7d carry no `New concepts:` line either, so the same empty extraction will recur at their closes | open |
| SBRC-0007 | 2026-09-20 | `backlog-task-open` | `projects/07-timetrack`, the two frontend Lows raised while building the Approvals page | `backlog-task-open/SKILL.md` → `5 — The explanation contract, checked before the message is sent` | own | Step 3 routes a valid task to "the normal cycle: explain the problem and the theory first, let Victor try it himself, give code only if he asks (his standing teach-first rule)", and step 5 then mandates all five parts including the verbatim three-guidance-modes closing block. This session opened with Victor replacing that standing rule outright — *"Implementas tú el código y commiteas como si lo hubiera hecho yo"* — so there is no mode to offer and nothing for him to attempt. The file has no branch for a session whose contract has already answered the question step 5's closing block asks, so the run delivered the verdict table and a compact rationale and skipped the seven-part explanation and the modes block | open |
| SBRC-0008 | 2026-09-21 | `backlog-task-close` | `projects/07-timetrack`, the eight frontend Lows closed on 2026-09-21 | `backlog-task-close/SKILL.md` → `0 — Identify the task and the concept` | own | The ritual is written for one task per invocation ("A task … just finished", quote "the exact task line"), while the session closed eight after one batched browser verification, as Victor's session prompt ordered. The run invoked `coverage-bullet-add`, `coverage-mark` and `readme-concept-add` once each over the union of the eight tasks' concepts and landed one coverage, one README, one PLANNING and one backlog commit for all eight — the shape the 2026-09-20 closes already committed in (`478a86aa` collapsed two tasks) — with no text saying whether a batch is one run or eight | open |
| SBRC-0009 | 2026-09-21 | `backlog-task-open` | `projects/07-timetrack`, the eight frontend Lows triaged on 2026-09-21 | `backlog-task-open/SKILL.md` → `5 — The explanation contract, checked before the message is sent` | own | Second session in a row with the implementation delegated by Victor's own session prompt ("Implementas tú el código"): all eight triages delivered the verdict table and a compact rationale, and none carried the seven-part explanation or the three-modes block, for which the contract has no delegated branch — the same gap as SBRC-0007, recurring | open |
| SBRC-0010 | 2026-09-21 | `backlog-task-open` | `projects/07-timetrack`, the frontend High on table text columns, session 4 | `backlog-task-open/SKILL.md` → `5 — The explanation contract, checked before the message is sent` | own | Third session running with the implementation delegated by Victor's session prompt ("Implementas tú el código"): the triage carried the introduction and both layers, but closed without the three-modes block the checklist requires, since there was no mode left to choose — the same gap as SBRC-0007 and SBRC-0009 | open |
| SBRC-0011 | 2026-09-21 | `coverage-bullet-add` | `_run-tracker.md` Angular Material `Plan J` cell, the table-column High close | `coverage-bullet-add/SKILL.md` → `7 — Record the debt in the run tracker` | own | The step rules "one flag per cell, never two" and "raises the existing count", with no branch for a cell that already carries two flags (`⚠ stale 2026-09-19 (+15 …)` and `⚠ stale 2026-09-20 (+3 bullets)`); the run raised the later one to `+4` and left the pair unmerged, since merging would rewrite a flag it did not write | open |
| SBRC-0012 | 2026-09-21 | `coverage-mark` | `css/junior` "`width`, `min-width`, and `max-width`", the table-column High close | `coverage-mark/SKILL.md` → `2b — Sweep the code, not only the lesson` | own | The diff uses the bullet (a `9rem` floor, a `12rem` cap) and it is unmarked, but a width bound is almost certainly first used in an earlier project; the sweep's rules cover knowing the first project and forbid searching for it, and are silent on suspecting one, so the run left it unmarked rather than date it to 07 | open |
| SBRC-0013 | 2026-09-21 | `backlog-task-open` | `projects/07-timetrack`, the frontend Medium on focus after the first create from an empty state, session 4 | `backlog-task-open/SKILL.md` → `5 — The explanation contract, checked before the message is sent` | own | Same session as SBRC-0010, second triage under the delegated implementation: introduction and both layers delivered, the three-modes block replaced by a one-line "implemento yo" note, since the session prompt had already chosen who writes the code | open |
