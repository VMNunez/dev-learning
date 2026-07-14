# Angular — Test 05: Expense Dashboard

**Time limit:** 75 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Scenario

You are building an expense tracking dashboard. The user can see all expenses in a table, delete individual ones, and see a summary broken down by category.

## What to build

1. An `ExpenseDashboardComponent` that loads expenses on init from an `ExpenseService`
2. Display expenses in a table with columns: description, amount (formatted as currency), category, date
3. A "Delete" button on each row that calls `deleteExpense(id)` on the service
4. After a successful deletion, refresh the list (call `getExpenses()` again)
5. Show the **total amount** of all visible expenses at the bottom of the table
6. Show a **breakdown by category** — for each category, show the category name and the sum of expenses in that category
7. Show a loading state while the initial fetch is running
8. Show an error message if any request fails

## Interfaces and mock

```typescript
export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}
```

Mock data:

```typescript
const MOCK_EXPENSES: Expense[] = [
  { id: 1, description: 'Groceries', amount: 85.50, category: 'Food', date: '2026-06-01' },
  { id: 2, description: 'Netflix', amount: 12.99, category: 'Entertainment', date: '2026-06-02' },
  { id: 3, description: 'Gym', amount: 40.00, category: 'Health', date: '2026-06-03' },
  { id: 4, description: 'Restaurant', amount: 34.20, category: 'Food', date: '2026-06-05' },
  { id: 5, description: 'Bus pass', amount: 25.00, category: 'Transport', date: '2026-06-06' },
  { id: 6, description: 'Cinema', amount: 9.50, category: 'Entertainment', date: '2026-06-07' },
];
```

## Evaluation — what a good solution looks like

- [ ] Table shows all expenses with correct columns
- [ ] Total amount is correctly calculated and updates after deletion
- [ ] Category breakdown is correct and updates after deletion
- [ ] Deletion triggers a refresh (not a local splice of the array)
- [ ] Loading state is shown on init and during deletion
- [ ] Error state is handled for both load and delete
- [ ] Amount is formatted as currency (e.g. "€85.50")

## Bonus (if done before time)

- Add a category filter that shows only expenses from the selected category
- Show a confirmation before deleting ("Are you sure?")
