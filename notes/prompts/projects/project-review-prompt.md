# Project Review Prompt

Use in a **separate conversation**. Fill in the configuration block, then paste everything into a new chat.

This prompt reviews a project for code quality, patterns, and README quality. At the end it writes improvement tasks to `PROJECT-BACKLOG.md` at the root of the learning folder.

---

**How to use:**

1. Fill in `PROJECT_PATH` — the folder path relative to the learning root
2. Fill in `PROJECT_TYPE` — `angular` or `fullstack`
3. Paste the entire prompt below into a new chat

---

```
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

PROJECT_PATH = [angular/01-todo-list | angular/02-weather-app | angular/03-expense-tracker | angular/04-meal-finder | angular/05-task-manager | angular/06-hr-portal | projects/07-timetrack]
PROJECT_TYPE = [angular | fullstack]

Use these values wherever the prompt refers to {PROJECT_PATH} or {PROJECT_TYPE}.

---

## Step 0 — Backlog Check

Before starting the review, read PROJECT-BACKLOG.md at the root of the learning folder.

Find the section for {PROJECT_PATH}. Check the "Last Reviewed" date.
- If the date is within the last 30 days → stop and report:
  "This project was last reviewed on [date]. Less than 30 days ago — skipping.
   Reply FORCE if you want to run the review anyway."
- If the date is older than 30 days or shows "—" → continue.

---

I want a quality review of my project at {PROJECT_PATH}.

Before starting, read CLAUDE.md — it has my full profile, teaching rules, README format rules,
and learning objectives for each project.

---

## Who I am

I am Victor, 31 years old. I am preparing for a junior developer job at Spanish IT consultancies
(NTT Data, Capgemini, Indra) by August 2026. My stack: Angular + Spring Boot + PostgreSQL.

What Spanish consultancies look for in a portfolio project:
- Clear architecture decisions, not just working code
- Patterns used correctly — not copied from a tutorial without understanding
- A README that a non-developer can read (recruiter) and a technical interviewer can trust
- Tests — at least one per service from Phase 2 onwards
- Can the candidate explain every line? (AI writes boilerplate; this filters juniors out)

My projects:
- 01: todo list — components, signals, services, directives
- 02: weather app — HttpClient, RxJS, forkJoin, API integration
- 03: expense tracker — reactive forms, routing, localStorage, smart/dumb pattern
- 04: meal finder — route params, ActivatedRoute, effect(), favourites
- 05: task manager — Angular Material, MatTable, MatDialog, coordinator pattern
- 06: HR portal — route guards, lazy loading, HTTP interceptors, role-based access, CanDeactivate
- 07: TimeTrack (in progress) — Spring Boot REST API, JWT auth, Spring Data JPA + Hibernate, PostgreSQL, Docker, Angular

---

## Part 1 — README Review

Before running this review, run `notes/prompts/projects/readme-review-prompt.md` in a separate
conversation. That prompt is the single source of README rules and fixes them directly.

This review assumes the README is already correct. If it is not, run readme-review-prompt first.

---

## Part 2 — Code Review

For ANGULAR projects, read the key source files:
- app.routes.ts or app-routing.module.ts
- app.config.ts
- The main page/feature components (pages/ or features/ folder)
- The services folder
- The shared components folder (if it exists)

For FULLSTACK projects, also read:
- backend/src/main/java — controller, service, repository, model, dto, security folders
- backend/src/main/resources/application.properties or application.yml
- docker-compose.yml (if it exists)

Review for:

**Patterns:**
- Is the correct pattern used for this project's learning objective?
  - Project 03: smart/dumb component pattern
  - Project 04: effect() for side effects triggered by signals
  - Project 05: coordinator pattern — coordinator owns state, children only receive and emit
  - Project 06: auth guard, role guard, interceptor, CanDeactivate guard
  - Project 07: layered architecture (controller → service → repository), DTOs, JWT filter
- Are signals used correctly? No unnecessary subscriptions where signals would work?
- Are services single-responsibility?

**TypeScript:**
- Any `any` types where a proper type should be used?
- Are interfaces defined for all data shapes?
- Are optional fields marked with `?` where appropriate?

**Error handling:**
- Does the app handle loading states? (isLoading signal pattern)
- Does the app handle error states? (hasError signal pattern)
- Are HTTP errors caught?

**What a code quality issue looks like — bad vs good:**

TypeScript:
- Bad: `getUser(): any { return this.http.get('/api/user'); }` — `any` loses all type safety; the compiler cannot help you
- Good: `getUser(): Observable<UserResponse> { return this.http.get<UserResponse>('/api/user'); }`

Angular:
- Bad: component constructor calls `this.http.get('/api/tasks').subscribe(...)` — HTTP logic belongs in a service, not a component
- Good: component calls `this.taskService.getTasks()` — HTTP stays in the service; component stays testable and single-responsibility

Spring Boot:
- Bad: controller method contains `if (result.isEmpty()) throw new RuntimeException("Not found")` — business logic in the wrong layer
- Good: exception thrown in the service, caught by `@RestControllerAdvice` — controller only handles HTTP and delegates

**Angular-specific:**
- No memory leaks? (takeUntilDestroyed used with subscriptions)
- No unnecessary `ngOnInit` when `inject()` in the constructor body works?
- Reactive form validation wired correctly? (`touched` + `hasError()`)

**Backend-specific (fullstack only):**
- Controller only handles HTTP — no business logic in controllers?
- Services contain business logic — no SQL queries in services?
- DTOs used at the HTTP boundary — entities not returned directly?
- `@Valid` on request bodies? `@ControllerAdvice` for global error handling?
- JWT secret loaded from environment variable — not hardcoded?
- Passwords hashed with BCrypt — not stored in plain text?

**Tests:**
- Are there any test files? (Phase 2+: at least one service test)
- If tests exist, do they test real behaviour or just that a method was called?

---

## Part 3 — Learning Objectives Check

Read {PROJECT_PATH}/PLANNING.md.

The PLANNING.md lists the learning objectives for this project.
Check whether the code actually demonstrates each objective.

For each objective:
- ✅ Demonstrated — the code shows clear understanding
- ⚠️ Shallow — present but not used in a meaningful way
- ❌ Missing — the objective was not implemented

---

## Part 4 — Improvement Tasks

Based on Parts 1, 2, and 3, write a list of improvement tasks.

Each task must:
- Be specific — "add error state to the login form" not "improve error handling"
- Have a priority: High / Medium / Low
- Have an effort estimate: Small (< 30 min) / Medium (30–90 min) / Large (> 90 min)
- Be actionable on its own — no task should depend on another task being done first
  (unless you note the dependency explicitly)

Priority rules:
- **High** — makes the project look unprofessional or incomplete to a recruiter or interviewer
- **Medium** — a genuine improvement that adds value to the portfolio
- **Low** — nice to have, polish, or minor clarity improvement

---

## Final Step — Update PROJECT-BACKLOG.md

After completing the review, update PROJECT-BACKLOG.md at the root of the learning folder.

Find the section for {PROJECT_PATH}. If it does not exist, create it.

Update the section with:
1. Today's date as "Last Reviewed"
2. An "Overall quality" rating: Strong / Good / Needs work
3. The full list of improvement tasks from Part 4, as checkboxes

Format for each task:
- [ ] **[Priority]** — [Task description] *(Effort: [Small/Medium/Large])*

After completing the section, preserve any tasks that were already checked off (✅) — do not
delete completed items. Only update or add new ones.

Then show the commit message so Victor can run it himself.
Commit format: docs: review {PROJECT_PATH} — <one line summary of main findings>
Example: docs: review angular/06-hr-portal — fix README tradeoffs section, add error state tasks
```
