# SQL — ORDER BY and LIMIT

Official docs: [PostgreSQL ORDER BY](https://neon.com/postgresql/postgresql-tutorial/postgresql-order-by)

---

## ORDER BY — sort rows

`ORDER BY` sorts the result. Default direction is ascending (`ASC`).

```sql
-- Cheapest first
SELECT * FROM books ORDER BY price ASC;

-- Most expensive first
SELECT * FROM books ORDER BY price DESC;
```

You can sort by multiple columns:

```sql
-- Sort by author, then by price within the same author
SELECT * FROM books ORDER BY author_id ASC, price DESC;
```

You can also sort by an expression. `ORDER BY` is evaluated after `SELECT`, so you can use a column alias:

```sql
SELECT title, LENGTH(title) AS title_length
FROM books
ORDER BY title_length DESC;
```

---

## NULL values in ORDER BY

`NULL` means "unknown" or "missing data". When you sort a column that has NULLs:

- `ASC` → NULLs go **last** by default
- `DESC` → NULLs go **first** by default

You can override this with `NULLS FIRST` or `NULLS LAST`:

```sql
-- NULLs at the end, even with DESC
SELECT * FROM books ORDER BY price DESC NULLS LAST;

-- NULLs at the start, even with ASC
SELECT * FROM books ORDER BY price ASC NULLS FIRST;
```

---

## LIMIT — limit the number of rows

`LIMIT` stops the query after N rows. Useful when you only need the top results.

```sql
-- The 3 most expensive books
SELECT * FROM books ORDER BY price DESC LIMIT 3;
```

Always use `ORDER BY` with `LIMIT`. Without it, the rows come back in an unspecified order and results are unpredictable.

---

## OFFSET — skip rows

`OFFSET` skips N rows before returning results. Used together with `LIMIT` to build pagination.

```sql
-- Skip the first 3 books, then return the next 3
SELECT * FROM books ORDER BY price DESC LIMIT 3 OFFSET 3;
```

How pagination works in practice:

| Page | Query |
|------|-------|
| Page 1 | `LIMIT 3 OFFSET 0` |
| Page 2 | `LIMIT 3 OFFSET 3` |
| Page 3 | `LIMIT 3 OFFSET 6` |

Formula: `OFFSET = (page - 1) * page_size`

---

## FETCH — the SQL standard alternative to LIMIT

`FETCH` does exactly the same as `LIMIT`, but it follows the SQL standard (SQL:2008).
In PostgreSQL you will usually see `LIMIT`. Use `FETCH` if you need your code to work on other databases too.

```sql
-- Same as: ORDER BY price DESC LIMIT 3
SELECT * FROM books ORDER BY price DESC FETCH FIRST 3 ROWS ONLY;

-- With offset — same as: LIMIT 3 OFFSET 3
SELECT * FROM books ORDER BY price DESC OFFSET 3 ROWS FETCH NEXT 3 ROWS ONLY;
```

---

## Execution order

SQL evaluates clauses in this order, not the order you write them:

```
FROM → WHERE → SELECT → ORDER BY → LIMIT
```

This is why:
- You **can** use a column alias in `ORDER BY` (runs after SELECT)
- You **cannot** use a column alias in `WHERE` (runs before SELECT)

---

## Summary

| Clause | Purpose |
|--------|---------|
| `ORDER BY col ASC` | sort ascending (default) |
| `ORDER BY col DESC` | sort descending |
| `NULLS FIRST` / `NULLS LAST` | control where NULLs appear |
| `LIMIT n` | return only the first n rows |