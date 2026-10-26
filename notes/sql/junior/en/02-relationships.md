## Index of this note

- [SQL — Defining a Schema](#sql--defining-a-schema)

1. [Declaring a table with `CREATE TABLE`](#declaring-a-table-with-create-table)
   - [What one `CREATE TABLE` settles for every client](#what-one-create-table-settles-for-every-client)
   - [Column constraints and table constraints](#column-constraints-and-table-constraints)
   - [Constraint names, and the errors that quote them](#constraint-names-and-the-errors-that-quote-them)
   - [Three one-row statements for testing a table](#three-one-row-statements-for-testing-a-table)
2. [`DEFAULT` — the value used when an insert leaves a column out](#default--the-value-used-when-an-insert-leaves-a-column-out)
   - [An omitted column against an explicit `NULL`](#an-omitted-column-against-an-explicit-null)
3. [`NOT NULL`, `CHECK` and `UNIQUE` — rules on the values of a row](#not-null-check-and-unique--rules-on-the-values-of-a-row)
   - [`NOT NULL` makes a value required](#not-null-makes-a-value-required)
   - [`CHECK` rejects false and lets unknown through](#check-rejects-false-and-lets-unknown-through)
   - [`UNIQUE` rejects repeated values, but not repeated `NULL`s](#unique-rejects-repeated-values-but-not-repeated-nulls)
   - [Uniqueness across several columns](#uniqueness-across-several-columns)
   - [The four rules side by side](#the-four-rules-side-by-side)
4. [Keys — how a row is identified](#keys--how-a-row-is-identified)
   - [The grain of a table](#the-grain-of-a-table)
   - [Candidate keys and the primary key](#candidate-keys-and-the-primary-key)
   - [Primary key against `UNIQUE`](#primary-key-against-unique)
   - [Natural keys and surrogate keys](#natural-keys-and-surrogate-keys)
5. [Foreign keys — how a row refers to a row of another table](#foreign-keys--how-a-row-refers-to-a-row-of-another-table)
   - [What `REFERENCES` checks](#what-references-checks)
   - [What a foreign key can reference](#what-a-foreign-key-can-reference)
6. [Kinds of relationship — how many rows on each side](#kinds-of-relationship--how-many-rows-on-each-side)
   - [Two questions tell the kinds apart](#two-questions-tell-the-kinds-apart)
7. [Placing the foreign key and building a junction table](#placing-the-foreign-key-and-building-a-junction-table)
   - [Why the foreign key goes on the many side](#why-the-foreign-key-goes-on-the-many-side)
   - [A junction table holds one row per pair](#a-junction-table-holds-one-row-per-pair)
   - [One-to-one is a foreign key that is also unique](#one-to-one-is-a-foreign-key-that-is-also-unique)
8. [ON DELETE behaviour](#on-delete-behaviour)
   - [What each action does to the child rows](#what-each-action-does-to-the-child-rows)
   - [`NO ACTION` against `RESTRICT` — when the check runs](#no-action-against-restrict--when-the-check-runs)
   - [`ON UPDATE` fires only when the referenced key changes](#on-update-fires-only-when-the-referenced-key-changes)
9. [Normalization — each fact stored once](#normalization--each-fact-stored-once)
   - [Three anomalies of a table that stores copies](#three-anomalies-of-a-table-that-stores-copies)
   - [`unit_price` is a fact about the sale, not a copy](#unit_price-is-a-fact-about-the-sale-not-a-copy)
10. [Reading a relational schema before you query it](#reading-a-relational-schema-before-you-query-it)
    - [The practice schema, read table by table](#the-practice-schema-read-table-by-table)
    - [What the reading shows is missing](#what-the-reading-shows-is-missing)
11. [Changing a table with `ALTER TABLE`](#changing-a-table-with-alter-table)
    - [Adding, changing and removing a column](#adding-changing-and-removing-a-column)
    - [Adding and removing a constraint](#adding-and-removing-a-constraint)
    - [Defaults on a table that already holds rows](#defaults-on-a-table-that-already-holds-rows)
    - [Migration tools run these same statements](#migration-tools-run-these-same-statements)
12. [Adding a constraint to a table that already holds rows](#adding-a-constraint-to-a-table-that-already-holds-rows)
    - [Correct the rows first, then add the constraint](#correct-the-rows-first-then-add-the-constraint)
13. [`DROP` removes the table, `DELETE` and `TRUNCATE` remove rows](#drop-removes-the-table-delete-and-truncate-remove-rows)
    - [What `DROP TABLE` takes with it](#what-drop-table-takes-with-it)
14. [Naming conventions](#naming-conventions)
15. [What this chapter unlocks](#what-this-chapter-unlocks)

# SQL — Defining a Schema

Docs: https://www.postgresql.org/docs/current/ddl.html → read: "Chapter 5. Data Definition" — sections 5.1 to 5.7 (tables, defaults, constraints, and modifying tables), which this chapter follows

---

[01-data-types.md](01-data-types.md) settled what a single value is: what each type accepts, how a value is converted, and what stays exact in a calculation. It ended on the point this chapter starts from: a value still needs a table to live in, a way to tell its row apart from every other row, and rules that say which values the table refuses. The seed script you ran in [00-sql-and-relational-databases.md](00-sql-and-relational-databases.md) already holds eight `CREATE TABLE` statements, and that introduction taught you to read the first two parts of one column definition: the name and the data type. This chapter is about everything written after the type, and about the table as a whole.

Some of those rules connect one table to another. Chapter 00 showed that the row of _1984_ holds `1` in `author_id`, and that the author whose `id` is `1` is George Orwell. That number is the only link between the two rows. Without a rule on it, nothing stops a book from holding `99` in `author_id`, the `id` of an author who does not exist: PostgreSQL would store it, and every query that looks for that book's author would find nobody. The rule that refuses such a value is a **foreign key**, and this chapter declares it together with the rules that protect each single row.

The chapter is built in four stages, and each one needs the one before it. It opens with the statement that declares a table, `CREATE TABLE`, and with the three short statements you use to test one. With a table in place, it takes the rules on the values of a single row: the default value, `NOT NULL`, `CHECK` and `UNIQUE`. The second stage is identity, because a rule that connects two tables needs each row to be identifiable first: keys, then foreign keys, then the kinds of relationship that foreign keys build, and what happens to the rows that point at a row you delete. The third stage steps back from single rules to the whole design. It explains why the data is split across several tables at all, and how to read a schema before you query it. The last stage is change over time: `ALTER TABLE` for a table that already exists, why a new rule can fail on rows that are already stored, and what `DROP` removes. The chapter closes with naming conventions and the handoff to chapter 03.

> **Every experiment in this chapter changes the practice database, and one table needs dropping by hand.** The chapter creates one table of its own, `wishlist_items`, and carries it through most sections. The seed script from chapter 00 does not know about it. So before you run the seed script again to undo your experiments, run `DROP TABLE IF EXISTS wishlist_items;` first. The section [What `DROP TABLE` takes with it](#what-drop-table-takes-with-it) explains what goes wrong if you skip that step.

---

## Declaring a table with `CREATE TABLE`

Docs: https://www.postgresql.org/docs/current/ddl-basics.html → read: "5.1. Table Basics" — creating and dropping a table, with the first example of a column list

The bookstore needs a wishlist: each customer can keep a list of the books they want, and the shop can tell them when one gets cheaper. No table of the practice database holds that, so you declare one. Open a Query Tool on `practice_junior_notes`, as chapter 00 showed, and run this statement:

```sql
CREATE TABLE wishlist_items (
  id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  book_id     INT NOT NULL REFERENCES books(id),
  priority    INT NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  max_price   NUMERIC(8,2) CHECK (max_price > 0),
  added_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT wishlist_items_customer_book_key UNIQUE (customer_id, book_id)
);
```

The Messages tab answers `CREATE TABLE`. The table now exists, empty, under **practice_junior_notes → Schemas → public → Tables** in the Object Explorer (right-click **Tables** and choose **Refresh…** if it does not appear).

Read the statement before you put a single row into it. Every column carries the type chapter 01 taught you to choose, and after the type comes a rule or a default value. Each of those words has one section that teaches it:

| Part of the statement | What it declares | Where it is taught |
|---|---|---|
| `GENERATED ALWAYS AS IDENTITY` | PostgreSQL generates the `id` | [01-data-types.md](01-data-types.md), in the section _Identity columns and `SERIAL`_ |
| `PRIMARY KEY` | the column that identifies each row | [Keys — how a row is identified](#keys--how-a-row-is-identified) |
| `NOT NULL` | the value is required | [`NOT NULL` makes a value required](#not-null-makes-a-value-required) |
| `REFERENCES customers(id)` | the value must be the `id` of an existing customer | [Foreign keys — how a row refers to a row of another table](#foreign-keys--how-a-row-refers-to-a-row-of-another-table) |
| `ON DELETE CASCADE` | what happens to these rows when their customer is deleted | [ON DELETE behaviour](#on-delete-behaviour) |
| `DEFAULT 3`, `DEFAULT now()` | the value used when an insert leaves the column out | [`DEFAULT` — the value used when an insert leaves a column out](#default--the-value-used-when-an-insert-leaves-a-column-out) |
| `CHECK (...)` | a condition every value must meet | [`CHECK` rejects false and lets unknown through](#check-rejects-false-and-lets-unknown-through) |
| `UNIQUE (customer_id, book_id)` | the same customer cannot list the same book twice | [Uniqueness across several columns](#uniqueness-across-several-columns) |

The left column quotes the statement, so you can find each part in it. The right column is your reading order for the rest of the chapter: every row but the first points at a section of this file, and the first at the chapter 01 section you already studied.

`now()` returns the current date and time as a `TIMESTAMPTZ`. [14-postgresql-specifics.md](14-postgresql-specifics.md) teaches it together with PostgreSQL's other date functions. For now, read `DEFAULT now()` as "the moment the row was inserted".

### What one `CREATE TABLE` settles for every client

`CREATE TABLE` is a **DDL** statement. DDL (Data Definition Language) is the name for the statements that create, change and remove database objects such as tables, as opposed to the statements that read or change rows. The definition it stores is not a suggestion. From now on, PostgreSQL compares every row that any client tries to store in `wishlist_items` against it:

1. A client sends an `INSERT` or an `UPDATE` for `wishlist_items`.
2. For an `INSERT`, PostgreSQL fills in every column the statement left out with that column's default value. An `UPDATE` keeps the stored values of the columns it does not name.
3. It converts each new value to the column's type, as chapter 01 described.
4. It checks the row against every rule of the definition: `NOT NULL`, `CHECK`, `UNIQUE`, `PRIMARY KEY` and the foreign keys.
5. If any rule fails, the whole statement is rejected and nothing is stored.

That is what "the database enforces it" means in practice. The Spring Boot application, pgAdmin and a colleague's script all reach the table through those five steps. None of them can decide, for itself, to store a wishlist entry with a priority of 9 or for a customer who does not exist. The application can still check the same things earlier, to give the user a friendlier message. It can no longer decide that the rule does not apply.

That is also why you read the full definition **before** loading data. The definition decides which of your `INSERT` statements will be accepted. If you write the inserts first and read the table afterwards, every rule you did not know about reaches you as an error, one statement at a time.

A definition is not fixed forever. `ALTER TABLE` changes it after the table exists: it adds and removes columns, changes a column's type or default, and adds and removes rules. The section [Changing a table with `ALTER TABLE`](#changing-a-table-with-alter-table) teaches it, and the section after that shows why a new rule can fail on rows that are already stored.

### Column constraints and table constraints

A **constraint** is a rule declared on a table, which PostgreSQL checks on every row, as chapter 00 showed with the rating of a review. `CREATE TABLE` accepts a constraint in two places.

A **column constraint** is written inside one column's definition, after the type. It applies to that column only. `NOT NULL`, `DEFAULT 3` (strictly a default value, not a rule, but written in the same place), `CHECK (priority BETWEEN 1 AND 5)` and `REFERENCES customers(id)` are all written that way above.

A **table constraint** is written as its own item in the list, separated from the columns by a comma, and it names the columns it applies to. The last line of the statement is one:

```sql
  CONSTRAINT wishlist_items_customer_book_key UNIQUE (customer_id, book_id)
```

A rule that involves **several columns** has to be a table constraint, because no single column definition can speak about another column. "This customer and this book together" is such a rule. A rule on one column can be written either way, and the two forms mean exactly the same:

```sql
-- Column constraint: inside the definition of priority
priority INT NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),

-- Table constraint: its own item, naming the column it checks
priority INT NOT NULL DEFAULT 3,
CHECK (priority BETWEEN 1 AND 5),
```

Use the column form for a one-column rule, because the rule then sits next to the column it protects. Use the table form when the rule spans several columns.

### Constraint names, and the errors that quote them

Every constraint has a name, and for every kind of rule except `NOT NULL`, PostgreSQL quotes that name in the error it raises when a row breaks the rule. You saw one in chapter 00: `reviews_rating_check`.

`CONSTRAINT wishlist_items_customer_book_key` gives the composite rule an explicit name. Where you write no name, PostgreSQL builds one from the table name, the column names and a suffix for the kind of rule:

| Kind of rule | Suffix | Name PostgreSQL gives it in `wishlist_items` |
|---|---|---|
| Primary key | `_pkey` | `wishlist_items_pkey` |
| Unique | `_key` | `wishlist_items_customer_id_book_id_key`, had the line above no name |
| Check | `_check` | `wishlist_items_priority_check`, `wishlist_items_max_price_check` |
| Foreign key | `_fkey` | `wishlist_items_customer_id_fkey`, `wishlist_items_book_id_fkey` |
| Not null | `_not_null` | `wishlist_items_priority_not_null`, and one for each other `NOT NULL` column |

The `NOT NULL` row is new in PostgreSQL 18, the version installed on your machine: earlier versions keep `NOT NULL` as a mark on the column, with no name. Its error names the column instead of the constraint, as the section [An omitted column against an explicit `NULL`](#an-omitted-column-against-an-explicit-null) shows. For the other four kinds, the suffix is what tells you, inside an error message, which kind of rule refused the row. The generated names are fine for one-column rules. Name a rule yourself when the generated name would be long or would not say what the rule is for, because that name is what you will read in a stack trace from the application.

In pgAdmin, expand **Tables → wishlist_items → Constraints** in the Object Explorer to see the table's primary key, unique, check and foreign-key rules under their names.

### Three one-row statements for testing a table

A table you just declared is tested by trying to store rows in it and watching what PostgreSQL accepts. That takes three statements, each in its shortest form. [08-dml.md](08-dml.md) teaches all three in full: several rows in one statement, copying rows from a query, getting generated values back, and why a missing `WHERE` is dangerous. Here you need only the shape of each.

**`INSERT` adds one row.** You name the table, list the columns you are giving values for, and give the values in the same order:

```sql
INSERT INTO wishlist_items (customer_id, book_id)
VALUES (1, 4);
```

This says: in `wishlist_items`, add a row whose `customer_id` is 1 and whose `book_id` is 4. Customer 1 is Ana García, and book 4 is _Emma_. Every column not in the list (`id`, `priority`, `max_price`, `added_at`) is filled in by step 2 of the five steps above. To see the stored row, read it back with the `SELECT` form chapter 00 used:

```sql
SELECT id, customer_id, book_id, priority, max_price, added_at
FROM wishlist_items;
```

```
 id | customer_id | book_id | priority | max_price | added_at
----+-------------+---------+----------+-----------+-------------------------------
  1 |           1 |       4 |        3 |    [null] | 2026-10-26 17:13:29.188568+01
```

`id` came from the identity column, `priority` from `DEFAULT 3`, and `added_at` from `DEFAULT now()`, so your timestamp will be the moment you ran the insert. `max_price` has no default, so it holds `NULL`.

**`UPDATE` changes the values of rows that already exist.** You name the table, say which column takes which new value after `SET`, and say which rows after `WHERE`:

```sql
UPDATE wishlist_items
SET priority = 1
WHERE id = 1;
```

This says: in `wishlist_items`, for the row whose `id` is 1, set `priority` to 1. The new value goes through the same checks as an inserted one, so `SET priority = 9` would be rejected by the `CHECK`. Chapter 00 already ran an `UPDATE` of this shape on `books`.

**`DELETE` removes rows.** You name the table and say which rows after `WHERE`:

```sql
DELETE FROM customers
WHERE id = 8;
```

This says: remove from `customers` the row whose `id` is 8. Do not run it yet. The section [What each action does to the child rows](#what-each-action-does-to-the-child-rows) runs it, because removing a row is where foreign keys start to act.

> **`WHERE id = n` is what limits these statements to one row.** `id` is the primary key, so at most one row has that value. Without a `WHERE`, `UPDATE` and `DELETE` act on every row of the table. Every `UPDATE` and `DELETE` in this chapter carries a `WHERE` for that reason, and most of them name a single `id`; [08-dml.md](08-dml.md) teaches how to check which rows a `WHERE` reaches before you change them.

## `DEFAULT` — the value used when an insert leaves a column out

Docs: https://www.postgresql.org/docs/current/ddl-default.html → read: "5.2. Default Values" — when a default is used, the null default, and an expression evaluated at insert time

The insert above gave values for two columns, and the stored row had six. Typing every column on every insert would be tedious, and for some columns the right value is always the same: a new wishlist entry starts at the middle priority, and it was added now. A **default value** is the value PostgreSQL writes into a column when an insert does not give one.

```sql
priority    INT NOT NULL DEFAULT 3 ...,
added_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
```

Two details of the definition decide how a default behaves:

- **A default can be an expression, and the expression is evaluated at each insert.** `now()` is not computed when the table is created. It is computed every time a row needs it, so each row gets the moment of its own insert. The seed script uses the same idea for `joined_date DATE NOT NULL DEFAULT CURRENT_DATE` in `customers`.
- **A column with no `DEFAULT` clause still has a default: `NULL`.** That is why `max_price` came back as `NULL`. Leaving out a column with no default stores `NULL` in it, or fails if the column is `NOT NULL`.

You already met one default without its name. In [01-data-types.md](01-data-types.md), the section _Identity columns and `SERIAL`_ showed that `SERIAL` expands into a column whose default is `nextval(...)`, a call that takes the next number from a sequence. That is an ordinary default: it is used only when the insert leaves `id` out.

### An omitted column against an explicit `NULL`

The rule is precise: a default is used when the insert **leaves the column out**. It is not used when the insert gives the column a value, and `NULL` written in the statement counts as a value given. Customer 2, Luis Pérez, also wants _Emma_, and this insert names `priority` and gives it `NULL`:

```sql
-- MAL: priority is named, so its default is not used, and NULL is stored or rejected
INSERT INTO wishlist_items (customer_id, book_id, priority)
VALUES (2, 4, NULL);
```

```
ERROR:  null value in column "priority" of relation "wishlist_items" violates not-null constraint
DETAIL:  Failing row contains (2, 2, 4, null, null, 2026-10-26 17:14:02.531207+01).
```

The first line names the failure: a `NULL` reached `priority`, which is `NOT NULL`. The `DETAIL` line shows the row PostgreSQL built before rejecting it. Read its values in the column order of the table: `id` 2, `customer_id` 2, `book_id` 4, `priority` null. `DEFAULT 3` did not replace the `NULL`, because the statement asked for `NULL` explicitly. A column without `NOT NULL` would have stored it.

Leaving the column out, or writing the keyword `DEFAULT` in its place, both get the default:

```sql
-- BIEN: the keyword DEFAULT asks for the column's default value
INSERT INTO wishlist_items (customer_id, book_id, priority)
VALUES (2, 4, DEFAULT);
```

The keyword is useful when the column list is fixed, for example in an insert your application builds, and only some rows should get the default. It also works in an `UPDATE`: `SET priority = DEFAULT` puts the default back.

> **Why does the application not just send `null` and let the database fill it in?** Because the database has no way to tell "I have no value" from "the value is `NULL`". Both arrive as `NULL`. Only leaving the column out of the statement says "use the default". This matters with an ORM, which writes every mapped column into its `INSERT` by default: a field left `null` in the Java object reaches the table as an explicit `NULL`, and the column's default never runs.

Read the table back now, sorted by `id` (`ORDER BY` asks for an order, which a result otherwise does not have, as chapter 00 showed):

```sql
SELECT id, customer_id, book_id, priority
FROM wishlist_items
ORDER BY id;
```

```
 id | customer_id | book_id | priority
----+-------------+---------+----------
  1 |           1 |       4 |        1
  3 |           2 |       4 |        3
```

There is no row 2. The rejected insert took the number 2 from the identity column's sequence before it failed, and a number taken is never given back. [01-data-types.md](01-data-types.md) warned about these gaps in its section _Identity columns and `SERIAL`_.

A default has one more limit: it acts only at the moment a row is inserted. Adding a default to a table that already holds rows does not change those rows. That belongs to `ALTER TABLE`, and the section [Defaults on a table that already holds rows](#defaults-on-a-table-that-already-holds-rows) shows it.

## `NOT NULL`, `CHECK` and `UNIQUE` — rules on the values of a row

Docs: https://www.postgresql.org/docs/current/ddl-constraints.html → read: "5.5.1. Check Constraints", "5.5.2. Not-Null Constraints" and "5.5.3. Unique Constraints"

A data type limits what kind of value a column takes: a number, not text. It cannot say that a priority goes from 1 to 5, that every wishlist entry has a book, or that an email belongs to one customer only. Those are rules of the business, and these three constraints declare them.

### `NOT NULL` makes a value required

A column accepts `NULL` unless its definition says otherwise. `NOT NULL` says that every row must have a value in that column. You just saw it reject a row, in the section [An omitted column against an explicit `NULL`](#an-omitted-column-against-an-explicit-null), with SQL state `23502`.

Decide it per column, from what the data means:

- `customer_id` and `book_id` are `NOT NULL` because a wishlist entry with no customer, or with no book, describes nothing.
- `max_price` is nullable because a customer may want a book at any price. `NULL` there means "no price limit was given", which is a real state of the data, not a missing input.

That second case is the question to ask for every column: does `NULL` mean something true about this row, or would it only ever mean that someone forgot? If it can only mean a mistake, declare the column `NOT NULL`.

### `CHECK` rejects false and lets unknown through

A **check constraint** is a condition written in parentheses after `CHECK`. PostgreSQL evaluates it for every row it is about to store, and rejects the row when the condition is false:

```sql
INSERT INTO wishlist_items (customer_id, book_id, priority)
VALUES (2, 5, 9);
```

```
ERROR:  new row for relation "wishlist_items" violates check constraint "wishlist_items_priority_check"
```

It is the same kind of message chapter 00 showed for a review with a rating of 9, now naming this table's rule, with SQL state `23514`.

The exact rule has a third case, and it is the one that surprises people. Chapter 00 showed that a comparison with `NULL` gives `NULL` as its answer, which SQL treats as "unknown". A check condition therefore has three possible results, and PostgreSQL rejects only one of them:

| The condition evaluates to | The row is | Example with `CHECK (max_price > 0)` |
|---|---|---|
| true | accepted | `max_price` = 12.00 |
| false | rejected | `max_price` = -5 |
| unknown (`NULL`) | **accepted** | `max_price` = `NULL`, because `NULL > 0` is `NULL` |

Read each row as: if the condition gives this result, the row is accepted or rejected. A check rejects a row only when it can prove the row wrong. With `NULL` it can prove nothing, so it lets the row through. Try both:

```sql
INSERT INTO wishlist_items (customer_id, book_id, max_price)
VALUES (3, 4, -5);      -- rejected: wishlist_items_max_price_check

INSERT INTO wishlist_items (customer_id, book_id, max_price)
VALUES (3, 4, NULL);    -- accepted
```

For `max_price` that is exactly the behaviour you want: no limit is allowed, and a limit that is given must be positive. It goes wrong when the value is **required**. Take the `hours` of a time entry, which must be a positive number for every row:

```sql
-- MAL: a row with hours = NULL passes the check
hours NUMERIC(4,2) CHECK (hours > 0)

-- BIEN: NOT NULL rejects the missing value, CHECK rejects the wrong one
hours NUMERIC(4,2) NOT NULL CHECK (hours > 0)
```

So `CHECK` never replaces `NOT NULL`. When a column must have a value **and** the value must meet a condition, it needs both rules.

> **Why does a check let `NULL` through when `WHERE` drops it?** They answer different questions. `WHERE` keeps a row only when its condition is true, so an unknown result drops the row. A check rejects a row only when its condition is false, so an unknown result keeps it. The same `NULL` is filtered out by a query and accepted by a constraint. [04-where.md](04-where.md) teaches the `WHERE` side.

### `UNIQUE` rejects repeated values, but not repeated `NULL`s

A **unique constraint** says that no two rows may hold the same value in a column. The practice database has two: `email` in `customers` and `isbn` in `books`. Try to store a second book with the ISBN of _1984_:

```sql
INSERT INTO books (title, isbn)
VALUES ('1984, second edition', '978-0451524935');
```

```
ERROR:  duplicate key value violates unique constraint "books_isbn_key"
DETAIL:  Key (isbn)=(978-0451524935) already exists.
```

The SQL state is `23505`. The `DETAIL` line names the column and the value that is already taken.

To check every insert quickly, PostgreSQL does not compare the new value with every row of the table. Declaring a unique constraint makes it build a **unique index** on the column: a separate structure, kept sorted by the column's values, in which PostgreSQL can find any value without reading the table. The kind of index it builds is called a **B-tree**, a tree of sorted values. Before storing a row, PostgreSQL looks the new value up in the index, and a hit means a duplicate. The index gets the same name as the constraint, `books_isbn_key`. [13-indexes.md](13-indexes.md) teaches indexes.

Now look at the seed data. Two books have no ISBN: _Emma_ and _The Angel's Game_ both hold `NULL` in `isbn`, and the constraint accepted them both. That follows from the same three-valued logic as the check above:

1. A unique constraint rejects a row whose value **equals** a value already stored.
2. `NULL = NULL` is not true. It is `NULL`, unknown.
3. So two `NULL`s are never equal, and they never count as a duplicate.

For `isbn` that is the right behaviour: a book with no ISBN does not clash with another book with no ISBN. So a `UNIQUE` column can stay nullable, and it then means "no two rows share a value, and any number of rows may have none".

When the domain says there can be at most one row without a value, PostgreSQL lets you ask for `NULL`s to be treated as equal, with `NULLS NOT DISTINCT`, a clause available since PostgreSQL 15:

```sql
isbn VARCHAR(20) UNIQUE NULLS NOT DISTINCT
```

With that clause, a second `NULL` is a duplicate like any other value. You cannot add it to the practice `books` table as it is, because it already holds two `NULL`s. The section [Adding a constraint to a table that already holds rows](#adding-a-constraint-to-a-table-that-already-holds-rows) shows that failure.

> **A check in your code is not a substitute for `UNIQUE`.** Looking for an existing email with a `SELECT` before inserting a new one is two statements. Two requests can both look, both find nothing, and both insert. Only the constraint decides in one step. [08-dml.md](08-dml.md) teaches that race and `ON CONFLICT`, the statement that handles a duplicate without an error.

### Uniqueness across several columns

Sometimes no single column is unique, and only a combination is. In `wishlist_items`, customer 1 can list many books, and book 4 can be listed by many customers. What must not happen is customer 1 listing book 4 twice. That is a rule on the **pair** `(customer_id, book_id)`, so it is written as a table constraint naming both columns:

```sql
CONSTRAINT wishlist_items_customer_book_key UNIQUE (customer_id, book_id)
```

A row is a duplicate only when **both** columns equal those of an existing row. Ana already has _Emma_ on her list, from the first insert of this chapter:

```sql
INSERT INTO wishlist_items (customer_id, book_id)
VALUES (1, 4);
```

```
ERROR:  duplicate key value violates unique constraint "wishlist_items_customer_book_key"
DETAIL:  Key (customer_id, book_id)=(1, 4) already exists.
```

`(1, 6)` would be accepted: the same customer with another book. `(2, 4)` was accepted earlier in this chapter for the mirror reason: the same book with another customer. Each column repeats freely, and only the pair cannot. Writing `UNIQUE` on each column separately would be a different and wrong rule: it would allow each customer a single book, and each book a single customer.

This is the usual shape of a business rule on a combination: one membership per user and project, one review per customer and book, one line per book within an order.

### The four rules side by side

These rules are easy to blur, because all of them can reject the same insert. The table sets them side by side. The second column says what makes each rule reject a row, and the third says what it does when the value is `NULL`:

| Rule | Rejects a row when… | With `NULL` |
|---|---|---|
| `NOT NULL` | the column has no value | rejects it: that is the rule's whole job |
| `CHECK (condition)` | the condition is false | accepts it, because the condition is unknown |
| `UNIQUE (column)` | another row already holds the same value | accepts it, and accepts any number of `NULL`s unless `NULLS NOT DISTINCT` is written |
| `UNIQUE (column_a, column_b)` | another row already holds the same combination | accepts a combination that contains a `NULL`, for the same reason |

Only the first row rejects `NULL`. That is why a required value needs `NOT NULL` whatever other rule the column carries.

## Keys — how a row is identified

Docs: https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-PRIMARY-KEYS → read: "5.5.4. Primary Keys" — what a primary key adds over `UNIQUE` and `NOT NULL`, and why every table should have one

A JavaScript object is identified by its reference: two objects with the same properties are still two objects. A row has no reference. Two rows with the same values in every column are indistinguishable, and a statement that wants to change one of them changes both. So a table needs a column, or a set of columns, whose value tells every row apart. That is what a **key** is.

### The grain of a table

Before choosing a key, say what one row of the table stands for. That is called the **grain** of the table. The grain of `books` is one book. The grain of `order_items` is one book within one order. The grain of `wishlist_items` is one book on one customer's list.

The grain tells you what has to be unique. If one row of `wishlist_items` is "one book on one customer's list", then two rows with the same customer and the same book would be the same thing stored twice. The composite rule of the section [Uniqueness across several columns](#uniqueness-across-several-columns) is the grain written down as a constraint.

Saying the grain out loud is also how you read a table you did not design, as the section [Reading a relational schema before you query it](#reading-a-relational-schema-before-you-query-it) does, and how [06-joins.md](06-joins.md) predicts how many rows a join returns.

### Candidate keys and the primary key

A **candidate key** is any column, or smallest set of columns, whose values are unique in every row and never missing. `books` has two candidates: `id`, and `isbn` if every book had one. `customers` has `id` and `email`. `wishlist_items` has `id` and the pair `(customer_id, book_id)`.

The **primary key** is the one candidate you choose as the table's official identifier. `PRIMARY KEY` declares it, and it means three things together:

1. **Unique.** No two rows have the same value.
2. **Not null.** Every row has a value. The column becomes `NOT NULL` without you writing it.
3. **The default target of foreign keys.** A foreign key that names a table but no column, such as `REFERENCES customers`, points at that table's primary key.

A primary key can span several columns. Instead of the `id`, `wishlist_items` could have used its natural pair as its key:

```sql
CREATE TABLE wishlist_items_example (
  customer_id INT NOT NULL REFERENCES customers(id),
  book_id     INT NOT NULL REFERENCES books(id),
  PRIMARY KEY (customer_id, book_id)
);
```

This is only an example, so there is no need to run it. A **composite primary key** like this is a table constraint, for the same reason as a composite `UNIQUE`: it speaks about two columns.

> **A table can exist without a primary key.** SQL does not require one. `CREATE TABLE no_key (x INT);` is accepted, and two rows holding `1` can then be inserted, with nothing to tell them apart. If you try it, remove the table again with `DROP TABLE no_key;`, because the seed script does not know about it. Every table that an application reads and writes should have one anyway, because `UPDATE ... WHERE id = 1` and every foreign key depend on a value that picks exactly one row.

### Primary key against `UNIQUE`

A primary key is unique and not null, so `UNIQUE NOT NULL` looks the same. Both reject duplicates, and both can span several columns. Three differences remain, and the first is the reason `UNIQUE` exists at all:

| | `PRIMARY KEY` | `UNIQUE` |
|---|---|---|
| How many per table | at most one | as many as you need |
| `NULL` allowed | never: the columns are `NOT NULL` automatically | yes, unless the column is also declared `NOT NULL` |
| What a foreign key points at when it names no column | this | never by default; a foreign key can still name it explicitly |

Try to give `wishlist_items` a second primary key:

```sql
ALTER TABLE wishlist_items ADD PRIMARY KEY (customer_id, book_id);
```

```
ERROR:  multiple primary keys for table "wishlist_items" are not allowed
```

That is the case `UNIQUE` covers. A table has one primary key and often more than one rule of the form "this value cannot repeat". `customers` uses `id` as its primary key and still needs `email` to be unique. `wishlist_items` uses `id` and still needs the pair to be unique. Every candidate key you did not choose as the primary key is declared `UNIQUE`, or the database stops protecting it. `ALTER TABLE`, which this statement starts with, is taught in the section [Changing a table with `ALTER TABLE`](#changing-a-table-with-alter-table).

### Natural keys and surrogate keys

A **natural key** is a candidate key made of data that means something outside the database: an ISBN, an email, a national ID number. A **surrogate key** is a value invented only to identify the row, with no meaning of its own: the `id` that an identity column or `SERIAL` hands out.

Every table of the practice database uses a surrogate `id` as its primary key, and the two natural keys show why:

- **A natural key can be missing.** _Emma_ has no ISBN in the seed data. A primary key can never be `NULL`, so `isbn` cannot identify every book.
- **A natural key can change.** A customer can change email address. If `email` were the primary key, every row in `orders` and `reviews` pointing at that customer would have to change too. The section [`ON UPDATE` fires only when the referenced key changes](#on-update-fires-only-when-the-referenced-key-changes) shows what that costs. An `id` never changes, because nothing in the business gives anyone a reason to change it.

A surrogate key gives the row a stable identity. It does **not** make the natural key stop being unique. The domain still says two customers cannot share an email, and the surrogate key knows nothing about that rule. That is why `customers` declares both:

```sql
id    SERIAL PRIMARY KEY,                  -- surrogate: identifies the row, never changes
email VARCHAR(100) UNIQUE NOT NULL,        -- natural: the business rule that it cannot repeat
```

> **Why not only the `id`?** Then nothing stops the same person registering twice with the same email. Each row gets its own `id`, so the primary key sees two different rows. The duplicate is only caught by a `UNIQUE` on the natural key.

> **Preview — Spring Boot:** The fragment below is a JPA entity from project 07, a Java class that Hibernate maps to a table. You study entities in the Spring Boot notes. Read it here only for the two keys it declares.

Project 07 makes the same choice in `User.java`, the class Hibernate maps to the `users` table:

```java
@Id
@GeneratedValue
private Long id;

@Column(nullable = false, unique = true)
private String email;
```

`@Id` with `@GeneratedValue` is the surrogate key, a number the database hands out. `unique = true` with `nullable = false` asks for `UNIQUE NOT NULL` on the natural key, so two users can never register with the same email whatever the Java code does.

## Foreign keys — how a row refers to a row of another table

Docs: https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK → read: "5.5.5. Foreign Keys" — the first examples, up to the referential actions

The second paragraph of this chapter named the danger: the `1` in the `author_id` of _1984_ is only a number in a column, and without a rule `author_id` can hold the `id` of an author who does not exist. With every row now identified by a key, this section declares that rule.

### What `REFERENCES` checks

A **foreign key** is a column, or a set of columns, whose value must match a key of another table. `REFERENCES` declares it:

```sql
customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
```

The table holding the foreign key, `wishlist_items`, is the **referencing** or **child** table. The table it points at, `customers`, is the **referenced** or **parent** table. "Child" and "parent" are the names you will hear in a team; PostgreSQL's documentation uses "referencing" and "referenced". The two roles belong to one foreign key, not to a table: `books` is the child of `authors`, through `books.author_id`, and the parent of `order_items` and `reviews`, whose `book_id` points at it.

The rule is **referential integrity**: every non-`NULL` value in the foreign key must exist in the referenced key. PostgreSQL checks it every time the child row is inserted or its foreign key changes. Try a wishlist entry for a customer who does not exist:

```sql
INSERT INTO wishlist_items (customer_id, book_id)
VALUES (99, 1);
```

```
ERROR:  insert or update on table "wishlist_items" violates foreign key constraint "wishlist_items_customer_id_fkey"
DETAIL:  Key (customer_id)=(99) is not present in table "customers".
```

The SQL state is `23503`. The first line says which table and which rule, the `DETAIL` line says which value had nothing to point at.

The rule has a second half, on the parent side. Deleting a customer who still has wishlist entries would leave those entries pointing at nothing. So PostgreSQL also checks the parent table: when a parent row is deleted, or its key changes, the foreign key decides what happens to the children. The section [ON DELETE behaviour](#on-delete-behaviour) is about that half.

> **A foreign key accepts `NULL`.** The rule applies to non-`NULL` values only. `books.author_id` has no `NOT NULL`, so a book can exist with no author at all. That is a decision about the data: "a book always has an author" is written as `NOT NULL` plus `REFERENCES`, and "a book may have an author" as `REFERENCES` alone.

### What a foreign key can reference

A foreign key must point at columns that are guaranteed unique in the parent table: its primary key, or columns with a `UNIQUE` constraint. The reason is the meaning of the rule. "The customer whose `id` is 1" must name one customer. A value that could match three rows would not say which parent the child belongs to.

So this is rejected when the table is declared, before any row exists:

```sql
CREATE TABLE city_notes (
  city VARCHAR(50) REFERENCES customers(city)
);
```

```
ERROR:  there is no unique constraint matching given keys for referenced table "customers"
```

`city` is not unique in `customers`, since two customers live in Madrid. A foreign key to a natural key that **is** unique is accepted: `genres.name` is `UNIQUE NOT NULL`, so `REFERENCES genres(name)` is a valid foreign key. The section [`ON UPDATE` fires only when the referenced key changes](#on-update-fires-only-when-the-referenced-key-changes) uses exactly that.

When a foreign key names no column, as in `REFERENCES customers`, it points at the parent's primary key.

## Kinds of relationship — how many rows on each side

Docs: https://en.wikipedia.org/wiki/Cardinality_(data_modeling) → read: "Relationships" — one-to-one, one-to-many and many-to-many, each with an example

A foreign key connects each child row to one parent row. It does not yet say how many rows can sit on each side of the connection, and that number decides two things: which table holds the foreign key, and, in [06-joins.md](06-joins.md), how many rows a query that reads both tables returns. How many rows of one table can be related to one row of the other is called the **cardinality** of the relationship. There are three kinds, and the practice database has the first two:

| Kind | One row of A relates to… | One row of B relates to… | In the practice database |
|---|---|---|---|
| One-to-many (1:N) | any number of rows of B | at most one row of A | `authors` and `books`: Orwell has two books, and each book has one `author_id` |
| Many-to-many (N:M) | any number of rows of B | any number of rows of A | `orders` and `books`: order 1 holds two books, and _1984_ appears in orders 1, 4 and 9 |
| One-to-one (1:1) | at most one row of B | at most one row of A | none; a biography kept apart from `authors`, one per author, would be one |

The second and third columns are the two directions of the same relationship, and the kind is named by putting them together: "one" on one side and "many" on the other is one-to-many. The section after this one shows what each kind looks like as table definitions.

### Two questions tell the kinds apart

To find the kind of a relationship between two tables A and B, ask the same question in both directions:

1. Can one row of A be related to several rows of B?
2. Can one row of B be related to several rows of A?

For `authors` and `books`: can one author have several books? Yes, George Orwell has _1984_ and _Animal Farm_. Can one book have several authors? In this bookstore, no: a book has one `author_id`. For `orders` and `books`: can one order contain several books? Yes, order 1 contains _1984_ and _Pride and Prejudice_. Can one book appear in several orders? Yes, _1984_ appears in orders 1, 4 and 9.

| Answer to question 1 | Answer to question 2 | Kind |
|---|---|---|
| yes | no | one-to-many: A is the "one" side, B the "many" side |
| no | yes | one-to-many: B is the "one" side, A the "many" side |
| yes | yes | many-to-many |
| no | no | one-to-one |

Read each row as the two answers in order and the kind they give. A single "yes" always means one-to-many, and the "many" side is the table that the "yes" question counted: "can one author have several **books**?" was the yes, so `books` is the "many" side of `authors` and `books`. Two yeses make `orders` and `books` many-to-many.

> **The answer comes from the business rule, not from the rows you see.** No book in the seed data has two authors, but that only describes the rows stored today. The question is whether the business allows it. This bookstore records one author per book, and the single `author_id` column of `books` is that decision written down. A shop that sells co-written books would answer "yes" to the second question, and `authors` and `books` would become many-to-many, stored in the way the section [A junction table holds one row per pair](#a-junction-table-holds-one-row-per-pair) shows.

## Placing the foreign key and building a junction table

Docs: https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK → read: "5.5.5. Foreign Keys" — the `products` / `orders` / `order_items` example of a many-to-many relationship

The previous section named the three kinds of relationship and the two questions that tell them apart. This section says where each kind puts its foreign key, explains why, and writes the table definitions that follow.

### Why the foreign key goes on the many side

A column holds one value per row. That single fact decides where a foreign key can go.

Take authors and books. One author has many books, and each book has one author. Try both placements:

```
MAL: the key on the "one" side — authors would need one column per book

authors
┌────┬───────────────┬─────────┬─────────┬─────────┐
│ id │ name          │ book_id │ book_id │   ...   │   how many columns? one per book,
├────┼───────────────┼─────────┼─────────┼─────────┤   and no author has the same number
│  1 │ George Orwell │       1 │       2 │         │
└────┴───────────────┴─────────┴─────────┴─────────┘

BIEN: the key on the "many" side — each book holds the one author it has

books
┌────┬─────────────┬───────────┐
│ id │ title       │ author_id │   one value per row is all a book needs
├────┼─────────────┼───────────┤
│  1 │ 1984        │         1 │
│  2 │ Animal Farm │         1 │
└────┴─────────────┴───────────┘
```

A book has exactly one author, so one column in `books` holds it. An author has any number of books, and no fixed set of columns in `authors` could hold them. So the foreign key goes in the table whose rows each point at **one** row of the other: the child, the "many" side. The parent never lists its children. They are found by looking for the rows that point at it, which is what a join does in [06-joins.md](06-joins.md).

`wishlist_items` follows the same rule twice: each entry points at one customer and at one book.

> **Preview — Spring Boot:** The next paragraph names JPA annotations from project 07. You study them in the Spring Boot notes. Read it for where the foreign keys end up.

Project 07 has the same shape. Each time entry belongs to one user and to one project, and a user or a project has many time entries. So `TimeEntry.java` declares `@ManyToOne` with `@JoinColumn(name = "user_id", nullable = false)` and the same for `project_id`. Hibernate turns those into two `NOT NULL` foreign key columns on the `time_entries` table, the many side of both relationships.

### A junction table holds one row per pair

Customers and books are many-to-many through the wishlist: a customer lists many books, and a book is listed by many customers. Neither table can hold the foreign key, because neither side points at only one row of the other. The problem of the `authors` table drawn above, one column per related row, appears on **both** sides.

The answer is a third table whose grain is one pair. Each of its rows points at one customer and at one book, so each of its foreign keys is on a "many" side again:

```
customers (1) ──── (N) wishlist_items (N) ──── (1) books
                       customer_id ──► customers.id
                       book_id     ──► books.id
```

That third table is a **junction table**, and `wishlist_items` is one. A many-to-many relationship is always stored as two one-to-many relationships that meet in a junction table.

A junction table needs three things:

1. **Two foreign keys**, one to each side, usually both `NOT NULL`, since a pair with a missing half is not a pair.
2. **A uniqueness rule on the pair**, so that each pair appears once. Without it, the same customer can list the same book twice, and every count of "how many customers want this book" counts that customer twice. Write it either as a composite `UNIQUE` next to a surrogate `id`, as `wishlist_items` does, or as a composite primary key with no `id`, as the section [Candidate keys and the primary key](#candidate-keys-and-the-primary-key) showed.
3. **Columns about the pair, when there are any.** `priority` and `max_price` describe neither the customer nor the book. They describe this customer's interest in this book, so they belong to the row of the pair. `quantity` and `unit_price` in `order_items` are the same kind of column.

> **Composite primary key or surrogate `id`?** Both enforce one row per pair. The surrogate `id` gives the row a single value to point at, which is simpler for anything that refers to it: a URL such as `/wishlist/42`, another table's foreign key, an ORM entity. The composite key saves a column and an index. A table nothing else refers to can use either. Whichever you choose, the pair must still be unique.

### One-to-one is a foreign key that is also unique

In a one-to-one relationship, each row of B points at one row of A, and no two rows of B point at the same one. The first half is an ordinary foreign key. The second half is what makes it one-to-one, and it is a `UNIQUE` on the foreign key column. A short biography kept apart from `authors` would look like this:

```sql
CREATE TABLE author_bios (
  author_id INT PRIMARY KEY REFERENCES authors(id),
  bio       TEXT NOT NULL
);
```

This is an example, not something to run. `author_id` is a foreign key, so each biography belongs to an existing author. It is also the primary key, so it is unique and not null, and an author can have at most one biography. Without the uniqueness, the same definition would be a one-to-many relationship: an author with several biographies.

One-to-one is the rarest of the three kinds. Two tables whose rows pair off exactly could usually be one table, so a team splits them only for a reason. The usual reasons are a part of the data that most rows do not have, which then needs no column full of `NULL`s in the main table, or a part that is large or rarely read: a `users` table kept lean, with the long profile text in a `user_profiles` table beside it.

## ON DELETE behaviour

Docs: https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK → read: "5.5.5. Foreign Keys" — from "We know that the foreign keys disallow creation of orders that do not relate to any products" to the end of the section

The section [What `REFERENCES` checks](#what-references-checks) ended on the second half of referential integrity: deleting a parent row that still has children would leave those children pointing at nothing. The database cannot let that happen silently, so the foreign key decides what happens to the children, and you choose that decision with the `ON DELETE` option, written after `REFERENCES`. There are four options you will meet:

| Option | What happens to the delete of a parent that still has children |
|--------|-------------|
| `NO ACTION` (the default, used when you write no option) | the delete is rejected |
| `RESTRICT` | the delete is rejected, like `NO ACTION`; the two differ only in when the check runs |
| `CASCADE` | the delete succeeds, and the children are deleted with it |
| `SET NULL` | the delete succeeds, and the children stay with `NULL` in their foreign key |

```sql
-- Deleting an order also deletes all its items
order_id INT REFERENCES orders(id) ON DELETE CASCADE

-- Deleting an author sets books.author_id to NULL (book stays, author link is removed)
author_id INT REFERENCES authors(id) ON DELETE SET NULL
```

The two lines above are column definitions, the way they would be written inside a `CREATE TABLE`. The seed script declares neither of them: every foreign key it declares has no option, so all of them are `NO ACTION`.

### What each action does to the child rows

The table above gives the four actions. This subsection runs them on the practice database, so you see what happens to the child rows in each case. The set has a fifth member, `SET DEFAULT`, which writes the column's default value into the children instead of `NULL`. Teams seldom use it, because that default must itself be the key of an existing parent row.

**No action written: the delete is refused.** `books.author_id` is one of the seed's `NO ACTION` foreign keys, and George Orwell has two books:

```sql
DELETE FROM authors WHERE id = 1;
```

```
ERROR:  update or delete on table "authors" violates foreign key constraint "books_author_id_fkey" on table "books"
DETAIL:  Key (id)=(1) is still referenced from table "books".
```

The first line names the parent table, the rule and the child table. The `DETAIL` line names the parent key that still has children. The SQL state is `23503`, the same as for an insert with a missing parent: both are the same rule, seen from its two sides. Nothing was deleted.

The same happens with the foreign key you declared without an action. `wishlist_items.book_id` is `NO ACTION`, and three entries point at _Emma_, so `DELETE FROM books WHERE id = 4;` is refused, naming `wishlist_items_book_id_fkey`. In the seed data alone, _Emma_ has no orders and no reviews, and the same delete would have succeeded. Your new table is now protecting book 4.

**`CASCADE`: the children are deleted with the parent.** `wishlist_items.customer_id` says `ON DELETE CASCADE`. Customer 8, Diego Torres, has no orders and no reviews. Give him two wishlist entries, then delete him with the statement from the section [Three one-row statements for testing a table](#three-one-row-statements-for-testing-a-table):

```sql
INSERT INTO wishlist_items (customer_id, book_id) VALUES (8, 3);
INSERT INTO wishlist_items (customer_id, book_id) VALUES (8, 10);

DELETE FROM customers WHERE id = 8;
```

The `DELETE` succeeds, and the Messages tab says `DELETE 1`: one customer. His two wishlist entries are gone too, though the statement never mentioned `wishlist_items`. In order, PostgreSQL:

1. deletes the row of customer 8 from `customers`;
2. finds the foreign keys that reference `customers`: `orders`, `reviews` and `wishlist_items`;
3. finds in each one the rows that point at `id` 8: none in `orders` and `reviews`, two in `wishlist_items`;
4. applies each foreign key's action to those rows, and `CASCADE` deletes them.

Had Diego had an order, step 4 would have reached `orders.customer_id`, which is `NO ACTION`, and the whole statement would have been refused, wishlist included.

**`SET NULL`: the children stay and lose their parent.** The child row survives with `NULL` in the foreign key, which only works when that column is nullable. `SET NULL` on a `NOT NULL` column turns every such delete into a not-null error. The section [Adding and removing a constraint](#adding-and-removing-a-constraint) switches `books.author_id` to another action, which is how you would try this one.

How to choose comes down to one question about the child: does it still mean something without its parent?

| The child without its parent… | Action | Example |
|---|---|---|
| means nothing | `CASCADE` | a wishlist entry of a deleted customer |
| still means something, and the link is optional | `SET NULL` | a book whose author record is removed |
| must not exist: the parent may only go once its children are dealt with | `NO ACTION` or `RESTRICT` | an order of a customer: the sale happened, and deleting the customer must not erase it |

> **Why is `CASCADE` not the safe default?** A cascade follows foreign keys that themselves cascade, so one `DELETE` can remove rows from several tables, none of them named in the statement. A cascade from `customers` to `orders` and from `orders` to `order_items` would erase a customer's whole sales history with one line. Use it only where losing the children is exactly what the business wants.

### `NO ACTION` against `RESTRICT` — when the check runs

The table at the start of this section says `NO ACTION` and `RESTRICT` both reject the delete and differ only in when the check runs. This subsection is about that difference. It only shows when the check is made to wait, and a check can only wait inside a transaction.

A **transaction** is a group of statements that succeed or fail together: either all their changes are kept, at `COMMIT`, or none are. [09-transactions.md](09-transactions.md) teaches it. A foreign key can be declared **deferrable**, which allows its check to wait until the `COMMIT` instead of running at the end of each statement:

```sql
author_id INT REFERENCES authors(id) DEFERRABLE INITIALLY DEFERRED
```

With that declaration, this sequence works. It is an example to read, not to run: the seed declares `books.author_id` without `DEFERRABLE`, so on the practice database the `DELETE` fails at once with the `NO ACTION` error you saw above.

```sql
BEGIN;
DELETE FROM authors WHERE id = 7;                        -- children still point at 7: not checked yet
UPDATE books SET author_id = NULL WHERE author_id = 7;   -- the children are fixed
COMMIT;                                                  -- checked now: nothing points at 7, so it passes
```

The delete leaves _My Brilliant Friend_ pointing at a deleted author for one statement. The check waits for the `COMMIT`, and by then the `UPDATE` has fixed the book.

That is the difference:

- **`NO ACTION`** checks the rule at the end of the statement, or at the `COMMIT` when the foreign key is deferred. Other statements can fix the children in between.
- **`RESTRICT`** checks immediately, during the `DELETE` itself, and cannot be deferred. Even with `DEFERRABLE` written on the foreign key, the same `DELETE` fails at once, before the `UPDATE` can run.

Without `DEFERRABLE`, which is every foreign key in this route so far, both refuse the same deletes. The message differs slightly: `RESTRICT` says `violates RESTRICT setting of foreign key constraint`. Choose `RESTRICT` when you want to say "never, not even temporarily"; leave the default `NO ACTION` otherwise.

### `ON UPDATE` fires only when the referenced key changes

Deleting a parent is one way to leave its children pointing at nothing. Changing the parent's **key** is the other. `ON UPDATE` takes the same actions as `ON DELETE`, and it applies when the value of the referenced key column changes. Its default is also `NO ACTION`.

You can see it with the seed data. `authors.id` is a `SERIAL` column, which chapter 01 showed is an ordinary `integer` with a default, so an `UPDATE` can write any value into it. An identity column declared `GENERATED ALWAYS`, such as `wishlist_items.id`, refuses the same kind of statement with `column "id" can only be updated to DEFAULT`. Change the `id` of George Orwell:

```sql
UPDATE authors SET id = 100 WHERE id = 1;
```

```
ERROR:  update or delete on table "authors" violates foreign key constraint "books_author_id_fkey" on table "books"
DETAIL:  Key (id)=(1) is still referenced from table "books".
```

The message is the one from the delete, word for word. Changing George Orwell's `id` would leave his two books pointing at `1`, an author that no longer exists, so `ON UPDATE NO ACTION` refuses it. The same statement on author 8, Lucia Berlin, who has no books, succeeds.

With a surrogate key this almost never happens, because nothing in the business gives anyone a reason to change an `id`. `ON UPDATE` exists for natural keys, which do change. Picture an inherited schema in which shelf labels point at a genre by its name, which is unique in `genres`:

```sql
CREATE TABLE shelf_labels (
  id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  shelf      INT NOT NULL,
  genre_name VARCHAR(50) NOT NULL REFERENCES genres(name) ON UPDATE CASCADE
);
INSERT INTO shelf_labels (shelf, genre_name) VALUES (1, 'Mystery'), (2, 'Mystery'), (3, 'Poetry');

UPDATE genres SET name = 'Crime' WHERE name = 'Mystery';

SELECT shelf, genre_name FROM shelf_labels;
DROP TABLE shelf_labels;
```

The `INSERT` gives three rows at once, one parenthesised list of values per row, a form [08-dml.md](08-dml.md) teaches. After the `UPDATE` on `genres`, the `SELECT` shows shelves 1 and 2 with `Crime`. The `UPDATE` named only `genres`, and `ON UPDATE CASCADE` copied the new name into every child row that held the old one. The last line removes the example table again. The genre itself stays renamed `Crime` until you run the seed script again at the end of the chapter.

> **Why is an inherited `ON UPDATE CASCADE` easy to misread?** Because on a key that never changes it never runs, so it looks harmless and is forgotten. The day someone corrects a natural key, one `UPDATE` on the parent rewrites rows in every child table, and nobody reading that `UPDATE` sees them. When you find `ON UPDATE CASCADE` in a schema, look at what the referenced column is. On a surrogate `id` it is noise. On a natural key it is a rule that rewrites data elsewhere.

## Normalization — each fact stored once

Docs: https://en.wikipedia.org/wiki/Database_normalization → read: "Objectives" — the insertion, update and deletion anomalies, each with an example

Every section so far has split data across tables and linked them with keys. A single table with everything in it would need no foreign keys and no joins, so the split needs a reason. The reason is what goes wrong when the same fact is stored more than once.

### Three anomalies of a table that stores copies

Here is the sales data of the practice database as one flat table, built from orders 1, 2 and 5 of the seed script:

```
sales (one row per book sold)
┌──────────┬─────────────┬─────────────────┬───────────────────────────────┬──────────┬────────────┐
│ order_id │ customer    │ customer_email  │ book_title                    │ quantity │ unit_price │
├──────────┼─────────────┼─────────────────┼───────────────────────────────┼──────────┼────────────┤
│        1 │ Ana García  │ ana@mail.com    │ 1984                          │        1 │       9.99 │
│        1 │ Ana García  │ ana@mail.com    │ Pride and Prejudice           │        2 │       8.99 │
│        2 │ Ana García  │ ana@mail.com    │ One Hundred Years of Solitude │        1 │      14.99 │
│        5 │ Javier Ruiz │ javier@mail.com │ My Brilliant Friend           │        2 │      12.99 │
└──────────┴─────────────┴─────────────────┴───────────────────────────────┴──────────┴────────────┘
```

Ana's email is stored three times, once per book she bought. Each problem below comes from that copying, and each is called an **anomaly**: a change to the data that the table's shape makes go wrong.

- **Update anomaly.** Ana changes her email. Every row that holds it must change. An `UPDATE` that misses one row leaves the table saying two different things about the same person, and no rule notices.
- **Insertion anomaly.** A new customer registers and has bought nothing yet. Every row of this table is a book sold, so there is nowhere to store the new customer without inventing a sale.
- **Deletion anomaly.** Javier's only order is cancelled and its row deleted. Javier's email goes with it, although the fact "Javier is a customer, at this address" had nothing to do with the order.

The practice database avoids all three by storing each fact in the table whose key it depends on:

| Fact | It depends on… | So it lives in |
|---|---|---|
| a customer's name and email | the customer: `customers.id` | `customers`, once per customer |
| an order's date and customer | the order: `orders.id` | `orders`, once per order |
| a book's title | the book: `books.id` | `books`, once per book |
| how many copies of a book an order contains | the order **and** the book together | `order_items`, once per book within an order |

Read each row as a question: which key would you need to know to look this fact up? That key's table is where the fact belongs. Ana's email now exists once, so changing it changes one row. A customer can exist with no orders. Deleting an order removes order lines, not customers. Splitting data this way is called **normalization**. It has formal rules, the normal forms, which go beyond what this junior route needs. The working rule above, one fact in the table of its key, is what you apply when you design or review a schema.

### `unit_price` is a fact about the sale, not a copy

`order_items` stores a `unit_price`, and `books` stores a `price`. In the seed data they are equal: line 1 of order 1 sold _1984_ at `9.99`, and _1984_ costs `9.99`. That looks like the copying the previous section warned against. It is not, because the two columns hold two different facts:

- `books.price` is what the book costs **today**. It depends on the book.
- `order_items.unit_price` is what was charged **in that sale**. It depends on the order line.

When the shop raises the price of _1984_ to `10.99`, the order of January 2025 was still paid at `9.99`. If the order read the price from `books`, raising the price would rewrite every past invoice. So the test is not "do two columns hold equal values?". It is "would changing one of them have to change the other?". For `price` and `unit_price` the answer is no, so neither is a copy.

## Reading a relational schema before you query it

Docs: https://www.postgresql.org/docs/current/ddl-constraints.html → read: "5.5. Constraints" — the introduction, as a list of what each kind of rule tells you about the data

Most queries you write at work start from tables someone else designed, and a wrong guess about them returns wrong rows without an error. So before writing a query against a schema, read it for five things, all of which this chapter has now taught:

1. **The grain** of each table: what one row stands for.
2. **The primary key**: what identifies one row.
3. **The foreign keys**: which tables each row points at.
4. **The nullability** of each column, foreign keys first: can the value, or the parent, be missing?
5. **The cardinality** of each relationship: one-to-many, many-to-many through a junction table, or one-to-one.

### The practice schema, read table by table

Apply the five readings to the `CREATE TABLE` statements of the seed script, plus your `wishlist_items`:

| Table | One row is… | Primary key | Foreign keys | Other unique keys |
|---|---|---|---|---|
| `authors` | one author | `id` | — | — |
| `publishers` | one publisher | `id` | — | — |
| `genres` | one genre | `id` | — | `name` |
| `books` | one book | `id` | `author_id`, `publisher_id`, `genre_id`, all nullable | `isbn`, nullable |
| `customers` | one customer | `id` | — | `email`, `NOT NULL` |
| `orders` | one order | `id` | `customer_id`, nullable | — |
| `order_items` | one book within one order | `id` | `order_id`, `book_id`, both nullable | — |
| `reviews` | one review of one book by one customer | `id` | `book_id`, `customer_id`, both nullable | — |
| `wishlist_items` | one book on one customer's list | `id` | `customer_id`, `book_id`, both `NOT NULL` | `(customer_id, book_id)` |

The second column is the grain. The fourth says, for each foreign key, whether a row can be without its parent. From the foreign keys you can draw every relationship:

```
authors    (1) ──── (N) books           books.author_id
publishers (1) ──── (N) books           books.publisher_id
genres     (1) ──── (N) books           books.genre_id
customers  (1) ──── (N) orders          orders.customer_id
orders     (N) ──── (M) books           through order_items
books      (N) ──── (M) customers       through reviews
books      (N) ──── (M) customers       through wishlist_items
```

Nullability changes what "one" means. `books.author_id` is nullable, so the relationship is "each book has **at most** one author", and `books.publisher_id` makes it "at most one publisher". The seed data uses that freedom: _My Brilliant Friend_ has no publisher. A query that lists every book with its publisher therefore has to decide what to do with that book. [06-joins.md](06-joins.md) teaches that decision, and it starts from exactly this reading.

> **Where to read a schema you did not write.** Here you have the script. In a real database you usually do not. pgAdmin shows each table's columns and constraints in the Object Explorer, and [16-working-with-an-existing-database.md](16-working-with-an-existing-database.md) teaches how to inspect a database you did not design.

### What the reading shows is missing

Reading a schema critically also shows the rules its designer left out. The practice schema has three such gaps, and each one allows a row that the business would never accept:

- **`order_items.order_id` is nullable.** An order line that belongs to no order describes nothing, so it should be `NOT NULL`. The same holds for `book_id`.
- **`order_items` has no uniqueness on `(order_id, book_id)`.** The grain is "one book within one order", but nothing stops the same book appearing on two lines of one order, with its quantity split between them. A composite `UNIQUE` would enforce the grain.
- **`reviews` has no uniqueness on `(book_id, customer_id)`.** If the shop allows one review per customer per book, that rule exists only in the application.

The seed data happens to respect all three, and that is the trap: a missing rule is invisible until a row breaks it. The next two sections show how to add these rules to tables that already hold rows.

## Changing a table with `ALTER TABLE`

Docs: https://www.postgresql.org/docs/current/ddl-alter.html → read: "5.7. Modifying Tables" — every subsection, 5.7.1 to 5.7.8

A table is declared once and changed for years. A new feature needs a column, a review shows a missing rule, a limit turns out too small. Dropping the table and declaring it again would lose its rows. `ALTER TABLE` changes the definition of a table that already exists, and keeps its rows. Each form below starts with `ALTER TABLE` and the table's name, then says what to change.

### Adding, changing and removing a column

**Add a column.** The shop wants to feature some books on its home page:

```sql
ALTER TABLE books ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
```

A new column has to hold something in every row that already exists, and this statement says what: the default. Every existing book now has `false`. The section [Defaults on a table that already holds rows](#defaults-on-a-table-that-already-holds-rows) explains why this case fills old rows and another one does not.

**Change a column's type.** This is the change [01-data-types.md](01-data-types.md) mentioned at the end of its section _`VARCHAR(n)` against `TEXT` — what is left to choose_: a length limit that turns out too small. `customers.city` is `VARCHAR(50)`, and raising it is one statement:

```sql
ALTER TABLE customers ALTER COLUMN city TYPE VARCHAR(100);
```

PostgreSQL converts every stored value to the new type. Raising a limit always succeeds. Lowering it fails as soon as one stored value does not fit:

```sql
ALTER TABLE customers ALTER COLUMN city TYPE VARCHAR(5);
```

```
ERROR:  value too long for type character varying(5)
```

`Barcelona` has nine letters. The statement is rejected as a whole, and the column keeps its old type.

**Rename a column, or remove one.**

```sql
ALTER TABLE books RENAME COLUMN is_featured TO featured;
ALTER TABLE books DROP COLUMN featured;
```

`RENAME COLUMN` keeps the values and changes the name, which breaks every query and every application that uses the old name. `DROP COLUMN` removes the column and every value in it, along with the rules of this table that involve it. If a foreign key in another table references the column, PostgreSQL refuses the drop.

### Adding and removing a constraint

**Add a rule.** The gaps found in the section [What the reading shows is missing](#what-the-reading-shows-is-missing) are fixed this way:

```sql
ALTER TABLE order_items ADD CONSTRAINT order_items_order_book_key UNIQUE (order_id, book_id);
```

`ADD CONSTRAINT` takes a name and then the same rule you would write as a table constraint inside `CREATE TABLE`. `NOT NULL` has its own form, because it belongs to one column:

```sql
ALTER TABLE order_items ALTER COLUMN order_id SET NOT NULL;
```

Both succeed on the seed data, because no stored row breaks them. A new rule is checked against every stored row the moment it is added, and the next section shows what happens when a row does break it.

**Remove a rule.** A rule is removed by its name, which is why the names of the section [Constraint names, and the errors that quote them](#constraint-names-and-the-errors-that-quote-them) matter here. `NOT NULL` again has its own form, which names the column:

```sql
ALTER TABLE order_items DROP CONSTRAINT order_items_order_book_key;
ALTER TABLE order_items ALTER COLUMN order_id DROP NOT NULL;
```

**Change a foreign key's action.** No statement changes the action of an existing foreign key. To change what a foreign key does on delete, you remove it and add it again with the new action. This switches `books.author_id` from `NO ACTION` to `SET NULL`:

```sql
ALTER TABLE books DROP CONSTRAINT books_author_id_fkey;
ALTER TABLE books ADD CONSTRAINT books_author_id_fkey
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL;

DELETE FROM authors WHERE id = 7;
SELECT id, title, author_id FROM books WHERE id = 12;
```

```
 id | title               | author_id
----+---------------------+-----------
 12 | My Brilliant Friend |    [null]
```

`FOREIGN KEY (author_id) REFERENCES authors(id)` is the table-constraint form of the column's `REFERENCES`. The `DELETE` of Elena Ferrante now succeeds, and her book stays with no author. Repeat the two `ALTER TABLE` statements with `ON DELETE RESTRICT` in place of `SET NULL`, and `DELETE FROM authors WHERE id = 1;` fails with the `RESTRICT` message the section [`NO ACTION` against `RESTRICT` — when the check runs](#no-action-against-restrict--when-the-check-runs) quoted.

### Defaults on a table that already holds rows

Two statements give a column a default, and they treat the rows already stored in opposite ways.

**`ALTER COLUMN ... SET DEFAULT` changes only future inserts.** The shop decides that a customer with no city is in Madrid:

```sql
ALTER TABLE customers ALTER COLUMN city SET DEFAULT 'Madrid';
SELECT id, name, city FROM customers WHERE city IS NULL;
```

```
 id | name        | city
----+-------------+--------
  3 | Marta López | [null]
  7 | Lucía Gómez | [null]
```

Marta and Lucía still have no city. `IS NULL` is how a query finds missing values, which [04-where.md](04-where.md) teaches. Nothing was **backfilled**, the word for filling in old rows after a schema change. A default acts when a row is inserted, and these rows were inserted long ago. If they should be in Madrid too, that is a separate `UPDATE`, and a separate decision: maybe they really have no city.

**`ADD COLUMN ... DEFAULT` fills every existing row.** That is what happened with `is_featured`. A new column did not exist when the old rows were inserted, so it has no value in them yet. PostgreSQL has to give them one, and it gives them the default, or `NULL` when the statement has no `DEFAULT`.

| Statement | Existing rows | Future inserts that leave the column out |
|---|---|---|
| `ADD COLUMN c ... DEFAULT x` | get `x` | get `x` |
| `ADD COLUMN c ...` with no default | get `NULL` | get `NULL` |
| `ALTER COLUMN c SET DEFAULT x` | keep their values, `NULL` included | get `x` |

The first column is the statement you run. The second says what it does to the rows already stored, and the third what it does to rows inserted later. The rows that already exist are affected only when the column itself is new.

### Migration tools run these same statements

In a project, nobody runs `ALTER TABLE` by hand in pgAdmin on each database. A team has a developer's database, a test database and the production one, and all three must change the same way, in the same order. A **migration tool** keeps that order. Flyway, which you used during your internship, is one: each change is a file holding SQL statements, numbered by version, and the tool runs on each database the files it has not run yet.

The tool belongs to the application side: it decides which change runs where, and when. What each file holds is still `ALTER TABLE`, `CREATE TABLE` and the statements of this chapter. The tool adds the version history. SQL is still what changes the schema, and every failure of the next section happens inside a migration exactly as it happens in pgAdmin.

> **Preview — Spring Boot:** This paragraph names Hibernate settings from project 07. You study them in the Spring Boot notes. Read it for which schema changes reach the database.

Project 07 uses no migration tool. Its `application.properties` sets `spring.jpa.hibernate.ddl-auto=update`, which lets Hibernate create the missing tables and add the missing columns each time the application starts. It does not change a column that already exists. Project 07's `PLANNING.md` records the consequence: a rule added to an existing column, such as a not-null, reaches the database only through an `ALTER TABLE` run by hand, after the old rows have been filled in. That order is the subject of the next section.

## Adding a constraint to a table that already holds rows

Docs: https://www.postgresql.org/docs/current/ddl-alter.html#DDL-ALTER-ADDING-A-CONSTRAINT → read: "5.7.3. Adding a Constraint" — the constraint is checked immediately, so the stored rows must already satisfy it

A constraint is a promise about every row of the table, not only about the rows inserted from now on. So when you add one, PostgreSQL checks every row already stored, at that moment, and refuses the rule if one row breaks it.

`books` has a book with no price, _The Angel's Game_. Make the price required:

```sql
ALTER TABLE books ALTER COLUMN price SET NOT NULL;
```

```
ERROR:  column "price" of relation "books" contains null values
```

The rule was not added, and the table is unchanged. The same thing happens when you add a new column as `NOT NULL` with no default, because every existing row gets `NULL` in it:

```sql
ALTER TABLE books ADD COLUMN is_featured BOOLEAN NOT NULL;
```

```
ERROR:  column "is_featured" of relation "books" contains null values
```

The other rules behave the same way. A `UNIQUE` is refused when two stored rows share a value. That is why the section [`UNIQUE` rejects repeated values, but not repeated `NULL`s](#unique-rejects-repeated-values-but-not-repeated-nulls) said `NULLS NOT DISTINCT` cannot be added to `books`:

```sql
ALTER TABLE books ADD CONSTRAINT books_isbn_nnd_key UNIQUE NULLS NOT DISTINCT (isbn);
```

```
ERROR:  could not create unique index "books_isbn_nnd_key"
DETAIL:  Key (isbn)=(null) is duplicated.
```

The first line says the index that enforces the rule could not be built. The `DETAIL` line says why: under this rule two `NULL`s are equal, and two books hold one.

A `CHECK` can still pass on these same rows, because of the three-valued logic of the section [`CHECK` rejects false and lets unknown through](#check-rejects-false-and-lets-unknown-through). `ALTER TABLE books ADD CONSTRAINT books_price_positive CHECK (price > 0);` **succeeds**, although _The Angel's Game_ has no price, because `NULL > 0` is unknown and a check only rejects false.

### Correct the rows first, then add the constraint

The fix is two statements, and their order is fixed. First you make every stored row satisfy the rule. Then you add the rule:

```sql
-- 1. Correct the rows that break the rule
UPDATE books SET price = 15.99 WHERE id = 11;

-- 2. Add the rule: every row now satisfies it
ALTER TABLE books ALTER COLUMN price SET NOT NULL;
```

Both succeed. In the other order, the `ALTER TABLE` runs while the book still has no price, fails with the error above, and the rule is never added. What the first statement writes is a business decision, not a technicality: here, the price the shop actually charges for that book. Inventing a value only to make the constraint pass, such as `0`, stores a falsehood that the new rule will then protect.

> **Why does PostgreSQL not just apply the rule to new rows and leave the old ones alone?** Because then the rule would no longer say anything certain. A query that relies on "`price` is never `NULL`" would still meet `NULL`s, from the rows that were already there. A constraint is worth something because it holds for every row, so PostgreSQL refuses to declare one that is already false.

## `DROP` removes the table, `DELETE` and `TRUNCATE` remove rows

Docs: https://www.postgresql.org/docs/current/ddl-depend.html → read: "5.15. Dependency Tracking" — the `DROP TABLE products` example, with `RESTRICT` and `CASCADE`

Three statements make data disappear, and they remove different things. `DROP` removes a database object: the table itself, with its definition, its rows, its constraints and its indexes. After a `DROP TABLE`, the name no longer exists and a `SELECT` on it fails with `relation ... does not exist`. `DELETE` and `TRUNCATE` remove rows and keep the table: its columns, its rules and its name stay, empty or emptier, ready for new rows.

| Statement | Removes | The table afterwards |
|---|---|---|
| `DROP TABLE wishlist_items;` | the table: definition, rows, constraints, indexes | does not exist |
| `TRUNCATE wishlist_items;` | every row | exists, empty |
| `DELETE FROM wishlist_items WHERE id = 3;` | the rows the `WHERE` reaches | exists, with its other rows |

The second column is what is gone, and the third is what you can still query. The difference between the last two rows is a question about rows: `DELETE` removes the rows a `WHERE` selects and `TRUNCATE` removes all of them at once, and they differ in speed, in locking and in what they do to an identity sequence. That is the subject of [08-dml.md](08-dml.md), with the rest of the statements that change rows. This chapter is about the table, and the table survives both.

### What `DROP TABLE` takes with it

A table that other tables reference cannot simply disappear, for the same reason a parent row cannot. `authors` is referenced by `books`:

```sql
DROP TABLE authors;
```

```
ERROR:  cannot drop table authors because other objects depend on it
DETAIL:  constraint books_author_id_fkey on table books depends on table authors
HINT:  Use DROP ... CASCADE to drop the dependent objects too.
```

The `DETAIL` line names the object in the way, and it is a constraint, not a table. That matters for the `HINT`. `DROP TABLE authors CASCADE` drops `authors` and the **foreign key** `books_author_id_fkey`. It does not drop `books`:

```
NOTICE:  drop cascades to constraint books_author_id_fkey on table books
```

`books` keeps every row and every `author_id` value, and nothing checks those values any more. `TRUNCATE` is protected the same way: `TRUNCATE authors;` fails with `cannot truncate a table referenced in a foreign key constraint`, because emptying the parent would leave every child pointing at nothing.

This is also what the seed script does in its first part. `DROP TABLE IF EXISTS books CASCADE;` drops `books`, and the `CASCADE` drops the foreign keys of the other tables that point at it. `IF EXISTS` turns "no such table" into the `NOTICE` you saw in chapter 00 instead of an error. And it is why this chapter asked you to drop `wishlist_items` by hand: the seed's `CASCADE` would remove only the two foreign keys of `wishlist_items`, and leave the table behind with rows pointing at customers and books that the seed has just rebuilt with no guarantee they match.

Finish the chapter's experiments now, in this order:

```sql
DROP TABLE wishlist_items;
```

Then run the whole seed script again. The practice database is back to its eight tables and their 72 original rows, with the original rules.

---

## Naming conventions

Docs: https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS → read: "4.1.1. Identifiers and Key Words" — why unquoted names are folded to lowercase, which is the reason for lowercase with underscores

Every table of the practice database follows the same naming habits, and so do most schemas you will meet at work. They matter for two reasons. A reader who knows them can tell what a column holds before reading its definition: `author_id` points at `authors`, `is_featured` is a yes/no flag. And PostgreSQL folds a name written without double quotes to lowercase, so `firstName` in a statement becomes `firstname`. Lowercase words separated by underscores are the one style that survives that folding unchanged. [03-select.md](03-select.md) teaches the quoted names that keep their capitals.

| Thing | Convention | Example |
| --- | --- | --- |
| Tables | Plural, lowercase, underscores | `authors`, `order_items` |
| Primary key | `id`, when it is a surrogate key | `id` |
| Foreign key | the referenced table in the singular, then `_id` | `author_id`, `customer_id` |
| Columns | Lowercase, underscores | `first_name`, `unit_price` |
| Timestamp columns | End in `_at` | `added_at`, `created_at` |
| Date columns | End in `_date` | `joined_date`, `order_date` |
| Boolean columns | Start with `is_` or `has_` | `is_featured`, `has_discount` |
| Constraints | the table, the columns, then the suffix of the kind of rule | `wishlist_items_customer_book_key`, `books_isbn_key` |

The second column is the habit, and the third shows it in this chapter's tables. Two rows have a scope. The primary-key row is about surrogate keys: a junction table with a composite primary key, like `wishlist_items_example` in the section [Candidate keys and the primary key](#candidate-keys-and-the-primary-key), has no `id` at all. The constraint row follows the names PostgreSQL itself generates, which the section [Constraint names, and the errors that quote them](#constraint-names-and-the-errors-that-quote-them) listed, so a name you write yourself reads like the generated ones.

## What this chapter unlocks

You can now write a `CREATE TABLE` and read one: each column's type, its default, whether it is required, and the rules on its values. You can say what a default does with an omitted column and with an explicit `NULL`, why a `CHECK` lets `NULL` through, and why a `UNIQUE` column accepts several `NULL`s. You can name a table's grain, choose its primary key, keep its natural keys unique beside a surrogate one, place a foreign key on the many side, model a many-to-many relationship with a junction table, and choose what happens to the children when a parent is deleted or its key changes. You can explain why data is split across tables, and read a schema for its grain, keys, nullability and cardinality. And you can evolve a table with `ALTER TABLE`, in the right order when rows already exist, and tell `DROP` from removing rows.

All of that describes data that is already stored. None of it asks the database a question yet, and chapter 00 used `SELECT` only in its shortest forms. With the schema understandable as a set of related, typed tables, [03-select.md](03-select.md) starts asking: which columns a result has, which expressions compute new ones, and how a result's columns are named.
