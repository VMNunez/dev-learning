# Conventional Commits

## Format

```
type: short description in present tense

feat: add employee creation form
fix: duplicate email check on submit
style: update button color on toolbar
```

- **type** — what kind of change (see table below)
- **colon + space** — separator
- **description** — short, present tense, lowercase, no period at the end

---

## Prefixes

| Prefix | When to use | Example |
|--------|-------------|---------|
| `feat:` | New feature or new page | `feat: add leave request form` |
| `fix:` | Bug fix | `fix: employee not saving on edit` |
| `style:` | CSS or visual changes | `style: add step labels to stepper` |
| `refactor:` | Code improvement, no new feature | `refactor: simplify employee service` |
| `docs:` | README, comments, documentation | `docs: update README architecture section` |
| `chore:` | Maintenance tasks — dependencies, config | `chore: add Angular Material to project` |
| `test:` | Adding or updating tests | `test: add unit tests to auth service` |
| `perf:` | Performance improvement | `perf: lazy load employee feature module` |

---

## Atomic commits

One logical change per commit. Never group unrelated changes.

**Wrong:**
```
feat: add employee form and fix delete bug and update CSS
```

**Right:**
```
feat: add employee creation form
fix: delete button not removing from list
style: update delete button to use error color
```

**Why atomic commits matter:**
- You can revert one change without affecting the others
- A reviewer can understand each change in isolation
- The history reads like a changelog — useful in real teams

---

## Examples from HR portal

```
feat: add authGuard to protect employee and department routes
feat: add adminGuard to restrict department management to admin role
feat: lazy load employee and department feature modules
feat: add HTTP interceptor to attach auth token to every request
feat: add employee CRUD with MatTable and dual-mode dialog
fix: move email duplicate check to onNext step of stepper
style: add step labels and full-width email field to employee stepper
docs: update README with architecture decisions
chore: add provideNativeDateAdapter for MatDatepicker
refactor: extract confirm dialog into reusable shared component
```

---

## Optional: scope

You can add a scope in parentheses to specify which part of the app changed:

```
feat(employees): add duplicate email check
fix(auth): redirect to login on 401 response
style(dialog): increase form field spacing
```

Scope is optional but useful in larger projects where multiple features are in progress at the same time.
