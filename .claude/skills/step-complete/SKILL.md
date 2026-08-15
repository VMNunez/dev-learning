---
name: step-complete
description: >
  Run the full step-completion ritual WHENEVER a learning-plan step of the active project is
  finished during a daily session — the moment Victor's code for the step works, is tested, and is
  committed (or he says the step is done: "step X terminado", "hemos acabado el step", "mark the
  step complete", "ya está el step"). The shared session rules mandate updating three places after every
  completed step, and the real failure mode is doing it partially — updating PROGRESS.md but forgetting the
  ✅ in PLANNING.md or the README. This skill makes the ritual atomic: all three, plus the step's coverage
  work — authoring the bullet for a concept the checklist is missing, and marking what the code
  demonstrated — plus the check nothing else in the system performs: that the step's **done
  condition** actually passed (that is gate G1's real trigger, not "it feels finished"). It also repoints
  PLANNING **§0** at the next step so the following session opens on a true pointer — or flags why not —
  a table it shares with `backlog-task-close` under a stated cell partition.
  Interview-prep is NOT part of this ritual (dropped 2026-07-13 — Victor adds those separately,
  on request, not automatically on step completion). Do NOT trigger for ordinary commits mid-step,
  notes-only sessions, or the audit pipelines. (Projects 01-06 are closed - their extraction format,
  the "Key patterns introduced" table, is N/A in practice.)
---

# Step-completion ritual (daily session)

**Shared failure close-out.** The write counts below describe successful and expected no-op or
ineligibility paths. If this invoked ritual cannot complete a declared step, follow
`notes/prompts/_internal/_session-rules.md` → "When a skill cannot finish — durable friction"; do not
restate or widen that trigger here.


A learning-plan step just finished. The shared session rules ("After every learning plan step is
completed") require three updates — PLANNING.md, PROGRESS.md, the README — and this ritual adds three
more: a **check that the step really passed** (step 0, gate G1's actual trigger), **coverage** (step 3),
which both *authors* the bullet for a concept the checklist is missing and *marks* what the step
demonstrated, and the **§0 repoint** (step 5) that leaves the plan pointing at the next step rather than
the finished one. So the step's concepts end up recorded as part of the curriculum and as *demonstrated*,
not merely as done, and the next session opens on a true pointer. Walk all six in order, without being
asked. If one genuinely does not apply, say so explicitly instead of silently skipping it.

This is the step-level twin of `backlog-task-close`. That one fires on a **backlog task** — a concept that
came out of a review and was never planned — and additionally reconciles PLANNING.md and the backlog's
Closed ledger. This one fires on a **planned step**, so PLANNING.md only needs its ✅ and there is no ledger
to collapse. Both share the same coverage contract, through the same two skills.

Interview-prep questions are **not** part of this ritual — Victor asked (2026-07-13) to stop adding
them automatically on step completion. Only add interview-prep questions when he asks for them
directly, in session.

## 0 — Confirm the step's done condition actually passed

PLANNING §23 defines this ritual as **gate G1, triggered by "the step's done condition passes"** — not
by the step feeling finished. Read the step's `**Done condition:**` line and check it off out loud,
clause by clause, before writing anything. Those conditions are deliberately written as concrete
assertions (`Browser: login at localhost:4200 redirects to /dashboard…`), so each one is either
verified or it is not.

- **Victor confirmed each clause** — normal path; say which ones, in one line, and continue.
- **Some clause was never checked** — say so and ask him to run it now. This costs a minute; a ✅ on a
  step whose done condition was never exercised silently corrupts every later gate, because G3–G7 all
  read PLANNING and PROGRESS as if the ✅ meant something.
- **A clause genuinely no longer applies** (the plan moved) — that is a §15 change, so it is
  `plan-audit MODE = review`'s call (gate G2), not a clause to quietly drop here.

Never mark a step complete on "he said the step is done" alone. The whole reason G1 sits at the done
condition and not at the last commit is that a commit proves code exists, not that it works.

## 1 — PLANNING.md: mark the step

Append `✅` to the completed step's heading (e.g. `### Step 5 — TimeEntry workflow ✅`). Add a short
note under the step only if something changed versus the plan. **This marker is the only step status
`progress-update` can read** — since `REC-136` (2026-08-13) its Format B extraction has
no other source and is forbidden to take one from `PROGRESS.md`, so a finished step left unmarked
becomes a drift row against the very `Status` cell you write in step 2, and that row holds G6 open
until the `✅` is added. Never skip it.

**Split steps (`### Step 7 — Angular frontend (split into 7a / 7b / 7c / 7d)`) mark at two levels, and
the order matters.** The ✅ goes on the **sub-step heading** that just finished (`#### Step 7a — Shell
+ auth ✅`); the **parent heading stays unmarked until every child carries one**, and then takes its
own ✅ in the same run that closes the last child. Each sub-step has its own done condition covering
its full scope, so each earns its own G1 — but a ✅ on the parent while 7b–7d are unbuilt would tell
`progress-update` the whole frontend is done. When you mark the last child, say explicitly that the
parent is now complete too.

## 2 — Extract the step's concepts, and update PROGRESS.md *status*

**`notes/prompts/strategy/tracking/_internal/_concept-extraction-standard.md` step 3 owns which field
holds the concepts, per PLANNING format. Read it rather than assuming a field name** — this ritual and `progress-update` must extract from the
same place or the two records diverge. For project 07 (Format B) that means the step's
`**New concepts:**` line, **plus** its `**Concept learned:**` line on the minority of steps that carry
one, and **never** `**Review concepts:**`, which names concepts an earlier step already introduced.

Hold that list — steps 3 and 4 consume it. Write each concept as **one specific thing**, key syntax in
backticks: never group two concepts. A step whose extraction comes back empty is a defect in the plan,
not a step with no concepts: say so and stop rather than closing with nothing to record.

**PROGRESS.md is status only — it is not where the concepts go** (changed 2026-08-03: the
per-technology concept lists were deleted because they duplicated the coverage files without
evidence). In PROGRESS.md this ritual updates exactly two things:

- the project's row in the `## Projects` table — the `Status` cell carries the step detail
  (e.g. `In progress ⏳ — Steps 1–5 done, Step 6 next`), and nothing else records it. On a split step,
  name the sub-step (`Steps 1–6 done, Step 7a next`), matching the ✅ level from step 1;
- the `Professional level by topic` row's evidence cell, if the step gives that table real practical
  evidence — a shipped, tested step is exactly the kind of demonstration that table is for.

**Do not touch the `## Coverage demonstrated` table here.** It belongs to `coverage-bullet-add`
(denominator) and `coverage-mark` (numerator), which recount it from the files and rewrite their own
cells plus the `**Total**` row in step 3 below. Editing it here as well means two writers on one table,
and the ritual's copy is the one derived from memory rather than from a recount. Read the number back
from their report for your final table instead.

Never re-create a `## Angular`-style list of concepts in PROGRESS.md. The concepts land on the
coverage checklist in step 3 and nowhere else; a concept already covered there is not repeated —
say so instead.

PROGRESS.md follows the active branch (`notes/prompts/_internal/_session-rules.md` → `Study materials
follow the active branch — no direct commits to main`; `main` only receives merges via PR) — commit it
from the repo root.

## 3 — Coverage: land the step's concepts on the checklist

The step's concepts were just written in code, so both halves of the coverage contract apply. Run them in
this order, for each concept from step 2:

**3a — Author the bullet if it is missing.** **Invoke the `coverage-bullet-add` skill** with the concept and
the level Victor is working at. It routes the concept to its owning `notes/` topic by altitude, searches the
level file, writes the bullet under the right section when it is genuinely absent, mirrors it into
`notes/coverage/{LEVEL}.md` with a diff check, and reports whether `/notes-plan {topic} {LEVEL}` is owed.
Pass it the **concept itself, not a technology label you attached to it** — a label answers a different
question, and handing it over is how an access-control concept ends up under `spring-boot` when
`notes/security/` owns it.

This is a deliberate change (2026-07-30): a step close used to only ever *flag* a missing bullet and leave
it for `/coverage`. It now authors it, because the concepts a project teaches are exactly the ones the
curriculum should absorb — a step that discovers a real concept and leaves no bullet behind is the gap this
ritual exists to close. Authoring stays inside the skill, under the coverage standard's contract; this
ritual never writes a bullet inline.

**3b — Mark it as demonstrated.** **Invoke the `coverage-mark` skill** with the same concepts, **the topic
`coverage-bullet-add` reported in 3a** (not a technology label, and not a topic re-derived here — the bullet
was authored under that one), the level, and the project's folder name. It appends the `✅ NN-slug — {evidence}` evidence marker to the matching bullet in the topic file and
the mirror, so the coverage file records how much of the hiring floor Victor can *prove* and not only what
he planned. This runs on the already-covered path too — that is precisely where a close would otherwise
leave no trace.

**3c — Carry the owed work.** If `coverage-bullet-add` reports `/notes-plan {topic} {LEVEL}` owed, put it in
the report table and keep it for the **end of the session**, batched: one run per affected topic+level, never
one per bullet. Never write `notes-plan-{LEVEL}.md` or its `Coverage SHA-256` by hand — the stale hash is the
correct signal that a remap is due.

Fold both skills' report rows into this ritual's final table.

## 4 — Project README: land the step's concepts

**Invoke the `readme-concept-add` skill** with the step's concepts. It owns this decision end to end:
deriving which READMEs exist from the project number, routing each concept by **audience** to the global /
backend / frontend file, checking whether it is already represented, and writing it in that section's own
format under the README standard. Do not reproduce its logic here and do not pick the file yourself.

Two things to pass it explicitly, because they are this ritual's context and not the skill's:

- **The concepts, not a technology label.** A technology is not a README audience — the skill routes by
  who needs to read the concept.
- **The tier the code landed in, as a hint only.** The skill routes by who needs to read the concept, not
  by which folder changed; handing it the tier as the answer is how an API contract ends up buried in a
  backend README instead of the global one.

If the existing entries already cover the step's concepts, the skill will report **nothing written**, and
that is a good outcome — a README with one bullet per step is worse than one that names what the project
taught. Fold its report rows into this ritual's final table.

## 5 — PLANNING §0: repoint the session quick reference

§0 calls itself *"the authoritative pointer to the live step"*, and completing a step is the single
event that invalidates every one of its cells. Outside a daily session the only thing that repairs it is
`plan-audit` — `MODE = new` authors §0 with the rest of the plan, and `MODE = review` rewrites it inside
a G2 pass; `progress-update` reads PLANNING and does not touch §0. So a §0 left stale after a close stays
stale until someone notices by hand, and the next session opens on a pointer that names a finished step.

**Inside a daily session §0 has two writers, this ritual and `backlog-task-close`** (partition added
2026-08-11, `REC-091`; this section used to claim it was the only one, which stopped being true the day
the close ritual gained its own §0 cells). Both fire in the 08:00 block, and a morning that finishes a
step *and* closes a task runs them back to back:

- **Read §0 as it stands before writing it**, never as the pre-session state — the close may already have
  moved cells this morning. The signal that works is `PROJECT-BACKLOG.md`'s `## Closed`, whose lines are
  dated: one dated today means a close ran. `Last updated` alone proves nothing, since both rituals stamp
  it. If that is ambiguous, `git log -p --since=midnight -- {PROJECT_PATH}/PLANNING.md` settles it,
  because both rituals commit that file themselves.
- **The order is not fixed** — whichever event happens first in the morning runs first. So the rule is
  the same in both directions: **the ritual that writes §0 second re-derives `Next gate` from §23 against
  the `Current step` as it then stands**, and carries forward the sign-off fact the other one recorded.
  Never assume you are the last writer of the morning.

Rewrite these cells, and only these:

- **Current step** — **this ritual's cell.** A close writes it only when no §15 step closed earlier in
  the same session. The step just closed becomes the next one, named as §15 names it (sub-step
  granularity on a split step). Carry over any *blocking prerequisite* the next step declares: 7a's
  own note about the account-password Medium is the model — a next step that is gated is not "next",
  it is "next once X merges", and §0 is where that is read.
- **Current branch** — **this ritual's cell**, per §22. If the closed step was the last on its branch,
  say the branch is ready to merge and name the one that opens next, rather than leaving the merged one
  as current. A close touches it only when its own fix ends that branch's work — the same condition, in
  every file that states it.
- **Done condition** — replace with the *next* step's, verbatim from §15. Do not paraphrase it: this
  cell is what step 0 of the next ritual checks against, and a paraphrase makes it uncheckable. It
  belongs to whoever wrote `Current step`, because it has to describe the step that cell names.
- **Next gate** — from §23, and **it is derived, not owned.** The cell holds two different things and the
  partition splits them there:
  - **Which gate it names is derived**: the first gate in §23's **chain** that is **not yet signed off**.
    A gate whose trigger has already fired but whose sign-off is still pending is *still* that gate —
    07's `G3 sign-off — condition met, action pending` is the live example, and skipping ahead to G4
    because G3's trigger fired is the wrong-order error the invariant exists to catch. Derive it from
    five things you can read: the gate's **closure-checklist box** at the end of §23, any stricter
    sign-off its own §23 gate cell states, `PROJECT-BACKLOG.md`'s open High/Medium state, **that same
    backlog's per-tier `**Last Reviewed — «tier»:**` lines** — `never`, or a date carrying
    `(incomplete — …)`, is a review slice nobody read, and G3/G4's boxes ask for that run's date, so no
    amount of fixed Highs signs such a tier off — and §22's
    merge status for the branch the gate names — a fix on an unmerged branch has not signed anything
    off. All five are live state, so re-derive this cell every run rather than copying what was in it.
    `backlog-task-close` reads the same tier lines for its qualifier; a re-derivation that never read
    them is how a `blocked — «tier» tier not fully reviewed` qualifier gets overwritten by a gate this
    ritual only *believed* was signed.
    (The rule is `_planning-standard.md` invariant 10, and its quality-gate rules are where *signed off*
    is defined.)
  - **Whether that gate is blocked, signable or pending an action** is the same question seen from the
    backlog, and `backlog-task-close` states it as a qualifier because a last open **High** clearing is
    the event that moves it. Keep that qualifier on the re-derived gate (`G3 — signable, last High
    merged`); drop it only when the re-derivation names a *different* gate, where it no longer applies.

  If the derivation and the close's qualifier genuinely cannot both hold, **write the derived gate** and
  say in the report that the qualifier was dropped and why. One cell, one value, derivation first.
- **Phase** — restate it; it moves only when the project crosses a phase boundary, which a single step
  rarely does.
- **Last updated** — today's date, **always**, from both rituals. A `Last updated` that lags the ledger
  is how everyone learns to distrust the table.

Leave the rest of §0 alone; this is a repoint, not a rewrite of the plan.

**If the closed step just made a §23 gate due, say so as its own line in the report** and name the
prompt that gate runs. The gate is not run from inside this ritual — the prerequisite chain
`G3/G4 → fix the Highs → G5 → G6 → G7 → G8` is Victor's to walk — but a gate that comes due silently
is a gate that gets run late, out of order, or not at all.

## Commits

These are docs/study updates, not project code. Do **not** bundle them — one atomic commit per **logical
change**, which is the session rules' unit and not "per file": the bullets below deliberately put several
files in one commit where they are one change, and never split one change across two.
Everything lands on the **active branch** (`main` only receives merges via PR).

- `notes/**/coverage/*.md` — committed by `coverage-bullet-add` and `coverage-mark` themselves, under the
  standing `notes/` authorization. Do not re-stage those files here; when both ran in the same close they
  fold the authoring and the marking into one coverage commit.
- **`PROGRESS.md` rides in that same coverage commit** whenever step 3 wrote a bullet or a marker — the
  sub-skills edit the `Coverage demonstrated` table and commit the file with their own write, because the
  table edit and the marker are one logical change. So sequence this ritual's own PROGRESS.md edit (the
  `## Projects` status cell, and the evidence cell) **before** invoking them, and let their commit carry
  all of it. Only when step 3 wrote nothing at all does PROGRESS.md need a commit of its own here.
- The README — committed by `readme-concept-add` itself, in **one** commit for the entry it wrote, even
  when a cross-tier concept put that entry in two READMEs. Do not restage it here.
- `PLANNING.md` — **you commit it yourself**, authorized 2026-08-01, one atomic commit covering both the
  step's ✅ (step 1) and the §0 repoint (step 5): they are the same logical change, and a §0 still pointing
  at a step whose ✅ already landed is the exact staleness step 5 exists to prevent.
- Any **project code** Victor wrote for the step stays his — give him those commands in the standard
  two-block format (`git add` block, then `git commit` block), one command per block.

Before every commit you run, `git status` immediately before the `add` and before the `commit`, so no
project code file is staged alongside a doc file.

## If the whole project just finished

Remind Victor to update the `Current study progress` section of
`notes/prompts/_internal/_session-rules.md` and the projects table in PROGRESS.md, as that shared
session contract requires.

## Report back

Close with a compact table so Victor can see at a glance that nothing was skipped silently:

| Target | Result |
|---|---|
| Done condition | all 3 clauses verified (`mvn` boot, `GET /api/entries` 200, Postman reject → DRAFT) |
| PLANNING.md ✅ | `### Step 5 — TimeEntry workflow ✅` (or: `#### Step 7a ✅`; parent Step 7 still open, 7b–7d pending) |
| PROGRESS.md | status only — `Steps 1–5 done, Step 6 next`; coverage table left to the coverage skills |
| Coverage bullet | added "declarative transaction boundaries" to `spring-boot`/junior + mirror, 141/141 match |
| Topic chosen | `spring-boot` — the framework mechanism, not the neutral boundary rule |
| Evidence marker | marked `✅ 07-timetrack` — 24/139 junior bullets demonstrated |
| `/notes-plan` owed | yes — `/notes-plan spring-boot junior`, run once at end of session |
| README | `backend` / Key patterns — 2 entries added; 1 concept already represented |
| PLANNING §0 | repointed to Step 6 — branch `feat/reports`, done condition copied verbatim, phase unchanged, dated today · `Next gate` re-derived as G3, keeping this morning's close qualifier "signable, last High merged" (or: qualifier **dropped** — the re-derivation names G4, which the close's fact does not describe) |
| Gate due | none yet (or: G3 backend review is now due — `review-audit REVIEW_SCOPE = backend`) |
