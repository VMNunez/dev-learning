# Project Planning Prompt

Use in a **separate conversation**. Fill in the two values in the configuration block, then paste everything into a new chat.

Two modes:

- **`new`** — use when a project is complete and it is time to plan the next one. Reads your progress and knowledge gaps, picks the best next project from ROADMAP.md, and writes a complete PLANNING.md ready to use on day one.
- **`review`** — use at the start of a session, or any time the existing plan feels unclear or out of date. Points at an existing PLANNING.md and audits every section for missing content, vague done conditions, and internal inconsistencies. Audits **one project** when `PROJECT` is a folder name, or **every project in one run** when `PROJECT = all` (see the Batch targets note in the configuration block).

> **▶ Run first:** `progress-update` — `new` mode's gap analysis reads `PROGRESS.md`; if it is stale it picks the wrong next project. (`review` mode has no prerequisite.)

**How to use:**
1. Fill in `MODE` — `new` or `review`
2. Fill in `PROJECT`:
   - `new` mode: leave blank — the prompt auto-detects the next project from PROGRESS.md
   - `review` mode: write the project folder name (e.g. `07-timetrack`) to audit a single project,
     or `all` to audit every project in turn
3. Paste the entire prompt below into a new chat

What `new` mode produces:
- A gap analysis filtered to what matters for junior interviews at Spanish consultancies
- A project choice with a written justification
- A complete PLANNING.md — so detailed that at the start of each session you only need to read one section to know exactly what to do next

What `review` mode produces:
- A section-by-section audit of the existing PLANNING.md
- Specific problems: missing sections, vague done conditions, thin entity definitions, mismatches between sections
- Proposed rewrites for every section that needs improvement

---

````
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

MODE    = [new | review]
PROJECT = [blank when MODE=new | folder name OR all when MODE=review, e.g. 07-timetrack | all]

Use MODE and PROJECT wherever the prompt refers to {MODE} and {PROJECT}.

## Batch targets (MODE = review only)
## PROJECT = all runs the audit on every project in turn — see notes/prompts/_batch-mode.md.
## Order: angular/01-todo-list, angular/02-weather-app, angular/03-expense-tracker,
## angular/04-meal-finder, angular/05-task-manager, angular/06-hr-portal, projects/07-timetrack.
## The section set is derived per project type — do not ask:
##   - full-stack projects (07+): audit against the full 23-section template (Steps B–F below).
##   - angular projects (01–06): they use a simpler PLANNING.md, so do NOT flag the full-stack-only
##     sections as missing. Audit only the sections they actually have, plus the universal checks:
##     done-condition format in the learning plan (Step D), vague rules / TBD placeholders,
##     and internal consistency between the sections that are present (Step E).

---

## Context

My profile and projects are in `notes/prompts/_shared-context.md`. The goal is not just to
build something — it is to be able to explain every line and every decision in an interview.

---

<!-- ============================================================ -->
<!-- BRANCH A — run these steps only when MODE = new             -->
<!-- ============================================================ -->

## MODE = new — Plan the next project

---

## Step 1 — Read the source files

Read these files in this order. They are the inputs to every decision this prompt makes.

1. `CLAUDE.md` — profile, tech stack, teaching rules, and how projects are structured.
   Focus on: "Current study progress", "Java/Spring Boot" section, "Testing rules".

2. `PROGRESS.md` — the master record of every project completed and every concept learned.
   All Angular projects (01–06), full-stack projects (07–), SQL exercises, and CSS practice
   are summarised here. This is the single source of truth — do not infer project history
   from CLAUDE.md or ROADMAP.md alone. Read the full Angular, Spring Boot, and SQL sections.

3. `notes/coverage.md` — the target: every concept Victor must know before applying.
   This is the master list. Every item not yet in PROGRESS.md is a gap.

4. `ROADMAP.md` — the career plan. Read:
   - Phase table (current phase, what is next)
   - Candidate project ideas section for the next project
   - "What 'ready' means" gate list

5. The last completed project's PLANNING.md — check PROGRESS.md for the project number,
   then read `projects/0X-projectname/PLANNING.md`. This is the reference format. The
   PLANNING.md you will write must match its depth and structure exactly.

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

**Identify review concepts.** These are concepts already in PROGRESS.md that the new project
should reinforce because:
- They were learned once but not used since (risk of forgetting)
- They are important enough for interviews that repetition is valuable
  (e.g. JWT flow, soft delete, coordinator pattern)

**Build two lists** and keep them for Step 5:
- New concepts: not yet in PROGRESS.md, will be learned for the first time
- Review concepts: already in PROGRESS.md, will be reinforced through the new project

---

## Step 3 — Choose the project

Read the candidate ideas section in ROADMAP.md for the next project.

For each candidate, count how many of the significant gaps from Step 2 it covers.

Choose the candidate that:
1. Covers the most significant gaps identified in Step 2
2. Is realistic in 2–4 weeks of full-time study (4 hours/day)
3. Is full-stack: Spring Boot + Angular + PostgreSQL (mandatory)
4. Has a domain a recruiter at NTT Data or Capgemini would immediately recognise as
   realistic enterprise work (not a toy app)
5. Includes meaningful business rules — not just CRUD (if every project is just CRUD,
   the portfolio is weak)
6. Introduces at least one JPA relationship or pattern NOT already practiced in the
   previous project

If none of the candidates covers the most important gaps well, propose a new candidate
and explain why it fits better. Any new candidate must meet all criteria above.

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
- Is immediately recognisable to a Spanish consultancy interviewer (they work with
  enterprise clients)
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

**Endpoint access rules:**
- Which endpoints are public (no token required)
- Which endpoints require a valid JWT
- Which endpoints require a specific role (with `@PreAuthorize`)
- How the first admin account is created (data.sql seed — no public register endpoint)
- CORS: which origins are allowed

**Input validation strategy:**
- Which DTO fields need `@NotBlank`, `@NotNull`, `@Positive`, or other annotations
- Validation runs at the DTO level (request DTOs only), never on entities
- What the validation error response looks like (field name + message)

**GlobalExceptionHandler design:**
- Which custom exception classes exist and what each one represents
- Which exception maps to which HTTP status code (400 validation, 401 auth, 403 role,
  404 not found, 409 conflict/business rule)
- Response body format: `{ "error": "message" }` used consistently for all error responses

**JWT configuration:**
- Token expiration time and the reason for it
- JWT secret must be loaded from an environment variable (`${JWT_SECRET}`) — never
  hardcoded in `application.properties`
- Which claims are included in the payload (sub, role, iat, exp) and why each one is there

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
The primary color and accent must be different from the previous project to avoid all
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

### 4i — Professional implementation order

Before writing Section 15, define the order in which the project will be built.
Every full-stack project must follow this sequence. Do not rearrange steps unless there
is a specific architectural reason — and if you do, explain why in the PLANNING.md.

**Required implementation sequence:**

1. **Project setup** — Spring Initializr + `ng new` + PostgreSQL database creation +
   git branch + Postman collection. This is always Step 1. No code until the environment
   runs. Done when: Spring Boot starts, Angular loads, database exists.
2. **Entity layer** — JPA entities, relationships, `@Column` constraints, enums, seed data.
3. **Repository layer** — `JpaRepository` interfaces and custom finder methods.
4. **Service layer** — all business logic methods; no security yet; use `Optional<T>` and
   throw custom exceptions for not-found and business rule violations.
5. **Controller layer** — REST endpoints, DTOs, `ResponseEntity`; no auth yet.
6. **Manual backend test without auth** — test every endpoint in Postman without a token.
   Every endpoint must return the correct status code and body before moving on.
7. **Security layer** — Spring Security config, JWT filter, `UserDetailsService`,
   `BCryptPasswordEncoder`, `@PreAuthorize`.
8. **Manual backend test with auth** — login → get JWT → test every endpoint with the
   correct token and role; test 401 (no token) and 403 (wrong role) cases explicitly.
9. **Frontend scaffolding** — Angular routing, TypeScript interfaces (mirroring backend
   DTOs), auth service, HTTP interceptor, route guards.
10. **Feature pages** — one page at a time, in dependency order: login page first, then
    the simplest resource, then more complex pages that depend on others.
11. **Backend tests** — JUnit 5 + Mockito; one step per service class; happy path and
    edge cases (entity not found, business rule violation, role violation).
12. **Angular tests** — services first (HttpClientTestingModule); components if project 08+.
13. **SQL complement** — write by hand in `sql/` the SQL that Hibernate generates for the
    main queries; links what the ORM does to the raw SQL already practiced daily.
14. **Docker** — `docker-compose.yml` with the database service; add the app image if time
    allows. This step is late by design — Docker wraps a working app, not a work in progress.
15. **README** — write all three READMEs (global, backend, frontend) after the project works.

The steps in Section 15 must map to this sequence. Each step in the learning plan should
be traceable to one or more items from this list. If two items are combined into one step,
explain why (e.g. "repository has no custom logic so it is combined with the entity step").

### 4j — Git branch strategy

Group the implementation steps from 4i into coherent feature branches — never one branch
per step. A branch should span a logical, self-contained chunk of work with a clear "done"
(e.g. all backend security steps together, all CRUD + workflow steps together, the whole
Angular frontend together). Opening a new branch for every single step creates PR noise
with no real isolation benefit; the goal is one branch per feature, not per commit.

For each branch, define:
- **Branch name** — follow the `feat/short-description` convention from CLAUDE.md
- **Covers** — which implementation steps from 4i (and which steps from Section 15 once
  written) it contains
- **Opens** — when it is created (immediately after the previous feature branch's PR merges,
  or at Step 1 for the first one)
- **Closes** — the concrete condition that means it is done and ready for a PR into the
  project branch (usually "after Step X's done condition passes")

The project branch itself (`technology/0X-project-name`) is created once, in Step 1, and
stays open for the whole project — it only merges into `main` when every step is done.
Do not plan a branch for it beyond that.

---

## Step 5 — Write PLANNING.md

Now write the PLANNING.md file at `projects/0X-projectname/PLANNING.md`.

Determine the correct project number from PROGRESS.md (last completed project + 1).
Choose a short, descriptive folder name: `0X-projectname` (e.g. `08-invoice-manager`).

**Required sections — in this exact order:**

### 0. Session quick reference

A living table — updated at the start of every session. Write it with dashes to start;
the first session will fill it in.

| | |
|---|---|
| **Current step** | — |
| **Done condition** | — |
| **Phase** | — |
| **Last updated** | — |

### 1. Project title and one-line description

### 2. Why this project
3–4 bullets:
- What domain problem it solves
- What technical gaps it closes (reference the gap analysis)
- Why a recruiter at NTT Data or Capgemini would recognise it as real enterprise work
- What it adds that the previous project does not cover

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
Explain what is NOT classic MVC and why.

Then identify which new architectural patterns this project introduces compared to the
previous one. For each new pattern: explain where it fits in the layer model and why it
is designed that way. If all patterns are the same as the previous project, say so
explicitly — do not invent gaps.

### 7. Entities
For each entity: a table of fields with columns — Field | Java type | SQL type | Constraints | Notes.
Then a Relationships section explaining all foreign keys and JPA annotations.

### 8. Business rules
All validation and access rules. If there is a state machine, include the ASCII diagram.
Every business rule must be explicit — not left to be discovered during development.

### 9. Seed data
The first admin/manager account data.sql content. Any other data that must exist at startup.

### 10. REST API
All endpoints. Group by resource (one section per controller).
Use the same format as the previous project's PLANNING.md.

### 11. Postman setup
- Collection name: `0X - ProjectName` (e.g. `08 - Invoice Manager`)
- Folders inside the collection: one folder per controller (e.g. `auth`, `invoices`)
- For each folder: list which endpoints it contains

### 12. Spring Boot folder structure
The complete annotated folder tree (from Step 4e).

### 13. Angular folder structure
The complete annotated folder tree (from Step 4f).
Followed by the Angular routes table.

### 14. UI design
In this order:
1. Color palette table
2. Material components table
3. View-by-view wireframes (one ASCII wireframe per page)
4. Visual inspiration (2–3 real apps worth looking at for reference)

### 15. Progressive learning plan

List every step of the development plan. Each step must:
- Have a short title (e.g. "Step 3 — JWT auth and protected endpoints")
- List what is built in this step (2–4 bullet points)
- State which NEW concepts from Section 3 are introduced in this step
- State which REVIEW concepts from Section 4 are reinforced in this step
- Define a concrete done condition

**Done condition format — every done condition must follow one of these exactly:**
- `Postman: [METHOD] [path] returns [status] — [key field or body fragment]`
- `Browser: [what is visible or interactive] at [route]`
- `Terminal: [test command] passes — [count] tests, [key assertion named]`
- `pgAdmin: [query or visible table state]`

These are the only valid formats. Never use vague conditions like "the feature works",
"it renders correctly", or "the API is ready" — these are not testable.

Steps must follow the professional implementation order defined in Step 4i. The order is
not arbitrary — it reflects how a real developer builds a full-stack project:
- Backend before frontend (the frontend has nothing to call until the API exists)
- Manual testing before security (easier to debug endpoints without auth in the way)
- Security after basic endpoints work (so you know the endpoints themselves are correct)
- Tests after features work (so you understand what you are actually testing)
- Docker and README last (they wrap and document a working app, not a work in progress)

**Step 1 is always "Project setup".** It must cover: create Spring Boot project in Spring
Initializr, create PostgreSQL database, run `ng new`, create the git branch, create the
Postman collection. No business logic is written in this step. The done condition must
confirm the Spring Boot app starts (`Terminal: mvn spring-boot:run — started on port 8080`)
and the Angular app loads (`Browser: app loads at localhost:4200`).

Steps must introduce one major concept at a time.
Do not group unrelated concepts into one step.

The plan must include these three steps explicitly — do not skip any:
- A dedicated backend tests step (JUnit 5 + Mockito — one test per service method,
  edge cases covered, not just the happy path)
- A dedicated Angular tests step — read the "Testing rules" section in CLAUDE.md to
  determine which testing level is new in this project; describe what that test checks
  and why it is different from the previous testing level
- A SQL complement step: after the main JPA queries are working, write the equivalent SQL
  by hand in `sql/` — this reinforces what Hibernate generates automatically and connects
  the ORM layer to raw SQL already practiced in the 12:30 daily block

### 16. Testing plan
List what will be tested and at what level.

**Backend (JUnit 5 + Mockito):**
- Which service methods will have unit tests
- Which edge cases must be covered (not just the happy path — e.g. entity not found,
  business rule violation, role check)

**Angular — services (Jasmine + TestBed):**
- Which services will have unit tests
- What each test verifies (HTTP call made, signal updated, error handled)

**Angular — components (Jasmine + TestBed):**
- Read the "Testing rules" section in CLAUDE.md to determine if component tests are new
  or already introduced — plan accordingly
- Which components will have at least one TestBed test
- What each test verifies: rendering, interaction, or input/output behaviour

For each new testing concept introduced, add one interview question to
`notes/interview-prep/en/` and `notes/interview-prep/es/` (both files, same question).

### 17. Key rule
One paragraph: what is the single most important thing to remember about this project.

### 18. README structure
A table: README file | Audience | When to write it.
Follow the three-README system from CLAUDE.md (global README, backend README, frontend README).
Then for each README: list the planned sections.

### 19. Architecture decisions to document in the global README
6–8 one-line decisions. Format: `[what you did] to [why it matters]`

### 20. Tradeoffs to document in the global README
3–4 one-line tradeoffs. Format: `[option chosen] over [option rejected] — [reason]`

### 21. Future improvements
3 maximum. Domain-realistic only — no AI, no microservices.

### 22. Git branch strategy
The branch plan designed in Step 4j, as a table:

| Branch | Covers (steps) | Opens | Closes |
|--------|-----------------|-------|--------|
| ...    | ...             | ...   | ...    |

Followed by one line naming the project branch (`technology/0X-project-name`) and confirming
it stays open for the whole project, merging to `main` only when every step is done.

---

## Step 6 — Update ROADMAP.md and PROGRESS.md

After writing PLANNING.md, make these two small updates:

**ROADMAP.md:**
In the candidate ideas section, mark the chosen project as selected:
`- **[Project Name]** ← selected — PLANNING.md written at projects/0X-projectname/PLANNING.md`
Leave the other candidates unchanged — they may be useful for the project after this one.

**PROGRESS.md:**
Add one row to the projects table for the new project. The table columns are
`# | Project | Key concepts | Status | Live` — match them exactly:
`| 0X | [Project name] | [main concepts the project introduces] | Not started 🔜 | — |`

---

## Step 7 — Report

Print a short summary:

**Project chosen:** [name] — [one sentence: what it is and why it was chosen]

**Gaps closed by this project:**
List the specific concepts from Step 2's gap analysis that this project addresses.

**Gaps NOT closed by this project:**
List important gaps that remain. These become input for the project after this one.

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

---

<!-- ============================================================ -->
<!-- BRANCH B — run these steps only when MODE = review          -->
<!-- ============================================================ -->

## MODE = review — Audit an existing plan

---

## Step A — Read files

**If `PROJECT = all`:** follow `notes/prompts/_batch-mode.md`. Expand `all` into the ordered project
list from the Batch targets note above and run Steps A–F **once per project**, fully finishing one
(including its commit) before starting the next. Put each project's report under a `### [project]`
heading and derive its section set from the project type as the Batch targets note describes
(full-stack → full 22-section audit; angular → present-sections + universal checks only). End with
the final summary table from `_batch-mode.md`. The rest of this branch describes a single audit.

Read these files:
1. `CLAUDE.md` — for conventions, testing rules, and project standards
2. `PROGRESS.md` — to understand what has been learned and what phase the project is at
3. `{PROJECT}/PLANNING.md` — the file to audit. Note the path prefix differs by project:
   angular projects live at `angular/0X-name/PLANNING.md`, full-stack at `projects/0X-name/PLANNING.md`

---

## Step B — Section coverage check

Check which of the 23 required sections (0–22) are present in the PLANNING.md.

Required sections:
0. Session quick reference
1. Project title and one-line description
2. Why this project
3. New concepts
4. Review concepts
5. Tech stack
6. Architecture
7. Entities
8. Business rules
9. Seed data
10. REST API
11. Postman setup
12. Spring Boot folder structure
13. Angular folder structure
14. UI design
15. Progressive learning plan
16. Testing plan
17. Key rule
18. README structure
19. Architecture decisions
20. Tradeoffs
21. Future improvements
22. Git branch strategy

Report each section as ✅ present or ❌ missing.
Missing sections are critical issues — they block the project from starting clearly.

---

## Step C — Quality audit

For each present section, check quality using these specific rules:

**Section 0 — Session quick reference:**
- Is it present?
- If the project is in progress: is the current step filled in with a real step name?
- Is the done condition filled in and specific (not a dash)?
- Does the done condition follow the valid format? (see Step D)

**Section 3 — New concepts:**
- Is each concept specific? ("pagination with Pageable" = good; "Spring Boot" = too vague)
- Does every concept have a reason in the "Why this project teaches it" column?

**Section 7 — Entities:**
- Does every field have: field name, Java type, SQL type, constraints, and a note?
- Are all relationships defined with fetch type and cascade decision?

**Section 8 — Business rules:**
- Are there any vague rules like "admins can do more" without specifics?
- Are there any "TBD" placeholders?
- If the domain has state transitions, is there an ASCII diagram?

**Section 10 — REST API:**
- Does every endpoint have: method, path, role, description, request body (if applicable),
  query parameters (if applicable), response status, and response body shape?
- Are the HTTP status codes consistent with the conventions in this prompt?

**Section 15 — Progressive learning plan:**
- Does every step have a done condition?
- Does every done condition follow the valid format? (see Step D)
- Does each step introduce at most one major new concept?
- Are there dedicated steps for: backend tests, Angular tests, SQL complement?

**Section 16 — Testing plan:**
- Are specific service method names listed (not just "test the service")?
- Are edge cases defined for each test (not just the happy path)?

**Section 22 — Git branch strategy:**
- Does every branch have a name following `feat/short-description`?
- Does every branch have a concrete opening and closing condition (not "when done")?
- Do the branches together cover every step in Section 15, with no step left unassigned
  and no step assigned to more than one branch?
- Is there no more than one branch per coherent phase (setup, backend-core, security,
  frontend, tests, docker) — flag if a branch was opened per individual step?

---

## Step D — Done condition format check

A valid done condition must follow one of these formats exactly:
- `Postman: [METHOD] [path] returns [status] — [key field or body fragment]`
- `Browser: [what is visible or interactive] at [route]`
- `Terminal: [test command] passes — [count] tests, [key assertion named]`
- `pgAdmin: [query or visible table state]`

For every done condition in Section 15, mark it as:
- ✅ valid — matches one of the formats above
- ⚠️ vague — needs rewriting (quote the current text + write the proposed replacement)

---

## Step E — Internal consistency check

Cross-check between sections:

1. **Entities vs folder structure:** every entity in Section 7 should have a corresponding
   repository file in Section 12. List any that are missing.

2. **API vs folder structure:** every resource group in Section 10 should have a
   corresponding controller and service file in Section 12. List any that are missing.

3. **Angular pages vs wireframes:** every page component in Section 13 should have a
   wireframe in Section 14. List any that are missing.

4. **New concepts vs learning plan:** every concept in Section 3 should appear in at least
   one step in Section 15. List any that are never taught.

5. **Testing plan vs learning plan:** the testing step(s) in Section 15 should match the
   scope described in Section 16. Flag any mismatch.

6. **Branch strategy vs learning plan:** every step in Section 15 should fall inside exactly
   one branch's range in Section 22. List any step not covered by a branch, and any branch
   whose step range no longer matches Section 15 (e.g. Section 15 was edited after Section 22
   was written).

---

## Step F — Output report

Print the full audit in this format:

---

**Audit — projects/{PROJECT}/PLANNING.md**

**Summary:** X critical issues · Y quality issues · Z consistency issues

---

**Critical issues (missing sections):**
[list each missing section by number and name]

---

**Quality issues:**
[for each section with problems: section number + title, then a bulleted list of specific
issues. For each issue: quote the current text, then write the proposed replacement.]

---

**Consistency issues:**
[cross-section mismatches found in Step E]

---

**Proposed rewrites:**
[for each section that needs improvement: write the full corrected version, ready to
copy directly into the file]

---

Then show the commit message for applying the fixes (use the project's real path prefix —
`angular/` for 01–06, `projects/` for 07+). In `all` mode, show one commit per project, in order:

```
git add {path}/{PROJECT}/PLANNING.md
```

```
git commit -m "docs: improve PLANNING.md for {PROJECT} — fix done conditions, add missing sections"
```
````
