## Index of this note

- [SQL — Data Types](#sql--data-types)

1. [What a data type decides about a value](#what-a-data-type-decides-about-a-value)
2. [Converting a value with `::` and `CAST`](#converting-a-value-with--and-cast)
   - [The two ways to write a cast](#the-two-ways-to-write-a-cast)
   - [When PostgreSQL converts without being asked](#when-postgresql-converts-without-being-asked)
   - [A cast applies only to what stands right before it](#a-cast-applies-only-to-what-stands-right-before-it)
   - [A cast that cannot convert the value](#a-cast-that-cannot-convert-the-value)
3. [Character types](#character-types)
   - [`VARCHAR(n)` against `TEXT` — what is left to choose](#varcharn-against-text--what-is-left-to-choose)
   - [`CHAR(n)` pads every value with spaces](#charn-pads-every-value-with-spaces)
4. [Numeric types](#numeric-types)
   - [Identity columns and `SERIAL`](#identity-columns-and-serial)
   - [Why `NUMERIC` is exact and `FLOAT` is not](#why-numeric-is-exact-and-float-is-not)
   - [Integer division drops the fraction](#integer-division-drops-the-fraction)
5. [Date and time types](#date-and-time-types)
   - [The instant each type stands for](#the-instant-each-type-stands-for)
   - [One `TIMESTAMPTZ` value read in two time zones](#one-timestamptz-value-read-in-two-time-zones)
   - [Casting a timestamp to a date](#casting-a-timestamp-to-a-date)
6. [Boolean](#boolean)
   - [Three states and the literals to write](#three-states-and-the-literals-to-write)
7. [`JSONB` — a JSON document in one column](#jsonb--a-json-document-in-one-column)
   - [Reading one field out of a `JSONB` value](#reading-one-field-out-of-a-jsonb-value)
   - [When a document beats typed columns, and what it gives up](#when-a-document-beats-typed-columns-and-what-it-gives-up)
8. [Rounding and the scale of a result](#rounding-and-the-scale-of-a-result)
   - [`ROUND(value, n)` only accepts `NUMERIC`](#roundvalue-n-only-accepts-numeric)
   - [How PostgreSQL decides the scale of a result](#how-postgresql-decides-the-scale-of-a-result)
   - [Round the whole expression, never one operand](#round-the-whole-expression-never-one-operand)
   - [The same scale rule inside a report total](#the-same-scale-rule-inside-a-report-total)
9. [Which type to pick — quick reference](#which-type-to-pick--quick-reference)
10. [What this chapter unlocks](#what-this-chapter-unlocks)

# SQL — Data Types

Docs: https://www.postgresql.org/docs/current/datatype.html → read: "Chapter 8. Data Types" — the opening paragraph and Table 8.1, then the type families this note takes one by one

---

[00-sql-and-relational-databases.md](00-sql-and-relational-databases.md), the introduction to this route, left you able to read one column definition inside `CREATE TABLE`: first the column's name, then its data type, then any rule or default value. In `price NUMERIC(8,2)`, you know which word is the name and which part is the type, but not yet what `NUMERIC(8,2)` promises. This chapter is about that middle part. Before you can declare a table (chapter 02) or filter its rows (chapter 04), you need to know what a single value is in PostgreSQL: what each type accepts, how a value becomes a value of another type, and what stays exact when values are combined in a calculation.

The chapter follows that order. It opens with what a type decides about a value, using a few one-line `SELECT` statements you can run in the practice database. Next comes conversion, the `::` operator and `CAST`, because almost every later section uses a cast. Then the types themselves, one family per section: text, numbers, dates and times, booleans, and `JSONB` for whole JSON documents. With the types in place, the section on rounding shows how the scale of a `NUMERIC` result is worked out from its operands, which is the rule behind every report total you will write. The chapter closes with a quick-reference table and the handoff to chapter 02.

---

## What a data type decides about a value

Docs: https://www.postgresql.org/docs/current/datatype.html → read: the opening paragraph and Table 8.1 "Data Types" — the full list of built-in types, with the alias names you will meet (`int`, `float8`, `timestamptz`)

The same characters can mean three different things depending on their type. Take the characters `10` and `9`. Run these two statements in pgAdmin, against `practice_junior_notes`:

```sql
SELECT 10 < 9;
```

```sql
SELECT '10' < '9';
```

The first returns `false`. The second returns `true`.

In the first statement, `10` and `9` are whole numbers, so `<` compares their numeric values, and ten is not less than nine. In the second, the single quotes make them text, and text is compared character by character from the left, the way a dictionary orders words. The first character of `'10'` is `1`, the first character of `'9'` is `9`, and `1` comes before `9`. The comparison stops there, so `'10'` sorts before `'9'`.

Nothing about the characters changed. Only the type changed, and the type decided what `<` means. That is the general rule this chapter rests on: **the type of a value decides four things about it.**

1. **Which operations exist.** `+` is defined for numbers. It is not defined for text, so `SELECT title + 1 FROM books;` fails with `ERROR:  operator does not exist: character varying + integer`. `character varying` is the full name of `VARCHAR`, the type of `title`.
2. **How two values compare.** Numbers compare by size, text by characters, dates by position on the calendar. You just saw the first two disagree about `10` and `9`.
3. **What a stored value means.** `2025-03-01` stored as `DATE` is a day on the calendar: `SELECT DATE '2025-03-01' + 30;` answers `2025-03-31`, because adding a whole number to a date moves it that many days. The word `DATE` before the quoted text marks that text as a date; the section [The instant each type stands for](#the-instant-each-type-stands-for) explains that form. Stored as text, the same characters are only ten characters, and adding 30 to them means nothing.
4. **How precise a number is.** Some numeric types keep every decimal digit exactly and others keep an approximation. The difference is invisible until a calculation shows it, which the section [Why `NUMERIC` is exact and `FLOAT` is not](#why-numeric-is-exact-and-float-is-not) does.

> **Why does the column's type matter more than the value I insert?** Because PostgreSQL converts every value to the column's type before storing it, and from then on the value behaves as that type in every query, for every client. If `price` were declared as text, `ORDER BY price` would put `14.99` before `9.99` for the same reason that `'10' < '9'` is true, and no query could fix it without converting the column first.

This is also the JavaScript habit to drop. In JavaScript, `'10' < '9'` is `true` and `10 < '9'` is `false`, because JavaScript converts one side when the two types differ. PostgreSQL decides the type of each value first and then looks for an operator defined for those types. It converts a value on its own only along a short list of conversions it treats as safe, such as a whole number into a decimal number, and text into a number is not on that list. That is why `title + 1` is an error and not a silent conversion. The next section shows that list at work, and how you convert a value yourself when you need to.

---

## Converting a value with `::` and `CAST`

Docs: https://www.postgresql.org/docs/current/sql-expressions.html → read: "4.2.9. Type Casts" — the two syntaxes, and when a cast can be left out

A **cast** is a conversion of a value from one type to another. You need one whenever a value has the right content but the wrong type for what you want to do with it: a number that arrived as text, a timestamp you want to compare as a day, a whole number you want to divide without losing the fraction.

### The two ways to write a cast

PostgreSQL accepts two syntaxes, and they do exactly the same thing:

```sql
SELECT CAST('5' AS INT);
```

```sql
SELECT '5'::int;
```

Both return the whole number `5`. `CAST(value AS type)` is the form defined by the SQL standard, so it works in any database. `value::type` is PostgreSQL's own shorter form, and it is the one you will see in almost every PostgreSQL query, because it reads left to right: the value, then what to turn it into.

The cast works on any expression, not only on a literal. A **literal** is a value written directly in the statement, such as `'5'` or `9.99`. Here the value comes from a column of the practice database. `reviewed_at` is a timestamp: a date plus a time of day.

```sql
SELECT reviewed_at, reviewed_at::date
FROM reviews
WHERE book_id = 7;
```

```
 reviewed_at         | reviewed_at
---------------------+-------------
 2025-03-01 08:55:00 | 2025-03-01
```

`reviewed_at::date` converts the timestamp to a date, which drops the time of day. Both columns are called `reviewed_at` because PostgreSQL names a cast column after the column inside it. `WHERE book_id = 7` keeps only the review of book 7. [04-where.md](04-where.md) teaches `WHERE`.

This is the cast you will write most often, because it lets you compare a timestamp with a day:

```sql
-- MAL: '2025-03-01' becomes the timestamp 2025-03-01 00:00:00, which no review has
SELECT book_id, rating FROM reviews WHERE reviewed_at = '2025-03-01';

-- BIEN: compare the day of the timestamp with the day you mean
SELECT book_id, rating FROM reviews WHERE reviewed_at::date = '2025-03-01';
```

The first statement returns no rows. The second returns book 7 with a rating of 2. The first finds nothing because the text `'2025-03-01'` is converted to the type of the other side, a timestamp, and a timestamp with no time of day means midnight. The review was written at 08:55, so it is not equal to midnight. Casting the column to `date` makes both sides days, and the two days are equal. The same cast appears in join conditions, which [06-joins.md](06-joins.md) teaches: matching a review's timestamp with an order's date needs `reviewed_at::date` on one side.

> **On a large table, the cast on the column has a cost.** `reviewed_at::date` has to be computed for every row before it can be compared, so PostgreSQL cannot go straight to the matching rows through an index on `reviewed_at`. [04-where.md](04-where.md) teaches the form that leaves the column untouched, a range from the start of the day up to the start of the next one: `reviewed_at >= '2025-03-01' AND reviewed_at < '2025-03-02'`. [13-indexes.md](13-indexes.md) explains why an index needs the column as it is stored. On the eight rows of the practice `reviews` table, both forms are equally fast.

### When PostgreSQL converts without being asked

You do not write a cast on every value, because PostgreSQL converts in two situations by itself.

**A quoted literal has no type until it is used.** In the `BIEN` query above, `'2025-03-01'` became a date without any cast. Text between single quotes that is not yet attached to anything starts with no type, and PostgreSQL gives it the type the expression needs. That is also why `SELECT '5' + 1;` returns `6`. When one side of an operator has no type yet, PostgreSQL first tries the type of the other side. The other side is the integer `1`, an `integer + integer` operator exists, so `'5'` is read as the whole number 5.

**A value written into a column is converted to that column's type.** When you insert `9.99` into the column `price NUMERIC(8,2)`, PostgreSQL converts it to `NUMERIC(8,2)`. You did not write `9.99::numeric(8,2)`.

Both automatic conversions are limited on purpose. PostgreSQL records every conversion between two types in its system catalog, and each entry says where the conversion may happen without being written:

- **inside any expression**: an `integer` becomes a `numeric`, which is how `12 / 5.0` works further down;
- **only when a value is stored into a column**: a `numeric` becomes an `integer`, so inserting `9.7` into an `INT` column stores `10`, rounded without a word;
- **never**: an `integer` never becomes a `boolean` on its own, which the section [Three states and the literals to write](#three-states-and-the-literals-to-write) shows failing.

Every conversion outside those entries has to be written as a cast, so that nothing changes type behind your back. So you must write the cast in three situations:

| Situation | Example | Where this chapter covers it |
|---|---|---|
| Both operands already have a type, and the operator PostgreSQL picks for those types is not the one you want | `12 / 5` divides two whole numbers and drops the fraction | [Integer division drops the fraction](#integer-division-drops-the-fraction) |
| A function or operator exists only for another type, and no automatic conversion reaches it | `ROUND(value, 2)` exists only for `NUMERIC`, and a `double precision` value is not converted to it automatically | [`ROUND(value, n)` only accepts `NUMERIC`](#roundvalue-n-only-accepts-numeric) |
| The value already has a type, and you want it as another one | `reviewed_at::date` to compare with a day; the text read out of a JSON document turned into a number | [Casting a timestamp to a date](#casting-a-timestamp-to-a-date) and [Reading one field out of a `JSONB` value](#reading-one-field-out-of-a-jsonb-value) |

The middle column gives one example per situation. The right column links the section of this file where that example is worked through.

### A cast applies only to what stands right before it

`::` binds more tightly than any arithmetic operator. In `12 / 5::numeric`, PostgreSQL reads `5::numeric` first and only then divides, so the cast converts the `5` and nothing else. That is often exactly what you want, because converting one operand is enough to change the type of the whole division (the section [Integer division drops the fraction](#integer-division-drops-the-fraction) shows why). When you want to convert the result of an expression, wrap the expression in parentheses: `(12 / 5)::numeric` divides first and then converts the result.

```sql
SELECT 12 / 5::numeric;    -- 2.4000000000000000  the 5 is converted before dividing
SELECT (12 / 5)::numeric;  -- 2                   the division already dropped the .4
```

### A cast that cannot convert the value

A cast checks that the content makes sense for the new type. The `isbn` column holds text such as `978-0451524935`, and casting it to a number fails:

```sql
SELECT isbn::bigint FROM books;
```

```
ERROR:  invalid input syntax for type bigint: "978-0451524935"
```

`bigint` is a whole-number type with a larger range than `int`, which the section [Identity columns and `SERIAL`](#identity-columns-and-serial) covers. The message names the target type and quotes the first value that could not be read as one, here because of the hyphen. As with any error, the statement returns nothing. A cast from text to a number or a date succeeds only when every row's text is valid input for that type.

---

## Character types

Docs: https://www.postgresql.org/docs/current/datatype-character.html → read: "8.3. Character Types" — the tip on performance and Example 8.1

Most columns of a schema hold text: a title, an email, a city. PostgreSQL gives you three types for it, and they differ only in what they do with the length of a value.

| Type | When to use |
|------|-------------|
| `CHAR(n)` | Fixed length, padded with spaces — met in inherited schemas, not chosen for new columns (e.g. a legacy country code `'ES'`, `'UK'`) |
| `VARCHAR(n)` | Variable length with a maximum — the most common choice for names, titles, emails |
| `TEXT` | No length limit — for long content like descriptions, comments, blog posts |

> In PostgreSQL, `VARCHAR` and `TEXT` have identical storage performance. The only real reason to use `VARCHAR(n)` is to document intent — "this value should not exceed N characters."

### `VARCHAR(n)` against `TEXT` — what is left to choose

The callout above settles performance. This section is about what the `(n)` still does, because "document intent" is not only a comment for the next developer: PostgreSQL enforces it.

The `city` column of `customers` is `VARCHAR(50)`. Try to store a city name longer than 50 characters, the 58-letter name of a real Welsh village:

```sql
UPDATE customers
SET city = 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch'
WHERE id = 3;
```

```
ERROR:  value too long for type character varying(50)
```

The statement is rejected and the row keeps its city. `UPDATE` changes the rows that `WHERE` keeps, and [08-dml.md](08-dml.md) teaches it. With `TEXT` the same statement would succeed, because `TEXT` has no maximum to break.

So the choice between the two is a choice about the data, never about speed:

- **`VARCHAR(n)`** when the domain has a real maximum and a longer value means a bug or bad input: a phone number, an ISBN, an email address, a status code. The limit then works as a rule, and every client gets the same error.
- **`TEXT`** when no length is meaningful: a review comment, a description, a note. Inventing `VARCHAR(255)` for these only creates a failure on the day somebody writes 256 characters.

> **`VARCHAR` without `(n)` is `TEXT` under another name.** Without a length, `VARCHAR` accepts strings of any length, so there is no rule left in it. Write `TEXT` instead, so that a reader knows the missing limit is deliberate.

> **An explicit cast cuts the text instead of failing.** `SELECT 'too long'::varchar(5);` returns `too l` with no error. Only storing a too-long value into a column raises the error above. A cast to a shorter `VARCHAR` is a silent way of losing characters, so never use one to make a value "fit".

Changing the limit later is a change to the table definition, which is part of [02-relationships.md](02-relationships.md). That cost is the one real argument for leaving out a limit you are not sure about.

### `CHAR(n)` pads every value with spaces

`CHAR(n)` is a different kind of text type. Every value it stores is exactly `n` characters long: a shorter value is filled on the right with spaces until it reaches `n`. **Blank padding** is the name for those added spaces.

Store `'ok'` in a `CHAR(4)` column and the stored value is `'ok'` followed by two spaces. Then PostgreSQL treats those spaces as if they were not there in two places:

```sql
SELECT length('ok'::char(4));            -- 2
SELECT 'ok'::char(4) = 'ok  '::char(4);  -- true
```

`length()` returns the number of characters in a text value. Here it says 2, although four characters are stored. The comparison says the two values are equal, although one was written with spaces and one without. Both follow from the same rule: for `CHAR(n)`, trailing spaces are considered not significant. They are ignored when `length()` counts the characters of a `CHAR` value and when two `CHAR` values are compared, and they are removed when a `CHAR` value is converted to another text type, such as `VARCHAR` or `TEXT`.

That is why the reported length does not match what was stored: the column keeps the padding, and `length()` does not count it. The padding is still there for anything that reads the stored value as it is. A client that fetches the column receives `'ok  '`, four characters, and a Java `equals("ok")` on it returns `false`.

> **Where you will meet `CHAR(n)`.** In schemas inherited from Oracle or from older database systems, a column such as `country_code CHAR(2)` or a status code `CHAR(1)` is common, because in some other database systems fixed-length text has a performance advantage. PostgreSQL's own documentation states that `CHAR(n)` has no such advantage here and is usually the slowest of the three types, because of the extra storage. Read it correctly in an inherited table, and use `VARCHAR(n)` or `TEXT` for new columns.

---

## Numeric types

Docs: https://www.postgresql.org/docs/current/datatype-numeric.html → read: "8.1. Numeric Types" — Table 8.2 with every range, "Arbitrary Precision Numbers" for `NUMERIC`, and "Floating-Point Types"

| Type | When to use |
|------|-------------|
| `SMALLINT` | Small whole numbers (-32,768 to 32,767) — rarely needed |
| `INT` | Default choice for whole numbers |
| `SERIAL` | Auto-incrementing integer — legacy shorthand; prefer an identity column (see below) |
| `NUMERIC(p,s)` | Exact decimal numbers — **always use for money and prices** |
| `REAL` / `FLOAT` | Approximate decimals — for scientific data, **never for money** |

`NUMERIC(p,s)` — `p` is total digits, `s` is digits after the decimal point.
Example: `NUMERIC(10,2)` → stores values up to `99999999.99` exactly.

> **Why not FLOAT for money?** `FLOAT` is an approximation — even simple values like `0.1` cannot be represented exactly in binary floating point. Each calculation can move the result by a tiny amount, and those amounts add up across a total, so a sum that should be exactly `100.00` can come back a hair above or below it. Use `NUMERIC(10,2)` for any column that holds a price, amount, or financial value.

### Identity columns and `SERIAL`

Docs: https://www.postgresql.org/docs/current/ddl-identity-columns.html → read: "5.3. Identity Columns" — `ALWAYS` against `BY DEFAULT`

Every row needs an `id` that identifies it, and nobody wants to type one. In the practice database, the `INSERT` statements never give an `id`, and the books still get 1, 2, 3. The seed script does that with `SERIAL`:

```sql
id SERIAL PRIMARY KEY,
```

**`SERIAL` is not a type.** It is shorthand that PostgreSQL expands into three things when it creates the table. PostgreSQL's documentation gives the expansion. Writing a column `colname SERIAL` in a table `tablename` is equivalent to this:

```sql
CREATE SEQUENCE tablename_colname_seq AS integer;
CREATE TABLE tablename (
    colname integer NOT NULL DEFAULT nextval('tablename_colname_seq')
);
ALTER SEQUENCE tablename_colname_seq OWNED BY tablename.colname;
```

Read it in three steps:

1. `CREATE SEQUENCE` creates a **sequence**: a separate database object that holds a counter and hands out the next number each time it is asked. `nextval('tablename_colname_seq')` is the function that asks it.
2. The column itself is an ordinary `integer`, declared `NOT NULL`, with a **default value** of `nextval(...)`. A default value is used only when an insert gives no value for the column. So an insert that leaves out `id` gets the next number from the sequence.
3. `OWNED BY` ties the sequence to the column, so that dropping the column or the table also drops the sequence.

Step 2 is where `SERIAL` is weak: the default is only a default. An insert that does give an `id`, for example `INSERT INTO genres (id, name) VALUES (7, 'Essay');`, is accepted, and the sequence is never told. The six genres of the seed used the numbers 1 to 6, so the sequence still hands out 7 next, and the next insert without an `id` gets 7 and collides with the row you just wrote. How to repair that is part of [08-dml.md](08-dml.md).

**An identity column** is the SQL-standard way of asking for the same thing, and the one to choose for new tables. Here is how the `genres` table of the seed script would declare its key with one:

```sql
CREATE TABLE genres (
  id   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);
```

`GENERATED ALWAYS AS IDENTITY` tells PostgreSQL to generate the value of `id` itself, from a sequence that belongs to the column and is not a separate object you have to look after. The column is `NOT NULL` automatically. `ALWAYS` adds the protection `SERIAL` lacks: an insert that gives its own `id` is rejected.

```
ERROR:  cannot insert a non-DEFAULT value into column "id"
DETAIL:  Column "id" is an identity column defined as GENERATED ALWAYS.
HINT:  Use OVERRIDING SYSTEM VALUE to override.
```

The first line names the failure: the insert tried to put its own value into `id`. The `DETAIL` line says why that is forbidden, and the `HINT` line names the clause that allows it on purpose, for the rare case of copying rows with their original ids.

The other form, `GENERATED BY DEFAULT AS IDENTITY`, accepts a value you give and generates one only when you give none. It behaves like `SERIAL` in that respect, with the sequence still owned by the column.

> **Neither form makes the column unique.** A sequence normally gives each row a new number, but nothing stops two rows from holding the same value if one of them was inserted with an explicit id, or if the sequence was reset. Uniqueness comes from `PRIMARY KEY` or `UNIQUE`, which is why both examples above carry `PRIMARY KEY`. [02-relationships.md](02-relationships.md) teaches those rules.

> **Expect gaps in the numbers.** A number taken from the sequence is used up even when the insert that took it fails. After a rejected insert, the next row gets the following number, and the missing one never comes back. Never use an `id` to count rows or to check that nothing was deleted.

**`INT` or `BIGINT`.** An `INT` key stops at 2,147,483,647: about 2.1 billion numbers handed out over the whole life of the table, including the ones that failed inserts used up. `BIGINT` is an 8-byte whole number that goes up to 9,223,372,036,854,775,807. Use `BIGINT GENERATED ALWAYS AS IDENTITY` for tables that can grow without limit, such as logs or events. `BIGSERIAL` is the `SERIAL` shorthand for a `BIGINT` column, and you will read it in older schemas. The practice database's seed script uses `SERIAL` for every key, so that is where you will read it in this route.

### Why `NUMERIC` is exact and `FLOAT` is not

The callout **Why not FLOAT for money?**, under the table at the start of the section [Numeric types](#numeric-types), says `FLOAT` is an approximation. This section shows the approximation happening, explains where it comes from, and shows what `NUMERIC` does instead.

```sql
SELECT 0.1 + 0.2;
```

```sql
SELECT 0.1::float8 + 0.2::float8;
```

The first returns `0.3`. The second returns `0.30000000000000004`.

A number written with a decimal point, such as `0.1`, is a `NUMERIC` literal in PostgreSQL. `NUMERIC` stores a number as its decimal digits, so `0.1` is stored as exactly one tenth and the sum is exactly `0.3`. `float8` is another name for `double precision`, which is also what `FLOAT` with no size means. It stores a number in binary, as a fraction whose denominator is a power of two. One tenth cannot be written that way with a finite number of binary digits, for the same reason that one third cannot be written in decimal with a finite number of digits: `0.3333…` never ends. So PostgreSQL stores the binary fraction closest to `0.1`, and another one closest to `0.2`. Their sum is close to `0.3` but is not the binary fraction closest to `0.3`, and PostgreSQL prints the digits needed to show that difference.

This is the same behaviour you know from JavaScript, and for the same reason: a JavaScript number is a `double precision` value, so `0.1 + 0.2` in the browser console also prints `0.30000000000000004`.

The error is tiny, and it still breaks two things:

- **Equality.** `SELECT 0.1::float8 + 0.2::float8 = 0.3::float8;` returns `false`. With `NUMERIC`, `SELECT 0.1 + 0.2 = 0.3;` returns `true`.
- **Totals that must match to the cent.** Each addition can move the result by a tiny amount, and a sum of thousands of amounts can end up a cent away from the sum on the invoice.

**`NUMERIC(p,s)` keeps exactly `s` decimal places.** The two numbers are the ones the start of the section [Numeric types](#numeric-types) described, and they have names you will meet in error messages: `p` is the **precision** and `s` is the **scale**. The practice database declares `price NUMERIC(8,2)`, so a price has at most 8 digits, 2 of them after the point, and at most 6 before it. A value with more decimal places than `s` is rounded when it is stored, and a value with too many digits before the point is rejected:

```sql
SELECT 9.995::numeric(8,2);      -- 10.00  rounded to 2 decimal places
SELECT 1234567.5::numeric(8,2);  -- error
```

```
ERROR:  numeric field overflow
DETAIL:  A field with precision 8, scale 2 must round to an absolute value less than 10^6.
```

The `DETAIL` line reads the declared type for you: with 8 digits in total and 2 after the point, the value must stay below 10^6, one million, and `1234567.5` has seven digits before the point. The first statement also shows how `NUMERIC` rounds a tie: `9.995` is exactly halfway between `9.99` and `10.00`, and `NUMERIC` rounds a tie away from zero, so it becomes `10.00`.

> **`NUMERIC` without `(p,s)` accepts any scale.** A column declared just `NUMERIC` stores each value with the decimal places it arrived with, so `9.5` and `9.50` are kept with different scales. For money, declare the scale, so that every amount in the column has its two decimal places.

**When `FLOAT` is the right choice.** A floating-point type is for measurements where a tiny representation error does not matter and nobody needs the result to match a written figure exactly: a sensor temperature, a GPS coordinate, a physical measurement. There are two of them:

| Type | Size | Precision | When to use |
|---|---|---|---|
| `REAL` (`float4`) | 4 bytes | about 6 decimal digits | rarely; only when storage matters and 6 digits are enough |
| `DOUBLE PRECISION` (`float8`, and `FLOAT` with no size) | 8 bytes | at least 15 decimal digits | measurements and scientific values |

Everything a person can count in money, or check against a document, goes in `NUMERIC`.

### Integer division drops the fraction

There are 12 copies of _1984_ in stock, and you want to know how many go on each of 5 shelves:

```sql
SELECT 12 / 5;
```

The answer is `2`, not `2.4`. PostgreSQL chose the result type before it divided. `12` and `5` are both integers (a whole number written without a decimal point is an `integer` literal), and an operator on two values of one type returns that same type. An integer cannot hold `2.4`, so the division keeps the whole part and throws away the rest. "Throws away" means **truncation toward zero**, not rounding: `(-12) / 5` returns `-2`, not `-3`.

JavaScript has a single number type, so `12 / 5` there is `2.4`. In SQL, the result depends on the operand types, and two integers give an integer.

To keep the decimals, make one operand `NUMERIC` before the division runs:

```sql
SELECT 12::numeric / 5;   -- 2.4000000000000000
SELECT 12 / 5.0;          -- 2.4000000000000000
```

When the two operands have different numeric types, PostgreSQL uses the later one in this list: `smallint`, `integer`, `bigint`, `numeric`, `real`, `double precision`. So one `NUMERIC` operand turns the whole division into a `NUMERIC` division. The second line works without a cast because `5.0`, written with a decimal point, is already a `NUMERIC` literal. The long tail of zeros is how `NUMERIC` division chooses its scale, which the section [How PostgreSQL decides the scale of a result](#how-postgresql-decides-the-scale-of-a-result) explains.

The cast has to reach an operand. A cast on the result arrives too late:

```sql
-- MAL: the integer division runs first and has already dropped the .4
SELECT (12 / 5)::numeric;   -- 2

-- BIEN: the division itself is NUMERIC
SELECT 12::numeric / 5;     -- 2.4000000000000000
```

> **The trap is in columns, not in literals.** Nobody writes `12 / 5` by hand expecting `2.4`. What you write is `stock / shelves` or `quantity / items`, two `INT` columns, and the result is truncated just as silently. Check the types of both operands of every `/`.

---

## Date and time types

Docs: https://www.postgresql.org/docs/current/datatype-datetime.html → read: "8.5. Date/Time Types" — the subsections "Time Stamps" and "Time Zones"

| Type | When to use |
|------|-------------|
| `DATE` | A date only — year, month, day (e.g. birthdays, deadlines) |
| `TIMESTAMP` | Date and time, no time zone — stores exactly what you put in |
| `TIMESTAMPTZ` | Date and time **with time zone** — converts to UTC on write, back on read |

`TIMESTAMP` stores `2024-06-15 14:30:00` exactly as entered. If a user in Madrid and a user in Tokyo each save the time on their own clock at the same moment, the two stored values are different, although they describe one moment.

`TIMESTAMPTZ` stores the moment in UTC internally and converts to the session time zone when you read it. For web applications where users can be in different time zones, **use `TIMESTAMPTZ` for `created_at`, `updated_at`, and any event timestamp**.

> This is a common PostgreSQL interview question. Most developers default to `TIMESTAMP` without thinking about time zones. Using `TIMESTAMPTZ` shows you have built real web applications.

### The instant each type stands for

The table above says what each type stores. This section says which moment in time each one actually identifies, because only one of the three identifies a single moment. That moment is called an **instant**: one point on the timeline, the same for everybody on Earth.

| Type | What a value records | Is it one instant? | Example |
|---|---|---|---|
| `DATE` | a day on the calendar | no: a whole day, which starts at a different instant in each time zone | the day a customer joined: `2024-01-15` |
| `TIMESTAMP` | a reading of a wall clock: a date and a time of day | no: 09:00 in Madrid and 09:00 in Tokyo are eight hours apart in winter and seven in summer, and the value does not say which clock was read | a shop's opening time, the same local hour wherever the shop is |
| `TIMESTAMPTZ` | one instant on the timeline | yes | the moment an order was placed |

`TIMESTAMP` is short for `TIMESTAMP WITHOUT TIME ZONE`, and `TIMESTAMPTZ` for `TIMESTAMP WITH TIME ZONE`. Each row of this table answers the same question: if two people in different countries read this value, do they mean the same moment?

`TIMESTAMP` does not record a zone even when you give it one. PostgreSQL silently ignores the time zone part of the input:

```sql
SELECT TIMESTAMP '2025-03-01 08:00:00+02';
```

```
 timestamp
---------------------
 2025-03-01 08:00:00
```

The `+02` is gone. `+02` is an **offset**: it says the clock that showed 08:00 was two hours ahead of UTC. **UTC** (Coordinated Universal Time) is the reference clock that every time zone is defined against: Madrid is UTC+01 in winter, Tokyo is UTC+09. A `TIMESTAMP` keeps the 08:00 and drops the information that would turn it into an instant.

`TIMESTAMP '2025-03-01 08:00:00+02'` is one more way of writing a cast, which works on a literal only: the type name, then the text in quotes. It means the same as `'2025-03-01 08:00:00+02'::timestamp`.

### One `TIMESTAMPTZ` value read in two time zones

A `TIMESTAMPTZ` works in two steps:

1. **On write**, PostgreSQL converts the value to UTC using the offset you gave. If you gave none, it uses the time zone of your session. Only the UTC instant is stored. The zone you wrote is not kept.
2. **On read**, PostgreSQL converts the stored UTC instant to the time zone of the session that reads it, and displays it with that zone's offset.

The **session** is your connection: each Query Tool in pgAdmin has its own. Its time zone is a setting called `TimeZone`. `SHOW timezone;` displays it, and `SET TIME ZONE` changes it for that session only. Run these four statements one at a time, highlighting each before pressing F5:

```sql
SET TIME ZONE 'Europe/Madrid';
SELECT TIMESTAMPTZ '2025-03-01 08:00:00+00';   -- 2025-03-01 09:00:00+01

SET TIME ZONE 'Asia/Tokyo';
SELECT TIMESTAMPTZ '2025-03-01 08:00:00+00';   -- 2025-03-01 17:00:00+09
```

The two `SELECT` statements are identical, and they return the same instant: 08:00 UTC. A reader in Madrid sees it as 09:00 on a clock one hour ahead of UTC, and a reader in Tokyo sees it as 17:00 on a clock nine hours ahead. Nothing stored changed between the two. Only the session that reads the value changed. `RESET timezone;` puts the setting back to the server's default.

That is why `created_at` belongs in a `TIMESTAMPTZ`. A web application's users, its server and its database can sit in different time zones, and the order placed at 08:00 UTC must be the same order, at the same moment, for all of them. A `TIMESTAMP` would store whichever wall-clock reading the writing program happened to use, and no later query could tell which zone that was.

### Casting a timestamp to a date

The section [The two ways to write a cast](#the-two-ways-to-write-a-cast) used `reviewed_at::date` on a `TIMESTAMP`, and the cast simply dropped the time of day. On a `TIMESTAMPTZ` the cast does one more step: it first converts the instant to the session's time zone, and only then takes the date.

```sql
SET TIME ZONE 'Europe/Madrid';
SELECT TIMESTAMPTZ '2025-03-01 23:30:00+00'::date;   -- 2025-03-02

SET TIME ZONE 'UTC';
SELECT TIMESTAMPTZ '2025-03-01 23:30:00+00'::date;   -- 2025-03-01
```

The instant is 23:30 UTC on 1 March, which is already 00:30 on 2 March in Madrid. So `created_at::date` in a report of "orders per day" answers in the day of whoever runs the report. When the day matters, set the session's time zone to the one the business counts its days in before you cast. [14-postgresql-specifics.md](14-postgresql-specifics.md) teaches the date functions that build on this.

---

## Boolean

Docs: https://www.postgresql.org/docs/current/datatype-boolean.html → read: "8.6. Boolean Type" — the accepted input strings and Example 8.2

`BOOLEAN` holds a yes/no answer: `true` or `false`, plus `NULL` when the answer is not known. Use it for flags and yes/no fields.

```sql
is_active BOOLEAN DEFAULT true
has_discount BOOLEAN DEFAULT false
```

> PostgreSQL accepts several ways to write booleans in queries: `true`, `'t'`, `'yes'`, `'on'`, `'1'` — and their false equivalents. In practice, always use `true` and `false` to keep it readable.

### Three states and the literals to write

A `BOOLEAN` column holds one of three states, not two: `true`, `false`, or `NULL`, the "unknown" state, when the column allows it. That is the guarantee the type makes: nothing else can be stored. There is no `2`, no `'maybe'`, and no empty text. If a flag must always be known, the column also needs `NOT NULL`, which [02-relationships.md](02-relationships.md) teaches. Without it, the third state is allowed, and [04-where.md](04-where.md) shows how a `NULL` flag silently drops rows from a filter.

The quoted strings in the callout above are all text that PostgreSQL reads as a boolean, which is why `'1'` and `'yes'` work. An unquoted `1` is different: it is an integer, and PostgreSQL does not convert an integer to a boolean automatically. In a table with a `BOOLEAN` column called `active`, inserting `1` into it fails:

```
ERROR:  column "active" is of type boolean but expression is of type integer
```

The same happens in a condition. `SELECT 1 = TRUE;` fails with `operator does not exist: integer = boolean`. In JavaScript `true == 1` is `true`, and that habit does not carry over. In PostgreSQL write the SQL keywords `TRUE` and `FALSE`, which PostgreSQL's documentation names as the preferred, SQL-standard form.

A boolean column is already a condition, so it needs no comparison at all. In a `users` table with a `BOOLEAN` column `active`, these two statements return the same rows, and the second form is the usual one:

```sql
SELECT name FROM users WHERE active = TRUE;
SELECT name FROM users WHERE active;
```

> **A boolean sent to a client as text arrives as `t` or `f`.** That is PostgreSQL's output format for the type, and it is the form you see in `psql`, PostgreSQL's command-line client, which prints every value as plain text. It is the same value as `true` and `false`, written short. A cast you write yourself gives the full word: `SELECT TRUE::text;` returns `true`.

---

## `JSONB` — a JSON document in one column

Docs: https://www.postgresql.org/docs/current/datatype-json.html → read: "8.14. JSON Types" — the difference between `json` and `jsonb`, and "Designing JSON Documents"

Sometimes the data you receive is already a JSON document: the body of a webhook from a payment provider (a webhook is an HTTP request that another service sends to your application when something happens on its side, such as a payment being confirmed), the settings a user saved in the Angular app, the attributes of a product that change from one product to the next. Splitting each of those into columns means adding a column every time a new key appears. `JSONB` stores the whole document in one column instead.

```sql
SELECT '{"format": "ebook", "pages": 328}'::jsonb;
```

```
 jsonb
-----------------------------------
 {"pages": 328, "format": "ebook"}
```

Three things happened in that cast:

1. **PostgreSQL checked that the text is valid JSON.** `SELECT '{"format": ebook}'::jsonb;` fails with `ERROR:  invalid input syntax for type json`, followed by `DETAIL:  Token "ebook" is invalid.`, because a JSON string needs double quotes. A `TEXT` column would have stored the broken document without complaint.
2. **It stored the document in a binary form, not as the text you wrote.** PostgreSQL parses the JSON once, when it is written, and keeps the parsed structure. That makes writing slightly slower and reading a field much faster, because nothing has to be parsed again. It also means the binary form can be indexed. [13-indexes.md](13-indexes.md) teaches what an index is.
3. **It did not keep the details of your text.** The keys came back in a different order, because `jsonb` does not preserve the order of keys, nor extra white space. If a key appears twice in the input, only the last value is kept.

PostgreSQL also has a `json` type, which keeps an exact copy of the text and parses it again on every use. PostgreSQL's documentation recommends `jsonb` for most applications. When you read "a JSON column" in a PostgreSQL schema, expect `jsonb`.

### Reading one field out of a `JSONB` value

Two operators read a key out of a JSON object. `->` returns the value as `jsonb`, and `->>` returns it as text:

```sql
SELECT '{"format": "ebook", "pages": 328}'::jsonb ->> 'format';   -- ebook
SELECT '{"format": "ebook", "pages": 328}'::jsonb ->> 'pages';    -- 328, as text
```

The second result looks like a number but is text, so arithmetic on it needs a cast. The parentheses make the cast apply to the extracted value, not to `'pages'`, for the reason the section [A cast applies only to what stands right before it](#a-cast-applies-only-to-what-stands-right-before-it) gave:

```sql
SELECT ('{"format": "ebook", "pages": 328}'::jsonb ->> 'pages')::int + 1;   -- 329
```

That cast is the visible cost of `JSONB`: the database stores the document, but the type of each value inside it is never declared, so every query has to say what it expects.

### When a document beats typed columns, and what it gives up

Use the cast above as the test. A field you will filter, join, add up or validate on every row should be its own column with its own type. A part of the data whose shape varies, or which you store and hand back mostly as a whole, can be a `JSONB` value.

| Store it as typed columns when… | Store it as `JSONB` when… |
|---|---|
| every row has the field, and its meaning is stable (`price`, `email`, `order_date`) | the keys differ from row to row (attributes of an ebook against those of a hardback) |
| the database must enforce a rule on it: `NOT NULL`, a `CHECK`, a foreign key | the application reads and writes the document as one unit (saved user preferences) |
| other tables join to it | you must keep a received document exactly as it arrived, for example to audit a webhook |

What `JSONB` gives up is everything this chapter says a type guarantees. A typed `price NUMERIC(8,2)` column guarantees that every row has a number with two decimal places. A `"price"` key inside a document guarantees nothing: one row can hold `9.99`, another `"9.99"` as a string, and another no key at all. The rules that [02-relationships.md](02-relationships.md) teaches are declared on columns, not on keys inside a document: a foreign key cannot start from a key in it, and a `CHECK` on one has to extract and cast it first, the same work as the query above. Joining another table through a value buried in the document means extracting and casting it in every query too. So a stable field moved into a `JSONB` column trades the database's checks for a little flexibility, which is rarely a good exchange. Keep `JSONB` for the part of the data that really has no fixed shape.

---

## Rounding and the scale of a result

Docs: https://www.postgresql.org/docs/current/functions-math.html → read: "9.3. Mathematical Functions and Operators" — Table 9.4 (the operators and how mixed types are resolved) and the `round` and `scale` rows of Table 9.5

Every section so far has been about one value at a time. A report rarely shows a stored value: it shows a value computed from several, such as a price times a quantity, an average, a total. This section is about what stays exact in that computation, and where rounding belongs.

### `ROUND(value, n)` only accepts `NUMERIC`

`ROUND(value, n)` rounds a value to `n` decimal places, and a tie is rounded away from zero:

```sql
SELECT ROUND(2.345, 2);   -- 2.35
```

There is also a one-argument `ROUND(value)`, which rounds to a whole number and exists both for `NUMERIC` and for `double precision`. The two-argument form exists **only for `NUMERIC`**. So rounding a `double precision` value to two decimal places fails:

```sql
SELECT ROUND(10::float8 / 3, 2);
```

```
ERROR:  function round(double precision, integer) does not exist
```

The message lists the types of the arguments it received. PostgreSQL looked for a `round` whose first argument is `double precision` and second is `integer`, and found none. It does not convert the first argument to `NUMERIC` by itself, because that conversion is not one it applies automatically to a function's argument. A `HINT` line under the error suggests adding an explicit cast.

The cast belongs **on the argument**, inside the parentheses, so that the function receives a `NUMERIC`:

```sql
-- MAL: round() still receives a double precision value; the cast would only apply to its result
SELECT ROUND(10::float8 / 3, 2)::numeric;

-- BIEN: the division's result is converted first, and round() receives a NUMERIC
SELECT ROUND((10::float8 / 3)::numeric, 2);   -- 3.33
```

The inner parentheses matter too. Without them, `10::float8 / 3::numeric` would convert only the `3`, and a division between a `double precision` and a `NUMERIC` is resolved as `double precision`, the later type in the list from the section [Integer division drops the fraction](#integer-division-drops-the-fraction).

Where does a `double precision` value come from in a report, if you store money as `NUMERIC`? Mostly from averages of measurements. `AVG` of a `REAL` or `DOUBLE PRECISION` column returns `double precision`, so `ROUND(AVG(temperature), 1)` fails and `ROUND(AVG(temperature)::numeric, 1)` works. `AVG` of an `INT` or `NUMERIC` column already returns `NUMERIC` and needs no cast. [07-aggregates.md](07-aggregates.md) teaches `AVG`. Until then, read `AVG(column)` as "the average of the column's values".

### How PostgreSQL decides the scale of a result

The **scale** of a `NUMERIC` value is its number of digits after the decimal point. `scale()` returns it: `SELECT scale(8.4100);` answers `4`. Every `NUMERIC` operator computes the scale of its result from the scales of its operands, with a fixed rule per operator:

| Expression | Scale of the result | Example | Result |
|---|---|---|---|
| `a + b`, `a - b` | the larger of the two scales | `2.50 + 1.5` | `4.00` |
| `a * b` | the two scales added together | `9.99 * 0.85` | `8.4915` |
| `a / b` | enough decimals for at least 16 significant digits, and never fewer than either operand has | `12::numeric / 5` | `2.4000000000000000` |
| an integer used as a `NUMERIC` | 0 | `0` | `0` |
| `ROUND(a, n)` | `n` | `ROUND(8.4915, 2)` | `8.49` |

Read each row as: an operator of this kind, applied to operands with these scales, gives a result with this scale. Addition and multiplication keep every digit the exact answer has, which is why `NUMERIC` arithmetic is exact. Division usually has no exact finite answer, so PostgreSQL stops at a fixed number of significant digits, which are the digits counted from the first one that is not zero. That is the long tail of zeros from the section [Integer division drops the fraction](#integer-division-drops-the-fraction).

The rule applies at every operator, and each result becomes an operand of the next one. So the scale travels outwards through an expression. Take an order line from the practice database, the one in order 9 with three copies of _1984_ at `9.99`, and apply a 15 % discount to it yourself, which means paying 0.85 of the price:

```sql
SELECT 9.99 * 3 * 0.85;          -- 25.4745
SELECT scale(9.99 * 3 * 0.85);   -- 4
```

```
9.99 * 3 * 0.85

step 1:  9.99   *  3      →  29.97        scale 2 + 0 = 2
step 2:  29.97  *  0.85   →  25.4745      scale 2 + 2 = 4
```

No column in the database has scale 4, and the result still has it, because the result's scale came from the operands, not from any column.

### Round the whole expression, never one operand

The result above has to be shown as an amount of money, with two decimal places. The tempting fix rounds the price:

```sql
-- MAL: the price already had 2 decimals; the multiplications after it give scale 4 again
SELECT ROUND(9.99, 2) * 3 * 0.85;   -- 25.4745

-- BIEN: round the finished value, so the last operation applied is the rounding
SELECT ROUND(9.99 * 3 * 0.85, 2);   -- 25.47
```

`ROUND` fixes the scale of its own result and nothing else. In the first statement, its result `9.99` is still an operand of two multiplications, and step 2 of the trace above adds the scales again. Only when `ROUND` is the outermost operation is its scale the scale of what the query returns.

So the rule for any computed amount is: **write the whole calculation first, then wrap all of it in one `ROUND`**. Rounding in the middle also changes the value, not only how it looks: a price rounded before it is multiplied carries the rounding error into every copy.

### The same scale rule inside a report total

This chapter shows the scale rule on plain arithmetic because the rule belongs to `NUMERIC` values themselves. Every expression that produces a `NUMERIC` follows it, with or without a table. The same rule reappears, unchanged, when the expression is a report total. Two functions you have not studied yet make it visible.

`COALESCE(value, fallback)` returns its first argument when that argument is not `NULL`, and its second argument otherwise. [04-where.md](04-where.md) teaches it. Both possible answers keep their own scale:

```sql
SELECT COALESCE(9.99, 0);                       -- 9.99   the first argument, scale 2
SELECT COALESCE(NULL::numeric, 0);              -- 0      the fallback, scale 0
SELECT ROUND(COALESCE(NULL::numeric, 0), 2);    -- 0.00   ROUND gives scale 2 either way
```

The second line returns `0`, not `0.00`. The fallback is the integer literal `0`, and an integer becomes a `NUMERIC` with scale 0. The answer's scale depends on which argument won.

`SUM(column)` adds up a column over many rows. [07-aggregates.md](07-aggregates.md) teaches it, and also why `SUM` over no rows returns `NULL` instead of `0`. That is why a report total is often written `COALESCE(SUM(x), 0)`: a sum of `NUMERIC(8,2)` prices comes back with scale 2 when rows exist, and the fallback comes back as a bare `0` when none do. The fix is the one from the previous section: one `ROUND` around the whole expression. This is where the scale rule comes back in the route: the totals you write in [07-aggregates.md](07-aggregates.md) are expressions of this kind, and their scale is decided exactly as in the trace of the section [How PostgreSQL decides the scale of a result](#how-postgresql-decides-the-scale-of-a-result).

> **Preview — Spring Boot:** the fragment below is JPQL from project 07, the query language that Hibernate translates into SQL, which the introduction to this route showed in the section "Where SQL sits between Angular, Spring Boot and PostgreSQL" of [00-sql-and-relational-databases.md](00-sql-and-relational-databases.md). You study JPQL itself in the Spring Boot notes. Read it here only for where its `round` stands.

In project 07, `TimeEntryRepository.java` builds the summary of a period with this expression, cut down to the part that matters here:

```java
round(COALESCE(SUM(CASE WHEN ... THEN te.hours END), 0), 2) AS approvedHours,
```

`hours` is declared in `TimeEntry`, the Java class Hibernate maps to the time-entry table, with precision 4 and scale 2. The `round(..., 2)` wraps the whole `COALESCE`, so a period with approved hours answers with two decimal places, and a period with none answers `0.00` instead of the scale-0 `0` that the fallback alone would give.

---

## Which type to pick — quick reference

Docs: https://www.postgresql.org/docs/current/datatype.html → read: Table 8.1 "Data Types" — every type name and its aliases in one table

| You are storing | Use |
|-----------------|-----|
| Auto-generated ID | `INT GENERATED ALWAYS AS IDENTITY` |
| Name, title, email | `VARCHAR(n)` |
| Long description | `TEXT` |
| Whole number | `INT` |
| Money / price | `NUMERIC(10,2)` |
| Measurement, scientific value | `DOUBLE PRECISION` |
| True/false flag | `BOOLEAN` |
| Date only | `DATE` |
| Date + time (web app) | `TIMESTAMPTZ` |
| Date + time (local, no TZ) | `TIMESTAMP` |

## What this chapter unlocks

You can now choose a type for any column of a junior schema and say what it guarantees: `VARCHAR(n)` or `TEXT` by whether a maximum belongs to the data, an identity column for generated keys, `NUMERIC(p,s)` for anything counted in money, `TIMESTAMPTZ` for any instant users share, `BOOLEAN` for flags, and `JSONB` only for the part of the data with no fixed shape. You can convert a value with `::` or `CAST`, and you can predict the type and scale of a computed value: an integer division that drops its fraction, a `ROUND` that needs a `NUMERIC`, a total whose scale depends on its operands.

A value on its own is still not data. It needs a table to live in, a key that identifies its row, and rules that say which values the table refuses. With the vocabulary of values settled, [02-relationships.md](02-relationships.md) declares the tables that hold these values, and the keys, constraints and cardinality rules that keep them consistent.
