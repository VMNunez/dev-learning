# New Project Planning Prompt

Use in a **separate conversation**. No configuration to fill in — paste the whole prompt into a new chat as it is.

Run this prompt when a full-stack project is complete and it is time to plan the next one. It reads your current progress and knowledge gaps, picks the best project from the ROADMAP.md candidates list, and writes a complete `PLANNING.md` that is ready to use on day one of the new project.

What it produces:

- A gap analysis: what concepts are still missing from your knowledge, filtered to what matters for junior interviews at Spanish consultancies
- A project choice with a justification: which candidate from ROADMAP.md best closes those gaps
- A complete `PLANNING.md` at `projects/0X-projectname/PLANNING.md` — so detailed that at the start of each session you only need to read this file to know exactly what to do

The `PLANNING.md` produced follows the format of `projects/07-timetrack/PLANNING.md`. Read that file before running this prompt to see the expected depth and style.

---

```
I want you to plan my next full-stack project and write a complete PLANNING.md for it.

Before starting, read CLAUDE.md at the root of the learning folder — it has my profile, tech
stack, teaching rules, and all project conventions. Do not skip this.

---

## Who I am

I am Victor, 31 years old, learning Angular + Java Spring Boot to get a junior developer job at
a Spanish consultancy (NTT Data, Capgemini, Indra) by August–September 2026. My stack is
Angular + Spring Boot + PostgreSQL + Docker. I learn concept by concept through real projects,
guided by Claude. The goal is not just to build something — it is to be able to explain every
line and every decision in an interview.

My completed projects:
- 01: to-do list — Angular fundamentals (components, signals, services, directives)
- 02: weather app — HttpClient, RxJS, forkJoin, API integration, environment files
- 03: expense tracker — reactive forms, routing, localStorage, smart/dumb pattern
- 04: meal finder — route params, ActivatedRoute, effect(), favourites
- 05: task manager — Angular Material, MatTable, MatDialog, coordinator pattern
- 06: HR portal — route guards, lazy loading, HTTP interceptors, role-based access
- 07: TimeTrack — full-stack: Spring Boot REST API, JWT auth, Spring Data JPA + Hibernate,
  PostgreSQL, Angular frontend, JUnit 5 + Mockito, Docker Compose

---

## Step 1 — Read the source files

Read these files in this order. They are the inputs to every decision this prompt makes.

1. `CLAUDE.md` — profile, tech stack, teaching rules, and how projects are structured.
   Focus on: "Current study progress", "Java/Spring Boot" section, "Testing rules".

2. `PROGRESS.md` — what has actually been learned. Read the full Spring Boot section and
   Angular section. These are the concepts that exist in Victor's head right now.

3. `notes/coverage.md` — the target: every concept Victor must know before applying.
   This is the master list. Every item not yet in PROGRESS.md is a gap.

4. `ROADMAP.md` — the career plan. Read:
   - Phase table (current phase, what is next)
   - "Project 08 candidate ideas" section
   - "What 'ready' means by September" gate list

5. `projects/07-timetrack/PLANNING.md` — the reference format. The PLANNING.md you
   will write must match its depth and structure exactly.

---

## Step 2 — Gap analysis

Compare `notes/coverage.md` against `PROGRESS.md` to find what is not yet learned.

**Filter the gaps to what matters.** Keep only concepts that:
- Appear in the Angular, Spring Boot, Java, Architecture, or SQL sections of coverage.md
- Are likely to come up in a junior interview at NTT Data, Capgemini, or Indra
- Can realistically be taught through a 2–4 week full-stack project

**Skip** concepts that are:
- Already in PROGRESS.md (learned)
- Post-junior scope (CQRS, microservices, Kubernetes, JVM tuning, zone.js internals)
- Theory-only (cannot be demonstrated through a project)

**Identify review concepts.** These are concepts that appear in PROGRESS.md but that the
new project should reinforce because:
- They were learned once but not used since (risk of forgetting)
- They are important enough for interviews that repetition is valuable
  (e.g. JWT flow, soft delete, coordinator pattern)

**Build two lists** and keep them for Step 5:
- New concepts: not yet in PROGRESS.md, will be learned for the first time
- Review concepts: already in PROGRESS.md, will be reinforced through the new project

---

## Step 3 — Choose the project

Read the candidate ideas in ROADMAP.md's "Project 08 candidate ideas" section.

For each candidate, count how many of the significant gaps from Step 2 it covers.

Choose the candidate that:
1. Covers the most significant gaps identified in Step 2
2. Is realistic in 2–4 weeks of full-time study (4 hours/day)
3. Is full-stack: Spring Boot + Angular + PostgreSQL (mandatory)
4. Has a domain a recruiter at NTT Data or Capgemini would immediately recognise as
   realistic enterprise work (not a toy app)
5. Includes meaningful business rules — not just CRUD (if every project is just CRUD,
   the portfolio is weak)
6. Introduces at least one JPA relationship or pattern NOT already practiced in project 07

If none of the candidates covers the most important gaps well, propose a new candidate
and explain why it fits better. Any new candidate must meet all five criteria above.

Write a one-paragraph justification for the chosen project:
- Why this project over the others
- Which specific gaps it closes
- What it will demonstrate to a recruiter or interviewer

---

## Step 4 — Design the project

This is the main step. Design every part of the project before writing anything.
Think through each subsection in order. Do not skip any.

### 4a — Domain and business rules

Choose a domain that:
- Is immediately recognisable to a Spanish consultancy interviewer (they work with enterprise clients)
- Has a realistic workflow — approval steps, role restrictions, state transitions
- Would make sense in a real company

Define all business rules. For every entity and action, ask:
- Who can do this? (role check)
- Under what conditions? (state check)
- What happens when something goes wrong? (validation)

If the domain has a natural state machine (e.g. Draft → Submitted → Approved), define it
explicitly. This is one of the most valuable patterns in a junior portfolio.

### 4b — Entities and data model

Design every entity with every field. For each field include:
- Field name
- Data type (Java type for the entity, SQL type for the column)
- Constraints (nullable, unique, default value)
- A short note explaining why this field exists

Define all relationships between entities:
- Which entity owns the foreign key?
- What is the fetch type and why?
- Is there cascade behaviour? Why or why not?

Design the seed data: what must exist before a user can log in and use the app?
Define a `data.sql` seed script for the first admin/manager account.

### 4c — REST API

Define every endpoint. For each one:
- HTTP method
- URL path (plural nouns, no verbs)
- Role required (which roles can call this)
- Description (one line — what it does and what it returns)
- Request body (if POST or PUT — which DTO fields)
- Query parameters (if any — name, type, optional/required, what it filters)
- Response (status code and body shape)

HTTP status code conventions to follow:
- 200: GET/PUT success with body
- 201: POST that creates a resource
- 204: DELETE with no body
- 400: validation error
- 401: missing or invalid token
- 403: authenticated but wrong role
- 404: resource not found
- 409: conflict (duplicate, business rule violation)

### 4d — Security design

Define:
- Which endpoints are public (no token required)
- Which endpoints require a valid JWT
- Which endpoints require a specific role (with `@PreAuthorize`)
- How the first admin account is created (data.sql seed — no public register endpoint)
- CORS: which origins are allowed

### 4e — Spring Boot folder structure

Write the complete folder tree for the backend. Include every file:
- controller/ — one file per resource
- service/ — one file per resource
- repository/ — one interface per entity
- model/ — entities and enums
- dto/request/ — one class per create/update operation
- dto/response/ — one class per resource response
- exception/ — GlobalExceptionHandler + custom exception classes
- security/ — JwtUtil, JwtFilter, SecurityConfig

One-line comment per file explaining what it does.

### 4f — Angular folder structure

Write the complete folder tree for the frontend. Include every file:
- core/guards/ — auth guard and any role guards
- core/interceptors/ — auth interceptor
- core/services/ — one service per backend resource
- pages/ — one folder per page/feature
- shared/components/ — reusable components used across multiple pages
- shared/models/ — TypeScript interfaces that mirror the backend DTOs

One-line comment per file explaining what it does.

Define the Angular routes:
- Path for each page
- Which guards protect each route
- Whether the page is employee-only, manager-only, or shared

### 4g — UI design

**Color palette:**
Define a complete color palette as a table:
- Role or status name
- Hex color
- Usage (where and why this color appears)

Choose colors that work well together and follow Material Design conventions.
The primary color and accent must be different from project 07 (indigo) to avoid all
projects looking the same.

**Material components used:**
Define which Angular Material components appear in the app and where.
For each component: component name → which page(s) use it.

**View-by-view wireframes:**
Write an ASCII wireframe for every page/view. Include:
- The page layout
- Key interactive elements (buttons, tables, filters, forms)
- Empty states ("No items yet — add your first one")
- Role-specific variations (if the same route shows different content per role)

Every page must have a wireframe — do not skip any.

### 4h — Angular Material component list

For every page, specify:
- The page name and route
- Which Material components appear on it
- What the smart component (page) does vs what the dumb child components do
- Which components open dialogs and what those dialogs contain

---

## Step 5 — Write PLANNING.md

Now write the PLANNING.md file at `projects/0X-projectname/PLANNING.md`.

Determine the correct project number from PROGRESS.md (last completed project + 1).
Choose a short, descriptive folder name: `0X-projectname` (e.g. `08-invoice-manager`).

**Required sections — in this exact order:**

### 1. Project title and one-line description

### 2. Why this project
3–4 bullets:
- What domain problem it solves
- What technical gaps it closes (reference the gap analysis)
- Why a recruiter at NTT Data or Capgemini would recognise it as real enterprise work
- What it adds that project 07 does not cover

### 3. New concepts
A table of every concept that will be learned for the first time in this project:

| Concept | Topic | Why this project teaches it |
|---------|-------|----------------------------|
| ...     | ...   | ...                         |

Only list concepts not yet in PROGRESS.md. Be specific — "pagination with Pageable" is a
concept; "Spring Boot" is not.

### 4. Review concepts
A table of concepts from PROGRESS.md that this project reinforces:

| Concept | Originally learned in | How this project uses it again |
|---------|-----------------------|-------------------------------|
| ...     | ...                   | ...                            |

Limit to 8–12 concepts that genuinely benefit from repetition.

### 5. Tech stack
A table: Layer | Technology | Notes

### 6. Architecture
Explain the architecture in plain language. Include an ASCII diagram showing the layers:
Browser → Angular → HTTP → Spring Boot (Controller → Service → Repository) → PostgreSQL.
Explain what is NOT classic MVC and why (same explanation style as project 07 PLANNING.md).

### 7. Entities
For each entity: a table of fields (field name | type | notes/constraints).
Then a Relationships section explaining all foreign keys and JPA annotations.

### 8. Business rules
All validation and access rules. If there is a state machine, include the ASCII diagram.
Every business rule must be explicit — not left to be discovered during development.

### 9. Seed data
The first admin/manager account data.sql content. Any other data that must exist at startup.

### 10. REST API
All endpoints. Group by resource (one section per controller).
Use the same format as project 07 PLANNING.md.

### 11. Spring Boot folder structure
The complete annotated folder tree (from Step 4e).

### 12. Angular folder structure
The complete annotated folder tree (from Step 4f).
Followed by the Angular routes table.

### 13. UI design
In this order:
1. Color palette table
2. Material components table
3. View-by-view wireframes (one ASCII wireframe per page)
4. Visual inspiration (2–3 real apps worth looking at for reference)

### 14. Progressive learning plan
List every step of the development plan. Each step must:
- Have a short title (e.g. "Step 3 — JWT auth and protected endpoints")
- List what is built in this step (2–4 bullet points)
- State which NEW concepts from Section 3 are introduced in this step
- State which REVIEW concepts from Section 4 are reinforced in this step
- Define a concrete "done" condition: a specific, testable outcome that confirms the step is
  complete (e.g. "Postman returns 401 for all endpoints except /api/auth/login" or
  "`ng serve` loads the entries page and shows a filtered list from the real API")

Steps must be in learning order — each step introduces one major concept at a time.
Do not group unrelated concepts into one step. A step that teaches pagination should not
also teach @ManyToMany — split them.

### 15. Key rule
One paragraph: what is the single most important thing to remember about this project.
(Same style as project 07 PLANNING.md — "A half-finished project with good architecture
decisions and real tests is better than..." etc.)

### 16. README structure
A table: README file | Audience | When to write it.
Follow the three-README system from CLAUDE.md (global README, backend README, frontend README).

Then for each README: list the planned sections (as in project 07 PLANNING.md).

### 17. Architecture decisions to document in the global README
6–8 one-line decisions. Format: `[what you did] to [why it matters]`

### 18. Tradeoffs to document in the global README
3–4 one-line tradeoffs. Format: `[option chosen] over [option rejected] — [reason]`

### 19. Future improvements
3 maximum. Domain-realistic only — no AI, no microservices. These go in the README.

---

## Step 6 — Update ROADMAP.md and PROGRESS.md

After writing PLANNING.md, make these two small updates:

**ROADMAP.md:**
In the "Project 08 candidate ideas" section (or whichever section lists candidates), mark
the chosen project as selected. Replace the existing bullet with:
`- **[Project Name]** ← selected — PLANNING.md written at projects/0X-projectname/PLANNING.md`

Leave the other candidates unchanged — they may be useful for project 09.

**PROGRESS.md:**
Add one row to the projects table for the new project:
`| 0X | [Project name] | [tech stack summary] | Not started 🔜 | — |`

---

## Step 7 — Report

Print a short summary:

**Project chosen:** [name] — [one sentence: what it is and why it was chosen]

**Gaps closed by this project:**
List the specific concepts from Step 2's gap analysis that this project addresses.

**Gaps NOT closed by this project:**
List important gaps that remain after this project. These become input for project 09.

**New concepts count:** X new concepts (listed in PLANNING.md Section 3)
**Review concepts count:** X concepts reinforced (listed in PLANNING.md Section 4)

**Step count:** X steps in the progressive learning plan

Then show the commit message:

```
git add projects/0X-projectname/PLANNING.md ROADMAP.md PROGRESS.md
```

```
git commit -m "docs: add PLANNING.md for project 0X [project-name] — closes [main gap], introduces [key new concept]"
```
```
