# Spring Boot — Test 05: Employee API with Custom Queries

**Time limit:** 90 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Scenario

Build an employee management API with several endpoints that require custom queries. Some results cannot come from the default JPA methods — you need to write `@Query` or derived method names.

## Entities

**Department**
| Field | Type | Rules |
|-------|------|-------|
| id | Long | auto-generated |
| name | String | required, unique |

**Employee**
| Field | Type | Rules |
|-------|------|-------|
| id | Long | auto-generated |
| name | String | required |
| email | String | required, unique |
| salary | BigDecimal | required, must be > 0 |
| department | Department | many-to-one, required |
| hireDate | LocalDate | required |

## What to build

1. `GET /api/employees` — return all employees with their department name
2. `GET /api/employees?departmentId={id}` — filter by department (use the same endpoint, optional query param)
3. `GET /api/employees/salary-above?amount=30000` — return employees with salary greater than the given amount (use `@Query` or a derived method name)
4. `GET /api/departments/{id}/average-salary` — return the average salary of all employees in that department; return 404 if the department does not exist; return the average as a single number in the response
5. `POST /api/employees` — create an employee; validate salary > 0; return 404 if the departmentId does not exist
6. `DELETE /api/employees/{id}` — delete; return 404 if not found; return 204 on success

## Evaluation — what a good solution looks like

- [ ] Employee list includes the department name (not just the department id)
- [ ] Department filter is an optional query param on the same endpoint, not a separate one
- [ ] The salary-above endpoint uses a custom query — not fetching all employees and filtering in Java
- [ ] Average salary is calculated in the database (with `@Query` using `AVG`) — not in Java
- [ ] Creating an employee validates that the department exists before saving
- [ ] DTOs are used — entity relationships are not exposed directly in the response
- [ ] Custom queries are in the repository, not in the service

## Bonus (if done before time)

- Add `GET /api/employees/recent?months=3` — employees hired in the last N months
- Add `GET /api/departments` with each department's employee count
