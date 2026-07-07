# Project Backlog — TimeTrack

Improvement tasks for this project, written by `notes/prompts/projects/review/review-audit.md`.
Completed tasks stay checked off (✅) — never delete them, only add or update.

**Last Reviewed:** 2026-07-06
**Overall quality:** Needs work — layered architecture is followed correctly, but role checks are applied inconsistently and one entity leaks past the DTO boundary.

## Tasks

- [ ] **[High]** — Add `@PreAuthorize("hasRole('MANAGER')")` to `GET /api/users` in `UserController` — currently any authenticated user (including EMPLOYEE) can list all users, contradicting PLANNING.md's "Users (Manager only)" spec *(Effort: Small)*
- [ ] **[High]** — Create a `UserResponse` DTO and map to it in `UserController`/`UserService` instead of returning the `User` entity directly — the raw entity currently exposes the BCrypt password hash in the JSON response *(Effort: Small)*
- [ ] **[High]** — Add `@PreAuthorize("hasRole('MANAGER')")` to `PUT /api/projects/{id}` and `DELETE /api/projects/{id}` in `ProjectController` — only `POST` currently has the check, so an EMPLOYEE token can edit or deactivate any project today *(Effort: Small)*
- [x] **[High]** — Create `ResourceNotFoundException` (planned in PLANNING.md's folder structure but never added) and throw it from `ProjectService.getById/update/delete` instead of generic `RuntimeException`; add a handler for it in `GlobalExceptionHandler` returning 404 — right now a missing id falls through to a default 500 *(Effort: Small)* — ✅ done 2026-07-07: also extended to `TimeEntryService`; added `BusinessRuleViolationException` (400) for domain rule violations, and a generic `RuntimeException` catch-all (500) as a safety net
- [ ] **[Medium]** — Filter `GET /api/projects` by role in `ProjectService.getAll()` — PLANNING.md's REST API spec says employees should see only active projects while managers see active + inactive; currently everyone sees everything *(Effort: Small)*
- [ ] **[Low]** — Confirm `spring.jpa.show-sql=true` in `application.properties` is intentional for local dev — fine to keep for now, but flag before considering the backend portfolio-ready *(Effort: Small)*
