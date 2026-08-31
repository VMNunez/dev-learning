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

**Read both maps before resolving machinery work.** `_session-rules.md` owns the orientation gate: any
task that analyses or changes a prompt, skill, standard, launcher, validator, platform adapter or either
map first reads this file and `notes/prompts/README.md` whole. The pair supplies system context; the
affected source machinery is read next and remains authoritative. This is not an automatic
`/system-check` or permission to widen the task.

**The two derived maps have one owner per fact.** `README.md` owns every prompt's public interface and
exact per-prompt contract: command, run-first prerequisite, configuration/received inputs, reads,
writes/returns, dispatched roles/isolation, commit owner, local handoffs/gates, and exclusions. This map
owns relationships that exist only across components: chain order, file-level writer/consumer edges,
section ownership, debts/symptoms/improvement flow, and the per-skill contract in §9, whole rather than
split with the README. The chain
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
about *that* file. **Which rows, per kind of file read, is that rule's own table, and it is deliberately
not restated here**: this map is one of the two objects the licence rules on, and every copy of that
table written into a consumer has drifted from the original — `REC-062` found three restatements and no
two alike, and `REC-159` widened the licence and left this paragraph a scope behind. A
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
| Questions | config up front, then hands-off to the end except `portfolio-audit`'s declared ✅/⚠️ non-dry one-bullet ownership gate | **zero, by design** — a ritual that asks stops being run |
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
persists each accepted concern under Git-ignored `.system-check/` evidence so another session or agent
product resumes the same frozen run, and never becomes a prerequisite of ordinary runs or commits. Its machinery-only boundary — declared
path patterns in, the live artifacts governed by them out — is stated by
[its README catalogue row](../README.md#system--audit-the-machinery-system) and owned by the prompt's own
`Boundaries` section. `_session-rules.md`'s machinery-only exception means the run does not open active
project state even for session orientation; §10 records only the gotcha it creates.

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
    /notes-audit · /interview-prep-audit · study-content-writer → authoring-progress-recount → PROGRESS.md

    all topics at one level → /coverage-audit → /roadmap-review

_cross-topic-inbox.md is the durable edge between topic owners: every coverage run files foreign-topic proposals there — the two producers and the read-only /coverage-verify gate alike — and the owning /coverage run consumes its heading. An inline coverage-bullet-add creates a durable /notes-plan remap debt rather than editing a fingerprinted plan by hand.

---

## 4 — Chain B: projects (decide → plan → build → review → gate)

Exact command contracts live in the [README public interface index](../README.md#public-interface-index) and its [family catalogue](../README.md#the-prompts--what-each-one-reads-and-generates). This section owns only chain order and project gates.

    /progress-update → /project-brief → /plan-audit MODE=new → build
    → step-complete (G1)
    → /review-audit G3/G4 → fix every High
    → /readme-audit G5 → empty /progress-update G6
    → /portfolio-audit G7 → /roadmap-review G8

backlog-task-open → teach/fix → backlog-task-close is the per-finding loop between G3/G4 and G5. G2 sits off this line: it fires only when the plan or branch strategy moves mid-build, and runs `/plan-audit MODE=review`. PLANNING.md §23 is authoritative for these gates; SQL's separately named G1–G4 belong to practice/sql/PLANNING.md §9 and do not redefine this chain. G6 closes only on an empty drift report, and G3/G4 only on a per-tier `Last Reviewed` stamp carrying that run's date without an `(incomplete — …)` qualifier — neither closes on the run having happened.

---

## 5 — Chain C: SQL (the 12:30 block)

Exact command contracts live in the [README public interface index](../README.md#public-interface-index) and its [family catalogue](../README.md#the-prompts--what-each-one-reads-and-generates). This section owns only SQL and simulation wiring.

    notes/sql coverage → /sql-plan → /sql-plan-audit → level route
    → sql-block-open → /sql-exercises → Victor answers → sql-grade (cold)
    → sql-block-close / sql-step-close → drill markers + route §3 readiness → /simulation-plan

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
    application work or a scheduled HR call → /hr-screen
    open hr-screen rows → /hr-screen retry → practice/interview/MISTAKES.md
    accepted polished answers → notes/interview-prep/hr-screen.md → Victor reviews before a real call
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
| `notes/{topic}/coverage/notes-plan-{LEVEL}.md` | `/notes-plan` (whole route) · `/coverage` (`Plan status: stale` only) · `/notes-audit` (concept/status; on an authoring or audit run `Studied: pending` + `Pending study: none`, on an append the date preserved and one `Pending study` line per appended **English** heading — the sole writer that creates a gap) · `study-content-writer` (`Studied: pending` on a `complete` pair only; the refined-TODO route writes neither field; the freeze-sync route, on Victor's declaration that he refined the pair, writes `Status: refined` and clears `Studied` to `pending` — the one place a writer assigns that status) · `study-block-close` (the `Studied` date, and the gap lines it discharges) · `/notes-plan` also drops a gap, but only when its heading is gone or a reset emptied the field | `/notes-plan` itself (reconciliation, and — across all three levels — the ownership source its legacy classification is taken from), `/notes-audit` (fingerprint gate), `/coverage`, `/interview-prep-audit`, `authoring-progress-recount` (the authored count), `/progress-update` |
| `notes/{topic}/{level}/en|es/*.md` | `/notes-audit` · a standalone run of one of its four component prompts, documented in each component's own intro (A, B and T write into the tree only; Stage C owns the commit) · in session, guided by `study-content-writer` — an existing `complete` pair freely, **a `refined` one on the TODO route alone** (a marker Victor wrote or a correction he states, resolved in place, locality-bounded; anything the agent proposes itself still waits for the hand-back to `pending`), **and the counterpart alone of a pair he declares refined** (freeze-sync: the language he names is byte-untouched, the other is brought into line) · `/notes-plan`, for a same-level renumber or a cross-level relocation only: it renames the pair and corrects every repository-relative link the rename invalidates, in a `refined` pair too, and never a word of prose | Victor · `/notes-plan`, which reads the prose of the notes no plan entry owns — the `## Unassigned existing notes` lists plus any file no plan names — end-to-end before classifying them |
| `notes/interview-prep/{LEVEL}/en|es/*.md` | `/interview-prep-audit` (whole bank) · `/simulation-review` and `/code-review-practice` (born-unrefined insertions only, under the whole of the standard's "Adding questions from outside the audit" — which is where that contract is stated, not here; each prompt gates once per run on a fresh fingerprint and falls back to proposing the questions instead — in its report for `/simulation-review`, in chat for `/code-review-practice`) · `study-content-writer` (unrefined/reopen/refine) · `study-block-close` (`[studied]` only) | `/interview-prep-route`, `interview-prep-block-open`, `/simulator`, `authoring-progress-recount` (the refined count), `/progress-update` · `/portfolio-audit`'s translator reads **one `es/` file only** (`junior/es/architecture.md`) as a Spanish-register reference, and writes nothing here |
| `notes/interview-prep/routes/{LEVEL}.md` | `/interview-prep-route` only | `interview-prep-block-open`, `study-block-close`, `authoring-progress-recount`, `/progress-update` |
| `notes/interview-prep/projects/en/*.md` | `/portfolio-audit` — its per-section author and cold reviewer, both fenced out of `es/` | `/simulator` at `LANGUAGE = en` only · `/portfolio-audit`'s own translator, as its source |
| `notes/interview-prep/projects/es/*.md` | `/portfolio-audit` — its **translator alone** (stage T, Phase 1b, once per project, from the finished `en/`), which changes no English and stops rather than overwrite a `TODO:` Victor wrote | `/simulator` at `LANGUAGE = es` only. Never authored by hand, and `REC-180` still owes this pair stable IDs, priority markers, the `[refined]` freeze, a TODO channel and an `es`-review owner (no role checks the twin's Spanish fenced from the English) — so nothing may write `[refined]` or `[studied]` here yet, and no route, recall block or recount reads it |
| `notes/interview-prep/SESSION-LOG.md` | `/simulator` only, which creates it with its header when missing and **appends** one summary row plus one session block per run — never rewrites an earlier block, because a First Rating records the first attempt and the retry is deliberately not stored | `/simulator` itself, at its Step 1, for the previous-Débil list and the recurring weak area. Its commit is **handed to Victor**, unlike the `practice/interview/MISTAKES.md` write in the same run, which is system-owned and commits directly |
| `notes/interview-prep/hr-screen.md` | `/hr-screen`, optionally and only when Victor accepts polished stage-2 answers | **Victor**, as a study aid before a real HR call. Later `/hr-screen` runs deliberately do not read it; their retry input is the surface's open rows in `practice/interview/MISTAKES.md` |
| `PROGRESS.md` | **section by section — see §8** | `/plan-audit`, `/roadmap-review`, `/project-brief`, `/review-audit`, `/cv`, `/linkedin`, `/cover-letter`, `/profile-readme`, `/sql-exercises`. Every reader of `_application-standard.md` takes it as **status only** where it consults it — its source 3 — and the four that judge a claim source what Victor can *prove* from the coverage markers instead (its source 7); `/tracker` takes only the market context and the keyword pool, and `/profile-readme` reads this file directly, through the session rules, and never that standard |
| `ROADMAP.md` | `/roadmap-review` (+ `/plan-audit` marks the chosen project) | `/project-brief` · `plan-audit`'s author · the apply family (`/cv`, `/linkedin`, `/cover-letter`, `/hr-screen`) · `/interview-prep-audit` and `/interview-prep-route` · `/simulation-plan` · `/sql-plan` and `/sql-plan-audit` · the SQL gates. **Every one of those reads it for a plan or the strategy built on it — phases, gates, timeline, block tables, the ranked hiring-probability list — never for a target fact**: the profile, the companies, the market and the hiring stages are `_shared-context.md`'s, which is why `/evidence-intake` and `/portfolio-audit`'s author no longer appear here |
| `projects/README.md` | **Victor, or a session acting on his explicit instruction, by hand** whenever a top-level numbered project is added or removed, or its published name, stack or status changes · never a prompt run | `/project-brief` (refuses a missing file or a mismatch between the table's `#` column and the folders' two-digit prefixes) |
| `projects/briefs/project-brief-{NN}.md` | `/project-brief` | `/plan-audit MODE = new` (refuses a stale one) · its `steps-tests` specialist in **either** mode, whenever the plan is new enough to have one — the only one of the seven reviewers that reads it, and the authority for §2/§3/§4 |
| `{project}/PLANNING.md` | `/plan-audit` · `backlog-task-open` (**§0's open-task number only**, in place, when it raises an incidental finding — `REC-179`; never a route cell) · `step-complete` (✅ + §0 `Current step`, `Current branch`, the `Done condition` that names them) · `backlog-task-close` (rules section + §0; `Current step` and its `Done condition` only when no §15 step closed earlier that session, `Current branch` only when its own fix ends that branch's work per §22) · `Next gate` derived — the first §23-chain gate not yet signed off (`_planning-standard.md` invariant 10; its quality-gate rules define *signed off*, and an unmerged fix branch signs nothing off), the close writes the blocked/signable qualifier on it · `Phase`/`Last updated` from both — **two daily route-cell writers, cells partitioned, order free, the second reads what the first left** (`REC-091`) — `backlog-task-open`'s number is not one of them | `/readme-audit`, `/review-audit`, `/portfolio-audit`, `/progress-update`, `/roadmap-review`, every session |
| `{project}/README.md` (+ backend/frontend) | `/readme-audit` (whole file) · `readme-concept-add` (one entry, **plus the `*(coming soon)*` markers whose §15 step is `✅`**) | `/portfolio-audit`, recruiters |
| `{project}/PROJECT-BACKLOG.md` | `/review-audit` (tasks) · `backlog-task-open` (`⏸ Deferred`, and a task raised for a defect noticed while triaging) · `backlog-task-close` (`## Closed`, and a task raised for a defect noticed while closing — `REC-179`; both write the finding rather than mentioning it, and neither triages or fixes it) · `/plan-audit`'s `whole-plan` specialist (its twelfth check, reconciling a task against a plan decision that superseded it — in **both** modes; the orchestrator stages the file only when that trace row reports a fix) | `/review-audit` itself — its Step 0 gate reads the per-tier `Last Reviewed` lines and Step 5 reads `## Closed` and `## Beyond the current gate` before writing a task · `/portfolio-audit` (open High/Medium block the verdict, **and those same `Last Reviewed` lines stop it before any task is counted** — `never` or `(incomplete — …)` means the list is short by what nobody reviewed) · `step-complete` and `backlog-task-close`, which read the same tier lines to derive and qualify §0's `Next gate` · whoever ticks §23's G3/G4 boxes, which quote the same lines, every session start |
| `notes/cv/cv-bullets.md` | `/portfolio-audit` — drafts two, but a ✅/⚠️ non-dry run pauses for Victor's choice and commits exactly one per project | `/cv`, `/linkedin`, `/cover-letter`, `/profile-readme` |
| `dev/portfolio/VMNunez/README.md` (**separate repo**, never committed from here) | `/profile-readme` (`sync` / `optimize`) · `/portfolio-audit` on a ✅ Ready verdict — two writers, two triggers | recruiters; the profile repo's own adapter carries the gap list |
| `practice/sql/PLANNING.md` (doctrine) | `/sql-plan-audit` · the grader's §0 rewrite · `sql-step-close` (§0 verify) · `/sql-plan` did the one-time split that created it | every SQL prompt and skill · `/simulation-plan` and `/simulation-generator` (§8c closed-step rule; the mapping is the SQL route §3) |
| `notes/prompts/knowledge/coverage/_internal/_cross-topic-inbox.md` | `/coverage` (ROUTE) · `/coverage-verify` (a gap rejected on ownership alone; separate commit) · `/coverage-audit` · `coverage-bullet-add` (a concept another topic owns) · by hand on a boundary change, per `_topic-ownership.md` | `/coverage` (its own heading) · `/coverage-audit` (all headings) — never `/coverage-verify`, which writes here and never consumes |
| `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` (route) | `/sql-plan` (creates) · `/sql-plan-audit` (extends) · `sql-grade`'s subagent (counts/status) | `/sql-exercises`, `sql-block-open` |
| `practice/sql/MISTAKES.md` | `sql-grade`'s subagent (`## Open`, and the `## Closed` rows a run redeems) — and the same grading branch reached directly through `/sql-exercises MODE = review`, the legacy door that still grades but closes no step · `sql-block-close` (`## Fricción`) | the revision points the level's route §1 declares |
| `practice/sql/{LEVEL}/NN-*.sql` | **Victor** owns the answers · `/sql-exercises` `practice`/`reinforce` branch writes the setup block and the exercise blocks · the grader only appends `✅ Corregido <fecha>` to a header line | `sql-grade` · `sql-block-open` and `sql-block-close` (the scored/graded greps) · `/sql-plan` and `/sql-plan-audit` (written/answered/scored counts) |
| `practice/simulations/PLANNING.md` (doctrine) | `/simulation-plan` (creates once) · `/simulation-generator`, `/simulation-review`, `simulation-block-close` (§0/state only) | every simulation prompt and skill |
| `practice/simulations/{LEVEL}/PLANNING-{LEVEL}.md` (route) | `/simulation-plan` (creates/reconciles + reinforcement steps) · `/simulation-generator` (generation/state) · `/simulation-review` (verdict/correction/redemption/history) · `simulation-block-close` (attempt handoff) | every simulation prompt and skill · `/progress-update` |
| `practice/simulations/{type}/NN-*.md` (spec) | `/simulation-generator` (whole spec) · `simulation-block-close` and `/simulation-review` (attempt header only) | Victor · `simulation-block-open` · `simulation-grade` / `/simulation-review` |
| `practice/simulations/TRACKER.md` | `/simulation-generator` (rows) · `simulation-block-close` (self-assessment/attempt) · `/simulation-review` (status/history) | `/simulation-plan`, `/progress-update`, every simulation skill |
| `practice/simulations/MISTAKES.md` | `/simulation-review` (graded gaps/corrections) · `simulation-block-close` (friction) | `/simulation-plan`, `simulation-block-open`, `simulation-grade`, revision points |
| `practice/interview/MISTAKES.md` | `/simulator` · `/hr-screen` · `/code-review-practice` (their own performance gaps) | the same three prompts, each consuming only its own surface rows |
| `notes/prompts/_internal/_job-market-evidence.md` | `/evidence-intake` · `/cv tailor` | `/coverage`, `/coverage-audit`, `/interview-prep-audit`, `/interview-prep-route` |
| `notes/prompts/_internal/_run-tracker.md` | every prompt's close-out · **`coverage-bullet-add`** (the one skill that writes here) | you and prompts that gate on it; `/system-check` reaches it only through the universal pipeline close-out, never as semantic-audit inventory |
| `notes/prompts/_internal/_skill-friction.md` | any of the nineteen skills, only when the shared session contract's observable failed-step trigger fires · either self-report close-out changes only `Disposition` during serialized reconciliation | both self-report close-outs (including `/system-check`'s universal close-out), never the machinery audit's inventory or verdict |
| `notes/prompts/_internal/_ritual-friction.md` | **any session, the moment Victor says a ritual cost more than it gave** — `_session-rules.md` → "When a ritual works and is not worth it". Not a skill's own contract and not a prompt close-out: the ritual succeeded, so nothing in it fired. Only `Status` changes after insertion, written by the ruling | `_recommendation-ledger.md` → `REC-054` (c) **only**. Explicitly not a work queue: no close-out adjudicates it, no cold reviewer is dispatched over it, and it never becomes a `REC` |
| `notes/prompts/_internal/_skill-runs.md` | **the `PostToolUse` hook only** (`.claude/hooks/log-skill-run.ps1`), one appended row per `Skill` tool call, written straight from raw tool-call input and never by an agent or by hand. The only registry entry with no session writer at all, and the only one **Git ignores**: it is a rolling denominator, not durable evidence, so it is local state that no commit carries | `skill-refine` **only**, as the denominator that tells "this skill ran 20 times and logged nothing" apart from "this skill ran clean" — durable evidence is `_skill-breach-log.md` beside it. Registered 2026-08-29 (`REC-174`): the row was missing while two exemption lists had already elected this section as the definer of what a run writes |
| `notes/prompts/_internal/_skill-breach-log.md` | **any of the nineteen skills, on a run that finished its work and still did not go as its own text says** — `_session-rules.md` → "When a skill's own text is what went wrong". Not a failure (that is `_skill-friction.md`) and not a cost (that is `_ritual-friction.md`); the third case, which had no sink before 2026-08-26. Only `Disposition` changes after insertion, written by the refinement that consumed the row | `skill-refine` **only**, and never as a work queue. When it fires is `_pipeline-self-report.md` → "The bar" condition 2: a silent or ambiguous text clears it on the first row, a clearly stated rule breached anyway needs two rows carrying the identical `Breached step` |
| `notes/prompts/knowledge/notes/_internal/_note-todo-harvest.md` | **`study-content-writer` at the moment it resolves a TODO Victor wrote or a correction he states in chat** (primary — the reason is known only then, and the in-chat correction is visible to no one else) · **`/notes-audit`** for the markers it reports and may not resolve (secondary). `_session-rules.md` → "When Victor corrects the prose of a note" owns the trigger. **Two mutable fields, the only sink with a second**: `Disposition`, and `Count`, which is a lower bound by construction because the two writers' sets overlap — the invariant that matters is *at most one `open` row per `Pair` + `Category`* | the harvest that a due category opens as its own `REC-NNN`, resolved by hand under the ledger's four steps — **never a skill and never a run**, since `_note-quality-standard.md` is hand-written only. Counted, not consumed, by `study-content-writer`'s freeze-sync close-out, which prints `cosecha: ninguna` / `cosecha: {categoría} madura` on every run. Not a work queue and not a machinery sink: it measures **Victor's prose bar**, not what a ritual did |
| `notes/prompts/_internal/_interview-voice-spec.md` | **Victor, or a session acting on his explicit instruction, by hand** — the target flow he stated, held in one place because the four rows that implement it may not restate each other. A resolution that changes the target updates it in the same commit; no run writes it | a session resolving `REC-180` or `REC-184`, at **step 1**, before editing its own corner (`REC-183`, its step 4, closed 2026-08-29) — **and a session resolving `REC-171` (g)/(h)**, which is not one of the rows the target is sliced across but rules the same approval gate: `REC-184` requires the two to be decided together or the notes harvest and the voice harvest diverge. **It is a target and not a contract**: it grants no authority, binds no run, and loses to any standard it contradicts — which makes it the file to correct, never the standard |
| `notes/prompts/README.md` **and this file** | whoever changes the machinery, **in the same commit** (including an approved prompt self-refinement) · the `map-sync` ritual, which walks both triggers · `/system-check`, the only prompt whose primary work is auditing both maps · never a build step. **`/system-gaps` reads both and writes neither** — it is the one prompt that takes these two files as its whole evidence, which is exactly why it is forbidden to correct them | anyone orienting in the system — which is why a wrong row is worse than a missing one; `/system-check` (as the object it audits) and `/system-gaps` (as the only evidence it has) |
| `notes/prompts/system/_internal/_system-check-report.md` | `/system-check` only, overwritten on each explicit run | Victor; the next `/system-check`; later whole-system refinement work |
| `.system-check/runs/{run-id}/` | `/system-check` only, outside Git: accepted manifests and reconciliation/review evidence are written verbatim before its atomic `state.md` pointer advances; a continuity migration reuses only concerns whose owned source hashes remain unchanged, and `MODE = carry-forward` reuses a **completed** run's accepted artifacts on its own stricter test — every input that concern was given, including both maps in full for a Direction 2 concern | the same or a later Codex, Claude, or conforming runtime resuming that explicitly selected run, or anchoring a `carry-forward` run on the most recent completed one; orchestration only — never audit evidence, inventory, live state, report substitute, or commit candidate, except an anchor's accepted artifact carried under `MODE = carry-forward`, which is re-gated as this run's own |
| `notes/prompts/system/_internal/_system-gaps-report.md` | `/system-gaps` only, overwritten on each explicit run — including a blocked or dry run | Victor; **the next `/system-gaps`, which is not optional**: the candidates deferred over the five-row promotion cap keep their rank there and nowhere else, so an unread report silently drops the queue it exists to carry |
| `notes/prompts/_internal/_session-rules.md` (+ the two thin platform adapters that delegate to it) | **whoever changes the session contract, by hand** — §1's commit boundary names the session-rule files themselves, so it commits directly. Never a prompt, never a skill, never a build step | every session at start, through the platform adapter that delegates to it; its machinery-only exception replaces project-state orientation with branch + two-map orientation for an explicitly bounded machinery task. 19 of the 31 prompts also name it directly (`/system-check` audits its contract as machinery while obeying that exception). It **outranks this map** |
| `.claude/settings.local.json` | the `.claude/` adapter accumulates local command permissions; **every repository session** owns the close-out check. If dirty, the active agent validates the JSON and commits it in its own `chore(claude): ...` commit even when the change predates the task — Victor's explicit standing exception to preserve-unrelated-changes | the `.claude/` adapter's local permission gate; humans and other agents only preserve/version the ledger and never treat it as task output |
| `notes/prompts/_internal/_recommendation-ledger.md` | **every close-out that produced a recommendation**, reconciling it into `## Open` before the report's bullets are written · `/system-check` for cross-system audit findings · **Victor, or a session acting on his instruction, raising an item by hand** — `REC-046`, `REC-054`, `REC-055`, `REC-070`, `REC-076` and `REC-077` have no originating run, and this is the only entry point that does not · `/system-gaps` for gap findings that clear its promotion bar, at most five rows a run · whoever resolves an item, collapsing it into one line in `_recommendation-ledger-closed.md` and promoting any rule it established into `_recommendation-resolution-doctrine.md`, both beside it | whoever picks up the next item; `/system-check` audits its improvement-loop contract and uses current rows only to deduplicate machinery findings, never to build an operational-debt queue. It is the current status source — a historical report is immutable evidence and its wording never overrides it |
| `notes/prompts/_internal/_recommendation-resolution-doctrine.md` | **whoever resolves a ledger row**, in the same commit as the closure and under step 4's budget — one line in `## Closed` plus at most one promotion, merged into the rule it is an instance of. Split out of the ledger 2026-08-18, when the case law had grown to four fifths of that file · **also a maintenance pass on Victor's instruction**, which merges existing rules into the ones they are instances of under that same budget and adds none — the section intro licenses it, and it is the only writer that touches this file without a closure · never a prompt run, never a skill, never a build step | a session resolving a ledger row, at steps 1 and 3 — **and nothing else**: no prompt reads it, no gate depends on it, and it constrains no run, which is what keeps it out of the standards fence above |
| `notes/prompts/_internal/_recommendation-ledger-closed.md` | **whoever resolves a ledger row**, in the same commit that removes the row from the ledger's `## Open` — one line, ordered by ID, in step 4's closure schema. Split out of the ledger 2026-08-18 alongside the case law, when 156 resolved lines were burying the queue · never a prompt run, never a skill, never a build step | `/system-gaps` Step 7, deduplicating a candidate against resolved work — a match against a **rejected** line discharges it with that line's reason — and any session checking whether a problem has been ruled on before. Not a source of gaps, and never split further: an archive cut by era stops being one deduplication source |
| `{family}/_internal/_last-run-report*.md` | **its own prompt's close-out only** — one per runnable prompt, **overwritten** each run, never appended, and committed together with `_run-tracker.md` | that same prompt's step 0 run-start check (via the `Status:` line), and the ledger reconciliation |
| `{family}/_internal/_breach-log-<prompt-name>.md` | **its own prompt's close-out only**, and only on a run that breached a step or ruled on a `fixed`/`confirmed` row — **append-only**, one per prompt, created on the first breach and never before, committed with the report and `_run-tracker.md`. Every field is immutable but `Disposition`, which the same prompt's refinement step also moves. The counterpart of the row above: the report is overwritten and holds one run, this holds every one of them | that same prompt's close-out — the bar's condition-2 count and the three-run confirmation sweep — and nothing else. **A `Scope: shared` row is not fixed by any prompt**: the step belongs to a contract no run may edit, so at the same two-row count it leaves as a `REC-NNN` citing this log's `BRCH` IDs and naming the log file — `BRCH` numbering is per file, and no close-out opens another prompt's log — and `_recommendation-ledger.md` is where that evidence is aggregated across prompts |
| `notes/prompts/strategy/tracking/_internal/_last-drift-report.md` | `/progress-update` Step E only — **every run, the clean one included**, overwritten, committed alone and before the matrix commit. Not the same file as the close-out's `_last-run-report.md` beside it, which carries machinery evidence and is forbidden content | whoever ticks the two gate checklists that close on an empty drift report, **and every prompt whose `▶ Run first` names `progress-update`** — see §10. The clean run is precisely the one with no other trace: it commits no `PROGRESS.md` |
| `notes/prompts/_internal/validate-prompt-system.ps1` | whoever changes the machinery, in the same commit as the invariant it checks | full mode by hand; `/system-check` uses `-MachineryOnly` before and after its semantic audit so live coverage/plan/route state cannot block — see §12. The only automated check in the system |
| every `_*-standard.md` (family and root) · `_batch-mode.md` · `_single-shot-self-report.md` · `_pipeline-self-report.md` | **by hand only.** The fence, its population and its reason are owned by `_session-rules.md` → "Who writes a standard or a shared contract" | every prompt and skill of the family the standard governs, as its rulebook. `/system-check` audits them and never repairs them; `/system-gaps` never opens one |
| `notes/prompts/_internal/_shared-context.md` | **by hand.** No prompt writes it; the market file beside it (`_job-market-evidence.md`) is the one that gets fed automatically | almost every prompt, and **it outranks every copy of the four facts its own header fences** — the profile, the target companies, the market and the hiring stages; that header states the fence and its limits (the project list defers to `PROGRESS.md`, the ranked hiring-probability list is `ROADMAP.md`'s). `_session-rules.md`'s "Who I am" bullets are its condensed copy, so the two drift apart unless they are edited together; `ROADMAP.md`'s stable strategic sections are the second copy, and `_roadmap-standard.md`'s no-duplication rule is what keeps them a strategy rather than a restatement |
| `notes/prompts/knowledge/coverage/_internal/_topic-ownership.md` | **by hand, through its own admission contract, with explicit authorization.** A coverage run that meets an unregistered topic **stops** — it never infers a boundary and never registers one silently | `/coverage`, `/coverage-verify` (the rows both its cold reviewer and its own Step 2 rejection test rule ownership by), `/coverage-audit`, `/roadmap-review`, `coverage-bullet-add` (altitude routing), `authoring-progress-recount` (the denominator's topic list), and every prompt whose `TOPIC` field reads "one registered topic" |
| `job-search/**` (**outside the repo**, never committed from here) | **Victor, by hand** (`internship-daw.md`, `archive/`, `assets/`) · `/cv` (`master/`, `applications/`) · `/tracker` (`tracker.csv`, `applications/<empresa>-<puesto>/`) | the whole apply family — `/cv` through `_application-standard.md` and by name (`master/`, `archive/` when no CV is pasted) · `/linkedin` through the standard only · `/cover-letter` both through it and by name for `internship-daw.md` · `/tracker` by name (`tracker.csv`, and every `applications/*/outcome.md` in `analyze`) · `/profile-readme` for `internship-daw.md`. Existence proves nothing here: a close-out checks the **mtime is from this run** |

---

## 8 — `PROGRESS.md`, section by section

This is the file you asked about, and the one where "who writes it" is least obvious. The rule since
2026-08-05: **`/progress-update` is an auditor, not this file's writer.** It writes three of the four
cells of one table — the first row below states that partition, and the fourth cell is shared — and
*measures* the rest, reporting drift and naming the ritual that owns the repair.

| Section | Its writer | Notes |
|---|---|---|
| `## Professional level by topic` | **`/progress-update`** — `Current tracked level`, `Knowledge consolidation`, `Next gate` · **`step-complete` / `backlog-task-close`** — `Practical evidence`, in session, when a step or fix earns it | those three cells need all 13 topics at once, which no ritual can compute. `Practical evidence` is the matrix's one deliberately **shared** cell: the audit may only add to it, never rewrite or drop what a ritual wrote (`progress-update-prompt` D7) |
| `## Coverage demonstrated` | **`/coverage`, `/coverage-audit`, `coverage-mark`, and `coverage-bullet-add`** | each **recounts** the affected cells and the `Total` row from the coverage files when it changes scope or markers. `step-complete` deliberately does **not** touch this table: a memory-derived copy would overwrite the recounted one |
| `## Authoring progress` | **`authoring-progress-recount`** | the plans' `Status:` fields and bilingual `[refined]` markers are primary state. Invoked by `notes-audit`, `interview-prep-audit` and `study-content-writer`'s two refining routes, so the rows move in the session that wrote the prose. Alone among the counts it keeps a stale denominator and marks it `*` rather than blanking it: an authored numerator is a fact about files that exist. `/progress-update` measures it as D10 |
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

All nineteen are mirrored in `.claude/skills/` and `.agents/skills/`; **editing one means writing the
identical file to the other in the same commit.**

**But an absence in the `Handoffs, gates + explicit exclusions` cell is not a finding**: it carries the
handoffs, gates and exclusions most likely to be confused, never the skill's whole list of them, so one
missing from it is delegating, not lying — one **named** there with a false scope is the finding, and
the `SKILL.md` stays the exhaustive list. This fence reaches that cell alone.

**And an absence of `_session-rules.md` from a `Primary reads` cell is never a finding either.** All
nineteen `SKILL.md` files name it — most only for the durable-friction close-out this section states
below the table, the rest to cite where a rule they already obey comes from (`map-sync`'s "The two maps
follow every change to the machinery", `step-complete`'s active-branch rule, `study-content-writer`'s
`notes/ folder` → `Detail standard`) — and in neither shape is it an input the row's own product depends
on: the shared session contract reaches every skill through the platform adapter, not through this
column. A background or provenance mention of it, found in a manifest and absent from the cell, is
disposed **`source-only by ownership split`** against this paragraph; it is not a fact with no home in
either map, so it never becomes `missing claim`. **Two cases are owed, and there the absence *is* a
finding**: a skill that takes a **named section** of it as the authority for one concern, and one that
**works on** the file rather than reading it for context — `step-complete`'s whole-project reminder to
update `Current study progress`, which its `Handoffs` cell carries. The licence reaches
`_session-rules.md` and this column alone — it asserts nothing about any other file a skill is told to
read, and neither fence makes a claim about §9's remaining three columns. `map-sync` is the closest
case and still a citation: it founds the ritual on two named sections, but the ritual *is* that rule's
walk, so they are its warrant rather than an input it reads to produce anything.

| Skill | Trigger + received input | Primary reads | Writes / returns | Commit owner + isolation | Handoffs, gates + explicit exclusions |
|---|---|---|---|---|---|
| `step-complete` | a learning-plan step is finished; done-condition evidence + active project | active `PLANNING.md` step/§0/§22/§23, tests/run evidence, project docs, `PROJECT-BACKLOG.md` open High/Medium state **and its per-tier `Last Reviewed` lines** (both feed the `Next gate` derivation), `PROGRESS.md`, relevant coverage | done-condition trace · `PLANNING.md` ✅ + §0 next pointer (`Current step`/`Current branch`/`Done condition`/`Phase`/`Last updated`, and the `Next gate` re-derived under invariant 10, carrying an earlier close's blocked/signable qualifier) · `PROGRESS.md` status/evidence | agent commits tracking/docs; Victor's code and code commit remain untouched | calls `coverage-bullet-add`, `coverage-mark`, `readme-concept-add`; on whole-project completion, reminds Victor to update `_session-rules.md` `Current study progress` + the `PROGRESS.md` project table; not for backlog tasks or merely compiling code |
| `coverage-bullet-add` | a completed step/task taught a concept; whether coverage already holds it is this skill's decision, and "already covered" is its common outcome | concept/evidence, `_coverage-standard.md` (bullet format + placement) and `_topic-ownership.md` (altitude routing), both coverage copies, `_cross-topic-inbox.md`, `progress-update-prompt.md` D8 for the table's counting rule, tracker and coverage totals | missing bullet in both copies, or cross-topic proposal · stale-plan flag · recounted coverage cells · owed-remap return | agent commits its notes/tracking writes; no code | never adds an evidence marker or performs `/notes-plan`; hands the existing bullet to `coverage-mark` |
| `coverage-mark` | a concept was applied in project code; project slug + falsifiable evidence | `_coverage-standard.md` § "Evidence markers" (marker format + preservation) and `_topic-ownership.md`, the matching bullet in topic coverage + global mirror, **the caller's diff** (step 2b sweep), `progress-update-prompt.md` D8 for the table's counting rule, `PROGRESS.md` coverage totals | `✅ NN-slug — {evidence}` on both copies, for the caller's concepts **and for the language/standard-library bullets the sweep finds unmarked** · recounted cells | agent commits coverage/tracking only | never authors a bullet, marks study, treats an unmarked bullet as uncovered, or lets the sweep become a project-wide backfill |
| `readme-concept-add` | a step/task applied a concept; project + audience | README standard, project layout and existing global/backend/frontend READMEs, **`PLANNING.md` §15 step state** (for the marker reconciliation) | one entry in the audience-owned README/section · **deletion of every `*(Step N — coming soon)*` / `*(planned)*` marker whose §15 step is `✅`** | agent commits project documentation only | no restructuring, unrelated cleanup, screenshots, or audit-pipeline work; a marker on a step that is **not** `✅` stays, and stale section *content* is reported rather than fixed |
| `backlog-task-open` | Victor selects one project backlog task | named code, governing `PLANNING.md`, Closed ledger, all consumers, level evidence, other open tasks | five-verdict return **in the same message as the two-layer explanation its §5 contract checks before sending** — affected files first, then the simple layer (today's behaviour, the visible effect, what the task asks) and the technical layer (numbered trace, why it is invisible, the principle, the argued nuances), closing with the three guidance modes in prose, at full depth whatever the task's priority; only `⏸ Deferred YYYY-MM-DD — gate` on the defer route, plus a `## Tasks` entry for any real defect noticed in passing, with its `*(raised …)*` provenance note | agent commits that marker, and the raised task with PLANNING §0's count, in separate commits; no project-code edit | teach-first cycle, or `backlog-task-close` for dropped/already-resolved/false-positive; never re-reviews or closes a fix |
| `backlog-task-close` | a backlog fix/decision is complete and evidenced | task + fix/commit evidence, coverage, README, `PLANNING.md`, `PROGRESS.md`, backlog ledger **and its per-tier `Last Reviewed` lines** (a tier holding an unreviewed slice signs no gate off) | coverage bullet/marker **per concept, plural by contract** — one fix routinely teaches a persistence concept and the SQL that expresses it · README entry · retirement of every README/PLANNING claim the fix made false (step 2b, the ritual's only removing step) · plan rule/§0 (`Last updated` always, the blocked/signable qualifier on `Next gate` after a gate sign-off; `Current step` + its `Done condition` only when no §15 step closed earlier that session; `Current branch` when the fix ends that branch's work; `Phase` only across a real phase boundary) · `Professional level by topic` evidence when earned · one-line Closed ledger · a `## Tasks` entry, separately committed, for any real defect noticed in passing (`REC-179`) | session authorship boundary: agent-owned docs/tracking; Victor owns the fix code commit | calls the three focused writer skills; not for learning-plan steps or ordinary commits |
| `study-content-writer` | daily-session note or Q&A authoring/refinement request | note/Q&A standards, coverage/plan, EN/ES counterpart, target files, `_note-todo-harvest.md` (on the freeze-sync route, to count its threshold); **on either TODO-repair route, the written report is the whole of its evidence** — the instruction quoted, the passage or question ID named, the side repaired and the twin re-translated from it — since neither route has a cold reviewer or a diff gate (`REC-183`, 2026-08-29, which gave the Q&A route the same obligation the frozen-note route already carried) | bilingual note/Q&A changes · studied reset on a `complete` pair · a refined pair's TODO resolved **in the marked passage only**, `Status` and `Studied` both preserved and neither field written · on Victor's declaration that he refined a pair, the counterpart synced with the declared file byte-untouched, then `Status: refined` written and `Studied` cleared — it never appends a section to a frozen note, which stays `/notes-audit`'s door · a report quoting the instruction and naming the passage, this route's only evidence · **one `NTH-NNNN` row per pair+category in `_note-todo-harvest.md` on every TODO or in-chat correction it resolves, `refined` and `complete` pairs alike** · **`cosecha: ninguna` / `cosecha: {categoría} madura` as a visible line on every freeze-sync run** · stable IDs · `[refined]` only on Victor's explicit acceptance | commit governed by the session/adapter authorship contract, not this skill; no cold audit pipeline | routes missing/pending notes to `/notes-plan` + `/notes-audit`, active recall to `study-block-close`; **the only writer licensed to resolve a TODO on a refined note** — `/notes-audit` declines and routes here; excludes project docs and prompt machinery — **with one named exception, `_note-todo-harvest.md`**, the sink it writes as a close-out and never as content |
| `interview-prep-block-open` | Victor starts/continues active recall; one answer at a time | CORE route, lifecycle/answer-quality standard sections, bilingual bank pair, `PROGRESS.md` study orientation | read-only orientation + PASS/BORDERLINE/FAIL return | no write or commit; grading stays in-session | hands exact final-PASS IDs to `study-block-close`; never reveals answers first or assigns `[studied]` |
| `authoring-progress-recount` | a note or question reached an authored state — `notes-audit`, `interview-prep-audit`, `study-content-writer`'s freeze-sync and `[refined]` routes, or Victor asking directly; receives the level | `_topic-ownership.md` for the registered topics, every `notes-plan-{LEVEL}.md` `Status:`/`Pending additions`, the `Plan` cells of `_run-tracker.md` for the `*` flag, the bilingual banks and CORE route, `PROGRESS.md` | the three `## Authoring progress` rows, recounted from primary sources · `*` on a level holding a stale plan · `—` on a level with no denominator · a per-row before/after report | agent commits `PROGRESS.md`; the caller commits the prose and plan that caused the transition | never reads or writes a `Studied:` date, a `[studied]` marker or the `## Study progress` rows — those are `study-block-close`'s; never touches `Professional level by topic`; asks nothing and blocks on nothing |
| `study-block-close` | Victor ends the notes/interview block; facts already proved in-session | completed/refined plan entries, exact refined bilingual Q&A IDs, CORE route, `PROGRESS.md` | note `Studied` dates · the `Pending study` lines the session discharged, cleared one at a time · Q&A `[studied]` after final PASS · recounted Notes/CORE/bank rows, in which a note with an open gap still counts studied | agent commits notes/tracking | never infers study, asks questions, or marks authored-but-unstudied content |
| `sql-block-open` | the 12:30 SQL block starts | SQL doctrine §0, selected route, current exercise, MISTAKES, relevant notes plan, `PROGRESS.md` | read-only next-moment orientation | no write or commit | reports stale §0; never generates, grades, closes, or silently repairs |
| `sql-grade` | Victor says an answered SQL file is ready | doctrine/route, complete answer file, coverage and grading contract | no direct grading; one **cold subagent** writes MISTAKES/tracking/route/doctrine state and returns the score | agent owns authorized tracking writes; Victor owns `.sql` answers and their commit | refuses partial files; calls `sql-step-close` only on ≥80% + last file; never generates exercises |
| `sql-step-close` | the last file of a SQL step scored ≥80% | scored files, route/doctrine, both SQL coverage copies, `PROGRESS.md`, MISTAKES/revision state | drill markers · §0/Total checks · route §3 readiness line · due-gate return | agent commits coverage/tracking; never Victor's SQL answers | names revision/level gates; never grades or closes a daily block |
| `sql-block-close` | Victor ends the SQL block; friction already stated | current route and MISTAKES plus stated friction | `## Fricción` rows only + tomorrow-start return | agent commits the authorized MISTAKES write; Victor owns `.sql` | never grades, infers friction, closes a step, or generates exercises |
| `simulation-block-open` | a timed-simulation block starts | doctrine/route, coverage/progress snapshots, specs, TRACKER, MISTAKES | read-only one-next-moment orientation | no write or commit | `/simulation-plan` on drift, otherwise generator/attempt/correction; never starts timer, grades or edits |
| `simulation-grade` | a planned attempt or correction is ready and complete, or an attempt still in flight needs the one allowed hint | route/doctrine, spec, submitted solution/correction, TRACKER, MISTAKES | no direct grade; one cold `/simulation-review` performs authorised tracking/correction writes | agent commits system-owned simulation artifacts; Victor's submitted solution stays untouched | refuses incomplete inputs; routes Borderline/Fail to corrections and preserves the original timed verdict |
| `simulation-block-close` | timer/block ends; stated time, assessment and friction | doctrine/route/spec/TRACKER/MISTAKES plus facts already stated | attempted/Assisted handoff + stated friction | agent commits system-owned simulation tracking; never Victor's solution | hands to `simulation-grade`; never grades, infers assessment, or changes timed verdict |
| `map-sync` | machinery changed · a read of any depth positively contradicts a map · or one prompt/skill/standard/other internal contract was read whole, which additionally licenses absence findings | changed/read file plus every licensed occurrence in `README.md` and this map | corrected derived-map rows, or an explicit verified/unaffected verdict | agent commits a read-path map fix separately or a change-path fix with the machinery | never fires for project code, notes prose, `PLANNING.md`, or inside a prompt pipeline; never sweeps, blocks, edits machinery to match a map, or rules outside the read licence |
| `skill-refine` | a skill close-out reports `_skill-breach-log.md` has cleared the bar for a `Scope: own` row, or a third `open` `_ritual-friction.md` row naming one ritual; Victor may call either directly. Receives the crossing rows and the target skill | `_skill-breach-log.md`; `_pipeline-self-report.md` → "The bar" (the four conditions, never restated in the skill) and → "The breach log" (`Scope`); **the target `SKILL.md` end to end** in `.claude/skills/`; `_agent-runtime-standard.md` for the reviewer dispatch; §13 of this map for the block’s contract size; `_ritual-friction.md` on the ruling route | the approved edit **in both adapter mirrors** · `Disposition` → `fixed in <hash>` on the rows that fed it · §13’s recounted block cell · `Status` on every `_ritual-friction.md` row naming a ruled ritual · the one-line `cold reviewer: approve \| approve-with-tightening \| reject` verdict, which is the only trace the gate ran | agent commits both mirrors, the sink and whatever `map-sync` touched, in one commit prefixed `refactor(skills): auto-refine`; no project code | calls `map-sync`; **one refinement per session**; never edits a `shared`-scope step (that routes to `_recommendation-ledger.md`, and only at two rows), never deletes a ritual (`deleted` stops and reports), never refines itself on the run that logged the row, never runs inside `/system-check` |

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
- **A `fixed in <hash>` breach row is a debt the fixing run leaves behind.** An approved edit that
  rewrote a breached step is not believed on its own: the row stays open at `fixed` until **three later
  runs actually reach that step** and none breaches it, one advance per run (`confirmed 1/3` → `closed`).
  A run that never reached the step changes nothing — it is not evidence — so a rarely-executed branch
  can hold a `fixed` row for months, and that is the honest state rather than a stall. A breach after the
  fix retires the row `recurred` and opens a successor **starting at two**, which puts the next finding
  over the bar's threshold immediately and bars a second rewording of the same line.
- **The `/notes-plan` debt.** A bullet added in a daily session by `coverage-bullet-add` does **not**
  remap the notes plan — the plan and its `Coverage SHA-256` are never touched by hand. The skill
  reports `/notes-plan {topic} {level}` as owed and appends `⚠ stale YYYY-MM-DD (+N bullets)` to the
  plan's cell in `_run-tracker.md`, so the debt outlives the session. Only a real `/notes-plan` run
  clears it. Batch these at the end of the session.
- **Two markers on a coverage bullet, never interchangeable.** `✅ NN-slug — {evidence}` = Victor
  **built** it (written by `coverage-mark`). `✅ sql:{file-slug}` = he **drilled** it (written by
  `sql-step-close`). A bullet may carry both; the drill marker goes **first**, because the project
  marker's free-text evidence clause swallows anything to its right.
- **`Status: refined` is a lock only Victor sets — against the pipeline's initiative, not against his
  own.** He sets it by hand, or by declaring in session that he refined the pair, which
  `study-content-writer` writes for him after syncing the counterpart and leaving the language he named
  byte-untouched; no prompt reaches that status on its own initiative. Setting it freezes that entry's prose in both languages *and* its
  assigned coverage bullets — no prompt may reword, move or delete them. No prompt sets, clears or
  downgrades that status either. It admits exactly **two** mutations: new bullets land under
  `Pending additions:` and `/notes-audit` appends in a diff-proved append-only mode; and a correction
  Victor asked for — a TODO in the pair, or one he states in session and the run quotes — is resolved by
  `study-content-writer` alone, **inside the marked passage**, with `Status` and `Studied` both
  preserved. A whole section rewritten, a restructure, a new section, or anything the agent proposes
  itself still waits for him to hand the entry back to `pending`.
- **An open `Pending study` is a debt a run leaves behind.** An append-only run over a studied note
  keeps its `Studied` date and records each appended section instead, so `PROGRESS.md` still counts the
  note as studied — correctly — while part of it has never been read. Nothing recomputes this: it
  surfaces only in the append run's report and in `study-block-close`'s, and it clears one line at a
  time, as Victor studies each section. The date does not move until the list empties.
- **The two coverage files are one artefact.** `notes/{topic}/coverage/{LEVEL}.md` and the SQL/topic
  section of `notes/coverage/{LEVEL}.md` carry the same bullets verbatim. Any writer that touches one
  and not the other has introduced drift — **and this is one of the few invariants a machine catches**,
  by `validate-prompt-system.ps1` (README.md states it; §12 explains why it is not restated here).
  Which readers may use the mirror instead of the topic files, and on what proof, is
  `_coverage-standard.md`'s rule and not this map's — `roadmap-review` 2a, `project-brief`,
  `plan-audit`, `review-audit` and `backlog-task-open` all read it today.
- **A gate closes on an empty drift report, not on the run having happened** — and so does every
  `▶ Run first` naming `progress-update`, which `_session-rules.md` → "PROGRESS.md updates" owns.
  True for G6
  (`progress-update` in a project) and G3 (after the SQL level's last step). Both boxes are ticked by
  hand, long after the run, so the report is on disk — `strategy/tracking/_internal/_last-drift-report.md`,
  §7 — and its scope line is what says which project a clean verdict is evidence for.
- **`PROJECT-BACKLOG.md` auto-commits in any flow**, not just inside `/review-audit` — the file is
  written by the review prompt, the two backlog skills and `/plan-audit`'s `whole-plan` specialist,
  never by Victor. In `/plan-audit` it rides inside that run's single atomic plan commit, not one of
  its own.
- **A committed artifact can be deliberately not finished, and what says so to a *machine* differs by
  target.** When a per-section orchestrator's subagent *returns* `BLOCKED` after editing the shared
  target — `interview-prep-audit` over a topic's `en/`+`es/` pair, `portfolio-audit` over a project's
  question bank — the run disposes of that section (restore its span from the run's baseline when one
  exists, else leave and declare it), commits the rest **labelled**, and records that target `blocked` in
  `_run-tracker.md`. **A project bank's `es/` half only ever takes the leave-and-declare side**: it is
  created by stage T, so a first run has nothing at the baseline to restore to and a later one would be
  restoring a twin *older* than the English it mirrors. A failed parity gate is the same shape as an
  under-covered section — finished content that covers less than everything — and is labelled, not
  restored. That tracker cell gates too — only a `completed` result satisfies a prerequisite —
  and it is all the two targets have in common.
  Beyond it they are **not** symmetric: a Q&A pair left holding unfinished bytes has its `Coverage
  SHA-256` **deleted**, because `interview-prep-route`, `interview-prep-block-open` and
  `study-block-close` all gate on that digest and on parity and read a missing one as stale — merely
  *leaving* it would certify the bank,
  since the digest is over the coverage file and does not move when a section blocks. A project question
  bank has **no machine-readable marker at all** (no digest; `/simulator` reads it and gates on
  nothing), so there the tracker cell and the commit label are the only marks that exist. Neither
  prompt stales anything over a section that merely ended *under-covered* — that is finished content,
  and staling a level's bank over it would make its CORE route unbuildable. **The freshness marker is
  the only thing the two shapes are treated differently by; the tracker cell and the commit label are
  reached by both, in both prompts** — an under-covered section is a failed content acceptance gate, and
  `_agent-runtime-standard.md`'s close-out contract bars such a run from `completed` whether or not any
  subagent returned `BLOCKED`. A **dead** role is the
  opposite case and commits nothing: `_agent-runtime-standard.md`'s dispatch contract owns both
  branches, and each prompt owns only what its baseline, span and freshness marker are.
  **`/review-audit` is a third case, and its mark rides inside the artefact.** Its slice reviewers only
  read, so no target is ever left half-written; what a run can lose is a **slice of the review**, and the
  committed `PROJECT-BACKLOG.md` says so on that tier's own `Last Reviewed` line —
  `2026-08-14 (incomplete — «slice» not reviewed)`. That line has **four kinds** of reader, not one: the
  prompt's own next-run gate, where a qualified line counts as unreviewed code so the lost slice is
  re-read without FORCE; `_planning-standard.md` §23's G3/G4 boxes, which ask for that run's date and no
  qualifier, so a lost slice leaves the gate unsigned; `/portfolio-audit`, which stops rather than
  count tasks a short review never wrote; and both §0 rituals, which cannot derive or qualify
  `Next gate` without it. No
  commit label is owed (the file is committed whole and its tasks are real), and the tracker cell is not
  the record: it is an execution record the gate never reads. A tier that lost **every** slice is not
  stamped at all.
- **A skill edited in one adapter is edited in both, in the same commit.** They drifted silently once
  (2026-07-30 → 2026-08-01) and Codex ran a ritual two revisions old. `diff` the pair before committing.
- **Machinery paths are contracts, not an invitation to traverse live state.** `/system-check` verifies
  that prompts and skills declare the right path patterns, schemas, owners and gates, but excludes the
  governed project, learning, SQL, practice and application artifacts from its inventory, denominator,
  report and blocking conditions. Under `_session-rules.md`'s machinery-only exception, the exclusion
  begins before Step 0: active-project planning, backlog and progress state are not opened for orientation.
  Their existing task/step/block rituals own operational truth.
- **A timed verdict is immutable evidence.** Corrections close learning gaps but never turn a historical
  Borderline/Fail/Assisted attempt into a Pass or change its recorded time. A Fail additionally opens a
  later reinforcement step; otherwise correction would erase the very interview-condition signal the
  track exists to measure.

---

## 11 — When something is out of date, run this

| Symptom | Run |
|---|---|
| a skill made you repeat yourself, or you had to tell it something its own text should have said | nothing — the skill logs an `SBRC` row itself and `skill-refine` fires when `_pipeline-self-report.md` → "The bar" is cleared. Say `refina ese skill` only to force it early |
| a ritual keeps costing more than it gives | say so in passing — the line lands in `_ritual-friction.md`, and `skill-refine` executes the `REC-054` (c) ruling at the third row. A `deleted` verdict stops and comes back to you |
| coverage gained bullets → a notes plan is `⚠ stale` | `/notes-plan {topic} {level}` |
| Victor refined a note in one language and wants the pair frozen | say which language — the daily session's `study-content-writer` syncs the *counterpart* only, changes nothing in the file he named, hands over the commit for both, writes `Status: refined`, and invokes `authoring-progress-recount` |
| a refined note needs a wording fix | write the `TODO` in it — the daily session's `study-content-writer` resolves it in place, keeping `Status: refined` and the `Studied` date. `/notes-audit` reports such markers and routes them here; a whole-section rewrite is not this route and needs the hand-back to `pending` |
| a plan entry is studied but holds an open `Pending study` | it is a studied note owing one section, counted studied on purpose — study those sections and `study-block-close` clears the lines, moving the date once the list empties |
| a level's topics are all defined but never converged | `/coverage-audit {level}`, then `/roadmap-review` |
| `/coverage-verify` returned `gaps` | `/coverage {topic} {level}` in update mode |
| `PROGRESS.md` looks wrong before a gate | `/progress-update`, then repair with the ritual its drift report names |
| `ROADMAP.md` has dates, or a stale gap table | `/roadmap-review` |
| the SQL route ran out of steps | `/sql-plan-audit` (extends), or `/sql-plan {next level}` |
| simulations have no level route, the route is stale, or the current spec has free-form scope | `/simulation-plan {level}`; then `/simulation-generator` only for its current missing spec |
| a timed simulation is Borderline/Fail or has open correction rows | fix only those rows, then say `corrige las correcciones`; `simulation-grade` runs the cold correction review |
| the ROADMAP 12:30 block has reached `Stage 2 — Technical test simulation` | `/code-review-practice`; `README.md` → "The code-review-practice track" owns its no-prerequisite start, durable retry loop and progression |
| application work starts, a real HR call is scheduled, or `practice/interview/MISTAKES.md` has open `hr-screen` rows | `/hr-screen`; `README.md` → "The HR-screen practice track" owns the first-call trigger, durable retry loop and separation from `/simulator` |
| a project is built but never reviewed | `/review-audit` (G3/G4) → fix every High → `/readme-audit` (G5) → empty `/progress-update` (G6) → `/portfolio-audit` (G7) |
| `projects/README.md` is missing or its numbered inventory differs from the project folders | `/project-brief` Guard 5 stops and names the exact mismatch; the human writer in §7 repairs the index |
| a real defect surfaced while a backlog task was being triaged or closed | nothing to launch — `backlog-task-open` / `backlog-task-close` write it into `PROJECT-BACKLOG.md` `## Tasks` in the same turn, with a `*(raised …)*` note and PLANNING §0's count, and go straight back to the task in hand. Neither triages it (that is the next `backlog-task-open`) nor fixes it |
| a step was finished and nothing was recorded | the `step-complete` ritual, walked by hand against §9 |
| a row here contradicts the prompt or skill it describes | the `map-sync` ritual — **the machinery wins**; fix the row, never the file |
| `_skill-friction.md` has an `open` row | run any runnable prompt; its close-out adjudicates the row before its own recommendations |
| the same named step keeps being skipped, and every report that said so was overwritten by the next run | its prompt's `_breach-log-<prompt-name>.md` — two rows naming one step remove the bar's "discipline lapse" verdict for it, and its close-out rules on that count itself. Nothing to launch: the next run of that prompt performs it |
| a breached step was rewritten and nobody knows whether the rewrite worked | the same log's `fixed in <hash>` row, advanced one step per later run that **reaches** that step cleanly and closed at three. A run that never reached it proves nothing and moves nothing |
| you keep writing the same kind of TODO on your notes, and every one you resolve disappears | nothing — the resolving `study-content-writer` rows it in `_note-todo-harvest.md` (`NTH-NNNN`, one row per pair+category, your own words verbatim) and its freeze-sync close-out prints `cosecha:` on every run. A category that recurs in **two different pairs** is mature; the first harvest waits for `REC-170`'s four refined pairs |
| a `cosecha: {categoría} madura` line appeared | that category opens its own `REC-NNN` — one rule added to `_note-quality-standard.md` and at most one cut, by hand, under the ledger's four steps with the mandatory cold reviewer. **No skill and no run may edit the standard from it** |
| a ritual completed as declared and was **not worth its cost** — it ate the block, nobody reads its output, the work got done by hand anyway | append one `RITF-NNNN` row to `_ritual-friction.md` and carry on. It opens **no** `REC` and dispatches **no** cold reviewer |
| `_ritual-friction.md` has three `open` rows naming one ritual | that ritual is due a ruling under `_recommendation-ledger.md` → `REC-054` (c) — kept, thinned or deleted. The only ruling licensed to *remove* machinery |
| a prompt or skill was added, renamed or retired · a path may have gone dead · a map may never have learned the machinery exists | `_internal/validate-prompt-system.ps1` (§12) — the only check that can see a **non**-firing `map-sync` |
| a `_last-run-report*.md` says `applied in <hash>` and carries no `cold reviewer:` verdict, or its `Status:` field is missing or outside `clean` · `open` · `rejected` · `applied in <hash>` | `_internal/validate-prompt-system.ps1` — the applied edit is read as a **self-approval** and stays that way; the only other way out is correcting the `Status` to the truthful value **when the hash it names is not a prompt edit**, which is a claim `git show` settles, never a way to make the red go away |
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
   `Status:` line from the vocabulary owned once in `_pipeline-self-report.md`: `clean`, `open`,
   `rejected`, or `applied in <hash>`. Every prompt's run-start check points to that decision table
   instead of reconstructing the meanings inline; only its bounded legacy-`open` branch reads a Verdict.
2. **The close-out check runs first, and against disk.** Declared outputs from this prompt's `README.md`
   row, probed with `git status` **and** `git log --name-only`; for an orchestrator, also the count of
   mandated dispatches against the count actually dispatched — the half no file can prove. Nothing here
   is answered from memory, because *the same saturated context that skips a step cannot see the skip*.
3. **Findings are reconciled into `_recommendation-ledger.md`** before the bullets are written. A new or
   unresolved one becomes a row in `## Open`, state `open` or `accepted`. The ledger's other two states
   are resolutions rather than row states: reaching `applied` or `rejected` collapses the row into one
   line in `_recommendation-ledger-closed.md`.
4. **The four-condition bar** decides whether it earns an edit at all: real evidence not theory · the
   prompt was wrong or ambiguous rather than merely broken by the run · **it would have changed the
   result, not just the cost** · not already covered somewhere the run failed to look. **Condition 3
   kills most findings.** Friction is recorded in the Verdict and stops there, and a rejected finding
   names its failed condition so the same zombie is not re-proposed next run.
   **Condition 2 is counted, not judged, once a step has a history.** The report it would be judged from
   is overwritten every run, so the close-out reads the prompt's own `_breach-log-<prompt-name>.md`
   (§7, §10) instead: at **two rows naming the same step**, "the run broke a clear rule" stops being an
   available verdict — a rule a competent executor breaches repeatedly is mis-worded or mis-placed — and
   the finding proceeds on conditions 1, 3 and 4 alone. It is a floor for the ambiguous repeat, never a
   waiting period for the breach whose defect is plain the first time.
   `Scope: shared` rows are outside the test and leave as a `REC-NNN` **at that same two-row count**,
   because `_session-rules.md` → "Who writes a standard or a shared contract" bars a run from editing
   the contracts it executes.
5. **A cold reviewer — mandatory, no exceptions.** The drafted edit goes to one cold subagent with five
   inputs, one being **the whole prompt file read to EOF**, which is what makes condition 4 and
   the contradiction check answerable at all. It returns `approve` / `approve-with-tightening` / `reject`, and only what it
   approves is applied. A reject — or a reviewer that could not be dispatched (a death is not that until
   its scratch file, a resume and one re-dispatch have all failed — `_agent-runtime-standard.md`) —
   leaves the finding
   `open`: a postponed finding is recoverable through its `Status` line, a self-approved bad edit is not.
   **The verdict line is the only trace the gate ran**; an applied edit without one is indistinguishable
   on disk from a self-approval and must be read as one. `validate-prompt-system.ps1` checks that pairing,
   under the invariant `README.md` states. **All of this describes the refinement gate. Resolving a
   ledger row runs the same mandatory gate over a different object** — a fix already on disk rather than
   a draft — so its inputs, the two extra return lines it owes (`sweep:` and the maps declaration), its
   park-the-edit branch, and the reviewer verdict persisted by the closed line are
   `_recommendation-ledger.md`'s steps 3–4 and not this item.
6. **The edit lands under both map rules** — the change test and the read test in "How it stays true" —
   the hash goes into the report's `Status:`, and the ledger row collapses into one line in
   **`_recommendation-ledger-closed.md`**, the ledger's resolved half, after any rule it established is
   **promoted into `_recommendation-resolution-doctrine.md`**, its case-law half. A rule that governs future work must
   not stay buried in a row about something else; that is how one precedent came to be cited seven times
   and misread every time.
7. **The run-start check closes the loop.** The at-end refinement only ever sees *this* run's report, so
   step 0 of every prompt executes the shared status decision table against its own last report and
   surfaces only a genuine `open`. Without it a finding rots — the `notes-write` gate sat open four days for exactly that reason.
   It **surfaces and never applies**: editing a prompt and then immediately running it entangles an
   unverified edit with the run.
8. **And the fix is verified by later runs, which is where the loop actually closes.** Until this step
   existed the chain ended at 6: an edit landed and nothing ever asked whether it worked. An approved
   edit over a breached step leaves its rows `fixed in <hash>`, and each later close-out of that prompt
   rules on them — reached and clean advances `confirmed N/3` and closes at three, not reached changes
   nothing, breached again retires the row `recurred` and opens a successor already at the threshold,
   which bars a second rewording of the same line and sends the next attempt at placement or extraction.

**One asymmetry worth naming.** Steps 1–7 are driven by the run that *finds* something; step 8 is driven
by runs that find nothing, which is the only reason it can prove anything. A prompt nobody runs again
therefore keeps its `fixed` rows open indefinitely, and that is the truthful state rather than a stall —
the same property as every other trigger here, where nothing is scheduled and nothing fires on a clock.

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
machinery to EOF, and the README-owned prompt contracts and this map's wiring and skill contracts are
reconciled through a physical-line-backed claim ledger and the stable-ID reverse ledger of every atomic
manifest fact. **Both directions are ruled by bounded cold concerns** — one per map span, one per manifest
concern, after two runs blocked proving one context cannot disposition them all (`REC-109`) — and each
concern reads the map itself, since dividing the *source* into a paraphrase is what `REC-079` deleted. A
cold final reviewer independently reproduces the partition and the line denominator before gating the
global verdict. Every accepted bounded concern first lands in the Git-ignored `.system-check/` run
directory, whose atomic state pointer makes the frozen analysis resumable across sessions and agent
products; it never replaces the final report or enters the audit denominator. Its default
`MODE = carry-forward` extends that reuse across runs — a completed run's accepted artifact stands for a
concern whose own inputs still hash identically — because a full derivation costs more sessions than the
interval between machinery commits. The durable report proves the inventory boundary and
the reconciliation. It may correct the two derived maps and file machinery recommendations, but never
opens or reports live project, learning, SQL, practice or application state — including the active
project's orientation files. **A map claim its own source contradicts is a ledger row, not a blocked
verdict**: the audit rules on the maps, and a source stating two mutually exclusive clauses is a defect it
is forbidden to repair. Because it is token-intensive, it is **explicit only** — never scheduled,
inferred, or run per commit.

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
| `08:00` | `step-complete` · `backlog-task-open` · `backlog-task-close` · `coverage-bullet-add` · `coverage-mark` · `readme-concept-add` | **none** | **none** — closing is per *step* and per *task*, never per block | none | 43 steps · ~1,700 lines |
| `12:30` | `sql-block-open` · `sql-grade` · `sql-step-close` · `sql-block-close` — and for the practice half `simulation-block-open` · `simulation-grade` · `simulation-block-close` | `sql-block-open` / `simulation-block-open`, both **read-only** | `sql-block-close` / `simulation-block-close`, plus the step-level `sql-step-close` | **yes, both tracks** — `sql-grade` and `simulation-grade` grade in one cold subagent so teaching context cannot contaminate the score | 29 steps · ~858 lines |
| `13:30` | `study-content-writer` · `interview-prep-block-open` · `study-block-close` · `authoring-progress-recount` | `interview-prep-block-open`, for the **interview half only**; the notes half has none | `study-block-close`, for both halves | none | 20 steps · ~500 lines |
| `machinery` | `map-sync` · `skill-refine` | — | — | **yes** — `skill-refine` submits every drafted `SKILL.md` edit to one cold reviewer that reads the whole file, so no refinement is ever self-approved | 18 steps · ~368 lines |

Counts are `SKILL.md` numbered steps **including lettered sub-steps** — `1a`, `3b` carry their own
declared work, and they are not written at a uniform heading level, so a count that excludes them is both
lower and unreproducible — plus file length, all four rows measured in one pass on 2026-08-26 in
`.claude/skills/`. The `.agents/` mirror carries the same content by contract (§10), so either
adapter gives the same numbers. They are a proxy for contract weight, not for
minutes — only a `RITF-NNNN` row measures those, and only from a day that was actually lived.

**The four asymmetries the table exists to show.** All four are observations, and each is a candidate a
`RITF-NNNN` row would later be ruled against:

- **The heaviest block has the least structure.** 08:00 carries more ritual contract than the other
  three blocks combined — the figure is the table's, and is deliberately not restated here — with no
  opener and no closer. Its recording is event-driven instead:
  finishing a step fires `step-complete`, closing a backlog task fires `backlog-task-close`, and each of
  those calls the three focused writer skills, unconditionally rather than as a ceiling. **Closing one
  backlog task therefore walks four skills and 10 + 7 + 7 + 5 declared steps** — the longest single path
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
- **One skill in nineteen is allowed to ask a question.** `interview-prep-block-open`, because asking
  and grading one question *is* its product — the intentional exception to §9's rule that **mechanical
  and closing** rituals ask zero questions. That rule is narrower than "no skill ever waits": authoring
  skills legitimately do, and `study-content-writer` waits for Victor's explicit acceptance before
  `[refined]` is set. What no ritual does is stall a block on an answer it needs to finish: a step that
  cannot close is reported and the target left open.

**Where a skill belongs to no single block.** `study-content-writer` fires wherever note or Q&A prose is
written in a daily session — its home is 13:30, but a note written during the project block is the same
trigger, and it is counted above only once. `authoring-progress-recount` is counted in the same row for
the same reason: `study-content-writer` invokes it there, but `/notes-audit` and `/interview-prep-audit`
invoke it from their own runs, at whatever hour those happen. `map-sync` fires on any read or change of the machinery in
any session at all, and `skill-refine` fires wherever the skill that crossed its threshold ran, which is why
both take the fourth `Block` value rather than one of the three hours.
