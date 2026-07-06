# Window Functions

Docs: https://www.postgresql.org/docs/current/tutorial-window.html → read: "Window Functions"

A window function runs a calculation across a set of rows **without collapsing them into one row** the way `GROUP BY` does. With `GROUP BY` you get one row per group; with a window function you keep every row and add an extra column computed over a "window" of related rows.

The window is defined by `OVER (...)`:

- `PARTITION BY` — split the rows into groups (like `GROUP BY`, but rows are kept)
- `ORDER BY` — order the rows inside each partition (needed for ranking and running totals)

---

## ROW_NUMBER() — number the rows in each group

`ROW_NUMBER()` assigns a unique sequential number to each row within its partition, following the `ORDER BY`:

```sql
SELECT
  user_id,
  entry_date,
  hours,
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY entry_date DESC) AS rn
FROM time_entries;
-- each user's rows are numbered 1, 2, 3... with their newest entry as 1
```

### The "latest row per group" pattern

This is one of the most common interview questions: *"get the most recent time entry for each user"*. You number the rows newest-first, then keep only number 1 in an outer query (a CTE or subquery, because you cannot use a window function in `WHERE`):

```sql
WITH ranked AS (
  SELECT
    *,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY entry_date DESC) AS rn
  FROM time_entries
)
SELECT * FROM ranked WHERE rn = 1;
-- exactly one row per user — their latest entry
```

> Why the CTE? Window functions are computed *after* `WHERE` in the execution order (see [03-select.md](./03-select.md)), so you cannot filter on `rn` in the same query — you wrap it and filter in the outer step.

---

## RANK() vs ROW_NUMBER() — ties

Both number rows, but they treat ties differently:

```sql
-- prices: 30, 30, 20
ROW_NUMBER() → 1, 2, 3   -- always unique, even for equal values
RANK()       → 1, 1, 3   -- ties share a number, then it SKIPS the next
DENSE_RANK() → 1, 1, 2   -- ties share a number, no gap
```

- Use **`ROW_NUMBER()`** when you need exactly one row per group (the "latest per user" pattern above).
- Use **`RANK()`** when ties should genuinely share a position (a leaderboard where two people tie for 1st, and the next is 3rd).

---

## LAG() and LEAD() — look at the previous / next row

`LAG()` returns a value from the **previous** row in the partition; `LEAD()` from the **next** row — without a self-join.

```sql
SELECT
  entry_date,
  hours,
  LAG(hours) OVER (ORDER BY entry_date) AS previous_hours,
  hours - LAG(hours) OVER (ORDER BY entry_date) AS change
FROM time_entries;
-- compare each entry's hours with the one before it
```

The first row has no previous row, so `LAG` returns `NULL` there (you can pass a default: `LAG(hours, 1, 0)`).

---

## SUM() OVER (...) — running total

A normal `SUM(...)` with `GROUP BY` collapses the rows. `SUM(...) OVER (...)` keeps every row and adds a **cumulative** column alongside the data:

```sql
SELECT
  entry_date,
  hours,
  SUM(hours) OVER (PARTITION BY user_id ORDER BY entry_date) AS running_total
FROM time_entries;
-- each row shows the hours so far for that user up to and including that date
```

Without `ORDER BY` inside `OVER`, `SUM() OVER (PARTITION BY user_id)` gives the **total per user repeated on every row** (no accumulation) — useful for "this row's hours vs the user's total".

---

## Window function vs GROUP BY — the key difference

| | `GROUP BY` | Window function |
|---|---|---|
| Rows in result | One per group | Every original row kept |
| Extra column | The aggregate only | Aggregate **alongside** the row data |
| Filter the result | `HAVING` | wrap in a CTE/subquery and use `WHERE` |

The interview line: "use `GROUP BY` when you want one summary row per group; use a window function when you need the per-group calculation **next to each original row** — like ranking or a running total."
