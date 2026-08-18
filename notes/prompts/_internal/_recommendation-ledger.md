# Prompt-system recommendation ledger

Self-report recommendations use one of four states — a close-out writes `open` or `accepted` and nothing
else, which is what the two self-report contracts and `_system-map.md` §12 state. A fifth, `accruing`, is
raised by hand only:

- `open` — observed and not yet adjudicated.
- `accepted` — agreed, with implementation still pending.
- `applied` — implemented and verified, then collapsed into `## Closed`.
- `rejected` — intentionally not implemented, then collapsed the same way, with the reason kept.
- `accruing` — not workable and never scheduled: its input is **lived use**, so it fills up rather than
  being run, and it is not part of the queue. `REC-054` only; a second one would be a smell.

**This ledger holds defects in the *machinery* — a prompt, a skill, a standard, a launcher, the validator
or either map — and nothing else.** Scope stated 2026-08-10, when three rows were deleted for failing it.
Three tests, in order. **Is the wrong thing a file or a cell?** A prompt that would produce the right
output if someone ran it is a cell in `_run-tracker.md`, never a row (the `REC-046` rule, in `_recommendation-resolution-doctrine.md`). **Whose
file is it?** A defect in a project's `PLANNING.md`, a practice doctrine, a coverage or a notes file is
owed to that file's declared writer, and a machinery session may not hand-edit it — so it is ours only
where the *owner's* text is also wrong, which is `REC-083`'s split. **Does it need a lived day?** Anything
measured from how much a ritual has actually been used is evidence that accrues (`accruing` above), never
work that is queued. A finding that fails these tests is still written down — in the `## Closed` line of
the row that found it, or in the tracker cell that owns it — it is simply not carried here, because a
ledger holding operational worklists is one nobody can drain.

**But `_run-tracker.md` holds a debt only in its own defined `⚠ stale` form**, which the owed prompt is
built to clear on its next run. Free prose appended to a cell is not a sink: `_pipeline-self-report.md`
tells every close-out to **overwrite** the cell, so the next run of that prompt deletes the note without
having read it — and the audit prompts read their `_last-run-report`, not this file. `REC-102` wrote
such a note and reverted it on its cold reviewer's finding. When the owner's own standard already
carries the check, the `## Closed` line is the sink and the standard is what carries it forward.

## How an item is resolved

Four steps, in order, fixed 2026-08-07. The ledger reached 127k characters before this was written
down, and the three items before it each cost more than they were budgeted for.

**The steps are here; their case law is `_recommendation-resolution-doctrine.md`, beside this file.**
Split out 2026-08-18, when the promoted rules of every closed row had grown to four fifths of this
file and the queue was the part nobody could find. Steps 1 and 3 cite it by section; a rule a closure
promotes lands there and never here, which is what stops this file growing again.

1. **Analyse the problem, never only the row.** A row records where a defect was *found*; it is
   routinely wrong about where the defect *lives*. `REC-053` named one file and the rot sat in five.
   `REC-051` named three sites and there were six, two of them naming the gate by the very thing the
   item removed. `REC-057` asked for a check that already existed and was blind not to a *location* but
   to a path **form**. Measure against disk before proposing anything, and budget the sweep rather than
   the edit. **Name the set you measured**: step 3 hands it to the reviewer, and a measurement nobody
   wrote down cannot be handed to anyone.
   **The case law of this step — every way a measurement has been wrong before, and the tests that
   cost one command each — is `_recommendation-resolution-doctrine.md` → "Step 1". Read it before
   proposing anything; it is where the promoted rules of every closed row live.**
2. **Resolve from that analysis, not from the row's wording.** When re-verification falsifies a clause
   of the finding, correct it in writing and say so. Several items were worth more for what their
   re-verification uncovered than for what they originally claimed.
3. **Run a cold reviewer. Mandatory, no exceptions.** Both self-report contracts have always stated
   this gate unconditionally. The `REC-025` "carve-out" that let verified factual corrections skip it
   is **void, not superseded — it never existed**: that row ruled on *bar condition 3* (a false
   statement in a dispatch document is a defect regardless of what it earns), which is about whether a
   finding is worth applying, not about who checks the fix. Five rows cited it to skip the gate anyway.
   The reviewer then caught items doing real damage on exactly that footing: `REC-041-B` was falsifying
   the very sentence its own predecessor had just added as a root fix, and `REC-051` would have stopped
   a tier that had never been reviewed at all — `07-timetrack`'s frontend, on its own scheduled gate. A
   fix being factual does not make it safe. **A gate that cannot be *reached* leaves the row `open` and
   the working tree accounted for.** Step 2 has already written the fix to disk — unlike the self-report
   refinement gate, where the edit is still a draft in context — so a dead reviewer leaves an edited,
   uncommitted tree that reads exactly like an applied fix on the next `git status`. Run the standard's
   dispatch ladder to its end. Only when it is exhausted does the edit stop waiting, and **parking it is the equal of reverting, not the lesser option** — a resume may have to
   wait for the next session's budget, so park the edit with the row naming where it sits and what it is
   still owed. What is forbidden is neither: an edited tree with nothing recording why.
   **One reviewer per row, dispatched one at a time** — a batched reviewer would have to be cold on
   unrelated analyses at once, and three parallel deep reviewers is what met the session limit on
   2026-08-10.
   **What it is handed.** Both self-report contracts state the five inputs — the scratch path among
   them — and the `N lines, read to EOF` proof; neither is restated here. **Three of the five take a
   different form on this path**, because the object is a fix **already on disk** over a site set the
   row did not define: the finding **as step 2 corrected it**, not as the row worded it; the working
   tree as it stands, not a drafted replacement; and, in place of the whole prompt file, **every file
   step 1 measured, read whole** — the untouched ones above all, since that is where the sweep either
   holds or does not (`REC-069`'s fourth copy fell only to a reviewer reading the family). That set is
   a **floor, not a ceiling**: the dispatcher names it, because unnamed it resolves inside a saturated
   context to the files the fix happened to edit, and a site the reviewer finds outside it is
   `sweep: incomplete` — a short measurement is the failure step 1 exists to catch, so bounding the
   reviewer by it would only move the blind spot.
   **Its return carries two lines beside the verdict token, and a persisted return missing either one
   is a partial return rather than a verdict** — the standard's two-part test is not sufficient on a
   path where the edit is already on disk when the reviewer dies. `sweep: complete` /
   `sweep: incomplete — <sites still owed>`: *right but incomplete* is neither a wording note nor a
   rejection, so it leaves the row `open` and the edit parked **whatever the token says** — the three
   tokens were written for a drafted edit, and this path has already improvised a fourth (`revise`).
   Then the two-map test's own declaration, `maps unaffected` / `maps: <map> — <row>`, because the
   reviewer is the last gate before the commit that has to carry that edit.
   **The rounds are what this gate costs, and the loop has four controls.** Only `reject` or
   `sweep: incomplete` opens a round — `approve-with-tightening` means what it says: apply it in the
   form approved and close the row. The reviewer passes the bar it applies, so a finding that changes
   the *cost* and not the result is a tightening and never a blocker. **Two rounds, and a third does
   not repair: it re-scopes** — revert the out-of-scope edit, open it as a row of its own carrying the
   revert and its reason, and let the reduced fix stand alone. A repair states no new fact. Round N is
   handed round N−1's return, whose *considered and not opened* list binds it — a cold reviewer
   re-litigating a settled adjudication is the loop, not the check. The instances, the shapes that
   produce a fourth round, and the two tests before splitting are in
   `_recommendation-resolution-doctrine.md` → "Step 3".
4. **Collapse the row into `## Closed`** — only a `sweep: complete` review returning `approve` or
   `approve-with-tightening` may reach this step; `reject` and every incomplete sweep leave the row
   open under step 3. The one-line closure carries the ID, what the item was,
   `cold reviewer: approve | approve-with-tightening`, the two-map declaration, and the implementation
   commit. This reviewer field starts with `REC-107`;
   historical lines are not retrofitted. Before collapsing, promote any rule the row established that
   governs **future** work into `_recommendation-resolution-doctrine.md`, the file this preamble's steps
   cite. A rule that other items obey must not stay buried in a
   row about something else; that is how the `REC-025` precedent came to be cited seven times from
   inside a row about SQL specialists — and misread every time, which is the second reason to promote a
   rule rather than cite it across rows.

   **A closure has a budget, and it is one line plus at most one promotion.** Written 2026-08-18, when
   this file was cut from 324k characters to a third of that. The engine that produced those 324k was
   not the open rows — they were 3% of it — but a closure that cost about 5k every time: a `## Closed`
   "line" of a thousand characters restating the whole resolution, two or three fresh preamble rules,
   and a retrospective paragraph under the order section. All three failed a rule this file already
   carried. So: the closure line is the schema above and nothing more, and the reasoning is in
   `git log -p` on this file, where the row's own commit already put it. A rule the row established is
   **merged into the rule it is an instance of**, cited as `Also REC-NNN` with the one clause it adds —
   a new standalone rule only where no existing one covers it, which is rarer than it looks. And the
   pricing lesson goes in the doctrine's row-shape table as a row, never as a paragraph. If the closure will
   not fit that budget, what is over-running is the promotion, and the test is whether the extra text
   states a rule a future row must obey or retells the case that produced it.

**Every row shape this ledger has seen, and what each actually costs, is the table in
`_recommendation-resolution-doctrine.md` → "Row shapes, and what each actually costs".** Price the row
against it before analysing anything; each of its rows was written by an item that was priced wrong on
arrival, and a new pricing lesson is added there as a row and nowhere else.

**Collapsing rows by script: split on `(?<!\\)\|` and assert exactly 7 fields per row.** A plain
`split('|')` silently deleted a just-written row on the first attempt, because cells legitimately carry
escaped pipes (`REC-060` quotes a shell pipeline). The row was recovered only because the collapsed
count disagreed with the hand-written list by one — so count both sides and compare the ID sets before
writing anything. The strict field assertion then caught a *second* case, an unescaped `|` that was also
breaking the table's rendering.

**Moving an item to `applied` includes the two-map test** — `_session-rules.md` → "The two maps follow
every change to the machinery". An item that changed what a file contains, who writes it, when something
runs, or which prompts and skills exist carries its `README.md` / `_system-map.md` edit **in the same
commit as the fix**; one that changed none of those is reported as `maps unaffected`. **The `## Closed`
line carries that declaration in the line itself**, so a later reader can tell a checked map from a
forgotten one. The 46 lines written on 2026-08-07 do **not**: seven old rows carried a declaration and
the collapse dropped all seven, so for those the evidence is in `git log -p` and the field starts with
the next item collapsed.

## Open

**Unfrozen 2026-08-10, the same day it was frozen, and the table is scoped instead.** The freeze said no
row is resolved one at a time until a whole-system review has run, and its unfreeze condition was
`REC-070` (b) — which has now been **deleted** under the scope test above, so the gate could never open.
A gate that cannot open does not slow a table down, it stops it, and this is the second condition on this
table to fail that way in one day.

What the freeze was defending against is real and survives as a rule rather than a stop: every resolution
dispatches a cold reviewer, a cold reviewer is paid to find things, and what it finds becomes a row —
`REC-081`, `REC-086` and `REC-087` were each raised by the reviewer of a *different* row, which is how the
queue came to refill at the speed it drained. So **the scope test is applied to the reviewer's findings
too, at the moment it returns**, together with the incidental-finding bar the doctrine states: a finding outside the
machinery is written into the closing line of the row whose review found it, and never opened.

**Workable intake reopened 2026-08-13; `REC-054` remains separate and accruing.** The first `/system-gaps` run's five rows
(`REC-088`–`REC-092`) closed on 2026-08-11; the second run's five (`REC-094`–`REC-098`) closed by
2026-08-12, and `REC-099` the same day. `REC-100`–`REC-102` and `REC-104` came from the `/system-check` run that **blocked**;
`REC-104` closed 2026-08-13 and its required skill sweep raised `REC-108`, which closed the same day;
`REC-100` closed 2026-08-13, the last of that cluster;
`REC-102` closed 2026-08-13 as a false positive, its residue handed back to `REC-085`'s G1b route;
`REC-105` records the portfolio defect found while reviewing the attempted adjudication of that run.
`REC-107` came from neither: a session review of **this file's own cold-review gate**
(2026-08-12), which is the one piece of machinery no run's self-report can report on, because every
close-out that would report it is downstream of a gate written for a different path. Its pair
`REC-106` — what that gate is handed — closed the same day.
Say the workable number and name the accruing one separately; they are not summed. **An
empty table is not a finished system**: it means the next row comes from a run, not from this file, and
`/system-gaps` and `/system-check` are what produce one.

**The `/system-check` rows carry a third disposition — `contradiction` — and it inverts what step 1
proves.** An `absence` row has to establish that something is missing; a `contradiction` row arrives with
**both clauses already quoted from disk**, so step 1 is not "does this exist" but **"which clause is
operative, and does anything already own that answer"**. Three outcomes, and the row must name all three
in advance so the analysis can honestly reach any of them: a **real defect** (the clauses cannot both
hold and one is wrong), an **ambiguity** (both hold under a distinction neither states, and the fix is to
write the distinction, not to delete a clause), or a **false positive** (a rule already resolves them and
the reader missed it — close the row and, if the resolving rule was hard to find, that is itself the
finding). **When a clause is quoted from a `SKILL.md`, check its YAML `description` against its own
body before ruling** — they are two documents, the description is the copy loaded into every session's
skill listing and read *instead of* the file, and `REC-102`'s only real defect was a description
claiming an ownership its own §2 disclaimed. **When a clause turns on a configuration key, open the
*receiving* component's own `## Configuration` block before ruling.** A key the dispatcher fails to pass
is one defect; a key the receiver never **declares** is a stronger one, and it forecloses the ambiguity
branch outright — both clauses cannot hold "under a distinction neither states" when one side is
structurally incapable of stating it. `REC-114`'s reviewer had no `MODE` key at all, so its behaviour
was identical in both modes and no wording anywhere could have reconciled them. The corollary decides
where the fix goes: **a mode binds through the receiver's config block, never through the dispatch's
prose**, so such a fix also closes that component's *standalone* path and not only the orchestrated one.
`notes-audit`'s `append-only`, declared in each downstream component's own config, is the same shape
already closed this way — a family that has solved the shape is the strongest corroboration a fix of it
can have, and worth looking for before inventing one. Verify the quote against disk first: a row of this shape
is only as good as line numbers that have not moved. **An edit to this file moves them**, so an insertion re-points every citation below it
in the same commit — `REC-106`'s seventeen inserted lines silently falsified four citations in the row
it was paired with — and a
citation written by **name** (`step 4`, `the two-map paragraph`) does not rot in the first place. **Never resolve one by reconciling the two clauses into a third thing neither said** —
find the file that already owns the decision. The first portfolio cluster demonstrates the evidence rule,
but **not** a compliant resolution procedure: `portfolio-audit.md` ceded gate order to
`_planning-standard.md` §23, so that owner settled the gate-order clause, but the source edit landed in
`0ea21949` and its map correction followed in `91d2c595` instead of the same commit. A later review also
found that the CV-option handoff remained contradictory; that residual defect is `REC-105`. The reusable
precedent is therefore only `REC-093`'s lesson: **quote the owning file, never paraphrase it**. It is not a
licence to bypass the four-step resolution or the same-commit map rule.

**The `/system-gaps` rows carry a disposition the other rows do not, and it changes how they are
resolved.** A row marked `absence` rests on nothing in either map saying the thing, so it names **both
branches** — the machinery lacks it, or the maps failed to record it — and the **one file** whose read
settles which. Step 1 of the procedure above is therefore not optional for them and not merely advisable:
read the settling file first, because a row whose absence branch turns out to be the map's is a `/system-check`
or `map-sync` repair and never an edit to the machinery. `/system-gaps` is forbidden to open that file
itself, which is exactly why the row can only be half-decided when it arrives.

| ID | Source | Recommendation | State | Resolution |
|---|---|---|---|---|
| REC-054 | Victor, 2026-08-06, alongside the two-map rule; **reshaped 2026-08-10 on Victor's own falsification of it** | **The lived-day review cannot be scheduled, because its evidence does not exist — so it stops being an audit that is run and becomes a verdict that accrues while Victor studies.** What it judges is unchanged and is still the only question nothing else in the system asks: do the current 08:00, 12:30 and 13:30 loops fit a real day, are the interview opener's grading and the block closers cheap enough to keep running, what does each block leave unrecorded, and does ritual load outweigh the work it records. Its original day snapshot is also still obsolete — the 13:30 block now has `interview-prep-block-open` plus `study-block-close`, authored/refined/studied state is separated, and there are seventeen mirrored skills. What changed is that **there is nothing to judge yet**: the rituals have barely been exercised, so the review has no input and would fabricate one. Three parts, in order. **(a) A capture point — built 2026-08-10, `_internal/_ritual-friction.md`.** `_skill-friction.md` accepts only an observable *failed declared step* (`FRIC-NNNN`), so the complaint that will actually occur — "this ritual ate the block", "nothing ever reads this output", "I do it by hand anyway" — was unrecordable and died in the session it was said in. It is the machinery-level instance of exactly what `sql-block-close` was built for: **friction without failure**. It is a separate file on purpose: `FRIC` rows are adjudicated by the next close-out's four-condition bar and can become a `REC`, which is the one thing (b) forbids, and one file holding two kinds of row under a consumer that counts them is the `REC-074` smell. **(b) The rule that keeps this out of the refill loop:** a ritual-friction line **never opens a `REC` and never dispatches a cold reviewer**. One line, written as it is said, accumulating. **(c) The verdict, per ritual, once its evidence is enough to rule on** — kept, thinned, or deleted. This is the only item in this ledger licensed to **remove** machinery; every other row has added a check, a pointer or a rule | accruing | **Not workable, never scheduled, and it gates nothing** — it is the one `accruing` row and the reason that state exists. Its original sequencing said to run it once the machinery stopped moving, and that premise was the wrong one: the binding constraint was never **motion**, it was **absence of use**, which no amount of waiting for the machinery to settle repairs. Its input is the `RITF` rows themselves plus whatever `_run-tracker.md` shows has actually run — not a measurement pass built for it, which is what `REC-070` (b) was and why that row is gone. Do not schedule it and do not let it block a row again. **(a) shipped 2026-08-10** — the sink, its `_session-rules.md` trigger and its `_system-map.md` §7 and §11 rows — so the row is now fillable and what remains is (b) holding in practice and (c) having something to rule on. **(b) is not a build: it is a prohibition**, and it is stated in all three places at once (the sink, the session rule, this row) rather than in one, because the failure it prevents is a future session skipping straight to a `REC`. `REC-055` (e) was parked with it and is **unparked 2026-08-10**: a map that states *which* rituals fire in which block is a structural description, and this row is a verdict on whether they are worth their cost — the two do not collide, and the second is not a prerequisite for the first. Maps unaffected by this reshaping — no prompt, skill, writer, trigger or file existence changes |

## Closed
- `REC-156` — `simulation-review-prompt.md` owed the tracker's `Route progress` cell and no run wrote it; the `sql-exercises` shape quoted into its `## Final step`, family measured as one prompt · cold reviewer: approve-with-tightening · maps unaffected, read-path verified — `80437497`
- `REC-155` — `_pipeline-self-report.md`'s «Tracker outcome» sent a cell-less orchestrator to a heading no tracker has; the global table's intro widened to its real population and the zero-member `otherwise` branch deleted · residue: `simulation-review-prompt.md`'s missing `Route progress` write, opened as `REC-156` · cold reviewer: approve-with-tightening (round 1 reject) · maps: `README.md` l.349 in its own commit `d6677e6c` · `09baf1c8`
- `REC-154` — `_note-quality-standard.md` routed every notes component to `PROGRESS.md` to find which project applied a concept, three copies of a route dead since 2026-08-03; replaced by one `## Which project applied a concept` section keyed on the coverage `✅ NN-slug` marker and cited by name from all three · cold reviewer: approve-with-tightening · maps unaffected · `6b4a5109`
- `REC-153` — `evidence-intake-prompt.md`'s Step 5 named a `_run-tracker.md` heading no tracker has and a solo commit its own contract forbids; both deleted in favour of the stronger delegated clause · residue opened as `REC-155` · cold reviewer: approve · maps unaffected · `40f3d470`
- `REC-145` — *one file, one schema* carried a **schema** claim and an **append** claim under one name: real defect on the first, ambiguity on the second; option (B) removed outright, and its reader in `_sql-exercises-review.md` Step 2 with it · cold reviewer: approve-with-tightening (round 1 reject) · maps unaffected · `d0ba3f9b`
- `REC-143` — two files said the pasted `sql-exercises` config has four keys and four said five: a stale enumeration, not a disagreement; `_sql-plan-standard.md` Section C now dereferences the definer, and `sql-plan-audit`'s specialist 4 reaches any enumeration of a prompt's key set · **owed and fired by no gate**: `/sql-plan-audit SCOPE = full LEVEL = junior` · cold reviewer: approve-with-tightening · maps unaffected · `eccfd7d0`
- `REC-144` — **ambiguity.** The insertion contract's "no gate would work" is not falsified by `REC-115`'s per-topic `git status --porcelain`: different subject, and neither practice prompt reads the tree; one sub-clause reworded from the audit's vantage, no clause weakened and no gate built · cold reviewer: approve-with-tightening · maps unaffected · `ca0435c0`
- `REC-151` — `_interview-prep-write-prompt.md`'s "Where to look, by topic" routed code sourcing for 10 of `FILE`'s 12 topics; `javascript` routed to `.ts` under a valid-as-written constraint, `spring` swept in · cold reviewer: approve-with-tightening · maps: `README.md`, both interview-prep rows' Reads cells · `e9d09f73`

**One line each, using the closure schema in step 4 above.** Nothing else — the full reasoning of every
one of these lives verbatim in `git log -p` on this file, so restating it here buys nothing and costs the
readability of `## Open`, which is what this ledger is for. Beyond the required fields, a **rejected**
item keeps its reason, because that reason is the only thing stopping the next analysis re-raising it,
and a **residue** clause names work the item left open. If a line needs a paragraph, the rule it
established belongs in the doctrine instead. Ordered by ID.

- `REC-001` — a live-repo/dependency fact-check gate for the notes author — `—`
- `REC-002` — coverage may take a controlled diff input when sections are restructured — `—`
- `REC-003` — `progress-update` Step F follows the active-branch rule; `main` only receives merges — `—`
- `REC-004` — misplaced pure-Java entries move before additions when the Java section already exists — `—`
- `REC-005` — blocking clarification questions carry options, consequence and recommendation only — `—`
- `REC-006` — canonical workflows separated from Claude/Codex runtime syntax; shared standards and dual launcher catalogs — `2a54d95`
- `REC-007` — platform-specific tools, shell syntax and literal tier names out of the canonical coverage workflow — `—`
- `REC-008` — coverage bounded to the junior hiring floor: topic budgets, an evidence-backed stopping rule, ownership boundaries — `6541792`
- `REC-009` — the 12 generated topic files recalibrated to the compact baseline and fact-corrected — `6541792`
- `REC-010` — a verify-gap fast path: a run consuming only verified gaps skips the market-floor re-derivation — `a178819`
- `REC-011` — `notes-plan` rule 6 permits same-level renumbering of a bilingual pair, reported as `renumber NN -> MM` — `9b4d4b1`
- `REC-012` — **rejected.** An adjudication rule for cross-concern ripples: the existing protocol reached the right result in both runs, so this was friction, not a defect — `—`
- `REC-013` — `_planning-standard.md` §14 gains a real visual system (design tokens, motion, accessibility, visual QA) and a pass line that enforces it — `279c1c9`
- `REC-014` — invariant 12: every §10 endpoint is called from §13 or explicitly ruled backend-only with a reason — `984ff41`
- `REC-015` — a seventh `plan-audit` specialist, `whole-plan`, reads the plan end to end against twelve fixed checks — `013f1bb`
- `REC-016` — self-report bullet 1 must name its evidence: traces support "the machinery ran", never "the output is sound" — `fe4274c`
- `REC-017` — same-level English-only renumbering permitted under standing authorization; cross-level relocation stays bilingual-only — `62f5673`
- `REC-018` — an uncalibrated level is not a first run; only an admitted, empty junior topic activates boundary migration — `8addfcd`, `ee7f23b`
- `REC-019` — an unassigned note does not reserve its prefix: it is renumbered above the route's last entry — `7a90dfc`
- `REC-020` — the SQL route owns the revision points' spans and triggers; the doctrine keeps only the cadence — `49c1e62`
- `REC-021` — `ROADMAP.md` scoped rather than dropped as a route-planning input: two named sections, not the whole file — `49c1e62`
- `REC-022` — **rejected.** A per-step `Learning outcome` field: `Done`, `Q&A seed` and `Concepts` already carried it, and it would have invalidated all 14 steps of a just-committed route for no output difference — `—`
- `REC-023` — `sql-plan-audit` row 4 owns the **whole** doctrine; the other rows' sections are exhaustive, its are not — `5d252c6`
- `REC-024` — a SQL step ends when its exercises are scored; both removed done-condition formats are forbidden by name — `c89c415`
- `REC-025` — specialists own **one concern each, never a section each**; its bar-condition-3 precedent never licensed skipping the cold reviewer, which preamble step 3 now closes — `7348bad`
- `REC-026` — every coverage preservation rule names **both** marker kinds, drill marker left of the project marker — `e039aea`
- `REC-027` — `⚠ stale` gains a second writer (`coverage` Step 6.6) and `Plan status: stale` its first; `notes-plan` resets it — `e039aea`
- `REC-028` — the `notes-audit` dependency gate accepts `complete` **or** `refined`; pending additions are reportable, never blocking — `e039aea`
- `REC-029` — `coverage-verify`'s format block declares `Verdict: superseded`, the third value only `coverage-prompt` writes — `e039aea`
- `REC-030` — `notes-plan` and `notes-audit` gain the mandated run-start read of their own `_last-run-report*.md` `Status:` line — `e039aea`
- `REC-031` — a full recalibration takes `LEVEL`-targeted gaps from sibling findings files, never mutating the sibling — `e039aea`
- `REC-032` — the three shared-root inputs are repository-relative in both coverage prompts — `e039aea`
- `REC-033` — the progression gate has one definition, in `_coverage-standard.md`, with named observable evidence — `e039aea`
- `REC-034` — sibling coverage added to the read list, outcomes reduced to three values, renumbering corrects its tracker rows — `e039aea`
- `REC-035` — every overtaken cell carries a measured `⚠ stale` flag with a `(fingerprint only)` form; eleven plan headers set — `e34f47a`
- `REC-036` — `plan-audit MODE = new` rewired off the deleted `PROGRESS.md` sections onto the `✅ NN-slug` evidence markers — `bb16566`, `5c39d11`
- `REC-037` — `/project-brief`: the next-project choice becomes a durable, dated, contestable one-page brief — `fdea4d8`
- `REC-038` — five smaller `plan/` defects; two of the five diagnoses were themselves wrong — `95a9626`
- `REC-039` — `progress-update` becomes an **auditor**: one write (the level matrix), a `git diff` guard, concept extraction tombstoned — `2417c25`
- `REC-040` — the catalogue's "slash command of the same name" was false for 21 of 28; fixed as a paragraph, not a rename, since `/code-review-practice` must not re-collide with the host built-in · maps: README · residue promoted to `REC-082` — `2b73c64`
- `REC-041` — `whole-plan`'s ten orphan sections are audited against their **section spec**, not a pass line none of them has — `06113cf`, `5c39d11`
- `REC-042` — `roadmap-review`'s gap analysis rewired onto the per-level evidence markers; 21 stale `PROGRESS.md` references fixed — `7d64dc2`
- `REC-043` — six `review-audit` defects in the parts a run never re-reads, starting with the missing frontend security lens — `bf95885`
- `REC-044` — the unreviewed-code gate gains a second signal: a dated `## Closed` backlog line, because a fix campaign moves no step — `b301d4b`
- `REC-045` — `REC-039`'s demotion propagated into the files that schedule the run; a gate closes on an empty drift report, not on the run happening · residue checked 2026-08-10 and closed as a false positive — `3edfe77`
- `REC-046` — **rejected as a ledger item, not as work.** It asked for a campaign of interview-prep prompt *executions*, which `_run-tracker.md` records better than a row can. Promoted *an unrun prompt is tracker state, never a recommendation*; the missing `interview-prep-route` tracker row was added in this commit · maps unaffected — `fdda1214`
- `REC-047` — already resolved in the live notes contract; the row's search for the obsolete label `Coverage bullets:` was a false negative · maps: affected in the original change — `badf828`
- `REC-048` — `PROGRESS.md` split into `Coverage demonstrated` / `Study progress` / `Practice completed`, by level, each owned by its closing ritual; a stale denominator prints `—`, never a false `0%` · maps: both — `b9e2990`
- `REC-049` — **rejected.** False positive: `project-brief` already keyed on `✅ NN-slug` markers and excluded `✅ sql:*` drill markers from its birth in `fdea4d8`, before the row opened · maps unaffected — `—`
- `REC-050` — `/roadmap-review` ran at G8 on `REC-042`'s rewire, consumed the preserved SQL drift and aligned `ROADMAP.md` with the current gates · maps unaffected — `4886805`
- `REC-051` — the review gate measures **unreviewed code**, not a 30-day clock; the date is reported, never obeyed · residue promoted to `REC-083` — `70956ce`
- `REC-052` — timed simulations become a level-planned, coverage-fingerprinted route: immutable timed evidence, `simulation-grade` the only cold-review door, consumed MISTAKES rows · maps: both — `42a34753`
- `REC-053` — inline study writing confined to refining an already complete planned pair; it cannot create, number or complete a note, and prose debt routes back through `/notes-plan` → `/notes-audit` · maps: both — `40fb918`, `b9e2990`
- `REC-055` — the map stated the machinery and not the loop that maintains it; (a)-(d) shipped in `7bcc5bc`, and (e), the missing per-day view, is now §13 — which skills fire in which block, each block's opener/closer/cold-dispatch, and the four asymmetries. Three of the row's own claims were corrected in the fix, including Victor falsifying its premise mid-fix: **a block is not a clock** · cold reviewer `approve-with-tightening` on nine defects, all nine introduced by the fix · maps: system-map only — `b8f710c1`
- `REC-056` — `/system-check` created as a prompt-only, explicit, on-demand whole-system audit; never scheduled, never per commit · maps: both — `a240dcb`
- `REC-057` — four declared-but-untested invariants become real validator checks (skill mirror, coverage mirror, plan fingerprints, dead paths); 30 stranded paths repaired · residue promoted to `REC-084` — `2a7a632`, `8e21ef0`
- `REC-058` — observable failed skill steps append `FRIC-NNNN` evidence, adjudicated by the next close-out under the four-condition bar; silent-success defects stay an explicit limit · maps: both — `97f670e`
- `REC-059` — practice weaknesses persist in sinks the next run consumes: rubric-specific for simulations, surface-qualified and shared for the three live interview surfaces; they never author coverage · maps: both — `42a34753`
- `REC-060` — the canonical coverage digest strips `CR` before markers, so LF/CRLF/mixed checkouts hash identically; six local rule forks now point at the one owner · maps unaffected — `c0018200`
- `REC-061` — remeasuring the eleven stale junior plans proved only Java and Spring Boot were pre-`REC-060` CR false positives; the other nine stay stale · maps unaffected — `3b32cc90`
- `REC-062` — the two-map rule gains a **second trigger, a read**: a whole read licenses a ruling on the rows about that file, a partial read only on a contradiction, and the verdict is said out loud · maps: system-map — `716da55`, `49a1dca`
- `REC-063` — the walk becomes the `map-sync` skill, mirrored to both adapters and firing on both triggers, because §7 gets corrected while the §9 row and §11 row keep the old story; validator invariant 5 catches a non-firing · maps: both — `098d87c`, `b476f31`, `eeb89ed`
- `REC-064` — the cold review `REC-062` never had: 9 defects, none catchable by any automated check. Promoted *a rule restated is a rule forked* · maps: system-map — `c166938`, `8eb33d9`
- `REC-065` — the cold review `REC-063` never had: validator invariant 5 was passing 2 of the 28 prompts **by accident**, on unbounded case-insensitive matches. Promoted the bounded, case-sensitive, read-never-guessed name rule · maps: system-map — `6f7ce6d`, `b2d0e08`
- `REC-066` — the coverage rationale is retained history, not a live run input; single-shot Step 3 now stages the report **and** `_run-tracker.md` · maps: corrected in its own commit — `7f7a9123`, `d298c636`
- `REC-067` — the launcher argument contracts become validator invariant 6: identical hints across both catalogues, keys in both directions, values only where both sides state a closed set. The work was the **locator**, not the contracts — a naive parser called 15 of 31 prompts broken. Its cold reviewer injected 20 defects and found 4 real misses; four further bugs were found by making the check fail rather than by reading it · maps: README (one row owed and paid); `_system-map.md` §12 verified unaffected, it delegates the invariant list by design — `72fe2798`, `ec87cc37`
- `REC-068` — `/system-check` narrowed to a **machinery** audit (live state out of its inventory, 9 steps → 8, validator gains `-MachineryOnly`), and the two maps split by owner: `README.md` owns per-prompt facts, `_system-map.md` owns wiring and per-skill contracts · maps: both — `0d1b8a5d`
- `REC-069` — the inverted per-project gate chain lived in **four** project standards, not the one the row named; all four now state their gate position and point at `_planning-standard.md` §23 · maps unaffected — `d1a60c92`
- `REC-070` — **rejected as a ledger item, not as a question.** It asked for a machinery evaluator over the two maps, whose load-bearing half was the **usage** dimension — `_run-tracker.md`'s question, which the tracker answers better than a new global prompt would. Its (a) was promoted instead (*a map's freshness is verified from git, never by re-auditing*), and its (c) split axis was already settled by `REC-068` · maps unaffected — `{commit}`
- `REC-071` — the stale runnable count in `_single-shot-self-report.md` was **deleted, not corrected**: an unguarded third copy of a number the validator asserts in code and both maps publish · maps unaffected — `dc2bef68`
- `REC-072` — the external-path preflight banner was missing from **three** prompts, not one; `profile-readme-prompt.md` also had to name its second external path · maps unaffected — `e2c32a36`
- `REC-073` — the SQL doctrine fence named one writer and there were four: **authoring a value and correcting one are different rights** (promoted) · maps: README carried the false cell · residue promoted to `REC-085` — `5af88b7b`
- `REC-074` — the simulation level-close gate was written in two vocabularies, a step state and a row count, with the mapping between them stated nowhere, so the two were never comparable; the mapping is now defined once, in the standard · maps: README — `21a091fe`
- `REC-075` — the coverage-mirror question was never about reliability but about what a read is **for**: a spot lookup is free, a cross-topic enumeration needs a quoted validator PASS, a measurement is read from the topic files · maps: both — `afb9e57d`
- `REC-076` — `/system-check` could prove a map cell **false** but never **complete**, and published the absence anyway; Step 4 gains the missing evidence → claim direction and a third disposition, `unverifiable`, and the absence rule now governs every verdict · maps unaffected — `d3f5c07b`
- `REC-077` — **rejected.** `/system-check`'s survival of a session limit is accidental rather than designed, but no run has ever produced a wrong result from it and `REC-080` has since shipped the dispatch ladder covering the general case. Re-open on the first death landing *after* the completeness gate closes · maps unaffected — `{commit}`
- `REC-078` — **rejected.** The Step 6 → Step 7 seam is unspecified in both directions, but the branch has been executed twice (`feb6818c`, `b38ee45e`) and the orchestrator improvised it correctly both times. Re-open on the first run that gets item 8 wrong · maps unaffected — `{commit}`
- `REC-079` — Step 2C dispatched an analyst whose output no step consumed; **deleted**, because a derived extract of the object under review is worse evidence than the object at any size (promoted). Its cold reviewer caught that the deletion also orphaned the two maps' only manifest owner · maps: README — `d3f5c07b`
- `REC-080` — the row asked for persistence "before returning", the one moment a mid-flight death never reaches: the reviewer now writes each finding as it reaches it, and a launch failure, a runtime error and a session-limit death became one case taking one ladder · maps: system-map — `c4fa62c6`
- `REC-081` — **rejected.** `project-brief` and `plan-audit` digest the coverage **mirror** where the standard's canonical command names the **topic** files, but it is already a documented named exception, and changing what a gate hashes *moves the gate* — every stored brief digest would go `superseded` at once. Re-open only if a brief is ever wrongly refused as stale · maps unaffected — `{commit}`
- `REC-082` — a skill written as a slash command in `progress-update-prompt.md`'s drift-report example; fixed to the bare name, and the convention stated where it is owned (`_session-rules.md`, not the derived maps) · maps: `README.md` edited as the rule's site and not as a map — `161f5db2`
- `REC-083` — G4's justification argued from the backend's date after `REC-051` retired the clock; the owner now argues from what G3 reviewed. The project plan's word-identical copy was **not** hand-edited — it crosses §7's writer fence and became `REC-087` · maps unaffected — `0d17e220`
- `REC-084` — a declared output was exempt from the existence check by **shape**, so `03-jions.sql` passed as readily as `03-joins.sql`; invariant 7 now checks the 50 declared SQL exercise references against the 20 names in their level route's §1, harvested from the first cell of each row. Four bugs were found only by making it fail and none by reading it, one of them a literal `§` in a BOM-less `.ps1` that matched nothing at a clean PASS · cold reviewer: reject, then approve-with-tightening — the two worst defects were introduced by the fix, including a locator widened to the whole row that silently re-opened the hole · maps: README only, `_system-map.md` verified row by row — `ad07ff1d`
- `REC-085` — **rejected as a ledger item, not as work.** `practice/sql/PLANNING.md` mis-states who refreshes its own §0 in three places, but the doctrine's declared writer is `/sql-plan-audit` and hand-editing it here would breach the very fence `REC-073` was writing. It closes at gate G1b, on the run · maps unaffected — `{commit}`
- `REC-086` residue — `$exclusivePattern` carried **no tool names at all**, the structural reason two survived 30 files at PASS; it gains the names that cannot be ordinary English or a unix tool, and two prompts are reworded. What stays uncovered is named in the code — the bare words and the `X tool` form, live in 13 files restating `_session-rules.md`, which is exempt by name; that fork is a `REC-064` problem, not a runtime-isolation defect · maps unaffected — `b01ff68c`, `ec87cc37`
- `REC-086` — the mid-flight-death rule in `sql-plan-audit.md` was not merely forked but **narrowing**, having dropped the ladder's load-bearing first rung (*read what it persisted*); collapsed into a pointer, and the row's "the `SendMessage` mechanics stays" was half wrong and corrected. Promoted *a pointer names its target; a direction is not a target* · cold reviewer `approve-with-tightening` on three defects, all three introduced by the fix · maps unaffected, verified on both — `29f4b18d`
- `REC-088` — the rulebooks had no authorship fence, and the settling read put it on the **machinery** branch: the de-facto writer was already single, so the missing row was a **prohibition** — by hand only, never a prompt run — because the population includes the two self-report contracts, so a run authorized to edit them is authorized to delete its own cold-review gate · cold reviewer `approve-with-tightening` on two must-fixes, both introduced by the fix · incidental recorded here, not opened: D1's class is wider than this population, and the new row is the only §7 row no read licence can reach · maps: system-map only, README verified unaffected — `8b405150`
- `REC-089` — two gates (the project chain's G6, SQL's G3) closed on a drift report that existed only as chat output; Step E now writes `_last-drift-report.md` on every run, the clean one included, carrying the scope line that says which project a clean verdict is evidence for, and Step F commits it alone · residue below the bar: the three gate cells naming this report could name the file instead, each owed to its own writer · maps: both — `37e2924d`
- `REC-087` — **rejected as a ledger item, not as work.** `07-timetrack/PLANNING.md` §23 owes three repairs, the substantive one being a gate list ending at G4 while §22 puts Steps 8 and 11 after the branch that triggers it, so the backend gains code after its last review gate with no box tracking it. Rejected on the ownership fence — §7 names three writers and a machinery session is none of them; the owner's half shipped in `0d17e220`, and it closes at `/plan-audit MODE = review` G2 · maps unaffected — `{commit}`
- `REC-090` — the improvement loop's only integrity trace was unenforced; invariant 8 now requires a report whose `Status:` says `applied in <hash>` to carry a `cold reviewer:` verdict, value enforced as a closed set, running in **both** validator modes · **both promoted rules came from the cold reviewer overturning the fix**, not from the six-case injection pass · residue below the bar: a report quoting the contract verbatim satisfies the token check, now a published limit rather than a silence · maps: both, plus `b8e24c50` correcting a false count found reading `README.md` whole — `e1ca4a00`
- `REC-091` — §0 had **two** daily writers and three files each claiming to be the only one; the six cells are now partitioned between `step-complete` and `backlog-task-close`, run order free, the second writer reading what the first left off a signal each ritual can evaluate · three cold reviews, two rejections, and every defect that mattered was written by the repair; one paraphrase would have deleted 07's live `G3 sign-off — condition met, action pending` and became `REC-093` · residue: §0's own header still names one writer, correctable only by `/plan-audit` G2 or the next ritual run — the `REC-087` fence · maps: both — `eb39578d`, `c1359309`, `e8b8c7f9`
- `REC-092` — the Q&A bank's five writers, three without a declared scope, and a standard whose header claimed four readers while its body addressed six. A practice insertion is now born unrefined in both languages, takes the three content-pipeline prohibitions, may reorder a section because **position is structural, not content**, and owes the route-stale handoff it creates · **six cold reviews, six rejections, every finding a defect the repair had just written** — the record on this table; four consecutive rounds died on one question, each addressing the rule to something that could not evaluate it · residue below the bar: `/progress-update` reports one-sided-marker drift to a skill with no step that repairs it · maps: both, plus README's second and third writer registries — `1d619663`
- `REC-093` — invariant 10 derived §0's `Next gate` from "the first gate whose **trigger** has not fired yet", naming G4 on 07 while `G3 sign-off — condition met, action pending` was the live state; it is now scoped to §23's chain quoted verbatim, with the tiebreak, the terminal case, and **`signed off` defined for the first time** — the checklist box read *of the project branch as it stands*, plus any stricter §23 condition · cold reviewer `revise` on nine, the blocking one written by the fix, and three more the fix's too · incidental recorded here, not opened: three sites carry the old phrasing, one of them a doctrine whose writer is not a machinery session · maps: `_system-map.md` §7 only — `3fa116b5`
- `REC-094` — the settling read found real missing routing: `README.md` now places `/code-review-practice` alongside timed simulations once ROADMAP's 12:30 block reaches Stage 2, without adding it to their route or 15-test denominator, and `_system-map.md` §11 makes that state discoverable · cold reviewer `approve-with-tightening`, then `approve` · maps: both — `98397e78`
- `REC-095` — `/hr-screen` had a complete live-call loop but no event that routed Victor into it; application work or a scheduled HR call now starts the first run, and open `hr-screen` mistake rows drive later retries without creating a gate or replacing `/simulator` · cold reviewer `approve` · maps: both — `00ce4303`
- `REC-096` — the optional polished-answer file was not orphaned: `hr-screen-prompt.md` already makes it a Victor-facing study aid, while later mocks deliberately retry from `practice/interview/MISTAKES.md` without a script; both maps now declare that human reader and the non-consumer boundary · cold reviewer `approve-with-tightening` · maps: both — `895a7e57`
- `REC-097` — the missing `projects/README.md` producer was on the **machinery** branch: the index was created by hand, no prompt writes it, and `/project-brief` consumed it with no provisioning or freshness contract. Victor now owns its published inventory and Guard 5 refuses a missing file or unequal folder-prefix / `#` sets, explicitly not claiming same-number rename detection · cold reviewer `approve-with-tightening` · maps: both — `0dd5d3ec`
- `REC-098` — the settling read falsified the named absence: `internship-daw.md` existed under `main/job-search` while every apply contract pointed at a nonexistent `main/personal/job-search`; the whole live apply surface now uses the real root and §7 records the complete mixed writer set · cold reviewer `approve-with-tightening`, which found four live launchers still injecting the dead root · maps: both — `5fa06429`
- `REC-099` — the commit-ownership contradiction was real but shallow, one stale clause against nine correct ones; the real defect was the file list — `whole-plan`'s twelfth check fixes `{project}/PROJECT-BACKLOG.md` and no `git add` or reading map carried it, so the fix was written every run and never staged. The row's own likelier-defect guess was a false positive · cold reviewer `approve-with-tightening` on seven defects, four written by the repair · maps: both — `6e9126f0`
- `REC-100` — the README hand-over promised "one commit command per README" and delivered one commit covering all of them; `_readme-standard.md` now states one granularity rule binding **both** writers — the unit is the change, never the file — and splits only *who runs* the commit. Both counter-readings the row demanded be tested were falsified rather than dismissed, and the sweep ran through the sentence's **readers** rather than its family, taking the site set from two files to six · cold reviewer: reject twice, then approve, every finding in all three passes written by the repair · maps unaffected, ruled row by row over the six-file set — `ba14b371`
- `REC-101` — self-report `Status:` now has one central four-state vocabulary; all 31 runnable prompts execute its run-start decision, legacy `open` reports are classified centrally without rewriting them, and malformed values fail validation · cold reviewer: approve (first review rejected) · maps: both — `d70181b1`
- `REC-102` — **false positive on its premise, and right about the file for the wrong reason.** §0's partition was already complete and in force in `_sql-plan-standard.md` Section E, and the legacy-path half was false too. The one real defect sat in the file the row cited and misread: `sql-step-close`'s YAML **description** listed §0 and PROGRESS.md's `Total` rows among "the part no grader can reach", against its own §2's "verify, do not redo" — output-affecting, since a §0 re-authored from scratch loses the close it was recording · cold reviewer: approve-with-tightening, three of four tightenings defects the repair wrote · residue: one site `REC-085` missed, §4 item 2 attributing the §0 refresh to a route file that has no §0 · maps unaffected — `1fafeea5`
- `REC-103` — **rejected.** The cited coverage machinery is coherent, not contradictory: `/coverage` preserves both marker kinds under a counted pre/post multiset check, `coverage-mark` authors project markers, `sql-step-close` authors drill markers, and `REC-026` already established the ordering rule. It failed the real-defect and deduplication bars before any repair was due · maps unaffected — `0f8eeee6`
- `REC-104` — `coverage-mark` now has one two-case commit rule: marker-only runs commit separately, while a calling ritual that authored and marked in the same run makes one coverage commit carrying `PROGRESS.md` and, on the authoring path, `_run-tracker.md`. The 17-skill × 2-adapter sweep found no other trigger/commit contradiction; two output-affecting sites split into `REC-108` · cold reviewer: approve-with-tightening · maps unaffected — `9d2d7d68`
- `REC-105` — `portfolio-audit` no longer commits two CV-bullet alternatives as if they were one polished downstream input: a ✅/⚠️ non-dry run pauses for Victor's choice, removes the rejected option, validates every project section in the staged file, then commits; ❌ and dry-run paths keep their own behavior · cold reviewer: approve-with-tightening · maps: both, in behavior commit `10aaed08`; reader/catalogue corrections from the whole-read sweep in `0ea5de0d`
- `REC-106` — the mandatory cold reviewer was handed nothing: step 3 named zero inputs, so "required sources" resolved inside a saturated context to the files the fix happened to edit — structurally unable to reproduce step 1's finding. It now receives **the set step 1 measured, read whole, as a floor and not a ceiling**, the working tree in place of a draft, and the corrected finding; and it owes two return lines, a persisted return missing either being a partial return rather than a verdict. `sweep:` names the outcome the three tokens have no room for · cold reviewer: approve-with-tightening · maps: `_system-map.md` §12 item 5; `README.md` verified unaffected — `b5a863fd`
- `REC-107` — recommendation closures now persist the mandatory review verdict; only `sweep: complete` plus `approve` or `approve-with-tightening` may enter `## Closed`, historical lines are not backfilled, and validator enforcement waits until the field has proved it gets written — as this line does · cold reviewer: approve-with-tightening · maps: `_system-map.md` §12 item 5; `README.md` verified unaffected · `95f03caf`
- `REC-108` — `study-content-writer` and `step-complete` now take their shared rules, commit authority, branch policy and progress handoff from `_session-rules.md` rather than the Claude adapter; all 17 skill mirrors remain identical · cold reviewer: approve · maps: `_system-map.md` §9 `step-complete`; `README.md` verified unaffected · `d9faabad`
- `REC-109` — **the row named one cause and re-verification found two, each sufficient to block**: Step 4 asked one orchestrator context to disposition 1,959 claim rows against 4,988 manifest facts, and both blocked runs additionally hit claims whose owning source states two mutually exclusive clauses, whose only disposition was the blocking `unverifiable` — so a sharding-only fix would have blocked again. Step 4 becomes 4a–4d: a mechanical partition of each map cut only at its own headings, one cold concern per span · cold reviewer: approve-with-tightening, its arithmetic defect written by the repair; the measured partition put 45% of `README.md` in one concern of twelve · sweep: complete · maps: both, in the fix commit — `f9492e00`
- `REC-110` — **real defect, and the row overstated how bare the reviewer was**: `coverage-verify-prompt.md` named `_topic-ownership.md` in its `## Configuration` block and never in Required sources, so the registry reached the run only as a word while the mandate forbade reporting another topic's items. Fixed by binding `TOPIC_BOUNDARY` + `ADJACENT_TOPICS` as the sibling does, adding the registry as a Required source, and separating *presence* (the grep) from *ownership* (the rows) · cold reviewer: approve-with-tightening, four tightenings applied verbatim · residue opened as `REC-149`: a rejected other-topic gap is still routed nowhere · maps: both, in the fix's own commit — `8553335c`
- `REC-111` — **real defect at the owners, one false positive, and the row named two of seven consumers**: `_shared-context.md` declared itself the single source for profile, target companies and market while `_roadmap-standard.md` mandated five `ROADMAP.md` sections on the same subjects, and the two had **already** drifted on disk. The fence is now stated from both ends and enumerated · cold reviewer: approve-with-tightening over two rounds (round 1 reject), every round-2 finding written by the repair · maps: both — `819d6c17`
- `REC-112` — **both contradictions real, and each resolved by holding the fence rather than loosening it**: `_notes-review-es-prompt.md` told Stage C to "read only `{ES_FILE}`" while the same prompt mandated the standard, a calibration file, a listing and `{PLAN}` — the clause fenced the **English note**, never the standard. The append-only freeze proof moved from a textual diff over a file the role may not open to `--numstat` metadata · cold reviewer: approve-with-tightening, three of four tightenings in text the fix wrote, including unpinned commands whose proof would diff against the index and return empty · maps: `README.md` in the fix's own commit; `_system-map.md` verified unaffected — `c0dcea25`
- `REC-113` — **half false positive, half a real defect narrower than the row**: the standard's bolded en/es mirroring rule reads as absolute but its own section authors English first *then* translates, so Stage A contradicts nothing — refused in writing, and promoted as the unqualified-heading rule. What was un-owned is the **standalone advertisement**: `_notes-write-prompt.md` offered a single-`en/`-file run and said nothing about what that run still owes · cold reviewer: approve-with-tightening, its one tightening a claim the fix wrote · incidental opened as `REC-150` · maps: — `f8d78640`
- `REC-114` — **real defect, and the row's "receives no mode" was the weaker half**: `_interview-prep-review-prompt.md` had no `MODE` key in its config block at all, so its behaviour was bit-identical in both modes and the reviewer rewrote realism, wording and voice on every unrefined question — exactly the `full`-mode diff `MODE = correct` exists to avoid. The reviewer now declares its own `MODE` and partitions its checklist · cold reviewer: approve-with-tightening · maps: `README.md`; `_system-map.md` verified unaffected. The write prompt's own stale row was corrected separately on the read trigger, `17555ef7` — `e7070910`
- `REC-115` — **real defect, and the row understated it twice over**: the blocked branch was unreachable (the orchestrator waited on a `BLOCKED` return no component was told to produce), and a partial author write did not merely survive — the per-topic commit stages the `en/`+`es/` pair wholesale, so half-written bytes shipped inside a commit reporting the topic as audited. Both components now declare `BLOCKED` plus what they changed; the orchestrator records a `{BASELINE}` and restores or declares · cold reviewer: approve-with-tightening, three of four tightenings to text the fix introduced · residue: the standard's "no gate would work" is now partly false and is `REC-144` · maps: `_system-map.md`; `README.md` verified unaffected — `cc0dc2f0`
- `REC-116` — **real defect on both readings, which is why no scope clause rescued it**: `sql-plan-prompt.md`'s "this prompt writes `PLAN` only" was falsified 35 lines below by the one-time doctrine split, and update mode writes `{LEVEL}`'s two `PROGRESS.md` tables on top. The sentence now states its real two-file division and a second paragraph declares the wider set by pointer · cold reviewer: approve-with-tightening over four passes · maps unaffected — behaviour unchanged and `README.md` already declared all three writes — `7ecfb801`
- `REC-117` — **real defect, and the row understated the damage**: one sentence in `sql-exercises-prompt.md` called the junior path table authoritative against four statements making `{PLAN}` §1 the authority. The sweep took two sites the row never mentioned, both able to send a run to the wrong file — the same clause listed two steps as sharing a file when they are Steps 1 and 3, so a `join-pitfalls` run would have inflated Step 1 and left Step 3 unclosable · cold reviewer: approve-with-tightening · maps: `README.md` corrected in its own commit `904445fd`; `_system-map.md` unaffected — `d6e278c1`
- `REC-118` — **real defect, and the row's framing was the false half.** The practice branch writes no marker at all, so nothing "prescribes opposite persistent output"; what was wrong was one clause of the blocking legacy-format question spoken to Victor, falsified by four sources including `01-basics.sql`'s own 40 marked legacy headers · cold reviewer: approve-with-tightening over three passes, the first two returning `sweep: incomplete` with one further site each · maps: `README.md` committed alone in `9d59de84` — `ee233e14`
- `REC-119` — **real defect, and the row named one of four sites**: `_sql-exercises-review.md` step 5 claimed to be the "only writer" of `practice/sql/MISTAKES.md`, a file `sql-block-close` has written the `## Fricción` half of since 2026-08-04. The writer set is stated in eight places, three more wrong by omission; the rule now lives in the SQL ownership fence · cold reviewer: approve-with-tightening (round 1 `sweep: incomplete`), and the skill's YAML description carried the same exclusivity as a **possessive** (promoted) · residue verified and **not ours**: the doctrine's Moment 2b still skips the `## Fricción` tier · maps: both, in the fix commit — `71312af2`
- `REC-120` — **real defect, and the row named one of the two values missing from the same enum**: `simulator-prompt.md`'s `TOPIC` listed ten banks where the family defines **twelve**; `javascript` was omitted from birth and `spring` entered on 2026-08-08 with no consumer following it · cold reviewer: approve-with-tightening then approve on the delta; its first pass missed a `.codex/` twin the validator holds byte-identical, then re-swept it. What stays unguarded: nothing mechanically ties this enum to `interview-prep-audit`'s, which is the tie that rotted · residue opened as `REC-151` · maps: — `8a8d6a4a`
- `REC-121` — **real defect, and both halves of the row were wrong about it**: the population is nine of the twelve prompts naming `_single-shot-self-report.md`, not three, and the damage is not a late decision — that contract's Step 2 **overwrites** the report Step 5 reads, so a Step 5 reached through "execute it in full" measures the run's own fresh report and the previous run's `open` is destroyed unread · cold reviewer: approve-with-tightening · maps: — `251c3946`
- `REC-123` — **real defect of the ambiguity kind, and the fix was a *dimension* ruling rather than a precedence one**: order rule 1 ranks `simulator` retries first while the session cap limits consecutive questions from one topic, and four retries in one topic satisfied neither reading. Both survive — rules assign **rank**, the cap governs **adjacency** — with the boundary stated in the same breath: where deferring would push a question past the session's last position, the cap yields and the run says so · cold reviewer: approve-with-tightening, and its `maps unaffected` was falsified by the reviewer that found it · maps: `README.md`; `_system-map.md` states neither clause — `0c2a1173`
- `REC-122` — **half false positive, half real, and the real half sat in neither file the row named**: the literal-`{TYPE}` claim is **rejected** — `_batch-mode.md` step 1 expands `all` and step 2 runs the procedure once per target, so a reading that reaches `.../all.md` has skipped step 1 — though the binding was made explicit in the owner. The commit half is real and its cause is the **consumer class**: `_single-shot-self-report.md` carried no batch clause where its sibling has one · cold reviewer: approve-with-tightening · maps: `_batch-mode.md` aligned to the map rather than the reverse — `21c2c46f`
- `REC-124` — **real defect, and the row named the wrong half**: the `ENTRYPOINT` envelope is not the bug. What made hint unreachable is an unconditional `▶ Run first` header over a three-mode file, a guard section giving hint nothing, and a third site the row never named — the skill's YAML `description`, the copy loaded into every session listing and read instead of the body · cold reviewer: approve-with-tightening, all three tightenings correcting text the fix had just written · maps: `README.md` prerequisite and catalogue cells; `_system-map.md` trigger cell — `29e8ade3`
- `REC-125` — **real defect, and it is one rule plus an unscoped verb rather than two rules**: `plan-audit.md` said a failing specialist acceptance check "aborts without committing" while the check's own tail said "note the gap and continue", and "a failed state" was defined nowhere — so a sequential reader commits a plan one of whose slices cannot be shown to have been read whole. `continue` is now scoped to the **phase** · cold reviewer: approve-with-tightening, all three must-fixes written by the repair, including an undefined batch path · residue, not a row: `sql-plan-audit`'s Phase 3 history gate keeps "abort without committing" — asymmetric within its file, output-identical · maps: — `03dce9a5`
- `REC-126` — **real defect, and the row was wrong about which clause had to go**: `_plan-review-prompt.md` told every specialist to "read the whole plan for context" over six scopes the same file gives a tiered `Reading map`, and the acceptance gate then demanded `N lines, read to EOF` from all seven — forcing a falsehood to buy an attestation the orchestrator cannot verify. The whole-plan read is gone; the six rest on the trace they already owe · cold reviewer: approve-with-tightening · maps unaffected — neither map ever stated the proof form — `78f10008`
- `REC-127` — **real defect in the stated reason, and the conclusion it supported was never wrong**: invariant 10's published limit rested on files "no review scope reads", false since `REC-099` gave `whole-plan` the backlog. The limit now rests on what this file defines: *signed off* is read of the project branch as it stands, so the gates turn on merge state no reading map supplies · cold reviewer: approve-with-tightening · maps unaffected — both already carried `whole-plan`'s backlog read and neither ever stated the limit — `dd577ffd`
- `REC-128` — **real defect, and only the wording was absolute**: `portfolio-audit.md`'s `▶ Run first` demanded §23's whole chain of every run, while the same file's recipe B admits every project and calls an unfinished one's ❌ "expected, not an error". The chain is now scoped to a project whose plan steps are all ✅, the exemption answering §23's three reasons one for one · cold reviewer: approve-with-tightening · maps: `README.md` Run-first cell in the fix commit; `_system-map.md` unaffected, its chain rows describe a *built* project — `c30024a4`
- `REC-129` — **ambiguity, and the row's stated harm was false**: `_portfolio-standard.md`'s opening placed G7 after G5 and G6 and left G3/G4 out, but it is a *placement* sentence no consumer reads to decide whether to run, it already pointed at §23 as owner of the gate order, and it matched §23's own trigger cell in substance · cold reviewer: approve-with-tightening · maps unaffected — `README.md` describes the file's contents and `_system-map.md` has no row for it — `29b8d899`
- `REC-130` — **false positive, and the partition it says is missing is stated four times.** The two clauses govern different things: an unticked box is *open* (state), and which open tasks reach ❌/⚠️/✅ is the verdict mapping, stated by the owner three lines above the sentence the row called absolute. `portfolio-audit.md` states no mapping at all, ceding the computation · `git log -S` settled it without argument · maps unaffected, verified row by row — `—`
- `REC-131` — **real defect, and the terminal effect the row asked for was the wrong one**: a questions-vs-decisions ratio still below 1 after its retry is a failed **content** acceptance gate, already barred from `completed` by the close-out contract — but `portfolio-audit.md` parked it as "an open question this prompt does not get to settle", which reads as a licence to close out `completed`. Both shapes now record `blocked` mode-neutrally with a commit-body label · cold reviewer: approve-with-tightening · maps: `_system-map.md` in the fix commit; `README.md` verified unaffected — `37be7a02`
- `REC-132` — **real defect, and the object is an idiom rather than a sentence**: "the orchestrator owns the commit" is a fixed phrase meaning it **executes** it — true in the plan and portfolio pipelines, false in `readme-audit`, the only one that never commits its product. The false-positive branch was refuted rather than dismissed: no definition meaning *handoff* exists anywhere and all five sibling uses mean the opposite · cold reviewer: approve-with-tightening · maps unaffected, ruled row by row — both were already correct, itself evidence the prompt bodies were the stale half — `e3384566`
- `REC-133` — **real defect, and the row understated it**: the flow reviewer's verbatim config-line rule demanded the value of a hardcoded secret in the same Finding cell its own redaction rule forbade, and its consequence clause made the redacted half *unreportable*, so neither reading could file a real exposed secret. The verbatim rule now carries a **secret-value form** exception — the key quoted exactly plus *literal, not `${ENV}`* · cold reviewer: approve-with-tightening · maps unaffected — neither map states either rule — `d1b610a6`
- `REC-134` — **real defect, and the row overstated its reach**: `review-audit.md` is right at both of its sites, so the merge was never unconditional. What was false was the **dispatch document the reviewer reads**: `_review-security-prompt.md`'s intro said its table merges "as **High** tasks", contradicted by its own output block asking for a `Severity` column governed by nothing · cold reviewer: approve-with-tightening · maps: — `9b2fc805`
- `REC-135` — **real defect, and the row was wrong about who owned the rule**: `progress-update-prompt.md` contradicted itself from birth — its ownership table claimed the whole matrix while D7, in the same commit, said `Practical evidence` is shared. D7 was already correct and stays the single full statement (`REC-064`); every **restatement** of the ownership was fixed instead · cold reviewer: approve-with-tightening · maps: `_system-map.md` §8 in the fix's own commit; `README.md` read whole and verified unaffected — `ea2fb69a`
- `REC-136` — **real defect, and the row named the narrower half**: `PROGRESS_HINT`, the audited project's own `Status` cell quoted into the subagent's launch instruction, could override the `✅` markers, and the `No ✅ anywhere` branch took the whole status from that cell — either way D5 compared a fact with itself. The override fired precisely on the case D5 exists to catch, so that drift row could never be written and G6 plus SQL G3 close on an **empty** report · cold reviewer: approve-with-tightening · maps: — `4835baec`
- `REC-137` — **real defect, and the row named a site where the rule was the thing broken**: `_session-rules.md` enumerated **eight** points at which `progress-update` is due and then closed with "**Both gates** close on an empty drift report", leaving six prerequisites satisfiable by the run having *happened* while the report named stale sections those prompts read as fact — `REC-065`'s shape with the narrow half on the terminal condition · cold reviewer: approve-with-tightening · residue: `_application-standard.md`'s "every concept learned" is a different defect against a different owner and is `REC-147` · maps: — `eadf8633`
- `REC-138` — **real defect, and the fix holds the fence rather than loosening it** (`REC-112`'s shape): `roadmap-review`'s Reviewer 1 was fenced to two files, "Read nothing else", and a commit the next day added a conditional session-rules read *inside* its invariant 2 — two commits, so a fork and not a reader's error. Both escape branches died on quoted text · cold reviewer: approve-with-tightening · maps: `README.md` in the fix's own commit; `_system-map.md` verified unaffected — `4cf7f680`
- `REC-139` — **real defect, and the ruling fell out of the family rather than the two clauses**: `profile-readme-prompt.md` said "No configuration needed" above a `## Configuration` block holding the one key selecting between two flows. `git log -S` returns one commit for both clauses — the file's birth, so a **copy** and not a fork (promoted) — and `linkedin-prompt.md` is where the sentence came from and the one place it is true · cold reviewer: approve-with-tightening · maps: verified row by row, every row true — the catalogue's Configuration cell had contradicted the deleted sentence all along — `cad719c6`
- `REC-140` — **real defect, and the row named one of its two halves**: `log` mode appended to `tracker.csv` unconditionally, and the same missing check sat in its folder step, where a rerun would have started an `outcome.md` over an existing one — breaching rule 2's "never rewrite `outcome.md` history" as well as rule 4. An application is now identified by `empresa` + `puesto`, resolved against every row **and** every folder before any write, branching three ways · cold reviewer: approve-with-tightening · maps unaffected — `52651df8`
- `REC-141` — **real defect, and the collision was manufactured by an extraction rather than written by either rule**: two mandatory clauses of `_application-standard.md` were both born in the refactor that drained one out of `cv-prompt.md` — where its heading read "Required keywords for this **target role**" — and the other out of `linkedin-prompt.md`, where it governed a Skills list; each was true at home, and the reworded heading turned a market floor into a mandate on the document (promoted, with `git show <commit>^:<old path>` as the instrument `log -S` cannot replace) · cold reviewer: approve-with-tightening · residue below the bar: two adjacent sites under the qualified mandate · maps: — `8e04c5e4`
- `REC-142` — **real defect, and narrower than the row: the numbered order was never wrong.** Step 3 of `_single-shot-self-report.md` commits report + tracker and Step 4 re-commits with the applied hash — not opposite sequencing but a lost joining word, `again`, deleted by a later commit that restated Step 3 as if it had not run and, on the path it named, ordered a commit of an unchanged tree · cold reviewer: approve-with-tightening · maps unaffected — `README.md` states the close-out's steps, never its commit shape — `e493a4bd`
- `REC-146` — **real defect, and neither terminal effect the row named was the one owed**: the close-out half was already inherited, and the ambiguity branch was refused against the standard's own "the only run worth stopping is one over code a reviewer has already read" · cold reviewer: approve-with-tightening · residue opened as `REC-148`: §23 and `portfolio-audit`'s `▶ Run first` still let a qualified tier tick G3/G4 · maps unaffected, the `Generates / updates` cell already naming the per-tier lines — `1d86e07b`
- `REC-147` — **real defect, and the false-positive branch died on the one section that still names concepts**: `PROGRESS.md`'s `Key concepts` cell is by its own owner's words "not an inventory and is not maintained here", so it cannot be what `_application-standard.md` source 3 sent five prompts to read for "every concept learned". The live cost was `cv-prompt`'s ternary keyword audit asking whether Victor can *defend* a keyword while no file in the standard's sources answered it — the promoted source-list-hole rule · cold reviewer: approve-with-tightening · maps: `_system-map.md` §7's `PROGRESS.md` row, short by two readers — `be2df2c0`
- `REC-148` — **real defect**: §23's G3/G4 boxes and `portfolio-audit`'s `▶ Run first` both closed on `review-audit` *having run*, which a tier stamped `(incomplete — «slice» not reviewed)` satisfies — so G5/G7 could proceed over code nobody opened and G7's verdict be computed from a backlog short by that slice's findings. Fixed at the owner and at the four readers, with `**Pass:**` now requiring each box to carry the standard's own wording · cold reviewer: approve-with-tightening · residue below the bar: G2 is skipped when §15/§22 never move, so a drifted box can sit until a standalone `plan-audit MODE=review` — Victor's call · maps: — `ac3adb02`
- `REC-149` — **real defect, and the fix would have shipped inert**: `coverage-verify` Step 2 rejected a gap as "belongs to another topic" and the concept vanished, while `_coverage-standard.md` requires any run that discovers another topic's concept to route a proposal to `_cross-topic-inbox.md` — both siblings already declared that file, so the disposition was a family comparison and not a ruling (`REC-110`'s rule, second use). Disk proof the write had already happened outside every declared contract · cold reviewer: approve-with-tightening · residue below the bar: `coverage-bullet-add`'s `## Commits` covers no routing-only run · maps: — `378cd61d`
- `REC-150` — **real defect, and the mandate the false clause defended was never wrong**: `_notes-review-prompt.md` told stage B the `es/` "has not been created yet", false on three reachable paths — the third settles it, since Stage A immediately upstream is told to read that same `es/`, and B's own reading list opens an `es/` calibration file sixty lines below the sentence denying there is one · cold reviewer: approve-with-tightening · maps: `README.md` stage-B cell in the fix's own commit; `_system-map.md` unaffected, verified rather than declared — `adcf498a`
- `REC-152` — **real defect, and the row's own first branch had to be refuted rather than applied**: `simulator-prompt.md`'s `### topic` starting question and Step 3's order rule 1 both assign position 1, which is a **rank** and not a second dimension, so `REC-123`'s dimension test does not dissolve this one and the ⭐⭐⭐ reading was false wherever an Open row mapped to a lower tier (promoted as that test's converse). The mode line was a **partial restatement** — rules 2–3 verbatim, rule 1 omitted — which is why it read as correct · cold reviewer: approve-with-tightening · maps unaffected, `_system-map.md` states no simulator ordering anywhere — `28e95d68`

## Suggested order for the open items

Added 2026-08-06 as a wave plan for twenty-odd rows; **rewritten 2026-08-10, reopened for the five
rows raised by `/system-gaps` on 2026-08-11, and reopened again on 2026-08-12 for the contradiction
cluster exposed by the blocked `/system-check` run and its attempted portfolio adjudication.**
Waves 1-6 are all closed and Wave 7 was dissolved, so the sequencing history they carried has gone where the
rest of this file's history lives — `git log -p`. Three rules produced the old order and still produce this
one: **a correction that stops a wrong run comes before a build**, **an item blocked on evidence is run, not
edited**, and **a chain is walked from its denominator up**. Wave 2's lesson outranks all three and was never
once wrong across eleven items: **budget the sweep, never the edit** — every row so far lived in more places
than it named, and in three of four cases it was the *cold reviewer*, not the sweep, that found the last site.

**Current order: the workable table is empty again.** Safety, persistent-state risks, broken or
undefined terminal paths, the authority/writer-boundary rows and the bounded schema, read-scope and
precedence block that was the last one standing are all drained. Which rows drained, replaced or split
themselves is in `git log -p`; what carries is the one call that inverted: `REC-155`'s resolution
declined its reviewer's out-of-scope site on bar condition 3, Victor overrode the decline, and the
re-measurement showed the decline was wrong — **applied wrongly is still the bar working, provided the
re-measurement is written down**, and a decline is not a disposal until nobody overrides it.

**An empty table is not a finished system**: the next row comes from a run, and `/system-gaps` and
`/system-check` are what produce one. Within the intake, exposure of secrets, unrecoverable partial
writes, contradictory persistent formats, circular truth and duplicate application rows precede wording
and scope corrections — that head class is now empty.

**`REC-054` is not in this order and never will be** — it is `accruing`, not queued.

**The ordering that looks right and is not:** batching rows because they share a file. The four
`system-check-prompt.md` rows shared an *analysis* and never a priority, and batching by file is how a row
that fails the bar ships on the back of one that does not. `REC-067` + `REC-084` were batched on the
first ground and not the second — the shared file is a convenience, the shared *kind of gap* is the
reason. If the analysis splits once it starts, split the session too, which is what happened: `REC-067`
alone cost a locator sweep, a 20-defect injection suite and a cold review, and shipped without
`REC-084` rather than dragging it through a session it had outgrown.

New self-reports append or update a row in `## Open`. A historical report remains immutable evidence;
its wording does not determine current status. The ledger does.

A resolved item leaves `## Open` entirely — it becomes one line in `## Closed`, and any rule it
established moves to `_recommendation-resolution-doctrine.md` first (step 4). **Nothing is lost by that:** the full reasoning of
every closed item is in `git log -p` on this file, which is where it belongs, because a resolution
written for the day it shipped stops being read long before it stops being true. What a future reader
needs from a closed item is the decision, not the argument — and if the argument matters again, the row
was not the right home for it.
