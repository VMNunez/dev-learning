# Recommendation-resolution doctrine — the case law of `_recommendation-ledger.md`

**What this file is.** Every rule a closed `REC-NNN` promoted, and the pricing table its row shapes are
kept in. It is one third of one document: `_recommendation-ledger.md` owns the **procedure** — the
four steps, the states, the scope test, `## Open` and the order — `_recommendation-ledger-closed.md`
owns the resolved lines, and this file owns the **case law** those steps accumulated, one rule per
defect that has already been paid for once.

**Why it is a separate file.** The ledger is read to answer *what is open and what happens next*; this is
read to answer *how has this shape of defect gone wrong before*, and the third to look one ID up. They
were one file until 2026-08-18, and
the second reading had grown to four fifths of it, so the queue nobody could find was buried inside the
case law nobody needed that day. Splitting them changes neither rule: the ledger's steps cite this file by
section, and a rule promoted by a closure lands here.

**Who reads it, and when.** A session resolving a ledger row, at step 1 and again at step 3 — the two
steps whose failures this file records. Nothing else reads it: no prompt, no skill and no gate. It is not a
standard (it constrains no prompt), and it is not a queue (it contains no work).

**Who writes it.** Whoever resolves a ledger row, in the same commit as the closure, under the ledger's
step 4 budget: **one line in `_recommendation-ledger-closed.md` plus at most one promotion**, and a promotion is *merged into the
rule it is an instance of*, cited as `Also REC-NNN` with the one clause it adds. A new standalone rule only
where no existing one covers it. A pricing lesson is a **row** in `## Row shapes` below, never a paragraph.
That budget is what keeps this file from becoming the thing it was split out of.

---

## Step 1 — analysing the problem

The ledger's step 1 states the mandate: measure against disk, budget the sweep rather than the edit,
and name the set you measured. Everything below is what that measurement has got wrong before.

**A pointer is not a read, and the family is the cheapest test.** A `## Configuration` block naming an
authority (`TOPIC = one registered topic from _topic-ownership.md`) puts nothing in the run's hands;
only the Required sources list does. So when a prompt demands a verdict its own sources cannot
support, measure its **siblings** before reasoning about the wording: `REC-110` closed on two of three
coverage prompts already listing the file the third only pointed at. An asymmetry across prompts that
share a standard is evidence, and it costs one grep.
**Also `REC-183`, from the row's side: the sibling family may already carry the very rule the row says
nobody states — and the row can cite that exact line as its precedent while misreading what it says.**
That row quoted `_note-quality-standard.md` l.149 as an unrelated exception *proving the default was
overridable*; l.148-155 is the symmetric TODO-direction rule it was asking for, live since 2026-08-20
across five files. **Quote the text of every line a row cites before building on it.** A citation by
description is the one form of evidence that can hand you the answer as though it were the precedent,
and checking it is what collapsed a two-family sweep to one.
**Also `REC-197`, one register up, where what the row says nobody asks is already asked by the very roles
it is adding a third to — and the *fix* is what asserts the absence.** That row proposed a reader-effect
judge because `readme-audit`'s two subagents "cold-review for conformance and nothing reads the README for
effect"; `_readme-standard.md`'s *Quality filter* carries the recruiter and interviewer lenses, sits 47
lines below the paragraph the fix inserted, and is an item on the author's step 2 and the reviewer's
checklist — so three sentences the fix wrote were false in the file they were written into. The addition
survived because its warrant was never the missing question: it is the **unit and the vantage** — per
section with the rule set in hand, versus the whole artefact with no checklist. So before founding a new
role on *nobody asks this*, grep the existing roles' own checklists for the question, and where they do
ask it, found the addition on what changes about **how** it is asked. That is also the only thing
separating it from `REC-042`'s illegitimate second computation, which the same row invoked to refuse its
other half.

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
**Also `REC-145`, from the *repair's* side, generalising it to names: a prohibition's name is
routinely narrower than the sentences filed under it, and the two rot apart.**
`_sql-exercises-practice.md` Step 4's *one file, one schema* defended a **schema** claim (no second
SETUP block) while an **append** claim sat under the same name — the route's forward file choice,
false for an off-route batch generated against the file's own schema. So the row was two rulings, a
real defect on the schema half and an ambiguity on the append half, and each of its three offered
dispositions was right about one and wrong about the other. **Split a rule at its own name before
adjudicating either half**, and expect a row that reads as one contradiction to be two; the cold
reviewer is what catches the miss, because a repair citing the paragraph as its warrant will quote
the heading and mandate what the sentences forbid.

**A licence found in the tree is not yet the warrant — read what its own section is *about*.** Also
`REC-145`. The repair's second draft founded the append on the route's "a mixed file is expected
and correctly handled", which sits under a heading titled *Two header formats exist*: it licenses
appending to a **format**-legacy file, and the format-legacy and schema-mismatched sets coincide on
exactly one file today. A warrant that holds only through two populations happening to overlap
evaporates the moment either moves — here, any future revision of the canonical schema. Found the
mandate on the clause whose own subject *is* the thing being ruled (the `reinforce` contract, which
is level-generic and says nothing about schemas), and treat the coincident clause as corroboration
or drop it. The same round refuted a sibling claim the same way: a mechanism cited as an instrument
(`{PLAN}` §1 "points `basics` at `02-`") turned out not to exist — §1 has no topic column and still
files the closed file under its step — so **quote the instrument's own columns before citing it**.

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

**A clause about an artefact's *state* is not a clause about the *verdict* that reads it, and a
runnable that cedes the computation cannot be the site of a partition defect.** From `REC-130`,
which alleged that `portfolio-audit.md`'s "the verdict counts unchecked tasks as open" lacked
`_portfolio-standard.md`'s "open **Low** tasks do not affect the verdict". An unticked box being
*open* and an open task mapping to ❌/⚠️/✅ quantify over different things, and the prompt states no
mapping at all — it says "compute the verdict per the standard's **verdict logic**" and scopes both
of its own operative sentences to High/Medium. Two tests, in this order, and each costs one command.
**Date the partition**: `git log -S` put three of the four resolving sentences in one commit, so
they were never separated and the row is a reader's error rather than a fork (`REC-142` from the
other side). **Then enumerate from the *definer*, not from the consumer** — a severity question is
settled by the priority definition in the format owner, here `_review-standard.md`'s "(Low does not
affect the portfolio verdict.)" inside the `**Low**` bullet itself, which no grep of the two arguing
files returns and which forecloses the ambiguity branch outright: an ambiguity needs a distinction
*neither* file states.

**"Already in your context" is never available to a cold role, and an edit that adds a *read*
re-reads the fence above it.** From `REC-138`. `roadmap-review`'s Reviewer 1 was fenced to the
standard plus `ROADMAP.md` — "Read nothing else" — on 2026-07-09, and a conditional "if not, read
its Daily study blocks section" was added *inside* its invariant 2 the next day: two commits, so a
fork rather than a reader's error, and `git log -S` on each clause is what separates the two. Both
escape branches die on one quoted sentence each. The **false positive** dies on
`_agent-runtime-standard.md`'s dispatch contract — `cold`: "pass only the target, required sources,
relevant standard, and acceptance format" — which is the file to open before believing any claim
that a subagent inherits a rule. The **ambiguity** dies on the dispatching prompt's own "They have
none of your context" fourteen lines above the clause: an inheritance claim about a cold subagent is
really a claim about the *orchestrator's* context, and the platform adapter that carries it binds
only its own reader. Where the read is genuinely owed, resolve it `REC-112`'s way — name the section
inside the fence, for the one check that needs it, **with the mechanism that keeps it a section
read**; a file under the 2000-line limit is loaded whole by a plain Read, so "that section only" is
an instruction and `grep -n` plus `offset` is what executes it.
**Also `REC-175`, which names the enumerator: a cold reviewer's own *acceptance proof* lists the
verdicts it is required to return, and each one is owed the rule it is measured against — supply that
rule, or fence the verdict out of scope; nothing else disposes of it.** An artefact carries fields and
headers no mandated verdict covers, and a reviewer paid to find things will rule on them anyway from
whatever it can infer — two `notes-plan` runs lost a round trip each to a digest it could not compute
and a field restriction it could not read. The fence is not politeness: where another component already
recomputes the value, name it, because a verdict with no rule and no fence is the one finding the loop
cannot settle.

**One creating commit is not only a reader's error — it is also an authoring *copy*, and the family
is what names the foreign clause.** From `REC-139`. `REC-130` above dates a partition and reads a
single commit as evidence that nothing ever forked; that inference holds for a rule and its
qualifier written together, and fails for a **template line pasted from a sibling**, which arrives
false on day one and stays false precisely because nothing later edited it. So when `git log -S`
returns the birth commit for both clauses, do not stop at the disposition — ask which sibling says
the same sentence *truthfully*. `linkedin-prompt.md` is the one prompt in its family with no
configuration block at all, and that single fact identified the intruding sentence, the correct
wording (the three config-carrying siblings' "Fill in the configuration block before pasting") and
the ruling at once, with nothing adjudicated. Where the defect is as old as the file, the instrument
that separates rot is silent by construction and the family is the only thing left that speaks.

**An extraction commit is a copy that can *manufacture* a contradiction, and the pre-image is what
names the clause that changed.** From `REC-141`. `git log -S` returned one commit for both
colliding clauses — `34f1e494`, "refactor: extract shared `_application-standard` from cv and
linkedin prompts" — which reads under `REC-130` as never-forked and under `REC-139` as a template
line pasted from a sibling. It was neither: each clause was **true in the file it came from** (the
required-keyword list governed ATS matching in `cv-prompt.md`, the defensibility rule governed a
Skills list in `linkedin-prompt.md`), and the merge is what made them collide. `git show
<commit>^:<old path>` is what named the defect — the heading had read "Required keywords for this
**target role**", a statement about the *market*, and the extraction reworded it to "Required
(**must be present**)", a mandate on the *document*. So when the single commit is a **refactor**,
read the pre-image of every file it drained before ruling: a merge fork is invisible to `log -S`,
which sees one birth, and the rewording is where a section acquires an obligation nobody wrote.
**And a fix whose verb is *report* is swept over each consumer's output contract, not only its
instruction steps.** Same row: "left out **and reported as a gap**" reached `cv-prompt`'s Step 4
and `linkedin`'s Step 5 and left the readiness box and the printed-output block alone, so a
compliant run could omit the skill and say nothing — one blocking finding in each of two review
rounds. Where the obligation is to *say* something, the site is wherever the prompt says things.

**A source-list entry is a dispatch of the run's reads, so a false one leaves a *hole*, and deleting
the claim does not fill it.** From `REC-147`. `_application-standard.md` told five prompts that
`PROGRESS.md` held "every concept learned"; the 2026-08-03 deletion had made that false, and the live
cost was not the wrong sentence but that `cv-prompt` Step 4's ternary keyword audit asked whether
Victor can **defend** a keyword while no file in the standard's sources answered it. So when step 1
falsifies a source description, enumerate what the consumers were sourcing *from* it and name where
that read now comes from — a correction that only narrows the claim leaves the family a judgement with
no evidence, which is `REC-110`'s pointer-is-not-a-read from the other side. And the replacement read
must declare **which of the owner's access cases it is** — `_coverage-standard.md`'s free spot lookup,
not its parity-gated enumeration or its topic-file measurement — or the fix silently imports a
precondition into every consumer at once.

**An impossibility claim names an *instrument* and almost never names the *observer*, so the first
question is whose vantage the paragraph argues from — not whether the instrument changed.** From
`REC-144`. `_interview-prep-standard.md`'s "The working tree cannot either" was read as falsified by
a `git status --porcelain` a later row added to `interview-prep-audit`; but the paragraph's gate is on
the **inserting** prompt, its sibling reason is that prompt's own fingerprint gate, and neither
practice prompt reads the tree at all — so every sub-clause held and the row's real-defect branch
died. What survived is that one sub-clause was worded from the *other* party's timeline ("clean for
every topic a `FILE = all` run has not reached yet"), which is what let a reviewer holding the other
file misread it. Two things generalise. **A claim true under its own subject and misleading under a
neighbouring one is an `ambiguity`, and the fix is to name the vantage, never to weaken the claim** —
the mandate stays, `REC-150`'s split applied one level up. And **half a distinction is not a
distinction**: the audit already disclaimed detector semantics for its own check and deferred the
question to the standard, which is exactly why the standard saying nothing back was the defect. Where
two files must agree about who sees what, read the sentence each writes about *itself* before ruling.

**A restatement can be falsified by a *feature* rather than by a disagreement, and only the second
is a fork.** From `REC-143`. Two files said the pasted `sql-exercises` config has exactly four keys
and four said five; `git log -S` put both four-key lists on 2026-07-22 and the fifth key, `LEVEL`, on
2026-08-02, so nothing was ever adjudicated — a value was added and no sweep reached the copies.
Where a `contradiction` row's two sides differ by **one member of a set**, date the *member*, not the
clauses: if it postdates them the row is a stale copy and the disposition is settled before a word of
either wording is read. Then look one section down before designing anything — the same standard's
own invariant already **dereferenced** the definer ("that prompt's real keys — open the prompt and
compare key by key") while the paragraph above it enumerated, which is `REC-114`'s corroboration rule
inside a single file. **And a copy is repaired only once the check that reads it covers copies**: the
audit's key check was worded over the configs the plan tells Victor to *paste*, so the stale list —
sitting inside the plan's own invariant — was outside every instrument that could have caught it,
which is why the fix is a clause in the checker and not only a rewrite of the list.

**A fix that widens an existing cell adopts every claim already inside it, and the inherited half is
the one nobody re-measures.** From `REC-151`. Adding `spring` to a code-sourcing bullet also handed it
that bullet's parenthetical — `.../src/test/java/` "for testing questions — JUnit/Mockito" — which the
cold reviewer falsified in one `ls`: the tree holds the generated `contextLoads()` stub and the project
has no Mockito at all, so the widened route sent an author to a tree with nothing citable, which is the
exact condition that manufactures invented code. Re-measure the cell you are joining, not only the
member you are adding. **And a `{TEMPLATE}` in a path is a claim at every value the template ranges
over** — the same fix cited `coverage/{LEVEL}.md` for evidence markers that exist only in `junior.md`,
so pin the path to the value that holds or verify all of them; a template is the cheapest way to
assert two things you never checked.

**A rule written in a standard is not a rule that runs, and "the sibling family already does this" is
a claim about *disk*, not about text.** From `REC-180`'s identity half. The row's whole framing was that
transferring stable IDs and the `[refined]` freeze to the project question bank was cheap because
"everything the request needs already runs for the levelled bank" — which
`_interview-prep-standard.md` does mandate, in a section three prompts and three skills read as a
contract. Measured across all eleven files of `notes/interview-prep/junior/en/`: **669 questions, 0 IDs,
0 `[refined]`, 0 `[studied]`, 0 legacy `[x]`**, and the `Interview` columns of `_run-tracker.md` empty
for all fourteen topics — the migration that assigns them belongs to `interview-prep-audit`, which has
never run. The rules were live text over an artefact that had never been through the run that applies
them, so the transfer was a **first implementation**, not an inheritance, exactly as the same row's
translate stage had been two days earlier. Two things generalise. **Count the marker, not the mandate**:
one `grep -c` per file over the artefacts the standard governs, before pricing anything as a copy — it
is the same cost as reading the standard and it is the only thing that separates a rule from a rule
that happened. And **a tracker column is the cheapest such instrument in the repository**: it records
which prompts have *run*, so an empty column under a standard everyone cites dates the gap without
opening a single artefact. **Also `REC-195`, which names the third form and it is the cheapest
to miss: an invariant nobody triggers is not a gate.** Invariant 9 had checked the closure schema for
weeks and still let `REC-190` land with two fields and its verdict missing, because
`validate-prompt-system.ps1` has no CI and no hook — it runs when someone runs it — and the act that
*writes* the line it reads, collapsing a row, was not in its trigger list. So when a check exists and
the defect it checks for shipped anyway, measure the **trigger**, not the check: name the act that
produces the artefact and put it in that list, before rewriting a rule that was already correct.

**A rule stated against an artefact's *source* is not a rule about the artefact anyone sees, and where
the deliverable is rendered, the reviewer inherits that blindness.** From `REC-192`.
`_readme-standard.md`'s "bold caption above each" is satisfied by a caption on the line immediately
before its image — which CommonMark makes one paragraph, laid out inline beside the picture. Two
`readme-audit` runs read the section, checked the source, saw the caption above and passed; ten wrong
pairs shipped. The separating test is cheap and it is about the rule's **grammar**: a rule naming a
*block type* ("always a table", "one command per code block") is self-executing, because writing that
block is unambiguous; a rule stating a *spatial relation between two blocks* ("above each", "stacked
vertically", "after each, one sentence") says nothing about what separates them, and separation is the
whole of the layout. So on any artefact whose deliverable is its **rendered** form, enumerate the
positional rules rather than the visual sections — and state the correction **once**, in the register
the defect lives in, rather than repeating the mechanism at every site: both rounds of this row's own
review returned a false universal about rendering that the *repair* had written, which is `REC-126`'s
*a repair states no new fact* arriving on ground where the fact is a spec nobody had opened.
**Also `REC-199`, one register up and about the grammar of a *gate* rather than of a rule: a standard
whose sections are written as **inclusion** tests cannot be policed by a veto worded as a **prohibition**
check.** `readme-audit` let its reader-effect judge delete anything the applier could not "name the rule
it would break" against; `_readme-standard.md` forbids almost nothing and *includes* almost everything —
eight of its sections are worded that way — so the applier had nothing nameable when the judge cut two
`Future improvements` bullets rule 8 positively includes, and applied the cut correctly per the text it
was given. The two grammars are invisible to each other: every clause read fine in isolation. **So when a
gate delegates a veto, count how the owning standard's sections are *worded* before trusting the veto's
verb** — `grep -c` for the inclusion form is the whole measurement — and where they include rather than
forbid, the veto must say *breaks **or contradicts**, including a rule that positively includes what the
item removes*. The fix is one clause at the applier and never a checklist at the proposer: constraining
the proposer re-imports the rule set that step exists to escape.

**Deleting a number deletes a gate, so a de-numbering fix is priced as *writing a test*, never as a
deletion.** From `REC-191`, which replaced six fixed section sizes in `_readme-standard.md` because
Victor's bar is relevance and not arithmetic. The caps were not dead letters: the `03-expense-tracker`
run used one to merge a duplicated architecture decision and to move a tradeoff out of the wrong
section. A bound that can fail an item is a gate; prose that can only ever be satisfied is taste, and
swapping the first for the second reads exactly like a fix while removing the check. So every removed
bound — **ceiling or floor, since a floor is what forces padding** — leaves behind a clause a cold
reviewer can use to reject a **named** item, and the precedent is usually already in the same file
(`_readme-standard.md` never says "no fixed number" without following it with a test: "a screen, not a
state"). Verify it the only way the claim can be verified: apply each new test by hand to one artefact
the old bound **approved** — nothing it approved may now fail — and one it never audited, where at
least one item must be rejectable. A test that rejects nothing is the defect the row was opened to
prevent, arriving inside the fix.

**An escape clause the artefact's own format already satisfies saves everything, and the test that
carries it cuts nothing.** From `REC-196`, the sibling of `REC-191`'s *a test that rejects nothing is the
defect the row was opened to prevent, arriving inside the fix* — that one is about a bound deleted, this
one about a bound written with a hole in it. The new inclusion test for `What I learned` was given a
let-out: a bullet naming the same symbol as a line above survives "when it states the mechanism that line
does not". Rule 9's **own format** is `` `ConceptName` — one-line reminder ``, so every well-formed bullet
states a mechanism by construction; the clause was satisfied by all of them and the test went from cutting
six of fourteen on `06-hr-portal` to cutting **zero**, which round 1 had not seen because it reviewed the
version without the let-out. So before writing an exception into a test, **check it against the format the
artefact is already required to have** — the format spec is the population the exception quantifies over,
and where they coincide the exception is a repeal. The repair is not a better-worded exception but a
different shape: the detail that tempted it **merges into the surviving item** instead of licensing a
second one. And the instrument that caught it is `REC-191`'s, applied to the *second* draft as well as the
first: re-apply the test by hand to an artefact it previously cut, and count. A round that only re-reads
the wording will not see a clause that is false only in aggregate.
**Also `REC-200`, which adds the mirror half and the reason to run the instrument *before* the reviewer:
a test can also reject the artefact the rule is calibrated against, and that failure is invisible to
every reading of the wording.** Two of its tests failed that way in one day — a placement test whose only
worked cut (`03-expense-tracker`'s `effect()` pair) was the same shape as a bullet in the approved
`04-meal-finder`, and a form test whose "one concept per bullet" clause rejected
`` `signal()` and `computed()` — reactive state and derived values `` in both the approved file and the
one the section's voice is calibrated against. Neither is arguable once counted and neither is visible
until you count: so **name the calibration artefact, apply the draft test to it by hand, and report the
count in the dispatch** — `REC-191`'s instrument is a step-2 obligation, not a reviewer's job, and a
round-1 `reject` is what it costs to skip it. The cheapest form of the count is often a single
measurement of the artefact's own shape (here, a longest-bullet length of 124 and 129 characters against
the 214-319 the unaudited project carries), which sizes a bound and falsifies a bad one in one command.
**And a test retired this way is retired by name in the standard**, with the reintroduction it must
refuse — "including as a narrower test over X" — because the next reader's instinct is to rescope rather
than to drop, and the rescoping is what already failed.

**A topic whose source is in another language is routed, not exempt.** Also `REC-151`. The row argued
`javascript` had no project behind it "since the stack is TypeScript"; its coverage file carries 33
`✅` markers across projects 01–06, so the constructs are Victor's real code and only the file
extension differs. An escape clause scoped to a **construct** ("no project contains it") is not
available to a whole topic, and a file-extension search is not a measurement of what a topic
demonstrates — the coverage markers are.

---

## Step 3 — the cold reviewer

The ledger's step 3 states the gate, what the reviewer is handed and what its return must carry.
Below is what the gate itself has cost, and how its rounds go wrong.

**A reviewer's `sweep: incomplete` names a *candidate*, and it is verified before it is worked.**
From `REC-115`, whose three passes produced three sweep sites: one was real (`portfolio-audit`), one
was **falsified against disk** — the reviewer's stated reason, that the prompt commits half-applied
fixes, was refuted by a gate quoted from the file itself — and the third was real but for a reason no
reviewer had yet stated. Step 1's rule that a row is routinely wrong about where the defect lives
binds the reviewer's sites too: discharge one only against a **quoted sentence** from the file, the way
`/system-gaps` discharges a candidate, and say in writing which of the two happened. Widening on an
unverified site costs a family's worth of edits; dismissing a real one leaves the sweep short, which
is the failure step 1 exists to catch — so neither is the safe default and only the file settles it.

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
too big, not that it is badly written — *price the ruling, reach for the mechanism only once the
ruling is written and still leaves a case open*, the `REC-123` / `REC-126` row of `## Row shapes` below,
arriving from the other side. **A repair states no new fact.** Every blocking finding in `REC-126`'s rounds 3 and 4
pointed at text the round before it had written, the sharpest having traded a true conditional
("if it is near or over 2000") for a false assertion ("§23 sits past line 2000 on a real plan",
against a 1820-line plan): condition the claim or cite the instrument, never assert the number.
**Also `REC-150`, which names the shape to hunt: when a fix replaces a false fact with a mandate,
every sentence it writes that still asserts a *tree state* is a candidate** — both its rounds
returned exactly that, written by the repair, inside a paragraph whose own thesis is "not a fact
about the tree".
**Also `REC-181`, which names the second shape and it is the repair's own sweep: a claim the round
repaired at its owner survives in every place the round did not know it was restated, including the
restatements that same round wrote.** Four of its round-2 blockers were one phrase — a decidability
claim corrected in the spec and left standing in two map rows and a subordinate standard — and a fifth
was a *justification* invented to found the repair on (`REC-150`'s split, arriving from the repair's
side: the mandate was right and the reason was false, and it would have propagated to a step that
enforces the opposite). So after every repair round, grep the phrase you just rewrote, not the file you
just edited — and re-read any sentence the repair wrote to explain *why*, since a fix draws its reason
from the context that made it necessary and that context is exactly what a cold reader does not share.

**A fix that adopts a sibling's house phrasing inherits its live exceptions, not only its rules.**
From `REC-154`, whose reviewer found the repair had copied `roadmap-review`'s four marker-reading
rules and dropped the **dated exception** printed immediately under them — the tier whose markers are
not backfilled yet, where an unmarked bullet is a *missing marker* rather than an absent project. A
house phrasing is quoted precisely because it is already right, so the paragraphs around it are the
ones nobody re-reads: take the qualifier that lives beside the rule, or state in writing why it
cannot bite on the new site.

**A decline is not a disposal until nobody overrides it, and applied-wrongly is still the bar
working — provided the re-measurement is written down.** From `REC-155`, whose resolution declined its
reviewer's out-of-scope site on bar condition 3; Victor overrode the decline, and re-measuring showed
the decline had been wrong. The bar is not damaged by being applied to the wrong answer once. What
would damage it is a decline recorded as a verdict rather than as a call someone can reopen, so state
the condition it failed on and leave the re-measurement legible.

**Re-scoping, in the concrete: revert the out-of-scope edit and open it, because a half-repaired file
is worse than an untouched one.** From `REC-147`, the first row to reach the cap. Its round-1 sweep
site was a *second* standard the row never named, and repairing one of that file's three copies of the
same instruction made the surviving **definition** contradict the repaired site outright — which is
the round-2 blocker, and a stronger defect than the one the edit removed. So the edit came out, the
three sites went into a row of their own carrying the revert and its reason, and the remaining fix
stood alone. Two tests before splitting, both cheap: does the reduced fix leave any sentence whose
truth needed the reverted edit, and does the new row state enough — its sites by **section name**
rather than line number, the answering route with its authority, the reverted repair — to be resolved
by a session that never sees this transcript.

---

**Row shapes, and what each actually costs.** Every row below was priced wrong on arrival, and the
pattern is the same one step 1 states: the row is a report of where a defect was *found*. This table is
what thirty-odd closures generalised to — the shape of the row, the thing that turns out to be
expensive, and the one test that settles it. Its own history is in `git log -p`; what a future
resolution needs is the test.

| Row shape | What it actually costs | The test |
| --- | --- | --- |
| Any row, sized by its diff | the *rulings* inside the edit, not the edit — nine and three in two "smallest" rows (`REC-055`, `REC-086`) | never size a row by its diff |
| A `contradiction` naming two producers of one artefact | establishing which file is the fork (`REC-118`) | count the producers first: if only one writes, the other clause is **prose about the writer** and is corrected against it, never reconciled with it |
| A `contradiction` whose clauses were once consistent | the restoration, and whatever you write in the duplicate's place (`REC-142`) | find the commit that separated them before reasoning about which wins — expect its subject to be something else entirely |
| A `contradiction` whose clauses were **born together** | nothing history can settle — the dating instrument says "never forked" (`REC-139`) | stop asking when they diverged and ask **who else says the wrong one**; the sibling that says it truthfully is the whole adjudication |
| A `contradiction` of owner + restatement | a sweep of every copy, where the fresh over-claims get written (`REC-135`) | the owner is usually already right; and when a row partitions a shared artefact, ask what *checks* the partition |
| A `contradiction` whose clauses govern different dimensions | *writing* the ruling, not adjudicating it — a mechanism has to answer every case the file admits (`REC-123`, `REC-126`) | price the ruling; reach for a mechanism only once the ruling is written and still leaves a case open |
| A row naming a **circular input** | the branch the fix must invent for when the value is simply absent (`REC-136`) | budget the branch you will invent, not the clause you will delete |
| An **idempotency** row | the second write path the row never mentioned (`REC-140`) | read the nouns of the promise and take one site per noun — then check the new name is *consumed*, not only written |
| A row whose step-1 conclusion is "this is the only site" | that conclusion is two claims and only one is load-bearing (`REC-114`) | look for the family that already solved it **before** designing the fix — it hands you the design and the corroboration |
| A row naming a few members of a family | classifying the whole family; a compliant file can be invisible to every grep for the defect's wording (`REC-121`) | enumerate from what *defines* the population, never from the words the defect happens to use |
| An **authority** row | that the named consumers are a fraction, and the defect is at the owners (`REC-111`) | count the family before designing anything, and judge compliance **per statement**, not per file |
| An **ownership** row | the *register* the claim is written in — omission and the possessive return from no grep (`REC-119`) | count the statements, not the files, and read the sentence beside the one you are correcting |
| A row asking for one **terminal outcome** | re-reading every branch that outcome now reaches (`REC-125`) | scope the verb, and price the standard you import to scope it |
| A row saying a failed check has **no terminal effect** | picking the wrong terminal thing (`REC-131`) | ask **which** terminal thing it is owed first — a row is as routinely wrong about that as about where the defect lives |
| A row whose offered dispositions all fail | designing a *form* rather than choosing a branch (`REC-146`) | price the design **and** the consumers of whatever you invent |
| A gate gaining a new terminal state | every earlier step still branching on the old outcome set (`REC-148`) | walk backwards from the print and ask which step enumerates the old set |
| A row saying a **prerequisite has no teeth** | the consumers whose `▶ Run first` describes the producer's *result* instead of naming it (`REC-137`, `REC-128`) | resolve the rule first, then read every consumer for what it promises the prerequisite buys; a consumer merely naming its producer cannot be wrong |
| A row saying a **published limit is stale** | the reason that has to replace it (`REC-127`) | ask whether the limit is true for a reason its own file already owns, before touching the limit |
| A row alleging a **missing partition** | reading the two files it names (`REC-130`) | date it with `git log -S` and find its **definer** — neither arguing file is likely to quote it |
| A row alleging a **stale restatement** | the checker whose scope never reached the copy (`REC-143`) | ask what would have caught it; if the answer is nothing, the enumeration is the symptom and the checker's scope is the defect |
| A row **quoting a named rule** | that the name may cover two claims (`REC-145`) | split the name from the sentences filed under it before adjudicating either |
| A row asking for a **destination** | the producer upstream of it, and whatever the fix must make precise on the way (`REC-149`) | a destination is never priced by the destination |
| A row citing an **earlier row's promoted rule** | one extra thing to falsify, not one less (`REC-152`) | a promoted test offered as a disposition is refuted against disk first, exactly as a reviewer's `sweep: incomplete` site is |
| A row whose fix is already on disk from a dead session | adopting it — an edited uncommitted tree reads like an applied fix (`REC-135`) | re-measure from scratch; that is what finds the sites the dead session missed |
| A row whose fix replaces a **false premise** with an ownership rule | the scene-setting around the ownership half (`REC-150`) | condition every remaining claim about the tree or delete it |
| A row whose fix **quotes a sibling that is already right** | the paragraph *around* the sentence taken (`REC-154`) | read what the sibling prints underneath it — exceptions travel with house phrasing |
| A row saying a mandatory **read** is unaffordable | naming the population that still owes the read, not grading the trigger that fires it (`REC-177`) | ask what already *states* the answer the read would re-derive — three runs disagreed only on size and the axis was ownership; what owes prose is the population nothing else states |
| A row whose fix is a **deletion** | the check a deletion owes and an addition does not (`REC-153`, `REC-142`) | name the clause chain that still carries the boundary the duplicate was covering. Also `REC-176`: deleting a file either ledger cites turns that path into a permanent licensed `REPORT:` line in `validate-prompt-system.ps1` — expected output on every later run, never a typo |
| A row whose fix only makes an existing path more **visible** | the map rows describing the file's *kind* (`REC-113`) | `maps unaffected` is easiest to get wrong where nothing the fix wrote is new |
| A row that adds **no check** | the reviewer, because the injection budget does not apply (`REC-091`) | on a row that adds no check, the reviewer *is* the check |
| A row replacing a **prose bar with a checkable one** | not the conditions — the *restatements* of the bar and every branch that existed because a human judged what the check now decides (`REC-181`: four files carried the bar, six sites branched on the choice gate it retired) | count the restatements and the branches **before** the conditions; the owner is the file the whole family reads, and the restatement that declares itself subordinate is what names it |
| A row whose ruling needs a fact the repo has no evidence layer for | the **warrant**, not the clause — two rounds went on replacing a citation that was not on disk with a bare assertion, then on re-founding it at a source that only corroborates (`REC-186`) | before writing the ruling, name the file on disk that would found it; where none exists the ruling ships reduced to what an existing source already says, and what it could not found is a row of its own (`REC-187`) |
| A row that keeps **failing review** | rounds, and a fix that grows every pass (`REC-092`) | it is not under-built — check whether it is being answered at the wrong altitude, and count the rounds |
| Any row, at the sweep | the *column* of the artefact that holds the value, not only the file (`REC-084`) | run `validate-prompt-system.ps1` before the dispatch, not before the commit: a reviewer inherits step 1's population and cannot find a site the measurement was blind to (`REC-120`) |


---

## Rules promoted from closed rows

Seven sections, by the kind of defect rather than by arrival order. A rule is filed where a future row
would look for it, and several are cited from more than one section's subject. **A rule promoted here
is merged into the one it is an instance of** — the ledger's step 4 budget — so a section holding two
paragraphs that a future row would read as one question is itself the defect this file legislates
against, and collapsing them is maintenance, not a rewrite.

### Duplication, restatement and forks

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
line over prose that wraps measures the margin, not the claim. **`REC-198` is its fifth instance, and
there the fork was in the *framing* rather than in any word.** `readme-audit.md`'s close-out named its
own seven bullets and called them "this pipeline's tailored version" of `_pipeline-self-report.md`,
where the other eighteen orchestrators open theirs with an executing verb — so nothing in the file said
the contract's refinement gate, close-out check, skill-friction and ledger steps applied at all, and
runs reached them only through a run-start pointer written for another purpose. **A derived section
says it executes its source before it says what it puts in it**: the tailored part is content *inside* a
contract, never a version *of* one. And the sentence that imports the source — "all apply here
unchanged" — is itself a falsifiable claim, so check it item by item before writing it. This one
restated the contract's five bullets as seven, and the cold reviewer found bullet 4's breach half with
no home among them, which made "unchanged" false for the single item the restatement had actually
changed. **`REC-165` is the rule's converse, and it
rots the same way: a rule stated *only* in the ritual that executes it is unavailable to every path that
ritual is excluded from.** The two-map change test's row walk lived in `map-sync` §1 alone, and that
skill never fires inside a prompt pipeline run — so a self-report's at-end refinement, which edits the
machinery and cannot fire it, ran the test with the which-map table and no walk at all. Where an
executor holds the only statement of a rule, read its **own exclusions** as the list of readers it
silently fails, and move the rule to the owner those paths already point at — the executor keeps the
mandate's heading and points for its content.

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

**A restatement of a *delegated* obligation is weaker than the clause it duplicates, and the coordinate
is where it rots first.** From `REC-153`, and it is the delegation register of *a rule restated is a rule
forked*. `evidence-intake-prompt.md` restated the `_run-tracker.md` update that its own next section
delegates in full, and the copy carried a table name the tracker has never had plus a commit shape the
contract forbids — while nine of its twelve siblings state nothing and let the contract carry it. A
restatement naming a **coordinate** — a heading, a path, a table, a field list — is the copy that stops
being maintained when the coordinate moves, so where a duplicate adds no obligation the contract lacks,
**delete it rather than tighten it**, and pay `REC-142`'s check first: name the clause chain that still
carries the obligation, because a duplicate clause is often the only statement of a boundary. Which side
the defect is on is the **family's** answer, not the wording's — the same instruction in a sibling would
have made it the shared contract's defect and the deletion the wrong fix.

**A fallback branch is measured for members before its value is corrected, and a coordinate born in a
rename commit matches nothing by construction.** From `REC-155`, and it is `REC-153` one register up:
`_pipeline-self-report.md` sent an orchestrator with no target cell to `## Global prompt executions`,
and the row asked for the real heading. Two measurements changed the answer. `git show` on the birth
commit: the same commit **renamed** the tracker's real section (`## Global prompts…` →
`## Global pipeline prompts…`) and **added** a neighbour (`## Single-shot prompt executions`), and the
clause written in the same breath is a **blend** of the two — false on day one, matching no version
before or after, and invisible to `git log -S` because nothing ever edited it. That is `REC-139`'s
silence reached from a third cause, after `REC-141`'s merge: when the birth commit is a **rename**,
read what it renamed *from* as well as *to*, because a blend matches neither and answers no pickaxe.
Then the branch's own population: all nineteen orchestrators have a cell or row, so `otherwise` had
**zero members** and the fix was to delete it rather than repoint it. **Count who takes a fallback
branch before repairing what it says** — an escape hatch nobody reaches is deleted, and the boundary it
owed is stated in its place. Where the consumers disagree about whether to state a coordinate at all,
the family decides: three of nineteen quoted a `##` heading and the one that rotted is the one whose
heading never existed, so the contract now names none and defers to the file that owns them.

**When one copy of a duplication is damaging and its siblings are not, the discriminator is which
shared contract each consumer executes.** Also `REC-155`. The row called `README.md` l.349 "the one
per-prompt cell that repeats the universal `_run-tracker.md` row"; re-measurement found **three**
tracker repetitions and **six** report ones — one worded as *"the Verify J/M/S tracker cell"*, which no
filename grep returns (`REC-069`'s shape rule again). Only l.349 was fixed, and not for being the only
one: `_pipeline-self-report.md`'s declared-file list adds **both** universals, so an orchestrator's row
repeating either changes nothing that is checked, while `_single-shot-self-report.md`'s Step 1 adds
**only the report** and runs *before* the step that writes the tracker — so the one repetition sitting
on a single-shot prompt turns an honest close-out into a self-reported skipped step. Enumerate a
duplication's copies by the **contract their consumers run**, not by the file they sit in; the ones
that fail bar condition 3 go in the `## Closed` line, and the row's own "the one X" claim is corrected
in writing (step 2).

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

**Two prompts may both compute the same thing.** From `REC-042`: what they share is the *rule*, never
the computation. It is **illegitimate** when the second analysis runs inside the same pipeline, on the
same question, feeding the same artefact; it is legitimate when the gap sets differ in scope, when
routing one through the other would close a dependency cycle, or when their lifecycles do not meet —
`REC-042` turned on all three. Re-apply that argument, with its negative case, rather than
re-litigating it whenever two prompts appear to duplicate an analysis.

**Two colliding clauses are not automatically two statements of one rule, and the test has three
branches — settle which branch you are in before ruling either one operative.** From `REC-074`,
`REC-123` and `REC-152`; each branch's tell is a contrast with the other two, so a row reading one of
them alone gets that contrast from nowhere. **Branch one: they
are in different vocabularies, nothing maps them, and they cannot be compared at all.** `REC-074`'s
simulation level-close gate was written twice — "no correction is open" in the standard, "no MISTAKES
row is open" in the prompt that executes it — and they were not a stricter and a looser version of one
test: one names a **step state**, the other counts **rows**, and the mapping between them was written
nowhere. Nothing could adjudicate them, which is why the row that found them proposed a mechanism and
got it wrong. So before aligning two statements of a rule, check whether they are in the same
vocabulary at all; if they are not, the fix is to define the mapping in the file that owns the rule,
and only then align the wording — aligning wording over an undefined mapping just picks a winner. Two
smells that a gate has drifted into a second vocabulary: it **counts rows in a file that holds more
than one kind of row** (here `## Friction`, which the same standard calls not a correction backlog, was
silently inside the test), and it **scopes what the owning definition does not** (here `for the level`,
which made the level-agnostic original the stricter of the two across levels — the reverse of what the
row claimed). **Branch two: each governs a different *dimension*, both vocabularies are legitimate,
and neither clause loses.** From `REC-123`, where the simulator ordered every open-mistake question
first while full mode capped consecutive questions from one topic, with no precedence stated. The row's
own real-defect branch ("add precedence or interleaving") invites picking a winner, and neither clause
deserved to lose: one assigns **rank**, the other constrains **adjacency**, and a single sequence
satisfies both because they quantify over different things — so name the dimension each rule governs,
in the file that states them, and the collision dissolves into an order both admit. The tell that you
are here rather than in branch one: each clause stays true under every session the other permits, and
only their sequencing was ever undefined. Such a rule still owes the boundary where the dimensions
genuinely run out (`REC-146`) — here, a remainder that is all one topic, **and** a deferral pushed past
the session's last position, which the fourth reviewer found and which is the harder half, because a
rule phrased as "it gets asked later" is silently false wherever there is no later. **Branch three is
branch two's converse, and the two vocabularies are what hide it: two clauses over *position 1* are one
rule stated twice, however differently they word it.** From `REC-152`, the same file one
section down. `simulator-prompt.md`'s `### topic` named its starting question by ⭐ tier and previous
Débil while Step 3's rule 1 ranked an open-mistake retry first regardless of tier — two vocabularies
again, but **position 1 is a rank**, so both governed the one dimension and only one could hold. The
separating tell is branch two's own, inverted: there each clause stayed true under every session the
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

**A rule forks against *itself* when its trigger is narrower than its scope.** Also `REC-065`, and the
companion to the restatement rules above: `REC-062`'s read licence table has always had three rows, while
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

### Prerequisites, gates, terminal effects and modes

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
path the YAML `description` is a third such document. **Also `REC-156`, `REC-124`'s second instance in
the same file, which names the *test* for which
document carries the rule.** The obligation that `simulation-review` writes the tracker's
`Route progress` cell was stated twice, both times in `_run-tracker.md` and neither time in a document
the run opens. What settled the site is an **asymmetry between the two self-report contracts**, and it
costs one grep: `_pipeline-self-report.md` says «your orchestrator's own **cell or row**, in whichever
of the tracker's tables holds it», while `_single-shot-self-report.md` hardcodes one heading — so an
orchestrator's non-generic cell needs no per-prompt sentence and a single-shot prompt's does, which is
why both siblings that solved this solved it *in their own prompt*. **Before ruling that a shared
contract is the site, read the contract's other half: where one carries the generality and the other
does not, the per-prompt sentence is the fix, and widening the contract edits twelve prompts to repair
one.** And both defects that repair itself wrote were in text that merely *framed* the mandate, neither
present in the finding: **a parenthetical added only to disambiguate carries the mandate's full truth
burden, and it is written from the one mode the drafter had in mind**; and **when a fix mandates a write
into a table, re-read that table's intro sentence** — a summary written when the table had one
meaningful column stays false as columns are added, because nothing is wrong with the column that was
there first.

**A terminal gate disposes of the run, not of the evidence steps before it already proved — and an
exception set written as closed is re-counted against every clause the same fix adds.** From `REC-158`.
`system-check-prompt.md`'s 4d forbade a blocked run to proceed to "recommendations", which swept up the
`source-contradiction` discharge sitting downstream in Step 5, while Step 7 still required the report to
print the `REC-NNN` that discharge assigns and failed the gate on a row lacking one — unsatisfiable by
construction, and the proved findings died when the next run overwrote the report. The rule generalises
past this prompt: when a row says a blocked, rejected or refused branch loses work, ask what that branch
is a verdict **about**. A gate rules on the run's *conclusion*; a step that met its own evidentiary bar
earlier is a fact the verdict does not reach, so the repair names the bar (here 4b) and carries every row
that met it, rather than moving the discharge. Two things the repair costs. **The branches that genuinely
must withhold it are the ones where a *later* gate contested the evidence or the write** — a cold
reviewer's `reject`, a validator reversal — and they are enumerated, because every path not named then
defaults to discharging, which is the safe direction. And **the enumeration is what breaks**: this fix
wrote "exactly two" in three places and then added, elsewhere in the same diff, a carry-forward that was a
third legitimate producer of the same withheld value — a closed count stated in one clause and falsified
by another the same author wrote. `REC-064`'s fork rule with a number attached: where a fix states a set
is complete, re-derive the set from the finished text, never from the intent.

### Checks, populations and the validator

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

**A check over a hand-written convention settles three things before it exists — the convention's
*forms*, the *column* the value sits in, and the *value* itself — then publishes its own reach as a
number, and reads the text as written rather than flattening it to match.** From `REC-067`, `REC-084`
and `REC-090`, in that order of discovery and read
together because a check settles all three or none: the first is `REC-076`'s corollary made concrete,
and the third is `REC-074` one level out — the terms of the **selector** must be settled before the
check exists. **Forms first.** The config block invariant 6 had to parse is written
two ways — the heading inside the fence and the heading above it — both legitimate, and a third shape,
the `## How to use` recipe block, wears the identical `KEY = value` syntax without being a contract; a
locator written from the first file opened reported 15 of 31 prompts as broken. So **measure the
population's shapes before writing the pattern**, and where two forms are both canonical accept both
and say so, rather than normalising 24 files to make one regex simpler. **Then the column, because a
row is not a name either.** Also `REC-084`, whose defect was written by the fix to a cold reviewer's
own finding and caught only by the second reviewer pass: section 1 duly has two forms — an English
exercise table and a Spanish revision table — so any locator keyed on a header reads one and calls the
other's five files typos, and reading table **rows** is blind to the header and fixes that. But only a
row's first cell holds the authorised file; every other cell is prose that legitimately names *other*
files, and five of the twenty rows already do. Widening from the first cell to the whole row, to fix a
row that could name two files, re-opened the exact hole the check exists to close, and re-opened it
*silently*, because the five extra names it swept up were all authorised elsewhere and the published
count did not move. Narrow to the column that holds the value; a harvest that reads a neighbouring
cell is reading a sentence, not a contract. **Also `REC-157`, one level in: inside a single line, the
*field position* is the column.** Its first draft demanded a cold-review verdict of any closure line
matching a hash anywhere, and two rejected rows cite hashes inside the reason that declines them — so
it would have failed rows that gated no edit, while its template test would have failed its own
closure line for quoting the template it was written to catch. Anchor every test to the field the
schema puts the value in, never to the value's shape. **Then the value, because a shape that is
measured but not required is an exemption nobody published.** From `REC-090`. `Status: applied in
<hash>` meant "the prompt was edited" in both self-report contracts and "the run's output was
committed" in one report on disk, and nothing had ever compared them, so the first thing the new
invariant would have done is fail a report for a defect it had not detected: right that something was
wrong, wrong about what. Enumerating four `Status:` shapes and five verdict shapes still left the
*value* free, so `Status: applied (commit abc)` fell out of the population with no error and no
counter — an escape available to exactly the context the check exists to constrain. **And the reach is
a number, not silence**, because a comparison that quietly compares nothing passes exactly as loudly
as one that compares everything: **the PASS line carries the counts and they are incremented where the
comparison happens** — invariant 6's first draft printed the runnable-prompt count in place of the
pairs actually compared, true only by an argument the reader of that line cannot see. Half of its keys
are metavariables it cannot settle; that half is a published number and a named limit in `README.md`.
**`REC-090`'s second lesson, on the reading side of the same check: normalising a text to heal a wrap
must be bounded to the wrap.** Healing five hand-wrapped forms by flattening every newline in the file
made a paragraph ending "…went to the cold reviewer:" and a next one opening "approve" into a passing
gate, and it made any report quoting its own contract pass too. One optional newline per seam of the
token covers the identical five forms and cannot cross a blank line. Both defects were introduced by
the fix, neither was found by a six-case injection pass, and both were found by the cold reviewer —
the fourth row running whose worst defects were written by its own repair.

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
**Also `REC-172`, which adds the clause that makes this rule a sweep rather than a repair: a check's
exemptions are read *as a set* exactly once, and everything that narrows what the check can see is one
of them — including the two nobody writes down.** Its three named defects were each found by a
different accident, one per run, which is the evidence that the set had never been read as a set; the
sweep then found three more, and both cold-review rounds found one each after that. Two of the six were
not entries in any list: the **population the check scans** (both launcher catalogues were outside the
only invariant that reads their paths, in files two other invariants already treat as machinery) and
the **roots its pattern recognises** (`system` and `_internal`, 49 citations between them, silently
outside the invariant rather than knowingly exempt). So enumerate from the definer — the file itself,
read whole — and for **each** exemption name the case it was written for **from its own comment**, then
verify the pattern selects that case and nothing wider *and nothing else that needs it*. The forward
direction is the cheap half; a comment describing a class the glob does not select is the defect that
survives for months, because the check never fails. And when a fix's own sweep keeps returning one more
site of the same shape, that is the two-round cap working: the residue is a row, not a third repair.
**And `REC-174`, its residue, which adds the two clauses a list of names cannot supply. A set may hold
more than one CLASS, and until the classes are named apart it can be audited in one direction only:**
every exemption there was read as "content copied from a run", so the files exempt for the opposite
reason — authored, and the runtime is their subject or their quoted evidence — were invisible as a
group, and one of them sat in the filter carrying no comment at all. **And when the repair elects a
definer, the definer's own completeness is part of the fix**: this one named `_system-map.md` §7 as
what decides who wrote a file, and §7 had no row for one of the six files the same commit was adding —
the cold reviewer found it, not the sweep, because a sweep reads the population it rules and not the
oracle it cites.

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

**A promised invariant is a claim about an algorithm, and the only way to adjudicate one is to execute
the text.** From `REC-140`, where `tracker-prompt.md` promised "Idempotent … never duplicates folders or
rows" in its rules while its `log` steps read the tracker and appended unconditionally. Two things
follow. **The ambiguity branch of such a row is only available while some mode still satisfies the
promise**: narrowing "never duplicates" to exclude the one mode that creates rows and folders would have
left the rule with no subject at all. And **the identity a guard tests belongs in the file that owns the
artefact** (`REC-064`) — the shared standard the row also named never mentions rows, folders or identity
and is read by five prompts, while the pair the guard needed was already in use twice in the prompt
itself.

**A compliant site hides from a name grep exactly as well as a defective one.** Also `REC-121`, and the
sweep-side companion to the rules above: of the twelve prompts in the population, the one that had
*solved* the defect was invisible to every search for `run-start` or `_last-run-report` because it
named the file by paraphrase — "the previous review self-report". Had the sweep stopped there it would
have counted a correct file as broken and edited it. So **enumerate the population from something that
defines it** — here the prompts naming `_single-shot-self-report.md`, a set the validator independently
asserts the size of — **and then classify each member by reading it**. Grepping for the defect's
wording measures the wording, not the population.

### Evidence — what is a row at all

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
routinely finds defects elsewhere, and filing each of them as `open` is how the ledger came to refill
itself as fast as it drains. The bar is the one the close-outs already use: **would a run produce a
different output?** A finding that fails it is recorded in the `## Closed` line of the row whose review
found it, and left there. That is not the carrier mistake the promoted-residues paragraph warns about —
the opposite. **Open work** parked in a closed line is wrong because nothing re-measures it; a finding that
fails the bar is not work, and nothing *should* re-measure it. What distinguishes the two is the bar, so
apply it at the moment the reviewer returns, never later. `REC-077`, `REC-078` and `REC-081` are what
skipping it looks like: three rows carried for weeks, each self-documenting that nothing wrong had ever
shipped, all three closed as `rejected` on 2026-08-10 without a line of code changing. **Also
`REC-058`, the same rule on the other intake, and it adds what that channel can and cannot see.** A
skill failure is evidence, not automatically a recommendation: the source contract is
`_session-rules.md` → "When a skill cannot finish — durable friction", only an observable failed
declared step writes `FRIC-NNNN`, and the next runnable prompt close-out must still apply the same
four-condition bar and locate the real owner before creating or updating a `REC-NNN`. Successful and
expected paths write no friction. The loop deliberately cannot detect a skill that completes silently
with the wrong result, so its evidence is narrower than a prompt self-report — which is the general
point: **every intake admits less than its name suggests, and none of them admits a row.**

**Practice feedback is evidence, not coverage authorship.** From `REC-052` / `REC-059`. Each practice
track keeps a durable weakness sink that its own next run actually consumes: SQL and timed simulations
keep rubric-specific MISTAKES files; the three live interview surfaces share one sink and qualify rows
by surface. A weakness may focus reinforcement or produce an unrefined Q&A question through its owning
prompt, but it never authors or marks a coverage bullet. Coverage remains the market-defined ceiling;
practice records performance against it.

**An audit's verdict is only as good as where its value came from: the test is not whether the auditor
read the audited file, but whether the value the comparison rests on traces back to it.** Two ways it
does. **A derived extract of the object under review is worse evidence than the object, and no size
makes it better.** From `REC-079`. `/system-check` dispatched an analyst to extract every claim from the two maps
so the orchestrator could rule on the extract; two consecutive runs demoted the return, the second at 434
lines against 1101 in the maps themselves — 39% of the object, so bulk was never the reason. Two grounds,
and both generalise past this prompt. **An extract can omit invisibly:** a claim it drops is a claim the
audit then reports full coverage over, so the audit's completeness comes to rest on a list whose own
completeness nothing checks. And **the object was already in the room:** the sub-step sat three lines
above a rule saying the maps are "the objects under review, not the source from which the expected answer
is reconstructed", and contradicted it. Before dispatching a reader over an artefact you are auditing,
ask whether the orchestrator can simply read it — and delete the dispatch when it can. **Also
`REC-136`, which states the test the extract case is one instance of: a fact lifted from the audited
file is not evidence about it, and passing it through a subagent does not launder it.**
`/progress-update` quoted the `Status` cell of a project's own row into its step-status subagent's
launch instruction as a "hint", and let that hint override the `✅` markers; the status came back and
D5 compared it against the very cell it came from. The distance — a cold dispatch, a different file
read in between, a report contract with three declared items — is what made it read as measurement. So
an extract fails the headline test by **omission** and a quoted cell fails it by **circularity**, and
the second is the one that survives review, because distance reads as independence. Two
corollaries. A subagent's fence must name the **launch instruction**, not only the filesystem: *"Do
not read or write `PROGRESS.md`. You cannot see it"* was already written one screen above the block
that handed it a piece of `PROGRESS.md`. And **the honest return for an unmeasurable input is a named
non-value, not a substitute** — here `not derivable`, which is `REC-076`'s `unverifiable` arriving in
a second prompt; it must then be branched on where it is *consumed*, or the gate downstream inherits a
pass nothing earned.

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

**Evidence whose value is recurrence needs a store that can be *counted*, not merely one it can be
*recovered* from — and a rule breached repeatedly stops being a discipline lapse.** From `REC-168`, whose
step 1 falsified its own row: the breaches it called sinkless were all recoverable from `git log -p` on
the overwritten reports, so the deficiency was never storage. It was that the record is free prose spread
over 181 commits with no normalised "which step" field, adjudicated by the most saturated context in the
system, which is a store nothing can count from. **The recoverable/countable distinction is the test to
apply to any proposed third sink**: ask what question the consumer must answer at the moment it reads,
and whether the existing store answers it in one glance or one archaeology. The second half generalises
past this row: a bar that classifies a broken clear rule as the executor's fault is right on the first
occurrence and wrong forever after, because it is exactly what stops a repeat ascending to a fix — so any
such clause needs a **count** above which the verdict flips to *the rule is mis-worded or mis-placed*, a
floor for the ambiguous repeat and never a waiting period for the breach whose defect is plain the first
time. Its corollary is `REC-054` (b)'s, reached from the other side: the threshold is also what keeps the
new sink out of the refill loop, since a row that opens a `REC` on sight is the operational worklist the
ledger's preamble forbids — evidence is promoted by the count, never by arrival.

### Row dispositions — `absence` and `contradiction`

Two of the intake routes hand over a row that is deliberately only half-decided, and each names the
branch its own prompt was forbidden to settle. Both blocks below moved here from the ledger's `## Open`
preamble on 2026-08-18: they say how a row of that shape is *resolved*, which is this file's half, not
what is queued.

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

### Ownership, writers and the two maps

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

**Also `REC-159`, on the read trigger, and it is where the sizing rule lives: a licence to rule on a map
is measured against the *standing statement* of what that map owns — `/system-check`'s `## Purpose`
field list — never against the rows the licence happens to name.** Counted that way, `map-sync`'s read
path licensed two of `README.md`'s nine per-prompt facts, three of `_system-map.md` §9's five per-skill
columns, and no `README.md` cell at all for a `SKILL.md`; the gap had been invisible for as long as
nobody had counted the licence against a denominator. Two corollaries it paid for. **A rule's owner is
rarely the file the row names, and its restatements are sites** — the row named `map-sync`'s `SKILL.md`,
the licence's owner is `_session-rules.md`, and a fourth copy in `_system-map.md`'s own preamble was
found still a scope behind by the cold reviewer, not by the sweep. **And a dated measurement is *old*,
not false**: §13's counts carry one measurement date, so re-measuring a single row puts two dates in one
table — such cells are excluded from a per-file licence and re-measured all at once or not at all.
**Also `REC-161`, the same denominator from the reverse direction: a field the `Purpose` list names is
owned by that map, not thereby owned *whole*.** Where the map's own intro qualifies the cell ("the
boundary or gate **most likely to be confused**"), the evidence direction has no rule to quote and must
convert the silence into a `missing claim`, so the fence goes **in the map, beside the cell** — the
reconciler is handed the manifests and the two maps and nothing else, which is what decides the site
between the map, the read licence and the mandate. Re-fence noun for noun against the column's own
header, and **never by asserting the neighbouring columns are complete**: that complement is a closed
enumeration (`REC-149`), and the table directly beneath it falsified three of the four in one review
round. **Also `REC-163`, one register down: a fence may not assert a universal about the cells it
introduces either.** Write the convention as a *search instruction* — "read all three places before
ruling a role absent", "expect a count where the prompt states one" — never as an invariant, "never a
count", "a stage with no file behind it is named in this cell". One cell falsifies an invariant, and
both of that row's rejections were falsified by cells the same commit had just written.

**`REC-162` carried that fence to a whole column, and two clauses had to be added before it worked.**
**First, name the landing.** A licence that keeps a fact out of a cell is not self-executing: the
reconciler's own vocabulary pushes back on it. Its only escape hatch reads `source-only **by ownership
split**` — *another owner holds this fact* — and its third disposition ends "a manifest fact with no home
in either map is corrected exactly like a false claim". A licence that disclaims being an owner therefore
lands back on `missing claim` unless it states, in the map, which disposition it is the rule for. Write
that sentence. **Second, bound the licence by *why* the file is read.** An unbounded "this absence is
never a finding" also licenses deleting the cells that carry a real claim — a named section held by one
concern, or a file the run **audits** rather than reads for background (`system-check` carries
`_session-rules.md` inside the inventory it rules on). Name the owed cases beside the licence, or the
fence quietly removes the findings it was written to preserve. Both clauses came from the cold reviewer,
neither from the sweep.

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

**Deleting a role does not delete its assignments.** From the cold review of `REC-076`/`REC-079`, which
returned `reject` on exactly this. Removing the map-claims analyst also removed the **only manifest owner**
of the two maps, which Step 1 lists as inventory items under a rule that every audited file have exactly
one owner — so `unassigned files = 0` became unsatisfiable, the completeness gate could never close, and
**every future run would have been structurally `blocked`**. Nothing in the deleted step said it carried
that duty; the duty lived in a denominator two steps away, and the edit that broke it touched neither.
When a dispatch, writer or gate is removed, re-measure every count, denominator and acceptance clause
that could have been silently satisfied by it — the deletion is never local to the step that held it.

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

### Sweeps, sites and the shape of a fix

**A whole-file read-modify-write must be byte-exact, and the diffstat is the tell.** Also `REC-155`,
whose first cold review opened on it. A patcher that decoded a UTF-8 file and re-encoded it on write
double-encoded every `—`, `§`, `⚠` and `✅` in three files — including a tracker that uses `⚠` and `✅`
as **data** — while the intended edit was itself correct. Nothing in the prose looked wrong; the signal
was `git diff --stat` reporting 166 changed lines for a six-line edit. On this repository
(`core.autocrlf=true`, CRLF on disk): read and write **bytes**, normalise line endings around the
replacement and restore them after, and **read the diffstat before dispatching the reviewer** — a
surgical edit that reports the whole file changed is an encoding fault, not a big edit. It is
`REC-084`'s non-ASCII trap on the editor's side of the same repository, and it cost a review round.

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

**When a fix turns an unconditional rule into a branched one, every site naming the old return now
states the wrong half.** Also `REC-136`, where the tightening reached the rule (D5) and the report
step (E) and missed the dispatch note (Step A) still telling the orchestrator that return "is a drift
row" — one file, three sites, and the missed one is the instruction read first.

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

**When a fix invents a new form of a persistent name, every reader of the old form is now wrong.** Also
`REC-140`, and the write-side twin of the branched-return rule above: admitting a second application
under `<empresa>-<puesto>-<YYYY-MM-DD>` left that dated folder **write-only**, because the mode that
consumes it still hard-coded the undated path and the creating step's own parenthetical re-stated it —
both blocking findings of the review were in text the repair had just written. A new variant with no
reader is not a smaller fix; it is one that reverts itself at the first consumer.

