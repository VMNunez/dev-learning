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

- [ ] **[Low]** `[backend]` — A user promoted from EMPLOYEE to MANAGER strands their own `DRAFT` entries permanently: `PATCH /api/entries/{id}/submit` is `@PreAuthorize("hasRole('EMPLOYEE')")`, so the now-manager cannot move them out of `DRAFT`, and no other actor can submit on their behalf — `submit` resolves ownership from the JWT via `findOwnedEntry`, so there is no manager-side path either. The rows stay in the table forever, invisible to reports (which count `APPROVED` only) and to the approvals queue (`SUBMITTED` only), but visible to the promoted user's own `GET /api/entries`. Surfaced 2026-08-01 while triaging the self-approval task, which established the promotion path is a supported operation (`PUT /api/users/{id}` sets `role` unconditionally, §10:461), not an edge case. §8:280 rules the *approval* side of promotion in scope but says nothing about entries left mid-workflow. Defensible outcomes — refuse the promotion while the user holds non-terminal entries (409, forces the manager to resolve them first); auto-transition the orphans on role change; or rule the stranded `DRAFT`s acceptable and record why in §8, since a `DRAFT` is by definition unsubmitted work with no business meaning. **Decide before writing code** *(Effort: Small)*

### Frontend

#### High

*No open High tasks.*

#### Medium

*No open Medium tasks.*

#### Low

*No open Low tasks.*

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

- 2026-08-01 · **[Low]** `[backend]` — self-approval check on `approve`/`reject` kept as documented defence in depth — DECISION, no code change, **false positive**: the task called it "nearly unreachable", but `PUT /api/users/{id}` sets `role` unconditionally ([`UserService.update`](backend/timetrack/src/main/java/com/victor/timetrack/service/UserService.java)) and §10:461 declares role change a first-class admin operation, so the promotion path is one supported call away; §8:280 already documents that path *and* rules the approver hierarchy out of scope, §8:301 already rules why this refusal stays `403` after the id-oracle ruling, README.md:129 + backend/README.md:220 already carry it, all from commit `b93243a` → PLANNING §16 `approve`/`reject` rows now name the promotion fixture (the sole gap); coverage: `security/**middle**` "Segregation of duties" marked ✅ 07-timetrack (cross-level — the 2026-07-28 close routed to junior and never marked the concept's own bullet); PROGRESS:422 already recorded. Spun off the orphaned-`DRAFT`-on-promotion task
- 2026-08-01 · **[Low]** `[backend]` — `GET /api/reports/summary` scoped to the caller: `isAuthenticated()` at the boundary, ownership filter in the service → coverage: new `security/junior` bullet "Authorisation as scope, not only as a gate" (authored + marked ✅ 07-timetrack); PLANNING §10 heading + row + role-as-scope ruling, §12 tree, §13 :285, §17 employee dashboard, §19 Step 6, §20 `ReportService.getSummary`, §21 test row; backend README endpoint table + Key patterns; PROGRESS. `/notes-plan security junior` owed
- 2026-08-01 · **[Low]** `[backend]` — `GET /api/projects` (both role branches) and `GET /api/users` given a declared order via `Sort` → coverage: new `spring-boot/junior` bullet "`Sort` as a repository parameter" (authored + marked ✅ 07-timetrack); PLANNING §10 ordering rule generalised to every collection endpoint with a per-endpoint table + collation caveat, `/api/projects` and `/api/users` rows updated; backend README Key patterns; PROGRESS. `/notes-plan spring-boot junior` owed
- 2026-08-01 · **[Low]** `[backend]` — `GET /api/entries` paginated (`Pageable`, default sort `date`/`id` desc, cap 100) and serialised as `PagedModel`, not `PageImpl` → coverage: `spring-boot/junior` "Spring Data pagination" + `sql/junior` "Stable ordering" marked ✅ 07-timetrack, new `architecture/junior` bullet "Framework types are not response contracts" (authored + marked); PLANNING §10 row + query-param table + collection-endpoint rule rewritten, §17 stat-card ruling, §20 tradeoff reversed; backend README 2 Key patterns; PROGRESS. Spun off the `reports/summary` scoping task
- 2026-08-01 · **[Low]** `[backend]` — `GET /api/users` contract ruled: all accounts, active and inactive, unpaginated — DECISION, no code change → PLANNING §10 row + contract ruling :476 + §17 Team page (Status column, Inactive card), backend README (Soft delete pattern + Tradeoffs); coverage already covered/marked (architecture/junior "Soft delete vs hard delete" + "Pagination"). Pagination re-routed to a new `GET /api/entries` task
- 2026-08-01 · **[Low]** `[backend]` — `DuplicateResourceException` carries its field, so a duplicate 409 emits `fieldErrors` → already covered (spring-boot/junior "Error response contract", ✅ 07-timetrack), PLANNING §10 contract widened + §14 :908 + §21, backend README Key patterns, PROGRESS
- 2026-08-01 · **[Low]** `[backend]` — `GET /api/projects/{id}` kept and documented, not deleted — DECISION, no code change → PLANNING §10 projects table gains its row; §10 :421 already rules a missing `GET /{id}` is an API gap, and the endpoint carries the 2026-07-22 BOLA 404
- 2026-08-01 · **[Low]** `[backend]` — `DuplicateResourceException` replaces the hand-thrown DAO exception; the DAO handler stays for real index breaches → already covered (architecture/junior "Boundary failure ownership" + spring-boot/junior "Domain exceptions" / "`@Repository` exception translation", all ✅ 07-timetrack), PLANNING §6 rule + §12 tree, backend README Key patterns, PROGRESS
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
