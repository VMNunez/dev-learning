# Minimum Coverage — SQL

PostgreSQL. Focus on what appears in consultancy technical tests and interviews.

## Basics
- [ ] `SELECT`, `WHERE`, `ORDER BY`, `LIMIT` — the foundation of every query
- [ ] Comparison operators: `=`, `!=`, `>`, `<`, `BETWEEN`, `IN`, `LIKE`
- [ ] `NULL` handling: `IS NULL`, `IS NOT NULL`, `COALESCE`, `NULLIF`
- [ ] Aliases: `AS` for columns and tables

## JOINs
- [ ] `INNER JOIN` — only matching rows
- [ ] `LEFT JOIN` — all rows from the left, NULL when no match on the right
- [ ] `RIGHT JOIN` — all rows from the right
- [ ] `FULL OUTER JOIN` — all rows from both sides
- [ ] When to use LEFT JOIN to find records with no related data

## Aggregates and grouping
- [ ] Aggregate functions: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`
- [ ] `GROUP BY` — grouping before aggregating
- [ ] `HAVING` — filtering after aggregation (vs `WHERE` which filters before)
- [ ] The difference between `WHERE` and `HAVING` and when to use each

## Conditional logic
- [ ] `CASE WHEN condition THEN value ELSE value END` — conditional column values in SELECT
- [ ] Conditional aggregation: `SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END)` — pivot-style aggregates
- [ ] `COALESCE` in aggregation context — replacing NULL with a default in results

## Subqueries and CTEs
- [ ] Subquery in `WHERE`: `WHERE id IN (SELECT ...)`
- [ ] Subquery in `FROM`: using a query as a table
- [ ] `WITH` (CTE) — naming a subquery for clarity and reuse
- [ ] When a CTE is clearer than a nested subquery

## Window functions
- [ ] `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)`
- [ ] `RANK()` vs `ROW_NUMBER()` — behaviour on ties
- [ ] `LAG()` and `LEAD()` — comparing a row to the previous or next
- [ ] `SUM() OVER (PARTITION BY ...)` — running totals

## PostgreSQL specifics
- [ ] `SERIAL` and `BIGSERIAL` — auto-increment in PostgreSQL (vs `AUTO_INCREMENT` in MySQL)
- [ ] `RETURNING` clause — getting the inserted/updated row back in one query
- [ ] `DATE_TRUNC` — truncating dates for GROUP BY month/year
- [ ] `NOW()` and `CURRENT_DATE` — getting the current timestamp or date

## Performance basics
- [ ] What an index is and why it speeds up reads
- [ ] `EXPLAIN` — reading a basic query plan
- [ ] When NOT to use `SELECT *`
