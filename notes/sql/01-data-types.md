# SQL — Data Types

Official docs: [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)

---

Every column in a table has a type. The type tells the database what kind of data is allowed and how to store it. Choosing the wrong type causes real problems — rounding errors with money, wasted storage, or queries that behave unexpectedly.

---

## Character types

You use text types for anything that is not a number or a date.

| Type | When to use |
|------|-------------|
| `CHAR(n)` | Fixed length — always the same number of characters (e.g. country code `'ES'`, `'UK'`) |
| `VARCHAR(n)` | Variable length with a maximum — the most common choice for names, titles, emails |
| `TEXT` | No length limit — for long content like descriptions, comments, blog posts |

> In PostgreSQL, `VARCHAR` and `TEXT` have identical storage performance. The only real reason to use `VARCHAR(n)` is to document intent — "this value should not exceed N characters."

---

## Numeric types

| Type | When to use |
|------|-------------|
| `SMALLINT` | Small whole numbers (-32,768 to 32,767) — rarely needed |
| `INT` | Default choice for whole numbers |
| `SERIAL` | Auto-incrementing integer — use for primary keys |
| `NUMERIC(p,s)` | Exact decimal numbers — **always use for money and prices** |
| `REAL` / `FLOAT` | Approximate decimals — for scientific data, **never for money** |

`NUMERIC(p,s)` — `p` is total digits, `s` is digits after the decimal point.
Example: `NUMERIC(10,2)` → stores values up to `99999999.99` exactly.

> **Why not FLOAT for money?** `FLOAT` is an approximation — even simple values like `0.1` cannot be represented exactly in binary floating point. This causes rounding errors that compound over time. A total that should be `€100.00` might show as `€99.9999999`. Use `NUMERIC(10,2)` for any column that holds a price, amount, or financial value.

---

## Date and time types

| Type | When to use |
|------|-------------|
| `DATE` | A date only — year, month, day (e.g. birthdays, deadlines) |
| `TIMESTAMP` | Date and time, no time zone — stores exactly what you put in |
| `TIMESTAMPTZ` | Date and time **with time zone** — converts to UTC on write, back on read |

`TIMESTAMP` stores `2024-06-15 14:30:00` exactly as entered. If a user in Madrid and a user in Tokyo both write at the same moment, their timestamps will look different.

`TIMESTAMPTZ` stores the moment in UTC internally and converts to the session time zone when you read it. For web applications where users can be in different time zones, **use `TIMESTAMPTZ` for `created_at`, `updated_at`, and any event timestamp**.

> This is a common PostgreSQL interview question. Most developers default to `TIMESTAMP` without thinking about time zones. Using `TIMESTAMPTZ` shows you have built real web applications.

---

## Boolean

`BOOLEAN` stores `true` or `false`. Use it for flags and yes/no fields.

```sql
is_active BOOLEAN DEFAULT true
has_discount BOOLEAN DEFAULT false
```

> PostgreSQL accepts several ways to write booleans in queries: `true`, `'t'`, `'yes'`, `'on'`, `1` — and their false equivalents. In practice, always use `true` and `false` to keep it readable.

---

## Which type to pick — quick reference

| You are storing | Use |
|-----------------|-----|
| Auto-generated ID | `SERIAL` |
| Name, title, email | `VARCHAR(n)` |
| Long description | `TEXT` |
| Whole number | `INT` |
| Money / price | `NUMERIC(10,2)` |
| Percentage, scientific | `FLOAT` |
| True/false flag | `BOOLEAN` |
| Date only | `DATE` |
| Date + time (web app) | `TIMESTAMPTZ` |
| Date + time (local, no TZ) | `TIMESTAMP` |
