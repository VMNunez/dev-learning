# Project 03 — Expense Tracker

A personal finance app where users log income and expenses, see a running balance,
and filter transactions by type.

---

## Why this project

- **Learning objective:** Learn reactive forms, multi-page routing, and localStorage persistence
- **Portfolio value:** Shows forms and navigation — essential in any business app

---

## Key features

- Add a new transaction (income or expense) with name, amount, and category
- See the total balance, total income, and total expenses
- Filter transactions by type (all / income / expense)
- Delete a transaction
- Data persists in localStorage — nothing is lost on page refresh

---

## Tech stack

- Angular (signals-based, no Angular Material)
- Reactive Forms
- Angular Router (two pages)
- localStorage
- CSS with mobile-first responsive design

---

## Pages and components

```
app/
├── app.component               ← root with RouterOutlet
├── pages/
│   ├── home-page/
│   │   ├── home-page.component          ← smart, owns transactions signal
│   │   ├── summary-card/
│   │   │   └── summary-card.component   ← dumb, receives totals
│   │   ├── filter-bar/
│   │   │   └── filter-bar.component     ← dumb, emits selected filter
│   │   └── transaction-list/
│   │       └── transaction-list.component ← dumb, receives filtered list, emits delete
│   └── add-page/
│       └── add-page.component           ← smart, owns the form, navigates on submit
└── services/
    └── transaction.service.ts           ← signal + localStorage sync
```

---

## State management

- One `signal<Transaction[]>` in `TransactionService`, synced to localStorage with `effect()`
- `computed()` for balance, total income, total expenses, and filtered list
- Smart/dumb component pattern — home-page owns the state, children only display
- `Router.navigate()` on form submit to return to the list

---

## Key patterns introduced

| Pattern | Where used |
|---|---|
| `FormGroup` + `FormControl` | Add transaction form |
| `Validators.required` + `Validators.min()` | Form validation |
| `markAllAsTouched()` | Trigger all errors on submit |
| `hasError()` + `touched` | Show error messages in the template |
| `routerLink` + `RouterOutlet` | Two-page navigation |
| `Router.navigate()` | Programmatic navigation after submit |
| `localStorage + effect()` | Persist and restore data automatically |
| `computed()` with filters | Filtered transaction list |
| `Omit<T, K>` | Remove `id` from the Transaction type for the form |
| Smart/dumb pattern | First time applied explicitly by name |
| `@media (min-width)` | Mobile-first responsive layout |
| `position: absolute` + `relative` | Overlay elements |

---

## Learning steps

1. Define the `Transaction` type and create `TransactionService` with a signal and localStorage sync
2. Set up routing in `app.routes.ts` with home and add pages
3. Build the add form with `FormGroup`, validation, and error messages
4. Build the home page with summary cards and transaction list
5. Add filter signals and `computed()` for the filtered list
6. Build dumb components for summary, filters, and list items
7. Add responsive CSS with mobile-first breakpoints
