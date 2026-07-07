# Notes audit — the single entry point for building notes

Run this **inside Claude Code**. It is the only notes prompt Victor launches. It builds study notes to
the full quality standard, hands-off, in two shapes:

- `SCOPE = folder` — audit and complete a whole topic (gap analysis → build every file needed).
- `SCOPE = file` — audit and complete one file (a note you just wrote, or one to fix).

Both shapes use the same quality pipeline: every file is **authored by one cold subagent and then
audited/fixed by a second, independent reviewer subagent** before it is committed. The reviewer has no
stake in the draft, so it reads against the bar and catches what the author trusted. No worklist
approval, no per-file launching — one command does everything.

> **▶ Run first:** `coverage-prompt` for the topic — notes-audit builds notes to cover every item in
> `coverage.md`; if coverage is missing or stale, the notes will be too.

**Internal pieces this orchestrates** (you never launch these directly):
`_note-quality-standard.md` (the bar) · `notes-plan-prompt.md` (folder analysis → worklist) ·
`notes-write-prompt.md` (author) · `notes-review-prompt.md` (reviewer).

> **First run on a topic, use `DRY_RUN = true`.** It builds and reviews everything but commits
> nothing, so you can read the diff before it lands. Once you trust it, `DRY_RUN = false` is fully
> hands-off.

---

## How to use — recipes

Open a fresh chat **inside Claude Code**, paste the whole prompt below (config block + instructions),
fill only the config block, and let it run to the end. You touch nothing else — no worklist to
approve, no per-file launching, no commits to run (unless `DRY_RUN = true`). Pick the recipe:

**A · Build or audit a whole topic** (e.g. finish the Java notes end to end)
```
SCOPE   = folder
TOPIC   = Java
FILE    =            ← leave blank
TASK    =            ← leave blank
DRY_RUN = true       ← true the first time on a topic; false once you trust it
```

**B · Audit or create one file** (e.g. a note you just wrote by hand, or one to fix)
```
SCOPE   = file
TOPIC   = Java
FILE    = notes/java/en/08-exceptions.md
TASK    =            ← blank means "audit it and bring it fully to standard, resolving any TODOs"
DRY_RUN = false
```
> In file mode, point `FILE` at the **`en/`** path — the pipeline mirrors to `es/` automatically. To
> create a brand-new file, still name its intended `en/` path and set `TASK` to what it should cover.

**Rules of thumb:**
- **First time on any topic → `DRY_RUN = true`.** It writes and reviews everything but commits
  nothing; you read the diff, then re-run with `DRY_RUN = false` (or paste the commits it printed).
- **Spring Boot** is the one topic that spans two folders — just set `TOPIC = Spring Boot`; the
  planner reads both `notes/java/en/` and `notes/spring-boot/en/` on its own.
- Fill in **only** the config block. Everything below it is machinery — never edit it.
- If a folder run is interrupted, just launch it again with the same config: finished files are
  already `[x]` in the internal worklist and are skipped, so it resumes where it stopped.

---

````
## Configuration — edit only this block

SCOPE   = [folder | file]

## folder mode:
TOPIC   = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security | all]

## TOPIC = all (folder mode only) audits every topic in turn — see notes/prompts/_batch-mode.md.
## Batch order: Angular, Angular Material, Spring Boot (also reads notes/java/en/), Java,
## Architecture, Security, TypeScript, JavaScript, CSS, SQL, Git, General. File mode is never
## batched — it needs one exact FILE.

## file mode:
FILE    = [exact en/ file path, e.g. notes/java/en/08-exceptions.md]
TASK    = [what to do to it; leave blank to mean "audit it and bring it fully to standard, resolving
           any TODOs"]

DRY_RUN = [false | true]

Use SCOPE, TOPIC, FILE, TASK, and DRY_RUN wherever the prompt refers to {SCOPE}, {TOPIC}, {FILE},
{TASK}, or {DRY_RUN}.

---

You are the orchestrator for building Victor's study notes, hands-off. First read
`notes/prompts/knowledge/notes/_note-quality-standard.md` so you know the bar you are enforcing. Then follow
the branch for `{SCOPE}`. You stay light: you dispatch subagents, wait, and collect — you never hold
every file's content in your own context.

## If SCOPE = folder and TOPIC = all

Per `notes/prompts/_batch-mode.md`, expand `all` into the ordered topic list from the config block's
Batch note (Angular → Angular Material → Spring Boot → Java → Architecture → Security → TypeScript →
JavaScript → CSS → SQL → Git → General). Run the **entire `If SCOPE = folder` procedure below once per
topic**, fully finishing one topic — plan, build every row, its commits — before starting the next.
Never overlap topics: their subagents commit, and parallel commits race the git index. Put each
topic's report under a `### {TOPIC}` heading, and after the last one print the `_batch-mode.md` summary
table (`Topic | Result | Files changed`). If the run gets too long, finish the current topic
completely (commits included) and stop with the `_batch-mode.md` "Completed / Remaining" line — a
re-run resumes from the first unfinished topic (already-`[x]` worklist rows make finished topics fast
no-ops). Otherwise, for a single topic, follow the branch directly.

## If SCOPE = folder

### Phase 1 — Plan (one planning subagent)

Launch one `general-purpose` subagent, `run_in_background: false`:

> Read `notes/prompts/knowledge/notes/notes-plan-prompt.md` and execute it in full for `TOPIC = {TOPIC}`
> (derive `NOTES_PATH` as that prompt specifies — for Spring Boot, both `notes/java/en/` and
> `notes/spring-boot/en/`). Do the folder setup, `en`/`es` parity, gap + sequence analysis,
> `future-learning.md`, assign concrete file numbers, and write `notes/{TOPIC}/notes-worklist.md`.
> Do the Step 0/Step 4 structural commit as that prompt says (never commit `notes-worklist.md`).
> Report the worklist rows you wrote.

Wait for it to finish. Then read `notes/{TOPIC}/notes-worklist.md` yourself and collect every row
still `[ ]`, in ascending row-number order. If none, report "notes already complete" and stop.

### Phase 2 — Build every row (author → reviewer, sequential)

For each unchecked row **in order**, run the two-subagent pipeline below. Never overlap rows or the
two subagents of a row — the reviewer must see a finished file, and commits must not race on the git
index.

Proceed exactly as the **"Per-file pipeline"** section at the bottom describes, using the row's
`FILE`, `TASK`, and `REWRITE_MODE`.

### Phase 3 — Report

Print the per-row table (author status · reviewer verdict · commit) and the `[x]` summary. Guidance
for `DRY_RUN` is in "Finishing" below.

## If SCOPE = file

No planning, no worklist. Run the **"Per-file pipeline"** once for `{FILE}`, with `TASK = {TASK}`
(or the default audit task if blank) and `REWRITE_MODE = standard` unless the file is clearly
unvalidated auto-generated content, in which case use `first-pass`. Then do "Finishing".

---

## Per-file pipeline (used by both scopes)

**Subagent A — author.** Launch one `general-purpose` subagent, `run_in_background: false`:

> Read `notes/prompts/knowledge/notes/notes-write-prompt.md` and execute it in full for a single file:
> - `TOPIC` = «topic» · `FILE` = «file» · `TASK` = «task» · `REWRITE_MODE` = «mode»
>
> Do Steps 1–4.5 (resolve TODOs, quality audit, complete to the standard, mirror to `es/`,
> self-check gate). **Do NOT commit and do NOT mark any worklist row** — an independent reviewer runs
> next and owns the commit. Leave your work in the working tree. Report the files you touched, the
> coverage status, and the one-line commit message you'd use.

Wait for A. If A reports it could not complete the file (blocked, missing context), skip the reviewer,
leave the row `[ ]` (folder mode), note it, and move on — do not commit a partial file.

**Subagent B — reviewer.** Launch a second, independent `general-purpose` subagent,
`run_in_background: false`:

> Read `notes/prompts/knowledge/notes/notes-review-prompt.md` and execute it in full:
> - `TOPIC` = «topic» · `FILE` = «file» · `DRY_RUN` = {DRY_RUN}
>
> Audit the just-authored file hard against the standard, fix what falls short in both `en/` and
> `es/`, and finish exactly as that prompt says for this `DRY_RUN` (false: mark the worklist row `[x]`
> if one exists and commit atomically; true: fix only, commit nothing, mark nothing). Report your
> verdict (PASS/FIXED + what you changed), files touched, and the commit hash if you committed.

Wait for B before starting anything else.

---

## Finishing

**If `{DRY_RUN}` = false:** everything is committed, one atomic commit per file, and any worklist rows
are `[x]`. Report the commits made. In folder mode, if every row is `[x]`, remind Victor he can delete
`notes/{TOPIC}/notes-worklist.md` (it was never committed — temporary artifact). List any failed row
so it can be re-run (`SCOPE = file`, that `FILE`).

**If `{DRY_RUN}` = true:** nothing was committed, nothing marked — all changes are staged in the
working tree for Victor to read. Print the atomic commit sequence to run after reviewing the diff, one
file per pair of blocks, in processed order (never add `notes-worklist.md`):

```
git add <en/ path> <es/ path> <CLAUDE.md if its counter changed>
```
```
git commit -m "<that file's commit message>"
```

## Hard rules

- **Auto-commit is authorized for this flow only, and only when `DRY_RUN = false`.** Victor's global
  rule is "never auto-commit"; he lifted it for this orchestrator. The reviewer subagent commits each
  file. It applies nowhere else — normal sessions and standalone component prompts still hand Victor
  the command.
- **One atomic commit per file.** Never batch notes, never `git add .`, never commit
  `notes-worklist.md`.
- **Two subagents per file, author then reviewer; rows are sequential.** Never overlap them — parallel
  commits race the git index, and a reviewer must never audit an unfinished file.
- Never skip the `es/` mirror or the reviewer pass.

````
