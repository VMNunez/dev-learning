# `sql-exercises` — MODE = practice branch

**Internal component of `sql-exercises-prompt.md`. Not runnable on its own** — it assumes the shell has
already resolved `{FILE}`, `{COUNT}`, `{FOCUS}` and `{REVIEW}`, read `notes/prompts/_internal/_session-rules.md`, `PLANNING.md`,
`PROGRESS.md` and `coverage/{LEVEL}.md`, and printed the resolution block.

Split out 2026-07-22: a run is either practice or review, never both, so carrying the other branch was
~40% of the file for nothing. The shell reads only the branch its `MODE` names.

`MODE = reinforce` reads this branch too, with `{REVIEW} = yes` and the file Victor named. Everything
here applies unchanged except where a rule names that mode explicitly.

---

## MODE = practice

---

### Step 1 — Check existing state

**PROGRESS.md:** read the SQL section. Find the `### Exercises completed` table and look for the row
**whose `Folder` cell is `{FILE}`** — match on the path, never on the `Topic` cell. The Topic cell is
free prose that has already drifted (`basics / SELECT (part 2)` is the row for `TOPIC = basics`), and a
name match silently misses it and appends a duplicate row. If that row's Status begins with `solid ✅`
or `closed ✅`, print:
"Este tema ya está marcado como sólido en PROGRESS.md. ¿Quieres más ejercicios de todos modos?
Responde sí para continuar, o no para salir."
Stop and wait for Victor's response. **Skip this question entirely when the shell resolved
`MODE = reinforce`**: it asks whether he wants more exercises on a topic already marked solid, which is
the one thing that mode is *for*. The schema and legacy-format checks below still run — those protect
the file, not the schedule.
- If he responds with any affirmative (sí, si, yes, SÍ, claro, of course, etc.): continue to Step 2.
- If his response is not affirmative, or he does not respond: print nothing else and stop.

**Existing file:** check whether `{FILE}` (already resolved by the shell) exists.
- If it exists: read it and find the highest exercise number, checking **both** formats:
  - current format — lines matching `-- Exercise [number] [`
  - **legacy format** — lines matching `-- #[number] |` (used by `01-basics.sql`, the only file left
    in it — written by hand before this prompt existed, and now closed)

  Take the highest number found across both patterns — call it N. New exercises start from N+1. If
  neither pattern matches (the file has only a setup block), set N = 0. Do NOT regenerate the setup
  block in either case.

  **If the file is in the legacy format, say so before generating:**
  "Este archivo está en el formato antiguo (`-- #NN |`, sin marca `-- Your answer:`). Los ejercicios
  nuevos usarán el formato actual, así que el archivo quedará mixto — eso es normal y el modo review
  lo maneja: lee ambos formatos y puntúa tus respuestas antiguas con normalidad. La única diferencia
  es que los ejercicios antiguos no pueden llevar la marca `-- ✅ Corregido`, así que se re-leen en
  cada review en vez de saltarse como cerrados. ¿Continúo? (sí / no)"
  Wait for an affirmative before continuing.

  **Then check the schema, which is a separate and more dangerous mismatch.** Read the setup block of
  the existing file and compare its `CREATE TABLE` statements against the canonical schema above.
  Compare table names *and* column names — a file can be in the current exercise format and still
  carry an obsolete schema.

  If they differ, **stop and ask before generating a single exercise**. This step exists because the
  rule above forbids regenerating the setup block, so without this check the new exercises reference
  columns that do not exist in Victor's database and not one of them runs in pgAdmin.

  Print the concrete diff — missing tables, and columns whose name differs (e.g. `nationality` vs
  `country`, `year` vs `published_year`) — then:

  "El bloque SETUP de este archivo no coincide con el esquema canónico: [diff]. Si genero contra el
  canónico, los ejercicios nuevos no correrán en tu pgAdmin. Dos opciones:
   (A) Genero contra el esquema que ya tiene el archivo — los ejercicios corren, pero se pierden los
       conceptos que ese esquema no soporta (indícolos: [list, e.g. fan-out sobre `quantity`]).
   (B) Añado un bloque SETUP nuevo con el esquema canónico al final del archivo, antes de los
       ejercicios nuevos. Corre ese bloque en pgAdmin y a partir de ahí todo usa el canónico; los
       ejercicios antiguos dejarán de correr, aunque siguen siendo puntuables.
   ¿A o B?"

  Wait for the answer. On (A), use the file's own schema as the canonical one for this run and say so
  in the self-report bullet 1. On (B), emit the new setup block with a banner
  `-- ===== SETUP v2 — esquema canónico (los ejercicios anteriores usan el esquema v1) =====`.
- If the file does not exist: set N = 0 and generate the complete file including the setup block.

---

### Step 2 — Generate the setup block (new files only)

Skip this step if the file already exists.

**Revision-point files (`R{n}-repaso.sql`) always ship the canonical bookstore setup block**, even when
their span includes `01-basics.sql`, which carries the old v1 schema. One file, one schema: re-express
the failed v1 concepts against the canonical columns rather than reviving a schema that is closed. If a
concept cannot be re-expressed (it depended on a v1-only column), drop it and say so in one line.

**Self-contained topics — no bookstore setup block:** for `schema-design`, `normalization`,
`data-types` and `ddl`, do NOT generate the bookstore setup block. Each exercise in these topics
carries its own table definitions. For a new file of one of these topics, generate only the
header comment and the `-- EXERCISES: {TOPIC}` banner, then go straight to Step 3.

**`report-queries` uses the TimeTrack model, not the bookstore.** Generate a setup block with
`users`, `projects` and `time_entries` mirroring `projects/07-timetrack` (a `Role` enum on users, an
`EntryStatus` of DRAFT/SUBMITTED/APPROVED/REJECTED on entries, `hours NUMERIC(5,2)`, `work_date DATE`),
seeded across at least 6 distinct months and including a project with zero entries so a `LEFT JOIN`
report has an empty group to preserve.

The rest of this step applies to the bookstore-based topics: `basics`, `joins`, `join-pitfalls`,
`group-by`, `nulls`, `subqueries`, `ctes`, `dates-strings`, `window-functions`, `dml`, `transactions`,
`indexes`, `live-database`.

Generate a complete setup block that Victor can paste and run in pgAdmin.

Format:
```sql
-- ================================================================
-- SETUP — Paste and run this section first in pgAdmin
-- FIRST: In pgAdmin, create a database called 'bookstore' if you haven't already.
-- Open that database, then run this entire block inside it.
-- You can re-run it at any time to reset the data to its original state.
-- ================================================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

-- Create tables
CREATE TABLE authors ( ... );
...

-- Insert sample data
INSERT INTO authors (name, country, birth_year) VALUES
  (...),
  ...;
...

-- ================================================================
-- EXERCISES: {TOPIC}
-- ================================================================
```

Use the exact column definitions from the canonical schema above.
Apply the topic-specific edge-case data requirements from the canonical schema section.

**Extra tables:** if the topic needs tables not in the canonical schema, add them after the
canonical tables with their own CREATE TABLE and INSERT INTO statements.

---

### Step 3 — Generate the exercises

Generate {COUNT} exercises for {TOPIC}, numbered starting from N+1.

**If FOCUS is set:** concentrate all exercises on the focused concept(s). Intro exercises
introduce that concept; Standard and Challenge explore its edge cases and combinations.
Do not cover other parts of the topic.

**If FOCUS is blank:** cover the full topic. `notes/sql/coverage/{LEVEL}.md` is the **single source of
truth for concept scope** — read the sections the {PLAN} §2 step declares (resolved as described below),
and ensure every concept item listed there is addressed across the exercises. The topic-specific
rules further below are **exercise format, structural constraints, and concrete seeds** (e.g. the
BEGIN/ROLLBACK wrapper for DML, the four-task format for normalization, a specific Challenge to
build) — they are *not* the scope list and must never be read as one.

**Reconciliation rule — coverage/{LEVEL}.md always wins on scope.** The seed bullets below were written
once and coverage/{LEVEL}.md evolves; do not assume they still match. On any disagreement about *which
concepts* to cover, coverage/{LEVEL}.md is authoritative: include a concept it lists even if no seed
mentions it, and drop a seed concept coverage/{LEVEL}.md no longer lists. The seeds only ever supply
*format and concrete examples* for the concepts coverage/{LEVEL}.md defines — treat a seed that names a
concept as an illustration, not as permission to add scope coverage/{LEVEL}.md dropped.

**Which sections to read — resolve them from the plan, never from a list kept here.** The {PLAN} §2 step
that owns {TOPIC} already declares them:

1. The path table in `sql-exercises-prompt.md` gives the **`Route step`** number for {TOPIC}.
2. That step's **`**Coverage:**`** line lists its coverage sections, verbatim. Those are the sections
   to read — all of them.
3. When the step carries two runs with different TOPICs (Steps 5, 8, 9, 10), the run's own
   **`**Focus:**`** line narrows the scope *within* those sections — that is where a half-section
   split lives (Step 5 run 1 is the subquery half of `Subqueries, CTEs, and views`; Step 9 run 2 is
   the 1NF/2NF/3NF items of `Schema design — modelling decisions`). The `Focus` resolution above
   already applies; this note only says where the narrowing comes from.

`{PLAN}` is the single source for all three of `COUNT`, `Focus` and `Coverage` —
the same rule `sql-exercises-prompt.md` states for paths and order: **on any disagreement the plan
wins and this prompt is the thing to fix.** A mapping duplicated here would drift the moment
`sql-plan-audit SCOPE = extend` added a step, and nothing audits a table that lives in a prompt.

Two stop conditions, both silent-scope-loss bugs if allowed to fall through to the seeds:

- **The step declares no `**Coverage:**` line** → stop and report it. The plan standard (B) requires
  one on every step; a step without it is a planning gap, exactly like a missing `COUNT`.
- **A section named on that line does not exist verbatim in `notes/sql/coverage/{LEVEL}.md`** → stop and
  report it. It means the plan and coverage have drifted apart, and `sql-plan-audit` is what fixes
  that, not this run.

A coverage section claimed by no step at all is likewise not this prompt's problem to paper over —
see PLANNING.md §Z ("Coverage sections deliberately excluded from the steps") for the ones that are
excluded on purpose, and run `sql-plan-audit` for the ones that are not.

**Difficulty distribution — applied to the batch of {COUNT} new exercises:**
Calculate the split based on COUNT, then assign labels to the new exercises in order:
- Intro:     first ⌈COUNT × 0.25⌉ exercises in the batch
- Standard:  next ⌈COUNT × 0.50⌉ exercises in the batch
- Challenge: remaining exercises in the batch

The batch starts at exercise N+1. Exercise N+1 is batch position 1, N+2 is position 2, and so on —
the distribution applies to batch positions, not to the absolute exercise numbers in the file.

Example for COUNT=12 (exercises N+1 through N+12): first 3 positions [Intro], next 6 [Standard], last 3 [Challenge].
Example for COUNT=6 (exercises N+1 through N+6): first 2 positions [Intro], next 3 [Standard], last 1 [Challenge].

**Guard — never leave Challenge empty:** because both Intro and Standard round up, some counts
leave Challenge at 0 (e.g. COUNT=5 → 2 Intro, 3 Standard, 0 Challenge). If the remainder for
Challenge is 0, move one exercise from Standard to Challenge so every batch has at least one
Challenge exercise. (COUNT=5 → 2 Intro, 2 Standard, 1 Challenge.)

Label each exercise with its level: `-- Exercise N [Intro]:`, `[Standard]:`, `[Challenge]:`.

**First-pass batches — resolved `{REVIEW} = no`. Every exercise must introduce a concept not already
drilled in this file.** Read the exercises already in `{FILE}` before generating: a batch that re-covers
ground the file already holds spends an hour of the 12:30 block buying nothing. This is derived from
`{REVIEW}`, not pasted into the config — the plan used to tell Victor to append the rule by hand, which
made it a line he could forget.

**Review batches — resolved `{REVIEW} = yes`.** A review batch is a deliberate second pass over
concepts already drilled (PLANNING.md Moment 2b). It changes two things and nothing else:
- **No Intro tier.** Split the batch 60% Standard / 40% Challenge. Re-doing `SELECT title FROM books`
  on a concept already passed teaches nothing — that is exactly how exercises #21–#40 of
  `01-basics.sql` bought only three new concepts for a whole hour of work.
- **Label them `-- Exercise N [Repaso]:`** instead of the level, so the file itself records which
  block was first-pass and which was review. Without the marker nothing distinguishes them later.

Also drop the new-concept restriction: deliberate repetition is the point of a review batch, so
covering ground already covered is correct here and only here. Review batches are **not** counted
against a step's target in {PLAN} §1 and never flip a status in {PLAN} §3 — say so in the closing
message: "Este lote es de repaso: no cuenta para el target del paso."

**Cross-topic integration rule:** for the bookstore-based query topics from nulls onward
(nulls, subqueries, ctes, dates-strings, window-functions, dml, transactions, indexes,
live-database), at least one Challenge exercise must combine the current topic with a concept from an
earlier topic — and **at least two from `subqueries` onward** ({PLAN} §2 raises the floor at
Step 5, where the surface is finally wide enough for a real composition). The step's `**Reinforces:**`
line names which earlier topic to combine with, so it is never a guess. Examples: a subquery Challenge that also requires a JOIN; a CTEs Challenge that uses
GROUP BY inside a CTE; a window functions Challenge that filters with a WHERE clause using
IS NULL. This rule does not apply to the self-contained design topics (schema-design, normalization,
data-types, ddl) — they have no shared query schema to integrate with. It does not apply to
`report-queries` either, where *every* exercise is an integration by definition.

**Format for each exercise:**
```sql
-- Exercise N [Level]: [short title]
-- [One or two lines describing what to return, in plain English]
-- [Any constraints — e.g. "exclude NULL values", "order by total DESC"]
-- Expected result shape: [e.g. "one row per author with their book count"]

-- Your answer:

```

Leave a blank line after "-- Your answer:" so Victor has space to write.

**Self-explanation on Challenge exercises:** every Challenge exercise adds one extra line
after the answer space, so Victor practises justifying his choice — the single most important
skill in a technical interview ("explain every line, not just write it"):
```sql
-- Your answer:


-- Why I chose this approach (one line — e.g. "LEFT JOIN keeps authors with zero books; INNER would drop them"):

```
Do NOT add this line to Intro or Standard exercises — keep those frictionless. It is Challenge-only,
where the reasoning is deepest and most worth explaining out loud.

**Revision-point batches (`{TOPIC} = R1`–`R5`) draw their seeds from every topic in the span**, not
from one block: for each concept in `{FOCUS}`, open the seed block of the topic that concept belongs to.
The span's steps are given in the shell's revision-point table. Everything else — no Intro tier, the
60/40 split, the `[Repaso]` label, uncounted — follows from `{REVIEW} = yes` below.

**Topic-specific format and seeds.** The structure a batch should take on this topic, and concrete
exercise ideas worth drilling, live in **`notes/prompts/practice/sql/_internal/_sql-exercise-seeds.md`**. Open it
and read **only the block whose heading matches the resolved `{TOPIC}`** — the other seventeen are not
yours this run. **Headings are matched case- and separator-insensitively**: the file writes
`GROUP BY`, `WINDOW FUNCTIONS`, `SCHEMA DESIGN` and `DATA TYPES` for the topics `group-by`,
`window-functions`, `schema-design` and `data-types`. A heading that differs only in case, spaces or
hyphens **is** the block — do not report it as missing.

- If the file has no block for `{TOPIC}` (a topic added to coverage but not yet seeded), generate from
  `notes/sql/coverage/{LEVEL}.md` alone and say so in one line. A missing seed block is a gap to fill later,
  never a reason to skip the topic.
- Seeds are structure and ideas, **not scope**: the reconciliation rule above still governs, and
  `coverage/{LEVEL}.md` always wins on what belongs in the batch.

---

### Step 4 — Save the file

**Flat files, numbered in study order.** Several topics share a file — that is deliberate, and the
second topic appends to the first rather than creating a new file.

The path table is in the shell (`sql-exercises-prompt.md`, under Resolution) — `{FILE}` was
already resolved from it before this branch opened. Use the resolved value; do not re-derive it.

**One file, one schema (2026-07-22).** `practice/sql/junior/01-basics.sql` is closed and is not in this
table: it carries the pre-canonical schema, so nothing is ever appended to it again. A file whose
SETUP block does not match the canonical schema is never extended — start the next numbered file
instead, and update `{PLAN}` §1 and §3.

If the folder does not exist, create it. **Never invent a path** — `{FILE}` came from the shell's path
table and is the only path this run may write to; if the shell could not resolve one, it has already
stopped.

For a **new file**: write the complete file (setup block + exercises).
For **append**: read the existing file, then append the new exercises after the last line. Do not modify any existing content.

After saving, print the message matching the case:
- New file, bookstore-based topic: "Listo. {COUNT} ejercicios guardados en [path]. Total en el archivo: {COUNT}. Ábrelo en pgAdmin, ejecuta el bloque SETUP primero, y escribe tus respuestas después de cada '-- Your answer:'. Luego pégalo en el modo review."
- New file, self-contained topic (schema-design, normalization, data-types, ddl — the same four as
  Step 2): "Listo. {COUNT} ejercicios guardados en [path]. Total en el archivo: {COUNT}. Cada ejercicio es independiente — no hay bloque SETUP. Ábrelo en pgAdmin y escribe tus respuestas después de cada '-- Your answer:'. Luego pégalo en el modo review."
- Append: "Listo. {COUNT} ejercicios añadidos a [path]. Total en el archivo: {N+COUNT}. Abre el archivo en pgAdmin y escribe tus respuestas después de cada '-- Your answer:' nuevo. Luego pégalo en el modo review."

---

<!-- ============================================================ -->
<!-- BRANCH B — run only when MODE = review                      -->
<!-- ============================================================ -->

