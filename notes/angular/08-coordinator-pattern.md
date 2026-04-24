# 08 — Coordinator pattern

Official docs: https://angular.dev/guide/components/inputs

## What is it?

The coordinator pattern is a way to organise components. The idea is:

- The **page component** handles all the logic — it calls services, manages state, opens dialogs
- The **child components** only display data and emit events — they have no logic of their own

This is also called **smart / dumb** components.

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

  taskId = output<number>();      // emits when user clicks Delete
  taskToEdit = output<Task>();    // emits when user clicks Edit

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

```typescript
export class TaskPage {
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);

  onDeleteTask(id: number) {
    this.taskService.deleteTask(id);
  }

  onEditTask(task: Task) {
    // open a dialog, call the service, etc.
    this.taskService.editTask(task);
  }

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
    effect(() => {
      localStorage.setItem('tasks', JSON.stringify(this.tasks()));
    });
  }

  addTask(task: Task): void {
    this.tasks.update((tasks) => [...tasks, task]);
  }

  deleteTask(id: number): void {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  editTask(updated: Task): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === updated.id ? updated : task))
    );
  }
}
```

| Method | Array technique | What it does |
|--------|----------------|--------------|
| `addTask` | spread `[...tasks, newTask]` | adds to the end |
| `deleteTask` | `filter()` | keeps all except the deleted id |
| `editTask` | `map()` | replaces the matching item |

---

## Why this pattern matters

- Easy to test — child components have no dependencies
- Easy to read — the page is the single place where logic lives
- Easy to reuse — a dumb component can be used in any page
- Standard in Angular apps and in companies — Spanish consultancies use this pattern

---

## Used in project 05 — Task Manager
