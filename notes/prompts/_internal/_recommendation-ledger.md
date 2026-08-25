# Prompt-system recommendation ledger

Self-report recommendations use one of four states — a close-out writes `open` or `accepted` and nothing
else, which is what the two self-report contracts and `_system-map.md` §12 state. A fifth, `accruing`, is
raised by hand only:

- `open` — observed and not yet adjudicated.
- `accepted` — agreed, with implementation still pending.
- `applied` — implemented and verified, then collapsed into one line in `_recommendation-ledger-closed.md`.
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
work that is queued. A finding that fails these tests is still written down — in the closed line of the
row that found it, in `_recommendation-ledger-closed.md`, or in the tracker cell that owns it — it is simply not carried here, because a
ledger holding operational worklists is one nobody can drain.

**But `_run-tracker.md` holds a debt only in its own defined `⚠ stale` form**, which the owed prompt is
built to clear on its next run. Free prose appended to a cell is not a sink: `_pipeline-self-report.md`
tells every close-out to **overwrite** the cell, so the next run of that prompt deletes the note without
having read it — and the audit prompts read their `_last-run-report`, not this file. `REC-102` wrote
such a note and reverted it on its cold reviewer's finding. When the owner's own standard already
carries the check, the closed line is the sink and the standard is what carries it forward.

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
4. **Collapse the row into `## Closed` in `_recommendation-ledger-closed.md`** — only a `sweep: complete` review returning `approve` or
   `approve-with-tightening` may reach this step; `reject` and every incomplete sweep leave the row
   open under step 3. The one-line closure carries the ID, what the item was,
   `cold reviewer: approve | approve-with-tightening`, the two-map declaration, and the implementation
   commit. This reviewer field starts with `REC-107`;
   historical lines are not retrofitted. **`validate-prompt-system.ps1` invariant 9 reads that
   schema** — the shape, the ID order, the commit field, the two-map declaration from `REC-058` and
   the verdict on any line naming a real commit — so a closure that drops a field fails the run
   instead of being found by the next reader. What it cannot see is whether the reviewer ran;
   `README.md` states that limit with the rest of its contract. Before collapsing, promote any rule the row established that
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

**What may become a row is the scope test above, applied twice.** Once when a run proposes one, and
again when a resolution's own cold reviewer returns with a finding of its own — at the moment it
returns, because a reviewer is paid to find things and filing each of them as `open` is how this queue
came to refill at the speed it drained: `REC-081`, `REC-086` and `REC-087` were each raised by the
reviewer of a *different* row. The bar, and where a finding that fails it is written down instead, are
in `_recommendation-resolution-doctrine.md` → "An incidental finding is evidence, not automatically a
row".

**Two of the intake routes hand over a row that is only half-decided** — an `absence` row from
`/system-gaps`, a `contradiction` row from `/system-check` — and how each is resolved is case law, not
queue: `_recommendation-resolution-doctrine.md` → "Row dispositions". Step 1 is not optional for either:
the settling file is read first, because a row whose absence branch turns out to be the map's is a
`map-sync` repair and never an edit to the machinery.

**Say the workable number and name the accruing one separately; they are not summed.** `REC-054` is the
only accruing row and is not part of the queue. **An empty table is not a finished system**: it means
the next row comes from a run, not from this file, and `/system-gaps` and `/system-check` are what
produce one.

| ID | Source | Recommendation | State | Resolution |
|---|---|---|---|---|
| REC-166 | the cold review of `7d7a4cb3`, 2026-08-25, while sweeping `seventeen` for the eighteenth skill | **Three sentences count the SQL topic blocks as seventeen when there are thirteen.** `_sql-exercise-seeds.md:16` and `:17` ("the other seventeen", "seventeen irrelevant topic blocks") and `_sql-exercises-practice.md:303` describe the extraction that created the seeds file, and the count was already wrong before the skill sweep touched anything — it was found only because a grep for the *skill* count crossed it. The number is load-bearing prose: it is the stated reason the seeds were extracted and the reason a run reads one block instead of all of them, so a reader checking the claim against `BASICS…INDEXES` finds thirteen and cannot tell which half is stale. Recount the blocks and rewrite the three sentences from the file, not from each other. | open | |
| REC-167 | the cold review of `7d7a4cb3`, 2026-08-25 | **`_system-map.md` §13's line counts have drifted from the files and now contradict a sentence in the same section.** The `13:30` row was remeasured 2026-08-25 when `authoring-progress-recount` joined it; the other three still carry the 2026-08-11 snapshot, and `:693` separately cites "08:00 carries 1,493 lines" against a row reading `~1,520` and six files measuring 1,626 today — three numbers for one quantity. The step counts drift the same way: the declared 37 for `08:00` does not reproduce under the section's own stated criterion. Remeasure all four rows in one pass, restate the date once, and either fix `:693` or delete a figure the row already carries. Do not remeasure row by row on the way past — that is what produced the split. | open | |
| REC-054 | Victor, 2026-08-06, alongside the two-map rule; **reshaped 2026-08-10 on Victor's own falsification of it** | **The lived-day review cannot be scheduled, because its evidence does not exist — so it stops being an audit that is run and becomes a verdict that accrues while Victor studies.** What it judges is unchanged and is still the only question nothing else in the system asks: do the current 08:00, 12:30 and 13:30 loops fit a real day, are the interview opener's grading and the block closers cheap enough to keep running, what does each block leave unrecorded, and does ritual load outweigh the work it records. Its original day snapshot is also still obsolete — the 13:30 block now has `interview-prep-block-open` plus `study-block-close`, authored/refined/studied state is separated, and there are eighteen mirrored skills. What changed is that **there is nothing to judge yet**: the rituals have barely been exercised, so the review has no input and would fabricate one. Three parts, in order. **(a) A capture point — built 2026-08-10, `_internal/_ritual-friction.md`.** `_skill-friction.md` accepts only an observable *failed declared step* (`FRIC-NNNN`), so the complaint that will actually occur — "this ritual ate the block", "nothing ever reads this output", "I do it by hand anyway" — was unrecordable and died in the session it was said in. It is the machinery-level instance of exactly what `sql-block-close` was built for: **friction without failure**. It is a separate file on purpose: `FRIC` rows are adjudicated by the next close-out's four-condition bar and can become a `REC`, which is the one thing (b) forbids, and one file holding two kinds of row under a consumer that counts them is the `REC-074` smell. **(b) The rule that keeps this out of the refill loop:** a ritual-friction line **never opens a `REC` and never dispatches a cold reviewer**. One line, written as it is said, accumulating. **(c) The verdict, per ritual, once its evidence is enough to rule on** — kept, thinned, or deleted. This is the only item in this ledger licensed to **remove** machinery; every other row has added a check, a pointer or a rule | accruing | **Not workable, never scheduled, and it gates nothing** — it is the one `accruing` row and the reason that state exists. Its original sequencing said to run it once the machinery stopped moving, and that premise was the wrong one: the binding constraint was never **motion**, it was **absence of use**, which no amount of waiting for the machinery to settle repairs. Its input is the `RITF` rows themselves plus whatever `_run-tracker.md` shows has actually run — not a measurement pass built for it, which is what `REC-070` (b) was and why that row is gone. Do not schedule it and do not let it block a row again. **(a) shipped 2026-08-10** — the sink, its `_session-rules.md` trigger and its `_system-map.md` §7 and §11 rows — so the row is now fillable and what remains is (b) holding in practice and (c) having something to rule on. **(b) is not a build: it is a prohibition**, and it is stated in all three places at once (the sink, the session rule, this row) rather than in one, because the failure it prevents is a future session skipping straight to a `REC`. `REC-055` (e) was parked with it and is **unparked 2026-08-10**: a map that states *which* rituals fire in which block is a structural description, and this row is a verdict on whether they are worth their cost — the two do not collide, and the second is not a prerequisite for the first. Maps unaffected by this reshaping — no prompt, skill, writer, trigger or file existence changes |
| REC-164 | both cold-review rounds of `REC-163`, 2026-08-19, as a `sweep: incomplete` site verified against quoted sentences from each `SKILL.md` and **re-scoped under the two-round cap** — `REC-163`'s own four cell corrections were reverted with it, because a column measured in four of twelve places reads as measured | **`_system-map.md` §9's `Primary reads` is incomplete in both directions, across ten skills.** The column claims each skill's reads and `/system-check`'s `Purpose` says this map owns them, so an omitted read is `missing claim` and a claimed one the skill never opens is `incorrect`. **Omissions, by the section of the `SKILL.md` that mandates each:** `coverage-mark` — its *read before editing anything* sentence (`_coverage-standard.md` § "Evidence markers" **and** `_topic-ownership.md`) plus §4's `progress-update-prompt.md` step D8; `coverage-bullet-add` — §5's step D8; `sql-step-close` — §1's `_coverage-standard.md` → "The drill marker" and §2's `_sql-plan-standard.md` Section E, sixth row; `backlog-task-close` — `_topic-ownership.md` before invoking the coverage skills, and `_planning-standard.md` invariant 10; `step-complete` — `_concept-extraction-standard.md` step 3 and the same invariant 10; `study-block-close` — §3.2's `_interview-prep-standard.md` fingerprints; `sql-block-close` — the `notes/sql/coverage/{LEVEL}.md` its `Coverage section` is copied verbatim from; `simulation-block-open` — §0's read list item 6 (`_coverage-standard.md`'s digest rule, `_simulation-plan-standard.md`); `backlog-task-open` — `_shared-context.md`. **The opposite direction, one site:** `sql-block-open`'s cell claims `PROGRESS.md` and that `SKILL.md` never reads it | open | **Measure from the definer and take all eighteen at once, or the next partial sweep repeats this one.** The denominator is `system-check-prompt.md`'s `Purpose` field list, not the nine cells named above: read each `SKILL.md` whole and take every file it is *told to read*, both directions. **The one thing already settled is what is licensed out**: `REC-163` wrote §9's `Primary reads` fence, which discharges `_session-rules.md` alone — background and provenance citations of it are `source-only by ownership split`, and its two owed cases are stated there; `_shared-context.md` gets no such licence, being a mandated read of one skill rather than background to all. **Why this is a row and not a `_run-tracker.md` cell** (the `REC-046` test): no run clears it. `/system-check` is explicit-only and token-intensive, and `map-sync`'s read trigger fires one file at a time, so ten cells are cleared only by a session that reads ten `SKILL.md` files whole — which is the work, not a by-product of it |

## Closed

Resolved rows leave this file entirely: they become one line each in
`_recommendation-ledger-closed.md`, beside this one, ordered by ID and written to the closure schema in
step 4 above. That file is the deduplication source — a candidate matching a **rejected** line is
discharged with the reason kept there — and the reasoning behind any line is in `git log -p` on either
file, since one commit removes the row here and adds the line there.

## Suggested order for the open items

**Only `REC-164` is workable, and it is `REC-163`'s residue.** That row, `REC-162` and `REC-163` were
all raised by a predecessor's cold reviewer, all verified against quoted cells and **re-scoped rather
than worked**, and all the same *shape* as the row that found them — a per-prompt or per-skill fact a
map cell compresses and licenses nowhere. `REC-162` and `REC-163` both closed 2026-08-19; the second
handed this one its licence outright, so what is left is the per-cell measurement of §9's `Primary
reads` across all eighteen `SKILL.md` files, in both directions. Four rules ordered the waves that drained this table
and order it now: **a correction that stops a wrong run comes before a build**, **an item
blocked on evidence is run, not edited**, **a chain is walked from its denominator up**, and above the
other three — never once wrong across eleven items — **budget the sweep, never the edit**: every row so
far lived in more places than it named, and in three of four cases it was the *cold reviewer*, not the
sweep, that found the last site.

Within an intake, exposure of secrets, unrecoverable partial writes, contradictory persistent formats,
circular truth and duplicate application rows precede wording and scope corrections. That head class is
empty too, and which rows drained, split or replaced themselves is in `git log -p`.

**The ordering that looks right and is not:** batching rows because they share a file. Rows share an
*analysis*, or a *kind of gap*, and neither is a priority — batching by file is how a row that fails the
bar ships on the back of one that does not. If the analysis splits once it starts, split the session
too: `REC-067` alone cost a locator sweep, a 20-defect injection suite and a cold review, and shipped
without `REC-084` rather than dragging it through a session it had outgrown.

**`REC-054` is not in this order and never will be** — it is `accruing`, not queued.

New self-reports append or update a row in `## Open`. A historical report remains immutable evidence;
its wording does not determine current status. The ledger does.

A resolved item leaves this file entirely — one line in `_recommendation-ledger-closed.md`, after any
rule it established moves to `_recommendation-resolution-doctrine.md` (step 4). **Nothing is lost by
that:** the reasoning is in `git log -p` on the two files the closing commit touches, because a
resolution written for the day it shipped stops being read long before it stops being true. What a
future reader needs from a closed item is the decision, not the argument — and if the argument matters
again, the row was not the right home for it.
