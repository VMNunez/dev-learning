# PLANNING.md standard — the shared contract

**Internal component. Not runnable.** This is the single source of truth for what a project's
`PLANNING.md` must contain and what makes each section pass. Both halves of the plan pipeline read it:

- `_plan-write-prompt.md` (the **author**) reads it to know **what to produce** when writing a
  new plan.
- `_plan-architecture-prompt.md` (the **architecture advisor**, new mode) reads §6, §3, and §20 to
  strengthen the architecture decisions against Victor's level.
- `_plan-review-prompt.md` (the **reviewer**) reads it to know **what to audit against** when
  checking an existing plan. A dispatched specialist reads **only the parts its `{SCOPE}` row maps
  to** (its template sections, its invariant numbers, its design-check numbers) — never the whole
  file; only a standalone `SCOPE = all` run reads it in full.

If a rule about PLANNING.md changes, it changes **here**, never inside the write or review prompt —
that is what holds the writer and the reviewer to the same bar.

---

## Two project formats

The template below has 24 sections (0–23). Which of them apply depends on the project type:

- **Full-stack projects (07+)** — Spring Boot + Angular + PostgreSQL. They use the **full 24-section
  template**. Everything in this file applies.
- **Angular-only projects (01–06)** — closed and already complete. They use a simpler legacy
  PLANNING.md with **no numbered sections**. Do **not** flag the full-stack-only sections as missing
  for them. For an Angular project, audit only the sections it actually has, plus the universal
  checks: done-condition format in the learning plan, no vague rules / TBD placeholders, and internal
  consistency between the sections that are present. Read its "Key patterns introduced" table and the
  listed learning objectives instead of the numbered sections.

---

## The 24-section template — exact order

Every full-stack PLANNING.md must contain these sections, in this order. Each states **what it must
contain** (the author writes this); those carrying real judgement add **what makes it pass**
(`- **Pass:**`). **A section without one is still reviewed** — its spec is the shape it states: §12 is
held to §13's bar, §20 to design check 5, §22 to the branch rules below, and a section stating only
column sets, counts or formats to those. Sections are matched by **heading text, not by number** —
numbering is not guaranteed stable across projects, but the heading names are.

### 0. Session quick reference
A living table, updated at the start of every session. Columns: **Current step · Current branch · Done
condition · Next gate · Phase · Last updated**. Write it with dashes when creating a new plan; the first
session fills it in. The **Current branch** must be the exact `feat/…` branch from §22 that covers the
current step — this is what the coding agent reads first each session, so the branch is right there next to the
step instead of buried in §22. **Next gate** names the gate invariant 10 derives, and what that gate is
still waiting on. Which gate that is, and what the cell holds once every gate is signed off, are
invariant 10's to state; do not restate the derivation here.
- **Pass:** present. If the project is in progress, Current step names a real step, Current branch is
  the §22 branch whose range contains that step (not a dash, not `main`, not the project branch), Done
  condition is specific (not a dash) and follows the done-condition format below, and Next gate names a
  real §23 gate — or, once every chain gate is signed off, the closure checklist's last box — as
  invariant 10 derives, which is where that check is made.

### 1. Project title and one-line description
Plain language, says what the app does and who uses it.
- **Pass:** both halves present — "an invoice management application", with no who, fails. Where the
  project has roles, the user types named here are §8's roles; one appearing only here is a contradiction.

### 2. Why this project
3–4 bullets: the domain problem it solves · the technical gaps it closes (the brief's gap table is
where they come from) · why a recruiter at NTT Data / Capgemini would recognise it as real enterprise
work · what it adds that the previous project does not.

### 3. New concepts
A table of every concept this project **demonstrates for the first time** — its coverage bullet carries
no `✅ NN-slug` project marker yet. Unmarked means *not yet demonstrated*, never *not yet studied*.
Columns: **Concept · Topic · Why this project teaches it**.

The **Topic** column is a controlled vocabulary, not free text: it names the coverage file the
concept's bullet belongs to, so a loose value ("Backend", "Java/Spring") routes it nowhere. Valid
values are exactly the `notes/` topic folders that own a `coverage/{level}.md` — **Angular · Angular
Material · Architecture · CSS · General · Git · Java · JavaScript · Security · Spring · Spring Boot ·
SQL · TypeScript** — there is no Deployment topic; build and hosting concepts are **General**. One
value per row. A concept is **Java** if it exists without Spring (`Optional<T>`,
`BigDecimal.compareTo()`, `try/catch`); a core container,
bean, proxy, or transaction mechanism is **Spring** (`@Transactional` proxy behaviour); Boot
startup/auto-configuration and concrete Boot-stack integration are **Spring Boot**.
- **Pass:** each concept is specific ("pagination with `Pageable`" = good; "Spring Boot" = too vague),
  every Topic is one of the topic folders above (Java vs Spring vs Spring Boot split correctly), and
  every row has a reason in the third column. Only undemonstrated concepts: a bare pre-2026-08-01
  `✅ NN-slug` counts as demonstrated, a `✅ sql:` drill marker alone does not.

### 4. Review concepts
A table of concepts this project reinforces — each already carrying a `✅ NN-slug` marker from an
earlier project, which is where the second column's value comes from.
Columns: **Concept · Originally demonstrated in · How this project uses it again**. Limit to 8–12 that
genuinely benefit from repetition.

### 5. Tech stack
A table: **Layer · Technology · Notes**.

### 6. Architecture
Plain-language explanation + an ASCII diagram of the layers
(Browser → Angular → HTTP → Spring Boot: Controller → Service → Repository → PostgreSQL). Explain what
is NOT classic MVC and why. Then name the new architectural patterns this project introduces vs the
previous one, where each fits in the layer model, and why. If all patterns are the same as the
previous project, say so — do not invent gaps.

**Both tiers get engineering rules, not just a diagram.** After the diagram, the section states the
backend layer rules (controller never calls the repository, entities never leave the service layer, …)
**and an equivalent block of Angular rules**, held to the same bar: every rule must be violable and
detectable. The Angular block covers at minimum:
- **State ownership** — where state lives, and who owns it when two pages read the same endpoint.
- **Service boundary** — what a `core/services/` service may and may not do (HTTP call + mapping to the
  model; never UI concerns, never navigation).
- **Component conventions** — standalone components, `inject()` over constructor injection, and the
  change-detection strategy.
- **Typing** — `shared/models/` interfaces mirror the response DTOs exactly; no `any` at an API boundary.
- **Subscription lifetime** — `async` pipe or `takeUntilDestroyed`; never an unmanaged `.subscribe()`.
- **Async states** — what every page that loads data renders while loading and when the call fails.
- **Pass:** the ASCII diagram is present; **both** rule blocks (backend layers and Angular) are present;
  every rule in both is violable and detectable — a block of labels fails even if it names the right
  patterns; the new-patterns-vs-previous-project paragraph is present.

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
- **Pass:** if the project has logins, the seed account is present with its role, that role is one §8
  and §10 use — a seed granting a role no rule mentions is the fastest way to a login nothing
  authorizes — and its credentials are written out, since §15's deploy step owes them to the global
  README and this is the only place they exist. Every lookup/enum row §7 requires at startup is listed.

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

Then one line per piece of **shared state**: for every endpoint consumed by more than one page, where
that data lives and who owns it — a shared service holding a signal, or each page fetching
independently.
- **Pass:** every file in the tree carries its one-line comment — the same bar §12 is held to; an
  unannotated frontend tree fails even when the folder names are right. The routes table covers every
  page in the tree, each with its guards. Every endpoint read by two or more pages has its ownership
  line. No page appears in the tree without a route, and no route without a page.

### 14. UI design
In this order: **1)** the visual identity statement · **2)** colour palette table (Role/status · Hex ·
Usage) · **3)** design-system table · **4)** Material components table (component → page(s) that use
it) · **5)** view-by-view ASCII wireframes, one per page · **6)** motion and accessibility ·
**7)** visual inspiration (2–3 real apps) · **8)** the visual QA checklist.

**The target is an attractive app, not merely a correct one.** A recruiter judges the demo in two
minutes, and consistency is what reads as professional — so §14 fixes the values before the first page.

**Visual identity — every project looks like a different product.** The portfolio is read as a set: a
recruiter opening three projects that share one palette, one card, one density reads *one template used
three times*, which undersells the work. So each new plan chooses its **own** identity, and the plan
opens §14 by stating it in 3–5 lines: the domain feeling it targets (a payroll tool and a booking app
should not feel alike), and the concrete decisions that carry it. The identity must differ from **every
published project**, not merely the previous one, on at least **three** of these axes, each named
explicitly with what the earlier projects did:
- **Palette** — hue family and temperature of primary + accent, and whether the surface is light-neutral,
  tinted, or dark-first.
- **Density and rhythm** — the spacing grid's base value and Material density setting; compact
  data-dense screens vs airy generous ones.
- **Shape** — corner radius scale and how flat or elevated surfaces read.
- **Typography** — the type family and how much contrast there is between headings and body.
- **Layout skeleton** — sidenav vs top-bar vs dashboard-grid, and how a list-plus-detail page is arranged.
- **Data presentation** — the dominant surface (table, card grid, timeline, board) for the main resource.

The identity is a **learning device, not decoration**: each axis is one theming decision Victor
implements once in the theme file and defends in an interview ("I set density to compact because the
main screen is a data table"). Choosing a different skeleton or a different dominant surface than the
last project teaches a new Material layout; repeating them teaches nothing. Stay inside what Angular
Material supports — the identity comes from *configuring the framework differently*, never from
hand-written CSS fighting it (that would break the theming rule below).

Each wireframe specifies **all three states, not only the happy one** — loading, failed call, and
succeeded-with-nothing — plus key interactive elements and role-specific variations. A junior frontend
is judged on exactly these.

**Design system — a table of decisions, each violable in the §6 sense** (a reviewer can open a
stylesheet and point at the break):
- **Theming mechanism** — the framework's supported theming API, in one named file; never CSS overrides
  of component internals, which break on every framework upgrade.
- **Palette intent vs generated ramp** — where the framework generates tonal colours, the hex is the
  *intent*; the rendered value may differ and must not be forced back.
- **Domain/status colours as named tokens** — declared once, consumed by the component that owns them.
- **Typography** — the framework's type scale mapped to roles (page title, section heading, body,
  metric, label). No font-size in a component stylesheet.
- **Spacing** — one grid (e.g. 8px) with its allowed values, page padding, gaps. No arbitrary pixels.
- **Elevation, shape, density** — from the theme, set once, never hand-written per component.
- **Dark mode** — in or out, with a reason. Absent is not a decision.

**Motion** — feedback, not decoration: transitions fire on state change only, nothing loops to look
busy, `prefers-reduced-motion` is honoured. Skeleton placeholders animate — a static skeleton reads as a
broken page. **Accessibility floor** — icon-only buttons carry a label; status is never colour alone;
contrast verified at the rendered size; focus visible; every action reachable by keyboard.

The **visual inspiration** table is a working reference: each row names the app, the link, and **the one
concrete element to take from it** ("status badge shape and colour weight") — never "general
inspiration". At least one palette or layout decision traces back to a named row. Prefer real products
in the project's domain over dribbble shots: a recruiter recognises the former.

The **visual QA checklist** is the finish bar, run over **every page in one sitting** at the end of the
last frontend step — the only point where drift between pages built on different days is visible. It
checks at minimum: type scale and spacing obeyed; all three states reachable on every page; contrast and
colour-alone; labels and keyboard reach; the declared breakpoints; motion budget; and that the
screenshots the README needs exist.

Finally, one line on **responsive intent**: which layouts collapse on a narrow viewport (tables, the
sidenav), or an explicit §20 tradeoff saying the demo targets desktop.
- **Pass:** the visual identity statement is present, names at least three differentiating axes, and for
  each one says what the earlier projects did — "a fresh modern look" with no axis named fails, and so
  does an axis that only restates this project's value without the contrast; the palette, density,
  shape and typography rows of the design-system table actually match the identity claimed (an identity
  promising compact data-density and a design system on an airy 16px grid is two plans, not one); every
  page in §13 has a wireframe; every wireframe names its empty state; every page that
  loads data declares its loading **and** its error state — a page specified only in its success state
  fails; the design-system table is present and every row is a *decision* (a row naming a value without
  saying where it is defined or who consumes it fails), including an explicit dark-mode ruling; the
  motion and accessibility blocks are present; the inspiration table names one concrete element per row
  and at least one §14 decision traces back to a named row; the visual QA checklist is present; the
  responsive intent is stated here or documented as a §20 tradeoff.

### 15. Progressive learning plan
Every development step. Each step has: a short title · what is built (2–4 bullets) · which NEW
concepts from §3 it introduces · which REVIEW concepts from §4 it reinforces · a concrete **done
condition** in the format below. Steps follow the professional implementation order below and
introduce **one major concept at a time**. Step 1 is always "Project setup".

**Step sizing:** a step is a few days of work, never weeks. A phase that is inherently large — the
Angular frontend is the canonical case: shell + auth + several pages — must be split into multiple
steps (shell/auth first, then pages in dependency order, 2–3 pages max per step), each with its own
done condition. **A step's done condition must cover the step's full listed scope**: a condition proving
login + one table does not close a step that builds seven pages.

The plan must include
three dedicated steps explicitly: **backend tests** (JUnit 5 + Mockito unit tests, plus the one slice
test type this project introduces — `@WebMvcTest` or `@DataJpaTest` — if any), **Angular tests** (level
per the shared session rules "Testing rules"), and a **SQL complement** step.
- **Pass:** every step has a done condition; every done condition is valid (format below) **and covers
  the step's full listed scope**; each step introduces at most one major new concept; no step spans
  more than a few days of work (a whole app tier in one step fails — split it); the three dedicated
  steps are present.

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

### 17. Key rule
One paragraph: the single most important thing to remember about this project.

### 18. README structure
A table: **README file · Audience · When to write it** (global + backend + frontend). Then, per
README, its planned sections.

**§19-§21 plan three sections of a README, so their sizes are owned by**
`notes/prompts/projects/readme/_internal/_readme-standard.md` — its **Global README rules 6, 7 and 8**,
not the backend rules of the same numbers — the standard those sections are later audited against.
**State no count here:** a number in this file is a second source that drifts from the first, which is
exactly what `6–8` against `3 to 8` was until 2026-09-01. The tests themselves are restated below, so a
plan review never has to open that file; only the sizes are dereferenced.

**A plan written before 2026-09-01 still carries the deleted caps** (`07-timetrack` §19 "6-8 maximum",
§21 "max 3 bullets"), and `_readme-write-prompt.md` reads `PLANNING.md` on every run — so the dead cap
reaches the README author through the plan. **Strike that clause from §19-§21 on the next `plan-audit`
of any project whose plan states one**; it is a deletion, not a rewrite, and needs no new judgement.

### 19. Architecture decisions to document in the global README
One-line decisions. Format: `[what you did] to [why it matters]`. As many as pass the **interview test**
(the reason already answers "why?" — the same test design check 5 applies to §6 and §20), are
**distinct** (no two naming the same choice), and stay **one line carrying a reason and not a mechanism**
(a walkthrough of how the thing works belongs in the README's `What I learned` recall line, not here);
no fixed number, and never padded to reach one.

### 20. Tradeoffs to document in the global README
One-line tradeoffs. Format: `[option chosen] over [option rejected] — [reason]`. As many as name a real
rejected option with something actually given up; design check 5 applies to every reason here. No fixed
number.

### 21. Future improvements
Domain-realistic only — no AI, no microservices. Each an improvement a user would notice, never a
developer learning goal. No fixed number.

### 22. Git branch strategy
The branch plan as a table: **Branch · Covers (steps) · Opens · Closes**. Then one line naming the
project branch (`technology/0X-project-name`), confirming it stays open for the whole project and
merges to `main` only when every step is done. Follows the branch rules below.

### 23. Quality gates — which prompt to run when
The checkpoint plan as a table (**Gate · Trigger · Prompt + config · Why**), followed by the
**closure checklist**. Each gate ties a concrete point in the build (a §22 branch closing, a §15 phase
finishing) to the one prompt that runs there, so the coding agent can say *"this branch just merged — run
`review-audit` with `REVIEW_SCOPE = backend` now"* instead of quality checks being remembered at the
end. The closure checklist is what makes the project's own **definition of done** explicit: the project
is not closed until every gate has run. Follows the quality-gate rules below.
- **Pass:** present, with both the gate table and the closure checklist; every gate names a real
  runnable prompt (one of those listed in `notes/prompts/README.md`) and a concrete trigger tied to a §22
  branch or §15 step (not "when the backend feels done"); the two review gates are tier-scoped
  (`REVIEW_SCOPE = backend` / `frontend`, never `full`); gates appear in build order; the prerequisite
  chain is respected (see the rules below).

---

## Done-condition format

Every done condition (§0 and every step in §15) must follow **one** of these exactly:

- `Postman: [METHOD] [path] returns [status] — [key field or body fragment]`
- `Browser: [what is visible or interactive] at [route]`
- `Terminal: [test command] passes — [count] tests, [key assertion named]`
- `pgAdmin: [query or visible table state]`

**A step that builds UI pages must prove one non-happy state.** The `Browser:` condition covers the
populated success path *and* at least one of the empty, loading, or error states of a page the step
built — §14 makes the plan declare them; this is what forces them to be built. Extend the condition
rather than adding a step: `…and the table shows its empty state before the first entry exists`.

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
   interceptor, route guards, and the §14 design system (theme, type scale, spacing, colour tokens)
   set up before the first page exists.
10. **Feature pages** — one at a time in dependency order: login first, then the simplest resource,
    then more complex pages.
11. **Backend tests** — JUnit 5 + Mockito unit tests, one step per service class (happy path + edge
    cases), plus the one slice test type this project introduces (`@WebMvcTest` and/or `@DataJpaTest`),
    if any.
12. **Angular tests** — services first (`HttpClientTestingModule`); components if project 08+.
13. **SQL complement** — write by hand in `practice/sql/` the SQL Hibernate generates for the main queries.
14. **Docker** — `docker-compose.yml` with the database service; app image if time allows. Late by
    design — Docker wraps a working app, not a work in progress.
15. **Deploy** — a public URL a recruiter can open, with the demo credentials in the global README.
    `docker-compose up` proves the app runs on *your* machine; it is not a link anyone can click.
    Free-tier hosting for the API + database and a static host for the Angular build is enough. If the
    project genuinely will not be deployed, that is a §20 tradeoff with a reason — not a silent omission.
16. **README** — all three READMEs after the project works.

Each step in §15 should be traceable to one or more items here. If two items are combined into one
step, explain why (e.g. "repository has no custom logic so it is combined with the entity step").

> **No-auth projects:** if the domain genuinely has no users or login, omit the security half of steps
> 6–8 and every JWT part — do not force auth into a project that does not need it. When auditing such a
> plan, the reviewer must **not** flag the missing security steps (or invariant 7) as gaps.

---

## Git branch strategy rules

Group the implementation steps into **coherent feature branches — never one branch per step**. A
branch spans a logical, self-contained chunk with a clear "done" (e.g. all backend security steps
together, all CRUD + workflow together, the frontend shell + auth together).

**Branch scope must be comparable across the whole project.** If the backend phases each got a
feature-sized branch (auth, workflow, reports), the frontend is never one giant branch — split it the
same way its §15 steps are split (e.g. `feat/angular-shell-auth`, `feat/angular-entries`,
`feat/angular-manager-pages`).

For each branch, define:
- **Branch name** — `feat/short-description` (the shared session rules convention).
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
  and no step in more than one branch; one branch per coherent feature-sized chunk — a large phase
  (the frontend) is split into 2–3 branches mirroring its §15 steps, and no branch spans notably more
  work than the largest backend branch.

---

## Quality-gate rules (§23)

A **gate** is a checkpoint where a quality prompt runs, for two reasons: defects are caught while they
are still cheap (a bug found after the frontend consumes it costs two fixes, not one), and each surface
is reviewed once. A gate is therefore scoped (`REVIEW_SCOPE = backend`) — **never plan a `full` review
as a routine gate**; `full` is for a first review or a final sweep, not a tier already reviewed.

The gates below are **derived from the real dependency map** in `notes/prompts/README.md` ("How the
prompts feed each other"): a prompt is placed at the point where the file it *reads* has just become
accurate, and before the prompt that *consumes* its output. Every full-stack plan instantiates all of
them, in this order. Adapt the trigger wording to the project's actual §22 branches and §15 steps, but
do not drop a gate or invent extra ones.

| Gate | Trigger | Prompt + config | Why exactly here |
|------|---------|-----------------|------------------|
| **G1 — Step ritual** | Every §15 step's done condition passes | *(no prompt — the `step-complete` skill fires in-session)* | Keeps PLANNING ✅ / PROGRESS.md / README true as you go, so the later gates read accurate files. |
| **G2 — Plan drift** | Only if §15 / §22 change mid-build (scope cut, steps reordered) | `plan-audit` · `MODE = review` · `PROJECT = {project}` | Every later gate checks the code **against PLANNING.md**. A stale plan silently invalidates all of them. Skip if the plan never moved. |
| **G3 — Backend review** | The last backend branch's PR merges — backend complete, **before frontend work starts** | `review-audit` · `PROJECT_PATH = {project}` · `REVIEW_SCOPE = backend` | Correctness + security on the API **before** the frontend is built against it. Fix the High tasks it writes to `PROJECT-BACKLOG.md` before moving on. |
| **G4 — Frontend review** | The frontend branch's PR merges — frontend complete | `review-audit` · `PROJECT_PATH = {project}` · `REVIEW_SCOPE = frontend` | Each surface is reviewed once (see the rules above this table): G3 has already read the backend, so a `full` run here would re-read reviewed code. Scope follows what changed, never how old the backend's date is — a frontend phase is not expected to add backend code, and if this project's did, the answer is to **re-run G3 scoped `backend`**, never to widen G4 to `full` (a fix campaign G3 itself ordered is inside its sign-off, not after it). |
| **G5 — READMEs** | Every **High** task from G3/G4 is fixed and committed | `readme-audit` · `PROJECT_PATH = {project}` | Hard prerequisite of G7: `portfolio-audit` reads the READMEs, so running it first would judge a document that is about to change. |
| **G6 — PROGRESS accurate** | After G5, before the portfolio gate | `progress-update-prompt` · `MODE = active` | `cv-prompt`, `project-brief` and `review-audit` all read `PROGRESS.md`; a stale one builds the CV bullet, the next project's choice and the reviewer's level calibration on a wrong picture. **The gate closes on a clean drift report, not on the run happening**: since 2026-08-05 the prompt writes only `Professional level by topic` and *reports* every other section, so a run that names drift leaves G6 open until the owner it names has repaired it. |
| **G7 — Portfolio go/no-go** | After G5 **and** G6 | `portfolio-audit` · `PROJECT_PATH = {project}` | The closing gate. Reads `PROJECT-BACKLOG.md` — an unfixed High/Medium from G3/G4 blocks the ✅ Ready verdict. Produces the CV bullet + the project question bank. |
| **G8 — Roadmap resync** | After G7 returns ✅ Ready | `roadmap-review-prompt` | The project sequence just changed. This is what keeps `ROADMAP.md` from drifting into a stale plan. |

**Prerequisite chain (hard — a gate run out of order gives a wrong answer, not just a late one):**
`G3/G4 → fix the Highs → G5 → G6 → G7 → G8`. G5 before G7 because the portfolio gate reads the READMEs;
G6 before G7 because G7's CV bullet is reused as-is by `cv-prompt`, which does read PROGRESS; G3/G4
before G7 because it reads the backlog.

**A gate is *signed off* when its box in the closure checklist below can be truthfully ticked of the
project branch as it stands.** A fix sitting on an unmerged branch has fixed nothing the gate can read,
so its box is not yet tickable — "condition met, action pending" is a state *before* sign-off, not a
form of it. The box is the floor, never the ceiling: a plan's own §23 gate cell may state a stricter
sign-off — naming the branch its fixes must be merged into, for instance — and where it does, both
conditions hold. A trigger and a sign-off are also different events: G3's trigger is the backend branch
merging, its sign-off is the review having **covered every slice of that tier** — the stamp its box
quotes — **and** every High it found being fixed on the project branch. So a gate whose trigger has
already fired while its box is still untickable is **not** signed off, and it is still the gate the
project is on.

**A review gate's box therefore reads the stamp, not the fact that the prompt ran**, the same way G6
closes on an empty drift report rather than on `progress-update` having happened. `_review-standard.md`
owns the three shapes that stamp can take: every slice read → that run's plain date · a slice lost to a
failed re-dispatch → that date plus `(incomplete — «slice» not reviewed)` · **every** slice lost →
nothing stamped, so the line still holds whatever it held before. The box asks for *that run's date and
no qualifier* because both of the other two shapes leave code no reviewer opened, and the third one is
invisible to a test that only looks for the qualifier.

### Closure checklist — the project's definition of done

The plan must end §23 with this checklist, so **the project is never declared finished early**. Copy it
verbatim into the plan (as unchecked boxes) and tick each one as it happens:

```
- [ ] Every §15 step's done condition passes, each with its step-complete ritual (G1)
- [ ] PLANNING.md still matches what was built — re-run plan-audit MODE=review if §15/§22 moved (G2)
- [ ] review-audit REVIEW_SCOPE=backend has run — PROJECT-BACKLOG.md's `**Last Reviewed — backend:**` line carries that run's date with no `(incomplete — …)` qualifier — and every High task it found is fixed (G3)
- [ ] review-audit REVIEW_SCOPE=frontend has run — PROJECT-BACKLOG.md's `**Last Reviewed — frontend:**` line carries that run's date with no `(incomplete — …)` qualifier — and every High task it found is fixed (G4)
- [ ] readme-audit has run — global + backend + frontend READMEs at standard (G5)
- [ ] progress-update MODE=active has run **and its drift report came back empty** — anything it named is repaired by the owner it named (G6)
- [ ] portfolio-audit returns ✅ Ready — no open High/Medium in PROJECT-BACKLOG.md (G7)
- [ ] roadmap-review has run — ROADMAP.md reflects the new project sequence (G8)
- [ ] The project branch has been merged into `main` via PR
```

- **Pass:** G1–G8 all present, in order, each with a concrete trigger naming a real §22 branch or §15
  step; G3 and G4 are tier-scoped (never `full`); the prerequisite chain is stated; the closure
  checklist is present with all nine boxes, **each carrying this file's wording for that box** — the
  checklist is copied verbatim, so a box whose text has drifted from the version above is a stale copy
  of a condition that has since been tightened, and a count of nine cannot see it.

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
9. **Gates vs branches/steps (§23 ↔ §22/§15)** — every gate's trigger names a branch that actually
   exists in §22 or a step that actually exists in §15. G3 fires at the **last backend** branch, G4 at
   the **frontend** branch — so if §22's phases were reordered, the gates moved with them. A gate whose
   trigger names a branch that is not in §22 is a stale gate.
10. **§0 Next gate vs §23** — the Next gate in §0 is one of the gates defined in §23, and it is the
   first gate in §23's **prerequisite chain** — `G3/G4 → fix the Highs → G5 → G6 → G7 → G8`, quoted
   from the chain line under the gate table — that is **not yet signed off**, as the paragraph
   immediately under that chain line defines *signed off*. G3 and G4 share the chain's first position;
   where neither is signed off, the backend tier is reviewed first, so G3 comes first. A plan pointing
   at G5 (READMEs) while the backend review (G3) has never run is wrong — the prerequisite chain forbids
   it. And a gate whose **trigger** has fired while its closure-checklist box is still untickable is
   *still* that gate: a plan whose backend branch has merged but whose G3 Highs are unfixed, or fixed on
   a branch that has not merged, names G3 and never G4. The predicate is the chain's, not all of §23's,
   so G1 — which holds no chain position — is never this cell's answer. When every chain gate is signed
   off, the cell names the closure checklist's last box, the project branch's PR into `main`, and reads
   `—` once that lands. **Published limit:** a plan review settles the chain *order* from §0/§22/§23
   alone and cannot settle the sign-off *truth-value*. Not because the backlog is out of its reach —
   `_plan-review-prompt.md`'s `whole-plan` scope does read `{PROJECT}/PROJECT-BACKLOG.md`, and a
   standalone `SCOPE = all` run holds it while running this very invariant — but because the backlog is
   not *all* a sign-off turns on. Because *signed off* is defined of the project branch as it stands —
   the paragraph this invariant already quotes — G3/G4/G7 turn on the backlog *and* on whether each fix
   is merged into that branch, which is Git state no scope's reading map supplies; G6 turns on
   `progress-update`'s drift report, which no scope reads at all. So a plan review checks the order,
   reports the truth-value as unverifiable, and leaves it to the two §0 rituals, which read the backlog
   *and* the branch.
11. **Visual QA checklist vs learning plan (§14 ↔ §15)** — §14's visual QA checklist exists, and the
   last frontend step in §15 names it in its done condition. A checklist nobody is required to run is
   decoration.
12. **§10 endpoints vs consumers (§10 ↔ §13)** — every endpoint in §10 is either called by a route,
   component or dialog named in §13, or explicitly ruled backend-only in §10 with a one-line reason.
   An endpoint with neither is a defect: the plan builds, tests and documents something the app can
   never reach.

---

## Design-correctness checks — is each decision *defensible*, not just *present*?

The invariants above prove the plan is internally coherent; these prove its decisions are **sound enough
to defend in an interview**. The bar is Victor's actual objective — a junior / junior-mid interview at a
Spanish consultancy (see `_shared-context.md`), not abstract best practice: a decision passes when it
survives an interviewer's "why?", and a gap matters in proportion to how likely one is to probe it.

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
6. **Enterprise-gap sweep (§10/§15/§20)** — the plan addresses, **or documents as a deliberate §20
   tradeoff**, the gaps an interviewer probes first. Silence on any of these fails; a one-line
   documented tradeoff passes:
   - **Pagination** on any collection endpoint that grows unboundedly (`Pageable`/`Page<T>`, or a §20
     line saying why the MVP returns everything).
   - **Token expiry** — the JWT lifetime is stated, and the plan says what the frontend does on a 401
     mid-session (interceptor behaviour), not just at login.
   - **Validation error contract** — the field-level error body shape (`@Valid` →
     `MethodArgumentNotValidException`) is defined in §10, so the frontend forms know what they consume.
   - **Environment config in the Docker step** — secrets and DB credentials as env vars in the compose
     file, and how the app's properties differ per environment (profile / override), stated in the §15
     Docker step's bullets.
   - **Schema evolution** — migrations (Flyway/Liquibase) at least named as the rejected option in §20
     if the project relies on `ddl-auto`.
7. **Frontend rules are rules, not labels (§6)** — take any two entries from §6's Angular block and ask:
   *could a reviewer open a file and say "this one breaks it"?* If the answer needs interpretation, the
   entry is a label and fails — the failure mode is pattern names that constrain nothing.
8. **State ownership is decided, not discovered (§13)** — every endpoint consumed by more than one page
   has its ownership line, and the choice is consistent with §6's state-ownership rule. Two pages
   independently fetching the same data is a valid answer; *not answering* is not.
9. **Frontend interview test (§6/§13/§20)** — the mirror of check 5, applied to the frontend. At least
   one §20 tradeoff is a frontend decision (state management, component library, fetching strategy) and
   its reason survives an interviewer's "why?". "The app was small enough that a signal in a service
   beat the ceremony of a store" passes; "Angular recommends it" and "it is the modern way" fail.
