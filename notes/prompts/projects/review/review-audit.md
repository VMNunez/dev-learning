# Review audit — the single entry point for reviewing a project

Run this **inside Claude Code**. It is the only review-audit prompt Victor launches. It reviews a
**built** project against the contract its own `PLANNING.md` set — code quality, patterns, security,
and learning objectives — and writes a prioritized list of improvement tasks to
`{PROJECT_PATH}/PROJECT-BACKLOG.md`. That backlog is what `portfolio-audit` reads for its go/no-go
verdict, so a security hole found here becomes a **High** task that blocks portfolio-ready.

The heavy parts run as **three cold reviewer subagents** — a code-quality + learning-objectives pass, an
adversarial security pass, and an adversarial correctness (bug-hunter) pass — whose findings the
orchestrator merges into the backlog. A cold reviewer with no stake in the code catches what a single
long prompt would skip. **None of them edits the code — Victor fixes everything himself to learn.**

> **▶ Run first:** nothing — it reads `PLANNING.md` and the source, not the README. (`readme-audit`
> is a prerequisite of `portfolio-audit`, which reads the READMEs — not of this review.)

**Internal pieces this orchestrates** (you never launch these directly):
`_review-standard.md` (the bar) · `review-code-prompt.md` (code + learning objectives) ·
`review-security-prompt.md` (cold attacker pass, full-stack only) ·
`review-correctness-prompt.md` (cold bug-hunter pass).

> **Not auto-committed — by design.** Unlike `plan-audit` and `portfolio-audit` (which write study
> materials), this writes `PROJECT-BACKLOG.md` inside the project folder, which follows the project's
> **feature-branch → PR → main** workflow. The orchestrator writes the backlog to the working tree and
> **hands Victor the commit command** — it never commits for him. There is no `DRY_RUN`.

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
and the backlog format. Then run the procedure below. You stay light: the subagents read all the source
and hand you back findings tables — you merge and write the backlog. You never read the full source
yourself.

## If PROJECT_PATH = all
Per `notes/prompts/_batch-mode.md`, expand `all` into the ordered project list from the config block and
run the **single-project procedure below once per project**, fully finishing one before the next. Put
each project's report under a `### [project]` heading, and after the last print the `_batch-mode.md`
summary table (`Project | Quality | High | Medium | Low`). Otherwise, follow the procedure once.

## Single-project procedure

### Step 0 — Gate (orchestrator)
Derive the project type from the path. **Angular 01–06:** informational only — run the code subagent
(Step 1) **and the correctness subagent (Step 2b)**, report their findings in chat, write nothing, no
commit; skip the security pass and Steps 3–4. **Full-stack:** apply the 30-day gate from the standard
against `{PROJECT_PATH}/PROJECT-BACKLOG.md`; if it was reviewed < 30 days ago, stop and offer FORCE.

### Step 1 — Code reviewer (subagent)
Launch one `general-purpose` subagent, `run_in_background: false`:

> Read `notes/prompts/projects/review/review-code-prompt.md` and execute it in full for
> `PROJECT_PATH = {PROJECT_PATH}`. Review the source against the standard's code-quality checklist and
> check the learning objectives. **Do not edit any file, do not write the backlog, do not commit.**
> Return the two blocks it specifies: the code-quality findings table and the learning-objectives table
> + overall quality read.

Wait and collect.

### Step 2 — Security reviewer (subagent, full-stack only)
Launch a second `general-purpose` subagent, `run_in_background: false`:

> Read `notes/prompts/projects/review/review-security-prompt.md` and execute it in full for
> `PROJECT_PATH = {PROJECT_PATH}`. Do the cold attacker-hat pass against `notes/security/coverage.md`
> and the real backend. **Do not edit any file, do not commit.** Return only the findings table (+ any
> "beyond junior scope" line).

### Step 2b — Correctness reviewer (subagent)
Launch a `general-purpose` subagent, `run_in_background: false`:

> Read `notes/prompts/projects/review/review-correctness-prompt.md` and execute it in full for
> `PROJECT_PATH = {PROJECT_PATH}`. Do the cold bug-hunter pass — trace realistic inputs and states
> against the intended behaviour in PLANNING.md. **Do not edit any file, do not commit.** Return only
> the findings table (trigger + wrong behaviour per bug).

Wait and collect. (You may run Steps 1, 2, and 2b in parallel — they only read, so there is no
git-index contention and no shared file to race.)

### Step 3 — Merge into improvement tasks (orchestrator)
You now hold three findings tables (code, security, correctness) and the learning-objectives verdict.
Merge them into one prioritized task list per the standard's task/priority/effort rules:
- Every confirmed **security** finding → a **High** task.
- Every **correctness** bug that hits a normal path → a **High** task; edge-path bugs → Medium; latent
  ones → Low (per the correctness scope's severity rule). Each task must carry the trigger so Victor
  can reproduce it.
- Deduplicate across the three passes — a business-rule gap can surface in both the code and the
  correctness pass; keep one task, the most specific.
- Turn each code-quality finding and each ❌/⚠️ learning-objective gap into a specific task with a
  priority and an effort estimate.
- "Beyond junior scope" hardening ideas go in the chat summary, not the backlog.

### Step 4 — Write the backlog + hand over the commit (orchestrator)
First print a brief summary in chat: **Overall quality** (Strong/Good/Needs work + one sentence) ·
**Top findings** (2–3) · **Learning objectives** (how many ✅/⚠️/❌).

Then update `{PROJECT_PATH}/PROJECT-BACKLOG.md` (create it if missing) per the standard's backlog format:
today's date as "Last Reviewed", the overall quality rating, and the full task list as checkboxes.
Preserve tasks already checked off (✅).

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
- **Three cold subagents, then merge in the orchestrator.** Never fold the code, security, or
  correctness review into your own context — the focused cold pass is the whole point.
- **Never edit the code.** Every finding becomes a backlog task; Victor fixes the code himself to learn.
- **Security findings are always High**, and security + correctness findings are deduplicated against
  the code pass.
- Angular 01–06 are informational only — never create a backlog or a commit for them.
````
