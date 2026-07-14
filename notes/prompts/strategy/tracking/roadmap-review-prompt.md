# Roadmap Review Prompt — orchestrator

Run this **inside Claude Code** (it dispatches subagents; a plain chat cannot run it). No
configuration to fill in — paste the whole prompt into a fresh Claude Code chat as it is.

This prompt updates `ROADMAP.md` so it shows the optimal path from current progress to full coverage
of `notes/coverage.md` — through projects, study blocks, and practice. Run it whenever a project
finishes, `notes/coverage.md` changes significantly, or it has been a while since the last check.

> **▶ Run first:** `progress-update` — the Step 2 gap analysis reads `PROGRESS.md` directly; a stale one produces wrong results.

It runs as an **orchestrator**: two cold fact-gathering subagents feed a doer (the gap analysis and
the active project's PLANNING.md summary — so neither `coverage.md` nor a PLANNING.md ever loads into
the doer's own context), the doer applies the edits, then two cold reviewer subagents run in sequence
— one mechanical (ROADMAP + standard only) and one cross-file — each independently verifying its own
invariants and fixing any it finds violated. That reviewer tail is the point of the design — the
verification always runs instead of being skipped at the end of a long single context, and each
reviewer loads only the files its checks actually need.

**Prerequisite:** PROGRESS.md must be current before running this prompt — the gap analysis in Step 2
reads it directly. If you have finished a project or significant study sessions since the last
PROGRESS.md update, run `progress-update-prompt` first. A stale PROGRESS.md will make the gap analysis
produce wrong results.

**Internal piece this orchestrates** (never launched directly):
`_roadmap-standard.md` — the stable ROADMAP contract (what each file is for, what ROADMAP contains,
gate-based sequencing, the canonical study-block references, no-duplication). The doer references it
instead of re-printing the rules; the reviewers verify against it.

---

````
I want you to review and update ROADMAP.md so it shows the optimal path from my current
progress to full coverage of everything in notes/coverage.md — through projects, study
blocks, and practice.

You are the **orchestrator**. In Step 2 you launch two cold fact-gathering subagents (gap analysis +
active-project summary) so `notes/coverage.md` and the PLANNING.md never load into your own context;
you (the doer) apply the edits in Steps 3–5 from their reports; then in Step 6 you launch two cold
reviewer subagents, one after the other, that independently verify and fix the result. Finish with
the report and the commit blocks.

First read `notes/prompts/strategy/tracking/_roadmap-standard.md` — the stable ROADMAP contract this
prompt is built on. Every "per `_roadmap-standard.md`" reference below points there.

Then read `notes/prompts/_shared-context.md` (my profile, target job, and the market). CLAUDE.md
(daily schedule, study order) is already loaded into your context by Claude Code — do not re-read it.

`ROADMAP.md` is the forward-looking strategy — the path from where I am to where I need to be. It
references `notes/coverage.md` (what I must learn) and `PROGRESS.md` (what I have learned); it does
not repeat them. What each file is for, what ROADMAP contains (stable vs living sections), and the
gate-based sequencing rules are all defined in `_roadmap-standard.md` — read them there before
editing.

---

## Step 1 — Read the current state (doer — only what the merge itself needs)

Read only these two — coverage.md and the active PLANNING.md are gathered by subagents in Step 2,
never by you:

1. `PROGRESS.md` — what projects are done and what concepts are already covered. This is the
   actual. The projects table is the source of truth for which project is active and at
   what phase.
2. `ROADMAP.md` — the current plan: strategic context, phase table, project sequence, and
   study block tables.

Identify the active project from PROGRESS.md's project table. If ambiguous, run `git branch` to
identify the active project-level branch (pattern: `projects/0X-name` or `angular/0X-name`; feature
branches `feat/...` are sub-branches and do not identify the project on their own).

Today's date is available in the session context — use it to judge which applications strategy
phases (July, August, September) are past, current, or still ahead.

---

## Step 2 — Fan out two cold fact-gathering subagents

Launch **both** `general-purpose` subagents in a single message so they run in parallel
(`run_in_background: false`; they only read). Wait for both reports before Step 3.

**Subagent 2a — gap analysis.** Its instruction:

> Read `notes/coverage.md` (the target: every concept required for the job) and `PROGRESS.md` (the
> actual: what is already learned). Identify which concepts are still uncovered: present in
> coverage.md but not yet in PROGRESS.md — treat a concept as covered if PROGRESS.md has an
> equivalent entry even with different wording. If you are **not sure** whether an entry really
> covers a concept, do NOT silently drop it — list it in a separate "borderline" group with one
> line saying which PROGRESS.md entry might cover it; a hidden gap is worse than a doubtful one.
> Group by topic, following the order in coverage.md:
> Angular → Angular Material → Spring Boot → Java → Architecture → Security → TypeScript →
> JavaScript → SQL → CSS → Git → General.
>
> Filter to what actually comes up in junior Angular + Spring Boot interviews at Spanish
> consultancies. Skip: CQRS, event sourcing, JVM tuning, Kubernetes internals, Angular zone.js
> internals, algorithms beyond basic data structures.
>
> Also return, verbatim, the SQL topic list from coverage.md's SQL section (topic names + any
> in/out-of-scope markers) — the doer needs it to reconcile a table without opening coverage.md.
>
> Return **only**: (1) the uncovered-concept list, one line per concept, grouped by topic; (2) the
> borderline group (may be empty); (3) the SQL topic list. No excerpts of covered material, no
> reasoning trace.

**Subagent 2b — active project summary.** Its instruction:

> Read `«active project path»/PLANNING.md` — the single source of truth for what that project builds
> and learns. Return **only**: (1) a 3–5 bullet summary of the project's scope (what it builds, main
> stack pieces); (2) the step list with each step's completion status; (3) the current step's done
> condition, verbatim — the doer uses it to confirm the ROADMAP gate is concrete and verifiable.
> Do not return full step descriptions or code.

The 2a gap list drives Steps 3 and 4; the 2b summary replaces reading PLANNING.md yourself.
Borderline concepts from 2a are NOT gaps for planning purposes (do not add project candidates for
them) — carry them into the Step 7 report so Victor resolves them, marked `(borderline)`.

---

## Step 3 — Update the project sequence

The project section of ROADMAP.md must answer: which project comes next and which specific
gaps from Step 2 does it close?

Important: ROADMAP.md describes projects at a HIGH level — what each one covers and its gate
condition. The detailed step plan lives in each project's PLANNING.md, generated by
`plan-audit.md`. ROADMAP only needs the summary and the gate.

**For each project:**

**Completed (✅):** Condense to a 2-line summary — what it covered and what the gate
condition was — and link to PLANNING.md for the full step history. Remove any step-by-step
breakdown. Do not keep both the summary and the steps.

**Current (⏳):** Confirm the gate condition is concrete and verifiable. Confirm the project
description still matches the PLANNING.md scope as reported by subagent 2b. If the scope changed
since the last update, fix ROADMAP to match it.

**Next (🔜):** Check the candidate list — does at least one candidate address the most
significant uncovered gaps from Step 2? If a significant gap has no candidate that covers it,
add a new project idea to the candidate list.

**Stale candidate removal:** For each candidate already in the list, check whether all the
gaps it was designed to close are now covered by completed projects in PROGRESS.md. If a
candidate's primary coverage areas are all already covered and it adds no uncovered gap,
remove it from the list. Note each removal in the changes table with the reason.

Project-section rules (sequential gate language, no calendar dates ever, new-candidate
requirements) are defined in `_roadmap-standard.md` — follow them.

**Phase table:** After updating the project sections, also update the phase table at the
top of ROADMAP.md. Each row corresponds to a phase — promote it to ✅ if its gate
conditions are clearly met per PROGRESS.md, mark it ⏳ if it is the active phase, and
🔜 if it has not started. Do not leave a phase marked ⏳ if PROGRESS.md shows its goals
are already complete.

---

## Step 4 — Check the study block tables

Update the three study-block sections to match the canonical values in `_roadmap-standard.md`
("Canonical study-block references"):

**12:30 block — SQL then practice:** reconcile the SQL topic table against the SQL topic list that
subagent 2a returned from coverage.md (add missing topics, remove out-of-scope topics, sync ✅ / 🔜
markers to PROGRESS.md).

**13:30 block — Notes then interview prep:** confirm the notes study order matches the canonical
string exactly; if CLAUDE.md differs, CLAUDE.md wins.

**LeetCode gate conditions:** verify the topics in the study-order gate condition match the
high-priority topics per the standard (angular, spring-boot, java, architecture, and any topic added
between architecture and typescript such as security). Do not add typescript, sql, javascript, css,
or git. Do not change the other 4 gate conditions unless they are factually wrong per PROGRESS.md.

---

## Step 5 — Apply the updates

Edit ROADMAP.md directly, as **targeted in-place edits** (one edit per change) — never rewrite the
whole file; wholesale rewrites waste output and risk silently dropping stable sections.

Do NOT reword, restructure, or improve stable sections (per `_roadmap-standard.md`, "What ROADMAP.md
contains"). Only touch them if something is factually wrong — for example, a project listed as future
when it is already complete, or a technology listed as not yet learned when it clearly appears in
PROGRESS.md. If a fact is wrong, fix the specific sentence. Nothing else.

After applying the edits, do a quick self-check against `_roadmap-standard.md`:
- No calendar date in a project milestone, gate condition, or "CV rule" — only in the applications
  strategy section and the daily schedule header.
- No content duplicates PROGRESS.md or coverage.md word-for-word — reference them instead.
- The active project has a concrete, verifiable gate condition.
- Each future project in the sequence names which specific coverage.md gaps it closes.
- The file reads as a forward-looking strategy document, not a concept list.

Do not treat this self-check as the final word — Step 6 verifies it independently.

---

## Step 6 — Two independent reviewer subagents (sequential)

Launch **two cold `general-purpose` subagents, one after the other** (`run_in_background: false` —
never in parallel: both fix ROADMAP.md directly, and concurrent edits to the same file conflict).
They have none of your context — each re-derives its judgements from the files alone, which is
exactly why they catch what a long single context skips. Each loads only the files its own checks
need. Wait for both before writing the report.

**Reviewer 1 — mechanical invariants** (reads only `_roadmap-standard.md` and `ROADMAP.md` — it must
NOT open PROGRESS.md or coverage.md; its checks don't need them). Its instruction:

> You are an independent reviewer. Read `notes/prompts/strategy/tracking/_roadmap-standard.md` (the
> ROADMAP contract), then the freshly edited `ROADMAP.md`. Read nothing else. Verify each invariant
> below **from scratch** — do not trust that the edits are correct. For each violation, **fix it
> directly in ROADMAP.md**, then report what you changed and why.
>
> 1. **Stray-date scan.** Do a literal scan of ROADMAP.md for every month name (January–December) and
>    year pattern (2025, 2026, …). For each match: if it is inside the applications strategy section
>    or the daily schedule header, it is intentional — leave it. Anywhere else, convert it to a gate
>    condition (per the standard's ❌→✅ examples) and log it.
> 2. **Notes study order.** The 13:30 study order equals the canonical string in the standard exactly:
>    `angular → spring-boot → java → architecture → security → typescript → sql → javascript → css → git`
>    (CLAUDE.md is normally already in your context; if not, read its "Daily study blocks" section.
>    If its order differs from the standard, CLAUDE.md wins).
> 3. **LeetCode gate topics.** The study-order gate condition lists exactly the high-priority topics
>    per the standard (angular, spring-boot, java, architecture, security if added in that range) and
>    does NOT list typescript, sql, javascript, css, or git.
>
> Report **only** a short table of `Invariant | Verdict (pass / fixed) | What you changed` — no file
> excerpts, no reasoning trace. If everything passed with no fixes, say so explicitly.

**Reviewer 2 — cross-file consistency** (launch only after Reviewer 1 has finished). Its instruction:

> You are an independent reviewer. Read `notes/prompts/strategy/tracking/_roadmap-standard.md` (the
> ROADMAP contract), then read the freshly edited `ROADMAP.md`, `PROGRESS.md`, and `notes/coverage.md`.
> Verify each invariant below **from scratch** — do not trust that the edits are correct. For each
> violation, **fix it directly in ROADMAP.md**, then report what you changed and why.
>
> 1. **No duplication.** No passage duplicates PROGRESS.md or coverage.md word-for-word — it must
>    reference them instead. Cut any restated concept list and point to the source file.
> 2. **Future projects (🔜) name their gaps.** Every future project in the sequence names which
>    specific coverage.md gaps it closes. If one does not, add the gap mapping (compute it from
>    coverage.md vs PROGRESS.md).
> 3. **Active project (⏳) gate.** The active project has a concrete, verifiable gate condition — a
>    state that is true or false regardless of the date. If it is vague or date-based, rewrite it as a
>    gate.
> 4. **SQL table.** The SQL topic table matches the SQL section of coverage.md (no missing topic, no
>    out-of-scope topic) and its ✅ / 🔜 markers agree with PROGRESS.md.
> 5. **Phase-table markers agree with PROGRESS.md.** Each phase row is ✅ only if PROGRESS.md shows its
>    goals complete, ⏳ only for the active phase, 🔜 if not started. Fix any marker that disagrees.
>
> Report **only** a short table of `Invariant | Verdict (pass / fixed) | What you changed` — no file
> excerpts, no reasoning trace. If everything passed with no fixes, say so explicitly.

Fold both reviewers' fixes and findings into the report below.

---

## Step 7 — Report

**Changes made:**

| Section | Change | Why |
|---------|--------|-----|
| ... | ... | ... |

Include both the doer's edits (Steps 1–5) and the two reviewers' fixes (Step 6) in this table.

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

ROADMAP.md is tracked and lives on `main` per CLAUDE.md. Per the commit-hygiene rule, run
`git status` right before the add and again right before the commit — confirm nothing but
ROADMAP.md gets staged (`git restore --staged` anything else). Then:

```
git add ROADMAP.md
```

```
git commit -m "docs: update roadmap — <one-line summary of main changes>"
```

> **Auto-commit note.** Victor's global rule is "never auto-commit." This orchestrator may run the
> commit itself (same lift granted to `progress-update` and the notes-audit orchestrator, extended
> here 2026-07-09) **only when both reviewers finished and every fix landed cleanly**. If anything is
> uncertain — a reviewer failed, a fix conflicts, or the diff shows an unexplained hunk — print the
> two blocks above and let Victor run them instead.


### Final step — pipeline self-report

After everything above is done, read `notes/prompts/_pipeline-self-report.md` and execute it for this
run — write the report file in this orchestrator's folder, commit it on its own, and print the five
bullets in chat.

````
