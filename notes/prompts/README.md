# Prompts — the study system

All prompts live in `notes/prompts/`, grouped by purpose. **They run in separate conversations,
never in the main daily session** — you fill in the configuration block at the top of a prompt,
paste it into a fresh chat, and it does one job. Update the project list inside each prompt as new
projects are completed.

> **▶ Run first.** Every runnable prompt opens with a `▶ Run first` line naming the prompt you must run
> before it (or `nothing`). You never have to cross-check the dependency map below before running one —
> the prompt tells you at the top.

This file is the map: what each prompt does, what it reads and generates, and how the same workflows run in Claude Code and Codex.

> **Shared runtime context.** Every session starts from its thin platform adapter (`CLAUDE.md` or
> `AGENTS.md`), which delegates to `_internal/_session-rules.md`. Runnable prompts also read
> `_internal/_agent-runtime-standard.md`; almost all read `_internal/_shared-context.md`.

---

## Platform adapters

The workflow files in `notes/prompts/` are canonical and platform-neutral. They name roles
(`author`, `reviewer`, `analyst`, `orchestrator`, `mechanical checker`), reasoning tiers
(`deep`, `standard`, `mechanical`), and execution modes (`parallel`, `sequential`, `foreground`).
`_internal/_agent-runtime-standard.md` maps those terms to each runtime:

- **Claude Code:** launch from `.claude/commands/`; its adapter selects an available Claude model for
  each canonical reasoning tier.
- **Codex:** launch from `.codex/commands/`; its adapter uses Codex collaboration tools and does not
  invent model identifiers.
- **Direct paste:** paste the canonical prompt into a supported runtime; it reads the runtime standard
  before dispatching any role.

Both launcher catalogs contain exactly 25 files and must reference the same 25 canonical entry points.
Run `_internal/validate-prompt-system.ps1` after adding, removing, or renaming a prompt.

---

## Prompts you launch vs. internal pieces you never touch

Most files in this folder are `.md` prompt-system artifacts, but **not every Markdown file is
something you run**; the validator is the one `.ps1` utility. One filename rule separates runnable
Markdown entry points from internal Markdown:

> **A leading `_` means "never launch this".** No underscore, and it is yours to run.

**Every folder keeps its internal pieces in an `_internal/` subfolder** (2026-07-22) — the twelve families
and this root, which holds the shared session/runtime contracts, preflight, recommendation ledger,
self-report contracts, market context, batch rules and run tracker. Open any
folder under `notes/prompts/` and you see its runnable prompts and one `_internal/`, never a mix you
have to read prefixes to sort. Standards, subagent steps and `_last-run-report*.md` files all live
there; a new one goes in `_internal/` too, **including a report a pipeline has not written yet** — the
path a prompt is told to write to counts, not just the files already on disk. The `_` prefix stays on
the filenames anyway, so a file keeps its marking if it is ever moved or quoted out of context.

**Inside a supported agent runtime you do not need the rule at all: type `/` and the list is the answer.** Every
runnable prompt has a slash command and no internal file can have one, so the menu *is* the runnable
set — 25 launchers in each of `.claude/commands/` and `.codex/commands/`, one per prompt, kept at parity (completed 2026-07-22; before
that only the 11 orchestrators had one, which made the menu look like the whole system when it was
under half of it). **Adding a runnable prompt means adding its command in the same commit.**

- **Runnable — you launch these.** Fill in the config block at the top, paste it into a fresh
  conversation, or just use its slash command. **25 files, listed below.**
- **Internal — a runnable prompt reads and executes these as its own step**; they never appear in your
  "paste into a new chat" workflow. Two kinds, both `_`-prefixed: **standards**
  (`_note-quality-standard.md`, `_review-standard.md`) — the shared rulebook a family of prompts reads
  — and **subagent steps** (`_notes-write-prompt.md`, `_plan-review-prompt.md`) — the author/reviewer
  slices an orchestrator (the `-audit.md` file in the same folder) fans out to automatically.

*(Made true on 2026-07-22: seventeen subagent steps were missing the prefix, so a folder like
`knowledge/notes/` looked like seven runnable prompts when only `notes-audit.md` is one.)*

### The 25 runnable prompts — each with a slash command of the same name

| Group | Prompts |
|---|---|
| Knowledge | `coverage-prompt`, `coverage-audit-prompt`, `evidence-intake-prompt`, `notes-plan-prompt`, `notes-audit`, `interview-prep-audit`, `notes-and-interview-prep-prompt` |
| Projects | `plan-audit`, `readme-audit`, `review-audit`, `portfolio-audit` |
| Practice | `sql-plan-audit`, `sql-exercises-prompt`, `simulation-generator-prompt`, `simulation-review-prompt`, `code-review-prompt`, `simulator-prompt`, `hr-screen-prompt` |
| Strategy | `progress-update-prompt`, `roadmap-review-prompt`, `cv-prompt`, `linkedin-prompt`, `cover-letter-prompt`, `profile-readme-prompt`, `tracker-prompt` |

Two flavors among these 25, both launched the same way (paste config into a new chat):
- **Hands-off orchestrators** — `notes-audit`, `interview-prep-audit`, `plan-audit`, `readme-audit`,
  `review-audit`, `portfolio-audit`, `progress-update-prompt`, `roadmap-review-prompt`,
  `coverage-audit-prompt`, `notes-and-interview-prep-prompt`, plus `coverage-prompt`,
  `notes-plan-prompt`, and `sql-plan-audit` (they run the orchestrator contract even when the target
  is singular) — run entirely inside a supported agent runtime and hand you a finished result (and,
  where noted, a commit) with no further input from you. **Thirteen prompts**, and the set is defined by
  which self-report they run: these thirteen execute `_pipeline-self-report.md`.
- **Single-shot prompts** — the other twelve, which execute `_single-shot-self-report.md` — do one job
  in one pass; some need you to paste something mid-conversation (your code into
  `simulation-review-prompt`, a job offer into `cover-letter-prompt`, etc.).

Either way, **every run writes its own `_last-run-report*.md` and updates `_run-tracker.md`.**
Orchestrators record target-level state; `notes-audit` additionally records every planned EN/ES pair,
and single-shot prompts update their latest-execution table. Completed, blocked, and dry-run outcomes
remain distinguishable. Both files count as declared outputs of every prompt and are checked by the close-out —
they are not repeated in the per-prompt rows below only because they are universal, not because they
are exempt.

### The internal-only files (never launch these)

`_coverage-standard.md`, `_note-quality-standard.md`, `_interview-prep-standard.md`,
`_planning-standard.md`, `_readme-standard.md`, `_review-standard.md`, `_portfolio-standard.md`,
`_concept-extraction-standard.md`, `_roadmap-standard.md`, `_application-standard.md`,
`_sql-plan-standard.md`, `_sql-exercise-seeds.md`, `_sql-exercises-practice.md`,
`_sql-exercises-review.md`,
`_shared-context.md`, `_batch-mode.md`, `_job-market-evidence.md`,
`_single-shot-self-report.md` (the same contract for the twelve non-orchestrator prompts: close-out check against declared outputs, tracker update, three bullets, refinement behind a cold reviewer),
`_pipeline-self-report.md` (the shared final step every orchestrator runs: five bullets on how the run
itself went, written to `_last-run-report*.md` in the orchestrator's own `_internal/` folder and
auto-committed with `_run-tracker.md` — the
evidence that decides whether a frozen prompt gets reopened), plus every
`_notes-write-prompt.md` / `_notes-review-prompt.md` / `_notes-translate-prompt.md` / `_notes-review-es-prompt.md`,
`_interview-prep-write-prompt.md` / `_interview-prep-review-prompt.md`,
`_plan-write-prompt.md` / `_plan-architecture-prompt.md` / `_plan-review-prompt.md`,
`_readme-write-prompt.md` / `_readme-review-prompt.md`,
`_review-flow-prompt.md` / `_review-security-prompt.md`,
`_portfolio-write-prompt.md` / `_portfolio-review-prompt.md`.

---

## The five hub files

Everything orbits the three level mirrors plus progress and project planning. Most prompts write or
consume one of these sources of truth.

| Hub file | Source of truth for | Written by | Read by |
|----------|---------------------|------------|---------|
| `notes/coverage/junior.md` | **junior scope** | `coverage-prompt`, `coverage-audit-prompt` | current notes/interview-prep audits, `plan-audit`, `roadmap-review`, `sql-exercises` |
| `notes/coverage/middle.md` | **middle scope after junior consolidation** | `coverage-prompt`, `coverage-audit-prompt` | level-aware notes/interview-prep audits |
| `notes/coverage/senior.md` | **senior scope after middle consolidation** | `coverage-prompt`, `coverage-audit-prompt` | level-aware notes/interview-prep audits |
| `PROGRESS.md` | **what I have learned and demonstrated level by topic** | `progress-update-prompt` (+ the coding agent per step in session) | `plan-audit`, `roadmap-review`, `portfolio-audit`, `cv`, `linkedin`, `sql-exercises`, simulation/interview planning |
| `{project}/PLANNING.md` | **what a project builds** | `plan-audit` | `readme-audit`, `review-audit`, `portfolio-audit`, `progress-update`, `roadmap-review` |

---

## The prompts — what each one reads and generates

### Knowledge — build and audit study content

| Prompt | What it does | Reads (besides the shared session rules + _shared-context) | Generates / updates |
|--------|--------------|----------------------------------------------|---------------------|
| `knowledge/coverage/_coverage-standard.md` | *Internal.* The **shared coverage standard** both coverage prompts read (scope logic, three item types, confusable pairs, AI factor, item/file format, the job-target-is-the-source rule). Not runnable. | — | — |
| `knowledge/coverage/_cross-topic-inbox.md` | *Internal.* The **durable handoff** between coverage runs: when a run finds a gap owned by another topic, it files the item here under that topic instead of only mentioning it in a summary. Every coverage run reads its own heading at Step 1 and clears what it consumed; `coverage-audit` sweeps all headings. Not runnable. | — | — |
| `knowledge/coverage/_coverage-prompt-rationale.md` | *Internal.* The **evidence behind the rules** in `coverage-prompt.md` — each real run's failure, what it cost, and the worked example, as numbered `R-n` entries the prompt points at. Keeps the prompt executable while the history stays intact. Read an entry before weakening or skipping the rule it justifies; a run's self-report adds new entries here, never inline in the prompt. Not runnable. | — | — |
| `knowledge/coverage/coverage-prompt.md` | Defines one topic at one selected level (`junior`, `middle`, or `senior`). One cold market analyst establishes the real competency floor and two cold reviewers challenge level calibration, factual quality, and ownership. There are no numeric budgets. One execution handles exactly one topic; `all` is unsupported, so Angular and Angular Material always run separately. | `_coverage-standard.md`, `ROADMAP.md`, `_job-market-evidence.md`, all three topic level files, `_cross-topic-inbox.md` | `notes/{topic}/coverage/{LEVEL}.md`, syncs `notes/coverage/{LEVEL}.md`, and moves concepts between level files when required |
| `knowledge/coverage/coverage-audit-prompt.md` | Global convergence pass for one selected level after every topic has run `coverage-prompt` for that level. Audits market fit, fundamentals, level boundaries, ownership, and missing topics. | `_coverage-standard.md`, all three global mirrors and topic level files, `_job-market-evidence.md`, `ROADMAP.md` | the selected global mirror plus justified cross-level moves; flags new topics for separate coverage-prompt runs |
| `knowledge/coverage/evidence-intake-prompt.md` | Nourishes `notes/prompts/_internal/_job-market-evidence.md`: `paste` mode adds full offers you provide, `search` mode web-searches a batch of current Spanish junior postings; both append Raw-posting blocks, re-tally the Synthesis, and commit. Run it whenever you see real postings. | `_job-market-evidence.md`, `_coverage-standard.md`, `ROADMAP.md` | `notes/prompts/_internal/_job-market-evidence.md` (new Raw-posting blocks **and** the re-tallied Synthesis — appending without re-tallying is a skipped step), its row in `_internal/_run-tracker.md` |
| `knowledge/notes/notes-plan-prompt.md` | Persistent planner for exactly one topic and level. Classifies legacy bilingual notes across all three levels, relocates unambiguous pairs, then groups every selected-level coverage concept exactly once and fingerprints coverage so stale plans cannot author notes. | all three topic coverages, selected mirror, existing notes across all three levels | `notes/{topic}/coverage/notes-plan-{LEVEL}.md` plus any verified bilingual relocations and affected plan-path reconciliations |
| `knowledge/notes/notes-audit.md` | Builds exactly one persistent-plan entry selected by `TOPIC + LEVEL + NOTE`; rejects stale plans and arbitrary paths, then runs the four-stage bilingual pipeline. | selected coverage, persistent plan, its internal stages | one `{LEVEL}/en` + `{LEVEL}/es` pair and the plan status, committed atomically |
| `knowledge/notes/_note-quality-standard.md` | *Internal.* The **shared writing standard** every piece reads (format modes, rule 3, signature elements, anticipate-the-TODO). Not runnable. | — | — |
| `knowledge/notes/_notes-write-prompt.md` | *Internal (stage A — English author).* Deep, high-standard work on **one `en/`** file: resolve TODOs (reading `es/` only for markers), complete it, self-check. Writes English only — never the `es/`. Does **not** commit. | `_note-quality-standard.md`, the one `en/` file, sibling files, `PROGRESS.md` | that one `en/*.md`, the `notes/prompts/_internal/_session-rules.md` counter |
| `knowledge/notes/_notes-review-prompt.md` | *Internal (stage B — English reviewer).* Independent auditor for **one `en/`** file: fixes what falls short in English. The `es/` does not exist yet. Never touches `es/`, never commits. | `_note-quality-standard.md`, the one `en/` file, sibling files | the audited `en/*.md` |
| `knowledge/notes/_notes-translate-prompt.md` | *Internal (stage T — translator).* Takes the finished, canonical `en/` file and produces/re-syncs its `es/` counterpart: exact structural parity, native-Spanish prose, clears leftover `es/` TODO markers. Does not change the English, does not commit. | the canonical `en/` file, the existing `es/` (if any), `_note-quality-standard.md` | that one `es/*.md` |
| `knowledge/notes/_notes-review-es-prompt.md` | *Internal (stage C — Spanish reviewer, `en/`-blind).* Reads only the planned `es/` file, fixes calque/flow, marks that persistent-plan entry complete, and commits the pair plus plan. | `_note-quality-standard.md`, one `es/` file, persistent plan | the `es/*.md`, plan status, one atomic commit |
| `knowledge/interview-prep/interview-prep-audit.md` | Level-aware interview Q&A audit. Uses and fingerprints `coverage/{LEVEL}.md`, writes isolated `{LEVEL}/en` + `{LEVEL}/es` banks, and enforces the progression gates. | its internal pieces, selected topic coverage, `_job-market-evidence.md`, selected-level interview-prep en/es | selected-level interview-prep en/es, one atomic commit per topic |
| `knowledge/interview-prep/_interview-prep-standard.md` | *Internal.* The **shared Q&A standard** the author, reviewer, and cross-reference prompts read (question types + ratio, priority markers, question format, the answer quality bar — realistic/well-worded/Victor's voice, real cited code from his projects, bilingual contract, studied-content-is-final via the `[x]` marker, section-complete). Not runnable. | — | — |
| `knowledge/interview-prep/_interview-prep-write-prompt.md` | *Internal (author).* Full audit of one topic at the selected level: en/es sync, TODOs, coverage check, priorities and question quality. | `_interview-prep-standard.md`, `notes/{topic}/coverage/{LEVEL}.md`, interview-prep en/es | interview-prep en/es working tree |
| `knowledge/interview-prep/_interview-prep-review-prompt.md` | *Internal (reviewer).* Independent second pass on **one** selected-level section/topic: enforces realistic, level-calibrated questions with real anchors and keeps en/es aligned. | `_interview-prep-standard.md`, selected-level interview-prep en/es | the audited selected-level pair, one atomic commit |
| `knowledge/interview-prep/notes-and-interview-prep-prompt.md` | Closes gaps **between** selected-level notes and Q&A in both directions, after verifying the Q&A coverage fingerprint. | selected-level topic notes + interview-prep en/es | selected-level notes and interview-prep en/es |

### Projects — plan, document, review

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `projects/plan/plan-audit.md` | **THE entry point — the only project-plan prompt you launch.** Runs **inside a supported agent runtime**, hands-off. `new` mode plans the next project (gap-analyses PROGRESS vs coverage, picks it, writes a full PLANNING.md), runs an **architecture advisor** on §6/§3/§20, then audits it with **five cold specialist reviewers — one per concern** (architecture · data-model-api · rules-security · steps-tests · branches-coverage) before the orchestrator makes the single commit; `review` mode runs the same five specialists on an existing PLANNING.md (one project or `all`). Specialists never commit. `DRY_RUN` leaves everything in the working tree. | its four internal pieces (below) | `{project}/PLANNING.md`; adds a row to `PROGRESS.md`; marks the choice in `ROADMAP.md`; one atomic commit |
| `projects/plan/_planning-standard.md` | *Internal.* The **shared PLANNING.md contract** both the author and reviewer read (the 24-section template + what makes each pass, done-condition formats, HTTP status conventions, professional implementation order, branch-strategy rules, quality-gate rules, consistency invariants, the two project formats). Not runnable. | — | — |
| `projects/plan/_plan-write-prompt.md` | *Internal (author, new mode).* Gap-analyses, chooses the next project, designs it, and writes the complete PLANNING.md to the standard + the ROADMAP/PROGRESS edits. Does not commit. | `_planning-standard.md`, `PROGRESS.md`, `notes/coverage/junior.md`, `ROADMAP.md`, last project's `PLANNING.md` | `{project}/PLANNING.md`, `ROADMAP.md`, `PROGRESS.md` (working tree) |
| `projects/plan/_plan-architecture-prompt.md` | *Internal (architecture advisor, new mode only).* Judges the drafted architecture (§6), the one new architectural concept (§3), and the tradeoffs (§20) against Victor's level and the coverage gaps; fixes over/under-engineering directly in those sections. Does not commit. | `_planning-standard.md` (its slice), `{project}/PLANNING.md` (§3/§6/§20), `PROGRESS.md` | the sharpened §3/§6/§20 (working tree) |
| `projects/plan/_plan-review-prompt.md` | *Internal (specialist reviewer).* Dispatched **once per concern** by the orchestrator (`SCOPE` = architecture · data-model-api · rules-security · steps-tests · branches-coverage): audits only its slice against the standard, fixes directly, returns a check-by-check trace. Never commits — the orchestrator owns the single commit (a standalone `SCOPE = all` run doesn't commit either). | `_planning-standard.md` (its slice), `{project}/PLANNING.md`, `PROGRESS.md` (architecture scope only) | the audited slice of `PLANNING.md` (working tree) |
| `projects/readme/readme-audit.md` | **THE entry point — the only readme prompt you launch.** Runs **inside a supported agent runtime**, hands-off. Reviews and fixes a project's README(s) to the standard — for full-stack, one author + cold-reviewer subagent pair **per README** (global / backend / frontend). Run before the portfolio gate (`portfolio-audit` reads the READMEs; `review-audit` does not). **Not auto-committed** — hands Victor the commit (project-folder files). Ends with a **pipeline self-report** written to `projects/readme/_internal/_last-run-report.md` (auto-committed — prompt-system machinery): five bullets on how the run itself went (report discipline, trace verification, coherence, failure protocol), read later to decide if these prompts need changing. | its three internal pieces (below) | `{project}/README.md` (+ `backend/README.md`, `frontend/README.md` for full-stack), `projects/readme/_internal/_last-run-report.md` |
| `projects/readme/_readme-standard.md` | *Internal.* The **single source of README rules** every piece reads (the two project formats, quality filter, in-progress scan, the 12 global-README rules + section order, full-stack global additions, the backend 9 sections, the frontend 7 sections, the commit rule). Not runnable. | — | — |
| `projects/readme/_readme-write-prompt.md` | *Internal (author).* Writes/fixes **one** README (global \| backend \| frontend) to the standard's rules for that target. Does not commit. | `_readme-standard.md`, `{project}/PLANNING.md`, the existing README | that one README (working tree) |
| `projects/readme/_readme-review-prompt.md` | *Internal (reviewer).* Independent second pass on **one** README: audits against the standard (recruiter + interviewer lens), fixes what falls short directly. Does not commit. | `_readme-standard.md`, `{project}/PLANNING.md`, the README | the audited README |
| `projects/review/review-audit.md` | **THE entry point — the only project-review prompt you launch.** Runs **inside a supported agent runtime**, hands-off. Reviews a built project against its PLANNING.md by **vertical slice**: it maps the resources/features, then fans out cold subagents **per slice** — a flow reviewer (quality + correctness + tests) and a security reviewer per backend resource, plus cross-cutting (`persistence-config`, `security-infra`), the frontend features + `frontend-infra`, and one learning-objectives pass — then merges every slice's findings into the backlog. **Not auto-committed** — writes the backlog and hands Victor the commit (project-folder file, feature-branch workflow). Ends with a **pipeline self-report** written to `projects/review/_internal/_last-run-report.md` (auto-committed — prompt-system machinery): five bullets on how the run itself went (slice mapping, report discipline, trace verification, dedup), read later to decide if these prompts need changing. | its internal pieces (below) | `PROJECT-BACKLOG.md` (per-project task list + "Last reviewed" date), `projects/review/_internal/_last-run-report.md` |
| `projects/review/_review-standard.md` | *Internal.* The **shared review contract** all pieces read (the two project formats, 30-day gate, scope limit, the full code-quality checklist with bad-vs-good examples, the security scope, the correctness scope + severity rule, the test-quality scope, the learning-objectives rubric, the task/priority/effort + backlog format). Not runnable. | — | — |
| `projects/review/_review-flow-prompt.md` | *Internal (per-slice functional reviewer).* Reviews **one vertical slice** — a backend resource's `model→repository→service→controller→DTO→tests` flow, a frontend feature, or a cross-cutting area (`persistence-config` / `frontend-infra`) — running quality + correctness + test lenses on it; returns a findings table + trace. Does not edit or commit. | `_review-standard.md`, `{project}/PLANNING.md`, that slice's source | findings table (returned to the orchestrator) |
| `projects/review/_review-security-prompt.md` | *Internal (per-slice security reviewer, full-stack only).* Attacker-hat pass on **one slice** — a backend resource's endpoints (authz/ownership/injection/data-exposure), or cross-cutting `security-infra` (SecurityConfig, JWT, CORS, hashing, secrets) — against `notes/security/coverage/junior.md`; returns a findings table (each a High backlog task) + trace. Does not edit or commit. | `_review-standard.md`, `notes/security/coverage/junior.md`, `{project}/PLANNING.md`, that slice's `backend` source | findings table (returned to the orchestrator) |
| `projects/portfolio/portfolio-audit.md` | **THE entry point — the only portfolio prompt you launch.** Runs **inside a supported agent runtime**, hands-off. The final go/no-go gate per project (last link in the per-project chain): an author + cold-reviewer subagent pair build the project-specific interview-question bank, then the orchestrator computes the verdict and (if not ❌) writes the CV bullet + GitHub description; if ✅ Ready it also updates the GitHub profile README (`dev/portfolio/VMNunez`, separate repo — commit/push printed for Victor). The author+reviewer pair runs **once per bank section**, never on the whole bank. `DRY_RUN` leaves everything in the working tree. | its three internal pieces (below) | `interview-prep/projects/{project}.md`, `notes/cv/cv-bullets.md`, `dev/portfolio/VMNunez/README.md` (✅ only), `projects/portfolio/_internal/_last-run-report.md`, one atomic commit |
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
| `practice/sql/_sql-exercise-seeds.md` | *Internal.* Per-topic **structure and concrete exercise ideas** for `sql-exercises` Step 3 — the traps worth building a question around and each topic's Challenge. A run reads **only its own topic's block**. Scope still comes from `coverage-junior.md`, never from here. Not runnable. | — | — |
| `practice/sql/sql-plan-audit.md` | **Orchestrator.** Audits **and extends** `practice/sql/PLANNING.md` against `_sql-plan-standard.md` — four cold specialists (learning-design · coverage-and-steps · counts-and-truth · loop-and-fence), history gate, single commit. `coverage-and-steps` writes the new steps for coverage sections nothing claims yet, so the plan grows as SQL grows. The plan it maintains covers **exercises only** — notes, Q&A and simulations are separate tracks Victor runs himself. | `_sql-plan-standard.md`, `practice/sql/PLANNING.md`, `notes/sql/coverage/junior.md`, `ROADMAP.md`, `PROGRESS.md`, `sql-exercises-prompt.md`, the exercise files (as evidence, never edited) | `practice/sql/PLANNING.md` |
| `practice/sql/sql-exercises-prompt.md` | `practice` mode: generates SQL exercises for the current step. `review` mode: grades my answers, scores them, and logs every ⚠️/❌ concept. Config is exactly four keys — `MODE`, `TOPIC`, `COUNT`, `FILE`; focus and review come from the step in `PLANNING.md`, never pasted. **Writes no notes and no Q&A** — those are separate tracks. | `practice/sql/PLANNING.md` (the step: topic, count, focus), `notes/sql/coverage/junior.md`, `PROGRESS.md`, the flat exercise files `practice/sql/NN-name.sql` | **Mode-conditional — the close-out checks only its own mode's list.** `practice` mode: `practice/sql/NN-name.sql`. `review` mode: `practice/sql/MISTAKES.md` + the SQL table in `PROGRESS.md`. Naming the other mode's file as "not applicable" is required; silently counting it as satisfied is not. |
| `practice/simulations/simulation-generator-prompt.md` | Creates new timed test specs (Angular / Spring Boot / SQL) in the existing format — the producer for the simulation bank. | `practice/simulations/{type}/` (existing specs), `practice/simulations/TRACKER.md` | new `practice/simulations/{type}/NN-*.md`; rows + counts in `practice/simulations/TRACKER.md` |
| `practice/simulations/simulation-review-prompt.md` | Grades a finished timed simulation, gives a 3-score ideal solution, and adds questions only to the selected-level Q&A bank. `hint` mode guides mid-test. | the simulation spec, tracker, selected-level Q&A, + my pasted code | tracker, spec header, selected-level interview-prep pair |
| `practice/interview/code-review-prompt.md` | Generates a flawed snippet to critique, grades the review, and records gaps only in the selected-level Q&A bank. | snippet generated fresh; selected-level Q&A | selected-level interview-prep pair |
| `practice/interview/simulator-prompt.md` | Runs a live mock **technical** interview from one selected-level Q&A bank, scores each answer, and tracks weak areas. | `interview-prep/{LEVEL}/{lang}/*.md`, `interview-prep/projects/*`, session log | session log |
| `practice/interview/hr-screen-prompt.md` | Runs a live mock **HR** call (stage 2): motivation, career-change story, availability, salary, "why us". Non-technical. | profile + situation from `_shared-context.md`, `ROADMAP.md` | `interview-prep/hr-screen.md` (polished answers) **when the run produced any — if it did not, the close-out says so explicitly rather than passing on an empty list** |

### Strategy — keep the plan accurate (`tracking/`) and apply (`apply/`)

Two sub-purposes, two subfolders. `tracking/` keeps the hub files (`PROGRESS.md`, `ROADMAP.md`)
accurate; `apply/` produces the job-application material.

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `strategy/tracking/_concept-extraction-standard.md` | *Internal.* The Format A/B/C **concept-extraction contract** each per-project subagent runs when `progress-update` fans out. Not runnable. | — | — |
| `strategy/tracking/progress-update-prompt.md` | Reconciles PROGRESS.md with what each PLANNING.md declares (never the code — it is blind to it by design) — an orchestrator that fans out one cold subagent per project (+ one for SQL; it reads the small simulations tracker itself), then merges. Run before `plan-audit`. | `_concept-extraction-standard.md`, all `PLANNING.md` files, `practice/sql/`, `practice/simulations/TRACKER.md` | `PROGRESS.md` |
| `strategy/tracking/_roadmap-standard.md` | *Internal.* The **shared roadmap contract** `roadmap-review` reads: what ROADMAP is vs PROGRESS/coverage, stable vs living sections, gate-based sequencing (no dates), canonical study-block orders. Not runnable. | — | — |
| `strategy/tracking/roadmap-review-prompt.md` | Keeps ROADMAP forward-looking and gate-based (no stale dates); checks project sequence and study-block tables vs coverage. **Orchestrator:** two cold fact-gatherers (gap analysis + active-PLANNING summary) feed the doer so coverage-junior.md and PLANNING.md never load into its context; the doer applies edits, then two sequential cold reviewers — mechanical (date scan, study order, LeetCode gate; reads only ROADMAP + standard) and cross-file (gaps, gates, SQL table, phase markers) — re-verify the invariants and fix ROADMAP. | `_roadmap-standard.md`, `notes/coverage/junior.md`, `PROGRESS.md`, the active `PLANNING.md` | `ROADMAP.md` |
| `strategy/apply/_application-standard.md` | *Internal.* The **shared job-application standard** both `cv` and `linkedin` read: expert stance, sources (incl. the existing CV in `personal/job-search`), bullet format, ATS/skills keyword pool, Spanish voice rules, defensibility rule, project-selection heuristic. Not runnable. | — | — |
| `strategy/apply/cv-prompt.md` | `create` / `review` / `tailor` the one-page Spanish CV (ATS-checked). `tailor` adapts it to a pasted job offer with a `HAVE / PARTIAL / MISSING` gap analysis, and feeds that offer into the job-market evidence. | `_application-standard.md`, `PROGRESS.md`, `ROADMAP.md`, `notes/cv/cv-bullets.md`, the existing CV in `personal/job-search/` | Saves the CV to `personal/job-search/` **outside the repo** (never committed, so the close-out checks the path's **mtime is from this run** — existence alone passes on a file an earlier run left): `master/` for create/review, `applications/` for tailor. `tailor` also appends the posting to `notes/prompts/_internal/_job-market-evidence.md` |
| `strategy/apply/linkedin-prompt.md` | Drafts every LinkedIn section + 3 posts, ready to paste. | `_application-standard.md`, `PROGRESS.md`, `ROADMAP.md` | **Output only** — LinkedIn text (not stored in the repo). **No repo file, so the close-out has nothing to check: instead name each section actually drafted (headline, about, experience, projects, skills, 3 posts) against the set this prompt owes.** |
| `strategy/apply/cover-letter-prompt.md` | `letter` (formal one-page *carta de presentación*) / `message` (short 5–6 line recruiter message) tailored to a pasted offer, in the same Spanish voice as the CV. | `_application-standard.md`, `PROGRESS.md`, `ROADMAP.md`, the pasted offer | **Output only** — cover-letter/message text (not stored in the repo). **No repo file, so the close-out names the mode's obligations instead: the letter/message itself, and that it was tailored to the pasted offer rather than generic.** |
| `strategy/apply/profile-readme-prompt.md` | `sync` (pull in fact deltas only) / `optimize` (full re-evaluation against the job target) for the GitHub profile README. The repeatable entry point so the coding agent never needs to be re-briefed on that repo's context each time. | the profile repo's `{platform-adapter}` (standing context + gap list), that repo's `README.md`, `PROGRESS.md`, the active project's `PLANNING.md`, `personal/job-search/internship-daw.md` | Edits `dev/portfolio/VMNunez/README.md` + the external adapter's gap list directly (separate repo, never committed from here — the close-out checks both paths' **mtime is from this run**, not just that they exist) |
| `strategy/apply/tracker-prompt.md` | `log` a new application / `update` an outcome + feedback / `analyze` the tracker for patterns. Records the job search as data and surfaces skill gaps to feed `evidence-intake`. | `_application-standard.md`, the local tracker in `personal/job-search/` | Writes `personal/job-search/tracker.csv` + `applications/<empresa>-<puesto>/` **outside the repo** (never committed — close-out checks **mtime is from this run**); `analyze` writes nothing, so it names its findings instead of passing on an empty list, and suggests `evidence-intake` |

---

## How the prompts feed each other

The key thing to understand: **several prompts consume files that other prompts generate.** If a
producer has not run (or is stale), its consumers produce wrong results. Run producers first.

Each generated file, with who writes it and who depends on it:

- **`notes/coverage/junior.md`, `notes/coverage/middle.md`, `notes/coverage/senior.md`** — written by
  `coverage-prompt` / `coverage-audit-prompt`. Level-aware notes and interview-prep consume the selected
  mirror; current project planning, roadmap review, and SQL practice intentionally consume junior.
  *Coverage is the root — downstream work assumes the selected level is correct.*
- **`notes/prompts/_internal/_job-market-evidence.md`** — written by `evidence-intake` (dedicated intake) and
  `cv-prompt` (tailor mode, as it tailors to each offer) → read by `coverage-prompt`, `coverage-audit`,
  and both their subagents, plus `interview-prep-audit`'s market-analysis stage. *Real postings that
  anchor coverage and the interview Q&A to the market.*
- **`PROGRESS.md`** — written by `progress-update` (and by the coding agent after each step in the daily
  session) → read by `plan-audit`, `roadmap-review`, `portfolio-audit`, `cv`, `linkedin`,
  `sql-exercises`. *Stale PROGRESS = wrong gap analysis in `plan-audit` and `roadmap-review`.*
- **`{project}/PLANNING.md`** — written by `plan-audit` (new mode) → read by `readme-audit`,
  `review-audit`, `portfolio-audit`, `progress-update`, `roadmap-review`. *It is the contract
  the whole project is checked against.*
- **`PROJECT-BACKLOG.md`** — written by `review-audit` → read by `portfolio-audit` (open
  High/Medium tasks block the "ready" verdict).
- **`notes/cv/cv-bullets.md`** — written by `portfolio-audit` → read by `cv-prompt` (one polished
  bullet per project, reused as-is).
- **`interview-prep/{LEVEL}/en/*.md` + `{LEVEL}/es/*.md`** — written by `interview-prep-audit`,
  `notes-and-interview-prep`, `simulation-review`, `code-review` → read by `simulator`.
- **`interview-prep/projects/*.md`** — written by `portfolio-audit` → read by `simulator`.
- **`practice/sql/PLANNING.md`** — written by `sql-plan-audit` → read by `sql-exercises` (every run
  takes its topic, count and focus from the current step) and by `simulation-generator` in
  `TYPE = sql` (a SQL test may only use techniques from steps already closed). *This is the SQL
  track's contract, the same role a project's `PLANNING.md` plays.*
- **`practice/sql/MISTAKES.md`** — written by `sql-exercises` in `review` mode (one row per failed
  concept, with its `coverage-junior.md` section and how many times it has come back) → read by the revision
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
coverage-prompt / coverage-audit ─► notes/coverage/{junior|middle|senior}.md
        │
        ├─► notes-plan ─► notes-audit (one TOPIC + LEVEL + NOTE) ─► en-author → en-reviewer → translator → es-reviewer ─► one EN/ES pair ─┐
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

  notes/sql/coverage/junior.md ─► sql-plan-audit ─► practice/sql/PLANNING.md ─┬─► sql-exercises ─► NN-*.sql
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
1. `coverage-prompt` — define/refresh exactly one topic and level (Angular and Angular Material separately)
2. `notes-plan-prompt` with the same `TOPIC + LEVEL` — generate or refresh the persistent study map
3. `notes-audit` with `TOPIC + LEVEL + NOTE` — build exactly one planned English/Spanish pair
4. Repeat `notes-audit` for every pending plan entry, in dependency order, until the selected
   `notes-plan-{LEVEL}.md` contains only `Status: complete`
5. `interview-prep-audit` with the same `LEVEL` and topic `FILE` — build the isolated level Q&A;
   it stops if that topic's notes plan is stale, pending, or missing either language file
6. `notes-and-interview-prep` — reconcile the completed notes and Q&A in both directions
7. After all topics have that level, run `coverage-audit`, then `roadmap-review`

The unit changes at each stage: coverage and planning process one **topic + level**; `notes-audit`
processes one **planned file pair**; `interview-prep-audit` processes the completed **topic + level**
Q&A (deep work remains one section per agent). Never launch interview prep merely because one note
finished—the complete selected-level notes plan is its prerequisite.

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
processes every target in order, one commit per target. Full rules: `notes/prompts/_internal/_batch-mode.md`.

- **Supports `all`:** `interview-prep-audit`,
  `notes-and-interview-prep` (`TOPIC`/`FILE = all`); `readme-audit`, `review-audit`,
  `portfolio-audit` (`PROJECT_PATH = all`); `plan-audit` (`PROJECT = all`, **review mode only**);
  `sql-exercises` (`TOPIC = all`, **practice mode only**),
  `simulation-generator`, `code-review` (`TYPE = all`).
- **One target only:** `coverage-prompt`, `notes-plan-prompt`, and `notes-audit`.
- **Already global (no `all` needed):** `coverage-audit`, `roadmap-review`, `cv`,
  `linkedin`, and `simulator` full mode — these cover everything in one run by design.
  `progress-update` defaults to `MODE = active` (only the in-progress project); set `MODE = all`
  for the full global pass.
- **Single-shot (not batchable):** `simulation-review` and `hr-screen` — each needs your pasted code
  or a live back-and-forth, so they run one at a time.

---

## Runtime-neutral reasoning tiers

Every orchestrator specifies a canonical reasoning tier on each dispatch. Platform adapters decide
how that tier is fulfilled; canonical prompts never name a vendor model or agent API. The criterion:

> **If the output's quality is guaranteed by structure — an explicit standard, a report contract, a
> trace gate that rejects incomplete work — tier down. If it is guaranteed only by judgment — writing
> prose, designing, translating, deciding what matters — use `deep`.**

- **mechanical** — pure command-running and deterministic formatting.
- **standard** — pattern-matching and conformance against an explicit standard: concept extraction,
  notes inspect/translate/es-review, README review + consistency check, roadmap fact-gathering.
- **deep** — everything that authors, rewrites, or judges: plan author + advisor + specialists,
  notes/README/interview-prep authors, portfolio author + reviewer, roadmap reviewers, and project
  flow/security reviewers.

A new prompt must pick a canonical tier per dispatch. Re-tiering an existing dispatch needs a real
run's self-report as evidence, per the frozen-prompts rule.

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
