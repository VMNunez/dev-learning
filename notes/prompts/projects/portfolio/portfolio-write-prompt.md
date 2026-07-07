# Portfolio write prompt — the question-bank AUTHOR

**Internal component.** This is the **author** in the portfolio pipeline. You normally don't launch it
— `portfolio-audit.md` dispatches it as a cold subagent, then hands its output to
`portfolio-review-prompt.md` (the reviewer). It is documented here so the orchestrator can point a
subagent at it; you can also run it standalone to draft one project's question bank.

**What it does.** Reads the project's real code and PLANNING.md and writes an **exhaustive bank of
project-specific interview questions** to `notes/interview-prep/projects/{PROJECT_NAME}.md`. This is the
heavy generative part of the portfolio gate — the part that gets shortchanged in a long single prompt,
which is why it runs as its own focused subagent. It does **not** compute the verdict, write the CV
bullet, or commit — the orchestrator owns those.

---

## Configuration — edit only this block

PROJECT_PATH = [angular/06-hr-portal | projects/07-timetrack | ... — the project folder path]

Use PROJECT_PATH wherever the prompt refers to {PROJECT_PATH}. Derive {PROJECT_NAME} as the last path
segment (e.g. `07-timetrack`) and the project type from the path prefix (`angular/` vs `projects/`).

---

## Context

My profile, the Spanish job market, and what consultancies look for are in
`notes/prompts/_shared-context.md`. **Do NOT commit** — leave the question file in the working tree.
The reviewer runs next and the orchestrator owns the commit.

Before starting, read `notes/prompts/projects/portfolio/_portfolio-standard.md` — the interview-question
quality bar, the file template, and the append/dedupe rule. That is what you author against.

---

## Step 1 — Read the project

Read all of these before writing anything.

**For all projects:** `ROADMAP.md` — target companies and interview context to aim the questions at.

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

## Step 2 — Write the question bank

Following the quality bar in the standard, generate every question a technical interviewer at NTT Data
or Capgemini would realistically ask about **THIS specific project** — its actual implementation
choices, not generic technology questions. Mine PLANNING.md for new/review concepts, business rules,
and architecture decisions/tradeoffs; mine the source for the real code paths behind them.

Examples of the shape (adapt to the actual code):
- "In TimeTrack, why does the service use `SecurityContextHolder` instead of the userId from the request body?"
- "Your HR portal has three route guards. Walk me through when each fires and why you split them."
- "Why does this project use PATCH for status transitions instead of PUT?"
- "What happens in your JWT filter if the token is expired? Where exactly does the request stop?"

Apply the standard's **exhaustiveness rule**: as many questions as there are real decisions and patterns
to defend — do not cap at 5. Cover architecture/patterns, security/auth, business rules, technical
decisions, and testing. Save to `notes/interview-prep/projects/{PROJECT_NAME}.md` using the standard's
file template; if the file exists, append only what is not already there and never duplicate a decision
or code path already covered.

These questions are saved **regardless of the eventual verdict** — they are useful prep even for an
unfinished project.

---

## Output — report (no commit)

Do not commit. Leave the question file in the working tree. Report:
- The project type detected and the files you read.
- How many questions you wrote (and how many were appended vs the file already had).
- The section breakdown (Architecture & Patterns / Security & Auth / Business Rules / Technical
  Decisions / Testing) so the reviewer can check for thin sections.
