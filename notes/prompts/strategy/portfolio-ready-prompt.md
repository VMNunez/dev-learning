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

## Step 2 — Project interview questions

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

## Step 3 — Final verdict

Read `PROJECT-BACKLOG.md` at the root of the learning folder.
Find the section for {PROJECT_PATH} and check for open tasks (unchecked `[ ]` items).

Apply this logic:

- Any open **High** priority task → ❌ Not ready. List every blocking task as a checkbox.
  Do not proceed to CV bullet or GitHub description — fix these first.
- Only open **Medium** priority tasks → ⚠️ Almost ready. List the open tasks so Victor knows what remains.
- No open High or Medium tasks → ✅ Ready. The project can be shown to a recruiter today.

If the section for {PROJECT_PATH} does not exist in PROJECT-BACKLOG.md, or the last review
date is more than 30 days ago: stop and report —
"PROJECT-BACKLOG.md has no recent review for this project. Run `project-review-prompt` first."

**✅ Ready** — no open High or Medium tasks. Include this project in the CV and LinkedIn now.

**⚠️ Almost ready** — open Medium tasks remain. List them:
- [ ] Task description *(Effort: Small/Medium/Large)*

**❌ Not ready** — open High priority tasks exist. List them:
- [ ] Task description *(Effort: Small/Medium/Large)*

---

## Step 4 — CV bullet

Draft a one-line CV bullet for this project. Format:

`Built [what it is] with [key technologies] — [one specific result or decision that shows depth]`

Examples:
- "Built a full-stack time tracking app with Spring Boot + Angular + JWT — role-based access control and soft delete to preserve audit history."
- "Built an HR portal with Angular route guards and lazy loading — three user roles with completely separate navigation and data access."

Draft two options and let Victor choose.

---

## Step 5 — GitHub repo description

Draft a one-line GitHub repo description (160 characters max, no markdown):

Format: `[What it does] — [tech stack]. [One thing that makes it worth looking at.]`

Example: "Full-stack time tracker — Spring Boot + Angular + PostgreSQL + JWT. Role-based access, soft delete, JUnit 5 tests."

Draft one option.

---

## Final output format

Print in this order:
1. Questions saved to `notes/interview-prep/projects/{PROJECT_NAME}.md`
2. **Final verdict: ✅ Ready / ⚠️ Almost / ❌ Not ready**
3. CV bullet (two options)
4. GitHub description (one option)
5. Commit message

```
git add notes/interview-prep/projects/{PROJECT_NAME}.md
```

```
git commit -m "docs: portfolio-ready {PROJECT_NAME} — <one line summary>"
```
````
