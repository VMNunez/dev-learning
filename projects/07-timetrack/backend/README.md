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
| GET | `/api/reports/by-user` | Manager | Hours grouped by user |

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

### Create/Update DTO pair ✓

Every resource (`Project`, `TimeEntry`) has a separate `Create*Request` and `Update*Request`, even where their fields are identical today — the two operations represent distinct intents, and an update-only field (like reactivating a soft-deleted record) can be added to one without touching the creation contract.

### Soft delete ✓

`DELETE /api/projects/{id}` sets `active = false` — no data is permanently removed. Inactive projects cannot receive new time entries, but all historical data remains queryable.

### Externalized CORS configuration ✓

The allowed origin is loaded from `app.cors.allowed-origins` via `@Value`, not hardcoded in `SecurityConfig` — an environment-specific value stays outside compiled code. `allowCredentials(false)` because auth travels in the `Authorization` header, not cookies, so credentialed CORS is unnecessary and only forces the stricter same-exact-origin matching for no benefit.

### GlobalExceptionHandler *(Step 3 — coming soon)*

`@ControllerAdvice` catches exceptions across all controllers and returns consistent JSON error responses instead of Spring's default HTML error page.

### Transactional boundaries ✓

Every service method is explicitly `@Transactional` (writes) or `@Transactional(readOnly = true)` (reads). Without it, each repository call runs as its own auto-commit transaction — a read-then-write method like `update` or `submit` would have no atomic boundary between the `find` and the `save`. `readOnly = true` also lets Hibernate skip dirty-checking on methods that never mutate an entity.

### N+1 prevention on `GET /api/entries`

`TimeEntry.user` and `TimeEntry.project` are `@ManyToOne(fetch = FetchType.LAZY)` — `@ManyToOne` defaults to `EAGER`, which would trigger one extra query per relationship per row (1 query for the list + up to 2N extra queries). `TimeEntrySpecifications.fetchUserAndProject()` adds an explicit `LEFT JOIN FETCH` on both relationships so the listing endpoint loads entries, users and projects in a single query. The fetch is skipped when `query.getResultType()` is `Long` (the pagination count query), since a fetch join is invalid there.

### `equals`/`hashCode`/`toString` on JPA entities ✓

`User`, `Project` and `TimeEntry` use `@Getter`/`@Setter` instead of Lombok's `@Data`. `@Data` generates `equals`/`hashCode` over every field, including the database-generated `id` — but an entity's `id` is `null` until it is persisted, so an entity placed in a `HashSet`/`HashMap` before saving becomes unreachable in that collection once Hibernate assigns its `id` (the object's hash code changes after insertion). `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` + `@EqualsAndHashCode.Include` on `id` makes identity depend only on the database key. `TimeEntry` also adds `@ToString(exclude = {"user", "project"})`: both are `@ManyToOne(fetch = FetchType.LAZY)`, and a generated `toString()` that includes them would trigger a lazy load — safe only inside an open transaction, and throwing `LazyInitializationException` otherwise (e.g. from a log call after the request completes).

### Password excluded from `LoginRequest.toString()` ✓

`LoginRequest` keeps `@Data` but adds `@ToString.Exclude` on `password`: `@Data`'s generated `toString()` otherwise includes every field, so the plaintext password would land in any future request-logging or framework body-dump call. No logger stringifies the request today, but the fix is one annotation and closes the gap before it becomes exploitable.

### Explicit JWT validation ✓

`JwtUtil.isValid` parses the token once and checks the subject **and** `getExpiration().after(new Date())` explicitly, instead of relying on `extractUsername` throwing as a side effect of parsing. Makes the expiration check a deliberate decision in the code, not an accident of call order.

### Reconciled report aggregates ✓

`GET /api/reports/summary`, `by-project` and `by-user` all filter to `EntryStatus.APPROVED` only, so the summary card's `approvedHours` always equals the sum of either detail table for the same month. `pendingHours` stays a separate, explicitly-named field and is never folded into a total — the DRAFT → SUBMITTED → APPROVED workflow only produces numbers a manager can trust if unapproved hours never leak into one.

### Honest naming on `by-user` ✓

`GET /api/reports/by-employee` was renamed to `/by-user`: the query groups `TimeEntry.user` with no role filter, so a manager who was promoted from EMPLOYEE still shows up with their historical hours — correctly, since those hours are still billable. `by-employee` implied a role guarantee the code never enforced; `by-user` names what the query actually returns. `EmployeeHoursReportResponse`/`getEmployeeName()` were renamed to `UserHoursReportResponse`/`getUserName()` for the same reason.

### Report aggregates carry the `active` flag ✓

`ProjectHoursReportResponse`/`UserHoursReportResponse` expose `isActive()`, sourced from `te.project.active`/`te.user.active` added to the `by-project`/`by-user` JPQL `SELECT` and `GROUP BY`. A soft-deleted project or user still keeps its historical hours in the aggregate — the work was real — but the flag lets the client distinguish "still active" from "archived" instead of guessing from a row that silently stopped appearing.

### Status codes are named, and a `201` says where ✓

Every controller returns its status through a factory — `ok`, `created`, `noContent` — instead of `ResponseEntity.status(200)`, so the status is a checked constant rather than an `int` the compiler cannot validate. The three `POST` endpoints go through `created(location)`, whose URI is built with `ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")`: the response carries a `Location` header naming the new resource, so the client never has to assemble that URL from its own copy of the route scheme.

### Report row order is part of the contract ✓

`by-project` and `by-user` end with `ORDER BY SUM(te.hours) DESC, te.project.name ASC` (and `te.user.name ASC`). A `GROUP BY` guarantees no row order, so without it the sort fell to Angular and the endpoint was non-deterministic to test. The trailing name key resolves ties, making the ordering total — two rows with equal hours cannot swap between calls.

### Extracted entry validation ✓

`TimeEntryService.create` and `update` both check the same three business rules (future date, active project, hours in range). `validateEntryData(request, project)` holds that logic once, called from both methods, with `MIN_HOURS`/`MAX_HOURS` as class constants instead of re-instantiated `BigDecimal` literals.

### Two-layer validation on `hours` ✓

`TimeEntry.hours` is constrained at both ends, deliberately kept as two layers rather than one: `@Column(precision = 4, scale = 2)` on the entity guarantees the DB never stores more precision than the field is meant to hold, and `@DecimalMin("0.5")` / `@DecimalMax("24")` / `@Digits(integer = 2, fraction = 2)` on `CreateTimeEntryRequest` reject an out-of-range or over-precise value at the HTTP boundary with a 400, before it ever reaches the service. `TimeEntryService` also keeps its own manual 0.5–24 check — redundant with the DTO validation for HTTP requests, but it protects the business rule for any future non-HTTP caller of the service.

### JWT subject taken from the verified `Authentication`, not the request body ✓

`AuthService.login` uses `authentication.getName()` — the value `AuthenticationManager.authenticate(...)` returns after checking the credentials — to generate the token and look up the user, never `request.getEmail()` directly. Both resolve to the same value today (`findByEmail` is an exact match), but taking the subject from unvalidated input rather than the verified identity is the habit that becomes exploitable the moment lookup logic changes.

### `ForbiddenOperationException` — a status-honest name, distinct from `AccessDeniedException` ✓

Renamed from `UnauthorizedException`, which mapped to 403 while its name suggested 401. It has no inheritance relationship with Spring Security's own `AccessDeniedException` — both resolve to 403 today, but each is caught by its own `@ExceptionHandler` in `GlobalExceptionHandler`, because one is a framework-thrown refusal from `@PreAuthorize` and the other is a hand-thrown business rule (segregation of duties on `approve`/`reject`).

### A non-owned entry is `404`, not `403` ✓

`TimeEntryService.findOwnedEntry(id, user)` chains `findById(id)` → `Optional.filter` (the ownership test) → `orElseThrow`, so "this id does not exist" and "this id is not yours" leave through the same throw with the same message. Returning 403 for the second case would make the status code an enumeration oracle: an EMPLOYEE could probe ids on `submit`/`update`/`reopen`/`delete` and learn which entries exist across the whole table without reading one. `approve`/`reject` keep their 403 (`ForbiddenOperationException`) because that refusal is segregation of duties, not ownership — a MANAGER already sees every entry, so the status discloses nothing they could not read from the listing.

### Every validation violation reaches the client ✓

`fieldErrors` is a `Map<String, List<String>>`, collected with `Collectors.groupingBy` + `Collectors.mapping`. The earlier `Collectors.toMap` needed a merge function to resolve duplicate keys, and `(existing, replacement) -> existing` silently dropped the second violation whenever one field failed two constraints at once — `email` both over `@Size(max = 255)` and failing `@Email` reached the client as a single message. Bean Validation evaluates every constraint; only the collection step was throwing the result away.

---

## Tradeoffs

- JWT over session-based auth — stateless API requires no server memory per user; any instance can validate the token
- Soft delete over hard delete — deleting a user would orphan all their time entries; soft delete preserves the full audit trail
- RuntimeException over checked exceptions — Spring Boot convention; caught globally with `@ControllerAdvice` at the boundary
- 60-minute JWT expiration with no refresh token — a shorter-lived access token limits the damage window of a stolen token; without a refresh token, a session idle past 60 minutes forces a fresh login instead of silently renewing. A refresh-token flow is out of scope for this MVP
- No forced password change on first login — a `mustChangePassword` flag would need frontend route interception to enforce, cut deliberately for the MVP; a new account keeps its generated password until the user changes it voluntarily via `PATCH /api/users/me/password`
- No `GET /{id}` for entries or users — the UI is entirely tables and dialogs, with no detail view and no deep-linkable route, so an edit dialog opens from a row the page already holds and a single-resource fetch would re-request data that is already in memory. What this gives up is real: no shareable URL for one entry, a dialog lost on refresh, and an edit that starts from a snapshot rather than the current row. Acceptable here because only an entry's own owner and a manager can edit anything, so two people racing on one row is not a realistic case, and the list is refetched after every mutation
- No password reset flow — resetting a forgotten password needs an email channel to deliver a reset link/token, which is out of scope; today a manager deactivates and recreates the account instead

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
│   └── ForbiddenOperationException.java
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
