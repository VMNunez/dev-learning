# Prompts — the study system

All prompts live in `notes/prompts/`, grouped by purpose. **They run in separate conversations,
never in the main daily session** — you fill in the configuration block at the top of a prompt,
paste it into a fresh chat, and it does one job. Update the project list inside each prompt as new
projects are completed.

This file is the map: what each prompt does, **what it reads, what it generates**, how they feed
each other, and which prompts are still missing. CLAUDE.md only links here.

> **Two files every prompt reads.** Almost all of them start by reading `CLAUDE.md` (teaching
> rules, folder structure, "next file:" counters) and `notes/prompts/_shared-context.md` (my
> profile, situation, the market). To keep the tables below readable, those two are not repeated
> in each "Reads" cell — assume them.

---

## The three hub files

Everything orbits three sources of truth. Most prompts exist to write one of them or to consume one.

| Hub file | Source of truth for | Written by | Read by |
|----------|---------------------|------------|---------|
| `notes/coverage.md` | **what I must learn** | `coverage-prompt`, `coverage-audit-prompt` | notes/interview-prep audits, `new-project`, `roadmap-review`, `sql-exercises` |
| `PROGRESS.md` | **what I have learned** | `progress-update-prompt` (+ Claude per step in session) | `new-project`, `roadmap-review`, `portfolio-ready`, `cv`, `linkedin`, `sql-exercises` |
| `{project}/PLANNING.md` | **what a project builds** | `new-project-prompt` | `readme-review`, `project-review`, `portfolio-ready`, `progress-update`, `roadmap-review` |

---

## The prompts — what each one reads and generates

### Knowledge — build and audit study content

| Prompt | What it does | Reads (besides CLAUDE.md + _shared-context) | Generates / updates |
|--------|--------------|----------------------------------------------|---------------------|
| `knowledge/coverage-prompt.md` | Defines the required scope for **one** topic — what a junior must know, what is deferred. | the topic's note files, `notes/{topic}/future-learning.md` | `notes/{topic}/coverage.md`, syncs `notes/coverage.md`, updates `future-learning.md` |
| `knowledge/coverage-audit-prompt.md` | **Global** convergence pass over all of `notes/coverage.md`; fills gaps, fixes item quality, can add a whole new topic folder (e.g. testing, docker). Run once after every topic has a coverage file. | `notes/coverage.md`, every `notes/{topic}/coverage.md`, `ROADMAP.md` | `notes/coverage.md` + each topic `coverage.md`, `future-learning.md` files; may create `notes/{topic}/` |
| `knowledge/notes-by-topic-prompt.md` | Builds and audits the study **notes** for one topic against its coverage. Holds the full notes writing standard. | `notes/{topic}/coverage.md`, the topic's notes, `PROGRESS.md` | the topic's `notes/*.md`, `future-learning.md`, the "next file:" counter in `CLAUDE.md` |
| `knowledge/interview-prep-by-topic-prompt.md` | Builds and audits the **interview Q&A** for one topic (priority markers, question types, en/es sync). | `notes/{topic}/coverage.md`, `interview-prep/en/` + `es/` | `interview-prep/en/{file}.md` + `es/{file}.md` |
| `knowledge/notes-and-interview-prep-prompt.md` | Closes gaps **between** notes and Q&A in both directions (every note concept has a question, every question has a note). Run after the two above. | the topic notes + `interview-prep/en/` + `es/` | the topic `notes/*.md` and `interview-prep/en/` + `es/`, `CLAUDE.md` counter |

### Projects — plan, document, review

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `projects/new-project-prompt.md` | `new` mode: gap-analyses PROGRESS vs coverage, picks the next project, writes a full PLANNING.md. `review` mode: audits an existing PLANNING.md. | `PROGRESS.md`, `notes/coverage.md`, `ROADMAP.md`, last project's `PLANNING.md` | `{project}/PLANNING.md`; adds a row to `PROGRESS.md`; marks the choice in `ROADMAP.md` |
| `projects/readme-review-prompt.md` | The single source of README rules; writes/fixes every README section. Run before review and portfolio gate. | `{project}/PLANNING.md`, the existing README(s) | `{project}/README.md` (+ `backend/README.md`, `frontend/README.md` for fullstack) |
| `projects/project-review-prompt.md` | Reviews code quality, patterns, and learning objectives against the plan; writes improvement tasks. | `{project}/PLANNING.md`, the source code, `PROJECT-BACKLOG.md` | `PROJECT-BACKLOG.md` (per-project task list + "Last reviewed" date) |

### Practice — active recall and timed tests (daily blocks)

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `practice/sql-exercises-prompt.md` | `practice` mode: generates SQL exercises by topic. `review` mode: grades my answers and scores them. | `notes/sql/coverage.md`, `PROGRESS.md`, `sql/{topic}/exercises.sql` | `sql/{topic}/exercises.sql`; the SQL table in `PROGRESS.md`; `interview-prep/en/sql.md` + `es/sql.md` |
| `practice/simulation-review-prompt.md` | Grades a finished timed simulation, gives a 3-score ideal solution, adds interview questions. `hint` mode guides mid-test. | the simulation spec in `simulations/{type}/`, `simulations/TRACKER.md`, + my pasted code | `simulations/TRACKER.md`, the spec's header, `interview-prep/en/{topic}.md` + `es/{topic}.md` |
| `practice/simulator-prompt.md` | Runs a live mock interview from my Q&A bank, scores each answer, tracks weak areas across sessions. | `interview-prep/{lang}/*.md`, `interview-prep/projects/*`, `interview-prep/SESSION-LOG.md` | `interview-prep/SESSION-LOG.md` |

### Strategy — keep the plan accurate and apply

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `strategy/progress-update-prompt.md` | Rebuilds PROGRESS.md from reality — reads every PLANNING.md, the sql/ folder, the simulation tracker. Run before `new-project`. | all `PLANNING.md` files, `sql/`, `simulations/TRACKER.md` | `PROGRESS.md` |
| `strategy/roadmap-review-prompt.md` | Keeps ROADMAP forward-looking and gate-based (no stale dates); checks project sequence and study-block tables vs coverage. | `notes/coverage.md`, `PROGRESS.md`, the active `PLANNING.md` | `ROADMAP.md` |
| `strategy/portfolio-ready-prompt.md` | Final go/no-go gate per project: generates project-specific interview questions, a verdict, a CV bullet, a GitHub description. | `{project}/PLANNING.md`, README(s), code, tests, `PROJECT-BACKLOG.md`, `ROADMAP.md` | `interview-prep/projects/{project}.md`, `notes/cv/cv-bullets.md` |
| `strategy/cv-prompt.md` | Builds or reviews the one-page Spanish CV (ATS-checked). | `PROGRESS.md`, `ROADMAP.md`, `notes/cv/cv-bullets.md` | **Output only** — CV text to paste into a template (not stored in the repo) |
| `strategy/linkedin-prompt.md` | Drafts every LinkedIn section + 3 posts, ready to paste. | `PROGRESS.md`, `ROADMAP.md` | **Output only** — LinkedIn text (not stored in the repo) |

---

## How the prompts feed each other

The key thing to understand: **several prompts consume files that other prompts generate.** If a
producer has not run (or is stale), its consumers produce wrong results. Run producers first.

Each generated file, with who writes it and who depends on it:

- **`notes/coverage.md`** — written by `coverage-prompt` / `coverage-audit-prompt` → read by
  `notes-by-topic`, `interview-prep-by-topic`, `notes-and-interview-prep`, `new-project`,
  `roadmap-review`, and `sql-exercises` (SQL section). *Coverage is the root — almost everything
  downstream assumes it is correct.*
- **`PROGRESS.md`** — written by `progress-update` (and by Claude after each step in the daily
  session) → read by `new-project`, `roadmap-review`, `portfolio-ready`, `cv`, `linkedin`,
  `sql-exercises`. *Stale PROGRESS = wrong gap analysis in `new-project` and `roadmap-review`.*
- **`{project}/PLANNING.md`** — written by `new-project` → read by `readme-review`,
  `project-review`, `portfolio-ready`, `progress-update`, `roadmap-review`. *It is the contract
  the whole project is checked against.*
- **`PROJECT-BACKLOG.md`** — written by `project-review` → read by `portfolio-ready` (open
  High/Medium tasks block the "ready" verdict).
- **`notes/cv/cv-bullets.md`** — written by `portfolio-ready` → read by `cv-prompt` (one polished
  bullet per project, reused as-is).
- **`interview-prep/en/*.md` + `es/*.md`** — written by `interview-prep-by-topic`,
  `notes-and-interview-prep`, `simulation-review`, `sql-exercises` → read by `simulator`.
- **`interview-prep/projects/*.md`** — written by `portfolio-ready` → read by `simulator`.
- **`simulations/TRACKER.md`** — written by `simulation-review` → read by `progress-update` and by
  `simulation-review` itself (recurring-weakness check).
- **`interview-prep/SESSION-LOG.md`** — written and read by `simulator` (tracks weak areas between
  sessions).

Pipeline view:

```
coverage-prompt / coverage-audit ─► notes/coverage.md
        │
        ├─► notes-by-topic ─► notes/*.md ─┐
        ├─► interview-prep-by-topic ─► interview-prep/*.md ─┐
        │        └─ notes-and-interview-prep keeps both in sync
        │                                                   │
        ▼                                                   ▼
progress-update ─► PROGRESS.md ─► new-project ─► {project}/PLANNING.md   simulator
                        ▲                              │                  ▲ (reads Q&A)
                        │            ┌─────────────────┼───────────────┐ │
                        │            ▼                 ▼               ▼ │
                        │     readme-review     project-review   portfolio-ready
                        │     README(s)         PROJECT-BACKLOG  ─► cv-bullets ─► cv-prompt
                        │                                          └► interview-prep/projects ┘
                        └─ roadmap-review ─► ROADMAP.md

Practice (independent): sql-exercises ─► sql/ + PROGRESS + sql Q&A
                        simulation-review ─► TRACKER + topic Q&A
```

---

## Typical run order

**Starting a new project**
1. `progress-update` — make PROGRESS.md accurate first
2. `new-project` — plan it, get PLANNING.md
3. build it, step by step (daily sessions)
4. `readme-review` — fix the README(s) after each big feature
5. `project-review` — code review when the project is complete
6. `portfolio-ready` — final gate before adding it to CV/LinkedIn

**Auditing knowledge (one topic)**
1. `coverage-prompt` — define/refresh the topic's coverage
2. `notes-by-topic` then `interview-prep-by-topic` — build both sides
3. `notes-and-interview-prep` — close the gaps between them
4. (after all topics have coverage) `coverage-audit` — global convergence pass
5. `roadmap-review` — check the plan still reflects reality

**Applying**
1. `portfolio-ready` on each finished project (produces cv-bullets)
2. `cv-prompt` → one-page CV · `linkedin-prompt` → profile + posts

---

## Gaps — prompts that may be missing for my objective

Detected against the goal (junior Angular + Spring Boot at a Spanish consultancy by Aug–Sep 2026)
and the market analysis in `_shared-context.md`. None of the 16 current prompts covers these:

1. **Code-review / find-the-bug practice — HIGH.**
   The market analysis says 2026 technical tests now include a code-review step: you are shown a
   flawed snippet (often AI-generated) and asked to find the bug or explain what is wrong. Nothing
   trains this. `simulator` tests recall; `simulation-review` grades code I wrote; the simulations
   make me build from scratch — but no prompt hands me broken code to critique. This is one of the
   newest and most explicit filters, and it is a blind spot.
   *Proposed: `practice/code-review-prompt.md` — generates a snippet (Angular, Spring Boot, or SQL)
   with planted issues, I write my review, it grades my findings and adds an interview question.*

2. **Technical-test simulation generator — MEDIUM.**
   The 15 simulation specs in `simulations/` are hand-written and fixed. `simulation-review` can
   tell me "do more of type X" after a weak result, but nothing produces more specs in the same
   format. `sql-exercises` covers SQL drilling, not full timed Angular/Spring-Boot task specs.
   Once the bank is used up — or when one type proves weak — I cannot generate fresh tests.
   *Proposed: `practice/simulation-generator-prompt.md` — creates new timed specs by type and
   difficulty, in the existing format, and registers them in `TRACKER.md`.*

3. **HR / behavioural screen prep (stage 2) — MEDIUM.**
   The hiring process has 5 stages; stage 2 is a non-technical HR call (motivation, "why this
   company", availability, salary expectation). `simulator` only touches "tell me about yourself".
   As a 31-year-old career-changer, the salary/availability/"why the switch" answers matter and
   are currently untrained.
   *Proposed: `practice/hr-screen-prompt.md` — mock HR call in Spanish: motivation, salary range
   for a Spanish junior, availability, and the career-change narrative, with feedback.*

Lower priority / probably not worth a prompt: an application tracker (a simple file + the ROADMAP
applications section already cover this).
