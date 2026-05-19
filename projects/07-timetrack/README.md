# TimeTrack

A timesheet app where employees log hours worked on projects. Managers review, approve or reject entries.

---

## Screenshots

*Coming soon — added when the Angular frontend is complete.*

---

## Features

- Employees log time entries with project, date, hours and description
- DRAFT → SUBMITTED → APPROVED / REJECTED workflow for every entry
- Manager approval dashboard with quick approve and reject actions
- Role-based access — employees see their own data, managers see everything
- Reports with hours grouped by project and by employee
- Soft delete for users and projects — historical data is never lost

---

## Architecture decisions

**Manager creates employee accounts instead of public self-registration → prevents role abuse → removes the attack surface entirely**
Self-registration would let anyone assign themselves the Manager role. Since there is no role verification at signup, the only safe approach is to have an existing manager create every account.

**`data.sql` for the first manager account instead of a setup endpoint → simpler and safer → no endpoint to forget and leave open**
A setup endpoint must be removed or protected after first use — it is easy to forget and becomes a security hole. A seed file runs automatically on startup, is version-controlled, and cannot be called from outside.

**Workflow states (DRAFT → SUBMITTED → APPROVED / REJECTED) instead of a boolean `approved` field → richer state machine → enables the resubmit flow and clear audit trail**
A boolean only captures the final state. The workflow captures every step: employees see that their entry is pending, managers know what needs attention, and rejected entries can be corrected and resubmitted. A boolean would require extra fields to represent the same information.

**DTOs instead of returning JPA entities directly from the API → controlled API contract → hides internal fields from the client**
Entities contain fields that should never leave the server — password hashes, lazy-loaded relationships, internal foreign keys. DTOs let you control exactly what the API returns and receives, independent of the database schema.

**`@PreAuthorize` instead of checking roles inside the service → separation of concerns → access control is visible at a glance**
Role checks inside the service mix business logic with access control — two separate concerns in the same class. `@PreAuthorize` moves access control to the method signature, where it is enforced before the method body runs.

**`SecurityContextHolder` to get the current user instead of passing `userId` in the request body → prevents privilege escalation → the client cannot choose which user the server acts as**
Passing `userId` in the body lets the client act as any user — a classic privilege escalation risk. `SecurityContextHolder` reads the authenticated user from the JWT token, which the server validated. The client cannot forge it.

**`PATCH` for state transitions (submit, approve, reject) instead of `PUT` → correct HTTP semantics → signals that only one field changes**
`PUT` replaces an entire resource. State transitions only change the `status` field. `PATCH` signals that a partial update is happening, which matches the intent of a workflow action.

**Soft delete (`active = false`) for users and projects instead of hard delete → preserves historical data → no orphaned records**
Deleting a user would orphan all their time entries — the history would reference a user that no longer exists. Soft delete preserves all historical data while preventing the account from being used.

**Docker Compose instead of running Spring Boot and PostgreSQL separately → one command to start everything → no local PostgreSQL installation needed**
`docker-compose up` starts the full application — database included. Anyone can run the project without installing or configuring PostgreSQL locally. This is how every consultancy runs local development.

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
│           │   ├── request/              ← What the client sends (create, update payloads)
│           │   └── response/             ← What the API returns (never the raw entity)
│           ├── exception/                ← Global error handler and custom exceptions
│           └── security/                 ← JWT filter, Spring Security config
└── frontend/                             ← Angular project (added in Step 7)
```

*Each layer only calls the layer directly below it — controller calls service, service calls repository. No layer skips another.*

---

## How to run

*Full Docker setup coming in the final step. For now, run manually.*

**Requirements:** Java 25, PostgreSQL running locally, database named `timetrack`

**1. Set the database password as an environment variable**

In IntelliJ: Run → Edit Configurations → Environment variables → add `DB_PASSWORD` with your PostgreSQL password.

**2. Run the backend**

Open `projects/07-timetrack/backend/timetrack/` in IntelliJ and run `TimetrackApplication.java`.

API available at `http://localhost:8080`

*Frontend instructions will be added when the Angular project is set up.*
