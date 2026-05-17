# Angular — Components

Official docs: https://angular.dev/guide/components

## What is a component?

A component is a piece of the UI. Every Angular app is made of components. Each component has:

- A TypeScript file — the logic
- An HTML file — the template
- A CSS file — the styles

## Generate a component

```bash
ng generate component path/component-name
```

## Basic structure

```typescript
@Component({
  selector: 'app-task-list',
  imports: [],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  title = 'My list';
}
```

```html
<h1>{{ title }}</h1>
```

---

## Data binding

### Interpolation — display a value in the template

```html
<p>{{ task.description }}</p>
```

### Property binding — bind a TypeScript value to an HTML attribute

```html
<img [src]="task.imageUrl" /> <button [disabled]="isLoading">Save</button>
```

### Event binding — listen to a user action

```html
<button (click)="deleteTask(task.id)">Delete</button> <input (input)="onSearch($event)" />
```

### Template reference variables — access an element directly in the template

```html
<input #meal type="text" /> <button (click)="onSearch(meal.value)">Search</button>
```

`#meal` creates a reference to the input element. You can pass `meal.value` to a method without needing a signal or form control. Use this for simple, one-field inputs.

> **Alternative:** you can also use `$event.target` if you cast it to `HTMLInputElement` in TypeScript. This is covered in the event handling section of the reactive forms notes. Template references are simpler — you get the typed element directly in the template without any casting.

**Why not `$event.target.value`?** In TypeScript strict mode, `$event.target` is typed as `EventTarget` — it has no `.value` property. Angular does not know the element is an `HTMLInputElement`. This causes a type error:

```html
<!-- ❌ TypeScript error in strict mode -->
<input (input)="onSearch($event.target.value)" />

<!-- ✅ Use a template reference variable instead -->
<input #searchInput (input)="onSearch(searchInput.value)" />
```

The template reference variable gives you a typed `HTMLInputElement` reference directly — no casting needed.

Combine `(keyup.enter)` with `(click)` so the search runs both when the user presses Enter and when they click the button:

```html
<input #meal type="text" (keyup.enter)="onSearch(meal.value)" />
<button (click)="onSearch(meal.value)">Search</button>
```

`keyup.enter` fires when the user releases the Enter key — no need to check `$event.key === 'Enter'` manually. Works for any key: `keyup.escape`, `keydown.arrowup`, etc.

### Class binding — apply a CSS class conditionally

```html
<p [class.completed]="task.done">{{ task.description }}</p>
<button [class.active]="currentFilter === 'all'">All</button>
```

---

## Inputs and outputs

### Input — receive data from a parent component

> **Good practice:** always provide a default value for your inputs. If the parent does not pass data, the input will be `undefined` — which can crash the template. Use `input<Type>(defaultValue)` to set a safe fallback.

```typescript
// child component
task = input<Task>();
```

```html
<!-- parent template -->
<app-task-item [task]="myTask" />
```

### Output — send an event to the parent component

```typescript
// child component
taskDeleted = output<number>();

onDelete() {
  this.taskDeleted.emit(this.task().id);
}
```

```html
<!-- parent template -->
<app-task-item (taskDeleted)="onTaskDeleted($event)" />
```

```typescript
// parent component
onTaskDeleted(id: number) {
  this.taskService.deleteTask(id);
}
```

### output with an object — when you need to send multiple values

Use an object type when the child needs to emit more than one piece of data at once:

```typescript
// child component
statusChange = output<{ id: number; status: LeaveRequestStatus }>();

onApprove(id: number) {
  this.statusChange.emit({ id, status: 'approved' });
}
```

In the parent template, unpack the object from `$event`:

```html
<!-- parent template -->
<app-leave-request-table (statusChange)="onStatusChange($event.id, $event.status)" />
```

```typescript
// parent component
onStatusChange(id: number, status: LeaveRequestStatus) {
  this.leaveRequestService.updateStatus(id, status);
}
```

The parent method signature must match what you unpack from `$event` — not the object itself.

### output\<void\>() — when you don't need to send data

Use `output<void>()` when the event itself is the signal — you don't need to pass any value. The parent just needs to know it happened.

```typescript
// child
clearAll = output<void>();

onClearAll() {
  this.clearAll.emit();
}
```

```typescript
// parent
onClearAll() {
  this.selectedStatus.set('all');
  this.selectedPriority.set('all');
  this.searchTerm.set('');
}
```

Think of it like a doorbell — it does not send information, it just signals that something happened.

---

## Template directives

### @if — show or hide elements

```html
@if (isLoading) {
<p>Loading...</p>
} @if (task.done) {
<span>Completed</span>
} @else {
<span>Pending</span>
}
```

### @for — render a list

```html
@for (task of tasks; track task.id) {
<app-task-item [task]="task" />
} @empty {
<p>No tasks yet</p>
}
```

`track` is required — it tells Angular which field identifies each item uniquely (usually `id`). Angular uses it to update only the items that changed, not the whole list.

`@empty` renders when the array is empty. It is optional but useful to show a message when there is no data.

---

## Content projection — ng-content

Official docs: https://angular.dev/guide/components/content-projection

`ng-content` lets a parent pass HTML into a child component's template. Instead of the child controlling everything inside it, the parent injects the interior content.

**When to use it:** reusable wrapper components — cards, panels, layout containers — where the interior changes depending on who uses the component.

### Basic example

```typescript
// child — reusable card wrapper
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <ng-content />
    </div>
  `
})
export class CardComponent {}
```

```html
<!-- parent — injects whatever it wants inside the card -->
<app-card>
  <h2>Employee List</h2>
  <p>Content here is controlled by the parent, not the card component.</p>
</app-card>
```

### Named slots — project into multiple areas

Use `select` to define named projection slots:

```typescript
@Component({
  template: `
    <div class="card">
      <div class="card-header">
        <ng-content select="[slot=header]" />
      </div>
      <div class="card-body">
        <ng-content />
      </div>
    </div>
  `
})
```

```html
<app-card>
  <h2 slot="header">Title goes here</h2>
  <p>Body content goes in the default slot.</p>
</app-card>
```

**When you see `ng-content` in a codebase:** the component is a layout wrapper. It does not know or control what its interior contains — that is the responsibility of whoever uses it.

---

## Lifecycle hooks

### ngOnInit — runs once when the component loads

```typescript
export class WeatherPage implements OnInit {
  ngOnInit() {
    this.loadWeather('Madrid');
  }
}
```

Use it to load data from an API when the component starts — not in the constructor.

Typical uses:

- Load data from an API when the page opens
- Read a route parameter and call the API with it
- Load data from localStorage into a signal
- Set a default value based on the current user or route

### @ViewChild — access a child element from TypeScript

`@ViewChild` gives you a reference to a child component, directive, or DOM element inside the TypeScript class.

```ts
import { ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';

export class EmployeeListComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Employee>();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;  // connect MatSort after the template renders
  }
}
```

- The `!` tells TypeScript that Angular will set this before you use it
- The value is only available after the template renders — use it in `ngAfterViewInit`, not in `ngOnInit`

**Access a native DOM element:**

```ts
@ViewChild('searchInput') inputRef!: ElementRef<HTMLInputElement>;

ngAfterViewInit() {
  this.inputRef.nativeElement.focus();
}
```

```html
<input #searchInput type="text" />
```

### ngAfterViewInit — runs after the template renders

Runs once, after Angular has fully rendered the component's template and all its children. This is the earliest point where `@ViewChild` references are available.

```ts
import { AfterViewInit } from '@angular/core';

export class EmployeeListComponent implements AfterViewInit {
  ngAfterViewInit() {
    // template is ready — safe to access @ViewChild references here
  }
}
```

### ngOnChanges — runs when an @Input() property is updated by the parent

Runs every time a parent updates an `@Input()` decorated property. Receives a `SimpleChanges` object with the previous and current values.

```typescript
import { OnChanges, SimpleChanges, Input } from '@angular/core';

export class EmployeeCard implements OnChanges {
  @Input() employee!: Employee;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employee']) {
      console.log('Previous:', changes['employee'].previousValue);
      console.log('Current:', changes['employee'].currentValue);
    }
  }
}
```

> **Important:** `ngOnChanges` works with `@Input()` decorators — the old API. With the modern `input()` signal-based API, use `effect()` instead — it runs whenever the signal value changes. You will see `ngOnChanges` in any existing codebase built before Angular 17+.

| Pattern | API |
|---|---|
| Run code when a parent input changes (old) | `ngOnChanges` + `@Input()` |
| Run code when a parent input changes (modern) | `effect()` + `input()` signal |

### ngOnDestroy — runs before the component is removed

Use it for cleanup — cancel subscriptions, clear timers, release resources.

```ts
import { OnDestroy } from '@angular/core';

export class MyComponent implements OnDestroy {
  ngOnDestroy() {
    // cleanup here
  }
}
```

In practice, `takeUntilDestroyed` handles subscription cleanup automatically — you rarely need `ngOnDestroy` for HTTP calls. You do need it for third-party libraries or manual `setInterval` cleanup.

### Lifecycle order

```
constructor       → DI, no template
ngOnChanges       → runs first time inputs are set, then on every @Input() change
ngOnInit          → inputs available, no template yet — runs once
ngAfterViewInit   → template rendered, @ViewChild available
ngOnDestroy       → component about to be removed
```
