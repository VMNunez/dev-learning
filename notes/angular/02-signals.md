# Angular — Signals

Official docs: https://angular.dev/guide/signals

## What is a signal?

A signal is a reactive value. When it changes, Angular automatically updates the template. You do not need to manually trigger change detection.

## signal() — reactive state

```typescript
count = signal(0);
name = signal<string>('');
tasks = signal<Task[]>([]);
```

### Read a signal

```typescript
// in TypeScript
const current = this.count();

// in template
{{ count() }}
```

### Update a signal

**`.set()` — replace the value completely**

Use `.set()` when you want to assign a completely new value — replacing whatever was there before.

Typical use cases:
- Reset a list to empty: `this.tasks.set([])`
- Set a boolean flag (loading, error): `this.isLoading.set(true)`
- Replace data after an API call: `this.tasks.set(response.items)`

```typescript
this.count.set(5);
this.tasks.set([]);          // reset list
this.isLoading.set(true);    // set a flag
```

**`.update()` — derive new value from the current one**

Use `.update()` when the new value depends on the current one. The function receives the current value and returns the new one.

Typical use cases:
- Add an item to an array
- Remove an item from an array
- Increment or decrement a counter

```typescript
this.count.update((current) => current + 1);
this.tasks.update((tasks) => [...tasks, newTask]);                   // add item
this.tasks.update((tasks) => tasks.filter((t) => t.id !== id));     // remove item
```

---

## computed() — derived state

Use `computed()` when a value depends on other signals and should update automatically. You never update it directly — Angular recalculates it when its dependencies change.

Typical use cases:
- Filter a list based on the current filter signal
- Count items that match a condition
- Calculate a total from an array of amounts
- Check whether any filter is active (returns a boolean)

```typescript
tasks = signal<Task[]>([]);

completedTasks = computed(() =>
  this.tasks().filter(t => t.done)
);

pendingCount = computed(() =>
  this.tasks().filter(t => !t.done).length
);

totalIncome = computed(() =>
  this.transactions()
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0)
);

// unique values from an array — explained below
allCategories = computed(() =>
  [...new Set(this.favourites().map(meal => meal.strCategory))]
);
```

### Pattern — unique values with Set

Use this when you have an array with duplicate values and you want only the unique ones.
`map` collects all the values (with duplicates), then `Set` makes them unique.

```typescript
// step 1 — extract one field from each object
this.favourites().map(meal => meal.strCategory)
// ['Chicken', 'Beef', 'Chicken', 'Dessert']

// step 2 — pass to Set, which removes duplicates automatically
new Set(['Chicken', 'Beef', 'Chicken', 'Dessert'])
// Set {'Chicken', 'Beef', 'Dessert'}

// step 3 — spread back into a normal array
[...new Set(['Chicken', 'Beef', 'Chicken', 'Dessert'])]
// ['Chicken', 'Beef', 'Dessert']
```

Combined in one line inside `computed()`:

```typescript
allCategories = computed(() => [...new Set(this.favourites().map((meal) => meal.strCategory))]);
```

Use it whenever you need to build a list of filters, tags, or categories from an existing array of objects.

```html
<p>{{ pendingCount() }} tasks pending</p>
```

### Pattern — computed() returning a boolean directly

Instead of using `if` with `return true` / `return false`, return the expression directly:

```typescript
// verbose — avoid this
hasActiveFilters = computed(() => {
  if (this.selectedStatus() !== 'all') return true;
  return false;
});

// clean — do this
hasActiveFilters = computed(
  () =>
    this.selectedStatus() !== 'all' || this.selectedPriority() !== 'all' || this.searchTerm() !== ''
);
```

The expression itself is already a boolean — no need to wrap it in an `if`.

---

### Pattern — multi-filter with "all" option

When you have multiple filters and each can be set to `'all'` (meaning no filter), use `||` to short-circuit the check:

```typescript
filteredTasks = computed(() => {
  return this.tasks().filter((task) => {
    const statusMatch = this.selectedStatus() === 'all' || task.status === this.selectedStatus();
    const priorityMatch =
      this.selectedPriority() === 'all' || task.priority === this.selectedPriority();
    return statusMatch && priorityMatch;
  });
});
```

The trick: if the filter is `'all'`, the first part of `||` is `true` — so the second part is never evaluated. The task always passes that condition. If the filter has a real value, the first part is `false` — so it checks `task.status === selectedStatus()`.

Both conditions must be `true` for the task to appear in the list.

---

## Signals vs regular variables

|                                | Regular variable | Signal         |
| ------------------------------ | ---------------- | -------------- |
| Template updates automatically | No               | Yes            |
| Derived state                  | Manual           | `computed()`   |
| Used in                        | Simple values    | Reactive state |

---

## effect() — side effects

`effect()` runs a function automatically when a tracked signal changes. Use it for side effects — things outside Angular like localStorage, logging, or external updates.

```typescript
effect(() => {
  localStorage.setItem('favourites', JSON.stringify(this.favourites()));
});
```

- Runs once when the component or service is created
- Runs again every time a signal inside it changes
- Angular tracks which signals are used inside the function automatically

### Rules

- Never modify a signal inside `effect()` — it can create an infinite loop
- Use `computed()` instead when you want to derive a new value from signals
- Must be created inside a constructor or injection context

```typescript
constructor() {
  effect(() => {
    localStorage.setItem('favourites', JSON.stringify(this.favourites()));
  });
}
```

### effect() vs computed()

|                 | `computed()`               | `effect()`                |
| --------------- | -------------------------- | ------------------------- |
| Returns a value | Yes                        | No                        |
| Use for         | Derived state              | Side effects              |
| Example         | total price, filtered list | save to localStorage, log |

---

## Pattern — initialise signal from localStorage

```typescript
// clean one-liner with ?? operator
favourites = signal<Meal[]>(JSON.parse(localStorage.getItem('favourites') ?? '[]'));
```

`??` — if `localStorage.getItem` returns `null`, use `'[]'` as the default.
