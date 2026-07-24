# Middle Coverage — SQL

Concepts expected when a developer diagnoses query behaviour and maintains database structures beyond routine application queries.

## Query diagnosis

- `EXPLAIN ANALYZE` — compare planner estimates with actual execution while recognising that the statement really runs
- Plan operators and row estimates — identify scans, joins, sorts, and cardinality errors before guessing at an index
- Composite-index design — order columns according to real predicates, selectivity, and sorting needs

## Data modelling and advanced querying

- Normal forms and deliberate denormalisation — remove update anomalies and justify duplication only for a measured access pattern
- Recursive CTEs — traverse hierarchical or graph-shaped relational data with a safe termination condition
- Materialized views — trade freshness and refresh cost for precomputed expensive reads
- Locking and deadlock diagnosis — recognise competing lock order and design transactions that reduce contention
