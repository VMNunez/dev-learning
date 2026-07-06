# Notes run prompt — orchestrator: build a whole worklist in one shot

Run this **inside Claude Code** (it uses subagents — it does not work as a plain copy-paste chat).
You run it **once** and it processes the entire `notes-worklist.md` for a topic: one file at a time,
each built to the full standard by a fresh subagent, each row auto-checked when done. This is the
prompt that removes the "launch the write prompt N times by hand" work.

**Pipeline:** `notes-plan-prompt.md` (produces `notes-worklist.md`) → **`notes-run-prompt.md`**
(this file, executes and commits every row). One command from you builds the whole topic.

> **Auto-commit note.** Your global rule is "never auto-commit". You have explicitly lifted it for
> this orchestrator only: each subagent commits its own file atomically, so the run needs zero commit
> steps from you. Every other flow (normal sessions, the standalone write prompt) still hands you the
> command to run yourself.

**Why subagents.** Each row is handed to its own subagent that starts cold. That is deliberate: a
fresh context per file preserves the full attention budget for that file, which is the whole reason
the notes work was split into one-file runs. The orchestrator itself stays light — it dispatches,
waits, and collects; it does not hold every file's content in its own context.

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

---

You are the orchestrator for building my {TOPIC} study notes from a pre-computed worklist.

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

## Execution — strictly one row at a time (sequential)

For each row in the run list, **in order**:

1. Launch **exactly one subagent** (`general-purpose`) with `run_in_background: false` so it runs
   synchronously. Its prompt is:

   > Read `notes/prompts/knowledge/notes-write-prompt.md` and execute it in full for a single file,
   > with this configuration:
   > - `TOPIC` = {TOPIC}
   > - `FILE` = «the row's en/ path»
   > - `TASK` = «the row's TASK»
   > - `REWRITE_MODE` = «the row's REWRITE_MODE»
   >
   > Do all of its steps (resolve TODOs, quality audit, complete to the standard in
   > `_note-quality-standard.md`, mirror to `es/`, and Step 5: flip this file's worklist checkbox to
   > `[x]`). The write prompt normally ends by *printing* a commit command for manual use — in this
   > run, **commit the file yourself instead**: `git add` this file's `en/` path, its `es/` path, and
   > CLAUDE.md if you bumped the "next file:" counter (never add `notes-worklist.md`), then
   > `git commit` with the write prompt's message. **One atomic commit for this one file — nothing
   > else.** When finished, report back: (a) the exact list of files committed by full path, (b) the
   > coverage status (✅/🔧/➕), and (c) the commit message and short hash you used.

2. **Wait for that subagent to finish and return before launching the next row.** Never run two rows
   at once — sequential is required so each file's commit is atomic, isolated, and can't collide with
   another subagent's `git` on the index. Record what it reported (files committed + status + hash).

3. If a subagent fails or reports it could not complete the file, do not mark that row done, do not
   commit a partial file, note it, and continue with the next row (do not abort the whole run for one
   bad file).

## After all rows — report

Print a summary table of everything processed:

| Row | File | Status | Commit | Files committed |
|-----|------|--------|--------|-----------------|

Tell me how many worklist rows are now `[x]` and whether any remain `[ ]`. If every row is `[x]`,
remind me I can delete `notes/{TOPIC}/notes-worklist.md` (it was never committed — it is a temporary
artifact). If any row failed, list it so I can re-run just that one (`ONLY = <row>`).

## Hard rules

- **Auto-commit is authorized for this flow only.** Victor's global rule is "never auto-commit"; he
  has explicitly lifted it for the notes-run orchestrator. Subagents commit their own file. This
  exception does not apply anywhere else — normal study sessions and the standalone write prompt still
  hand Victor the commit command to run himself.
- **One atomic commit per file** — never batch multiple notes into one commit, never `git add .`, and
  never commit `notes-worklist.md`.
- Subagents must be launched **sequentially**, one at a time, waiting for each — never in parallel.
  Parallel `git commit`s would race on the git index and corrupt the atomic history.
- Do not skip the `es/` mirror or the worklist checkbox — those are the subagent's Steps 4 and 5.

````
