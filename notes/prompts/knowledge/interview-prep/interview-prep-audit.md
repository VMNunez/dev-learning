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
2. **Market gap-hunt (G)** — a senior-interviewer hat identifies the realistic often/sometimes
   questions the file still misses, without converting every coverage bullet into Q&A.
3. **Per-section Author (A) → Reviewer (B)** — for each section in turn, a fresh author writes/audits
   just that section (fed its slice of M + G), then an independent reviewer audits just that section
   (realistic, well-worded, Victor's voice, real cited code). Neither commits.

Each stage is a cold subagent with no stake in the previous one's work, which is what makes the result
selective and realistic instead of a self-trusting single pass. The orchestrator does only the light
whole-topic detection and the final per-topic commit. No per-topic launching: one command does
everything.

> **▶ Run first:** run `coverage-prompt` and `notes-plan-prompt` for this exact topic and level. The
> coverage and plan must be current, but junior note entries may still be pending: this pipeline builds
> unrefined interview material, and Victor's later `[refined]` transition is the gate that says he has
> learned and accepted the answer.
> Angular also requires the Angular Material plan at the selected level because both topics share
> `angular.md`. Optional: `evidence-intake` to refresh `_job-market-evidence.md`, which Stage M reads.

> **Run-start check (step 0):** before anything else, execute the decision table in `notes/prompts/_internal/_pipeline-self-report.md` against `_internal/_last-run-report-interview-prep-audit.md`; never restate the shared `Status:` meanings here.

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
       → full (default): the complete audit — sync, TODOs, market relevance, priority markers, stable
         IDs, format, and all
         four audit sections (missing topics, weak answers, imbalances, missing questions).
       → correct: a focused "I just wrote/edited this file — correct it" pass (sync + TODOs + format/
         priority tidy + weak-answer report only; adds no new questions). It binds **both** per-section
         subagents: the author and the reviewer each fix the mechanical/parity half and report the
         quality bar, so nothing rewrites what Victor just wrote.

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

> **Run baseline (step 0).** Record the current commit (`git rev-parse HEAD`) as `{BASELINE}`, and for
> each topic, **before its first author dispatch**, run `git status --porcelain` on that topic's `en/` +
> `es/` pair. This is the only moment the pre-run bytes of a section are still identifiable: the topic
> commit stages that pair wholesale, so once a section subagent has edited it, nothing in the tree
> distinguishes finished work from half-written work. A **clean** pair means `{BASELINE}` holds that
> topic's pre-run bytes and the restore branch below is available; a **dirty** one means the tree
> already carries changes this run did not make, so `{BASELINE}` is not its baseline and restoring is
> unavailable for that topic. **Clean is not the same as present:** for a topic whose pair does not
> exist yet — this run creates that skeleton below — `git status --porcelain` has no record to print,
> which reads as clean while `git show {BASELINE}:…` would fail outright. Restoring is unavailable
> there too, as the restore branch's own "existed under that exact heading at `{BASELINE}`" condition
> independently says. Record which of the three it is and carry it to that topic's sections. This
> is a **baseline-availability** check and nothing more — do not read it as a detector of who else wrote
> to the pair, a question the standard rules on and this prompt does not.

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
`notes/{topic}/coverage/{LEVEL}.md` before dispatch, using the canonical command in "Evidence markers"
in `_coverage-standard.md`, which alone defines the byte normalisation and marker stripping. Never
reproduce or approximate that definition locally. For Angular calculate Angular and Angular Material
separately. Compare them with the selected-level EN and ES metadata:

- matching in both files → current;
- missing or different → stale, continue only in `MODE = full`;
- EN/ES metadata differs → parity failure that this run must fix.

Never copy a fingerprint from another level or trust a timestamp in its place.

Before market analysis, verify the planning prerequisite:

1. Resolve `notes/{topic}/coverage/notes-plan-{LEVEL}.md`; for Angular resolve both Angular and
   Angular Material plans.
2. Require `Plan status: current` and a plan coverage fingerprint matching the exact current
   coverage bytes.
3. Inventory entry status and declared bilingual files. Pending junior entries are allowed and are
   reported as learning context; a complete/refined entry missing either file is a broken gate.
4. For middle/senior, keep the progression gate above: earlier-level notes, interview questions and
   practical recall must be consolidated.
5. If the plan/fingerprint or an accepted file is broken, stop and report the exact stale/missing item.

On the first successful `MODE = full` migration of a legacy bank, allocate stable IDs in existing order
and convert every legacy `[x]` to `[refined] [studied]`; the old marker already meant both frozen and
studied. Questions without `[x]` remain unrefined. Never infer `[refined]` from prose quality.

## Decide the topic list

- **`FILE` is one topic** → the list is just that topic (with `{SECTION}` and `{MODE}` as given).
- **`FILE = all`** → the list is, in order: angular, spring, spring-boot, java, architecture, security,
  typescript, sql, javascript, css, git, general. Force `SECTION = all` for every topic.

Process topics **one at a time, sequentially** — never overlap them, because the orchestrator commits
once per topic and parallel commits race the git index.

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
  **B runs under the same `correct` as A** — the mode narrows what each of them may rewrite; it never
  drops the reviewer.

M and G write nothing; A and B leave their work in the tree; **only the orchestrator commits, once per
topic**, after all sections are done. Everything is sequential — never overlap sections or the two
subagents of a section, because they edit the same two files.

---

### Whole-topic detection (light — needs the cross-section view)

**Stage M — interview-question market analysis (full mode only).** Launch one `role-appropriate`
subagent, `reasoning tier: deep`, `execution: foreground` (market judgment shapes every question downstream):

> You are a specialist in technical interviews for **«level» candidates** at Spanish IT consultancies. Read
> `notes/prompts/_internal/_shared-context.md` for the candidate's exact target role, companies and stack,
> `ROADMAP.md` for the timeline built on them,
> and `notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md` for what a good
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

> You are a senior technical interviewer at one of the target consultancies (read
> `notes/prompts/_internal/_shared-context.md` for the exact role/companies, and
> `notes/prompts/_internal/_job-market-evidence.md` for what they hire for). You have ~30 minutes with a
> **«level» candidate** and the topic is «topic». Read
> `notes/interview-prep/«level»/en/«topic».md` and
> `notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md`.
>
> Write the questions you would actually ask to decide whether this candidate really knows «topic» in
> a real screening or technical round. Include every genuine often/sometimes angle, but reject trivia,
> pedagogical substeps and alternate phrasings of a concept already tested. Mix
> conceptual, decision ("why X over Y"), and pressure/gotcha, and lean on the recurring requirements
> in the job-market evidence. Then, for each, check whether the file already has a question covering
> it. Output only the **market gaps**: the questions the file does NOT cover, each written as the real
> interviewer question, tagged with its section and type (Conceptual / Decision / Pressure). Be
> adversarial — assume the file is incomplete until your questions prove otherwise. Run `wc -l` on
> the Q&A file before reading it and state "N lines, read to EOF" in your report. Do not edit any
> file — return only the gap list and that line, no narrative.

Wait for G and keep its gap list — **also tagged by section**.

**Build the per-section work list (orchestrator).** Read the `##` section headings in
`notes/interview-prep/{LEVEL}/en/{FILE}.md` and the topic's `coverage/{LEVEL}.md` sections. If `{SECTION}` ≠ all, the
list is just that one section. For each section, assemble its **slice**: the M questions tagged to it +
the G gaps tagged to it + the coverage items that bound its level. Coverage items are context and a
traceability ceiling, not a one-question-per-item checklist. Also run the light **en/es file-level sync check** here
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
> Do the section's TODOs, stable IDs, priority markers and format for this section only, plus the
> coverage traceability check in `full` — your own `{MODE}` block owns which of those a `correct` run
> skips, and it binds over this sentence. **Do NOT
> commit, do NOT mark anything done, do NOT touch other sections.** Leave your work in the tree. Return
> a **question-by-question trace for this section** (each question with PASS or the change you made) as
> proof you read it whole, plus the weak-answer / coverage-gap / TODO-pattern notes for this section.
> Respect the lifecycle: a `[refined]` question is frozen byte-for-byte, whether or not it also has
> `[studied]`. Report every defect in it; rewrite only unrefined questions.

Wait for A. **If A returns `BLOCKED`** — it could not complete the section (missing context, or a gate
its own prompt stops on) — that section gets no reviewer and no further work this run: note it and move
to the next section. **Skipping B is not the whole disposition.** A has been editing the tree as it
went, and the topic commit below stages the whole `en/` + `es/` pair, so a half-written section rides
into a commit whose message says the topic was audited. The general branch is
`_agent-runtime-standard.md`'s returned-blocked bullet; what follows is what this prompt binds its
baseline, its span and its freshness marker to:

- **Restore it** when **A** is the role that blocked, the section existed under that exact heading at
  `{BASELINE}`, and that topic's pair was clean there: take the section's bytes from
  `git show {BASELINE}:notes/interview-prep/{LEVEL}/en/{FILE}.md` and the `es/` twin, and write back
  **that one section's span** in both files. Never restore the *file* and never run `git checkout --`
  on the pair — the sections this run already finished are in those same two files, and that would
  delete them.
- **Leave it and declare it** in every other case: the pair was already dirty at `{BASELINE}`, A created
  the section this run, the heading was renamed before the block so no span at `{BASELINE}` matches it,
  A's report does not say what it changed, or — the case worth stating on its own — **it was B that
  blocked**. Restoring after a completed author pass would revert to *before* A and throw away finished
  work to undo a partial edit, which is the wrong trade in the one direction that loses something. The
  partial work then stays in the tree, the section is named `blocked — partial` in the topic's commit
  message body and in the final report, and the fingerprint rule under "Finish the topic" applies.

Either way the section is **never** reported as complete, and every item of its slice counts as
uncovered.

> **A component that *returns* `BLOCKED` and a role that could not be dispatched are not the same
> case, and only the first one commits.** The disposition above is for a subagent that came back and
> told you what it left behind. A role that **died** — launch failure, runtime error, or a session
> limit that killed it mid-flight — is `_agent-runtime-standard.md`'s dispatch contract instead: read
> whatever it persisted, else resume it, else re-dispatch it once, and only if it still returns nothing
> usable is it undispatchable. This prompt permits **no single-agent fallback** — the orchestrator never
> authors or audits a section itself — so at that point you **stop without partial commits**: the topic
> is not committed at all, the tree is left exactly as it stands for Victor to read, and the run closes
> out `blocked` naming the topic, the section and the dead role. Committing a labelled topic there would
> be the partial commit that contract forbids, and the killed role is the case that actually happens.

**Reviewer (B).** Launch a fresh, independent `role-appropriate` subagent, `reasoning tier: deep`,
`execution: foreground` (in `full` it rewrites weak questions, which is authoring rather than checklist
verification; in `correct` it must judge the same bar well enough to report it, which is the same
judgment and not a cheaper one):

> Read `notes/prompts/knowledge/interview-prep/_internal/_interview-prep-review-prompt.md` and execute it for
> `FILE = «topic»`, `SECTION = «this exact heading»`, `MODE = «mode»`, `DRY_RUN = true`. **Audit this
> one section only**, in full in both `en/` + `es/`: realistic, well-worded, in Victor's voice, real
> cited code where an interviewer poses the question with code, correct type ratio and priority order
> within the section. Check every point under **both** modes — `{MODE}` decides what you may fix and
> what you only report, and its own "Mode — what you may fix" section owns that partition. Rewrite
> freely only unrefined questions, and only where the mode lets you. Questions carrying `[refined]` are
> frozen byte-for-byte; **report** anything below bar there and do not fix it. Fix what falls short in
> both files otherwise. `DRY_RUN = true`
> means **fix only, do not
> commit** — the orchestrator commits once per topic after every section. Return your verdict, your
> report-only findings, and a
> **question-by-question trace for this section**. Write your findings and your verdict to
> «scratch path for this section» as you reach them, before returning — if you cannot finish, that file
> is the only thing that tells the orchestrator which bytes you already changed.

**Pass B the same `{MODE}` you passed A.** The two halves of one section run under one mode or the mode
means nothing: `correct` withholds the weak-answer rewrites from the author precisely so the section
keeps the words Victor just wrote, and a reviewer dispatched without the mode makes them anyway —
the same diff `full` would have produced, from a run he asked to only correct. It is the reviewer's
`{MODE}` that binds it, not this dispatch's wording, which is why the key is passed rather than described.

Pass B a real scratch path. `_agent-runtime-standard.md` requires every `reviewer` dispatch to carry
one and requires the orchestrator to read it when the reviewer dies — which is exactly the branch below,
and it has no input without it.

Wait for B. **Acceptance gate — verify the trace and the slice coverage (orchestrator).** Two checks
before moving on, using the section slice you assembled (it is already in your context):
- **Trace:** B's report must contain the question-by-question trace for this section. Missing or
  partial trace → that was not a full audit. **A declared `BLOCKED` return is not a missing trace** —
  it is a completed report of an incomplete job, and it goes to the disposition above rather than to
  the retry below.
- **Slice coverage:** every `often`/`sometimes` market question (M) and every gap (G) in this section's
  slice must now be covered by a question — confirmed by A's or B's trace. Uncovered items mean the
  section is not done, even if B said PASS.

If either check fails, re-dispatch B **once** for this section, listing the missing trace lines and the
uncovered slice items so it knows exactly what to close. One retry maximum; if items are still
uncovered after the retry, list them explicitly in the final summary instead of looping — never report
the section as complete. Only then start the next section.

**A section that does not close comes in two shapes, and they are disposed of differently.** *Uncovered
slice items* after the retry are finished content that merely does not cover everything yet: keep every
byte — restoring here would throw away good work — and declare the uncovered items. *A half-written
section* — A returned `BLOCKED`, or B stopped mid-fix — takes the restore-or-declare branch above,
because what sits in the tree is not content anyone finished. Both are reported as not-complete, and
both make that topic's outcome `blocked` under "Finish the topic" below.

---

### Finish the topic (orchestrator — light global scan, then commit)

After every section is done, do the light whole-file structural pass in your own context — this needs
the cross-section view, so it belongs here, not in a per-section subagent:
- **Cross-section duplicate scan** — the same question landing in two sections → keep it in the one
  where an interviewer is likeliest to ask it, remove the other.
- **en/es parity** — same sections, order, question count, stable IDs and state markers on both sides.
- **Lifecycle validity** — only unmarked, `[refined]`, or `[refined] [studied]`; never mutate a refined
  block, and never accept `[studied]` alone.
- **Global priority sanity** — no section is more than half ⭐⭐⭐.
- **Coverage fingerprint** — after all substantive and parity gates pass, write the exact current
  coverage SHA-256 value required by the standard to both language files. For Angular, write both
  the Angular and Angular Material coverage fingerprints. A stale fingerprint is expected at run
  start and must be reported; only a successful full audit may refresh it. `MODE = correct` must stop
  on a missing or mismatched fingerprint and request `MODE = full`.
  **A topic carrying half-written bytes must not ship a fingerprint that certifies it** — and *leaving*
  the digest alone does not achieve that. The digest is over the **coverage** file, so on the common
  path (a `MODE = full` re-audit of a topic whose coverage has not moved) it already matches, and
  leaving it untouched ships a bank the run just declared unfinished with a *current* certificate. So on
  the **leave-and-declare** branch — and only there — **delete the `Coverage SHA-256` line from both
  language files** (both lines, for Angular). The standard defines a missing fingerprint as stale and
  requiring a full audit, which is exactly the true statement about that bank, and it is what every
  consumer that gates already acts on: `interview-prep-route`, `interview-prep-block-open` and
  `study-block-close` all read this digest and bilingual parity, never a tracker cell. On the
  **restore** branch, do nothing to it — the blocked section is back to its pre-run bytes, so the bank
  is as certifiable as it was before.
  **An `uncovered items` section does not stale the fingerprint either.** It is finished content, this
  prompt declares it an acceptable end state ("list them explicitly instead of looping"), and the digest
  attests that the bank is current *against coverage*, not that it is exhaustive. Staling the level's
  bank over one uncovered `sometimes` question would make its CORE route unbuildable with no re-run that
  clears it.

Fix a stray duplicate or ordering issue directly (structural, not authoring). Then commit per
`{DRY_RUN}` — **one atomic commit for the whole topic** (the `en/` + `es/` pair). **Safety check
before committing:** run `git status` before the add and again before the commit — confirm only the
topic's `en/` + `es/` pair is staged, and `git restore --staged` anything else (a project code file
left staged from an earlier step has ridden along into a notes commit before). This is the only
commit; the section subagents never committed.

**A topic whose sections all *returned*, one of them not-complete, still commits — but labelled.** The
alternative is not discarding that work: it is leaving it uncommitted in the tree, which is what
`notes-audit` and `plan-audit` do. It is rejected here for a different reason — this orchestrator is
built to run unattended across twelve topics, so an uncommitted tree would be silently carried into the
next topic's `git status` safety check and swept into *its* commit instead. Committing it under its own
topic's message, labelled, is the honest version of the same bytes. (A **dead** role is the other case
entirely and does not reach this paragraph: it stops without committing, above.) Name every
not-complete section in the commit message body with its shape (`blocked — partial` / `uncovered
items`), and record that topic's outcome in `_run-tracker.md` as **`blocked`**, never `completed` —
`notes/prompts/_internal/_run-tracker.md` states that only a `completed` result satisfies a
prerequisite. The tracker carries **both** shapes. The fingerprint rule above is narrower on purpose:
only a `blocked — partial` section left in the tree drops the digest, because only that bank contains
bytes nobody finished.

**Context discipline (matters in `FILE = all`).** Once a topic is committed, condense everything you
were holding for it — the M list, the G gaps, the per-section slices and traces — down to one verdict
line per topic (author status · reviewer verdict · commit · any uncovered items) for the final report.
Carry nothing else into the next topic: the deep detail did its job at the acceptance gate, and
holding eleven topics' worth of it is exactly the context saturation this per-section design avoids.

## Finishing

**If `{DRY_RUN}` = false:** everything is committed, one atomic commit per topic. Report the commits
made and the per-topic verdict table (author status · reviewer verdict · commit). List any topic that
failed so it can be re-run (`FILE` = that topic), and, for every topic recorded `blocked`, each
not-complete section with its shape (`blocked — partial` restored / `blocked — partial` left in the
tree / `uncovered items`) — a re-run has to know which sections it is closing and which of them still
carry half-written bytes.

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
detected (recommended standard rule additions), plus unrefined/refined/studied counts and the command
to run `interview-prep-route` after every required bank for the level is current.

## Hard rules

- **One SECTION per subagent for the deep work — ALWAYS.** Authoring and
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
  analysis or the gap-hunt; `MODE = correct` deliberately omits those two read-only discovery stages
  and narrows what **both** per-section subagents may rewrite — it never drops the reviewer, and it is
  passed to it.

### Final step — pipeline self-report

After everything above is done, read `notes/prompts/_internal/_pipeline-self-report.md` and execute it for this
run — write `notes/prompts/knowledge/interview-prep/_internal/_last-run-report-interview-prep-audit.md`
commit it on its own with `_run-tracker.md`, and print the five bullets in chat.

````
