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
output if someone ran it is a cell in `_run-tracker.md`, never a row (the `REC-046` rule below). **Whose
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

1. **Analyse the problem, never only the row.** A row records where a defect was *found*; it is
   routinely wrong about where the defect *lives*. `REC-053` named one file and the rot sat in five.
   `REC-051` named three sites and there were six, two of them naming the gate by the very thing the
   item removed. `REC-057` asked for a check that already existed and was blind not to a *location* but
   to a path **form**. Measure against disk before proposing anything, and budget the sweep rather than
   the edit. **Name the set you measured**: step 3 hands it to the reviewer, and a measurement nobody
   wrote down cannot be handed to anyone.
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
4. **Collapse the row into `## Closed`** — only a `sweep: complete` review returning `approve` or
   `approve-with-tightening` may reach this step; `reject` and every incomplete sweep leave the row
   open under step 3. The one-line closure carries the ID, what the item was,
   `cold reviewer: approve | approve-with-tightening`, the two-map declaration, and the implementation
   commit. This reviewer field starts with `REC-107`;
   historical lines are not retrofitted. Before collapsing, promote any rule the row established that
   governs **future** work into this preamble. A rule that other items obey must not stay buried in a
   row about something else; that is how the `REC-025` precedent came to be cited seven times from
   inside a row about SQL specialists — and misread every time, which is the second reason to promote a
   rule rather than cite it across rows.

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
itself in the first person is the one you leave behind. **`REC-117` is its fourth instance, and there
the copy hid from the *tool* rather than from the reader.** These files wrap at ~100 columns, so a
branch resolving `{FILE}` "from the shell's **path** / **table**" split across two lines and no
line-oriented grep for that phrase could ever return it; a cold reviewer reading the family found it,
and the next pass found the same block calling a file "not in **this table**" — a deictic whose
referent had been deleted, matching no search for the claim's words at all. **Search multiline
(`rg -U`), and sweep for the claim's *referent* as well as its wording**: a measurement run line by
line over prose that wraps measures the margin, not the claim.

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

**A pointer names its target; a direction is not a target.** From `REC-086`, whose two worst defects
were introduced by the very edit that collapsed a fork into a pointer. The collapse itself was right;
what went wrong is that the sentences left standing around it inherited deixis the original never
needed. A self-contained restatement needs no directional word — it says the whole rule in place — so
the moment it becomes a pointer, every *this*, *that*, *above*, *below* and *this section* around it
starts resolving against a file it no longer restates. Both failed here: "neither re-dispatch count in
**this section**" scoped the claim in a word the file reserves for three other things (`Section A-E` of
the standard, `## ` sections of a coverage file, `§N` of the plan) — `REC-074`'s second-vocabulary smell
— and "the concern's one-per-run budget **below**" pointed into a region holding **two** once-only
re-dispatches, where the wrong reading spends the history gate's retry and aborts the run without
committing. **When you collapse a restatement into a pointer, re-read every relative word in the
surrounding paragraph and replace each with the name of the thing.** A pointer a reader can mis-resolve
is worse than the fork it replaced: the fork at least said what it meant.

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

**An unrun prompt is tracker state, never a recommendation.** From `REC-046`. A row whose content is
"run these prompts" duplicates `_run-tracker.md`, which records exactly that and does it better: an empty
cell names the target, the level and the prompt, while the row names a campaign. The two then drift, and
the ledger — which is meant to hold **defects in the machinery** — starts carrying an operational
worklist that nothing ever drains. `/system-check`'s inventory was narrowed off live state for this same
reason in `REC-068`. Before filing an item, ask whether the thing that is wrong is a *file* or a *cell*: a
prompt that would produce the right output if someone ran it is a cell. Two corollaries. The tracker only
owns what it has a **row** for, so check that the row exists before deleting a ledger item onto it —
`interview-prep-route-prompt` declared a single-shot row the table did not have. And a row deleted this
way must carry any **ruling** buried in it into the file that owns the rule, or the deletion loses it.

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
to settle first. **`REC-089` carries the first corollary from checks into gates.** `/progress-update`
spoke its drift rows aloud and wrote nothing, so the branch that leaves a gate **open** was at least
said out loud while the branch that **closes** it left no trace at all — a clean run did not even commit
`PROGRESS.md`. When a gate closes on an artefact, ask which run produces that artefact **on the passing
branch**: if the answer is "the run that changes least", the gate is unfalsifiable exactly when it
passes, and the box gets ticked from memory days later.

**A check over a hand-written convention starts by counting the convention's forms, and publishes
its own reach as a number.** From `REC-067`, and it is `REC-076`'s corollary made concrete. The config
block that invariant 6 had to parse is written two ways — the heading inside the fence and the heading
above it — both legitimate, and a third shape, the `## How to use` recipe block, wears the identical
`KEY = value` syntax without being a contract. A locator written from the first file opened reported 15
of 31 prompts as broken. So: **measure the population's shapes before writing the pattern**, and where
two forms are both canonical, accept both and say so rather than normalising 24 files to make one
regex simpler. Then, because a comparison that quietly compares nothing passes exactly as loudly as one
that compares everything, **the PASS line carries the counts and they are incremented where the
comparison happens** — the first draft printed the runnable-prompt count in place of the pairs actually
compared, true only by an argument the reader of that line cannot see. Half of invariant 6's keys are
metavariables it cannot settle; that half is a published number and a named limit in `README.md`, not
silence.

**An exemption granted by shape is a hole the size of its population's typo surface, and every
exemption owes either a second source or a published limit.** From `REC-084`. A check that cannot
require a file to exist — because a prompt has not written it yet — falls back to matching the path's
*shape*, and shape is not name: `03-jions.sql` passed exactly as readily as `03-joins.sql`. No pattern
closes that; it takes a second artefact holding the real names, which is why the row sat open after
`REC-057` bounded the pattern and could go no further. Three consequences worth reusing. **The oracle
decides the mode, not the file that fails**: what invariant 7 blocks on is a prompt, but what it reads
to decide is a live route, and `-MachineryOnly` exists so live state cannot block `/system-check` — so
it is skipped there, and a version that was not would have failed an audit contractually barred from
opening the route to see why. **An exemption list is a claim about a whole population**, so enumerate
its branches and give each one a source or a named limit; of the SQL exercise, simulation-spec and
`_last-run-report*` families only the first had a second source on disk, and saying so as a number is
the difference between a bounded check and one that quietly covers a third of what it appears to.
And **where a check's own allowlist sits in the chain is part of its meaning**: collecting a
reference before the historical-path exemption ran made that exemption unreachable, so a file
recounting the renumbering that retired a path could no longer name it.

**A hand-written convention has columns as well as forms, and prose cells name other people's
files.** Also `REC-084`, and the defect was introduced by the fix to a cold reviewer's own finding —
the second reviewer pass caught it. `REC-067` established measuring a convention's *forms* before
writing the pattern, and section 1 duly has two: an English exercise table and a Spanish revision
table, so any locator keyed on a header reads one and calls the other's five files typos. Reading
table **rows** is blind to the header and fixes that. But a row is not a name either: only its first
cell holds the authorised file, and every other cell is prose that legitimately names *other* files —
five of the twenty rows already do. Widening from the first cell to the whole row, to fix a row that
could name two files, re-opened the exact hole the check exists to close, and it re-opened it
*silently*, because the five extra names it swept up were all authorised elsewhere and the published
count did not move. Narrow to the column that holds the value; a harvest that reads a neighbouring
cell is reading a sentence, not a contract.

**A non-ASCII literal in a BOM-less `.ps1` is not the character you typed.** Also `REC-084`, where it
bit three times in one session — in the check, in the author's probe, and in the cold reviewer's.
`validate-prompt-system.ps1` has no UTF-8 BOM, so Windows PowerShell 5.1 reads it as ANSI: a literal
`§` arrives as two characters and a literal `✅` as three, and any regex containing one matches
nothing, for ever, in silence. The first draft of the section-1 locator harvested zero names and
compared nothing while printing a clean PASS; the same trap was found sitting **pre-existing** in the
simulation route's `Level status: closed ✅` test, which would have failed the first level ever to
close for lacking metadata it plainly carried. Build such characters from their code point
(`[char]0x00A7`) so the source stays ASCII, and remember the trap applies to any script that
round-trips one of these files — `Get-Content -Raw` under 5.1 will mangle `§` on the way through.

**A check whose population is selected by a hand-written field must enforce that field's value, not
merely count its forms.** From `REC-090`. `REC-074` said two statements of a rule cannot be compared
until their terms are defined in one place; this is that rule one level out — the terms of the
**selector** must be settled before the check exists. `Status: applied in <hash>` meant "the prompt was
edited" in both self-report contracts and "the run's output was committed" in one report on disk, and
nothing had ever compared them, so the first thing the new invariant would have done is fail a report
for a defect it had not detected: right that something was wrong, wrong about what. Counting the
convention's forms (`REC-067`) is necessary and **not sufficient** — this check enumerated four `Status:`
shapes and five verdict shapes and still left the *value* free, so `Status: applied (commit abc)` fell
out of the population with no error and no counter, an escape available to exactly the context the check
exists to constrain. A shape that is measured but not required is an exemption nobody published.
**The same row's second lesson: normalising a text to heal a wrap must be bounded to the wrap.** Healing
five hand-wrapped forms by flattening every newline in the file made a paragraph ending "…went to the
cold reviewer:" and a next one opening "approve" into a passing gate, and it made any report quoting its
own contract pass too. One optional newline per seam of the token covers the identical five forms and
cannot cross a blank line. Both defects were introduced by the fix, neither was found by a six-case
injection pass, and both were found by the cold reviewer — the fourth row running whose worst defects
were written by its own repair.

**A status that drives behaviour has one owner, one meaning per state, and consumers execute its table
instead of interpreting its prose.** From `REC-101`. A settled outcome and live unapplied work cannot
share a token and ask every caller to reconstruct the difference from a second field; the vocabulary,
transition timing, legacy compatibility and run-start decision all stay in the same owning contract.
Historical reports remain evidence and are not rewritten merely to normalise them: one bounded branch
at the owner classifies their old value until the next run replaces it. The validator matches the whole
value, not a promising prefix, and a consumer that cites the contract only at close-out has not executed
its run-start table — the cold reviewer found both defects in the first repair.

**A condition is evaluated against a state, and a definition that omits the state is satisfiable too
early.** From `REC-093`, whose cold reviewer returned `revise` on exactly this. Defining a gate's
sign-off as "its closure-checklist box can be truthfully ticked" reads as complete and is not: the box
says the review's Highs are *fixed*, and a fix sitting on an unmerged branch satisfies that wording
while the gate can still read none of it — so the definition re-derived the very answer the row existed
to reject, and passed its own falsification test only because unrelated new findings had reopened the
backlog that week. Name the state the condition is read **of** (here, the project branch as it stands),
and check the definition against the live artefact in the state that made the row necessary, not the
state on disk today. The row's second lesson is `REC-064` with the source and the fork in **one file**:
the §0 section spec enumerated two of the derivation's four cases ten sections above the invariant that
owns it, so the fork needed no second document — a spec section restating a rule it does not own is
already the fork, and the fix is a pointer.

**A rule needs a holder who can evaluate it, and naming the wrong one survives review.** From
`REC-092`, whose answer to one question was rejected by four consecutive cold reviewers — each time
because the rule was addressed to something that could not act on it. First it was declared enforced
by a prompt whose cited guarantees turned out to govern only its own stages; then addressed to "the
caller", which for one consumer is a program whose contract contains no line of it; then given a
detection heuristic that fired mostly on the consumer's own uncommitted output and failed open through
the audit's longest stages. What finally held was smaller than all three: **no automatic path exists,
the only path is Victor's own hands, so it is a rule for Victor and no gate is built.** Before writing
a rule, name the actor that will read it and the state it can actually observe; if that actor is a
person, say so out loud rather than dressing the rule as a check. The corollary the same row paid for
four times: a *check* that cannot fail closed is worse than an admitted rule, because it reads as
protection.

**A summary line that drops a noun becomes a rule about the wrong thing, and its readers are the record
of how it was read.** From `REC-100`. Two files promised that `readme-audit` "hands Victor the commit
command — **one per README** actually changed" while its Finishing section handed one `git add` per
changed README and **one** `git commit`. Neither clause was drafted wrong: `git show 36449ba8^` shows the
predecessor saying "not all three by default. **One command per file:**" above three `git add` blocks and
one `git commit`, so the split that created the pipeline compressed *"one `git add` per README"* and
dropped the noun. Two things generalise. **On a `contradiction` row, read the commit that wrote the
clause before arguing which half wins** — `git log -S` on the phrase settles in one command what a
paragraph of textual argument only makes plausible, and it is *quote the owning file, never paraphrase
it* one layer down, in time instead of in space. And **sweep the sentence's readers, not just its
family**: a downstream restatement is evidence of how the compression was read, and here two of them had
already converted it into behaviour — `readme-concept-add` into "One atomic commit per README"
(`3bab8381`), then `step-complete` into the ritual that calls it. That is what took the site set from two
files to six, and the cold reviewer, not the sweep, found the last two.

**A map's freshness is verified from git, never by re-auditing.** From `REC-070` (a), promoted when that
row was deleted as out of scope. `/system-check` is the most token-expensive thing in the system and must
stay rare, so nothing may trigger it merely to ask whether a map is current. The cheap chain is:
`validate-prompt-system.ps1` first — it costs no tokens and its invariant 5 catches the one failure
`map-sync` cannot, a prompt or skill that exists and no map registered — then take as the **suspect set**
every commit touching `notes/prompts/`, either skill tree or either launcher catalogue since the last
`_system-check-report.md` baseline that carries **no** map edit, because `map-sync`'s contract puts the map
edit in the same commit as the machinery change or declares `maps unaffected` out loud. Read only that
subset from disk and trust the rest of the map as written. This is also the only thing that makes a
`maps unaffected` declaration falsifiable, which today is a sentence in a report that nothing checks.

**"Who commits" and "what the commit contains" are different questions, and only the second is answered
by enumerating writers.** From `REC-099`. The row found a real contradiction about commit *ownership* and
it was shallow — one stale clause against nine correct ones, and the author it misinformed was already
told "do NOT commit" in the same sentence. What the same file was actually getting wrong was its `git
add` list: a seventh specialist had been given a check that fixes `PROJECT-BACKLOG.md`, and neither
mode's file list, nor either map's writer registry, nor the reviewer prompt's own reading map had
followed it — so that fix was written on every run, never staged, and Finishing's `git restore --staged`
safety check would have actively unstaged it. This is *Deleting a role does not delete its assignments*
run backwards: **adding one does not add it to the denominators either.** When a commit step is under
review, enumerate every subagent the run dispatches and every file each one writes, then check the list
against that enumeration — the answer is never inside the commit step, which consumes the enumeration
rather than producing it. Two corollaries the cold reviewer supplied, both against the fix. **An
amendment to a procedure is read in the procedure's execution order:** the repair was first written as a
bullet *after* the two mode bullets, each of which ends in `git commit`, so it was unreachable on exactly
the path it repaired. And **a file a specialist may edit must appear in the reading map that licenses it
to open the file** — the twelfth check had been fixing a file its own prompt never let it read, and the
map edit asserting that read is what exposed it.

**When two mandatory rules collide over one output, ask what the stricter one's evidence is *of*.** From
`REC-133`. The per-slice flow reviewer was told to quote a config finding's offending line "value
included, e.g. `app.jwt.secret=my-secret-key`" and, forty lines later, never to transcribe a secret's
value — naming the same Finding cell — so a genuinely exposed secret could not be reported compliantly.
Neither clause was droppable and no third file owned the answer. What settled it is that the verbatim
rule exists to separate a **literal** from an `${ENV}` reference: a fact about the value's *form*, which
survives redaction whole. **A collision of this shape is usually one rule stated at the wrong grain, not
two rules one of which has to lose** — find the grain at which the strict rule's purpose still fits
inside the other's constraint. Three things generalise. **A consequence clause turns a precedence
dispute into an unreportable finding:** the verbatim rule ended "if you cannot quote the line, you have
not read it and the finding does not exist", so obeying the redaction half *deleted* the finding rather
than reformatting it — read a colliding rule to the end of its consequences before ruling which half is
operative. **An exception carved into a governing sentence must be struck from every enumeration inside
that rule**, because readers scan lists, not the sentences that govern them; the cold reviewer raised
this twice on one paragraph — the parenthetical still named "a credential", and then "a missing env var",
whose canonical instance is a secret. And **a worked example is an instruction**: the replacement example
the fix wrote, `ddl-auto=update`, is the value `_review-standard.md` blesses, so the very paragraph
warning that a false config finding "lands straight in the backlog as a High" was modelling one. Check a
swapped example against the standard that defines what a finding *is*.

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
too, at the moment it returns**, together with the incidental-finding bar below: a finding outside the
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
claiming an ownership its own §2 disclaimed. Verify the quote against disk first: a row of this shape
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
| REC-109 | `/system-check` pipeline self-reports, 2026-08-12 and 2026-08-13 | **Two consecutive admitted runs closed the 168-file manifest gate and then failed to finish Step 4's orchestrator-only claim + reverse reconciliation.** The second run improved the failure boundary — all 1,090 claim-bearing physical lines reached 1,959 provisional atomic rows — but still left those rows and 4,988 reverse manifest facts without complete accepted dispositions, so the same global audit again produced only `blocked — incomplete audit`. The health contract makes a second consecutive skipped mandatory step an extraction/design verdict rather than another discipline note. Resolve without reintroducing `REC-079`'s derived map paraphrase: test whether direct, source-cited reconciliation can be divided into bounded map-owned concerns whose outputs retain the physical-line denominator and are independently checked by the final reviewer, or whether a deterministic ledger component can remove only the mechanical census/ID work while the orchestrator keeps every semantic ruling. Any design must preserve the machinery-only boundary, both reconciliation directions, `unverifiable` as a blocking disposition, snapshot checks, and the rule that the maps themselves — not an analyst's paraphrase — are the claim source. | open | Pending separate cold adjudication. `/system-check` forbids at-end source refinement inside the run that audited the source; likely map impact if dispatch/isolation changes: `README.md` public system-check contract, with `_system-map.md` only if cross-component wiring changes. |
| REC-110 | `/system-check` 2026-08-13, contradiction; `coverage.md` contradiction 2 | **`coverage-verify-prompt.md` requires the reviewer to accept only a registered topic and reject concepts owned elsewhere, but neither its required-source list nor its reviewer envelope includes `_topic-ownership.md`, the authoritative boundary registry.** The run therefore demands an ownership verdict while withholding its named authority, which can reject valid coverage or accept a misplaced bullet. | open | Settle from `coverage-verify-prompt.md`, `_coverage-standard.md`, and `_topic-ownership.md`. Adjudicate as a real defect by supplying the authority, an ambiguity by writing the intended indirect lookup, or a false positive by quoting the existing owner that already reaches the reviewer. |
| REC-111 | `/system-check` 2026-08-13, contradiction; `coverage.md` contradiction 5, `project-portfolio.md` contradiction 4, and `strategy-tracking.md` contradiction 6 | **The system names `_shared-context.md` and the calibrated coverage mirror as scope authorities, while `evidence-intake-prompt.md` and `_portfolio-write-prompt.md` use `ROADMAP.md` for target-company scope and roadmap Analyst 2a may filter concepts out of the already-calibrated junior floor.** These are one authority-hierarchy question: downstream planning context can currently influence what evidence enters the floor, what portfolio prose targets, and which calibrated concepts survive. | open | Settle once, across `_coverage-standard.md`, `_portfolio-standard.md`, `_roadmap-standard.md`, `_shared-context.md`, `evidence-intake-prompt.md`, `_portfolio-write-prompt.md`, and `roadmap-review-prompt.md`. Adjudicate as a real defect by restoring the declared hierarchy, an ambiguity by defining separate target-context uses, or a false positive by quoting the precedence rule already governing all three consumers. |
| REC-112 | `/system-check` 2026-08-13, contradiction; `notes.md` contradictions C-01 and C-02 | **`_notes-review-es-prompt.md` says Stage C reads only the Spanish note and must not read or reference the English note, yet it also mandates support-file reads and an append-only proof containing a diff over both notes.** Literal read-only scope blocks required standards, calibration, link and plan checks; a textual English diff also breaches the intended cold-Spanish isolation. | open | Settle from `_notes-review-es-prompt.md` and `_note-quality-standard.md`. Adjudicate as a real defect by narrowing the read boundary and making English proof metadata-only, an ambiguity by defining what “read only” and “diff” exclude, or a false positive by quoting an existing isolation mechanism that prevents English content exposure while permitting every support read. |
| REC-113 | `/system-check` 2026-08-13, contradiction; `notes.md` contradiction C-03 | **`_notes-write-prompt.md` permits standalone drafting or correction of one English note and forbids that component from writing Spanish, while `_note-quality-standard.md` says an English note must never change without its Spanish mirror.** The orchestrated path supplies Stage T, but the advertised standalone path has no mandatory bilingual closure and can leave the pair divergent. | open | Settle from `_notes-write-prompt.md`, `_notes-translate-prompt.md`, `_notes-review-es-prompt.md`, and `_note-quality-standard.md`. Adjudicate as a real defect by removing or closing the standalone path, an ambiguity by defining standalone as an incomplete non-landable stage, or a false positive by quoting the existing mandatory handoff that already governs standalone use. |
| REC-114 | `/system-check` 2026-08-13, contradiction; `interview-prep.md` contradiction IP-CONTRA-01 | **`interview-prep-audit.md` defines `MODE = correct` as report-only for weak answers, but always dispatches a reviewer that receives no mode and must directly fix failed checklist items, including weak unrefined answers.** One run therefore both prohibits and requires those rewrites, so identical input can produce different write scope depending on which clause is followed. | open | Settle from `interview-prep-audit.md`, `_interview-prep-write-prompt.md`, and `_interview-prep-review-prompt.md`. Adjudicate as a real defect by passing and honoring the mode, an ambiguity by distinguishing checklist failures from report-only weakness, or a false positive by quoting an existing reviewer boundary that already prevents the rewrite. |
| REC-115 | `/system-check` 2026-08-13, contradiction; `interview-prep.md` contradiction IP-CONTRA-02 | **The interview-prep author edits the bilingual section in the working tree, but if it blocks the orchestrator must skip review, continue, and leave no half-authored section; no rollback, snapshot, cleanup action, or cleanup owner exists.** A partial author write can therefore survive a blocked path despite the declared postcondition. | open | Settle from `interview-prep-audit.md`, `_interview-prep-write-prompt.md`, and `_interview-prep-review-prompt.md`. Adjudicate as a real defect by adding a recoverable cleanup boundary, an ambiguity by defining blocked as pre-write only, or a false positive by quoting the existing mechanism that guarantees atomic author output. |
| REC-118 | `/system-check` 2026-08-13, contradiction; `practice-sql.md` contradiction C-03 | **The SQL practice branch forbids legacy exercises from carrying `✅ Corregido`, while the review branch explicitly appends that marker to the same legacy header form.** Both branches can touch the same file and prescribe opposite persistent output. | open | Settle from `_sql-exercises-practice.md`, `_sql-exercises-review.md`, and the shared SQL exercise contract. Adjudicate as a real defect by choosing or migrating one format, an ambiguity by defining disjoint legacy states, or a false positive by quoting a lifecycle rule that makes the instructions apply at different moments. |
| REC-119 | `/system-check` 2026-08-13, contradiction; `practice-sql.md` contradiction C-04 | **`_sql-exercises-review.md` calls `sql-exercises` the only writer of `MISTAKES.md`, while `sql-block-close` owns writes to its `## Fricción` section.** The exclusivity claim erases a live writer and can misroute ownership checks or future edits. | open | Settle from `_sql-exercises-review.md`, `sql-exercises-prompt.md`, `sql-block-close/SKILL.md`, and the applicable map row. Adjudicate as a real defect by partitioning authorship by section, an ambiguity by defining “writer” as graded-gap writer only, or a false positive by quoting that partition if it already binds the claim. |
| REC-120 | `/system-check` 2026-08-13, contradiction; `practice-interview.md` contradiction 1 | **`simulator-prompt.md` promises JavaScript topic mode, but the declared `TOPIC` enum includes CSS and Git and omits JavaScript.** The documented mode cannot be selected under the prompt's own schema. | open | Settle in `simulator-prompt.md` against the interview-topic inventory. Adjudicate as a real defect by adding the enum value or removing the promise, an ambiguity by documenting another selector for JavaScript, or a false positive by quoting an accepted value that already resolves to JavaScript. |
| REC-121 | `/system-check` 2026-08-13, contradiction; `practice-interview.md` contradictions 2–4 | **`code-review-prompt.md`, `hr-screen-prompt.md`, and `simulator-prompt.md` label prior-report handling a run-start Step 0, but place it only in their final self-report sections after content work and writes.** A stop or rerun decision can therefore arrive after the work it is meant to gate. | open | Settle as one shared placement contract across the three runnable prompts and `_pipeline-self-report.md`. Adjudicate as a real defect by moving or explicitly invoking Step 0 before work, an ambiguity by distinguishing documented section order from execution order, or a false positive by quoting an earlier binding dispatch already executed by all three. |
| REC-122 | `/system-check` 2026-08-13, contradiction; `practice-interview.md` contradiction 5 | **`code-review-prompt.md` supports `TYPE = all`, but downstream question and commit paths still contain literal `{TYPE}` and never define rebinding per batch member.** A compliant literal reading can target a nonexistent `all.md` or produce one invalid commit set. | open | Settle in `code-review-prompt.md` with the batch standard. Adjudicate as a real defect by defining per-member binding, an ambiguity by specifying expansion semantics, or a false positive by quoting the existing batch substitution rule that already binds `{TYPE}`. |
| REC-123 | `/system-check` 2026-08-13, contradiction; `practice-interview.md` contradiction 6 | **`simulator-prompt.md` orders every open mistake concept before remaining questions, while full mode forbids more than three consecutive questions from one topic.** Four retries from one topic make the two ordering rules impossible to satisfy simultaneously and no precedence is stated. | open | Settle in `simulator-prompt.md` against the simulator mistake-loop contract. Adjudicate as a real defect by adding precedence or interleaving, an ambiguity by defining the three-question cap outside retry intake, or a false positive by quoting an existing exception that governs this collision. |
| REC-124 | `/system-check` 2026-08-13, contradiction; `practice-simulations.md` contradiction SIM-CONTRA-01 | **`simulation-review-prompt.md` requires a completed, closed attempt and a grading dispatch before every mode, while Hint mode operates on the first unfinished requirement of a partial attempt.** The prerequisite makes Hint unreachable at the moment its own contract says it is used. | open | Settle from `simulation-review-prompt.md`, `_simulation-standard.md`, and `simulation-grade/SKILL.md`. Adjudicate as a real defect by giving Hint a distinct admissibility path, an ambiguity by narrowing “every mode” to grading modes, or a false positive by quoting an existing envelope that permits partial attempts. |
| REC-125 | `/system-check` 2026-08-13, contradiction; `project-plan.md` contradiction 1 | **`plan-audit.md` says a specialist that fails its one retry aborts without commit, but its detailed acceptance procedure says to note the same failure in self-report and continue.** The same terminal condition currently yields opposite run outcomes. | open | Settle inside `plan-audit.md` from the plan acceptance authority. Adjudicate as a real defect by choosing one terminal outcome, an ambiguity by identifying different failure classes, or a false positive by quoting an existing precedence rule that separates them. |
| REC-126 | `/system-check` 2026-08-13, contradiction; `project-plan.md` contradiction 2 | **`_plan-review-prompt.md` assigns six specialist scopes bounded owned and cross-referenced sections, then tells every specialist to read the whole plan for context.** The latter defeats the isolation and budget promised by the tiered-read contract. | open | Settle inside `_plan-review-prompt.md` with `_planning-standard.md`. Adjudicate as a real defect by preserving bounded reads, an ambiguity by defining metadata-only whole-plan context, or a false positive by quoting a scope distinction that already prevents unrelated tail reads. |
| REC-127 | `/system-check` 2026-08-13, contradiction; `project-plan.md` contradiction 3 | **`_planning-standard.md` says no review scope reads the backlog and therefore cannot settle live sign-off truth, while `_plan-review-prompt.md` assigns `PROJECT-BACKLOG.md` to whole-plan review.** The published capability limit is stale at least for backlog-backed gates and can make later machinery distrust evidence it actually reads. | open | Settle from `_planning-standard.md` and `_plan-review-prompt.md`, preserving the separate G6 limitation. Adjudicate as a real defect by updating the limitation, an ambiguity by distinguishing plan-review from another review class, or a false positive by quoting a rule that keeps backlog content outside sign-off adjudication despite the read. |
| REC-128 | `/system-check` 2026-08-13, contradiction; `project-portfolio.md` contradiction 1 | **`portfolio-audit.md` requires review-audit and its backlog before the run even for an unfinished project, while the verdict recipe and `_portfolio-standard.md` stop an unfinished project as Not ready before backlog evaluation.** The run-first prerequisite is stricter than the path that can decide the verdict and may force unnecessary machinery. | open | Settle from `portfolio-audit.md`, `_portfolio-standard.md`, and the planning gate authority. Adjudicate as a real defect by making the prerequisite conditional, an ambiguity by naming a non-verdict reason the backlog is still mandatory, or a false positive by quoting an earlier gate requiring backlog existence for every admitted run. |
| REC-129 | `/system-check` 2026-08-13, contradiction; `project-portfolio.md` contradiction 2 | **`_portfolio-standard.md` summarizes G7 as following G5 and clean G6, omitting G3 and G4, while `portfolio-audit.md` requires the full G3/G4, G5, clean-G6 chain and names planning section 23 as authority.** The compressed standard can authorize portfolio work before two required gates. | open | Settle from `_planning-standard.md` section 23, `_portfolio-standard.md`, and `portfolio-audit.md`. Adjudicate as a real defect by restoring the full chain, an ambiguity by marking the summary as partial and non-authoritative, or a false positive by quoting a cross-reference that already imports G3/G4. |
| REC-130 | `/system-check` 2026-08-13, contradiction; `project-portfolio.md` contradiction 3 | **`portfolio-audit.md` says every unchecked backlog task is open, while `_portfolio-standard.md` says open Low tasks do not affect the verdict.** Without an explicit severity partition, the runnable's absolute wording can block readiness for work the standard excludes. | open | Settle from `portfolio-audit.md`, `_portfolio-standard.md`, and backlog severity semantics. Adjudicate as a real defect by narrowing the verdict set, an ambiguity by distinguishing open inventory from blocking tasks, or a false positive by quoting the next sentence or named authority that already imposes that partition. |
| REC-131 | `/system-check` 2026-08-13, contradiction; `project-portfolio.md` contradiction 5 | **After the sole retry, `portfolio-audit.md` merely reports a reviewer ratio below one and proceeds, although the reviewer calls that section incomplete and the family presents review as a go/no-go gate.** No later verdict rule gives the failed acceptance check a terminal effect. | open | Settle from `portfolio-audit.md`, `_portfolio-review-prompt.md`, and `_portfolio-standard.md`. Adjudicate as a real defect by defining the terminal verdict, an ambiguity by separating section completeness from recruiter readiness, or a false positive by quoting the later rule that already consumes the failed ratio. |
| REC-132 | `/system-check` 2026-08-13, contradiction; `project-readme.md` contradiction C-01 | **`_readme-write-prompt.md` says the orchestrator “owns the commit”, while `readme-audit.md` says the orchestrator does not run it and `_readme-standard.md` hands the commit set to Victor.** Execution ownership is otherwise consistent, so this may be stale wording or an unstated distinction between owning execution and owning the handoff; either reading changes who is authorized to commit. | open | Reverify as possible residue after `REC-100` from `_readme-write-prompt.md`, `readme-audit.md`, and `_readme-standard.md`. Adjudicate as a real defect by changing the stale ownership phrase, an ambiguity by defining handoff ownership, or a false positive by quoting an existing definition of “owns the commit” that means handoff rather than execution. |
| REC-134 | `/system-check` 2026-08-13, contradiction; `project-review.md` contradiction PR-CONTRA-02 | **`_review-security-prompt.md` says its findings merge into the backlog as High, while `_review-standard.md` requires concerns based only on a silent plan and no universal invariant to be Medium decide-and-document tasks; `review-audit.md` elevates only confirmed security findings.** Unconditional severity can turn a design ambiguity into a false vulnerability. | open | Settle from `_review-standard.md`, `_review-security-prompt.md`, and `review-audit.md`. Adjudicate as a real defect by making severity conditional, an ambiguity by distinguishing security findings from security concerns, or a false positive by quoting a confirmation gate that already applies before merge. |
| REC-135 | `/system-check` 2026-08-13, contradiction; `strategy-tracking.md` contradiction 1 | **`progress-update-prompt.md` says it writes the whole `Professional level by topic` table, while the same contract assigns `Practical evidence` cells to `step-complete` and `backlog-task-close` and calls that cell shared.** “Whole table” can authorize overwriting evidence owned by daily-session rituals. | open | Settle from `progress-update-prompt.md`, `step-complete/SKILL.md`, `backlog-task-close/SKILL.md`, and the map ownership row. Adjudicate as a real defect by partitioning cells explicitly, an ambiguity by defining “whole table” as structural maintenance only, or a false positive by quoting the existing shared-cell preservation rule that already limits the writer. |
| REC-136 | `/system-check` 2026-08-13, contradiction; `strategy-tracking.md` contradiction 2 | **Format B checkmarks are declared primary truth, but `_concept-extraction-standard.md` lets `PROGRESS_HINT` override them when PROGRESS claims more completed steps; D5 then audits PROGRESS against that derived status despite D6 requiring primary-source measurement.** In the override path, the audited file supplies the fact used to audit itself. | open | Settle from `_concept-extraction-standard.md`, `progress-update-prompt.md` D5/D6, and the Format B route. Adjudicate as a real defect by removing circular override, an ambiguity by restricting hints to discovery followed by primary verification, or a false positive by quoting a required independent check that already breaks the cycle. |
| REC-137 | `/system-check` 2026-08-13, contradiction; `strategy-tracking.md` contradiction 3 | **`roadmap-review-prompt.md` requires `progress-update` first because later steps consume its status as fact, yet acknowledges that progress-update only reports drift and gives no explicit stop when that report is non-clean.** A stale status can proceed into roadmap decisions unless the operator infers a gate that is not written. | open | Settle from `roadmap-review-prompt.md`, `progress-update-prompt.md`, and `_roadmap-standard.md`. Adjudicate as a real defect by adding the stop or repair handoff, an ambiguity by defining “requires first” as requiring a clean result, or a false positive by quoting an existing admission rule that already blocks drift. |
| REC-138 | `/system-check` 2026-08-13, contradiction; `strategy-tracking.md` contradiction 5 | **`roadmap-review-prompt.md` says Reviewer 1 reads only `_roadmap-standard.md` and `ROADMAP.md`, then permits a fallback read of the session-rules study-order section.** The declared cold read boundary and fallback source list do not match. | open | Settle inside `roadmap-review-prompt.md` with the session-rules authority. Adjudicate as a real defect by listing the conditional source, an ambiguity by defining “only” after inherited context is loaded, or a false positive by quoting a runtime rule that supplies the section without reviewer file access. |
| REC-139 | `/system-check` 2026-08-13, contradiction; `strategy-apply.md` contradiction C-01 | **`profile-readme-prompt.md` says no configuration is needed, but declares required `MODE = sync` or `optimize` configuration and cannot select its flow without it.** The entry contract can be launched without the value its algorithm needs. | open | Settle inside `profile-readme-prompt.md`. Adjudicate as a real defect by correcting the claim or deriving mode, an ambiguity by distinguishing user-supplied configuration from orchestrator-supplied mode, or a false positive by quoting an existing default that always resolves the mode. |
| REC-140 | `/system-check` 2026-08-13, contradiction; `strategy-apply.md` contradiction C-02 | **Application tracker log mode unconditionally appends a row without checking for the same application, while its important rules promise that rerunning the same application never duplicates rows.** The written algorithm cannot guarantee its idempotency contract. | open | Settle from the application tracker prompt and `_application-standard.md`. Adjudicate as a real defect by defining a stable identity and upsert guard, an ambiguity by excluding log mode reruns from the promise, or a false positive by quoting an existing deduplication step already executed before append. |
| REC-141 | `/system-check` 2026-08-13, contradiction; `strategy-apply.md` contradiction C-03 | **`_application-standard.md` says every required keyword must be present and also says unsupported skills must be omitted, with no precedence when a required keyword is not defensible; consumers behave as though defensibility wins.** The same application can therefore be judged incomplete or dishonest under two mandatory clauses. | open | Settle in `_application-standard.md` with the CV and application consumer prompts. Adjudicate as a real defect by stating defensibility precedence and recording the gap, an ambiguity by distinguishing literal keywords from supported evidence, or a false positive by quoting an existing rule that already resolves the collision. |
| REC-142 | `/system-check` 2026-08-13, contradiction; `root-contracts.md` contradiction 3 | **`_single-shot-self-report.md` numbered Step 3 commits report/tracker before Step 4 refinement, while Step 4 says approved refinement lands first and the report/tracker commit follows with the applied hash.** The top-level execution order and detailed commit flow prescribe opposite sequencing, affecting which hash the report can truthfully persist. | open | Settle inside `_single-shot-self-report.md` against `_pipeline-self-report.md`. Adjudicate as a real defect by aligning the numbered order, an ambiguity by defining Step 3 as preparation rather than commit, or a false positive by quoting an explicit precedence rule that makes Step 4's detailed sequence controlling. |

## Closed

**One line each, using the closure schema in step 4 above.** Nothing else — the full reasoning of every
one of these lives verbatim in `git log -p` on this file, so restating it here buys nothing and costs the
readability of `## Open`, which is what this ledger is for. Beyond the required fields, a **rejected**
item keeps its reason, because that reason is the only thing stopping the next analysis re-raising it,
and a **residue** clause names work the item left open. If a line needs a paragraph, the rule it
established belongs in the preamble instead. Ordered by ID.

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
- `REC-046` — **rejected as a ledger item, not as work.** It asked to finish the content-side interview-prep audit: migrate/audit the banks, add current coverage fingerprints and bilingual stable-ID parity, then generate the CORE route. That is a list of **prompt executions**, and `_run-tracker.md` records those better than a row can — its thirteen empty `Interview J` columns name the exact targets, where the row named a campaign. Rejected on the promoted rule *an unrun prompt is tracker state, never a recommendation*. Checked before deleting, per that rule's two corollaries: `interview-prep-route-prompt` declared a `Single-shot prompt executions` row the table did not have, **added in this commit**; and both of the row's design rulings already live in `_session-rules.md` — the pipeline is audit → route with no per-topic authoring plan (there is no `interview-prep-plan` among the 30 prompts), the route "stores only the ordered CORE IDs for one level, never answers or duplicate study state" (queue, not plan), and a missing or stale route/fingerprint "prints `—`, never a plausible `0%`", which was the row's `Study progress` clause. Measured 2026-08-10: the whole interview-prep engine has never run once · maps unaffected — `fdda1214`
- `REC-047` — already resolved in the live notes contract; the row's search for the obsolete label `Coverage bullets:` was a false negative · maps: affected in the original change — `badf828`
- `REC-048` — `PROGRESS.md` split into `Coverage demonstrated` / `Study progress` / `Practice completed`, by level, each owned by its closing ritual; a stale denominator prints `—`, never a false `0%` · maps: both — `b9e2990`
- `REC-049` — **rejected.** False positive: `project-brief` already keyed on `✅ NN-slug` markers and excluded `✅ sql:*` drill markers from its birth in `fdea4d8`, before the row opened · maps unaffected — `—`
- `REC-050` — `/roadmap-review` ran at G8 on `REC-042`'s rewire, consumed the preserved SQL drift and aligned `ROADMAP.md` with the current gates · maps unaffected — `4886805`
- `REC-051` — the review gate measures **unreviewed code**, not a 30-day clock; the date is reported, never obeyed · residue promoted to `REC-083` — `70956ce`
- `REC-052` — timed simulations become a level-planned, coverage-fingerprinted route: immutable timed evidence, `simulation-grade` the only cold-review door, consumed MISTAKES rows · maps: both — `42a34753`
- `REC-053` — inline study writing confined to refining an already complete planned pair; it cannot create, number or complete a note, and prose debt routes back through `/notes-plan` → `/notes-audit` · maps: both — `40fb918`, `b9e2990`
- `REC-055` — the map stated the machinery and not the loop that maintains it; (a)-(d) shipped 2026-08-07 in `7bcc5bc`, and **(e), the missing per-day view, is now §13**: which of the seventeen skills fire in which block, each block's opener/closer/cold-dispatch, the load measured from the skills' own declared steps, and the four asymmetries — 36 steps and 1,411 lines in the 08:00 block that has neither opener nor closer, a trace that is conditional in every block, cold grading only at 12:30, one question-asking skill in seventeen. Three things the fix had to correct in the row itself: its "15:30" is **13:30**; its "and what each writes" was deliberately **not** built, because that is §9's column and a second copy is the fork this row's own preamble entry warns about; and Victor falsified its central premise mid-fix — **a block is not a clock**, it opens on his word or the session's context and no skill reads one, now stated by its owner in `_session-rules.md` and pointed at from §13. The cold reviewer returned `approve-with-tightening` on **nine** defects, all nine introduced by the fix rather than present in the finding, three of them fresh instances of the restatement fork · maps: system-map (the fix site); README unaffected — `b8f710c1`
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
- `REC-067` — the launcher argument contracts become validator invariant 6: identical hints across both catalogues, keys in both directions, and values only where both sides state a closed set. The contracts were all correct — the work was the **locator**, since the config block is written in two legitimate forms and a `## How to use` recipe block wears the same `KEY = value` shape, so a naive parser called 15 of 31 prompts broken. Its cold reviewer injected 20 defects and found 4 misses, all four real: a duplicate hint key, a single-token wrong value, a value hidden behind unbracketed prose, and a launcher-only value list; the first three are now caught and the fourth is named in `README.md` as uncovered · four bugs were found by making it fail rather than by reading it — a `$`-anchored fence pattern that silently matched nothing on the CRLF half of the tree, `.Count` on a dictionary that has a `COUNT` key, PowerShell unrolling a one-element array through `return`, and a whitespace cut that was right for a hint and truncated every prompt-side list · maps: README, one row still owed and paid (`STEP=current\|<n>`); `_system-map.md` §12 verified unaffected, it delegates the invariant list by design — `72fe2798`, `ec87cc37`
- `REC-068` — `/system-check` narrowed to a **machinery** audit (live state out of its inventory, denominator and blocking conditions; 9 steps → 8; validator gains `-MachineryOnly`), and the two maps split by owner: `README.md` owns per-prompt facts, `_system-map.md` owns wiring and per-skill contracts · maps: both — `0d1b8a5d`
- `REC-069` — the inverted per-project gate chain lived in **four** project standards, not the one the row named; all four now state their gate position and point at `_planning-standard.md` §23 · maps unaffected — `d1a60c92`
- `REC-070` — **rejected as a ledger item, not as a question.** It asked for a machinery evaluator built on the two maps, whose load-bearing half (b) was the **usage** dimension: has this prompt ever run, has this skill ever fired, does anything consume this output. Rejected on the scope test promoted with it — that is `_run-tracker.md`'s question, and the tracker answers it better than a new global prompt would (twelve `pending` single-shot rows and thirteen empty `Interview J` cells name their targets exactly, where the evaluator would have produced a report about them). Its (a) is a real ruling and was **promoted to the preamble** rather than deleted — *a map's freshness is verified from git, never by re-auditing*. Its (c) split axis was already settled by `REC-068` (README owns per-prompt facts, `_system-map.md` owns wiring and per-skill contracts), and the diagram it wanted is a `/system-check` Step 5 improvement, filed only if a run ever needs it · maps unaffected — `{commit}`
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
- `REC-083` — G4's justification argued from the backend's date after `REC-051` retired the clock; the owner now argues from what G3 reviewed and routes the exception to a re-fired G3 instead of an untracked run · the project plan's word-identical copy was **not** hand-edited — it crosses §7's writer fence and became `REC-087`, which its cold reviewer widened by two further defects in the same table and which was itself rejected as a ledger item on the same fence · maps unaffected — `0d17e220`
- `REC-084` — a declared output was exempt from the existence check by **shape**, so `03-jions.sql` passed as readily as `03-joins.sql`; invariant 7 now checks the 50 declared SQL exercise references against the 20 names in their level route's §1, harvested from the **first cell** of each table row. Both narrowings were paid for: the section's two tables carry headers in different languages, so a header parser reads one and calls the other's five files typos, and its prose and status cells name retired files, so a whole-row scoop authorises the very dead path the check exists to catch. Four bugs were found only by making it fail and none by reading it — a literal `§` in a BOM-less `.ps1` that Windows PowerShell reads as ANSI, so the locator matched nothing, harvested nothing and compared nothing at a clean PASS; a `$null` property access that slipped past the empty-harvest guard written to catch exactly that; `return` enumerating the set into 20 loose strings; and the same encoding trap sitting **pre-existing** in the simulation route's `Level status: closed ✅` test, which would have failed the first level ever to close for lacking metadata it plainly carried · its cold reviewer returned **reject** on five must-fixes and `approve-with-tightening` on the re-check, and the two worst were introduced by the fix: the invariant blocked `-MachineryOnly` because its **oracle** is a live route even though the file it fails is machinery, which falsified two `_system-map.md` sentences; and the repair of the reviewer's own partial-harvest finding widened the locator from the file column to the whole row and silently re-opened the hole, undetectably, because the five prose-cell names it swept up were all authorised elsewhere and the published count did not move. Also fixed: a published reach number that did not reproduce (measured 16 cited report names against 12 on disk, where the row's author had written 36 against 17, mixing units), and a collection ordered above the historical-path allowlist, which made that exemption unreachable — this line's own file was the near-term trigger · incidental, below the bar and recorded here rather than opened: `_system-check-report.md` l.43's baseline reads 11 PASS where `HEAD` gives 12, stale before this work; and casing on a path that **does** exist stays uncovered because `Test-Path` is case-insensitive on Windows, now a named limit in `README.md` rather than a silence · maps: README only — `_system-map.md` verified row by row and unaffected (§7 l.267, §11 l.402 and §12 l.469-487, which delegates the invariant list to `README.md` by design) — `ad07ff1d`
- `REC-085` — **rejected as a ledger item, not as work.** `practice/sql/PLANNING.md` mis-states who refreshes its own §0 in three places: §0's header says "update it at the start of every session" (L25), the Moment 4 bullet attributes the §0 header to the level's **route** file (L209), and §4 item 5 still calls the close's commit manual — while §0 belongs to the doctrine, its live values are written by `_sql-exercises-review.md` 4d on a step close and verified by `sql-step-close`, which also commits. Rejected on the ownership half of the scope test: the doctrine's declared writer is `/sql-plan-audit`, hand-editing it here would breach the very fence `REC-073` was writing, and `_sql-plan-standard.md` already names all three sites as checks so the audit cannot fix one and leave two. It closes at gate G1b, on the run — two sites verified live on disk 2026-08-10 · maps unaffected — `{commit}`
- `REC-086` residue — `$exclusivePattern` carried **no tool names at all**, the structural reason two of them survived 30 files at PASS; it gains the names that cannot be an ordinary English word or a unix tool, and `tracker-prompt.md`'s "WebFetch the URL" and `progress-update-prompt.md`'s "Edit tool" are reworded. What stays uncovered is named in the code: the bare words (`Bash`, `Grep`, `Read`…, because "Git Bash" is legitimate prose) and the `X tool` form, which is live in 13 canonical files — twelve of them restating `_session-rules.md`'s own "the Read tool truncates at 2000 lines", and that file is exempt by name, so policing the restatements while the owner is exempt would fail files for using their rulebook's words. That fork is a `REC-064` problem for whoever unifies the sentence, not a runtime-isolation defect · the two friction sinks joined the `_last-run-report*` exemption class in the same change: a `FRIC` row saying which tool died is evidence, not an instruction · maps unaffected — `b01ff68c`, `ec87cc37`
- `REC-086` — the mid-flight-death rule in `sql-plan-audit.md` was not merely forked but **narrowing**: it began at "is resumed" and had silently dropped the ladder's first rung, *read what it persisted* — the load-bearing one here, since these specialists write straight into the plan files and never commit, so a dead one always leaves work in the tree. Collapsed into a pointer, and the row's *"the `SendMessage` mechanics stays"* was **half wrong and corrected**: the substance stays, the Claude tool name comes out under `REC-007`'s precedent and the standard's own first sentence, `.codex/` being a real second adapter where it does not exist. Promoted *a pointer names its target; a direction is not a target* — its cold reviewer returned `approve-with-tightening` on three defects, all three introduced by the fix, one pointing "below" into a region with **two** once-only re-dispatches where the wrong reading aborts the run · incidental, below the bar and recorded here rather than opened: `tracker-prompt.md` L99 names `WebFetch` the same way but its stated fallback yields the same artefact on either adapter — the structural half is that `validate-prompt-system.ps1` L117's `$exclusivePattern` carries **no tool names at all**, which is why both survived 30 files at PASS, and that belongs to the `REC-067`/`REC-084` session · maps unaffected, verified on both — `29f4b18d`
- `REC-088` — the rulebooks had no authorship fence, and the settling read put it on the **machinery** branch, not the map's: no standard declares its own writer, no prompt declares a write to one, so the de-facto writer was already single and the missing row was a **prohibition** — by hand only, never a prompt run — because both self-report contracts scope their refinement to *the prompt that just executed*. Load-bearing for one reason the row's own wording missed: the population includes those two contracts, so a run authorized to edit them is authorized to delete its own cold-review gate. Cold reviewer returned `approve-with-tightening` on two must-fixes, **both introduced by the fix** — `{family}/_internal/` silently excluded `_agent-runtime-standard.md`, the one file the row named, leaving the commit's two halves disagreeing on the population; and "the non-negotiable above" pointed 585 lines up past two commit-titled sections that state the opposite (`REC-086` again) · incidental, below the bar and recorded here rather than opened: D1's class is wider than this population — `_sql-exercises-review.md`, `_sql-exercises-practice.md`, `_sql-exercise-seeds.md`, `_external-path-preflight.md`, `_coverage-prompt-rationale.md` and the subagent-step prompts have no §7 row either — and the new row is the only §7 row **no read licence can reach**, since a standard governs its family's artefacts and not itself, so trigger 2 of the two-map rule cannot verify it and only `/system-check` can · maps: system-map only, README verified unaffected row by row — `8b405150`
- `REC-089` — two gates (the project chain's G6, SQL's G3) closed on a drift report that existed only as chat output, so the branch that leaves them **open** was spoken aloud while the branch that **closes** them left nothing on disk — a clean run did not even commit `PROGRESS.md`; Step E now writes `_last-drift-report.md` on every run, the clean one included, carrying the scope line that says which project a clean verdict is evidence for, and Step F commits it alone. The validator needed the path exemption in both path forms, and refused the fix until it had it · residue, below the incidental bar and deliberately not a row: the three gate cells that name this report (`_planning-standard.md`, `07-timetrack/PLANNING.md` §23, `practice/sql/PLANNING.md` §11) could name the file instead, and each is owed to its own by-hand or declared writer · maps: both — `37e2924d`
- `REC-087` — **rejected as a ledger item, not as work.** `07-timetrack/PLANNING.md` §23 owes three repairs: (a) its G4 cell keeps the date framing `REC-083` removed from `_planning-standard.md` and lacks the `PROJECT_PATH` added in `c9270c1c`; (b) its G6 cell is a live forked rule — the standard names `cv-prompt`, `project-brief` and `review-audit` as `PROGRESS.md`'s readers, the plan names "G7 and `cv-prompt`" plus an owner list the standard does not have; (c) the substantive one, the gate list ends at G4 while §22 puts Step 8 (backend tests) and Step 11 (Docker) *after* the branch that triggers it, so the backend gains code after its last review gate with certainty and no §23 box tracks it — decide there whether 07 re-fires G3 scoped `backend`, or §22 moves the backend work before G4. Rejected on the ownership half of the scope test: §7 names `/plan-audit`, `step-complete` and `backlog-task-close` as this file's writers and a machinery session is none of them. The owner's half already shipped in `0d17e220`, so the standard is the source to resync **from**; it closes at `/plan-audit MODE = review` gate G2, whose tracker cell exists · maps unaffected — `{commit}`
- `REC-090` — the improvement loop's only integrity trace was unenforced; the settling read put it on the **machinery** branch (the validator exempts `_last-run-report*` twice, both times about its content being evidence, and §11 had no row), so invariant 8 now requires a report whose `Status:` field says `applied in <hash>` to carry `cold reviewer: approve|approve-with-tightening|reject`, with the field's **value** enforced as a closed set and the five written verdict forms matched by one optional wrap per seam. It runs in **both** modes — object and oracle are the same machinery file, the opposite answer to invariant 7 by the same `REC-084` test. Preceded by `be1aaebd`, which corrected the one report on disk whose `Status` named a content commit (`4886805`, ROADMAP.md only) while its own Verdict said "pipeline clean" · **both promoted rules came from the cold reviewer overturning the fix**, not from the six-case injection pass · residue, below the incidental bar and deliberately not rows: a report quoting this contract verbatim satisfies the token check, which is now a published limit in `README.md` rather than a silence, and §12's self-description "what belongs on the map is the one invariant that is *about* the map" is narrower than the pointer §12 now carries — a `REC-065` trigger-narrower-than-scope smell that forks nothing and changes no run's output · maps: both, plus a separate `b8e24c50` correcting a false count found reading `README.md` whole (16 cited report names against 24 on disk) — `e1ca4a00`
- `REC-091` — §0 had **two** daily writers and three files each claiming to be the only one; the settling read of `step-complete/SKILL.md` found the third copy the row predicted, so the absence was the owner's before it was the maps'. The six cells are now partitioned — route cells to `step-complete`, the blocked/signable qualifier to `backlog-task-close`, `Last updated` to both, run order free and the second writer reading what the first left, off a signal each ritual can actually evaluate (the close reads `git log -p --since=midnight` on the plan, since the backlog's dated `## Closed` lines only detect its own runs) · **three cold reviews, two of them rejections, and every defect that mattered was written by the repair**: an order fixed "by construction" that made the other ritual's guard dead text, and a paraphrase of invariant 10 that would have deleted 07's live `G3 sign-off — condition met, action pending`; that paraphrase is now `REC-093` · residue, deliberately not a row: `07-timetrack/PLANNING.md` §0's own header still says `step-complete` "repoints every cell", which only `/plan-audit` G2 or the next ritual run may correct — the `REC-087` fence · maps: both — `eb39578d`, `c1359309`, `e8b8c7f9`
- `REC-092` — the Q&A bank's five writers, three without a declared scope, and a standard whose header claimed four readers while its own body addressed six. The settling read put the absence on the **maps** for question (a) — "Adding questions from outside the audit" already mandated bilingual ID parity — and on the **machinery** for (b) and (c), which no file reached: a practice insertion is now born unrefined in both languages, takes the three content-pipeline prohibitions, may reorder a section because **position is structural, not content** (the audit repairs ordering as a structural fix), and owes the route-stale handoff its insertion creates, which `interview-prep-route-prompt.md` now correctly lists reordering as causing. Both practice prompts gained the gate and the handoff; all three writer registries and the standard's four-group reader list were made to agree · **six cold reviews, six rejections, and every finding in all six was a defect the repair had just written** — the record on this table. Four consecutive rounds died on question (c) alone, each addressing the rule to something that could not evaluate it; the promoted rule above is what that cost bought, and the answer that held builds nothing · residue, below the incidental bar and recorded here rather than opened: `/progress-update` reports one-sided-marker drift **to** `study-block-close`, which has no step that repairs it and is not permitted to mirror — a handoff that goes nowhere, in a skill this row had no license to edit · maps: both, plus README's second and third writer registries — `1d619663`
- `REC-093` — invariant 10 derived §0's `Next gate` from "the first gate whose **trigger** has not fired yet", which names G1 during any in-progress step and named G4 on 07 while `G3 sign-off — condition met, action pending` was the live state; it is now scoped to §23's prerequisite chain (quoted verbatim, not paraphrased from this file), with the shared `G3/G4` position's tiebreak and the all-signed-off terminal case stated, and **`signed off` defined for the first time** — the closure-checklist box read *of the project branch as it stands*, plus any stricter sign-off the plan's own §23 cell states — which is what all four consumers had been pointing at since `REC-091` when they said "the gate's own sign-off condition in §23", a term §23 did not have · cold reviewer returned `revise` on nine, and **the blocking one was written by the fix**: defining sign-off as the box alone makes "condition met, action pending" a sign-off, re-derives G4 and passes falsification only because an unrelated review had reopened three Highs that week · three more were the fix's too — the five consumer pointers read "§23 defines it" where §23 resolves to the *plan's* §23, which carries no definition; the §0 section spec forked the derivation into two of its four cases, source and fork ten sections apart in one file; and the chain was misquoted, dropping `fix the Highs`. The invariant's unverifiability by any `plan-audit` scope (no scope's reading map holds `PROJECT-BACKLOG.md`) is now a published limit rather than a silent pass · incidental, below the bar and recorded here rather than opened: `_plan-review-prompt.md` l.113 states the chain without the `fix the Highs` node, `step-complete` reads High/**Medium** where G3/G4 turn on High alone, and `practice/sql/PLANNING.md` invariant 6 carries the identical old phrasing for SQL *revision points* — different artefact, only triggers and no sign-off to define, and a doctrine whose declared writer is not a machinery session · maps: `_system-map.md` §7 only, `README.md` l.316 verified — it states no predicate — `3fa116b5`
- `REC-094` — the settling read found real missing routing: once ROADMAP's 12:30 block reaches Stage 2, `README.md` now places `/code-review-practice` alongside timed simulations without adding it to their route or 15-test denominator, and `_system-map.md` §11 makes that state discoverable. Its no-prerequisite start, level-keyed durable retries, Q&A fingerprint fallback and separation from reviewing Victor's own diff are explicit · cold reviewer `approve-with-tightening`, then `approve`; it also caught and corrected the affected batch row's collision with the host `/code-review` command · maps: both — `98397e78`
- `REC-095` — `/hr-screen` had a complete live-call loop but no event that routed Victor into it; application work or a scheduled HR call now starts the first run, and open `hr-screen` mistake rows drive later retries without creating a gate or replacing `/simulator` · cold reviewer `approve` · maps: both — `00ce4303`
- `REC-096` — the optional polished-answer file was not orphaned: `hr-screen-prompt.md` already makes it a Victor-facing study aid, while later mocks deliberately retry from `practice/interview/MISTAKES.md` without a script; both maps now declare that human reader and the non-consumer boundary · cold reviewer `approve-with-tightening`; maps: both — `895a7e57`
- `REC-097` — Git history and the settling prompt read put the missing `projects/README.md` producer on the **machinery** branch: the index was created by hand, no prompt writes it, and `/project-brief` consumed it without a provisioning or freshness contract. Victor (or an explicitly instructed session) now owns its published inventory; Guard 5 refuses a missing file or unequal two-digit folder-prefix / `#` sets, and explicitly does not claim same-number rename detection · cold reviewer `approve-with-tightening`; its two tightenings bounded that comparison and added the §11 symptom route · maps: both — `0dd5d3ec`
- `REC-098` — the settling read falsified the named absence: `internship-daw.md` existed under `main/job-search`, while every apply contract pointed at the nonexistent `main/personal/job-search`; the whole live apply surface now uses the real root, `_application-standard.md` names Victor as the hand writer of `internship-daw.md`/`archive`/`assets`, and §7 records the complete mixed writer set · cold reviewer `approve-with-tightening`; it found four live `/cv` and `/tracker` launchers still injecting the dead root, corrected before validation · external profile adapter corrected in its own working tree and left for Victor's separate-repo commit · maps: both — `5fa06429`
- `REC-099` — the commit-ownership contradiction was real but shallow — one stale "the reviewer owns the commit" against nine correct clauses, in a family of six write prompts where three named the orchestrator and three did not. The row's own likelier-defect guess was a **false positive**: ROADMAP.md/PROGRESS.md are correctly partitioned by mode in three places and l.184 was never truncated. The real defect was the file list itself — `whole-plan`'s twelfth check fixes `{project}/PROJECT-BACKLOG.md` and no `git add`, writer registry or reading map carried it, so the fix was written every run and never staged · cold reviewer `approve-with-tightening` on seven defects, four written by the repair: a false "nowhere else" pointer, the new bullet placed after the `git commit` line, the specialist's unlicensed read, and the standalone `SCOPE = all` path · maps: both — `6e9126f0`
- `REC-100` — the README hand-over promised "one commit command per README" and delivered one commit covering all of them; the **promise** was the compressed half, and `git show 36449ba8^` names the dropped noun (`git add`), so the owner `_readme-standard.md` now states one granularity rule binding **both** writers of a project README — the unit is the change, never the file — and splits only *who runs* the commit into a `readme-audit` bullet and a `readme-concept-add` bullet, with the real reason the pipeline declines the 2026-08-01 permission it could use: a whole-file rewrite Victor reads first, never the branch, which is identical either way. Both counter-readings the row demanded be tested were falsified, not dismissed: `_batch-mode.md`'s per-target rule resolves to one commit **per project** and therefore *agrees* with the Finishing section, and "not all three by default" can only mean the three READMEs of one project · **the sweep ran through the sentence's readers rather than its family**, which is what took the site set from two files to six — `readme-concept-add` had already read the compression as "One atomic commit per README" (`3bab8381`) and `step-complete` had copied it into the ritual that calls it, both corrected together with the "one atomic commit per **file**" universal that generated them · **its cold reviewer returned `reject` twice before `approve`, and every finding in all three passes was written by the repair**: the two skill readers the first sweep missed, a false claim that `portfolio-audit` auto-commits a project-folder file, a `Not auto-committed` universal left heading a section the same edit had just widened to cover a skill that *does* commit, a reader-list pointer aimed at a rule its target did not contain, and — the second `reject` — a stale `### Step 5 … hand over the commit` heading that the fix's own new pointer aimed straight at, `REC-086` in its purest form · two commit-**ownership** defects the reviewer found cleared the incidental bar and were fixed here rather than opened as rows, each in its own commit: `review-audit.md` told the Angular 01–06 path to hand over a `PROJECT-BACKLOG.md` commit the pipeline makes itself, against four correct clauses in the same file (`a35d78ad`), and `backlog-task-close` listed `README.md` under "You commit yourself" while its own step 2 hands that file to `readme-concept-add` end to end (`e492cf61`) · incidental, below the bar and recorded here rather than opened: the "never all three by default" staging clause is vacuous for the skill, which reaches at most two READMEs, and `_batch-mode.md`'s step 2 ("including its commit") contradicts its own `## Commits` section ("show all commit blocks together at the end") for every hand-over prompt — the fix stopped leaning on that half rather than repairing another owner's standard · `.claude/settings.local.json` clean, no `chore(claude)` commit owed · cold reviewer: approve · maps unaffected, ruled row by row over the six-file set (`README.md` l.248/249/366/370/701, `_system-map.md` §7 l.253, §9 l.317/320/322, §10 l.382, §1 l.92-99, §13's self-dated line count) — `ba14b371`
- `REC-101` — self-report `Status:` now has one central four-state vocabulary; all 31 runnable prompts execute its run-start decision, legacy `open` reports are classified centrally without rewriting them, and malformed values fail validation · cold reviewer: approve (first review rejected; corrected re-review complete) · maps: `README.md` — status/validator paragraph; `_system-map.md` — §11 status-validator row and §12 items 1 and 7 · `d70181b1`
- `REC-102` — **false positive on its premise, and right about the file for the wrong reason.** §0's partition was already complete and in force in `_sql-plan-standard.md` Section E, sixth row (`REC-073`, 2026-08-10) — 4d writes the live values on a close, `sql-step-close` verifies and repairs, `sql-plan-audit` reconciles under invariants 5-6, `sql-block-open` reports without repairing — and `sql-grade`, both plan prompts, the grader and both map rows already stated it correctly. The legacy-path half was false too: 4d runs behind **both** doors, so §0 is written either way; what that door loses is the drill markers, which `sql-exercises-prompt.md` l.381 already says. The one real defect sat in the file the row cited and misread: `sql-step-close`'s YAML **description** listed §0 and PROGRESS.md's `Total` rows among "the part no grader can reach", against its own §2's "verify, do not redo" — output-affecting, because a §0 re-authored from scratch loses the close it was recording · cold reviewer: approve-with-tightening, and **three of its four tightenings were defects the repair wrote**: the reworded description swapped one false claim for another ("nobody else re-reads", false of `sql-plan-audit` and `sql-block-open`), the new §2 paragraph restated Section E's writer set in the same breath as telling the reader not to, and the `_run-tracker.md` note was reverted whole — wrong sink, the rule now promoted to the preamble · residue, `REC-085`'s and owed to `/sql-plan-audit` at G1b: the doctrine's §0 header (l.25), Moment 4 bullet (l.209) and §4 item 5 are still stale, **plus one site `REC-085` missed — §4 item 2 (l.320-321) attributes the §0 refresh to the level route file, which has no §0 at all** · maps unaffected — both already described this skill as verifying §0, never authoring it — `1fafeea5`
- `REC-103` — **rejected.** The cited coverage machinery is coherent, not contradictory: `/coverage` preserves both marker kinds with a counted pre/post multiset check, `coverage-mark` authors project markers, and `sql-step-close` authors drill markers. `REC-026` already established that every preservation rule names both kinds and places the drill marker first. The proposed row therefore failed the real-defect and deduplication bars before any repair was due · maps unaffected — `0f8eeee6`
- `REC-104` — `coverage-mark` now has one two-case commit rule: marker-only runs commit separately, while a calling ritual that authored and marked in the same run makes one coverage commit carrying `PROGRESS.md` and, on the authoring path, `_run-tracker.md`. The required 17-skill × 2-adapter sweep found no other trigger/commit contradiction; three redundant Claude-adapter citations failed the output-changing bar and remain incidental evidence, while the two output-affecting sites are split into `REC-108` · cold reviewer: approve-with-tightening · maps unaffected — `9d2d7d68`
- `REC-105` — `portfolio-audit` no longer commits two CV-bullet alternatives as if they were one polished downstream input: a ✅/⚠️ non-dry run pauses for Victor's choice, removes the rejected option and marker, validates every project section in the whole staged file, then commits; ❌ and dry-run paths keep their own explicit behavior, and `all` resolves each eligible target before advancing · cold reviewer: approve-with-tightening · maps: `README.md` + `_system-map.md` — portfolio interaction class, output contract and `cv-bullets.md` writer shape in the behavior commit `10aaed08`; reader/catalogue corrections found by the whole-read sweep landed separately in `0ea5de0d`
- `REC-106` — the mandatory cold reviewer was handed nothing: step 3 named zero inputs, so "required sources" resolved inside a saturated context to the files the fix happened to edit — the dispatcher's own blind spot, and structurally unable to reproduce step 1's finding. It now receives **the set step 1 measured, read whole, as a floor and not a ceiling** (a site found outside it is `sweep: incomplete`, since a short measurement is the failure step 1 exists to catch), the working tree in place of a draft, and the finding as step 2 corrected it; and it owes two return lines, a persisted return missing either being a partial return rather than a verdict on the one path where the edit is already on disk when the reviewer dies. `sweep:` names the outcome the three tokens have no room for — *right but incomplete* parks the edit and leaves the row `open` whatever the token said, which this path had already improvised once as `revise` — and the maps declaration is asked of the last gate before the commit that must carry it · **its own dogfood review returned `approve-with-tightening`, and two of the four blocking findings were written by the fix**: the seventeen inserted lines silently falsified four line citations in `REC-107`, its pair, now repointed by name, and the standard's two-part persisted-verdict test left the new lines skippable on exactly that death path · incidental, below the bar and recorded here rather than opened: the `Current order` line listed five rows against seven workable, so `REC-107` took its place in it here · maps: `_system-map.md` §12 item 5, which spoke for both paths and is now scoped to the refinement gate; `README.md` verified unaffected, it owns per-prompt facts and its validator paragraph is scoped to the `_last-run-report*` population — `b5a863fd`
- `REC-107` — recommendation closures now persist the mandatory review verdict; only `sweep: complete` plus `approve` or `approve-with-tightening` may enter `## Closed`, historical lines are not backfilled, and validator enforcement waits until the field has proved it gets written — as this line does · cold reviewer: approve-with-tightening · maps: `_system-map.md` §12 item 5; `README.md` verified unaffected · `95f03caf`
- `REC-108` — `study-content-writer` and `step-complete` now take their shared rules, commit authority, branch policy and whole-project progress handoff from `_session-rules.md` rather than the Claude adapter; all 17 skill mirrors remain identical and the three remaining Claude citations were reverified as non-output-changing incidentals · cold reviewer: approve · maps: `_system-map.md` §9 `step-complete`; `README.md` verified unaffected · `d9faabad`
- `REC-116` — **real defect on both readings, which is why no scope clause rescued it**: `sql-plan-prompt.md`'s "this prompt writes `PLAN` only" sat in a paragraph about the doctrine/route pair, and even that narrow reading was falsified 35 lines below by the one-time split, "the only edit this prompt is ever allowed to make to `DOCTRINE`" — while update mode writes `{LEVEL}`'s two `PROGRESS.md` `Exercise route` tables on top. The sentence now states the two-file division it meant and a second paragraph declares the wider set, pointing at "Update mode" as the complete list instead of restating it. `_sql-plan-standard.md` Section E and invariant 15 already carried all three artefacts and were left untouched; both `/sql-plan` launchers, which enumerate the write set where a runtime reads authorization, gained the `PROGRESS.md` tables and stay byte-identical in their Rules blocks · cold reviewer: approve-with-tightening — an unattributed restatement of `sql-plan-audit`'s own audited-never-repaired rule, dropped · sweep: complete — `progress-update-prompt`, both SQL exercise branches, `sql-plan-audit` and the three SQL skills already state the seeding correctly · maps unaffected — behaviour unchanged, and `README.md` l.393 plus §7/§8 already declared all three writes · `7ecfb801`
- `REC-117` — **real defect, and the row was right about the clause while understating the damage**: one sentence in `sql-exercises-prompt.md`'s "Topic order" paragraph called the junior path table authoritative against four statements making `{PLAN}` §1 the authority, and it is now the projection the Resolution section defines. The sweep took two sites the row never mentioned, both able to send a run to the wrong file rather than merely confuse a reader: the *same clause* listed "joins + join-pitfalls" among the pairs sharing a file — they are Steps 1 and 3, `03-joins.sql` at target 22 and `05-join-pitfalls.sql` at 12, so a `join-pitfalls` run would have inflated Step 1 and left Step 3 unclosable — and `_sql-exercises-practice.md`'s Step 4 write guard resolved `{FILE}` "from the shell's path table", false at middle and senior where no projection exists, beside a deictic calling `01-basics.sql` "not in this table" when it is row 1 of §1 · cold reviewer: approve-with-tightening, over three passes — the first two returned `sweep: incomplete`, each naming exactly one further site, and the third read the family to EOF for `sweep: complete`; every tightening it applied was to text the *fix* introduced, twice for `REC-086`'s deixis · maps: `README.md` — the validator paragraph claimed a run "resolves its target by" that table, which only the removed clause supported; corrected in its own commit `904445fd`, scoped to junior since middle and senior keep no projection. `_system-map.md` unaffected — `d6e278c1`
- `REC-133` — **real defect, and the row understated it**: the flow reviewer's verbatim config-line rule demanded the value of a hardcoded secret in the same Finding cell its own redaction rule forbade, and its consequence clause ("you have not read it and the finding does not exist") made the redacted half *unreportable* rather than merely unquotable, so neither reading could file a real exposed secret. The verbatim rule is now named and carries a **secret-value form** exception — the key quoted exactly plus *literal, not `${ENV}`*, which is the whole evidence the 2026-07-14 false High turned on — and `review-audit.md`, which writes and commits `PROJECT-BACKLOG.md` and carried neither rule, strips a value on arrival across all three of its committed outputs · **the cold reviewer returned `revise`, and both of its worst findings were written by the repair**: the replacement example `ddl-auto=update` is the value `_review-standard.md` l.243 blesses, so the fix modelled a compliant line as an offending one, and the discharge clause's "the paragraph above" resolved to the 2026-07-14 blockquote instead of the rule it discharged — `REC-086` again, the original defect revived through a pointer · `_review-security-prompt.md` and `_review-standard.md` were measured and left untouched: the security reviewer carries only the redaction half and is internally consistent · cold reviewer: approve-with-tightening, both tightenings applied · maps unaffected — neither map states either rule (`README.md` l.370-373, `_system-map.md` l.254) · `d1b610a6`

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

**Items 1 and 2 closed on 2026-08-10 — `REC-055` (e), the map's per-day view, and `REC-086`, the forked
mid-flight-death rule. Both confirmed the same thing about the two "smallest" rows on a table:** the edit
was one section and one paragraph respectively, and the *rulings* inside them were nine and three. Every
one of `REC-086`'s three was **introduced by the fix**, in the paragraph the row called the smallest on
the table — which is the argument against ever sizing a row by its diff.

**Item 1 closed on 2026-08-11 — `REC-084`, the last validator invariant on this table — and it is the
third row running whose worst defects were introduced by its own fix.** Both of the must-fixes its cold
reviewer ranked highest were written by the repair, not present in the finding, and one of them was the
repair of an earlier finding *from the same reviewer*: widening the locator to fix a row that could name
two files re-opened the hole the check existed to close, silently, because the extra names were all
authorised elsewhere and the published count did not move. Two things generalise to what is left. The
injection budget held for the third time after `REC-057` and `REC-067` — four bugs found only by making
it fail, none by reading — and the **second source** it needed on disk cost less than the two narrowings
that made that source trustworthy, which is the sweep-not-the-edit rule arriving one level down: not
where the defect lives, but which *column* of the artefact actually holds the value.

**`REC-099` closed on 2026-08-12, out of order, and it dissolved its own batch.** It was taken first as
the cheapest row on the table — three lines in one file — and the ownership contradiction it named was
indeed cheap. The row cost what it cost because the *shape* of its defect lived one question away from
the one it asked, in a file list rather than in the commit step, and because four of the seven defects
its cold reviewer returned were written by the repair. **Two things carry to `REC-100`, its former batch
partner.** The batch premise held exactly as far as the opening promise: in `plan-audit` the promise was
the stale half and the Finishing section was right, so `readme-audit`'s l.23 is the clause to suspect
first — but that is where the parallel stops, and the deeper question there is the same one asked one
level out, *which files each hand-over command covers*, not which sentence wins. `readme-audit`'s author
correctly leaves the commit unexecuted but still calls the orchestrator its owner; `REC-132` isolates
whether that remaining word means execution, handoff, or stale residue after `REC-100`'s family sweep.

**Current order: `REC-109` first; then safety and persistent-state risks `REC-133`, `REC-115`, `REC-118`,
`REC-136`, `REC-140`; then broken or undefined terminal paths `REC-114`, `REC-121`, `REC-124`, `REC-125`,
`REC-131`, `REC-137`; then authority and writer boundaries `REC-111`, `REC-119`, `REC-127`, `REC-132`,
`REC-134`, `REC-135`; then the remaining bounded schema, read-scope and precedence rows `REC-110`,
`REC-112`, `REC-113`, `REC-120`, `REC-122`, `REC-123`, `REC-126`, `REC-128`,
`REC-129`, `REC-130`, `REC-138`, `REC-139`, `REC-141`, `REC-142`.** `REC-109` comes first because it
restores the audit that produced the other 33 rows; within the intake, exposure of secrets, unrecoverable
partial writes, contradictory persistent formats, circular truth and duplicate application rows precede
wording and scope corrections. `REC-054` is not part of this order because it remains accruing and gates
nothing.

The previous workable table became empty when `REC-107` closed
2026-08-13 after completing `REC-106`'s cold-review contract; every later recommendation can now persist
that its mandatory reviewer ran. `REC-101` then closed after centralising the status vocabulary and
run-start decision used by every later prompt close-out. `REC-104` closed after its full 17-skill
commit/trigger sweep, and `REC-108` then removed the output-affecting adapter-authority defect that
sweep separated. `REC-105` closed after restoring Victor's pre-commit bullet choice and adding the
whole-file integrity gate its cold reviewer required. **`REC-102` then closed the same day without a
partition being written**: reading the performer rather than the launcher summary — the row's own
instruction — found the partition already complete in the standard's ownership fence, so the expected
`REC-091` reuse never applied and the row resolved as a false positive with one real defect attached.
**`REC-100` closed last, and it ran alone for a reason worth keeping**: `REC-099` had already spent the
shared family sweep, so what was left was the sweep nobody had budgeted — through the *readers* of one
compressed sentence, into two skills and the ritual that calls them. `REC-103` is absent from
the order because it failed the defect and deduplication bars and is now closed as rejected.

The second `/system-gaps` run's five rows are closed, each settling read
deciding the branch and each correction target being one of the two its disposition promised.
**`REC-089` priced the rank
honestly:** its settling read was one prompt and the fix landed in four files — the prompt, both maps
and the validator, which refused it twice before passing. Budget the sweep, not the edit. **`REC-090`
priced it a second way:** one script read, one invariant written, and the two defects that mattered were
written by the repair and caught only by the cold reviewer. **`REC-091` priced it a third way** — the
first row in weeks that added **no check**, a pure precedence ruling, so the injection budget that had
paid off four runs running did not apply, and what stood in for it was three cold reviews, two of them
rejections, every finding a defect the repair had written. On a row that adds no check, the reviewer
*is* the check.

**`REC-092` priced that last lesson to its limit and is the one to remember when the next row of this
shape arrives: six cold reviews, six rejections, every finding in all six written by the repair.** Four
of those rounds died on a single one of its three questions, and each round's answer was *bigger* than
the last — a declaration, then a rule for an unnamed caller, then a runtime heuristic with a detector.
The one that held was the smallest and built nothing. **A row that keeps failing review is not
under-built; check whether it is being answered at the wrong altitude** — and count the rounds, because
a fix that grows every pass is the signal, not the reviewer being harsh.

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
established moves to the preamble first (step 4). **Nothing is lost by that:** the full reasoning of
every closed item is in `git log -p` on this file, which is where it belongs, because a resolution
written for the day it shipped stops being read long before it stops being true. What a future reader
needs from a closed item is the decision, not the argument — and if the argument matters again, the row
was not the right home for it.
