# Notes build prompt — plan + run in one command

Run this **inside Claude Code**. It chains the two halves of the notes system with no stop in
between: it plans the topic (produces the worklist) and then immediately builds every row
(author → reviewer → commit). One command takes a topic folder from wherever it is to fully written
and committed notes.

**Use this when you trust the pipeline and don't need to eyeball the worklist first.** The trade-off
is real: running `notes-plan-prompt.md` and `notes-run-prompt.md` as two separate steps gives you a
**human checkpoint** — you read the worklist and can edit or drop rows before anything is built. This
prompt skips that checkpoint. If you want the checkpoint, run the two prompts separately instead.

> **First time on a topic, prefer `DRY_RUN = true`** (or run the two prompts separately). It plans and
> builds everything but commits nothing, so you can read the diff before it lands. Once you trust it,
> `DRY_RUN = false` for a hands-off build.

---

**How to use:**

1. Fill in `TOPIC` and `DRY_RUN`.
2. Paste into Claude Code and let it run to the end.

---

````
## Configuration — edit only this block

TOPIC   = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]
DRY_RUN = [false | true]

Use TOPIC and DRY_RUN wherever the prompt refers to {TOPIC} or {DRY_RUN}.

---

Build my {TOPIC} study notes end to end, in two phases, without pausing for confirmation between them.

## Phase 1 — Plan

Execute `notes/prompts/knowledge/notes-plan-prompt.md` in full for `TOPIC = {TOPIC}` (derive
`NOTES_PATH` the same way that prompt specifies — for Spring Boot, that means both `notes/java/en/`
and `notes/spring-boot/en/`). This does the folder setup, the `en`/`es` parity check, the gap and
sequence analysis, `future-learning.md`, and writes `notes/{TOPIC}/notes-worklist.md` with a numbered,
ordered row per file to build. Do the Step 0 / Step 4 structural commit exactly as that prompt says
(never commit `notes-worklist.md`).

Print the worklist you produced so it is visible in the transcript, then continue straight to Phase 2
— do not stop to ask me whether to proceed.

## Phase 2 — Run

Execute `notes/prompts/knowledge/notes-run-prompt.md` in full for `TOPIC = {TOPIC}`, `ONLY` = (blank,
every unchecked row), and `DRY_RUN = {DRY_RUN}`. That means, for each worklist row in order: subagent
A authors the file, subagent B reviews and fixes it, then (if `DRY_RUN = false`) the reviewer marks
the row `[x]` and commits it atomically. Honour every hard rule in that prompt — sequential rows, two
subagents per row, one atomic commit per file, and the auto-commit exception scoped to this flow.

## Finish

Produce the run prompt's final report (the per-row table and the `[x]` / dry-run summary). If
`DRY_RUN = true`, include the atomic commit sequence for me to run after reading the diff. If every
row is `[x]`, remind me I can delete `notes/{TOPIC}/notes-worklist.md`.

````
