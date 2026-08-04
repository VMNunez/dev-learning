---
name: sql-block-open
description: >
  Orient the daily 12:30 SQL block before a single query is written, WHENEVER Victor opens it ("vamos
  con el SQL", "abro el bloque de SQL", "¿por dónde iba en SQL?", "what's next in SQL"). It reads
  practice/sql/PLANNING.md §0, the level's route file, the current exercise file and MISTAKES.md, and
  answers the four questions the block always starts with: which step is open, which file, how many
  exercises are still unanswered, and which Moment comes next. The failure mode this exists for is the
  block starting with ten minutes of re-reading a 1000-line plan, or worse, starting on the wrong file
  because §0 was stale. It is READ-ONLY: it writes no file, commits nothing, and refuses no work. Do
  NOT use it to generate exercises (/sql-exercises), to grade (sql-grade), to close a step
  (sql-step-close), or to update §0 — a stale §0 is reported, never silently repaired.
---

# Open the SQL block (read-only)

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
- `practice/sql/MISTAKES.md` — the open rows.

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

## 2 — Surface the open mistakes

The three or four open rows of `MISTAKES.md` with the highest `Times`, one line each: concept and what
went wrong. Not the whole table.

This is the one piece of the block that is genuinely easy to forget: a failed concept does not feel
rusty, it feels learned. Naming them at the start of the block is the cheap version of the revision
point.

If a revision point is due, say which one, in one line, as **available** — never as owed. Read the
points from the level's route §1 revision table (its span and its trigger); doctrine §8b owns only the
cadence rule, not which points exist. He decides when to spend the block on it.

---

## Report back

Four lines and a table. No preamble, no encouragement, no plan for the session — he decides what to do
with the block.

```
Step 0 — Querying basics · junior · 20/30 first-pass puntuados
Archivo: practice/sql/junior/02-execution-order-set-ops.sql — 10 escritos, 3 respondidos, 0 corregidos
Siguiente: Moment 3 — responder los 7 que faltan en pgAdmin
Ojo: el bloque SETUP de este archivo trae el esquema canónico; ejecútalo si no lo has hecho hoy
```

| Fallos abiertos | Times | Qué pasó |
|---|---|---|
| `NULLS LAST` | 2 | ordenaste sin decidir dónde van los `NULL` |
| `UNION` vs `UNION ALL` | 1 | usaste `UNION` sin necesitar deduplicar |

Cierra con una línea si algo no cuadra: "⚠ §0 dice step 0 pero la ruta ya lo tiene `closed ✅` —
`sql-grade` no llegó a cerrar; díselo a `sql-step-close`."
