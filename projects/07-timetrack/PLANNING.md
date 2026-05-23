# Project 07 — TimeTrack

A timesheet app where employees log hours worked on projects.
Managers review the entries and approve or reject them.

---

## Why this project

- The workflow pattern (DRAFT → SUBMITTED → APPROVED / REJECTED) appears in almost every enterprise app
- Role-based authorization in Spring Security is a skill used in every Spring Boot project
- Spanish consultancies use timesheet tools every day — this domain is immediately relatable to interviewers
- It is rare in junior portfolios — most people build finance trackers or todo apps

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Java + Spring Boot |
| Auth | Spring Security + JWT |
| Database | PostgreSQL |
| ORM | Spring Data JPA + Hibernate |
| Frontend | Angular + Angular Material |
| Local setup | Docker + docker-compose |
| Tests | JUnit 5 + Mockito (backend), Jasmine + TestBed (frontend) |

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

See [notes/architecture/03-layered-architecture.md](../../notes/architecture/03-layered-architecture.md) for the full layered architecture explanation.

---

## Entities

### User
| Field | Type | Notes |
|---|---|---|
| id | BIGINT | Primary key, auto-increment |
| name | VARCHAR | Full name |
| email | VARCHAR | Unique, used for login |
| password | VARCHAR | Hashed with BCrypt |
| role | ENUM | `EMPLOYEE` or `MANAGER` |
| active | BOOLEAN | Default true — soft delete, inactive users cannot log in |
| createdAt | TIMESTAMP | Set automatically |

### Project
| Field | Type | Notes |
|---|---|---|
| id | BIGINT | Primary key, auto-increment |
| name | VARCHAR | Unique, not null |
| description | VARCHAR | Optional |
| active | BOOLEAN | Default true — inactive projects cannot receive new entries |
| createdAt | TIMESTAMP | Set automatically |

### TimeEntry
| Field | Type | Notes |
|---|---|---|
| id | BIGINT | Primary key, auto-increment |
| user | FK → User | Who logged the entry |
| project | FK → Project | Which project the hours belong to |
| date | DATE | The day the work was done |
| hours | DECIMAL(4,2) | Between 0.5 and 24 |
| description | VARCHAR | What was done |
| status | ENUM | `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED` |
| rejectionNote | VARCHAR | Optional — set by manager when rejecting |
| createdAt | TIMESTAMP | Set automatically |
| updatedAt | TIMESTAMP | Updated automatically on every change |

### Relationships
- User → TimeEntry: one-to-many (`@OneToMany` / `@ManyToOne`)
- Project → TimeEntry: one-to-many (`@OneToMany` / `@ManyToOne`)

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
- Employee can only edit or delete DRAFT entries
- Employee can only submit DRAFT entries
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
- Create a collection called `TimeTrack`
- Create folders inside it: `Users`, `Projects`, `Entries`, `Auth`
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
│   │   ├── CreateUserRequest.java
│   │   ├── UpdateUserRequest.java
│   │   ├── CreateEntryRequest.java
│   │   └── RejectEntryRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── UserResponse.java
│       ├── EntryResponse.java
│       └── ReportResponse.java
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
- Create project with Spring Initializr (dependencies: Spring Web, Spring Data JPA, PostgreSQL Driver)
- Connect to PostgreSQL via `application.properties`
- Create `User` entity with `@Entity`, `@Id`, `@GeneratedValue`
- Create `UserRepository` extending `JpaRepository`
- Create `UserService` with a `getAll()` method
- Create `UserController` with a `GET /api/users` endpoint
- **Concept learned:** Controller → Service → Repository pattern, JPA basics, project setup

### Step 2 — Full CRUD for Projects
- Create `Project` entity, repository, service, controller
- GET all, GET by id, POST, PUT, DELETE
- Use DTOs to separate request/response from the entity
- **Concept learned:** REST conventions, DTOs, full CRUD in Spring Boot

### Step 3 — Spring Security + JWT
- Add Spring Security dependency
- Configure CORS — Angular runs on port 4200, Spring Boot on 8080; without CORS the browser blocks all requests
- Create the login endpoint (`POST /api/auth/login`)
- Hash passwords with BCrypt
- Generate and validate JWT tokens
- Protect all routes except `/api/auth/login`
- Add `GlobalExceptionHandler` with `@ControllerAdvice` for clean JSON error responses
- **Concept learned:** Spring Security configuration, CORS, JWT flow, global error handling

### Step 4 — Role-based authorization
- Add `role` and `active` fields to `User` (EMPLOYEE / MANAGER)
- Create `data.sql` with the first manager account — role field now exists, seed can run safely
- Use `@PreAuthorize("hasRole('MANAGER')")` on project and user endpoints — only managers can create, update, or delete
- Use `SecurityContextHolder` to get the current logged-in user inside a service method
- **Concept learned:** Spring Security roles, SecurityContext, database seeding

### Step 5 — TimeEntry CRUD + workflow
- Create `TimeEntry` entity with `@ManyToOne` to User and Project
- `GET /api/entries` — use `SecurityContextHolder` to return own entries for employees, all entries for managers
- CRUD endpoints with business rule validation (future date, inactive project, DRAFT-only edits)
- Status transitions: submit, approve, reject
- **Concept learned:** entity relationships, role-based data filtering, business logic in services, state machine pattern

### Step 6 — Reports
- Aggregate queries with JPQL
- Summary by project and by employee for a given month
- **Concept learned:** JPQL aggregations, reporting patterns in Spring Boot

### Step 7 — Angular frontend
- Set up Angular project with Angular Material and the indigo theme
- Auth service + JWT storage in localStorage
- HTTP interceptor to attach the token to every request
- Auth guard + manager guard
- Shared components: `status-badge`, `confirm-dialog`, `reject-dialog`
- All pages: Login, Dashboard, Entries, Projects, Approvals, Team, Reports
- **Concept learned:** Angular consuming a real REST API end to end

### Step 8 — Tests
- Backend: JUnit 5 + Mockito — one test per service method
- Frontend: Jasmine + TestBed — one test per service
- **Concept learned:** unit testing in both Java and Angular

### Step 9 — Docker
- `Dockerfile` for the Spring Boot app
- `docker-compose.yml` with Spring Boot + PostgreSQL services
- `docker-compose up` runs everything locally
- **Concept learned:** Docker basics, containerisation

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

Write when the frontend is complete (after Step 7).

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

---

## Future improvements to document in the global README

Domain-realistic only — max 3 bullets.

- Export approval reports to PDF or Excel
- Email notifications when entries are approved or rejected
- Bulk approval workflow for managers handling large teams
