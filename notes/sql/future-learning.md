# SQL — Future Learning Roadmap

Topics to study once the current files are solid. CTEs, window functions, transactions, DML, views, DDL, migrations-adjacent schema reasoning, index behaviour and reading a query plan are part of the **current junior goal** — see `coverage.md`.

---

## Phase 1 — After landing the first job

### Isolation levels beyond the default

Knowing that PostgreSQL defaults to read committed, and that a serialization failure is a normal outcome you retry rather than a bug, is part of the junior goal. What stays here is the full matrix: repeatable read, serializable, and exactly which anomaly (dirty read, non-repeatable read, phantom read) each one permits, plus predicate locks. Juniors are asked what the default is, not to choose a level.

### Reading a full `EXPLAIN ANALYZE` tree

Running `EXPLAIN ANALYZE` and comparing estimated against actual rows is in `coverage.md`. What remains post-junior is reading the whole plan tree: buffer counts, `loops=`, the choice between nested loop, hash join and merge join, and tuning `work_mem` or cost parameters to change the plan.

---

## Phase 2 — After 6–12 months

### Database normalisation as formal theory (1NF, 2NF, 3NF, BCNF)

Spotting a transitive dependency in a table is in `coverage.md` — interviewers show a denormalised table and ask what is wrong with it. What stays here is the formal apparatus: naming each normal form by number, functional dependencies, and BCNF. Useful vocabulary in an architecture discussion, never a junior filter.

### Index types beyond B-tree

GIN, GiST, BRIN and hash indexes, partial and expression indexes, covering indexes with `INCLUDE`, and full-text search with `tsvector` and `pg_trgm`. The junior goal stops at what a B-tree index does, when it helps and what it costs on writes.

### MVCC, `VACUUM` and table bloat

How PostgreSQL keeps multiple row versions, why an `UPDATE` writes a new tuple, what autovacuum reclaims, and transaction ID wraparound. This is the mechanism underneath several things already in coverage, but nobody screens a junior on it.

---

## Phase 3 — Mid-level

### Recursive CTEs

CTEs that reference themselves — used for hierarchical data like organisational charts, menu trees, or folder structures.

### Zero-downtime schema migrations

`CREATE INDEX CONCURRENTLY`, `NOT VALID` constraints, and the expand-contract pattern for changing a column on a large live table. Coverage already includes that `ALTER TABLE` takes an exclusive lock; the choreography to avoid it belongs here.

### `JSONB` modelling and indexing

Coverage includes the decision of `JSONB` versus a proper table. Querying inside a document with the `->`/`->>` operators, and indexing it with GIN, is the next layer.

### Advanced grouping and joins

`GROUPING SETS`, `ROLLUP`, `CUBE`, and `LATERAL` joins — real reporting tools that never appear in a junior screening.

### Partitioning, replication, and read replicas

Splitting a large table by range, streaming replication, replica lag as a debugging cause, and point-in-time recovery.

---

## What NOT to study prematurely

- **Database administration** — backup strategies, replication tuning, vacuum configuration. That is the DBA's job.
- **Query optimiser internals** — use `EXPLAIN` when you have a slow query; do not study the internals in advance.
- **PL/pgSQL, stored procedures and triggers** — an Oracle/PL-SQL-track skill, not the Spring Boot + Angular junior track.
- **Row-level security and multi-tenancy at the DB layer** — `CREATE POLICY`, schema-per-tenant. Architecture-level decisions taken above a junior.
- **External connection pooling (PgBouncer)** — application-side pooling is Spring Boot's HikariCP and is covered there; the infrastructure layer is post-junior.
- **NoSQL databases (MongoDB, Redis, Cassandra)** — completely different paradigm. Redis is worth a brief look (used as cache in Spring Boot), but do not deep-dive until the relational SQL foundation is solid.
