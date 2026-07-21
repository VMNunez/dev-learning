# Coverage Audit Prompt

Use in a **separate conversation**. No configuration needed — paste everything into a new chat and run.

Use this prompt to audit `notes/coverage.md` for completeness, detect missing topics, and ensure every section reflects what Spanish consultancies actually test in 2026.

> **▶ Run first:** `coverage-prompt` for every topic — this is the global convergence pass; run it once each topic already has its own `coverage.md`.

> **Run-start check (step 0):** before anything else, run the check in `notes/prompts/_pipeline-self-report.md` — read this prompt's own `_last-run-report` and, if its `Status` is `open`, surface that finding in one line before proceeding.

> **Gate — check the run tracker before anything else (step 0).** Read
> `notes/prompts/_run-tracker.md` and look at the **coverage-prompt column**: this audit only runs
> once **every topic** has a run date there. A topic's `coverage.md` merely *existing* does not count
> — the old files predate `coverage-prompt`, so only a tracker date proves the current prompt
> produced/refreshed it. If any cell in the column is empty, **stop without auditing** and report the
> pending topics ("run `coverage-prompt` on: …") so Victor knows exactly what is left.

> **Branch guard (also step 0):** run `git branch --show-current`. Study materials commit on
> whatever branch is currently active (CLAUDE.md, "Study materials follow the active branch") — a
> feature branch is the normal case; name it in the final summary. If you are on **`main`**, stop
> and ask Victor which branch to use — `main` never receives direct commits, only merges via PR.

**When to run:**
- After all individual `{topic}/coverage.md` files have been created with `coverage-prompt.md` —
  verified via the run tracker (see the gate above), never by the files' mere existence
- After completing a major project (08, 09...) when scope may have expanded
- When you suspect a topic is missing or a section is thin

**When NOT to run:**
- As an intermediate step while iterating with `coverage-prompt.md`
- Just because you ran `coverage-prompt.md` — that does not require a global audit

**Goal:** reach a stable `notes/coverage.md` in as few iterations as possible. This prompt is the convergence step, not a recurring cycle. After a successful run, `notes/coverage.md` is the definitive source of truth — re-run only if scope changes significantly.

---

## Context — read first

Read two files before anything else:
- `notes/prompts/knowledge/coverage/_coverage-standard.md` — **the standard: what a good coverage.md contains**
  (scope logic, the three item types, confusable pairs, the AI factor, item/file format). Every
  content and quality check this audit applies is defined there — this prompt only adds the *global
  convergence flow* (topic completeness, cross-topic consistency, stability) on top.
- `notes/prompts/_shared-context.md` — my profile, the **Spanish job market 2026**, and the **AI
  factor 2026**.

This audit decides what belongs in coverage based entirely on what the job requires — the target
(role, companies, deadline) comes from ROADMAP + `_shared-context`, never from a value baked into
this prompt. Projects and notes are vehicles to reach the objective — they do not define scope.

Also read `notes/prompts/_job-market-evidence.md` — real postings from the target companies. When it
has evidence, its Synthesis is a **required floor**: every recurring requirement must map to coverage
somewhere. The **adversarial interviewer pass** (a cold subagent writes, uncapped, the questions it would ask
and reports the gaps) is not optional or per-doubt here — it runs for every topic as **Analyst C** in
the per-topic loop (see the Execution model), the fastest way to prove a section is complete rather than
assume it.

(CLAUDE.md and ROADMAP.md are read in Step 1.)

---

## Execution model — read-only analysts, one concern each; the orchestrator is the only editor

Do **not** audit all twelve topic sections in a single context, and do **not** let any one subagent do
more than one thing. Two failures to avoid, both of which degrade quality:
- **Whole-file passes** — loading all of `coverage.md` and deep-checking every section in one context is
  the failure Victor caught in the notes flow: attention degrades toward the end and the last topics get
  a shallow skim. Every item in every section deserves the scrutiny the first one gets.
- **Multi-concern subagents** — a subagent asked to judge market-fit *and* internal quality *and* then
  edit files splits its attention three ways and does none of them deeply. One subagent, one concern,
  one deliverable.

So the work is split two ways at once — **by topic** and **by concern** — under a strict role divide:

**Analysts (cold `general-purpose` subagents) — read-only, one concern, return a list. Never edit any
file.** Two kinds run: **per-topic analysts (A, B, C)** — dispatched once per topic, each given exactly
one topic and one job — and **one global analyst (D)** — dispatched a single time across the whole file,
because its concern (cross-topic consistency) only exists in the space *between* topics and cannot be
judged one section at a time.

| Analyst | Scope | Concern | Mandate | Returns |
|---------|-------|---------|---------|---------|
| **A — Market-fit** | per topic | Step 2b | Does coverage meet what the market asks for this topic? | Gap list: recurring requirement (with freq) → the item it needs, in the standard's format, tagged by section. Plus over-coverage flags. |
| **B — Internal quality** | per topic | Step 3 | Does each existing item pass the standard's quality bar? | Gap list: missing item type, missing confusable-pair side, dictionary-definition rewrites, AI-exploitable gaps — each as a proposed item/edit, tagged by section. Plus an **item-by-item trace** (every current item listed PASS or change) as proof it read the whole section. |
| **C — Adversarial interviewer** | per topic | Step 4a | Would a real interviewer find a hole? | Gap list: of the questions it would ask (uncapped), the ones coverage does NOT support, each as a proposed item tagged by section. |
| **D — Cross-topic consistency** | global (once) | Step 4 | Do the sections overlap, misplace, or carry post-junior items? | Three lists: duplicates (concept → the two sections + which to keep), misplaced items (concept → from → to), and scope-demotion candidates (item → why post-junior). Reads all sections; edits nothing. |

Rules for the analyst split:
- **One topic per analyst, one concern per analyst — for A, B, C.** Never hand a per-topic subagent two
  topics or two concerns, even at higher token cost — deep, atomic passes are the standard, the same rule
  the notes audit enforces file-by-file. Three analysts × twelve topics is expected and fine.
- **Analyst D is the one deliberate exception: a single global pass, still one concern.** Cross-topic
  consistency is meaningless per-topic (a duplicate lives in two sections at once), so D reads the whole
  `notes/coverage.md` — but it is still confined to exactly one concern (consistency) and still returns
  a list only. It never judges market-fit, item quality, or interview holes; those stay with A/B/C.
- Each analyst reads only what its concern needs: A, B, C read their own topic's section in
  `notes/coverage.md`, that topic's `notes/{topic}/coverage.md` + `future-learning.md`,
  `_coverage-standard.md`, and (A and C) the evidence Synthesis. D reads all of `notes/coverage.md`, the
  `future-learning.md` of each topic, and `_coverage-standard.md`. Nothing else.
- **Analysts do not touch files.** They return findings only. If an analyst edits a file, the run is wrong.

**The orchestrator (this context) is the only editor, and does only the light global glue** that
genuinely needs a cross-topic view: Step 1 (read state + pre-audit sync), Step 2 (topic completeness — is
a whole folder missing), and the final Step 5 sync-verify + Step 6 summary/commit. It **consolidates and
applies** each topic's three analyst gap-lists (Step 5) plus Analyst D's global lists (Step 4). It no
longer performs the cross-topic scan itself — Analyst D does the reading, the orchestrator only applies —
which keeps even the whole-file work out of the editing context.

### Model policy — per analyst, to protect quality while saving tokens

Pass an explicit `model` override on every dispatch, matched to how much deep reasoning the concern
needs. The **generative "find what's missing" passes** need Opus; the **verification "check what's
present" passes** are lighter and run on Sonnet (~1/5 the cost).

| Role | `model:` | Why |
|------|----------|-----|
| **Orchestrator (this context / session)** | **Opus** | It is the only editor — it word-crafts every applied item to the standard. Run the session on Opus. |
| A — Market-fit | `sonnet` | Web-search + map evidence→items; the Opus orchestrator judges each proposed item before applying. |
| B — Internal quality | `sonnet` | Runs a fixed checklist over existing items + an item-by-item trace — verification, not generation. |
| **C — Adversarial interviewer** | **`opus`** | Writing the hardest questions (uncapped) and spotting the hole coverage misses is the deepest reasoning in the audit. |
| D — Cross-topic consistency | `sonnet` | Pattern-matches duplicates / misplaced / post-junior items across sections — verification. |

Never drop C below Opus (it is the pass that proves a section complete) and never drop the orchestrator
below Opus (it writes the items). If Victor asks for maximum saving, A may also stay Sonnet as-is; the
one non-negotiable Opus roles are the session and Analyst C.

**Per-topic loop (sequential, one topic fully done before the next):**
1. Dispatch Analyst A (`model: sonnet`), then B (`model: sonnet`), then C (`model: opus`) for the topic
   (`run_in_background: false`). Dispatch each one by
   telling it to read its mandate section in this prompt (A → Step 2b, B → Step 3, C → Step 4a) with
   {TOPIC} filled in, plus only the files its concern needs (listed in the analyst-split rules above).
   Collect their three lists. **Acceptance check per analyst:** every report must carry the
   "N lines, read to EOF" line for each file it read whole (see the verifiable-reads rule in
   Step 1); B must return its item-by-item trace; A must map each recurring evidence requirement to
   the item that covers it (or a gap); C must list every question it generated (uncapped — see its
   mandate), each marked SUPPORTED or GAP. If a report is missing its proof or is
   unusable, re-dispatch that analyst **once**, naming what was missing; if it fails again, flag the
   topic as partially analysed in the summary and continue — never treat a proofless report as a full
   pass. **Bounded reports only:** each analyst returns its list(s) + proof lines and nothing else —
   no narrative, no restating of items it found fine; if a report comes back wrapped in prose, keep
   the lists + proof and discard the rest.
1a. **Dispatch every analyst clean — never hand one your own prior.** State the topic and the mandate,
   and stop there. Do not tell an analyst that a file is "the thinnest", "freshly regenerated", "in
   good shape", or "probably under-covered": that is your hypothesis, and the analyst's job is to form
   its own. The damage is asymmetric — a "probably thin" prior invites invented gaps, a "probably fine"
   prior suppresses real ones — and it lands hardest on **Analyst C**, the one role running on Opus
   precisely because its independent judgement is what proves a section complete. This is not
   hypothetical: on the 2026-07-19 run the orchestrator told C that an 85-line Security file was the
   thinnest in the system and to assume heavy under-coverage; C ran the pass anyway and returned
   "the premise is wrong", with 71 of 98 questions supported. It was right, and the prior had bought
   nothing. Two topics that same run were told their files had been regenerated that day; one still
   returned 43 gaps. If you genuinely need a scope boundary (which sibling topic owns what), state it
   as a **routing rule**, never as an expectation about what the analyst will find.
1b. Read `notes/prompts/knowledge/coverage/_cross-topic-inbox.md` and take the entries filed under
   `## {TOPIC}` — gaps that another topic's run found and routed to this one. Fold them into the
   consolidation below as **proposed** items (judged against the standard like any analyst gap, never
   pre-approved), then **clear every entry you looked at**, added or discarded, and report both counts
   in the summary.
   **Check each entry against the topic file before adding it — a routed gap is frequently already
   covered.** The routing run only saw its *own* topic, so it flagged what looked absent from where it
   stood; it never read the receiving file. Grep the receiving `coverage.md` for the concept and read
   the surrounding items before writing anything. On the 2026-07-19 run this check killed 8 of 17
   entries: all three Security items routed from the General run were already in the CORS section
   almost verbatim (the origin definition, the preflight trigger, "CORS is not authorisation"), and
   three Spring Boot items were already carried by existing bullets. Adding them would have created
   duplicates for Analyst D to find and the orchestrator to remove — the cost of skipping a grep is
   paid twice. Report discarded-as-already-covered separately from discarded-as-out-of-scope. This audit walks every topic, so it is the pipeline's sweep of the inbox: an entry
   left uncleared here will be re-litigated on the next run, and one left unread is the silent loss the
   file exists to prevent. Note that Analyst D cannot cover for this — D hunts duplicates, misplaced
   items and demotion candidates in `notes/coverage.md`, so a concept absent from every section is
   invisible to it, which is exactly how four Angular-owned items went missing on 2026-07-18.
2. Consolidate: merge the three lists, drop duplicates, discard any gap that is out of junior scope
   (record those in the summary as "analyst-suggested, left out — reason").
2b. **Before creating a *new section*, check which topic already owns the concept.** Analysts are
   confined to one topic and will therefore propose, in perfectly good faith, whole areas that another
   topic already covers — C for Angular will hand you a browser-security section, C for Architecture a
   transactions section, C for Java a concurrency section. Adding a gap to an existing section is
   low-risk; opening a new one named after another topic is the reliable way to manufacture
   duplicates. So for each proposed new section, grep the sibling topic's `coverage.md` first and pick
   one of three outcomes: **keep it whole** (the sibling genuinely does not cover it), **keep the
   framework-specific half and drop the rest** (Angular keeps `DomSanitizer` and `withXsrfConfiguration`
   because they are Angular APIs; Security keeps token storage, `[innerHTML]`, and "role checks are
   UX"), or **drop it and leave a one-line pointer** to the owning topic so a reader of this file alone
   is not misled into thinking the concept is out of scope. On the 2026-07-19 run this check was not
   performed and Analyst D later found 19 duplicates, the majority created by that run's own edits —
   caught, but only after the writing was done twice.
3. Apply the surviving gaps to `notes/{topic}/coverage.md`, and update `future-learning.md` if anything
   was promoted or demoted. **Do not hand-edit `notes/coverage.md` during the loop** — it is rebuilt
   from the topic files in Step 5, which is what makes the mirror exact.
4. Move to the next topic.

Doing one topic end-to-end keeps the orchestrator's editing context small (one section at a time) and
each commit-ready, without any analyst ever holding more than a single concern.

**Global cross-topic pass (once, after the per-topic loop):** dispatch Analyst D a single time
(`model: sonnet`, `run_in_background: false`) over the finished `notes/coverage.md`, collect its three lists (duplicates,
misplaced items, scope-demotion candidates), and apply the surviving ones in Step 4. Run it **after** all
per-topic loops so it judges the sections in their post-edit state — otherwise it would flag overlaps the
per-topic passes are about to change anyway. Because D reads the whole file, running it last also means
the orchestrator never has to load every section into its own editing context just to find duplicates.

---

## What notes/coverage.md is

`notes/coverage.md` is the combined file that mirrors all topic `coverage.md` files in one place. It is the **single source of truth** for everything Victor must learn across all topics.

Structure:
- One `## {TOPIC}` section per topic, in study-priority order: Angular → Angular Material → Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git → General
- Each section is an exact copy of `notes/{topic}/coverage.md` with heading levels shifted by one (`#` → `##`, `##` → `###`)

**Sync rule — always bidirectional:**
Any change to `notes/coverage.md` must immediately be reflected in the corresponding `notes/{topic}/coverage.md`, and vice versa. The two files must never drift apart. After every edit, re-read both sides and confirm they match exactly — only heading levels should differ.

---

## Step 1 — Read the system state

> **Verifiable reads (CLAUDE.md non-negotiable) — applies to every whole-file read in this audit,
> by the orchestrator and by every analyst.** The Read tool truncates at 2000 lines **silently**, and
> `notes/coverage.md` passed that limit long ago — it stood at 3914 lines after the 2026-07-19 run and
> grows with every audit, so a single Read call now returns barely half of it. A truncated read here
> means the tail topics (SQL, Git, General) silently vanish from Analyst D's global pass. Before
> reading any file end-to-end, run `wc -l`; if it is near or over 2000 lines, read it in passes with
> `offset` to the real end — for this file that is several passes, not one extra. Every
> analyst report and the final summary must state **"N lines, read to EOF"** for each file read
> whole — a report without it fails its acceptance check.

Read these files before making any decision:

1. `notes/coverage.md` — the primary input
2. `CLAUDE.md` — learning objectives and notes folder structure (profile and market are in
   `notes/prompts/_shared-context.md`, read above)
3. `ROADMAP.md` — current phase, what is in progress, what is post-junior scope

Then list all existing subdirectories under `notes/` (excluding `interview-prep/`, `prompts/`, and `ai-development/` — post-employment material with no coverage.md; list any other folder outside the 12-topic order as an anomaly instead of looping over it). These are the current topic folders.

**Pre-audit sync check:**
For each topic folder found, read `notes/{topic}/coverage.md` (if it exists) and compare it to its corresponding section in `notes/coverage.md`. If they differ, `notes/{topic}/coverage.md` is the authoritative source — correct `notes/coverage.md` to match, applying the heading level transformation (topic `#` → `##`, topic `##` → `###`). Note any corrections in the final summary under "Sync corrections (pre-audit)".

---

## Step 2 — Audit topic completeness

Compare the current topic folders against what Victor's objective requires.

**Criteria for a topic to deserve its own folder:**
- Has enough distinct concepts for 5+ coverage items that cannot fit naturally in an existing topic
- Has its own category of interview questions at Spanish consultancies (interviewers ask about it as a distinct area, not just as a subtopic of something else)
- Is distinct enough from existing topics that merging would confuse the learning

**Questions to answer:**

Is **Testing** missing as a dedicated topic? At project 07 onwards, JUnit 5 + Mockito (backend) and Jasmine + TestBed (frontend) are permanent requirements. Apply the three criteria above. Testing has its own distinct interview questions at Spanish consultancies ("how do you write a unit test?", "what is Mockito?", "how does TestBed work?"), has well over 5 distinct coverage items (JUnit 5 structure, Mockito mocking, meaningful assertions, TestBed setup, integration vs unit test), and is clearly separate from `notes/general/`. It almost certainly meets all three criteria — confirm and, if so, **flag it** under "New topic detected → run coverage-prompt" (target position: after the Security section in `notes/coverage.md`). Detection only — creating the folder and authoring its coverage belong to `coverage-prompt.md`.

Is **Docker** missing as a topic? Victor uses Docker Compose in project 07. Decide: is there enough junior-level content for a dedicated `notes/docker/` folder (5+ distinct coverage items), or do the relevant concepts belong in `notes/architecture/` or `notes/general/`? If it qualifies, **flag it** the same way (target position: after the General section, last in the order) — never create it here.

Are there any other topics that a Spanish consultancy would interview a junior Angular + Spring Boot developer about that are not represented in the current folder structure?

**If a topic is identified as missing and meets the criteria for its own folder — detect and delegate, do not author here.**
Authoring a topic's coverage from scratch is the single job of `coverage-prompt.md`; this audit must not
do it too, or it becomes auditor and author in one context. So this step only **detects and flags** —
it never writes a new topic's `coverage.md`:
1. Do **not** create `notes/{topic}/coverage.md`, `future-learning.md`, or the section in `notes/coverage.md`.
   List the detected topic in the final summary under "New topic detected → run coverage-prompt", with the
   one-line rationale (which of the three criteria it meets) and its target position in the study-priority order.
2. The actual authoring is a **separate run of `coverage-prompt.md`** with `TOPIC` = the new topic — it
   creates coverage from scratch and is the single-responsibility prompt for that. After it runs, this
   audit's normal per-topic loop (A/B/C) will pick the topic up like any other.
3. **Register the new topic across the machinery — otherwise coverage names it but nothing downstream builds it.** A coverage file with no home in the rest of the system produces notes and Q&A for a topic no other prompt knows exists. Flag each of these in the final summary under "New-topic registration needed" (Victor applies them, since they touch prompts this audit does not own):
   - **CLAUDE.md** — add the topic to the `notes/` subfolders list (with its `next file:` counter) and, if it is study-relevant, to the 13:30 notes study order.
   - **notes-audit / notes-plan** — add the topic to the `TOPIC` enum in both (the batch order lives in notes-audit only; notes-plan never runs batched).
   - **interview-prep-audit / interview-prep-write** — if the topic gets its own Q&A file, add it to the `FILE` enum and the batch order; if it folds into an existing file (like Angular Material into `angular.md`), note that routing instead.
   - **notes-and-interview-prep** — add it to the `TOPIC`/`FILE`/`NOTES_PATH` config and batch order.
   - **simulator** — add its interview-prep file to the full-mode source list if it should appear in a mock interview.
   Do NOT edit those prompt files from this audit, and do NOT author the topic's coverage here — only list the detected topic and its registration edits for Victor. This keeps the audit's job to detection and its own commit atomic.

**If a concept belongs under an existing topic instead:**
Add it to the correct section in that topic's `coverage.md`; the Step 5 rebuild carries it into the mirror.

---

## Step 2b — Analyst A's mandate: market-fit (deep analysis first, evidence as the sharpening floor)

This is the single concern of **Analyst A**, run once per topic as a read-only cold subagent. It comes
**before** the finer per-section audit: coverage must first meet what the market actually asks, then
expand — the priority order defined in `_coverage-standard.md` ("cover the market first, then expand").
This is the step that operationalises the "required floor" principle instead of leaving it to memory.

Analyst A **returns a gap list** and edits nothing — the orchestrator applies the surviving gaps in the
per-topic loop. "Add", "sharpen", "flag" below mean *propose in the returned list*, not write to a file.

**Lead with the deep analysis — it is the primary input, not the evidence.** Per `_coverage-standard.md`
("Two sources"), the backbone is a full reasoning of what a junior for the target role and companies must
know, backed by a live web search of current Spanish junior postings when possible. Run that analysis for
every section (Step 3's checks plus the completeness test) as the **primary floor**, regardless of how many
postings are on file. The evidence below then **complements and sharpens** it — adding hard frequency and
the market's exact wording — and overrides it only on a concrete point where the two actually conflict.

Then read the **Synthesis** in `notes/prompts/_job-market-evidence.md`. For **each recurring requirement**
(with its frequency, e.g. `Docker ~3/8`, `Java ~8/8`):

1. **Gap → add.** Find the coverage item(s) it maps to. If a recurring requirement has no item — or only
   a thin/vague one — add or sharpen the item in the right topic section and sync to
   `notes/{topic}/coverage.md`. Priority scales with frequency: a `~8/8` requirement missing from
   coverage is a serious defect; a `~3/8` one is still required but lower urgency.
2. **Over-coverage → flag, don't cut yet.** Note any coverage item that no posting supports **and** is
   not an interview fundamental the postings under-list. Do not delete it here for that reason alone
   (the standard's "raises the floor, does not lower the ceiling" rule) — list it as a demotion
   candidate for the Step 4 scope check to judge.
3. **Signals to watch → keep out.** A requirement in the evidence's "Signals to watch" list (senior-ish:
   Kafka, Spring Cloud, Spring Batch, NgRx…) is **not** a junior floor — do not force it into coverage.

Remember the evidence is a **small, partial sample**, so it only raises the floor set by the analysis,
never lowers it: a requirement's *absence* from the file is not proof a junior does not need it. In the
summary, note whether each market-fit change came from the deep analysis, from real evidence, or from both.

---

## Step 3 — Analyst B's mandate: internal quality of each item

This is the single concern of **Analyst B**, run once per topic as a read-only cold subagent, on that
one topic's section. Analyst B **returns a gap list plus the item-by-item trace** and edits nothing —
the orchestrator applies the surviving gaps in the per-topic loop.

Apply the **content and quality checks defined in `_coverage-standard.md`** — do not restate them, run them:
- **Three item types** present (conceptual / decision / pressure) — add the missing type.
- **Confusable pairs** — both sides present as separate items.
- **Item quality** — each item is interview-anchored, not a dictionary definition; fix any that read
  like one.
- **One concept per item** — split any grouped bullet.

Plus one audit-specific check the standard doesn't cover, because it only makes sense across a whole
finished coverage file:

**AI-exploitable gaps** — are there concepts AI generates commonly but a junior would struggle to
explain? These are high-priority to have in coverage. Focus on: the "why" behind decisions (why JWT,
why DTOs, why soft delete, why coordinator pattern); layer-placement rules (controller vs service vs
repository); transaction behaviour and edge cases; security implications of common patterns;
annotation-placement rules and what breaks when they are wrong.

---

## Step 4a — Analyst C's mandate: adversarial interviewer

This is the single concern of **Analyst C**, run once per topic as a read-only cold subagent. It is the
audit's version of `coverage-prompt.md`'s adversarial pass — same idea, applied to an already-existing
section. Analyst C **returns a gap list** and edits nothing.

You are a senior technical interviewer at one of the target consultancies (read `ROADMAP.md` and
`notes/prompts/_shared-context.md` for the exact role/companies, and
`notes/prompts/_job-market-evidence.md` for what they hire for). You are screening a candidate
at the target level and the topic is {TOPIC}. Read that topic's `notes/{topic}/coverage.md` (and its
section in `notes/coverage.md` if the topic file is missing) plus
`notes/prompts/knowledge/coverage/_coverage-standard.md`.

Write the questions you would actually ask to decide whether this candidate really knows {TOPIC} —
**as many as you genuinely would use; do not stop at a fixed number, be exhaustive** — "uncapped"
governs the *number of questions*, not the size of your report: keep each question to a terse one-liner
and put the substance in the gap items, because a report that overruns the tool's inline limit has to
be recovered from a persisted file before the orchestrator can use it (this happened on 2026-07-19 at
49.8 KB) — (a capped
interviewer finds only the gaps that fit inside its question budget — a real `coverage-prompt` run
proved it: one capped interviewer returned 13 gaps and looked convergent while further uncapped
angles found 80+ more). Mix conceptual, decision ("why X over Y"), and pressure/gotcha questions,
and lean on the recurring requirements in the job-market evidence. Then, for each question, check
whether the current coverage gives the candidate what they'd need to answer it. Return only the **gaps**: the questions the
coverage does NOT support, each as a proposed coverage item in the standard's format
(`concept — interview-anchored sentence`), tagged with its section. Do not rewrite existing items, do
not edit any file. Be adversarial — assume the coverage is incomplete until your 12 questions prove
otherwise.

---

## Step 4 — Analyst D's mandate: cross-topic consistency

This is the single concern of **Analyst D**, run **once** as a read-only cold subagent over the whole of
`notes/coverage.md` after the per-topic loop. Cross-topic consistency cannot be judged one section at a
time — a duplicate lives in two sections at once — so D is the one analyst with a global view. It still
holds exactly one concern and **returns three lists, editing nothing**; the orchestrator applies the
survivors in Step 5.

**In Claude Code:** launch one `general-purpose` subagent, `model: sonnet`, `run_in_background: false`:

> You are auditing `notes/coverage.md` for cross-topic consistency only — not market-fit, not item
> quality, not interview holes (other analysts own those). Read the whole `notes/coverage.md`, the
> `future-learning.md` of each topic folder, and
> `notes/prompts/knowledge/coverage/_coverage-standard.md`. The section order is Angular → Angular
> Material → Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git →
> General. Return exactly three lists, nothing else:
> 1. **Duplicates** — the same concept in two sections (e.g. "service layer" in both Architecture and
>    Spring Boot). For each: the concept, the two sections, and which section should keep it (the one an
>    interviewer is most likely to ask it in) — the other is removed.
> 2. **Misplaced items** — a concept sitting in the wrong topic (a TypeScript-specific item under
>    JavaScript, a REST concept under Spring Boot that belongs in Architecture). For each:
>    `concept — from → to`.
> 3. **Scope-demotion candidates** — items clearly post-junior for the target role (mid-level
>    architecture, senior performance work). For each: `item — one-line why it is post-junior`. Read
>    ROADMAP.md and `notes/prompts/_shared-context.md` for the target level.
> Do not edit any file. Before reading `notes/coverage.md`, run `wc -l` on it — it is **far past** the
> Read tool's silent 2000-line truncation limit (3914 lines after the 2026-07-19 run), so one Read call
> returns roughly half the file and the tail topics would be invisible to you. Read it in several
> `offset` passes to the real last line and state "N lines, read to EOF" in your report; a report
> covering only the first 2000 lines is a failed pass. Return only the three lists plus that line.

The orchestrator then applies the surviving findings in Step 5, editing the **topic files** (the mirror
is regenerated afterwards): remove the losing side of each duplicate — leaving a one-line pointer to the
owning topic where a reader would otherwise think the concept is out of scope — move each misplaced item
to the correct topic file, and demote each confirmed scope-demotion item to
`notes/{topic}/future-learning.md`. Note every overlap, move, and demotion in the final summary, and say
which duplicates this run created itself rather than inherited: that number is the measure of whether
the Step 2b ownership check is working.

**Future-learning promotion check (orchestrator, alongside applying D):**
For each `notes/{topic}/future-learning.md`: are any concepts listed there now in scope for the job target read from ROADMAP + `_shared-context` (role, deadline)? Apply the IN/OUT + AI-factor criteria from `_coverage-standard.md`. If yes: add the concept to the correct section in `notes/{topic}/coverage.md` (the mirror picks it up on the Step 5 rebuild) and remove it from `future-learning.md`. Watch for the reverse case too: an item you promote here, or add anywhere in the loop, may already be described in that topic's `future-learning.md` as deliberately deferred — when you promote it, delete the deferral rather than leaving the two files contradicting each other, and when you demote one, check the file does not already carry it. Also: if any entry in `future-learning.md` is no longer relevant at all — wrong topic, outdated, or not needed in any future phase — delete it entirely. Do not move it anywhere; simply remove it.

---

## Step 5 — Orchestrator applies the consolidated changes

The orchestrator (this context) is the only editor. Apply every change directly to the files: the
orchestrator's own findings from Step 2 (topic completeness), Analyst D's three cross-topic lists from
Step 4, plus each topic's consolidated Analyst A/B/C gap-list from the per-topic loop (Steps 2b + 3 + 4a).
Analysts never wrote anything — everything they surfaced lands here.

**Files to edit by hand — the topic files only:**
- Each `notes/{topic}/coverage.md` that was changed
- Each `notes/{topic}/future-learning.md` that changed — received demoted items, had promoted items removed, or had entries deleted entirely

**Do NOT:**
- Hand-edit `notes/coverage.md` — it is generated, not authored (see below)
- Reword bullets that are already correct — only touch what is new, wrong, restructured, or moved
- Create note files (the numbered `01-...` files)
- Remove items without a documented reason in the summary

**Rebuild `notes/coverage.md` from the topic files — do not verify the mirror, generate it.**

The topic files are the source; `notes/coverage.md` is their concatenation with heading levels shifted
down one. So regenerate it rather than editing it in parallel and hoping the two stayed aligned:

```
{ header block; for each topic in study-priority order: drop the topic file's `# ` title line,
  shift every remaining heading down one level (`#` → `##`), re-insert the title as `## {Topic}`,
  and append a `---` separator } > notes/coverage.md
```

This replaces the old instruction to re-read every section side by side against its topic file. That
check could not survive the file's own growth: at 3900+ lines it exceeds the Read tool's silent
2000-line truncation twice over, so a whole-file comparison is either infeasible or — worse — asserted
without having been performed. Generating the mirror makes it exact by construction and costs one
command. **Then prove it**: for each of the 12 topics, split the rebuilt file at its `## ` heading,
shift the headings back up, and diff against the topic file, ignoring blank lines and the `---`
separators. Report the per-topic result. A run may only claim "Sync verified" in Step 6 on the back of
that diff actually having run — never on the strength of having rebuilt the file.

---

## Step 6 — Declare stability and output summary

Print the summary:

| Change | Detail |
|--------|--------|
| Sync corrections (pre-audit) | [topic — what differed] |
| New topic detected → run coverage-prompt | [topic — criteria met + target position, or "none"] |
| New-topic registration needed | [per new folder: the CLAUDE.md / notes-audit / interview-prep / simulator edits Victor must apply, or "none"] |
| Market-fit gaps filled | [topic — recurring requirement (freq) that had no/thin item] |
| Over-coverage demotion candidates | [item — no posting supports it, not a fundamental] |
| Sections with gaps filled | [topic — what was added] |
| Items split (grouped → atomic) | [list or "none"] |
| Items moved between topics | [concept — from → to] |
| Items fixed (definition → interview-anchored) | [list or "none"] |
| Items promoted from future-learning | [topic — concept] |
| Items demoted to future-learning | [item — reason] |
| Items removed from future-learning | [item — reason it was deleted entirely] |
| Inbox entries consumed | [N read → N added / N discarded out-of-scope / N discarded already-covered] |
| Duplicates removed | [N total, of which N were created by this run] |
| Sync verified | [yes — the per-topic diff ran and all 12 matched, or name the ones that did not] |

Then answer explicitly:

**Is notes/coverage.md now stable?**

Stable means: every topic for Victor's objective is represented, every section has the three types (conceptual / decision / pressure), every confusable pair has both sides, no item is a dictionary definition, and every recurring requirement in the evidence Synthesis maps to at least one item.

- If **stable**: "notes/coverage.md is stable. Re-run this audit only if: a new topic folder is added, a new project introduces scope not yet covered, or the job objective changes significantly."
- If **not stable**: list what remains and why it could not be fixed in this pass (e.g. a section needed more than 5 new items and you split the work). Be specific about what the next run must address.

---

## Execution

Apply all changes directly to the files. Do not describe what you would write — write it.

**Commit the changes yourself.** Coverage files live under `notes/`, so this is one of the cases where
Claude commits directly (CLAUDE.md "Non-negotiables" exception for `notes/` and `notes/prompts/`) — do
not hand the commands to Victor. No `Co-Authored-By` lines.

**Mandatory safety check before committing — never skip it:**
1. Run `git status` and read the full list of changed/staged files.
2. Stage only the files this audit touched, by exact path — `notes/coverage.md`, each changed
   `notes/{topic}/coverage.md` and `notes/{topic}/future-learning.md`. Never `git add .`.
3. Run `git status` again and confirm **only** those `notes/` paths are staged. If any project code
   file, or any file this audit did not touch, is staged, `git restore --staged` it before continuing.
4. Only once the staged list is clean, commit:

```
git commit -m "docs: global coverage audit — <one line summary of main changes>"
```

**One commit is the default; batch commits are allowed and are the right call on a full 12-topic run.**
This audit is a long session — 12 topics × 3 analysts, plus Analyst D — and a single commit at the very
end means everything is unprotected until then. On 2026-07-19 the session limit was hit mid-run and
four completed topics survived only because they had already been committed. So: commit after every
few topics (`docs: coverage audit (1/2) — <topics>`), keeping each batch a coherent unit, and run the
full safety check above **every time** — the check is per commit, never once per session. The per-topic
loop already calls each topic "commit-ready"; this makes that explicit instead of leaving it in tension
with a single-commit rule. The rebuild and the Analyst D pass land in the final commit, since both
operate across all topics.

**Report commit hashes by reading them from `git log`, never from memory.** State them in the final
summary so Victor can confirm the work landed. A hash you did not read is a hash you invented: on
2026-07-19 the summary carried a fabricated hash for the self-report commit alongside two real ones,
which is worse than omitting it, because a wrong hash looks verified.

### Final step — pipeline self-report

After everything above is done, read `notes/prompts/_pipeline-self-report.md` and execute it for this
run — write the report file in this orchestrator's folder, commit it **together with
`_run-tracker.md`** (verify with `git show --stat HEAD` that the commit lists two files), and **print
the five bullets in chat**. That last half is easy to drop after a long run: on 2026-07-19 the report
was written and committed correctly but never printed, so Victor had to ask whether the step had
happened at all. Writing the file is not the deliverable — the bullets in front of him are.
