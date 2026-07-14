# Review audit — the single entry point for reviewing a project

Run this **inside Claude Code**. It is the only review-audit prompt Victor launches. It reviews a
**built** project against the contract its own `PLANNING.md` set — code quality, correctness, security,
and tests — and writes a prioritized list of improvement tasks to `{PROJECT_PATH}/PROJECT-BACKLOG.md`.
That backlog is what `portfolio-audit` reads for its go/no-go verdict, so a security hole found here
becomes a **High** task that blocks portfolio-ready.

The review is split into **vertical slices**, so no subagent ever reviews the whole codebase — each one
owns a small, closed surface it cannot leave half-checked:

- **Per backend resource** (auth, time-entries, users, …): a **flow** reviewer traces the full
  `model → repository → service → controller → DTO → tests` flow (quality + correctness + tests), and a
  **security** reviewer hunts that same flow for vulnerabilities.
- **Backend cross-cutting**: a `persistence-config` flow reviewer and a `security-infra` security
  reviewer.
- **Per frontend feature** + `frontend-infra`: a flow reviewer each.
- **One learning-objectives** pass over the whole project.

The orchestrator merges every slice's findings into the backlog. **No subagent edits the code — Victor
fixes everything himself to learn.**

> **▶ Run first:** nothing — it reads `PLANNING.md` and the source, not the README. (`readme-audit`
> is a prerequisite of `portfolio-audit`, which reads the READMEs — not of this review.)

**Internal pieces this orchestrates** (you never launch these directly):
`_review-standard.md` (the bar — all the checklists) · `review-flow-prompt.md` (per-slice functional
reviewer: quality + correctness + tests) · `review-security-prompt.md` (per-slice attacker pass,
full-stack only).

> **Not auto-committed — by design.** This writes `PROJECT-BACKLOG.md` inside the project folder, which
> follows the project's **feature-branch → PR → main** workflow. The orchestrator writes the backlog to
> the working tree and **hands Victor the commit command** — it never commits for him. There is no
> `DRY_RUN`.

---

## How to use — recipes

Open a fresh chat **inside Claude Code**, paste the whole prompt below, fill only the config block, and
let it run. Pick the recipe:

**A · Review one project**
```
PROJECT_PATH = projects/07-timetrack
```

**B · Review every project in one run**
```
PROJECT_PATH = all
```

**C · Review only one tier** (split a big project across sessions)
```
PROJECT_PATH = projects/07-timetrack
REVIEW_SCOPE = backend
```

**Rules of thumb:**
- `REVIEW_SCOPE` defaults to `full`. Use `backend` / `frontend` when the whole-project run is too long —
  a partial run only touches its own tier's backlog tasks and only refreshes its own tier's
  "Last Reviewed" date, so the other tier still shows as stale (or `never`) until you review it.
- Fill in **only** the config block. Everything below it is machinery — never edit it.
- The project type is derived from the path — do not set it.
- Angular projects 01–06 are frontend-only: they get the frontend flow slices, the learning-objectives
  pass, their own `PROJECT-BACKLOG.md` and a commit — but no security pass (no backend to attack).
- **After the run:** commit the backlog with the command the orchestrator hands you, then in your next
  main session just say the review ran — Claude reads the auto-committed
  `projects/review/_last-run-report.md` (Step 6) and tells you whether these prompts need a change
  (they stay frozen unless that report shows a real failure).

---

````
## Configuration — edit only this block

PROJECT_PATH = [projects/06-hr-portal | projects/07-timetrack | all]
REVIEW_SCOPE = [full | backend | frontend]

## PROJECT_PATH = all runs the review on every project in turn — see notes/prompts/_batch-mode.md.
## Order: projects/01-todo-list, 02-weather-app, 03-expense-tracker, 04-meal-finder, 05-task-manager,
## 06-hr-portal, 07-timetrack. The project type is derived from the number (01–06 Angular-only, 07+ full-stack).
## The 30-day "Last Reviewed" gate applies per full-stack project — recently reviewed ones are skipped.
##
## REVIEW_SCOPE limits the review to one tier so a big project can be split across sessions instead of
## one long run. Default = full. `backend` runs only Steps 1–2; `frontend` runs only Step 3; both skip
## the whole-project learning-objectives pass (Step 4) and touch only their own tier's backlog tasks
## (see Step 5). Angular 01–06 are frontend-only regardless — `backend` on them is a no-op.

Use PROJECT_PATH wherever the prompt refers to {PROJECT_PATH}, and REVIEW_SCOPE wherever it refers to
{REVIEW_SCOPE} (default to `full` if left blank).

---

You are the orchestrator for reviewing Victor's projects. First read
`notes/prompts/projects/review/_review-standard.md` so you know the bar, the gate, the priority rules,
and the backlog format. Then run the procedure below. You stay light: the slice reviewers read the
source and hand you back findings tables — you map the slices and merge. You never read the full source
yourself.

## If PROJECT_PATH = all
Per `notes/prompts/_batch-mode.md`, expand `all` into the ordered project list from the config block and
run the **single-project procedure below once per project**, fully finishing one before the next. Put
each project's report under a `### [project]` heading, and after the last print this pipeline's own
summary table (`Project | Quality | High | Medium | Low` — a deliberate override of `_batch-mode.md`'s
generic `Target | Result | Files changed`). **Once a project's backlog is written, drop
its slice tables from your working state** — carry forward only its summary row; the detail lives in
its `PROJECT-BACKLOG.md`. This keeps a 7-project run from drowning your context in stale findings. Otherwise, follow the procedure once.

## Single-project procedure

### Step 0 — Gate and map the slices (orchestrator)
Derive the project type from the path. **Full-stack:** apply the standard's **per-tier 30-day gate**
against `{PROJECT_PATH}/PROJECT-BACKLOG.md` — read its `**Last Reviewed — backend:**` /
`**Last Reviewed — frontend:**` lines and gate **only the tiers {REVIEW_SCOPE} will review**. If every
tier in scope was reviewed < 30 days ago, stop and offer FORCE; if only some are fresh, continue with
the stale/`never` ones and say which you are skipping. A missing backlog = never reviewed → continue.
**Before you gate on the date, apply the standard's "the gate measures unreviewed code, not elapsed
time" rule** — if a tier has completed a step since its last review, it holds code no reviewer has seen,
and the 30-day window does not apply to it. Check the ✅ steps against the tier's date first; only gate
on the date when the tier has gained no step.
Then **map the review slices** — this is light structural work (you list slices, you do not review code).

**Apply {REVIEW_SCOPE} first — map only the tiers it names:**
- `backend` → map only the backend slices; skip the frontend map and Steps 3–4.
- `frontend` → map only the frontend slices; skip the backend map and Steps 1–2 and 4.
- `full` (default) → map both tiers and run every step.

Slices, per tier:
- **Backend resources** — from `{PROJECT_PATH}/PLANNING.md` §7 (entities) / §10 (API), or by listing the
  `backend/src/main/java/**/controller/*Controller.java` files. One slice per resource (e.g.
  `auth`, `users`, `projects`, `time-entries`).
- **Backend cross-cutting** — the two fixed slices `persistence-config` and `security-infra`.
- **Frontend features** — from the `pages/`/`features/` folders per PLANNING.md's structure. One slice
  per feature, plus the fixed `frontend-infra` slice (routes, config, guards, interceptors, auth).

Keep this slice map (slice → files/endpoints it owns) — Step 5 verifies each reviewer's trace against it.

**Then derive the unbuilt-step exclusion — and pass it into every dispatch.** From PLANNING.md §0 and the
✅ marks in the learning plan, list the steps **not yet built**, and name in one line what each one would
have produced (e.g. "Step 8 — Backend tests: `src/test/**` service tests" · "Step 11 — Docker:
`docker-compose.yml`, `Dockerfile`"). Append that list verbatim to **every** subagent prompt in Steps 1–4,
with the instruction: *"These steps are not built. Their absence is out of scope — where you would
otherwise report something missing, write 'Step X — not yet built, out of scope' instead of a finding."*

This is the orchestrator's job, not the operator's. Without it, every reviewer independently reports the
same absent artefacts as findings: on the 2026-07-14 run, all 9 backend slices would have raised a High
"no tests" finding for a test suite that Step 8 has not written yet — 9 false Highs straight into the
backlog. The standard's scope limit already forbids this; Step 0 is where it becomes enforceable, because
Step 0 is the only place that knows which steps are done.

**Tests are part of that exclusion, and it is derived from the project number — not from the ✅ marks.**
Per CLAUDE.md ("Testing rules"), testing enters the roadmap at **project 07** (services: JUnit/Jasmine)
and **project 08** (components: TestBed). So:
- **Projects 01–06:** tests are **out of scope entirely**. Their `.spec.ts` files are untouched Angular
  CLI scaffold — empty `should create` assertions are the expected state, not a gap.
- **Project 07:** service tests are in scope; **component** tests are not.
- **Projects 08+:** both are in scope.

Append the applicable line verbatim to **every** subagent prompt in Steps 1–4, e.g. for 01–06:
*"This project predates the testing roadmap (tests start at project 07). Its `.spec.ts` files are CLI
scaffold. Do not report missing tests, empty specs, or weak assertions as findings — write 'tests — out
of scope for this project' instead."*

This exclusion **cannot** be derived from the ✅ marks: projects 01–06 use the old PLANNING format, which
has no §0 and no ✅ step marks, so the step-based rule above silently fires on nothing. On the 2026-07-14
run of `01-todo-list` both frontend reviewers read the empty scaffold specs as missing coverage and raised
three High "no tests" tasks — which went into the backlog and Victor had to catch. Every project from 01
to 06 will reproduce those three false Highs unless this line is passed down.

**Angular 01–06** are **frontend-only**, not informational: map **frontend feature slices +
`frontend-infra`**, skip Steps 1–2 (there is no backend, so no backend flow and **no security pass**),
and run Steps 3, 4 and 5 in full — including writing `PROJECT-BACKLOG.md` and handing over the commit.
Gate them on the `frontend` line only; their backlog's backend line stays `n/a — Angular-only`, and
every task is tagged `[frontend]`. **Full-stack:** run every step.

> The slice reviewers only **read** — they never edit and never commit — so run them in parallel:
> dispatch each step's independent subagents **in a single message** (parallel tool calls), in batches
> of at most ~4 so no batch's combined reports flood your context at once. Collect every findings
> table; the reviewers are instructed to return bounded tables with no code excerpts — if one comes
> back with long code dumps or narrative, keep only its table + trace and discard the rest.

### Model policy — per slice, to protect the findings that matter while saving tokens
Pass an explicit `model` override on every dispatch, matched to how much deep reasoning the slice needs.
**Finding a correctness bug or a vulnerability is generative, adversarial reasoning → Opus; checking
structure/patterns against a fixed checklist is verification → Sonnet (~1/5 the cost).** The backend is
where a missed bug is costly and where a weak model skims past subtle flaws — so it never drops below
Opus. Frontend flow and the learning-objectives pass are largely structural verification and ride Sonnet.

| Role | `model:` | Why |
|------|----------|-----|
| **Orchestrator (this context / session)** | **Opus** | It maps the slices, dedups across them, and word-crafts each backlog task with its priority. Run the session on Opus. |
| **Step 1 — backend flow (per resource)** | **`opus`** | Correctness on the real path: N+1, transaction boundaries, §8 business rules — the subtle bugs a lighter model misses. |
| **Step 1 — backend security (per resource)** | **`opus`** | Adversarial hunt for authz/ownership/injection/exposure — the review's analog of coverage's Analyst C; never drop it. |
| **Step 2 — persistence-config flow** | **`opus`** | Datasource/transactions/fetch/N+1 — subtle backend correctness, same bar as Step 1 flow. |
| **Step 2 — security-infra** | **`opus`** | SecurityConfig, JWT filter, CORS, hashing, secrets — the highest-stakes attack surface. |
| Step 3 — frontend flow (per feature + frontend-infra) | `sonnet` | Component/service split, subscription cleanup, validation timing, tests — structural pattern-matching, lower stakes. |
| Step 4 — learning-objectives | `sonnet` | Locate each concept and mark ✅/⚠️/❌ against the rubric — verification, not generation. |

Never drop the backend flow or any security slice below Opus (those are the passes that catch the bugs
and holes that block portfolio-ready), and never drop the orchestrator below Opus (it writes the
backlog). If Victor asks for maximum saving, the two Sonnet slices are already the cheapest safe setting —
do not push backend or security down to save tokens. **Step 5 re-dispatches use the same model the
original slice used.**

### Step 1 — Backend, one flow + one security reviewer per resource
For **each** backend resource, dispatch two `general-purpose` subagents, `run_in_background: false`
(flow → `model: opus`, security → `model: opus`):

> **(flow)** Read `notes/prompts/projects/review/review-flow-prompt.md` and execute it for
> `PROJECT_PATH = {PROJECT_PATH}`, `TIER = backend`, `SCOPE = «resource»`. Trace the resource's full
> `model → repository → service → controller → DTO → tests` flow and return its findings table + trace.
> **Do not edit any file, do not write the backlog, do not commit.**

> **(security)** Read `notes/prompts/projects/review/review-security-prompt.md` and execute it for
> `PROJECT_PATH = {PROJECT_PATH}`, `SCOPE = «resource»`. Hunt each of that resource's endpoints for
> authorization/ownership/injection/data-exposure flaws and return its findings table + trace. **Do not
> edit any file, do not commit.**

Collect every table.

### Step 2 — Backend, cross-cutting reviewers
Dispatch (both `model: opus`):
> **(flow)** `review-flow-prompt.md` with `TIER = backend`, `SCOPE = persistence-config` — datasource,
> `application.properties`, transactions, fetch/N+1, docker env.
> **(security)** `review-security-prompt.md` with `SCOPE = security-infra` — SecurityConfig, JWT filter,
> CORS, hashing, secrets/credentials, global exception handler.

Collect both tables.

### Step 3 — Frontend, one flow reviewer per feature (+ frontend-infra)
For **each** frontend feature, and once for `frontend-infra`, dispatch (`model: sonnet`):
> `review-flow-prompt.md` with `TIER = frontend`, `SCOPE = «feature»` (or `frontend-infra`) — component/
> service split, types, state, subscription cleanup, validation timing, and that slice's tests.

Collect every table. (For Angular 01–06 these are the only flow slices — then go on to Steps 4 and 5.)

### Step 4 — Learning-objectives pass (one subagent)
**Skip this step entirely if {REVIEW_SCOPE} is `backend` or `frontend`** — it judges whole-project
concept coverage and only makes sense on a `full` run. Dispatch one `general-purpose` subagent,
`model: sonnet`, `run_in_background: false`:
> Read `notes/prompts/projects/review/_review-standard.md` ("Learning-objectives rubric" — that section
> only) and, from `{PROJECT_PATH}/PLANNING.md`, only §3 (new concepts) / §4 (review concepts). Then
> work **concept by concept, not file by file**: for each concept, locate where it should live with a
> targeted search (grep for its annotation/class/pattern — e.g. `@RestControllerAdvice`,
> `SecurityContextHolder`, `takeUntilDestroyed`) and read only the file(s) that hit, enough to judge
> whether the use is meaningful. Never read the codebase end to end. Mark each concept ✅ Demonstrated /
> ⚠️ Shallow / ❌ Missing with a one-line note (file:line for ✅/⚠️). Return only the table + the tally —
> no code excerpts. **Do not edit any file.**

### Step 5 — Merge into the backlog + hand over the commit (orchestrator)
You now hold a findings table per slice (flow + security), plus the learning-objectives verdict.

**First, verify coverage against your Step 0 map.** For each slice, compare the reviewer's trace with
the files that slice owns (the flow prompt's Step 1 table / the security prompt's endpoint list): every
owned file/endpoint must appear in the trace. A report whose trace misses part of its slice — or that
came back with no trace at all — does **not** count as reviewed: re-dispatch that one slice once; if it
fails again, list it as **"not reviewed"** in the chat summary and move on. Never treat a silent or
partial report as clean.

Then merge the verified tables into one prioritized task list per the standard's
task/priority/effort rules:
- Every confirmed **security** finding → a **High** task, carrying which endpoint/area it hits.
- Every **correctness** finding on a normal path → **High**; edge-path → Medium; latent → Low. Each task
  carries the trigger so Victor can reproduce it.
- Every **missing planned test** or **untested §8 business rule** → **High**; weak assertion / missing
  edge case → Medium; naming/structure → Low.
- **Deduplicate across slices** — the same business-rule gap can surface in a resource's flow, its
  security pass, and a cross-cutting slice at once; keep one task, the most specific (usually: enforce
  the rule in the service + add the test that proves it).
- Turn each quality finding and each ⚠️/❌ learning-objective into a specific task with a priority and an
  effort estimate.
- "Beyond junior scope" hardening ideas go in the chat summary, not the backlog.

First print a brief chat summary: **Overall quality** (Strong/Good/Needs work + one sentence) · **Top
findings** (2–3) · **Learning objectives** (how many ✅/⚠️/❌) · **Slices reviewed** (count).

Then update `{PROJECT_PATH}/PROJECT-BACKLOG.md` (create it if missing) per the standard's backlog
format: the **per-tier "Last Reviewed" lines**, the overall quality rating, and the full task list as
checkboxes, **each task tagged with its tier** (`[backend]` / `[frontend]`). Preserve tasks already
checked off (✅).

**Stamp today's date only on the tiers this run actually reviewed** — a `backend` run sets
`**Last Reviewed — backend:**` to today and leaves the `frontend` line exactly as it was (a date, or
`never`). That is what keeps a partial run from ever making an unreviewed tier look reviewed. If the
backlog still carries the old single `**Last Reviewed:**` line, rewrite the header into the two-line
per-tier form now (per the standard's migration note).

**On a partial {REVIEW_SCOPE} run, only touch the reviewed tier's tasks.** A `backend` run rewrites the
`[backend]`-tagged tasks and leaves every `[frontend]` task untouched (and vice versa) — never delete or
overwrite the tier you did not review this run. The learning-objectives table is likewise left as-is on
a partial run (it is only regenerated on a `full` run).

Finally, **hand Victor the commit** — do not run it (see the by-design note above). One command per
code block:

```
git add {PROJECT_PATH}/PROJECT-BACKLOG.md
```

```
git commit -m "docs: review {PROJECT_PATH} — <one line summary of main findings>"
```

### Step 6 — Pipeline self-report (orchestrator, last)
After the commit hand-over, write a short **Pipeline self-report** to
`notes/prompts/projects/review/_last-run-report.md` (overwrite; header: date + project) — meta-
observations about the run itself, not the code. This is the evidence a later session uses to decide
whether these prompts need changing, so be honest, including "nothing to report":
- **Slices mapped** — the Step 0 list, and whether any turned out wrong (missing resource, slice too
  big/small).
- **Report discipline** — which reviewers, if any, came back with code excerpts/narrative that had to
  be discarded.
- **Trace verification** — traces that failed the Step 5 check, re-dispatches made, any slice left
  "not reviewed", any false alarm.
- **Dedup** — how many cross-slice duplicates were merged, and whether matching them was hard
  (a sign the business-rule-tag improvement is needed).
- **Anything else** that made the run harder than it should be.
- **Verdict** — one line: "pipeline clean" or "change worth considering: <what>" (the shared
  criterion from `_pipeline-self-report.md`).

Six bullets, one line each. This file is prompt-system machinery (not a project file), so **commit it
directly** under the notes/prompts exception — `git status` before add and before commit, stage only
`_last-run-report.md`, message `docs: pipeline self-report for review-audit run on {PROJECT_PATH}`
(the shared contract's format). (The
never-auto-commit rule below applies to `PROJECT-BACKLOG.md`, not to this file.) A later main session
reads this file to decide if the prompts need a change — they stay frozen unless it shows a real
failure. Also print the report in chat.

## Hard rules

- **Never auto-commit the backlog.** `PROJECT-BACKLOG.md` is a project-folder file under the
  feature-branch workflow; always hand Victor the command. (The `plan-audit` / `portfolio-audit`
  auto-commit exception does not extend to it.) The only file this flow commits itself is the Step 6
  `_last-run-report.md` — prompt-system machinery under the notes/prompts exception.
- **One slice per subagent — never the whole codebase.** Each reviewer owns one vertical slice (a
  resource's flow, a resource's security, a cross-cutting area, a frontend feature) and returns a trace
  proving it covered every file/endpoint in it. A subagent handed the whole backend skims the last
  resources — the failure this split exists to prevent. The orchestrator's only whole-project work is
  the light slice-mapping (Step 0) and the merge (Step 5).
- **Two lenses per backend resource** — one flow reviewer (quality + correctness + tests) and one
  security reviewer. They only read, so they may run in parallel; never let one subagent do both.
- **Never edit the code.** Every finding becomes a backlog task; Victor fixes the code himself to learn.
- **A partial `REVIEW_SCOPE` run stays in its lane.** `backend` / `frontend` review and rewrite only
  their own tier's slices and backlog tasks, skip the whole-project learning-objectives pass, and stamp
  today's date on **only their own tier's** "Last Reviewed" line. The untouched tier's tasks and date are
  preserved verbatim — a partial run must never make an unreviewed tier look reviewed.
- **Review state lives in `{PROJECT_PATH}/PROJECT-BACKLOG.md`, per tier — nowhere else.** No missing file
  = never reviewed; a tier line of `never` = that tier never reviewed. There is no root-level review
  index, by design: a second copy of the date would drift out of sync with the backlog.
- **Security findings are always High**, and findings are deduplicated across every slice.
- **Model per slice, always explicit** (see Model policy): backend flow + every security slice + the
  orchestrator run on **Opus**; frontend flow and learning-objectives on **Sonnet**. Never drop backend
  or security below Opus to save tokens — those are the passes that catch what blocks portfolio-ready.
- **No trace, no review.** A slice counts as reviewed only when its trace covers every file/endpoint
  the slice owns (verified in Step 5 against the Step 0 map). Failed or partial reports get one
  re-dispatch, then an explicit "not reviewed" in the summary — never a silent pass.
- **Bounded reports only.** Every subagent returns its findings table + trace and nothing else — no
  code excerpts, no narrative. If one overflows, keep its table + trace and discard the rest; never let
  a verbose reviewer crowd the merge.
- Angular 01–06 are frontend-only — frontend flow reviewers + learning-objectives, then a
  `[frontend]`-tagged backlog and the commit hand-over, exactly like the frontend tier of a full-stack
  project. Never a security pass for them (no backend).

````
