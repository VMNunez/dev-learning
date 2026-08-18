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
   **`REC-145` is its second instance, from the *repair's* side, and it generalises into a rule about
   names: a prohibition's name is routinely narrower than the sentences filed under it, and the two
   rot apart.** `_sql-exercises-practice.md` Step 4's *one file, one schema* carried two claims — a
   **schema** claim (no file gains a second SETUP block) and an **append** claim ("nothing is ever
   appended to it again", "start the next numbered file"). Only the first is what the name defends;
   the second was the *route's forward file choice* wearing the schema rule's name, and it was false
   for an off-route batch generated against the file's own schema. The row's three offered
   dispositions were each right about one half and wrong about the other — the real defect was the
   schema half, the ambiguity was the append half — so **split a rule at its own name before
   adjudicating either half**, and expect a row that reads as one contradiction to be two. The cold
   reviewer is what catches this: a repair that cites the paragraph as its warrant will quote the
   heading and mandate what the sentences forbid.
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
   **A topic whose source is in another language is routed, not exempt.** Also `REC-151`. The row argued
   `javascript` had no project behind it "since the stack is TypeScript"; its coverage file carries 33
   `✅` markers across projects 01–06, so the constructs are Victor's real code and only the file
   extension differs. An escape clause scoped to a **construct** ("no project contains it") is not
   available to a whole topic, and a file-extension search is not a measurement of what a topic
   demonstrates — the coverage markers are.
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
   **A fix that adopts a sibling's house phrasing inherits its live exceptions, not only its rules.**
   From `REC-154`, whose reviewer found the repair had copied `roadmap-review`'s four marker-reading
   rules and dropped the **dated exception** printed immediately under them — the tier whose markers are
   not backfilled yet, where an unmarked bullet is a *missing marker* rather than an absent project. A
   house phrasing is quoted precisely because it is already right, so the paragraphs around it are the
   ones nobody re-reads: take the qualifier that lives beside the rule, or state in writing why it
   cannot bite on the new site.
   Round N is handed round N−1's return, whose *considered and not opened* list binds it — a cold
   reviewer re-litigating a settled adjudication is the loop, not the check.
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

   **A closure has a budget, and it is one line plus at most one promotion.** Written 2026-08-18, when
   this file was cut from 324k characters to a third of that. The engine that produced those 324k was
   not the open rows — they were 3% of it — but a closure that cost about 5k every time: a `## Closed`
   "line" of a thousand characters restating the whole resolution, two or three fresh preamble rules,
   and a retrospective paragraph under the order section. All three failed a rule this file already
   carried. So: the closure line is the schema above and nothing more, and the reasoning is in
   `git log -p` on this file, where the row's own commit already put it. A rule the row established is
   **merged into the rule it is an instance of**, cited as `Also REC-NNN` with the one clause it adds —
   a new standalone rule only where no existing one covers it, which is rarer than it looks. And the
   pricing lesson goes in the row-shape table below as a row, never as a paragraph. If the closure will
   not fit that budget, what is over-running is the promotion, and the test is whether the extra text
   states a rule a future row must obey or retells the case that produced it.

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
| A row whose fix is a **deletion** | the check a deletion owes and an addition does not (`REC-153`, `REC-142`) | name the clause chain that still carries the boundary the duplicate was covering |
| A row whose fix only makes an existing path more **visible** | the map rows describing the file's *kind* (`REC-113`) | `maps unaffected` is easiest to get wrong where nothing the fix wrote is new |
| A row that adds **no check** | the reviewer, because the injection budget does not apply (`REC-091`) | on a row that adds no check, the reviewer *is* the check |
| A row that keeps **failing review** | rounds, and a fix that grows every pass (`REC-092`) | it is not under-built — check whether it is being answered at the wrong altitude, and count the rounds |
| Any row, at the sweep | the *column* of the artefact that holds the value, not only the file (`REC-084`) | run `validate-prompt-system.ps1` before the dispatch, not before the commit: a reviewer inherits step 1's population and cannot find a site the measurement was blind to (`REC-120`) |

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

**`REC-156` is `REC-124`'s second instance in the same file, and it names the *test* for which document
carries the rule.** The obligation that `simulation-review` writes the tracker's `Route progress` cell was
stated twice, both times in `_run-tracker.md` and neither time in a document the run opens, so no honest run
ever delivered it. What settled the site is an **asymmetry between the two self-report contracts**, and it
costs one grep: `_pipeline-self-report.md` says «your orchestrator's own **cell or row**, in whichever of the
tracker's tables holds it», while `_single-shot-self-report.md` hardcodes `## Single-shot prompt executions`.
So an orchestrator's non-generic cell needs no per-prompt sentence and a single-shot prompt's does — which is
why both siblings that solved this solved it *in their own prompt*. **Before ruling that a shared contract is
the site, read the contract's other half: where one carries the generality and the other does not, the
per-prompt sentence is the fix, and widening the contract edits twelve prompts to repair one.**

**And the two defects this repair itself wrote were both in text that merely *framed* the mandate.** Also
`REC-156`, both found by the cold reviewer and neither present in the finding. The paragraph disambiguating
`_run-tracker.md` from the prompt's seven bare `TRACKER` uses added «which Step 5 already wrote» — true of
`review` and false of the other three modes the same sentence goes on to enumerate: **a parenthetical added
only to disambiguate carries the mandate's full truth burden, and it is written from the one mode the drafter
had in mind.** And four lines above the edited paragraph, the table's own intro still read «this table records
the latest planning run only» — false of the very column the fix mandates, false since the commit that created
both (`REC-139`'s never-forked shape), and invisible to a sweep that greps for the *rule* instead of reading
the section. **When a fix mandates a write into a table, re-read that table's intro sentence**: a summary
written when the table had one meaningful column stays false as columns are added, because nothing is wrong
with the column that was there first.

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
established moves to the preamble first (step 4). **Nothing is lost by that:** the full reasoning of
every closed item is in `git log -p` on this file, which is where it belongs, because a resolution
written for the day it shipped stops being read long before it stops being true. What a future reader
needs from a closed item is the decision, not the argument — and if the argument matters again, the row
was not the right home for it.
