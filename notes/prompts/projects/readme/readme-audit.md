# README audit — the single entry point for reviewing a project's README(s)

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

Run this **inside the supported agent runtime**. It is the only readme prompt Victor launches. It reviews and fixes a
project's README(s) to the full standard, hands-off: one README at a time, each **authored/fixed, then
cold-reviewed against the standard, then judged by the reader it is written for** — three subagents, and
the judge's items are applied by the reviewer inside the same run. Run it after a project or a big
feature, or whenever a README feels stale — and always **before** `portfolio-audit`, which assumes the READMEs are correct.

- **Angular projects (01–06)** — one README (`global`).
- **Full-stack projects (07+)** — three READMEs (`global`, `backend`, `frontend`), different audiences.

> **▶ Run first:** nothing — it only needs `PLANNING.md` and the existing README(s). It is itself a
> prerequisite of `portfolio-audit`.

> **Run-start check (step 0):** before anything else, execute the decision table in `notes/prompts/_internal/_pipeline-self-report.md` against this prompt's own `_last-run-report`; never restate the shared `Status:` meanings here.

**Internal pieces this orchestrates** (you never launch these directly):
`_readme-standard.md` (the bar) · `_readme-write-prompt.md` (author) · `_readme-review-prompt.md` (reviewer) ·
`_readme-effect-prompt.md` (reader-effect judge).

> **Auto-committed** (authorized 2026-08-29, reversing the earlier hand-over rule). `_session-rules.md`
> permits the agent to commit a project's `README.md` directly, and this pipeline uses that permission:
> the subagents fix the files and the orchestrator **runs one path-scoped commit for the project** —
> naming each README that actually changed, never one commit per README and never all three by default. The
> summary of changes is still printed, now for review *after* the commit rather than as a gate before
> it. The rule is owned by `_readme-standard.md` → "Summary + commit rule". There is no `DRY_RUN`.
> A **second, separate** commit carries any project defect the run's roles reported and the orchestrator
> verified into `PROJECT-BACKLOG.md` — *Out-of-boundary project defects* below owns it (`REC-255`).

---

## How to use — recipes

Open a fresh chat **inside the supported agent runtime**, paste the whole prompt below, fill only the config block, and
let it run. Pick the recipe:

**A · Review one project's README(s)**
```
PROJECT_PATH = projects/07-timetrack
```

**B · Review every project in one run**
```
PROJECT_PATH = all
```

**Rules of thumb:**
- Fill in **only** the config block. Everything below it is machinery — never edit it.
- The project type (and therefore which READMEs) is derived from the path — do not set it.

**After the run:** review the changed READMEs — they are already committed. Then skim the
**pipeline self-report** it prints (also saved to `_last-run-report.md`) — only if it shows a real
failure of the machinery do these prompts get edited, in a separate session.

---

````
## Configuration — edit only this block

PROJECT_PATH = [projects/01-todo-list | ... | projects/06-hr-portal | projects/07-timetrack | all]

## PROJECT_PATH = all runs on every project in turn — see notes/prompts/_internal/_batch-mode.md.
## Batch targets (ordered): projects/01-todo-list, 02-weather-app, 03-expense-tracker, 04-meal-finder, 05-task-manager,
## 06-hr-portal, 07-timetrack. The READMEs are derived per type (by project number: 01–06 Angular-only,
## 07+ full-stack): angular → [global]; full-stack → [global, backend, frontend].

Use PROJECT_PATH wherever the prompt refers to {PROJECT_PATH}.

---

You are the orchestrator for reviewing Victor's README(s), hands-off. First read
`notes/prompts/projects/readme/_internal/_readme-standard.md` so you know the bar, which READMEs each project type
has, and the commit rule. Then run the procedure below. You stay light: the subagents read the rules and
edit the files — you never write a README in your own context.

## If PROJECT_PATH = all
Per `notes/prompts/_internal/_batch-mode.md`, expand `all` into the ordered project list from the config block and
run the **single-project procedure below once per project**, finishing one before the next. Put each
project's report under a `### [project]` heading, and after the last print the `_batch-mode.md` summary
table (`Project | READMEs changed`) — this table replaces `_batch-mode.md`'s generic
`Target | Result | Files changed` one. `_batch-mode.md`'s "Commits" section binds here with its target
read as the **project**, never the individual README, so two projects are never squashed together — and
with one override: a project's set is one `git commit --only` naming every changed README, not that
section's `add` + `commit` pair. Once a project is finished, carry forward only its
summary table row and its out-of-boundary counts (reported / raised / dropped, and the backlog commit)
— drop its per-target detail from your working context before starting the next project.
Otherwise, follow the procedure once.

## Single-project procedure

Derive the target list from the project type: **Angular → `[global]`**; **full-stack → `[global,
backend, frontend]`**.

For **each** target, run the author → reviewer pair below. Different targets touch different files and
none of the subagents commit, so you may run the pairs for different targets in parallel — launch the
authors for all targets in one block, wait for all, then launch the reviewers in one block. Within a
target the reviewer must always run **after** its author.

**Subagent A — author.** Launch one `role-appropriate` subagent, `reasoning tier: deep`, `execution: foreground`
(recruiter-facing prose — the portfolio's front door):

> Read `notes/prompts/projects/readme/_internal/_readme-write-prompt.md` and execute it in full for
> `PROJECT_PATH = {PROJECT_PATH}` · `TARGET = «this target»`. Fix that one README to the standard.
> **Do NOT commit.** Report the summary of changes, any intentional placeholder, and your
> `Out-of-boundary defects:` line.

Wait for A, then **subagent B — reviewer.** Launch a second, independent `role-appropriate` subagent,
`reasoning tier: standard`, `execution: foreground` (conformance against a highly prescriptive standard —
the structure guarantees quality here, and the author already ran at the top tier):

> Read `notes/prompts/projects/readme/_internal/_readme-review-prompt.md` and execute it in full for
> `PROJECT_PATH = {PROJECT_PATH}` · `TARGET = «this target»`. Audit the just-authored README hard against
> the standard and fix what falls short directly. **Do NOT commit.** Report the section trace, your
> verdict (PASS/FIXED), whether the README changed, and your `Out-of-boundary defects:` line.

**Verify the trace.** The reviewer's report must contain a section trace — one line per required
section for that target. If the trace is missing or skips sections, the audit was not a full pass:
re-dispatch the reviewer for that target once, telling it which sections lack a trace line.

Collect, per target, whether the README changed. Keep only the verdict, the changed-flag, the
one-line-per-section summaries, and each report's `Out-of-boundary defects:` lines — do not accumulate
anything longer in your context.

**Failure protocol.** If a subagent errors out or returns a report you cannot act on (no verdict, no
summary), re-dispatch that same subagent once with the same instructions. If it fails again, stop that
target, exclude its README from the commit command, and flag it clearly in the final summary — never
commit a README whose pipeline did not complete.

## Reader-effect judge (every project, every target — the last editorial pass)

A and B do apply the standard's quality filter, but they apply it **per section with the rule set in
hand** — so a README can clear every section's own rule and still not land as a page: `04-meal-finder`
passed this gate with 37 well-formed `What I learned` bullets. This step hands one subagent the whole
file, no checklist, and the reader that README is actually written for.

Launch one `role-appropriate` subagent **per target** (`reasoning tier: deep` — a judgment with no
checklist behind it, which is that tier's own criterion; `execution: foreground`). They write
nothing and touch different files, so **launch all targets in one block**. It runs after the
author→reviewer pairs; full-stack coherence is checked after its items are applied:

> Read `notes/prompts/projects/readme/_internal/_readme-effect-prompt.md` and execute it in full for
> `PROJECT_PATH = {PROJECT_PATH}` · `TARGET = «this target»`. Judge that one README as its real reader.
> **Change no file and do NOT commit.** Return your verdict and your cut/add/keep lines in its format.

Then, for each target that returned items, **re-dispatch its reviewer (B)** quoting them verbatim — the
same channel the coherence branch uses:

> Read `notes/prompts/projects/readme/_internal/_readme-review-prompt.md` and execute it in full for
> `PROJECT_PATH = {PROJECT_PATH}` · `TARGET = «this target»`. You are dispatched with quoted effect
> items: «paste the judge's lines». Apply them to the README. **Do NOT commit.** Report which you
> applied, including each `CUT`'s `deleted` / `merged` / `rewritten` / `moved` outcome and where a
> surviving concept landed, compacted into the section trace; **return any objection unresolved** — the item quoted verbatim and the
> clause of the standard you invoke, quoted — rather than deciding it yourself; and flag each removal the
> review prompt marks `⚠ regenerable`.

**The run applies the items; it never hands them over.** B's default is to apply. Never print the judge's
items as work left for Victor: the whole point of this step is that the README ships fixed inside the
same run.

**What counts as a valid objection.** A rule of the standard the item **breaks *or contradicts*, and a
rule that positively *includes* what the item cuts qualifies.** The standard's sections are written as
inclusion tests rather than prohibitions — rules 4, 5, 6, 7, 8, 9 and the backend's 4 and 7 — so
"no rule forbids removing this" is not a reason to remove it, which is how an `effect-only` cut once took
`04-meal-finder`'s `Future improvements` from three bullets to one against rule 8's own two inclusion
tests. This widens *which* clauses count and never licenses an objection on taste: no clause, no
objection, and the item is applied on the reader's authority. **A rule includes an item only on the
ground its tests reach:** a cut on a ground it has no test for — a line that passes all three of rule 6's
tests and still is not a *decision* — contradicts nothing, and the `effect-only` cut stands, as
`_readme-effect-prompt.md` rules it.

**You settle the objection, not B.** B wrote or fixed the text the judge is reading, so it is judge and
party on its own prose — and the clause above widens what it may invoke, which sharpens that conflict
rather than easing it. So B returns the objection unresolved and **you rule on it**, with the judge's
item and B's quoted clause both in front of you: sustain it (the item is dropped, and the summary says
which clause carried it) or overrule it (re-dispatch B to apply that one item). Record the outcome in the
summary either way. *(The 2026-09-02 self-report set aside a **fresh cold applier** on the ground that B
rejected nothing that run; this is the cheaper arbitration, and it is owed because the widened clause
above is new.)*

**The vantage this ruling is made from, because you have no other.** Your light-context rule stands — you
still never write a README — but you may **read the one section in dispute**, and only that section, when
the two quotes do not settle it: `grep -n "^## "` the file and read from that heading to the next. The
coherence pass's "they stay out of your context" governs **that** step; the exceptions to it are two and
both are bounded — the `git diff` you read against the judge's item list before committing, and this one
section, which ends when the objection is settled. (The cited source lines you read under
*Out-of-boundary project defects* are not a README read, and are bounded the same way; the one README
line that section may read — a rule-4 visual's `Features` sentence — is bounded by its own claim.) If the section still does not settle it, **sustain
the objection**: leaving a bullet a rule arguably includes is the recoverable error, and the summary
records that you sustained it for want of a decision, which is the signal that the standard's clause is
unclear.

**Verify the application before you commit, on every target — `Objections returned: none` is not
evidence.** A silent application returns nothing to arbitrate, so the ruling above never fires and the
run's report reads exactly like a correct run's. So once the appliers have returned and before the
commit, `git diff` **each README that changed** and read it **against that target's item list, B's
reported outcome for each `CUT`, and the earlier A/B section traces**: inspect each judge-named line
and its reported destination, verify that a concept B says survived is present there, and account for
other changed lines against A/B's work rather than treating them as judge items. Where the diff shows a cut a rule of
the standard positively *includes* — on the ground its tests reach, per *What counts as a valid
objection*, not the section it sits in — re-dispatch that target's B with the rule's tests quoted, and settle it as an objection **you** raised — B did not, and that is the finding, not the
repair. This is the check that made the 2026-09-02 `04-meal-finder` commit correct while every trace on
the run was green; it ran out of band then and it is a step now (`REC-202`).

**A `⚠ regenerable` flag is carried, not resolved.** Put it in the summary and the self-report's Effect
judge bullet, naming the concept and plan row. No run reads a previous run's flags, so only a reader of
the report can recognise a repeat, and a recognised repeat is a `_recommendation-ledger.md` row.

**A judge is advisory, so it never blocks the commit.** If one errors twice under the Failure protocol,
say so in the summary and commit that README on A+B's work — unlike an author or a reviewer, whose
failure excludes its README from the commit.

**The applier re-dispatch is advisory for the same reason, and its failure has one named outcome.** The
README's own author→reviewer pair already completed before this step ran, so a B that fails twice while
applying effect items does **not** retract that and does **not** exclude the README. This run records no
baseline for the applier's span, so nothing here reverts anything: commit the file **as it stands, part-
applied**, and declare that in the commit message, in the summary and in the self-report's Effect judge
bullet — which items landed, which did not, and that the file is mid-application. That is
`_agent-runtime-standard.md`'s *leave it and declare it*, the branch it defines for exactly this case.
It is the one path on which items outlive the run, and it is a declared failure, never the normal
ending.

## Cross-README coherence (full-stack only, after the final editorial edits)

Because the targets are written separately, shared decisions can contradict each other. Run this
after effect-item application, arbitration and diff verification, so it checks the files that will
actually be committed. Launch one cold subagent (`reasoning tier: standard`, `execution: foreground`)
with a scratch path under the runtime contract. Do not read the READMEs yourself; they stay out of your
context:

> Read the three READMEs of `{PROJECT_PATH}` (`README.md`, `backend/README.md`, `frontend/README.md`)
> and its `PLANNING.md`. Check shared decisions, API semantics, stack, setup, security and testing
> status for contradictions. For a disputed implementation claim, read only the source/config/test
> files needed to settle it: agreement with another README or a plan is not proof of runtime behaviour.
> Change nothing. Report the EOF proofs and, in ≤ 10 lines, `COHERENT` or each conflicting claim with
> its README/section and the source that settles it; mark anything the available evidence cannot settle.

Re-dispatch B only on affected targets with the quoted conflict and evidence. A conflict between a README
and `PLANNING.md` alone that the source or the standard settles in the README's favour — a stale plan
sentence, or a credential the standard leaves as `*(password — to be added)*` — is named in the summary
and, when it is a stale plan statement, joins the out-of-boundary defects below; it neither re-dispatches
B nor blocks. After repairs, have the
coherence role recheck those claims against the current files once. No further editorial pass follows.
If a conflict remains, evidence cannot settle it, or the role fails under the runtime retry contract,
stop before the project's README commit, leave the edits explicitly accounted for, and close out as
`blocked`. An Angular-only project skips this step. Advisory effect-pass failures remain advisory,
but do not waive this final coherence check.

## Out-of-boundary project defects

A and B read `PLANNING.md` and scoped source to check a README, and on the way they see real defects in
the project itself — a signal nothing reads, a label copied from a docs example, a plan line naming a
version the project does not run. No README is the place for them and the chat does not survive the
session; `review-audit`, the gate that would find them again, fires a few times per project. So each one
leaves this run as a backlog task or as a named drop, never as a mention. Three runs on 2026-09-27
improvised this channel, two of them only because the orchestrator added the request to the dispatch
(`REC-255`); it is declared here so it no longer depends on that.

**Sources — three, and no pass is ever started to look for more.** The `Out-of-boundary defects:` line
every A and B report ends in (`none`, or one `file:line` + what is wrong per defect — a contradicted
statement in `PLANNING.md` or in `PROJECT-BACKLOG.md` itself included, and a rule-4 visual a closed
project owes and no run can capture), and the stale plan statements the coherence role settled in a
README's favour above. The judge reads only the README, so it
is never a source. A report missing the line is not re-dispatched for it — this is not a gate — but the
self-report names the role that omitted it.

**Verify each one against the lines it cites, and only those.** Read the cited `file:line` and whatever
the claim itself names to settle it — the one template, call site or `package.json` entry — never the
surrounding feature. **A rule-4 visual has no code to cite**, so it is verified against three things
instead: the Visual brief line in A's report naming it, the one `Features` sentence stating the
behaviour it would show, and `ls` of the project's `screenshots/` folder proving no such file exists.
When any source is not `none`, read `PROJECT-BACKLOG.md`'s `## Tasks`, `## Beyond the current gate`
and `## Closed`. Then raise a defect only when the cited code — or, for a rule-4 visual, those three —
shows it, and **drop** it, naming it and the reason in the summary, when it is:
- not borne out by the cited lines;
- excluded by `_session-rules.md` → "Testing rules" — in 01–06, and for components in 07, missing
  tests, empty specs and weak assertions are never a finding, while a broken spec or a broken test
  command is;
- resting on what a command did **not** find, unless that command ran to completion and the task line
  records its exit code (`REC-185`) — a quoted hit is self-evidencing and owes nothing;
- a suspicion or a style preference, not a defect;
- already an open task; already parked under `## Beyond the current gate`, which `_review-standard.md`
  forbids re-raising while its gate holds; or already closed in `## Closed` — a `DECISION, no code
  change` line there is what stops the same finding being raised twice;
- a defect in a README that A and B can fix, which is theirs to fix, not to report — **except** a
  rule-4 visual a closed project owes, which no run can capture and `_readme-standard.md` rule 4 sends
  to a task in this file, so it is raised like any other survivor.

**One declared exception to "never a mention": a project with no `PROJECT-BACKLOG.md` yet.** This run
does not create that file — `review-audit` does, with the per-tier `Last Reviewed` lines three gates
read — so its verified defects are listed in the summary as owed to that first review, and the
self-report records only the count and that this exception fired. The gate chain does not reach this branch (G5 runs after G3/G4, which create the file); it
exists for a run launched out of order.

**Raise the survivors.** Append each to `## Tasks` in `{PROJECT_PATH}/PROJECT-BACKLOG.md` at its tier
and priority, in the task format the file's existing tasks follow (`_review-standard.md` owns it), with
an effort estimate and a provenance note — `*(raised YYYY-MM-DD during readme-audit on {project})*`. A
plan or backlog statement the source contradicts is raised as `DECISION, no code change expected`. Touch nothing
else in the file: no triage, fix or reprioritisation of an existing task. **This run never writes
`PLANNING.md`** — an open-task count the plan states is left to `backlog-task-close`'s recount, exactly as
after a `review-audit` run, which also raises tasks and also leaves it; the in-session skills that move
that count do so because they are already editing the plan, and this pipeline is not.

**Commit it on its own**, after the README commit — or where it would have run, when it was withheld —
and before the self-report. `git status` first, then
one path-scoped commit, for the same reason as the README set — nothing staged by a parallel run can
enter it:

```
git commit --only -m "docs({project}): raise <n> backlog task(s) found during readme-audit — <one-line summary>" -- {PROJECT_PATH}/PROJECT-BACKLOG.md
```

It rests on `_session-rules.md`'s any-flow authorization for that file. No survivor, no write and no
commit — say so in the summary. A target the Failure protocol excluded, or a project whose README commit
the coherence check withheld, still has its verified defects raised: they are facts about the code, not
about any README. On `PROJECT_PATH = all`, one such commit per project that raised one.

## Finishing

Print a **summary of changes** across all targets (one line per section changed, grouped by README),
**verify the effect items landed as their items named** (`## Reader-effect judge` → *Verify the
application before you commit* — the `git diff` read against each target's item list, which happens
before this commit and not after it), complete the final **Cross-README coherence** check when applicable,
then **run the commit yourself**, per the **Auto-committed** note
at the top of this prompt (`git status` immediately before committing) — and after it, the separate
backlog commit *Out-of-boundary project defects* owns, when a verified defect survived.

**What the set covers: one commit for this project**, naming each README that actually changed —
never one commit per README, and never all three by default. Use `git commit --only` with those paths
after `--`, without a preceding `git add`: this run leaves no README staged for another parallel run
to absorb, and its commit ignores files another run staged in the shared index. A target excluded by
the Failure protocol is left out of the commit path set even if its file changed. On
`PROJECT_PATH = all`, one such set per project, printed together at the end in project order.
Example, for a full-stack project whose three READMEs all changed:

```
git commit --only -m "docs: update {PROJECT_PATH} README(s) — <one-line summary of main changes>" -- {PROJECT_PATH}/README.md {PROJECT_PATH}/backend/README.md {PROJECT_PATH}/frontend/README.md
```

## Pipeline self-report (orchestrator, last)

After the commit, **execute `notes/prompts/_internal/_pipeline-self-report.md` in full.** That file is
the contract, not a summary of one: the skill-friction and ledger reconciliation, the `Status:` line,
the five bullets — restated as the seven below — the close-out check against disk, the
`_run-tracker.md` update, the two-file commit
and its `git show --stat HEAD` verification, the breach-log rulings and the at-end refinement gate all
apply here unchanged. This step only says what **this** pipeline puts in them.

Write a short **Pipeline self-report** to
`notes/prompts/projects/readme/_internal/_last-run-report.md` (overwrite; header: date + project(s) +
`Status:`) — meta-observations about the run itself, not the READMEs. This is the evidence a later
session uses to decide whether these prompts need changing, so be honest, including "nothing to report":
- **Report discipline** — which subagents, if any, blew their line budget or returned reports that had
  to be discarded, and which A/B report omitted its `Out-of-boundary defects:` line; then the channel's
  count — defects reported, raised (with the commit) and dropped, by reason.
- **Trace verification** — reviewer traces that were missing/incomplete, re-dispatches made, any false alarm.
- **Coherence** — conflicts the coherence subagent found (a sign the author prompts under-specify a
  shared decision), or `COHERENT`.
- **Effect judge** — how many items it returned per target, how many B objected to, **how those
  objections were settled** (sustained / overruled / sustained for want of a decision), how many
  items carry `⚠ regenerable — standard gap`, and **what the pre-commit `git diff` verification found**
  — a run whose verification found nothing says so, because zero objections plus an unreported check is
  the shape the 2026-09-02 run had when it was wrong. Those are machinery facts; *which* bullets they
  were is content and belongs in the run's chat summary, per `_pipeline-self-report.md`. The judge reads
  each finished README whole and is not written by that README's slice owners, so per
  `_pipeline-self-report.md` bullet 1 its findings **outrank the green traces** as
  evidence that the author→reviewer split worked — alongside the coherence pass, which qualifies the same
  way on full-stack. A target where the judge returned a long list is one where A and B were both
  satisfied by something that does not land.
- **Failure protocol** — subagents that errored, second failures, any README excluded from the commit.
- **Anything else** that made the run harder than it should be — **and any rule this run broke** (a
  skipped gate, a mandated dispatch not made, an effect item applied unread). That half is the
  contract's bullet 4, and a breach named here also earns a row in `_breach-log-readme-audit.md`.
- **Verdict** — "pipeline clean" or "change worth considering: X" (the uniform criterion from
  `notes/prompts/_internal/_pipeline-self-report.md`).

Seven bullets, one line each. This file is prompt-system machinery (not a project file), so **commit it
directly** under the notes/prompts exception, per `_pipeline-self-report.md` → "How to commit it" —
`git status` before add and before commit, staging `_last-run-report.md` **and** `_run-tracker.md`
(plus `_breach-log-readme-audit.md` when this run wrote a row or moved a disposition in it), message
`docs: pipeline self-report for readme-audit run on {PROJECT_PATH}`. (It is a separate commit from the README set.) The prompts stay frozen
unless this report shows a real failure. Also print the report in chat.

## Hard rules

- **Commit the READMEs yourself**, as **one commit for the project**, not one per README — the same
  `_session-rules.md` permission `readme-concept-add` uses, and the same shape as `plan-audit`
  (`PLANNING.md`) and `review-audit` (`PROJECT-BACKLOG.md`). Never ask Victor to run it. The other files
  this flow commits are the shared contract's — `_last-run-report.md` and `_run-tracker.md` at
  minimum — separately, under the notes/prompts exception; and `PROJECT-BACKLOG.md`, in its own commit,
  when a verified out-of-boundary defect is raised.
- **A project defect a role reports is raised or dropped with its reason — never left in the chat**
  (the no-backlog-file exception aside), and never fixed by this run. The run never writes `PLANNING.md`.
- **One README per author→reviewer pair.** Never let one subagent write all three — the focused,
  audience-specific pass is the whole point.
- **Only commit READMEs that changed** — never name all three by default, and do not stage them first.
- Never skip the reviewer pass, and never skip the reader-effect judge — a run that stops at B has
  answered only the conformance question.
- **Never commit an applied effect item you have not read in the diff.** Zero objections is not a pass:
  the 2026-09-02 `04-meal-finder` run was green on every trace while B silently applied a cut the
  standard's own rule 8 contradicts (`REC-202`).
- **The judge proposes and B writes.** Never let the judge edit a README, and never end a *successful*
  run with its items unapplied and printed as a to-do list for Victor — the one exception is the twice-
  failed applier above, where they are declared as a failure rather than handed over as work.
````
