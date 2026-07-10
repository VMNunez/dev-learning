# SQL — Test 05: Inventory

**Time limit:** 45 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Schema

```sql
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    supplier_id INT REFERENCES suppliers(id)
);

CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    location VARCHAR(100) NOT NULL
);

CREATE TABLE stock (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    warehouse_id INT REFERENCES warehouses(id),
    quantity INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP NOT NULL
);
```

## Queries to write

1. Total stock per product across all warehouses
2. Products with zero total stock (sum of all warehouses = 0)
3. Products with total stock below 10 units — restock alert
4. The supplier with the most products in the catalog
5. Average unit price per category
6. Warehouses ranked by total stock value (quantity × unit_price) — highest first
7. Products that have no entry in the stock table at all — never stocked

## Evaluation — what a good solution looks like

- [ ] Query 1 uses SUM(quantity) + GROUP BY product_id with a JOIN to get the product name
- [ ] Query 2 uses HAVING SUM(quantity) = 0 — not WHERE quantity = 0
- [ ] Query 3 uses HAVING SUM(quantity) < 10
- [ ] Query 4 uses COUNT + GROUP BY supplier_id + ORDER BY + LIMIT 1
- [ ] Query 5 uses AVG + GROUP BY category
- [ ] Query 6 joins stock + products to get unit_price, then SUM(quantity * unit_price) per warehouse + ORDER BY
- [ ] Query 7 uses LEFT JOIN stock + WHERE stock.id IS NULL — not NOT IN

## Bonus (if done before time)

- Query 8: For each warehouse, the product with the highest stock value (quantity × unit_price)
- Query 9: Suppliers whose products are all out of stock
