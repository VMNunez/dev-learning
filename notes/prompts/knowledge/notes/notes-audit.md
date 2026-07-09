# Notes audit — the single entry point for building notes

Run this **inside Claude Code**. It is the only notes prompt Victor launches. It builds study notes to
the full quality standard, hands-off, in two shapes:

- `SCOPE = folder` — audit and complete a whole topic (gap analysis → build every file needed).
- `SCOPE = file` — audit and complete one file (a note you just wrote, or one to fix).

Both shapes use the same four-stage quality pipeline, one cold subagent per stage, `en/` as the
canonical source: **English author (A) → English reviewer (B) → translator (T) → `en/`-blind Spanish
reviewer (C)**. A and B finish and review the English before any Spanish exists; T then translates the
final English into `es/`; C reads the `es/` cold and commits. Each stage has no stake in the previous
one's work, so it catches what the last trusted — and because C never sees the `en/`, it judges the
`es/` as the native study text Victor actually reads. No worklist approval, no per-file launching —
one command does everything.

> **▶ Run first:** `coverage-prompt` for the topic — notes-audit builds notes to cover every item in
> `coverage.md`; if coverage is missing or stale, the notes will be too.

**Internal pieces this orchestrates** (you never launch these directly):
`_note-quality-standard.md` (the bar) · `notes-plan-prompt.md` (folder analysis → worklist) ·
`notes-inspect-prompt.md` (per-file quality flags → worklist rows) · `notes-write-prompt.md` (English
author) · `notes-review-prompt.md` (English reviewer) · `notes-translate-prompt.md` (translator
`en/`→`es/`) · `notes-review-es-prompt.md` (`en/`-blind Spanish reviewer, owns the commit).

> **The pipeline always commits** — one atomic commit per file, made by the Spanish reviewer (the last
> stage). There is no preview mode: the history is atomic and git-reversible, so a bad file is one
> `git revert` away rather than something to catch before it lands.

---

## How to use — recipes

Open a fresh chat **inside Claude Code**, paste the whole prompt below (config block + instructions),
fill only the config block, and let it run to the end. You touch nothing else — no worklist to
approve, no per-file launching, no commits to run yourself. Pick the recipe:

**A · Build or audit a whole topic** (e.g. finish the Java notes end to end)
```
SCOPE   = folder
TOPIC   = Java
FILE    =            ← leave blank
TASK    =            ← leave blank
```

**B · Audit or create one file** (e.g. a note you just wrote by hand, or one to fix)
```
SCOPE   = file
TOPIC   = Java
FILE    = notes/java/en/08-exceptions.md
TASK    =            ← blank means "audit it and bring it fully to standard, resolving any TODOs"
```
> In file mode, point `FILE` at the **`en/`** path — the pipeline mirrors to `es/` automatically. To
> create a brand-new file, still name its intended `en/` path and set `TASK` to what it should cover.

**Rules of thumb:**
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

Use SCOPE, TOPIC, FILE, and TASK wherever the prompt refers to {SCOPE}, {TOPIC}, {FILE}, or {TASK}.

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

Wait for it to finish. Then read `notes/{TOPIC}/notes-worklist.md` yourself.

### Phase 1.5 — Inspect every pre-existing file (one cold subagent per file, sequential)

The planner did not judge existing files against the standard — it only listed them under the
worklist's **"Existing files to inspect"** heading. Now dispatch one inspector per listed file, so each
file is judged at full attention in its own cold context (never a batch — that is the failure this
split exists to prevent).

Read the "Existing files to inspect" list from the worklist. For **each** file in it, **in order**,
launch one `general-purpose` subagent, `run_in_background: false` (never overlap them — they all
append to the same worklist file and parallel writes would race):

> Read `notes/prompts/knowledge/notes/notes-inspect-prompt.md` and execute it in full for a single file:
> - `TOPIC` = {TOPIC} · `FILE` = «file» · `WORKLIST` = notes/{TOPIC}/notes-worklist.md
>
> Read that one file top to bottom against the standard, append its `fix-quality` / `add-docs-link`
> rows to the worklist (merging into an existing row for the same file if one is already there), and
> return your section-by-section trace and verdict. Do NOT edit note prose, do NOT commit.

Wait for each inspector before launching the next. When all inspectors are done, re-read
`notes/{TOPIC}/notes-worklist.md` and collect every row still `[ ]`, in ascending row-number order. If
none, report "notes already complete" and stop.

### Phase 2 — Build every row (author → reviewer → translator → Spanish reviewer, sequential)

For each unchecked row **in order**, run the four-stage pipeline below. Never overlap rows or the four
stages of a row — each stage must see a finished predecessor, and commits must not race on the git
index.

Proceed exactly as the **"Per-file pipeline"** section at the bottom describes, using the row's
`FILE`, `TASK`, and `REWRITE_MODE`.

### Phase 3 — Report

Print the per-row table (author status · reviewer verdict · commit) and the `[x]` summary. See
"Finishing" below for the worklist cleanup.

## If SCOPE = file

No planning, no worklist. Run the **"Per-file pipeline"** once for `{FILE}`, with `TASK = {TASK}`
(or the default audit task if blank) and `REWRITE_MODE = standard` unless the file is clearly
unvalidated auto-generated content, in which case use `first-pass`. Then do "Finishing".

---

## Per-file pipeline (used by both scopes)

Four stages, always in this order: **English author (A) → English reviewer (B) → translator (T) →
Spanish reviewer (C)**. `en/` is the canonical source: A and B finish and review the English *before*
any Spanish exists, then T produces the `es/` from that final English, then C reads the `es/` cold and
commits. Each stage is a cold subagent, `run_in_background: false`, and you **wait for each before
launching the next** — never overlap them (parallel commits race the git index; a stage must never see
an unfinished predecessor).

> **Translation-only rows.** If the worklist row's task is `create-es` (the `en/` is already final and
> valid, only the Spanish is missing), **skip A and B** — there is nothing to author or English-review.
> Run only **T then C**. For every other row, run all four stages.

**Subagent A — English author.** Launch one `general-purpose` subagent:

> Read `notes/prompts/knowledge/notes/notes-write-prompt.md` and execute it in full for a single file:
> - `TOPIC` = «topic» · `FILE` = «file» · `TASK` = «task» · `REWRITE_MODE` = «mode»
>
> Work in **English only** (`en/`): resolve TODOs (reading the `es/` only to find Victor's markers),
> quality-audit, complete to the standard, self-check. **Do NOT create or edit the `es/` file, do NOT
> commit, do NOT mark any worklist row.** Leave your `en/` work in the working tree. Report the
> sections you touched (T needs this), the TODOs you resolved, and the coverage status.

Wait for A. If A reports it could not complete the file (blocked, missing context), skip B/T/C, leave
the row `[ ]` (folder mode), note it, and move on — do not translate or commit a partial file.

**Subagent B — English reviewer (`en/` only).** Launch a second, independent `general-purpose`
subagent:

> Read `notes/prompts/knowledge/notes/notes-review-prompt.md` and execute it in full:
> - `TOPIC` = «topic» · `FILE` = «file»
>
> Audit the just-authored `en/` file hard against the standard and fix what falls short in English.
> The `es/` does not exist yet — there is nothing bilingual to check. **Do NOT touch `es/`, do NOT
> commit or mark the row.** Report your verdict (PASS/FIXED), the section-by-section trace, and files
> touched.

Wait for B before starting T.

**Subagent T — translator (`en/` → `es/`).** Launch a third, independent `general-purpose` subagent:

> Read `notes/prompts/knowledge/notes/notes-translate-prompt.md` and execute it in full:
> - `TOPIC` = «topic» · `FILE` = «file»
>
> Treat the finished `en/` file as the canonical source and produce (or re-sync) its `es/` counterpart:
> exact structural parity, native-Spanish prose, clear any leftover `es/` TODO marker. **Do NOT change
> the English, do NOT commit or mark the row.** Report TRANSLATED/RE-SYNCED, the section trace, and any
> English sentence you suspect is wrong.

Wait for T before starting C.

**Subagent C — Spanish reviewer (`es/` only, `en/`-blind).** Launch a fourth, independent
`general-purpose` subagent:

> Read `notes/prompts/knowledge/notes/notes-review-es-prompt.md` and execute it in full:
> - `TOPIC` = «topic» · `FILE` = «file»
>
> Read ONLY the `es/` counterpart (never open the `en/` file), audit it as a standalone native-Spanish
> study text, fix calque and flow directly, then — as the last stage — mark the worklist row `[x]` if
> one exists and commit this one file atomically (`en/` + `es/`). Report your verdict (PASS/FIXED +
> Spanish fixes), any structural gaps it could not fix, files touched, and the commit hash.

Wait for C before starting anything else.

---

## Finishing

Everything is committed — one atomic commit per file (made by the Spanish reviewer, stage C) — and any
worklist rows are `[x]`. Report the commits made. **In folder mode, once every row is `[x]`, delete
`notes/{TOPIC}/notes-worklist.md` yourself** (`rm` it — it was never committed, it is a temporary
artifact, so deletion needs no commit and leaves the working tree clean). Do not merely remind Victor
to delete it — remove it as the final step, and confirm it is gone. If any row is still `[ ]` (a failed
build), leave the worklist in place and list the failed row so it can be re-run (`SCOPE = file`, that
`FILE`).

## Hard rules

- **One file per subagent context — ALWAYS, even at higher token cost. This is the rule that protects
  quality.** A subagent that carries a whole folder (or several files) in its context degrades its
  attention toward the end and silently skims — the later files get a shallow pass, exactly the failure
  Victor caught. So: never dispatch a subagent to author, review, inspect, translate, polish, or
  quality-check more than one file at a time. Whatever the task (full audit, TODO resolution, a narrow Spanish-prose
  or docs-link pass), it is always **one cold subagent per file**, run sequentially. Deep, atomic,
  file-by-file passes are the standard here — paying more tokens for one-file-per-subagent is the
  intended trade, never a reason to batch. Every per-file subagent must **read its file top to bottom**
  and, when reviewing/auditing, return a **section-by-section trace** (every `##`/`###` heading with
  PASS or the fix made) as proof it reached the last line. If you are ever tempted to "save spawns" by
  handing one subagent a batch of files, that is the mistake — do not.
- **Auto-commit is authorized for this flow only.** Victor's global rule is "never auto-commit"; he
  lifted it for this orchestrator, which always commits. The Spanish reviewer subagent (stage C) commits
  each file. It applies nowhere else — normal sessions and standalone component prompts still hand Victor
  the command.
- **One atomic commit per file.** Never batch notes, never `git add .`, never commit
  `notes-worklist.md`.
- **Before every `git add`/`git commit`, run `git status` and confirm only the intended `notes/`
  paths are staged.** A project code file left staged from an earlier, unrelated step can silently
  ride along into a notes commit — `git restore --staged` anything that isn't a notes file.
- **Four subagents per file, English author → English reviewer → translator → Spanish reviewer; rows
  are sequential.** Never overlap them — parallel commits race the git index, a stage must never see an
  unfinished predecessor, and only the last stage (C) commits. A, B, and T never commit; C always does.
  (`create-es` rows skip A and B — run only T → C.)
- **`en/` is canonical.** A and B own the English; T renders it into `es/`; only C touches the `es/`
  after T. Never let the author or English reviewer write the `es/`.
- Never skip the translation pass or either reviewer pass.

````
