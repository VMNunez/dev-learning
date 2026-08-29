---
name: sql-block-close
description: >
  Close the daily 12:30 SQL block in under a minute, WHENEVER Victor ends it ("cierro el bloque", "lo
  dejo por hoy", "hasta aquí el SQL", "se acabó la hora", "done for today"). It records the one thing
  the whole track otherwise drops: **friction without failure** — the concept that cost him twenty
  minutes and that he then got right, which scores ✅ and vanishes, even though it is exactly what will
  stall him in an interview. The graded tables of MISTAKES.md only ever see what a grader marked
  ⚠️/❌. This skill writes the `## Fricción` rows, states where tomorrow's block starts so the opener
  confirms rather than rediscovers, and hands over the commit for his .sql. It asks nothing and blocks on nothing: friction
  is taken from what he already said, never extracted with questions. Do NOT use it to grade (that is
  sql-grade), to close a step (sql-step-close), to generate exercises (/sql-exercises), or to open the
  block (sql-block-open).
---

# Close the SQL block

**Shared failure close-out.** The write counts below describe successful and expected no-op or
ineligibility paths. If this invoked ritual cannot complete a declared step, follow
`notes/prompts/_internal/_session-rules.md` → "When a skill cannot finish — durable friction"; do not
restate or widen that trigger here.

**Shared deviation close-out.** Every invocation ends by printing `desvíos: ninguno` or
`desvíos: SBRC-NNNN` as its report's last line, on clean runs too. If this ritual finished its work and
the text above is what made it improvise, ask a question this contract forbids, re-derive state the
trigger declared resolved, or write outside its declared writer set, follow
`notes/prompts/_internal/_session-rules.md` → "When a skill's own text is what went wrong — the skill
breach log"; do not restate or widen that trigger here.


The hour is over. Sixty seconds, then get out of the way.

**One file is written: `practice/sql/MISTAKES.md`, and only its `## Fricción` section.** No counters,
no statuses, no coverage, no step closes — a block ending is not a step closing, and most blocks end
mid-file. If something needs grading, say "corrige el {NN}" is the next move and stop; do not grade
here.

**Ask nothing.** Friction is taken from what Victor already said, in this session or in the message
that opened this skill. If he said nothing, nothing is recorded — that is a normal outcome, not a gap
to fill with a questionnaire. The rituals of this track ask zero questions by design.

---

## 0 — What the block actually did

Read the current exercise file from `{PLAN}` §1 and count with these exact commands — both header
formats live on disk, and a pattern matching neither returns `0`:

```
grep -cE '^-- (Exercise [0-9]+ \[|#[0-9]+ \|)' {FILE}   → written
grep -cE '^--.*✅ Corregido' {FILE}                      → graded
```

Answered = headers with at least one non-comment SQL line under them. For **today's** delta, compare
against the last committed version: `git show HEAD:{FILE}` counted the same way. Uncommitted answers
are today's work.

Report it as a fact, never as a judgement: `3 respondidos hoy · 7 pendientes en el archivo`. **No
encouragement, no assessment of the pace, no suggestion about tomorrow's length.** He decides what the
block is worth.

---

## 1 — Friction: the rows nothing else in the track can write

`MISTAKES.md` `## Open` is written by the grader and holds **graded failures**. This section holds the
other half: **what slowed him down and did not end up wrong.** A concept he fought for twenty minutes
and finally got right leaves no trace anywhere else in the system — it scores ✅ like any other. That is
the concept that stalls a whiteboard round.

Take it from what he said, verbatim in substance: *"me he atascado con los `NULL` en el `ORDER BY`"*,
*"no me salía el `HAVING` sin mirar las notas"*, *"he tenido que releer la nota de `UNION ALL`"*.
Consulting the notes is friction. Rewriting a query three times is friction. Slow is friction.

Append one row per concept to `## Fricción`:

```markdown
| Fecha | Step | Coverage section | Concepto | Qué te frenó | Resuelto |
|-------|------|------------------|----------|--------------|----------|
| 2026-08-04 | junior:0 | Ordering and paging | `NULLS LAST` | tuviste que abrir la nota para decidir dónde caen los NULL | sí |
```

Rules, and they are what keep this section from becoming a second `## Open`:

- **`Step` is qualified by level** — `junior:0`, never `0`. Same rule as the rest of the file: step
  numbers restart at every level, and a revision point filters on the qualified value.
- **`Coverage section` is copied verbatim** from `notes/sql/coverage/{LEVEL}.md`, so this section
  aggregates the same way `## Open` does. If the concept matches no section, write `—` and say so in
  the report; do not invent a heading.
- **A concept already open in `## Open` is not duplicated here.** A graded failure outranks friction —
  it is already owed a re-drill. Say "ya está en `## Open`" in the report and move on.
- **The same concept twice on different days gets a second row**, not an increment. Friction is dated
  evidence of a pattern; collapsing it hides that it happened three sessions running. `## Open` counts
  with `Times`; this section counts with rows.
- **A friction row is never owed.** It closes nothing, blocks nothing, and is **not** part of the §11
  closure condition — that clause is about `## Open`. Nothing in the track will ever nag him about it.

**What it is for**, and this is the only thing that consumes it: a revision point whose span has **no
open rows** used to fall back to "the concepts appearing in the fewest exercises", which is a proxy for
nothing. It now reads this section first — the concepts that cost him time in that span, most recent
first. That is a real signal replacing a made-up one.

---

## 2 — Where tomorrow starts

One line, in the shape `sql-block-open` will print tomorrow, so that opener confirms instead of
rediscovering:

```
Mañana: Step 0 · practice/sql/junior/02-execution-order-set-ops.sql · Moment 3 — quedan 7 por responder
```

Derive the Moment from the same table `sql-block-open` uses. If the file is now fully answered, the
line is `Moment 4 — di "corrige el 02"`. **Do not run it.**

---

## 3 — Commits

- **`practice/sql/MISTAKES.md` — you commit it** (authorized 2026-07-22; the prompt writes this file,
  never Victor). Only if a `## Fricción` row was actually added:
  `docs(sql): log N friction rows from the {date} block`
- **His `.sql` file — he commits it.** Hand him the standard two blocks (`git add`, then `git commit`),
  one command per block. Run `git status` right before, so no doc file is staged alongside it.
  `docs(sql): answer exercises N–M in {FILE}`
- Nothing else is staged. If `git status` shows a doc file this skill did not write, name it and leave
  it — it belongs to whichever ritual last ran.

---

## Report back

Four lines, one table only if friction was recorded. No preamble, no encouragement.

```
Bloque cerrado · Step 0 · 3 respondidos hoy, 7 pendientes
Mañana: Moment 3 — responder los 7 que faltan en 02-execution-order-set-ops.sql
Fricción: 1 fila nueva
```

| Fecha | Concepto | Qué te frenó | Resuelto |
|---|---|---|---|
| 2026-08-04 | `NULLS LAST` | abriste la nota para decidir dónde caen los NULL | sí |

If nothing was said about friction, the third line is `Fricción: nada registrado — si algo te frenó,
dilo y lo añado.` **That is a statement, not a question**: never wait for an answer, never re-ask, and
end the turn there.
