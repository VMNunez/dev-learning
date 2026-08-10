# Prompt-system recommendation ledger

Self-report recommendations use one of four states:

- `open` — observed and not yet adjudicated.
- `accepted` — agreed, with implementation still pending.
- `applied` — implemented and verified, then collapsed into `## Closed`.
- `rejected` — intentionally not implemented, then collapsed the same way, with the reason kept.

## How an item is resolved

Four steps, in order, fixed 2026-08-07. The ledger reached 127k characters before this was written
down, and the three items before it each cost more than they were budgeted for.

1. **Analyse the problem, never only the row.** A row records where a defect was *found*; it is
   routinely wrong about where the defect *lives*. `REC-053` named one file and the rot sat in five.
   `REC-051` named three sites and there were six, two of them naming the gate by the very thing the
   item removed. `REC-057` asked for a check that already existed and was blind not to a *location* but
   to a path **form**. Measure against disk before proposing anything, and budget the sweep rather than
   the edit.
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
4. **Collapse the row into `## Closed`** — one line: the ID, what it was, the commit. Before
   collapsing, promote any rule the row established that governs **future** work into this preamble. A
   rule that other items obey must not stay buried in a row about something else; that is how the
   `REC-025` precedent came to be cited seven times from inside a row about SQL specialists — and
   misread every time, which is the second reason to promote a rule rather than cite it across rows.

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

**A rule restated is a rule forked.** From `REC-064`. `REC-062`'s read licence was written once in
`_session-rules.md` and restated three times — in `_system-map.md`, in `map-sync`'s frontmatter and in
its step 2 — and **no restatement matched the original**: one merged two different licences into one
list, one contradicted the frontmatter about whether the ritual fires at all, one silently widened the
scope. None of it was catchable by any automated check, because every version was internally coherent.
State a rule once, in the file that owns it, and have the others **point** at it; where a restatement is
genuinely needed for a reader who will not follow the pointer, diff it against the source before
committing, not afterwards. **`REC-055` is its second instance, and it sharpens the rule: restatement
bites hardest in a document that declares itself *derived*.** `_system-map.md`'s new §12 restated
`README.md`'s account of the validator nearly whole, and two of the three defects the cold reviewer
found were the divergences that restatement produced within hours of being written — a trigger list
narrowed to three of its five kinds, and a dropped branch that turned a check with teeth into one that
"reports, never repairs". Both were correct in the source. **A derived section states only what its
source cannot say, and points for the rest.** **`REC-069` is its third instance and adds the sweep
lesson: a private copy of a rule hides behind a pronoun.** Four project standards each restated the
gate chain and all four had it inverted; three named `readme-audit` and fell to a name grep, while the
fourth wrote "**this readme review**" and survived two sweeps — it was found only by a cold reviewer
reading the family. When you sweep for a restated rule, grep the **shape of the claim** (here, the
`Chain:` line and the arrow sequence), never only the names inside it, or the copy that refers to
itself in the first person is the one you leave behind.

**Two statements of one rule cannot be compared until their terms are defined in one place.** From
`REC-074`. The simulation level-close gate was written twice — "no correction is open" in the standard,
"no MISTAKES row is open" in the prompt that executes it — and they were not a stricter and a looser
version of one test: one names a **step state**, the other counts **rows**, and the mapping between them
was written nowhere. Nothing could adjudicate them, which is why the row that found them proposed a
mechanism and got it wrong. Before aligning two statements of a rule, check whether they are in the same
vocabulary at all; if they are not, the fix is to define the mapping in the file that owns the rule, and
only then align the wording — aligning wording over an undefined mapping just picks a winner. Two smells
that a gate has drifted into a second vocabulary: it **counts rows in a file that holds more than one
kind of row** (here `## Friction`, which the same standard calls not a correction backlog, was silently
inside the test), and it **scopes what the owning definition does not** (here `for the level`, which made
the level-agnostic original the stricter of the two across levels — the reverse of what the row claimed).

**Authoring a value and correcting one are different rights, and an ownership fence that names one
grants or denies both.** From `REC-073`. `_sql-plan-standard.md` named `sql-plan-audit` the doctrine's
single writer while the closing ritual had been rewriting its §0 for a week; and the first draft of the
fix over-corrected in the opposite direction, telling that same audit to "never treat a value you did
not write as drift" — which would have disabled the only two invariants that keep §0 true. A fence
states, per artefact: who **authors** the value, who may **correct** it, and who may only **report** it.
Where a file mixes rules and live state, split the row rather than picking one owner for the file — the
route's progress fields had been split that way since the standard was written, one row above the one
that was wrong.

**"The map is right" is a claim about two files.** Also `REC-073`, whose own resolution note said the
map was right and had checked `_system-map.md` only; `README.md` carried one false cell and two
incomplete ones about the very writer set in dispute. Every `maps affected` / `maps unaffected`
declaration is a statement about **both** maps, and a row asserting one of them is right has verified
half of what it claims. **`REC-074` adds the other half: an open row's `maps unaffected` is a
prediction, not evidence, and it is re-tested at apply time.** That row closed with "neither map states
the gate's closing condition"; `README.md`'s chain stated it in two places, one of which the fix then
falsified — so a map edit was owed by an item whose own row said none was.

**A check is not finished when it passes; it is finished when it has been made to fail.** From
`REC-057`. Two of its four checks were wrong on first contact, and **both announced themselves loudly**
— the digest reimplementation disagreed with 10 of 13 files when differentially tested against the
canonical command, and the skill mirror reported drift between two provably identical files after a
checkout. Those cost nothing to find. What only a deliberate defect surfaced was the **third** one: the
validator's own error dump ran under `$ErrorActionPreference = 'Stop'`, so the first `Write-Error`
terminated and every later finding was hidden — invisible while the script had one check family, and
found only by injecting four defects at once and noticing that one came back.

**A name test must be bounded and case-sensitive, and the name must be read, never guessed.** From
`REC-065`, and it is the **second** time the same blindness shipped: `REC-057`'s cold reviewer caught the
coverage mirror passing a capitalisation-only divergence, because `Compare-Object` is case-insensitive by
default — and one screen later the same file asked `-notmatch`, which is case-insensitive for the same
reason. Two of the 28 prompts were consequently exempt from the map-registration check and nothing said
so: `plan-audit` was satisfied by the substring inside `sql-plan-audit`, and `/tracker` by the unrelated
path `practice/simulations/TRACKER.md` in another section. Bound every identifier match on both sides
(`(?<![A-Za-z0-9-])…(?![A-Za-z0-9-])`), use the `-c` forms, and **derive a name from the artefact that
owns it** rather than reconstructing it by rule — the launcher's own filename is the slash command, which
is why bounding alone first broke `/code-review-practice`, the one deliberate exception `REC-040`
documents. A check that silently exempts part of its population is worse than no check.

**A rule forks against *itself* when its trigger is narrower than its scope.** Also `REC-065`, and the
companion to the restatement rule below: `REC-062`'s read licence table has always had three rows, while
the trigger sentence above it named two kinds — so the standards row was unreachable from the day it was
written, and `study-content-writer`, which reads two standards in full on every run, could never fire the
ritual that would exercise it. Neither half was wrong on its own, which is why nothing caught it. When a
rule has a trigger and a scope table, **enumerate the same kinds in both**, and count them out loud: the
prose under that table said "the two licences" while three sat above it.

**A convention stated in one direction will be read in both.** From `REC-040`, and its cold reviewer
caught it inside the very paragraph written to stop the mis-derivation: "the seven `*-audit` prompts have
no suffix to drop" is true read file → command and false read command → file, because `/coverage-audit`
also ends in `-audit` and its file is `coverage-audit-prompt.md`. A reader derives in whichever direction
he happens to need. State which direction the rule runs in, and check the other one before committing.
**`REC-082` is its second instance and adds the file test.** The sentence written to state the convention
— "a `/name` token anywhere in this system resolves to a launcher" — was falsified ten lines above it by
the same section's own documented exception, `/code-review`, the host agent's built-in. Before writing a
universal, grep the file you are writing it into for the exceptions it already documents: a paragraph
that contradicts its own section is the one nothing downstream catches, because both halves read as
authoritative. The same row's grep-as-stated-test was wrong by a count on first run for the same reason —
the fix itself added an instance the claim did not include.

**An incidental finding is evidence, not automatically a row.** A cold reviewer dispatched on one row
routinely finds defects elsewhere, and filing each of them as `open` is how this ledger came to refill
itself as fast as it drains. The bar is the one the close-outs already use: **would a run produce a
different output?** A finding that fails it is recorded in the `## Closed` line of the row whose review
found it, and left there. That is not the carrier mistake the promoted-residues paragraph warns about —
the opposite. **Open work** parked in a closed line is wrong because nothing re-measures it; a finding that
fails the bar is not work, and nothing *should* re-measure it. What distinguishes the two is the bar, so
apply it at the moment the reviewer returns, never later. `REC-077`, `REC-078` and `REC-081` are what
skipping it looks like: three rows carried for weeks, each self-documenting that nothing wrong had ever
shipped, all three closed as `rejected` on 2026-08-10 without a line of code changing.

**Fixing an owner does not license editing its copies.** From `REC-083`. The G4 justification was
word-identical in `_planning-standard.md` and in one project's `PLANNING.md`, and the row asked for the
copy to become a pointer. Both moves were wrong. The §23 gate table is an instantiation the standard
*orders* every plan to carry, so a pointer in one cell of eight reads as an accident and is overwritten
by the next `plan-audit`; and the copy sits in a file whose writers §7 names — `/plan-audit`,
`step-complete`, `backlog-task-close` — none of which is a machinery session. So the split is: **the owner
half ships now, and the copy half is owed to its declared writer, as its own row.** `REC-085` reached the
same fence from the other side by declining its item whole; the general form is that an item crossing an
ownership fence is *partly* ours, not all-or-nothing. Two corollaries. A commit authorization is not an
authorship right — `_session-rules.md` lets the agent commit any project's `PLANNING.md` and that settles
git, not who may author the value (`REC-073`). And **"the other cells are verbatim copies" is a claim to
verify cell by cell before leaning on it**: five of seven were, and one of the divergent two held a live
forked rule that nothing had noticed.

**Two prompts may both compute the same thing.** From `REC-042`: what they share is the *rule*, never
the computation. It is **illegitimate** when the second analysis runs inside the same pipeline, on the
same question, feeding the same artefact; it is legitimate when the gap sets differ in scope, when
routing one through the other would close a dependency cycle, or when their lifecycles do not meet —
`REC-042` turned on all three. Re-apply that argument, with its negative case, rather than
re-litigating it whenever two prompts appear to duplicate an analysis.

**A skill failure is evidence, not automatically a recommendation.** From `REC-058`. The source
contract is `_session-rules.md` → "When a skill cannot finish — durable friction": only an observable
failed declared step writes `FRIC-NNNN`, and the next runnable prompt close-out must still apply its
four-condition bar and locate the real owner before creating or updating a `REC-NNN`. Successful and
expected paths write no friction. The loop deliberately cannot detect a skill that completes silently
with the wrong result, so its evidence is narrower than a prompt self-report.

**Practice feedback is evidence, not coverage authorship.** From `REC-052` / `REC-059`. Each practice
track keeps a durable weakness sink that its own next run actually consumes: SQL and timed simulations
keep rubric-specific MISTAKES files; the three live interview surfaces share one sink and qualify rows
by surface. A weakness may focus reinforcement or produce an unrefined Q&A question through its owning
prompt, but it never authors or marks a coverage bullet. Coverage remains the market-defined ceiling;
practice records performance against it.

**A derived extract of the object under review is worse evidence than the object, and no size makes it
better.** From `REC-079`. `/system-check` dispatched an analyst to extract every claim from the two maps
so the orchestrator could rule on the extract; two consecutive runs demoted the return, the second at 434
lines against 1101 in the maps themselves — 39% of the object, so bulk was never the reason. Two grounds,
and both generalise past this prompt. **An extract can omit invisibly:** a claim it drops is a claim the
audit then reports full coverage over, so the audit's completeness comes to rest on a list whose own
completeness nothing checks. And **the object was already in the room:** the sub-step sat three lines
above a rule saying the maps are "the objects under review, not the source from which the expected answer
is reconstructed", and contradicted it. Before dispatching a reader over an artefact you are auditing,
ask whether the orchestrator can simply read it — and delete the dispatch when it can.

**Deleting a role does not delete its assignments.** From the cold review of `REC-076`/`REC-079`, which
returned `reject` on exactly this. Removing the map-claims analyst also removed the **only manifest owner**
of the two maps, which Step 1 lists as inventory items under a rule that every audited file have exactly
one owner — so `unassigned files = 0` became unsatisfiable, the completeness gate could never close, and
**every future run would have been structurally `blocked`**. Nothing in the deleted step said it carried
that duty; the duty lived in a denominator two steps away, and the edit that broke it touched neither.
When a dispatch, writer or gate is removed, re-measure every count, denominator and acceptance clause
that could have been silently satisfied by it — the deletion is never local to the step that held it.

**What a check cannot settle needs a name, or it silently becomes a pass.** From `REC-076`. The audit
could prove a map cell **false** and never prove one **complete**, and having no vocabulary for the
difference it wrote `verified — no change` over both. The fix is not a stronger check — a gate that
requires per-item citation still passes a manifest listing three of four paths — it is a third
disposition, `unverifiable`, that is reported as a finding and forbidden from any completeness claim.
Two corollaries worth reusing: **an absence rule scoped to the failure branch licenses the success
branch to overclaim** (`REC-065`'s trigger-narrower-than-scope, second instance in this file alone), and
a disposition that costs nothing to assign will absorb everything, so it must require a bounded attempt
to settle first.

## Open

**Frozen 2026-08-10 — no row is resolved one at a time until the system review has run.** The four-step
procedure above works and is not the problem; the **rate** is. Every resolution dispatches a cold reviewer,
a cold reviewer is paid to find things, and what it finds becomes a row — `REC-081`, `REC-086` and
`REC-087` were each raised by the reviewer of a *different* row — so the queue refills at about the speed
it drains, and the items that would judge the machinery as a whole get postponed by the small ones
forever.

**The unfreeze condition was itself unsatisfiable, and is corrected here (2026-08-10).** It read
"`REC-054` and `REC-070` run as **one pass**", and Victor falsified the `REC-054` half the same day it was
written: that review measures the machinery against a **lived** study day, and the days have not been
lived. The rituals have barely been exercised, twelve single-shot prompts still read `pending` in
`_run-tracker.md`, and there is no evidence to review — a run today would ask six questions, get "I have
not used it" six times, and manufacture a verdict about rituals nobody has executed. **A gate that cannot
open does not slow a table down, it stops it.** So what unfreezes this table is now **`REC-070` (b)
alone**: the usage measurement — what has ever run, what has ever fired, what nothing consumes — which is
mechanical, cheap, and is also the one input `REC-054` lacks. That measurement then decides which of the
remaining rows still deserve to be open. Until it runs, a new observation may still be **written** here as
evidence; it may not be **worked**.

| ID | Source | Recommendation | State | Resolution |
|---|---|---|---|---|
| REC-046 | Victor, 2026-08-06 | **Finish the content-side interview-prep audit now that its machinery is current.** No per-topic authoring plan is needed: coverage bounds the level, market evidence selects the questions, and the fingerprinted bilingual Q&A bank remains the content worklist. The separate global CORE route is a study queue, not an authoring plan. `study-block-close` writes `[studied]` only after a PASS on an already `[refined]` stable-ID question. What remains is artifact debt: migrate/audit the banks, add current coverage fingerprints and bilingual stable-ID parity across the selected level, and then generate the CORE route | open | Machinery redesigned in the current interview-prep implementation; maps change with it. Keep both interview rows in `Study progress` at `—` until the full banks pass their current-fingerprint, stable-ID and parity gates and the route fingerprint is current |
| REC-054 | Victor, 2026-08-06, alongside the two-map rule; **reshaped 2026-08-10 on Victor's own falsification of it** | **The lived-day review cannot be scheduled, because its evidence does not exist — so it stops being an audit that is run and becomes a verdict that accrues while Victor studies.** What it judges is unchanged and is still the only question nothing else in the system asks: do the current 08:00, 12:30 and 13:30 loops fit a real day, are the interview opener's grading and the block closers cheap enough to keep running, what does each block leave unrecorded, and does ritual load outweigh the work it records. Its original day snapshot is also still obsolete — the 13:30 block now has `interview-prep-block-open` plus `study-block-close`, authored/refined/studied state is separated, and there are seventeen mirrored skills. What changed is that **there is nothing to judge yet**: the rituals have barely been exercised, so the review has no input and would fabricate one. Three parts, in order. **(a) A capture point — built 2026-08-10, `_internal/_ritual-friction.md`.** `_skill-friction.md` accepts only an observable *failed declared step* (`FRIC-NNNN`), so the complaint that will actually occur — "this ritual ate the block", "nothing ever reads this output", "I do it by hand anyway" — was unrecordable and died in the session it was said in. It is the machinery-level instance of exactly what `sql-block-close` was built for: **friction without failure**. It is a separate file on purpose: `FRIC` rows are adjudicated by the next close-out's four-condition bar and can become a `REC`, which is the one thing (b) forbids, and one file holding two kinds of row under a consumer that counts them is the `REC-074` smell. **(b) The rule that keeps this out of the refill loop:** a ritual-friction line **never opens a `REC` and never dispatches a cold reviewer**. One line, written as it is said, accumulating. **(c) The verdict, per ritual, once its evidence is enough to rule on** — kept, thinned, or deleted. This is the only item in this ledger licensed to **remove** machinery; every other row has added a check, a pointer or a rule | open | **No longer "deliberately last", and it no longer gates this table** — see the corrected freeze note above. Its original sequencing said to run it once the machinery stopped moving, and that premise was the wrong one: the binding constraint was never **motion**, it was **absence of use**, which no amount of waiting for the machinery to settle repairs. `REC-070` (b) now runs *before* it, not after, and supplies the input it lacks — which rituals have ever fired at all. Do not schedule it and do not let it block a row again. **(a) shipped 2026-08-10** — the sink, its `_session-rules.md` trigger and its `_system-map.md` §7 and §11 rows — so the row is now fillable and what remains is (b) holding in practice and (c) having something to rule on. **(b) is not a build: it is a prohibition**, and it is stated in all three places at once (the sink, the session rule, this row) rather than in one, because the failure it prevents is a future session skipping straight to a `REC`. `REC-055` (e) still writes out of it and is parked with it, or the map asserts a per-day view the verdict then re-describes. Maps unaffected by this reshaping — no prompt, skill, writer, trigger or file existence changes |
| REC-055 | Victor, 2026-08-06: "¿le ves gaps al system-map?" | **`_system-map.md` states the machinery and not the loop that maintains it — five gaps, all of them in the map, none in the system.** (a) The improvement loop is missing entirely: nothing says prompts are **frozen by design**, or states the chain that unfreezes one. (b) `validate-prompt-system.ps1`, the only automated check that exists, is absent from the map. (c) The §7 registry omits files that have real writers. (d) `_session-rules.md` has no writer anywhere — the most authoritative file in the system. **(e) There is no per-day view:** the blocks (08:00 / 12:30 / 15:30) and their uneven ritual load appear nowhere on the map | open | **(a)-(d) applied 2026-08-07 in `7bcc5bc`; only (e) is still open.** (e) is written **out of** `REC-054`, never before it, or the map asserts a day the verdict then re-describes — and since `REC-054` no longer runs on a date (reshaped 2026-08-10, Wave 7 dissolved), (e) is **parked with it**, not queued behind a wave. Maps affected when (e) lands — the map is itself the fix site |
| REC-067 | `/system-check`, 2026-08-09 (global audit; carries forward the `open` finding of the 2026-08-09 blocked run) | **Make launcher public argument contracts mechanically falsifiable.** `validate-prompt-system.ps1` proves filename parity, canonical-target parity, full delegation and runtime isolation across both catalogues, but nothing checks that a launcher's advertised **configuration keys and MODE values** match the canonical prompt's own config block, or each other. The two prior runs found eight such mismatches by prose review alone, and the fix (`80d30f43`, `4c77723f`) was likewise unverified by any check — this audit re-proved 30/30 parity by hand, which is exactly the evidence that the guarantee is manual and will drift again silently. A launcher that advertises a key the prompt does not accept is invisible to every automated layer the system has | open | Not a map defect: both maps describe the launchers correctly, and the argument contracts are currently correct. The gap is in the **checking layer**, so the fix site is `validate-prompt-system.ps1` (a sixth invariant), not either map. Apply the preamble's *"a check is not finished until it has been made to fail"*. Note the parser must tolerate both catalogues' legitimate platform-specific lines (e.g. `.codex/commands/simulation-plan.md`'s "do not invent model identifiers"), which are adapter translation, not workflow duplication |
| REC-070 | Victor, 2026-08-10, on what the two maps are actually for | **Author the machinery evaluator on top of the two maps, verifying their freshness from git rather than re-auditing, and give the usage dimension an owner.** Victor does not study `README.md` or `_system-map.md` and does not intend to: their purpose is to let a later agent judge the machinery for gaps, improvements and parts that are never used. Reading them instead of re-reading 30 prompts and 17 skills is the intended economy, and it is `map-sync` — not `/system-check` — that keeps them true between explicit audits, because a global audit is the most token-expensive thing in the system and must stay rare. Three conditions. **(a) Verify freshness cheaply; never trigger `/system-check`.** Run `validate-prompt-system.ps1` first — it costs no tokens and its invariant 5 catches the one failure `map-sync` cannot, a prompt or skill that exists and no map registered. Then use git, not a re-read: `map-sync`'s contract puts the map edit **in the same commit** as the machinery change, or the run declares `maps unaffected` out loud, so every commit touching `notes/prompts/`, either skill tree or either launcher catalogue since the last `_system-check-report.md` baseline that carries no map edit is the **suspect set**. Read only that subset from disk and trust the rest of the map as written. This also makes the `maps unaffected` declaration falsifiable for the first time — today it is a sentence in a report that nothing checks. **(b) The usage dimension, which the maps do not carry and should not.** Nothing in the system measures whether a prompt has ever run, whether a skill has ever fired, whether a declared output was ever written, or whether a gate has ever closed. The evidence exists — `_run-tracker.md`, every `{family}/_internal/_last-run-report*.md`, `_skill-friction.md`, the `## Closed` ledger lines, and `git log` over the same paths — and `REC-068` deliberately removed the tracker from `/system-check`'s inventory, so this question now has no owner anywhere. **(c) No duplication:** structural findings (overlapping writers, missing consumers, broken loops, orphan outputs) are `/system-check` Step 5's, and cost-against-benefit per ritual is `REC-054`'s lived-day half. The report must render a **diagram**, not only tables: an orphan output or a dead-end chain is visible at a glance in a graph and invisible in a row | open | Do not author before `/system-check` has run once in its `REC-068` form — that run is the baseline commit the freshness check needs, and its Step 5 output measures how much of the structural half already exists, after which this may collapse into *grow Step 5 a usage input and a diagram* rather than a second global prompt. Design it as a cheap, repeatable pass: the validator, a bounded git query, the two maps, the run evidence — not a fan-out of cold readers over the machinery, which is what makes `/system-check` expensive and explicit. Then settle the split axis raised the same day: the current cut puts prompts in `README.md` and skills in `_system-map.md`, one engine per file, where a cut by *kind of question* (component catalogue / wiring) may serve an automated reader better — the evaluator consumes whichever shape the maps end in. **Sequencing reversed 2026-08-10:** this row said to sequence after `REC-054`, whose lived-day verdict would decide which rituals are worth measuring at all. That verdict has no evidence to be made from, and (b) is what produces it — so **(b) runs first and feeds `REC-054`**, which also makes (b) this table's unfreeze condition. Maps affected when applied — a new runnable prompt adds a catalogue row, a §7 writer row, a §9/§11 entry and a launcher pair in both adapters |
| REC-087 | cold reviewer on `REC-083`, 2026-08-10; owed to `/plan-audit MODE = review` at gate G2 | **`projects/07-timetrack/PLANNING.md` §23 owes three repairs its owner must make, two of them found while checking a third.** **(a)** Its G4 cell still carries the date framing `REC-083` removed from `_planning-standard.md` in `0d17e220`, and now also lacks the `PROJECT_PATH` added in `c9270c1c`. **(b)** Its G6 cell is a **live forked rule**: the standard names `cv-prompt`, `project-brief` and `review-audit` as `PROGRESS.md`'s readers, the plan names "G7 and `cv-prompt`" plus an owner list the standard does not have — two statements of one rule, neither derivable from the other. **(c)** The gate list ends at G4 while §22 puts **Step 8 (backend tests)** and **Step 11 (Docker)** *after* the branch that triggers it, so this project's backend gains code after its last review gate with certainty, and no §23 box tracks it | open | **Not ours to fix**, on `REC-085`'s precedent and the preamble rule this row's parent established: §7 names `/plan-audit`, `step-complete` and `backlog-task-close` as this file's writers and a machinery session is none of them. The `_planning-standard.md` half already shipped, so the standard is the correct source to resync **from** — do not re-derive the wording. (c) is the substantive one and is a real plan defect, not a wording drift: decide whether 07 re-fires G3 scoped `backend` after Step 8, or whether §22 moves the backend work before G4. (a) and (b) are then mechanical. Maps unaffected — the fix changes no file's writer, trigger or existence |
| REC-084 | residue of `REC-057`, promoted 2026-08-10 | **A declared exercise path that is well-formed but wrong is invisible to every check.** The validator's `$referencePathPattern` (L208) matches path *shape* only, so a realistic typo such as `03-jions.sql` passes: the file it names does not exist, and nothing cross-checks declared exercise paths against `PLANNING-{LEVEL}.md` §1's own file list. `REC-057` bounded the pattern and then verified by mutation that a plausible fake still survives | open | This is a **design change, not a pattern fix** — the check needs a second source to compare against, which is why `REC-057` left it rather than widening a regex. Apply the preamble's *a check is not finished until it has been made to fail*. Worth folding in with `REC-067`, which also adds a validator invariant, if both are done at once. Maps unaffected — the validator is not a map |
| REC-086 | cold reviewer on `REC-080`, 2026-08-10 | **`sql-plan-audit.md` L212 now restates a rule the runtime standard owns.** "A specialist that dies mid-run is resumed, not re-dispatched… if the resume also fails, then re-dispatch cold" was the machinery's only mid-flight-death rule and it is the one `REC-080` promoted into `_agent-runtime-standard.md`'s dispatch ladder. The two **agree today**, which is exactly when a fork is invisible — and this copy names no other file, so a pointer grep never reaches it | open | Deliberately left out of `c4fa62c6`: a contract change must not hide inside a prompt commit, which is the same rule that kept `REC-080` out of `REC-078`'s batch. The `SendMessage` mechanics is what the standard cannot say and **stays**; only the rule sentence collapses into a pointer, per the preamble's *a derived section states only what its source cannot say*. Check the surrounding re-dispatch caps still read correctly once the sentence is a pointer — `sql-plan-audit.md` L209 and L218 each carry their own count. Maps unaffected |
| REC-085 | residue of `REC-073`, promoted 2026-08-10; owed to `/sql-plan-audit` at gate G1b | **`practice/sql/PLANNING.md` mis-states who refreshes its own §0, in three places.** §0's header says "Update it at the start of every session" (L25), and the Moment 4 bullet attributes the §0 header to **the level's route file** (L209) — but §0 belongs to this doctrine, and its live values are written by `_sql-exercises-review.md` 4d on a step close and verified by `sql-step-close`. §4 item 5 also still calls the close's commit manual, when `sql-grade` and `sql-step-close` commit the doc files themselves | open | **Not fixable by a machinery session:** the doctrine's declared owner is `/sql-plan-audit`, and hand-editing it here would breach the very ownership fence `REC-073` was writing. `_sql-plan-standard.md` already names all three sites as checks so the audit cannot fix one and leave two. Two sites verified live on disk 2026-08-10 (L25, L209); the audit sweeps for the third. Maps unaffected |

## Closed

**One line each: the ID, what it was, and the commit.** Nothing else — the full reasoning of every one of
these lives verbatim in `git log -p` on this file, so restating it here buys nothing and costs the
readability of `## Open`, which is what this ledger is for. Three things do earn their place in a line: a
**rejected** item keeps its reason, because that reason is the only thing stopping the next analysis
re-raising it; a **residue** clause names work the item left open; and the `maps` token says whether the
two-map test was run. If a line needs a paragraph, the rule it established belongs in the preamble
instead. Ordered by ID.

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
- `REC-045` — `REC-039`'s demotion propagated into the files that schedule the run; a gate closes on an empty drift report, not on the run happening · residue **checked 2026-08-10 and closed as a false positive**: G5/G7/G8 in `07-timetrack/PLANNING.md` §23 name `progress-update` nowhere, so they carry no pre-demotion assumption, and G6 — the only one that does — already has the corrected wording — `3edfe77`
- `REC-047` — already resolved in the live notes contract; the row's search for the obsolete label `Coverage bullets:` was a false negative · maps: affected in the original change — `badf828`
- `REC-048` — `PROGRESS.md` split into `Coverage demonstrated` / `Study progress` / `Practice completed`, by level, each owned by its closing ritual; a stale denominator prints `—`, never a false `0%` · maps: both — `b9e2990`
- `REC-049` — **rejected.** False positive: `project-brief` already keyed on `✅ NN-slug` markers and excluded `✅ sql:*` drill markers from its birth in `fdea4d8`, before the row opened · maps unaffected — `—`
- `REC-050` — `/roadmap-review` ran at G8 on `REC-042`'s rewire, consumed the preserved SQL drift and aligned `ROADMAP.md` with the current gates · maps unaffected — `4886805`
- `REC-051` — the review gate measures **unreviewed code**, not a 30-day clock; the date is reported, never obeyed · residue promoted to `REC-083` — `70956ce`
- `REC-052` — timed simulations become a level-planned, coverage-fingerprinted route: immutable timed evidence, `simulation-grade` the only cold-review door, consumed MISTAKES rows · maps: both — `42a34753`
- `REC-053` — inline study writing confined to refining an already complete planned pair; it cannot create, number or complete a note, and prose debt routes back through `/notes-plan` → `/notes-audit` · maps: both — `40fb918`, `b9e2990`
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
- `REC-068` — `/system-check` narrowed to a **machinery** audit (live state out of its inventory, denominator and blocking conditions; 9 steps → 8; validator gains `-MachineryOnly`), and the two maps split by owner: `README.md` owns per-prompt facts, `_system-map.md` owns wiring and per-skill contracts · maps: both — `0d1b8a5d`
- `REC-069` — the inverted per-project gate chain lived in **four** project standards, not the one the row named; all four now state their gate position and point at `_planning-standard.md` §23 · maps unaffected — `d1a60c92`
- `REC-071` — the stale runnable count in `_single-shot-self-report.md` was **deleted, not corrected**: an unguarded third copy of a number the validator asserts in code and both maps publish · maps unaffected — `dc2bef68`
- `REC-072` — the external-path preflight banner was missing from **three** prompts, not one; `profile-readme-prompt.md` also had to name its second external path · maps unaffected — `e2c32a36`
- `REC-073` — the SQL doctrine fence named one writer and there were four: **authoring a value and correcting one are different rights** (promoted) · maps: README carried the false cell · residue promoted to `REC-085` — `5af88b7b`
- `REC-074` — the simulation level-close gate was written in two vocabularies, a step state and a row count, with the mapping between them stated nowhere, so the two were never comparable; the mapping is now defined once, in the standard · maps: README — `21a091fe`
- `REC-075` — the coverage-mirror question was never about reliability but about what a read is **for**: a spot lookup is free, a cross-topic enumeration needs a quoted validator PASS, a measurement is read from the topic files · maps: both — `afb9e57d`
- `REC-076` — `/system-check` could prove a map cell **false** but never **complete**, and published the absence anyway; Step 4 gains the missing evidence → claim direction and a third disposition, `unverifiable`, and the absence rule now governs every verdict · maps unaffected — `d3f5c07b`
- `REC-077` — **rejected.** `/system-check`'s survival of a session limit is accidental rather than designed: an analyst persists its manifest only by improvisation, and Step 2 declares no wave size. Rejected because no run has ever produced a wrong result from it — the 2026-08-10 death recovered fully and the recomputed manifest had not moved — and `REC-080` has since shipped the dispatch ladder and the scratch-write authorization that cover the general case. Re-open on the first death that lands *after* the completeness gate closes, which is when it becomes a result defect · maps unaffected — `{commit}`
- `REC-078` — **rejected.** The Step 6 → Step 7 seam is unspecified in both directions: Step 6's draft report has no producer, and a run blocked at Step 3 reaches Step 7 with item 8 unanswerable. Rejected because the branch has been executed twice (`feb6818c`, `b38ee45e`) and the orchestrator improvised the missing spec correctly both times — no wrong report has ever shipped. Re-open on the first run that gets item 8 wrong, and fix it with `REC-077` if that one ever re-opens too · maps unaffected — `{commit}`
- `REC-079` — Step 2C dispatched an analyst whose output no step consumed; **deleted**, because a derived extract of the object under review is worse evidence than the object at any size (promoted). Its cold reviewer caught that the deletion also orphaned the two maps' only manifest owner · maps: README — `d3f5c07b`
- `REC-080` — the row asked for persistence "before returning" and that is the one moment a mid-flight death never reaches: the reviewer now writes each finding **as it reaches it**, and a launch failure, a runtime error and a session-limit death became one case taking one ladder — read what it persisted, resume, re-dispatch once — so a death is not a failed dispatch until that ladder is exhausted · maps: system-map — `c4fa62c6`
- `REC-081` — **rejected.** `project-brief` and `plan-audit` compute their freshness digest over the coverage **mirror** while `_coverage-standard.md`'s canonical command names the **topic** files. Rejected because it is already documented there as a named exception, so nothing reads as silently violated, and because changing what a gate hashes *moves the gate*: every stored brief digest was computed over the mirror, so a switch would mark all of them `superseded` at once for no gain in what the gate actually decides. Re-open only if a brief is ever wrongly refused as stale · maps unaffected — `{commit}`
- `REC-082` — a skill written as a slash command in `progress-update-prompt.md`'s drift-report example; fixed to the bare name, and the convention stated where it is owned — `_session-rules.md`, not the derived maps, which its cold reviewer corrected along with a false universal the fix had written into `README.md` · `_system-map.md` unaffected, `README.md` edited as the rule's site and not as a map — `161f5db2`
- `REC-083` — G4's justification argued from the backend's date after `REC-051` retired the clock; the owner now argues from what G3 reviewed and routes the exception to a re-fired G3 instead of an untracked run · the project plan's word-identical copy was **not** hand-edited — it crosses §7's writer fence and became `REC-087`, which its cold reviewer widened by two further defects in the same table · maps unaffected — `0d17e220`

## Suggested order for the open items

Added 2026-08-06. The rows above are the authority on *what* each item is; this is the order that keeps
them from tripping over each other. Three rules produced it: **a correction that stops a wrong run comes
before a build**, **an item blocked on evidence is run, not edited**, and **a chain is walked from its
denominator up**, never from the visible end.

**Wave 1 — the plan family, before project 08 is planned. ✅ Closed 2026-08-06.** `REC-041` → `REC-036`,
both corrupting `MODE = new`, which is what plans project 08. Project 08 can now be planned.

**Wave 2 — the corrections that block nothing. ✅ Closed 2026-08-08.** `REC-040`, `REC-051`, `REC-053`,
`REC-057` and `REC-055` (a)-(d) are all done; `REC-053`'s systemic half closed with Wave 4 and
`REC-055` (e) is parked with `REC-054` (Wave 7 dissolved 2026-08-10).
**"Free" and "minutes each" have been the wrong label on every one of them** — 053 lived in five places
across three files, 051 in six rather than the three its row named, and 057 turned out to be four checks
*plus* thirty repairs in a file its row never mentions. That is step 1 of the preamble: budget the sweep,
never the edit. `REC-060` came out of `REC-057` and does **not** join this wave — it is a ruling about a
rule every prompt depends on, not a correction.

**Wave 3 — run what is blocked on evidence. ✅ Closed 2026-08-08.** `REC-050` ran at G8 after
REC-042's rewire, consumed the preserved SQL drift, and passed both cold reviewers.

**Wave 4 — the tracking chain. ✅ Machinery closed 2026-08-08.** `REC-047`, `REC-048` and the systemic
half of `REC-053` are closed. The ruling kept authored, studied, demonstrated and practised as separate
states; `study-block-close` now owns the 13:30 study evidence and every new PROGRESS cell has one writer.
`REC-046` remains only for the content-side full interview-prep audits that make its denominator current;
until then the Q&A cells correctly remain `—`.

**Wave 5 — the consumers, re-read after the chain. ✅ Closed 2026-08-08.** `REC-049` was rejected after
re-verification: `project-brief` had keyed its gap analysis on project evidence markers since its birth,
before the recommendation opened, and `plan-audit MODE = new` already consumed the durable decision
without re-deriving it.

**Wave 6 — new machinery. ✅ Closed 2026-08-09.** `REC-052` and its required feedback half
`REC-059` landed after Wave 4's counters. The route is plan-driven, timed evidence is immutable, and
both timed-build and live-interview weaknesses now feed a consumed retry/reinforcement loop.

**Wave 7 — dissolved 2026-08-10. The last wave is 6.** It held `REC-054` alone, sequenced not by
dependency but by **state**: its two claims were said to be worth making only about machinery that had
stopped moving, so running it earlier would audit a moving target and spend the one cold read that matters
on a version that will not survive. That reasoning is still sound and its premise was the wrong one. The
binding constraint on a lived-day review is not that the machinery keeps moving — it is that **the days
have not been lived**, and waiting for the machinery to settle does not produce a single day of use. A wave
is a sequencing device for work that is ready and merely out of order; `REC-054` in its reshaped form is
never "ready" on a date, it **fills up**. So it leaves the wave numbering entirely, and `REC-055` (e) is
parked with it rather than inheriting a wave number from it.

**Where the map-review items land (`REC-055`-`REC-059`, added 2026-08-06).** They are not a wave of
their own: three slot into waves that already exist, and two are gated on other work. **`REC-057`** (the
untested invariants), **`REC-055` (a)-(d)** and **`REC-056`** (`/system-check`) are done. The final ruling
on 056 is the explicit prompt recorded in `## Closed`, not the earlier read-only/session-start sketch.
**`REC-059`** was not a separate build — it closed inside `REC-052` in Wave 6. And
**`REC-055` (e)**, the map's missing per-day view, is written **out of** `REC-054`, never
before it — and is therefore parked with it now that `REC-054` has no run date (Wave 7 dissolved).

**Where the 2026-08-10 audit items land (`REC-067` from the day before, plus `REC-069` and
`REC-070`-`REC-081` — thirteen rows raised in one day, added as they were raised).** Not a wave: they
split by what each one is waiting on. **Four were corrections that block
nothing and need no ruling — `REC-069`, `REC-071`, `REC-072` and `REC-073`, all four closed by
2026-08-10.** Wave 2's lesson governed every one of them and was never once wrong: **budget the sweep,
never the edit** — each lived in more places than its row named (`REC-069` in four project standards,
`REC-072` in three prompts, `REC-073` in seven sites across a standard, three prompts, a map and a
mirrored skill), and in three of the four it was the **cold reviewer**, not the sweep, that found the
last site. `REC-071` still has a second site in `REC-067`'s shape (a population the validator computes
and never cross-checks against the prose quoting it). **Two are rulings, not edits**, and must not be silently
aligned: `REC-074` (one gate, two closing conditions) and `REC-075`, **both closed 2026-08-10, each
with an explicit ruling** — and `REC-075`'s closure carries a lesson for the four still open: the row's own framing ("opposite *reliability*") was
wrong, and the draft written from it asserted that nothing verified the coverage mirror while
`validate-prompt-system.ps1` had been proving that exact invariant on every run. **Before writing that
the system does not check something, run the check it does have.** The residue is `REC-081`, which waits
on one ruling it must not be allowed to skip: changing what a gate hashes **moves the gate**, so it is
sequenced behind an explicit decision to re-baseline every stored brief digest at once.

**The `system-check-prompt.md` cluster was four rows and it was never one tier.** They share a file, so
they share an *analysis*; they do not share a priority, and batching them by file is how a row that fails
the bar ships on the back of one that does not.

- **`REC-076` + `REC-079` — closed 2026-08-10 as one analysis, and they went first for the right
  reason.** Same file and the same Step 4: the two directions of one hole — claim → evidence and
  evidence → claim — and the only two of the four whose defect had already reached a **published** cell.
  They landed **before the next `/system-check` run**, which was the whole point: the run that would have
  surfaced them again is the run they made untrustworthy.
- **`REC-078` rides with them if that analysis is already open, and never justifies opening it.** Same
  prompt and same run's evidence, but it **fails bar condition 3 as observed** and its branch has been
  executed twice with the missing spec improvised correctly both times. It is cheap *because* the file is
  already open; alone it is a rule about a path nothing has yet got wrong.
- **`REC-077` + `REC-080` were one failure mode in two layers, and the reviewer's half went first —
  correctly. `REC-080` closed 2026-08-10; `REC-077` stays open.** Two lessons from doing it in that
  order. The fix landed in a **fourth** file the row never named, `_agent-runtime-standard.md`: the
  three named sites all restate a term (`cannot be dispatched`) that the runtime standard owns, so
  widening the term at the owner reached eleven sites at once and editing the three would have forked
  it. And the first draft was **rejected** for widening it too far — the row's own framing, *a death is
  a failed dispatch*, would have converted the two runs that survived a session limit by re-dispatching
  (`/system-check` 2026-08-10's nine analysts, `review-audit` 2026-08-06's batch of four) into mandatory
  `blocked` closes, and contradicted `sql-plan-audit.md`'s standing rule that a dead specialist is
  **resumed**. A row that names a defect can still be wrong about its direction.

**`REC-070` is unblocked**: its stated precondition was
`/system-check` running once in its `REC-068` form, which happened on 2026-08-10 and produced the
baseline commit its freshness check needs. **Its order against `REC-054` was reversed the same day, and
this paragraph previously argued the reverse of what it now says.** It read: `REC-070` sequences after
`REC-054`, and `REC-054` is Wave 7 and last, because *thirteen rows raised on 2026-08-10 is the definition
of machinery that has not stopped moving* and a lived-day review is only worth making about machinery that
has stopped. The row count was right and the inference from it was wrong — motion was never what blocked
`REC-054`; **absence of use** was, and the two are not the same constraint. `REC-070` (b) is what measures
that absence, so it goes first and its output is the input `REC-054` was missing. The thirteen-row figure
stays as written because it is **dated and immutable** rather than a live count: it was previously written
as "seven", meaning `REC-071`-`REC-077`, and stayed accidentally true after six of those closed and six
more opened — `REC-071`'s lesson (a hand-maintained count in prose goes stale silently) applied to this
paragraph.

**The four promoted residues (`REC-082`-`REC-085`, 2026-08-10).** All four were open work parked inside a
`## Closed` line, which is the wrong carrier: a closed line is an index entry, and nothing re-measures
what sits in one. The proof is the fifth, `REC-045`'s — **checked on promotion and closed as a false
positive**, having sat there unexamined since it was written. None of the four blocks anything and all
are small. `REC-085` is **not ours to fix**: the SQL doctrine's owner is `/sql-plan-audit`, so it closes
at gate G1b, never in a machinery session. `REC-084` folds into `REC-067` if both validator invariants
get written at once. **`REC-082` and `REC-083` closed on 2026-08-10** — expected to be one-sentence
corrections, and neither was: each carried a convention question that had to be ruled on and sited before
the sentence could be written, and each cold reviewer returned `approve-with-tightening` over defects the
fix had introduced rather than over the original finding. `REC-083` also fenced out half of its own scope,
which is now `REC-087`. Read that as calibration for the two that remain: a residue promoted out of a
`## Closed` line is small in *edit* size, never reliably in *ruling* size.

**Two orderings that look right and are not.** Starting the chain at `REC-047` part 2 — the marking is
the visible half, but it marks against a list that does not exist yet and reports to a target nobody has
chosen. And building `REC-052` early because it is the most exciting — a simulation track whose closing
ritual has no PROGRESS.md cell to write ends up with the same hand-maintained tracker it was meant to
replace.

New self-reports append or update a row in `## Open`. A historical report remains immutable evidence;
its wording does not determine current status. The ledger does.

A resolved item leaves `## Open` entirely — it becomes one line in `## Closed`, and any rule it
established moves to the preamble first (step 4). **Nothing is lost by that:** the full reasoning of
every closed item is in `git log -p` on this file, which is where it belongs, because a resolution
written for the day it shipped stops being read long before it stops being true. What a future reader
needs from a closed item is the decision, not the argument — and if the argument matters again, the row
was not the right home for it.
