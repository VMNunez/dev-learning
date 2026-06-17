# README Review Prompt

Use in a **separate conversation**. Fill in the configuration block before pasting.

This prompt reviews and fixes the README(s) for a project. It is the single source of
rules for what a README must contain and how each section must be written.

Run it after finishing a project, after a big feature, or any time the README feels out of
date. Run it before `portfolio-ready-prompt` — that prompt assumes the README is already correct.

---

**How to use:**

1. Fill in `PROJECT_PATH` and `PROJECT_TYPE`
2. Paste the entire prompt into a new chat

---

````
## Configuration — edit only this block

PROJECT_PATH = [angular/01-todo-list | angular/02-weather-app | angular/03-expense-tracker | angular/04-meal-finder | angular/05-task-manager | angular/06-hr-portal | projects/07-timetrack]
PROJECT_TYPE = [angular | fullstack]

---

## Context

I am Victor, 31 years old. I am preparing for a junior developer job at Spanish IT consultancies
(NTT Data, Capgemini, Indra) by August 2026. My stack: Angular + Spring Boot + PostgreSQL.

Before starting, read CLAUDE.md — it has my full profile and learning objectives per project.

---

## Step 0 — Read PLANNING.md first

Before checking any README, read `{PROJECT_PATH}/PLANNING.md`.

Extract: the app concept, the learning objectives, and the key patterns listed in the plan.
Use this to check that the README reflects what was actually built and learned — not just
what sounded good to write.

---

## Quality filter — apply this to every section as you check it

Two lenses, applied together:

**Recruiter lens:** "Does this section make the reader want to talk to me?"
**Interviewer lens:** "Does this section prove I understand why I built it this way?"

If a section fails both lenses — it is noise. Cut it or rewrite it until it earns its place.
A section that only passes the recruiter lens but not the interviewer lens is not enough for
this portfolio — the goal is to get hired at a consultancy that asks technical questions.

---

## Apply PROJECT_TYPE

- If PROJECT_TYPE = angular → follow "Rules for ANGULAR projects" only. Skip "Rules for FULLSTACK projects".
- If PROJECT_TYPE = fullstack → follow "Rules for FULLSTACK projects" only. Skip "Rules for ANGULAR projects".
- All other sections apply to both types.

---

## Rules for ANGULAR projects

Read `{PROJECT_PATH}/README.md` and check every section against these rules.

**1. Title + one sentence**
Plain language, no tech words. Project number included. The sentence must say what the app
does and who uses it — not what the developer learned from it.
- Bad: "A role-based HR app to learn route guards."
- Good: "My 6th learning project — HR portal where admins manage employees and leave requests."

**2. Why this project**
One paragraph, connected to a real-world reason. No forced consultancy mentions.
Never say "built to practise X" — that explains what the developer wanted, not why the problem matters.
- Bad: "Built to practise Angular guards and interceptors."
- Good: "Most production Angular apps have protected routes — I built this to understand how they
  work in practice, before applying them in a real codebase."

**3. Live demo**
Must have its own `## Live demo` heading. URL must be present.
Include test accounts if the app has auth — one per role, format: `email / password`.
If no live demo exists: flag it as missing — do not skip the section.

**4. Screenshots**
Exactly four. Use plain markdown images stacked vertically — never a 2×2 table (images compress
badly on GitHub). Bold caption above each screenshot. No captions below.
If the project has fewer than four screenshots: flag each missing one as a placeholder with a note
like `*(screenshot — [screen name] — to be added)*`. Never silently skip this rule.

**5. Features**
5–6 bullets, written from the user's perspective. No technical terms in any bullet.
- Bad: "Uses CanActivateFn to protect routes."
- Good: "Protected routes redirect unauthenticated users to the login page."

**6. Architecture decisions**
Up to 8, minimum 3. One line each. Never pad — only decisions worth explaining.
Format strictly: `[what you chose] to [why it matters]`
- Bad: "Used coordinator pattern."
- Good: "Coordinator pattern to centralise page state and keep the table and filters independently reusable."

Each decision must pass the interview test: a technical interviewer must be able to ask
"why did you choose this?" and the line must already answer it. If the line only says what
was done but not why — rewrite it.

**7. Tradeoffs**
Minimum 3, maximum 4 bullets. Format strictly: `[X] over [Y] — [reason]`
- Good: "localStorage over a real backend — the focus of this project was Angular patterns, not data persistence."
- Good: "Functional guards over class-based guards — Angular v15+ convention, less boilerplate."

The reason must be a real decision, not a default. "Because it is simpler" is not a reason —
explain what you gave up and why that tradeoff made sense for this project.

**8. Future improvements**
3 maximum. Realistic for the domain — no AI features, no microservices, no blockchain.
Each one must be something that would genuinely improve the app for its users.

**9. What I learned**
One bullet per concept. Format strictly: `` `ConceptName` — one-line reminder of what it does
or why it matters ``
- Good: "- `CanActivateFn` — functional route guard; no class, no `@Injectable`"
- Good: "- `MatTableDataSource` — Material table with built-in sorting and filtering"
- Bad: "- Angular Material" (too vague — no value to a reader)
- Bad: "- `CanActivateFn` — A functional route guard is a guard written as a plain function instead
  of a class, introduced in Angular v15 as the recommended..." (too long — details belong in notes/)

Full explanations belong in `notes/` — not here. This section is a recall list, not a tutorial.
Cross-check this list against the learning objectives in PLANNING.md: any objective listed there
that is missing here must be added.

**10. Tech stack**
Always a table. Never a bullet list.
Columns: Layer | Technology. Include every layer that the project actually uses.

**11. Project structure**
Folder tree with one-line explanation per folder (or per file if the folder has only a few files
and the names are not self-explanatory).

**12. How to run**
One command per code block. Order: clone → cd → npm install → ng serve (or npm start).
If the project uses environment variables, add a step before `ng serve`:
"Copy `.env.example` to `.env` and fill in `API_KEY` (get it from [service name])."

---

## Rules for FULLSTACK projects

Read all three READMEs. They serve different audiences — never mix content between them.

| README | Location | Audience | Goal |
|--------|----------|----------|------|
| Global | `{PROJECT_PATH}/README.md` | Recruiter | Makes them want to talk to you |
| Backend | `{PROJECT_PATH}/backend/README.md` | Technical interviewer | Makes them trust your backend knowledge |
| Frontend | `{PROJECT_PATH}/frontend/README.md` | Technical interviewer | Makes them trust your Angular knowledge |

**Global README** — apply the same 12 rules as Angular above, plus these additions:
- One GIF showing the critical flow (login → submit entry → approval), max 5 MB.
  If Docker is not yet ready, this can be a placeholder. If the frontend exists, the GIF must exist.
- How to run: `docker-compose up` when Docker is ready; `mvn spring-boot:run` + `ng serve`
  in separate terminals before Docker exists.
- Final line: "Full technical details: [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md)"
  This line must always be present. Check that both paths resolve correctly.
- If the project has tests, add a Testing row to the Tech Stack table (e.g. `Testing | JUnit 5 + Mockito (backend)`).
  Recruiters and interviewers look for this signal — do not leave it out.

**Backend README** — must include these sections in this exact order:

1. **API endpoints table** — method, URL, role required, one-line description.
   Roles must be specific: EMPLOYEE, MANAGER, Public — never "All" or "Authenticated".
   If an endpoint is not yet implemented, include it in the table with role and description filled
   in — mark only the row with `*(planned)*` at the end of the description line, not the whole section.

2. **Database schema** — one table per entity. Fields: name, type, constraints, notes.
   After each table: one sentence explaining the key design decision for that entity
   (e.g. why soft delete, why a status enum instead of a boolean).

3. **Auth flow** — numbered steps showing the full request lifecycle:
   login request → BCrypt check → JWT generated → client sends token → JwtFilter validates →
   SecurityContextHolder → endpoint executes.
   Each step must be one sentence. No code blocks here — prose only.

4. **Security considerations** — minimum four bullets:
   BCrypt password hashing, JWT secret from environment variable (never committed),
   role-based endpoint protection with `@PreAuthorize`, input validation with `@Valid` + `@RestControllerAdvice`.

5. **Folder structure** — annotated tree showing every package:
   controller / service / repository / model / dto (request + response) / exception / security.
   One-line comment per folder explaining its responsibility.

6. **Key patterns** — one entry per pattern. Format: `[Pattern name] — [why it was used, not just what it does]`
   Must include: layered architecture, DTO boundary, GlobalExceptionHandler.
   Code snippets are allowed and encouraged here — the audience is a technical interviewer.

7. **Tradeoffs** — same format as Angular: `[X] over [Y] — [reason]`
   Must include at least: JWT vs sessions, soft delete vs hard delete.
   Each tradeoff must be answerable in a technical interview — "why JWT?" must have a real answer.

8. **How to run alone** — without Docker, for local development.
   Include: Java version required, how to set the DB_PASSWORD environment variable (IntelliJ path),
   database name to create in pgAdmin, how to start the app, and the base URL.
   If there is a seed account (e.g. first manager from data.sql), include the default credentials here.

9. **Tests** — list the services that have unit tests. One bullet per class:
   `ClassName` — one sentence describing what the test verifies.
   Include the test tool: JUnit 5 + Mockito. If no tests exist yet, mark this section as
   `*(planned)*`. Do not omit the section — tests are a differentiator for junior roles
   in Spanish consultancies.

**Frontend README** — must include these sections in this exact order:

1. **Folder structure** — one-line explanation per folder.

2. **State management** — explain the three-level pattern:
   signals for local component state, services for shared cross-component state,
   coordinator pattern for page-level orchestration. One sentence per level.

3. **Key patterns** — one entry per pattern. Format: `[Pattern name] — [why it was needed]`
   Must include: auth guard, HTTP interceptor, role-aware UI components.

4. **Shared components** — list each component in `shared/` with one-line reason why it is shared
   and not inside a specific feature folder.

5. **Tradeoffs** — same format as Angular: `[X] over [Y] — [reason]`
   Must include: Signals over NgRx (or explain why NgRx was chosen if used).

6. **How to run alone** — `ng serve` with the API URL pointing to the backend.
   If an environment variable is needed for the API base URL, include the step to set it.

---

## In-progress markers — cleanup rule

Before applying any fix, scan the README for:
- "coming soon"
- "to be added"
- "in progress"
- "Step X — coming soon"
- "Updated as each step is completed"
- Progress markers like `✓` or `(Step 3)` inline in section content

If the section the marker refers to is now complete: remove the marker and fill the section.
If the section is genuinely not yet built: leave one clean placeholder per section (e.g.
`*Coming soon — added when the Angular frontend is complete.*`). Never leave multiple
scattered "coming soon" fragments inside a single section.

For the top-level note "This README is updated after each step. Steps marked ✓ are complete." —
remove it entirely. It reads as a working note, not a portfolio README.

---

## What to do with issues found

For every section that is missing: add it.
For every section that is present but wrong: describe the problem in one line, then rewrite the section in place.
Apply all fixes directly to the README files — do not just report the issues.

Do not rewrite sections that are already correct. Only touch what needs to change.

---

## Final step — show the commit message

```
git add {PROJECT_PATH}/README.md
```

```
git commit -m "docs: update {PROJECT_PATH} README — [one line summary of main changes]"
```

For fullstack projects with multiple READMEs changed:

```
git add {PROJECT_PATH}/README.md {PROJECT_PATH}/backend/README.md {PROJECT_PATH}/frontend/README.md
```

```
git commit -m "docs: update {PROJECT_PATH} READMEs — [one line summary of main changes]"
```
````
