# Project Backlog — TimeTrack

Improvement tasks for this project, written by `notes/prompts/projects/review/review-audit.md`.
A finished task is closed by the `backlog-task-close` skill: its concept goes into coverage / README /
PLANNING / PROGRESS, and only then does the verbose entry collapse into one dated line in `## Closed`.
That ledger is append-only and authoritative — a review never re-raises what it already closes.
(Entries still checked off inline (✅) predate the ledger, 2026-07-29; they collapse as they are revisited.)

**Last Reviewed — backend:** 2026-08-06
**Last Reviewed — frontend:** never
**Overall quality:** Good — the backend that came out of the backlog campaign is the strongest code in the repo. The consistency pass found the DTO boundary intact in all five resources, one `@RestControllerAdvice` error path with no `try/catch` anywhere, `@Transactional` on every write and `readOnly = true` on every read, and every §8 business rule and state transition enforced with the right comparison and the right status — the ten rules on `time-entries` were traced individually and all pass. What this run found is a different class of problem from the last one: not missing features, but **two Highs at the edges the feature work never touched** — a PostgreSQL password and a seed manager's BCrypt hash that are still reachable in **pushed** history (`f17c01e`, `21f5221`, both on `origin/main`; the working tree is clean), and a `JwtFilter` catch clause that misses the `IllegalArgumentException` jjwt throws for an empty token, so `Authorization: Bearer ` answers 500 instead of the 401 `ErrorResponse` §10 promises. Both verified against the real code and history. Below them sit a group of "the plan never ruled on this" decisions (login throttling, a JWT subject bound to a mutable email, whether inactive-project *existence* is employee-visible) and one gap that matters for the step about to start: `TimeEntryResponse` carries no `projectId`, so Step 7b's edit dialog cannot round-trip a response into `PUT /api/entries/{id}`.

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

- [ ] **[Low]** `[backend]` — Append `te.user.id ASC` to `getHoursByUser`'s `ORDER BY`. `User.name` is not unique (§10 says so itself for `GET /api/users`, where `id` closes the order), so two users sharing a display name and the same monthly total can swap rows between two identical calls. `by-project` needs no change — §8's duplicate-name rule makes `Project.name` unique. §10's reports paragraph claims the name key makes the ordering total; correct that line with the fix *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Move the DRAFT-status guard in `TimeEntryService.update` to immediately after `findOwnedEntry`, before the project lookup. A PUT on a non-DRAFT entry with a non-existent `projectId` currently answers 404 "Project not found" where §10 says 409, and every refused call pays for a pointless query first *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Make `ProjectResponse.active` a primitive `boolean` (and drop the stray space before its `;`). The entity uses a primitive deliberately (§7 records the unboxing reason), so the DTO can serialise `"active": null` in a state the entity structurally cannot reach *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Close the two plan/code drifts §10 still carries on endpoints that are otherwise correct: the `PUT /api/projects/{id}` row documents only 200/404 but the code also returns 409 on a duplicate name (the Users `PUT` row documents its equivalent), and the `PUT /api/entries/{id}` row still names `CreateTimeEntryRequest` as the body although `UpdateTimeEntryRequest` was split out deliberately on 2026-07-29. Code is right in both; the plan is stale *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Route the duplicate-name race through the same contract as the check: catch `DataIntegrityViolationException` in `ProjectService.create`/`update` and rethrow `DuplicateResourceException("name", …)`. Today the check-then-insert path emits 409 **with** `fieldErrors.name` while the constraint path emits 409 **without** it, so a form binding `fieldErrors` shows a generic banner exactly when two requests interleave *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Unify the "does it already exist" idiom on `existsByX`. `ProjectService` uses `existsByName`; `UserService` materialises a whole row twice with `findByEmail(...).isPresent()`, and `DataInitializer` does the same. Add `boolean existsByEmail(String)` to `UserRepository` and keep `findByEmail` for the paths that need the entity *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Match the §7 column contract in the mappings: `@Column(nullable = false, updatable = false)` on the `@CreationTimestamp` fields, `@Column(nullable = false)` on `updatedAt`, and `@ColumnDefault("'DRAFT'")` on `TimeEntry.status`. §7 declares all three; the `active` flags already carry `@ColumnDefault("true")`, and with `ddl-auto=update` the rest generate nullable and defaultless. Residual of the 2026-07-28 not-null close, which covered the `active` fields only *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Move `DataInitializer`'s three `@Value` fields onto its existing constructor's parameters and make them `final`. The class already uses constructor injection for its two beans, so mixing the styles leaves it constructible in an invalid state — a direct `new` gets three nulls and `run()` would seed a user with a null email. Constructor injection is the convention in all five services *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Polish three small things the reviewers flagged with no behavioural impact: `TimeEntryService.delete` calls `deleteById(id)` on an entity it already loaded (use `delete(timeEntry)`); `TimeEntrySpecifications` is a static-utility class with a public implicit constructor (add a private one); and `TimeEntryController.findByFilter` is the only list endpoint not named `getAll`, though it is arguably a different operation — decide and be consistent *(Effort: Small)*
- [ ] **[Low]** `[backend]` — Fill or delete the Spring Initializr scaffold metadata still in `pom.xml`: empty `<name/>`, `<description/>`, and empty `<licenses>`, `<developers>`, `<scm>` blocks. It is the first thing a reviewer opening the build file sees *(Effort: Small)*

### Frontend

#### High

*No open High tasks.*

#### Medium

*No open Medium tasks.*

#### Low

*No open Low tasks.*

## Beyond the current gate

<!-- Findings the level-fit pass judged real but early: above the open gate and not strictly necessary
     for this project to be correct. Not tasks — no checkbox, no priority, no effort, never counted in
     the quality rating. Re-checked on every run: a line whose gate has moved leaves this section and
     becomes a normal task. -->

- **spring-boot / middle** `[backend]` — `TimeEntry` has no `@Version`, so the state machine's read-check-write guards are not atomic: two managers hitting ✓ and ✕ on the same SUBMITTED entry inside the same window both pass the status check, both write, and both receive 200 confirming their action. Optimistic locking appears in no junior coverage file (the nearest junior concept is SQL's "constraint vs application-side uniqueness check", which resolves a different race with a DB constraint), and the trigger needs genuine concurrent multi-user use, which a portfolio demo does not have *(raised 2026-08-06; due when the Spring Boot middle level is generated and its gate opens, or sooner if the app is ever demoed with two simultaneous managers)*

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

- 2026-08-23 · **[High]** `[backend]` — run contract documented: the three defaultless placeholders and the mandatory `dev` profile → coverage general/junior (new bullet + ✅ 07-timetrack), backend README Key patterns + How to run alone, global README How to run, PLANNING §18/§0
- 2026-08-23 · **[High]** `[backend]` — `JwtFilter` catch widened to `IllegalArgumentException`; a blank bearer token answers 401, not 500 → coverage spring-boot/junior, backend README Key patterns, PLANNING §0
- 2026-08-23 · **[High]** `[backend]` — datasource password and seed BCrypt hash published in `origin/main` rotated; history rewrite rejected — DECISION, no code change → PLANNING §9, backend README Tradeoffs, coverage security/junior
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

- 2026-08-25 · **[Medium]** `[backend]` — every endpoint declares its own `@PreAuthorize`, including the four any-authenticated ones → coverage: `security/junior` layered-authorisation and `spring-boot/junior` URL-vs-method bullets already marked ✅ 07-timetrack, nothing authored; PLANNING §6 backend layer rule + §0 count; backend README Key patterns; PROGRESS n/a. Verified in Postman: `GET /api/projects` `200` with an EMPLOYEE token, `401` `ErrorResponse` from `JwtAuthenticationEntryPoint` without one
- 2026-08-25 · **[Medium]** `[backend]` — datasource url and username externalised with local defaults; the app connects as the non-superuser role `timetrack_app` → coverage: `sql/junior` `GRANT`/`REVOKE` bullet marked ✅ 07-timetrack (`security/junior` least privilege and `spring-boot/junior` externalized configuration were already marked, no bullet authored); PLANNING §9 datasource-role subsection + §18 run contract + §0; backend README How to run alone (both `CREATE` statements) + env-var tables + Security considerations, global README requirements; PROGRESS SQL evidence cell. Verified in Postman: login `200`, `POST /api/projects` `201`, soft delete `204` and the `GET` showing `active: false`. Cold review corrected the prose: it is the `timetrack` **database**, not a `timetrack` schema
- 2026-08-24 · **[Medium]** `[backend]` — the JWT subject is the immutable `user.id`, not the editable email → coverage: new `security/junior` bullet "Immutable subject identity" (authored + marked ✅ 07-timetrack), `java/junior` string-number conversion marked (swept from the diff); PLANNING §10 token-subject ruling + §0 count; backend README Key patterns, plus the two entries the rename made false; PROGRESS. Verified in Postman: with the email reassigned to the manager, the employee's old token answers `403` on `GET /api/users` and still `200` on `GET /api/entries`. `/notes-plan security junior` owed
- 2026-08-24 · **[Medium]** `[backend]` — failed logins bounded per email and per client IP, `429` with a self-expiring cooldown → coverage: `security/junior` "Brute-force defence" marked ✅ 07-timetrack, `java/middle` thread-safety + synchronisation-primitives bullets marked (cross-level); PLANNING §10 login-throttling ruling + login row, §12 tree, §17 login error state, §21 test row, §0 count; backend README Key patterns + Tradeoffs; PROGRESS. Verified in Postman across 5 checks — threshold, reset on success, self-expiry, and the IP counter isolated with six unused emails
- 2026-08-24 · **[Medium]** `[backend]` — `GET /api/reports/summary` computed by one JPQL aggregate, not by loading the month's entities → coverage: new `spring-boot/junior` bullet "Aggregating in the database vs in memory" (authored + marked ✅ 07-timetrack), `sql/junior` conditional-aggregation and empty-input bullets marked; PLANNING §10 role-as-scope ruling + summary row, §12 tree; backend README Key patterns; PROGRESS. `/notes-plan spring-boot junior` owed
- 2026-08-24 · **[Medium]** `[backend]` — `TimeEntryResponse` carries `projectId`/`userId` beside the names → coverage architecture/junior (new bullet + ✅ 07-timetrack), backend README Key patterns, PLANNING §10/§12/§0
- 2026-08-24 · **[Medium]** `[backend]` — `GET /api/entries` accepts only `date`, `hours`, `status`, `id` as sort keys, 400 otherwise → coverage security/junior (new bullet "Indirect disclosure through result ordering" + ✅ 07-timetrack), backend README Key patterns, PLANNING §10/§0. Closed the `?sort=user.password` ordering channel and the 500-on-typo
- 2026-08-24 · **[Medium]** `[backend]` — an inactive project answers 404 on `POST`/`PUT /api/entries`, closing the projects-existence oracle → coverage security/junior (new bullet + ✅ 07-timetrack), backend README Key patterns, PLANNING §8/§10/§21/§0. The caller whose own entry already carries that project keeps the 400
- 2026-08-24 · **[Medium]** `[backend]` — self-demotion and self-deactivation refused on `PUT`/`DELETE /api/users/{id}` (409) → coverage security/junior (new bullet + ✅ 07-timetrack), backend README Key patterns, PLANNING §8/§10/§21/§0. An explicit last-active-MANAGER guard was written and then removed as unreachable by construction — §8 records the derivation, so it is not a missing check
- 2026-08-24 · **[Medium]** `[backend]` — user emails and project names canonicalised before the duplicate check and the write → coverage architecture/junior (new bullet + ✅ 07-timetrack), backend README Key patterns, PLANNING §6/§0
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

- 2026-08-26 · **[Low]** `[backend]` — a `newPassword` equal to the current one is refused 400 with `fieldErrors.newPassword` → PLANNING §8/§10/§12/§0, backend README Key patterns, global README, coverage security/junior + spring-boot/junior
- 2026-08-25 · **[Low]** `[backend]` — password policy constrains `newPassword` only, not the verified `currentPassword` → PLANNING §6, backend README Key patterns, coverage spring-boot/junior + security/junior + java/junior

- 2026-08-25 · **[Low]** `[backend]` — CSRF disablement justified: the bearer credential is never browser-attached — DECISION, no code change → backend README Security considerations, PLANNING §19
- 2026-08-25 · **[Low]** `[backend]` — CORS origins bound as `List<String>`; allowed headers narrowed to `Authorization`/`Content-Type` → coverage spring-boot/junior (new bullet + ✅) and security/junior (✅), backend README, PLANNING §6
- 2026-08-25 · **[Low]** `[backend]` — the public `permitAll` narrowed to `POST /api/auth/login`, so a later auth endpoint is born authenticated → coverage: new `spring-boot/junior` bullet "Matcher breadth on a public rule" (authored + marked ✅ 07-timetrack); PLANNING §6 public-route rule + §0; backend README Key patterns; PROGRESS. `/notes-plan spring-boot junior` owed
- 2026-08-25 · **[Low]** `[backend]` — a client-chosen `?sort=` keeps the `id` tie-breaker on `GET /api/entries` → coverage: new `spring-boot/junior` bullet "`@PageableDefault` is a default, not a floor" (authored + marked ✅ 07-timetrack); PLANNING §10 ordering rule + `/api/entries` row + §0; backend README Key patterns; PROGRESS. `/notes-plan spring-boot junior` owed
- 2026-08-25 · **[Low]** `[backend]` — the three report endpoints given one scale rule, owned by the query → coverage: new `sql/junior` expression-scale bullet + new `architecture/junior` serialised-shape bullet (both marked ✅ 07-timetrack), `sql/junior` `ROUND(value, n)` marked, `COALESCE` empty-input clause corrected; PLANNING §10 scale paragraph + both report rows, §0; backend README Key patterns; PROGRESS. `/notes-plan sql junior` and `/notes-plan architecture junior` owed
- 2026-08-25 · **[Low]** `[backend]` — `POST /api/projects` flushes before mapping, so the `201` carries the real `createdAt` → coverage spring-boot/junior (✅ 07-timetrack), backend README Key patterns, PLANNING §6/§0
- 2026-08-24 · **[Low]** `[backend]` — summary `BigDecimal` totals given a fixed scale 2 → closed inside the aggregate task: `COALESCE` + `setScale(2)`, PLANNING §10 row; spun off the cross-endpoint scale task
- 2026-08-24 · **[Low]** `[backend]` — `YearMonth` → `LocalDate` range extracted into a `MonthRange` record → closed inside the aggregate task; all three `ReportService` methods derive the range once
- 2026-08-01 · **[Low]** `[backend]` — promotion to MANAGER refused (409) while the user holds `DRAFT`/`REJECTED` entries, whose `submit`/`reopen` are EMPLOYEE-only; `SUBMITTED` deliberately does not block (§8 routes it to another manager) → coverage: new `architecture/junior` bullet "Actor-dependent transitions" (authored + marked ✅ 07-timetrack); PLANNING §8 rule beside :280, §10 `PUT /api/users/{id}` response column, §21 new `UserService.update` test row; backend README Key patterns; PROGRESS. Verified in Postman across 6 fixtures isolating each status. `/notes-plan architecture junior` owed
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
- 2026-08-25 · **[Low]** `[backend]` — `@ToString.Exclude` on `AuthResponse.token`, keeping a live bearer credential out of any generated `toString()` → security coverage/junior ("Security logging hygiene", already marked ✅ 07-timetrack by the twin close); backend README "Credentials excluded from generated `toString()`"; PLANNING §6 credential-DTO rule + §0 Low count. Verified in Postman: `POST /api/auth/login` answers `200` with the `token` still in the body
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
