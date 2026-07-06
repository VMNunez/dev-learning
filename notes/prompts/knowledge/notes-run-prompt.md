# Notes run prompt — orchestrator: build a whole worklist in one shot

Run this **inside Claude Code** (it uses subagents — it does not work as a plain copy-paste chat).
You run it **once** and it processes the entire `notes-worklist.md` for a topic: one file at a time,
each **authored by one subagent and then audited by a second, independent reviewer subagent** before
it is committed. This is the prompt that removes the "launch the write prompt N times by hand" work.

**Pipeline:** `notes-plan-prompt.md` (produces `notes-worklist.md`) → **`notes-run-prompt.md`**
(this file: per row, author → reviewer → commit). One command from you builds the whole topic. To
plan and run in a single command, use `notes-build-prompt.md` instead.

> **Auto-commit note.** Your global rule is "never auto-commit". You have explicitly lifted it for
> this orchestrator only (when `DRY_RUN = false`): the reviewer subagent commits each file atomically,
> so the run needs zero commit steps from you. `DRY_RUN = true` commits nothing and hands you the
> commands. Every other flow (normal sessions, the standalone write prompt) still hands you the
> command to run yourself.

**Why two cold subagents.** Each file is handed to a subagent that starts cold — a fresh context per
file preserves the full attention budget, the whole reason the notes work was split into one-file
runs. The reviewer is a *separate* cold agent on purpose: an author tends to trust its own draft,
while a reviewer with no stake reads it against the bar and catches the misses. The orchestrator
stays light — it dispatches, waits, and collects; it never holds every file's content itself.

---

**How to use:**

1. Make sure `notes/{TOPIC}/notes-worklist.md` exists (run `notes-plan-prompt.md` first if not).
2. Fill in `TOPIC` below.
3. Paste this prompt into Claude Code and let it run. It processes and commits every unchecked row in
   order — no per-file action from you.
4. When it finishes, review the commits it made (`git log`) and delete `notes-worklist.md` once all
   rows are `[x]`.

---

````
## Configuration — edit only this block

TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]

ONLY = [optional — comma-separated row numbers to run, e.g. 1,2,5. Leave blank to run every
        unchecked row.]

DRY_RUN = [false | true]
       → false (default): each file is authored, reviewed, marked [x], and committed atomically.
       → true: each file is authored and reviewed, but NOTHING is committed and no row is marked.
         Everything is left in the working tree so Victor can read the diff first. At the end the
         orchestrator prints the atomic commit sequence for Victor to run. Use this the first time,
         or whenever you want to eyeball a batch before it lands.

Use TOPIC, ONLY, and DRY_RUN wherever the prompt refers to {TOPIC}, {ONLY}, or {DRY_RUN}.

---

You are the orchestrator for building my {TOPIC} study notes from a pre-computed worklist. Each row
is built by a **two-subagent pipeline**: an author (subagent A) writes the file, then an independent
reviewer (subagent B) audits and fixes it before it is committed. The reviewer is deliberately a
separate cold agent — it has no attachment to the draft, so it catches what the author missed.

## Preconditions

1. Read `notes/{TOPIC}/notes-worklist.md`. If it does not exist, STOP and tell me to run
   `notes-plan-prompt.md` first — there is nothing to execute.
2. Parse every row. A row looks like:
   ```
   - [ ] #3 · notes/{TOPIC}/en/09-generics.md
         TASK = add a section on bounded type parameters (rule-1 gap)
         REWRITE_MODE = standard
   ```
   Collect: the row number, the `en/` file path, the `TASK`, and the `REWRITE_MODE`.
3. Build the run list: every row whose checkbox is `[ ]` (skip `[x]` — already done), in ascending
   row-number order. If `ONLY` is set, keep only those row numbers. If the run list is empty, report
   "nothing to do — all rows already checked" and stop.

## Execution — strictly one row at a time (sequential), two subagents per row

For each row in the run list, **in order**, run the author→reviewer pipeline. All subagents are
launched with `run_in_background: false` (synchronous). Never overlap rows or the two subagents of a
row — the reviewer must see the author's finished file, and commits must not race on the git index.

**Subagent A — author.** Launch one `general-purpose` subagent:

   > Read `notes/prompts/knowledge/notes-write-prompt.md` and execute it in full for a single file:
   > - `TOPIC` = {TOPIC}
   > - `FILE` = «the row's en/ path»
   > - `TASK` = «the row's TASK»
   > - `REWRITE_MODE` = «the row's REWRITE_MODE»
   >
   > Do Steps 1–4.5 (resolve TODOs, quality audit, complete to the standard, mirror to `es/`,
   > self-check gate). **Do NOT commit and do NOT mark the worklist row** — an independent reviewer
   > runs next and owns the commit. Leave your work in the working tree. Report: the files you
   > created/modified, the coverage status, and the one-line commit message you'd use.

Wait for A to return. If A reports it could not complete the file (blocked, missing context), skip
the reviewer for this row, leave the row `[ ]`, note it, and move to the next row.

**Subagent B — reviewer.** Launch a second, independent `general-purpose` subagent:

   > Read `notes/prompts/knowledge/notes-review-prompt.md` and execute it in full:
   > - `TOPIC` = {TOPIC}
   > - `FILE` = «the row's en/ path»
   > - `DRY_RUN` = {DRY_RUN}
   >
   > Audit the just-authored file hard against the standard, fix what falls short in both `en/` and
   > `es/`, and finish exactly as that prompt says for this `DRY_RUN` value (if false: mark the row
   > `[x]` and commit atomically; if true: fix only, commit nothing, mark nothing). Report your
   > verdict (PASS/FIXED + what you changed), files touched, and the commit hash if you committed.

Wait for B to return. Record the row result (author status + reviewer verdict + hash, or "dry-run —
staged"). Never launch the next row until B has returned — sequential is required so each file's
commit is atomic, isolated, and can't collide with another subagent's `git` on the index.

If either subagent fails, do not mark that row done, do not commit a partial file, note it, and
continue with the next row (do not abort the whole run for one bad file).

## After all rows — report

Print a summary table of everything processed:

| Row | File | Author status | Reviewer verdict | Commit |
|-----|------|---------------|------------------|--------|

**If `{DRY_RUN}` = false:** tell me how many rows are now `[x]` and whether any remain `[ ]`. If every
row is `[x]`, remind me I can delete `notes/{TOPIC}/notes-worklist.md` (it was never committed — it is
a temporary artifact). If any row failed, list it so I can re-run just that one (`ONLY = <row>`).

**If `{DRY_RUN}` = true:** nothing was committed and no row was marked — everything is staged in the
working tree. Print the **atomic commit sequence** for me to run after I read the diff, one file per
pair of blocks, in processed order (never add `notes-worklist.md`):

```
git add <row 1 en/ path> <row 1 es/ path> <CLAUDE.md if its counter changed>
```
```
git commit -m "<row 1 commit message>"
```

…repeated per file. Also remind me to flip the worklist checkboxes myself (or just re-run with
`DRY_RUN = false` on the rows I'm happy with).

## Hard rules

- **Auto-commit is authorized for this flow only** (and only when `DRY_RUN = false`). Victor's global
  rule is "never auto-commit"; he has explicitly lifted it for the notes-run orchestrator. The
  reviewer subagent commits each file. This exception does not apply anywhere else — normal study
  sessions and the standalone write prompt still hand Victor the commit command to run himself.
- **One atomic commit per file** — never batch multiple notes into one commit, never `git add .`, and
  never commit `notes-worklist.md`.
- **Two subagents per row, author then reviewer, and rows are sequential.** Never overlap them.
  Parallel `git commit`s would race on the git index and corrupt the atomic history; a reviewer must
  never audit a file the author hasn't finished.
- Do not skip the `es/` mirror, the reviewer pass, or (when not dry-run) the worklist checkbox.

````
