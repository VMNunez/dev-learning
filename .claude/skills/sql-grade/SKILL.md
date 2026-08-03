---
name: sql-grade
description: >
  Grade one answered SQL exercise file and decide what happens next, WHENEVER Victor says he has
  finished answering it ("corrige el 02", "ya he respondido los ejercicios", "corrige el archivo de
  joins", "grade the file"). This is Moment 4 of practice/sql/PLANNING.md and the only door to it —
  Victor does not paste `MODE = review` into a new chat any more. The skill never grades anything
  itself: it resolves the level and the file, refuses a partially answered file, and runs
  notes/prompts/practice/sql/_internal/_sql-exercises-review.md in a COLD subagent, because that prompt
  was written for a fresh chat and this skill runs in the session where the concept may have just been
  explained to him. It then lights the traffic light — failures send him back to fixing, a clean score
  on a step's last file hands off to sql-step-close. The failure mode this exists for is a grader that
  remembers teaching the answer, and a file that scores well and closes nothing. Do NOT use it to
  generate exercises (that is /sql-exercises MODE = practice or reinforce), to grade a simulation (that
  is simulation-review), or to close a step directly (that is sql-step-close, which this one calls).
---

# Grade one SQL exercise file (Moment 4)

Victor finished answering an exercise file. Walk steps 0–4 in order. If a step genuinely does not
apply, **say so in the report table** rather than skipping it silently.

**Do not edit his `.sql` answers.** Not to fix a query, not to tidy formatting. The grader writes
`-- ✅ Corregido` markers and nothing else; a wrong answer stays wrong on disk until he rewrites it.
That is the record.

---

## 0 — Resolve the file, or stop

- `{LEVEL}` — from what Victor said, else `junior`.
- `{PLAN}` = `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`. **If it does not exist, stop** and print:
  "Error: no existe `{PLAN}`. Corre `/sql-plan {LEVEL}` antes de corregir." Do not fall back to
  `practice/sql/PLANNING.md` — the doctrine is level-neutral and has no route to score against.
- `{FILE}` — the file Victor named, resolved against `{PLAN}` §1. He will say "el 02"; match on the
  numeric prefix. **Never invent a path**, and if two files match, ask which one in a single line —
  that is a disambiguation, not a ritual question.
- `{TOPIC}` — the `TOPIC` of the `{PLAN}` §2 step that owns `{FILE}`. It is read from the plan, never
  guessed from the filename.

Quote the resolved file back to him in one line before doing anything.

---

## 1 — Refuse a partially answered file

Count with these exact commands — both header formats live on disk, and a pattern matching neither
returns `0`, which would then be graded as a perfect empty file:

```
grep -cE '^-- (Exercise [0-9]+ \[|#[0-9]+ \|)' {FILE}   → written
grep -cE '^--.*✅ Corregido' {FILE}                      → already graded
```

An exercise is answered when at least one non-comment SQL line sits between its header and the next.
**If any ungraded exercise has no answer, stop** and name them: "Faltan por responder: 7, 9, 12."
Grading a partial file records a score against work never attempted, and the score is permanent.

Already-graded exercises are **skipped, never re-graded**. If every exercise already carries a marker,
say so and stop — there is nothing to score, and re-running would not change a number.

---

## 2 — Grade it in a cold subagent

Dispatch **one** subagent per run, and give it no conversation context beyond this:

- the instruction to read and execute `notes/prompts/practice/sql/_internal/_sql-exercises-review.md`
  **in full, to EOF**, as its whole task;
- the resolved `{LEVEL}`, `{FILE}`, `{TOPIC}` and `{PLAN}`;
- nothing else. **Do not summarise the session, the exercises, or what Victor was taught.** That
  contamination is the entire reason this step is a subagent and not you.

The prompt owns everything from here: the second cold pass before any marker is written, the
`[Repaso]` exclusions, `PROGRESS.md`, the `{PLAN}` §3 row, the §2 checkboxes, the §0 header, and
`MISTAKES.md`. **Do not re-derive, second-guess or "improve" any of it.** If its output contradicts
this file, the two have drifted — report that; do not paper over it.

---

## 3 — The traffic light

Read the subagent's verdict and take exactly one branch. **Print which branch you took and why.**

| Verdict | What you do |
|---|---|
| Score **< 80%**, or any ❌ / ⚠️ | **Stop.** Name the failed concepts and the exercises they came from, straight from the new `MISTAKES.md` rows. Tell him to rewrite those answers in the file and say "corrige el 02" again. Offer the narrowed batch: `/sql-exercises` with `MODE = reinforce` and `FILE = {FILE}`. No close. |
| **≥ 80%**, but `{PLAN}` §1 shows the step owns other files that are not yet scored | File done, step open. Name the next file and stop. No close. |
| **≥ 80%** and this was the step's **last** unscored file | **Invoke the `sql-step-close` skill**, passing `{LEVEL}`, the step number, and every file of the step. Do not reproduce its work here. |

**The counters move on every branch**, including the failing one — the subagent already wrote them.
A 60% is real information about graded exercises, and a file that scored badly must not look like one
nobody started. What a bad score blocks is the *step closing*, never the recording.

A **`[Repaso]` batch** (a `reinforce` run, or an `R{n}-repaso.sql` file) can never take the third
branch. It moves no counter and closes nothing by design; say "Lote de repaso: no cuenta para ningún
paso" and end at the first branch instead.

---

## 4 — Commits

Per CLAUDE.md and the shared session rules. **One atomic commit per concern**, on the **active branch**
(`main` only receives merges via PR). Run `git status` right before each `git add` and each
`git commit`, so no `.sql` file is staged alongside a doc file.

**You commit yourself** — these are written by the prompt, never by Victor, so the authorship boundary
puts them on your side:

- `practice/sql/MISTAKES.md` (authorized 2026-07-22)
- `PROGRESS.md` and `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` (same boundary — the ritual writes them)

**Victor commits himself** — hand him the commands in the standard two-block format (`git add` block,
then `git commit` block), one command per block:

- the exercise file. His answers *and* the correction markers live in it, and the file is his: the
  markers are an annotation on his work, not authorship of it. `docs(sql): grade {FILE} — N/M`

If `sql-step-close` ran, it reports its own commits; do not stage its files here.

---

## Report back

| Target | Result |
|---|---|
| File | `practice/sql/junior/02-execution-order-set-ops.sql` — step 0, TOPIC `basics` |
| Answered check | 10/10 answered, 0 already graded |
| Score | 9/10 (90%) — segunda pasada: 9 ✅ confirmados, 0 revertidos |
| MISTAKES.md | 1 fila abierta (`NULLS LAST`), 0 cerradas |
| PROGRESS.md | junior roll-up 29/200, fila del archivo 10/10, filas `Total` recalculadas |
| Route file | §3 step 0 → `closed ✅`, §2 checkboxes 8/9 marcados, §0 → step 1 |
| Branch taken | ≥ 80% y último archivo del step → `sql-step-close` invocado |
| Commits | mine: MISTAKES.md, PROGRESS.md, PLANNING-junior.md · yours: the `.sql` (commands below) |
