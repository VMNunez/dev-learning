# TimeTrack — Backend

Spring Boot REST API for the TimeTrack project.

*This README is updated after each step. Steps marked ✓ are complete.*

---

## API endpoints

### Projects ✓

| Method | URL | Role | Description |
|---|---|---|---|
| GET | `/api/projects` | All | List all projects |
| GET | `/api/projects/{id}` | All | Get project by id |
| POST | `/api/projects` | All | Create a project |
| PUT | `/api/projects/{id}` | All | Update a project |
| DELETE | `/api/projects/{id}` | All | Soft delete a project |

### Users ✓ (partial)

| Method | URL | Role | Description |
|---|---|---|---|
| GET | `/api/users` | All | List all users |

### Auth *(Step 3 — coming soon)*

| Method | URL | Role | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Returns JWT |

### Time entries *(Step 5 — coming soon)*

| Method | URL | Role | Description |
|---|---|---|---|
| GET | `/api/entries` | Employee / Manager | Own entries / all entries |
| POST | `/api/entries` | Employee | Create entry (DRAFT) |
| PUT | `/api/entries/{id}` | Employee | Edit DRAFT entry |
| DELETE | `/api/entries/{id}` | Employee | Delete DRAFT entry |
| PATCH | `/api/entries/{id}/submit` | Employee | DRAFT → SUBMITTED |
| PATCH | `/api/entries/{id}/approve` | Manager | SUBMITTED → APPROVED |
| PATCH | `/api/entries/{id}/reject` | Manager | SUBMITTED → REJECTED |

### Reports *(Step 6 — coming soon)*

| Method | URL | Role | Description |
|---|---|---|---|
| GET | `/api/reports/summary` | Manager | Total hours and entries for a month |
| GET | `/api/reports/by-project` | Manager | Hours grouped by project |
| GET | `/api/reports/by-employee` | Manager | Hours grouped by employee |

---

## Database schema

### User

| Field | Type | Notes |
|---|---|---|
| id | BIGINT | Primary key, auto-increment |
| name | VARCHAR | Full name |
| email | VARCHAR | Unique, used for login |
| password | VARCHAR | Hashed with BCrypt |
| role | ENUM | `EMPLOYEE` or `MANAGER` — added in Step 4 |
| active | BOOLEAN | Default true — soft delete |
| createdAt | TIMESTAMP | Set automatically by Hibernate |

### Project ✓

| Field | Type | Notes |
|---|---|---|
| id | BIGINT | Primary key, auto-increment |
| name | VARCHAR | Unique, not null |
| description | VARCHAR | Optional |
| active | BOOLEAN | Default true — inactive projects cannot receive new entries |
| createdAt | TIMESTAMP | Set automatically by Hibernate |

### TimeEntry *(Step 5 — coming soon)*

| Field | Type | Notes |
|---|---|---|
| id | BIGINT | Primary key, auto-increment |
| user | FK → User | Who logged the entry |
| project | FK → Project | Which project the hours belong to |
| date | DATE | The day the work was done |
| hours | DECIMAL(4,2) | Between 0.5 and 24 |
| description | VARCHAR | What was done |
| status | ENUM | `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED` |
| rejectionNote | VARCHAR | Optional — set by manager on reject |
| createdAt | TIMESTAMP | Set automatically |
| updatedAt | TIMESTAMP | Updated automatically on every change |

**Relationships:** User → TimeEntry is `@OneToMany` / `@ManyToOne`. Project → TimeEntry is `@OneToMany` / `@ManyToOne`.

---

## Auth flow *(Step 3 — coming soon)*

1. Client sends `POST /api/auth/login` with email and password
2. Service loads the user from DB, verifies password with BCrypt
3. Server generates a JWT signed with the secret from an environment variable
4. Client sends the JWT in `Authorization: Bearer <token>` on every request
5. `JwtFilter` intercepts the request, validates the token, extracts the user, sets `SecurityContext`
6. Spring Security allows or denies access based on the `SecurityFilterChain` configuration

---

## Security considerations *(Step 3 — coming soon)*

- Passwords hashed with BCrypt — never stored in plain text
- JWT secret loaded from environment variable — never committed to git
- Role-based endpoint protection with `@PreAuthorize`
- Input validation at controller boundary with `@Valid` + `@ControllerAdvice`

---

## Key patterns

### Layered architecture ✓

Controller → Service → Repository. Each layer only calls the one directly below it. Controllers never call repositories directly.

```
@RestController          ← receives HTTP request, calls service, returns ResponseEntity
      ↓
@Service                 ← business logic, validation, maps entity ↔ DTO
      ↓
JpaRepository            ← reads and writes data, no logic
```

### DTO boundary ✓

Entities never leave the service layer. Every endpoint receives a request DTO and returns a response DTO. This controls exactly what the API exposes — password hashes, internal IDs and lazy-loaded relationships never reach the client.

```java
// Entity → DTO mapping in one private method, reused across all service methods
private ProjectResponse toResponse(Project project) {
    return new ProjectResponse(project.getId(), project.getName(),
            project.getDescription(), project.isActive(), project.getCreatedAt());
}
```

### Soft delete ✓

`DELETE /api/projects/{id}` sets `active = false` — no data is permanently removed. Inactive projects cannot receive new time entries, but all historical data remains queryable.

### GlobalExceptionHandler *(Step 3 — coming soon)*

`@ControllerAdvice` catches exceptions across all controllers and returns consistent JSON error responses instead of Spring's default HTML error page.

---

## Tradeoffs

- JWT over session-based auth — stateless API requires no server memory per user; any instance can validate the token
- Soft delete over hard delete — deleting a user would orphan all their time entries; soft delete preserves the full audit trail
- RuntimeException over checked exceptions — Spring Boot convention; caught globally with `@ControllerAdvice` at the boundary

---

## Folder structure

```
src/main/java/com/victor/timetrack/
├── controller/
│   ├── UserController.java          ✓
│   ├── ProjectController.java       ✓
│   ├── AuthController.java          (Step 3)
│   ├── TimeEntryController.java     (Step 5)
│   └── ReportController.java        (Step 6)
├── service/
│   ├── UserService.java             ✓
│   ├── ProjectService.java          ✓
│   ├── AuthService.java             (Step 3)
│   ├── TimeEntryService.java        (Step 5)
│   └── ReportService.java           (Step 6)
├── repository/
│   ├── UserRepository.java          ✓
│   ├── ProjectRepository.java       ✓
│   └── TimeEntryRepository.java     (Step 5)
├── model/
│   ├── User.java                    ✓
│   ├── Project.java                 ✓
│   ├── TimeEntry.java               (Step 5)
│   ├── Role.java                    (Step 4 — enum: EMPLOYEE, MANAGER)
│   └── EntryStatus.java             (Step 5 — enum: DRAFT, SUBMITTED, APPROVED, REJECTED)
├── dto/
│   ├── request/
│   │   ├── CreateProjectRequest.java  ✓
│   │   └── UpdateProjectRequest.java  ✓
│   └── response/
│       └── ProjectResponse.java       ✓
├── exception/                         (Step 3)
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── UnauthorizedException.java
└── security/                          (Step 3)
    ├── JwtUtil.java
    ├── JwtFilter.java
    └── SecurityConfig.java
```

*Each layer only calls the one directly below it — controller calls service, service calls repository. No layer skips another.*

---

## How to run alone

**Requirements:** Java 25, PostgreSQL running locally, database named `timetrack`

Set `DB_PASSWORD` as an environment variable:
- IntelliJ: Run → Edit Configurations → Environment variables → add `DB_PASSWORD`

Open `projects/07-timetrack/backend/timetrack/` in IntelliJ and run `TimetrackApplication.java`.

API available at `http://localhost:8080`
