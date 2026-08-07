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
| `notes/prompts/README.md` | the prompt catalogue: what each of the 28 prompts reads and generates, batch mode, run order |
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
nobody opens stay unverified — a gap that needs a sweep nobody has built yet (`REC-056`, `REC-054`), not
one this rule can be read as covering.

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
| Unit of work | one topic+level, one project, one note pair | one step, one task, one file, one block |
| Questions | config up front, then hands-off to the end | **zero, by design** — a ritual that asks stops being run |
| Depth | fans out cold subagents, one per concern | one pass down a mechanical checklist |
| Trace it leaves | `_last-run-report*.md` + a row in `_run-tracker.md` | only the files of the ritual itself |

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
run). **Anything Victor produces himself** — project code, the `.sql` exercises, and everything *else*
under `practice/` (simulations, leetcode) — is never auto-committed; the agent only prints the commands.
The word doing the work is *himself*: the SQL plan files and `MISTAKES.md` also live under `practice/`
and are the system's, not his. Full rule in `_session-rules.md`.

---

## 2 — The chains at a glance

```
                     _job-market-evidence.md ◄── evidence-intake · cv tailor
                              │
                              ▼
  A. KNOWLEDGE   /coverage ─► /coverage-verify ─► /notes-plan ─► /notes-audit ─► en+es pair
                     │                                  ▲              │
                     │                        (⚠ stale flag)     /interview-prep-audit
                     │                                  │              │
                     │              coverage-bullet-add ┘   /notes-and-interview-prep
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
```

---

## 3 — Chain A: knowledge (coverage → notes → Q&A)

The root of everything. Coverage defines *what junior means*; every other chain consumes it.

1. **`/coverage {topic} {level}`** — defines or refreshes the scope of one topic at one level, anchored
   to real job postings in `_job-market-evidence.md`.
   → writes `notes/{topic}/coverage/{LEVEL}.md` **and its global mirror** `notes/coverage/{LEVEL}.md`
   (every coverage writer writes both), files gaps owned by other topics into `_cross-topic-inbox.md`,
   and stamps `Plan status: stale` on every notes plan whose fingerprint it just invalidated.

2. **`/coverage-verify {topic} {level}`** — a cold reviewer checks that scope is *complete* for the job
   target, including the earlier levels it depends on.
   → writes `notes/{topic}/coverage/verify-{LEVEL}.md` (verdict + gaps). **Advisory**: a `gaps` verdict
   never blocks step 3. The gaps feed back into a `/coverage` update run — that is the loop you meant
   by "si encuentra gaps se ejecuta coverage otra vez".

3. **`/notes-plan {topic} {level}`** — turns the checklist into a study map: which note file teaches
   which bullet, in what order, each bullet mapped **exactly once**.
   → writes `notes/{topic}/coverage/notes-plan-{LEVEL}.md`, carrying a `Coverage SHA-256` fingerprint of
   the coverage file it was built from. It writes no prose.

4. **`/notes-audit {topic} {level} {note}`** — builds **one** planned file pair through four cold stages
   (English author → English reviewer → translator → Spanish reviewer).
   → writes `notes/{topic}/{level}/en/NN-*.md` + `es/NN-*.md`, marks that entry's concepts `[x]` in the
   plan, and commits the three atomically. Repeat once per pending entry until the plan is all
   `complete` / `refined`. It refuses to run on a plan whose fingerprint is stale — that is why step 3
   is not optional.

5. **`/interview-prep-audit {level} {topic}`** — the Q&A bank for that topic and level. Its prerequisite
   is the **whole** notes plan being complete, not one note.
   → writes `notes/interview-prep/{LEVEL}/en/*.md` + `es/*.md`.

6. **`/notes-and-interview-prep {topic}`** — reconciles notes ↔ Q&A in both directions once both exist.

7. **When every topic has that level: `/coverage-audit {level}`** — the convergence pass over the global
   mirror (level boundaries, missing topics, ownership overlaps) — **then `/roadmap-review`**.

**In-session on this chain:** the `study-content-writer` skill. The quality standard only auto-loads
inside `/notes-audit`, so any note or Q&A written *outside* those runs would silently miss the bar; this
skill loads it, writes the `en/` + `es/` pair to that bar and commits it. It does **not** touch the notes
plan — a note written this way leaves its plan entry untouched, which is the one thing `/notes-audit`
does that this does not.

**The sideways door: `_cross-topic-inbox.md`.** When any coverage run — or `coverage-bullet-add` in a
daily session — finds a concept owned by a *different* topic, it never writes into that topic's file. It
files a proposal under that topic's heading in
`notes/prompts/knowledge/coverage/_internal/_cross-topic-inbox.md`. Each `/coverage` run reads its own
heading at Step 1 and clears what it consumed; `/coverage-audit` sweeps every heading. This is the only
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
7. **`/simulation-generator TYPE = sql`** may only use techniques from **closed** steps.
8. **After the level's last step:** gate **G3** `/progress-update`, then **G4** `/roadmap-review`, then
   `/sql-plan middle`.

---

## 6 — Chain D: apply (and how the loop closes)

`/portfolio-audit` → `notes/cv/cv-bullets.md` → **`/cv`** (one-page Spanish CV) · **`/linkedin`** ·
per offer: **`/cv tailor`** + **`/cover-letter`** → **`/tracker log`** → outcomes with `/tracker update`
→ **`/tracker analyze`** surfaces skill gaps → **`/evidence-intake`** turns real postings into
`_job-market-evidence.md` → which is what **`/coverage`** reads to decide what junior means.

That is the only closed loop in the system: what the market rejects you for becomes coverage scope.

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
| `notes/{topic}/coverage/notes-plan-{LEVEL}.md` | **`/notes-plan` only** — never by hand, never by a skill | `/notes-audit` (fingerprint gate), `/coverage`, `/interview-prep-audit` |
| `notes/{topic}/{level}/en|es/*.md` | `/notes-audit` · in session, guided by `study-content-writer` | `/notes-and-interview-prep`, Victor |
| `notes/interview-prep/{LEVEL}/en|es/*.md` | `/interview-prep-audit`, `/notes-and-interview-prep`, `/simulation-review`, `/code-review-practice` | `/simulator` |
| `notes/interview-prep/projects/*.md` | `/portfolio-audit` | `/simulator` |
| `PROGRESS.md` | **section by section — see §8** | `/plan-audit`, `/roadmap-review`, `/project-brief`, `/review-audit`, `/cv`, `/linkedin`, `/sql-exercises` |
| `ROADMAP.md` | `/roadmap-review` (+ `/plan-audit` marks the chosen project) | `/project-brief`, `/hr-screen`, the SQL gates |
| `projects/briefs/project-brief-{NN}.md` | `/project-brief` | `/plan-audit MODE = new` (refuses a stale one) |
| `{project}/PLANNING.md` | `/plan-audit` · `step-complete` (✅ + §0) · `backlog-task-close` (rules section + §0) | `/readme-audit`, `/review-audit`, `/portfolio-audit`, `/progress-update`, `/roadmap-review`, every session |
| `{project}/README.md` (+ backend/frontend) | `/readme-audit` (whole file) · `readme-concept-add` (one entry) | `/portfolio-audit`, recruiters |
| `{project}/PROJECT-BACKLOG.md` | `/review-audit` (tasks) · `backlog-task-open` (`⏸ Deferred`) · `backlog-task-close` (`## Closed`) | `/portfolio-audit` (open High/Medium block the verdict), every session start |
| `notes/cv/cv-bullets.md` | `/portfolio-audit` | `/cv` |
| `dev/portfolio/VMNunez/README.md` (**separate repo**, never committed from here) | `/profile-readme` (`sync` / `optimize`) · `/portfolio-audit` on a ✅ Ready verdict — two writers, two triggers | recruiters; the profile repo's own adapter carries the gap list |
| `practice/sql/PLANNING.md` (doctrine) | `/sql-plan-audit` · the grader's §0 rewrite · `sql-step-close` (§0 verify) · `/sql-plan` did the one-time split that created it | every SQL prompt and skill |
| `notes/prompts/knowledge/coverage/_internal/_cross-topic-inbox.md` | any coverage run · `coverage-bullet-add` (a concept another topic owns) | `/coverage` (its own heading, Step 1) · `/coverage-audit` (all headings) |
| `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` (route) | `/sql-plan` (creates) · `/sql-plan-audit` (extends) · `sql-grade`'s subagent (counts/status) | `/sql-exercises`, `sql-block-open`, `/simulation-generator` |
| `practice/sql/MISTAKES.md` | `sql-grade`'s subagent (`## Open`) · `sql-block-close` (`## Fricción`) | the R1–R5 revision points |
| `practice/sql/{LEVEL}/NN-*.sql` | **Victor** (the grader only appends `-- ✅ Corregido`) | `sql-grade` |
| `practice/simulations/TRACKER.md` | `/simulation-generator` (rows) · `/simulation-review` (status) | `/progress-update`, `/simulation-review` |
| `notes/prompts/_internal/_job-market-evidence.md` | `/evidence-intake` · `/cv tailor` | `/coverage`, `/coverage-audit`, `/interview-prep-audit` |
| `notes/prompts/_internal/_run-tracker.md` | every prompt's close-out · **`coverage-bullet-add`** (the one skill that writes here) | you, and prompts that gate on it |
| `notes/prompts/README.md` **and this file** | whoever changes the machinery, **in the same commit** · the `map-sync` ritual, which walks both triggers · never a prompt, never a build step | anyone orienting in the system — which is why a wrong row is worse than a missing one |
| `notes/prompts/_internal/_session-rules.md` (+ the two thin platform adapters that delegate to it) | **whoever changes the session contract, by hand** — §1's commit boundary names the session-rule files themselves, so it commits directly. Never a prompt, never a skill, never a build step | every session at start, through the platform adapter that delegates to it; 13 of the 28 prompts also name it directly. It **outranks this map** |
| `notes/prompts/_internal/_recommendation-ledger.md` | **every close-out that produced a recommendation**, reconciling it into `## Open` before the report's bullets are written · whoever resolves an item, collapsing it into `## Closed` and promoting any rule it established into the preamble | whoever picks up the next item. It is the current status source — a historical report is immutable evidence and its wording never overrides it |
| `{family}/_internal/_last-run-report*.md` | **its own prompt's close-out only** — one per runnable prompt, **overwritten** each run, never appended, and committed together with `_run-tracker.md` | that same prompt's step 0 run-start check (via the `Status:` line), and the ledger reconciliation |
| `notes/prompts/_internal/validate-prompt-system.ps1` | whoever changes the machinery, in the same commit as the invariant it checks | run by hand — see §12. The only automated check in the system |
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
| `## Coverage demonstrated` | **`coverage-mark` and `coverage-bullet-add`** | they **recount** their cells and the `Total` row from the coverage files with each write. `step-complete` deliberately does **not** touch this table: two writers means the memory-derived copy overwrites the recounted one |
| `## Projects` | **`step-complete`** / **`backlog-task-close`** (the `Status` cell) | the row itself is created by `/plan-audit MODE = new` |
| `## Practice completed → Exercise route` | **`sql-grade`'s cold subagent** | `sql-step-close` re-checks that the `Total` rows still add up. The `Corrected` total cell stays blank by design |
| `→ Timed simulations` | counted from `practice/simulations/TRACKER.md` | which `/simulation-generator` and `/simulation-review` write |
| `→ LeetCode` | nothing yet — gated behind the ROADMAP gates | |

**No concept lists.** The per-technology concept sections were deleted on 2026-08-03 because they were
an evidence-free second copy of the coverage files. A concept goes to `notes/{topic}/coverage/{level}.md`
and nowhere else; only its *effect* on level, percentage or project status is recorded here.

---

## 9 — The skills, one row each

All twelve are mirrored in `.claude/skills/` and `.agents/skills/`; **editing one means writing the
identical file to the other in the same commit.**

| Skill | Fires when | What it writes | Hands off to |
|---|---|---|---|
| `step-complete` | a learning-plan step is finished | the done-condition check (gate **G1**'s real trigger) · `PLANNING.md` ✅ · `PLANNING.md` **§0** repointed at the next step · `PROGRESS.md` Projects row **and the `Professional level by topic` evidence cell** when the step earns it (§8) | `coverage-bullet-add`, `coverage-mark`, `readme-concept-add` |
| `coverage-bullet-add` | a step/task taught a concept the checklist lacks | the bullet, in **both** coverage files, routed by **altitude** via `_topic-ownership.md` · the `⚠ stale` flag in `_run-tracker.md` | reports the `/notes-plan` remap it owes |
| `coverage-mark` | a concept was applied in project code | ` ✅ NN-slug — {evidence}` on the existing bullet, both files · recounts `Coverage demonstrated` | — |
| `readme-concept-add` | same event, README side | one entry, routed **by audience** to the global / backend / frontend README | — |
| `backlog-task-open` | Victor picks up a backlog task | only a `⏸ Deferred YYYY-MM-DD — reason` marker, and only on that verdict | the teach-first explanation, or `backlog-task-close` |
| `backlog-task-close` | a backlog task is done | coverage bullet + marker · README entry · `PLANNING.md` rules + §0 · `PROGRESS.md` · collapses the task into the `## Closed` ledger | `coverage-bullet-add`, `coverage-mark`, `readme-concept-add` |
| `study-content-writer` | writing a note or Q&A **outside** the audit prompts | the `en/` + `es/` files themselves, to the same bar the pipeline would, and it commits them | — |
| `sql-block-open` | the 12:30 block starts | **nothing — read-only** | — |
| `sql-grade` | "corrige el 02" | nothing directly; a **cold subagent** writes `MISTAKES.md`, `PROGRESS.md`, the route, the doctrine §0 | `sql-step-close` on ≥ 80% + last file |
| `sql-step-close` | a step's last file scores ≥ 80% | `✅ sql:{file-slug}` drill markers on coverage + mirror · §0 verify · `Total` arithmetic · the §8c unlocked line | names the due gate / revision point |
| `sql-block-close` | the block ends | `MISTAKES.md` `## Fricción` only | — |
| `map-sync` | machinery changed **or** a prompt / `SKILL.md` / standard was read whole | the rows about *that* file in `README.md` and this map — every one of them, not the first that comes to mind · nothing else | — |

**Rituals ask zero questions.** That is a design rule, not a style: a manual gate in the middle of a
mechanical ritual is how the ritual stops being run. A step that cannot close is *reported* and left
open, never blocked on an answer.

---

## 10 — The debts, flags and gotchas

The things a run leaves behind that are easy to miss.

- **Every runnable prompt writes two extra files**: `_last-run-report*.md` in its own `_internal/`
  folder, and its row in `_internal/_run-tracker.md`. They are auto-committed together, and they are what
  feeds the improvement loop (**§12**) — the evidence that decides whether a frozen prompt gets reopened.
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
| a project is built but never reviewed | `/readme-audit` → `/review-audit` → `/portfolio-audit` |
| a step was finished and nothing was recorded | the `step-complete` ritual, walked by hand against §9 |
| a row here contradicts the prompt or skill it describes | the `map-sync` ritual — **the machinery wins**; fix the row, never the file |
| a prompt or skill was added, renamed or retired · a path may have gone dead · a map may never have learned the machinery exists | `_internal/validate-prompt-system.ps1` (§12) — the only check that can see a **non**-firing `map-sync` |

---

## 12 — How the system improves itself

Every section above describes machinery that **runs**. This one describes the loop that **changes** it,
which is the half no prompt can state about itself: **prompts are frozen by design.** Both self-report
contracts open on that rule — a report showing a real failure is the only thing that reopens a prompt —
and `_session-rules.md` says the same to the session: *"The system is built — run the prompts, don't keep
editing them."* So an edit is never a decision someone makes; it is the last
step of a chain that starts with a run, and every link exists because the previous one was skipped once.

1. **A run ends by executing its self-report contract** — five bullets for the sixteen orchestrators
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

**The skills have no half of this.** A prompt run leaves a report, a tracker row and a ledger row; a
skill writes only the files of its ritual (§1), so a defective one can run for months and produce no
evidence at all. Both known cases surfaced because a human asked, not because the system noticed. That
asymmetry is a real gap with no owner yet — `REC-058`.

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
