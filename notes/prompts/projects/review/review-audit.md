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

---

````
## Configuration — edit only this block

PROJECT_PATH = [angular/06-hr-portal | projects/07-timetrack | all]

## PROJECT_PATH = all runs the review on every project in turn — see notes/prompts/_batch-mode.md.
## Order: angular/01-todo-list, 02-weather-app, 03-expense-tracker, 04-meal-finder, 05-task-manager,
## 06-hr-portal, projects/07-timetrack. The project type is derived per path (angular/ vs projects/).
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
summary table (`Project | Quality | High | Medium | Low`). Otherwise, follow the procedure once.

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

**Angular 01–06** are informational only: map **frontend feature slices + `frontend-infra`** and run
just the flow reviewers (Steps 3–4) — report their findings in chat, write no backlog, no security pass,
no commit. Skip Steps 1, 2, and 5's backlog/commit. **Full-stack:** run every step.

> The slice reviewers only **read** — they never edit and never commit — so you may run several in
> parallel (there is no git-index contention). Keep it manageable; collect every findings table.

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
> Read `notes/prompts/projects/review/_review-standard.md` ("Learning-objectives rubric") and
> `{PROJECT_PATH}/PLANNING.md` §3 (new concepts) / §4 (review concepts). For each concept, check the
> code and mark ✅ Demonstrated / ⚠️ Shallow / ❌ Missing, with a one-line note. Return the table + the
> tally. **Do not edit any file.**

### Step 5 — Merge into the backlog + hand over the commit (orchestrator)
You now hold a findings table per slice (flow + security), plus the learning-objectives verdict. Merge
them into one prioritized task list per the standard's task/priority/effort rules:
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

## Hard rules

- **Never auto-commit.** This flow writes a project-folder file under the feature-branch workflow;
  always hand Victor the command. (The `plan-audit` / `portfolio-audit` auto-commit exception does not
  extend here.)
- **One slice per subagent — never the whole codebase.** Each reviewer owns one vertical slice (a
  resource's flow, a resource's security, a cross-cutting area, a frontend feature) and returns a trace
  proving it covered every file/endpoint in it. A subagent handed the whole backend skims the last
  resources — the failure this split exists to prevent. The orchestrator's only whole-project work is
  the light slice-mapping (Step 0) and the merge (Step 5).
- **Two lenses per backend resource** — one flow reviewer (quality + correctness + tests) and one
  security reviewer. They only read, so they may run in parallel; never let one subagent do both.
- **Never edit the code.** Every finding becomes a backlog task; Victor fixes the code himself to learn.
- **Security findings are always High**, and findings are deduplicated across every slice.
- Angular 01–06 are informational only — frontend flow reviewers, report in chat, never a backlog or a
  commit for them.

````
