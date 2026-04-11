# SQL — Data Types

## Character types

| Type | When to use |
|------|-------------|
| `CHAR(n)` | Fixed length — always the same number of characters (e.g. country code `ES`, `UK`) |
| `VARCHAR(n)` | Variable length with a maximum — most common choice (names, titles, emails) |
| `TEXT` | No length limit — for long content (descriptions, comments, blog posts) |

## Numeric types

| Type | When to use |
|------|-------------|
| `SMALLINT` | Small whole numbers (-32,768 to 32,767) — rarely needed |
| `INT` | Default choice for whole numbers |
| `SERIAL` | Auto-incrementing integer — use for primary keys |
| `NUMERIC(p,s)` | Exact decimal numbers — always use for money and prices |
| `REAL` / `FLOAT` | Approximate decimals — for scientific data, never for money |

`NUMERIC(p,s)` — `p` is total digits, `s` is digits after the decimal point.
Example: `NUMERIC(10,2)` → up to `99999999.99`

## Other types

| Type | When to use |
|------|-------------|
| `BOOLEAN` | True/false values |
| `DATE` | A date (year, month, day) |
| `TIMESTAMP` | Date and time |
