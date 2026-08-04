# SQL Learning Plan

**Purpose:** the compass for the 12:30 SQL block, built to the same contract as a project
`PLANNING.md`. `notes/sql/coverage/{LEVEL}.md` says *what* must be learned; this file says *in what order*,
*which files it produces*, *how many exercises each one gets*, *which prompt runs at which moment*,
*what to update when a step closes*, and *when the whole track is finished*.

**Database:** PostgreSQL (local, pgAdmin). **Schema:** the canonical bookstore schema defined in
`notes/prompts/practice/sql/sql-exercises-prompt.md` (`authors`, `publishers`, `genres`, `books`,
`customers`, `orders`, `order_items`, `reviews`) — that prompt is the single source of truth for it.
The capstone switches to the TimeTrack model.

> ⚠️ **`01-basics.sql` carries an older, thinner schema** (`order_books` with no `quantity` or
> `unit_price`, `authors.nationality`, `books.year`) and is **closed** because of it — resolved
> 2026-07-22 by leaving it alone and starting `02-execution-order-set-ops.sql` with the canonical
> schema. Every file from `02-` on ships its own canonical SETUP block: one file, one schema.

**Target:** pass the SQL half of a technical screening at NTT Data / Capgemini / Indra, and write the
report queries TimeTrack needs without looking anything up.

---

## Section 0 — Session quick reference

**Read this first every SQL block. Update it at the start of every session.**

| | |
|---|---|
| **Current level** | junior — route file `practice/sql/junior/PLANNING-junior.md` (the six rows below refer to it) |
| **Current step** | Step 0 — Querying basics (`01-basics.sql` cerrado con 20 first-pass; `02-execution-order-set-ops.sql` sin crear, target 30) |
| **Current branch** | the active feature branch (study materials follow it — see §7) |
| **Done condition** | `Review: sql-grade scores ≥ 80% on 02-execution-order-set-ops.sql` |
| **Next revision point** | R1 (route §1) — fires when Step 1 closes and `03-joins.sql` is scored |
| **Blocked on** | nothing. `02-execution-order-set-ops.sql` está sin crear: el bloque empieza en Moment 2 — `/sql-exercises` con `MODE = practice` y `TOPIC = basics`, que lo genera con su bloque SETUP. Se genera el día que se responde, no antes. |
| **Last updated** | 2026-08-04 |

---

## Section 1 — How this plan relates to the hub files

| File | Role here |
|------|-----------|
**The two inputs, and this plan never invents beyond them:**

| File | Role here |
|------|-----------|
| `notes/sql/coverage/{LEVEL}.md` | **What** must be learned at the level being drilled. This plan never restates it — it points at sections, and every step claims bullets of it. |
| `ROADMAP.md` (repo root) | **Why, and by when.** Read at two sections only: `## 12:30–13:30 block — SQL then practice` — the objective the ordering serves (a junior Angular + Java role in Spain, technical screening first, and the Stage-1 → Stage-2 switch gate) — and `## Daily schedule (fixed from June 2)`, the block the pace has to fit. It is what makes a step-ordering decision justifiable rather than a preference: an order that puts a rarely-screened topic in front of one that opens every technical test is wrong *against this file*, and that is the check the audit runs. Nothing outside those two sections can falsify a route-ordering decision. |

**Two more files it writes to or mirrors, which are not inputs:**

| File | Role here |
|------|-----------|
| `PROGRESS.md` (SQL section) | **What** has been learned. Authoritative status; the level's route §3 is the at-a-glance copy. |
| **This file** | **In what order**, with which files, how many exercises, which prompt, and what "done" means. |

**The plan is two files, and the split is by level-neutrality.** *This* file is the **doctrine**: the
step loop, the done-condition formats, the closing ritual, the branch rules, the revision mechanism, the
quality gates, the invariants, the closure condition and the out-of-scope fence — identical whichever
level is being drilled, which is why a step loop that said something different at middle than at junior
would be a step loop nobody trusts. `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` is the **route**: that
level's exercise files, its steps, its progress table, its coverage fingerprint — one per level, because
the coverage checklist is. One doctrine, three routes. §5, §6 and §8 below are the pointers left behind
where the route's three sections used to live.

If a concept is missing, it is added to `notes/sql/coverage/{LEVEL}.md` — never invented here. This plan
is downstream of coverage exactly like a project `PLANNING.md` is.

---

## Section 2 — The step loop: exactly when to run each prompt

Every step runs the same five moments. **The prompts run in a separate conversation, never in the
daily 12:30 session.** Each moment states the trigger, the prompt, and the config to paste.

> **The pasted config has exactly five keys — `MODE`, `TOPIC`, `LEVEL`, `COUNT`, `FILE` — and `sql-exercises-prompt.md`
> says in as many words: do not add keys.** `MODE` and `TOPIC` are required; `LEVEL`, `COUNT` and `FILE` are
> optional overrides (`LEVEL` blank means `junior`, and it is what selects the route file — pin it on any
> non-junior run). **`FOCUS` and `REVIEW` are not pasted keys**: the prompt derives them from the
> route §2 step whose `TOPIC` matches, which is why every step below still states its focus — it is read
> from the plan, not typed into the chat. Pasting `FOCUS = …` is a dead instruction.

### Moment 1 — Read the concept list

**Trigger:** the very start of the step, before writing a single query.
**Prompt:** none. Open `notes/sql/coverage/{LEVEL}.md` and read the sections listed for that step.

---

### Moment 2 — Generate the exercises  ▶ RUN A PROMPT

**Trigger:** immediately after Moment 1, with the exercise file still empty.
**Prompt:** `notes/prompts/practice/sql/sql-exercises-prompt.md` — paste into a **new chat**.

```
MODE  = practice
TOPIC = <the step's TOPIC, given per step in the route §2>
COUNT = <the step's COUNT, given per step in the route §2 — never the default>
```

The step's focus travels with the step, not with the paste: the prompt looks up the route §2 entry for that
`TOPIC` and reads its **`**Focus:**`** line from there.

**Nothing else is added to the paste — nothing.** Since 2026-07-22 the prompt's own path table matches
the route §1 file for file, and the two rules that used to be pasted by hand are derived instead:
- the **new-concept rule** ("every exercise must introduce a concept not already drilled in this file")
  is what `{REVIEW} = no` means, and the prompt applies it on every first-pass batch;
- the **cross-topic rule** (one Challenge combining an earlier topic, two from Step 5 on) is read off
  the step's `**Reinforces:**` line.

A rule you have to remember to paste is a rule that eventually does not get pasted. If the prompt ever
asks where to save, or hands back a batch that ignores one of these, the plan and the prompt have
drifted — fix the prompt, not the run.

---

### Moment 2b — Review runs (off the critical path, any time)  ▶ RUN A PROMPT

**Two triggers, and only one of them is optional.**
- **Mandatory** — every revision point the level's route §1 declares, on the §8b cadence, and the two
  hard checkpoints among them above all (the point that closes the screening core and the one that
  closes the block after it — which points those are, and what fires them, is the route's to say). The
  focus is not a judgement call there: it is the open rows of `practice/sql/MISTAKES.md`. See §8b.
- **Optional** — whenever a topic feels rusty, on any step, including one already ✅. This is how
  `01-basics.sql` grew from 20 to 40 exercises, and it is a legitimate use of the block.

**Why the mandatory half exists.** Invariant 1 gives each coverage section to exactly one step, so
every concept is drilled once and never returns. Left to the optional trigger alone, the gap closes
only when Victor notices it — and a forgotten concept does not feel rusty, it feels learned. The
mistake log is the objective substitute for that feeling.

**Prompt:** the same `sql-exercises-prompt.md`, `MODE = practice`. Lo que pegas depende de cuál de los
dos triggers estés atendiendo:

**Punto de repaso de §8b (obligatorio)** — `TOPIC` es el punto, no un tema:

```
MODE  = practice
TOPIC = R2
```

El prompt reconoce los puntos de repaso de la ruta, abre `practice/sql/MISTAKES.md`, coge las filas
abiertas cuyo `Step` cae en el span del punto, las ordena por `Times` descendente y **eso** es el foco.
Escribe en `practice/sql/{LEVEL}/R{n}-repaso.sql`, su propio archivo. Si el span no tiene filas abiertas
el punto se dispara igual y el foco pasa a los conceptos del span menos ejercitados.

**Revisita voluntaria de un tema** — `TOPIC` es el tema, y el modo dedicado es `reinforce`:

```
MODE  = reinforce
TOPIC = <the topic being revisited>
```

`reinforce` corre la misma rama que `practice` pero con `{REVIEW} = yes` desde el principio. Pegar
`MODE = practice` sobre un archivo que ya tiene escrito su target first-pass también acaba en un lote
de repaso — el guard "target already met" del prompt te lo ofrece — pero por la puerta larga.

**Again, nothing else is pasted — and this is the part that changed.** A review batch used to require
two hand-typed lines (*"deliberate repetition is the point"*, *"skip Intro"*), because the prompt's
difficulty split was fixed at 25/50/25 with no notion of a review batch. It is not fixed any more: the
prompt derives `{REVIEW} = yes`, drops the Intro tier, splits 60% Standard / 40% Challenge, labels the
exercises `[Repaso]`, and excludes them from the step's target — all of it automatically.

`{REVIEW} = yes` is derived from **una de cuatro cosas**, nunca de una clave pegada a mano:
- `MODE = reinforce` — siempre;
- un `TOPIC` que es un punto de repaso de la ruta (`R{n}`) — siempre es un lote de repaso;
- un **`**Moment 2b reinforcement block:**`** que un run de `sql-grade` añadió al step de la ruta §2 tras
  puntuar por debajo del 60% — lleva su propio `COUNT` y su propio `**Focus:**`, sacados de los
  conceptos que fallaron;
- o, en una revisita voluntaria, el guard "target already met": el prompt ve que el archivo ya tiene
  escrito su target first-pass y te ofrece el lote de repaso.

Why it stopped being manual: leaving it to a pasted line is exactly how #21–#40 happened — twenty
exercises that re-covered the same ground at the same difficulty, buying three genuinely new concepts
(`NOT LIKE`, `IS NOT NULL`, `NOT BETWEEN`). The repetition was right; the *level* was too low to earn
its hour, and the line that would have fixed it was one nobody remembered to type.

**Review runs do not advance a step.** They are not counted in the route §1's targets and never flip a status in
the route §3 — a step closes on its first-pass exercises alone. Review is maintenance on ground
already taken.

**They come labelled.** The prompt writes `-- Exercise N [Repaso]:` instead of
`[Intro]/[Standard]/[Challenge]`, so the file itself records which batch was first-pass and which was
review. Without that marker, six months from now nothing distinguishes them — and the review-mode score
silently mixes both.

---

### Moment 3 — Answer them

**Trigger:** the daily 12:30 block, in pgAdmin, writing each query under its comment.
**Prompt:** none.

---

### Moment 4 — Get them graded  ▶ RUN A SKILL

**Trigger:** once **every** exercise in the file has an answer — never partially.
**Skill:** `sql-grade`, in the daily session. Say which file — *"corrige el 02"* — and nothing else.
There is no config to paste and no new chat to open: the skill resolves the level and the file, and
runs the grading prompt in a cold subagent.

What it does, beyond printing a score:

- **Writes `-- ✅ Corregido <fecha>`** under every answer it accepts, and **skips anything already
  marked** on later runs. So the score always measures the new batch, never a growing pile of
  already-validated work, and the file itself records what is settled.
- **Updates `PROGRESS.md`** — the level roll-up, the file's row, and the recomputed `Total` rows.
- **Updates the level's route file** — the step's §3 row, its §2 coverage checkboxes, and the §0 header
  when the step closes.
- **Re-checks every answer it accepted** with a cold subagent before writing any marker, and prints
  "Segunda pasada: N ✅ confirmados, M revertidos". A marker is permanent, so it is not written on a
  single grader's word.
- **Logs every ⚠️ and ❌ in `practice/sql/MISTAKES.md`**, one row per concept, and closes the rows this
  run redeemed. It does **not** write to `notes/sql/` or `notes/interview-prep/` — those tracks are
  not planned here (§Z).

**The counters move at any score.** A 60% is real information about twelve graded exercises, and
withholding it would make a badly-scored file look like one nobody started. What a bad score blocks is
the *step closing*, not the recording.

**Below 80% → do not advance.** `sql-grade` stops there itself, names the failed concepts and offers the
narrowed batch. This is a hard stop, not a suggestion: every later step assumes the earlier one.

---

### Moment 5 — Close the step  ▶ AUTOMATIC

**Trigger:** the step's done condition passes on its last file.
**You run nothing.** `sql-grade` hands off to `sql-step-close` on the spot, and §4 happens without being
asked for. The one thing to check is its report table — a skipped item is stated there, never silent.

---

### Moment 6 — End the block  ▶ RUN A SKILL

**Trigger:** the hour is over, in whatever state the file is. **This is not Moment 5**: a step closes
thirteen times at junior, a block ends every day, and almost always mid-file.
**Skill:** `sql-block-close`. Say "cierro el bloque" and nothing else.

It writes exactly one thing — the **`## Fricción` rows of `MISTAKES.md`**: the concepts that cost you
time today and were never marked wrong. It asks you nothing; it takes them from what you already said
while working. Everything else it does is read-only: today's delta, and where tomorrow starts in the
shape `sql-block-open` will print it, so tomorrow's opener confirms rather than rediscovers.

**Why a whole Moment for it.** Between Moment 3 and Moment 4 the track sees nothing. The grader records
only what came back ⚠️/❌, so the concept you rewrote three times, or looked up in the notes, and then
got right, scores ✅ and disappears — and it is the one that stalls a whiteboard round. A ✅ obtained
slowly and a ✅ obtained cold are not the same fact. Skipping this Moment costs nothing today and
returns an empty `FOCUS` at the next revision point whose span you happened to pass.

---

## Section 3 — Done-condition format

Every done condition in §0 and in a level’s route §2 uses **one** of these four formats exactly. Nothing else is valid —
"I understand joins" is not testable and is not allowed. Each one is testable by someone else: another
person can run it and get the same verdict without asking how you feel about the topic.

- `Review: sql-grade scores ≥ [n]% on [file]`
- `pgAdmin: [query] returns [concrete result]`
- `Terminal: [command] produces [concrete observable result]`
- `Timed: [n] queries from prose in under [m] minutes each, no reference open`

**Every step closes on exactly one condition, and it is machine-checkable.** The capstone uses the
`Timed:` format; every other step uses one of the first three. Nothing outside this list closes a step —
a note being written or a question being added to the Q&A bank is a different track (§Z) and never a
done condition here.

> **The `Aloud:` format was removed on 2026-08-03, and with it the two-condition rule.** Every step used
> to need a second condition — its exit question, answered aloud from memory — on the argument that a
> score measures queries written with time to think, which does not distinguish recognising a concept
> from recalling it. That argument is sound, but it describes **retrieval practice, which is the
> `simulator` and interview-prep track's job** (§Z), not this one. Keeping it here bought nothing the
> Q&A bank does not already do, and it put a manual, unautomatable gate in the middle of a ritual that
> is otherwise fully mechanical — which is exactly how a ritual stops being run.
>
> **And the `**Q&A seed:**` line that replaced it was removed on 2026-08-04.** The exit questions had
> survived as inert seed lines in the route §2, on the argument that a good question should not be lost.
> The cost was that the planner still had to *write an interview question per step* — question-authoring
> inside a track whose entire subject is exercises, done without the interview-prep standard, without
> its cold review, and owed to nobody once written. This track generates exercises, grades them and
> tracks them; the questions are `/interview-prep-audit`'s output and are produced there, from the
> coverage file, when Victor decides to (§Z). No step carries a question of any kind.

---

## Section 4 — Step-complete ritual

**The ritual is a skill, and the skill is the only way it is run.** Four of them cover the track, and
they hand off in one direction — you never invoke `sql-step-close` yourself:

| Skill | Fires when | What it owns |
|---|---|---|
| `sql-block-open` | you start the 12:30 block | read-only orientation: current step, unanswered exercises, open `MISTAKES.md` rows, which Moment is next. Writes nothing. |
| `sql-grade` | you finished answering a file | grades it, then the traffic light: failures → back to fixing; clean → hands off to `sql-step-close` **only if this was the step's last file** |
| `sql-step-close` | handed the step by `sql-grade` | the closing ritual below, end to end, without asking anything |
| `sql-block-close` | you end the block, whatever state it is in | the `## Fricción` rows of `MISTAKES.md` and where tomorrow starts. Writes no counter and closes no step. |

**Two of these close different things, and conflating them is the mistake to avoid.** A *step* closes
when its exercises are scored — rarely, thirteen times at junior. A *block* ends every single day,
almost always mid-file. `sql-block-close` exists because everything between those two events used to be
lost: the grader records only what came back ⚠️/❌, so a concept that cost twenty minutes and then came
out right scored ✅ and vanished. That concept is the one that stalls an interview, and §8b's revision
points now read it (`## Fricción`) when a span has no graded failures left.

`sql-grade` does not re-implement grading: it runs
`notes/prompts/practice/sql/_internal/_sql-exercises-review.md` **in a cold subagent**, which is where
Steps 4a–4e below actually happen. That isolation is not decoration — the prompt was written for a fresh
chat, and a skill runs inside the session where the concept may have just been explained to you. A
grader that remembers teaching you the answer is not a grader.

**What a close touches, and who writes it:**

1. **`PROGRESS.md`** *(automated, by the grading subagent)* — `## Practice completed` → `### Exercise
   route`: the level's roll-up row, the file's row in the level table, and the recomputed `Total` rows of
   both. **No concept list.** It was deleted on 2026-08-03 because it was an evidence-free second copy of
   the coverage file; the *what* lives on the coverage bullets, the *how many* lives here. Do not
   re-create it.
2. **The level's route file** `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` *(automated)* — the step's row in
   §3, its `**Coverage bullets:**` checkboxes in §2, and §0 refreshed when the step closes. (The junior
   route was migrated out of this file on 2026-08-03; §5, §6 and §8 here are pointers now, and every one
   of those edits lands in `practice/sql/junior/PLANNING-junior.md`.)
3. **`notes/sql/coverage/{LEVEL}.md`** *(automated, by `sql-step-close`)* — every bullet the step's graded
   exercises actually drilled gets the marker **`✅ sql:{file-slug}`**, e.g.
   `✅ sql:02-execution-order-set-ops`. This is deliberately **not** the `✅ NN-slug` project marker that
   `coverage-mark` writes: "I drilled it in an exercise" and "I shipped it in project 07" are different
   claims, and a file that conflates them stops being able to answer either question. A bullet can carry
   both. A bullet is never unmarked, and a `[Repaso]` exercise marks nothing.
4. **A concept with no bullet at all** *(reported, not written)* — if the step exercised something the
   coverage file does not list, `sql-step-close` reports it and stops there. Adding it is a `/coverage`
   decision, not a side effect of a close.

**Nothing in this ritual asks you a question.** If a step cannot close, the skill says why and stops; it
never blocks waiting for an answer.

5. **The commit** *(manual — Victor runs it; the exercise file is his authorship, §7)* — one atomic
   commit carrying the exercise file and everything the four items above moved. Commit message:
   `docs: close SQL step N — <topic>`.

**Then, once that commit is in, run G1b (§9) *(manual)*: `sql-plan-audit`, `SCOPE = full`.** It is the only thing
that checks this file, and the moment right after a step closes is when it has just become least true —
§0 still points at the step you finished, and the route's §1 and §3 have just moved. It comes after the commit, not
before, so it audits the numbers the ritual actually wrote.

---

## Section 5 — Every file this plan produces

**Moved 2026-08-03 → `practice/sql/junior/PLANNING-junior.md` §1.** The file inventory is level-specific,
so it lives in the level's own route file, one per level. This doctrine keeps only what is true whichever
level is being drilled; the three counts (*written* / *answered* / *scored*), the target rule and the
"a revision batch is extra" rule are defined in §8b and applied there.

---

## Section 6 — The steps

**Moved 2026-08-03 → `practice/sql/junior/PLANNING-junior.md` §2.** The step route is level-specific.
The *shape* of a step — its required fields, the `**Moment 2 config:**` and `**Focus:**` lines the
exercise prompt greps for, the done-condition formats it must use — is doctrine and stays here (§2, §3);
which steps exist, in what order and why, belongs to the level.

---

## Section 7 — Branch and commit rules

Study materials follow the **active branch** — no direct commits to `main` (`CLAUDE.md`, changed
2026-07-14). There is no dedicated SQL branch: `practice/sql/` and `PROGRESS.md` commit
on whatever feature branch the morning project block is on.

- **Before any SQL session, check the branch has the latest `practice/sql/`.** A feature branch cut
  before the last SQL commit still carries the old exercise files, and appending to them silently
  drops the newer exercises when it merges. This has already happened once: on 2026-07-22
  `fix/backend-backlog` carried a 20-exercise `01-basics.sql` while `main` had 40, plus the whole of
  the old `02-joins.sql` — resolved by merging `main` into the branch (G0).
  Check with `git log --oneline main -1 -- practice/sql/` against your branch before starting.
- Exercise files are **Victor's authorship** → Claude never commits them, only prints the commands.
- Commits stay atomic: the exercise file and its `PROGRESS.md` update are one commit.

---

## Section 8 — Progress tracking

**Moved 2026-08-03 → `practice/sql/junior/PLANNING-junior.md` §3.** Status is per level, driven by the
**scored** count and by nothing else. `PROGRESS.md` → `## Practice completed` → `### Exercise route`
holds the authoritative figures; each level's route §3 is its at-a-glance copy.

---

## Section 8b — Revision points

**Revision is scheduled, not felt.** A concept you have forgotten does not feel rusty — it feels
learned, which is exactly why "revise when it feels shaky" cannot be the trigger. This section fixes
both halves of that: *when* revision happens, and *what* it drills.

### The cadence — one revision point every 3 exercise files

Fixed, never left to judgement. A revision point fires when the third file since the previous one has
been **scored**, and it re-drills the concepts of those three files. Every point is decided up front,
nothing invented mid-session.

**Which points exist, what each one spans and what fires it, live in the level's route §1 — never
here.** That table is the single source, because a route that reorders its steps must not require an
edit to a level-neutral file to stay true. This section owns only the rule the route is held to: at
least one point every three files of the route §1, plus the two structural exceptions below.

- **Two of the points are hard checkpoints** — the one that closes the screening core, and the one that
  closes the block after it. By then each concept has been drilled exactly once (invariant 1) and
  whatever was failed is still sitting open in `MISTAKES.md`. Neither is skippable, and neither waits
  for a topic to *feel* rusty. A point clears when its span has no `## Open` row left in `MISTAKES.md`.
- **The last point may span two files rather than three**, because the capstone is itself the
  integration pass over everything — a revision point immediately before it would drill the same ground
  twice.

### The focus — read from the record, never from a feeling

Every revision point runs Moment 2b with its `FOCUS` taken from the **open rows of
`practice/sql/MISTAKES.md`** for the files in its span — the written record of what was actually
answered wrong. Not "what feels rusty". **Order them by `Times` descending**: the concept failed three
times earns the batch before the one failed once.

If a span has no open rows the point still fires, and it has a **second record before it starts
guessing: the `## Fricción` rows** of the same file, written by `sql-block-close` — concepts that cost
time in a block and were never graded wrong, most recent first. A ✅ obtained slowly and a ✅ obtained
cold are not the same fact, and until 2026-08-04 nothing in this track could tell them apart: the
grader only ever sees what came back ⚠️/❌, so the concept you fought for twenty minutes and then got
right left no trace at all. Only with neither open nor friction rows does `FOCUS` fall back to the
concepts of those files that have appeared in the fewest exercises — a proxy for nothing, and the case
to avoid rather than the default.

**Y esto es ejecutable, no una intención.** Pegas `TOPIC = R2` y el prompt hace exactamente lo de
arriba: filtra `## Open` por la columna `Step`, ordena por `Times`, y escribe en `R2-repaso.sql`. Los
spans por step los lee de la tabla de archivos de repaso de la ruta §1, que es la misma que usas tú.
Hasta 2026-07-22 esta sección describía un mecanismo
que ningún prompt sabía ejecutar: `MODE = practice` solo miraba la línea `**Focus:**` del step, así que
un ⚠️ suelto en un review de 85% dejaba la fila abierta y el punto de repaso sin nada de donde derivar
su foco.

A revision point clears when the open rows in its span are closed by a later scored run.

### A revision batch is extra

It never counts toward a step's first-pass target in the route §1, never moves a `Scored / target` figure, and
never flips a status in the route §3. Without that rule the plan starts congratulating itself for repetition:
the same twenty exercises done twice would read as forty exercises of progress.

---

## Section 8c — Simulation readiness: qué puedes pedir hoy

**Esto no programa simulaciones ni dice cómo es un test — eso es del track de simulaciones (§Z).** Dice
la única cosa que nadie más sabe: **qué técnicas tienes disponibles**, que es la tabla §3 de la ruta leída desde
fuera. Un test que exige una técnica de un step sin cerrar no es difícil, es imposible, y descubrirlo a
mitad del cronómetro no enseña nada.

**La regla:** un test SQL solo puede exigir técnicas de steps **cerrados** (`closed ✅` en la §3 de la ruta). La técnica
más dura del test es la del step cerrado más alto.

| Técnica | Disponible cuando cierra |
|---------|--------------------------|
| `SELECT`/`WHERE`/`ORDER BY`, orden de ejecución, operaciones de conjuntos | Step 0 |
| JOINs de todo tipo | Step 1 |
| `GROUP BY` / `HAVING` / agregados | Step 2 |
| Diagnóstico de fan-out y multiplicación de filas | Step 3 |
| Manejo de `NULL`, `NOT IN` con nulos | Step 4 |
| Subconsultas, CTEs, vistas | Step 5 |
| Funciones de fecha y texto, `DATE_TRUNC` | Step 6 |
| Window functions | Step 7 |
| DML y transacciones | Step 8 |
| Diseño de esquema y normalización | Step 9 |
| Tipos y DDL escrito a mano | Step 10 |
| Índices y planes de ejecución | Step 11 |

**Estado hoy (2026-08-04): 0 steps cerrados en la §3 de la ruta → ninguna simulación SQL todavía.** El primer test toca
cuando cierre el **Step 2**: basics + joins + `GROUP BY` ya es un examen real. Antes de eso no hay
superficie suficiente y el generador se planta él solo.

> ⚠️ **Los cinco tests que ya están en el banco (`practice/simulations/sql/` 01–05) están bloqueados.**
> Se escribieron antes de que existiera este plan y **los cinco piden window functions**, o sea Step 7.
> No los abras hasta entonces: no es que salgan mal, es que no se pueden empezar. Esto se apunta aquí
> porque es un hecho sobre tu conocimiento de SQL, no sobre los tests.

**Cuando toque, lo que pides es un test cuya técnica más alta sea la del último step cerrado**, y el
`FOCUS` natural es el tema de ese step — lo que acabas de cerrar es lo que menos veces has usado bajo
presión. La configuración concreta y el formato del test los pone `simulation-generator-prompt.md`;
esta sección solo te dice contra qué steps puedes tirar.

Mantener esta sección al día es parte de G1b: cuando `sql-plan-audit` mueve un step a ✅, actualiza el
"Estado hoy" de arriba.

---

## Section 9 — Quality gates: which prompt to run when

A **gate** is a checkpoint where a quality prompt runs. Same logic as the project standard: run each
prompt at the point where the file it *reads* has just become accurate, and before the prompt that
*consumes* its output.

| Gate | Trigger | Prompt + config | Why exactly here |
|------|---------|-----------------|------------------|
| **G0 — Branch sync** ✅ 2026-07-22 | Before the first SQL session on any branch | *(no prompt — `git merge main` into the branch)* | Appending to a stale file loses exercises at merge time. Done once on `fix/backend-backlog`; re-check on every future branch. |
| **G1 — Step ritual** | Every step's done conditions pass | *(no prompt — the §4 ritual, by hand)* | The `step-complete` skill only covers project steps and will not fire for SQL. Without this, every later gate reads a stale `PROGRESS.md`. |
| **G1b — Plan al día** | Right after G1, when a step closes · when `notes/sql/coverage/{LEVEL}.md` grows (i.e. after G2) · when `sql-exercises-prompt.md` changes | `notes/prompts/practice/sql/sql-plan-audit.md` · `SCOPE = full` (`SCOPE = extend` when the only trigger was new coverage sections) | This file is the one that rots fastest — every closed step, every new coverage section and every prompt change leaves it slightly less true, and nothing else audits it. It runs *after* G1 so it reads the status G1 has just made accurate, and before the next step starts building on a stale plan. Safe to run repeatedly: a clean plan comes back unchanged. |
| **G1c — Replan tras extender** | Only when G1b's last line says `⚠ /sql-plan {LEVEL} owed` — i.e. its extension engine added or re-pointed a step | `notes/prompts/practice/sql/sql-plan-prompt.md` · `LEVEL = {level}`, `MODE = update` | The audit may not refresh the route's `Coverage SHA-256` (a digest refreshed without remapping the bullets destroys the staleness signal) and may not write `PROGRESS.md` (invariant 15 is audited there, never repaired). So a run that grows the route leaves two things only the planner can close: the fingerprint and the projection's rows for the new files. Skip it and every `/sql-exercises` run warns "ruta desactualizada" forever, over a route that is in fact current. Not owed when G1b reports nothing added. |
| **G2 — Coverage refresh** ✅ 2026-07-18 | Once, before Step 0; again if a real job posting reveals a gap | `notes/prompts/knowledge/coverage/coverage-prompt.md` · `TOPIC = sql` (logged in `notes/prompts/_internal/_run-tracker.md`) | Coverage is the root of this plan. Refresh it *before* building on it, not after. |
| **G3 — PROGRESS accurate** | After **Step 13** closes | `notes/prompts/strategy/tracking/progress-update-prompt.md` (it has a dedicated SQL subagent) | Reconciles the whole SQL section in one pass, catching anything the per-step ritual missed. Must precede G4. |
| **G4 — Roadmap resync** | After G3 | `notes/prompts/strategy/tracking/roadmap-review-prompt.md` | The roadmap's SQL gate can only be marked cleared once `PROGRESS.md` says the track is finished. |

**The mandatory revision checkpoints are not gates here — they are the revision points declared in the
level's route §1**, on the §8b cadence, and that table is the only place they are scheduled from.

**Prerequisite chain (hard — a gate run out of order gives a wrong answer, not just a late one):**
`G0 → G2 → steps (G1 then G1b each, plus G1c when G1b extended the route, with the route's revision
points firing on the §8b cadence) → G3 → G4`.
G0 before anything because a stale branch corrupts the exercise files themselves. **G1 before G1b**
because `sql-plan-audit` audits §0 and the level's route §1 and §3 against `PROGRESS.md` — run it first and it faithfully
certifies the numbers the ritual had not written yet. **G2 before G1b** for the same reason in the
other direction: the audit's extension engine turns unclaimed coverage sections into new steps, so it
must read the refreshed coverage, not the old one. G3 before G4 because `roadmap-review` reads
`PROGRESS.md`.

## Section 10 — Consistency invariants

Cross-checks between sections. Verify these whenever this plan is edited:

1. **Coverage vs steps** — every **bullet** of `notes/sql/coverage/{LEVEL}.md` is claimed by exactly one
   step in that level’s route §2, or listed in that route's *Out of scope at this level* section with a
   reason. None unclaimed, none claimed twice, none claimed by two levels. Its `**Coverage:**` field
   names the sections the step claims and is the human-readable half; its `**Coverage bullets:**` list
   is what this invariant is checked against — a step can name a section and still leave half its
   bullets undrilled, and the section-level check cannot see it. (The section names are coverage's
   vocabulary, not the exercise prompt's `TOPIC` values — two steps may share a `TOPIC`.)

   **The exclusions are level-specific and live in the route, not in §Z** (see §Z's closing line): a
   bullet skipped at junior may well be drilled at middle, so nothing is excluded doctrine-wide.
2. **Steps vs exercise files** — every step in the route §2 names an exercise file that appears in the route §1's step
   table, and every file in that table belongs to a step. **Los `R{n}-repaso.sql` son la excepción
   declarada**: viven en su propia tabla de la ruta §1, pertenecen a un punto de repaso y no a un step, y ningún
   step puede nombrarlos.
3. **Exercise counts** — every step in the route §2 states a count; the per-step counts for a shared file sum to
   that file's first-pass target in the route §1; the route §3's totals match the route §1's. A file whose *written* count exceeds
   its target is not a violation — that is a review batch (Moment 2b) and is expected.
4. **Step sizing** — no generation run asks for more than 12 exercises and no step targets more than
   22; anything above 12 is split into two runs (a file's total may be higher when several steps
   write into it). **One recorded exception, not to be repeated:** Step 0 targets 30, because its
   first 20 exercises pre-date the exercise prompt (hand-written, never a generation run) and the
   schema change split the rest into a second file — see the route §2, step sizing.
5. **§0 vs the route §3** — the Current step in §0 is the first step row in the route §3 that is not ✅. Every row of that
   table is a step: nothing else is tracked there.
6. **§0 Next revision point vs the route** — the Next revision point in §0 is a real point from the
   current level's route §1, and the first one whose trigger has not fired yet given the §0 Current step.
7. **Done conditions** — every step's done condition matches one of the four formats in §3 **written
   out in full**, never abbreviated (`Review: ... ≥ 80% on X.sql` is not the format; nine steps carried
   that ellipsis until 2026-07-22), and
   nothing outside that list appears in a `Done:` line. No vague condition survives an edit.
8. **Revision cadence** — the revision points are declared in the route §1, on the §8b cadence, and one
    lands at least every **3 exercise files** of that same §1; each names its span, what fires it, and
    its focus source, the open rows of `practice/sql/MISTAKES.md`. No
    revision batch is counted in a route §1 target or a route §3 status. A span of four files with no revision
    point between them is a violation, not a scheduling preference.
9. **Prompt paths and keys, in both directions** — every prompt this plan names exists at the path
   given, and every config it says to paste uses only that prompt's real keys
   (`sql-exercises-prompt.md`: `MODE`, `TOPIC`, `COUNT`, `FILE` — `FOCUS` and `REVIEW` are derived from
   the route §2 step, never pasted). A plan pointing at a moved prompt or an invented key rots silently: the
   run happens and produces something else. **And the reverse**: every value the prompt says it derives
   from this plan must be here **in the literal shape it looks for** — a `**Moment 2 config:**` line
   carrying `COUNT = n`, and a `**Focus:**` line, in every route §2 step; plus an exercise range on each run
   of **any** step whose two runs share a `TOPIC` — a step split across two runs under two different
   `TOPIC` values does not need one, since the `TOPIC` already tells the prompt which run it is being
   asked for. A step missing one of those is the same dead
   instruction as an invented key, and it fails later and more quietly: on 2026-07-22 Step 0 had
   neither, and a `TOPIC = basics` run would have silently generated a batch of 4 nobody asked for.
10. **Extendable without rewriting** — growth is the normal case here, not a special event. When
    `notes/sql/coverage/{LEVEL}.md` gains a `## ` section (G2, or a job posting revealing a gap), it becomes a **new
    step**, added by this procedure and nothing else:
    - **Position it by dependency, not by number.** Insert it after the last step whose concepts it
      needs and before the first step that needs it, and write the one-sentence reason into its
      `Why here:` line — that reason is what lets the next insertion be placed correctly.
    - **Do not renumber.** Existing step numbers stay as they are, closed steps above all: a step
      inserted between Steps 5 and 6 is `Step 5b`. Step numbers are labels, not an ordering key —
      the route §2's reading order is the ordering, and the route §1 has already decoupled file numbers from step
      numbers for the same reason.
    - **It takes its own file.** A new step never appends to a file another step already targets:
      one new row at the end of the route §1 (next free `NN-`, its first-pass target, status *to create*),
      one new row in the route §3 at its reading position, `0 / target`, *not started*.
    - **Re-check the invariants it moves** — 1 (the new section is now claimed once), 4 (target ≤ 22,
      runs ≤ 12), 8 (a revision point still lands at least every 3 files in the route §1 — a new file may push
      a span to four, in which case the route §1 gains a point or an existing one moves).
    - The reverse case: a step claiming a coverage section that no longer exists is re-pointed at the
      section that replaced it, or removed with its route §1 and §3 rows — never left claiming a name that
      is not in `notes/sql/coverage/{LEVEL}.md`.

    Only exercise steps are added this way. A new coverage section never adds a note, Q&A or
    simulation task to this plan — those tracks run separately, on their own prompts, and pick the
    new section up on their own runs.

11. **One artefact, one schema** — an exercise file whose SETUP block no longer matches the canonical
    schema in `sql-exercises-prompt.md` is **closed, not extended**: the next numbered file starts
    fresh with its own SETUP block, and the route §1 and §3 record the split. `01-basics.sql` is the standing
    case (adopted 2026-07-22). Appending to such a file produces exercises that do not run in Victor's
    pgAdmin, which is a worse failure than a longer file list.

12. **The route carries a live coverage fingerprint** — every `PLANNING-{LEVEL}.md` header states a
    `Coverage SHA-256` over its coverage file's **scope bytes** (evidence markers stripped, canonical
    command in `_coverage-standard.md`). A route whose digest no longer matches is **stale, not wrong**:
    it maps a checklist that has since grown, so `sql-exercises` says so in one line and continues, and
    `sql-plan-prompt` is owed a re-run. Only `sql-plan-prompt` recalculates it — `sql-plan-audit` reports
    the mismatch and never refreshes it, because a digest refreshed without remapping the bullets
    destroys the only signal that the remap is owed. Without the digest a coverage file can gain a whole
    section and nothing anywhere notices.

13. **Level isolation** — every level owns a directory, `practice/sql/{LEVEL}/`, holding its exercise
    files, its revision files and its own `PLANNING-{LEVEL}.md`, each numbering from `01`. **No level is
    flat**, so no numbering collides: the isolation is the folder, not the number. Junior's existing
    files are never renumbered — they are Victor's authored work and several are closed; they were
    relocated into `junior/` once, wholesale, when the layout was made symmetric (2026-08-03). Two files
    stay at `practice/sql/` root because neither belongs to a level: this doctrine, and `MISTAKES.md`,
    one shared log for the whole track — a concept failed at junior and re-failed at middle is one row,
    not two, which is why its `Step` column is qualified (`junior:3`, never `3`).

14. **A closed step is never reopened and never renumbered** — new coverage scope landing on a closed
    step goes to its `**Pending additions:**` field, and a reinforcement run drills it. Reopening a step
    whose exercises were answered and graded throws away the only record that they were.

15. **The route has a projection in `PROGRESS.md`, and it is complete** — `## Practice completed` →
    `### Exercise route` carries one roll-up row per level plus one detail table per level, and that
    table holds **a row for every file the route declares**, including files not written yet, seeded by
    `sql-plan-prompt` with `Corrected = —`, `First-pass / target = 0/{route §1 target}`,
    `Status = not created`. Pending files are never collapsed into a "12 files remaining" row: seeing
    what is left is the whole point. Both tables end in a derived `Total` row, recomputed from the rows
    above by whoever last edited a cell — **except its `Corrected` cell, which stays `—`**, a correction
    backlog having no meaningful aggregate. A replan updates the projection in the same run, and
    preserves every graded figure already there (invariant 14 applies to the projection too).

> **These fifteen are numbered identically to Section D of
> `notes/prompts/practice/sql/_internal/_sql-plan-standard.md`**, because `sql-plan-audit` splits the work
> between four specialists *by invariant number*. Until 2026-07-22 the two lists used different
> numbering, which handed two of them each other's checks. Renumber one side and you must renumber the
> other — and **adding one counts as renumbering**: 12–15 arrived in the standard with the 2026-08-03
> doctrine/route split and were missing here until 2026-08-04, so the audit was dispatching specialist 3
> with invariants 13 and 15 and specialist 4 with 12 against a list that stopped at 11.

---

## Section 11 — Closure

The SQL track is finished only when every box is ticked. A failed condition means going back, not
shipping.

```
- [x] practice/sql/ is current on the working branch (G0) — 2026-07-22
- [x] coverage-prompt TOPIC=sql has run — notes/sql/coverage/{LEVEL}.md current (G2) — 2026-07-18
- [ ] Steps 0–13 all closed, each with its §4 ritual (G1) run by `sql-step-close`: scored condition met
- [ ] Every first-pass exercise the level's route §1 declares is answered and scored ≥ 80% (review
      batches are extra and uncounted) — 207 at junior
- [ ] Every revision point the route §1 declares fired on cadence — no stale open rows in MISTAKES.md
- [ ] Capstone timed condition met: 3 report queries from prose, under 10 minutes each
- [ ] progress-update has run — PROGRESS.md SQL section reflects all 14 steps (G3)
- [ ] roadmap-review has run — the SQL gate in ROADMAP.md is marked cleared (G4)
```

---

## Section Z — Out of scope

**Not planned here — three separate tracks, each with its own prompt and its own schedule:**

- **SQL notes** (`notes/sql/`) — run `/notes-audit` when Victor decides to. This plan never schedules a
  note, never lists a note file, and no step closes on one.
- **SQL interview Q&A** (`notes/interview-prep/`) — run `/interview-prep-audit` when Victor decides to,
  and only then. Since 2026-08-03 this track owns something this one used to keep: **retrieval from
  memory**; since 2026-08-04 it owns the questions themselves. **No step here carries a question**, not
  as a done condition and not as an inert seed: this plan generates exercises, gets them graded and
  tracks the route, and that is its whole subject. A question worth asking about SQL is derived from
  `notes/sql/coverage/{LEVEL}.md` by that track's own prompt, against its own standard — never drafted
  here on the side. No ritual reports a question as pending and no skill offers to run
  `/interview-prep-audit` off the back of a closed step.
- **SQL simulations** (`practice/simulations/`) — run the simulation prompts. Same rule, **con una
  excepción acotada: §8c**, que dice qué técnicas tienes desbloqueadas y por tanto qué puedes pedir.
  Eso es un hecho sobre tu conocimiento de SQL y esta es la única tabla que lo tiene. El formato del
  test, su banco y su tracker siguen siendo del otro track.

**Coverage sections deliberately excluded from the steps** are level-specific, so they are listed in
the level's own route, under its *Out of scope at this level* section — one entry per bullet, each with
its reason. Nothing is excluded doctrine-wide: a bullet skipped at junior may well be drilled at middle.
