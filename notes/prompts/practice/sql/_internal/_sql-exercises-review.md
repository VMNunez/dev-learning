# `sql-exercises` — MODE = review branch

**Internal component of `sql-exercises-prompt.md`. Not runnable on its own** — it assumes the shell has
already resolved `{FILE}`, read `notes/prompts/_internal/_session-rules.md`, `PLANNING.md`, `PROGRESS.md` and `coverage/{LEVEL}.md`, and
printed the resolution block.

Split out 2026-07-22: a run is either practice or review, never both, so carrying the other branch was
~40% of the file for nothing. The shell reads only the branch its `MODE` names.

---

## MODE = review

---

### Step 1 — Read the file

Read the file at {FILE} (already resolved by the shell, from its path table under Resolution).
If Victor pasted a file at the end of the chat instead, use the pasted content — a paste always wins
over {FILE}, because it may hold answers he has not saved to disk yet.
Confirm in one line which one you used: "Reviso [path]" or "Reviso el archivo pegado".
Identify the topic from the file header.

**First, detect the format**, because the two are answered differently:
- **Current format** — exercises marked `-- Exercise N [Level]:` with a `-- Your answer:` line. An
  answer is any content after `-- Your answer:` (ignoring blank and comment-only lines).
- **Legacy format** — exercises marked `-- #NN | title` with **no** `-- Your answer:` line; the answer
  is written directly under the description. Here, an answer is any non-comment SQL line between one
  `-- #NN |` header and the next. `01-basics.sql` is the only file in this format — treating it with
  the current-format rule reports all 40 answered exercises as unanswered.
- **Mixed file** — apply each rule to the block it belongs to. Say so in one line at the top:
  "Archivo mixto: ejercicios #1–#N en formato antiguo, el resto en formato actual."

**Second, skip what is already settled.** An exercise whose **header line ends with**
`✅ Corregido YYYY-MM-DD` has already been reviewed and accepted in an earlier run. **Do not
re-review it, do not re-score it, do not comment on it.** List it in the summary as `✅ (ya corregido)`
and exclude it from the score, exactly like an unanswered one — the score must measure *this* batch,
not a growing pile of work already validated. This mirrors the studied-content-is-final rule in
`notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md`.

If **every** exercise in the file carries the marker, print
"Todo este archivo ya está corregido. Nada que revisar." and stop — do not run Steps 3–6.

Then, for each remaining exercise:
- Answer present: review it.
- No answer: mark as "— Sin responder" in the summary. Exclude from score and breakdown.

**If no exercise in the file has an answer at all**, print
"Nada que puntuar: los {n} ejercicios de [FILE] siguen sin responder. Respóndelos en pgAdmin (Moment 3
del plan) y vuelve a pasar el review." and **stop — do not run Steps 2 to 6.** This is the state
`02-execution-order-set-ops.sql` is in today, and it is not a score of 0: a score of 0 would flip the
{PLAN} §3 row to `in progress ⏳` on the strength of work never attempted, and Step 3's three verdicts are all
defined on a percentage that does not exist when the denominator is 0.

**Partial-file detection:** if the first N exercises are all "Sin responder" and only later
exercises have answers, print one line at the top:
"Revisando ejercicios [first answered] a [last answered]."
This is normal when reviewing a new append batch.

---

### Step 2 — Check each answer

Run each query mentally against the schema defined in the setup block.

**If the file has two setup blocks** (a `SETUP v2` banner marks a mid-file schema change — see
practice Step 1), evaluate each exercise against the block that precedes it, not against the last one
read. An exercise written for the v1 schema is **not** wrong for using a v1 column name.

For the self-contained design topics (schema-design, normalization, data-types, ddl), there is no
shared setup block — evaluate each answer's table design and type choices against the
requirements stated in that exercise.

Mark each answer with one of these:

**✅ Correct** — returns the right result with a good approach.
One line confirming it is correct.
If there is a significantly cleaner or more idiomatic PostgreSQL way to write it,
add: "Nota: [one sentence on the alternative]" — do not rewrite the query, just note it.
Only add this note when the improvement is meaningful (e.g. using FILTER instead of CASE
inside an aggregate, using DISTINCT ON instead of a subquery). Skip for minor style differences.

**⚠️ Partial** — runs without error but returns wrong or incomplete results.
- One sentence: what is wrong
- Correct query in a code block
- If the mistake is a classic pattern error (WHERE vs HAVING, INNER vs LEFT, COUNT(*) vs
  COUNT(column), correlated vs non-correlated), explain the distinction in one sentence

**❌ Wrong** — syntax error, wrong approach, or completely wrong result.
- One sentence: what is wrong
- Correct query in a code block
- Explain the concept behind the correct approach in one sentence

**For dml-topic exercises:** a missing ROLLBACK is flagged as ⚠️ Partial even if the DML
statement itself is correct — resetting data after each exercise is part of the skill.
This applies only to the `dml` topic. In the `transactions` topic, COMMIT is the correct
ending for exercises that test the COMMIT path — do not flag a missing ROLLBACK there;
instead apply the transactions checklist below.

**For normalization exercises:** check:
- Are the functional dependencies correctly identified?
- Is the normal form violation correctly named?
- Does the normalized schema reach 3NF?
- Are the INSERT statements consistent with the new structure?

**For schema design exercises:** check:
- Are all required entities represented as tables?
- Do foreign keys correctly represent the relationships?
- Are NOT NULL, UNIQUE, and CHECK constraints applied where the requirements imply them?
- Is there anything that would cause problems in practice (e.g. missing FK, mutable PK)?

**For transactions exercises:** check:
- Does every exercise that requires COMMIT actually use COMMIT (not ROLLBACK)?
- Is SAVEPOINT used correctly — ROLLBACK TO saves partial work, not everything?
- Are ACID comments present and accurate? A wrong comment is flagged as ⚠️ Partial.
- Is the @Transactional connection described correctly when the exercise asks for it?
- For DELETE vs TRUNCATE: are the differences (WHERE support, logging, rollback, SERIAL reset) all stated?

**For data-types exercises:** check:
- Is the chosen type correct for the scenario (NUMERIC for money, TIMESTAMPTZ for created_at, etc.)?
- Does Victor justify each choice with a comment? Missing justifications are flagged as ⚠️ Partial.
- For NUMERIC vs FLOAT: does Victor explain the rounding error risk?
- For TIMESTAMP vs TIMESTAMPTZ: does Victor explain what happens when the server time zone changes?

**For dates-strings exercises:** check:
- Is the PostgreSQL-specific syntax used correctly (:: cast, ILIKE, DATE_TRUNC, STRING_AGG, INTERVAL)?
- For ILIKE vs LIKE: does the answer demonstrate understanding of case sensitivity — not just use ILIKE?
- For a period report: is DATE_TRUNC used (keeps periods ordered) where EXTRACT would scramble them?
- For a concatenation over a nullable column: is the NULL handled with COALESCE or CONCAT_WS? An
  unguarded `||` is ⚠️ Partial even when the query runs.

**For join-pitfalls exercises:** check:
- When the exercise asks for a predicted row count, is the number right? A correct query with a wrong
  prediction is ⚠️ Partial — the prediction is the skill being tested.
- Is a fix that only masks a fan-out (COUNT(DISTINCT ...)) distinguished from one that removes it
  (pre-aggregating in a CTE)? Naming the difference is required on Challenge exercises.

**For ddl exercises:** check:
- Does the CREATE TABLE run as written — no forward reference to a table created later?
- Are constraints named where the exercise asked for it?
- For ALTER on a populated table: does the answer address the existing rows, not just the new rule?

**For live-database exercises:** check:
- For an error-diagnosis exercise, is the *cause* named, not just the fix?
- For "relation does not exist": are all three causes given (wrong database, wrong search_path,
  quoted-identifier case)? Fewer than three is ⚠️ Partial.

**For report-queries exercises:** check:
- Does a group with zero rows survive — LEFT JOIN from the driving table, COALESCE(SUM(...), 0)?
  A report that silently drops empty groups is ❌ even if every returned row is right.
- Is every output column aliased?
- Is the stated 10-minute target met? Record it in the summary, but do not lower the score for it.

---

### Step 2a — Second pass on the ✅ answers, by a cold subagent

**Run this before writing a single marker.** The marker is irreversible in practice: a ✅ exercise is
skipped by every later run, so a wrongly accepted answer becomes a concept Victor believes he owns
and never sees again. One grader marking his own work has no check against that.

Dispatch **one subagent that has not seen this run**. Give it: the setup block the exercises run
against, and *only* the exercises marked ✅ in Step 2 — the exercise text and Victor's query, with no
verdict, no commentary, and no hint that they were already accepted. Ask it for one line per
exercise: **correct** or **not correct, because <one clause>**. Nothing else — it is not reviewing
style, not suggesting idiomatic alternatives, not grading the ⚠️ and ❌ ones.

Reconcile:
- **Both say correct** → the ✅ stands and the exercise gets its marker in Step 2b.
- **The subagent says not correct** → re-check that exercise yourself against the schema. If it is
  right, downgrade the answer to ⚠️ or ❌, give the correction in the summary, and **write no marker**.
  If the subagent is wrong, keep the ✅ and say so in one line: "Segunda pasada discrepó en el #N; la
  revisé y la respuesta es correcta porque […]".

**Print the outcome in one line:** "Segunda pasada: N ✅ confirmados, M revertidos." A run where the
second pass changed nothing is the normal case and is worth stating — it is the evidence the markers
were earned.

This is the only subagent in this prompt. It exists here and not on the ⚠️/❌ answers because those
come back through review anyway; the ✅ ones never do.

---

### Step 2b — Write the correction markers back into the file

**This is the only step that edits the exercise file, and it edits nothing but these marker lines.**
The file it edits is {FILE}. If the review ran off a paste whose exercises do not match what is on
disk, skip this step and print: "No escribo marcadores: el texto pegado no coincide con [FILE]."

For every exercise marked **✅ Correct** in Step 2, append the marker **to the end of that exercise's
header line** — never on a line of its own, so the file stays scannable and the answer keeps its own
line. It goes on the header in both formats:

```sql
-- #39 | WHERE — NOT BETWEEN ✅ Corregido 2026-07-22
-- Exercise 41 [Standard]: LEFT JOIN — finding missing data ✅ Corregido 2026-07-22
```

Use today's real date. Do **not** add the marker to ⚠️ Partial or ❌ Wrong answers — those still need
work, and they must come back through review once corrected. Do not add it to unanswered exercises.
Never modify Victor's queries, never reformat, never touch anything but these appended lines.

Why this exists: without it, every review run re-grades the whole file from #01, the score silently
mixes old validated work with the new batch, and there is no record in the file itself of what has
been settled. The marker is what makes an exercise file resumable.

**Print the count:** "Marcados como corregidos: N ejercicios."

---

### Step 3 — Summary

Print the summary table:

| Exercise | Level | Result | Issue |
|----------|-------|--------|-------|
| 1 | Intro | ✅ | — |
| 2 | Intro | ⚠️ | Used WHERE instead of HAVING |
| 3 | Standard | ❌ | Missed LEFT JOIN — INNER drops non-matching rows |
| 4 | — | Sin responder | — |

**Score:** X / Y correct  (Y = attempted exercises only; unanswered not counted)

Breakdown by level (attempted only):
- Intro: X/N ✅
- Standard: X/N ✅
- Challenge: X/N ✅

**Verdict — three mutually exclusive cases based on score:**

**Score < 60%:**
"Este tema necesita más práctica. Revisa los errores y corrígelos en pgAdmin.
Conceptos a reforzar: [list the specific concepts that had ❌ or ⚠️ answers].
Añado un batch de refuerzo al plan; luego ejecuta el prompt con MODE = practice y TOPIC = {TOPIC}."

Then, in Step 4, append a reinforcement block to the {TOPIC} step in `{PLAN}` §2,
**in exactly this shape** — it is what the shell's Resolution table reads, so a block written any other
way resolves to nothing:

```
**Moment 2b reinforcement block:** `TOPIC = {TOPIC}`, `COUNT = 8`  *(añadido por el review del <fecha>)*
**Focus:** <exactamente los conceptos fallados, separados por comas>
```

`REVIEW` is **not** written into the block — the shell derives `{REVIEW} = yes` from the block's
heading. **This is what keeps the pasted config down to two keys:** the next run reads the block
instead of Victor retyping it, and the plan ends up holding the record of what he struggled with.
Place it after the step's own `**Focus:**` line, never replacing it.
Then proceed to Steps 4 and 5.

**Score ≥ 60% and < 80%:**
"Base sólida. Repasa los ejercicios marcados con ⚠️ o ❌ antes de avanzar."
Then proceed to Steps 4 and 5.

**Score ≥ 80%:**
"Listo para marcar {TOPIC} como sólido. Pasamos al siguiente tema."
Find {TOPIC} in the study order below. The next topic is the one immediately to the right.
basics → joins → group-by → join-pitfalls → nulls → subqueries → ctes → dates-strings
→ window-functions → dml → transactions → schema-design → normalization → data-types → ddl
→ indexes → live-database → report-queries
Print: "Siguiente tema: [next topic]. Ejecuta el prompt en modo practice con TOPIC = [next topic]."
If {TOPIC} is report-queries (the last topic): print "Has completado todos los temas SQL. Revisa
practice/sql/PLANNING.md §9 — te toca el gate G3 (progress-update)."

**Also name the revision point when one fires here.** PLANNING.md §8b hangs five revision points off a
closing **step**, not off a topic — and two of those steps run more than one topic, so the trigger is
the *last* topic of the step, never the first:

| Point | Fires when this step closes | i.e. the review run whose {TOPIC} is | Not on |
|-------|-----------------------------|--------------------------------------|--------|
| R1 | Step 1 — `03-joins.sql` reaches 22 scored | `joins` (the **second** run) | the first `joins` run |
| R2 | Step 4 — `06-nulls.sql` | `nulls` | — |
| R3 | Step 7 — `09-window-functions.sql` | `window-functions` | — |
| R4 | Step 10 — `12-data-types-ddl.sql` | `ddl` | `data-types`, which is only the first of that step's two runs |
| R5 | Step 12 — `14-live-database.sql` | `live-database` | — |

Fire it only when 4c actually set the step's row to `closed ✅`. If it did not, the step is still open and
no revision point has been reached. When one does fire, add: "Además, esto cierra el paso [N] del
plan: toca el punto de repaso [R] antes de seguir — su foco son las filas abiertas de MISTAKES.md."
Then proceed to Steps 4 and 5.

---

### Step 4 — Update PROGRESS.md and PLANNING.md

Five things must move when a topic is scored, and the failure mode is doing one of them. Do all five,
or state explicitly which one you skipped and why.

> **`[Repaso]`-labelled exercises are uncounted wherever they live.** The exception below is written
> around the revision-point *file*, but the label is the real carrier: a `MODE = reinforce` batch and a
> Moment 2b reinforcement block both append `-- Exercise N [Repaso]:` exercises **into a step's own
> file**, and counting those would inflate the step's `Scored / target` with work that was never part
> of its first pass. So in 4b and 4c, count only exercises labelled `[Intro]`, `[Standard]` or
> `[Challenge]`; in 4c-bis, a `[Repaso]` exercise marks no coverage bullet. Grade them normally, list
> them in the summary, log their failures in `MISTAKES.md` — they just move no counter. State the split
> in one line: "N ejercicios puntuados, M de ellos de repaso (no cuentan para el paso)."
>
> **Revision-point files (`R{n}-repaso.sql`) are the one exception, and it is deliberate.** Run **4a**
> (nothing to do since 2026-08-03) and **Step 5** — closing the redeemed `MISTAKES.md`
> rows *is* the purpose of the batch. **Skip 4b, 4c and 4d entirely**: a repaso batch is uncounted
> ({PLAN} §1 and the doctrine §8b), so it never touches the exercises table, never moves a `Scored / target`
> figure and never flips a {PLAN} §3 status. Print "Lote de repaso: no cuenta para ningún paso." and, in place
> of 4e, state which of the point's open rows closed and which are still open — a revision point clears
> only when its span has no `## Open` row left.

#### 4a — Deleted (2026-08-03)

This step used to copy every exercised concept into a `## SQL` concept list inside PROGRESS.md. **That
list no longer exists** — it was a second, evidence-free copy of the SQL coverage file and was removed
on 2026-08-03. The *what* is recorded in **4c-bis**, on the coverage bullets, where it carries its
evidence marker; PROGRESS.md keeps only the *how many*, in 4b. Do not re-create the list.

If this batch exercised a concept with **no bullet in the SQL coverage file**, do not write it into
PROGRESS.md: report it in 4e as coverage work owed, naming the concept and level.

#### 4b — PROGRESS.md, `## Practice completed` → `### Exercise route`

That section (added 2026-08-03) holds a roll-up table plus **one detail table per level**, and this step
updates the roll-up row and the detail table **of `{LEVEL}` only**. Levels never share a figure: a
middle exercise never moves the junior route, and a junior file never appears in the middle table. If
`{LEVEL}`'s detail table does not exist yet (its route was just planned), create it under a
`#### {Level} — practice/sql/{LEVEL}/` heading in the same shape as the junior one, and fill the
level's roll-up row from `{PLAN}` §5 instead of leaving it blank.

Read the real figures from the file you just reviewed and from `{PLAN}` §5 — the shapes below are
placeholders, never copy an example number into PROGRESS.md.

**Table 1 — the roll-up, one row per level:**

```markdown
| Level | Corrected | Route progress | Steps closed |
|---|---|---|---|
| **{Level}** | [graded]/[written] ([pct]%) | [first-pass]/[route target] ([pct]%) | [closed]/[total steps] |
```

- **Corrected** = graded over *written*, `[Repaso]` and extra batches included. Its denominator is
  raised by the practice branch when the batch is written (Branch A, Step 5); here you raise only its
  **numerator**, by every exercise you just graded — repaso ones too.
- **Route progress** = first-pass exercises graded across the whole level route, `[Repaso]` and extra
  batches excluded (same rule as the counting note at the top of Step 4). Add this batch's first-pass
  count to the cell's current numerator; never recount the whole route from scratch.
- **Target** = the sum of the `First-pass target` column of `{PLAN}` §5. It changes only when the
  route itself is replanned — if you find it disagreeing with §5, fix it and say so in 4e.
- **Steps closed** = steps whose done condition is met, i.e. the ones you would mark in §3. A step
  closes only when *every* file of that step scored ≥ 80% — a step with two files does not close on
  the first one.

**Table 2 — the per-file detail, one row per file.** Find the row **whose `File` cell names `{FILE}`**
— match on the file, never on a prose cell. Update its `Corrected`, `First-pass / target` and `Status`:

- Status: `closed ✅` if score ≥ 80%; `in progress ⏳` if score < 80%; leave `not created` untouched
  for files that do not exist yet.
- `Corrected`: graded over written **in this file**, repaso included.
- `First-pass / target`: this file's first-pass scored count over its §5 first-pass target.

**Every file of the route has its own row, including the ones not written yet** — `sql-plan` seeds them
all when it plans the level. Never collapse pending files into a summary row: the point of the table is
seeing exactly what is left.

**If `{FILE}` has no row:** add one, in step order, with its §5 target, and say so in 4e — a missing row
means the plan and PROGRESS.md disagree about the route.

**Recompute the `Total` row of both tables** after editing any cell. They are the last row of each
table and are derived, never accumulated by hand: sum the rows above. A total that no longer matches
its own column is the failure this instruction exists for. **Except `Corrected`, whose total cell stays
`—`** — a correction backlog has no meaningful aggregate; leave the dash.

**If the `## Practice completed` section does not exist:** do not invent a layout — report it in 4e
as a structural finding. It was added on 2026-08-03 and its absence means PROGRESS.md is stale or was
reverted, which is worth knowing before writing into it.

#### 4c — {PLAN} §3, the step row

Open `{PLAN}` (`practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`). Find the row in its §3 table for the step this {TOPIC} belongs to —
**the shell's path table gives the step number for {TOPIC}**. Update its **Scored / target** cell with
the number of exercises this run actually graded ≥ 80%, and its **Status** cell:
- score ≥ 80% **and** the step's target reached → `closed ✅`
- otherwise → `in progress ⏳`

The three status values are exactly `not started`, `in progress ⏳` and `closed ✅`. `done ✅` is the
legacy route's spelling and is never written into a `{PLAN}` §3 row.

**A step spanning two files keeps a per-file breakdown in that cell** (Step 0 is the live case:
`20 / 30 (01: 20/20 closed …; 02: 0/10 …)`). Do not flatten it to a bare fraction and do not rewrite
the parenthetical for the file you did not review: update **only the clause for `{FILE}`**, then
recompute the leading `scored / target` as the sum across the step's files. Same rule in {PLAN} §1, which
has **one row per file, not per step** — update the row whose file name is `{FILE}`.

{PLAN} §1 defines three counts — *written*, *answered*, *scored* — and only **scored** moves a
status. Do not write an answered-but-ungraded count into that cell; that conflation is what made the
plan claim Step 0 was 40/40 when nothing had ever been reviewed.

Then refresh the totals line under the table.

#### 4c-bis — {PLAN} §2, the coverage bullets of that step

This prompt is the only one that can do this, and `sql-plan` is explicitly forbidden from guessing it:
you generated these exercises, so you alone know which coverage bullet each one tested. In the step's
`**Coverage bullets:**` list, flip `- [ ]` to `- [x]` for **every bullet a graded exercise of this run
actually drilled** — the concept was exercised and scored, not merely adjacent to the topic. Leave the
rest untouched.

Three rules, all of them the difference between a progress instrument and a decorative list:

- **Only a scored exercise marks.** An exercise written or answered but not graded marks nothing, for the
  same reason only *scored* moves a status in 4c.
- **A bullet is never unmarked.** Not by a later batch, not by a re-review of the same file, not by a
  repaso.
- **A repaso batch marks nothing** (`{TOPIC}` = `R1`–`R5`). It is uncounted by design, and that includes
  here.

A step reaching `closed ✅` in 4c with `[ ]` bullets left is not an error to paper over: it means the
route promised coverage the exercises never drilled. Leave the checkboxes honest and report it in the
final summary as `step N closed with M unchecked bullets` — that line is what tells Victor a step needs
a reinforcement run, and marking them all on close would erase exactly that signal.

#### 4d — the doctrine §0, the quick reference

Only when 4c set a row to `closed ✅`. Rewrite the §0 table:
- **Current step** → the next row in {PLAN} §3 that is not ✅
- **Done condition** → that step's done condition, copied from its {PLAN} §2 entry
- **Next revision point** → the first of R1–R5 in §8b whose trigger has not fired yet. Steps 1, 4, 7,
  10 and 12 each close one (R1–R5) — if this was one of them, the next one is the following R.
  **The row is "Next revision point", never "Next gate"** — §0 has six named rows and this is one of
  them; renaming it is how off-scope tracks creep back into the quick reference.
- **Last updated** → today

#### 4e — Report what is still manual

The step-complete ritual is PLANNING.md §4, and it has **exactly one manual item** plus the exit
question — both outside this prompt's reach:
- **`notes/sql/coverage/{LEVEL}.md`** — if the batch surfaced a concept genuinely missing from coverage, Victor
  adds it there (§4, item 3). This prompt never edits coverage.
- **The exit question**, answered aloud from memory. §3 is explicit that a score alone never closes a
  step.

So never print "step closed" on the strength of a score alone. If 4c set the row to `closed ✅`, print:
"Ejercicios del paso [N] cerrados. Para cerrar el paso entero falta responder la exit question de
memoria, y añadir a `notes/sql/coverage/{LEVEL}.md` cualquier concepto que haya salido aquí y no esté."

**Do not name notes, Q&A or simulations as blockers.** They are separate tracks (PLANNING.md §Z), no
step closes on one, and telling Victor a note is "missing to close the step" is precisely the scope
creep the plan's fence exists to prevent.

---

### Step 5 — Concept gaps: log them in `MISTAKES.md`

If any answer was ⚠️ or ❌, **record each distinct conceptual gap in the `## Open` table of
`practice/sql/MISTAKES.md`**, whose columns are `Logged | Last seen | Times | Step | Coverage section |
Concept | Sev | What went wrong | Exercises`. One row per *concept*, not per exercise: three exercises
that all failed on `WHERE` vs `HAVING` are one row, with all three numbers in `Exercises`.

- **`Coverage section` is the heading from `notes/sql/coverage/{LEVEL}.md`, copied verbatim** — not a
  paraphrase and not the step name. If the gap fits no existing heading, write the closest one and say
  so in one line in the chat; that mismatch is a signal for the next `coverage-audit`, not a licence to
  invent a section name here.
- **A concept already in `## Open` is never given a second row.** Increment its `Times`, set
  `Last seen` to today, append the new exercise numbers, and raise `Sev` to ❌ if this run was worse.
  Recurrence is the whole point of the column — a second row destroys it.
- **`Sev`** is the worst grade the concept has ever received, not this run's.
- **`Step`** is the plan step number the reviewed file belongs to — the shell's path table gives it for
  `{TOPIC}`. A bare number (`4`), not a name, so a revision point can filter its span mechanically.
- **The `## Closed` table has six columns** — `Logged | Closed | Times | Step | Coverage section |
  Concept`. Moving a row drops `Sev`, `What went wrong` and `Exercises` and adds `Closed`; carry the
  other five across verbatim.

Then list the same gaps in one short block at the end of the chat, highest `Times` first.

**Also close what this run redeemed.** Before recording anything, read the `## Open` table: if a
concept listed there was answered correctly in this batch, move its row to `## Closed` with today's
date as the closing date, carrying its `Times` across. Never delete a row — a concept failed twice and
fixed once is a different fact from a concept never failed, and the closed table is what tells them
apart.

If the file does not exist, create it with the two tables and the header explaining what it is.

**This prompt still never writes to `notes/interview-prep/` or to `notes/sql/`.** Those belong to
`interview-prep-audit` and `/notes-audit`, which Victor runs on his own schedule (`PLANNING.md` §Z);
a grading run that also authors study
material bypasses both standards and their cold reviewers. `MISTAKES.md` is not study material — it
is this run's own output, the record of what it graded wrong. **This prompt is its only writer**; the
revision points R1–R5 in `PLANNING.md` §8b read it to derive their focus.

If every attempted exercise was ✅, skip the appending half but still run the closing half.

---

### Step 6 — Commit message

**Branch:** SQL exercises and PROGRESS.md commit on **whatever branch is active** (the shared session rules
2026-07-14 — study materials follow the active branch; `main` only receives merges via PR). No
branch switch, no separate SQL branch.

**These are Victor's files — never run the commit yourself.** Print the commands below for him to
copy-paste; `practice/sql/` and `practice/simulations/` are his work, outside every auto-commit
exception.

List only files that were actually modified. Always one command per code block.

Use the exact folder path from the shell's path table (under Resolution) for {TOPIC} — not `sql/{TOPIC}/`:

```
git add [exact path from Step 4 table] PROGRESS.md practice/sql/{LEVEL}/PLANNING-{LEVEL}.md
```

If Step 5 touched the mistake log:
```
git add practice/sql/MISTAKES.md
```

```
git commit -m "docs: SQL {TOPIC} review — [X/Y correct], [main gap or 'all solid']"
```

---

<!-- ============================================================ -->
<!-- FINAL STEP — both modes                                      -->
<!-- ============================================================ -->

