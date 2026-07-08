# Project plan audit — the single entry point for planning a project

Run this **inside Claude Code**. It is the only project-plan prompt Victor launches. It builds or
audits a project's `PLANNING.md` to the full standard, hands-off, in two shapes:

- `MODE = new` — plan the next project: gap-analyse PROGRESS vs coverage, pick the best next project,
  write a complete PLANNING.md, then have an independent reviewer audit and fix it before it commits.
- `MODE = review` — audit an existing PLANNING.md against the standard, fix what falls short, and
  commit (one project, or `PROJECT = all` for every project in turn).

Both shapes use the same quality pipeline: the plan is **authored (new mode only) then audited/fixed by
a cold reviewer subagent** before it is committed. The reviewer has no stake in the draft, so it reads
against the bar and catches what the author trusted. No report to apply by hand, no per-file launching
— one command does everything.

> **▶ Run first (new mode only):** `progress-update` — the gap analysis reads `PROGRESS.md`; if it is
> stale it picks the wrong next project. (`review` mode has no prerequisite.)

**Internal pieces this orchestrates** (you never launch these directly):
`_planning-standard.md` (the bar) · `plan-write-prompt.md` (author) ·
`plan-architecture-prompt.md` (architecture advisor, new mode only) · `plan-review-prompt.md` (reviewer).

> **First run, use `DRY_RUN = true`.** It writes and reviews everything but commits nothing, so you can
> read the diff before it lands. Once you trust it, `DRY_RUN = false` is fully hands-off.

---

## How to use — recipes

Open a fresh chat **inside Claude Code**, paste the whole prompt below (config block + instructions),
fill only the config block, and let it run to the end. Pick the recipe:

**A · Plan the next project** (a project just finished; plan the next one)
```
MODE    = new
PROJECT =            ← leave blank; new mode auto-detects from PROGRESS.md
DRY_RUN = true       ← true the first time; false once you trust it
```

**B · Audit one existing plan**
```
MODE    = review
PROJECT = projects/07-timetrack
DRY_RUN = false
```

**C · Audit every plan in one run**
```
MODE    = review
PROJECT = all
DRY_RUN = false
```

**Rules of thumb:**
- **First time → `DRY_RUN = true`.** It writes and reviews everything but commits nothing; you read the
  diff, then re-run with `DRY_RUN = false` (or paste the commits it printed).
- Fill in **only** the config block. Everything below it is machinery — never edit it.
- `PROJECT = all` is **review mode only** — `new` mode plans a single next project by design.

---

````
## Configuration — edit only this block

MODE    = [new | review]

## new mode:
PROJECT = [blank — auto-detects the next project from PROGRESS.md]

## review mode:
PROJECT = [folder path, e.g. projects/07-timetrack | angular/06-hr-portal | all]

## PROJECT = all (review mode only) audits every project in turn — see notes/prompts/_batch-mode.md.
## Order: angular/01-todo-list, 02-weather-app, 03-expense-tracker, 04-meal-finder,
## 05-task-manager, 06-hr-portal, projects/07-timetrack. The format is derived per project type
## (full-stack → full 23-section audit; angular → present-sections + universal checks only).

DRY_RUN = [false | true]

Use MODE, PROJECT, and DRY_RUN wherever the prompt refers to {MODE}, {PROJECT}, or {DRY_RUN}.

---

You are the orchestrator for building Victor's project plans, hands-off. First read
`notes/prompts/projects/plan/_planning-standard.md` so you know the bar you are enforcing. Then follow the
branch for `{MODE}`. You stay light: you dispatch subagents, wait, and collect — you never write or
audit the plan in your own context.

## If MODE = new

### Phase 1 — Author (one writing subagent)

Launch one `general-purpose` subagent, `run_in_background: false`:

> Read `notes/prompts/projects/plan/plan-write-prompt.md` and execute it in full
> (`PROJECT = {PROJECT}` — blank means auto-detect). Do the gap analysis, choose the next project,
> design it, write the complete `PLANNING.md` to the contract in `_planning-standard.md`, and make the
> ROADMAP.md + PROGRESS.md edits. **Do NOT commit** — an independent reviewer runs next and owns the
> commit. Leave all three files in the working tree. Report the project chosen, the files touched, and
> the one-line commit message you'd use.

Wait for it. If it reports it could not choose or write a plan (blocked, missing context), stop and
report — do not run the architecture advisor or reviewer on nothing.

### Phase 1b — Architecture advisor (one architecture subagent)

Launch a `general-purpose` subagent, `run_in_background: false`, on the plan the author just wrote:

> Read `notes/prompts/projects/plan/plan-architecture-prompt.md` and execute it in full for
> `PROJECT = «the chosen project folder path»`. Judge the drafted architecture (§6), the one new
> architectural concept (§3), and the tradeoffs (§20) against Victor's current level and the coverage
> gaps — fix over-engineering, under-engineering, and a misjudged new concept directly in those
> sections. **Do NOT commit.** Report your architecture verdict, the one new concept, what you changed,
> and any ripple the reviewer must reconcile.

Wait for it. It only sharpens architecture; if it reports the architecture is already sound and changes
nothing, that is fine — continue to the reviewer.

### Phase 2 — Review (one reviewer subagent)

Launch a second, independent `general-purpose` subagent, `run_in_background: false`:

> Read `notes/prompts/projects/plan/plan-review-prompt.md` and execute it in full for the plan the
> author just wrote: `PROJECT = «the chosen project folder path»` · `DRY_RUN = {DRY_RUN}`. This is
> **new mode**: audit the just-authored plan hard against the standard, fix what falls short directly
> in the file, and finish as that prompt says for new mode — false: commit the plan + the staged
> ROADMAP.md and PROGRESS.md atomically; true: fix only, commit nothing. Report your verdict, files
> touched, and the commit hash if you committed.

Wait for it, then go to "Finishing".

## If MODE = review

### PROJECT = all
Per `notes/prompts/_batch-mode.md`, expand `all` into the ordered project list from the config block's
Batch note and run the **single-project review below once per project**, fully finishing one (including
its commit) before starting the next — never overlap, since their subagents commit and parallel commits
race the git index. Put each project's report under a `### [project]` heading, and after the last one
print the `_batch-mode.md` summary table (`Project | Result | Sections fixed`). If the run gets too
long, finish the current project completely and stop with the "Completed / Remaining" line — a re-run
resumes from the first unfinished project.

### Single project
No author phase — the plan already exists. Launch one `general-purpose` reviewer subagent,
`run_in_background: false`:

> Read `notes/prompts/projects/plan/plan-review-prompt.md` and execute it in full:
> `PROJECT = {PROJECT}` · `DRY_RUN = {DRY_RUN}`. This is **review mode**: audit the existing
> `{PROJECT}/PLANNING.md` against the standard, fix what falls short directly, and finish as that
> prompt says for review mode (false: commit just the plan; true: fix only). Report your verdict, the
> audit summary (critical / quality / consistency counts), files touched, and the commit hash if you
> committed.

Wait for it, then go to "Finishing".

## Finishing

**If `{DRY_RUN}` = false:** everything is committed, one atomic commit per plan. Report the commit(s)
made and each reviewer's verdict.

**If `{DRY_RUN}` = true:** nothing was committed — all changes are staged in the working tree for
Victor to read. Print the atomic commit sequence to run after reviewing the diff, one command per code
block. In `new` mode that is the three-file commit; in `review` mode, one commit per plan.

## Hard rules

- **Auto-commit is authorized for this flow only, and only when `DRY_RUN = false`.** Victor's global
  rule is "never auto-commit"; he lifted it for the audit orchestrators. The reviewer subagent commits.
  It applies nowhere else — normal sessions still hand Victor the command.
- **One atomic commit per plan.** In new mode that single commit carries PLANNING.md + ROADMAP.md +
  PROGRESS.md (they are one logical change: registering the new project). Never `git add .`.
- **Author → architecture advisor → reviewer in new mode; reviewer only in review mode.** Run them
  strictly in sequence, never overlapping — each must see the previous one's finished work, and parallel
  commits race the git index. (The architecture advisor is new-mode only; a `review`-mode plan already
  exists and the general reviewer's design-correctness checks cover it.)
- Never skip the reviewer pass.
````
