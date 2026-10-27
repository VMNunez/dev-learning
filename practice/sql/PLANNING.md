# SQL Learning Plan

**Purpose:** the compass for the 12:30 SQL block, built to the same contract as a project
`PLANNING.md`. `notes/sql/coverage/{LEVEL}.md` says *what* must be learned; this plan — this doctrine plus
the level's route file (§1) — says *in what order*,
*which files it produces*, *how many exercises each one gets*, *which prompt runs at which moment*,
*what to update when a step closes*, and *when the whole track is finished*.

**Database:** PostgreSQL (local, pgAdmin). **Schema:** the canonical bookstore schema defined in
`notes/prompts/practice/sql/sql-exercises-prompt.md` — that prompt is the single source of truth for
it, so its tables are not listed here. Some topics are generated on a different model, or with no shared
setup block at all. Which topics those are, and why, is that same prompt's to say — the model follows the
`TOPIC`, and a route only chooses which `TOPIC` each of its files takes — so no list of them is kept here
or in a route: a copy is what a prompt change would leave false.

> ⚠️ **A file whose schema predates the canonical one is closed, not extended** — one file, one schema
> (invariant 11). Which files are in that state is the route §1's to say, and how a file sets up its
> schema is the exercise prompt's; neither is restated here.

### Local practice databases — the registry

Every PostgreSQL database created in pgAdmin **for practice** is recorded here, the day it is created,
so the next session knows what already exists instead of asking or guessing. **One database per
exercise file, named `practice_{level}_{file name with underscores}`** — `junior/02-execution-order-set-ops.sql`
→ `practice_junior_02_execution_order_set_ops`: the level because every route numbers its files from `01`,
the number to find it at a glance, and its own database because each file's SETUP seeds its own data, so
a shared one would silently answer an older file's queries against a newer file's rows (Victor,
2026-10-02). Underscores only, never a hyphen, and lowercase — `R1-repaso.sql` → `practice_junior_r1_repaso` (no quoting in SQL). Project databases (`timetrack`) belong to their
project and are not listed. **Writer:** the session that guides the creation — a new row in the same
session, committed directly with this file; a database dropped later keeps its row with `dropped
YYYY-MM-DD`. When a new exercise file needs a database that is not here, the session guides its creation
in pgAdmin step by step before the SETUP is run, then adds the row.

| Database | Schema | Files that run in it | Created |
|---|---|---|---|
| `practice_basics_v1` | v1 (legacy, `01-basics.sql`'s own) | `junior/01-basics.sql` only — the one name outside the convention, kept because its SETUP cannot rebuild it on an empty database, so never drop or rename it | before 2026-09-30 (was `learning`, renamed 2026-09-30) |
| `practice_junior_02_execution_order_set_ops` | canonical bookstore | `junior/02-execution-order-set-ops.sql` | 2026-10-02 |

**Target:** pass the SQL half of a technical screening at NTT Data / Capgemini / Indra, and write the
report queries TimeTrack needs without looking anything up.

---

## Section 0 — Session quick reference

**Read this first every SQL block.** Five of the seven rows below — *current level*, *current step*,
*done condition*, *next revision point* and *last updated* — are written by the closing ritual
(`_sql-exercises-review.md` step 4d, repaired by `sql-step-close`), never by hand at the start of a
session; `sql-plan-audit` reconciles them against the route (invariants 5 and 6) and corrects them, and
`sql-block-open` reports a stale §0 without repairing it. **`Current branch` and `Blocked on` have no
dedicated writer in the machinery** (standard A1): their corrections by a session or an audit are
manual reconciliation, not an automatic refresh on every close. **No row states a file's disk state** —
whether it exists, how many statements it holds, how many are answered: those are read off the file
(invariant 3), and neither generating a batch nor answering one writes §0.

| | |
|---|---|
| **Current level** | junior — route file `practice/sql/junior/PLANNING-junior.md` (the six rows below refer to it) |
| **Current step** | Step 1 — JOINs (0/22 first-pass scored, en `03-joins.sql`, dos runs de 11) |
| **Current branch** | the active feature branch (study materials follow it — see §7) |
| **Done condition** | `Review: sql-grade scores ≥ 80% on 03-joins.sql` |
| **Next revision point** | R1 (route §1) — fires when Step 1 closes, i.e. when its `Review:` done condition passes on `03-joins.sql` |
| **Blocked on** | nothing — qué Moment toca se lee del archivo (`sql-block-open`), no de esta fila |
| **Last updated** | 2026-10-27 |

---

## Section 1 — How this plan relates to the hub files

**The two inputs, and this plan never invents beyond them:**

| File | Role here |
|------|-----------|
| `notes/sql/coverage/{LEVEL}.md` | **What** must be learned at the level being drilled. This plan never restates it — it points at sections, and every step claims bullets of it. |
| `ROADMAP.md` (repo root) | **Why, and by when.** Read at two sections only: `## 12:30–13:30 block — SQL then practice` — the objective the ordering serves (a junior Angular + Java role in Spain, technical screening first, and the Stage-1 → Stage-2 switch gate) — and `## Daily schedule (fixed from June 2)`, the block the pace has to fit. It is what makes a step-ordering decision justifiable rather than a preference: an order that puts a rarely-screened topic in front of one that opens every technical test is wrong *against this file*, and that is the check the audit runs. Nothing outside those two sections can falsify a route-ordering decision. |

**Two more files it writes to or mirrors, which are not inputs:**

| File | Role here |
|------|-----------|
| `PROGRESS.md` → `## Practice completed` → `### Exercise route` | **How much** of the route is done — never a concept list, which lives in the coverage file. It is the route's **projection** (invariant 15): the level's route §3 is the record of which steps are closed, and the two must agree (invariant 3) — a disagreement is drift for its owner to repair, never settled by treating one as authoritative. |
| **This plan** (this doctrine + the level's route) | **In what order**, with which files, how many exercises, which prompt, and what "done" means. |

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

Every step runs Moments 1–5, with Moment 2b for revision or reinforcement; Moment 6 closes the block.
Generation prompts run in a separate conversation. Grading and closure use the in-session skills
named below. Each moment states its trigger and the prompt config or skill to invoke.

> **The pasted config uses only the keys of `sql-exercises-prompt.md`'s own `## Configuration` block —
> and that prompt says in as many words: do not add keys.** Read the complete key set there rather
> than copying it here (invariant 9). `MODE` and `TOPIC` are always required;
> `LEVEL`, `COUNT` and `FILE` are optional overrides (`LEVEL` blank means `junior`, and it is what selects
> the route file — pin it on any non-junior run), **with the one exception the prompt states itself:
> `MODE = reinforce` requires `FILE`**. **`FOCUS` and `REVIEW` are not pasted keys**: the prompt derives both.
> On a first-pass run `FOCUS` is the `**Focus:**` line of the route §2 step whose `TOPIC` matches — which is
> why every step of the route states its focus: it is read from the plan, not typed into the chat — and
> Moment 2b says where each of the two comes from on a review run. Pasting `FOCUS = …` is a dead instruction.

### Moment 1 — Read the concept list

**Trigger:** the very start of the step, before writing a single query.
**Prompt:** none. Open `notes/sql/coverage/{LEVEL}.md` and read the sections listed for that step.

---

### Moment 2 — Generate the exercises  ▶ RUN A PROMPT

**Trigger:** after Moment 1, when the selected run's exercises have not yet been written.
**Prompt:** `notes/prompts/practice/sql/sql-exercises-prompt.md` — paste into a **new chat**.

```
MODE  = practice
LEVEL = <the level of the selected route>
TOPIC = <the step's TOPIC, given per step in the route §2>
COUNT = <blank — the prompt reads the step's own COUNT from the route §2; type a number only to override it>
```

The step's focus travels with the step, not with the paste: the prompt looks up the route §2 entry for that
`TOPIC` and reads its **`**Focus:**`** line from there.

The prompt resolves the file from route §1 and reads the step's `**Reinforces:**` line. Exercise
content, difficulty and file format belong to `sql-exercises-prompt.md`; no extra rule is pasted here.

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

**Prompt:** the same `sql-exercises-prompt.md` — `MODE = practice` at a revision point, `MODE = reinforce`
for a voluntary revisit. Lo que pegas depende de cuál de los dos triggers estés atendiendo:

**Punto de repaso de §8b (obligatorio)** — `TOPIC` es el punto, no un tema:

```
MODE  = practice
LEVEL = <the level of the selected route>
TOPIC = <the revision point declared in that route's §1>
```

El prompt reconoce los puntos de repaso de la ruta, abre `practice/sql/MISTAKES.md`, coge las filas
abiertas cuyo `Step` cae en el span del punto, las ordena por `Times` descendente y **eso** es el foco.
Escribe en `practice/sql/{LEVEL}/R{n}-repaso.sql`, su propio archivo. Si el span no tiene filas abiertas
el punto se dispara igual y el foco pasa primero a sus filas de `## Fricción`, y solo sin ellas a los
conceptos del span menos ejercitados (§8b).

**Revisita voluntaria de un tema** — `TOPIC` es el tema, `FILE` el archivo que quieres repasar, y el
modo dedicado es `reinforce`. `FILE` es **obligatorio** en este modo — nada en la ruta lo elige, y sin él
el prompt se para con un error en vez de derivar uno:

```
MODE  = reinforce
LEVEL = <the level of the selected route>
TOPIC = <the topic of the file being revisited>
FILE  = <the file being revisited — required in this mode>
```

`reinforce` corre la misma rama que `practice` pero con `{REVIEW} = yes` desde el principio. Pegar
`MODE = practice` sobre un archivo que ya tiene escrito su target first-pass también acaba en un lote
de repaso — el guard "target already met" del prompt te lo ofrece — pero por la puerta larga.

The prompt owns the content, difficulty and file format of these batches. The plan records only
their topic, count and focus; they remain outside the step's first-pass target.

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
the route §3 — a step's target is its first-pass exercises alone, and what closes it is its done
condition (§3). Review is maintenance on ground already taken.

How a file distinguishes a first-pass batch from a review batch is defined by
`sql-exercises-prompt.md`; this plan does not duplicate that format.

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

- **Records its verdict on the header line of every exercise it grades**, so the file itself is the
  record of what has been graded. Which marker records which verdict, and when an already-marked
  exercise is graded again or left alone, are owned by
  `notes/prompts/practice/sql/_internal/_sql-exercises-review.md` — Step 2b for the markers, Step 1 for
  the re-grade and skip policy — and are not restated here.
- **Updates `PROGRESS.md`** — the level roll-up, the file's row, and the recomputed `Total` rows.
- **Updates the level's route file** — the file's §1 row, the step's §3 row and its §2 coverage
  checkboxes — **and this doctrine's §0** when the step closes (step 4d of the grading prompt, which
  `sql-step-close` then verifies and repairs in Moment 5; §0 is a section of *this* file, not of the
  route, and `sql-grade` commits it).
- **Logs every ⚠️ and ❌ in `practice/sql/MISTAKES.md`** — its `## Open` and `## Closed` tables, which
  that same prompt's Step 5 owns — and closes the rows this run redeemed.

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

**Trigger:** Victor ends the block, in whatever state the file is. **This is not Moment 5**: a step closes
once per step of the route, a block ends every day, and almost always mid-file.
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
the other tracks are outside this plan (§Z).

---

## Section 4 — Step-complete ritual

**The ritual is a skill, and the skill is the only way it is run.** Four of them cover the track, and
they hand off in one direction — you never invoke `sql-step-close` yourself:

| Skill | Fires when | What it owns |
|---|---|---|
| `sql-block-open` | you start the 12:30 block | read-only orientation: current step, unanswered exercises, open `MISTAKES.md` rows, which Moment is next. Writes nothing. |
| `sql-grade` | you finished answering a file | grades it; under 80% → back to fixing; hands off to `sql-step-close` only when this was the step's last file **and its own done condition passes** |
| `sql-step-close` | handed the step by `sql-grade` | the closing ritual below, end to end, without asking anything |
| `sql-block-close` | you end the block, whatever state it is in | the `## Fricción` rows of `MISTAKES.md` and where tomorrow starts. Writes no counter and closes no step. |

**Two of these close different things, and conflating them is the mistake to avoid.** A *step* closes
when its done condition (§3) passes — rarely, once per step of the route, and never merely because its
exercises are scored (invariant 3). A *block* ends every single day,
almost always mid-file. `sql-block-close` exists because everything between those two events used to be
lost: the grader records only what came back ⚠️/❌, so a concept that cost twenty minutes and then came
out right scored ✅ and vanished. That concept is the one that stalls an interview, and §8b's revision
points now read it (`## Fricción`) when a span has no graded failures left.

`sql-grade` does not re-implement grading: it runs
`notes/prompts/practice/sql/_internal/_sql-exercises-review.md` **in a cold subagent**, which is where
that prompt's Steps 4b–4e and 5 — the automated writes listed below — actually happen (its 4a was
deleted on 2026-08-03). That isolation is not decoration — the prompt was written for a fresh
chat, and a skill runs inside the session where the concept may have just been explained to you. A
grader that remembers teaching you the answer is not a grader.

**What a close touches, and who writes it:**

The grading run also updates **`practice/sql/MISTAKES.md`** *(automated, by the grading subagent)* —
its `## Open` and `## Closed` sections are owned by `_sql-exercises-review.md` Step 5. The separate
block close owns only `## Fricción`; neither row format is defined here.

1. **`PROGRESS.md`** *(automated, by the grading subagent)* — `## Practice completed` → `### Exercise
   route`: the level's roll-up row, the file's row in the level table, and the recomputed `Total` rows of
   both. **No concept list.** It was deleted on 2026-08-03 because it was an evidence-free second copy of
   the coverage file; the *what* lives on the coverage bullets, the *how many* lives here. Do not
   re-create it.
2. **The level's route file** `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` *(automated)* — the file's row in
   §1, the step's row in §3, **the readiness status line under that same table** (written by
   `sql-step-close`) and its `**Coverage bullets:**` checkboxes in §2 — plus **this doctrine's §0**,
   refreshed when the step closes (step 4d of the grading prompt; `sql-step-close` verifies and repairs
   what it left, and `sql-grade` commits the file). (The junior route was migrated out of this file on
   2026-08-03; §5, §6 and §8 here are pointers now, and every one of those edits lands in the level's
   route file.)
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

5. **The commits** — split by authorship (§7), never one commit. **The exercise file** *(manual)* is
   Victor's: `sql-grade` hands him its two commands and he runs them. **Everything the four items above
   moved** *(automated)* was written by the ritual, so the skill that wrote it — or dispatched the write —
   commits it itself, one atomic commit per concern: `sql-grade` the grading run's files, `sql-step-close`
   its own, the close under `docs: close SQL step N — <topic>`.

**Then, once those commits are in, run G1b (§9) *(manual)*: `sql-plan-audit`, `SCOPE = full`, `LEVEL = {level}`.** It is the only thing
that checks this file, and the moment right after a step closes is when it has just moved the most —
§0 and the route's §1 and §3 have all just been rewritten. It comes after the commits, not
before, so it audits the numbers the ritual actually wrote.

---

## Section 5 — Every file this plan produces

**Moved 2026-08-03 → `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` §1** (junior's was the route migrated
that day). The file inventory is level-specific,
so it lives in the level's own route file, one per level. This doctrine keeps only what is true whichever
level is being drilled: the three counts (*written* / *answered* / *scored*) and the first-pass target
rule are defined in invariant 3 (§10), the "a revision batch is extra" rule in §8b, and all three are
applied in the route.

---

## Section 6 — The steps

**Moved 2026-08-03 → `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` §2** (junior's was the route migrated
that day). The step route is level-specific.
What every step must carry for the loop to run — the `**Moment 2 config:**` and `**Focus:**` lines the
exercise prompt greps for, the done-condition formats it must use — is doctrine and stays here (§2, §3,
invariant 9);
which steps exist, in what order and why, belongs to the level.

---

## Section 7 — Branch and commit rules

Study materials follow the **active branch** — no direct commits to `main` (the shared session rules,
`notes/prompts/_internal/_session-rules.md`, changed 2026-07-14). There is no dedicated SQL branch: `practice/sql/` and `PROGRESS.md` commit
on whatever feature branch the morning project block is on.

- **Before any SQL session, check the branch has the latest `practice/sql/`.** A feature branch cut
  before the last SQL commit still carries the old exercise files, and appending to them silently
  drops the newer exercises when it merges. This has already happened once: on 2026-07-22
  `fix/backend-backlog` carried a 20-exercise `01-basics.sql` while `main` had 40, plus the whole of
  the old `02-joins.sql` — resolved by merging `main` into the branch (G0).
  Check with `git log --oneline main -1 -- practice/sql/` against your branch before starting.
- Exercise files are **Victor's authorship** → no skill or prompt ever stages or commits them; the skill
  that touched one (`sql-grade`, `sql-block-close`) prints the two commands and he runs them.
- Everything the track's prompts and skills write — this doctrine, the route files, `MISTAKES.md`,
  `PROGRESS.md`, the coverage drill markers — is **not** his to commit: the skill or prompt that wrote
  it, or dispatched the write, commits it itself (§4, item 5).
- Commits stay atomic: one commit per concern, and a `.sql` file is never staged alongside a tracking
  file.

---

## Section 8 — Progress tracking

**Moved 2026-08-03 → `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` §3** (junior's was the route migrated
that day). Status is per level, and **only grading moves it**: a step's row closes when its done
condition (§3) passes — never on the written or the answered count, and not on the *scored* count alone
(invariant 3). Each level's route §3 is the record of which steps are closed; `PROGRESS.md` →
`## Practice completed` → `### Exercise route` is the route's projection (invariant 15), and the two
must agree (invariant 3).

---

## Section 8b — Revision points

**Revision is scheduled, not felt.** A concept you have forgotten does not feel rusty — it feels
learned, which is exactly why "revise when it feels shaky" cannot be the trigger. This section fixes
both halves of that: *when* revision happens, and *what* it drills.

### The cadence — one revision point every 3 exercise files

Fixed, never left to judgement. The route declares at least one revision point per three exercise
files. Each point fires when its route §1 trigger passes — the named step's done condition, never a
scored count alone — and re-drills its declared span. Every point is decided up front.

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
la única cosa que nadie más sabe: **bajo qué condición un test SQL es siquiera empezable**. Un test que
exige una técnica de un step sin cerrar no es difícil, es imposible, y descubrirlo a mitad del
cronómetro no enseña nada. Esto se apunta aquí porque es un hecho sobre tu conocimiento de SQL, no
sobre los tests: por eso la §Z le concede a esta sección su única excepción.

**La regla:** un test SQL solo puede exigir técnicas de steps **cerrados** (`closed ✅` en la §3 de la
ruta). Ninguna técnica de un step abierto queda disponible por haber generado o respondido sus ejercicios.

**Qué técnica desbloquea cada step, y cuáles están cerradas hoy, viven en la §3 de la ruta del nivel —
nunca aquí.** Esa tabla es la fuente única: lleva una columna de técnicas por fila, de modo que
reordenar los steps mueve la técnica con su step y ningún archivo neutro de nivel queda mintiendo. Esta
sección posee solo la regla, y por tanto vale para los tres niveles sin tocarse.

**Un consumidor de otro track lee la §3 de la ruta del nivel seleccionado**, no esta sección: con tres
rutas vivas, cada nivel responde por sí mismo por su readiness. Aquí solo comprueba la regla.

La configuración concreta y el formato del test los pone `simulation-generator-prompt.md`; esta sección
solo dice contra qué steps se puede tirar.

**Quién la mantiene:** la columna de técnicas la escribe `sql-plan-prompt` al autorar el step, y
`sql-plan-audit` la celda de un step que añade en su propio run. Es también `sql-plan-prompt` quien decide
el **gate del primer test** de la línea de estado, y quien escribe esa línea en una ruta nueva. El conjunto
cerrado de la línea lo reescribe `sql-step-close` cuando un step cierra, arrastrando el gate tal cual:
nunca lo elige, lo mueve ni lo suelta. `sql-plan-audit` audita columna y línea bajo el invariante 16:
corrige una línea de estado que contradiga su propia tabla, restaura desde el historial de la ruta un gate
que la línea haya perdido y retira cualquier afirmación sobre un spec concreto escrita junto a ella. El
step del gate no lo elige nadie más: si falta y el historial no lo tiene, se le debe un run al planner
(§9, G1c).

---

## Section 9 — Quality gates: which prompt to run when

A **gate** is a checkpoint where a quality prompt runs. Same logic as the project standard: run each
prompt at the point where the file it *reads* has just become accurate, and before the prompt that
*consumes* its output.

| Gate | Trigger | Prompt + config | Why exactly here |
|------|---------|-----------------|------------------|
| **G0 — Branch sync** ✅ 2026-07-22 | Before the first SQL session on any branch | *(no prompt — `git merge main` into the branch)* | Appending to a stale file loses exercises at merge time. Done once on `fix/backend-backlog`; re-check on every future branch. |
| **G1 — Step ritual** | The step's done condition passes | *(automatic — `sql-grade` hands off to `sql-step-close`, §4)* | The SQL closing ritual updates and checks the tracking files before later gates consume them. |
| **G1b — Plan al día** | Right after G1, when a step closes · when `notes/sql/coverage/{LEVEL}.md` grows (i.e. after G2) · when `sql-exercises-prompt.md` changes | `notes/prompts/practice/sql/sql-plan-audit.md` · `LEVEL = {level}`, `SCOPE = full` (`SCOPE = extend` when the only trigger was new coverage sections) | This file is the one that rots fastest — every closed step, every new coverage section and every prompt change leaves it slightly less true, and nothing else audits it. It runs *after* G1 so it reads the status G1 has just made accurate, and before the next step starts building on a stale plan. Safe to run repeatedly: a clean plan comes back unchanged. |
| **G1c — Replan owed** | When the audit's closing line reports `/sql-plan {LEVEL} owed`. What fires that line is listed in `sql-plan-audit.md` Phase 5 — four outcomes today: the route grew or was re-pointed · its coverage fingerprint is stale (invariant 12) · its `PROGRESS.md` projection is broken or stale (invariant 15) · its readiness status line carries no first-test gate and the route's history holds none to restore (invariant 16) | `notes/prompts/practice/sql/sql-plan-prompt.md` · `LEVEL = {level}`, `MODE = update` | Only the planner refreshes the fingerprint, re-syncs the route's projection in `PROGRESS.md` and decides which step the first-test gate names — the audit may do none of the three. A stale fingerprint requires a replan even when the audit added no step; the audit preserves that signal. |
| **G2 — Coverage refresh** ✅ 2026-07-18 | Once, before the selected route's first step; again if a real job posting reveals a gap | `notes/prompts/knowledge/coverage/coverage-prompt.md` · `TOPIC = sql`, `LEVEL = {level}`, `MODE = update` (logged in `notes/prompts/_internal/_run-tracker.md`) | Coverage is the root of this plan. Refresh it *before* building on it, not after. |
| **G3 — PROGRESS accurate** | After the selected route's final step closes | `notes/prompts/strategy/tracking/progress-update-prompt.md` · `MODE = active` (its dedicated SQL subagent counts the exercise files in committed history) | Measures the whole `Exercise route` section in one pass, catching anything the per-step ritual missed. **It reports that drift, it does not repair it** — auditor since 2026-08-05: a mismatch is fixed by the section's owner (`sql-exercises MODE = review` §4b, or `sql-step-close` for a `Total` row that no longer adds up), and the gate closes on a **clean drift report**, not on the run happening. Must precede G4. |
| **G4 — Roadmap resync** | After G3 | `notes/prompts/strategy/tracking/roadmap-review-prompt.md` | The roadmap's SQL gate can only be marked cleared once `PROGRESS.md` says the track is finished. |

**The mandatory revision checkpoints are not gates here — they are the revision points declared in the
level's route §1**, on the §8b cadence, and that table is the only place they are scheduled from.

**Prerequisite chain (hard — a gate run out of order gives a wrong answer, not just a late one):**
`G0 → G2 → steps (G1 then G1b each, plus G1c when a replan is owed, with the route's revision
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
3. **Exercise counts** — *written* means the statement exists; *answered* means a query is under it;
   *scored* means a review run graded it, at any verdict, counted once. **Scored is not accepted:**
   the ≥ 80% review score is a done-condition threshold, never an exercise-count filter. Only grading
   moves a status; reaching the scored target alone does not close a step. A re-grade can satisfy the
   done condition without increasing a count, and a closed step stays closed (invariant 14).
   A plan reporting answered work as scored claims progress that never happened. **Written and
   answered — and whether a file exists at all — are facts about the file on disk**, and every reader
   that decides from one counts the file: generating a batch moves *written* and Victor moves
   *answered* in pgAdmin, and neither act writes the route or this doctrine. So the route's `Written`
   and `Answered` cells, and any route §1 cell or sentence stating whether a file exists, are a
   **snapshot**, refreshed from disk by `sql-plan-prompt` (its Guard 2 inventory) and `sql-plan-audit`
   (its Phase 1 snapshot); a snapshot behind disk between those runs is not drift, and no reader
   reports it as a disagreement or decides from it. *Scored* is not a snapshot: grading writes it.
   Every step in route §2 states a count; per-step counts for a shared file sum to its first-pass
   target in route §1. Route §3 totals match §1, the exercise files on disk and `PROGRESS.md` →
   `## Practice completed` → `### Exercise route` (that level's roll-up row and its own detail table —
   never another level's). Review batches are extra (Moment 2b), so a written count above the
   first-pass target is expected.
4. **Step sizing** — no generation run asks for more than 12 exercises and no step targets more than
   22; anything above 12 is split into runs (a file's total may be higher when several steps
   write into it). Any preserved legacy exception is documented in its level's route §2 and never
   used as a precedent for a new step.
5. **§0 vs the route §3** — the Current step in §0 is the first step row in the current level's route §3 that
   is not ✅, and §0's *Current level* row names a route file that exists. Every row of the route §3
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
   (the key set is **read from `sql-exercises-prompt.md`'s own `## Configuration` block**, never from a
   copy kept here — a copy is what went stale when `LEVEL` was added on 2026-08-02 and no sweep reached
   this line; `FOCUS` and `REVIEW` are not keys at all: the prompt derives both, as §2 states). A plan pointing at a moved prompt or an invented key rots silently: the
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

    Only exercise steps are added this way; the scope fence is §Z.

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
    not two (how a row records which level it came from is its writer's to define —
    `_sql-exercises-review.md` Step 5 — not this plan's).

14. **A closed step is never reopened and never renumbered** — new coverage scope landing on a closed
    step goes to its `**Pending additions:**` field, and a reinforcement run drills it. Reopening a step
    whose exercises were answered and graded throws away the only record that they were.

15. **The route has a projection in `PROGRESS.md`, and it is complete** — `## Practice completed` →
    `### Exercise route` carries one roll-up row per level plus one detail table per level, and that
    table holds **a row for every file the route declares**, including files not written yet, seeded by
    `sql-plan-prompt` with `Corrected = —`, `First-pass / target = 0/{route §1 target}`,
    `Status = not started` — the word a status holds until grading moves it, true whether or not the
    file has been generated yet; a status never says whether a file exists (invariant 3). Pending files are never collapsed into a "12 files remaining" row: seeing
    what is left is the whole point. Both tables end in a derived `Total` row, recomputed from the rows
    above by whoever last edited a cell — **except its `Corrected` cell, which stays `—`**, a correction
    backlog having no meaningful aggregate. A replan updates the projection in the same run, and
    preserves every graded figure already there (invariant 14 applies to the projection too).

16. **Readiness lives in the route, and it is complete.** Toda fila no-`R{n}` de la §3 de la ruta lleva su
    celda de técnica — `—` solo donde el step no desbloquea nada que un test pueda exigir, nunca vacía — y
    la línea de estado bajo la tabla lleva dos cosas: **exactamente** el conjunto de steps `closed ✅` de
    esa misma tabla, y el **gate del primer test** — una frase que nombra el step de esa tabla cuyo cierre
    hace posible un primer test realista. Qué step nombra lo decide `sql-plan-prompt` con el orden de la
    ruta; quien reescribe el conjunto cerrado lo arrastra sin elegirlo, moverlo ni soltarlo, y una línea
    que lo ha perdido se repara restaurando la frase desde el historial de la ruta, nunca eligiendo un
    step. El bloque de readiness habla en técnicas y steps y no nombra ningún spec de un banco de
    simulaciones. La §8c de esta doctrina tiene la regla y ningún mapeo propio.

> **These sixteen are numbered identically to Section D of
> `notes/prompts/practice/sql/_internal/_sql-plan-standard.md`**, because `sql-plan-audit` splits the work
> between four specialists *by invariant number*. Until 2026-07-22 the two lists used different
> numbering, which handed two of them each other's checks. Renumber one side and you must renumber the
> other — and **adding one counts as renumbering**: 12–15 arrived in the standard with the 2026-08-03
> doctrine/route split and were missing here until 2026-08-04, so the audit was dispatching specialist 3
> with invariants 13 and 15 and specialist 4 with 12 against a list that stopped at 11.

---

## Section 11 — Closure

Apply this checklist to each level's route. That level is finished only when every condition holds;
completion of one level does not claim completion of another. A failed condition keeps it open.
The dated checks below preserve the recorded branch-sync and coverage runs; verify their applicability
again for the selected route and current branch.

```
- [x] practice/sql/ is current on the working branch (G0) — 2026-07-22
- [x] coverage-prompt TOPIC=sql has run — notes/sql/coverage/{LEVEL}.md current (G2) — 2026-07-18
- [ ] Every step in the selected route §3 is closed, with its own §2 done condition met and its §4 ritual run (G1)
- [ ] Every first-pass exercise declared by that route §1 has been graded, at any verdict and counted once;
      each Review done condition meets its review-score threshold (≥ 80%), never a per-exercise filter
- [ ] Every revision point the route §1 declares fired on cadence — no stale open rows in MISTAKES.md
- [ ] The selected route's capstone Timed done condition is met exactly as written in its §2
- [ ] progress-update has run **and its SQL drift report came back empty** — the `Exercise route` tables
      reflect every step of the selected route, and anything the report named was repaired by its owner (G3)
- [ ] roadmap-review has run — the SQL gate in ROADMAP.md is marked cleared (G4)
```

---

## Section Z — Out of scope

**Not planned here — three separate tracks, each with its own prompt and its own schedule:**

- **SQL notes** — `notes/prompts/knowledge/notes/notes-audit.md`, run separately when Victor decides.
- **SQL interview Q&A** — `notes/prompts/knowledge/interview-prep/interview-prep-audit.md`, run separately when Victor decides.
- **SQL simulations** — `notes/prompts/practice/simulations/simulation-generator-prompt.md` and `simulation-review-prompt.md`, run separately; §8c owns only the readiness rule.

**Coverage sections deliberately excluded from the steps** are level-specific, so they are listed in
the level's own route, under its *Out of scope at this level* section — one entry per bullet, each with
its reason. Nothing is excluded doctrine-wide: a bullet skipped at junior may well be drilled at middle.
