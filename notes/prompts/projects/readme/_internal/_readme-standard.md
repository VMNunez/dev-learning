# README standard — the shared contract

**Internal component. Not runnable.** This is the single source of truth for **what a project's
README(s) must contain and how each section must be written**. All pieces of the readme pipeline read it:

- `_readme-write-prompt.md` (the **author**) reads the rules for the one README it is writing.
- `_readme-review-prompt.md` (the **reviewer**) reads the same rules to audit that README.
- `readme-audit.md` (the **orchestrator**) reads the "which READMEs" logic and the commit rule.

## What the readme review is for

It reviews and fixes a project's README(s) so each one earns its place in a junior portfolio. Run it
after a project or a big feature, or whenever a README feels stale — and always **before**
`portfolio-audit` (that gate assumes the READMEs are already correct). It is a **write/fix** job: the
author and reviewer edit the README files directly, they do not just report.

Chain: `plan-audit` → build → **this readme review** → `review-audit` → `portfolio-audit`.

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
must reflect what was actually built and learned — not what sounded good to write.

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

**Length — recruiter lens.** The global README is scanned in seconds; keep it tight enough that a
recruiter reaches "What I learned" without fatigue. When a section runs long, the depth belongs in the
backend/frontend README or in `notes/` — link to it, do not inline it. The backend/frontend READMEs may
run deeper (their audience is a technical interviewer), but still no wall of prose where a table or a
short snippet says it better.

**Fix, don't just report.** Add every missing section, fix every present-but-wrong one directly in the
file. Do not rewrite sections that are already correct — only touch what needs to change. Record what
changed for the summary at the end.

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
   compresses them badly), bold caption above each, none below. First output a **Visual brief** (one
   line per screenshot: "Screenshot — [screen]: show [what must be visible]"), then a placeholder for
   each not-yet-captured visual: `*(screenshot — [screen name] — to be added)*`. Never skip silently.
5. **Features** — 5–6 bullets from the user's perspective, no technical terms.
   - Good: "Protected routes redirect unauthenticated users to the login page."
6. **Architecture decisions** — 3 to 8, one line each, format `[what you chose] to [why it matters]`.
   Each must pass the interview test (an interviewer asks "why?" and the line already answers). Never pad.
   - Good: "Coordinator pattern to centralise page state and keep the table and filters independently reusable."
7. **Tradeoffs** — 3 to 4 bullets, format `[X] over [Y] — [reason]`. The reason is a real decision, not
   a default ("because it is simpler" is not a reason — say what you gave up and why it made sense).
   - Good: "Functional guards over class-based guards — Angular v15+ convention, less boilerplate."
8. **Future improvements** — 3 max, realistic for the domain (no AI, microservices, blockchain). Each a
   feature that makes the app more production-ready (pagination, email notifications, file export), not
   a developer learning goal.
9. **What I learned** — one bullet per concept, format `` `ConceptName` — one-line reminder ``. A recall
   list, not a tutorial (full explanations live in `notes/`). Cross-check against PLANNING.md's learning
   objectives; add any that are missing.
   - Good: "- `CanActivateFn` — functional route guard; no class, no `@Injectable`"
   - Bad: "- Angular Material" (too vague) · a multi-sentence definition (too long — belongs in notes/).
10. **Tech stack** — always a table (never a bullet list). Columns: Layer | Technology. Every layer the
    project actually uses.
11. **Project structure** — folder tree, one-line explanation per folder (or per file when a folder has
    few files with non-obvious names).
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
  screenshots, max 5 MB per GIF. If the frontend is not built, leave placeholders for all visuals.
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
   on its key design decision (why soft delete, why a status enum vs a boolean).
3. **Auth flow** — numbered steps of the full request lifecycle: login → BCrypt check → JWT generated →
   client sends token → JwtFilter validates → SecurityContextHolder → endpoint executes. One sentence
   per step, prose only, no code blocks.
4. **Security considerations** — ≥4 bullets covering every measure actually in the code: password
   hashing, secret management (no committed credentials), authorization enforcement, input validation +
   error handling. Only list what is really there.
5. **Folder structure** — annotated tree of every package (controller / service / repository / model /
   dto request+response / exception / security), one-line comment per folder.
6. **Key patterns** — one entry per pattern, format `[Pattern] — [why used, not just what]`. Must
   include: layered architecture, DTO boundary, GlobalExceptionHandler. Code snippets encouraged (the
   audience is a technical interviewer).
7. **Tradeoffs** — format `[X] over [Y] — [reason]`, the 3 most important for this project; each
   answerable in an interview ("because it is simpler" is not a reason).
8. **How to run alone** — without Docker: Java version, how to set `DB_PASSWORD` (IntelliJ path), the DB
   name to create in pgAdmin, how to start, the base URL. Include seed credentials if `data.sql` seeds
   a first account.
9. **Tests** — the services with unit tests, one bullet per class (`ClassName` — one sentence on what
   the test verifies). Tool: JUnit 5 + Mockito. If none yet, mark `*(planned)*` — never omit the
   section (tests differentiate junior candidates at Spanish consultancies).

---

## Frontend README rules (full-stack only) — sections in this exact order

1. **Folder structure** — one-line explanation per folder.
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

**Not auto-committed — by design.** README.md lives in the project folder and follows the project's
**feature-branch → PR → main** workflow (it is not a study file on main). The orchestrator writes the
fixes to the working tree and **hands Victor the commit command** — one per README actually changed, not
all three by default. Commit message: `docs: update {PROJECT_PATH} README(s) — [one-line summary]`.
