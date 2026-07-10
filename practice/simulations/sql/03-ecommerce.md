# SQL — Test 03: E-commerce

**Time limit:** 45 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Schema

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    country VARCHAR(50)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    order_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL  -- PENDING, CONFIRMED, CANCELLED
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL
);
```

## Queries to write

1. Total revenue per month — show year, month, and total revenue (quantity × unit_price)
2. Top 5 products by total revenue
3. Customers who have never placed an order
4. Average order value per customer — only customers with at least one order
5. Most popular product category by total quantity sold
6. Orders that contain more than 3 different products
7. Total revenue for the current month vs the previous month — show both in one row

## Evaluation — what a good solution looks like

- [ ] Query 1 uses DATE_TRUNC or EXTRACT to group by year + month
- [ ] Query 2 uses SUM(quantity * unit_price) + ORDER BY + LIMIT 5
- [ ] Query 3 uses LEFT JOIN + WHERE IS NULL or NOT EXISTS
- [ ] Query 4 uses AVG of order totals (requires a subquery or CTE)
- [ ] Query 5 uses GROUP BY category + SUM(quantity)
- [ ] Query 6 uses GROUP BY order_id + HAVING COUNT(DISTINCT product_id) > 3
- [ ] Query 7 uses conditional aggregation or two CTEs compared in one SELECT

## Bonus (if done before time)

- Query 8: Customers who placed orders in both January and February of the same year
- Query 9: For each country, the top-selling product category
