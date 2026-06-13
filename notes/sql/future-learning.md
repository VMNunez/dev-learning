# SQL — Future Learning Roadmap

Topics to study once the current files are solid. CTEs, window functions, transactions, DML, views, and PostgreSQL-specific syntax are part of the **current junior goal** — see `coverage.md`.

---

## Phase 1 — After landing the first job

### `EXPLAIN ANALYZE`

`EXPLAIN` (reading the query plan) is part of the junior goal — see `coverage.md`.

`EXPLAIN ANALYZE` goes further: it actually runs the query and shows real execution times alongside the plan. Use it when `EXPLAIN` alone does not tell you why a query is slow.

```sql
EXPLAIN ANALYZE SELECT * FROM time_entries WHERE user_id = 5;
```

Look for `Seq Scan` on large tables — it means no index is being used. The `actual time=` values show where the bottleneck is.

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
