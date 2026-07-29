# Project Backlog — TimeTrack

Improvement tasks for this project, written by `notes/prompts/projects/review/review-audit.md`.
A finished task is closed by the `backlog-task-close` skill: its concept goes into coverage / README /
PLANNING / PROGRESS, and only then does the verbose entry collapse into one dated line in `## Closed`.
That ledger is append-only and authoritative — a review never re-raises what it already closes.
(Entries still checked off inline (✅) predate the ledger, 2026-07-29; they collapse as they are revisited.)

**Last Reviewed — backend:** 2026-07-23
**Last Reviewed — frontend:** never
**Overall quality:** Good — layered architecture, the DTO boundary (intact across every resource), the uniform `@RestControllerAdvice` error contract and the security infrastructure remain solid, and **every previously-blocking High is now closed on disk** (JWT filter → 401, entry role checks, `getById` active filter, inactive-user login, report status filter, `reopen`, `Specification<T>` filters, full user CRUD, `data.sql` → profile-gated `DataInitializer`). This re-review covered the large body of newly-built code (user CRUD, `reports/summary`, `reopen`, role checks) that no reviewer had seen since 2026-07-17. It found **one new High** — `POST /api/auth/login` returns only `token`, but PLANNING §10 documents `AuthResponse — token, name, role` and Step 7a's role-based routing depends on those fields — plus a cluster of plan/code reconciliations on the fresh endpoints (user DTOs diverge from §10, the by-employee projection field name, summary-vs-table status totals, the submit-time inactive-project check) and the known persistence hardening still open (no `@Transactional`, N+1, DTO size bounds).

> The `frontend` tier has never been reviewed because Step 7a (Angular) has not started yet — the live
> work is the G3 backend backlog fix on `fix/backend-backlog` (PLANNING §0), so there is no frontend code
> yet. The old single `**Last Reviewed:** 2026-07-06` line was migrated to the per-tier form
> on 2026-07-14; it was **not** carried onto the frontend line, which would have made an unbuilt tier look
> reviewed.

## Tasks

### Backend

#### High

#### Medium

- [ ] **[Medium]** `[backend]` — Make JWT validation explicit in `JwtUtil.isValid` (:37-43): it compares only the subject, and signature/expiry are verified merely as a side effect of `parseClaims` throwing. Parse once, then check the subject **and** `getExpiration().after(new Date())`, returning `false` on any `JwtException`. (Its `catch (JwtException)` is dead code today because `extractUsername` already threw in the filter — see the High above.) "How do you know the token is not expired or tampered with?" must be answered by a deliberate check *(Effort: Small)*
- [ ] **[Medium]** `[backend]` — Decide what the reports do with soft-deleted projects and users: the aggregates filter on neither, so a project deactivated mid-month still appears as a report row with no `active` flag for the client to interpret. Keeping them is defensible (the hours *were* worked) — but return the flag in the projection so the behaviour is chosen, not accidental *(Effort: Small)*
- [ ] **[Medium]** `[backend]` — Introduce a separate `UpdateTimeEntryRequest` DTO: `PUT /api/entries/{id}` reuses `CreateTimeEntryRequest`, while the projects resource has the `CreateProjectRequest`/`UpdateProjectRequest` pair. Same problem, two solutions — pattern inconsistency reads as junior even when each half works *(Effort: Small)*
- [ ] **[Medium]** `[backend]` — Rename the by-employee projection field: `EmployeeHoursReportResponse.getEmployeeName()` (:6) produces the JSON field `employeeName`, but the same DTO already exposes **`userId`**, so the projection is inconsistent with *itself* — and `ProjectHoursReportResponse` sets the sibling precedent with `projectId`/`projectName`. Rename the getter and its JPQL `AS` alias to `userName`. **Decided 2026-07-28** (PLANNING §10): the tiebreaker was the existing `userId`, not style preference. Without it the Step 7c Reports table binds to `userName` and reads `undefined` *(Effort: Small)*
- [ ] **[Medium]** `[backend]` — Make the report aggregates reconcile, per the reporting rule **decided 2026-07-28** and now recorded in PLANNING §8: **every hours figure in a report counts `APPROVED` only**, with `pendingHours` the single explicitly-named exception that is never folded into a total. `getHoursByProject`/`getHoursByEmployee` already comply (the 2026-07-22 status-filter fix); `ReportService.getSummary` (:47-61) does not — it computes `totalHours` = APPROVED + SUBMITTED and counts `totalEntries` over both, so the summary card and the tables show two different totals for the same month. **Remove `totalHours` from `ReportSummaryResponse`** (it is the field that permits the disagreement — `approvedHours` is the real total) and filter `totalEntries` to APPROVED. Resulting DTO: `approvedHours`, `pendingHours`, `totalEntries`. Rationale: the whole DRAFT→SUBMITTED→APPROVED state machine exists so the manager's numbers can be trusted; mixing unapproved hours into a total silently defeats it. Step 7c's Reports page binds its headline card to `approvedHours`, which then equals the sum of either table exactly *(Effort: Small)*
- [ ] **[Medium]** `[backend]` — Extract the duplicated entry validation in `TimeEntryService`: the three business checks (future date, project active, hours 0.5–24) are copy-pasted verbatim in `create` (:40) and `update` (:163), including re-instantiating `new BigDecimal("0.5")`/`("24")` each time. Pull them into a private `validateEntryData(request, project)` used by both, and hoist the bounds to `static final BigDecimal MIN_HOURS`/`MAX_HOURS`. The submit-inactive-project gap above is exactly the divergence this duplication invites *(Effort: Small)*

#### Low

- [ ] **[Low]** `[backend]` — Extract a shared `currentUser()` / `isManager()` helper: the `SecurityContextHolder` → `findByEmail` lookup is copy-pasted across five `TimeEntryService` methods, `Objects.requireNonNull(getAuthentication())` appears six times, and `"ROLE_MANAGER"` is a magic string in both `TimeEntryService` and `ProjectService` — compare against the `Role` enum instead. Repetition in the one place that decides *who the caller is* is exactly where auth bugs hide *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Close the entry-id existence oracle: `TimeEntryService` returns 404 for a non-existent id but 403 for another user's id, so an EMPLOYEE can enumerate which entry ids exist across the whole table. Return 404 for both — treat a non-owned entry as not found *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Set CORS `allowCredentials(false)` in `SecurityConfig:65-68` (auth travels in the `Authorization` header, not cookies, so credentialed CORS buys nothing and only locks the config into the stricter rules) and move the hardcoded `localhost:4200` origin into an `app.cors.allowed-origins` property so a deployed frontend does not need a recompile *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Mint the JWT from the authenticated principal, not the request body: `AuthService:21-24` discards the `Authentication` returned by `authenticationManager.authenticate(...)` and passes `request.getEmail()` to `generateToken`. Not exploitable today (`findByEmail` is an exact match), but taking the subject from unvalidated input rather than the verified identity is the habit that becomes a bug elsewhere *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Rename `UnauthorizedException`: it is mapped to **403 Forbidden** in `GlobalExceptionHandler:66-71` while its name says 401. A name that lies about its status is small but visible *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Add `ORDER BY SUM(te.hours) DESC` to both report queries — §14 shows both tables sorted by hours descending, and without it the row order is whatever Postgres returns, pushing the sort onto Angular and making the endpoint non-deterministic to test *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Replace the magic status codes with the enum: `ResponseEntity.status(200)` in `TimeEntryController` (5×) and `ReportController` (2×) should be `.ok(...)`, and `ResponseEntity.status(201)` in `ProjectController:36` should be `HttpStatus.CREATED`. `noContent()` is already used correctly on delete, so the classes are internally inconsistent *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Decide the contract for `GET /api/users`: `UserService.getAll()` returns every user including soft-deleted ones, unpaginated. Returning inactive users to a manager is defensible per §10, but the Team page needs the `active` flag surfaced clearly — and the unbounded `findAll()` wants a `Pageable` once the table grows *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Consistency: `UserController.getAll()` (:22-25) returns a raw `List<UserResponse>` while every other controller method wraps its body in `ResponseEntity<T>` (`AuthController`, `ProjectController`, `TimeEntryController`, `ReportController`). Spring wraps a bare return value in a 200 identically, so this is behaviourally equivalent — a pure style outlier — but the resource layer should return `ResponseEntity` uniformly. Pairs with the magic-status-code Low above (same `ResponseEntity`-hygiene theme) *(Effort: Small)*
- [ ] **[Low]** `[backend]` — `GlobalExceptionHandler.handleValidation` silently drops one of two Bean Validation errors on the same field: `Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage, (existing, replacement) -> existing)` (:44-49) can only hold one entry per field key, so when a single field fails **two** constraints at once (e.g. `CreateUserRequest.email` both too long and not a valid email shape), only the first violation Spring happened to evaluate survives into the response — the client never sees the second. Discovered 2026-07-28 while testing the new `@Size`/`@Email` bounds on request DTOs. Different from the documented fail-fast convention for manual service-layer `if` checks (§Tasks, "Design decision" entry) — this is Bean Validation, which *does* evaluate every constraint, but the mapping step throws information away. Fix: change `fieldErrors` to `Map<String, List<String>>` (or join multiple messages with a separator) so every violation on a field reaches the client *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Exclude the password from `LoginRequest`'s generated `toString`: `@Data` makes `toString()` include the plaintext `password`, so the day any request-logging or a framework body-dump is added, credentials land in the logs. No logger stringifies it today (latent), but the fix is one annotation — add `@ToString.Exclude` on `password` (or split `@Data` into `@Getter`/`@Setter`) *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Signal duplicate email/name with a domain exception instead of manually throwing `DataIntegrityViolationException` — a Spring DAO exception meant for DB-layer violations, used here as a business signal in both `UserService.create/update` (duplicate email) and, since 2026-07-28, `ProjectService.create/update` (duplicate name). Both map to 409 correctly via the same generic handler, but that handler ignores the exception's custom message and always returns the fixed "A resource with this value already exists" — so a dedicated `DuplicateResourceException` (or per-resource subclasses) would fix two things at once: the workaround pattern, and let each caller's specific message ("A project with this name already exists" / "Email already in use") actually reach the client instead of being silently discarded *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Unify enum-status comparison in `TimeEntryService`: `submit`/`reopen`/`create` compare status with `==`/`!=` while `approve`/`reject`/`update` use `.equals()`. Both are correct for enums; pick one (`==` is idiomatic and null-safe) and apply it throughout *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Remove the now-vestigial `spring.jpa.defer-datasource-initialization=true` from `application.properties`: it only mattered while `data.sql` seeded on startup, and that was replaced by the profile-gated `DataInitializer` on 2026-07-23. Harmless but dead config *(Effort: Small)*

### Frontend

*No frontend tasks yet — Step 7a (Angular) has not started.*

## Closed

<!-- Append-only ledger, split by tier, newest first within each tier. Written by the
     `backlog-task-close` skill once a task's concept has landed in coverage / README / PLANNING /
     PROGRESS. Format:
     - YYYY-MM-DD · **[Priority]** `[tier]` — short summary → where the concept landed
     Never delete or reorder a line here: a review run reads this to avoid re-raising a closed finding,
     and a `DECISION, no code change` line is the only surviving record of a deliberate choice. -->

### Backend

- 2026-07-29 · **[Medium]** `[backend]` — account-password flow (`SecureRandom` generation, `CreateUserResponse`, `PATCH /api/users/me/password`) → PLANNING §8/§10/§12, README, PROGRESS, security/coverage/junior
- 2026-07-29 · **[Low]** `[backend]` — fail-fast manual checks kept as the project's convention — DECISION, no code change → already in README, PROGRESS
- 2026-07-28 · **[Low]** `[backend]` — `show-sql` confirmed intentional, moved to `application-dev.properties` → already in README, PROGRESS
- 2026-07-28 · **[Medium]** `[backend]` — `@Transactional` added to every service write method, `readOnly = true` on reads → README, PROGRESS
- 2026-07-28 · **[Medium]** `[backend]` — N+1 on `GET /api/entries` fixed with `FetchType.LAZY` + `LEFT JOIN FETCH` → README, PROGRESS
- 2026-07-28 · **[Medium]** `[backend]` — report aggregates grouped by id, not display name alone → README, PROGRESS, spring-boot coverage/junior
- 2026-07-28 · **[Medium]** `[backend]` — `TimeEntry.hours` constrained to `DECIMAL(4,2)` end to end → README, PROGRESS
- 2026-07-28 · **[Medium]** `[backend]` — `Project.active` switched to primitive `boolean`, `isActive()` getter → README, PROGRESS
- 2026-07-28 · **[Medium]** `[backend]` — duplicate-project-name rule enforced via `existsByName` in the service → already covered (derived-query pattern already in coverage/README)
- 2026-07-28 · **[Medium]** `[backend]` — reactivate path for soft-deleted projects, optional `active` on `UpdateProjectRequest` → README, PROGRESS
- 2026-07-28 · **[Medium]** `[backend]` — self-approval blocked, segregation of duties on approve/reject → README, PROGRESS, security coverage/junior
- 2026-07-28 · **[Medium]** `[backend]` — kept `AUTO`/sequence generation over `IDENTITY` — DECISION, no code change → README, PROGRESS, PLANNING §7
- 2026-07-28 · **[Medium]** `[backend]` — entities switched from `@Data` to `@Getter`/`@Setter`/`@EqualsAndHashCode` → already covered (spring-boot coverage/junior, backend/README)
- 2026-07-28 · **[Medium]** `[backend]` — DB-level not-null constraints added to match Java-side defaults → already covered (spring-boot coverage/junior)
- 2026-07-28 · **[Medium]** `[backend]` — `User.createdAt` added with `@CreationTimestamp` → already in README, PROGRESS
- 2026-07-28 · **[Medium]** `[backend]` — `@Size`/`@Email` bounds added across request DTOs → README, PROGRESS
- 2026-07-28 · **[Medium]** `[backend]` — unhandled exceptions logged via SLF4J before the generic 500 → already in README, PROGRESS
- 2026-07-28 · **[Medium]** `[backend]` — JWT lifetime cut from 24h to 60min → README, PROGRESS
- 2026-07-28 · **[High]** `[backend]` — `AuthResponse` now carries `token, name, role` → already covered (DTO pattern), PLANNING §10
- 2026-07-28 · **[Medium]** `[backend]` — `submit()` re-checks the entry's project is still active → already in PLANNING §8 (existing business-rule pattern)
- 2026-07-28 · **[Medium]** `[backend]` — `AccountStatusUserDetailsChecker` re-validates account status per request in `JwtFilter` → README, PROGRESS, spring-boot + security coverage/junior
- 2026-07-28 · **[Medium]** `[backend]` — reactivate path for soft-deleted users, optional `active` on `UpdateUserRequest` → README, PROGRESS (same bullet as the projects reactivate task)
- 2026-07-23 · **[High]** `[backend]` — user-management endpoints built (`POST`/`PUT`/`DELETE /api/users`) → already in README, PROGRESS
- 2026-07-23 · **[High]** `[backend]` — `User.active` default fixed (primitive `boolean` + `@Column(nullable = false)`) → already in README, PROGRESS, spring-boot/en/04
- 2026-07-23 · **[High]** `[backend]` — default admin moved off `data.sql` into a profile-gated `DataInitializer` → already in README, PROGRESS, PLANNING §9
- 2026-07-22 · **[High]** `[backend]` — `reopen` endpoint closes the REJECTED workflow branch → already in README, PROGRESS, spring-boot/en/05
- 2026-07-22 · **[High]** `[backend]` — inactive users blocked from login via `.disabled()` + `DisabledException` → already in README, PROGRESS
- 2026-07-22 · **[High]** `[backend]` — report aggregates filtered to `APPROVED` only → already in README, PROGRESS, spring-boot/en/04
- 2026-07-22 · **[High]** `[backend]` — `@PreAuthorize("hasRole('EMPLOYEE')")` added to entry-mutation endpoints → already in README, PROGRESS
- 2026-07-22 · **[High]** `[backend]` — BOLA fixed on `ProjectService.getById` (404, not 403) → already in README, PROGRESS, security/en/05
- 2026-07-22 · **[High]** `[backend]` — `GET /api/reports/summary` implemented with stream `reduce` → already in README, PROGRESS, java/en/09
- 2026-07-22 · **[Medium]** `[backend]` — `GET /api/entries` filters rebuilt with `Specification<TimeEntry>` → already in README, PROGRESS, spring-boot/en/14
- 2026-07-17 · **[High]** `[backend]` — `JwtFilter` wraps token parsing, returns 401 not 500 → already in README, PROGRESS
- 2026-07-17 · **[High]** `[backend]` — `GET /api/entries` query filters (`month`/`projectId`/`status`/`userId`) → already in README, PROGRESS
- 2026-07-14 · **[Medium]** `[backend]` — `MissingServletRequestParameterException` handler added → already in README, PROGRESS, spring-boot/en/05
- 2026-07-14 · **[Medium]** `[backend]` — `MethodArgumentTypeMismatchException` handler added → already in README, PROGRESS
- 2026-07-13 · **[Medium]** `[backend]` — Bean Validation added across request DTOs → already in README, PROGRESS
- 2026-07-10 · **[Medium]** `[backend]` — `HttpMessageNotReadableException` handler added → already in README, PROGRESS
- 2026-07-09 · **[High]** `[backend]` — `GET /api/users` restricted to MANAGER via `@PreAuthorize` → already in README, PROGRESS
- 2026-07-09 · **[High]** `[backend]` — `UserResponse` DTO stops the BCrypt hash leaking → already in README, PROGRESS
- 2026-07-09 · **[High]** `[backend]` — `AccessDeniedException` handler returns 403, unified `ErrorResponse` introduced → already in README, PROGRESS
- 2026-07-09 · **[Medium]** `[backend]` — full Postman pass surfaced `UserResponse` + `JwtAuthenticationEntryPoint` gaps → already in README, PROGRESS
- 2026-07-08 · **[High]** `[backend]` — `@PreAuthorize` added to project `PUT`/`DELETE` → already in README, PROGRESS
- 2026-07-08 · **[Medium]** `[backend]` — `GET /api/projects` filtered by role (active-only for employees) → already in README, PROGRESS
- 2026-07-07 · **[High]** `[backend]` — `ResourceNotFoundException`/`BusinessRuleViolationException` introduced → already in README, PROGRESS

### Frontend

*No frontend tasks closed yet — Step 7a (Angular) has not started.*
