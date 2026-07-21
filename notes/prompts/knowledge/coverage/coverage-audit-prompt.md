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

The four mandates themselves live in `notes/prompts/knowledge/coverage/_coverage-analyst-mandates.md`
(sections A, B, C, D — the "Step" labels above are their section names). They were extracted so this
orchestrator holds only the flow; each dispatched analyst reads its own section there.

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
   (`run_in_background: false`). Dispatch each one by telling it to read its section (A / B / C) in
   `notes/prompts/knowledge/coverage/_coverage-analyst-mandates.md` with {TOPIC} filled in, plus only
   the files its concern needs (listed in the analyst-split rules above).
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
   and stop. Do not tell an analyst a file is "the thinnest", "freshly regenerated", or "probably
   under-covered": the damage is asymmetric — a "thin" prior invites invented gaps, a "fine" prior
   suppresses real ones — and it lands hardest on Analyst C, whose independent judgement is the whole
   reason it runs on Opus (told once that an 85-line file was thinnest, C overturned the prior and
   returned 71/98 supported). A genuine scope boundary — which sibling topic owns what — is a **routing
   rule**, never an expectation about what the analyst will find.
1b. Read `notes/prompts/knowledge/coverage/_cross-topic-inbox.md`, take the entries under `## {TOPIC}`
   — gaps another topic's run routed here — and fold them into the consolidation as **proposed** items
   (judged like any analyst gap, never pre-approved). Then **clear every entry you looked at**, added or
   discarded, and report both counts: an entry left uncleared is re-litigated next run, one left unread
   is the silent loss the file exists to prevent, and Analyst D cannot catch it (a concept absent from
   every section is invisible to a duplicate-hunter). **Grep the receiving `coverage.md` before adding
   any entry** — the routing run never read this file, so a routed gap is frequently already covered
   (8 of 17 were, on 2026-07-19). Report discarded-as-already-covered separately from
   discarded-as-out-of-scope.
2. Consolidate: merge the three lists, drop duplicates, discard any gap that is out of junior scope
   (record those in the summary as "analyst-suggested, left out — reason").
2b. **Before creating a *new section*, check which topic already owns the concept.** An analyst confined
   to one topic will, in good faith, propose whole areas another topic covers — C for Angular hands you a
   browser-security section, C for Java a concurrency section. Adding a gap to an existing section is
   low-risk; opening a new one named after another topic reliably manufactures duplicates (19 of them on
   2026-07-19, most created by that run's own edits). So grep the sibling topic's `coverage.md` first and
   pick one: **keep it whole** (the sibling does not cover it), **keep the framework-specific half and
   drop the rest** (Angular keeps `DomSanitizer`; Security keeps token storage and "role checks are UX"),
   or **drop it and leave a one-line pointer** to the owning topic.
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

## Analyst mandates — A (market-fit), B (internal quality), C (adversarial interviewer)

The three per-topic mandates live in `notes/prompts/knowledge/coverage/_coverage-analyst-mandates.md`,
one section each — moved out of this prompt so the orchestrator's context holds the flow, not the
briefs. The per-topic loop above dispatches each analyst to read its own section there:

- **Analyst A — market-fit** (mandate: Step 2b): does coverage meet what the market asks for this topic?
- **Analyst B — internal quality** (mandate: Step 3): does each existing item pass the standard's bar?
- **Analyst C — adversarial interviewer** (mandate: Step 4a): would a real interviewer find a hole the
  coverage cannot answer? Runs on `opus`.

---

## Step 4 — Apply Analyst D's cross-topic findings

Analyst D's mandate is in `_coverage-analyst-mandates.md` ("Analyst D"). Dispatch it once, after the
per-topic loop, `model: sonnet`, over the finished `notes/coverage.md`; collect its three lists
(duplicates, misplaced items, scope-demotion candidates) and apply the survivors here. Run it last so
it judges the sections in their post-edit state, and because reading the whole file is its job, not the
orchestrator's.

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

**Batch commits are allowed and are the right call on a full 12-topic run.** A single commit at the very
end leaves everything unprotected until then, and a mid-run session limit can lose it (it did on
2026-07-19). Commit after every few topics (`docs: coverage audit (1/2) — <topics>`), each batch a
coherent unit, and run the full safety check above **every time** — it is per commit, never per session.
The rebuild and the Analyst D pass land in the final commit, since both operate across all topics.

**Report commit hashes by reading them from `git log`, never from memory** — a hash you did not read is
a hash you invented, and a wrong one looks verified (a fabricated self-report hash shipped this way on
2026-07-19).

### Final step — pipeline self-report

After everything above is done, read `notes/prompts/_pipeline-self-report.md` and execute it for this
run — write the report file in this orchestrator's folder, commit it **together with `_run-tracker.md`**
(verify with `git show --stat HEAD` that the commit lists two files), and **print the five bullets in
chat**. Printing is the deliverable, not writing the file — the print half is easy to drop after a long
run (it was on 2026-07-19), and then the report might as well not exist.
