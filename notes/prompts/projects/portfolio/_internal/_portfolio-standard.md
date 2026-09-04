# Portfolio-readiness standard — the shared contract

**Internal component. Not runnable.** This is the single source of truth for the **portfolio gate**:
the final go/no-go check on a project before it goes on the CV, LinkedIn, or into a job application.
All four pieces of the portfolio pipeline read it:

- `_portfolio-write-prompt.md` (the **author**) reads it for the interview-question quality bar.
- `_portfolio-review-prompt.md` (the **reviewer**) reads it to audit the question bank against that bar.
- `_portfolio-translate-prompt.md` (the **translator**) reads it for the file template and the bank's
  section list; the Spanish rules themselves are not here, they are in that prompt.
- `portfolio-audit.md` (the **orchestrator**) reads it for the verdict logic and the CV / GitHub formats.

**One reader from outside the pipeline**, listed here rather than left as an unnamed exception — exactly
as `_interview-prep-standard.md` lists this family's translator as its own: `study-content-writer`, the
in-session skill, reads **"Question identity, the refined freeze and the TODO channel"** when it resolves
a `TODO:` Victor wrote in a project-bank pair. That section is the whole of what binds it here; the rest
of this file is the gate's contract and none of its business.

## What the portfolio gate is for

It answers one question: **is the project at `{PROJECT_PATH}` ready to show a recruiter and reference
in a job application right now — not "ready eventually", ready today?** It produces four things:

1. A bank of **project-specific interview questions**, as an `en/` + `es/` pair (saved regardless of
   the verdict — they are useful prep even for an unfinished project).
2. A **go/no-go verdict** (✅ Ready / ⚠️ Almost / ❌ Not ready).
3. If the verdict is not ❌: a **CV bullet** (Spanish, reused as-is by `cv-prompt`) and a **GitHub repo
   description** (English).
4. If the verdict is ✅ Ready: a **direct update of Victor's GitHub profile README**
   (`dev/portfolio/VMNunez`, a separate repo). Format: match that README's existing style and sections
   exactly; add or refresh the project's entry (name, one-line pitch, stack, links). Never committed
   from the learning flow — the orchestrator prints the commit + push commands for that repo
   (procedure: `portfolio-audit.md`, Phase 3).

This is the closing project gate, **G7**, and the last one that reads the project itself. Its place is
`_planning-standard.md` §23's prerequisite chain, quoted from the file that owns the gate order and
every trigger: `G3/G4 → fix the Highs → G5 → G6 → G7 → G8`. That is, `review-audit` and its High
fixes, then `readme-audit`, then a clean `progress-update`, then this gate, then `roadmap-review`.
**That places
the gate; it is not the prerequisite a given run owes** — `portfolio-audit.md`'s `▶ Run first` states
that, with the scope that qualifies it. And G3/G4 is not decoration in this file: Check 2 below stops
the gate outright on a tier no reviewer finished.

---

## Two project formats

- **Full-stack projects (07+)** — Spring Boot + Angular + PostgreSQL. Read the backend + frontend
  source, tests, `application.properties`, `docker-compose.yml`.
- **Angular-only projects (01–06)** — closed. Read routes, config, page components, services, guards,
  interceptors.

Derive the type from the project number (01–06 Angular-only, 07+ full-stack) — never ask.

---

## Bank sections → code areas (canonical table)

The question bank has **five fixed sections**, each mapping to a distinct code area. This is the single
source of that mapping — the orchestrator and both subagent prompts reference it, never their own copy:

| Section | Code area to mine / walk |
|---|---|
| Architecture & Patterns | structure + layered architecture; backend controllers/services, or angular routes/config/components |
| Security & Auth | backend security folder + JWT filter; angular guards/interceptors — **skip if the project has no auth** |
| Business Rules | service logic + validation + PLANNING.md §8 business rules |
| Technical Decisions | tradeoffs in PLANNING.md, DTOs, HTTP status choices, config/properties |
| Testing | the test files (`src/test/java`, `**/*.spec.ts`) — **skip if the project has none** |

---

## Verdict logic

Two checks, run in order. **Check 1 gates Check 2.**

### Check 1 — Feature completeness (from PLANNING.md)
Read `{PROJECT_PATH}/PLANNING.md`, find the step-by-step plan (Section 0 or the steps list). Are all
steps marked complete?
- **Any step incomplete → ❌ Not ready.** List the incomplete steps and stop — do **not** check the
  backlog. A partially built project is not portfolio-ready regardless of code quality.

### Check 2 — Code quality (from PROJECT-BACKLOG.md)
Only if all steps are complete. Read `{PROJECT_PATH}/PROJECT-BACKLOG.md` (full-stack keeps its own
backlog inside its folder), **and read its per-tier `**Last Reviewed — «tier»:**` lines before a single
task is counted**. Stop the gate on any of the four states `_review-standard.md`'s unreviewed-code gate
lists — **no file · no header · a tier line reading `never` · a date carrying an
`(incomplete — «slice» not reviewed)` qualifier** — quoted from that gate, never re-derived here, because
two readings of one line is the drift worth a pointer. Each means code no reviewer opened, so the task
list is short by whatever that code would have produced and a count over it is not a quality verdict.
Report what is
owed: "no PROJECT-BACKLOG.md — run `review-audit` first" · "PROJECT-BACKLOG.md has no
`**Last Reviewed — «tier»:**` header — run `review-audit` first" · "«tier» tier not fully reviewed — run
`review-audit REVIEW_SCOPE = «tier»` first", quoting the tier's line in that last case, the only one of
the three that has one. `n/a — Angular-only` is not one of the four — it is a tier the project does not
have.

**A stop is not a verdict.** No ✅/⚠️/❌, Phase 3 skipped exactly as on ❌, the question bank still
committed (questions are saved regardless of the outcome), and the project's `_run-tracker.md` cell
records `blocked`. In `PROJECT_PATH = all` the summary row carries the stop in its Verdict cell and the
batch continues.

**These four are what a file can show; a fifth shape it cannot show belongs to §23's G3/G4 boxes.** A
run that loses **every** slice of a tier stamps nothing (`_review-standard.md`, the three stamping
shapes), so the old line stands — a plain date over code nobody re-read, indistinguishable here from a
complete review. That is why the boxes ask for *that run's date*, and why this check never treats a
plain date as its own business. **On Angular-only projects (01–06) there is no §23 at all**, so the four
states are the whole test there and the fifth has no catcher: they are closed, single-tier and not
expected to be re-reviewed.

Otherwise apply:
- Any open **High** `[ ]` task → **❌ Not ready.** List every blocking task. Do not proceed to CV /
  GitHub.
- Only open **Medium** `[ ]` tasks → **⚠️ Almost ready.** List them; the project can be shown but
  mention the limitations if asked.
- No open High or Medium → **✅ Ready.** Show it to a recruiter today.
- Open **Low** tasks do not affect the verdict — ignore them.

**Two sanity scans before the verdict is final** (report each as a one-line note, never auto-fix):
- **Resolved-but-unchecked tasks.** Every `[ ]` counts as open. For each open High/Medium task, glance
  at the real code — if it looks already done, flag it ("task X marked open but appears resolved —
  check it off in the backlog and re-run"). Never silently treat it as done.
- **Unfilled visual placeholders.** Scan the global README for `*(screenshot — … — to be added)*` /
  `*(GIF — …)*` placeholders. If any remain, **downgrade a ✅ to ⚠️** and list them — a README full of
  unfilled visuals is not recruiter-ready.

> Unchecked tasks count as open even if the code is already fixed — the verdict reads the backlog
> directly. Before running the gate, tasks already fixed should be checked off (✅) in the backlog.

### Verdict definitions
- **✅ Ready** — all steps complete, no open High or Medium. Include it in the CV and LinkedIn now.
- **⚠️ Almost ready** — all steps complete, open Medium tasks remain. List them as checkboxes.
- **❌ Not ready** — incomplete steps or open High tasks. List them as checkboxes. Skip the CV bullet
  and GitHub description entirely.

---

## Interview-question quality bar

The question bank is a **bilingual pair**: `notes/interview-prep/projects/en/{PROJECT_NAME}.md` and
`notes/interview-prep/projects/es/{PROJECT_NAME}.md` (`{PROJECT_NAME}` = the last path segment, e.g.
`07-timetrack`, and **the same filename in both** — the project folder is an identifier, not prose, so
it is never translated, exactly as the levelled banks keep `angular.md` in `en/` and `es/`). It
complements the levelled topic-based files in `interview-prep/{LEVEL}/en/`
and `es/` — these are **project-specific**, about the actual implementation decisions made here.

**`en/` is authored and audited; `es/` is produced from it and no *pipeline role* writes it by hand.**
The quality bar, the exhaustiveness rule, the format and the append/dedupe rule are rules about `en/`,
and the author and the reviewer are never dispatched at the Spanish file. **Two things below are not
rules about `en/` and must not be read as though they were**: the `[refined]` freeze binds both
languages at once, and the TODO channel is `es/`-first by design — Victor studies from the Spanish, so
that is where his markers appear and, under the direction rule, where their repair is written. Both are
in "Question identity, the refined freeze and the TODO channel" below, and the hand that writes them is
his and `study-content-writer`'s, never this pipeline's. The twin is
owed by `_portfolio-translate-prompt.md` (stage **T**), which runs once per project after every section
is finished and carries the whole Spanish contract: natural Spanish, structural parity, and which side
a `TODO:` marker is repaired on. A run that stops before stage T leaves the pair half-built, and the
orchestrator declares that rather than hiding it.

**Why the bank is authored in English and studied in Spanish.** Victor answers out loud in Spanish, so
`es/` is the file that matters at the moment of use; `en/` is authored first because the code, the
identifiers and PLANNING.md are English, and a question mined from them is written once in the language
of its own evidence and then rendered. That is the order the notes family already runs, and it is why
translation is its own stage rather than one more instruction to an author who has just spent its whole
context walking Java.

**Every question must:**
- Target a **decision, a pattern, or a gotcha** — never "what is X". It must be answerable only by
  someone who actually wrote or understands this specific code.
- Come from the real files: PLANNING.md's new/review concepts, business rules, architecture decisions
  and tradeoffs; and the actual source. Target the companies and the interview context from the profile
  in `_shared-context.md` (NTT Data, Capgemini, and similar) — it is the source for those facts, and
  `ROADMAP.md` states no target this bar needs that it does not.

**Model answer:** 2–4 sentences, references the **actual implementation** (not a textbook
definition), and uses "I chose" / "I decided" — not "it is used".

**Exhaustiveness — the highest-value rule.** Generate as many questions as there are real decisions and
patterns to defend. **Do not cap at 5.** Cover every decision, every pattern, every business rule, and
every testing choice that could come up in a 30-minute technical interview. *A thin file is a gap the
interviewer will find.*

### Question identity, the refined freeze and the TODO channel

**Scope extension ruled by Victor 2026-08-29** (`REC-180`): the two Q&A banks **behave practically
identically** — only the source (a project's own code, not a topic) and the question type differ — so
every rule of `_interview-prep-standard.md` transfers here unless it is structurally impossible. What is
structurally impossible is everything keyed to a `{LEVEL}` route: the CORE route,
`interview-prep-block-open`, `study-block-close`'s recount, the coverage fingerprint. A project bank has
no level and sits on no study route, so **`[studied]` is not admitted here.** That marker's three
rulings — whether the route lists project questions at all, whether `study-block-close` may write into a
file this standard governs and its own does not, and whether `PROGRESS.md`'s `## Study progress` rows
count them — are open in `REC-180`, and a marker nobody recounts is a state that lies.

**Transfer decided where the rule came from; it did not decide where the text lives.** The paragraph
above says the levelled standard's rules *apply* here; this one says they are **written here**, and the
two are not in tension. The rules below are this file's own text and are not read from
`_interview-prep-standard.md`: that standard governs the levelled bank, says in its own reader list that
it does not govern this one, and its single crossing into this family is the bilingual contract stage T
reads. Two standards stating the same rule about two banks is the shape Victor ruled for; one standard
reaching across chains is what he did not.

**Every question carries a stable identifier**, first inside the bold text, immutable and identical in
`en/` and `es/`:

**[01-todo-list-004] Why did you put the state in a service instead of in the page component?** [refined]

Format `{PROJECT_NAME}-{NNN}`: the project folder name — which takes the slot a topic prefix takes in the
levelled bank, since a project has neither topic nor level — and a zero-padded counter from `001`. **The
counter runs over the whole file, never per section.** Sections are absent on some projects (an
Angular-only project with no auth and no tests has three of five) and the cross-section dedupe moves a
question between headings, so a per-section counter collides the first time either happens. Allocate the
next unused number **in the file**; never recycle one after a deletion and never renumber to close a gap
— the gap is what proves the ID was not reused.

**Question state has exactly two valid forms here**, one fewer than the levelled bank:

- **Unrefined** — no state marker. Every role in this pipeline may rewrite any part of the block.
- **Refined** — `[refined]`, at the end of the bold line. **Victor alone writes it**, once the question,
  the answer, the code and the translation are to his taste. From that moment the complete bilingual
  block is frozen byte-for-byte **in both languages against every role in this pipeline**: the author
  does not rewrite it, the reviewer reports its defects instead of fixing them, the translator leaves its
  Spanish exactly as it stands, and the orchestrator's cross-section dedupe never deletes it.

The freeze is what makes this gate safely **re-runnable**. Without it, every later run of
`portfolio-audit` on a project hands Victor's polished answers to a cold reviewer whose mandate is to
improve them, and the improvement is a loss.

**Only Victor reopens a refined question** — by saying so, or by writing a `TODO:` on it. Reopening
removes `[refined]` from **both** languages before any edit, and the repair runs **in the direction of
the file carrying the marker** (the bilingual contract stage T already reads): a marker in `es/` is
answered in Spanish, in his words, and the `en/` twin is re-translated from that; a marker in `en/` runs
the other way. The twin's re-translation belongs to the same reopening, so no writer leaves it stale on
the grounds that the block was frozen.

**A TODO about voice or phrasing is a first-class reopen, not a lesser kind of defect report.** Victor
answers these questions out loud, in Spanish, in a room: an answer that is technically correct and does
not sound like him is a defect of this bank exactly as a wrong one is. *"The answer was already right"*
is never a reason to refuse the reopen or to narrow the repair to the words he did not object to. That is
the loop this channel exists to close, and the freeze would forbid it if this paragraph were missing.

**No role of this pipeline resolves a TODO.** The author and the reviewer are dispatched at `en/` on a
run started for another reason; the translator stops outright rather than overwrite a Spanish edit. A
TODO is resolved in a daily session by `study-content-writer`, which reads this section for a
project-bank pair, and the reopening is its write.

**Priority markers are not part of this bank yet.** `REC-180` still owes them, together with the
proportion calibration five fixed project sections need and the levelled bank's 8–12-question topic
section does not. The bold line therefore carries no `⭐`, and the consequence is real rather than
cosmetic: `/simulator` ranks its plan `⭐⭐⭐ → ⭐⭐ → ⭐`, so a woven project question enters that sequence
unranked. Do not invent a marker to close the gap.

---

**Format per question:**
```
**[{PROJECT_NAME}-NNN] Question as an interviewer would ask it?** [refined]

[Model answer — 2–4 sentences, references the real code, uses "I chose"/"I decided".]
```
The `[refined]` marker is present only on a question Victor has frozen; a question this pipeline writes
is born without it and no role of the pipeline may add it.

**Append + dedupe:** if the file exists, append only questions not already there — each with the next
unused ID in the file. Never add a question covering the same decision or code path as an existing one,
even if worded differently. **A refined question is never the one dropped**: where an appended question
duplicates a frozen one, the appended one goes.

**File template** (`en/`; the `es/` twin is the same file with the header translated — stage T owns it,
and its two Spanish lines are `Preguntas específicas de las decisiones de implementación tomadas
en este proyecto.` / ``Úsalas junto a los archivos por tema en `interview-prep/{LEVEL}/es/`.``, the H1 kept as
`# Preguntas de entrevista — {PROJECT_NAME}` (the project name itself never translated), and the
five section headings translated as `Arquitectura y patrones` · `Seguridad y autenticación` · `Reglas
de negocio` · `Decisiones técnicas` · `Testing`):
```markdown
# Interview Questions — {PROJECT_NAME}

Questions specific to the implementation decisions made in this project.
Use these alongside the topic-based files in `interview-prep/{LEVEL}/en/` and `es/`.

## Architecture & Patterns
[coordinator, smart/dumb, layered architecture, etc.]

## Security & Auth
[JWT, SecurityContextHolder, BCrypt — omit this section if the project has no authentication]

## Business Rules
[status transitions, validation, access control, etc.]

## Technical Decisions
[DTOs, PATCH vs PUT, soft delete, etc.]

## Testing
[what is tested, why that service/edge case, what the mock does, what would break if the test were
removed — omit if the project has no tests]
```

---

## CV bullet format

Read `notes/prompts/strategy/apply/_internal/_application-standard.md` first — the bullet lands in the
Spanish CV **as-is** (`cv-prompt` uses it without rewriting), so it must already comply. Its
**Project-bullet spec** is the whole bar and is deliberately not restated here: eight conditions — 1-4
and 6 a string search over the bullet, 5, 7 and 8 judged against the evidence that section names — plus
the universal format, the keyword pool, the Spanish voice rules and
the defensibility rule that section sits under. Phase 3 verifies the drafted bullet against **every**
condition before saving it, and prints any it could not satisfy.

`[Verbo en pasado] [qué es] con [tecnologías clave], [una cifra de escala o una decisión que demuestra profundidad]`

Draft **one** bullet — the best that satisfies every condition — and print, on its own line, any
condition it could not satisfy and why. A condition a run cannot meet is a **report**, not a menu, which
is why no option is offered and no choice is asked for. **Every project that gets a bullet is held to
all eight conditions**, whatever the project is — a ❌ verdict, which writes none, is the only exemption; which projects a document features is the application standard's
project-selection heuristic and never this section. The persistent file's contract: a committed
`notes/cv/cv-bullets.md` contains **one bullet per project**, because the apply prompts consume that
entry as polished input rather than as a decision they are allowed to make.

**Refined bullets are frozen, and this is the one prohibition on the writer.** A section heading may carry
a `[refined]` marker, and there are two states, only ever two: **no marker** — the section is this run's to
replace, which is every section by default and the whole behaviour above; **`[refined]`** — Victor has
polished that bullet and it is frozen byte-for-byte.

**Victor alone writes that marker and Victor alone removes it.** The run never adds it, never strips it,
and never replaces a section carrying it. Reopening a bullet is him deleting the marker, and that is the
entire mechanism: one signal, written by him, read by this run. A `TODO:` line under a refined bullet is a
note to himself about what he wants changed — it licenses nothing and the run does not read it.

**Read that marker from the file as it stands on disk.** A marker Victor added and has not yet committed
is a freeze like any other, and honouring it is the entire point of the rule. The reporting check below
reads the marker on disk **and** in `HEAD` and needs both to fire; nothing in this section ever decides
anything from `HEAD` alone.

So: **never replace a section carrying `[refined]`.** Draft the bullet as usual and verify it as usual,
then leave the section exactly as it stands and report it under Finishing item 6 — that item declares the
bullet is in the file, so it is the one that would otherwise state something false — naming the project and
printing the drafted bullet that was not saved. Same shape as `_interview-prep-standard.md`'s
content-pipeline prohibitions: a pipeline may never assign the marker and never change what carries it.

- With `DRY_RUN = true`, save the bullet under a `## {PROJECT_PATH}` heading (replace the section if it
  exists **and does not carry `[refined]`**) and leave it uncommitted for Victor to read in the diff.
- With `DRY_RUN = false`, save it under the same heading, **under the same prohibition**, and continue
  toward the atomic commit — which `cv-bullets.md` may not enter, per the staging rule below. **There
  is no choice pause on this path**; in `PROJECT_PATH = all`, commit the current project before starting
  the next target.

**File-wide integrity gate before staging `cv-bullets.md`, and over the whole file whenever a bullet was drafted:** scan the complete file,
not only the current project. Every `## {PROJECT_PATH}` section must contain exactly one bullet and no
`choose one` marker, **and every project must have exactly one section** — the check the optional
`[refined]` suffix makes necessary: a run matching the heading as an exact line concludes the section is
missing and appends a second one for the same project, which two one-bullet sections would otherwise pass. A section still carrying two options or that marker was written before the choice
gate was retired: on a non-dry run **pause for Victor's selection there** — the run drafts one bullet, it does not
retro-choose between two he was owed — and clean the section before staging the file. On a dry run, the
handoff tells Victor to satisfy this same whole-file gate before running the printed manual commit.

**And one check that scan cannot make, because it is about the change and not the file.** *"Every section
has one bullet"* is a property of the text as it stands; *"a frozen bullet is still the one Victor froze"*
needs a baseline. So, before staging: `git diff notes/cv/cv-bullets.md` against live `HEAD` — **not
`{BASELINE}`**, which in `PROJECT_PATH = all` is several commits behind by the second iteration.

**A section carrying `[refined]` both on disk and in `HEAD`, whose bullet differs between the two, is
reported and nothing else.** Name it under Finishing item 6, leave `cv-bullets.md` **unstaged**, and say
the file needs Victor's own commit. **This check never restores, never edits, never stages** — which is
the design and not a limitation:

- The prohibition above already stops the run from writing a marked section, so a marked section that
  changed is, on any correct run, **Victor's own edit**. A check that undid it could only ever fire on him.
- Restoring from `HEAD` puts back a whole heading, marker included. Deleting the marker is how he reopens
  a bullet, so a restore would silently revert a reopening — and make the run write the very marker it is
  forbidden to write.
- A section whose marker is on disk but **not** in `HEAD` is outside this check: that is Victor freezing a
  bullet he just polished, and there is no frozen baseline to compare it against.

**The staging half is the same rule for the same reason.** `git add` takes the whole file, so staging it
would carry his hand-authored bullet into a `docs: portfolio-audit …` commit, under an authorization that
covers this run's **outputs** and nothing else — the ruling `_interview-prep-standard.md` already makes
for an uncommitted insertion swept into a later audit's commit, and the one this prompt's `TODO-STOPPED`
disposition makes for the `es/` twin. **That precedent has two halves and both apply here:** leave the
file unstaged, *and* say plainly that any bullet this run wrote is sitting in the working tree and that
`cv-bullets.md` must be committed by hand before the next run — otherwise the next run inherits the same
unstaged state and never commits it either. Label the commit `cv-bullets not staged — <reason>`: it is not
"untouched" when this run wrote another project's bullet into it.

A dry run prints the same report, unchanged, because the check acts on nothing either way.

If the file does not exist, create it with the header:
```markdown
# CV Bullets

One polished bullet per project.
Used by `cv-prompt` when drafting the Projects section of your CV.

---
```
Entry format — the same on every path, because only one bullet is ever drafted:
```markdown
## {PROJECT_PATH}

- [Bullet]
```
A heading may also read `## {PROJECT_PATH} [refined]`. **A run never writes that suffix** — it is Victor's,
it means the section is frozen, and the format above is what a run produces every time. **The suffix is not
part of the project path**, so a section carrying it is that project's section: locate a project's section
by its `{PROJECT_PATH}` with the suffix optional, never by an exact-line match, or the run will decide the
section is missing and write a duplicate.

---

## GitHub repo description format

Stays in **English** (GitHub's audience is wider than the Spanish screen; English is the convention
there). One line, 160 characters max, no markdown. Draft **one** option.

`[What it does] — [tech stack]. [One thing that makes it worth looking at.]`

Example: "Full-stack time tracker — Spring Boot + Angular + PostgreSQL + JWT. Role-based access, soft
delete, JUnit 5 tests."
