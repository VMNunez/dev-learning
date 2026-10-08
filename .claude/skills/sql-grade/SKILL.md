---
name: sql-grade
description: >
  Grade one answered SQL exercise file and decide what happens next, WHENEVER Victor says he has
  finished answering it ("corrige el 02", "ya he respondido los ejercicios", "corrige el archivo de
  joins", "grade the file"). This is Moment 4 of practice/sql/PLANNING.md and the normal door to it —
  Victor pastes `MODE = review` into a new chat only when this skill reports it blocked. The skill
  never grades anything itself: it resolves the level and the file, refuses a partially answered file, and runs
  notes/prompts/practice/sql/_internal/_sql-exercises-review.md in a COLD subagent, because that prompt
  was written for a fresh chat and this skill runs in the session where the concept may have just been
  explained to him. It then lights the traffic light — a score under 80% sends him back to fixing, 80%
  or more on a step's last file hands off to sql-step-close. The failure mode this exists for is a grader that
  remembers teaching the answer, and a file that scores well and closes nothing. Do NOT use it to
  generate exercises (that is /sql-exercises MODE = practice or reinforce), to grade a simulation (that
  is simulation-review), or to close a step directly (that is sql-step-close, which this one calls).
---

# Grade one SQL exercise file (Moment 4)

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


Victor finished answering an exercise file. Walk steps 0–4 in order. If a step genuinely does not
apply, **say so in the report table** rather than skipping it silently.

**Do not edit his `.sql` answers.** Not to fix a query, not to tidy formatting. The grader appends
header markers — `✅ Corregido` on an accepted answer, `❌ Revisado` on a graded one it did not accept —
and nothing else; a wrong answer stays wrong on disk until he rewrites it. That is the record.

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
- that step's `{PLAN}` §3 status **before** grading — §3 needs to know whether the step was already
  `closed ✅`.

Quote the resolved file back to him in one line before doing anything.

---

## 1 — Refuse a partially answered file

Count with these exact commands — both header formats live on disk, and a pattern matching neither
returns `0`, which would then be graded as a perfect empty file:

```
grep -cE '^-- (Exercise [0-9]+ \[|#[0-9]+ \|)' {FILE}   → written
grep -cE '^--.*(✅ Corregido|❌ Revisado)' {FILE}         → already graded
grep -cE '^--.*✅ Corregido' {FILE}                      → settled
```

An exercise is answered when at least one non-comment SQL line sits between its header and the next,
and ungraded when its header carries neither marker.
**If any ungraded exercise has no answer, stop** and name them: "Faltan por responder: 7, 9, 12."
Grading a partial file records a score against work never attempted, and the score is permanent.

Settled exercises (`✅ Corregido`) are **skipped, never re-graded**. A `❌ Revisado` one without it is
graded again only while `{FILE}`'s row in `PROGRESS.md` → `### Exercise route` is not `closed ✅` — that
is the `< 80%` loop, and the branch counts it as a re-grade, moving no counter for it; in a file that
already scored ≥ 80% it is skipped too and comes back at the next revision point — except a `[Repaso]`
one, which is always graded again, since rewriting a drill is its point. If nothing is left to
grade, say so and stop — there is nothing to score, and re-running would not change a number.

---

## 2 — Grade it in a cold subagent

Dispatch **one** subagent per run — of a kind that can itself dispatch a subagent, because the branch's
Step 2a sends a second, nested one over its ✅ answers — and give it no conversation context beyond this:

- the instruction to read and execute `notes/prompts/practice/sql/_internal/_sql-exercises-review.md`
  **in full, to EOF**, as its whole task;
- the resolved `{LEVEL}`, `{FILE}`, `{TOPIC}` and `{PLAN}`;
- nothing else. **Do not summarise the session, the exercises, or what Victor was taught.** That
  contamination is the entire reason this step is a subagent and not you.

Take a `git status` just before dispatching: §3's `BLOCKED` row compares the tree against it.

The prompt owns everything from here: the second cold pass before any marker is written, the
`[Repaso]` exclusions, `PROGRESS.md`, the `{PLAN}` §3 row and its §2 checkboxes, the **doctrine's** §0
quick reference when the step closes — `{PLAN}` has no §0, and §0 is a doctrine section
(`_sql-plan-standard.md` A1) whose live values the grading run writes — and `MISTAKES.md`. **Do not re-derive, second-guess or "improve" any of it.** If its output contradicts
this file, the two have drifted — report that; do not paper over it.

---

## 3 — The traffic light

Read the subagent's verdict and take exactly one branch. **Print which branch you took and why.**

| Verdict | What you do |
|---|---|
| First line `BLOCKED — segunda pasada no despachable` | **Stop.** Nothing was graded and nothing was written — confirm it: `{FILE}` holds no `✅ Corregido` or `❌ Revisado` dated today, and none of the four doc files §4 lists has changed since a `git status` you take just before the §2 dispatch. Say the file is still ungraded and why, and open the `FRIC-NNNN` row the durable-friction close-out owes a dispatch that failed, its evidence naming the runtime and whether that runtime offers nested dispatch at all — where it does not, the defect is this skill's design, not a transient failure. §4 then writes the tracker cell and nothing else: **no `.sql` command for Victor**, since nothing was graded. The shell's `MODE = review` in a new conversation still grades the same file, because its second pass is a first-level dispatch there; «cierra el step N» then closes a step it finishes. Never grade it yourself instead. |
| Score **< 80%** | **Stop.** Name the failed concepts and the exercises they came from, straight from the `MISTAKES.md` rows this run opened or incremented. Tell him to rewrite those answers in the file and say "corrige el 02" again. Offer the narrowed batch: `/sql-exercises` with `MODE = reinforce` and `FILE = {FILE}`. No close. |
| **≥ 80%**, and the step's `{PLAN}` §3 row is still open after the subagent's 4c — another of its files, or another run of this one, is still owed | File done for now, step open. Name what is owed next — the next file, or the next run of this one — and stop. No close. |
| **≥ 80%**, and the subagent's 4c set the step's `{PLAN}` §3 row to `closed ✅` in this run | **Invoke the `sql-step-close` skill**, passing `{LEVEL}`, the step number, and every file of the step. Do not reproduce its work here. |

**A step already `closed ✅` before this run** (the status §0 noted) takes neither ≥ 80% branch,
whatever the score: a closed step is never reopened and never closed twice (doctrine invariant 14), and
the subagent has left its §3 row as it was. Name the `MISTAKES.md` rows this run closed and each failed
concept, which comes back at the next revision point — with no rewrite instruction, the same as a
failure inside a file that scored ≥ 80%. Only a `[Repaso]` batch still takes the `< 80%` row, as stated
below.

**A ⚠️ or ❌ inside a first-pass file that scored ≥ 80% blocks neither ≥ 80% branch.** A step closes
on its one scored done condition and nothing else (doctrine §3, `_sql-plan-standard.md` B5), and the
subagent has already set the §3 row on exactly that rule. The failure is not dropped: its `MISTAKES.md`
row stays open, and the next revision point takes its focus from those rows (doctrine §8b). So name each
failed concept in one line, from the rows this run opened or incremented, and say it comes back at the
next revision point (none follows the capstone) — **without** the rewrite-and-regrade instruction of the
`< 80%` branch, which is that branch's alone.

**The counters move on every scored branch**, including the failing one, for every exercise graded
there for the first time — the subagent already wrote them; a re-grade moves none, and neither does
`BLOCKED`, which scored nothing.
A 60% is real information about graded exercises, and a file that scored badly must not look like one
nobody started. What a bad score blocks is the *step closing*, never the recording.

A **`[Repaso]` batch** (a `reinforce` run, or an `R{n}-repaso.sql` file) never takes either ≥ 80%
branch, whatever it scores. It moves no counter and closes nothing by design; say "Lote de repaso: no
cuenta para ningún paso" and take the `< 80%` branch, whatever it scored.

---

## 4 — Commits

Per CLAUDE.md and the shared session rules. **One atomic commit per concern**, on the **active branch**
(`main` only receives merges via PR). Run `git status` right before each `git add` and each
`git commit`, so no `.sql` file is staged alongside a doc file.

**You commit yourself** — these are written by the prompt, never by Victor, so the authorship boundary
puts them on your side:

- `practice/sql/MISTAKES.md` (authorized 2026-07-22)
- `PROGRESS.md` and `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` (same boundary — the ritual writes them)
- `practice/sql/PLANNING.md`, **when the subagent's report says its 4d fired** — closing a step rewrites
  the doctrine's §0 quick reference. Take the list from the subagent's report; it ends with the exact
  files it modified. This one is easy to miss because a close reads like a route-file change, and §0 is
  the first thing `sql-block-open` reads the next morning.
- `notes/prompts/_internal/_run-tracker.md` — **only** the `Exercises` cell for `{LEVEL}` in
  `## SQL exercise track`, rewritten after every return of the subagent, `BLOCKED` included, in the shape
  that section defines: `X/Y steps closed — {outcome}`, both numbers read from `{PLAN}` §3 as the subagent
  left it. Its own commit. Grading is what moves `X`, so the cell is this run's to keep true.

**Before staging, check the returned list against what the score owes** — the one close-out check this
door keeps. It names `PROGRESS.md` whenever an exercise was graded for the first time or the file's
status moved, unless `{FILE}` is an `R{n}-repaso.sql`; `{PLAN}` whenever a first-pass exercise was graded
for the first time, its §3 status moved, or 4c-bis changed a coverage checkbox — including a look-back-only
change. A run of re-grades alone that moves neither the file's `PROGRESS.md` row, a §3 status nor a coverage
checkbox owes neither file; `MISTAKES.md` whenever the summary shows a ⚠️ or ❌; and
`practice/sql/PLANNING.md` whenever a §3 row went to `closed ✅`. A file owed and missing from the list,
or listed and absent from `git status`, is reported, and is a deviation of this run on the branch step
that owed it (below) — unless the report states that skip under the branch's Step 4, which permits one.

**No `_last-run-report-sql-exercises.md` on this door.** That report is the close-out of a run of the
`sql-exercises` shell, and the shell never runs here — this skill hands the subagent the branch alone. The
evidence this door leaves is this skill's own close-out: the `desvíos:` line, and the branch's
`desvíos de la rama:` line, which that close-out records (below).

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
| PROGRESS.md | junior roll-up 30/209, fila del archivo 10/10, filas `Total` recalculadas |
| Route file | §3 step 0 → `closed ✅`, §2 checkboxes 8/9 marcados |
| Doctrina §0 | 4d disparó — Current step → step 1, Done condition y Last updated reescritos (el `{PLAN}` no tiene §0) |
| Branch taken | ≥ 80% y último archivo del step → `sql-step-close` invocado; el ⚠️ de `NULLS LAST` no bloquea el cierre — vuelve en el próximo punto de repaso |
| Tracker | `SQL exercise track` → junior `Exercises`: `1/14 steps closed — step 0 closed (02 graded 9/10)` |
| Commits | mine: MISTAKES.md, PROGRESS.md, PLANNING-junior.md, PLANNING.md (4d disparó), `_run-tracker.md` · yours: the `.sql` (commands below) |

**The branch's `desvíos de la rama:` line is part of this run's deviation close-out.** Its steps are this
ritual's declared work, run through §2, so each `<file> → <heading>` it names is a deviation of this run,
logged under the shared deviation close-out above with `Scope: shared` — the step is written in a contract
this skill executes, never in this file — and counted in this run's `desvíos:` line. `ninguno` adds
nothing.
