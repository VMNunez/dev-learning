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

## Rules for ANGULAR projects

Read {PROJECT_PATH}/README.md and check every section against these rules.

**1. Title + one sentence**
Plain language, no tech words. Project number included.
- Bad: "A role-based HR app to learn route guards."
- Good: "My 6th learning project — HR portal where admins manage employees and leave requests."

**2. Why this project**
One paragraph, connected to reality. No forced consultancy mentions. No "built to practise X."
- Bad: "Built to practise Angular guards and interceptors."
- Good: "Most production Angular apps have protected routes — I built this to understand how they work in practice."

**3. Live demo**
Must have its own `## Live demo` heading. URL present and working.
Include test accounts if the app has auth (email + password, one per role).

**4. Screenshots**
Exactly four. Single column layout — never a 2×2 table (images compress badly on GitHub).
Bold caption above each screenshot. No captions below.

**5. Features**
5–6 bullets, written from the user's perspective. No technical terms.
- Bad: "Uses CanActivateFn to protect routes."
- Good: "Protected routes redirect unauthenticated users to the login page."

**6. Architecture decisions**
6–8 maximum. One line each. Format strictly: `[what you did] to [why it matters]`
- Bad: "Used coordinator pattern."
- Good: "Coordinator pattern to centralise page state and keep the table and filters independently reusable."

**7. Tradeoffs**
3–4 bullets. Format strictly: `[chose X] over [Y] — [reason]`
- Good: "localStorage over a real backend — the focus of this project was Angular patterns, not data persistence."

**8. Future improvements**
3 maximum. Realistic for the domain only. No AI features, no microservices.

**9. What I learned**
One bullet per concept, no explanations. Just the name or syntax.
Details belong in notes/ — not here.

**10. Tech stack**
Always a table. Never a bullet list.

**11. Project structure**
Folder tree with one-line explanation per folder.

**12. How to run**
One command per code block. Order: clone → cd → npm install → ng serve (or npm start).

---

## Rules for FULLSTACK projects

Read all three READMEs. They serve different audiences — never mix content between them.

| README | Location | Audience | Goal |
|--------|----------|----------|------|
| Global | `{PROJECT_PATH}/README.md` | Recruiter | Makes them want to talk to you |
| Backend | `{PROJECT_PATH}/backend/README.md` | Technical interviewer | Makes them trust your backend knowledge |
| Frontend | `{PROJECT_PATH}/frontend/README.md` | Technical interviewer | Makes them trust your Angular knowledge |

**Global README** — same 12 rules as Angular above, plus:
- One GIF showing the critical flow (e.g. login → submit entry → approval), max 5 MB
- How to run: `docker-compose up` when Docker is ready; `mvn + ng serve` before Docker exists
- Links at the end: "Full technical details: [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md)"

**Backend README** — must include these sections in this exact order:
1. API endpoints table — method, URL, role required, one-line description
2. Database schema — entity fields, types, constraints; one sentence per key design decision
3. Auth flow — numbered steps: login request → BCrypt check → JWT generated → filter validates → SecurityContextHolder
4. Security considerations — minimum four bullets: BCrypt hashing, JWT secret from env var, @PreAuthorize per role, @Valid + @RestControllerAdvice
5. Folder structure — annotated tree: controller / service / repository / model / dto / security
6. Key patterns — layered architecture, DTOs, GlobalExceptionHandler; one line each explaining why it was used
7. Tradeoffs — JWT vs sessions, soft delete vs hard delete; one line each
8. How to run alone — without Docker, for local development

**Frontend README** — must include these sections in this exact order:
1. Folder structure — one-line explanation per folder
2. State management — signals for local state, services for shared state, coordinator for page-level state
3. Key patterns — auth guard, HTTP interceptor, role-aware UI; one line each explaining why it was needed
4. Shared components — list with one-line reason why each is shared
5. Tradeoffs — Signals over NgRx and similar decisions; one line each
6. How to run alone — `ng serve`

---

## Quality rule

Before fixing anything, apply this test to every section:
"Does this section make the reader trust me more?"

If a section adds no trust — it is noise. Cut it or rewrite it until it earns its place.

---

## What to do with issues found

For every section that is missing: add it.
For every section that is present but wrong: describe the problem, then rewrite it in place.
Apply all fixes directly to the README files — do not just report the issues.

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
