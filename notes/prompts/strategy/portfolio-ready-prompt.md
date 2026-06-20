# Portfolio Ready Prompt

Use in a **separate conversation**. Fill in the configuration block, then paste everything into a new chat.

Run this once per project — when you think it is finished and ready to show to a recruiter.
`readme-review-prompt` and `project-review-prompt` must have been run first — this prompt assumes the README is already correct and the code has already been reviewed for quality.

Before running: make sure all tasks you have already fixed are checked off (✅) in `PROJECT-BACKLOG.md`. The verdict in Step 3 reads the backlog directly — unchecked tasks count as open even if the code is already fixed.

It gives you: a bank of project-specific interview questions saved to `notes/interview-prep/projects/`, a go/no-go verdict, a CV bullet, and a GitHub description.

---

**How to use:**

1. Fill in `PROJECT_PATH` and `PROJECT_TYPE`
2. Paste the entire prompt into a new chat

---

````
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

PROJECT_PATH = [angular/01-todo-list | angular/02-weather-app | angular/03-expense-tracker | angular/04-meal-finder | angular/05-task-manager | angular/06-hr-portal | projects/07-timetrack]
PROJECT_TYPE = [angular | fullstack]

Use these values wherever the prompt refers to {PROJECT_PATH} or {PROJECT_TYPE}.

---

## Context

I want to know if the project at {PROJECT_PATH} is ready to show to a recruiter and to
reference in a job application right now. Not "ready eventually" — ready today.

Before starting, read CLAUDE.md (README format rules, teaching rules) and
`notes/prompts/_shared-context.md` (my profile, projects, and what Spanish consultancies
look for in a portfolio project).

---

## Step 1 — Read the project

Read these files (all of them before evaluating anything):

For ALL projects:
- ROADMAP.md (at the root of the learning folder) — for target companies, interview expectations, and what Spanish consultancies look for

For ANGULAR projects:
- {PROJECT_PATH}/PLANNING.md
- {PROJECT_PATH}/README.md
- {PROJECT_PATH}/src/app/app.routes.ts
- {PROJECT_PATH}/src/app/app.config.ts
- {PROJECT_PATH}/src/app/pages/ or features/ — all page components (check PLANNING.md Section 5 for the folder structure)
- {PROJECT_PATH}/src/app/core/services/ — all services
- {PROJECT_PATH}/src/app/core/guards/ — all guards (if the project has routing guards)
- {PROJECT_PATH}/src/app/core/interceptors/ — all interceptors (if the project has auth)

For FULLSTACK projects:
- {PROJECT_PATH}/PLANNING.md
- {PROJECT_PATH}/README.md (global)
- {PROJECT_PATH}/backend/README.md
- {PROJECT_PATH}/frontend/README.md
- {PROJECT_PATH}/backend/src/main/java — controller, service, security folders
- {PROJECT_PATH}/backend/src/main/resources/application.properties (or application.yml)
- {PROJECT_PATH}/backend/src/test/java — all test files (if they exist)
- {PROJECT_PATH}/docker-compose.yml (if it exists)
- {PROJECT_PATH}/frontend/src/app — pages, services, core folders
- {PROJECT_PATH}/frontend/src/**/*.spec.ts — all spec files (if they exist)

---

## Step 2 — Project interview questions

Using the files read in Step 1, look in PLANNING.md for the sections about: new concepts the project introduces, review concepts from previous projects, business rules and domain logic, and architecture decisions and tradeoffs. Use ROADMAP.md to target the questions to the companies and interview context listed there.

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

These questions are saved regardless of the verdict in Step 3 — they are useful interview
preparation even if the project is not yet portfolio-ready.

Save the questions to `notes/interview-prep/projects/{PROJECT_NAME}.md`.
{PROJECT_NAME} is the last segment of {PROJECT_PATH} — e.g. `07-timetrack`, `06-hr-portal`.

If the file already exists, append any questions that are not already there.
Do not add a question that covers the same decision or code path as an existing question,
even if the wording is different.

File format:

```markdown
# Interview Questions — {PROJECT_NAME}

Questions specific to the implementation decisions made in this project.
Use these alongside the topic-based files in interview-prep/en/ and es/.

## Architecture & Patterns

[questions about coordinator, smart/dumb, layered architecture, etc.]

## Security & Auth

[questions about JWT, SecurityContextHolder, BCrypt, etc. — omit this section if the project has no authentication]

## Business Rules

[questions about domain logic — status transitions, validation, access control, etc.]

## Technical Decisions

[questions about DTOs, PATCH vs PUT, soft delete, etc.]

## Testing

[questions about what is tested, why that service or edge case was chosen, what the mock does,
what would break if the test were removed — omit this section if the project has no tests]
```

---

## Step 3 — Final verdict

### Check 1 — Feature completeness (PLANNING.md)

Read `{PROJECT_PATH}/PLANNING.md`. Find the step-by-step plan (Section 0 or the steps list).

Check whether all steps are marked as complete.
- If any steps are incomplete → **❌ Not ready**. List the incomplete steps.
  Do not check the backlog — a partially built project is not portfolio-ready regardless of code quality.

### Check 2 — Code quality (PROJECT-BACKLOG.md)

Only run this check if all steps in PLANNING.md are complete.

Read `PROJECT-BACKLOG.md` at the root of the learning folder.
Find the section for {PROJECT_PATH} and check for open tasks (unchecked `[ ]` items).

If the section for {PROJECT_PATH} does not exist in PROJECT-BACKLOG.md: stop and report —
"PROJECT-BACKLOG.md has no review for this project. Run `project-review-prompt` first."

Apply this logic:

- Any open **High** priority task → ❌ Not ready. List every blocking task as a checkbox.
  Do not proceed to CV bullet or GitHub description — fix these first.
- Only open **Medium** priority tasks → ⚠️ Almost ready. List the open tasks so Victor knows what remains.
  The project can be shown to a recruiter but mention these limitations if asked directly.
- No open High or Medium tasks → ✅ Ready. The project can be shown to a recruiter today.
- Open **Low** priority tasks do not affect the verdict — ignore them.

**✅ Ready** — all steps complete, no open High or Medium tasks. Include this project in the CV and LinkedIn now.

**⚠️ Almost ready** — all steps complete, open Medium tasks remain. List them:
- [ ] Task description *(Effort: Small/Medium/Large)*

**❌ Not ready** — incomplete steps or open High priority tasks exist. List them:
- [ ] Task description or step name *(Effort: Small/Medium/Large)*

---

## Step 4 — CV bullet

**Skip Steps 4 and 5 if the verdict from Step 3 is ❌ Not ready. Jump directly to the Final output format.**

Draft a one-line CV bullet for this project. Format:

`Built [what it is] with [key technologies] — [one specific result or decision that shows depth]`

Examples:
- "Built a full-stack time tracking app with Spring Boot + Angular + JWT — role-based access control and soft delete to preserve audit history."
- "Built an HR portal with Angular route guards and lazy loading — three user roles with completely separate navigation and data access."

Draft two options.

Then save both options to `notes/cv/cv-bullets.md`.
Find the section for {PROJECT_PATH}. If it exists, replace it. If it does not exist, create it.

Format for the entry:

```markdown
## {PROJECT_PATH}

*(choose one — delete the other before committing)*

- [Option A]
- [Option B]
```

If `notes/cv/cv-bullets.md` does not exist yet, create it with this header first:

```markdown
# CV Bullets

One bullet per project. Edit each entry to keep only your chosen option.
Used by `cv-prompt` when drafting the Projects section of your CV.

---
```

---

## Step 5 — GitHub repo description

Draft a one-line GitHub repo description (160 characters max, no markdown):

Format: `[What it does] — [tech stack]. [One thing that makes it worth looking at.]`

Example: "Full-stack time tracker — Spring Boot + Angular + PostgreSQL + JWT. Role-based access, soft delete, JUnit 5 tests."

Draft one option.

Once the CV bullet and GitHub description are chosen:
- Use `cv-prompt` to integrate the bullet into the full CV.
- Update the GitHub repo description manually in the repository settings.

---

## Final output format

Print in this order:
1. One confirmation line: "Saved X questions to notes/interview-prep/projects/{PROJECT_NAME}.md" — do not reprint the questions here, they were already shown in Step 2
2. **Final verdict: ✅ Ready / ⚠️ Almost / ❌ Not ready**
3. CV bullet (two options saved to `notes/cv/cv-bullets.md`) — **omit if verdict is ❌ Not ready**
4. GitHub description (one option) — **omit if verdict is ❌ Not ready**
5. Note (only if verdict is ✅ or ⚠️): "Edit `notes/cv/cv-bullets.md` to keep only your chosen bullet before committing."
6. Commit message

If verdict is ✅ or ⚠️:

```
git add notes/interview-prep/projects/{PROJECT_NAME}.md notes/cv/cv-bullets.md
```

```
git commit -m "docs: portfolio-ready {PROJECT_NAME} — <one line summary>"
```

If verdict is ❌ (notes/cv/cv-bullets.md was not written):

```
git add notes/interview-prep/projects/{PROJECT_NAME}.md
```

```
git commit -m "docs: portfolio-ready {PROJECT_NAME} — <one line summary>"
```
````
