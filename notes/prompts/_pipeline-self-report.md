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

After the run's normal final step, write `_last-run-report.md` **in the `_internal/` subfolder of the
orchestrator's own folder** (every family keeps its non-runnable files there, reports included)
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

**Before writing bullet 5, check the prompt's health — two questions, both cheap.** *(1)* Did this run
skip or shortcut any mandatory step? If yes, it belongs in bullet 4 **and** in the Verdict, and you must
read the previous report: two in a row makes extraction mandatory (see the health budget below).
*(2)* `wc -l` your own prompt file; over ~500 lines, name the count and the largest section
(`grep -n "^## "` and subtract) in the Verdict.

This is the only thing in the system that checks a prompt's health on a schedule — the budget below is a
brake on *adding*, so it fires only when a run happens to propose an edit, and a prompt nobody edits can
sit at double the budget indefinitely. It did: `sql-exercises-prompt.md` reached 1244 lines carrying a
line that said "this file is over 1000 lines", addressed to a reader who only arrives when there is
already something to add.

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

After writing the report, look at its Verdict. If it names a finding, the prompt may be refined **now**,
in this same context — automatic, not deferred to a later session that may never come (the `notes-write`
gate sat `open` four days because nothing triggered the read). Here the evidence is best: you just lived
the run, and the prompt you executed was the honest, unmodified current version. (Refining a prompt
*before* a run and executing the change in the same breath is the unsafe variant — it entangles a
possibly-wrong edit with the run and ships it unseen; the at-end edit is only *used* on the next
invocation Victor starts, so a human always sits between the edit and its next use.) But the edit does
**not** land on your own say-so. It is drafted, reviewed by a cold subagent, and only then applied. The
three parts below are the filter, the independent gate, and the brake on growth.

**The bar — draft an edit only for a finding that clears all four:**

1. **Real evidence, not theory** — something that actually happened this run, not a hypothetical.
2. **The prompt was wrong or ambiguous** — inexecutable, contradictory, or silent where it needed to
   speak. A rule the run *broke* while the prompt stated it clearly is a discipline lapse to watch, not
   a prompt defect; rewriting an already-clear rule buries the lesson (the 2026-07-19 coverage run
   merged two analysts against a rule that already said "one concern per analyst… even at higher token
   cost" — no edit was needed).
3. **It would have changed the result, not just the cost** — a finding that only made the run slower is
   friction to note, not a defect to patch. This is the condition that stops the prompt growing for
   every annoyance.
4. **Not already covered** — the text does not handle it somewhere the run failed to look.

Most findings are friction (#3) or a discipline lapse (#2) and are recorded, not applied. When you
reject one, name the failed condition in the Verdict so the same zombie is not re-proposed next run.

**Independent review before you apply — a cold subagent, never your own saturated judgement.** A
self-report exists to surface what broke, so every finding arrives framed "fix me", and the author of
the fix is the same tired context that just ran a long pipeline: two reasons the edit needs a second,
independent pair of eyes. Draft the edit, then dispatch **one cold `general-purpose` subagent
(`model: opus`** — this is the quality gate and it fires rarely) with exactly three inputs: the finding
as the report states it, the current prompt section it targets, and your drafted replacement. It returns
one verdict — **approve / approve-with-tightening / reject** — answering: does the edit clear all four
bar conditions; is every fact in it correct; can the same fix be made by **tightening an existing line
instead of adding one**; and does applying it make any now-redundant or stale text removable. Apply only
what it approves, in the form it approves. If it rejects — or you cannot dispatch it — the finding stays
`open`: a postponed finding is recoverable via its `Status` line, a self-approved bad edit is not. The
tie always goes to `open`, never to editing on your own.

**The prompt has a health budget — refinement is net-neutral above it.** The thing being protected is
**that every step actually runs**; length is only the proxy that predicts when they stop. So there are
two signals, and the first one outranks the second:

- **The real signal is a skipped step, and bullet 4 already records it.** A run that dropped a
  mandatory check, skipped a step-0 guard, or executed a step from the wrong branch is telling you the
  prompt no longer fits in one execution — whatever its length. **Two consecutive reports for the same
  prompt naming a skip make an extraction pass mandatory, not optional**: the second skip is proof the
  first was structural and not a bad day. One skip is a data point; two is a verdict.
- **~500 lines is a smoke alarm, not the law.** It is a rough proxy chosen because it is free to
  measure, and it is wrong in both directions: 900 lines of reference tables read once can be perfectly
  healthy, while 300 lines carrying forty mandatory checks are not. Over it, apply one-in-one-out — the
  reviewer must name what stale caveat, duplicated instruction or spent incident comes *out* to make
  room. **Under it, a prompt that skipped a step is still unhealthy** and gets the same treatment; do
  not let a green line count wave a real skip through.
- **Cite the incident in a clause, never a paragraph.** The war-story ("on 2026-07-19 the orchestrator
  told C the file was thin and C had to overturn it") belongs in the self-report; the prompt states the
  rule crisply and at most tags the cost in a half-line. Retelling failures in full is the single
  largest source of bloat — this file and the coverage-audit prompt are both already guilty of it.
- **When pruning is not enough, extract — but only past a clean seam.** If a prompt is over budget on
  genuine load-bearing content, not war-stories, the next tool is to move a self-contained block into a
  component file, the way `coverage-audit` extracted its analyst mandates and `notes-audit` its stages.
  Extract only when the block **(a)** is not needed by every execution — either a *different* reader
  consumes it (a dispatched subagent reads it, the orchestrator only points) or a given run needs one
  such block and not the others (`sql-exercises` reads one of two mode branches and one of thirteen
  topic seed blocks). Both forms genuinely reduce what a single context holds; a block every run must
  read is **not** a candidate, however long and stable it looks — extracting it only adds a hop.
  **(b)** is self-contained (its own inputs and return spec) so it
  survives being read alone; and **(c)** is stable, not rewritten every run. If the length instead comes
  from many interdependent inline rules with no clean seam, do **not** split: coupled logic across two
  files is worse than one long file, and every extraction adds a cross-reference that can break (the
  coverage-audit split lost two rules until the cold reviewer caught them). Prune first, extract second,
  and only very few prompts ever need it — the big orchestrators, which already have it.

**Commit flow.** Apply the reviewer-approved edit, commit it on its own (`docs: <prompt> — refine from
the run that just finished`), read the hash from `git log` (never from memory), set the report's
`Status: applied in <hash>`, and commit the report + tracker together. Alongside the five bullets, print
one line naming what changed and one naming what came *out* — that is the human's view of the edit.

## Run-start check — surface anything the last run left open

The at-end refinement only sees *this* run's report, so a finding an earlier run left `open` needs a
separate trigger or it rots (the `notes-write` gate sat four days for exactly this reason). Every
orchestrator's step 0 therefore includes this check — one glance, made cheap by the `Status` line:

- Read this orchestrator's own `_last-run-report` (if one exists) and look at its `Status` line.
- `applied in <hash>`, or a clean report → proceed silently.
- `open` → print **one line** to Victor naming the open finding and its state: either it was *rejected
  against the bar* (the Verdict says which condition — say so and move on, it is not a to-do), or it is
  a genuine item a past run never applied.
- **Do not apply it here.** Editing the prompt and then immediately running it is the entangled
  before-and-run pattern the refinement step exists to avoid. Surfacing it is the whole job — one
  printed line at start is what breaks the silence that let a real defect sit for four days. If Victor
  wants it applied, that is his call; otherwise it flows into this run's own at-end refinement if this
  run reproduces it.

(Two pipelines carry their own tailored version of this step — same contract, same bar, same
`_run-tracker.md` update: `review-audit.md` and `readme-audit.md`.)
