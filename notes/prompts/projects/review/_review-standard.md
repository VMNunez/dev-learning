# Project review standard — the shared contract

**Internal component. Not runnable.** This is the single source of truth for **reviewing a built
project**: code quality, patterns, security, learning objectives, and how findings become backlog
tasks. All pieces of the review pipeline read it:

- `review-code-prompt.md` (the **code reviewer**) reads the code-quality checklist and the
  learning-objectives rubric.
- `review-security-prompt.md` (the **security reviewer**) reads the security scope + finding format.
- `review-correctness-prompt.md` (the **bug-hunter**) reads the correctness scope + finding format.
- `review-audit.md` (the **orchestrator**) reads the gate, the task/priority/effort rules, and the
  backlog format.

The three reviewers ask three different questions of the same code: **is it clean and does it use the
planned patterns?** (code), **can it be attacked?** (security), **does it do the wrong thing on a real
input?** (correctness). None of them edits the code — Victor fixes everything himself to learn.

## What the review is for

It reviews a **built** project against the contract its own `PLANNING.md` set — not against a generic
standard. It produces a prioritized list of **improvement tasks** written to
`{PROJECT_PATH}/PROJECT-BACKLOG.md`. That backlog is what the portfolio gate (`portfolio-audit`) reads
to decide go/no-go, so a security hole found here becomes a **High** task that blocks portfolio-ready.

Chain: `plan-audit` → build → `readme-audit` → **this review** → `portfolio-audit`.

---

## Two project formats

- **Full-stack projects (07+)** — Spring Boot + Angular + PostgreSQL. Get the full review: frontend +
  backend code, the **cold security pass**, and a `PROJECT-BACKLOG.md`.
- **Angular-only projects (01–06)** — closed. No `PROJECT-BACKLOG.md`, no security pass. If reviewed at
  all it is **informational only** — report findings in chat, write nothing, no commit.

Derive the type from the path prefix (`angular/` vs `projects/`); do not ask.

---

## The 30-day gate (full-stack only)

`PROJECT-BACKLOG.md` lives inside the project folder (`{PROJECT_PATH}/PROJECT-BACKLOG.md`). Read its
"Last Reviewed" date:
- Within the last 30 days → **stop**: "Last reviewed on [date], < 30 days ago — skipping. Reply FORCE
  to run anyway."
- Older than 30 days, or the file does not exist → continue.

---

## Scope limit — apply before reviewing any code

Read PLANNING.md §0 (Session quick reference) for the current step. **Only review code belonging to
completed steps.** For steps not started, write "Step X — not yet built, out of scope" and move on.
Never flag a missing feature as an issue if it belongs to a future step. (Projects 01–06 are fully
complete, so the scope limit does not restrict them.)

PLANNING.md is matched by **heading text, not number**. For 07+, extract: current step (§0), new
concepts (§3), review concepts (§4), business rules, testing plan, architecture decisions. For 01–06,
read the "Key patterns introduced" table and listed objectives instead.

---

## Code-quality checklist

**Patterns** — the project's learning-objective patterns come from **its own PLANNING.md** (§3 new
concepts, §6 architecture, and the architecture-decisions section) — derive them per project, never
rely on a fixed list. Is each pattern actually used, and used *meaningfully* (not just name-dropped)?
Past projects illustrate the shape to expect, but for 08+ read the plan: 03 smart/dumb components · 04
`effect()` for signal-driven side effects · 05 coordinator pattern (coordinator owns state, children
receive+emit) · 06 auth guard, role guard, interceptor, CanDeactivate guard · 07 layered architecture
(controller → service → repository), DTOs, JWT filter, `SecurityContextHolder` for the current user,
PATCH for state transitions.
- Signals used correctly (no needless subscriptions where a signal works)? Services single-responsibility?

**Pattern consistency across the project** — the same problem must be solved the same way everywhere.
An inconsistent codebase reads as junior even when each piece is individually fine. Check:
- Every page that manages state uses the **same** approach (coordinator everywhere, not coordinator on
  one page and ad-hoc `subscribe` on another).
- Every backend service returns **DTOs** at the boundary — not one service returning a DTO and another
  leaking an entity.
- Error handling is **uniform** — the same loading/error signal pattern in every component; the same
  `@RestControllerAdvice` + custom-exception path for every error (no `try/catch` returning a raw string
  in one controller and a proper exception in another).
- **Naming is consistent** — `*Request`/`*Response` for DTOs, `*Service`/`*Repository` suffixes, the
  same casing and verb style across endpoints.
- Any place that departs from the pattern used everywhere else is a **Medium** finding (High if it
  breaks the DTO boundary or leaks an entity) — name both the outlier and the convention it should follow.

**Design-guide adherence (Angular / frontend)** — the built UI must follow the project's own design doc
in PLANNING.md §14 (UI design). Check the components against it:
- Colours come from the §14 **palette** (role/status → hex), not arbitrary hardcoded hex values
  scattered across templates. Repeated raw hex that should be a theme token is a finding.
- The pages match their §14 **wireframes** in layout and the **empty/loading/error states** the
  wireframe specified — a page missing its planned empty state is a Medium finding.
- The Material components used are the ones §14 planned (not a random mix). Flag any page that ignores
  the design doc — the point of writing §14 before coding is that the code follows it.

**TypeScript** — any `any` where a real type belongs? Interfaces for all data shapes? Optional fields
marked `?`?
- Bad: `getUser(): any { return this.http.get('/api/user'); }` — loses all type safety.
- Good: `getUser(): Observable<UserResponse> { return this.http.get<UserResponse>('/api/user'); }`

**Error handling** — loading states (`isLoading` signal)? error states (`hasError` signal)? HTTP errors caught?

**Code cleanliness** — leftover `console.log` (High — signals no cleanup)? commented-out blocks
(remove or justify)? unresolved TODO/FIXME? hardcoded magic values that should be constants/config?

**Angular-specific:**
- Memory leaks? (`takeUntilDestroyed` with subscriptions.)
- Needless `ngOnInit` where `inject()` in the constructor body works?
- Reactive form validation wired (`touched` + `hasError()`)?
- Parallel API calls (e.g. dashboard stat cards) using `forkJoin`? Sequential `.subscribe()` where
  `forkJoin` fits is a quality issue.
- Bad: component constructor calls `this.http.get('/api/tasks').subscribe(...)` — HTTP belongs in a service.
- Good: component calls `this.taskService.getTasks()` — HTTP stays in the service; component stays testable.

**Backend-specific (full-stack only):**

*Architecture* — controller only handles HTTP (no business logic)? services hold business logic (no
SQL in services)? DTOs at the boundary (entities not returned)? `@Valid` on request bodies?
`@ControllerAdvice` for global errors?
- Bad: controller does `if (result.isEmpty()) throw new RuntimeException("Not found")` — logic in the wrong layer.
- Good: exception thrown in the service, caught by `@RestControllerAdvice` — controller only delegates.

*Security (quick checklist — the cold pass goes deeper)* — JWT secret from an env var (not hardcoded)?
passwords BCrypt-hashed (not plain text)? service uses `SecurityContextHolder` for the current user?
- Never trust a `userId` from the request body — a client can send any id.
- Bad: `public TimeEntry create(CreateEntryRequest req) { ... req.getUserId() ... }` — privilege escalation.
- Good: `String email = SecurityContextHolder.getContext().getAuthentication().getName();` — the server decides who the user is.

*application.properties / .yml* — all credentials from env vars (`DB_PASSWORD`, `DB_USERNAME`,
`JWT_SECRET`)? `ddl-auto` is `update`/`validate`, never `create-drop` (drops the schema every restart)?
`show-sql=true` intentional (flag if left on — floods prod logs)?

*HTTP verbs* — state transitions (submit/approve/reject) use PATCH? PUT/POST for a status change signals
the candidate does not understand REST verb semantics.

*Business rules* — every rule in PLANNING.md actually enforced in the service layer? Common gaps: future
date check, hours range, inactive-project check, DRAFT-only edit/delete, role-based filtering (employee
sees own, manager sees all). Each missing rule is **High** — the app looks correct but silently violates.

*Seed data (if `data.sql` exists)* — `ON CONFLICT DO NOTHING` (safe to re-run)? password a pre-generated
BCrypt hash (not plain text)?

*Docker (if `docker-compose.yml` exists)* — both services (app + PostgreSQL)? named volume so data
survives restarts? JWT secret passed as env var (not hardcoded)? `docker-compose up` starts both without
manual steps?

**Tests** — check against PLANNING.md's Testing plan.
- Are the service classes in the plan actually tested?
- Each test covers the plan's edge cases (entity not found, business-rule violation, role violation) —
  not just the happy path?
- Assertions check real behaviour, not just that a method was called?
  - Bad: `verify(repository, times(1)).save(any())` with no assertion on the saved object.
  - Good: assert the return value, or that the saved object has the expected state.
- Any trivial "it exists" tests that verify nothing?
- From project 07 on: every service class needs ≥1 unit test with ≥1 edge case. No tests = not finished.

---

## Security scope — the cold pass

The checklist above catches known failure modes but is a fixed list. Full-stack projects also get an
**adversarial, systematic pass**: a cold reviewer with an attacker's mindset reads the real code against
the full junior security scope in `notes/security/coverage.md` and hunts for what the checklist does not
name — missing/inconsistent authorization, missing ownership checks (can user A read/edit user B's data
by changing an id?), entities leaking past the DTO boundary (password hashes, internal fields), secrets
in committed files, JWT design flaws, CORS config, input-validation gaps, SQL-injection surface (native
queries, string concatenation), error responses that leak internals. Judged against what the code
actually does, not a generic list.

Every confirmed vulnerability becomes a **High** task in the backlog (a security hole looks unprofessional
faster than any missing feature). The "Related coverage item" column ties each finding to
`notes/security/coverage.md`, so fixing the task doubles as interview prep on that item. Hardening beyond
junior scope goes in the chat summary, not the backlog.

---

## Correctness scope — the bug hunt

The code-quality checklist catches *structural* problems (wrong layer, `any`, missing loading state) and
whether each business rule is enforced *at all*. It does **not** catch a rule enforced with the wrong
comparison, an edge case that returns garbage, or a state transition that should be blocked but is not.
Full-stack **and** Angular projects also get an **adversarial correctness pass**: a cold reviewer with a
QA "break-it" mindset traces realistic inputs and states through the real code and hunts for logic bugs —
null/`Optional` mishandling, edge cases (empty/first/last/zero/negative/boundary date), inverted or
off-by-one conditions, state-machine violations, lifecycle/ordering bugs, numeric/date errors, and
swallowed or unshown errors. Judged against the intended behaviour in PLANNING.md (§8 business rules and
state machine), not a generic list.

Each finding names the **concrete trigger** and the **wrong result** — a bug without a reproducible
trigger is a guess. A correctness bug that a user or interviewer hits on a normal path is **High**
(the app looks correct but is not); a bug on a rarer edge path is Medium; a latent one needing an
unlikely combination is Low.

---

## Learning-objectives rubric

For each concept planned in PLANNING.md §3 (new) and §4 (review), check the code and mark:
- ✅ **Demonstrated** — the code shows clear understanding.
- ⚠️ **Shallow** — present but not used meaningfully.
- ❌ **Missing** — not implemented.

---

## Improvement-task + backlog format

Each task must be **specific** ("add error state to the login form", not "improve error handling"),
carry a **priority** and an **effort**, and be actionable on its own (note any dependency explicitly).

- **Effort:** Small (< 30 min) · Medium (30–90 min) · Large (> 90 min).
- **Priority:**
  - **High** — makes the project look unprofessional/incomplete to a recruiter or interviewer, or is a
    security or correctness issue. *Every confirmed security finding is High.*
  - **Medium** — a genuine improvement that adds portfolio value.
  - **Low** — polish, nice-to-have, minor clarity. (Low does not affect the portfolio verdict.)

**PROJECT-BACKLOG.md** contains: "Last Reviewed" date · an overall quality rating (Strong / Good / Needs
work, one sentence) · the task list as checkboxes. Task line:
`- [ ] **[Priority]** — [Task description] *(Effort: [Small/Medium/Large])*`

Preserve tasks already checked off (✅) — never delete completed items; only update or add. The backlog
lives in the project folder, so it follows the project's normal **feature-branch → PR → main** workflow
— it is **not** a direct-to-main study file and is **not** auto-committed.
