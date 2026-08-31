# Portfolio write prompt — the question-bank AUTHOR

**Internal component.** This is the **author** in the portfolio pipeline. You normally don't launch it
— `portfolio-audit.md` dispatches it as a cold subagent, then hands its output to
`_portfolio-review-prompt.md` (the reviewer). It is documented here so the orchestrator can point a
subagent at it; you can also run it standalone to draft one project's question bank.

**What it does.** Reads **one section's** code area of the project and PLANNING.md and writes the
**exhaustive set of project-specific interview questions for that section** into
`notes/interview-prep/projects/en/{PROJECT_NAME}.md`. The orchestrator runs it once per bank section
(`{SECTION}`), so each run is a small, specific task that cannot skim a tail — the failure mode when one
prompt tries to author the whole bank. It does **not** compute the verdict, write the CV bullet, or
commit — the orchestrator owns those.

---

## Configuration — edit only this block

PROJECT_PATH = [projects/06-hr-portal | projects/07-timetrack | ... — the project folder path]
SECTION      = [all | Architecture & Patterns | Security & Auth | Business Rules | Technical Decisions | Testing]
               → the audit orchestrator passes ONE section; "all" is for a standalone run only.

Use PROJECT_PATH and SECTION wherever the prompt refers to {PROJECT_PATH} and {SECTION}. Derive
{PROJECT_NAME} as the last path segment (e.g. `07-timetrack`) and the project type from the number
(01–06 Angular-only, 07+ full-stack).

---

## Context

My profile, the Spanish job market, and what consultancies look for are in
`notes/prompts/_internal/_shared-context.md`. **Do NOT commit** — leave the question file in the working tree.
The reviewer runs next and the orchestrator owns the commit.

Before starting, read `notes/prompts/projects/portfolio/_internal/_portfolio-standard.md` — the interview-question
quality bar, the file template, the append/dedupe rule, and **"Question identity, the refined freeze and
the TODO channel"**, which governs the ID you allocate on every question you write and the blocks you may
not touch. That is what you author against.

---

## Scope — you write ONE section

**When `{SECTION}` ≠ all, you author only that one bank section** and read only its code area — that is
the whole job, and it must be exhaustive for that area. Do not write questions for other sections; if
you notice a decision that belongs in another section, mention it in the report, do not write it. The
section → code-area mapping is the standard's **"Bank sections → code areas (canonical table)"** — use
that, never a local copy.

(`SECTION = all` on a standalone run means author every section — then still work one section fully
before the next, and read each section's area as above.)

**A question carrying `[refined]` is frozen and is not yours.** Victor wrote that marker; the standard's
freeze binds every role of this pipeline, you included. Do not reword it, do not re-answer it, do not
re-cite its code, do not move it out of its section, and do not delete it as a duplicate of something you
are writing — where your new question duplicates a frozen one, **yours** is the one that does not get
written. If you believe a frozen question is wrong, say so in your report and leave it byte-for-byte as
it stands. Only Victor reopens one.

**Every question you write is born unrefined and carries a stable ID.** Read the whole file before
allocating: the format is `{PROJECT_NAME}-{NNN}` and the counter runs over the **file**, not your
section, so the next unused number is the highest one present anywhere in the bank plus one. Never
recycle an ID a deleted question used and never renumber existing questions to close a gap — other
sections, the Spanish twin and Victor's own TODOs address questions by that number. You never write
`[refined]` yourself, in either language, for any reason.

**You write English, and only into `en/`.** The bank is a bilingual pair and the Spanish twin at
`notes/interview-prep/projects/es/{PROJECT_NAME}.md` belongs to stage **T**
(`_portfolio-translate-prompt.md`), which runs after every section is finished. Never create it, never
append to it, and never write a Spanish question here — a section translated early is translated from a
draft the reviewer has not seen yet, which is the re-sync the notes family split this stage out to
avoid. If the `es/` twin already exists from an earlier run, you still do not touch it; your section
lands in `en/` and stage T brings the twin into line.

## Step 1 — Read the project

**When `{SECTION}` ≠ all (the normal orchestrated run), your reading list is small and fixed:**
`{PROJECT_PATH}/PLANNING.md`, `notes/prompts/_internal/_shared-context.md` (the target companies and
the interview context — the source for both, per the standard's quality bar), and **only your
section's code area** from the standard's canonical table, **and the bank file
`notes/interview-prep/projects/en/{PROJECT_NAME}.md` itself** — nothing else. Do not read the other
READMEs, the other layers, or files outside your area: the per-section split exists precisely so each
subagent's context stays on one area. The bank file is named here because two of your rules need it and
neither is satisfiable from your section alone: the ID counter runs over the whole file, and the
append/dedupe rule is a claim about what the file already contains. Read before writing anything.

**Only when `SECTION = all` (standalone run)**, read the full per-type list below on top of PLANNING.md
and `_shared-context.md`:

**For ANGULAR projects:**
- `{PROJECT_PATH}/PLANNING.md`, `{PROJECT_PATH}/README.md`
- `src/app/app.routes.ts`, `src/app/app.config.ts`
- the page components (`pages/` or `features/`, per PLANNING.md's folder structure)
- `core/services/`, and `core/guards/` + `core/interceptors/` if the project has them

**For FULLSTACK projects:**
- `{PROJECT_PATH}/PLANNING.md`, `{PROJECT_PATH}/README.md` (global), `backend/README.md`, `frontend/README.md`
- `backend/src/main/java` — controller, service, security folders
- `backend/src/main/resources/application.properties` (or `.yml`)
- `backend/src/test/java` — the test files, if they exist
- `docker-compose.yml`, if it exists
- `frontend/src/app` — pages, services, core folders; and `**/*.spec.ts`, if they exist

---

## Step 2 — Write your section's questions

Following the quality bar in the standard, generate every question a technical interviewer at NTT Data
or Capgemini would realistically ask about **THIS specific project** within `{SECTION}` — its actual
implementation choices, not generic technology questions. First **list every real decision, pattern, or
rule in your section's code area** (from the source + PLANNING.md); then write one question per decision
so none is left undefended. Mine the source for the real code paths behind each.

Examples of the shape (adapt to the actual code):
- "In TimeTrack, why does the service use `SecurityContextHolder` instead of the userId from the request body?"
- "Your HR portal has three route guards. Walk me through when each fires and why you split them."
- "Why does this project use PATCH for status transitions instead of PUT?"
- "What happens in your JWT filter if the token is expired? Where exactly does the request stop?"

Apply the standard's **exhaustiveness rule** within your section: as many questions as there are real
decisions and patterns to defend in this area — do not cap at 5. Save them under the `{SECTION}` heading
in `notes/interview-prep/projects/en/{PROJECT_NAME}.md` using the standard's file template and its
per-question format — `**[{PROJECT_NAME}-NNN] Question?**`, the ID first inside the bold text — creating
the heading if the file/section does not exist yet; if questions for this section already exist, append
only what is not already there and never duplicate a decision or code path already covered.

These questions are saved **regardless of the eventual verdict** — they are useful prep even for an
unfinished project.

---

## Output — report (no commit)

Do not commit. Leave the question file in the working tree. Report:
- The project type detected and the files you read for `{SECTION}`.
- How many questions you wrote for this section (and how many were appended vs already there).
- **The ID range you allocated** (e.g. `01-todo-list-042` … `-057`) and the highest ID that existed in
  the file before you started. The next section's author allocates from the file, so a run that cannot
  say what it took is a run nothing can check for a collision.
- Any **refined** question in your section you believe is wrong — which you did not change.
- Any decision you found but could not cover with a question (with why).

**If you cannot finish the section**, stop and open your report with `BLOCKED — <reason>`, then state
**what you already wrote**: which questions landed in the file and under which heading. You write into a
file every other section shares and the orchestrator commits it wholesale, so that line is the only
thing that lets it restore or declare your half-written section instead of committing it as finished
work. A decision you could not cover is **not** this — that is the bullet above, on a section you did
finish.

Build the **decision-by-decision trace** (every real decision/pattern/rule → its question) in your own
context to drive exhaustiveness — do not paste it back: the reviewer is a cold subagent that re-walks
the code itself, and full traces only saturate the orchestrator.
