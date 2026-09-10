---
name: coverage-mark
description: >
  Keep the coverage checklist true about what project code proves, in both directions. **Mark** a bullet as
  demonstrated WHENEVER a concept has just been applied in a project, and **repoint or remove a marker whose
  cited code a later change deleted** (`REC-233`) — that second half fires on a change that removes or
  rewrites code in a project already carrying markers, even when it demonstrates nothing new and there is
  nothing at all to mark. Called by the `step-complete` and `backlog-task-close` rituals as their coverage
  sub-step, and directly when Victor asks ("marca esto como visto en el coverage", "esto ya lo hemos
  aplicado en el 07", "mark this bullet as covered", "esa evidencia ya no es cierta"). It writes
  `✅ NN-slug — {evidence}` on the matching bullet in both the topic coverage file and the global mirror —
  the project that proves it, and the one falsifiable clause saying what in it proves it. The two failure
  modes it exists for are a concept applied in a project that leaves no trace on the checklist, and a clause
  left asserting something a reader can open the project and refute. It also sweeps the caller's diff for
  the language and standard-library bullets the task was not about, which nothing else ever marks. **It
  fires mid-step, not only at a close** (`REC-230`): it runs the moment a **verifiable piece** of an open
  step is finished, §1 owning that term's test, because a concept recorded only at the close lives until
  then in conversation memory alone, where a new session cannot reach it. Do NOT use it to add
  new bullets (that is `coverage-bullet-add`, or `/coverage`), to mark something merely studied in notes, or
  inside the `coverage` / `coverage-audit` pipelines — those passes preserve markers, they never author them.
---

# Coverage evidence marking

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


A concept was just **applied in project code**. This skill records that on the coverage checklist — and
keeps the clauses it wrote earlier true as the project moves under them.

**On a `§3c`-only run there is no concept.** The change deleted or rewrote code and demonstrates nothing
new. State the project and what the change removed instead of a concept, then go to §3c, skipping §§1, 2,
2b and 3b — including §2's scaffolding stop, which has no topic to select. **Read §3 even so**: a repoint
writes a clause, and §3's rules are what it writes it under.

**Read `notes/prompts/knowledge/coverage/_internal/_coverage-standard.md`, section "Evidence markers",
and `_topic-ownership.md` before editing anything.** They own the marker's format, preservation
contract, and topic boundary.

This skill only ever *appends a marker to an existing bullet* — and, on the §3c path alone, repoints or
removes a marker of its own that the same project's code has since falsified. It never writes, rewords, or
deletes a **bullet** — authoring belongs to `coverage-bullet-add` (or `/coverage`), and nothing below
changes that; §3c touches the marker and its clause, never the concept sentence. A
concept the **caller passed** with no bullet is that skill's decision, taken minutes ago: name it and
stop. One the **§2b sweep** found was never seen by it, and §2b routes it there rather than reporting it
into a session that ends.

---

## 1 — Establish what was demonstrated, and in which project

State in one sentence the concept and the project's folder name (`NN-slug`, e.g. `07-timetrack`, taken
from `projects/` verbatim). "Demonstrated" has one meaning: **Victor wrote code in that project that uses the concept**. All
of these are *not* demonstrations, and each must be reported as skipped rather than marked:

- the concept appears in a review finding, a backlog task, or a note, but no code was written;
- the concept was explained in session and Victor understood it;
- a **design decision with no code change** — nothing was built, so nothing is demonstrated;
- generated or scaffolded code Victor did not write (a Spring Initializr `application.properties`, an
  `ng generate` skeleton).

A backlog-task fix *is* code Victor wrote, so it does earn the marker.

**What counts as a "verifiable piece", on the mid-step path.** The three skills' triggers name it; this
is its test, and the other two point here rather than restating it. A piece is finished when **Victor has
run something and seen it behave** — the same bar this section already sets for *demonstrated*, applied
to the slice instead of the concept. If nothing can be exercised yet, it is not a piece and the trigger
has not fired; if two slices were only verifiable together and he checked them in one run, they are one
piece. A file saved, a class that compiles, and a commit are none of them pieces.

## 2 — Find the bullet, in the right topic and level

Route the concept to its owning `notes/` topic with **`_topic-ownership.md`**. The test is **altitude, not subject
matter** — the same rule `coverage-bullet-add` applies.

**When a ritual called you — `backlog-task-close` or `step-complete`, either one — reuse the topic that
`coverage-bullet-add` reported in the same run rather than re-deriving it.** **A mid-step piece counts as a
ritual caller here, not as the direct path**: the piece runs the adder and this skill back to back in one
turn, exactly as a close does, so the same reuse applies and so does the "no match" branch below — the
adder ran on that concept minutes ago and its decision stands. The bullet was authored
under that topic; re-deriving here is how a marker goes looking for a bullet in a topic that never
received it, and reports "no bullet exists" for one written minutes earlier.

If that topic's selected Coverage tracker cell has no completed run, stop: its files are scaffolding and
there is no calibrated bullet to mark. Route the concept through `coverage-bullet-add`; the first
`/coverage` run will move any existing adjacent bullet together with its marker.

Open `notes/{topic}/coverage/{junior|middle|senior}.md` for the level in question and grep for the
concept's key symbol, not the wording of the step or task. Then:

- **One clear match** — normal case, proceed.
- **No match** — the concept is not in coverage. **When a ritual called you**, this branch is for the
  concepts it passed: `coverage-bullet-add` ran on every one of them minutes ago and left this one bare
  — declined, routed to `_cross-topic-inbox.md`, or stopped at its scaffolding gate. Report it as
  unmarked, name it, say which of the three, and do not route it back; that re-litigates a decision
  already taken. On the **direct** path no adder ran at all, so treat it exactly as §2b treats a swept
  concept. Never invent the bullet to have something to mark.
- **Several plausible matches** — mark only the bullet whose *concept* the code demonstrates, not every
  bullet in the neighbourhood. A step that used `@Transactional` demonstrates declarative transaction
  boundaries; it does not demonstrate proxy-based annotation behaviour just because the same proxy is
  involved. When two bullets are genuinely both demonstrated, mark both and say so.
- **Already marked** — leave it alone and report the existing marker. First project wins; a later project
  reusing the concept never overwrites it, and this is the expected outcome for common concepts. **Unless
  the same change falsified its clause** — that is §3c's, not this branch's, and this branch must not
  dispose of the bullet before §3c sees it.

If the matching bullet was moved between topics or levels, the complete existing marker must already
have moved verbatim with it. Never remove and recreate the marker **on this path**; report any mismatch as
blocking drift. A §3c repoint is not that mismatch — it rewrites the clause deliberately, and says so.

Cross-level check: if the bullet lives at a level **above** the one Victor is working at, mark it there
anyway and say so — demonstrating a middle-level concept in a junior project is real evidence, and one of
the few honest signals about his trajectory.

## 2b — Sweep the code, not only the lesson

The concepts the caller passed are the ones the **task taught**. They are not the only ones the code
demonstrates, and the gap between the two is lost systematically rather than occasionally: a fix about
brute-force defence is also the first place in the project that builds a `record`, that reads a `Map`
key that may be absent, or that picks a concurrent collection on purpose. Those bullets sit unmarked in
the level file while the code proving them is already committed, and nothing else in the system will
ever look at that diff again.

The failure mode is a checklist that slowly records **what the session talked about** instead of what
the project contains. It is invisible per close and compounding across dozens.

So before reporting, read the diff the caller's work produced and ask of every language construct and
standard-library type it uses: **is there a bullet for this, and is it still unmarked?** **On the mid-step
path that diff is the piece's, not the step's** — the earlier pieces of the same step swept their own
hunks already, and re-reading them is how one `record` gets swept, drafted and reported three times in
one step.

- **Scope it to the diff.** The files the change touched, and the constructs those files actually use.
  This is not a project-wide backfill — that stays a deliberate run Victor asks for.
- **Check the level Victor is on first**, then any other level the caller already routed a concept to.
  A language feature is usually a rung below the concept the task was about.
- **Use is the bar, not mention.** A type named in a comment, an import left behind, or a construct the
  diff deletes demonstrates nothing.
- **Already marked stays marked** — first project wins, and this sweep never rewrites a clause.
- **Report the swept marks as their own rows**, labelled so the caller can see which ones it did not
  pass in. That visibility is the point: a ritual that silently found extra bullets teaches the caller
  nothing about what it was failing to notice.

**A swept concept with no bullet is authored, not reported.** The ritual's authoring step ran *before*
this one and will not run again, so "report it and let the caller decide" hands the finding to a step
that has already closed, and the chat does not survive the session — the same failure
`backlog-task-close`'s "Incidental findings" section already fixed for defects.

- **Draft the bullet before invoking.** Write the sentence as it would appear in the level file, then
  look at it. If what comes out is a method or an API name, it was not a concept — drop it and say so.
  If it reads as something someone at this level must understand, invoke `coverage-bullet-add` with it,
  and mark it here normally. This bar sits **on top of** the adder's step-3 filter, not in place of it:
  **two authored bullets on a large diff is a lot, and zero is the normal result** — a sweep that
  authors freely is how a level file inflates, which is what the older prohibition held.
- **First project still wins.** The construct may pre-date this diff. If you already know an earlier
  project demonstrates it, the marker and its clause name **that** project and say where you saw it;
  never open a search across projects to find out — that is the backfill this skill refuses to start
  mid-ritual, and a marker for the current project would falsely date the first demonstration.
- **Carry back what the adder owes.** If `coverage-bullet-add` reports a `/notes-plan {topic} {LEVEL}`
  remap for the bullet it just wrote, that debt reaches the session only through your §5 report — put it
  in a row of its own. A ritual that never passed the concept in has no other way to learn it exists.

If the sweep finds nothing, say **"nothing further in the diff"** rather than staying silent — an
unstated sweep is indistinguishable from a skipped one. What the diff *took away* is §3c, after the
write rules.

## 3 — Write the evidence clause

The marker says *where*; the clause says **why that project is judged to demonstrate this bullet**. Read
the "Evidence markers" rules in `_coverage-standard.md` for the format; what this step owns is finding the
sentence.

Derive it from the **code**, not from the step or task that produced it. Name the concrete thing a reader
could open and check — the class, annotation, endpoint, query or mechanism:

| Bullet | Good clause | Why the bad one fails |
|---|---|---|
| Constructor injection | `every service takes its collaborators through a single constructor, no @Autowired field anywhere` | ~~`uses constructor injection`~~ — restates the bullet |
| Dynamic query composition | `Specification<TimeEntry> composes the four optional filters on GET /api/entries` | ~~`built dynamic queries`~~ — not checkable |
| Segregation of duties | `approve/reject refuse a manager whose id matches the entry's owner` | ~~`closed a backlog finding about self-approval`~~ — describes the session, not the code |

**If the only honest clause is a restatement of the bullet, stop and say so** rather than padding the
line: it means the code touched the concept without really demonstrating it, and that is worth telling
Victor. Marking it anyway with filler is how the level file stops meaning anything.

## 3b — Append the marker to both files

Append ` ✅ NN-slug — {evidence}` to the end of the bullet, after the concept sentence, nothing following
it. Verbatim identical edit in both:

1. `notes/{topic}/coverage/{LEVEL}.md` — the source of truth.
2. `notes/coverage/{LEVEL}.md` — the global mirror, inside `## {TOPIC}`, same bullet.

Change **nothing else on the line**. Do not rewrite the concept sentence to read better, do not fix a
typo you notice, do not convert the bullet to a checkbox. The bullet's text is another prompt's output;
your write is the marker and only the marker.

Then verify, because a marker landing in one file and not the other is the drift this skill would
otherwise introduce into a diff-verified pair: grep `✅` in the topic file and in the mirror's
`## {TOPIC}` section and confirm the two sets of marked bullets are identical. Report both counts.

## 3c — Repoint or remove what the change falsified

§2b asked what the diff **added**. This asks what it **took away**. A marker written for an earlier piece
of the same step names code a later piece may have just deleted, and the clause then asserts something a
reader can open the project and refute.

**Read `_coverage-standard.md` → "When the marked project's code changes — repoint or remove" before
touching anything.** It owns the rule; what this step owns is finding the candidates cheaply and writing
them safely. It sits after §3b because it *writes clauses*: it needs §3's rules in hand before it acts.

**This step runs even when there is nothing to mark** — a change that only removes code never reaches
§2b's question, and that is precisely the change that falsifies clauses. On that path the preamble named the
project and the change instead of a concept, and §§1, 2, 2b and 3b were skipped — §3 was not.

- **Scope: this project's markers only** — `✅ NN-slug` for the project whose code the change touched.
  Nothing in another project moved.
- **Anchor the candidates to what the change removed, across every topic file at the level.** A deletion
  is not confined to the topic that named it: one deleted Java class can falsify clauses in `java`,
  `architecture`, `general` and `security` at once, and project 07 alone carries markers in twelve junior
  topic files. Grep by **bare identifiers**, never by clause punctuation:

```bash
grep -nE ' ✅ 07-timetrack — ' notes/*/coverage/junior.md | grep -iE 'disable|getRawValue|emitEvent'
```

  The ` — ` in the first pattern excludes bare pre-2026-08-01 markers, which have no clause and are out of
  scope here. Add any level above the one Victor is on where the project has markers. Two or three
  candidates is the normal result and zero is common.

- **Two things this fence misses, and the report must not hide.** A clause written in prose shares no
  token with the diff, so a clean grep means *no candidate in this diff*, never *nothing false*. And a
  clause quantified over the project — "every service…", "no `@Autowired` field anywhere" — is falsified
  by an **addition**: when the change adds a member of the set it quantifies over, that clause is a
  candidate too. Roughly a third of project 07's clauses are quantified this way.
- **Check each candidate against disk, not against memory of the session.** Open the file the clause
  names. It is false only if the code it points at is gone or no longer does what it says.
- **Still demonstrated in this project, elsewhere → repoint.** Rewrite the clause under §3's rules to name
  what demonstrates it now; leave ` ✅ NN-slug` itself untouched.
- **Not demonstrated anywhere in this project any more → remove the marker and its clause**, leaving the
  concept sentence exactly as it was and the bullet in place.
- **You cannot tell without searching the whole project → leave the marker and raise it**, by name, as a
  `[Low]` task in `## Tasks` of the project's `PROJECT-BACKLOG.md`, **in the same turn**, in the standard
  task format with a provenance note. That search is the backfill this skill refuses to start mid-ritual,
  and the report row alone would not survive the session — the failure `REC-230` was filed against, and the
  same channel `backlog-task-close` opens for its own incidental findings. Leaving the marker is the safe
  half; a wrong removal cannot be undone from a chat row either.
- **Never substitute a later project's marker** for one you removed. Another project earns it through §2,
  as the first that demonstrates it now — and if it is already built, nothing will bring it back through
  this skill, so name it as a backfill candidate.
- **Verify every line you edited by comparing the two copies character for character**, not by counting
  markers. §3b's count check is blind here: a repoint that lands different wording in the topic file and
  the mirror leaves both counts identical and both bullets still "marked".
- **Report every candidate you opened, including the ones that survived** — "checked three, all still
  true" is the useful result.

If the change removed no code and added nothing to a quantified set, say **"nothing falsified in the
diff"** and move on.

## 4 — Update the PROGRESS.md coverage table

The `## Coverage demonstrated` table in `PROGRESS.md` is the instrument this marker feeds. A marker
written without refreshing it leaves the table reading lower than reality until the next
`progress-update` run — the same silent-staleness failure the marker itself exists to prevent.

**`progress-update-prompt.md` step D8 owns the table's format, its counting rule, and the `*`
provisional mark. Read D8 and follow it; never restate or re-derive its arithmetic here.** Your job is
narrower: refresh only the cells you just changed.

For each topic+level you marked **or changed under §3c**, **recount — never increment**. Arithmetic on the
old cell silently inherits any error already in it, and a §3c removal makes the numerator **fall**, which
only a recount produces correctly:

```bash
grep -cE '^- ' notes/{topic}/coverage/{LEVEL}.md
grep -cE ' ✅ [0-9]{2}-[a-z0-9-]+' notes/{topic}/coverage/{LEVEL}.md
```

The marker pattern is deliberately **unanchored**: a marker written before 2026-08-01 ends the line, a
newer one is followed by its evidence clause, and both must count. Anchoring it with `$` would silently
count only the old ones and report a collapsed numerator.

Rewrite that one cell, then the level's `**Total**` cell (recount as the sum of the column's
numerators over the sum of its denominators — do not add your delta to the printed total). Change no
other row, and never touch `Professional level by topic`: a rising percentage is not a promotion, per
D7. If the topic has no row, the table predates that topic — say so and stop rather than inventing one.

Only the numerator moves here. If the same run also added a bullet, `coverage-bullet-add` moved the
denominator; one recount after both writes covers them together.

## 5 — Report

One row per concept, inside the calling ritual's report table when there is one:

| Concept | Topic / level | Result |
|---|---|---|
| declarative transaction boundaries | `spring` / junior | marked ✅ 07-timetrack — "every service write method carries `@Transactional`, reads `readOnly = true`" (topic + mirror, 24/139 marked) |
| proxy-based annotation behaviour | `spring` / junior | already marked ✅ 06-hr-portal — left as is, clause not backfilled |
| BOLA on the mutation endpoints | `security` / junior | not marked — no bullet, and this run's `coverage-bullet-add` declined it; named, not re-routed |
| fail-fast manual checks | `spring-boot` / junior | not marked — DECISION, no code change |
| *(swept)* `Records` | `java` / junior | marked ✅ 07-timetrack — the private `Attempts(int, Instant)` carrier — found by the step-2b sweep, not passed in |
| *(swept)* fixed-width numeric formatting | `javascript` / junior | bullet authored via `coverage-bullet-add`, then marked ✅ 03-expense-tracker — `padStart(2, '0')` on the amount fields — already known to be the first project to do it, so the marker is 03's and not this close's |
| *(swept)* `Optional.ofNullable` | `java` / junior | drafted and dropped — the sentence came out as an API name, not a concept |
| *(falsified)* disabled controls and `getRawValue()` | `angular` / junior | clause repointed — `disable()` is gone from `Login`, but the entry form still reads a disabled control with `getRawValue()`; marker ✅ 07-timetrack kept |
| *(falsified)* `emitEvent: false` | `angular` / junior | marker removed — nothing in 07 uses the flag any more; bullet kept, unmarked |
| *(falsified)* componentless parent routes | `angular` / junior | opened and still true — the clause names the route config the change did not touch |
| *(falsified)* constructor injection | `spring-boot` / junior | unresolved — the new `@Autowired` field falsifies "no field anywhere", and deciding it needs a project-wide search; marker left, raised as `[Low]` in `PROJECT-BACKLOG.md` |

Rows the step-2b sweep found carry a `*(swept)*` marker so the caller can see what it did not pass in;
when the sweep found nothing, say so in a row of its own. Rows §3c opened carry `*(falsified)*` and are
reported whatever the outcome.

Include the marked/total count for the level file you touched, and state the PROGRESS.md cell as it
now reads (`spring-boot / junior: 24/139 (17%)`). That number is the point of the whole mechanism, so
it belongs in every report. **When §3c made it fall, say so and why** — a numerator dropping without a
stated cause reads as a bug in the count rather than as the file telling the truth, and every consumer of
a marker delta reads an unexplained move as new demonstrations.

## Commits

`notes/{topic}/coverage/*.md` and `notes/coverage/*.md` are `notes/` study files — covered by the standing
authorization, so **you commit them yourself**, on the active branch, `git status` immediately before the
`add` and before the `commit`.

The commit boundary depends on what this run wrote:

- **Marker only** — one atomic marking commit, separate from an earlier authoring commit.
- **Bullet + marker in the same run** — the calling `step-complete` or `backlog-task-close` ritual folds
  authoring and marking into one coverage commit.
- **A bullet the §2b sweep authored** — it belongs to *this* run, so you carry it: `coverage-bullet-add`
  does not commit on this path. Stage its bullet in both copies, `_run-tracker.md` and `PROGRESS.md`
  alongside your marker — under a calling ritual that is the run's one coverage commit; on the direct
  path you make it yourself.
- **A mid-step piece** — one coverage commit for the piece, made by you, in the **same turn** as the
  piece's work, exactly as on the §2b path: `coverage-bullet-add` does not commit here either, so stage
  its bullet in both copies, `_run-tracker.md` and `PROGRESS.md` alongside your marker. **If the adder
  wrote and you mark nothing** — an inbox proposal, its scaffolding stop, the "no match" branch — you
  still make that commit: a write nobody commits is a `notes/` edit left loose in Victor's tree, waiting
  to be swept into his next `git add`. It is never folded into his commit for the piece: that one carries
  project code and is his to make, and staging a `notes/` file into it crosses the authorship boundary.
  Same turn is the property `REC-230` needs; same commit was never available.

- **A §3c repoint or removal** — same coverage commit as the run's other coverage writes when there are
  any; its own commit when the change demonstrated nothing and §3c is the only reason this skill ran.
- **A §3c unresolved candidate** — the `PROJECT-BACKLOG.md` task is the one project doc this skill writes,
  and it rides in the same commit; the standing authorization already covers that file (`review-audit` has
  committed it since 2026-07-14). Under a calling ritual, hand the row over instead: that ritual is already
  editing the backlog and folds the task into its own write.

```
docs(coverage): mark <concept> as demonstrated in project NN
```

```
docs(coverage): repoint the project-NN markers whose cited code the change removed
```

```
docs(coverage): remove the project-NN markers whose cited code no longer exists
```

`PROGRESS.md` goes **in that same commit** — the table edit is the same logical change as the marker,
and splitting them lets one land without the other.

**Both calling rituals commit their own doc files now** (authorized 2026-07-30 for
`PROJECT-BACKLOG.md`, 2026-08-01 for `PLANNING.md` /
`PROGRESS.md` / `README.md`), so there is no longer any flow that hands coverage commits back to Victor
— the old "in-session `backlog-task-close` hands its commits over" carve-out is gone. His side is the
project code and `practice/`, and nothing this skill writes is either.

## Backfill

**Evidence clauses are never backfilled onto existing markers.** The clause entered the format on
2026-08-01; the ~495 markers written before it stay bare, and that is deliberate — reconstructing why
`01-todo-list` demonstrated a bullet months later invents a memory instead of recording one, and an
invented clause is worse than none because it looks equally checkable. A bare marker is old, not broken.
If a *new* marker lands on a bullet in a file full of bare ones, that is expected; do not "even them up".

**The 01–07 backfill has largely run** — as of 2026-08-04 there are 533 markers across every project
(07 281, 01 92, 05 48, 06 42, 02 32, 04 22, 03 16). Do not open a close by offering it as if it were
pending, and do not read a bare marker, or an unmarked bullet, as proof a project was never backfilled.
How much remains is unknown per project, so a gap noticed in passing is worth **one** sentence naming
the project and the bullet — never a pass started mid-ritual.

Backfill stays a deliberate, project-by-project run, and only when Victor asks for one: for that project,
read its README "What I learned" and its PROGRESS.md entries, and mark what the code actually
demonstrates. Do **not** backfill opportunistically while closing a step — a partial backfill is worse
than none, because a low count then reads as a low-progress signal instead of an incomplete pass.
