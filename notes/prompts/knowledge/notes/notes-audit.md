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

> **Run-start check (step 0):** before anything else, run the check in `notes/prompts/_pipeline-self-report.md` — read this prompt's own `_last-run-report` and, if its `Status` is `open`, surface that finding in one line before proceeding.

**Internal pieces this orchestrates** (you never launch these directly):
`_note-quality-standard.md` (the bar) · `_notes-plan-prompt.md` (folder analysis → worklist) ·
`_notes-inspect-prompt.md` (per-file quality flags → worklist rows) · `_notes-write-prompt.md` (English
author) · `_notes-review-prompt.md` (English reviewer) · `_notes-translate-prompt.md` (translator
`en/`→`es/`) · `_notes-review-es-prompt.md` (`en/`-blind Spanish reviewer, owns the commit).

> **The pipeline always commits** — one atomic commit per file, made by the Spanish reviewer (the last
> stage). There is no preview mode — a deliberate divergence from the `DRY_RUN` its sibling
> orchestrators offer: the history is atomic and git-reversible, so a bad file is one
> `git revert` away rather than something to catch before it lands.
>
> **Branch guard (step 0, before dispatching anything):** run `git branch --show-current`. Study
> materials commit on **whatever branch is currently active** (CLAUDE.md, "Study materials follow the
> active branch", changed 2026-07-14) — a feature branch is the normal, expected case; just name the
> branch in the final report. The one branch that must stop the run is **`main`**: it never receives
> direct commits, only merges via PR — if you are on `main`, stop and ask Victor which branch to use.

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
- **Topic → folder mapping:** wherever a path says `notes/{TOPIC}/…`, the folder is the topic name
  lowercased with hyphens (Spring Boot → `notes/spring-boot/`, Angular Material →
  `notes/angular-material/`). The Spring Boot worklist lives in `notes/spring-boot/`.
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
`notes/prompts/knowledge/notes/_internal/_note-quality-standard.md` so you know the bar you are enforcing. Then follow
the branch for `{SCOPE}`. You stay light: you dispatch subagents, wait, and collect — you never hold
every file's content in your own context. Ask every subagent for a **concise** report (its verdict,
trace, EOF line, and files touched — no prose recaps); once you have verified a stage's trace and moved
on, you never need that trace again — carry only the per-row status forward into the final report.

## Model policy — per-stage, to protect quality while saving tokens

Pass an explicit `model` override on **every** subagent dispatch, matched to how much deep reasoning
the stage needs. Quality lives in authoring mechanism-deep prose (A), in catching subtle bugs and
false facts (B), and in judging existing files against the standard (the inspectors — their own prompt
calls it "the heaviest attention work", and a `CLEAN` verdict closes a file with no Opus stage ever
seeing it) — keep those on **Opus**. Translation and calque/link-fixing (T, C) and the planner's
mechanical folder survey are lighter — run those on **Sonnet** (~1/5 the cost).

| Stage | Dispatch `model:` |
|-------|-------------------|
| Planner (Phase 1) | `sonnet` |
| **Inspectors (Phase 1.5)** | **`opus`** |
| **A — English author** | **`opus`** |
| **B — English reviewer** | **`opus`** |
| T — translator | `sonnet` |
| C — Spanish reviewer (commits) | `sonnet` |

This is the default. If Victor says "run the whole thing on Sonnet" (max token saving, accept some risk
on the deep catches), pass `sonnet` everywhere instead and note it in the final report. Never silently
drop A/B or the inspectors below Opus — those are the downgrades that cost quality.

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

Launch one `general-purpose` subagent, `model: sonnet`, `run_in_background: false`:

> Read `notes/prompts/knowledge/notes/_internal/_notes-plan-prompt.md` and execute it in full for `TOPIC = {TOPIC}`
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
launch one `general-purpose` subagent, `model: opus`, `run_in_background: false` (never overlap them — they all
append to the same worklist file and parallel writes would race):

> Read `notes/prompts/knowledge/notes/_internal/_notes-inspect-prompt.md` and execute it in full for a single file:
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

> **Translation-only rows.** If the worklist row's task is **only** `create-es` and/or
> `fix-es-quality` (Spanish-only flags — the `en/` is already
> final and valid, only the Spanish is missing), **skip A and B** — there is nothing to author or
> English-review. Run only **T then C**. If the row's `TASK` mixes those with anything touching the
> English (e.g. an inspector merged `fix-quality` flags into it), the English is NOT final — run all
> four stages. For every other row, run all four stages.

**Subagent A — English author.** Launch one `general-purpose` subagent, `model: opus`:

> Read `notes/prompts/knowledge/notes/_internal/_notes-write-prompt.md` and execute it in full for a single file:
> - `TOPIC` = «topic» · `FILE` = «file» · `TASK` = «task» · `REWRITE_MODE` = «mode»
>
> Work in **English only** (`en/`): resolve TODOs (reading the `es/` only to find Victor's markers),
> quality-audit, complete to the standard, self-check. **Do NOT create or edit the `es/` file, do NOT
> commit, do NOT mark any worklist row.** Leave your `en/` work in the working tree. Report the
> sections you touched (T needs this), the TODOs you resolved, and the coverage status.

Wait for A. If A reports it could not complete the file (blocked, missing context), skip B/T/C, leave
the row `[ ]` (folder mode), note it, and move on — do not translate or commit a partial file.

**Subagent B — English reviewer (`en/` only).** Launch a second, independent `general-purpose`
subagent, `model: opus`:

> Read `notes/prompts/knowledge/notes/_internal/_notes-review-prompt.md` and execute it in full:
> - `TOPIC` = «topic» · `FILE` = «file»
>
> Audit the just-authored `en/` file hard against the standard and fix what falls short in English.
> The `es/` does not exist yet — there is nothing bilingual to check. **Do NOT touch `es/`, do NOT
> commit or mark the row.** Report your verdict (PASS/FIXED), the section-by-section trace, and files
> touched.

Wait for B before starting T.

**Subagent T — translator (`en/` → `es/`).** Launch a third, independent `general-purpose` subagent, `model: sonnet`:

> Read `notes/prompts/knowledge/notes/_internal/_notes-translate-prompt.md` and execute it in full:
> - `TOPIC` = «topic» · `FILE` = «file»
>
> Treat the finished `en/` file as the canonical source and produce (or re-sync) its `es/` counterpart:
> exact structural parity, native-Spanish prose, clear any leftover `es/` TODO marker. **Do NOT change
> the English, do NOT commit or mark the row.** Report TRANSLATED/RE-SYNCED, the section trace, and any
> English sentence you suspect is wrong.

Wait for T before starting C.

**Subagent C — Spanish reviewer (`es/` only, `en/`-blind).** Launch a fourth, independent
`general-purpose` subagent, `model: sonnet`:

> Read `notes/prompts/knowledge/notes/_internal/_notes-review-es-prompt.md` and execute it in full:
> - `TOPIC` = «topic» · `FILE` = «file»
>
> Read ONLY the `es/` counterpart (never open the `en/` file), audit it as a standalone native-Spanish
> study text, fix calque and flow directly, then — as the last stage — mark the worklist row `[x]` if
> one exists and commit this one file atomically (`en/` + `es/`). On a **create-file row**, also stage
> `CLAUDE.md` in that same commit **if** the author bumped its "next file:" counter for this new note —
> the counter bump is the structural record of adding the file, so it belongs to that one logical
> change; verify the `CLAUDE.md` diff is only the counter line before including it. Report your verdict
> (PASS/FIXED + Spanish fixes), any structural gaps it could not fix, files touched, and the commit hash.

Wait for C before starting anything else.

**Verify every trace — the trace is a gate, not decoration (orchestrator).** B, T, and C — and A
whenever `REWRITE_MODE = first-pass` (unvalidated content is where a skipped tail hurts most) — must each
return a section-by-section trace (every `##`/`###` heading with PASS or the fix made) **and the line
"N lines, read to EOF"** for the file it processed (CLAUDE.md, whole-file reads must be verifiable —
the Read tool truncates at 2000 lines silently, and some notes already exceed that). After each of
those stages, before launching the next, check its trace against the file's actual headings — get them
with `grep -n "^##" <file>` (never with another Read, which can truncate exactly like the one you are
auditing): a trace that is missing, skips headings, or comes without the "read to EOF" line means that
stage did NOT do a verifiable full pass — re-dispatch that same stage **once**, naming the headings
that lack a trace line (or demanding the EOF line). One retry maximum; if the trace is still
incomplete, mark the row **"unverified"** in the final report (never treat a traceless stage as a full
pass) and move on. For C — which has already committed — a re-dispatch that produces fixes commits them
as a small follow-up commit for the same file.

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
- **Full reads must be verifiable (CLAUDE.md non-negotiable).** Every per-file subagent runs `wc -l`
  on its file before reading; if the file is near or over 2000 lines it reads in passes with `offset`
  to the real end, and every report states **"N lines, read to EOF"**. The orchestrator rejects a
  report that lacks this line for a file the stage had to read whole (see the trace gate above).
- **Auto-commit is authorized for this flow only.** Victor's global rule is "never auto-commit"; he
  lifted it for this orchestrator, which always commits. The Spanish reviewer subagent (stage C) commits
  each file. It applies nowhere else — normal sessions and standalone component prompts still hand Victor
  the command.
- **One atomic commit per file.** Never batch notes, never `git add .`, never commit
  `notes-worklist.md`.
- **Before every `git add`/`git commit`, run `git status` and confirm only the intended `notes/`
  paths are staged.** A project code file left staged from an earlier, unrelated step can silently
  ride along into a notes commit — `git restore --staged` anything that isn't a notes file. **The one
  allowed non-`notes/` path is `CLAUDE.md` on a create-file row, and only when its diff is nothing but
  the "next file:" counter bump for the note being added** — it rides with that file's commit as one
  logical change. Anything else staged is a mistake to restore.
- **Four subagents per file, English author → English reviewer → translator → Spanish reviewer; rows
  are sequential.** Never overlap them — parallel commits race the git index, a stage must never see an
  unfinished predecessor, and only the last stage (C) commits. A, B, and T never commit; C always does.
  (`create-es` rows skip A and B — run only T → C.)
- **`en/` is canonical.** A and B own the English; T renders it into `es/`; only C touches the `es/`
  after T. Never let the author or English reviewer write the `es/`.
- Never skip the translation pass or either reviewer pass.


### Final step — pipeline self-report

After everything above is done, read `notes/prompts/_pipeline-self-report.md` and execute it for this
run — write the report file in this orchestrator's folder, commit it on its own, and print the five
bullets in chat.

````
