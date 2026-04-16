# Angular — Services and Dependency Injection

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
