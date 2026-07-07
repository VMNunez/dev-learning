# Interview-prep audit — the single entry point for building interview Q&A

Run this **inside Claude Code**. It is the only interview-prep prompt Victor launches. It builds the
interview Q&A for a topic to the full quality standard, hands-off, using a **four-stage cold-subagent
pipeline** per topic:

1. **Market analysis (M)** — a web-backed specialist gathers the *real questions actually asked* of a
   junior for this stack at the target companies, so the Q&A mirrors real interviews, not invented ones.
2. **Author (A)** — builds/audits the Q&A against the standard, using M's real-question list.
3. **Adversarial gap-hunt (G)** — a senior-interviewer hat writes the 12 questions it would really ask
   and returns the ones the file still misses.
4. **Reviewer (B)** — an independent pass that adds G's genuine gaps, enforces the bar (realistic,
   well-worded, Victor's voice, real cited code), and commits.

Each stage is a cold subagent with no stake in the previous one's work, which is what makes the result
exhaustive and realistic instead of a self-trusting single pass. No per-topic launching: one command
does everything.

> **▶ Run first:** `coverage-prompt` for the topic — the Q&A is built to cover every item in the
> topic's `coverage.md`; if coverage is missing or stale, the Q&A will be too. Optional:
> `evidence-intake` to refresh `_job-market-evidence.md`, which the market-analysis stage (M) reads.

**Internal pieces this orchestrates** (you never launch these directly):
`_interview-prep-standard.md` (the bar) · `interview-prep-write-prompt.md` (author) ·
`interview-prep-review-prompt.md` (reviewer). The market-analysis (M) and gap-hunt (G) subagents are
defined inline in the per-topic pipeline below — they are dispatch-only, with no standalone file.

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

## Per-topic pipeline (run all four stages for each topic, in order)

Run the stages **sequentially** — each needs the previous one's output, and only B writes the commit.
Which stages run depends on `{MODE}`:
- **`full`** → all four: **M → A → G → B**.
- **`correct`** → **A → B only**. Skip M and G. Correct mode adds no new questions, so the market list
  and the gap hunt would have nothing to feed — running them there would just burn a web search. A does
  its focused sync/TODO/tidy pass; B does a light review and commits.

M and G are read-only (they write nothing). Only B's commit obeys `{DRY_RUN}`.

**Stage M — interview-question market analysis.** Launch one `general-purpose` subagent,
`run_in_background: false`:

> You are a specialist in junior technical interviews at Spanish IT consultancies. Read `ROADMAP.md`
> and `notes/prompts/_shared-context.md` for the candidate's exact target role, companies, stack, and
> timeline, and `notes/prompts/knowledge/interview-prep/_interview-prep-standard.md` for what a good
> interview question is. The topic is «topic».
>
> Produce the **real questions actually asked** of a junior for this stack on «topic» at the target
> companies:
> - Run a **live web search** for current Spanish junior interview questions on «topic» in this stack
>   (the target companies plus Tecnoempleo / InfoJobs / LinkedIn España and "preguntas entrevista
>   junior {topic} España" style sources); quote the question text you find and date it. If web search
>   is unavailable, say so and use your trained knowledge of the 2026 Spanish market.
> - Cross-check `notes/prompts/_job-market-evidence.md` (real postings on file) as a complement — which
>   «topic» skills recur, and the exact wording the market uses.
>
> Return a flat list of real «topic» interview questions, each written **as an interviewer would say
> it**, tagged with the section it belongs to and a one-word frequency signal (often / sometimes /
> rare) plus a short source note. Do not write or edit any file — return only the list.

Wait for M and keep its list.

**Stage A — author.** Launch a fresh `general-purpose` subagent, `run_in_background: false`:

> Read `notes/prompts/knowledge/interview-prep/interview-prep-write-prompt.md` and execute it in full
> for `FILE = «topic»`, `SECTION = «section»`, `MODE = «mode»`.
> Here is a **market-question list** for «topic» from a live analysis — treat every `often`/`sometimes`
> question in it as required (it must have a well-worded question in the file), and match your phrasing
> to how the market actually asks:
> ```
> «paste M's returned list»
> ```
> Do the sync, TODOs, coverage check, priority markers, format, and the audit sections your mode runs.
> **Do NOT commit and do NOT mark anything done.** Leave your work in the working tree. Report the files
> touched, the coverage status, and the weak-answer / coverage-gap / TODO-pattern blocks.

Wait for A. If A reports it could not complete the topic (blocked, missing context), skip the rest,
note it, and move to the next topic — do not commit a partial file.

**Stage G — adversarial gap-hunt.** Launch a fresh, independent `general-purpose` subagent,
`run_in_background: false`:

> You are a senior technical interviewer at one of the target consultancies (read `ROADMAP.md` and
> `notes/prompts/_shared-context.md` for the exact role/companies, and
> `notes/prompts/_job-market-evidence.md` for what they hire for). You have ~30 minutes with a junior
> candidate and the topic is «topic». Read `notes/interview-prep/en/«topic».md` and
> `notes/prompts/knowledge/interview-prep/_interview-prep-standard.md`.
>
> Write the **12 questions you would actually ask** to decide whether this candidate really knows
> «topic» — mix conceptual, decision ("why X over Y"), and pressure/gotcha, and lean on the recurring
> requirements in the job-market evidence. Then, for each, check whether the file already has a question
> covering it. Output only the **gaps**: the questions the file does NOT cover, each written as the real
> interviewer question, tagged with its section and type (Conceptual / Decision / Pressure). Be
> adversarial — assume the file is incomplete until your 12 questions prove otherwise. Do not edit any
> file — return only the gap list.

Wait for G and keep its gap list.

**Stage B — reviewer.** Launch a fresh, independent `general-purpose` subagent,
`run_in_background: false`:

> Read `notes/prompts/knowledge/interview-prep/interview-prep-review-prompt.md` and execute it in full
> for `FILE = «topic»`, `SECTION = «section»`, `DRY_RUN = {DRY_RUN}`.
> _(full mode only — include this paragraph and the gap list; in correct mode G did not run, so omit
> it.)_ First, an adversarial interviewer found these **gap questions** the file may be missing — add
> every genuine one (skip any truly out of junior scope, note which and why) in the standard's full
> format, to both `en/` and `es/`:
> ```
> «paste G's gap list»
> ```
> Then audit the whole Q&A hard against the standard — especially that questions are realistic,
> well-worded, answered in Victor's voice, and carry a real cited code snippet where an interviewer
> would pose the question with code — fix what falls short in both files, and finish exactly as that
> prompt says for this `DRY_RUN` (false: commit atomically; true: fix only, commit nothing). Carry
> forward the author's summary blocks. Report your verdict, which gap questions you added vs left out,
> files touched, and the commit hash if you committed.

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
- **Stages run sequentially (M → A → G → B in `full`; A → B in `correct`); topics are sequential too.**
  Never overlap them — each stage needs the previous one's output, parallel commits race the git index,
  and a reviewer must never audit an unfinished file.
- **Only B commits.** M, A, and G write no files (M and G write nothing at all; A leaves work in the
  tree). Never let an analysis stage edit the Q&A.
- Never skip the `es/` mirror, the market analysis, the gap-hunt, or the reviewer pass.
````
