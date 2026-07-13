# Coverage Prompt

Use in a **separate conversation**. Fill in the two values in the configuration block, then paste everything into a new chat.

Use this prompt when you want to create a new `coverage.md` for a notes folder, or update an existing one when new concepts have been learned, the project scope has changed, or topics need to be promoted from `future-learning.md`.

> **▶ Run first:** nothing — it can create coverage from scratch. Optional: `evidence-intake` to refresh the market evidence its Step 2 subagent reads.

---

**How to use:**

1. Fill in `TOPIC` — the subject to cover (e.g. Angular, SQL, Java, Spring Boot)
2. Fill in `NOTES_PATH` — the notes folder to review (e.g. `notes/angular/`, `notes/sql/`)
3. Paste the entire prompt into a new chat

---

```
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security | all]
NOTES_PATH = [notes/angular/ | notes/angular-material/ | notes/css/ | notes/javascript/ | notes/typescript/ | notes/sql/ | notes/java/ | notes/spring-boot/ | notes/architecture/ | notes/git/ | notes/general/ | notes/security/]

## TOPIC = all runs this prompt on every topic in turn — see notes/prompts/_batch-mode.md.
## Batch order (NOTES_PATH derived per topic): Angular, Angular Material, Spring Boot
## (also reads notes/java/), Java, Architecture, Security, TypeScript, JavaScript, CSS, SQL,
## Git, General.

Notes on specific topics:
- General: not yet migrated to en/-es/ — its numbered files sit in the topic root
  (notes/general/), not in an en/ subfolder; read them from there in Step 1.3.
- Spring Boot: set NOTES_PATH = notes/spring-boot/ — coverage.md is written there.
  Additionally read notes/java/en/ when reading existing notes (Step 1.3), because Spring Boot
  coverage must include Java language concepts that appear in Spring Boot code.
  Also read notes/spring-boot/layer-reference.md — it defines what belongs in each layer
  (controller, service, repository) and is directly relevant for coverage decisions about
  where annotations and logic should live.
  Testing (JUnit 5, Mockito — what each does, what to mock, what `@ExtendWith` enables,
  the difference between a unit test and an integration test) is always in scope for
  Spring Boot — interviewers use it as a hard filter because almost no junior candidate has it.
- Angular: testing concepts (Jasmine, TestBed, what `HttpClientTestingModule` does, the
  difference between a spy and a mock, how to test a service vs a component) are always
  in scope — same reason as Spring Boot: rare at junior level, strong differentiator.
- Java: focus on language concepts needed to write and understand Spring Boot code. Skip anything
  that does not appear in a Spring Boot context (GUI, threads, streams, advanced collections).
- SQL: database is PostgreSQL. Include PostgreSQL-specific syntax and behaviour where it differs
  from standard SQL.
- General: covers HTTP, JSON, env vars, testing concepts, SOLID, code principles, Docker basics
  (`docker-compose up`, what a container is, environment variables in Compose, why containerisation
  matters in a consultancy project). Docker is moving from "nice to have" to baseline expectation
  at Spanish consultancies in 2026 — include it.
- Angular Material: focus on components used in Victor's projects and likely to appear in a
  technical test or interview (MatTable, MatDialog, MatFormField, MatButton, etc.). Scope =
  understanding each component's purpose, key inputs/outputs, and typical usage patterns.
  Theming (how to customise colours in v19+) is in scope. Internal implementation and
  rarely-used components are not. The boundary with notes/angular/ is: if the concept is
  about Angular itself (directives, signals, routing), it belongs in angular/; if it is
  specific to a Material component's API or behaviour, it belongs here.
- Security: covers AuthN/AuthZ, hashing, JWT design, CORS, XSS, CSRF, SQL injection.
- Architecture: in scope — REST principles, layered architecture, MVC, coordinator pattern,
  smart/dumb components, service layer, repository pattern. Out of scope (future-learning) —
  microservices, event-driven architecture, DDD, CQRS, distributed systems.

Use TOPIC and NOTES_PATH wherever the prompt refers to {TOPIC} or {NOTES_PATH}.

---

I want you to create or update the coverage.md file for {TOPIC}.

Before starting, read:
- `notes/prompts/knowledge/coverage/_coverage-standard.md` — **the standard: what a good coverage.md contains**
  (what belongs in scope, the three item types, confusable pairs, the AI factor, item/file format).
  Everything about *content quality* lives there — this prompt only adds the *per-topic flow* on top.
- `CLAUDE.md` — teaching rules and the notes/ subfolder structure.
- `notes/prompts/_shared-context.md` — my profile, the **Spanish job market 2026**, and the **AI
  factor 2026**.
- `ROADMAP.md` — the current phase, deadline, and what is post-junior scope. This is the source of the
  job target. Do not use any hardcoded role/company/date — read the target from ROADMAP and
  `_shared-context` and defer to them (see "The job target is the source" in the standard).
- `notes/prompts/_job-market-evidence.md` — real junior postings from the target companies, distilled
  into recurring requirements. Per the standard's "Two sources", the deep market analysis in Step 2 is
  **primary**; this file **complements** it: every recurring skill that touches {TOPIC} must still map to
  coverage items (a floor to raise), but it is a small sample — its silence never shrinks coverage, and
  a real posting overrides the analysis only where they concretely conflict.

`coverage.md` is the single source of truth for what Victor must learn about {TOPIC}, derived from
the job — not from the notes. The full definition, and why projects don't define scope, is in the
standard's "What coverage.md is" section.

---

## The purpose filter — the primary criterion, above every other rule

**Victor's purpose is the ONLY test an item has to pass.** Read it from ROADMAP + `_shared-context`
before writing anything; never from a value baked into this prompt. As of this writing it reads:
first developer job at a large Spanish consultancy (NTT Data, Capgemini, Indra…), **junior/junior-mid**,
**Angular + Spring Boot + PostgreSQL**, applying **August–September 2026**, where **stage 4 — the live
review of the take-home — is the decisive filter** and 2026 added a **code-review round on
(often AI-generated) snippets**. Defer to the sources if they now say something different.

The filter cuts **in both directions**, and a run that fails either one has failed:

- **Nothing missing.** If a junior at that target could be asked it, shown it in a snippet, or hit it
  while doing the take-home — it is IN, however unglamorous. Reading a stack trace, `mvn` failing, a
  415 because the `Content-Type` header is absent, an annotation that silently does nothing: these
  decide interviews and are exactly what a coverage file written from a textbook leaves out.
- **Nothing extra.** If no target posting asks for it, no stage-4 interviewer would probe a junior on
  it, and it is not defensible from Victor's own project — it is OUT, however "good to know". It does
  not just waste study time: coverage feeds `notes-audit` and `interview-prep`, so every stray item
  becomes notes to write, and the runway to the applications window is short. `_shared-context` says
  **depth over breadth**, and that finishing the portfolio project is the priority before applying.

Concretely, for each candidate item ask: *would this decide whether he gets the job in
August–September 2026?* Not "is it true", not "is it Spring Boot", not "would a good engineer know
it" — **would it decide the job.** If you cannot name the stage it is tested at (the take-home, the
snippet code review, a "why X over Y" in stage 4, a decision he must defend about his own project),
it is not a coverage item — route it to `future-learning.md`.

> This is why the AI factor in the standard is not a side rule but the sharp edge of the purpose:
> anything easy to generate with AI and hard to explain, defend, or review is precisely what stage 4
> now exists to test.

---

## Subagent roles — one concern each, read-only

This prompt uses cold subagents, each with a **single concern** and **no write access**:
- **Step 2 — market analyst:** derives the market-demand floor for {TOPIC}. Returns a list; edits nothing.
- **Step 4a — adversarial interviewers (a fan-out, not one):** each hunts, from its own angle, the
  concepts an interviewer would probe that coverage misses. Each returns a gap list; none edits anything.

Never merge these into one subagent and never give any of them a second job — a subagent that both
analyses and writes, or covers two concerns at once, splits its attention and lowers quality. **The
generator (this context) is the only editor:** it consolidates the returned lists, applies the purpose
filter, and writes coverage.md, future-learning.md, and the sync to notes/coverage.md.

### Model policy — per role, to protect quality while saving tokens

Pass an explicit `model` override on every subagent dispatch:

| Role | `model:` | Why |
|------|----------|-----|
| **Generator (this context / session)** | **Opus** | It word-crafts every coverage item to the standard and applies the purpose filter — the real quality bottleneck. Run the session on Opus. |
| Step 2 — market analyst | `sonnet` | Web-search + list; retrieval-heavy, and the Opus generator judges the result against the standard afterwards. |
| **Step 4a — every adversarial angle** | **`opus`** | Generating genuinely hard gotchas and spotting the missing concept is the deepest reasoning here — a weak model asks softballs and misses gaps. This is the pass completeness depends on; never economise here. |

This differs from `notes-audit` on purpose: there the session/orchestrator was light (just dispatch) so it ran on Sonnet with A/B bumped to Opus; **here the session IS the author**, so it runs on Opus. If Victor wants maximum saving and accepts more risk, the market analyst can stay Sonnet — but **never drop a 4a angle below Opus, and never save tokens by running fewer angles**: that is the pass that finds the holes, and a coverage file with holes silently propagates into the notes and the interview prep.

---

## Step 1 — Read the existing state

Before reading any file, re-read the configuration block above — some topics have additional
reading instructions (e.g. Spring Boot requires reading `notes/java/` in step 1.3 as well).

Read these files before making any decision:

1. `{NOTES_PATH}coverage.md` — if it exists, use it as the starting point. Do not remove
   items without a clear reason.
2. `{NOTES_PATH}future-learning.md` — check if any concept listed there has now become
   in-scope given the job target read from ROADMAP + `_shared-context` (role, deadline).
3. All numbered note files in `{NOTES_PATH}en/` — read them to understand what has been studied
   and what examples already exist. This is context, not the source of coverage decisions.
   Skip `future-learning.md` and `coverage.md` in this pass. (Note: the numbered files live in
   the `en/` subfolder; `coverage.md` and `future-learning.md` live in the topic root.)
4. When updating an existing `coverage.md`, touch only the items that are new, wrong, or
   being promoted/demoted. Leave correct existing bullets untouched, word for word — an
   unprompted reword of unrelated items makes the resulting commit noisy and hard to review.

---

## Step 2 — Derive coverage from a deep market analysis (cold subagent), not the notes

Scope for {TOPIC} comes **primarily** from a deep analysis of what the Spanish market asks a junior with
Victor's objectives — the backbone defined in the standard's "Two sources" section — with the real
postings complementing it. Run that analysis in a **cold subagent** so it can web-search without
bloating this context.

**In Claude Code:** launch one `general-purpose` subagent, `model: sonnet`, `run_in_background: false`:

> You are a specialist in the Spanish IT job market for junior developers. Read `ROADMAP.md` and
> `notes/prompts/_shared-context.md` for the candidate's exact objectives (target role, companies,
> stack, timeline, profile) and `notes/prompts/knowledge/coverage/_coverage-standard.md` for what a
> coverage item is. The topic is {TOPIC}.
>
> Produce a **deep analysis of what the Spanish market asks a junior with these objectives, specifically
> for {TOPIC}**:
> - Run a **live web search** of current Spanish junior postings and technical-interview norms for
>   {TOPIC} in this stack (the target companies plus Tecnoempleo / InfoJobs / LinkedIn España); quote the
>   requirement text you find and date it. If web search is unavailable, say so and use your trained
>   knowledge of the 2026 Spanish market.
> - Cross-check `notes/prompts/_job-market-evidence.md` (real postings already on file) as a
>   **complement** — it is a small sample, so it corroborates and adds a frequency signal; it does not
>   bound the analysis.
>
> Return the **required {TOPIC} scope from the market's perspective**: a list of must-know items, each as
> `concept — one interview-anchored sentence` in the standard's format and tagged by section, and for
> each a short source note (which posting/search supports it, or "fundamental interviewers still probe
> even though postings under-list it"). Add a separate short list of **"signals to watch — not a junior
> floor"** (senior-ish items to keep OUT). Do not write coverage.md; return only the analysis.

Then **you** (the generator) treat the returned items as the {TOPIC} **market-demand floor** and derive
coverage from them plus the standard's scope logic — the interviewer mindset ("what would I ask to test
whether they really know this?"), the IN/OUT filter, the AI factor, and the confusable-pairs rule, all
defined in `_coverage-standard.md`. The job target (role, companies, deadline) comes from ROADMAP +
`_shared-context`, never from a value baked into this prompt.

**Not in Claude Code (plain chat):** do the analysis yourself, explicitly — reason through what the
Spanish market asks a junior with these objectives for {TOPIC}, use a web search if the environment
allows, cross-check the evidence file, and write the market-demand item list *before* deriving coverage.
The independence is weaker than a real subagent, so actually produce the list; do not skip to writing.

Two things this per-topic run must still hold onto:
- **The notes are not the source.** If {TOPIC}'s notes are sparse or missing, still derive full
  coverage from what the target screening tests. A gap in the notes is a notes problem, not a reason
  to shrink coverage.
- **Topic-specific scope** from the configuration block above still applies (e.g. testing is always
  in scope for Spring Boot and Angular; Java stays within Spring-Boot-relevant language concepts;
  Docker basics belong under General). Fold those in as you decide {TOPIC}'s items.

---

## Step 3 — The bidirectional check with future-learning.md

**Promote from future-learning → coverage:**
For each concept in `future-learning.md`: is it now in scope, given the job target read from
ROADMAP + `_shared-context` (role, companies, deadline)? Apply the same IN/OUT + AI-factor criteria
from the standard.
If yes: add it to coverage and remove it from `future-learning.md`.

**Demote from coverage → future-learning:**
If coverage currently contains something too advanced for a junior screening, move it.
Write a short explanation in `future-learning.md` of why it is post-junior scope.

**Add new entries to future-learning:**
If you identify a concept that is real and worth knowing post-hire — and it is not already
in `future-learning.md` — add it. Do not create a full note file for it.

**Remove entries from future-learning entirely:**
If an entry in `future-learning.md` is no longer relevant at all — wrong topic, outdated,
or not needed in any future phase — delete it. Do not move it anywhere; simply remove it.
Note this in the summary table under "Removed from future-learning".

---

## Step 4 — Write or update coverage.md

Write the file at `{NOTES_PATH}coverage.md`.

**File structure:**

```markdown
# Minimum Coverage — {TOPIC}

[One or two sentences. State what this file defines and anchor it to the job target read from
ROADMAP + _shared-context. Example shape: "Topics a junior must know to pass a technical screening
at the target consultancies in the target year. Every item must be explainable with a real example."]

## [Section name]
- concept — why it matters and what the interviewer is testing

## [Section name]
- ...
```

**Apply every item/file-format and content check from `_coverage-standard.md`** as you write:
item format (concept — interview-anchored sentence, good-vs-bad), one concept per item, no fenced
code, section naming and size (5–10 items), filtering-risk section order, and — before closing each
section — the three-types check and the confusable-pairs check. Then run the standard's
**completeness test** for the whole file before saving. Do not restate those rules here; the standard
is the single source for them.

**Restructuring is allowed — and expected on a real update.** When new items push a section past the
standard's size limit, **split it** into two sections with functional names rather than letting it
bloat (a 15-item "REST controllers" became "REST controllers" + "API design and the HTTP contract").
Likewise, create a new section when a cluster of gaps has no home. Two consequences: the "leave correct
existing bullets untouched" rule in Step 1.4 is about **wording**, not about where a bullet lives —
moving an unchanged bullet into a better section is fine; and Step 4b must then mirror the new and
renamed **headings**, not only the bullets.

---

## Step 4a — Adversarial gap hunt: a fan-out of angles, uncapped

The generator (Steps 1–4) tends to trust its own list, and a single interviewer only finds the gaps
that fit inside its own question set. **This is the pass that decides whether coverage is complete, so
it is deliberately the most expensive one.** Two rules make it work, and both were learned from a real
run where one capped interviewer returned 13 gaps and looked convergent — while three further angles
then found 80+ more:

- **Never cap the questions.** Do not ask a subagent for "the 12 questions you would ask". A capped
  interviewer finds the gaps that fit in 12 questions; it does not find the gaps. Every dispatch says
  *as many as you genuinely would use — be exhaustive for this angle*.
- **Fan out by angle, not by repetition.** Running the same generic interviewer twice returns the same
  list. Different **angles** interrogate different surfaces of the topic, and the surfaces the generic
  interviewer never touches (what you *do* at a keyboard; what you do when it *breaks*) are where the
  real holes are.

**In Claude Code:** launch these as **parallel** `general-purpose` subagents, `model: opus`,
`run_in_background: false`. Adapt the angle list to {TOPIC} — these are the ones that pay for a
backend/frontend framework topic; drop any that is meaningless for the topic (a "production debugging"
angle makes no sense for CSS) and add one the topic obviously needs:

1. **Live code review** — "here is a snippet, what is wrong with it / would you approve this PR?".
   Annotations that silently do nothing, wrong layer, misused framework idioms, tests that pass but
   prove nothing. *This angle maps directly onto the 2026 code-review round — never skip it.*
2. **Design and decisions** — "why X over Y?" and "how would you build this?" across the topic's real
   design space.
3. **Take-home / live coding** — what must he be able to DO from a blank IDE without googling: bootstrap
   the project, wire the DB, read a stack trace, run it, exercise it with Postman, unblock himself when
   the first run fails.
4. **Debugging what broke** — the errors he will actually hit and be asked about: startup failures, the
   framework's own exception messages and what they really mean, a slow endpoint.

Give each subagent this brief (substituting its angle):

> You are a senior engineer at one of the target consultancies (read `ROADMAP.md`,
> `notes/prompts/_shared-context.md` for the exact role/companies/level, and
> `notes/prompts/_job-market-evidence.md` for what they hire for) interviewing a candidate at the target
> level. The topic is {TOPIC}. Read `{NOTES_PATH}coverage.md` and
> `notes/prompts/knowledge/coverage/_coverage-standard.md`.
>
> Your angle is: **<ANGLE + its one-line description from the list above>**.
>
> Generate as MANY probes from this angle as you genuinely would use — **do not stop at a fixed
> number; be exhaustive for this angle.** Then check each probe against the CURRENT coverage.md and
> output **only the gaps**: what a candidate could not answer from coverage as written, each as a
> coverage item in the standard's format (`concept — interview-anchored sentence`), tagged with the
> section it belongs in (propose a new section if none fits). Do not rewrite existing items. Be
> adversarial — assume the coverage is incomplete until your probes prove otherwise. List separately,
> under **"OUT — post-junior"**, anything you judge to be beyond what a junior at this target is
> actually filtered on.

**Stop rule:** you are done when a fresh angle returns only duplicates of what the others already
found. Heavy overlap between angles is the convergence signal — it means the surface is covered, not
that the pass was wasted.

Then **you** (the generator) consolidate: deduplicate across the angles, and run **every** proposed gap
through the **purpose filter** at the top of this prompt. Add each survivor to the right section of
`{NOTES_PATH}coverage.md` in the standard's format. Discard the rest and note them in the summary as
"adversary-suggested, left out — reason".

> **Expect to discard, and expect to discard confidently.** An uncapped adversary optimises for
> completeness, not for Victor's job — it will propose things that are real, correct, and irrelevant to
> a junior screening in Spain (a past run proposed file uploads and `@Async`, which appear in no target
> posting and in none of his projects). Deleting those is not losing coverage; it is the purpose filter
> doing its job. **The item's own justification must name the stage it is tested at** — if the
> adversary could not, and you cannot either, it is out.

Three routing rules when handling the discards:
- **Discarded ≠ vanished.** For any gap you discard as out-of-junior-scope, confirm it is already
  recorded in `future-learning.md`; if it is not, add it there (Step 5 performs the write). A discarded
  item must never disappear — it is either in coverage or in future-learning, never nowhere.
- **Owned by another topic.** If a proposed gap belongs to a different topic's coverage by ownership
  (e.g. JUnit/Mockito items surfaced during a Java run belong to Spring Boot coverage, per the
  configuration block's per-topic notes), leave it OUT of this file and route it to its owner — note it
  in the summary as "owned by <topic>, not added here". Do not re-litigate the same misplaced gap on
  every run.
- **Real but not his job.** A gap that fails the purpose filter (nothing in the target postings, no
  stage-4 interviewer would probe a junior on it, not defensible from his own projects) goes to
  `future-learning.md` **with the reason written next to it** — "left out of coverage because X" — so a
  later run does not re-add it and Victor can see the judgement, not just the omission.

**Not in Claude Code (plain chat):** run the angles yourself, one at a time and explicitly — switch
hats per angle, generate the probes cold and uncapped, list the gaps, then apply the purpose filter.
The independence is much weaker than real subagents, so actually write the probes out; do not skim
the coverage and declare it complete.

---

## Step 4b — Keep notes/coverage.md in sync

`notes/coverage.md` is a combined file that mirrors all 12 topic `coverage.md` files in one
place, for cross-topic analysis. It must always contain **exactly the same content** as each
topic file — never a paraphrase, a shortened version, or a summary.

Whenever `{NOTES_PATH}coverage.md` is created or edited in Step 4, immediately apply the same
change to its section inside `notes/coverage.md`:

**If the section for {TOPIC} does not yet exist in `notes/coverage.md`:** insert it at the
correct position following the study-priority order: Angular → Angular Material →
Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL →
Git → General. Add a `---` separator before and after the new section.

1. Find the section for {TOPIC} in `notes/coverage.md` — it starts at the line `## {TOPIC}`
   and ends right before the next `## ` heading (or end of file if {TOPIC} is General, the
   last section).
2. Replace that whole section with the new content from `{NOTES_PATH}coverage.md`, transformed
   like this:
   - The title line `# Minimum Coverage — {TOPIC}` becomes `## {TOPIC}` (drop the
     "Minimum Coverage — " prefix, keep one heading level deeper than the source).
   - The description paragraph right after the title is copied verbatim, word for word.
   - Every `## [Section name]` in the source becomes `### [Section name]` (one heading level
     deeper) — content and order stay otherwise identical, including any `---` separators
     between subsections if the source file uses them.
3. Keep the `---` separator before and after the section so it stays cleanly divided from the
   topics before and after it in the study-priority order (Angular → Angular Material →
   Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git →
   General).

Do this for every edit, not just full rewrites — if only one bullet changes in
`{NOTES_PATH}coverage.md`, change that same bullet in `notes/coverage.md` too. The two files
must never drift apart. **This includes structure:** if Step 4 split, renamed, added or removed a
section, the mirrored section must gain, rename or lose the same `###` heading. When an update is large
enough that patching bullet by bullet is error-prone, rebuild the whole `## {TOPIC}` section from the
topic file in one replacement — that is the safer path, not a shortcut.

**Cross-topic overlap check:**
Before finalizing, scan the other sections of `notes/coverage.md` for items that overlap with
what you just added or changed (e.g. REST status codes or "service layer" could plausibly sit
under Architecture, Spring Boot, or Angular). If the same concept already exists elsewhere,
keep it in the topic where an interviewer is most likely to ask it, and mention the overlap in
the final summary instead of duplicating the item.

**Verify the sync before reporting done:**
Re-read the {TOPIC} section in `notes/coverage.md` and the full content of
`{NOTES_PATH}coverage.md` side by side. Confirm every bullet matches exactly — only the
heading levels should differ (`#` → `##`, `##` → `###`). If anything differs, fix
`notes/coverage.md` now, before moving to Step 5.

---

## Step 5 — Update future-learning.md

After writing coverage.md:
- Remove concepts promoted to coverage
- Add concepts demoted from coverage or newly identified as post-junior
- Remove entries identified in Step 3 as no longer relevant at all (wrong topic, outdated, or not needed in any future phase) — simply delete them
- Do not rewrite the whole file — only touch the entries that changed
- Preserve the phased structure (Phase 1, Phase 2, Phase 3) if it already exists
- If `future-learning.md` does not exist yet for this topic, create it with a short intro
  line and at least one `## Phase` section grouping concepts by when they become relevant
  (during the job, 6–12 months in, senior level)

---

## Execution

Apply all changes directly to the files. Do not describe what you would write — write it.

After all edits, print a short summary:

| Change | Detail |
|--------|--------|
| Angles run in Step 4a | [which angles, and where they converged — "angle 4 returned only duplicates"] |
| Added to coverage | [list of new items] |
| Sections split / added | [structural changes, or "none"] |
| Modified in coverage | [list of updated items — one line per change, or "none"] |
| Promoted from future-learning | [list or "none"] |
| Demoted to future-learning | [item — one-line reason it no longer belongs in coverage, or "none"] |
| Left out by the purpose filter | [adversary-suggested item — the stage it could not be tied to, or "none"] |
| Removed from future-learning | [item — one-line reason it was removed, or "none"] |
| Synced to notes/coverage.md | [yes — X bullets changed / no changes needed] |

If coverage.md did not exist before and was created from scratch, only show the
"Added to coverage" row grouped by section. Skip the promoted/demoted/modified/removed rows.
The "Synced to notes/coverage.md" row always appears, even when creating from scratch.

"Promoted from future-learning" = concept moved into coverage (now in scope).
"Removed from future-learning" = concept deleted entirely because it is no longer relevant
(wrong topic, outdated, or not needed anywhere — not just post-junior).

**Commit the changes yourself.** Coverage files live under `notes/`, so this is one of the
cases where Claude commits directly (CLAUDE.md "Non-negotiables" exception for `notes/` and
`notes/prompts/`) — do not hand the commands to Victor. No `Co-Authored-By` lines. The commit
must be atomic — only the coverage files, nothing else.

**Mandatory safety check before committing — never skip it:**
1. Run `git status` and read the full list of changed/staged files.
2. Stage only the coverage files:

```
git add {NOTES_PATH}coverage.md {NOTES_PATH}future-learning.md notes/coverage.md
```

If `{NOTES_PATH}future-learning.md` was not modified, remove it from the `git add` command.

3. Run `git status` again and confirm **only** `notes/` coverage paths are staged. If any
   project code file, or any file this prompt did not touch, is staged, `git restore --staged`
   it before continuing — a stray code file has ridden along into a notes commit before.
4. Only once the staged list is clean, commit:

```
git commit -m "docs: update {TOPIC} coverage — <one line summary of main changes>"
```

Report the commit hash in the final summary so Victor can see it landed.

### Final step — pipeline self-report

This prompt dispatches subagents, so it ends like every orchestrator: read
`notes/prompts/_pipeline-self-report.md` and execute it for this run. Because this folder is shared
with `coverage-audit-prompt.md`, write the report as `_last-run-report-coverage-prompt.md`, commit it
on its own, and print the five bullets in chat.
