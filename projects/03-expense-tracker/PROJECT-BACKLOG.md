# Project backlog — 03 Expense Tracker

**Last Reviewed — backend:** n/a — Angular-only
**Last Reviewed — frontend:** 2026-07-14

**Overall quality:** Good — clean signal-based architecture with no HTTP in components and consistent
CSS theme tokens, but two of the patterns the project set out to teach (`effect()` persistence, the
smart/dumb split on the dashboard) never made it into the code.

## Tasks

- [ ] **[High]** `[frontend]` — Wrap the `JSON.parse` in `TransactionService.loadTransactions()` in a `try/catch` that falls back to `[]`. Trigger: a malformed value under the `transactions` localStorage key makes the parse throw inside the field initializer, the service fails to construct and the app never bootstraps (blank page) with no way for the user to recover. *(Effort: Small)*
- [ ] **[High]** `[frontend]` — Replace the manual `localStorage.setItem()` calls duplicated in `addTransaction()` and `deleteTransaction()` with a single `effect()` in the `TransactionService` constructor that reads `transactionList()` and writes it out. `effect()` is the headline pattern in PLANNING.md's "Key patterns introduced" table and currently appears nowhere in the app — the persistence is imperative instead. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Fix the default date in `transaction-form.ts` (initial value and `reset()`): `new Date().toISOString().split('T')[0]` computes the date in UTC, so in Spain (UTC+1/+2) any transaction entered between local midnight and 1–2am is pre-filled with yesterday's date. Build the string from `getFullYear()`/`getMonth()`/`getDate()` instead. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Split `dashboard-page` into the dumb children PLANNING.md planned (`summary-card`, `filter-bar`, `transaction-list`). It is currently one monolithic smart component holding markup, state and click handlers together, so the smart/dumb pattern is only demonstrated on the add-transaction page. *(Effort: Medium)*
- [ ] **[Low]** `[frontend]` — Stop force-casting `this.transactionForm.value as NewTransaction` in `transaction-form.ts`. The form's `type` control is `string | null` while the model wants `'income' | 'expense'`; build the emitted object field by field (or narrow `type` explicitly) so the assertion is not hiding a real type mismatch. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Replace `id: Date.now()` in `TransactionService.addTransaction()` with `crypto.randomUUID()`. Two submits inside the same millisecond (fast double-click) produce duplicate ids, and `deleteTransaction(id)` then removes both rows at once. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Extract the repeated `'transactions'` localStorage key in `TransactionService` into a `private readonly STORAGE_KEY` constant (used in 3 places). *(Effort: Small)*

## Learning objectives

| Concept | Verdict | Note |
|---|---|---|
| `FormGroup` + `FormControl` | ✅ Demonstrated | transaction-form.ts:12-17 — typed controls for all 4 fields |
| `Validators.required` + `Validators.min()` | ✅ Demonstrated | transaction-form.ts:13-16 |
| `markAllAsTouched()` | ✅ Demonstrated | transaction-form.ts:22 |
| `hasError()` + `touched` | ✅ Demonstrated | transaction-form.html — per-field error messages |
| `routerLink` + `RouterOutlet` | ✅ Demonstrated | app.ts:2,6 · dashboard-page.html:4 |
| `Router.navigate()` | ✅ Demonstrated | add-transaction-page.ts:19 |
| `localStorage` + `effect()` | ⚠️ Shallow | transaction.service.ts — manual `setItem()` in each mutator; no `effect()` anywhere |
| `computed()` with filters | ✅ Demonstrated | dashboard-page.ts:20-49 |
| `Omit<T, K>` | ✅ Demonstrated | transaction.model.ts:9 |
| Smart/dumb pattern | ⚠️ Shallow | dashboard-page is monolithic; only add-transaction-page/transaction-form splits |
| `@media (min-width)` | ✅ Demonstrated | dashboard-page.css:163-170 |
| `position: absolute` + `relative` | ✅ Demonstrated | dashboard-page.css:86,131-133 |

**Tally:** 9 ✅ · 2 ⚠️ · 0 ❌

Tests are out of scope for this project — testing enters the roadmap at project 07.
