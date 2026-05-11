# SQL — Future Learning Roadmap

Topics to study once the current 10 files are solid. Nothing here is needed for the first interview — needed to work comfortably with databases in a professional team and grow into a mid-level developer.

---

## Phase 1 — After landing the first job

### Common Table Expressions (CTEs) — `WITH`

A named subquery at the top of a query. Easier to read than nested subqueries, and can be referenced multiple times:

```sql
WITH author_stats AS (
  SELECT author_id, COUNT(*) AS book_count
  FROM books
  GROUP BY author_id
),
top_authors AS (
  SELECT author_id
  FROM author_stats
  WHERE book_count > 2
)
SELECT a.name
FROM authors a
JOIN top_authors t ON a.id = t.author_id;
```

CTEs are especially useful in complex reports — each CTE is a named step that the final query assembles together.

### Transactions — `BEGIN`, `COMMIT`, `ROLLBACK`

A group of SQL statements that succeed or fail together. If any statement fails, everything is rolled back:

```sql
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

In Spring Boot, `@Transactional` manages this automatically — but understanding what it does at the SQL level makes debugging much easier. A transaction that was not committed leaves the database unchanged, which is why Spring Boot's `@Transactional` is on service methods, not on individual queries.

### `EXPLAIN` and `EXPLAIN ANALYZE`

Show how PostgreSQL executes a query:

```sql
EXPLAIN SELECT * FROM books WHERE author_id = 5;
EXPLAIN ANALYZE SELECT * FROM books WHERE author_id = 5;
```

`EXPLAIN` shows the plan without running the query. `EXPLAIN ANALYZE` runs it and shows real timing. Look for `Seq Scan` on large tables — it means no index is being used and a full table scan is happening.

---

## Phase 2 — After 6–12 months

### Window functions

Calculations across a set of rows related to the current row — without collapsing them like GROUP BY:

```sql
-- Rank books by price within each genre
SELECT title, genre, price,
  RANK() OVER (PARTITION BY genre ORDER BY price DESC) AS price_rank
FROM books;

-- Running total of sales per day
SELECT sale_date, amount,
  SUM(amount) OVER (ORDER BY sale_date) AS running_total
FROM sales;
```

Common functions: `RANK()`, `ROW_NUMBER()`, `LAG()`, `LEAD()`, `SUM() OVER`, `AVG() OVER`. Very useful for reporting queries.

### Database normalisation (1NF, 2NF, 3NF)

The formal theory behind why you split data into separate tables. First Normal Form: no repeating groups. Second Normal Form: no partial dependencies. Third Normal Form: no transitive dependencies. Knowing the vocabulary helps in architecture discussions and schema reviews.

---

## Phase 3 — Mid-level

### Recursive CTEs

CTEs that reference themselves — used for hierarchical data like organisational charts, menu trees, or folder structures.

### Materialized views

A view whose result is stored on disk and refreshed periodically. Useful for expensive aggregation queries that would be too slow to run on every request.

---

## What NOT to study prematurely

- **Database administration** — backup strategies, replication, vacuum, configuration tuning. That is the DBA's job.
- **Query optimiser internals** — use `EXPLAIN` when you have a slow query; do not study the internals in advance.
- **NoSQL databases (MongoDB, Redis, Cassandra)** — completely different paradigm. Redis is worth a brief look (used as cache in Spring Boot), but do not deep-dive until the relational SQL foundation is solid.
