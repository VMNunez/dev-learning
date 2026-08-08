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

**Shared failure close-out.** The write counts below describe successful and expected no-op or
ineligibility paths. If this invoked ritual cannot complete a declared step, follow
`notes/prompts/_internal/_session-rules.md` → "When a skill cannot finish — durable friction"; do not
restate or widen that trigger here.


A task from `{PROJECT_PATH}/PROJECT-BACKLOG.md` just finished. Checking its box is the *last* thing you
do, not the first. Walk every step below in order (0 through 5, including sub-steps 1a, 1b and 3b),
without being asked. If one genuinely does not apply, **say so explicitly** in the chat summary instead
of silently skipping it.

The task should already carry a verdict from `backlog-task-open`, which validated it against PLANNING,
the ledger and its real scope before any work started. If it does not — the task was worked on without
that pass — say so in the summary; a fix that was never triaged may have been the wrong fix.

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

Four kinds of task exist, and they close differently:

- **Code task** — a fix landed in the project. Normal path, all steps below apply.
- **Design decision (no code change)** — the task concluded "this is our convention, leave it"
  (e.g. project 07's fail-fast manual-check entry). Steps 1–2 still apply *if* the convention is a
  real concept; PLANNING.md gets the convention recorded in its rules section rather than as a step;
  PROGRESS.md is usually **n/a** (nothing was demonstrated). Say which ones you skipped and why.
- **Already resolved** — `backlog-task-open` proved the finding was real when the review ran and that
  later work has since fixed it. **This is a code task, not a design decision**, and the distinction is
  load-bearing: code Victor wrote *does* demonstrate the concept, so steps 1 and 1a run in full and the
  evidence marker is earned exactly as on the normal path. The only things that differ are that no fix
  is written here, and that the ledger line carries `DECISION, no code change` with the **commit that
  actually fixed it** in its `→` tail (that phrase describes *this close*, which changed no code — not
  the project, which did). Filing it as a design decision instead is the trap: it would skip the marker
  and lose the demonstration, which is precisely the "fixed in passing, recorded nowhere" debt that
  `backlog-task-open` routes here to pay.
- **False positive, or dropped without a fix** — `backlog-task-open` proved either that the code is
  correct as it stands and always was (false positive), or that the task will never be right *for this
  project* (dropped). **Nothing was built and nothing was chosen**, so steps 1 through 4 are all
  **n/a** — say so explicitly and go straight to step 5. The trap is filing these as a design decision:
  that path authors a coverage bullet and a README **Tradeoffs** entry "if the convention is a real
  concept", and a finding the reviewer got wrong is not a convention Victor decided to keep. The ledger
  line still carries `DECISION, no code change`, and its `→` tail must say *why the code is right*
  (false positive) or *why it will never be right here* (dropped) — that tail is the only thing standing
  between the same finding and the next `review-audit` run re-raising it.

Read `notes/prompts/knowledge/coverage/_internal/_topic-ownership.md` before invoking the coverage
skills — the coverage topics distinguish `Spring` (container, beans, proxies, transactions) from
`Spring Boot` (auto-configuration, runtime, externalized configuration, and concrete Boot-stack
integration), and the trap they exist for is a pure Java construct landing under Spring Boot just
because the fix happened in a Spring project (`Optional<T>` is Java; `@Transactional` is Spring).

---

## 1 — Coverage: is the concept already there?

**Invoke the `coverage-bullet-add` skill**, passing the concept from step 0 and the level Victor is
currently working at. It owns this decision end to end: routing the concept to its owning `notes/` topic
by altitude, searching the level file, authoring the bullet under the right section if it is missing,
mirroring it into `notes/coverage/{LEVEL}.md` with a diff check, and reporting the `/notes-plan` remap the
new bullet owes. Do not reproduce its logic here, and do not re-derive the topic routing yourself.

Two things to pass it explicitly, because they are this ritual's context and not the skill's:

- **Give it the concept, not a technology label.** The skill needs the *`notes/` topic*, which it derives
  by altitude; a label you attached in step 0 answers a different question.
- **A design decision with no code change** can still be a real concept — pass it through, and let the
  skill decide whether it belongs on the checklist.

The common outcome is **already covered**, and that is a *good* result: it means the review found a gap in
the code, not in the curriculum. Fold the skill's report rows into this ritual's final table.

If the selected topic has no completed Coverage tracker run, treat its files as scaffolding: the skill
routes the concept to the inbox and reports the first `/coverage` run as owed. Never bypass that gate by
adding a lone bullet to a new topic during a backlog close.

### 1a — Mark the concept as demonstrated

**Applies either way** — whether step 1 found the bullet already covered or had to write it. This is the
sub-step that keeps the coverage file honest about what Victor can *prove*, and it runs on the common
"already covered" path too, which is precisely where a close would otherwise leave no trace.

**Invoke the `coverage-mark` skill**, passing the concept, **the topic `coverage-bullet-add` reported** (not
a technology label), the level, and the project's folder name. It appends the `✅ NN-slug — {evidence}` evidence marker to the matching bullet in the topic file and the
mirror, and reports the level's marked/total count. Do not reproduce its logic here.

Two cases it will report back as skipped, both correct:

- a **design decision with no code change** — nothing was built, so nothing is demonstrated;
- a concept already marked from an earlier project — first project wins.

**An "already resolved" task is not one of them.** Code was written; it just landed in an earlier
session. Pass it to `coverage-mark` normally, and derive the evidence clause from the code as it stands
today, not from the session that wrote it — the clause names what a reader could open and check, and
the reader cannot see which commit produced it.

Fold its report rows into this ritual's final table.

**Marker preservation is a close blocker.** If ownership moved a previously marked bullet from an
adjacent topic, the entire `✅ NN-slug — {evidence}` suffix must exist verbatim on the surviving bullet
in its new topic and in the matching global mirror. Do not remove/recreate it or mark it as a new
demonstration. A mismatch stops the close before the backlog entry reaches the ledger.

### 1b — Carry the skill's owed work into the session

The mirror write, the diff check, and the `/notes-plan` decision all happen **inside
`coverage-bullet-add`** — this sub-step does not repeat them. What it owns is what the skill hands back:

- If the skill reports **`/notes-plan {topic} {LEVEL}` owed**, surface it in this ritual's report table and
  keep it for the *end of the session*. One run per affected topic+level, batched — several closes touching
  the same topic and level are still a single owed run, and it is never run per bullet.
- If the skill reports **drift it found but did not fix** (bullets missing from the mirror that predate this
  task), say so as its own decision. Do not fold someone else's drift into this close.

If nothing was written — the common already-covered path — this sub-step is **n/a**; say so and move on.

---

## 2 — Project README: land the concept

**Invoke the `readme-concept-add` skill** with the concept from step 0. It owns this decision end to end:
deriving which READMEs exist from the project number, routing the concept by **audience** to the global /
backend / frontend file, checking whether it is already represented, and writing it in that section's own
format under the README standard. Do not reproduce its logic here and do not pick the file yourself.

Two things to pass it explicitly, because they are this ritual's context and not the skill's:

- **The concept, not a technology label.** A technology is not a README audience.
- **A design decision with no code change** can still be a real README entry — a convention deliberately
  kept is exactly what the Tradeoffs section is for. Pass it through and let the skill decide.

A backlog task's concept is almost always tier-level, so the common answer is a **Key patterns** entry in
the tier README — not "What I learned", which the standard gives only to the global file. If the concept is
already represented, the skill reports **nothing written**; that is a good outcome, and a README with one
bullet per bug fix is a worse README. Fold its report rows into this ritual's final table.

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

### 3b — PLANNING §0: keep the session quick reference true

§0 calls itself *"the authoritative pointer to the live step"*, and during a backlog-fix branch **the
backlog is the live work** — §0's `Current step` reads `G3 backend backlog fix (not a §15 step)`
precisely because that is where the project is. Nothing else writes this table in a daily session
(`plan-audit` rewrites it only inside a G2 plan pass), so a run of closes that never touches it leaves
the pointer dated to the first one.

Unlike `step-complete`, most closes move only part of it. Check each cell and change only what the
close made false:

- **Last updated** — **always**, every close, today's date. This is the cell that makes the rest
  trustworthy, and it is the one a close forgets. It is never n/a.
- **Current step** — when the close changes *what is being worked on*: the last task at a priority
  clears, or the task was the one gating the next §15 step (7a's account-password Medium is the live
  example — closing it removes a documented blocker and that sentence in §0 becomes wrong).
- **Done condition** and **Next gate** — when the close satisfies a gate's sign-off condition. Closing
  the last open **High** is the case that matters: §23 signs G3 off only when every High is fixed and
  merged, so that close is what turns the gate from blocked to due. Say it in §0, and say it in the
  report.
- **Current branch** — only if the close ends the branch's work per §22.

A close that legitimately moves none of these still updates `Last updated`. State which cells you
changed, and say "no other cell moved" rather than staying silent — silence here is indistinguishable
from having skipped the step.

---

## 4 — PROGRESS.md: status only, never the concept

**The concept does not go in PROGRESS.md** (changed 2026-08-03: its per-technology concept lists were
deleted because they duplicated the coverage files without evidence). Step 1 put the concept on the
coverage checklist and step 1a marked it — that is its only home. Never re-create a `## Angular`-style
list of concepts here.

This ritual updates **one** thing in PROGRESS.md: the `Professional level by topic` row's
practical-evidence cell, when this fix gives that table real evidence — a backlog task closed against a
review finding is exactly that kind of demonstration. If it does not, PROGRESS.md is **n/a** for this
close. Say so out loud.

**Do not touch the `## Coverage demonstrated` table here.** `coverage-bullet-add` and `coverage-mark`
recount their own cells and the `**Total**` row from the files in step 1, and they commit PROGRESS.md
with that write. A second edit from this ritual is a second writer on one table, derived from memory
rather than from a recount — read the figure back from their report for your final table instead.

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

- 2026-07-09 · **[High]** `[backend]` — `UserResponse` DTO stops the BCrypt hash leaking → README, coverage spring-boot/junior

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

- `notes/**/coverage/*.md` — handled by `coverage-bullet-add` and `coverage-mark`, which commit their own
  writes under the standing `notes/` authorization. Do not re-stage those files here; if both skills ran in
  the same close, they fold the authoring and the marking into one coverage commit.
- **`PROGRESS.md` rides in that coverage commit** when step 1 or 1a wrote anything — those skills edit the
  `Coverage demonstrated` table and commit the file with their write. So make this ritual's own evidence-cell
  edit (step 4) **before** invoking them, and let their commit carry it. Only when step 1 and 1a both wrote
  nothing does PROGRESS.md take a commit of its own here.
- `PROJECT-BACKLOG.md` — authorized 2026-07-29. It is written by `review-audit`, by `backlog-task-open`
  (the `⏸ Deferred` marker) and by this skill, never by Victor, so the authorship boundary puts it on
  your side. Its own atomic commit, separate from the coverage one.
- `PLANNING.md`, `README.md` — authorized 2026-08-01. The ritual writes these entries itself, so the
  authorship boundary puts them on your side too. One atomic commit each — and PLANNING's carries both
  the rules-section entry (step 3) and the §0 refresh (step 3b), which are one logical change.

**Victor commits himself** — hand him the commands in the standard two-block format (`git add` block,
then `git commit` block), one command per block:

- Any **project code** he wrote to fix the task. This is the whole of his side, and it does not move:
  the authorship boundary is what the 2026-08-01 authorization turns on, so code stays his even though
  every doc file around it is now yours.

Before every commit you run, apply the hygiene rule: `git status` right before `git add` and right
before `git commit`, so no project code file is staged alongside a doc file.

---

## Report back

Close with a compact table so Victor can see at a glance that nothing was skipped silently:

| Target | Result |
|---|---|
| Coverage (`spring/junior`) | already covered — "declarative transaction boundaries" |
| Topic chosen | `security` — access-control rule, not the Spring mechanism |
| Evidence marker | marked `✅ 07-timetrack` on "declarative transaction boundaries" — 24/139 junior bullets demonstrated (or: n/a — DECISION, no code change) |
| Coverage mirror | n/a — no new bullet written (or: bullet added to topic coverage + global mirror, 141 bullets match) |
| `/notes-plan` owed | n/a (or: yes — `/notes-plan spring-boot junior`, run once at end of session) |
| README | `backend` / Key patterns — entry added (or: n/a — already represented in "Auth flow") |
| PLANNING.md | added to §6 engineering rules |
| PLANNING §0 | `Last updated` → today; no other cell moved (or: last open High cleared — `Next gate` now says G3 signable) |
| PROGRESS.md | n/a — evidence cell unchanged (coverage table owned by the coverage skills) |
| Gate due | none (or: G3 sign-off is now unblocked — PR `fix/backend-backlog` into `projects/07-timetrack`) |
| Backlog | task collapsed into `## Closed` |
