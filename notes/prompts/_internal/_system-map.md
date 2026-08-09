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

**It is derived, not authoritative.** Three files outrank it and each owns a different half:

| File | Owns |
|---|---|
| `notes/prompts/_internal/_session-rules.md` | the session contract: the rituals, the commit boundary, the non-negotiables |
| `notes/prompts/README.md` | the prompt catalogue: what each of the 30 prompts reads and generates, batch mode, run order |
| each `SKILL.md` (`.claude/skills/` + `.agents/skills/`) | the exact steps of one ritual |

If this map disagrees with any of them, they win and this file is wrong.

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
`REC-054` remains the later review of whether the settled machinery adds up to a workable day.

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
                     │            │        /readme-audit · /review-audit ─► PROJECT-BACKLOG.md
                     │            │                     │                        │
                     │            │        backlog-task-open ─► backlog-task-close
                     │            │                                              │
                     │            │                            /portfolio-audit ─┴─► cv-bullets.md
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

`/system-check` sits outside Chains A–D. It consumes the machinery and both maps as one explicit global
audit after substantial changes; it never becomes a prerequisite of their ordinary runs or commits.

---

## 3 — Chain A: knowledge (coverage → notes → Q&A)

The root of everything. Coverage defines *what junior means*; every other chain consumes it.

1. **`/coverage {topic} {level}`** — defines or refreshes the scope of one topic at one level, anchored
   to real job postings in `_job-market-evidence.md`.
   → writes `notes/{topic}/coverage/{LEVEL}.md` **and its global mirror** `notes/coverage/{LEVEL}.md`
   (every coverage writer writes both), files gaps owned by other topics into `_cross-topic-inbox.md`,
   consumes applicable `verify-{LEVEL}.md` gaps, stamps `Plan status: stale` on every notes plan whose
   fingerprint it just invalidated, and recounts the affected `PROGRESS.md` `Coverage demonstrated`
   cells because the denominator moved.

2. **`/coverage-verify {topic} {level}`** — a cold reviewer checks that scope is *complete* for the job
   target, including the earlier levels it depends on.
   → writes `notes/{topic}/coverage/verify-{LEVEL}.md` (verdict + gaps). **Advisory**: a `gaps` verdict
   never blocks step 3. The gaps feed back into a `/coverage` update run — that is the loop you meant
   by "si encuentra gaps se ejecuta coverage otra vez".

3. **`/notes-plan {topic} {level}`** — turns the checklist into a study map: which note file teaches
   which bullet, in what order, each bullet mapped **exactly once**.
   → writes `notes/{topic}/coverage/notes-plan-{LEVEL}.md`, carrying a `Coverage SHA-256` fingerprint of
   the coverage file it was built from. Each entry separates authored `Status` from its independent
   `Studied` date. It writes no prose.

4. **`/notes-audit {topic} {level} {note}`** — builds **one** planned file pair through four cold stages
   (English author → English reviewer → translator → Spanish reviewer).
   → writes `notes/{topic}/{level}/en/NN-*.md` + `es/NN-*.md`, marks that entry's concepts `[x]` in the
   plan, resets `Studied` when prose changes, and commits the three atomically. Repeat once per pending entry until the plan is all
   `complete` / `refined`. It refuses to run on a plan whose fingerprint is stale — that is why step 3
   is not optional.

5. **`/interview-prep-audit {level} {topic}`** — builds that topic's market-selected Q&A bank from
   current coverage + evidence. The selected notes plan must be current; pending junior entries are
   allowed because every authored question remains unrefined until Victor accepts it. Middle/senior
   still require their earlier-level progression gates.
   → writes fingerprinted, stable-ID `notes/interview-prep/{LEVEL}/en/*.md` + `es/*.md`, including
   standalone Spring; Angular Material deliberately shares Angular's bank. Coverage bounds the level
   but does not demand one question per bullet.

6. **`/interview-prep-route {level}`** — after every required bank is current, selects the globally
   weighted CORE subset from ⭐⭐⭐ questions and fingerprints the state-stripped question inventory.
   → writes `notes/interview-prep/routes/{LEVEL}.md`, IDs and navigation labels only, never answers.

7. **When every topic has that level: `/coverage-audit {level}`** — the convergence pass over the global
   mirror (level boundaries, missing topics, ownership overlaps) — **then `/roadmap-review`**.

**In-session on this chain:** `study-content-writer` keeps bilingual note/Q&A edits at their standards.
Only Victor assigns `[refined]`; that freezes the complete question block, and an explicit reopen/TODO
clears both lifecycle markers before editing. `interview-prep-block-open` resolves the CORE route,
presents one refined question, accepts dictation or text, and grades PASS/BORDERLINE/FAIL without
writing. When the 13:30 block ends, `study-block-close` dates exact notes, mirrors `[studied]` only on
refined IDs with final PASS, and recounts Notes + CORE + full-bank `PROGRESS.md` study cells.

**The sideways door: `_cross-topic-inbox.md`.** When any coverage run — or `coverage-bullet-add` in a
daily session — finds a concept owned by a *different* topic, it never writes into that topic's file. It
files a proposal under that topic's heading in
`notes/prompts/knowledge/coverage/_internal/_cross-topic-inbox.md`. Each `/coverage` run reads its own
heading and processes it in Step 2; `/coverage-audit` sweeps every heading. This is the only
durable handoff *between* topics, and it is why an inline bullet that lands in the wrong topic is a real
failure rather than a cosmetic one.

---

## 4 — Chain B: projects (decide → plan → build → review → gate)

1. **`/progress-update`** — run it *first*, and repair whatever its drift report names. It is an
   **auditor**: it writes one table and measures the rest (see §8).
2. **`/project-brief`** — decides *which* project, on one page, with a mandatory cold second opinion.
   → `projects/briefs/project-brief-{NN}.md`. Gap analysis keys on the `✅ NN-slug` evidence markers in
   coverage, never on `PROGRESS.md`.
3. **`/plan-audit MODE = new`** — designs the project the brief chose: full 24-section plan, an
   architecture advisor, then seven cold specialist reviewers.
   → `{project}/PLANNING.md`, a new row in `PROGRESS.md` `## Projects`, a mark in `ROADMAP.md`.
4. **Build it, step by step, in the daily sessions.** Each finished step fires **`step-complete`** — see
   §9; it is the ritual that touches the most files in the whole system.
5. **`/readme-audit`** — README(s) to the standard, one author+reviewer pair per README (gate **G5**).
6. **`/review-audit`** — code + correctness + security + tests, by vertical slice.
   → `PROJECT-BACKLOG.md` (**auto-committed** — the file is never written by Victor).
7. **Per backlog task, in session:** **`backlog-task-open`** triages it before any teaching (five
   verdicts; a *wrong moment* verdict writes a `⏸ Deferred` marker and nothing else) → the teach-first
   explanation → **`backlog-task-close`** pushes the concept back into the seven places the plan never
   knew about it.
8. **`/portfolio-audit`** — the go/no-go gate (**G7**).
   → `notes/interview-prep/projects/{project}.md`, `notes/cv/cv-bullets.md`, and on ✅ Ready the profile
   README in the separate `dev/portfolio/VMNunez` repo.

**The gates (`PLANNING.md` §23), which are what actually sequences this chain:**

| Gate | Fires when | Run |
|---|---|---|
| **G1** | every step's done condition passes | *no prompt* — the `step-complete` skill, in session |
| **G2** | only if the plan or branch strategy moves mid-build | `/plan-audit MODE = review` |
| **G3** | the backend is complete | `/review-audit REVIEW_SCOPE = backend` |
| **G4** | the frontend steps are complete | `/review-audit REVIEW_SCOPE = frontend` |
| **G5** | every **High** from G3/G4 is fixed | `/readme-audit` |
| **G6** | after G5, before the portfolio gate | `/progress-update MODE = active` |
| **G7** | after G5 **and** G6 | `/portfolio-audit` |
| **G8** | G7 returned ✅ Ready | `/roadmap-review` |

The chain is `G3/G4 → fix the Highs → G5 → G6 → G7 → G8`. **G6 closes on an empty drift report, not on
the run having happened** — a run that names drift leaves it open until the owner it names has repaired
it.

> **Careful with the letter G.** The project gates above live in each `PLANNING.md` §23. The SQL track
> has its *own* G1–G4 in `practice/sql/PLANNING.md` §9, and they are different gates: SQL's **G3** is
> `progress-update` (project G3 is a backend review), SQL's **G4** is `roadmap-review` (project G4 is a
> frontend review). Always say which §23/§9 you mean.

---

## 5 — Chain C: SQL (the 12:30 block)

Two plan files, and confusing them is the classic mistake:
`practice/sql/PLANNING.md` is the **level-neutral doctrine** (the step loop, done-condition formats,
gates, revision cadence, the §8c technique table). `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` is the
**route** for one level (steps, files, targets, counts). One doctrine, three routes.

1. **`/coverage sql junior`** (+ `/coverage-verify`) → `notes/sql/coverage/junior.md` + mirror.
2. **`/sql-plan junior`** → the route, fingerprinted against that coverage. Re-run when coverage grows.
3. **`/sql-plan-audit`** → audits *and extends* both files; writes steps for coverage sections nothing
   claims yet.
4. **The block itself**, five moments:
   - **`sql-block-open`** — read-only orientation: which step, which file, how many unanswered, which
     Moment comes next. It also reaches **into chain A** — it opens
     `notes/sql/coverage/notes-plan-{LEVEL}.md`, finds the entry claiming this step's coverage bullets,
     and says whether the theory note behind the step is worth reading first or still needs
     `/notes-audit`. That is the only link between the exercise track and the notes track. Writes
     nothing; a stale §0 is *reported*, never silently repaired.
   - **`/sql-exercises MODE = practice`** → `practice/sql/{LEVEL}/NN-name.sql`. Topic, count and focus
     come from the route, never pasted.
   - Victor answers them in pgAdmin. His file, his commit.
   - **`sql-grade`** — refuses a partially answered file, then runs the review prompt in a **cold
     subagent** (it must not remember teaching him the answer). That subagent writes `MISTAKES.md`
     `## Open`, the `Exercise route` tables in `PROGRESS.md`, the route's §1 counts / §2 checkboxes /
     §3 status, and the doctrine's §0.
   - **`sql-block-close`** — writes exactly one thing: `MISTAKES.md` `## Fricción`, the concepts that
     cost him time and that he then got *right*. Nothing else in the track can see those, because a
     grader only records failures.
5. **`sql-step-close`** fires automatically when a step's last file scores ≥ 80%. Its own work is the
   **drill markers**: `✅ sql:{file-slug}` on every coverage bullet the step's scored exercises actually
   drilled, in the topic file and the mirror. It also re-checks the `Total` arithmetic in `PROGRESS.md`,
   names any revision point now due, and states which techniques a simulation may now ask for (§8c).
6. **Revision points R1–R5** take their focus from `MISTAKES.md` — `## Open` rows first, highest count
   first; when a span has no open rows, `## Fricción` for that span.
7. A later **`/simulation-plan`** may admit SQL only from the techniques §8c says are unlocked; its
   route-driven `/simulation-generator` independently re-checks that fence.
8. **After the level's last step:** gate **G3** `/progress-update`, then **G4** `/roadmap-review`, then
   `/sql-plan middle`.

### The timed-simulation loop (coverage + evidence → plan → attempt → correction)

This is a separate practice route, not an extension of the SQL exercise counters:

1. **`/progress-update`** must have an empty drift report; readiness cannot be planned from a stale
   professional-level/evidence matrix.
2. **`/simulation-plan {LEVEL}`** reads selected-level coverage, PROGRESS/project evidence, existing
   specs/TRACKER/MISTAKES, and SQL's unlocked-technique fence. It creates the level-neutral doctrine when
   missing and the fingerprinted route for that level. It alone authors reinforcement successors.
   Coverage is the ceiling; evidence decides ready.
3. **`simulation-block-open`** recomputes the coverage manifest and progress snapshot before it gives one
   next moment. A moved manifest or unadjudicated progress snapshot routes back to `/simulation-plan`.
   A missing planned spec
   hands off to `/simulation-generator`; a ready spec hands off to the timed attempt; an open correction
   always wins over a new test.
4. **`/simulation-generator`** materialises exactly one planned step. It cannot accept free-form focus,
   difficulty, time, or track.
5. **`simulation-block-close`** records explicit attempted/Assisted state, exact time, stated
   self-assessment, and friction already spoken. It never grades.
6. **`simulation-grade`** is the only review door and dispatches `/simulation-review` cold. Pass closes;
   Borderline/Fail opens mandatory correction rows in simulation MISTAKES. Fixed rows move atomically to
   Closed. A corrected Fail or reviewed Assisted attempt becomes reinforcement-required;
   `/simulation-plan` resolves stable IDs from Closed (or the original Assisted focus) and authors the
   linked test, whose unaided Pass closes both learning states without rewriting the original verdict or time.
7. **Level close:** every route step closed, no open correction, and at least one Pass in every admitted
   track; then `/progress-update` audits the timed-simulation roll-up before the next level is planned.

---

## 6 — Chain D: apply (and how the loop closes)

`/portfolio-audit` → `notes/cv/cv-bullets.md` → **`/cv`** (one-page Spanish CV) · **`/linkedin`** ·
per offer: **`/cv tailor`** + **`/cover-letter`** → **`/tracker log`** → outcomes with `/tracker update`
→ **`/tracker analyze`** surfaces skill gaps → **`/evidence-intake`** turns real postings into
`_job-market-evidence.md` → which is what **`/coverage`** reads to decide what junior means.

That is the market-to-coverage loop: what the market rejects you for becomes coverage scope. Practice
has its own shorter feedback loops: SQL and timed simulations feed their MISTAKES rows into revision /
reinforcement, while the three interview surfaces write and retry their own rows in
`practice/interview/MISTAKES.md`. Practice gaps do not author coverage bullets; they point at existing
scope or become Q&A through the owning prompt.

**`/profile-readme`** sits beside that line rather than on it — `sync` (fact deltas only) or `optimize`
(a full re-evaluation against the job target) for the GitHub profile README, which lives in the separate
`dev/portfolio/VMNunez` repo. `/portfolio-audit` writes that same README, but only on a ✅ Ready verdict,
so the file has **two writers on different triggers** and §7 records both.

The apply prompts write **outside the repo** — into `personal/job-search/`, and for `/profile-readme`
into the separate portfolio repo — never committed from here, so their close-out checks the file's
**mtime is from this run**, not merely that it exists.

---

## 7 — The writer registry

Every file whose ownership is contestable — **including the ones with exactly one writer**,
where the row's whole job is to say *only this, never by hand*. The bottom block is the machinery's own
files: the system that describes and checks the system, which has writers like everything else.

| File | Written by | Read by |
|---|---|---|
| `notes/{topic}/coverage/{LEVEL}.md` **+ mirror** `notes/coverage/{LEVEL}.md` | `/coverage`, `/coverage-audit` (bulk) · `coverage-bullet-add` (one bullet) · `coverage-mark` (project markers) · `sql-step-close` (drill markers, SQL only) | everything downstream |
| `notes/{topic}/coverage/verify-{LEVEL}.md` | `/coverage-verify` | `/notes-plan` (advisory), `/coverage` update |
| `notes/{topic}/coverage/notes-plan-{LEVEL}.md` | `/notes-plan` (whole route) · `/coverage` (`Plan status: stale` only) · `/notes-audit` (concept/status + studied reset) · `study-content-writer` (studied reset only) · `study-block-close` (studied date only) | `/notes-audit` (fingerprint gate), `/coverage`, `/interview-prep-audit`, `/progress-update` |
| `notes/{topic}/{level}/en|es/*.md` | `/notes-audit` · in session, guided by `study-content-writer` for an existing complete, non-frozen pair only | Victor |
| `notes/interview-prep/{LEVEL}/en|es/*.md` | `/interview-prep-audit` · `/simulation-review` · `/code-review-practice` · `study-content-writer` (unrefined/reopen/refine) · `study-block-close` (`[studied]` only) | `/interview-prep-route`, `interview-prep-block-open`, `/simulator`, `/progress-update` |
| `notes/interview-prep/routes/{LEVEL}.md` | `/interview-prep-route` only | `interview-prep-block-open`, `study-block-close`, `/progress-update` |
| `notes/interview-prep/projects/*.md` | `/portfolio-audit` | `/simulator` |
| `PROGRESS.md` | **section by section — see §8** | `/plan-audit`, `/roadmap-review`, `/project-brief`, `/review-audit`, `/cv`, `/linkedin`, `/sql-exercises` |
| `ROADMAP.md` | `/roadmap-review` (+ `/plan-audit` marks the chosen project) | `/project-brief`, `/hr-screen`, the SQL gates |
| `projects/briefs/project-brief-{NN}.md` | `/project-brief` | `/plan-audit MODE = new` (refuses a stale one) |
| `{project}/PLANNING.md` | `/plan-audit` · `step-complete` (✅ + §0) · `backlog-task-close` (rules section + §0) | `/readme-audit`, `/review-audit`, `/portfolio-audit`, `/progress-update`, `/roadmap-review`, every session |
| `{project}/README.md` (+ backend/frontend) | `/readme-audit` (whole file) · `readme-concept-add` (one entry) | `/portfolio-audit`, recruiters |
| `{project}/PROJECT-BACKLOG.md` | `/review-audit` (tasks) · `backlog-task-open` (`⏸ Deferred`) · `backlog-task-close` (`## Closed`) | `/portfolio-audit` (open High/Medium block the verdict), every session start |
| `notes/cv/cv-bullets.md` | `/portfolio-audit` | `/cv` |
| `dev/portfolio/VMNunez/README.md` (**separate repo**, never committed from here) | `/profile-readme` (`sync` / `optimize`) · `/portfolio-audit` on a ✅ Ready verdict — two writers, two triggers | recruiters; the profile repo's own adapter carries the gap list |
| `practice/sql/PLANNING.md` (doctrine) | `/sql-plan-audit` · the grader's §0 rewrite · `sql-step-close` (§0 verify) · `/sql-plan` did the one-time split that created it | every SQL prompt and skill · `/simulation-plan` and `/simulation-generator` (§8/§8c closed-step fence) |
| `notes/prompts/knowledge/coverage/_internal/_cross-topic-inbox.md` | any coverage run · `coverage-bullet-add` (a concept another topic owns) | `/coverage` (its own heading, Step 1) · `/coverage-audit` (all headings) |
| `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` (route) | `/sql-plan` (creates) · `/sql-plan-audit` (extends) · `sql-grade`'s subagent (counts/status) | `/sql-exercises`, `sql-block-open` |
| `practice/sql/MISTAKES.md` | `sql-grade`'s subagent (`## Open`) · `sql-block-close` (`## Fricción`) | the R1–R5 revision points |
| `practice/sql/{LEVEL}/NN-*.sql` | **Victor** (the grader only appends `-- ✅ Corregido`) | `sql-grade` |
| `practice/simulations/PLANNING.md` (doctrine) | `/simulation-plan` (creates once) · `/simulation-generator`, `/simulation-review`, `simulation-block-close` (§0/state only) | every simulation prompt and skill |
| `practice/simulations/{LEVEL}/PLANNING-{LEVEL}.md` (route) | `/simulation-plan` (creates/reconciles + reinforcement steps) · `/simulation-generator` (generation/state) · `/simulation-review` (verdict/correction/redemption/history) · `simulation-block-close` (attempt handoff) | every simulation prompt and skill · `/progress-update` |
| `practice/simulations/{type}/NN-*.md` (spec) | `/simulation-generator` (whole spec) · `simulation-block-close` and `/simulation-review` (attempt header only) | Victor · `simulation-block-open` · `simulation-grade` / `/simulation-review` |
| `practice/simulations/TRACKER.md` | `/simulation-generator` (rows) · `simulation-block-close` (self-assessment/attempt) · `/simulation-review` (status/history) | `/simulation-plan`, `/progress-update`, every simulation skill |
| `practice/simulations/MISTAKES.md` | `/simulation-review` (graded gaps/corrections) · `simulation-block-close` (friction) | `/simulation-plan`, `simulation-block-open`, `simulation-grade`, revision points |
| `practice/interview/MISTAKES.md` | `/simulator` · `/hr-screen` · `/code-review-practice` (their own performance gaps) | the same three prompts, each consuming only its own surface rows |
| `notes/prompts/_internal/_job-market-evidence.md` | `/evidence-intake` · `/cv tailor` | `/coverage`, `/coverage-audit`, `/interview-prep-audit`, `/interview-prep-route` |
| `notes/prompts/_internal/_run-tracker.md` | every prompt's close-out · **`coverage-bullet-add`** (the one skill that writes here) | you, `/system-check`, and prompts that gate on it |
| `notes/prompts/_internal/_skill-friction.md` | any of the seventeen skills, only when the shared session contract's observable failed-step trigger fires · either self-report close-out changes only `Disposition` during serialized reconciliation | both self-report close-outs (every `open` row, before their own recommendations) · `/system-check` |
| `notes/prompts/README.md` **and this file** | whoever changes the machinery, **in the same commit** (including an approved prompt self-refinement) · the `map-sync` ritual, which walks both triggers · `/system-check`, the only prompt whose primary work is auditing both maps · never a build step | anyone orienting in the system — which is why a wrong row is worse than a missing one |
| `notes/prompts/system/_internal/_system-check-report.md` | `/system-check` only, overwritten on each explicit run | Victor; the next `/system-check`; later whole-system refinement work |
| `notes/prompts/_internal/_session-rules.md` (+ the two thin platform adapters that delegate to it) | **whoever changes the session contract, by hand** — §1's commit boundary names the session-rule files themselves, so it commits directly. Never a prompt, never a skill, never a build step | every session at start, through the platform adapter that delegates to it; 15 of the 30 prompts also name it directly. It **outranks this map** |
| `notes/prompts/_internal/_recommendation-ledger.md` | **every close-out that produced a recommendation**, reconciling it into `## Open` before the report's bullets are written · `/system-check` for cross-system audit findings · whoever resolves an item, collapsing it into `## Closed` and promoting any rule it established into the preamble | whoever picks up the next item; `/system-check` includes its open/accepted rows in the operational-debt queue. It is the current status source — a historical report is immutable evidence and its wording never overrides it |
| `{family}/_internal/_last-run-report*.md` | **its own prompt's close-out only** — one per runnable prompt, **overwritten** each run, never appended, and committed together with `_run-tracker.md` | that same prompt's step 0 run-start check (via the `Status:` line), and the ledger reconciliation |
| `notes/prompts/_internal/validate-prompt-system.ps1` | whoever changes the machinery, in the same commit as the invariant it checks | run by hand and by `/system-check` before and after its semantic audit — see §12. The only automated check in the system |
| `notes/prompts/_internal/_shared-context.md` | **by hand.** No prompt writes it; the market file beside it (`_job-market-evidence.md`) is the one that gets fed automatically | almost every prompt. `_session-rules.md`'s "Who I am" bullets are its condensed copy, so the two drift apart unless they are edited together |
| `notes/prompts/knowledge/coverage/_internal/_topic-ownership.md` | **by hand, through its own admission contract, with explicit authorization.** A coverage run that meets an unregistered topic **stops** — it never infers a boundary and never registers one silently | `/coverage`, `/coverage-audit`, `/roadmap-review`, `coverage-bullet-add` (altitude routing), and every prompt whose `TOPIC` field reads "one registered topic" |
| `personal/job-search/**` (**outside the repo**, never committed from here) | `/cv` (`master/`, `applications/`) · `/tracker` (`tracker.csv`, `applications/<empresa>-<puesto>/`) | the whole apply family — `/cv`, `/cover-letter` and `/linkedin` through `_application-standard.md`, `/profile-readme` for `internship-daw.md`. Existence proves nothing here: a close-out checks the **mtime is from this run** |

---

## 8 — `PROGRESS.md`, section by section

This is the file you asked about, and the one where "who writes it" is least obvious. The rule since
2026-08-05: **`/progress-update` is an auditor, not this file's writer.** It writes one table and
*measures* the rest, reporting drift and naming the ritual that owns the repair.

| Section | Its writer | Notes |
|---|---|---|
| `## Professional level by topic` | **`/progress-update`** — the only writer of the table | needs all 13 topics at once, which no ritual can compute. `step-complete` / `backlog-task-close` may update a single **evidence cell** when a step or fix earns it |
| `## Coverage demonstrated` | **`/coverage`, `coverage-mark`, and `coverage-bullet-add`** | each **recounts** the affected cells and the `Total` row from the coverage files when it changes scope or markers. `step-complete` deliberately does **not** touch this table: a memory-derived copy would overwrite the recounted one |
| `## Study progress` | **`study-block-close`** | notes dates and bilingual `[refined] [studied]` IDs are primary state; the current route supplies the CORE denominator. This section rolls up Notes + CORE + full bank per level; `/progress-update` measures it as D9 and reports drift |
| `## Projects` | **`step-complete`** / **`backlog-task-close`** (the `Status` cell) | the row itself is created by `/plan-audit MODE = new` |
| `## Practice completed → Exercise route` | **`sql-grade`'s cold subagent** | `sql-step-close` re-checks that the `Total` rows still add up. The `Corrected` total cell stays blank by design |
| `→ Timed simulations` | **`/simulation-review`** | counted by explicit level + track from `practice/simulations/TRACKER.md`; `/progress-update` audits it |
| `→ LeetCode` | nothing yet — gated behind the ROADMAP gates | |

**No concept lists.** The per-technology concept sections were deleted on 2026-08-03 because they were
an evidence-free second copy of the coverage files. A concept goes to `notes/{topic}/coverage/{level}.md`
and nowhere else; only its *effect* on level, percentage or project status is recorded here.

---

## 9 — The skills, one row each

All seventeen are mirrored in `.claude/skills/` and `.agents/skills/`; **editing one means writing the
identical file to the other in the same commit.**

| Skill | Fires when | What it writes | Hands off to |
|---|---|---|---|
| `step-complete` | a learning-plan step is finished | the done-condition check (gate **G1**'s real trigger) · `PLANNING.md` ✅ · `PLANNING.md` **§0** repointed at the next step · `PROGRESS.md` Projects row **and the `Professional level by topic` evidence cell** when the step earns it (§8) | `coverage-bullet-add`, `coverage-mark`, `readme-concept-add` |
| `coverage-bullet-add` | a step/task taught a concept the checklist lacks | the bullet, in **both** coverage files, routed by **altitude** via `_topic-ownership.md` · a cross-topic proposal in `_cross-topic-inbox.md` when another topic owns it · the `⚠ stale` flag in `_run-tracker.md` · recounts `PROGRESS.md` `Coverage demonstrated` after a bullet write | reports the `/notes-plan` remap it owes |
| `coverage-mark` | a concept was applied in project code | ` ✅ NN-slug — {evidence}` on the existing bullet, both files · recounts `Coverage demonstrated` | — |
| `readme-concept-add` | same event, README side | one entry, routed **by audience** to the global / backend / frontend README | — |
| `backlog-task-open` | Victor picks up a backlog task | only a `⏸ Deferred YYYY-MM-DD — reason` marker, and only on that verdict | the teach-first explanation, or `backlog-task-close` |
| `backlog-task-close` | a backlog task is done | coverage bullet + marker · README entry · `PLANNING.md` rules + §0 · `PROGRESS.md` · collapses the task into the `## Closed` ledger | `coverage-bullet-add`, `coverage-mark`, `readme-concept-add` |
| `study-content-writer` | refining an existing complete note or writing/refining Q&A **outside** the audit prompts | note EN/ES + studied reset · unrefined stable-ID Q&A · `[refined]` only on Victor's explicit acceptance · explicit reopen clears both Q&A state markers | `/notes-plan` + `/notes-audit` when the note is missing/pending; `study-block-close` after active recall |
| `interview-prep-block-open` | Victor starts or continues interview-prep active recall | **nothing — read-only**; resolves current CORE, accepts dictation/text, grades PASS/BORDERLINE/FAIL | `study-block-close` with exact final-PASS IDs |
| `study-block-close` | Victor ends the 13:30 notes/interview-prep block | notes-plan `Studied` dates · exact refined bilingual Q&A `[studied]` markers after PASS · `PROGRESS.md` Notes/CORE/bank study rows | — |
| `sql-block-open` | the 12:30 block starts | **nothing — read-only** | — |
| `sql-grade` | "corrige el 02" | nothing directly; a **cold subagent** writes `MISTAKES.md`, `PROGRESS.md`, the route, the doctrine §0 | `sql-step-close` on ≥ 80% + last file |
| `sql-step-close` | a step's last file scores ≥ 80% | `✅ sql:{file-slug}` drill markers on coverage + mirror · §0 verify · `Total` arithmetic · the §8c unlocked line | names the due gate / revision point |
| `sql-block-close` | the block ends | `MISTAKES.md` `## Fricción` only | — |
| `simulation-block-open` | a timed-simulation block starts | **nothing — read-only**; verifies manifest + progress snapshot | `/simulation-plan` on drift, else the one current route moment |
| `simulation-grade` | a planned attempt/correction is ready | nothing directly; one cold subagent executes `/simulation-review` and its tracking/correction writes | correction loop or next route step |
| `simulation-block-close` | the timer/block ends | explicit attempted/Assisted handoff in doctrine/route/spec/TRACKER · simulation `MISTAKES.md` friction already stated | `simulation-grade` |
| `map-sync` | machinery changed **or** a prompt / `SKILL.md` / standard / other `_internal/` file was read whole | the rows about *that* file in `README.md` and this map — every one of them, not the first that comes to mind · nothing else | — |

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
  and not the other has introduced drift that nothing announces.
- **A gate closes on an empty drift report, not on the run having happened.** True for G6
  (`progress-update` in a project) and G3 (after the SQL level's last step).
- **`PROJECT-BACKLOG.md` auto-commits in any flow**, not just inside `/review-audit` — the file is
  written by the review prompt and the two backlog skills, never by Victor.
- **A skill edited in one adapter is edited in both, in the same commit.** They drifted silently once
  (2026-07-30 → 2026-08-01) and Codex ran a ritual two revisions old. `diff` the pair before committing.
- **The recorded-debt sweep is explicit, not continuous.** `/system-check` reads tracker flags, open or
  accepted recommendations, project backlog priorities/deferred markers and due project/SQL gates into
  one owner-routed queue. It reports and prioritises them; it never clears another owner's debt.
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
| a project is built but never reviewed | `/readme-audit` → `/review-audit` → `/portfolio-audit` |
| a step was finished and nothing was recorded | the `step-complete` ritual, walked by hand against §9 |
| a row here contradicts the prompt or skill it describes | the `map-sync` ritual — **the machinery wins**; fix the row, never the file |
| `_skill-friction.md` has an `open` row | run any runnable prompt; its close-out adjudicates the row before its own recommendations |
| a prompt or skill was added, renamed or retired · a path may have gone dead · a map may never have learned the machinery exists | `_internal/validate-prompt-system.ps1` (§12) — the only check that can see a **non**-firing `map-sync` |
| after substantial machinery changes, you need every prompt/skill claim and recorded debt checked together | `/system-check` — explicit global audit; never an ordinary-commit gate |

---

## 12 — How the system improves itself

Every section above describes machinery that **runs**. This one describes the loop that **changes** it,
which is the half no prompt can state about itself: **prompts are frozen by design.** Both self-report
contracts open on that rule — a report showing a real failure is the only thing that reopens a prompt —
and `_session-rules.md` says the same to the session: *"The system is built — run the prompts, don't keep
editing them."* So an edit is never a decision someone makes; it is the last
step of a chain that starts with a run, and every link exists because the previous one was skipped once.

1. **A run ends by executing its self-report contract** — five bullets for the seventeen orchestrators
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
5. **A cold reviewer — mandatory, no exceptions.** The drafted edit goes to one cold subagent with four
   inputs, the fourth being **the whole prompt file read to EOF**, which is what makes condition 4 and
   the contradiction check answerable at all. It returns `approve` / `approve-with-tightening` / `reject`, and only what it
   approves is applied. A reject — or a reviewer that could not be dispatched — leaves the finding
   `open`: a postponed finding is recoverable through its `Status` line, a self-approved bad edit is not.
   **The verdict line is the only trace the gate ran**; an applied edit without one is indistinguishable
   on disk from a self-approval and must be read as one.
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
which is why the read trigger exists at all. Nor does it repair: on the fingerprint contract it prints
`REPORT:` for a `stale` plan whose digest still matches, because clearing that flag without running
`/notes-plan` is the lie the flag exists to prevent — but a plan claiming `current` against a moved
fingerprint **fails the run**.

### The explicit semantic sweep

`/system-check` complements the validator and `map-sync`; it replaces neither. When Victor launches it
after substantial machinery changes, cold family manifests read the complete prompt/skill system to EOF,
the orchestrator reconciles every relevant claim in both maps, a cold final reviewer gates the global
verdict, and the run writes the durable system-check report plus an owner-routed debt queue. It may correct
the two derived maps and file recommendations, but never edits source machinery or clears recorded debt.
Because it is token-intensive, it is **explicit only** — never scheduled, inferred, or run per commit.
