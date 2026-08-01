# Middle Coverage — SQL

Concepts expected when a developer diagnoses query behaviour and maintains database structures beyond routine application queries.

## Query diagnosis

- `EXPLAIN ANALYZE` — compare planner estimates with actual execution while recognising that the statement really runs
- Plan operators and row estimates — identify scans, joins, sorts, and cardinality errors before guessing at an index
- Composite-index design — order columns according to real predicates, selectivity, and sorting needs
- Query rewrites — compare equivalent joins, correlated subqueries, pre-aggregation, and set-based formulations using measured plans rather than universal speed rules
- Partial, expression, and covering indexes — match specialised index structures to a measured predicate or access pattern

## Data modelling and advanced querying

- `DENSE_RANK()` vs `RANK()` — both give ties the same rank, but `DENSE_RANK()` does not leave gaps after a tie; choose it when the next distinct value must receive the next consecutive rank
- `LAG()` and `LEAD()` — access the previous or next row's value without a self-join; `LAG(hours)` returns the value from the previous row in the partition; use it for comparisons between consecutive rows
- Partition total vs running total — `SUM(value) OVER (PARTITION BY group_key)` repeats the whole partition total; adding `ORDER BY` and an explicit cumulative frame produces a running total
- Normal forms and deliberate denormalisation — remove update anomalies and justify duplication only for a measured access pattern
- Recursive CTEs — traverse hierarchical or graph-shaped relational data with a safe termination condition
- Views vs materialized views — a normal view stores a query and reads current base data, while a materialized view stores results and needs an explicit refresh; choose from freshness, read cost, and refresh cost
- Window frames — choose `ROWS`, `RANGE`, or `GROUPS` boundaries deliberately for cumulative and moving analytics, including peer-row behaviour
- Isolation anomalies — distinguish dirty reads, non-repeatable reads, phantom reads, and lost updates when selecting a transaction strategy
- PostgreSQL snapshot behaviour — reason about statement snapshots in `READ COMMITTED` and transaction snapshots in stronger isolation levels
- Row locking with `SELECT ... FOR UPDATE` — coordinate read-then-change workflows while keeping locked scopes and transaction duration small
- Locking and deadlock diagnosis — recognise competing lock order and design transactions that reduce contention
