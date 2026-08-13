# Interview-prep write prompt — the AUTHOR component (one section under the orchestrator; one topic standalone)

**Internal component.** This is the **author** in the interview-prep pipeline. You normally don't
launch it — `interview-prep-audit.md` dispatches it as a cold subagent, **one per section** of a topic's Q&A (per-section is the deep-work unit), then hands the
result to `_interview-prep-review-prompt.md` (the reviewer). It is documented here so the orchestrator
can point a subagent at it; you can also run it standalone to build/audit a single topic.

**What it does.** Takes one topic's Q&A files (`en/{FILE}.md` + `es/{FILE}.md`) and does the full
audit: syncs the two languages, resolves TODOs, checks coverage traceability, assigns stable IDs and
priority markers, fixes format, and adds the realistic market questions the topic needs. It leaves the work in the tree — it does
**not** commit. Under `interview-prep-audit` the orchestrator owns the one topic commit; only the
standalone author → reviewer flow lets the reviewer commit.

**Why one topic at a time.** The quality bar (realistic questions, well-worded, answered in Victor's
voice) is demanding. A cold subagent bounded to one topic keeps its full attention on that file, so the
bar actually gets applied every time.

---

**How to use:**

1. Fill in `FILE` — the interview-prep topic filename without extension.
2. Fill in `SECTION` — `all`, or the exact heading to audit only that part.
3. Fill in `MODE` — `full` (complete audit) or `correct` (just fix and sync what was written).
4. Paste the entire prompt below into a new chat.

---

````
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

LEVEL = [junior | middle | senior]
FILE = [angular | css | javascript | typescript | sql | java | spring | spring-boot | architecture | git | general | security]
       → notes/interview-prep/{LEVEL}/en/{FILE}.md
       → notes/interview-prep/{LEVEL}/es/{FILE}.md
       → FILE can also be a path to ONE language file (e.g. notes/interview-prep/junior/en/angular.md):
         derive the topic from it and audit it together with its twin in the other language.

SECTION = [all | ## Routing | ## Forms | ## JOINs | ...]
          → "all" audits every section in the file
          → an exact heading audits only that part (up to the next ## heading)

MODE = [full | correct]
       → full (default): the complete audit — sync, TODOs, coverage check, priority markers, format,
         and all four audit sections (missing topics, weak answers, imbalances, missing questions).
       → correct: a focused "I just wrote/edited this file — correct it" pass. Does ONLY the en/es
         sync check, TODO resolution (mirrored), the always-allowed format/priority tidy, and the
         weak-answer report. SKIPS the coverage/{LEVEL}.md check and audit sections 1, 3, and 4 — it does not
         hunt for missing topics or add new questions.

Use FILE, LEVEL, SECTION, and MODE wherever the prompt refers to {FILE}, {SECTION}, or {MODE}.

Reject any explicit path whose embedded level differs from `LEVEL`. Never fall back to the legacy
shared `notes/interview-prep/en/` or `es/` paths.

Notes on specific files:
- angular: Angular framework questions. **Angular Material has no file of its own** — its questions
  live here under Material sections, so this run also verifies `notes/angular-material/coverage/{LEVEL}.md`
  (see Step 3).
- spring-boot: Spring Boot framework questions (auto-configuration, controllers, beans, JPA). Java
  language questions live in java.md, not here.
- java: language concepts needed to write Spring Boot code — classes, interfaces, annotations,
  generics, exceptions, Maven. Skip Java that never appears in a Spring Boot context.
- sql: database is PostgreSQL. Flag PostgreSQL-specific behaviour consultancies ask about (sequences
  vs AUTO_INCREMENT, RETURNING).
- general: cross-technology questions (debugging, teamwork, process, git workflow).
- security: authentication vs authorisation, hashing, JWT design, CORS, XSS, CSRF, SQL injection.
- architecture: REST principles, layered architecture, MVC, coordinator, smart/dumb, service layer,
  repository. Not framework internals — those belong in spring-boot.md or angular.md.


Progression gate: middle interview-prep authoring requires consolidated junior notes, questions, and practical recall; senior requires consolidated junior and middle levels. Stop if the required gate is not closed.
---

You are auditing Victor's interview preparation. Do deep work on the scope you are given only — do not
wander outside it. **When the audit orchestrator dispatches you, `{SECTION}` is one exact `##`
heading** — author/audit just that section (in both `en/` and `es/`), read it in full, and return a
**question-by-question trace** (each question with PASS or the change you made) as proof you finished
it. **Respect the lifecycle**: a question carrying `[refined]` in either language is frozen
byte-for-byte, whether or not it also carries `[studied]`; report defects instead of rewriting it.
Everything unmarked may be rewritten freely to reach the bar. A section is the deep-work unit; never take on the whole file in one pass under the orchestrator.
(`SECTION = all` on a standalone run means the whole file — then work section by section within it.)

Before starting, read:
- the shared session rules — teaching rules and subfolder structure.
- notes/prompts/_internal/_shared-context.md — Victor's profile, projects, and the Spanish job market 2026.
- notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md — THE bar. Every definition
  (question types, priority markers, question format, the answer quality bar, the bilingual contract,
  stable IDs, refined/studied lifecycle, section-complete) lives there. Apply it in full; this prompt only adds the
  audit *flow*.

## Scope — this run touches exactly two files

`en/{FILE}.md` and its `es/{FILE}.md` twin (same filename). **`en/` is the canonical source** — author
and correct there first, then translate into `es/` (the file Victor studies from, so the Spanish must
read as native, never a calque). If `{FILE}` is given as a path to one language file, derive the
topic and audit both twins — never just the one handed to you.

If `{SECTION}` is not "all", operate only on that heading's content. If the section is missing in one
or both files, create it as an empty section before proceeding.

## Mode — full vs correct

Check `{MODE}` first. In **correct** mode run ONLY, in order: Step 1 (sync), Step 2 (TODOs), Step 4
(priority markers — the always-allowed tidy), Step 5 (format), and the Step 6.2 weak-answer report —
then stop. Skip Steps 3, 6.1, 6.3, and 6.4. You are correcting what is there, not expanding the topic;
mention any real gap in the summary instead of adding questions. In **full** mode run everything.

## Sourcing real code

The standard requires a real, cited code snippet on any question an interviewer would pose with code
(Pressure snippets, "how do you write/configure X?", tight confusable-pair contrasts). When a question
in scope warrants code, **read the real source and take the smallest fragment from it** — never invent
code and present it as Victor's. Where to look, by topic:

- **spring-boot / java / security / architecture** → `projects/07-timetrack/backend/timetrack/src/main/java/`
  (and `.../src/test/java/` for testing questions — JUnit/Mockito).
- **angular / typescript / css** → the Angular projects, richest first: `projects/06-hr-portal/`,
  `projects/05-task-manager/`, `projects/03-expense-tracker/`. (The 07 frontend is not built yet.)
- **sql** → `practice/sql/` (the exercise files — real queries Victor wrote).
- **git / general** → usually prose; add code only if a concrete command or config genuinely helps.

Cite the fragment with a first-line comment naming the file, e.g.
`// projects/07-timetrack · TimeEntryService.java`. If no project actually contains the construct (a
pure-language gotcha), use a minimal snippet marked `// illustrative — not from a project`, or skip the
code. Keep the same code in both `en/` and `es/` (comments may be translated).

**The same truthfulness rule applies to prose anchors.** Never write "I used it in project 06 to…"
unless that project really does use it — check the source before writing the claim. An invented anchor
is worse than no anchor: it is a false anecdote about Victor's own code that one interviewer follow-up
exposes. If no project uses the pattern, answer without a project reference.

## Step 1 — Sync check

Bring `en/{FILE}.md` and `es/{FILE}.md` into sync for the run's scope (full file, or just `{SECTION}`).
List sections and question counts side by side. They are out of sync if a section or question exists in
one file but not the other, or the same count hides different questions. For each mismatch, add the
missing content — translated into `es/`, in English into `en/`; where the same question differs, keep
the `en/` version and update `es/` (per the bilingual contract in the standard). Only then continue.

## Step 2 — Resolve TODOs

Scan `{SECTION}` in `es/{FILE}.md` first, then `en/{FILE}.md`. Markers: `TODO:`, `<!-- TODO: -->`, or
`// TODO`. For each: identify what Victor wants, apply the fix where it was found, mirror the equivalent
fix (translated) to the other file at the matching position, remove the marker in both, and report the
change.

**Pattern detection** — after resolving all TODOs, if 2+ reflect the same kind of correction (e.g.
always rewriting a passive answer to "I used", always adding a project reference), report it in the
summary as a recommended one-sentence rule to add to the standard. Do not add the rule yourself.

## Step 3 — coverage/{LEVEL}.md traceability check (full mode only)

Read the topic's coverage: `notes/{FILE}/coverage/{LEVEL}.md` (for spring-boot, `notes/spring-boot/coverage/{LEVEL}.md`;
for java, `notes/java/coverage/{LEVEL}.md`). **For `angular`, also read `notes/angular-material/coverage/{LEVEL}.md`** —
Angular Material has no interview-prep file of its own; by convention its questions live in `angular.md`
under Material sections. Use coverage to bound the selected level and map each admitted question to
one or more current concepts; do not require one question per bullet. A pedagogical bullet with no
realistic interview angle is a valid no-op. A realistic market question outside coverage is a coverage
gap and is reported rather than silently admitted. If the selected coverage file does not exist, stop
and take the blocked return in "Execution" below, naming `coverage-prompt` for that topic and level as
what unblocks it.

## Step 4 — Priority markers

Assign a marker to every existing question in `{SECTION}` that lacks one, using the criteria in the
standard, then run the proportion check and reorder each section ⭐⭐⭐ → ⭐⭐ → ⭐ (within a section
only). New questions added in Step 6 get a marker too and are merged into this order afterward.

## Step 5 — Format check

Scan every question in `{SECTION}` of both files. Enforce the mandatory format from the standard: blank
line between the bold question and the answer, a priority marker on the bold line. Add the standard's
level-appropriate interview tip to
any Conceptual question missing one; add a Red flag to any Decision-based/Pressure question missing one.
Fix violations in both files and report what was fixed.

## Step 6 — The audit (full mode: all four; correct mode: only 6.2, report-only)

> **Market-question list (if provided).** When launched by `interview-prep-audit.md`, you are handed a
> list of the **real questions actually asked** for this topic at the target companies, each with a
> frequency signal. Treat every `often`/`sometimes` question as **required** — it must appear in the
> file as a well-worded question, phrased the way the market asks it — and use the list to calibrate the
> realism and wording of everything you write in Step 6. If no list was provided (standalone run), rely
> on coverage/{LEVEL}.md and your knowledge of what the target screenings ask.

**6.1 Missing topics.** Topics not covered in `{SECTION}` that the target companies would ask, given
the stack. Include every `often`/`sometimes` item from the market-question list, deduplicated by tested
concept. One sentence per topic on why they ask it. If a topic you identify is NOT in
coverage/{LEVEL}.md, flag it `[coverage gap]` so Victor can add it there separately.

**6.2 Weak answers (report only — never rewrite without a TODO).** Answers that fail the quality bar in
the standard: vague, too theoretical, not in Victor's voice, or missing a real-project anchor when the
question is about a pattern or decision. Quote the weak part, say what a strong answer would include,
and list it in the summary. Victor adds a TODO; the fix lands next run.

**6.3 Imbalances.** Count questions by type (definitions in the standard). Report count and percentage
per section. Flag any section missing Decision-based or Pressure entirely, and feed that into 6.4.

**6.4 Missing questions.** Every often/sometimes realistic question the target companies would ask that
is not yet in `{SECTION}`. Stop when those concepts are covered; do not add trivia or alternate
phrasings merely to make the bank exhaustive. Each new question:
follow the question format in the standard (bold question + marker + blank line + answer in Victor's
voice + the level-appropriate tip if Conceptual / Red flag if Decision-based or Pressure + a **real, cited code
block** if it is the kind of question an interviewer poses with code — see "Sourcing real code"),
reference a real project when it is about a pattern or decision, allocate the next stable selected-level
topic ID, and add to BOTH files (translated). If a question logically
belongs in a different section than `{SECTION}`, note it in the summary instead of adding it here.
Flag any new question whose concept is not in coverage/{LEVEL}.md with `[coverage gap]`.

## Execution — apply, don't just report

Apply all fixes directly to both files. **Do NOT commit and do NOT mark anything done** — an
independent reviewer runs next, and **you never commit** — who does is the commit-message bullet below.
Leave your work in the working tree.

**If you cannot finish, return the blocked shape the orchestrator waits on.** Stop, and open your report
with `BLOCKED — <reason>` (a missing coverage file in Step 3, missing context, any gate this prompt
stops you on). Then state **what you already changed**: which of the two files you edited, which
headings, and whether any edit is one-sided across `en/` and `es/`. You have been editing the tree as
you went, so those bytes are already there; the orchestrator's disposition of that half-written section
— restore it from the run baseline, or leave and declare it — turns entirely on this line, and without
it the only branch left open to it is leaving your partial work inside the topic commit. Never return a
PASS trace for a section you did not finish.

Then report:
- The coverage status for `{SECTION}` (or per section, if `all`): ✅ Complete / 🔧 Fixed / ➕ Added.
- **Weak answers found** (from 6.2) — question + what is missing.
- **Coverage gaps found** — concepts added that are not in coverage/{LEVEL}.md.
- **TODO patterns detected** — recommended one-sentence rule additions for the standard.
- The one-line commit message you would use (the orchestrator — or the reviewer on a standalone run — will run it):
  `docs: audit {FILE} interview prep — <one-line summary of main fixes>`.
````
