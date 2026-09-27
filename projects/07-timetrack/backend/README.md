# TimeTrack — Backend

Spring Boot REST API behind TimeTrack: JWT authentication, two roles, and the
DRAFT → SUBMITTED → APPROVED / REJECTED workflow, over PostgreSQL. Java 25, Spring Boot 4, Spring
Security, Spring Data JPA. Project overview and live demo: [../README.md](../README.md).

[API](#api-endpoints) · [Schema](#database-schema) · [Patterns and source](#key-patterns) · [Tradeoffs](#tradeoffs) · [Run](#how-to-run-alone) · [Tests](#tests)

**Testing status:** DTO validation tests are implemented; the service unit tests are planned.

---

## API endpoints

### Auth

| Method | URL | Role | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Checks email and password and returns a JWT plus the caller's id, name and role; `429` after five failures |

### Users

| Method | URL | Role | Description |
|---|---|---|---|
| GET | `/api/users` | MANAGER | Every account, active and deactivated — active first, then by name |
| POST | `/api/users` | MANAGER | Creates an account and returns its generated password, once |
| PUT | `/api/users/{id}` | MANAGER | Updates name, email, role or the `active` flag |
| PATCH | `/api/users/me/password` | EMPLOYEE, MANAGER | Changes the caller's own password after verifying the current one |
| POST | `/api/users/{id}/password-reset` | MANAGER | Generates a new password for another account and returns it, once |
| DELETE | `/api/users/{id}` | MANAGER | Deactivates an account (soft delete) |

### Projects

| Method | URL | Role | Description |
|---|---|---|---|
| GET | `/api/projects` | EMPLOYEE, MANAGER | Projects by name — active ones for an employee, all for a manager |
| GET | `/api/projects/{id}` | EMPLOYEE, MANAGER | One project; an inactive one is `404` for an employee |
| POST | `/api/projects` | MANAGER | Creates a project |
| PUT | `/api/projects/{id}` | MANAGER | Updates name, description or the `active` flag |
| DELETE | `/api/projects/{id}` | MANAGER | Deactivates a project (soft delete) |

### Time entries

| Method | URL | Role | Description |
|---|---|---|---|
| GET | `/api/entries` | EMPLOYEE, MANAGER | Paged entries — the caller's own for an employee, everyone's for a manager; optional `month`, `projectId`, `status` and (manager only) `userId` filters |
| POST | `/api/entries` | EMPLOYEE | Logs an entry in `DRAFT` |
| PUT | `/api/entries/{id}` | EMPLOYEE | Replaces an own `DRAFT` entry |
| DELETE | `/api/entries/{id}` | EMPLOYEE | Deletes an own `DRAFT` entry (hard delete — a draft has no history) |
| PATCH | `/api/entries/{id}/submit` | EMPLOYEE | `DRAFT → SUBMITTED` |
| PATCH | `/api/entries/{id}/reopen` | EMPLOYEE | `REJECTED → DRAFT`, so the entry can be corrected and resubmitted |
| PATCH | `/api/entries/{id}/approve` | MANAGER | `SUBMITTED → APPROVED`; refused on the manager's own entry |
| PATCH | `/api/entries/{id}/reject` | MANAGER | `SUBMITTED → REJECTED` with a mandatory note; refused on the manager's own entry |

### Reports

| Method | URL | Role | Description |
|---|---|---|---|
| GET | `/api/reports/summary` | EMPLOYEE, MANAGER | Approved hours, pending hours and approved-entry count for a month — the caller's own for an employee, the company's for a manager |
| GET | `/api/reports/by-project` | MANAGER | Approved hours per project for a month |
| GET | `/api/reports/by-user` | MANAGER | Approved hours per user for a month |

Every endpoint declares its role with `@PreAuthorize`; `EMPLOYEE, MANAGER` rows are
`isAuthenticated()` and scope their data by the caller's role in the service. Every error answers with
the one `ErrorResponse` body described under *GlobalExceptionHandler* below.

---

## Database schema

### User → `users`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| id | BIGINT | PK, sequence-generated | Bare `@GeneratedValue`, a Hibernate sequence on PostgreSQL |
| name | VARCHAR | not null | Full name shown in the UI — not unique |
| email | VARCHAR | not null, unique | Login identity, stored trimmed and lower-cased |
| password | VARCHAR | not null | BCrypt hash, never plain text |
| role | VARCHAR | not null | `EMPLOYEE` or `MANAGER`, `@Enumerated(STRING)` |
| active | BOOLEAN | not null, default true | Soft delete — an inactive user cannot log in |
| createdAt | TIMESTAMP | not null, not updatable | `@CreationTimestamp` |

`active` is a soft delete rather than a row removal: `time_entries.user_id` is a not-null foreign key
with no cascade, so a user who leaves is deactivated and every hour they logged stays in the reports.

### Project → `projects`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| id | BIGINT | PK, sequence-generated | Same sequence strategy as `users.id` |
| name | VARCHAR | not null, unique | Checked case-insensitively before every write |
| description | VARCHAR | nullable | Optional context |
| active | BOOLEAN | not null, default true | An inactive project refuses new entries |
| createdAt | TIMESTAMP | not null, not updatable | `@CreationTimestamp` |

Deactivating a project closes it to new work without touching its past: its entries keep counting in
every report, flagged with the project's `active` value, while a new entry or a submit against it is
refused.

### TimeEntry → `time_entries`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| id | BIGINT | PK, sequence-generated | Same sequence strategy as `users.id` |
| user | BIGINT (FK → `users`) | not null | `@ManyToOne(fetch = LAZY)` — who logged the entry |
| project | BIGINT (FK → `projects`) | not null | `@ManyToOne(fetch = LAZY)` — the project the hours belong to |
| date | DATE | not null | The day worked; never in the future |
| hours | DECIMAL(4,2) | not null | Between 0.5 and 24 |
| description | VARCHAR | not null | What was done |
| status | VARCHAR | not null, default `'DRAFT'` | `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED`, `@Enumerated(STRING)` |
| rejectionNote | VARCHAR | nullable | Set by the manager on reject |
| createdAt | TIMESTAMP | not null, not updatable | `@CreationTimestamp` |
| updatedAt | TIMESTAMP | not null | `@UpdateTimestamp` |

`status` is a four-value enum rather than an `approved` boolean, because the workflow has a resubmit
loop — a rejected entry is reopened to `DRAFT` — and each transition is a rule the service enforces;
it is stored as a string so reordering the enum can never rewrite history.

**Relationships.** Both `@ManyToOne` are unidirectional: `User` and `Project` declare no `@OneToMany`,
because every read of a user's or a project's entries is a filtered, paged query through
`TimeEntryRepository`. Neither cascades, so a hard delete of a referenced user or project is refused by
the foreign key instead of taking timesheet history with it — which is why both parents use soft delete.

---

## Auth flow

1. The client sends `POST /api/auth/login` with email and password, and `AuthService` refuses it with `429` if that email or the caller's IP is inside the failed-login cooldown.
2. `AuthenticationManager` loads the user through `UserDetailsServiceImpl` and checks the password against the stored hash with BCrypt, answering `401` for a wrong password or a deactivated account.
3. `JwtUtil` issues a token signed with the HMAC key from `JWT_SECRET`, whose subject is the user's id and which expires after 60 minutes, returned with the caller's id, name and role.
4. The client sends that token in the `Authorization: Bearer <token>` header on every later request.
5. `JwtFilter` verifies the signature and the expiry, loads the user by the id in the subject, and rejects an account deactivated since the token was issued.
6. The filter stores that user and its `ROLE_` authority in the `SecurityContextHolder`, and a request left unauthenticated is answered `401` by `JwtAuthenticationEntryPoint`.
7. `@PreAuthorize` on the controller method checks the caller's role and answers `403` when it does not match.
8. The endpoint executes, and the service reads the caller through `AuthenticatedUserProvider` from the security context, never from a request parameter.

---

## Security considerations

- **Passwords** are stored only as BCrypt hashes; the password of a new or reset account is generated
  with `SecureRandom` and returned once, in a response type no other endpoint uses.
- **No secret has a default.** `DB_PASSWORD`, `JWT_SECRET` and `ADMIN_PASSWORD` are `${...}`
  placeholders, so a missing one fails at startup instead of falling back to a value in git; the first
  manager is seeded at runtime behind the `dev` profile, not from a hash in `data.sql`.
- **One public route.** `POST /api/auth/login` is permitted by method and exact path, never by prefix,
  and every other endpoint declares its own `@PreAuthorize` rule on top of the
  `anyRequest().authenticated()` perimeter.
- **Ownership comes from the token, never from the request.** An employee's `userId` filter is replaced
  with their own id, and an entry they do not own answers `404` exactly like one that does not exist, so
  ids cannot be probed.
- **Revocable identity.** The token's subject is the user's immutable id, not the editable email, and
  `JwtFilter` runs `AccountStatusUserDetailsChecker`, so a deactivated user loses access on their next
  request rather than at token expiry.
- **Fail-closed token parsing.** Tokens expire after 60 minutes, and any parse failure — bad signature,
  expired, blank — leaves the request unauthenticated and answers `401` through
  `JwtAuthenticationEntryPoint`.
- **Login throttling.** Five failed logins on one email or from one IP answer `429` for one minute,
  checked in `LoginAttemptService` before BCrypt runs.
- **Input validation** with `@Valid` on every request body, and `?sort=` checked against an allow-list,
  so a client can neither trigger a `500` with an unknown property nor order results by `user.password`.
- **Errors leak no internals.** `GlobalExceptionHandler` answers an unexpected exception with a fixed
  `500` message and logs the stack trace server-side, and a database constraint violation with a fixed
  message instead of Hibernate's.
- **Credentials stay out of logs.** Every password and token field carries `@ToString.Exclude`, so
  Lombok's generated `toString()` never prints it.
- **CORS** admits only the configured origins, the methods the API exposes and the `Authorization` and
  `Content-Type` headers, with `allowCredentials(false)`.
- **CSRF protection is disabled deliberately.** The token travels in the `Authorization` header, which
  no browser attaches on its own, so a cross-site request arrives unauthenticated; it would have to come
  back if the token ever moved to a cookie.
- **Least-privilege database role.** The app connects as `timetrack_app`, a non-superuser owning only
  the `timetrack` database, so a compromised connection cannot read other roles' password hashes, run
  shell commands through `COPY … PROGRAM`, or alter objects it does not own.

---

## Folder structure

```
backend/timetrack/
├── Dockerfile                   # builds the API image that docker-compose and the host run
├── src/main/java/com/victor/timetrack/
│   ├── config/                  # DataInitializer (dev-only manager seed), WebConfig (page DTO + 100-row cap)
│   ├── controller/              # HTTP only: @Valid, @PreAuthorize, ResponseEntity — no business logic
│   ├── service/                 # business rules, state transitions, ownership, entity ↔ DTO mapping
│   ├── repository/              # Spring Data repositories, report JPQL, Specification filters
│   ├── model/                   # JPA entities (User, Project, TimeEntry) and the Role / EntryStatus enums
│   ├── dto/
│   │   ├── request/             # validated request bodies, one Create/Update pair per resource
│   │   └── response/            # response bodies, report projections, ErrorResponse
│   ├── exception/               # domain exceptions and the GlobalExceptionHandler mapping them to statuses
│   ├── security/                # SecurityConfig, JwtUtil, JwtFilter, the 401 entry point, login throttling
│   └── util/                    # EmailNormalizer — one canonical email form for every comparison
├── src/main/resources/          # application.properties, application-dev.properties, ValidationMessages.properties
└── src/test/java/com/victor/timetrack/   # JUnit 5 tests — see Tests
```

---

## Key patterns

Start with the [workflow and ownership checks](timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java), the [paging and sort contract](timetrack/src/main/java/com/victor/timetrack/controller/TimeEntryController.java), and the [report queries](timetrack/src/main/java/com/victor/timetrack/repository/TimeEntryRepository.java). These show how a submitted hour becomes reviewable work and then a report total.

### Architecture & dependency injection

- **Layered architecture** — controllers handle HTTP, services enforce business rules and map DTOs, and repositories query persistence; controllers never call repositories directly.
- **Constructor injection** — collaborators and required configuration arrive together, so dependencies can be final and a bean cannot be constructed with settings waiting for field injection.

```text
Controller → Service → Repository → PostgreSQL
 HTTP        rules      queries
             DTO mapping
```

### DTO & API contract

- **DTO boundary** — entities stay behind the service layer; response DTOs expose the ids the client needs while excluding password hashes and persistence internals.
- **Create/Update DTO pairs** — separate request types let update-only fields evolve without changing creation; each service reuses a private `toResponse()` mapper.
- **Explicit status and location** — controller factories express `200`, `201` and `204`; resource creation returns a `Location` header built from the request URI.
- **Stable page envelope** — `VIA_DTO` serializes `content` and page metadata instead of exposing `PageImpl` internals; a resolver customizer enforces the 100-row cap after opting into Spring Data web configuration.
- **Relation ids beside labels** — `TimeEntryResponse` includes `projectId` and `userId`, so editing never has to recover identity by matching a display name.
- **Project update semantics** — `PUT /api/projects/{id}` requires `name`, replaces `description` (omission clears it), and preserves `active` when that field is omitted or null; this is a mixed update contract, not full replacement.
- **Non-null response flags** — `ProjectResponse.active` is primitive because neither the entity nor its database column admits an absent value.
- **Report decimal scale** — SQL rounds aggregates to two decimals, including the zero fallback, keeping normalization in one layer.
- **Bounded, deterministic pages** — optional `Specification` filters compose with `Pageable`; `Page.map()` preserves metadata, and `withIdTiebreaker` appends `id` even when the client supplies its own sort.
- **Public sort vocabulary** — `SORT_KEYS` allows `date`, `hours`, `status`, `id`, `employee` and `project`; public names map to entity paths server-side, while unknown or sensitive paths receive `400`.

### Persistence & JPA

- **Soft delete** — users and projects retain their required relationships and historical hours; manager listings include inactive rows so reactivation stays reachable.
- **N+1 prevention** — lazy user/project relations are fetched explicitly for the entries page, with the fetch omitted from pagination's count query.
- **Entity identity and logging** — Lombok equality is restricted to `id`, and lazy relations stay out of `toString()`; service ownership checks compare ids rather than whole entity objects. Generated ids still make transient entities unsuitable as stable hashed keys.
- **Transactions** — service writes use `@Transactional` to keep their reads and writes in one boundary; pure reads declare `readOnly = true`.
- **Schema constraints** — mappings declare nullability and the DRAFT default, and creation timestamps are not updatable; existing databases needed explicit SQL repairs, so annotations are not treated as proof that a deployed schema migrated.
- **Uniqueness under concurrency** — `existsBy` provides a friendly pre-check, while `saveAndFlush` surfaces database constraint failures inside the translation to `DuplicateResourceException`; the project-name pre-check is case-insensitive, but its database unique constraint is not.
- **Delete the loaded entry** — after ownership and DRAFT checks, `delete(timeEntry)` reuses the entity already fetched and preserves the service's explicit not-found policy.
- **Flush before mapping generated values** — project creation flushes before reading `createdAt` into the response, so the `201` includes the insert-generated timestamp.
- **Canonical identifiers** — email normalization is shared by login, seeding and user writes; project names are trimmed, and a case-only rename is exempt from its own duplicate check.

### Security & auth

The [filter](timetrack/src/main/java/com/victor/timetrack/security/JwtFilter.java) authenticates the caller; the services decide which records that caller may act on. The measures above remain enforced even when the client hides forbidden actions.

<details>
<summary>Authorization, credential handling and account transitions</summary>

- **Externalized CORS** — configured origins bind to a `List<String>`; allowed methods and headers are explicit, and authentication uses a Bearer header rather than a cookie.
- **Credentials excluded from generated logs** — password/token fields use `@ToString.Exclude`, without changing the JSON fields the client must receive.
- **Caller identity in the login response** — `id` lets the UI recognize its own rows without decoding the token; the API still enforces self-review and self-deactivation rules.
- **Verified identity at issuance** — `AuthService` resolves the token subject from the authenticated principal, not directly from the submitted email.
- **Ownership concealment** — an entry mutation uses the same `404` for an absent and a non-owned id; manager self-review uses `403`, since managers already see the entry.
- **Archived-project concealment** — entry writes and project lookup agree on `404` for an unknown or concealed inactive project; an owner whose entry already references it receives the actionable inactive-project error.
- **Complete token failure handling** — `JwtFilter` catches both `JwtException` and `IllegalArgumentException`, so an empty Bearer value follows the authentication error path.
- **Expiring login throttles** — independent email/IP counters are checked before BCrypt; immutable counter values and atomic map operations handle concurrent requests without a permanent account lockout.
- **Immutable token subject** — tokens name `user.id`, so editing or reassigning an email cannot transfer an existing session to another account; the filter reloads current account status and authorities.
- **Endpoint authorization** — each endpoint has `@PreAuthorize`, including authenticated endpoints whose service scopes the response further.
- **Narrow public API route** — only `POST /api/auth/login` is public among application endpoints; future routes do not inherit a public auth-prefix wildcard.
- **Password-policy boundary** — the minimum length applies to the new password, not the current credential being verified; request length limits remain on both.
- **Self-target guards** — a manager cannot demote or deactivate their own account; a deactivated account is refused on its next authenticated request.
- **Role-scoped reports** — summary queries receive the employee's id or a manager's unrestricted scope from `AuthenticatedUserProvider`, never from client-selected identity.
- **Role changes respect the workflow** — promotion is refused while DRAFT or REJECTED entries still need employee-only actions; reactivation alone does not trigger that promotion check.

</details>

### Errors & validation

**GlobalExceptionHandler** — `@RestControllerAdvice` translates domain failures into one error shape; security entry points use that same contract. The [handler](timetrack/src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java) is the mapping authority.

```json
{ "timestamp": "...", "status": 400, "error": "Bad Request", "message": "Validation failed",
  "fieldErrors": { "hours": ["Must be at most 24"] } }
```

| Status | Meaning |
|---|---|
| 400 | Invalid fields, malformed input or a business/password rule failure |
| 401 | Missing/invalid authentication, wrong credentials or a disabled account |
| 403 | Role restriction or manager self-review |
| 404 | Missing resource or one the caller may not know exists |
| 409 | Invalid workflow state, duplicate value or database integrity conflict |
| 429 | Failed-login cooldown |
| 500 | Unexpected failure; fixed public message, details logged server-side |

- **Hours at two boundaries** — request constraints reject values outside 0.5–24 or with excess precision; `DECIMAL(4,2)` fixes storage scale, and the service retains its range check for non-HTTP callers.
- **All validation messages preserved** — `Map<String, List<String>>` groups violations by field rather than dropping every error after the first one.
- **Domain duplicates separated from DAO failures** — `DuplicateResourceException` carries safe field-specific text; raw integrity errors retain a generic message.
- **Field errors across statuses** — a duplicate can return `fieldErrors` with `409`, just as validation does with `400`; the Angular control does not need a status-specific mapping.
- **A password change must change the credential** — after verifying the current password, the service rejects a new one matching the stored hash and attaches the error to `newPassword`.
- **Resource guards before body-dependent lookups** — entry updates verify ownership and DRAFT status before resolving the proposed project, so a state conflict cannot be masked by an unrelated project error.

### Reports

- **Reconciled totals** — approved totals exclude DRAFT, SUBMITTED and REJECTED entries; `pendingHours` is separate, so summary and detail totals agree for the same month and scope.
- **Database aggregation** — JPQL `SUM`, `COUNT`, conditional expressions and interface projections avoid loading a month's entries as managed entities; `COALESCE` handles empty months.
- **Archived work stays counted** — project/user aggregates carry `active`, letting the client label history without dropping it.
- **Stable report ordering** — totals sort descending, then by name; user reports add `id` because display names are not unique.

---

## Tradeoffs

- JWT over server-side sessions — the API keeps no session store, so any instance can validate a request on its own; given up: a logout cannot revoke an issued token, which stays valid until it expires (deactivation is still enforced per request by `JwtFilter`)
- A 60-minute access token with no refresh token over the original 24-hour token — a token stolen from the browser is usable for an hour instead of a day; given up: a session idle past 60 minutes ends in a fresh login instead of renewing silently, and a refresh-token flow is out of scope for this MVP
- Soft delete over hard delete for users and projects — `TimeEntry` holds not-null foreign keys with no cascade, and timesheet history must survive a person leaving; given up: a deactivated account keeps its email taken, and every listing has to decide whether inactive rows belong in it
- Unchecked exceptions over checked ones — a service throws its own domain exception with no `throws` clause through every layer, and `GlobalExceptionHandler` maps each type to one status in one place; given up: the compiler no longer forces a caller to handle a failure, so an exception type with no handler falls through to the generic `500`
- A voluntary password change over a forced change on first login — enforcing a `mustChangePassword` flag needs the frontend to intercept every route until the change happens, cut for the MVP; given up: a new account can keep its generated password indefinitely, changed only when its owner chooses to through `PATCH /api/users/me/password`
- An administrator's reset over a self-service reset flow — a self-service reset needs an email channel to deliver a single-use token, which is out of scope, so a manager issues a fresh generated password from `POST /api/users/{id}/password-reset`, returned once and stored only as its hash; given up: a member who forgets their password depends on a manager, and recreating the account is no way back, since the email check counts deactivated accounts
- List-and-dialog editing over a `GET /{id}` for entries and users — the UI is tables and dialogs with no detail route, so an edit dialog opens from a row the page already holds; given up: no shareable URL for one entry and an edit that starts from the list's snapshot rather than the current row, acceptable because only an entry's owner or a manager can edit it and the list is refetched after every write
- Return-all over `Pageable` on `GET /api/users` — headcount is tens of rows, and the team table, the dashboard count and the approvals employee filter each need the whole list to be correct; given up: the full list crosses the wire on every call, which becomes a real cost only when a single company's user table reaches the thousands
- In-memory login throttling over a shared store — the failure counters live in one `ConcurrentHashMap` in the running process, with no Redis, no table and no new dependency, sufficient for the single-instance deployment this project runs; given up: the counters reset on restart, and two instances behind a load balancer would each grant an attacker the full budget
- `ddl-auto=update` over Flyway migrations — one developer and a schema still evolving with the plan; given up: a reviewable schema history, and every change `update` cannot make — a drop, a rename, a not-null on a populated column — is applied by hand with `ALTER TABLE` on each database, which is also why the app's role owns its database instead of holding DML privileges alone
- Credential rotation over history rewriting — two secrets reached pushed history early in the project (a datasource password and a seed account's BCrypt hash); both were rotated and the published values are treated as compromised, while a `filter-repo` rewrite would change every later commit hash and break the references the project's backlog and plan cite; given up: the burned values stay readable in history for good
- A compose init script over the image's own `POSTGRES_USER` — the official PostgreSQL image makes the user it is given a superuser, so handing it `timetrack_app` would quietly drop the least-privilege role inside Docker; instead the image's superuser runs once, on the first start of an empty volume, to create `timetrack_app` and the database it owns; given up: the script no longer runs once the volume holds data, so a changed script means recreating the volume
- A SQL-created role on the hosted database over one made in the provider's console — Neon makes every console-created role a member of `neon_superuser` (`CREATEROLE`, `BYPASSRLS`, read and write on all data) without setting `rolsuper`, so `timetrack_app` is created with `CREATE ROLE` and verified by its memberships rather than by that flag; given up: the one-click console path, replaced by SQL run by hand, including the `GRANT timetrack_app TO neondb_owner` that `CREATE DATABASE … OWNER` needs on PostgreSQL 16+

---

## How to run alone

**Requirements:** Java 25 and PostgreSQL running locally. In pgAdmin's Query Tool, connected as
`postgres`, create the `timetrack` database and the role the app connects as — the app itself never
connects as `postgres`, PostgreSQL's superuser:

```sql
CREATE ROLE timetrack_app WITH LOGIN PASSWORD 'the value of DB_PASSWORD';
CREATE DATABASE timetrack OWNER timetrack_app;
```

`spring.jpa.hibernate.ddl-auto=update` creates the tables on first boot, which is why the role owns the
database rather than holding read/write privileges alone.

### Environment variables

Three properties in `src/main/resources/` are declared as `${...}` placeholders with **no default**, so
the application context fails to start if they are missing — a secret with a fallback value is a secret
published in git, which is the whole point of leaving them unresolvable.

| Variable | Read from | Required | What it is |
|---|---|---|---|
| `DB_PASSWORD` | `application.properties` → `spring.datasource.password` | Always | Password of the `timetrack_app` PostgreSQL role |
| `JWT_SECRET` | `application.properties` → `app.jwt.secret` | Always | HMAC signing key for access tokens, decoded as Base64 — at least 32 random bytes once decoded (`openssl rand 64 \| openssl base64 -A`); a value that is not valid Base64 fails at the first login with a 500. Treat it as a credential |
| `ADMIN_PASSWORD` | `application-dev.properties` → `app.admin.password` | With the `dev` profile only | Plain-text password of the seeded first manager, hashed with BCrypt at startup and never stored in git |

Miss `JWT_SECRET` and startup ends in `Could not resolve placeholder 'app.jwt.secret'`.

Two further datasource properties are placeholders **with** a local default, so they are optional. They
are externalised for a different reason than the three above: not secrecy — a hostname is not a secret —
but so the same build runs against another host. The compose file sets `DB_URL` to its `db`
service, and the hosted deployment sets it to the managed database — both through these placeholders,
with no per-environment profile or properties file.

| Variable | Read from | Default | What it is |
|---|---|---|---|
| `DB_URL` | `application.properties` → `spring.datasource.url` | `jdbc:postgresql://localhost:5432/timetrack` | JDBC URL of the database |
| `DB_USERNAME` | `application.properties` → `spring.datasource.username` | `timetrack_app` | Role the app connects as — a non-superuser owning the `timetrack` database and nothing else on the server |

### First manager account

`SPRING_PROFILES_ACTIVE=dev`

The API has no public register endpoint, so the first manager account has to already exist before anyone
can log in. It is created by `config/DataInitializer`, a `CommandLineRunner` annotated `@Profile("dev")`:
on a fresh database without that profile, no manager is seeded and there is no account to log in with. An existing database keeps its accounts without seeding. The profile also loads
`application-dev.properties`, which is where `app.admin.*` and `spring.jpa.show-sql` live — which is why
`ADMIN_PASSWORD` is only read when it is active.

The runner is idempotent: an `existsByEmail(...)` guard makes every boot after the first a no-op.

Seeded account — log in with these at `POST /api/auth/login`:

| Field | Value |
|---|---|
| Email | `manager@timetrack.com` |
| Password | whatever you set in `ADMIN_PASSWORD` |
| Role | `MANAGER` |

### Run it

In IntelliJ: Run → Edit Configurations → *Environment variables*, add the three variables above, and set
*Active profiles* to `dev` (or add `SPRING_PROFILES_ACTIVE=dev` as a fourth variable).

Open `projects/07-timetrack/backend/timetrack/` and run `TimetrackApplication.java`.

From a terminal, without IntelliJ:

```bash
cd projects/07-timetrack/backend/timetrack
export DB_PASSWORD=... JWT_SECRET=... ADMIN_PASSWORD=...
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

API available at `http://localhost:8080`

---

## Tests

The DTO validation tests use JUnit 5 + AssertJ; the service tests are planned as plain JUnit 5 + Mockito unit tests, with no Spring context and no database. `TimetrackApplicationTests.contextLoads()` is the generated check that the Spring context starts.

- `ValidationMessagesTest` — the request DTOs' Bean Validation messages come from
  `ValidationMessages.properties` as capitalised sentences, every violation on a field is reported, and a
  maximum-only `@Size` names its maximum
- `TimeEntryServiceTest` *(planned)* — the workflow's status guards on create/update/submit/reopen/approve/reject, and the project-existence and ownership `404`s
- `UserServiceTest` *(planned)* — the promotion/demotion/deactivation transition guards, the self-target `409`, and the password change/reset rules
- `ProjectServiceTest` *(planned)* — duplicate-name refusal and the case-insensitive rename that exempts a project's own current name
- `AuthServiceTest` *(planned)* — login's success and failure paths, including the throttling keys and the reset on a successful login
- `ReportServiceTest` *(planned)* — the summary's approved hours reconciling with the by-project total, and empty-month zeros
- `LoginAttemptServiceTest` *(planned)* — the block threshold and the independence between two keys
- `UserDetailsServiceImplTest` *(planned)* — the inactive-user `isEnabled() == false` mapping that backs per-request revocation
