# Angular — Change Detection

Official docs: https://angular.dev/guide/change-detection

## What is change detection?

Change detection is how Angular decides when to update the DOM. When something changes in the app — a user clicks a button, an HTTP response arrives, a timer fires — Angular checks if the component's data changed and updates the template if needed.

---

## Default strategy

By default, Angular checks every component in the tree from top to bottom whenever any event happens anywhere in the app. This works correctly but becomes slow in large apps with hundreds of components.

```ts
@Component({
  selector: 'app-employee-list',
  changeDetection: ChangeDetectionStrategy.Default,  // this is the default
})
```

---

## OnPush strategy

With `OnPush`, Angular only checks the component when:

1. An `@Input()` reference changes (not just its value — a new object reference)
2. An event originates inside the component (`(click)`, `(input)`, etc.)
3. An Observable linked with the `async` pipe emits a new value
4. **A signal used in the template changes** — signals always trigger OnPush

```ts
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-employee-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeCardComponent {
  employee = input.required<Employee>();
}
```

**Why use OnPush?** Angular skips this component on every global check — it only runs when something relevant changes. In a table with 100 rows, that is 100 components Angular no longer needs to check on every click.

---

## Signals and change detection

Signals are fully compatible with `OnPush` — when a signal changes, Angular automatically marks the component as dirty and re-checks it. This is one of the main reasons signals were introduced.

```ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListComponent {
  employees = signal<Employee[]>([]);  // signal change → component re-checks automatically
  filtered = computed(() => this.employees().filter(...));
}
```

With signals, `OnPush` has no downsides — the component still updates whenever its signals change. Without signals (using regular properties), `OnPush` requires discipline to always pass new object references instead of mutating existing ones.

---

## Default vs OnPush — when to use each

| | Default | OnPush |
|---|---------|--------|
| Angular checks when | Any event anywhere | Input ref changes, signals, events inside |
| Performance | Fine for small apps | Better for large apps |
| Works well with | Anything | Signals, immutable data |
| Risk | Slow in large apps | Bugs if you mutate objects directly |

**Rule:** use `OnPush` for presentational components (dumb components) that receive data via `input()` and emit events via `output()`. Use `Default` for page-level coordinator components where simplicity matters more.

---

## ChangeDetectorRef — manual control

In rare cases you need to trigger change detection manually or stop it entirely:

```ts
private cdr = inject(ChangeDetectorRef);

// Force a check now (use with OnPush when Angular misses a change)
this.cdr.detectChanges();

// Mark the component as dirty — will be checked on the next cycle
this.cdr.markForCheck();

// Detach from the change detection tree entirely (advanced)
this.cdr.detach();
```

In practice, if you are using signals you almost never need `ChangeDetectorRef`. It is mostly needed when integrating third-party libraries that update data outside Angular's awareness.
