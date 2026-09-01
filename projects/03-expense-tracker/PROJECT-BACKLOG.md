# Project backlog — 03 Expense Tracker

**Last Reviewed — backend:** n/a — Angular-only
**Last Reviewed — frontend:** 2026-07-14

**Overall quality:** Good — clean signal-based architecture with no HTTP in components and consistent
CSS theme tokens. `effect()` persistence and the dashboard's smart/dumb split have since been
implemented.

## Tasks

- [ ] **[Low]** `[frontend]` — Stop force-casting `this.transactionForm.value as NewTransaction` in `transaction-form.ts`. The form's `type` control is `string | null` while the model wants `'income' | 'expense'`; build the emitted object field by field (or narrow `type` explicitly) so the assertion is not hiding a real type mismatch. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Fix the `How to run` path in `README.md`: it still says `cd dev-learning/angular/03-expense-tracker`, a path the repository reorg removed when `angular/` became `projects/`, so the clone-and-run instructions a recruiter follows fail at the second command. *(Effort: Small)* *(raised 2026-08-31 while triaging the same defect in project 02)*

## Closed

### Frontend

#### High

- 2026-09-01 · **[High]** `[frontend]` — persistence declared once with `effect()` in the service constructor → README, PLANNING already planned it (State management), coverage angular/junior
- 2026-09-01 · **[High]** `[frontend]` — `loadTransactions()` survives a corrupt or wrong-shaped stored value → README, PLANNING State management, coverage javascript/junior + typescript/junior

#### Medium

- 2026-09-01 · **[Medium]** `[frontend]` — `dashboard-page` split into `summary-card`, `filter-bar` and `transaction-list` → README, PLANNING component tree, coverage angular/junior + architecture/junior (already covered and marked)
- 2026-09-01 · **[Medium]** `[frontend]` — default form date built from the local clock, not the UTC day → README, PLANNING Key patterns, coverage javascript/junior

#### Low

- 2026-09-01 · **[Low]** `[frontend]` — transaction ids generated with `crypto.randomUUID()` instead of `Date.now()` → README, PLANNING Key patterns, coverage javascript/junior
- 2026-09-01 · **[Low]** `[frontend]` — `'transactions'` key extracted into `private readonly STORAGE_KEY` → coverage typescript/junior (`readonly` properties)

### Backend

*No backend tasks — Angular-only project.*

---

## Learning objectives

| Concept | Verdict | Note |
|---|---|---|
| `FormGroup` + `FormControl` | ✅ Demonstrated | transaction-form.ts:12-17 — typed controls for all 4 fields |
| `Validators.required` + `Validators.min()` | ✅ Demonstrated | transaction-form.ts:13-16 |
| `markAllAsTouched()` | ✅ Demonstrated | transaction-form.ts:22 |
| `hasError()` + `touched` | ✅ Demonstrated | transaction-form.html — per-field error messages |
| `routerLink` + `RouterOutlet` | ✅ Demonstrated | app.ts:2,6 · dashboard-page.html:4 |
| `Router.navigate()` | ✅ Demonstrated | add-transaction-page.ts:19 |
| `localStorage` + `effect()` | ✅ Demonstrated | transaction.service.ts — single `effect()` in the constructor persists the signal |
| `computed()` with filters | ✅ Demonstrated | dashboard-page.ts:20-49 |
| `Omit<T, K>` | ✅ Demonstrated | transaction.model.ts:9 |
| Smart/dumb pattern | ✅ Demonstrated | both pages are containers; `summary-card`, `filter-bar`, `transaction-list` and `transaction-form` take `input()` and emit `output()` |
| `@media (min-width)` | ✅ Demonstrated | dashboard-page.css:163-170 |
| `position: absolute` + `relative` | ✅ Demonstrated | dashboard-page.css:86,131-133 |

**Tally:** 11 ✅ · 0 ⚠️ · 0 ❌

Tests are out of scope for this project — testing enters the roadmap at project 07.
