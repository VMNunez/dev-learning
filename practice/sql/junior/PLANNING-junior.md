# SQL Junior Exercise Plan

Plan status: current
Level: junior
Coverage: notes/sql/coverage/junior.md
Coverage SHA-256: 39aa0cfca364e978c00a6944700fac5d0c59e3db819e84b600993c04aaf2ebeb
Doctrine: practice/sql/PLANNING.md
Generated: 2026-08-28

**This file is the junior route.** The level-neutral half — the step loop, the done-condition formats,
the closing ritual, the branch rules, the revision mechanism, the quality gates, the invariants, the
closure condition and the out-of-scope fence — lives in the doctrine, `practice/sql/PLANNING.md`, and is
identical whichever level is being drilled. What is here is junior's own: its exercise files, its steps,
its progress table. The three sections below were §5, §6 and §8 of the doctrine until 2026-08-03; they
were moved here whole, renumbered §1, §2 and §3, and then reconciled against the recalibrated
149-bullet coverage file, and again on 2026-08-28 against its 151 bullets.

---

## §1 — Exercise files

Nothing is invented mid-session. This is the complete inventory, decided up front, **with the exercise
count each file ends at**.

### Exercise files — `practice/sql/junior/`

One file per topic, numbered in study order, inside the level's own directory (every level takes one;
no level is flat). "Done" counts are what exists on `main` today.

**Three counts, never conflated.**
- *Written* = the prompt generated the statement.
- *Answered* = the query is written under it. A file full of unanswered statements is worth nothing.
- *Scored* = a `review` run has graded it ≥ 80%. **Only this one advances a step.**
  `01-basics.sql` is the completed case — all 40 answers carry a `-- ✅ Corregido` marker, but only its
  20 first-pass exercises count toward Step 0's target.

**A file is generated on the day it is answered, not before** (2026-08-04). `02-execution-order-set-ops.sql`
sat for two weeks with 10 statements *written* and 0 *answered*, which is worth exactly nothing: a batch
that is not answered while its concepts are fresh is a batch that gets re-read cold later. It was
deleted rather than left standing, exactly as `03-joins.sql` was on 2026-07-22, and its row below stays
in the route with its target intact — the route declares the file, the file exists when the block that
answers it starts. Run `/sql-exercises` when you sit down to answer, not in advance.
- *Target* = the **first-pass** exercises the step needs. **Review batches (Moment 2b) are extra and
  uncounted** — a file legitimately grows past its target forever, and that is not drift.

`01-basics.sql` shows all four: 40 written and 40 answered, of which exactly 20 are a review batch, so
20 count as scored against its first-pass target of 20. Step 0's target of 30 is that 20 plus the 10
in `02-execution-order-set-ops.sql` — a step's target is the sum of its files', never one file's total.

| File | Step(s) | Written | Answered | Scored | First-pass target | Status |
|------|---------|---------|----------|--------|-------------------|--------|
| `01-basics.sql` | 0 | 40 *(20 review)* | 40 | **20** *(+20 review, uncounted)* | 20 | **closed** — all 40 answers graded correct on 2026-07-22 (40/40), of which the 20 first-pass ones are what the Scored column counts. Legacy schema (v1); no more exercises are added here |
| `02-execution-order-set-ops.sql` | 0 | 0 | 0 | 0 | 10 | deleted 2026-08-04 — to regenerate on the day it is answered |
| `03-joins.sql` | 1 | 0 | 0 | 0 | 22 | deleted 2026-07-22 — to regenerate |
| `04-aggregates.sql` | 2 | 0 | 0 | 0 | 14 | to create |
| `05-join-pitfalls.sql` | 3 | 0 | 0 | 0 | 12 | to create |
| `06-nulls.sql` | 4 | 0 | 0 | 0 | 12 | to create |
| `07-subqueries-ctes.sql` | 5 | 0 | 0 | 0 | 16 | to create |
| `08-dates-strings.sql` | 6 | 0 | 0 | 0 | 12 | to create |
| `09-window-functions.sql` | 7 | 0 | 0 | 0 | 12 | to create |
| `10-dml-transactions.sql` | 8 | 0 | 0 | 0 | 16 | to create |
| `11-schema-design.sql` | 9 | 0 | 0 | 0 | 15 | to create |
| `12-data-types-ddl.sql` | 10 | 0 | 0 | 0 | 16 | to create |
| `13-indexes.sql` | 11 | 0 | 0 | 0 | 12 | to create |
| `14-live-database.sql` | 12 | 0 | 0 | 0 | 12 | to create |
| `15-report-queries.sql` | 13 | 0 | 0 | 0 | 8 | to create |

> **One file, one schema (rule adopted 2026-07-22).** `01-basics.sql` keeps the old thin schema and is
> closed at 40 exercises; everything from `02-` on carries the canonical bookstore schema in its own
> SETUP block. **Three files legitimately do not** — `12-data-types-ddl.sql`, `14-live-database.sql`
> and `15-report-queries.sql` work against the **TimeTrack** model, and their done conditions name its
> tables (noted 2026-08-28, when the rule and the conditions were found to contradict each other on
> paper). The reason is the same in all three and is the point of those steps: Step 10's deliverable is
> a schema written from a blank editor precisely because `ddl-auto` has been generating TimeTrack's for
> him, Step 12 reads an inherited database rather than a seeded one, and the capstone writes the report
> queries TimeTrack needs. "One file, one schema" is a rule against *mixing* schemas inside one file,
> not a rule that every file uses the bookstore. Step 0's 30 first-pass exercises are therefore split 20 + 10 across two files. This is
> why the file numbers no longer match the step numbers — the mapping is this table, and the prompt's
> path table was updated to match.

**First-pass total when the track is done: 209 exercises across 15 files.** Review batches add on top
and are deliberately not budgeted. Track-wide today: **40 written**, all of them in `01-basics.sql`, 40 answered, 20 first-pass scored —
those 40/40/20 figures belong to that file alone and are not the route's totals. Every other file of
the route is still to generate.

**Two header formats exist, and that is deliberate.** The prompt handles both — do not "fix" either
one by hand.

*Legacy* — `01-basics.sql` only, written before the prompt existed. (the old `02-joins.sql`, now renumbered `03-joins.sql`, was the other one;
it was deleted and will be regenerated in the current format, so `01-basics.sql` is the last file that
will ever carry this.)
The answer goes directly under the description, and the correction marker goes at the end of the
header line:

```sql
-- #07 | LEFT JOIN — finding missing data ✅ Corregido 2026-07-22
-- List every author who has never had a book ordered.
SELECT ...
```

*Current* — everything the prompt generates from now on, including new batches appended to a legacy
file:

```sql
-- Exercise 41 [Standard]: LEFT JOIN — finding missing data ✅ Corregido 2026-07-22
-- List every author who has never had a book ordered.
-- Your answer:
SELECT ...
```

Appending to a legacy file leaves it **mixed**, and the prompt warns you and asks before doing it —
answer yes; a mixed file is expected and correctly handled. `review` mode reads both (legacy answers
are the SQL lines between one `-- #NN |` and the next), so the 40 answered exercises in `01-basics.sql`
will score normally. **Both formats carry the `-- ✅ Corregido` marker** — it is just a comment line,
so a graded legacy exercise is skipped as settled exactly like a current-format one (corrected
2026-07-22; this file used to claim otherwise, which cost `01-basics.sql` its markers on the first
review run).

### Revision files — `practice/sql/junior/R{n}-repaso.sql`

Uno por punto de repaso de esta ruta — la cadencia que los obliga es doctrina §8b, pero **cuáles
existen, qué abarcan y qué los dispara se deciden aquí** —, creado por su lote de Moment 2b
(`TOPIC = R2`) y **no antes**. No están en la tabla de arriba porque no pertenecen a ningún step: **no tienen target, no
cuentan para nada y nunca mueven un estado de §3** — por eso viven en archivo propio en vez de apilarse
dentro del archivo de un step, donde inflarían su cuenta y ensuciarían su nota.

| Archivo | Punto | Span (steps) | Dispara cuando | Estado |
|---------|-------|--------------|----------------|--------|
| `R1-repaso.sql` | R1 | 0–1 | cierra el Step 1 (`03-joins.sql` scored) | sin crear |
| `R2-repaso.sql` | R2 **hard checkpoint** | 2–4 | cierra el Step 4 (`06-nulls.sql` scored) | sin crear |
| `R3-repaso.sql` | R3 **hard checkpoint** | 5–7 | cierra el Step 7 (`09-window-functions.sql` scored) | sin crear |
| `R4-repaso.sql` | R4 | 8–10 | cierra el Step 10 — su done condition `pgAdmin:` pasa sobre `12-data-types-ddl.sql` (run 2 de DDL) | sin crear |
| `R5-repaso.sql` | R5 | 11–12 | cierra el Step 12 — su done condition `Terminal:` pasa sobre `14-live-database.sql` | sin crear |

**Los dos hard checkpoints son R2 y R3** — los que la doctrina §8b declara no saltables. R2 cierra el
núcleo de screening (Steps 1–4, lo que pregunta una ronda rápida) y R3 cierra el bloque que va justo
detrás (subqueries, fechas y ventanas). Ninguno espera a que un tema *parezca* oxidado, y ninguno se
salta porque el siguiente step tenga prisa. R5 abarca dos steps en vez de tres por la excepción de
doctrina §8b: el capstone (`15-report-queries.sql`) es él mismo la pasada de integración, así que no
lleva punto detrás.

Todos llevan el esquema canónico, incluido `R1`, cuyo span toca `01-basics.sql` (esquema v1): los
conceptos fallados se reexpresan contra el canónico en vez de resucitar un esquema cerrado.

**El foco de cada punto sale de las filas abiertas de `practice/sql/MISTAKES.md`** cuyo `Step` cae en el
span, ordenadas por `Times` descendente — nunca de una sensación. El mecanismo completo es doctrina
(§8b); lo que es de esta ruta son los cinco puntos de arriba, sus spans y sus triggers.

**The mistake log is one file for the whole track** — `practice/sql/MISTAKES.md`, at the root, shared by
every level. It is not listed among this level's files because it does not belong to a level.

**Note files are not listed here.** The SQL notes are their own track with their own prompt (doctrine §Z).

---

## §2 — The steps

The order is not the order of the coverage file. It follows how the concepts actually depend on each
other, and front-loads what a screening asks first.

**Step sizing:** a step is a handful of 12:30 sessions, never weeks. **No single generation run asks
for more than 12 exercises, and no step targets more than 22** — that ceiling is why schema design is
split across Steps 9 and 10 instead of being one 36-exercise block. Any step targeting more than 12 is
split into runs of 12 or fewer — Steps 1 (11 + 11), 2 (7 + 7), 5 (8 + 8), 8 (8 + 8), 9 (8 + 7) and
10 (8 + 8) — which also keeps each batch's difficulty split meaningful. In Steps 9 and 10 the split is
doubly motivated: each is over the per-run ceiling *and* covers two distinct coverage sections, so the
two runs fall on the section boundary rather than at an arbitrary halfway point.

**Step 0 is the one step above the 22 ceiling, at 30, and it is a legacy artefact rather than a
precedent.** Its first 20 exercises in `01-basics.sql` were hand-written before the exercise prompt
existed — they were never a generation run, so the 12-per-run ceiling was never breached — and the
schema change (§1, "one file, one schema") forced the remaining 10 into a second file instead of
letting the step be re-cut. Its only prompt run was `COUNT = 10`. No future step is planned above 22.

**A step never targets fewer exercises than it claims coverage bullets.** A `[x]` is written only by a
scored exercise that drilled that bullet, so a step with 15 bullets and 12 exercises can never be fully
checked — it would sit at 100% scored with three bullets it never touched. Steps 2, 9 and 10 were raised
to 14, 15 and 14 on 2026-08-03 for exactly that reason, when the recalibrated coverage file gave them
more scope than their inherited flat target of 12, and Step 10 again to 16 on 2026-08-28 when coverage
grew by two bullets that both landed on it. The rest of the route already satisfied the rule.

**The screening floor, if the clock runs out** (added 2026-08-28). 189 first-pass exercises remain
against an applications window that opens in August 2026, so the route states which part of itself is
not optional: **Steps 0–5, plus Step 8 (DML and transactions)** — the five topics `ROADMAP.md`'s
Stage-1 → Stage-2 switch gate names verbatim (joins · aggregation · subqueries/CTEs · NULL handling ·
DML basics). Everything after that is post-gate: `ROADMAP.md` says in as many words that window
functions, indexes and PostgreSQL specifics are *not worth delaying simulations for*. This changes no
step's position — it says which steps may not be traded away when the calendar bites.

Step 1 is the only step at the 22 ceiling, deliberately: JOINs is the single most-tested SQL topic at
junior level, and it absorbed the ten hand-written exercises the step used to start from. (A file's
*total* can exceed its step's target when several steps write into it, as `01-basics.sql` does.)

**Difficulty rises inside every step, and later steps integrate earlier ones.** Two rules, both
mechanical:
- Every batch spans intro → challenge; the exercise prompt's own difficulty split does this and is not
  overridden on a first-pass run (a review batch deliberately skips Intro — see doctrine Moment 2b).
- **From Step 5 on, at least two Challenge exercises must combine the step's topic with an earlier
  one** (one is enough from Step 4). This is not pasted: the prompt applies it from the topic alone, and
  the `**Reinforces:**` line of each step names which earlier step to combine with, so it is never a
  guess. Without it a late step is drilled in isolation and teaches nothing about composition — which is
  exactly what a screening tests, since no real question is ever one topic wide.

> **A note on `TOPIC` values.** The `TOPIC` in a Moment 2 config is the *prompt's* vocabulary, not a
> coverage section name. Two steps may pass the same `TOPIC` with different `FOCUS` values without
> either of them claiming the same coverage bullet — invariant 1 is about coverage bullets only.

> **Three coverage sections are split across two steps each, at bullet level.** `JOINs` and
> `Aggregates and grouping` each hand their diagnostic half to Step 3, because every pitfall on that
> list is an *aggregate over a broken join* and cannot be stated before Step 2; and
> `Filtering and NULL handling`, which the 2026-08-03 recalibration merged out of two older sections,
> hands its pattern-matching and precedence half to Step 0 and keeps its three-valued-logic half for
> Step 4. The split is by bullet, not by section name, and the `**Coverage bullets:**` list of each step
> is what makes it checkable.

---

### Step 0 — Querying basics ⏳ (20/30 first-pass scored, +20 review)

**Why here:** first, because every later step writes a `SELECT ... WHERE ... ORDER BY` around its own
topic — and because execution order is the mental model joins, aggregation and windows are all
explained against.
**Exercises:** dos archivos, uno por esquema.
- `practice/sql/junior/01-basics.sql` — **cerrado**: 40 respondidas (20 first-pass #01–#20 + 20 de repaso
  #21–#40), **40/40 correctas** el 2026-07-22. Esquema v1 (el viejo). No se le añade nada más.
- `practice/sql/junior/02-execution-order-set-ops.sql` — **sin crear**. Se generó el 2026-07-22 y se borró el
  2026-08-04 sin responder: se regenera con `/sql-exercises` el día que se conteste, no antes.
**Coverage:** `Querying basics`, `Ordering and pagination`, `Set operations`, `Filtering and NULL handling` (its four non-`NULL` bullets: alias visibility in `WHERE`, `LIKE`/`ILIKE`, `IN` vs `OR`, and `BETWEEN` ranges — every bullet about three-valued logic is Step 4)
**Reinforces:** — (first step)
**Moment 2 config:** `TOPIC = basics`, `COUNT = 10`  *(pendiente: el lote se regenera el día que se responda)*
**Focus:** SQL execution order and alias visibility, `CASE WHEN` in `SELECT`, `UNION`/`UNION ALL`/`INTERSECT`/`EXCEPT`, `NULLS FIRST`/`NULLS LAST` and non-deterministic `LIMIT`, stable ordering and `OFFSET` pagination

**Concepts:** covered across both batches — `SELECT`, `WHERE` (`AND`/`OR`/`IN`/`NOT IN`/`LIKE`/
`ILIKE`/`NOT LIKE`/`BETWEEN`/`NOT BETWEEN`/`IS NOT NULL`), `ORDER BY` (single, multiple, by alias),
`LIMIT`/`OFFSET`/`FETCH`, `DISTINCT`, `DISTINCT ON`, expressions and aliases, concatenation, `LENGTH()`.
Those last two appeared incidentally in `01-basics.sql` as expression practice; their coverage bullets
(`||` string concatenation, `LENGTH`) belong to Step 6 and are checked there, not here.

Still missing before this step closes — the ten remaining exercises target exactly these:
- SQL execution order (`FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`) and where an
  alias is visible — the mental model every later step leans on
- `CASE WHEN` in `SELECT`
- `UNION` vs `UNION ALL`, `INTERSECT`, `EXCEPT`
- `NULLS FIRST` / `NULLS LAST`, and why `LIMIT` without `ORDER BY` is non-deterministic
- Keyset pagination vs deep `OFFSET`

**Moment 2 ya está hecho:** el run se ejecutó el 2026-07-22 y las 10 sentencias están escritas. El
config de arriba se conserva porque el prompt lo lee para derivar `COUNT` y `Focus`, no porque haya que
volver a ejecutarlo — el paso está en Moment 3, y el prompt avisa (guard "target already met") si se
lanza otro `practice` sobre este archivo.

**Coverage bullets:**

- [ ] `SELECT`, `FROM`, and column aliases — `SELECT` defines the result expressions, `FROM` supplies rows, and `AS` names a result expression without changing the source column
- [ ] Qualified column references — use `alias.column` when more than one input exposes the same name and whenever qualification makes a multi-table query unambiguous
- [ ] SQL execution order — `FROM + JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`; the foundation for understanding why aliases work in `ORDER BY` but not in `WHERE` or `HAVING`
- [ ] `WHERE` operators and precedence — comparisons, `NOT`, `AND`, and `OR` build row predicates; `NOT` binds before `AND`, and `AND` before `OR`, so use parentheses whenever the intended grouping is not immediately obvious
- [ ] Computed expressions — arithmetic and string expressions can produce derived result columns; give them aliases and account for operand types such as integer division
- [ ] `SELECT *` vs named columns — specify the required columns in application code; `SELECT *` can fetch unnecessary data and makes the result shape change whenever the schema changes
- [ ] `CASE WHEN` in `SELECT` — derive one output value per row from ordered conditions
- [ ] `SELECT DISTINCT` — removes duplicate rows from the result; PostgreSQL treats `NULL` as a duplicate and keeps only one; use to explore unique values in a column
- [ ] `DISTINCT ON` — PostgreSQL-specific; keeps one row per group while returning multiple columns; the column inside `DISTINCT ON (...)` must be the leftmost column in `ORDER BY`
- [ ] SQL string literals vs quoted identifiers — single quotes delimit values, while double quotes delimit case-sensitive or otherwise special identifiers; unquoted PostgreSQL identifiers fold to lowercase
- [ ] `ORDER BY` with `NULLS FIRST` / `NULLS LAST` — PostgreSQL treats `NULL` as the largest value by default; `ASC` puts `NULL` last, `DESC` puts `NULL` first; override with `NULLS FIRST` or `NULLS LAST`
- [ ] No guaranteed row order without `ORDER BY` — a result set is an unordered set, so `GROUP BY`, an index scan, or insertion order can make rows look sorted while the engine stays free to return them differently on the next run; an order a caller depends on has to be stated, never inherited from how the rows happened to be produced ✅ 07-timetrack
- [ ] Multi-column sorting — PostgreSQL resolves `ORDER BY` keys from left to right, so later keys break ties from earlier ones and each key can choose `ASC` or `DESC` ✅ 07-timetrack
- [ ] `LIMIT` always with `ORDER BY` — without `ORDER BY`, `LIMIT` returns an arbitrary set of rows that can change between queries; always pair them
- [ ] Stable ordering — pagination needs a deterministic tie-breaker such as the primary key after a non-unique sort column; otherwise equal values can move between pages ✅ 07-timetrack
- [ ] `OFFSET` for pagination — `LIMIT 10 OFFSET 20` skips 20 rows and returns the next 10; formula: `OFFSET = (page − 1) × page_size`
- [ ] `FETCH FIRST n ROWS ONLY` — the SQL-standard row-limiting clause, written as `OFFSET n ROWS FETCH NEXT m ROWS ONLY`; PostgreSQL accepts both it and `LIMIT`, but Oracle and other engines a consultancy account may run accept only the standard form
- [ ] `UNION` vs `UNION ALL` — remove duplicates across compatible result sets or retain every row and avoid unnecessary duplicate elimination
- [ ] `UNION` column rules — align column counts and compatible types across branches while taking result column names from the first query
- [ ] `UNION` vs `JOIN` — a union stacks rows from two result sets that share a shape, while a join widens each row with columns from a related table; "combine two tables" is ambiguous and picking the wrong one produces a result of the wrong shape, not merely the wrong size
- [ ] `INTERSECT` and `EXCEPT` — `INTERSECT` keeps rows present in both results and `EXCEPT` keeps rows from the first result that are absent from the second; both remove duplicates unless `ALL` is requested
- [ ] `WHERE` cannot use aliases — `WHERE` runs before `SELECT`, so column aliases do not exist yet; you must repeat the expression rather than use the alias
- [ ] `LIKE` vs `ILIKE` — `LIKE` is case-sensitive; `ILIKE` is PostgreSQL-specific and case-insensitive; `%` matches any sequence of characters, `_` matches exactly one character
- [ ] `IN` vs multiple `OR` — `IN (list)` is cleaner and optimized internally by PostgreSQL; preferred when checking against more than two values
- [ ] `BETWEEN` with timestamps — both endpoints are inclusive, so a date-only upper bound silently excludes later times on that date; use a half-open range such as `created_at >= start AND created_at < next_day` to preserve index use and include the whole period

**Pending additions:** none

**Done:** `Review: sql-grade scores ≥ 80% on 02-execution-order-set-ops.sql`

---

### Step 1 — JOINs (0 scored / 22 target)

**Why here:** it needs only Step 0's clause skeleton, and it is the single most-tested SQL topic at
junior level — in a real screening `GROUP BY` almost always sits on top of a join, so joins come
before aggregation, not after.
**Exercises:** `practice/sql/junior/03-joins.sql` — 22, generated from scratch in **two runs of 11**. The
original ten hand-written statements were deleted on 2026-07-22: they were never answered, and they
carried the old thin schema, so regenerating gets the canonical one and the current exercise format
(`-- Your answer:` + `-- ✅ Corregido` markers) instead of perpetuating the legacy format into a
second file.
**Coverage:** `JOINs` (every bullet except `ON` vs `WHERE` with an outer join, which is Step 3)
**Reinforces:** Step 0 — execution order (`FROM + JOIN` runs first, which is why the join happens before `WHERE`)
**Moment 2 config — run 1** *(archivo nuevo: genera el setup block canónico)* — **rango `#01–#11`**:
`TOPIC = joins`, `COUNT = 11`
**Focus:** INNER JOIN across two and three tables, table aliases, LEFT JOIN keeping unmatched rows,
LEFT JOIN + IS NULL as an anti-join.
**Moment 2 config — run 2** *(append)* — **rango `#12–#22`**: `TOPIC = joins`, `COUNT = 11`
**Focus:** RIGHT JOIN, FULL OUTER JOIN, self join, CROSS JOIN, USING vs NATURAL JOIN, JOIN cardinality
and predicting row multiplication.

**Concepts:** Run 1 builds the foundation — `INNER JOIN` (two tables, named columns, aliases, three tables, combined
with `WHERE` / `ORDER BY` / `LIMIT`) and `LEFT JOIN` (keeping unmatched rows, and the `IS NULL`
anti-join). Run 2 covers the rest: `RIGHT JOIN` and why it is rewritable as a `LEFT`,
`FULL OUTER JOIN`, self join, `CROSS JOIN` and the missing join condition as its accidental version,
`USING` vs `NATURAL JOIN` and why `NATURAL` is banned in real codebases, and predicting join
cardinality before writing the query.

> **`EXISTS` / `NOT EXISTS` are deliberately not drilled here** (removed 2026-08-28). They read as
> join vocabulary, but they are correlated subqueries: their bullets belong to Step 5 (`IN` vs
> `EXISTS`, `Correlated subquery`) and Step 4 (`NOT IN` with `NULL`, which prescribes `NOT EXISTS`).
> The prompt greps this step's `**Focus:**` line, so leaving them there would have generated
> subquery exercises four steps before the syntax is taught. The anti-join itself is still drilled in
> run 1, through the `LEFT JOIN ... IS NULL` bullet that is genuinely this step's.

> **Two runs, un solo `TOPIC`.** Es el único step así, y por eso cada run declara su **rango de
> ejercicios**: es el único dato en disco con el que el prompt puede saber cuál de los dos le estás
> pidiendo. El prompt elige el primer rango que aún no esté escrito entero.

Nada más que añadir a la pegada: el archivo ya no existe, así que el run 1 escribe el esquema canónico
él mismo y no hay prompt de esquema legacy que contestar.

**Coverage bullets:**

- [ ] `INNER JOIN` — returns only rows where both tables have a match; the most common JOIN; `JOIN` without a keyword defaults to `INNER JOIN`
- [ ] `LEFT JOIN` — returns all rows from the left table with `NULL` on the right when there is no match; used for "show all users even if they have no time entries"
- [ ] `INNER JOIN` vs `LEFT JOIN` — `INNER` excludes rows with no match on either side; `LEFT` keeps all left rows and fills the right side with `NULL`; choosing the wrong one is the most common JOIN mistake in junior code
- [ ] Finding missing data with `LEFT JOIN` — `WHERE right_table.id IS NULL` after a `LEFT JOIN` returns every left row with no match on the right; the standard pattern for "which projects have no time entries?"
- [ ] `RIGHT JOIN` — mirror a `LEFT JOIN` and recognise that swapping table order can express the same outer-join relationship more conventionally
- [ ] `FULL OUTER JOIN` — returns all rows from both sides with `NULL` where there is no match; used to find unmatched rows on either side at once
- [ ] Multiple JOINs — chain relationships through several tables while keeping every join condition tied to the intended key path
- [ ] JOIN cardinality and row multiplication — predict whether each relationship is one-to-one, one-to-many, or many-to-many before joining; apparent duplicates usually mean the join produced several legitimate matches, so `DISTINCT` must not be used as a blind repair
- [ ] Self JOIN — assign separate aliases to one table so rows from that table can be related or compared with each other
- [ ] `CROSS JOIN` — produces every combination of the two inputs; use it only when a Cartesian product is intentional and recognise a missing join condition as the accidental version
- [ ] Table aliases in JOINs — `FROM books b JOIN authors a ON b.author_id = a.id`; makes queries readable and is required when two joined tables share a column name

**Pending additions:** none

**Done:** `Review: sql-grade scores ≥ 80% on 03-joins.sql`

> Revision point **R1** (doctrine §8b) fires here, and it is the one with the most behind it: 52
> exercises across `01-basics`, `02-execution-order-set-ops` and `03-joins`, the largest un-revised run
> in the track. It is also the first point at which `MISTAKES.md` has rows from more than one file, so it
> is the first time the focus mechanism has anything to choose between.

---

### Step 2 — Aggregates and grouping (0 scored / 14 target)

**Why here:** it needs the join from Step 1, because the surface a screening asks you to aggregate is
almost never a single table — and with joins + aggregation you can already answer the second question
of a technical test.
**Exercises:** `practice/sql/junior/04-aggregates.sql` — 14 (two runs of 7)
**Coverage:** `Aggregates and grouping` (the pure-aggregation half — the three bullets about aggregating over a `LEFT JOIN` are Step 3)
**Reinforces:** Step 1 — a join is the surface `GROUP BY` almost always sits on top of
**Moment 2 config — run 1:** `TOPIC = group-by`, `COUNT = 7` — **rango `#01–#07`**
**Focus:** none — the counting and `NULL` half of the section
**Moment 2 config — run 2:** `TOPIC = group-by`, `COUNT = 7` *(append al mismo archivo)* — **rango `#08–#14`**
**Focus:** `HAVING` vs `WHERE`, conditional aggregation with `CASE WHEN` and `FILTER (WHERE ...)`, `STRING_AGG`

**Concepts:** `COUNT(*)` vs `COUNT(column)`, `SUM`/`AVG`/`MIN`/`MAX` ignoring `NULL`, `SUM`
over zero rows returning `NULL`, the `GROUP BY` rule, grouping by an id rather than a display name,
`GROUP BY` with `NULL`, `GROUP BY` vs `SELECT DISTINCT`, `HAVING` vs `WHERE`, conditional aggregation
with `CASE WHEN` and `FILTER (WHERE ...)`, `STRING_AGG`.

**Coverage bullets:**

- [ ] `COUNT(*)` vs `COUNT(column)` — count all input rows or only rows where the selected expression is non-`NULL`
- [ ] `SUM` — add the known values of a numeric column across a group, ignoring `NULL` instead of treating it as zero ✅ 07-timetrack
- [ ] `AVG` — divide the sum of known values by the count of known values, so a `NULL` lowers neither side and a missing value is never averaged in as a zero
- [ ] `MIN` and `MAX` — return the smallest or largest non-`NULL` input and work with ordered types such as numbers, text, and dates
- [ ] Aggregate results on empty input — `COUNT` returns `0`, while `SUM`, `AVG`, `MIN`, and `MAX` return `NULL` when no input rows remain; use `COALESCE` only when the result contract truly requires a default
- [ ] `GROUP BY` rule — selected expressions normally need to be grouped or aggregated; PostgreSQL also permits columns it can prove functionally dependent on a grouped primary key, but explicit grouping is clearer in portable junior SQL ✅ 07-timetrack
- [ ] `GROUP BY` on an identifying column, not just a display name — grouping by a name alone silently merges two distinct rows that happen to share that name; group by the id (and select the name alongside it) so an aggregate stays correct even when values collide ✅ 07-timetrack
- [ ] `GROUP BY` and `NULL` — grouping collects every `NULL` into one single group rather than discarding those rows, which is the opposite of what `WHERE` does with an unknown predicate; a report can therefore grow an unlabelled category that is easy to misread as a bug
- [ ] `GROUP BY` vs `SELECT DISTINCT` — both collapse repeated values, so they agree whenever nothing is aggregated; reach for `GROUP BY` when the query needs a per-group calculation, and treat `DISTINCT` as deduplication of an already-correct result
- [ ] `HAVING` — filter grouped results after aggregation while `WHERE` filters input rows before grouping
- [ ] Conditional aggregation with `CASE WHEN` — make only rows satisfying a condition contribute to an aggregate without discarding other groups
- [ ] `CASE WHEN` in `SELECT` vs inside an aggregate — in `SELECT` it produces a new column per row; inside `SUM(CASE WHEN ...)` it filters which rows contribute to the aggregate; same syntax, very different behavior
- [ ] `FILTER (WHERE ...)` — PostgreSQL shorthand for conditional aggregation: `COUNT(*) FILTER (WHERE status = 'approved')`; same result as `CASE WHEN` but cleaner for simple conditions
- [ ] `STRING_AGG(column, separator)` — concatenates values from several rows into one PostgreSQL result per group; the order is arbitrary unless an `ORDER BY` is written inside the aggregate call itself

**Pending additions:** none

**Done:** `Review: sql-grade scores ≥ 80% on 04-aggregates.sql`

---

### Step 3 — JOIN pitfalls and row multiplication (0 scored / 12 target)

**Why here:** every pitfall on its list is an *aggregate over a broken join*, so it cannot even be
stated before Step 2 — and it is what separates "knows the syntax" from "has debugged a wrong report",
which is the follow-up question after a join answer lands.
**Exercises:** `practice/sql/junior/05-join-pitfalls.sql` — 12
**Coverage:** `JOINs` (`ON` vs `WHERE` with an outer join) and `Aggregates and grouping` (the three bullets that only exist because a join came first)
**Reinforces:** Steps 1 + 2 — every pitfall here is an **aggregate over a broken join**
**Moment 2 config:** `TOPIC = join-pitfalls`, `COUNT = 12`
**Focus:** none — the whole topic

**Concepts:** condition in `ON` vs in `WHERE`, the `WHERE` filter that silently turns a `LEFT JOIN` into an
`INNER JOIN`, fan-out inflating `SUM`, `COUNT(*)` returning 1 instead of 0 after a `LEFT JOIN`,
`COUNT(DISTINCT)` as the repair for a legitimate multiplication, `GROUP BY` after a `LEFT JOIN`,
pre-aggregating in a CTE, accidental cross joins, `NULL` in a join key, deliberate `CROSS JOIN`.

**Why it sits after aggregation, not next to joins.** Every item on that list is an aggregate: fan-out
is a wrong `SUM`, the `COUNT(*)`/`COUNT(column)` trap is a wrong count, the CTE fix is a pre-aggregation.
None of them can even be *stated* before `SUM` and `GROUP BY` are fluent — which is why this is its own
step and its own file rather than the back half of Step 1.

It stays a separate step from Step 2 on purpose: these are what separate "knows the syntax" from "has
debugged a wrong report", and burying them inside the aggregation step loses them.

**Coverage bullets:**

- [ ] `ON` vs `WHERE` with an outer join — a condition in `ON` controls which right-side rows match while preserving unmatched left rows; moving that condition to `WHERE` can reject the `NULL`-extended rows and accidentally turn a `LEFT JOIN` into an inner join
- [ ] `COUNT(*)` vs `COUNT(column)` after a `LEFT JOIN` — an unmatched left row survives as one `NULL`-extended row, so `COUNT(*)` reports `1` for a group that actually has nothing; count a non-nullable column from the right table to get the `0` the report means
- [ ] `COUNT(DISTINCT column)` — counts how many different non-`NULL` values a group holds rather than how many rows carry them; the correct repair when a legitimate join multiplication has inflated a plain `COUNT`
- [ ] `GROUP BY` with `LEFT JOIN` — when joining before grouping, include all non-aggregated columns from the joined table in `GROUP BY`; use `LEFT JOIN` so groups with zero matches still appear with `COUNT = 0`

**Pending additions:** none

**Done:** `Review: sql-grade scores ≥ 80% on 05-join-pitfalls.sql`

---

### Step 4 — NULL and three-valued logic (0 scored / 12 target)

**Why here:** Steps 1–3 have already produced `NULL`s by hand (`LEFT JOIN`, `AVG` skipping them,
`COUNT(*)` counting them), so this step explains a mechanism he has already been bitten by instead of
describing one he has not met — and `NOT IN` with a `NULL` is a standard screening trap.
**Exercises:** `practice/sql/junior/06-nulls.sql` — 12
**Coverage:** `Filtering and NULL handling` (the three-valued-logic half — the pattern-matching half is Step 0)
**Reinforces:** Steps 1–3 — `LEFT JOIN` producing nulls, `AVG` skipping them, `COUNT(*)` counting them
**Moment 2 config:** `TOPIC = nulls`, `COUNT = 12`
**Focus:** none — the whole topic

**Concepts:** `NULL = NULL`, `IS NULL` vs `= NULL`, `AND`/`OR` truth tables, a predicate and its own
negation both dropping the same row, `NOT IN` with a `NULL` in the subquery, `NOT EXISTS` vs `NOT IN`,
`COALESCE`, `NULLIF` and division by zero.

> `IS DISTINCT FROM` and `NULL` in a `UNIQUE` constraint were dropped from this list on 2026-08-28.
> The first has no coverage bullet at any step, so drilling it would invent scope; the second is Step
> 9's bullet, and Step 9 already reaches back here through its `**Reinforces:**` line.

**Coverage bullets:**

- [ ] `WHERE` keeps only `TRUE` — a predicate evaluates to true, false, or unknown, and only true-rows survive; unknown is discarded exactly like false, which is why a condition and its own negation can both drop the same `NULL` row and the two result sets fail to add up to the table
- [ ] `IS NULL` vs `= NULL` — test absence with `IS NULL` or `IS NOT NULL` because ordinary equality with `NULL` evaluates to unknown
- [ ] `AND` / `OR` with `NULL` — `true AND NULL` returns `NULL`, but `false AND NULL` returns `false`; `false OR NULL` returns `NULL`, but `true OR NULL` returns `true`; a `WHERE` filter without an `IS NULL` check can silently exclude rows
- [ ] `COALESCE(value, fallback)` — returns the first non-`NULL` value; use it when the query contract deliberately substitutes a default such as `0` or `'Unknown'`, without confusing missing data with a real value
- [ ] `NULLIF(a, b)` — returns `NULL` if `a = b`, otherwise returns `a`; most common use: avoid division by zero with `SUM(...) / NULLIF(COUNT(*), 0)`
- [ ] `NOT IN` with `NULL` — if the subquery or list contains `NULL`, comparisons can become `UNKNOWN` and `NOT IN` may return no rows; use `NOT EXISTS` with a correlated equality when nullability is possible

**Pending additions:** none

**Done:** `Review: sql-grade scores ≥ 80% on 06-nulls.sql`

> **This closes the screening core.** Steps 1–4 are what a quickfire round asks — which is why
> revision point **R2** (doctrine §8b) fires here, before anything is built on top of it.

---

### Step 5 — Subqueries, CTEs, and views (0 scored / 16 target)

**Why here:** it needs Step 3's pre-aggregation fix, which *is* a subquery in `FROM` — and it is the
last of the four *query-side* topics `ROADMAP.md` calls test-relevant (joins · aggregation ·
NULL handling · subqueries/CTEs), so from here on a timed test can ask a whole realistic query.
The fifth item on that list, **DML basics, is Step 8**, so the Stage-1 → Stage-2 switch gate is not
fully open until Step 8 closes — Step 5 opens the query half of it, not the whole gate.
**Exercises:** `practice/sql/junior/07-subqueries-ctes.sql` — 16 (two runs of 8)
**Coverage:** `Subqueries, CTEs, and views`
**Reinforces:** Step 3 — a subquery in `FROM` is how you filter on an aggregate `WHERE` cannot see
**Moment 2 config — run 1:** `TOPIC = subqueries`, `COUNT = 8`
**Focus:** none — the whole subquery half of the section
**Moment 2 config — run 2:** `TOPIC = ctes`, `COUNT = 8` *(append al mismo archivo)*
**Focus:** none — the whole CTE and view half of the section

**Concepts:** subquery in `WHERE` / `FROM` / `SELECT`, `IN` vs `EXISTS`, subquery vs `JOIN`, correlated subqueries
and why they do not scale, `WITH` and chained CTEs, `CREATE VIEW`.

**Coverage bullets:**

- [ ] Subquery in `WHERE` — `WHERE price > (SELECT AVG(price) FROM books)` — you cannot use `AVG` directly in `WHERE`; the subquery runs first and its result is used by the outer query
- [ ] Subquery in `FROM` (derived table) — a query used as a table; must have an alias; used to filter on an aggregated result because `WHERE` cannot use aggregate functions
- [ ] Scalar subquery in `SELECT` — must return at most one row and one column; an uncorrelated scalar subquery can be evaluated once, while a correlated one may require work for each outer row
- [ ] `IN` vs `EXISTS` — choose from result semantics and null behaviour rather than a universal speed rule: `IN` compares with a set of values, while correlated `EXISTS` asks whether at least one matching row exists; PostgreSQL may optimise either into a similar plan
- [ ] Correlated subquery — references a column from the outer row and expresses a per-row relationship; compare it with `EXISTS`, a join, or pre-aggregation when the repeated relationship is hard to read or slow
- [ ] Subquery vs `JOIN` — choose the form that expresses the required result cardinality clearly; a join can multiply rows while `EXISTS` only tests presence, and PostgreSQL can often optimise equivalent formulations similarly
- [ ] `WITH` (CTE) — name an intermediate query for reuse and readability without assuming it is inherently faster than an inline subquery
- [ ] Multiple CTEs — chain CTEs with commas; each CTE can reference the ones defined before it; used to build complex queries step by step without nesting
- [ ] `CREATE VIEW` — saves a query in the database with a name; queried like a table but runs the underlying query live on every access; used to avoid repeating complex JOINs across different parts of an application

**Pending additions:** none

**Done:** `Review: sql-grade scores ≥ 80% on 07-subqueries-ctes.sql`

---

### Step 6 — Date and string functions (0 scored / 12 target)

**Why here:** its scalar half (`||`, `TRIM`, `SUBSTRING`, `::`) is drillable from Step 0 and is not what
places it — what places it is the half that earns the step: `GROUP BY DATE_TRUNC('month', ...)` is
grouping by an expression, and cannot be written before Step 2. It comes before window functions and
the capstone because a live exercise stalls on a raw `TIMESTAMP` long before it stalls on `ROW_NUMBER`.
**Exercises:** `practice/sql/junior/08-dates-strings.sql` — 12
**Coverage:** `PostgreSQL specifics`, `Common string functions`
**Reinforces:** Step 2 — `GROUP BY DATE_TRUNC('month', ...)` is `GROUP BY` on an expression instead of a column
**Moment 2 config:** `TOPIC = dates-strings`, `COUNT = 12`
**Focus:** none — the whole topic

**Concepts:** `DATE_TRUNC` and grouping by month, `EXTRACT`, `INTERVAL` and date arithmetic,
`NOW()` vs `CURRENT_DATE`, `::` casting a `TIMESTAMP` to a `DATE`, standard SQL vs vendor extensions,
`||` concatenation, `SUBSTRING`, `TRIM`, `UPPER`/`LOWER`, `REPLACE`, `LENGTH`.

**This step owns the whole `PostgreSQL specifics` coverage section** — Step 12 uses the same prompt
`TOPIC` family but claims different coverage bullets.

**Coverage bullets:**

- [ ] Standard SQL vs vendor extensions — prefer portable constructs for transferable query logic and use PostgreSQL-specific syntax deliberately when its benefit justifies the coupling
- [ ] `::` cast operator — `created_at::date` converts a timestamp to a date; `'5'::int` converts a string to an integer; shorter PostgreSQL syntax for standard SQL `CAST(value AS type)`; used constantly in `WHERE` and `JOIN` conditions involving dates
- [ ] `DATE_TRUNC('month', date)` — truncates a timestamp to the start of the month; used to `GROUP BY` month in reports; `DATE_TRUNC('year', ...)` works the same way for yearly grouping
- [ ] `EXTRACT` — returns one date/time field such as year, month, or hour for filtering or reporting; use it deliberately because applying a function to an indexed column can prevent a simple index condition
- [ ] `NOW()` vs `CURRENT_DATE` — both are fixed at the start of the current transaction rather than re-read per statement, so neither advances inside a long transaction; the difference is the returned type, a full timestamp against a date with no time component
- [ ] `INTERVAL` — `NOW() - INTERVAL '30 days'` filters recent data; used in `WHERE` clauses and CTEs for relative date ranges; `INTERVAL '1 month'` works with months and years
- [ ] `||` string concatenation — combine text expressions into one output value while accounting for `NULL` propagation
- [ ] `LOWER` and `UPPER` — normalise case for display or comparison while recognising that applying them to a column can affect ordinary index use
- [ ] `TRIM` — removes leading and trailing characters, whitespace by default, without changing whitespace inside the value
- [ ] `LENGTH` — counts characters in text rather than bytes, which matters for non-ASCII data
- [ ] `SUBSTRING` — extract a positional part of a string for query shaping rather than to repair badly modelled data
- [ ] `REPLACE` — substitute every occurrence of matching text within a value, without regard to word boundaries

**Pending additions:** none

**Done:** `Review: sql-grade scores ≥ 80% on 08-dates-strings.sql`

---

### Step 7 — Window functions (0 scored / 12 target)

**Why here:** a window is only explainable against what `GROUP BY` collapses (Step 2) and against
execution order (Step 0) — and it is asked *after* the core in a screening, as the "and can you also…"
question, never as the opener.
**Exercises:** `practice/sql/junior/09-window-functions.sql` — 12
**Coverage:** `Window functions`
**Reinforces:** Step 2 — a window keeps the rows `GROUP BY` collapses; Step 0 — `DISTINCT ON` and execution order explain why a window cannot sit in `WHERE`
**Moment 2 config:** `TOPIC = window-functions`, `COUNT = 12`
**Focus:** none — the whole topic

**Concepts:** `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`/`LEAD`, `SUM() OVER (PARTITION BY ...)`, why a window
function cannot appear in `WHERE`, window vs `GROUP BY`, `DISTINCT ON` vs `ROW_NUMBER() = 1`, the
default frame, "the second highest value".

**Coverage bullets:**

- [ ] `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` — assign a deterministic sequence within each partition, such as selecting one latest row per group in an outer query
- [ ] `RANK()` vs `ROW_NUMBER()` — `RANK()` gives tied rows the same number and skips the next (1, 1, 3); `ROW_NUMBER()` always gives a unique number regardless of ties (1, 2, 3); when you need exactly one row per group, use `ROW_NUMBER()`
- [ ] Aggregate result vs window result — `GROUP BY` collapses each group into one row, while an aggregate with `OVER` preserves every input row and adds a value calculated over its window
- [ ] `DISTINCT ON` vs `ROW_NUMBER() = 1` — both answer "one latest row per group"; `DISTINCT ON` is shorter but PostgreSQL-only and ties its result to `ORDER BY`, while the window form is portable and can keep the rank as a column or take more than one row per group

**Pending additions:** none

**Done:** `Review: sql-grade scores ≥ 80% on 09-window-functions.sql`

> Revision point **R3** (doctrine §8b) fires here: subqueries, dates and windows now sit on a core that
> has had months to decay, and the mistake log is the only honest record of what slipped.

---

### Step 8 — DML and transactions (0 scored / 16 target)

**Why here:** finding duplicates needs Step 2's `HAVING COUNT(*) > 1` and deleting them keeping one
needs Step 7's `ROW_NUMBER()`, so it cannot precede either — and it is where SQL meets the Spring Boot
`@Transactional` the interviewer will actually ask about.
**Exercises:** `practice/sql/junior/10-dml-transactions.sql` — 16 (two runs of 8)
**Coverage:** `DML — modifying data`, `Transactions`
**Reinforces:** Step 2 — `GROUP BY ... HAVING COUNT(*) > 1` is the duplicate-finding query; Step 7 — `ROW_NUMBER()` is how you delete duplicates keeping one
**Moment 2 config — run 1:** `TOPIC = dml`, `COUNT = 8`
**Focus:** none — the whole `DML — modifying data` section
**Moment 2 config — run 2:** `TOPIC = transactions`, `COUNT = 8` *(append al mismo archivo)*
**Focus:** none — the whole `Transactions` section

**Concepts:** `INSERT` (single, multi-row, `INSERT ... SELECT`, `RETURNING`), insert order with foreign keys,
`UPDATE`/`DELETE` and the missing-`WHERE` catastrophe, `DELETE` vs `TRUNCATE`, `ON CONFLICT`
upsert, finding and deleting duplicates. Then `BEGIN`/`COMMIT`/`ROLLBACK`, autocommit, ACID,
`SAVEPOINT`, the aborted-transaction state, isolation levels, and the link to `@Transactional` in
Spring Boot.

One step because in practice you learn transactions by wrapping a destructive `UPDATE` in one.

**Coverage bullets:**

- [ ] `INSERT INTO ... VALUES (...)` — adds rows to a table; skip `id` (generated by `SERIAL`), columns with `DEFAULT` values, and nullable columns you want to leave empty ✅ 07-timetrack
- [ ] Multi-row `INSERT` — supply several value tuples in one statement so the rows are inserted in a single round trip and a single implicit transaction
- [ ] `INSERT ... SELECT` — populate a table from the result of a query, matching target columns to result columns by position and compatible type
- [ ] `RETURNING` — obtain generated or changed values from a PostgreSQL data-modification statement without a second query
- [ ] `UPDATE ... SET ... WHERE` — always include `WHERE` or every row in the table is updated; one of the most common catastrophic mistakes in junior code
- [ ] `DELETE FROM ... WHERE` — always include `WHERE` or every row is deleted; always verify the affected rows with a matching `SELECT` before running `DELETE` on production data
- [ ] `DELETE` vs `TRUNCATE` — `DELETE` supports `WHERE` and processes matching rows; `TRUNCATE` removes all rows with a stronger table lock and resets sequences only when `RESTART IDENTITY` is requested; choose deliberately rather than treating either as universally safe
- [ ] `ON CONFLICT` (upsert) — `INSERT ... ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name` — atomic insert-or-update; avoids the race condition of a `SELECT` + `INSERT` pair; `EXCLUDED` refers to the values that would have been inserted
- [ ] `BEGIN` / `COMMIT` / `ROLLBACK` — groups multiple statements so they either all succeed or all fail; `ROLLBACK` undoes everything since `BEGIN`; the SQL-level mechanism that `@Transactional` wraps in Spring Boot
- [ ] Autocommit and explicit transaction boundaries — outside an explicit transaction, clients commonly commit each successful statement separately, so `BEGIN` or the framework transaction boundary is required when several statements must succeed or fail together
- [ ] ACID properties — Atomicity is all-or-nothing, Consistency preserves declared invariants from one valid state to another, Isolation controls interference between concurrent transactions, and Durability preserves committed work
- [ ] `SAVEPOINT` — a named checkpoint inside a transaction; `ROLLBACK TO name` undoes only the work since that checkpoint without ending the transaction
- [ ] Transaction failure state — after a PostgreSQL statement errors inside a transaction, later statements are rejected until `ROLLBACK` or `ROLLBACK TO SAVEPOINT` clears the failed state
- [ ] Transaction isolation — controls which concurrent changes a transaction can observe; recognise PostgreSQL `READ COMMITTED` as the default and choose stronger guarantees only for a concrete consistency need

**Pending additions:** none

**Done:** `Review: sql-grade scores ≥ 80% on 10-dml-transactions.sql`

---

### Step 9 — Schema design: constraints and modelling (0 scored / 15 target)

**Why here:** a constraint is only meaningful once you have written the `UPDATE` it blocks (Step 8)
and met the `NULL` it treats specially (Step 4) — and it is late because a screening asks you to
*query* first and to *model* second, usually only in the second interview.
**Exercises:** `practice/sql/junior/11-schema-design.sql` — 15 (runs of 8 and 7)
**Coverage:** `Schema design`
**Reinforces:** Step 4 — `NULL` in a `UNIQUE` constraint and in a `CHECK`; Step 8 — a constraint violation is the race an application check cannot win, and `ON CONFLICT` is how you handle its verdict
**Moment 2 config — run 1:** `TOPIC = schema-design`, `COUNT = 8`
**Focus:** primary and foreign keys, `ON DELETE` / `ON UPDATE`, `NOT NULL`, `UNIQUE`, composite uniqueness, `CHECK` with `NULL`, constraint vs application-side check
**Moment 2 config — run 2:** `TOPIC = normalization`, `COUNT = 7` *(append al mismo archivo)*
**Focus:** one-to-many and many-to-many modelling, natural vs surrogate keys, normalization and the anomalies it prevents, reading a relational schema

**Concepts:** primary and foreign keys, primary key vs `UNIQUE`, which side of a 1:N carries the FK,
composite keys on a junction table, `ON DELETE` and `ON UPDATE` behaviour, `NOT NULL` / `UNIQUE` /
`CHECK`, why a database constraint is not made redundant by Bean Validation, natural vs surrogate keys,
reading a schema's grain, and storing each fact once so an update cannot leave two copies disagreeing.

> **Formal normal forms are deliberately not drilled here.** The `Normalization and data anomalies`
> bullet ends *"formal normal-form analysis belongs to middle"*, so this step drills the anomaly the
> rule prevents rather than 1NF/2NF/3NF by name. Spanish screenings do ask *"¿qué es la tercera forma
> normal?"* verbatim — that is a retrieval question for the interview-prep track, and turning it into an
> exercise here would drill scope this level's coverage file does not claim.

**Coverage bullets:**

- [ ] Primary key — one optional table constraint, possibly composite, that uniquely identifies rows; application tables normally define one even though SQL does not require every table to have it ✅ 07-timetrack
- [ ] Primary key vs `UNIQUE` constraint — both reject duplicates and both can be composite, but a table has at most one primary key, its columns are implicitly `NOT NULL`, and it is what foreign keys reference by default; a `UNIQUE` column can stay nullable and a table may carry several
- [ ] Foreign key — one or more columns referencing a primary or other unique candidate key; PostgreSQL rejects values with no referenced row, enforcing referential integrity ✅ 07-timetrack
- [ ] `ON DELETE` behavior — PostgreSQL defaults to `NO ACTION`; `RESTRICT` also rejects referenced-row deletion but cannot be deferred, `CASCADE` deletes dependent rows, and `SET NULL` clears a nullable foreign key ✅ 07-timetrack
- [ ] `ON UPDATE` behavior — the same referential actions apply when the referenced key value itself changes; it is nearly invisible with surrogate keys that never change, which is exactly why an inherited `ON UPDATE CASCADE` on a natural key is easy to misread
- [ ] `NOT NULL` constraint — reject missing values for fields whose domain contract requires a value ✅ 07-timetrack
- [ ] `UNIQUE` constraint — rejects duplicate non-`NULL` keys and creates a supporting unique B-tree index; PostgreSQL permits multiple `NULL` values by default unless `NULLS NOT DISTINCT` is requested ✅ 07-timetrack
- [ ] Composite uniqueness — a `UNIQUE` constraint across several columns enforces a business rule on the combination, such as one membership per `(user_id, project_id)`
- [ ] Constraint vs application-side uniqueness check — a `SELECT` that finds no duplicate followed by an `INSERT` is two statements, so a concurrent session can pass the same check and both rows land; only the constraint decides atomically, which makes the application check a friendlier error message rather than the guarantee, and makes `ON CONFLICT` one concrete way of handling the constraint's verdict
- [ ] `CHECK` constraint and `NULL` — a check rejects `FALSE` but accepts `TRUE` or `UNKNOWN`, so `CHECK (hours > 0)` still needs `NOT NULL` when hours are required
- [ ] One-to-many relationships — place the foreign key on the many side so each child references one parent while a parent can own several children ✅ 07-timetrack
- [ ] Many-to-many relationships — use a junction table with two foreign keys and usually a composite uniqueness rule so each pair appears only once
- [ ] Natural vs surrogate keys — a surrogate key gives the row a stable technical identity, while a natural business key still needs a `UNIQUE` constraint when the domain says it cannot repeat ✅ 07-timetrack
- [ ] Normalization and data anomalies — store each fact in the relation determined by its key so inserts, updates, and deletes do not require inconsistent copies; formal normal-form analysis belongs to middle
- [ ] Reading a relational schema — identify each table's grain, primary key, foreign keys, nullability, and relationship cardinality before constructing a query

**Pending additions:** none

**Done:** `Review: sql-grade scores ≥ 80% on 11-schema-design.sql`

---

### Step 10 — Data types and DDL (0 scored / 16 target)

**Why here:** it writes by hand the constraints Step 9 only reasoned about, so it needs that step
first; putting DDL before modelling would produce syntax with nothing to say about why the column is
`NOT NULL`.
**Exercises:** `practice/sql/junior/12-data-types-ddl.sql` — 16 (two runs of 8)
**Coverage:** `Data types`, `Schema operations`
**Reinforces:** Step 9 — every constraint from that step is now written by hand in `CREATE TABLE`
**Moment 2 config — run 1:** `TOPIC = data-types`, `COUNT = 8`
**Focus:** none — the whole `Data types` section
**Moment 2 config — run 2:** `TOPIC = ddl`, `COUNT = 8` *(append al mismo archivo; **este run es el que cierra el paso y dispara R4**)*
**Focus:** none — the whole `Schema operations` section

**Concepts:** `NUMERIC` vs `FLOAT`, `TIMESTAMP` vs `TIMESTAMPTZ`, `DATE` for a business day, `VARCHAR` vs `TEXT`,
`CHAR(n)` padding, `SERIAL` vs `IDENTITY`, `BOOLEAN`, `JSONB` vs a real table, integer division and
explicit casts, `ROUND` on `NUMERIC` and how a `NUMERIC` scale propagates out of an expression. Then
writing `CREATE TABLE` / `ALTER TABLE` / `DROP` and `DEFAULT` by hand, and the two-statement order a
constraint added to a table that already holds rows forces.

Written, not queried: the deliverable is a schema you can produce from a blank editor, because
`ddl-auto` has been doing it for you in TimeTrack.

**Coverage bullets:**

- [ ] `VARCHAR(n)` vs `TEXT` — both have identical storage performance in PostgreSQL; `VARCHAR(n)` documents an intended maximum length; `TEXT` is for content with no meaningful upper limit; the practical difference is intent, not performance
- [ ] `CHAR(n)` blank padding — a fixed-length column stores every shorter value padded with trailing spaces, then ignores those spaces when comparing and when reporting `length()`; expect it in inherited Oracle and legacy schemas rather than choosing it for new columns
- [ ] Integer identity columns vs `SERIAL` — `GENERATED ... AS IDENTITY` is the SQL-standard PostgreSQL choice for generated integer keys; `SERIAL` is legacy shorthand that creates a separate sequence and default, while `BIGINT`/`BIGSERIAL` widen the range
- [ ] `NUMERIC(p,s)` vs `FLOAT` — choose exact fixed-precision decimals for money and approximated floating-point values for measurements that tolerate representation error ✅ 07-timetrack
- [ ] Integer division and explicit casts — integer divided by integer truncates the fractional part in PostgreSQL; cast an operand to `NUMERIC` when the result must retain decimals
- [ ] `ROUND(value, n)` — rounds to a given number of decimal places, but only for `NUMERIC`; PostgreSQL has no two-argument `ROUND` for `double precision`, so a computed average usually needs an explicit cast before a report can round it
- [ ] Scale of an expression's result — `NUMERIC` scale propagates outwards through an expression, and a literal fallback carries its own, so `COALESCE(SUM(x), 0)` answers with the summed column's scale when rows exist and with scale 0 when none do; a rounding rule must therefore wrap the whole expression rather than one of its operands
- [ ] `DATE` vs `TIMESTAMP` / `TIMESTAMPTZ` — use `DATE` for a calendar value with no time of day, `TIMESTAMP` for a local wall-clock value, and `TIMESTAMPTZ` for an instant shared across time zones ✅ 07-timetrack
- [ ] `TIMESTAMP` vs `TIMESTAMPTZ` — `TIMESTAMP` stores the date and time exactly as entered, ignoring time zones; `TIMESTAMPTZ` converts to UTC on write and back to the session time zone on read; always use `TIMESTAMPTZ` for `created_at` in a web application
- [ ] `BOOLEAN` — stores true, false, or null; use SQL literals `TRUE` and `FALSE` because PostgreSQL does not generally treat an unquoted integer `1` as a boolean
- [ ] `JSONB` recognition — stores validated JSON in a binary representation that supports PostgreSQL operators and indexes; keep relational columns for stable fields that need ordinary constraints and joins
- [ ] `CREATE TABLE` — defines columns, data types, defaults, and constraints together; read the full definition before loading data because the database, not the application, enforces it
- [ ] `ALTER TABLE` — evolves an existing table by adding, changing, or dropping columns and constraints; versioned migration tooling belongs to the application stack, while SQL owns the resulting schema change ✅ 07-timetrack
- [ ] Adding a constraint to a populated table — a constraint is validated against the rows already stored, so `SET NOT NULL` on a column holding empty values fails until those rows are corrected, making the change two statements in a fixed order rather than one
- [ ] `DROP` vs deleting rows — `DROP` removes the database object itself, whereas `DELETE` and `TRUNCATE` keep the table and remove data
- [ ] `DEFAULT` — supplies a value only when an insert omits the column; it does not replace an explicitly inserted `NULL`, and it does not backfill old rows unless the schema change does so ✅ 07-timetrack

**Pending additions:** none

**Done:** `pgAdmin: after 12-data-types-ddl.sql runs on an empty database, SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' returns users, projects and time_entries`

---

### Step 11 — Indexes and query plans (0 scored / 12 target)

**Why here:** you cannot read a plan for a query shape you cannot yet write, so it comes after joins,
aggregation and windows; and it needs Step 10's `CREATE TABLE` because `UNIQUE` and `PRIMARY KEY` are
where a junior's first indexes actually come from.
**Exercises:** `practice/sql/junior/13-indexes.sql` — 12
**Coverage:** `Performance basics`
**Reinforces:** Step 10 — `UNIQUE` and `PRIMARY KEY` create their index automatically; Step 1 — the join column is the one that needs one
**Moment 2 config:** `TOPIC = indexes`, `COUNT = 12`
**Focus:** none — the whole topic

**Concepts:** what an index is and its write cost, why PostgreSQL does not index a foreign key column, when not to
index, composite index column order, non-sargable predicates, leading-wildcard `LIKE`, `EXPLAIN` vs
`EXPLAIN ANALYZE`, estimated vs actual rows, when a `Seq Scan` is correct, the join node types.

**Coverage bullets:**

- [ ] What an index is — an auxiliary access structure that can speed reads at the cost of storage and write maintenance; B-tree is PostgreSQL's common ordered index, while other index methods serve different operators
- [ ] When to add an index — columns frequently used in `WHERE`, `JOIN ON`, or `ORDER BY` on large tables; when you see a `Seq Scan` on a large table in `EXPLAIN` output
- [ ] Foreign-key indexes — PostgreSQL indexes the referenced primary or unique key but not the referencing foreign-key columns automatically; add an index when joins or parent deletes need to find dependent rows efficiently
- [ ] When NOT to index — avoid indexes without a measured access pattern, especially on small tables or frequently updated columns; low cardinality alone is not decisive because a partial or composite index can still be selective
- [ ] `EXPLAIN` — shows the query plan and whether an index is being used; `Seq Scan` means every row is read; `Index Scan` means the index was used; run this when a query is slow before adding an index
- [ ] Sargable predicates — compare an indexed column directly to a compatible value or range when possible; wrapping the column in a function or starting a pattern with `%` can prevent a normal B-tree index from narrowing the scan

**Pending additions:** none

**Done:** `pgAdmin: with 100000 rows in time_entries, EXPLAIN SELECT * FROM time_entries WHERE work_date = '2026-08-01' returns Seq Scan before CREATE INDEX and Index Scan after`

---

### Step 12 — Working with a live database and reading errors (0 scored / 12 target)

**Why here:** two reasons, and the constraint one is the smaller: its error half is Step 9's constraints
firing, so those must already be understood; its inspection half (`information_schema`, `search_path`,
reading an inherited schema) needs a query vocabulary wide enough to know what to look *for*, which is
everything up to Step 11. It sits immediately before the capstone on purpose — the capstone hands you a
requirement against a schema, and this is the step that teaches you to read one you did not write.
**Exercises:** `practice/sql/junior/14-live-database.sql` — 12
**Coverage:** `Working with an existing database`
**Reinforces:** Step 9 — every error message here is a constraint from that step firing
**Moment 2 config:** `TOPIC = live-database`, `COUNT = 12`
**Focus:** none — the whole topic

**Concepts:** `psql` basics (`\dt`, `\d`, `\l`, `\i`), `information_schema` and catalog views, the `public`
schema and `search_path`, roles and `GRANT`/`REVOKE`, recognising triggers and stored procedures in an
inherited database. Then the exact text of the eight errors a junior must recognise on sight, SQLSTATE
codes (`23505`, `23503`, `23502`, `23514`), and PostgreSQL refusing implicit casts.

The one step where you deliberately leave pgAdmin: a server does not have a GUI, and interviewers ask.

**Coverage bullets:**

- [ ] Schema inspection — use a SQL client's object browser and `information_schema` or PostgreSQL catalog views to discover columns, types, nullability, keys, and constraints before querying an unfamiliar database
- [ ] Database schemas and qualified relation names — schemas namespace objects inside a database; recognise `schema.table` and the role of the search path when inherited code resolves the wrong table or cannot find a relation
- [ ] Syntax and name-resolution errors — use the reported position and identifiers to fix malformed syntax, missing relations or columns, and ambiguous references
- [ ] Type and constraint errors — distinguish failed casts or incompatible operators from `NOT NULL`, `UNIQUE`, `CHECK`, and foreign-key violations
- [ ] `GRANT` and `REVOKE` recognition — understand that roles receive object privileges such as `SELECT`, `INSERT`, `UPDATE`, and `DELETE`, and that application connections should not require superuser access
- [ ] Stored-procedure recognition — maintained databases can expose named server-side routines; writing complex procedural SQL is project-specific rather than a junior floor
- [ ] Trigger recognition — DML can automatically execute trigger logic that is not visible in the application statement, so inspect triggers when an insert, update, or delete has unexpected side effects

**Pending additions:** none

**Done:** `Terminal: \dt inside psql produces users, projects and time_entries`

> Revision point **R5** (doctrine §8b) fires here, over two files rather than three: the capstone that
> follows is itself the integration pass over everything, so a third file in this span would drill the
> same ground twice. `15-report-queries.sql` therefore has no revision point after it — deliberately,
> and it is the only file in the route that does not.

---

### Step 13 — Writing a report query (capstone) (0 scored / 8 target)

**Why here:** last by definition — it introduces no syntax and instead composes every earlier step
under time pressure, which is the one thing drilling topic by topic never produces on its own.
**Exercises:** `practice/sql/junior/15-report-queries.sql` — 8
**Coverage:** `Query workflow and SQL review`
**Reinforces:** everything; this is the integration step
**Moment 2 config:** `TOPIC = report-queries`, `COUNT = 8`
**Focus:** none — the whole topic

The prompt's `report-queries` topic already builds its own TimeTrack setup block (`users`, `projects`,
`time_entries`) instead of the bookstore, marks every exercise Challenge, and states a 10-minute
target per exercise — nothing extra to add to the config.

**Concepts:** no new syntax. Timed exercises that hand you a requirement in prose and expect the whole
query: deciding the result grain first, mapping the requirement onto the clause skeleton, choosing the
driving table so zero-row groups survive, `COALESCE(SUM(...), 0)`, bound parameters instead of
interpolated values, verifying a report total against a simpler control query, and reviewing the result
for the four classic failures — join, predicate, mutation and pagination.

**Coverage bullets:**

- [ ] Bound parameters — keep SQL structure separate from runtime values through prepared-statement or framework placeholders, preserving correct typing and reusable statement structure ✅ 07-timetrack
- [ ] Query construction from a business question — decide the result grain first, then identify tables, join paths, filters, grouping, and ordering before writing syntax
- [ ] Incremental query debugging — inspect a small sample after each join, filter, and aggregation, and predict the expected row count so errors are found where they enter
- [ ] Report-total verification — compare complex report totals with simpler control queries at the intended grain before trusting the result
- [ ] Join-review failures — detect accidental Cartesian products, incorrect cardinality, and `DISTINCT` used to hide row multiplication
- [ ] Predicate-review failures — detect `NULL` comparisons, unsafe value interpolation, and date ranges that omit boundary rows
- [ ] Mutation-review failures — detect unbounded `UPDATE` or `DELETE` statements and verify the intended affected-row set before execution
- [ ] Pagination-review failures — require deterministic ordering and recognise when large `OFFSET` values make a different pagination strategy necessary

**Pending additions:** none

**Done:** `Timed: 3 queries from prose in under 10 minutes each, no reference open`

---

## §3 — Progress

Status is driven by the **scored** count (§1's third definition), never the written or merely answered
one. A row moves to `closed ✅` only after a `review` run has graded it.

| Step | Topic | Exercises file | Scored / target | Status |
|------|-------|----------------|-----------------|--------|
| 0 | Querying basics | `01-basics.sql` + `02-execution-order-set-ops.sql` | 20 / 30 *(01: 20/20 closed, 40/40 correct 2026-07-22 incl. 20 repaso; 02: sin crear)* | in progress ⏳ |
| 1 | JOINs | `03-joins.sql` | 0 / 22 | not started |
| 2 | Aggregates and grouping | `04-aggregates.sql` | 0 / 14 | not started |
| 3 | JOIN pitfalls | `05-join-pitfalls.sql` | 0 / 12 | not started |
| 4 | NULL and three-valued logic | `06-nulls.sql` | 0 / 12 | not started |
| 5 | Subqueries, CTEs, views | `07-subqueries-ctes.sql` | 0 / 16 | not started |
| 6 | Date and string functions | `08-dates-strings.sql` | 0 / 12 | not started |
| 7 | Window functions | `09-window-functions.sql` | 0 / 12 | not started |
| 8 | DML and transactions | `10-dml-transactions.sql` | 0 / 16 | not started |
| 9 | Schema design | `11-schema-design.sql` | 0 / 15 | not started |
| 10 | Data types and DDL | `12-data-types-ddl.sql` | 0 / 16 | not started |
| 11 | Indexes and query plans | `13-indexes.sql` | 0 / 12 | not started |
| 12 | Live database and errors | `14-live-database.sql` | 0 / 12 | not started |
| 13 | Report queries (capstone) | `15-report-queries.sql` | 0 / 8 | not started |

**20 of 209 first-pass exercises scored** (Step 0's `#01–#20`, all correct), plus a
20-exercise review batch that does not count. `PROGRESS.md` holds the
authoritative status; this table is the at-a-glance copy. Both are updated by the doctrine §4 ritual, in
the same commit. Review batches never change a row here.

---

## Out of scope at this level

**None — every one of the 151 bullets in `notes/sql/coverage/junior.md` is claimed by exactly one step.**
The exclusions this plan used to carry disappeared with the 2026-08-03 coverage recalibration rather
than being reversed: the old `Programmable database objects` section, deliberately skipped, was rewritten
into two *recognition* bullets inside `Working with an existing database` (`Stored-procedure recognition`
and `Trigger recognition`), and recognition is exactly what Step 12 drills — spotting a trigger as the
cause of an unexplained side effect, not writing PL/pgSQL. Scope beyond junior is not excluded here
either — it was never claimed: it lives in `notes/sql/coverage/middle.md` and `senior.md`, which are
other levels' routes to claim, not this one's to exclude.
