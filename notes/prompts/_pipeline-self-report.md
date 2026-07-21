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

## Refine the prompt when this run earned it — the last step

After writing the report, look at its Verdict. If it names a finding, **apply the fix to the prompt
now**, in this same context. This is automatic — not a change Victor has to remember to request in some
later session that may never come (the `notes-write` fact-check gate sat `open` four days because
nothing triggered the read). Doing it here is also where the evidence is best: you just lived the run,
so you know what broke rather than re-reading it cold, and the prompt you executed was the honest,
unmodified current version.

Apply the fix **only if it clears all four conditions** — this bar is what keeps trivia out:

1. **Real evidence, not theory** — it comes from something that actually happened this run, not from a
   hypothetical the report imagined.
2. **The prompt was wrong or ambiguous** — the instruction was inexecutable, contradictory, or silent
   where it needed to speak. A rule the run *broke* while the prompt stated it clearly is a discipline
   lapse to watch, not a prompt defect; rewriting an already-clear rule buries the real lesson (the
   2026-07-19 coverage run merged two analysts against a rule that said "one concern per analyst… even
   at higher token cost" — the prompt needed no edit).
3. **It would have changed the result, not just the cost** — a finding that only made the run slower or
   more expensive is friction to note, not a defect to patch. This is the condition that stops the
   prompt growing for every minor annoyance.
4. **Not already covered** — the existing text does not handle it somewhere the run failed to look.

A self-report exists to surface what broke, so every finding arrives framed as "fix me", and nothing in
the loop ever proposes *removing* prompt text — the four conditions are the only counterweight to that
one-way ratchet. Most findings are friction (fails #3) or a discipline lapse (fails #2) and stay
unapplied; only the survivors justify growing a prompt no one re-reads whole. When you consider and
reject one, name the failed condition in the Verdict so the same zombie is not re-proposed next run.

**Why doing this automatically is safe — and where the line is.** The edit lands *after* the run
finished, so the run just executed was a clean test of the unmodified prompt, and the refined version is
only *used* on the next invocation, which Victor starts. A human still sits between the edit and its next
use. That is the whole difference from editing a prompt *before* running it and executing the change in
the same breath: that entangles a possibly-wrong edit with the run and ships it before anyone has seen
it. Never do the before-and-run version; the after-run version is the one that is safe to automate.

**When uncertain at a saturated run-end, leave it `open`.** Context is thin at the end of a long run,
and the same tiredness that skips a step can wave through a sloppy edit. A finding you postpone is fully
recoverable — its `Status: open` line surfaces it next time — while a hasty edit shipped from a saturated
context is not. The tie goes to `open`, never to editing.

**Commit flow.** Apply the fix, commit it on its own (`docs: <prompt> — refine from the run that just
finished`), read the hash from `git log` (never from memory), then set the report's
`Status: applied in <hash>` and commit the report + tracker together. Alongside the five bullets, print
one line naming what you changed — that printed line is the human's view of the edit.

## The safety net for findings left open

The at-end step only sees *this* run's report, so a finding an earlier run left `open` — because it
failed the bar then, or because that run predates this mechanism — is caught later, not here. Two ways:
Victor mentions the run and Claude reads the report, or (where an orchestrator's step 0 opts into it) a
future run of the same prompt reads its own `_last-run-report`'s `Status` line at start and surfaces an
`open` bar-clearing finding before proceeding. Either way the `Status` line is what turns the check into
a glance instead of a re-derivation. Clean report → prompts stay frozen.

(Two pipelines carry their own tailored version of this step — same contract, same bar, same
`_run-tracker.md` update: `review-audit.md` and `readme-audit.md`.)
