# SQL — WHERE

Official docs: [PostgreSQL WHERE](https://neon.com/postgresql/postgresql-tutorial/postgresql-where)

---

## What WHERE does

`WHERE` filters rows. Only rows where the condition is `true` are returned.

```sql
SELECT * FROM books WHERE price > 10;
```

`WHERE` runs **before** `SELECT` — so you cannot use a column alias in `WHERE`.

---

## Comparison operators

| Operator | Meaning |
|----------|---------|
| `=`      | equal |
| `<>` or `!=` | not equal |
| `>`      | greater than |
| `<`      | less than |
| `>=`     | greater than or equal |
| `<=`     | less than or equal |

---

## AND / OR

Combine multiple conditions.

```sql
-- Books that cost more than 10 AND were published after 1980
SELECT * FROM books WHERE price > 10 AND year > 1980;

-- Books by author 11 OR author 12
SELECT * FROM books WHERE author_id = 11 OR author_id = 12;
```

`AND` returns `true` only if **both** sides are true. When one side is `NULL`:

| Left  | Right | Result |
|-------|-------|--------|
| true  | true  | true   |
| true  | false | false  |
| true  | null  | null   |
| false | false | false  |
| false | null  | **false** ← not null, because false wins |
| null  | null  | null   |

`OR` returns `true` if **at least one** side is true. When one side is `NULL`:

| Left  | Right | Result |
|-------|-------|--------|
| true  | true  | true   |
| true  | false | true   |
| true  | null  | **true** ← not null, because true wins |
| false | false | false  |
| false | null  | null   |
| null  | null  | null   |

---

## LIKE — search text

`LIKE` searches for a pattern inside text. PostgreSQL has two wildcards:

| Wildcard | Meaning |
|---------|---------|
| `%` | any sequence of zero or more characters |
| `_` | exactly one character |

Examples:

| Pattern | Matches |
|---------|---------|
| `'%Wood%'` | contains "Wood" anywhere |
| `'%Wood'` | ends with "Wood" |
| `'No%'` | starts with "No" |
| `'_her%'` | second character is "h", third is "e", fourth is "r", then anything |

```sql
SELECT * FROM books WHERE title LIKE '%Wood%';

-- Titles where the second character is 'n'
SELECT * FROM books WHERE title LIKE '_n%';
```

### ILIKE — case-insensitive

`LIKE` is case-sensitive. `ILIKE` ignores case — PostgreSQL specific.

```sql
-- Matches 'norwegian wood', 'Norwegian Wood', 'NORWEGIAN WOOD', etc.
SELECT * FROM books WHERE title ILIKE '%norwegian%';
```

---

## IN — match a list

`IN` checks if a value is in a list. Cleaner and **faster** than many `OR` conditions — PostgreSQL optimizes it internally.

```sql
-- Same as: author_id = 11 OR author_id = 13
SELECT * FROM books WHERE author_id IN (11, 13);
```

Works with numbers, strings, and dates:

```sql
SELECT * FROM authors WHERE nationality IN ('Colombian', 'British');
```

### Casting with ::

If you need to compare a `timestamp` column against a date, use `::date` to convert it:

```sql
-- created_at is a timestamp, but we compare only the date part
SELECT * FROM orders WHERE created_at::date IN ('2024-01-15', '2024-03-22');
```

`::` is the PostgreSQL cast operator — it converts a value from one type to another.
You will also see it as `CAST(value AS type)`, which is the standard SQL syntax.

---

## BETWEEN — filter a range

`BETWEEN` checks if a value is inside a range (inclusive on both ends).

```sql
-- Books published between 1945 and 1987
SELECT * FROM books WHERE year BETWEEN 1945 AND 1987;
```

This is equivalent to:

```sql
SELECT * FROM books WHERE year >= 1945 AND year <= 1987;
```

Use `NOT BETWEEN` to get values outside the range:

```sql
SELECT * FROM books WHERE year NOT BETWEEN 1945 AND 1987;
```

With dates, use ISO 8601 format — `'YYYY-MM-DD'`:

```sql
SELECT * FROM orders WHERE created_at BETWEEN '2024-01-01' AND '2024-06-30';
```

---

## IS NULL — check for missing values

`NULL` means the value is unknown or missing. It is not a value — it cannot be compared with `=`.

```sql
-- This returns NULL, not true
SELECT null = null AS result;  -- result: null
```

This is why `WHERE price = NULL` never works. Use `IS NULL` instead:

```sql
-- Books with no price set
SELECT * FROM books WHERE price IS NULL;
```

> Tip: PostgreSQL has `COALESCE(value, fallback)` — returns `fallback` if `value` is NULL. Useful to avoid NULLs in results. You will see it often in real projects.

---

## NOT — negate a condition

`NOT` reverses the result of an operator.

```sql
-- Books with a price set (not missing)
SELECT * FROM books WHERE price IS NOT NULL;

-- Books NOT in this list
SELECT * FROM books WHERE author_id NOT IN (11, 13);

-- Titles that do NOT start with 'N'
SELECT * FROM books WHERE title NOT LIKE 'N%';
```

---

## Column aliases in WHERE

You **cannot** use a column alias in `WHERE`. This is because `WHERE` runs before `SELECT`.

```sql
-- This does NOT work
SELECT price * 2 AS double_price FROM books WHERE double_price > 20;

-- Do this instead
SELECT price * 2 AS double_price FROM books WHERE price * 2 > 20;
```

---

## Summary

| Operator | Purpose |
|----------|---------|
| `=`, `<>`, `>`, `<`, `>=`, `<=` | compare values |
| `AND` / `OR` | combine conditions |
| `LIKE` | search text patterns |
| `IN` | match a list of values |
| `BETWEEN` | filter a range |
| `IS NULL` | check if a value is missing |
| `NOT` | negate a condition |