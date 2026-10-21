# Roadmap standard — the invariants a good ROADMAP.md obeys

This is the **shared standard** for `ROADMAP.md`. It is **internal, not runnable** — it holds no
configuration and does nothing on its own. One prompt reads it:

- `roadmap-review-prompt.md` reads it to update `ROADMAP.md` (the doer steps reference these rules
  instead of re-printing them, and its reviewer subagent verifies every invariant here).

Keeping the stable contract here once means the prompt body stays a thin orchestrator and the rules
can never drift between the doer and its reviewer. The prompt adds only its own *flow* (read state →
gap analysis → update living sections → apply → independent review) on top of this standard.

---

## What each file is for

- `notes/coverage/junior.md` — the **global junior mirror**: the complete cross-topic statement of what
  Victor must learn **and of what he has already demonstrated**. The sources of truth are the topic
  files `notes/{topic}/coverage/junior.md`; this pipeline enumerates from the mirror under
  `_coverage-standard.md`, "When a prompt may read a mirror instead of the topics", which is why
  subagent 2a must quote the validator's parity line before it produces a gap list. It carries every
  concept needed for a junior Angular + Spring Boot role at a Spanish consultancy,
  each bullet carrying a `✅ NN-slug` evidence marker once a project proves it. **An unmarked bullet is the
  gap.** The rules — both marker forms, the drill marker that does not count, demonstration never study —
  are in `notes/prompts/knowledge/coverage/_internal/_coverage-standard.md`, "Evidence markers".
- `PROGRESS.md` — SOURCE OF TRUTH for **status**: which project is active and at what phase, the
  demonstrated professional level per topic with its next gate, the share of coverage marked, and how much
  practice is done. It is **not an inventory of concepts** — the per-technology concept lists were deleted
  on 2026-08-03 as an evidence-free duplicate of the coverage files. Never ask it which concepts are
  covered; ask the markers.
- `notes/prompts/_internal/_shared-context.md` — SOURCE OF TRUTH for the **facts about Victor and the
  market**: the profile, the target companies, the Spanish hiring process, and the AI factor. That
  file's own header owns the fence and `_coverage-standard.md` states its coverage half; what belongs
  here is the consequence — ROADMAP builds strategy on those facts and never becomes a second statement
  of them.
- `ROADMAP.md` — the forward-looking strategy: the path from where he is to where he needs to be,
  through projects and study blocks. It **references** the other three — it does not repeat them.

ROADMAP.md answers: "given what I know now and what I still need to learn, what is the plan?" It is
not a concept list and it is not a progress tracker.

---

## What ROADMAP.md contains

Two types of content.

**Stable strategic sections** — define context, objectives, market, and hiring strategy. Written
once. Only change if something is factually wrong — **and a passage that restates
`_shared-context.md` counts as factually wrong the moment the two disagree**, which is not a
hypothetical: the internship stack and the length of the HR call already read differently in the two
files. Three of the bullets below have a section of the same subject there and are where this bites
first — *Who you are and where you stand*, *The market you are targeting*, *The AI factor* — together
with *The hiring process at Spanish consultancies*, which is listed separately here but in `ROADMAP.md`
is a block **inside** the market section, so it is edited there. They keep their headings and carry the
**strategic reading** — what the fact means for the plan — while the fact itself is referenced, exactly
as PROGRESS and coverage are referenced under "No duplication" below. That rule is file-wide, so these
four are the likely sites and never a boundary on it. **`What most increases your probability of being
hired` is the exception, and it is exempt by its *ordering*, not by its contents**: the ranking is
ROADMAP's own, exists nowhere else, and `_session-rules.md` routes "what makes a strong junior in 2026"
here — never cut it to a pointer. Individual facts inside those items (the internship, the testing
stacks) do come from `_shared-context.md` and are checked like any other.
- Who you are and where you stand
- The market you are targeting
- The AI factor — how it changes the market
- What most increases your probability of being hired
- The hiring process at Spanish consultancies
- Applications strategy — **applications run every day, from now**, in the job-search block (Victor,
  2026-10-20; `_session-rules.md` → "Daily study blocks"), so the section stages them by no month, no
  weekday and no phase, and what makes an application strong is stated as what to bring to it, never as
  a minimum that holds one back. No other section stages applications either — the phase table
  included. Until 2026-10-21 this item mandated the June plan's calendar (July → Fridays only, August →
  equal priority, September → full push), which every later ruling had overtaken, and listed after it an
  `After September — three possible paths` section the file no longer had (`REC-392`)
- Daily schedule — **a pointer, never a copy**: the day is `HORARIO.md` §1's, in the `Documents/main`
  folder above this repository, and what the system serves in each programming block is
  `_session-rules.md` → "Daily study blocks"'s. The section names both and restates no hour, no block
  order, no block count and no block's content; it carried the June day's table of hours until
  `REC-392`
- GitHub, LinkedIn, and CV
- English — Cambridge First Certificate
- After finding the job — keep growing

**Living sections** — change as progress is made. These are what the review updates:
- Phase table — its status markers (✅ / ⏳ / 🔜), and its two block columns, which follow the block
  sections they project
- Project sequence (which project comes next and why)
- SQL topic table and the screening floor (SQL block)
- Technical test simulations — their own section: the strategy, the target and the pointer to the
  simulation track
- Notes study order (interview-prep block)
- Level strategy gates when the target role or demonstrated-level matrix changes

**No section heading carries an hour, and the block sections carry these headings** — each named by
what is done in it, as `_session-rules.md` → "Daily study blocks" names the blocks: `## Daily schedule`,
`## Project block — active project`, `## SQL block — SQL exercises`, `## Technical test simulations`
and `## Interview-prep block — spaced review and notes`. `roadmap-review-prompt.md` cites them by name,
so they change only together with it; the SQL prompts cite the SQL section by its content instead. Until `REC-392` the three block sections were headed by
the June day's hours, and the simulations sat inside the SQL one as its `Stage 2`.

## Level-aware sequencing

Before employment, ROADMAP prioritises a demonstrated junior full-stack baseline. Project, exercise,
simulation, and study choices must close open junior gates from PROGRESS.md before importing middle
scope. Backend specialisation is a post-job or evidence-triggered direction: Spring Boot, Java, SQL,
Architecture, and Security may advance first once the role shows which depth matters, while frontend
topics can remain maintained at demonstrated junior.

Middle and senior are responsibility levels, not syllabus-completion badges: middle needs autonomous
feature or service ownership, and senior needs production/platform or multi-team ownership.

ROADMAP references the level matrix but never copies its per-topic statuses. PROGRESS owns current
level; ROADMAP owns the strategy resulting from it.

---

## Gate-based sequencing — project sections never use dates

Project phases are structured as sequential goals: "first do X; when X is done, start Y." Calendar
dates do NOT belong in project milestone sections — they become stale and create false pressure.

Dates are allowed only in the applications strategy section — the date of a ruling or a market fact
(when consultancies open junior calls), never a calendar phase that stages applications. If a date appears anywhere else, replace it with a gate condition — a concrete, verifiable state
that is true or false regardless of the date. **A clock time is allowed nowhere**: the day is
`HORARIO.md`'s, so an `HH:MM` in this file is always a stale copy of it, and it is cut, leaving the
block's name. (The daily schedule header was the second place a date was allowed until `REC-392` made
that section a pointer.)

Examples of correct gate language:
- ❌ "Finish backend by June 14" → ✅ "Backend gate: login returns a JWT; Postman confirms a protected
  endpoint rejects requests without a token"
- ❌ "CV rule: update in July" → ✅ "Update CV when project 07 is live on GitHub with a README that
  includes at least one architecture decision"

Rules for project sections:
- Sequential gate language only: "complete project 07, which covers X and Y; then start project 08 to
  cover A and B"
- No calendar dates in project milestones — ever
- New candidates must be full-stack (Spring Boot + Angular + PostgreSQL), testable, and buildable in
  2–4 weeks of full-time study

---

## Canonical study-block references

**SQL block — SQL topic table.** Kept in sync against the SQL section of `notes/coverage/junior.md`:
- Add any SQL topic present in coverage-junior.md but missing from the ROADMAP table.
- Remove any topic that coverage-junior.md marks as out of scope.
- Status markers (✅ / ⏳ / 🔜) come from `practice/sql/junior/PLANNING-junior.md`. A row is a coverage
  heading, answered by every step whose §2 `**Coverage:**` line names it, and its marker is read off
  those steps' `Status` in §3: ✅ when all are `closed ✅`, 🔜 when all are `not started`, ⏳ otherwise
  — and 🔜 for a heading no `**Coverage:**` line names yet. **Never from a scored count** — *scored* is graded at any verdict (`_sql-plan-standard.md`
  invariant 3), so a fully scored step can still be open — and never from a §2 step heading, whose
  counts no grading run updates. **Not from `PROGRESS.md`** either, whose
  exercise table is keyed by *file*: it cannot resolve a topic row without the route, and syncing against
  it is how the table drifted in both directions at once — row 1 left at ⏳ with `01-basics.sql` closed
  40/40, JOINs left at ⏳ with `03-joins.sql` deleted and never regenerated.

**SQL block — the screening floor.** Under the SQL table the section names the test-relevant topics —
JOINs · GROUP BY/aggregates · subqueries/CTEs · NULL handling · DML basics — as the ones the SQL route
puts first, because they are what consultancy tests ask, with window functions, indexes and PostgreSQL
specifics after them; and it says the full table still gates LeetCode. **The floor is a priority, never
a switch**: the SQL block stays SQL exercises on every day it runs, so the section names no stage the
block moves on to — no `Stage` label on the SQL topics or on LeetCode — and no reduced cadence for the
topics after the floor. It was the switch condition
that opened `Stage 2` until `REC-392`, once `HORARIO.md` §1 had moved the timed simulations out of the
SQL block and given each area's first one its own gate (Victor, 2026-10-21).

**Technical test simulations — their own section.** `## Technical test simulations` sits outside the SQL
section and is no stage of any block: a simulation may take the exercise and project blocks together
(`HORARIO.md` §1). It carries three things and nothing else: **the strategy** — why timed tests matter
for a consultancy application; **the target** — the minimum number of simulations that marks the
technical stage prepared, with its per-track split, a number that is ROADMAP's own and that holds no
application back; and **a pointer to the simulation track** — when a simulation is due is the level
route's and `_practice-standard.md` §F's to state, never this section's, and its procedure is the
track's: `/simulation-plan` builds the level route that decides which tests are admissible, in what
order and with what time limit, `simulation-block-open` opens a block (read-only — it never starts the
timer) and states the attempt conditions, and `simulation-grade` is the only door to a review that
records anything. It never restates what that track owns: a gate or a pace, which specs exist or how many
are on disk, a test's time limit or attempt rules, or how to ask for a review — and it puts no SQL topic,
SQL stage or switch condition in front of the simulations. And it never tells Victor to open a spec file
directly or to have a solution reviewed outside `simulation-grade` — a spec opened that way skips the
route's readiness check, the per-spec SQL fence included, and a review requested that way records
nothing. A passage that does either is cut to the pointer. Until `REC-392` this was `Stage 2 — Technical
test simulation`, inside the SQL section, opened by the screening floor above.

**Interview-prep block — Notes study order.** The order must be exactly:
`angular → spring-boot → java → architecture → security → typescript → sql → javascript → css → git`
Confirm ROADMAP's version matches exactly. **If the shared session rules defines a different order,
the shared session rules wins** — update ROADMAP to match it. The section carries that order and a
pointer at how the block runs — the spaced review, with the notes it needs (`_session-rules.md` →
"Daily study blocks" and "The spaced review of the question banks") — and **no stages**: notes are opened
inside the block when a question fails or a topic is new, not studied first, and applications have a
block of their own, so a `Notes → Interview prep → CV and applications` sequence is the June day's and is
cut.

**LeetCode gate conditions.** ROADMAP.md has a section listing 5 gate conditions that must all be met
before starting LeetCode. One condition references the notes study order ("notes complete for X
topics"). The topics listed in that gate must match the high-priority topics in the current study
order — angular, spring-boot, java, architecture, and any topics added between architecture and
typescript (e.g. security). If a topic was added in that range and is missing from the gate, add it.
**Do NOT add typescript, sql, javascript, css, or git** — those are lower priority and the gate must
stay reachable. Do not change the other 4 gate conditions unless they are
factually wrong — all four resolve against `## Projects`, `Practice completed`, and the level matrix's
`Knowledge consolidation` column, none of which is a concept list. **LeetCode has no block in the day**
(`_session-rules.md` → "Daily study blocks"), so the passage names no block it replaces or leaves fixed:
once the five gates are met, where LeetCode goes is a change to `HORARIO.md`, which is Victor's.

**Phase plan — the two block columns.** The phase table's columns are `Project`, `SQL` and
`Interview prep` — named by block, never by hour (`Project (08:00)`, `SQL → Practice (12:30)` and
`Interview prep (13:30)` until `REC-392`). The `SQL` and `Interview prep` cells say where each block is
expected to stand during a phase. They are a projection of the two block sections, never a second
statement of them: a cell may name the topics in hand, and it never carries an order that block's own
section does not state. Two checks, over every row not yet ✅ — a ✅ row describes a phase that is over,
and these two checks leave it as it stands:
- **SQL.** A cell names SQL topics and nothing else — never a simulation, which has its own section and
  is no stage of the SQL block, and never LeetCode, which has no block. A cell that carries one has it
  removed, and a row left naming no topic — for that or any other reason — reads `Remaining SQL
  topics`. No row puts a topic outside the
  screening floor — `Remaining SQL topics` included — in an earlier phase than the row that completes
  the floor.
- **Interview prep.** Notes topics appear down the rows in the canonical study order above: no topic sits in an
  earlier phase than one the order puts before it, and none is skipped between two that are listed — a
  ✅ row's topics count as listed, though that row is not edited. A skipped topic joins the cell of the
  listed topic the order puts directly before it, or the first row not yet ✅ where that cell is in a ✅
  row; a listed topic is never deleted to close the gap. A cell carries no stage (`Interview prep (es/)
  started`, `full focus`) — the block is the spaced review from the start — so a stage is cut, and a
  cell left naming no notes topic reads `Spaced review`.

Where a cell and its block section disagree, the section wins and the cell is the one corrected. The
table predates the condition it now has to match — its row 3c read "Remaining SQL topics → technical
test simulation" five minutes before the condition under the SQL table moved to the test-relevant
topics, and nothing re-read it (`REC-310`).

---

## No duplication

No content in ROADMAP.md duplicates `PROGRESS.md`, `notes/coverage/junior.md`, or
`notes/prompts/_internal/_shared-context.md` word-for-word — reference them instead. **The third one is
the one this rule was missing**: the profile, the target-company list, the hiring stages and the AI
factor are that file's, and a second copy here is what the prompts downstream read instead of the
source. Against `_shared-context.md` the check is about **facts** — a restated fact is cut to the
strategic consequence plus a pointer, and where the two already disagree the source wins and this file
is the one that changes. ROADMAP is a forward-looking strategy document, not a concept list and not a progress
tracker. If a passage restates a concept list already owned by coverage-junior.md, or a status table owned
by PROGRESS.md (the level matrix, the projects table, the practice counts), cut it and point to the source
file. PROGRESS.md no longer owns any concept list, so against that file this check is about **tables**, not
concepts.
