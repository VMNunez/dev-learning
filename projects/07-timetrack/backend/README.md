# TimeTrack — Backend

Spring Boot REST API behind TimeTrack: JWT authentication, two roles, and the
DRAFT → SUBMITTED → APPROVED / REJECTED workflow, over PostgreSQL. Java 25, Spring Boot 4, Spring
Security, Spring Data JPA. Project overview and live demo: [../README.md](../README.md).

---

## API endpoints

| Method | URL | Role | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Checks email and password and returns a JWT plus the caller's id, name and role; `429` after five failures |
| GET | `/api/users` | MANAGER | Every account, active and deactivated — active first, then by name |
| POST | `/api/users` | MANAGER | Creates an account and returns its generated password, once |
| PUT | `/api/users/{id}` | MANAGER | Updates name, email, role or the `active` flag |
| PATCH | `/api/users/me/password` | EMPLOYEE, MANAGER | Changes the caller's own password after verifying the current one |
| POST | `/api/users/{id}/password-reset` | MANAGER | Generates a new password for another account and returns it, once |
| DELETE | `/api/users/{id}` | MANAGER | Deactivates an account (soft delete) |
| GET | `/api/projects` | EMPLOYEE, MANAGER | Projects by name — active ones for an employee, all for a manager |
| GET | `/api/projects/{id}` | EMPLOYEE, MANAGER | One project; an inactive one is `404` for an employee |
| POST | `/api/projects` | MANAGER | Creates a project |
| PUT | `/api/projects/{id}` | MANAGER | Updates name, description or the `active` flag |
| DELETE | `/api/projects/{id}` | MANAGER | Deactivates a project (soft delete) |
| GET | `/api/entries` | EMPLOYEE, MANAGER | Paged entries — the caller's own for an employee, everyone's for a manager; optional `month`, `projectId`, `status` and (manager only) `userId` filters |
| POST | `/api/entries` | EMPLOYEE | Logs an entry in `DRAFT` |
| PUT | `/api/entries/{id}` | EMPLOYEE | Replaces an own `DRAFT` entry |
| DELETE | `/api/entries/{id}` | EMPLOYEE | Deletes an own `DRAFT` entry (hard delete — a draft has no history) |
| PATCH | `/api/entries/{id}/submit` | EMPLOYEE | `DRAFT → SUBMITTED` |
| PATCH | `/api/entries/{id}/reopen` | EMPLOYEE | `REJECTED → DRAFT`, so the entry can be corrected and resubmitted |
| PATCH | `/api/entries/{id}/approve` | MANAGER | `SUBMITTED → APPROVED`; refused on the manager's own entry |
| PATCH | `/api/entries/{id}/reject` | MANAGER | `SUBMITTED → REJECTED` with a mandatory note; refused on the manager's own entry |
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

### Architecture & dependency injection

#### Layered architecture

Controller → Service → Repository. Each layer only calls the one directly below it. Controllers never call repositories directly.

```
@RestController          ← receives HTTP request, calls service, returns ResponseEntity
      ↓
@Service                 ← business logic, validation, maps entity ↔ DTO
      ↓
JpaRepository            ← reads and writes data, no logic
```

#### Constructor injection

Every bean receives its collaborators through a single constructor — there is no `@Autowired` field anywhere, so Spring wires them without an annotation and each class states its whole dependency list in one signature. Required configuration is injected the same way and there is no `@Value` field either — `DataInitializer` takes its `app.admin.*` seed values, `JwtUtil` its signing secret and expiry, and `SecurityConfig` its allowed origins, all as `@Value` constructor parameters rather than fields: values injected after construction leave the bean constructible in a state where one of its methods would read a null — the runner saving a user with a null email, `JwtUtil` signing with a null key — and parameters are what let those fields be `final`.

### DTO & API contract

#### DTO boundary

Entities never leave the service layer. Every endpoint receives a request DTO and returns a response DTO. This controls exactly what the API exposes — password hashes, internal IDs and lazy-loaded relationships never reach the client.

```java
// Entity → DTO mapping in one private method, reused across all service methods
private ProjectResponse toResponse(Project project) {
    ProjectResponse response = new ProjectResponse();
    response.setId(project.getId());
    response.setName(project.getName());
    response.setDescription(project.getDescription());
    response.setActive(project.isActive());
    response.setCreatedAt(project.getCreatedAt());
    return response;
}
```

#### Create/Update DTO pair

Every resource (`Project`, `TimeEntry`) has a separate `Create*Request` and `Update*Request`, even where their fields are identical today — the two operations represent distinct intents, and an update-only field (like reactivating a soft-deleted record) can be added to one without touching the creation contract.

#### Status codes are named, and a `201` says where

Every controller returns its status through a factory — `ok`, `created`, `noContent` — instead of `ResponseEntity.status(200)`, so the status is a checked constant rather than an `int` the compiler cannot validate. The three `POST` endpoints go through `created(location)`, whose URI is built with `ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")`: the response carries a `Location` header naming the new resource, so the client never has to assemble that URL from its own copy of the route scheme.

#### A page is serialised as a DTO, not as Spring Data's `PageImpl`

`@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)` makes pages leave as `PagedModel` — `content` plus a four-field `page` — instead of Jackson reflecting over `PageImpl` and emitting its eleven internal getters. `PageImpl` is a dependency's implementation class, so serialising it directly puts the payload's shape outside this project's control: a Spring Data upgrade could rename a getter and change the API without a line of code changing. It is the same boundary the DTO pattern already draws around entities, applied to the envelope rather than the items. The annotation carries a cost worth knowing: `@Enable*` makes Boot's matching autoconfiguration back off, which silently dropped `spring.data.web.pageable.max-page-size` and let the cap fall back to Spring Data's 2000 — hence the customizer bean below.

#### A response carries the identifier of every relation, not only its label

`TimeEntryResponse` returns `projectId` and `userId` beside `projectName` and `userName`. The response is the only representation a client ever holds — there is no `GET /api/entries/{id}` — and `PUT /api/entries/{id}` takes a `projectId`, so a response carrying the name alone forces the edit dialog to re-derive the key by matching the label against the projects list, a lookup that is only correct while `Project.name` stays unique and that silently edits the wrong row when it stops being. Minimal disclosure is a rule about sensitive fields, not about keys the caller has to send back.

#### A nullable field means "omitted" in a request and nothing at all in a response

`UpdateProjectRequest.active` is a `Boolean` on purpose: `PUT /api/projects/{id}` is a partial update, so `null` is the caller saying "leave this one alone" and the service applies the flag only when it is present. `ProjectResponse.active` is a primitive `boolean` for the opposite reason — `Project.active` is primitive and `NOT NULL`, so a wrapper there would let the API serialise `"active": null`, a state the schema cannot produce, and any client unboxing it would get a `NullPointerException` instead of a value. The same wrapper is correct on one side of the boundary and wrong on the other, because absence carries meaning going in and none coming out.

#### The decimal scale of a number is part of the response contract

The three report queries round their aggregate in the query — `round(SUM(te.hours), 2)`, and `round(COALESCE(SUM(...), 0), 2)` in the summary, where the fallback carries its own scale and a month with no entries would otherwise answer `0` instead of the `0.00` the contract promises. `ReportService` no longer re-applies `setScale(2)`: the rule had two owners, so `summary` was normalised in Java while `by-project` and `by-user` served whatever the driver returned, and a card reading `40.00` beside a table reading `40.0` shows one figure as two with nothing in the code saying they must agree. Only PostgreSQL's own scale propagation kept them equal, which is a property of the engine rather than a contract of the API.

#### `GET /api/entries` is paged, and a paged endpoint owes a total order

`@PageableDefault` binds `?page`, `?size` and `?sort` into a `Pageable`, and `JpaSpecificationExecutor.findAll(spec, pageable)` applies it on top of the dynamic `Specification` filters — the filters and the page compose, so no query was rewritten to gain pagination. `Page.map()` converts to `TimeEntryResponse` while keeping the metadata. Two parts are decisions rather than defaults: the sort is `date` desc with `id` desc as a unique tie-breaker, because without a unique key after a non-unique column two entries on the same day can swap between calls and a row is served twice or never; and the page size is capped at 100 through a `PageableHandlerMethodArgumentResolverCustomizer` bean, because an endpoint that honours any requested size is not bounded at all. The tie-breaker is re-applied rather than assumed: `@PageableDefault` is a default, not a floor, so a client-supplied `?sort=hours,asc` replaces it entirely and leaves a non-unique column with nothing behind it. `TimeEntryController.withIdTiebreaker` appends `id` as the last `Sort.Order` unless the caller already named it, rebuilding the `Pageable` because `Pageable` and `Sort` are immutable — the API owns the totality of the order, not the caller. Entries is the only collection here paged — it grows with every imputation, every user and every month, while users and projects are bounded by headcount and by the catalogue.

#### The client chooses the sort key from an allow-list, never from the entity

`TimeEntryController.toEntitySort` looks every `Sort.Order` in the bound `Pageable` up in `SORT_KEYS` — `date`, `hours`, `status`, `id`, `employee`, `project` — and rejects anything else with `400` through `BusinessRuleViolationException`. A key is a public name, not a path: `employee` is translated to `user.name` on the server, so the Approvals queue sorts by person while `?sort=user.name` itself is still refused. `?sort=` is bound straight into a persistence query, so it is untrusted input with the reach of a column name: an unknown property made Spring Data throw `PropertyReferenceException`, which reached the `RuntimeException` handler as a `500` plus a stack trace for a client typo, and a nested path resolves too — `?sort=user.password,asc` ordered the page by the BCrypt hash, a value the response never returns but whose ordering can be observed. A block-list would have to name every sensitive column the entity graph can reach; the allow-list makes every field added later unsortable until it is chosen.

### Persistence & JPA

#### Soft delete

`DELETE /api/projects/{id}` sets `active = false` — no data is permanently removed. Inactive projects cannot receive new time entries, but all historical data remains queryable.

The list endpoint is part of the pattern, not separate from it: `GET /api/users` returns deactivated accounts alongside active ones, each carrying its `active` flag. Reactivation is only reachable through `PUT /api/users/{id}`, so a list that filtered out inactive rows would strand every account it hid — with soft delete, hiding a row from the collection is the same as deleting it.

#### N+1 prevention on `GET /api/entries`

`TimeEntry.user` and `TimeEntry.project` are `@ManyToOne(fetch = FetchType.LAZY)` — `@ManyToOne` defaults to `EAGER`, which would trigger one extra query per relationship per row (1 query for the list + up to 2N extra queries). `TimeEntrySpecifications.fetchUserAndProject()` adds an explicit `LEFT JOIN FETCH` on both relationships so the listing endpoint loads entries, users and projects in a single query. The fetch is skipped when `query.getResultType()` is `Long` (the pagination count query), since a fetch join is invalid there.

#### `equals`/`hashCode`/`toString` on JPA entities

`User`, `Project` and `TimeEntry` use `@Getter`/`@Setter` instead of Lombok's `@Data`. `@Data` generates `equals`/`hashCode` over every field, including the database-generated `id` — but an entity's `id` is `null` until it is persisted, so an entity placed in a `HashSet`/`HashMap` before saving becomes unreachable in that collection once Hibernate assigns its `id` (the object's hash code changes after insertion). `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` + `@EqualsAndHashCode.Include` on `id` makes identity depend only on the database key. `TimeEntry` also adds `@ToString(exclude = {"user", "project"})`: both are `@ManyToOne(fetch = FetchType.LAZY)`, and a generated `toString()` that includes them would trigger a lazy load — safe only inside an open transaction, and throwing `LazyInitializationException` otherwise (e.g. from a log call after the request completes).

#### Transactional boundaries

Every service method is explicitly `@Transactional` (writes) or `@Transactional(readOnly = true)` (reads). Without it, each repository call runs as its own auto-commit transaction — a read-then-write method like `update` or `submit` would have no atomic boundary between the `find` and the `save`. `readOnly = true` also lets Hibernate skip dirty-checking on methods that never mutate an entity.

#### The column contract belongs to the schema, and `ddl-auto=update` only writes it once

Every column the schema declares as not null now says so on the mapping, and `TimeEntry.status` carries `@ColumnDefault("'DRAFT'")` so the default survives an insert that never passes through Java. The mapping alone was not enough: `ddl-auto=update` **adds** tables and columns and never alters an existing one, so an annotation added after a column was born is intent the schema never received — `time_entries.status` was still nullable in the database while `@Column(nullable = false)` had been on the field. Bringing the schema up to the contract was a manual `ALTER TABLE` per column, and the not-null on `users.created_at` needed the rows that predated the column backfilled first, because a constraint is validated against the data already stored. The three `createdAt` fields add `updatable = false`, which keeps them out of the generated `UPDATE` entirely: a creation time is written once, at the insert, and no later change to the entity can move it.

#### A uniqueness rule is enforced by the constraint and only explained by the check

`ProjectService` and `UserService` keep their `existsBy` check *and* wrap `saveAndFlush` in a `catch (DataIntegrityViolationException)` that rethrows the same `DuplicateResourceException`. The two are not redundant: a `SELECT` and an `INSERT` are two statements, so two requests can both read "absent" before either writes, and only the unique index decides that atomically. The check is what makes the common refusal legible — it is case-insensitive on `name`, which the index is not, and it costs no failed write. What the catch buys is that the rare path answers with the same contract as the common one, `fieldErrors.name` included, instead of the generic 409 a reactive form cannot place under an input. `saveAndFlush` is load-bearing here rather than stylistic: `save` stages the statement and the violation would surface at the commit flush, outside the `try`.

#### A repository is asked for the entity, or told to delete it, never both

`TimeEntryService.delete` already loads the entry to check ownership and refuse a non-`DRAFT` status, so it hands that instance to `delete(timeEntry)`. `deleteById(id)` is implemented as `findById(id).ifPresent(this::delete)` — it would ask for the same row a second time and, worse, absorb an absent id silently, applying a different not-found policy than the guard three lines above it, which answers `404`.

#### A response that carries a generated value has to wait for the flush

`ProjectService.create` calls `saveAndFlush`, because `createdAt` does not exist until the `INSERT` runs. With a sequence-backed `@GeneratedValue`, `save()` only stages the row — the statement, and the `@CreationTimestamp` it generates, land at the commit flush, which is after `toResponse(saved)` has already read the field. The `201` therefore serialised `"createdAt": null` for a row that had one. `update` now calls it too, for the unrelated reason above: a constraint violation has to surface inside the `try` that translates it.

#### Identifiers are canonicalised before they are compared or stored

`EmailNormalizer.normalize` trims and lower-cases an email at the service boundary, and the same value feeds both the duplicate check and the setter, in `UserService.create`/`update`, `UserDetailsServiceImpl` and `DataInitializer`. Project names take the parallel rule: `ProjectService` trims and asks `existsByNameIgnoreCase`, and `update` uses `equalsIgnoreCase` to decide whether the name changed at all, so re-capitalising a project is not a duplicate of itself. Comparing one form while persisting another is what lets `Ana@corp.com` and `ana@corp.com` become two logins for one person, and the by-project report split one project's hours across two rows.

### Security & auth

#### Externalized CORS configuration

The allowed origins are loaded from `app.cors.allowed-origins` via `@Value` into a `List<String>`, not hardcoded in `SecurityConfig` — an environment-specific value stays outside compiled code, and the typed target is what lets one comma-separated property carry several origins. The policy is minimal by design: only the methods the API exposes and the two headers the client sends (`Authorization`, `Content-Type`), never a wildcard. `allowCredentials(false)` because auth travels in the `Authorization` header, not cookies, so credentialed CORS is unnecessary and only forces the stricter same-exact-origin matching for no benefit.

#### Credentials excluded from generated `toString()`

`LoginRequest` keeps `@Data` but adds `@ToString.Exclude` on `password`: `@Data`'s generated `toString()` otherwise includes every field, so the plaintext password would land in any future request-logging or framework body-dump call. No logger stringifies the request today, but the fix is one annotation and closes the gap before it becomes exploitable. `AuthResponse.token` carries the same annotation for the same reason on the way out: the field holds a live 60-minute bearer credential, and a `toString()` that includes it would put a usable session in the logs. Neither annotation touches the JSON — Jackson serialises from the getters, so the token still reaches the client.

#### The login response identifies the caller

`AuthResponse` carries `id` beside `token`, `name` and `role`. It discloses nothing the client does not already hold — the same value is the token's `sub` claim, in the same response body. What it buys is the only way the browser can recognise its own rows without parsing the JWT, and a name cannot do it, because two users may share one (which is why `by-user` appends `id` to its own sort). Two business rules need that: the entries a manager may **not** review under segregation of duties, and the account they may **not** demote or deactivate. The API enforces both regardless and answers `403` / `409` whatever the client draws; the field only lets the UI stop offering an action that cannot succeed.

#### JWT subject taken from the verified `Authentication`, not the request body

`AuthService.login` uses `authentication.getName()` — the value `AuthenticationManager.authenticate(...)` returns after checking the credentials — to look up the user whose id becomes the token's subject, never `request.getEmail()` directly. Both resolve to the same account today (`findByEmail` is an exact match), but reaching the identity through unvalidated input rather than the verified one is the habit that becomes exploitable the moment lookup logic changes.

#### A non-owned entry is `404`, not `403`

`TimeEntryService.findOwnedEntry(id, user)` chains `findById(id)` → `Optional.filter` (the ownership test) → `orElseThrow`, so "this id does not exist" and "this id is not yours" leave through the same throw with the same message. Returning 403 for the second case would make the status code an enumeration oracle: an EMPLOYEE could probe ids on `submit`/`update`/`reopen`/`delete` and learn which entries exist across the whole table without reading one. `approve`/`reject` keep their 403 (`ForbiddenOperationException`) because that refusal is segregation of duties, not ownership — a MANAGER already sees every entry, so the status discloses nothing they could not read from the listing.

#### An archived project is hidden on every door that accepts its id

`GET /api/projects/{id}` answers 404 for an inactive project when the caller is an EMPLOYEE; without a shared rule, `POST`/`PUT /api/entries` would answer 400 "Project is not active" for the same project and 404 for an unknown one — handing back exactly what the projects endpoint conceals. `TimeEntryService.resolveProject(projectId, callerKnowsItExists)` now holds the rule in one place: an inactive project throws the same 404 with the same message an unknown id gets, unless the caller is already entitled to know it exists, which is true only when the id is the one their own entry already carries — those get the 400 that tells them why the edit failed. A concealment decision is only as strong as the most talkative endpoint that accepts the identifier.

#### The token catch covers the library's whole failure surface

`JwtFilter` catches `IllegalArgumentException` beside `JwtException`, because jjwt signals an absent, empty, or blank compact token with the former — a type unrelated to its own exception family. `Authorization: Bearer ` with nothing after the space reaches `substring(7)` as `""`, which without this catch would escape the filter above `ExceptionTranslationFilter` and let an anonymous caller receive the container's `/error` body with `500` instead of the uniform `401` `ErrorResponse` that `JwtAuthenticationEntryPoint` writes. A filter that reads a credential fails closed on every parse failure, whatever type the library uses to report it.

#### Failed logins are bounded by account and by network, and the bound expires on its own

`LoginAttemptService` keeps a per-key failure counter and `AuthService` consults it *before* `authenticationManager.authenticate`, so a refused attempt never reaches BCrypt — five failures answer `429` through the same `@RestControllerAdvice` as every other error, for one minute measured from the last failure. Two keys are counted independently, the email as `EmailNormalizer` canonicalises it and `getRemoteAddr()`, because a per-account bound alone lets one common password be sprayed across every account without a single counter moving, and a per-IP bound alone puts a whole NAT'd office on one budget. The window lifting itself is the design, not a shortcut: a permanent lockout is the easier rule and the wrong one, since it hands an attacker a way to lock out any account they can name. The counter's value is an immutable `record` replaced through `compute` and a two-argument `remove`, because a servlet container touches this one bean from every request thread at once and a read-modify-write spread over three statements drops failures under exactly the load that matters.

#### The token names the account by an identifier the account cannot lose

`JwtUtil` writes `user.id` into the `sub` claim and `JwtFilter` resolves the principal through `UserDetailsServiceImpl.loadUserById`; `loadUserByUsername` stays for `DaoAuthenticationProvider`, which keys the login on the submitted email. The subject used to be that email, which `PUT /api/users/{id}` deliberately keeps editable — so a still-valid 60-minute token whose subject was later reassigned to another account resolved to *that* account and inherited its authorities: a vertical escalation with no forged signature and no stolen credential. A surrogate key is the only identifier a mutation cannot hand to somebody else. Tokens issued in the old format expire on their own, because `Long.valueOf` rejects an email-shaped subject with `NumberFormatException` and the filter's catch already covered that as an `IllegalArgumentException`.

#### Every endpoint declares its own authorization rule

The five any-authenticated endpoints — `GET /api/projects`, `GET /api/projects/{id}`, `GET /api/entries`, `PATCH /api/users/me/password` and `GET /api/reports/summary` — carry `@PreAuthorize("isAuthenticated()")` rather than resting on `SecurityConfig`'s `anyRequest().authenticated()`. The two enforcement points are independent: the chain is a perimeter defined by URL, the annotation is the method's own contract. A matcher later widened for a demo opens the perimeter without the controller changing a line, so the rule that survives that edit is the one written beside the method — and the one a reviewer sees in the diff. It also removes the ambiguity a partial convention creates, where an unannotated method cannot be told apart from a forgotten one.

#### The public rule names a method and a path, not a prefix

`SecurityConfig`'s only `permitAll` is `requestMatchers(HttpMethod.POST, "/api/auth/login")` — a method and an exact path, never a prefix like `"/api/auth/**"`, which would authorise endpoints that do not exist yet: a `POST /api/auth/register` or a `POST /api/auth/reset-password` added later to `AuthController` would be born public, with nothing in that diff to prompt a security review. The exception a login endpoint needs is one verb on one path, so that is what the rule states — anything else added to the controller falls through to `anyRequest().authenticated()`, which is the failure direction that costs nothing. A side effect worth having: `GET /api/auth/login` now answers `401` through the entry point instead of leaking a `405` from outside the perimeter.

#### A password policy constrains the new password, never the one being verified

`ChangePasswordRequest.currentPassword` carries `@NotBlank` and `@Size(max = 72)`; the 8-character floor sits on `newPassword` alone. `@Valid` runs in the argument resolver, before the controller method exists, so a policy floor on the current password rejects the request before `passwordEncoder.matches` is ever reached — and it is a rule about what the system will now accept applied to a value created under whatever policy existed then. Any account whose stored password is shorter than the current floor could never change it, the `dev` seed admin among them, since `ADMIN_PASSWORD` has no length requirement. The surviving `max = 72` is not policy but BCrypt's own input bound, counted in bytes: the algorithm processes only that prefix, so a longer value cannot be correct and never needs hashing. Both fields also carry `@ToString.Exclude`, for the reason the credentials entry above gives.

#### An admin operation refuses the caller as its own target

`UserService.update` and `delete` refuse a demotion or a deactivation whose target id is the caller's own, with `409`. Both endpoints are `hasRole('MANAGER')`, so the only route back from either — `PUT /api/users/{id}` — needs the privilege the call is removing, and `JwtFilter` runs the loaded `UserDetails` through an `AccountStatusUserDetailsChecker`, so a deactivated manager loses their still-valid token on the very next request. The Team page draws edit and deactivate on every row including the caller's, so without the guard this is one misclick. The system-wide invariant — at least one active MANAGER always remains — needs no code of its own: it follows from the caller always being an active MANAGER and never being their own target.

#### A role can scope a response instead of refusing it

`GET /api/reports/summary` serves both roles, so the role is not the gate: `@PreAuthorize("isAuthenticated()")` states that the check lives further in, and the summary query carries a `(:userId IS NULL OR te.user.id = :userId)` predicate — `null` for a manager, the caller's own id for an employee, so the null argument neutralises the filter instead of branching the query. One query, one code path, and the three aggregates scope themselves because they are computed over that one predicate. The identity comes from `AuthenticatedUserProvider`, never from a request parameter. `by-project` and `by-user` keep `hasRole('MANAGER')`, so the contrast between the two kinds of authorisation is visible in one screen of the controller.

#### A role change is a workflow transition too

`PUT /api/users/{id}` refuses a promotion to MANAGER with `409` while the user still holds `DRAFT` or `REJECTED` entries. `submit` and `reopen` are `hasRole('EMPLOYEE')` and resolve ownership from the JWT, so those rows would become unreachable by every actor in the system — invisible to reports and to the approvals queue, but still listed to their owner. The state machine's transitions are gated on the actor's role, which makes the role mutable input to it, so the point where the role changes is where that assumption is guarded. Narrow by construction: the check runs only when the role actually changes to MANAGER, leaving reactivation through the same endpoint untouched.

### Errors & validation

#### GlobalExceptionHandler

`@RestControllerAdvice` maps every exception type to one status and one body, so the Angular client parses a single shape for every failure instead of Spring's default error page, and a service signals a refusal by throwing its own domain exception rather than building a response:

```json
{ "timestamp": "...", "status": 400, "error": "Bad Request", "message": "Validation failed",
  "fieldErrors": { "hours": ["Must be at most 24"] } }
```

| Exception | Status | Meaning |
|---|---|---|
| `MethodArgumentNotValidException`, `BusinessRuleViolationException`, `InvalidPasswordException`, a malformed body or parameter | 400 | The input breaks a rule (field constraint, future date, hours range, wrong current password) or cannot be read |
| `BadCredentialsException`, `DisabledException` | 401 | Wrong credentials or a deactivated account |
| `AccessDeniedException`, `ForbiddenOperationException` | 403 | The role does not allow it, or segregation of duties on approve/reject |
| `ResourceNotFoundException` | 404 | Unknown id — or one the caller may not know exists |
| `InvalidStateTransitionException`, `DuplicateResourceException`, `DataIntegrityViolationException` | 409 | The entity is in the wrong state, or the value is taken |
| `TooManyAttemptsException` | 429 | Inside the failed-login cooldown |
| any other `RuntimeException` | 500 | Fixed message, stack trace logged server-side only |

`fieldErrors` appears on any failure that belongs to one input, whatever its status, which is what lets a reactive form place a message under the control that caused it.

#### Two-layer validation on `hours`

`TimeEntry.hours` is constrained at both ends, deliberately kept as two layers rather than one: `@Column(precision = 4, scale = 2)` on the entity guarantees the DB never stores more precision than the field is meant to hold, and `@DecimalMin("0.5")` / `@DecimalMax("24")` / `@Digits(integer = 2, fraction = 2)` on `CreateTimeEntryRequest` reject an out-of-range or over-precise value at the HTTP boundary with a 400, before it ever reaches the service. `TimeEntryService` also keeps its own manual 0.5–24 check — redundant with the DTO validation for HTTP requests, but it protects the business rule for any future non-HTTP caller of the service.

#### Every validation violation reaches the client

`fieldErrors` is a `Map<String, List<String>>`, collected with `Collectors.groupingBy` + `Collectors.mapping`. `Collectors.toMap` needs a merge function to resolve duplicate keys, and `(existing, replacement) -> existing` would silently drop the second violation whenever one field failed two constraints at once — `email` both over `@Size(max = 255)` and failing `@Email` would then reach the client as a single message. Bean Validation evaluates every constraint; `groupingBy`/`mapping` is what keeps the collection step from throwing a result away.

#### `DuplicateResourceException` — a business signal, not a DAO exception

A duplicate email or project name is refused by `DuplicateResourceException`, thrown by `UserService` and `ProjectService` before the `save`. It previously reused Spring's `DataIntegrityViolationException`, which belongs to the `DataAccessException` family `@Repository` translates persistence failures into — a claim that the database rejected the write, made at a point where the database had not been asked. The handler for it stays, because an index the services do not pre-check can still be breached for real, and it keeps returning a fixed message: that message is written by Hibernate and names the constraint and the statement. Splitting the types is what lets the domain handler return `e.getMessage()`, so "Email already in use" and "A project with this name already exists" reach the client instead of one generic 409.

#### `fieldErrors` is a per-control channel, not a validation-only one

`DuplicateResourceException` carries the offending field name (`email`, `name`) alongside its message, so its handler emits `fieldErrors` on a **409** exactly as `MethodArgumentNotValidException` does on a 400. The alternative — reserving the map for `@Valid` failures — would make a reactive form branch on the status to decide whether a message belongs under an input or at the dialog foot, and would leave the most common error in the Team dialog detached from the field that caused it. The status says what kind of failure it is; the map says which control owns it. The field travels in the exception rather than being hardcoded in the handler because the same type is thrown from two resources.

#### A password change has to change the password

`UserService.changePassword` refuses a `newPassword` that `passwordEncoder.matches` the stored hash, with a 400 carrying `fieldErrors.newPassword`. Re-encoding the same value writes a different hash and would answer `204`, so a user rotating a credential they believe is compromised gets a confirmation that nothing about their access changed. The check runs *after* the current-password check, never before: reversed, it would tell an unauthenticated caller whether a guessed value is the account's password. `InvalidPasswordException` carries the field so the same handler serves both refusals — the type fixes the status, the field fixes the input the message lands under.

#### A refusal about the resource is decided before a refusal about the body

`TimeEntryService.update` evaluates its DRAFT guard immediately after `findOwnedEntry`, before `resolveProject` reads the requested `projectId` — the order `submit`, `reopen` and `delete` already used. Reversed, a `PUT` on a non-DRAFT entry carrying an unknown project answered `404 "Project not found"` where the API contract documents `409`, so the status a refusal produced depended on what the client happened to send and the caller corrected the wrong thing before seeing the real one. A guard on the loaded entity returns the same verdict whatever the body contains; one on the body does not, so the first is what makes the documented refusal the one the endpoint actually returns — and the query the refused call used to pay for is no longer issued.

### Reports

#### Reconciled report aggregates

`GET /api/reports/summary`, `by-project` and `by-user` all filter to `EntryStatus.APPROVED` only, so the summary card's `approvedHours` always equals the sum of either detail table for the same month. `pendingHours` stays a separate, explicitly-named field and is never folded into a total — the DRAFT → SUBMITTED → APPROVED workflow only produces numbers a manager can trust if unapproved hours never leak into one.

#### Scalar reports are aggregated in the database

`GET /api/reports/summary` answers with one JPQL aggregate — `SUM(CASE WHEN te.status = APPROVED THEN te.hours END)` beside the SUBMITTED sum and `COUNT(CASE WHEN ... THEN 1 END)` — read into the `ReportSummaryProjection` interface. Computing the same three numbers in application code would mean loading every `TimeEntry` of the month as managed entities — for a manager, the whole company's — and folding them in three streams. `COALESCE(..., 0)` covers the empty month, where `SUM` returns null and `COUNT` returns zero, and the caller's scope is a `:userId IS NULL OR te.user.id = :userId` predicate rather than a `Specification`.

#### Report aggregates carry the `active` flag

`ProjectHoursReportResponse`/`UserHoursReportResponse` expose `isActive()`, sourced from `te.project.active`/`te.user.active` added to the `by-project`/`by-user` JPQL `SELECT` and `GROUP BY`. A soft-deleted project or user still keeps its historical hours in the aggregate — the work was real — but the flag lets the client distinguish "still active" from "archived" instead of guessing from a row that silently stopped appearing.

#### Report row order is part of the contract

`by-project` and `by-user` end with `ORDER BY SUM(te.hours) DESC, te.project.name ASC` (and `te.user.name ASC, te.user.id ASC`). A `GROUP BY` guarantees no row order, so without it the sort fell to Angular and the endpoint was non-deterministic to test. What makes the ordering total differs by report, because a tie-breaker is only unnecessary where the column is already unique: `projects.name` carries a unique constraint, so hours plus name leaves no two rows tied; `users.name` does not, so `by-user` closes the order with the id — otherwise two users sharing a display name and a monthly total can swap between two identical calls.

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
- Credential rotation over history rewriting — two secrets reached pushed history early in the project (a datasource password and a seed account's BCrypt hash); rotating both and treating the published values as burned is what removes the risk, while a `filter-repo` rewrite would change every later commit hash and break the references the project's backlog and plan cite; given up: the burned values stay readable in history for good
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

### The `dev` profile is not optional in local development

`SPRING_PROFILES_ACTIVE=dev`

The API has no public register endpoint, so the first manager account has to already exist before anyone
can log in. It is created by `config/DataInitializer`, a `CommandLineRunner` annotated `@Profile("dev")`:
without that profile the bean is never instantiated, the `users` table stays empty, and **every login
returns 401** with nothing in the logs to explain it. The profile also loads
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

JUnit 5 + Mockito, plain unit tests with no Spring context and no database.

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
