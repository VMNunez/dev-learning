# Pipeline self-report — shared final step for every orchestrator

**Internal component. Not runnable.** Every Claude-Code orchestrator ends its run by executing this
step (its last section points here). The goal: each real run leaves behind evidence about **how the
pipeline itself behaved**, so the prompts can be refined from what actually went wrong instead of
theory. The prompts stay **frozen** between runs — a self-report showing a real failure is the only
thing that reopens one.

The report is about the **machinery, not the content**: it never repeats findings, notes, or tasks —
those live in the pipeline's own output files.

## What to write

After the run's normal final step, write `_last-run-report.md` **in the orchestrator's own folder**
(overwrite the previous run's; if several orchestrators share a folder, use
`_last-run-report-<orchestrator>.md`). Header: date + the run's target (topic / project / scope).
Then five bullets, one line each — honest, including "nothing to report":

1. **Plan vs reality** — did the work split (subagents, slices, sections, files) turn out right, or
   was something missing / mis-sized?
2. **Report discipline** — did any subagent return output that had to be trimmed or discarded
   (code dumps, narrative, overlong reports)?
3. **Failures & retries** — subagents that failed, were re-dispatched, or returned unusable work; how
   the failure protocol behaved.
4. **Rule friction** — any instruction in the prompt that was ambiguous, contradictory, or had to be
   worked around during the run.
5. **Verdict** — one line: "pipeline clean" or "change worth considering: <what>".

## How to commit it

The file is prompt-system machinery under `notes/prompts/`, so **commit it directly** (the
notes/prompts exception — this applies even in pipelines whose main output is never auto-committed,
like `readme-audit`): `git status` → stage **only** the report file → `git status` again → commit
`docs: pipeline self-report for <orchestrator> run on <target>`. Never bundle it into the pipeline's
content commit. Also print the five bullets in chat.

## How it gets used

In a later main session, Victor mentions the run; Claude reads the report file and decides whether
the orchestrator's prompt needs a change. Clean report → prompts stay frozen. (The review pipeline's
`review-audit.md` carries its own tailored version of this step — same contract.)
