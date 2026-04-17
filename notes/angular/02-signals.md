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

```typescript
// set — replace the value completely
this.count.set(5);
this.tasks.set([]);

// update — derive new value from the current one
this.count.update(current => current + 1);
this.tasks.update(tasks => [...tasks, newTask]);
this.tasks.update(tasks => tasks.filter(t => t.id !== id));
```

---

## computed() — derived state

A computed signal depends on other signals. It recalculates automatically when its dependencies change.

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
```

```html
<p>{{ pendingCount() }} tasks pending</p>
```

---

## Signals vs regular variables

| | Regular variable | Signal |
|--|-----------------|--------|
| Template updates automatically | No | Yes |
| Derived state | Manual | `computed()` |
| Used in | Simple values | Reactive state |

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

| | `computed()` | `effect()` |
|--|-------------|------------|
| Returns a value | Yes | No |
| Use for | Derived state | Side effects |
| Example | total price, filtered list | save to localStorage, log |

---

## Pattern — initialise signal from localStorage

```typescript
// clean one-liner with ?? operator
favourites = signal<Meal[]>(
  JSON.parse(localStorage.getItem('favourites') ?? '[]')
);
```

`??` — if `localStorage.getItem` returns `null`, use `'[]'` as the default.
