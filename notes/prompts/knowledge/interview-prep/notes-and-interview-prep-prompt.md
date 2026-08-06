# Notes ↔ Interview Prep Cross-Reference Prompt

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

Use in a **separate conversation**. Fill in the configuration block, then paste everything into a new chat.

> **▶ Run first:** `notes-audit` **and** `interview-prep-audit` for this topic — this prompt only finds and fixes gaps between notes and Q&A, so it assumes both sides are already built and quality-checked.

> **Run-start check (step 0):** before anything else, run the check in `notes/prompts/_internal/_pipeline-self-report.md` — read `_internal/_last-run-report-notes-and-interview-prep.md` (not the `interview-prep-audit` one beside it) and, if its `Status` is `open`, surface that finding in one line before proceeding.

---

**How to use:**

1. Fill in `TOPIC`, `NOTES_PATH`, and `FILE`
2. Paste the entire prompt into a new chat

---

````
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

LEVEL = [junior | middle | senior]
TOPIC      = [one registered topic from `../coverage/_internal/_topic-ownership.md` | all]
NOTES_PATH = [notes/{topic}/{LEVEL}/en/]
FILE       = [angular | css | javascript | typescript | sql | java | spring-boot | architecture | git | general | security]
             → notes/interview-prep/{LEVEL}/en/{FILE}.md
             → notes/interview-prep/{LEVEL}/es/{FILE}.md

## TOPIC = all runs every topic in turn (NOTES_PATH and FILE derived per topic) —
## see notes/prompts/_internal/_batch-mode.md. Order: Angular, Angular Material, Spring Boot, Java,
## Architecture, Security, TypeScript, JavaScript, CSS, SQL, Git, General.

Notes on specific topics:
- Spring Boot: set NOTES_PATH = notes/spring-boot/{LEVEL}/en/, notes/java/{LEVEL}/en/ (comma-separated — read both;
  Spring Boot code uses Java language concepts). Before marking a JWT or security question as
  unbacked, also check notes/security/{LEVEL}/en/ — JWT design and token invalidation concepts live
  there by folder convention.
- Angular Material: set NOTES_PATH = notes/angular-material/{LEVEL}/en/, FILE = angular. For direction 2,
  check only questions under Angular Material sections of angular.md — questions in other
  sections (Components, Signals, Routing, Forms, etc.) are backed by notes/angular/{LEVEL}/en/ and are
  out of scope for this run.
- Java: focus on language concepts needed to write Spring Boot code only.
- SQL: database is PostgreSQL.

Use TOPIC, NOTES_PATH, FILE, and LEVEL wherever the prompt refers to {TOPIC}, {NOTES_PATH}, {FILE}, or {LEVEL}.


Progression gate: middle interview-prep authoring requires consolidated junior notes, questions, and practical recall; senior requires consolidated junior and middle levels. Stop if the required gate is not closed.

Require the selected Q&A file's coverage fingerprint(s) to match the exact current coverage bytes.
If missing or stale, stop and run `interview-prep-audit` in `MODE = full`; this prompt never refreshes
fingerprints.
---

## Purpose

This prompt does one thing: find and fix gaps between notes and interview prep — in both
directions. It does not audit quality, fix formatting, or resolve TODOs. Run the individual
prompts first for that.

Before starting, read the shared session rules (teaching rules, subfolder structure) and
`notes/prompts/_internal/_shared-context.md` (my profile and the market context).

> **Branch guard (step 0):** run `git branch --show-current`. Study materials commit on whatever
> branch is currently active (the shared session rules) — a feature branch is the normal case. If you are on
> **`main`**, stop and ask Victor which branch to use — `main` never receives direct commits.

> **Verifiable reads (the shared session rules non-negotiable):** the Read tool truncates at 2000 lines
> **silently**, and some notes/Q&A files are near that. Before any whole-file read (here in
> detection, or by a dispatched subagent on its unit), run `wc -l`; if the file is near or over
> 2000 lines, read it in `offset` passes to the real end. Every dispatched subagent's report must
> state **"N lines, read to EOF"** for its unit — treat a report without it as an incomplete pass
> (re-dispatch once).

---

## Execution model — detection is global; every fix is ONE cold subagent per unit

Split this run into two kinds of work, and never mix them:

- **Detection is global, structural, and light** — it genuinely needs the cross-view of the whole
  topic (which note concept has no question, which question has no note, where a concept could sit).
  Build the concept map and the two gap lists (Steps 1–3) **in this orchestrator context**. This is
  the legitimate whole-file work, the same exception coverage-audit and notes-plan rely on.
- **Closing a gap is DEEP per-unit work** — writing a Q&A answer to `_interview-prep-standard.md`, or
  authoring a note file/section to `_note-quality-standard.md`, is exactly the writing bar the notes
  and interview-prep pipelines split file-by-file. **Never write it inline here, and never batch it.**
  Once the gap lists are ready, **dispatch one cold `role-appropriate` subagent per atomic unit, in
  sequence, always `reasoning tier: deep`** (authoring to the notes/Q&A quality bar — judgment work, per the
  model-tiering convention in `notes/prompts/README.md`; even at higher token cost) to author the fix:
  - **notes → prep** → the atomic unit is **one `##` section** of the topic's Q&A pair (`en/` +
    `es/`) — one subagent per target section, as Step 2 details (never the whole topic in one context).
  - **prep → notes** → the atomic unit is one note file — **one** subagent per note file to create or
    extend, dispatched one after another.

  Each dispatched subagent must **read its whole unit top to bottom** and return a **section-by-section
  (or item-by-item) trace** — every `##`/`###` heading (or every gap it was handed) with PASS or the
  change it made — as proof it reached the end. Run them strictly sequentially, never overlapping:
  they edit the same files and commit, and parallel edits race the git index. Loading a folder — or all
  twelve topics — into one context is precisely the saturation that makes the tail get a shallow skim;
  that is why the deep work is one cold subagent per unit.

> **`TOPIC = all`** (per `notes/prompts/_internal/_batch-mode.md`): process the topics **one at a time,
> sequentially** — run this whole procedure fully for one topic (detection + every dispatched fix +
> the commit) before starting the next. Never load more than one topic's deep work into a context.

---

## Step 1 — Read the source files

Read in this order:
1. The numbered note files in {NOTES_PATH} (the `en/` folder) — **at headings level, not full
   prose**: `grep -n "^##" <file>` per file plus its opening lines. Detection needs the concept map
   (which sections exist), not the prose — loading every file's body is the whole-folder saturation
   the deep per-unit work exists to avoid. Open a body only where a heading leaves genuine doubt
   about what the section covers. Skip any non-numbered files.
2. The Spanish counterpart: replace `en/` with `es/` in {NOTES_PATH} — headings level too, only to
   confirm parity (same sections exist on both sides).
3. `notes/interview-prep/{LEVEL}/en/{FILE}.md` — in full (`wc -l` first; see the verifiable-reads rule).
4. `notes/interview-prep/{LEVEL}/es/{FILE}.md` — headings + question count per section (parity check).

Note: all three `coverage-*.md` files live in the topic root (e.g. `notes/java/`), not inside `en/` or `es/`.

Build a mental map of:
- Every concept section covered in the notes (## and ### headings)
- Every concept covered by at least one question in the prep files

---

## Step 2 — Notes → Interview prep

For every concept covered in the notes: is there at least one question in the interview
prep that covers it?

A concept is "covered" if any question in the prep — regardless of wording — tests the same
idea. Do not require a one-to-one match with a heading; one question can cover several
related sub-sections.

Exception: a sub-section that describes a gotcha, an edge case, a "why not X?" scenario, or
a comparison between two alternatives always needs its own question — it cannot be counted
as covered by a general question about the parent concept.

**Detect here; author one cold subagent per SECTION.** In this context, build the **gap list** only:
every uncovered concept, with the target `##` section of the Q&A file it belongs to and one line on
what a question about it must test. Do NOT write any question inline — that is the deep, standard-bound
work the Execution model reserves for a cold subagent. The atomic unit is a **section**, not the whole
Q&A file: **group the gaps by target section**, and for a section that does not exist yet, plan its
heading here so the subagent creates it.

Then, **one target section at a time, sequentially** (never overlap — the runs edit the same two
files), dispatch a cold `role-appropriate` subagent (`reasoning tier: deep`, `execution: foreground`):

> Read `notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md` (the bar). You are adding
> questions to ONE section — `«## heading»` — of the selected-level Q&A pair. Read that section in
> both `notes/interview-prep/{LEVEL}/en/{FILE}.md` and
> `notes/interview-prep/{LEVEL}/es/{FILE}.md` **in full, top to bottom** (`en/` is the canonical source —
> author there first, then translate to `es/` as native Spanish); create the section heading in both
> files if it does not exist. Add a question for each gap below, in the standard's exact format (bold
> question + priority marker + blank line + answer + the level-appropriate tip if Conceptual / Red flag if
> Decision-based or Pressure), with **real cited code where the question warrants it** (see the
> standard's "Real code" rule) and **respecting the `[x]` studied marker** (never rewrite a studied
> question; reordering is allowed),
> answered in Victor's voice and anchored to a real project when the concept was practised in one. Then
> reorder this section ⭐⭐⭐ → ⭐⭐ → ⭐. Keep `en/` and `es/` in exact sync for this section (`es/` as
> native Spanish, Junior-tip label `Consejo de entrevista:`). Do NOT commit — leave the work in the
> tree. Return a **question-by-question trace for this section** (each question added, or PASS) as proof
> you read it whole.
> ```
> «paste only this section's slice of the notes → prep gap list»
> ```

Wait for each subagent before dispatching the next. Note each added question in the summary as
"notes → prep — added".

---

## Step 3 — Interview prep → Notes

For every question in `notes/interview-prep/{LEVEL}/en/{FILE}.md`: is there at least one note file in {NOTES_PATH}
that covers the concept this question is about?

A question is "backed" if the concept appears as a section or sub-section in any numbered
note file. Use judgment — exact name matching is not required.

**Detect and route here; author one cold subagent per note file.** In this context, build the list
of unbacked questions and, for each, decide its **target note file** — an existing file to extend
(pick the closest-topic file from the headings read in Step 1) or a new file to create. Group the
gaps by target file so each file is touched once. **Assign the concrete number to every new file here**
— there is no `next file:` counter (it lived in the platform adapter before that became a thin
delegator). Read `notes/{topic}/coverage/notes-plan-{LEVEL}.md` for the topic being numbered: it is the
register of prefixes already spoken for, including entries whose files do not exist yet
(`notes/angular/junior/en/` skips `05` and `13` because the plan reserves them). Allocate by
**appending** — one past the highest two-digit prefix appearing either in a plan entry for that level or
directly in the `en/` folder the new file will live in (`_legacy/` is outside the numbering namespace;
with a comma-separated {NOTES_PATH}, number against the folder you are writing into). **Never fill a
folder gap** — it is a reservation, not a vacancy. The orchestrator owns numbering so sequential runs
never collide. Do NOT write any note prose inline: a
note file is one atomic unit and its writing bar is the deep work the Execution model reserves for a
cold subagent.

Then, **one target note file at a time, sequentially** (never overlap — the runs commit), dispatch a
cold `role-appropriate` subagent (`reasoning tier: deep`, `execution: foreground`):

> Read `notes/prompts/knowledge/notes/_internal/_note-quality-standard.md` (the writing bar) and, before writing,
> the first section of `notes/java/junior/es/08-excepciones.md` to calibrate. You are creating/extending ONE
> note file: `«en/ path»` (number `«N»` if new). Read that file (and its `es/` counterpart, and the
> sibling files in its `en/` folder) **in full, top to bottom** to avoid duplicating an example and to
> wire references. Author the section(s) that back these questions to the full standard — problem
> before definition, context before any code block, personal-guide voice, mechanism not just behaviour,
> the anticipate-the-TODO pass — in the correct mode for the folder (structured for
> `notes/java/junior/en/` and `notes/spring-boot/junior/en/`, conversational otherwise). Author in `en/` first (the
> canonical source), then re-sync the `es/` counterpart as native Spanish under a **Spanish filename with
> the same number prefix** (`en/03-methods.md` → `es/03-metodos.md`, never a copy of the English name);
> create the full `es/` file if it does not exist. Your number was assigned above — allocate none
> yourself, and write no counter anywhere. Do NOT
> commit. Return a **section-by-section trace** of the file (every `##`/`###` with PASS or what you
> wrote) as proof you read it whole, plus which questions it now backs.
> ```
> «paste the unbacked questions routed to this file»
> ```

Wait for each subagent before dispatching the next. Note each as "prep → notes — added" in the summary.

**Cap:** create at most 3 new note files per run (extending existing files is uncapped). If more than 3
new files are needed, dispatch the first 3 in study-sequence order and report the rest in the summary —
they are addressed next run.

---

## Execution

Detection happens in this context; every fix is applied by the cold per-unit subagents dispatched in
Steps 2–3 (which leave their work in the tree, uncommitted). The orchestrator waits for each subagent,
collects its trace, and then commits. **Acceptance gate:** a subagent's report counts only if its trace
covers its whole unit (every heading/gap with PASS or the change made). If the trace is missing or
partial, re-dispatch that subagent **once**, quoting what was missing; if it fails again, report the
unit as incomplete in the summary — never mark it done on a partial trace. Do not report and leave gaps open — every genuine gap must be
dispatched, not deferred (except the >3-new-note-files cap in Step 3). Never author a question or a
note section in this orchestrator context.

---

## Summary

After all edits, report:

**Notes → prep gaps closed:**
- `[concept]` — `[question added, with priority marker]`

**Prep → notes gaps closed:**
- `[question topic]` — `[file or section created]`

**Deferred note files** (more than 3 needed — address in next run):
- `[concept]` — needs a note file

If no gaps were found in either direction, print: "Files already in sync — no commit needed." and stop.

Otherwise, show the commit message. Replace {FILE} and {TOPIC} with the actual values.
List only files that were actually modified. Always one command per code block:

```
git add <list only modified files — include en/{FILE}.md and es/{FILE}.md only if questions were added; include note files only if created or modified>
```

```
git commit -m "docs: cross-reference {TOPIC} notes ↔ interview prep — <one line summary>"
```

### Final step — pipeline self-report

After everything above is done, read `notes/prompts/_internal/_pipeline-self-report.md` and execute it for this
run — write `notes/prompts/knowledge/interview-prep/_internal/_last-run-report-notes-and-interview-prep.md`
(this folder is shared with `interview-prep-audit`, so both reports carry their orchestrator's suffix and
neither owns the unsuffixed name), commit it on its own with `_run-tracker.md`, and print the five
bullets in chat.

````
