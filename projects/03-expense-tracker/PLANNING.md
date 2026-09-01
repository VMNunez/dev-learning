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
│   ├── dashboard-page/
│   │   ├── dashboard-page                ← smart, owns the filter signal and the computed totals
│   │   └── components/
│   │       ├── summary-card              ← dumb, receives a label, an amount and a tone
│   │       ├── filter-bar                ← dumb, receives the active filter, emits the new one
│   │       └── transaction-list          ← dumb, receives the filtered list, emits the id to delete
│   └── add-transaction-page/
│       ├── add-transaction-page          ← smart, saves and navigates on submit
│       └── components/
│           └── transaction-form          ← dumb, owns the form, emits the new transaction
└── services/
    └── transaction.service.ts           ← signal + localStorage sync
```

---

## State management

- One `signal<Transaction[]>` in `TransactionService`, synced to localStorage with `effect()`
- Data read back from localStorage is untrusted — it is parsed defensively and shape-checked before it enters the signal
- `computed()` for balance, total income, total expenses, and filtered list
- Smart/dumb component pattern — the dashboard page owns the state, its children only receive inputs and emit intent
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
| Local-clock date formatting | Default value of the form's date field, instead of the UTC day |
| `crypto.randomUUID()` | Transaction ids, instead of deriving them from `Date.now()` |
| `nonNullable` controls + literal union + `getRawValue()` | Form value typed to match the model, so the submit needs no `as` assertion |
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
