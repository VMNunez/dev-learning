# Prompts — the study system

All prompts live in `notes/prompts/`, grouped by purpose. **All are used in separate
conversations — never in the main daily session.** Update the project list inside each file as
new projects are completed.

This file is the map of the whole system: what each prompt does, how they connect, and the
order to run them in. CLAUDE.md only links here — it does not repeat this content.

---

## The prompts

**Knowledge** — study content quality and coverage

| File                                                    | Purpose                                                                                                                                                        |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `knowledge/notes-by-topic-prompt.md`            | Notes only — checks notes quality, coverage, and writing style for one topic; also contains the full writing standard and organisation rules                   |
| `knowledge/interview-prep-by-topic-prompt.md`   | Interview prep only — audits one interview prep file or section                                                                                                |
| `knowledge/notes-and-interview-prep-prompt.md`  | Combined audit — notes + interview prep together, with the cross-reference check between them (concepts in notes must have a matching question, and vice versa) |
| `knowledge/coverage-prompt.md`                  | Coverage — creates or updates `coverage.md` for one notes folder; decides what is in scope, what goes to `future-learning.md`, and what to remove              |
| `knowledge/coverage-audit-prompt.md`            | Global coverage audit — audits all sections of `notes/coverage.md` at once; detects missing topics, fills gaps, fixes item quality, ensures cross-topic consistency; convergence step after all topic coverage files exist |

**Projects** — project lifecycle

| File                                              | Purpose                                                                                                                                 |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `projects/new-project-prompt.md`          | Project planning — two modes: `new` (picks best next project, writes complete PLANNING.md) or `review` (audits an existing PLANNING.md section by section) |
| `projects/readme-review-prompt.md`        | README review — single source of README rules; checks and fixes all sections for Angular and fullstack projects; run before project-review or portfolio-ready |
| `projects/project-review-prompt.md`       | Project review — checks code quality, patterns, and learning objectives; writes improvement tasks to `PROJECT-BACKLOG.md` (README reviewed separately)       |

**Practice** — active recall and simulation

| File                                                   | Purpose                                                                                                                      |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `practice/simulator-prompt.md`                 | Mock interview — interviewer asks questions, Victor answers, gets feedback                                                   |
| `practice/simulation-review-prompt.md`         | Simulation review — scores a completed timed test, gives detailed feedback, adds interview questions, updates TRACKER.md     |
| `practice/sql-exercises-prompt.md`             | SQL exercises — two modes: `practice` (generates exercises by topic) or `review` (checks Victor's answers and scores them)   |

**Strategy** — keeping the plan accurate

| File                                                 | Purpose                                                                                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `strategy/roadmap-review-prompt.md`          | Roadmap review — checks ROADMAP.md phase status, SQL/notes tables, and project gaps against coverage.md, PROGRESS.md, and CLAUDE.md |
| `strategy/progress-update-prompt.md`         | Progress update — reads every project's PLANNING.md and SQL exercises; refreshes PROGRESS.md so new-project-prompt has accurate input |
| `strategy/portfolio-ready-prompt.md`         | Portfolio gate — final check before applying: generates project-specific interview questions saved to `notes/interview-prep/projects/`, gives verdict, CV bullet and GitHub description |
| `strategy/cv-prompt.md`                      | CV writer — two modes: `create` (builds CV from scratch) or `review` (audits and rewrites); outputs complete one-page CV text in Spanish ready for a template |
| `strategy/linkedin-prompt.md`                | LinkedIn updater — drafts all profile sections (headline, about, experience, projects, skills) and 3 ready-to-post posts; outputs ready-to-paste text for each section |

---

## How the prompts connect

```
┌─────────────────┐
│ coverage-prompt │  ← run when starting a topic or when scope changes
└────────┬────────┘
         │ writes
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│  notes/coverage.md  — source of truth: what to learn               │
└──┬────────────────────────────────────────┬────────────────────────┘
   │                                        │
   ▼                                        ▼
notes-by-topic-prompt              roadmap-review-prompt
interview-prep-by-topic-prompt       reads: PROGRESS.md + CLAUDE.md
notes-and-interview-prep-prompt      writes: ROADMAP.md
   │                                        │
   ▼                                        │
notes/*.md                                  │
interview-prep/en/*.md + es/*.md            │
                                            │
┌───────────────────────────────────────────┘
│
│  progress-update-prompt
│  reads: all PLANNING.md files + sql/ folder
│  writes: PROGRESS.md
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│  PROGRESS.md  — source of truth: what has been learned              │
└──┬──────────────────────────────────────────────────────────────────┘
   │
   │  + notes/coverage.md  + ROADMAP.md
   ▼
┌─────────────────┐
│ new-project-    │  ← run before starting a new project
│ prompt          │
└────────┬────────┘
         │ writes
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│  {project}/PLANNING.md  — source of truth: what the project builds  │
└──┬──────────────────────────┬──────────────────────────────────────┘
   │                          │
   ▼                          ▼
readme-review-prompt     project-review-prompt
writes: README.md(s)     writes: PROJECT-BACKLOG.md
   │
   ▼
portfolio-ready-prompt   ← final gate before applying
   │
   ├──▶ cv-prompt       → one-page CV in Spanish
   └──▶ linkedin-prompt → ready-to-paste LinkedIn sections

── Practice (independent — runs any time, daily blocks) ──────────────

simulator-prompt         reads: interview-prep/es/*.md
                         → live mock interview + feedback

simulation-review-prompt reads: simulations/{type}/*.md
                         writes: TRACKER.md + interview questions

sql-exercises-prompt     reads/writes: sql/{topic}/exercises.sql
                         → generates or scores SQL exercises
```

The system has three hub files that everything else reads from or writes to:

| Hub file | What it is |
|----------|------------|
| `notes/coverage.md` | Source of truth for **what to learn** — built by `coverage-prompt` (per topic) and audited by `coverage-audit-prompt` (global) |
| `PROGRESS.md` | Source of truth for **what has been learned** — generated by `progress-update-prompt` |
| `{project}/PLANNING.md` | Source of truth for **what a project builds** — generated by `new-project-prompt` |

---

**Stage 1 — Define what to learn (run when starting a new topic or when scope changes)**

```
coverage-prompt → notes/{topic}/coverage.md + notes/coverage.md
```

`coverage-prompt` reads the existing notes and `future-learning.md`, then decides what belongs in scope for a junior at a Spanish consultancy. It writes `coverage.md` inside each topic folder and syncs the same content to `notes/coverage.md` (the combined file for cross-topic analysis).

---

**Stage 2 — Build and audit knowledge (run after study sessions)**

```
notes/coverage.md ──→ notes-by-topic-prompt       → notes/{topic}/*.md
                  ──→ interview-prep-by-topic-prompt → notes/interview-prep/en/*.md + es/*.md
                  ──→ notes-and-interview-prep-prompt → both at once (replaces the two above)
```

All three prompts use `coverage.md` as the baseline of required topics. They add missing content, fix quality issues, and keep notes and interview prep in sync with each other. `notes-and-interview-prep-prompt` is the combined version — use it when you want both checked in one run.

---

**Stage 3 — Plan and build a project**

```
coverage.md + PROGRESS.md + ROADMAP.md → new-project-prompt → {project}/PLANNING.md
```

`new-project-prompt` reads all three hub files to find gaps and pick the best next project. It writes the full `PLANNING.md` that becomes the source of truth for everything built in that project.

```
PLANNING.md → readme-review-prompt  → {project}/README.md(s)
PLANNING.md → project-review-prompt → PROJECT-BACKLOG.md
```

`readme-review-prompt` checks that the README reflects what PLANNING.md planned. Run it before `project-review-prompt`.
`project-review-prompt` checks that the code matches PLANNING.md and meets quality standards. It writes improvement tasks to `PROJECT-BACKLOG.md`.

```
{project}/README.md + code → portfolio-ready-prompt → CV bullet + GitHub description
```

`portfolio-ready-prompt` is the final gate — run it when the project is finished. It checks recruiter quality, architecture decisions, explainability, and tests, then gives a verdict (Ready / Almost / Not ready).

---

**Stage 4 — Keep everything in sync (run periodically)**

```
all PLANNING.md files + sql/ folder → progress-update-prompt → PROGRESS.md
PROGRESS.md + notes/coverage.md + CLAUDE.md → roadmap-review-prompt → ROADMAP.md
```

`progress-update-prompt` reads every project's PLANNING.md to refresh PROGRESS.md. Run it before `new-project-prompt` — if PROGRESS.md is stale, the gap analysis is wrong.
`roadmap-review-prompt` checks that ROADMAP.md reflects the real current state and converts calendar dates to gate conditions.

---

**Stage 5 — Practice (run independently, any time)**

```
notes/interview-prep/es/*.md → simulator-prompt         → live mock interview feedback
simulations/{type}/*.md      → simulation-review-prompt → TRACKER.md + interview questions
sql/{topic}/exercises.sql    → sql-exercises-prompt      → exercises.sql or scored review
```

These prompts do not depend on the other stages. Use them during the 12:30 and 13:30 daily blocks.

---

**Stage 6 — Apply (run when portfolio is ready)**

```
PROGRESS.md + ROADMAP.md + project READMEs → cv-prompt      → one-page CV in Spanish
CLAUDE.md + PROGRESS.md + ROADMAP.md       → linkedin-prompt → ready-to-paste LinkedIn sections
```

`cv-prompt` reads the project READMEs for architecture decisions and learning bullets. Run `portfolio-ready-prompt` on the projects first so the READMEs are correct.
`linkedin-prompt` reads CLAUDE.md, PROGRESS.md, and ROADMAP.md to draft all sections — headline, about, experience, projects, skills, and 3 ready-to-post posts.

---

## Typical run order

**When starting a new project:**

1. `progress-update-prompt` — make sure PROGRESS.md is accurate
2. `new-project-prompt` — plan the project, get PLANNING.md
3. Build the project step by step (guided sessions)
4. `readme-review-prompt` — fix READMEs after each big feature
5. `project-review-prompt` — code review after the project is complete
6. `portfolio-ready-prompt` — final gate before adding to CV

**When auditing knowledge:**

1. `coverage-prompt` — create or update coverage.md for each topic (bottom-up, one topic at a time)
2. `coverage-audit-prompt` — global audit of `notes/coverage.md`; fills gaps, detects missing topics, declares stability (run once after all topics have a coverage.md; not a recurring cycle)
3. `notes-and-interview-prep-prompt` — audit notes + interview prep together
4. `roadmap-review-prompt` — check the roadmap still reflects reality
