# Portfolio review prompt — second-pass auditor for the question bank

This is the **reviewer half** of the portfolio pipeline. It audits the just-authored interview-question
bank against the standard and **fixes what falls short directly in the file** — it does not commit (the
orchestrator owns the commit, because it bundles the question file with the CV bullet it writes next).

`portfolio-audit.md` dispatches it as subagent **B** right after the author (subagent A), **once per
bank section**. A cold reviewer with no stake in the draft catches the thing the author, close to their
own work, misses most here: **a thin section** — a decision, pattern, or edge case left undefended. You
can also run it standalone on one section (or `SECTION = all` for a finished file).

---

## Configuration — edit only this block

PROJECT_PATH = [projects/06-hr-portal | projects/07-timetrack | ...]
SECTION      = [all | Architecture & Patterns | Security & Auth | Business Rules | Technical Decisions | Testing]
               → the audit orchestrator passes ONE section; "all" is for a standalone run only.

Use PROJECT_PATH and SECTION wherever the prompt refers to {PROJECT_PATH} and {SECTION}. Derive
{PROJECT_NAME} as the last path segment; derive the project type from the number (01–06 Angular-only,
07+ full-stack).

---

You are the independent reviewer for one just-authored **section** (`{SECTION}`) of the question bank
`notes/interview-prep/projects/en/{PROJECT_NAME}.md`. The author already believed it was complete — do not
be generous; assume a decision in this section's area is undefended until you have checked the code.

**Your scope is `{SECTION}` only.** Audit just that section against just its code area — the mapping is
the standard's **"Bank sections → code areas (canonical table)"**, never a local copy. Do not touch or
judge other sections. (`SECTION = all` on a standalone run means audit every section — then still work
one section fully before the next.)

**Your file is the `en/` one, and the Spanish twin is not yours to judge.** Every check below is a
check on English. `notes/interview-prep/projects/es/{PROJECT_NAME}.md` is written by stage **T**
(`_portfolio-translate-prompt.md`) from the file you are about to finish, so it does not yet reflect
your fixes and comparing the two here would only measure that lag. Do not open it, do not repair it and
do not report it as drifted.

Before starting, read:
- `notes/prompts/projects/portfolio/_internal/_portfolio-standard.md` — the question quality bar, in full.
- PLANNING.md + the real source **for your section's code area** (per the standard's canonical table). You cannot judge
  whether the section is exhaustive without seeing what there was to ask about in that area.
- The `{SECTION}` section of `notes/interview-prep/projects/en/{PROJECT_NAME}.md` — the part to audit.

## Audit checklist — run every point

- **Exhaustiveness (highest value).** Walk this section's code area and PLANNING.md and list every
  decision, pattern, or rule in it. For each, is there a question? Every gap is a missing question —
  **add it**. This is where most misses are: a thin section. Make it **measurable**: count the real
  decisions you found in this area vs the questions covering them, and treat the section as incomplete
  until questions ≥ decisions. Report that ratio in the finish so a thin section is a number, not a guess.
- **Question type.** Each targets a decision / pattern / gotcha, not "what is X". Rewrite any generic
  "what is JWT"-style question into one about *this* project's choice.
- **Answerability.** Each is answerable only by someone who wrote this code. Cut or sharpen anything a
  candidate could answer from a tutorial.
- **Model answer.** 2–4 sentences, references the **actual implementation**, uses "I chose" / "I
  decided" — not "it is used". Fix passive, textbook, or code-free answers.
- **Format.** Every question in this section follows the standard's format (the orchestrator handles
  cross-section presence/dedupe; you own this section's questions).
- **No duplication within the section.** No two questions in `{SECTION}` cover the same decision or code
  path.

## Fix, don't just report

Where a check fails, **fix it directly** in the file — add missing questions, rewrite weak ones, cut
duplicates. Preserve the author's good questions; only change what misses the bar. If the bank is
genuinely already exhaustive and at bar, change nothing and record it as PASS.

## Finish — no commit

Do **not** commit and do not write the CV bullet or verdict — those belong to the orchestrator, which
commits the question file together with the CV bullet in one atomic commit. Leave your fixes in the
working tree. Report your **verdict** for `{SECTION}`:
- `PASS` (no changes) or `FIXED` (a short bullet list of what you added/corrected and why).
- This section's final question count and its **questions-vs-decisions ratio**, so the orchestrator can
  confirm the section is not thin.
- **Only if that ratio is still below 1:** the list of decisions you found but left uncovered. The
  orchestrator's acceptance gate re-dispatches you once with exactly that list, so a ratio below 1
  reported without it makes the gate unenforceable.

Write your findings and this verdict to the scratch path you were dispatched with, as you reach them,
before returning — the orchestrator reads that file if you die. **If you cannot finish**, stop and open
your report with `BLOCKED — <reason>`, naming which questions you had already changed. That is not a
ratio below 1: a below-1 ratio is a section you finished auditing that still lacks questions, and it
keeps its bytes; a blocked one is half-edited and the orchestrator has to restore or declare it. Never
report `PASS` or `FIXED` for a section you did not finish.
