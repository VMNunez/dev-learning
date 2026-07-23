# TimeTrack

My 7th learning project and my first full-stack app — a timesheet where employees log hours on projects and managers approve or reject every entry, with a Spring Boot REST API connected to an Angular frontend.

---

## Why this project

My previous six projects were Angular-only with localStorage as a fake backend. This is the step where everything connects: a real database, a real API and a real frontend talking to each other. I built it to understand how a full-stack app actually works — how Angular calls a Spring Boot API, how the server validates and protects data, and how both sides have to agree on a contract.

---

## GIF

*Coming soon — added when the Angular frontend is complete.*

---

## Screenshots

*Coming soon — added when the Angular frontend is complete.*

---

## Features

- Employees log time entries with project, date, hours and a description
- Every entry goes through a workflow: Draft → Submitted → Approved / Rejected
- Rejected entries can be edited and resubmitted
- Manager dashboard with pending approvals and quick approve/reject actions
- Role-based access — employees see only their own data, managers see everything
- Reports with hours grouped by project and by employee for any month
- Accounts created by managers only — no public registration

---

## Architecture decisions

- Workflow states (DRAFT → SUBMITTED → APPROVED / REJECTED) instead of a boolean to capture every step, enable the resubmit flow and give managers a clear queue of what needs attention
- SecurityContextHolder for the current user instead of a client-supplied userId to prevent privilege escalation — the client cannot choose which user the server acts as
- Manager-only account creation to remove the attack surface of public self-registration entirely
- data.sql seed for the first manager account to avoid a setup endpoint that must be removed after first use
- PATCH for status transitions (submit, approve, reject) to signal that only one field changes — PUT would replace the whole resource
- DTO boundary between persistence and HTTP layer to control exactly what the API exposes and hides
- Soft delete for users and projects to preserve all historical time entry data — hard delete would orphan records
- Docker Compose to run Spring Boot and PostgreSQL together with one command

---

## Tradeoffs

- JWT over session-based auth — stateless API requires no server memory per user
- Soft delete over hard delete — deleting a user would orphan all their time entries
- docker-compose over separate manual setup — one command runs the full project with no local PostgreSQL installation needed

---

## Future improvements

- Export monthly reports to PDF or Excel
- Email notifications when entries are approved or rejected
- Bulk approval for managers handling large teams

---

## What I learned

*Updated as each step is completed.*

- Controller → Service → Repository layered architecture — separation of concerns across three layers
- `@Entity`, `@Id`, `@GeneratedValue` — mapping a Java class to a PostgreSQL table with JPA
- `JpaRepository` — built-in CRUD methods without writing SQL
- `@RestController`, `@RequestMapping`, `@GetMapping` — building a REST endpoint
- Constructor injection with `@Service` — how Spring wires dependencies together
- `@Column(nullable = false, unique = true)` — adding database constraints directly on entity fields
- `@CreationTimestamp` — Hibernate sets the timestamp automatically on first save
- Default field values in Java — `private Boolean active = true` sets the default at the entity level
- DTOs — `CreateProjectRequest`, `UpdateProjectRequest`, `ProjectResponse` — separate API contract from the entity
- `toResponse()` private helper — maps entity to DTO in one place, reused across all service methods
- `ResponseEntity<T>` — controls the HTTP status code explicitly on every endpoint
- `@PathVariable` — reads a dynamic URL segment (`/{id}`) into a method parameter
- `@RequestBody` — converts JSON from the request body into a Java object via Jackson
- `@PostMapping`, `@PutMapping`, `@DeleteMapping` — HTTP method annotations for full CRUD
- `ResponseEntity.noContent().build()` — status 204 with no body, used on DELETE
- `ResponseEntity<Void>` — return type when the response has no body
- `@Value("${property.name}")` — injects a value from `application.properties` into a class field
- `@Component` — registers a utility class as a Spring bean with no specific role
- `long` vs `Long` — primitive when value is always present; wrapper class when `null` is meaningful
- JWT structure — header (algorithm) + payload (sub, iat, exp claims) + signature (HMAC using the secret key)
- `getSigningKey()` — converts a Base64 secret string to a `SecretKey` using `Decoders.BASE64.decode()` + `Keys.hmacShaKeyFor()`
- `Role` enum + `@ColumnDefault` + `data.sql` seeding — role-based authorization end to end, with `@PreAuthorize` tested for both EMPLOYEE (403) and MANAGER (201)
- `DataIntegrityViolationException` handling — clean 409 Conflict instead of a raw 500 on constraint violations
- `@ManyToOne` on `TimeEntry` to both `User` and `Project` — two foreign keys on the same entity
- State machine workflow — `EntryStatus` enum (`DRAFT` → `SUBMITTED` → `APPROVED`/`REJECTED`), each transition checks the current status first
- PATCH with a URL suffix for state transitions (`/submit`, `/approve`, `/reject`) — PUT/POST/DELETE never need one because the verb alone is unambiguous
- Role-based data filtering — `getAll()` branches between `findAll()` and `findByUser()` by reading authorities off `SecurityContextHolder`
- Bean Validation (`@NotBlank`/`@NotNull` + `@Valid`) across every request DTO — accumulates all failed fields in one response, unlike fail-fast manual checks
- Comparing JPA entities by id, not by object reference or full `.equals()` — Lombok's `@Data`-generated `equals()` is unreliable for entities
- `BigDecimal.compareTo()` and `LocalDate.isAfter()`/`isBefore()` — the correct way to compare values that don't support `==`, `<`, `>`, or a safe `.equals()`
- Hard delete over soft delete for `TimeEntry` — only DRAFT entries can be removed, so nothing worth an audit trail is ever lost
- Interface projections — Spring Data builds a proxy per result row from `SELECT ... AS alias`, matched to getter names by convention
- JPQL aggregation with `SUM()` + `GROUP BY` — groups matching rows into buckets before aggregating within each one
- `YearMonth` — binds automatically from `?month=2025-05`; `.atDay(1)`/`.atEndOfMonth()` convert it to a date range
- Repositories organized by entity, controllers/services by feature — a report query still lives on the entity's repository
- Spring Security `/error` gotcha — an unhandled exception can return a misleading 401 if `/error` isn't excluded from `.anyRequest().authenticated()`
- `Specification<T>` + `JpaSpecificationExecutor` — dynamic optional filters built as predicates, one static factory per filter, `cb.conjunction()` when a filter is absent
- `InvalidStateTransitionException` → 409 vs `BusinessRuleViolationException` → 400 — a state-machine conflict is a different HTTP class than an input-data rule
- `PATCH /api/entries/{id}/reopen` — owner-only transition `REJECTED → DRAFT` that clears the rejection note, reviving a rejected entry
- Inactive users can't log in — `.disabled(!user.isActive())` on the `UserDetails` builder + a `DisabledException` handler returning the same generic 401 as bad credentials (no user enumeration)
- Reports count trusted hours only — the aggregates filter on `status = APPROVED` so DRAFT/SUBMITTED/REJECTED never inflate the totals
- Broken object-level authorization (BOLA) — a filter on the list endpoint must also be applied on the detail endpoint (`getById`), returning 404 not 403 so the resource's existence isn't confirmed
- Java Streams `filter`/`map`/`reduce` over `BigDecimal` — computing the report summary totals without a mutable accumulator
- User-management endpoints (manager only) — `POST`/`PUT`/`DELETE /api/users`, BCrypt-hashing the password on create, soft delete, duplicate email mapped to 409
- Spring Profiles — `application-{profile}.properties` merges onto the base config, loaded only when that profile is active
- `@Profile("dev")` on a bean — the bean isn't instantiated at all outside the active profile, not just skipped
- `CommandLineRunner` — Spring calls `run()` once after the context loads, with all beans available
- Startup seeding in Java over `data.sql` — BCrypt hash built at runtime from an env var, never committed to git
- Idempotent seed — `findByEmail(...).isPresent()` guard replaces SQL's `ON CONFLICT DO NOTHING`
- Foreign key `ON DELETE RESTRICT` — can't delete a parent row while a child still references it (SQL state `23503`)

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Java 25 + Spring Boot 4 |
| Auth | Spring Security + JWT |
| Database | PostgreSQL |
| ORM | Spring Data JPA + Hibernate |
| Frontend | Angular + Angular Material |
| Local setup | Docker + docker-compose |
| Tests | JUnit 5 + Mockito (backend), Jasmine + TestBed (frontend) |

---

## Project structure

```
07-timetrack/
├── backend/
│   └── timetrack/                        ← Spring Boot Maven project
│       └── src/main/java/com/victor/timetrack/
│           ├── controller/               ← HTTP layer — receives requests, returns JSON
│           ├── service/                  ← Business logic — validation, rules, state transitions
│           ├── repository/               ← Database access — extends JpaRepository
│           ├── model/                    ← JPA entities — mapped to PostgreSQL tables
│           ├── dto/
│           │   ├── request/              ← What the client sends
│           │   └── response/             ← What the API returns (never the raw entity)
│           ├── exception/                ← Global error handler and custom exceptions
│           └── security/                 ← JWT filter, Spring Security config
└── frontend/                             ← Angular project (added in Step 7)
```

*Each layer only calls the layer directly below it — controller calls service, service calls repository.*

---

## How to run

*Full Docker setup coming in the final step.*

**Requirements:** Java 25, PostgreSQL running locally, database named `timetrack`

Set `DB_PASSWORD` as an environment variable (IntelliJ: Run → Edit Configurations → Environment variables).

Open `projects/07-timetrack/backend/timetrack/` in IntelliJ and run `TimetrackApplication.java`.

API available at `http://localhost:8080`

---

**Full technical details:** [backend/README.md](backend/README.md) · [frontend/README.md](frontend/README.md)
