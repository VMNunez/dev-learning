# SQL Junior Notes Plan

Plan status: current
Coverage: notes/sql/coverage/junior.md
Coverage SHA-256: 39aa0cfca364e978c00a6944700fac5d0c59e3db819e84b600993c04aaf2ebeb
Generated: 2026-08-28

## 00 — SQL and relational databases

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/sql/junior/en/00-sql-and-relational-databases.md
Spanish: notes/sql/junior/es/00-sql-y-bases-de-datos-relacionales.md

Depends on: none

Pending additions: none

Narrative role: Orient Victor before syntax with the problem SQL solves, a declarative query-engine mental model, the target-stack context, and a map of the complete route.

Learning outcome: Victor can distinguish SQL, PostgreSQL, a database, a schema, and relational data; explain that he declares the result while PostgreSQL plans the work; and describe why chapters 01 through 16 follow this order.

Prerequisites: none

Must answer:

- What persistence and shared-data problems does a relational database solve beyond JavaScript or TypeScript objects in one process?
- What is the difference between SQL, PostgreSQL, a database, a schema, a table, a row, and a column?
- What does declarative mean, and how does PostgreSQL turn a requested result into an execution plan?
- How does SQL fit between Angular, Spring Boot, JDBC or an ORM, and PostgreSQL?
- What is this introduction about to cover, section by section, and why do those sections come in that order?
- How do I actually run a statement and read its result before chapter 01 assumes I can — which client, against which database, how do I create and seed the practice database the later chapters query, and what does a rejected statement look like?
- What does each chapter from 01 through 16 contribute, and why is that route ordered from structure to querying, mutation, reliability, analysis, and review?

Coverage concepts:

- none — this required introduction provides orientation rather than importing coverage from another level

Rationale: The introduction is required pedagogical scaffolding and deliberately owns no coverage bullet.

Handoff: With the system and the full route visible, chapter 01 defines the value types on which every later table, predicate, and report depends.

## 01 — Data types

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/sql/junior/en/01-data-types.md
Spanish: notes/sql/junior/es/01-tipos-de-datos.md

Depends on: 00

Pending additions: none

Narrative role: Establish how PostgreSQL represents a single value — what each type guarantees, and how exactness and scale survive an expression built out of those values.

Learning outcome: Victor can choose a justified PostgreSQL type for any junior column and predict the exactness, scale, and time semantics of both a stored value and a computed one.

Prerequisites: entries 00

Must answer:

- Why do data types affect precision, comparison, storage meaning, and valid operations?
- If VARCHAR(n) and TEXT store and perform identically in PostgreSQL, what is left to choose between them?
- Why are NUMERIC and floating point different for money, and why can integer division discard a fraction?
- Why does a fixed-length CHAR column report a length that does not match what was stored?
- Why does two-argument ROUND reject a double precision value, and where does the cast belong?
- How does the scale of an expression's result come out of its operands, so a rounding rule has to wrap the whole expression rather than one part of it?
- Why is that scale rule shown here on a plain arithmetic expression, and where does the same rule reappear once the expression is a report total?
- What instant does TIMESTAMPTZ represent compared with DATE and TIMESTAMP?
- How do identity columns differ from SERIAL, and what does BOOLEAN guarantee?
- When is a value better stored as JSONB than as its own typed columns, and what does that give up?

Coverage concepts:

- [ ] `VARCHAR(n)` vs `TEXT` — both have identical storage performance in PostgreSQL; `VARCHAR(n)` documents an intended maximum length; `TEXT` is for content with no meaningful upper limit; the practical difference is intent, not performance
- [ ] `CHAR(n)` blank padding — a fixed-length column stores every shorter value padded with trailing spaces, then ignores those spaces when comparing and when reporting `length()`; expect it in inherited Oracle and legacy schemas rather than choosing it for new columns
- [ ] Integer identity columns vs `SERIAL` — `GENERATED ... AS IDENTITY` is the SQL-standard PostgreSQL choice for generated integer keys; `SERIAL` is legacy shorthand that creates a separate sequence and default, while `BIGINT`/`BIGSERIAL` widen the range
- [ ] `NUMERIC(p,s)` vs `FLOAT` — choose exact fixed-precision decimals for money and approximated floating-point values for measurements that tolerate representation error
- [ ] Integer division and explicit casts — integer divided by integer truncates the fractional part in PostgreSQL; cast an operand to `NUMERIC` when the result must retain decimals
- [ ] `ROUND(value, n)` — rounds to a given number of decimal places, but only for `NUMERIC`; PostgreSQL has no two-argument `ROUND` for `double precision`, so a computed average usually needs an explicit cast before a report can round it
- [ ] Scale of an expression's result — `NUMERIC` scale propagates outwards through an expression, and a literal fallback carries its own, so `COALESCE(SUM(x), 0)` answers with the summed column's scale when rows exist and with scale 0 when none do; a rounding rule must therefore wrap the whole expression rather than one of its operands
- [ ] `DATE` vs `TIMESTAMP` / `TIMESTAMPTZ` — use `DATE` for a calendar value with no time of day, `TIMESTAMP` for a local wall-clock value, and `TIMESTAMPTZ` for an instant shared across time zones
- [ ] `TIMESTAMP` vs `TIMESTAMPTZ` — `TIMESTAMP` stores the date and time exactly as entered, ignoring time zones; `TIMESTAMPTZ` converts to UTC on write and back to the session time zone on read; always use `TIMESTAMPTZ` for `created_at` in a web application
- [ ] `BOOLEAN` — stores true, false, or null; use SQL literals `TRUE` and `FALSE` because PostgreSQL does
  not generally treat an unquoted integer `1` as a boolean
- [ ] `JSONB` recognition — stores validated JSON in a binary representation that supports PostgreSQL operators and indexes; keep relational columns for stable fields that need ordinary constraints and joins

Rationale: One mental model: what a value actually is in PostgreSQL — every bullet is either a guarantee one type makes, or the way that guarantee survives being combined into an expression.

Handoff: With the vocabulary of values settled, chapter 02 declares the tables that hold them and the keys, constraints, and cardinality rules that keep them consistent.

## 02 — Defining a schema — tables, relationships, keys, and constraints

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/sql/junior/en/02-relationships.md
Spanish: notes/sql/junior/es/02-relaciones.md

Depends on: 00, 01

Pending additions: none

Narrative role: Declare and evolve the tables that hold chapter 01's values, then turn them into a coherent relational model whose keys and constraints protect identity, references, and business invariants.

Learning outcome: Victor can write and evolve a CREATE TABLE, read and design a small normalized schema, place foreign keys and junction tables correctly, and justify every key, default, nullability rule, constraint, and referential action — including what changes when the constraint is added to a table that already holds rows.

Prerequisites: entries 00, 01

Must answer:

- What does CREATE TABLE settle in one place that the application can then no longer decide for itself, and what does ALTER TABLE change afterwards?
- When does DEFAULT apply, why does an explicitly inserted NULL not get replaced by it, and why are existing rows not backfilled?
- What exactly does DROP remove that DELETE and TRUNCATE do not — and why is the row-level half of that contrast left to chapter 08?
- How do table grain, primary keys, candidate keys, surrogate keys, and foreign keys describe identity and relationships?
- What can a UNIQUE constraint do that a primary key cannot, given a table has at most one primary key?
- Why does the foreign key belong on the many side, and how does a junction table model many-to-many data?
- How do UNIQUE, composite uniqueness, NOT NULL, CHECK, and CHECK with NULL differ?
- How do NO ACTION, RESTRICT, CASCADE, and SET NULL change parent deletion, and when does the ON UPDATE form of the same action ever fire?
- Why can adding a constraint to a populated table fail, and in what order do the two statements have to run?
- Which insert, update, and delete anomalies does normalization prevent?

Coverage concepts:

- [ ] `CREATE TABLE` — defines columns, data types, defaults, and constraints together; read the full definition before loading data because the database, not the application, enforces it
- [ ] `ALTER TABLE` — evolves an existing table by adding, changing, or dropping columns and constraints; versioned migration tooling belongs to the application stack, while SQL owns the resulting schema change
- [ ] `DEFAULT` — supplies a value only when an insert omits the column; it does not replace an explicitly inserted `NULL`, and it does not backfill old rows unless the schema change does so
- [ ] `DROP` vs deleting rows — `DROP` removes the database object itself, whereas `DELETE` and `TRUNCATE` keep the table and remove data
- [ ] Reading a relational schema — identify each table's grain, primary key, foreign keys, nullability, and relationship cardinality before constructing a query
- [ ] Primary key — one optional table constraint, possibly composite, that uniquely identifies rows;
  application tables normally define one even though SQL does not require every table to have it
- [ ] Primary key vs `UNIQUE` constraint — both reject duplicates and both can be composite, but a table has at most one primary key, its columns are implicitly `NOT NULL`, and it is what foreign keys reference by default; a `UNIQUE` column can stay nullable and a table may carry several
- [ ] Foreign key — one or more columns referencing a primary or other unique candidate key;
  PostgreSQL rejects values with no referenced row, enforcing referential integrity
- [ ] `ON DELETE` behavior — PostgreSQL defaults to `NO ACTION`; `RESTRICT` also rejects referenced-row deletion but cannot be deferred, `CASCADE` deletes dependent rows, and `SET NULL` clears a nullable foreign key
- [ ] `ON UPDATE` behavior — the same referential actions apply when the referenced key value itself changes; it is nearly invisible with surrogate keys that never change, which is exactly why an inherited `ON UPDATE CASCADE` on a natural key is easy to misread
- [ ] `NOT NULL` constraint — reject missing values for fields whose domain contract requires a value
- [ ] `UNIQUE` constraint — rejects duplicate non-`NULL` keys and creates a supporting unique B-tree index; PostgreSQL permits multiple `NULL` values by default unless `NULLS NOT DISTINCT` is requested
- [ ] Composite uniqueness — a `UNIQUE` constraint across several columns enforces a business rule on the combination, such as one membership per `(user_id, project_id)`
- [ ] `CHECK` constraint and `NULL` — a check rejects `FALSE` but accepts `TRUE` or `UNKNOWN`, so `CHECK (hours > 0)` still needs `NOT NULL` when hours are required
- [ ] Adding a constraint to a populated table — a constraint is validated against the rows already stored, so `SET NOT NULL` on a column holding empty values fails until those rows are corrected, making the change two statements in a fixed order rather than one
- [ ] One-to-many relationships — place the foreign key on the many side so each child references one parent while a parent can own several children
- [ ] Many-to-many relationships — use a junction table with two foreign keys and usually a composite uniqueness rule so each pair appears only once
- [ ] Natural vs surrogate keys — a surrogate key gives the row a stable technical identity, while a natural business key still needs a `UNIQUE` constraint when the domain says it cannot repeat
- [ ] Normalization and data anomalies — store each fact in the relation determined by its key so inserts, updates, and deletes do not require inconsistent copies; formal normal-form analysis belongs to middle

Rationale: One mental model: the schema as the set of rules the database itself declares and enforces — the statements that declare them, the keys and constraints they consist of, and what enforcing them costs once data already exists.

Handoff: With the schema understandable as a set of related typed tables, chapter 03 can request rows and expressions from it.

## 03 — SELECT, expressions, and text

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/sql/junior/en/03-select.md
Spanish: notes/sql/junior/es/03-select.md

Depends on: 00, 01, 02

Pending additions: none

Narrative role: Introduce the declarative SELECT result — source rows, aliases, expressions, quoting, DISTINCT, CASE, and the text transformations that shape output values. Relocation the audit owes: the existing file's `## DISTINCT vs DISTINCT ON` section teaches `DISTINCT ON`, which this plan assigns to entry 05 — keep plain `DISTINCT` here and move that half out rather than teaching it twice.

Learning outcome: Victor can build a result shape from named and computed columns, qualify ambiguous names, transform text, and explain the logical query stages visible so far.

Prerequisites: entries 00, 01, 02

Must answer:

- How do SELECT, FROM, aliases, qualified references, and expressions define the result without changing source data?
- Why should application queries name columns rather than use SELECT *?
- How do CASE, DISTINCT, string concatenation, quoted identifiers, and integer operand types affect the result?
- How do LOWER, UPPER, TRIM, LENGTH, SUBSTRING, and REPLACE treat text, whitespace, characters, and NULL?
- How should the complete FROM and JOIN through LIMIT execution order be read as a preview before filtering, JOINs and grouping arrive in chapters 04, 06 and 07?

Coverage concepts:

- [ ] `SELECT`, `FROM`, and column aliases — `SELECT` defines the result expressions, `FROM` supplies rows, and `AS` names a result expression without changing the source column
- [ ] Qualified column references — use `alias.column` when more than one input exposes the same name and whenever qualification makes a multi-table query unambiguous
- [ ] SQL execution order — `FROM + JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`; the foundation for understanding why aliases work in `ORDER BY` but not in `WHERE` or `HAVING`
- [ ] Computed expressions — arithmetic and string expressions can produce derived result columns; give them aliases and account for operand types such as integer division
- [ ] `SELECT *` vs named columns — specify the required columns in application code; `SELECT *` can fetch unnecessary data and makes the result shape change whenever the schema changes
- [ ] `CASE WHEN` in `SELECT` — derive one output value per row from ordered conditions
- [ ] `SELECT DISTINCT` — removes duplicate rows from the result; PostgreSQL treats `NULL` as a duplicate and keeps only one; use to explore unique values in a column
- [ ] SQL string literals vs quoted identifiers — single quotes delimit values, while double quotes delimit case-sensitive or otherwise special identifiers; unquoted PostgreSQL identifiers fold to lowercase
- [ ] `||` string concatenation — combine text expressions into one output value while accounting for `NULL` propagation
- [ ] `LOWER` and `UPPER` — normalise case for display or comparison while recognising that applying them to a column can affect ordinary index use
- [ ] `TRIM` — removes leading and trailing characters, whitespace by default, without changing whitespace inside the value
- [ ] `LENGTH` — counts characters in text rather than bytes, which matters for non-ASCII data
- [ ] `SUBSTRING` — extract a positional part of a string for query shaping rather than to repair badly modelled data
- [ ] `REPLACE` — substitute every occurrence of matching text within a value, without regard to word boundaries

Rationale: One mental model: the SELECT list as a set of per-row expressions over supplied rows, plus the functions those expressions are built from.

Handoff: After constructing result columns, chapter 04 decides which source rows survive through predicates and three-valued NULL logic.

## 04 — Filtering and NULL handling

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/sql/junior/en/04-where.md
Spanish: notes/sql/junior/es/04-where.md

Depends on: 00, 01, 03

Pending additions: none

Narrative role: Teach WHERE as a three-valued truth test: precedence, unknown, pattern matching, membership, deliberate defaults, and safe timestamp ranges. Relocation the audit owes: the existing file's `### Casting with ::` section teaches the cast operator, which this plan assigns to entry 14 — use `::` here with a one-line forward marker instead of teaching it.

Learning outcome: Victor can write correctly grouped filters and predict how TRUE, FALSE, UNKNOWN, NULL, membership lists, patterns, and time boundaries affect each row.

Prerequisites: entries 00, 01, 03

Must answer:

- Why does WHERE keep only TRUE, and how can a condition and its own negation both drop the same row?
- Why does = NULL never become TRUE, and how does UNKNOWN flow through NOT, AND, OR, and WHERE?
- Why does WHERE reject a column alias that ORDER BY accepts, given the execution order previewed in chapter 03, and what has to be written in its place?
- Why can NOT IN return no rows when NULL is present, and why is the correlated NOT EXISTS alternative deferred to chapter 09?
- When do COALESCE and NULLIF express a deliberate contract rather than hide missing data, and why is NULLIF's division guard shown here on a plain division rather than on the aggregate form of chapter 07?
- How do LIKE, ILIKE, %, _, IN, and operator precedence change a predicate?
- Why is a half-open timestamp range safer and more index-friendly than an inclusive date-only upper bound?

Coverage concepts:

- [ ] `WHERE` operators and precedence — comparisons, `NOT`, `AND`, and `OR` build row predicates; `NOT` binds before `AND`, and `AND` before `OR`, so use parentheses whenever the intended grouping is not immediately obvious
- [ ] `WHERE` keeps only `TRUE` — a predicate evaluates to true, false, or unknown, and only true-rows survive; unknown is discarded exactly like false, which is why a condition and its own negation can both drop the same `NULL` row and the two result sets fail to add up to the table
- [ ] `WHERE` cannot use aliases — `WHERE` runs before `SELECT`, so column aliases do not exist yet; you must repeat the expression rather than use the alias
- [ ] `IS NULL` vs `= NULL` — test absence with `IS NULL` or `IS NOT NULL` because ordinary equality with `NULL` evaluates to unknown
- [ ] `AND` / `OR` with `NULL` — `true AND NULL` returns `NULL`, but `false AND NULL` returns `false`; `false OR NULL` returns `NULL`, but `true OR NULL` returns `true`; a `WHERE` filter without an `IS NULL` check can silently exclude rows
- [ ] `COALESCE(value, fallback)` — returns the first non-`NULL` value; use it when the query contract deliberately substitutes a default such as `0` or `'Unknown'`, without confusing missing data with a real value
- [ ] `NULLIF(a, b)` — returns `NULL` if `a = b`, otherwise returns `a`; most common use: avoid division by zero with `SUM(...) / NULLIF(COUNT(*), 0)`
- [ ] `LIKE` vs `ILIKE` — `LIKE` is case-sensitive; `ILIKE` is PostgreSQL-specific and case-insensitive; `%` matches any sequence of characters, `_` matches exactly one character
- [ ] `IN` vs multiple `OR` — `IN (list)` is cleaner and optimized internally by PostgreSQL; preferred when checking against more than two values
- [ ] `BETWEEN` with timestamps — both endpoints are inclusive, so a date-only upper bound silently excludes later times on that date; use a half-open range such as `created_at >= start AND created_at < next_day` to preserve index use and include the whole period

Rationale: One mental model: a row survives only when its predicate evaluates to TRUE, and every rule in the chapter is a consequence of that plus three-valued logic.

Handoff: Once the correct rows can be selected, chapter 05 orders, limits, paginates, and combines complete result sets deterministically.

## 05 — Ordering, pagination, and set operations

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/sql/junior/en/05-order-by-limit.md
Spanish: notes/sql/junior/es/05-order-by-limit.md

Depends on: 00, 03, 04

Pending additions: none

Narrative role: Establish that a result set has no inherent order, then control order and size deterministically and stack compatible result sets with explicit duplicate semantics.

Learning outcome: Victor can produce deterministic sorted pages and choose UNION, UNION ALL, INTERSECT, or EXCEPT while satisfying their column and type rules.

Prerequisites: entries 00, 03, 04

Must answer:

- Why is a result set unordered, and why does an order that merely looks right today not survive the next run?
- How are multiple ORDER BY keys applied, and how do NULLS FIRST and NULLS LAST change PostgreSQL defaults?
- Why is LIMIT without ORDER BY arbitrary, and why does pagination need a unique tie-breaker?
- How is OFFSET calculated, what limitation appears at large offsets, and when is the standard FETCH FIRST form needed instead of LIMIT?
- How do UNION, UNION ALL, INTERSECT, and EXCEPT treat duplicates, column counts, types, and result names?
- How does DISTINCT ON choose one row per group, and why must its expressions be the leftmost ORDER BY keys?

Coverage concepts:

- [ ] No guaranteed row order without `ORDER BY` — a result set is an unordered set, so `GROUP BY`, an index scan, or insertion order can make rows look sorted while the engine stays free to return them differently on the next run; an order a caller depends on has to be stated, never inherited from how the rows happened to be produced
- [ ] Multi-column sorting — PostgreSQL resolves `ORDER BY` keys from left to right, so later keys break ties from earlier ones and each key can choose `ASC` or `DESC`
- [ ] `ORDER BY` with `NULLS FIRST` / `NULLS LAST` — PostgreSQL treats `NULL` as the largest value by default; `ASC` puts `NULL` last, `DESC` puts `NULL` first; override with `NULLS FIRST` or `NULLS LAST`
- [ ] `LIMIT` always with `ORDER BY` — without `ORDER BY`, `LIMIT` returns an arbitrary set of rows that can change between queries; always pair them
- [ ] Stable ordering — pagination needs a deterministic tie-breaker such as the primary key after a non-unique sort column; otherwise equal values can move between pages
- [ ] `OFFSET` for pagination — `LIMIT 10 OFFSET 20` skips 20 rows and returns the next 10; formula: `OFFSET = (page − 1) × page_size`
- [ ] `FETCH FIRST n ROWS ONLY` — the SQL-standard row-limiting clause, written as `OFFSET n ROWS FETCH NEXT m ROWS ONLY`; PostgreSQL accepts both it and `LIMIT`, but Oracle and other engines a consultancy account may run accept only the standard form
- [ ] `DISTINCT ON` — PostgreSQL-specific; keeps one row per group while returning multiple columns; the column inside `DISTINCT ON (...)` must be the leftmost column in `ORDER BY`
- [ ] `UNION` vs `UNION ALL` — remove duplicates across compatible result sets or retain every row and avoid unnecessary duplicate elimination
- [ ] `UNION` column rules — align column counts and compatible types across branches while taking result column names from the first query
- [ ] `INTERSECT` and `EXCEPT` — `INTERSECT` keeps rows present in both results and `EXCEPT` keeps rows from the first result that are absent from the second; both remove duplicates unless `ALL` is requested

Rationale: One mental model: a query result is an unordered set until the statement itself imposes order, size, and membership on it.

Handoff: With single-source result sets controlled and row-stacking understood, chapter 06 widens rows with columns from related tables without hiding cardinality mistakes.

## 06 — JOINs

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/sql/junior/en/06-joins.md
Spanish: notes/sql/junior/es/06-joins.md

Depends on: 00, 02, 03, 04, 05

Pending additions: none

Narrative role: Combine related tables while predicting cardinality and deliberately preserving, rejecting, or locating unmatched rows — and separate widening a row from the row-stacking of chapter 05.

Learning outcome: Victor can choose every junior join type, write readable aliases and ON conditions, predict row multiplication, preserve outer-join semantics, and decide whether a request to "combine two tables" means a join or a union.

Prerequisites: entries 00, 02, 03, 04, 05

Must answer:

- How does PostgreSQL match rows through ON, and why can a one-to-many join multiply a source row?
- When do INNER, LEFT, RIGHT, FULL OUTER, CROSS, and self joins apply?
- How does LEFT JOIN plus right-side IS NULL find missing relationships?
- Why can moving a right-side condition from ON to WHERE turn a LEFT JOIN into an inner join?
- Why is DISTINCT not a valid blind repair for apparent duplicates, and how do aliases prevent ambiguity?
- How do I tell whether a request needs a join or the UNION of chapter 05, when both get described as combining two tables?

Coverage concepts:

- [ ] `INNER JOIN` — returns only rows where both tables have a match; the most common JOIN; `JOIN` without a keyword defaults to `INNER JOIN`
- [ ] `LEFT JOIN` — returns all rows from the left table with `NULL` on the right when there is no match; used for "show all users even if they have no time entries"
- [ ] `INNER JOIN` vs `LEFT JOIN` — `INNER` excludes rows with no match on either side; `LEFT` keeps all left rows and fills the right side with `NULL`; choosing the wrong one is the most common JOIN mistake in junior code
- [ ] Table aliases in JOINs — `FROM books b JOIN authors a ON b.author_id = a.id`; makes queries readable and is required when two joined tables share a column name
- [ ] JOIN cardinality and row multiplication — predict whether each relationship is one-to-one, one-to-many, or many-to-many before joining; apparent duplicates usually mean the join produced several legitimate matches, so `DISTINCT` must not be used as a blind repair
- [ ] Finding missing data with `LEFT JOIN` — `WHERE right_table.id IS NULL` after a `LEFT JOIN` returns every left row with no match on the right; the standard pattern for "which projects have no time entries?"
- [ ] `RIGHT JOIN` — mirror a `LEFT JOIN` and recognise that swapping table order can express the same outer-join relationship more conventionally
- [ ] `FULL OUTER JOIN` — returns all rows from both sides with `NULL` where there is no match; used to find unmatched rows on either side at once
- [ ] `ON` vs `WHERE` with an outer join — a condition in `ON` controls which right-side rows match while preserving unmatched left rows; moving that condition to `WHERE` can reject the `NULL`-extended rows and accidentally turn a `LEFT JOIN` into an inner join
- [ ] Multiple JOINs — chain relationships through several tables while keeping every join condition tied to the intended key path
- [ ] Self JOIN — assign separate aliases to one table so rows from that table can be related or compared with each other
- [ ] `CROSS JOIN` — produces every combination of the two inputs; use it only when a Cartesian product is intentional and recognise a missing join condition as the accidental version
- [ ] `UNION` vs `JOIN` — a union stacks rows from two result sets that share a shape, while a join widens each row with columns from a related table; "combine two tables" is ambiguous and picking the wrong one produces a result of the wrong shape, not merely the wrong size

Rationale: One mental model: a join widens each row with columns found through a match condition — which is what separates it from chapter 05's stacking, and what makes cardinality the first thing to predict.

Handoff: Correct combined rows are the input chapter 07 summarises into counts, totals, averages, and grouped reports.

## 07 — Aggregates and grouping

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/sql/junior/en/07-aggregates.md
Spanish: notes/sql/junior/es/07-agregados.md

Depends on: 00, 03, 04, 06

Pending additions: none

Narrative role: Collapse detail rows into trustworthy summaries while preserving the distinctions among NULL input, empty input, row filters, group filters, and the grouping key itself.

Learning outcome: Victor can choose aggregates, form legal groups keyed on the right column, keep zero-match groups, repair a count inflated by a legitimate join multiplication, and write conditional aggregation with CASE or FILTER.

Prerequisites: entries 00, 03, 04, 06

Must answer:

- Why do COUNT(*) and COUNT(column) differ, and what do all aggregates return for empty input?
- Why does COUNT(*) report 1 for a group that has nothing after a LEFT JOIN, and which column has to be counted instead?
- When is an inflated count a legitimate join multiplication that COUNT(DISTINCT ...) repairs, rather than a broken query?
- Which selected expressions must be grouped or aggregated, and what limited functional-dependency exception does PostgreSQL recognise?
- Why does grouping by a display name silently merge two different things, and what should the group key be instead?
- Why does GROUP BY collect NULLs into one group when WHERE discards them, and how should that unlabelled category be read?
- When do GROUP BY and SELECT DISTINCT give the same answer, and which one states the intent?
- Why does WHERE filter rows before grouping while HAVING filters completed groups?
- How does LEFT JOIN keep zero-match groups, and why does counting a nullable right-side column matter?
- When should conditional aggregation use CASE WHEN and when is FILTER clearer?
- How does CASE WHEN create one value per row in SELECT but choose contributing rows when nested inside an aggregate?
- How does STRING_AGG turn the rows of a group into one value, and why is its order arbitrary unless stated inside the call?
- How does chapter 01's scale rule land on a real report total, so a rounded sum answers 0.00 rather than 0 on a group with no rows?

Coverage concepts:

- [ ] `COUNT(*)` vs `COUNT(column)` — count all input rows or only rows where the selected expression is non-`NULL`
- [ ] `SUM` — add the known values of a numeric column across a group, ignoring `NULL` instead of treating it as zero
- [ ] `AVG` — divide the sum of known values by the count of known values, so a `NULL` lowers neither side and a missing value is never averaged in as a zero
- [ ] `MIN` and `MAX` — return the smallest or largest non-`NULL` input and work with ordered types such as numbers, text, and dates
- [ ] Aggregate results on empty input — `COUNT` returns `0`, while `SUM`, `AVG`, `MIN`, and `MAX` return `NULL` when no input rows remain; use `COALESCE` only when the result contract truly requires a default
- [ ] `GROUP BY` rule — selected expressions normally need to be grouped or aggregated; PostgreSQL also permits columns it can prove functionally dependent on a grouped primary key, but explicit grouping is clearer in portable junior SQL
- [ ] `GROUP BY` vs `SELECT DISTINCT` — both collapse repeated values, so they agree whenever nothing is aggregated; reach for `GROUP BY` when the query needs a per-group calculation, and treat `DISTINCT` as deduplication of an already-correct result
- [ ] `GROUP BY` on an identifying column, not just a display name — grouping by a name alone silently merges two distinct rows that happen to share that name; group by the id (and select the name alongside it) so an aggregate stays correct even when values collide
- [ ] `GROUP BY` and `NULL` — grouping collects every `NULL` into one single group rather than discarding those rows, which is the opposite of what `WHERE` does with an unknown predicate; a report can therefore grow an unlabelled category that is easy to misread as a bug
- [ ] `GROUP BY` with `LEFT JOIN` — when joining before grouping, include all non-aggregated columns from the joined table in `GROUP BY`; use `LEFT JOIN` so groups with zero matches still appear with `COUNT = 0`
- [ ] `COUNT(*)` vs `COUNT(column)` after a `LEFT JOIN` — an unmatched left row survives as one `NULL`-extended row, so `COUNT(*)` reports `1` for a group that actually has nothing; count a non-nullable column from the right table to get the `0` the report means
- [ ] `COUNT(DISTINCT column)` — counts how many different non-`NULL` values a group holds rather than how many rows carry them; the correct repair when a legitimate join multiplication has inflated a plain `COUNT`
- [ ] `HAVING` — filter grouped results after aggregation while `WHERE` filters input rows before grouping
- [ ] Conditional aggregation with `CASE WHEN` — make only rows satisfying a condition contribute to an aggregate without discarding other groups
- [ ] `CASE WHEN` in `SELECT` vs inside an aggregate — in `SELECT` it produces a new column per row; inside `SUM(CASE WHEN ...)` it filters which rows contribute to the aggregate; same syntax, very different behavior
- [ ] `FILTER (WHERE ...)` — PostgreSQL shorthand for conditional aggregation: `COUNT(*) FILTER (WHERE status = 'approved')`; same result as `CASE WHEN` but cleaner for simple conditions
- [ ] `STRING_AGG(column, separator)` — concatenates values from several rows into one PostgreSQL result per group; the order is arbitrary unless an `ORDER BY` is written inside the aggregate call itself

Rationale: One mental model: rows are partitioned into groups by a key and each group is reduced to one row — every rule here is about which rows enter a group, what the key really identifies, and how the reduction treats missing input.

Handoff: With grouped reports understood, chapter 08 safely changes rows under the schema and constraint contract.

## 08 — DML — modifying data

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/sql/junior/en/08-dml.md
Spanish: notes/sql/junior/es/08-dml.md

Depends on: 00, 01, 02, 03, 04

Pending additions: none

Narrative role: Create, update, and remove rows safely through explicit targets, bounded predicates, returned values, bulk insertion, truncation choices, and atomic conflict handling.

Learning outcome: Victor can predict and verify the affected rows of INSERT, UPDATE, DELETE, TRUNCATE, and ON CONFLICT statements, keep runtime values bound separately from SQL structure, and explain why only the constraint — never a preceding SELECT — decides uniqueness.

Prerequisites: entries 00, 01, 02, 03, 04

Must answer:

- How do target columns, generated identity, defaults, nullability, multi-row VALUES, and INSERT SELECT determine a valid insert?
- How does RETURNING avoid a second query after INSERT, UPDATE, or DELETE?
- How do you prove the intended row set with a matching SELECT before running an UPDATE or DELETE?
- When do DELETE and TRUNCATE differ in filtering, locking, and identity restart, and how does that row-level contrast complete the DROP comparison started in chapter 02?
- Why can a SELECT that finds no duplicate be followed by an INSERT that creates one anyway, and what is the application-side check still good for?
- Why is ON CONFLICT atomic while SELECT followed by INSERT has a race condition?
- Why must application values use bound parameters rather than string interpolation?

Coverage concepts:

- [ ] `INSERT INTO ... VALUES (...)` — adds rows to a table; skip `id` (generated by `SERIAL`), columns with `DEFAULT` values, and nullable columns you want to leave empty
- [ ] Multi-row `INSERT` — supply several value tuples in one statement so the rows are inserted in a single round trip and a single implicit transaction
- [ ] `INSERT ... SELECT` — populate a table from the result of a query, matching target columns to result columns by position and compatible type
- [ ] `RETURNING` — obtain generated or changed values from a PostgreSQL data-modification statement without a second query
- [ ] `UPDATE ... SET ... WHERE` — always include `WHERE` or every row in the table is updated; one of the most common catastrophic mistakes in junior code
- [ ] `DELETE FROM ... WHERE` — always include `WHERE` or every row is deleted; always verify the affected rows with a matching `SELECT` before running `DELETE` on production data
- [ ] `DELETE` vs `TRUNCATE` — `DELETE` supports `WHERE` and processes matching rows; `TRUNCATE`
  removes all rows with a stronger table lock and resets sequences only when `RESTART IDENTITY` is
  requested; choose deliberately rather than treating either as universally safe
- [ ] `ON CONFLICT` (upsert) — `INSERT ... ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name` — atomic insert-or-update; avoids the race condition of a `SELECT` + `INSERT` pair; `EXCLUDED` refers to the values that would have been inserted
- [ ] Constraint vs application-side uniqueness check — a `SELECT` that finds no duplicate followed by an `INSERT` is two statements, so a concurrent session can pass the same check and both rows land; only the constraint decides atomically, which makes the application check a friendlier error message rather than the guarantee, and makes `ON CONFLICT` one concrete way of handling the constraint's verdict
- [ ] Bound parameters — keep SQL structure separate from runtime values through prepared-statement or framework placeholders, preserving correct typing and reusable statement structure

Rationale: One mental model: a statement that changes rows, judged by the exact set of rows it affects and by what the database — not the application — guarantees while it runs.

Handoff: Several mutations can represent one business action, so chapter 09 first develops the reusable nested query shapes the later data work depends on.

## 09 — Subqueries and existence tests

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/sql/junior/en/09-subqueries.md
Spanish: notes/sql/junior/es/09-subconsultas.md

Depends on: 00, 03, 04, 06, 07

Pending additions: none

Narrative role: Nest queries when one result supplies a value, table, or existence relationship to another query without accidentally changing cardinality.

Learning outcome: Victor can choose scalar, derived-table, correlated, IN, EXISTS, JOIN, or pre-aggregation forms according to result shape, NULL semantics, and readability.

Prerequisites: entries 00, 03, 04, 06, 07

Must answer:

- What row and column shape may WHERE, FROM, and scalar SELECT subqueries return?
- Why can a correlated subquery repeat work per outer row while an uncorrelated scalar subquery may be evaluated once?
- How do IN and EXISTS express different semantics without relying on a universal speed rule?
- When does a JOIN multiply rows that EXISTS would only test for presence?
- Why does NOT EXISTS remain safe when the compared subquery column can contain NULL?

Coverage concepts:

- [ ] Subquery in `WHERE` — `WHERE price > (SELECT AVG(price) FROM books)` — you cannot use `AVG` directly in `WHERE`; the subquery runs first and its result is used by the outer query
- [ ] Subquery in `FROM` (derived table) — a query used as a table; must have an alias; used to filter on an aggregated result because `WHERE` cannot use aggregate functions
- [ ] Scalar subquery in `SELECT` — must return at most one row and one column; an uncorrelated scalar subquery can be evaluated once, while a correlated one may require work for each outer row
- [ ] `IN` vs `EXISTS` — choose from result semantics and null behaviour rather than a universal speed rule: `IN` compares with a set of values, while correlated `EXISTS` asks whether at least one matching row exists; PostgreSQL may optimise either into a similar plan
- [ ] Correlated subquery — references a column from the outer row and expresses a per-row relationship; compare it with `EXISTS`, a join, or pre-aggregation when the repeated relationship is hard to read or slow
- [ ] `NOT IN` with `NULL` — if the subquery or list contains `NULL`, comparisons can become `UNKNOWN` and `NOT IN` may return no rows; use `NOT EXISTS` with a correlated equality when nullability is possible
- [ ] Subquery vs `JOIN` — choose the form that expresses the required result cardinality clearly; a join can multiply rows while `EXISTS` only tests presence, and PostgreSQL can often optimise equivalent formulations similarly

Rationale: One mental model: a query used as a value, as a table, or as a truth test inside another query — and the cardinality consequence each of those three uses carries.

Handoff: Subqueries can express the right result and still perform poorly; chapter 10 introduces the evidence and access structures used to investigate that cost.

## 10 — Performance basics

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/sql/junior/en/10-indexes.md
Spanish: notes/sql/junior/es/10-indices.md

Depends on: 00, 02, 03, 04, 05, 06

Pending additions: none

Narrative role: Introduce B-tree indexes, foreign-key indexing, sargable predicates, and EXPLAIN as evidence for access-path decisions.

Learning outcome: Victor can explain index read/write trade-offs, identify plausible candidates, recognise Seq Scan and Index Scan in EXPLAIN, and avoid predicates that prevent a normal B-tree from narrowing the scan.

Prerequisites: entries 00, 02, 03, 04, 05, 06

Must answer:

- How does an auxiliary B-tree access structure reduce row visits, and what storage and write work maintains it?
- Which primary and unique keys are indexed automatically, and why are referencing foreign keys not?
- Why can a sequential scan be reasonable for a small table or a weakly selective predicate?
- How do functions on indexed columns and leading-wildcard patterns affect sargability?
- What can EXPLAIN show before any index is added?

Coverage concepts:

- [ ] What an index is — an auxiliary access structure that can speed reads at the cost of storage and write maintenance; B-tree is PostgreSQL's common ordered index, while other index methods serve different operators
- [ ] When to add an index — columns frequently used in `WHERE`, `JOIN ON`, or `ORDER BY` on large tables; when you see a `Seq Scan` on a large table in `EXPLAIN` output
- [ ] Foreign-key indexes — PostgreSQL indexes the referenced primary or unique key but not the referencing foreign-key columns automatically; add an index when joins or parent deletes need to find dependent rows efficiently
- [ ] When NOT to index — avoid indexes without a measured access pattern, especially on small tables or frequently updated columns; low cardinality alone is not decisive because a partial or composite index can still be selective
- [ ] `EXPLAIN` — shows the query plan and whether an index is being used; `Seq Scan` means every row is read; `Index Scan` means the index was used; run this when a query is slow before adding an index
- [ ] Sargable predicates — compare an indexed column directly to a compatible value or range when possible; wrapping the column in a function or starting a pattern with `%` can prevent a normal B-tree index from narrowing the scan

Rationale: One mental model: an index is an optional access path whose value is settled by evidence, and every rule here is about when the engine can and cannot use it.

Handoff: Performance changes must not weaken correctness; chapter 11 groups related statements inside explicit transaction boundaries.

## 11 — Transactions

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/sql/junior/en/11-transactions.md
Spanish: notes/sql/junior/es/11-transacciones.md

Depends on: 00, 02, 08

Pending additions: none

Narrative role: Protect multi-statement business operations with explicit boundaries, all-or-nothing outcomes, savepoints, failure recovery, and deliberate isolation.

Learning outcome: Victor can explain autocommit, BEGIN, COMMIT, ROLLBACK, ACID, savepoints, PostgreSQL's failed-transaction state, and the purpose of READ COMMITTED.

Prerequisites: entries 00, 02, 08

Must answer:

- Why can autocommit leave a multi-statement business operation partially applied?
- What do Atomicity, Consistency, Isolation, and Durability each guarantee without treating constraints or serial execution as magic?
- How do SAVEPOINT and ROLLBACK TO undo only part of a transaction?
- Why does PostgreSQL reject later statements after one statement fails until rollback clears the state?
- What can READ COMMITTED observe, and when would a stronger isolation guarantee need a concrete justification?

Coverage concepts:

- [ ] `BEGIN` / `COMMIT` / `ROLLBACK` — groups multiple statements so they either all succeed or all fail; `ROLLBACK` undoes everything since `BEGIN`; the SQL-level mechanism that `@Transactional` wraps in Spring Boot
- [ ] Autocommit and explicit transaction boundaries — outside an explicit transaction, clients commonly commit each successful statement separately, so `BEGIN` or the framework transaction boundary is required when several statements must succeed or fail together
- [ ] ACID properties — Atomicity is all-or-nothing, Consistency preserves declared invariants from one
  valid state to another, Isolation controls interference between concurrent transactions, and
  Durability preserves committed work
- [ ] `SAVEPOINT` — a named checkpoint inside a transaction; `ROLLBACK TO name` undoes only the work since that checkpoint without ending the transaction
- [ ] Transaction failure state — after a PostgreSQL statement errors inside a transaction, later statements are rejected until `ROLLBACK` or `ROLLBACK TO SAVEPOINT` clears the failed state
- [ ] Transaction isolation — controls which concurrent changes a transaction can observe; recognise PostgreSQL `READ COMMITTED` as the default and choose stronger guarantees only for a concrete consistency need

Rationale: One mental model: a transaction is the unit the database makes all-or-nothing, and every rule here follows from where its boundaries are drawn.

Handoff: With correctness across statements established, chapter 12 names and reuses multi-step read logic through CTEs and views.

## 12 — CTEs and views

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/sql/junior/en/12-ctes-and-views.md
Spanish: notes/sql/junior/es/12-ctes-y-vistas.md

Depends on: 00, 03, 06, 07, 09

Pending additions: none

Narrative role: Name query stages within one statement and save reusable query definitions across statements without confusing either with stored result data.

Learning outcome: Victor can structure multiple CTEs in dependency order and create a view whose live underlying query is reusable like a table.

Prerequisites: entries 00, 03, 06, 07, 09

Must answer:

- What does WITH name, how long does a CTE exist, and why may each CTE reference only earlier definitions?
- When does naming a subquery improve a multi-step query rather than add ceremony, and why is a CTE not inherently faster than the inline form?
- What does CREATE VIEW store, when does its query run, and how is that different from storing table rows?

Coverage concepts:

- [ ] `WITH` (CTE) — name an intermediate query for reuse and readability without assuming it is inherently faster than an inline subquery
- [ ] Multiple CTEs — chain CTEs with commas; each CTE can reference the ones defined before it; used to build complex queries step by step without nesting
- [ ] `CREATE VIEW` — saves a query in the database with a name; queried like a table but runs the underlying query live on every access; used to avoid repeating complex JOINs across different parts of an application

Rationale: One mental model: giving a query a name — for one statement or for the whole database — without that name ever storing rows.

Handoff: Reusable, named report inputs now make it practical to calculate per-group values without collapsing the detail rows, which is chapter 13.

## 13 — Window functions

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/sql/junior/en/13-window-functions.md
Spanish: notes/sql/junior/es/13-funciones-de-ventana.md

Depends on: 00, 03, 05, 07, 12

Pending additions: none

Narrative role: Calculate per-group values, above all rankings, while keeping every detail row — and settle the "one row per group" question chapter 05 opened with DISTINCT ON. Scope the audit owes: the existing file's `## LAG() and LEAD()` and `## SUM() OVER (...)` running-total sections, plus DENSE_RANK, are no longer junior coverage — trim them to the junior floor rather than carrying them as assigned scope.

Learning outcome: Victor can define a partition and its order, choose ROW_NUMBER or RANK by how each treats ties, explain why OVER keeps rows GROUP BY would collapse, and pick between DISTINCT ON and the window form for one row per group.

Prerequisites: entries 00, 03, 05, 07, 12

Must answer:

- Why does GROUP BY collapse a group while an aggregate with OVER keeps every row?
- How do PARTITION BY and ORDER BY define the rows and the sequence a ranking function sees?
- How do ROW_NUMBER and RANK treat ties differently, and which one gives exactly one row per group?
- Why can a window function not be filtered in the same query's WHERE, and what wrapping does the latest-row-per-group pattern need?
- When is DISTINCT ON the better answer than ROW_NUMBER() = 1, and what does each cost in portability and flexibility?

Coverage concepts:

- [ ] Aggregate result vs window result — `GROUP BY` collapses each group into one row, while an aggregate with `OVER` preserves every input row and adds a value calculated over its window
- [ ] `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` — assign a deterministic sequence within each partition, such as selecting one latest row per group in an outer query
- [ ] `RANK()` vs `ROW_NUMBER()` — `RANK()` gives tied rows the same number and skips the next (1, 1, 3); `ROW_NUMBER()` always gives a unique number regardless of ties (1, 2, 3); when you need exactly one row per group, use `ROW_NUMBER()`
- [ ] `DISTINCT ON` vs `ROW_NUMBER() = 1` — both answer "one latest row per group"; `DISTINCT ON` is shorter but PostgreSQL-only and ties its result to `ORDER BY`, while the window form is portable and can keep the rank as a column or take more than one row per group

Rationale: One mental model: a window is the set of related rows a calculation may see without the result collapsing to one row per group — and ranking is what that model is for at junior level.

Handoff: The analytical toolkit is complete; chapter 14 collects the PostgreSQL-specific casting and date syntax the earlier chapters kept reaching for, and marks its portability boundaries.

## 14 — PostgreSQL specifics

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/sql/junior/en/14-postgresql-specifics.md
Spanish: notes/sql/junior/es/14-particularidades-de-postgresql.md

Depends on: 00, 01, 03, 04, 07

Pending additions: none

Narrative role: Consolidate the PostgreSQL-specific casting and date syntax already grounded in querying, filtering, and grouping, and state where each one stops being portable. Relocation the audit owes: the existing file's `## STRING_AGG` section belongs to entry 07 under this plan, and the cast operator this chapter now owns is currently taught in `04-where.md` — move each concept once, so neither lands twice.

Learning outcome: Victor can use casts, DATE_TRUNC, EXTRACT, transaction-time NOW, CURRENT_DATE, and INTERVAL while explaining their index and portability consequences.

Prerequisites: entries 00, 01, 03, 04, 07

Must answer:

- When is coupling to a vendor extension worth it, and what makes a construct portable in the first place?
- How does :: relate to standard CAST, and when can casting a column prevent a simple index condition?
- How do DATE_TRUNC and EXTRACT answer different reporting questions?
- Why do NOW and CURRENT_DATE both freeze at the start of the transaction, and what exactly differs between them?
- How does INTERVAL build a relative date range on top of the date types of chapter 01?

Coverage concepts:

- [ ] Standard SQL vs vendor extensions — prefer portable constructs for transferable query logic and use PostgreSQL-specific syntax deliberately when its benefit justifies the coupling
- [ ] `::` cast operator — `created_at::date` converts a timestamp to a date; `'5'::int` converts a string to an integer; shorter PostgreSQL syntax for standard SQL `CAST(value AS type)`; used constantly in `WHERE` and `JOIN` conditions involving dates
- [ ] `DATE_TRUNC('month', date)` — truncates a timestamp to the start of the month; used to `GROUP BY` month in reports; `DATE_TRUNC('year', ...)` works the same way for yearly grouping
- [ ] `EXTRACT` — returns one date/time field such as year, month, or hour for filtering or reporting; use it deliberately because applying a function to an indexed column can prevent a simple index condition
- [ ] `NOW()` vs `CURRENT_DATE` — both are fixed at the start of the current transaction rather than re-read per statement, so neither advances inside a long transaction; the difference is the returned type, a full timestamp against a date with no time component
- [ ] `INTERVAL` — `NOW() - INTERVAL '30 days'` filters recent data; used in `WHERE` clauses and CTEs for relative date ranges; `INTERVAL '1 month'` works with months and years

Rationale: One mental model: PostgreSQL's own shorthand for casting and date arithmetic, each judged by what it buys and what portability it costs.

Handoff: Chapter 15 turns all preceding mechanisms into a repeatable construction and review workflow.

## 15 — Query workflow and SQL review

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/sql/junior/en/15-query-workflow-and-review.md
Spanish: notes/sql/junior/es/15-flujo-de-trabajo-y-revision-de-sql.md

Depends on: 00, 02, 03, 04, 05, 06, 07, 08, 10

Pending additions: none

Narrative role: Consolidate SQL into a professional workflow that begins from result grain, builds incrementally, verifies totals, and reviews the failure modes the earlier chapters each warned about one at a time.

Learning outcome: Victor can translate a business question into staged SQL, predict and test row counts and edge cases, review mutations and pagination safely, and explain each clause in an interview.

Prerequisites: entries 00, 02, 03, 04, 05, 06, 07, 08, 10

Must answer:

- How do you define result grain, tables, join paths, filters, grouping, and ordering before writing syntax?
- How does inspecting a small sample and an expected row count after each stage locate the first wrong transformation?
- Which control queries verify report totals at the intended grain?
- How do you review Cartesian products, row multiplication hidden by DISTINCT, NULL predicates, unsafe mutation scope, date boundaries, and unstable pagination?

Coverage concepts:

- [ ] Query construction from a business question — decide the result grain first, then identify tables, join paths, filters, grouping, and ordering before writing syntax
- [ ] Incremental query debugging — inspect a small sample after each join, filter, and aggregation, and predict the expected row count so errors are found where they enter
- [ ] Report-total verification — compare complex report totals with simpler control queries at the intended grain before trusting the result
- [ ] Join-review failures — detect accidental Cartesian products, incorrect cardinality, and `DISTINCT` used to hide row multiplication
- [ ] Predicate-review failures — detect `NULL` comparisons, unsafe value interpolation, and date ranges that omit boundary rows
- [ ] Mutation-review failures — detect unbounded `UPDATE` or `DELETE` statements and verify the intended affected-row set before execution
- [ ] Pagination-review failures — require deterministic ordering and recognise when large `OFFSET` values make a different pagination strategy necessary

Rationale: One mental model: writing SQL as a staged, checkable procedure, and reviewing it against the named failure families the route has already taught.

Handoff: The final chapter applies that workflow to an inherited database whose schema, permissions, and server-side behaviour must first be discovered.

## 16 — Working with an existing database

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/sql/junior/en/16-working-with-an-existing-database.md
Spanish: notes/sql/junior/es/16-trabajar-con-una-base-de-datos-existente.md

Depends on: 00, 01, 02, 03, 08, 15

Pending additions: none

Narrative role: Close the junior route with the consultancy scenario of inspecting, querying, and diagnosing a database Victor did not design.

Learning outcome: Victor can inspect catalogs and schemas, resolve names through qualification and search path, classify common errors, recognise least-privilege grants, and investigate routines or triggers behind unexpected behaviour.

Prerequisites: entries 00, 01, 02, 03, 08, 15

Must answer:

- How do object browsers, information_schema, and PostgreSQL catalogs reveal columns, types, nullability, keys, and constraints?
- How do schema-qualified names and search path determine which relation a statement resolves?
- How do syntax or name-resolution errors differ from cast, operator, and constraint errors?
- Why should an application role receive only required object privileges rather than superuser access?
- How can stored routines and triggers cause behaviour not visible in an application statement?

Coverage concepts:

- [ ] Schema inspection — use a SQL client's object browser and `information_schema` or PostgreSQL catalog views to discover columns, types, nullability, keys, and constraints before querying an unfamiliar database
- [ ] Database schemas and qualified relation names — schemas namespace objects inside a database; recognise `schema.table` and the role of the search path when inherited code resolves the wrong table or cannot find a relation
- [ ] Syntax and name-resolution errors — use the reported position and identifiers to fix malformed syntax, missing relations or columns, and ambiguous references
- [ ] Type and constraint errors — distinguish failed casts or incompatible operators from `NOT NULL`, `UNIQUE`, `CHECK`, and foreign-key violations
- [ ] `GRANT` and `REVOKE` recognition — understand that roles receive object privileges such as `SELECT`, `INSERT`, `UPDATE`, and `DELETE`, and that application connections should not require superuser access
- [ ] Stored-procedure recognition — maintained databases can expose named server-side routines; writing complex procedural SQL is project-specific rather than a junior floor
- [ ] Trigger recognition — DML can automatically execute trigger logic that is not visible in the application statement, so inspect triggers when an insert, update, or delete has unexpected side effects

Rationale: One mental model: everything the route taught, applied to a database whose rules were written by someone else and have to be discovered before they can be trusted.

Handoff: This chapter closes the junior SQL journey by applying the complete route to unfamiliar real-world data under review and operational constraints.

## Unassigned existing notes

- none
