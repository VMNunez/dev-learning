# Single-shot self-report — shared final step for every non-orchestrator prompt

**Internal component. Not runnable.** Every non-orchestrator prompt ends by executing this step;
orchestrators end by executing `_pipeline-self-report.md`. Same purpose: each real run
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
   repo** (`job-search/`, the portfolio repo), existence is not enough: a file left by an
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

**One report per run — an `all` batch is one run.** A prompt whose target field accepts `all`
(`_batch-mode.md` lists them, and owns the timing) writes this report **once, after the last target it
finishes** — including a batch stopped early by that file's length rule — names every target it
finished in the configuration line and in bullet 2, and records the same set in the tracker. Per
target it would overwrite the evidence of every target but the last, commit the same close-out two or
three times, and leave Step 5 below reading the report this same run had just written.

Update `notes/prompts/_internal/_run-tracker.md` in the same close-out. Every invocation gets a
tracker record once its configuration is resolved, including `completed`, `blocked`, and `dry-run`
outcomes. Update this prompt's row in `## Single-shot prompt executions` with the date, resolved
target/mode, outcome, and a concise result. A blocked run records the blocking gate; a dry run records
what was inspected without implying that outputs were written. Never turn a failed run into
`completed` merely because its report and tracker update succeeded.

Header: today's date · the run's configuration (the resolved key values) · a **`Status:` line** using
the single vocabulary owned by `_pipeline-self-report.md` → "Shared self-report status vocabulary".
Do not restate or extend that vocabulary here.

Before reconciling this run, consume any `open` rows in
`notes/prompts/_internal/_skill-friction.md`. This is a serialized critical section: never delegate it
or run it in parallel with another close-out, and re-read both the friction file and
`_recommendation-ledger.md` immediately before editing or staging. For each `FRIC-NNNN`, apply this
contract's four-condition bar below to the evidence, and locate the file that owns the defect — a
runtime failure normally fails condition 2, while contradictory input may belong to its upstream
producer rather than to the skill that exposed it.

- If it clears the bar, first find an existing matching recommendation. Create or update exactly one
  `REC-NNN`, cite the `FRIC-NNNN` as its source, then change only that friction row's `Disposition` to
  the REC ID.
- If it fails the bar, change only `Disposition` to `dismissed — condition N: reason`.
- If the evidence is insufficient, leave it `open`. No changed row means no commit.

Commit this reconciliation **before and separately from** the normal report + tracker commit: a REC
promotion stages `_skill-friction.md` plus `_recommendation-ledger.md`; a dismissal stages only
`_skill-friction.md`. Run `git status` immediately before staging and committing. This step records and
routes evidence; it never edits a skill, and therefore does not replace the mandatory cold review when
the recommendation is later resolved.

Then reconcile every prompt-change recommendation from this run with
`notes/prompts/_internal/_recommendation-ledger.md`. A new or still-unresolved item is a row in its
`## Open` table, state `open` or `accepted`. **An item this run resolved does not stay a row** — follow
that file's own four-step procedure, which ends by collapsing it into a single line in
`_recommendation-ledger-closed.md` after
promoting any rule it established into `_recommendation-resolution-doctrine.md`, which holds that
file's case law. Historical reports remain unchanged; the ledger is
the current status source.

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

The report and `_run-tracker.md` update are prompt-system machinery under `notes/prompts/`, so **commit
them directly**, together and on their own, never bundled into the run's content commit: `git status`
→ stage only the report and `_run-tracker.md` → `git status` again → `docs: self-report for <prompt>
run on <target>`. Then print the three bullets in chat.

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
with five inputs: the finding as the report states it, the prompt section it targets, your
drafted replacement, the scratch path it persists to as it works, and **the whole prompt file, read
end-to-end**. The last one is what makes
condition 4 answerable at all: "already covered somewhere the run failed to look" cannot be judged from
the excerpt the run happened to look at, and a reviewer given excerpts approves near-duplicates and
contradictions it had no way to see. It returns **approve / approve-with-tightening / reject**, answering: does the edit
clear all four conditions — condition 3 above all, stated as a concrete difference in the output; is
every fact in it correct; **is this already stated elsewhere in the file, or does it contradict something
there**; can the same fix be made by **tightening an existing line instead of adding
one**; and does applying it make any now-stale text removable. Apply only what it approves, in the form
it approves. If it rejects, or you cannot dispatch it — as `_agent-runtime-standard.md` defines that; a
death is not a failed dispatch until its ladder is exhausted — the finding stays `open`; a postponed finding is
recoverable via its `Status` line, a self-approved bad edit is not. **Record the verdict in the report** —
one line, `cold reviewer: approve | approve-with-tightening | reject`, beside the Verdict. It is the only
trace the gate ran: an applied edit with no such line is indistinguishable on disk from a self-approval.
The reviewer's return must open with `N lines, read to EOF` for the prompt file (the shared session rules' whole-file
rule); without it, treat the verdict as a reject — you cannot tell a whole-file judgement from a skim.

**Growth is capped.** Over ~500 lines the edit must be net-neutral: the reviewer names what stale caveat
or spent incident comes *out* to make room, or rejects. Cite an incident in a clause, never a paragraph —
the war-story belongs in the report, not in the prompt.

**Commit flow.** Apply the approved edit, then run the two-map test in `_session-rules.md` → "The two
maps follow every change to the machinery": a `README.md` / `_system-map.md` edit the change earns goes
**in this same commit**, and if it earns none, say `maps unaffected` in the line you print below.
**Then the read test, which this contract used to omit** — `_session-rules.md` → "The map is also
verified on read, not only on write". This run read its own prompt end to end, so it can rule on the
map's rows about that prompt: check them, correct a false one in **its own commit** (never folded into
the refinement), and print `map: verified — {rows}` / `map: corrected — {row}` beside the line above.
Commit
it alone (`docs: <prompt> — refine from the run that
just finished`), read the hash from `git log` (never memory), set the report's `Status: applied in
<hash>`, and commit the report **again** — a second commit carrying that line and the reviewer verdict,
since the hash cannot exist until the edit does; `_run-tracker.md` goes with it only if this step
changed it. When no edit is approved, **Step 3's commit is the run record**; re-commit the report alone
only for the `cold reviewer:` line, the failed-condition Verdict, or a `Status:` this step settled —
and if it wrote none of them, nothing is committed here. Immediately before staging and immediately
before committing, run `git status`; stage only those declared paths. Print one line naming what went
in and one naming what came out.

## Step 5 — Run-start check (this prompt's step 0, not its last)

Every prompt using this file opens by reading its own `_last-run-report-<prompt-name>.md`. **It invokes
this step before any content work — guards and configuration resolution may precede it, Step 2 may not —
and a final-step "execute this file in full" therefore means Steps 1–4**: Step 2 overwrites the report
this step reads, so a Step 5 reached at the end reads the run's own fresh report and the earlier `open`
it exists to surface is destroyed unread. If the report does
not exist, say "first run of this prompt" in one line and continue. Execute the run-start decision table
owned by `_pipeline-self-report.md` → "Shared self-report status vocabulary", including its bounded
legacy-`open` compatibility branch. **Do not apply a surfaced finding at the start** — editing a prompt
and immediately running it entangles an unverified edit with the run.
