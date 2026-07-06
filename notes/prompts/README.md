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
| `knowledge/_coverage-standard.md` | *Internal.* The **shared coverage standard** both coverage prompts read (scope logic, three item types, confusable pairs, AI factor, item/file format, the job-target-is-the-source rule). Not runnable. | — | — |
| `knowledge/coverage-prompt.md` | Defines the required scope for **one** topic — what a junior must know, what is deferred. Reads the standard + `ROADMAP` for the target. | `_coverage-standard.md`, `ROADMAP.md`, the topic's note files, `future-learning.md` | `notes/{topic}/coverage.md`, syncs `notes/coverage.md`, updates `future-learning.md` |
| `knowledge/coverage-audit-prompt.md` | **Global** convergence pass over all of `notes/coverage.md`; fills gaps, fixes item quality, can add a whole new topic folder (e.g. testing, docker). Run once after every topic has a coverage file. | `_coverage-standard.md`, `notes/coverage.md`, every `notes/{topic}/coverage.md`, `ROADMAP.md` | `notes/coverage.md` + each topic `coverage.md`, `future-learning.md` files; may create `notes/{topic}/` |
| `knowledge/notes-audit.md` | **THE entry point — the only notes prompt you launch.** Runs **inside Claude Code**, hands-off. `SCOPE = folder` audits/completes a whole topic; `SCOPE = file` audits one file. Every file is authored then reviewed by two cold subagents before an atomic commit. `DRY_RUN` stages without committing. | its four internal pieces (below) | every built `notes/*.md` + `es/*.md`, one atomic commit per file |
| `knowledge/_note-quality-standard.md` | *Internal.* The **shared writing standard** every piece reads (format modes, rule 3, signature elements, anticipate-the-TODO). Not runnable. | — | — |
| `knowledge/notes-plan-prompt.md` | *Internal (folder mode).* Surveys a topic folder, does the `en`/`es` sync, and writes the ordered **worklist** — no note prose. | `notes/{topic}/coverage.md`, the topic's notes (en + es), `future-learning.md` | `en`/`es` structure, `future-learning.md`, `notes-worklist.md` |
| `knowledge/notes-write-prompt.md` | *Internal (author).* Deep, high-standard work on **one** file: resolve TODOs, complete it, mirror to `es/`, self-check gate. | `_note-quality-standard.md`, the one file (en + es), sibling files, `PROGRESS.md` | that one `notes/*.md` + its `es/*.md`, the `CLAUDE.md` counter |
| `knowledge/notes-review-prompt.md` | *Internal (reviewer).* Independent second-pass auditor for **one** file: fixes what falls short in `en/` + `es/`, then marks the row and commits (unless dry-run). | `_note-quality-standard.md`, the one file (en + es), sibling files | the audited `notes/*.md` + `es/*.md`, the worklist checkbox, one atomic commit |
| `knowledge/interview-prep-by-topic-prompt.md` | Builds and audits the **interview Q&A** for one topic (priority markers, question types, en/es sync). | `notes/{topic}/coverage.md`, `interview-prep/en/` + `es/` | `interview-prep/en/{file}.md` + `es/{file}.md` |
| `knowledge/notes-and-interview-prep-prompt.md` | Closes gaps **between** notes and Q&A in both directions (every note concept has a question, every question has a note). Run after the two above. | the topic notes + `interview-prep/en/` + `es/` | the topic `notes/*.md` and `interview-prep/en/` + `es/`, `CLAUDE.md` counter |

### Projects — plan, document, review

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `projects/new-project-prompt.md` | `new` mode: gap-analyses PROGRESS vs coverage, picks the next project, writes a full PLANNING.md. `review` mode: audits an existing PLANNING.md. | `PROGRESS.md`, `notes/coverage.md`, `ROADMAP.md`, last project's `PLANNING.md` | `{project}/PLANNING.md`; adds a row to `PROGRESS.md`; marks the choice in `ROADMAP.md` |
| `projects/readme-review-prompt.md` | The single source of README rules; writes/fixes every README section. Run before review and portfolio gate. | `{project}/PLANNING.md`, the existing README(s) | `{project}/README.md` (+ `backend/README.md`, `frontend/README.md` for full-stack) |
| `projects/project-review-prompt.md` | Reviews code quality, patterns, and learning objectives against the plan; writes improvement tasks. | `{project}/PLANNING.md`, the source code, `PROJECT-BACKLOG.md` | `PROJECT-BACKLOG.md` (per-project task list + "Last reviewed" date) |

### Practice — active recall and timed tests (daily blocks)

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `practice/sql-exercises-prompt.md` | `practice` mode: generates SQL exercises by topic. `review` mode: grades my answers and scores them. | `notes/sql/coverage.md`, `PROGRESS.md`, `sql/{topic}/exercises.sql` | `sql/{topic}/exercises.sql`; the SQL table in `PROGRESS.md`; `interview-prep/en/sql.md` + `es/sql.md` |
| `practice/simulation-generator-prompt.md` | Creates new timed test specs (Angular / Spring Boot / SQL) in the existing format — the producer for the simulation bank. | `simulations/{type}/` (existing specs), `simulations/TRACKER.md` | new `simulations/{type}/NN-*.md`; rows + counts in `simulations/TRACKER.md` |
| `practice/simulation-review-prompt.md` | Grades a finished timed simulation, gives a 3-score ideal solution, adds interview questions. `hint` mode guides mid-test. | the simulation spec in `simulations/{type}/`, `simulations/TRACKER.md`, + my pasted code | `simulations/TRACKER.md`, the spec's header, `interview-prep/en/{topic}.md` + `es/{topic}.md` |
| `practice/code-review-prompt.md` | Generates a flawed snippet (often AI-style) for me to critique, then grades what I found / missed / over-flagged. Trains the stage-3 code-review step. | (snippet generated fresh; no spec file needed) | `interview-prep/en/{type}.md` + `es/{type}.md` (questions for my gaps) |
| `practice/simulator-prompt.md` | Runs a live mock **technical** interview from my Q&A bank, scores each answer, tracks weak areas across sessions. | `interview-prep/{lang}/*.md`, `interview-prep/projects/*`, `interview-prep/SESSION-LOG.md` | `interview-prep/SESSION-LOG.md` |
| `practice/hr-screen-prompt.md` | Runs a live mock **HR** call (stage 2): motivation, career-change story, availability, salary, "why us". Non-technical. | profile + situation from `_shared-context.md`, `ROADMAP.md` | optional `interview-prep/hr-screen.md` (polished answers) |

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
  `notes-audit`, `interview-prep-by-topic`, `notes-and-interview-prep`, `new-project`,
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
  `notes-and-interview-prep`, `simulation-review`, `sql-exercises`, `code-review` → read by `simulator`.
- **`interview-prep/projects/*.md`** — written by `portfolio-ready` → read by `simulator`.
- **`simulations/{type}/NN-*.md`** (the test specs) — written by `simulation-generator` (and the
  original bank by hand) → read by `simulation-review` (and by me, to take the test).
- **`simulations/TRACKER.md`** — written by `simulation-generator` (new rows) and `simulation-review`
  (status) → read by `progress-update` and by `simulation-review` itself (recurring-weakness check).
- **`interview-prep/SESSION-LOG.md`** — written and read by `simulator` (tracks weak areas between
  sessions).
- **`interview-prep/hr-screen.md`** — optionally written by `hr-screen` (polished stage-2 answers).

Pipeline view:

```
coverage-prompt / coverage-audit ─► notes/coverage.md
        │
        ├─► notes-audit (folder|file) ─► [plan] → per file: author + reviewer subagents ─► notes/*.md ─┐
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
2. `notes-audit` (`SCOPE = folder` for a whole topic, `SCOPE = file` for one file — hands-off,
   author + reviewer per file), then `interview-prep-by-topic` — build both sides
3. `notes-and-interview-prep` — close the gaps between them
4. (after all topics have coverage) `coverage-audit` — global convergence pass
5. `roadmap-review` — check the plan still reflects reality

**Applying**
1. `portfolio-ready` on each finished project (produces cv-bullets)
2. `cv-prompt` → one-page CV · `linkedin-prompt` → profile + posts

---

## Batch mode — run a prompt on every target at once

Per-target prompts (one topic / file / project / type at a time) also accept **`all`** in their
target field, so you don't have to run them folder by folder. Set the field to `all` and the prompt
processes every target in order, one commit per target. Full rules: `notes/prompts/_batch-mode.md`.

- **Supports `all`:** `coverage-prompt`, `notes-audit` (`SCOPE = folder`, `TOPIC = all`), `interview-prep-by-topic`,
  `notes-and-interview-prep` (`TOPIC`/`FILE = all`); `readme-review`, `project-review`,
  `portfolio-ready` (`PROJECT_PATH = all`); `new-project` (`PROJECT = all`, **review mode only**);
  `sql-exercises` (`TOPIC = all`, **practice mode only**),
  `simulation-generator`, `code-review` (`TYPE = all`).
- **Already global (no `all` needed):** `coverage-audit`, `progress-update`, `roadmap-review`, `cv`,
  `linkedin`, and `simulator` full mode — these cover everything in one run by design.
- **Single-shot (not batchable):** `simulation-review` and `hr-screen` — each needs your pasted code
  or a live back-and-forth, so they run one at a time.

---

## Gaps — closed, and what is left

The three gaps detected against the goal (junior Angular + Spring Boot at a Spanish consultancy by
Aug–Sep 2026, per the market analysis in `_shared-context.md`) are now **built**:

- ✅ **`practice/code-review-prompt.md`** — trains the stage-3 code-review step (critique a flawed,
  often AI-style snippet). Was the biggest blind spot: nothing else hands me broken code to review.
- ✅ **`practice/simulation-generator-prompt.md`** — produces new timed test specs in the existing
  format, so the bank is no longer fixed at 15 and I can drill a weak type on demand.
- ✅ **`practice/hr-screen-prompt.md`** — covers the non-technical stage-2 HR call (motivation,
  career-change story, availability, salary), which only had a one-line touch in `simulator`.

Still intentionally **not** a prompt:
- **Application tracker** — a simple file plus the ROADMAP applications section already cover this;
  a dedicated prompt would be overhead.
- **English / Cambridge prep** — tracked in a separate private repo, out of scope for this folder.
