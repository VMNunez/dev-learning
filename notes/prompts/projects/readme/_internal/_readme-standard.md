# README standard — the shared contract

**Internal component. Not runnable.** This is the single source of truth for **what a project's
README(s) must contain and how each section must be written**. All pieces of the readme pipeline read it:

- `_readme-write-prompt.md` (the **author**) reads the rules for the one README it is writing.
- `_readme-review-prompt.md` (the **reviewer**) reads the same rules to audit that README.
- `_readme-effect-prompt.md` (the **reader-effect judge**) reads the quality filter's two lenses, plus
  rule 9 on `global` — the one section whose failure is invisible bullet by bullet — plus, for each
  section it proposes a cut in, that section's own rule, which is what makes an `effect-only` label a
  checked claim rather than an assertion about an unread file (`REC-202`). Nothing else here: it judges
  whether the finished README lands on the reader it is written for, proposes cuts and additions, and
  **never edits a file**; the reviewer applies them.
- `readme-audit.md` (the **orchestrator**) reads the "which READMEs" logic and the commit rule.
- `readme-concept-add` (the **in-session skill**) reads "Which README owns a concept" plus the section
  format it routes to, and the granularity half of the commit rule, which binds it too.

**What founds the rules below.** `notes/prompts/projects/readme/_internal/_readme-evidence.md`, beside
this file, holds the quoted sources for them and an `## Assertions` table giving each rule's evidential
status, on the discipline its own header states. Consult it when a bar is questioned; no run prompt
reads it (`REC-193`, 2026-09-01).

## What the readme review is for

It reviews and fixes a project's README(s) so each one earns its place in a junior portfolio. Run it
after a project or a big feature, or whenever a README feels stale — and always **before**
`portfolio-audit` (that gate assumes the READMEs are already correct). It is a **write/fix** job: the
author and reviewer edit the README files directly, they do not just report.

**The quality filter below is applied twice, and the second reading is not the first one repeated.**
The author and the reviewer apply it **per section, with this whole rule set in hand** — which is the
only way they can apply it, and it means every section can clear its own rule while the finished page
still lands on nobody. So the run's last content step is the **reader-effect judge**: one per README,
handed the file whole and no checklist, wearing the audience *Two project formats* below gives that
target — recruiter for `global`, technical interviewer for the two tier READMEs.
It reads and proposes; the reviewer applies. That split is deliberate — a judge that edited would move
the bar on every run, and this file stays the authority.

This readme review is the project's **G5** gate — it runs after every High from G3/G4 (`review-audit`)
is fixed and committed, and before G7 (`portfolio-audit`), which reads the READMEs it produces. The gate
order and every trigger are owned by `_planning-standard.md` §23.

---

## Two project formats — which READMEs exist

- **Angular-only projects (01–06)** — one README: the **global** README at `{PROJECT_PATH}/README.md`.
- **Full-stack projects (07+)** — **three** READMEs, different audiences, never mix content between them:

| README (TARGET) | Location | Audience | Goal |
|-----------------|----------|----------|------|
| `global` | `{PROJECT_PATH}/README.md` | Recruiter | Makes them want to talk to you |
| `backend` | `{PROJECT_PATH}/backend/README.md` | Technical interviewer | Makes them trust your backend knowledge |
| `frontend` | `{PROJECT_PATH}/frontend/README.md` | Technical interviewer | Makes them trust your Angular knowledge |

Derive the type from the project number (01–06 Angular-only, 07+ full-stack); do not ask. Each README is one
**TARGET** (`global` / `backend` / `frontend`) — the author and reviewer work on one target at a time.

---

## Universal rules — apply to every README

**Read PLANNING.md first.** Extract the app concept, learning objectives, and key patterns. The README
must reflect what was actually built and learned — not what sounded good to write. **A section size
stated in a PLANNING.md is not a bar.** Plans written before 2026-09-01 restate caps this file has since
replaced with inclusion tests (`07-timetrack` §19 "6-8 maximum", §21 "max 3 bullets"); the sizes below
are this file's, and a count read out of a plan is ignored — never applied, never flagged as a conflict.

**In-progress marker scan.** Before checking sections, scan the README for: "coming soon", "to be
added", "in progress", "Step X — coming soon", "Updated as each step is completed", and inline progress
markers like `✓` or `(Step 3)`.
- If the section the marker refers to is now complete → remove the marker and fill the section.
- If it is genuinely not built yet → leave **one** clean placeholder per section (e.g.
  `*Coming soon — added when the Angular frontend is complete.*`), never multiple scattered fragments.
- Remove any top-level "This README is updated after each step…" note entirely — it reads as a working
  note, not a portfolio README.

**Quality filter — two lenses on every section:**
- **Recruiter lens:** "Does this section make the reader want to talk to me?"
- **Interviewer lens:** "Does this section prove I understand why I built it this way?"

A section that fails both is noise — cut or rewrite it. Passing only the recruiter lens is not enough:
the goal is a consultancy that asks technical questions. Never define basic terms — a README assumes a
developer reader.

**A third reader, and it is not human.** Before a recruiter opens the repository, a screen may
already have read it: many recruiting teams run tooling that parses GitHub profiles and repositories
as part of sourcing and screening. That reader gets no section of its own and no second voice — it
gets one inclusion test: **every claim this README makes is stated in this README's own text** — a
sentence, a bullet or a table cell — **and never only inside a visual.** A visual may be the best
place a thing is *shown*; it may never be the only place it is *stated* — a technology named only in
a screenshot caption, a role difference visible only inside a GIF, an app whose what-it-does lives
only in the demo image. Each of those is fixed in the section that owns the claim — Tech stack for a
technology, Features for a behaviour, the title sentence for what the app does — and on a full-stack
project *Which README owns a concept* decides which README that section sits in. Never by touching
the visual. And this rule licenses nothing beyond that test: it is not a reason to trim or shrink
visuals — the evidence for them is the stronger of the two and the machine side is *absent*, not
negative — nor a word or length budget of its own, the Length rule below being the recruiter's lens
and not this reader's, nor XML-style tagging.

*(Evidence: `_readme-evidence.md` → Assertions, "A README is read by an LLM as well as a human" — that
the reader exists is founded; everything about what it rewards is **reasoned**, carried from CV sources
and a library-docs paper, and marked as such here.)*

**Length — recruiter lens.** The global README is scanned in seconds; keep it tight enough that a
recruiter reaches "What I learned" without fatigue. When a section runs long, the depth belongs in the
backend/frontend README — link to it, do not inline it. On a single-README project there is no such
file and no second home: what runs long is **cut**, never relocated, and `notes/` is not a sink for
it — the two pipelines are independent, and a README rule may not spend the other one's file. The backend/frontend READMEs may
run deeper (their audience is a technical interviewer), but still no wall of prose where a table or a
short snippet says it better.

**Fix, don't just report.** Add every missing section, fix every present-but-wrong one directly in the
file. Do not rewrite sections that are already correct — only touch what needs to change. Record what
changed for the summary at the end.

**Source is not render — every rule about *arrangement* is a rule about blank lines.** A README is judged
on the page GitHub draws, and adjacent lines are **one block** unless a blank line — or a self-delimiting
block like a fence or a heading — separates them. Written adjacently the layout stops being the one the
rule asked for: a caption directly above its image joins that image's paragraph and is laid out *inline*,
landing beside it whenever the image is narrow enough to share the column (and otherwise merely losing
the gap); a sentence directly under the last row of a table is absorbed as another **row** of that table;
a folder tree written flush against the surrounding prose, outside a fenced block, collapses into a
single paragraph. So separate every caption, image, table, tree, multi-line list and the prose around
them with a blank line, and always fence a tree. This is the one class of rule an author can satisfy in
the *source* and still get wrong on the *page* — checking it means checking the blank lines, not the
order of the lines. Ten caption/image pairs shipped wrong across `01`–`06` under a rule that said only
"caption above each".

**Which README owns a concept.** On a full-stack project the tier a file changed in is a *hint*, not the
answer — the question is which reader needs the concept. Four outcomes:

- **A pattern or technical decision** (layered architecture, DTO boundary, transaction boundaries, a route
  guard, an HTTP interceptor, a role-aware component) → the tier README that implements it, section
  **Key patterns**.
- **A tradeoff** — X chosen, Y given up → that tier's **Tradeoffs**.
- **A concept that defines what the project is**, legible to a non-technical reader → the global README's
  **What I learned**.
- **A concept that crosses tiers** (an API contract, a shared error format) → the global README, plus one
  line in the tier that *implements* it. Never in both tiers.

Global + one tier is the only pair a single concept may appear in, and only when it passes the recruiter
lens on the global side and the interviewer lens on the tier side. Interviewer-lens-only means tier-only.

**`What I learned` is a global-README section.** The backend and frontend section lists below do not
include it, and it must never be created there — a tier concept goes to Key patterns or Tradeoffs.

---

## Global README rules — the 12 rules

Section order (Angular): **Title → Why this project → Live demo → Screenshots → Features → Architecture
decisions → Tradeoffs → Future improvements → What I learned → Tech stack → Project structure → How to
run.** Move any out-of-order section to its correct position.

**Rules 6, 7 and 8 are restated outside this file under a completeness promise, and the restatement is
diffed against them in the commit that touches either side.** `_planning-standard.md` §18 states that its
§19-§21 restate every test these three rules state, "so a plan review never has to open that file", and
the plan pipeline reads that copy alone: `_plan-write-prompt.md` writes §19-§21 from it,
`_plan-architecture-prompt.md` reads §20 in its slice, and `_plan-review-prompt.md` audits §19 and §21 in
its `whole-plan` scope and §20 in its `architecture` scope. No plan prompt opens this file, and one hop
further out `_readme-write-prompt.md` reads the resulting `PLANNING.md` on every run. **So a test or a
format string added, reworded or retired in rule 6, 7 or 8 is carried in the same commit** to §19-§21 and
to four copies inside this family, the last of them held in two places: **backend rule 7** below, which
restates global rule 7's test and its format, and **frontend rule 5**, which carries that format alone
and no test; `_readme-effect-prompt.md`, which restates rule 8's two inclusion tests, rule 6's three-test
count and the list of sections whose numbers became inclusion tests, in prose the judge applies wherever
its bounded read of the owning rule does not reach; and the enumeration of which rules are *worded* as
inclusion tests, carried identically by `readme-audit.md` and `_readme-review-prompt.md`, which is the
copy that rots when a rule of 6-8 stops being one. **The copy is kept rather than
dereferenced**, which the doctrine's first instruction would prefer, because §18's reason is a plan
review's read budget and `REC-201` repaired the copy rather than deleting it. Nothing announces this drift
on its own: a copy stays internally coherent and its readers never open this file, which is why `REC-201`
found three of these tests missing and two nominal only once someone counted them clause by clause.

1. **Title + one sentence** — plain language, no tech words, project number included. Says what the app
   does and who uses it, not what the developer learned.
   - Bad: "A role-based HR app to learn route guards." · Good: "My 6th learning project — HR portal
     where admins manage employees and leave requests."
2. **Why this project** — one paragraph, a real-world reason. Never "built to practise X".
   - Good: "Most production Angular apps have protected routes — I built this to understand how they
     work in practice, before applying them in a real codebase."
3. **Live demo** — own `## Live demo` heading, URL present, test accounts if it has auth (`email /
   password`, one per role). If none exists, flag it as missing — do not skip the section.
4. **Screenshots** — optimal count for the project (no fixed number); read PLANNING.md + Features to
   find the essential screens. Plain markdown images stacked vertically (never a 2×2 table — GitHub
   compresses them badly), bold caption above each, none below, **each its own paragraph** — a blank
   line between a caption and its image and between one image and the next, per *Source is not render*
   above. First output a **Visual brief** (one line per screenshot: "Screenshot — [screen]: show
   [what must be visible]"), then a placeholder for each not-yet-captured visual:
   `*(screenshot — [screen name] — to be added)*`. Never skip silently.
   - **A screen, not a state.** Count *distinct screens*, not variants of one — a filter applied, an
     empty list or a validation error on the same view is a state, and a single-screen app is legitimately
     done with one screenshot. Never add a placeholder for a state of a screen already shown; if the
     README carries none for it, that is the correct count, not a gap to fill.
5. **Features** — optimal count for the project (no fixed number), from the user's perspective, no
   technical terms.
   - **A behaviour, not a capability.** One bullet per behaviour a user can see happen. A bullet naming
     a library, a layer or an internal quality ("clean architecture", "uses Angular Material") names no
     behaviour and fails; two bullets describing the same behaviour at different granularity are one.
     A project with four user-visible behaviours is legitimately done with four bullets. A quality the
     user *experiences across every screen* — responsive layout, offline persistence — is a behaviour
     and passes as one bullet; it is the internal ones that fail.
   - Good: "Protected routes redirect unauthenticated users to the login page." · Good: "Responsive —
     works on mobile and desktop." · Bad: "Built with standalone components."
   - *(Evidence: `_readme-evidence.md` → Assertions, "Features — `5–6` bullets" — number unfounded, the
     user-perspective rule founded in kind.)*
6. **Architecture decisions** — optimal count for the project (no fixed number), one line each, format
   `[what you chose] to [why it matters]`. Three tests, and a line failing any of them is cut, merged or
   trimmed:
   - **The interview test** — an interviewer asks "why?" and the line already answers. A line stating
     only what was chosen fails.
   - **The distinctness test** — no two decisions name the same choice. Two lines about one choice are
     merged into the stronger one, never both kept.
   - **A decision line carrying mechanism prose is over-long.** The format is one line, `[what you
     chose] to [why it matters]`, and the *why* is a reason, not a walkthrough: "the signal is
     initialised from storage when the service is created and the effect re-runs whenever a signal it
     reads changes" is mechanism and does not belong here. **Mechanism lives downstairs**, in rule 9's
     recall line, which is the section written to carry it. A line that has grown three clauses is cut
     back to its reason; nothing is deleted, it moves.
   - Never pad, and never cut a line that passes all three tests to reach a number.
   - Good: "Coordinator pattern to centralise page state and keep the table and filters independently reusable."
   - *(Evidence: `_readme-evidence.md` → Assertions, "Architecture decisions — `3 to 8`" — number
     unfounded, the section founded.)*
7. **Tradeoffs** — optimal count for the project (no fixed number), format `[X] over [Y] — [reason]`.
   - **Something must actually have been given up.** `Y` is a real alternative that was available in
     this project, and the reason says what choosing `X` cost — "because it is simpler" is not a reason.
     A bullet with no `Y`, or whose `Y` was never an option here, is not a tradeoff: rewrite it, or move
     it to Architecture decisions where it belongs.
   - Good: "Functional guards over class-based guards — Angular v15+ convention, less boilerplate."
   - *(Evidence: `_readme-evidence.md` → Assertions, "Tradeoffs — `3 to 4` bullets" — unfounded, and the
     section itself is this repository's deliberate choice for an interview reader.)*
8. **Future improvements** — optimal count for the project (no fixed number), realistic for the domain
   (no AI, microservices, blockchain).
   - **A user would notice it.** Each item is a feature that makes the app more production-ready
     (pagination, email notifications, file export), never a developer learning goal ("learn RxJS
     operators", "refactor to standalone components") — which is cut whether the list has two items or six.
   - **A reader of *this* README would miss it.** The improvement's absence is something the app as
     described visibly lacks. An item that would be a fine idea for any app of any kind is not specific
     to this one and is cut — this is the clause that bounds an otherwise unbounded list of good ideas.
   - *(Evidence: `_readme-evidence.md` → Assertions, "Future improvements — `3 max`" — number unfounded,
     the section founded.)*
9. **What I learned** — one bullet per concept, format `` `ConceptName` — one-line reminder ``. A recall
   list, not a tutorial. Optimal count for the project (no fixed number): the section grows with the work,
   and what bounds it is the three tests below, never a number. Cross-check against PLANNING.md's learning
   objectives and add any that are missing — an **adder only**: a plan describes the project as planned,
   not the one its backlog produced, so it never decides what stays.
   - **Structure — full-stack projects only.** On `07+` this section carries two subsections,
     `### Backend` first and `### Frontend` second; on `01`–`06` the list is flat. They are `###`
     headings **inside** one `##` section, not sections of their own, so the section-order check does not
     read them as misplaced. The reason is measured: `07-timetrack`'s flat list reached 64 bullets,
     nearly all Spring, in the one section a recruiter scans in seconds. **A tier that is not built yet
     gets no empty heading**: while a project has only its backend, the section carries `### Backend`
     alone and gains `### Frontend` when there is something to put in it — the in-progress rule above
     governs an unbuilt tier, not this clause.
   - **Order — what the project exists to teach comes first.** Angular then TypeScript on `01`–`06`;
     `### Backend` before `### Frontend` on `07+`. HTML, CSS and accessibility bullets come last. **This
     is not a quota and not a removal test: nothing is cut for being HTML, it is ordered behind.** What
     founds each half differs, and both are on disk. *Backend before frontend* is
     `_job-market-evidence.md` → `## Synthesis` — Java ~13/14 and Spring Boot ~11/14, "the core of the
     target roles". *Framework internals before HTML/CSS* is **not** that frequency list, which puts
     HTML/CSS at ~5/14, level with TypeScript; it is `_shared-context.md` → `## Profile`, whose bet
     clause is that the junior pool is crowded with React and "the bet only pays off if I can show real
     understanding and real decisions". HTML and CSS are the baseline every candidate claims; the
     framework internals are the differentiator. *Worked example, on disk:*
     `projects/04-meal-finder/README.md` opens with a run of Angular bullets from `HttpClient` to
     `Location.back()` and closes with HTML and a11y. It is the calibration artefact, not a perfect
     specimen — its `[attr.x]` ARIA line sits ahead of its two TypeScript lines — and **an audit does not
     reorder a file to make it match more exactly than it does**; this rule fires on a section that
     leads with the wrong material, not on an adjacent pair.

   **The three tests run in this order, and the form test only over the survivors** — shaping a bullet the
   next filter will delete is wasted work.

   - **Duplication across the section boundary is NOT a defect, and no test here removes it.** A concept
     stated as a *decision* in `Architecture decisions` or `Tradeoffs` and again as a *recall line* here
     is one concept at **two altitudes**, not one told twice: the upper section is read once, by an
     interviewer looking for judgement, and this one is *scanned*, as an index of recall. The shared
     symbol is the index entry pointing at the decision. `02-weather-app` carries `forkJoin`,
     `takeUntilDestroyed` and its environment-files decision in both sections and is the artefact this
     section is calibrated against **for the cross-section repeat and for the bullet's form** — its three
     CSS-appearance bullets are what test 2 exists to cut, and that is not a contradiction.
     - **A `placement test` cutting exactly this lived here for part of 2026-09-02 (`REC-196`) and was
       retired the same day by `REC-200`. Do not reintroduce it in any form**, including as a narrower
       test over "the same reason" — that rescoping was drafted and failed its own acceptance test. The
       measurements are in `_readme-evidence.md` → Assertions, "What I learned"; what binds an applier is
       this paragraph. **What bounds this section are the three tests below.**
     - **Nothing moves between the sections either way.** A concept the sections above do *not* state
       stays here even when it carries a rejected alternative — promoting it would invent a project
       decision the author did not make, and what counts as a decision is rule 6's judgement. A decision
       line is likewise never demoted into this section to avoid a repeat. Each section is written to its
       own contract and the repeat is the point. **Known cost, accepted:** a genuine `[X] over [Y]`
       tradeoff already written into this section is **reported in the run's summary and left where it
       is**; no rule sweeps it back to Tradeoffs today.
   - **1 — One bullet per concept, not one per name.** Rule 5's granularity clause ("two bullets describing
     the same behaviour at different granularity are one"), applied to concepts: a concept spread over
     one bullet per annotation, per HTTP verb or per helper method is **one** bullet. Seven lines naming
     `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PathVariable` and `@RequestBody` separately are
     one line about the controller's request mapping. This is the test that reaches a section whose
     bullets duplicate nothing above — which is where a granularity defect hides in plain sight.
   - **2 — The behaviour test** — rule 5's *a behaviour, not a capability*, applied to a concept. A concept
     whose absence would change only how the app *looks*, and not what it *does*, is cut.
     **The line is the bullet's stated purpose, never the CSS property it uses.** `overflow: hidden`
     clipping a card's corners is looks; `overflow: hidden` inside `.visually-hidden`, whose stated
     purpose is keeping text in the accessibility tree, is behaviour — the same declaration, opposite
     verdicts, and the bullet's own sentence is what separates them. Anything whose reason is the
     accessibility tree, the keyboard or the focus order passes, whatever implements it: an accessible
     name, a focus ring that exists so keyboard entry is visible, a pressed state exposed to assistive
     technology. **And rule 5's own escape travels with the test derived from it: a quality the user
     experiences *across every screen* — responsive layout, offline persistence, reduced motion honoured
     — is a behaviour and passes.** That bound is rule 5's and is imported intact, not widened: a loading
     indicator is not *across every screen* and does not need this clause, because it is a behaviour a
     user watches happen under rule 5's ordinary test. A `transition`, a badge's position, a colour token
     whose stated reason is appearance are looks — and a bullet whose stated reason is something else
     again, neither the tree nor the eye, is judged by rule 9's other tests and not by this one. **A
     bullet that is half each is split or rewritten to its behavioural half**, never kept whole for the
     sake of the other.
   - **3 — The form test.** **One line, and one sentence.** A bullet is `` `Symbol` — reminder ``: the em
     dash, then a single statement that ends where the line ends. This promotes the format at the head of
     this rule into something that rejects — until 2026-09-02 the only thing refusing a malformed bullet
     was the *Bad* list's "a multi-sentence definition (too long)", which no enumerated test applied.
     - **It bounds the sentence, not the vocabulary.** It is neither a ban on commas nor a rule that a
       bullet may name only one symbol. This rule's own *Good* example,
       `` `CanActivateFn` — functional route guard; no class, no `@Injectable` ``, carries a semicolon and
       two commas; `` - `signal()` and `computed()` — reactive state and derived values `` names two
       symbols inside one statement about one idea. **Both pass**, and a draft of this test that rejected
       them was withdrawn on 2026-09-02 for rejecting the artefacts this section is calibrated against.
     - **What it rejects** is the shape it was written for: a bullet that runs to a second sentence, or
       chains clauses until the line stops being scannable. Seven concepts compressed into one
       comma-chained paragraph cleared every other rule of this section and read worse than the seven
       lines it replaced. Where a bullet will not shorten to one sentence, that is usually test 1 telling
       you it is holding more than one concept.
   - **What may be added here as a further test, and what may not.** Only a test the agent applying this
     standard can answer from the repository in front of it. A criterion resting on what the author
     *remembers* — whether he would survive the follow-up question — names no applier: the agent running
     this file cannot know it, so the test is either never applied or invented. All three tests above are
     answerable from the README's own text, which is what makes them enforceable at the gate. **And a
     test proposed here is verified before it is written**, the `REC-191` way: apply it by hand to an
     artefact the current rules approve — nothing they approve may newly fail — and to one they have
     never audited, where something must be rejectable. Both halves have failed here inside a fix, in
     one day: a placement test that cut the approved artefact, and a form test that rejected it.
   - Good: "- `CanActivateFn` — functional route guard; no class, no `@Injectable`"
   - Bad: "- Angular Material" (too vague) · a multi-sentence definition, or clauses chained until the
     line stops being scannable (form) · "- `overflow: hidden` on a card — clips image corners"
     (behaviour) · `` - `@PathVariable` — reads a dynamic URL segment `` sitting beside
     `` - `@RequestBody` — converts JSON into the DTO `` and five more of the same shape (granularity —
     one line about the controller's request mapping). **Not bad:** a bullet naming a concept
     `Architecture decisions` also names — that is the two-altitude repeat this section is built on.
   - *(Evidence: `_readme-evidence.md` → Assertions, "What I learned" — the **section** is founded by
     soltech's "Lessons learned during development" and "What the developer learned during the process";
     the three tests are this file's own, extended from rules 6 and 5, and none carries a number. The
     ordering rule is founded separately and in two halves, as its own paragraph above states.)*
10. **Tech stack** — always a table (never a bullet list). Columns: Layer | Technology. Every layer the
    project actually uses.
11. **Project structure** — folder tree **in a fenced code block**, one-line explanation per folder (or
    per file when a folder has few files with non-obvious names).
12. **How to run** — one command per code block, order: clone → cd → npm install → ng serve (or npm
    start). If it uses env vars, add a step before `ng serve`: "Copy `.env.example` to `.env` and fill
    in `API_KEY` (get it from [service])."

### Full-stack global README — same 12 rules, plus these changes
Section order: **Title → Why this project → How to run (replaces Live demo) → Screenshots → Features →
Architecture decisions → Tradeoffs → Future improvements → What I learned → Tech stack → Project
structure → Backend and frontend details.**
- **Rule 3 (Live demo) is replaced** — full-stack projects here are local-only (no live URL). Put a
  short "How to run" note (`docker-compose up` when Docker is ready; `mvn spring-boot:run` + `ng serve`
  in separate terminals before Docker) and point to the How to run section. Do not flag it as missing.
- **Rule 12 (How to run)** content: `docker-compose up` when Docker is ready; `mvn spring-boot:run` +
  `ng serve` in separate terminals before Docker. Do not apply the Angular rule 12 here.
- **Visuals** — optimal mix of GIFs and screenshots (no fixed count). GIFs for multi-step interactions,
  screenshots for dashboards/forms/empty states/role differences. Stacked vertically, GIFs before
  screenshots, max 5 MB per GIF — and the blank lines of *Source is not render* are what make them
  stacked. If the frontend is not built, leave placeholders for all visuals.
  First output a **Visual brief** (one line per GIF: "GIF — [name]: show [step 1] → [step 2] → [step
  3]"; one line per screenshot).
- **Final line:** "Full technical details: [backend/README.md](backend/README.md) and
  [frontend/README.md](frontend/README.md)" — always present; check both paths resolve.
- **Testing row:** if the project has tests, add one to the Tech Stack table (e.g. `Testing | JUnit 5 +
  Mockito (backend)`) — recruiters look for this signal.

---

## Backend README rules (full-stack only) — sections in this exact order

1. **API endpoints table** — method, URL, role required, one-line description. Roles specific (EMPLOYEE,
   MANAGER, Public — never "All"/"Authenticated"). A not-yet-implemented endpoint stays in the table
   with role + description, only its row marked `*(planned)*` — not the whole section.
2. **Database schema** — one table per entity (name, type, constraints, notes); after each, one sentence
   on its key design decision (why soft delete, why a status enum vs a boolean) — **blank line first**,
   or GFM absorbs that sentence as one more row of the table it follows.
3. **Auth flow** — numbered steps of the full request lifecycle: login → BCrypt check → JWT generated →
   client sends token → JwtFilter validates → SecurityContextHolder → endpoint executes. One sentence
   per step, prose only, no code blocks.
4. **Security considerations** — one bullet per measure **actually in the code**, optimal count for the
   project (no fixed number). Where to look: password hashing, secret management (no committed
   credentials), authorization enforcement, input validation + error handling.
   - **The test runs in both directions.** Nothing that is in the code is missing from the list, and
     nothing in the list is absent from the code — a bullet that cannot be pointed at a file fails. A
     project with three real measures is legitimately done with three bullets.
   - *(Evidence: `_readme-evidence.md` → Assertions, "Backend Security considerations — `≥4` bullets" —
     unfounded, and a floor is precisely what forces padding.)*
5. **Folder structure** — annotated tree of every package (controller / service / repository / model /
   dto request+response / exception / security), **fenced**, one-line comment per folder.
6. **Key patterns** — one entry per pattern, format `[Pattern] — [why used, not just what]`. Must
   include: layered architecture, DTO boundary, GlobalExceptionHandler. Code snippets encouraged (the
   audience is a technical interviewer).
7. **Tradeoffs** — format `[X] over [Y] — [reason]`, the ones that are genuinely important for this
   project (no fixed number). Same test as global rule 7: `Y` is a real alternative that was available
   here and the reason says what was given up, each answerable in an interview ("because it is simpler"
   is not a reason).
   - *(Evidence: `_readme-evidence.md` → Assertions, "Backend Tradeoffs — the 3 most important" —
     unfounded.)*
8. **How to run alone** — without Docker: Java version, how to set `DB_PASSWORD` (IntelliJ path), the DB
   name to create in pgAdmin, how to start, the base URL. Include seed credentials if `data.sql` seeds
   a first account.
9. **Tests** — the services with unit tests, one bullet per class (`ClassName` — one sentence on what
   the test verifies). Tool: JUnit 5 + Mockito. If none yet, mark `*(planned)*` — never omit the
   section (tests differentiate junior candidates at Spanish consultancies).

---

## Frontend README rules (full-stack only) — sections in this exact order

1. **Folder structure** — fenced tree, one-line explanation per folder.
2. **State management** — the three-level pattern: signals for local component state, services for
   shared cross-component state, coordinator pattern for page-level orchestration. One sentence per level.
3. **Key patterns** — one entry per pattern, format `[Pattern] — [why needed]`. Must include: auth
   guard, HTTP interceptor, role-aware UI components.
4. **Shared components** — each component in `shared/` with a one-line reason it is shared and not inside
   a feature folder.
5. **Tradeoffs** — format `[X] over [Y] — [reason]`. Must include: Signals over NgRx (or why NgRx if used).
6. **How to run alone** — `ng serve` with the API URL pointing to the backend; include the step to set
   an env var if the API base URL needs one.
7. **Tests** — services with unit tests, one bullet per class. Tool: Jasmine + TestBed. If none yet,
   mark `*(planned)*` — never omit.

---

## Summary + commit rule

After fixing, the pieces record a **summary of changes** — one line per section changed:
`[Section name] — what was wrong → what was fixed`, so Victor can review before committing.

**One granularity rule, and it binds both writers of a project README: the unit is the change, never the
file.** A README commit covers every README that one piece of work touched — **never one commit per
README**, and never `git add` on all three by default. State it in both directions, because it has been
misread in both. Who runs that commit differs, and only that:

- **`readme-audit.md` — auto-committed, one commit for the project** (authorized 2026-08-29, reversing
  the earlier hand-over rule: Victor does not want to run this commit by hand). It uses the same
  `_session-rules.md` permission (authorized 2026-08-01). The orchestrator stages one `git add` per
  README that actually changed and runs **one** `git commit`:
  `docs: update {PROJECT_PATH} README(s) — [one-line summary]`, whose plural is the tell that a single
  command covers the set. The summary of changes above is still printed — it is now a review record,
  not a gate. A README whose author→reviewer pair did not complete is excluded from the commit. **The
  reader-effect judge is not part of that pair and never excludes a README**: it is advisory, so a run
  whose judge failed twice commits the README on the author and reviewer's work and says so in the
  summary — the pair is what the commit rests on. The same holds for the **re-dispatch that applies**
  the judge's items: it runs after the pair completed, so its own failure excludes nothing either, and
  the file is committed part-applied with that stated in the commit message and the summary.
  Under `PROJECT_PATH = all` that is one such commit per project.
- **`readme-concept-add` — commits its own entry, in one atomic commit for that entry.** It uses the
  same 2026-08-01 permission, because one line added to an existing section is not
  a rewrite anyone needs to read first. Its unit is the concept, so a cross-tier concept — the global
  README *plus* the tier that implements it, per "Which README owns a concept" — is still one commit.
  The skill's own file owns the rest of its commit contract.
