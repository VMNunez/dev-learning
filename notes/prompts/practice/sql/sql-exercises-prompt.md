# SQL Exercises Prompt

Use in a **separate conversation**. Fill in the configuration block, then paste the prompt into a new chat.

Two modes:

- **`practice`** — generates exercises for a SQL topic and saves them to `practice/sql/`. If the topic file already exists, adds more exercises continuing the numbering.
- **`review`** — checks your answers. Paste the exercise file at the very end of the prompt.

> **▶ Run first:** nothing — `practice` generates exercises from scratch; `review` reads the answered file from `{FILE}`.

---

**How to use:** fill in `MODE` and `TOPIC`, paste the prompt into a new chat. That is the whole ritual.

Everything left blank — which file, how many exercises, which concepts — comes from
`practice/sql/PLANNING.md`, and this prompt reads it, so the default is always the plan. `COUNT` and
`FILE` are there when you want to override that for one run. In `MODE = review` you do not need to
paste the exercise file either; it is read from disk.

---

````
## Configuration — edit only this block

MODE  = [practice | review]
TOPIC = [basics | joins | join-pitfalls | group-by | nulls | subqueries | ctes | dates-strings | window-functions | dml | transactions | schema-design | normalization | data-types | ddl | indexes | live-database | report-queries | all]
COUNT =
FILE  = practice/sql/01-basics.sql
        practice/sql/02-execution-order-set-ops.sql
        practice/sql/03-joins.sql
        practice/sql/04-aggregates.sql
        practice/sql/05-join-pitfalls.sql
        practice/sql/06-nulls.sql
        practice/sql/07-subqueries-ctes.sql
        practice/sql/08-dates-strings.sql
        practice/sql/09-window-functions.sql
        practice/sql/10-dml-transactions.sql
        practice/sql/11-schema-design.sql
        practice/sql/12-data-types-ddl.sql
        practice/sql/13-indexes.sql
        practice/sql/14-live-database.sql
        practice/sql/15-report-queries.sql

**That is the entire configuration.** Do not add keys. `MODE` and `TOPIC` are required; `COUNT` and
`FILE` are optional overrides — they are there so Victor can pin the batch size or name the file
explicitly when he wants to be sure what happens, and **blank is the normal state and never an
error**. Blank means "derive it from the plan" (see the Resolution table). If more than one path is
left under `FILE`, that is a half-finished edit: stop and ask which one, do not guess. If you feel
the need to hand-tune anything *else* about a batch, the thing that needs changing is the step in
`practice/sql/PLANNING.md`, not this run.

---

## Resolution — work these out before doing anything else

**Do not ask Victor for any of these. Derive them, print what you derived, and continue.**

| Value | Where it comes from |
|-------|---------------------|
| `{FILE}` | the `FILE` key if Victor set it; otherwise the path table below, keyed by {TOPIC}. Never invent a path. |
| `{COUNT}` | the `COUNT` key if Victor set it; otherwise the `COUNT` line of the §6 step in `practice/sql/PLANNING.md` whose TOPIC matches. When the two differ, say so in one line ("COUNT del bloque = 6, el plan pide 10") and use his — the plan is the default, not a veto. |
| `{FOCUS}` | the `FOCUS` line of that same §6 step. |
| `{REVIEW}` | `no`, unless the §6 step's block is a Moment 2b reinforcement batch, which sets it to `yes`. |

**The path table — `{FILE}` resolves from here, in both modes.** Flat files, numbered in study
order; several topics share a file, and the second topic appends to the first rather than creating a
new one.

| Topic | Path | PLANNING.md step |
|-------|------|------------------|
| basics | practice/sql/02-execution-order-set-ops.sql | 0 |
| joins | practice/sql/03-joins.sql | 1 |
| group-by | practice/sql/04-aggregates.sql | 2 |
| join-pitfalls | practice/sql/05-join-pitfalls.sql | 3 |
| nulls | practice/sql/06-nulls.sql | 4 |
| subqueries | practice/sql/07-subqueries-ctes.sql | 5 |
| ctes | practice/sql/07-subqueries-ctes.sql *(appends)* | 5 |
| dates-strings | practice/sql/08-dates-strings.sql | 6 |
| window-functions | practice/sql/09-window-functions.sql | 7 |
| dml | practice/sql/10-dml-transactions.sql | 8 |
| transactions | practice/sql/10-dml-transactions.sql *(appends)* | 8 |
| schema-design | practice/sql/11-schema-design.sql | 9 |
| normalization | practice/sql/11-schema-design.sql *(appends)* | 9 |
| data-types | practice/sql/12-data-types-ddl.sql | 10 |
| ddl | practice/sql/12-data-types-ddl.sql *(appends)* | 10 |
| indexes | practice/sql/13-indexes.sql | 11 |
| live-database | practice/sql/14-live-database.sql | 12 |
| report-queries | practice/sql/15-report-queries.sql | 13 |

`practice/sql/01-basics.sql` is deliberately absent: it carries the pre-canonical schema and is
closed, so nothing is ever appended to it again (one file, one schema).

`{REVIEW} = yes` means: a batch over concepts already drilled — no Intro tier, exercises labelled
`[Repaso]`, repetition allowed, and **not** counted against the step's first-pass target.

Steps in §6 sometimes carry two blocks (a first pass and a second). Use the first one whose exercise
target is not yet met according to §8 / `PROGRESS.md`. State which block you picked.

**Then print this and continue in the same turn — it is a statement, not a question:**

```
Step {N} — {step name}
Archivo: {FILE}
Ejercicios: {COUNT}   Repaso: {REVIEW}
Focus: {FOCUS}
```

Validation:
- If MODE or TOPIC is blank: print "Error: MODE and TOPIC are required." and stop.
- If {TOPIC} is not in the path table above: stop and report it.
- If `practice/sql/PLANNING.md` has no §6 step for {TOPIC}: print "Error: {TOPIC} no tiene step en el plan. Añádelo a §6 antes de correr esto." and stop — do not fall back to a default COUNT. A topic with no step is a planning gap, and silently generating 12 exercises hides it.
- If the resolved {COUNT} is not a positive integer or is less than 4: print "Warning: COUNT must be at least 4 for the difficulty distribution to work. Using COUNT = 4." and use 4.
- In review mode: {COUNT}, {FOCUS} and {REVIEW} do not apply — only {FILE}. If {FILE} does not exist: print "Error: no existe [FILE]." and stop.
- `TOPIC = all` is practice mode only; it walks every topic in the order below, resolving each one's COUNT and FOCUS from its own §6 step. See `notes/prompts/_batch-mode.md`. Review mode stays one file at a time.

Topic order (study order, and also the file-number order): basics, joins, group-by, join-pitfalls,
nulls, subqueries, ctes, dates-strings, window-functions, dml, transactions, schema-design,
normalization, data-types, ddl, indexes, live-database, report-queries. This order, the file
numbering and the step numbering are kept in sync with `practice/sql/PLANNING.md` — that file is the
source of truth. Several topics deliberately share one file (joins + join-pitfalls, subqueries +
ctes, dml + transactions, schema-design + normalization, data-types + ddl); the path table above is
authoritative.

---

## Run-start check — read the last run's report

Before anything else, read `notes/prompts/practice/sql/_internal/_last-run-report-sql-exercises.md` (it may not
exist yet — that is fine, skip silently). If it exists and its `Status:` line says `open`, surface the
Verdict in **one line** before continuing:

"Nota del último run: [verdict]."

Then continue normally. This is the same discipline the orchestrators use, adapted for a single-shot
prompt: the report is the only evidence that ever reopens a frozen prompt, and it is worthless if
nobody reads it at the start of the next run.

---

## Context

**Before starting, read these four files:**
- `CLAUDE.md` — daily schedule and teaching context (my profile and the market are in `notes/prompts/_shared-context.md`).
- `practice/sql/PLANNING.md` — **the SQL learning plan.** It owns the step order, the file numbering, how many exercises each file targets, and which coverage sections each step claims. If this prompt and that plan ever disagree about a path or an order, the plan wins and this prompt is the thing to fix.
- `PROGRESS.md` — the SQL section shows which topics are already solid.
- `notes/sql/coverage.md` — the source of truth for every SQL concept required at junior level. Read it now; in Step 3 you will use the section for {TOPIC} to define the concept scope for the exercises.

My profile is in `notes/prompts/_shared-context.md`.

My daily SQL block is 12:30–13:30. I write answers directly in the SQL file in pgAdmin
(PostgreSQL), then paste it into review mode. This block feeds into Stage 2: technical test
simulation — so exercises should reflect the kind of SQL a real consultancy test includes.

SQL is not isolated from the rest of the stack. Where relevant, connect a concept to its
Spring Boot or JPA equivalent in the exercise description (e.g. transactions → @Transactional,
schema design → @Entity + @OneToMany, indexes → N+1 query problem).

Study order (matches `practice/sql/PLANNING.md` §5 and §6 — the folder listing reads in the order the
topics are learned, so the file numbers rise with study order even though **they no longer equal the
step numbers**: Step 0 alone spans files `01` and `02`, because one file carries one schema):

```
01 basics ─ 02 execution-order+set-ops ─ 03 joins ─ 04 aggregates ─ 05 join-pitfalls
  ─ 06 nulls ─ 07 subqueries+ctes ─ 08 dates-strings ─ 09 window-functions
  ─ 10 dml+transactions ─ 11 schema-design+normalization ─ 12 data-types+ddl
  ─ 13 indexes ─ 14 live-database ─ 15 report-queries
```

Why this order and not the coverage.md order:
- **joins before aggregation** — in a real screening `GROUP BY` almost always sits on top of a join.
- **aggregation before join-pitfalls** — every pitfall worth drilling *is* an aggregate over a broken
  join: fan-out inflating `SUM`, `COUNT(*)` vs `COUNT(column)` after a `LEFT JOIN`, pre-aggregating in
  a CTE instead of `COUNT(DISTINCT)`. None of them can even be stated without `SUM` and `COUNT`, so
  join-pitfalls cannot precede group-by.
- **NULLs after aggregation** — the surprises already met (a `LEFT JOIN` producing nulls, `AVG`
  skipping them) get their mechanism explained rather than described.
- **date functions before window functions** — a live exercise stalls on `DATE_TRUNC` first, and every
  monthly report is `GROUP BY DATE_TRUNC('month', ...)`.

The reasoning per step is in PLANNING.md §6.

---

## Canonical schema — bookstore database (PostgreSQL)

All exercise files use this schema unless the topic requires something different.
Use these exact table and column names to keep exercises consistent across sessions.

```
authors     id SERIAL PK | name VARCHAR(100) NOT NULL | country VARCHAR(50) | birth_year INT
publishers  id SERIAL PK | name VARCHAR(100) NOT NULL | country VARCHAR(50)
genres      id SERIAL PK | name VARCHAR(50) NOT NULL UNIQUE
books       id SERIAL PK | title VARCHAR(200) NOT NULL | isbn VARCHAR(20) UNIQUE
            | price NUMERIC(8,2) | published_year INT | stock INT NOT NULL DEFAULT 0
            | author_id INT FK→authors | publisher_id INT FK→publishers | genre_id INT FK→genres
customers   id SERIAL PK | name VARCHAR(100) NOT NULL | email VARCHAR(100) UNIQUE NOT NULL
            | city VARCHAR(50) | joined_date DATE NOT NULL DEFAULT CURRENT_DATE
orders      id SERIAL PK | customer_id INT FK→customers
            | order_date DATE NOT NULL DEFAULT CURRENT_DATE
            | status VARCHAR(20) NOT NULL DEFAULT 'pending'
              CHECK(status IN ('pending', 'completed', 'cancelled'))
order_items id SERIAL PK | order_id INT FK→orders | book_id INT FK→books
            | quantity INT NOT NULL CHECK(quantity > 0)
            | unit_price NUMERIC(8,2) NOT NULL
reviews     id SERIAL PK | book_id INT FK→books | customer_id INT FK→customers
            | rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5)
            | comment TEXT | reviewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
```

**Baseline data requirements (apply to every topic unless overridden):**
- At least 8 authors, some with NULL country or birth_year
- At least 3 publishers, 5 genres
- At least 15 books, some with NULL isbn or price; some authors with multiple books
- At least 10 customers, some with NULL city
- At least 12 orders across different statuses; some customers with multiple orders
- At least 20 order_items spread across orders and books
- At least 10 reviews; some books with multiple reviews, some with none

**Topic-specific edge-case data — override the baseline with these additional requirements:**
- joins: at least 2 authors with no books; at least 3 books with no order_items;
  at least 2 customers with no orders — this makes LEFT JOIN exercises produce non-trivial results
- group-by: at least 2 customers with exactly 1 order; at least 1 genre with 0 books in stock
  so HAVING filters produce different results depending on threshold
- nulls: at least 30% NULL in every nullable column (country, birth_year, isbn, price, city,
  comment) — the queries must hit real NULLs to be meaningful
- subqueries: vary order totals and book counts enough so subquery thresholds return different
  subsets (e.g. "customers who spent more than the average" must return a non-trivial result)
- window-functions: ensure orders span at least 12 distinct months so PARTITION BY customer
  and running totals show meaningful patterns
- indexes: add 500+ rows to books and order_items using generate_series() so EXPLAIN ANALYZE
  shows a real cost difference before and after adding an index
- dates-strings: insert author and book names with mixed case (e.g. 'ORWELL', 'Orwell',
  'george orwell') so ILIKE vs LIKE differences produce visibly different result sets; ensure orders
  span at least 6 distinct months so DATE_TRUNC('month', ...) produces meaningful grouping; leave at
  least 2 customers with a NULL city so a || concatenation blanks a whole display name
- join-pitfalls: at least one book appearing in several order_items, so a naive
  SUM(books.price) across the join comes back an exact multiple of the real total
- live-database: no extra data — the exercises read the schema itself and provoke constraint errors

---

<!-- ============================================================ -->
<!-- THE TWO BRANCHES — read exactly one, named by MODE          -->
<!-- ============================================================ -->

## Run the branch your MODE names

Everything above is shared: the config, the resolution, the run-start check, the context files and the
canonical schema. What happens next depends entirely on `MODE`, and the two branches share no step, so
**read one and only one**:

| `MODE` | Read and execute, in full | What it does |
|--------|---------------------------|--------------|
| `practice` | `notes/prompts/practice/sql/_internal/_sql-exercises-practice.md` | checks existing state, writes the setup block if the file is new, generates {COUNT} exercises, saves them |
| `review` | `notes/prompts/practice/sql/_internal/_sql-exercises-review.md` | reads the answered file, grades every answer, writes the correction markers, updates PROGRESS.md and MISTAKES.md |

Do **not** open the other branch — it cannot apply to this run, and reading it is how a run ends up
executing a step from the wrong mode. If `MODE` resolved to neither value, the Resolution validation
above has already stopped you.

Then come back here for the final step below, which runs in both modes.

---

## Final step — write the self-report

**Runs at the end of every run, in both modes.** Write
`notes/prompts/practice/sql/_internal/_last-run-report-sql-exercises.md`, overwriting the previous one. This is the
adaptation of `notes/prompts/_pipeline-self-report.md` for a single-shot prompt: no subagents, no
slices, so three bullets instead of five.

Header: today's date · `MODE` and `TOPIC` · a `Status:` line — `open` if the Verdict names a change
nobody has applied yet, `applied in <hash>` once this prompt has been edited to address it. A clean
run's status is `open` and stays `open`.

Then exactly these three bullets, honest, including "nothing to report":

1. **Resolution vs reality** — the config is two keys, so this bullet is about what the prompt
   *derived*: did the `{COUNT}` and `{FOCUS}` read from PLANNING.md §6 produce what the step actually
   needed, or was the batch mis-sized or off-scope? Did `{FILE}` resolve to the right file? Name it if
   a path, a coverage section, or a §6 step turned out to be wrong, missing, or stale. **A wrong
   derived value is a bug in the plan, not in the run** — say which file needs the fix.
2. **Rule friction and rule breaches** — any instruction here that was ambiguous, contradictory, or had
   to be worked around; **and any rule this run broke** — the run-start check skipped, the coverage
   lookup failed and the seeds were used anyway, correction markers not written, PLANNING.md not
   updated. Name what was breached and what it cost.
3. **Verdict** — one line: "prompt limpio" or "cambio a considerar: <qué>".

**Before writing bullet 3, `wc -l` this file.** Over ~500 lines, add one line to the Verdict naming the
count and the largest section. This prompt is the reason the check exists — it reached 1244 lines while
carrying a caveat that said so, addressed to a reader who only shows up when there is already something
to add.

### Refinement — apply the verdict, or the report is just a diary

**Skip entirely when the Verdict is "prompt limpio".** Otherwise: this prompt is frozen, and a
self-report is the only evidence that reopens it — but evidence nobody acts on rots. The orchestrators
close this loop (`notes/prompts/_pipeline-self-report.md`, "Commit flow"); a single-shot prompt closes
it the same way, with one cold reviewer instead of a pipeline.

1. Draft the edit: the smallest clause that would have prevented this run's friction. A clause, never
   a paragraph — the war story stays in the report, the prompt states the rule crisply.
2. Dispatch **one cold subagent** (it has not seen this run) with: the drafted edit, the bullet that
   motivated it, and this bar. It answers **apply** or **reject**, with one line of reasoning:
   - Reject if the friction was a one-off, if an existing rule already covers it, or if the edit
     restates something the plan owns — **a fix that belongs in `practice/sql/PLANNING.md` is applied
     there, not here.** That is the most common correct verdict for this prompt.
   - This file is far over the ~500-line budget (991 after the 2026-07-22 seed extraction), so
     **one-in-one-out applies**: the reviewer must name what stale caveat or spent incident comes
     *out* to make room, or reject the edit. If the only honest answer is "nothing comes out", that
     is the signal the file needs another extraction pass, not another clause.
3. On **apply**: make the edit, commit it alone (`docs: sql-exercises — refine from the run that just
   finished`), read the hash from `git log` (never from memory), and set the report's
   `Status: applied in <hash>`. Print one line naming what went in and one naming what came out.
   On **reject**: leave the prompt untouched and record the rejection and its reason in the Verdict,
   so a future run does not re-propose it. `Status` stays `open`.

**Never edit the prompt and then re-run it in the same conversation** — that is the entangled
before-and-run pattern this step exists to avoid.

**Keep it short.** This file exists to surface what broke; padding it with what went well buries the
one finding that should reopen the prompt. It is about the machinery, never the SQL — which exercises
were wrong belongs in the chat summary, not here.

**Commit it yourself** — `notes/prompts/` is prompt-system machinery, inside the auto-commit
exception in CLAUDE.md, and separate from the exercise commit Victor runs:

```
git add notes/prompts/practice/sql/_internal/_last-run-report-sql-exercises.md
```
```
git commit -m "docs: self-report for sql-exercises run ({MODE}, {TOPIC})"
```

> The run tracker (`notes/prompts/_run-tracker.md`) is an orchestrator ledger — this prompt does not
> write to it.

---

[optional — paste an exercise file below this line only if your answers are not saved to disk yet;
a paste overrides {FILE}]
````
