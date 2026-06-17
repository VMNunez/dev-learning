# Portfolio Ready Prompt

Use in a **separate conversation**. Fill in the configuration block, then paste everything into a new chat.

Run this once per project — when you think it is finished and ready to show to a recruiter.
This is NOT a code review (`project-review-prompt` does that). This is a final gate check:
ready to apply with this project or not?

It gives you a verdict, a list of blockers if any, a CV bullet, and a GitHub description ready to copy.

---

**How to use:**

1. Fill in `PROJECT_PATH` and `PROJECT_TYPE`
2. Paste the entire prompt into a new chat

---

````
## Configuration — edit only this block

PROJECT_PATH = [angular/01-todo-list | angular/02-weather-app | ... | projects/07-timetrack]
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
- {PROJECT_PATH}/README.md
- {PROJECT_PATH}/PLANNING.md
- {PROJECT_PATH}/src/app/app.routes.ts
- Key page components and services (check PLANNING.md folder structure for the right paths)

For FULLSTACK projects:
- {PROJECT_PATH}/README.md (global)
- {PROJECT_PATH}/backend/README.md
- {PROJECT_PATH}/frontend/README.md
- {PROJECT_PATH}/PLANNING.md
- {PROJECT_PATH}/backend/src/main/java — controller, service, security folders
- {PROJECT_PATH}/frontend/src/app — pages, services, core folders

---

## Step 2 — README recruiter test

Imagine you are a non-technical recruiter at NTT Data. You have 60 seconds to decide if
this candidate is worth a call. You open the README.

Check:

**Clarity (can a non-developer understand this?):**
- Does the title describe what the app does in plain language?
- Do the features read from a user perspective, not a developer perspective?
  - Bad: "Uses CanActivateFn to protect routes."
  - Good: "Employees can only see their own data — admins see everyone."
- Is the "Why this project" section human and motivated, or does it read like a tutorial summary?

**Architecture decisions (do they sound like real engineering judgment?):**
- Each decision must follow the format: `[what you did] to [why it matters]`
- Bad: "Used JWT for authentication."
- Good: "JWT over sessions — the API is stateless, so a token that travels with each request
  fits better than server-side session storage."
- Are there at least 5 decisions? Are they real decisions or just descriptions of what was done?

**Tradeoffs (do they show critical thinking?):**
- Each tradeoff must follow: `[chose X] over [Y] — [reason]`
- Are they honest about the limitations of the chosen approach?

**Visual proof:**
- ANGULAR: are there 4 screenshots with bold captions?
- FULLSTACK: is there a GIF of the main flow? Or at least screenshots?
- Are screenshots actually in the repo (not broken links)?

**Live access:**
- Is there a live demo URL? Or clear instructions to run locally?

For each issue found: describe the problem and the fix.
Apply the fixes directly to the README files.

---

## Step 3 — Architecture decisions quality

Read every architecture decision in the README(s).

For each one, ask: "Could a junior who copied this from a tutorial write this exact sentence?"
- If yes → it is a description, not a decision. Rewrite it to explain the WHY.
- If no → it is a real decision. Mark it as strong.

Decisions that are never acceptable as "real":
- "Used Angular Material for the UI." (everyone does, no decision was made)
- "Used PostgreSQL as the database." (it was given in the requirements)
- "Used JWT for authentication." (no explanation of why JWT over the alternatives)

Rewrite any weak decision in place. Show the before and after.

---

## Step 4 — Explainability check

Pick 5 specific questions about the code — not generic concepts, but questions about THIS
project's actual implementation. These are the questions a technical interviewer would ask
after the recruiter passes your CV.

Ask the questions here, one by one. Wait for Victor to answer each one in the chat before
asking the next. After all 5 are answered, evaluate: Confident / Needs review / Unclear.

Examples of the kind of questions to ask (adapt to the actual code):
- "In your auth guard, what happens if the token exists but has expired? Walk me through the code."
- "Why does your UserService use `private final` + constructor injection instead of @Autowired?"
- "Your coordinator component holds all the state. What is the benefit of that vs. each child
  managing its own state?"

Do NOT ask questions Victor cannot answer by reading the code. The goal is to confirm he can
explain every line — not to trick him.

After all answers: print the verdict for explainability.

---

## Step 5 — Tests check

Check:

**Existence:**
- Are there test files in the project?
- For FULLSTACK: at least one JUnit 5 test in the backend, at least one Jasmine test in the
  frontend

**Quality:**
- Do the tests verify real behaviour, or just that a method was called?
  - Weak: `verify(service, times(1)).save(any())` — only checks that something was called
  - Strong: `assertEquals(expected, result)` — checks the actual output
- Are edge cases covered? (entity not found, business rule violation, role violation)
- For Angular services: does the test verify the HTTP call was made AND the data was handled?

If tests are missing or weak: flag it as a blocker. No project is portfolio-ready without
meaningful tests from project 07 onwards.

---

## Step 6 — Final verdict

Based on Steps 2–5, give a verdict:

**✅ Ready** — the project can be shown to a recruiter today. README is clear, decisions are
real, tests exist, Victor can explain every line. Include it in the CV and LinkedIn now.

**⚠️ Almost ready** — one or two specific blockers. List them as checkboxes:
- [ ] Blocker 1 (e.g. "3 of 6 architecture decisions are descriptions — needs rewriting")
- [ ] Blocker 2 (e.g. "no tests in the Angular frontend")
Complete these and the project is ready.

**❌ Not ready** — significant gaps. List the main gaps and what needs to be done before
this project can be shown to anyone. Do not rush to mark a project as portfolio-ready —
a weak project on a CV does more damage than a missing one.

---

## Step 7 — CV bullet

Draft a one-line CV bullet for this project. Format:

`Built [what it is] with [key technologies] — [one specific result or decision that shows depth]`

Examples:
- "Built a full-stack time tracking app with Spring Boot + Angular + JWT auth — including
  role-based access control and soft delete to preserve audit history."
- "Built an HR portal with Angular route guards and lazy loading — three user roles with
  completely separate navigation and data access."

Draft two options and let Victor choose.

---

## Step 8 — GitHub repo description

Draft a one-line GitHub repo description (160 characters max, no markdown):

Format: `[What it does] — [tech stack]. [One thing that makes it worth looking at.]`

Example: "Full-stack time tracker — Spring Boot + Angular + PostgreSQL + JWT. Role-based access, soft delete, JUnit 5 tests."

Draft one option.

---

## Final output format

Print in this order:
1. README fixes applied (or "README is good — no changes needed")
2. Architecture decisions rewritten (or "All decisions are strong")
3. Explainability verdict: Confident / Needs review / Unclear
4. Tests verdict: Strong / Missing / Weak
5. **Final verdict: ✅ Ready / ⚠️ Almost / ❌ Not ready**
6. CV bullet (two options)
7. GitHub description (one option)
8. Commit message for any README changes made

```
git add {PROJECT_PATH}/README.md
```

```
git commit -m "docs: polish {PROJECT_PATH} README — portfolio ready"
```
````
