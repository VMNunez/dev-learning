# Portfolio write prompt — the question-bank AUTHOR

**Internal component.** This is the **author** in the portfolio pipeline. You normally don't launch it
— `portfolio-audit.md` dispatches it as a cold subagent, then hands its output to
`portfolio-review-prompt.md` (the reviewer). It is documented here so the orchestrator can point a
subagent at it; you can also run it standalone to draft one project's question bank.

**What it does.** Reads **one section's** code area of the project and PLANNING.md and writes the
**exhaustive set of project-specific interview questions for that section** into
`notes/interview-prep/projects/{PROJECT_NAME}.md`. The orchestrator runs it once per bank section
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
`notes/prompts/_shared-context.md`. **Do NOT commit** — leave the question file in the working tree.
The reviewer runs next and the orchestrator owns the commit.

Before starting, read `notes/prompts/projects/portfolio/_portfolio-standard.md` — the interview-question
quality bar, the file template, and the append/dedupe rule. That is what you author against.

---

## Scope — you write ONE section

**When `{SECTION}` ≠ all, you author only that one bank section** and read only its code area — that is
the whole job, and it must be exhaustive for that area. Do not write questions for other sections; if
you notice a decision that belongs in another section, mention it in the report, do not write it. Map
sections to code areas like this:

| {SECTION} | Read (on top of the always-read files below) |
|---|---|
| Architecture & Patterns | structure + layered architecture; backend controllers/services, or angular routes/config/components |
| Security & Auth | backend security folder + JWT filter; angular guards/interceptors |
| Business Rules | service logic + validation + PLANNING.md §8 business rules |
| Technical Decisions | tradeoffs in PLANNING.md, DTOs, HTTP status choices, config/properties |
| Testing | the test files (`src/test/java`, `**/*.spec.ts`) |

(`SECTION = all` on a standalone run means author every section — then still work one section fully
before the next, and read each section's area as above.)

## Step 1 — Read the project

**When `{SECTION}` ≠ all (the normal orchestrated run), your reading list is small and fixed:**
`{PROJECT_PATH}/PLANNING.md`, `ROADMAP.md` (target companies and interview context), and **only your
section's code area** from the table above — nothing else. Do not read the other READMEs, the other
layers, or files outside your area: the per-section split exists precisely so each subagent's context
stays on one area. Read before writing anything.

**Only when `SECTION = all` (standalone run)**, read the full per-type list below on top of PLANNING.md
and ROADMAP.md:

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
in `notes/interview-prep/projects/{PROJECT_NAME}.md` using the standard's file template (create the
heading if the file/section does not exist yet); if questions for this section already exist, append
only what is not already there and never duplicate a decision or code path already covered.

These questions are saved **regardless of the eventual verdict** — they are useful prep even for an
unfinished project.

---

## Output — report (no commit)

Do not commit. Leave the question file in the working tree. Report:
- The project type detected and the files you read for `{SECTION}`.
- How many questions you wrote for this section (and how many were appended vs already there).
- A **decision-by-decision trace for `{SECTION}`**: every real decision/pattern/rule you found in the
  area, each with the question that now covers it — the reviewer uses this to confirm the section is
  exhaustive, not thin.
