# 03 — Expense Tracker

My third Angular project. A personal finance tracker to learn reactive forms, routing, and localStorage persistence.

**Live demo:** https://03angularexpensetracker.netlify.app/

![App preview](screenshots/preview.png)

## Features

- Add income and expense transactions with a validated form
- Real-time balance, total income and total expenses
- Filter transactions by type: All, Income, Expense
- Delete transactions
- Form validation with error messages
- Data persists after page refresh (localStorage)
- Responsive design — works on mobile and desktop

## Architecture decisions

- **Smart/dumb component pattern** — the transaction form is a dumb component that only emits an event with the new transaction data; the page handles saving and updating the list. This keeps the form reusable and moves all state decisions to one place.

- **Reactive forms over template-driven** — the form has validation rules that need to be checked programmatically on submit (`markAllAsTouched()`). Template-driven forms make that harder because the logic lives in the HTML rather than in TypeScript.

- **`localStorage` for persistence** — there is no backend in this project. `localStorage` is the simplest way to keep data after a page refresh, and it is good enough for a personal finance tracker used by one person.

## What I learned

### Angular
- `FormGroup` and `FormControl` — reactive forms
- `Validators.required` and `Validators.min()` — built-in validation
- `hasError()` and `touched` — show error messages at the right moment
- `markAllAsTouched()` — trigger all errors on submit
- `form.reset()` — reset form to initial values after submit
- `routerLink` and `RouterOutlet` — navigation between pages
- `Router` service — programmatic navigation with `router.navigate()`
- `computed()` with filters — derived state that reacts to signals
- `Omit<T, K>` — TypeScript utility type to create `NewTransaction` from `Transaction`
- Smart/dumb component pattern — page handles logic, form only emits

### CSS
- `position: absolute` and `position: relative` — element positioning
- `@media (min-width)` — responsive design, mobile first approach

## Tech stack

- Angular 21
- TypeScript
- CSS

## How to run the project

```bash
git clone https://github.com/VMNunez/dev-learning.git
```

```bash
cd dev-learning/angular/03-expense-tracker
```

```bash
npm install
```

```bash
npm start
```

Open your browser at `http://localhost:4200`
