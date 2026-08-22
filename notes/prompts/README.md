# Prompts — the study system

All prompts live in `notes/prompts/`, grouped by purpose. **They run in separate conversations,
never in the main daily session** — you fill in the configuration block at the top of a prompt,
paste it into a fresh chat, and it does one job. Update the project list inside each prompt as new
projects are completed.

> **▶ Run first.** Every runnable prompt opens with a `▶ Run first` line naming the prompt you must run
> before it (or `nothing`). You never have to cross-check the dependency map below before running one —
> the prompt tells you at the top.

This file is the navigable prompt catalogue and run-order entry point. For every prompt, the public
interface index, its family catalogue row and the run-order sections together own the command, run-first prerequisite,
configuration/modes and received inputs, reads, writes/returns, dispatched roles/isolation, commit
owner, handoffs/gates, and explicit exclusions. `/system-check` audits those fields against the
canonical machinery; the catalogue is derived and never overrides the prompt it describes.

> **Resolving machinery work? Read both maps whole first.** Before analysing or changing any prompt,
> skill, standard, launcher, validator, platform adapter or either map, read this README together with
> `_internal/_system-map.md`. They provide the catalogue and wiring context as one pair; then read the
> affected source machinery, which remains authoritative. `_internal/_session-rules.md` owns this
> orientation gate.

> **Prompts *and* skills in one wiring diagram → `_internal/_system-map.md`.** This README owns the
> per-prompt facts for the 31 runnable prompts. The system map owns the per-skill facts for the
> in-session rituals (`step-complete`, `coverage-mark`,
> `study-block-close`, `sql-grade`…), the per-file writer registry, `PROGRESS.md` section by section, the debts and
> observable skill failures a run leaves behind, and the improvement loop itself — why machinery is
> reopened from evidence (§12).
> Start there when the question is *"who writes this file?"* rather than *"what does this prompt do?"*.

> **Shared runtime context.** Every session starts from its thin platform adapter (`CLAUDE.md` or
> `AGENTS.md`), which delegates to `_internal/_session-rules.md`. Runnable prompts also read
> `_internal/_agent-runtime-standard.md`; almost all read `_internal/_shared-context.md`.

---

## Platform adapters

The workflow files in `notes/prompts/` are canonical and platform-neutral. They name roles
(`author`, `reviewer`, `analyst`, `orchestrator`, `mechanical checker`), reasoning tiers
(`deep`, `standard`, `mechanical`), and execution modes (`parallel`, `sequential`, `foreground`).
`_internal/_agent-runtime-standard.md` maps those terms to each runtime:

- **Claude Code:** launch from `.claude/commands/`; its adapter selects an available Claude model for
  each canonical reasoning tier.
- **Codex:** launch from `.codex/commands/`; its adapter uses Codex collaboration tools and does not
  invent model identifiers.
- **Direct paste:** paste the canonical prompt into a supported runtime; it reads the runtime standard
  before dispatching any role.

Both launcher catalogs contain exactly 31 files and must reference the same 31 canonical entry points.
Run `_internal/validate-prompt-system.ps1` after adding, removing, or renaming a prompt — and after
editing a skill, a coverage file, a notes plan, or any file another file points at, since it also
checks nine invariants nothing else can see: that both catalogues advertise the **same** arguments for a
command and that every key a launcher advertises is one the canonical prompt's own `## Configuration`
block accepts, in both directions — a key the prompt accepts and neither launcher mentions fails too,
while an optional derived key explained in a launcher's `Rules` instead of its `argument-hint` passes.
Its **values** are checked only where both sides state a closed set of bare tokens, which is 44 of the
85 keys; the rest are metavariables or free-form fields (`EMPRESA`, `<path>`) the two files legitimately
word differently, plus a few — `sql-exercises`'s `TOPIC`, `cv`'s `PROJECTS` — where one side spells the
list out and the other does not, so a dropped value there is **not** caught. The PASS line prints all
three counts, so the reach of the check is read off the line rather than assumed. It also checks that
`.claude/skills/` and `.agents/skills/` hold the same files with the same content (compared line-ending-normalised, because `core.autocrlf` decides
whether a working-tree file holds CRLF or LF, not its author); that every
`notes/{topic}/coverage/{LEVEL}.md` and its section of `notes/coverage/{LEVEL}.md` carry the same
bullets; that each plan's `Plan status` agrees with its `Coverage SHA-256` — in all three shapes that
contract takes: a topic's `notes-plan-{LEVEL}.md`, a SQL route's `PLANNING-{LEVEL}.md`, and a simulation
route, which fingerprints a **manifest** of every coverage file in its §1 rather than one file and also
carries a `Progress snapshot` of `PROGRESS.md` and a `Level status`, so a moved snapshot reports rather
than fails; that a `verify-{LEVEL}.md` claiming `complete` or `gaps` against a moved digest is reported
under the schema's own word for that state, `superseded`; and that every path a
prompt, skill or adapter names resolves — against the repository root **or** against `notes/prompts/`,
both of which are legitimate forms here; that a **declared** output path is a real file name and not
merely a well-formed one — a file a prompt has not written yet cannot be required to exist, so it is
exempted from that resolution by *shape*, and shape passed `03-jions.sql` exactly as readily as
`03-joins.sql`, which matters because `sql-exercises-prompt.md` restates the route's file list twice
— under the `FILE` key and in its junior path table — and **at junior** a run cross-checks the
`{FILE}` it resolved from `PLANNING-junior.md` §1 against that table; no projection of the middle or
senior routes is kept there, so nothing cross-checks theirs. The 50 declared SQL exercise references
are checked against the 20 file names in their level's own `PLANNING-{LEVEL}.md` §1, harvested from
its table **rows** because that section holds two tables whose headers are in different languages and
its prose legitimately names
retired files. It runs one direction only — a route file nothing cites is not a defect — and the PASS
line prints the names harvested, the references checked and the references it **could not** check. That
last count is the reach: a level with no route on disk would have nothing to compare against and prints
`REPORT:` rather than passing quietly — `middle` and `senior` have no route today, so the count reads `0`
until something cites them. Three limits stay uncovered, and are named here rather than left to be
assumed: the 15 simulation specs under `practice/simulations/{track}/`, which have no route file on disk
to check against at all; the `_last-run-report*` family, exempted by filename alone — 24 distinct report
names are cited against 12 that exist, and the mapping from a report's name to the prompt that writes it
is defined nowhere, so a typo there is invisible; and **casing on a path that does exist**, since
`Test-Path` on Windows is case-insensitive, so `01-Basics.sql` resolves against `01-basics.sql` and only
a case-sensitive filesystem would notice. This invariant is **skipped** under `-MachineryOnly`: what it
blocks on is a machinery file, but its oracle is a live route, and the switch exists so live plan and
route state cannot block `/system-check`. And that **a self-report claiming an applied edit carries the
cold-review verdict line**: `_system-map.md` §12 step 5 makes that line the only trace the quality gate
ran, and nothing used to look for it, so the one rule that stops a saturated context from editing a
prompt on its own say-so was checked only by the context it constrains. Every `_last-run-report*.md`
under `notes/prompts/` must carry a parseable `Status:` **field** — a report without one would leave the
population in silence — and one whose field reads `applied in <hash>` must also carry
`cold reviewer: approve | approve-with-tightening | reject`. The field is matched as a field and not as a
substring, because report prose legitimately quotes it, and its **value** is the closed set `clean` ·
`open` · `rejected` · `applied in <hash>` rather than a free field — `Status: applied (commit abc)` would otherwise leave the population
with no error at all. The verdict is matched with **one optional wrap allowed per seam** of the token,
because it is written five ways — on its own line, inline in the `Status:` field, indented and bolded
inside a bullet, backticked mid-paragraph, and split across a hard line break at ~100 columns. One wrap
and no more: healing the file by flattening every newline instead makes a paragraph that ends "…went to
the cold reviewer:" and a next one opening "approve" into a passing gate. Prose is not the trace: "two
cold reviews passed" does not count, since accepting it would trade a bounded test for a judgement about
English. The PASS line prints reports scanned and reports claiming `applied`, the second being the reach.
**Three limits, named rather than assumed:** it proves the token is *present*, never that a reviewer ran
— a hand-typed line passes, and so does a report that quotes this contract verbatim; where a `Status:`
names two hashes it cannot say which edit the verdict covers; and the token is matched
**case-sensitively**, so a sentence-initial `Cold reviewer:` fails the run rather than passing it. It
does **not** close the
`_last-run-report*` path limit above, which is about report names that are cited and do not exist. It is
**not** skipped under `-MachineryOnly` — the object under test and the oracle are the same machinery
file — which is the opposite answer to the declared-exercise check above, reached by the same test: the
oracle decides the mode, not the file that would fail. And that **both maps know the machinery exists** — every skill
directory has a row in `_system-map.md` §9 and the reverse, §9's spelled-out count matches the
directories on disk, and every runnable prompt is named somewhere in the map and has an entry in this
file. That last one is the only layer that catches a *non-firing*: the two-map rule and the `map-sync`
ritual both depend on someone noticing, so nothing else can see machinery that was added while a map
never learned of it. It cannot tell whether a cell is *true* — only reading the file it describes can do
that — and it found `profile-readme` missing from every section of the map on its first run. The
fingerprint one **reports and never repairs**: clearing a stale flag without running `/notes-plan` is the
lie the flag exists to prevent, so a disagreement prints as `REPORT:` and only a plan claiming `current`
against a moved fingerprint fails the run.

And that **every line in `_internal/_recommendation-ledger-closed.md` carries the closure schema its own
header states** — one physical line per resolved `REC-NNN`, ordered by ID, ending in an implementation
commit hash or an em dash where the closure implemented nothing, never a `{commit}` template; a two-map
declaration from `REC-058` on, which is where the field becomes continuous on disk; and, from `REC-107`
on **and only where the line names a real commit**, a `cold reviewer:` field reaching `approve` or
`approve-with-tightening` — a rejection gates no edit and owes no reviewer. No ID may be open in
`_recommendation-ledger.md` and closed here at once. Until this check nothing read that schema, though
three files state it, which is how the 2026-08-18 collapse left six rejected rows carrying the literal
`{commit}`. Two published limits and one deliberate non-gate: it proves the fields are **present**, never
that a reviewer ran or that the hash names the edit — invariant 8's limit over the self-reports, reached
again here; a row that applied an edit and wrote the em dash escapes the verdict requirement, and nothing
on the line can settle that; and step 4's **one line plus at most one promotion** budget is *reported* as
a character count beside the longest row, never enforced — 700 sits above today's 90th percentile (662)
and below the thousand-character closures that budget was written against, so the number moves before
the file is visibly growing again. Like invariant 8 it is **not** skipped under `-MachineryOnly`: the
object under test and the oracle are the same machinery file.

`/system-check` invokes the same validator with `-MachineryOnly`: prompt/launcher/skill/path/map/report/ledger
invariants still block — the last two of those being the cold-review verdict check and the closed-ledger
schema check, whose oracles are machinery files — while the live coverage-mirror, the plan/route fingerprint checks and the
declared-exercise-name cross-check are explicitly skipped — the last of those because its oracle is a
live route even though the file it would fail is machinery. Ordinary manual runs omit the switch and retain the full operational checks above.

---

## Prompts you launch vs. internal pieces you never touch

Most files in this folder are `.md` prompt-system artifacts, but **not every Markdown file is
something you run**; the validator is the one `.ps1` utility. One filename rule separates runnable
Markdown entry points from internal Markdown:

> **A leading `_` means "never launch this".** No underscore, and it is yours to run.

**Every folder keeps its internal pieces in an `_internal/` subfolder** (2026-07-22) — the thirteen families
and this root, which holds the shared session/runtime contracts, preflight, the recommendation ledger and
its resolution doctrine, the skill-friction sink, self-report contracts, market context, batch rules and run tracker. Open any
folder under `notes/prompts/` and you see its runnable prompts and one `_internal/`, never a mix you
have to read prefixes to sort. Standards, subagent steps and `_last-run-report*.md` files all live
there; a new one goes in `_internal/` too, **including a report a pipeline has not written yet** — the
path a prompt is told to write to counts, not just the files already on disk. The `_` prefix stays on
the filenames anyway, so a file keeps its marking if it is ever moved or quoted out of context.

**Inside a supported agent runtime you do not need the rule at all: type `/` and the list is the answer.** Every
runnable prompt has a slash command and no internal file can have one, so the menu *is* the runnable
set — 31 launchers in each of `.claude/commands/` and `.codex/commands/`, one per prompt, kept at parity (completed 2026-07-22; before
that only the 11 orchestrators had one, which made the menu look like the whole system when it was
under half of it). **Adding a runnable prompt means adding its command in the same commit.**

- **Runnable — you launch these.** Fill in the config block at the top, paste it into a fresh
  conversation, or just use its slash command. **31 files, listed below.**
- **Internal — a runnable prompt reads and executes these as its own step**; none of them is part of
  your normal "paste into a new chat" workflow. Two kinds, both `_`-prefixed: **standards**
  (`_note-quality-standard.md`, `_review-standard.md`) — the shared rulebook a family of prompts reads
  — and **subagent steps** (`_notes-write-prompt.md`, `_plan-review-prompt.md`) — the author/reviewer
  slices an orchestrator (the `-audit.md` file in the same folder) fans out to automatically. Several
  subagent steps also document a **standalone** run you can paste yourself; what such a run may commit
  and what it still owes before its artefact lands is stated in that file's own intro, never here.

*(Made true on 2026-07-22: seventeen subagent steps were missing the prefix, so a folder like
`knowledge/notes/` looked like seven runnable prompts when only `notes-audit.md` is one.)*

### The 31 runnable prompts — each with its own slash command

**The command is the prompt's filename minus the `-prompt` suffix** — `coverage-prompt` → `/coverage`,
`progress-update-prompt` → `/progress-update`. Twenty-three of the 31 work that way; seven files carry no
`-prompt` suffix at all — the `*-audit.md` orchestrators — so their command *is* the filename
(`/review-audit`). That is a *filename* glob and not a command one: `/coverage-audit` also ends in
`-audit` and its file is `coverage-audit-prompt.md`, a suffix-drop like the other twenty-two. **One
deliberate exception, and it must not be "repaired":** `code-review-prompt` launches as
**`/code-review-practice`**, because `/code-review` is the host agent's own built-in diff review —
renaming it back re-collides with that command, and both launcher files state the reason in their own
rules block. So the rule above describes the naming, it never derives it: **a prompt's slash command is
read from its launcher's own filename**, and both catalogs are held to identical filenames, so
`.claude/commands/` and `.codex/commands/` give the same answer. `validate-prompt-system.ps1` reads it
that way, and falls back to dropping the suffix only for a prompt with no launcher at all — a state its
own catalog check already fails on.

**The slash is the launcher's.** Every `/name` token this system *defines* is a launcher file present in
both catalogues — that is what makes it derivable, and it is the guarantee the paragraph above exists to
protect. Two kinds of slash token are therefore not derivable from this rule and must not be read as
launchers: the host agent's own built-ins, of which `/code-review` above is the one this repo has to
name, and the in-session **skills**, which have no launcher file and are written bare in prose —
`coverage-mark`, `step-complete`, never `/coverage-mark`. `_internal/_system-map.md` §1 and §9 own what a
skill is and how it starts; `_session-rules.md` owns the naming rule itself. A violation is found by a
bounded grep for `(?<![A-Za-z0-9-])/<skill-name>(?![A-Za-z0-9-])` over `notes/prompts/`, both skill trees
and both launcher catalogues, discarding hits inside a file path; on 2026-08-10 it returned exactly one
real violation, this system's own drift-report example. It still returns three lines today — this
paragraph's own negative example, the same example in `_session-rules.md`, and the ledger row quoting the
defect — so read every hit before calling it a defect.

| Group | Prompts |
|---|---|
| Knowledge | `coverage-prompt`, `coverage-verify-prompt`, `coverage-audit-prompt`, `evidence-intake-prompt`, `notes-plan-prompt`, `notes-audit`, `interview-prep-audit`, `interview-prep-route-prompt` |
| Projects | `project-brief-prompt`, `plan-audit`, `readme-audit`, `review-audit`, `portfolio-audit` |
| Practice | `sql-plan-prompt`, `sql-plan-audit`, `sql-exercises-prompt`, `simulation-plan-prompt`, `simulation-generator-prompt`, `simulation-review-prompt`, `code-review-prompt`, `simulator-prompt`, `hr-screen-prompt` |
| Strategy | `progress-update-prompt`, `roadmap-review-prompt`, `cv-prompt`, `linkedin-prompt`, `cover-letter-prompt`, `profile-readme-prompt`, `tracker-prompt` |
| System | `system-check-prompt`, `system-gaps-prompt` |

Two flavors among these 31, both launched the same way (paste config into a new chat):
- **Hands-off orchestrators** — `notes-audit`, `interview-prep-audit`, `project-brief-prompt`,
  `plan-audit`, `readme-audit`,
  `review-audit`, `portfolio-audit`, `progress-update-prompt`, `roadmap-review-prompt`,
  `coverage-audit-prompt`, `interview-prep-route-prompt`, plus `coverage-prompt`,
  `coverage-verify-prompt`, `notes-plan-prompt`, `sql-plan-prompt`, `sql-plan-audit`, `simulation-plan-prompt`, and
  the two system prompts `system-check-prompt` and `system-gaps-prompt` (they run the orchestrator contract
  even when the target is singular) — run entirely inside a supported agent runtime and hand you a
  finished result (and, where noted, a commit) with no further input from you, except that
  `portfolio-audit` pauses a ✅/⚠️ non-dry run for Victor's declared one-bullet choice before its content
  commit. **Nineteen prompts**, and
  the set is defined by which self-report they run: these nineteen execute `_pipeline-self-report.md`.
- **Single-shot prompts** — the other twelve, which execute `_single-shot-self-report.md` — do one job
  in one pass; some need you to paste something mid-conversation (your code into
  `simulation-review-prompt`, a job offer into `cover-letter-prompt`, etc.).

### Public interface index

This is the compact half the family catalogue rows below deliberately do not repeat. **Config** is the
user-supplied/received input; **O** means pipeline orchestrator, hands-off except where its family
row declares a human ownership gate (currently `portfolio-audit`'s one-bullet choice). **Its cold roles
are named in one of three places, and every `O` row has one**: this cell, its family row, or the
internal-component rows that row points to. Which of the three carries them is **not** fixed by whether
a stage has a file behind it — `/coverage`, `/coverage-verify` and `/coverage-audit` all dispatch inline
and the first two are named in their family rows — so read all three before ruling a role absent, and
expect a count where the prompt states one. **S** means single-shot or live
interactive prompt. For commit ownership, **agent** means the
pipeline commits its system-authored repo outputs under the session contract, **Victor** means his
project/SQL/solution work remains his commit, and **external/output** means no commit in this repo.
The family row remains the owner of exact reads and writes; this index owns public invocation,
isolation/dispatch class, commit owner, and the boundary or gate most likely to be confused. The
run-first cell restates each prompt's own `▶ Run first` header — in some rows by naming the artefact
that prerequisite produces rather than the prompt itself, which is the same claim in the consumer's
vocabulary; where a project gate exists it is named separately, because a gate sequences the chain and
a prerequisite constrains the run.

**But an absence in the `handoff` and `explicit boundary` parts of that column is not a finding**: they
carry the handoff, boundary or gate most likely to be confused, never the prompt's whole list of them,
so one missing from them is delegating, not lying — one **named** there with a false scope is the
finding, and the prompt itself stays the exhaustive list. **The run-first part is licensed only this
far**: it carries every branch that constrains whether the run may proceed — the conditional branches
and the null one included — while an item the prompt's own `▶ Run first` header marks *optional* or
*advisory* may be absent from it, because an advisory item is not a prerequisite. That is the rule to
quote against the `coverage-verify` line in `/notes-plan` and `/sql-plan`, and the `Optional:` items in
`/cv` and `/interview-prep-audit`; a cell naming one anyway (`/cover-letter`'s `/cv tailor`) carries
more than it owes and does not contradict this. Every other column of this index is outside both
licences: this fence reaches three parts of one column and makes no claim about the rest.

| Command → canonical prompt | Config / received input | Runtime · commit owner | Run-first / handoff / explicit boundary |
|---|---|---|---|
| `/coverage` → `coverage-prompt` | `TOPIC`, `LEVEL`, optional `NOTES_PATH`, `MODE=update\|dry-run` | O · agent | run-first nothing; registered topic only; preserves refined locks; hands gaps across topics through the inbox |
| `/coverage-verify` → `coverage-verify-prompt` | `TOPIC`, `LEVEL`, `MODE=update\|dry-run` | O · agent | after coverage; advisory findings plus any cross-topic proposal it routes, never edits coverage or blocks notes-plan |
| `/coverage-audit` → `coverage-audit-prompt` | `LEVEL`, `MODE=update\|dry-run` | O, cold per-concern analysts + two cold final reviewers · agent | all topics at that level must exist; convergence, not per-topic authoring |
| `/evidence-intake` → `evidence-intake-prompt` | `MODE=paste\|search`, optional `FOCUS`; posting text in paste mode | S · agent | run-first nothing; evidence only; never edits coverage directly |
| `/notes-plan` → `notes-plan-prompt` | `TOPIC`, `LEVEL`, `MODE=update\|dry-run` | O, one cold pedagogical reviewer · agent | after coverage; plans one topic+level and writes no note prose |
| `/notes-audit` → `notes-audit` | `TOPIC`, `LEVEL`, `NOTE` | O, four cold stages · agent | requires a current plan; exactly one planned EN/ES pair, never an arbitrary path or `all` |
| `/interview-prep-audit` → `interview-prep-audit` | `LEVEL`, `FILE=topic\|all`, `SECTION`, `MODE=full\|correct`, `DRY_RUN` | O, market/gap/author/reviewer roles · agent | current coverage+plan, and on the `angular` run the Angular Material plan at this level too, because both topics share `angular.md`; never edits a refined block |
| `/interview-prep-route` → `interview-prep-route-prompt` | `LEVEL`, `MODE=update\|dry-run` | O, one cold route reviewer · agent | every required bank must be current; stores IDs/order, never answers |
| `/project-brief` → `project-brief-prompt` | optional `NUMBER` (blank derives next), `CANDIDATE=blank\|name` | O, cold second opinion · agent | after clean progress audit; decides scope, never writes the plan |
| `/plan-audit` → `plan-audit` | `MODE=new\|review`, `PROJECT=blank\|path\|all` | O, author/advisor/reviewers · agent | new mode only: `progress-update`, then the brief it consumes/dispatches; review `all` only; no `DRY_RUN` |
| `/review-audit` → `review-audit` | `PROJECT_PATH=path\|all`, `REVIEW_SCOPE=full\|backend\|frontend` | O, cold per-slice roles · agent | run-first nothing; as project gates **G3/G4** it reads `PLANNING.md` and the source, never the README; writes/commits backlog only, never project code |
| `/readme-audit` → `readme-audit` | `PROJECT_PATH=path\|all` | O, author+reviewer per README · Victor | run-first nothing; as project gate **G5** it runs after every High from G3/G4 is fixed; pipeline does not commit project README work |
| `/portfolio-audit` → `portfolio-audit` | `PROJECT_PATH=path\|all`, `DRY_RUN` | O, author+reviewer per bank section · agent; a ✅/⚠️ non-dry content commit pauses for Victor's one CV-bullet choice; external profile commit is Victor's | after a **complete** `review-audit` per tier (G3/G4 — its verdict stops on a `Last Reviewed` line reading `never` or carrying `(incomplete — …)`), `readme-audit` (G5) **and** an empty `progress-update` (G6) — §23's whole chain, not a subset, **for a project whose plan steps are all ✅**; one with an incomplete step owes none of it and stops at ❌ before the backlog is read; final go/no-go, never replaces review |
| `/sql-plan` → `sql-plan-prompt` | `LEVEL`, `MODE=update\|dry-run` | O, cold route reviewer · agent | coverage first; plans only, never writes/grades `.sql` or schedules other tracks |
| `/sql-plan-audit` → `sql-plan-audit` | `SCOPE=full\|extend`, `LEVEL` | O, four cold specialists · agent | existing route required; exercises-only; never edits Victor's `.sql` files |
| `/sql-exercises` → `sql-exercises-prompt` | `MODE`, `TOPIC`, optional `LEVEL`, `COUNT`, `FILE` | S · Victor owns the `.sql` answers and their commit; agent owns the review-mode MISTAKES/`PROGRESS.md`/route writes and the doctrine §0 rewrite on a close | after `/sql-plan {LEVEL}`, except `MODE = reinforce`, which takes its file from `FILE` and needs no step; focus/review derived; legacy review grades but does not invoke step close |
| `/simulation-plan` → `simulation-plan-prompt` | `LEVEL`, `MODE=update\|dry-run` | O, cold route reviewer · agent | clean progress snapshot first, and coverage must already exist for every track admitted at this level; plans routes only, never specs/grades/solutions |
| `/simulation-generator` → `simulation-generator-prompt` | `LEVEL`, `STEP=current\|<n>` | S · agent for generated artifacts | route required; no free-form focus/difficulty/time/track |
| `/simulation-review` → `simulation-review-prompt` | `LEVEL`, `STEP`, `SIMULATION_FILE`, `MODE`, conditional `TIME_USED`/`SELF_ASSESSMENT`, submitted solution | S launcher → cold `simulation-grade` path · agent for tracking, Victor for solution | after `/simulation-plan` for this LEVEL, plus a closed attempt in `review`/`correction` mode — `hint` runs inside the attempt and needs only the partial solution; never grades locally; timed verdict/time are immutable |
| `/code-review-practice` → `code-review-prompt` | `TYPE`, `LEVEL`, optional `DIFFICULTY`, `ISSUE_COUNT`, `FOCUS`; Victor's critique | S, live critique · agent for logs/Q&A | run-first nothing; self-contained; waits for Victor before revealing planted issues; not the host diff-review command |
| `/simulator` → `simulator-prompt` | `MODE`, `LEVEL`, `LANGUAGE`, conditional `TOPIC`/`SECTION`, optional `MAX_QUESTIONS`; live answers | S, live interview · agent for logs/gaps | interview bank first, plus `portfolio-audit` for project questions; one question at a time, never reveals answer first |
| `/hr-screen` → `hr-screen-prompt` | optional `LANGUAGE`, `MAX_QUESTIONS`; live answers | S, live interview · agent for logs/gaps | run-first nothing; non-technical only; never substitutes for `/simulator` |
| `/progress-update` → `progress-update-prompt` | optional `MODE=active\|all` | O, cold per-project/SQL analysis · agent | run-first nothing — a producer, run before brief/CV and G6; writes only `Professional level by topic`, reports other drift to `_last-drift-report.md` |
| `/roadmap-review` → `roadmap-review-prompt` | no config; current repo state | O, fact gatherers+doer+cold reviewers · agent | after a **clean** `/progress-update` (its drift repaired, not merely run) and the owning gates; ROADMAP only, never repairs upstream state |
| `/cv` → `cv-prompt` | `MODE`, `EDUCATION`, `CAMBRIDGE`, `LOCATION`, `PHONE`, `PROJECTS`, conditional `BASE_CV`; pasted offer for tailor | S · external for the CV itself; in `tailor` the agent commits `_job-market-evidence.md` | after a **clean** `/progress-update` (its drift repaired, not merely run), and never before `ROADMAP.md`'s **CV gate** — project 07 live on GitHub with a README carrying at least one architecture decision; CV files live outside the repo; no unsupported claim |
| `/linkedin` → `linkedin-prompt` | no config; nothing pasted in — the prompt states "No configuration needed" | S · output only | progress evidence first; returns paste-ready sections/posts, writes no repo file |
| `/cover-letter` → `cover-letter-prompt` | `MODE`, `EMPRESA`, `PUESTO`, optional `CONTACTO`; pasted offer | S · output only | after a **clean** `/progress-update` (its drift repaired, not merely run; optionally `/cv tailor`); offer required; tailored text only, no repo file |
| `/profile-readme` → `profile-readme-prompt` | `MODE=sync\|optimize` | S · external repo, Victor commits | after `/portfolio-audit` when a project just reached ✅ Ready, otherwise run-first nothing; sync never silently expands to optimize; never commits the portfolio repo from here |
| `/tracker` → `tracker-prompt` | `MODE=log\|update\|analyze`; `log` adds `EMPRESA`, `PUESTO`, `CANAL`, `FUENTE`, `CONTACTO`, `CV_USADO` plus the `sector` it asks for when it cannot infer one, `update` adds `EMPRESA` + `PUESTO` plus the new `estado` and the verbatim feedback it asks for, `analyze` none; `log` also asks for the posting text pasted when fetching `FUENTE` fails | S · external/output | run-first nothing; external tracker only; analyze hands recurring gaps to evidence-intake |
| `/system-check` → `system-check-prompt` | `MODE=full\|carry-forward` (default `carry-forward`); explicit invocation; an in-progress `.system-check/` checkpoint is validated and resumed automatically | O, family/root/skill/launcher analysts + one bounded reconciler per map span and per manifest concern + cold final reviewer · agent; every reconciler reads the map itself, never a paraphrase; every accepted concern is persisted before the next dispatch | run-first nothing, explicit invocation only; machinery only; takes `_session-rules.md`'s machinery-only exception, so it never opens active-project `PLANNING.md` / backlog / `PROGRESS.md` even for orientation; session/platform changes resume the same evidence; audited-input drift blocks reuse except for an explicitly authorized, bounded persistence, resume or audit-method migration; `carry-forward` additionally reuses a completed run's accepted evidence for every concern whose own inputs are byte-identical and degrades to `full` without such an anchor, narrowing neither the inventory nor the verdict; never source repair, automatic gate, or partial verdict |
| `/system-gaps` → `system-gaps-prompt` | `MODE=update\|dry-run`; explicit invocation | O, one cold independent analyst + cold reviewer · agent; the orchestrator reads both maps itself | run-first nothing, explicit invocation only; the two maps are the only evidence — no prompt, skill, standard or live artifact is opened; corrects nothing, caps the ledger at five rows a run, and never states one branch of an absence as fact |

Either way, **every run writes its own `_last-run-report*.md` and updates `_run-tracker.md`.**
Orchestrators record target-level state; `notes-audit` additionally records every planned EN/ES pair,
and single-shot prompts update their latest-execution table. Completed, blocked, and dry-run outcomes
remain distinguishable. Both files count as declared outputs of every prompt and are checked by the close-out —
they are not repeated in the per-prompt rows below only because they are universal, not because they
are exempt.

Before reconciling recommendations from their own run, both close-outs also consume any `open`
`FRIC-NNNN` rows in `_skill-friction.md`. They apply their existing four-condition bar, route a real
defect to one `REC-NNN`, dismiss a non-defect with the failed condition, or leave insufficient evidence
open. That conditional reconciliation is committed separately from report + tracker and is not a
declared output of every prompt.

### The internal-only files (never launch these)

`_coverage-standard.md`, `_note-quality-standard.md`, `_interview-prep-standard.md`,
`_planning-standard.md`, `_readme-standard.md`, `_review-standard.md`, `_portfolio-standard.md`,
`_concept-extraction-standard.md`, `_roadmap-standard.md`, `_application-standard.md`,
`_sql-plan-standard.md`, `_sql-exercise-seeds.md`, `_sql-exercises-practice.md`,
`_sql-exercises-review.md`,
`_simulation-plan-standard.md`,
`_shared-context.md`, `_batch-mode.md`, `_job-market-evidence.md`, `_skill-friction.md` (observable
failed skill steps, consumed by the next prompt close-out),
`_recommendation-resolution-doctrine.md` (the recommendation ledger's case-law half: the rule every
closed `REC-NNN` promoted, plus the row-shape pricing table — read only by a session resolving a ledger
row, at its steps 1 and 3),
`_recommendation-ledger-closed.md` (the ledger's resolved half: one line per closed `REC-NNN`, ordered
by ID — read to deduplicate a candidate against work already ruled on, including rejected rows),
`system/_internal/_system-check-reconcile-prompt.md` (the mandate every one of `system-check`'s Step 4
reconcilers is dispatched with: the two directions, the four claim dispositions and the return contract),
`system/_internal/_system-check-report.md` (the latest explicit machinery audit: inventory and boundary
coverage, README catalogue reconciliation, system-map wiring/skill reconciliation, architecture
recommendations, and the cold-review verdict — and, on a blocked run, every proved source contradiction
with its ledger ID or `unregistered`, which is what the next run inherits),
`system/_internal/_system-gaps-report.md` (the latest gap sweep: the edge ledger built from the two maps,
every candidate with its detector, evidence and disposition, and the candidates deferred over the
five-row promotion cap — which is where the next run gets its ranking),
`_single-shot-self-report.md` (the same contract for the twelve non-orchestrator prompts: skill-friction
reconciliation, close-out check against declared outputs, tracker update, three bullets, refinement behind a cold reviewer),
`_pipeline-self-report.md` (the shared final step every orchestrator runs: five bullets on how the run
itself went, written to `_last-run-report*.md` in the orchestrator's own `_internal/` folder and
auto-committed with `_run-tracker.md`, after any separate skill-friction reconciliation — the
evidence that decides whether a frozen prompt gets reopened), plus every
`_notes-write-prompt.md` / `_notes-review-prompt.md` / `_notes-translate-prompt.md` / `_notes-review-es-prompt.md`,
`_interview-prep-write-prompt.md` / `_interview-prep-review-prompt.md`,
`_plan-write-prompt.md` / `_plan-architecture-prompt.md` / `_plan-review-prompt.md`,
`_readme-write-prompt.md` / `_readme-review-prompt.md`,
`_review-flow-prompt.md` / `_review-security-prompt.md`,
`_portfolio-write-prompt.md` / `_portfolio-review-prompt.md`.

---

## The five hub files

Everything orbits the three level mirrors plus progress and project planning. Most prompts write or
consume one of these sources of truth.

| Hub file | Source of truth for | Written by | Read by |
|----------|---------------------|------------|---------|
| `notes/coverage/junior.md` | **junior scope** | `coverage-prompt`, `coverage-audit-prompt` (bulk) · in session: `coverage-bullet-add`, `coverage-mark`, and `sql-step-close` (SQL drill markers) — complete list in [`_system-map.md` §7](_internal/_system-map.md#7--the-writer-registry) | `project-brief` (the only whole read), current notes/interview-prep audits, `roadmap-review`, `sql-exercises`, and the apply family for defensibility spot lookups (`cv`, `linkedin`, `cover-letter`, and `portfolio-audit`'s CV bullet, through `_application-standard.md` source 7); `plan-audit` only digests it to test a brief's freshness |
| `notes/coverage/middle.md` | **middle scope after junior consolidation** | `coverage-prompt`, `coverage-audit-prompt` (bulk) · in session: `coverage-bullet-add`, `coverage-mark`, and `sql-step-close` (SQL drill markers) — complete list in [`_system-map.md` §7](_internal/_system-map.md#7--the-writer-registry) | level-aware notes/interview-prep audits |
| `notes/coverage/senior.md` | **senior scope after middle consolidation** | `coverage-prompt`, `coverage-audit-prompt` (bulk) · in session: `coverage-bullet-add`, `coverage-mark`, and `sql-step-close` (SQL drill markers) — complete list in [`_system-map.md` §7](_internal/_system-map.md#7--the-writer-registry) | level-aware notes/interview-prep audits |
| `PROGRESS.md` | **status, never a concept list** — the per-technology lists were deleted 2026-08-03 and a concept lives in the coverage files; the section-by-section inventory is [`_system-map.md` §8](_internal/_system-map.md#8--progressmd-section-by-section) | the closing rituals per section, in session (`step-complete`, `coverage-mark`, `study-block-close`, `sql-grade`, `simulation-review`…) + `progress-update-prompt`, which writes only `Professional level by topic` and audits the rest | `plan-audit`, `roadmap-review`, `project-brief`, `review-audit`, `cv`, `linkedin`, `cover-letter`, `profile-readme`, `sql-exercises`, simulation/interview planning |
| `{project}/PLANNING.md` | **what a project builds** | `plan-audit` · in session: `step-complete` (✅ + §0 — every cell, `Next gate` re-derived) and `backlog-task-close` (rules section + §0 — `Last updated` always, the gate qualifier, and the route cells only when it owns them) — the whole six-cell partition is in [`_system-map.md` §7](_internal/_system-map.md#7--the-writer-registry) | `readme-audit`, `review-audit`, `portfolio-audit`, `progress-update`, `roadmap-review` |

---

## The prompts — what each one reads and generates

**Two files are not owed by the `Reads` column in any of the five tables below.**
`notes/prompts/_internal/_session-rules.md` reaches every run through the active platform adapter —
`_readme-write-prompt.md` tells its author not to re-read it, "it is already injected into your context
automatically", while a cold dispatched role may instead be told to load the one section it needs
(`roadmap-review-prompt.md`'s Reviewer 1: "do not assume the shared session rules are loaded"). And
`_shared-context.md` is the profile/market background most prompts open before working, several of them
through a standard rather than directly (`tracker` through `_application-standard.md`'s own source list).

**Their absence from a `Reads` cell is never a finding where they are read as background.** Two cases are
owed, and there the absence *is* a finding: when a prompt takes a **named section** of one as the
authority for a single concern (`_plan-review-prompt.md`'s "Testing rules", read by `steps-tests` alone;
`roadmap-review-prompt.md`'s "Daily study blocks", read by Reviewer 1 alone), and when one of the two is
something the run **works on or audits** rather than reads for context (`system-check-prompt.md` carries
`_session-rules.md` inside the root-contract inventory it reads to EOF and rules on;
`evidence-intake-prompt.md` reads `_shared-context.md` as the target profile its posting filter applies,
and as the fence against `ROADMAP.md`). A cell that names one of the two is making a claim like any
other, ruled like any other.

**This is an absence licence, not an enumeration — and it is the rule a reconciler quotes.** A background
read of either file, found in a manifest and absent from its cell, is disposed `source-only by ownership
split` against this paragraph; it is not a manifest fact with no home in either map, so it never becomes
`missing claim`. The licence says nothing about *which* prompts read either file, because the two do not
divide the same way, and it reaches this column alone. `_system-map.md` §9's per-skill `Primary reads`
cells are outside it and carry a fence of their own, written under that section's heading; it covers
`_session-rules.md` alone, because `_shared-context.md` is a mandated read of exactly one skill rather
than background to all of them.

### Knowledge — build and audit study content

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `knowledge/coverage/_internal/_coverage-standard.md` | *Internal.* The **shared coverage standard** all coverage pipelines read: `_shared-context.md` defines the target, current market evidence plus level definitions establish scope, downstream artifacts such as `ROADMAP.md` may organise but never raise coverage, `[x]` bullets incorporated into a `Status: refined` note are locked while `[ ]` pending additions remain movable, and a global mirror may be spot-checked freely and **enumerated** from by a run that quotes the validator's parity line, but never **measured** from. Not runnable. | — | — |
| `knowledge/coverage/_internal/_cross-topic-inbox.md` | *Internal.* The **durable handoff** between coverage runs: when a run finds a gap owned by another topic, it files the item here under that topic instead of only mentioning it in a summary. Written by `coverage-prompt` (its ROUTE disposition), `coverage-verify` (a gap rejected on ownership alone) and `coverage-audit`, plus the inline `coverage-bullet-add` and a by-hand entry on a boundary change under `_topic-ownership.md`. Read by `coverage-prompt`, which judges the entries under its own heading, and `coverage-audit`, which sweeps all headings; each of the two owns which of its steps performs that read. `coverage-verify` files proposals and never consumes one. Not runnable. | — | — |
| `knowledge/coverage/_internal/_topic-ownership.md` | *Internal.* Registry of each coverage topic's ownership boundary, exclusions, and mandatory adjacent-topic comparison set. It also defines the admission gate and first-run migration contract for a genuinely new topic, preventing copy-based overlap. Not runnable. | — | — |
| `knowledge/coverage/_internal/_coverage-prompt-rationale.md` | *Internal.* Historical evidence retained from the former angle engine, plus the real-run lessons that still justify current `coverage-prompt.md` rules. The current prompt deliberately carries no `R-n` pointers. Consult the relevant entry before weakening or refining a rule; when a future coverage refinement earns new evidence, this file's own "How to add to it" contract owns the new entry. Not runnable and not a normal run input. | — | — |
| `knowledge/coverage/coverage-prompt.md` | Defines one topic with one selected level (`junior`, `middle`, or `senior`) as the primary target. Middle also checks junior prerequisite integrity; senior checks both junior and middle. Before recalibration it reads persistent notes plans and locks every bullet assigned to a `Status: refined` entry; planned, `pending`, and `complete` entries remain remappable. One cold market analyst establishes the selected-level competency floor and two cold reviewers challenge cumulative level calibration, factual quality, ownership, and lock preservation. | `_coverage-standard.md`, `_topic-ownership.md`, `_shared-context.md`, `_job-market-evidence.md`, `_run-tracker.md`, all three topic and adjacent-topic level files, their notes plans, `_cross-topic-inbox.md`, applicable `verify-*.md` files, previous self-report | `notes/{topic}/coverage/{LEVEL}.md`, any corrected unlocked prerequisite level, their global mirrors, `_cross-topic-inbox.md`, registered adjacent topics and consumed `verify-{LEVEL}.md` files when required, a `Plan status: stale` header on every invalidated notes plan, and the affected `PROGRESS.md` `Coverage demonstrated` cells |
| `knowledge/coverage/coverage-verify-prompt.md` | Advisory cumulative completeness check for one topic at one selected level, run **after** `coverage-prompt` and ideally **before** `notes-plan`. Read-only over coverage: one cold reviewer verifies the selected market floor and the integrity of every earlier prerequisite level (junior for middle; junior + middle for senior), emitting level-targeted gaps and one fingerprint over the selected level only — earlier levels carry no field of their own. Like `coverage-prompt` it locks every bullet a `Status: refined` notes-plan entry carries: the reviewer may report that calibration would place a locked bullet elsewhere, but only as a `locked placement conflict` recorded apart from the gaps, never as a move. A `gaps` verdict never blocks `notes-plan`; the findings feed back into `coverage-prompt` update. | `_coverage-standard.md`, `_topic-ownership.md` (the boundary authority for both of its ownership tests), `_shared-context.md`, `_job-market-evidence.md`, the selected topic level file and both siblings, this topic's notes plans (to identify locked bullets), the previous self-report | `notes/{topic}/coverage/verify-{LEVEL}.md` (verdict + level-targeted findings), one `_cross-topic-inbox.md` proposal per gap it rejects on ownership alone — committed separately — its `_internal/_last-run-report-coverage-verify.md`, and the Verify J/M/S tracker cell |
| `knowledge/coverage/coverage-audit-prompt.md` | Global convergence pass for one selected level after every topic has run `coverage-prompt` for that level. Audits market fit, fundamentals, level boundaries, registered ownership, missing topics, and preserves every refined-note coverage lock; disagreements with a lock are reported, never moved or duplicated. | `_coverage-standard.md`, `_topic-ownership.md`, `_shared-context.md`, all three global mirrors and topic level files, every notes plan, `_job-market-evidence.md`, `_cross-topic-inbox.md`, `_run-tracker.md` (its Step 0 gate: every topic needs a completed run at this level) | the selected global mirror and the topic level files it corrects, plus justified cross-level moves of unlocked bullets; the `PROGRESS.md` `Coverage demonstrated` table refreshed in that same commit; routed entries in `_cross-topic-inbox.md`; routes justified new topics through the admission contract before a separate `coverage-prompt` run |
| `knowledge/coverage/evidence-intake-prompt.md` | Nourishes `notes/prompts/_internal/_job-market-evidence.md`: `paste` mode adds full offers you provide, `search` mode web-searches a batch of current Spanish junior postings; both append Raw-posting blocks, re-tally the Synthesis, and commit. Run it whenever you see real postings. | `_job-market-evidence.md`, `_coverage-standard.md`, `_shared-context.md` (the target profile the posting filter uses — **not** `ROADMAP.md`, whose plan may not decide what raises the floor) | `notes/prompts/_internal/_job-market-evidence.md` (new Raw-posting blocks **and** the re-tallied Synthesis — appending without re-tallying is a skipped step) |
| `knowledge/notes/notes-plan-prompt.md` | Persistent pedagogical planner for exactly one topic and level. Maps every selected-level coverage concept exactly once with granular delivery state (`[ ]` assigned, `[x]` incorporated), preserves checks across reconciliation, gives each chapter a complete pedagogical contract, and keeps authored `Status` separate from the `Studied` date and from `Pending study`, the sections that landed after that date and still owe a pass. Existing legacy plans gain the metadata when this prompt next runs; no standalone migration is required. | all three topic coverages, selected mirror, cumulative verification findings, existing notes across all three levels, `_note-quality-standard.md` | `notes/{topic}/coverage/notes-plan-{LEVEL}.md` plus any verified bilingual relocations and affected plan-path reconciliations |
| `knowledge/notes/notes-audit.md` | Builds exactly one persistent-plan entry selected by `TOPIC + LEVEL + NOTE`; after both languages pass, Stage C marks every incorporated concept `[x]` and resets `Studied` when an authoring or audit run changed prose. For a refined note it marks only consumed pending additions `[x]`, clears the matching queue entries, and leaves the existing prose and `refined` status untouched — including `Studied`, which an append-only run preserves, recording each appended section under `Pending study` instead so one addition does not unstudy the whole note. | `_note-quality-standard.md` (guard 10 reads its topic-introduction invariants directly), selected coverage **and both sibling-level coverage files** (guard 8 cannot clear a bullet as level-exclusive without them), pedagogically complete persistent plan, its internal stages | one `{LEVEL}/en` + `{LEVEL}/es` pair, concept delivery checks, plan status and studied state (reset, or preserved with `Pending study` gaps on an append), committed atomically |
| `knowledge/notes/_internal/_note-quality-standard.md` | *Internal.* The **shared writing standard** every piece reads (folder placement, format modes and the conversational-mode override every `00` carries, the bilingual `en/`–`es/` naming and direction contract, the persistent-plan pedagogical contract and its seven topic-introduction invariants, rule 3, signature elements, anticipate-the-TODO, sentence-level register). Not runnable. | — | — |
| `knowledge/notes/_internal/_notes-write-prompt.md` | *Internal (stage A — English author).* Deep, high-standard work on **one `en/`** file: resolve TODOs, complete it, self-check. Writes English, plus one bounded exception — a TODO Victor wrote in the `es/` is resolved **in the `es/`, in Spanish** (2026-08-20 rule), and the English is then brought into line with it; every other `es/` byte stays stage T's. Does **not** commit. | `_note-quality-standard.md`, the one `en/` file, sibling files, its `es/` counterpart (markers, and the sections whose TODOs it resolves) | that one `en/*.md`, plus the `es/` sections it resolved a TODO in |
| `knowledge/notes/_internal/_notes-review-prompt.md` | *Internal (stage B — English reviewer).* Independent auditor for **one `en/`** file: fixes what falls short in English. The `es/` may already exist (an `audit` entry, or an append-only run over a refined pair) and is out of scope either way. Never opens the counterpart `es/`, never commits. | `_note-quality-standard.md`, the one `en/` file, sibling files | the audited `en/*.md` |
| `knowledge/notes/_internal/_notes-translate-prompt.md` | *Internal (stage T — translator).* Takes the finished, canonical `en/` file and produces/re-syncs its `es/` counterpart: exact structural parity, native-Spanish prose. **Stops** on an unresolved `es/` TODO marker instead of clearing or overwriting it (those are resolved Spanish-side by stage A), and freezes the `es/` sections stage A authored directly. Does not change the English, does not commit. | the canonical `en/` file, the existing `es/` (if any), `_note-quality-standard.md` | that one `es/*.md` |
| `knowledge/notes/_internal/_notes-review-es-prompt.md` | *Internal (stage C — Spanish reviewer, `en/`-blind).* The planned `es/` file is the only **note** it opens — the standard, the calibration reference and the plan are required support reads, and in append-only mode the English half of its freeze proof is `--numstat` counts, never a textual diff. Fixes calque/flow, marks that persistent-plan entry complete, resets its studied state after changed prose — or, in append-only mode, preserves the date and records the appended headings under `Pending study` — and commits the pair plus plan. | `_note-quality-standard.md`, one `es/` file, persistent plan | the `es/*.md`, plan concept/status/studied metadata, one atomic commit |
| `knowledge/interview-prep/interview-prep-audit.md` | Level-aware market-selected Q&A audit, including standalone Spring. Uses current coverage as the level boundary rather than a one-question-per-bullet checklist; live web/evidence analysis selects realistic questions, stable IDs preserve identity, and every new or rewritten question remains unrefined until Victor accepts it. Pending junior notes are allowed once the selected notes plan is current; earlier-level progression gates still protect middle/senior. | its internal pieces, selected topic coverage + current notes plan, `_job-market-evidence.md`, selected-level interview-prep en/es | selected-level interview-prep en/es, one atomic commit per topic |
| `knowledge/interview-prep/interview-prep-route-prompt.md` | Builds one cross-topic CORE study order for a selected level after every required bank is current. Selects a globally weighted subset of ⭐⭐⭐ questions, stores stable IDs and navigation labels only, and fingerprints the state-stripped question inventory so refining/studying does not stale the route. | all selected-level EN/ES banks, `_interview-prep-standard.md`, `_shared-context.md`, `_job-market-evidence.md`, `ROADMAP.md` | `notes/interview-prep/routes/{LEVEL}.md` |
| `knowledge/interview-prep/_internal/_interview-prep-standard.md` | *Internal.* Shared Q&A standard, with four reader groups its own header scopes — the audit pipeline, the route prompt, the two practice prompts and the in-session skills: coverage-bounded market selection, fingerprints, stable bilingual IDs, question types/priorities, realistic answers in Victor's voice, and the three-state lifecycle (unrefined → `[refined]` frozen → `[refined] [studied]`). Its "Adding questions from outside the audit" section is where `/simulation-review` and `/code-review-practice` enter, and it plus the sections it invokes is their contract: born-unrefined questions, a section they may reorder but no refined content or state marker they may touch, and the route-stale handoff each insertion owes. The fingerprint *check* runs in the two prompts; the contract it checks against is here. Not runnable. | — | — |
| `knowledge/interview-prep/_internal/_interview-prep-write-prompt.md` | *Internal (author).* Audits one selected-level section, scoped by `MODE`: `full` does en/es sync, TODO/reopen handling, coverage traceability, stable IDs, priorities and market question quality; `correct` does sync, TODOs, priority and format only, skips the coverage check, adds no questions and **reports** weak answers instead of rewriting them. Never edits a refined block. | `_interview-prep-standard.md`, selected coverage, interview-prep en/es, the project or practice source a cited snippet comes from (its "Sourcing real code" table) | interview-prep en/es working tree |
| `knowledge/interview-prep/_internal/_interview-prep-review-prompt.md` | *Internal (reviewer).* Independent second pass on one selected-level section, run under the **same `MODE` as the author**: `full` fixes every failed check; `correct` fixes only the mechanical/parity half (markers, format, type label, stable IDs, bilingual integrity) plus a false code citation or project anchor, and **reports** the quality bar, the ratio floor and a missing snippet — so the pass Victor asked to correct his own words does not rewrite them. Rewrites unrefined questions only, reports defects in frozen ones, and keeps IDs/state bilingual. Under the orchestrator it never commits. | `_interview-prep-standard.md`, selected-level interview-prep en/es, the cited project or practice source when a citation or anchor looks doubtful (spot-check, via the write prompt's "Sourcing real code" table) | the audited selected-level pair in the working tree |

### Projects — plan, document, review

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `projects/plan/project-brief-prompt.md` | **The choice, before the plan.** Decides which project Victor builds next and records why, as a durable one-page brief: chosen project · the gaps it closes with their coverage bullets quoted verbatim · the §3/§4 concept lists · the alternatives rejected with reasons · the scope ceiling · the gaps left for the next brief. The gap analysis keys on the `✅ NN-slug` evidence markers (unmarked = not yet demonstrated), never on PROGRESS.md's deleted concept lists. It refuses a missing `projects/README.md` or a mismatch between its `#` column and the numbered folder prefixes; the inventory is maintained by hand rather than by this prompt. Carries a `Coverage SHA-256` + last completed project so a consumer can refuse a stale brief, and a mandatory cold second opinion (`endorse` · `endorse-with-scope-change` · `wrong project`) settles it on one page before 24 sections are designed against it. A `wrong project` verdict blocks the commit and goes to Victor. Runs standalone to think ahead, or as `plan-audit`'s Phase 0. | `notes/coverage/junior.md` (whole), `PROGRESS.md` (projects table + level matrix + coverage-demonstrated), `ROADMAP.md` (candidates + gates), `projects/README.md`, `_shared-context.md`, `_job-market-evidence.md`, `_coverage-standard.md` | `projects/briefs/project-brief-{NN}.md` (its own atomic commit), `projects/plan/_internal/_last-run-report-project-brief.md` |
| `projects/plan/plan-audit.md` | **THE entry point — the only project-plan prompt you launch.** Runs **inside a supported agent runtime**, hands-off. `new` mode plans the project the brief chose (Phase 0 dispatches `project-brief` when no current brief exists; a `wrong project` second opinion stops the run), writes a full PLANNING.md, runs an **architecture advisor** on §6/§3/§20, then audits it with **seven cold specialist reviewers — six owning one concern each** (architecture · data-model-api · ui-design · rules-security · steps-tests · branches-coverage) **plus a final `whole-plan` pass** that reads the finished plan end to end for the sections no concern owns, cross-section contradictions and `PROJECT-BACKLOG.md` drift, before the orchestrator makes the single commit; `review` mode runs the same seven on an existing PLANNING.md (one project or `all`). Specialists never commit. The orchestrator always commits its own work; a specialist acceptance check or history-preservation gate still failing after its one re-dispatch stops that commit — the specialist gate finishes the remaining concerns first, the history gate stops where it stands — and the run is recorded `blocked`, per project in `all`. The author acceptance check is the one that is reported and still commits. | its four internal pieces (below) | `{project}/PLANNING.md`; adds a row to `PROGRESS.md`; marks the choice in `ROADMAP.md`; `{project}/PROJECT-BACKLOG.md` when `whole-plan` reconciled it (either mode); one atomic commit; `projects/plan/_internal/_last-run-report.md` (its own commit, with `_run-tracker.md`) |
| `projects/plan/_internal/_planning-standard.md` | *Internal.* The **shared PLANNING.md contract** both the author and reviewer read (the 24-section template + what makes each pass, done-condition formats, HTTP status conventions, professional implementation order, branch-strategy rules, quality-gate rules, consistency invariants, the two project formats). Not runnable. | — | — |
| `projects/plan/_internal/_plan-write-prompt.md` | *Internal (author, new mode).* Designs the project **the brief already chose** and writes the complete PLANNING.md to the standard + the ROADMAP/PROGRESS edits. It neither chooses nor gap-analyses, and never opens `notes/coverage/junior.md` — the brief carries those bullets verbatim. Does not commit. | `_planning-standard.md`, the brief, `PROGRESS.md` (projects table + level matrix), `ROADMAP.md` (phases + gates), highest-numbered `PLANNING.md` | `{project}/PLANNING.md`, `ROADMAP.md`, `PROGRESS.md` (working tree) |
| `projects/plan/_internal/_plan-architecture-prompt.md` | *Internal (architecture advisor, new mode only).* Judges the drafted architecture (§6), the one new architectural concept (§3), and the tradeoffs (§20) against Victor's level and the coverage gaps; fixes over/under-engineering directly in those sections. Does not commit. | `_planning-standard.md` (its slice), `{project}/PLANNING.md` (§3/§6/§20), `PROGRESS.md` | the sharpened §3/§6/§20 (working tree) |
| `projects/plan/_internal/_plan-review-prompt.md` | *Internal (specialist reviewer).* Dispatched **once per concern** by the orchestrator (`SCOPE` = architecture · data-model-api · ui-design · rules-security · steps-tests · branches-coverage), then once as `SCOPE = whole-plan`: audits only its slice against the standard, fixes directly, returns a check-by-check trace. Never commits — the orchestrator owns the single commit (a standalone `SCOPE = all` run doesn't commit either). | `_planning-standard.md` (its slice), `{project}/PLANNING.md`, `PROGRESS.md` (`architecture` only), `projects/briefs/project-brief-{NN}.md` (`steps-tests` only, the authority for §2/§3/§4), `_session-rules.md`'s Testing rules (`steps-tests` only), other projects' §14 (`ui-design` only), `{project}/PROJECT-BACKLOG.md` (`whole-plan` only) | the audited slice of `PLANNING.md`, plus `PROJECT-BACKLOG.md` on `whole-plan`'s twelfth check (working tree) |
| `projects/readme/readme-audit.md` | **THE entry point — the only readme prompt you launch.** Runs **inside a supported agent runtime**, hands-off. Reviews and fixes a project's README(s) to the standard — for full-stack, one author + cold-reviewer subagent pair **per README** (global / backend / frontend). Run before the portfolio gate (`portfolio-audit` reads the READMEs; `review-audit` does not). **Not auto-committed** — hands Victor the commit (project-folder files). Ends with a **pipeline self-report** written to `projects/readme/_internal/_last-run-report.md` (auto-committed — prompt-system machinery): five bullets on how the run itself went (report discipline, trace verification, coherence, failure protocol), read later to decide if these prompts need changing. | its three internal pieces (below) | `{project}/README.md` (+ `backend/README.md`, `frontend/README.md` for full-stack), `projects/readme/_internal/_last-run-report.md` |
| `projects/readme/_internal/_readme-standard.md` | *Internal.* The **single source of README rules** every piece reads (the two project formats, quality filter, in-progress scan, the 12 global-README rules + section order, full-stack global additions, the backend 9 sections, the frontend 7 sections, the commit rule). Not runnable. | — | — |
| `projects/readme/_internal/_readme-write-prompt.md` | *Internal (author).* Writes/fixes **one** README (global \| backend \| frontend) to the standard's rules for that target. Does not commit. | `_readme-standard.md`, `{project}/PLANNING.md`, the existing README | that one README (working tree) |
| `projects/readme/_internal/_readme-review-prompt.md` | *Internal (reviewer).* Independent second pass on **one** README: audits against the standard (recruiter + interviewer lens), fixes what falls short directly. Does not commit. | `_readme-standard.md`, `{project}/PLANNING.md`, the README | the audited README |
| `projects/review/review-audit.md` | **THE entry point — the only project-review prompt you launch.** Runs **inside a supported agent runtime**, hands-off. Reviews a built project against its PLANNING.md by **vertical slice**: it maps the resources/features, then fans out cold subagents **per slice** — a flow reviewer (quality + correctness + tests) and a security reviewer per backend resource, plus cross-cutting (`persistence-config`, `security-infra`), the frontend features + `frontend-infra`, and one learning-objectives pass — then merges every slice's findings into the backlog. **Auto-committed** — the orchestrator commits the backlog itself, as a docs commit on the active branch (the file is never written by Victor; shared session rules, 2026-07-29), separate from the self-report commit. Ends with a **pipeline self-report** written to `projects/review/_internal/_last-run-report.md` (auto-committed — prompt-system machinery, together with `_run-tracker.md`): the shared five bullets on how the run itself went, read later to decide if these prompts need changing. | its internal pieces (below) | `PROJECT-BACKLOG.md` (per-project task list + per-tier "Last Reviewed" lines), `projects/review/_internal/_last-run-report.md` |
| `projects/review/_internal/_review-standard.md` | *Internal.* The **shared review contract** all pieces read (the two project formats, the per-tier unreviewed-code gate, scope limit, the full code-quality checklist with bad-vs-good examples, the security scope, the correctness scope + severity rule, the test-quality scope, the learning-objectives rubric, the task/priority/effort + backlog format). Not runnable. | — | — |
| `projects/review/_internal/_review-flow-prompt.md` | *Internal (per-slice functional reviewer).* Reviews **one vertical slice** — a backend resource's `model→repository→service→controller→DTO→tests` flow, a frontend feature, or a cross-cutting area (`persistence-config` / `frontend-infra`) — running quality + correctness + test lenses on it; returns a findings table + trace. Does not edit or commit. | `_review-standard.md`, `{project}/PLANNING.md`, that slice's source | findings table (returned to the orchestrator) |
| `projects/review/_internal/_review-security-prompt.md` | *Internal (per-slice security reviewer, full-stack only).* Attacker-hat pass on **one slice** — a backend resource's endpoints (authz/ownership/injection/data-exposure), or cross-cutting `security-infra` (SecurityConfig, JWT, CORS, hashing, secrets) — against `notes/security/coverage/junior.md`; returns a findings table graded by the standard's *confirmed* test (a confirmed finding becomes a High backlog task; one resting only on a silent plan is the Medium "decide and document"), plus a trace. Does not edit or commit. | `_review-standard.md`, `notes/security/coverage/junior.md`, `{project}/PLANNING.md`, that slice's `backend` source | findings table (returned to the orchestrator) |
| `projects/portfolio/portfolio-audit.md` | **THE entry point — the only portfolio prompt you launch.** Runs **inside a supported agent runtime**. The final go/no-go gate per project (last link in the per-project chain): an author + cold-reviewer subagent pair build the project-specific interview-question bank, then the orchestrator computes the verdict and (if not ❌) drafts two CV-bullet options + one GitHub description. A ✅/⚠️ non-dry run pauses once for Victor to choose the single bullet persisted and committed; if ✅ Ready it also updates the GitHub profile README (`dev/portfolio/VMNunez`, separate repo — commit/push printed for Victor). The author+reviewer pair runs **once per bank section**, never on the whole bank. `DRY_RUN = true` leaves the **audit outputs** in the working tree — the pipeline self-report is machinery and commits itself either way. | its three internal pieces (below), `_application-standard.md` for the CV bullet | `interview-prep/projects/{project}.md`, `notes/cv/cv-bullets.md` (one chosen bullet per committed project), `dev/portfolio/VMNunez/README.md` (✅ only), `projects/portfolio/_internal/_last-run-report.md`, one atomic commit after the choice gate when applicable |
| `projects/portfolio/_internal/_portfolio-standard.md` | *Internal.* The **shared portfolio-gate contract** all three pieces read (what the gate is for, the two-check verdict logic, the interview-question quality bar + file template, the CV-bullet and GitHub-description formats, the two project formats). Not runnable. | — | — |
| `projects/portfolio/_internal/_portfolio-write-prompt.md` | *Internal (author).* Dispatched **once per bank section**: reads only that section's code area (the standard's canonical table) + PLANNING.md and writes that section's exhaustive questions to the standard. Does not compute the verdict or commit. | `_portfolio-standard.md`, `{project}/PLANNING.md`, `_shared-context.md` (target companies + interview context), that section's code area | that section of `interview-prep/projects/{project}.md` (working tree) |
| `projects/portfolio/_internal/_portfolio-review-prompt.md` | *Internal (reviewer).* Dispatched **once per bank section**, right after that section's author: an independent second pass over that section only — hunts thin/weak/duplicate questions against the real code and fixes them directly. Returns its questions-vs-decisions ratio, and the uncovered decisions when that ratio is below 1, which is what the orchestrator's one-retry acceptance gate re-dispatches on. Does not commit (the orchestrator bundles the commit). | `_portfolio-standard.md`, the question bank, the project source | the audited `interview-prep/projects/{project}.md` |

### Practice — active recall and timed tests (daily blocks)

Split into three subfolders (2026-07-22) so the right prompt is one glance away instead of one scan
down a flat list of ten files:

| Subfolder | What lives there | When you reach for it |
|---|---|---|
| `practice/sql/` | the SQL exercise track — plan auditor, exercise generator/grader, its standard and run reports | the 12:30 SQL block |
| `practice/simulations/` | timed technical tests — the generator that writes specs, the reviewer that grades them | practising a take-home (stage 3) |
| `practice/interview/` | live interview training — technical mock, HR call, code critique | rehearsing stages 2–4 |

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `practice/sql/_internal/_sql-plan-standard.md` | *Internal.* The **bar `sql-plan-prompt` builds to and `sql-plan-audit` checks against** — the doctrine/route split, the required sections of each file, the ten learning-design checks, the per-step field list, the fifteen consistency invariants, and who owns what. Not runnable. | — | — |
| `practice/sql/sql-plan-prompt.md` | **Orchestrator.** The SQL track's `notes-plan`: turns `notes/sql/coverage/{LEVEL}.md` into an ordered, justified **exercise route** — steps, files, targets, revision points, done conditions — with a `Coverage SHA-256` fingerprint and one cold route reviewer. Plans only: it never generates or grades an exercise, and never touches a `.sql` file. Its one-time migration splits the legacy `PLANNING.md` into doctrine + junior route. | `_sql-plan-standard.md`, `notes/sql/coverage/{LEVEL}.md`, `verify-{LEVEL}.md` (advisory), `notes/coverage/{LEVEL}.md`, `practice/sql/PLANNING.md`, `ROADMAP.md`, the exercise files (counted, never edited) | `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` (+ the one-time doctrine split), and the level's `Exercise route` tables under `PROGRESS.md` `## Practice completed` — seeded in their own commit, separate from the route's |
| `practice/sql/_internal/_sql-exercises-practice.md` · `_sql-exercises-review.md` | *Internal.* The two **branches of `sql-exercises`** — generate-and-save, and grade-and-record. A run is one mode or the other, never both, so the shell reads only the branch its `MODE` names. Not runnable alone: both assume the shell already resolved `{FILE}`/`{COUNT}`/`{FOCUS}` and read the context files. | — | — |
| `practice/sql/_internal/_sql-exercise-seeds.md` | *Internal.* Per-topic **structure and concrete exercise ideas** for `sql-exercises` Step 3 — the traps worth building a question around and each topic's Challenge. A run reads **only its own topic's block**. Scope still comes from `coverage-junior.md`, never from here. Not runnable. | — | — |
| `practice/sql/sql-plan-audit.md` | **Orchestrator.** Audits **and extends** the doctrine (`PLANNING.md`) and one level's route (`PLANNING-{LEVEL}.md`) against `_sql-plan-standard.md` — four cold specialists (learning-design · coverage-and-steps · counts-and-truth · loop-and-fence), each fenced to the file its `Edits` column names, history gate, single commit. `coverage-and-steps` writes the new steps for coverage sections nothing claims yet, so the plan grows as SQL grows. It never writes a route from nothing (that is `sql-plan-prompt`) and never recomputes the fingerprint. The plan it maintains covers **exercises only** — notes, Q&A and simulations are separate tracks Victor runs himself. | `_sql-plan-standard.md`, both plan files, `notes/sql/coverage/{LEVEL}.md`, `ROADMAP.md`, `PROGRESS.md`, `sql-exercises-prompt.md`, the exercise files (as evidence, never edited) | `practice/sql/PLANNING.md`, `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` |
| `practice/sql/sql-exercises-prompt.md` | `practice` mode: generates SQL exercises for the current step. `review` mode: grades my answers, scores them, and logs every ⚠️/❌ concept. `reinforce` mode: extra `[Repaso]` practice over a file I name, counted against nothing and safe on a closed step. Config is exactly five keys — `MODE`, `TOPIC`, `LEVEL`, `COUNT`, `FILE`; focus and review come from the step in `PLANNING-{LEVEL}.md`, never pasted. **Writes no notes and no Q&A** — those are separate tracks. | `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` (the step: topic, count, focus), `notes/sql/coverage/{LEVEL}.md`, `PROGRESS.md`, the exercise files `practice/sql/{LEVEL}/NN-name.sql` | **Mode-conditional — the close-out checks only its own mode's list.** `practice` mode: `practice/sql/{LEVEL}/NN-name.sql`. `review` mode: `practice/sql/MISTAKES.md`, the SQL table in `PROGRESS.md`, `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` — §1 counts, §3 statuses and the §2 `[x]` bullets, the progress fields the planner only preserves — and, **only when the run closes a step**, the doctrine `practice/sql/PLANNING.md` §0's live values (its 4d). Naming the other mode's file as "not applicable" is required; silently counting it as satisfied is not. |
| `practice/simulations/_internal/_simulation-plan-standard.md` | *Internal.* The doctrine/route split, evidence and readiness inputs, route schema, timed-verdict/correction/reinforcement semantics, freshness contract, and fourteen cross-file invariants. Not runnable. | — | — |
| `practice/simulations/simulation-plan-prompt.md` | **Orchestrator.** Turns selected-level coverage plus demonstrated readiness into an ordered Angular / Spring Boot / SQL route. Coverage is the ceiling; project, progress and closed-SQL-step evidence decide what is ready. Preserves attempt history and uses one cold route reviewer. | `_simulation-plan-standard.md`, selected-level topic coverage, `_shared-context.md`, `PROGRESS.md`, `ROADMAP.md`, SQL doctrine/route, existing specs, TRACKER, MISTAKES | `practice/simulations/PLANNING.md` when missing; `practice/simulations/{LEVEL}/PLANNING-{LEVEL}.md` |
| `practice/simulations/simulation-generator-prompt.md` | Materialises the current route step; focus, difficulty, time, track, and path come only from the selected-level route. | simulation doctrine + selected route, standard, existing specs, TRACKER; SQL §8/§8c fence | planned `practice/simulations/{type}/NN-*.md`; TRACKER row/count; route generation/state; doctrine/route §0 |
| `practice/simulations/simulation-review-prompt.md` | Internal canonical cold reviewer dispatched only by `simulation-grade`; the public launcher routes through that skill. First review preserves the timed verdict and opens mandatory corrections; correction mode atomically closes recorded gaps; a Fail hands reinforcement authoring back to `/simulation-plan`; hint mode runs on the partial solution of an attempt still in flight, writes no simulation state, and makes that attempt Assisted. | doctrine + selected route, spec, TRACKER, MISTAKES, PROGRESS, selected-level Q&A, submitted solution/correction | spec + TRACKER history, route + §0, MISTAKES, `PROGRESS.md` timed simulations, selected-level Q&A pair |
| `practice/interview/code-review-prompt.md` | Generates a flawed snippet to critique, grades the review, records performance gaps in the shared interview sink, and turns missed concepts into selected-level Q&A. | snippet generated fresh; selected-level Q&A; `practice/interview/MISTAKES.md` | conditionally: shared interview MISTAKES when a row opens/closes; selected-level interview-prep pair when a current bank receives a missed-concept question; an all-clean run names both no-ops |
| `practice/interview/simulator-prompt.md` | Runs a live mock **technical** interview from one selected-level Q&A bank, scores each answer, and ranks durable weak areas first. | `interview-prep/{LEVEL}/{lang}/*.md`, `interview-prep/projects/*`, session log, shared interview MISTAKES | session log always; shared interview MISTAKES when a row opens/closes, otherwise an explicit no-op |
| `practice/interview/hr-screen-prompt.md` | Runs a live mock **HR** call (stage 2), records weak/red-flag answers in the shared interview sink, and optionally saves polished answers. | profile + situation from `_shared-context.md`, `ROADMAP.md`, shared interview MISTAKES | conditionally: shared interview MISTAKES when a row opens/closes; `interview-prep/hr-screen.md` when Victor accepts polished answers; each no-op is explicit |

### Strategy — keep the plan accurate (`tracking/`) and apply (`apply/`)

Two sub-purposes, two subfolders. `tracking/` keeps the hub files (`PROGRESS.md`, `ROADMAP.md`)
accurate; `apply/` produces the job-application material.

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `strategy/tracking/_internal/_concept-extraction-standard.md` | *Internal.* The Format A/B/C contract for reading a `PLANNING.md`. Two readers, different halves: `progress-update`'s per-project subagent runs Steps 0–2 (step status), `step-complete` runs Step 3 (which field holds a step's concepts). Step 4 is a tombstone. Not runnable. | — | — |
| `strategy/tracking/progress-update-prompt.md` | **Auditor.** Measures PROGRESS.md against what each PLANNING.md declares (never the code — it is blind to it by design) — an orchestrator that fans out one cold subagent per project (+ one for SQL; it reads the small simulations tracker itself). It distinguishes authored/studied consolidation, audits `Study progress`, and checks simulations by level. **Writes `Professional level by topic` only**; every other section has its own writer and is reported as drift. An empty drift report closes gate G6 and SQL G3 — and is what satisfies every `▶ Run first` naming this prompt. | `_concept-extraction-standard.md`, all `PLANNING.md` files, notes plans + current Q&A fingerprints, `practice/sql/`, `practice/simulations/TRACKER.md`, the per-topic coverage files | `PROGRESS.md` (`Professional level by topic` only) · `strategy/tracking/_internal/_last-drift-report.md` (every run, the clean one included — it is the gate's only evidence) |
| `strategy/tracking/_internal/_roadmap-standard.md` | *Internal.* The **shared roadmap contract** `roadmap-review` reads: what ROADMAP is against the three files it references (`PROGRESS.md`, `notes/coverage/junior.md`, `_shared-context.md`), stable vs living sections, gate-based sequencing (no dates), canonical study-block orders, and the no-duplication rule over all three. Not runnable. | — | — |
| `strategy/tracking/roadmap-review-prompt.md` | Keeps ROADMAP forward-looking and gate-based (no stale dates); checks project sequence and study-block tables vs coverage. **Orchestrator:** two cold fact-gatherers (gap analysis + active-PLANNING summary) feed the doer so coverage-junior.md and PLANNING.md never load into its context; the doer applies edits, then two sequential cold reviewers — mechanical (date scan, study order, LeetCode gate; reads ROADMAP + standard, plus the session rules' `Daily study blocks` section for the study order it owns) and cross-file (gaps, gates, SQL table, phase markers) — re-verify the invariants and fix ROADMAP. | `_roadmap-standard.md`, `_shared-context.md`, `_coverage-standard.md` (evidence markers), `_topic-ownership.md`, `notes/coverage/junior.md`, `PROGRESS.md`, the active `PLANNING.md`, `practice/sql/junior/PLANNING-junior.md` §2, `_session-rules.md`'s `Daily study blocks` section (Reviewer 1 only, for the study order it owns) | `ROADMAP.md` |
| `strategy/apply/_internal/_application-standard.md` | *Internal.* The **shared job-application standard** read by `cv`, `linkedin`, `cover-letter`, `tracker`, and `portfolio-audit`: expert stance, sources (incl. `notes/coverage/junior.md` for defensibility and the existing CV in `job-search`), bullet format, ATS/skills keyword pool, Spanish voice rules, defensibility rule (with the marker evidence that decides it), project-selection heuristic. Not runnable. | — | — |
| `strategy/apply/cv-prompt.md` | `create` / `review` / `tailor` the one-page Spanish CV (ATS-checked). `tailor` adapts it to a pasted job offer with a `HAVE / PARTIAL / MISSING` gap analysis, and feeds that offer into the job-market evidence. | `_application-standard.md`, `PROGRESS.md` (status only), `notes/coverage/junior.md` (marker spot lookups), `ROADMAP.md`, `notes/cv/cv-bullets.md`, the existing CV in `job-search/` | Saves the CV to `job-search/` **outside the repo** (never committed, so the close-out checks the path's **mtime is from this run** — existence alone passes on a file an earlier run left): `master/` for create/review, `applications/` for tailor. `tailor` also appends the posting to `notes/prompts/_internal/_job-market-evidence.md` |
| `strategy/apply/linkedin-prompt.md` | Drafts every LinkedIn section + 3 posts, ready to paste. | `_application-standard.md`, `PROGRESS.md` (status only), `notes/coverage/junior.md` (marker spot lookups), `ROADMAP.md`, optional `notes/cv/cv-bullets.md`, existing CV in `job-search/` | **Output only** — LinkedIn text (not stored in the repo). **No repo file, so the close-out has nothing to check: instead name each section actually drafted (headline, about, experience, projects, skills, 3 posts) against the set this prompt owes.** |
| `strategy/apply/cover-letter-prompt.md` | `letter` (formal one-page *carta de presentación*) / `message` (short 5–6 line recruiter message) tailored to a pasted offer, in the same Spanish voice as the CV. | `_application-standard.md`, `PROGRESS.md` (status only), `notes/coverage/junior.md` (marker spot lookups), `ROADMAP.md`, optional `notes/cv/cv-bullets.md`, `job-search/internship-daw.md` (internship stack, named directly), existing CV in `job-search/`, the pasted offer | **Output only** — cover-letter/message text (not stored in the repo). **No repo file, so the close-out names the mode's obligations instead: the letter/message itself, and that it was tailored to the pasted offer rather than generic.** |
| `strategy/apply/profile-readme-prompt.md` | `sync` (pull in fact deltas only) / `optimize` (full re-evaluation against the job target) for the GitHub profile README. The repeatable entry point so the coding agent never needs to be re-briefed on that repo's context each time. | the profile repo's `{platform-adapter}` (standing context + gap list), that repo's `README.md`, `PROGRESS.md`, the active project's `PLANNING.md`, `job-search/internship-daw.md`, optional `notes/cv/cv-bullets.md` | Edits `dev/portfolio/VMNunez/README.md` + the external adapter's gap list directly (separate repo, never committed from here — the close-out checks both paths' **mtime is from this run**, not just that they exist) |
| `strategy/apply/tracker-prompt.md` | `log` a new application / `update` an outcome + feedback / `analyze` the tracker for patterns. Records the job search as data and surfaces skill gaps to feed `evidence-intake`. | `_application-standard.md`, the local tracker in `job-search/` | Writes `job-search/tracker.csv` + `applications/<empresa>-<puesto>/` **outside the repo** (never committed — close-out checks **mtime is from this run**); `analyze` writes nothing, so it names its findings instead of passing on an empty list, and suggests `evidence-intake` |

### System — audit the machinery (`system/`)

| Prompt | What it does | Reads | Generates / updates |
|--------|--------------|-------|---------------------|
| `system/system-check-prompt.md` | **Explicit, global, on-demand machinery audit — never a per-commit gate.** Builds a disk-derived manifest of every canonical runnable prompt and internal contract/component, both launcher catalogues, mirrored skills, the validator, and the two derived maps. It proves every inventory item was read to EOF; partitions each map into spans bounded by both line count and table density, cut only at its own headings; classifies every physical map line exactly once; rules every atomic claim; and reverse-maps the stable ID of every atomic manifest fact under the one-owner split. The rulings are divided across cold concerns that each read the map itself — never a paraphrase of it — and a cold final reviewer independently reproduces both the partition and the physical-line denominator before it may approve a global verdict. Every accepted bounded concern is copied verbatim into a Git-ignored `.system-check/` run directory before its state pointer advances, so a later Codex, Claude, or other conforming session validates the frozen snapshot and resumes at the exact next concern instead of repeating accepted analysis. Its two costs are bounded rather than trimmed: the reverse sweep may discharge a whole `<path class> × <field>` pair with one quoted ownership rule instead of restating it per fact, and `carry-forward` reuses a completed run's proof over unchanged bytes, so the audit can finish across sessions of a machinery that keeps changing. A claim its own source contradicts becomes a ledger row rather than a blocked verdict, and stays one when the run blocks for another cause — unless a reviewer `reject` or the validator reversal contests it, when the blocked report carries it as `unregistered` for the next run to inherit. | canonical prompts and the explicitly enumerated internal prompt/standard/contract set, including the root contract `_session-rules.md` and, beside them, `_shared-context.md` — both audited as machinery here, not read as background — and its own `_system-check-reconcile-prompt.md`; `validate-prompt-system.ps1 -MachineryOnly`; both launcher catalogues; paired skills; both maps; `_recommendation-ledger.md` for its improvement-loop contract and, with `_recommendation-ledger-closed.md`, for deduplicating new findings against work already ruled on; its own previous `_system-check-report.md` when that reads `Status: blocked`, as inherited contradiction evidence only; one explicitly selected `.system-check/` checkpoint as orchestration evidence, never as audit evidence; and, on `MODE = carry-forward`, the most recent `Status: complete` run directory as the anchor whose accepted artifacts are reused wherever their own inputs hash identically, becoming this run's own re-gated evidence. Under `_session-rules.md`'s machinery-only exception it does not open the active project's `PLANNING.md`, backlog or `PROGRESS.md` even for session orientation; all live project/learning/practice/application artifacts, generated reports, trackers, evidence state, notes-plan freshness and debt counts stay outside the inventory | `notes/prompts/README.md`, `_internal/_system-map.md`, `system/_internal/_system-check-report.md`, justified recommendation-ledger rows, and Git-ignored `.system-check/runs/{run-id}/` execution evidence; never source prompts, skills, standards or live artifacts |
| `system/_internal/_system-check-reconcile-prompt.md` | *Internal.* The **mandate of one bounded Step 4 reconciler**: `DIRECTION = claim` rules one contiguous span of one map against the accepted manifests, `DIRECTION = evidence` rules one manifest concern's facts against both maps. It owns what counts as a claim in each map, the four claim dispositions (`correct` · `incorrect` · `source-contradiction` · `unverifiable`), the three reverse dispositions and the class ruling that lets one quoted ownership rule discharge a whole `<path class> × <field>` pair as `source-only` without dropping a fact from the denominator, and the return contract the orchestrator gates on. Read by the concerns, never by a launcher. Not runnable. | — | — |
| `system/system-gaps-prompt.md` | **Finds what the machinery does not cover, from the two derived maps alone.** Builds a typed edge ledger — writes, reads, fires-on, follows, gates, clears, hands-off — by reading both maps to EOF itself, then runs ten named detectors over it: unwritten file, orphan output, cold-only writer on in-session state, unrecorded event, broken handoff, ownerless gate, uncleared debt, unrouted symptom, contested write with no order, unreachable machinery. Every candidate is discharged by a quoted licence sentence or survives with a disposition; a finding resting on absence names **both** branches (the machinery lacks it · the maps omit it) and the one file that would settle it, because this prompt may not open that file. One cold independent analyst re-runs the detectors, one cold reviewer gates the ledger rows. Deliberately cheap and re-runnable: it is the counterpart of `/system-check`, which reads the machinery and asks whether the maps are *true* | `notes/prompts/README.md` and `_internal/_system-map.md`, whole; `_recommendation-ledger.md` (its `## Open` rows) and `_recommendation-ledger-closed.md` beside it (the resolved half, including **rejected** rows), for deduplication only; its own previous report. **Nothing else — no prompt, skill, standard, launcher, validator or live artifact, not even the file a finding is about** | `system/_internal/_system-gaps-report.md` (every candidate, always) and at most five new `## Open` rows in `_recommendation-ledger.md`; **never a map, a prompt, a skill or any live artifact** — a finding that is a map defect is routed to `/system-check` or `map-sync` |

---

## How the prompts feed each other

The key thing to understand: **several prompts consume files that other prompts generate.** If a
producer has not run (or is stale), its consumers produce wrong results. Run producers first.

Each generated file, with who writes it and who depends on it:

- **`notes/coverage/junior.md`, `notes/coverage/middle.md`, `notes/coverage/senior.md`** — written by
  `coverage-prompt` / `coverage-audit-prompt`. Level-aware notes and interview-prep consume the selected
  mirror; current project planning, roadmap review, and SQL practice intentionally consume junior.
  *Coverage is the root — downstream work assumes the selected level is correct.*
- **`notes/{topic}/coverage/verify-{LEVEL}.md`** — written by `coverage-verify` (verdict + level-targeted
  findings, stamped with the selected coverage SHA only — earlier levels carry no field of their own) → read by `notes-plan` as an **advisory** gate (a missing, `gaps`, or
  stale verdict is recorded in the plan and its report, but never stops the run) and by `coverage-prompt`
  update, which consumes the open gaps as proposed items — from this file at its own level, and from a
  sibling `verify-*.md` for gaps that verification targeted at an earlier level.
  *The completeness checkpoint between coverage and the study map.*
- **`notes/prompts/_internal/_job-market-evidence.md`** — written by `evidence-intake` (dedicated intake) and
  `cv-prompt` (tailor mode, as it tailors to each offer) → read by `coverage-prompt`, `coverage-audit`,
  and both their subagents, plus `interview-prep-audit`'s market-analysis stage. *Real postings that
  anchor coverage and the interview Q&A to the market.*
- **`PROGRESS.md`** — written **per section by the closing rituals** in the daily session, each owning its
  own cell (`study-block-close` owns `Study progress`); `progress-update` writes only `Professional level by topic` and *audits* the rest, reporting
  drift with the owner to re-run (demoted 2026-08-05, REC-039) → read by `plan-audit`, `roadmap-review`,
  `project-brief`, `review-audit`, `cv`, `linkedin`, `sql-exercises`. *Stale PROGRESS = the wrong next
  project in `project-brief` and a wrong gap analysis in `roadmap-review`.*
- **`projects/briefs/project-brief-{NN}.md`** — written by `project-brief` → read by `plan-audit`
  (`MODE = new`, which refuses a hard-stale one), by its author half instead of the coverage mirror, and
  by the `steps-tests` specialist as the authority for §3/§4. Its `## Gaps left for the next brief` is
  the starting input for the following project's brief. *ROADMAP proposes · the brief decides ·
  PLANNING builds.*
- **`{project}/PLANNING.md`** — written by `plan-audit` (new mode) → read by `readme-audit`,
  `review-audit`, `portfolio-audit`, `progress-update`, `roadmap-review`. *It is the contract
  the whole project is checked against.*
- **`PROJECT-BACKLOG.md`** — written by `review-audit` (the tasks), by the two backlog skills
  (`⏸ Deferred` / `## Closed`), and by `plan-audit`'s `whole-plan` specialist where a task contradicts a
  plan decision → read by `portfolio-audit` (open High/Medium tasks block the "ready" verdict, and its
  per-tier `Last Reviewed` lines stop the gate outright when one reads `never` or carries
  `(incomplete — …)`), by `review-audit`'s own next-run gate, by both §0 rituals deriving `Next gate`,
  and by whoever ticks §23's G3/G4 boxes, which quote those same lines.
- **`notes/cv/cv-bullets.md`** — written by `portfolio-audit` with one chosen, polished bullet per
  committed project → read by `cv-prompt`, `linkedin-prompt`, `cover-letter-prompt`, and
  `profile-readme-prompt` as application/profile evidence.
- **`interview-prep/{LEVEL}/en/*.md` + `{LEVEL}/es/*.md`** — written by `interview-prep-audit` (the
  whole bank), `simulation-review` and `code-review-practice` (born-unrefined insertions only, under
  the standard's "Adding questions from outside the audit"), `study-content-writer` (unrefined, reopened
  or refining content), and `study-block-close` (`[studied]` only) → read by `interview-prep-route`,
  `interview-prep-block-open`, `simulator` and `progress-update`.
- **`interview-prep/routes/{LEVEL}.md`** — written only by `interview-prep-route` → read by
  `interview-prep-block-open`, `study-block-close`, and `progress-update`.
- **`interview-prep/projects/*.md`** — written by `portfolio-audit` → read by `simulator`.
- **`practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`** — written by `sql-plan-prompt`, audited and extended by
  `sql-plan-audit`, and advanced by `sql-grade`'s subagent (§1 counts, §3 statuses, §2 `[x]` bullets)
  → read by `sql-exercises` (every run takes its topic, count and focus from the
  current step). *This is the SQL track's contract, the same role a project's `PLANNING.md`
  plays, and its `Coverage SHA-256` is what says whether it still maps the whole checklist.*
- **`practice/sql/PLANNING.md`** — the level-neutral **doctrine** (step loop, done-condition formats,
  closing ritual, revision mechanism, gates, invariants), whose **rules** are written by
  `sql-plan-audit` while its **§0 live values** are rewritten by the grading subagent on every step
  close and verified by `sql-step-close` (and `sql-plan-prompt` performed the one-time split that
  created it) → read by every
  SQL prompt and skill and by `simulation-plan` / the route-driven `simulation-generator`, which take
  their closed-step fence and technique mapping from §8/§8c. One doctrine, three routes.
- **`practice/sql/MISTAKES.md`** — two writers, split by section: graded gaps in `## Open` / `## Closed`
  from the grading run (`sql-grade`'s subagent, and the legacy `/sql-exercises MODE = review` door that
  reaches the same branch) — one row per failed concept, with its `notes/sql/coverage/{LEVEL}.md`
  section and how many times it has come back — plus friction-without-failure in `## Fricción` from
  `sql-block-close`
  → read by the revision points the level's route §1 declares, on the doctrine `PLANNING.md` §8b
  mechanism: their focus is the open rows, highest count first, and the friction rows when a span has
  none open.
- **`practice/simulations/{LEVEL}/PLANNING-{LEVEL}.md`** — written by `simulation-plan`, then advanced by
  `simulation-generator`, `simulation-review`, `simulation-block-close`, and their skills → read by
  every simulation prompt/skill. *Coverage says what is in scope; this route says what is ready and next.*
- **`practice/simulations/PLANNING.md`** — the level-neutral timed-attempt doctrine and §0 pointer,
  created once by `simulation-plan` and advanced by the simulation rituals. One doctrine, three routes.
- **`practice/simulations/{type}/NN-*.md`** (the test specs) — written by `simulation-generator` (and the
  original bank by hand), with attempt headers updated by `simulation-block-close` / `simulation-review`
  → read by Victor, `simulation-block-open`, and the cold reviewer.
- **`practice/simulations/TRACKER.md`** — written by `simulation-generator`, `simulation-block-close`, and
  `simulation-review` → read by `progress-update`, the plan, and the simulation rituals.
- **`practice/simulations/MISTAKES.md`** — graded gaps from `simulation-review` plus friction-without-failure
  from `simulation-block-close` → read by planning, opening, correction review, and revision points.
- **`practice/interview/MISTAKES.md`** — written and consumed by `simulator`, `hr-screen`, and
  `code-review-practice`; each surface retries its own open rows and closes them only on demonstrated
  clean performance. Timed build simulations remain in their rubric-specific sink above.
- **`interview-prep/SESSION-LOG.md`** — written and read by `simulator` (tracks weak areas between
  sessions).
- **`interview-prep/hr-screen.md`** — optionally written by `hr-screen` when Victor accepts polished
  stage-2 answers → read by Victor to review those answers before a real HR call. It is a human study
  aid, not an input to later `/hr-screen` runs; retries consume open `hr-screen` rows from
  `practice/interview/MISTAKES.md` so the mock remains unscripted.

Pipeline view:

```
coverage-prompt / coverage-audit ─► notes/coverage/{junior|middle|senior}.md
        │
        ├─► notes-plan ─► notes-audit (one TOPIC + LEVEL + NOTE) ─► en-author → en-reviewer → translator → es-reviewer ─► one EN/ES pair ─┐
        ├─► interview-prep-audit ─► unrefined Q&A ─► Victor refines ─► interview-prep-route
        │                                                             │
        │                                      interview-prep-block-open ─► study-block-close
        │                                                             │
        ▼                                                             ▼
progress-update ─► PROGRESS.md ─► plan-audit ─► {project}/PLANNING.md   simulator
                        ▲                              │                  ▲ (reads Q&A)
                        │            ┌─────────────────┼───────────────┐ │
                        │            ▼                 ▼               ▼ │
                        │     readme-audit     review-audit   portfolio-audit
                        │     README(s)         PROJECT-BACKLOG  ─► cv-bullets ─► cv-prompt
                        │                                          └► interview-prep/projects ┘
                        └─ roadmap-review ─► ROADMAP.md

Practice (its own loop, fed by coverage):

  notes/sql/coverage/{LEVEL}.md ─► sql-plan ─► PLANNING-{LEVEL}.md ─┬─► sql-exercises ─► NN-*.sql
                                                  ▲          ▲       │     └─► MISTAKES.md ─┐  ◄─ sql-block-close
                                    sql-plan-audit┘          └── the R1–R5 revision points ◄─┘
                                    (+ PLANNING.md,                │
                                       the doctrine)               └─► simulation-generator (sql)
                                                                          (only closed steps)

  coverage + PROGRESS ─► simulation-plan ─► PLANNING-{LEVEL}.md ─► simulation-generator ─► spec
                                                        │                              │
                                                        └─► open ─► timed attempt ─► close ─► simulation-grade
                                                                                               │
                                                   MISTAKES ◄─ correction loop ◄─ simulation-review
                                                                                               └─► TRACKER + PROGRESS + topic Q&A
```

---

## Typical run order

**Starting a new project**
1. `progress-update` — confirm PROGRESS.md is accurate first; repair anything its drift report names
   before moving on, using the owner it names
2. `project-brief` — decide *which* project, on one page, with a cold second opinion. Optional as a
   separate run: `plan-audit` dispatches it as Phase 0 if you skip it. Run it separately when you want
   to think a project ahead, or to contest a choice before any design work exists
3. `plan-audit` (`MODE = new`) — plan it, get PLANNING.md (author + reviewer, hands-off)
4. build it, step by step (daily sessions)
5. `review-audit` — run the backend and frontend review gates when each tier is complete
6. fix every open High from those reviews
7. `readme-audit` — reconcile the README(s) after the reviewed implementation is stable
8. `progress-update` (`MODE = active`) — its drift report must be empty
9. `portfolio-audit` — final gate before adding the project to CV/LinkedIn
10. `roadmap-review` after a ✅ Ready portfolio verdict

**Auditing knowledge (one topic)**
1. `coverage-prompt` — define/refresh exactly one topic and level (Angular and Angular Material separately)
2. `coverage-verify` with the same `TOPIC + LEVEL` — check that the coverage is complete for the job
   target before it becomes a study map; a `gaps` verdict feeds `coverage-prompt` update. Advisory: you
   can run `notes-plan-prompt` without it, and the plan records that the coverage was unverified
3. `notes-plan-prompt` with the same `TOPIC + LEVEL` — generate or refresh the persistent study map
4. `notes-audit` with `TOPIC + LEVEL + NOTE` — build exactly one planned English/Spanish pair
5. Repeat `notes-audit` for every pending plan entry, in dependency order, until the selected
   `notes-plan-{LEVEL}.md` contains only `Status: complete` (or `refined`)
   - **Freezing a note you have polished:** once you have taken a pair to your own bar with TODOs, set
     its plan entry to `Status: refined` by hand. No prompt sets, clears, or downgrades that status, and
     from then on the existing prose in `en/` and `es/` is immutable to the whole pipeline. The entry's
     existing `[x]` `Coverage concepts` also become locked: coverage may still gain new bullets or evidence
     markers, but those assigned concepts are never reworded, reordered, moved between sections/topics/
     levels, or deleted. A `pending` or merely `complete` entry does not create that coverage lock. If coverage
     later adds a bullet to that entry, `notes-plan` records it as `[ ]` and under the entry's `Pending additions:`
     instead of reopening the entry, and `notes-audit` runs in append-only mode: it appends the new
     sections in both languages, proves with a diff that it changed nothing else, marks the consumed
     concepts `[x]`, clears the queue, and leaves the status `refined`. Set it back to `pending`
     yourself to unfreeze it.
6. `interview-prep-audit` with the same `LEVEL` and topic `FILE` — build the isolated, unrefined level
   Q&A from current coverage + market evidence; the plan must be current, but junior entries may still
   be pending
7. As Victor learns the supporting notes, refine questions in session; only his explicit
   `[refined]` transition freezes a bilingual question block
8. After every required topic bank for the level is current, run `interview-prep-route` to build the
   globally weighted CORE order
9. `interview-prep-block-open` asks one refined CORE question at a time; `study-block-close` writes
   `[studied]` only after a final PASS
10. After all topics have that level, run `coverage-audit`, then `roadmap-review`

The unit changes at each stage: coverage and planning process one **topic + level**; `notes-audit`
processes one **planned file pair**; `interview-prep-audit` processes one **topic + level** Q&A bank
(deep work remains one section per agent); `interview-prep-route` processes the complete selected-level
bank inventory. Authoring, refinement and study are deliberately separate states.

**The SQL track (the daily 12:30 block)**
1. `coverage-prompt` (`TOPIC = sql`) → `coverage-verify` → `coverage-prompt` again to close the gaps —
   only when coverage is stale; it is the root of the plan
2. `sql-plan` (`LEVEL = junior`) — turns that coverage into the ordered route in
   `practice/sql/junior/PLANNING-junior.md`, fingerprinted. Re-run it when coverage grows
3. `sql-plan-audit` — audits the route and the doctrine, and extends the route with steps for coverage
   sections nothing claims yet. Re-run it when a step closes or the plan feels out of date
4. per step, in the block itself: `sql-exercises` (`MODE = practice`) → answer them in pgAdmin →
   `sql-exercises` (`MODE = review`) to grade. The step's topic, count and focus come from the route
5. at each revision point R1–R5 (every 3 scored files): `sql-exercises` again, focused on the open
   rows of `MISTAKES.md`
6. once the SQL simulation readiness gate opens, `simulation-plan` admits only techniques from closed
   steps; its route-driven `simulation-generator` independently rechecks the same §8c fence
7. after the last step: `progress-update`, then `roadmap-review` — then `sql-plan` for the next level

**The timed-simulation track**
1. `progress-update` — repair its drift first; readiness cannot be planned from a stale level matrix
2. `simulation-plan` (`LEVEL = junior`) — maps selected-level coverage plus demonstrated project/SQL
   evidence into `practice/simulations/junior/PLANNING-junior.md`
3. `simulation-block-open` — recomputes the route manifest/progress snapshot, then names the one current
   step, spec, timer, conditions, and correction gate
4. if the planned spec does not exist, `simulation-generator` materialises exactly that route step
5. complete the test under timer conditions, then `simulation-block-close` records explicit
   attempted/Assisted state, time, self-assessment, and friction already stated
6. say `corrige la simulación` — `simulation-grade` is the only door and dispatches the canonical
   reviewer cold. Pass closes unless the review opened correction rows; Borderline/Fail always open
   them, without changing timed evidence
7. fix only those rows and say `corrige las correcciones`; a corrected Fail or reviewed Assisted attempt
   becomes `reinforcement-required`. `simulation-plan` resolves the stable IDs from MISTAKES Closed (or
   the original focus for a clean Assisted attempt), authors the linked successor, and that test's Pass
   closes both learning states without rewriting the original verdict
8. when every route step closes with no open correction and every admitted track has a Pass, run
   `progress-update`, then plan the next level

**The code-review-practice track**
1. Once ROADMAP's 12:30 block reaches `Stage 2 — Technical test simulation`, include
   `/code-review-practice` alongside the route-driven timed simulations. It trains reviewing
   unfamiliar, deliberately flawed code; it is not a timed route step and does not count toward the
   15-simulation target.
2. Choose `TYPE` and `LEVEL`. The prompt is self-contained and has no prerequisite. When
   `practice/interview/MISTAKES.md` has open `code-review` rows for that level, leave `FOCUS` blank so
   those concepts are planted first; otherwise set `FOCUS` to the concept being consolidated or leave
   it blank for a market-relevant mix.
3. Review the snippet without hints, then let the prompt grade missed issues and false positives. It
   opens or updates a durable gap row for every missed issue or false positive; a row closes only when
   its deliberately replanted issue is correctly identified and explained. A current Q&A bank receives
   born-unrefined questions. With a stale or missing bank, the prompt writes nothing, prints the
   deduplicated proposed questions in chat, and names `interview-prep-audit` as what clears the bank gate.
4. Repeat until the selected level has no open `code-review` rows, then rotate `TYPE` or raise
   `DIFFICULTY`. This is separate from the end-of-feature review of Victor's own diff in
   `_session-rules.md`.

**The HR-screen practice track**
1. When application work starts, or a real HR call is scheduled, run `/hr-screen` before that first
   call. It is self-contained and defaults to the Spanish screen used by the target consultancies.
2. Answer the live questions without a script. The prompt records every weak or red-flag answer as an
   `hr-screen` row in `practice/interview/MISTAKES.md`; saving polished answers is optional.
3. Before later calls, repeat `/hr-screen` while that sink still has open `hr-screen` rows. The prompt
   asks those concepts first, and a clean deliberate retry closes each row.
4. Keep this route separate from `/simulator`: `/hr-screen` rehearses non-technical stage 2;
   `/simulator` rehearses the technical interview.

**Applying**
1. `portfolio-audit` on each finished project (produces cv-bullets)
2. `cv-prompt` → one-page CV · `linkedin-prompt` → profile + posts
3. Per offer: `cv-prompt` `tailor` + `cover-letter-prompt` → then `tracker-prompt` `log` to record it
4. As results come in: `tracker-prompt` `update` (outcome + feedback), then `analyze` → gaps feed `evidence-intake`

**Auditing the machinery**

- Run `system-check` only when Victor explicitly asks for it, normally after a substantial group of
  prompt/skill changes or before a deliberate whole-system refinement pass.
- Accepted manifests and reconciliation concerns persist under Git-ignored `.system-check/`; changing
  from Codex to Claude validates and resumes the same run rather than repeating accepted work.
- Default `MODE = carry-forward` anchors on the last `Status: complete` run and re-derives only the
  concerns whose own inputs changed, so a machinery that changes daily stays auditable; `MODE = full`
  derives everything in one run. Neither narrows the inventory, the denominators or the verdict.
- It audits the complete machinery and the two documents derived from it. It may record that a prompt
  reads or writes a `PLANNING.md`, backlog, SQL route, notes plan, tracker or application artifact, but
  it never opens those live artifacts, counts their state, or lets them enter the denominator or block
  the verdict. Their own task, step, SQL, practice and application rituals own operational truth.
- It is not part of the daily workflow and never runs before ordinary commits. `map-sync` remains the
  incremental change/read ritual; the PowerShell validator remains the token-free structural check.
- `system-gaps` asks the opposite question and pays a fraction of the price: not *are the maps true*, but
  *does the system they describe have holes*. It reads only the two maps, so it can be run whenever the
  machinery has grown — after a batch of ledger items, after a new ritual — without the token cost that
  keeps `system-check` explicit and rare. It never corrects a map: a candidate that turns out to be a map
  defect is handed back to `system-check` or `map-sync`, which are the two things allowed to read the
  file that would settle it.

---

## Batch mode — run a prompt on every target at once

Per-target prompts (one topic / file / project / type at a time) also accept **`all`** in their
target field, so you don't have to run them folder by folder. Set the field to `all` and the prompt
processes every target in order, one commit per target. Full rules: `notes/prompts/_internal/_batch-mode.md`.

- **Supports `all`:** `interview-prep-audit` (`FILE = all`); `readme-audit`, `review-audit`,
  `portfolio-audit` (`PROJECT_PATH = all`); `plan-audit` (`PROJECT = all`, **review mode only**);
  `sql-exercises` (`TOPIC = all`, **practice mode only**), `/code-review-practice` (`TYPE = all`).
- **One target only:** `coverage-prompt`, `coverage-verify`, `notes-plan-prompt`, `notes-audit`,
  `interview-prep-route`,
  `simulation-plan`, `simulation-generator`, and `project-brief` (one decision/route step per run).
- **Already global (no `all` needed):** `coverage-audit`, `roadmap-review`, `system-check`, `system-gaps`, `cv`,
  `linkedin`, and `simulator` full mode — these cover everything in one run by design.
  `progress-update` defaults to `MODE = active` (only the in-progress project); set `MODE = all`
  for the full global pass.
- **Single-shot (not batchable):** `simulation-review` and `hr-screen` — each needs your pasted code
  or a live back-and-forth, so they run one at a time.

---

## Runtime-neutral reasoning tiers

Every orchestrator specifies a canonical reasoning tier on each dispatch. Platform adapters decide
how that tier is fulfilled; canonical prompts never name a vendor model or agent API. The criterion:

> **If the output's quality is guaranteed by structure — an explicit standard, a report contract, a
> trace gate that rejects incomplete work — tier down. If it is guaranteed only by judgment — writing
> prose, designing, translating, deciding what matters — use `deep`.**

- **mechanical** — pure command-running and deterministic formatting.
- **standard** — pattern-matching and conformance against an explicit standard: concept extraction,
  notes inspect/translate/es-review, README review + consistency check, roadmap fact-gathering.
- **deep** — everything that authors, rewrites, or judges: plan author + advisor + specialists,
  notes/README/interview-prep authors, portfolio author + reviewer, roadmap reviewers, and project
  flow/security reviewers.

A new prompt must pick a canonical tier per dispatch. Re-tiering an existing dispatch needs a real
run's self-report as evidence, per the frozen-prompts rule.

---

## Gaps — closed, and what is left

The three gaps detected against the goal (junior Angular + Spring Boot at a Spanish consultancy by
Aug–Sep 2026, per the market analysis in `_shared-context.md`) are now **built**:

- ✅ **`practice/interview/code-review-prompt.md`** — trains the stage-3 code-review step (critique a flawed,
  often AI-style snippet). Was the biggest blind spot: nothing else hands me broken code to review.
- ✅ **`practice/simulations/simulation-generator-prompt.md`** — produces new timed test specs in the existing
  format, so the bank is no longer fixed at 15 and I can drill a weak type on demand.
- ✅ **`practice/interview/hr-screen-prompt.md`** — covers the non-technical stage-2 HR call (motivation,
  career-change story, availability, salary), which only had a one-line touch in `simulator`.

Still intentionally **not** a prompt:
- **English / Cambridge prep** — tracked in a separate private repo, out of scope for this folder.
