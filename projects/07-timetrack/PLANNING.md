# Project 07 — TimeTrack

A timesheet app where employees log hours worked on projects.
Managers review the entries and approve or reject them.

---

## 0. Session quick reference

Update this table at the start of every session. It is the authoritative pointer to the live step.

| | |
|---|---|
| **Current step** | G3 backend backlog fix (not a §15 step). **Every High task is closed and `reopen` is built — G3's sign-off condition is met.** Work continuing on the branch is Medium/Low backlog, which G3 does not require (G7 does). **Step 7a — Angular shell + auth is the next learning step, but one Medium gates it:** the account-password flow (`SecureRandom` + `CreateUserResponse` + `PATCH /api/users/me/password`) must be built and merged first — Step 7a's shell ships the dialog that calls it. Every *other* Medium/Low can wait for G7 |
| **Current branch** | `fix/backend-backlog` (§22 "Backlog-fix branches" — `feat/angular-shell-auth` is not opened yet; it is created from `projects/07-timetrack` when this branch merges) |
| **Done condition** | ✅ met — `Postman: PATCH /api/entries/{id}/reopen on a REJECTED own entry returns 200 — status DRAFT` (verified 2026-07-22), and every High backend task in `PROJECT-BACKLOG.md` is `[x]`. Step 7a's own done condition takes over next, exactly as §15 states it: `Browser: login at localhost:4200 redirects to /dashboard inside the shell; a wrong password shows the mat-error under the form while the button spins during the call; the toolbar user menu opens the change-password dialog and a wrong current password shows the error under that input with the dialog open and the session intact, while a correct one closes it and the new password logs in; /projects as EMPLOYEE redirects away; a request with an expired token returns the user to /login` |
| **Next gate** | G3 sign-off — **unblocked**: the backend review has run and all its High tasks are fixed. Signing off = PR `fix/backend-backlog` into `projects/07-timetrack`. G4 (frontend review) follows when `feat/angular-manager-pages` merges |
| **Phase** | Backend backlog / G3 sign-off — Frontend (Phase 5) starts at Step 7a |
| **Last updated** | 2026-07-29 |

---

## 1. Project title and one-line description

**TimeTrack** — a timesheet app where employees log the hours they work on company projects and
managers review each entry, approving or rejecting it with a note.

Used by two roles: **employees**, who create, edit and submit their own time entries, and
**managers**, who own the projects and the team, approve or reject submitted hours, and read the
monthly hours reports.

---

## 2. Why this project

- The workflow pattern (DRAFT → SUBMITTED → APPROVED / REJECTED) appears in almost every enterprise app
- Role-based authorization in Spring Security is a skill used in every Spring Boot project
- Spanish consultancies use timesheet tools every day — this domain is immediately relatable to interviewers
- It is rare in junior portfolios — most people build finance trackers or todo apps
- It adds what project 06 could not show: 06 was Angular-only against a mock service, so this is the first
  project with a backend Victor wrote — a real REST API, a database schema, server-side authorization and a
  JSON contract two independent apps agree on

---

## 3. New concepts

Concepts this project teaches for the first time. (Steps 1–3 are now done and already recorded in PROGRESS.md; they are kept here so the table reflects the whole project scope.)

| Concept | Topic | Why this project teaches it |
|---|---|---|
| Layered architecture (Controller → Service → Repository) | Architecture | First backend; the layer split is the backbone of every Spring app |
| REST API + SPA separation (backend with no View layer) | Architecture | First split into two independent apps sharing only a JSON contract — the reason this is not classic MVC |
| `@Entity` / JPA mapping to PostgreSQL | Spring Boot | First time mapping Java classes to tables |
| `JpaRepository` + derived query methods | Spring Boot | CRUD without SQL; `findByEmail` style finders |
| DTO request/response boundary | Spring Boot | Entities never leave the service layer |
| `Optional<T>` for "may not exist" returns | Java | Repository finders return it; the service turns an empty one into a 404 instead of a `NullPointerException` |
| Custom unchecked exceptions (`ResourceNotFoundException`, business-rule violations) | Java | How a service signals "not found" / "illegal transition" without returning error codes |
| Spring Security + JWT stateless auth | Security | Standard auth in every Spring Boot job |
| `SecurityContextHolder` to read the authenticated user | Security | Ownership is resolved from the JWT, never from a client-supplied `userId` |
| `@PreAuthorize("hasRole(...)")` role checks | Security | Method-level authorization after the JWT filter |
| `@ManyToOne` / `@OneToMany` relationships | Spring Boot | TimeEntry → User and → Project foreign keys |
| State machine workflow (DRAFT→SUBMITTED→APPROVED/REJECTED) | Architecture | Most valuable pattern in a junior portfolio |
| PATCH for state transitions | Spring Boot | Signals that only `status` changes, not the whole resource |
| Query filters with `@RequestParam` | Spring Boot | `?month=`, `?status=`, `?projectId=` on GET /api/entries |
| `Specification<T>` + `JpaSpecificationExecutor` (Criteria API) | Spring Boot | Dynamic optional filters on GET /api/entries — the JPQL `IS NULL OR` pattern hit a real PostgreSQL bug (`42P18`, can't infer parameter type), Specifications build predicates only for filters actually present |
| Bean Validation (`@Valid` + `@NotNull` / `@NotBlank`) on request DTOs | Spring Boot | Field-level 400s at the controller boundary, before any service logic runs |
| JPQL aggregation queries | Spring Boot | Reports — hours grouped by project and by employee |
| Interface projections for query results | Spring Boot | Report rows mapped straight from `SELECT ... AS alias` — no class, no manual mapping |
| `@RestControllerAdvice` GlobalExceptionHandler | Spring Boot | Consistent JSON error bodies |
| Profile-gated startup seeding (`CommandLineRunner` + `@Profile`) | Spring Boot | First manager account with no register endpoint — seeded in Java so the credential comes from an env var at runtime instead of a hash committed in `data.sql` |
| JUnit 5 + Mockito unit tests | Java | First backend tests — JUnit and Mockito are plain Java libraries, usable with no Spring context at all, so the concept files under Java even though the class under test is a Spring service |
| Angular consuming a real REST API end to end | Angular | First time the frontend talks to a backend you built |
| Docker + docker-compose | Deployment | One command runs app + database locally |

---

## 4. Review concepts

Concepts from earlier projects this project reinforces.

| Concept | Originally learned in | How this project uses it again |
|---|---|---|
| JWT auth flow | Project 06 (frontend side) | Now built on the backend — full round trip |
| Route guards (`authGuard`, role guard) | Project 06 | `authGuard` + `managerGuard` on protected routes |
| HTTP interceptor | Project 06 | Attaches the JWT to every request |
| Role-aware UI | Project 06 | Same route, different data per role (Entries page) |
| Coordinator (smart/dumb) pattern | Projects 03 / 05 | Each page owns state; children display and emit |
| Reactive forms + validation | Project 03 | Entry form, user form |
| MatTable + MatDialog | Project 05 | Entries, Projects, Approvals tables and dialogs |
| `forkJoin` parallel requests | Project 02 | Manager dashboard stat cards |
| Signals + `computed()` | Project 01 onwards | Derived stat counts across pages |
| Auth persistence with signal + `effect()` | Project 06 | Token + current user kept in localStorage |
| Soft delete | Project 07 (Step 2) | Reused for users and projects |
| `MatSidenav` app shell | Project 06 | Same fixed toolbar + scrollable content layout |

Every row above comes from an earlier project except **soft delete**, which is the one *intra-project*
reuse: it is introduced here in Step 2 (projects) and then applied again to users in Step 4, so it is
recorded in this table rather than in §3's new-concepts list, where Step 2's single major concept is the
DTO boundary.

---

## 5. Tech stack

| Layer | Technology | Notes |
|---|---|---|
| Backend | Java + Spring Boot | First Spring Boot project; layered architecture |
| Auth | Spring Security + JWT | Stateless; secret from `${JWT_SECRET}` env var |
| Database | PostgreSQL | Local instance via pgAdmin; same DB used in Docker |
| ORM | Spring Data JPA + Hibernate | `JpaRepository` + derived queries; JPQL for reports |
| Frontend | Angular + Angular Material | Teal M3 theme, compact density (§14); Core/Feature/Shared structure |
| Local setup | Docker + docker-compose | App + Postgres in one command (Step 11) |
| Tests | JUnit 5 + Mockito (backend), Jasmine + TestBed (frontend) | Services only — component tests start at project 08 |

---

## 6. Architecture

This project uses **layered architecture** on the backend — not classic MVC.

Classic MVC is used when the backend renders HTML (e.g. Thymeleaf templates).
In this project the backend only sends JSON. Angular is the View — a completely separate app running in the browser.

```
Browser                               Server
┌──────────────────┐                 ┌──────────────────────────────┐
│   Angular App    │   HTTP + JSON   │   Spring Boot API            │
│                  │ ─────────────→  │                              │
│   Components     │                 │   Controller  ← HTTP layer   │
│   Services       │ ←─────────────  │       ↓                      │
│   Models         │   JSON          │   Service     ← business logic│
└──────────────────┘                 │       ↓                      │
                                     │   Repository  ← DB access    │
                                     └──────────────┬───────────────┘
                                                    │
                                          ┌─────────▼──────────┐
                                          │    PostgreSQL       │
                                          └────────────────────┘
```

**Backend layer rules:**
- Controller only handles HTTP — reads the request, calls the service, returns the response. No logic.
- Service contains all business rules — validation, state transitions, role checks.
- Repository only reads and writes data. No logic.
- Controllers never call the repository directly.
- Entities are never returned directly from the API — always map to a DTO first.
- Every resource keeps a separate `Create*Request`/`Update*Request` DTO pair, even when their fields
  are identical today — the two operations are distinct intents, so an update-only field never forces
  a change to the creation contract.
- A business rule is refused with one of the project's **own** exception types, never by hand-throwing a
  framework exception from a lower layer. Spring's `DataAccessException` family (`DataIntegrityViolationException`
  and friends) belongs to `@Repository` translation and means the database rejected the write — a service
  throwing one claims a persistence failure that never happened, and forces its handler to hide the message,
  because when it *is* genuine the text is Hibernate's and names the constraint and the statement.

**Angular rules:**
Same bar as the backend block: each line is violable — a reviewer can open a file and point at the break.
- **State ownership** — the page component under `pages/` owns all state for its route (signals declared
  in the page class). Child components receive data through `input()` and report through `output()`, and
  never inject a `core/services/` service. The one exception is `AuthService`, whose current-user signal
  is app-wide state read directly by the shell and the guards.
- **Shared endpoints** — when two pages read the same endpoint, each page fetches it independently on
  its own load; no cross-page cache. `GET /api/entries?month=` is read by both the dashboard and the
  entries page, and each calls it for itself.
- **Service boundary** — a `core/services/` service does exactly two things: issue the HTTP call and map
  the response to a `shared/models/` interface. It never navigates (`Router` is injected in pages and
  guards only), never opens a dialog or snackbar, and never holds page state. `AuthService` is the single
  exception: it also holds the token + current-user signal, because auth state outlives every page.
- **Component conventions** — every component is `standalone: true`, declares
  `changeDetection: ChangeDetectionStrategy.OnPush`, and gets its dependencies through `inject()`, never
  through a constructor parameter list.
- **Typing** — every `shared/models/` interface mirrors one backend response DTO field for field. No
  `any` at an API boundary: `http.get<TimeEntry[]>(...)` is typed, and a response shape that has no model
  gets one before the call is written.
- **Subscription lifetime** — a template consumes an observable through the `async` pipe; a subscription
  in a class is wrapped in `takeUntilDestroyed()`. A bare `.subscribe()` with no teardown is a defect,
  including in a dialog.
- **Async states** — every page that loads data renders three states explicitly: a `MatProgressSpinner`
  while `loading()` is true, a `mat-error` message plus a retry button when the call fails, and the empty
  message from §14 when the call succeeds with zero rows. A page that renders only the success table is
  incomplete.

**What this is NOT:**
This is not classic MVC. In classic MVC (e.g. Spring Boot + Thymeleaf), the Controller renders HTML and returns it to the browser — the View lives inside the same application.

**What this IS:**
Two completely separate applications that communicate via HTTP:
- Spring Boot is a **REST API** — it only returns JSON, never HTML. It has no View layer.
- Angular is a **SPA (Single Page Application)** — it reads the JSON and builds the UI in the browser.

The Spring Boot backend follows Layered Architecture internally (Controller → Service → Repository). The Angular frontend follows Component Architecture. Neither application knows how the other is built — they only share a JSON contract.

**New architectural patterns vs the previous project (06 — Angular-only):**
Project 06 was frontend-only (Component + Core/Feature/Shared architecture), so everything below is new here — this is the first project with a backend.
- **Layered architecture (Controller → Service → Repository)** — the backbone of every Spring app; each layer has one responsibility so business rules never leak into HTTP handling or DB access.
- **REST API + SPA separation** — backend and frontend are two independent apps sharing only a JSON contract, instead of one app rendering its own View. This is why it is not classic MVC.
- **DTO boundary (Controller ↔ Service)** — a translation layer between persistence and HTTP so the API controls exactly what it exposes and entities never leak across the wire.
- **State machine workflow (DRAFT → SUBMITTED → APPROVED / REJECTED)** — lives in the Service layer; transitions are enforced business rules, not free-form field edits.

On the frontend the architecture is deliberately unchanged from project 06 — same Core/Feature/Shared
layout, same page-owns-state coordinator split, same guard + interceptor pair. Nothing new is invented
there so the novelty budget of this project goes to the backend; what is new for Angular is only the
data source (a real API you built, instead of a mock service).

See [notes/architecture/03-layered-architecture.md](../../notes/architecture/03-layered-architecture.md) for the full layered architecture explanation.

---

## 7. Entities

### User
| Field | Java type | SQL type | Constraints | Notes |
|---|---|---|---|---|
| id | Long | BIGINT | PK, sequence-generated | `@GeneratedValue` (bare `AUTO`) resolves to a Hibernate-managed sequence on PostgreSQL, not native column auto-increment |
| name | String | VARCHAR | not null | Full name shown in the UI |
| email | String | VARCHAR | not null, unique | Used as the login username |
| password | String | VARCHAR | not null | BCrypt hash, never plain text |
| role | Role (enum) | VARCHAR | not null | `EMPLOYEE` or `MANAGER` — stored as string via `@Enumerated(STRING)` |
| active | boolean | BOOLEAN | not null, default true | Soft delete — inactive users cannot log in. Primitive `boolean` initialised to `true`, not `Boolean`: a nullable wrapper unboxes to a `NullPointerException` (500) if a row is ever written outside JPA |
| createdAt | LocalDateTime | TIMESTAMP | not null | Set by `@CreationTimestamp` |

### Project
| Field | Java type | SQL type | Constraints | Notes |
|---|---|---|---|---|
| id | Long | BIGINT | PK, sequence-generated | Same `AUTO` → Hibernate-sequence behaviour as `User.id` |
| name | String | VARCHAR | not null, unique | Project name shown in selectors |
| description | String | VARCHAR | nullable | Optional context |
| active | boolean | BOOLEAN | not null, default true | Inactive projects cannot receive new entries. Primitive `boolean` for the same unboxing reason as `User.active` |
| createdAt | LocalDateTime | TIMESTAMP | not null | Set by `@CreationTimestamp` |

### TimeEntry
| Field | Java type | SQL type | Constraints | Notes |
|---|---|---|---|---|
| id | Long | BIGINT | PK, sequence-generated | Same `AUTO` → Hibernate-sequence behaviour as `User.id` |
| user | User | BIGINT (FK) | not null | `@ManyToOne` → User; who logged the entry |
| project | Project | BIGINT (FK) | not null | `@ManyToOne` → Project; which project the hours belong to |
| date | LocalDate | DATE | not null | The day the work was done; cannot be in the future |
| hours | BigDecimal | DECIMAL(4,2) | not null | Between 0.5 and 24 |
| description | String | VARCHAR | not null | What was done |
| status | EntryStatus (enum) | VARCHAR | not null, default DRAFT | `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED` via `@Enumerated(STRING)` |
| rejectionNote | String | VARCHAR | nullable | Set by the manager when rejecting |
| createdAt | LocalDateTime | TIMESTAMP | not null | Set by `@CreationTimestamp` |
| updatedAt | LocalDateTime | TIMESTAMP | not null | Set by `@UpdateTimestamp` on every change |

### Relationships
- **User → TimeEntry:** one-to-many. The FK lives on `TimeEntry.user` (`@ManyToOne`); `User` may expose `@OneToMany(mappedBy = "user")` only if a user needs to read their own entries through the entity graph — otherwise skip it and query through the repository.
- **Project → TimeEntry:** one-to-many. The FK lives on `TimeEntry.project` (`@ManyToOne`).
- **Fetch type:** both `@ManyToOne` are explicitly `FetchType.LAZY`. The JPA default is `EAGER`, which fired 1 + 2N queries on `GET /api/entries` (the classic N+1). The fix is not LAZY alone — with `open-in-view=false` a lazy proxy read outside a transaction throws `LazyInitializationException` — but LAZY **plus** a `LEFT JOIN FETCH` on both relations, added by `TimeEntrySpecifications.fetchUserAndProject()` and guarded by `query.getResultType()` so it is skipped on `COUNT` queries. Every TimeEntry response does need its user and project, so they are always fetched — the point is fetching them in **one** query, not N.
- **Cascade:** **none** on either `@ManyToOne`. Timesheet history is owned by the company, not by the user or the project that happens to reference it, so a delete on the parent must never propagate. With no cascade and a not-null FK, a hard `DELETE` on a referenced user or project is simply rejected by the FK constraint — which is why both parents use soft delete (`active = false`) instead: the row stays, the entries keep pointing at it, and history is preserved.

---

## 8. Business rules

**Workflow state machine**

```
Employee creates entry
        ↓
     DRAFT  ←──────────────────┐
        ↓                      │
  Employee submits             │
        ↓                      │
   SUBMITTED                   │
        ↓                      │
   Manager reviews             │
      ↙       ↘                │
APPROVED     REJECTED ─────────┘
                (employee can edit and resubmit)
```

**Rules**
- Employee can only see their own entries
- Employee can only edit or delete their **own** DRAFT entries (ownership resolved from the JWT via `SecurityContextHolder`, never from a client-supplied `userId`)
- Employee can only submit their **own** DRAFT entries
- Only the owner (EMPLOYEE, ownership resolved from the JWT) can re-open one of their **REJECTED** entries — this is the only transition into DRAFT after creation, and it exists so the entry can be corrected and resubmitted (the resubmit loop in the diagram above). Re-opening an entry in any other status is rejected (409). *(Deferred out of Step 5, built on `fix/backend-backlog` and Postman-verified on 2026-07-22.)*
- Manager can see all entries from all users
- Manager can only approve or reject SUBMITTED entries; a manager never edits, submits or re-opens an entry
- A manager cannot approve or reject **their own** entries (segregation of duties) — the caller's id is resolved from the JWT and compared to the entry's owner; a match is refused (403). A manager never logs hours in this system (`POST /api/entries` is EMPLOYEE-only, and the UI hides every logging control from managers), so the only way a manager can own an entry is by having been promoted from EMPLOYEE while holding entries — those are reviewed by a different manager. Modelling a manager who bills hours would require an approver hierarchy (each user's entries routed to *their* line manager), which is deliberately out of scope
- A rejection note is mandatory when rejecting — a reject with a blank note is refused (400) and the entry stays SUBMITTED
- Cannot log entries for a future date
- Hours must be between 0.5 and 24
- Cannot submit entries for an inactive project — refused **400** (`BusinessRuleViolationException`, the same input-data tier as a future date or an out-of-range hours value; it is a property of the data being submitted, not of the entry's workflow state). The same 400 applies to `POST` and `PUT`, which re-run the rule. **`409` (`InvalidStateTransitionException`) is reserved for state conflicts only** — an entry that is not in the status the transition requires (submit/edit/delete on a non-`DRAFT` entry, reopen on a non-`REJECTED` one, approve/reject on a non-`SUBMITTED` one)
- **Shared routes stay role-aware.** `/dashboard` and `/entries` are reachable by both roles (`authGuard` only, §13), so the manager-only data they show — `GET /api/users`, `GET /api/reports/summary`, the `?status=SUBMITTED` review list — is requested **only** in the manager variant of the page, chosen from `AuthService`'s role signal. The API is the real boundary: an EMPLOYEE that reached those calls would get `403`, so the role-aware rendering is a UX decision, never the protection
- Inactive users cannot log in — their entries remain in the database unchanged
- A user deactivated *after* their token was issued loses access on their next request, not when the token expires — `JwtFilter` runs the loaded `UserDetails` through an `AccountStatusUserDetailsChecker`, so the login-time `active` check cannot be bypassed by an already-issued token

> **Status ruling — an entry the caller does not own is `404`, not `403`** *(decided 2026-07-30)*. The four
> owner-only operations (`submit`, `update`, `delete`, `reopen`) answer "this entry is not yours" with the
> **same** `404` and the same message as "this id does not exist". Distinguishing them made the status code
> an enumeration oracle: an EMPLOYEE could walk the id space and learn which entries exist across the whole
> table — how many there are, in what ranges, how much the rest of the team logs — without reading a single
> row. `TimeEntryService.findOwnedEntry(id, user)` enforces this by construction, folding the ownership test
> into the lookup chain so both failure modes leave through one throw.
>
> **This narrows the `403` convention rather than contradicting it.** `403` still means *the caller's role or
> permission does not allow this action*, but **ownership is no longer one of its triggers**: for a
> single-owner resource, "not yours" and "does not exist" must be indistinguishable, so the refusal is a
> `404`. `403` survives wherever the caller may legitimately know the resource exists — a role refusal
> (`@PreAuthorize` on a MANAGER-only endpoint), and the segregation-of-duties refusal on `approve`/`reject`,
> where the manager already reads every entry in the listing and the status therefore discloses nothing.
> The `/api/users/me/password` ruling above is unaffected: it turns on the caller owning `/me` by
> definition, and its `400` was chosen against `403`-as-permission, not `403`-as-ownership.

**Password rules** *(decided 2026-07-28)*
- A new account's password is **generated by the backend**, never supplied by the manager and never a fixed literal: a random value from `SecureRandom` (not `Random`, which is predictable and not cryptographically secure)
- The generated plaintext is returned **once**, in the `POST /api/users` response only — a `CreateUserResponse` distinct from `UserResponse`, so no other endpoint can ever echo it. It is shown once in the §17 snackbar and never retrievable again; only the BCrypt hash is stored
- Any authenticated user can change **their own** password via `PATCH /api/users/me/password`, supplying the current one (verified with `passwordEncoder.matches`) and a new one of 8–72 characters. A wrong current password is refused **`400`**, carrying `fieldErrors.currentPassword` so the form shows the message under that input (see the ruling below). Nobody can change another user's password — a manager who needs to reset an account deactivates and recreates it
- 72 is BCrypt's truncation boundary: input beyond it is silently ignored, so accepting more only lets an unauthenticated caller burn CPU

> **Why this shape.** The rule previously read *"default password `Timetrack2024!`, shown once; employee
> must change it on first login (requires `mustChangePassword` — skip for MVP)"*. With that field cut **and
> no change-password endpoint anywhere**, a fixed literal stops being an *initial* password and becomes the
> **permanent, identical, git-committed** password of every account — the same flaw that removed `data.sql`'s
> hash in §9. The decisive question was not which literal to pick but *"how does a user change their
> password?"*: the manager-supplies and fixed-default options both fail it identically. Adding the endpoint
> is what makes the area coherent; once it exists, generating the initial value costs almost nothing and
> removes the last shared secret.
>
> **Status ruling — a wrong current password is `400`, not `403` or `401`** *(decided 2026-07-28)*. The
> earlier `403` broke this plan's own convention, where `403` means *the caller's role or ownership does not
> permit this action*. On `/api/users/me/password` neither can fail: the caller is authenticated and owns
> `/me` by definition, so nothing about authorization is being refused. `401` is worse than
> wrong: the Angular interceptor treats every `401` as an expired session and redirects to `/login`, so a
> single typo in the current-password field would log the user out mid-change. `400` also lets the response
> reuse the `fieldErrors` contract (§10), putting the message under the offending input instead of on a
> generic error banner.
>
> **Implemented as a dedicated `InvalidCurrentPasswordException`, not `BusinessRuleViolationException`**
> *(decided 2026-07-29, during implementation)*. Both map to the same `400`, so the status ruling above is
> unaffected — the question was only which exception type carries the check. A dedicated type keeps
> `GlobalExceptionHandler` a pure function of exception type: `handleInvalidCurrentPassword` always attaches
> `fieldErrors.currentPassword`, with no branching inside `handleBusinessRuleViolation` to decide whether
> *this particular* business-rule violation happens to have a field to report. Same precedent as
> `InvalidStateTransitionException` existing alongside `BusinessRuleViolationException` (§12) — a distinct
> exception type when the response shape, not just the status code, differs.
>
> **Re-opening a rejected entry must be reachable from the UI.** The owner (EMPLOYEE) sees a **Re-open**
> action on every one of their `REJECTED` rows in the Entries page — it calls
> `PATCH /api/entries/{id}/reopen`, returns the entry to `DRAFT`, and the row's edit / delete / submit
> icons then appear under the existing DRAFT-only rule. Without this affordance `REJECTED` would be a
> terminal state in practice while the diagram, the business rule and the endpoint all say it is not, and
> the resubmit loop that justifies the whole state machine would be dead code.
>
> **Changing your own password must be reachable from the UI.** The same argument as the Re-open action
> above, applied to the endpoint this rule introduces: every authenticated user reaches a
> **Change password** item in the app shell's user menu, which opens a `change-password-dialog` (current
> password + new password + confirm) calling `PATCH /api/users/me/password`; a `400` carrying
> `fieldErrors.currentPassword` renders under the current-password input, and success closes the dialog
> with a snackbar. It is a dialog, not a route, because it is an action on the logged-in user rather than
> a place in the app — no new guard, no new route. Without it, "password change is self-service" would be
> a claim no user can act on, and the generated initial password would in practice be permanent — exactly
> the flaw this whole ruling was written to remove.
>
> **Deliberately out of scope:** `mustChangePassword` — *forcing* the change at first login needs the
> frontend to intercept every route until it happens, which is Step 7a work for little MVP value. Record it
> in `backend/README.md` as a known limitation, not as an oversight.

**Reporting rules** *(decided 2026-07-28)*
- **Every hours figure in a report counts `APPROVED` entries only.** All three endpoints — `summary`, `by-project`, `by-user` — apply the identical filter, so the summary card always equals the sum of the table beneath it
- `pendingHours` (SUBMITTED) is the one exception and stays a **separate, explicitly-named field**. It is a workload signal for the manager — "this much is waiting for you" — and is never folded into a total
- `totalEntries` counts `APPROVED` entries, for the same reason
- DRAFT and REJECTED never appear in any report

> **Why.** The whole DRAFT → SUBMITTED → APPROVED state machine exists so the manager's numbers can be
> trusted — these are the hours a company bills and pays against. Mixing unapproved hours into a total
> silently defeats it. This rule was never written in §8, and the code diverged as a direct result:
> `getHoursByProject`/`getHoursByUser` filtered to APPROVED (the deliberate 2026-07-22 fix) while
> `getSummary` counted APPROVED + SUBMITTED, so the same month produced two different totals.
>
> **Consequence for the code:** `totalHours` (= approved + pending) is the field that *caused* the
> mismatch and is removed from `ReportSummaryResponse`. The DTO becomes `approvedHours`, `pendingHours`,
> `totalEntries` — nothing is lost, and no field can disagree with another.

---

## 9. Seed data

**Initial data — first manager account**

There is no public register endpoint, so the first manager account must exist before anyone can log in.

**Solution: `config/DataInitializer.java`** — a `CommandLineRunner` annotated `@Profile("dev")`, so the
bean is not even instantiated outside the `dev` profile and the seed can never reach a deployed
environment. It reads the admin's email, name and password from `application-dev.properties`
(`app.admin.*`), with the password itself taken from the `ADMIN_PASSWORD` environment variable, and hashes
it at runtime through the existing `PasswordEncoder` bean. The runner is idempotent — a
`findByEmail(...).isPresent()` guard makes a second boot a no-op.

> **Replaced `data.sql` on 2026-07-23 — and the reason is the point.** The original plan seeded the account
> from `src/main/resources/data.sql` with a pre-generated BCrypt hash and `ON CONFLICT DO NOTHING`, running
> on every boot via `spring.sql.init.mode=always`. That put a real credential hash in git — public,
> offline-crackable, and shipped to every future environment including Docker (Step 11). Generating the hash
> in Java at runtime from an env var fixes all three at once. This is the version worth defending in an
> interview; the `data.sql` approach is the one to describe as *what it replaced and why*.

---

## 10. REST API

### Auth — public endpoints
```
POST /api/auth/login       → returns JWT
```

**Token lifetime:** 60 min (`app.jwt.expiration=3600000` in `application.properties`). Cut from the
original 24h on 2026-07-28: a token stolen from `localStorage` was valid for a full day, and with no
refresh-token flow in scope, 60 min is the balance between a usable work session and a bounded blast
radius. When a token expires mid-session the API returns 401 — the Angular interceptor (Step 7a) catches
it, clears the stored session, and redirects to `/login`. Expiry is handled once in the interceptor,
never per page. The access/refresh trade-off is documented in `backend/README.md`.

### Success responses — status and `Location`

Every controller states its status through a `ResponseEntity` factory (`ok`, `created`, `noContent`),
never a bare `status(200)`: the status is a checked constant, not an `int`.

**Every `201` carries a `Location` header** holding the created resource's URI, built from the current
request rather than a hardcoded path. `POST /api/projects` returns `Location: /api/projects/{id}`, and
the same applies to `/api/entries` and `/api/users`. The client follows what the server sent instead of
assembling that URL from its own copy of the route scheme. Note that `entries` and `users` have no
`GET /{id}` yet: the URI is still the resource's real address — `PUT` and `DELETE` act on it — so the
header stays correct, and the missing read endpoint is a gap in the API, not a reason to omit it.

### Error contract — what every non-2xx response looks like

All errors return the same `ErrorResponse` body from `GlobalExceptionHandler`:
```json
{ "timestamp": "...", "status": 400, "error": "Bad Request", "message": "Validation failed" }
```
Validation errors (400 from `@Valid`, via `MethodArgumentNotValidException`) additionally carry a
field-level map the reactive forms consume to show a message under each input (Step 7b):
```json
{ "status": 400, "message": "Validation failed", "fieldErrors": { "hours": ["must be at most 24"] } }
```
Each value is an **array**, because one field can fail several constraints at once (`email` can be both
too long and malformed) and Bean Validation reports every one. A form renders the first message or all
of them, but the contract never decides that by discarding violations on the way out.

**`fieldErrors` is not exclusive to `@Valid` 400s.** It is the channel for *any* failure attributable to
one input, whatever its status: a wrong current password carries `fieldErrors.currentPassword` on a 400,
and a duplicate email or project name carries `fieldErrors.email` / `fieldErrors.name` on a **409**. The
status answers what kind of failure it is; the map answers which control it belongs under. A form binds
`fieldErrors` when present and falls back to `message` when absent, with no branching on the status — so
an exception that concerns one field carries that field's name (`DuplicateResourceException`), rather
than the handler hardcoding it.

### Auth — request/response detail

| Method · Path | Role | Description | Request body | Response |
|---|---|---|---|---|
| `POST /api/auth/login` | public | Authenticate and issue a JWT | `LoginRequest` — `email`, `password` | `200` + `AuthResponse` — `token`, `name`, `role` · `401` on bad credentials or inactive user |

### Users (`UserController` — MANAGER only, except `PATCH /me/password`)

| Method · Path | Role | Description | Request body | Response |
|---|---|---|---|---|
| `GET /api/users` | MANAGER | List all users — both roles, **and both active and deactivated accounts** (see the ruling below), active first then alphabetical | — | `200` + `List<UserResponse>`, each carrying `active` |
| `POST /api/users` | MANAGER | Create a user account; the backend generates the password | `CreateUserRequest` — `name`, `email`, `role` | `201` + **`CreateUserResponse`** — `UserResponse` fields **+ `generatedPassword`** (returned this once only) · `400` validation · `409` email already exists |
| `PUT /api/users/{id}` | MANAGER | Update name, email, role, or reactivate/deactivate | `UpdateUserRequest` — `name`, `email`, `role`, `active` (optional — applied only when non-null) | `200` + `UserResponse` · `404` user not found · `409` email already in use |
| `PATCH /api/users/me/password` | any authenticated | Change **your own** password | `ChangePasswordRequest` — `currentPassword`, `newPassword` (8–72) | `204` no body · `400` validation, **and a wrong current password** — `fieldErrors.currentPassword` (see the §8 status ruling) |
| `DELETE /api/users/{id}` | MANAGER | Deactivate account (soft delete — sets `active = false`) | — | `204` no body · `404` user not found |

> **Two decisions recorded here (2026-07-28):**
> - **The manager never supplies or sees a stored password.** `password` is gone from `CreateUserRequest`;
>   the backend generates it and returns it once via `CreateUserResponse` — the only endpoint that ever
>   carries plaintext. `PATCH /api/users/me/password` is `/me`, not `/{id}`, on purpose: password change is
>   a self-service action, so not even a MANAGER can set another user's password. Full rationale in §8.
> - **`email` stays editable.** The plan previously contradicted itself — this row said `name, role` while
>   §13 and §17 both described editing the email — with no justification recorded for excluding it. The
>   built behaviour is correct and guarded (duplicate check → 409, and only checked when the value actually
>   changed), so the code stands and §13/§17 now agree with it. Email **is** the login identity, so this is
>   a deliberately MANAGER-only operation, not an incidental field.

> **Contract ruling — `GET /api/users` returns every account, unpaginated** *(decided 2026-08-01)*.
> Two halves, both deliberate:
> - **Deactivated accounts are included.** Soft delete is the only delete this API has, so an excluded
>   account would be unreachable: `PUT /api/users/{id}` with `active = true` is the sole path back, and
>   the manager can only invoke it on a row the list gave them. `UserResponse.active` is what lets the
>   client tell the two apart, rendered as the §17 "Inactive" status.
> - **No `Pageable`.** A company's headcount is tens of rows, and the endpoint's three consumers
>   (§17 Team page, the manager dashboard "Team members" count, the Approvals employee filter) each need
>   the *whole* list to be correct — a paginated response would silently reduce the Approvals filter to
>   whoever landed on page one, and make the dashboard count a page size. This is a stronger reason than
>   the general §20 return-all tradeoff: here pagination would break two features, not merely be
>   unnecessary. It becomes a real question only if a single tenant's user table reaches thousands.

### Projects (`ProjectController`)

| Method · Path | Role | Description | Request body | Response |
|---|---|---|---|---|
| `GET /api/projects` | both | Employee: active projects only · Manager: all projects. Alphabetical by name | — | `200` + `List<ProjectResponse>` |
| `GET /api/projects/{id}` | both | Employee: active projects only · Manager: any project. Target of the `Location` header returned by `POST` | — | `200` + `ProjectResponse` · `404` project not found **or inactive and the caller is an EMPLOYEE** |
| `POST /api/projects` | MANAGER | Create a project | `CreateProjectRequest` — `name`, `description` | `201` + `ProjectResponse` · `400` validation · `409` duplicate name |
| `PUT /api/projects/{id}` | MANAGER | Update name, description, or reactivate/deactivate | `UpdateProjectRequest` — `name`, `description`, `active` (optional — applied only when non-null) | `200` + `ProjectResponse` · `404` project not found |
| `DELETE /api/projects/{id}` | MANAGER | Deactivate project (soft delete — sets `active = false`) | — | `204` no body · `404` project not found |

### Time entries (`TimeEntryController`)

| Method · Path | Role | Description | Request body | Response |
|---|---|---|---|---|
| `GET /api/entries` | both | Employee: own entries only (ownership from the JWT) · Manager: all entries | — (see query filters below) | `200` + paged `TimeEntryResponse` — `content` plus a `page` object carrying `size`, `number`, `totalElements`, `totalPages` |
| `POST /api/entries` | EMPLOYEE | Create an entry in `DRAFT` for the authenticated user | `CreateTimeEntryRequest` — `projectId`, `date`, `hours`, `description` | `201` + `TimeEntryResponse` · `400` validation — future date, hours outside 0.5–24, **inactive project** (all three are `BusinessRuleViolationException`, the input-data tier of §12's taxonomy; `409` is reserved for state conflicts) |
| `PUT /api/entries/{id}` | EMPLOYEE | Edit own `DRAFT` entry | `CreateTimeEntryRequest` | `200` + `TimeEntryResponse` · `400` validation — PUT replaces the whole resource, so it re-runs create's rules (future date, hours range, inactive project) · `404` entry not found **or not owned by the caller** (§8 status ruling) · `409` entry not in `DRAFT` |
| `DELETE /api/entries/{id}` | EMPLOYEE | Delete own `DRAFT` entry (hard delete — a draft has no history value) | — | `204` no body · `404` entry not found **or not owned by the caller** (§8 status ruling) · `409` entry not in `DRAFT` |
| `PATCH /api/entries/{id}/submit` | EMPLOYEE | Own entry `DRAFT → SUBMITTED` | — | `200` + `TimeEntryResponse` · `400` the entry's project is inactive (§8: "cannot submit entries for an inactive project") · `404` entry not found **or not owned by the caller** (§8 status ruling) · `409` entry not in `DRAFT` |
| `PATCH /api/entries/{id}/reopen` | EMPLOYEE | Own entry `REJECTED → DRAFT` so it can be corrected and resubmitted | — | `200` + `TimeEntryResponse` · `404` entry not found **or not owned by the caller** (§8 status ruling) · `409` entry not in `REJECTED` |
| `PATCH /api/entries/{id}/approve` | MANAGER | `SUBMITTED → APPROVED` | — | `200` + `TimeEntryResponse` · `403` caller is the entry's owner · `404` entry not found · `409` entry not in `SUBMITTED` |
| `PATCH /api/entries/{id}/reject` | MANAGER | `SUBMITTED → REJECTED` | `RejectRequest` — `rejectionNote` | `200` + `TimeEntryResponse` · `400` note missing · `403` caller is the entry's owner · `404` entry not found · `409` entry not in `SUBMITTED` |

**Query params on `GET /api/entries`** — all optional, combinable:

| Param | Type | Filters |
|---|---|---|
| `month` | String `YYYY-MM` | Entries whose `date` falls in that year and month |
| `projectId` | Long | Entries of one project |
| `status` | `EntryStatus` | Entries in one workflow state |
| `userId` | Long — **MANAGER only** | Entries of one employee (ignored for an EMPLOYEE caller, who is always scoped to their own) |
| `page` | int, default `0` | Zero-based page index |
| `size` | int, default `20`, capped at `100` | Rows per page; a larger request is silently clamped to the cap |
| `sort` | `field,dir` — repeatable | Overrides the default `date` desc, `id` desc |

### Reports (`ReportController` — MANAGER only)

| Method · Path | Role | Description | Query params | Response |
|---|---|---|---|---|
| `GET /api/reports/summary` | MANAGER | Month totals: approved hours, pending hours, approved entry count | `month` — String `YYYY-MM`, required | `200` + `ReportSummaryResponse` — `approvedHours`, `pendingHours`, `totalEntries` · `400` month missing or malformed |
| `GET /api/reports/by-project` | MANAGER | Hours grouped by project | `month` — required | `200` + `List<ProjectHoursReportResponse>` — `projectId`, `projectName`, `totalHours`, `active` |
| `GET /api/reports/by-user` | MANAGER | Hours grouped by user | `month` — required | `200` + `List<UserHoursReportResponse>` — `userId`, `userName`, `totalHours`, `active` |

> **`by-project` and `by-user` are ordered by hours descending, ties broken by name ascending.** The row
> order is part of the contract, not an accident: a `GROUP BY` guarantees none, so the query states it
> rather than leaving the sort to Angular. The name key makes the ordering total, so equal-hour rows
> cannot swap between two identical calls — which is what makes the endpoint testable.
>
> **All three count `APPROVED` entries only** — the §8 reporting rule. `pendingHours` is the single
> deliberate exception and is never folded into a total, which is why `totalHours` was removed from
> `ReportSummaryResponse`: it was the field that let the summary disagree with the tables.
>
> **Endpoint and field naming (decided 2026-07-29):** `GET /api/reports/by-employee` is renamed to
> `/by-user`, and `EmployeeHoursReportResponse`/`getEmployeeName()` to `UserHoursReportResponse`/
> `getUserName()`, with the JPQL `AS` alias renamed to match. The reason is not stylistic: the query
> groups `TimeEntry.user` with no role filter, so a user promoted from EMPLOYEE to MANAGER still shows
> up with their historical hours — correctly, since those hours are still billable. `by-employee`
> implied a role guarantee the code never enforced; `by-user` names what the query actually returns.
> Adding the missing filter was rejected — it would hide real billable hours. Done while Step 7a has
> not started, so the endpoint had zero consumers to migrate.
>
> **Soft-deleted rows stay in the report, flagged (decided 2026-07-29):** neither `by-project` nor
> `by-user` filters on `Project.active`/`User.active` — a project or user deactivated mid-month still
> appears with its full hours, because the hours were genuinely worked. What changed is that both
> queries now select and group by the entity's `active` column too, so `ProjectHoursReportResponse`/
> `UserHoursReportResponse` expose it and the client can render an "archived" state instead of a row
> that looks identical to an active one.
>
> Both aggregates group by **id and name** (not name alone), so two users with the same display name
> stay separate rows and a rename does not split history; the id is also the frontend's row key.

> **A collection endpoint is paginated when its volume grows without a bound; otherwise it returns the
> full list.** `GET /api/entries` is the one collection that grows with every imputation, every user and
> every month, so it is paged. Users, projects and the report aggregates are bounded by headcount, by
> the project catalogue and by the month filter, and their consumers need the whole set to be correct
> (see the `GET /api/users` contract ruling above) — pagination there would break features rather than
> protect anything.
>
> **Every collection endpoint owes a total order, paged or not.** A result set is unordered, so an
> endpoint that states no order inherits whatever order the rows happen to be read in — and a single
> unrelated `UPDATE` is enough to move a row, because PostgreSQL writes a new version of it. The order
> is therefore declared: in the JPQL for the report aggregates, and through a `Sort` handed to the
> repository for the rest. The keys must make the ordering **total** — a non-unique sort column needs a
> unique tie-breaker after it, or two equal rows can swap between two identical calls.
>
> | Endpoint | Order |
> |---|---|
> | `GET /api/projects` | `name` asc — unique by the §8 duplicate-name rule, so no tie-breaker is needed. Both role branches share it, so the employee's filtered list is a sub-sequence of the manager's |
> | `GET /api/users` | `active` desc, `name` asc, `id` asc — inactive accounts sort last so the §17 Team table reads without filtering; `name` is not unique, so `id` closes the order |
> | `GET /api/entries` | `date` desc, `id` desc (see the paging rule below) |
> | `GET /api/reports/by-project` · `by-user` | hours desc, name asc (see the reports rule above) |
>
> **For a paged endpoint the total order is what makes paging correct**, not merely testable: without a
> unique key after a non-unique column, a row is served on two pages or on none. The page cap
> (`size` ≤ 100) is part of the same contract — an endpoint that honours any requested size is not
> bounded at all.
>
> One thing the order does **not** control: how text itself compares. `ORDER BY name` resolves through
> the database's collation, so a locale-aware collation sorts `"nuevo"` before `"Project"` where `C`
> would not. The endpoint guarantees a stable order, not a particular alphabet.
>
> **The paged payload is a DTO, not a framework type.** The response is `content` plus a four-field
> `page` object, never Spring Data's `PageImpl` serialised by reflection: that class is a dependency's
> internal detail, so letting it define the payload puts the API's shape outside this project's control.

---

## 11. Postman setup

Test every endpoint in Postman as soon as it is created. Do not wait until the whole layer is finished.

**Setup — one collection for the project:**
- Create a collection called `07 - TimeTrack` (project convention: `## - ProjectName`)
- Create folders inside it, one per controller: `Auth`, `Users`, `Projects`, `Entries`, `Reports`
- Add each endpoint to its folder as you build it

**For each endpoint, check:**
- Correct HTTP status code — including the three this project's taxonomy turns on: **403** for a role
  refusal, **404** for a resource the caller does not own (§8 status ruling — indistinguishable from a
  non-existent id), and **409** for a state conflict, never 400 for any of them (§8, §12)
- Correct JSON response body — the uniform `ErrorResponse` shape from §10 on every non-2xx, with
  `fieldErrors` present on a `@Valid` 400 **and on any other single-field failure** — the 409 on a
  duplicate email or project name, the 400 on a wrong current password (§10)
- Error cases (missing fields, wrong id, wrong role, wrong source status)

**GET requests** — also testable in the browser (`http://localhost:8080/api/...`)
**POST / PUT / DELETE** — Postman only

**Base URL:** `http://localhost:8080`

---

## 12. Spring Boot folder structure

```
src/main/resources/
├── application.properties      (DB connection, JPA config, JWT secret + expiry)
└── application-dev.properties  (dev-only: show-sql, app.admin.* seed values)

src/main/java/com/victor/timetrack/
├── config/
│   └── DataInitializer.java         (@Profile("dev") CommandLineRunner — seeds the first manager)
├── controller/
│   ├── AuthController.java          (POST /api/auth/login — public)
│   ├── UserController.java          (/api/users — MANAGER only, except PATCH /me/password: any authenticated user)
│   ├── ProjectController.java       (/api/projects)
│   ├── TimeEntryController.java     (/api/entries + the workflow PATCH endpoints)
│   └── ReportController.java        (/api/reports — MANAGER only)
├── service/
│   ├── AuthService.java             (authenticates credentials and issues the JWT)
│   ├── UserService.java             (user CRUD + soft delete + SecureRandom password generation and self-service change)
│   ├── UserDetailsServiceImpl.java  (Spring Security — loads a user by email for authentication)
│   ├── ProjectService.java          (project CRUD + soft delete)
│   ├── TimeEntryService.java        (entry CRUD, ownership checks, status transitions)
│   └── ReportService.java           (monthly aggregations for the three report endpoints)
├── repository/
│   ├── UserRepository.java          (findByEmail)
│   ├── ProjectRepository.java       (findByActiveTrue, existsByName)
│   ├── TimeEntryRepository.java     (JpaSpecificationExecutor + the report aggregation queries)
│   └── TimeEntrySpecifications.java (static Specification factories — one per optional filter + the fetch-join)
├── model/
│   ├── User.java           (@Entity — account, role, active flag)
│   ├── Project.java        (@Entity — project, active flag)
│   ├── TimeEntry.java      (@Entity — the logged hours, owns both FKs)
│   ├── Role.java          (enum: EMPLOYEE, MANAGER)
│   └── EntryStatus.java   (enum: DRAFT, SUBMITTED, APPROVED, REJECTED)
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java                 (email + password)
│   │   ├── CreateProjectRequest.java         (name + description)
│   │   ├── UpdateProjectRequest.java         (name + description + active — optional, applied only when non-null)
│   │   ├── CreateTimeEntryRequest.java       (projectId, date, hours, description — also used by PUT)
│   │   ├── RejectRequest.java              (rejectionNote body for PATCH /reject)
│   │   ├── CreateUserRequest.java          (name, email, role — no password: the backend generates it)
│   │   ├── UpdateUserRequest.java          (name, email, role, active)
│   │   └── ChangePasswordRequest.java      (currentPassword + newPassword — self-service only)
│   └── response/
│       ├── AuthResponse.java                    (token + name + role)
│       ├── UserResponse.java                    (id, name, email, role, active — never the hash)
│       ├── CreateUserResponse.java              (UserResponse fields + the generated plaintext, returned once)
│       ├── ProjectResponse.java                 (id, name, description, active)
│       ├── TimeEntryResponse.java               (flattened user/project names + status, no entities)
│       ├── ReportSummaryResponse.java         (approvedHours, pendingHours, totalEntries)
│       ├── ProjectHoursReportResponse.java    (interface projection — hours grouped by project)
│       ├── UserHoursReportResponse.java       (interface projection — hours grouped by user)
│       └── ErrorResponse.java                 (uniform JSON error body from GlobalExceptionHandler)
├── exception/
│   ├── GlobalExceptionHandler.java        (@RestControllerAdvice — returns clean JSON errors)
│   ├── ResourceNotFoundException.java     (→ 404)
│   ├── BusinessRuleViolationException.java (input-data rule broken: hours range, future date, inactive project → 400)
│   ├── InvalidStateTransitionException.java (illegal workflow transition → 409)
│   ├── InvalidCurrentPasswordException.java (wrong currentPassword on self-service change → 400, fieldErrors.currentPassword)
│   ├── DuplicateResourceException.java    (duplicate email or project name → 409, caller-facing message)
│   └── ForbiddenOperationException.java   (segregation of duties on approve/reject → 403)
└── security/
    ├── JwtUtil.java                  (generates and validates the token, reads its claims)
    ├── JwtFilter.java                (OncePerRequestFilter — puts the user in the SecurityContext)
    ├── JwtAuthenticationEntryPoint.java (unauthenticated request → 401 JSON instead of an empty 403)
    └── SecurityConfig.java           (filter chain, public routes, CORS, BCryptPasswordEncoder)
```

---

## 13. Angular folder structure

```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts         ← blocks any route without a stored token
│   │   └── manager.guard.ts      ← blocks manager-only routes for an EMPLOYEE
│   ├── interceptors/
│   │   └── auth.interceptor.ts   ← attaches the Bearer token; on 401 clears the session → /login
│   └── services/
│       ├── auth.service.ts       ← login, logout, current user + role
│       ├── entry.service.ts      ← /api/entries CRUD + the workflow PATCH calls
│       ├── project.service.ts    ← /api/projects
│       ├── user.service.ts       ← /api/users (Team page, manager dashboard card, Approvals employee filter) + changePassword() → PATCH /api/users/me/password
│       └── report.service.ts     ← /api/reports (the three monthly reports)
├── pages/
│   ├── login/                    ← email + password form, both roles
│   ├── dashboard/                ← role-aware summary (employee vs manager variant)
│   ├── entries/
│   │   ├── entry-list/           ← filterable table of entries
│   │   └── entry-dialog/         ← create / edit an entry (reactive form)
│   ├── projects/                 ← project CRUD table, manager only
│   ├── approvals/                ← SUBMITTED entries queue, approve / reject
│   ├── team/                     ← user list, manager only
│   │   └── user-dialog/          ← add and edit user (name, email, role — never a password field)
│   └── reports/                  ← monthly report views (summary, by project, by employee)
└── shared/
    ├── components/
    │   ├── change-password-dialog/ ← current + new password form, opened from the shell user menu (not routed) → PATCH /api/users/me/password
    │   ├── confirm-dialog/     ← generic yes/no confirmation, used before every delete
    │   ├── reject-dialog/     ← rejection note input, used in Approvals
    │   └── status-badge/      ← coloured badge, used in Entries, Approvals, Dashboard
    └── models/                    ← interfaces mirroring the backend response DTOs
        ├── user.model.ts          ← User + Role
        ├── project.model.ts       ← Project
        ├── time-entry.model.ts    ← TimeEntry + EntryStatus
        └── report.model.ts        ← the three report shapes
```

### Angular routes
```
/login
/dashboard          → authGuard
/entries            → authGuard (both roles — employee sees own, manager sees all)
/projects           → authGuard + managerGuard
/approvals          → authGuard + managerGuard
/team               → authGuard + managerGuard
/reports            → authGuard + managerGuard
```

The two `authGuard`-only routes above (`/dashboard`, `/entries`) are shared by both roles and their
manager variants call MANAGER-only endpoints — see the §8 rule **"Shared routes stay role-aware"** for
which calls are gated and why the API, not the rendering, is the boundary.

The route list above is complete: **`change-password-dialog` adds no route**. It is opened from the app
shell's user menu via `MatDialog` (§8 ruling, §14 wireframe) — an action on the logged-in user, not a
place in the app — so it needs no guard and no entry here.

### Shared state — who owns each multi-page endpoint

The §6 rule decides this once for the whole app: **the page component under `pages/` owns the state for
its route, each page fetches for itself on its own load, and there is no cross-page cache.** `AuthService`
is the single app-wide exception. One line per endpoint read by more than one page, so no two pages solve
it differently mid-build:

| Endpoint | Pages that read it | Owner |
|---|---|---|
| `GET /api/entries?month=` | Employee dashboard (stat cards + recent list) · Entries page (table) | **Each page fetches independently** into its own `entries` signal. The dashboard asks for the current month; the entries page asks for whatever the filter bar holds — the same URL with different params, so a shared cache would be wrong more often than right. Refetch after every mutation on the page that made it |
| `GET /api/entries?status=SUBMITTED` | Manager dashboard ("Pending approval" card + review list) · Approvals page (queue) | **Each page fetches independently.** Approving from the dashboard refetches only the dashboard; the Approvals page is re-read when the user navigates to it |
| `GET /api/projects` | Projects page · Entries filter bar · entry-dialog project selector · Manager dashboard ("Active projects" card) | **Each page fetches independently** on load. The entry-dialog receives the already-loaded list from its parent page through `MatDialog` data — it does not call `ProjectService` itself |
| `GET /api/users` | Team page · Manager dashboard ("Team members" card) · Approvals employee filter | **Each page fetches independently** |
| `GET /api/reports/summary?month=` | Reports page ("Approved this month" card) · Manager dashboard ("Approved this month" card) | **Each page fetches independently**, for its own selected month |
| — current user + token (no endpoint after login) | App shell (name, role-filtered sidebar) · both guards · every role-aware page | **`AuthService`** — the one piece of app-wide state, a signal persisted to `localStorage` with `effect()`. Auth outlives every route, so a page cannot own it |
| Pending-approvals count (`MatBadge` in the shell) | App shell only | Owned by the **shell component**, which issues its own `GET /api/entries?status=SUBMITTED` on load. It is deliberately **not** live-synced with the Approvals page — approving an entry does not decrement the badge until the next navigation. Keeping it live would need exactly the shared store §20 rejects, for a badge |

---

## 14. UI design

### Visual identity — what makes this look like a different product

TimeTrack is an internal payroll-adjacent tool: the feeling to hit is **calm operational instrument**, not
the friendly consumer app 05 was or the generic corporate portal 06 was. A timesheet is read many times a
day by people who want the numbers, so the app is quiet, dense and flat. It differs from **every published
project** on four axes, each one a single theming decision:

- **Palette** — a cool **teal** primary (`#00695C` intent) on a light-neutral grey surface, with the four
  status colours as the only saturated ink on screen. Project 05 used a warm **violet** palette and project
  06 shipped Material's **default indigo/blue**; nothing in the portfolio is teal, and the coolness is the
  point — money and hours should not look playful.
- **Density and rhythm** — **compact** Material density on an **8px** grid. Projects 05 and 06 both ran
  Material's default (comfortable) density with generous card padding; here ten table rows must fit on a
  laptop screen, because the table is the app.
- **Shape** — **flat**: cards at elevation 0 with a 1px outline, and a small **4px** corner radius. 05 and
  06 both used the default rounded, elevated Material card. Flat surfaces plus one accent colour is what
  makes a data screen readable.
- **Data presentation** — the dominant surface is the **dense data table with an inline status badge**, and
  stat cards are a thin summary strip above it. 05 led with a card/board grid and 06 with form-centred
  pages; leading with the table is a different Material layout to build and to defend.

Layout skeleton stays a `MatSidenav` shell (as in 06) on purpose — a role-filtered sidebar is the correct
shell for seven routes, and the identity is carried by the four axes above, not by moving navigation for
the sake of it.

### App shell

`MatSidenav` with a fixed toolbar and a scrollable content area — the same skeleton as project 06, wearing
the teal / compact / flat identity above.

```
┌─────────────────────────────────────────────────┐
│  toolbar: logo + app name + user menu ▼         │
├──────────────┬──────────────────────────────────┤
│              │                                  │
│   sidebar    │        page content              │
│   EMPLOYEE   │                                  │
│  Dashboard   │                                  │
│  My Entries  │                                  │
│              │                                  │
│   MANAGER    │                                  │
│  Dashboard   │                                  │
│  Entries     │                                  │
│  Projects    │                                  │
│  Approvals ● │                                  │
│  Team        │                                  │
│  Reports     │                                  │
│              │                                  │
└──────────────┴──────────────────────────────────┘
```

- Sidebar links filtered by role — only one section is shown depending on who is logged in
- `MatBadge` on Approvals link showing the count of pending SUBMITTED entries
- Toolbar shows the logged-in user's name as a `MatMenu` trigger; the menu holds **Change password** and
  **Log out**, in that order. "Change password" opens the shared `change-password-dialog` (wireframe below)
  — per the §8 ruling it is a dialog, not a route, so it needs no new guard and no entry in §13's route list

---

### Colour palette

| Role | Colour | Usage |
|---|---|---|
| Primary | Teal (`#00695C`) | Toolbar, buttons, active links |
| DRAFT | Grey | Status badge |
| SUBMITTED | Blue (`#1976D2`) | Status badge |
| APPROVED | Green (`#388E3C`) | Status badge |
| REJECTED | Red (`#D32F2F`) | Status badge |
| Surface | White / light grey | Cards, sidebar background |

---

### Design system — decided once, obeyed by all eight pages

> **"Eight pages" throughout §14 and §20 means eight *views*, not eight routes.** §13 lists seven routes;
> `/dashboard` renders two genuinely different pages (employee and manager variants), which is why the
> visual QA checklist has eight screens to walk.

This project is a portfolio piece: a recruiter opens it for about two minutes, on an unknown screen, and
judges it before reading a line of code. What makes it look professional is not decoration — it is
**consistency**. Eight pages built on different days drift unless the values below are fixed up front, so
these are decisions, not suggestions, and each one is violable in the §6 sense: a reviewer can open a
stylesheet and point at the break.

| Decision | The rule |
|---|---|
| **Theming** | One `styles/material-theme.scss` holding a scoped `mat.theme()` (Angular Material v19 uses the M3 API). Component stylesheets **never** override Material internals with CSS — that is the pattern that breaks on every Material upgrade |
| **Primary colour** | A teal-based M3 palette, declared once in `material-theme.scss`. `#00695C` above is the **intent**; under M3 the theme generates its own tonal ramp from it, so the rendered hex will differ and that is correct — do not force the seed hex back with CSS |
| **Status colours** | Four CSS custom properties (`--status-draft`, `--status-submitted`, `--status-approved`, `--status-rejected`) declared once in the global stylesheet and consumed **only** by `status-badge`. They are not theme colours; no other component may reference them |
| **Typography** | Material's type scale only. Page title `headline-small`, section heading `title-medium`, table and body text `body-medium`, stat-card number `display-small`, card label `body-small` muted. **No `font-size` in a component stylesheet** |
| **Spacing** | An 8px grid: 8 · 16 · 24 · 32. Page padding 24 desktop / 16 below 600px, gap between cards 16, vertical gap between sections 32. No arbitrary pixel values |
| **Elevation & shape** | Flat, per the identity: cards are `<mat-card appearance="outlined">` at elevation 0 with a 1px outline; only overlays lift — dialogs at elevation 3, menus/snackbars at Material's default. Never a hand-written `box-shadow`. One 4px corner radius, set as the theme's shape token and never overridden per component |
| **Density** | Material's **compact** density, set once in `mat.theme()` and inherited by every `MatTable` and form field — so ten rows fit on a laptop screen without scrolling. Never set per table |
| **Dark mode** | **Out of scope, deliberately.** One theme finished properly beats two half-done, and the demo is judged in light mode. Revisit in project 08 |

---

### Motion

Animation here is feedback, not decoration — the bar is "the app feels responsive", not "the app moves".

- **Skeleton cards pulse.** A static skeleton reads as a broken page; a slow opacity keyframe reads as
  loading. This is the one animation that is not optional, because §14 mandates skeletons everywhere
- **Sidenav** uses Material's built-in slide in `over` mode — do not customise it
- **Dialogs and snackbars** keep Material's default enter/leave. No custom transitions
- **Approve / reject** gives its feedback through the snackbar and the row disappearing on refetch; no
  bespoke row animation
- **Budget:** any transition is ≤ 200ms and fires on a state change only. Nothing animates on page load,
  nothing loops, nothing moves purely to look busy
- **`prefers-reduced-motion`** disables the skeleton pulse — a media query in the global stylesheet

---

### Accessibility floor

Small list, non-negotiable, and cheap if done as each page is built rather than at the end:

- **Every icon-only button carries an `aria-label`.** ✏ 🗑 ✓ ✕ ➤ are the entire interaction on Entries,
  Projects, Team and Approvals — without labels those four pages are unusable with a screen reader
- **Status is never conveyed by colour alone.** The badge always shows its text; the colour reinforces it
- **Check the four status colours at badge size** against the 4.5:1 AA contrast ratio on white, and darken
  the green and the blue if they fall short. Verify, do not assume — small text on a coloured chip is the
  usual place this fails
- **Focus stays visible** — never `outline: none` without a replacement. `MatDialog` already traps focus:
  do not break it
- **Every table action is reachable by keyboard**, in the order the row reads

---

### Visual QA — the finish bar

The gap between "it works" and "it looks finished" is where portfolio projects usually die, so it gets a
checklist rather than good intentions. Run it **at the end of Step 7d, before gate G4**, over all eight
pages in one sitting — that is the only way inconsistency becomes visible:

- [ ] Every page uses the type scale and the 8px grid — no stray `font-size`, no arbitrary margin
- [ ] The three states (loading · error · empty) are reachable on every page: throttle the network for
      loading, stop the backend for error, filter to a month with no data for empty
- [ ] All four status colours pass contrast at badge size, and no status reads by colour alone
- [ ] Every icon-only button has an `aria-label`; every table action is reachable by tab
- [ ] At 1024, 768 and 375px wide: no horizontal page scroll, sidenav behaves per the responsive rules,
      tables scroll inside their wrapper, dialogs go full-screen below 600
- [ ] Skeletons pulse; nothing else animates on load; `prefers-reduced-motion` stops the pulse
- [ ] Two screenshots worth putting in the README exist — the manager dashboard and the entries page

---

### Material components used

| Component | Where |
|---|---|
| `MatSidenav` | App shell |
| `MatToolbar` | Top bar |
| `MatCard` | Stat cards on dashboard and reports |
| `MatTable` + `MatSort` + `MatPaginator` | Entries, Projects, Approvals |
| `MatDialog` | Entry form (add and edit), reject dialog, confirm dialog, change-password dialog |
| `MatDatepicker` | Date field in entry form |
| `MatSelect` | Project selector in entry form, month filter |
| `MatChip` (or styled `<span>`) | Status badges |
| `MatSnackBar` | Feedback after every action |
| `MatBadge` | Pending count on Approvals sidebar link |
| `MatProgressSpinner` | Loading state on every async page |
| `MatTooltip` | Approve/reject buttons in the approvals table |
| `MatMenu` | User menu in toolbar (change password, logout) |
| `MatFab` | "Log hours" floating action button on the entries page |

---

### The three states of every page

§6's **Async states** rule applies to every page below, so it is specified once here instead of being
repeated in each wireframe. A page that renders only its success table is incomplete.

- **Loading** — a centred `MatProgressSpinner` replaces the content area while the page's `loading()`
  signal is true. Stat cards render as skeleton cards (the card outline with a grey bar instead of the
  number), never as `0` — a real zero and "not loaded yet" must not look the same
- **Error** — the call failed: a `mat-error` line with the backend `message` from the §10 `ErrorResponse`
  plus a **Retry** button that re-issues the same call. No table, no cards, no empty message. A `401` is
  not a page error — the interceptor has already redirected to `/login`
- **Empty** — the call succeeded with zero rows: the per-page message named in its wireframe below, plus
  the primary action where one exists ("Log your first entry", "Add your first member")

| Page | Loading | Error | Empty |
|---|---|---|---|
| Login | Spinner inside the "Log in" button, form disabled | `mat-error` under the form: "Invalid email or password" (`401`) — no retry button, the form *is* the retry | n/a — no data load |
| Dashboard (employee) | Skeleton cards + spinner over the recent list | `mat-error` + Retry, replacing both cards and list | "You have not logged any hours yet" + "Log your first entry" |
| Dashboard (manager) | Skeleton cards + spinner over the review list | `mat-error` + Retry — one failed `forkJoin` call fails the whole load, since a dashboard with three of four cards is misleading | "No pending approvals. Your team is up to date." |
| Entries | Spinner over the table, filter bar stays enabled | `mat-error` + Retry above the table | "No entries found for this period" + "Log your first entry" (button hidden for managers) |
| Projects | Skeleton cards + spinner over the table | `mat-error` + Retry | "No projects yet. Create your first project." |
| Approvals | Spinner over the table, filter bar stays enabled | `mat-error` + Retry | "No pending approvals. Your team is up to date." |
| Team | Skeleton cards + spinner over the table | `mat-error` + Retry | "No team members yet. Add your first member." |
| Reports | Skeleton cards + spinner over both tables | `mat-error` + Retry for the whole `forkJoin` | "No approved hours for this month yet." in place of the cards and both tables |
| Entry dialog / user dialog / reject dialog | Spinner inside the Save button, fields disabled while saving | Backend `fieldErrors` under the offending input — a `@Valid` 400, or the 409 on a duplicate email / project name (§10); anything else in a `mat-error` at the dialog foot — the dialog stays open so the typed values are not lost | n/a — a form dialog always opens with its fields |
| Change-password dialog | Spinner inside the "Change password" button, all three fields disabled while saving | `fieldErrors.currentPassword` under the **current password** input and `fieldErrors.newPassword` under the new one (both `400`, per the §8 status ruling — a wrong current password is *not* a 401 and must not log the user out); anything else in a `mat-error` at the dialog foot, dialog stays open | n/a — a form dialog always opens with its fields |

---

### Responsive intent

Desktop-first, but the demo must survive a recruiter opening the link on a phone:

- **Sidenav** — `mode="side"` and permanently open at ≥ 1024px; below that it becomes `mode="over"`,
  closed by default and opened by a hamburger button in the toolbar
- **Tables** — every `MatTable` sits in an `overflow-x: auto` wrapper so a narrow viewport scrolls the
  table instead of the page. Below 600px the Entries and Approvals tables hide the Description column
  (the least load-bearing) rather than shrinking every column
- **Stat cards** — a CSS grid with `repeat(auto-fit, minmax(200px, 1fr))`, so four cards reflow to two
  and then one with no breakpoint of their own
- **Login** — the two-column split collapses to the form card alone below 768px; the branding panel is
  hidden, not stacked
- **Dialogs** — `MatDialog` opens full-screen below 600px

---

### View by view

#### Login

Split layout — two columns:
- Left: a dark teal panel, app logo, tagline ("Track your time. Get recognised."). Take the colour from a
  **theme token** (the M3 primary container / a dark tone of the generated ramp), never a hand-picked hex —
  the design-system table forbids forcing the seed colour back with CSS, and this panel is the one place
  tempting enough to break it
- Right: white background, form card centred vertically

```
┌──────────────────┬─────────────────────┐
│                  │                     │
│   [logo]         │   Welcome back      │
│                  │                     │
│   TimeTrack      │   Email ________    │
│                  │   Password _____    │
│   Track your     │                     │
│   time.          │   [Log in]          │
│   Get            │                     │
│   recognised.    │                     │
└──────────────────┴─────────────────────┘
```

No register link — accounts are created by the manager from the Team page.

---

#### Change password — dialog (`shared/components/change-password-dialog`)

Not a page and not a route: opened from the **Change password** item in the app shell's user menu, for
either role. It is the only UI for the §8 self-service rule — without it the backend-generated initial
password would be permanent in practice.

```
┌──────────────────────────────────────┐
│  Change password                  ✕  │
│                                      │
│  Current password  [password input]  │
│  ⚠ Current password is incorrect     │
│                                      │
│  New password      [password input]  │
│  Confirm new       [password input]  │
│                                      │
│         [Cancel]  [Change password]  │
└──────────────────────────────────────┘
```

- Calls `PATCH /api/users/me/password` with `currentPassword` + `newPassword`; `204` closes the dialog and
  a snackbar confirms "Password changed". No re-login and no token refresh — the JWT stays valid
- **Loading** — the Change password button shows its spinner and all three fields disable while the call is
  in flight, exactly as the other form dialogs
- **Error** — a `400` carrying `fieldErrors.currentPassword` renders **under the current-password input**
  (the ⚠ line in the wireframe), never as a dialog-level error: the user must see *which* field is wrong.
  `fieldErrors.newPassword` (the 8–72 length rule) renders under the new-password input. Any other failure
  is a `mat-error` at the dialog foot. The dialog never closes on error, so nothing typed is lost
- **Empty** — n/a, a form dialog always opens with its three fields
- "Confirm new" is validated **on the frontend only** (a cross-field validator on the reactive form) — the
  backend has no `confirmPassword` field in `ChangePasswordRequest` (§10), so this error never comes from a
  `fieldErrors` map
- Both password inputs use a `MatIconButton` suffix to toggle visibility, with an `aria-label` per the
  accessibility floor; the dialog goes full-screen below 600px like every other dialog

---

#### Team page — Manager only

Stat cards + user table + "Add member" button.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 5            │  │ 4            │  │ 1            │  │ 1            │
│ Total        │  │ Employees    │  │ Managers     │  │ Inactive     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

                                                       [+ Add member]
┌──────────────────────────────────────────────────────────────┐
│ Name         │ Email              │ Role     │ Status   │    │
│─────────────────────────────────────────────────────────────│
│ Ana García   │ ana@company.com    │ Employee │ Active   │ ✏ 🗑 │
│ Luis Martín  │ luis@company.com   │ Employee │ Active   │ ✏ 🗑 │
│ Sara López   │ sara@company.com   │ Manager  │ Active   │ ✏ 🗑 │
│ Iván Ruiz    │ ivan@company.com   │ Employee │ Inactive │ ✏ 🗑 │
└──────────────────────────────────────────────────────────────┘
```

- The 🗑 icon deactivates the account (soft delete) — it does not delete data. A deactivated user keeps
  every entry they logged and simply cannot log in, so the row **stays in the table** with an "Inactive"
  status, exactly as an archived project does on the Projects page
- `GET /api/users` returns active and inactive accounts alike (§10), which is what makes reactivation
  reachable: the ✏ dialog on an "Inactive" row is the only path back to `active = true` via
  `PUT /api/users/{id}`. Hiding inactive users from the list would strand those accounts
- The four cards count over the **whole** list: `Total`, and the `Employees`/`Managers` split, include
  deactivated accounts; `Inactive` is the deactivated subset cutting across both roles. Four cards
  rather than the Projects page's three because users carry two independent axes — role and status
- Empty state: "No team members yet. Add your first member."

##### User form — dialog (`team/user-dialog`)

"Add member" (and the ✏ icon) opens a `MatDialog`: name + email + role selector (Employee / Manager).
**No password field** — the backend generates it (§8).

```
┌──────────────────────────────────┐
│  Add member                   ✕  │
│                                  │
│  Name     [text input]           │
│  Email    [text input]           │
│  Role     [select ▼]             │
│           Employee / Manager     │
│                                  │
│              [Cancel]  [Save]    │
└──────────────────────────────────┘
```

- Same dialog in edit mode, titled "Edit member" and pre-filled; `active` is not edited here — the 🗑 icon
  owns deactivation
- Field errors come from the backend `fieldErrors` map (e.g. a duplicate email → 409 shown on the field)
- Empty/blank state: none — the dialog always opens with the three fields

After creation, a snackbar shows the `generatedPassword` from the `CreateUserResponse` so the manager can
pass it on. It is shown **once and never again**: the plaintext exists only in that single response, so the
snackbar needs a copy-to-clipboard action and a long-enough duration (or a small dismissible dialog rather
than an auto-hiding snackbar) — a manager who misses it cannot recover the password, only deactivate the
account and recreate it.

---

#### Dashboard — Employee

Four stat cards + recent entries list.

```
Good morning, Victor

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 16h      │ │ 52h      │ │ 3        │ │ 8        │
│ This     │ │ This     │ │ Pending  │ │ Approved │
│ week     │ │ month    │ │ review   │ │ this mo. │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

Recent entries
┌──────────────────────────────────────────────────┐
│ Project A  │ May 14  │ 4h  │ API integration  │ APPROVED  │
│ Project B  │ May 13  │ 8h  │ Frontend work    │ SUBMITTED │
│ Project A  │ May 12  │ 6h  │ Unit tests       │ DRAFT     │
└──────────────────────────────────────────────────┘
```

**How stat cards get their data:**
- **Totals come from an aggregation endpoint, never from summing the entries list.** `GET /api/entries`
  is paged, so a client-side sum would silently report the first page's hours as the month's. The rule
  outlives pagination anyway: a total is the database's job, not the browser's — summing it in Angular
  means fetching every row of the month to add one column
- The employee dashboard therefore needs `GET /api/reports/summary` **scoped to the caller**, the same
  ownership rule `GET /api/entries` already applies (employee → own, manager → all). The endpoint is
  MANAGER-only and company-wide today, so widening it is a prerequisite of this page
- "Pending review" and "Approved this month" are counts, and a paged response carries them exactly:
  `page.totalElements` with `?status=…&size=1`, which is cheaper than the old count-the-array approach
- The recent-entries table below the cards is the one genuine consumer of the list itself, and it reads
  page 0 directly

Empty state (new user): illustration + "You have not logged any hours yet" + "Log your first entry" button.

---

#### Dashboard — Manager

Four stat cards + pending approvals list with quick actions.

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 5        │ │ 5        │ │ 240h     │ │ 3        │
│ Pending  │ │ Team     │ │ Approved │ │ Active   │
│ approval │ │ members  │ │ this mo. │ │ projects │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

Waiting for your review
┌──────────────────────────────────────────────────────────────────┐
│ Ana García   │ Project A  │ May 14  │ 8h  │ [Approve] [Reject]  │
│ Luis Martín  │ Project B  │ May 13  │ 4h  │ [Approve] [Reject]  │
└──────────────────────────────────────────────────────────────────┘
                                              [View all →]
```

**How stat cards get their data:**
- "Pending approval" — `GET /api/entries?status=SUBMITTED`, count results
- "Team members" — `GET /api/users`, count results
- "Approved this mo." — `GET /api/reports/summary?month=2025-05`, read `approvedHours`. The card is labelled with what it counts (approved hours only, per §8), never "Total"
- "Active projects" — `GET /api/projects`, count active ones
- Four separate API calls on dashboard load — all run in parallel with `forkJoin`

Empty state: "No pending approvals. Your team is up to date."

---

#### Entries page — both roles

Filter bar + table + floating action button (employee only).

```
[Month ▼]  [Project ▼]  [Status ▼]              [+ Log hours]  ← hidden for managers

┌──────────────────────────────────────────────────────────┐
│ Date    │ Project   │ Hours │ Description  │ Status   │   │
│─────────────────────────────────────────────────────────│
│ May 14  │ Project A │ 4h    │ API work     │ APPROVED │   │
│ May 13  │ Project B │ 8h    │ Frontend     │ SUBMITTED│   │
│ May 12  │ Project A │ 6h    │ Tests        │ DRAFT    │ ✏ 🗑 ➤ │
│ May 11  │ Project B │ 2h    │ Bugfix       │ REJECTED │ [Re-open] │
└──────────────────────────────────────────────────────────┘
```

- Status is a coloured badge rendered by the shared `status-badge` component
- Edit, delete, and submit icons only appear on DRAFT rows — and only for employees
- **REJECTED rows show a "Re-open" action instead** (owner only, `PATCH /api/entries/{id}/reopen`): it returns
  the entry to DRAFT, where the edit / delete / submit icons above take over — the correct-and-resubmit loop
  in the §8 state machine. A REJECTED row also surfaces the manager's `rejectionNote` (tooltip on the badge)
  so the employee knows what to fix. Managers never see this action
- "Submit" inline button: quick action — changes status to SUBMITTED without opening the dialog
- Manager sees an extra "Employee" column and all users' entries; employee sees only their own — same route, different data from the API
- Empty state: "No entries found for this period" + "Log your first entry" button (button hidden for managers)

---

#### Entry form — dialog

Opens as a `MatDialog` from the "Log hours" button or the edit icon.

```
┌──────────────────────────────────┐
│  Log hours                    ✕  │
│                                  │
│  Project  [select ▼]             │
│  Date     [date picker]          │
│  Hours    [number input]         │
│  Description                     │
│  [                             ] │
│                                  │
│              [Cancel]  [Save]    │
└──────────────────────────────────┘
```

Edit mode: same dialog, pre-filled, title changes to "Edit entry".
A "Submit for review" button appears when editing a DRAFT entry — this saves and submits in one step.
The inline Submit button in the table is a quick action (no dialog). Both paths lead to the same result.

---

#### Projects page — Manager

Stat cards + table with CRUD actions.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 8            │  │ 6            │  │ 2            │
│ Total        │  │ Active       │  │ Inactive     │
└──────────────┘  └──────────────┘  └──────────────┘

                                         [+ New project]
┌──────────────────────────────────────────────────┐
│ Name        │ Description  │ Status  │ Entries │  │
│─────────────────────────────────────────────────│
│ Project A   │ Main client  │ Active  │ 42      │ ✏ 🗑 │
│ Project B   │ Internal     │ Active  │ 15      │ ✏ 🗑 │
└──────────────────────────────────────────────────┘
```

- The 🗑 icon deactivates the project (soft delete) — an inactive project keeps its entries and simply
  stops accepting new ones, so the row stays in the table with an "Inactive" status
- Empty state: "No projects yet. Create your first project." + the "+ New project" button
- Loading and error states as declared in "The three states of every page"

---

#### Approvals page — Manager

Filter bar + table with approve/reject actions per row.
Defaults to SUBMITTED — but the status filter lets the manager see the full history.

```
[Month ▼]  [Employee ▼]  [Project ▼]  [Status ▼ → default: Pending]

┌──────────────────────────────────────────────────────────────────┐
│ Employee    │ Project   │ Date    │ Hours │ Description │        │
│────────────────────────────────────────────────────────────────│
│ Ana García  │ Project A │ May 14  │ 8h    │ API work    │ ✓  ✕  │
│ Luis Martín │ Project B │ May 13  │ 4h    │ Frontend    │ ✓  ✕  │
└──────────────────────────────────────────────────────────────────┘
```

- ✓ = approve (green icon button with tooltip), ✕ = reject (red icon button with tooltip)
- Reject opens the shared `reject-dialog` to enter the rejection note
- Approve/reject buttons only appear on SUBMITTED rows — hidden for APPROVED/REJECTED
- Empty state (SUBMITTED filter): "No pending approvals. Your team is up to date."

---

#### Reports page — Manager

Month selector + summary stat cards + two tables.

```
Report for  [May 2025 ▼]

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 240h         │  │ 5            │  │ 3            │
│ Approved     │  │ Employees    │  │ Projects     │
│ this month   │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘

Hours by project                    Hours by employee
┌────────────────────────┐          ┌────────────────────────┐
│ Project A  │ 120h      │          │ Ana García  │ 80h      │
│ Project B  │  80h      │          │ Luis Martín │ 60h      │
│ Project C  │  40h      │          │ Sara López  │ 40h      │
└────────────────────────┘          └────────────────────────┘
```

**Where each card's number comes from** — only the first is served by `/api/reports/summary`:
- "Approved this month" — `GET /api/reports/summary?month=`, read `approvedHours`. The card is **not**
  labelled "Total hours": it counts APPROVED only (§8), and a label that says "total" over a filtered
  number is the exact mismatch the §8 reporting rule was written to remove — the same correction already
  applied to the manager dashboard's card
- "Employees" — the **length of the by-user array**, not a summary field
- "Projects" — the **length of the by-project array**, not a summary field

All three report calls run in parallel with `forkJoin` on month change. Because every aggregate counts
`APPROVED` only (§8), the "Approved this month" card equals the sum of either table exactly — that reconciliation
is the point of the rule, and it is worth asserting in a test.

Empty state (a month with no approved hours): "No approved hours for this month yet." replaces the cards
and both tables — the month selector stays enabled so another month can be picked without a reload.

`pendingHours` is **not** one of these three cards. Surface it separately — e.g. a "· 24h awaiting
approval" line under the card or a fourth card clearly labelled as pending — never added into the total.

---

### Inspiration

Real products in this domain — a recruiter recognises them. **One concrete element per row**, not "general
inspiration":

| App | URL | The one element to take |
|---|---|---|
| Clockify | [clockify.me](https://clockify.me) | The **row height and column order of the entry table** — date, project, hours, description, status — which is exactly the Entries table above |
| Harvest | [getharvest.com](https://www.getharvest.com) | The **thin summary strip of numbers above the report tables**, rather than large hero cards |
| Toggl Track | [toggl.com/track](https://toggl.com/track) | The **teal-on-neutral primary** used sparingly against a grey surface |
| Linear | [linear.app](https://linear.app) | The **flat, low-radius status badge**: small caps text on a tinted fill, no shadow |

**Traceability** — two identity decisions come straight from this table: the *palette* axis (cool teal on a
light-neutral surface) from the Toggl row, and the *shape* axis (flat, 4px radius, outlined surfaces) from
the Linear row. The `status-badge` component is built to that Linear description.

---

## 15. Progressive learning plan

This is the first Spring Boot project. Each step introduces one new concept.

### Step 1 — Spring Boot foundation ✅
- Create project with Spring Initializr (dependencies: Spring Web, Spring Data JPA, PostgreSQL Driver, Lombok)
- Connect to PostgreSQL via `application.properties`; create the `timetrack` database in pgAdmin
- Create `User` entity, `UserRepository` (`JpaRepository`), `UserService.getAll()`, `UserController` with `GET /api/users`
- **New concepts:** layered architecture, REST API + SPA separation (the backend returns JSON and has no View layer — the same single decision as choosing layered architecture over MVC, not a second topic), `@Entity`/JPA basics, `JpaRepository` + derived query methods (`findByEmail` style finders)
- **Review concepts:** none (first backend step)
- **Done condition:** `Terminal: mvn spring-boot:run — started on port 8080` and `Browser: GET localhost:8080/api/users returns [] at /api/users`

### Step 2 — Full CRUD for Projects ✅
- Create `Project` entity, repository, service, controller
- GET all, GET by id, POST, PUT, DELETE (soft delete) with DTOs
- **New concepts:** DTO request/response boundary, REST conventions, soft delete , `Optional<T>` + custom unchecked exceptions in the service (one major concept: the DTO boundary — REST conventions, the soft-delete flag and the `Optional`/exception pair are one-line applications of it, not separate topics)
- **Review concepts:** layered architecture
- **Done condition:** `Postman: POST /api/projects returns 201 — body has id + name; GET /api/projects returns 200 with the created project`

### Step 3 — Spring Security + JWT ✅
- Add Spring Security; configure CORS for `localhost:4200`
- Login endpoint `POST /api/auth/login`; BCrypt password hashing; generate + validate JWT
- Protect all routes except `/api/auth/login`; add `GlobalExceptionHandler` (`@RestControllerAdvice`)
- **New concepts:** Spring Security + JWT (the one major concept), CORS, `@RestControllerAdvice` — the last two ride along deliberately: CORS is one config line the JWT filter chain forces you to touch anyway, and the exception handler is what turns the new auth failures into readable JSON
- **Review concepts:** DTO boundary (LoginRequest/AuthResponse)
- **Done condition:** `Postman: POST /api/auth/login returns 200 — body has token; GET /api/projects without token returns 401`

### Step 4 — Role-based authorization ✅
- Add `role` and `active` to `User` (EMPLOYEE / MANAGER)
- Seed the first manager account on startup
- `@PreAuthorize("hasRole('MANAGER')")` on project and user write endpoints
- `SecurityContextHolder` to read the current user inside a service
- **New concepts:** `@PreAuthorize` role checks, startup seeding, `SecurityContextHolder`
- **Built as `data.sql`, replaced 2026-07-23** by the profile-gated `DataInitializer` (§9) — the step is
  still ✅ on the concept it taught; the seeding *mechanism* changed for the security reason recorded in §9
- **Review concepts:** JWT flow (token now carries the role)
- **Done condition:** `Postman: POST /api/projects with EMPLOYEE token returns 403; with MANAGER token returns 201`

### Step 5 — TimeEntry CRUD + workflow ✅
- `TimeEntry` entity with `@ManyToOne` to User and Project
- `GET /api/entries` filters by current user (employee) or returns all (manager)
- Optional query filters on `GET /api/entries` (`?month=`, `?status=`, `?projectId=`) via `Specification<T>` + `JpaSpecificationExecutor`
- CRUD with business-rule validation (future date, inactive project, DRAFT-only edits)
- Status transitions: submit, approve, reject (PATCH)
- **New concepts:** `@ManyToOne` relationships, state machine workflow, PATCH for transitions, role-based data filtering, `Specification<T>` dynamic query filters, Bean Validation (`@Valid` + `@NotNull`/`@NotBlank`) on request DTOs
- **Concept density — called out deliberately:** this step carries more than one major concept (relationships · state machine · dynamic filters). Splitting was rejected because the workflow is what makes `TimeEntry` worth modelling at all, and the `Specification<T>` filters were forced mid-step by a real PostgreSQL bug (`42P18`) rather than planned. Kept as one step so the history matches what was actually built.
- **Review concepts:** soft delete, `SecurityContextHolder`
- **Done condition:** `Postman: POST /api/entries returns 201 — status DRAFT; PATCH /api/entries/{id}/approve as employee returns 403; as manager on a SUBMITTED entry returns 200 — status APPROVED`
- **Concept learned:** hard delete (`deleteById`) is correct here — `TimeEntry` has no `active` field like `Project`/`User`, and only DRAFT entries can be removed, so nothing worth preserving is lost. Bean Validation (`@NotBlank`/`@NotNull` + `@Valid`) was added across all request DTOs (`CreateProjectRequest`, `UpdateProjectRequest`, `CreateTimeEntryRequest`, `RejectRequest`) as part of this step, plus a `PUT /api/entries/{id}` (edit DRAFT) and `DELETE /api/entries/{id}` (delete DRAFT) endpoint — both reusing the owner + DRAFT-only guards, and PUT re-running create's business rules (future date, inactive project, hours range) since it replaces the whole resource.
- **Deferred out of this step, built later:** `PATCH /api/entries/{id}/reopen` (EMPLOYEE, owner-only, REJECTED → DRAFT) — the §10 endpoint that closes the resubmit loop in the workflow diagram. Step 5 stays ✅ on the scope it actually shipped; the endpoint was built as a **backend-backlog task** on `fix/backend-backlog` and Postman-verified on 2026-07-22. Its unit test is listed in Section 16. Building it surfaced a related fix applied in the same pass: every state-machine guard was throwing `BusinessRuleViolationException` (400) for what is really a state conflict, so `InvalidStateTransitionException` (409) was split out, leaving 400 for input-data rules only.

### Step 6 — Reports ✅
- Aggregate queries with JPQL
- Summary by project and by user for a given month
- **New concepts:** JPQL aggregation queries, query filters with `@RequestParam`, interface projections for query results
- **Review concepts:** `@PreAuthorize` (reports are MANAGER only)
- **Done condition:** `Postman: GET /api/reports/by-project?month=2025-05 returns 200 — array of { projectName, totalHours }`
- **Concept learned:** interface projections (`ProjectHoursReportResponse`, `UserHoursReportResponse`) let Spring Data build a proxy per result row directly from `SELECT ... AS alias` — no class, no manual mapping — as long as each getter's name matches an alias exactly (Java Bean convention: strip `get`, lowercase first letter). `YearMonth` is received in the controller but converted to a `LocalDate` start/end range in the service (business logic), not the controller. Repositories are organized by **entity** (`TimeEntryRepository` owns both report queries, since their `FROM` is `TimeEntry`), a different axis than controllers/services, which are organized by **feature** (`ReportController`/`ReportService`). Found and fixed two real bugs surfaced by the Postman test pass: `MissingServletRequestParameterException` and `MethodArgumentTypeMismatchException` aren't `RuntimeException`s / weren't specifically handled, so a missing or malformed `?month=` fell through to `500` — worse, the missing-param case revealed a genuine Spring Security gotcha where Spring's internal forward to `/error` gets rejected as unauthenticated (`401`) because `JwtFilter` skips error dispatches by default and `/error` was never excluded from `.anyRequest().authenticated()`.

### Step 7 — Angular frontend (split into 7a / 7b / 7c / 7d)

One step per coherent slice, days not weeks — same granularity the backend had. Each sub-step has its
own done condition covering its **full** scope, and each falls inside exactly one §22 branch — 7c and 7d
share `feat/angular-manager-pages`, since §22's rule is one branch per coherent feature, never one per step.

#### Step 7a — Shell + auth

> **Backend prerequisite — the one Medium that gates this step.** The toolbar dialog below calls
> `PATCH /api/users/me/password`, which does not exist yet: the account-password flow (`SecureRandom`
> generation · `CreateUserResponse` · the endpoint itself) is an open **Medium** in `PROJECT-BACKLOG.md`,
> not a §15 step, and it must be built on `fix/backend-backlog` and merged **before**
> `feat/angular-shell-auth` opens. No other Medium or Low blocks this step — only this one, because 7a
> ships its consumer.

- Angular project with Angular Material; `environment.ts` with the API base URL
- **The §14 design system is set up here, before any page exists** — `styles/material-theme.scss` with the
  scoped `mat.theme()` (teal-based M3 palette, compact density, 4px shape token), the four `--status-*` custom properties,
  and the spacing/type rules. Every later step inherits it; retrofitting a theme across eight built pages
  is the expensive way to do this
- Auth service + JWT in localStorage; auth guard + manager guard
- HTTP interceptor: attaches the token **and handles 401 mid-session** (clear session → redirect to `/login`) — see the token-lifetime note in the REST API section
- App shell: `MatSidenav` + toolbar, sidebar links filtered by role; Login page
- Toolbar user menu (`MatMenu`) with **Change password** + **Log out**, and the shared
  `change-password-dialog` it opens — a dialog, not a route (§13) — calling
  `UserService.changePassword()` → `PATCH /api/users/me/password`. It ships here rather than in a later
  page step because the menu that opens it is part of the shell, and every authenticated user needs it
  from the moment logins work with a generated password
- The dialog renders its declared §14 states: spinner in the "Change password" button with all three
  fields disabled while saving, and the `400` `fieldErrors.currentPassword` / `fieldErrors.newPassword`
  messages under their own inputs with the dialog staying open (a wrong current password must not log
  the user out)
- The Login page ships its declared §14 states from the start: spinner inside the "Log in" button with the
  form disabled while the call is in flight, and a `mat-error` under the form on `401` (§6's Async-states
  rule; Login has no empty state — it loads no data)
- **New concepts:** Angular consuming a real REST API end to end
- **Review concepts:** route guards, HTTP interceptor, auth persistence, `MatSidenav` shell
- **Done condition:** `Browser: login at localhost:4200 redirects to /dashboard inside the shell; a wrong password shows the mat-error under the form while the button spins during the call; the toolbar user menu opens the change-password dialog and a wrong current password shows the error under that input with the dialog open and the session intact, while a correct one closes it and the new password logs in; /projects as EMPLOYEE redirects away; a request with an expired token returns the user to /login`

#### Step 7b — Employee flow: dashboard + entries
- Employee dashboard (stat cards from one `GET /api/entries?month=` call) + recent entries
- Entries page: filter bar, table, FAB; entry-dialog (create/edit); inline submit quick action
- **Re-open action on REJECTED rows** (owner only, §8/§14): calls `PATCH /api/entries/{id}/reopen`, the row returns to DRAFT and the edit / delete / submit icons take over; the row also surfaces the manager's `rejectionNote`
- Shared components: `status-badge`, `confirm-dialog`
- Reactive forms consume the `fieldErrors` map from the error contract — message under each input on 400
- Both pages render the three §14 states, not just the success table: `MatProgressSpinner` while
  `loading()` is true (skeleton cards on the dashboard), `mat-error` + **Retry** when the call fails, and
  the per-page empty message ("No entries found for this period" / "You have not logged any hours yet")
- **Review concepts:** coordinator pattern, reactive forms, MatTable/MatDialog, signals + `computed()`
- **Done condition:** `Browser: at /entries an employee creates, edits and submits an entry and the table + dashboard cards update; the table shows "No entries found for this period" before the first entry exists and a mat-error with a working Retry when the API is down; Re-open on a REJECTED row returns it to DRAFT with the edit/delete/submit icons visible; an invalid form submit shows the backend field error under the input`

#### Step 7c — Manager review flow: dashboard, approvals, projects
- Manager dashboard (`forkJoin` stat cards) + pending approvals list with inline approve / reject
- Approvals page (filter bar + queue) with the shared `reject-dialog`; `MatBadge` pending count in the shell
- Projects page (CRUD) reusing `confirm-dialog` for the soft-delete confirmation
- Three §14 states on each page: skeleton cards / spinner over the table, `mat-error` + Retry (one failed
  `forkJoin` call fails the whole dashboard load), and the per-page empty message
- **Review concepts:** `forkJoin`, role-aware UI, MatTable, `MatBadge`
- **Done condition:** `Browser: as MANAGER, approve one entry and reject another (with note) at /approvals and the dashboard "Pending approval" card drops; create and deactivate a project at /projects; with the queue emptied /approvals shows "No pending approvals. Your team is up to date."`

#### Step 7d — Manager admin: team + reports
- Team page + `user-dialog` (name, email, role — no password field); the generated password is surfaced once
  in a copyable snackbar from the `CreateUserResponse` (§14)
- Reports page: month selector, summary cards and the two `forkJoin` hours tables
- Same three §14 states on both pages; the Reports empty state replaces the cards and both tables while the
  month selector stays enabled
- **The §14 Visual QA checklist runs here**, over all eight pages at once — this is the last frontend step,
  so it is the only point where inconsistency between pages built on different days is visible. Anything it
  finds is fixed now, not filed: G4 is the next gate and a portfolio verdict comes after it
- **Review concepts:** reactive forms, MatTable, `forkJoin`, role-aware UI
- **Done condition:** `Browser: as MANAGER, create a user at /team and the generated password appears once in the snackbar; /reports renders both hours tables for a selected month and shows "No approved hours for this month yet." for a month with none; the §14 Visual QA checklist passes on all eight pages at 1024, 768 and 375px`

### Step 8 — Backend tests
- JUnit 5 + Mockito — one test per service method
- Cover edge cases, not just the happy path (see Section 16)
- **New concepts:** JUnit 5 + Mockito unit testing
- **Review concepts:** business rules and state machine (asserted through tests)
- **Done condition:** `Terminal: mvn test passes — TimeEntryServiceTest, UserServiceTest, ProjectServiceTest, AuthServiceTest and ReportServiceTest all green; approve_throwsWhenNotSubmitted and getSummary_approvedHoursEqualsByProjectSum asserted`

### Step 9 — Angular tests
- Jasmine + TestBed with `HttpClientTestingModule` — one test per service method listed in Section 16
- Assert the request (URL, method, params, body) and the returned typed value; only `AuthService` asserts
  stored state, because §6's Service-boundary rule says the other services hold none
- Cover the edge cases in Section 16, not only the happy path — the unset-filter param, the un-swallowed
  `fieldErrors` on 400, the 401 that must not half-authenticate
- Component tests are NOT in scope — per CLAUDE.md they start at project 08; this project tests services only
- **New concepts:** Angular service unit testing with `HttpClientTestingModule`
- **Review concepts:** auth, entry, user and report services
- **Done condition:** `Terminal: ng test passes — AuthService, EntryService, UserService and ReportService specs all green; getEntries issues a GET to /api/entries with no empty params when a filter is unset, changePassword surfaces the 400 fieldErrors without clearing the session, and a failed login leaves the token unstored`

### Step 10 — SQL complement
- In `sql/`, hand-write the SQL that Hibernate generates for the main report queries (the `GROUP BY` aggregations) and for `GET /api/entries` with filters
- Compare your SQL output in pgAdmin against the API response — they must match
- **New concepts:** reading Hibernate-generated SQL; connecting JPQL to raw SQL
- **Review concepts:** JPQL aggregations, daily SQL block (`GROUP BY`, `SUM`, `WHERE`)
- **Done condition:** `pgAdmin: the hand-written GROUP BY query in sql/ returns hours-per-project rows matching GET /api/reports/by-project`

### Step 11 — Docker
- `Dockerfile` for the Spring Boot app
- `docker-compose.yml` with Spring Boot + PostgreSQL services
- Config per environment: `JWT_SECRET` and DB credentials as env vars in the compose file (never in the image); a `docker` Spring profile (`application-docker.properties`) overrides the DB host to the compose service name instead of `localhost`
- `docker-compose up` runs everything locally
- **New concepts:** Docker + docker-compose, containerisation
- **Review concepts:** none
- **Done condition:** `Terminal: docker-compose up — app reachable at localhost:8080/api/users and the Postgres service is healthy`

---

## 16. Testing plan

### Backend — JUnit 5 + Mockito (Step 8)

Mock the repository; test the service in isolation. Cover the edge cases, not only the happy path.

| Service method | Happy path | Edge cases to cover |
|---|---|---|
| `TimeEntryService.create` | Saves a DRAFT entry | future date → throws; inactive project → throws; hours < 0.5 or > 24 → throws |
| `TimeEntryService.update` / `.delete` | Edits / removes an own DRAFT entry | entry not DRAFT → throws; caller is not the owner → `ResourceNotFoundException` (404), indistinguishable from an unknown id; update re-runs create's rules (future date, hours range, inactive project) |
| `TimeEntryService.findByFilter` | EMPLOYEE gets only their own entries; MANAGER gets all | filters (`month`, `status`, `projectId`) narrow the result; an employee never receives another user's entry; a MANAGER-only `userId` supplied by an EMPLOYEE caller is overwritten with their own id |
| `TimeEntryService.submit` | DRAFT → SUBMITTED | entry not DRAFT → throws `InvalidStateTransitionException` (409); caller is not the owner → `ResourceNotFoundException` (404), indistinguishable from an unknown id; **the entry's project is inactive → throws `BusinessRuleViolationException` (400)** and the entry stays DRAFT (the §8 rule "cannot submit entries for an inactive project") |
| `TimeEntryService.reopen` | REJECTED → DRAFT for the owner | entry not REJECTED → throws; caller is not the owner → `ResourceNotFoundException` (404), indistinguishable from an unknown id; MANAGER caller → throws |
| `TimeEntryService.approve` | SUBMITTED → APPROVED | entry not SUBMITTED → throws; entry id not found → `ResourceNotFoundException`; caller is the entry's owner → `ForbiddenOperationException` (403) |
| `TimeEntryService.reject` | SUBMITTED → REJECTED + note saved | entry not SUBMITTED → throws; missing note → throws; caller is the entry's owner → `ForbiddenOperationException` (403) |
| `ProjectService.create` | Saves a project | duplicate name → throws (409) |
| `UserService.create` | Saves the user with a generated password, stored BCrypt-hashed | duplicate email → throws (409); the returned `generatedPassword` is **not** what is persisted (the stored value is a hash that `matches()` it); two consecutive creates produce different passwords |
| `UserService.changePassword` | Replaces the caller's hash when the current password matches | wrong current password → throws `InvalidCurrentPasswordException` (**400**, `fieldErrors.currentPassword` — the §8 status ruling); the new hash differs from the old one and `matches()` the new password |
| `AuthService.login` | Returns a JWT carrying the role | wrong password → `BadCredentialsException` (401); inactive user → login refused even with the right password |
| `ReportService.getHoursByProject` / `.getHoursByUser` | Groups hours per project / per user for the month | empty month → returns empty list, not null; only the statuses §8 declares reportable are summed |
| `ReportService.getSummary` | Returns the month's approved hours, pending hours and approved entry count | empty month → all zeros, no exception; `approvedHours` **equals the sum of `getHoursByProject`** for the same month (the §8 reconciliation rule, asserted); DRAFT and REJECTED entries change no field |

**The one §8 rule with no unit test, stated deliberately:** "a user deactivated *after* their token was
issued loses access on their next request" lives in `JwtFilter` /
`AccountStatusUserDetailsChecker`, not in a service, so no Mockito test can reach it. It is verified
manually in Postman (deactivate a user, reuse their still-valid token → `401`) and becomes a
`@WebMvcTest` from project 08. The §8 rule **"shared routes stay role-aware"** is likewise not a service
test: its enforcement is the `@PreAuthorize` on the MANAGER-only endpoints (already asserted through the
role rows above), and the role-aware *rendering* is a component concern, which project 07 does not test.
Every other §8 rule maps to a row in the table above.

**Backend — slice tests:** none in project 07. This is the first project with tests, so it introduces
only the unit level (JUnit 5 + Mockito). The slice types (`@WebMvcTest` for controllers, `@DataJpaTest`
for custom repository queries) are introduced from project 08 — do not add them here.

**Assertion quality:** every test asserts real behaviour — the returned value or the saved object's
state (status transition, hashed password, computed total) — never only `verify(...)` that a mock method
was called. No trivial "it exists" tests.

### Angular — services (Jasmine + TestBed, Step 9)

Use `HttpClientTestingModule` and `HttpTestingController` to assert the request without a real backend.
Same bar as the backend table: name the method, the request it must issue, and the edge cases — not
"it works". **What a service test may assert is bounded by §6's Service-boundary rule:** a
`core/services/` service issues the call and maps the response, so the assertions are about the
*request* and the *returned typed value*. Only `AuthService` also owns state, so it is the only service
whose test asserts a stored token or a signal.

| Service method | Happy path | Edge cases to cover |
|---|---|---|
| `AuthService.login` | POSTs `{email, password}` to `/api/auth/login`; on 200 stores the token in `localStorage` and sets the `currentUser` signal with the role from the response | wrong password → 401 leaves the token unstored and `currentUser` null (a failed login must not half-authenticate); the request body carries the password only in the POST body, never as a query param |
| `AuthService.logout` | Clears the token and resets `currentUser` to null | called with no session stored → does not throw |
| `EntryService.getEntries` | GETs `/api/entries` and returns the typed `TimeEntry[]` | `month`, `status` and `projectId` appear as query params **only when supplied** — an unset filter sends no empty param; a `[]` response returns an empty array, not null |
| `EntryService.approve` | PATCHes `/api/entries/{id}/approve` with no body and returns the updated `TimeEntry` | the id is interpolated into the path, not sent as a param; **the service stores nothing** — the returned value is the only channel (§6 Service boundary), so the caller page is what refetches |
| `EntryService.create` | POSTs the entry and returns the created `TimeEntry` | a 400 surfaces the `fieldErrors` map from the §10 error contract to the caller, un-swallowed, so the reactive form can bind a message per input |
| `UserService.changePassword` | PATCHes `/api/users/me/password` with `{currentPassword, newPassword}` and completes on `204` with no body to map | a `400` surfaces the `fieldErrors` map (`currentPassword` / `newPassword`) to the dialog un-swallowed; the current password travels in the body only, never in the URL; the service stores nothing and does **not** clear the session on that `400` |
| `ReportService.getSummary` | GETs `/api/reports/summary?month=` and returns the typed summary | a 403 (EMPLOYEE calling a MANAGER endpoint) surfaces an error the caller can handle rather than resolving to a partial object |

### Angular — components

Out of scope for this project. Per CLAUDE.md "Testing rules", component (TestBed) tests are introduced in **project 08**. Project 07 tests services only.

For each new testing concept (JUnit 5 + Mockito, `HttpClientTestingModule`), add one interview
question to `notes/interview-prep/junior/en/` and `notes/interview-prep/junior/es/` (same question,
both files).

---

## 17. Key rule

A half-finished project with good architecture decisions and real tests
is better than a perfect project delivered in September. Ship early, apply in parallel.

---

## 18. README structure

This project uses three READMEs. See `CLAUDE.md → README format for full-stack projects` for the full rules.

| File | Audience | When to write |
|---|---|---|
| `README.md` | Recruiter | Update after each step |
| `backend/README.md` | Technical interviewer | Write when backend is complete |
| `frontend/README.md` | Technical interviewer | Write when frontend is complete |

---

### backend/README.md — planned sections

Write when the backend is complete (after Step 6).

**1. API endpoints table**
| Method | URL | Role | Description |
One row per endpoint — all routes visible at a glance.

**2. Database schema**
Entities, fields, relationships. One sentence per key decision (why ENUM for status, why soft delete, why no cascade delete).

**3. Auth flow — numbered steps**
1. Client sends `POST /api/auth/login` with email and password
2. Service loads user from DB, verifies password with BCrypt
3. Server generates JWT signed with the secret from environment variable
4. Client sends JWT in `Authorization: Bearer <token>` header on every request
5. `JwtFilter` intercepts, validates token, extracts user, sets `SecurityContext`
6. Spring Security allows or denies based on `SecurityFilterChain` rules

**4. Security considerations**
- Passwords hashed with BCrypt — never stored in plain text
- New accounts get a `SecureRandom`-generated password returned once at creation; no shared or committed default credential exists
- Password change is self-service only (`/api/users/me/password`) — not even a MANAGER can set another user's password
- JWT secret loaded from environment variable — never committed to git; the first manager account is seeded at runtime behind a `dev` profile, not from a hash in `data.sql`
- Role-based endpoint protection with `@PreAuthorize`
- Input validation at controller boundary with `@Valid` + `@ControllerAdvice`

**Known limitations to state explicitly** (a documented trade-off reads as judgement; a silent gap reads as an oversight)
- **No forced password change on first login** — `mustChangePassword` was cut from the MVP because forcing it requires the frontend to intercept every route until the change happens. A user may keep their generated password indefinitely
- **No password reset** — a user who forgets theirs cannot self-recover; the manager deactivates and recreates the account. A real reset needs an email channel, which is out of scope
- **No refresh tokens** — a 60-minute access token expires mid-session and the user logs in again

**5. Key patterns**
- Layered architecture — controller never calls repository
- DTO boundary — entity never leaves the service layer
- Soft delete — `active = false` instead of DELETE
- `GlobalExceptionHandler` — consistent JSON error responses

**6. Tradeoffs**
- JWT over session-based auth — stateless API scales without server memory
- Soft delete over hard delete — `TimeEntry.user`/`project` are not-null FKs with no cascade, so a real DELETE fails; timesheet history is audit data that must survive a person leaving
- RuntimeException over checked exceptions — Spring Boot convention, caught globally with @ControllerAdvice

**7. How to run alone**
IntelliJ + local PostgreSQL, without Docker.

---

### frontend/README.md — planned sections

Write when the frontend is complete (after Step 7d).

**1. Folder structure** — one-line explanation per folder, why it exists.

**2. State management approach**
- Signals for page state — the page component under `pages/` owns every signal for its route (§6)
- **No cross-page cache.** Two pages reading the same endpoint each fetch it on their own load; a
  `core/services/` service issues the call and maps the response, and holds no state (§6, §13's table)
- `AuthService` is the single app-wide exception — token + current user, persisted with `effect()`,
  because auth outlives every route
- Coordinator pattern — page owns all state, child components receive and emit

**3. Key patterns**
- `authGuard` + `managerGuard` — route protection per role
- HTTP interceptor — JWT attached automatically to every request
- Role-aware UI — same route, different content per role
- `forkJoin` on dashboard — parallel API calls for stat cards

**4. Shared components**
- `status-badge` — coloured badge used in entries, approvals and dashboard
- `confirm-dialog` — reusable confirmation before any destructive action
- `reject-dialog` — rejection note input, used in approvals
- `change-password-dialog` — self-service password change, opened from the shell user menu (not routed)

**5. Tradeoffs**
- Signals over NgRx — app complexity did not justify a state management library
- Angular Material over custom CSS — enterprise UI library standard in Spanish consultancies

**6. How to run alone** — `ng serve`

---

## 19. Architecture decisions to document in the global README

Format: `[what you did] to [why it matters]` — one line each, 6-8 maximum.

- Stateless JWT auth to keep the API independent of server state
- DTO boundary between persistence and HTTP layer to control what the API exposes
- PATCH for state transitions (submit, approve, reject) to signal that only status changes
- SecurityContextHolder for current user to prevent privilege escalation from client-supplied userId
- Soft delete for users and projects to preserve historical timesheet data
- Workflow states (DRAFT → SUBMITTED → APPROVED / REJECTED) to support the resubmit flow and audit trail
- Manager-only account creation to prevent self-assignment of the Manager role
- Profile-gated runtime seeding of the first manager account to avoid both a setup endpoint that must be removed after first use and a credential hash committed to git

---

## 20. Tradeoffs to document in the global README

Format: `[option chosen] over [option rejected] — [reason]`

- JWT over session-based auth — stateless API requires no server memory per user
- Soft delete over hard delete — `TimeEntry.user`/`project` are not-null FKs with no cascade, so a real DELETE either fails or forces deleting the entries with it; timesheet history is legal-audit data that must survive a person leaving
- docker-compose over separate manual setup — one command runs the full project locally
- `Pageable` pagination on GET /api/entries, return-all everywhere else — entries is the only collection here that grows without a bound, so it is the only one paged; the month filter narrows a result but does not cap it. Reversed the original return-all choice on 2026-08-01, while Step 7a was still unbuilt and the change cost a method signature rather than a rewritten table
- Signals in the page component over a state-management library (NgRx) — eight pages, each reading its own endpoint and sharing nothing but the logged-in user; a store would add actions, reducers and effects for state that never leaves one route. NgRx becomes worth it when two distant pages must stay in sync live
- Local `docker-compose` over a deployed public URL — the portfolio value of this project is the backend it is the first of (layering, JWT, workflow), which a recruiter reads in the code and the READMEs; a free-tier API + database host that cold-starts and expires would add hosting work without adding a new concept. Deployment is a project 08 objective, where the app is the demo
- `ddl-auto=update` over Flyway migrations — single developer, schema still evolving with the plan; versioned migrations become necessary the moment a second environment or teammate exists

---

## 21. Future improvements to document in the global README

Domain-realistic only — max 3 bullets.

- Export approval reports to PDF or Excel
- Email notifications when entries are approved or rejected
- Bulk approval workflow for managers handling large teams

---

## 22. Git branch strategy

Written retroactively on 2026-07-06, after Step 4 closed — `feat/spring-foundation` had grown
to cover the entire backend foundation without a plan for where it would end. From here on,
one branch per coherent feature, never one per step.

| Branch | Covers (steps) | Opens | Closes |
|---|---|---|---|
| `feat/spring-foundation` | Steps 1–4 — Spring Boot setup, Project CRUD, JWT auth, role-based authorization | Step 1, right after `projects/07-timetrack` was created from `main` | Now — Step 4's done condition passed. PR into `projects/07-timetrack`. |
| `feat/timeentry-workflow` | Step 5 — TimeEntry CRUD + workflow | After `feat/spring-foundation` merges | When Step 5's done condition passes |
| `feat/reports` | Step 6 — Reports | After `feat/timeentry-workflow` merges | When Step 6's done condition passes |
| `feat/angular-shell-auth` | Step 7a — Shell + auth | After `feat/reports` merges | When Step 7a's done condition passes |
| `feat/angular-entries` | Step 7b — Employee flow: dashboard + entries | After `feat/angular-shell-auth` merges | When Step 7b's done condition passes |
| `feat/angular-manager-pages` | Steps 7c–7d — Manager review flow + manager admin pages | After `feat/angular-entries` merges | When Step 7d's done condition passes — the last frontend branch, triggers G4 |
| `feat/backend-tests` | Step 8 — Backend tests | After `feat/angular-manager-pages` merges | When Step 8's done condition passes |
| `feat/angular-tests` | Step 9 — Angular tests | After `feat/backend-tests` merges | When Step 9's done condition passes |
| — (no dedicated branch) | Step 10 — SQL complement | — | Commits go on whatever branch is active at the time, per CLAUDE.md's rule (2026-07-14) that study materials follow the active branch — `main` only receives merges via PR |
| `feat/docker` | Step 11 — Docker | After `feat/angular-tests` merges | When Step 11's done condition passes — the last feature branch before the project branch closes |

**Backlog-fix branches (outside the feature sequence).** The table above plans the `feat/…` branches
that build the §15 steps. Work that comes back from a **review gate** — the High/Medium tasks
`review-audit` writes to `PROJECT-BACKLOG.md` — is not a §15 step and never reopens a completed one, so
it gets a `fix/…` branch instead (CLAUDE.md branch naming) and is deliberately not a row in the step
coverage table.

| Branch | Covers | Opens | Closes |
|---|---|---|---|
| `fix/backend-backlog` | The **High** backend tasks from G3's `review-audit` run, plus the deferred `PATCH /api/entries/{id}/reopen` endpoint (see Step 5's "Deferred out of this step" line) **and the account-password-flow Medium**, which Step 7a depends on — no §15 step | After G3's `review-audit` wrote `PROJECT-BACKLOG.md` | When every High backend task in `PROJECT-BACKLOG.md` is `[x]`, `reopen` passes its Postman check (`PATCH /api/entries/{id}/reopen` on a REJECTED own entry returns 200 with status DRAFT) — this is what signs G3 off — **and `PATCH /api/users/me/password` returns 204 for a correct current password and 400 with `fieldErrors.currentPassword` for a wrong one**, so Step 7a has an endpoint to build against. PR into `projects/07-timetrack`. |

The project branch, `projects/07-timetrack`, was created once from `main` at Step 1 and stays
open for the whole project. It only merges into `main` when Step 11 is done.

**Immediate action (2026-07-29):** `feat/reports` has merged, so the backend feature branches are all
closed. `fix/backend-backlog` is the live branch and **G3's condition is already met** — every High backend
task is `[x]` and `reopen` passed its Postman check on 2026-07-22.

**One Medium is finished on this branch before it PRs: the account-password flow.** It is not a G3
requirement — it is a **Step 7a requirement**, because 7a's shell ships the `change-password-dialog` that
calls `PATCH /api/users/me/password`, an endpoint that does not exist yet. Building the consumer before
the endpoint would leave the step unable to pass its own done condition. So: finish that Medium here → PR
`fix/backend-backlog` into `projects/07-timetrack` (which also signs G3 off) → create
`feat/angular-shell-auth` for Step 7a.

The **remaining** Medium and Low tasks stay open and do not block the frontend. **G3 requires only the
Highs**, while **G7 (`portfolio-audit`) blocks its ✅ Ready verdict on any open High *or* Medium** — so they
must close before the project is declared finished, just not before Angular starts. The distinction that
matters: the password Medium is sequenced by a *dependency*, the others only by the closing gate.

---

## 23. Quality gates — which prompt to run when

Each gate ties a concrete point in the build (a §22 branch closing, a learning-plan phase finishing) to
the one prompt that runs there, so a quality check happens at the moment the file it reads has just
become accurate — not remembered at the very end. The project is not closed until every gate has run
(see the closure checklist below).

| Gate | Trigger | Prompt + config | Why exactly here |
|------|---------|-----------------|------------------|
| **G1 — Step ritual** | Every learning-plan step's done condition passes | *(no prompt — the `step-complete` skill fires in-session)* | Keeps PLANNING ✅ / PROGRESS.md / README true as you go, so the later gates read accurate files. |
| **G2 — Plan drift** | Only if the learning plan / branch strategy change mid-build (scope cut, steps reordered) | `plan-audit` · `MODE = review` · `PROJECT = projects/07-timetrack` | Every later gate checks the code against PLANNING.md. A stale plan silently invalidates all of them. Skip if the plan never moved. |
| **G3 — Backend review** | `feat/reports` merges — backend complete (Steps 1–6), **before Step 7 (Angular frontend) starts**. Signed off only when every **High** backend task in `PROJECT-BACKLOG.md` — including the deferred `PATCH /api/entries/{id}/reopen` endpoint — is fixed on `fix/backend-backlog` and merged | `review-audit` · `PROJECT_PATH = projects/07-timetrack` · `REVIEW_SCOPE = backend` | Correctness + security on the API **before** the frontend is built against it. Fix the High tasks it writes to `PROJECT-BACKLOG.md` before moving on. |
| **G4 — Frontend review** | `feat/angular-manager-pages` merges — Steps 7a–7d complete | `review-audit` · `PROJECT_PATH = projects/07-timetrack` · `REVIEW_SCOPE = frontend` | The backend is **not** re-reviewed (its tier is already dated in the backlog), so this costs a fraction of a `full` run. |
| **G5 — READMEs** | Every **High** task from G3/G4 is fixed and committed | `readme-audit` · `PROJECT_PATH = projects/07-timetrack` | Hard prerequisite of G7: `portfolio-audit` reads the READMEs, so running it first would judge a document that is about to change. |
| **G6 — PROGRESS accurate** | After G5, before the portfolio gate | `progress-update-prompt` · `MODE = active` | G7 and `cv-prompt` both read `PROGRESS.md`. If it is stale, the portfolio verdict and the CV bullet are built on a wrong picture of what you learned. |
| **G7 — Portfolio go/no-go** | After G5 **and** G6 | `portfolio-audit` · `PROJECT_PATH = projects/07-timetrack` | The closing gate. Reads `PROJECT-BACKLOG.md` — an unfixed High/Medium from G3/G4 blocks the ✅ Ready verdict. Produces the CV bullet + the project question bank. |
| **G8 — Roadmap resync** | After G7 returns ✅ Ready | `roadmap-review-prompt` | The project sequence just changed. This is what keeps `ROADMAP.md` from drifting into a stale plan. |

**Prerequisite chain (hard — a gate run out of order gives a wrong answer, not just a late one):**
`G3/G4 → fix the Highs → G5 → G6 → G7 → G8`. G5 before G7 because the portfolio gate reads the READMEs;
G6 before G7 because it reads PROGRESS; G3/G4 before G7 because it reads the backlog.

### Closure checklist — the project's definition of done

The project is never declared finished early — it is closed only when every box is ticked.

```
- [ ] Every §15 step's done condition passes, each with its step-complete ritual (G1)
- [ ] PLANNING.md still matches what was built — re-run plan-audit MODE=review if §15/§22 moved (G2)
- [ ] review-audit REVIEW_SCOPE=backend has run, and every High task it found is fixed (G3)
- [ ] review-audit REVIEW_SCOPE=frontend has run, and every High task it found is fixed (G4)
- [ ] readme-audit has run — global + backend + frontend READMEs at standard (G5)
- [ ] progress-update MODE=active has run — PROGRESS.md reflects this project (G6)
- [ ] portfolio-audit returns ✅ Ready — no open High/Medium in PROJECT-BACKLOG.md (G7)
- [ ] roadmap-review has run — ROADMAP.md reflects the new project sequence (G8)
- [ ] The project branch has been merged into `main` via PR
```

**The project is closed only when every box is ticked.** A ❌ or ⚠️ verdict at G7 means going back and
fixing, not shipping — that is the whole point of having a gate there.
