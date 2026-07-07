# Portfolio review prompt — second-pass auditor for the question bank

This is the **reviewer half** of the portfolio pipeline. It audits the just-authored interview-question
bank against the standard and **fixes what falls short directly in the file** — it does not commit (the
orchestrator owns the commit, because it bundles the question file with the CV bullet it writes next).

`portfolio-audit.md` dispatches it as subagent **B** right after the author (subagent A). A cold
reviewer with no stake in the draft catches the thing the author, close to their own work, misses most
here: **a thin bank** — a decision, pattern, or edge case left undefended. You can also run it
standalone on one finished question file.

---

## Configuration — edit only this block

PROJECT_PATH = [angular/06-hr-portal | projects/07-timetrack | ...]

Use PROJECT_PATH wherever the prompt refers to {PROJECT_PATH}. Derive {PROJECT_NAME} as the last path
segment; derive the project type from the path prefix.

---

You are the independent reviewer for one just-authored question bank:
`notes/interview-prep/projects/{PROJECT_NAME}.md`. The author already believed it was complete — do not
be generous; assume a decision is undefended until you have checked the code.

Before starting, read:
- `notes/prompts/projects/portfolio/_portfolio-standard.md` — the question quality bar, in full.
- The same project files the author read (PLANNING.md, README(s), and the real source per the project
  type — see the standard's "Two project formats"). You cannot judge whether the bank is exhaustive
  without seeing what there was to ask about.
- `notes/interview-prep/projects/{PROJECT_NAME}.md` — the file to audit.

## Audit checklist — run every point

- **Exhaustiveness (highest value).** Walk the real code and PLANNING.md and list every decision,
  pattern, business rule, and testing choice. For each, is there a question? Every gap is a missing
  question — **add it**. This is where most misses are: a whole section (e.g. Testing, Business Rules)
  thin or absent.
- **Question type.** Each targets a decision / pattern / gotcha, not "what is X". Rewrite any generic
  "what is JWT"-style question into one about *this* project's choice.
- **Answerability.** Each is answerable only by someone who wrote this code. Cut or sharpen anything a
  candidate could answer from a tutorial.
- **Model answer.** 2–4 sentences, references the **actual implementation**, uses "I chose" / "I
  decided" — not "it is used". Fix passive, textbook, or code-free answers.
- **Sections + format.** The five sections present (omitting Security/Testing only if the project
  genuinely has no auth / no tests), each question in the standard's format.
- **No duplication.** No two questions cover the same decision or code path.

## Fix, don't just report

Where a check fails, **fix it directly** in the file — add missing questions, rewrite weak ones, cut
duplicates. Preserve the author's good questions; only change what misses the bar. If the bank is
genuinely already exhaustive and at bar, change nothing and record it as PASS.

## Finish — no commit

Do **not** commit and do not write the CV bullet or verdict — those belong to the orchestrator, which
commits the question file together with the CV bullet in one atomic commit. Leave your fixes in the
working tree. Report your **verdict**:
- `PASS` (no changes) or `FIXED` (a short bullet list of what you added/corrected and why).
- The final question count and section breakdown, so the orchestrator can confirm no section is thin.
