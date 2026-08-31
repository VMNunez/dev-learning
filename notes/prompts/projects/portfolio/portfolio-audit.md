# Portfolio audit — the single entry point for the portfolio gate

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

> **External-path preflight:** Before reading or writing `dev/portfolio/VMNunez`, execute
> `notes/prompts/_internal/_external-path-preflight.md`. Stop before any write if it fails.

Run this **inside the supported agent runtime**. It is the only portfolio prompt Victor launches. It runs the **final
go/no-go gate** on a finished project, with one declared human choice before an eligible non-dry commit:
is it ready to show a recruiter and reference in a job
application **today**? It produces four things (see `_portfolio-standard.md`):

1. An **exhaustive bank of project-specific interview questions, in English and Spanish** — the
   English built **one bank section at a time**, each authored then cold-reviewed by its own pair of
   subagents (so no section gets skimmed), then translated once per project into its `es/` twin. Saved
   regardless of the verdict.
2. A **verdict** — ✅ Ready / ⚠️ Almost / ❌ Not ready.
3. If not ❌ — a **CV bullet** (Spanish, reused as-is by `cv-prompt`) and a **GitHub description**.
4. If ✅ Ready — a **direct update of Victor's GitHub profile README** (`dev/portfolio/VMNunez`, a
   separate repo) to feature the project.

This is the closing project gate, **G7** — it runs after G3/G4 (`review-audit`), G5 (`readme-audit`)
and a clean G6 (`progress-update`), and it is the last gate that reads the project itself
(`roadmap-review` / G8 follows). The gate order and every trigger are owned by `_planning-standard.md`
§23; where this prompt and §23 disagree, **§23 wins**.

> **▶ Run first — for a project whose plan steps are all ✅:** `review-audit` (G3/G4), `readme-audit`
> (G5) **and** `progress-update` (G6) — §23's full prerequisite chain, not a subset of it. This gate
> assumes the code has been reviewed **in full**:
> the verdict reads `PROJECT-BACKLOG.md`, whose task list is only as complete as the review that wrote
> it, so a tier whose `**Last Reviewed — «tier»:**` line reads `never` or carries an
> `(incomplete — …)` qualifier leaves G3/G4 unsigned under §23 and this gate computing a verdict over
> findings nobody made. Neither review condition is about the run having happened, and neither is G6's:
> that one closes on a **clean drift report**. The READMEs must be correct and PROGRESS.md accurate.
> Before running, check off (✅) any backlog tasks you have already fixed — the verdict counts unchecked
> tasks as open even if the code is done.
>
> **A project with an incomplete step owes none of the three.** Check 1 stops it at ❌ Not ready
> without reading `PROJECT-BACKLOG.md` at all; the CV bullet G6 underwrites is never drafted, because
> Phase 3 is skipped on ❌; and the one scan that still opens a README only downgrades a ✅, which a ❌
> cannot be. Running the chain first buys such a run nothing, which is why recipe B
> (`PROJECT_PATH = all`) admits every project and calls that verdict expected rather than an error.
> Nor does it fork §23: a ❌ can never tick G7's box, so the exempt run signs off no gate.
> **The exemption is that path and no wider**, and the steps are read where Check 1 reads them —
> PLANNING.md's Section 0 or its steps list, not a `§15` heading every plan has. All ✅ owes the whole
> chain unqualified, and a project whose steps cannot be read there is not exempt — run the chain. In
> `PROJECT_PATH = all` this binds per project, never per run.

> **Run-start check (step 0):** before anything else, execute the decision table in `notes/prompts/_internal/_pipeline-self-report.md` against this prompt's own `_last-run-report`; never restate the shared `Status:` meanings here.

**Internal pieces this orchestrates** (you never launch these directly):
`_portfolio-standard.md` (the bar) · `_portfolio-write-prompt.md` (question author) ·
`_portfolio-review-prompt.md` (question reviewer) · `_portfolio-translate-prompt.md` (the `es/`
translator, stage T).

> **First run, use `DRY_RUN = true`.** It writes and reviews everything but commits **none of the audit
> outputs**, so you can read the diff first. (`DRY_RUN` governs the audit outputs only — the pipeline
> self-report is prompt-system machinery and commits itself either way; see the final step.) Once you
> trust it, `DRY_RUN = false` commits those outputs for you. For a ✅/⚠️ verdict, that commit pauses once
> for Victor to choose the one CV bullet that may persist; a ❌ verdict has no choice gate. Pushing the
> profile README from its own repo also remains a hand step by design.

---

## How to use — recipes

Open a fresh chat **inside the supported agent runtime**, paste the whole prompt below, fill only the config block, and
let it run to the end. Pick the recipe:

**A · Gate one project**
```
PROJECT_PATH = projects/07-timetrack
DRY_RUN      = true       ← true the first time; false once you trust it
```

**B · Gate every project in one run**
```
PROJECT_PATH = all
DRY_RUN      = false
```
(An unfinished project simply gets a ❌ Not ready verdict — that is expected, not an error.)

**Rules of thumb:**
- Fill in **only** the config block. Everything below it is machinery — never edit it.
- The verdict is honest: ❌ means the questions were still saved (they are useful prep) but no CV
  bullet or GitHub description was produced.

---

````
## Configuration — edit only this block

PROJECT_PATH = [projects/06-hr-portal | projects/07-timetrack | all]
DRY_RUN      = [false | true]

## PROJECT_PATH = all runs the gate on every project in turn — see notes/prompts/_internal/_batch-mode.md.
## Order: projects/01-todo-list, 02-weather-app, 03-expense-tracker, 04-meal-finder, 05-task-manager,
## 06-hr-portal, 07-timetrack. The project type is derived from the number (01–06 Angular-only, 07+ full-stack).

Use PROJECT_PATH and DRY_RUN wherever the prompt refers to {PROJECT_PATH} and {DRY_RUN}.

---

You are the orchestrator for the portfolio gate. Run hands-off except for the declared CV-bullet choice
before a ✅/⚠️ non-dry content commit.

> **Branch guard (step 0):** run `git branch --show-current`. Study materials commit on whatever
> branch is currently active (the shared session rules) — a feature branch is the normal case; name it in the final
> report. If you are on **`main`**, stop and ask Victor which branch to use — `main` never receives
> direct commits, only merges via PR.

> **Run baseline (step 0).** Record the current commit (`git rev-parse HEAD`) as `{BASELINE}`, and per
> project, before its first author dispatch, run `git status --porcelain` on
> `notes/interview-prep/projects/en/«name».md`. Every section subagent writes into that one file and the
> commit stages it wholesale, so this is the last moment a section's pre-run bytes are identifiable. A
> clean file means `{BASELINE}` holds them and the restore branch below is available; a dirty one means
> it does not. This is a baseline-availability check and nothing else.
>
> **The `es/` twin is deliberately not baselined.** Phase 1b's only disposition is leave-and-declare, so
> a baseline for it would have no consumer — and reading one would imply a restore branch that does not
> exist. Its safety comes from stage T's own STOP conditions, not from `{BASELINE}`.

First read
`notes/prompts/projects/portfolio/_internal/_portfolio-standard.md` so you know the verdict logic, the question
bar, and the CV / GitHub formats. Then run the procedure below. You stay light on the heavy part: you
dispatch the question subagents and the translator and wait — you never author or translate the
question bank in your own context.
The verdict + CV bullet + GitHub description are short and deterministic, so you do those yourself.

## If PROJECT_PATH = all
Per `notes/prompts/_internal/_batch-mode.md`, expand `all` into the ordered project list from the config block and
run the **single-project procedure below once per project**, fully finishing one before the next: with
`{DRY_RUN} = false`, resolve any CV-bullet choice and commit that project; with `{DRY_RUN} = true`, finish
its explicit no-commit handoff and leave its pending options under that project's own section. Never
overlap, since their subagents edit shared files and parallel commits race the git index.
Put each project's report under a `### [project]` heading, and after the last print the `_batch-mode.md`
summary table (`Project | Verdict | Questions`), whose Questions cell carries **both counts** —
`en/N · es/N`, or `en/N · es/—` where the twin was not produced, so a batch cannot report a bank as done
while half of it is missing. **Context guard for batch runs:** with ~7 projects × (up
to 5 sections × 2 subagents, plus one translator), full decision-by-decision traces returned to you
would saturate your own
context. In `all` mode, hold each subagent to its own return contract below and nothing more — the
author to its **question count, its allocated ID range and any decision it could not cover**, the
reviewer to its **question count, its questions-vs-decisions ratio, the IDs it allocated or repaired,
and the uncovered decisions if that ratio is below 1**, the
translator to its **verdict, its per-section counts including the frozen-kept ones, and its total** —
not the full trace (the trace still drives their own work; it just stays in their context).
**Every defect a subagent found inside a `[refined]` block returns in `all` mode too, verbatim and by
ID.** That is not trace and it is not summarisable: the freeze stopped every role from repairing it, the
hard rule below makes the final report its only route to Victor, and a batch that drops it is the one
shape in which a frozen question stays wrong forever. The translator's
per-section counts are the exception that is not a trace: they are the parity proof, they are two
numbers per section, and without them nothing in the run has checked the twin at all. Otherwise, for one project, follow the procedure.

## Single-project procedure

### Phase 1a — English question bank (one cold author → reviewer per SECTION)

**The unit of deep work is one section of the bank, not the whole bank.** The bank has five fixed
sections, each mapping to a distinct code area — so each is a specific, self-contained task a subagent
cannot half-finish (it either covered every decision in *that one area* or it did not). The mapping
lives in the standard's **"Bank sections → code areas (canonical table)"** — use that, including its
skip notes.

First decide which sections are **present** (does the project have auth? tests?) and drop the absent
ones. Then process the present sections **one at a time, sequentially** — they all edit the same
question file, so never overlap. For each section, run author then reviewer; neither commits.

**Subagent A — author (this section).** Launch a `role-appropriate` subagent, `reasoning tier: deep`,
`execution: foreground` (judging which code decisions are interview-worthy is the whole task):

> Read `notes/prompts/projects/portfolio/_internal/_portfolio-write-prompt.md` and execute it for
> `PROJECT_PATH = {PROJECT_PATH}`, `SECTION = «this section»`. **Read only this section's code area**
> (the standard's canonical table) plus PLANNING.md — **and the bank file itself, whose bold lines you
> need for the ID counter and the dedupe rule** — and write **only this section's** questions to
> `notes/interview-prep/projects/en/«name».md` per the standard — each with the next unused
> `«name»-NNN` ID **allocated over the whole file**, and never touching a block that carries `[refined]`.
> **Do NOT commit.** Build a
> decision-by-decision trace in your own context to drive exhaustiveness, but return only the
> **question count, the ID range you allocated, any defect you found in a refined block, and any
> decision you could not cover** — the reviewer re-walks the code itself.

Wait for A. **If A returns `BLOCKED`** — it could not complete the section — that section gets no
reviewer: note it and move to the next. Skipping B is not the whole disposition, because A has already
written into the shared question file and the commit below stages that file wholesale. Take
`_agent-runtime-standard.md`'s returned-blocked branch, which this prompt binds as: **restore** that
section's span in `notes/interview-prep/projects/en/«name».md` from
`git show {BASELINE}:notes/interview-prep/projects/en/«name».md` — that one section's span only, never the
file, which holds the sections this run already finished — **but only when all three hold**: the file
was **tracked** at `{BASELINE}`, that section's heading **existed in it there**, and the file was clean
at `{BASELINE}`. Otherwise **leave it and declare it** as `blocked — partial`. The three conditions are
not ceremony: this bank is **created by the first run**, and on that run the file does not exist, so
`git status --porcelain` on it prints nothing at all — which reads as "clean" and would send you to a
`git show` that fails with `fatal: path … does not exist`. The author is also told to create a missing
heading, so a section can be clean-and-tracked and still have no span to restore. Either way the section
is never reported as done and its uncovered decisions stand. A role that **died** rather than returned is the
dispatch contract's other case: run its ladder, and if it is genuinely undispatchable, **stop without
partial commits** — this prompt has no single-agent fallback, so the orchestrator never authors or
audits a section itself.

Then **subagent B — reviewer (this section).** Launch a second, independent
`role-appropriate` subagent, `reasoning tier: deep`, `execution: foreground` (it re-walks the code hunting
decisions the author missed — same judgment as authoring; this is the portfolio's go/no-go gate,
the wrong place to save):

> Read `notes/prompts/projects/portfolio/_internal/_portfolio-review-prompt.md` and execute it for
> `PROJECT_PATH = {PROJECT_PATH}`, `SECTION = «this section»`. Audit **only this section** hard against
> the standard: walk its code area, count decisions-found vs questions, add every missing one, fix
> thin/weak/duplicate questions directly — **except inside a `[refined]` block, which you judge, count
> and report but never repair**. Check every question carries a well-formed, unique `«name»-NNN` ID,
> reading the whole bank file's **bold lines only** for it — uniqueness is a whole-file property and your
> section cannot answer it alone. Report a collision with a question outside your section rather than
> renumbering it; the cross-section renumber is mine.
> **Do NOT commit.** Return your verdict (PASS/FIXED), the
> **questions-vs-decisions ratio for this section**, the IDs you allocated or repaired, every defect you
> left standing inside a refined block, and — only if that ratio is still below 1 — the
> **list of decisions you left uncovered**, which is what the acceptance gate below re-dispatches on.
> Write your findings and verdict to «scratch path for this section» as you reach them, before
> returning; if you cannot finish, say `BLOCKED — <reason>` and which questions you already changed.

Pass B a real scratch path — `_agent-runtime-standard.md` requires it on every `reviewer` dispatch, and
requires the orchestrator to read it when the reviewer dies.

Wait for B. **Acceptance gate — act on B's ratio, don't just record it:** if B reports a
questions-vs-decisions ratio below 1 (decisions found in the code area that still have no question), the
section is not done — re-dispatch subagent B **once** for the same section, telling it which decisions
its own report listed as uncovered, so it adds the missing questions. One retry maximum; if the ratio is
still below 1 after the retry, **this content acceptance gate has failed**: note the uncovered decisions
in the final report instead of looping. Ending the section there scopes the **section** and never the
run's close-out — `_agent-runtime-standard.md` → "Runnable close-out contract" settles that: only a run
satisfying its content acceptance gates closes out as `completed`. Only then start the next section.

**Two not-complete shapes, disposed of differently.** A ratio still below 1 is *finished* content that
covers less than everything: keep every byte and declare the uncovered decisions. A **half-written**
section — A or B returned `BLOCKED` — takes the restore-or-declare branch above, because nobody finished
those bytes; a **B** block always takes the leave-and-declare side of it, since restoring would revert
past A's finished pass to undo a partial edit. A declared `BLOCKED` is not a below-1 ratio and does not
consume the one retry. **Both are reported as not-complete, and both record this project's outcome in
`_run-tracker.md` as `blocked`, never `completed`** — only a `completed` result satisfies a prerequisite,
and a failed content acceptance gate bars the word whichever shape produced it. This is the mode-neutral
half: `{DRY_RUN}` governs what gets **committed**, not whether the run's own gates passed, so a dry run
holding a not-complete section still records `blocked` and not `dry-run`.

**After all sections — orchestrator (light global scan).** Do a quick cross-section duplicate scan
over the finished bank (the same decision or code path landing in two sections → keep it in the one
where an interviewer is likeliest to ask it, remove the other). Fix a stray duplicate directly — this
needs the whole-file view, so it belongs here, not in a per-section subagent. Then continue to Phase 1b.

**Two constraints on that scan, both from the standard's identity section.** A question carrying
`[refined]` is **never the one you delete**: where a frozen question and an unrefined one duplicate, the
unrefined one goes, and where two frozen ones do, you delete neither and report the pair by ID. And the
scan is the run's **last** chance to catch a **duplicate ID** — each section's reviewer checks for one
and repairs what it can see, but each allocated from its own read of the file, so a collision between two
sections is one only a whole-file pass is guaranteed to catch. Renumber the later of
the two to the next unused number in the file, never a frozen one (its ID is part of what is frozen —
report that pair instead), and never renumber to close a gap a deletion left.

**Count the questions carrying no ID at all, and report the number.** Each section's reviewer allocates
the missing IDs in its own section, so on a healthy run this is zero — but a section whose author
returned `BLOCKED` never got a reviewer, and a bank written before this rule existed (`01-todo-list`,
79 questions) carries none until its first run under it. A question with no ID cannot be named by a
`TODO:` or frozen with `[refined]`, so a non-zero count is a debt this run leaves behind and the final
report says so by section. Do not backfill them yourself: allocating IDs across a bank is per-section
work, and the section that was blocked is the one nobody finished.

**Do the dedupe before Phase 1b, never after.** A duplicate removed from the English after the twin
exists leaves an orphan question in the Spanish that no parity count catches until the next run — the
`es/` would simply have one section one question longer, which reads as a translator error rather than
as your edit.

### Phase 1b — Spanish twin (one translator per PROJECT, after every section)

The English bank is now finished and deduped, so it is a stable source. **Subagent T — translator
(whole bank).** Launch one `role-appropriate` subagent, `reasoning tier: deep`,
`execution: foreground` (rendering an interview answer so it still sounds like Victor is judgment, not
substitution):

> Read `notes/prompts/projects/portfolio/_internal/_portfolio-translate-prompt.md` and execute it for
> `PROJECT_PATH = {PROJECT_PATH}`. Translate the finished
> `notes/interview-prep/projects/en/«name».md` into its twin
> `notes/interview-prep/projects/es/«name».md`. **Do NOT commit.** «If any section was left
> half-written, name it here so it is skipped rather than half-translated.» Copy every question ID
> verbatim, and **keep the existing Spanish of a `[refined]` question byte-for-byte** instead of
> re-rendering it. Return `TRANSLATED`,
> `RE-SYNCED`, `TODO-STOPPED` or `BLOCKED`, the per-section English/Spanish question counts **and their
> frozen-kept counts**, the
> totals, and any English question you believe is wrong — which you did not change.

It runs **once per project, not once per section**: the whole point of the stage is that it sees one
stable, reviewed source, and five per-section translators would each re-derive the register from
scratch and produce a twin that changes voice at every heading.

**Parity gate — act on T's counts, don't just record them.** If any section's Spanish count differs
from its English count, or a section is missing that was not named as skipped, the twin is not done:
re-dispatch T **once**, naming the exact sections that disagree. One retry maximum; if parity still
fails, **this content acceptance gate has failed** — name the mismatched sections in the final report
and record this project `blocked` in `_run-tracker.md`, on the dry branch too, exactly as a below-1
ratio does in Phase 1a.

**If T returns `TODO-STOPPED`, the parity gate does not apply and neither does a retry.** The `es/` on
disk carries `TODO:` markers Victor wrote, so stage T wrote nothing at all: the twin is intact, it is
**his**, and it is simply older than the English this run just changed. Do not re-dispatch — T would
stop on the same markers. Label it `es/ untouched — TODO stop`, name the markers in the final report so
he knows the twin is now behind, and **leave the `es/` file out of the commit entirely** (see the
staging rule below). The project still records `blocked` in `_run-tracker.md`, because the pair this
run was supposed to produce was not produced.

**If T returns `BLOCKED`** — a half-written twin — take the leave-and-declare side, never the restore
side. The `es/` is created by this stage, so on a first run there is nothing at `{BASELINE}` to restore
to, and on a later run restoring would throw away a twin that is more current than the committed one.
Declare it `blocked — partial (es/)`, and the project records `blocked`.

**A missing twin does not move the Phase 2 verdict**, for the reason the thin-bank rule already gives
below: the verdict is the go/no-go on the **project**, and no part of it reads the question bank in
either language.

### Phase 2 — Verdict (orchestrator)

Compute the verdict yourself per the standard's **verdict logic**: Check 1 (feature completeness from
`{PROJECT_PATH}/PLANNING.md`) gates Check 2 (code quality from `{PROJECT_PATH}/PROJECT-BACKLOG.md`).
Produce ✅ Ready / ⚠️ Almost / ❌ Not ready, listing incomplete steps or open High/Medium tasks as
checkboxes. If the backlog file is missing, carries no `**Last Reviewed — «tier»:**` header, or a
tier's line reads `never` or carries an `(incomplete — …)` qualifier — stop and report which
`review-audit` run is owed; the standard's Check 2 owns those four states, the exact wording, and what
a stop does to Phase 3, the tracker cell and the batch summary row — a stop is not a verdict, so do not
print one.

**Two quick sanity scans before you finalize the verdict** (report each as a one-line note, do not
auto-fix):
- **Resolved-but-unchecked tasks.** The verdict counts every `[ ]` as open. For each open High/Medium
  task, glance at the real code — if it looks already done, flag it: "task X marked open but appears
  resolved — check it off in the backlog and re-run if so". Never silently treat it as done.
- **Unfilled visual placeholders.** Scan the global README for `*(screenshot — … — to be added)*` /
  `*(GIF — … )*` placeholders. A README full of unfilled visuals is not recruiter-ready — if any
  remain, downgrade a ✅ to ⚠️ and list them.

### Phase 3 — CV bullet + GitHub description (orchestrator)

**Skip Phase 3 entirely if the verdict is ❌ Not ready — and equally if Check 2 stopped the gate**, where
there is no verdict at all: a stop writes no CV bullet, so nothing may reach `notes/cv/cv-bullets.md` on
that path. Otherwise, per the standard: draft two Spanish
CV bullet options (read `_application-standard.md` first) and save them to `notes/cv/cv-bullets.md`; draft
one English GitHub description (output only — Victor sets it in the repo settings manually).

**Only when the verdict is ✅ Ready** (a truly portfolio-ready project, not ⚠️ Almost), **update Victor's
GitHub profile README directly**. It lives at `dev/portfolio/VMNunez` — his GitHub profile repo, **outside
this repo** (`dev/portfolio/VMNunez/README.md`, or the profile file that repo uses). You are the one
responsible for keeping it current: read the existing README first to match its exact style and sections,
then add or refresh this project's entry (name, one-line pitch, stack, links) in that same style — never
paste a raw block for Victor to place by hand. Because it is a **separate git repo**, do not commit it
inside the learning flow: after editing, print the commit + push commands for that repo (run from
`dev/portfolio/VMNunez`) for Victor to run there. Only touch `dev/portfolio/` for this ✅-Ready step.

## Finishing

**If Check 2 stopped the gate** (no backlog · no `Last Reviewed` header · a tier reading `never` or
carrying `(incomplete — …)`), the list below does not apply: print item 1, then the stop and the exact
`review-audit` run owed, and nothing else — no verdict, no CV bullet, no GitHub description, no profile
README. With `{DRY_RUN}` = false, commit the question bank on the ❌ branch's `git add` below, because
questions are saved regardless of the outcome; with `{DRY_RUN}` = true commit none of it and print that
sequence instead, exactly as on any other verdict. Either way, record this project `blocked` in
`_run-tracker.md`. Then the self-report.

Otherwise print, in this order:
1. "Saved X questions to notes/interview-prep/projects/en/«name».md, and X to its `es/` twin" (do not
   reprint the questions). If the two numbers differ, or the twin is missing, say which sections and
   why — a pair reported as one number is the one thing a later reader cannot check. Add the **ID range
   this run allocated**, and, on its own line, **every defect a subagent reported inside a `[refined]`
   block, quoted and by ID**. That line is the only route those defects have: the freeze stopped every
   role from repairing them, and Victor is the only reader who can reopen one.
2. **Final verdict: ✅ Ready / ⚠️ Almost / ❌ Not ready** (with the checkbox list if ⚠️/❌).
3. CV bullet (two options) — **omit if ❌**.
4. GitHub description (one option) — **omit if ❌**.
5. If ✅ Ready: "Updated the GitHub profile README at `dev/portfolio/VMNunez`", then the commit + push
   commands to run **from that repo** (`dev/portfolio/VMNunez`). Omit if ⚠️/❌.
6. If ✅/⚠️, both draft options are in `notes/cv/cv-bullets.md`, but a committed section may contain
   exactly one. With `{DRY_RUN}` = true print "edit `notes/cv/cv-bullets.md` to keep only your chosen
   bullet **before running the commit below**; then scan the whole file and verify every project section
   has exactly one bullet and no `choose one` marker". With `{DRY_RUN}` = false, present A and B and **pause
   before the content commit** for Victor to choose one. Do not continue, start the next batch target,
   or run the final self-report while that answer is pending. After the answer, delete the other option
   and the choice marker, then run the same integrity gate over the **whole** `cv-bullets.md`: every
   project section must have exactly one bullet and no choice marker. If an older section still has two
   options, pause for Victor's selection there too and clean it before staging the file. In
   `PROJECT_PATH = all`, resume and commit this project before starting the next one.

**If `{DRY_RUN}` = false:** after the choice gate above when one applies, commit atomically — with the safety check first: run `git status` before
the add and again before the commit, confirm only the intended `notes/` files are staged
(`git restore --staged` anything else, especially project code left staged from an earlier step).
If ✅/⚠️ (cv-bullets was written):
`git add notes/interview-prep/projects/en/«name».md notes/cv/cv-bullets.md`, **plus
`notes/interview-prep/projects/es/«name».md` when that file exists on disk**, then
`git commit -m "docs: portfolio-audit «name» — <one-line summary + verdict>"`.
If ❌ (no cv-bullets): `git add notes/interview-prep/projects/en/«name».md`, plus the `es/` path on the
same condition, then the same commit message.

**Both halves are staged on every verdict branch — but only the `es/` this run actually wrote.** The
test is T's return token, **not** whether the file is on disk, and the two differ on the case that
matters:

- `TRANSLATED` / `RE-SYNCED` → **stage the `es/`.** A commit carrying the English alone leaves the twin
  behind for a run that will never notice it is missing.
- `BLOCKED`, or the translator died → the file may be half-written or absent. Stage it only if it
  exists, and label the commit `blocked — partial (es/)`. `git add` on a pathspec that matches nothing
  aborts the whole add, so never name a path you have not checked.
- `TODO-STOPPED` → **never stage it.** This is the one case a disk check gets backwards: the file is
  present *because* stage T refused to touch it, and what is in the working tree is Victor's own
  Spanish, written while studying and quite possibly uncommitted. Staging it would commit his authored
  prose inside a `docs: portfolio-audit …` commit, under an auto-commit authorization that covers this
  run's **outputs** and nothing else. Label the commit `es/ untouched — TODO stop`.

The pre-add safety check below cannot catch this for you — it confirms only that the staged `notes/`
paths were intended, and on this branch the `es/` path *looks* intended.

**A project with a not-complete section still commits — but labelled.** Name every such section in the
commit message body with its shape (`blocked — partial` restored / `blocked — partial` left in the tree
/ `uncovered decisions` / `parity failed (es/)` / `blocked — partial (es/)`). Its outcome is not decided here — Phase 1a's two-shapes rule and Phase 1b's parity and
`TODO-STOPPED` branches already fixed it as `blocked`, on the dry branch too. The label is not ceremony: this bank has no machine-readable
freshness marker of its own — no fingerprint, and `/simulator` reads the folder ungated — so that label
and the tracker cell are the only marks either shape leaves on disk.

**Neither shape moves the Phase 2 verdict.** That verdict is the go/no-go on the **project**, and
`_portfolio-standard.md`'s verdict logic owns it: PLANNING.md, then the backlog, then its two sanity
scans — none of which reads the question bank, which is saved regardless of the outcome. A thin bank
says this run under-covered the code, not that the project is less ready to show a recruiter; wiring it
into the verdict would make recruiter readiness depend on how well this prompt's own subagents
performed.

**If `{DRY_RUN}` = true:** commit none of the audit outputs (the final step's self-report still commits
itself — it is machinery, not an audit output). Leave the rest in the working tree and print the
`git add` + `git commit` sequence above, one command per code block, for Victor to run after reading
the diff.

## Hard rules

- **Auto-commit is authorized for this flow only, and only when `DRY_RUN = false`.** Victor's global
  rule is "never auto-commit"; he lifted it for the audit orchestrators. For a ✅/⚠️ verdict the
  authorization begins only after Victor chooses the single CV bullet; it never authorizes committing
  both options. It applies nowhere else.
- **`cv-bullets.md` is staged only after its whole-file integrity gate passes.** Every project section
  has exactly one bullet and no choice marker; validating only the section written this run is not enough.
- **Questions are saved regardless of the verdict** — a ❌ still commits the question file.
- **One atomic commit per project.** In `all` mode, one commit per project, never batched. The
  orchestrator commits once, after every section's author→reviewer pair **and the project's translator**
  are done; neither the section subagents nor the translator commits.
- **One SECTION per subagent — never the whole bank.** Authoring and review run one cold subagent per
  bank section, in sequence, each mining only that section's code area and returning a
  decision-by-decision trace. A subagent handed the whole project would skim the last sections (thin
  Testing/Business-Rules is exactly that failure). Whole-bank work is limited to the light cross-section
  dedupe the orchestrator does at the end **and to the translator**, which is whole-bank on purpose:
  its job is one consistent Spanish voice across the file, and a per-section split would re-derive that
  voice five times. It is also the one whole-bank role that cannot skim, because its own parity counts
  are checked section by section.
- **Author then reviewer per section, sequentially, then one translator for the project.** Never
  overlap a section's two subagents or two sections — the reviewer must see a finished section, and
  they edit the same file. Never skip the reviewer pass, and never run the translator before the last
  section's reviewer and the cross-section dedupe have finished.
- **A `[refined]` question is Victor's, and no role of this run may write, alter or delete one.** The
  standard's freeze binds the author, the reviewer, the translator and your own cross-section dedupe;
  the marker is written by Victor alone and reopened by him alone, by his word or by a `TODO:`. Every
  defect a subagent finds inside a frozen block reaches him through the final report and nowhere else,
  so print those lines rather than folding them into a count. `[studied]` is **not** admitted in this
  bank at all — its three rulings are open in `REC-180` — so a run that finds one reports it as
  malformed and changes nothing.
- **The English is authored and the Spanish is rendered — never the other way round, and never both at
  once.** The author and the reviewer write only `en/`; the translator writes only `es/` and changes no
  English. A run that lets one role do both produces a Spanish file written before the English was
  audited, which is the re-sync this stage exists to avoid.

### Final step — pipeline self-report

After everything above is done, read `notes/prompts/_internal/_pipeline-self-report.md` and execute it for this
run — write the report file in this orchestrator's folder, commit it on its own, and print the five
bullets in chat. The self-report is prompt-system machinery: it commits itself **even when
`DRY_RUN = true`** (only the project outputs stay uncommitted).

````
