# Interview-prep audit — the single entry point for building interview Q&A

Run this **inside Claude Code**. It is the only interview-prep prompt Victor launches. It builds the
interview Q&A for a topic to the full quality standard, hands-off, using a two-subagent pipeline per
topic: every file is **authored by one cold subagent and then audited/fixed by a second, independent
reviewer subagent** before it is committed. The reviewer has no stake in the draft, so it reads against
the bar — realistic questions, well-worded, answered in Victor's voice — and catches what the author
trusted. No per-topic launching: one command does everything.

> **▶ Run first:** `coverage-prompt` for the topic — the Q&A is built to cover every item in the
> topic's `coverage.md`; if coverage is missing or stale, the Q&A will be too.

**Internal pieces this orchestrates** (you never launch these directly):
`_interview-prep-standard.md` (the bar) · `interview-prep-write-prompt.md` (author) ·
`interview-prep-review-prompt.md` (reviewer).

> **First run on a topic, use `DRY_RUN = true`.** It builds and reviews everything but commits nothing,
> so you can read the diff before it lands. Once you trust it, `DRY_RUN = false` is fully hands-off.

---

## How to use — recipes

Open a fresh chat **inside Claude Code**, paste the whole prompt below, fill only the config block, and
let it run to the end. You touch nothing else — no per-topic launching, no commits to run (unless
`DRY_RUN = true`). Pick the recipe:

**A · Build or audit one whole topic** (e.g. finish the Spring Boot Q&A)
```
FILE    = spring-boot
SECTION = all
MODE    = full
DRY_RUN = true       ← true the first time on a topic; false once you trust it
```

**B · Correct one topic you just edited** (sync + TODOs + tidy only, no new questions)
```
FILE    = angular
SECTION = all
MODE    = correct
DRY_RUN = false
```

**C · Audit one section of a topic**
```
FILE    = sql
SECTION = ## JOINs
MODE    = full
DRY_RUN = false
```

**Rules of thumb:**
- **First time on any topic → `DRY_RUN = true`.** It writes and reviews everything but commits nothing;
  you read the diff, then re-run with `DRY_RUN = false` (or paste the commit it printed).
- Fill in **only** the config block. Everything below it is machinery — never edit it.
- `FILE = all` runs every topic in turn (see the order in the config block).

---

````
## Configuration — edit only this block

FILE = [angular | css | javascript | typescript | sql | java | spring-boot | architecture | git | general | security | all]
       → notes/interview-prep/en/{FILE}.md + notes/interview-prep/es/{FILE}.md
       → FILE = all audits every topic in turn — see notes/prompts/_batch-mode.md. Order:
         angular, spring-boot, java, architecture, security, typescript, sql, javascript, css, git, general.

SECTION = [all | ## Routing | ## Forms | ...]   ← "all" for the whole file, or one exact heading
          (ignored when FILE = all — a batch run always uses SECTION = all)

MODE = [full | correct]
       → full (default): the complete audit — sync, TODOs, coverage, priority markers, format, and all
         four audit sections (missing topics, weak answers, imbalances, missing questions).
       → correct: a focused "I just wrote/edited this file — correct it" pass (sync + TODOs + format/
         priority tidy + weak-answer report only; adds no new questions).

DRY_RUN = [false | true]

Use FILE, SECTION, MODE, and DRY_RUN wherever the prompt refers to {FILE}, {SECTION}, {MODE}, {DRY_RUN}.

---

You are the orchestrator for building Victor's interview Q&A, hands-off. First read
`notes/prompts/knowledge/interview-prep/_interview-prep-standard.md` so you know the bar you are
enforcing. You stay light: you dispatch subagents, wait, and collect — you never hold every topic's
Q&A in your own context.

## Decide the topic list

- **`FILE` is one topic** → the list is just that topic (with `{SECTION}` and `{MODE}` as given).
- **`FILE = all`** → the list is, in order: angular, spring-boot, java, architecture, security,
  typescript, sql, javascript, css, git, general. Force `SECTION = all` for every topic.

Process topics **one at a time, sequentially** — never overlap them, because each topic's reviewer
commits and parallel commits race the git index.

## Per-topic pipeline (run for each topic in the list)

**Subagent A — author.** Launch one `general-purpose` subagent, `run_in_background: false`:

> Read `notes/prompts/knowledge/interview-prep/interview-prep-write-prompt.md` and execute it in full
> for `FILE = «topic»`, `SECTION = «section»`, `MODE = «mode»`.
> Do the sync, TODOs, coverage check, priority markers, format, and the audit sections your mode runs.
> **Do NOT commit and do NOT mark anything done** — an independent reviewer runs next and owns the
> commit. Leave your work in the working tree. Report the files touched, the coverage status, the
> weak-answer / coverage-gap / TODO-pattern blocks, and the one-line commit message you'd use.

Wait for A. If A reports it could not complete the topic (blocked, missing context), skip the reviewer,
note it, and move to the next topic — do not commit a partial file.

**Subagent B — reviewer.** Launch a second, independent `general-purpose` subagent,
`run_in_background: false`:

> Read `notes/prompts/knowledge/interview-prep/interview-prep-review-prompt.md` and execute it in full
> for `FILE = «topic»`, `SECTION = «section»`, `DRY_RUN = {DRY_RUN}`.
> Audit the just-authored Q&A hard against the standard — especially that questions are realistic,
> well-worded, and answered in Victor's voice — fix what falls short in both `en/` and `es/`, and
> finish exactly as that prompt says for this `DRY_RUN` (false: commit atomically; true: fix only,
> commit nothing). Carry forward the author's summary blocks. Report your verdict, files touched, and
> the commit hash if you committed.

Wait for B before starting the next topic.

## Finishing

**If `{DRY_RUN}` = false:** everything is committed, one atomic commit per topic. Report the commits
made and the per-topic verdict table (author status · reviewer verdict · commit). List any topic that
failed so it can be re-run (`FILE` = that topic).

**If `{DRY_RUN}` = true:** nothing was committed — all changes are staged in the working tree for Victor
to read. Print the atomic commit sequence to run after reviewing the diff, one topic per pair of blocks:

```
git add notes/interview-prep/en/<topic>.md notes/interview-prep/es/<topic>.md
```
```
git commit -m "<that topic's commit message>"
```

Then print the consolidated summary across all topics processed: weak answers found (add a TODO to get
each fixed next run), coverage gaps found (add to coverage.md via `coverage-prompt`), and TODO patterns
detected (recommended standard rule additions).

## Hard rules

- **Auto-commit is authorized for this flow only, and only when `DRY_RUN = false`.** Victor's global
  rule is "never auto-commit"; he lifted it for this orchestrator (same lift as notes-audit and
  progress-update). The reviewer subagent commits each topic. It applies nowhere else.
- **One atomic commit per topic** (the `en/` + `es/` pair). Never batch topics, never `git add .`.
- **Two subagents per topic, author then reviewer; topics are sequential.** Never overlap them —
  parallel commits race the git index, and a reviewer must never audit an unfinished file.
- Never skip the `es/` mirror or the reviewer pass.
````
