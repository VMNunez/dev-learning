---
name: sql-block-open
description: >
  Orient the daily 12:30 SQL block before a single query is written, WHENEVER Victor opens it ("vamos
  con el SQL", "abro el bloque de SQL", "¿por dónde iba en SQL?", "what's next in SQL"). It reads
  practice/sql/PLANNING.md §0, the level's route file, the current exercise file, MISTAKES.md and the
  notes plan, and answers the questions the block always starts with: which step is open, which file,
  how many exercises are still unanswered, which Moment comes next, and whether this step's study note
  is worth reading first or still needs /notes-audit. The failure mode this exists for is the
  block starting with ten minutes of re-reading a 1000-line plan, or worse, starting on the wrong file
  because §0 was stale. It is READ-ONLY: it writes no file, commits nothing, and refuses no work. Do
  NOT use it to generate exercises (/sql-exercises), to grade (sql-grade), to close a step
  (sql-step-close), to end the block (sql-block-close), or to update §0 — a stale §0 is reported, never
  silently repaired.
---

# Open the SQL block (read-only)

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


Victor is starting the 12:30 SQL block. Give him the state of the track in one screen, then get out of
the way.

**Write nothing.** No file, no commit, not even a "Last updated" fix. This skill is a lens, and a lens
that edits is a skill nobody trusts to run first. If something is stale or contradictory, say so in one
line and name the skill that owns the repair — `sql-grade` for counters, `sql-step-close` for a close,
`/sql-plan-audit` for the plan itself.

---

## 0 — Read, in this order

- `practice/sql/PLANNING.md` §0 — the quick reference. This is the claim.
- `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` §2 and §3 — the current step and its real status. If this
  file does not exist, stop and say: "No existe la ruta de {LEVEL}. Corre `/sql-plan {LEVEL}`."
- the current exercise file itself — the ground truth, and the only thing that cannot be stale.
- `practice/sql/MISTAKES.md` — the `## Open` rows, and the most recent `## Fricción` ones (what cost
  him time without ever being graded wrong).
- `notes/sql/coverage/notes-plan-{LEVEL}.md` — only the entry that claims this step's coverage bullets,
  for its `Status:` and its `Spanish:` path (step 2). Never the whole file.

**Prefer the file over the plan.** §0 is a copy; the `.sql` file is the fact. When they disagree, report
the disagreement rather than picking a winner.

Count with these exact commands — both header formats live on disk, and a pattern matching neither
returns `0`:

```
grep -cE '^-- (Exercise [0-9]+ \[|#[0-9]+ \|)' {FILE}   → written
grep -cE '^--.*✅ Corregido' {FILE}                      → graded
```

Unanswered = written, minus those with at least one non-comment SQL line under their header.

---

## 1 — Say which Moment comes next

Exactly one, derived from the counts — never a menu of options:

| State of the current file | Next Moment |
|---|---|
| does not exist yet, or 0 written | **Moment 2** — generate: `/sql-exercises`, `MODE = practice`, `TOPIC = <the step's>` |
| written > answered | **Moment 3** — answer them in pgAdmin. This is the normal case, and it needs no tool |
| all answered, some ungraded | **Moment 4** — say "corrige el {NN}" and `sql-grade` takes it |
| all graded, step's files all scored | **Moment 5** — already automatic; if it did not run, say so as a finding |

If the SETUP block of the file has never been run in pgAdmin, mention it once — every file from `02-` on
carries its own canonical schema, and a query against a schema that is not loaded fails for a reason
that has nothing to do with SQL.

---

## 2 — The theory behind this step, and whether it is worth reading yet

Exercises drill a concept; the note explains it. Reading the note first is the difference between
solving the step and understanding it — but only if the note is actually written to standard, and today
most SQL notes are not.

Resolve it mechanically, never by guessing a filename:

1. Take the current step's `**Coverage bullets:**` from `{PLAN}` §2 (or its `**Coverage:**` section
   names if the bullets are ambiguous).
2. Open `notes/sql/coverage/notes-plan-junior.md` — **the notes track's own plan**, at
   `notes/sql/coverage/notes-plan-{LEVEL}.md` — and find the entry whose `Coverage concepts:` list
   claims those same bullets. The two files quote the same coverage file verbatim, so the match is
   textual, not interpretive. If several entries claim parts of the step, resolve to the one that
   claims most and read step 3 off that entry alone; the others are named in the same Teoría line,
   as one parenthesis listing every claiming chapter — `(abarca 03/04/05)` — never a second line and
   never a count. It goes next to the note, before any `/notes-audit` command: that command stays
   the last thing on the line so it can still be pasted.
3. Read that entry's `Status:` line and its `Spanish:` path.

Then say exactly one of these, in one line:

| Entry `Status:` | What you say |
|---|---|
| `complete` or `refined` | **"Antes de los ejercicios, estúdiate `notes/sql/junior/es/NN-x.md`"** — the note is built to standard, so there is nothing to run |
| `pending` | **"La nota de este step aún no está escrita al estándar: `/notes-audit TOPIC=sql LEVEL=junior NOTE=NN`"** — give the exact command with the entry number, so it can be pasted without opening the plan |
| no entry claims the step's bullets | Say so in one line and stop there. It is a gap in the notes plan, and `/notes-plan sql {LEVEL}` is what fixes it — do not invent a note file |

**Name the Spanish file**, `notes/sql/{LEVEL}/es/`, because that is the one Victor studies from. The
English file is the canonical source when the note is *written*; it is not the reading copy.

**Three fences, and they are what keep this inside a read-only opener:**

- **Never run `/notes-audit` and never invoke the notes track.** State the command; he pastes it if he
  wants it. A note is never owed, never blocks the block, and never blocks a step from closing — that
  is doctrine §Z, and it is why this is a line of information rather than a gate.
- **Never write to the notes plan.** Not a status, not a checkbox. This skill writes no file at all.
- **The SQL route still lists no note files.** The mapping is read out of the notes track's own plan,
  in the notes track's own directory; nothing about it lands in `{PLAN}` or in the doctrine. That is
  precisely what makes this legal under the §Z fence: the SQL plan is not scheduling a note, the opener
  is reporting what the notes plan already says.

---

## 3 — Surface the open mistakes, and yesterday's friction

The three or four open rows of `MISTAKES.md` with the highest `Times`, one line each: concept and what
went wrong. Not the whole table.

This is the one piece of the block that is genuinely easy to forget: a failed concept does not feel
rusty, it feels learned. Naming them at the start of the block is the cheap version of the revision
point.

**Then the most recent `## Fricción` rows** — what cost him time in the last block or two without ever
being graded wrong (written by `sql-block-close`). One line, prefixed `Ayer te frenó:`. It is the
cheapest possible intervention: the concept is named while the file is still open in front of him, and
it is the one class of weakness no grader can report.

If a revision point is due, say which one, in one line, as **available** — never as owed. Read the
points from the level's route §1 revision table (its span and its trigger); doctrine §8b owns only the
cadence rule, not which points exist. He decides when to spend the block on it.

**State the open-row count of its span as a number, not as a nudge** — `R1: 3 filas abiertas` is a
fact he needs, because §11 will not let the level close with stale open rows and thirteen steps is a
long way to carry that debt unseen. One number, no advice about when to spend the block on it.

---

## Report back

Four lines and a table. No preamble, no encouragement, no plan for the session — he decides what to do
with the block.

```
Step 0 — Querying basics · junior · 20/30 first-pass puntuados
Archivo: practice/sql/junior/02-execution-order-set-ops.sql — 10 escritos, 3 respondidos, 0 corregidos
Siguiente: Moment 3 — responder los 7 que faltan en pgAdmin (~35 min al ritmo de este archivo)
Teoría: la nota de este step (05-order-by-limit) sigue `pending` — `/notes-audit TOPIC=sql LEVEL=junior NOTE=05`
Ayer te frenó: `NULLS LAST` — abriste la nota para decidir dónde caen los NULL
Ojo: el bloque SETUP de este archivo trae el esquema canónico; ejecútalo si no lo has hecho hoy
```

**The pace estimate is a measurement, not a target.** Derive it from this file's own history — graded
exercises over the sessions that produced them, from the `-- ✅ Corregido` dates — and print it in
parentheses. With no history yet, write `(sin histórico)` rather than guessing a number. The block is
60 minutes and Stage 2 is a timed test, so a track that never mentions the clock trains no pacing at
all; but the estimate never becomes a quota, and a block that runs slower than it is not a finding.
**Never comment on how long he took or suggest moving on** — he decides what the block is worth.

| Fallos abiertos | Times | Qué pasó |
|---|---|---|
| `NULLS LAST` | 2 | ordenaste sin decidir dónde van los `NULL` |
| `UNION` vs `UNION ALL` | 1 | usaste `UNION` sin necesitar deduplicar |

Cierra con una línea si algo no cuadra: "⚠ §0 dice step 0 pero la ruta ya lo tiene `closed ✅` —
`sql-grade` no llegó a cerrar; díselo a `sql-step-close`."
