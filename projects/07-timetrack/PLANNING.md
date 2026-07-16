# Project 07 — TimeTrack

A timesheet app where employees log hours worked on projects.
Managers review the entries and approve or reject them.

---

## 0. Session quick reference

Update this table at the start of every session. It is the authoritative pointer to the live step.

| | |
|---|---|
| **Current step** | Step 7a — Angular shell + auth |
| **Current branch** | `feat/angular-shell-auth` |
| **Done condition** | Browser: login at localhost:4200 redirects to /dashboard inside the shell; /projects as EMPLOYEE redirects away; a request with an expired token returns the user to /login |
| **Next gate** | G4 — frontend review (`review-audit`, `REVIEW_SCOPE = frontend`), when `feat/angular-manager-pages` (last frontend branch) merges |
| **Phase** | Frontend (Phase 5) |
| **Last updated** | 2026-07-16 |

---

## Why this project

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
| `@Entity` / JPA mapping to PostgreSQL | Spring Boot | First time mapping Java classes to tables |
| `JpaRepository` + derived query methods | Spring Boot | CRUD without SQL; `findByEmail` style finders |
| DTO request/response boundary | Spring Boot | Entities never leave the service layer |
| Spring Security + JWT stateless auth | Security | Standard auth in every Spring Boot job |
| `@PreAuthorize("hasRole(...)")` role checks | Security | Method-level authorization after the JWT filter |
| `@ManyToOne` / `@OneToMany` relationships | Spring Boot | TimeEntry → User and → Project foreign keys |
| State machine workflow (DRAFT→SUBMITTED→APPROVED/REJECTED) | Architecture | Most valuable pattern in a junior portfolio |
| PATCH for state transitions | Spring Boot | Signals that only `status` changes, not the whole resource |
| Query filters with `@RequestParam` | Spring Boot | `?month=`, `?status=`, `?projectId=` on GET /api/entries |
| `Specification<T>` + `JpaSpecificationExecutor` (Criteria API) | Spring Boot | Dynamic optional filters on GET /api/entries — the JPQL `IS NULL OR` pattern hit a real PostgreSQL bug (`42P18`, can't infer parameter type), Specifications build predicates only for filters actually present |
| JPQL aggregation queries | Spring Boot | Reports — hours grouped by project and by employee |
| `@RestControllerAdvice` GlobalExceptionHandler | Spring Boot | Consistent JSON error bodies |
| `data.sql` startup seeding | Spring Boot | First manager account with no register endpoint |
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

## Tech stack

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

## Architecture

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

## Entities

### User
| Field | Java type | SQL type | Constraints | Notes |
|---|---|---|---|---|
| id | Long | BIGINT | PK, auto-increment | Identity generated by the DB |
| name | String | VARCHAR | not null | Full name shown in the UI |
| email | String | VARCHAR | not null, unique | Used as the login username |
| password | String | VARCHAR | not null | BCrypt hash, never plain text |
| role | Role (enum) | VARCHAR | not null | `EMPLOYEE` or `MANAGER` — stored as string via `@Enumerated(STRING)` |
| active | Boolean | BOOLEAN | not null, default true | Soft delete — inactive users cannot log in |
| createdAt | LocalDateTime | TIMESTAMP | not null | Set by `@CreationTimestamp` |

### Project
| Field | Java type | SQL type | Constraints | Notes |
|---|---|---|---|---|
| id | Long | BIGINT | PK, auto-increment | Identity generated by the DB |
| name | String | VARCHAR | not null, unique | Project name shown in selectors |
| description | String | VARCHAR | nullable | Optional context |
| active | Boolean | BOOLEAN | not null, default true | Inactive projects cannot receive new entries |
| createdAt | LocalDateTime | TIMESTAMP | not null | Set by `@CreationTimestamp` |

### TimeEntry
| Field | Java type | SQL type | Constraints | Notes |
|---|---|---|---|---|
| id | Long | BIGINT | PK, auto-increment | Identity generated by the DB |
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
- **Fetch type:** `@ManyToOne` defaults to `EAGER`. Keep the default here — every TimeEntry response needs its user and project anyway, and the tables are small. (If lists grow, switch to `LAZY` + a fetch-join query; out of scope for the MVP.)
- **Cascade:** **none.** Deleting a user or project must never cascade-delete TimeEntries — that is exactly why both use soft delete (`active = false`). Historical timesheet data is preserved.

---

## Workflow

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

**Business rules:**
- Employee can only see their own entries
- Employee can only edit or delete their **own** DRAFT entries (ownership resolved from the JWT via `SecurityContextHolder`, never from a client-supplied `userId`)
- Employee can only submit their **own** DRAFT entries
- A REJECTED entry can be re-opened by its owner for editing — this returns it to DRAFT so it can be corrected and resubmitted (the resubmit loop in the diagram above)
- Manager can see all entries from all users
- Manager can only approve or reject SUBMITTED entries
- Cannot log entries for a future date
- Hours must be between 0.5 and 24
- Cannot submit entries for an inactive project
- Inactive users cannot log in — their entries remain in the database unchanged
- Default password for new accounts: `Timetrack2024!` — shown once in the UI after creation; employee must change it on first login (requires `mustChangePassword` field on User — skip for MVP, add as a note in the README)

**Initial data — first manager account**
There is no public register endpoint, so the first manager account must exist before anyone can log in.
Solution: `src/main/resources/data.sql` — Spring Boot runs this file on startup and inserts the seed user.
```sql
INSERT INTO users (name, email, password, role, active, created_at)
VALUES ('Admin', 'admin@timetrack.com', '$2a$10$...bcrypt_hash...', 'MANAGER', true, NOW())
ON CONFLICT DO NOTHING;
```
The BCrypt hash must be pre-generated for a known password (e.g. `Admin2024!`).

---

## Testing with Postman

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

## REST API

### Auth — public endpoints
```
POST /api/auth/login       → returns JWT
```

**Token lifetime:** 24h (`app.jwt.expiration=86400000` in `application.properties`). When a token
expires mid-session the API returns 401 — the Angular interceptor (Step 7a) catches it, clears the
stored session, and redirects to `/login`. Expiry is handled once in the interceptor, never per page.

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

### Users (Manager only)
```
GET    /api/users              → list all users (employees and managers)
POST   /api/users              → create a new user account
PUT    /api/users/{id}         → update name or role
DELETE /api/users/{id}         → deactivate account (soft delete — sets active = false)
```

### Projects
```
GET    /api/projects           → Employee: active projects only | Manager: all projects (active + inactive)
POST   /api/projects           → MANAGER only
PUT    /api/projects/{id}      → MANAGER only
DELETE /api/projects/{id}      → MANAGER only (soft delete — sets active = false)
```

### Time entries
```
GET    /api/entries                  → Employee: own entries | Manager: all entries
POST   /api/entries                  → Employee only (creates DRAFT)
PUT    /api/entries/{id}             → Employee only (edit DRAFT)
DELETE /api/entries/{id}             → Employee only (delete DRAFT)
PATCH  /api/entries/{id}/submit      → Employee: DRAFT → SUBMITTED
PATCH  /api/entries/{id}/approve     → Manager: SUBMITTED → APPROVED
PATCH  /api/entries/{id}/reject      → Manager: SUBMITTED → REJECTED (body: rejectionNote)
```

**Query filters on GET /api/entries:**
- `?month=2025-05` — filter by year and month
- `?projectId=3` — filter by project
- `?status=SUBMITTED` — filter by status
- `?userId=2` — Manager only — filter by employee

### Reports (Manager only)
```
GET /api/reports/summary?month=2025-05         → total hours, total entries, approved vs pending
GET /api/reports/by-project?month=2025-05      → hours grouped by project
GET /api/reports/by-employee?month=2025-05     → hours grouped by employee
```

---

## Spring Boot folder structure

```
src/main/resources/
├── application.properties     (DB connection, JPA config, JWT secret)
└── data.sql                   (first manager account seed — runs on startup)

src/main/java/com/victor/timetrack/
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── ProjectController.java
│   ├── TimeEntryController.java
│   └── ReportController.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── UserDetailsServiceImpl.java   (Spring Security — loads a user by email for authentication)
│   ├── ProjectService.java
│   ├── TimeEntryService.java
│   └── ReportService.java
├── repository/
│   ├── UserRepository.java
│   ├── ProjectRepository.java
│   └── TimeEntryRepository.java
├── model/
│   ├── User.java
│   ├── Project.java
│   ├── TimeEntry.java
│   ├── Role.java          (enum: EMPLOYEE, MANAGER)
│   └── EntryStatus.java   (enum: DRAFT, SUBMITTED, APPROVED, REJECTED)
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── CreateProjectRequest.java
│   │   ├── UpdateProjectRequest.java
│   │   ├── CreateTimeEntryRequest.java
│   │   ├── RejectRequest.java              (rejectionNote body for PATCH /reject)
│   │   ├── CreateUserRequest.java          (planned — Team page user management)
│   │   └── UpdateUserRequest.java          (planned — Team page user management)
│   └── response/
│       ├── AuthResponse.java
│       ├── UserResponse.java
│       ├── ProjectResponse.java
│       ├── TimeEntryResponse.java
│       ├── ProjectHoursReportResponse.java    (interface projection — hours grouped by project)
│       ├── EmployeeHoursReportResponse.java   (interface projection — hours grouped by employee)
│       └── ErrorResponse.java                 (uniform JSON error body from GlobalExceptionHandler)
├── exception/
│   ├── GlobalExceptionHandler.java   (@ControllerAdvice — returns clean JSON errors)
│   ├── ResourceNotFoundException.java
│   └── UnauthorizedException.java
└── security/
    ├── JwtUtil.java
    ├── JwtFilter.java
    └── SecurityConfig.java
```

---

## Angular folder structure

```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── manager.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   └── services/
│       ├── auth.service.ts
│       ├── entry.service.ts
│       ├── project.service.ts
│       ├── user.service.ts
│       └── report.service.ts
├── pages/
│   ├── login/
│   ├── dashboard/
│   ├── entries/
│   │   ├── entry-list/
│   │   └── entry-dialog/
│   ├── projects/
│   ├── approvals/
│   ├── team/
│   │   └── user-dialog/      ← add and edit user (name, email, role)
│   └── reports/
└── shared/
    ├── components/
    │   ├── confirm-dialog/
    │   ├── reject-dialog/     ← rejection note input, used in Approvals
    │   └── status-badge/      ← coloured badge, used in Entries, Approvals, Dashboard
    └── models/
        ├── user.model.ts
        ├── project.model.ts
        ├── time-entry.model.ts
        └── report.model.ts
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

## UI design

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

"Add member" opens a dialog: name + email + role selector (Employee / Manager).
After creation, a snackbar shows the default password (`Timetrack2024!`) so the manager can share it.
The 🗑 icon deactivates the account (soft delete) — it does not delete data.
Empty state: "No team members yet. Add your first member."

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
- "Total this mo." — `GET /api/reports/summary?month=2025-05`, read `totalHours`
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
│ May 12  │ Project A │ 6h    │ Tests        │ DRAFT    │ ✏ │
└──────────────────────────────────────────────────────────┘
```

- Status is a coloured badge rendered by the shared `status-badge` component
- Edit, delete, and submit icons only appear on DRAFT rows — and only for employees
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

## Progressive learning plan

This is the first Spring Boot project. Each step introduces one new concept.

### Step 1 — Spring Boot foundation
- Create project with Spring Initializr (dependencies: Spring Web, Spring Data JPA, PostgreSQL Driver, Lombok)
- Connect to PostgreSQL via `application.properties`; create the `timetrack` database in pgAdmin
- Create `User` entity, `UserRepository` (`JpaRepository`), `UserService.getAll()`, `UserController` with `GET /api/users`
- **New concepts:** layered architecture, `@Entity`/JPA basics
- **Review concepts:** none (first backend step)
- **Done condition:** `Terminal: mvn spring-boot:run — started on port 8080` and `Browser: GET localhost:8080/api/users returns [] at /api/users`

### Step 2 — Full CRUD for Projects
- Create `Project` entity, repository, service, controller
- GET all, GET by id, POST, PUT, DELETE (soft delete) with DTOs
- **New concepts:** DTO request/response boundary, REST conventions, soft delete
- **Review concepts:** layered architecture
- **Done condition:** `Postman: POST /api/projects returns 201 — body has id + name; GET /api/projects returns 200 with the created project`

### Step 3 — Spring Security + JWT
- Add Spring Security; configure CORS for `localhost:4200`
- Login endpoint `POST /api/auth/login`; BCrypt password hashing; generate + validate JWT
- Protect all routes except `/api/auth/login`; add `GlobalExceptionHandler` (`@RestControllerAdvice`)
- **New concepts:** Spring Security + JWT, CORS, `@RestControllerAdvice`
- **Review concepts:** DTO boundary (LoginRequest/AuthResponse)
- **Done condition:** `Postman: POST /api/auth/login returns 200 — body has token; GET /api/projects without token returns 401`

### Step 4 — Role-based authorization ✅
- Add `role` and `active` to `User` (EMPLOYEE / MANAGER)
- Create `data.sql` with the first manager account
- `@PreAuthorize("hasRole('MANAGER')")` on project and user write endpoints
- `SecurityContextHolder` to read the current user inside a service
- **New concepts:** `@PreAuthorize` role checks, `data.sql` seeding, `SecurityContextHolder`
- **Review concepts:** JWT flow (token now carries the role)
- **Done condition:** `Postman: POST /api/projects with EMPLOYEE token returns 403; with MANAGER token returns 201`

### Step 5 — TimeEntry CRUD + workflow ✅
- `TimeEntry` entity with `@ManyToOne` to User and Project
- `GET /api/entries` filters by current user (employee) or returns all (manager)
- Optional query filters on `GET /api/entries` (`?month=`, `?status=`, `?projectId=`) via `Specification<T>` + `JpaSpecificationExecutor`
- CRUD with business-rule validation (future date, inactive project, DRAFT-only edits)
- Status transitions: submit, approve, reject (PATCH)
- **New concepts:** `@ManyToOne` relationships, state machine workflow, PATCH for transitions, role-based data filtering, `Specification<T>` dynamic query filters
- **Review concepts:** soft delete, `SecurityContextHolder`
- **Done condition:** `Postman: POST /api/entries returns 201 — status DRAFT; PATCH /api/entries/{id}/approve as employee returns 403; as manager on a SUBMITTED entry returns 200 — status APPROVED`
- **Concept learned:** hard delete (`deleteById`) is correct here — `TimeEntry` has no `active` field like `Project`/`User`, and only DRAFT entries can be removed, so nothing worth preserving is lost. Bean Validation (`@NotBlank`/`@NotNull` + `@Valid`) was added across all request DTOs (`CreateProjectRequest`, `UpdateProjectRequest`, `CreateTimeEntryRequest`, `RejectRequest`) as part of this step, plus a `PUT /api/entries/{id}` (edit DRAFT) and `DELETE /api/entries/{id}` (delete DRAFT) endpoint — both reusing the owner + DRAFT-only guards, and PUT re-running create's business rules (future date, inactive project, hours range) since it replaces the whole resource.

### Step 6 — Reports ✅
- Aggregate queries with JPQL
- Summary by project and by employee for a given month
- **New concepts:** JPQL aggregation queries, query filters with `@RequestParam`
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
- Shared components: `status-badge`, `confirm-dialog`
- Reactive forms consume the `fieldErrors` map from the error contract — message under each input on 400
- **Review concepts:** coordinator pattern, reactive forms, MatTable/MatDialog, signals + `computed()`
- **Done condition:** `Browser: at /entries an employee creates, edits and submits an entry and the table + dashboard cards update; an invalid form submit shows the backend field error under the input`

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
- **Done condition:** `Terminal: mvn test passes — TimeEntryServiceTest, approve_throwsWhenNotSubmitted asserted`

### Step 9 — Angular tests
- Jasmine + TestBed with `HttpClientTestingModule` — one test per service
- Verify the HTTP call, the URL, and the error path (see Section 16)
- Component tests are NOT in scope — per CLAUDE.md they start at project 08; this project tests services only
- **New concepts:** Angular service unit testing with `HttpClientTestingModule`
- **Review concepts:** auth and entry services
- **Done condition:** `Terminal: ng test passes — EntryService spec, getEntries issues a GET to /api/entries asserted`

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

## Testing plan

### Backend — JUnit 5 + Mockito (Step 8)

Mock the repository; test the service in isolation. Cover the edge cases, not only the happy path.

| Service method | Happy path | Edge cases to cover |
|---|---|---|
| `TimeEntryService.create` | Saves a DRAFT entry | future date → throws; inactive project → throws; hours < 0.5 or > 24 → throws |
| `TimeEntryService.submit` | DRAFT → SUBMITTED | entry not DRAFT → throws; caller is not the owner → throws |
| `TimeEntryService.approve` | SUBMITTED → APPROVED | entry not SUBMITTED → throws; entry id not found → `ResourceNotFoundException` |
| `TimeEntryService.reject` | SUBMITTED → REJECTED + note saved | entry not SUBMITTED → throws; missing note → throws |
| `ProjectService.create` | Saves a project | duplicate name → throws (409) |
| `UserService.create` | Saves user, password BCrypt-hashed | duplicate email → throws (409) |
| `AuthService.login` | Returns a JWT | wrong password → `BadCredentialsException` (401) |
| `ReportService.summaryByProject` | Groups hours per project for the month | empty month → returns empty list, not null |

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

For each new testing concept (JUnit 5 + Mockito, `HttpClientTestingModule`), add one interview question to `notes/interview-prep/en/` and `notes/interview-prep/es/` (same question, both files).

---

## Key rule

A half-finished project with good architecture decisions and real tests
is better than a perfect project delivered in September. Ship early, apply in parallel.

---

## README structure

This project uses three READMEs. See `CLAUDE.md → README format for full-stack projects` for the full rules.

| File | Audience | When to write |
|---|---|---|
| `README.md` | Recruiter | Update after each step |
| `backend/README.md` | Technical interviewer | Write when backend is complete |
| `frontend/README.md` | Technical interviewer | Write when frontend is complete |

---

## backend/README.md — planned sections

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
- JWT secret loaded from environment variable — never committed to git
- Role-based endpoint protection with `@PreAuthorize`
- Input validation at controller boundary with `@Valid` + `@ControllerAdvice`

**5. Key patterns**
- Layered architecture — controller never calls repository
- DTO boundary — entity never leaves the service layer
- Soft delete — `active = false` instead of DELETE
- `GlobalExceptionHandler` — consistent JSON error responses

**6. Tradeoffs**
- JWT over session-based auth — stateless API scales without server memory
- Soft delete over hard delete — deleting a user would orphan all their TimeEntries
- RuntimeException over checked exceptions — Spring Boot convention, caught globally with @ControllerAdvice

**7. How to run alone**
IntelliJ + local PostgreSQL, without Docker.

---

## frontend/README.md — planned sections

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

## Architecture decisions to document in the global README

Format: `[what you did] to [why it matters]` — one line each, 6-8 maximum.

- Stateless JWT auth to keep the API independent of server state
- DTO boundary between persistence and HTTP layer to control what the API exposes
- PATCH for state transitions (submit, approve, reject) to signal that only status changes
- SecurityContextHolder for current user to prevent privilege escalation from client-supplied userId
- Soft delete for users and projects to preserve historical timesheet data
- Workflow states (DRAFT → SUBMITTED → APPROVED / REJECTED) to support the resubmit flow and audit trail
- Manager-only account creation to prevent self-assignment of the Manager role
- data.sql seed for the first manager account to avoid a setup endpoint that must be removed after first use

---

## Tradeoffs to document in the global README

Format: `[option chosen] over [option rejected] — [reason]`

- JWT over session-based auth — stateless API requires no server memory per user
- Soft delete over hard delete — deleting a user would orphan all their TimeEntries
- docker-compose over separate manual setup — one command runs the full project locally
- Return-all over `Pageable` pagination on GET /api/entries — a team's monthly entries are dozens of rows, not thousands; the month filter already bounds the result. Pagination is the first change if teams grow
- `ddl-auto=update` over Flyway migrations — single developer, schema still evolving with the plan; versioned migrations become necessary the moment a second environment or teammate exists

---

## Future improvements to document in the global README

Domain-realistic only — max 3 bullets.

- Export approval reports to PDF or Excel
- Email notifications when entries are approved or rejected
- Bulk approval workflow for managers handling large teams

---

## Git branch strategy

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

The project branch, `projects/07-timetrack`, was created once from `main` at Step 1 and stays
open for the whole project. It only merges into `main` when Step 11 is done.

**Immediate action:** `feat/spring-foundation` is done — open a PR into `projects/07-timetrack`
now, then create `feat/timeentry-workflow` from `projects/07-timetrack` before starting Step 5.

---

## Quality gates — which prompt to run when

Each gate ties a concrete point in the build (a §22 branch closing, a learning-plan phase finishing) to
the one prompt that runs there, so a quality check happens at the moment the file it reads has just
become accurate — not remembered at the very end. The project is not closed until every gate has run
(see the closure checklist below).

| Gate | Trigger | Prompt + config | Why exactly here |
|------|---------|-----------------|------------------|
| **G1 — Step ritual** | Every learning-plan step's done condition passes | *(no prompt — the `step-complete` skill fires in-session)* | Keeps PLANNING ✅ / PROGRESS.md / README true as you go, so the later gates read accurate files. |
| **G2 — Plan drift** | Only if the learning plan / branch strategy change mid-build (scope cut, steps reordered) | `plan-audit` · `MODE = review` · `PROJECT = projects/07-timetrack` | Every later gate checks the code against PLANNING.md. A stale plan silently invalidates all of them. Skip if the plan never moved. |
| **G3 — Backend review** | `feat/reports` merges — backend complete (Steps 1–6), **before Step 7 (Angular frontend) starts** | `review-audit` · `PROJECT_PATH = projects/07-timetrack` · `REVIEW_SCOPE = backend` | Correctness + security on the API **before** the frontend is built against it. Fix the High tasks it writes to `PROJECT-BACKLOG.md` before moving on. |
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
