# Prompts — the study system

All prompts live in `notes/prompts/`, grouped by purpose. **They run in separate conversations,
never in the main daily session** — you fill in the configuration block at the top of a prompt,
paste it into a fresh chat, and it does one job. Update the project list inside each prompt as new
projects are completed.

> **▶ Run first.** Every runnable prompt opens with a `▶ Run first` line naming the prompt you must run
> before it (or `nothing`). You never have to cross-check the dependency map below before running one —
> the prompt tells you at the top.

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
| `notes/coverage.md` | **what I must learn** | `coverage-prompt`, `coverage-audit-prompt` | notes/interview-prep audits, `plan-audit`, `roadmap-review`, `sql-exercises` |
| `PROGRESS.md` | **what I have learned** | `progress-update-prompt` (+ Claude per step in session) | `plan-audit`, `roadmap-review`, `portfolio-audit`, `cv`, `linkedin`, `sql-exercises` |
| `{project}/PLANNING.md` | **what a project builds** | `plan-audit` | `readme-review`, `review-audit`, `portfolio-audit`, `progress-update`, `roadmap-review` |

---

## The prompts — what each one reads and generates

### Knowledge — build and audit study content

| Prompt | What it does | Reads (besides CLAUDE.md + _shared-context) | Generates / updates |
|--------|--------------|----------------------------------------------|---------------------|
| `knowledge/coverage/_coverage-standard.md` | *Internal.* The **shared coverage standard** both coverage prompts read (scope logic, three item types, confusable pairs, AI factor, item/file format, the job-target-is-the-source rule). Not runnable. | — | — |
| `knowledge/coverage/coverage-prompt.md` | Defines the required scope for **one** topic — what a junior must know, what is deferred. Two subagents bracket the generation: a **deep market-analysis subagent** (Step 2, web-backed, anchored to Victor's objectives — the primary source) and an **adversarial interviewer subagent** (Step 4a) to hunt missing items; real postings complement the analysis. | `_coverage-standard.md`, `ROADMAP.md`, `_job-market-evidence.md`, the topic's note files, `future-learning.md` | `notes/{topic}/coverage.md`, syncs `notes/coverage.md`, updates `future-learning.md` |
| `knowledge/coverage/coverage-audit-prompt.md` | **Global** convergence pass over all of `notes/coverage.md`; runs a **market-fit check** (Step 2b): a deep analysis of what the target junior market asks (primary), complemented by the job-market evidence, to keep coverage matched to the market — fills gaps, fixes item quality, can add a whole new topic folder (e.g. testing, docker). Run once after every topic has a coverage file. | `_coverage-standard.md`, `notes/coverage.md`, every `notes/{topic}/coverage.md`, `notes/prompts/_job-market-evidence.md`, `ROADMAP.md` | `notes/coverage.md` + each topic `coverage.md`, `future-learning.md` files; may create `notes/{topic}/` |
| `knowledge/coverage/evidence-intake-prompt.md` | Nourishes `notes/prompts/_job-market-evidence.md`: `paste` mode adds full offers you provide, `search` mode web-searches a batch of current Spanish junior postings; both append Raw-posting blocks, re-tally the Synthesis, and commit. Run it whenever you see real postings. | `_job-market-evidence.md`, `_coverage-standard.md`, `ROADMAP.md` | `notes/prompts/_job-market-evidence.md` |
| `knowledge/notes/notes-audit.md` | **THE entry point — the only notes prompt you launch.** Runs **inside Claude Code**, hands-off. `SCOPE = folder` audits/completes a whole topic; `SCOPE = file` audits one file. Every file is authored then reviewed by two cold subagents before an atomic commit. `DRY_RUN` stages without committing. | its four internal pieces (below) | every built `notes/*.md` + `es/*.md`, one atomic commit per file |
| `knowledge/notes/_note-quality-standard.md` | *Internal.* The **shared writing standard** every piece reads (format modes, rule 3, signature elements, anticipate-the-TODO). Not runnable. | — | — |
| `knowledge/notes/notes-plan-prompt.md` | *Internal (folder mode).* Surveys a topic folder, does the `en`/`es` sync, and writes the ordered **worklist** — no note prose. | `notes/{topic}/coverage.md`, the topic's notes (en + es), `future-learning.md` | `en`/`es` structure, `future-learning.md`, `notes-worklist.md` |
| `knowledge/notes/notes-write-prompt.md` | *Internal (author).* Deep, high-standard work on **one** file: resolve TODOs, complete it, mirror to `es/`, self-check gate. | `_note-quality-standard.md`, the one file (en + es), sibling files, `PROGRESS.md` | that one `notes/*.md` + its `es/*.md`, the `CLAUDE.md` counter |
| `knowledge/notes/notes-review-prompt.md` | *Internal (reviewer).* Independent second-pass auditor for **one** file: fixes what falls short in `en/` + `es/`, then marks the row and commits (unless dry-run). | `_note-quality-standard.md`, the one file (en + es), sibling files | the audited `notes/*.md` + `es/*.md`, the worklist checkbox, one atomic commit |
| `knowledge/interview-prep/interview-prep-audit.md` | **THE entry point — the only interview-prep prompt you launch.** Runs **inside Claude Code**, hands-off. Builds/audits the **interview Q&A** for one topic (or `all`) via a **four-stage cold-subagent pipeline per topic**: market-analysis (M, web-backed real interview questions) → author (A) → adversarial gap-hunt (G) → reviewer (B, adds gaps + commits). `DRY_RUN` stages without committing. | its internal pieces (below), `notes/{topic}/coverage.md`, `_job-market-evidence.md`, `interview-prep/en/` + `es/` | `interview-prep/en/{file}.md` + `es/{file}.md`, one atomic commit per topic |
| `knowledge/interview-prep/_interview-prep-standard.md` | *Internal.* The **shared Q&A standard** the author, reviewer, and cross-reference prompts read (question types + ratio, priority markers, question format, the answer quality bar — realistic/well-worded/Victor's voice, real cited code from his projects, bilingual contract, existing-content-is-final, section-complete). Not runnable. | — | — |
| `knowledge/interview-prep/interview-prep-write-prompt.md` | *Internal (author).* Full audit of **one** topic: en/es sync, resolve TODOs, coverage check, priority markers, format, and the four audit sections. Does not commit. | `_interview-prep-standard.md`, `notes/{topic}/coverage.md`, `interview-prep/en/` + `es/` | `interview-prep/en/{file}.md` + `es/{file}.md` (working tree) |
| `knowledge/interview-prep/interview-prep-review-prompt.md` | *Internal (reviewer).* Independent second pass on **one** topic: enforces realistic, well-worded, Victor's-voice questions; fixes what falls short in `en/` + `es/`, then commits (unless dry-run). | `_interview-prep-standard.md`, `interview-prep/en/` + `es/` | the audited `interview-prep/*.md`, one atomic commit |
| `knowledge/interview-prep/notes-and-interview-prep-prompt.md` | Closes gaps **between** notes and Q&A in both directions (every note concept has a question, every question has a note). Run after the two above. | the topic notes + `interview-prep/en/` + `es/` | the topic `notes/*.md` and `interview-prep/en/` + `es/`, `CLAUDE.md` counter |

### Projects — plan, document, review

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `projects/plan/plan-audit.md` | **THE entry point — the only project-plan prompt you launch.** Runs **inside Claude Code**, hands-off. `new` mode plans the next project (gap-analyses PROGRESS vs coverage, picks it, writes a full PLANNING.md) then an independent reviewer subagent audits and fixes it before it commits; `review` mode audits an existing PLANNING.md (one project or `all`). `DRY_RUN` stages without committing. | its three internal pieces (below) | `{project}/PLANNING.md`; adds a row to `PROGRESS.md`; marks the choice in `ROADMAP.md`; one atomic commit |
| `projects/plan/_planning-standard.md` | *Internal.* The **shared PLANNING.md contract** both the author and reviewer read (the 23-section template + what makes each pass, done-condition formats, HTTP status conventions, professional implementation order, branch-strategy rules, consistency invariants, the two project formats). Not runnable. | — | — |
| `projects/plan/plan-write-prompt.md` | *Internal (author, new mode).* Gap-analyses, chooses the next project, designs it, and writes the complete PLANNING.md to the standard + the ROADMAP/PROGRESS edits. Does not commit. | `_planning-standard.md`, `PROGRESS.md`, `notes/coverage.md`, `ROADMAP.md`, last project's `PLANNING.md` | `{project}/PLANNING.md`, `ROADMAP.md`, `PROGRESS.md` (working tree) |
| `projects/plan/plan-review-prompt.md` | *Internal (reviewer).* Independent second pass on one plan: audits against the standard, fixes what falls short directly, then commits (unless dry-run). Used by both modes — subagent B in new mode, the sole doer in review mode. | `_planning-standard.md`, `{project}/PLANNING.md`, `PROGRESS.md` | the audited `PLANNING.md`, one atomic commit |
| `projects/readme/readme-review-prompt.md` | The single source of README rules; writes/fixes every README section. Run before the portfolio gate (`portfolio-audit` reads the READMEs; `review-audit` does not). | `{project}/PLANNING.md`, the existing README(s) | `{project}/README.md` (+ `backend/README.md`, `frontend/README.md` for full-stack) |
| `projects/review/review-audit.md` | **THE entry point — the only project-review prompt you launch.** Runs **inside Claude Code**, hands-off. Reviews a built project against its PLANNING.md: fans out a **code-quality + learning-objectives** subagent and (full-stack) a **cold attacker-hat security** subagent, then merges their findings into the backlog. **Not auto-committed** — writes the backlog and hands Victor the commit (project-folder file, feature-branch workflow). | its three internal pieces (below) | `PROJECT-BACKLOG.md` (per-project task list + "Last reviewed" date) |
| `projects/review/_review-standard.md` | *Internal.* The **shared review contract** all pieces read (the two project formats, 30-day gate, scope limit, the full code-quality checklist with bad-vs-good examples, the security scope, the learning-objectives rubric, the task/priority/effort + backlog format). Not runnable. | — | — |
| `projects/review/review-code-prompt.md` | *Internal (code reviewer).* Reads the source once and returns a code-quality findings table + the learning-objectives verdict. Does not write the backlog or commit. | `_review-standard.md`, `{project}/PLANNING.md`, the source code | findings tables (returned to the orchestrator) |
| `projects/review/review-security-prompt.md` | *Internal (security reviewer, full-stack only).* Adversarial attacker-hat pass against `notes/security/coverage.md` and the real backend; returns a findings table (each a High backlog task). Does not edit or commit. | `_review-standard.md`, `notes/security/coverage.md`, `{project}/PLANNING.md`, `{project}/backend` | findings table (returned to the orchestrator) |
| `projects/portfolio/portfolio-audit.md` | **THE entry point — the only portfolio prompt you launch.** Runs **inside Claude Code**, hands-off. The final go/no-go gate per project (last link in the per-project chain): an author + cold-reviewer subagent pair build the project-specific interview-question bank, then the orchestrator computes the verdict and (if not ❌) writes the CV bullet + GitHub description. `DRY_RUN` stages without committing. | its three internal pieces (below) | `interview-prep/projects/{project}.md`, `notes/cv/cv-bullets.md`, one atomic commit |
| `projects/portfolio/_portfolio-standard.md` | *Internal.* The **shared portfolio-gate contract** all three pieces read (what the gate is for, the two-check verdict logic, the interview-question quality bar + file template, the CV-bullet and GitHub-description formats, the two project formats). Not runnable. | — | — |
| `projects/portfolio/portfolio-write-prompt.md` | *Internal (author).* Reads the project's real code + PLANNING.md and writes the exhaustive project-specific interview-question bank to the standard. Does not compute the verdict or commit. | `_portfolio-standard.md`, `{project}/PLANNING.md`, README(s), code, tests, `ROADMAP.md` | `interview-prep/projects/{project}.md` (working tree) |
| `projects/portfolio/portfolio-review-prompt.md` | *Internal (reviewer).* Independent second pass on the question bank: hunts thin/weak/duplicate questions against the real code, fixes them directly. Does not commit (the orchestrator bundles the commit). | `_portfolio-standard.md`, the question bank, the project source | the audited `interview-prep/projects/{project}.md` |

### Practice — active recall and timed tests (daily blocks)

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `practice/sql-exercises-prompt.md` | `practice` mode: generates SQL exercises by topic. `review` mode: grades my answers and scores them. | `notes/sql/coverage.md`, `PROGRESS.md`, `sql/{topic}/exercises.sql` | `sql/{topic}/exercises.sql`; the SQL table in `PROGRESS.md`; `interview-prep/en/sql.md` + `es/sql.md` |
| `practice/simulation-generator-prompt.md` | Creates new timed test specs (Angular / Spring Boot / SQL) in the existing format — the producer for the simulation bank. | `simulations/{type}/` (existing specs), `simulations/TRACKER.md` | new `simulations/{type}/NN-*.md`; rows + counts in `simulations/TRACKER.md` |
| `practice/simulation-review-prompt.md` | Grades a finished timed simulation, gives a 3-score ideal solution, adds interview questions. `hint` mode guides mid-test. | the simulation spec in `simulations/{type}/`, `simulations/TRACKER.md`, + my pasted code | `simulations/TRACKER.md`, the spec's header, `interview-prep/en/{topic}.md` + `es/{topic}.md` |
| `practice/code-review-prompt.md` | Generates a flawed snippet (often AI-style) for me to critique, then grades what I found / missed / over-flagged. Trains the stage-3 code-review step. | (snippet generated fresh; no spec file needed) | `interview-prep/en/{type}.md` + `es/{type}.md` (questions for my gaps) |
| `practice/simulator-prompt.md` | Runs a live mock **technical** interview from my Q&A bank, scores each answer, tracks weak areas across sessions. | `interview-prep/{lang}/*.md`, `interview-prep/projects/*`, `interview-prep/SESSION-LOG.md` | `interview-prep/SESSION-LOG.md` |
| `practice/hr-screen-prompt.md` | Runs a live mock **HR** call (stage 2): motivation, career-change story, availability, salary, "why us". Non-technical. | profile + situation from `_shared-context.md`, `ROADMAP.md` | optional `interview-prep/hr-screen.md` (polished answers) |

### Strategy — keep the plan accurate (`tracking/`) and apply (`apply/`)

Two sub-purposes, two subfolders. `tracking/` keeps the hub files (`PROGRESS.md`, `ROADMAP.md`)
accurate; `apply/` produces the job-application material.

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `strategy/tracking/_concept-extraction-standard.md` | *Internal.* The Format A/B/C **concept-extraction contract** each per-project subagent runs when `progress-update` fans out. Not runnable. | — | — |
| `strategy/tracking/progress-update-prompt.md` | Rebuilds PROGRESS.md from reality — an orchestrator that fans out one cold subagent per project (+ SQL, + simulations), then merges. Run before `plan-audit`. | `_concept-extraction-standard.md`, all `PLANNING.md` files, `sql/`, `simulations/TRACKER.md` | `PROGRESS.md` |
| `strategy/tracking/_roadmap-standard.md` | *Internal.* The **shared roadmap contract** `roadmap-review` reads: what ROADMAP is vs PROGRESS/coverage, stable vs living sections, gate-based sequencing (no dates), canonical study-block orders. Not runnable. | — | — |
| `strategy/tracking/roadmap-review-prompt.md` | Keeps ROADMAP forward-looking and gate-based (no stale dates); checks project sequence and study-block tables vs coverage. **Orchestrator:** the doer applies edits, then a cold reviewer subagent re-verifies the invariants (date scan, LeetCode gate, study-block sync) and fixes ROADMAP. | `_roadmap-standard.md`, `notes/coverage.md`, `PROGRESS.md`, the active `PLANNING.md` | `ROADMAP.md` |
| `strategy/apply/_application-standard.md` | *Internal.* The **shared job-application standard** both `cv` and `linkedin` read: expert stance, sources (incl. the existing CV in `personal/CV`), bullet format, ATS/skills keyword pool, Spanish voice rules, defensibility rule, project-selection heuristic. Not runnable. | — | — |
| `strategy/apply/cv-prompt.md` | `create` / `review` / `tailor` the one-page Spanish CV (ATS-checked). `tailor` adapts it to a pasted job offer with a `HAVE / PARTIAL / MISSING` gap analysis, and feeds that offer into the job-market evidence. | `_application-standard.md`, `PROGRESS.md`, `ROADMAP.md`, `notes/cv/cv-bullets.md`, the existing CV in `personal/CV/` | Saves the CV to `personal/CV/` **outside the repo** (never committed): `master/` for create/review, `applications/` for tailor. `tailor` also appends the posting to `notes/prompts/_job-market-evidence.md` |
| `strategy/apply/linkedin-prompt.md` | Drafts every LinkedIn section + 3 posts, ready to paste. | `_application-standard.md`, `PROGRESS.md`, `ROADMAP.md` | **Output only** — LinkedIn text (not stored in the repo) |

---

## How the prompts feed each other

The key thing to understand: **several prompts consume files that other prompts generate.** If a
producer has not run (or is stale), its consumers produce wrong results. Run producers first.

Each generated file, with who writes it and who depends on it:

- **`notes/coverage.md`** — written by `coverage-prompt` / `coverage-audit-prompt` → read by
  `notes-audit`, `interview-prep-audit`, `notes-and-interview-prep`, `plan-audit`,
  `roadmap-review`, and `sql-exercises` (SQL section). *Coverage is the root — almost everything
  downstream assumes it is correct.*
- **`notes/prompts/_job-market-evidence.md`** — written by `evidence-intake` (dedicated intake) and
  `cv-prompt` (tailor mode, as it tailors to each offer) → read by `coverage-prompt`, `coverage-audit`,
  and both their subagents, plus `interview-prep-audit`'s market-analysis stage. *Real postings that
  anchor coverage and the interview Q&A to the market.*
- **`PROGRESS.md`** — written by `progress-update` (and by Claude after each step in the daily
  session) → read by `plan-audit`, `roadmap-review`, `portfolio-audit`, `cv`, `linkedin`,
  `sql-exercises`. *Stale PROGRESS = wrong gap analysis in `plan-audit` and `roadmap-review`.*
- **`{project}/PLANNING.md`** — written by `plan-audit` (new mode) → read by `readme-review`,
  `review-audit`, `portfolio-audit`, `progress-update`, `roadmap-review`. *It is the contract
  the whole project is checked against.*
- **`PROJECT-BACKLOG.md`** — written by `review-audit` → read by `portfolio-audit` (open
  High/Medium tasks block the "ready" verdict).
- **`notes/cv/cv-bullets.md`** — written by `portfolio-audit` → read by `cv-prompt` (one polished
  bullet per project, reused as-is).
- **`interview-prep/en/*.md` + `es/*.md`** — written by `interview-prep-audit`,
  `notes-and-interview-prep`, `simulation-review`, `sql-exercises`, `code-review` → read by `simulator`.
- **`interview-prep/projects/*.md`** — written by `portfolio-audit` → read by `simulator`.
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
        ├─► interview-prep-audit ─► interview-prep/*.md ─┐
        │        └─ notes-and-interview-prep keeps both in sync
        │                                                   │
        ▼                                                   ▼
progress-update ─► PROGRESS.md ─► plan-audit ─► {project}/PLANNING.md   simulator
                        ▲                              │                  ▲ (reads Q&A)
                        │            ┌─────────────────┼───────────────┐ │
                        │            ▼                 ▼               ▼ │
                        │     readme-review     review-audit   portfolio-audit
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
2. `plan-audit` (`MODE = new`) — plan it, get PLANNING.md (author + reviewer, hands-off)
3. build it, step by step (daily sessions)
4. `readme-review` — fix the README(s) after each big feature
5. `review-audit` — code review when the project is complete
6. `portfolio-audit` — final gate before adding it to CV/LinkedIn

**Auditing knowledge (one topic)**
1. `coverage-prompt` — define/refresh the topic's coverage
2. `notes-audit` (`SCOPE = folder` for a whole topic, `SCOPE = file` for one file — hands-off,
   author + reviewer per file), then `interview-prep-audit` — build both sides
3. `notes-and-interview-prep` — close the gaps between them
4. (after all topics have coverage) `coverage-audit` — global convergence pass
5. `roadmap-review` — check the plan still reflects reality

**Applying**
1. `portfolio-audit` on each finished project (produces cv-bullets)
2. `cv-prompt` → one-page CV · `linkedin-prompt` → profile + posts

---

## Batch mode — run a prompt on every target at once

Per-target prompts (one topic / file / project / type at a time) also accept **`all`** in their
target field, so you don't have to run them folder by folder. Set the field to `all` and the prompt
processes every target in order, one commit per target. Full rules: `notes/prompts/_batch-mode.md`.

- **Supports `all`:** `coverage-prompt`, `notes-audit` (`SCOPE = folder`, `TOPIC = all`), `interview-prep-audit`,
  `notes-and-interview-prep` (`TOPIC`/`FILE = all`); `readme-review`, `review-audit`,
  `portfolio-audit` (`PROJECT_PATH = all`); `plan-audit` (`PROJECT = all`, **review mode only**);
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
