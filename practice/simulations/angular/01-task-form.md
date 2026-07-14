# Angular — Test 01: Task Form

**Time limit:** 60 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Scenario

You are building a task creation screen for a project management app. The backend API is already built — you only need to build the Angular form and connect it to the service.

## What to build

1. A `TaskFormComponent` with a reactive form containing:
   - `title` — required, minimum 3 characters
   - `description` — optional, maximum 200 characters
   - `priority` — required, select with options: Low / Medium / High
   - `dueDate` — required, must be a future date
2. Show validation error messages below each field on submit attempt
3. A `TaskService` with a `createTask(task)` method that calls `POST /api/tasks`
4. Disable the submit button while the request is loading
5. On success: show a success message and reset the form
6. On error: show a generic error message

## Interfaces and mock

```typescript
export interface Task {
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
}
```

The service call can use `HttpClient`. If you don't have a real backend, make the service return `of({ id: 1, ...task })` with a delay to simulate the call.

## Evaluation — what a good solution looks like

- [ ] All four fields present with correct validators
- [ ] Validation errors appear on submit, not on load
- [ ] Submit button is disabled during the request
- [ ] Success message appears and form resets after a successful call
- [ ] Error message appears when the service throws an error
- [ ] No logic in the component that belongs in the service

## Bonus (if done before time)

- Add a character counter below the description field (e.g. "45 / 200")
- Prevent the form from being submitted twice if the button is clicked quickly
