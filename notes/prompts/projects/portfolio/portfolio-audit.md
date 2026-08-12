# Portfolio audit — the single entry point for the portfolio gate

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

> **External-path preflight:** Before reading or writing `dev/portfolio/VMNunez`, execute
> `notes/prompts/_internal/_external-path-preflight.md`. Stop before any write if it fails.

Run this **inside the supported agent runtime**. It is the only portfolio prompt Victor launches. It runs the **final
go/no-go gate** on a finished project, hands-off: is it ready to show a recruiter and reference in a job
application **today**? It produces four things (see `_portfolio-standard.md`):

1. An **exhaustive bank of project-specific interview questions** — built **one bank section at a time**,
   each authored then cold-reviewed by its own pair of subagents (so no section gets skimmed), saved
   regardless of the verdict.
2. A **verdict** — ✅ Ready / ⚠️ Almost / ❌ Not ready.
3. If not ❌ — a **CV bullet** (Spanish, reused as-is by `cv-prompt`) and a **GitHub description**.
4. If ✅ Ready — a **direct update of Victor's GitHub profile README** (`dev/portfolio/VMNunez`, a
   separate repo) to feature the project.

This is the closing project gate, **G7** — it runs after G3/G4 (`review-audit`), G5 (`readme-audit`)
and a clean G6 (`progress-update`), and it is the last gate that reads the project itself
(`roadmap-review` / G8 follows). The gate order and every trigger are owned by `_planning-standard.md`
§23; where this prompt and §23 disagree, **§23 wins**.

> **▶ Run first:** `review-audit` (G3/G4), `readme-audit` (G5) **and** `progress-update` (G6) — §23's
> full prerequisite chain, not a subset of it. This gate assumes the code has been reviewed (the verdict
> reads `PROJECT-BACKLOG.md`, which `review-audit` writes), the READMEs are correct, and PROGRESS.md is
> accurate — and G6 closes on a **clean drift report**, not on the run having happened.
> Before running, check off (✅) any backlog tasks you have already fixed — the verdict counts unchecked
> tasks as open even if the code is done.

> **Run-start check (step 0):** before anything else, run the check in `notes/prompts/_internal/_pipeline-self-report.md` — read this prompt's own `_last-run-report` and, if its `Status` is `open`, surface that finding in one line before proceeding.

**Internal pieces this orchestrates** (you never launch these directly):
`_portfolio-standard.md` (the bar) · `_portfolio-write-prompt.md` (question author) ·
`_portfolio-review-prompt.md` (question reviewer).

> **First run, use `DRY_RUN = true`.** It writes and reviews everything but commits **none of the audit
> outputs**, so you can read the diff first. (`DRY_RUN` governs the audit outputs only — the pipeline
> self-report is prompt-system machinery and commits itself either way; see the final step.) Once you
> trust it, `DRY_RUN = false` commits those outputs for you. Two hand steps always remain by design:
> pruning the CV bullet options, and pushing the profile README from its own repo.

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

You are the orchestrator for the portfolio gate, hands-off.

> **Branch guard (step 0):** run `git branch --show-current`. Study materials commit on whatever
> branch is currently active (the shared session rules) — a feature branch is the normal case; name it in the final
> report. If you are on **`main`**, stop and ask Victor which branch to use — `main` never receives
> direct commits, only merges via PR.

First read
`notes/prompts/projects/portfolio/_internal/_portfolio-standard.md` so you know the verdict logic, the question
bar, and the CV / GitHub formats. Then run the procedure below. You stay light on the heavy part: you
dispatch the two question subagents and wait — you never author the question bank in your own context.
The verdict + CV bullet + GitHub description are short and deterministic, so you do those yourself.

## If PROJECT_PATH = all
Per `notes/prompts/_internal/_batch-mode.md`, expand `all` into the ordered project list from the config block and
run the **single-project procedure below once per project**, fully finishing one (including its commit)
before the next — never overlap, since their subagents commit and parallel commits race the git index.
Put each project's report under a `### [project]` heading, and after the last print the `_batch-mode.md`
summary table (`Project | Verdict | Questions`). **Context guard for batch runs:** with ~7 projects × up
to 5 sections × 2 subagents, full decision-by-decision traces returned to you would saturate your own
context. In `all` mode, hold each subagent to its own return contract below and nothing more — the
author to its **question count and any decision it could not cover**, the reviewer to its **question
count, its questions-vs-decisions ratio, and the uncovered decisions if that ratio is below 1** — not the
full trace (the trace still drives their own work; it just stays in their context). Otherwise, for one project, follow the procedure.

## Single-project procedure

### Phase 1 — Question bank (one cold author → reviewer per SECTION)

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
> (the standard's canonical table) plus PLANNING.md, and write **only this section's** questions to
> `notes/interview-prep/projects/«name».md` per the standard. **Do NOT commit.** Build a
> decision-by-decision trace in your own context to drive exhaustiveness, but return only the
> **question count and any decision you could not cover** — the reviewer re-walks the code itself.

Wait for A. Then **subagent B — reviewer (this section).** Launch a second, independent
`role-appropriate` subagent, `reasoning tier: deep`, `execution: foreground` (it re-walks the code hunting
decisions the author missed — same judgment as authoring; this is the portfolio's go/no-go gate,
the wrong place to save):

> Read `notes/prompts/projects/portfolio/_internal/_portfolio-review-prompt.md` and execute it for
> `PROJECT_PATH = {PROJECT_PATH}`, `SECTION = «this section»`. Audit **only this section** hard against
> the standard: walk its code area, count decisions-found vs questions, add every missing one, fix
> thin/weak/duplicate questions directly. **Do NOT commit.** Return your verdict (PASS/FIXED), the
> **questions-vs-decisions ratio for this section**, and — only if that ratio is still below 1 — the
> **list of decisions you left uncovered**, which is what the acceptance gate below re-dispatches on.

Wait for B. **Acceptance gate — act on B's ratio, don't just record it:** if B reports a
questions-vs-decisions ratio below 1 (decisions found in the code area that still have no question), the
section is not done — re-dispatch subagent B **once** for the same section, telling it which decisions
its own report listed as uncovered, so it adds the missing questions. One retry maximum; if the ratio is
still below 1 after the retry, note the uncovered decisions in the final report instead of looping.
Only then start the next section.

**After all sections — orchestrator (light global scan).** Do a quick cross-section duplicate scan
over the finished bank (the same decision or code path landing in two sections → keep it in the one
where an interviewer is likeliest to ask it, remove the other). Fix a stray duplicate directly — this
needs the whole-file view, so it belongs here, not in a per-section subagent. Then continue to Phase 2.

### Phase 2 — Verdict (orchestrator)

Compute the verdict yourself per the standard's **verdict logic**: Check 1 (feature completeness from
`{PROJECT_PATH}/PLANNING.md`) gates Check 2 (code quality from `{PROJECT_PATH}/PROJECT-BACKLOG.md`).
Produce ✅ Ready / ⚠️ Almost / ❌ Not ready, listing incomplete steps or open High/Medium tasks as
checkboxes. If the backlog file is missing, stop and report "run `review-audit` first".

**Two quick sanity scans before you finalize the verdict** (report each as a one-line note, do not
auto-fix):
- **Resolved-but-unchecked tasks.** The verdict counts every `[ ]` as open. For each open High/Medium
  task, glance at the real code — if it looks already done, flag it: "task X marked open but appears
  resolved — check it off in the backlog and re-run if so". Never silently treat it as done.
- **Unfilled visual placeholders.** Scan the global README for `*(screenshot — … — to be added)*` /
  `*(GIF — … )*` placeholders. A README full of unfilled visuals is not recruiter-ready — if any
  remain, downgrade a ✅ to ⚠️ and list them.

### Phase 3 — CV bullet + GitHub description (orchestrator)

**Skip Phase 3 entirely if the verdict is ❌ Not ready.** Otherwise, per the standard: draft two Spanish
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

Print, in this order:
1. "Saved X questions to notes/interview-prep/projects/«name».md" (do not reprint the questions).
2. **Final verdict: ✅ Ready / ⚠️ Almost / ❌ Not ready** (with the checkbox list if ⚠️/❌).
3. CV bullet (two options) — **omit if ❌**.
4. GitHub description (one option) — **omit if ❌**.
5. If ✅ Ready: "Updated the GitHub profile README at `dev/portfolio/VMNunez`", then the commit + push
   commands to run **from that repo** (`dev/portfolio/VMNunez`). Omit if ⚠️/❌.
6. If ✅/⚠️: both bullet options are in `notes/cv/cv-bullets.md`, and choosing between them is Victor's,
   so it never blocks the run. With `{DRY_RUN}` = true print "edit `notes/cv/cv-bullets.md` to keep only
   your chosen bullet **before running the commit below**"; with `{DRY_RUN}` = false the file is already
   committed with both, so print "both options were committed — delete the one you don't want next time
   you touch the CV".

**If `{DRY_RUN}` = false:** commit atomically — with the safety check first: run `git status` before
the add and again before the commit, confirm only the intended `notes/` files are staged
(`git restore --staged` anything else, especially project code left staged from an earlier step).
If ✅/⚠️ (cv-bullets was written):
`git add notes/interview-prep/projects/«name».md notes/cv/cv-bullets.md`, then
`git commit -m "docs: portfolio-audit «name» — <one-line summary + verdict>"`.
If ❌ (no cv-bullets): `git add notes/interview-prep/projects/«name».md`, then the same commit message.

**If `{DRY_RUN}` = true:** commit none of the audit outputs (the final step's self-report still commits
itself — it is machinery, not an audit output). Leave the rest in the working tree and print the
`git add` + `git commit` sequence above, one command per code block, for Victor to run after reading
the diff.

## Hard rules

- **Auto-commit is authorized for this flow only, and only when `DRY_RUN = false`.** Victor's global
  rule is "never auto-commit"; he lifted it for the audit orchestrators. It applies nowhere else.
- **Questions are saved regardless of the verdict** — a ❌ still commits the question file.
- **One atomic commit per project.** In `all` mode, one commit per project, never batched. The
  orchestrator commits once, after every section's author→reviewer pair is done; the section subagents
  never commit.
- **One SECTION per subagent — never the whole bank.** Authoring and review run one cold subagent per
  bank section, in sequence, each mining only that section's code area and returning a
  decision-by-decision trace. A subagent handed the whole project would skim the last sections (thin
  Testing/Business-Rules is exactly that failure). Whole-bank work is limited to the light cross-section
  dedupe the orchestrator does at the end.
- **Author then reviewer per section, sequentially.** Never overlap a section's two subagents or two
  sections — the reviewer must see a finished section, and they edit the same file. Never skip the
  reviewer pass.

### Final step — pipeline self-report

After everything above is done, read `notes/prompts/_internal/_pipeline-self-report.md` and execute it for this
run — write the report file in this orchestrator's folder, commit it on its own, and print the five
bullets in chat. The self-report is prompt-system machinery: it commits itself **even when
`DRY_RUN = true`** (only the project outputs stay uncommitted).

````
