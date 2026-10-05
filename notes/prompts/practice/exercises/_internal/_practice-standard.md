# Short practice exercises — the standard

**What this governs.** The short, untimed, graded exercises Victor asks for in his own words ("vamos a
practicar", "hazme ejercicios de streams") for the practical topics beyond SQL. One mechanism for every
topic, taking a topic and a level; built 2026-10-05 from `REC-274`, java junior first. It is executed by
one skill, `practice-session`, and one cold grader, `_practice-review-prompt.md` beside this file. Hand-written
only: no run and no skill edits this file.

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
| `practice/exercises/INDEX.md` | `practice-session` (derivation only, §B) | the route: one table per topic and level, each block linked to its note |
| `practice/exercises/ATTEMPTS.md` | the cold grader only (§D) | the per-attempt history; every count anywhere is derived from it |
| `practice/exercises/{topic}/{level}/{YYYY-MM-DD}-{slug}/` | `practice-session` writes the batch `README.md` and each exercise file's statement and skeleton; **Victor writes the answers** | one folder per batch, never reused |
| `PROGRESS.md` → `### Short exercises` | the cold grader (§G) | cells only, recounted from the history |

Nothing is written into a note: a `refined` pair is frozen, and the index is what links a block to it.

**Commits follow authorship.** Everything inside a batch folder is Victor's commit — statement and
answer share a file, as in the SQL track — and is never staged by the agent or co-authored. `INDEX.md`,
`ATTEMPTS.md` and `PROGRESS.md` are system-written and the agent commits them directly (authorized by
Victor 2026-10-05; `_session-rules.md` carries the boundary).

---

## B — The route is derived, not planned

A topic's route at a level is **its notes plan read as blocks**: `notes/{topic}/coverage/notes-plan-{LEVEL}.md`
already holds the prerequisite order, the bullets each chapter claims and a coverage fingerprint, so a
second planner would be a second opinion about the same order.

- **Block** = one notes-plan entry (`## NN — Title`), in entry order. Its **concepts** are the bullets of
  that entry's `Coverage concepts:` list; a concept's identity is the bullet's **head** — the text before
  the first ` — `, copied verbatim, with the plan's `- [ ]` / `- [x]` checkbox and any evidence marker
  stripped: both are state, and state is never part of an identity.
- **`INDEX.md` row** = block number, title, the entry's `Spanish:` path, its `Depends on:`, the count of
  its bullets, and `In route` (`yes`, or `no — <reason>` where §H excludes the block). One line under
  the table states the in-route totals — blocks and concepts — which are §G's two denominators.
- **Fingerprint.** Each table states the notes plan's own `Coverage SHA-256` at derivation. When the
  plan's value differs, or its entry list or any entry's bullet count no longer matches the table's — a
  remap between entries moves bullets under an unchanged digest — the table is **re-derived in place**
  before anything is generated — mechanical, no reviewer, reported in one line.
- **A re-derivation never touches `ATTEMPTS.md`.** History rows keep the block and head they were
  written with. A head no in-route block of the plan holds any more is an **orphan**: the recount (§G)
  reports it and counts it in no cell, and it is never deleted or rewritten. The recount matches a row
  to a block by its head, wherever the plan holds that head today; a row's `Block` is only the record
  of where the head sat when the row was written, so a head a remap moved between entries keeps its
  attempts. The index stores a count per
  block, never the heads, so every check of *which* heads a block holds reads the notes plan named on
  the table's `Notes plan:` line.
- A note's `Status:` is read live from the notes plan and never stored here. A block may be practised
  before its note is refined, or written at all; the batch says which state the note is in.
- A plan that reads `Plan status: stale`, or a topic with no notes plan at that level, has no route:
  say so in one line and name `/notes-plan {topic} {level}`. A requested batch is still served (§C).

**First pass.** A block's first pass is complete when every concept of the block has one attempt of kind
`first` that is not `void`. It is finite by construction. Everything after it — variants, integration,
requested extras — is practice on top of the route and never moves the first-pass figure.

---

## C — A batch

**Generated on the day it is answered, never in advance** (the SQL rule of 2026-08-04). Declaring a note
refined generates nothing.

**Two entries, one component.** Called **with** a topic, a block or a single concept, the batch is that —
no proposal first, no reason asked for, no counter-suggestion; wanting to is sufficient. Called
**without**, §F chooses and the batch opens with one line saying what and why, which Victor may always
override. A requested batch is a first-class attempt in every count.

- **What a request fixes.** Only *what* is practised. Size, objective, composition and difficulty below
  still apply. A requested concept whose prerequisite block has no attempt is served as asked, with at
  most one line saying so.
- **A concept outside the route.** One that is a coverage bullet at that level but sits in an excluded
  block, and one that is no coverage bullet at all, are both served as kind `extra`: recorded, never
  counted toward a first pass, the second with one line saying it is outside the checklist. This track
  never authors a bullet.
- **Size.** From the time Victor states when he opens the session; with none stated, assume 30 minutes
  and never ask. Budget about 6 minutes per isolated exercise and 15–20 per integration exercise; never
  more than 8 exercises.
- **One objective.** Every batch states a single checkable objective in its `README.md` — "transform a
  list with a stream without opening the notes" — never the topic's name.
- **Composition.** Roughly three fifths new first-pass concepts of the target block, one fifth variants
  of concepts whose last attempt failed and whose fix is verified, one fifth variants of concepts
  answered correctly longest ago. With no history, all first-pass. A target block with fewer
  unattempted concepts than its share fills the rest from the next in-route block in index order whose
  `Depends on` blocks all have attempts, and the batch shrinks rather than spill past that. A batch never repeats an earlier
  statement: a variant changes the data, the framing or the combination, so an earlier solution does not
  answer it.
- **Difficulty adapts.** A failure the grader attributed to `prerequisite: <head>` sends the next batch
  to that prerequisite. Two consecutive unaided `✅` on a concept raise it: harder variant, or combined
  with a neighbour in an integration exercise. A concept is not served a third equivalent exercise.
- **Integration exercises** join two or three already-attempted concepts in one small task. Untimed,
  with feedback, one file — that is the line that keeps them out of `practice/simulations/`.

**Batch `README.md`** — header lines `Topic:`, `Level:`, `Block:`, `Date:`, `Objective:`, `Time budget:`,
`Note:` (the block's Spanish note path and its live `Status:`), then one table: `Ex | Kind | Block |
Concept | File`. `Kind` is `first`, `variant`, `integration` or `extra`; `Block` is the block that holds
the row's concept — a batch routinely mixes blocks, since variants return from earlier ones — the
highest-numbered of them on an integration row, and `—` on an `extra` outside any block; `Concept` is
the bullet head (several, `+`-joined, on an integration row). The header's `Block:` is the target
block only. The grader copies `Kind`, `Block` and `Concept` from this table into the history.

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
| `Batch` | the batch folder name |
| `Ex` | the exercise number in that batch |
| `Kind` | `first` · `variant` · `integration` · `extra` |
| `First result` | `✅` · `⚠️` (works, with a real defect) · `❌` · `void` |
| `Why` | on `⚠️`/`❌` only: `concept` · `prerequisite: <head>` · `api` (knew the idea, not the call) · `reading` (answered a different question) · `careless`; `—` otherwise |
| `Help` | what Victor **said** he used: `notes` · `hint` · `feedback` · `ai`; `—` when he declared none. Never inferred, never asked for |
| `Fix verified` | `—` on `✅` and `void` · `pending` on `⚠️`/`❌` · the date a later run verified his corrected answer |

Rules:

- **`First result` is immutable.** A corrected answer moves `Fix verified` and nothing else; the first
  attempt is the evidence, exactly as a timed verdict is in the simulation track.
- **A defective exercise is `void`**, never his failure: an ambiguous statement, a skeleton that cannot
  compile as given, a head the row's `Block` does not hold in the notes plan — on an integration row, a head no in-route block holds. The grader says what was wrong with the
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
- **consolidated** — a row of kind `variant` or `integration` from a **later batch** than the concept's
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
   time since each attempted concept was last seen, and the first block in `INDEX.md` order whose first
   pass is incomplete and whose `Depends on` blocks all have attempts.
4. **Order of preference** between candidates: prerequisite first, then recent failures, then pending
   review, then new content — and never the absence of a coverage `✅`.

Two fixed outcomes. **SQL** is proposed like any other topic and then handed to the existing flow — say
`vamos con el SQL` is the door — generating nothing here. **A topic with no environment section in §H**
is named honestly when it would rank first ("angular sería lo siguiente; su entorno de práctica aún no
está definido") and the next candidate that has one is proposed instead.

---

## G — The `PROGRESS.md` projection

`## Practice completed` → `### Short exercises — practice/exercises/`, one row per route in `INDEX.md`:

| Cell | Recount, from `ATTEMPTS.md`, `INDEX.md` and the heads of the notes plan the index names |
|---|---|
| `Blocks first-passed` | blocks `In route: yes` whose every concept has a non-`void` `first` row / blocks `In route: yes` |
| `Concepts attempted` | distinct heads of in-route blocks with a non-`void` row / the sum of `Bullets` over in-route blocks |
| `Consolidated` | distinct heads in state *consolidated* (§E) / the same denominator |
| `Owing a fix` | the count of concepts in that state — a number, never a percentage |

The three share cells are written `n/N (p%)`. The grader rewrites the affected row after every run that
appended or changed a history row, and adds the row on a route's first such run. `extra`
rows and orphaned heads enter no cell; the grader's report states how many of each exist. A route with
no table in `INDEX.md` has no row. The legend prose beside the table has no automatic writer.

---

## H — Environment and grading, per topic

A topic is served only when it has a section here. Asked for one that has none, `practice-session` says
so in one line, names the topics that do, and generates nothing. A section is added by hand, under the
recommendation ledger — the environments differ in kind, which is why "adding a topic is only its
route" is false: git needs a throwaway repository whose resulting history is the answer, html and css
need rendering, angular and spring-boot need a small base app with isolated attempts.

### java — junior

- **Shape.** One standalone file per exercise, `ExNN.java`, holding the statement as its opening comment
  block and a compilable skeleton — `public class ExNN` with a `main` — with `// Your answer:` marking
  where he writes. No package line, no build tool, no dependency beyond the JDK.
- **How he runs it.** With the JDK's single-file source launcher, from the batch folder. The agent never
  runs his work.
- **Evidence of execution.** The file is the evidence. Where the statement asks for observable output,
  it prints an `// Expected output:` block, and he pastes what his run printed under a `// My output:`
  comment at the end of the file — the grader compares the two and reads the code either way.
- **Grading.** Static reading of the file against the statement and the concept its row names: does it
  solve the stated task, does it use the concept the exercise exists for rather than route around it,
  would it compile, does `My output` match where one was asked for. Style is feedback, never a failure.
- **Excluded block.** `17 — Maven fundamentals`: its concepts need a real `pom.xml` and a build, not a
  standalone file. `In route: no`. They are practised in the projects, and requested as `extra` they are
  answered in prose or against an existing project's `pom.xml`, never by scaffolding one here.
- **Spring Framework** has no route of its own (`ROADMAP.md` → "Spring Framework — when to start
  (post-job gate)"); the mechanisms Victor already uses are practised inside the spring-boot route when
  that topic gains its section.
