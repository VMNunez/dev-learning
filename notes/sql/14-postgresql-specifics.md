# PostgreSQL Specifics

Docs: https://www.postgresql.org/docs/current/functions-datetime.html → read: "Date/Time Functions and Operators"

PostgreSQL has handy functions that are **not standard SQL** — they will not exist (or behave differently) in MySQL or SQL Server. These are the date and reporting helpers you reach for constantly. Interviewers coming from MySQL often ask about them.

> Some PostgreSQL-specific features are already covered elsewhere: the `::` cast operator and `ILIKE` in [04-where.md](./04-where.md), `DISTINCT ON` in [03-select.md](./03-select.md), and `RETURNING` in [08-dml.md](./08-dml.md). This file collects the date/aggregation helpers that did not have a home.

---

## NOW() vs CURRENT_DATE

```sql
SELECT NOW();           -- 2026-05-14 09:30:00.123+02  (full timestamp, with time and zone)
SELECT CURRENT_DATE;    -- 2026-05-14                  (today's date, no time)
```

- `NOW()` — the current timestamp, including time. Use it for `created_at` defaults and exact-moment filters.
- `CURRENT_DATE` — today's date with no time. Use it when you only care about the day.

A common default on a column:

```sql
created_at TIMESTAMPTZ DEFAULT NOW()
```

---

## INTERVAL — relative date ranges

`INTERVAL` lets you add or subtract a span of time. It is the clean way to write "the last 30 days" without hardcoding dates:

```sql
-- entries from the last 30 days
SELECT * FROM time_entries
WHERE entry_date >= NOW() - INTERVAL '30 days';

-- entries from the last month / year
WHERE entry_date >= NOW() - INTERVAL '1 month'
WHERE entry_date >= NOW() - INTERVAL '1 year';
```

The string takes a number plus a unit: `'7 days'`, `'2 weeks'`, `'3 months'`, `'1 year'`. You combine it with `NOW()` or `CURRENT_DATE` using `+` or `-`.

---

## DATE_TRUNC — group by month, day, or year

`DATE_TRUNC(unit, timestamp)` chops a timestamp down to the start of the given unit. Its main use is grouping rows by period in reports:

```sql
-- total hours per month
SELECT
  DATE_TRUNC('month', entry_date) AS month,
  SUM(hours) AS total_hours
FROM time_entries
GROUP BY DATE_TRUNC('month', entry_date)
ORDER BY month;
-- 2026-04-01 00:00:00 | 120
-- 2026-05-01 00:00:00 |  98
```

`DATE_TRUNC('month', ...)` turns every date in May into `2026-05-01`, so they all fall into one group. Swap the unit for `'day'`, `'week'`, or `'year'` the same way. Without it, `GROUP BY entry_date` would create a separate group for every distinct day.

---

## STRING_AGG — rows into one comma-separated string

`STRING_AGG(column, separator)` is an aggregate that concatenates values from many rows into a single string per group — the SQL way to produce a "list" column for a report:

```sql
-- one row per user, with all their project names on one line
SELECT
  u.name,
  STRING_AGG(p.name, ', ') AS projects
FROM users u
JOIN time_entries te ON te.user_id = u.id
JOIN projects p       ON p.id = te.project_id
GROUP BY u.name;
-- Ana   | TimeTrack, HR Portal, Billing
-- Luis  | TimeTrack
```

Because it is an aggregate, it needs `GROUP BY` like `SUM` or `COUNT`. Add `ORDER BY` inside it to control the order of the joined values: `STRING_AGG(p.name, ', ' ORDER BY p.name)`.

---

## Quick reference

| Function | What it does |
|---|---|
| `NOW()` | Current timestamp (date + time) |
| `CURRENT_DATE` | Today's date, no time |
| `NOW() - INTERVAL '30 days'` | A relative date range |
| `DATE_TRUNC('month', col)` | Truncate to the start of a period — for `GROUP BY` reports |
| `STRING_AGG(col, ', ')` | Concatenate grouped rows into one string |
