# Spring Boot — Test 03: User API with Business Logic

**Time limit:** 90 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Scenario

Build a user management API. The key business rules are: email must be unique, and deletion is soft (the user is deactivated, not removed from the database).

## Entities

**User**
| Field | Type | Rules |
|-------|------|-------|
| id | Long | auto-generated |
| name | String | required |
| email | String | required, unique |
| role | Enum | USER, ADMIN — default: USER |
| active | Boolean | default: true |
| createdAt | LocalDateTime | set automatically |

## What to build

1. `GET /api/users` — return all **active** users only
2. `GET /api/users/{id}` — return one user (including inactive); return 404 if not found
3. `POST /api/users` — create a user; return 409 if the email already exists
4. `DELETE /api/users/{id}` — soft delete: set `active = false`, do **not** remove from DB; return 404 if not found; return 204 on success
5. `GET /api/users/admins` — return only users with role ADMIN (active only)

## Evaluation — what a good solution looks like

- [ ] `GET /api/users` returns only active users — not all users in the table
- [ ] Soft delete sets `active = false` and does not call `delete()` on the repository
- [ ] 409 is returned when creating a user with a duplicate email
- [ ] The duplicate email check is done in the service, not the controller
- [ ] `createdAt` is set automatically — not received from the client
- [ ] DTOs are used — do not expose the entity directly
- [ ] `GET /api/users/admins` filters by both role and active status

## Bonus (if done before time)

- Add `PUT /api/users/{id}/role` — change the role of a user (ADMIN only, but you can skip the auth check)
- Add `GET /api/users/inactive` — return all soft-deleted users
