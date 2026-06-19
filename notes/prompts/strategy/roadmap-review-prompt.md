# Roadmap Review Prompt

Use in a **separate conversation**. No configuration to fill in — paste the whole prompt into a new chat as it is.

This prompt updates `ROADMAP.md` so it shows the optimal path from current progress to full coverage of `notes/coverage.md` — through projects, study blocks, and practice. Run it whenever a project finishes, `notes/coverage.md` changes significantly, or it has been a while since the last check.

---

````
I want you to review and update ROADMAP.md so it shows the optimal path from my current
progress to full coverage of everything in notes/coverage.md — through projects, study
blocks, and practice.

Before starting, read CLAUDE.md — it has my full profile, target job, daily schedule,
teaching rules, and how the prompts connect to each other.

---

## What each file is for

- `notes/coverage.md` — SOURCE OF TRUTH for what I must learn. Every concept needed for
  a junior Angular + Spring Boot role at a Spanish consultancy.
- `PROGRESS.md` — SOURCE OF TRUTH for what I have already learned. Project status,
  completed steps, and concepts covered so far.
- `ROADMAP.md` — the forward-looking strategy: the path from where I am to where I need
  to be, through projects and study blocks. It references the other two — it does not
  repeat them.

ROADMAP.md answers: "given what I know now and what I still need to learn, what is the
plan?" It is not a concept list and it is not a progress tracker.

---

## What ROADMAP.md contains

Two types of content:

**Stable strategic sections** — define context, objectives, market, and hiring strategy.
Written once. Only change if something is factually wrong:
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

**Living sections** — change as progress is made. These are what this prompt updates:
- Phase table (status markers ✅ / ⏳ / 🔜)
- Project sequence (which project comes next and why)
- SQL topic table (12:30 block)
- Notes study order (13:30 block)

---

## Gate-based sequencing — project sections never use dates

Project phases are structured as sequential goals: "first do X; when X is done, start Y."
Calendar dates do NOT belong in project milestone sections — they become stale and create
false pressure.

Dates are allowed only in:
1. The applications strategy section.
2. The daily schedule header.

If a date appears anywhere else, replace it with a gate condition — a concrete, verifiable
state that is true or false regardless of the date.

Examples of correct gate language:
- ❌ "Finish backend by June 14" → ✅ "Backend gate: login returns a JWT; Postman confirms
  a protected endpoint rejects requests without a token"
- ❌ "CV rule: update in July" → ✅ "Update CV when project 07 is live on GitHub with a
  README that includes at least one architecture decision"

---

## Step 1 — Read the current state

Read in this order:

1. `notes/coverage.md` — every concept required for the target job. This is the target.
2. `PROGRESS.md` — what projects are done and what concepts are already covered. This is the
   actual. The projects table is the source of truth for which project is active and at
   what phase.
3. `ROADMAP.md` — the current plan: strategic context, phase table, project sequence, and
   study block tables.
4. The active project's `PLANNING.md` — the single source of truth for what that project
   builds and learns. Find the active project from PROGRESS.md's project table. If ambiguous,
   run `git branch` to identify the active project-level branch (pattern: `projects/0X-name`
   or `angular/0X-name`; feature branches `feat/...` are sub-branches and do not identify
   the project on their own).

Today's date is available in the session context — use it to judge which applications strategy
phases (July, August, September) are past, current, or still ahead.

---

## Step 2 — Gap analysis

Compare `notes/coverage.md` (the target) against `PROGRESS.md` (the actual).

Identify which concepts are still uncovered: present in coverage.md but not yet in PROGRESS.md.
Group by topic, following the order in coverage.md:
Angular → Angular Material → Spring Boot → Java → Architecture → Security → TypeScript →
JavaScript → SQL → CSS → Git → General.

Filter to what actually comes up in junior Angular + Spring Boot interviews at Spanish
consultancies. Skip: CQRS, event sourcing, JVM tuning, Kubernetes internals, Angular
zone.js internals, algorithms beyond basic data structures.

This gap list drives Steps 3 and 4.

---

## Step 3 — Update the project sequence

The project section of ROADMAP.md must answer: which project comes next and which specific
gaps from Step 2 does it close?

Important: ROADMAP.md describes projects at a HIGH level — what each one covers and its gate
condition. The detailed step plan lives in each project's PLANNING.md, generated by
`new-project-prompt.md`. ROADMAP only needs the summary and the gate.

**For each project:**

**Completed (✅):** Condense to a 2-line summary — what it covered and what the gate
condition was — and link to PLANNING.md for the full step history. Remove any step-by-step
breakdown. Do not keep both the summary and the steps.

**Current (⏳):** Confirm the gate condition is concrete and verifiable. Confirm the project
description still matches PLANNING.md scope. If PLANNING.md changed scope since the last
update, fix ROADMAP to match it.

**Next (🔜):** Check the candidate list — does at least one candidate address the most
significant uncovered gaps from Step 2? If a significant gap has no candidate that covers it,
add a new project idea to the candidate list.

**Rules for project sections:**
- Sequential gate language only: "complete project 07, which covers X and Y; then start
  project 08 to cover A and B"
- No calendar dates in project milestones — ever
- New candidates must be full-stack (Spring Boot + Angular + PostgreSQL), testable,
  and buildable in 2–4 weeks of full-time study

---

## Step 4 — Check the study block tables

**12:30 block — SQL then practice:**
Compare the SQL topic table in ROADMAP against the SQL section of `notes/coverage.md`.
- Add any SQL topic present in coverage.md but missing from the ROADMAP table.
- Remove any topic that coverage.md marks as out of scope.
- Status markers (✅ / 🔜) must match what PROGRESS.md shows.

**13:30 block — Notes then interview prep:**
The study order must be:
`angular → spring-boot → java → architecture → security → typescript → sql → javascript → css → git`
Confirm ROADMAP's version of this block matches exactly. If CLAUDE.md defines a different
order, CLAUDE.md wins — update ROADMAP to match.

---

## Step 5 — Check the stable sections

Do NOT reword, restructure, or improve stable sections. Only touch them if something is
factually wrong — for example, a project listed as future when it is already complete, or
a technology listed as not yet learned when it clearly appears in PROGRESS.md.

If a fact is wrong, fix the specific sentence. Nothing else.

Do a literal scan of ROADMAP.md for month names (January through December) and year patterns
(2025, 2026). For every match: if it is inside the applications strategy section or the
daily schedule header, it is intentional — leave it. If it is anywhere else, convert it to
a gate condition and note it in the changes table.

---

## Step 6 — Apply the updates

Edit ROADMAP.md directly. After every change, verify:

- No calendar date in a project milestone, gate condition, or "CV rule" — only in the
  applications strategy section and the daily schedule header
- No content duplicates PROGRESS.md or coverage.md word-for-word — reference them instead
- The active project has a concrete, verifiable gate condition
- Each future project in the sequence names which specific coverage.md gaps it closes
- The file reads as a forward-looking strategy document, not a concept list

---

## Step 7 — Report

**Changes made:**

| Section | Change | Why |
|---------|--------|-----|
| ... | ... | ... |

**Remaining knowledge gaps** — concepts in coverage.md not yet in PROGRESS.md, grouped by
topic. Max 3 per topic. Focus on what interviewers at NTT Data, Capgemini, and similar
companies actually ask junior Angular + Spring Boot candidates.

**New project candidates added** — list only candidates added in Step 3 that were not in
ROADMAP before this review. For each: project name, what it covers technically, which gap
it closes, and one sentence on why a recruiter at a Spanish consultancy would value it.
If no candidates were added, write either "No new candidates — existing candidates cover all
significant gaps" or list which gaps remain uncovered by any candidate.

**Pace check:** given the remaining gaps, the current project gate, and the applications
timeline (July Fridays → August equal priority → September full push), name the one gate
most at risk. If the pace looks tight, propose one concrete trade-off.

If any phase was newly promoted to ✅ in this review, add this reminder:
"Phase X is now closed — if a project also finished, update PROGRESS.md's project table and
CLAUDE.md's 'Current study progress' section too, per CLAUDE.md's instructions."

Commit message — one command per block:

```

git add ROADMAP.md

```

```

git commit -m "docs: update roadmap — <one-line summary of main changes>"

```

````
