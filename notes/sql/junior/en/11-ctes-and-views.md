# CTEs and Views

Official docs — CTEs: [PostgreSQL WITH Queries](https://www.postgresql.org/docs/current/queries-with.html)
Official docs — Views: [PostgreSQL CREATE VIEW](https://www.postgresql.org/docs/current/sql-createview.html)

---

Two tools that make complex SQL readable and reusable: CTEs give a query a name inside a single statement; views give a query a name across the whole database.

---

## CTE — Common Table Expression

A CTE is a named temporary result set that you define at the top of a query using `WITH`. It only exists for the duration of that query.

**The problem it solves:** nested subqueries become unreadable fast.

```sql
-- Hard to read — nested subquery
SELECT author_id, book_count
FROM (
  SELECT author_id, COUNT(*) AS book_count
  FROM books
  WHERE price > 20
  GROUP BY author_id
) AS expensive_stats
WHERE book_count > 2;
```

```sql
-- Same query with a CTE — the name makes the intent clear
WITH expensive_stats AS (
  SELECT author_id, COUNT(*) AS book_count
  FROM books
  WHERE price > 20
  GROUP BY author_id
)
SELECT author_id, book_count
FROM expensive_stats
WHERE book_count > 2;
```

You reference the CTE like a table. The database runs the inner query first, names the result `expensive_stats`, and then the outer query uses it.

---

## Multiple CTEs

You can chain multiple CTEs by separating them with commas:

```sql
WITH
  recent_orders AS (
    SELECT id, customer_id, total_price
    FROM orders
    WHERE created_at > NOW() - INTERVAL '30 days'
  ),
  high_value_orders AS (
    SELECT customer_id, SUM(total_price) AS total
    FROM recent_orders
    GROUP BY customer_id
    HAVING SUM(total_price) > 500
  )
SELECT c.name, hvo.total
FROM customers c
JOIN high_value_orders hvo ON c.id = hvo.customer_id
ORDER BY hvo.total DESC;
```

The second CTE (`high_value_orders`) references the first (`recent_orders`) — you build the query step by step.

> **Performance note:** CTEs in PostgreSQL (before version 12) were always "optimisation fences" — the planner could not optimise across the CTE boundary. From version 12 onwards, the planner can inline simple CTEs. In practice, use CTEs for readability and let the database figure out performance.

---

## When to use a CTE vs a subquery

| Use a subquery when | Use a CTE when |
|--------------------|----------------|
| The logic is simple and inline | The logic has a clear name worth giving |
| Used only once and obvious | Reused multiple times in the same query |
| One level deep | Multiple levels of nesting would form |

There is no hard rule. The question to ask: "does giving this subquery a name make the query easier to understand?" If yes, use a CTE.

---

## VIEW — saved query

A view is a query saved in the database with a name. You query it like a table, but the database runs the underlying query every time.

```sql
-- Create the view once
CREATE VIEW books_with_authors AS
SELECT b.id, b.title, b.price, a.name AS author_name
FROM books b
JOIN authors a ON b.author_id = a.id;
```

```sql
-- Now use it anywhere like a table
SELECT * FROM books_with_authors WHERE price > 20;
SELECT author_name, COUNT(*) FROM books_with_authors GROUP BY author_name;
```

The view does not store data — it stores the query. Every time you select from the view, the JOIN runs live.

---

## Why use a view

- **Avoid repetition:** a complex JOIN used in 5 different queries becomes one definition
- **Simplify access:** team members can query `books_with_authors` without knowing the JOIN syntax
- **Security:** you can grant access to a view without granting access to the underlying tables

> A view is not a performance optimisation. If you need fast access to a pre-computed result, use a **materialized view** (`CREATE MATERIALIZED VIEW`) — it stores the result and must be refreshed manually with `REFRESH MATERIALIZED VIEW`. Regular views always run the query live.

---

## DROP VIEW

```sql
DROP VIEW books_with_authors;

-- Or, to avoid an error if it does not exist:
DROP VIEW IF EXISTS books_with_authors;
```

---

## Quick reference

| Tool | Scope | Stores data? | When to use |
|------|-------|--------------|-------------|
| CTE (`WITH`) | Single query | No | Complex query, readable steps |
| View | Whole database | No | Reusable query used in many places |
| Materialized view | Whole database | Yes | Pre-computed result, refreshed manually |
