# 03 — Expense Tracker

My third Angular project. A personal finance tracker to learn reactive forms, routing, and localStorage persistence.

## Learning objectives

- Reactive forms — `FormGroup`, `FormControl`, `Validators`
- Routing — `routerLink`, `RouterOutlet`, programmatic navigation with `Router`
- localStorage — persist data across page refreshes
- Signals and `computed()` — derived state for balance, income and expenses
- TypeScript utility types — `Omit` to create `NewTransaction` from `Transaction`
- Smart/dumb component pattern — page handles logic, form component only emits

## Features

- Add income and expense transactions with a form
- View balance, total income and total expenses
- Delete transactions
- Data persists after page refresh (localStorage)
- Navigate between dashboard and add transaction page

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
ng serve
```

Open your browser at `http://localhost:4200`
