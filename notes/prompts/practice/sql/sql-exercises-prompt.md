# SQL Exercises Prompt

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

> **Brief blocking questions:** When a decision is required before the run can continue, ask only for
> the available options, the consequence of each, and one recommended choice. Do not add a diff table,
> background explanation, or repeated context unless Victor asks for it.

Use in a **separate conversation**. Fill in the configuration block, then paste the prompt into a new chat.

Three modes:

- **`practice`** — generates exercises for a SQL topic and saves them to `practice/sql/{LEVEL}/`. If the topic file already exists, adds more exercises continuing the numbering.
- **`review`** — checks your answers. Paste the exercise file at the very end of the prompt.
- **`reinforce`** — extra practice over a file you name, counted against nothing.

> **▶ Run first:** `/sql-plan {LEVEL}` — every run resolves `{FILE}`, `{COUNT}`, `{FOCUS}` and the
> concept scope from `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`, and stops if that file does not exist.
> Once the route exists it is not re-run per batch: a route that has gone stale against coverage is a
> warning line, never a blocker. `MODE = reinforce` is the one exception — it takes its file from
> `FILE` and needs no step.

---

**How to use:** fill in `MODE` and `TOPIC`, paste the prompt into a new chat. That is the whole ritual.

Everything left blank — which file, how many exercises, which concepts — comes from
`practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`, and this prompt reads it, so the default is always the plan. `COUNT`
and `FILE` are there when you want to override that for one run. In `MODE = review` you do not need to
paste the exercise file either; it is read from disk.

`MODE = reinforce` is the third mode: extra practice over a file you name, on a day you feel like it. It
counts for nothing and closes nothing — that is what makes it safe to run on a file whose step is
already closed.

---

````
## Configuration — edit only this block

MODE  = [practice | review | reinforce]
LEVEL = [junior | middle | senior]   ← blank means junior
TOPIC = [R1 | R2 | R3 | R4 | R5   ← a revision point; everything below is a normal topic
         basics | joins | group-by | join-pitfalls | nulls | subqueries | ctes | dates-strings | window-functions | dml | transactions | schema-design | normalization | data-types | ddl | indexes | live-database | report-queries | all]
COUNT =
FILE  = practice/sql/junior/01-basics.sql
        practice/sql/junior/02-execution-order-set-ops.sql
        practice/sql/junior/03-joins.sql
        practice/sql/junior/04-aggregates.sql
        practice/sql/junior/05-join-pitfalls.sql
        practice/sql/junior/06-nulls.sql
        practice/sql/junior/07-subqueries-ctes.sql
        practice/sql/junior/08-dates-strings.sql
        practice/sql/junior/09-window-functions.sql
        practice/sql/junior/10-dml-transactions.sql
        practice/sql/junior/11-schema-design.sql
        practice/sql/junior/12-data-types-ddl.sql
        practice/sql/junior/13-indexes.sql
        practice/sql/junior/14-live-database.sql
        practice/sql/junior/15-report-queries.sql

**The `FILE` list above is the junior route's.** At `LEVEL = middle` or `senior` the files live under
`practice/sql/{LEVEL}/` and their names come from that route's §1 table — read it, never guess a path.
Every level takes its own directory; no level is flat.

**That is the entire configuration.** Do not add keys. `MODE` and `TOPIC` are required; `LEVEL`, `COUNT`
and `FILE` are optional overrides — they are there so Victor can pin the batch size or name the file
explicitly when he wants to be sure what happens, and **blank is the normal state and never an
error**. Blank means "derive it from the plan" (see the Resolution table). If more than one path is
left under `FILE`, that is a half-finished edit: stop and ask which one, do not guess. If you feel
the need to hand-tune anything *else* about a batch, the thing that needs changing is the step in
`practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`, not this run.

---

## Resolution — work these out before doing anything else

**Do not ask Victor for any of these. Derive them, print what you derived, and continue.**

| Value | Where it comes from |
|-------|---------------------|
| `{LEVEL}` | the `LEVEL` key if Victor set it; otherwise `junior`. It selects the route file: `{PLAN} = practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`. If that file does not exist, print "Error: no existe `{PLAN}`. Corre `/sql-plan {LEVEL}` antes de generar ejercicios." and stop. |
| `{FILE}` | the `FILE` key if Victor set it; otherwise **`{PLAN}`'s §1 table, at every level** — the row whose step matches the `{TOPIC}`. Never invent a path. At junior, cross-check the result against the path table below and, on a mismatch, use §1, print one line naming both paths, and say the table needs updating: §1 is the route, the table is a reading aid. |
| `{COUNT}` | the `COUNT` key if Victor set it; otherwise the `COUNT = n` inside the **`**Moment 2 config:**`** line or block of the `{PLAN}` §2 step whose TOPIC matches. When the two differ, say so in one line ("COUNT del bloque = 6, el plan pide 10") and use his — the plan is the default, not a veto. |
| `{FOCUS}` | the **`**Focus:**`** line of that same §2 step (every step has one; `none — the whole topic` is a real value, not a blank). |
| `{REVIEW}` | `no`, unless `MODE = reinforce` (always `yes` — see its block below), or the §2 block picked is a **Moment 2b reinforcement block** — the one `MODE = review` appends when a score came back under 60%, headed `**Moment 2b reinforcement block:**` — which also sets it to `yes`. |

**Then check the route is current, and do not stop on it.** Recalculate the SHA-256 of
`notes/sql/coverage/{LEVEL}.md`'s scope bytes (canonical command in `_coverage-standard.md`) and compare
it with `{PLAN}`'s `Coverage SHA-256`. On a mismatch print one line — "Ruta desactualizada: coverage ha
cambiado desde el último `/sql-plan {LEVEL}`" — and **continue**. A stale route still names a real step
with a real count; it just may not map the newest bullets. That is a planning debt, not a reason to
refuse a batch, and stopping here would block the daily block on a prompt run Victor has to schedule.

**The path table — a readable projection of the junior route's §1, not a second source of truth.** It is
here so a topic-to-file mapping can be read at a glance without opening the route; `{FILE}` still
resolves from §1, and a disagreement is fixed in this file, never in the plan. Files numbered in study
order inside `practice/sql/junior/`; several topics share a file, and the second topic appends to the
first rather than creating a new one. **At middle and senior it does not apply at all** — no projection
of those routes is kept here, so §1 is read directly and nothing cross-checks it.

| Topic | Path | Route step |
|-------|------|------------|
| basics | practice/sql/junior/02-execution-order-set-ops.sql | 0 |
| joins | practice/sql/junior/03-joins.sql | 1 |
| group-by | practice/sql/junior/04-aggregates.sql | 2 |
| join-pitfalls | practice/sql/junior/05-join-pitfalls.sql | 3 |
| nulls | practice/sql/junior/06-nulls.sql | 4 |
| subqueries | practice/sql/junior/07-subqueries-ctes.sql | 5 |
| ctes | practice/sql/junior/07-subqueries-ctes.sql *(appends)* | 5 |
| dates-strings | practice/sql/junior/08-dates-strings.sql | 6 |
| window-functions | practice/sql/junior/09-window-functions.sql | 7 |
| dml | practice/sql/junior/10-dml-transactions.sql | 8 |
| transactions | practice/sql/junior/10-dml-transactions.sql *(appends)* | 8 |
| schema-design | practice/sql/junior/11-schema-design.sql | 9 |
| normalization | practice/sql/junior/11-schema-design.sql *(appends)* | 9 |
| data-types | practice/sql/junior/12-data-types-ddl.sql | 10 |
| ddl | practice/sql/junior/12-data-types-ddl.sql *(appends)* | 10 |
| indexes | practice/sql/junior/13-indexes.sql | 11 |
| live-database | practice/sql/junior/14-live-database.sql | 12 |
| report-queries | practice/sql/junior/15-report-queries.sql | 13 |
| R1 | practice/sql/junior/R1-repaso.sql | *(revision point — steps 0–1)* |
| R2 | practice/sql/junior/R2-repaso.sql | *(revision point — steps 2–4)* |
| R3 | practice/sql/junior/R3-repaso.sql | *(revision point — steps 5–7)* |
| R4 | practice/sql/junior/R4-repaso.sql | *(revision point — steps 8–10)* |
| R5 | practice/sql/junior/R5-repaso.sql | *(revision point — steps 11–12)* |

`practice/sql/junior/01-basics.sql` is deliberately absent: it carries the pre-canonical schema and is
closed, so nothing is ever appended to it again (one file, one schema).

`{REVIEW} = yes` means: a batch over concepts already drilled — no Intro tier, exercises labelled
`[Repaso]`, repetition allowed, and **not** counted against the step's first-pass target.

**Steps in the route's §2 sometimes carry two runs.** Two cases, and they are disambiguated differently:
- **Two runs with different `TOPIC`s** (Steps 5, 8, 9, 10) — the run is chosen by the `TOPIC` you were
  given. Nothing to decide.
- **Two runs with the same `TOPIC`** (Step 1: `joins` twice) — every such run states its **exercise
  range** in the plan (`run 1 → #01–#11`, `run 2 → #12–#22`). Pick by the written count on disk: the
  first run whose range is not yet fully written. State which run you picked and why in one line
  ("Run 2: el archivo ya tiene 11 ejercicios").

A **Moment 2b reinforcement block** is never picked by this rule — it is picked only when it is the
last block in the step and its concepts have not yet been re-drilled since it was appended.

### `{TOPIC}` is a revision point (`R1`–`R5`) — resolve it from the mistake log

A revision point is not a topic: it is a **span of steps** whose failures are re-drilled together
(la doctrina (`{PLAN}` §8b)). Everything resolves differently, and **`practice` mode only** — `review` mode grades
the resulting file like any other.

| Value | Where it comes from |
|-------|---------------------|
| `{FILE}` | the path table above: `practice/sql/{LEVEL}/R{n}-repaso.sql`. Its own file, never appended to a first-pass file — a repaso batch is uncounted (route §1) and mixing it into a step's file corrupts that step's score. |
| `{COUNT}` | `8`, unless Victor overrode it. Revision batches are not budgeted in route §1. |
| `{REVIEW}` | always `yes`. |
| `{FOCUS}` | **the open rows of `practice/sql/MISTAKES.md` whose `Step` is `{LEVEL}:{n}` with `n` in the span**, ordered by `Times` descending. This is the whole point of the mechanism: the batch drills what the record says was answered wrong, not what feels rusty. |

Spans (junior): `R1` → steps 0–1 · `R2` → steps 2–4 · `R3` → steps 5–7 · `R4` → steps 8–10 · `R5` → steps 11–12.

**Match the level, not just the number.** `MISTAKES.md` is one file for every level by design — a
concept failed at junior and again at middle increments one row instead of opening two, and that
recurrence is what the log is for. The cost is that `Step` numbers restart at 0 in each level and the
R spans belong to the route, so `R2` at middle and `R2` at junior both claim "steps 2–4". Filter on the
qualified value: at `{LEVEL} = junior`, `junior:3` is in span and `middle:3` is not. A filter written
against the bare number drills another level's failures and looks completely normal doing it.

### `MODE = reinforce` — extra practice on one file, asked for on the day

A revision point is scheduled by the route; this is Victor asking for more of a file because he wants
more. It reads the **`practice` branch** and differs from it in four resolved values:

| Value | Where it comes from |
|-------|---------------------|
| `{FILE}` | the `FILE` key — **required here**, since nothing in the route selects it. Blank is an error, not a derivation. The batch appends to that same file, not to an `R{n}-repaso.sql`. |
| `{COUNT}` | the `COUNT` key if Victor set it; otherwise `8`, as at a revision point. Not budgeted anywhere. |
| `{REVIEW}` | always `yes` — no Intro tier, 60/40 Standard/Challenge, `[Repaso]` labels, repetition allowed. |
| `{FOCUS}` | the open `MISTAKES.md` rows for that file's step — matched on the qualified `{LEVEL}:{n}`, never the bare number — highest `Times` first. With none open, the step's `**Concepts:**` that appear in the fewest exercises of the file. Say in one line which case applied. |

`{TOPIC}` still names the file's topic so the seed block resolves; it selects no step here.

**This mode never advances anything.** It writes no count, closes no step, marks no coverage bullet —
the `[Repaso]` labels are what carry that through to the review run. It is deliberately available on a
file whose step is already `closed ✅`: re-drilling a closed step is the point, and a closed step is
exactly what must not be reopened by drilling it. A missing `{PLAN}` step is not an error here either,
which is the one place this mode is looser than `practice` — there is no target to plan against.

**Read `practice/sql/MISTAKES.md` before anything else on these runs**, take the `## Open` rows whose
`Step` is `{LEVEL}:{n}` with `n` in the span, and build `{FOCUS}` from their `Concept` cells, highest
`Times` first. A concept
failed three times earns the batch before one failed once — weight the exercise count towards the top
of that list rather than splitting evenly.

**If the span has no open rows, the point still fires** (§8b is explicit). `{FOCUS}` becomes the
concepts of that span's steps that have appeared in the fewest exercises — read the route §2 `**Concepts:**`
lines for those steps and the exercise files themselves. Say in one line which case applied: "R2: 3
filas abiertas en MISTAKES.md" or "R2: sin filas abiertas — foco por cobertura más fina".

Print the resolution block with `Punto de repaso {R}` in place of `Step {N}`, and list the concepts you
took, with their `Times`.

**Then print this and continue in the same turn — it is a statement, not a question:**

```
Step {N} — {step name}
Archivo: {FILE}
Ejercicios: {COUNT}   Repaso: {REVIEW}
Focus: {FOCUS}
```

Validation:
- If MODE or TOPIC is blank: print "Error: MODE and TOPIC are required." and stop.
- **In `reinforce` mode, if `FILE` is blank:** print "Error: `MODE = reinforce` necesita `FILE` — es el archivo que quieres repasar." and stop. Never fall back to the path table: the whole point of this mode is that Victor chose the file, and deriving one would silently drill something else. The `{PLAN}`-step errors below do not apply in this mode; a reinforce batch has no step to draw a COUNT or a target from.
- If no `{PLAN}` §2 step claims `{TOPIC}`: stop and report it. At junior, `{TOPIC}` missing from the path
  table above is not this check — it is the projection being out of date, reported as a line, not a stop.
- **If {TOPIC} is `R1`–`R5`:** the route-§2-step rules below do not apply — a revision point has no step of its own. Skip straight to the revision-point resolution above. In `review` mode a repaso file is graded normally, but **it never updates the route §3, §1 or a step status** (see the review branch): it is uncounted by design.
- If {TOPIC} is `R1`–`R5` in `practice` mode and `practice/sql/MISTAKES.md` does not exist: print "Error: no existe `practice/sql/MISTAKES.md`. Un punto de repaso deriva su foco de sus filas abiertas." and stop — do not fall back to a generic batch over the span. Generating one anyway is exactly the "revise what feels rusty" behaviour §8b exists to replace.
- If `{PLAN}` has no route §2 step for {TOPIC}: print "Error: {TOPIC} no tiene step en el plan. Añádelo a §2 de la ruta antes de correr esto." and stop — do not fall back to a default COUNT. A topic with no step is a planning gap, and silently generating 12 exercises hides it.
- **If the route §2 step exists but states no `COUNT` (or no `**Focus:**` line): print "Error: el step de {TOPIC} en §2 de la ruta no declara [COUNT / Focus]. Arréglalo en `{PLAN}` antes de correr esto." and stop.** A step missing the value is the same planning gap as a missing step, and this is the case that used to fall through to the minimum-4 warning below and quietly generate a batch nobody asked for. Never invent the value, never round to the minimum, never ask Victor for it.
- If Victor set `COUNT` explicitly and it is not a positive integer or is less than 4: print "Warning: COUNT must be at least 4 for the difficulty distribution to work. Using COUNT = 4." and use 4. **This applies only to a typed override** — a plan-derived COUNT is never silently corrected; it errors above.
- **Target already met:** if the route §1 shows {FILE} has already *written* its step's first-pass target (e.g. `02-execution-order-set-ops.sql`, 10 of 10), print "El target first-pass de este archivo ya está escrito ({n}/{target}). ¿Generas un lote extra de repaso (no cuenta para el paso), o paras? (repaso / paro)" and wait. On `repaso`, continue with `{REVIEW} = yes`. This is the guard against re-generating over a step that only needs answering.
- In review mode: {COUNT}, {FOCUS} and {REVIEW} do not apply — only {FILE}. If {FILE} does not exist: print "Error: no existe [FILE]." and stop.
- `TOPIC = all` is practice mode only; it walks every topic in the order below, resolving each one's COUNT and FOCUS from its own route §2 step. See `notes/prompts/_internal/_batch-mode.md`. Review mode stays one file at a time.

Topic order (study order, and also the file-number order): basics, joins, group-by, join-pitfalls,
nulls, subqueries, ctes, dates-strings, window-functions, dml, transactions, schema-design,
normalization, data-types, ddl, indexes, live-database, report-queries. This order, the file
numbering and the step numbering are kept in sync with `{PLAN}` — that file is the
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
- `notes/prompts/_internal/_session-rules.md` — daily schedule and teaching context (my profile and the market are in `notes/prompts/_internal/_shared-context.md`).
- `{PLAN}` — **the SQL learning plan.** It owns the step order, the file numbering, how many exercises each file targets, and which coverage sections each step claims. If this prompt and that plan ever disagree about a path or an order, the plan wins and this prompt is the thing to fix.
- `PROGRESS.md` — `## Practice completed` → `### Exercise route`. Its roll-up says how much of this level's route is done; `{LEVEL}`'s detail table says which files are already `closed ✅`. Both branches write back into it: `practice` raises the `Corrected` denominator when it writes a batch, `review` raises the graded counts.
- `notes/sql/coverage/{LEVEL}.md` — the source of truth for every SQL concept required at junior level. Read it now; in Step 3 you will use the section for {TOPIC} to define the concept scope for the exercises.

My profile is in `notes/prompts/_internal/_shared-context.md`.

My daily SQL block is 12:30–13:30. I write answers directly in the SQL file in pgAdmin
(PostgreSQL), then paste it into review mode. This block feeds into Stage 2: technical test
simulation — so exercises should reflect the kind of SQL a real consultancy test includes.

SQL is not isolated from the rest of the stack. Where relevant, connect a concept to its
Spring Boot or JPA equivalent in the exercise description (e.g. transactions → @Transactional,
schema design → @Entity + @OneToMany, indexes → N+1 query problem).

Study order (the junior route; matches `{PLAN}` §1 and §2 — the folder listing reads in the order the
topics are learned, so the file numbers rise with study order even though **they no longer equal the
step numbers**: Step 0 alone spans files `01` and `02`, because one file carries one schema):

```
01 basics ─ 02 execution-order+set-ops ─ 03 joins ─ 04 aggregates ─ 05 join-pitfalls
  ─ 06 nulls ─ 07 subqueries+ctes ─ 08 dates-strings ─ 09 window-functions
  ─ 10 dml+transactions ─ 11 schema-design+normalization ─ 12 data-types+ddl
  ─ 13 indexes ─ 14 live-database ─ 15 report-queries
```

Why this order and not the coverage file's order:
- **joins before aggregation** — in a real screening `GROUP BY` almost always sits on top of a join.
- **aggregation before join-pitfalls** — every pitfall worth drilling *is* an aggregate over a broken
  join: fan-out inflating `SUM`, `COUNT(*)` vs `COUNT(column)` after a `LEFT JOIN`, pre-aggregating in
  a CTE instead of `COUNT(DISTINCT)`. None of them can even be stated without `SUM` and `COUNT`, so
  join-pitfalls cannot precede group-by.
- **NULLs after aggregation** — the surprises already met (a `LEFT JOIN` producing nulls, `AVG`
  skipping them) get their mechanism explained rather than described.
- **date functions before window functions** — a live exercise stalls on `DATE_TRUNC` first, and every
  monthly report is `GROUP BY DATE_TRUNC('month', ...)`.

The reasoning per step is in the route §2.

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
| `practice` | `notes/prompts/practice/sql/_internal/_sql-exercises-practice.md` | checks existing state, writes the setup block if the file is new, generates {COUNT} exercises, saves them, and raises the `Corrected` denominator in PROGRESS.md |
| `review` | `notes/prompts/practice/sql/_internal/_sql-exercises-review.md` | reads the answered file, grades every answer, writes the correction markers, updates PROGRESS.md and MISTAKES.md. **Since 2026-08-03 the `sql-grade` skill is the normal door to this branch** — it runs the same file in a cold subagent and then decides whether the step closes. Reaching it through `MODE = review` still works and grades identically, but it stops at the score: nothing hands off to `sql-step-close`, so the coverage drill markers are not written. Prefer the skill. |
| `reinforce` | `notes/prompts/practice/sql/_internal/_sql-exercises-practice.md` | the same branch as `practice`, run with the four values its own block resolves — appends a `[Repaso]`-labelled batch to the file Victor named. It advances no step and no route figure, but it **does** raise the `Corrected` denominator: a repaso exercise is still an exercise waiting to be graded |

Do **not** open the other branch — it cannot apply to this run, and reading it is how a run ends up
executing a step from the wrong mode. If `MODE` resolved to neither value, the Resolution validation
above has already stopped you.

Then come back here for the final step below, which runs in both modes.

---

## Final step — write the self-report

Read `notes/prompts/_internal/_single-shot-self-report.md` and execute it in full: the close-out check
against this prompt's declared outputs in `notes/prompts/README.md`, the three bullets written to
`notes/prompts/practice/sql/_internal/_last-run-report-sql-exercises.md`, its own commit, then the
refinement step.

**Two tracker cells, not one.** The shared close-out updates this prompt's row in
`## Single-shot prompt executions` — that row records the *run*. It cannot answer how far along the
route Victor is, so also update the `Exercises` cell for `{LEVEL}` in `## SQL exercise track`:
`X/Y steps closed — {outcome}`, with Y the step count in `{PLAN}` §3 and X its rows at `closed ✅`,
both read from the plan and never from counting `.sql` files. Recalculate it on every run, including a
`blocked` one and a `practice` run that closed nothing — an unchanged fraction is still a current one.

**One tailoring of bullet 1 (`Config vs reality`), because this prompt derives more than it is given:**
report whether the `{COUNT}` and `{FOCUS}` read from `{PLAN}` §2 produced what the step actually
needed, and whether `{FILE}` resolved to the right file. **A wrong derived value is a bug in the plan,
not in this prompt** — name the file that needs the fix.

Common rejections here, so they are not re-proposed every run: a fix that belongs in
`{PLAN}` is applied there, and a batch that felt mis-sized but produced correct
exercises fails condition 3 (it changed the cost, not the result).
[optional — paste an exercise file below this line only if your answers are not saved to disk yet;
a paste overrides {FILE}]
````
