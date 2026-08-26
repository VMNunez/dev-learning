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

### Auth

| Method | URL | Role | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Returns JWT |

### Time entries

| Method | URL | Role | Description |
|---|---|---|---|
| GET | `/api/entries` | Employee / Manager | Own entries / all entries |
| POST | `/api/entries` | Employee | Create entry (DRAFT) |
| PUT | `/api/entries/{id}` | Employee | Edit DRAFT entry |
| DELETE | `/api/entries/{id}` | Employee | Delete DRAFT entry |
| PATCH | `/api/entries/{id}/submit` | Employee | DRAFT → SUBMITTED |
| PATCH | `/api/entries/{id}/approve` | Manager | SUBMITTED → APPROVED |
| PATCH | `/api/entries/{id}/reject` | Manager | SUBMITTED → REJECTED |

### Reports

| Method | URL | Role | Description |
|---|---|---|---|
| GET | `/api/reports/summary` | Any authenticated user | Total hours and entries for a month — scoped to the caller for an employee |
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
| rejectionNote | VARCHAR | Optional — set by manager on reject |
| createdAt | TIMESTAMP | Set automatically |
| updatedAt | TIMESTAMP | Updated automatically on every change |

**Relationships:** User → TimeEntry is `@OneToMany` / `@ManyToOne`. Project → TimeEntry is `@OneToMany` / `@ManyToOne`.

---

## Auth flow

1. Client sends `POST /api/auth/login` with email and password
2. Service loads the user from DB, verifies password with BCrypt
3. Server generates a JWT signed with the secret from an environment variable
4. Client sends the JWT in `Authorization: Bearer <token>` on every request
5. `JwtFilter` intercepts the request, validates the token, extracts the user, sets `SecurityContext`
6. Spring Security allows or denies access based on the `SecurityFilterChain` configuration

---

## Security considerations

- Passwords hashed with BCrypt — never stored in plain text
- JWT secret loaded from environment variable — never committed to git
- CSRF protection disabled deliberately — the credential is a JWT in the `Authorization` header,
  which no browser attaches on its own, so a cross-site form submission arrives unauthenticated.
  It would have to come back if the token ever moved to an `HttpOnly` cookie, since cookies *are*
  attached automatically
- The app connects to PostgreSQL as a non-superuser role owning only its own database, so a SQL
  injection or a bug is bounded by that database instead of reaching the whole server
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

The list endpoint is part of the pattern, not separate from it: `GET /api/users` returns deactivated accounts alongside active ones, each carrying its `active` flag. Reactivation is only reachable through `PUT /api/users/{id}`, so a list that filtered out inactive rows would strand every account it hid — with soft delete, hiding a row from the collection is the same as deleting it.

### Externalized CORS configuration ✓

The allowed origins are loaded from `app.cors.allowed-origins` via `@Value` into a `List<String>`, not hardcoded in `SecurityConfig` — an environment-specific value stays outside compiled code, and the typed target is what lets one comma-separated property carry several origins. The policy is minimal by design: only the methods the API exposes and the two headers the client sends (`Authorization`, `Content-Type`), never a wildcard. `allowCredentials(false)` because auth travels in the `Authorization` header, not cookies, so credentialed CORS is unnecessary and only forces the stricter same-exact-origin matching for no benefit.

### GlobalExceptionHandler

`@ControllerAdvice` catches exceptions across all controllers and returns consistent JSON error responses instead of Spring's default HTML error page.

### Transactional boundaries ✓

Every service method is explicitly `@Transactional` (writes) or `@Transactional(readOnly = true)` (reads). Without it, each repository call runs as its own auto-commit transaction — a read-then-write method like `update` or `submit` would have no atomic boundary between the `find` and the `save`. `readOnly = true` also lets Hibernate skip dirty-checking on methods that never mutate an entity.

### N+1 prevention on `GET /api/entries`

`TimeEntry.user` and `TimeEntry.project` are `@ManyToOne(fetch = FetchType.LAZY)` — `@ManyToOne` defaults to `EAGER`, which would trigger one extra query per relationship per row (1 query for the list + up to 2N extra queries). `TimeEntrySpecifications.fetchUserAndProject()` adds an explicit `LEFT JOIN FETCH` on both relationships so the listing endpoint loads entries, users and projects in a single query. The fetch is skipped when `query.getResultType()` is `Long` (the pagination count query), since a fetch join is invalid there.

### `equals`/`hashCode`/`toString` on JPA entities ✓

`User`, `Project` and `TimeEntry` use `@Getter`/`@Setter` instead of Lombok's `@Data`. `@Data` generates `equals`/`hashCode` over every field, including the database-generated `id` — but an entity's `id` is `null` until it is persisted, so an entity placed in a `HashSet`/`HashMap` before saving becomes unreachable in that collection once Hibernate assigns its `id` (the object's hash code changes after insertion). `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` + `@EqualsAndHashCode.Include` on `id` makes identity depend only on the database key. `TimeEntry` also adds `@ToString(exclude = {"user", "project"})`: both are `@ManyToOne(fetch = FetchType.LAZY)`, and a generated `toString()` that includes them would trigger a lazy load — safe only inside an open transaction, and throwing `LazyInitializationException` otherwise (e.g. from a log call after the request completes).

### Credentials excluded from generated `toString()` ✓

`LoginRequest` keeps `@Data` but adds `@ToString.Exclude` on `password`: `@Data`'s generated `toString()` otherwise includes every field, so the plaintext password would land in any future request-logging or framework body-dump call. No logger stringifies the request today, but the fix is one annotation and closes the gap before it becomes exploitable. `AuthResponse.token` carries the same annotation for the same reason on the way out: the field holds a live 60-minute bearer credential, and a `toString()` that includes it would put a usable session in the logs. Neither annotation touches the JSON — Jackson serialises from the getters, so the token still reaches the client.

### Explicit JWT validation ✓

`JwtUtil.isValid` parses the token once and checks the subject **and** `getExpiration().after(new Date())` explicitly, instead of relying on `extractUserId` throwing as a side effect of parsing. Makes the expiration check a deliberate decision in the code, not an accident of call order.

### Reconciled report aggregates ✓

`GET /api/reports/summary`, `by-project` and `by-user` all filter to `EntryStatus.APPROVED` only, so the summary card's `approvedHours` always equals the sum of either detail table for the same month. `pendingHours` stays a separate, explicitly-named field and is never folded into a total — the DRAFT → SUBMITTED → APPROVED workflow only produces numbers a manager can trust if unapproved hours never leak into one.

### Honest naming on `by-user` ✓

`GET /api/reports/by-employee` was renamed to `/by-user`: the query groups `TimeEntry.user` with no role filter, so a manager who was promoted from EMPLOYEE still shows up with their historical hours — correctly, since those hours are still billable. `by-employee` implied a role guarantee the code never enforced; `by-user` names what the query actually returns. `EmployeeHoursReportResponse`/`getEmployeeName()` were renamed to `UserHoursReportResponse`/`getUserName()` for the same reason.

### Scalar reports are aggregated in the database ✓

`GET /api/reports/summary` answers with one JPQL aggregate — `SUM(CASE WHEN te.status = APPROVED THEN te.hours END)` beside the SUBMITTED sum and `COUNT(CASE WHEN ... THEN 1 END)` — read into the `ReportSummaryProjection` interface. It previously loaded every `TimeEntry` of the month as managed entities, for a manager the whole company's, and folded them in three streams to return three numbers. `COALESCE(..., 0)` covers the empty month, where `SUM` returns null and `COUNT` returns zero, and the caller's scope is a `:userId IS NULL OR te.user.id = :userId` predicate rather than a `Specification`.

### Report aggregates carry the `active` flag ✓

`ProjectHoursReportResponse`/`UserHoursReportResponse` expose `isActive()`, sourced from `te.project.active`/`te.user.active` added to the `by-project`/`by-user` JPQL `SELECT` and `GROUP BY`. A soft-deleted project or user still keeps its historical hours in the aggregate — the work was real — but the flag lets the client distinguish "still active" from "archived" instead of guessing from a row that silently stopped appearing.

### Status codes are named, and a `201` says where ✓

Every controller returns its status through a factory — `ok`, `created`, `noContent` — instead of `ResponseEntity.status(200)`, so the status is a checked constant rather than an `int` the compiler cannot validate. The three `POST` endpoints go through `created(location)`, whose URI is built with `ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")`: the response carries a `Location` header naming the new resource, so the client never has to assemble that URL from its own copy of the route scheme.

### Report row order is part of the contract ✓

`by-project` and `by-user` end with `ORDER BY SUM(te.hours) DESC, te.project.name ASC` (and `te.user.name ASC, te.user.id ASC`). A `GROUP BY` guarantees no row order, so without it the sort fell to Angular and the endpoint was non-deterministic to test. What makes the ordering total differs by report, because a tie-breaker is only unnecessary where the column is already unique: `projects.name` carries a unique constraint, so hours plus name leaves no two rows tied; `users.name` does not, so `by-user` closes the order with the id — otherwise two users sharing a display name and a monthly total can swap between two identical calls.

### Every collection endpoint declares its order ✓

The report rule above generalised: `ProjectService` and `UserService` hand a `Sort` to the repository — `findAll(Sort)` and `findByActiveTrue(Sort)`, where `Sort` is a Spring Data special parameter applied on top of a derived query rather than parsed as a criterion. Without it the rows arrive in PostgreSQL heap order, which an unrelated `UPDATE` reshuffles. Projects sort by `name`; users sort `active` desc, `name` asc, `id` asc — `name` is not unique on `users`, so the id is what makes that ordering total.

### Extracted entry validation ✓

`TimeEntryService.create` and `update` both check the same three business rules (future date, active project, hours in range). `validateEntryData(request, project)` holds that logic once, called from both methods, with `MIN_HOURS`/`MAX_HOURS` as class constants instead of re-instantiated `BigDecimal` literals.

### Two-layer validation on `hours` ✓

`TimeEntry.hours` is constrained at both ends, deliberately kept as two layers rather than one: `@Column(precision = 4, scale = 2)` on the entity guarantees the DB never stores more precision than the field is meant to hold, and `@DecimalMin("0.5")` / `@DecimalMax("24")` / `@Digits(integer = 2, fraction = 2)` on `CreateTimeEntryRequest` reject an out-of-range or over-precise value at the HTTP boundary with a 400, before it ever reaches the service. `TimeEntryService` also keeps its own manual 0.5–24 check — redundant with the DTO validation for HTTP requests, but it protects the business rule for any future non-HTTP caller of the service.

### JWT subject taken from the verified `Authentication`, not the request body ✓

`AuthService.login` uses `authentication.getName()` — the value `AuthenticationManager.authenticate(...)` returns after checking the credentials — to look up the user whose id becomes the token's subject, never `request.getEmail()` directly. Both resolve to the same account today (`findByEmail` is an exact match), but reaching the identity through unvalidated input rather than the verified one is the habit that becomes exploitable the moment lookup logic changes.

### `ForbiddenOperationException` — a status-honest name, distinct from `AccessDeniedException` ✓

Renamed from `UnauthorizedException`, which mapped to 403 while its name suggested 401. It has no inheritance relationship with Spring Security's own `AccessDeniedException` — both resolve to 403 today, but each is caught by its own `@ExceptionHandler` in `GlobalExceptionHandler`, because one is a framework-thrown refusal from `@PreAuthorize` and the other is a hand-thrown business rule (segregation of duties on `approve`/`reject`).

### A non-owned entry is `404`, not `403` ✓

`TimeEntryService.findOwnedEntry(id, user)` chains `findById(id)` → `Optional.filter` (the ownership test) → `orElseThrow`, so "this id does not exist" and "this id is not yours" leave through the same throw with the same message. Returning 403 for the second case would make the status code an enumeration oracle: an EMPLOYEE could probe ids on `submit`/`update`/`reopen`/`delete` and learn which entries exist across the whole table without reading one. `approve`/`reject` keep their 403 (`ForbiddenOperationException`) because that refusal is segregation of duties, not ownership — a MANAGER already sees every entry, so the status discloses nothing they could not read from the listing.

### An archived project is hidden on every door that accepts its id ✓

`GET /api/projects/{id}` answers 404 for an inactive project when the caller is an EMPLOYEE, but `POST`/`PUT /api/entries` used to answer 400 "Project is not active" for the same project and 404 for an unknown one — so the entries endpoints handed back exactly what the projects endpoint concealed. `TimeEntryService.resolveProject(projectId, callerKnowsItExists)` now holds the rule in one place: an inactive project throws the same 404 with the same message an unknown id gets, unless the caller is already entitled to know it exists, which is true only when the id is the one their own entry already carries — those get the 400 that tells them why the edit failed. A concealment decision is only as strong as the most talkative endpoint that accepts the identifier.

### Every validation violation reaches the client ✓

`fieldErrors` is a `Map<String, List<String>>`, collected with `Collectors.groupingBy` + `Collectors.mapping`. The earlier `Collectors.toMap` needed a merge function to resolve duplicate keys, and `(existing, replacement) -> existing` silently dropped the second violation whenever one field failed two constraints at once — `email` both over `@Size(max = 255)` and failing `@Email` reached the client as a single message. Bean Validation evaluates every constraint; only the collection step was throwing the result away.

### `DuplicateResourceException` — a business signal, not a DAO exception ✓

A duplicate email or project name is refused by `DuplicateResourceException`, thrown by `UserService` and `ProjectService` before the `save`. It previously reused Spring's `DataIntegrityViolationException`, which belongs to the `DataAccessException` family `@Repository` translates persistence failures into — a claim that the database rejected the write, made at a point where the database had not been asked. The handler for it stays, because a concurrent create can still breach the unique index for real, and it keeps returning a fixed message: that message is written by Hibernate and names the constraint and the statement. Splitting the types is what lets the domain handler return `e.getMessage()`, so "Email already in use" and "A project with this name already exists" reach the client instead of one generic 409.

### `fieldErrors` is a per-control channel, not a validation-only one ✓

`DuplicateResourceException` carries the offending field name (`email`, `name`) alongside its message, so its handler emits `fieldErrors` on a **409** exactly as `MethodArgumentNotValidException` does on a 400. The alternative — reserving the map for `@Valid` failures — would make a reactive form branch on the status to decide whether a message belongs under an input or at the dialog foot, and would leave the most common error in the Team dialog detached from the field that caused it. The status says what kind of failure it is; the map says which control owns it. The field travels in the exception rather than being hardcoded in the handler because the same type is thrown from two resources.

### A password change has to change the password ✓

`UserService.changePassword` refuses a `newPassword` that `passwordEncoder.matches` the stored hash, with a 400 carrying `fieldErrors.newPassword`. Re-encoding the same value writes a different hash and would answer `204`, so a user rotating a credential they believe is compromised gets a confirmation that nothing about their access changed. The check runs *after* the current-password check, never before: reversed, it would tell an unauthenticated caller whether a guessed value is the account's password. `InvalidPasswordException` carries the field so the same handler serves both refusals — the type fixes the status, the field fixes the input the message lands under.

### `GET /api/entries` is paged, and a paged endpoint owes a total order ✓

`@PageableDefault` binds `?page`, `?size` and `?sort` into a `Pageable`, and `JpaSpecificationExecutor.findAll(spec, pageable)` applies it on top of the dynamic `Specification` filters — the filters and the page compose, so no query was rewritten to gain pagination. `Page.map()` converts to `TimeEntryResponse` while keeping the metadata. Two parts are decisions rather than defaults: the sort is `date` desc with `id` desc as a unique tie-breaker, because without a unique key after a non-unique column two entries on the same day can swap between calls and a row is served twice or never; and the page size is capped at 100 through a `PageableHandlerMethodArgumentResolverCustomizer` bean, because an endpoint that honours any requested size is not bounded at all. The tie-breaker is re-applied rather than assumed: `@PageableDefault` is a default, not a floor, so a client-supplied `?sort=hours,asc` replaces it entirely and leaves a non-unique column with nothing behind it. `TimeEntryController.withIdTiebreaker` appends `id` as the last `Sort.Order` unless the caller already named it, rebuilding the `Pageable` because `Pageable` and `Sort` are immutable — the API owns the totality of the order, not the caller. Entries is the only collection here paged — it grows with every imputation, every user and every month, while users and projects are bounded by headcount and by the catalogue.

### A page is serialised as a DTO, not as Spring Data's `PageImpl` ✓

`@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)` makes pages leave as `PagedModel` — `content` plus a four-field `page` — instead of Jackson reflecting over `PageImpl` and emitting its eleven internal getters. `PageImpl` is a dependency's implementation class, so serialising it directly puts the payload's shape outside this project's control: a Spring Data upgrade could rename a getter and change the API without a line of code changing. It is the same boundary the DTO pattern already draws around entities, applied to the envelope rather than the items. The annotation carries a cost worth knowing: `@Enable*` makes Boot's matching autoconfiguration back off, which silently dropped `spring.data.web.pageable.max-page-size` and let the cap fall back to Spring Data's 2000 — hence the customizer bean above.

### A role can scope a response instead of refusing it ✓

`GET /api/reports/summary` serves both roles, so the role is not the gate: `@PreAuthorize("isAuthenticated()")` states that the check lives further in, and the summary query carries a `(:userId IS NULL OR te.user.id = :userId)` predicate — `null` for a manager, the caller's own id for an employee, so the null argument neutralises the filter instead of branching the query. One query, one code path, and the three aggregates scope themselves because they are computed over that one predicate. The identity comes from `AuthenticatedUserProvider`, never from a request parameter. `by-project` and `by-user` keep `hasRole('MANAGER')`, so the contrast between the two kinds of authorisation is visible in one screen of the controller.

### A role change is a workflow transition too ✓

`PUT /api/users/{id}` refuses a promotion to MANAGER with `409` while the user still holds `DRAFT` or `REJECTED` entries. `submit` and `reopen` are `hasRole('EMPLOYEE')` and resolve ownership from the JWT, so those rows would become unreachable by every actor in the system — invisible to reports and to the approvals queue, but still listed to their owner. The state machine's transitions are gated on the actor's role, which makes the role mutable input to it, so the point where the role changes is where that assumption is guarded. Narrow by construction: the check runs only when the role actually changes to MANAGER, leaving reactivation through the same endpoint untouched.

### The token catch covers the library's whole failure surface ✓

`JwtFilter` catches `IllegalArgumentException` beside `JwtException`, because jjwt signals an absent, empty, or blank compact token with the former — a type unrelated to its own exception family. `Authorization: Bearer ` with nothing after the space reaches `substring(7)` as `""`, and before the fix that escaped the filter above `ExceptionTranslationFilter`, so an anonymous caller received the container's `/error` body with `500` instead of the uniform `401` `ErrorResponse` that `JwtAuthenticationEntryPoint` writes. A filter that reads a credential fails closed on every parse failure, whatever type the library uses to report it.

### A profile-gated bean is part of the run contract ✓

`DataInitializer` is `@Profile("dev")`, so without `SPRING_PROFILES_ACTIVE=dev` the context starts cleanly and the application is still unusable: no manager is seeded, and with no register endpoint every login is `401`. A missing `${JWT_SECRET}` at least fails loudly at startup — a missing profile fails silently, which is why the activation is documented in *How to run alone* beside the mandatory variables rather than left as a developer's local setting.

### Identifiers are canonicalised before they are compared or stored ✓

`EmailNormalizer.normalize` trims and lower-cases an email at the service boundary, and the same value feeds both the duplicate check and the setter, in `UserService.create`/`update`, `UserDetailsServiceImpl` and `DataInitializer`. Project names take the parallel rule: `ProjectService` trims and asks `existsByNameIgnoreCase`, and `update` uses `equalsIgnoreCase` to decide whether the name changed at all, so re-capitalising a project is not a duplicate of itself. Comparing one form while persisting another is what lets `Ana@corp.com` and `ana@corp.com` become two logins for one person, and §8's by-project report split one project's hours across two rows.

### An admin operation refuses the caller as its own target ✓

`UserService.update` and `delete` refuse a demotion or a deactivation whose target id is the caller's own, with `409`. Both endpoints are `hasRole('MANAGER')`, so the only route back from either — `PUT /api/users/{id}` — needs the privilege the call is removing, and `JwtFilter` runs the loaded `UserDetails` through an `AccountStatusUserDetailsChecker`, so a deactivated manager loses their still-valid token on the very next request. The §17 Team wireframe renders `✏ 🗑` on every row including the caller's, which makes it one misclick. The system-wide invariant — at least one active MANAGER always remains — needs no code of its own: it follows from the caller always being an active MANAGER and never being their own target.

### The client chooses the sort key from an allow-list, never from the entity ✓

`TimeEntryController.validateSort` checks every `Sort.Order` in the bound `Pageable` against `SORTABLE_PROPERTIES` — `date`, `hours`, `status`, `id` — and rejects anything else with `400` through `BusinessRuleViolationException`. `?sort=` is bound straight into a persistence query, so it is untrusted input with the reach of a column name: an unknown property made Spring Data throw `PropertyReferenceException`, which reached the `RuntimeException` handler as a `500` plus a stack trace for a client typo, and a nested path resolves too — `?sort=user.password,asc` ordered the page by the BCrypt hash, a value the response never returns but whose ordering can be observed. A block-list would have to name every sensitive column the entity graph can reach; the allow-list makes every field added later unsortable until it is chosen.

### A response carries the identifier of every relation, not only its label ✓

`TimeEntryResponse` returns `projectId` and `userId` beside `projectName` and `userName`. The response is the only representation a client ever holds — there is no `GET /api/entries/{id}` — and `PUT /api/entries/{id}` takes a `projectId`, so a response carrying the name alone forces the edit dialog to re-derive the key by matching the label against the projects list, a lookup that is only correct while `Project.name` stays unique and that silently edits the wrong row when it stops being. Minimal disclosure is a rule about sensitive fields, not about keys the caller has to send back.

### Failed logins are bounded by account and by network, and the bound expires on its own ✓

`LoginAttemptService` keeps a per-key failure counter and `AuthService` consults it *before* `authenticationManager.authenticate`, so a refused attempt never reaches BCrypt — five failures answer `429` through the same `@RestControllerAdvice` as every other error, for one minute measured from the last failure. Two keys are counted independently, the submitted email and `getRemoteAddr()`, because a per-account bound alone lets one common password be sprayed across every account without a single counter moving, and a per-IP bound alone puts a whole NAT'd office on one budget. The window lifting itself is the design, not a shortcut: a permanent lockout is the easier rule and the wrong one, since it hands an attacker a way to lock out any account they can name. The counter's value is an immutable `record` replaced through `compute` and a two-argument `remove`, because a servlet container touches this one bean from every request thread at once and a read-modify-write spread over three statements drops failures under exactly the load that matters.

### The token names the account by an identifier the account cannot lose ✓

`JwtUtil` writes `user.id` into the `sub` claim and `JwtFilter` resolves the principal through `UserDetailsServiceImpl.loadUserById`; `loadUserByUsername` stays for `DaoAuthenticationProvider`, which keys the login on the submitted email. The subject used to be that email, which `PUT /api/users/{id}` deliberately keeps editable (§10) — so a still-valid 60-minute token whose subject was later reassigned to another account resolved to *that* account and inherited its authorities: a vertical escalation with no forged signature and no stolen credential. A surrogate key is the only identifier a mutation cannot hand to somebody else. Tokens issued in the old format expire on their own, because `Long.valueOf` rejects an email-shaped subject with `NumberFormatException` and the filter's catch already covered that as an `IllegalArgumentException`.

### Every endpoint declares its own authorization rule ✓

The five any-authenticated endpoints — `GET /api/projects`, `GET /api/projects/{id}`, `GET /api/entries`, `PATCH /api/users/me/password` and `GET /api/reports/summary` — carry `@PreAuthorize("isAuthenticated()")` rather than resting on `SecurityConfig`'s `anyRequest().authenticated()`. The two enforcement points are independent: the chain is a perimeter defined by URL, the annotation is the method's own contract. A matcher later widened for a demo opens the perimeter without the controller changing a line, so the rule that survives that edit is the one written beside the method — and the one a reviewer sees in the diff. It also removes the ambiguity a partial convention creates, where an unannotated method cannot be told apart from a forgotten one.

### A response that carries a generated value has to wait for the flush ✓

`ProjectService.create` calls `saveAndFlush`, because `createdAt` does not exist until the `INSERT` runs. With a sequence-backed `@GeneratedValue`, `save()` only stages the row — the statement, and the `@CreationTimestamp` it generates, land at the commit flush, which is after `toResponse(saved)` has already read the field. The `201` therefore serialised `"createdAt": null` for a row that had one, as the following `GET` showed. `update` needs no equivalent: it reads a value the loaded entity already carries.

### The decimal scale of a number is part of the response contract ✓

The three report queries round their aggregate in the query — `round(SUM(te.hours), 2)`, and `round(COALESCE(SUM(...), 0), 2)` in the summary, where the fallback carries its own scale and a month with no entries would otherwise answer `0` instead of the `0.00` §10 promises. `ReportService` no longer re-applies `setScale(2)`: the rule had two owners, so `summary` was normalised in Java while `by-project` and `by-user` served whatever the driver returned, and a card reading `40.00` beside a table reading `40.0` shows one figure as two with nothing in the code saying they must agree. Only PostgreSQL's own scale propagation kept them equal, which is a property of the engine rather than a contract of the API.

### The public rule names a method and a path, not a prefix ✓

`SecurityConfig`'s only `permitAll` is `requestMatchers(HttpMethod.POST, "/api/auth/login")`. It was `"/api/auth/**"`, which authorises endpoints that do not exist yet: a `POST /api/auth/register` or a `POST /api/auth/reset-password` added later to `AuthController` would have been born public, with nothing in that diff to prompt a security review. The exception a login endpoint needs is one verb on one path, so that is what the rule states — anything else added to the controller falls through to `anyRequest().authenticated()`, which is the failure direction that costs nothing. A side effect worth having: `GET /api/auth/login` now answers `401` through the entry point instead of leaking a `405` from outside the perimeter.

---

### A password policy constrains the new password, never the one being verified ✓

`ChangePasswordRequest.currentPassword` carries `@NotBlank` and `@Size(max = 72)`; the 8-character floor from §8 sits on `newPassword` alone. `@Valid` runs in the argument resolver, before the controller method exists, so a policy floor on the current password rejects the request before `passwordEncoder.matches` is ever reached — and it is a rule about what the system will now accept applied to a value created under whatever policy existed then. Any account whose stored password is shorter than the current floor could never change it, the `dev` seed admin among them, since `ADMIN_PASSWORD` has no length requirement. The surviving `max = 72` is not policy but BCrypt's own input bound, counted in bytes: the algorithm processes only that prefix, so a longer value cannot be correct and never needs hashing. Both fields also carry `@ToString.Exclude`, for the reason the credentials entry above gives.

---

### A refusal about the resource is decided before a refusal about the body ✓

`TimeEntryService.update` evaluates its DRAFT guard immediately after `findOwnedEntry`, before `resolveProject` reads the requested `projectId` — the order `submit`, `reopen` and `delete` already used. Reversed, a `PUT` on a non-DRAFT entry carrying an unknown project answered `404 "Project not found"` where §10 documents `409`, so the status a refusal produced depended on what the client happened to send and the caller corrected the wrong thing before seeing the real one. A guard on the loaded entity returns the same verdict whatever the body contains; one on the body does not, so the first is what makes the documented refusal the one the endpoint actually returns — and the query the refused call used to pay for is no longer issued.

---

## Tradeoffs

- JWT over session-based auth — stateless API requires no server memory per user; any instance can validate the token
- Soft delete over hard delete — deleting a user would orphan all their time entries; soft delete preserves the full audit trail
- RuntimeException over checked exceptions — Spring Boot convention; caught globally with `@ControllerAdvice` at the boundary
- 60-minute JWT expiration with no refresh token — a shorter-lived access token limits the damage window of a stolen token; without a refresh token, a session idle past 60 minutes forces a fresh login instead of silently renewing. A refresh-token flow is out of scope for this MVP
- No forced password change on first login — a `mustChangePassword` flag would need frontend route interception to enforce, cut deliberately for the MVP; a new account keeps its generated password until the user changes it voluntarily via `PATCH /api/users/me/password`
- No `GET /{id}` for entries or users — the UI is entirely tables and dialogs, with no detail view and no deep-linkable route, so an edit dialog opens from a row the page already holds and a single-resource fetch would re-request data that is already in memory. What this gives up is real: no shareable URL for one entry, a dialog lost on refresh, and an edit that starts from a snapshot rather than the current row. Acceptable here because only an entry's own owner and a manager can edit anything, so two people racing on one row is not a realistic case, and the list is refetched after every mutation
- Return-all over `Pageable` on `GET /api/users` — headcount is tens of rows, and all three consumers of the endpoint (team table, dashboard count, the approvals employee filter) need the whole list to be correct: a paginated response would quietly reduce the filter to whoever landed on page one and turn the count into a page size. Pagination is the right call on collections that grow without a bound, which this one does not
- Credential rotation over history rewriting — two secrets reached pushed history early in the project (a datasource password, and a seed account's BCrypt hash). Rotating both values, and treating the published ones as burned, is what removes the risk; rewriting history with `filter-repo` would change every later commit hash and break the references this project's backlog ledger and PLANNING cite, while revoking nothing that was already cloned
- No password reset flow — resetting a forgotten password needs an email channel to deliver a reset link/token, which is out of scope; today a manager deactivates and recreates the account instead
- In-memory login throttling over a shared store — the failure counters live in one `ConcurrentHashMap` inside the running process, which needs no Redis, no table and no new dependency, and is sufficient for the single-instance deployment this project targets. What it gives up is real: the counters reset on restart, and two instances behind a load balancer would each grant an attacker the full budget. A limit that spans instances belongs in a shared store or at the gateway, which is also where it stops competing with the application for the CPU an attacker is trying to burn

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

**Requirements:** Java 25 and PostgreSQL running locally. Create the database and the role the app
connects as — the app never connects as `postgres`, PostgreSQL's superuser:

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
| `JWT_SECRET` | `application.properties` → `app.jwt.secret` | Always | HMAC signing key for access tokens. Any string of at least 32 bytes; treat it as a credential |
| `ADMIN_PASSWORD` | `application-dev.properties` → `app.admin.password` | With the `dev` profile only | Plain-text password of the seeded first manager, hashed with BCrypt at startup and never stored in git |

Miss `JWT_SECRET` and startup ends in `Could not resolve placeholder 'app.jwt.secret'`.

Two further datasource properties are placeholders **with** a local default, so they are optional. They
are externalised for a different reason than the three above: not secrecy — a hostname is not a secret —
but so the same build runs against another host. Step 11's `docker` profile sets the compose service
name in `application-docker.properties`; these placeholders are what let a one-off run override it from
the environment without a profile at all.

| Variable | Read from | Default | What it is |
|---|---|---|---|
| `DB_URL` | `application.properties` → `spring.datasource.url` | `jdbc:postgresql://localhost:5432/timetrack` | JDBC URL of the database |
| `DB_USERNAME` | `application.properties` → `spring.datasource.username` | `timetrack_app` | Role the app connects as — a non-superuser owning the `timetrack` database and nothing else on the server |

The role is deliberately not `postgres`. What that buys is bounded and worth stating precisely: it does
not stop an injection reaching this database's own tables — the app has full DML there by definition —
but it removes everything a superuser adds on top, `pg_shadow` and every other role's password hash,
`COPY … PROGRAM` shell execution, and DDL against objects this application does not own. It owns the
`timetrack` database because `ddl-auto=update` alters its own tables at startup; behind Flyway
migrations it could be narrowed further, to `SELECT`/`INSERT`/`UPDATE`/`DELETE` and no DDL at all.

### The `dev` profile is not optional in local development

`SPRING_PROFILES_ACTIVE=dev`

The API has no public register endpoint, so the first manager account has to already exist before anyone
can log in. It is created by `config/DataInitializer`, a `CommandLineRunner` annotated `@Profile("dev")`:
without that profile the bean is never instantiated, the `users` table stays empty, and **every login
returns 401** with nothing in the logs to explain it. The profile also loads
`application-dev.properties`, which is where `app.admin.*` and `spring.jpa.show-sql` live — which is why
`ADMIN_PASSWORD` is only read when it is active.

The runner is idempotent: a `findByEmail(...)` guard makes every boot after the first a no-op.

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
