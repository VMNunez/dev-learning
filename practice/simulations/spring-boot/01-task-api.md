# Spring Boot — Test 01: Task API

**Time limit:** 90 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Scenario

Build a simple task management REST API from scratch. Use Spring Boot, Spring Data JPA, and an H2 in-memory database (or PostgreSQL if you prefer).

## Entities

**Task**
| Field | Type | Rules |
|-------|------|-------|
| id | Long | auto-generated |
| title | String | required, min 3 characters |
| description | String | optional |
| status | Enum | TODO, IN_PROGRESS, DONE — default: TODO |
| createdAt | LocalDateTime | set automatically on creation |

## What to build

1. `GET /api/tasks` — return all tasks
2. `GET /api/tasks/{id}` — return one task; return 404 if not found
3. `POST /api/tasks` — create a task; validate title (required, min 3 chars); return 201 with the created task
4. `PUT /api/tasks/{id}/status` — update only the status field; return 400 if the status value is invalid; return 404 if task not found
5. `DELETE /api/tasks/{id}` — delete the task; return 404 if not found; return 204 on success

## Expected HTTP status codes

| Operation | Success | Error |
|-----------|---------|-------|
| GET all | 200 | — |
| GET by id | 200 | 404 |
| POST | 201 | 400 (validation) |
| PUT status | 200 | 400, 404 |
| DELETE | 204 | 404 |

## Evaluation — what a good solution looks like

- [ ] Entity, repository, service, and controller are in separate layers
- [ ] Validation is done with Bean Validation annotations (`@NotBlank`, `@Size`)
- [ ] 404 is returned using a custom exception or `ResponseEntity`
- [ ] `createdAt` is set automatically — not passed by the client
- [ ] The status update endpoint only changes the status, not the whole task
- [ ] DTOs are used — the entity is not returned directly from the controller
- [ ] The service contains the business logic, not the controller

## Bonus (if done before time)

- Add `GET /api/tasks?status=TODO` to filter tasks by status
- Add `updatedAt` that is updated automatically when the task is modified
