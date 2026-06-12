# SQL — Future Learning Roadmap

Topics to study once the current files are solid. CTEs, window functions, and PostgreSQL-specific syntax are part of the **current junior goal** — see `coverage.md`.

---

## Phase 1 — After landing the first job

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
