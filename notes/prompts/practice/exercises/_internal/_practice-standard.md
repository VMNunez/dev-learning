# Short practice exercises — the standard

**What this governs.** The short, untimed, graded exercises Victor asks for in his own words ("vamos a
practicar", "hazme ejercicios de streams") for the practical topics beyond SQL. One mechanism for every
topic, taking a topic and a level; built 2026-10-05 from `REC-274`, java junior first. It is executed by
one skill, `practice-session`, through three components beside this file: the planner
`_practice-plan-prompt.md`, its read-only checker `validate-practice-plan.py`, and the cold grader
`_practice-review-prompt.md`. Hand-written only: no run and no skill edits this file.

**What it is not.** The SQL exercise track (`practice/sql/`, its own doctrine and four skills) is left
as it is and is never migrated here. A timed test under exam conditions is `practice/simulations/`; an
algorithm problem is the gated `practice/leetcode/`. What separates this track from both: no clock, the
notes reachable, cold feedback after every batch, and a scope of one concept — or a short integration
of two or three — never a project.

**Two claims that are never merged.** *Applied in a project* is the coverage `✅ NN-slug` marker and
stays `coverage-mark`'s. *Practised in an exercise* is a row in the attempt history below and a count in
`PROGRESS.md` → `## Practice completed`. This track writes no coverage marker, authors no coverage
bullet, and never reads a missing `✅` as "never practised" or as a reason to propose something.

---

## A — Files and their writers

| File | Writer | Notes |
|---|---|---|
| `practice/exercises/{topic}/{level}/PLANNING-{level}.md` | `practice-session` planning route (§B) | persistent reviewed tasks; no exercise source files |
| `practice/exercises/INDEX.md` | `practice-session` planning route (§B) | navigation projected from the plans, each block linked to its note |
| `practice/exercises/ATTEMPTS.md` | the cold grader only (§D) | the per-attempt history; every count anywhere is derived from it |
| `practice/exercises/{topic}/{level}/{NN}-{slug}/` | `practice-session` writes the batch `README.md` and each exercise file's statement and skeleton; **Victor writes the answers** | one folder per batch, never reused; `NN` is one above the highest number in that level folder (`01` first; a third digit after `99`), the date lives in the batch `README.md`, and a folder is never renamed once graded — the history cites it by name |
| `PROGRESS.md` → `### Short exercises` | the cold grader (§G) | cells only, recounted from the history |
| a topic's workspace root files, where its §H names a workspace (`practice/exercises/angular/junior/`: `angular.json`, `package.json`, `package-lock.json`, `tsconfig.json`, `.gitignore`, `.editorconfig`, `.prettierrc`, `.vscode/`, `README.md`) | `practice-session` — created once by the scaffold §H names, then changed only by each batch's generation, within the root changes §H permits | never part of an answer; committed once as the workspace, then with each batch as generated (`REC-376`) |

Nothing is written into a note: a `refined` pair is frozen, and the index is what links a block to it.

**Commits follow authorship, inside a batch folder too.** The batch as generated — its `README.md` and
every exercise file while it holds only its statement and skeleton — is system-written, and the agent
commits it at generation, before Victor has written a line (authorized by Victor 2026-10-13,
`REC-332`). From that commit on, every change inside the folder is his answer and his commit: never
staged by the agent, never co-authored, and made whenever he likes — so each of his commits holds
answers alone. The per-level exercise plans, `INDEX.md`,
`ATTEMPTS.md` and `PROGRESS.md` are system-written and the agent commits them directly (authorized by
Victor 2026-10-05, the plans 2026-10-06; `_session-rules.md` carries the boundary).

---

## B — A persistent exercise plan per topic and level

**Scope comes from coverage; grouping and prerequisite order come from the notes plan; practical
tasks come from the exercise plan.** Neither notes nor coverage is authored by this track.

The route is `practice/exercises/{topic}/{level}/PLANNING-{level}.md`, written by the planning
route of `practice-session`, executing `_practice-plan-prompt.md` beside this standard. The same
mechanism supports junior, middle and senior; an environment in §H must support the selected pair
before a plan or a batch is served. Create a level only when it is enabled and requested; never
copy junior tasks into another level or pre-create empty trees. SQL retains its separate system.

### Plan contract

- Header: `Plan status: current`, `Topic:`, `Level:`, `Coverage:`, `Coverage SHA-256:`,
  `Notes plan:`, `Notes structure SHA-256:`, `Generated:`. Recompute the coverage digest using
  `_coverage-standard.md`'s scope-byte algorithm, stripping evidence markers before comparing;
  never trust the notes plan's stored digest alone. The notes plan must be current and match it.
- Blocks follow the notes-plan entries and carry their number, title, Spanish note path and
  `Depends on`. All selected-level coverage bullets appear exactly once in the concept table, under
  the heading `## Concept mapping`: `Concept ID | Block | Coverage head | Disposition | Reason`. The head is verbatim text before
  the first ` — `, without state/evidence markers. IDs are stable within this route. Disposition
  is `included`, `excluded`, or `retired` for a concept coverage no longer holds (below); every
  exclusion needs a concrete environment/scope reason.
  Earlier-level concepts may be prerequisites, never new selected-level targets.
- The exercise table, under `## Exercise inventory`, is
  `ID | Block | Concepts | Kind | Difficulty | After | File | Task | Pass condition | State`.
  In both tables separators are written `|---|` unspaced and a literal `|` inside a cell as `&#124;`
  — the checker reads both literally.
  `Concepts` lists concept IDs separated by commas; every active included concept needs a `first`
  exercise and a distinct later `variant`. `integration` joins two or three already-attempted
  concepts; plan at least one per included block where its concepts admit a meaningful short task.
  Explain any exception. Difficulty is `foundation`, `transfer` or `integration`. `After` lists
  prior exercise IDs or `none`. Tasks state a concrete coding, diagnosis or API-use problem;
  "practise concept X" is not a task. Pass conditions specify observable evidence and edge cases,
  never a worked solution. Quantity follows the tasks, not a uniform quota per block.
- `File` reserves an exact basename inside a future batch folder, matching §H. The batch number and
  slug are allocated when Victor sits down to answer. No source files or full statements are
  generated during planning. The first plan must show all intended tasks, including transfers
  and integrations, not just a list of headings or totals. `State` is `active` or `retired` only;
  attempted/passed counts are derived from the history, never copied into the plan.
- `INDEX.md` is navigation and a projection, one section per route: the lines `Exercise plan:`,
  `Active planned exercises:`, `Notes plan:`, `Coverage SHA-256:`, `Notes structure SHA-256:`,
  `Derived:` (date) and `Essential route:` (its stage and listed-task counts) — then one row per block —
  `Block | Title | Note | Depends on | Bullets | In route`
  — where `Bullets` counts the block's bullets and `In route` is `yes`, or `no — <reason>` where §H
  excludes the block, and one line of in-route totals, which are §G's two denominators: the in-route
  blocks, and the **included** concepts of those blocks. A concept excluded at concept level inside an
  in-route block (angular §H) stays in its block's `Bullets` and enters neither total — the line names
  how many there are when any — since no exercise may be planned for it, and counting it would leave a
  share that can never reach 100 % (`REC-377`). It never owns task design.
- Notes structure digest: SHA-256 of UTF-8 JSON, `ensure_ascii=False`, compact separators, no final
  newline, over the ordered list of `[number,title,Spanish,Depends on,[full coverage bullets]]`.
  Strip checkbox and evidence markers from bullets; exclude note prose and all status/study fields.
  `validate-practice-plan.py` beside this standard implements both digests and route checks.

### Freshness and preservation

Before planning or generating, validate both sources and the exercise plan. A changed concept's
description, a same-count remap, dependency, note path or order changes its source digest. Study
checkboxes and project evidence do not. An absent/stale exercise plan goes through planning first;
generation never silently substitutes an improvised route — the one exception is §C's pilot batch, which
is served instead of a route, never as one. Missing/stale notes plans name
`/notes-plan {topic} {level}` and stop planned generation. An explicitly requested off-route concept
may still be served as `extra` in a supported environment, reported as outside the planned route.

A replan preserves existing IDs and all history. Never renumber, delete or repurpose a published
exercise or concept ID. Preserve an unchanged task's whole row; retire a changed task and append its
replacement under a fresh ID. A row whose `After` names a retired ID is a changed task too: retire it
and append its replacement, pointed at the new prerequisite — the checker rejects an active row that
depends on a retired one. Its earlier attempts remain concept evidence and pass no new ID. Retain removed concept definitions as `retired` dictionary rows outside
the current concept denominator. Notes-block remaps update the current concept mapping without
changing the head identity; published task rows keep their historical block. No batch folder is edited.
The planner reports additions, retirements and unchanged tasks and refreshes digests only after the
mapping has been reconciled and reviewed. It does not infer success for new IDs from old exercises.

### Completion

The existing concept first-pass measure remains: every included concept in the block has one
non-`void` `first` attempt. This measures exposure, not completion of the exercise plan.
**A planned exercise is passed** when an attempt carrying its `Plan ID` has result `✅`, or a failing
attempt has a verified fix date. `void` and unlinked (`Plan ID: —`) attempts never pass an ID.
The plan is completed only when all active IDs are passed and no active ID has a later unresolved
failure. Report `planned passed / active total` separately from concept first-pass and consolidation.
Extra reviews do not increase the target. Retired IDs remain historical and count toward no active
target; an attempt without a Plan ID remains concept evidence but never fulfils a task.

### Essential route — the route's minimum, as a ladder

A whole route is a long inventory in notes order, and served in that order a learner spends weeks on
foundations before reaching the work a junior is hired for. So **every plan carries** a
`## Essential route` section, after `## Exercise inventory`: the subset of active tasks that is the
route's **minimum** — the floor Victor's schedule criteria cite — ordered as a ladder from simple to
combined (Victor, 2026-10-20: *"debe haber ejercicios sencillos y con una evolución para poder hacer lo
complicado, o si no me voy a perder"*). It reorders nothing in the inventory and retires nothing: a task
outside it stays active, and is served on request or once the route is passed. It is mandatory since
2026-10-20 (`REC-375`): while it was optional it existed only when someone asked for it at planning
time, and a plan built without it serves the inventory in notes order — the failure this section exists
for. The checker fails a plan that lacks it.

- One table, `Stage | Title | Tasks`: `Stage` a two-digit number, unique, in serving order; `Tasks` the
  stage's IDs, comma-separated, in serving order. Every ID is an active inventory row and appears once
  in the whole section.
- **Closure and order.** Every ID a listed row names in `After` is itself listed, earlier in the section.
  The route is therefore servable on its own, from its first stage.
- **The ladder.** Every concept a listed row names is an *essential concept*, and the section lists that
  concept's `first` row and at least one of its `variant` rows. Every stage lists at least one
  `integration` row, so each stage ends by combining what it taught; the last stages may consist of
  cross-block integrations alone — small problems of the shape a technical test asks.
- **Reconciliation.** A listed ID that a replan retires is replaced, in the same position, by the row
  that replaces it; a listed ID is never silently dropped.

**The essential route is passed** when every listed ID is passed under the rule above. **The route's
minimum is met** when, in addition, every essential concept is *consolidated* (§E), and every listed
`integration` row was first answered `✅` with `Help: —` — or, where it was not, a later `integration`
attempt naming the same heads was. The grading report states `essential passed / listed`,
`consolidated essential concepts / essential concepts` and whether the minimum is met, and the session
report `essential passed / listed`, each apart from the planned and first-pass figures; none of them
enters the `PROGRESS.md` row (§G).

---

## C — A batch

**Generated when Victor sits down to start it, never in advance** (the SQL rule of 2026-08-04). Declaring a note
refined generates nothing. Once generated it has no deadline: he may answer it over several sittings
and days, and it is graded once, when he says it is finished (`REC-332`).

**Three entries, one component.** Called **with** a topic, a block or a single concept, the batch is that —
no proposal first, no reason asked for, no counter-suggestion; wanting to is sufficient. Called
**without**, §F chooses and the batch opens with one line saying what and why, which Victor may always
override. A requested batch is a first-class attempt in every count. Called **as reinforcement** — Victor
says he is unsure of something ("refuerzo de X", "no me siento seguro con X") — the batch follows the
reinforcement entry below instead (`REC-278`, 2026-10-06).

**The pilot batch** (`REC-376`, 2026-10-20). A topic that has a §H section and **no published plan** is
served **one** pilot batch on its first practice request, whether or not he says "piloto", so the environment is tried on a real batch
before a route is planned against it. Its rows are kind `extra`, `Plan ID: —`, each naming the coverage
head it practises; its `README.md` carries `Pilot: yes` in place of `Exercise plan:` and has no
`Plan snapshot`. It is graded cold against its own statements and declared heads, adds `ATTEMPTS.md`
rows like any `extra`, moves no figure — the route has no `INDEX.md` table, so §G gives it no row — and
reports the planned and essential counters as `n/a — pilot`. A second batch for that topic and level
waits for the plan. What the pilot showed is written into the topic's §H section before the route is
planned.

- **What a request fixes.** Only *what* is practised. Size, objective, composition and difficulty below
  still apply. A requested concept whose prerequisite block has no attempt is served as asked, with at
  most one line saying so.
- **A concept outside the route.** One that is a coverage bullet at that level but sits in an excluded
  block or is itself excluded at concept level (§B), and one that is no coverage bullet at all, are both
  served as kind `extra`: recorded, never
  counted toward a first pass, the second with one line saying it is outside the checklist. This track
  never authors a bullet.
- **Size.** From the time Victor states when he opens the session; with none stated, assume 30 minutes
  and never ask. Budget about 6 minutes per isolated exercise and 15–20 per integration exercise; never
  more than 8 exercises.
- **One objective.** Every batch states a single checkable objective in its `README.md` — "transform a
  list with a stream without opening the notes" — never the topic's name.
- **Composition.** Use the active plan rows in table order, respecting `After` prerequisites —
  **except while the plan's essential route (§B) is not passed**: then a proposed batch,
  or one requested for the topic as a whole ("ejercicios de java") with no block or concept named, takes
  its advancing share from the unpassed listed IDs in the section's order — the difficulty adaptation
  below included, which picks its next planned transfer/integration among them — and table order
  resumes once the route is passed. Eligibility is unchanged, so a listed variant still waits for a
  later batch than its first and the next eligible listed ID is taken meanwhile. From the route passed
  until its minimum is met, such a batch's revisit share goes first to the essential concepts not yet
  consolidated and, for each listed `integration` not yet answered `✅` with `Help: —`, to an unplanned
  integration (`Plan ID: —`) naming the same heads.
  Roughly three fifths of the time budget advances unpassed planned tasks; the rest revisits failures
  and correctly answered concepts oldest first. With no history use eligible planned tasks only.
  A prerequisite task needs a non-void attempt; a planned variant additionally needs a different
  batch from its first exercise. Integrations require attempts on all their concepts. Never emit a
  plan ID already present in an ungraded batch: resume that batch, or choose other eligible work.
  Shrink to fit the time budget; do not fill space by inventing counted tasks. At route completion,
  serve adaptive reviews as unplanned variants/integrations with `Plan ID: —`.
  A specific request narrows the selection; it may override prerequisite order with one warning,
  but cannot turn an integration with unattempted concepts into a valid integration: serve a first
  planned task for those concepts instead. A requested repeat is an unplanned variant, never a new
  counted ID. Every variant changes data, framing or the combination so old code is not an answer.
- **Difficulty adapts.** A failure the grader attributed to `prerequisite: <head>` sends the next batch
  to that prerequisite. Two consecutive unaided `✅` on a concept select its next planned transfer/integration where eligible;
  after those tasks are passed, use an unplanned harder variant, or combine it
  with a neighbour in an integration exercise. A concept is not served a third equivalent exercise. Adaptation never rewrites a planned task
  or waives its pass condition; prerequisite remediation has `Plan ID: —`.
- **Integration exercises** join two or three already-attempted concepts in one small task. Untimed,
  with feedback, one file — or one exercise folder, where the topic's §H makes the exercise a folder —
  that is the line that keeps them out of `practice/simulations/`.
- **Reinforcement** serves only the concept or concepts he names, each a head of an included concept of
  the route — anything else follows the `extra` rule above. Every row is kind `reinforce`, `Plan ID: —`:
  it never serves, reserves or spends a planned row, needs no `After` prerequisite, and has no
  composition split. Size and the one objective apply as above, and a whole batch may stay on one
  concept: the third-equivalent limit does not apply, but no exercise repeats another of the batch or an
  earlier batch's exercise on that concept — each changes data, framing or the mistake it targets, so
  old code is not an answer. A failure the grader attributes to
  `prerequisite: <head>` is named in one line and may be reinforced next on his word, never on its own.
  It is graded cold like any batch, never moves planned completion (§B) or `Blocks first-passed` (§G),
  and counts toward *consolidated* only as §E states.

**Batch `README.md`** — header lines `Topic:`, `Level:`, `Block:`, `Date:`, `Objective:`, `Time budget:`,
`Note:` (the block's Spanish note path and its live `Status:`), then `Exercise plan:` (path),
then one table: `Ex | Plan ID | Kind | Block | Concept | File`. `Plan ID` is an active planned ID or
`—` for adaptive reviews, extras and reinforcement. Copy the selected task and pass condition into each statement;
instantiate data and context without changing their scope. Resolve concept IDs to verbatim heads.
For each planned row preserve its Task, Pass condition and head list in a `Plan snapshot` section
of the batch README, so grading an existing attempt remains possible after source changes. `Kind` is `first`, `variant`, `integration`, `extra` or `reinforce`; `Block` is the block that holds
the row's concept — a batch routinely mixes blocks, since variants return from earlier ones — the
highest-numbered of them on an integration row, and `—` on an `extra` outside any block; `Concept` is
the bullet head (several, `+`-joined, on an integration row). The header's `Block:` is the target
block only. The grader copies `Plan ID`, `Kind`, `Block` and `Concept` from this table into the history.

**The `README.md` names what to study, for every block it serves** (`REC-332`). Between the table and
the `Plan snapshot`, a `## Study notes` section holds one line per distinct block in the table's
`Block` column, in block order: the block's number and title, its Spanish note — the exact path the
notes plan assigns that entry — as a Markdown link relative to the batch folder, and that entry's live
`Status:`. The notes plan decides the path, never the disk: an entry whose file does not exist at that path yet is
listed and linked all the same, marked `not written yet` — the one thing this section reads from the
disk, and never inferred from `Status:` — because the plan entry is what says it will exist.
An `extra` row outside any block adds no line. The section is navigation for Victor and nothing reads
it back — the grader works from the table and the snapshot, and a note he opens while answering is
`Help: notes` only when he says so (§D).

**Earlier solutions stay out of the way by construction**: each batch is its own folder, the new batch
never names an earlier one, and the no-repeat rule above is what makes looking back useless.

---

## D — The attempt history

`practice/exercises/ATTEMPTS.md`, one row per exercise graded, appended by the cold grader and by
nothing else. It is the track's only primary state.

| Column | Values |
|---|---|
| `ID` | `ATT-NNNN`, next free |
| `Date` | the day it was graded |
| `Route` | `{topic}:{level}` — `java:junior` |
| `Block` | copied from the batch table: the block number, or `—` for an `extra` outside any block |
| `Concept` | the bullet head(s), verbatim from the batch table |
| `Batch` | the batch folder name — unique only inside its level folder, so a batch is always matched as `Route` + `Batch` |
| `Ex` | the exercise number in that batch |
| `Kind` | `first` · `variant` · `integration` · `extra` · `reinforce` |
| `First result` | `✅` · `⚠️` (works, with a real defect) · `❌` · `void` |
| `Why` | on `⚠️`/`❌` only: `concept` · `prerequisite: <head>` · `api` (knew the idea, not the call) · `reading` (answered a different question) · `careless`; `—` otherwise |
| `Help` | what Victor **said** he used: `notes` · `hint` · `feedback` · `ai`; `—` when he declared none. Never inferred, never asked for. `ai` is technical help from an AI while solving — code, a hint, the solution, or a judgement of whether his answer is right — and never help with only the wording or translation of an explanation he worked out himself, which is no help at all (Victor, 2026-10-20) |
| `Fix verified` | `—` on `✅` and `void` · `pending` on `⚠️`/`❌` · the date a later run verified his corrected answer |
| `Plan ID` | planned ID from the batch table, or `—`; immutable |

Rules:

- **`First result` is immutable.** A corrected answer moves `Fix verified` and nothing else; the first
  attempt is the evidence, exactly as a timed verdict is in the simulation track.
- **A defective exercise is `void`**, never his failure: an ambiguous statement, a skeleton that cannot
  compile as given, a planned row whose ID, heads, task or criteria do not match its saved plan snapshot and retained
  plan row. Grade existing batches against their generation-time contract, not a later block remap.
  An unplanned row (`Plan ID: —`) is graded against its own statement and declared heads; current orphan heads
  are reported and excluded from recounts rather than making a historically valid exercise void. The grader says what was wrong with the
  exercise; a `void` row counts in no figure and the concept is still owed its first pass.
- **`Why` is mandatory on a failure**, because §C's adaptation reads it. A grader that cannot tell
  writes `concept` and says so in its report.
- Rows are never edited after insertion except `Fix verified`, and never deleted.

---

## E — The loop, and what each state means

attempt → cold feedback → Victor fixes → the fix is verified → a later variant.

Derived per concept, from the rows above and never stored:

- **attempted** — at least one non-`void` row.
- **owing a fix** — its latest failing row has `Fix verified: pending`.
- **fixed** — that row carries a date. A fix made after reading the feedback proves he can repair it,
  not that he can produce it.
- **consolidated** — a row of kind `variant`, `integration` or `reinforce` from a **later batch** than the concept's
  first row (a higher `ATT` id under a different `Batch`; a second batch on the same day counts),
  with `First result: ✅` and `Help: —`. Only this state lowers a concept's priority in §F. A fix and a
  later unaided variant are two different pieces of evidence and are never added together.

Correctly answered concepts return too: an unaided `✅` on a first attempt is `attempted`, not
`consolidated`, until a later variant confirms it.

---

## F — Choosing what to propose

Only when Victor names no topic. One short proposal with its reason; he may override it, and no ritual
comments on the choice he makes instead.

1. **Goal, read and never hard-coded**: `ROADMAP.md` and the open gates of `PROGRESS.md` →
   `## Professional level by topic`. As Victor states it today, writing a lot of java, angular, sql and
   spring-boot; javascript, typescript, html and css enter when they support angular or a concrete gap
   appears.
2. **Evidence already on disk, before any history exists**: `practice/sql/MISTAKES.md`,
   `practice/simulations/MISTAKES.md`, `practice/interview/MISTAKES.md`, every project's
   `PROJECT-BACKLOG.md`, and the active project's current `PLANNING.md` step. "Not recorded" is never read as "not known".
3. **The history**: concepts owing a fix (named in one line, never a gate), failures by recency, the
   time since each attempted concept was last seen, and the first block in plan order with eligible unpassed active tasks — or, while the
   plan's essential route (§B) is not passed, the next eligible listed ID of that route instead. `Depends on` blocks
   need attempts; `After` and later-batch variant rules still apply.
4. **Order of preference** between candidates: prerequisite first, then recent failures, then pending
   review, then new content — and never the absence of a coverage `✅`.

Two fixed outcomes. **SQL** is proposed like any other topic and then handed to the existing flow — say
`vamos con el SQL` is the door — generating nothing here. **A topic with no environment section in §H**
is named honestly when it would rank first ("spring-boot sería lo siguiente; su entorno de práctica aún no
está definido") and the next candidate that has one is proposed instead.

---

## G — The `PROGRESS.md` projection

`## Practice completed` → `### Short exercises — practice/exercises/`, one row per route in `INDEX.md`:

| Cell | Recount, from `ATTEMPTS.md`, `INDEX.md`, the plan's concept mapping and the heads of the notes plan the index names |
|---|---|
| `Blocks first-passed` | blocks `In route: yes` whose every included concept has a non-`void` `first` row / blocks `In route: yes` |
| `Concepts attempted` | distinct included heads of in-route blocks with a non-`void` row / the in-route included-concept total (§B — the sum of in-route `Bullets` less the concepts excluded inside those blocks) |
| `Consolidated` | distinct included heads of in-route blocks in state *consolidated* (§E) / the same denominator |
| `Owing a fix` | the count of concepts in that state — a number, never a percentage |

The planned passed/active total (§B) is returned in the session and grading reports, not added to
this table; the concept first-pass cells do not claim plan completion. If sources/plan are stale,
the grader still records and verifies existing answers, but leaves the projection unchanged, reports
`recount pending — replan`, and the planning route invokes the grader in `recount` mode after repair.
A recount writes no attempts and reuses §G; the planner never invents grades.

The three share cells are written `n/N (p%)`. The grader rewrites the affected row after every run that
appended or changed a history row, and adds the row on a route's first such run (or on an explicit `recount`). `extra`
rows, orphaned heads and excluded heads enter no cell; the grader's report states how many of each exist. A route with
no table in `INDEX.md` has no row. The legend prose beside the table has no automatic writer.

---

## H — Environment and grading, per topic

A topic is served only when it has a section here. Asked for one that has none, `practice-session` says
so in one line, names the topics that do, and generates nothing. A section is added by hand, under the
recommendation ledger — the environments differ in kind, which is why "adding a topic is only its
route" is false: git needs a throwaway repository whose resulting history is the answer, html and css
need rendering, angular and spring-boot need a small base app with isolated attempts.

### java — junior

- **Shape.** One standalone file per exercise, `ExNN.java`, using the planned basename (unplanned work — adaptive reviews, extras and reinforcement — uses `ExExtraNN.java`), holding the statement as its opening comment
  block and a compilable skeleton — a public class matching the basename with a `main` — with `// Your answer:` marking
  where he writes. No package line, no build tool, no dependency beyond the JDK.
- **How he runs it.** Normally with the JDK's single-file source launcher, from the batch folder.
  Block 00 may explicitly ask him to compile with `javac` and run the resulting class with `java`
  to observe source versus bytecode; both are JDK tools, with no build project. The agent never
  runs his work.
- **Evidence of execution.** The file is the evidence. Where the statement asks for observable output,
  it prints an `// Expected output:` block, and he pastes what his run printed under a `// My output:`
  comment at the end of the file — the grader compares the two and reads the code either way.
- **Grading.** Static reading of the file against the statement and the concept its row names: does it
  solve the stated task, does it use the concept the exercise exists for rather than route around it,
  would it compile, does `My output` match where one was asked for. Style is feedback, never a failure.
- **Language of the answer.** The statement stays in English; the comments and explanations Victor
  writes in his answer are in **Spanish** (Victor, 2026-10-20), and the grader judges them in Spanish.
  Where an exercise he answered correctly — a `✅`, or a fix a `verify` run dates — carries an
  explanation he wrote, the grader's feedback returns that explanation reworded more clearly in Spanish
  and translated into English, for him to read. It is feedback, written in the report and never in his
  file, and it is never help: the attempt's `Help` stays what he declared (§D).
- **Excluded block.** `17 — Maven fundamentals`: its concepts need a real `pom.xml` and a build, not a
  standalone file. `In route: no`. They are practised in the projects, and requested as `extra` they are
  answered in prose or against an existing project's `pom.xml`, never by scaffolding one here.
- **Spring Framework** has no route of its own (`ROADMAP.md` → "Spring Framework — when to start
  (post-job gate)"); the mechanisms Victor already uses are practised inside the spring-boot route when
  that topic gains its section.

### angular — junior

Ruled by Victor on 2026-10-20 (`REC-376`): one workspace with one application per batch, so the
install is shared and a batch left broken never stops another; testing practised as its own concepts
and only later combined with features; one pilot batch (§C) before the route is planned.

- **Workspace.** `practice/exercises/angular/junior/` is one Angular workspace with no application of
  its own, created once by the agent with
  `ng new junior --directory=practice/exercises/angular/junior --create-application=false --skip-git --ai-config=none --package-manager=npm`
  at the CLI version the active project pins (21.2.23 today), through `npx @angular/cli@{version}` — the
  active project's local CLI refuses to create a workspace, because it finds its own. Its root files are
  the system's (§A); `node_modules/`, `dist/` and the CLI cache under `.angular/` stay ignored by the scaffold's `.gitignore`. **No answer touches a root
  file and no exercise adds a dependency**: a concept that needs either is excluded at planning, at
  concept level, with its reason.
- **A batch is an application.** Generation runs, from the workspace,
  `ng g application lote-NN --project-root=NN-slug --style=scss --ssr=false` — `NN-slug` being the batch folder §A
  names, so every path and name downstream of it is unchanged — after its `--dry-run`, read for the root
  files it would touch. It may change, **on every batch**, `angular.json` (that application's entry) and
  `tsconfig.json` (that application's two references), and **on the first batch only** `package.json` and
  `package-lock.json` (the build and test dependencies the schematic adds and installs). From the second
  batch it runs with `--skip-install`, and with `--skip-package-json` once the dry run shows nothing to
  add. Any other root change stops generation, reported. Every command names its application —
  `ng serve lote-NN`, `ng test lote-NN` — never the whole workspace.
- **A batch is one small visible feature.** The application's shell (`app.html`) is the feature and the
  index of its exercises — a list held in a signal, its filter, its empty state, a detail route — and the
  batch's one objective (§C) names that behaviour. **Each isolated exercise brings the data and the
  dependencies it needs to be graded alone**: the filter exercise receives its own given list, never
  Victor's answer to the list exercise. Pieces depend on one another only inside a declared
  `integration` row, under its own criteria.
- **Shape.** An exercise is a folder under the batch's `src/app/`, named by its planned basename
  (`File`) — `exNN-slug`, or `exextra-NN-slug` for unplanned work — holding the files its objective
  needs: a standalone component (`.ts`, `.html`, `.scss`, never inline), a service, a pipe, a guard, an
  interceptor, two components for a parent–child exchange. When the piece has something to show it gets
  a demo route, `/exNN`, linked from the shell. The statement is the opening comment of its main `.ts`
  file and ends with `Answer files:`, the files Victor writes in, each carrying its marker
  (`// Your answer:`, `<!-- Your answer: -->`, `/* Your answer: */`). The code follows the 2025 style
  guide and the version's practices (`inject()`, signals, `@if`/`@for`), checked against the Angular CLI
  MCP's `get_best_practices` when the batch is written.
- **Answered.** An exercise is answered when at least one of its declared answer files differs from the
  batch's generation commit beyond its skeleton. A given spec is never an answer file; a spec the
  statement asks him to write is one.
- **Evidence.**
  - *Logic* (signals, services, pipes, form logic): the exercise ships a **given spec** that tests
    behaviour through the public API and the rendered DOM — never private names or call order. He runs
    `ng test lote-NN --include app/exNN-slug --watch=false` (`--include` resolves from the
    application's source root, and a folder includes every spec in it) and pastes what it printed under
    a `// My output:` comment at the end of the main `.ts` file. A given spec that differs from the
    generation commit is not evidence.
  - *Interface*: the statement carries a **manual check** — an action and its expected result ("type
    `xyz` in the filter → the list shows `Sin resultados`") — and he writes what the browser actually
    did under `<!-- Observed: … -->` in the template. `ng build` proves the code compiles; it is not
    enough evidence of visual behaviour.
  - *Testing* — blocks `24` and `25`, and an `integration` that combines a feature with its test: he
    writes the spec, which is an answer file; its skeleton holds one pending test (`it.todo(…)`), so the
    generation check reports it as skipped rather than as an empty-file error. Before those blocks every
    spec is given.
  - *HTTP* has no backend: a GET reads a JSON file the batch ships under `public/`; what a static file
    cannot answer — a POST, a `401`, a delay — runs through a given spec with `HttpTestingController`.
- **Generation check — environment validated, pending exercises red.** Before committing a batch as
  generated, the agent runs `ng build lote-NN` and `ng test lote-NN --watch=false` on it untouched, and
  commits only when the build passes; the shell spec, rewritten for the new shell, passes; the spec files
  the run discovered are exactly the ones the batch ships; and every given spec fails **only on its
  assertions** — a given spec that passes before he answers tests nothing. An injection, configuration,
  compilation or runtime error is a defect of the batch, repaired before the commit. The batch
  `README.md` says that this red is where he starts. The scaffold, its dry run and these two runs are
  the only commands the agent runs in the workspace: never `ng serve`, never his answers.
- **Grading.** Static reading of the declared answer files against the statement and the concept its
  row names: does it do what was asked, using that concept rather than routing around it; would it
  compile; does `My output` or `Observed` match what was expected; is every given spec unchanged since
  the generation commit. Style is feedback, never a failure. His comments and explanations are in
  Spanish, under java's language rule above, which applies here unchanged.
