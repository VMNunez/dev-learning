# Project Backlog — TimeTrack

Improvement tasks for this project, written by `notes/prompts/projects/review/review-audit.md`.
Completed tasks stay checked off (✅) — never delete them, only add or update.

**Last Reviewed:** 2026-07-06
**Overall quality:** Needs work — layered architecture is followed correctly, but role checks are applied inconsistently and one entity leaks past the DTO boundary.

## Tasks

- [ ] **[High]** — Add `@PreAuthorize("hasRole('MANAGER')")` to `GET /api/users` in `UserController` — currently any authenticated user (including EMPLOYEE) can list all users, contradicting PLANNING.md's "Users (Manager only)" spec *(Effort: Small)*
- [ ] **[High]** — Create a `UserResponse` DTO and map to it in `UserController`/`UserService` instead of returning the `User` entity directly — the raw entity currently exposes the BCrypt password hash in the JSON response *(Effort: Small)*
- [x] **[High]** — Add `@PreAuthorize("hasRole('MANAGER')")` to `PUT /api/projects/{id}` and `DELETE /api/projects/{id}` in `ProjectController` — only `POST` currently has the check, so an EMPLOYEE token can edit or deactivate any project today *(Effort: Small)* — ✅ done 2026-07-08
- [x] **[High]** — Create `ResourceNotFoundException` (planned in PLANNING.md's folder structure but never added) and throw it from `ProjectService.getById/update/delete` instead of generic `RuntimeException`; add a handler for it in `GlobalExceptionHandler` returning 404 — right now a missing id falls through to a default 500 *(Effort: Small)* — ✅ done 2026-07-07: also extended to `TimeEntryService`; added `BusinessRuleViolationException` (400) for domain rule violations, and a generic `RuntimeException` catch-all (500) as a safety net
- [x] **[Medium]** — Filter `GET /api/projects` by role in `ProjectService.getAll()` — PLANNING.md's REST API spec says employees should see only active projects while managers see active + inactive; currently everyone sees everything *(Effort: Small)* — ✅ done 2026-07-08: added `findByActiveTrue()` to `ProjectRepository`, branch on role read from `SecurityContextHolder` authorities
- [ ] **[Low]** — Confirm `spring.jpa.show-sql=true` in `application.properties` is intentional for local dev — fine to keep for now, but flag before considering the backend portfolio-ready *(Effort: Small)*
- [ ] **[Medium]** — Add Bean Validation (`@NotBlank`, `@NotNull`, etc.) to request DTOs and `@Valid` on controller method params — only `LoginRequest` has validation annotations today; `CreateProjectRequest`, `UpdateProjectRequest`, `CreateTimeEntryRequest` and others accept blank/null fields with no 400 response, even though `GlobalExceptionHandler.handleValidation` is already wired up and unused *(Effort: Medium)*
- [x] **[High]** — Add an `@ExceptionHandler(AccessDeniedException.class)` in `GlobalExceptionHandler` returning 403 — right now the generic `RuntimeException` catch-all intercepts `AccessDeniedException` first (it's a `RuntimeException` with no specific handler), so any `@PreAuthorize` rejection returns 500 instead of 403; confirmed via `DELETE /api/projects/{id}` with an EMPLOYEE token *(Effort: Small)* — ✅ done 2026-07-09: also introduced a unified `ErrorResponse` DTO (timestamp/status/error/message/fieldErrors + `@JsonInclude(NON_NULL)`) across every `@ExceptionHandler`, replacing inconsistent `Map.of("error", ...)` / `Map.of("errors", ...)` shapes
- [ ] **[Medium]** — Run a full Postman test pass over every endpoint built so far (auth, projects, entries) — happy path + error cases (401/403/404/400) for each, to surface bugs like the `AccessDeniedException` 500 above before moving further into Step 5 *(Effort: Medium)*
