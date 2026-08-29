# Concept extraction standard — *internal, not runnable*

The shared contract for reading a project's `PLANNING.md` and working out **which steps are complete**
and **which concepts those steps teach**. It has two readers, and they do not use the same halves:

| Reader | Runs | Why |
|---|---|---|
| a **project-audit subagent** dispatched by `progress-update-prompt.md` | **Steps 0, 1, 2** and the first half of Step 5 | it audits the step status; the concepts have no destination in that pipeline (see Step 4) |
| the **`step-complete` skill**, in session | **Step 3** | it needs the field discipline — which line of a step actually holds its concepts — and routes them to the coverage checklist |

You never launch this file directly. If you are the dispatched subagent, your launch instruction names
the steps you run; do not run the others.

**What a dispatched subagent must NOT do:**
- Do **not** read anything beyond this standard and the project's `PLANNING.md` — not the project's
  code, README, or any other file. Everything you need is in the PLANNING.md.
- Do **not** read or write `PROGRESS.md`, and do **not** accept any part of it — a quoted cell, a step
  count, a status string — from your launch instruction either. That file is what your report is
  audited against, so a fact taken from it is a fact being checked against itself.
- Do **not** commit anything. Report; the orchestrator decides what the report means.

**What the orchestrator gives you** (in your launch instruction):
- `PROJECT_PATH` — the project to audit (e.g. `projects/07-timetrack`). That is the whole input.

> **Tombstone — `PROGRESS_HINT`, removed 2026-08-13 (`REC-136`). Do not restore it.** It was the
> `Status` cell of this project's row in PROGRESS.md, quoted verbatim, and Step 2 below let it
> **override** the `✅` markers whenever it claimed more completed steps. That status went back to
> `progress-update`'s D5, whose whole job is to audit that same cell — so on the override path the
> audited file supplied the fact used to audit itself, and the comparison agreed by construction. It
> cost D5 exactly one of its two declared outcomes: "a plan missing a `✅` is a `PLANNING.md` fix" is
> the case the override silently resolved, so that drift row could never be written. D6 states the rule
> in one line — measure "never from the file you are auditing". The orchestrator holds the row already;
> comparing it against the markers is *its* step, not yours. *(An earlier correction, 2026-08-05, had
> already fixed what the hint pointed at: a `### Project NN` heading class deleted from PROGRESS.md on
> 2026-08-03.)*

---

## Step 0 — Read the whole file, verifiably

The Read tool loads **2000 lines by default and truncates longer files silently** — no error, no
warning. A truncated PLANNING.md makes you report an incomplete step status and miss the last steps'
concepts with full confidence. So, before anything else: check the file's line count (`wc -l`). If it
is near or over 2000, read it in passes with `offset` until you reach the real end. Either way,
**state in your report the total line count and that you read to EOF** — that line is the
orchestrator's proof your extraction saw the whole plan.

## Step 1 — Identify the PLANNING.md format

`PLANNING.md` files use three formats depending on when the project was created. Read the file and
decide which one applies before extracting anything:

- **Format A** — has a **"Key patterns introduced"** table (`| Pattern | Where used |`), no numbered
  Section 3. Angular projects 01–06.
- **Format B** — has a **"Progressive learning plan"** where each step carries a `**New concepts:**`
  line, no numbered Section 3. Project 07 and any project without a Section 3.
- **Format C** — has a numbered **Section 3 ("New concepts")** table
  (`| Concept | Topic | Why this project teaches it |`) plus a **Section 15** learning plan whose
  steps list which Section 3 concepts they introduce. Projects 08+.

---

## Step 2 — Determine which steps are complete

**Format A** — every project handed to you in Format A is already Done ✓. All patterns count.

**Format C** — read Section 15. Steps marked ✅ are complete. If the project is Done ✓ (all steps ✅),
every Section 3 row counts.

**Format B** — decide the completed steps like this:
1. Look for step headings marked ✅ (e.g. `### Step 3 — Spring Security + JWT ✅`). A **split step**
   marks its children (`#### Step 7a … ✅`) and the parent stays unmarked until every child has one,
   so read the sub-step level too.
   - **At least one ✅ present:** those ✅ steps are the step status, and they are its **only**
     source. Steps without ✅ are not complete.
   - **No ✅ anywhere:** the status is **not derivable from the markers**, and you say so. The
     markers are the only source this audit takes — a §0 pointer or a §22 branch table is written by
     the same ritual and is not read here — and the only file that would otherwise settle it is the
     one this audit exists to check. An unmarked plan is a finding for the orchestrator, never a gap
     for you to fill.
2. The step marked "in progress" is **not** complete.

Record the confirmed step status as a short string — e.g. `Steps 1–3 done, Step 4 in progress` or
`all steps complete` — and return it with its derivation. Formats B and C derive from the markers, so
their note is `(from ✅ markers)`; Format A derives from the format itself, so its note is
`(from Format A — every Format A project is Done ✓)` and no marker is read. When **Format B** carries
no marker anywhere, return `not derivable — no ✅ markers in PLANNING.md` **in place of** the Format B
status. In every branch, never substitute a step count from another source, and never report a plan as
further along than its markers say. The orchestrator compares what you return against the projects
table — a comparison that means nothing if your side of it came from that table.

---

## Step 3 — Extract the concepts from completed steps

**This step's live reader is the `step-complete` skill**, which runs it in session for the one step it
is closing and routes what it finds to the coverage checklist. A `progress-update` subagent does
**not** run it — see Step 4 for why that consumer disappeared.

- **Format A:** every row of "Key patterns introduced" is one concept. Also scan "Key features" and
  "State management" — they sometimes name patterns (e.g. `localStorage + effect()`,
  `computed()` for derived values) not listed in the patterns table.
- **Format B:** for each completed step, take the concepts from its **`**New concepts:**` line — that
  is the field every step carries, and it is the primary source.** Two neighbouring fields exist and
  are not interchangeable with it:
  - `**Concept learned:**` — a *retrospective addendum*, written after the step was built, on the
    minority of steps where what the code taught diverged from what was planned (project 07 has it on
    2 steps of 11). When a step has one, extract it **in addition to** `New concepts:` — it is the
    richer source, and it names things the plan did not anticipate. Never treat its absence as the
    step having no concepts.
  - `**Review concepts:**` — concepts *re-applied* from an earlier step, not introduced here. Never
    extract these: the concept already entered the record when the step that introduced it closed.
- **Format C:** for each completed step in Section 15, take its "New concepts introduced" list, which
  references Section 3 rows.

Write each concept as **one specific thing**, key syntax in backticks; never group two concepts in one
line. A completed step whose extraction comes back empty is a defect in the plan, not a step with no
concepts — say so rather than reporting nothing.

---

## Step 4 — Tombstone: routing a concept to a PROGRESS.md section

**Removed 2026-08-05. Do not restore it, and do not route concepts with it.**

This step held a mapping table that tagged every extracted concept with the PROGRESS.md section it
belonged to — Angular, CSS, TypeScript, Java, Spring, Spring Boot, Architecture, Security, Deployment,
General, SQL. **Every one of those sections was deleted from PROGRESS.md on 2026-08-03**, when the
per-technology concept lists were removed as a second, evidence-free copy of the coverage files. The
table routed to nothing for two days short of two months, and its "Format C shortcut" cited
`_planning-standard.md` §3's controlled vocabulary for a list that file no longer holds: §3 was
re-anchored on 2026-08-05 to the 13 `notes/` topic folders that own a `coverage/{level}.md` — which
**adds** Angular Material, JavaScript and Git and **drops Deployment** ("build and hosting concepts are
General"). So the invalid-value flag this step told you to raise had inverted: it would have fired on
three legitimate topics and waved through the one that is no longer valid.

**Where routing happens now:** a concept is routed **by altitude** to its owning `notes/` topic by the
`coverage-bullet-add` skill, using `_topic-ownership.md`. That skill already carries an explicit
warning not to reuse this table. A concept has exactly one destination — the coverage checklist — and
`PROGRESS.md` is never it.

---

## Step 5 — Report back

**If you are a `progress-update` subagent** (Steps 0–2), return these three items and nothing else:

1. **Read verification:** the PLANNING.md's total line count and confirmation you read to EOF (Step 0).
2. **Format detected:** A / B / C.
3. **Confirmed step status:** the short string from Step 2 with the derivation note its format owns —
   or, on the Format B no-marker branch, `not derivable — no ✅ markers in PLANNING.md`, which is a
   complete report, not a failed one.

Return no concept table, no PLANNING.md excerpts and no reasoning trace — those three lines are the
entire report.

**If you are `step-complete`** (Step 3), the concepts stay in your own context for your coverage and
README sub-steps; there is no report contract here to satisfy. The shape is one concept per line, key
syntax in backticks:

| Concept (key syntax/API in backticks) | From step |
|---------------------------------------|-----------|
| `@PreAuthorize("hasRole('X')")` | Step 4 |
