---
name: practice-session
description: >
  Plan, open, generate and grade a batch of short practice exercises for the practical topics beyond SQL,
  WHENEVER Victor asks to practise in his own words ("vamos a hacer ejercicios de repaso de práctica",
  "quiero practicar", "hazme ejercicios de streams", "ejercicios de java"), asks for reinforcement on something he is unsure of ("refuerzo de Optional", "no me siento seguro con equals y hashCode"), or asks to create/update a topic-level exercise plan ("planifica los ejercicios de java junior"), or says a batch is ready
  ("listo, corrige los ejercicios", "ya he hecho el lote", "he corregido los fallos"). He never types a
  command: naming no topic makes it propose what to practise and why, from the practice state — the open
  batch first, then a due simulation, then the next topic of his rotation;
  naming a topic, a block or a concept generates exactly that, with no proposal and no counter-suggestion.
  When a batch is answered it grades nothing itself — it dispatches one COLD grader, because this skill
  runs in the session where the concept may have just been explained to him — and the grader writes the
  per-attempt history and its PROGRESS.md recount. The failure mode this exists for is a concept read in
  a note and not written again for weeks, until the project step that needs it. Do NOT use it for SQL
  exercises (sql-block-open / sql-grade and /sql-exercises own that track — a request naming SQL hands
  off to them), for a timed simulation (simulation-block-open / simulation-grade), for interview
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

**Never write his answers and never run his code.** The exercise files are his from the moment the
generated batch is committed: the statement and the skeleton are written once, at generation, committed
in that same step, and never touched again.

Take the route matching his request. A planning-only request uses Route 0. A practice request uses
Route 1, which plans first if necessary. A grading request uses Route 2.

---

## Route 0 — he wants a persistent exercise plan

Resolve topic and level from his request, level defaulting to junior. **One route per request**
(`REC-279`): if he names several topics or levels, or `all`, plan only the first he named that
standard §H supports — for `all`, the first in §H order — and name the rest in one line, each owing
its own later request; never plan two in one run, in sequence or in parallel. Execute
`notes/prompts/practice/exercises/_internal/_practice-plan-prompt.md` completely. Its review gate,
validation, preservation and publication rules govern this path. Report the path, totals, exclusions
and review result; commit the accepted plan and INDEX. Do not generate an exercise batch.

---

## Route 1 — he wants to practise

### 1a — Resolve what

- **He named something** — a topic, a block ("el bloque de colecciones"), or a concept ("`Optional`").
  That is the batch (standard §C). No proposal, no reason asked for, no alternative offered. `{LEVEL}` is
  what he said, else `junior`. An open batch of any topic is named in one line, never a gate. SQL named
  is handed to its own flow: say `vamos con el SQL` is the door and generate nothing.
- **He asked for reinforcement** — he is unsure of something and says so ("refuerzo de X", "no me
  siento seguro con X"). The batch is that concept or those concepts under standard §C's reinforcement
  entry: no proposal, no planned row spent. A thing too vague to resolve to a concept head is matched
  to the closest head(s) of the route and named in one line, never asked about.
  Reinforcement on SQL is the SQL track's own `reinforce` mode, which works on a file, not a concept:
  name `/sql-exercises` with `MODE = reinforce`, the `TOPIC` and the `FILE` of the
  `practice/sql/{LEVEL}/` file whose step in `PLANNING-{LEVEL}.md` covers that concept, and generate
  nothing here.
- **He named nothing** — choose under standard §F from `practice/exercises/INDEX.md` →
  `## Practice state`; where that section is missing, derive it as §F states and write it first,
  committed alone (`docs(practice): derive the practice state`). Open the reply with **one line**: what,
  and why. The proposal is not a question. On an open batch, name it and its exercises with no
  `ATTEMPTS.md` row, generate nothing and end at the report; on a due simulation, say
  `vamos con una simulación` is the door, generate nothing and end at the report; on a topic, carry
  straight on to 1b.

**The topic must have an environment section** in standard §H. If it has none, say so in one line, name
the topics that do, and stop. The proposal path never lands on one (§F).

### 1b — Require the persistent plan

Open `practice/exercises/{topic}/{level}/PLANNING-{level}.md`, its topic coverage, notes plan,
INDEX and ATTEMPTS. Validate the route under standard §B, including actual source digests, not just
the notes plan's stored fingerprint. On an absent/stale exercise plan execute Route 0's planner
and continue only after acceptance — except where the pilot paragraph below applies. On missing/stale sources, report the owner and stop planned
generation — on the proposal path that is standard §F step 4: name it in one line and propose the next
member from 1a instead. A reinforcement request is not planned generation: it continues on the published plan's
heads, and the grader excludes any that turn out orphaned (§D). An explicitly requested off-route extra follows §C and does not create a counted ID.
An unsupported topic/level never enters this route or silently falls back to Java junior.

**The pilot batch** (standard §C, `REC-376`). When the topic has a §H section, **no published plan**, and
no batch yet in its level folder, any practice request for it — "un lote piloto de angular" or just "ejercicios de angular" — skips the plan requirement above, though the coverage and the notes plan are still read and validated for the heads, the `Block` column and `## Study notes`: compose one batch
of `extra` rows, `Plan ID: —`, each naming the coverage head it practises, with `Pilot: yes` in the
README and no `Exercise plan:` line or `Plan snapshot`. One per topic and level. Once a pilot batch
exists there (`Pilot: yes` in its README), a further batch also waits for the `Pilot folded:` line
standard §C puts at the end of the topic's §H section naming that batch. While the line is missing no
batch is generated there, and the session is not refused (§F step 4): name in one line what holds the
topic — while the pilot has no `ATTEMPTS.md` rows, that it is graded first (Route 2), the pilot being the
open batch; the plan too, when none is published — and make §F's proposal instead, which passes the topic
over. Once the pilot is graded the line is the agent's work: name the `_recommendation-ledger.md`
`## Open` row that owes it, or, where none does, open one — the next free `REC-NNN`, state `open`, the
batch, its grade and what it showed — run `notes/prompts/_internal/validate-prompt-system.ps1`, and commit
the row alone (`docs(prompts): open REC-NNN — fold the {topic} {level} pilot`) before carrying on. Never
start the planner on its own here; with the line in place, the absent-plan path above applies as for any
topic. A planning request (Route 0) is never held back by a pilot, graded or not (`REC-380`).

### 1c — Compose the batch

From the persistent plan, `ATTEMPTS.md` and existing batch manifests, under standard §C: size from the time he stated (30 minutes when he
stated none), one checkable objective, the composition split, the difficulty adaptation read off the
`Why` column, and the no-repeat rule — or, on a reinforcement request, §C's reinforcement entry,
which replaces all of these but the size and the objective. If a concept is owing a fix (standard §E), name it in one line —
"tienes pendiente corregir `X` del lote `Y`" — and continue; it is never a gate.

### 1d — Write the batch

One new folder, `practice/exercises/{topic}/{level}/{NN}-{slug}/` (`NN` is one above the highest number in that
level folder, `01` for the first, a third digit after `99`; the date goes in the README's `Date:`,
never in the name): the `README.md` in the exact shape standard §C gives, and one exercise file — or
folder, where §H makes the exercise one — per row in the shape the topic's §H section gives, using the planned basename, or §H's unplanned one. Copy its ID, task,
criteria and concept heads into the batch snapshot; unplanned rows (adaptive, extra, reinforce) use `Plan ID: —`. Statements are written in English, like all code and
technical files. The README's `## Study notes` section is part of that shape: one linked Spanish note
per block the table names, its path and live `Status:` read from the notes plan, listed even when the
note is not written yet. Nothing else is written, and no earlier batch is named in it.

**Where the topic's §H names a workspace** (angular, spring-boot), §H's sequence wraps this step: run
what it names before writing — angular's scaffold dry run, read for the root files it would touch, then
the scaffold — write the files and the root change §H permits, then run §H's generation check on the
untouched batch. A root change §H does not permit, or a check that fails,
stops here: nothing is committed, the batch is repaired or removed, and the report says which. If the
topic's workspace does not exist yet, create it first as §H names and commit it on its own.

**Then rewrite `practice/exercises/INDEX.md` → `## Practice state`** under standard §F, the new batch
open, **and commit the batch as generated** — that folder plus the root changes §H permits a batch's generation
and that section, and nothing else, under `## Commits` — before handing over. From that commit on the
folder's files are his.

### 1e — Hand over

Print the plan path, passed/active planned tasks and `essential passed / listed` (standard §B) — on
a pilot batch, `n/a — pilot` for all three — the objective, the table, the block's Spanish note path with its live `Status:`, and how the
topic's §H says he runs a file. Say once that the batch has no deadline — he may answer it over several
sittings and days — and give him the message his answer commits take (`## Commits`). Then stop: he
answers on his own, and says when it is ready.

---

## Route 2 — he says a batch is ready, or its fixes are

### 2a — Resolve the batch and the mode

`{BATCH}` is the folder he means; with none named, the highest-numbered one in its route's level folder holding an exercise with no row
in `ATTEMPTS.md`, or with a `pending` fix. Quote it back in one line. `{MODE}` is `verify` when he says
he corrected the failures and the batch has `pending` rows, else `grade`. `{HELP}` is what he said he
used, per exercise where he said it ("en el 3 miré la nota"), else `none declared` — help with only the
wording or translation of an explanation he worked out himself is not help (standard §D) and is not
passed on as help.

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
| a pilot batch graded | its rows are in `ATTEMPTS.md` and no figure moved; name what it showed about the environment, which goes into the topic's §H, closed by its `Pilot folded:` line, before a second batch — the route may be planned (Route 0) before or after |
| `recount pending — replan` in the report | the grade is recorded and the `PROGRESS.md` row was not recounted; name the stale source and its owner (`/notes-plan {topic} {level}`, then asking to plan) — the planner triggers the recount |

Check the grader's returned file list against `git status`: a subset of
`practice/exercises/ATTEMPTS.md`, `PROGRESS.md` and `practice/exercises/INDEX.md` — all three after a
grade or verify on current sources, the history and the index when the recount was deferred or the batch
is a pilot, `PROGRESS.md` and the index in `recount` — or nothing. In `INDEX.md` only its
`## Practice state` section may have changed — beyond, on a planner-triggered `recount`, the route
sections the planner refreshed before the dispatch. Anything else modified is a deviation of this run. Each line of its
`desvíos de la rama:` is one too, logged under the shared deviation close-out with `Scope: shared`.

---

## Commits

Per the shared session rules, on the **active branch**, `git status` right before each `git add` and
each `git commit`, so no file of a batch folder is staged alongside a system file.

**You commit yourself** (authorized 2026-10-05, the exercise plans 2026-10-06 — system-written, never Victor's):

- `practice/exercises/{topic}/{level}/PLANNING-{level}.md` + `practice/exercises/INDEX.md`,
  after an accepted planning/reconciliation run — `docs(practice): plan the {topic} {level} exercises`
- `practice/exercises/ATTEMPTS.md` + `PROGRESS.md` + `practice/exercises/INDEX.md` (its
  `## Practice state`), whichever of them a grader run wrote —
  `docs(practice): grade {batch} — n/m`, or `docs(practice): verify the fixes of {batch} — n/m` on a
  `verify` run — or `PROGRESS.md` and the index after a planner-triggered `recount` that changed them:
  `docs(practice): recount {topic} {level}`
- `practice/exercises/INDEX.md` alone, when a proposal derived a missing `## Practice state` —
  `docs(practice): derive the practice state`
- `notes/prompts/_internal/_recommendation-ledger.md` alone — the one `## Open` row 1b opens for a
  graded pilot's owed `Pilot folded:` line, after `validate-prompt-system.ps1` passes —
  `docs(prompts): open REC-NNN — fold the {topic} {level} pilot`
- the batch folder **as generated** — its `README.md` and the statement-and-skeleton files, before he
  has written a line (authorized 2026-10-13, `REC-332`) —
  `docs(practice): generate {topic} {level} batch {NN}-{slug}`, carrying also the root changes the
  topic's §H permits a batch's generation (angular's schematic, spring-boot's `<module>` line) and `INDEX.md`'s `## Practice state` (1d). At generation only: once that commit exists, no file of that folder
  is ever staged by you again.
- the topic's workspace, once, where its §H names one — every file its creation wrote —
  `chore(practice): {topic} {level} workspace` (authorized 2026-10-20, `REC-376`; spring-boot
  2026-10-21, `REC-386`).

**Victor commits himself** — every change to a batch folder after its generation commit, which is his
answers and nothing else. He commits them whenever he likes, in one sitting or across several days, and
grading never waits for it; the message, given at hand-over (1e), is
`docs(practice): {topic} {slug} — answers`. **After a `grade` run, and again after a `verify` run that
dated a fix** (his corrected answers are a new change to the same files), take `git status` on the
batch folder and hand him the two blocks (`git add`, then `git commit`), one command per block, **only
when it shows changes he has not committed**: `docs(practice): {topic} {slug} — n/m` after a grade,
`docs(practice): fix {topic} {slug}` after a verify. No `Co-Authored-By`.

---

## Report back

Route 0: plan path, counts, exclusions, reconciliation delta, validation and cold-review verdict.

Route 1 includes the plan path, `Plan: passed/active tasks` and `Esencial: passed/listed` — `n/a —
pilot` on a pilot batch — alongside:

```
Práctica: java junior · bloque 10 — Collections, hashing, and ordering · 30 min · 5 ejercicios
Por qué: toca java en la rotación — el último lote cerrado fue de angular
Objetivo: elegir entre `List`, `Set` y `Map` y recorrerlos sin abrir la nota
Lote: practice/exercises/java/junior/03-collections/
Nota: notes/java/junior/es/10-colecciones.md (pending)
Commit: lote generado — <hash> · tus respuestas: `docs(practice): java collections — answers`
```

(`Por qué:` only on the proposal path.) Then the batch table.

Route 2 (on a pilot batch the `PROGRESS.md` and `Esencial` rows read `n/a — pilot`):

| Target | Result |
|---|---|
| Lote | `practice/exercises/java/junior/03-collections/` — modo `grade` |
| Resultado | 4/5 ✅ · 1 ❌ (`HashMap` iteration order, por `concept`) |
| Histórico | `ATT-0012`–`ATT-0016` |
| PROGRESS.md | java junior: bloques 2/17 → 2/17 · conceptos 14/125 → 18/125 · consolidados 3 → 3 · pendientes de corregir 0 → 1 |
| Esencial | 12/118 tareas · 4/50 conceptos consolidados · mínimo: pendiente |
| Siguiente | corrige el 4 en su archivo y di que está corregido |
| Commits | míos: ATTEMPTS.md + PROGRESS.md + INDEX.md (`## Practice state`) · tuyos: las respuestas que queden sin comitear (comandos abajo), o ninguno |
