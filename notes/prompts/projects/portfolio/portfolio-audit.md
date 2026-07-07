# Portfolio audit — the single entry point for the portfolio gate

Run this **inside Claude Code**. It is the only portfolio prompt Victor launches. It runs the **final
go/no-go gate** on a finished project, hands-off: is it ready to show a recruiter and reference in a job
application **today**? It produces three things (see `_portfolio-standard.md`):

1. An **exhaustive bank of project-specific interview questions** — authored then cold-reviewed by two
   subagents, saved regardless of the verdict.
2. A **verdict** — ✅ Ready / ⚠️ Almost / ❌ Not ready.
3. If not ❌ — a **CV bullet** (Spanish, reused as-is by `cv-prompt`) and a **GitHub description**.

It is the last link in the per-project chain: `plan-audit` → build → `readme-review` → `review-audit`
→ **portfolio-audit**.

> **▶ Run first:** `readme-review` **and** `review-audit` — this gate assumes the README is correct
> and the code has been reviewed (the verdict reads `PROJECT-BACKLOG.md`, which `review-audit` writes).
> Before running, check off (✅) any backlog tasks you have already fixed — the verdict counts unchecked
> tasks as open even if the code is done.

**Internal pieces this orchestrates** (you never launch these directly):
`_portfolio-standard.md` (the bar) · `portfolio-write-prompt.md` (question author) ·
`portfolio-review-prompt.md` (question reviewer).

> **First run, use `DRY_RUN = true`.** It writes and reviews everything but commits nothing, so you can
> read the diff first. Once you trust it, `DRY_RUN = false` is fully hands-off.

---

## How to use — recipes

Open a fresh chat **inside Claude Code**, paste the whole prompt below, fill only the config block, and
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

PROJECT_PATH = [angular/06-hr-portal | projects/07-timetrack | all]
DRY_RUN      = [false | true]

## PROJECT_PATH = all runs the gate on every project in turn — see notes/prompts/_batch-mode.md.
## Order: angular/01-todo-list, 02-weather-app, 03-expense-tracker, 04-meal-finder, 05-task-manager,
## 06-hr-portal, projects/07-timetrack. The project type is derived per path (angular/ vs projects/).

Use PROJECT_PATH and DRY_RUN wherever the prompt refers to {PROJECT_PATH} and {DRY_RUN}.

---

You are the orchestrator for the portfolio gate, hands-off. First read
`notes/prompts/projects/portfolio/_portfolio-standard.md` so you know the verdict logic, the question
bar, and the CV / GitHub formats. Then run the procedure below. You stay light on the heavy part: you
dispatch the two question subagents and wait — you never author the question bank in your own context.
The verdict + CV bullet + GitHub description are short and deterministic, so you do those yourself.

## If PROJECT_PATH = all
Per `notes/prompts/_batch-mode.md`, expand `all` into the ordered project list from the config block and
run the **single-project procedure below once per project**, fully finishing one (including its commit)
before the next — never overlap, since their subagents commit and parallel commits race the git index.
Put each project's report under a `### [project]` heading, and after the last print the `_batch-mode.md`
summary table (`Project | Verdict | Questions`). Otherwise, for one project, follow the procedure.

## Single-project procedure

### Phase 1 — Question bank (author → reviewer)

**Subagent A — author.** Launch one `general-purpose` subagent, `run_in_background: false`:

> Read `notes/prompts/projects/portfolio/portfolio-write-prompt.md` and execute it in full for
> `PROJECT_PATH = {PROJECT_PATH}`. Read the project, write the exhaustive project-specific question bank
> to `notes/interview-prep/projects/«name».md` per the standard. **Do NOT commit** — a reviewer runs
> next and the orchestrator owns the commit. Report the files read, the question count, and the section
> breakdown.

Wait for A. Then **subagent B — reviewer.** Launch a second, independent `general-purpose` subagent,
`run_in_background: false`:

> Read `notes/prompts/projects/portfolio/portfolio-review-prompt.md` and execute it in full for
> `PROJECT_PATH = {PROJECT_PATH}`. Audit the just-authored question bank hard against the standard, fix
> thin/weak/duplicate questions directly, add any missing ones. **Do NOT commit.** Report your verdict
> (PASS/FIXED + what changed) and the final question count + section breakdown.

Wait for B before continuing.

### Phase 2 — Verdict (orchestrator)

Compute the verdict yourself per the standard's **verdict logic**: Check 1 (feature completeness from
`{PROJECT_PATH}/PLANNING.md`) gates Check 2 (code quality from `{PROJECT_PATH}/PROJECT-BACKLOG.md`).
Produce ✅ Ready / ⚠️ Almost / ❌ Not ready, listing incomplete steps or open High/Medium tasks as
checkboxes. If the backlog file is missing, stop and report "run `review-audit` first".

### Phase 3 — CV bullet + GitHub description (orchestrator)

**Skip Phase 3 entirely if the verdict is ❌ Not ready.** Otherwise, per the standard: draft two Spanish
CV bullet options (read `_application-standard.md` first) and save them to `notes/cv/cv-bullets.md`; draft
one English GitHub description (output only — Victor sets it in the repo settings manually).

## Finishing

Print, in this order:
1. "Saved X questions to notes/interview-prep/projects/«name».md" (do not reprint the questions).
2. **Final verdict: ✅ Ready / ⚠️ Almost / ❌ Not ready** (with the checkbox list if ⚠️/❌).
3. CV bullet (two options) — **omit if ❌**.
4. GitHub description (one option) — **omit if ❌**.
5. If ✅/⚠️: "Edit `notes/cv/cv-bullets.md` to keep only your chosen bullet before committing."

**If `{DRY_RUN}` = false:** commit atomically. If ✅/⚠️ (cv-bullets was written):
`git add notes/interview-prep/projects/«name».md notes/cv/cv-bullets.md`, then
`git commit -m "docs: portfolio-audit «name» — <one-line summary + verdict>"`.
If ❌ (no cv-bullets): `git add notes/interview-prep/projects/«name».md`, then the same commit message.

**If `{DRY_RUN}` = true:** commit nothing. Leave everything staged and print the commit sequence above,
one command per code block, for Victor to run after reading the diff.

## Hard rules

- **Auto-commit is authorized for this flow only, and only when `DRY_RUN = false`.** Victor's global
  rule is "never auto-commit"; he lifted it for the audit orchestrators. It applies nowhere else.
- **Questions are saved regardless of the verdict** — a ❌ still commits the question file.
- **One atomic commit per project.** In `all` mode, one commit per project, never batched.
- **Author then reviewer, sequentially.** Never overlap the two subagents — the reviewer must see a
  finished bank, and parallel commits race the git index. Never skip the reviewer pass.
````
