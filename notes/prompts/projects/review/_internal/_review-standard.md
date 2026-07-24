# Project review standard — the shared contract

**Internal component. Not runnable.** This is the single source of truth for **reviewing a built
project**: code quality, patterns, security, correctness, tests, learning objectives, and how findings
become backlog tasks. The pieces of the review pipeline read it:

- `_review-flow-prompt.md` (the **per-slice functional reviewer**) reads the code-quality checklist, the
  correctness scope, and the test-quality scope — it runs all three lenses on **one vertical slice** (a
  backend resource's `model→repository→service→controller→DTO→tests` flow, a frontend feature, or a
  cross-cutting area).
- `_review-security-prompt.md` (the **per-slice security reviewer**) reads the security scope + finding
  format — it hunts **one slice** (a resource's endpoints, or the cross-cutting `security-infra`).
- `review-audit.md` (the **orchestrator**) reads the gate, the learning-objectives rubric, the
  task/priority/effort rules, and the backlog format. It maps the slices and merges every slice's
  findings.

The review is split by **vertical slice** so no reviewer ever holds the whole codebase. Per slice it
asks: **is it clean and does it use the planned patterns? does it do the wrong thing on a real input?
does its test suite actually catch a regression?** (all three = the flow reviewer), and separately **can
it be attacked?** (the security reviewer). None of them edits the code — Victor fixes everything himself
to learn.

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
- **Angular-only projects (01–06)** — feature-complete, but still portfolio pieces worth improving. They
  get the **frontend half** of the review: frontend flow slices, the learning-objectives pass, and a
  `PROJECT-BACKLOG.md` of their own. **No security pass** — there is no backend to attack, and a
  frontend-only Angular app has no server-side attack surface this review can meaningfully audit. Their
  backlog carries only `[frontend]` tasks and only a `**Last Reviewed — frontend:**` line (the backend
  line is written as `n/a — Angular-only`).

Derive the type from the project number (01–06 Angular-only, 07+ full-stack); do not ask.

---

## The 30-day gate — per tier

`PROJECT-BACKLOG.md` lives inside the project folder (`{PROJECT_PATH}/PROJECT-BACKLOG.md`) and is the
**single source of truth for whether a project has been reviewed**. There is no root-level index — the
state lives with the thing it describes, and duplicating the date anywhere else only creates drift.

Because `REVIEW_SCOPE` can review one tier at a time, "reviewed" is **not** a yes/no for the project —
it is tracked **per tier**. The backlog header carries one line per tier:

```
**Last Reviewed — backend:** 2026-07-06
**Last Reviewed — frontend:** never
```

`never` means that tier has never been reviewed. **A missing `PROJECT-BACKLOG.md` means the project has
never been reviewed at all** — that is how "has this been reviewed?" is answered.

**Apply the gate only to the tiers this run will actually review** (per `REVIEW_SCOPE`; a `full` run
gates on both):
- Every tier in scope was reviewed within the last 30 days → **stop**: "Backend last reviewed on [date],
  < 30 days ago — skipping. Reply FORCE to run anyway."
- Some tiers in scope are stale (> 30 days) or `never` → **continue, but only for those tiers**, and say
  which ones you are skipping and why.
- No header, no file, or the tier says `never` → continue.

A tier is only "freshly reviewed" once a run actually covered it. A `backend` run never refreshes the
frontend date, so it can never make the frontend look reviewed when it is not.

On an **Angular-only project (01–06)** the same gate applies, but there is only one real tier: gate on
the `frontend` line, and leave the backend line as `n/a — Angular-only`.

### The gate measures *unreviewed code*, not elapsed time — check the steps before the date

The 30-day window exists to stop you re-reviewing the **same** code, not to stop you reviewing **new**
code. So before applying it, compare the tier's date against the work done since:

**If any step was completed after that tier's "Last Reviewed" date, the gate does not apply to that
tier — continue, regardless of how recent the date is.** Read the ✅ steps in PLANNING.md's learning plan
and the step-completion dates recorded in `PROGRESS.md` / the backlog's own task notes; if the tier has
gained a step since it was last reviewed, it contains code no reviewer has ever seen. Say so and run.

> **This is the failure the rule exists to prevent.** On 2026-07-14 a `backend` run on 07-timetrack was
> gated at "reviewed 8 days ago" — but Step 6 (Reports) had been *built* in those 8 days and had never
> been reviewed. Forcing past the gate found, in that unreviewed step, a High correctness bug (the report
> aggregates summed DRAFT and REJECTED hours). A purely time-based gate punishes fast building: the more
> steps you finish inside the window, the more unreviewed code it hides.

Only when the tier has gained **no** completed step since its last review does the 30-day window decide.

> **Migration:** a backlog still carrying the old single `**Last Reviewed:** [date]` line was written
> before per-tier tracking. Read it as *both* tiers reviewed on that date, and rewrite the header into
> the two-line form on the next run.

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
An inconsistent codebase reads as junior even when each piece is individually fine.

> **Who runs this check: the dedicated consistency reviewer, not the slice reviewers.** Consistency is a
> property *between* slices, so a reviewer holding one slice structurally cannot see it — the reviewer of
> `dashboard-page` has no way to know that `add-transaction-page` solves the same problem differently.
> This block sat in the standard unexecuted until 2026-07-14, when the 03-expense-tracker run made it
> obvious: three slices came back individually fine and nobody was in a position to compare them. So the
> orchestrator dispatches **one cross-slice consistency reviewer per tier** (`review-audit.md` Step 3b),
> which reads *narrowly and across every slice* — only the axes below, never the full code — and it is
> the **only** reviewer allowed to look outside a single slice. Slice reviewers skip this block entirely.

Check:
- Every page that manages state uses the **same** approach (coordinator everywhere, not coordinator on
  one page and ad-hoc `subscribe` on another).
- Every backend service returns **DTOs** at the boundary — not one service returning a DTO and another
  leaking an entity.
- Error handling is **uniform** — the same loading/error signal pattern in every component; the same
  `@RestControllerAdvice` + custom-exception path for every error (no `try/catch` returning a raw string
  in one controller and a proper exception in another).
- **Naming is consistent** — `*Request`/`*Response` for DTOs, `*Service`/`*Repository` suffixes, the
  same casing and verb style across endpoints.
- **Frontend axes** (the ones the consistency reviewer checks on an Angular tier):
  - **State** — every page derives state the same way (signals + `computed()` everywhere, not `computed()`
    on one page and a mutated field on another).
  - **Smart/dumb split** — either the pages decompose into presentational children or they do not; one
    page split into children while another is a monolith holding markup + state + handlers is the
    outlier. (03-expense-tracker: `add-transaction-page` splits out `transaction-form`, `dashboard-page`
    does not — exactly the shape this axis is meant to catch.)
  - **Persistence / side effects** — the same mechanism everywhere (`effect()` in the service, not
    `effect()` in one place and imperative `setItem()` calls sprinkled through mutators).
  - **Styling** — every component sources colour/spacing from the same theme tokens; a component with
    raw hex while its siblings use `var(--token)` is the outlier.
  - **Empty / loading / error states** — present and shaped the same way on every page that can be empty
    or can fail; one page with an `@empty` block and another with nothing is a Medium finding.
- Any place that departs from the pattern used everywhere else is a **Medium** finding (High if it
  breaks the DTO boundary or leaks an entity) — name both the outlier and the convention it should follow.

**Design-guide adherence (Angular / frontend)** — the built UI must follow the project's own design doc
in PLANNING.md §14 (UI design). Check the components against it:

> **Projects 01–06 have no §14** — the old Angular PLANNING format predates it, so there is no palette or
> wireframe to compare against and this check has no contract to enforce. Do **not** report the missing
> section as a finding and do not silently skip the whole block: **degrade it** to the parts that need no
> design doc — hardcoded hex vs a shared theme token, and whether every page that can be empty or can
> fail actually renders an empty/error state. From 08 on, §14 exists and the full check below applies.
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

**Accessibility (frontend — read the templates, not just the TypeScript)** — every project here has forms
and icon buttons, and a11y is the cheapest quality signal a reviewer picks up on. Four checks, all from
the template:
- Every form input has a `<label for>` (or `aria-label`) bound to it — a `<placeholder>` is not a label;
  it disappears on focus and screen readers do not announce it. **Medium**.
- Every icon-only button (a `×` delete, a burger menu) has an accessible name — `aria-label="Delete
  transaction"`. Without it a screen reader announces "button". **Medium**.
- Validation errors are associated with their field (`aria-describedby` pointing at the error element),
  not just rendered next to it visually. **Low**.
- Interactive elements are real interactive elements — a `<div (click)>` is not keyboard-reachable and is
  a **Medium** finding; it should be a `<button>`.

**Frontend security (Angular-only 01–06 — there is no cold security pass, so these live here)** — the
absence of a backend removes the server-side attack surface, **not** all of it. Three targeted greps over
the slice, and report what they hit:
- `innerHTML` / `[innerHTML]` binding — the one Angular escape hatch that bypasses built-in escaping.
  Rendering anything user-supplied through it is an XSS hole and is **High**.
- `bypassSecurityTrustHtml` / `bypassSecurityTrust*` — explicitly disables Angular's sanitizer. **High**
  unless the input is a hardcoded constant.
- `localStorage` / `sessionStorage` — flag anything sensitive stored there (tokens, personal data); it is
  readable by any script on the origin. Storing the app's own non-sensitive domain data is fine.
Clean greps are a one-line "no findings", not a skipped check — the point is that the exclusion is
verified, not assumed.

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

**Tests** — reviewed **in the same slice** as the code they cover: the per-slice flow reviewer runs the
"Test-quality scope — the test review" lens (below) on that slice's own tests, alongside the quality and
correctness lenses. A resource's tests are judged together with the resource's flow, never as a separate
whole-project pass.

---

## Security scope — the cold pass

The checklist above catches known failure modes but is a fixed list. Full-stack projects also get an
**adversarial, systematic pass**: a cold reviewer with an attacker's mindset reads the real code against
the full junior security scope in `notes/security/coverage/junior.md` and hunts for what the checklist does not
name — missing/inconsistent authorization, missing ownership checks (can user A read/edit user B's data
by changing an id?), entities leaking past the DTO boundary (password hashes, internal fields), secrets
in committed files, JWT design flaws, CORS config, input-validation gaps, SQL-injection surface (native
queries, string concatenation), error responses that leak internals. Judged against what the code
actually does, not a generic list.

### What "confirmed" means — the orchestrator arbitrates, and this is the test

"Every security finding is High" is only safe once *confirmed* is defined, or every design decision the
plan forgot to make gets filed as a vulnerability and the High tier inflates until it stops meaning
anything. A finding is **confirmed** — and therefore **High** — when either holds:

- **It breaks a contract PLANNING makes.** The plan promises X, the code does not do X. (Example: §10 says
  "employees see active projects only"; `getById` returns inactive ones to an employee. That is a real
  broken-authorization bug, whatever the reviewer graded it.)
- **It violates a universal security invariant**, whether or not the plan mentions it: missing
  authorization on an endpoint, ownership not checked on an id from the request, a password hash or
  internal field crossing the DTO boundary, injection surface, a secret in a committed file, an error
  response leaking internals. These need no contract — they are wrong everywhere.

When **the plan is simply silent** and no invariant is broken, it is **not a vulnerability — it is a
decision you never made.** File it **Medium**, worded as *"decide and document"*, and say which section of
PLANNING should record the answer. (Example: nothing in §8 forbids a manager approving their own entry.
The code is not violating a rule; the rule does not exist. Segregation of duties may well be the right
answer — but the fix is a decision in §8, then code, not a High that blocks portfolio-ready today.)

**The orchestrator decides this, not the slice reviewer.** A reviewer sees one slice and cannot know
whether the plan speaks to the issue elsewhere; the orchestrator has read PLANNING and holds every table.
So it **overrides the reviewer's grade in both directions** — up, when a reviewer under-grades a real
contract break (this happened on 2026-07-14: `getById` came back Medium and was raised to High), and down
is not needed, because a reviewer's High that turns out to rest on a silent plan becomes a Medium
"decide and document". Record the reason in the task line so the grade is auditable.

Every confirmed vulnerability becomes a **High** task in the backlog (a security hole looks unprofessional
faster than any missing feature). The "Related coverage item" column ties each finding to
`notes/security/coverage/junior.md`, so fixing the task doubles as interview prep on that item. Hardening beyond
junior scope goes in the chat summary, not the backlog.

---

## Correctness scope — the bug hunt

The code-quality checklist catches *structural* problems (wrong layer, `any`, missing loading state) and
whether each business rule is enforced *at all*. It does **not** catch a rule enforced with the wrong
comparison, an edge case that returns garbage, or a state transition that should be blocked but is not.
So the per-slice flow reviewer also runs an **adversarial correctness lens** with a QA "break-it"
mindset: it traces realistic inputs and states through its slice's real code and hunts for logic bugs —
null/`Optional` mishandling, edge cases (empty/first/last/zero/negative/boundary date), inverted or
off-by-one conditions, state-machine violations, lifecycle/ordering bugs, numeric/date errors, and
swallowed or unshown errors. Judged against the intended behaviour in PLANNING.md (§8 business rules and
state machine), not a generic list.

**Data representation is part of this lens.** The bugs above are all "the logic is wrong"; these are "the
logic is right but the *type* cannot hold the answer", and no other lens looks for them because they
break no business rule — they are a decision, not a mistake. Check three, every time:
- **Money in a floating-point `number`** — `0.1 + 0.2 === 0.30000000000000004`. Any app that sums,
  averages or compares currency (an expense tracker, an invoice total, a payroll report) accumulates
  error across a `computed()` or a `SUM`, and shows phantom céntimos. Flag it wherever amounts are
  aggregated; the fix is integer minor units (cents) or `BigDecimal` on the backend.
- **Dates without a timezone** — `new Date().toISOString().split('T')[0]` yields the **UTC** date, so in
  Spain (UTC+1/+2) it returns *yesterday* between local midnight and 1–2am. Any "today" default, date
  comparison, or date-only field built this way is wrong on a normal daily path, not an edge case.
- **Ids that are not unique** — `Date.now()` as an id collides on two actions inside the same
  millisecond (a fast double-submit), and every later lookup/delete by that id then hits both rows.

Each finding names the **concrete trigger** and the **wrong result** — a bug without a reproducible
trigger is a guess. A correctness bug that a user or interviewer hits on a normal path is **High**
(the app looks correct but is not); a bug on a rarer edge path is Medium; a latent one needing an
unlikely combination is Low.

---

## Test-quality scope — the test review

> **Projects 01–06 have no tests, by design — never report their absence.** Per the shared session rules ("Testing
> rules"), testing enters the roadmap at project **07** (services) and project **08** (components). In
> 01–06 the `.spec.ts` files are untouched Angular CLI scaffold: an empty `should create` is the expected
> state. In 07, component tests are likewise out of scope. Missing tests, empty specs and weak assertions
> in an out-of-scope project are **not findings** — write "tests — out of scope for this project" instead.
> This lens is skipped entirely there; the flow reviewer runs only the quality and correctness lenses.

Projects with tests (07 onward): the per-slice flow reviewer runs a **test-quality lens** on its
slice's own tests, against the plan's §16 Testing plan and this bar. It reads the slice's test files
together with the classes they cover. A test suite that looks green but asserts nothing is worse than no
tests — it hides regressions. Check:

- **Coverage vs the plan (§16)** — every service class in §16 has ≥1 unit test; **every business rule
  in §8 has a test that proves it is enforced**; the slice tests §16 promised (`@WebMvcTest` /
  `@DataJpaTest`) exist. A planned test that is missing is **High** (from project 07 on, no tests = not
  finished).
- **Edge cases, not just happy path** — each class covers the plan's edge cases (entity not found,
  business-rule violation, role/ownership check, empty/boundary input). A service tested only on the
  happy path is Medium — **High if the untested path is a business rule** (the app silently violates it).
- **Assertion quality** — each test asserts real behaviour: the returned value, or the saved object's
  state. `verify(repo).save(any())` with no assertion on *what* was saved is a finding. No trivial
  "it exists" / "not null" tests that would pass on broken code.
  - Bad: `verify(repository, times(1)).save(any())` and nothing else.
  - Good: assert the return value, or capture the saved object and assert its state.
- **Mockito hygiene** — mocks stub only what the method under test needs; the right thing is mocked (the
  repository, not the class under test); no over-mocking that ends up testing the mock.
- **Structure & readability** — clear arrange/act/assert; test names say what they check
  (`create_throwsWhenProjectInactive`, not `test1`); no logic inside tests.
- **Angular** — services use `HttpClientTestingModule` and assert the request (URL, method) + the mapped
  response; component tests (from 08) assert rendered state and emitted events, not just that the
  component was created.

Priorities: a missing planned test or an untested §8 business rule is **High**; a weak assertion or a
missing edge case is Medium; naming / structure polish is Low.

---

## Learning-objectives rubric

For each concept planned in PLANNING.md §3 (new) and §4 (review), check the code and mark:
- ✅ **Demonstrated** — the code shows clear understanding.
- ⚠️ **Shallow** — present but not used meaningfully.
- ❌ **Missing** — not implemented.

**A pattern made of several pieces is ✅ only when every piece is there.** Many planned concepts are
not a single symbol but a combination — two selectors, a provider plus its use, a `clone()` plus the
`setHeaders` it carries, a signal plus the `effect()` that persists it. Finding *part* of the
combination is **⚠️ Shallow, not ✅** — say which piece is missing, and file the gap as a task. Before
marking ✅, re-read the concept as the plan words it and check each piece it names separately; a
partial match must never be rounded up to complete.

> **The failure this exists to prevent.** On the 2026-07-16 run of 06-hr-portal, the plan's "App shell
> scroll fix" is `html, body { height: 100% }` + `app-root { overflow: hidden }`. The reviewer found
> `body { height: 100% }` and `app-root { overflow: hidden }`, matched two pieces out of three, and
> marked the concept ✅ at `styles.css:23,32` — but `html` has no height anywhere, so the `body`
> percentage never resolves and the fix does nothing. It was caught only because another slice
> happened to read the same file and disagree. Nothing guarantees that second reader exists: a
> rounded-up ✅ that no one contradicts reaches the backlog unchallenged, and a concept Victor never
> actually finished gets recorded as learned.

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

**PROJECT-BACKLOG.md** contains: a **per-tier "Last Reviewed" line** (see the gate above — `backend` and
`frontend`, each a date or `never`; on Angular-only projects the backend line is `n/a — Angular-only`)
· an overall quality rating (Strong / Good / Needs work, one
sentence) · the task list as checkboxes. Task line:
`- [ ] **[Priority]** — [Task description] *(Effort: [Small/Medium/Large])*`

**Tag every task with the tier it belongs to** (`[backend]` / `[frontend]`) right after the priority, so
a partial-scope run can rewrite its own tier's tasks and leave the other tier's untouched:
`- [ ] **[High]** `[backend]` — [Task description] *(Effort: [Small])*`

Preserve tasks already checked off (✅) — never delete completed items; only update or add. The backlog
lives in the project folder, so it follows the project's normal **feature-branch → PR → main** workflow
— it is **not** a direct-to-main study file and is **not** auto-committed.
