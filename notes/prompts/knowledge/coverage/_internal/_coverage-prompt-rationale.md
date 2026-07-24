# Coverage prompt — rationale

**Internal component. Not runnable.** This file holds the *evidence behind the rules* in
`coverage-prompt.md`: the real runs that produced each rule, what went wrong, and what it cost.

It exists because the prompt grew by accretion — every run appended its lesson as a justification
paragraph next to the rule it produced, until roughly half the file was history rather than
instruction. Splitting them keeps the prompt executable and keeps the evidence intact.

**How to use it.** The prompt carries the rule; each rule that came from a real incident carries a
`(why: R-n)` pointer to the entry here. You do **not** need to read this file to execute a run.
Read the relevant entry when you are tempted to weaken, skip, or "simplify" a rule — every one of
these was written because a run already tried that and paid for it. A rule whose rationale you
cannot find here is a rule nobody has yet had to learn the hard way; treat it as provisional.

**How to add to it.** When a run's self-report surfaces a failure that changes the prompt, add a new
`R-n` entry here with the date and the concrete cost, and put only the rule plus its pointer in the
prompt. Never inline a new war story back into the prompt.

---

## R1 — The generator-model guard

A real run consolidated its items at the `standard` tier and shipped standard violations that only a `deep` re-pass
caught: one unsplit 16-item section and two merged multi-concept items. The session *is* the author of
every coverage item, so its own model is the quality bottleneck — and nothing in the run flow can
enforce it, because the `model:` overrides set the subagents' models, never the session's. Hence a
manual guard at step 0.

## R2 — Why the run checklist is mechanical, not trust-based

The Security run (2026-07-18) completed every content step and **silently skipped the `_run-tracker.md`
update**, then self-assessed "no rule breached". The steps most likely to be dropped are the
administrative ones at the end, precisely because they execute on the run's most saturated context and
nothing fails loudly when they are skipped. A checklist the harness re-displays is the external memory
a saturated context no longer has; prose instructions re-extracted from a 900-line prompt are not.

## R3 — Never assert ownership without grepping

On the Security run (2026-07-18) the pre-run framing announced that JWT, CORS and SQL injection
"almost certainly already have homes in the other topics' sections" — the exact inverse of the file,
where `### JWT`, `### CORS` and the injection item are Security's *own* sections and the duplication
runs *outward* into Spring Boot, Architecture and General. Acting on that guess would have dropped
Security's core items as other topics' property.

"Almost certainly" is the tell: it reads as verified while carrying none of the work, and it is wrong
in both directions. The claim also biases every later judgement toward the answer already announced,
which is why the rule binds the whole run and not only the consolidation step.

## R4 — Never cap the angles, fan out by angle

One capped interviewer returned 13 gaps and looked convergent; three further angles then found 80+
more. A capped interviewer finds the gaps that fit in its cap — it does not find the gaps. And running
the same generic interviewer twice returns the same list, so the fan-out must be by *angle*, not by
repetition.

## R5 — The invented angle is where the value comes from

Three consecutive runs, none of them a coincidence:

- **Architecture (2026-07-18)** — the four standard angles converged on Spring Boot mechanics; the two
  improvised angles (take-home, existing-codebase onboarding) produced the run's *only* genuinely new
  sections. Onboarding was promoted to angle 6 as a result.
- **Security (2026-07-18)** — the four standard angles converged almost entirely on Spring Security
  *wiring* (`SecurityFilterChain`, `@EnableMethodSecurity`, `UserDetailsService`, `OncePerRequestFilter`),
  all of it owned by Spring Boot. The improvised attacker-mindset angle produced three whole new
  sections and roughly two-thirds of everything added.
- **General (2026-07-19)** — the four standard angles again converged on Spring Boot bootstrap material
  (Maven wrapper, `ddl-auto`, DataSource errors, Flyway, component scanning), dropped wholesale by the
  ownership grep. All three improvised angles carried the output: "the wire" (read the raw HTTP
  exchange) produced the raw-exchange, failure-response and caching sections; "the environment beneath
  the app" produced build-outside-the-IDE, configuration precedence and the container-runtime section;
  "process and delivery" produced both delivery sections.

- **CSS (2026-07-19)** — eight angles, two invented. "It works on your machine" (environment-dependent
  rendering) produced the viewport/scrollbar-unit and font-and-image-loading sections; "accessibility —
  the non-visual, non-mouse user" produced two whole sections that no numbered angle touched, on a
  surface that is contractual in the public-sector work these consultancies actually deliver.
- **Git (2026-07-19)** — six angles, two invented, one numbered angle *replaced* rather than dropped.
  "Draw me what Git actually did" produced the commit/branch graph-model section that makes every other
  Git answer derivable; "Git as the team's process surface" produced branch protection and releases.

The pattern: the numbered angles are generic by construction, so on any topic sitting *beside* a
framework they converge on that framework — which another topic already owns.

**Two conclusions the fourth run made explicit.**

*One invented angle was too low a floor.* CSS and Git both ran **two**, and in both cases both of them
carried material no numbered angle reached. The requirement is now two, not "at least one".

*Do not promote the winners into the numbered list.* This is a reversal, and the reasoning matters
because the prompt used to advise the opposite. Angles 5 and 6 were promoted invented angles, which made
promotion look like the mechanism to keep feeding. But the invented angle wins precisely *because* it is
tailored to the topic; promote it and it becomes one more generic angle, and generic angles are exactly
the ones documented above as converging on the neighbouring framework. Promotion therefore erodes the
property that produced the yield. The General run's pending recommendation to promote "the wire" was
declined on these grounds (2026-07-19) — recorded here so the next run does not re-propose it from
scratch. Name the invented angles and their yield in the summary; leave the numbered list alone.

## R6 — Why output prediction is mandatory for language topics

On the JavaScript run this angle was improvised, and it was the **only** one that returned
`ToPrimitive`, the abstract equality algorithm, `this` binding precedence, the prototype chain,
microtask-drain ordering and sparse arrays. Angles 1–4 are all framework-shaped — they interrogate how
you *use* a stack — so on a language topic they converge, look complete, and never touch the mechanism
layer underneath. That is exactly the gap a Spanish quickfire screening is built to find.

## R7 — Why existing-codebase onboarding is mandatory for stack topics

The mirror of R6. Angles 1–4 are shaped as if the candidate authors the code, so on a stack topic they
converge on writing-and-debugging mechanics and never touch the inheriting-code surface — the one a
consultancy junior actually lives on, since almost none green-field anything. On the Architecture run
(2026-07-18) this angle was improvised and was the sole source of the file's two most market-relevant
new sections ("Working in a codebase you did not write", most of "System shape and structure"); the
four standard angles had converged elsewhere and looked complete.

## R8 — Why angle reports go to files, not into the chat

Six or seven uncapped deep-reasoning angles returning 130–230 proposals directly into the session is the single
biggest context spike of the run, and it lands on the same context that must then word-craft every item
and finish the admin steps. With reports on disk the generator consolidates incrementally — one angle
file at a time, merged into a single deduplicated worklist — and never holds all the raw reports at once.

## R9 — Routing means writing it down, not mentioning it

The TypeScript run (2026-07-18) routed out four Angular-owned concepts — `strictTemplates`, AOT, the
`ng build` type-check, typed `FormGroup<T>` — and Angular's own coverage run had already happened that
same day **without finding any of them**. A summary line is not a handoff: the summary lives in a chat
nobody reads later, so the item then depends on the owner's future run rediscovering it by chance.
Nothing else in the pipeline catches this — `coverage-audit`'s Analyst D hunts duplicates, misplaced
items and demotion candidates, so a concept *absent from every section* is invisible to it.

## R10 — Grep the topic's own file too

On the Architecture run (2026-07-18) two proposed gaps — a "transaction boundary" item and a
"consistent error contract" item — duplicated existing bullets in the same file and were caught only by
the generator's attention. Step 4b cannot catch these either: the reviewer sees only the new items,
never the sections they join. Making the check a grep turns a lucky catch into a procedural one.

## R11 — The cross-topic overlap check is load-bearing, especially for foundational and cross-cutting topics

- **Java** — roughly half the proposed gaps were already owned by Spring Boot or Architecture.
- **JavaScript** — an entire proposed "browser storage" section was owned by General and Security, along
  with CORS, the `OPTIONS` preflight, the `Authorization: Bearer` header, JWT-in-`localStorage` and
  `.env`-is-public.
- **Architecture (2026-07-18)** — roughly **two-thirds** of ~130 proposed gaps were already owned
  elsewhere; ownership was the run's single most expensive judgement.
- **Security (2026-07-18)** — roughly **80%** of ~130 proposals were already owned, a higher fraction
  still. The rule is why that run resisted adding a `## Spring Security configuration` section that six
  angles all asked for.
- **General (2026-07-19)** — the same shape again: the majority of ~231 proposals dropped as owned by
  Spring Boot, Security, Git or JavaScript.

Two structural cases explain it. **Foundational** topics sit *underneath* others (JavaScript below
Angular, Java below Spring Boot) and attract proposals belonging to the layer above. **Cross-cutting**
topics sit *across* the stack (Architecture, Security, General) and attract proposals from every side at
once — for those, one grep is not enough, and the honest outcome is dropping most proposals, not adding
them. A cross-cutting run that adds the majority of its gaps has almost certainly duplicated the topics
it spans.

## R12 — Why the overlap check lives in Step 4a, not in the sync step

It used to sit at the end of the sync, which meant a duplicate was written into the topic file *and*
mirrored into `notes/coverage.md` before being caught, forcing a second full sync pass. It happened on a
real run: three Angular-owned items written and mirrored during an Angular Material run. Deciding
ownership belongs to consolidation, when nothing has been written yet. Step 4b's cold review sits on the
same principle — fix the topic file while it is still the only copy.

## R13 — Why the cold reviewer gets whole sections, not just the new bullets

The brief asks the reviewer to judge whether an item is *filed in the right section* and whether it
*restates an existing bullet* — neither question is answerable from an excerpt that omits the section's
other items. The Security run (2026-07-18) hit exactly this: the reviewer flagged a CSRF-mechanism item
as misfiled, not knowing the section already held the CSRF bullet it explains, and the generator had to
overrule it. That is a false positive manufactured by the prompt, not by the reviewer.

Sending the whole section also closes the hole R10 admits: with the surrounding bullets present, the
reviewer becomes a real second check on same-section duplication, at almost no extra cost.

## R14 — When a mandated split pushes a section over 12

The TypeScript run: applying two of the reviewer's splits took `## Narrowing and type guards` from 12 to
13. The fix was relocating the `catch (e: unknown)` item into `## Modelling domain state and errors`,
where it filed better anyway. The split always happens — a grouped bullet is a defect, an oversized
section is only a shape problem — so the question is only where the extra item lands.

## R15 — The double-demotion trap in the sync

The title rule turns line 1 into `## {TOPIC}`, which the section-heading rule then matches and demotes
again to `### {TOPIC}`, silently producing a section with no topic heading at all. It happened on the SQL
run (2026-07-18) via one `sed` with two expressions.

## R16 — Why the sync is verified by diff, not by reading

The Security run (2026-07-18) discovered `notes/coverage.md` had been missing the *Broken access control
(IDOR)* bullet for an unknown number of previous runs — the mirrored `### Common vulnerabilities` held 6
items against the topic file's 8. Every prior run had "verified the sync" by reading and passed it. The
drift was caught the first time the check was run as a `diff`. Reading finds structural breakage; only a
diff finds a single absent bullet.

## R17 — Why the combined file is never read end-to-end

Step 1's verifiable-reads rule and Step 4a's "one grep, not a re-read" used to point in opposite
directions for `notes/coverage.md`, and a real run had to resolve the contradiction by hand. The
resolution: the combined file is over 2000 lines and grows every run, so reading it whole burns the
context that must then word-craft every item. The `"N lines, read to EOF"` claim is required for the
*topic* file only.

## R18 — Count the sections, do not eyeball them

A real run shipped a **16-item section** that the generator had "checked" by reading it, and two grouped
multi-concept bullets (`environment.ts` + `fileReplacements`; `CORS` + `proxy.conf.json`). Size and
one-concept are the two rules a generator reliably violates while believing it complied.

**Worked example for growing an undersized section rather than merging it:** on the Java run a 2-item
"Control flow" had no honest neighbour (the adjacent sections were Strings and Classes), so it grew with
that run's `package` / `import` / fully-qualified-name gaps and became "Control flow and source
structure". A section whose name no longer describes its contents is worse than either the small section
or the missing items, because it misfiles those bullets for every downstream prompt that reads coverage
by section.

## R19 — Size delta is reported, never acted on

The JavaScript run took a topic from 121 to 208 lines and 13 to 27 sections — every item defensible, but
~200 concepts queued for `notes-audit` on a topic that is eighth in the study order. The General run
(2026-07-19) did the same shape: 113 → 244 lines, 12 → 24 sections, 61 → 167 items, on the topic that is
*last* in the study order. That is a scheduling judgement only Victor can make, so the run reports both
numbers and leaves the conclusion to him. The row must never become a self-imposed budget.

## R20 — Why the inbox is a second commit

The atomicity rule ("only the coverage files, nothing else") and Step 4a's "write the entry before you
move on" used to contradict each other. A real run (Architecture, 2026-07-18) had to improvise a second
commit because the `git add` list did not mention the inbox at all. Two commits is the resolution: the
coverage change and the routing are two logical changes.

## R21 — The close-out verification is a command, not a feeling

The Security run (2026-07-18) — the heaviest to date — wrote the self-report, skipped the tracker, and
then self-assessed "no rule breached". A saturated context cannot see its own omission, so the check is
`git show --stat HEAD`, not a judgement.

## R22 — A multi-term grep returning nothing is a broken command

On the General run (2026-07-19) the cross-topic ownership check was first run as a bash `for` loop over
~32 terms and returned **empty for every term**. A sanity check (`grep -c "profile"` → 8 hits) exposed it
as a tooling failure, not an empty result. Trusted, it would have duplicated roughly thirty items already
owned by Spring Boot, Security, Git and JavaScript into General — precisely the failure the check exists
to prevent. The dedicated Grep tool worked where the bash loop did not.

## R23 — The cheap substitute for `[NEW]` marking, and why it needs a condition

On the CSS/Git run (2026-07-19) Step 4b's marking requirement was **breached, by the generator, with a
measurable cost**. Both topics were restructured heavily (CSS 16→27 sections, Git 8→19), so marking every
new item by hand meant ~150 marks per topic. Instead the reviewers were told to derive the new items from
`git diff HEAD`. That is not equivalent: a rewritten or reordered section makes git report **unchanged,
pre-existing bullets as additions**. The CSS reviewer duly reported defects against four inherited
bullets, three of its findings had to be rejected on provenance alone, and the same-section duplication
check — the entire reason R13 sends whole sections — was diluted. The Git dispatch patched around it with
a caveat paragraph, which worked but moved the provenance judgement onto the subagent.

The lesson is not "enforce the marking harder". A requirement that is genuinely expensive and has no
sanctioned alternative is one that invites exactly this substitution. So the diff is now allowed **with
the condition that makes it equivalent**: the dispatch must also name which bullets are
inherited-but-moved, derived from the pre-run file (`git show HEAD:{path}`), not guessed from the patch
shape.

Also recorded from that run: **substituting a numbered angle beats dropping one.** Git's take-home angle
is meaningless (nobody bootstraps a repo under test conditions); replacing it with a
recovery-and-error-message angle returned 38 gaps, the run's highest single-angle yield. Step 4a now
frames a dead angle as a free slot rather than a saving.

## R24 — The splice off-by-one that both mandated diffs pass

Same run: the Step 4c splice for Git used `head -N` where N was the line number of the `## Git` heading
itself, so the rebuilt section's own heading landed under the surviving original — two consecutive
`## Git` lines. The CSS splice, done correctly with N−1, showed the trap is an off-by-one and not a
misunderstanding.

What makes this worth a rule is the detection gap: **both diffs mandated by Step 4c passed while the
duplicate heading was present.** They compare `- ` bullets and `### ` sub-headings, and a stray `## `
line is invisible to both. Only `grep -n "^## "` caught it. This is the concrete case behind the standing
instruction to check line 1 by eye — the eye-check and the section-map grep cover what the diffs
structurally cannot.
