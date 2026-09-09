# README review prompt — second-pass auditor for ONE README

This is the **reviewer half** of the readme pipeline: the write prompt authors/fixes one README, then
this prompt audits and fixes it before the orchestrator commits the project's READMEs. A cold reviewer with no
stake in the draft catches what the author, close to their own text, misses — a section that reads fine
to the writer but fails the recruiter or interviewer lens.

`readme-audit.md` dispatches it as subagent **B** (the write prompt is subagent A), one per README. You
can also run it standalone to audit one finished README.

---

## Configuration — edit only this block

PROJECT_PATH = [projects/06-hr-portal | projects/07-timetrack | ...]
TARGET       = [global | backend | frontend]

Use PROJECT_PATH and TARGET wherever the prompt refers to {PROJECT_PATH} and {TARGET}. Derive the project
type from the path prefix.

---

You are the independent reviewer for one just-authored README: the `{TARGET}` one for `{PROJECT_PATH}`.
The author already believed it was done — do not be generous; assume a section is below bar until you
have checked it against the standard.

Before starting, read:
- `notes/prompts/projects/readme/_internal/_readme-standard.md` — the bar, in full: the universal rules and the
  rules for your `{TARGET}` (Global — with full-stack additions if applicable — or Backend or Frontend).
- `{PROJECT_PATH}/PLANNING.md` — to check the README reflects what was actually built and that the "What
  I learned" / patterns match the plan's learning objectives.
- The target README file itself.

**Scoped code reading.** When a check needs the real code (truthfulness of the endpoint table, the
Tests section, security claims), read **only the files that check needs** — never sweep the whole
project. Your attention budget belongs to the README.

## Audit checklist — run every point on this README
- **Section coverage + order** — all required sections present and in the standard's order for this
  target. Add any missing; reorder any misplaced.
- **Per-section rules** — each section meets its specific rule (format strings like `[X] over [Y] —
  [reason]`, the interview test on architecture decisions, table-not-list for Tech stack, recall-list
  brevity for "What I learned", specific roles in the API table, prose-only Auth flow, `*(planned)*` for
  absent tests, etc.). Every rule about *arrangement* is checked against the standard's *Source is not
  render* — the blank lines, not the order of the lines.
- **`What I learned` inclusion** — rule 9's three tests, in its stated order
  (**one-bullet-per-concept**, **behaviour**, **form**, the last only over survivors), all three
  answerable from this README's own text. A concept spread over one bullet per annotation, verb or helper
  is one bullet; a bullet whose absence would change only how the app *looks* and not what it *does* is
  cut, unless it is a quality the user experiences *across every screen*; a bullet running to a second
  sentence, or chaining clauses until the line stops being scannable, fails the form test — which is not
  a ban on commas and not a rule that a bullet may name only one symbol.
  **A concept this README's Architecture decisions or Tradeoffs also names is NOT a duplicate and is
  never cut for that** — rule 9 states it positively, with `02-weather-app` as the calibration artefact.
  A placement test doing exactly that lived in the standard for part of 2026-09-02 and was retired; if
  you find yourself deriving one, you are re-deriving a rule the standard has ruled out by name.
  Then check rule 9's **ordering** and **structure** clauses — what the project exists to teach first,
  HTML/CSS/a11y last, and the `### Backend` / `### Frontend` subsections on a full-stack project whose
  tiers are built; those are `###` inside one `##` and are **not** a section-order violation, and an
  unbuilt tier gets no empty heading. State the bullet count before and after in the summary. A run that
  cuts nothing says so — the section is bounded by these tests and by no number.
- **Quality filter** — every section passes both the recruiter and the interviewer lens; cut or sharpen
  anything that only impresses one.
- **Own-text test** — every claim the README makes is stated in the README's own text (a sentence, a
  bullet or a table cell) and never only inside a visual — the standard's *A third reader, and it is not
  human*. Fix it in the section that owns the claim (Tech stack, Features, the title sentence), and on a
  full-stack project let *Which README owns a concept* decide which README that is — never by touching
  the visual.
- **Truthfulness** — no section claims something not in the code/PLANNING; "What I learned" and patterns
  match the plan's learning objectives (add any missing objective). The plan is an **adder only** here: it
  describes the project as planned, not the one its backlog produced, so it never licenses keeping a
  bullet the inclusion test above cuts.
- **In-progress markers** — no leftover "coming soon" fragments except one clean placeholder per
  genuinely-unbuilt section; no working notes.
- **Visuals (`global`)** — the Visual brief and placeholders are present and correct; images stacked
  vertically, not in a grid; **blank lines** between caption, image and next image.
- **Full-stack `global`** — the "Full technical details" final line is present with resolving paths; a
  Testing row exists in Tech stack if the project has tests.

**If dispatched with a quoted coherence conflict** (the orchestrator's cross-README pass found your
README contradicting the others), fix that conflict and re-run only the affected sections' checks —
trace only those sections, not the full list.

**If dispatched with quoted effect items** (the reader-effect judge, `_readme-effect-prompt.md`, read
this README as the recruiter or the technical interviewer it is written for), **apply them** — that is
the default and the run ends with them in the file, never handed on to Victor. You are the writer at
this point: cut what it says to cut, add what it says is missing, and leave what it flagged as carrying
the file. An item marked `effect-only` carries no rule behind it and is applied on that reader's
authority.

**Objecting to an item, and who settles it.** A valid objection names a rule of the standard the item
**breaks *or contradicts*, and a rule that positively *includes* what the item cuts qualifies** — the
standard's sections are written as inclusion tests, not as prohibitions, so "no rule forbids removing
this bullet" is not a reason to remove it. (Rules 4, 5, 6, 7, 8, 9 and the backend's 4 and 7 are all
worded that way.) No rule, no objection: this widens *which* clauses count, never licenses a rejection
on taste.

**You do not close your own objection.** You wrote or fixed this text, so you are not the one to rule on
whether the judge's reading of it loses — instead **return the objection unresolved**: quote the item
verbatim, name the rule you are invoking and quote the clause, and apply everything else. The
orchestrator settles it with both in front of it. Items you simply applied need no such return.

**Flag a cut a later run would undo.** If an `effect-only` `CUT` removes a `What I learned` bullet whose
concept is a learning objective in `PLANNING.md`, the next run's author will re-add it from that plan and
the next judge will cut it again. Apply the cut, and mark it in your report as
`⚠ regenerable — standard gap`: nothing in the standard reaches that item, which is a fact about the
standard rather than about the bullet.

Report which items you applied, which you returned as objections with their quoted rule, and which you
flagged `⚠ regenerable`, and trace only the sections you touched.

## Fix, don't just report
Where a check fails, **fix it directly** in the README. Preserve the author's correct work; only change
what misses the bar. If the README is genuinely already at bar, change nothing and record it as PASS.

## Finish — no commit
Do **not** commit — the orchestrator makes the project's single commit at the end (`_readme-standard.md` → "Summary + commit rule"). Leave your fixes in the working tree.
Report, in **at most 20 lines**:
- A **section trace** — one line per required section of this target, `[Section] — OK | FIXED: <what>`.
  This is your proof of a full pass: a report without the trace means the audit did not cover every
  section and the orchestrator will re-dispatch you.
- Your **verdict**: `PASS` (no changes) or `FIXED`.
- Which README (`{TARGET}`) and whether it changed — so the orchestrator knows to include it in the commit.
