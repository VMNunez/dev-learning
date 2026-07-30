---
name: coverage-bullet-add
description: >
  Decide whether a concept just applied in project code already exists on the coverage checklist, and
  author its bullet if it does not — called by the `step-complete` and `backlog-task-close` rituals as
  their coverage authoring sub-step, and directly when Victor asks ("añade esto al coverage", "esto no
  está en el coverage del junior, escríbelo", "add a coverage bullet for this"). It routes the concept to
  its owning `notes/` topic by altitude, searches the level file, writes the bullet in both the topic file
  and the global mirror when it is missing, and reports the `/notes-plan` remap the new bullet owes while
  flagging that debt in `_run-tracker.md` so it outlives the session. The
  failure mode this exists for is a concept a project taught that never enters the curriculum: the code
  ships, the checklist still says "never studied", and the coverage file slowly stops describing what
  Victor actually knows. Do NOT use it to append the `✅ NN-slug` evidence marker (that is `coverage-mark`), to
  add scope for something merely studied in notes, to write `notes-plan-{LEVEL}.md` or touch its
  `Coverage SHA-256`, or inside the `coverage` / `coverage-audit` / `coverage-verify` pipelines — those
  own bulk authoring and must not be second-guessed bullet by bullet.
---

# Coverage bullet authoring

A concept was just applied in project code. This skill answers one question — **is it on the checklist,
and if not, does it belong there?** — and writes the bullet when the answer is yes.

**Read `notes/prompts/knowledge/coverage/_internal/_coverage-standard.md` before editing anything.** It
only auto-loads inside the `/coverage` pipeline, so an inline edit without it breaks the file's contract.
It owns the topic-ownership list, the bullet format, and the section-placement rule; this skill applies
that standard, it does not restate or override it.

This skill is the authoring half of a pair. The marking half is `coverage-mark`, which appends the
`✅ NN-slug` evidence marker to a bullet that already exists. Keep them separate: **this skill never writes a
marker, and `coverage-mark` never writes a bullet.** The calling ritual runs both.

---

## 1 — Route the concept to its owning topic

Do not reuse a PROGRESS.md routing here. The calling ritual may have already routed the concept with the
**Step 4 mapping table** in `_concept-extraction-standard.md`, but that table routes to a **PROGRESS.md
section**, and this skill needs the **`notes/` topic that owns the concept**. The two vocabularies do not
match. `notes/` topics are currently `angular`, `angular-material`, `architecture`, `css`, `general`,
`git`, `java`, `javascript`, `security`, `spring-boot`, `sql`, `typescript`, while the mapping table folds
several of those into one section — its "Spring annotation / bean / **security** / JPA → Spring Boot" row
is the one that bites, because followed literally it files an access-control concept under `spring-boot`
when `notes/security/` owns it.

**The authority is the topic-ownership list in the standard's "Topic isolation" section** ("Security owns
threats and defences; Angular/Spring Boot keep concrete client/server integration"). Read that block and
apply it literally.

The test it encodes is **altitude, not subject matter**. The technology-neutral topics (`security`,
`architecture`, `general`) own the concept — what a thing is, which threat it answers, which boundary it
draws. The technology topics (`spring-boot`, `angular`, `java`, `sql`, `typescript`, `css`,
`angular-material`) own its concrete application in that stack. The same subject legitimately appears in
two topics at two altitudes, and that is **not** duplication:

- "what a JWT is, and what a signature protects against" → `security`; "issuing and validating a JWT in a
  Spring filter chain" → `spring-boot`.
- "BOLA — a client reaching another user's object by changing an id" → `security`; "`@PreAuthorize` on the
  mutation endpoints" → `spring-boot`.
- "grouping by a display name merges two distinct rows" (database behaviour) → `sql`; "the same aggregate
  expressed as JPQL with `@Query`" → `spring-boot`.

What must never happen is the *same altitude* written twice. A framework class name in the bullet
(`AccountStatusUserDetailsChecker`, `SecurityFilterChain`) is decisive evidence it is the technology
topic's, however security-flavoured the subject is.

The `## Closed` ledger in the active project's `PROJECT-BACKLOG.md` is the precedent to match — past
closes routed BOLA and segregation of duties to `security`, and DRY to `architecture`. Say in your report
which topic you chose and why.

## 2 — Search the level file

Open `notes/{topic}/coverage/{junior|middle|senior}.md` for **the level Victor is currently working at** —
check which, never assume. Grep the concept's **key symbol, not the wording of the step or task**: the
coverage file names concepts, not fixes.

Search the **sibling topic** too when the routing in step 1 was a close call. The concept may already be
covered there, which settles the ownership question for you.

**If it is already covered:** say so and name the exact bullet. Nothing to write; return. This is the
common case and it is a *good* outcome — it means the project exercised the curriculum rather than
exposing a hole in it. Do not reword the existing bullet to match the project's vocabulary.

**If it is missing:** continue to step 3.

## 3 — Author the bullet

Two rules from the standard that inline edits break most often, restated because they are the whole point
of reading it:

- **Concepts, not conduct.** A bullet describes *what someone at this level must understand*, never *what
  Victor did in a project*. Write "declarative transaction boundaries — a service method that performs
  several writes needs them to commit or roll back as one unit"; never "added `@Transactional` to
  `TimeEntryService.submit()`". A bullet naming a project, a step, a class from Victor's code, or a past
  tense verb is conduct and fails review.
- **Placement.** It goes under the existing section its subject belongs to, in that section's voice and
  bullet shape. Do not open a new section for a single concept, and do not append to the end of the file.

Also from the standard, and load-bearing here: no concept may appear in more than one of `junior.md`,
`middle.md`, `senior.md`. Before writing, grep the other two levels of the same topic for the concept — if
it is already there at another level, the bullet exists and this is a level question, not a gap.

If the concept genuinely belongs to a **level above** the one Victor is on, add it there and say so — that
is a signal about his trajectory, not a mistake.

**When the concept belongs to another topic, do not author it there yourself.** The standard is explicit:
route a proposal under that topic's heading in
`notes/prompts/knowledge/coverage/_internal/_cross-topic-inbox.md`, never straight into its file. Report
that you did.

## 4 — Mirror the bullet, and verify

Three artifacts hold a coverage concept. This skill owns exactly two of them, and they are
byte-identical copies, so there is no judgment to delegate:

1. `notes/{topic}/coverage/{LEVEL}.md` — the canonical file, written in step 3.
2. `notes/coverage/{LEVEL}.md` — the global mirror. Same bullet, verbatim, same relative position, inside
   `## {TOPIC}`; the topic file's `##` section headings appear here demoted to `###`.

Then verify, because landing the bullet in one file and not the other is worse than not landing it: sort
the canonical file's bullets and the mirror's `## {TOPIC}` bullets and `diff` them — they must be
identical sets. **Report the count.**

If that surfaces *other* missing bullets — drift predating this concept — say so and treat it as its own
decision. Do not silently fold someone else's drift into this write.

## 5 — Update the PROGRESS.md coverage table

A new bullet raises that level's denominator, so the `## Coverage demonstrated` table in `PROGRESS.md`
now overstates the demonstrated share until it is recounted. Refresh it in the same run that wrote the
bullet.

**`progress-update-prompt.md` step D8 owns the table's format, its counting rule, and the `*`
provisional mark. Read D8 and follow it; never restate or re-derive its arithmetic here.** Refresh only
the cells you changed.

For each topic+level you wrote to, **recount — never increment**:

```bash
grep -cE '^- ' notes/{topic}/coverage/{LEVEL}.md
grep -cE ' ✅ [0-9]{2}-[a-z0-9-]+$' notes/{topic}/coverage/{LEVEL}.md
```

Rewrite that one cell and the level's `**Total**` cell (recount the column, do not add your delta to
the printed total). Change no other row, and never touch `Professional level by topic` — adding scope
lowers a percentage without anything having been unlearned, and that must not read as a demotion.

Two cases that are **not** table updates: a concept already covered (nothing was written, so nothing
moved), and a proposal routed to `_cross-topic-inbox.md` (no bullet exists yet in the other topic).
Say so rather than editing.

Unlike `coverage-mark`, you never move the numerator: a new bullet starts unmarked, even for a concept
the project just demonstrated. `coverage-mark` marks it immediately afterwards, and one recount after
both writes covers the two.

## 6 — Report the `/notes-plan` remap, never perform it

**Do not touch `notes/{topic}/coverage/notes-plan-{LEVEL}.md`, and do not touch its `Coverage SHA-256`.**

Assigning a bullet to a chapter is not bookkeeping — `notes-plan-prompt` dispatches a **cold pedagogical
reviewer** for it, and gives every entry the full contract from `_note-quality-standard.md`: the
`Must answer:` questions, prerequisites, handoff, and route validation. Reproducing that by hand from a
"which coverage section is it under" heuristic substitutes a shortcut for a reviewed judgment and skips the
contract outright. That is not a token saving, it is worse output at the same price.

The stale SHA is the **correct end state**: it is the signal that the plan owes a remap. Never overwrite it
to make the mismatch go away — the hash certifies which coverage bytes the plan was mapped against, so
forging it leaves the plan incomplete and destroys the only mechanism that could detect it.

**Instead, report that `/notes-plan {topic} {LEVEL}` is owed.** That prompt is a reconciliation pass
designed to be re-run: it reports added / removed / regrouped / preserved-complete entries, and a
`refined` entry that gains bullets keeps its freeze and collects them under `Pending additions:` rather
than being reopened. Two practical notes for the report:

- **Batch it.** One run per affected topic+level at the *end* of the session, not one per bullet. Several
  concepts touching the same topic and level are still a single owed run.
- If no `notes-plan-{LEVEL}.md` exists for that level, **nothing is owed at all** — that level's notes have
  never been planned, so there is no plan to remap. Say so; it is not a defect.

## 7 — Record the debt in the run tracker

A report in the chat dies with the conversation. `notes/prompts/_internal/_run-tracker.md` is where Victor
reads what the prompt system owes him, and it records **runs that happened**, not **runs that are owed** —
so a topic whose `Plan` cell says `completed` reads as up to date the moment after a bullet made it stale.
Close that gap in the same run, or the batched `/notes-plan` survives only as long as the session does.

Only when step 6 concluded a run **is** owed: in the `Per-topic prompts` table, find the topic's row and its
`Plan J|M|S` column for the level you wrote to, and **append** to the cell:

```
 · ⚠ stale YYYY-MM-DD (+N bullets)
```

Rules, all of which exist because this cell already holds something worth keeping:

- **Append, never overwrite.** The execution record underneath is the only trace that the plan ever ran;
  replacing it to show a debt destroys the thing the debt is measured against.
- **Recount `N`, do not increment blindly.** If the cell is already flagged, this run raises the existing
  count and updates the date to today — one flag per cell, never two.
- **Never clear a flag.** `notes-plan` rewrites the whole cell when it runs, which removes it. A flag
  cleared by anything else is a debt hidden rather than paid.
- **No plan, no flag.** If step 6 found no `notes-plan-{LEVEL}.md`, nothing is owed, so nothing is
  recorded — an empty `Plan` cell already reads as pending and needs no help.
- **A bullet routed to `_cross-topic-inbox.md` flags nothing.** No bullet landed in that topic's file, so
  its plan still maps the whole checklist. The proposal is the other topic's decision to make.

`coverage-mark` has no equivalent step and must not grow one: evidence markers are excluded from the
coverage digest, so marking a bullet owes no remap at all.

---

## Commits

`notes/{topic}/coverage/*.md` and `notes/coverage/*.md` are `notes/` study files, covered by the standing
authorization — **you commit them yourself**, on the active branch. Apply the hygiene rule: `git status`
immediately before the `add` and immediately before the `commit`, so no project code file is staged
alongside a doc file.

One atomic commit for the authoring, kept **separate** from `coverage-mark`'s marking commit unless the
same run both wrote the bullet and marked it — in which case the calling ritual folds them into one:

```
docs(coverage): add <concept> to <topic> <level>
```

`PROGRESS.md` goes **in that same commit** — the table edit is the same logical change as the bullet.
When the calling ritual hands its commits to Victor rather than running them (the in-session
`backlog-task-close` rule), hand this one over too instead of committing behind it.

`_run-tracker.md` goes in that same commit as well. The stale flag is a consequence of the bullet, not a
separate change, and splitting them lets a crash between the two commits leave a bullet on file with its
debt unrecorded — the exact failure step 7 exists to prevent. It lives under `notes/prompts/`, so it is
covered by the same standing authorization.

## Report

One row per concept, folded into the calling ritual's report table when there is one:

| Concept | Topic / level | Result |
|---|---|---|
| declarative transaction boundaries | `spring-boot` / junior | already covered — no write |
| BOLA via object id substitution | `security` / junior | bullet added under "Access control" + mirror, 141/141 match |
| Material overlay token theming | `angular-material` / middle | added one level up — above Victor's current level, flagged |
| structured logging with correlation ids | `general` / junior | not authored — proposal routed to `_cross-topic-inbox.md` |

Always include: the topic you chose **and why** (the altitude argument, one clause), the mirror diff count,
and whether `/notes-plan {topic} {LEVEL}` is owed — and when it is, confirm the tracker cell now carries the
stale flag. "Owed" reported without the flag written is a half-done run: it is the chat-only report that
step 7 exists to replace.
