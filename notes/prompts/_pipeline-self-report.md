# Pipeline self-report — shared final step for every orchestrator

**Internal component. Not runnable.** Every Claude-Code orchestrator ends its run by executing this
step (its last section points here). The goal: each real run leaves behind evidence about **how the
pipeline itself behaved**, so the prompts can be refined from what actually went wrong instead of
theory. The prompts stay **frozen** between runs — a self-report showing a real failure is the only
thing that reopens one.

The report is about the **machinery, not the content**: it never repeats findings, notes, or tasks —
those live in the pipeline's own output files. Concretely: naming *which* items you added, dropped, or
routed elsewhere is content and belongs in the run's chat summary, even when the routing decision itself
was hard. The machinery fact is "the overlap check did real work"; the list of overlapping items is not.

> **Write against this spec, not against the previous report.** You overwrite the last run's file, so
> you see it — and imitating its shape is how a long report begets a longer one. A real run followed a
> predecessor into ~60 lines of which ~25 earned their place, duplicating the chat summary and adding
> paragraphs about what went *well*. That is the failure mode to avoid: this file exists to surface what
> broke, and padding it with successes buries the one finding that should reopen a frozen prompt.

## What to write

After the run's normal final step, write `_last-run-report.md` **in the orchestrator's own folder**
(overwrite the previous run's; if several orchestrators share a folder, use
`_last-run-report-<orchestrator>.md`). Header: date + the run's target (topic / project / scope) + a
**`Status:` line** — `open` if the Verdict names a change nobody has applied yet, or
`applied in <hash>` once the prompt has been edited to address it. This one line is what lets a later
reader tell a live finding from a done one at a glance, instead of re-deriving it from prose (on
2026-07-19 a Verdict written as a to-do list had to be rewritten as a record precisely because the
next reader would otherwise re-apply changes that already existed). A clean run's status is `open` and
stays `open` — there was nothing to apply.

Then these five bullets — honest, including "nothing to report". Keep each one short; a bullet only
earns extra lines when it is reporting something that actually went wrong:

1. **Plan vs reality** — did the work split (subagents, slices, sections, files) turn out right, or
   was something missing / mis-sized?
2. **Report discipline** — did any subagent return output that had to be trimmed or discarded
   (code dumps, narrative, overlong reports)?
3. **Failures & retries** — subagents that failed, were re-dispatched, or returned unusable work; how
   the failure protocol behaved.
4. **Rule friction and rule breaches** — two things, one bullet: any instruction in the prompt that was
   ambiguous, contradictory, or had to be worked around during the run; **and any rule the run itself
   broke** — a step-0 guard skipped, a model policy violated, a mandatory check not run. Name what was
   breached and what it cost, not just that it happened. (This half exists because a real coverage run
   word-crafted its items on the wrong model and shipped standard violations: the incident fit none of
   the five bullets, so that report invented a sixth. A broken rule is machinery evidence — it belongs
   here, not in an ad-hoc bullet.)
5. **Verdict** — one line: "pipeline clean" or "change worth considering: <what>".

## Update the run tracker

After writing the report, update `notes/prompts/_run-tracker.md` — the permanent ledger of which
targets each prompt has covered. Find your orchestrator's column (or row, for global prompts) and set
the cell for this run's target to today's date, with a short parenthetical if the run was partial
(e.g. "backend only", "scoped to `notes/spring-boot/`"). Overwrite the cell's previous date — the
tracker records the *last* run per target, not a history. If the run covered several targets (a
`TOPIC = all` batch), update every cell it actually finished — never a cell for a target that was
planned but not completed.

## How to commit it

Both files are prompt-system machinery under `notes/prompts/`, so **commit them directly** (the
notes/prompts exception — this applies even in pipelines whose main output is never auto-committed,
like `readme-audit`): `git status` → stage **only** the report file and `_run-tracker.md` →
`git status` again → commit
`docs: pipeline self-report for <orchestrator> run on <target>`. Never bundle them into the
pipeline's content commit. Also print the five bullets in chat.

**Verify the commit before declaring the run finished — `git show --stat HEAD`, not memory.** The
commit must list **two** files: the report and `_run-tracker.md`. If it lists only the report, the
tracker half was skipped — update it and commit before ending the run. This check exists because it
failed in the wild: the Security coverage run (2026-07-18) wrote its report, skipped the tracker,
and its own bullet 4 declared "no rule breached" — the same saturated context that skips a step
cannot see the skip. Bullets 3 and 4 of the report may only claim a clean close-out if this stat
check actually ran.

## How it gets used

In a later main session, Victor mentions the run; Claude reads the report file and decides whether
the orchestrator's prompt needs a change. Clean report → prompts stay frozen. (Two pipelines carry
their own tailored version of this step — same contract, same Verdict criterion, and the same
`_run-tracker.md` update: `review-audit.md` and `readme-audit.md`.)

**The bar a finding must clear before it edits a prompt.** The reading is automatic; the editing is
not, and it stays a decision Victor makes. When a finding is on the table, it earns an edit only if it
clears **all four**:

1. **Real evidence, not theory** — it comes from something that actually happened in a run, not from a
   hypothetical the report imagined.
2. **The prompt was wrong or ambiguous** — the instruction was inexecutable, contradictory, or silent
   where it needed to speak. A rule the run *broke* while the prompt stated it clearly is not a prompt
   defect; it is a discipline lapse to watch, and rewriting an already-clear rule only buries the real
   lesson (the 2026-07-19 run merged two analysts against a rule that said "one concern per analyst…
   even at higher token cost" — the prompt needed no edit).
3. **It would have changed the result, not just the cost** — a finding that only made the run more
   expensive is friction to note, not a defect to patch.
4. **Not already covered** — the existing text does not handle it somewhere the run failed to look.

This bar is deliberately asymmetric-aware: a self-report exists to surface what broke, so every finding
arrives framed as "fix me", and nothing in the loop ever proposes *removing* prompt text. The four
conditions are the counterweight — most findings are friction (fails #3) or a discipline lapse
(fails #2), and only the ones that survive all four justify growing a prompt that no one re-reads whole.
When a finding is considered and rejected, say so in the Verdict with the condition it failed, so the
same zombie finding is not re-proposed on the next run.

Do **not** turn this into an automated pre-step that reads, edits, and re-runs the prompt in one chain:
that removes the human gate, lets a misread finding apply *and* execute before anyone sees it, and
ratchets prompts longer in one direction only (this file already warns that "a long report begets a
longer one" — a self-editing prompt is the same dynamic with no brake). The gate is the point.
