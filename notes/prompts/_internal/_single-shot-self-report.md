# Single-shot self-report — shared final step for every non-orchestrator prompt

**Internal component. Not runnable.** Twelve of the 25 runnable prompts end by executing this step; the
other thirteen end by executing `_pipeline-self-report.md`. Same purpose: each real run
leaves evidence about **how the prompt itself behaved**, so it improves from what went wrong instead of
from theory. Prompts stay **frozen** between runs — a report showing a real failure is the only thing
that reopens one.

The report is about the **machinery, not the content**. What you generated, graded or wrote belongs in
the run's own output files and its chat summary; this file records only how the instructions held up.

---

## Step 1 — Close-out check, against disk and not memory

**Before writing a single word of the report**, verify the run actually produced what it promised:

1. Open `notes/prompts/README.md` and find this prompt's row. Its **"Generates / updates"** cell is the
   declared output list — **plus this run's own report file**, which every run produces and the table
   does not repeat.
2. For every file named there, check it on disk: does it exist, and did *this run* write it? The probe is
   `git status` **and** `git log --name-only` back to this run's first commit — a prompt that already
   committed its content leaves a clean `git status`, which proves nothing. For an output **outside the
   repo** (`personal/job-search/`, the portfolio repo), existence is not enough: a file left by an
   earlier run passes that test trivially, so check its **mtime is from this run**.
3. Any declared output missing or untouched is a **skipped step**, and it goes in bullet 2 by name. So is
   one whose only change is cosmetic when the row promised real work — *touched* means the declared work
   landed, not that the mtime moved.
4. **Where the row's outputs are conditional or absent, say so instead of passing silently.** A cell that
   is mode-conditional (`sql-exercises` writes `MISTAKES.md` in review mode only), optional (`hr-screen`),
   or has no repo file at all (`linkedin`, `cover-letter`) makes this check vacuous. In those runs, name
   in bullet 2 which of *this mode's* obligations you verified and how — never report a green close-out
   from an empty list.

This exists because self-assessment fails in exactly the case that matters: **the same saturated context
that skips a step cannot see the skip.** A real coverage run (2026-07-18) wrote its report, skipped the
run-tracker update, and its own report declared "no rule breached". Asking "did I miss anything?" gets
an honest "no" from a context that has already lost the thread; listing declared outputs and checking
them against disk does not depend on remembering.

## Step 2 — Write the report

Write `_last-run-report-<prompt-name>.md` in **this prompt's family `_internal/` folder**, overwriting
the previous one.

Update `notes/prompts/_internal/_run-tracker.md` in the same close-out. Every invocation gets a
tracker record once its configuration is resolved, including `completed`, `blocked`, and `dry-run`
outcomes. Update this prompt's row in `## Single-shot prompt executions` with the date, resolved
target/mode, outcome, and a concise result. A blocked run records the blocking gate; a dry run records
what was inspected without implying that outputs were written. Never turn a failed run into
`completed` merely because its report and tracker update succeeded.

Header: today's date · the run's configuration (the resolved key values) · a **`Status:` line** —
`open` if the Verdict names a change nobody has applied yet, `applied in <hash>` once the prompt has
been edited to address it. A clean run's status is `open` and stays `open`.

Before these bullets, reconcile every prompt-change recommendation from this run with
`notes/prompts/_internal/_recommendation-ledger.md`. Create or update a row with state `open`,
`accepted`, `applied`, or `rejected`. Historical reports remain unchanged; the ledger is the current
status source.

Then exactly these three bullets, honest, including "nothing to report". Keep each short; a bullet earns
extra lines only when reporting something that actually went wrong:

1. **Config vs reality** — did the values this run resolved or was given produce what the job needed, or
   was something mis-sized, off-scope, or pointed at the wrong file? Name the file that needs fixing when
   the wrong value came from somewhere else (a plan, a tracker, a standard) — that is a bug there, not here.
2. **Rule friction and rule breaches** — two things, one bullet: any instruction here that was ambiguous,
   contradictory, or had to be worked around; **and any rule this run broke**, including every missing
   output found in Step 1. Name what was breached and what it cost, not just that it happened.
3. **Verdict** — one line: "prompt limpio" or "cambio a considerar: `<what>`".

**Before writing bullet 3, `wc -l` this prompt file.** Over ~500 lines, name the count and its largest
section in the Verdict. Length is only a proxy — a skipped step in bullet 2 outranks a green line count,
and a prompt under budget that skipped a step is still unhealthy.

## Step 3 — Commit it

The report is prompt-system machinery under `notes/prompts/`, so **commit it directly**, on its own,
never bundled into the run's content commit: `git status` → stage only the report → `git status` again →
`docs: self-report for <prompt> run on <target>`. Then print the three bullets in chat.

## Step 4 — Refine the prompt, but only when the run earned it

Look at the Verdict. If it names a finding, the prompt may be refined **now**, in this same context —
the evidence is freshest and the version you executed was the honest, unmodified one. The edit does
**not** land on your own say-so: it is drafted, reviewed by a cold subagent, and only then applied.

**The bar — draft an edit only for a finding that clears all four:**

1. **Real evidence, not theory** — it happened this run.
2. **The prompt was wrong or ambiguous** — inexecutable, contradictory, or silent where it needed to
   speak. A rule the run *broke* while the text stated it clearly is a discipline lapse to watch, not a
   defect to patch; rewriting an already-clear rule buries the lesson.
3. **It would have changed the *result*, not just the cost.** This is the condition that does the real
   work, and most findings die here. Ask it concretely: *would the output file have been different, or
   wrong, or missing?* If the honest answer is "the run would have been slower / clunkier / needed one
   more question", that is friction — record it in the Verdict and stop. Annoyance is not evidence, and
   a prompt that grows a clause for every annoyance ends up unable to execute the rules it already has.
4. **Not already covered** — the text does not handle it somewhere this run failed to look.

When you reject a finding, **name the failed condition in the Verdict** so the same zombie is not
re-proposed next run.

**Independent review before applying.** Dispatch one cold `role-appropriate` subagent (`reasoning tier: deep`)
with four inputs: the finding as the report states it, the prompt section it targets, your
drafted replacement, and **the whole prompt file, read end-to-end**. The last one is what makes
condition 4 answerable at all: "already covered somewhere the run failed to look" cannot be judged from
the excerpt the run happened to look at, and a reviewer given excerpts approves near-duplicates and
contradictions it had no way to see. It returns **approve / approve-with-tightening / reject**, answering: does the edit
clear all four conditions — condition 3 above all, stated as a concrete difference in the output; is
every fact in it correct; **is this already stated elsewhere in the file, or does it contradict something
there**; can the same fix be made by **tightening an existing line instead of adding
one**; and does applying it make any now-stale text removable. Apply only what it approves, in the form
it approves. If it rejects, or you cannot dispatch it, the finding stays `open` — a postponed finding is
recoverable via its `Status` line, a self-approved bad edit is not. **Record the verdict in the report** —
one line, `cold reviewer: approve | approve-with-tightening | reject`, beside the Verdict. It is the only
trace the gate ran: an applied edit with no such line is indistinguishable on disk from a self-approval.
The reviewer's return must open with `N lines, read to EOF` for the prompt file (the shared session rules' whole-file
rule); without it, treat the verdict as a reject — you cannot tell a whole-file judgement from a skim.

**Growth is capped.** Over ~500 lines the edit must be net-neutral: the reviewer names what stale caveat
or spent incident comes *out* to make room, or rejects. Cite an incident in a clause, never a paragraph —
the war-story belongs in the report, not in the prompt.

**Commit flow.** Apply the approved edit, commit it alone (`docs: <prompt> — refine from the run that
just finished`), read the hash from `git log` (never memory), set the report's `Status: applied in
<hash>`, and commit the report plus tracker together. When no prompt edit is approved, commit the
report plus tracker as the run record. Immediately before staging and immediately before committing,
run `git status`; stage only those declared paths. Print one line naming what went in and one naming
what came out.

## Step 5 — Run-start check (this prompt's step 0, not its last)

Every prompt using this file opens by reading its own `_last-run-report-<prompt-name>.md`. If it does
not exist, say "first run of this prompt" in one line and continue. If its `Status` is `open`, print
**one line** naming the finding: either it was rejected against the bar (say which condition, so it
reads as settled, not as a to-do) or it is a real item no run has applied. **Do not apply it at the
start** — editing a prompt and immediately running it entangles an unverified edit with the run.
