# Interview-prep audit — the single entry point for building interview Q&A

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

Run this **inside the supported agent runtime**. It is the only interview-prep prompt Victor launches. It builds the
interview Q&A for a topic to the full quality standard, hands-off. The key design point: **the deep
work — authoring and reviewing questions — is done one cold subagent per SECTION, not per whole topic
file.** A section is small enough to keep full attention on, yet complete enough to check the type
ratio and priority order (both per-section). Around that sit two light, whole-topic **detection**
stages that write nothing:

1. **Market analysis (M)** — a web-backed specialist gathers the *real questions actually asked* of a
   candidate at the selected level for this stack at the target companies, tagged by section.
2. **Adversarial gap-hunt (G)** — a senior-interviewer hat writes, uncapped, the questions it would
   really ask and returns, tagged by section, the ones the file still misses.
3. **Per-section Author (A) → Reviewer (B)** — for each section in turn, a fresh author writes/audits
   just that section (fed its slice of M + G), then an independent reviewer audits just that section
   (realistic, well-worded, Victor's voice, real cited code). Neither commits.

Each stage is a cold subagent with no stake in the previous one's work, which is what makes the result
exhaustive and realistic instead of a self-trusting single pass. The orchestrator does only the light
whole-topic detection and the final per-topic commit. No per-topic launching: one command does
everything.

> **▶ Run first:** complete this exact topic and level through `coverage-prompt` →
> `notes-plan-prompt` → one `notes-audit` per plan entry. Every entry in
> `notes/{topic}/coverage/notes-plan-{LEVEL}.md` must be `complete` or `refined`; otherwise this prompt stops.
> Angular also requires the Angular Material plan at the selected level because both topics share
> `angular.md`. Optional: `evidence-intake` to refresh `_job-market-evidence.md`, which Stage M reads.

> **Run-start check (step 0):** before anything else, run the check in `notes/prompts/_internal/_pipeline-self-report.md` — read `_internal/_last-run-report-interview-prep-audit.md` (not the `notes-and-interview-prep` one beside it) and, if its `Status` is `open`, surface that finding in one line before proceeding.

**Internal pieces this orchestrates** (you never launch these directly):
`_interview-prep-standard.md` (the bar) · `_interview-prep-write-prompt.md` (author) ·
`_interview-prep-review-prompt.md` (reviewer). The market-analysis (M) and gap-hunt (G) subagents are
defined inline in the per-topic pipeline below — they are dispatch-only, with no standalone file.

> **First run on a topic, use `DRY_RUN = true`.** It builds and reviews everything but commits nothing,
> so you can read the diff before it lands. Once you trust it, `DRY_RUN = false` is fully hands-off.

---

## How to use — recipes

Open a fresh chat **inside the supported agent runtime**, paste the whole prompt below, fill only the config block, and
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

LEVEL = [junior | middle | senior]
FILE = [angular | css | javascript | typescript | sql | java | spring | spring-boot | architecture | git | general | security | all]
       → notes/interview-prep/{LEVEL}/en/{FILE}.md + notes/interview-prep/{LEVEL}/es/{FILE}.md
       → FILE = all audits every topic in turn — see notes/prompts/_internal/_batch-mode.md. Order:
         angular, spring, spring-boot, java, architecture, security, typescript, sql, javascript, css, git, general.
       → Angular Material has no file of its own: the `angular` run also verifies
         notes/angular-material/coverage/{LEVEL}.md and places any Material questions in angular.md
         (the author handles this in its Step 3).

SECTION = [all | ## Routing | ## Forms | ...]   ← "all" for the whole file, or one exact heading
          (ignored when FILE = all — a batch run always uses SECTION = all)

MODE = [full | correct]
       → full (default): the complete audit — sync, TODOs, coverage, priority markers, format, and all
         four audit sections (missing topics, weak answers, imbalances, missing questions).
       → correct: a focused "I just wrote/edited this file — correct it" pass (sync + TODOs + format/
         priority tidy + weak-answer report only; adds no new questions).

DRY_RUN = [false | true]

Use LEVEL, FILE, SECTION, MODE, and DRY_RUN wherever the prompt refers to {LEVEL}, {FILE}, {SECTION}, {MODE}, {DRY_RUN}.


Progression gate: middle interview-prep authoring requires consolidated junior notes, questions, and practical recall; senior requires consolidated junior and middle levels. Stop if the required gate is not closed.

The Q&A files for different levels are physically separate. Never read from or write to another
level as a substitute for a missing selected-level file.
---

You are the orchestrator for building Victor's interview Q&A, hands-off.

> **Branch guard (step 0):** run `git branch --show-current`. Study materials commit on whatever
> branch is currently active (the shared session rules) — a feature branch is the normal case; name it in the final
> report. If you are on **`main`**, stop and ask Victor which branch to use — `main` never receives
> direct commits, only merges via PR.

> **Verifiable reads (the shared session rules non-negotiable):** any subagent that must read a whole file (G reads
> the full `en/` Q&A; A and B read both `en/`+`es/` files to locate their section) runs `wc -l`
> first — the Read tool truncates at 2000 lines **silently** — and reads with `offset` passes to the
> real end if the file is near or over that. G's report must state **"N lines, read to EOF"** for
> the Q&A file; treat a G report without it as unusable (re-dispatch once).

First read
`notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md` so you know the bar you are
enforcing. You stay light: you dispatch subagents, wait, and collect — you never hold every topic's
Q&A in your own context.

For each selected topic, calculate the lowercase SHA-256 digest over the **scope bytes** of
`notes/{topic}/coverage/{LEVEL}.md` before dispatch — its exact UTF-8 bytes with every trailing ` ✅ NN-slug — {evidence}`
evidence marker stripped, per the canonical command in "Evidence markers" in `_coverage-standard.md`. For Angular calculate Angular and Angular Material
separately. Compare them with the selected-level EN and ES metadata:

- matching in both files → current;
- missing or different → stale, continue only in `MODE = full`;
- EN/ES metadata differs → parity failure that this run must fix.

Never copy a fingerprint from another level or trust a timestamp in its place.

Before market analysis, verify the completed-notes prerequisite:

1. Resolve `notes/{topic}/coverage/notes-plan-{LEVEL}.md`; for Angular resolve both Angular and
   Angular Material plans.
2. Require `Plan status: current` and a plan coverage fingerprint matching the exact current
   coverage bytes.
3. Require every numbered entry to have `Status: complete` or `Status: refined`.
4. Require every completed entry's declared English and Spanish files to exist.
5. If any check fails, stop that topic and report the exact pending/stale/missing entries. Never
   generate Q&A from a partially built topic.

## Decide the topic list

- **`FILE` is one topic** → the list is just that topic (with `{SECTION}` and `{MODE}` as given).
- **`FILE = all`** → the list is, in order: angular, spring, spring-boot, java, architecture, security,
  typescript, sql, javascript, css, git, general. Force `SECTION = all` for every topic.

Process topics **one at a time, sequentially** — never overlap them, because each topic's reviewer
commits and parallel commits race the git index.

If the selected-level EN/ES pair does not exist, create an empty bilingual skeleton for that topic.
Derive its initial `##` work list from the selected coverage sections plus the M/G classifications;
do not borrow headings or questions from another level. Write fingerprints only after the new pair
passes the complete audit.

## Per-topic pipeline — whole-topic detection, then per-SECTION deep work

**The unit of deep work is one SECTION, not the whole topic file.** A Q&A file is a list of
independent sections (`## Routing`, `## Forms`, …); a section is small enough to author and audit with
full attention, yet complete enough that the type ratio (55/35/10) and the priority ordering — both
defined per section — can still be checked. So **detection is whole-topic and light (it stays in the
orchestrator or a read-only subagent); authoring and review are one cold subagent per section, in
sequence.** Never hand one subagent the whole file to author or audit — that is the large task Victor
does not want.

Which parts run depends on `{MODE}`:
- **`full`** → whole-topic detection (**M**, **G**, sync/route) → per-section **A → B** (deep).
- **`correct`** → per-section **A → B** only (skip M and G — correct mode adds no new questions, so the
  market list and gap hunt would have nothing to feed). The light en/es sync check still runs first.

M and G write nothing; A and B leave their work in the tree; **only the orchestrator commits, once per
topic**, after all sections are done. Everything is sequential — never overlap sections or the two
subagents of a section, because they edit the same two files.

---

### Whole-topic detection (light — needs the cross-section view)

**Stage M — interview-question market analysis (full mode only).** Launch one `role-appropriate`
subagent, `reasoning tier: deep`, `execution: foreground` (market judgment shapes every question downstream):

> You are a specialist in technical interviews for **«level» candidates** at Spanish IT consultancies. Read `ROADMAP.md`
> and `notes/prompts/_internal/_shared-context.md` for the candidate's exact target role, companies, stack, and
> timeline, and `notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md` for what a good
> interview question is. The topic is «topic».
>
> Produce the **real questions actually asked** of a «level» candidate for this stack on «topic» at the target
> companies:
> - Run a **live web search** for current Spanish «level» interview questions on «topic» in this stack
>   (the target companies plus Tecnoempleo / InfoJobs / LinkedIn España and "preguntas entrevista
>   «level» {topic} España" style sources); quote the question text you find and date it. If web search
>   is unavailable, say so and use your trained knowledge of the 2026 Spanish market.
> - Cross-check `notes/prompts/_internal/_job-market-evidence.md` (real postings on file) as a complement — which
>   «topic» skills recur, and the exact wording the market uses.
>
> Return a flat list of real «topic» interview questions, each written **as an interviewer would say
> it**, tagged with the section it belongs to, a one-word frequency signal (often / sometimes /
> rare), and a provenance tag: `[sourced]` (you found it in the live search or the evidence file —
> include the short source note) or `[trained]` (from your trained knowledge of the market). Do not
> write or edit any file — return only the list.

Wait for M and keep its list — **it must be tagged by section** (each question carries the `##` heading
it belongs to), so you can hand each section only its own slice later.

**Stage G — adversarial gap-hunt (full mode only).** Launch a fresh, independent `role-appropriate`
subagent, `reasoning tier: deep`, `execution: foreground` (adversarial creativity — a cheap model finds
the obvious gaps, not the ones that matter):

> You are a senior technical interviewer at one of the target consultancies (read `ROADMAP.md` and
> `notes/prompts/_internal/_shared-context.md` for the exact role/companies, and
> `notes/prompts/_internal/_job-market-evidence.md` for what they hire for). You have ~30 minutes with a
> **«level» candidate** and the topic is «topic». Read
> `notes/interview-prep/«level»/en/«topic».md` and
> `notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md`.
>
> Write the questions you would actually ask to decide whether this candidate really knows «topic» —
> **as many as you genuinely would use; do not stop at a fixed number, be exhaustive** (a capped
> interviewer finds only the gaps that fit its question budget — a real coverage run proved it: one
> capped pass returned 13 gaps and looked convergent while uncapped angles found 80+ more). Mix
> conceptual, decision ("why X over Y"), and pressure/gotcha, and lean on the recurring requirements
> in the job-market evidence. Then, for each, check whether the file already has a question covering
> it. Output only the **gaps**: the questions the file does NOT cover, each written as the real
> interviewer question, tagged with its section and type (Conceptual / Decision / Pressure). Be
> adversarial — assume the file is incomplete until your questions prove otherwise. Run `wc -l` on
> the Q&A file before reading it and state "N lines, read to EOF" in your report. Do not edit any
> file — return only the gap list and that line, no narrative.

Wait for G and keep its gap list — **also tagged by section**.

**Build the per-section work list (orchestrator).** Read the `##` section headings in
`notes/interview-prep/{LEVEL}/en/{FILE}.md` and the topic's `coverage/{LEVEL}.md` sections. If `{SECTION}` ≠ all, the
list is just that one section. For each section, assemble its **slice**: the M questions tagged to it +
the G gaps tagged to it + its coverage items. Also run the light **en/es file-level sync check** here
(same sections, same question counts on each side) and route each mismatch into the owning section's
slice. This is structural detection — do it in your own context; **do not author any question here.**

---

### Per-section deep work (one cold subagent per section, sequential)

For **each section in the work list, in order**, run Author then Reviewer. Never overlap sections, and
never overlap a section's two subagents — they edit the same two files. Neither subagent commits.

**Author (A).** Launch a fresh `role-appropriate` subagent, `reasoning tier: deep`, `execution: foreground`
(writes bilingual Q&A in Victor's voice — prose quality is the product):

> Read `notes/prompts/knowledge/interview-prep/_internal/_interview-prep-write-prompt.md` and execute it for
> `FILE = «topic»`, `SECTION = «this exact heading»`, `MODE = «mode»`. **Work on this one section
> only** — read it in full in both `en/{FILE}.md` and `es/{FILE}.md`, top to bottom. Here is its
> market/gap slice — treat every `often`/`sometimes` market question and every genuine gap as required
> (a well-worded question must exist for each), and match the market's phrasing:
> ```
> «paste this section's slice: M questions + G gaps for this heading»
> ```
> Do the section's TODOs, coverage check, priority markers, and format for this section only. **Do NOT
> commit, do NOT mark anything done, do NOT touch other sections.** Leave your work in the tree. Return
> a **question-by-question trace for this section** (each question with PASS or the change you made) as
> proof you read it whole, plus the weak-answer / coverage-gap / TODO-pattern notes for this section.
> Respect the studied marker: questions ending in `[x]` are content Victor has studied — structural
> fixes only, report weak ones instead of rewriting (see the standard).

Wait for A. If A reports it could not complete the section (blocked, missing context), skip that
section's reviewer, note it, and move to the next section — do not leave a half-authored section for
the reviewer.

**Reviewer (B).** Launch a fresh, independent `role-appropriate` subagent, `reasoning tier: deep`,
`execution: foreground` (it rewrites weak questions freely — that is authoring, not checklist
verification):

> Read `notes/prompts/knowledge/interview-prep/_internal/_interview-prep-review-prompt.md` and execute it for
> `FILE = «topic»`, `SECTION = «this exact heading»`, `DRY_RUN = true`. **Audit this one section
> only**, in full in both `en/` + `es/`: realistic, well-worded, in Victor's voice, real cited code
> where an interviewer poses the question with code, correct type ratio and priority order within the
> section. Rewrite freely any question **without** the `[x]` studied marker; questions ending in `[x]`
> are content Victor has studied — always-allowed structural fixes only, and **report** anything below
> bar there as a weak answer (see the standard). Fix what falls short in both files. `DRY_RUN = true`
> means **fix only, do not
> commit** — the orchestrator commits once per topic after every section. Return your verdict and a
> **question-by-question trace for this section**.

Wait for B. **Acceptance gate — verify the trace and the slice coverage (orchestrator).** Two checks
before moving on, using the section slice you assembled (it is already in your context):
- **Trace:** B's report must contain the question-by-question trace for this section. Missing or
  partial trace → that was not a full audit.
- **Slice coverage:** every `often`/`sometimes` market question (M) and every gap (G) in this section's
  slice must now be covered by a question — confirmed by A's or B's trace. Uncovered items mean the
  section is not done, even if B said PASS.

If either check fails, re-dispatch B **once** for this section, listing the missing trace lines and the
uncovered slice items so it knows exactly what to close. One retry maximum; if items are still
uncovered after the retry, list them explicitly in the final summary instead of looping — never report
the section as complete. Only then start the next section.

---

### Finish the topic (orchestrator — light global scan, then commit)

After every section is done, do the light whole-file structural pass in your own context — this needs
the cross-section view, so it belongs here, not in a per-section subagent:
- **Cross-section duplicate scan** — the same question landing in two sections → keep it in the one
  where an interviewer is likeliest to ask it, remove the other.
- **en/es parity** — same sections, same order, same question count on both sides.
- **Global priority sanity** — no section is more than half ⭐⭐⭐.
- **Coverage fingerprint** — after all substantive and parity gates pass, write the exact current
  coverage SHA-256 value required by the standard to both language files. For Angular, write both
  the Angular and Angular Material coverage fingerprints. A stale fingerprint is expected at run
  start and must be reported; only a successful full audit may refresh it. `MODE = correct` must stop
  on a missing or mismatched fingerprint and request `MODE = full`.

Fix a stray duplicate or ordering issue directly (structural, not authoring). Then commit per
`{DRY_RUN}` — **one atomic commit for the whole topic** (the `en/` + `es/` pair). **Safety check
before committing:** run `git status` before the add and again before the commit — confirm only the
topic's `en/` + `es/` pair is staged, and `git restore --staged` anything else (a project code file
left staged from an earlier step has ridden along into a notes commit before). This is the only
commit; the section subagents never committed.

**Context discipline (matters in `FILE = all`).** Once a topic is committed, condense everything you
were holding for it — the M list, the G gaps, the per-section slices and traces — down to one verdict
line per topic (author status · reviewer verdict · commit · any uncovered items) for the final report.
Carry nothing else into the next topic: the deep detail did its job at the acceptance gate, and
holding eleven topics' worth of it is exactly the context saturation this per-section design avoids.

## Finishing

**If `{DRY_RUN}` = false:** everything is committed, one atomic commit per topic. Report the commits
made and the per-topic verdict table (author status · reviewer verdict · commit). List any topic that
failed so it can be re-run (`FILE` = that topic).

**If `{DRY_RUN}` = true:** nothing was committed — all changes remain in the working tree for Victor
to read. Print the atomic commit sequence to run after reviewing the diff, one topic per pair of blocks:

```
git add notes/interview-prep/<level>/en/<topic>.md notes/interview-prep/<level>/es/<topic>.md
```
```
git commit -m "<that topic's commit message>"
```

Then print the consolidated summary across all topics processed: weak answers found (add a TODO to get
each fixed next run), coverage gaps found (add to coverage/{LEVEL}.md via `coverage-prompt`), and TODO patterns
detected (recommended standard rule additions).

## Hard rules

- **One SECTION per subagent for the deep work — ALWAYS, even at higher token cost.** Authoring and
  review are one cold subagent per section, in sequence. Never hand one subagent the whole topic file
  to author or audit — a subagent that carries every section degrades toward the end and skims the last
  ones. Whole-topic work is limited to the *light detection* stages (M, G, the sync/dedupe scans),
  which genuinely need the cross-section view and write nothing. Each per-section subagent reads its
  section in full in both `en/`+`es/` and returns a **question-by-question trace** as proof.
- **Auto-commit is authorized for this flow only, and only when `DRY_RUN = false`.** Victor's global
  rule is "never auto-commit"; he lifted it for this orchestrator (same lift as notes-audit and
  progress-update). It applies nowhere else.
- **Only the orchestrator commits — once per topic** (the `en/` + `es/` pair), after every section is
  done. M, A, G, and B write no commit (M and G write nothing at all; A and B leave their work in the
  tree). Never batch topics, never `git add .`.
- **Sequential everywhere.** Full mode per topic: M → G → [per section: A → B] → commit; correct mode:
  [per section: A → B] → commit. Sections are sequential, a section's A → B is sequential, and topics
  are sequential too — never overlap, because they edit the same files and parallel commits race the
  git index, and a reviewer must never audit an unfinished section.
- Never skip the `es/` mirror or the per-section reviewer pass. In `MODE = full`, never skip market
  analysis or the gap-hunt; `MODE = correct` deliberately omits those two read-only discovery stages.

### Final step — pipeline self-report

After everything above is done, read `notes/prompts/_internal/_pipeline-self-report.md` and execute it for this
run — write `notes/prompts/knowledge/interview-prep/_internal/_last-run-report-interview-prep-audit.md`
(this folder is shared with `notes-and-interview-prep`, so both reports carry their orchestrator's
suffix and neither owns the unsuffixed name), commit it on its own with `_run-tracker.md`, and print the
five bullets in chat.

````
