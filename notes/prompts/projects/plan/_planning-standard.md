# PLANNING.md standard — the shared contract

**Internal component. Not runnable.** This is the single source of truth for what a project's
`PLANNING.md` must contain and what makes each section pass. Both halves of the plan pipeline read it:

- `plan-write-prompt.md` (the **author**) reads it to know **what to produce** when writing a
  new plan.
- `plan-architecture-prompt.md` (the **architecture advisor**, new mode) reads §6, §3, and §20 to
  strengthen the architecture decisions against Victor's level.
- `plan-review-prompt.md` (the **reviewer**) reads it to know **what to audit against** when
  checking an existing plan. A dispatched specialist reads **only the parts its `{SCOPE}` row maps
  to** (its template sections, its invariant numbers, its design-check numbers) — never the whole
  file; only a standalone `SCOPE = all` run reads it in full.

Keeping the contract in one file is why the two never drift: the writer and the reviewer are held to
exactly the same bar. If a rule about PLANNING.md changes, it changes **here** — never inside the
write or review prompt.

---

## Two project formats

The template below has 23 sections (0–22). Which of them apply depends on the project type:

- **Full-stack projects (07+)** — Spring Boot + Angular + PostgreSQL. They use the **full 23-section
  template**. Everything in this file applies.
- **Angular-only projects (01–06)** — closed and already complete. They use a simpler legacy
  PLANNING.md with **no numbered sections**. Do **not** flag the full-stack-only sections as missing
  for them. For an Angular project, audit only the sections it actually has, plus the universal
  checks: done-condition format in the learning plan, no vague rules / TBD placeholders, and internal
  consistency between the sections that are present. Read its "Key patterns introduced" table and the
  listed learning objectives instead of the numbered sections.

The write prompt only ever creates **full-stack** plans (the next project is always full-stack from 07
on), so the writer always uses the full template. The Angular carve-out matters only for the reviewer
when auditing an old project.

---

## The 23-section template — exact order

Every full-stack PLANNING.md must contain these sections, in this order. For each: **what it must
contain** (the author writes this) and **what makes it pass** (the reviewer checks this). Sections are
matched by **heading text, not by number** — numbering is not guaranteed stable across projects, but
the heading names are.

### 0. Session quick reference
A living table, updated at the start of every session. Columns: **Current step · Current branch · Done
condition · Phase · Last updated**. Write it with dashes when creating a new plan; the first session
fills it in. The **Current branch** must be the exact `feat/…` branch from §22 that covers the current
step — this is what Claude reads first each session, so the branch is right there next to the step
instead of buried in §22.
- **Pass:** present. If the project is in progress, Current step names a real step, Current branch is
  the §22 branch whose range contains that step (not a dash, not `main`, not the project branch), and
  Done condition is specific (not a dash) and follows the done-condition format below.

### 1. Project title and one-line description
Plain language, says what the app does and who uses it.

### 2. Why this project
3–4 bullets: the domain problem it solves · the technical gaps it closes (reference the gap
analysis) · why a recruiter at NTT Data / Capgemini would recognise it as real enterprise work · what
it adds that the previous project does not.

### 3. New concepts
A table of every concept learned for the **first time** in this project.
Columns: **Concept · Topic · Why this project teaches it**.
- **Pass:** each concept is specific ("pagination with `Pageable`" = good; "Spring Boot" = too vague),
  and every row has a reason in the third column. Only concepts not yet in PROGRESS.md.

### 4. Review concepts
A table of concepts from PROGRESS.md this project reinforces.
Columns: **Concept · Originally learned in · How this project uses it again**. Limit to 8–12 that
genuinely benefit from repetition.

### 5. Tech stack
A table: **Layer · Technology · Notes**.

### 6. Architecture
Plain-language explanation + an ASCII diagram of the layers
(Browser → Angular → HTTP → Spring Boot: Controller → Service → Repository → PostgreSQL). Explain what
is NOT classic MVC and why. Then name the new architectural patterns this project introduces vs the
previous one, where each fits in the layer model, and why. If all patterns are the same as the
previous project, say so — do not invent gaps.

### 7. Entities
For each entity, a table of fields. Columns: **Field · Java type · SQL type · Constraints · Notes**.
Then a **Relationships** section: which entity owns each foreign key, fetch type and why, cascade
decision and why.
- **Pass:** every field has all five columns filled; every relationship states fetch type and cascade
  decision with a reason.

### 8. Business rules
All validation and access rules, each one explicit — never left to be discovered during development.
If the domain has a state machine (e.g. Draft → Submitted → Approved), include its ASCII diagram.
- **Pass:** no vague rule ("admins can do more" without specifics), no "TBD" placeholder; if there are
  state transitions, the diagram is present.

### 9. Seed data
The first admin/manager account `data.sql` content, plus any data that must exist at startup.

### 10. REST API
Every endpoint, grouped by resource (one subsection per controller). For each endpoint: **HTTP
method · URL path (plural nouns, no verbs) · role required · one-line description · request body (DTO
fields, if POST/PUT) · query params (name, type, optional/required, what it filters) · response
(status code + body shape)**.
- **Pass:** every endpoint has all applicable fields; status codes follow the conventions below.

### 11. Postman setup
Collection name `0X - ProjectName` (e.g. `08 - Invoice Manager`); one folder per controller (e.g.
`auth`, `invoices`); for each folder, which endpoints it contains.

### 12. Spring Boot folder structure
The complete annotated folder tree, one-line comment per file:
`controller/` (one per resource) · `service/` (one per resource) · `repository/` (one per entity) ·
`model/` (entities + enums) · `dto/request/` (one per create/update) · `dto/response/` (one per
resource) · `exception/` (GlobalExceptionHandler + custom exceptions) · `security/` (JwtUtil,
JwtFilter, SecurityConfig).

### 13. Angular folder structure
The complete annotated folder tree, one-line comment per file:
`core/guards/` · `core/interceptors/` · `core/services/` (one per backend resource) · `pages/` (one
folder per feature) · `shared/components/` · `shared/models/` (interfaces mirroring the backend DTOs).
Followed by the **Angular routes table**: path per page, which guards protect it, whether it is
employee-only / manager-only / shared.

### 14. UI design
In this order: **1)** color palette table (Role/status · Hex · Usage) — Material-friendly, primary +
accent different from the previous project · **2)** Material components table (component → page(s)
that use it) · **3)** view-by-view ASCII wireframes, one per page (layout, key interactive elements,
empty states, role-specific variations) · **4)** visual inspiration (2–3 real apps).
- **Pass:** every page has a wireframe.

### 15. Progressive learning plan
Every development step. Each step has: a short title · what is built (2–4 bullets) · which NEW
concepts from §3 it introduces · which REVIEW concepts from §4 it reinforces · a concrete **done
condition** in the format below. Steps follow the professional implementation order below and
introduce **one major concept at a time**. Step 1 is always "Project setup". The plan must include
three dedicated steps explicitly: **backend tests** (JUnit 5 + Mockito unit tests, plus the one slice
test type this project introduces — `@WebMvcTest` or `@DataJpaTest` — if any), **Angular tests** (level
per CLAUDE.md "Testing rules"), and a **SQL complement** step.
- **Pass:** every step has a done condition; every done condition is valid (format below); each step
  introduces at most one major new concept; the three dedicated steps are present.

### 16. Testing plan
What is tested, at which **level**, and why — a real test plan, not "we will write tests". Organise it
as a small test pyramid appropriate to a junior project: mostly unit, a few slice tests, **no e2e**
(Cypress/Selenium) unless a much later project justifies it. Introduce one new test *type* at a time,
like any other concept — do not dump the whole pyramid into project 08.

**Backend — unit (JUnit 5 + Mockito):** per service class, which methods and which edge cases (not just
the happy path — entity not found, business-rule violation, role/ownership check). **Every business
rule in §8 has a test that proves it is enforced.**
**Backend — slice (introduced one type at a time, from project 08):** at least one `@WebMvcTest`
(controller + `MockMvc`: status codes, JSON shape, validation 400, 401/403) and, where a repository has
custom queries, one `@DataJpaTest` (the query returns what it should against a real embedded DB). Name
the controller/repository and what each asserts. If the project introduces neither yet, say so
explicitly — do not pad.
**Angular services (Jasmine + TestBed + `HttpClientTestingModule`):** which services, what each test
verifies (the request URL/method, the mapped response, error handling).
**Angular components (Jasmine + TestBed, from project 08):** which components, what each verifies
(renders the right state, emits on action, shows empty/error state).
**Assertion quality (every level):** each test asserts real behaviour — the returned value or the saved
object's state — never only `verify(...)` that a method was called. No trivial "it exists" tests.
- **Pass:** specific method/service/component names (not "test the service"); edge cases named per
  test; every §8 business rule mapped to a test; the slice-test line present (even if "none yet — added
  in project 0X"); the assertion-quality rule stated.
- (Reminder, not a check: interview questions for new testing concepts are added during daily
  sessions per CLAUDE.md — no piece of this pipeline writes interview-prep files.)

### 17. Key rule
One paragraph: the single most important thing to remember about this project.

### 18. README structure
A table: **README file · Audience · When to write it** (global + backend + frontend). Then, per
README, its planned sections.

### 19. Architecture decisions to document in the global README
6–8 one-line decisions. Format: `[what you did] to [why it matters]`.

### 20. Tradeoffs to document in the global README
3–4 one-line tradeoffs. Format: `[option chosen] over [option rejected] — [reason]`.

### 21. Future improvements
3 maximum. Domain-realistic only — no AI, no microservices.

### 22. Git branch strategy
The branch plan as a table: **Branch · Covers (steps) · Opens · Closes**. Then one line naming the
project branch (`technology/0X-project-name`), confirming it stays open for the whole project and
merges to `main` only when every step is done. Follows the branch rules below.

---

## Done-condition format

Every done condition (§0 and every step in §15) must follow **one** of these exactly:

- `Postman: [METHOD] [path] returns [status] — [key field or body fragment]`
- `Browser: [what is visible or interactive] at [route]`
- `Terminal: [test command] passes — [count] tests, [key assertion named]`
- `pgAdmin: [query or visible table state]`

These are the only valid formats. Never use vague conditions like "the feature works", "it renders
correctly", or "the API is ready" — they are not testable. When auditing, mark each condition:
- ✅ valid — matches one of the formats
- ⚠️ vague — quote the current text and write the proposed replacement

---

## HTTP status code conventions

REST endpoints in §10 and the API design use these consistently:

| Code | When |
|------|------|
| 200 | GET/PUT success with body |
| 201 | POST that creates a resource |
| 204 | DELETE with no body |
| 400 | validation error |
| 401 | missing or invalid token |
| 403 | authenticated but wrong role |
| 404 | resource not found |
| 409 | conflict (duplicate, business-rule violation) |

---

## Professional implementation order

§15's steps must map to this sequence — it reflects how a real developer builds a full-stack project.
Do not rearrange unless there is a specific architectural reason, and if you do, explain it in the
PLANNING.md.

1. **Project setup** — Spring Initializr + `ng new` + PostgreSQL database + git branch + Postman
   collection. Always Step 1, no code until the environment runs. Done when: Spring Boot starts,
   Angular loads, database exists.
2. **Entity layer** — JPA entities, relationships, `@Column` constraints, enums, seed data.
3. **Repository layer** — `JpaRepository` interfaces and custom finder methods.
4. **Service layer** — business logic; no security yet; `Optional<T>` + custom exceptions for
   not-found and business-rule violations.
5. **Controller layer** — REST endpoints, DTOs, `ResponseEntity`; no auth yet.
6. **Manual backend test without auth** — every endpoint in Postman without a token; correct status
   codes and bodies before moving on.
7. **Security layer** — Spring Security config, JWT filter, `UserDetailsService`,
   `BCryptPasswordEncoder`, `@PreAuthorize`.
8. **Manual backend test with auth** — login → JWT → every endpoint with correct token/role; test 401
   (no token) and 403 (wrong role) explicitly.
9. **Frontend scaffolding** — Angular routing, TS interfaces mirroring the DTOs, auth service, HTTP
   interceptor, route guards.
10. **Feature pages** — one at a time in dependency order: login first, then the simplest resource,
    then more complex pages.
11. **Backend tests** — JUnit 5 + Mockito unit tests, one step per service class (happy path + edge
    cases), plus the one slice test type this project introduces (`@WebMvcTest` and/or `@DataJpaTest`),
    if any.
12. **Angular tests** — services first (`HttpClientTestingModule`); components if project 08+.
13. **SQL complement** — write by hand in `practice/sql/` the SQL Hibernate generates for the main queries.
14. **Docker** — `docker-compose.yml` with the database service; app image if time allows. Late by
    design — Docker wraps a working app, not a work in progress.
15. **README** — all three READMEs after the project works.

Each step in §15 should be traceable to one or more items here. If two items are combined into one
step, explain why (e.g. "repository has no custom logic so it is combined with the entity step").

> **No-auth projects:** if the domain genuinely has no users or login, omit the security half of steps
> 6–8 and every JWT part — do not force auth into a project that does not need it. When auditing such a
> plan, the reviewer must **not** flag the missing security steps (or invariant 7) as gaps.

---

## Git branch strategy rules

Group the implementation steps into **coherent feature branches — never one branch per step**. A
branch spans a logical, self-contained chunk with a clear "done" (e.g. all backend security steps
together, all CRUD + workflow together, the whole Angular frontend together). One branch per step
creates PR noise with no isolation benefit; the goal is one branch per feature.

For each branch, define:
- **Branch name** — `feat/short-description` (CLAUDE.md convention).
- **Covers** — which implementation steps / §15 steps it contains.
- **Opens** — when it is created (after the previous feature branch's PR merges, or at Step 1 for the
  first one).
- **Closes** — the concrete condition that means it is ready for a PR into the project branch (usually
  "after Step X's done condition passes").

The project branch (`technology/0X-project-name`) is created once, in Step 1, and stays open for the
whole project — it merges into `main` only when every step is done. Do not plan a branch for it beyond
that.

- **Pass:** every branch name follows `feat/short-description`; every branch has a concrete open and
  close condition (not "when done"); the branches together cover every §15 step, no step unassigned
  and no step in more than one branch; no more than one branch per coherent phase (setup, backend-core,
  security, frontend, tests, docker).

---

## Internal consistency invariants

Cross-checks between sections. A finished plan satisfies all of them; the reviewer verifies each:

1. **Entities vs folder structure** — every entity in §7 has a repository file in §12.
2. **API vs folder structure** — every resource group in §10 has a controller and service file in §12.
3. **Angular pages vs wireframes** — every page component in §13 has a wireframe in §14.
4. **New concepts vs learning plan** — every concept in §3 appears in at least one step in §15.
5. **Testing plan vs learning plan** — the testing step(s) in §15 match the scope in §16.
6. **Branch strategy vs learning plan** — every §15 step falls inside exactly one branch's range in
   §22; no step uncovered, no branch whose range no longer matches §15.
7. **Routes/roles vs API security** — every manager-only / employee-only route in §13 has a matching
   `@PreAuthorize` (or documented role restriction) on its endpoint(s) in §10, and vice versa. No route
   protected in the UI but open in the API, and no endpoint restricted by role whose page is reachable
   by the wrong role. (Skip for a no-auth project.)
8. **§0 branch vs §22** — the Current branch in §0 is one of the branches defined in §22, and its
   §22 range contains the §0 Current step. If §0 says step 5 but the branch shown covers steps 1–3,
   one of them is wrong.

---

## Design-correctness checks — is each decision *defensible*, not just *present*?

The consistency invariants above prove the plan is internally coherent. These prove the design
decisions are **sound enough to defend in an interview** — the difference between a *complete* plan and
a *perfect* one. The reviewer runs each; the author should already satisfy them.

1. **Relationship fetch types (§7)** — every `EAGER` is justified (the default should be `LAZY`; flag
   any `EAGER` without a stated reason). Every cascade choice matches the ownership described.
2. **State machine (§8)** — if there is one, every state is reachable from the initial state and every
   non-terminal state has at least one outgoing transition. No dead or orphan states.
3. **Endpoint roles (§10)** — no endpoint that mutates another user's data is open to `EMPLOYEE`
   without an ownership check named in §8. Read vs write roles are consistent across a resource.
4. **One concept per step (§15)** — no step silently bundles two major new concepts (e.g. JWT *and*
   pagination). If a step must, it is called out and justified.
5. **Interview test** — for each architecture decision (§6) and tradeoff (§20), the stated reason
   already answers "why did you do it this way?" — not "because the tutorial did". A reason that is
   just a restatement of the choice ("used DTOs to have DTOs") fails.
