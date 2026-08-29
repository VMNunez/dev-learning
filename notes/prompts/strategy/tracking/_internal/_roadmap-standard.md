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
- Applications strategy (July → Fridays only, August → equal priority, September → full push)
- Daily schedule (fixed times — intentional, do not convert to gates)
- GitHub, LinkedIn, and CV
- English — Cambridge First Certificate
- After finding the job — keep growing
- After September — three possible paths

**Living sections** — change as progress is made. These are what the review updates:
- Phase table (status markers ✅ / ⏳ / 🔜)
- Project sequence (which project comes next and why)
- SQL topic table (12:30 block)
- Notes study order (13:30 block)
- Level strategy gates when the target role or demonstrated-level matrix changes

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

Dates are allowed only in:
1. The applications strategy section.
2. The daily schedule header.

If a date appears anywhere else, replace it with a gate condition — a concrete, verifiable state that
is true or false regardless of the date.

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

**12:30 block — SQL topic table.** Kept in sync against the SQL section of `notes/coverage/junior.md`:
- Add any SQL topic present in coverage-junior.md but missing from the ROADMAP table.
- Remove any topic that coverage-junior.md marks as out of scope.
- Status markers (✅ / 🔜) come from the step headings of `practice/sql/junior/PLANNING-junior.md` §2,
  which carry the topic name together with its scored/target counts. **Not from `PROGRESS.md`**, whose
  exercise table is keyed by *file*: it cannot resolve a topic row without the route, and syncing against
  it is how the table drifted in both directions at once — row 1 left at ⏳ with `01-basics.sql` closed
  40/40, JOINs left at ⏳ with `03-joins.sql` deleted and never regenerated.

**13:30 block — Notes study order.** The order must be exactly:
`angular → spring-boot → java → architecture → security → typescript → sql → javascript → css → git`
Confirm ROADMAP's version of this block matches exactly. **If the shared session rules defines a different order,
the shared session rules wins** — update ROADMAP to match it.

**LeetCode gate conditions.** ROADMAP.md has a section listing 5 gate conditions that must all be met
before starting LeetCode. One condition references the notes study order ("notes complete for X
topics"). The topics listed in that gate must match the high-priority topics in the current study
order — angular, spring-boot, java, architecture, and any topics added between architecture and
typescript (e.g. security). If a topic was added in that range and is missing from the gate, add it.
**Do NOT add typescript, sql, javascript, css, or git** — those are lower priority and the gate must
remain reachable before September. Do not change the other 4 gate conditions unless they are
factually wrong — all four resolve against `## Projects`, `Practice completed`, and the level matrix's
`Knowledge consolidation` column, none of which is a concept list.

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
