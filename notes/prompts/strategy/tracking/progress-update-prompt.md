# Progress Update Prompt — auditor (orchestrator)

> **This prompt writes one section (demoted 2026-08-05, REC-039).** `PROGRESS.md` is maintained
> incrementally by the closing rituals (`step-complete`, `backlog-task-close`, `coverage-mark`,
> `coverage-bullet-add`, `study-block-close`, `sql-grade`, `simulation-review`), each writing its own cell in the session
> that produced it. So this prompt **audits**: it measures every section against its real sources and
> **reports the drift**, naming the writer that owns the repair. It edits exactly one section itself —
> `Professional level by topic`, the one that needs all 13 topics at once and that no ritual can
> compute. Anything else would put two writers on one cell, where the second one wins by accident and
> nothing announces it. The ownership table below is the contract.

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

Run this **inside the supported agent runtime**. It audits `PROGRESS.md` against what each project's
`PLANNING.md` **declares** — never against the code; the extraction standard forbids subagents from
reading it, so a fixed bug or refactor is invisible here until the plan records it. Hands-off: an
orchestrator that **fans out one cold subagent per project** to confirm that project's step status,
plus one subagent for SQL, then measures the rest itself. No project's PLANNING.md ever loads into the
orchestrator's own context — it stays light and only holds PROGRESS.md plus the small simulations
tracker (which it reads directly — a subagent for one tiny file costs more context than it saves).

> **▶ Run first:** nothing — this is a producer. Run it *before* `plan-audit`, `cv-prompt` and `roadmap-review`, which read `PROGRESS.md`.

> **Run-start check (step 0):** before anything else, run the check in `notes/prompts/_internal/_pipeline-self-report.md` — read this prompt's own `_last-run-report` and, if its `Status` is `open`, surface that finding in one line before proceeding.

One optional setting — pick a `MODE` (see below); if you omit it, the prompt defaults to `active`.

Run this when PROGRESS.md feels out of sync: after finishing a step or a project, after a long block
of sessions, or before `cv-prompt` and `project-brief`, which build on it. **A clean drift report is
the useful outcome** — it is what closes gate G6, and it costs one run to obtain.

**Coverage is read for one thing only: counting evidence markers (D8).** Coverage defines what Victor
must *learn*; PROGRESS.md records what he *has learned*. The two stayed separate until the `✅ NN-slug — {evidence}`
evidence marker made the coverage file carry demonstrated state as well as scope. So this prompt
counts markers and totals per topic and level, and reads nothing else from those files — never a
concept, never a bullet's text. A stale or incomplete coverage level affects only its own denominator
in the D8 table, never any other section.

**Internal piece this orchestrates** (never launched directly):
`_concept-extraction-standard.md` — its Steps 0–2 (read-to-EOF, format detection, step status) are what
each project subagent runs here. **Its Step 3 belongs to `step-complete`, not to this prompt, and its
Step 4 is a tombstone** — see D1.

---

````
## Configuration — edit only this block

MODE = [active | all]

## active (default) — audit ONLY the current in-progress project. Completed projects are assumed
##                    already recorded. Fast everyday refresh after a step or a session block.
## all             — audit every project (all completed + the active one). Run periodically, or
##                   before a portfolio gate, to catch anything missed in completed projects.

SQL (Step B) and simulations (Step C) are always audited, in both modes.

Use MODE wherever the prompt refers to {MODE}.

---

> **Branch guard (step 0):** run `git branch --show-current`. PROGRESS.md commits on whatever branch
> is currently active (the shared session rules) — a feature branch is the normal case; name it in the final
> report. If you are on **`main`**, stop and ask Victor which branch to use — `main` never receives
> direct commits, only merges via PR.

You are the **orchestrator**. You read `PROGRESS.md` once, dispatch subagents to gather facts, measure
every section against its sources, write `Professional level by topic`, and report the rest as drift.
You never read a PLANNING.md directly — the project subagents do that and hand you back a step status.

First read `notes/prompts/strategy/tracking/_internal/_concept-extraction-standard.md` so you know the exact
contract each project subagent follows and the shape of what it returns.

---

## Who writes what in PROGRESS.md — the ownership contract

| Section | Written by | This prompt |
|---|---|---|
| `Professional level by topic` | **this prompt** (the whole table) · `step-complete` and `backlog-task-close` (the `Practical evidence` cell only, in session) | **writes** — see D7 |
| `Coverage demonstrated` | `coverage-mark` + `coverage-bullet-add` (the cells they touch, plus `Total`) · `coverage-prompt` (one topic+level) · `coverage-audit` (a whole level) | measures and reports (D8) |
| `Study progress` | `study-block-close` (both rows, recounted at the end of the 13:30 block) | measures and reports (D9) |
| `## Projects` | `step-complete` (the `Status` cell) · `plan-audit` (registers a new project's row) | measures and reports (D5) |
| `Practice completed` → `Exercise route` | `sql-exercises` (both branches) · `sql-grade` · `sql-step-close` · `sql-plan` (seeds the rows) | measures and reports (D3) |
| `Practice completed` → `Timed simulations` | `simulation-review` | measures and reports (D4) |
| `Useful resources`, the header prose | nobody automatic — Victor edits them by hand | untouched |

**Owning a format is not owning the write.** D8 below remains the authority on the coverage table's
format, counting rule and `*` convention — four other writers read it and defer to it. That stays
exactly as it is; what changed is that this prompt no longer *edits* the cells it specifies.

**A drift line is not a weaker outcome than an edit.** Every section above has a writer that computes
it from primary sources in the session that changed it; a second writer arriving days later with the
same arithmetic adds nothing, and one arriving with *worse* inputs silently destroys detail — the
`Status` cell of a project row is prose the ritual knows and a `✅` scan cannot reconstruct. So the
report names the owner, and the repair is one targeted re-run rather than a merge.

**The D-labels are deliberately not renumbered.** `coverage-mark`, `coverage-bullet-add`,
`coverage-prompt` and `coverage-audit` all cite "step D8" by name; D1 and D2 are tombstones so those
citations keep resolving.

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
   plan at headings/status/studied-field level and the interview-prep bank fingerprint plus lifecycle
   counts. Read the selected level's interview CORE route metadata too. These artifacts distinguish
   authored, refined and studied consolidation; do not load their prose.

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
`## Projects` table row — its `Status` cell, verbatim. That one cell is the whole hint, and it is all a
project subagent needs for the Format B step-status fallback.

---

## Step A — Fan out one subagent per project: confirm the step status

For **each** project in scope, launch a `role-appropriate` subagent, `execution: foreground`,
**`reasoning tier: mechanical`** — it locates `✅` markers against an explicit format contract and
returns three lines; the report contract plus the orchestrator's re-dispatch rule catch a bad report.
In `MODE: all`, launch them all in a single message so they run in parallel (they only read — no
git-index contention); in `MODE: active` there is just one. Each subagent's instruction:

> Read `notes/prompts/strategy/tracking/_internal/_concept-extraction-standard.md` and execute **Steps 0,
> 1 and 2 only** for `PROJECT_PATH = «path»`. Do not extract concepts — Step 3 is not yours, and Step 4
> is a tombstone. Here is the `PROGRESS_HINT` for this project, the `Status` cell of its PROGRESS.md
> row (use it only for the Format B step-status fallback):
> ```
> «the Status cell lifted in Step 0»
> ```
> Read ONLY the standard and this project's `PLANNING.md` — not the project's code, README, or any
> other file. Do not read or write PROGRESS.md; do not commit. Report back **only** the three items
> Step 5 keeps — the read verification (line count + read-to-EOF), the format detected, and the
> confirmed step status with its derivation note — with no PLANNING.md excerpts and no reasoning
> trace. If the read verification is missing or the subagent could not reach EOF, re-dispatch it once
> quoting Step 0 — never accept a step status from a possibly truncated read.

Wait for every project subagent to finish and collect its report. Keep the reports — D5 uses them.

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
>   it — never report a table of zeros as a finding.**
> - Count exercise headers per file: `git grep -cE "^-- (Exercise [0-9]+:|#[0-9]+ \|)" HEAD -- practice/sql/ sql/`,
>   then the same with `main` (output is `<ref>:<path>:<count>`). Only `git show` a file if its count
>   looks wrong (e.g. zero for a file that clearly holds exercises) — and then only to recheck the
>   headers, not to study it.
>
> Exercise files live one per topic inside their level's directory (`practice/sql/junior/01-basics.sql`).
> Two legacy shapes may still appear on `main`: a flat `practice/sql/01-basics.sql` or a per-topic
> subfolder `practice/sql/02-joins/exercises.sql` — report either under its level path.
> The regex covers the two header patterns in use:
> - `-- Exercise N:` at line start (sql-exercises-prompt topics: joins, group-by, subqueries…)
> - `-- #N |` at line start, N one or more digits — `-- #1 |`, `-- #01 |`, `-- #40 |` (the basics file)
>
> Return **only** one row per topic: `| Topic | Folder | Exercises (exact count) |`, using the real path in the
> Folder column (`practice/sql/junior/01-basics.sql`; if a file still lives at a legacy `sql/...`,
> flat `practice/sql/NN-...`, or per-topic-subfolder path on either ref, report it under its
> `practice/sql/{LEVEL}/...` home). Only list topics
> found by the commands above. Do not estimate; do not assign a status — the orchestrator does that.

Wait and collect.

---

## Step C — Audit simulations (orchestrator, directly)

No subagent here — `practice/simulations/TRACKER.md` is one small file, and a subagent round-trip would cost
more context than reading it. Read it yourself and note totals split first by the row's **Level**
(junior / middle / senior), then by type — Angular / Spring Boot / SQL — each as
`X Pass, X Borderline, X Fail`. A legacy row with no Level is junior only for the original 15-test
bank; a newly generated row without Level is structural drift, not something to guess. Count
completed as ✅ Pass + ⚠️ Borderline. Count the **`Status`** column, never `Self-assessment` — the two use
different scales (Status is Pass/Borderline/Fail; Self-assessment is Solid/Good/Weak/Failed), so the
wrong column yields plausible numbers and no error. Rows still ⏳ Pending count as nothing. If
TRACKER.md does not exist, report that as a structural finding rather than a count of zeros.

---

## Step D — Measure every section against its sources (orchestrator)

You now hold every subagent report and the full current PROGRESS.md. **D7 is the only one of these
that ends in an edit.** For the others, measure, compare against what the file says, and record any
mismatch as a row for the Step E drift report — never as an edit, however obvious the fix looks.

### D1 — Tombstone: concept extraction

This prompt used to fan out a full concept extraction per project. It has had no destination since
2026-08-03, when PROGRESS.md's per-technology sections were deleted: a concept's only home is the
coverage checklist, via `coverage-bullet-add` / `coverage-mark`. The "report coverage work owed" line
that replaced it was **never executable** — deciding whether a concept is missing from the checklist
needs the coverage files' contents, which the subagent is forbidden to read and this orchestrator only
`grep -c`s. Removed 2026-08-05; the fan-out now asks for the step status alone.

**Never write a concept into PROGRESS.md, in any section, in any form.** The `Key concepts` cell of a
project row is a handful of headline topics that the row's author set — it is not an inventory and is
not maintained here; if it names something the project demonstrably never did, that is a drift row.

### D2 — Tombstone: the deleted per-technology sections

There are no per-technology concept sections to create or maintain (removed 2026-08-03). If a past
PROGRESS.md revision is used as a reference, ignore its `## Angular` / `## Java` / `## Spring Boot`
/ `## CSS` / `## Complementary skills in practice` sections and the SQL `### Querying data` block —
re-creating any of them is a defect, not a fix.

### D3 — `## Practice completed` → `### Exercise route` (from the Step B report)

**Owner: `sql-exercises MODE = review`, whose Step 4b holds the full contract** — the two tables'
columns, the `Corrected` vs `Route progress` distinction, where the target comes from, and the `Total`
rules. Read
`notes/prompts/practice/sql/_internal/_sql-exercises-review.md` §4b and measure against it. **Do not
restate its schema here**: a copy of another prompt's table shape is what rotted this step once
already — it described columns (`Exercises scored`) and a section number (§5) that the live contract
had long replaced with `Corrected` / `Route progress` / `Steps closed` and §1.

Compare the file's tables against `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` §1 and the Step B counts,
and report as drift: a route target that disagrees with §1, a file with no row, a row whose status
contradicts its score, a `Total` that does not sum its own column. Never downgrade a `closed ✅` and
never write a corrected figure — name it and let the owner re-run.

### D4 — `## Practice completed` → `### Timed simulations` (from the Step C counts)

**Owner: `simulation-review` Step 5**, which holds the Pass/Borderline/Fail verdict — the thing that
decides the numbers. Compare your Step C counts with the per-level roll-up and each level's track
table; report any cell that disagrees, plus a missing level/track row. Denominators come from the
number of TRACKER rows for that level and track, never from an example. A level with no rows is `—`,
not `0/0`.

### D5 — `## Projects` (from the Step A step statuses)

**Owner: `step-complete`**, which writes the `Status` cell in the session that finished the step.
Compare each subagent's confirmed status against the row and report a mismatch — a Done ✓ marker that
disagrees with the plan, a `🔜` on a project with completed steps, a step count that has moved on.

**Report the mismatch; never rewrite the cell.** The `Status` cell carries detail a `✅` scan cannot
reconstruct — sub-steps (`Step 7a next`, where the plan marks only `Step 7`) and non-step facts the
ritual recorded (`backend backlog fully closed`). Overwriting it with a derived string loses both
silently, which is exactly the failure this demotion exists to stop. If the plan and the row disagree,
say which is likely stale: a plan missing a `✅` is a `PLANNING.md` fix, a row behind the plan is a
`step-complete` that did not finish.

There are no `### Project NN` blocks or technology sub-headings left (removed 2026-08-03). Do not
re-create one, and do not look for one.

### D6 — Measurement discipline

- Measure from primary sources, never from the file you are auditing — a figure read back out of
  PROGRESS.md and compared with itself always agrees.
- **A section you cannot measure is a finding, not a silence.** A missing `## Practice completed`, an
  absent TRACKER.md, a level with no route file: report the structural gap.
- **Never invent or recreate a concept section.** PROGRESS.md's declared status sections are the level
  matrix, `Coverage demonstrated`, `Study progress`, `Projects`, `Practice completed`, and
  `Useful resources`. A new section is legitimate only when its source, unit, writer, reader and audit
  rule are added to the ownership contract in the same machinery change. Per-technology concept lists
  remain forbidden: coverage owns concepts; PROGRESS records only their effects and track progress.

### D7 — `Professional level by topic` — **the one section this prompt writes**

Refresh the matrix without duplicating coverage concepts:

- `Knowledge consolidation`: report notes **authored** (`complete`/`refined` over all plan entries)
  separately from notes **studied** (`Studied: YYYY-MM-DD` over the same entries), then report whether
  the selected-level Q&A fingerprint and CORE route are current, with refined/studied CORE and full-bank
  counts. A stale or incomplete denominator is named as such, never rendered as `0%`.
- `Practical evidence`: **preserve, then add.** `step-complete` and `backlog-task-close` write this
  cell in session, so what is already there is a record, not a draft — keep every explicit entry and
  append only project, exercise, simulation, or unaided-recall evidence this run verified. This is the
  one cell of the matrix you share, and preservation is what makes sharing safe.
- `Next gate`: name the first unmet consolidation or practical condition.
- Never promote `building` to `demonstrated` from file completion alone. Promotion requires all notes
  entries complete, current selected-level Q&A, and at least one explicit unaided practical or
  explanation check for that topic.
- Never activate middle while junior is not demonstrated, or senior while middle is not demonstrated.
- Middle promotion requires explicit autonomous ownership evidence. Senior promotion requires real
  production, platform, or multi-team ownership; notes, interview prep, and personal projects alone
  can never produce `Senior — demonstrated`.
- If evidence is insufficient, keep the existing conservative level and state what remains open.
- **The D8 and D9 percentages never promote a level by themselves.** A topic at 100% demonstrated
  coverage or 100% study progress stays
  `building` until the unaided practical or explanation check in the rules above is met. The ratio is
  an instrument, not a gate; treating it as one would let file bookkeeping award a level that no
  demonstration backs.

### D8 — `Coverage demonstrated` — the format authority, measured not written

**This step defines the table's format, counting rule and `*` convention, and four other writers read
it and defer to it** — `coverage-mark` and `coverage-bullet-add` for a single bullet, `coverage-prompt`
for one topic+level, `coverage-audit` for a whole level. That specification stays here and they keep
citing "step D8". What this prompt no longer does is **edit** the cells: those four recount from the
same files with the same commands in the session that changed them, so a fifth writer arriving later
can only agree — or disagree because its inputs were worse.

Recount every cell and **report** any that disagrees, naming the topic, the level, the file's figure
and yours. One row per topic, one column per level, each cell the share of that level's coverage
bullets carrying an evidence marker.

Count from the **topic** files, `notes/{topic}/coverage/{LEVEL}.md`, never from the
`notes/coverage/{LEVEL}.md` mirror: the mirror can lag its topics, and a denominator that depends on
which file you opened is not a measurement. Two counts per file, no file contents loaded:

```bash
grep -cE '^- ' notes/{topic}/coverage/{LEVEL}.md      # total   — the denominator
grep -cE ' ✅ [0-9]{2}-[a-z0-9-]+' notes/{topic}/coverage/{LEVEL}.md   # marked  — the numerator
```

The marker pattern is deliberately **unanchored**: a marker written before 2026-08-01 ends the line, a
newer one is followed by its evidence clause, and both must count.

Cell format is exactly `marked/total (P%)`, `P` rounded to a whole number — `34/86 (40%)`. A level
with no file yet is `—`, not `0/0`. A newly admitted topic may have a zero-bullet scaffold file before
its first completed Coverage tracker run; that cell is also `—`, because no denominator exists yet.
The `Total` row is recounted as the sum of the column's numerators over the sum of its denominators,
never accumulated from the printed total.

**Provisional denominators.** Read `notes/prompts/_internal/_run-tracker.md`. If the `Coverage {J|M|S}`
cell for that topic and level is empty, the level was never authored by the coverage pipeline, so its
total is a stub that will move: the cell carries a `*` and the footnote below the table explains the
mark. A `*` that should have been dropped — the tracker now records a run — is itself a drift row.

The table sits immediately after `Professional level by topic`, its topic rows in the same order, so
the two read together.

### D9 — `Study progress` — measured, never written here

**Owner: `study-block-close`.** Recompute the three rows with the same contract the ritual uses:

- Notes, per level: dated `Studied:` entries over all numbered entries, but only when every required
  registered-topic plan exists, is `current`, and its coverage fingerprint matches. A missing legacy
  `Studied` field is an unstudied entry, not a missing denominator.
- Interview CORE, per level: stable question IDs carrying both `[refined]` and `[studied]` in both
  languages over all IDs selected by the current `notes/interview-prep/routes/{LEVEL}.md`. The route's
  inventory fingerprint must match the current English-bank inventory. A one-sided marker counts once
  and is reported as mirror drift for `study-block-close`; the audit itself does not repair it.
- Interview bank, per level: stable question IDs carrying both `[refined]` and `[studied]` in both
  languages over all English master question identities. Count only when every required topic bank
  exists, both languages carry current coverage fingerprints, stable-ID parity passes, and no duplicate
  ID exists. Angular Material shares Angular's bank; all other registered topics own their file.

Compare the result with `PROGRESS.md` and emit one drift row per mismatched cell. `—` is required when
the denominator gate is not met; never sum only the current subset and present it as a level total.

---

## Step E — Write the matrix, then print the drift report

**The edit.** Apply D7 as **targeted in-place edits** (Edit tool, one edit per change) to
`Professional level by topic` and nothing else. Then run `git diff PROGRESS.md`: **every hunk must fall
inside that table.** A hunk anywhere else means an edit escaped its section — revert it and report the
section as drift instead. This diff check is the mechanical guard behind the whole ownership contract.

Then print two things.

**1 — Level matrix, what changed:**

| Topic | Field | Was | Now | Why |
|---|---|---|---|---|

One row per edited cell; `—` and one line saying so if the matrix was already accurate.

**2 — Drift report** — every mismatch D3, D4, D5, D8 and D9 found:

| Section | What PROGRESS.md says | What the sources say | Owner to re-run |
|---|---|---|---|
| Coverage demonstrated · Java junior | `47/128 (37%)` | `49/128 (38%)` | `/coverage-mark` wrote a marker without refreshing the cell — re-run it, or `/coverage-audit junior` |
| Projects · 07 | `Steps 1–6 done, Step 7 next` | plan has no ✅ on 7a | `step-complete`, or add the ✅ to PLANNING.md |

**An empty drift report is the good outcome, and it is what closes G6** — say so explicitly rather
than printing an empty table with no verdict. Order rows by how much the consumer cares:
`Coverage demonstrated` and `Professional level by topic` are read by `project-brief`, `review-audit`
and `backlog-task-open`; the `Practice completed` tables are read only by their own writers.

**Low-confidence statuses:** if any project subagent derived its step status from the
`PROGRESS_HINT` fallback (or the hint overrode the ✅ markers) rather than from ✅ markers alone,
add one line after the tables naming the project and suggesting Victor add the missing ✅ to that
step's heading in PLANNING.md — that makes the next run self-sufficient.

---

## Step F — Commit

**Only if D7 edited something.** A run whose matrix was already accurate produces a report and no
commit; say that plainly instead of committing an unchanged file.

PROGRESS.md follows the active branch per the shared session rules (2026-07-14 — `main` only receives merges via
PR). Per the commit-hygiene rule, run
`git status` right before the add and again right before the commit — confirm nothing but
PROGRESS.md gets staged (`git restore --staged` anything else). Then:

```
git add PROGRESS.md
```

```
git commit -m "docs: refresh PROGRESS.md level matrix — [main change, e.g. 'Spring Boot evidence for Step 6, SQL next gate']"
```

> **Auto-commit note.** Victor's global rule is "never auto-commit." This orchestrator may run the
> commit itself (same lift already granted to the notes-audit orchestrator) **only when the matrix edit
> is clean**. If anything is uncertain, print the two blocks above and let Victor run them instead.
> **Never commit a repair to a section this prompt does not own** — that is the owner's commit, in the
> owner's run.

### Final step — pipeline self-report

After everything above is done, read `notes/prompts/_internal/_pipeline-self-report.md` and execute it for this
run — write the report file in this orchestrator's folder, commit it on its own, and print the five
bullets in chat.

````
