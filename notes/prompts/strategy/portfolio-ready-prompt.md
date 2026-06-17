# Portfolio Ready Prompt

Use in a **separate conversation**. Fill in the configuration block, then paste everything into a new chat.

Run this once per project — when you think it is finished and ready to show to a recruiter.
`readme-review-prompt` and `project-review-prompt` must have been run first — this prompt assumes the README is already correct and the code has already been reviewed for quality.

It gives you: architecture decisions polished for the portfolio lens, a bank of project-specific interview questions saved to `notes/interview-prep/projects/`, a go/no-go verdict, a CV bullet, and a GitHub description.

---

**How to use:**

1. Fill in `PROJECT_PATH` and `PROJECT_TYPE`
2. Paste the entire prompt into a new chat

---

````
## Configuration — edit only this block

PROJECT_PATH = [angular/01-todo-list | angular/02-weather-app | angular/03-expense-tracker | angular/04-meal-finder | angular/05-task-manager | angular/06-hr-portal | projects/07-timetrack]
PROJECT_TYPE = [angular | fullstack]

---

## Context

I am Victor, 31 years old. I am preparing for a junior Angular + Java Spring Boot position
at Spanish consultancies (NTT Data, Capgemini, Indra) by August 2026.

I want to know if the project at {PROJECT_PATH} is ready to show to a recruiter and to
reference in a job application right now. Not "ready eventually" — ready today.

Before starting, read CLAUDE.md — it has my full profile, README format rules, teaching
rules, and what Spanish consultancies look for in a portfolio project.

---

## Step 1 — Read the project

Read these files (all of them before evaluating anything):

For ANGULAR projects:
- {PROJECT_PATH}/PLANNING.md
- {PROJECT_PATH}/README.md
- {PROJECT_PATH}/src/app/app.routes.ts
- Key page components and services (check PLANNING.md folder structure for the right paths)

For FULLSTACK projects:
- {PROJECT_PATH}/PLANNING.md
- {PROJECT_PATH}/README.md (global)
- {PROJECT_PATH}/backend/README.md
- {PROJECT_PATH}/frontend/README.md
- {PROJECT_PATH}/backend/src/main/java — controller, service, security folders
- {PROJECT_PATH}/frontend/src/app — pages, services, core folders

---

## Step 2 — Architecture decisions quality

Read every architecture decision in the README(s).

For each one, ask: "Could a junior who copied this from a tutorial write this exact sentence?"
- If yes → it is a description, not a decision. Rewrite it to explain the WHY.
- If no → it is a real decision. Mark it as strong.

Decisions that are never acceptable as "real":
- "Used Angular Material for the UI." (everyone does, no decision was made)
- "Used PostgreSQL as the database." (it was given in the requirements)
- "Used JWT for authentication." (no explanation of why JWT over the alternatives)

Format: `[what you chose] to [why it matters]`
- Bad: "Used coordinator pattern."
- Good: "Coordinator pattern to centralise page state so the table and filters stay independently reusable."

Rewrite any weak decision in place. Show the before and after for each one rewritten.

---

## Step 3 — Project interview questions

Read PLANNING.md Sections 3 (new concepts), 4 (review concepts), 8 (business rules), and 19
(architecture decisions). Read the actual source code.

Generate every question a technical interviewer at NTT Data or Capgemini would realistically
ask about THIS specific project — not generic technology questions, but questions about the
actual implementation choices made here.

Examples of the kind of question to generate (adapt to the actual code):
- "In TimeTrack, why does the service use SecurityContextHolder instead of getting the userId from the request body?"
- "Your HR portal has three route guards. Walk me through when each one fires and why you split them."
- "Why does this project use PATCH for status transitions instead of PUT?"
- "What happens in your JWT filter if the token is expired? Where exactly does the request stop?"

Quality bar for each question:
- It must be answerable only by someone who actually wrote or understands this specific code
- It must target a decision, a pattern, or a potential gotcha — not just "what is X"
- The model answer must reference the actual code, not a textbook definition

Format for each question:

**[Question as an interviewer would ask it?]**

[Model answer — 2–4 sentences. References the actual implementation. Uses "I chose" or "I decided" — not "it is used".]

Generate as many questions as there are real decisions and patterns to defend in the project.
Do not cap at 5 — cover every decision, every pattern, every business rule that could come up
in a 30-minute technical interview. A thin file here means a gap the interviewer will find.

Save the questions to `notes/interview-prep/projects/{PROJECT_NAME}.md`.
{PROJECT_NAME} is the last segment of {PROJECT_PATH} — e.g. `07-timetrack`, `06-hr-portal`.

If the file already exists, append any questions that are not already there.
Do not duplicate existing questions.

File format:

```markdown
# Interview Questions — {PROJECT_NAME}

Questions specific to the implementation decisions made in this project.
Use these alongside the topic-based files in interview-prep/en/ and es/.

## Architecture & Patterns

[questions about coordinator, smart/dumb, layered architecture, etc.]

## Security & Auth

[questions about JWT, SecurityContextHolder, BCrypt, etc.]

## Business Rules

[questions about domain logic — status transitions, validation, access control, etc.]

## Technical Decisions

[questions about DTOs, PATCH vs PUT, soft delete, etc.]
```

---

## Step 4 — Final verdict

Based on Steps 2 and 3, and assuming `readme-review-prompt` and `project-review-prompt` have
already been run, give a verdict:

**✅ Ready** — the project can be shown to a recruiter today. Architecture decisions are real,
the interview question bank is solid. Include it in the CV and LinkedIn now.

**⚠️ Almost ready** — one or two specific blockers. List them as checkboxes:
- [ ] Blocker description

**❌ Not ready** — significant gaps remain. List the main gaps and what to do before showing
this project to anyone.

---

## Step 5 — CV bullet

Draft a one-line CV bullet for this project. Format:

`Built [what it is] with [key technologies] — [one specific result or decision that shows depth]`

Examples:
- "Built a full-stack time tracking app with Spring Boot + Angular + JWT — role-based access control and soft delete to preserve audit history."
- "Built an HR portal with Angular route guards and lazy loading — three user roles with completely separate navigation and data access."

Draft two options and let Victor choose.

---

## Step 6 — GitHub repo description

Draft a one-line GitHub repo description (160 characters max, no markdown):

Format: `[What it does] — [tech stack]. [One thing that makes it worth looking at.]`

Example: "Full-stack time tracker — Spring Boot + Angular + PostgreSQL + JWT. Role-based access, soft delete, JUnit 5 tests."

Draft one option.

---

## Final output format

Print in this order:
1. Architecture decisions rewritten (before/after for each one changed, or "All decisions are strong")
2. Questions saved to `notes/interview-prep/projects/{PROJECT_NAME}.md`
3. **Final verdict: ✅ Ready / ⚠️ Almost / ❌ Not ready**
4. CV bullet (two options)
5. GitHub description (one option)
6. Commit message for any README changes and the new questions file

```
git add {PROJECT_PATH}/README.md
```

```
git add notes/interview-prep/projects/{PROJECT_NAME}.md
```

```
git commit -m "docs: portfolio-ready {PROJECT_NAME} — <one line summary>"
```
````
