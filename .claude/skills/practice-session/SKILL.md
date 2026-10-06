---
name: practice-session
description: >
  Plan, open, generate and grade a batch of short practice exercises for the practical topics beyond SQL,
  WHENEVER Victor asks to practise in his own words ("vamos a hacer ejercicios de repaso de práctica",
  "quiero practicar", "hazme ejercicios de streams", "ejercicios de java"), asks for reinforcement on something he is unsure of ("refuerzo de Optional", "no me siento seguro con equals y hashCode"), or asks to create/update a topic-level exercise plan ("planifica los ejercicios de java junior"), or says a batch is ready
  ("listo, corrige los ejercicios", "ya he hecho el lote", "he corregido los fallos"). He never types a
  command: naming no topic makes it propose what to practise and why, from his goal and his history;
  naming a topic, a block or a concept generates exactly that, with no proposal and no counter-suggestion.
  When a batch is answered it grades nothing itself — it dispatches one COLD grader, because this skill
  runs in the session where the concept may have just been explained to him — and the grader writes the
  per-attempt history and its PROGRESS.md recount. The failure mode this exists for is a concept read in
  a note and not written again for weeks, until the project step that needs it. Do NOT use it for SQL
  exercises (sql-block-open / sql-grade and /sql-exercises own that track — a proposal that lands on SQL
  hands off to them), for a timed simulation (simulation-block-open / simulation-grade), for interview
  questions (interview-prep-block-open), or to teach a concept — it serves exercises, not explanations.
---

# Short practice exercises — propose, generate, grade

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


**Read `notes/prompts/practice/exercises/_internal/_practice-standard.md` to EOF before anything else.**
It is the whole contract — the route, the batch, the history, the loop, the proposal order, the
`PROGRESS.md` projection and each topic's environment — and this file only says which of its sections
each step executes. Do not reconstruct a rule from the examples below.

**Ask nothing.** No "¿cuánto tiempo tienes?", no "¿qué tema prefieres?", no confirmation of a proposal.
Time, topic and help are taken from what Victor already said; where he said nothing the standard states
the default. **Never comment on what he chooses to practise or for how long.**

**Never write his answers and never run his code.** The exercise files are his from the moment they are
generated: the statement and the skeleton are written once, at generation, and never touched again.

Take the route matching his request. A planning-only request uses Route 0. A practice request uses
Route 1, which plans first if necessary. A grading request uses Route 2.

---

## Route 0 — he wants a persistent exercise plan

Resolve topic and level from his request, level defaulting to junior. Execute
`notes/prompts/practice/exercises/_internal/_practice-plan-prompt.md` completely. Its review gate,
validation, preservation and publication rules govern this path. Report the path, totals, exclusions
and review result; commit the accepted plan and INDEX. Do not generate an exercise batch.

---

## Route 1 — he wants to practise

### 1a — Resolve what

- **He named something** — a topic, a block ("el bloque de colecciones"), or a concept ("`Optional`").
  That is the batch (standard §C). No proposal, no reason asked for, no alternative offered. `{LEVEL}` is
  what he said, else `junior`.
- **He asked for reinforcement** — he is unsure of something and says so ("refuerzo de X", "no me
  siento seguro con X"). The batch is that concept or those concepts under standard §C's reinforcement
  entry: no proposal, no planned row spent. A thing too vague to resolve to a concept head is matched
  to the closest head(s) of the route and named in one line, never asked about.
  Reinforcement on SQL is the SQL track's own `reinforce` mode, which works on a file, not a concept:
  name `/sql-exercises` with `MODE = reinforce`, the `TOPIC` and the `FILE` of the
  `practice/sql/{LEVEL}/` file whose step in `PLANNING-{LEVEL}.md` covers that concept, and generate
  nothing here.
- **He named nothing** — choose under standard §F, reading the files it lists, and open the reply with
  **one line**: what, and why. Then carry straight on to 1b; the proposal is not a question. If it lands
  on SQL, say `vamos con el SQL` is the door, generate nothing and end at the report.

**The topic must have an environment section** in standard §H. If it has none, say so in one line, name
the topics that do, and stop — on the proposal path, propose the next candidate that has one instead.

### 1b — Require the persistent plan

Open `practice/exercises/{topic}/{level}/PLANNING-{level}.md`, its topic coverage, notes plan,
INDEX and ATTEMPTS. Validate the route under standard §B, including actual source digests, not just
the notes plan's stored fingerprint. On an absent/stale exercise plan execute Route 0's planner
and continue only after acceptance. On missing/stale sources, report the owner and stop planned
generation. A reinforcement request is not planned generation: it continues on the published plan's
heads, and the grader excludes any that turn out orphaned (§D). An explicitly requested off-route extra follows §C and does not create a counted ID.
An unsupported topic/level never enters this route or silently falls back to Java junior.

### 1c — Compose the batch

From the persistent plan, `ATTEMPTS.md` and existing batch manifests, under standard §C: size from the time he stated (30 minutes when he
stated none), one checkable objective, the composition split, the difficulty adaptation read off the
`Why` column, and the no-repeat rule — or, on a reinforcement request, §C's reinforcement entry,
which replaces all of these but the size and the objective. If a concept is owing a fix (standard §E), name it in one line —
"tienes pendiente corregir `X` del lote `Y`" — and continue; it is never a gate.

### 1d — Write the batch

One new folder, `practice/exercises/{topic}/{level}/{YYYY-MM-DD}-{slug}/` (a second batch the same day
takes a different slug): the `README.md` in the exact shape standard §C gives, and one exercise file per
row in the shape the topic's §H section gives, using the planned basename, or §H's unplanned one. Copy its ID, task,
criteria and concept heads into the batch snapshot; unplanned rows (adaptive, extra, reinforce) use `Plan ID: —`. Statements are written in English, like all code and
technical files. Nothing else is written, and no earlier batch is named in it.

### 1e — Hand over

Print the plan path, passed/active planned tasks, the objective, the table, the block's Spanish note path with its live `Status:`, and how the
topic's §H says he runs a file. Then stop: he answers on his own, and says when it is ready.

---

## Route 2 — he says a batch is ready, or its fixes are

### 2a — Resolve the batch and the mode

`{BATCH}` is the folder he means; with none named, the most recent one holding an exercise with no row
in `ATTEMPTS.md`, or with a `pending` fix. Quote it back in one line. `{MODE}` is `verify` when he says
he corrected the failures and the batch has `pending` rows, else `grade`. `{HELP}` is what he said he
used, per exercise where he said it ("en el 3 miré la nota"), else `none declared`.

### 2b — Dispatch the cold grader

One cold subagent at the `deep` reasoning tier, as `notes/prompts/_internal/_agent-runtime-standard.md`
maps that tier — a grader with its own return contract, not that standard's `reviewer` role — handed
**only**: the instruction to read and execute
`notes/prompts/practice/exercises/_internal/_practice-review-prompt.md` in full, to EOF, as its whole task, and
`{ROUTE}`, `{BATCH}`, `{MODE}`, `{HELP}`. For the planner's `recount` call, pass the route and `MODE=recount`, with no batch or help input. **Do not summarise the session, the exercises, or what he was
taught.** Take a `git status` just before dispatching.

Never grade it yourself — not when the dispatch fails, not for a one-exercise batch. A dispatch that
cannot run is the durable-friction close-out's case, and the batch stays ungraded.

### 2c — Relay, and say what is next

Relay the grader's per-exercise feedback as it wrote it — result, what is wrong and why, never the
corrected code. Then exactly one line of next step:

| Return | Next |
|---|---|
| `PARTIAL — …` | name the unanswered exercises; nothing was written |
| any `⚠️` / `❌` | he rewrites those answers in the same files and says they are corrected — that run is `verify` |
| all `✅`, or `VERIFIED` with none left `pending` | nothing owed; a later batch will bring variants |
| `void` rows | say which exercise was defective and why; it is not his failure and the concept is still owed |
| `recount pending — replan` in the report | the grade is recorded and the `PROGRESS.md` row was not recounted; name the stale source and its owner (`/notes-plan {topic} {level}`, then asking to plan) — the planner triggers the recount |

Check the grader's returned file list against `git status`: a subset of
`practice/exercises/ATTEMPTS.md` and `PROGRESS.md` — both after a grade or verify on current sources,
the history alone when the recount was deferred, `PROGRESS.md` alone in `recount` — or nothing. Anything else modified is a deviation of this run. Each line of its
`desvíos de la rama:` is one too, logged under the shared deviation close-out with `Scope: shared`.

---

## Commits

Per the shared session rules, on the **active branch**, `git status` right before each `git add` and
each `git commit`, so no file of a batch folder is staged alongside a system file.

**You commit yourself** (authorized 2026-10-05, the exercise plans 2026-10-06 — system-written, never Victor's):

- `practice/exercises/{topic}/{level}/PLANNING-{level}.md` + `practice/exercises/INDEX.md`,
  after an accepted planning/reconciliation run — `docs(practice): plan the {topic} {level} exercises`
- `practice/exercises/ATTEMPTS.md` + `PROGRESS.md`, after a grader run that wrote —
  `docs(practice): grade {batch} — n/m`, or `docs(practice): verify the fixes of {batch} — n/m` on a
  `verify` run — or `PROGRESS.md` alone after a planner-triggered `recount` that changed the row:
  `docs(practice): recount {topic} {level}`

**Victor commits himself** — the whole batch folder, statements and answers together. Hand him the two
blocks (`git add`, then `git commit`), one command per block, **after a `grade` run and again after a
`verify` run that dated a fix** (his corrected answers are a new change to the same files), never at
generation: `docs(practice): {topic} {slug} — n/m`, then `docs(practice): fix {topic} {slug}`. No
`Co-Authored-By`.

---

## Report back

Route 0: plan path, counts, exclusions, reconciliation delta, validation and cold-review verdict.

Route 1 includes the plan path and `Plan: passed/active tasks` alongside:

```
Práctica: java junior · bloque 10 — Collections, hashing, and ordering · 30 min · 5 ejercicios
Por qué: es el primer bloque sin primer pase cuyos prerrequisitos ya tienen intentos
Objetivo: elegir entre `List`, `Set` y `Map` y recorrerlos sin abrir la nota
Lote: practice/exercises/java/junior/2026-10-06-collections/
Nota: notes/java/junior/es/10-colecciones.md (pending)
```

(`Por qué:` only on the proposal path.) Then the batch table.

Route 2:

| Target | Result |
|---|---|
| Lote | `practice/exercises/java/junior/2026-10-06-collections/` — modo `grade` |
| Resultado | 4/5 ✅ · 1 ❌ (`HashMap` iteration order, por `concept`) |
| Histórico | `ATT-0012`–`ATT-0016` |
| PROGRESS.md | java junior: bloques 2/17 → 2/17 · conceptos 14/125 → 18/125 · consolidados 3 → 3 · pendientes de corregir 0 → 1 |
| Siguiente | corrige el 4 en su archivo y di que está corregido |
| Commits | míos: ATTEMPTS.md + PROGRESS.md · tuyos: la carpeta del lote (comandos abajo) |
