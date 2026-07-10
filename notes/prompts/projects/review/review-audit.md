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

**Rules of thumb:**
- Fill in **only** the config block. Everything below it is machinery — never edit it.
- The project type is derived from the path — do not set it.
- Angular projects 01–06 are informational only (no backlog, no security pass, no commit).
- **After the run:** commit the backlog with the command the orchestrator hands you, then in your next
  main session just say the review ran — Claude reads the auto-committed
  `projects/review/_last-run-report.md` (Step 6) and tells you whether these prompts need a change
  (they stay frozen unless that report shows a real failure).

---

````
## Configuration — edit only this block

PROJECT_PATH = [projects/06-hr-portal | projects/07-timetrack | all]

## PROJECT_PATH = all runs the review on every project in turn — see notes/prompts/_batch-mode.md.
## Order: projects/01-todo-list, 02-weather-app, 03-expense-tracker, 04-meal-finder, 05-task-manager,
## 06-hr-portal, 07-timetrack. The project type is derived from the number (01–06 Angular-only, 07+ full-stack).
## The 30-day "Last Reviewed" gate applies per full-stack project — recently reviewed ones are skipped.

Use PROJECT_PATH wherever the prompt refers to {PROJECT_PATH}.

---

You are the orchestrator for reviewing Victor's projects. First read
`notes/prompts/projects/review/_review-standard.md` so you know the bar, the gate, the priority rules,
and the backlog format. Then run the procedure below. You stay light: the slice reviewers read the
source and hand you back findings tables — you map the slices and merge. You never read the full source
yourself.

## If PROJECT_PATH = all
Per `notes/prompts/_batch-mode.md`, expand `all` into the ordered project list from the config block and
run the **single-project procedure below once per project**, fully finishing one before the next. Put
each project's report under a `### [project]` heading, and after the last print the `_batch-mode.md`
summary table (`Project | Quality | High | Medium | Low`). **Once a project's backlog is written, drop
its slice tables from your working state** — carry forward only its summary row; the detail lives in
its `PROJECT-BACKLOG.md`. This keeps a 7-project run from drowning your context in stale findings. Otherwise, follow the procedure once.

## Single-project procedure

### Step 0 — Gate and map the slices (orchestrator)
Derive the project type from the path. **Full-stack:** apply the 30-day gate from the standard against
`{PROJECT_PATH}/PROJECT-BACKLOG.md`; if it was reviewed < 30 days ago, stop and offer FORCE. Then
**map the review slices** — this is light structural work (you list slices, you do not review code):
- **Backend resources** — from `{PROJECT_PATH}/PLANNING.md` §7 (entities) / §10 (API), or by listing the
  `backend/src/main/java/**/controller/*Controller.java` files. One slice per resource (e.g.
  `auth`, `users`, `projects`, `time-entries`).
- **Backend cross-cutting** — the two fixed slices `persistence-config` and `security-infra`.
- **Frontend features** — from the `pages/`/`features/` folders per PLANNING.md's structure. One slice
  per feature, plus the fixed `frontend-infra` slice (routes, config, guards, interceptors, auth).

Keep this slice map (slice → files/endpoints it owns) — Step 5 verifies each reviewer's trace against it.

**Angular 01–06** are informational only: map **frontend feature slices + `frontend-infra`** and run
just the flow reviewers (Steps 3–4) — report their findings in chat, write no backlog, no security pass,
no commit. Skip Steps 1, 2, and 5's backlog/commit. **Full-stack:** run every step.

> The slice reviewers only **read** — they never edit and never commit — so run them in parallel:
> dispatch each step's independent subagents **in a single message** (parallel tool calls), in batches
> of at most ~4 so no batch's combined reports flood your context at once. Collect every findings
> table; the reviewers are instructed to return bounded tables with no code excerpts — if one comes
> back with long code dumps or narrative, keep only its table + trace and discard the rest.

### Step 1 — Backend, one flow + one security reviewer per resource
For **each** backend resource, dispatch two `general-purpose` subagents, `run_in_background: false`:

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
Dispatch:
> **(flow)** `review-flow-prompt.md` with `TIER = backend`, `SCOPE = persistence-config` — datasource,
> `application.properties`, transactions, fetch/N+1, docker env.
> **(security)** `review-security-prompt.md` with `SCOPE = security-infra` — SecurityConfig, JWT filter,
> CORS, hashing, secrets/credentials, global exception handler.

Collect both tables.

### Step 3 — Frontend, one flow reviewer per feature (+ frontend-infra)
For **each** frontend feature, and once for `frontend-infra`, dispatch:
> `review-flow-prompt.md` with `TIER = frontend`, `SCOPE = «feature»` (or `frontend-infra`) — component/
> service split, types, state, subscription cleanup, validation timing, and that slice's tests.

Collect every table. (For Angular 01–06 this is the whole review — report in chat and stop.)

### Step 4 — Learning-objectives pass (one subagent)
Dispatch one `general-purpose` subagent, `run_in_background: false`:
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
format: today's date as "Last Reviewed", the overall quality rating, and the full task list as
checkboxes. Preserve tasks already checked off (✅).

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

Five bullets, one line each. This file is prompt-system machinery (not a project file), so **commit it
directly** under the notes/prompts exception — `git status` before add and before commit, stage only
`_last-run-report.md`, message `docs: pipeline self-report for review of {PROJECT_PATH}`. (The
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
- **Security findings are always High**, and findings are deduplicated across every slice.
- **No trace, no review.** A slice counts as reviewed only when its trace covers every file/endpoint
  the slice owns (verified in Step 5 against the Step 0 map). Failed or partial reports get one
  re-dispatch, then an explicit "not reviewed" in the summary — never a silent pass.
- **Bounded reports only.** Every subagent returns its findings table + trace and nothing else — no
  code excerpts, no narrative. If one overflows, keep its table + trace and discard the rest; never let
  a verbose reviewer crowd the merge.
- Angular 01–06 are informational only — frontend flow reviewers, report in chat, never a backlog or a
  commit for them.

````
