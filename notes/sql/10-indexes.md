# Indexes

An index is a data structure that makes lookups faster. Without an index, the database reads every row in the table to find a match — a **sequential scan**. With an index, it jumps directly to the relevant rows.

The trade-off: indexes speed up reads but slow down writes, because the index must be updated on every INSERT, UPDATE, and DELETE.

---

## How an index works (conceptual)

Think of the index at the back of a book. Without it, you read every page to find a topic. With it, you go directly to the right page. The database does the same — the index stores a sorted copy of the column values with pointers to the actual rows.

---

## Creating an index

```sql
-- Index on a single column
CREATE INDEX idx_books_author_id ON books(author_id);

-- Unique index — also enforces uniqueness
CREATE UNIQUE INDEX idx_customers_email ON customers(email);

-- Index on multiple columns (composite index)
CREATE INDEX idx_orders_customer_date ON orders(customer_id, created_at);
```

### Indexes that are created automatically

- **Primary key** — always indexed automatically
- **UNIQUE constraint** — creates a unique index automatically

You never need to manually add an index for `id` or `email UNIQUE` — they already have one.

---

## When to add an index

Add an index when a column is frequently used in:

| Clause | Why it helps |
|--------|-------------|
| `WHERE column = value` | Lookup by value instead of full scan |
| `JOIN ... ON column` | Foreign keys used in JOINs benefit greatly |
| `ORDER BY column` | Avoids sorting the full result |

```sql
-- These columns benefit from an index:
WHERE author_id = 5          → CREATE INDEX ON books(author_id)
JOIN authors ON author_id    → same index covers this
ORDER BY created_at DESC     → CREATE INDEX ON orders(created_at)
```

---

## When NOT to add an index

- **Small tables** — a sequential scan on 100 rows is faster than using an index
- **Columns with very few distinct values** — an index on a `status` column with only 3 values (`active`, `inactive`, `pending`) is rarely useful; the database will scan anyway
- **Columns updated very frequently** — the write penalty may outweigh the read benefit
- **Every column** — more indexes = slower writes and larger database size

---

## Checking if an index is being used — `EXPLAIN`

```sql
EXPLAIN SELECT * FROM books WHERE author_id = 5;
```

Look for `Index Scan` (using the index) vs `Seq Scan` (reading every row). If you see a sequential scan on a large table and you have an index, something is wrong — the query might not match the index shape.

---

## Quick reference

| Situation | Action |
|-----------|--------|
| Primary key column | Automatic — nothing to do |
| Foreign key column used in JOINs | Add an index |
| Column used in WHERE on a large table | Add an index |
| Column with few distinct values | Skip the index |
| Table with fewer than ~1000 rows | Usually no index needed |
