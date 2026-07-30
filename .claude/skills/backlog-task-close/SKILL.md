---
name: backlog-task-close
description: >
  Run the backlog-task closing ritual WHENEVER a task from the active project's PROJECT-BACKLOG.md is
  finished during a daily session — the moment Victor's fix for that task works and is committed, or he
  says it is done ("ya está la tarea del backlog", "cerrado lo del @Transactional", "marca esa tarea
  como hecha", "task done"). Marking the box ✅ is NOT the ritual: a closed task must also land its
  concept in the topic's coverage file, the project README, PLANNING.md and PROGRESS.md, and only then
  collapse into a one-line entry in the backlog's Closed ledger so the file stops growing. The failure
  mode this exists for is a task that gets checked off and leaves no trace anywhere else — the fix ships
  but the learning is never recorded, and the backlog turns into a wall of dead prose. Do NOT trigger
  for completed learning-plan steps (that is the step-complete skill), for ordinary mid-task commits, or
  inside the review-audit / portfolio-audit pipelines.
---

# Backlog-task closing ritual (daily session)

A task from `{PROJECT_PATH}/PROJECT-BACKLOG.md` just finished. Checking its box is the *last* thing you
do, not the first. Walk all six steps below in order, without being asked. If one genuinely does not
apply, **say so explicitly** in the chat summary instead of silently skipping it.

This is the task-level twin of the `step-complete` skill. That one fires on a **learning-plan step**
(PLANNING §15 / project 07's learning plan) and touches three files. This one fires on a **backlog
task** and touches five, because a backlog task is a *concept Victor did not plan to learn* — it came
out of a review — so it has to be pushed back into the planning and coverage artefacts that never
anticipated it.

**Do not edit Victor's project code here.** The fix is already written, by him. This ritual only
touches documentation and coverage.

---

## 0 — Identify the task and the concept

Quote the exact task line from `PROJECT-BACKLOG.md` back to Victor before doing anything, and state in
one sentence **the concept it taught**. Everything downstream keys off that concept, so getting it
wrong poisons all five updates.

Two kinds of task exist, and they close differently:

- **Code task** — a fix landed in the project. Normal path, all steps below apply.
- **Design decision (no code change)** — the task concluded "this is our convention, leave it"
  (e.g. project 07's fail-fast manual-check entry). Steps 1–2 still apply *if* the convention is a
  real concept; PLANNING.md gets the convention recorded in its rules section rather than as a step;
  PROGRESS.md is usually **n/a** (nothing was demonstrated). Say which ones you skipped and why.

Route the concept to its topic with the **Step 4 mapping table** in
`notes/prompts/strategy/tracking/_internal/_concept-extraction-standard.md` — **read that file before
writing anything**. It only auto-loads inside `progress-update`, so an inline close without it
mis-routes silently. The trap it exists for: pure Java constructs landing under Spring Boot just
because the fix happened in a Spring project (`Optional<T>` is Java; `@Transactional` is Spring).

---

## 1 — Coverage: is the concept already there?

Open the routed topic's coverage file for **the level Victor is currently working at** —
`notes/{topic}/coverage/{junior|middle|senior}.md`. Search for the concept (grep the key symbol, not
the task's wording — the coverage file names concepts, not fixes).

**If it is already covered:** say so and name the exact bullet. Nothing to write. This is the common
case and it is a *good* outcome — it means the review found a gap in the code, not in the curriculum.

**If it is missing:** add it. **Read
`notes/prompts/knowledge/coverage/_internal/_coverage-standard.md` first** — it only auto-loads inside
the `/coverage` pipeline, so an inline edit without it will break the file's contract. The two rules
that inline edits break most often:

- **Concepts, not conduct.** A coverage bullet describes *what a junior must understand*, never *what
  Victor did in project 07*. Write "declarative transaction boundaries — a service method that performs
  several writes needs them to commit or roll back as one unit"; never "added `@Transactional` to
  `TimeEntryService.submit()`".
- **Placement.** It goes under the existing section its subject belongs to, in that section's voice and
  bullet shape. Do not open a new section for a single concept, and do not append to the end of the
  file.

If the concept genuinely belongs to a **level above** the one Victor is on, add it there and say so —
that is a signal about his trajectory, not a mistake.

### 1b — A new bullet lands in three files, not one

A coverage concept lives **verbatim in three synced files**; `coverage-prompt.md` is what normally keeps
them aligned, and it is not running here. So if — and only if — step 1 actually wrote a new bullet,
write it into all three by hand, at **the level you just determined** (junior / middle / senior — check
which one, never assume, and never let a middle concept land in the junior plan).

This exists to avoid re-running `/coverage` or `/notes-plan` for a single bullet: that cost is absurd
for one point. But the sync is only worth doing *honestly* — see the SHA rule below.

**1. `notes/{topic}/coverage/{LEVEL}.md`** — the canonical file, already written above.

**2. `notes/{topic}/coverage/notes-plan-{LEVEL}.md`** — the plan that assigns every coverage bullet to a
chapter. A bullet that reaches coverage but no chapter is a concept no note will ever teach, which is
the real damage this step prevents.

- **If the file does not exist, stop here and say so.** Only levels whose notes have been planned have
  one (often junior only). There is nothing to sync — not a defect.
- Add the bullet, text **identical** to the canonical file, to the `Coverage concepts:` list of the
  chapter that teaches it. Pick the chapter from the coverage **section** the bullet sits under, not
  from the bullet's wording; keep the same relative order the coverage file has.
- **If no existing chapter fits, do not invent one and do not force it into the nearest chapter.** Leave
  the plan untouched, leave the SHA stale, and report that `notes-plan-prompt` is needed for this topic
  — a new chapter is a planning decision, not a bookkeeping one.
- Each chapter also has a `Must answer:` list. Add a question there when the new concept has a failure
  mode a reader would hit (that is what those questions are for); if you do not, **say so explicitly**
  in the report rather than leaving it silently unasked.
- **Then update the stored `Coverage SHA-256`** to `sha256sum` of the canonical `{LEVEL}.md` (files are
  LF in this repo — compute it on the file as committed, and if a mismatch ever looks suspicious, rule
  out CRLF before treating it as drift). `coverage-prompt` Step 5 validation #9 reads a mismatch as
  "notes-plan is stale, re-run `notes-plan-prompt`".
- **Never update that SHA unless the bullets really were mapped.** The hash certifies *which coverage
  bytes this plan was built against*. Overwriting it without doing the mapping forges that certificate:
  the plan stays incomplete and the one mechanism that could detect it is gone. Silencing the alarm is
  worse than the drift.

**3. `notes/coverage/{LEVEL}.md`** — the global mirror. Same bullet, same relative order, inside
`## {TOPIC}`; the topic file's `##` section headings appear here demoted to `###`.

**Verify before moving on** — landing the bullet in only some of the three is worse than not landing it,
and the check is two commands:

- the stored SHA equals `sha256sum` of the canonical file;
- the canonical file's bullets and the mirror's `## {TOPIC}` bullets are **identical sets** (sort both,
  `diff` them). Report the bullet count. This is the check that catches drift older than today's edit —
  if it surfaces unrelated missing bullets, say so and treat them as their own decision, do not silently
  fold them into this task's close.

If step 1 found the concept already covered, this whole sub-step is **n/a** — say so and move on.

---

## 2 — Project README: "What I learned"

**Read `notes/prompts/projects/readme/_internal/_readme-standard.md` before touching the README** —
same reason as above, it only auto-loads inside `readme-audit`.

Add a short bullet if the concept is not represented. Short bullets, **no explanations** — the details
live in `notes/`, never in the README. If the existing bullets already cover it, say so and move on;
a README with one bullet per bug fix is a worse README.

Note which README: on a full-stack project, the tier's README if the project has per-tier ones.

---

## 3 — PLANNING.md: was this ever planned?

Search PLANNING.md for the concept. Three outcomes:

- **It was planned** — the step that owns it exists. Nothing to add; name the step in your summary.
- **It was not planned and it belongs in the plan** — the concept is part of the project's real
  engineering contract (a layer rule, an error-contract rule, a security rule). Add it to the
  **rules/architecture section it belongs to** (§6 engineering rules, §10 API contract, etc.), *not* as
  a new step — the work is already done, and inventing a retroactive step corrupts the step numbering
  that PROGRESS.md and the G-gates read.
- **It was not planned and it does not belong** — one-off polish, a tooling tweak, a config move. Say
  so explicitly and add nothing. Not every fix is a plan-level concern.

When you do edit PLANNING.md, keep it to the plan's own voice and format; do not annotate it with
"added because of backlog task X" — the ledger in step 5 already records that.

---

## 4 — PROGRESS.md: record the concept

Add the concept to the routed technology section, using the routing you already did in step 0.
Format rules (identical to `step-complete`, and non-negotiable):

- **One specific thing per line.** Never group several concepts into one bullet.
- Key syntax in backticks, optional short dash-clause after it.
- **Never multi-line.**

If PROGRESS.md's `Professional level by topic` table gains real evidence from this fix, update that
row's practical-evidence cell too — a backlog task closed against a review finding is exactly the kind
of demonstrated evidence that table is for.

If the concept is already recorded from an earlier step, do not duplicate it. Say so.

---

## 5 — Collapse the task into the Closed ledger

Only now, and only if steps 1–4 are done (or explicitly declared n/a), remove the task's full entry
from the `## Tasks` list and add **one line** to a `## Closed` section at the end of the file. Create
that section if it does not exist, directly after the task list.

Ledger line format:

```
- YYYY-MM-DD · **[Priority]** `[tier]` — short summary (max ~15 words) → where the concept landed
```

Worked examples:

```
## Closed

### Backend

#### High

- 2026-07-09 · **[High]** `[backend]` — `UserResponse` DTO stops the BCrypt hash leaking → README, PROGRESS, coverage spring-boot/junior

#### Medium

*No medium tasks closed yet.*

#### Low

- 2026-07-28 · **[Low]** `[backend]` — `show-sql` moved to `application-dev.properties` → README
- 2026-07-09 · **[Low]** `[backend]` — fail-fast manual checks kept as the project's convention — DECISION, no code change → PLANNING §6, notes/spring-boot/en/05

### Frontend

*No frontend tasks closed yet — Step 7a (Angular) has not started.*
```

Ledger rules:

- **Split by tier, then by priority, then newest first within each priority.** `## Closed` carries a
  `### Backend` and a `### Frontend` subsection, each with `#### High` / `#### Medium` / `#### Low`
  underneath — the same two-level split `## Tasks` uses, so a closed finding is found the same way an
  open one is. Put the line under its tier's *and* its priority's heading; keep the inline
  `` `[tier]` `` tag and the `**[Priority]**` marker on the line anyway — a partial-scope review run
  greps for them, and the line must stay self-describing if it is ever read out of context.
- **No heading is ever left bare — empty means a placeholder line, not blank space.** A tier with
  nothing closed keeps its heading plus one italic line; so does every empty priority inside it
  (`*No High tasks closed yet.*`). The same applies to `## Tasks` when you remove the last task at a
  priority: leave `*No open High tasks.*` behind, never an empty heading. A blank section reads as
  "never filled in" when it actually means "nothing outstanding" — and at a priority Victor just
  cleared, that is the opposite of the message.
- **Filing a line under its priority heading is the one reordering allowed.** Everything else about
  ledger order is frozen (see the never-delete rule below).
- The `→` tail is the point of the whole line: it tells a future `review-audit` that this finding is
  closed *and* where its knowledge now lives, so it is not re-raised as a new finding.
- A **design decision with no code change** must say `DECISION, no code change` in the line. That entry
  is the only surviving record that a reviewer deliberately chose the current behaviour — losing it is
  how the same non-bug gets re-reported every review.
- Never delete a ledger line. The ledger is append-only; only the verbose `## Tasks` entry is removed.
- Never move a task to the ledger while its box is `[ ]` and unfixed.

If a task is being closed as **won't fix / no longer relevant** (not fixed, just dropped), it still goes
to the ledger, with the reason in place of the concept tail: `→ dropped: superseded by Step 7a rewrite`.

---

## Commits

Per CLAUDE.md and the shared session rules. Do **not** bundle these — one atomic commit per file.
Everything below lands on the **active branch** (`main` only receives merges via PR).

**You commit yourself:**

- `notes/{topic}/coverage/*.md` — a `notes/` study file, already covered by the standing authorization.
- `PROJECT-BACKLOG.md` — authorized 2026-07-29. It is written by `review-audit` and by this skill,
  never by Victor, so the authorship boundary puts it on your side. Its own atomic commit, separate
  from the coverage one.

**Victor commits himself** — hand him the commands in the standard two-block format (`git add` block,
then `git commit` block), one command per block:

- Any **project code** he wrote to fix the task.
- `PLANNING.md`, `README.md`, `PROGRESS.md` — these three still go to him from this in-session ritual;
  only their dedicated orchestrators (`progress-update`, `roadmap-review`) may commit them directly.

Before every commit you run, apply the hygiene rule: `git status` right before `git add` and right
before `git commit`, so no project code file is staged alongside a doc file.

---

## Report back

Close with a compact table so Victor can see at a glance that nothing was skipped silently:

| Target | Result |
|---|---|
| Coverage (`spring-boot/junior`) | already covered — "declarative transaction boundaries" |
| 3-file coverage sync | n/a — no new bullet written (or: bullet added to coverage + notes-plan-junior, SHA refreshed, global mirror updated) |
| README | bullet added |
| PLANNING.md | added to §6 engineering rules |
| PROGRESS.md | concept added under Spring Boot |
| Backlog | task collapsed into `## Closed` |
