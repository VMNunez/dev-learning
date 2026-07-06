# Notes audit — the single entry point for building notes

Run this **inside Claude Code**. It is the only notes prompt Victor launches. It builds study notes to
the full quality standard, hands-off, in two shapes:

- `SCOPE = folder` — audit and complete a whole topic (gap analysis → build every file needed).
- `SCOPE = file` — audit and complete one file (a note you just wrote, or one to fix).

Both shapes use the same quality pipeline: every file is **authored by one cold subagent and then
audited/fixed by a second, independent reviewer subagent** before it is committed. The reviewer has no
stake in the draft, so it reads against the bar and catches what the author trusted. No worklist
approval, no per-file launching — one command does everything.

**Internal pieces this orchestrates** (you never launch these directly):
`_note-quality-standard.md` (the bar) · `notes-plan-prompt.md` (folder analysis → worklist) ·
`notes-write-prompt.md` (author) · `notes-review-prompt.md` (reviewer).

> **First run on a topic, use `DRY_RUN = true`.** It builds and reviews everything but commits
> nothing, so you can read the diff before it lands. Once you trust it, `DRY_RUN = false` is fully
> hands-off.

---

**How to use:**

1. Fill in `SCOPE`, then `TOPIC` (folder) or `FILE` + `TASK` (file), and `DRY_RUN`.
2. Paste into Claude Code and let it run to the end.

---

````
## Configuration — edit only this block

SCOPE   = [folder | file]

## folder mode:
TOPIC   = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]

## file mode:
FILE    = [exact en/ file path, e.g. notes/java/en/08-exceptions.md]
TASK    = [what to do to it; leave blank to mean "audit it and bring it fully to standard, resolving
           any TODOs"]

DRY_RUN = [false | true]

Use SCOPE, TOPIC, FILE, TASK, and DRY_RUN wherever the prompt refers to {SCOPE}, {TOPIC}, {FILE},
{TASK}, or {DRY_RUN}.

---

You are the orchestrator for building Victor's study notes, hands-off. First read
`notes/prompts/knowledge/_note-quality-standard.md` so you know the bar you are enforcing. Then follow
the branch for `{SCOPE}`. You stay light: you dispatch subagents, wait, and collect — you never hold
every file's content in your own context.

## If SCOPE = folder

### Phase 1 — Plan (one planning subagent)

Launch one `general-purpose` subagent, `run_in_background: false`:

> Read `notes/prompts/knowledge/notes-plan-prompt.md` and execute it in full for `TOPIC = {TOPIC}`
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

> Read `notes/prompts/knowledge/notes-write-prompt.md` and execute it in full for a single file:
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

> Read `notes/prompts/knowledge/notes-review-prompt.md` and execute it in full:
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
