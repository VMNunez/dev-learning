# README standard — the shared contract

**Internal component. Not runnable.** This is the single source of truth for **what a project's
README(s) must contain and how each section must be written**. All pieces of the readme pipeline read it:

- `_readme-write-prompt.md` (the **author**) reads the rules for the one README it is writing.
- `_readme-review-prompt.md` (the **reviewer**) reads the same rules to audit that README.
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
backend/frontend README or in `notes/` — link to it, do not inline it. The backend/frontend READMEs may
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
   `[what you chose] to [why it matters]`. Two tests, and a line failing either is cut or merged:
   - **The interview test** — an interviewer asks "why?" and the line already answers. A line stating
     only what was chosen fails.
   - **The distinctness test** — no two decisions name the same choice. Two lines about one choice are
     merged into the stronger one, never both kept.
   - Never pad, and never cut a line that passes both tests to reach a number.
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
   list, not a tutorial (full explanations live in `notes/`). Cross-check against PLANNING.md's learning
   objectives; add any that are missing.
   - Good: "- `CanActivateFn` — functional route guard; no class, no `@Injectable`"
   - Bad: "- Angular Material" (too vague) · a multi-sentence definition (too long — belongs in notes/).
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
  not a gate. A README whose author→reviewer pair did not complete is excluded from the commit.
  Under `PROJECT_PATH = all` that is one such commit per project.
- **`readme-concept-add` — commits its own entry, in one atomic commit for that entry.** It uses the
  same 2026-08-01 permission, because one line added to an existing section is not
  a rewrite anyone needs to read first. Its unit is the concept, so a cross-tier concept — the global
  README *plus* the tier that implements it, per "Which README owns a concept" — is still one commit.
  The skill's own file owns the rest of its commit contract.
