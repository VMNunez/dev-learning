# Project plan audit — the single entry point for planning a project

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

Run this **inside the supported agent runtime**. It is the only project-plan prompt Victor launches. It builds or
audits a project's `PLANNING.md` to the full standard, hands-off, in two shapes:

- `MODE = new` — plan the next project: gap-analyse PROGRESS vs coverage, pick the best next project,
  write a complete PLANNING.md, then have an independent reviewer audit and fix it before it commits.
- `MODE = review` — audit an existing PLANNING.md against the standard, fix what falls short, and
  commit (one project, or `PROJECT = all` for every project in turn).

Both shapes use the same quality pipeline: the plan is **authored whole (new mode only), then audited
and fixed by seven cold specialist reviewers — six owning one concern each** (architecture · data-model-api ·
ui-design · rules-security · steps-tests · branches-coverage) **plus a final `whole-plan` coherence pass** — before the orchestrator commits it. New mode adds
an **architecture advisor** between the author and the specialists (Phase 1b). Authoring stays
whole because a plan's sections cross-reference; review is split so each specialist owns a small slice
it cannot skim, catching what the author trusted. No report to apply by hand, no per-file launching —
one command does everything.

> **▶ Run first (new mode only):** `progress-update` — the gap analysis reads `PROGRESS.md`; if it is
> stale it picks the wrong next project. (`review` mode has no prerequisite.)

> **Run-start check (step 0):** before anything else, run the check in `notes/prompts/_internal/_pipeline-self-report.md` — read this prompt's own `_last-run-report` and, if its `Status` is `open`, surface that finding in one line before proceeding.

**Internal pieces this orchestrates** (you never launch these directly):
`_planning-standard.md` (the bar) · `_plan-write-prompt.md` (author) ·
`_plan-architecture-prompt.md` (architecture advisor, new mode only) · `_plan-review-prompt.md` (reviewer).

> **This flow always commits its own work** (Victor retired the `DRY_RUN` switch 2026-07-16 — the
> pipeline is trusted to land its result). The safety valve is no longer a dry run but the gates
> below: the specialist acceptance check and, in review mode, the history-preservation gate — if
> either fails after its one re-dispatch, the orchestrator **aborts without committing** and reports,
> leaving the working tree for Victor to inspect. It never commits a run that failed its own checks.

---

## How to use — recipes

Open a fresh chat **inside the supported agent runtime**, paste the whole prompt below (config block + instructions),
fill only the config block, and let it run to the end. Pick the recipe:

**A · Plan the next project** (a project just finished; plan the next one)
```
MODE    = new
PROJECT =            ← leave blank; new mode auto-detects from PROGRESS.md
```

**B · Audit one existing plan** (also the recipe for **restructuring a pre-standard plan** — e.g. a
plan written before the 24-section standard existed; completed steps are preserved, see the
history-preservation gate)
```
MODE    = review
PROJECT = projects/07-timetrack
```

**C · Audit every plan in one run**
```
MODE    = review
PROJECT = all
```

**Rules of thumb:**
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

## PROJECT = all (review mode only) audits every project in turn — see notes/prompts/_internal/_batch-mode.md.
## Order: projects/01-todo-list, 02-weather-app, 03-expense-tracker, 04-meal-finder,
## 05-task-manager, 06-hr-portal, 07-timetrack. The format is derived per project type by number
## (01–06 Angular-only → present-sections + universal checks only; 07+ full-stack → full 24-section audit).

Use MODE and PROJECT wherever the prompt refers to {MODE} or {PROJECT}.

---

You are the orchestrator for building Victor's project plans, hands-off.

> **Branch guard (step 0):** run `git branch --show-current`. Study/tracking materials commit on
> whatever branch is currently active (the shared session rules) — a feature branch is the normal case; name it in
> the final report. If you are on **`main`**, stop and ask Victor which branch to use — `main` never
> receives direct commits, only merges via PR.

 Do **not** read
`_planning-standard.md`, the plan itself, or any project file — the subagents read those (each only the
slice its task needs); loading them here bloats the orchestrator's context for no benefit. Follow the
branch for `{MODE}`. You stay light: you dispatch subagents, wait, and collect — you never write or
audit the plan in your own context.

## If MODE = new

### Phase 1 — Author (one writing subagent)

Launch one `role-appropriate` subagent, `reasoning tier: deep`, `execution: foreground`:

> Read `notes/prompts/projects/plan/_internal/_plan-write-prompt.md` and execute it in full
> (`PROJECT = {PROJECT}` — blank means auto-detect). Do the gap analysis, choose the next project,
> design it, write the complete `PLANNING.md` to the contract in `_planning-standard.md`, and make the
> ROADMAP.md + PROGRESS.md edits. **Do NOT commit** — an independent reviewer runs next and owns the
> commit. Leave all three files in the working tree. Report the project chosen, the files touched, and
> the one-line commit message you'd use.

Wait for it. If it reports it could not choose or write a plan (blocked, missing context), stop and
report — do not run the architecture advisor or reviewer on nothing.

### Phase 1b — Architecture advisor (one architecture subagent)

Launch a `role-appropriate` subagent, `reasoning tier: deep`, `execution: foreground`, on the plan the author just wrote:

> Read `notes/prompts/projects/plan/_internal/_plan-architecture-prompt.md` and execute it in full for
> `PROJECT = «the chosen project folder path»`. Judge the drafted architecture (§6), the one new
> architectural concept (§3), and the tradeoffs (§20) against Victor's current level and the coverage
> gaps — fix over-engineering, under-engineering, and a misjudged new concept directly in those
> sections. **Do NOT commit.** Report your architecture verdict, the one new concept, what you changed,
> and any ripple the reviewer must reconcile.

Wait for it. It only sharpens architecture; if it reports the architecture is already sound and changes
nothing, that is fine — continue to the reviewer.

### Phase 2 — Review (specialist reviewers, one concern each)

Do **not** hand one subagent the whole 24-section plan to audit **against the standard** — it would skim
the last sections. (The final `whole-plan` specialist does read the whole file, but it runs twelve
enumerated coherence checks, not the standard's conformance checks. Different read, different risk.) Run
the **specialist reviewers** defined in "Specialist review procedure" below over the just-authored plan.
They fix directly and do not commit. Then go to "Finishing" (the orchestrator commits the plan + the
ROADMAP.md / PROGRESS.md edits left in the working tree).

## If MODE = review

### PROJECT = all
Per `notes/prompts/_internal/_batch-mode.md`, expand `all` into the ordered project list from the config block's
Batch note and run the **single-project review below once per project**, fully finishing one (all seven
specialists + the orchestrator commit) before starting the next — never overlap, since the orchestrator
commits per project and parallel commits race the git index. Put each project's report under a
`### [project]` heading, and after the last one
print the `_batch-mode.md` summary table (`Project | Result | Sections fixed`). **Condense as you go:**
once a project is committed, its six specialist traces are spent — carry forward only one line per
project (`project · verdict · n fixes · commit hash`) and drop the traces from your working notes, or
seven projects of traces will crowd out the later ones. If the run gets too
long, finish the current project completely and stop with the "Completed / Remaining" line — a re-run
resumes from the first unfinished project.

### Single project
No author phase — the plan already exists. Review mode may **fully restructure a pre-standard plan**
(one written before the 24-section standard — the specialists add missing sections, reformat old ones)
— but restructuring changes *format*, never *history*. That is enforced by the gate below.

**History snapshot (before dispatching any specialist).** Without reading the plan (stay light — a
grep is a count, not a read), snapshot the done-work markers:
`grep -n "✅" {PROJECT}/PLANNING.md` (the done-step headings) and keep the matched lines. If the plan
records done steps some other way (a §0 "Steps 1–N done" line, a branch table with closed branches),
grep those too. This is the baseline the finished plan must still contain.

**History-preservation gate (after the last specialist, before Finishing).** Re-run the same greps.
Every done step from the snapshot must still exist and still be marked done — renumbered or reworded
is fine, **unmarked or missing is a failure**. The in-progress step must be the same real-world
position it was. On failure: re-dispatch `steps-tests` once, quoting the lost steps verbatim; if the
re-run still fails the gate, **abort without committing** and report exactly which history was lost —
never commit a plan that lost completed work.

Then run the **specialist reviewers** defined in "Specialist review procedure" below over
`{PROJECT}/PLANNING.md`, apply the gate, and go to "Finishing" (the orchestrator commits just the plan).

---

## Specialist review procedure (used by both modes)

The plan is reviewed by **seven specialists — six owning one concrete concern, plus a final whole-plan
coherence pass** — so each cold subagent
audits a small, defined slice it cannot leave half-done. Dispatch them **sequentially**, in this order
(they all edit the same `PLANNING.md`, so never overlap; none commits):

1. `architecture` · 2. `data-model-api` · 3. `ui-design` · 4. `rules-security` · 5. `steps-tests` ·
6. `branches-coverage` · 7. `whole-plan`

`ui-design` runs **after** `data-model-api` because it audits §14 against §13's page list, which that
concern may still be fixing. It is its own concern rather than §14 riding at the tail of
`data-model-api` for the same reason this phase is split at all: a slice that ends in a long section
gets skimmed there.

For an **Angular project (01–06)**, skip concerns whose sections the plan does not have (e.g. no
backend API/security) — the reviewer prompt derives the format, but do not dispatch a concern with
nothing to audit. `ui-design` is the one concern that **always** runs, on both formats: an Angular-only
plan has no numbered §14, so it audits whatever design/palette part that plan has. For a **full-stack
project (07+)**, run all seven.

For **each** concern in order, launch a fresh, independent `role-appropriate` subagent,
`reasoning tier: deep`, `execution: foreground`:

> Read `notes/prompts/projects/plan/_internal/_plan-review-prompt.md` and execute it for `PROJECT = {PROJECT}`,
> `SCOPE = «this concern»`, `DRY_RUN = true` (that is plan-review's own no-commit switch — the
> orchestrator owns the single commit; it is unrelated to this orchestrator's retired config). Read
> **only the files and standard sections your
> concern's row lists in that prompt's reading map** — never the whole standard. Audit **only your
> concern's** sections/invariants/checks (the `{SCOPE}` table in that prompt), fix what falls short
> directly in the file, and **do NOT commit** — the orchestrator commits once after every concern.
> Return your verdict and the **check-by-check trace of your slice** in that prompt's compact report
> format (one line per check — never paste plan content), plus any cross-concern ripple to reconcile.

**After the six concerns, dispatch one last specialist, `SCOPE = whole-plan`.** It runs last because it
reads the file the other six have finished fixing, and it is the only reviewer that reads `PLANNING.md`
end to end in one context. It audits **coherence, not conformance** — the six already checked every
section they own against the standard, and re-running those checks is not its job. Its slice is twelve
checks:

- **The ten sections no concern owns — §1, §2, §4, §5, §9, §11, §17, §18, §19, §21 — one check each.**
  These are the exception to "coherence, not conformance": they have no other owner, so for these ten it
  checks content against the standard's pass line as well as against the rest of the plan.
  `branches-coverage` only checks that they exist.
- **Cross-section contradictions** — a rule stated in one section and broken by prose in another, where
  the second section's owner has no reason to read the first.
- **`PROJECT-BACKLOG.md` against the plan** — the task list Victor actually executes is read by no other
  specialist, so a decision recorded in §8 can ship while the backlog still states the version it
  superseded.

It fixes what it finds directly and emits no ripples (there is no later specialist to route them to). It
does not commit. Its trace is **twelve rows, always** — one per orphan section (✅ or the fix made), one
for contradictions, one for the backlog — so the acceptance check below applies to it unchanged; a short
trace is a skim, and "nothing found" is a ✅ in a row, never a missing row. It runs on **both formats**: on
an Angular plan (01–06) it audits whichever of the ten sections that plan has, and skips the backlog check
if the project has no `PROJECT-BACKLOG.md`.

Wait for each specialist before dispatching the next. Collect their traces and any ripples; if a ripple
lands in a concern already reviewed, re-dispatch that one specialist to reconcile it — **at most one
re-dispatch per concern per run**. If the reconciliation pass leaves new ripples, record them in the
pipeline self-report instead of iterating further — except a ripple that is a **verified factual error**
and not a design disagreement (a wrong component, file, or cross-reference name, checked against the
code): the orchestrator corrects it in the plan itself — **every occurrence, not just the line the
specialist named** — before committing, rather than ship a line it knows is wrong, and names the
correction in the self-report.

**Specialist acceptance check:** a specialist's report is acceptable only if it opens with the plan's
line count + read-to-EOF confirmation (the reviewer prompt's truncation guard) **and** its trace has
**one row per check its slice owns**. If either is missing or the report is unusable, re-dispatch that
specialist once, quoting what was missing; if it fails again, note the gap in the self-report and
continue — never silently accept a partial trace or a possibly truncated read.

## Finishing

The specialist reviewers left every fix in the working tree; **the orchestrator does the single commit**
(they never commit). One atomic commit per plan. **Gate first:** if the specialist acceptance check or
(review mode) the history-preservation gate ended the run in a failed state, do NOT commit — leave the
working tree as-is and report what failed and why.

Otherwise commit now — with the safety check first: run `git status` before the add and again before
the commit, confirm only the intended files are staged (`git restore --staged` anything else — a
project code file left staged from an earlier step must never ride along):
- **`new` mode** (the author left ROADMAP.md + PROGRESS.md in the working tree with the plan): `git add
  {PROJECT}/PLANNING.md ROADMAP.md PROGRESS.md`, then
  `git commit -m "docs: add PLANNING.md for project 0X [name] — closes [main gap], introduces [key concept] (reviewed)"`.
- **`review` mode** (only the plan changed): `git add {PROJECT}/PLANNING.md`, then
  `git commit -m "docs: improve PLANNING.md for {PROJECT} — <one-line summary of main fixes>"`.
Report the commit made and each specialist's verdict/trace.

## Hard rules

- **Model tier: every subagent in this flow launches with the top model available** (pass
  `reasoning tier: deep` — or the session's higher tier if one exists — on each Agent call; never haiku, and
  never silently inherit a cheap session model). This is deliberate, not an oversight to optimize:
  the author designs what Victor will learn for a month, the advisor and specialists rewrite plan
  prose — quality here is guaranteed by judgment, not by structure, so it is the wrong place to save
  tokens (contrast `progress-update`, whose mechanical subagents are tiered down explicitly). Revisit
  only with a real run's self-report as evidence, and per-scope, not wholesale.

- **Auto-commit is authorized for this flow — always** (Victor retired the `DRY_RUN` condition
  2026-07-16). His global rule is "never auto-commit"; he lifted it for the audit orchestrators, and
  the authorship boundary in the shared session rules holds: PLANNING.md / ROADMAP.md / PROGRESS.md are system
  machinery, never his code or `practice/` work. **The orchestrator commits once** (the specialist
  reviewers never do) — unless a gate failed, in which case it aborts without committing. It applies
  nowhere else — normal sessions still hand Victor the command.
- **One atomic commit per plan.** In new mode that single commit carries PLANNING.md + ROADMAP.md +
  PROGRESS.md (they are one logical change: registering the new project). Never `git add .`.
- **The plan is authored whole, reviewed by specialists — one concern per subagent.** Authoring needs
  the whole plan in one context (the sections cross-reference); review does not, so it is split into
  six cold specialists (architecture · data-model-api · ui-design · rules-security · steps-tests ·
  branches-coverage), each owning a small slice it cannot skim and returning a check-by-check trace,
  **and closed by a seventh `whole-plan` pass that owns only what a slice structurally cannot see: the
  ten unowned sections, cross-section contradictions, and `PROJECT-BACKLOG.md`.**
- **Strict sequence, never overlapping.** new mode: author → architecture advisor → the six
  specialists (in order) → `whole-plan` → orchestrator commit; review mode: the six specialists →
  `whole-plan` → orchestrator commit.
  Each must see the previous one's finished work, and they all edit the same file. (The architecture
  advisor is new-mode only, on the author side; the `architecture` specialist reviewer independently
  re-checks §6/§3/§20 in both modes.)
- Never skip the specialist review passes.

### Final step — pipeline self-report

After everything above is done, read `notes/prompts/_internal/_pipeline-self-report.md` and execute it for this
run — write the report file in this orchestrator's folder, commit it on its own, and print the five
bullets in chat.

````
