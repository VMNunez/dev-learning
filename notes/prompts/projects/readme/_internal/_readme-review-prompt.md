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
- **`What I learned` inclusion** — rule 9's **placement**, **behaviour** and **one-bullet-per-concept**
  tests, all three answerable from this README's own text. A bullet restating a choice already made in
  Architecture decisions (or Tradeoffs) survives once, in the section that owns the choice, and is cut
  here, its extra detail merged upward; a bullet whose absence would change only how the app *looks* and
  not what it *does* is cut; a concept spread over one bullet per annotation, verb or helper is one
  bullet. The first of the three **compares two sections**, so run it after both are final; the third is
  the one that reaches a section whose bullets duplicate nothing above. State the bullet count before and
  after in the summary. A run that cuts nothing says so — the section is bounded by these tests and by no
  number.
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
authority. **Reject one only where the standard positively contradicts it, and only by naming the rule
it would break** — no rule, no rejection. Report which items you applied and which you rejected with
that rule, and trace only the sections you touched.

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
