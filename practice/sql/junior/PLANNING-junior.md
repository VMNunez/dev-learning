# SQL Junior Exercise Plan

Plan status: current
Level: junior
Coverage: notes/sql/coverage/junior.md
Coverage SHA-256: bded1b85a539ffa92212b5bd3bbc2112a4e2933ecbadf7fde4c454aaf859b90c
Doctrine: practice/sql/PLANNING.md
Generated: 2026-10-08

**This file is the junior route.** The level-neutral half — the step loop, the done-condition formats,
the closing ritual, the branch rules, the revision mechanism, the quality gates, the invariants, the
closure condition and the out-of-scope fence — lives in the doctrine, `practice/sql/PLANNING.md`, and is
identical whichever level is being drilled. What is here is junior's own: its exercise files, its steps,
its progress table. The three sections below were §5, §6 and §8 of the doctrine until 2026-08-03; they
were moved here whole, renumbered §1, §2 and §3, and then reconciled against the recalibrated
149-bullet coverage file, and again on 2026-08-28 against its 151 bullets. A second 2026-08-28 run found
no coverage drift — the fingerprint was unchanged — and spent itself on the cold route review instead:
seven blocking corrections landed, none of which any bullet count could have seen (two done conditions
that passed without the step being drilled, three `**Focus:**`/`**Concepts:**` lines naming scope this
level does not claim or does not yet teach, and a paragraph telling the reader Step 0's batch was
already written when it had been deleted). The 2026-10-08 run restamped the fingerprint over the
152-bullet file: the one new bullet, `Sequence drift after explicit-id inserts`, had already been claimed
by Step 10 when `sql-plan-audit` ran on 2026-10-07, which may not restamp a digest itself. Its cold route
review moved four Step 0 bullets that need a join or an error message to be drilled into Steps 1 and 12,
replaced the done conditions of Steps 10 and 11 with scored ones, and narrowed five `**Focus:**` and
`**Concepts:**` lines that reached scope a later step teaches. A second 2026-10-08 run, after that
day's `sql-plan-audit`, found the fingerprint unchanged and spent itself on the cold route review again:
Step 2 grew to 20 (route 216) so the screening's aggregation core is no longer one exercise per
concept, five `**Focus:**` values that began `none —` while naming half a section became the concrete
lists the generator reads, and six `**Why here:**`/`**Reinforces:**` lines gained the earlier step they
actually lean on.

---

## §1 — Exercise files

Nothing is invented mid-session. This is the complete inventory, decided up front, **with the exercise
count each file ends at**.

### Exercise files — `practice/sql/junior/`

One file per topic, numbered in study order, inside the level's own directory (every level takes one;
no level is flat). The counts are what exists **on disk, on the active branch**, today — study
material follows the working branch (doctrine §7) and reaches `main` only by merge, so `main` can lag
behind this table. (Corrected 2026-10-07: this used to say "what exists on `main`".)

**Three counts, never conflated.**
- *Written* = the prompt generated the statement.
- *Answered* = the query is written under it. A file full of unanswered statements is worth nothing.
- *Scored* = a grading run (`sql-grade`) has graded it — **at any verdict, and counted once**: an
  exercise graded wrong is scored, and one graded again after a rewrite is not counted a second time.
  **Scored is not accepted.** The ≥ 80% in a `Review:` done condition is the threshold on a grading
  run's *score*, never a filter on which exercises count. **Only grading moves a status, and reaching
  the scored target alone does not close a step** — its done condition does; a re-grade can pass that
  condition without raising this count, and a closed step stays closed (doctrine invariant 14).
  `01-basics.sql` is the completed case — all 40 answers are graded, but only its 20 first-pass
  exercises count toward Step 0's target. (Corrected 2026-10-07: this used to define *scored* as
  "graded ≥ 80%", which turned a per-run threshold into a per-exercise verdict.)

**A file is generated on the day it is answered, not before** (2026-08-04). `02-execution-order-set-ops.sql`
sat for two weeks with 10 statements *written* and 0 *answered*, which is worth exactly nothing: a batch
that is not answered while its concepts are fresh is a batch that gets re-read cold later. It was
deleted rather than left standing, exactly as `03-joins.sql` was on 2026-07-22, and its row below stays
in the route with its target intact — the route declares the file, the file exists when the block that
answers it starts. Run `/sql-exercises` when you sit down to answer, not in advance. (`02-` was
regenerated on 2026-10-02 and is on disk again — 10 written, 0 answered — which is what its row below
records since 2026-10-07; `03-joins.sql` is still not on disk.)
- *Target* = the **first-pass** exercises the step needs. **Review batches (Moment 2b) are extra and
  uncounted** — a file legitimately grows past its target forever, and that is not drift.

`01-basics.sql` shows all four: 40 written and 40 answered, of which exactly 20 are a review batch, so
20 count as scored against its first-pass target of 20. Step 0's target of 30 is that 20 plus the 10
in `02-execution-order-set-ops.sql` — a step's target is the sum of its files', never one file's total.

| File | Step(s) | Written | Answered | Scored | First-pass target | Status |
|------|---------|---------|----------|--------|-------------------|--------|
| `01-basics.sql` | 0 | 40 *(20 review)* | 40 | **20** *(+20 review, uncounted)* | 20 | **closed** — all 40 answers graded correct on 2026-07-22 (40/40), of which the 20 first-pass ones are what the Scored column counts. Legacy schema (v1); no more exercises are added here |
| `02-execution-order-set-ops.sql` | 0 | 10 | 0 | 0 | 10 | written, not answered — regenerated 2026-10-02 after the 2026-08-04 deletion; nothing to grade until its 10 statements are answered (Moment 3) |
| `03-joins.sql` | 1 | 0 | 0 | 0 | 22 | deleted 2026-07-22 — to regenerate |
| `04-aggregates.sql` | 2 | 0 | 0 | 0 | 20 | to create |
| `05-join-pitfalls.sql` | 3 | 0 | 0 | 0 | 12 | to create |
| `06-nulls.sql` | 4 | 0 | 0 | 0 | 12 | to create |
| `07-subqueries-ctes.sql` | 5 | 0 | 0 | 0 | 16 | to create |
| `08-dml-transactions.sql` | 6 | 0 | 0 | 0 | 16 | to create |
| `09-dates-strings.sql` | 7 | 0 | 0 | 0 | 12 | to create |
| `10-window-functions.sql` | 8 | 0 | 0 | 0 | 12 | to create |
| `11-schema-design.sql` | 9 | 0 | 0 | 0 | 15 | to create |
| `12-data-types-ddl.sql` | 10 | 0 | 0 | 0 | 17 | to create |
| `13-indexes.sql` | 11 | 0 | 0 | 0 | 12 | to create |
| `14-live-database.sql` | 12 | 0 | 0 | 0 | 12 | to create |
| `15-report-queries.sql` | 13 | 0 | 0 | 0 | 8 | to create |

> **One file, one schema (rule adopted 2026-07-22).** `01-basics.sql` keeps the old thin schema and is
> closed at 40 exercises; every later file is generated on whatever model its `TOPIC` builds. **Which
> model that is — the canonical bookstore, another one, or no shared setup block at all — is the exercise
> prompt's to say, not this table's** (`notes/prompts/practice/sql/sql-exercises-prompt.md` →
> `## Canonical schema`, and Step 2 of its practice branch), so no list of them is kept here. (Corrected
> 2026-10-08: this note used to say everything from `02-` on carried the bookstore schema in its own
> SETUP block, except three files on the TimeTrack model. Read against the prompt that day, two of the
> three (`12-`, `14-`) and one of the rest (`11-`) did not match what it builds for their topics; the
> list was a copy nothing checked.) "One file, one schema" is a rule against *mixing* schemas inside one
> file, not a rule that every file uses the bookstore. Step 0's 30 first-pass exercises are therefore
> split 20 + 10 across two files. This is why the file numbers no longer match the step numbers — the
> mapping is this table, and the prompt's path table was updated to match.

**First-pass total when the track is done: 216 exercises across 15 files.** Review batches add on top
and are deliberately not budgeted. Track-wide today: **50 written** — 40 in `01-basics.sql` and 10 in
`02-execution-order-set-ops.sql` — and 40 answered and graded, all of them in `01-basics.sql`, of which
only its 20 first-pass exercises count: the route stands at **20 first-pass scored of 216**, and the
other 20 are that file's review batch. Every file from `03-` on is still to generate.

**Two header formats exist on disk, and that is deliberate** — do not "fix" either one by hand.
`01-basics.sql`, written before the exercise prompt existed, is the only file in the legacy format (the
old `02-joins.sql`, now renumbered `03-joins.sql`, was the other one; it was deleted and regenerates in
the current format); every batch the prompt generates is in the current one. What each format looks like,
what the prompt asks before appending to a legacy file, and how a grading run finds the answer in each
are the exercise prompt's to say — `notes/prompts/practice/sql/_internal/_sql-exercises-practice.md`
(Steps 1 and 3) and `notes/prompts/practice/sql/_internal/_sql-exercises-review.md` Step 1 — and are not
restated here; the 40 answered exercises in `01-basics.sql` scored normally on 2026-07-22. (Collapsed to
this pointer 2026-10-08: the passage used to reproduce both formats with an example of each, the review
branch's parsing rule and the prompt's append question — a copy of what those two files own.)
**Grading records its verdict on the exercise's header line in both formats.**
Which marker records which verdict, and when an already-marked exercise is graded again or left alone,
is owned by `notes/prompts/practice/sql/_internal/_sql-exercises-review.md` — Step 2b for the markers,
Step 1 for the re-grade and skip policy — and is not restated here. (Corrected 2026-10-07: this
paragraph used to say every marked exercise is skipped as settled, which is not the policy — an
exercise graded and not accepted is marked too, and can come back through grading. The one point of the
2026-07-22 correction it replaces stands: a legacy-format exercise is marked exactly like a
current-format one, and claiming otherwise is what cost `01-basics.sql` its markers on the first
review run.)

### Revision files — `practice/sql/junior/R{n}-repaso.sql`

Uno por punto de repaso de esta ruta — la cadencia que los obliga es doctrina §8b, pero **cuáles
existen, qué abarcan y qué los dispara se deciden aquí** —, creado por su lote de Moment 2b
(`TOPIC = R2`) y **no antes**. No están en la tabla de arriba porque no pertenecen a ningún step: **no tienen target, no
cuentan para nada y nunca mueven un estado de §3** — por eso viven en archivo propio en vez de apilarse
dentro del archivo de un step, donde inflarían su cuenta y ensuciarían su nota.

| Archivo | Punto | Span (steps) | Dispara cuando | Estado |
|---------|-------|--------------|----------------|--------|
| `R1-repaso.sql` | R1 | 0–1 | cierra el Step 1 — su done condition `Review:` pasa sobre `03-joins.sql` | sin crear |
| `R2-repaso.sql` | R2 **hard checkpoint** | 2–4 | cierra el Step 4 — su done condition `Review:` pasa sobre `06-nulls.sql` | sin crear |
| `R3-repaso.sql` | R3 **hard checkpoint** | 5–7 | cierra el Step 7 — su done condition `Review:` pasa sobre `09-dates-strings.sql` | sin crear |
| `R4-repaso.sql` | R4 | 8–10 | cierra el Step 10 — su done condition `Review:` pasa sobre `12-data-types-ddl.sql` | sin crear |
| `R5-repaso.sql` | R5 | 11–12 | cierra el Step 12 — su done condition `Review:` pasa sobre `14-live-database.sql` | sin crear |

Lo que dispara un punto es el **cierre** del step, no que su archivo esté *scored*: un archivo corregido
entero por debajo del 80% tiene todo su target scored y no cierra nada (§1, tercera definición).

(Re-derivado el 2026-10-07 por `REC-288`, que adelantó DML y transacciones al Step 6: R3 y R4 conservan
spans de tres archivos — `07`–`09` y `10`–`12` — pero R3 lo dispara ahora `09-dates-strings.sql`, no
`09-window-functions.sql`, y R4 abarca ventanas, diseño de esquema y DDL en vez de DML, diseño y DDL.)

**Los dos hard checkpoints son R2 y R3** — los que la doctrina §8b declara no saltables. R2 cierra el
núcleo de screening (Steps 1–4, lo que pregunta una ronda rápida) y R3 cierra el bloque que va justo
detrás (subqueries y CTEs, DML y transacciones, fechas y texto) — los dos últimos temas del gate
Stage-1 → Stage-2 de `ROADMAP.md` y el primer step posterior a él. Ninguno espera a que un tema *parezca* oxidado, y ninguno se
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
split across Steps 9 and 10 instead of being one 32-exercise block. Any step targeting more than 12 is
split into runs of 12 or fewer — Steps 1 (11 + 11), 2 (11 + 9), 5 (8 + 8), 6 (8 + 8), 9 (10 + 5) and
10 (12 + 5) — which also keeps each batch's difficulty split meaningful. In four of them the cut is not
an arbitrary halfway point either: Steps 6 and 10 each claim two coverage sections, so their runs fall
on the section boundary, and Steps 5 and 9 each claim a single section with a seam of its own
(subqueries | CTEs and views, constraints | modelling), which their two `TOPIC`s follow. (Corrected
2026-10-07: this used to say Step 9 covered two coverage sections, which stopped being true when its
two older sections were merged into the one `Schema design` it claims today, and it gave the undivided
block as 36 exercises where Steps 9 and 10 sum to 15 + 17.)

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
grew by two bullets that both landed on it, and to 17 on 2026-10-07 when `Sequence drift after
explicit-id inserts` joined the `Data types` section it claims whole. The rest of the route already
satisfied the rule.

**The same rule holds per run, not only per step** (2026-10-07). A run's `**Focus:**` — or its own
`TOPIC` — confines it to one half of the step's bullets, so a run with fewer exercises than its half
claims has the step-level problem in miniature: the step's total can be right while one run sits at
100% scored with bullets it was never allowed to touch. The splits were 7 + 7, 8 + 7 and 9 + 8 for
halves of 9 + 5, 10 + 5 and 12 + 5 bullets — Step 10's `data-types` run asked 9 exercises of 12 bullets,
and its done condition tests only the other run — so Steps 2, 9 and 10 were re-cut to their halves'
sizes, every run within the 12 ceiling and no step's target moved.

**The screening floor, if the clock runs out** (added 2026-08-28). 196 first-pass exercises remain
while applications are already under way — the August–September 2026 window has passed and
`ROADMAP.md`'s unfinished employment gates now run until hiring — so the route states which part of itself is
not optional: **Steps 0–6** — the five topics `ROADMAP.md`'s Stage-1 → Stage-2 switch gate names
verbatim (joins · aggregation · subqueries/CTEs · NULL handling · DML basics), now consecutive.
Everything after that is post-gate: `ROADMAP.md` says in as many words that window functions, indexes
and PostgreSQL specifics are *not worth delaying simulations for*. The floor says which steps may not be
traded away when the calendar bites; the order is what makes them arrive first. (Corrected 2026-10-07,
`REC-288`: DML and transactions was Step 8, drilled after dates/strings and window functions, so the
floor read "Steps 0–5, plus Step 8" and 24 post-gate exercises and the R3 hard checkpoint stood in
front of the gate. It moved to Step 6; dates and strings became Step 7 and window functions Step 8.)

Step 1 is the only step at the 22 ceiling, deliberately: JOINs is the single most-tested SQL topic at
junior level, so it gets the widest first-pass batch in the route. (The ten hand-written statements the
step used to start from were deleted on 2026-07-22 and are not part of that 22 — see §1.) (A file's
*total* can exceed its step's target when a review batch is appended to it, as `01-basics.sql` does:
40 written against a first-pass target of 20.)

**Difficulty rises inside every step, and later steps integrate earlier ones.** Two rules, both
mechanical:
- Every batch spans intro → challenge; the exercise prompt's own difficulty split does this and is not
  overridden on a first-pass run. Two kinds of batch sit outside that span, and how each is split is the
  prompt's to say, not this plan's (`notes/prompts/practice/sql/_internal/_sql-exercises-practice.md`
  Step 3 and, for the capstone, the `REPORT-QUERIES` block of `_sql-exercise-seeds.md`): a review batch
  (doctrine Moment 2b), and the capstone, Step 13, which introduces no syntax and so has nothing for an
  opening tier to introduce (stated here 2026-10-08; until then only Step 13 said it, against a rule
  that read as universal).
- **From Step 5 on, at least two Challenge exercises must combine the step's topic with an earlier
  one** (one is enough from Step 4). This is not pasted: the prompt applies it from the topic alone, and
  the `**Reinforces:**` line of each step names which earlier step to combine with, so it is never a
  guess. Without it a late step is drilled in isolation and teaches nothing about composition — which is
  exactly what a screening tests, since no real question is ever one topic wide. **Three steps sit
  outside that floor, and the exemption is the prompt's own** (`_sql-exercises-practice.md`, its
  cross-topic integration rule): the self-contained design topics of Steps 9 and 10, which have no
  shared query schema to compose over and reach back through their `**Focus:**` and `**Reinforces:**`
  lines instead, and the capstone, where every exercise is an integration already.

> **A note on `TOPIC` values.** The `TOPIC` in a Moment 2 config is the *prompt's* vocabulary, not a
> coverage section name. Two steps may pass the same `TOPIC` with different `FOCUS` values without
> either of them claiming the same coverage bullet — invariant 1 is about coverage bullets only.

> **Five coverage sections are split across steps, at bullet level.** `JOINs` and
> `Aggregates and grouping` each hand their diagnostic half to Step 3, because every pitfall on that
> list is an *aggregate over a broken join* and cannot be stated before Step 2;
> `Filtering and NULL handling`, which the 2026-08-03 recalibration merged out of two older sections,
> hands its pattern-matching and precedence half to Step 0 and keeps its three-valued-logic half for
> Step 4; and `Querying basics` and `Set operations` are Step 0's except four bullets that cannot be
> drilled there — three need a join and are Step 1's (`Qualified column references`, `SELECT *` vs
> named columns, `UNION` vs `JOIN`), and `SQL string literals vs quoted identifiers` is read off an
> error message and is Step 12's, which makes `Querying basics` the one section claimed by three
> steps. The split is by bullet, not by section name, and the `**Coverage bullets:**` list of each step
> is what makes it checkable. (Corrected 2026-10-08: this note still counted three sections, each
> split across two steps, after that day's route review moved those four bullets out of Step 0.)

---

### Step 0 — Querying basics ⏳ (20/30 first-pass scored, +20 review)

**Why here:** first, because every later step writes a `SELECT ... WHERE ... ORDER BY` around its own
topic — and because execution order is the mental model joins, aggregation and windows are all
explained against.
**Exercises:** dos archivos, uno por esquema.
- `practice/sql/junior/01-basics.sql` — **cerrado**: 40 respondidas (20 first-pass #01–#20 + 20 de repaso
  #21–#40), **40/40 correctas** el 2026-07-22. Esquema v1 (el viejo). No se le añade nada más.
- `practice/sql/junior/02-execution-order-set-ops.sql` — 10, **escritas y sin responder**. Se generó el
  2026-07-22, se borró el 2026-08-04 sin responder y se regeneró el 2026-10-02: los 10 enunciados están
  en disco y ninguno tiene respuesta todavía.
**Coverage:** `Querying basics`, `Ordering and pagination`, `Set operations`, `Filtering and NULL handling` (its four non-`NULL` bullets: alias visibility in `WHERE`, `LIKE`/`ILIKE`, `IN` vs `OR`, and `BETWEEN` ranges — every bullet about three-valued logic is Step 4) — except the three join-dependent bullets (qualified column references, `SELECT *` vs named columns, `UNION` vs `JOIN`), which are Step 1's, and quoted identifiers, which is Step 12's
**Reinforces:** — (first step)
**Moment 2 config:** `TOPIC = basics`, `COUNT = 10`  *(hecho: el lote se regeneró el 2026-10-02)*
**Focus:** SQL execution order and alias visibility, `CASE WHEN` in `SELECT`, `UNION`/`UNION ALL`/`INTERSECT`/`EXCEPT`, `NULLS FIRST`/`NULLS LAST` and non-deterministic `LIMIT`, stable ordering and `OFFSET` pagination

**Concepts:** covered across both batches — `SELECT`, `WHERE` (`AND`/`OR`/`IN`/`NOT IN`/`LIKE`/
`ILIKE`/`NOT LIKE`/`BETWEEN`/`NOT BETWEEN`/`IS NOT NULL`), `ORDER BY` (single, multiple, by alias),
`LIMIT`/`OFFSET`/`FETCH`, `DISTINCT`, `DISTINCT ON`, expressions and aliases, concatenation, `LENGTH()`.
Those last two appeared incidentally in `01-basics.sql` as expression practice; their coverage bullets
(`||` string concatenation, `LENGTH`) belong to Step 7 and are checked there, not here. `IS NOT NULL`
is the same case: it appeared as a `WHERE` operator, but its bullet (`IS NULL` vs `= NULL`) is Step 4's.

Still missing before this step closes — the ten remaining exercises target exactly these:
- SQL execution order (`FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`) and where an
  alias is visible — the mental model every later step leans on
- `CASE WHEN` in `SELECT`
- `UNION` vs `UNION ALL`, `INTERSECT`, `EXCEPT`
- `NULLS FIRST` / `NULLS LAST`, and why `LIMIT` without `ORDER BY` is non-deterministic
- Stable ordering and `OFFSET` pagination (corrected 2026-10-07: this line used to read "keyset
  pagination vs deep `OFFSET`", which no coverage bullet of this step names and the `**Focus:**` line
  above never asked for)

**Moment 2 está hecho; lo pendiente es Moment 3.** El run del 2026-07-22 escribió las 10 sentencias y
el archivo se borró el 2026-08-04 sin responder ninguna; el 2026-10-02 se **regeneró** con
`/sql-exercises`, `MODE = practice`, `TOPIC = basics`, con su bloque SETUP y sus 10 enunciados. El
bloque empieza por tanto en Moment 3 — responderlos —, y el config de arriba queda como registro de lo
que se pasó: relanzarlo ya no es el siguiente paso. (Corregido el 2026-10-07 contra el archivo en
disco; este párrafo ya se había corregido en sentido contrario el 2026-08-28, cuando el archivo no
existía.)

**Coverage bullets:**

- [ ] `SELECT`, `FROM`, and column aliases — `SELECT` defines the result expressions, `FROM` supplies rows, and `AS` names a result expression without changing the source column
- [ ] SQL execution order — `FROM + JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`; the foundation for understanding why aliases work in `ORDER BY` but not in `WHERE` or `HAVING`
- [ ] `WHERE` operators and precedence — comparisons, `NOT`, `AND`, and `OR` build row predicates; `NOT` binds before `AND`, and `AND` before `OR`, so use parentheses whenever the intended grouping is not immediately obvious
- [ ] Computed expressions — arithmetic and string expressions can produce derived result columns; give them aliases and account for operand types such as integer division
- [ ] `CASE WHEN` in `SELECT` — derive one output value per row from ordered conditions
- [ ] `SELECT DISTINCT` — removes duplicate rows from the result; PostgreSQL treats `NULL` as a duplicate and keeps only one; use to explore unique values in a column
- [ ] `DISTINCT ON` — PostgreSQL-specific; keeps one row per group while returning multiple columns; the column inside `DISTINCT ON (...)` must be the leftmost column in `ORDER BY`
- [ ] `ORDER BY` with `NULLS FIRST` / `NULLS LAST` — PostgreSQL treats `NULL` as the largest value by default; `ASC` puts `NULL` last, `DESC` puts `NULL` first; override with `NULLS FIRST` or `NULLS LAST`
- [ ] No guaranteed row order without `ORDER BY` — a result set is an unordered set, so `GROUP BY`, an index scan, or insertion order can make rows look sorted while the engine stays free to return them differently on the next run; an order a caller depends on has to be stated, never inherited from how the rows happened to be produced ✅ 07-timetrack
- [ ] Multi-column sorting — PostgreSQL resolves `ORDER BY` keys from left to right, so later keys break ties from earlier ones and each key can choose `ASC` or `DESC` ✅ 07-timetrack
- [ ] `LIMIT` always with `ORDER BY` — without `ORDER BY`, `LIMIT` returns an arbitrary set of rows that can change between queries; always pair them
- [ ] Stable ordering — pagination needs a deterministic tie-breaker such as the primary key after a non-unique sort column; otherwise equal values can move between pages ✅ 07-timetrack
- [ ] `OFFSET` for pagination — `LIMIT 10 OFFSET 20` skips 20 rows and returns the next 10; formula: `OFFSET = (page − 1) × page_size`
- [ ] `FETCH FIRST n ROWS ONLY` — the SQL-standard row-limiting clause, written as `OFFSET n ROWS FETCH NEXT m ROWS ONLY`; PostgreSQL accepts both it and `LIMIT`, but Oracle and other engines a consultancy account may run accept only the standard form
- [ ] `UNION` vs `UNION ALL` — remove duplicates across compatible result sets or retain every row and avoid unnecessary duplicate elimination
- [ ] `UNION` column rules — align column counts and compatible types across branches while taking result column names from the first query
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
(the `-- Your answer:` line, with grading's verdict recorded on the header line — §1) instead of
perpetuating the legacy format into a second file.
**Coverage:** `JOINs` (every bullet except `ON` vs `WHERE` with an outer join, which is Step 3), plus `Querying basics` (`Qualified column references`, `SELECT *` vs named columns) and `Set operations` (`UNION` vs `JOIN`) — the three Step 0 bullets that need a join to be drilled
**Reinforces:** Step 0 — execution order (`FROM + JOIN` runs first, which is why the join happens before `WHERE`)
**Moment 2 config:** run 1 — *(archivo nuevo: genera el setup block canónico)* — **rango `#01–#11`**: `TOPIC = joins`, `COUNT = 11`
**Focus:** INNER JOIN across two and three tables, table aliases, LEFT JOIN keeping unmatched rows, LEFT JOIN + IS NULL as an anti-join, qualified column references, named columns instead of `SELECT *` across joined tables.
**Moment 2 config:** run 2 — *(append)* — **rango `#12–#22`**: `TOPIC = joins`, `COUNT = 11`
**Focus:** RIGHT JOIN, FULL OUTER JOIN, self join, CROSS JOIN, JOIN cardinality and predicting row multiplication, `UNION` vs `JOIN` — stacking rows against widening them.

**Concepts:** Run 1 builds the foundation — `INNER JOIN` (two tables, named columns, aliases, three tables, combined
with `WHERE` / `ORDER BY` / `LIMIT`) and `LEFT JOIN` (keeping unmatched rows, and the `IS NULL`
anti-join). Run 2 covers the rest: `RIGHT JOIN` and why it is rewritable as a `LEFT`,
`FULL OUTER JOIN`, self join, `CROSS JOIN` and the missing join condition as its accidental version,
and predicting join cardinality before writing the query.

> **`USING` and `NATURAL JOIN` left this list on 2026-10-07.** Neither has a coverage bullet at any
> level, so drilling them would invent scope — the ruling Step 4 records for `IS DISTINCT FROM`. They
> had already left run 2's `**Focus:**` line on 2026-08-28, which kept them out of the first-pass
> batch; but a revision point or a `reinforce` run that finds neither open mistakes nor friction rows
> falls back on the `**Concepts:**` that appeared in the fewest exercises, so a name left here still
> reached a batch — R1's first of all.

> **`EXISTS` / `NOT EXISTS` are deliberately not drilled here** (removed 2026-08-28). They read as
> join vocabulary, but they are correlated subqueries: their bullets belong to Step 5 (`IN` vs
> `EXISTS`, `Correlated subquery`) and Step 4 (`NOT IN` with `NULL`, which prescribes `NOT EXISTS`).
> The prompt greps this step's `**Focus:**` line, so leaving them there would have generated
> subquery exercises four steps before the syntax is taught. The anti-join itself is still drilled in
> run 1, through the `LEFT JOIN ... IS NULL` bullet that is genuinely this step's.

> **Two runs, un solo `TOPIC`.** Solo este step y el Step 2 (`group-by` dos veces) son así, y por eso
> en ambos cada run declara su **rango de ejercicios**: es el único dato en disco con el que el prompt
> puede saber cuál de los dos le estás pidiendo. El prompt elige el primer rango que aún no esté
> escrito entero. (Hasta el 2026-10-07 esto decía que este era el único step así.)

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
- [ ] Qualified column references — use `alias.column` when more than one input exposes the same name and whenever qualification makes a multi-table query unambiguous
- [ ] `SELECT *` vs named columns — specify the required columns in application code; `SELECT *` can fetch unnecessary data and makes the result shape change whenever the schema changes
- [ ] `UNION` vs `JOIN` — a union stacks rows from two result sets that share a shape, while a join widens each row with columns from a related table; "combine two tables" is ambiguous and picking the wrong one produces a result of the wrong shape, not merely the wrong size

**Pending additions:** none

**Done:** `Review: sql-grade scores ≥ 80% on 03-joins.sql`

> Revision point **R1** (doctrine §8b) fires here, and it is the one with the most behind it: 52
> exercises across `01-basics`, `02-execution-order-set-ops` and `03-joins`, the largest un-revised run
> in the track. It is also the first point at which `MISTAKES.md` has rows from more than one file, so it
> is the first time the focus mechanism has anything to choose between.

---

### Step 2 — Aggregates and grouping (0 scored / 20 target)

**Why here:** it needs the join from Step 1, because the surface a screening asks you to aggregate is
almost never a single table — and with joins + aggregation you can already answer the second question
of a technical test.
**Exercises:** `practice/sql/junior/04-aggregates.sql` — 20 (runs of 11 and 9)
**Coverage:** `Aggregates and grouping` (the pure-aggregation half — the three bullets that only exist because a join came first are Step 3)
**Reinforces:** Step 1 — a join is the surface `GROUP BY` almost always sits on top of
**Moment 2 config:** run 1 — `TOPIC = group-by`, `COUNT = 11` — **rango `#01–#11`**
**Focus:** `COUNT(*)` vs `COUNT(column)`, `SUM`/`AVG`/`MIN`/`MAX` ignoring `NULL`, aggregates on empty input (`COUNT` → `0`, the others → `NULL`; recognise the `NULL` — `COALESCE` is Step 4's), the `GROUP BY` rule, grouping by an id rather than a display name, `GROUP BY` with `NULL`, `GROUP BY` vs `SELECT DISTINCT` — aggregated over one table or an `INNER JOIN`; a `LEFT JOIN` under `GROUP BY` (zero-match groups, `COUNT(*)` after it) is Step 3's
**Moment 2 config:** run 2 — `TOPIC = group-by`, `COUNT = 9` *(append al mismo archivo)* — **rango `#12–#20`**
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
**Focus:** `ON` vs `WHERE` with an outer join, `COUNT(*)` vs `COUNT(column)` after a `LEFT JOIN`, `COUNT(DISTINCT)` as the repair for a legitimate multiplication, `GROUP BY` with `LEFT JOIN` and zero-match groups, fan-out inflating a `SUM` — recognised and explained, never repaired: aggregating in a derived table before the join is Step 5's

**Concepts:** condition in `ON` vs in `WHERE`, the `WHERE` filter that silently turns a `LEFT JOIN` into an
`INNER JOIN`, fan-out inflating `SUM` (recognised here; repaired by pre-aggregation in Step 5), `COUNT(*)` returning 1 instead of 0 after a `LEFT JOIN`,
`COUNT(DISTINCT)` as the repair for a legitimate multiplication, `GROUP BY` after a `LEFT JOIN`,
accidental cross joins, deliberate `CROSS JOIN`.

**Why it sits after aggregation, not next to joins.** Every item on that list is an aggregate: fan-out
is a wrong `SUM`, the `COUNT(*)`/`COUNT(column)` trap is a wrong count, `COUNT(DISTINCT)` is a wrong
count repaired.
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
negation both dropping the same row, `NOT IN` with a `NULL` in a literal list (the subquery form waits for Step 5), `COALESCE`, `NULLIF` and
division by zero (over a `NUMERIC` numerator — integer division and the cast that fixes it are Step 10's).

> **`NOT EXISTS` is named here but not drilled here** (2026-08-28). The `NOT IN` with `NULL` bullet is
> this step's — it is a three-valued-logic trap, not a subquery topic — and its own text prescribes
> `NOT EXISTS` as the repair. But `EXISTS` is correlated-subquery syntax and its bullets are Step 5's,
> so an exercise here asks him to **recognise that `NOT IN` silently returns no rows**, and names
> `NOT EXISTS` as the fix he will write in Step 5. Same ruling as Step 1's, for the same reason: the
> prompt greps `**Focus:**`, and this step's is `none — the whole topic`.

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

**Why here:** Step 3 left him a problem it could not solve — a fan-out that `COUNT(DISTINCT)` only
patches — and the real repair is aggregating in a derived table before joining, which is a subquery in
`FROM` and is taught here for the first time; and it is the
last of the four *query-side* topics `ROADMAP.md` calls test-relevant (joins · aggregation ·
NULL handling · subqueries/CTEs), so from here on a timed test can ask a whole realistic query.
**Exercises:** `practice/sql/junior/07-subqueries-ctes.sql` — 16 (two runs of 8)
**Coverage:** `Subqueries, CTEs, and views`
**Reinforces:** Step 3 — aggregating in a derived table before the join is the real repair for the fan-out `COUNT(DISTINCT)` only patched; Step 2 — a subquery in `FROM` is how you filter on an aggregate `WHERE` cannot see; Step 4 — `NOT EXISTS` is the repair for the `NOT IN`-with-`NULL` trap that step could only recognise
**Moment 2 config:** run 1 — `TOPIC = subqueries`, `COUNT = 8`
**Focus:** subquery in `WHERE`, derived table in `FROM`, scalar subquery in `SELECT`, `IN` vs `EXISTS`, correlated subqueries, subquery vs `JOIN`
**Moment 2 config:** run 2 — `TOPIC = ctes`, `COUNT = 8` *(append al mismo archivo)*
**Focus:** `WITH`, multiple chained CTEs, `CREATE VIEW`

**Concepts:** subquery in `WHERE` / `FROM` / `SELECT`, `IN` vs `EXISTS`, subquery vs `JOIN`, correlated subqueries
and when to rewrite one as `EXISTS`, a join or pre-aggregation, `WITH` and chained CTEs, `CREATE VIEW`.

> **Step 5 opens the query half of the gate, not the whole gate.** The fifth topic on `ROADMAP.md`'s
> list, DML basics, is Step 6, directly after this one, so the Stage-1 → Stage-2 switch is not open
> until Step 6 closes. (Moved out of `**Why here:**` on 2026-10-07, which Section C keeps to one
> sentence of placement reason; this is a caveat about the gate, not a reason for the position.)

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

### Step 6 — DML and transactions (0 scored / 16 target)

**Why here:** DML basics is the fifth topic `ROADMAP.md`'s Stage-1 → Stage-2 switch gate names, so it
follows the query half of that gate (Step 5) directly instead of waiting behind post-gate topics — and
nothing in it needs more than Step 5: finding duplicates is Step 2's `HAVING COUNT(*) > 1`, deleting
them keeping one is a Step 5 subquery, and it is where SQL meets the Spring Boot `@Transactional` the
interviewer will actually ask about.
**Exercises:** `practice/sql/junior/08-dml-transactions.sql` — 16 (two runs of 8)
**Coverage:** `DML — modifying data`, `Transactions`
**Reinforces:** Step 2 — `GROUP BY ... HAVING COUNT(*) > 1` is the duplicate-finding query; Step 5 — `DELETE ... WHERE id NOT IN (SELECT MIN(id) ... GROUP BY ...)` is how you delete duplicates keeping one
**Moment 2 config:** run 1 — `TOPIC = dml`, `COUNT = 8`
**Focus:** `INSERT` single and multi-row, `INSERT ... SELECT`, `RETURNING`, `UPDATE`/`DELETE` with `WHERE`, `DELETE` vs `TRUNCATE`, `ON CONFLICT`
**Moment 2 config:** run 2 — `TOPIC = transactions`, `COUNT = 8` *(append al mismo archivo)*
**Focus:** `BEGIN`/`COMMIT`/`ROLLBACK`, autocommit, ACID, `SAVEPOINT`, the aborted-transaction state, isolation and `READ COMMITTED`

**Concepts:** `INSERT` (single, multi-row, `INSERT ... SELECT`, `RETURNING`), insert order with foreign keys,
`UPDATE`/`DELETE` and the missing-`WHERE` catastrophe, `DELETE` vs `TRUNCATE`, `ON CONFLICT`
upsert, finding duplicates and deleting them keeping one with a subquery
(`DELETE ... WHERE id NOT IN (SELECT MIN(id) ... GROUP BY ...)`). Then `BEGIN`/`COMMIT`/`ROLLBACK`,
autocommit, ACID, `SAVEPOINT`, the aborted-transaction state, isolation levels, and a multi-statement
change written as the one transaction a `@Transactional` service method would open.

One step because in practice you learn transactions by wrapping a destructive `UPDATE` in one.

> **Moved from Step 8 on 2026-10-07** (`REC-288`, ruled by Victor). It used to sit after dates/strings
> and window functions, held there by one claim: that deleting duplicates keeping one needs
> `ROW_NUMBER()`. That was a `**Concepts:**` item with no coverage bullet, and the subquery form above
> needs nothing past Step 5 — `MIN(id)` over a primary key is never `NULL`, so Step 4's `NOT IN` trap
> does not fire. The `ROW_NUMBER()` form is now a Step 8 Challenge that reinforces this step.

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

**Done:** `Review: sql-grade scores ≥ 80% on 08-dml-transactions.sql`

> **This closes the Stage-1 → Stage-2 gate.** Steps 1–6 are the five topics `ROADMAP.md` names; from
> here on every step is post-gate.

---

### Step 7 — Date and string functions (0 scored / 12 target)

**Why here:** its scalar half (`||`, `TRIM`, `SUBSTRING`, `::`) is drillable from Step 0 and is not what
places it — the half that earns the step is `GROUP BY DATE_TRUNC('month', ...)`, grouping by an
expression, which cannot be written before Step 2 — and it waits for the gate (Step 6) because
`ROADMAP.md` counts PostgreSQL specifics among what is *not worth delaying simulations for*, then opens
the post-gate half ahead of window functions and the capstone because a live exercise stalls on a raw
`TIMESTAMP` long before it stalls on `ROW_NUMBER`.
**Exercises:** `practice/sql/junior/09-dates-strings.sql` — 12
**Coverage:** `PostgreSQL specifics`, `Common string functions`
**Reinforces:** Step 2 — `GROUP BY DATE_TRUNC('month', ...)` is `GROUP BY` on an expression instead of a column; Step 6 — `NOW()` and `CURRENT_DATE` stay fixed inside a `BEGIN` … `COMMIT`
**Moment 2 config:** `TOPIC = dates-strings`, `COUNT = 12`
**Focus:** `DATE_TRUNC` and grouping by month, `EXTRACT`, `INTERVAL` arithmetic, `NOW()` vs `CURRENT_DATE`, `::` casting a `TIMESTAMP` in `WHERE` and `JOIN` conditions, standard SQL vs vendor extensions, and one exercise each for `||` with `NULL` propagation, `LOWER`/`UPPER`, `TRIM`, `LENGTH`, `SUBSTRING` and `REPLACE` — the index caveats inside the `EXTRACT` and `LOWER`/`UPPER` bullets are Step 11's sargability and are not drilled here

**Concepts:** `DATE_TRUNC` and grouping by month, `EXTRACT`, `INTERVAL` and date arithmetic,
`NOW()` vs `CURRENT_DATE`, `::` casting a `TIMESTAMP` to a `DATE`, standard SQL vs vendor extensions,
`||` concatenation, `SUBSTRING`, `TRIM`, `UPPER`/`LOWER`, `REPLACE`, `LENGTH`.

**This step owns the whole `PostgreSQL specifics` and `Common string functions` coverage sections.**

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

**Done:** `Review: sql-grade scores ≥ 80% on 09-dates-strings.sql`

> Revision point **R3** (doctrine §8b) fires here: subqueries and CTEs, DML and transactions, and dates
> now sit on a core that has had months to decay — R3 is the hard checkpoint over the last two gate
> topics and the first post-gate step — and the mistake log is the only honest record of what slipped.

---

### Step 8 — Window functions (0 scored / 12 target)

**Why here:** a window is only explainable against what `GROUP BY` collapses (Step 2) and against
execution order (Step 0), and its signature use — keeping the `rn = 1` row per group — is filtered in
an outer derived table or CTE because a window cannot sit in `WHERE`, which is Step 5's syntax; it is
asked *after* the core in a screening, as the "and can you also…" question, never as the opener, which
is why it sits behind the whole gate (Steps 1–6).
**Exercises:** `practice/sql/junior/10-window-functions.sql` — 12
**Coverage:** `Window functions`
**Reinforces:** Step 2 — a window keeps the rows `GROUP BY` collapses; Step 0 — execution order explains why a window cannot sit in `WHERE`, and `DISTINCT ON` is the PostgreSQL form `ROW_NUMBER() = 1` is set against; Step 5 — the `rn = 1` and top-N filters are a derived table or CTE over the windowed query; Step 6 — `ROW_NUMBER()` is the window form of deleting duplicates keeping one, rewriting that step's `NOT IN (SELECT MIN(id) ...)`
**Moment 2 config:** `TOPIC = window-functions`, `COUNT = 12`
**Focus:** none — the whole topic

**Concepts:** `ROW_NUMBER`, `RANK` vs `ROW_NUMBER` on ties, `SUM() OVER (PARTITION BY ...)`, why a window
function cannot appear in `WHERE`, window vs `GROUP BY`, `DISTINCT ON` vs `ROW_NUMBER() = 1`, one row
and the top N rows per group, "the second highest value", and — as a Challenge over Step 6 — deleting
duplicates keeping one with `ROW_NUMBER()`.

> **`DENSE_RANK`, `LAG`/`LEAD` and window frames are deliberately not drilled here** (removed from this
> list 2026-10-07). All three are bullets of `notes/sql/coverage/middle.md` — `DENSE_RANK()` vs
> `RANK()`, `LAG()` and `LEAD()`, `Window frames` — so they are middle's to claim, not this step's to
> drill. The first-pass batch never generated them: `**Focus:**` is `none — the whole topic`, and the
> topic is scoped by the four junior bullets below. What the names did here was reach a revision
> batch, whose last-resort focus is the `**Concepts:**` that appeared in the fewest exercises — which
> would have been exactly these three.

**Coverage bullets:**

- [ ] `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` — assign a deterministic sequence within each partition, such as selecting one latest row per group in an outer query
- [ ] `RANK()` vs `ROW_NUMBER()` — `RANK()` gives tied rows the same number and skips the next (1, 1, 3); `ROW_NUMBER()` always gives a unique number regardless of ties (1, 2, 3); when you need exactly one row per group, use `ROW_NUMBER()`
- [ ] Aggregate result vs window result — `GROUP BY` collapses each group into one row, while an aggregate with `OVER` preserves every input row and adds a value calculated over its window
- [ ] `DISTINCT ON` vs `ROW_NUMBER() = 1` — both answer "one latest row per group"; `DISTINCT ON` is shorter but PostgreSQL-only and ties its result to `ORDER BY`, while the window form is portable and can keep the rank as a column or take more than one row per group

**Pending additions:** none

**Done:** `Review: sql-grade scores ≥ 80% on 10-window-functions.sql`

---

### Step 9 — Schema design: constraints and modelling (0 scored / 15 target)

**Why here:** a constraint is only meaningful once you have written the `UPDATE` it blocks (Step 6)
and met the `NULL` it treats specially (Step 4) — and it is late because a screening asks you to
*query* first and to *model* second, usually only in the second interview.
**Exercises:** `practice/sql/junior/11-schema-design.sql` — 15 (runs of 10 and 5)
**Coverage:** `Schema design`
**Reinforces:** Step 4 — `NULL` in a `UNIQUE` constraint and in a `CHECK`; Step 6 — a constraint violation is the race an application check cannot win, and `ON CONFLICT` is how you handle its verdict
**Moment 2 config:** run 1 — `TOPIC = schema-design`, `COUNT = 10`
**Focus:** primary and foreign keys, primary key vs `UNIQUE`, `ON DELETE` / `ON UPDATE`, `NOT NULL`, `UNIQUE`, composite uniqueness, `CHECK` with `NULL`, constraint vs application-side check — constraints read from the table definitions each exercise carries and triggered with Step 6's `INSERT`/`UPDATE`/`DELETE`, never written with `CREATE TABLE`/`ALTER TABLE` (Step 10)
**Moment 2 config:** run 2 — `TOPIC = normalization`, `COUNT = 5` *(append al mismo archivo)*
**Focus:** one-to-many and many-to-many modelling, natural vs surrogate keys, normalization and the anomalies it prevents — the update/insert/delete anomaly only, no 1NF/2NF/3NF by name (middle) — reading a relational schema, by reading the schema rather than writing DDL

**Concepts:** primary and foreign keys, primary key vs `UNIQUE`, which side of a 1:N carries the FK,
composite keys on a junction table, `ON DELETE` and `ON UPDATE` behaviour, `NOT NULL` / `UNIQUE` /
`CHECK`, a concurrent duplicate that passes an application-side check and is rejected by the constraint, natural vs surrogate keys,
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

### Step 10 — Data types and DDL (0 scored / 17 target)

**Why here:** it writes by hand the constraints Step 9 only reasoned about, so it needs that step
first — DDL before modelling would produce syntax with nothing to say about why the column is
`NOT NULL` — while its `Data types` half is not what places it, since nothing there needs more than
Step 6: sequence drift is that step's `INSERT` given an explicit `id`, against the identity column this
same run teaches.
**Exercises:** `practice/sql/junior/12-data-types-ddl.sql` — 17 (runs of 12 and 5)
**Coverage:** `Data types`, `Schema operations`
**Reinforces:** Step 9 — every constraint from that step is now written by hand in `CREATE TABLE`; Step 6 — its `INSERT` leaves the generated `id` out, and sequence drift is what supplying it anyway leaves behind
**Moment 2 config:** run 1 — `TOPIC = data-types`, `COUNT = 12`
**Focus:** `VARCHAR` vs `TEXT`, `CHAR(n)` padding, identity vs `SERIAL`, sequence drift and `setval`, `NUMERIC` vs `FLOAT`, integer division and casts, `ROUND` on `NUMERIC`, scale of an expression's result, `DATE` vs `TIMESTAMP`/`TIMESTAMPTZ`, `TIMESTAMP` vs `TIMESTAMPTZ`, `BOOLEAN`, `JSONB` recognition
**Moment 2 config:** run 2 — `TOPIC = ddl`, `COUNT = 5` *(append al mismo archivo)*
**Focus:** `CREATE TABLE` with defaults and constraints, `ALTER TABLE`, adding a constraint to a populated table in two ordered statements, `DROP` vs deleting rows, `DEFAULT`

**Concepts:** `NUMERIC` vs `FLOAT`, `TIMESTAMP` vs `TIMESTAMPTZ`, `DATE` for a business day, `VARCHAR` vs `TEXT`,
`CHAR(n)` padding, `SERIAL` vs `IDENTITY`, a sequence left behind by explicit-id inserts and its
`setval` repair, `BOOLEAN`, `JSONB` vs a real table, integer division and
explicit casts, `ROUND` on `NUMERIC` and how a `NUMERIC` scale propagates out of an expression. Then
writing `CREATE TABLE` / `ALTER TABLE` / `DROP` and `DEFAULT` by hand, and the two-statement order a
constraint added to a table that already holds rows forces.

Written, not queried: the deliverable is a schema you can produce from a blank editor, because
`ddl-auto` has been doing it for you in TimeTrack.

**Coverage bullets:**

- [ ] `VARCHAR(n)` vs `TEXT` — both have identical storage performance in PostgreSQL; `VARCHAR(n)` documents an intended maximum length; `TEXT` is for content with no meaningful upper limit; the practical difference is intent, not performance
- [ ] `CHAR(n)` blank padding — a fixed-length column stores every shorter value padded with trailing spaces, then ignores those spaces when comparing and when reporting `length()`; expect it in inherited Oracle and legacy schemas rather than choosing it for new columns
- [ ] Integer identity columns vs `SERIAL` — `GENERATED ... AS IDENTITY` is the SQL-standard PostgreSQL choice for generated integer keys; `SERIAL` is legacy shorthand that creates a separate sequence and default, while `BIGINT`/`BIGSERIAL` widen the range
- [ ] Sequence drift after explicit-id inserts — rows copied or inserted with their own ids do not advance the column's sequence, so the next generated key collides with an existing row; realign it with `setval` past the current maximum, which a data-only `pg_dump` emits for each sequence it copies
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

**Done:** `Review: sql-grade scores ≥ 80% on 12-data-types-ddl.sql`

> **The done condition was a `pgAdmin:` check that three named tables exist until 2026-10-08.** Three
> bare `CREATE TABLE` statements passed it, so the twelve exercises of the `data-types` run gated
> nothing (B6), and running the whole file was fragile — the populated-table `SET NOT NULL` failure and
> the sequence-drift collision are errors by design. The scored format covers both runs.

> Revision point **R4** (doctrine §8b) fires here, on the `Review:` condition above.
> Its span is Steps 8–10: window functions, schema design and DDL — the first post-gate query topic and
> the two modelling steps. (Re-derived 2026-10-07 under `REC-288`: until DML and transactions moved to
> Step 6, this span was DML, transactions, schema design and DDL.)

---

### Step 11 — Indexes and query plans (0 scored / 12 target)

**Why here:** you cannot read a plan for a query shape you cannot yet write, and its sargability half
is Step 7's functions (`LOWER`, `EXTRACT`, `::`) and Step 0's leading-`%` `LIKE` wrapped around an
indexed column; it needs Step 10's DDL because `CREATE INDEX` is written beside the `UNIQUE` and
`PRIMARY KEY` that already create one.
**Exercises:** `practice/sql/junior/13-indexes.sql` — 12
**Coverage:** `Performance basics`
**Reinforces:** Step 10 — `UNIQUE` and `PRIMARY KEY` create their index automatically; Step 1 — the join column is the one that needs one
**Moment 2 config:** `TOPIC = indexes`, `COUNT = 12`
**Focus:** none — the whole topic

**Concepts:** what an index is and its write cost, when to add one, why PostgreSQL does not index a foreign key
column, when not to index, non-sargable predicates, leading-wildcard `LIKE`, reading `EXPLAIN` for a
`Seq Scan` against an `Index Scan`, when a `Seq Scan` is correct.

> **Composite-index column order, `EXPLAIN ANALYZE` with estimated vs actual rows, and the join node
> types are deliberately not drilled here** (removed from this list 2026-10-07). They are middle's
> `Query diagnosis` bullets — `Composite-index design`, `EXPLAIN ANALYZE`, `Plan operators and row
> estimates` — and this level's `EXPLAIN` bullet stops at telling a `Seq Scan` from an `Index Scan`,
> which is also all the done condition below asks for. Same ruling, and same reason, as Step 8's.

**Coverage bullets:**

- [ ] What an index is — an auxiliary access structure that can speed reads at the cost of storage and write maintenance; B-tree is PostgreSQL's common ordered index, while other index methods serve different operators
- [ ] When to add an index — columns frequently used in `WHERE`, `JOIN ON`, or `ORDER BY` on large tables; when you see a `Seq Scan` on a large table in `EXPLAIN` output
- [ ] Foreign-key indexes — PostgreSQL indexes the referenced primary or unique key but not the referencing foreign-key columns automatically; add an index when joins or parent deletes need to find dependent rows efficiently
- [ ] When NOT to index — avoid indexes without a measured access pattern, especially on small tables or frequently updated columns; low cardinality alone is not decisive because a partial or composite index can still be selective
- [ ] `EXPLAIN` — shows the query plan and whether an index is being used; `Seq Scan` means every row is read; `Index Scan` means the index was used; run this when a query is slow before adding an index
- [ ] Sargable predicates — compare an indexed column directly to a compatible value or range when possible; wrapping the column in a function or starting a pattern with `%` can prevent a normal B-tree index from narrowing the scan

**Pending additions:** none

**Done:** `Review: sql-grade scores ≥ 80% on 13-indexes.sql`

> **The done condition was a `pgAdmin:` `EXPLAIN` check over a seeded `time_entries` until 2026-10-08.**
> Two readers could grade it differently — ~100 matching rows spread across pages normally plan as a
> `Bitmap Heap Scan`, not the `Index Scan` it named — and it presumed a `time_entries` seed this file's
> bookstore schema does not carry. The scored format is the one every other query step uses (B6).

---

### Step 12 — Working with a live database and reading errors (0 scored / 12 target)

**Why here:** its error half is Step 9's constraints firing — `23505`, `23503`, `23502` and `23514` are
that step's `UNIQUE`, foreign key, `NOT NULL` and `CHECK` returning a verdict, so those must already be
understood — and it is the last topic step because only the capstone builds on it: reading a schema's
tables, keys and nullability before writing a query is the first move of every capstone requirement.
**Exercises:** `practice/sql/junior/14-live-database.sql` — 12
**Coverage:** `Working with an existing database`, plus `Querying basics` (`SQL string literals vs quoted identifiers` — the case-folding rule behind `relation "Users" does not exist`)
**Reinforces:** Step 9 — every error message here is a constraint from that step firing
**Moment 2 config:** `TOPIC = live-database`, `COUNT = 12`
**Focus:** none — the whole topic

**Concepts:** pgAdmin's object browser, `information_schema` and catalog views, the `public` schema and
`search_path`, roles and `GRANT`/`REVOKE`, recognising triggers and stored procedures in an inherited
database, quoted identifiers and case folding. Then the error text and SQLSTATE of each class the two
error bullets name (`23505`, `23503`, `23502`, `23514`, failed casts, missing or ambiguous names), and
PostgreSQL refusing implicit casts.

> **Its inspection half could genuinely have been drilled earlier** (B3, noted 2026-08-28) —
> `information_schema`, `search_path`, `\dt` and `GRANT`/trigger recognition need nothing past Step 0.
> The position is bought by the error half and by the capstone adjacency, not by them, and this file
> used to claim otherwise ("needs a query vocabulary wide enough to know what to look for"), which was
> a label rather than a dependency. (Moved below `**Concepts:**` on 2026-10-08, out of the field block
> Section C keeps contiguous — the same move Step 5's gate caveat got on 2026-10-07.)

**Coverage bullets:**

- [ ] Schema inspection — use a SQL client's object browser and `information_schema` or PostgreSQL catalog views to discover columns, types, nullability, keys, and constraints before querying an unfamiliar database
- [ ] Database schemas and qualified relation names — schemas namespace objects inside a database; recognise `schema.table` and the role of the search path when inherited code resolves the wrong table or cannot find a relation
- [ ] Syntax and name-resolution errors — use the reported position and identifiers to fix malformed syntax, missing relations or columns, and ambiguous references
- [ ] Type and constraint errors — distinguish failed casts or incompatible operators from `NOT NULL`, `UNIQUE`, `CHECK`, and foreign-key violations
- [ ] `GRANT` and `REVOKE` recognition — understand that roles receive object privileges such as `SELECT`, `INSERT`, `UPDATE`, and `DELETE`, and that application connections should not require superuser access
- [ ] Stored-procedure recognition — maintained databases can expose named server-side routines; writing complex procedural SQL is project-specific rather than a junior floor
- [ ] Trigger recognition — DML can automatically execute trigger logic that is not visible in the application statement, so inspect triggers when an insert, update, or delete has unexpected side effects
- [ ] SQL string literals vs quoted identifiers — single quotes delimit values, while double quotes delimit case-sensitive or otherwise special identifiers; unquoted PostgreSQL identifiers fold to lowercase

**Pending additions:** none

**Done:** `Review: sql-grade scores ≥ 80% on 14-live-database.sql`

> **The done condition was `Terminal: \dt inside psql produces users, projects and time_entries` until
> 2026-08-28, and it gated nothing**: TimeTrack's database already exists from project 07, so it passed
> before a single exercise of this step was answered. It tested that a database was present, not that
> the step had been drilled — and it is what fires R5. The scored format is the one every other query
> step uses and is testable by someone else (B6).

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
**Reinforces:** Steps 1, 2 and 5 above all — a report query is a join whose grain is chosen first, a `GROUP BY` over it, and a CTE or derived table when the aggregate has to be computed before it is filtered; this is the integration step and it composes every earlier one
**Moment 2 config:** `TOPIC = report-queries`, `COUNT = 8`
**Focus:** report queries from prose (grain first, join path, zero-row groups, control-query check), plus finding and fixing the defect in a given statement — a missing join condition, `= NULL`, a date range losing its boundary rows, an unbounded `UPDATE`/`DELETE`, an `OFFSET` page with no tie-breaker, a value concatenated into the SQL string where a placeholder belongs — identified and its fix named as a bound placeholder, not executed through `PREPARE`/`EXECUTE`, which no step teaches

**Concepts:** no new syntax. Timed exercises that hand you a requirement in prose and expect the whole
query: deciding the result grain first, mapping the requirement onto the clause skeleton, choosing the
driving table so zero-row groups survive, `COALESCE(SUM(...), 0)`, bound parameters instead of
interpolated values, verifying a report total against a simpler control query, and reviewing the result
for the four classic failures — join, predicate, mutation and pagination.

Nothing extra to add to the config: what the prompt's `report-queries` topic builds — its setup block,
how its exercises are labelled, the time target each one states — is the exercise prompt's to say
(`notes/prompts/practice/sql/_internal/_sql-exercises-practice.md` Step 2 and the `REPORT-QUERIES` block
of `_sql-exercise-seeds.md`), not this step's. (Moved below `**Concepts:**` on 2026-10-08, out of the
field block Section C keeps contiguous.)

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

**Only grading moves a status** — never the written count, never the merely answered one, and never the
scored count on its own: *scored* (§1's third definition) is graded at any verdict, counted once, so a
step can have its whole first-pass target scored and still be open. A row moves to `closed ✅` when its
step's done condition (§2) passes and not before — for a `Review:` step, a `sql-grade` run scoring
≥ 80%, the threshold being on the run's score and not on the count. A re-grade can pass that condition
without raising the count, and a row that reads `closed ✅` is never set back (doctrine invariant 14).
(Corrected 2026-10-07: this used to say status is driven by the scored count.)

| Step | Topic | Exercises file | Scored / target | Status | Técnicas que desbloquea al cerrar |
|------|-------|----------------|-----------------|--------|-----------------------------------|
| 0 | Querying basics | `01-basics.sql` + `02-execution-order-set-ops.sql` | 20 / 30 *(01: 20/20 closed, 40/40 correct 2026-07-22 incl. 20 repaso; 02: 0/10)* | in progress ⏳ | `SELECT`/`WHERE`/`ORDER BY`, orden de ejecución, operaciones de conjuntos |
| 1 | JOINs | `03-joins.sql` | 0 / 22 | not started | JOINs de todo tipo |
| 2 | Aggregates and grouping | `04-aggregates.sql` | 0 / 20 | not started | `GROUP BY` / `HAVING` / agregados |
| 3 | JOIN pitfalls | `05-join-pitfalls.sql` | 0 / 12 | not started | Diagnóstico de fan-out y multiplicación de filas |
| 4 | NULL and three-valued logic | `06-nulls.sql` | 0 / 12 | not started | Manejo de `NULL`, `NOT IN` con nulos |
| 5 | Subqueries, CTEs, views | `07-subqueries-ctes.sql` | 0 / 16 | not started | Subconsultas, CTEs, vistas |
| 6 | DML and transactions | `08-dml-transactions.sql` | 0 / 16 | not started | DML y transacciones |
| 7 | Date and string functions | `09-dates-strings.sql` | 0 / 12 | not started | Funciones de fecha y texto, `DATE_TRUNC` |
| 8 | Window functions | `10-window-functions.sql` | 0 / 12 | not started | Window functions |
| 9 | Schema design | `11-schema-design.sql` | 0 / 15 | not started | Diseño de esquema y normalización |
| 10 | Data types and DDL | `12-data-types-ddl.sql` | 0 / 17 | not started | Tipos y DDL escrito a mano |
| 11 | Indexes and query plans | `13-indexes.sql` | 0 / 12 | not started | Índices y planes de ejecución |
| 12 | Live database and errors | `14-live-database.sql` | 0 / 12 | not started | — |
| 13 | Report queries (capstone) | `15-report-queries.sql` | 0 / 8 | not started | — |

**20 of 216 first-pass exercises scored** (Step 0's `#01–#20`, all correct), plus a
20-exercise review batch that does not count. This table is the record of each step's status — the
one the readiness line below and the simulation track read — and `PROGRESS.md` → `### Exercise route`
is its projection (doctrine invariant 15). Both are updated by the doctrine §4 ritual, in the same
commit. Review batches never change a row here.

### Readiness de simulaciones — qué se puede pedir hoy

La última columna es lo que el track de simulaciones lee de este nivel. La regla que la gobierna vive en
la doctrina §8c y no se repite aquí; lo que vive aquí es el mapeo, porque **reordenar los steps mueve la
fila y se lleva su técnica consigo** — un reorder no puede dejar la readiness mintiendo. Una celda `—`
significa que ese step no desbloquea ninguna técnica sobre la que un test pueda medirse; los Steps 12 y
13 son ese caso, uno es operar contra una base viva y el otro es la integración de todo lo anterior.

**Estado hoy (2026-08-28): 0 steps `closed ✅` → ninguna simulación SQL todavía.** El primer test toca al
cerrar el **Step 2**: basics + joins + `GROUP BY` ya es un examen real.

---

## Out of scope at this level

**None — every one of the 152 bullets in `notes/sql/coverage/junior.md` is claimed by exactly one step.**
The exclusions this plan used to carry disappeared with the 2026-08-03 coverage recalibration rather
than being reversed: the old `Programmable database objects` section, deliberately skipped, was rewritten
into two *recognition* bullets inside `Working with an existing database` (`Stored-procedure recognition`
and `Trigger recognition`), and recognition is exactly what Step 12 drills — spotting a trigger as the
cause of an unexplained side effect, not writing PL/pgSQL. Scope beyond junior is not excluded here
either — it was never claimed: it lives in `notes/sql/coverage/middle.md` and `senior.md`, which are
other levels' routes to claim, not this one's to exclude.
