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

## Prompts you launch vs. internal pieces you never touch

Every file in this folder is a `.md` prompt, but **not every file is something you run.** One rule
tells them apart, and it is the filename:

> **A leading `_` means "never launch this".** No underscore, and it is yours to run.

**In the four families with three or more internal pieces those files also live in an `_internal/`
subfolder** — `knowledge/notes/`, `knowledge/coverage/`, `practice/sql/`, `projects/plan/`. Open one
and you see the runnable prompt(s) and one folder, instead of eight files you have to read prefixes to
tell apart. The `_` prefix stays on the filenames anyway, so a file keeps its marking if it is ever
moved or quoted out of context. Families with only two internals keep them alongside: a folder for two
files hides more than it explains.

**Inside Claude Code you do not need the rule at all: type `/` and the list is the answer.** Every
runnable prompt has a slash command and no internal file can have one, so the menu *is* the runnable
set — 24 commands in `.claude/commands/`, one per prompt, kept at parity (completed 2026-07-22; before
that only the 11 orchestrators had one, which made the menu look like the whole system when it was
under half of it). **Adding a runnable prompt means adding its command in the same commit.**

- **Runnable — you launch these.** Fill in the config block at the top, paste it into a fresh
  conversation, or just use its slash command. **24 files, listed below.**
- **Internal — a runnable prompt reads and executes these as its own step**; they never appear in your
  "paste into a new chat" workflow. Two kinds, both `_`-prefixed: **standards**
  (`_note-quality-standard.md`, `_review-standard.md`) — the shared rulebook a family of prompts reads
  — and **subagent steps** (`_notes-write-prompt.md`, `_plan-review-prompt.md`) — the author/reviewer
  slices an orchestrator (the `-audit.md` file in the same folder) fans out to automatically.

*(Made true on 2026-07-22: seventeen subagent steps were missing the prefix, so a folder like
`knowledge/notes/` looked like seven runnable prompts when only `notes-audit.md` is one.)*

### The 24 runnable prompts — each with a slash command of the same name

| Group | Prompts |
|---|---|
| Knowledge | `coverage-prompt`, `coverage-audit-prompt`, `evidence-intake-prompt`, `notes-audit`, `interview-prep-audit`, `notes-and-interview-prep-prompt` |
| Projects | `plan-audit`, `readme-audit`, `review-audit`, `portfolio-audit` |
| Practice | `sql-plan-audit`, `sql-exercises-prompt`, `simulation-generator-prompt`, `simulation-review-prompt`, `code-review-prompt`, `simulator-prompt`, `hr-screen-prompt` |
| Strategy | `progress-update-prompt`, `roadmap-review-prompt`, `cv-prompt`, `linkedin-prompt`, `cover-letter-prompt`, `profile-readme-prompt`, `tracker-prompt` |

Two flavors among these 24, both launched the same way (paste config into a new chat):
- **Hands-off orchestrators** — `notes-audit`, `interview-prep-audit`, `plan-audit`, `readme-audit`,
  `review-audit`, `portfolio-audit`, `progress-update-prompt`, `roadmap-review-prompt`, `coverage-audit-prompt`, `notes-and-interview-prep-prompt` — run entirely inside Claude Code and
  hand you a finished result (and, where noted, a commit) with no further input from you. Every
  orchestrator also ends by writing its folder's `_last-run-report.md` (self-report) — not repeated
  in each table row below.
- **Single-shot prompts** — everything else — do one job in one pass; some need you to paste
  something mid-conversation (your code into `simulation-review-prompt`, a job offer into
  `cover-letter-prompt`, etc.).

### The internal-only files (never launch these)

`_coverage-standard.md`, `_note-quality-standard.md`, `_interview-prep-standard.md`,
`_planning-standard.md`, `_readme-standard.md`, `_review-standard.md`, `_portfolio-standard.md`,
`_concept-extraction-standard.md`, `_roadmap-standard.md`, `_application-standard.md`,
`_sql-plan-standard.md`, `_sql-exercise-seeds.md`, `_sql-exercises-practice.md`,
`_sql-exercises-review.md`,
`_shared-context.md`, `_batch-mode.md`, `_job-market-evidence.md`,
`_pipeline-self-report.md` (the shared final step every orchestrator runs: five bullets on how the run
itself went, written to `_last-run-report.md` in the orchestrator's folder and auto-committed — the
evidence that decides whether a frozen prompt gets reopened), plus every
`_notes-plan-prompt.md` / `_notes-inspect-prompt.md` / `_notes-write-prompt.md` / `_notes-review-prompt.md` / `_notes-translate-prompt.md` / `_notes-review-es-prompt.md`,
`_interview-prep-write-prompt.md` / `_interview-prep-review-prompt.md`,
`_plan-write-prompt.md` / `_plan-architecture-prompt.md` / `_plan-review-prompt.md`,
`_readme-write-prompt.md` / `_readme-review-prompt.md`,
`_review-flow-prompt.md` / `_review-security-prompt.md`,
`_portfolio-write-prompt.md` / `_portfolio-review-prompt.md`.

---

## The three hub files

Everything orbits three sources of truth. Most prompts exist to write one of them or to consume one.

| Hub file | Source of truth for | Written by | Read by |
|----------|---------------------|------------|---------|
| `notes/coverage.md` | **what I must learn** | `coverage-prompt`, `coverage-audit-prompt` | notes/interview-prep audits, `plan-audit`, `roadmap-review`, `sql-exercises` |
| `PROGRESS.md` | **what I have learned** | `progress-update-prompt` (+ Claude per step in session) | `plan-audit`, `roadmap-review`, `portfolio-audit`, `cv`, `linkedin`, `sql-exercises` |
| `{project}/PLANNING.md` | **what a project builds** | `plan-audit` | `readme-audit`, `review-audit`, `portfolio-audit`, `progress-update`, `roadmap-review` |

---

## The prompts — what each one reads and generates

### Knowledge — build and audit study content

| Prompt | What it does | Reads (besides CLAUDE.md + _shared-context) | Generates / updates |
|--------|--------------|----------------------------------------------|---------------------|
| `knowledge/coverage/_coverage-standard.md` | *Internal.* The **shared coverage standard** both coverage prompts read (scope logic, three item types, confusable pairs, AI factor, item/file format, the job-target-is-the-source rule). Not runnable. | — | — |
| `knowledge/coverage/_cross-topic-inbox.md` | *Internal.* The **durable handoff** between coverage runs: when a run finds a gap owned by another topic, it files the item here under that topic instead of only mentioning it in a summary. Every coverage run reads its own heading at Step 1 and clears what it consumed; `coverage-audit` sweeps all headings. Not runnable. | — | — |
| `knowledge/coverage/_coverage-prompt-rationale.md` | *Internal.* The **evidence behind the rules** in `coverage-prompt.md` — each real run's failure, what it cost, and the worked example, as numbered `R-n` entries the prompt points at. Keeps the prompt executable while the history stays intact. Read an entry before weakening or skipping the rule it justifies; a run's self-report adds new entries here, never inline in the prompt. Not runnable. | — | — |
| `knowledge/coverage/coverage-prompt.md` | Defines the required scope for **one** topic — what a junior must know, what is deferred. Two subagents bracket the generation: a **deep market-analysis subagent** (Step 2, web-backed, anchored to Victor's objectives — the primary source) and an **adversarial interviewer subagent** (Step 4a) to hunt missing items; real postings complement the analysis. | `_coverage-standard.md`, `ROADMAP.md`, `_job-market-evidence.md`, the topic's note files, `future-learning.md` | `notes/{topic}/coverage.md`, syncs `notes/coverage.md`, updates `future-learning.md` |
| `knowledge/coverage/coverage-audit-prompt.md` | **Global** convergence pass over all of `notes/coverage.md`; runs a **market-fit check** (Step 2b): a deep analysis of what the target junior market asks (primary), complemented by the job-market evidence, to keep coverage matched to the market — fills gaps, fixes item quality, and **detects** missing topics (e.g. testing, docker), delegating their authoring to `coverage-prompt`. Runs as a hands-off orchestrator (analysts A/B/C/D as cold subagents). Run once after every topic has a coverage file. | `_coverage-standard.md`, `notes/coverage.md`, every `notes/{topic}/coverage.md`, `notes/prompts/_job-market-evidence.md`, `ROADMAP.md` | `notes/coverage.md` + each topic `coverage.md`, `future-learning.md` files; flags new topics for `coverage-prompt` |
| `knowledge/coverage/evidence-intake-prompt.md` | Nourishes `notes/prompts/_job-market-evidence.md`: `paste` mode adds full offers you provide, `search` mode web-searches a batch of current Spanish junior postings; both append Raw-posting blocks, re-tally the Synthesis, and commit. Run it whenever you see real postings. | `_job-market-evidence.md`, `_coverage-standard.md`, `ROADMAP.md` | `notes/prompts/_job-market-evidence.md` |
| `knowledge/notes/notes-audit.md` | **THE entry point — the only notes prompt you launch.** Runs **inside Claude Code**, hands-off. `SCOPE = folder` audits/completes a whole topic; `SCOPE = file` audits one file. Existing files are quality-flagged one cold subagent each, then every file goes through four cold stages — English author (A) → English reviewer (B) → translator en→es (T) → `en/`-blind Spanish reviewer (C) — with `en/` as the canonical source, then committed (one atomic commit per file, made by C). | its seven internal pieces (below) | every built `notes/*.md` + `es/*.md`, one atomic commit per file |
| `knowledge/notes/_note-quality-standard.md` | *Internal.* The **shared writing standard** every piece reads (format modes, rule 3, signature elements, anticipate-the-TODO). Not runnable. | — | — |
| `knowledge/notes/_notes-plan-prompt.md` | *Internal (folder mode).* Surveys a topic folder, does the `en`/`es` sync, and writes the ordered **worklist** — no note prose. | `notes/{topic}/coverage.md`, the topic's notes (en + es), `future-learning.md` | `en`/`es` structure, `future-learning.md`, `notes-worklist.md` |
| `knowledge/notes/_notes-inspect-prompt.md` | *Internal (quality inspector, folder mode).* Judges **one** pre-existing file against the standard — read-only on prose — and appends `fix-quality` / `add-docs-link` rows to the worklist. Never fixes, never batches. | `_note-quality-standard.md`, the one file (en + es), sibling headings | `notes-worklist.md` rows |
| `knowledge/notes/_notes-write-prompt.md` | *Internal (stage A — English author).* Deep, high-standard work on **one `en/`** file: resolve TODOs (reading `es/` only for markers), complete it, self-check. Writes English only — never the `es/`. Does **not** commit. | `_note-quality-standard.md`, the one `en/` file, sibling files, `PROGRESS.md` | that one `en/*.md`, the `CLAUDE.md` counter |
| `knowledge/notes/_notes-review-prompt.md` | *Internal (stage B — English reviewer).* Independent auditor for **one `en/`** file: fixes what falls short in English. The `es/` does not exist yet. Never touches `es/`, never commits. | `_note-quality-standard.md`, the one `en/` file, sibling files | the audited `en/*.md` |
| `knowledge/notes/_notes-translate-prompt.md` | *Internal (stage T — translator).* Takes the finished, canonical `en/` file and produces/re-syncs its `es/` counterpart: exact structural parity, native-Spanish prose, clears leftover `es/` TODO markers. Does not change the English, does not commit. | the canonical `en/` file, the existing `es/` (if any), `_note-quality-standard.md` | that one `es/*.md` |
| `knowledge/notes/_notes-review-es-prompt.md` | *Internal (stage C — Spanish reviewer, `en/`-blind).* Reads **only** the `es/` file, judges it as a standalone native-Spanish text, fixes calque/flow, then marks the row and commits. Never opens the `en/`. | `_note-quality-standard.md`, the one `es/` file, sibling `es/` files | the `es/*.md`, the worklist checkbox, one atomic commit |
| `knowledge/interview-prep/interview-prep-audit.md` | **THE entry point — the only interview-prep prompt you launch.** Runs **inside Claude Code**, hands-off. Builds/audits the **interview Q&A** for one topic (or `all`): light whole-topic detection — market-analysis (M, web-backed) + adversarial gap-hunt (G) — then **one cold author (A) + one cold reviewer (B) per SECTION**, with a trace/slice acceptance gate; only the orchestrator commits, once per topic. `DRY_RUN` stages without committing. | its internal pieces (below), `notes/{topic}/coverage.md`, `_job-market-evidence.md`, `interview-prep/en/` + `es/` | `interview-prep/en/{file}.md` + `es/{file}.md`, one atomic commit per topic |
| `knowledge/interview-prep/_interview-prep-standard.md` | *Internal.* The **shared Q&A standard** the author, reviewer, and cross-reference prompts read (question types + ratio, priority markers, question format, the answer quality bar — realistic/well-worded/Victor's voice, real cited code from his projects, bilingual contract, studied-content-is-final via the `[x]` marker, section-complete). Not runnable. | — | — |
| `knowledge/interview-prep/_interview-prep-write-prompt.md` | *Internal (author).* Full audit of **one** topic: en/es sync, resolve TODOs, coverage check, priority markers, format, and the four audit sections. Does not commit. | `_interview-prep-standard.md`, `notes/{topic}/coverage.md`, `interview-prep/en/` + `es/` | `interview-prep/en/{file}.md` + `es/{file}.md` (working tree) |
| `knowledge/interview-prep/_interview-prep-review-prompt.md` | *Internal (reviewer).* Independent second pass on **one** section/topic: enforces realistic, well-worded, Victor's-voice questions with real anchors; rewrites only unmarked (non-`[x]`) content, fixes what falls short in `en/` + `es/`; commits only on standalone runs (under the orchestrator it leaves the tree). | `_interview-prep-standard.md`, `interview-prep/en/` + `es/` | the audited `interview-prep/*.md`, one atomic commit |
| `knowledge/interview-prep/notes-and-interview-prep-prompt.md` | Closes gaps **between** notes and Q&A in both directions (every note concept has a question, every question has a note). Run after the two above. | the topic notes + `interview-prep/en/` + `es/` | the topic `notes/*.md` and `interview-prep/en/` + `es/`, `CLAUDE.md` counter |

### Projects — plan, document, review

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `projects/plan/plan-audit.md` | **THE entry point — the only project-plan prompt you launch.** Runs **inside Claude Code**, hands-off. `new` mode plans the next project (gap-analyses PROGRESS vs coverage, picks it, writes a full PLANNING.md), runs an **architecture advisor** on §6/§3/§20, then audits it with **five cold specialist reviewers — one per concern** (architecture · data-model-api · rules-security · steps-tests · branches-coverage) before the orchestrator makes the single commit; `review` mode runs the same five specialists on an existing PLANNING.md (one project or `all`). Specialists never commit. `DRY_RUN` leaves everything in the working tree. | its four internal pieces (below) | `{project}/PLANNING.md`; adds a row to `PROGRESS.md`; marks the choice in `ROADMAP.md`; one atomic commit |
| `projects/plan/_planning-standard.md` | *Internal.* The **shared PLANNING.md contract** both the author and reviewer read (the 24-section template + what makes each pass, done-condition formats, HTTP status conventions, professional implementation order, branch-strategy rules, quality-gate rules, consistency invariants, the two project formats). Not runnable. | — | — |
| `projects/plan/_plan-write-prompt.md` | *Internal (author, new mode).* Gap-analyses, chooses the next project, designs it, and writes the complete PLANNING.md to the standard + the ROADMAP/PROGRESS edits. Does not commit. | `_planning-standard.md`, `PROGRESS.md`, `notes/coverage.md`, `ROADMAP.md`, last project's `PLANNING.md` | `{project}/PLANNING.md`, `ROADMAP.md`, `PROGRESS.md` (working tree) |
| `projects/plan/_plan-architecture-prompt.md` | *Internal (architecture advisor, new mode only).* Judges the drafted architecture (§6), the one new architectural concept (§3), and the tradeoffs (§20) against Victor's level and the coverage gaps; fixes over/under-engineering directly in those sections. Does not commit. | `_planning-standard.md` (its slice), `{project}/PLANNING.md` (§3/§6/§20), `PROGRESS.md` | the sharpened §3/§6/§20 (working tree) |
| `projects/plan/_plan-review-prompt.md` | *Internal (specialist reviewer).* Dispatched **once per concern** by the orchestrator (`SCOPE` = architecture · data-model-api · rules-security · steps-tests · branches-coverage): audits only its slice against the standard, fixes directly, returns a check-by-check trace. Never commits — the orchestrator owns the single commit (a standalone `SCOPE = all` run doesn't commit either). | `_planning-standard.md` (its slice), `{project}/PLANNING.md`, `PROGRESS.md` (architecture scope only) | the audited slice of `PLANNING.md` (working tree) |
| `projects/readme/readme-audit.md` | **THE entry point — the only readme prompt you launch.** Runs **inside Claude Code**, hands-off. Reviews and fixes a project's README(s) to the standard — for full-stack, one author + cold-reviewer subagent pair **per README** (global / backend / frontend). Run before the portfolio gate (`portfolio-audit` reads the READMEs; `review-audit` does not). **Not auto-committed** — hands Victor the commit (project-folder files). Ends with a **pipeline self-report** written to `projects/readme/_last-run-report.md` (auto-committed — prompt-system machinery): five bullets on how the run itself went (report discipline, trace verification, coherence, failure protocol), read later to decide if these prompts need changing. | its three internal pieces (below) | `{project}/README.md` (+ `backend/README.md`, `frontend/README.md` for full-stack), `projects/readme/_last-run-report.md` |
| `projects/readme/_readme-standard.md` | *Internal.* The **single source of README rules** every piece reads (the two project formats, quality filter, in-progress scan, the 12 global-README rules + section order, full-stack global additions, the backend 9 sections, the frontend 7 sections, the commit rule). Not runnable. | — | — |
| `projects/readme/_readme-write-prompt.md` | *Internal (author).* Writes/fixes **one** README (global \| backend \| frontend) to the standard's rules for that target. Does not commit. | `_readme-standard.md`, `{project}/PLANNING.md`, the existing README | that one README (working tree) |
| `projects/readme/_readme-review-prompt.md` | *Internal (reviewer).* Independent second pass on **one** README: audits against the standard (recruiter + interviewer lens), fixes what falls short directly. Does not commit. | `_readme-standard.md`, `{project}/PLANNING.md`, the README | the audited README |
| `projects/review/review-audit.md` | **THE entry point — the only project-review prompt you launch.** Runs **inside Claude Code**, hands-off. Reviews a built project against its PLANNING.md by **vertical slice**: it maps the resources/features, then fans out cold subagents **per slice** — a flow reviewer (quality + correctness + tests) and a security reviewer per backend resource, plus cross-cutting (`persistence-config`, `security-infra`), the frontend features + `frontend-infra`, and one learning-objectives pass — then merges every slice's findings into the backlog. **Not auto-committed** — writes the backlog and hands Victor the commit (project-folder file, feature-branch workflow). Ends with a **pipeline self-report** written to `projects/review/_last-run-report.md` (auto-committed — prompt-system machinery): five bullets on how the run itself went (slice mapping, report discipline, trace verification, dedup), read later to decide if these prompts need changing. | its internal pieces (below) | `PROJECT-BACKLOG.md` (per-project task list + "Last reviewed" date), `projects/review/_last-run-report.md` |
| `projects/review/_review-standard.md` | *Internal.* The **shared review contract** all pieces read (the two project formats, 30-day gate, scope limit, the full code-quality checklist with bad-vs-good examples, the security scope, the correctness scope + severity rule, the test-quality scope, the learning-objectives rubric, the task/priority/effort + backlog format). Not runnable. | — | — |
| `projects/review/_review-flow-prompt.md` | *Internal (per-slice functional reviewer).* Reviews **one vertical slice** — a backend resource's `model→repository→service→controller→DTO→tests` flow, a frontend feature, or a cross-cutting area (`persistence-config` / `frontend-infra`) — running quality + correctness + test lenses on it; returns a findings table + trace. Does not edit or commit. | `_review-standard.md`, `{project}/PLANNING.md`, that slice's source | findings table (returned to the orchestrator) |
| `projects/review/_review-security-prompt.md` | *Internal (per-slice security reviewer, full-stack only).* Attacker-hat pass on **one slice** — a backend resource's endpoints (authz/ownership/injection/data-exposure), or cross-cutting `security-infra` (SecurityConfig, JWT, CORS, hashing, secrets) — against `notes/security/coverage.md`; returns a findings table (each a High backlog task) + trace. Does not edit or commit. | `_review-standard.md`, `notes/security/coverage.md`, `{project}/PLANNING.md`, that slice's `backend` source | findings table (returned to the orchestrator) |
| `projects/portfolio/portfolio-audit.md` | **THE entry point — the only portfolio prompt you launch.** Runs **inside Claude Code**, hands-off. The final go/no-go gate per project (last link in the per-project chain): an author + cold-reviewer subagent pair build the project-specific interview-question bank, then the orchestrator computes the verdict and (if not ❌) writes the CV bullet + GitHub description; if ✅ Ready it also updates the GitHub profile README (`dev/portfolio/VMNunez`, separate repo — commit/push printed for Victor). The author+reviewer pair runs **once per bank section**, never on the whole bank. `DRY_RUN` leaves everything in the working tree. | its three internal pieces (below) | `interview-prep/projects/{project}.md`, `notes/cv/cv-bullets.md`, `dev/portfolio/VMNunez/README.md` (✅ only), `projects/portfolio/_last-run-report.md`, one atomic commit |
| `projects/portfolio/_portfolio-standard.md` | *Internal.* The **shared portfolio-gate contract** all three pieces read (what the gate is for, the two-check verdict logic, the interview-question quality bar + file template, the CV-bullet and GitHub-description formats, the two project formats). Not runnable. | — | — |
| `projects/portfolio/_portfolio-write-prompt.md` | *Internal (author).* Dispatched **once per bank section**: reads only that section's code area (the standard's canonical table) + PLANNING.md and writes that section's exhaustive questions to the standard. Does not compute the verdict or commit. | `_portfolio-standard.md`, `{project}/PLANNING.md`, `ROADMAP.md`, that section's code area | that section of `interview-prep/projects/{project}.md` (working tree) |
| `projects/portfolio/_portfolio-review-prompt.md` | *Internal (reviewer).* Independent second pass on the question bank: hunts thin/weak/duplicate questions against the real code, fixes them directly. Does not commit (the orchestrator bundles the commit). | `_portfolio-standard.md`, the question bank, the project source | the audited `interview-prep/projects/{project}.md` |

### Practice — active recall and timed tests (daily blocks)

Split into three subfolders (2026-07-22) so the right prompt is one glance away instead of one scan
down a flat list of ten files:

| Subfolder | What lives there | When you reach for it |
|---|---|---|
| `practice/sql/` | the SQL exercise track — plan auditor, exercise generator/grader, its standard and run reports | the 12:30 SQL block |
| `practice/simulations/` | timed technical tests — the generator that writes specs, the reviewer that grades them | practising a take-home (stage 3) |
| `practice/interview/` | live interview training — technical mock, HR call, code critique | rehearsing stages 2–4 |

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `practice/sql/_sql-plan-standard.md` | *Internal.* The **bar `sql-plan-audit` checks the plan against** — required sections, the ten learning-design checks, the per-step field list, the consistency invariants, and who owns what. Not runnable. | — | — |
| `practice/sql/_sql-exercises-practice.md` · `_sql-exercises-review.md` | *Internal.* The two **branches of `sql-exercises`** — generate-and-save, and grade-and-record. A run is one mode or the other, never both, so the shell reads only the branch its `MODE` names. Not runnable alone: both assume the shell already resolved `{FILE}`/`{COUNT}`/`{FOCUS}` and read the context files. | — | — |
| `practice/sql/_sql-exercise-seeds.md` | *Internal.* Per-topic **structure and concrete exercise ideas** for `sql-exercises` Step 3 — the traps worth building a question around and each topic's Challenge. A run reads **only its own topic's block**. Scope still comes from `coverage.md`, never from here. Not runnable. | — | — |
| `practice/sql/sql-plan-audit.md` | **Orchestrator.** Audits **and extends** `practice/sql/PLANNING.md` against `_sql-plan-standard.md` — four cold specialists (learning-design · coverage-and-steps · counts-and-truth · loop-and-fence), history gate, single commit. `coverage-and-steps` writes the new steps for coverage sections nothing claims yet, so the plan grows as SQL grows. The plan it maintains covers **exercises only** — notes, Q&A and simulations are separate tracks Victor runs himself. | `_sql-plan-standard.md`, `practice/sql/PLANNING.md`, `notes/sql/coverage.md`, `ROADMAP.md`, `PROGRESS.md`, `sql-exercises-prompt.md`, the exercise files (as evidence, never edited) | `practice/sql/PLANNING.md` |
| `practice/sql/sql-exercises-prompt.md` | `practice` mode: generates SQL exercises for the current step. `review` mode: grades my answers, scores them, and logs every ⚠️/❌ concept. Config is exactly four keys — `MODE`, `TOPIC`, `COUNT`, `FILE`; focus and review come from the step in `PLANNING.md`, never pasted. **Writes no notes and no Q&A** — those are separate tracks. | `practice/sql/PLANNING.md` (the step: topic, count, focus), `notes/sql/coverage.md`, `PROGRESS.md`, the flat exercise files `practice/sql/NN-name.sql` | `practice/sql/NN-name.sql`; `practice/sql/MISTAKES.md` (review mode); the SQL table in `PROGRESS.md` |
| `practice/simulations/simulation-generator-prompt.md` | Creates new timed test specs (Angular / Spring Boot / SQL) in the existing format — the producer for the simulation bank. | `practice/simulations/{type}/` (existing specs), `practice/simulations/TRACKER.md` | new `practice/simulations/{type}/NN-*.md`; rows + counts in `practice/simulations/TRACKER.md` |
| `practice/simulations/simulation-review-prompt.md` | Grades a finished timed simulation, gives a 3-score ideal solution, adds interview questions. `hint` mode guides mid-test. | the simulation spec in `practice/simulations/{type}/`, `practice/simulations/TRACKER.md`, + my pasted code | `practice/simulations/TRACKER.md`, the spec's header, `interview-prep/en/{topic}.md` + `es/{topic}.md` |
| `practice/interview/code-review-prompt.md` | Generates a flawed snippet (often AI-style) for me to critique, then grades what I found / missed / over-flagged. Trains the stage-3 code-review step. | (snippet generated fresh; no spec file needed) | `interview-prep/en/{type}.md` + `es/{type}.md` (questions for my gaps) |
| `practice/interview/simulator-prompt.md` | Runs a live mock **technical** interview from my Q&A bank, scores each answer, tracks weak areas across sessions. | `interview-prep/{lang}/*.md`, `interview-prep/projects/*`, `interview-prep/SESSION-LOG.md` | `interview-prep/SESSION-LOG.md` |
| `practice/interview/hr-screen-prompt.md` | Runs a live mock **HR** call (stage 2): motivation, career-change story, availability, salary, "why us". Non-technical. | profile + situation from `_shared-context.md`, `ROADMAP.md` | optional `interview-prep/hr-screen.md` (polished answers) |

### Strategy — keep the plan accurate (`tracking/`) and apply (`apply/`)

Two sub-purposes, two subfolders. `tracking/` keeps the hub files (`PROGRESS.md`, `ROADMAP.md`)
accurate; `apply/` produces the job-application material.

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `strategy/tracking/_concept-extraction-standard.md` | *Internal.* The Format A/B/C **concept-extraction contract** each per-project subagent runs when `progress-update` fans out. Not runnable. | — | — |
| `strategy/tracking/progress-update-prompt.md` | Reconciles PROGRESS.md with what each PLANNING.md declares (never the code — it is blind to it by design) — an orchestrator that fans out one cold subagent per project (+ one for SQL; it reads the small simulations tracker itself), then merges. Run before `plan-audit`. | `_concept-extraction-standard.md`, all `PLANNING.md` files, `practice/sql/`, `practice/simulations/TRACKER.md` | `PROGRESS.md` |
| `strategy/tracking/_roadmap-standard.md` | *Internal.* The **shared roadmap contract** `roadmap-review` reads: what ROADMAP is vs PROGRESS/coverage, stable vs living sections, gate-based sequencing (no dates), canonical study-block orders. Not runnable. | — | — |
| `strategy/tracking/roadmap-review-prompt.md` | Keeps ROADMAP forward-looking and gate-based (no stale dates); checks project sequence and study-block tables vs coverage. **Orchestrator:** two cold fact-gatherers (gap analysis + active-PLANNING summary) feed the doer so coverage.md and PLANNING.md never load into its context; the doer applies edits, then two sequential cold reviewers — mechanical (date scan, study order, LeetCode gate; reads only ROADMAP + standard) and cross-file (gaps, gates, SQL table, phase markers) — re-verify the invariants and fix ROADMAP. | `_roadmap-standard.md`, `notes/coverage.md`, `PROGRESS.md`, the active `PLANNING.md` | `ROADMAP.md` |
| `strategy/apply/_application-standard.md` | *Internal.* The **shared job-application standard** both `cv` and `linkedin` read: expert stance, sources (incl. the existing CV in `personal/job-search`), bullet format, ATS/skills keyword pool, Spanish voice rules, defensibility rule, project-selection heuristic. Not runnable. | — | — |
| `strategy/apply/cv-prompt.md` | `create` / `review` / `tailor` the one-page Spanish CV (ATS-checked). `tailor` adapts it to a pasted job offer with a `HAVE / PARTIAL / MISSING` gap analysis, and feeds that offer into the job-market evidence. | `_application-standard.md`, `PROGRESS.md`, `ROADMAP.md`, `notes/cv/cv-bullets.md`, the existing CV in `personal/job-search/` | Saves the CV to `personal/job-search/` **outside the repo** (never committed): `master/` for create/review, `applications/` for tailor. `tailor` also appends the posting to `notes/prompts/_job-market-evidence.md` |
| `strategy/apply/linkedin-prompt.md` | Drafts every LinkedIn section + 3 posts, ready to paste. | `_application-standard.md`, `PROGRESS.md`, `ROADMAP.md` | **Output only** — LinkedIn text (not stored in the repo) |
| `strategy/apply/cover-letter-prompt.md` | `letter` (formal one-page *carta de presentación*) / `message` (short 5–6 line recruiter message) tailored to a pasted offer, in the same Spanish voice as the CV. | `_application-standard.md`, `PROGRESS.md`, `ROADMAP.md`, the pasted offer | **Output only** — cover-letter/message text (not stored in the repo) |
| `strategy/apply/profile-readme-prompt.md` | `sync` (pull in fact deltas only) / `optimize` (full re-evaluation against the job target) for the GitHub profile README. The repeatable entry point so Claude never needs to be re-briefed on that repo's context each time. | `dev/portfolio/VMNunez/CLAUDE.md` (standing context + gap list), that repo's `README.md`, `PROGRESS.md`, the active project's `PLANNING.md`, `personal/job-search/internship-daw.md` | Edits `dev/portfolio/VMNunez/README.md` + its `CLAUDE.md` gap list directly (separate repo, never committed from here) |
| `strategy/apply/tracker-prompt.md` | `log` a new application / `update` an outcome + feedback / `analyze` the tracker for patterns. Records the job search as data and surfaces skill gaps to feed `evidence-intake`. | `_application-standard.md`, the local tracker in `personal/job-search/` | Writes `personal/job-search/tracker.csv` + `applications/<empresa>-<puesto>/` **outside the repo** (never committed); `analyze` suggests `evidence-intake` |

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
- **`{project}/PLANNING.md`** — written by `plan-audit` (new mode) → read by `readme-audit`,
  `review-audit`, `portfolio-audit`, `progress-update`, `roadmap-review`. *It is the contract
  the whole project is checked against.*
- **`PROJECT-BACKLOG.md`** — written by `review-audit` → read by `portfolio-audit` (open
  High/Medium tasks block the "ready" verdict).
- **`notes/cv/cv-bullets.md`** — written by `portfolio-audit` → read by `cv-prompt` (one polished
  bullet per project, reused as-is).
- **`interview-prep/en/*.md` + `es/*.md`** — written by `interview-prep-audit`,
  `notes-and-interview-prep`, `simulation-review`, `code-review` → read by `simulator`.
- **`interview-prep/projects/*.md`** — written by `portfolio-audit` → read by `simulator`.
- **`practice/sql/PLANNING.md`** — written by `sql-plan-audit` → read by `sql-exercises` (every run
  takes its topic, count and focus from the current step) and by `simulation-generator` in
  `TYPE = sql` (a SQL test may only use techniques from steps already closed). *This is the SQL
  track's contract, the same role a project's `PLANNING.md` plays.*
- **`practice/sql/MISTAKES.md`** — written by `sql-exercises` in `review` mode (one row per failed
  concept, with its `coverage.md` section and how many times it has come back) → read by the revision
  points R1–R5 in `PLANNING.md` §8b, which take their focus from its open rows, highest count first.
- **`practice/simulations/{type}/NN-*.md`** (the test specs) — written by `simulation-generator` (and the
  original bank by hand) → read by `simulation-review` (and by me, to take the test).
- **`practice/simulations/TRACKER.md`** — written by `simulation-generator` (new rows) and `simulation-review`
  (status) → read by `progress-update` and by `simulation-review` itself (recurring-weakness check).
- **`interview-prep/SESSION-LOG.md`** — written and read by `simulator` (tracks weak areas between
  sessions).
- **`interview-prep/hr-screen.md`** — optionally written by `hr-screen` (polished stage-2 answers).

Pipeline view:

```
coverage-prompt / coverage-audit ─► notes/coverage.md
        │
        ├─► notes-audit (folder|file) ─► [plan] → [inspect per existing file] → per file: en-author → en-reviewer → translator → es-reviewer subagents ─► notes/*.md ─┐
        ├─► interview-prep-audit ─► interview-prep/*.md ─┐
        │        └─ notes-and-interview-prep keeps both in sync
        │                                                   │
        ▼                                                   ▼
progress-update ─► PROGRESS.md ─► plan-audit ─► {project}/PLANNING.md   simulator
                        ▲                              │                  ▲ (reads Q&A)
                        │            ┌─────────────────┼───────────────┐ │
                        │            ▼                 ▼               ▼ │
                        │     readme-audit     review-audit   portfolio-audit
                        │     README(s)         PROJECT-BACKLOG  ─► cv-bullets ─► cv-prompt
                        │                                          └► interview-prep/projects ┘
                        └─ roadmap-review ─► ROADMAP.md

Practice (its own loop, fed by coverage):

  notes/sql/coverage.md ─► sql-plan-audit ─► practice/sql/PLANNING.md ─┬─► sql-exercises ─► NN-*.sql
                                                    ▲                 │        └─► MISTAKES.md ─┐
                                                    └── the R1–R5 revision points read it ◄──────┘
                                                                      │
                                                                      └─► simulation-generator (sql)
                                                                             (only closed steps)

  simulation-generator ─► simulations/{type}/ ─► simulation-review ─► TRACKER + topic Q&A ─► simulator
```

---

## Typical run order

**Starting a new project**
1. `progress-update` — make PROGRESS.md accurate first
2. `plan-audit` (`MODE = new`) — plan it, get PLANNING.md (author + reviewer, hands-off)
3. build it, step by step (daily sessions)
4. `readme-audit` — fix the README(s) after each big feature
5. `review-audit` — code review when the project is complete
6. `portfolio-audit` — final gate before adding it to CV/LinkedIn

**Auditing knowledge (one topic)**
1. `coverage-prompt` — define/refresh the topic's coverage
2. `notes-audit` (`SCOPE = folder` for a whole topic, `SCOPE = file` for one file — hands-off,
   author + reviewer per file), then `interview-prep-audit` — build both sides
3. `notes-and-interview-prep` — close the gaps between them
4. (after all topics have coverage) `coverage-audit` — global convergence pass
5. `roadmap-review` — check the plan still reflects reality

**The SQL track (the daily 12:30 block)**
1. `coverage-prompt` (`TOPIC = sql`) — only when coverage is stale; it is the root of the plan
2. `sql-plan-audit` — turns coverage into ordered steps in `practice/sql/PLANNING.md`. Re-run it when a
   step closes, when coverage grows, or when the plan feels out of date
3. per step, in the block itself: `sql-exercises` (`MODE = practice`) → answer them in pgAdmin →
   `sql-exercises` (`MODE = review`) to grade. The step's topic, count and focus come from the plan
4. at each revision point R1–R5 (every 3 scored files): `sql-exercises` again, focused on the open
   rows of `MISTAKES.md`
5. `simulation-generator` (`TYPE = sql`) — the first timed test is due once Step 5 closes; it refuses
   to use techniques from steps you have not closed
6. after the last step: `progress-update`, then `roadmap-review`

**Applying**
1. `portfolio-audit` on each finished project (produces cv-bullets)
2. `cv-prompt` → one-page CV · `linkedin-prompt` → profile + posts
3. Per offer: `cv-prompt` `tailor` + `cover-letter-prompt` → then `tracker-prompt` `log` to record it
4. As results come in: `tracker-prompt` `update` (outcome + feedback), then `analyze` → gaps feed `evidence-intake`

---

## Batch mode — run a prompt on every target at once

Per-target prompts (one topic / file / project / type at a time) also accept **`all`** in their
target field, so you don't have to run them folder by folder. Set the field to `all` and the prompt
processes every target in order, one commit per target. Full rules: `notes/prompts/_batch-mode.md`.

- **Supports `all`:** `coverage-prompt`, `notes-audit` (`SCOPE = folder`, `TOPIC = all`), `interview-prep-audit`,
  `notes-and-interview-prep` (`TOPIC`/`FILE = all`); `readme-audit`, `review-audit`,
  `portfolio-audit` (`PROJECT_PATH = all`); `plan-audit` (`PROJECT = all`, **review mode only**);
  `sql-exercises` (`TOPIC = all`, **practice mode only**),
  `simulation-generator`, `code-review` (`TYPE = all`).
- **Already global (no `all` needed):** `coverage-audit`, `roadmap-review`, `cv`,
  `linkedin`, and `simulator` full mode — these cover everything in one run by design.
  `progress-update` defaults to `MODE = active` (only the in-progress project); set `MODE = all`
  for the full global pass.
- **Single-shot (not batchable):** `simulation-review` and `hr-screen` — each needs your pasted code
  or a live back-and-forth, so they run one at a time.

---

## Model tiering — every subagent dispatch names its model

Every orchestrator specifies `model:` on each Agent dispatch, so the cost/quality tradeoff is decided
once, in the prompt, and never inherited by accident from whatever model the session happens to run
(completed 2026-07-16). The criterion:

> **If the output's quality is guaranteed by structure — an explicit standard, a report contract, a
> trace gate that rejects incomplete work — tier down. If it is guaranteed only by judgment — writing
> prose, designing, translating, deciding what matters — top tier.**

- **haiku** — pure command-running and formatting (the SQL exercise counter).
- **sonnet** — pattern-matching and conformance against an explicit standard: concept extraction,
  notes inspect/translate/es-review, README review + consistency check, roadmap fact-gathering.
- **opus / top** — everything that authors, rewrites, or judges: plan author + advisor + specialists
  (pinned in `plan-audit.md`), notes/README/interview-prep authors, interview-prep market + gap-hunt +
  reviewer (it rewrites), portfolio author + reviewer (go/no-go gate), roadmap reviewers, review-audit
  flow/security.

**A new prompt must pick a tier per dispatch using this criterion — never leave `model:` unspecified.**
Re-tiering an existing dispatch needs a real run's self-report as evidence, per the frozen-prompts rule.

---

## Gaps — closed, and what is left

The three gaps detected against the goal (junior Angular + Spring Boot at a Spanish consultancy by
Aug–Sep 2026, per the market analysis in `_shared-context.md`) are now **built**:

- ✅ **`practice/interview/code-review-prompt.md`** — trains the stage-3 code-review step (critique a flawed,
  often AI-style snippet). Was the biggest blind spot: nothing else hands me broken code to review.
- ✅ **`practice/simulations/simulation-generator-prompt.md`** — produces new timed test specs in the existing
  format, so the bank is no longer fixed at 15 and I can drill a weak type on demand.
- ✅ **`practice/interview/hr-screen-prompt.md`** — covers the non-technical stage-2 HR call (motivation,
  career-change story, availability, salary), which only had a one-line touch in `simulator`.

Still intentionally **not** a prompt:
- **English / Cambridge prep** — tracked in a separate private repo, out of scope for this folder.
