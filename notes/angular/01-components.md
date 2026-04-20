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
<button (click)="deleteTask(task.id)">Delete</button>
<input (input)="onSearch($event)" />
```

### Template reference variables — access an element directly in the template

```html
<input #meal type="text" />
<button (click)="onSearch(meal.value)">Search</button>
```

`#meal` creates a reference to the input element. You can pass `meal.value` to a method without needing a signal or form control. Use this for simple, one-field inputs.

Combine with keyboard events for a complete search input:

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
