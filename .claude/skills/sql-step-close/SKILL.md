---
name: sql-step-close
description: >
  Run the closing ritual for a SQL step, invoked by sql-grade the moment a step's last exercise file
  scores ≥ 80% — and directly only when Victor says a step is done ("cierra el step 1", "close the SQL
  step"). This is Moment 5 and Section 4 of practice/sql/PLANNING.md. Grading already moved the
  counters; what this owns is the part no grader can reach: the ✅ sql:{file-slug} drill markers on
  every coverage bullet the step's scored exercises actually drilled, the doctrine's §0 quick
  reference, a re-check that PROGRESS.md's Total rows really add up, and the level-closed check that
  nothing else in the track performs. The failure mode this exists for is a step whose exercises are
  all green while notes/sql/coverage/{LEVEL}.md still reads as if the concepts were never touched. It
  asks Victor nothing — a step it cannot close is reported and left open, never blocked on an answer.
  Do NOT use it to grade (that is sql-grade), to close a project step (that is step-complete), to add
  missing coverage bullets (that is /coverage), or after a [Repaso] batch, which closes nothing.
---

# SQL step-closing ritual (Moment 5)

A step's last exercise file just scored. Walk steps 0–5 in order, without being asked. If one
genuinely does not apply, **say so in the report table** — a silent skip is the failure this ritual
exists to prevent.

**Ask Victor nothing.** No confirmations, no exit question, no "¿quieres que…?". If the step cannot
close, say why in one line, leave it open and stop. The `Aloud:` done-condition was removed from the
doctrine on 2026-08-03 precisely because a manual gate in the middle of a mechanical ritual is how the
ritual stops being run.

**Do not edit his `.sql` files**, and do not re-grade anything.

---

## 0 — Verify the step really closes

Read `{PLAN}` = `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` and confirm, from the files themselves and
not from what the caller said:

- every file the step owns in `{PLAN}` §1 is scored ≥ 80%;
- the step's §3 row now reads `closed ✅`;
- the step's done condition (§2) is one of the doctrine §3 formats and it is actually met. A `pgAdmin:`
  or `Terminal:` condition is **not** met by a score — those steps close on the observable result, and
  if you cannot confirm it, say so and leave the step open.

Any of these failing → report and stop. Closing a step on a caller's word is how every downstream gate
starts reading a file that lies.

---

## 1 — The drill markers on coverage

This is the ritual's own work, and the reason it exists.

Read `notes/sql/coverage/{LEVEL}.md` and the step's `**Coverage bullets:**` list in `{PLAN}` §2. For
**every bullet the grading run checked `- [x]`**, append the drill marker to the matching bullet in the
coverage file:

```
- `LEFT JOIN` — returns all rows from the left table with `NULL` on the right when there is no match ✅ sql:03-joins
```

The format, its placement, and the digest rules are defined once in
`notes/prompts/knowledge/coverage/_internal/_coverage-standard.md` → **"The drill marker"**. Read that
section before writing a single marker; do not reconstruct the format from the example above.

Four things it will tell you that matter most here:

- **`✅ sql:{file-slug}` is not the project marker.** `✅ NN-slug — {evidence}` means Victor *built*
  something; this one means he *drilled* it. A bullet may carry both, and they never substitute for
  each other.
- **Placement is forced**: the drill marker goes before the project marker, because the project
  marker's free-text evidence clause swallows anything to its right.
- **No evidence clause** on a drill marker. The file is the evidence.
- **Only a checked bullet marks**, never one merely adjacent to the topic, and never a `[Repaso]`
  exercise. A marker is never removed; the first file wins.

**Mirror it.** The bullet exists twice — in `notes/sql/coverage/{LEVEL}.md` and in the SQL section of
`notes/coverage/{LEVEL}.md`. Both carry the same marker, verbatim. Diff the two SQL sections after
writing and report the count; a marker in one and not the other is drift you introduced.

**Unchecked bullets are left alone and reported.** A step closing with `- [ ]` bullets means the route
promised coverage the exercises never drilled — that signal is the point, and marking them anyway
erases it. Report `step N cerrado con M bullets sin drillar`.

**A concept with no bullet at all is reported, never written.** If the step exercised something the
coverage file does not list, name it and stop there. Adding it is a `/coverage` decision, not a side
effect of a close — and `coverage-bullet-add` is for concepts applied in *project* code, not drilled in
exercises. Do not invoke it here.

**No `/notes-plan` is owed.** A drill marker is state, not scope: it changes no bullet's text, so the
coverage digest is unchanged (the standard's strip command removes it) and no plan owes a remap. Say so
explicitly in the report — this is the one place a reader would expect that debt and it does not exist.

---

## 2 — The doctrine's §0 quick reference

`practice/sql/PLANNING.md` §0 is read at the start of every 12:30 block, so it is the file that hurts
most when stale. The grading subagent already rewrote it (its step 4d). **Verify, do not redo**: current
step, done condition, next revision point, last updated. Fix only what is wrong, and say what you fixed.

---

## 3 — PROGRESS.md: check the arithmetic, not the prose

Also already written by the grading run. Your job is the part that silently rots: **recompute the
`Total` rows** of both the roll-up and the level table in `## Practice completed` → `### Exercise route`
and confirm they equal the sum of their columns. A `Total` row that no longer adds up is a structural
finding — report it as one.

The **`Corrected` total cell stays blank** by design (2026-08-03). Do not fill it in.

**No concept list.** It was deleted on 2026-08-03. The *what* lives on the coverage bullets, the *how
many* lives here. Never re-create it.

---

## 4 — Did this close the level, or fire a revision point?

Two checks nothing else in the track performs:

- **Revision point.** If this step ends a span in `{PLAN}` §1's revision table — the route declares the
  points, doctrine §8b only the cadence — say which point is now due
  and the one command that runs it: `/sql-exercises` with `MODE = practice`, `TOPIC = R{n}`. State it as
  available, not as owed — it is maintenance, on his schedule.
- **Level closed.** If every step in `{PLAN}` §3 now reads `closed ✅`, say so plainly, and name the next
  level's planning run (`/sql-plan middle`) as the door to it. Do not run it, and do not mark anything
  in `ROADMAP.md` — the roadmap is `roadmap-review`'s file.

Neither of these is a question, and neither blocks the close.

---

## Commits

Per CLAUDE.md and the shared session rules. **One atomic commit per concern**, on the **active branch**.
Run `git status` right before each `git add` and each `git commit`.

**You commit yourself:**

- `notes/sql/coverage/{LEVEL}.md` + `notes/coverage/{LEVEL}.md` — one commit, both mirrors together;
  splitting them is how a mirror drifts. `docs(coverage): mark N SQL junior bullets drilled by {FILE}`
- `practice/sql/PLANNING.md` and `PROGRESS.md`, if step 2 or 3 fixed anything.
- Commit message for the close itself: `docs: close SQL step N — <topic>`.

**Victor commits nothing here.** His `.sql` file was already handed to him by `sql-grade`; do not hand
him a second command for it.

---

## Report back

| Target | Result |
|---|---|
| Step | 0 — Querying basics, 2 archivos, done condition verificada |
| Drill markers | 8 bullets marcados `✅ sql:02-execution-order-set-ops` en topic + mirror (139 bullets coinciden) |
| Bullets sin drillar | 1 — `keyset pagination`, sin ejercicio puntuado. Step cerrado igualmente |
| Conceptos sin bullet | ninguno (o: `NULLS FIRST` no está en el coverage — decide con `/coverage sql junior`) |
| `/notes-plan` | n/a — un drill marker no cambia el digest |
| Doctrina §0 | verificada, `Last updated` corregido |
| PROGRESS.md | filas `Total` cuadran (29 = 20+9); `Corrected` total en blanco, correcto |
| Punto de repaso | R1 disponible (span 0–1) — `TOPIC = R1` cuando te apetezca |
| Nivel | junior sigue abierto — 13 steps por delante |
