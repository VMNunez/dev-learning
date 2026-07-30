# Progress Update Prompt — orchestrator

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

Run this **inside the supported agent runtime**. It reconciles `PROGRESS.md` with what each project's `PLANNING.md`
**declares** — never with the code; the extraction standard forbids subagents from reading it, so a
fixed bug or refactor is invisible here until the plan records it. Hands-off: an orchestrator
that **fans out one cold subagent per project** to extract that project's concepts, plus one subagent
for SQL, then **merges everything itself** and commits. No project's PLANNING.md ever loads into the
orchestrator's own context — it stays light and only holds PROGRESS.md plus the small simulations
tracker (which it reads directly — a subagent for one tiny file costs more context than it saves).

> **▶ Run first:** nothing — this is a producer. Run it *before* `plan-audit` and `roadmap-review`, which read `PROGRESS.md`.

> **Run-start check (step 0):** before anything else, run the check in `notes/prompts/_internal/_pipeline-self-report.md` — read this prompt's own `_last-run-report` and, if its `Status` is `open`, surface that finding in one line before proceeding.

One optional setting — pick a `MODE` (see below); if you omit it, the prompt defaults to `active`.

Run this when PROGRESS.md feels out of sync: after finishing a step or a project, after a long block
of sessions, or before running `plan-audit` (its gap analysis reads PROGRESS.md). If
PROGRESS.md is incomplete, that gap analysis is wrong.

**Coverage is read for one thing only: counting evidence markers (D8).** Coverage defines what Victor
must *learn*; PROGRESS.md records what he *has learned*. The two stayed separate until the `✅ NN`
evidence marker made the coverage file carry demonstrated state as well as scope. So this prompt
counts markers and totals per topic and level, and reads nothing else from those files — never a
concept, never a bullet's text. A stale or incomplete coverage level affects only its own denominator
in the D8 table, never any other section.

**Internal piece this orchestrates** (never launched directly):
`_concept-extraction-standard.md` — the Format A/B/C extraction contract each project subagent runs.

---

````
## Configuration — edit only this block

MODE = [active | all]

## active (default) — audit ONLY the current in-progress project. Completed projects are assumed
##                    already recorded. Fast everyday refresh after a step or a session block.
## all             — audit every project (all completed + the active one). Run periodically, or
##                   before plan-audit, to catch anything missed in completed projects.

SQL (Step B) and simulations (Step C) are always audited, in both modes.

Use MODE wherever the prompt refers to {MODE}.

---

> **Branch guard (step 0):** run `git branch --show-current`. PROGRESS.md commits on whatever branch
> is currently active (the shared session rules) — a feature branch is the normal case; name it in the final
> report. If you are on **`main`**, stop and ask Victor which branch to use — `main` never receives
> direct commits, only merges via PR.

You are the **orchestrator**. You read `PROGRESS.md` once (to learn its structure and what is already
recorded), dispatch subagents to gather facts, then merge their reports into PROGRESS.md yourself and
commit. You never read a PLANNING.md directly — the project subagents do that and hand you back a
short concept list.

First read `notes/prompts/strategy/tracking/_internal/_concept-extraction-standard.md` so you know the exact
contract each project subagent follows and the shape of what it returns.

---

## What PROGRESS.md is — and is not

Tracks: the projects table · per-project concept summaries (one paragraph each) · technology sections
(the detailed concept list by topic: Angular, Java, Spring Boot, CSS, SQL…) · simulation progress ·
complementary skills · the professional-level matrix by topic.

Does NOT contain: explanations (→ notes/) · future learning (→ coverage-senior.md) · architecture or
strategy (→ ROADMAP.md).

**Entry format:** one line per concept. Key syntax/API in backticks, optional short dash-clause.
- `signal()`, `signal.set()`, `signal.update()` — name is clear, no explanation needed
- `effect()` — runs a side effect automatically when a tracked signal changes
- `@PreAuthorize("hasRole('X')")` — method-level authorization; checked after JWT is validated

Never multi-line. If a concept needs more than one line, it belongs in notes/, not here.

---

## Step 0 — Read the current state (orchestrator, once)

Read:
1. `PROGRESS.md` — the current version. Learn its exact structure, section order, and format. Note
   the projects table and each project's status. Treat statuses as a starting point — the subagents
   verify them.
2. The "Current study progress" and "Active project" lines of the shared session rules — general orientation only
   (which project is active). the shared session rules is already loaded into your context by the supported agent runtime; do **not**
   re-read the file. It is updated by hand and may lag; do not treat it as authoritative.
3. For each topic row in `Professional level by topic`, inspect the selected level's persistent notes
   plan and interview-prep fingerprint/run state at headings/status level only. These artifacts prove
   consolidation; do not load their prose.

Decide the project scope from `{MODE}`:
- **active** — only the in-progress project (⏳). Find it in the PROGRESS.md projects table or the
  the shared session rules "Active project" line.
- **all** — every project below.

Project paths, in order:
- Format A (Angular): `projects/01-todo-list`, `projects/02-weather-app`, `projects/03-expense-tracker`,
  `projects/04-meal-finder`, `projects/05-task-manager`, `projects/06-hr-portal`
- Full-stack: `projects/07-timetrack` (Format B) and any later ones in PROGRESS.md (Format C if they
  have a numbered Section 3, else Format B)

For each project in scope, lift its `PROGRESS_HINT` from the PROGRESS.md you just read: the project's
`### Project NN` summary heading, plus any `### Project NN` sub-heading inside a technology section.
These few lines are all a project subagent needs for the Format B step-status fallback.

---

## Step A — Fan out one subagent per project

For **each** project in scope, launch a `role-appropriate` subagent, `execution: foreground`,
**`reasoning tier: standard`** — extraction is pattern-matching against an explicit standard (find the concept
lines, route with the Step 4 table), not judgment; the report contract + the orchestrator's
re-dispatch rule catch a bad report, so the top model buys nothing here. In
`MODE: all`, launch them all in a single message so they run in parallel (they only read — no
git-index contention); in `MODE: active` there is just one. Each subagent's instruction:

> Read `notes/prompts/strategy/tracking/_internal/_concept-extraction-standard.md` and execute it in full for
> `PROJECT_PATH = «path»`. Here is the `PROGRESS_HINT` for this project (use it only for the Format B
> step-status fallback):
> ```
> «the summary heading + technology sub-heading lifted in Step 0»
> ```
> Read ONLY the standard and this project's `PLANNING.md` — not the project's code, README, or any
> other file. Do not read or write PROGRESS.md; do not commit. Report back **only** the four items
> the standard specifies — the read verification (line count + read-to-EOF), the format detected,
> the confirmed step status, and the concept table (Concept · Section · From step) — with no
> PLANNING.md excerpts and no reasoning trace. If the read verification is missing or the subagent
> could not reach EOF, re-dispatch it once quoting Step 0 — never merge concepts from a possibly
> truncated read.

Wait for every project subagent to finish and collect its report. Keep the reports — Step D merges them.

---

## Step B — Subagent: audit SQL exercises

Launch one `role-appropriate` subagent, `execution: foreground`, **`reasoning tier: mechanical`** — it runs two
git commands and formats their output; no judgment involved, and the zero-file guard already covers
the one failure mode:

> Audit the SQL exercises **as they exist in committed history** — count both the active branch
> (`HEAD`) and `main`, and take the **higher count per file**. Since 2026-07-14 study materials
> commit on the active branch, so new SQL lands on `HEAD`; but SQL committed under the previous rule
> went straight to `main` and may not be merged into the current branch yet. Counting a single ref
> silently drops whichever topics live only on the other one. Do NOT count uncommitted working-tree
> files.
> **Count without loading file contents into your context** — two commands per ref:
> - List the SQL files: `git ls-tree -r --name-only HEAD -- practice/sql/ sql/`, then the same with
>   `main` (double pathspec: covers the current home `practice/sql/` and the legacy `sql/` until the
>   one-time migration is done). **Guard: if BOTH refs return 0 files, ABORT the SQL step and report
>   it — never rewrite the tracker table with zeros.**
> - Count exercise headers per file: `git grep -cE "^-- (Exercise [0-9]+:|#[0-9]+ \|)" HEAD -- practice/sql/ sql/`,
>   then the same with `main` (output is `<ref>:<path>:<count>`). Only `git show` a file if its count
>   looks wrong (e.g. zero for a file that clearly holds exercises) — and then only to recheck the
>   headers, not to study it.
>
> Two file shapes exist: a flat file (`practice/sql/01-basics.sql`) or a subfolder (`practice/sql/02-joins/exercises.sql`).
> The regex covers the two header patterns in use:
> - `-- Exercise N:` at line start (sql-exercises-prompt topics: joins, group-by, subqueries…)
> - `-- #N |` at line start, N one or more digits — `-- #1 |`, `-- #01 |`, `-- #40 |` (the basics file)
>
> Return **only** one row per topic: `| Topic | Folder | Exercises (exact count) |`, using the real path in the
> Folder column (`practice/sql/01-basics.sql` for flat, `practice/sql/02-joins/` for subfolders; if a file
> still lives at the legacy `sql/...` on either ref, report it under its `practice/sql/...` home). Only list topics
> found by the commands above. Do not estimate; do not assign a status — the orchestrator does that.

Wait and collect.

---

## Step C — Audit simulations (orchestrator, directly)

No subagent here — `practice/simulations/TRACKER.md` is one small file, and a subagent round-trip would cost
more context than reading it. Read it yourself and note: total simulations completed (✅ Pass or
⚠️ Borderline both count as completed), split by type — Angular / Spring Boot / SQL — each as
`X Pass, X Borderline, X Fail`. Count the **`Status`** column, never `Self-assessment` — the two use
different scales (Status is Pass/Borderline/Fail; Self-assessment is Solid/Good/Weak/Failed), so the
wrong column yields plausible numbers and no error. Rows still ⏳ Pending count as nothing. If
TRACKER.md does not exist or shows 0, record all zeros.

---

## Step D — Merge everything into PROGRESS.md (orchestrator)

You now hold every subagent report and the full current PROGRESS.md. Merge:

### D1 — Concepts (from Step A reports)

For each concept in each project report, check whether it already appears in the target technology
section of PROGRESS.md. Add only genuinely missing concepts.

> **`**Concept learned:**` lines are high-level summaries.** PROGRESS.md is often more granular (the
> line says "JWT flow" but PROGRESS.md already has 10+ bullets on JWT internals). If a summary label
> is already covered by existing detailed bullets, treat it as accounted for — do **not** add it as a
> new one-liner. Only add a specific concept genuinely absent with no equivalent entry.

For the in-progress project, do not add concepts from the step still in progress — unless one already
appears in PROGRESS.md (learned early), in which case leave it as-is, never remove it.

### D2 — Creating a missing technology section

If a concept needs a section that does not exist yet, create it (same heading + one-line-bullet format
as the others).

**Java section, first creation — special case.** Before adding new Java concepts, scan the Spring Boot
section for entries that are *pure Java* constructs per the standard's definition (`Optional<T>`,
`long` vs `Long`, primitive/wrapper types, `try/catch`, access modifiers, default field values like
`private Boolean active = true`). **Move** those from Spring Boot to the new Java section — remove from
Spring Boot, add to Java. Log each as Removed under Spring Boot and Added under Java in the diff. Place
the new Java section after Spring Boot; place a new General section after SQL. Only after this cleanup,
add remaining new Java concepts.

### D3 — SQL section (from Step B report)

The SQL section has two parts — keep both:
- **Part A — SQL concepts learned** (`SELECT DISTINCT`, `ORDER BY`, `IS NULL`…). These come from
  project PLANNING.md SQL steps (Step A), not the exercises folder. Leave untouched here.
- **Part B — Exercises tracker.** Rewrite it from the Step B counts, in this format:

  ```
  ### Exercises completed

  X total exercises across Y topics

  | Topic | Folder | Exercises | Status |
  |-------|--------|-----------|--------|
  | basics / SELECT | practice/sql/01-basics.sql | N | solid ✅ |
  | joins | practice/sql/02-joins/ | N | in progress ⏳ |
  ```

  Status rules:
  - Keep any topic already `solid ✅` — never downgrade.
  - A topic being converted from prose to the table for the first time → `in progress ⏳` (solid needs
    an explicit sql-exercises-prompt review scoring above 80% — it cannot be inferred).
  - Any topic with a file/folder not yet in PROGRESS.md → `in progress ⏳`.
  - Victor upgrades to `solid ✅` manually after a review scores above 80%.

  If the sub-section does not exist, create it. If it exists in another format, rewrite it as this
  table (one of the few cases where reformatting is allowed).

### D4 — Simulations section (from the Step C counts)

You are the **safety net** here, not the primary writer: `notes/prompts/practice/simulations/simulation-review-prompt.md`
(Step 5) already refreshes this section when a simulation is reviewed, because that is where the
Pass/Borderline/Fail verdict is decided. Your job is to catch what it missed. Both must produce
**identical** output — if this format or Step C's counting rules ever drift from that prompt's, the
two will overwrite each other on every run. Change them together or not at all.

Update the counts if the section exists; otherwise add:

```
## Simulations

- Angular: X completed (X Pass, X Borderline, X Fail)
- Spring Boot: X completed (X Pass, X Borderline, X Fail)
- SQL: X completed (X Pass, X Borderline, X Fail)
- Total: X / 15 minimum target
```

All zeros if none — that makes it visible the block has not started.

### D5 — Projects table and headings (from Step A step-statuses)

- **Projects table:** fix any status marker that disagrees with a subagent's confirmed status. Done ✓
  = all learning steps complete; ⏳ = at least one still in progress; 🔜 = not started.
- **Per-project summary heading** (`### Project NN` in the summaries block):
  - Done ✓ before this run: touch only if factually wrong.
  - Still ⏳ after this run: update the parenthetical to the actual status (e.g. "Steps 1–3 done,
    Step 4 in progress") and verify its `**New concepts:**` line covers every extracted concept.
  - Newly completed this run (was ⏳, now Done ✓): **remove** the step-tracking parenthetical — the
    format becomes `### Project NN — Name`, matching projects 01–06.
- **Technology sub-headings:** if a section groups a project with a sub-heading like
  `### Project 07 — TimeTrack (Step 1 ✓ Step 2 ✓ Step 3 ✓ Step 4 in progress ⏳)`, update its
  parenthetical to the confirmed status (canonical: `(Step 1 ✓ … Step N in progress ⏳)`). If the
  project just became Done ✓, remove the parenthetical. Summary heading and sub-headings must stay in
  sync.

### D6 — General merge rules

- Keep the exact structure and section order of the current PROGRESS.md.
- Keep existing content — remove nothing unless factually wrong or a duplicate.
- Do not reformat correct entries; do not expand entries — one line per concept, maximum.

### D7 — Professional level by topic

Refresh the matrix without duplicating coverage concepts:

- `Knowledge consolidation`: count `complete` and total numbered entries in the active level's
  persistent notes plan; report whether the selected-level Q&A fingerprint is current.
- `Practical evidence`: preserve explicit evidence already recorded and add only verified project,
  exercise, simulation, or unaided-recall evidence from this run.
- `Next gate`: name the first unmet consolidation or practical condition.
- Never promote `building` to `demonstrated` from file completion alone. Promotion requires all notes
  entries complete, current selected-level Q&A, and at least one explicit unaided practical or
  explanation check for that topic.
- Never activate middle while junior is not demonstrated, or senior while middle is not demonstrated.
- Middle promotion requires explicit autonomous ownership evidence. Senior promotion requires real
  production, platform, or multi-team ownership; notes, interview prep, and personal projects alone
  can never produce `Senior — demonstrated`.
- If evidence is insufficient, keep the existing conservative level and state what remains open.
- **The D8 percentages never promote a level.** A topic at 100% demonstrated coverage stays
  `building` until the unaided practical or explanation check in the rules above is met. The ratio is
  an instrument, not a gate; treating it as one would let file bookkeeping award a level that no
  demonstration backs.

### D8 — Coverage demonstrated by topic and level

Refresh the `Coverage demonstrated` table — one row per topic, one column per level, each cell the
share of that level's coverage bullets carrying an evidence marker.

**This step owns the table's format; it is not its only writer.** Four others keep it current as they
work — the `coverage-mark` and `coverage-bullet-add` skills for a single bullet, `coverage-prompt` for
one topic+level, `coverage-audit` for a whole level. Each defers to the format, counting rule, and `*`
convention defined here, so all five must produce identical output; change this block and they follow,
change one of them alone and they fight. Your role is the **safety net**: recount every cell and fix
what a run missed. A cell you correct is a `Corrected` in the Step E diff, not an `Added`.

Count from the **topic** files, `notes/{topic}/coverage/{LEVEL}.md`, never from the
`notes/coverage/{LEVEL}.md` mirror: the mirror can lag its topics, and a denominator that depends on
which file you opened is not a measurement. Two counts per file, no file contents loaded:

```bash
grep -cE '^- ' notes/{topic}/coverage/{LEVEL}.md      # total   — the denominator
grep -cE ' ✅ [0-9]{2}$' notes/{topic}/coverage/{LEVEL}.md   # marked  — the numerator
```

Cell format is exactly `marked/total (P%)`, `P` rounded to a whole number — `34/86 (40%)`. A level
with no file yet is `—`, not `0/0`.

**Provisional denominators.** Read `notes/prompts/_internal/_run-tracker.md`. If the `Coverage {J|M|S}`
cell for that topic and level is empty, the level was never authored by the coverage pipeline, so its
total is a stub that will move. Suffix that cell with `*` and keep the footnote below the table
explaining the mark. Remove the `*` once the tracker records a run.

Write the table with the totals row, immediately after `Professional level by topic`:

```
## Coverage demonstrated

Share of each level's coverage bullets applied in project code (the `✅ NN` marker). Counted from the
per-topic coverage files. This is evidence of application, not of study, and it never promotes a
level in the matrix above.

| Topic | Junior | Middle | Senior |
|---|---|---|---|
| Angular | 34/108 (31%) | 0/13 (0%)* | 0/6 (0%)* |
| … | | | |
| **Total** | **34/1213 (3%)** | … | … |

`*` provisional denominator — that level's coverage has not been generated yet.
```

Topic rows in the same order as the matrix above, so the two tables read together.

---

## Step E — Apply the edits and print the diff

Apply the merge as **targeted in-place edits** (Edit tool, one edit per change) — do NOT rewrite the
whole file. You already hold the current PROGRESS.md from Step 0; rewriting it wholesale wastes
output tokens and risks silently dropping sections. After editing, run `git diff PROGRESS.md` and
skim it — every hunk must correspond to a row in the table below; an unexplained hunk means an edit
went wrong. Then print:

**Changes made:**
| Section | Added | Corrected | Removed |
|---------|-------|-----------|---------|
| Professional level by topic | | | |
| Coverage demonstrated | | | |
| Projects table | | | |
| Angular | | | |
| Java | | | |
| Spring Boot | | | |
| CSS | | | |
| Deployment | | | |
| TypeScript | | | |
| Architecture | | | |
| Security | | | |
| General | | | |
| SQL | | | |
| Simulations | | | |

- **Added** = anything new — missing concepts, updated SQL counts, updated simulation counts, new
  per-project summary data.
- **Corrected** = entries that were wrong (wrong project number, stale step status, exercise count
  raised to the file's real value).
- **Removed** = duplicates or factually wrong entries.
- Java section created for the first time: log each moved entry as Removed under Spring Boot and Added
  under Java.

Write "—" for an unchanged section; skip rows for sections that do not exist in PROGRESS.md.

**Low-confidence statuses:** if any project subagent derived its step status from the
`PROGRESS_HINT` fallback (or the hint overrode the ✅ markers) rather than from ✅ markers alone,
add one line after the table naming the project and suggesting Victor add the missing ✅ to that
step's heading in PLANNING.md — that makes the next run self-sufficient.

---

## Step F — Commit

PROGRESS.md follows the active branch per the shared session rules (2026-07-14 — `main` only receives merges via
PR). Per the commit-hygiene rule, run
`git status` right before the add and again right before the commit — confirm nothing but
PROGRESS.md gets staged (`git restore --staged` anything else). Then:

```
git add PROGRESS.md
```

```
git commit -m "docs: refresh PROGRESS.md — [main change, e.g. 'add project 07 Spring Boot concepts, fix projects table']"
```

> **Auto-commit note.** Victor's global rule is "never auto-commit." This orchestrator may run the
> commit itself (same lift already granted to the notes-audit orchestrator) **only when it has
> finished a clean merge**. If anything is uncertain, print the two blocks above and let Victor run
> them instead.

### Final step — pipeline self-report

After everything above is done, read `notes/prompts/_internal/_pipeline-self-report.md` and execute it for this
run — write the report file in this orchestrator's folder, commit it on its own, and print the five
bullets in chat.

````
