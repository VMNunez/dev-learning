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

| Operator     | Meaning               |
| ------------ | --------------------- |
| `=`          | equal                 |
| `<>` or `!=` | not equal             |
| `>`          | greater than          |
| `<`          | less than             |
| `>=`         | greater than or equal |
| `<=`         | less than or equal    |

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

| Left  | Right | Result                                   |
| ----- | ----- | ---------------------------------------- |
| true  | true  | true                                     |
| true  | false | false                                    |
| true  | null  | null                                     |
| false | false | false                                    |
| false | null  | **false** ← not null, because false wins |
| null  | null  | null                                     |

`OR` returns `true` if **at least one** side is true. When one side is `NULL`:

| Left  | Right | Result                                 |
| ----- | ----- | -------------------------------------- |
| true  | true  | true                                   |
| true  | false | true                                   |
| true  | null  | **true** ← not null, because true wins |
| false | false | false                                  |
| false | null  | null                                   |
| null  | null  | null                                   |

---

## LIKE — search text

`LIKE` searches for a pattern inside text. PostgreSQL has two wildcards:

| Wildcard | Meaning                                 |
| -------- | --------------------------------------- |
| `%`      | any sequence of zero or more characters |
| `_`      | exactly one character                   |

Examples:

| Pattern    | Matches                                                             |
| ---------- | ------------------------------------------------------------------- |
| `'%Wood%'` | contains "Wood" anywhere                                            |
| `'%Wood'`  | ends with "Wood"                                                    |
| `'No%'`    | starts with "No"                                                    |
| `'_her%'`  | second character is "h", third is "e", fourth is "r", then anything |

```sql
SELECT * FROM books WHERE title LIKE '%Wood%';

-- Titles where the second character is 'n'
SELECT * FROM books WHERE title LIKE '_n%';

-- Titles where the third character is 'n'  ← two underscores, one per character
SELECT * FROM books WHERE title LIKE '__n%';
```

Yes — each `_` is exactly one character, so `__n%` means: any character, any character, then `n`, then anything.

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

`created_at` is a `TIMESTAMP` — it stores date **and** time, like `2024-01-15 10:30:00`.

The strings `'2024-01-15'` and `'2024-03-22'` are just dates, no time. So the comparison would be:

```
2024-01-15 10:30:00  =  '2024-01-15'   -- a timestamp vs a date string → mismatch
```

PostgreSQL cannot match them directly. You use `::date` to strip the time part first:

```sql
-- created_at becomes 2024-01-15 (no time) — now it matches the date string
SELECT * FROM orders WHERE created_at::date IN ('2024-01-15', '2024-03-22');
```

`::` is the PostgreSQL cast operator — it converts a value from one type to another.
You will also see it as `CAST(value AS type)`, which is the standard SQL syntax. Both lines below do exactly the same thing:

```sql
SELECT * FROM orders WHERE created_at::date IN ('2024-01-15', '2024-03-22');
SELECT * FROM orders WHERE CAST(created_at AS DATE) IN ('2024-01-15', '2024-03-22');
```

`::` is shorter and more common in PostgreSQL. `CAST()` is the standard SQL version and works in any database.

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

Step by step — this is what PostgreSQL does internally when you write that query:

1. Your column `created_at` stores a full timestamp: `2024-06-10 09:15:00`
2. Your date strings `'2024-01-01'` and `'2024-06-30'` have no time, so PostgreSQL adds midnight automatically: `2024-01-01 00:00:00` and `2024-06-30 00:00:00`
3. The query becomes: `created_at >= 2024-01-01 00:00:00 AND created_at <= 2024-06-30 00:00:00`
4. An order placed on `2024-06-30 09:15:00` fails the check — `09:15:00 > 00:00:00`

So that order on June 30 is **silently excluded**. No error, just a missing row.

```sql
-- This looks correct but misses any order placed after midnight on June 30
SELECT * FROM orders WHERE created_at BETWEEN '2024-01-01' AND '2024-06-30';

-- Fix option 1: extend the end to the last second of the day
SELECT * FROM orders WHERE created_at BETWEEN '2024-01-01' AND '2024-06-30 23:59:59';

-- Fix option 2 (cleanest): strip the time before comparing
SELECT * FROM orders WHERE created_at::date BETWEEN '2024-01-01' AND '2024-06-30';
```

The `::date` version strips the time from `created_at` before comparing, so `2024-06-30 09:15:00` becomes `2024-06-30` and it matches correctly.

---

## IS NULL — check for missing values

`NULL` means the value is missing. You cannot use `=` to check for it — use `IS NULL` or `IS NOT NULL`.

```sql
-- Books with no price set
SELECT * FROM books WHERE price IS NULL;

-- Books that do have a price
SELECT * FROM books WHERE price IS NOT NULL;
```

> Why not `WHERE price = NULL`? Because `NULL` is not a value — it means "unknown". Comparing unknown with anything (even another unknown) always gives unknown, never true. So `WHERE price = NULL` never matches any row. Always use `IS NULL`.

> **`COALESCE(value, fallback)`** — returns the first non-NULL value in the list. If `value` is NULL, it returns `fallback` instead. You will see this constantly in real projects.
>
> ```sql
> -- Without COALESCE — shows NULL for books with no price
> SELECT title, price FROM books;
> -- result: "Animal Farm" | NULL
>
> -- With COALESCE — shows 0.00 instead of NULL
> SELECT title, COALESCE(price, 0.00) AS price FROM books;
> -- result: "Animal Farm" | 0.00
> ```
>
> You can also chain more than two values — COALESCE returns the first one that is not NULL:
>
> ```sql
> -- Imagine a book has no sale_price and no regular price — fall back to 0.00
> SELECT title, COALESCE(sale_price, price, 0.00) AS final_price FROM books;
> -- If sale_price is NULL → tries price → if that is also NULL → returns 0.00
> ```
>
> The most common use: replace NULL with a safe default (`0`, `''`, `'Unknown'`) so your app never has to handle NULL in the result.

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

| Operator                        | Purpose                     |
| ------------------------------- | --------------------------- |
| `=`, `<>`, `>`, `<`, `>=`, `<=` | compare values              |
| `AND` / `OR`                    | combine conditions          |
| `LIKE`                          | search text patterns        |
| `IN`                            | match a list of values      |
| `BETWEEN`                       | filter a range              |
| `IS NULL`                       | check if a value is missing |
| `NOT`                           | negate a condition          |
