# 08 — Coordinator pattern

Official docs: https://angular.dev/guide/components/inputs

## What is it?

The coordinator pattern is a way to organise components. The idea is:

- The **page component** handles all the logic — it calls services, manages state, opens dialogs
- The **child components** only display data and emit events — they have no logic of their own

This is also called **smart / dumb** components.

Used in: project 05 — Task Manager

```
TaskPage  ← coordinator (smart)
  ├── TaskFilters  ← dumb (only emits events)
  └── TaskTable    ← dumb (only displays and emits events)
```

---

## Child component — receives data and emits events

The child receives data with `input()` and sends events up with `output()`:

```typescript
export class TaskTable {
  tasks = input<Task[]>([]);

  taskId = output<number>(); // emits when user clicks Delete
  taskToEdit = output<Task>(); // emits when user clicks Edit

  deleteTask(id: number) {
    this.taskId.emit(id);
  }

  editTask(task: Task) {
    this.taskToEdit.emit(task);
  }
}
```

The child does NOT call the service. It only emits. The parent decides what to do.

---

## Parent template — bind all inputs and outputs

> `[tasks]` uses `[]` — square brackets mean you are passing data INTO the child (input).
> `(taskId)` uses `()` — parentheses mean you are listening for an event FROM the child (output).

```html
<app-task-table
  [tasks]="filteredTasks()"
  (taskId)="onDeleteTask($event)"
  (taskToEdit)="onEditTask($event)"
/>
```

> If a child has two outputs, you must bind both in the parent template. If you forget one, the event fires but nothing happens — there is no error.

---

## Parent component — handles all logic

The parent is the only component that knows about services, dialogs, and state. Child components never touch any of that.

```typescript
export class TaskPage {
  // the parent owns all services — children never inject them
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);

  // called when child emits taskId — the parent decides to delete
  onDeleteTask(id: number) {
    this.taskService.deleteTask(id);
  }

  // called when child emits taskToEdit — the parent decides to open the dialog
  onEditTask(task: Task) {
    this.taskService.editTask(task);
  }

  // the parent also opens dialogs directly — children never open dialogs
  openDialog(): void {
    const dialogRef = this.dialog.open(TaskDialog, { width: '500px' });

    dialogRef.afterClosed().subscribe({
      next: (task) => {
        if (task) this.taskService.addTask(task);
      },
    });
  }
}
```

---

## CRUD pattern in the service

The service holds the signal and exposes methods. The page calls the methods — it never modifies the signal directly.

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  tasks = signal<Task[]>(JSON.parse(localStorage.getItem('tasks') ?? '[]'));

  constructor() {
    // sync to localStorage every time the signal changes
    effect(() => {
      localStorage.setItem('tasks', JSON.stringify(this.tasks()));
    });
  }

  addTask(task: Task): void {
    // spread operator keeps the existing tasks and adds the new one at the end
    this.tasks.update((tasks) => [...tasks, task]);
  }

  deleteTask(id: number): void {
    // filter keeps all tasks EXCEPT the one with the given id
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  editTask(updated: Task): void {
    // map replaces the matching task with the updated version, leaves the rest untouched
    this.tasks.update((tasks) => tasks.map((task) => (task.id === updated.id ? updated : task)));
  }
}
```

| Method       | Array technique              | What it does                    |
| ------------ | ---------------------------- | ------------------------------- |
| `addTask`    | spread `[...tasks, newTask]` | adds to the end                 |
| `deleteTask` | `filter()`                   | keeps all except the deleted id |
| `editTask`   | `map()`                      | replaces the matching item      |

---

## Why this pattern matters

- Easy to test — child components have no dependencies
- Easy to read — the page is the single place where logic lives
- Easy to reuse — a dumb component can be used in any page
- Standard in Angular apps and in companies — Spanish consultancies use this pattern

---

## Pattern — clear all filters

When you have multiple filters, the coordinator owns the reset logic. The child just signals that the user clicked "Clear". This follows the same input/output rule: the child receives `hasActiveFilters` as an input, and emits `clearAll` as an output when the button is clicked.

**Child (task-filters)** — receives a boolean to know whether to show the button, emits when user clicks it:

```typescript
// input: the parent tells the child whether any filter is active
hasActiveFilters = input<boolean>(false);
// output: the child tells the parent the user wants to clear
clearAll = output<void>();

onClearAll() {
  this.clearAll.emit(); // emit void — no data needed, just the signal
}
```

```html
<!-- only show the button when at least one filter is active -->
@if (hasActiveFilters()) {
  <button matButton (click)="onClearAll()">Clear All</button>
}
```

**Parent (task-page)** — owns the filter signals and resets all of them:

```typescript
// computed: true if ANY filter is not at its default value
hasActiveFilters = computed(() =>
  this.selectedStatus() !== 'all' ||
  this.selectedPriority() !== 'all' ||
  this.searchTerm() !== ''
);

// resets all filter signals back to their defaults
onClearAll() {
  this.selectedStatus.set('all');
  this.selectedPriority.set('all');
  this.searchTerm.set('');
}
```

```html
<!-- pass the computed down; listen for the clearAll event -->
<app-task-filters [hasActiveFilters]="hasActiveFilters()" (clearAll)="onClearAll()" />
```

The child only shows the button and emits the event. The parent resets all the signals. Each component does only its job.
