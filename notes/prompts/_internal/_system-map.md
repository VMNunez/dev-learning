# System map — every prompt, every skill, and the file each one writes

**What this file is.** The wiring diagram of the whole study system: *producer → file → consumer*, with
prompts and skills on the same page. It answers four questions the other reference files answer only
in halves:

1. **What runs after what**, and why (the chains in §3–§6).
2. **Who writes this file**, when several things can (the registry in §7, and `PROGRESS.md` section by
   section in §8 — the file with the most writers and the most confusion).
3. **What a run leaves behind that nobody asked for** — the debts and flags in §10.
4. **How the system improves itself** — why a prompt is frozen, what unfreezes one, and the single
   automated check that guards the whole thing (§12).
5. **What fires inside one day**, block by block, and how unevenly the load falls across them (§13) —
   the view every other section cuts the opposite way, by track.

**It is derived, not authoritative.** Three files outrank it and each owns a different half:

| File | Owns |
|---|---|
| `notes/prompts/_internal/_session-rules.md` | the session contract: the rituals, the commit boundary, the non-negotiables |
| `notes/prompts/README.md` | the prompt catalogue: what each of the 31 prompts reads and generates, batch mode, run order |
| each `SKILL.md` (`.claude/skills/` + `.agents/skills/`) | the exact steps of one ritual |

If this map disagrees with any of them, they win and this file is wrong.

**The two derived maps have one owner per fact.** `README.md` owns every prompt's public interface and
exact per-prompt contract: command, run-first prerequisite, configuration/received inputs, reads,
writes/returns, dispatched roles/isolation, commit owner, local handoffs/gates, and exclusions. This map
owns relationships that exist only across components: chain order, file-level writer/consumer edges,
section ownership, debts/symptoms/improvement flow, and the complete per-skill contract in §9. The chain
sections below use prompt names and endpoint files only as adjacency labels; their per-prompt details
link back to the README and never override its row. `/system-check` audits both halves together and
rejects a genuine duplicate rule fork.

**How it stays true.** It is hand-written and nothing regenerates it, so it is kept in sync by a rule
rather than by a build step: `_session-rules.md` → **"The two maps follow every change to the machinery"**.
Any edit to a prompt or a skill — a ledger item applied, a self-report's at-end refinement, a new or
changed ritual — runs one test (*did this change what a file contains, who writes it, when something
runs, or which prompts and skills exist?*) and, on a yes, carries the map edit **in the same commit as
the change**. On a no, the run says `maps unaffected` out loud. Both self-report contracts
(`_pipeline-self-report.md`, `_single-shot-self-report.md`) and the recommendation ledger point at that
rule from their own commit flows, because those are the three places the machinery actually gets edited.

**And by a second rule with the opposite trigger** — `_session-rules.md` → **"The map is also verified on
read, not only on write"**. A change-triggered rule cannot catch the cell that was true when it was
written and rotted with nothing being edited, so a file read **whole** licenses a ruling on the rows
about *that* file — and the licence differs by kind, so never merge the three: **a prompt** gets §7, its
§3–§6 step, its §10 debt, its §11 symptom row and its `README.md` catalogue cells, but **not §9**, which
is skills only; **a `SKILL.md`** gets its §9 row and its §7 cells, but **not** a chain step, a debt or a
symptom row; **a standard** gets the §7 row for the file it governs only where it states that ownership
itself. Never a chain's order, §8's ownership or §1's properties, which no single file can falsify. A
read of any depth rules on a **contradiction**; only a whole read rules on an absence. A correction lands
in **its own commit** and the verdict is said out loud: `map: verified — {rows}` / `map: corrected —
{row}` / `map: not verified — partial read`. It never blocks and never sweeps, so rows about prompts
nobody opens stay unverified between explicit global audits. `/system-check` is that on-demand sweep;
`REC-054` is the separate question of whether the machinery adds up to a workable day — a verdict that
accrues from use, never a scheduled review.

**Both triggers are walked by the `map-sync` ritual** (§9), which exists for the same reason
`step-complete` does: the rules above were already written and the observed failure is *partial*
compliance — §7 gets corrected while the §9 row, the chain step and the §11 symptom row keep telling the
old story, leaving the map contradicting itself with no way to tell which half is current.

---

## 1 — Two engines, one system

Everything in the repo is written by one of two things, and they are built on opposite principles.

| | **Prompts** (`notes/prompts/`) | **Skills** (`.claude/skills/`, `.agents/skills/`) |
|---|---|---|
| Where it runs | a separate, **cold** conversation | inside the **daily session**, with full context |
| How it starts | you launch it — `/name` or paste the config block | it **fires on an event**; you never launch it |
| Unit of work | one topic+level, one project, one note pair — or the whole machinery for explicit `/system-check` | one step, one task, one file, one block |
| Questions | config up front, then hands-off to the end | **zero, by design** — a ritual that asks stops being run |
| Depth | fans out cold subagents, one per concern | one pass down a mechanical checklist |
| Trace it leaves | `_last-run-report*.md` + a row in `_run-tracker.md` | only the ritual's files on success / expected paths; one `_skill-friction.md` row when a declared step observably fails |

**The division of labour:** *prompts author scope in bulk; skills record what one session actually
produced, one item at a time.* The coverage files are the clearest case — `/coverage` writes a hundred
bullets from the market analysis, and `coverage-bullet-add` writes the single bullet yesterday's step
turned out to need. Same file, two doors, deliberately: the second one exists because in a daily
session no prompt is running at all, and without it the concept ships in the code and never enters the
curriculum.

**The commit boundary is authorship, not folder.** Machinery the agent writes commits itself
(`notes/`, `notes/prompts/`, skills and commands, **the session-rule files themselves**, `PROGRESS.md`,
any `PLANNING.md` / `README.md` / `PROJECT-BACKLOG.md`, `projects/briefs/`, `practice/sql/MISTAKES.md`
and the SQL plan files, and `ROADMAP.md` — that last one by `roadmap-review` alone and only on a clean
run). **Anything Victor produces himself** — project code, SQL answers, timed-simulation solutions, and
leetcode solutions — is never auto-committed; the agent only prints the commands. The SQL and simulation
plans, mistake logs, tracker, and generated test specs also live under `practice/`, but are the system's,
not his. Full rule in `_session-rules.md`.

---

## 2 — The chains at a glance

```
                     _job-market-evidence.md ◄── evidence-intake · cv tailor
                              │
                              ▼
  A. KNOWLEDGE   /coverage ─► /coverage-verify ─► /notes-plan ─► /notes-audit ─► en+es pair
                     │                                  ▲
                     │                        (⚠ stale flag)
                     │                                  │
                     │              coverage-bullet-add ┘
                     └──► /interview-prep-audit ─► unrefined Q&A ─► /interview-prep-route
                                                               │              │
                                                      Victor refines     interview-prep-block-open
                                                                              │
                                                                      study-block-close ─► PROGRESS
                     │
                     ├──► notes/coverage/{level}.md ──────────────┬──────────────┐
                     │                                            │              │
  B. PROJECTS        │   /progress-update ─► /project-brief ─► /plan-audit ─► PLANNING.md
                     │            ▲                                              │
                     │            │                     build ─► step-complete ──┤
                     │            │                                              │
                     │            │        /review-audit ─► PROJECT-BACKLOG.md / Highs
                     │            │                              │
                     │            │        backlog-task-open ─► backlog-task-close
                     │            │                              │ fixed Highs
                     │            │        /readme-audit ─► /progress-update ─► /portfolio-audit ─► cv-bullets.md
                     │            └── /roadmap-review ─► ROADMAP.md                    │
                     │                                                                 ▼
  C. SQL             └──► /sql-plan ─► PLANNING-{LEVEL}.md              D. APPLY   /cv · /linkedin
                              ▲              │                                     /cover-letter
                     /sql-plan-audit    sql-block-open                              /tracker
                                                                                    /profile-readme
                                             │                                          │
                          /sql-exercises ─► sql-grade ─► sql-step-close ─► drill markers │
                                             │                    │                      ▼
                                        MISTAKES.md ◄── sql-block-close        /evidence-intake
                                             │                                     (loop closes)
                                        R1–R5 revision points

  C2. SIMULATIONS  coverage + PROGRESS ─► /simulation-plan ─► route ─► /simulation-generator
                                                                  │              │
                                                                  └─► open ─► timed attempt ─► close
                                                                                              │
                                                    MISTAKES ◄─ correction ◄─ simulation-grade
```

`/system-check` sits outside Chains A–D. It consumes the canonical machinery, both launcher catalogues,
mirrored skills, the validator and both maps as one explicit global audit after substantial changes; it
never becomes a prerequisite of their ordinary runs or commits. Its machinery-only boundary — declared
path patterns in, the live artifacts governed by them out — is stated by
[its README catalogue row](../README.md#system--audit-the-machinery-system) and owned by the prompt's own
`Boundaries` section; §10 records only the gotcha it creates.

`/system-gaps` sits outside them too, and asks the one question no chain asks about itself: **what is
missing from the diagram above.** Its evidence is this map and the README, read whole and nothing else —
which is what makes it cheap enough to re-run as the machinery grows, and what fixes its ceiling: it can
only find a hole the two maps are already describing the edges of. It corrects nothing, and it may not
open the file that would settle a finding, so an absence it reports has two branches — the machinery
lacks it, or these maps omit it — and resolving that is `/system-check`'s or `map-sync`'s work, never its
own. §11 carries its symptom row; §12 places it in the improvement loop.

---

## 3 — Chain A: knowledge (coverage → notes → Q&A)

Exact command contracts live in the [README public interface index](../README.md#public-interface-index) and its [family catalogue](../README.md#the-prompts--what-each-one-reads-and-generates). This section owns only cross-component order and durable edges.

    /coverage → /coverage-verify ─┐
         └───────────────────────┴→ /notes-plan → /notes-audit → bilingual notes
         └→ /interview-prep-audit → /interview-prep-route
                                          └→ interview-prep-block-open → study-block-close → PROGRESS.md

    all topics at one level → /coverage-audit → /roadmap-review

_cross-topic-inbox.md is the durable edge between topic owners: coverage producers file foreign-topic proposals there, and the owning /coverage run consumes its heading. An inline coverage-bullet-add creates a durable /notes-plan remap debt rather than editing a fingerprinted plan by hand.

---

## 4 — Chain B: projects (decide → plan → build → review → gate)

Exact command contracts live in the [README public interface index](../README.md#public-interface-index) and its [family catalogue](../README.md#the-prompts--what-each-one-reads-and-generates). This section owns only chain order and project gates.

    /progress-update → /project-brief → /plan-audit MODE=new → build
    → step-complete (G1)
    → /review-audit G3/G4 → fix every High
    → /readme-audit G5 → empty /progress-update G6
    → /portfolio-audit G7 → /roadmap-review G8

backlog-task-open → teach/fix → backlog-task-close is the per-finding loop between G3/G4 and G5. G2 sits off this line: it fires only when the plan or branch strategy moves mid-build, and runs `/plan-audit MODE=review`. PLANNING.md §23 is authoritative for these gates; SQL's separately named G1–G4 belong to practice/sql/PLANNING.md §9 and do not redefine this chain. G6 closes only on an empty drift report.

---

## 5 — Chain C: SQL (the 12:30 block)

Exact command contracts live in the [README public interface index](../README.md#public-interface-index) and its [family catalogue](../README.md#the-prompts--what-each-one-reads-and-generates). This section owns only SQL and simulation wiring.

    notes/sql coverage → /sql-plan → /sql-plan-audit → level route
    → sql-block-open → /sql-exercises → Victor answers → sql-grade (cold)
    → sql-block-close / sql-step-close → drill markers + §8c readiness → /simulation-plan

    coverage + PROGRESS → /simulation-plan → route
    → simulation-block-open → /simulation-generator → timed attempt
    → simulation-block-close → simulation-grade (cold)
    → correction or later reinforcement when required

SQL revision returns through MISTAKES.md and the doctrine's G3/G4 gates. Simulation grading preserves the original timed verdict and returns only its tracking/progress effects to later planning.

---

## 6 — Chain D: apply (and how the loop closes)

Exact command contracts live in the [README public interface index](../README.md#public-interface-index) and its [family catalogue](../README.md#the-prompts--what-each-one-reads-and-generates). This section owns only application/evidence wiring.

    /portfolio-audit → project interview evidence + CV evidence
    → /cv · /linkedin · /profile-readme

    one offer → /cv MODE=tailor + /cover-letter → /tracker
    recurring gap → /evidence-intake → _job-market-evidence.md → /coverage

Practice tracks keep their own mistake/correction loops. §7 owns file writers and commit boundaries; the README owns every command's inputs, outputs and exclusions.

---

## 7 — The writer registry

Every file whose ownership is contestable — **including the ones with exactly one writer**,
where the row's whole job is to say *only this, never by hand*. The bottom block is the machinery's own
files: the system that describes and checks the system, which has writers like everything else.

| File | Written by | Read by |
|---|---|---|
| `notes/{topic}/coverage/{LEVEL}.md` **+ mirror** `notes/coverage/{LEVEL}.md` | `/coverage`, `/coverage-audit` (bulk) · `coverage-bullet-add` (one bullet) · `coverage-mark` (project markers) · `sql-step-close` (drill markers, SQL only) | everything downstream. **A practice gap never authors a bullet here**: `/simulator`, `/hr-screen`, `/code-review-practice` and the simulation loop point at existing scope or become Q&A through the owning prompt — the writer list above is exhaustive |
| `notes/{topic}/coverage/verify-{LEVEL}.md` | `/coverage-verify` | `/notes-plan` (advisory), `/coverage` update |
| `notes/{topic}/coverage/notes-plan-{LEVEL}.md` | `/notes-plan` (whole route) · `/coverage` (`Plan status: stale` only) · `/notes-audit` (concept/status + studied reset) · `study-content-writer` (studied reset only) · `study-block-close` (studied date only) | `/notes-audit` (fingerprint gate), `/coverage`, `/interview-prep-audit`, `/progress-update` |
| `notes/{topic}/{level}/en|es/*.md` | `/notes-audit` · in session, guided by `study-content-writer` for an existing complete, non-frozen pair only | Victor |
| `notes/interview-prep/{LEVEL}/en|es/*.md` | `/interview-prep-audit` (whole bank) · `/simulation-review` and `/code-review-practice` (born-unrefined insertions only, under the whole of the standard's "Adding questions from outside the audit" — which is where that contract is stated, not here; each prompt gates once per run on a fresh fingerprint and falls back to proposing the questions instead — in its report for `/simulation-review`, in chat for `/code-review-practice`) · `study-content-writer` (unrefined/reopen/refine) · `study-block-close` (`[studied]` only) | `/interview-prep-route`, `interview-prep-block-open`, `/simulator`, `/progress-update` |
| `notes/interview-prep/routes/{LEVEL}.md` | `/interview-prep-route` only | `interview-prep-block-open`, `study-block-close`, `/progress-update` |
| `notes/interview-prep/projects/*.md` | `/portfolio-audit` | `/simulator` |
| `PROGRESS.md` | **section by section — see §8** | `/plan-audit`, `/roadmap-review`, `/project-brief`, `/review-audit`, `/cv`, `/linkedin`, `/sql-exercises` |
| `ROADMAP.md` | `/roadmap-review` (+ `/plan-audit` marks the chosen project) | `/project-brief` · `plan-audit`'s and `/portfolio-audit`'s authors · the apply family (`/cv`, `/linkedin`, `/cover-letter`, `/hr-screen`) · `/evidence-intake` · `/interview-prep-audit` and `/interview-prep-route` · `/simulation-plan` · `/sql-plan` and `/sql-plan-audit` · the SQL gates |
| `projects/briefs/project-brief-{NN}.md` | `/project-brief` | `/plan-audit MODE = new` (refuses a stale one) |
| `{project}/PLANNING.md` | `/plan-audit` · `step-complete` (✅ + §0 `Current step`, `Current branch`, the `Done condition` that names them) · `backlog-task-close` (rules section + §0; `Current step` and its `Done condition` only when no §15 step closed earlier that session, `Current branch` only when its own fix ends that branch's work per §22) · `Next gate` derived — the first §23-chain gate not yet signed off (`_planning-standard.md` invariant 10; its quality-gate rules define *signed off*, and an unmerged fix branch signs nothing off), the close writes the blocked/signable qualifier on it · `Phase`/`Last updated` from both — **two daily §0 writers, cells partitioned, order free, the second reads what the first left** (`REC-091`) | `/readme-audit`, `/review-audit`, `/portfolio-audit`, `/progress-update`, `/roadmap-review`, every session |
| `{project}/README.md` (+ backend/frontend) | `/readme-audit` (whole file) · `readme-concept-add` (one entry) | `/portfolio-audit`, recruiters |
| `{project}/PROJECT-BACKLOG.md` | `/review-audit` (tasks) · `backlog-task-open` (`⏸ Deferred`) · `backlog-task-close` (`## Closed`) | `/portfolio-audit` (open High/Medium block the verdict), every session start |
| `notes/cv/cv-bullets.md` | `/portfolio-audit` | `/cv` |
| `dev/portfolio/VMNunez/README.md` (**separate repo**, never committed from here) | `/profile-readme` (`sync` / `optimize`) · `/portfolio-audit` on a ✅ Ready verdict — two writers, two triggers | recruiters; the profile repo's own adapter carries the gap list |
| `practice/sql/PLANNING.md` (doctrine) | `/sql-plan-audit` · the grader's §0 rewrite · `sql-step-close` (§0 verify) · `/sql-plan` did the one-time split that created it | every SQL prompt and skill · `/simulation-plan` and `/simulation-generator` (§8/§8c closed-step fence) |
| `notes/prompts/knowledge/coverage/_internal/_cross-topic-inbox.md` | any coverage run · `coverage-bullet-add` (a concept another topic owns) | `/coverage` (its own heading, Step 1) · `/coverage-audit` (all headings) |
| `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` (route) | `/sql-plan` (creates) · `/sql-plan-audit` (extends) · `sql-grade`'s subagent (counts/status) | `/sql-exercises`, `sql-block-open` |
| `practice/sql/MISTAKES.md` | `sql-grade`'s subagent (`## Open`) — and the same grading branch reached directly through `/sql-exercises MODE = review`, the legacy door that still grades but closes no step · `sql-block-close` (`## Fricción`) | the R1–R5 revision points |
| `practice/sql/{LEVEL}/NN-*.sql` | **Victor** (the grader only appends `-- ✅ Corregido`) | `sql-grade` |
| `practice/simulations/PLANNING.md` (doctrine) | `/simulation-plan` (creates once) · `/simulation-generator`, `/simulation-review`, `simulation-block-close` (§0/state only) | every simulation prompt and skill |
| `practice/simulations/{LEVEL}/PLANNING-{LEVEL}.md` (route) | `/simulation-plan` (creates/reconciles + reinforcement steps) · `/simulation-generator` (generation/state) · `/simulation-review` (verdict/correction/redemption/history) · `simulation-block-close` (attempt handoff) | every simulation prompt and skill · `/progress-update` |
| `practice/simulations/{type}/NN-*.md` (spec) | `/simulation-generator` (whole spec) · `simulation-block-close` and `/simulation-review` (attempt header only) | Victor · `simulation-block-open` · `simulation-grade` / `/simulation-review` |
| `practice/simulations/TRACKER.md` | `/simulation-generator` (rows) · `simulation-block-close` (self-assessment/attempt) · `/simulation-review` (status/history) | `/simulation-plan`, `/progress-update`, every simulation skill |
| `practice/simulations/MISTAKES.md` | `/simulation-review` (graded gaps/corrections) · `simulation-block-close` (friction) | `/simulation-plan`, `simulation-block-open`, `simulation-grade`, revision points |
| `practice/interview/MISTAKES.md` | `/simulator` · `/hr-screen` · `/code-review-practice` (their own performance gaps) | the same three prompts, each consuming only its own surface rows |
| `notes/prompts/_internal/_job-market-evidence.md` | `/evidence-intake` · `/cv tailor` | `/coverage`, `/coverage-audit`, `/interview-prep-audit`, `/interview-prep-route` |
| `notes/prompts/_internal/_run-tracker.md` | every prompt's close-out · **`coverage-bullet-add`** (the one skill that writes here) | you and prompts that gate on it; `/system-check` reaches it only through the universal pipeline close-out, never as semantic-audit inventory |
| `notes/prompts/_internal/_skill-friction.md` | any of the seventeen skills, only when the shared session contract's observable failed-step trigger fires · either self-report close-out changes only `Disposition` during serialized reconciliation | both self-report close-outs (including `/system-check`'s universal close-out), never the machinery audit's inventory or verdict |
| `notes/prompts/_internal/_ritual-friction.md` | **any session, the moment Victor says a ritual cost more than it gave** — `_session-rules.md` → "When a ritual works and is not worth it". Not a skill's own contract and not a prompt close-out: the ritual succeeded, so nothing in it fired. Only `Status` changes after insertion, written by the ruling | `_recommendation-ledger.md` → `REC-054` (c) **only**. Explicitly not a work queue: no close-out adjudicates it, no cold reviewer is dispatched over it, and it never becomes a `REC` |
| `notes/prompts/README.md` **and this file** | whoever changes the machinery, **in the same commit** (including an approved prompt self-refinement) · the `map-sync` ritual, which walks both triggers · `/system-check`, the only prompt whose primary work is auditing both maps · never a build step. **`/system-gaps` reads both and writes neither** — it is the one prompt that takes these two files as its whole evidence, which is exactly why it is forbidden to correct them | anyone orienting in the system — which is why a wrong row is worse than a missing one; `/system-check` (as the object it audits) and `/system-gaps` (as the only evidence it has) |
| `notes/prompts/system/_internal/_system-check-report.md` | `/system-check` only, overwritten on each explicit run | Victor; the next `/system-check`; later whole-system refinement work |
| `notes/prompts/system/_internal/_system-gaps-report.md` | `/system-gaps` only, overwritten on each explicit run — including a blocked or dry run | Victor; **the next `/system-gaps`, which is not optional**: the candidates deferred over the five-row promotion cap keep their rank there and nowhere else, so an unread report silently drops the queue it exists to carry |
| `notes/prompts/_internal/_session-rules.md` (+ the two thin platform adapters that delegate to it) | **whoever changes the session contract, by hand** — §1's commit boundary names the session-rule files themselves, so it commits directly. Never a prompt, never a skill, never a build step | every session at start, through the platform adapter that delegates to it; 17 of the 31 prompts also name it directly (`/system-check` audits it rather than obeying it). It **outranks this map** |
| `notes/prompts/_internal/_recommendation-ledger.md` | **every close-out that produced a recommendation**, reconciling it into `## Open` before the report's bullets are written · `/system-check` for cross-system audit findings · **Victor, or a session acting on his instruction, raising an item by hand** — `REC-046`, `REC-054`, `REC-055`, `REC-070`, `REC-076` and `REC-077` have no originating run, and this is the only entry point that does not · `/system-gaps` for gap findings that clear its promotion bar, at most five rows a run · whoever resolves an item, collapsing it into `## Closed` and promoting any rule it established into the preamble | whoever picks up the next item; `/system-check` audits its improvement-loop contract and uses current rows only to deduplicate machinery findings, never to build an operational-debt queue. It is the current status source — a historical report is immutable evidence and its wording never overrides it |
| `{family}/_internal/_last-run-report*.md` | **its own prompt's close-out only** — one per runnable prompt, **overwritten** each run, never appended, and committed together with `_run-tracker.md` | that same prompt's step 0 run-start check (via the `Status:` line), and the ledger reconciliation |
| `notes/prompts/strategy/tracking/_internal/_last-drift-report.md` | `/progress-update` Step E only — **every run, the clean one included**, overwritten, committed alone and before the matrix commit. Not the same file as the close-out's `_last-run-report.md` beside it, which carries machinery evidence and is forbidden content | whoever ticks the two gate checklists that close on an empty drift report — see §10. The clean run is precisely the one with no other trace: it commits no `PROGRESS.md` |
| `notes/prompts/_internal/validate-prompt-system.ps1` | whoever changes the machinery, in the same commit as the invariant it checks | full mode by hand; `/system-check` uses `-MachineryOnly` before and after its semantic audit so live coverage/plan/route state cannot block — see §12. The only automated check in the system |
| every `_*-standard.md` (family and root) · `_batch-mode.md` · `_single-shot-self-report.md` · `_pipeline-self-report.md` | **by hand only.** The fence, its population and its reason are owned by `_session-rules.md` → "Who writes a standard or a shared contract" | every prompt and skill of the family the standard governs, as its rulebook. `/system-check` audits them and never repairs them; `/system-gaps` never opens one |
| `notes/prompts/_internal/_shared-context.md` | **by hand.** No prompt writes it; the market file beside it (`_job-market-evidence.md`) is the one that gets fed automatically | almost every prompt. `_session-rules.md`'s "Who I am" bullets are its condensed copy, so the two drift apart unless they are edited together |
| `notes/prompts/knowledge/coverage/_internal/_topic-ownership.md` | **by hand, through its own admission contract, with explicit authorization.** A coverage run that meets an unregistered topic **stops** — it never infers a boundary and never registers one silently | `/coverage`, `/coverage-audit`, `/roadmap-review`, `coverage-bullet-add` (altitude routing), and every prompt whose `TOPIC` field reads "one registered topic" |
| `personal/job-search/**` (**outside the repo**, never committed from here) | `/cv` (`master/`, `applications/`) · `/tracker` (`tracker.csv`, `applications/<empresa>-<puesto>/`) | the whole apply family — `/cv` through `_application-standard.md` and by name (`master/`, `archive/` when no CV is pasted) · `/linkedin` through the standard only · `/cover-letter` both through it and by name for `internship-daw.md` · `/tracker` by name (`tracker.csv`, and every `applications/*/outcome.md` in `analyze`) · `/profile-readme` for `internship-daw.md`. Existence proves nothing here: a close-out checks the **mtime is from this run** |

---

## 8 — `PROGRESS.md`, section by section

This is the file you asked about, and the one where "who writes it" is least obvious. The rule since
2026-08-05: **`/progress-update` is an auditor, not this file's writer.** It writes one table and
*measures* the rest, reporting drift and naming the ritual that owns the repair.

| Section | Its writer | Notes |
|---|---|---|
| `## Professional level by topic` | **`/progress-update`** — the only writer of the table | needs all 13 topics at once, which no ritual can compute. `step-complete` / `backlog-task-close` may update a single **evidence cell** when a step or fix earns it |
| `## Coverage demonstrated` | **`/coverage`, `/coverage-audit`, `coverage-mark`, and `coverage-bullet-add`** | each **recounts** the affected cells and the `Total` row from the coverage files when it changes scope or markers. `step-complete` deliberately does **not** touch this table: a memory-derived copy would overwrite the recounted one |
| `## Study progress` | **`study-block-close`** | notes dates and bilingual `[refined] [studied]` IDs are primary state; the current route supplies the CORE denominator. This section rolls up Notes + CORE + full bank per level; `/progress-update` measures it as D9 and reports drift |
| `## Projects` | **`step-complete`** (the `Status` cell) | the row itself is created by `/plan-audit MODE = new`; backlog closes update `Professional level by topic` evidence when earned, not this status cell |
| `## Practice completed → Exercise route` | **`/sql-plan` (seeds/re-syncs the projection) · `sql-grade`'s cold subagent (moves the counts)** | `sql-step-close` re-checks that the `Total` rows still add up. The `Corrected` total cell stays blank by design |
| `→ Timed simulations` | **`/simulation-review`** | counted by explicit level + track from `practice/simulations/TRACKER.md`; `/progress-update` audits it |
| `→ LeetCode` | nothing yet — gated behind the ROADMAP gates | |

**No concept lists.** The per-technology concept sections were deleted on 2026-08-03 because they were
an evidence-free second copy of the coverage files. A concept goes to `notes/{topic}/coverage/{level}.md`
and nowhere else; only its *effect* on level, percentage or project status is recorded here.

---

## 9 — The skills, one row each

All seventeen are mirrored in `.claude/skills/` and `.agents/skills/`; **editing one means writing the
identical file to the other in the same commit.**

| Skill | Trigger + received input | Primary reads | Writes / returns | Commit owner + isolation | Handoffs, gates + explicit exclusions |
|---|---|---|---|---|---|
| `step-complete` | a learning-plan step is finished; done-condition evidence + active project | active `PLANNING.md` step/§0/§22/§23, tests/run evidence, project docs, `PROJECT-BACKLOG.md` open High/Medium state (for the `Next gate` derivation), `PROGRESS.md`, relevant coverage | done-condition trace · `PLANNING.md` ✅ + §0 next pointer (`Current step`/`Current branch`/`Done condition`/`Phase`/`Last updated`, and the `Next gate` re-derived under invariant 10, carrying an earlier close's blocked/signable qualifier) · `PROGRESS.md` status/evidence | agent commits tracking/docs; Victor's code and code commit remain untouched | calls `coverage-bullet-add`, `coverage-mark`, `readme-concept-add`; not for backlog tasks or merely compiling code |
| `coverage-bullet-add` | a completed step/task taught a concept absent from coverage | concept/evidence, `_topic-ownership.md`, both coverage copies, `_cross-topic-inbox.md`, tracker and coverage totals | missing bullet in both copies, or cross-topic proposal · stale-plan flag · recounted coverage cells · owed-remap return | agent commits its notes/tracking writes; no code | never adds an evidence marker or performs `/notes-plan`; hands the existing bullet to `coverage-mark` |
| `coverage-mark` | a concept was applied in project code; project slug + falsifiable evidence | matching bullet in topic coverage + global mirror, `PROGRESS.md` coverage totals | `✅ NN-slug — {evidence}` on both copies · recounted cells | agent commits coverage/tracking only | never authors a bullet, marks study, or treats an unmarked bullet as uncovered |
| `readme-concept-add` | a step/task applied a concept; project + audience | README standard, project layout and existing global/backend/frontend READMEs | one entry in the audience-owned README/section | agent commits project documentation only | no restructuring, unrelated cleanup, screenshots or audit-pipeline work |
| `backlog-task-open` | Victor selects one project backlog task | named code, governing `PLANNING.md`, Closed ledger, all consumers, level evidence, other open tasks | five-verdict return; only `⏸ Deferred YYYY-MM-DD — gate` on the defer route | agent commits that marker only; no project-code edit | teach-first cycle, or `backlog-task-close` for dropped/already-resolved/false-positive; never re-reviews or closes a fix |
| `backlog-task-close` | a backlog fix/decision is complete and evidenced | task + fix/commit evidence, coverage, README, `PLANNING.md`, `PROGRESS.md`, backlog ledger | coverage bullet/marker where eligible · README entry · plan rule/§0 (`Last updated` always, the blocked/signable qualifier on `Next gate` after a gate sign-off; `Current step` + its `Done condition` only when no §15 step closed earlier that session; `Current branch` when the fix ends that branch's work; `Phase` only across a real phase boundary) · `Professional level by topic` evidence when earned · one-line Closed ledger | session authorship boundary: agent-owned docs/tracking; Victor owns the fix code commit | calls the three focused writer skills; not for learning-plan steps or ordinary commits |
| `study-content-writer` | daily-session note or Q&A authoring/refinement request | note/Q&A standards, coverage/plan, EN/ES counterpart, target files | bilingual note/Q&A changes · studied reset · stable IDs · `[refined]` only on Victor's explicit acceptance | commit governed by the session/adapter authorship contract, not this skill; no cold audit pipeline | routes missing/pending notes to `/notes-plan` + `/notes-audit`, active recall to `study-block-close`; excludes project docs and prompt machinery |
| `interview-prep-block-open` | Victor starts/continues active recall; one answer at a time | CORE route, lifecycle/answer-quality standard sections, bilingual bank pair, `PROGRESS.md` study orientation | read-only orientation + PASS/BORDERLINE/FAIL return | no write or commit; grading stays in-session | hands exact final-PASS IDs to `study-block-close`; never reveals answers first or assigns `[studied]` |
| `study-block-close` | Victor ends the notes/interview block; facts already proved in-session | completed/refined plan entries, exact refined bilingual Q&A IDs, CORE route, `PROGRESS.md` | note `Studied` dates · Q&A `[studied]` after final PASS · recounted Notes/CORE/bank rows | agent commits notes/tracking | never infers study, asks questions, or marks authored-but-unstudied content |
| `sql-block-open` | the 12:30 SQL block starts | SQL doctrine §0, selected route, current exercise, MISTAKES, relevant notes plan, `PROGRESS.md` | read-only next-moment orientation | no write or commit | reports stale §0; never generates, grades, closes, or silently repairs |
| `sql-grade` | Victor says an answered SQL file is ready | doctrine/route, complete answer file, coverage and grading contract | no direct grading; one **cold subagent** writes MISTAKES/tracking/route/doctrine state and returns the score | agent owns authorized tracking writes; Victor owns `.sql` answers and their commit | refuses partial files; calls `sql-step-close` only on ≥80% + last file; never generates exercises |
| `sql-step-close` | the last file of a SQL step scored ≥80% | scored files, route/doctrine, both SQL coverage copies, `PROGRESS.md`, MISTAKES/revision state | drill markers · §0/Total checks · §8c readiness · due-gate return | agent commits coverage/tracking; never Victor's SQL answers | names revision/level gates; never grades or closes a daily block |
| `sql-block-close` | Victor ends the SQL block; friction already stated | current route and MISTAKES plus stated friction | `## Fricción` rows only + tomorrow-start return | agent commits the authorized MISTAKES write; Victor owns `.sql` | never grades, infers friction, closes a step, or generates exercises |
| `simulation-block-open` | a timed-simulation block starts | doctrine/route, coverage/progress snapshots, specs, TRACKER, MISTAKES | read-only one-next-moment orientation | no write or commit | `/simulation-plan` on drift, otherwise generator/attempt/correction; never starts timer, grades or edits |
| `simulation-grade` | a planned attempt or correction is ready and complete | route/doctrine, spec, submitted solution/correction, TRACKER, MISTAKES | no direct grade; one cold `/simulation-review` performs authorised tracking/correction writes | agent commits system-owned simulation artifacts; Victor's submitted solution stays untouched | refuses incomplete inputs; routes Borderline/Fail to corrections and preserves the original timed verdict |
| `simulation-block-close` | timer/block ends; stated time, assessment and friction | doctrine/route/spec/TRACKER/MISTAKES plus facts already stated | attempted/Assisted handoff + stated friction | agent commits system-owned simulation tracking; never Victor's solution | hands to `simulation-grade`; never grades, infers assessment, or changes timed verdict |
| `map-sync` | machinery changed, or one prompt/skill/internal contract was read whole | changed/read file plus every licensed occurrence in `README.md` and this map | corrected derived-map rows, or an explicit verified/unaffected verdict | agent commits a read-path map fix separately or a change-path fix with the machinery | never sweeps, blocks, edits machinery to match a map, or rules outside the read licence |

Every row inherits `_session-rules.md` → "When a skill cannot finish — durable friction". The table's
write cells describe success and expected no-op / ineligibility paths; on an observable failed declared
step, every skill additionally appends one `FRIC-NNNN` row without changing or partially closing its
normal target.

**Mechanical and closing rituals ask zero questions.** That is a design rule, not a style: a manual
gate in the middle of a mechanical ritual is how it stops being run. `interview-prep-block-open` is the
intentional exception because asking and grading one interview question is its product, not a gate.
A step that cannot close is *reported* and left
open, never blocked on an answer.

---

## 10 — The debts, flags and gotchas

The things a run leaves behind that are easy to miss.

- **Every runnable prompt writes two extra files**: `_last-run-report*.md` in its own `_internal/`
  folder, and its row in `_internal/_run-tracker.md`. They are auto-committed together, and they are what
  feeds the improvement loop (**§12**) — the evidence that decides whether a frozen prompt gets reopened.
- **Open skill friction is evidence, not yet a recommendation.** A qualifying failed ritual step appends
  `FRIC-NNNN`; the next prompt close-out serially adjudicates it and changes only its disposition. A
  promotion or dismissal commits before, and separately from, that prompt's report + tracker.
- **The `/notes-plan` debt.** A bullet added in a daily session by `coverage-bullet-add` does **not**
  remap the notes plan — the plan and its `Coverage SHA-256` are never touched by hand. The skill
  reports `/notes-plan {topic} {level}` as owed and appends `⚠ stale YYYY-MM-DD (+N bullets)` to the
  plan's cell in `_run-tracker.md`, so the debt outlives the session. Only a real `/notes-plan` run
  clears it. Batch these at the end of the session.
- **Two markers on a coverage bullet, never interchangeable.** `✅ NN-slug — {evidence}` = Victor
  **built** it (written by `coverage-mark`). `✅ sql:{file-slug}` = he **drilled** it (written by
  `sql-step-close`). A bullet may carry both; the drill marker goes **first**, because the project
  marker's free-text evidence clause swallows anything to its right.
- **`Status: refined` is a lock only Victor sets.** Setting it by hand in a notes plan freezes that
  entry's prose in both languages *and* its assigned coverage bullets — no prompt may reword, move or
  delete them. No prompt sets, clears or downgrades that status either. New bullets land under
  `Pending additions:` and `/notes-audit` appends in a diff-proved append-only mode.
- **The two coverage files are one artefact.** `notes/{topic}/coverage/{LEVEL}.md` and the SQL/topic
  section of `notes/coverage/{LEVEL}.md` carry the same bullets verbatim. Any writer that touches one
  and not the other has introduced drift — **and this is one of the few invariants a machine catches**,
  by `validate-prompt-system.ps1` (README.md states it; §12 explains why it is not restated here).
  Which readers may use the mirror instead of the topic files, and on what proof, is
  `_coverage-standard.md`'s rule and not this map's — `roadmap-review` 2a, `project-brief`,
  `plan-audit`, `review-audit` and `backlog-task-open` all read it today.
- **A gate closes on an empty drift report, not on the run having happened.** True for G6
  (`progress-update` in a project) and G3 (after the SQL level's last step). Both boxes are ticked by
  hand, long after the run, so the report is on disk — `strategy/tracking/_internal/_last-drift-report.md`,
  §7 — and its scope line is what says which project a clean verdict is evidence for.
- **`PROJECT-BACKLOG.md` auto-commits in any flow**, not just inside `/review-audit` — the file is
  written by the review prompt and the two backlog skills, never by Victor.
- **A skill edited in one adapter is edited in both, in the same commit.** They drifted silently once
  (2026-07-30 → 2026-08-01) and Codex ran a ritual two revisions old. `diff` the pair before committing.
- **Machinery paths are contracts, not an invitation to traverse live state.** `/system-check` verifies
  that prompts and skills declare the right path patterns, schemas, owners and gates, but excludes the
  governed project, learning, SQL, practice and application artifacts from its inventory, denominator,
  report and blocking conditions. Their existing task/step/block rituals own operational truth.
- **A timed verdict is immutable evidence.** Corrections close learning gaps but never turn a historical
  Borderline/Fail/Assisted attempt into a Pass or change its recorded time. A Fail additionally opens a
  later reinforcement step; otherwise correction would erase the very interview-condition signal the
  track exists to measure.

---

## 11 — When something is out of date, run this

| Symptom | Run |
|---|---|
| coverage gained bullets → a notes plan is `⚠ stale` | `/notes-plan {topic} {level}` |
| a level's topics are all defined but never converged | `/coverage-audit {level}`, then `/roadmap-review` |
| `/coverage-verify` returned `gaps` | `/coverage {topic} {level}` in update mode |
| `PROGRESS.md` looks wrong before a gate | `/progress-update`, then repair with the ritual its drift report names |
| `ROADMAP.md` has dates, or a stale gap table | `/roadmap-review` |
| the SQL route ran out of steps | `/sql-plan-audit` (extends), or `/sql-plan {next level}` |
| simulations have no level route, the route is stale, or the current spec has free-form scope | `/simulation-plan {level}`; then `/simulation-generator` only for its current missing spec |
| a timed simulation is Borderline/Fail or has open correction rows | fix only those rows, then say `corrige las correcciones`; `simulation-grade` runs the cold correction review |
| the ROADMAP 12:30 block has reached `Stage 2 — Technical test simulation` | `/code-review-practice`; `README.md` → "The code-review-practice track" owns its no-prerequisite start, durable retry loop and progression |
| a project is built but never reviewed | `/review-audit` (G3/G4) → fix every High → `/readme-audit` (G5) → empty `/progress-update` (G6) → `/portfolio-audit` (G7) |
| a step was finished and nothing was recorded | the `step-complete` ritual, walked by hand against §9 |
| a row here contradicts the prompt or skill it describes | the `map-sync` ritual — **the machinery wins**; fix the row, never the file |
| `_skill-friction.md` has an `open` row | run any runnable prompt; its close-out adjudicates the row before its own recommendations |
| a ritual completed as declared and was **not worth its cost** — it ate the block, nobody reads its output, the work got done by hand anyway | append one `RITF-NNNN` row to `_ritual-friction.md` and carry on. It opens **no** `REC` and dispatches **no** cold reviewer |
| `_ritual-friction.md` has three `open` rows naming one ritual | that ritual is due a ruling under `_recommendation-ledger.md` → `REC-054` (c) — kept, thinned or deleted. The only ruling licensed to *remove* machinery |
| a prompt or skill was added, renamed or retired · a path may have gone dead · a map may never have learned the machinery exists | `_internal/validate-prompt-system.ps1` (§12) — the only check that can see a **non**-firing `map-sync` |
| a `_last-run-report*.md` says `applied in <hash>` and carries no `cold reviewer:` verdict, or its `Status:` field is missing or states neither state | `_internal/validate-prompt-system.ps1` — the applied edit is read as a **self-approval** and stays that way; the only other way out is correcting the `Status` to `open` **when the hash it names is not a prompt edit**, which is a claim `git show` settles, never a way to make the red go away |
| after substantial machinery changes, you need every prompt/skill contract and both derived maps checked together | `/system-check` — explicit machinery audit; never an ordinary-commit gate and never an operational-status sweep |
| the suspicion is not that a row is **wrong** but that something is **missing** — a file nothing writes, a block with no closer, a debt nothing clears, a gate nobody runs | `/system-gaps` — reads only these two maps, so it is cheap enough to re-run as the system grows; it registers findings and corrects nothing, and an absence it reports still has two branches until `/system-check` or `map-sync` opens the file |

---

## 12 — How the system improves itself

Every section above describes machinery that **runs**. This one describes the loop that **changes** it,
which is the half no prompt can state about itself: **prompts are frozen by design.** Both self-report
contracts open on that rule — a report showing a real failure is the only thing that reopens a prompt —
and `_session-rules.md` says the same to the session: *"The system is built — run the prompts, don't keep
editing them."* So an edit is never a decision someone makes; it is the last
step of a chain that starts with a run, and every link exists because the previous one was skipped once.

1. **A run ends by executing its self-report contract** — five bullets for the nineteen orchestrators
   (`_pipeline-self-report.md`), three for the twelve single-shot prompts
   (`_single-shot-self-report.md`). It reports the **machinery, never the content**, and carries a
   `Status:` line — `open` or `applied in <hash>` — which is what makes a live finding distinguishable
   from a settled one at a glance instead of by re-reading prose.
2. **The close-out check runs first, and against disk.** Declared outputs from this prompt's `README.md`
   row, probed with `git status` **and** `git log --name-only`; for an orchestrator, also the count of
   mandated dispatches against the count actually dispatched — the half no file can prove. Nothing here
   is answered from memory, because *the same saturated context that skips a step cannot see the skip*.
3. **Findings are reconciled into `_recommendation-ledger.md`** before the bullets are written. A new or
   unresolved one becomes a row in `## Open`, state `open` or `accepted`. The ledger's other two states
   are resolutions rather than row states: reaching `applied` or `rejected` collapses the row into
   `## Closed`.
4. **The four-condition bar** decides whether it earns an edit at all: real evidence not theory · the
   prompt was wrong or ambiguous rather than merely broken by the run · **it would have changed the
   result, not just the cost** · not already covered somewhere the run failed to look. **Condition 3
   kills most findings.** Friction is recorded in the Verdict and stops there, and a rejected finding
   names its failed condition so the same zombie is not re-proposed next run.
5. **A cold reviewer — mandatory, no exceptions.** The drafted edit goes to one cold subagent with five
   inputs, one being **the whole prompt file read to EOF**, which is what makes condition 4 and
   the contradiction check answerable at all. It returns `approve` / `approve-with-tightening` / `reject`, and only what it
   approves is applied. A reject — or a reviewer that could not be dispatched (a death is not that until
   its scratch file, a resume and one re-dispatch have all failed — `_agent-runtime-standard.md`) —
   leaves the finding
   `open`: a postponed finding is recoverable through its `Status` line, a self-approved bad edit is not.
   **The verdict line is the only trace the gate ran**; an applied edit without one is indistinguishable
   on disk from a self-approval and must be read as one. `validate-prompt-system.ps1` checks that pairing,
   under the invariant `README.md` states.
6. **The edit lands under both map rules** — the change test and the read test in "How it stays true" —
   the hash goes into the report's `Status:`, and the ledger row collapses into `## Closed` after any
   rule it established is **promoted into the ledger's preamble**. A rule that governs future work must
   not stay buried in a row about something else; that is how one precedent came to be cited seven times
   and misread every time.
7. **The run-start check closes the loop.** The at-end refinement only ever sees *this* run's report, so
   step 0 of every prompt reads its own last report and prints one line when the `Status` is still
   `open`. Without it a finding rots — the `notes-write` gate sat open four days for exactly that reason.
   It **surfaces and never applies**: editing a prompt and then immediately running it entangles an
   unverified edit with the run.

**Skills contribute observable failure evidence through a smaller loop.** The source contract is
`_session-rules.md` → "When a skill cannot finish — durable friction": a qualifying failed declared step
appends one immutable `FRIC-NNNN` event with `Disposition: open`. The next prompt close-out serially
applies its existing four-condition bar, links real machinery defects to one recommendation, dismisses
non-defects by condition, and leaves insufficient evidence open. The reconciliation commits separately
from report + tracker, so the prompt evidence check keeps its exact boundary.

This is deliberately **not** prompt-style self-reporting per ritual, and it does not claim parity with
it. A successful or expected path writes no paperwork. More importantly, the sink can only capture an
observable failed step: a defective skill that completes silently with a wrong result still leaves no
friction row and remains dependent on human review, `map-sync`, the validator, or `/system-check`.

### The one automated check

`_internal/validate-prompt-system.ps1` is the **only** automated check in the system — there is no CI and
no hook, so it runs when someone runs it. **`README.md` owns its trigger list and the full statement of
its invariants**, and restating them here is how this section would fork from them; what belongs on the
map is the one invariant that is *about* the map. **Both maps know the machinery exists** — every skill
directory has a §9 row and the reverse, §9's spelled-out count matches disk, and every runnable prompt is
named somewhere in this map and has a `README.md` entry.

That one is the only layer that catches a **non-firing**: the two map rules and `map-sync` all depend on
someone noticing, so nothing else can see machinery added while a map never learned of it. It found
`profile-readme` missing from every section of this map on its first run.

**What it cannot do is tell whether a cell is _true_** — only reading the file a row describes does that,
which is why the read trigger exists at all. Nor does it repair; the fingerprint contract's
`REPORT:`-versus-fail branch is stated once, in `README.md`, with the rest of the validator's invariants.

The optional `-MachineryOnly` switch exists so `/system-check` can run the validator without a live
learning artifact entering its blocking conditions; ordinary manual validation keeps the full mode. Which
invariants it skips is stated once, in `README.md`, with the rest of the validator's contract — the map
records only that the two-map invariant above is **not** among them.

### The explicit semantic sweep

`/system-check` complements the validator and `map-sync`; it replaces neither. When Victor launches it
after substantial machinery changes, cold family manifests read the complete canonical prompt/skill
machinery to EOF, the orchestrator reconciles the README-owned prompt contracts and this map's wiring
and skill contracts, and a cold final reviewer gates the global verdict. The durable report proves both
the inventory boundary and the reconciliation. It may correct the two derived maps and file machinery
recommendations, but never opens or reports live project, learning, SQL, practice or application state.
Because it is token-intensive, it is **explicit only** — never scheduled, inferred, or run per commit.

### The cheap sweep for what is missing

Everything above checks whether the machinery is **described truthfully**. `/system-gaps` checks whether
it is **complete**, and it is the one entry point to the loop that begins from neither a run nor a read
of a machinery file: it takes this map and the README as its whole evidence, builds a typed edge ledger
from them — writer, reader, trigger, chain step, gate, debt, handoff — and runs ten named detectors over
the joins. What it finds is a file nothing writes, an output nobody reads, a section whose only writers
are cold prompts while the state is produced in a daily block, a block-level event nothing records, a
handoff to something with no row, a gate with no owner, a debt nothing clears, a symptom with no route, a
contested write with no order, and machinery nothing ever tells you to run.

Two rules make it honest rather than merely cheap, and both follow from its own boundary. **It discharges
a candidate only against a quoted sentence** from either map declaring that absence deliberate — §8's
LeetCode row, §13's `**none**` closer, §7's `by hand` writers — because a detector that re-raises design
is a detector nobody keeps running. And **a finding built on absence names both branches**: these maps
are derived, so *nothing writes X* and *§7 omits X's writer* are indistinguishable from here, and the row
names the single file whose read would settle it rather than guessing. That read belongs to
`/system-check` or `map-sync`. It is the same licence `_session-rules.md` grants any whole read — an
absence is a finding only over a file read to EOF, and the file read here is the **map**, so the finding
is about the map's account of the system.

Its ledger rows are capped at five a run against the ranking in its own report, which is the second
place in this system where a queue is deliberately bounded rather than drained faster, and for the reason
the ledger preamble already records.

---

## 13 — The day, block by block

Every other section cuts the system by **track** — knowledge, projects, SQL, apply. This one cuts it by
**hour**, because that is the only axis on which the load is actually paid: all four chains can meet
inside a single day, and no other section shows what any one of them costs *there*.

**A block is not a clock** — `_session-rules.md` → "Daily study blocks" owns that rule and states it in
full. What belongs here is the machinery half of it, which no single file can say: **every opener and
closer below triggers on an *utterance* ("vamos con el SQL", "cierro el bloque") or on the work itself
reaching a state, and no skill reads the clock to decide anything** — several stamp a *date* (`⏸ Deferred
YYYY-MM-DD`, a `Studied` date, a `RITF` row), which is a record, never a condition. The `08:00` / `12:30` / `13:30` labels are
therefore names for *which* block, never a schedule any component obeys — which is also why a skill can
be assigned to a block at all without anything having to know what hour it is.

**The blocks themselves — their approximate hours, their order and what each is for — are owned by
`_session-rules.md` → "Daily study blocks", and are deliberately not restated here.** The `Block` column
below carries only the four bare values `_ritual-friction.md` already uses (`08:00`, `12:30`, `13:30`,
`machinery`), so a friction row and this table can never be in two vocabularies. What this section adds is
the one column neither file has: *which rituals fire inside the block*. **What each of them writes is §9's
column and is not duplicated here** — this table answers "when", §9 answers "what". Nothing here is a
verdict on whether a block's load is worth paying: that is `_recommendation-ledger.md` → `REC-054` (c),
and it accrues from use. Prompts are absent by construction — a prompt runs in a cold conversation
outside the session (§1), so it costs the block only the minutes Victor spends launching it and reading
its result.

| Block | Skills that can fire | Opener | Closer | Cold dispatch inside the block | Declared steps · contract size |
|---|---|---|---|---|---|
| `08:00` | `step-complete` · `backlog-task-open` · `backlog-task-close` · `coverage-bullet-add` · `coverage-mark` · `readme-concept-add` | **none** | **none** — closing is per *step* and per *task*, never per block | none | 36 steps · ~1,494 lines |
| `12:30` | `sql-block-open` · `sql-grade` · `sql-step-close` · `sql-block-close` — and for the practice half `simulation-block-open` · `simulation-grade` · `simulation-block-close` | `sql-block-open` / `simulation-block-open`, both **read-only** | `sql-block-close` / `simulation-block-close`, plus the step-level `sql-step-close` | **yes, both tracks** — `sql-grade` and `simulation-grade` grade in one cold subagent so teaching context cannot contaminate the score | 29 steps · ~810 lines |
| `13:30` | `study-content-writer` · `interview-prep-block-open` · `study-block-close` | `interview-prep-block-open`, for the **interview half only**; the notes half has none | `study-block-close`, for both halves | none | 14 steps · ~274 lines |
| `machinery` | `map-sync` | — | — | none | 5 steps · ~143 lines |

Counts are `SKILL.md` numbered steps **including lettered sub-steps** — `1a`, `3b` carry their own
declared work, and they are not written at a uniform heading level, so a count that excludes them is both
lower and unreproducible — plus file length, measured 2026-08-11 in `.claude/skills/`; the `.agents/`
mirror carries the same content by contract (§10), so either adapter gives the same numbers. They are a proxy for contract weight, not for
minutes — only a `RITF-NNNN` row measures those, and only from a day that was actually lived.

**The four asymmetries the table exists to show.** All four are observations, and each is a candidate a
`RITF-NNNN` row would later be ruled against:

- **The heaviest block has the least structure.** 08:00 carries 1,494 lines of ritual contract — more
  than the other three combined — with no opener and no closer. Its recording is event-driven instead:
  finishing a step fires `step-complete`, closing a backlog task fires `backlog-task-close`, and each of
  those calls the three focused writer skills, unconditionally rather than as a ceiling. **Closing one
  backlog task therefore walks four skills and 9 + 7 + 6 + 4 declared steps** — the longest single path
  in the system.
- **Every block's trace is conditional, and only one block has no ritual that could leave one.** 12:30
  and 13:30 each *have* a block-level closer, but what it writes still depends on the block producing
  something: `sql-block-close` commits only if a `## Fricción` row was actually added and otherwise
  **returns** tomorrow's starting point rather than writing it, and `study-block-close` marks nothing
  without a final PASS or a completed plan entry. 08:00 differs in kind, not degree — a morning that
  finishes no step and closes no task has no ritual to fire at all. A morning that *does* close a task
  leaves the widest trace of any block in the day.
- **Grading is cold only in the 12:30 block.** SQL and simulations both push the score into a subagent
  that never saw the teaching; the 08:00 block's `done condition` and the 13:30 block's PASS/FAIL are
  judged in-session, with full context. That is deliberate in both directions — one measures performance
  under interview conditions, the other measures whether the work is finished — but it means only one
  block pays a dispatch inside the hour.
- **One skill in seventeen is allowed to ask a question.** `interview-prep-block-open`, because asking
  and grading one question *is* its product — the intentional exception to §9's rule that **mechanical
  and closing** rituals ask zero questions. That rule is narrower than "no skill ever waits": authoring
  skills legitimately do, and `study-content-writer` waits for Victor's explicit acceptance before
  `[refined]` is set. What no ritual does is stall a block on an answer it needs to finish: a step that
  cannot close is reported and the target left open.

**Where a skill belongs to no single block.** `study-content-writer` fires wherever note or Q&A prose is
written in a daily session — its home is 13:30, but a note written during the project block is the same
trigger, and it is counted above only once. `map-sync` fires on any read or change of the machinery in
any session at all, which is why it takes the fourth `Block` value rather than one of the three hours.
