# Angular — Services and Dependency Injection

Official docs: https://angular.dev/guide/di

## What is a service?

A service is a class that holds shared logic or shared state. Components use services instead of managing their own data — this keeps components clean and focused on the UI.

## Generate a service

```bash
ng generate service path/name.service
```

Example:
```bash
ng generate service pages/todo-page/services/task.service
```
This creates `task.service.ts` with class `TaskService`.

## Basic structure

```typescript
@Injectable({
  providedIn: 'root'  // one single instance shared across the whole app
})
export class TaskService {
  tasks = signal<Task[]>([]);

  addTask(task: Task) {
    this.tasks.update(tasks => [...tasks, task]);
  }

  deleteTask(id: number) {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }
}
```

## Dependency injection — inject a service into a component

```typescript
export class TaskList {
  private taskService = inject(TaskService);

  tasks = this.taskService.tasks;

  onDelete(id: number) {
    this.taskService.deleteTask(id);
  }
}
```

- Use `private` — the template does not need direct access to the service
- Assign the signal directly — `tasks = this.taskService.tasks` — this gives the component a reference to the signal itself, not its current value. If you wrote `this.taskService.tasks()` instead, you would get the value at that moment and the template would never update when it changes.

---

## localStorage in a service

The service is responsible for persistence — not the component. This keeps components clean.

The full pattern — signal + effect + localStorage:

```typescript
@Injectable({ providedIn: 'root' })
export class MealService {

  // 1. initialise signal from localStorage
  favourites = signal<Meal[]>(
    JSON.parse(localStorage.getItem('favourites') ?? '[]')
  );

  // 2. save to localStorage automatically when signal changes
  constructor() {
    effect(() => {
      localStorage.setItem('favourites', JSON.stringify(this.favourites()));
    });
  }

  // 3. methods to update the signal
  addFavourite(meal: Meal) {
    this.favourites.update(favs => [...favs, meal]);
  }

  removeFavourite(id: string) {
    this.favourites.update(favs => favs.filter(f => f.idMeal !== id));
  }
}
```

- The component only calls `addFavourite()` or `removeFavourite()` — it never touches localStorage directly
- `effect()` handles the sync automatically

---

## Duplicate check pattern

When you need to prevent duplicate entries, add a method to the service that checks if a value already exists. The component calls it before saving.

### The method

```typescript
nameExists(name: string, excludeId?: number): boolean {
  return this.departments().some(
    (dept) =>
      dept.name.toLowerCase().trim() === name.toLowerCase().trim() &&
      dept.id !== excludeId
  );
}
```

- `excludeId?` — optional. Pass it in edit mode to skip the current item (otherwise its own name is always a "duplicate").
- `.toLowerCase().trim()` — case-insensitive and ignores accidental spaces.
- `Array.some()` — returns `true` as soon as one match is found.
- When `excludeId` is `undefined` (add mode), `dept.id !== undefined` is always `true`, so all departments are checked. The method works for both modes with one call.

### How to call it from the component

```typescript
// add mode — no id needed
this.departmentService.nameExists('Engineering')

// edit mode — skip the department being edited
this.departmentService.nameExists('Engineering', this.editId() as number)

// covering both modes in one call:
this.departmentService.nameExists(
  formValue.name as string,
  this.editId() ?? undefined   // converts null (add mode) to undefined
)
```

`?? undefined` is needed because `editId()` returns `number | null`. The parameter expects `number | undefined`. `??` replaces `null` with `undefined`.

---

## Smart / dumb component pattern

| Type | Responsibility |
|------|---------------|
| Smart (page) | Injects services, handles logic, passes data to children |
| Dumb (component) | Receives data via `input()`, emits events via `output()`, no service injection |

```
DashboardPage (smart)
  └── TransactionItem (dumb) — receives transaction via input, emits delete via output
```

The dumb component does not know where the data comes from. It just displays it.
