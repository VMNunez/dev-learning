# Pipeline self-report — shared final step for every orchestrator

**Internal component. Not runnable.** Every orchestrator ends its run by executing this
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

## Shared self-report status vocabulary

This section is the **single owner** of `Status:` for every `_last-run-report*.md`, including reports
written through `_single-shot-self-report.md`. Consumers execute the run-start table below; they never
restate these meanings inline.

- `clean` — the Verdict leaves no prompt change pending. This includes a clean/blocked/no-run outcome
  with no machinery defect worth applying.
- `open` — the Verdict names a real prompt change that remains unapplied, including one parked because
  its cold reviewer rejected the draft or could not complete.
- `rejected` — a candidate was explicitly settled against one of the four bar conditions; the Verdict
  names the failed condition.
- `applied in <hash>` — the approved prompt edit landed in the named commit.

The reports already on disk predate this vocabulary and legitimately use `open` for all three
non-applied outcomes. Do not rewrite that historical evidence merely to normalize it. On the first
later run, classify a legacy `open` from its Verdict: an explicit clean/no-run outcome is `clean`, an
explicit failed bar condition is `rejected`, and anything else is a genuine `open` finding. The new
report written at that run's close-out uses the vocabulary above, so this compatibility branch is
self-clearing.

## What to write

After the run's normal final step, write `_last-run-report.md` **in the `_internal/` subfolder of the
orchestrator's own folder** (every family keeps its non-runnable files there, reports included)
(overwrite the previous run's; if several orchestrators share a folder, use
`_last-run-report-<orchestrator>.md`). Header: date + the run's target (topic / project / scope) + a
**`Status:` line** — choose exactly one value from "Shared self-report status vocabulary" above. This
one line is what lets a later reader tell a live finding from a settled one at a glance, instead of
re-deriving it from prose. Only the bounded legacy-`open` branch still consults the Verdict.

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

Then these five bullets — honest, including "nothing to report". Keep each one short; a bullet only
earns extra lines when it is reporting something that actually went wrong:

1. **Plan vs reality** — did the work split (subagents, slices, sections, files) turn out right, or
   was something missing / mis-sized? **Name your evidence.** Green traces are self-reports by the same
   subagents whose work is in question, so on their own they support only "the machinery ran" — never
   "the output is sound". If this pipeline has a step that reads the **finished artefact whole** and is
   not written by the slice owners (`plan-audit`'s `whole-plan` pass), its findings are this bullet's
   evidence and outrank the traces — defects caught *after* every slice went green are the measure of
   whether the split worked. If there is no such step, say so in one clause and claim no more than the
   traces prove.
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
   **A breach named here also gets a row in this prompt's breach log** — see "The breach log" below.
   The prose in this bullet is deleted by the next run; the row is what survives to be counted.
5. **Verdict** — one line: "pipeline clean" or "change worth considering: <what>".

**Close-out check — against disk, before you write a word of the report.** Do not replace any part of it
with asking yourself whether you missed anything. **The same saturated context that skips a step cannot
see the skip** — not a hypothesis: on 2026-07-18 a coverage run skipped the tracker update and its own
bullet 4 declared "no rule breached". A list checked against disk does not depend on remembering. Three
lists, in order:

**(a) Declared files.** Open `notes/prompts/README.md`, find this orchestrator's row, and treat its
**"Generates / updates"** cell as the list — **plus this run's own report file and `_run-tracker.md`**,
which every run produces and the table deliberately does not repeat. Does each exist, and did *this run*
write it?

**Tracker outcome.** Every invocation updates `_run-tracker.md` once configuration and target
resolution have succeeded, including `completed`, `blocked`, and `dry-run` outcomes. Write into **this
orchestrator's own cell or row**, in whichever of the tracker's tables holds it — that file is what
says which, and this contract names no heading on purpose: the one it carried until 2026-08-18 matched
no heading the tracker has ever had. Never invent a heading and never fall back to the nearest table,
which reports `completed` while the real row stays `pending`. Record the date, resolved target/mode,
outcome, and a concise result. A blocked run names
the failed gate, and a dry run never looks completed. If the orchestrator is `notes-audit`, also
upsert one row in `## Notes file executions`, keyed by `TOPIC + LEVEL + NOTE`, with both resolved
language paths, plan status, last outcome, and date. Recalculate the matching Notes J/M/S summary
cell as `complete entries / total entries`; the notes plan remains the authority for which entries
exist.

**(b) The probe is `git status` *and* `git log`.** Most orchestrators commit before reaching this step
(per file in `notes-audit`, per topic in `interview-prep-audit`, the inbox in `coverage-prompt`), so a
clean `git status` proves nothing — check `git log --name-only` back to this run's first commit as well,
and count a file as written if it appears in either. Missing from both is a **skipped step**, named in
bullet 4. So is a file whose only change is cosmetic when the row promised real work: *touched* means the
declared work landed, not that the mtime moved.

**(c) Declared dispatches — the half no file can prove.** Every subagent this prompt mandates writes into
a file some other step also writes, so list (a) comes back green whether or not a single one ran. List
the dispatches this prompt requires (authors, reviewers, specialists, per-slice or per-section fan-outs)
and state the count actually dispatched against the count required. **A mandated dispatch that did not
run is a skipped step even when every declared file exists.** This is the largest blind spot in the
check: skipping the reviewer half leaves disk indistinguishable from a clean run.

**Then three more, all cheap.** *(1)* Did this run skip or shortcut any mandatory step the check above
cannot see (a step-0 guard, a re-dispatch, a gate)? It belongs in bullet 4, in the Verdict **and in the
breach log below**, and you must read that log rather than only the previous report — the report holds
one run and the log holds every one of them, which is the difference between "twice in a row" and "the
fourth time this year". Two consecutive reports naming a skip still make extraction mandatory (the
health budget below); the log answers the separate question of whether one *named step* keeps failing.
*(2)* `wc -l` your own prompt file; over ~500 lines, name the count and the largest section
(`grep -n "^## "` and subtract) in the Verdict. *(3)* Open the breach log's `fixed in <hash>` and
`confirmed N/3` rows and rule on each one for **this** run — reached and clean, not reached, or breached
again — under the breach-log section's three branches. This is the half of the loop nothing else
triggers: a fix nobody confirms stays unproven forever, and a clean run is the only thing that can
prove it.

This is the only thing in the system that checks a prompt's health on a schedule — the budget below is a
brake on *adding*, so it fires only when a run happens to propose an edit, and a prompt nobody edits can
sit at double the budget indefinitely. It did: `sql-exercises-prompt.md` reached 1244 lines carrying a
line that said "this file is over 1000 lines", addressed to a reader who only arrives when there is
already something to add.

## The breach log

**This section is the single owner of the breach log**, for the twelve prompts running
`_single-shot-self-report.md` as much as for the nineteen running this file; that contract points here
and does not restate it.

`_last-run-report*.md` is **overwritten** every run, so a breach confessed in bullet 4 survives exactly
one invocation of its own prompt. Recoverable from `git log -p`, but never *counted* from there: the
prose is free-form and spread over the whole history, and the close-out that would have to read it is
the most saturated context in the system. So a breach also lands as one row, in one place, in the
prompt's own words for the step it broke.

**Where.** `_breach-log-<prompt-name>.md`, in that prompt's own family `_internal/` folder, beside its
report. One per prompt, **created on the first breach and never before** — an empty log is machinery
nobody reads. Append-only; rows are never deleted, and a closed one stays as the evidence that this step
was once a problem.

| Field | |
|---|---|
| `ID` | `BRCH-NNNN`, continuing that file's own numbering |
| `Date` | the run's date |
| `Target` | the run's resolved target — the same string its tracker row carries |
| `Breached step` | **`<file>` → `<heading>`, copied verbatim and never composed** — the file that states the step, then that step's own heading or gate name exactly as it is written there: `` `_pipeline-self-report.md` → `Run-start check` ``, `` `notes-audit.md` → `trace gate: single re-dispatch` ``. This is the field the whole file exists for: two rows count as the same failure only when this string matches exactly, and free prose does not survive a saturated close-out — the three real breaches of one step already on disk spell it "the step-0 run-start check", "the run-start check (`_pipeline-self-report.md`, 'Run-start check')" and "the run-start check". Copy the heading; never describe what happened |
| `Scope` | `own` when that step is written in this prompt · `shared` when it is written in a contract this prompt merely executes (`_pipeline-self-report.md`, `_single-shot-self-report.md`, `_agent-runtime-standard.md`, a `_*-standard.md`) |
| `Evidence` | what was breached and what it cost, in one clause — bullet 4 carries the full account |
| `Disposition` | the only mutable field; everything above is immutable once written |

`Disposition` takes exactly one of: `open` · `fixed in <hash>` · `confirmed N/3` · `closed` ·
`recurred — see BRCH-NNNN` · `routed to REC-NNN`.

**Scope decides who may act, and it is not a preference.** `_session-rules.md` → "Who writes a standard
or a shared contract" bars a run from editing the contracts it executes, and the refinement step below is
scoped to the prompt file that just ran. So a `shared` row is **never** fixed here — **and never routed on
sight either**. A breach that opens a ledger row on its first occurrence is the refill engine `REC-054` (b)
and that ledger's own preamble exist to prevent, and `_skill-friction.md`'s rule governs here identically:
a row is evidence, not automatically a recommendation. It stays `open` until **this prompt's own log holds
two rows naming that same step** — the same count the paragraph below sets — and then goes to
`_recommendation-ledger.md` as a `REC-NNN`, provided the finding still clears conditions 1, 3 and 4; its
disposition becomes `routed to REC-NNN`. **The REC cites this log's `BRCH` IDs and names the log file**,
because `BRCH` numbering is per file and this close-out may not open another prompt's: aggregating one
step across prompts is the resolver's work at the ledger's step 1, never a run's. That is what makes
per-prompt logs safe — the one class of breach that recurs across several prompts is exactly the class
whose fix was never this prompt's to make, and the ledger is already where cross-prompt evidence
accumulates and deduplicates.

**Two rows naming the same step open the wording question — they do not settle it.** Below two, the bar's
condition 2 stands unchanged: a clearly-stated rule the run broke is a discipline lapse. At two or more,
that verdict is no longer available for that step, because *a clear rule a competent executor breaches
repeatedly is a defect of wording or placement rather than of discipline* — the rule is stated where it
is not read at the moment it must be obeyed. The finding still has to clear conditions 1, 3 and 4 and
still needs its cold reviewer; what the threshold removes is the one condition that was silently
discarding the repeat. **It is a floor for the ambiguous case, never a waiting period**: a breach whose
defect is obvious on the first occurrence clears the bar on the first occurrence, exactly as today.

**A fix is not believed until three runs exercise it.** An approved edit rewriting a breached step sets
every open row for that step to `fixed in <hash>`. Thereafter, each close-out of this prompt asks one
question per `fixed`/`confirmed` row: **did this run actually reach that step?**

- Reached it and did not breach → advance `confirmed 1/3` → `2/3` → at three, `closed`.
- Did **not** reach it — the run blocked at an earlier guard, took the other mode branch, was a dry run —
  → the row is unchanged. A run that never executed the step is not evidence that the step was fixed,
  and counting it would close the loop on luck.
- Breached it again → the fix failed. Open a new row citing the old one, set the old to
  `recurred — see BRCH-NNNN`, and **the new row starts at two, not one**: the step already had a
  threshold-clearing history and an attempted repair. The next edit may not be another rewording of the
  same line — say what is being tried instead (moving the rule to where it is read, or the extraction
  the health budget below describes).

**Committing.** A breach-log write is machinery under `notes/prompts/`: it rides with the report and
`_run-tracker.md` in the "How to commit it" commit below, which then lists three files rather than two.
A disposition the refinement step moves rides in **that step's second commit** — the one carrying the
report's `Status: applied in <hash>` and the reviewer verdict — never in the prompt-edit commit itself,
whose hash does not exist until it is made. `git status` before staging
and before committing, as everywhere else.

## Update the run tracker

After writing the report, update `notes/prompts/_internal/_run-tracker.md` — the permanent ledger of which
targets each prompt has covered. Find your orchestrator's own cell or row and set it for this run's
target to today's date, with a short parenthetical if the run was partial
(e.g. "backend only", "scoped to `notes/spring-boot/`"). Overwrite the cell's previous date — the
tracker records the *last* run per target, not a history. If the run covered several targets (a
`TOPIC = all` batch), update every cell it actually finished — never a cell for a target that was
planned but not completed.

## How to commit it

Both files are prompt-system machinery under `notes/prompts/`, so **commit them directly** (the
notes/prompts exception — this applies even in pipelines whose main output is never auto-committed,
like `readme-audit`): `git status` → stage **only** the report file, `_run-tracker.md`, and this
prompt's `_breach-log-<prompt-name>.md` when this run wrote a row or moved a disposition in it →
`git status` again → commit
`docs: pipeline self-report for <orchestrator> run on <target>`. Never bundle them into the
pipeline's content commit. Also print the five bullets in chat.

**Verify the commit before declaring the run finished — `git show --stat HEAD`, not memory.** This
rules on the commit this section just instructed, never on `HEAD` after the refinement step below. The
commit must list **at least two** files: the report and `_run-tracker.md` — plus the breach log on a run
that wrote one, and any file this contract's other steps legitimately staged with them. The test is that
the two mandatory halves are both there, never that the count is exactly two. If it lists only the
report, the tracker half was skipped — update it and commit before ending the run. This check exists because it
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
   cost" — no edit was needed). **Count before you rule.** That verdict is correct once and false
   forever: open the breach log and count the rows naming this same step. At **two or more**, this
   condition is met by the count alone — a clear rule breached repeatedly is mis-worded or mis-placed,
   not disobeyed — and the finding proceeds to conditions 3 and 4 like any other. Under two it stands as
   written. The threshold rescues the repeat; it never delays the breach whose defect is plain the first
   time. `Scope: shared` rows are outside this test — that step is not this prompt's to edit — and the
   breach-log section routes them to the ledger **at the same two-row count**, never on the first row.
3. **It would have changed the *result*, not just the cost.** This is the condition that does the real
   work, and most findings must die here. Ask it concretely: *would the output file have been different,
   or wrong, or missing?* If the honest answer is "the run would have been slower, clunkier, or needed
   one more question", that is friction — record it in the Verdict and stop. Annoyance is not evidence,
   and a prompt that grows a clause for every annoyance ends up unable to execute the rules it already
   has, which is the failure this whole budget exists to prevent.
4. **Not already covered** — the text does not handle it somewhere the run failed to look.

Most findings are friction (#3) or a discipline lapse (#2) and are recorded, not applied. When you
reject one, name the failed condition in the Verdict so the same zombie is not re-proposed next run.

**Independent review before you apply — a cold subagent, never your own saturated judgement.** A
self-report exists to surface what broke, so every finding arrives framed "fix me", and the author of
the fix is the same tired context that just ran a long pipeline: two reasons the edit needs a second,
independent pair of eyes. Draft the edit, then dispatch **one cold `role-appropriate` subagent
(`reasoning tier: deep`** — this is the quality gate and it fires rarely) with five inputs: the finding
as the report states it, the current prompt section it targets, your drafted replacement, the scratch path
it persists to as it works, and **the whole
prompt file, read end-to-end**. The last one is not context, it is what makes two of the questions
answerable: condition 4 asks whether the text already handles this *somewhere the run failed to look*,
and nothing about a quoted section can answer that — a reviewer given excerpts approves near-duplicates
and contradictions it had no way to see, which is exactly how a prompt accretes clauses until it can no
longer execute the rules it has. It returns
one verdict — **approve / approve-with-tightening / reject** — answering: does the edit clear all four
bar conditions; is every fact in it correct; **is this already stated elsewhere in the file, or does it
contradict something there**; can the same fix be made by **tightening an existing line
instead of adding one**; and does applying it make any now-redundant or stale text removable. Apply only
what it approves, in the form it approves. If it rejects — or you cannot dispatch it, as
`_agent-runtime-standard.md` defines that (a death is not a failed dispatch until its ladder is
exhausted) — the finding stays
`open`: a postponed finding is recoverable via its `Status` line, a self-approved bad edit is not. The
tie always goes to `open`, never to editing on your own. **Record the verdict in the report** — one line,
`cold reviewer: approve | approve-with-tightening | reject`, beside the Verdict. It is the only trace the
gate ran at all: an applied edit with no such line is indistinguishable on disk from a self-approval, and
a later reader must treat it as one. The reviewer's return must open with `N lines, read to EOF` for the
prompt file (the shared session rules' whole-file rule — the Read tool truncates past 2000 lines in silence); without
it you cannot tell a whole-file judgement from a skim, so treat the verdict as a reject.

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

**Commit flow.** Apply the reviewer-approved edit, then run the two-map test in `_session-rules.md`
→ "The two maps follow every change to the machinery": if the edit changed what a file contains, who
writes it, when something runs, or which prompts and skills exist, the `README.md` / `_system-map.md`
edit goes **in this same commit**; if it did not, say `maps unaffected` in the line you print below.
**Then the read test, which this contract used to omit** — `_session-rules.md` → "The map is also
verified on read, not only on write". A pipeline run reads its own prompt end to end, so it is the one
kind of run that can always rule on the map's rows about that prompt: check them, correct a false one in
**its own commit** (never folded into the refinement above), and print the verdict — `map: verified —
{rows}` / `map: corrected — {row}` — beside the `maps unaffected` line.
Commit it on its own (`docs: <prompt> — refine from
the run that just finished`), read the hash from `git log` (never from memory), set the report's
`Status: applied in <hash>`, and commit the report **again** — a second commit carrying that line and
the reviewer verdict, since "How to commit it" already landed the run record and the hash cannot exist
until the edit does; `_run-tracker.md` goes with it only if this step changed it. **An edit that rewrote
a breached step also moves that step's open breach-log rows to `fixed in <hash>`**, in that same second
commit and with the same hash — the fix now owes the three exercising runs the breach-log section
requires, and a row left `open` after its own fix landed will re-trigger the threshold on evidence that
was already acted on. When no edit is
approved, that earlier commit is the run record; re-commit the report alone only for the
`cold reviewer:` line, the failed-condition Verdict, or a `Status:` this step settled — and if it wrote
none of them, nothing is committed here. Alongside the five bullets, print
one line naming what changed and one naming what came *out* — that is the human's view of the edit.

## Run-start check — surface anything the last run left open

The at-end refinement only sees *this* run's report, so a finding an earlier run left `open` needs a
separate trigger or it rots (the `notes-write` gate sat four days for exactly this reason). Every
orchestrator's step 0 therefore includes this check — one glance, made cheap by the `Status` line:

- Read this orchestrator's own `_last-run-report` (if one exists) and look at its `Status` line.
- `clean`, `rejected`, or `applied in <hash>` → proceed silently.
- `open` → print **one line** to Victor naming the genuine item a past run never applied.
- Legacy `open` → use the compatibility branch in "Shared self-report status vocabulary": proceed
  silently for a clean/no-run or explicitly rejected Verdict; otherwise surface the finding once.
- **Do not apply it here.** Editing the prompt and then immediately running it is the entangled
  before-and-run pattern the refinement step exists to avoid. Surfacing it is the whole job — one
  printed line at start is what breaks the silence that let a real defect sit for four days. If Victor
  wants it applied, that is his call; otherwise it flows into this run's own at-end refinement if this
  run reproduces it.

(Two pipelines carry their own tailored version of this step — same contract, same bar, same
`_run-tracker.md` update: `review-audit.md` and `readme-audit.md`.)
