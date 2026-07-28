# Project 07 — TimeTrack

A timesheet app where employees log hours worked on projects.
Managers review the entries and approve or reject them.

---

## 0. Session quick reference

Update this table at the start of every session. It is the authoritative pointer to the live step.

| | |
|---|---|
| **Current step** | G3 backend backlog fix (not a §15 step). **Every High task is closed and `reopen` is built — G3's sign-off condition is met.** Work continuing on the branch is Medium/Low backlog, which G3 does not require (G7 does). **Step 7a — Angular shell + auth is the next learning step** |
| **Current branch** | `fix/backend-backlog` (§22 "Backlog-fix branches" — `feat/angular-shell-auth` is not opened yet; it is created from `projects/07-timetrack` when this branch merges) |
| **Done condition** | ✅ met — `Postman: PATCH /api/entries/{id}/reopen on a REJECTED own entry returns 200 — status DRAFT` (verified 2026-07-22), and every High backend task in `PROJECT-BACKLOG.md` is `[x]`. Step 7a's own done condition takes over next: `Browser: login at localhost:4200 redirects to /dashboard inside the shell; /projects as EMPLOYEE redirects away; a request with an expired token returns the user to /login` |
| **Next gate** | G3 sign-off — **unblocked**: the backend review has run and all its High tasks are fixed. Signing off = PR `fix/backend-backlog` into `projects/07-timetrack`. G4 (frontend review) follows when `feat/angular-manager-pages` merges |
| **Phase** | Backend backlog / G3 sign-off — Frontend (Phase 5) starts at Step 7a |
| **Last updated** | 2026-07-28 |

---

## 2. Why this project

- The workflow pattern (DRAFT → SUBMITTED → APPROVED / REJECTED) appears in almost every enterprise app
- Role-based authorization in Spring Security is a skill used in every Spring Boot project
- Spanish consultancies use timesheet tools every day — this domain is immediately relatable to interviewers
- It is rare in junior portfolios — most people build finance trackers or todo apps

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
| JUnit 5 + Mockito unit tests | Spring Boot | First backend tests |
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

---

## 5. Tech stack

| Layer | Technology | Notes |
|---|---|---|
| Backend | Java + Spring Boot | First Spring Boot project; layered architecture |
| Auth | Spring Security + JWT | Stateless; secret from `${JWT_SECRET}` env var |
| Database | PostgreSQL | Local instance via pgAdmin; same DB used in Docker |
| ORM | Spring Data JPA + Hibernate | `JpaRepository` + derived queries; JPQL for reports |
| Frontend | Angular + Angular Material | Indigo theme; Core/Feature/Shared structure |
| Local setup | Docker + docker-compose | App + Postgres in one command (Step 9) |
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

**Rules:**
- Controller only handles HTTP — reads the request, calls the service, returns the response. No logic.
- Service contains all business rules — validation, state transitions, role checks.
- Repository only reads and writes data. No logic.
- Controllers never call the repository directly.
- Entities are never returned directly from the API — always map to a DTO first.

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
- Cannot submit entries for an inactive project
- Inactive users cannot log in — their entries remain in the database unchanged
- A user deactivated *after* their token was issued loses access on their next request, not when the token expires — `JwtFilter` runs the loaded `UserDetails` through an `AccountStatusUserDetailsChecker`, so the login-time `active` check cannot be bypassed by an already-issued token

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
> `/me` by definition, so nothing about authorization is being refused. Against the exception taxonomy in
> §12 the check is a `BusinessRuleViolationException` — an input-data rule broken, exactly like a future
> date or an out-of-range hours value — which the handler already maps to `400`. `401` is worse than
> wrong: the Angular interceptor treats every `401` as an expired session and redirects to `/login`, so a
> single typo in the current-password field would log the user out mid-change. `400` also lets the response
> reuse the `fieldErrors` contract (§10), putting the message under the offending input instead of on a
> generic error banner.
>
> **Re-opening a rejected entry must be reachable from the UI.** The owner (EMPLOYEE) sees a **Re-open**
> action on every one of their `REJECTED` rows in the Entries page — it calls
> `PATCH /api/entries/{id}/reopen`, returns the entry to `DRAFT`, and the row's edit / delete / submit
> icons then appear under the existing DRAFT-only rule. Without this affordance `REJECTED` would be a
> terminal state in practice while the diagram, the business rule and the endpoint all say it is not, and
> the resubmit loop that justifies the whole state machine would be dead code.
>
> **Deliberately out of scope:** `mustChangePassword` — *forcing* the change at first login needs the
> frontend to intercept every route until it happens, which is Step 7a work for little MVP value. Record it
> in `backend/README.md` as a known limitation, not as an oversight.

**Reporting rules** *(decided 2026-07-28)*
- **Every hours figure in a report counts `APPROVED` entries only.** All three endpoints — `summary`, `by-project`, `by-employee` — apply the identical filter, so the summary card always equals the sum of the table beneath it
- `pendingHours` (SUBMITTED) is the one exception and stays a **separate, explicitly-named field**. It is a workload signal for the manager — "this much is waiting for you" — and is never folded into a total
- `totalEntries` counts `APPROVED` entries, for the same reason
- DRAFT and REJECTED never appear in any report

> **Why.** The whole DRAFT → SUBMITTED → APPROVED state machine exists so the manager's numbers can be
> trusted — these are the hours a company bills and pays against. Mixing unapproved hours into a total
> silently defeats it. This rule was never written in §8, and the code diverged as a direct result:
> `getHoursByProject`/`getHoursByEmployee` filtered to APPROVED (the deliberate 2026-07-22 fix) while
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

### Error contract — what every non-2xx response looks like

All errors return the same `ErrorResponse` body from `GlobalExceptionHandler`:
```json
{ "timestamp": "...", "status": 400, "error": "Bad Request", "message": "Validation failed" }
```
Validation errors (400 from `@Valid`, via `MethodArgumentNotValidException`) additionally carry a
field-level map the reactive forms consume to show a message under each input (Step 7b):
```json
{ "status": 400, "message": "Validation failed", "fieldErrors": { "hours": "must be at most 24" } }
```

### Auth — request/response detail

| Method · Path | Role | Description | Request body | Response |
|---|---|---|---|---|
| `POST /api/auth/login` | public | Authenticate and issue a JWT | `LoginRequest` — `email`, `password` | `200` + `AuthResponse` — `token`, `name`, `role` · `401` on bad credentials or inactive user |

### Users (`UserController` — MANAGER only)

| Method · Path | Role | Description | Request body | Response |
|---|---|---|---|---|
| `GET /api/users` | MANAGER | List all users (employees and managers) | — | `200` + `List<UserResponse>` |
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

### Projects (`ProjectController`)

| Method · Path | Role | Description | Request body | Response |
|---|---|---|---|---|
| `GET /api/projects` | both | Employee: active projects only · Manager: all projects | — | `200` + `List<ProjectResponse>` |
| `POST /api/projects` | MANAGER | Create a project | `CreateProjectRequest` — `name`, `description` | `201` + `ProjectResponse` · `400` validation · `409` duplicate name |
| `PUT /api/projects/{id}` | MANAGER | Update name, description, or reactivate/deactivate | `UpdateProjectRequest` — `name`, `description`, `active` (optional — applied only when non-null) | `200` + `ProjectResponse` · `404` project not found |
| `DELETE /api/projects/{id}` | MANAGER | Deactivate project (soft delete — sets `active = false`) | — | `204` no body · `404` project not found |

### Time entries (`TimeEntryController`)

| Method · Path | Role | Description | Request body | Response |
|---|---|---|---|---|
| `GET /api/entries` | both | Employee: own entries only (ownership from the JWT) · Manager: all entries | — (see query filters below) | `200` + `List<TimeEntryResponse>` |
| `POST /api/entries` | EMPLOYEE | Create an entry in `DRAFT` for the authenticated user | `CreateTimeEntryRequest` — `projectId`, `date`, `hours`, `description` | `201` + `TimeEntryResponse` · `400` validation (future date, hours outside 0.5–24) · `409` inactive project |
| `PUT /api/entries/{id}` | EMPLOYEE | Edit own `DRAFT` entry | `CreateTimeEntryRequest` | `200` + `TimeEntryResponse` · `403` not the owner · `404` entry not found · `409` entry not in `DRAFT` |
| `DELETE /api/entries/{id}` | EMPLOYEE | Delete own `DRAFT` entry (hard delete — a draft has no history value) | — | `204` no body · `403` not the owner · `404` entry not found · `409` entry not in `DRAFT` |
| `PATCH /api/entries/{id}/submit` | EMPLOYEE | Own entry `DRAFT → SUBMITTED` | — | `200` + `TimeEntryResponse` · `403` not the owner · `404` entry not found · `409` entry not in `DRAFT` |
| `PATCH /api/entries/{id}/reopen` | EMPLOYEE | Own entry `REJECTED → DRAFT` so it can be corrected and resubmitted | — | `200` + `TimeEntryResponse` · `403` not the owner · `404` entry not found · `409` entry not in `REJECTED` |
| `PATCH /api/entries/{id}/approve` | MANAGER | `SUBMITTED → APPROVED` | — | `200` + `TimeEntryResponse` · `403` caller is the entry's owner · `404` entry not found · `409` entry not in `SUBMITTED` |
| `PATCH /api/entries/{id}/reject` | MANAGER | `SUBMITTED → REJECTED` | `RejectRequest` — `rejectionNote` | `200` + `TimeEntryResponse` · `400` note missing · `403` caller is the entry's owner · `404` entry not found · `409` entry not in `SUBMITTED` |

**Query params on `GET /api/entries`** — all optional, combinable:

| Param | Type | Filters |
|---|---|---|
| `month` | String `YYYY-MM` | Entries whose `date` falls in that year and month |
| `projectId` | Long | Entries of one project |
| `status` | `EntryStatus` | Entries in one workflow state |
| `userId` | Long — **MANAGER only** | Entries of one employee (ignored for an EMPLOYEE caller, who is always scoped to their own) |

### Reports (`ReportController` — MANAGER only)

| Method · Path | Role | Description | Query params | Response |
|---|---|---|---|---|
| `GET /api/reports/summary` | MANAGER | Month totals: approved hours, pending hours, approved entry count | `month` — String `YYYY-MM`, required | `200` + `ReportSummaryResponse` — `approvedHours`, `pendingHours`, `totalEntries` · `400` month missing or malformed |
| `GET /api/reports/by-project` | MANAGER | Hours grouped by project | `month` — required | `200` + `List<ProjectHoursReportResponse>` — `projectId`, `projectName`, `totalHours` |
| `GET /api/reports/by-employee` | MANAGER | Hours grouped by employee | `month` — required | `200` + `List<EmployeeHoursReportResponse>` — `userId`, `userName`, `totalHours` |

> **All three count `APPROVED` entries only** — the §8 reporting rule. `pendingHours` is the single
> deliberate exception and is never folded into a total, which is why `totalHours` was removed from
> `ReportSummaryResponse`: it was the field that let the summary disagree with the tables.
>
> **Field naming (decided 2026-07-28):** the by-employee projection getter is renamed
> `getEmployeeName()` → `getUserName()`, with its JPQL `AS` alias renamed to match. The tiebreaker was
> objective rather than stylistic: the same DTO already exposes **`userId`**, so `employeeName` made the
> projection inconsistent with itself, and `projectId`/`projectName` sets the sibling precedent.
>
> Both aggregates group by **id and name** (not name alone), so two employees with the same display name
> stay separate rows and a rename does not split history; the id is also the frontend's row key.

> **Collection endpoints return the full list (no `Pageable`) by design** — see the §20 tradeoff line;
> the month filter bounds every report and the entries list in practice.

---

## 11. Postman setup

Test every endpoint in Postman as soon as it is created. Do not wait until the whole layer is finished.

**Setup — one collection for the project:**
- Create a collection called `07 - TimeTrack` (project convention: `## - ProjectName`)
- Create folders inside it, one per controller: `Auth`, `Users`, `Projects`, `Entries`, `Reports`
- Add each endpoint to its folder as you build it

**For each endpoint, check:**
- Correct HTTP status code (200, 201, 204, 400, 404...)
- Correct JSON response body
- Error cases (missing fields, wrong id, etc.)

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
│   ├── UserController.java          (/api/users — MANAGER only)
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
│       ├── EmployeeHoursReportResponse.java   (interface projection — hours grouped by employee)
│       └── ErrorResponse.java                 (uniform JSON error body from GlobalExceptionHandler)
├── exception/
│   ├── GlobalExceptionHandler.java        (@RestControllerAdvice — returns clean JSON errors)
│   ├── ResourceNotFoundException.java     (→ 404)
│   ├── BusinessRuleViolationException.java (input-data rule broken: hours range, future date, inactive project → 400)
│   ├── InvalidStateTransitionException.java (illegal workflow transition → 409)
│   └── UnauthorizedException.java         (ownership violation → 403 — name predates the status, see the backlog Low)
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
│       ├── user.service.ts       ← /api/users (Team page)
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

---

## 14. UI design

### App shell

Same pattern as project 06 — `MatSidenav` with a fixed toolbar and a scrollable content area.

```
┌─────────────────────────────────────────────────┐
│  toolbar: logo + app name + user name + logout  │
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
- Toolbar shows the logged-in user's name

---

### Colour palette

| Role | Colour | Usage |
|---|---|---|
| Primary | Indigo (`#3F51B5`) | Toolbar, buttons, active links |
| DRAFT | Grey | Status badge |
| SUBMITTED | Blue (`#1976D2`) | Status badge |
| APPROVED | Green (`#388E3C`) | Status badge |
| REJECTED | Red (`#D32F2F`) | Status badge |
| Surface | White / light grey | Cards, sidebar background |

---

### Material components used

| Component | Where |
|---|---|
| `MatSidenav` | App shell |
| `MatToolbar` | Top bar |
| `MatCard` | Stat cards on dashboard and reports |
| `MatTable` + `MatSort` + `MatPaginator` | Entries, Projects, Approvals |
| `MatDialog` | Entry form (add and edit), reject dialog, confirm dialog |
| `MatDatepicker` | Date field in entry form |
| `MatSelect` | Project selector in entry form, month filter |
| `MatChip` (or styled `<span>`) | Status badges |
| `MatSnackBar` | Feedback after every action |
| `MatBadge` | Pending count on Approvals sidebar link |
| `MatProgressSpinner` | Loading state on every async page |
| `MatTooltip` | Approve/reject buttons in the approvals table |
| `MatMenu` | User menu in toolbar (logout) |
| `MatFab` | "Log hours" floating action button on the entries page |

---

### View by view

#### Login

Split layout — two columns:
- Left: dark indigo background, app logo, tagline ("Track your time. Get recognised.")
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

#### Team page — Manager only

Stat cards + user table + "Add member" button.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 5            │  │ 4            │  │ 1            │
│ Total        │  │ Employees    │  │ Managers     │
└──────────────┘  └──────────────┘  └──────────────┘

                                      [+ Add member]
┌────────────────────────────────────────────────────┐
│ Name         │ Email              │ Role     │     │
│──────────────────────────────────────────────────│
│ Ana García   │ ana@company.com    │ Employee │ ✏ 🗑 │
│ Luis Martín  │ luis@company.com   │ Employee │ ✏ 🗑 │
│ Sara López   │ sara@company.com   │ Manager  │ ✏ 🗑 │
└────────────────────────────────────────────────────┘
```

The 🗑 icon deactivates the account (soft delete) — it does not delete data.
Empty state: "No team members yet. Add your first member."

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
- One call: `GET /api/entries?month=2025-05` (current month in YYYY-MM format, built on the frontend)
- "This week" — filter results by current week dates on the frontend, sum hours
- "This month" — sum all hours from the response
- "Pending review" — count entries with status SUBMITTED
- "Approved this month" — count entries with status APPROVED
- One API call feeds all four cards — no extra endpoint needed

Empty state (new user): illustration + "You have not logged any hours yet" + "Log your first entry" button.

---

#### Dashboard — Manager

Four stat cards + pending approvals list with quick actions.

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 5        │ │ 5        │ │ 240h     │ │ 3        │
│ Pending  │ │ Team     │ │ Total    │ │ Active   │
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
- "Total this mo." — `GET /api/reports/summary?month=2025-05`, read `approvedHours` (approved hours only, per §8 — label the card "Approved this month" so the number and its meaning agree)
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
│ Total hours  │  │ Employees    │  │ Projects     │
└──────────────┘  └──────────────┘  └──────────────┘

Hours by project                    Hours by employee
┌────────────────────────┐          ┌────────────────────────┐
│ Project A  │ 120h      │          │ Ana García  │ 80h      │
│ Project B  │  80h      │          │ Luis Martín │ 60h      │
│ Project C  │  40h      │          │ Sara López  │ 40h      │
└────────────────────────┘          └────────────────────────┘
```

**Where each card's number comes from** — only the first is served by `/api/reports/summary`:
- "Total hours" — `GET /api/reports/summary?month=`, read `approvedHours`
- "Employees" — the **length of the by-employee array**, not a summary field
- "Projects" — the **length of the by-project array**, not a summary field

All three report calls run in parallel with `forkJoin` on month change. Because every aggregate counts
`APPROVED` only (§8), the "Total hours" card equals the sum of either table exactly — that reconciliation
is the point of the rule, and it is worth asserting in a test.

`pendingHours` is **not** one of these three cards. Surface it separately — e.g. a "· 24h awaiting
approval" line under the card or a fourth card clearly labelled as pending — never added into the total.

---

### Inspiration

These are real timesheet or dashboard apps worth looking at for reference:

| App | URL | What to look at |
|---|---|---|
| Clockify | [clockify.me](https://clockify.me) | Dashboard layout, time entry table, status badges |
| Harvest | [getharvest.com](https://www.getharvest.com) | Reports page, project summary cards |
| Toggl Track | [toggl.com/track](https://toggl.com/track) | Entry list design, clean sidebar |
| Linear | [linear.app](https://linear.app) | Status badge design, sidebar navigation |
| Dribbble — timesheet | [dribbble.com/search/timesheet-dashboard](https://dribbble.com/search/timesheet-dashboard) | Visual inspiration, card layouts |

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
- Summary by project and by employee for a given month
- **New concepts:** JPQL aggregation queries, query filters with `@RequestParam`, interface projections for query results
- **Review concepts:** `@PreAuthorize` (reports are MANAGER only)
- **Done condition:** `Postman: GET /api/reports/by-project?month=2025-05 returns 200 — array of { projectName, totalHours }`
- **Concept learned:** interface projections (`ProjectHoursReportResponse`, `EmployeeHoursReportResponse`) let Spring Data build a proxy per result row directly from `SELECT ... AS alias` — no class, no manual mapping — as long as each getter's name matches an alias exactly (Java Bean convention: strip `get`, lowercase first letter). `YearMonth` is received in the controller but converted to a `LocalDate` start/end range in the service (business logic), not the controller. Repositories are organized by **entity** (`TimeEntryRepository` owns both report queries, since their `FROM` is `TimeEntry`), a different axis than controllers/services, which are organized by **feature** (`ReportController`/`ReportService`). Found and fixed two real bugs surfaced by the Postman test pass: `MissingServletRequestParameterException` and `MethodArgumentTypeMismatchException` aren't `RuntimeException`s / weren't specifically handled, so a missing or malformed `?month=` fell through to `500` — worse, the missing-param case revealed a genuine Spring Security gotcha where Spring's internal forward to `/error` gets rejected as unauthenticated (`401`) because `JwtFilter` skips error dispatches by default and `/error` was never excluded from `.anyRequest().authenticated()`.

### Step 7 — Angular frontend (split into 7a / 7b / 7c)

One step per coherent slice, days not weeks — same granularity the backend had. Each sub-step has its
own branch (§22) and its own done condition covering its **full** scope.

#### Step 7a — Shell + auth
- Angular project with Angular Material and the indigo theme; `environment.ts` with the API base URL
- Auth service + JWT in localStorage; auth guard + manager guard
- HTTP interceptor: attaches the token **and handles 401 mid-session** (clear session → redirect to `/login`) — see the token-lifetime note in the REST API section
- App shell: `MatSidenav` + toolbar, sidebar links filtered by role; Login page
- **New concepts:** Angular consuming a real REST API end to end
- **Review concepts:** route guards, HTTP interceptor, auth persistence, `MatSidenav` shell
- **Done condition:** `Browser: login at localhost:4200 redirects to /dashboard inside the shell; /projects as EMPLOYEE redirects away; a request with an expired token returns the user to /login`

#### Step 7b — Employee flow: dashboard + entries
- Employee dashboard (stat cards from one `GET /api/entries?month=` call) + recent entries
- Entries page: filter bar, table, FAB; entry-dialog (create/edit); inline submit quick action
- **Re-open action on REJECTED rows** (owner only, §8/§14): calls `PATCH /api/entries/{id}/reopen`, the row returns to DRAFT and the edit / delete / submit icons take over; the row also surfaces the manager's `rejectionNote`
- Shared components: `status-badge`, `confirm-dialog`
- Reactive forms consume the `fieldErrors` map from the error contract — message under each input on 400
- **Review concepts:** coordinator pattern, reactive forms, MatTable/MatDialog, signals + `computed()`
- **Done condition:** `Browser: at /entries an employee creates, edits and submits an entry and the table + dashboard cards update; Re-open on a REJECTED row returns it to DRAFT with the edit/delete/submit icons visible; an invalid form submit shows the backend field error under the input`

#### Step 7c — Manager pages
- Manager dashboard (`forkJoin` stat cards) + pending approvals list
- Projects page (CRUD); Approvals page + shared `reject-dialog`; Team page + `user-dialog`; Reports page
- **Review concepts:** `forkJoin`, role-aware UI, MatTable, `MatBadge`
- **Done condition:** `Browser: as MANAGER, approve one entry and reject another (with note) at /approvals; create a project at /projects and a user at /team; /reports renders both hours tables for a selected month`

### Step 8 — Backend tests
- JUnit 5 + Mockito — one test per service method
- Cover edge cases, not just the happy path (see Section 16)
- **New concepts:** JUnit 5 + Mockito unit testing
- **Review concepts:** business rules and state machine (asserted through tests)
- **Done condition:** `Terminal: mvn test passes — TimeEntryServiceTest, UserServiceTest, ProjectServiceTest, AuthServiceTest and ReportServiceTest all green; approve_throwsWhenNotSubmitted and getSummary_approvedHoursEqualsByProjectSum asserted`

### Step 9 — Angular tests
- Jasmine + TestBed with `HttpClientTestingModule` — one test per service
- Verify the HTTP call, the URL, and the error path (see Section 16)
- Component tests are NOT in scope — per CLAUDE.md they start at project 08; this project tests services only
- **New concepts:** Angular service unit testing with `HttpClientTestingModule`
- **Review concepts:** auth and entry services
- **Done condition:** `Terminal: ng test passes — AuthService and EntryService specs both green; getEntries issues a GET to /api/entries and a 401 response surfaces an error asserted`

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
| `TimeEntryService.update` / `.delete` | Edits / removes an own DRAFT entry | entry not DRAFT → throws; caller is not the owner → throws; update re-runs create's rules (future date, hours range, inactive project) |
| `TimeEntryService.findByFilter` | EMPLOYEE gets only their own entries; MANAGER gets all | filters (`month`, `status`, `projectId`) narrow the result; an employee never receives another user's entry; a MANAGER-only `userId` supplied by an EMPLOYEE caller is overwritten with their own id |
| `TimeEntryService.submit` | DRAFT → SUBMITTED | entry not DRAFT → throws; caller is not the owner → throws |
| `TimeEntryService.reopen` | REJECTED → DRAFT for the owner | entry not REJECTED → throws; caller is not the owner → throws; MANAGER caller → throws |
| `TimeEntryService.approve` | SUBMITTED → APPROVED | entry not SUBMITTED → throws; entry id not found → `ResourceNotFoundException`; caller is the entry's owner → `UnauthorizedException` (403) |
| `TimeEntryService.reject` | SUBMITTED → REJECTED + note saved | entry not SUBMITTED → throws; missing note → throws; caller is the entry's owner → `UnauthorizedException` (403) |
| `ProjectService.create` | Saves a project | duplicate name → throws (409) |
| `UserService.create` | Saves the user with a generated password, stored BCrypt-hashed | duplicate email → throws (409); the returned `generatedPassword` is **not** what is persisted (the stored value is a hash that `matches()` it); two consecutive creates produce different passwords |
| `UserService.changePassword` | Replaces the caller's hash when the current password matches | wrong current password → throws `BusinessRuleViolationException` (**400**, `fieldErrors.currentPassword` — the §8 status ruling); the new hash differs from the old one and `matches()` the new password |
| `AuthService.login` | Returns a JWT carrying the role | wrong password → `BadCredentialsException` (401); inactive user → login refused even with the right password |
| `ReportService.getHoursByProject` / `.getHoursByEmployee` | Groups hours per project / per employee for the month | empty month → returns empty list, not null; only the statuses §8 declares reportable are summed |
| `ReportService.getSummary` | Returns the month's approved hours, pending hours and approved entry count | empty month → all zeros, no exception; `approvedHours` **equals the sum of `getHoursByProject`** for the same month (the §8 reconciliation rule, asserted); DRAFT and REJECTED entries change no field |

**The one §8 rule with no unit test, stated deliberately:** "a user deactivated *after* their token was
issued loses access on their next request" lives in `JwtFilter` /
`AccountStatusUserDetailsChecker`, not in a service, so no Mockito test can reach it. It is verified
manually in Postman (deactivate a user, reuse their still-valid token → `401`) and becomes a
`@WebMvcTest` from project 08. Every other §8 rule maps to a row in the table above.

**Backend — slice tests:** none in project 07. This is the first project with tests, so it introduces
only the unit level (JUnit 5 + Mockito). The slice types (`@WebMvcTest` for controllers, `@DataJpaTest`
for custom repository queries) are introduced from project 08 — do not add them here.

**Assertion quality:** every test asserts real behaviour — the returned value or the saved object's
state (status transition, hashed password, computed total) — never only `verify(...)` that a mock method
was called. No trivial "it exists" tests.

### Angular — services (Jasmine + TestBed, Step 9)

Use `HttpClientTestingModule` and `HttpTestingController` to assert the request without a real backend.

| Service | What the test verifies |
|---|---|
| `AuthService.login` | POSTs to `/api/auth/login`; on success stores the token and sets `currentUser` |
| `EntryService.getEntries` | GETs `/api/entries` with the right query params; returns the typed list |
| `EntryService.approve` | PATCHes `/api/entries/{id}/approve`; updates local state on success |
| error path | a 401/403 response surfaces an error the caller can handle |

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

Write when the frontend is complete (after Step 7c).

**1. Folder structure** — one-line explanation per folder, why it exists.

**2. State management approach**
- Signals for local component state
- Services for shared state across pages
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
- Return-all over `Pageable` pagination on GET /api/entries — a team's monthly entries are dozens of rows, not thousands; the month filter already bounds the result. Pagination is the first change if teams grow
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
| `feat/angular-manager-pages` | Step 7c — Manager pages | After `feat/angular-entries` merges | When Step 7c's done condition passes — the last frontend branch, triggers G4 |
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
| `fix/backend-backlog` | The **High** backend tasks from G3's `review-audit` run, plus the deferred `PATCH /api/entries/{id}/reopen` endpoint (see Step 5's "Deferred out of this step" line) — no §15 step | After G3's `review-audit` wrote `PROJECT-BACKLOG.md` | When every High backend task in `PROJECT-BACKLOG.md` is `[x]` and `reopen` passes its Postman check (`PATCH /api/entries/{id}/reopen` on a REJECTED own entry returns 200 with status DRAFT) — this is what signs G3 off. PR into `projects/07-timetrack`. |

The project branch, `projects/07-timetrack`, was created once from `main` at Step 1 and stays
open for the whole project. It only merges into `main` when Step 11 is done.

**Immediate action (2026-07-28):** `feat/reports` has merged, so the backend feature branches are all
closed. `fix/backend-backlog` is the live branch, and **its closing condition is already met** — every High
backend task is `[x]` and `reopen` passed its Postman check on 2026-07-22. It is ready to PR into
`projects/07-timetrack` to sign G3 off, after which `feat/angular-shell-auth` is created for Step 7a.

Medium and Low backlog tasks are still open and continue to be worked on this branch. That is a
deliberate choice, not a blocker: **G3 requires only the Highs**, while **G7 (`portfolio-audit`) blocks its
✅ Ready verdict on any open High *or* Medium**. So the Mediums have to be closed before the project can be
declared finished — but not before the frontend can start. Either sequence is valid; what matters is that
the branch is not held open under the impression that G3 is still blocked.

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
| **G4 — Frontend review** | `feat/angular-manager-pages` merges — Steps 7a–7c complete | `review-audit` · `PROJECT_PATH = projects/07-timetrack` · `REVIEW_SCOPE = frontend` | The backend is **not** re-reviewed (its tier is already dated in the backlog), so this costs a fraction of a `full` run. |
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
