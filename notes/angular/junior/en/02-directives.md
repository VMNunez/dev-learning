# Angular — Directives

Official docs: https://angular.dev/guide/directives

## What is a directive?

A directive is a class that adds behaviour to a DOM element. Components are technically directives with a template. The other two types are:

- **Attribute directives** — change the appearance or behaviour of an element (`NgClass`, `NgStyle`, `ngModel`)
- **Structural directives** — add or remove elements from the DOM (`@if`, `@for` — the modern syntax replaces the old `*ngIf`, `*ngFor`)

---

## NgClass — apply classes conditionally

`NgClass` applies one or more CSS classes based on an expression. Use it when you need to apply multiple classes dynamically — for a single class, `[class.name]` is simpler.

```ts
import { NgClass } from '@angular/common';
```

```html
<!-- single class — use [class.x] -->
<div [class.active]="isActive">...</div>

<!-- multiple classes — use NgClass -->
<div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }">...</div>

<!-- apply a class based on a value -->
<span [ngClass]="employee.status">{{ employee.status }}</span>
<!-- adds 'active', 'inactive', or 'on-leave' as a CSS class -->

<!-- array of classes -->
<div [ngClass]="['card', isFeature ? 'card--featured' : '']">...</div>
```

**From the HR portal — badge colours:**

```html
<span [ngClass]="task.priority" class="badge">{{ task.priority }}</span>
```

```css
.badge.high   { background: var(--priority-high); }
.badge.medium { background: var(--priority-medium); }
.badge.low    { background: var(--priority-low); }
```

---

## NgStyle — apply styles conditionally

`NgStyle` applies inline styles dynamically. Use it when the value is calculated at runtime and cannot be a CSS class.

```ts
import { NgStyle } from '@angular/common';
```

```html
<div [ngStyle]="{ 'background-color': employee.colour, 'font-size': fontSize + 'px' }">
  ...
</div>

<!-- shorthand for a single style -->
<div [style.background-color]="employee.colour">...</div>
<div [style.font-size.px]="fontSize">...</div>
```

Prefer CSS classes over `NgStyle` when possible — classes are easier to override and test.

---

## ngModel — two-way binding

`ngModel` binds an input's value to a component property in both directions — the property updates when the user types, and the input updates when the property changes.

```ts
import { FormsModule } from '@angular/forms';
// add FormsModule to the component's imports array
```

```html
<input [(ngModel)]="searchTerm" placeholder="Search..." />
<p>You typed: {{ searchTerm }}</p>
```

```ts
searchTerm = '';
```

`[(ngModel)]` is the **banana in a box** syntax — `[]` for input (property → template), `()` for output (template → property).

**ngModel vs reactive forms:**
- `ngModel` — simple, template-driven, good for one or two fields
- `ReactiveFormsModule` — more control, validation, better for complex forms

In Angular projects that use reactive forms throughout, `ngModel` is used rarely — mainly for simple search inputs or standalone fields.

---

## @ViewChild — access a child element or component from TypeScript

`@ViewChild` gives you a reference to a child component, directive, or DOM element from inside the parent's TypeScript class.

```ts
import { ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';

export class EmployeeListComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
```

- `@ViewChild(MatSort)` — find the first `MatSort` directive in the template
- `sort!: MatSort` — the `!` non-null assertion tells TypeScript that Angular will set this before use
- The value is only available after the template renders — that is why you use it in `ngAfterViewInit`, not in `ngOnInit`

**Access a DOM element directly:**

```ts
@ViewChild('searchInput') inputRef!: ElementRef<HTMLInputElement>;

ngAfterViewInit() {
  this.inputRef.nativeElement.focus();
}
```

```html
<input #searchInput type="text" />
```

---

## ngAfterViewInit — lifecycle hook after the template renders

`ngAfterViewInit` runs once, after Angular has created the component's view and all child views. This is the earliest point where `@ViewChild` references are available.

```ts
import { AfterViewInit } from '@angular/core';

export class EmployeeListComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<Employee>();

  ngAfterViewInit() {
    // safe here — template is fully rendered
    this.dataSource.sort = this.sort;
  }
}
```

**Lifecycle order:**
1. `constructor` — dependency injection, no template yet
2. `ngOnInit` — component initialised, inputs available, no template yet
3. `ngAfterViewInit` — template rendered, `@ViewChild` available
4. `ngOnDestroy` — component is about to be removed

---

## Custom attribute directive — basic pattern

A custom directive adds reusable behaviour to any element without creating a component.

```bash
ng generate directive shared/directives/highlight
```

```ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  @Input() appHighlight = 'yellow';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = this.appHighlight;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }
}
```

```html
<p appHighlight="lightblue">Hover over me</p>
```

- `selector: '[appHighlight]'` — matches any element with the `appHighlight` attribute
- `ElementRef` — gives access to the native DOM element
- `@HostListener` — listens to DOM events on the host element
- `@Input()` with the same name as the selector — lets you pass a value directly: `[appHighlight]="'pink'"`
