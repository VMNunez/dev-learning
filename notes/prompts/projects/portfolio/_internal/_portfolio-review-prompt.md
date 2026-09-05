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
SCOPE        = [full | backend | frontend | global]
               → which column of this section's canonical-table row you walk, and which `###` tier
               sub-headings you may edit. Your decisions-vs-questions ratio is counted over that code
               area alone, so it measures what this run was asked to cover. A defect in an
               out-of-scope sub-heading is **reported, never repaired** — the same disposition a
               `[refined]` block gets. Angular-only projects have no sub-headings: every value behaves
               as `full`.

Use PROJECT_PATH, SECTION and SCOPE wherever the prompt refers to {PROJECT_PATH}, {SECTION} and
{SCOPE} (default `full` if left blank). Derive
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

**And within it, `{SCOPE}` only.** On a full-stack project the canonical table splits each section's code
area into `backend`, `frontend` and `global` columns, and the bank splits each section into `### Backend`,
`### Frontend` and `### Cross-tier` sub-headings. You walk **only the columns `{SCOPE}` names** and you
may edit **only the questions under that scope's sub-heading**. Everywhere below that this file says
"this section", read it as **"the sub-headings `{SCOPE}` covers"** — the checklist, the ratio and the
fix-directly rule alike. A question under another sub-heading is treated exactly like a `[refined]` one:
**judged and reported, never repaired and never cut**, because it was written against code you were not
asked to read. On `full` the two readings coincide. Angular-only projects have no sub-headings and every
scope behaves as `full` there.

**A question carrying `[refined]` is frozen, and this is the one place your mandate stops.** Victor
wrote that marker; the standard's freeze binds every role of this pipeline. You may **judge** a frozen
question — it counts toward this section's questions-vs-decisions ratio like any other, and a decision it
already defends is not a gap — but you may not **repair** one: not the wording, not the answer, not the
code block, not its position, and never by deleting it as a duplicate. Where a frozen question and an
unrefined one cover the same decision, the **unrefined** one is the one you cut. A defect you find inside
a frozen block is reported in your finish, quoted, and left byte-for-byte on disk. Only Victor reopens
one, and `[refined]` is a marker you never write in either language.

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
- **The bold question lines of the whole bank file, for the Identity check below and nothing else.** The
  ID counter runs over the file, so allocating or checking one is the single judgement in this prompt
  your section cannot answer on its own. Read them as lines, not as content: one `grep` over that
  file's bold lines gives you every ID in the bank in a single command. That is a licence over **identifiers**, not over
  other sections' questions — you still do not audit, rewrite, judge or report their prose.

## Audit checklist — run every point

- **Exhaustiveness (highest value).** Walk this section's code area and PLANNING.md and list every
  decision, pattern, or rule in it. For each, is there a question? Every gap is a missing question —
  **add it**. This is where most misses are: a thin section. Make it **measurable**: count the real
  decisions you found in this area vs the questions covering them, and treat the section as incomplete
  until questions ≥ decisions. Report that ratio in the finish so a thin section is a number, not a guess.
  **Both sides of that ratio are scoped**: count the decisions in the columns `{SCOPE}` names against the
  questions under its sub-headings only. Counting a whole section's questions against one tier's decisions
  inflates the ratio with another run's work and hides exactly the thin tier this number exists to catch.
- **Question type.** Each targets a decision / pattern / gotcha, not "what is X". Rewrite any generic
  "what is JWT"-style question into one about *this* project's choice.
- **Answerability.** Each is answerable only by someone who wrote this code. Cut or sharpen anything a
  candidate could answer from a tutorial.
- **Model answer.** 2–4 sentences, references the **actual implementation**, uses "I chose" / "I
  decided" — not "it is used". Fix passive, textbook, or code-free answers.
- **Format.** Every question in this section follows the standard's format (the orchestrator handles
  cross-section presence/dedupe; you own this section's questions).
- **Identity.** Every question in this section carries an ID in the standard's `{PROJECT_NAME}-{NNN}`
  form, first inside the bold text. **Add a missing one and report it**; the counter runs over the whole
  file, so allocate from the highest ID present anywhere in the bank, never from your section's last one.
  **Duplicated IDs are the failure this check exists for** — two sections' authors allocate from
  independent reads, and a collision makes every later reference ambiguous. Report any you find with both
  questions quoted. **Renumber only when both questions are inside the sub-headings `{SCOPE}` covers,
  within `{SECTION}`** — the later of the two,
  and never a refined one, since the ID of a frozen block is part of what is frozen. A collision with a
  question in another section — **or under another tier's sub-heading inside your own** — is
  **reported, not repaired**: your read of the bank's bold lines is a
  read, your fixes stay inside your lane, and the orchestrator's cross-section scan owns that
  renumber. Renumbering "the later of the two" across that boundary would rewrite an out-of-scope byte
  under the guise of a repair, which is the one thing this fence exists to stop.
- **No duplication within the section.** No two questions in `{SECTION}` cover the same decision or code
  path.

## Fix, don't just report

Where a check fails, **fix it directly** in the file — add missing questions, rewrite weak ones, cut
duplicates. Preserve the author's good questions; only change what misses the bar. If the bank is
genuinely already exhaustive and at bar, change nothing and record it as PASS.

**This licence stops at your scope's sub-headings.** A weak or duplicated question under another tier's
sub-heading is reported, never rewritten and never cut — the same disposition as a `[refined]` block, for
the same reason: you did not read the code it was written against. **A duplicate that straddles the
boundary is reported by ID and resolved by neither side** — not by cutting theirs, and not by cutting
yours: judging that your question covers the same decision as one written against code you did not read
is the same judgement you are fenced out of, one step over, and it costs a real question. The standard
gives that straddle to a later `full` run, which has read both tiers.

**The one exception is the freeze above**, and it inverts this instruction rather than qualifying it: on
a `[refined]` block you report and do not fix. A question you add to close a gap is born unrefined and
carries the next unused ID in the file.

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
- **The IDs you allocated or repaired**, and every defect you found inside a `[refined]` block — quoted,
  and stated as left untouched. That line is the only route a frozen question's defect has: nothing else
  in this pipeline may open one, and Victor is the only reader who can.

Write your findings and this verdict to the scratch path you were dispatched with, as you reach them,
before returning — the orchestrator reads that file if you die. **If you cannot finish**, stop and open
your report with `BLOCKED — <reason>`, naming which questions you had already changed. That is not a
ratio below 1: a below-1 ratio is a section you finished auditing that still lacks questions, and it
keeps its bytes; a blocked one is half-edited and the orchestrator has to restore or declare it. Never
report `PASS` or `FIXED` for a section you did not finish.
