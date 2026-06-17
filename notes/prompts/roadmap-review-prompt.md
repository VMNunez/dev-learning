# Roadmap Review Prompt

Use in a **separate conversation**. No configuration to fill in — paste the whole prompt into a new chat as it is.

This prompt checks that `ROADMAP.md` is accurate and complete: phase status matches real progress, the SQL/notes/testing tables match `notes/coverage.md`, and nothing has drifted out of sync with `PROGRESS.md` or `CLAUDE.md`. Run it whenever a phase ends, a project finishes, `notes/coverage.md` changes, or it has just been a while since the last check.

---

```
I want you to review ROADMAP.md and update it so it reflects my real, current situation.

Before starting, read CLAUDE.md — it has my daily schedule, teaching rules, the study order
for notes/, and the gates (testing rules, LeetCode gates). My profile and career target are in
ROADMAP.md under "Who you are and where you stand" — read it there.

---

## What ROADMAP.md is — and what it is not

ROADMAP.md is the forward-looking strategy document: phases, daily schedule, market analysis,
hiring process, applications strategy, GitHub/LinkedIn checklist, English prep, post-job growth.
It answers "given everything I know now, what is the plan and where am I in it."

It is NOT:
- A chronological log of concepts learned — that is PROGRESS.md
- A per-topic checklist of what must be known — that is notes/*/coverage.md and notes/coverage.md
- A duplicate of either — if a fact already lives in PROGRESS.md or coverage.md, ROADMAP.md
  should reference it, not repeat it

Do not let this review turn ROADMAP.md into a concept list. Its job is status and plan, not detail.

**Gate-based sequencing — project sections never use dates:**
Project phases are structured as sequential goals: "first do X; when X is done, start Y."
Calendar dates do NOT belong in project milestone sections — they create false pressure and
become stale the moment they pass without being met.

Dates are allowed only in these places:
1. The applications strategy section (July → Fridays only, August → equal priority, September → full push).
2. The daily schedule header and schedule notes (e.g. "fixed from June 2", "Friday rule from July").
3. Any section that is explicitly about when to apply for jobs — not about when a technical goal is met.

If a date appears anywhere else — a project milestone, a "hard deadline", a "CV rule: update in
Month X" — replace it with a gate condition that is true or false regardless of the date.

Examples of correct gate language:
- ❌ "Hard deadline June 14: backend demonstrable" → ✅ "Backend gate: login endpoint returns a valid JWT, one protected endpoint rejects requests without a token — testable in Postman"
- ❌ "CV rule: update in July" → ✅ "Update CV when project 07 is live on GitHub with a README that includes at least one architecture decision"

---

## Step 1 — Read the current state

Read, in this order. If you need detail on what a specific completed project was supposed to teach, its PLANNING.md is the source (e.g. `projects/07-timetrack/PLANNING.md` or `angular/06-hr-portal/PLANNING.md`) — but PROGRESS.md is the summary, so start there.

1. `ROADMAP.md` itself — the current plan, as written.
2. `CLAUDE.md` — the "Current study progress" section, the daily schedule, the current project,
   and any gates (e.g. testing rules, LeetCode gates).
3. `PROGRESS.md` — the project status table and which project step is currently in progress.
4. `notes/coverage.md` — the global merged coverage file. This is the **target**: everything
   I am supposed to learn. `PROGRESS.md` (read in step 3) is the **actual**: what I have
   learned so far. Comparing the two is how you find real gaps — coverage.md alone only says
   what is required, PROGRESS.md alone only says what is done; the gap between them is what
   ROADMAP's plan should be steering me toward next. Use this comparison to check:
   - whether the SQL stage table (topics, gates) matches the SQL section of coverage.md
   - what specific knowledge gaps remain: concepts in coverage.md not yet reflected in
     PROGRESS.md; then check whether the project 08 candidate list addresses those gaps;
     if gaps exist that no candidate covers, flag them — they become input for the project
     proposals in Step 5
5. Simulation progress — check `PROGRESS.md` first (that is the preferred tracker); if no
   simulations section exists there yet, check `simulations/TRACKER.md`. Compare actual count
   and type split against the minimum target stated in ROADMAP.md. If no simulations have been
   done at all, flag it explicitly — applying before completing any simulations is a readiness
   gap that the applications phase gate should reflect.
6. `PLANNING.md` of the currently active project (e.g. `projects/07-timetrack/PLANNING.md`, or
   the relevant `angular/0X-project-name/PLANNING.md` if an Angular-only project is active).
   PLANNING.md is the single source of truth for that project's scope and step order — confirm
   ROADMAP's description of "what it covers" for the active project still matches it. If
   PLANNING.md changed (steps added, removed, or reordered), ROADMAP is now stale.
7. Current branch (`git branch --show-current`) — to confirm which project is active. Use this
   only if PROGRESS.md's project table is ambiguous about whether a project has just finished
   or a new one has just started.

Today's date is available in the session context — use it to judge whether the applications
strategy dates (July, August, September) are still in the future or already active. If a date
has already passed or is now active, add a note in the changes table flagging that the phase
is now live — but do not edit the applications strategy section itself.

---

## Step 2 — Find drift

Compare what ROADMAP.md claims against what the other files show. Look specifically for:

- **Status markers (✅ / ⏳ / 🔜) that no longer match reality** — a phase whose goal is clearly
  met according to CLAUDE.md or PROGRESS.md, but is still marked 🔜 or ⏳ in ROADMAP.
- **Gate conditions met but phase not promoted** — if a phase is marked ⏳ or 🔜 but PROGRESS.md
  and CLAUDE.md show its gate conditions are clearly met, promote it to ✅; do not wait for a
  calendar date to confirm it. If the gate conditions are only partially met, leave the marker
  and add a short note on what is still missing.
- **Date scan** — do a literal search of ROADMAP.md for month names (January through December)
  and year patterns (2025, 2026). For every match found: if it is inside the applications
  strategy section or the daily schedule header, it is intentional — leave it. If it is anywhere
  else (a project milestone, a "hard deadline", a "CV rule"), convert it to a gate condition.
  List every match found in the changes table, even those left unchanged.
- **SQL gate table mismatches** — topics marked 🔜 in ROADMAP that coverage.md/PROGRESS.md show
  as done, or the reverse.
- **LeetCode gate drift** — the five gate conditions listed in ROADMAP's LeetCode section must
  match what CLAUDE.md defines. If CLAUDE.md's gate list changed, update the table.
- **Next-project gap list staleness** — gaps listed as uncovered that the current project or
  coverage.md now show as addressed. Decide per gap: keep, reword, or remove.
- **Simulation count drift** — ROADMAP stores the minimum target gate (15 simulations, 5 per
  type) — this is a gate definition, not a counter. Do not copy the actual count from PROGRESS.md
  into ROADMAP. The drift check is: confirm the gate definition still makes sense given what
  PROGRESS.md and simulations/TRACKER.md show. If no simulations have been done at all, confirm
  that the applications phase gate makes clear this block is not yet enterable.
- **Project scope mismatches** — ROADMAP's description of what the active project covers must
  match its `PLANNING.md`. If `PLANNING.md` changed scope, ROADMAP's project section is stale.
- **Any statement in ROADMAP that contradicts CLAUDE.md's "Current study progress" section** —
  CLAUDE.md is the source of truth; flag the conflict and fix ROADMAP.
- **13:30 block stage mismatch** — CLAUDE.md defines three stages for this block: notes first,
  then interview prep, then CV/applications. Check that ROADMAP's description of this block
  matches that order exactly. If ROADMAP skips the notes stage or shows a different sequence,
  fix it.

---

## Step 3 — Decide what to update vs. leave alone

- ROADMAP's stable strategic sections (market analysis, AI factor, hiring process, applications
  strategy, GitHub/LinkedIn checklist, English prep, post-job growth) are reference material.
  Touch them only if something in them is now factually wrong — not to reword or "improve" them.
- The phase table, daily schedule status, SQL stage table, and project 08 planning section are
  the living parts — these are what usually drift and deserve the closest attention.
- When updating project sections, convert any remaining calendar dates to gate conditions.
  A gate is a concrete, verifiable state: "login returns a JWT and Postman confirms it" is a
  gate; "done by June 14" is not. The applications strategy section and the daily schedule
  header are the two places where dates are intentional — do not convert those to gates.
- Never duplicate content that already lives in PROGRESS.md or coverage.md. Reference it with a
  short cross-reference line instead, the same way CLAUDE.md points to other files rather than
  repeating their contents.
- When a project section is marked ✅ — whether promoted in this review or already marked — and
  its step-by-step breakdown has not been condensed yet, condense it now: replace the detail
  section with a 2-line summary (what it covered and what the gate condition was) and link to
  PLANNING.md for the full step history. Remove the step-by-step breakdown. Do not keep both.

---

## Step 4 — Apply the updates

Edit ROADMAP.md directly. Do not just describe the changes — write them. For every change made,
confirm:

- Status markers reflect whether each phase's gate conditions are met, as verified against
  PROGRESS.md and CLAUDE.md — not the calendar date.
- No fact in ROADMAP.md contradicts CLAUDE.md or PROGRESS.md.
- The currently active project section has a concrete, verifiable gate — a specific testable
  condition (e.g. "login returns a JWT and Postman confirms it"), not a vague phrase like
  "when the project is done" or a calendar date.
- New gaps revealed by a coverage.md update are reflected in the project 08 planning section;
  if no existing candidate covers a significant gap, add a new project idea to the candidate list.
- The file stays a forward-looking plan, not a growing concept list.

---

## Step 5 — Report and remind

Print a short table of what changed:

| Section | Change | Why |
|---------|--------|-----|
| ... | ... | ... |

**Pace check:** given the phases still marked ⏳/🔜 and today's date, estimate whether the
remaining work fits the time before September. If the pace looks tight, name the specific
critical-path gate that is most at risk, and propose one concrete trade-off Victor could make
(e.g. reduce project 08 scope, cut a non-essential coverage topic, start applications earlier).

Also print a gap analysis summary:

**Knowledge gaps found** — concepts in coverage.md not yet in PROGRESS.md, filtered to what
actually comes up in junior Angular + Spring Boot interviews at Spanish consultancies.
Group by topic, max 3 gaps per topic.

Include: reactive forms, HTTP/interceptors, JWT flow, JPA relationships (OneToMany, ManyToOne),
REST conventions, SQL JOINs/GROUP BY/subqueries, route guards, lazy loading, Angular lifecycle
hooks, error handling patterns, DTO design.

Skip: advanced design patterns (CQRS, event sourcing), JVM tuning, Kubernetes internals,
streams/lambdas theory, Angular zone.js internals, LeetCode-style algorithms.

**New project candidates added** — list only the candidates added to ROADMAP.md in Step 4
(those that were not in the candidate list before this review). For each one, include: project
name, what it covers technically, what gap it closes, and one sentence on why a recruiter at
NTT Data or Capgemini would recognise it as valuable. If Step 4 added no new candidates, either
write "No new candidates added — existing candidates cover all significant gaps" (if true), or
"No new candidates added — the following gaps are not covered by any existing candidate:
[list them]" if uncovered gaps remain.
Only propose projects that are full-stack (Spring Boot + Angular + PostgreSQL), testable, and
realistic to build in 2–4 weeks of full-time study.

If a phase was closed out for the first time (newly marked ✅), remind me:
"Phase X is now closed — if this also means a project finished, update PROGRESS.md's project
table and CLAUDE.md's 'Current study progress' section too, per CLAUDE.md's instructions."

Then show the commit message so I can run it myself. One command per code block:

```

git add ROADMAP.md

```

```

git commit -m "docs: update roadmap — <one line summary of main changes>"

```
