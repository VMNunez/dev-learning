# Review audit — the single entry point for reviewing a project

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

Run this **inside the supported agent runtime**. It is the only review-audit prompt Victor launches. It reviews a
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

> **Run-start check (step 0):** before anything else, execute the decision table in `notes/prompts/_internal/_pipeline-self-report.md` against this prompt's own `_last-run-report`; never restate the shared `Status:` meanings here.

**Internal pieces this orchestrates** (you never launch these directly):
`_review-standard.md` (the bar — all the checklists) · `_review-flow-prompt.md` (per-slice functional
reviewer: quality + correctness + tests) · `_review-security-prompt.md` (per-slice attacker pass,
full-stack only).

> **The orchestrator commits the backlog itself.** `PROJECT-BACKLOG.md` is written by this pipeline and
> by the two backlog skills, never by Victor, so it auto-commits in any flow (shared session rules,
> authorized 2026-07-29). It is a **docs** commit on the **active branch** — it still follows the
> project's **feature-branch → PR → main** workflow and never lands on `main` directly, and the
> "Victor makes code commits himself" rule is untouched. Separate from the Step 6 self-report commit.
> There is no `DRY_RUN`.

---

## How to use — recipes

Open a fresh chat **inside the supported agent runtime**, paste the whole prompt below, fill only the config block, and
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
  "Last Reviewed" date, so the other tier still shows as unreviewed (or `never`) until you review it.
- Fill in **only** the config block. Everything below it is machinery — never edit it.
- The project type is derived from the path — do not set it.
- Angular projects 01–06 are frontend-only: they get the frontend flow slices, the learning-objectives
  pass, their own `PROJECT-BACKLOG.md` and a commit — but no security pass (no backend to attack).
- **After the run:** nothing to commit by hand — the orchestrator commits the backlog and, separately,
  its self-report. In your next main session just say the review ran: the coding agent reads
  `projects/review/_internal/_last-run-report.md` (Step 6) and tells you whether these prompts need a
  change (they stay frozen unless that report shows a real failure).

---

````
## Configuration — edit only this block

PROJECT_PATH = [projects/06-hr-portal | projects/07-timetrack | all]
REVIEW_SCOPE = [full | backend | frontend]

## PROJECT_PATH = all runs the review on every project in turn — see notes/prompts/_internal/_batch-mode.md.
## Order: projects/01-todo-list, 02-weather-app, 03-expense-tracker, 04-meal-finder, 05-task-manager,
## 06-hr-portal, 07-timetrack. The project type is derived from the number (01–06 Angular-only, 07+ full-stack).
## The per-tier unreviewed-code gate applies to every project — on 01–06 that is the `frontend` line. It
## stops and offers FORCE on every 01–06 project today: neither signal can fire in that older format.
##
## REVIEW_SCOPE limits the review to one tier so a big project can be split across sessions instead of
## one long run. Default = full. `backend` runs Steps 1–2 + 3b; `frontend` runs Step 3 + 3b — Step 3b is
## a **per-tier** step, not a frontend one, and runs on every scope. Both partial scopes skip the
## whole-project learning-objectives pass (Step 4) and touch only their own tier's backlog tasks
## (see Step 5). Angular 01–06 are frontend-only regardless — `backend` on them is a no-op.

Use PROJECT_PATH wherever the prompt refers to {PROJECT_PATH}, and REVIEW_SCOPE wherever it refers to
{REVIEW_SCOPE} (default to `full` if left blank).

---

You are the orchestrator for reviewing Victor's projects. First read
`notes/prompts/projects/review/_internal/_review-standard.md` so you know the bar, the gate, the priority rules,
and the backlog format. Then run the procedure below. You stay light: the slice reviewers read the
source and hand you back findings tables — you map the slices and merge. You never read the full source
yourself.

## If PROJECT_PATH = all
Per `notes/prompts/_internal/_batch-mode.md`, expand `all` into the ordered project list from the config block and
run the **single-project procedure below once per project**, fully finishing one before the next. Put
each project's report under a `### [project]` heading, and after the last print this pipeline's own
summary table (`Project | Quality | High | Medium | Low` — a deliberate override of `_batch-mode.md`'s
generic `Target | Result | Files changed`). **Once a project's backlog is written, drop
its slice tables from your working state** — carry forward only its summary row; the detail lives in
its `PROJECT-BACKLOG.md`. This keeps a 7-project run from drowning your context in stale findings. Otherwise, follow the procedure once.

## Single-project procedure

### Step 0 — Gate and map the slices (orchestrator)
Derive the project type from the path. **Full-stack:** apply the standard's **per-tier unreviewed-code
gate** against `{PROJECT_PATH}/PROJECT-BACKLOG.md` — read its `**Last Reviewed — backend:**` /
`**Last Reviewed — frontend:**` lines and gate **only the tiers {REVIEW_SCOPE} will review**. A missing
backlog, an absent header, or a tier line reading `never` → continue. **What decides is whether the tier
gained code, never how old the date is. Two signals, either one enough:** a **✅ step** completed after that date, and **backlog tasks
closed after it** (the `## Closed` ledger's dated lines for that tier). The fix campaign this pipeline's
own output generates moves no step, so the ✅ marks alone cannot see it. If either fired, continue
however recent the date is; if neither did, stop and offer FORCE, naming both signals and the days
since. Always report the days since. If the gate stops only some of the tiers in scope, continue with
the rest and say which you are skipping and why.
Then **map the review slices** — this is light structural work (you list slices, you do not review code).

**Apply {REVIEW_SCOPE} first — map only the tiers it names:**
- `backend` → map only the backend slices; skip the frontend map, Step 3 and Step 4 — but **not Step
  3b**, which is per-tier, not frontend, and runs on every scope (on Angular 01–06 there is no backend
  tier, so `backend` stays a no-op).
- `frontend` → map only the frontend slices; skip the backend map, Steps 1–2 and Step 4; Step 3b runs.
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
Per the shared session rules ("Testing rules"), testing enters the roadmap at **project 07** (services: JUnit/Jasmine)
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
and run Steps 3, 4 and 5 in full — including writing `PROJECT-BACKLOG.md` and **committing it yourself**,
exactly as on a full-stack project (this pipeline never hands that commit over — see Step 5).
Gate them on the `frontend` line only; their backlog's backend line stays `n/a — Angular-only`, and
every task is tagged `[frontend]`. **Full-stack:** run every step.

> The slice reviewers only **read** — they never edit and never commit — so run them in parallel:
> dispatch each step's independent subagents **in a single message** (parallel tool calls), in batches
> of at most ~4 so no batch's combined reports flood your context at once. Collect every findings
> table; the reviewers are instructed to return bounded tables with no code excerpts — if one comes
> back with long code dumps or narrative, keep only its table + trace and discard the rest.

### Model policy — per slice, to protect the findings that matter while saving tokens
Pass an explicit `model` override on every dispatch, matched to how much deep reasoning the slice needs.
**Finding a correctness bug or a vulnerability is generative, adversarial reasoning → deep-reasoning; checking
structure/patterns against a fixed checklist is verification → standard-reasoning (~1/5 the cost).** The backend is
where a missed bug is costly and where a weak model skims past subtle flaws — so it never drops below
deep-reasoning. Frontend flow and the learning-objectives pass are largely structural verification and ride standard-reasoning.

| Role | `model:` | Why |
|------|----------|-----|
| **Orchestrator (this context / session)** | **deep-reasoning** | It maps the slices, dedups across them, and word-crafts each backlog task with its priority. Run the session on deep-reasoning. |
| **Step 1 — backend flow (per resource)** | **`deep`** | Correctness on the real path: N+1, transaction boundaries, §8 business rules — the subtle bugs a lighter model misses. |
| **Step 1 — backend security (per resource)** | **`deep`** | Adversarial hunt for authz/ownership/injection/exposure — the review's analog of coverage's Analyst C; never drop it. |
| **Step 2 — persistence-config flow** | **`deep`** | Datasource/transactions/fetch/N+1 — subtle backend correctness, same bar as Step 1 flow. |
| **Step 2 — security-infra** | **`deep`** | SecurityConfig, JWT filter, CORS, hashing, secrets — the highest-stakes attack surface. |
| Step 3 — frontend flow (per feature + frontend-infra) | `standard` | Component/service split, subscription cleanup, validation timing, tests — structural pattern-matching, lower stakes. |
| Step 3b — cross-slice consistency (per tier) | `standard` | Comparing slices against a fixed list of axes — verification, not generation. |
| Step 4 — learning-objectives | `standard` | Locate each concept and mark ✅/⚠️/❌ against the rubric — verification, not generation. |

Never drop the backend flow or any security slice below deep-reasoning (those are the passes that catch the bugs
and holes that block portfolio-ready), and never drop the orchestrator below deep-reasoning (it writes the
backlog). If Victor asks for maximum saving, the two standard-reasoning slices are already the cheapest safe setting —
do not push backend or security down to save tokens. **Step 5 re-dispatches use the same model the
original slice used.**

### Step 1 — Backend, one flow + one security reviewer per resource
For **each** backend resource, dispatch two `role-appropriate` subagents, `execution: foreground`
(flow → `reasoning tier: deep`, security → `reasoning tier: deep`):

> **(flow)** Read `notes/prompts/projects/review/_internal/_review-flow-prompt.md` and execute it for
> `PROJECT_PATH = {PROJECT_PATH}`, `TIER = backend`, `SCOPE = «resource»`. Trace the resource's full
> `model → repository → service → controller → DTO → tests` flow and return its findings table + trace.
> **Do not edit any file, do not write the backlog, do not commit.**

> **(security)** Read `notes/prompts/projects/review/_internal/_review-security-prompt.md` and execute it for
> `PROJECT_PATH = {PROJECT_PATH}`, `SCOPE = «resource»`. Hunt each of that resource's endpoints for
> authorization/ownership/injection/data-exposure flaws and return its findings table + trace. **Do not
> edit any file, do not commit.**

Collect every table.

### Step 2 — Backend, cross-cutting reviewers
Dispatch (both `reasoning tier: deep`):
> **(flow)** `_review-flow-prompt.md` with `TIER = backend`, `SCOPE = persistence-config` — datasource,
> `application.properties`, transactions, fetch/N+1, docker env.
> **(security)** `_review-security-prompt.md` with `SCOPE = security-infra` — SecurityConfig, JWT filter,
> CORS, hashing, secrets/credentials, global exception handler.

Collect both tables.

### Step 3 — Frontend, one flow reviewer per feature (+ frontend-infra)
For **each** frontend feature, and once for `frontend-infra`, dispatch (`reasoning tier: standard`):
> `_review-flow-prompt.md` with `TIER = frontend`, `SCOPE = «feature»` (or `frontend-infra`) — component/
> service split, types, state, subscription cleanup, validation timing, that slice's tests, **and the
> standard's frontend-security greps** (`[innerHTML]`, `bypassSecurityTrust*`, sensitive data in
> `localStorage`) — on full-stack projects too: the cold security pass is backend-only, so this is the
> only lens that ever looks at the frontend, and `frontend-infra` is where the token lives.

Collect every table.

### Step 3b — Cross-slice consistency pass (one subagent per tier — runs on every {REVIEW_SCOPE})
The one reviewer allowed to look **across** slices — because consistency is a property *between* them and
a slice reviewer structurally cannot see it. It reads **narrowly and widely**: only the axes below, over
every feature of the tier, never the full code. Run it for each tier in {REVIEW_SCOPE} (frontend on
Angular 01–06). Dispatch one `role-appropriate` subagent, `reasoning tier: standard`, `execution: foreground`:

> Read `notes/prompts/projects/review/_internal/_review-standard.md` — **only** the "Pattern consistency across the
> project" block and the priority rules. Then, across **every** feature of `TIER = «tier»` in
> `{PROJECT_PATH}`, compare the slices against each other on that block's axes **only** — state approach,
> smart/dumb decomposition, persistence/side-effect mechanism, styling tokens, empty/loading/error states
> (frontend); DTO boundary, error-handling path, naming (backend). For each axis: name the convention the
> **majority** of the code follows, then name every **outlier** that departs from it, with `file:line`.
> An axis where everything agrees is a one-line "consistent". You are not hunting bugs and not judging any
> slice on its own merits — another reviewer already did that. Return only a table
> `| Axis | Convention (majority) | Outlier(s) | Priority |` plus a one-line list of the features you
> compared, as your trace. No code excerpts. **Do not edit any file.**

An outlier is **Medium** (High only if it breaks the DTO boundary or leaks an entity). Dedup it in Step 5
against the slice tables: when a slice reviewer already reported the same thing locally (e.g. "this page
persists imperatively"), keep the **consistency** wording — it names the convention the fix should follow,
which the local finding cannot.

(For Angular 01–06 Steps 3 and 3b are the only flow work — then go on to Steps 4 and 5.)

### Step 4 — Learning-objectives pass (one subagent)
**Skip this step entirely if {REVIEW_SCOPE} is `backend` or `frontend`** — it judges whole-project
concept coverage and only makes sense on a `full` run. Dispatch one `role-appropriate` subagent,
`reasoning tier: standard`, `execution: foreground`:
> Read `notes/prompts/projects/review/_internal/_review-standard.md` ("Learning-objectives rubric" — that section
> only) and, from `{PROJECT_PATH}/PLANNING.md`, only §3 (new concepts) / §4 (review concepts). Then
> work **concept by concept, not file by file**: for each concept, locate where it should live with a
> targeted search (grep for its annotation/class/pattern — e.g. `@RestControllerAdvice`,
> `SecurityContextHolder`, `takeUntilDestroyed`) and read only the file(s) that hit, enough to judge
> whether the use is meaningful. Never read the codebase end to end. Mark each concept ✅ Demonstrated /
> ⚠️ Shallow / ❌ Missing with a one-line note (file:line for ✅/⚠️). Return only the table + the tally —
> no code excerpts. **Do not edit any file.**

### Step 5 — Merge into the backlog + commit it (orchestrator)
You now hold a findings table per slice (flow + security), plus the learning-objectives verdict.

**First, verify coverage against your Step 0 map.** For each slice, compare the reviewer's trace with
the files that slice owns (the flow prompt's Step 1 table / the security prompt's endpoint list **and its
file rows**): every owned file/endpoint must appear in the trace, and every file row must carry its
line count and closing quote. A report whose trace misses part of its slice — or that
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
- **Reconcile contradictions across slices before writing any task — dedup is not enough.** A slice
  reviewer sees only its own files, so it can report "X is missing" when X is actually defined in a file
  another slice owns. When two tables disagree about the same symbol — one says a class/rule/style/token
  is absent, another says it exists and is used — you are the only one holding both, so **resolve it
  against the real code** (one targeted grep/read of the symbol) before it reaches the backlog. Drop the
  false half; never file a "missing X" task while another slice reports X working.
  > On the 2026-07-16 run of 05-task-manager, the `task-page` reviewer filed "no CSS defines `.btn-danger`"
  > (it lives in `material-theme.scss`, owned by `frontend-infra`) while the `frontend-infra` reviewer
  > reported that same `.btn-danger` as a working scoped `mat.theme()`. Both tables were in front of the
  > orchestrator; the false Medium still reached the backlog and was only caught on a manual spot-check.
  > This is a structural blind spot of slicing — the orchestrator is the only reviewer positioned to catch it.
- Turn each quality finding and each ⚠️/❌ learning-objective into a specific task with a priority and an
  effort estimate.
- "Beyond junior scope" hardening ideas go in the chat summary, not the backlog.

**Then run the level-fit pass over the merged list, per the standard's "Level fit" rules — before a
single task is written.** You are the only reader in this pipeline positioned to do it: the slice
reviewers read code, never the coverage files or `PROGRESS.md`. Read, once, for the whole run:

- **`PROGRESS.md` §`Professional level by topic`** — where Victor stands per topic.
- **`PROGRESS.md` §`Coverage demonstrated`** — the per-topic `Junior | Middle | Senior` percentages.
  This is the fast read: one table gives the open gate for every topic at once. A `*` on a cell means
  that level was never generated by the coverage pipeline, so its file is a provisional sketch — it may
  *suggest* a level, never rule on one, and its denominator will move. Do not re-derive this from
  `_run-tracker.md`; the asterisk already carries it.
- `notes/prompts/_internal/_shared-context.md` — target role and timeline.

Then, per task, grep its core concept through `notes/{topic}/coverage/{junior,middle,senior}.md` — the
`✅ NN-slug — {evidence}` markers there say which bullets Victor has already applied in project code, so a concept
whose neighbours are marked is squarely at level. (The global `notes/coverage/{LEVEL}.md` mirror carries
the same bullets and markers; either answers the question, so read whichever you already have open.)
**An unmarked bullet means "not yet marked", not "not covered"** — the marker went live 2026-07-30 and
the backfill is still finishing, so absence of a ✅ is never evidence *against* a concept being at
level.

**Route each concept to its topic before grepping** — the authority is the "Topic isolation" section of
`notes/prompts/knowledge/coverage/_internal/_coverage-standard.md` (altitude, not subject matter: the
neutral topics own the principle, the technology topics own the mechanism). The gates differ sharply
between topics, so a bad routing flips the verdict; when it is a close call, grep both and take the
lower gate.

Then apply the necessity test: **at level** → normal task · **above level but strictly necessary for this
project to be correct** → keep it, tag the line `⬆ {level} — reason` · **above level and merely nice**
→ out of `## Tasks`, into the backlog's `## Beyond the current gate` section *and* the chat summary,
with the gate that would make it due. Necessity beats level every time; never downgrade a real defect
to keep the list short.

**Read `## Beyond the current gate` before writing anything**, alongside the `## Closed` ledger: a
finding already parked there is not re-raised while its gate holds, and one whose gate has since moved
leaves the section and becomes a normal task.

**No secret value reaches the chat summary, the backlog, or the self-report.** Both slice reviewers cite
a secret by location and kind only, and the flow reviewer's **secret-valued** config findings arrive as
the key plus whether its value is a literal or an `${ENV}` reference — so an API key, password, token, connection
string or signing secret should never reach you as a value. If one does, strip it before you write it
anywhere: cite the file, the line and what the secret is, say it must be rotated and moved to an env var,
and never paste the material, not even partially masked (a `7b6aec…` prefix still leaks material and
confirms which key it is). This holds for the run's own self-report too — a reviewer that returned a raw
value is a rule breach worth recording, and the breach is recorded by naming it, never by quoting the
value as evidence. You commit both `PROJECT-BACKLOG.md` and that report, so a value copied into either is
the leak it was reporting. This changes how a secret is cited, never whether it is raised.

First print a brief chat summary: **Overall quality** (Strong/Good/Needs work + one sentence) · **Top
findings** (2–3) · **Learning objectives** (how many ✅/⚠️/❌) · **Slices reviewed** (count) · **Beyond
the current gate** (how many findings the level-fit pass parked, and how many lines it graduated back
into `## Tasks` because their gate had moved — `none` when both are zero).

Then update `{PROJECT_PATH}/PROJECT-BACKLOG.md` (create it if missing) per the standard's backlog
format: the **per-tier "Last Reviewed" lines**, the overall quality rating, and the full task list as
checkboxes, **each task tagged with its tier** (`[backend]` / `[frontend]`), and the
`## Beyond the current gate` section for what the level-fit pass parked (same tier tag; create the
section if missing, with a placeholder line when it is empty). Preserve tasks already checked off (✅).

**Stamp today's date only on the tiers this run actually reviewed** — a `backend` run sets
`**Last Reviewed — backend:**` to today and leaves the `frontend` line exactly as it was (a date, or
`never`). That is what keeps a partial run from ever making an unreviewed tier look reviewed.

**On a partial {REVIEW_SCOPE} run, only touch the reviewed tier's tasks.** A `backend` run rewrites the
`[backend]`-tagged tasks and leaves every `[frontend]` task untouched (and vice versa) — never delete or
overwrite the tier you did not review this run. The learning-objectives table is likewise left as-is on
a partial run (it is only regenerated on a `full` run).

Finally, **commit the backlog yourself** (authorized 2026-07-14 — Victor does not want to run these by
hand). Run `git status` right before `git add` and right before `git commit`, stage **only**
`{PROJECT_PATH}/PROJECT-BACKLOG.md`, and `git restore --staged` anything else that crept in. The backlog
is a docs file this pipeline authored, so it is a documentation commit, not a code commit — the
"Victor makes code commits himself" rule is untouched. One logical change, one commit, separate from the
Step 6 self-report commit:

```
git add {PROJECT_PATH}/PROJECT-BACKLOG.md
git commit -m "docs: review {PROJECT_PATH} — <one line summary of main findings>"
```

### Step 6 — Pipeline self-report (orchestrator, last)
After the backlog commit, **execute `notes/prompts/_internal/_pipeline-self-report.md` in full.** That
file is the contract, not a summary of one: the ledger reconciliation, the `Status:` line, the five
bullets, the close-out check against disk, the `_run-tracker.md` update, the two-file commit and its
`git show --stat HEAD` verification, and the at-end refinement gate all apply here unchanged. This
step only says what *this* pipeline puts in them. Write the report to
`notes/prompts/projects/review/_internal/_last-run-report.md` (overwrite; header: date + project +
scope + `Status:`), one line per bullet — meta-observations about the run itself, never the findings,
which live in `PROJECT-BACKLOG.md`:

1. **Plan vs reality** — the Step 0 slice map: any resource missed, any slice too big or too small. No
   step in this pipeline reads the finished backlog whole, so say that in one clause and claim no more
   than the traces prove.
2. **Report discipline** — reviewers that came back with code excerpts or narrative that had to be
   discarded.
3. **Failures & retries** — traces that failed the Step 5 check, re-dispatches made, any slice left
   "not reviewed", any false alarm.
4. **Rule friction and rule breaches** — the shared bullet, plus what is specific here: how many
   cross-slice duplicates were merged and whether matching them was hard, and any cross-slice
   contradiction the Step 5 reconciliation had to resolve against real code.
5. **Verdict** — one line: "pipeline clean" or "change worth considering: <what>".

**The `_run-tracker.md` half is not optional, and it is the half this pipeline has always dropped.**
Set the `review-audit` cell of this project's row in `## Per-project prompts` to today's date, with the
scope in parentheses when partial (`2026-07-23 (backend only)`). That column sat **empty for all seven
projects** until 2026-08-06 while four runs had written their report — the report-written /
tracker-skipped failure the shared contract names, reproduced here because this step never mentioned
the tracker. The cell is an **execution record, not review state** — the gate reads the backlog's
per-tier lines and never this cell, so the two are allowed to differ without either being wrong.
The commit carries **two** files, verified with `git show --stat HEAD`, message
`docs: pipeline self-report for review-audit run on {PROJECT_PATH}`. It is prompt-system machinery, so
it commits directly, always **separate** from the backlog commit. Also print the five bullets in chat.

## Hard rules

- **Commit the backlog yourself** — `PROJECT-BACKLOG.md` is written by this pipeline and the two backlog
  skills, never by Victor, so the shared session rules have it auto-commit in any flow (authorized
  2026-07-29, widening the 2026-07-14 pipeline-only permission). It is a docs commit for a file this
  pipeline wrote, so it does not touch the "Victor makes code commits himself" rule. `git status` before
  add and before commit; stage **only** `PROJECT-BACKLOG.md`, never a project code file that was left
  staged from an earlier step. It commits on the active branch, never on `main`. The Step 6
  `_last-run-report.md` is a **separate** commit — never fold the two together.
- **One slice per subagent — never the whole codebase.** Each reviewer owns one vertical slice (a
  resource's flow, a resource's security, a cross-cutting area, a frontend feature) and returns a trace
  proving it covered every file/endpoint in it. A subagent handed the whole backend skims the last
  resources — the failure this split exists to prevent. The orchestrator's only whole-project work is
  the light slice-mapping (Step 0) and the merge (Step 5).
  **The single exception is the Step 3b consistency reviewer**, which is deliberately cross-slice: it
  reads *narrowly* (a fixed list of axes) across *every* slice, so it never holds the whole codebase in
  depth. It is the only reviewer permitted to look outside one slice, and only for those axes — a
  consistency reviewer that starts reporting bugs has left its lane.
- **Two lenses per backend resource** — one flow reviewer (quality + correctness + tests) and one
  security reviewer. They only read, so they may run in parallel; never let one subagent do both.
- **Never edit the code.** Every finding becomes a backlog task; Victor fixes the code himself to learn.
- **A partial `REVIEW_SCOPE` run stays in its lane.** `backend` / `frontend` review and rewrite only
  their own tier's slices and backlog tasks, skip the whole-project learning-objectives pass, and stamp
  today's date on **only their own tier's** "Last Reviewed" line. The untouched tier's tasks and date are
  preserved verbatim — a partial run must never make an unreviewed tier look reviewed.
- **Review state lives in `{PROJECT_PATH}/PROJECT-BACKLOG.md`, per tier — nowhere else.** No missing file
  = never reviewed; a tier line of `never` = that tier never reviewed. There is no root-level review
  index, by design: a second copy of the date would drift out of sync with the backlog. **`_run-tracker.md`
  is not that index** — its cell records that *this prompt executed* on this target, exactly like every
  other orchestrator's cell, and the Step 0 gate never reads it. When the two disagree, the backlog wins
  and the cell is simply behind.
- **Every *confirmed* security finding is High** (the standard defines confirmed) — a finding resting
  only on a silent plan, such as a `localStorage` token PLANNING never rules on, is the Medium
  "decide and document" it describes. Findings are deduplicated across every slice.
- **Model per slice, always explicit** (see Model policy): backend flow + every security slice + the
  orchestrator run on **deep-reasoning**; frontend flow and learning-objectives on **standard-reasoning**. Never drop backend
  or security below deep-reasoning to save tokens — those are the passes that catch what blocks portfolio-ready.
- **No trace, no review.** A slice counts as reviewed only when its trace covers every file/endpoint
  the slice owns (verified in Step 5 against the Step 0 map). Failed or partial reports get one
  re-dispatch, then an explicit "not reviewed" in the summary — never a silent pass.
- **Bounded reports only.** Every subagent returns its findings table + trace and nothing else — no
  code excerpts, no narrative. If one overflows, keep its table + trace and discard the rest; never let
  a verbose reviewer crowd the merge.
- Angular 01–06 are frontend-only — frontend flow reviewers + learning-objectives, then a
  `[frontend]`-tagged backlog and its commit, exactly like the frontend tier of a full-stack project.
  Never a **cold security pass** for them (no backend to attack) — but the standard's frontend-security
  greps ride the flow reviewer on **every** Angular tier, 01–06 and 07+ alike, because nothing else in
  the pipeline ever looks at frontend code with a security lens.

````
