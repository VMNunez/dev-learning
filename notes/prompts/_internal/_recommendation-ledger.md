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
   **A pointer is not a read, and the family is the cheapest test.** A `## Configuration` block naming an
   authority (`TOPIC = one registered topic from _topic-ownership.md`) puts nothing in the run's hands;
   only the Required sources list does. So when a prompt demands a verdict its own sources cannot
   support, measure its **siblings** before reasoning about the wording: `REC-110` closed on two of three
   coverage prompts already listing the file the third only pointed at. An asymmetry across prompts that
   share a standard is evidence, and it costs one grep.
   **An isolation clause fences *content*, and a proof demanded of a fenced role must take a form the
   fence permits.** `REC-112` found the `en/`-blind Spanish reviewer told to "read only" its Spanish
   note while the same prompt mandated the standard, a calibration file and the plan — and told to
   prove an append-only freeze with a textual diff over the very English file it may not see. Neither
   was resolved by loosening the fence: the prohibition was restated over the content it protects and
   its support reads named, and the proof moved to **metadata** (`--numstat` counts, whose removed
   column falsifies any edit without printing a line). So read a bounded-read contract twice before
   calling it self-contradictory — what a role may not *judge from* and what it may not *open* are
   rarely the same set — and where a fenced role genuinely owes evidence, look for the form that
   carries it through the fence before treating either the fence or the evidence as the thing that
   must go.
   **An unqualified rule *heading* is not the rule, and a `contradiction` row is routinely raised on
   the heading alone.** From `REC-113`. `_note-quality-standard.md`'s bolded "Never modify an `en/`
   file without mirroring the change to its `es/` counterpart" reads as absolute, and the row quoted
   it against the one pipeline stage that writes English only — but fourteen lines below, the same
   section says content is authored in `en/` "first, **then** translate", and the plan contract dates
   the both-languages confirmation to the Stage C commit. Half the row was a false positive on that
   ground alone. A bolded imperative is written to be obeyed at a glance, so it states the rule
   without its interval, and the interval lives in the prose underneath it. Read the **whole owning
   section** before calling a clause contradictory — and where the contradiction survives, expect it
   to have shrunk to the one path that section never scoped, which is where the real defect is.
   **Where a mechanical check governs the artefact, that check defines the population — enumerate
   from its source list and *run it* before dispatching the reviewer.** From `REC-120`. Step 1
   measured the launcher family with `ls` over the one adapter directory this session knew
   (`.agents/`, which holds skills and no launchers) and concluded there was no second copy;
   `validate-prompt-system.ps1` l.15 defines that population as `.claude\commands` **plus**
   `.codex\commands` and enforces byte-equality of the two `argument-hint` lines. The fourth site
   surfaced from the validator *after* a cold reviewer had returned `sweep: complete` on the short
   set — the reviewer inherits step 1's blind spot, which is why `REC-149`'s "the two adapter copies
   are sites before the family is" did not save it. A directory listing answers *what is here*; only
   the check answers *what is required to agree*. The validator is a step-1 instrument, not a
   pre-commit formality, and its cost is one command.
   **A clause can be a *justification* rather than a mandate, and the two rot differently.** From
   `REC-150`. `_notes-review-prompt.md` told stage B that the `es/` "has **not been created yet**… so
   there is nothing bilingual to check" — the mandate (review English only, never open the counterpart)
   is right on every path, and only the *reason* was false, on three of them, because it was written
   the day the pipeline had one path and no later mode ever re-read it. Separate the two before
   adjudicating: a false justification is repaired by re-founding the clause on the ownership that
   already holds, never by loosening the mandate it defends or by widening the role's scope to fit the
   exception. `git log -S` on the clause dates the fork, and where the justification predates the mode
   that falsifies it the row is a **restoration**, not a ruling.
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
   **A reviewer's `sweep: incomplete` names a *candidate*, and it is verified before it is worked.**
   From `REC-115`, whose three passes produced three sweep sites: one was real (`portfolio-audit`), one
   was **falsified against disk** — the reviewer's stated reason, that the prompt commits half-applied
   fixes, was refuted by a gate quoted from the file itself — and the third was real but for a reason no
   reviewer had yet stated. Step 1's rule that a row is routinely wrong about where the defect lives
   binds the reviewer's sites too: discharge one only against a **quoted sentence** from the file, the way
   `/system-gaps` discharges a candidate, and say in writing which of the two happened. Widening on an
   unverified site costs a family's worth of edits; dismissing a real one leaves the sweep short, which
   is the failure step 1 exists to catch — so neither is the safe default and only the file settles it.
   **Its return carries two lines beside the verdict token, and a persisted return missing either one
   is a partial return rather than a verdict** — the standard's two-part test is not sufficient on a
   path where the edit is already on disk when the reviewer dies. `sweep: complete` /
   `sweep: incomplete — <sites still owed>`: *right but incomplete* is neither a wording note nor a
   rejection, so it leaves the row `open` and the edit parked **whatever the token says** — the three
   tokens were written for a drafted edit, and this path has already improvised a fourth (`revise`).
   Then the two-map test's own declaration, `maps unaffected` / `maps: <map> — <row>`, because the
   reviewer is the last gate before the commit that has to carry that edit.
   **The rounds are what this gate costs, and four of them is a failure of the loop rather than of the
   fix.** From `REC-126`, which took four on a row the ledger had already priced as cheap. Four
   controls, the first two of which are what ends it. **The reviewer passes the bar it applies** —
   its own findings clear `_pipeline-self-report.md`'s four conditions, condition 3 above all: a
   heading that no longer describes its paragraph, or a launcher restating its component's reasoning,
   changes the *cost* and not the result, so it is a tightening and never a blocker.
   **Only `reject` or `sweep: incomplete` opens a round.** `approve-with-tightening` means what it
   says — apply it in the form approved and close the row; `REC-126` held that token on a round that
   was re-reviewed anyway, which is where two of its four came from. **Two rounds, and a third does
   not repair: it re-scopes.** A second repair that again draws blocking findings is saying the fix is
   too big, not that it is badly written — `REC-123`'s *price the ruling, reach for the mechanism only
   when the ruling still leaves a case open*, in `## Suggested order` below, arriving from the other
   side. **A repair states no new fact.** Every blocking finding in `REC-126`'s rounds 3 and 4
   pointed at text the round before it had written, the sharpest having traded a true conditional
   ("if it is near or over 2000") for a false assertion ("§23 sits past line 2000 on a real plan",
   against a 1820-line plan): condition the claim or cite the instrument, never assert the number.
   **`REC-150` is its second instance and names the shape to hunt: when a fix replaces a false fact
   with a mandate, every sentence it writes that still asserts a *tree state* is a candidate.** Both of
   its rounds returned exactly that, written by the repair, inside a paragraph whose own thesis is
   "not a fact about the tree" — one asserting a stage "is **required**" to read a file on the very
   path its own prompt skips that step, one asserting a file does not exist on an entry whose gate is
   defined over a **different** file.
   Round N is handed round N−1's return, whose *considered and not opened* list binds it — a cold
   reviewer re-litigating a settled adjudication is the loop, not the check.
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

**A possessive is an ownership claim, and it survives the sweep that deletes the explicit one.** From
`REC-119`, where the false universal — "**this prompt is its only writer**" — had a twin one sentence
above it: "`MISTAKES.md` … **is this run's own output**". Same claim, no writer word in it, so every
grep for the corrected wording missed it and only the cold reviewer reading the paragraph found it. The
general form is `REC-117`'s referent rule one register down: an exclusivity claim is written as a
possessive (*its*, *own*, *belongs to*, *this run's*) at least as often as as a verb, and the possessive
is the one that reads as background rather than as a rule, which is why nobody corrects it. When you
narrow an ownership claim to a section, re-read the sentences **around** it for the whole-file version
of the same claim. The row's other half is a boundary instance of `REC-146`: the fix widened a fence's
exception listing **two** of the three nouns its header forbids, and silence on the third read as a
licence — an exception must re-fence in the header's own terms, noun for noun.

**A component prompt states its commit contract twice — once in its intro, once in its body — and a fix
that corrects one leaves the other telling the old story.** From `REC-132`, which is the third instance
and the one that made the pattern legible. `REC-099` corrected `_plan-write-prompt.md`'s body and left
its header saying the reviewer commits; `REC-100`'s second `reject` was a stale `### Step 5 … hand over
the commit` heading its own new pointer aimed at; and `REC-132`'s file was born contradicting itself in
`36449ba8`, header right and body wrong, because the decomposition carried a sibling pipeline's sentence
across. The intro is where a reader stops, so it is where a false clause survives longest. **When a fix
touches any clause of a component prompt, re-read that file's first fifteen lines before closing** — the
sweep for the claim's *other statement* starts inside the file you already edited, not in its family.
**`REC-149` extends it across the adapter boundary: the launcher is a third statement of the same
contract, in a file the prompt never names, and it is the text that actually runs.** Both
`coverage-verify` launchers said the run "writes **only** its findings file, self-report, and tracker",
and each said it *twice* — once as that sentence and once, one bullet below, as a "Finish after its
findings, self-report, and tracker update" enumeration, the same closed set in a register no grep for
"writes only" returns. When a fix adds an output, the two adapter copies are sites before the family is.
Its corollary, which the same row's two sweeps paid for: **sweep the idiom, not the string.** "The
orchestrator owns the commit" is a fixed phrase here meaning the orchestrator *executes*, and a literal
grep for it missed the variant "owns the **atomic** commit" carrying a false use; the next pass's term
list then missed a clause wrapping the line break, which is `REC-117`'s multiline rule arriving one level
down. Enumerate what the claim can be *worded as* before measuring, and say the term list out loud in
the dispatch so the cold reviewer can widen it.

**Two steps that commit the same artefact are joined by a single ordinal word, and an edit about a
third thing deletes it.** From `REC-142`, and it is `REC-132` one register down — there the second
statement was in another section, here in another *step* of the same procedure.
`_single-shot-self-report.md` Step 3 commits the report and tracker; Step 4's refinement then said
"commit the report **again**", and *again* was the only token making that a re-commit rather than a
contradiction of Step 3. `bac82378`, whose subject was adding `_run-tracker.md` to the close-out,
deleted it and appended "when no prompt edit is approved, commit the report plus tracker as the run
record" — Step 3 restated as though it had not run. Both sentences stayed well-formed, so no grep for
either claim's wording returns the fork, and it survived three months and a `/system-check`. When a fix
touches a step that commits an artefact a *later* step re-commits, read both steps in one pass and
treat the ordinal (`again`, `also`, `second`) as load-bearing text, not prose. **Its second half is
what the repair paid for: a duplicate clause is usually the only statement of a boundary, and its
redundancy holds on the common path alone.** That appended sentence was genuinely redundant when an
edit is approved — and the only coverage of the path where none is, on which Step 4 still writes the
failed bar condition into the Verdict and `cold reviewer: reject` into a report Step 3 already
committed. Replacing it with "nothing is committed here" stranded that report for the next run's
Step 2 to overwrite: a `REC-146` boundary written by the fix, and the cold reviewer's only blocking
finding. Before deleting a redundant-looking sentence, enumerate what the step writes on **every** path
it can end on, and test the deletion against the least-travelled one.

**A capability limit is a claim about someone else's reading map, and it rots at their speed.** From
`REC-127`. Invariant 10's published limit justified "a plan review cannot settle the sign-off
truth-value" with "neither of which any **review scope** reads" — a recitation of
`_plan-review-prompt.md`'s scope table, written 2026-08-11 by `REC-093` and falsified the next day when
`REC-099` handed `whole-plan` the backlog. The conclusion was never wrong; only the borrowed half was.
So justify a limit from what the **owning file itself defines** — here *signed off*, whose own paragraph
makes merge state and the drift report the missing inputs — and point at the other file for the rest
(`REC-064`, `REC-093`). The first draft of the fix paid off one false cross-file claim with three fresh
ones of the same class, which buys a day. **Corollary, and it is the boundary `REC-146` asks for: a
per-scope claim is tested against the mode that runs every scope in one context.** `SCOPE = all`
collapses the six specialists and `whole-plan` into a single reviewer, so every "scope X cannot see Y"
holds only until that mode is checked — here it survived, but on the owning definition, not on the
partition the row was arguing about.

**A prerequisite states its own scope in the reason it gives for itself, and it is the wording that
over-reaches.** From `REC-128`. `portfolio-audit.md`'s `▶ Run first` demanded a three-gate chain of
every run and justified it with "the verdict reads `PROJECT-BACKLOG.md`" — a read the same file's
Check 1 forecloses on exactly the projects its own batch recipe admits and calls expected. Nothing
about the requirement was wrong: it was quantified over **runs** while its reason was quantified over
a **path**. So when a row says a prerequisite is too strict, read the block's own justification before
touching the requirement — where the two disagree, scope the wording to the reason and never weaken
the gate — and look first for the sibling that has already written that scope (`plan-audit`'s
`▶ Run first (new mode only)`, which is `REC-114`'s corroboration rule again). `REC-137` is the same
row from the other side, and together they settle what a `▶ Run first` sweep costs: that one gave a
prerequisite teeth by fixing the **rule** and then reading every consumer, and here the consumers
that merely **name** the producer were precisely the ones that owed nothing.
**`REC-129` is the third side, and it constrains the *repair*: a sentence that merely **places** a gate
is read as its prerequisite list, and completing it by restating the chain forks whatever scope that
chain has acquired.** `_portfolio-standard.md` said G7 "runs after G5 and a clean G6" — true, scoped
nowhere, and the only chain statement in the one contract all three portfolio pieces read. The obvious
fix, and the one the row asked for, was to add G3/G4; in prerequisite language that would have written
a fourth statement of the chain the day after the third was scoped to all-✅ projects. So repair a
compressed chain by **quoting the owner's line verbatim** (`REC-093`) and **pointing at the runnable
whose `▶ Run first` carries the scope** — never by restating the requirement in a file that does not
own it — and name, in the same breath, which of that file's **own** checks the missing gate feeds,
which is the half no pointer supplies and the reason the omission was worth fixing at all.

**A shared contract written for one class of consumer has its gap on the other class, and that class
is usually one or two files.** From `REC-122`. `_batch-mode.md`'s "run the prompt's **entire procedure
once per target**, including its commit" and `_pipeline-self-report.md`'s batch clause are both correct
for the orchestrators, whose close-out sits *outside* the per-target procedure — and neither said
anything to the two **single-shot** prompts that accept `all`, where the close-out is the last step of
that procedure: `TYPE = all` would have written three self-reports over one file, committed the
close-out three times, and let the run-start check read the report the same run had just written. The
row blamed the placeholder instead, and the **family is what falsifies that: a placeholder defect that
would condemn every sibling equally is the shared contract's, not the prompt's** — no batch prompt
states a rebinding clause, so `{TYPE}` was never the difference between them. Enumerate a shared
contract's consumers **by class** before adjudicating, and read the class with one or two members
first. **Corollary, and it costs one grep: a run-level step nested under a per-target heading
contradicts the rule by *structure*, with no sentence anywhere saying anything false.**
`review-audit.md`'s `### Step 6 — Pipeline self-report` sits inside `## Single-project procedure`, so a
seven-project batch reads as seven close-outs; only a section map (`grep -n "^## \|^### "`) shows it,
and it was the one site of five that no search over the prose could have returned.

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

**Two colliding rules are not always two statements of one rule — test whether each governs a
different *dimension* before ruling one operative.** From `REC-123`, where the simulator ordered every
open-mistake question first while full mode capped consecutive questions from one topic, with no
precedence stated. The row's own real-defect branch ("add precedence or interleaving") invites picking
a winner, and neither clause deserved to lose: one assigns **rank**, the other constrains
**adjacency**, and a single sequence satisfies both because they quantify over different things.
`REC-074` tells you when a gate has drifted into a second vocabulary; this is what to do when **both
vocabularies are legitimate** — name the dimension each rule governs, in the file that states them,
and the collision dissolves into an order both admit. The tell that you are here rather than in
`REC-074`: each clause stays true under every session the other permits, and only their sequencing was
ever undefined. Such a rule still owes the boundary where the dimensions genuinely run out
(`REC-146`) — here, a remainder that is all one topic, **and** a deferral pushed past the session's
last position, which the fourth reviewer found and which is the harder half, because a rule phrased as
"it gets asked later" is silently false wherever there is no later.
**The test has a converse, and the two vocabularies are what hide it: two clauses over *position 1*
are one rule stated twice, however differently they word it.** From `REC-152`, the same file one
section down. `simulator-prompt.md`'s `### topic` named its starting question by ⭐ tier and previous
Débil while Step 3's rule 1 ranked an open-mistake retry first regardless of tier — two vocabularies
again, but **position 1 is a rank**, so both governed the one dimension and only one could hold. The
separating tell is the paragraph above's own: there each clause stayed true under every session the
other permitted; here the ⭐⭐⭐ reading was **false** on every session where a retry mapped. What lets
such a fork survive is that it is *exactly right on the common path* — the mode line reproduced rules
2–3 verbatim and omitted only rule 1, so it read as correct until an open row existed. Two things
follow. Look for the path **neither** clause anticipates — a selected scope holding no ⭐⭐⭐ at all,
which the mode line could not name and the owning step always answers — because a partial restatement
fails there first and that failure is not a tie. And repair it as `REC-064` and never as a precedence
ruling: the derived block states only what the owning step cannot say (*this mode has no opener of its
own*) and points for the rest. The first draft added a second sentence explaining the **other** mode's
opener and the reviewer cut it — a derived block that starts describing the branch it is not about has
made itself the sole site of a claim about that branch (`REC-055`).

**`REC-092`'s round count reads mid-sequence, not only from round one, and the shrink *answers* the
findings rather than deferring them.** Also `REC-123`, its second instance. Rounds 1 and 2 each cut a
false claim, and round 3 asked for two clauses to be **added** — a re-application rule for a
mid-session checkpoint, and a ruling on questions its mechanism could not rank. Rewriting the
paragraph *shorter* retired both without answering either on its own terms: stating the rule over
**asking** rather than over **planning** made the re-application clause unnecessary, and dropping a
universal quantifier the file falsified three times made the unrankable questions stop being an
exception at all. So when a fix starts growing, re-read what it is a rule *about* — the additions a
reviewer requires are usually the cost of a claim one register too wide, and the smaller statement
pays them off instead of carrying them.

**An added exception is read as the more specific rule, and it wins at the boundary too.** From
`REC-146`, where the defect was written by the fix. The stamping step said "stamp today's date only on
the tiers this run actually reviewed"; the fix inserted "a tier holding a slice left *not reviewed*
gets today's date plus the qualifier" beside it, and at the boundary where the two meet — **every**
slice of that tier lost — the newer, more specific sentence wins: it stamps a date on a tier nothing
was read in, destroying the date a real run earned and turning a `never` line into a date. A boundary
the general rule already covered stops being covered the moment an exception is written next to it,
because the exception is what a reader resolves it with. State the exception's own boundary in the same
breath. **The same row sharpens `REC-074`'s vocabulary test one level down:** the fix renamed its token
from `(partial — …)` to `(incomplete — …)` precisely to dodge a collision with "partial run", and the
very next sentence then called the thing "the coverage check" in a file whose seventeen other uses of
*coverage* mean the notes coverage files or test coverage. A collision lives in the paragraph, not in
the token — re-read the sentences **around** a rename, never only the name.

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
prose under that table said "the two licences" while three sat above it. **`REC-137` is its second
instance and moves the defect to the other half of the sentence.** There the enumeration and the
condition were one bullet: `_session-rules.md` listed eight points at which `progress-update` is due —
two gates and six `▶ Run first` — and closed with "**Both gates** close on an empty drift report",
leaving six prerequisites satisfiable by the run having happened. So it is not only a trigger that can
be narrower than its scope; a **terminal condition** can be, and it is harder to see, because the
narrow word sits *after* the full enumeration and reads as a summary of it. Count the enumeration, then
count what the condition covers, and write both numbers down.

**A prerequisite that states what the run *achieves* rots the day its producer is narrowed.** Also
`REC-137`. `cv-prompt` and `cover-letter-prompt` had said "`progress-update` (so `PROGRESS.md` is
current)" since 2026-07-07; on 2026-08-05 that prompt was demoted to an auditor that writes one table
and *reports* the rest, and both parentheticals became false and stayed false for five weeks. Nothing
caught them because the sweep that follows a demotion greps for the **producer's name** — and every
consumer names it, the correct ones included. The claim that rots is the one about the **effect**, and
it is written in the consumer's own vocabulary ("is current", "is accurate", "is up to date"), which
matches no search for the change. So when a prompt's output is narrowed, walk its consumers and read
what each one *promises the prerequisite buys*, not which ones mention it. A `▶ Run first` naming a
producer is safe; one describing its result is a copy of that producer's contract, and copies do not
follow it.

**A gate closes on the artefact its producer stamped, never on the producer having run.** `REC-148`, and
the mirror image of the paragraph above: there a *consumer* promised an effect its producer no longer
delivers; here the *gate* asked only that the producer ran, which a run that reviewed nothing still
satisfies. §23 signed G3/G4 off on "`review-audit REVIEW_SCOPE=backend` **has run**", so a tier stamped
`(incomplete — «slice» not reviewed)` — the line `REC-146` had just taught `review-audit` to write —
signed the gate off over code nobody opened, and `portfolio-audit` then computed a verdict from a backlog
short by that slice's findings. G6 already had the right shape (an empty drift report, not
`progress-update` having happened) and is the model. Two corollaries, the second easier to miss: the
condition belongs to the **owner of the artefact** and is quoted from it rather than re-derived
(`REC-093`); and **test the stamp for the shape it should have, not for the marker of failure** — a run
that loses *every* slice stamps nothing at all, leaving the previous run's plain date standing, so a box
looking for the qualifier is blind to the worst of the three cases while a box asking for *that run's
date* catches all of them.

**A destination is worthless while the channel that discovers the item is told to drop it.** From
`REC-149`. `coverage-verify` rejected another topic's concept and dropped it, against a standard
requiring any run that discovers one to route a proposal — and the fix, which declared the routing at
that rejection site, would have shipped **inert**: one screen above, the cold reviewer's own mandate
forbids it to report items an adjacent topic owns, and its acceptance proof requires every gap it
returns to be same-topic, so the concept dies before the step that now routes it ever sees it. The disk
evidence the row was raised on was itself a reviewer discovery, so the fixed prompt would not have
reproduced the entry that proved the defect. Where a row says a finding has nowhere to go, settle the
destination and then walk **upstream to whatever produces the finding**: a suppression written as good
hygiene ("do not report X") reads as housekeeping beside a missing destination, and it is the half that
decides whether the fix does anything at all. The repair is a second, labelled return channel beside the
gap list — here `ownership referrals`, modelled on the `locked placement conflict` the same file already
carried — never a widening of the gap list, which would falsify the acceptance proof that mandate is
checked by.

**Making a loose enumeration exhaustive transfers the burden of completeness onto you.** Also
`REC-149`. `_cross-topic-inbox.md`'s contract said "**A run** WRITES here / READS here / CLEARS what it
consumed" — one word standing for three different populations, which is `REC-065`'s fork with the
narrow half on the *subject*. Naming each population fixed that and created a new defect in the same
stroke: the closed list of writers omitted the by-hand entry `_topic-ownership.md` mandates on a
boundary change, which the loose "any coverage run" in both maps had never had to assert, and both map
cells were false the moment the source became precise. A vague rule is wrong about nothing in
particular; a closed one is wrong about everything it leaves out. Before closing an enumeration, grep
for every file that **mandates** a member, not only the ones that perform it — and re-read the maps that
cite the list, because precision at the source is what makes their paraphrase falsifiable.

**A single-source claim binds nothing until the derived file is told what it may not restate.** From
`REC-111`. `_shared-context.md` has called itself the single place holding the profile, the target
companies and the market since the day it was written, and seven prompts read `ROADMAP.md` for exactly
those facts anyway — because the claim lived only in the source. On the other side
`_roadmap-standard.md` *mandated* five stable sections whose subjects were the source's, under a
no-duplication rule that named `PROGRESS.md` and coverage and never it. Neither file was wrong on its
own, nothing adjudicated them, and the two had already diverged on disk. So state the fence from **both**
ends — what the source owns, and what the derived file may not restate — and **enumerate the facts**,
because a fence is only as wide as its list and every consumer resolves the boundary from the list, not
from the word *single*. Corollary, from the cold reviewer, and it is where the fix over-corrected:
**exempt the ordering, not the contents.** The derived file's ranked list of what most increases hiring
probability exists nowhere else and had to survive; the facts quoted *inside* its items are still the
source's, and are exactly the ones that drift.

**A downstream filter that re-applies an upstream criterion can only subtract, and it does it in
silence.** Also `REC-111`. `roadmap-review`'s gap analyst was told to filter the junior floor to "what
actually comes up in junior Angular + Spring Boot interviews at Spanish consultancies" — the criterion
`_coverage-standard.md` had already admitted every one of those bullets under — inside the one report
whose declared purpose is to surface what the plan does *not* close, and it reported nothing, while the
exclusion in the paragraph immediately above it mandated a count. When a consumer re-judges an artefact
its producer has already calibrated there are only two cases, and neither is a drop: the producer is
wrong, which is a finding **against the producer**, reported and routed to it, or the filter is dead
weight. **Ranking is the legitimate form** — the same standard lets a downstream artifact organise the
order and never the membership.

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
the fix itself added an instance the claim did not include. **`REC-135` is its third instance, and it
names where the universal comes from: the *restatement*, not the owner.** Partitioning a shared cell,
the fix wrote "the one cell in the file with two writers by design" in the prompt's intro and "the
file's one deliberately shared cell" in the map — both false against a sibling row of the very table
they sit in (`Coverage demonstrated` has four writers by design), and both a widening of the owner's own
correctly scoped sentence, D7's "the one cell **of the matrix** you share". A rule's owner has usually
already bounded its uniqueness claim, because that is the sentence someone argued over; the copy is
written fresh, in the copier's vocabulary, and *file* is the scope a restatement reaches for when the
owner said *table*. When you restate a uniqueness claim, carry the owner's scope word across verbatim,
then run `REC-082`'s file test on the paragraph you landed in.

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

**A fact lifted from the audited file is not evidence about it, and passing it through a subagent does
not launder it.** From `REC-136`. `/progress-update` quoted the `Status` cell of a project's own row
into its step-status subagent's launch instruction as a "hint", and let that hint override the `✅`
markers; the status came back and D5 compared it against the very cell it came from. The distance — a
cold dispatch, a different file read in between, a report contract with three declared items — is what
made it read as measurement. **The test is not whether the auditor read the audited file; it is whether
the value the comparison rests on traces back to it.** Two corollaries. A subagent's fence must name
the **launch instruction**, not only the filesystem: *"Do not read or write `PROGRESS.md`. You cannot
see it"* was already written one screen above the block that handed it a piece of `PROGRESS.md`. And
**the honest return for an unmeasurable input is a named non-value, not a substitute** — here
`not derivable`, which is `REC-076`'s `unverifiable` arriving in a second prompt; it must then be
branched on where it is *consumed*, or the gate downstream inherits a pass nothing earned.

**When a fix turns an unconditional rule into a branched one, every site naming the old return now
states the wrong half.** Also `REC-136`, where the tightening reached the rule (D5) and the report
step (E) and missed the dispatch note (Step A) still telling the orchestrator that return "is a drift
row" — one file, three sites, and the missed one is the instruction read first.

**A promised invariant is a claim about an algorithm, and the only way to adjudicate one is to execute
the text.** From `REC-140`, where `tracker-prompt.md` promised "Idempotent … never duplicates folders or
rows" in its rules while its `log` steps read the tracker and appended unconditionally. Two things
follow. **The ambiguity branch of such a row is only available while some mode still satisfies the
promise**: narrowing "never duplicates" to exclude the one mode that creates rows and folders would have
left the rule with no subject at all. And **the identity a guard tests belongs in the file that owns the
artefact** (`REC-064`) — the shared standard the row also named never mentions rows, folders or identity
and is read by five prompts, while the pair the guard needed was already in use twice in the prompt
itself.

**A step is ordered by where a sequential reader reaches it, never by the number in its title.** From
`REC-121`, where eight prompts labelled a blockquote `step 0` and placed it in their final section,
after the sentence telling the run to execute the shared contract "in full". The label cost the whole
check: that contract's Step 2 **overwrites** the report Step 5 reads, so the check reached at the end
measured the run's own fresh output and the earlier run's `open` finding was destroyed unread — the
`REC-136` circularity arriving through *ordering* rather than through a quoted value. Two things
follow. **When a late step reads a file an earlier step writes, the ordering is not a style question**,
so look for the overwrite before ruling a misplaced label harmless. And **a row's stated damage is
checked against the branch table it claims to gate**: this one said a "stop or rerun decision" arrived
late, and the run-start table has no stop or rerun branch at all — it prints one line and is forbidden
to apply it. The real damage was elsewhere and worse than the row's, which is step 2 doing its job.

**A two-outcome contradiction is often one rule and an unscoped verb, and the scope is settled by the
standard rather than by a vote.** From `REC-125`, where two sites said a twice-failed acceptance check
"aborts without committing" and a third said "note the gap in the self-report and continue". Neither
sentence was a wrong rule: `continue` names a **scope** the file never gave it — the phase, the run, or
the commit — and a sequential reader reaching the procedure before the commit step resolves it as the
commit (`REC-121` again, through a verb this time rather than a label). Three things follow. **Look for
the governing vocabulary before picking a winner**: `_agent-runtime-standard.md`'s close-out contract
already ruled that only a run satisfying its content acceptance gates closes out as `completed`, so the
fix scoped the verb and *pointed* at that rule (`REC-064`) instead of choosing between two prompt
sentences. **Importing a shared rule to settle one gate makes it load-bearing for every sibling gate in
the same file** — the same edit left a second, identically worded acceptance check three sections up
silently governed by a sentence nobody had measured it against, and a check whose terminal effect
differs from its neighbour's must now say so where it is stated. And **the population to sweep is the
join, not the phrase**: a continue-branch *and* a later commit step naming that same check. Seven
prompts carried one half and were falsified against quoted sentences; two carried both.

**A prompt that calls a terminal effect "an open question" has not deferred it — it has answered it,
locally, against the standard.** From `REC-131`. `portfolio-audit.md`'s acceptance gate noted a
below-1 reviewer ratio and moved on under a paragraph saying "what terminal effect that failed check
should have on the run is an open question this prompt does not get to settle in passing" — while
`_agent-runtime-standard.md`'s close-out contract had already settled it for every runnable: only a run
satisfying its **content** acceptance gates closes out as `completed`. A reader following the prompt
records `completed` after a failed gate, so a park is not a neutral state; it is a silent per-prompt
exemption from a shared rule, which is the one thing it cannot be. Before writing that a prompt does not
settle something, look for the contract that already does — `REC-125` imported the same rule from the
other side, and this row is what its lesson looks like when the sibling gate was *parked* rather than
worded wrong. Two corollaries. **A run-level outcome rule stated inside a mode branch is unreachable in
the other mode**: the first draft put this one in the `{DRY_RUN} = false` paragraph of a prompt whose own
instructions prescribe `DRY_RUN = true` for the first run, where `dry-run` would have stood as the
outcome of a run that failed a gate — state the outcome where every branch reaches it, and leave only the
commit rules in the commit branch. And **a failed gate and an unfinished artefact are two reasons for one
token**: both make the run `blocked`, so a prompt that binds only the shape it happens to have text for
leaves the other looking like a pass.

**A compliant site hides from a name grep exactly as well as a defective one.** Also `REC-121`, and the
sweep-side companion to the rules above: of the twelve prompts in the population, the one that had
*solved* the defect was invisible to every search for `run-start` or `_last-run-report` because it
named the file by paraphrase — "the previous review self-report". Had the sweep stopped there it would
have counted a correct file as broken and edited it. So **enumerate the population from something that
defines it** — here the prompts naming `_single-shot-self-report.md`, a set the validator independently
asserts the size of — **and then classify each member by reading it**. Grepping for the defect's
wording measures the wording, not the population.

**When a fix invents a new form of a persistent name, every reader of the old form is now wrong.** Also
`REC-140`, and the write-side twin of the branched-return rule above: admitting a second application
under `<empresa>-<puesto>-<YYYY-MM-DD>` left that dated folder **write-only**, because the mode that
consumes it still hard-coded the undated path and the creating step's own parenthetical re-stated it —
both blocking findings of the review were in text the repair had just written. A new variant with no
reader is not a smaller fix; it is one that reverts itself at the first consumer.

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

**A prerequisite header binds every mode the prompt declares, and a mode's admissibility must be stated
positively — a sentence about what it *writes* is not one.** From `REC-124`. `simulation-review-prompt.md`'s
`▶ Run first` said "then complete/close the timed attempt" for a file with three modes, one of which runs
*inside* the attempt, and its guard section said only "Hint writes nothing" — write scope, never a state it
is admitted on. That is `REC-065`'s trigger-narrower-than-scope at the level of a mode: `review` and
`correction` each had a positive admissibility paragraph and the third had a disclaimer, so nothing was
internally incoherent and no check could fire. Two things generalise. **A mode-scoped prerequisite has a
published form already** — `plan-audit`'s `▶ Run first (new mode only)` — so a family that has solved the
shape is again the first place to look. And **the sites that already stated the rule were the wrong ones**:
both launchers carried "hint mode requires the partial solution only", while the one document the cold
subagent actually reads did not. When a rule lives in several files, ask which of them the *executing*
agent opens; a launcher a human reads is not a substitute for the dispatched prompt, and on a skill-doored
path the YAML `description` is a third such document.

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
| REC-144 | the cold reviewers of `REC-115`, 2026-08-13 — raised as an ownership finding out of that row's scope | **`_interview-prep-standard.md`'s "Adding questions from outside the audit" says a concurrent practice insertion cannot be detected — "No gate is built for it, because none would work… The working tree cannot either" — and `REC-115` made the second clause partly false.** `interview-prep-audit` now runs `git status --porcelain` on each topic's `en/`+`es/` pair **immediately before that topic's first author dispatch**, which is exactly the moment the standard reasons about ("clean for every topic a `FILE = all` run has not reached yet") — so an insertion sitting uncommitted there **is** visible, per-topic, at zero cost. The standard's reasoning assumed a whole-run check. This is not a licence to build the gate: the paragraph's *first* clause (an audit and a practice prompt allocating "the next unused ID" from independent reads) may still be the real reason, and the rule-for-Victor may still be the right answer. What is wrong is the stated impossibility, which a future reader will take as settled. `REC-115` deliberately narrowed its own prompt clause to "baseline availability and nothing more" rather than edit a standard from a prompt fix. | open | Settle from `_interview-prep-standard.md` and `interview-prep-audit.md`'s Run baseline block. Adjudicate as a real defect by correcting the impossibility claim to what the per-topic check can and cannot see, an ambiguity by scoping "the working tree cannot" to a whole-run check, or a false positive by quoting why a per-topic clean/dirty reading still cannot distinguish an insertion from any other uncommitted change — which is the strongest counter-argument and should be tested first. |
| REC-145 | the cold reviewer of `REC-118`, 2026-08-13 — raised as an adjacent defect, out of that row's scope | **`_sql-exercises-practice.md` Step 1's schema-mismatch branch offers Victor option (B) — append a new `SETUP v2` block with the canonical schema to the existing file — while Step 4 of that same file and doctrine invariant 11 say a file whose SETUP no longer matches the canonical schema is "closed, not extended: the next numbered file starts fresh".** The only file that can reach the (B) branch is `01-basics.sql`, the sole pre-canonical file, and it is reachable on exactly `REC-118`'s path: `MODE = reinforce` is deliberately allowed on a closed file and Step 1 keeps the schema check live there. The (A)/(B) question is residue from 2026-07-22 — Victor answered (B) on the run that established one-file-one-schema later the same day (`_last-run-report-sql-exercises.md`), so the branch and the rule that voided it were written hours apart. | open | Settle from `_sql-exercises-practice.md` Step 1 and Step 4, `practice/sql/PLANNING.md` invariant 11, and `sql-exercises-prompt.md` l.128. Adjudicate as a real defect by removing (B) or routing it to the next numbered file, an ambiguity by scoping "never extended" to first-pass batches while a reinforce run may extend, or a false positive by quoting the rule that already stops (B) before the question is printed. |
| REC-151 | the cold reviewer of `REC-120`, 2026-08-16 — raised as an incidental, out of that row's scope, and **re-measured before opening: the reviewer said 11 of 12 and it is 10** | **`_interview-prep-write-prompt.md`'s "Where to look, by topic" table routes code sourcing for ten of the twelve banks and omits `spring` and `javascript`.** Its four bullets cover spring-boot/java/security/architecture, angular/typescript/css, sql, and git/general; an author writing a Spring or a JavaScript question that the standard requires to carry a real cited snippet has no stated place to read one from, while the section's own rule — "never invent code and present it as Victor's" — leaves only the `// illustrative — not from a project` escape, which was written for a pure-language gotcha and not for a whole topic. `javascript` is the more costly half: its bank is 405 lines at junior in both languages, where no `spring.md` exists yet. Same 2026-08-08 population widening as `REC-120` for the `spring` half, but a **different claim** — code-source routing, not selectable population — so it is not a `REC-120` sweep failure. | open | Settle from `_interview-prep-write-prompt.md`'s `## Sourcing real code` section, `_interview-prep-standard.md`'s snippet requirement, and what is actually on disk under `projects/` and `practice/`. Adjudicate as a real defect by routing both topics (`spring` plausibly to the same 07 backend as `spring-boot`, `javascript` having no JS project since the stack is TypeScript — which is a finding, not a gap to paper over), an ambiguity by scoping the table to the topics that *have* a source and stating what an author does for the ones that do not, or a false positive by quoting the escape clause that already covers a topic with no project behind it. |
| REC-130 | `/system-check` 2026-08-13, contradiction; `project-portfolio.md` contradiction 3 | **`portfolio-audit.md` says every unchecked backlog task is open, while `_portfolio-standard.md` says open Low tasks do not affect the verdict.** Without an explicit severity partition, the runnable's absolute wording can block readiness for work the standard excludes. | open | Settle from `portfolio-audit.md`, `_portfolio-standard.md`, and backlog severity semantics. Adjudicate as a real defect by narrowing the verdict set, an ambiguity by distinguishing open inventory from blocking tasks, or a false positive by quoting the next sentence or named authority that already imposes that partition. |
| REC-147 | the cold reviewer of `REC-137`, 2026-08-14 — raised as an incidental outside that row's family and recorded rather than swept | **`_application-standard.md` l.35 tells the five prompts that read it that `PROGRESS.md` holds "all completed projects and **every concept learned**"** — a claim the 2026-08-03 deletion of its per-technology sections falsified, and which is still on disk five weeks later. `_roadmap-standard.md` states the opposite of the same file ("It is **not an inventory of concepts**… never ask it which concepts are covered; ask the markers"), and `progress-update-prompt.md` D1/D2 make re-creating one a defect. A `cv`, `linkedin` or `cover-letter` run sourcing the skills half of its output from where this standard sends it finds nothing there and has no stated fallback. | open | Settle from `_application-standard.md`'s sources section, `_roadmap-standard.md` "What each file is for", and `progress-update-prompt.md` D1/D2. Adjudicate as a real defect by repointing the concept half at the coverage files' evidence markers, an ambiguity by defining what the application family actually needs from `PROGRESS.md` (level per topic, not concepts), or a false positive by quoting a section of `PROGRESS.md` that still enumerates concepts. |
| REC-138 | `/system-check` 2026-08-13, contradiction; `strategy-tracking.md` contradiction 5 | **`roadmap-review-prompt.md` says Reviewer 1 reads only `_roadmap-standard.md` and `ROADMAP.md`, then permits a fallback read of the session-rules study-order section.** The declared cold read boundary and fallback source list do not match. | open | Settle inside `roadmap-review-prompt.md` with the session-rules authority. Adjudicate as a real defect by listing the conditional source, an ambiguity by defining “only” after inherited context is loaded, or a false positive by quoting a runtime rule that supplies the section without reviewer file access. |
| REC-139 | `/system-check` 2026-08-13, contradiction; `strategy-apply.md` contradiction C-01 | **`profile-readme-prompt.md` says no configuration is needed, but declares required `MODE = sync` or `optimize` configuration and cannot select its flow without it.** The entry contract can be launched without the value its algorithm needs. | open | Settle inside `profile-readme-prompt.md`. Adjudicate as a real defect by correcting the claim or deriving mode, an ambiguity by distinguishing user-supplied configuration from orchestrator-supplied mode, or a false positive by quoting an existing default that always resolves the mode. |
| REC-141 | `/system-check` 2026-08-13, contradiction; `strategy-apply.md` contradiction C-03 | **`_application-standard.md` says every required keyword must be present and also says unsupported skills must be omitted, with no precedence when a required keyword is not defensible; consumers behave as though defensibility wins.** The same application can therefore be judged incomplete or dishonest under two mandatory clauses. | open | Settle in `_application-standard.md` with the CV and application consumer prompts. Adjudicate as a real defect by stating defensibility precedence and recording the gap, an ambiguity by distinguishing literal keywords from supported evidence, or a false positive by quoting an existing rule that already resolves the collision. |
| REC-153 | the cold reviewer of `REC-142`, 2026-08-17 — raised as an incidental, out of that row's scope, and **verified against disk before opening** | **`evidence-intake-prompt.md` l.166-167 tells the run to update its `_run-tracker.md` row "and commit that file on its own (`docs: run tracker — evidence-intake run`)", naming "the «Global prompts» table" — two defects against the contract its own next section executes in full.** `_single-shot-self-report.md` Step 3 stages the report **and** `_run-tracker.md` together and on their own, so a tracker-alone commit fired one section early splits the close-out record in two and leaves Step 3 with half of what it is told to stage; and no `## Global prompts` table exists — the tracker's nearest heading is `## Global pipeline prompts (no per-target scope)` (l.156), whose own header excludes single-shot prompts, while this prompt's row sits at l.176 under `## Single-shot prompt executions`, the table Step 2 names. Both predate `REC-142`'s fix and neither is falsified by it. | open | Settle from `evidence-intake-prompt.md`'s commit block and `## Final step`, `_single-shot-self-report.md` Steps 2-3, and `_run-tracker.md`'s headings. Adjudicate as a real defect by deleting the early tracker commit and letting the close-out own it, an ambiguity by scoping the early write to the *row update* with its commit deferred to Step 3, or a false positive by quoting a clause that already subordinates this block to the final step. **Measure the family first** (`REC-122`): this prompt is one of twelve single-shot consumers, and the same instruction in a sibling would make it the shared contract's defect rather than this prompt's. |
| REC-143 | the cold reviewers of `REC-117`, 2026-08-13 — raised independently by two of its three passes as an incidental, out of that row's scope | **`_sql-plan-standard.md` and `practice/sql/PLANNING.md` invariant 9 say the pasted `sql-exercises` config has exactly four keys (`MODE`, `TOPIC`, `COUNT`, `FILE`), while that same doctrine's §2, the prompt's own config block, its `README.md` catalogue row and both launchers say five — the fifth being `LEVEL`.** `LEVEL` is what selects `{PLAN}`, so the four-key list is not a harmless omission: a `sql-plan-audit` specialist applying it literally can flag a pasted `LEVEL = middle` as an invented key, or "correct" §2 down to four and break level selection. The standard's list carries a `(Corrected 2026-07-22 …)` note about removing `FOCUS`, dating it to before `LEVEL` existed. | open | Settle from `_sql-plan-standard.md`, doctrine §2 and invariant 9, and the prompt's `## Configuration` block. **Ownership is split** (`REC-083`): the standard is by-hand machinery and is ours, the doctrine is `sql-plan-audit`'s and a defect surviving there is handed to that prompt rather than hand-edited. Adjudicate as a real defect by stating the key set once in the file that owns it and pointing from the rest (`REC-064`), an ambiguity by defining four as the keys a *step* supplies against five pasted, or a false positive by quoting a scope clause that already excludes `LEVEL` from the count. |

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
- `REC-109` — **the row named one cause and re-verification found two, each on its own sufficient to block**: Step 4 asked one orchestrator context to disposition 1,959 claim rows against 4,988 manifest facts, and both blocked runs additionally hit claims whose *owning source* states two mutually exclusive clauses, for which the only available disposition was the blocking `unverifiable` — so the global verdict was hostage to defects the audit is forbidden to repair, and a sharding-only fix would have blocked again. Step 4 is now 4a–4d: a mechanical partition of each map, bounded on **both** lines and table rows, cut only at its own headings; one cold concern per span and per manifest concern, each reading the map itself under the new `_internal/_system-check-reconcile-prompt.md`; and a non-blocking `source-contradiction` disposition whose bar is both clauses quoted with their fact IDs and exactly one ledger ID from Step 5. Dividing the **ruling** is not `REC-079`'s deleted `2C`, which divided the **source** — the distinction is stated in the two places a future session would reach for it. The row's second option, a deterministic census component, was rejected on the 2026-08-13 run's own evidence: it completed the census and died at the dispositions · cold reviewer: approve-with-tightening — three blocking findings, and **the arithmetic defect it caught was written by the repair** ("four category counts" over three categories, contradicting two surviving correct statements of the same gate); its measured partition proved the first bound concentrated rather than divided, putting 45% of `README.md`'s text in one concern of twelve · sweep: complete · maps: `README.md` — the system-check dispatch cell, catalogue row and internal-file list; `_system-map.md` §12's semantic-sweep paragraph — both in the fix commit · `f9492e00`
- `REC-110` — **real defect, and the row was right about the withheld authority while overstating how bare the reviewer was**: `coverage-verify-prompt.md` named `_topic-ownership.md` in its `## Configuration` block and never in its Required sources, so the registry reached the run only as a word — while the reviewer mandate forbade reporting "items owned by another topic" and Step 2 rejected a finding that "belongs to another topic". The reviewer was not unequipped: it receives `_coverage-standard.md`, whose "Topic isolation" both names the registry and lists eight boundary pairs — but that list is partial by its own words ("in particular"), carries no `Owns` / `Excludes / delegates` / `Adjacent topics` cells, and names an authority the reviewer could not open. **The defect had two halves in one file, not one**: the cold reviewer's envelope *and* the orchestrator's own Step 2, whose only mechanical instruction is a grep over this topic's three files — a grep that structurally cannot settle ownership. Fixed by binding `TOPIC_BOUNDARY` + `ADJACENT_TOPICS` as the sibling `coverage-prompt` does, adding the registry as Required source 5, handing both rows to the reviewer under a scoping clause (a boundary reference, never a licence to open an adjacent topic's coverage), naming the authority at both test sites, and separating *presence* (the grep) from *ownership* (the rows) · **the family asymmetry was the cheapest evidence and is promoted**: two of three siblings already listed the registry · cold reviewer: approve-with-tightening, four tightenings applied verbatim — the fix had narrowed both tests to `Excludes / delegates`, which the registry itself calls only "the **nearest** tempting overlap", so an Architecture gap owned by SQL's `Owns` cell would have survived; it also reused the sibling's `TOPIC_BOUNDARY` token for a widened meaning, and the §7 map cell described only the reviewer half · sweep: complete — `coverage-audit`'s Step 4 ownership reviewer discharged against l.132-133 read with l.67, `coverage-prompt`'s market analyst against l.151, and the notes/interview-prep/SQL/simulation families carry no cross-topic ownership clause at all · maps: `README.md` — the catalogue row's Reads cell; `_system-map.md` — §7's `_topic-ownership.md` Read by cell, both in the fix's own commit · residue opened as `REC-149`: this prompt still routes a rejected other-topic gap nowhere, and one already reached `_cross-topic-inbox.md` in 2026-07 — `8553335c`
- `REC-111` — **real defect at the owners, one false positive, and one differently-shaped defect; the row named two of seven consumers**: `_shared-context.md` declared itself the single source for the profile, the target companies and the market, while `_roadmap-standard.md` *mandated* five stable `ROADMAP.md` sections on those same subjects under a no-duplication rule naming only `PROGRESS.md` and coverage — so seven prompts read `ROADMAP.md` for a target fact and the two files had **already** drifted on disk (the internship stack; the length of the HR call). The fence is now stated from both ends and enumerated: role, companies, stack, seniority, market and hiring stages from `_shared-context.md`; phases, gates, timeline, block tables and its own ranked hiring-probability list from `ROADMAP.md`. Consumers are **scoped, not cut** (`REC-021`'s shape), except the two where ROADMAP supplied nothing they needed — `evidence-intake`, whose posting filter decides what enters `_job-market-evidence.md`, whose junior postings raise the very floor `_coverage-standard.md` forbids ROADMAP to raise, and `portfolio-audit`'s author, whose fixed reading list barred the source its own Context section names. Three family members already complied and were the model rather than edits (`hr-screen` l.54-56, `_sql-plan-standard` under `REC-021`, `_simulation-plan-standard`), and the closing sweep found `sql-plan-prompt` stating the same split independently. The row's `_coverage-standard.md` clause is a **false positive** — that standard already rules and was left untouched. Its 2a clause is a **different defect**: a silent interview-relevance filter over an already-calibrated floor, now a ranking plus a reported `Coverage miscalibration candidates` line routed to `/coverage {topic} junior`. `ROADMAP.md`'s own duplicated prose was **not** hand-edited — the `REC-083` split: the standard, Step 5 and Reviewer 2 now repair it on the next `/roadmap-review` run · cold reviewer: approve-with-tightening over two rounds (round 1 `reject`), and **every round-2 finding was written by the repair** — an over-correction handing ROADMAP's ranked list to `_shared-context.md` against `_session-rules.md` l.89, a "first five" count false for two of its five, and a map row falsified by the same round's narrowing of the fence · sweep: complete — the two sites the first measurement missed were a **second** statement inside a file already judged compliant (`hr-screen`'s `▶ Run first`, `REC-069`'s fourth-copy shape) and an unscoped subagent dispatch in the very file the fix had scoped ten lines earlier; ten other candidates falsified against quoted sentences, including a deictic `rg -U` sweep for "the roadmap" / "the career plan" · maps: both, in the fix's own commit — `README.md`'s `evidence-intake` and `_portfolio-write-prompt` reads cells plus the `_roadmap-standard.md` row; `_system-map.md` §7's `ROADMAP.md` readership row and its `_shared-context.md` authority row — `819d6c17`
- `REC-112` — **both contradictions real, and each resolved by holding the fence rather than loosening it**: `_notes-review-es-prompt.md` told Stage C to "read only `{ES_FILE}`" while the same prompt mandated `_note-quality-standard.md` in full, the `08-excepciones.md` calibration section, a `notes/{TOPIC}/{LEVEL}/es/` listing for the link check and `{PLAN}` at Finish — and `_note-quality-standard.md` l.5-7 names this prompt among its own readers, which is what settles it: the clause never fenced the standard, it fenced the **English note**, and it is now written that way with the support reads enumerated and `{FILE}` declared a path it verifies and commits, never opens. The append-only half is the sharper one: the freeze proof demanded "a `git diff` over **both files**", handing a textual English diff to the one stage forbidden the English — where A proves "over the file", B "confined to the appended sections" and T "the `es/` changes", so three of four stages already scoped the proof to what they may read and only the blindest was asked for the most (`REC-110`'s promoted family rule, third use). The English proof is now `--numstat` counts, whose removed column cannot stay `0` through a deletion, a modification or a reorder while printing no line of prose; the clause's origin in `notes-audit.md` "Append-only mode" rule 4 was corrected in the same edit, since that is where Stage C's wording came from · cold reviewer: approve-with-tightening — four tightenings, three in text the fix wrote: "the one file each may **read**" was false for A and T (each diffs what it **writes**), the new headline's "the only *note* you read" was re-tripped by the prompt's own words for the calibration file, and — the mechanical one — both commands were unpinned, so a proof assembled after `git add` diffs against the index and returns **empty**, which the pass criterion could not distinguish from a clean run: both now take `HEAD` explicitly and an empty proof is declared a failure · sweep: complete — the three per-stage clauses discharged against quoted sentences, plus `notes-audit` l.222, `notes-plan-prompt` l.331, `README.md` l.604 and `_system-map.md` §10, all four form-agnostic about the diff · maps: `README.md` — the stage C catalogue row, whose "Reads only the planned `es/` file" carried the same defect, in the fix's own commit; `_system-map.md` verified unaffected (no writer, trigger, chain step, gate or debt moved, and it carries no row about this component prompt) — `c0dcea25`
- `REC-113` — **half false positive, half a real defect narrower than the row**: `_note-quality-standard.md`'s bolded "Never modify an `en/` file without mirroring the change to its `es/` counterpart" reads as absolute, but fourteen lines below the same section authors content in `en/` "first, **then** translate" and its plan contract dates the both-languages confirmation to "the successful Stage C commit" — so Stage A writing English only contradicts nothing inside the pipeline, and that half is refused in writing (promoted as the unqualified-heading rule). What was un-owned is the **standalone advertisement**: `_notes-write-prompt.md` offered a run that drafts or corrects one `en/` file and said nothing about what that run still owes, while the sibling `_notes-review-prompt.md` l.14-16 has carried exactly that clause since it was written ("it still won't commit — pair it with the translator + Spanish reviewer to land the file"), so the family had already solved the shape (`REC-110`/`REC-114`, again) and the fix copies it rather than inventing one: a standalone run is declared an **unfinished stage, never a landable change**, pointing at the standard's rule in the standard's own wording rather than restating it (`REC-064`) · cold reviewer: approve-with-tightening — its one tightening was a claim the fix wrote, "out of sync … until B, T and C have run", where parity is restored by **T alone** (B never opens the `es/`) and only the *landing* needs all three · sweep: complete — T and C advertise standalone runs and cannot create the divergence (T converges the pair, C commits it), interview-prep is excluded because one component writes **both** languages ("syncs the two languages"), `study-content-writer` carries the whole bilingual contract in its Step 3, and no launcher names a component · maps: both, in the fix's own commit — `README.md`'s internal-vs-runnable bullet said internal files "never appear in your 'paste into a new chat' workflow" while naming as its exemplar the very file whose step 5 reads "Paste the entire prompt below into a new chat", and `_system-map.md` §7's note-file writer row listed `/notes-audit` and `study-content-writer` under a header whose whole job is to say *only this, never by hand* · incidental opened as `REC-150` rather than fixed here: stage B is told the `es/` "has not been created yet", false on every `audit` and `refined` entry — `f8d78640`
- `REC-114` — **real defect, and the row's "receives no mode" was the weaker half of it**: `_interview-prep-review-prompt.md` had no `MODE` key in its own config block at all, so passing one would have bound nothing and its behaviour was bit-identical in both modes — which is also what foreclosed the ambiguity branch, now promoted to the preamble. `MODE = correct` exists so a section Victor just wrote himself is corrected and not rewritten, and the author honours it (Steps 1/2/4/5 + 6.2 report-only); the reviewer behind it then rewrote realism, wording and voice on every unrefined question, producing exactly the `full`-mode diff the mode was chosen to avoid. The reviewer now declares its own `MODE` and partitions its checklist: markers, format, type label, stable IDs and bilingual integrity are fixed in both modes, the standard's answer-quality bar and anything needing a question added or rewritten are **reported**, and the sole carve-out is 6.2's own "never rewrite without a TODO". One exception is corrected in both modes — a **false** code citation or project anchor, which is a falsehood rather than a weakness and which `_interview-prep-standard.md` already ranks as "worse than none"; the reviewer confirmed that applies the standard's own ranking rather than reconciling two clauses into a third. The fix lands in the receiver's config, so the **standalone** author→reviewer path closes with the orchestrated one · cold reviewer: approve-with-tightening — four tightenings, three of them to text the fix introduced: the B dispatch's tier justification still carried an unqualified third copy of the very clause the row named, "no slice at all" overstated a slice that still carries en/es sync mismatches in `correct`, and the partial-audit rule's `PASS`/`FIXED` enumeration was one the new `PASS (with findings)` token escaped · sweep: complete, and **its stated reason was falsified**: `notes-audit`'s `append-only` is the same shape — write depth narrowed inside a shared author→reviewer chain — and step 1 had claimed no other prompt has it. It is not a site: the key is declared in each downstream component's own config block, i.e. already closed the way this fix closes interview-prep, which is the corroboration now recorded in the preamble. `plan-audit`, `simulation-review`, `coverage-verify`, `sql-plan` and `simulator` were falsified as branch selectors, commit gates or scope selectors · maps: `README.md` — the reviewer's catalogue row, in the fix commit; `_system-map.md` verified unaffected (§7's writer row unchanged, §9 is skills-only). The write prompt's own row was stale about modes **before** this item and was corrected separately on the read trigger, `17555ef7` — `e7070910`
- `REC-115` — **real defect, and the row understated it twice over**: the blocked branch was unreachable (the orchestrator waited on a `BLOCKED` return no component prompt was ever told to produce), and a partial author write did not merely *survive* — the per-topic commit stages the `en/`+`es/` pair wholesale and its `git status` check only guards against *other* files, so half-written bytes shipped inside a commit reporting the topic as audited, the same sweep mechanism `_interview-prep-standard.md` already describes for third-party insertions. Both components now declare `BLOCKED` plus what they changed; the orchestrator records a `{BASELINE}`, restores that one section's span or leaves-and-declares it, labels the commit and records the target `blocked`. The **general** branch went into `_agent-runtime-standard.md`'s dispatch contract beside the dead-role bullet it complements — written once rather than three times (`REC-064`), with the criterion the two bullets lacked: an *undeclared* partial write may not be committed at all · **three of the four blocking findings were written by the fix, and the sharpest killed its own mechanism**: withholding the `Coverage SHA-256` refresh does nothing, because the digest is over the *coverage* file and does not move when a section blocks — a re-audit of an unmoved topic would have shipped half-written bytes under a *current* certificate, so the leave-and-declare branch now **deletes** the line, which the standard defines as stale; the same fix first staled a bank over merely *under-covered* sections, which would have made the level's CORE route unbuildable with no re-run to clear it; and the portfolio restore branch crashed on the first run, where the bank does not exist and `git status --porcelain` prints no record, reading as *clean* into a `git show` that fails · cold reviewer: approve-with-tightening, over four passes · sweep: complete — `portfolio-audit`'s identical topology was un-owned and took the same fix (`REC-131` owns its acceptance *ratio*, the shape that keeps its bytes, and is untouched); `sql-plan-audit` needed one clause because its acceptance check counts rows rather than completion, so a specialist could pass it with `blocked` verdicts and reach Phase 4 — a site a reviewer first raised for a reason **falsified against disk** and a later pass re-raised correctly; `plan-audit` stayed `REC-125`'s and `notes-audit`, `readme-audit`, `review-audit`, the coverage, simulation and system prompts refuse the commit already · maps: `_system-map.md` §10 — a committed artifact deliberately not finished, and the two targets' asymmetric marks; `README.md` verified unaffected, no file, writer, schedule or inventory changed · residue: `_interview-prep-standard.md`'s "no gate is built for it, because none would work" is now partly false and is `REC-144` · `cc0dc2f0`
- `REC-116` — **real defect on both readings, which is why no scope clause rescued it**: `sql-plan-prompt.md`'s "this prompt writes `PLAN` only" sat in a paragraph about the doctrine/route pair, and even that narrow reading was falsified 35 lines below by the one-time split, "the only edit this prompt is ever allowed to make to `DOCTRINE`" — while update mode writes `{LEVEL}`'s two `PROGRESS.md` `Exercise route` tables on top. The sentence now states the two-file division it meant and a second paragraph declares the wider set, pointing at "Update mode" as the complete list instead of restating it. `_sql-plan-standard.md` Section E and invariant 15 already carried all three artefacts and were left untouched; both `/sql-plan` launchers, which enumerate the write set where a runtime reads authorization, gained the `PROGRESS.md` tables and stay byte-identical in their Rules blocks · cold reviewer: approve-with-tightening — an unattributed restatement of `sql-plan-audit`'s own audited-never-repaired rule, dropped · sweep: complete — `progress-update-prompt`, both SQL exercise branches, `sql-plan-audit` and the three SQL skills already state the seeding correctly · maps unaffected — behaviour unchanged, and `README.md` l.393 plus §7/§8 already declared all three writes · `7ecfb801`
- `REC-117` — **real defect, and the row was right about the clause while understating the damage**: one sentence in `sql-exercises-prompt.md`'s "Topic order" paragraph called the junior path table authoritative against four statements making `{PLAN}` §1 the authority, and it is now the projection the Resolution section defines. The sweep took two sites the row never mentioned, both able to send a run to the wrong file rather than merely confuse a reader: the *same clause* listed "joins + join-pitfalls" among the pairs sharing a file — they are Steps 1 and 3, `03-joins.sql` at target 22 and `05-join-pitfalls.sql` at 12, so a `join-pitfalls` run would have inflated Step 1 and left Step 3 unclosable — and `_sql-exercises-practice.md`'s Step 4 write guard resolved `{FILE}` "from the shell's path table", false at middle and senior where no projection exists, beside a deictic calling `01-basics.sql` "not in this table" when it is row 1 of §1 · cold reviewer: approve-with-tightening, over three passes — the first two returned `sweep: incomplete`, each naming exactly one further site, and the third read the family to EOF for `sweep: complete`; every tightening it applied was to text the *fix* introduced, twice for `REC-086`'s deixis · maps: `README.md` — the validator paragraph claimed a run "resolves its target by" that table, which only the removed clause supported; corrected in its own commit `904445fd`, scoped to junior since middle and senior keep no projection. `_system-map.md` unaffected — `d6e278c1`
- `REC-118` — **real defect, and the row's framing was the false half of it.** The practice branch writes no marker at all, so nothing "prescribes opposite persistent output"; what was wrong was one clause of the blocking legacy-format question **spoken to Victor** — that a legacy exercise "no puede llevar la marca `-- ✅ Corregido`, así que se re-lee en cada review en vez de saltarse como cerrado". Four sources falsified it: `_sql-exercises-review.md` Step 2b ("on the header in both formats", with a `-- #NN |` example) and its format-agnostic Step 1 skip, `sql-plan-audit.md` l.98, `01-basics.sql` itself (40 legacy headers, all marked), and `PLANNING-junior.md` §1, which corrected the identical claim on 2026-07-22 and records that it "cost `01-basics.sql` its markers on the first review run" — so the prompt was the surviving fork of a claim already corrected elsewhere, and live, because `MODE = reinforce` keeps the legacy check running on the one closed file that can reach it · cold reviewer: approve-with-tightening, and two of its four tightenings were defects the repair wrote — the corrected sentence put `-- ✅ Corregido` "al final de la línea de cabecera" where only `✅ Corregido <fecha>` sits, and the new pointer paragraph landed between the wait instruction and the "**Then** check the schema" that depends on it · residue owed to `/sql-plan-audit` at G1b, `REC-085`'s route and not one of its sites: doctrine §2 Moment 4 l.205 says the grader "Writes `-- ✅ Corregido <fecha>` **under every answer** it accepts", false against Step 2b's "never on a line of its own" and against disk — a third non-owner restating the review branch's marker rule wrongly · maps unaffected by the fix; the read-verification the whole-file reads earned is committed alone in `9d59de84` (the `practice/sql/{LEVEL}/NN-*.sql` row named Victor as its only writer, omitting the practice branch that writes every exercise block, and listed one of its five readers) — `ee233e14`
- `REC-119` — **real defect, and the row was right about the clause while naming one of four sites**: `_sql-exercises-review.md` step 5 claimed "this prompt is its only writer" of `practice/sql/MISTAKES.md`, a file `sql-block-close` has written the `## Fricción` half of since 2026-08-04. The writer set is stated in eight places and three more were wrong by omission — the SQL track's **ownership fence** (`_sql-plan-standard.md` Section E, which is where the rule now lives and which the prompt points at), `README.md`'s data-flow bullet, and the same file's practice pipeline diagram — while `_system-map.md`'s writers row, the doctrine, `MISTAKES.md`'s own header and the skill body were already right and were left untouched. `_system-map.md` still owed `## Closed`, which no site named at all. The fix is a per-artefact fence in `REC-073`'s three-right form: the grading branch writes `## Open` and the `## Closed` rows a run redeems, `sql-block-close` writes `## Fricción` and only that, and neither moves a row across the boundary. Two sweep sites came from the cold reviewer, not from the analysis: the skill's YAML `description` — the copy loaded into every session listing (`REC-102`) — asserted "MISTAKES.md only ever sees what a grader marked ⚠️/❌", and the paragraph the fix edited carried the same exclusivity as a **possessive** (promoted to the preamble). Residue, verified and **not ours**: doctrine `practice/sql/PLANNING.md` Moment 2b still sends a span with no open rows straight to the least-exercised concepts, skipping the `## Fricción` tier §8b and the shell both have — routed to `/sql-plan-audit`, whose file it is (`REC-083`) · cold reviewer: approve-with-tightening (two rounds; round 1 returned `sweep: incomplete` and its two sites were verified against quoted sentences before being worked) · maps affected — `README.md` (bullet + diagram) and `_system-map.md` (writers row, `## Closed` and the de-hardcoded readers cell), both in the fix commit — `71312af2`
- `REC-120` — **real defect, and the row named one of the two values missing from the same enum**: `simulator-prompt.md`'s `TOPIC` listed ten banks where the interview-prep family defines **twelve** (`_interview-prep-standard.md`: "`FILE = all` is twelve topics of unattended work"; the audit, write and review prompts each hardcode the same twelve). `javascript` was omitted from birth — `git ls-tree e779a22a` has `notes/interview-prep/{en,es}/javascript.md` on the very commit that wrote both the enum and the promise it contradicts, at the pre-level path — and `spring` entered the population on 2026-08-08 (`b9e2990f`) with no consumer following it, which is `REC-137`'s shape at the population rather than the effect. Fixed as the family already solves it (`REC-114`'s corroboration rule): the twelve values, plus the gloss naming `interview-prep-audit`'s `FILE` list as their authority, plus `spring.md` added to the full-mode source list under the existing `projects/` skip-if-absent form — Step 2's fingerprint gate already stops a bank that does not exist and names the audit run that creates it, so no new branch was invented. The parenthetical now carries its **denominator** ("the only three of the twelve banks left out"): it named three exclusions against no total, which is exactly how a fourth went unnoticed for eight days · **the reviewer proved the fix was not passing vacuously** — the three indented gloss lines could have broken the config parse and made the validator compare nothing, so it re-ran the four parser functions standalone and confirmed `TOPIC` is genuinely among the 44 closed enumerations compared · cold reviewer: approve-with-tightening then approve on the delta, one tightening applied verbatim (the skip clause tested authorship state where its sibling tests existence) · **sweep: incomplete at the reviewer and closed by the validator — the row's real lesson, promoted**: step 1 enumerated the launcher family with `ls` over `.agents/` (skills only) and both the sweep and the cold review missed `.codex/commands/simulator.md`, which `validate-prompt-system.ps1` holds byte-identical to its `.claude` twin; the reviewer then re-swept `.codex/` and the validator's own source, discharging both against quoted text. What stays unguarded and makes the new gloss load-bearing rather than decorative: nothing mechanically ties this enum to `interview-prep-audit`'s, because that launcher advertises `FILE=<topic>|all`, which the validator rejects as not a closed enumeration — that is precisely the tie that rotted · maps unaffected — no map states the topic population (`README.md` l.263 names parameter keys, l.410 the glob `interview-prep/{LEVEL}/{lang}/*.md`; `_system-map.md` §7's rows carry no enumeration), and l.726's "cover everything in one run by design" was ruled unchanged, being a claim about batch selectors, not about bank count · residue opened as `REC-151`: `_interview-prep-write-prompt.md`'s code-sourcing table omits the same `spring` plus `javascript` — `8a8d6a4a`
- `REC-121` — **real defect, and both halves of the row were wrong about it**: the damage is not that "a stop or rerun decision arrives late" — the run-start table has no stop or rerun branch, it prints one line and is forbidden to apply it — and the population is not three prompts but **nine of the twelve** that name `_single-shot-self-report.md`. What the trailing placement actually cost is the whole check: that contract's Step 2 **overwrites** the report Step 5 reads, so a Step 5 reached through the final section's "execute it in full" measures the run's own fresh report and the previous run's `open` is destroyed unread — the rot `_system-map.md` item 7 says the check exists to prevent, and `REC-136`'s circularity arriving through ordering. The eight trailing blockquotes moved to the first pre-work position (inside the ```` fence, after the config block, for the five fenced prompts; after `▶ Run first` for the three unfenced ones, as `evidence-intake` already did), their dangling "that file's Step 5" replaced by the named target (`REC-086`), and `simulation-generator` gained the invocation in its `## 0` that its sibling `simulation-review` already had; the ordering rule itself is stated **once**, in `_single-shot-self-report.md` Step 5, which owns the single-shot path — the row's proposal to settle it in `_pipeline-self-report.md` would have forked it, that file already owning the orchestrator half (`REC-064`) · the 19 orchestrators were measured and are clean, every one invoking the check inside its first ~115 lines · **the reviewer's one tightening was a claim the fix wrote**: "from its own first executable position" is falsified on disk by all twelve prompts (a runtime-contract blockquote precedes every one, and compliant `sql-exercises` sits at l.253 of 417), so the bar is now the executable one the blockquotes state — before any content work, and before Step 2 overwrites · cold reviewer: approve-with-tightening · sweep: complete — skills, both launcher adapters, `_run-tracker.md`, both maps and the validator each discharged against a quoted sentence; the validator asserts the contract is *named*, never where · maps unaffected — `_system-map.md` l.278 and item 7 already say `step 0`, so the fix makes true what the map already claimed, and `README.md` states nothing about the check · **the sweep's own lesson is promoted above**: the file that had already solved the defect was the one invisible to the grep — `simulation-review` names its report by paraphrase — so the population was enumerated from the contract's namers, a set `validate-prompt-system.ps1` independently sizes at twelve, and each member classified by reading it — `251c3946`
- `REC-123` — **real defect, of the ambiguity kind, and the fix was a *dimension* ruling rather than a precedence one**: Step 3's order rule 1 ranks every question mapping to an Open `simulator` row first while `Session size`'s full-mode bullet caps consecutive questions from one topic at three, and four such retries in one topic satisfied neither reading. Both clauses survive — rules 1–4 assign **rank**, the cap governs **adjacency** — so a displaced retry keeps its rank and is asked at the next position its topic admits, with the boundary stated in the same breath (`REC-146`): where nothing the cap allows is left, **or where deferring would push a question past the session's last position**, the cap yields and the run says so, because an unasked retry leaves its Open row unclosed while a fourth consecutive question costs realism only · the family had already solved the shape (`REC-114`) — `hr-screen` subordinates its intake with "while keeping a natural recruiter order", `code-review-practice` with "When FOCUS is blank … only then" — and the simulator was the only one of the three with an unconditional intake facing a hard numeric constraint · **four cold rounds, every blocking finding written by the repair, and the row's real lesson is that the fix got *smaller* to close them** (promoted above): round 3 asked for a re-application clause and a ruling on unrankable questions, and rewriting the paragraph over *asking* rather than over *planning*, minus a universal the file falsified three times, retired both · sweep sites, both real and both found by a reviewer rather than by the measurement: the Persona's second compressed statement of the ordering ("SESSION-LOG ordering applies after them"), which the new boundary made positively false and which became a pointer rather than a corrected copy (`REC-064`), and `README.md` l.410's "retries durable weak areas first" — the same claim one register up, in the idiom rather than the string (`REC-149`) · the fourth reviewer's `sweep: incomplete` on the `### topic` starting question was **verified and discharged** as a separate defect of the same shape, upheld on re-review and opened as `REC-152` (`REC-115`) · `validate-prompt-system.ps1` green as a step-1 instrument and before each dispatch (`REC-120`) · cold reviewer: approve-with-tightening · sweep: complete · **maps: `README.md` — the practice family-catalogue row, and the run's own `maps unaffected` was falsified by the reviewer that found it** (`REC-074`: an open row's declaration is a prediction, re-tested at apply time); `_system-map.md` states neither the ordering nor the cap and stays true — `0c2a1173`
- `REC-122` — **half false positive, half real, and the real half sat in neither file the row named**: the literal-`{TYPE}` claim is **rejected** — `_batch-mode.md` step 1 expands `all` into the ordered list and step 2 runs the entire procedure once per target, and no sibling states a rebinding clause either (`{FILE}`, `{TOPIC}`, `{PROJECT}`, `{PROJECT_PATH}`), so a reading that reaches `.../all.md` has skipped step 1 and the claim condemns the whole family or none of it; the binding was still made explicit, in the owner rather than in `code-review-prompt.md` (`REC-064`). **The commit half is real and its cause is the consumer class**, promoted above: `_single-shot-self-report.md` carried no batch clause where `_pipeline-self-report.md` has one, so a `TYPE = all` run would have written three self-reports over one file, committed the close-out three times, and read at each target's start the report it had itself just written — `REC-121`'s rot arriving through batch instead of through ordering. `_batch-mode.md` now carves the run-level close-out out of step 2's "entire procedure" and points at the two contracts for what it contains, defines where "the end" is when its own length rule truncates a batch, and splits its `## Commits` section into granularity (binds every commit) and timing (depends on who runs it) — the contradiction `REC-100` recorded as an incidental and left · three more false clauses in that same 64-line file, none of them the row's: `simulation-generator` named as a `TYPE = all` prompt when its config is `LEVEL` + `STEP` and `README.md` already listed it under *One target only*; four pointers to a "Batch targets" note only `readme-audit` has; and — the reviewer's catch — the replacement pointer, false in turn for `sql-exercises`, whose ordered list sits under its `TOPIC = all` validation bullet and whose `TOPIC` enum additionally offers `R1`–`R5`, revision points that are not batch targets, so `all` expands from the list and never from the enum · **the sweep ran through the batch paragraph of all six `all`-capable prompts and returned two sites, both verified real before being worked**: `readme-audit`'s hand-written "take the Commits section in two halves" paragraph, now the owner's and collapsed to its two local clauses (its target is the project, and its one-`git add`-per-changed-README override), which its own Finishing section was already stating a third time; and `review-audit`, the structural one · **each of the three passes' tightenings corrected text the fix had just written**, the last being an "every project's cell" that dropped the `never a cell for a target that was planned but not completed` guard its owner is explicit about · `validate-prompt-system.ps1` green before and after, run as a step-1 instrument per `REC-120` · cold reviewer: approve-with-tightening · sweep: complete · maps unaffected — `README.md`'s "Batch mode" section already listed `code-review-practice` under *Supports `all`* and `simulation-generator` under *One target only*, so the diff aligned `_batch-mode.md` to the map rather than the reverse, and `_system-map.md` l.21/278/281 stay true with l.278's "overwritten each run" strengthened — `21c2c46f`
- `REC-124` — **real defect, and the row named the wrong half of it**: the `ENTRYPOINT: simulation-grade` envelope "before every mode" is not the bug — `simulation-grade/SKILL.md` §1 dispatches hint through that same door and the standard's invariant 13 scopes hint out of *state-writing* only — and §0's attempt-state guard was already scoped ("First review **additionally** requires"). What made hint unreachable is the unconditional `▶ Run first` header ("then complete/close the timed attempt") over a three-mode file, a guard section giving hint nothing but a write-scope disclaimer, and a third site the row never named: the skill's YAML `description` — the copy loaded into every session listing and read instead of the body — which says "Grade a **finished** timed simulation … ready for review" and so positively excludes an in-flight attempt, on the only door there is; so `dame una pista` most plausibly produced a **warm** in-session hint with code and no `Assisted` trail, after which `simulation-block-close` writes `Attempted — awaiting review` over an attempt that had been helped and the route keeps a Pass it did not earn. Header mode-scoped on `plan-audit`'s published `▶ Run first (new mode only)` form, §0 given hint's positive admissibility (step still `ready`, no `awaiting review` status on spec or TRACKER, `TIME_USED`/`SELF_ASSESSMENT` not yet in existence) with a refusal set drawn from the standard's §4 status model, and the description given the hint trigger in both mirrors · **the cold reviewer's three tightenings all corrected text the fix itself had just written**: the refusal set omitted `reinforcement-required`, whose attempt is equally over; the new paragraph cited `simulation-block-open`'s next-moment *table* when the hint consequence lives in Moment 3's attempt conditions beneath it (`REC-084`'s wrong-element harvest in prose); and the Hint section's absolute "writes nothing" was left standing where `_single-shot-self-report.md` Step 2 ("Every invocation gets a tracker record") falsifies it — now "writes no simulation state", in the prompt and in the skill §2 twin that restated it · cold reviewer: approve-with-tightening · sweep: complete — both launchers (already compliant: "hint mode requires the partial solution only"), the standard, `simulation-block-open`/`-close` and every `.agents` mirror discharged against a quoted sentence, and `practice/simulations/` has no doctrine file yet to carry the claim · maps: `README.md` — the `/simulation-review` public-interface prerequisite cell and the family catalogue row; `_system-map.md` — the `simulation-grade` trigger cell — `29e8ade3`
- `REC-125` — **real defect, and it is one rule plus an unscoped verb rather than two rules**: `plan-audit.md`'s front matter and its Finishing gate said a specialist acceptance check still failing after its one re-dispatch "aborts without committing", while the check's own tail said "note the gap in the self-report and continue" — and Finishing's "ended the run in a failed state" named a state the file defined nowhere, so a sequential reader reaching the procedure first commits a plan one of whose slices cannot be shown to have been read whole. `continue` is now scoped to the **phase**: the remaining specialists still run, Finishing refuses the commit, and the close-out records the run `blocked` under `_agent-runtime-standard.md`'s "Runnable close-out contract", pointed at rather than restated. Why not `readme-audit`'s per-target exclusion, which the fix cites: the seven specialists all edit the one `PLANNING.md`, so excluding an unverified slice from the commit *is* not committing · `sql-plan-audit.md` took the same clause — its Phase 4 gate named an acceptance check whose own paragraph said continue, the `BLOCKED`-report branch having settled only its own class · cold reviewer: approve-with-tightening, and **all three must-fixes were written by the repair**: the batch path was left undefined (`PROJECT = all` hitting the new close-out clause at project 3 of 7 reproduces this row's exact shape — now the failed project is left uncommitted and named while the rest still run), the front-matter blockquote still said "aborts" against the body's new "continue dispatching", and the imported close-out rule silently reached the **author** acceptance check the fix had just routed to the commit — now declared a content acceptance gate that commits and still closes out `blocked`, with `steps-tests` named as the only one of the seven specialists that reads the brief · sweep: complete — `review-audit`, `readme-audit`, `roadmap-review`, `project-brief`, `interview-prep-audit`, `progress-update` and `sql-plan-prompt` each falsified against a quoted sentence: they carry a continue branch that no commit step names, and `interview-prep-audit` independently corroborates the disposition ("which is what `notes-audit` and `plan-audit` do"). `portfolio-audit` keeps its own reserved question about its ratio gate, untouched · maps: `README.md` — the `plan-audit` catalogue row, false in both halves after the fix, in the fix commit; `_system-map.md` unaffected, §10's labelled-commit class naming only `interview-prep-audit` and `portfolio-audit` · residue, not a row: `sql-plan-audit`'s Phase 3 history gate still says "abort without committing" with no close-out clause — asymmetric within its file, output-identical — `03dce9a5`
- `REC-126` — **real defect, and the row was right about the contradiction and wrong about which clause had to go**: `_plan-review-prompt.md` told every specialist to "read the whole plan for context" over six scopes the same file gives a tiered `Reading map`, and `plan-audit.md`'s acceptance gate then demanded `N lines, read to EOF` from all seven — a proof `_session-rules.md` owes only "for a file it had to read whole", which five of the six could not honestly give, so the gate was forcing a falsehood to buy an attestation the orchestrator cannot verify anyway. The whole-plan read is gone, the six rest on the trace they already owe (`checks owned: n` and exactly `n` rows — a read that stopped short of a section cannot produce its row), and `whole-plan` plus a standalone `SCOPE = all` keep the EOF line. **`branches-coverage` is the one scope the shrink would have exposed** and it carries its own line (`{n} lines · §23 read through line {n}`): §23 is the plan's last section, so a truncated read hands it a §23 that looks *missing* and its own row then orders it to add a duplicate — found by a reviewer asking what the deletion cost rather than whether it was justified · **four cold rounds, and the row's real lesson is about the rounds, promoted above**: every blocking finding in rounds 3 and 4 was written by the round before it, the sharpest a false assertion ("§23 sits past line 2000 on a real plan") standing where a true conditional had been, on a 1820-line plan whose §23 starts at 1781 — contradicting, on the first two steps of the task, the `wc -l` the same paragraph orders — and round 4 returned a closing token that was re-reviewed anyway · cold reviewer: approve-with-tightening, both tightenings applied: the paragraph heading no longer described its paragraph, and the launcher restated the component's reasoning where it needed the rule plus a pointer (`REC-064`) · sweep: complete — multiline over `notes/`, `.claude/`, `.codex/` for the EOF claim and its referents; `_review-flow-prompt.md` already tells the new story ("the source of truth, but **do not read it end to end**") and no site outside the fix carries the old one; `validate-prompt-system.ps1` green before and after (`REC-120`) · maps unaffected — `README.md` l.368/372 state the seven specialists, the acceptance check's existence and the per-scope reads but never the proof form, and `_system-map.md` §7 carries no report format — `78f10008`
- `REC-127` — **real defect in the stated reason, and the conclusion it supported was never wrong**: invariant 10's published limit said a plan review "cannot settle the sign-off *truth-value*" because `PROJECT-BACKLOG.md` and the drift report are things "neither of which any review scope reads" — false since `REC-099` gave `_plan-review-prompt.md`'s `whole-plan` the backlog (and the one file outside `PLANNING.md` any scope may edit) the day after `REC-093` wrote the clause. The limit now rests on what this file itself defines: *signed off* is defined **of the project branch as it stands**, so G3/G4/G7 turn on the backlog *and* on merge state no reading map supplies, and G6 on a drift report no scope reads at all — plus the boundary the row never saw, a standalone `SCOPE = all` run, which does hold the backlog while running this very invariant and is still short of both. G5 dropped from the backlog list: its closure box names the READMEs, and this file already separates a trigger from a sign-off · cold reviewer: approve-with-tightening — G5 falsified against its own box, a `there` re-pointed at the branch, and **the recitation of another file's scope table cut as the same class of claim that had just rotted**, which paid the growth cap on a 617-line file · sweep: complete — the claim is stated once; `plan-audit.md` l.284 ("read by no other specialist") agrees with the corrected text, and `_session-rules.md`, `_system-map.md` §7 and both §0 skills point at invariant 10 rather than restating its limit · maps unaffected — both maps already carried `whole-plan`'s backlog read and neither ever stated the limit — `dd577ffd`
- `REC-128` — **real defect, and only the wording was absolute**: `portfolio-audit.md`'s `▶ Run first` demanded §23's whole chain — `review-audit` (G3/G4), `readme-audit` (G5), a clean `progress-update` (G6) — of every run, while the same file's recipe B admits every project and calls an unfinished one's ❌ "expected, not an error", and `_portfolio-standard.md`'s Check 1 stops that project **before** the backlog is read. The block's own stated reason was already conditional, so the chain is now scoped to a project whose plan steps are all ✅, and the exemption answers §23's three reasons for the chain one for one: no backlog read at all, no CV bullet (Phase 3 skipped on ❌), and the single scan that still opens a README only downgrades a ✅. The absolute wording came from `0ea21949`, the 2026-08-12 adjudication this ledger already records as non-compliant with its four steps. Both alternative branches were falsified on disk and the reviewer re-falsified them independently: **ambiguity** — neither subagent prompt names the backlog, so Phase 1's saved-regardless bank supplies no non-verdict reason; **false positive** — Check 2's four stop states sit behind Check 1. Form taken from the family that had solved it (`REC-114`): `plan-audit`'s `▶ Run first (new mode only)` · cold reviewer: approve-with-tightening, three applied, and the one that mattered was measured rather than argued — `§15` is not Check 1's own locator and projects 01–06 carry no `### 15.` heading at all, so six plans fell straight to the boundary clause; the scope now reads "Section 0 or its steps list", plus a clause stating that a ❌ ticks no G7 box (no §23 fork) and an `it` given its antecedent · sweep: complete — every other statement of the chain is the producer→consumer relation and not the launch precondition, which is `REC-137`'s safe-consumer test: `readme-audit`, `review-audit`, `_readme-standard.md`, `_session-rules.md`, `plan-audit`, `07-timetrack/PLANNING.md`'s verbatim §23 copy and four map rows, each falsified against a quoted sentence; both launchers defer to the prompt and restate nothing (`REC-149`); `validate-prompt-system.ps1` green before and after (`REC-120`) · maps: `README.md` — the `/portfolio-audit` catalogue row's Run-first cell, in the fix commit; `_system-map.md` unaffected, its chain rows describe a *built* project's route — `c30024a4`
- `REC-129` — **ambiguity, and the row's stated harm was false**: `_portfolio-standard.md`'s opening placed G7 "after G5 (`readme-audit`) and a clean G6 (`progress-update`)" and left G3/G4 out, but it could not "authorize portfolio work before two required gates" as the row claimed — it is a *placement* sentence in "What the portfolio gate is for" that no consumer reads to decide whether to run, it already pointed at §23 as owner of the gate order and every trigger, it matched §23's own G7 trigger cell ("After G5 **and** G6") in substance, and the same file's Check 2 stops the gate on the four `Last Reviewed` states while the verdict itself blocks on unfixed Highs — both halves of G3/G4, operative. What was real is the two-gate picture a reader of this file alone formed, against `portfolio-audit.md` l.21-24, `README.md` l.255 and the sibling placement sentences in `_review-standard.md` and `_readme-standard.md`, which all name their upstream. **The row's "restore the full chain" branch was refused as the trap**: restating the chain as a prerequisite here would fork `REC-128`'s scope — the chain binds a project whose plan steps are all ✅, and that qualifier lives in `portfolio-audit.md`'s `▶ Run first` — so the fix quotes §23's chain verbatim (`fix the Highs` node included, `od -c`-verified against l.474 after `REC-093` misquoted it once), says in bold that it places the gate rather than stating what a run owes, points at `▶ Run first` for the scope and at Check 2 for where G3/G4 actually bites · cold reviewer: approve-with-tightening — one applied: the prose gloss sat behind the same colon as "quoted from the file that owns…", so "then a clean `progress-update`" could be read as §23's wording, which is `REC-093`'s genre; the quote now closes before the gloss opens with "That is," · sweep: complete — all ten `G7` sites classified by reading and every one falsified against a quoted sentence, §23's own compressed trigger cell included (its Why cell names G3/G4 and the hard chain sits three lines below), the two `step-complete` adapter mirrors `diff`-clean · residue, and not a row because the file is not ours (scope test 2): `projects/07-timetrack/PLANNING.md` l.1801 words the G6 rationale as "because it reads PROGRESS" where §23 l.475 says "because G7's CV bullet is reused as-is by `cv-prompt`, which does read PROGRESS" — a drifted rationale outside the closure checklist, so §23's verbatim rule does not catch it; owed to that plan's writer · maps unaffected, both verified — `README.md` l.382's cell describes the file's contents and its two writer cells are `—`, and `_system-map.md` has no row for this file at all, its chain rows already carrying G3/G4 — `29b8d899`
- `REC-131` — **real defect, and the terminal effect the row asked for was the wrong one**: a questions-vs-decisions ratio still below 1 after its one retry is a failed **content** acceptance gate, so `_agent-runtime-standard.md`'s close-out contract already barred that run from `completed` — but `portfolio-audit.md` bound only its `BLOCKED` shape to the `blocked` tracker outcome and *parked* the ratio shape as "an open question this prompt does not get to settle in passing", which reads as a licence to close out `completed`. Both shapes now record `blocked` mode-neutrally and carry a commit-body label (`uncovered decisions` beside the two `blocked — partial` forms), the bank having no fingerprint and `/simulator` reading the folder ungated, so that label and the tracker cell are the only marks either shape leaves on disk. The row's other half — that the failed check should reach the **verdict** — is a **false positive**, now refused in writing: `_portfolio-standard.md` computes the go/no-go from PLANNING.md, then the backlog, then its two sanity scans, none of which reads the bank, and wiring a thin bank into it would make recruiter readiness depend on how this prompt's own subagents performed. The design came from the family that had already solved it (`REC-114`'s corroboration rule): `interview-prep-audit`'s two-shape paragraph, whose closing clause — the tracker carries **both** shapes — is precisely what portfolio's otherwise near-verbatim copy had dropped · cold reviewer: approve-with-tightening, five findings, **and the sharpest was written by the fix** — the new outcome rule was placed inside the `{DRY_RUN} = false` paragraph of a prompt that prescribes `DRY_RUN = true` for the first run, leaving `dry-run` standing as the outcome of a run that failed a gate; it also caught a pointer scoping a word (`continue`) the gate does not contain (`REC-086`), the rule stated three times over two paragraphs, and a "two checks" summary of the verdict falsified by the standard's own README-placeholder scan · sweep: complete — twelve gate paragraphs classified by reading, not by grep; `interview-prep-audit`, `plan-audit`, `sql-plan-audit`, `sql-plan-prompt`, `coverage-prompt`, `project-brief` and `notes-audit` compliant, and `readme-audit`, `roadmap-review`, `progress-update`, `review-audit` falsified as sites on a stated discriminator — a site is owed only where the file *states* that a failed gate leaves the close-out alone, as the deleted paragraph did; silence inherits the standard · incidental that cleared the bar and was opened as `REC-146` rather than fixed here: `review-audit` drops a failed slice into the chat summary while stamping `Last Reviewed` per **tier** · maps: `_system-map.md` §10 — the two shapes differ in the freshness marker only, both reaching the tracker cell and the commit label, in the fix commit; `README.md` verified unaffected, the commit still happens and no writer, artefact, schedule or inventory moved — `37be7a02`
- `REC-132` — **real defect, and the object is an idiom rather than a sentence**: "the orchestrator owns the commit" is a fixed phrase in this system meaning the orchestrator **executes** it — true in the plan and portfolio pipelines, which auto-commit, and false in `readme-audit`, the only one that never commits its product. So the row's false-positive branch is refuted rather than dismissed: no definition of the phrase meaning *handoff* exists anywhere, and all five sibling uses mean the opposite. `git show 36449ba8` — the readme decomposition, `REC-100`'s own commit — shows `_readme-write-prompt.md`'s header ("hands Victor the commit") and its body ("owns the commit") born together, the plan-family sentence carried across; the body now matches the header and points at `_readme-standard.md` → "Summary + commit rule", which owns why this pipeline declines the permission it has · **both sweep sites came from the cold reviewers, and both were `REC-099` and `REC-100` residue of the same shape** — a fix that corrected a body and left an intro, the rule this row promotes: `_plan-write-prompt.md` l.5 and l.11 still handed the plan commit to the *reviewer* against its own l.45 and three quoted sentences elsewhere (`06cca32f`), and `interview-prep-audit.md` justified its sequential-topic loop by "each topic's reviewer commits" against its own l.209 and l.354 (`03038ac8`). Each was verified against a quoted sentence before being worked, and each landed in its own commit · cold reviewer: approve-with-tightening, over three passes — pass 1 `approve` + `sweep: incomplete`, pass 2 `approve-with-tightening` + `sweep: incomplete`, pass 3 clean; the one tightening it left was an under-specification the fix inherited rather than wrote, the plan author's suggested-commit line saying nothing about the standalone path where no orchestrator exists · sweep: complete — the notes family discharged as the one place a *reviewer* legitimately commits (`_notes-review-es-prompt.md` l.133), plus portfolio, plan, review, progress-update, both launcher catalogues and every skill mirror, each against a quoted sentence · maps unaffected, ruled row by row: `README.md` l.252/l.366/l.368/l.370/l.371/l.373 and `_system-map.md` §7 were already correct, which is itself evidence the prompt bodies were the stale half — `e3384566`
- `REC-133` — **real defect, and the row understated it**: the flow reviewer's verbatim config-line rule demanded the value of a hardcoded secret in the same Finding cell its own redaction rule forbade, and its consequence clause ("you have not read it and the finding does not exist") made the redacted half *unreportable* rather than merely unquotable, so neither reading could file a real exposed secret. The verbatim rule is now named and carries a **secret-value form** exception — the key quoted exactly plus *literal, not `${ENV}`*, which is the whole evidence the 2026-07-14 false High turned on — and `review-audit.md`, which writes and commits `PROJECT-BACKLOG.md` and carried neither rule, strips a value on arrival across all three of its committed outputs · **the cold reviewer returned `revise`, and both of its worst findings were written by the repair**: the replacement example `ddl-auto=update` is the value `_review-standard.md` l.243 blesses, so the fix modelled a compliant line as an offending one, and the discharge clause's "the paragraph above" resolved to the 2026-07-14 blockquote instead of the rule it discharged — `REC-086` again, the original defect revived through a pointer · `_review-security-prompt.md` and `_review-standard.md` were measured and left untouched: the security reviewer carries only the redaction half and is internally consistent · cold reviewer: approve-with-tightening, both tightenings applied · maps unaffected — neither map states either rule (`README.md` l.370-373, `_system-map.md` l.254) · `d1b610a6`
- `REC-134` — **real defect, and the row overstated its reach**: `review-audit.md` is right at both of its sites — Step 5's merge bullet and its Hard rule already file only a *confirmed* security finding as High and name the Medium "decide and document" — so the merge was never unconditional and no design ambiguity could reach the backlog as a vulnerability that way. What was false was the **dispatch document the reviewer reads**: `_review-security-prompt.md`'s intro said its table merges "as **High** tasks", contradicted by its own output block asking for a `Severity (High/Medium/Low)` column, most severe first — a column governed by nothing, so the reviewer graded against a rule that did not exist and the orchestrator's stated *override up* case lost the signal it arbitrates from. Intro and Severity cell now point at `_review-standard.md`'s **What "confirmed" means**, which sits inside the one section this reviewer's own read boundary already admits (`## Security scope — the cold pass` l.278; the test is its `###` at l.290), so nothing widened and the rule stays stated once in the standard (`REC-064`); the sibling `_review-flow-prompt.md` l.78 already said it ("leave the severity to the orchestrator — only it has read the whole plan") and is the shape the fix copied · **this is `REC-132`'s intro-vs-body rule in a second family** — the body was right and the first ten lines were the stale half — so it promotes nothing new · `_review-standard.md` l.28 and `review-audit.md` l.8–9 ("a security **hole** found here becomes a **High** task") were measured and deliberately **kept**: a hole is a confirmed vulnerability, neither is a dispatch document telling a reviewer what its own rows become, and each file states the test in its own body (l.317, l.478) · cold reviewer: approve, no tightenings · sweep: complete — the reviewer widened the term list to `.codex/` and re-ran it multiline, discharging both launcher catalogues, every skill mirror in both adapters and `_session-rules.md` l.54 against quoted sentences · maps: `README.md` — the `_review-security-prompt.md` catalogue row's "(each a High backlog task)", the same false claim one register out, in the fix's own commit under the change trigger; `_system-map.md` verified unaffected over a whole read — it carries no row for this reviewer at all (it writes no file, only returns a table), and §4/§11's "fix every High" is a claim about the backlog · residue, recorded rather than opened as a row: the intro's "the only reader holding the whole plan" is `_review-standard.md` l.311 and `_review-flow-prompt.md` l.78 verbatim while `review-audit.md` l.106 says the orchestrator never reads the full source — a three-site justification clause of `REC-127`'s class, failing bar condition 3 here — `9b2fc805`
- `REC-135` — **real defect, and the row was right about the clause and wrong about who owned the rule**: `progress-update-prompt.md` contradicted itself from birth (`2417c25d`, the REC-039 demotion) — its ownership table said “**this prompt** (the whole table)” while D7, in the same commit, said “`Practical evidence`: **preserve, then add** … the one cell of the matrix you share”. D7 was already correct and stays the single full statement of the rule (`REC-064`); what was fixed is every **restatement** of the ownership — the prompt's intro, its ownership-table row, `_session-rules.md`'s demotion bullet (now naming the three cells by their real column headers rather than paraphrasing them, `REC-074`) and `_system-map.md` §8, whose *preamble* carried the same whole-table claim in a second grammar (“It writes one table”) directly above the row a prior session had already corrected · **the enforcement half was un-owned and is the row's real cost**: Step E's diff check, “the mechanical guard behind the whole ownership contract”, passed any hunk falling inside the table — including one deleting a ritual's evidence entry — so the partition it now enforces was unenforceable (`REC-148`'s shape: a gate testing that the edit stayed in its section, never that it kept what it must preserve); folded into the existing sentence as one clause, funded one-in-one-out by deleting D5's spent `REC-136` paragraph, which the same file already carries as a clause at l.135 · **both of the cold reviewer's factual findings were written by the fix, and both were the same over-claim**: “the one cell **in the file** with two writers by design” and “the **file's** one deliberately shared cell”, each falsified by a sibling row of the very table it sits in (`Coverage demonstrated` has four writers by design) — the owner had scoped it to *the matrix* and both copies widened it to *the file*, promoted as `REC-040`/`REC-082`'s third instance · `README.md`'s four “writes only `Professional level by topic`” sites, both skills (mirrors byte-identical) and `PROGRESS.md`'s own prose were measured and deliberately **kept**: each bounds the claim outward, all stay true under the partition, and forking the partition into four derived sites is what `REC-064`/`REC-111` forbid · cold reviewer: approve-with-tightening, four tightenings applied verbatim · sweep: complete — the reviewer re-ran the term list multiline past the measured set and discharged eight further files (`_planning-standard.md` and `07-timetrack/PLANNING.md` G6, `coverage-prompt`/`coverage-audit`'s prohibition on a *different* writer, and five read-scope lines) against quoted sentences · maps: `_system-map.md` — §8's preamble and its `## Professional level by topic` row, in the fix's own commit; `README.md` read whole and verified unaffected — `ea2fb69a`
- `REC-136` — **real defect, and the row named the narrower half of it**: `PROGRESS_HINT` — the `Status` cell of the audited project's own row, quoted verbatim into the step-status subagent's launch instruction — could *override* the `✅` markers, but the `No ✅ anywhere` branch was circular more completely still, taking the whole status from that cell; either way D5 compared a fact with itself. The cost was exact rather than theoretical: the override fired precisely on the case D5 declares it exists to catch — "a plan missing a `✅` is a `PLANNING.md` fix" — so that drift row could never be written, and G6 plus SQL G3 close on an **empty** report. The hint is deleted under a tombstone, `PROJECT_PATH` is the whole subagent input, `not derivable — no ✅ markers in PLANNING.md` is a third return, and D5 branches it against the row · **both rounds' worst findings were written by the fix**: the first draft reported *any* unmarked plan as drift, opening a row no owner can clear for a project between `plan-audit MODE = new` and its first step close — and under `MODE = all` an unrelated project would have held SQL G3 open; the second round then caught that tightening reaching two of the three sites naming the return, leaving Step A stating the unconditional rule it had just replaced · cold reviewer: approve-with-tightening over two rounds, nine tightenings applied verbatim (the second reviewer died on a session limit and was resumed from its transcript rather than re-dispatched) · sweep: complete — the fourth site was `step-complete`'s `SKILL.md` in both adapters, whose "reads ✅ before falling back to hints" wrapped across three lines where no line-oriented grep returns it (`REC-117`'s lesson, again); `plan-audit`'s history snapshot and `_plan-review-prompt`'s marker reconciliation read the same `✅` and never `PROGRESS.md`, discharged against quoted sentences · maps unaffected — no writer, schedule, file or inventory moved; re-tested over both maps by the second reviewer rather than inherited · residue, none of it output-changing: Format A asserts its own status from the format, so its D5 comparison is vacuous by the same shape at far lower stakes (01–06 are closed); Format C states no no-marker rule, so from project 08 the branch's population falls back to the generic D5 comparison; and no `_planning-standard.md` invariant requires a completed step to carry `✅`, so the sole source is now a convention only `_session-rules.md` and the skill state · `4835baec`
- `REC-137` — **real defect, and the row named a site where the rule was the thing broken**: `roadmap-review`'s `▶ Run first` was the symptom; the fork sat in one bullet of `_session-rules.md`, which enumerated **eight** points at which `progress-update` is due — G6, SQL G3 and the `▶ Run first` of six prompts — and then closed with "**Both gates** close on an empty drift report", leaving six prerequisites satisfiable by the run having *happened* while the report named stale sections those prompts read as fact. `REC-065`'s shape with the narrow half moved off the trigger and onto the terminal condition, where it reads as a summary of the enumeration above it (promoted). Fixed at the owner and at the one site whose own text stopped a word short; `simulation-plan`'s `▶ Run first` stays outside the count on the bullet's own word, *scheduled*, its prerequisite being conditional · **the reviewer caught a defect the repair wrote and two sites the sweep missed**: `_system-map.md` was told `_session-rules.md` "owns **and counts**" those prerequisites, which `simulation-plan` falsifies — `REC-055` in the file that declares itself derived, twice, since the §7 cell then restated the rule it had just been told to point at — and `cv-prompt` + `cover-letter-prompt` carried "(so `PROGRESS.md` is current)" from 2026-07-07, a month older than the demotion that made it false, which is the second rule promoted from this row · cold reviewer: approve-with-tightening over two rounds, six tightenings applied verbatim; `linkedin-prompt`, `project-brief-prompt`, `plan-audit`, `portfolio-audit`, `simulation-plan` and `progress-update-prompt` l.443 each **falsified** as sites against a quoted sentence rather than assumed clean · sweep: complete · maps: both, in the fix's own commit — `README.md`'s run-first cells for `/roadmap-review`, `/cv` and `/cover-letter` (its l.236 contract makes that cell a restatement of the header), `_system-map.md` §10's drift-report bullet and §7's `_last-drift-report.md` readership cell · residue: `_application-standard.md`'s "every concept learned" is a different defect against a different owner and is `REC-147`, not carried here · `eadf8633`
- `REC-140` — **real defect, and the row named one of its two halves**: `log` mode read `tracker.csv` and appended unconditionally, and the *same* missing check sat in its folder step, where a rerun would have started an `outcome.md` over an existing one — rule 4 promises "never duplicates folders **or** rows", so the folder half breached rule 2's "never … rewrite `outcome.md` history" as well. An application is now identified by `empresa` + `puesto` — the pair `update` mode's row match and the folder name already used — resolved against every row **and** every folder before any write, branching three ways: the same application logged twice writes nothing and is routed to `MODE = update`, a deliberate re-application is admitted under a dated folder, and a row without its folder (or the reverse) is repaired as the half-written earlier run it is. The ambiguity branch was rejected because rows and folders are only ever created through `log`'s flow, so excluding its reruns would leave rule 4 with no subject · `_application-standard.md` was measured and left untouched — **a real site, falsified as a settling authority**: it never mentions rows, folders or identity, states that "`/cv` and `/tracker` write only the output paths their own prompts declare", and is read by five prompts, so the key stayed in the file that owns the CSV (`REC-064`) · cold reviewer: approve-with-tightening — **both blocking findings were written by the fix**: the dated folder was left **write-only**, since `update` step 5 still hard-coded `applications/<empresa>-<puesto>/outcome.md`, and `log` step 5's own parenthetical re-stated the undated shape, so a re-application would have reused the first folder and merged two histories into one file, which is precisely what the branch promised to prevent · sweep: complete — both launchers are unchanged (`update` still "needs `EMPRESA` and uses `PUESTO` only to disambiguate"), `analyze`'s glob over "every `outcome.md` under `applications/`" picks dated folders up unchanged, and `cv-prompt.md` writes *files* `empresa-puesto.md` there rather than folders, so the identity scan cannot collide with them · maps unaffected — neither map states a folder-naming contract, and no file, writer, schedule or inventory moved — `52651df8`
- `REC-142` — **real defect, and narrower than the row: the numbered order was never wrong**. Step 3 of `_single-shot-self-report.md` commits report + tracker and Step 4 re-commits with the applied hash — not opposite sequencing but a lost joining word. `802d5518` wrote "commit the report **again**"; `bac82378` (2026-07-24, subject: adding the tracker to the close-out) deleted *again* and appended "when no prompt edit is approved, commit the report plus tracker as the run record", restating Step 3 as if it had not run and, on the path it named, ordering a commit of an unchanged tree. Step 3 stays first on three things measured against disk: the sibling contract does the same in `## How to commit it`, twelve consumer prompts restate it as "its own commit, then the refinement step", and the early commit is what keeps the run record on disk when Step 4's reviewer dies. Both contracts now state the refinement commit as a **second, report-only** commit carrying the `Status:` line and the reviewer verdict, tracker staged only if that step changed it, and name what the no-edit path still owes · **the sibling was widened into on quoted evidence, not analogy** — `git show bac82378 --stat` shows one commit changed both files · cold reviewer: reject, then approve-with-tightening. The reject was the repair's own and is promoted above: "nothing is committed here" was false on the path it named, stranding a report Step 4 had just written the failed condition and `cold reviewer:` line into. Four tightenings applied — the reviewer verdict and a bar-rejection `Status:` added to what the re-commit carries, the null path stated explicitly, and the pipeline's `git show --stat HEAD` two-file check anchored to the commit its own section instructs rather than to `HEAD` after refinement · sweep: complete — the twelve single-shot consumers and the three pipeline consumers read whole with idiom scans, no restatement falsified; `evidence-intake-prompt.md`'s early tracker-alone commit is pre-existing and untouched, so it was opened as `REC-153` rather than folded in · maps unaffected, both verified — `_system-map.md` §7's `_last-run-report*.md` row and §10's first bullet describe the universal close-out commit, which is untouched, and §12 step 6 already contemplates a later report-only write; `README.md` l.306-311 states the close-out's steps, never its commit shape — `e493a4bd`
- `REC-146` — **real defect, and neither terminal effect the row named was the one owed**: the close-out half was already inherited — `REC-131`'s sweep had falsified `review-audit` as a site on its stated discriminator (silence inherits `_agent-runtime-standard.md`'s close-out contract, and Step 5's coverage check *is* a content acceptance gate), and Step 6 says its tracker cell "is an execution record, not review state — the gate reads the backlog's per-tier lines and never this cell"; the ambiguity branch (`Last Reviewed` = "a run happened") was refused against the standard's own "the only run worth stopping is one over code a reviewer has already read". What was un-owned is the **stamp**: the tier line takes a fourth form, `(incomplete — «slice(s)» not reviewed)`, written by the run that lost the slice to its one re-dispatch, read by the gate as unreviewed code so the next run re-reads it without FORCE, and cleared only by a run that covers it. The design came from the family's own discriminator (`REC-114`'s corroboration rule): `interview-prep-audit` stales its freshness marker over bytes nobody finished and never over merely under-covered content, and a slice nobody read is the first shape — while `notes-audit`'s "never mark a partially verified file complete" licenses *not advancing* a marker, never stamping anyway · the token was renamed `partial` → `incomplete` because "partial run" already means a tier-scoped run six times in the same file (`REC-074`) · cold reviewer: approve-with-tightening, **and two of its three blocking findings were written by the fix** — the all-slices-fail boundary, now promoted as the added-exception rule, and a justification claiming the tier line is read "to G7", false: `portfolio-audit` reads the backlog's existence and its open Highs, and `Last Reviewed` returns zero hits in that whole family · sweep: complete — the twelve twice-failed-acceptance branches classified by reading: `readme-audit` excludes the target from the commit, `plan-audit` and `sql-plan-audit` refuse to commit, `notes-audit` leaves its plan entry `pending`, `portfolio-audit` has no marker to qualify; `review-audit` was the only member holding a freshness marker its **own** next-run gate reads · maps: `_system-map.md` §10 — the third shape, whose mark rides inside the committed artefact and therefore owes neither a commit label nor a `blocked` cell, in the fix commit; `README.md` verified unaffected, its `Generates / updates` cell already naming the per-tier lines · residue opened as `REC-148`: §23 and `portfolio-audit`'s `▶ Run first` still let a qualified tier tick G3/G4 · `1d86e07b`
- `REC-148` — **real defect**: §23's G3/G4 boxes and `portfolio-audit`'s `▶ Run first` both closed on `review-audit` *having run*, which a tier stamped `(incomplete — «slice» not reviewed)` satisfies — so G5/G7 could proceed over code nobody opened and G7's verdict be computed from a backlog short by that slice's findings. Fixed at the owner (§23's *signed off* sentence, both checklist boxes, and its `**Pass:**` line, which now requires each box to carry this standard's own wording, since a count of nine cannot see a plan holding a stale copy of a condition that has since been tightened — `_plan-review-prompt.md`'s `branches-coverage` row is the catcher) and at the four readers of the line: `_portfolio-standard.md` Check 2 stops on the four unreviewed-code states before a single task is counted, `portfolio-audit.md` prints no verdict on a stop, and both §0 rituals read the tier lines to derive and qualify `Next gate` — `backlog-task-close`'s “only this ritual can see” becoming false in the same edit. `_review-standard.md`'s three stamping shapes are quoted, never re-derived (`REC-093`); the rule that a gate reads the **stamp** and asks for *that run's date* rather than for the qualifier is promoted · cold reviewer: approve-with-tightening, three tightenings applied verbatim — Phase 3's skip condition still named only ❌ so a stop would have written CV bullets it was then told not to print, the stop branch's commit ignored `DRY_RUN` on the very run recipe A makes dry, and Check 2's “reused rather than restated” misdescribed its own sentence; eight sweep candidates falsified against quoted sentences · sweep: complete · maps: both, in the fix's own commit — `README.md`'s `/portfolio-audit` run-first cell and its `PROJECT-BACKLOG.md` reader bullet, `_system-map.md` §4's chain line, §7's backlog row, both §9 skill rows and §10's loss-mode bullet, now naming four kinds of reader · residue, below the incidental bar: G2 is skipped when a plan's §15/§22 never move, so a drifted checklist box can sit until a standalone `plan-audit MODE=review`, which is Victor's call — `ac3adb02`
- `REC-149` — **real defect, and the fix would have shipped inert**: `coverage-verify` Step 2 rejected a gap as "belongs to another topic" and the concept vanished, while `_coverage-standard.md`'s `## Topic isolation` requires any run that discovers another topic's concept to route a proposal to `_cross-topic-inbox.md` — both siblings already declared that file as source, as output and as a separate commit, so the disposition was a family comparison and not a ruling (`REC-110`'s promoted rule, second use). Disk proof the write had already happened outside every declared contract: the Lombok entry stamped `Spring Boot junior coverage-verify, 2026-07-27`, committed alone in `5c808081` against a Step 4 reading "stage only `FINDINGS`". Fixed by routing what Step 2 rejects on ownership **alone** — bounded so a concept also failing presence or specialisation is still dropped, and so a routed proposal never enters `FINDINGS` nor moves `Verdict`, exactly as the file's own locked-placement-conflict rule does not — by rebuilding Step 4 on the siblings' "stage only declared paths", and by scoping the inbox contract's three "a run" bullets to their real populations · **the reviewer's third finding is the row's real cost and is promoted**: the routing had a destination and no channel, since the reviewer mandate forbids reporting another topic's items and its acceptance proof demands same-topic gaps, so the very entry the row rests on could not have been produced by a compliant run; answered with an `ownership referrals` list beside the gap list, re-verified against the registry in Step 2 because a referral is the reviewer's claim and not a verdict · second promoted rule, from its round-2 finding: closing the inbox's loose writer list made **both** map cells false by omitting the by-hand boundary-change writer `_topic-ownership.md` mandates · cold reviewer: approve-with-tightening over two rounds, five tightenings applied verbatim; both launchers were sweep sites and each stated the closed output set twice, which promotes `REC-132` across the adapter boundary · sweep: complete — re-enumerated with `rg -U --hidden` over `.claude/`, `.codex/` and `.agents/`; `backlog-task-close` attributes the write to the skill it calls, `step-complete` and `coverage-mark` never mention the file · maps: both, in the fix's own commit — `README.md`'s inbox catalogue row plus the `/coverage-verify` catalogue and public-interface cells, `_system-map.md` §3's durable-edge line and §7's inbox writer and reader cells · incidentals below the bar: `coverage-bullet-add` declares the inbox write but its `## Commits` section covers no routing-only run, and §10 carries no leave-behind bullet for a pending entry nobody consumed — `378cd61d`
- `REC-150` — **real defect, and the mandate the false clause defended was never wrong**: `_notes-review-prompt.md` told stage B the `es/` "has **not been created yet** (T runs after you), so there is nothing bilingual to check and no `es/` to open" — false on three reachable paths, of which the row named two; the third settles it, since **Stage A, immediately upstream, is told to read that same `es/`** for Victor's TODO markers, and B's own reading list opens an `es/` calibration file sixty lines below the sentence denying there is one, so the false-positive branch was unavailable · guard 13 was **not** a site (it reports a no-op and never dispatches B) while guard 14 runs the whole pipeline over a pair it has just verified exists, and an `Action: audit` entry normally has one because `notes-plan-prompt.md` decides `Action` from the English file alone and states outright that "a missing Spanish file does not change `Action`" · `git log -S` dated the clause to `69cacb4d` (2026-07-09, the four-stage split, when only `create` existed) against `0e4ea888` (2026-07-29) for `refined`/append-only, which makes the fix a **restoration** and not a ruling (promoted above as the justification-vs-mandate rule): the temporal fact replaced by the ownership holding on every path — parity is T's deliverable, Spanish prose is C's, and under `SCOPE = append-only` a diverging `es/` is Victor's freeze — adding B no obligation, which was the row's own load-bearing worry · **both rounds' findings were fresh unqualified tree-facts written by the repair** (promoted into step 3): stage A "is required" to read the `es/` when its Step 1 is skipped in append-only, and "on a `create` entry the `es/` does not exist" when `Action` turns on a different file · the sweep site was the same file's **second statement** of the contract — l.131's create-only "produces the `es/`" against T's own two-case "produce (or re-sync)" — which is `REC-132`'s intro-and-body rule landing inside the file the fix had already edited · `validate-prompt-system.ps1` green as a step-1 instrument before the dispatch (`REC-120`) · round 2 died on a session limit with an empty scratch and was resumed under the runtime standard's ladder, returning on the second attempt · cold reviewer: approve-with-tightening over two rounds, four tightenings applied · sweep: complete — `rg -U` over `notes/prompts/`, `.claude/`, `.codex/` and `.agents/`, every candidate discharged against a quoted sentence and the three adapter directories naming this stage nowhere at all · maps: `README.md`'s stage-B catalogue cell, in the fix's own commit; `_system-map.md` unaffected, verified rather than declared — §7's `en|es` writer row makes no claim about the `es/` existing at stage B — `adcf498a`
- `REC-152` — **real defect, and the row's own first branch is what had to be refuted rather than applied**: `simulator-prompt.md`'s `### topic` starting question and Step 3's order rule 1 both assign position 1, which is a **rank** and not a second dimension, so `REC-123`'s dimension test does not dissolve this one and the ⭐⭐⭐ reading was simply false wherever an Open `simulator` row mapped to a lower tier — Step 4's "Open with the MODE starting question" is what makes the collision reachable rather than theoretical (promoted above as that test's converse) · the mode line was a **partial restatement**: rules 2–3 verbatim, rule 1 omitted, which is why it read as correct for as long as it did, and it also named nothing on the path neither clause anticipated — a selected scope holding no ⭐⭐⭐ at all · fixed as a `REC-064` de-fork and not as a precedence ruling, the block now stating only what Step 3 cannot say (*this mode has no opener of its own*) and deferring for the rest; rule 1 was deliberately left unqualified by mode and Step 3 was not edited at all · family measured before the edit and both siblings had already solved the shape (`REC-114`, third use): `hr-screen` and `code-review-practice` each subordinate their intake with an explicit clause and neither carries a second statement of first-question selection, and both launchers state prerequisites and turn-taking only, so the four other sites were verified and discharged rather than swept · the reviewer's one tightening cut the fix's own second sentence, which had made `### topic` the sole site of a claim about **full** mode (`REC-055`) — one round, no blocking finding · `validate-prompt-system.ps1` green as a step-1 instrument before the dispatch (`REC-120`) · cold reviewer: approve-with-tightening · sweep: complete · **maps unaffected**, verified rather than declared: `README.md` l.410's "ranks durable weak areas first" was falsified in topic mode *before* this fix and is uniformly true after it, so no cell moved, and `_system-map.md` states no simulator ordering anywhere — `28e95d68`

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

**`REC-118` led this order and closed 2026-08-13, and what it cost was not the edit** — one clause in
one prompt — **but establishing which of four files was the fork.** The row arrived asserting two
writers of one marker; there is only one, and the sweep that proved it (the review branch, the plan
audit, the route, and the exercise file on disk) is also what made the fix a two-line correction and
raised the residue and the adjacent row below. Where a `contradiction` row names two producers of one
artefact, count the producers first: if only one writes, the other clause is prose about the writer,
and prose is corrected against the writer, never reconciled with it.

**`REC-136` led this order and closed 2026-08-14, and what it cost was not finding the circularity** —
the row arrived with both clauses quoted — **but the two branches the fix itself opened.** A `contradiction`
row whose defect is a *value flowing the wrong way* is cheap to locate and expensive to repair, because
the repair has to define what the auditor does when the value is simply absent, and that definition is
new machinery no reviewer has seen. Both rounds' blocking findings were there and not in the deletion.
Where a row names a circular input, budget the branch you will have to invent, not the clause you will
delete.

**`REC-140` led this order and closed 2026-08-14, and what it cost was not the guard** — one identity
pair, already in use twice in the file it was missing from — **but the second write path the row never
mentioned, and the reader the guard's own new folder name did not have.** An idempotency row names the
artefact whose duplicate somebody imagined; the promise it quotes is almost always broader, and the
promise's other nouns each have their own creating step in the same mode. Read the nouns of the promise
first and take one site per noun — then check that whatever new name the fix introduces is consumed
somewhere, not only written.

**`REC-114` led this order and closed 2026-08-14, and its sweep held while the reason it gave for
holding was false.** Step 1 had concluded "no other prompt narrows write depth inside a shared
author→reviewer chain"; the reviewer found one immediately (`notes-audit`'s `append-only`) and it was
**not** a site, because that family declares the key in each downstream component's own config — it had
already solved the shape. A "this is the only site" conclusion is therefore two claims, and only one of
them is load-bearing: look for the family that solved it *before* designing the fix, because it hands
you the design and it is the corroboration a novel-looking fix otherwise has to do without.

**`REC-121` led this order and closed 2026-08-14, and what it cost was neither the edit nor the sweep** —
ten files, a moved blockquote each — **but classifying a family the row had described three members of.**
Nine of the twelve were defective, three had already solved it, and the sweep's entire risk sat in
telling those apart: one of the three compliant files was invisible to every grep for the defect's
wording, so a sweep that trusted the grep would have "fixed" a correct file. Where a row names a few
members of a family, price the classification of the whole family, and enumerate it from something that
*defines* the population rather than from the words the defect happens to use.

**`REC-125` led this order and closed 2026-08-14, and what it cost was neither the analysis nor the
sweep** — the contradiction was two sentences apart and the join that defines the population is
greppable — **but the three sites the fix's own new sentence went on to govern.** Scoping a verb is
cheap; importing the standard that scopes it is not, because the imported rule then binds every sibling
gate, every mode of the loop the clause sits in, and the older sentence that said the opposite word.
Where a row asks for one terminal outcome, price the re-reading of every branch that outcome now
reaches, not the clause you will rewrite.

**`REC-131` led this order and closed 2026-08-14, and the row was half right in a way the four-step
procedure is built to catch.** Its finding named a terminal effect the machinery genuinely lacked and
pointed it at the **verdict**, where it would have made a project's recruiter-readiness depend on how
well the prompt's own subagents performed; the effect it was actually owed — the close-out outcome — was
already ruled by a shared contract two files away, and the prompt had *parked* it. Where a row says a
failed check has no terminal effect, the question to answer first is **which** terminal thing it should
reach, because a row is as routinely wrong about that as it is about where the defect lives.

**`REC-137` led this order and closed 2026-08-14, and the row was pointing at a symptom.** It asked for
a stop in `roadmap-review`; the missing stop was one word in `_session-rules.md`, six prompts wide, and
the site the row named was merely the only one whose prose stopped short of it. What the row cost was
neither the owner sentence nor that site — both are one clause — but the sweep, and the sweep's value
was entirely in the two members the row's own framing hid: consumers whose `▶ Run first` described the
producer's *result* rather than naming the producer, written before the producer was demoted. Where a
row says a prerequisite has no teeth, resolve the **rule** first and then read every consumer for what
it promises that prerequisite buys — the ones that merely name the producer are the safe ones.

**`REC-146` led this order and closed 2026-08-14, and what it cost was neither the analysis nor the
sweep** — the two files the row named settled it, and the twelve twice-failed-acceptance branches were
already classified by two earlier rows — **but the fact that the fix had to invent a *form* rather than
choose a branch.** Both terminal effects the row offered were unavailable: one was already inherited by
silence, the other refuted by the owner's own sentence, so what was left was a new value in a field
three prompts read. Two of the cold reviewer's three blocking findings were written by that new form —
its boundary case and a false claim about who reads it. Where a row's stated dispositions all fail,
you are not choosing between them any more; price the design, and price the *consumers* of whatever
you invent, because a value is only as safe as the readers you have actually enumerated.

**`REC-148` led this order and closed 2026-08-14; the analysis was cheap and the *branch* was not.** The
claim to correct was two sentences, their owner was named in the row, and `REC-146` had already put the
artefact the fix needed on disk. The cost sat in what a corrected gate has to do when it now fails:
`portfolio-audit` had no stop that was not a verdict, so the fix invented one — and **both** of the cold
reviewer's blocking findings were inside that new branch rather than in the corrected claim (Phase 3
skipped on `❌` alone, so a stop would have written the CV bullets `## Finishing` then told it not to
print; and the branch's commit ignored `DRY_RUN` on the very run recipe A makes dry). This is `REC-146`'s
lesson one layer down: there the invented thing was a **value** and the risk was its readers; here it is
a **path**, and the risk is every step upstream of it that still enumerates the outcomes that existed
before. When a gate gains a new terminal state, walk backwards from the print and ask which earlier step
is branching on the old set.

**`REC-111` led this order and closed 2026-08-15, and what it cost was neither the analysis nor the
edit** — the contradiction resolved against two quoted sentences and every site was one clause —
**but the fact that the row's two consumers were two of seven, and that the defect was at the owners.**
An authority row arrives naming the consumers that read the wrong file, because that is what a reader
notices; the reason they read it is that no file ever told the *derived* one what it may not restate,
so fixing the named consumers would have left the fork intact and the rest of the family drifting. Two
things carry. Count the family before designing anything — three of ten members already complied and
became the model instead of an invention (`REC-114`'s corroboration rule, a third time). And a
consumer judged compliant is compliant **per statement**, not per file: both sweep sites the first
measurement missed were second statements inside files that had already been read.

**`REC-119` led this order and closed 2026-08-15, and what it cost was the *register* the claim was
written in, not the claim.** The row named one sentence and it was the right sentence; three more sites
said the same thing by omission and two more said it as a **possessive**, which no grep for the
corrected wording returns and which the analysis therefore missed twice — both came back from the cold
reviewer, one of them inside a file the fix had already edited. An ownership row is cheap to settle
(the fence was one table row) and expensive to sweep, because ownership is stated in whichever
grammar each file happened to use. Count the *statements*, not the files, and read the sentence beside
the one you are correcting before declaring the sweep complete.

**`REC-127` led this order and closed 2026-08-16, and what it cost was neither the analysis nor the
sweep** — the two clauses sat in two files, the claim is stated exactly once, and `git log` dated its rot
to a single day — **but the reason that had to replace it.** A row of this shape hands you the other
file's scope table as the correction, and taking it reproduces the defect: the first draft swapped one
cross-file capability claim for three of the same class, and the cold reviewer cut all three. What
settled it was the owning file's own definition of *signed off*, which nothing outside it can falsify,
plus the boundary the row never asked about — the mode that runs every scope in one context. Where a row
says a published limit is stale, ask first whether the limit is **true for a reason its own file already
owns**, before touching the limit itself.

**`REC-110` closed 2026-08-16, and it is the cheapest row in this block to date** — one required-source
line, two token bindings and a scoping clause — because the analysis was a family comparison rather than
a ruling: two of three coverage prompts already listed the registry the third only pointed at from its
config block. Two things carry beyond the promoted rule. **A partial restatement inside a standard reads
like the authority right up until the pair it omits comes up** — `_coverage-standard.md` names the
boundaries "in particular", so the eight it lists are exactly the eight nobody ever gets wrong, and every
pair it omits was undecided. And **a row that names a withheld *input* is not the same row as an
undeclared *write*** — the reviewer found the second on the same file and it was kept separable as
`REC-149`, with disk evidence that it has already happened once; it closed the next day.

**`REC-149` closed 2026-08-16, and the analysis was the cheap half twice over** — the disposition fell
to the same family comparison that settled `REC-110`, and the sweep to two launchers — **while both
rounds' blocking findings sat in what the fix itself wrote**: a routing step with no channel feeding
it, and a newly-closed enumeration that falsified the two map cells citing it. A row that asks for a
*destination* is not priced by the destination. Price the producer upstream of it, and price whatever
the fix has to make precise on the way.

**`REC-135` led this order and closed 2026-08-16, and it arrived with its fix already on disk.** A prior
session had written three of the sites and died before the mandatory reviewer, leaving an edited,
uncommitted tree that reads on `git status` exactly like an applied fix — the state step 3 warns about,
with nothing in the row recording it. Re-measuring from scratch rather than adopting it is what found
the other three sites, one of them the *enforcement* half: the file's only mechanical guard could not
see the partition the prose was being fixed to state. Two things carry. **Where a `contradiction` row's
two clauses are an owner and a restatement, the owner is usually already right** — the fix is then a
sweep of every copy, not a ruling, and the copies are where the fresh over-claims get written (both of
the reviewer's findings, and the promoted rule). And **when a row partitions a shared artefact, ask what
*checks* the partition**: prose that says "add only" beside a guard that admits any hunk in the section
is `REC-148` one file down.

**`REC-113` led this order and closed 2026-08-16, and half of it was never a defect.** The settling
read was one section of one standard — the rule's own paragraph scoped it fourteen lines below the
bolded heading the row quoted — and the sibling that had already solved the surviving half was one
grep away, so neither the analysis nor the sweep is what the row cost. **The cost was the two map
rows the fix's own subject falsified**: elaborating a standalone path inside the very file
`README.md`'s classification bullet uses as its exemplar of "never appear in your 'paste into a new
chat' workflow" turns a loose generalisation into a false one, and `_system-map.md` §7's writer row
named two writers under a header promising *only this, never by hand*. Where a fix makes an existing
path more **visible** rather than changing behaviour, check the map rows that describe the file's
*kind*, not only the ones that describe what it does — `maps unaffected` is the easy declaration to
get wrong there, because nothing the fix wrote is new.

**`REC-120` led this order and closed 2026-08-16, and the row named one of two missing values in the
enum it was about.** The analysis was a family comparison rather than a ruling — the population is
stated four ways across the interview-prep family — and the fix took the form the family had already
solved, so neither is what the row cost. **The cost was the sweep, and it was the cheapest possible
instrument that closed it**: after a cold reviewer returned `sweep: complete`, `validate-prompt-system.ps1`
failed on a fourth site in a launcher directory step 1 had concluded did not exist. A reviewer inherits
step 1's population, so it cannot find a site the measurement was structurally blind to; the check that
*enforces* the agreement can. Run it before the dispatch, not before the commit.

**`REC-123` led this order and closed 2026-08-17, and what it cost was neither the analysis nor the
sweep** — the two clauses sat eight lines apart in one file and the family had already solved the
shape — **but four cold rounds in which every blocking finding was written by the repair, and the
discovery that three of them were the price of a *mechanism* the row never needed.** A `contradiction`
row whose clauses govern different dimensions is cheap to adjudicate and expensive to *write*: the
first draft answered it with an interleaving procedure, and a procedure has to say what it does about
every question the file admits, every mid-session mutation of the plan and every boundary — none of
which the ruling itself needed once it was stated over asking rather than over planning. Where a row
offers "add precedence or interleaving", the two are not alternatives at the same altitude; price the
ruling, and reach for the mechanism only when the ruling has been written and still leaves a case
open.

**`REC-126` led this order and closed 2026-08-17, and it is `REC-123`'s lesson a second time in one
day** — four cold rounds, every blocking finding written by the repair — **which is what turned that
observation into the four round controls now in step 3.** Two of its rounds bought nothing: round 4
returned `approve-with-tightening`, a closing token, and was re-reviewed as though it were a rejection,
while the findings that kept the loop alive were a heading and an altitude note — cost, not result,
and so tightenings under the very bar the reviewer was applying to the fix. The one finding that
justified its round was structural and could only have come from a cold read: asking what the deletion
*cost*, not whether it was justified, which is how `branches-coverage` surfaced as the single scope
whose slice ends at EOF.

**`REC-128` led this order and closed 2026-08-17, and it is the cheapest row of its cluster** — two
clauses in one file, both quoted by the row, and the form already written by a sibling — **because the
adjudication was a *quantifier* rather than a ruling.** The prerequisite and the recipe that admits
unfinished projects had never disagreed about anything except how widely the first one was worded, and
its own justification named the narrower scope. What that leaves as the cost is the sweep, and it was
cheap for a reason worth keeping: a `▶ Run first` is restated all over the family, but almost every
restatement is a *consumer* naming its producer, and those cannot be wrong about a launch precondition
they never state. The one exception is the catalogue's own Run-first column, which is a second
statement of the requirement and rots with it.

**`REC-142` led this order and closed 2026-08-17, and the analysis cost less than the row priced
because the defect was a *deleted word* rather than a disagreement.** `git log -S` on the two clauses
dated the rot to one commit about a third subject, and the family settled the direction — the sibling
contract and twelve consumers all restate Step 3's order, so nothing had to be adjudicated. What it
cost was the repair: the reviewer's one blocking finding was inside the sentence the fix wrote, on the
path the deleted duplicate had been the only cover for. Where a `contradiction` row's two clauses were
once consistent, find the commit that separated them before reasoning about which one wins — and when
that commit's subject is something else entirely, expect the fix to be a restoration and the risk to
sit in whatever you write in the duplicate's place.

**`REC-152` led this order and closed 2026-08-17, and it is the cheapest row of this block to date —
one sentence, one file, one cold round.** Both clauses were quoted by the row, the file's own siblings
supplied the form, and the adjudication reduced to one question the row had already framed: is
`REC-123`'s dimension test satisfied here? It is not, and answering *that* is the whole analysis —
position 1 is a rank, so the second statement was a fork and not a second dimension. What is worth
keeping is why the row looked expensive: it arrived carrying the previous row's ruling as its first
branch, and a promoted test offered as a candidate disposition has to be **refuted against disk**
before the row can move, exactly as a reviewer's `sweep: incomplete` site does (`REC-115`). A row that
cites an earlier row's rule is not cheaper for it; it is the same work with one extra thing to falsify.

**`REC-150` led this order and closed 2026-08-17, and what it cost was neither the analysis nor the
sweep** — the three paths that falsify the clause each fell to one quoted sentence, and the sweep found
exactly one more site, inside the file already being edited — **but two rounds in which every finding
was a *new* fact about the tree written by the repair itself.** That is the row's shape twice over: the
defect was a justification stated as a fact, and the repair kept reaching for another one. Where a fix
replaces a false premise with an ownership rule, the ownership half is safe and the scene-setting
around it is not; condition every remaining tree-claim or delete it, because the paragraph's own thesis
is that none of them decide anything.

**Current order: safety, persistent-state risks, broken or undefined terminal paths and the
authority/writer-boundary rows are all drained. What remains is the bounded schema, read-scope and
precedence block —
`REC-130`, `REC-138`, `REC-139`, `REC-141`, `REC-143`, `REC-144`, `REC-145`,
`REC-147`, `REC-151` and `REC-153`** — ten rows, `REC-120` having closed after this block produced it and raised `REC-151` in its place, `REC-123` having closed and raised `REC-152`, `REC-142` having closed and raised `REC-153` the same way, and `REC-122`, `REC-126`, `REC-128`, `REC-129`, `REC-150` and `REC-152` having closed without raising one — `REC-152` was the first of this block's own rows to drain rather than replace itself, and `REC-150` the second, which is the first time the table has fallen two rows below where the block started. `REC-109` led this order
until it closed, because it restores the audit that produced the other 33 rows; those 33 are now also what
that audit will re-derive, so draining them is what lets the next `/system-check` reach a global verdict
rather than a wall of `source-contradiction` rows. Within the intake, exposure of secrets, unrecoverable
partial writes, contradictory persistent formats, circular truth and duplicate application rows precede
wording and scope corrections — that head class is now empty, `REC-140` having been its last row. `REC-054` is not part of this order because it remains accruing and gates
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
