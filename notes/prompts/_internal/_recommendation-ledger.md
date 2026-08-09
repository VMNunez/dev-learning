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
   fix being factual does not make it safe.
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
source cannot say, and points for the rest.**

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

## Open

| ID | Source | Recommendation | State | Resolution |
|---|---|---|---|---|
| REC-046 | Victor, 2026-08-06 | **Finish the content-side interview-prep audit now that its machinery is current.** No per-topic authoring plan is needed: coverage bounds the level, market evidence selects the questions, and the fingerprinted bilingual Q&A bank remains the content worklist. The separate global CORE route is a study queue, not an authoring plan. `study-block-close` writes `[studied]` only after a PASS on an already `[refined]` stable-ID question. What remains is artifact debt: migrate/audit the banks, add current coverage fingerprints and bilingual stable-ID parity across the selected level, and then generate the CORE route | open | Machinery redesigned in the current interview-prep implementation; maps change with it. Keep both interview rows in `Study progress` at `—` until the full banks pass their current-fingerprint, stable-ID and parity gates and the route fingerprint is current |
| REC-052 | Victor, 2026-08-06 | **Build the simulations track as a real plan-driven flow, mirroring `practice/sql/` but adapted to simulations, Victor's level and target.** What exists today is two prompts (`simulation-generator-prompt.md`, `simulation-review-prompt.md`), a flat bank (`practice/simulations/{angular,spring-boot,sql}/`), `TRACKER.md`, and an **empty** `notes/prompts/practice/simulations/_internal/`. What the SQL track has and this one does not: a doctrine `PLANNING.md`, a per-level route built **from the coverage file** (`PLANNING-{LEVEL}.md` with steps, targets and a `Coverage SHA-256`), an audit that keeps that route true (`sql-plan-audit`), opening and closing rituals (`sql-block-open` / `sql-block-close` / `sql-step-close`), a grader that is the only door to the close (`sql-grade`), a friction record (`MISTAKES.md`), and gates wired to `PROGRESS.md`. The ask includes extra/`[Repaso]`-style batches for revisiting a technique, and PROGRESS.md updates from the closing rituals | open | Not applied — the biggest build of the seven, and the only one that is new machinery rather than a correction. Two things to settle before copying the SQL shape: (1) **a simulation is not an exercise** — it is timed, it is graded against a rubric, and its unit of progress is a whole test rather than a query, so "steps with exercise targets" may not map and the route may need to be keyed to §8c-style *unlocked techniques* instead; (2) the SQL track's own doctrine was rebuilt twice before it settled, so lift the **structure** (route from coverage, ritual per boundary, gates that close on evidence) and not the section numbering. Depends on REC-048 for where the simulation counters land in PROGRESS.md |
| REC-054 | Victor, 2026-08-06, alongside the two-map rule | **Once the prompt+skill system is declared closed, review it as one system and as a day in Victor's life.** The seam review still matters, but its original day snapshot is obsolete: the 13:30 block now has `interview-prep-block-open` plus `study-block-close`, authored/refined/studied state is separated, and the system has seventeen mirrored skills. The final audit must test the current 08:00, 12:30 and 13:30 loops end to end, including whether the interview opener's grading and the closer are cheap enough to run, what each block leaves unrecorded, and whether ritual load outweighs the work it records | open | Deliberately last. Run only after the remaining machinery items settle; read `_system-map.md` as the object under review and treat the current machinery commit as the baseline, not as evidence that the lived-day audit already passed |
| REC-055 | Victor, 2026-08-06: "¿le ves gaps al system-map?" — answered by reading the map against `_session-rules.md`, both self-report contracts, the ledger, `_run-tracker.md` and `validate-prompt-system.ps1` | **`_system-map.md` states the machinery and not the loop that maintains it — five gaps, all of them in the map, none in the system.** **(a) The improvement loop is missing entirely.** The map names `_recommendation-ledger.md` once in passing (L28) and calls the `_last-run-report*.md` files "the evidence used to decide whether a frozen prompt gets reopened" (§10), and stops there. Nothing in it says prompts are **frozen by design**, or states the chain that unfreezes one: run → the five self-report bullets → a `REC-NNN` row in four states → the four-condition bar (condition 3 kills most findings) → a **mandatory cold reviewer** → the edit, the two-map test, `Status: applied in <hash>` → and the run-start check that surfaces what an earlier run left `open`. A reader of the map cannot see that the system improves itself at all; this needs its own section, not a line. **(b) `validate-prompt-system.ps1` is absent from the map.** It is the only automated check that exists — 28 runnables, 28+28 launchers across both catalogs, each prompt's self-report contract, delegation targets — and it appears only in `README.md` L41, never in §10 or §11, which is where a reader looks for "what keeps this true". **(c) The §7 registry omits files that have real writers:** `_recommendation-ledger.md` (written by every self-report close-out), the `_last-run-report*.md` files, `_shared-context.md`, `_topic-ownership.md`, and the `personal/job-search/` outputs §6 describes but the registry never lists. **(d) `_session-rules.md` has no writer anywhere** — the most authoritative file in the system, and nothing states who edits it or when. **(e) There is no per-day view**, only the four chains: the blocks (08:00 / 12:30 / 15:30) and their uneven ritual load appear nowhere on the map, which is precisely the object `REC-054` says it will review | open | **(a)-(d) applied 2026-08-07 in `7bcc5bc`. (e) remains open** and is unchanged: it is written **out of** `REC-054` in Wave 7, never before it, or the map asserts a day the review then re-describes. **Maps affected — the map *is* the fix site, and `README.md` is the other map: its "what the system map adds" sentence named four things and the loop was a fifth, so both moved in the one commit.** The fix is a new **§12** (the frozen-prompt rule, the seven-step chain from run to `## Closed`, and the one automated check), seven §7 registry rows, a §11 row, and the opening enumeration corrected from three questions to four. **Two of the row's own details had gone stale and were falsified on re-verification:** the ledger is no longer named at L28 *by filename* at all (only "the recommendation ledger" in prose, so the map's single trace of the loop was even thinner than claimed), and the §7 header sentence — "every file with **more than one** potential writer" — was already false for four rows it contained (`notes-plan-{LEVEL}.md`, `verify-{LEVEL}.md`, `cv-bullets.md`, the briefs), so the registry's admission rule had to be rewritten before the new single-writer rows could honestly join it. **`cold reviewer: approve-with-tightening`, 3 defects and 9 tightenings, all applied.** The three defects were one class: **§12 restated `README.md` and `_session-rules.md` instead of pointing at them, and every restatement drifted within hours of being written** — the four ledger states were described as four *row* states when both contracts say an `## Open` row is `open` or `accepted` and the other two collapse it; the validator's trigger list was narrowed to three of its five kinds while the sentence below it claimed the invariants the two dropped kinds exist for (`REC-065`'s trigger-narrower-than-scope failure, verbatim); and "reports, never repairs" dropped the branch where the check **has teeth** — `validate-prompt-system.ps1` L396-399 hard-fails a plan claiming `current` against a moved digest, and only the `stale`-but-matching case prints `REPORT:`. Both were verified against the script and against a 13-file grep rather than taken from the reviewer. Promoted to the preamble as the second instance of *a rule restated is a rule forked*. **Made to fail before being trusted:** the first draft named the platform adapters by filename and the validator rejected it on `$exclusivePattern` — the same trap `REC-053` hit — which is the adapter-neutrality residue `REC-053` left, catching itself. Validator green, exit 0, 12/12 PASS (the 6 `REPORT:` lines are `REC-061`'s known false flags, untouched). **Verified correct and recorded as such:** the `_topic-ownership.md` row in both halves (its own admission contract requires explicit authorization; `coverage-prompt.md` L118-120 *stops* on an unregistered topic), that no prompt anywhere writes `_shared-context.md`, the `personal/job-search/` writer list (`/cv` and `/tracker` only — `/cover-letter` merely *suggests* a save path and writes nothing), and the 16/12/28 split derived independently from both launcher catalogs. **Two adjacent findings this work turned up, filed as `REC-066` rather than fixed here** |
| REC-059 | Same read, 2026-08-06 — a required part of `REC-052`, filed separately so it is not dropped | **The interview-practice track produces weak areas and has nowhere durable to put them.** `REC-052` asks for the simulations track to become plan-driven like `practice/sql/`; this is the half of that mirror that is easiest to leave out and is where the SQL track's value actually comes from. In SQL a failure becomes a `## Open` row in `MISTAKES.md`, which the R1-R5 revision points then consume as their focus — a closed loop. `/simulator`, `/simulation-review`, `/hr-screen` and `/code-review-practice` produce the same signal (the question missed, the concept that collapsed under a follow-up, the review defect not spotted) and it lands in chat and dies there: `practice/simulations/TRACKER.md` records **status, never weakness**, and nothing downstream reads a weakness at all. The consequence is that Chain D (market → coverage) remains the only closed feedback loop in the system, while the engine that most directly predicts an interview outcome teaches nothing upstream | open | Not applied, and it belongs **inside** `REC-052`'s build rather than beside it: a track with a plan and a tracker but no mistakes file reproduces the exact gap this row names. Two decisions it forces: whether the sink is one file or one per surface (SQL's is per-track for a reason — R1-R5 read it), and whether a repeated weakness may **write** a coverage bullet or only point at one, which is the same authoring-vs-marking boundary `coverage-bullet-add` and `coverage-mark` already draw |
| REC-061 | `REC-057`'s new fingerprint check, first run 2026-08-06; evidence traced 2026-08-07 | **Two of the four `⚠ stale (fingerprint only)` flags `REC-035` wrote are false, and the tracker holds the proof.** (Four is the flag count in `_run-tracker.md` — Angular, General, Java, Spring Boot; eleven was the number of plan *headers* `REC-035` set to `Plan status: stale`, a different population.) `notes/java/` and `notes/spring-boot/` carry `Plan status: stale` in their plan headers and `⚠ stale 2026-08-04 (fingerprint only)` in `_run-tracker.md`, while their stored `Coverage SHA-256` matches the live coverage file **to all 64 characters** under the canonical command. The tracker's own `Plan J` cell for Java reads *"2026-08-02 — completed — … SHA b8216257; stale flag consumed"*, and `b8216257` is exactly what is on disk today: the plan was regenerated against this coverage, consumed the flag it was owed, and was then re-flagged two days later against a fingerprint that had not moved. `REC-035`'s row states these two "map every current bullet and are stale on the fingerprint alone" — true of Angular and General, whose digests really do differ, and false of these two. **Suspected cause, not yet confirmed: `REC-060`.** The digest is CR-sensitive and depends on which `sed` computed it, and these coverage files have mixed CRLF/LF line endings, so a measurement taken with a different strip would produce exactly this pattern — false mismatches on some files and not others | open | Not applied, and it must not be applied as a lint. **Three things to settle in order.** (1) Confirm or reject the `REC-060` link by re-deriving `REC-035`'s measurement — if the digest command is the cause, the fix belongs there and the other nine flags need re-measuring too, because a measurement that was wrong twice may be wrong more often. (2) Only then decide the two flags. Clearing them is a **factual correction, not the forbidden repair**: the caveat protects against clearing a flag while the coverage has genuinely moved, and here it demonstrably has not — but that argument only holds once (1) says the digest can be trusted at all. (3) Whatever is decided, it lands in **three** places or in none: the plan header `Plan status:`, the `_run-tracker.md` cell, and — if the cause is systemic — `REC-035`'s remaining nine. The validator prints this every run and will keep printing it, so it cannot be lost while it is open |

## Closed

One line per resolved item, in the order they were raised. The full reasoning of every one of these
lives in `git log -p` on this file; what survives here is the decision, so a later reader can tell what
was already settled without reading 90k characters of history.

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
- `REC-012` — **rejected.** An adjudication rule for cross-concern ripples: the existing protocol reached the right result in both runs, so this was friction, not a defect. The cold/warm re-dispatch question is recorded so it is not re-proposed — `—`
- `REC-013` — `_planning-standard.md` §14 gains a real visual system (design tokens, motion, accessibility, visual QA) and a pass line that enforces it — `279c1c9`
- `REC-014` — invariant 12: every §10 endpoint is called from §13 or explicitly ruled backend-only with a reason — `984ff41`
- `REC-015` — a seventh `plan-audit` specialist, `whole-plan`, reads the plan end to end against twelve fixed checks and always returns twelve trace rows — `013f1bb`
- `REC-016` — self-report bullet 1 must name its evidence: traces support "the machinery ran", never "the output is sound" — `fe4274c`
- `REC-017` — same-level English-only renumbering permitted under standing authorization; cross-level relocation stays bilingual-only, and fake Spanish copies are forbidden — `62f5673`
- `REC-018` — an uncalibrated level is not a first run; only an admitted, empty junior topic activates boundary migration — `8addfcd`, `ee7f23b`
- `REC-019` — an unassigned note does not reserve its prefix: it is renumbered above the route's last entry and reported as `renumber NN -> MM (unassigned)` — `7a90dfc`
- `REC-020` — the SQL route owns the revision points' spans and triggers; the doctrine keeps only the cadence and may not restate them — `49c1e62`
- `REC-021` — `ROADMAP.md` scoped rather than dropped as a route-planning input: two named sections, not the whole file — `49c1e62`
- `REC-022` — **rejected.** A per-step `Learning outcome` field: `Done`, `Q&A seed` and `Concepts` already carried it, and adding it would have invalidated all 14 steps of a just-committed route for no output difference — `—`
- `REC-023` — `sql-plan-audit` row 4 owns the **whole** doctrine; the other rows' sections are exhaustive, its are not — `5d252c6`
- `REC-024` — a SQL step ends when its exercises are scored; both removed done-condition formats are forbidden by name, and the track writes no interview questions — `c89c415`
- `REC-025` — "they never overlap" was false and predates the run: specialists own **one concern each, never a section each**. **Precedent recorded:** bar condition 3 kills *additions* that earn nothing, but a false statement in a dispatch document is a defect regardless. That is the whole of what it established — **it never licensed skipping the cold reviewer**, though five later rows cited it for exactly that; step 3 of the preamble closes the misreading — `7348bad`
- `REC-026` — every coverage preservation rule names **both** marker kinds, with the drill marker ordered left of the project marker's free-text clause — `e039aea`
- `REC-027` — the `⚠ stale` tracker flag gains a **second** writer (`coverage` Step 6.6, not `coverage-bullet-add` alone), and `Plan status: stale` gains its **first**: `coverage` sets it on every mismatched plan inside its own commit, and `notes-plan` resets it — `e039aea`
- `REC-028` — the `notes-audit` dependency gate accepts `complete` **or** `refined`; unconsumed pending additions are reportable, never blocking — `e039aea`
- `REC-029` — `coverage-verify`'s format block declares `Verdict: superseded`, the third value only `coverage-prompt` writes — `e039aea`
- `REC-030` — `notes-plan` and `notes-audit` gain the mandated run-start read of their own `_last-run-report*.md` `Status:` line — `e039aea`
- `REC-031` — a full recalibration takes `LEVEL`-targeted gaps from sibling findings files, judged under the same rules and never mutating the sibling — `e039aea`
- `REC-032` — the three shared-root inputs are repository-relative in both coverage prompts; the two genuine folder-relative ones stay — `e039aea`
- `REC-033` — the progression gate has one definition, in `_coverage-standard.md`, and named observable evidence for closing it — `e039aea`
- `REC-034` — three mismatches: sibling coverage added to the read list, outcomes reduced to `completed`/`completed — no-op`/`blocked`, and renumbering corrects its tracker rows — `e039aea`
- `REC-035` — every overtaken cell carries a measured `⚠ stale` flag, with a `(fingerprint only)` form beside `(+N bullets)`; eleven stale plan headers set — `e34f47a`
- `REC-036` — `plan-audit MODE = new` rewired off the deleted `PROGRESS.md` sections onto the `✅ NN-slug` evidence markers; §3/§4 become "first **demonstrated**" — `bb16566`, `5c39d11`
- `REC-037` — `/project-brief`: the next-project choice becomes a durable, dated, contestable one-page brief with its own freshness fields, and the gap analysis moves out of the plan author — `fdea4d8`
- `REC-038` — five smaller `plan/` defects; two of the five diagnoses were themselves wrong, one moved to `REC-039` and one folded into `REC-036` — `95a9626`
- `REC-039` — `progress-update` becomes an **auditor**: an ownership table per section, one write (the level matrix), a `git diff` guard, and the dead concept-extraction half tombstoned — `2417c25`
- `REC-040` — the catalogue heading promised "a slash command of the **same name**" and it was false for **21 of the 28**: twenty drop the `-prompt` suffix, and `code-review-prompt` launches as `/code-review-practice` because `/code-review` is the host agent's own built-in diff review. Fixed as one paragraph where the catalogue is read and **not as a rename** — the divergence is correct, and a contributor who "repairs" the odd one out re-collides with the host command. **Re-verification falsified the row's own numbers:** it was written against 27 prompts (20 false, 19 suffix-drops) and `fdea4d8` had already made it 28, and its closing clause — "no automated check contradicts line 73" — went stale with `b2d0e08`, which made the validator read the command from the launcher's own filename. **Cold reviewer: `approve-with-tightening`, 4 defects**, and the one that mattered was inside the fix's own new sentence: "the seven `*-audit` prompts have no suffix to drop" is true read file → command and false read command → file, so a reader deriving `/coverage-audit` → `coverage-audit.md` lands on a path that does not exist — in the paragraph whose whole job is preventing exactly that. Promoted to the preamble. It also caught the validator claim overstated twice (L518 *does* still reconstruct, as a fallback for a prompt with no launcher; only `.claude/commands/` is read for the name) and **confirmed independently that no other site asserts a naming rule or names a command wrongly** — every `/token` across `notes/prompts/`, both adapters and the launchers resolves to a launcher, a host built-in, or `/system-check` correctly labelled as not existing. **Maps affected — `README.md` is itself one of the two maps and is the fix site; `_system-map.md` unaffected**, it asserts no naming convention anywhere and already names `/code-review-practice` in its §7 registry. **Residue, still open:** `progress-update-prompt.md` L369 writes `/coverage-mark` for a skill — the only slash token in the machinery that is neither a launcher nor a host command — left alone as out of scope — `2b73c64`
- `REC-041` — `whole-plan`'s ten orphan sections are audited against their **section spec**, not a pass line none of them has; §4's ownership split and declared from both sides — `06113cf`, `5c39d11`
- `REC-042` — `roadmap-review`'s gap analysis rewired onto the per-level evidence markers; 21 stale `PROGRESS.md` references fixed — `7d64dc2`
- `REC-043` — six `review-audit` defects living in the parts a run never re-reads, starting with the missing frontend security lens — `bf95885`
- `REC-044` — the unreviewed-code gate gains a second signal: a dated `## Closed` backlog line, because a fix campaign moves no step — `b301d4b`
- `REC-045` — `REC-039`'s demotion propagated into the files that schedule the run, and `sql-step-close` gains a `Gate due` announcement: a gate closes on an empty drift report, not on the run happening. **Residue, still open:** G5/G7/G8's wording in `07-timetrack/PLANNING.md` §23 was never given the same audit and may carry its own pre-demotion assumptions — `3edfe77`
- `REC-050` — `/roadmap-review` ran after `progress-update` on REC-042's per-level evidence-marker and SQL-route rewire; it consumed the deliberately preserved SQL drift, aligned `ROADMAP.md` with the current gates, and passed two cold reviews with all fixes applied. Maps unaffected — only `ROADMAP.md` changed; no machinery contract, writer, trigger, or inventory changed — `4886805`
- `REC-051` — the review gate measures **unreviewed code**, not a 30-day clock; the date is reported and never obeyed. The stop is strictly broader than the window it replaced. **Residue, still open:** `_planning-standard.md` L464 and `07-timetrack/PLANNING.md` L1793 keep a G4 parenthetical whose *instruction* is right but whose justification still reads in the removed date framing — `70956ce`
- `REC-056` — `/system-check` is now a **prompt-only, explicit, on-demand** whole-system audit after substantial machinery changes: source prompts, skills, plans, backlogs and recorded debts remain read-only; only the two derived maps, its durable report and justified recommendation rows may change. It is never scheduled or run per commit. **Cold reviewer: approve-with-tightening; all blocking tightenings applied. Maps affected — both maps, their source-contract pointers and the `map-sync` limitation rows shipped with the prompt** — `a240dcb`
- `REC-057` — four declared-but-untested invariants become checks in `validate-prompt-system.ps1`: skill mirror, coverage mirror, plan fingerprints (reports, never repairs) and dead paths (both path forms). Found and repaired 30 paths stranded in `README.md`. **Cold reviewer: `approve-with-tightening`, 8 tightenings applied**, and it earned its keep four times — the coverage mirror was **case-blind** (`Compare-Object` is case-insensitive by default, so a capitalisation-only divergence passed); `README.md` still described *three* invariants and a *byte-identical* skill mirror one commit after both changed; the dead-path repair had **broken the example it fixed** (`notes-plan-prompt.md` became an Angular plan whose first chapter was a Java note, because only the two flagged lines were changed and not the block around them); and it found the fifth file shape the sweep walked past — **four `verify-{LEVEL}.md` files claim `Verdict: complete` against a coverage file that has moved**, the same lie as `Plan status: current`, now reported. It also checked the digest against the canonical command on all 39 coverage files rather than 13. Two of its own claims were corrected on re-verification: the `maps` declaration count, and — verified by mutation — its tightening of the SQL/simulation output patterns bounds the filename *shape* but still suppresses a plausible fake, so the failure it was justified by remains open. **Residue:** a realistic typo such as `03-jions.sql` is still invisible; closing it means cross-checking declared exercise paths against `PLANNING-{LEVEL}.md` §1's own file list, which is a design change and not a pattern fix — `2a7a632`, `8e21ef0`
- `REC-058` — observable failed skill steps now append stable `FRIC-NNNN` evidence; the next prompt close-out serially adjudicates it under the existing four-condition bar, while successful/expected paths write nothing and silent-success defects remain an explicit limit. **Cold reviewer: `approve-with-tightening`; all blocking tightenings applied. Maps affected — both maps changed with the machinery** — `97f670e`
- `REC-060` — the canonical coverage digest now explicitly removes `CR` before marker stripping, so LF, CRLF and mixed checkouts hash identically without changing any stored fingerprint; six local rule forks now point to the one canonical owner. Old/new parity passed on all 42 coverage files, line-ending and real-scope negative controls failed as expected, and the validator remained at 12 PASS plus the same six `REC-061` reports. **Cold reviewer: initial `reject` found the six restatements and a stale four-consumer inventory; both fixed; second verdict `approve`. Maps unaffected — no writer, reader, artifact, trigger, gate or chain changed** — `c0018200`

- `REC-047` — already resolved in the live notes contract: `/notes-plan` persists exact `Coverage concepts` as `[ ]`/`[x]`, and `/notes-audit` checks each concept it actually absorbs. The row's search for the obsolete label `Coverage bullets:` produced a false negative. Maps affected in the original machinery change — `badf828`
- `REC-048` — `PROGRESS.md` now separates `Coverage demonstrated`, `Study progress`, and `Practice completed`, all split by level and owned by their closing rituals. Notes gain an independent `Studied:` axis; interview prep reuses bilingual `[x]`; `study-block-close` owns the 13:30 close; stale or incomplete denominators print `—`, never a false `0%`. Cold reviewer: `approve`, no remaining findings. Maps affected — both maps corrected in the same machinery commit — `b9e2990`
- `REC-049` — **rejected.** False positive from opening: `project-brief` already keyed new/review concepts on `✅ NN-slug` project evidence markers, explicitly excluded `✅ sql:*` drill-only markers, ranked project-demonstrable junior gaps through `Professional level by topic`, and handed the durable decision to `plan-audit MODE = new` without downstream gap recomputation. This logic was present at the prompt's birth in `fdea4d8`, before the recommendation opened; no prompt change. Cold reviewer: `reject`. Maps unaffected — ledger-only adjudication — `—`
- `REC-053` — inline study writing is confined to refining an already complete planned pair, resets `Studied`, and cannot create, number, or complete missing/pending/unplanned notes; the cross-reference prompt routes prose debt back through `/notes-plan` → `/notes-audit`. Cold reviewer confirmed the systemic half closed. Maps affected — `40fb918`, `b9e2990`

- `REC-062` — Victor, 2026-08-07: **the two-map rule fires on a change, so a cell that rots without anything being edited is never checked.** The map now has a second trigger — a **read**: any prompt or `SKILL.md` read whole licenses a ruling on the rows about *that* file, and nothing past it (never a chain's order, §8's ownership or §1's properties, which no single file can falsify). A partial read rules on a contradiction, never on an absence; the machinery always wins; the correction lands in **its own commit**, never folded into the work that found it; and the verdict is said out loud (`map: verified` / `map: corrected` / `map: not verified — partial read`). It never blocks and never sweeps, so the rows nobody opens stay unverified — that gap stays `REC-056`'s and `REC-054`'s. **It found its first defect on the read that established it:** §1's commit-boundary enumeration omitted the session-rule files, the very authorization the rule's own commit ran under — `716da55`, correction `49a1dca`. **Maps affected — the rule changes who writes `_system-map.md` and when, so its "How it stays true" edit is in the same commit** — `716da55`. **Its own two-map test was partial, and its cold reviewer caught it:** the preamble was updated while §7 gained no writer row for the maps until `098d87c` (`REC-063`) — the commit introducing the anti-partial-compliance rule complied partially. Nine defects in all, none of which any automated check could have seen; applied under `REC-064` in `c166938` and `8eb33d9`

- `REC-063` — Victor, 2026-08-07: **the two-map rule was written and obeyed in halves, so the walk becomes the twelfth skill.** `map-sync`, mirrored to both adapters, fires on both triggers — the change (`REC-062`'s predecessor rule) and the whole read (`REC-062`) — and its actual work is the one the rules never spelled out: **walk every row that mentions the thing that moved**, because §7 gets corrected while the §9 row, the chain step and the §11 symptom row keep the old story, and a map contradicting itself is worse than one that is merely stale. Same relationship to `_session-rules.md` that `step-complete` has to its checklist: the section stays the source of truth, the skill stops compliance being partial. **What it deliberately is not: automatic.** A skill fires on *judgement*, not on a harness event, so it does not make the map guaranteed-fresh — it makes it correctly updated *when it fires*. `REC-058` already recorded the general form of that limit. A `PostToolUse` hook was considered and **rejected**: a prompt-system session edits `notes/prompts/**` constantly, so it would fire dozens of times per session and become ignorable noise, and it is Claude-only, which breaks the adapter neutrality `REC-053` left as a named residue. **The layer that catches a *non*-firing shipped with it:** `validate-prompt-system.ps1` invariant 5 — every skill directory has a §9 row and the reverse, §9's spelled-out count matches disk, every runnable prompt is named somewhere in the map and has a README entry. It cannot check whether a cell is *true* (only a read can), and it **found `profile-readme` absent from every section of the map on its first run** — a whole prompt the wiring diagram did not know existed, whose output file turned out to have **two writers on different triggers** (`/profile-readme`, and `/portfolio-audit` on ✅ Ready) and no §7 row. Made to fail before being trusted: four defects injected at once — a deleted §9 row, a stale count word, an unregistered skill directory, an unmapped prompt — all five findings printed, none hiding the others, plus the README branch tested separately. One implementation note worth keeping: **the section regex must be ASCII**, because PowerShell 5.1 reads a BOM-less `.ps1` as ANSI and an em dash in a pattern silently becomes mojibake — the first probe matched nothing and reported all twelve skills missing. **Maps affected — §9 row + count, §7 registry (the maps themselves had no writer row), §11 symptom row, the "How it stays true" preamble, and `README.md`'s invariant count, each in the commit that caused it** — `098d87c`, `b476f31`, `eeb89ed`. **Owed: the mandatory cold reviewer of step 3 never returned a verdict on this item.** `REC-062`'s ran and came back with nine defects (`REC-064`); this one's was launched, got as far as the validator injection tests and **terminated on a session limit** without a verdict, leaving the skill's other half — the PowerShell, the §7 two-writer claim about the profile README, the frontmatter's overlap with the other eleven skills — unreviewed. Tracked as `REC-065`, and the item stays here only because the work shipped, not because it was checked. **Discharged 2026-08-07 by `REC-065`'s re-run — `approve-with-tightening`, 3 defects, and the skill's other half no longer rests on its author's word**

- `REC-064` — the cold review `REC-062` should have had before it was collapsed: `approve-with-tightening`, **nine defects, none of them catchable by any automated check** because every version was internally coherent. The rule's read licence had been restated three times and no restatement matched — one merged the prompt and skill licences into a single list, one **contradicted its own frontmatter about whether the ritual fires at all**, one widened the scope in silence; promoted to the preamble as *"a rule restated is a rule forked"*. Two more it caught by reading rather than by checking: the rule discharged its own acknowledged gap onto `/system-check`, **a prompt that does not exist**, and the commit-boundary enumeration was still incomplete in its source (`roadmap-review`'s conditional `ROADMAP.md` grant) while §1 of the map contradicted itself two lines below the text the fix had just edited. D9 reached furthest: **both self-report contracts carried only the change test**, so the one class of run that always reads a prompt end to end was exempt from the read rule by deferring to a contract that never implemented it. **Maps affected — `_system-map.md`'s licence paragraph and §1 commit boundary, in the same commit as the rules fix** — `c166938`, `8eb33d9`

- `REC-065` — the cold review `REC-063` never got, re-run after its predecessor died on a session limit: `approve-with-tightening`, **3 defects and 6 tightenings**, and the two defects that mattered were in the layer built to catch a *non*-firing `map-sync`. Invariant 5's map-registration test was **satisfied by accident for 2 of the 28 prompts** — `plan-audit` by the substring inside `sql-plan-audit`, `/tracker` by the path `practice/simulations/TRACKER.md` under a case-insensitive `-notmatch` — so every mention of the prompt that plans a project could have left both maps unnoticed. That is `REC-057`'s case-blindness a second time, one screen from where its own `Compare-Object` was correctly given `-CaseSensitive`; promoted to the preamble. **Bounding alone then broke `/code-review-practice`** — caught by running the validator, not by reading it — so the slash command is now **read from the launcher's own filename** instead of reconstructed from the prompt name, which is the first time the validator honours `REC-040`'s documented exception rather than passing it by luck. Third defect: the read licence's standards row had been unreachable since `716da55` because the trigger named only two kinds, making it dead text that reads as covered — also promoted. **Made to fail before being trusted:** three defects injected simultaneously, all three reported plus a control, none masking; and the two tightenings verified in the negative — an added table column and a bolded count word, both of which used to fire, now correctly produce nothing. **Verified correct and recorded as such, because an absence of findings must be distinguishable from "did not reach it":** the §7 two-writer claim about the profile README, read this time from `portfolio-audit.md` L171-188's own text (true, and gated on ✅ Ready exactly as claimed); §6's two-modes prose; **no trigger overlap** between `map-sync` and the other eleven skills; the ANSI/em-dash trap closed (zero bytes > 127 in the whole script); and the two adapter copies byte-identical. **Maps affected — the licence change alters when a ritual fires, so §9's `Fires when` cell and the "How it stays true" paragraph ride in the same commit; the validator fix changes no file's contents, writer or existence, so `maps unaffected` for that half** — `6f7ce6d`, `b2d0e08`

- `REC-066` — the coverage rationale is intentionally retained history, not a normal run input and not an `R-n`-linked live dependency; its catalogue row and the adjacent `/coverage` read/write map were corrected. Single-shot Step 3 now stages the report **and** `_run-tracker.md`, matching Steps 2 and 4. Cold reviewer: `approve-with-tightening`; all blocking tightenings applied. Map corrected in its own commit for the read-path findings; `maps unaffected` for the single-shot fix because the existing map already described the two-file close-out — `7f7a9123`, `d298c636`

## Suggested order for the open items

Added 2026-08-06. The rows above are the authority on *what* each item is; this is the order that keeps
them from tripping over each other. Three rules produced it: **a correction that stops a wrong run comes
before a build**, **an item blocked on evidence is run, not edited**, and **a chain is walked from its
denominator up**, never from the visible end.

**Wave 1 — the plan family, before project 08 is planned. ✅ Closed 2026-08-06.** `REC-041` → `REC-036`,
both corrupting `MODE = new`, which is what plans project 08. Project 08 can now be planned.

**Wave 2 — the corrections that block nothing. ✅ Closed 2026-08-08.** `REC-040`, `REC-051`, `REC-053`,
`REC-057` and `REC-055` (a)-(d) are all done; `REC-053`'s systemic half closed with Wave 4 and
`REC-055` (e) stays in Wave 7.
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

**Wave 6 — new machinery.** `REC-052`. Last by dependency (it needs Wave 4's counters to know where a
simulation's progress lands) and by cost. It is not blocking anything: the two existing simulation
prompts already work, so this is a track being built around them, not a repair.

**Wave 7 — the whole-system review, after everything above.** `REC-054`. It is not sequenced by
dependency but by **state**: it reviews the two engines as one system and the three daily blocks as a
day, and both claims are only worth making about machinery that has stopped moving. Run it when the
waves above are resolved and the answer to "is the prompt system finished?" is yes. Running it earlier
audits a moving target and spends the one cold read that matters on a version that will not survive.

**Where the map-review items land (`REC-055`-`REC-059`, added 2026-08-06).** They are not a wave of
their own: three slot into waves that already exist, and two are gated on other work. **`REC-057`** (the
untested invariants), **`REC-055` (a)-(d)** and **`REC-056`** (`/system-check`) are done. The final ruling
on 056 is the explicit prompt recorded in `## Closed`, not the earlier read-only/session-start sketch.
**`REC-059`** is not a separate build at all — it is a required part of `REC-052` in Wave 6. And
**`REC-055` (e)**, the map's missing per-day view, is written **out of** `REC-054` in Wave 7, never
before it.

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
