# Spring Boot — Test 04: Order API with Service Layer Logic

**Time limit:** 90 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Scenario

Build an order management API. The business logic lives in the service layer: the total is calculated there, not in the controller and not in the client. Products are pre-seeded — you do not need to build a product API.

## Entities

**Product** (pre-seeded — create the entity and seed 3–4 products in a data initializer)
| Field | Type |
|-------|------|
| id | Long |
| name | String |
| price | BigDecimal |

**Order**
| Field | Type | Rules |
|-------|------|-------|
| id | Long | auto-generated |
| customerName | String | required |
| status | Enum | PENDING, CONFIRMED, CANCELLED — default: PENDING |
| createdAt | LocalDateTime | set automatically |

**OrderItem**
| Field | Type | Rules |
|-------|------|-------|
| id | Long | auto-generated |
| order | Order | many-to-one |
| product | Product | many-to-one |
| quantity | Integer | required, must be >= 1 |

## What to build

1. `POST /api/orders` — create an order. The request body contains `customerName` and a list of `{ productId, quantity }`. The service must: fetch each product, create the order items, and calculate the total. Return 400 if any productId does not exist.
2. `GET /api/orders/{id}` — return the order with its items and the calculated total
3. `PUT /api/orders/{id}/confirm` — change status from PENDING to CONFIRMED. Return 409 if the order is not currently PENDING.
4. `PUT /api/orders/{id}/cancel` — change status to CANCELLED. Return 409 if the order is CONFIRMED.

## Expected response for GET /api/orders/{id}

```json
{
  "id": 1,
  "customerName": "Ana García",
  "status": "CONFIRMED",
  "createdAt": "2026-06-12T10:00:00",
  "items": [
    { "productName": "Laptop Pro", "quantity": 1, "unitPrice": 1200.00, "subtotal": 1200.00 },
    { "productName": "USB-C Hub", "quantity": 2, "unitPrice": 45.00, "subtotal": 90.00 }
  ],
  "total": 1290.00
}
```

## Evaluation — what a good solution looks like

- [ ] Total is calculated in the service, not in the controller or entity
- [ ] The request body does not include the total — it is calculated server-side
- [ ] 400 is returned if a productId does not exist
- [ ] 409 is returned when trying to confirm a non-PENDING order
- [ ] 409 is returned when trying to cancel a CONFIRMED order
- [ ] The response DTO includes the total and item subtotals
- [ ] OrderItem has a many-to-one relationship with both Order and Product

## Bonus (if done before time)

- Add `GET /api/orders?status=PENDING` to filter orders by status
- Add validation: quantity must be at least 1 and the order must have at least one item
