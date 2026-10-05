---
name: practice-session
description: >
  Open, generate and grade a batch of short practice exercises for the practical topics beyond SQL,
  WHENEVER Victor asks to practise in his own words ("vamos a hacer ejercicios de repaso de práctica",
  "quiero practicar", "hazme ejercicios de streams", "ejercicios de java") or says a batch is ready
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

Take exactly one of the two routes, from what he said.

---

## Route 1 — he wants to practise

### 1a — Resolve what

- **He named something** — a topic, a block ("el bloque de colecciones"), or a concept ("`Optional`").
  That is the batch (standard §C). No proposal, no reason asked for, no alternative offered. `{LEVEL}` is
  what he said, else `junior`.
- **He named nothing** — choose under standard §F, reading the files it lists, and open the reply with
  **one line**: what, and why. Then carry straight on to 1b; the proposal is not a question. If it lands
  on SQL, say `vamos con el SQL` is the door, generate nothing and end at the report.

**The topic must have an environment section** in standard §H. If it has none, say so in one line, name
the topics that do, and stop — on the proposal path, propose the next candidate that has one instead.

### 1b — The route is current, or is re-derived

Open `practice/exercises/INDEX.md` and the topic's `notes/{topic}/coverage/notes-plan-{LEVEL}.md`. If the
index has no table for this route, or its fingerprint, entry list or any entry's bullet count no longer
matches the plan, derive
the table as standard §B states and say so in one line. Never touch `practice/exercises/ATTEMPTS.md`
here. A stale or missing notes plan is reported in one line with `/notes-plan {topic} {level}`; a
requested batch is still served, as `extra` where no block can be resolved.

### 1c — Compose the batch

From `ATTEMPTS.md` and the index, under standard §C: size from the time he stated (30 minutes when he
stated none), one checkable objective, the composition split, the difficulty adaptation read off the
`Why` column, and the no-repeat rule. If a concept is owing a fix (standard §E), name it in one line —
"tienes pendiente corregir `X` del lote `Y`" — and continue; it is never a gate.

### 1d — Write the batch

One new folder, `practice/exercises/{topic}/{level}/{YYYY-MM-DD}-{slug}/` (a second batch the same day
takes a different slug): the `README.md` in the exact shape standard §C gives, and one exercise file per
row in the shape the topic's §H section gives. Statements are written in English, like all code and
technical files. Nothing else is written, and no earlier batch is named in it.

### 1e — Hand over

Print the objective, the table, the block's Spanish note path with its live `Status:`, and how the
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
`{ROUTE}`, `{BATCH}`, `{MODE}`, `{HELP}`. **Do not summarise the session, the exercises, or what he was
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

Check the grader's returned file list against `git status`: it is `practice/exercises/ATTEMPTS.md` and
`PROGRESS.md`, or nothing. Anything else modified is a deviation of this run. Each line of its
`desvíos de la rama:` is one too, logged under the shared deviation close-out with `Scope: shared`.

---

## Commits

Per the shared session rules, on the **active branch**, `git status` right before each `git add` and
each `git commit`, so no file of a batch folder is staged alongside a system file.

**You commit yourself** (authorized 2026-10-05 — system-written, never Victor's):

- `practice/exercises/INDEX.md`, when 1b derived a table — `docs(practice): derive the {topic} {level} route`
- `practice/exercises/ATTEMPTS.md` + `PROGRESS.md`, after a grader run that wrote —
  `docs(practice): grade {batch} — n/m`, or `docs(practice): verify the fixes of {batch} — n/m` on a
  `verify` run

**Victor commits himself** — the whole batch folder, statements and answers together. Hand him the two
blocks (`git add`, then `git commit`), one command per block, **after a `grade` run and again after a
`verify` run that dated a fix** (his corrected answers are a new change to the same files), never at
generation: `docs(practice): {topic} {slug} — n/m`, then `docs(practice): fix {topic} {slug}`. No
`Co-Authored-By`.

---

## Report back

Route 1:

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
