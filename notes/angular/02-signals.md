# Angular — Signals

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

## Pattern — initialise signal from localStorage

```typescript
private loadTasks(): Task[] {
  const data = localStorage.getItem('tasks');
  return data ? JSON.parse(data) : [];
}

tasks = signal<Task[]>(this.loadTasks());
```
