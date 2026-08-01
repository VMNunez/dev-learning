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

*No open High tasks.*

#### Medium

*No open Medium tasks.*

#### Low

- [ ] **[Low]** `[backend]` — Reconcile `GET /api/projects/{id}` with the plan, or remove it: `ProjectController.getById` (:29-32) exists and works, but it appears in **neither** §10's projects endpoint table (which lists only `GET /api/projects`, `POST`, `PUT`, `DELETE`) **nor** §11's endpoint-consumption map — so no Angular page is planned to call it. It is currently undocumented API that nothing reads. Surfaced 2026-07-31 while adding `Location` headers, when the `GET /{id}` availability of each resource had to be checked. Note the endpoint is not dead history: the 2026-07-22 BOLA fix (active-project filter, 404 not 403) was applied *to it*, so removing it would discard that decision. Two defensible outcomes — document the row in §10 and keep it as the target of the `POST`'s `Location` header (the reason it is worth having even with no page consuming it), or conclude the collection endpoint covers every planned use and delete it. **Decide before touching it**; if it stays, §10 must gain the row either way *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Decide the contract for `GET /api/users`: `UserService.getAll()` returns every user including soft-deleted ones, unpaginated. Returning inactive users to a manager is defensible per §10, but the Team page needs the `active` flag surfaced clearly — and the unbounded `findAll()` wants a `Pageable` once the table grows *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Signal duplicate email/name with a domain exception instead of manually throwing `DataIntegrityViolationException` — a Spring DAO exception meant for DB-layer violations, used here as a business signal in both `UserService.create/update` (duplicate email) and, since 2026-07-28, `ProjectService.create/update` (duplicate name). Both map to 409 correctly via the same generic handler, but that handler ignores the exception's custom message and always returns the fixed "A resource with this value already exists" — so a dedicated `DuplicateResourceException` (or per-resource subclasses) would fix two things at once: the workaround pattern, and let each caller's specific message ("A project with this name already exists" / "Email already in use") actually reach the client instead of being silently discarded *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Decide what the self-approval check in `TimeEntryService.approve`/`reject` is for, now that it is nearly unreachable: it refuses a manager whose own id matches the entry's owner (403, segregation of duties), but `POST /api/entries` and `PATCH /{id}/submit` are both `@PreAuthorize("hasRole('EMPLOYEE')")`, so a MANAGER can never create an entry nor move one into `SUBMITTED` — and `approve`/`reject` only accept `SUBMITTED`. The single path that reaches it is the promotion case §8 already documents: an EMPLOYEE with `SUBMITTED` entries whose role is changed to MANAGER via `PUT /api/users/{id}`. Surfaced 2026-07-30 while writing the Postman plan for the entry-id oracle task, which could not exercise the check without flipping a role mid-test. Three defensible outcomes — keep it as documented defence in depth and add the promotion case to the §21 test table so it is deliberately covered; make the promotion path explicit in §8's rule text; or, if the promotion case is judged out of scope, say so and keep the check anyway (removing it would make a future `POST /api/entries` relaxation silently unsafe). **Do not remove it without deciding first** *(Effort: Small)*

### Frontend

*No frontend tasks yet — Step 7a (Angular) has not started.*

## Closed

<!-- Append-only ledger, split by tier and then by priority, newest first within each priority.
     Written by the `backlog-task-close` skill once a task's concept has landed in coverage / README /
     PLANNING / PROGRESS. Format:
     - YYYY-MM-DD · **[Priority]** `[tier]` — short summary → where the concept landed
     Never delete a line here: a review run reads this to avoid re-raising a closed finding, and a
     `DECISION, no code change` line is the only surviving record of a deliberate choice. The only
     reordering ever allowed is filing a line under its own priority heading. -->

### Backend

#### High

- 2026-07-28 · **[High]** `[backend]` — `AuthResponse` now carries `token, name, role` → already covered (DTO pattern), PLANNING §10
- 2026-07-23 · **[High]** `[backend]` — user-management endpoints built (`POST`/`PUT`/`DELETE /api/users`) → already in README, PROGRESS
- 2026-07-23 · **[High]** `[backend]` — `User.active` default fixed (primitive `boolean` + `@Column(nullable = false)`) → already in README, PROGRESS, spring-boot/en/04
- 2026-07-23 · **[High]** `[backend]` — default admin moved off `data.sql` into a profile-gated `DataInitializer` → already in README, PROGRESS, PLANNING §9
- 2026-07-22 · **[High]** `[backend]` — `reopen` endpoint closes the REJECTED workflow branch → already in README, PROGRESS, spring-boot/en/05
- 2026-07-22 · **[High]** `[backend]` — inactive users blocked from login via `.disabled()` + `DisabledException` → already in README, PROGRESS
- 2026-07-22 · **[High]** `[backend]` — report aggregates filtered to `APPROVED` only → already in README, PROGRESS, spring-boot/en/04
- 2026-07-22 · **[High]** `[backend]` — `@PreAuthorize("hasRole('EMPLOYEE')")` added to entry-mutation endpoints → already in README, PROGRESS
- 2026-07-22 · **[High]** `[backend]` — BOLA fixed on `ProjectService.getById` (404, not 403) → already in README, PROGRESS, security/en/05
- 2026-07-22 · **[High]** `[backend]` — `GET /api/reports/summary` implemented with stream `reduce` → already in README, PROGRESS, java/en/09
- 2026-07-17 · **[High]** `[backend]` — `JwtFilter` wraps token parsing, returns 401 not 500 → already in README, PROGRESS
- 2026-07-17 · **[High]** `[backend]` — `GET /api/entries` query filters (`month`/`projectId`/`status`/`userId`) → already in README, PROGRESS
- 2026-07-09 · **[High]** `[backend]` — `GET /api/users` restricted to MANAGER via `@PreAuthorize` → already in README, PROGRESS
- 2026-07-09 · **[High]** `[backend]` — `UserResponse` DTO stops the BCrypt hash leaking → already in README, PROGRESS
- 2026-07-09 · **[High]** `[backend]` — `AccessDeniedException` handler returns 403, unified `ErrorResponse` introduced → already in README, PROGRESS
- 2026-07-08 · **[High]** `[backend]` — `@PreAuthorize` added to project `PUT`/`DELETE` → already in README, PROGRESS
- 2026-07-07 · **[High]** `[backend]` — `ResourceNotFoundException`/`BusinessRuleViolationException` introduced → already in README, PROGRESS

#### Medium

- 2026-07-29 · **[Medium]** `[backend]` — reports expose `active` flag for soft-deleted projects/users, hours kept unchanged → PLANNING §10, backend README, PROGRESS (coverage already had projection/GROUP BY concepts)
- 2026-07-29 · **[Medium]** `[backend]` — `by-employee` renamed to `by-user` end to end (endpoint, DTO, getters, JPQL alias) — the query never filtered by role → architecture coverage/junior, PLANNING §8/§10, PROGRESS, backend README
- 2026-07-29 · **[Medium]** `[backend]` — `UpdateTimeEntryRequest` split from `CreateTimeEntryRequest`, matching the projects Create/Update DTO pair → architecture coverage/junior, PLANNING §6, PROGRESS, backend README
- 2026-07-29 · **[Medium]** `[backend]` — duplicated entry validation in `TimeEntryService` extracted into `validateEntryData` + `MIN_HOURS`/`MAX_HOURS` constants → architecture coverage/junior, PROGRESS, backend README
- 2026-07-29 · **[Medium]** `[backend]` — `ReportSummaryResponse` reconciled: `totalHours` removed, `totalEntries` filtered to APPROVED → README, PROGRESS, PLANNING §8/§10 (already planned), coverage spring-boot/junior
- 2026-07-29 · **[Medium]** `[backend]` — `JwtUtil.isValid` now checks subject and expiration explicitly, not as a `parseClaims` side effect → README, PROGRESS, coverage spring-boot/junior (already covered)
- 2026-07-29 · **[Medium]** `[backend]` — account-password flow (`SecureRandom` generation, `CreateUserResponse`, `PATCH /api/users/me/password`) → PLANNING §8/§10/§12, README, PROGRESS, security/coverage/junior
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
- 2026-07-28 · **[Medium]** `[backend]` — `submit()` re-checks the entry's project is still active → already in PLANNING §8 (existing business-rule pattern)
- 2026-07-28 · **[Medium]** `[backend]` — `AccountStatusUserDetailsChecker` re-validates account status per request in `JwtFilter` → README, PROGRESS, spring-boot + security coverage/junior
- 2026-07-28 · **[Medium]** `[backend]` — reactivate path for soft-deleted users, optional `active` on `UpdateUserRequest` → README, PROGRESS (same bullet as the projects reactivate task)
- 2026-07-22 · **[Medium]** `[backend]` — `GET /api/entries` filters rebuilt with `Specification<TimeEntry>` → already in README, PROGRESS, spring-boot/en/14
- 2026-07-14 · **[Medium]** `[backend]` — `MissingServletRequestParameterException` handler added → already in README, PROGRESS, spring-boot/en/05
- 2026-07-14 · **[Medium]** `[backend]` — `MethodArgumentTypeMismatchException` handler added → already in README, PROGRESS
- 2026-07-13 · **[Medium]** `[backend]` — Bean Validation added across request DTOs → already in README, PROGRESS
- 2026-07-10 · **[Medium]** `[backend]` — `HttpMessageNotReadableException` handler added → already in README, PROGRESS
- 2026-07-09 · **[Medium]** `[backend]` — full Postman pass surfaced `UserResponse` + `JwtAuthenticationEntryPoint` gaps → already in README, PROGRESS
- 2026-07-08 · **[Medium]** `[backend]` — `GET /api/projects` filtered by role (active-only for employees) → already in README, PROGRESS

#### Low

- 2026-08-01 · **[Low]** `[backend]` — `fieldErrors` now a `Map<String, List<String>>` via `groupingBy`, so every violation per field reaches the client → java coverage/**middle** ("Downstream collectors", ✅ 07-timetrack — cross-level mark), PLANNING §10 contract updated, backend README Key patterns, PROGRESS
- 2026-08-01 · **[Low]** `[backend]` — `EntryStatus` comparisons in `TimeEntryService` unified to `==`/`!=`, dropping the mixed `.equals()` usage → already covered (java coverage/junior "Enum identity and behaviour", ✅ 07-timetrack), PROGRESS; PLANNING/README: style consistency, no entry
- 2026-08-01 · **[Low]** `[backend]` — vestigial `spring.jpa.defer-datasource-initialization=true` removed from `application.properties` → already covered (spring-boot coverage/junior "SQL initialization", ✅ 07-timetrack), PROGRESS; PLANNING/README: config polish, no entry
- 2026-08-01 · **[Low]** `[backend]` — `@ToString.Exclude` on `LoginRequest.password`, keeping credentials out of any future logged/dumped request → security coverage/junior ("Security logging hygiene", marked ✅ 07-timetrack), backend README Key patterns, PROGRESS
- 2026-07-31 · **[Low]** `[backend]` — magic status codes replaced by `ok`/`created(location)` across all 5 controllers; scope was 15 sites, not the 8 the review listed → spring-boot + general coverage/junior (2 new bullets + 1 pre-existing marked, ✅ 07-timetrack), PLANNING §10 success-response rule added, backend README Key patterns, PROGRESS
- 2026-07-31 · **[Low]** `[backend]` — `UserController.getAll()` already returned `ResponseEntity<List<UserResponse>>` — no code change needed → covered by the status-code close above; no separate concept
- 2026-07-31 · **[Low]** `[backend]` — both report queries ordered by hours desc, name asc as tiebreaker → sql coverage/junior (new bullet + multi-column sorting, ✅ 07-timetrack), PLANNING §10 ordering rule added, backend README Key patterns, PROGRESS
- 2026-07-31 · **[Low]** `[backend]` — `UnauthorizedException` renamed to `ForbiddenOperationException`, distinguished from Spring's `AccessDeniedException` → spring-boot coverage/junior (new bullet, ✅ 07-timetrack), backend README, PROGRESS; PLANNING file-path refs updated, no rule added
- 2026-07-31 · **[Low]** `[backend]` — JWT subject taken from verified `Authentication`, not request body — already fixed 2026-07-28 as a side effect of commit `a40ff50` → security coverage/junior already covered (✅ 07-timetrack), backend README, PROGRESS; PLANNING §6 already documents the rule
- 2026-07-31 · **[Low]** `[backend]` — CORS `allowCredentials(false)` (token-based auth, not cookies) + allowed origin externalized to `app.cors.allowed-origins` via `@Value` → spring-boot coverage/junior (marked ✅ 07-timetrack), backend README Key patterns, PROGRESS — PLANNING: not planned, config polish, no rule added
- 2026-07-30 · **[Low]** `[backend]` — entry-id existence oracle closed: a non-owned entry is 404, not 403 → security + java coverage/junior (new bullets, ✅ 07-timetrack), PLANNING §8 status ruling + §10/§11/§21, backend README, PROGRESS
- 2026-07-30 · **[Low]** `[backend]` — `currentUser()`/`isManager()` extracted into `AuthenticatedUserProvider`, `"ROLE_MANAGER"` replaced with `"ROLE_" + Role.MANAGER.name()` → already covered (spring-boot/junior `SecurityContextHolder` + `ROLE_` prefix, architecture/junior Extract Method/DRY), PLANNING §6 already had the rule, PROGRESS already had Extract Method + SecurityContextHolder
- 2026-07-29 · **[Low]** `[backend]` — fail-fast manual checks kept as the project's convention — DECISION, no code change → already in README, PROGRESS
- 2026-07-28 · **[Low]** `[backend]` — `show-sql` confirmed intentional, moved to `application-dev.properties` → already in README, PROGRESS

### Frontend

*No frontend tasks closed yet — Step 7a (Angular) has not started.*
