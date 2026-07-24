# Aggregate Functions and GROUP BY

Aggregate functions calculate a single value from a set of rows — a count, a total, an average.

---

## The five aggregate functions

```sql
SELECT
  COUNT(*)            -- number of rows
  COUNT(price)        -- number of non-NULL values in price
  SUM(price)          -- total of all prices
  AVG(price)          -- average price
  MIN(price)          -- lowest price
  MAX(price)          -- highest price
FROM books;
```

### NULL handling

`COUNT(*)` counts all rows including NULLs.
`COUNT(column)` counts only non-NULL values in that column.
`SUM`, `AVG`, `MIN`, `MAX` all **ignore NULL values** automatically.

```sql
-- price values: 10, 20, NULL, 30
COUNT(*)      → 4
COUNT(price)  → 3   (NULL is not counted)
SUM(price)    → 60  (NULL is ignored, not treated as 0)
AVG(price)    → 20  (60 / 3, not 60 / 4)
```

---

## GROUP BY — one row per group

Without `GROUP BY`, aggregate functions collapse the entire table into one row.
With `GROUP BY`, they collapse each group into one row.

```sql
-- How many books does each author have?
SELECT author_id, COUNT(*) AS book_count
FROM books
GROUP BY author_id;
```

| author_id | book_count |
|-----------|-----------|
| 1         | 2         |
| 2         | 1         |

**Rule:** every column in `SELECT` must either be in `GROUP BY` or inside an aggregate function.

```sql
-- ✅ correct
SELECT author_id, COUNT(*)
FROM books
GROUP BY author_id;

-- ❌ error — title is not grouped or aggregated
SELECT author_id, title, COUNT(*)
FROM books
GROUP BY author_id;
```

### GROUP BY with JOIN

```sql
-- Book count per author name
SELECT a.name, COUNT(b.id) AS book_count
FROM authors a
LEFT JOIN books b ON b.author_id = a.id
GROUP BY a.id, a.name
ORDER BY book_count DESC;
```

Use `LEFT JOIN` so authors with zero books still appear (with `COUNT = 0`).
Include all non-aggregated columns in `GROUP BY` — here `a.id` and `a.name`.

---

## HAVING — filter groups

`WHERE` filters rows before grouping. `HAVING` filters groups after grouping.

```sql
-- Authors with more than 2 books
SELECT author_id, COUNT(*) AS book_count
FROM books
GROUP BY author_id
HAVING COUNT(*) > 2;
```

### WHERE vs HAVING

| | WHERE | HAVING |
|---|-------|--------|
| Runs | Before GROUP BY | After GROUP BY |
| Filters | Individual rows | Groups |
| Can use aggregates? | No | Yes |

```sql
-- Books published after 2000, grouped by author,
-- only show authors with more than 1 such book
SELECT author_id, COUNT(*) AS recent_books
FROM books
WHERE published_year > 2000        -- filter rows first
GROUP BY author_id
HAVING COUNT(*) > 1;               -- then filter groups
```

---

## Full execution order

`FROM + JOIN` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`

This explains why:
- You cannot use a `SELECT` alias in `WHERE` or `HAVING` — it does not exist yet
- You can use a `SELECT` alias in `ORDER BY` — it runs after `SELECT`

---

## Common patterns

```sql
-- Total revenue per customer
SELECT customer_id, SUM(total_price) AS revenue
FROM orders
GROUP BY customer_id
ORDER BY revenue DESC;

-- Average book price per genre
SELECT genre, ROUND(AVG(price), 2) AS avg_price
FROM books
GROUP BY genre;

-- Count rows with a condition using FILTER (PostgreSQL)
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE price > 20) AS expensive
FROM books;
```
