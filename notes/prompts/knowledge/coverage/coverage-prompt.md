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
  Additionally read the Java notes when reading existing notes (Step 1.3) — `notes/java/en/` if that
  subfolder exists, otherwise the flat numbered files in `notes/java/` (same `en/`-may-not-exist-yet
  rule as Step 1.3) — because Spring Boot coverage must include Java language concepts that appear in
  Spring Boot code.
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
- Security: covers AuthN/AuthZ, hashing, JWT design, CORS, XSS, CSRF, SQL injection — plus the
  surfaces the 2026-07-18 run added: information disclosure (stack traces, user enumeration including
  the timing variant, over-returning fields, secrets in logs, exposed actuator/Swagger), attacks on
  login and credentials (brute force, rate limiting and the lockout trade-off, password reset), the
  attacker mindset (blast radius, trust boundaries, a token as a bearer credential), transport (why
  TLS is the precondition for token auth) and dependency risk (known CVEs).
  **Security holds the language-agnostic concept; the topic holds its implementation.** "How is a
  password stored and why" is Security; `BCryptPasswordEncoder` as a bean is Spring Boot. "What CORS
  is and who enforces it" is Security; `CorsConfigurationSource` inside `SecurityFilterChain` is
  Spring Boot. Apply this in both directions when the overlap check runs: do not import Spring
  Security *wiring* into this file, and do not leave a vendor-neutral security concept to be owned by
  a framework topic just because that is where it was first written down.
- Architecture: in scope — REST principles, layered architecture, MVC, coordinator pattern,
  smart/dumb components, service layer, repository pattern. Out of scope (future-learning) —
  microservices, event-driven architecture, DDD, CQRS, distributed systems.

Use TOPIC and NOTES_PATH wherever the prompt refers to {TOPIC} or {NOTES_PATH}.

---

I want you to create or update the coverage.md file for {TOPIC}.

> **Branch guard (step 0, before anything else):** run `git branch --show-current`. Study materials
> commit on whatever branch is currently active (CLAUDE.md, "Study materials follow the active
> branch") — a feature branch is the normal case; just name the branch in the final summary. The one
> branch that must stop the run is **`main`**: it never receives direct commits, only merges via PR —
> if you are on `main`, stop and ask Victor which branch to use.

> **Generator-model guard (step 0, same moment):** the model-policy table below names **Opus** for
> the generator (this session), because this session *is* the author of every coverage item — the
> real quality bottleneck. Nothing in the run flow can enforce the session's own model, so confirm it
> yourself before Step 1: if you are not running on Opus, **stop and tell Victor to switch the session
> to Opus** (`/model opus`) before continuing — do not word-craft coverage items on a weaker model.
> This is not optional politeness: a real run consolidated on Sonnet shipped standard violations (an
> unsplit 16-item section, two merged multi-concept items) that only an Opus re-pass caught. The
> subagent `model:` overrides do not cover this — they set the *subagents'* models, never the
> session's.

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

**Concepts only — coverage feeds the notes.** Every item must be a *studyable concept* (a mechanism,
an annotation, a decision, a gotcha) that `notes-audit` can turn into a study note. Working methods,
interview conduct, and "how to behave in the round" (think out loud, build in vertical slices, the
order to read a PR in) are NOT coverage items — the *concepts underneath them* are (e.g. not "read the
trace before editing code" but "`Caused by:` — the root cause sits at the bottom of a nested stack
trace"). Route conduct/method material to the interview-prep prompts, never into coverage.md.

**Never assert where a concept lives without reading the file — this binds the whole run, not just
Step 4a.** The grep discipline in Step 4a's overlap check is written as a *consolidation* step, which
leaves the rest of the run free to make ownership claims from memory: in the framing before Step 1, in
the summary, in an answer to Victor about what this run will probably find. Those claims are not
harmless commentary — they set the run's expectations before a single subagent has read anything, and
a wrong one biases every later judgement toward the answer already announced.

So: **any statement of the form "X is probably already covered by <topic>" / "X almost certainly lives
elsewhere" must be preceded by the grep that shows it, at whatever point in the run it is made.** One
`grep -n "^## " notes/coverage.md` for the section map plus one term grep is enough — it costs seconds,
and it is the same gesture Step 4a mandates anyway.

Say "I have not checked yet" rather than a hedged guess. **"Almost certainly" is the tell**: it reads
as verified while carrying none of the work, and it is wrong in both directions. On the Security run
(2026-07-18) the pre-run framing announced that JWT, CORS and SQL injection "almost certainly already
have homes in the other topics' sections" — the exact inverse of the file, where `### JWT`, `### CORS`
and the injection item are Security's own sections (`notes/coverage.md` 1318–1363) and the duplication
runs *outward* into Spring Boot, Architecture and General. Acting on that guess would have dropped
Security's own core items as other topics' property.

---

## Subagent roles — one concern each, read-only

This prompt uses cold subagents, each with a **single concern** and **no write access**:
- **Step 2 — market analyst:** derives the market-demand floor for {TOPIC}. Returns a list; edits nothing.
- **Step 4a — adversarial interviewers (a fan-out, not one):** each hunts, from its own angle, the
  concepts an interviewer would probe that coverage misses. Each returns a gap list; none edits anything.
- **Step 4b — standard reviewer (one, not a fan-out):** judges the items *this run just wrote* against
  `_coverage-standard.md`. Returns defects + fixes; edits nothing. It is the only role that looks
  forward at the run's own output instead of backward at the file it inherited.

Never merge these into one subagent and never give any of them a second job — a subagent that both analyses
and writes, or covers two concerns at once, splits its attention and lowers quality. **The generator
(this context) is the only editor:** it consolidates the returned lists and writes coverage.md,
future-learning.md, and the sync to notes/coverage.md.

**Acceptance check per subagent — no proof, no pass.** Before consolidating any subagent's list,
verify it carries its proof of work:
- **Step 2 market analyst** — each must-know item has its source note (posting/search quote, or
  "fundamental interviewers still probe"), and the report says whether the live web search ran or
  fell back to trained knowledge.
- **Each Step 4a angle** — the "N lines, read to EOF" line for `{NOTES_PATH}coverage.md` (the file
  it judged gaps against — an angle that half-read it reports gaps that are already covered), and
  every gap in the standard's item format, tagged by section.
- **Step 4b reviewer** — the "N items reviewed" line, with N matching the number of items you sent it.

If a report is missing its proof or is unusable, re-dispatch that one subagent **once**, naming what
was missing. If it fails again, mark that angle/analysis as **not completed** in the final summary —
never treat a proofless report as a full pass, and never silently continue as if the angle had run.

**Bounded reports only.** Every subagent returns its list (+ proof lines) and nothing else — no
narrative, no code dumps, no restating of coverage items it found fine. The 4a angles are uncapped in
*items*, never in prose: if a report comes back wrapped in narrative, keep the item list + proof and
discard the rest.

### Model policy — per role, to protect quality while saving tokens

Pass an explicit `model` override on every subagent dispatch:

| Role | `model:` | Why |
|------|----------|-----|
| **Generator (this context / session)** | **Opus** | It word-crafts every coverage item to the standard — the real quality bottleneck. Run the session on Opus. |
| Step 2 — market analyst | `sonnet` | Web-search + list; retrieval-heavy, and the Opus generator judges the result against the standard afterwards. |
| **Step 4a — every adversarial angle** | **`opus`** | Generating genuinely hard interview gotchas and spotting the missing concept is the deepest reasoning here — a weak model asks softballs and misses gaps. |
| **Step 4b — standard reviewer** | **`opus`** | It is the only check on the run's own output, and judging an item against a written standard is the same craft as writing one — a weaker model rubber-stamps. |

This differs from `notes-audit` on purpose: there the session/orchestrator was light (just dispatch) so it ran on Sonnet with A/B bumped to Opus; **here the session IS the author**, so it runs on Opus. If Victor wants maximum saving and accepts more risk, the market analyst can stay Sonnet — but **never drop a 4a angle below Opus, and never save tokens by running fewer angles**: that is the pass that finds the holes, and a coverage file with holes silently propagates into the notes and the interview prep.

---

## Step 1 — Read the existing state

> **Verifiable reads (CLAUDE.md non-negotiable) — applies to every whole-file read in this prompt.**
> The Read tool truncates at 2000 lines **silently**. Before reading any file end-to-end, run `wc -l`
> on it; if it is near or over 2000 lines, read it in passes with `offset` to the real end.
>
> **The two coverage files are handled differently — do not apply one rule to both.**
> - **`{NOTES_PATH}coverage.md` (the topic file) is read whole**, by you in Step 1 and by every Step 4a
>   angle. State **"N lines, read to EOF"** for it in the final summary, and reject any angle report
>   that lacks the line — an angle that half-read it reports gaps that are already covered.
> - **`notes/coverage.md` (the combined file) is never read whole.** It is over 2000 lines and grows
>   every run, so reading it end-to-end burns the context that must then word-craft every item. Work it
>   by section map (`grep -n "^## "`), term greps, targeted `offset` range reads, and the diffs in
>   Step 4c. Do **not** claim "read to EOF" for it; report what you actually did instead. This is the
>   settled resolution of a contradiction two runs had to resolve by hand — Step 4a's "one grep, not a
>   re-read" is the rule for this file, and Step 4c verifies it mechanically rather than by reading.

Before reading any file, re-read the configuration block above — some topics have additional
reading instructions (e.g. Spring Boot requires reading `notes/java/` in step 1.3 as well).

Read these files before making any decision:

1. `{NOTES_PATH}coverage.md` — if it exists, use it as the starting point. Do not remove
   items without a clear reason.
2. `{NOTES_PATH}future-learning.md` — check if any concept listed there has now become
   in-scope given the job target read from ROADMAP + `_shared-context` (role, deadline).
2b. `notes/prompts/knowledge/coverage/_cross-topic-inbox.md` — the entries filed under `## {TOPIC}` are
   gaps that **other topics' runs** found and routed to you (an Angular template-compiler concept
   surfaced by a TypeScript run, a JUnit concept surfaced by a Java run). Read only your own heading.
   Treat each as a *proposed* item: judge it against the standard and the IN/OUT filter exactly like a
   Step 4a gap — it is not pre-approved, and you may discard it. Then **clear every entry you looked at**,
   whether you added or discarded it, and report both counts in the summary. Leaving a consumed entry
   behind makes the next run re-litigate it; leaving an unread one silently loses it, which is the
   failure this file exists to prevent. No heading for {TOPIC}, or an empty one, is the normal state.
3. The numbered note files — **surveyed at headings level, not full prose**:
   for each file, read its heading structure (`grep -n "^##" <file>`) plus its opening section,
   enough to know what has been studied and which examples exist. This is context, not the source
   of coverage decisions, so the map is enough — loading every file's full body into the same
   context that must then word-craft every coverage item is the whole-folder saturation the notes
   pipeline splits stages to avoid. Open a file's body only where the headings leave a genuine
   doubt. Skip `future-learning.md` and `coverage.md` in this pass.
   > **Where the numbered files live depends on whether `notes-audit` has run yet.** The `en/`/`es/`
   > split is created by `notes-audit`, not by this prompt — coverage can (and often does) run
   > *first*, on a topic whose notes are still flat numbered files in the topic root (`General`, and
   > any topic not yet audited). So: `ls {NOTES_PATH}en/` first — if the `en/` subfolder exists, read
   > the numbered files there; if it does not, read them from the topic root (`{NOTES_PATH}`). If
   > **neither** has numbered files, the notes simply do not exist yet — that is normal and expected
   > (coverage is derived from the job, not the notes), so skip this sub-step and derive coverage from
   > Step 2 alone. A missing `en/` is never an error and never a reason to stop.
   > `coverage.md` and `future-learning.md` always live in the topic root regardless.
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
> - **If {TOPIC} appears in fewer than ~3 of the postings on file, shift your weight to interview
>   norms.** Some topics are rarely *named* in a posting yet are heavily *probed* in the technical
>   round (Angular Material appeared in ~2/8 and still drives a whole take-home screen). In that case
>   do not pad the list with generic stack requirements: report the low frequency explicitly, then
>   spend your effort on what the technical interview and the take-home actually exercise for {TOPIC}.
>   Low posting frequency is a signal about *how the market words its ads*, never about scope.
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

**Split the concept from its implementation — a promotion is often partial.**
The commonest real case is not "in or out" but "knowing what it is, is in scope; building one is not".
When a Step 4a angle proposes a gap that `future-learning.md` already lists as post-junior, do not treat
it as a contradiction to resolve one way: check whether the *concept* and the *implementation* belong on
different sides of the line. `ControlValueAccessor` is the worked example — a junior is asked what it is
and why Material controls bind to `formControlName` (IN), and is not asked to write one (stays in
future-learning). Same shape for `MatPaginatorIntl` (the token exists and is the translation hook: IN;
subclassing it into an i18n pipeline: OUT) and custom `DataSource` (binding `[length]` and reacting to
`(page)`: IN; extending the CDK base class: OUT).
When you split one this way, add the coverage item **and** reword the `future-learning.md` entry so it
names the boundary explicitly — otherwise the next run re-litigates the same item. Record it in the
summary under "Promoted from future-learning" as a partial promotion.

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

**Structural check before saving — count, do not eyeball.** The standard's size and one-concept rules
are the two that a generator reliably violates while believing it complied, so verify them mechanically
rather than by impression, on the finished file:
1. **Count the items in every section.** Any section over 12 items must be split before saving; under 3
   must be fixed. Counting is not optional — a real run shipped a 16-item section that the generator
   had "checked" by reading it.
   > **An undersized section has two fixes, and merging is the second choice.** Prefer to **grow** it:
   > if this run's gaps include concepts that genuinely belong beside the orphans, fold them in and
   > rename the section to cover the wider theme. Merge into a neighbour only when no such concepts
   > exist. Never merge across a semantic boundary just to clear the count — a section whose name no
   > longer describes its contents is worse than either the small section or the missing items, and it
   > misfiles those bullets for every downstream prompt that reads coverage by section. The worked
   > example is the Java run: a 2-item "Control flow" had no honest neighbour (the adjacent sections
   > were Strings and Classes), so it grew with that run's `package` / `import` / fully-qualified-name
   > gaps and became "Control flow and source structure".
2. **Re-read every item you wrote this run for the one-concept rule.** An item naming two annotations,
   two files, or two mechanisms joined by "and"/"+" is a grouped bullet and must be split — the same run
   shipped two of these (`environment.ts` + `fileReplacements`, `CORS` + `proxy.conf.json`).
3. **Then run the standard's completeness test** on the whole file, plus the three-item-types and
   confusable-pairs checks per section.

State in the final summary that this check ran and what it changed (or "no splits needed").

**Restructuring is allowed — and expected on a real update.** When new items push a section past the
standard's size limit, **split it** into two sections with functional names rather than letting it
bloat; likewise, create a new section when a cluster of gaps has no home. Two consequences: the "leave
correct existing bullets untouched" rule in Step 1.4 is about **wording**, not about where a bullet
lives — moving an unchanged bullet into a better section is fine; and Step 4c must then mirror the new
and renamed **headings**, not only the bullets.

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
  list. Different **angles** interrogate different surfaces of the topic — and the surfaces the generic
  interviewer never touches (what breaks at the keyboard, what the take-home actually exercises) are
  where the real holes are.

> **When to launch the angles — it depends on whether coverage already exists.** The step is numbered
> after Step 4, but that order is only mandatory in one of the two cases:
> - **`{NOTES_PATH}coverage.md` did not exist, or is thin** — run the angles **after** Step 4 writes the
>   file, sequentially. Hunting gaps against an empty or skeletal file returns the whole topic as a
>   "gap" and tells you nothing.
> - **`{NOTES_PATH}coverage.md` already exists and is mature** (the normal case on an update) — launch
>   the angles **in parallel with the Step 2 market analyst**, judging against the current file, and
>   consolidate everything in one pass afterwards. This is what the angle brief means by "the CURRENT
>   coverage.md". It is materially cheaper and loses nothing: the angles were never reading your new
>   items anyway, since Step 4's additions come from the same market analysis they run beside.
>
> Either way the consolidation is a single pass and the generator is still the only editor.

**In Claude Code:** launch these as **parallel** `general-purpose` subagents, `model: opus`,
`run_in_background: false`. Adapt the angle list to {TOPIC}: drop any that is meaningless for the topic
(a "production debugging" angle makes no sense for CSS), and **add at least one angle invented for
{TOPIC} specifically — this is required, not optional.**

> **The invented angle is where the run's value actually comes from.** The numbered angles below are
> generic by construction, so on any topic that sits *beside* a framework they converge on that
> framework's mechanics — which another topic usually already owns. Two consecutive runs show the
> pattern and neither is a coincidence:
> - **Architecture (2026-07-18)** — the four standard angles converged on Spring Boot mechanics; the
>   two improvised angles (take-home, existing-codebase onboarding) produced the run's *only* genuinely
>   new sections. Onboarding was promoted to angle 6 as a result.
> - **Security (2026-07-18)** — the four standard angles converged almost entirely on Spring Security
>   *wiring* (`SecurityFilterChain`, `@EnableMethodSecurity`, `UserDetailsService`, `OncePerRequestFilter`),
>   every bit of it owned by Spring Boot coverage. The improvised **attacker-mindset / threat-modelling**
>   angle produced three whole new sections (information disclosure, attacks on login, transport and
>   dependency risk) and roughly two-thirds of everything added.
>
> So do not treat the numbered list as the work and the extra angle as a garnish. Before dispatching,
> ask: **"what is the question an interviewer asks about {TOPIC} that none of the angles below would
> ever generate?"** — the inversion the topic allows (Security: *how would you attack it?*), the surface
> the candidate lives on rather than authors (Architecture: *code you did not write*), the layer beneath
> the idioms (language topics: *what does this print?*). Name the invented angle and its yield explicitly
> in the final summary, so the next run can promote it into the numbered list if it keeps paying off —
> that is how angles 5 and 6 got here.

1. **Live code review** — "here is a snippet, what is wrong with it?". The *concepts* a reviewer needs:
   annotations that silently do nothing, wrong layer, misused framework idioms, tests that pass but
   prove nothing. *This angle maps directly onto the 2026 code-review round — never skip it.*
2. **Design and decisions** — "why X over Y?" and "how would you build this?" across the topic's real
   design space.
3. **Take-home / live coding** — the *concepts* behind doing the work from a blank IDE: what someone
   who cannot bootstrap the project, wire the DB, or unblock a failed first run is missing (the
   mechanism of the wrapper/tooling, what an error actually means, where configuration comes from).
4. **Debugging what broke** — the errors he will actually hit and be asked about: startup failures, the
   framework's own exception messages and what they really mean, a slow endpoint.
5. **Output prediction — mandatory for language topics (JavaScript, Java, TypeScript), optional
   elsewhere.** "What does this print, and in what order?" — execution and evaluation order, reference
   vs value at call sites, coercion and operator semantics, iteration rules, and the canned puzzles a
   screening reuses verbatim. *Why it is mandatory and not left to judgement:* angles 1–4 are all
   framework-shaped — they interrogate how you use a stack — so on a language topic they can converge,
   look complete, and still never touch the mechanism layer underneath. That is exactly what happened on
   the JavaScript run: this angle was improvised, and it was the **only** one that returned `ToPrimitive`,
   the abstract equality algorithm, `this` binding precedence, the prototype chain, microtask-drain
   ordering and sparse arrays. Without it the file would have been fluent about idioms and silent about
   why they behave that way — the exact gap a Spanish quickfire screening is built to find.
6. **Existing-codebase onboarding — mandatory for framework/stack topics (Spring Boot, Angular,
   Architecture, and any topic whose interview shows real project code), optional for language and
   pure-syntax topics.** The concepts a junior needs on day one inside a large codebase they did not
   write: recognising which layer or role a class has from its name and annotations, following a
   request end to end, judging a change's blast radius, adding a field across every layer, versioning
   an API other teams consume. *Why it is mandatory and not left to judgement — the mirror of angle 5's
   reasoning:* angles 1–4 are all shaped as if the candidate authors the code, so on a stack topic
   they converge on writing-and-debugging mechanics and never touch the inheriting-code surface —
   which is the one a consultancy junior actually lives on, since almost none green-field anything.
   On the Architecture run (2026-07-18) this angle was improvised, and it was the sole source of the
   file's two most market-relevant new sections ("Working in a codebase you did not write", most of
   "System shape and structure"); the four standard angles had converged elsewhere and looked complete.

Give each subagent this brief (substituting its angle):

> You are a senior engineer at one of the target consultancies (read `ROADMAP.md`,
> `notes/prompts/_shared-context.md` for the exact role/companies/level, and
> `notes/prompts/_job-market-evidence.md` for what they hire for — a small sample that corroborates,
> never bounds, your probes) interviewing a candidate at the target level. The topic is {TOPIC}. Read
> `{NOTES_PATH}coverage.md` and `notes/prompts/knowledge/coverage/_coverage-standard.md`.
>
> Your angle is: **<ANGLE + its one-line description from the list above>**.
>
> Generate as MANY probes from this angle as you genuinely would use — **do not stop at a fixed
> number; be exhaustive for this angle.** Then check each probe against the CURRENT coverage.md and
> output **only the gaps**: what a candidate could not answer from coverage as written, each as a
> coverage item in the standard's format (`concept — interview-anchored sentence`), tagged with the
> section it belongs in (propose a new section if none fits). **Every gap must be a studyable
> concept** — a mechanism, annotation, decision, or gotcha a note can be written about — never a
> working method or interview conduct ("think out loud", "build in slices"); when a method matters,
> return the concept underneath it. Do not rewrite existing items. Be adversarial — assume the
> coverage is incomplete until your probes prove otherwise. List separately, under
> **"OUT — post-junior"**, anything you judge beyond what a junior at this target is filtered on.
> Run `wc -l` on the coverage.md before reading it (the Read tool truncates at 2000 lines silently —
> use `offset` passes if needed) and state **"N lines, read to EOF"** in your report — a half-read
> coverage produces gaps that are already covered. Return only the gap list, the OUT list, and that
> line — no narrative around them.

**Stop rule:** you are done when a fresh angle returns only duplicates of what the others already
found. Heavy overlap between angles is the convergence signal — it means the surface is covered, not
that the pass was wasted.

Then **you** (the generator) consolidate: deduplicate across the angles, check each proposed gap
against the standard's IN/OUT filter and the "concepts only" rule above, add every genuine one to the
right section of `{NOTES_PATH}coverage.md` in the standard's format, and discard the rest (note those
in the summary as "adversary-suggested, left out — reason").

Three routing rules when handling the discards:
- **Discarded ≠ vanished.** For any gap you discard as out-of-junior-scope, confirm it is already
  recorded in `future-learning.md`; if it is not, add it there (Step 5 performs the write). A discarded
  item must never disappear — it is either in coverage or in future-learning, never nowhere.
- **Owned by another topic.** If a proposed gap belongs to a different topic's coverage by ownership
  (e.g. JUnit/Mockito items surfaced during a Java run belong to Spring Boot coverage, per the
  configuration block's per-topic notes), leave it OUT of this file and route it to its owner — note it
  in the summary as "owned by <topic>, not added here". Do not re-litigate the same misplaced gap on
  every run.
  > **Routing means writing it down, not mentioning it.** Append the item to
  > `notes/prompts/knowledge/coverage/_cross-topic-inbox.md` under the owning topic's `## ` heading, in
  > the standard's item format, tagged with the run that found it — creating the heading if absent. A
  > summary line is not a handoff: the summary lives in a chat nobody reads later, so the item then
  > **Ownership of a vendor-neutral concept does not delete its framework-specific twin.** Security and
  > Architecture are language-agnostic by nature, so the *concept* is owned by `security/` or
  > `architecture/` and lives there — but the **concrete implementation in a framework is a distinct,
  > legitimately owned item** in that framework's coverage, and routing the concept out must not silently
  > drop it. CSRF-the-attack belongs to Security; `CsrfTokenRepository` and when to disable CSRF for a
  > stateless JWT API belong to Spring Boot. Layered architecture belongs to Architecture;
  > `@Service`/`@Repository` and the DTO-vs-entity boundary belong to Spring Boot. Sanitisation belongs
  > to Security; `DomSanitizer` and `[innerHTML]` belong to Angular. So when you route a concept out,
  > ask explicitly whether this topic has its own *wiring* for it: if it does, keep that item here (worded
  > as the implementation, not the concept) and route only the vendor-neutral part. Two items, one on each
  > side, is the correct outcome — not a duplicate. What IS a duplicate is restating the neutral concept
  > here, or restating the framework API over there.
  > depends on the owner's own future run rediscovering it by chance. **It does not.** The TypeScript run
  > (2026-07-18) routed out four Angular-owned concepts — `strictTemplates`, AOT, the `ng build`
  > type-check, typed `FormGroup<T>` — and Angular's coverage run had already happened that same day
  > without finding any of them. Nothing else in the pipeline catches this: `coverage-audit`'s Analyst D
  > hunts duplicates, misplaced items and demotion candidates, so a concept **absent from every section**
  > is invisible to it. Write the entry before you move on.
- **Already covered by this topic — grep the topic's own file too, in the same pass.** The
  cross-topic check below has no eye on duplication *inside* `{NOTES_PATH}coverage.md` itself, and
  Step 4b explicitly cannot judge it (the reviewer only sees the new items, never the sections they
  join). That leaves the generator catching, from memory and with ~100+ proposals in context, that a
  gap it is about to add restates a bullet three sections up — which is exactly the moment memory
  fails. So before writing: grep `{NOTES_PATH}coverage.md` for the distinctive terms of the gaps you
  are about to add, the same gesture as the cross-topic grep, one file more. On a real run
  (Architecture, 2026-07-18) two proposed gaps — a "transaction boundary" item and a "consistent
  error contract" item — duplicated existing bullets and were caught only by the generator's
  attention; this check makes that catch procedural instead of lucky.
- **Already covered by another topic — run the cross-topic overlap check HERE, before writing.**
  Scan the other sections of `notes/coverage.md` for items that overlap with the gaps you are about to
  add (e.g. REST status codes or "service layer" could plausibly sit under Architecture, Spring Boot,
  or Angular; view encapsulation and `::ng-deep` sit under Angular, not Angular Material). If the
  concept already exists elsewhere, keep it in the topic where an interviewer is most likely to ask it,
  drop it from this run's additions, and mention the overlap in the final summary instead of
  duplicating the item.
  > **How to run it without burning the context: one grep, not a re-read.** `notes/coverage.md` is well
  > over 2000 lines, so do not read it whole to judge ownership and do not judge from memory either —
  > grep it once for the distinctive terms of the gaps you are about to add (plus `^## ` to see the
  > section map in the same output), and decide from the hits. Two consecutive runs show why this is the
  > load-bearing step and not a formality: on Java roughly **half** the proposed gaps were already owned
  > by Spring Boot or Architecture, and on JavaScript an entire proposed "browser storage" section was
  > owned by General and Security, along with CORS, the `OPTIONS` preflight, the `Authorization: Bearer`
  > header, JWT-in-`localStorage` and `.env`-is-public. **Foundational topics are structurally
  > overlap-heavy** — anything that sits underneath other topics (JavaScript below Angular; Java below
  > Spring Boot) will attract proposals that belong to the layer above, so budget real effort here on
  > those runs.
  > **Cross-cutting topics are the inverse case, and heavier still.** A topic that sits *across* the
  > stack rather than underneath it (Architecture over Spring Boot + Angular + General; Security is
  > the same shape) attracts proposals from every side at once: on the Architecture run (2026-07-18)
  > roughly **two-thirds** of ~130 proposed gaps were already owned elsewhere, and ownership was the
  > run's single most expensive judgement. On these topics expect one grep NOT to be enough — the
  > honest pattern was a section-map grep, one wide multi-term grep, then follow-up greps scoped to
  > the individual owning topics' line ranges. And expect the honest outcome to be **dropping most of
  > the proposals**, not adding them: a cross-cutting run that adds the majority of its gaps has
  > almost certainly duplicated the topics it spans.
  > **Why this check lives in Step 4a and not in the sync step.** It used to sit at the end of the sync —
  > which meant a duplicate was written into the topic file *and* mirrored into `notes/coverage.md`
  > before being caught, forcing a second full sync pass. It happened on a real run (three Angular-owned
  > items written and mirrored during an Angular Material run). Deciding ownership belongs to
  > consolidation, when nothing has been written yet; by the time the sync runs, the cost of a wrong
  > call has already been paid twice. Step 4b's cold review sits on the same principle.

**Not in Claude Code (plain chat):** run the angles yourself, one at a time and explicitly — switch
hats per angle, generate the probes cold and uncapped, list the gaps, then add the genuine ones. The
independence is much weaker than real subagents, so actually write the probes out; do not skim the
coverage and declare it complete.

---

## Step 4b — Cold review of what this run actually wrote

Every other check in this prompt judges the coverage that existed **before** the run: the 4a angles
hunt gaps in the old file, the structural check counts sections, the completeness test reads the
whole. Nothing judges the **items the generator just word-crafted** — and those are the entire product
of the run (the JavaScript run wrote ~85 new items in a single consolidation pass, unreviewed by
anyone). `notes-audit` solves exactly this risk with a reviewer stage; this step is its equivalent
here, deliberately kept narrow so it costs one subagent rather than a second pipeline.

**It runs here, before Step 4c, for the same reason the overlap check moved into 4a:** a defect caught
after the sync has already been mirrored into `notes/coverage.md` and costs a second full sync pass to
repair. Fix the topic file while it is still the only copy.

**Scope — the touched sections, with the new items marked.** Send the reviewer `_coverage-standard.md`
plus **every section this run added to, in full, with each new or reworded item marked `[NEW]`**. Send
nothing from sections this run did not touch — those were reviewed on the run that wrote them, and
padding the input is how a narrow check turns into an expensive one that reviews everything shallowly.

> **Why the whole section and not only the new bullets.** The brief asks the reviewer to judge whether
> an item is *filed in the right section* and whether it *restates an existing bullet* — and neither
> question can be answered from an excerpt that omits the section's other items. A real run (Security,
> 2026-07-18) hit exactly this: the reviewer flagged a CSRF-mechanism item as misfiled, not knowing the
> section already held the CSRF bullet it explains, and the generator had to overrule it. That is a
> false positive manufactured by the prompt, not by the reviewer.
>
> Sending the section also closes a hole the prompt elsewhere admits it cannot cover. Step 4a's
> intra-file duplicate check runs on the generator's memory with ~100+ proposals in context — "which is
> exactly the moment memory fails". With the surrounding bullets present, the reviewer becomes a real
> second check on same-section duplication, at close to zero extra cost: only the touched sections are
> sent, and they are the ones the generator was reasoning about anyway.

**In Claude Code:** one `general-purpose` subagent, `model: opus`, `run_in_background: false`:

> You are reviewing coverage items written by another engineer, against a written standard. Read
> `notes/prompts/knowledge/coverage/_coverage-standard.md` — it is the authority; where your taste and
> the standard disagree, the standard wins. The topic is {TOPIC}.
>
> Below are the sections of `{NOTES_PATH}coverage.md` that this run touched, each shown **in full**.
> Items marked `[NEW]` were written by this run; the unmarked ones already existed and are shown so you
> can judge placement and duplication. [paste the touched sections here, new items marked `[NEW]`]
>
> Judge **only the `[NEW]` items**, one at a time, against the standard. Use the unmarked items as
> context only — never report a defect against one of them:
> - **Item format** — `concept — interview-anchored sentence`? Does the sentence say what the
>   interviewer is testing, or does it merely define the term?
> - **One concept per item** — flag any bullet joining two annotations, two files, two mechanisms with
>   "and"/"+" that a note would have to split anyway.
> - **Studyable concept, not conduct** — a mechanism, annotation, decision, or gotcha; never a working
>   method or interview behaviour.
> - **Filed in the right section** — does the item's section heading actually describe it, and do the
>   unmarked items around it belong to the same theme? An item that would read as an intruder beside
>   its neighbours is misfiled even when the heading loosely fits.
> - **Duplicates a bullet already in the section** — a `[NEW]` item that restates an unmarked one, or
>   that a note would cover in the same breath, is a defect; say which existing bullet it collides with
>   and whether the right fix is dropping the new item or sharpening the old one.
> - **No fenced code**, and the wording is specific (a real error message, a real method name) rather
>   than vague.
>
> **Out of your scope — do not report on these.** You are seeing only the sections this run *touched*,
> not the whole file. So do not judge **section size** (the standard's 3–12 rule), whether a section is
> under-filled, or whether the file as a whole passes the completeness test: sections you cannot see
> may already carry a concept you think is missing, and the generator verifies every count
> mechanically, before and after your fixes. Say nothing about how many items there are.
>
> Return **only defects**: for each, the item's opening words, the rule it breaks, and a corrected
> version you would accept. Say nothing about items that pass. If a whole section's `[NEW]` items read
> as filler, say so once. End with the line **"N items reviewed"** where N is the number of `[NEW]`
> items you were given (not the total shown) — the count is your proof of work.

**Acceptance check:** the report must carry the "N items reviewed" line and N must match what you sent.
If it is missing or the count is wrong, re-dispatch **once** naming the problem; if it fails again, mark
the review as **not completed** in the final summary rather than treating it as a pass.

Then **you** (the generator, still the only editor) apply the corrections you agree with, and note in
the summary how many defects were reported and how many you applied. **Disagreeing is allowed and
expected** — the reviewer sees the items without the market analysis that produced them, so it can
mistake a deliberately narrow item for a vague one. What is not allowed is skipping the step because
the items "felt fine when written": that is precisely the judgement this step exists to distrust.

**When applying a split pushes a section over the 12-item cap.** The reviewer enforces the one-concept
rule, so its fixes *add* items — and a section already near the limit can cross it while you are
complying with a mandated split. The two rules do not conflict in priority (the split always happens:
a grouped bullet is a defect, an oversized section is only a shape problem), so the question is where
the extra item lands. In order: **relocate** the least-central item in that section to a neighbour whose
heading honestly describes it; if no honest home exists, **split the section** per Step 4's rule. Never
resolve it by declining the split or by leaving the section over 12. The worked example is the TypeScript
run: applying two splits took `## Narrowing and type guards` from 12 to 13, and the fix was moving the
`catch (e: unknown)` item into `## Modelling domain state and errors`, where it filed better anyway.
**Re-run the Step 4 structural count after applying the reviewer's fixes** — the first count ran before
these edits existed, so it cannot have seen the overflow.

---

## Step 4c — Keep notes/coverage.md in sync

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

   > **The two substitutions overlap — never apply them in a single pass over the file.** The first
   > rule turns the title into `## {TOPIC}`, which the second rule then matches and demotes again to
   > `### {TOPIC}`, silently producing a section that no longer has a topic heading at all. It
   > happened on a real run (SQL, 2026-07-18) via one `sed` with two expressions. Transform the title
   > **separately** from the section headings (handle line 1 on its own, or run the `## ` → `### `
   > rule first and the title rule second), and explicitly check that line 1 of the rebuilt section
   > reads `## {TOPIC}` before moving on. The verify step below catches this, but only if you compare
   > the heading levels rather than just the bullets.
3. Keep the `---` separator before and after the section so it stays cleanly divided from the
   topics before and after it in the study-priority order (Angular → Angular Material →
   Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git →
   General).

Do this for every edit, not just full rewrites — if only one bullet changes in
`{NOTES_PATH}coverage.md`, change that same bullet in `notes/coverage.md` too. The two files
must never drift apart. **This includes structure:** if Step 4 split, renamed, added or removed a
section, the mirrored section must gain, rename or lose the same `###` heading. When an update is
large enough that patching bullet by bullet is error-prone, rebuild the whole `## {TOPIC}` section
from the topic file in one replacement — that is the safer path, not a shortcut.

> **Windows encoding warning:** on Windows, PowerShell 5.1 `Get-Content`/`Set-Content` without an
> explicit encoding reads a UTF-8 file as ANSI and silently corrupts every non-ASCII character
> (em dashes become `â€”`) — it happened on a real run. Rebuild `notes/coverage.md` with explicit
> UTF-8 reads and BOM-less UTF-8 writes (or use the Read/Edit/Write tools, which handle this), and
> re-read the result checking a line with an em dash before committing.

**Verify the sync before reporting done — by diffing, not by reading.**
The two files must match bullet for bullet, with only the heading levels differing (`#` → `##`,
`##` → `###`). **Do not verify this by reading the two side by side.** A single missing bullet in a
40-item section is invisible to the eye and survives every "I compared them" claim; run the
comparison mechanically instead, and read only to resolve what the diff reports:

```
diff <(grep '^- ' {NOTES_PATH}coverage.md) \
     <(sed -n '/^## {TOPIC}$/,/^## /p' notes/coverage.md | grep '^- ')

diff <(grep '^## ' {NOTES_PATH}coverage.md | sed 's/^## //') \
     <(sed -n '/^## {TOPIC}$/,/^## /p' notes/coverage.md | grep '^### ' | sed 's/^### //')
```

Both must come back empty. Then check by eye the **one** thing a diff of bullets and headings cannot
see: that line 1 of the rebuilt section reads `## {TOPIC}` and not `### {TOPIC}` (the double-demotion
trap above), and that a line containing an em dash still renders as `—` and not `â€”` (the Windows
encoding trap above). If anything differs, fix `notes/coverage.md` now, before moving to Step 5.

> **Why this replaced "re-read the section side by side" (Security run, 2026-07-18).** That run
> discovered `notes/coverage.md` had been missing the *Broken access control (IDOR)* bullet for an
> unknown number of previous runs — the mirrored `### Common vulnerabilities` held 6 items against
> the topic file's 8. Every prior run had "verified the sync" by reading and passed it. The drift was
> caught the first time the check was run as a `diff`. Reading finds structural breakage; only a diff
> finds a single absent bullet.

> **On reading `notes/coverage.md` end-to-end: do not.** Step 1's verifiable-reads rule and Step 4a's
> "one grep, not a re-read" used to point in opposite directions for this file, and a real run had to
> resolve the contradiction by hand. The resolution: **the combined file is never read whole.** It is
> over 2000 lines and grows every run, so it is worked with by section map (`grep -n "^## "`), term
> greps, targeted `offset` range reads, and the diffs above. The `"N lines, read to EOF"` claim is
> required for **`{NOTES_PATH}coverage.md`** — the topic file, which every 4a angle must read whole —
> and is *not* claimed for `notes/coverage.md`. In the summary, state for the combined file what you
> actually did (`"section map + N term greps + ranges X–Y; Security section verified by diff"`).
> Never write "read to EOF" for a file you legitimately did not read to EOF.

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
| Size delta | [before → after, in lines and sections, plus the market analyst's posting-frequency signal for {TOPIC}] |
| Added to coverage | [list of new items] |
| Sections split / added | [structural changes, or "none"] |
| Structural check (Step 4) | [item counts verified per section; what the count forced, or "no splits needed"] |
| Cross-topic overlap (Step 4a) | [items dropped as owned by another topic — and confirm each was written to `_cross-topic-inbox.md` under that topic, or "none"] |
| Inbox consumed (Step 1) | [entries that were waiting under `## {TOPIC}`: N added, M discarded (with reason), all cleared — or "inbox empty"] |
| Cold review (Step 4b) | [N items reviewed; X defects reported, Y applied — and one line on any you rejected and why, or "not completed"] |
| Modified in coverage | [list of updated items — one line per change, or "none"] |
| Promoted from future-learning | [list or "none"] |
| Demoted to future-learning | [item — one-line reason it no longer belongs in coverage, or "none"] |
| Removed from future-learning | [item — one-line reason it was removed, or "none"] |
| Synced to notes/coverage.md | [yes — X bullets changed / no changes needed] |

If coverage.md did not exist before and was created from scratch, only show the
"Added to coverage" row grouped by section. Skip the promoted/demoted/modified/removed rows.
The "Synced to notes/coverage.md" row always appears, even when creating from scratch.

"Promoted from future-learning" = concept moved into coverage (now in scope).
"Removed from future-learning" = concept deleted entirely because it is no longer relevant
(wrong topic, outdated, or not needed anywhere — not just post-junior).

**"Size delta" is reported, never acted on.** Scope comes from the job — never from the notes, and
never from where {TOPIC} sits in Victor's study queue — so a large delta is *not* a reason to trim,
and this row must not turn into a self-imposed budget. It exists because the run is the only moment
that knows both numbers at once, and Victor is the one who decides what the growth means downstream
(the JavaScript run took a topic from 121 to 208 lines and 13 to 27 sections — every item defensible,
but ~200 concepts queued for `notes-audit` on a topic that is eighth in the study order, which is a
scheduling judgement only he can make). Report the before/after and the analyst's frequency signal
plainly, and leave the conclusion to him.

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

**If Step 4a wrote entries into `_cross-topic-inbox.md`, commit that file separately, right after the
coverage commit** — same safety check (status → add only the inbox file → status → commit), message
`docs: route <N> <owning-topic>-owned items from the {TOPIC} coverage run to the cross-topic inbox`.
The atomicity rule above ("only the coverage files, nothing else") and Step 4a's "write the entry
before you move on" used to contradict each other here — a real run (Architecture, 2026-07-18) had to
improvise this second commit because the `git add` list did not mention the inbox at all. Two commits
is the resolution: the coverage change and the routing are two logical changes.

Report the commit hashes in the final summary so Victor can see they landed.

### Final step — pipeline self-report

This prompt dispatches subagents, so it ends like every orchestrator: read
`notes/prompts/_pipeline-self-report.md` and execute it for this run. Because this folder is shared
with `coverage-audit-prompt.md`, write the report as `_last-run-report-coverage-prompt.md`, commit it
on its own, and print the five bullets in chat.
