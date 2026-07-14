# Project plan audit — the single entry point for planning a project

Run this **inside Claude Code**. It is the only project-plan prompt Victor launches. It builds or
audits a project's `PLANNING.md` to the full standard, hands-off, in two shapes:

- `MODE = new` — plan the next project: gap-analyse PROGRESS vs coverage, pick the best next project,
  write a complete PLANNING.md, then have an independent reviewer audit and fix it before it commits.
- `MODE = review` — audit an existing PLANNING.md against the standard, fix what falls short, and
  commit (one project, or `PROJECT = all` for every project in turn).

Both shapes use the same quality pipeline: the plan is **authored whole (new mode only), then audited
and fixed by five cold specialist reviewers — one per concern** (architecture · data-model-api ·
rules-security · steps-tests · branches-coverage) — before the orchestrator commits it. New mode adds
an **architecture advisor** between the author and the specialists (Phase 1b). Authoring stays
whole because a plan's sections cross-reference; review is split so each specialist owns a small slice
it cannot skim, catching what the author trusted. No report to apply by hand, no per-file launching —
one command does everything.

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
PROJECT = [folder path, e.g. projects/07-timetrack | projects/06-hr-portal | all]

## PROJECT = all (review mode only) audits every project in turn — see notes/prompts/_batch-mode.md.
## Order: projects/01-todo-list, 02-weather-app, 03-expense-tracker, 04-meal-finder,
## 05-task-manager, 06-hr-portal, 07-timetrack. The format is derived per project type by number
## (01–06 Angular-only → present-sections + universal checks only; 07+ full-stack → full 23-section audit).

DRY_RUN = [false | true]

Use MODE, PROJECT, and DRY_RUN wherever the prompt refers to {MODE}, {PROJECT}, or {DRY_RUN}.

---

You are the orchestrator for building Victor's project plans, hands-off. Do **not** read
`_planning-standard.md`, the plan itself, or any project file — the subagents read those (each only the
slice its task needs); loading them here bloats the orchestrator's context for no benefit. Follow the
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

### Phase 2 — Review (specialist reviewers, one concern each)

Do **not** hand one subagent the whole 23-section plan to audit — it would skim the last sections. Run
the **specialist reviewers** defined in "Specialist review procedure" below over the just-authored plan.
They fix directly and do not commit. Then go to "Finishing" (the orchestrator commits the plan + the
ROADMAP.md / PROGRESS.md edits left in the working tree).

## If MODE = review

### PROJECT = all
Per `notes/prompts/_batch-mode.md`, expand `all` into the ordered project list from the config block's
Batch note and run the **single-project review below once per project**, fully finishing one (all five
specialists + the orchestrator commit) before starting the next — never overlap, since the orchestrator
commits per project and parallel commits race the git index. Put each project's report under a
`### [project]` heading, and after the last one
print the `_batch-mode.md` summary table (`Project | Result | Sections fixed`). **Condense as you go:**
once a project is committed, its five specialist traces are spent — carry forward only one line per
project (`project · verdict · n fixes · commit hash`) and drop the traces from your working notes, or
seven projects of traces will crowd out the later ones. If the run gets too
long, finish the current project completely and stop with the "Completed / Remaining" line — a re-run
resumes from the first unfinished project.

### Single project
No author phase — the plan already exists. Run the **specialist reviewers** defined in "Specialist
review procedure" below over `{PROJECT}/PLANNING.md`, then go to "Finishing" (the orchestrator commits
just the plan).

---

## Specialist review procedure (used by both modes)

The plan is reviewed by **five specialists, each owning one concrete concern** — so each cold subagent
audits a small, defined slice it cannot leave half-done. Dispatch them **sequentially**, in this order
(they all edit the same `PLANNING.md`, so never overlap; none commits):

1. `architecture` · 2. `data-model-api` · 3. `rules-security` · 4. `steps-tests` · 5. `branches-coverage`

For an **Angular project (01–06)**, skip concerns whose sections the plan does not have (e.g. no
backend API/security) — the reviewer prompt derives the format, but do not dispatch a concern with
nothing to audit. For a **full-stack project (07+)**, run all five.

For **each** concern in order, launch a fresh, independent `general-purpose` subagent,
`run_in_background: false`:

> Read `notes/prompts/projects/plan/plan-review-prompt.md` and execute it for `PROJECT = {PROJECT}`,
> `SCOPE = «this concern»`, `DRY_RUN = true`. Read **only the files and standard sections your
> concern's row lists in that prompt's reading map** — never the whole standard. Audit **only your
> concern's** sections/invariants/checks (the `{SCOPE}` table in that prompt), fix what falls short
> directly in the file, and **do NOT commit** — the orchestrator commits once after every concern.
> Return your verdict and the **check-by-check trace of your slice** in that prompt's compact report
> format (one line per check — never paste plan content), plus any cross-concern ripple to reconcile.

Wait for each specialist before dispatching the next. Collect their traces and any ripples; if a ripple
lands in a concern already reviewed, re-dispatch that one specialist to reconcile it — **at most one
re-dispatch per concern per run**. If the reconciliation pass leaves new ripples, record them in the
pipeline self-report instead of iterating further.

**Specialist acceptance check:** a specialist's report is acceptable only if its trace has **one row
per check its slice owns**. If rows are missing or the report is unusable, re-dispatch that specialist
once, quoting what was missing; if it fails again, note the gap in the self-report and continue — never
silently accept a partial trace.

## Finishing

The specialist reviewers left every fix in the working tree; **the orchestrator does the single commit**
(they never commit). One atomic commit per plan.

**If `{DRY_RUN}` = false:** commit now.
- **`new` mode** (the author left ROADMAP.md + PROGRESS.md in the working tree with the plan): `git add
  {PROJECT}/PLANNING.md ROADMAP.md PROGRESS.md`, then
  `git commit -m "docs: add PLANNING.md for project 0X [name] — closes [main gap], introduces [key concept] (reviewed)"`.
- **`review` mode** (only the plan changed): `git add {PROJECT}/PLANNING.md`, then
  `git commit -m "docs: improve PLANNING.md for {PROJECT} — <one-line summary of main fixes>"`.
Report the commit made and each specialist's verdict/trace.

**If `{DRY_RUN}` = true:** nothing is committed — all changes are left in the working tree for Victor
to read. Print the atomic commit sequence above to run after reviewing the diff, one command per code
block. In `new` mode that is the three-file commit; in `review` mode, one commit per plan.

## Hard rules

- **Auto-commit is authorized for this flow only, and only when `DRY_RUN = false`.** Victor's global
  rule is "never auto-commit"; he lifted it for the audit orchestrators. **The orchestrator commits
  once** (the specialist reviewers never do). It applies nowhere else — normal sessions still hand
  Victor the command.
- **One atomic commit per plan.** In new mode that single commit carries PLANNING.md + ROADMAP.md +
  PROGRESS.md (they are one logical change: registering the new project). Never `git add .`.
- **The plan is authored whole, reviewed by specialists — one concern per subagent.** Authoring needs
  the whole plan in one context (the sections cross-reference); review does not, so it is split into
  five cold specialists (architecture · data-model-api · rules-security · steps-tests ·
  branches-coverage), each owning a small slice it cannot skim and returning a check-by-check trace.
- **Strict sequence, never overlapping.** new mode: author → architecture advisor → the five
  specialists (in order) → orchestrator commit; review mode: the five specialists → orchestrator commit.
  Each must see the previous one's finished work, and they all edit the same file. (The architecture
  advisor is new-mode only, on the author side; the `architecture` specialist reviewer independently
  re-checks §6/§3/§20 in both modes.)
- Never skip the specialist review passes.

### Final step — pipeline self-report

After everything above is done, read `notes/prompts/_pipeline-self-report.md` and execute it for this
run — write the report file in this orchestrator's folder, commit it on its own, and print the five
bullets in chat.

````
