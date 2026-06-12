# Spring Boot — Test 02: Product API with Pagination

**Time limit:** 90 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Scenario

Build a product catalog REST API. The key requirement is that the list endpoint must support pagination and filtering by category — both at the same time.

## Entities

**Product**
| Field | Type | Rules |
|-------|------|-------|
| id | Long | auto-generated |
| name | String | required |
| price | BigDecimal | required, must be > 0 |
| category | String | required |
| stock | Integer | required, must be >= 0 |

## What to build

1. `GET /api/products?page=0&size=10` — return a paginated list of products
2. `GET /api/products?page=0&size=10&category=Electronics` — same, filtered by category (combine with pagination)
3. `POST /api/products` — create a product with full validation; return 201
4. `PUT /api/products/{id}` — full update; return 404 if not found
5. `DELETE /api/products/{id}` — delete; return 404 if not found; return 204 on success

## Expected response for the paginated list

The response should include the list of products, the current page, total pages, and total elements. Use Spring's `Page<T>` — it gives you all of this automatically.

## Evaluation — what a good solution looks like

- [ ] Pagination works with `Pageable` — page and size come from query params
- [ ] Category filter works alongside pagination (not as a separate endpoint)
- [ ] Validation rejects negative prices and negative stock
- [ ] Full update replaces all fields, not just the ones sent
- [ ] DTOs are used — `ProductResponseDto` for responses, `ProductRequestDto` for the body
- [ ] The service handles the `Pageable` and filtering logic, not the controller
- [ ] 404 is returned properly when product is not found

## Bonus (if done before time)

- Add `GET /api/products/out-of-stock` — return all products where stock = 0
- Add sorting: `GET /api/products?sort=price,asc`
