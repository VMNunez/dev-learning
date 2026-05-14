# Angular Material — Select

Official docs: https://material.angular.io/components/select/overview

Add both to the component's imports array:

```typescript
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
```

`MatSelectModule` includes `MatOption` automatically. `MatFormFieldModule` is needed for the `mat-form-field` wrapper.

## mat-form-field

`mat-form-field` is the wrapper that gives Material styling to the select — the border, floating label, and spacing. Always use it together with `mat-label`.

It does not work alone — it needs a control inside it (`mat-select`, or `input matInput` for text inputs).

By default, `mat-form-field` always reserves space at the bottom for hint or error messages, even when you don't have any. This extra space makes it hard to vertically align a form field with a regular button in the same flex row.

Use `subscriptSizing="dynamic"` to remove that space when there is no hint or error:

```html
<mat-form-field subscriptSizing="dynamic"> ... </mat-form-field>
```

This is useful when you mix form fields and buttons in the same flex row and want them to align correctly.

## Basic usage

Three components work together. You always react to the user's choice with `(selectionChange)` — this is the standard event for `mat-select`.

```html
<mat-form-field>
  <mat-label>Status</mat-label>
  <mat-select (selectionChange)="onStatusChange($event.value)">
    <mat-option value="all">All</mat-option>
    <mat-option value="pending">Pending</mat-option>
    <mat-option value="in-progress">In Progress</mat-option>
    <mat-option value="done">Done</mat-option>
  </mat-select>
</mat-form-field>
```

| Component        | Role                                               |
| ---------------- | -------------------------------------------------- |
| `mat-form-field` | Wrapper — gives the Material style (border, label) |
| `mat-label`      | Label inside the field                             |
| `mat-select`     | The dropdown                                       |
| `mat-option`     | Each option inside the dropdown                    |

## Two ways to handle the selected value

**Option 1 — `selectionChange` event (most common):**

The event fires when the user picks an option. `$event.value` is the value of the selected `mat-option`. You update your signal manually in the method.

```html
<mat-select (selectionChange)="onStatusChange($event.value)"></mat-select>
```

```typescript
onStatusChange(status: FilterStatus): void {
  this.selectedStatus.set(status); // store the selected value in the signal
}
```

**Option 2 — `[(value)]` two-way binding (cleaner, when no extra logic is needed):**

Angular keeps the signal in sync automatically — no method needed. The selected value is stored directly in `selectedStatus` (the signal you pass in).

```html
<!-- reads selectedStatus() to show the current value -->
<!-- calls selectedStatus.set(newValue) when the user picks something -->
<mat-select [(value)]="selectedStatus"></mat-select>
```

Use this when you only need to store the selected value. Use `selectionChange` when you need to do extra work (call a service, validate something, etc.).

## Dynamic options with @for

Instead of hardcoding `mat-option` elements, generate them from an array:

```typescript
statuses = ['all', 'pending', 'in-progress', 'done'];
```

```html
<mat-select>
  @for (status of statuses; track status) {
    <mat-option [value]="status">{{ status }}</mat-option>
  }
</mat-select>
```

`[value]` vs `value`:

- `value="pending"` — literal string, always `"pending"`
- `[value]="status"` — property binding, takes the value from the loop variable

## Resetting the select

When the user selects an option and you need to reset the select back to empty (no option selected), you can either:

**Option A — set the signal to `null`:**

```typescript
this.selectedStatus.set(null);
```

**Option B — add a "None" option with no value:**

```html
<mat-select>
  <mat-option>None</mat-option>  <!-- no value = empty selection -->
  <mat-option value="pending">Pending</mat-option>
  <mat-option value="done">Done</mat-option>
</mat-select>
```

Use Option A when you control the reset programmatically (from TypeScript). Use Option B when you want the user to manually clear the selection from the dropdown itself.

## Grouping options with mat-optgroup

```html
<mat-select>
  <mat-optgroup label="Active">
    <mat-option value="pending">Pending</mat-option>
    <mat-option value="in-progress">In Progress</mat-option>
  </mat-optgroup>
  <mat-optgroup label="Finished">
    <mat-option value="done">Done</mat-option>
  </mat-optgroup>
</mat-select>
```

## Multiple selection

```html
<mat-select multiple></mat-select>
```

The value becomes an array of selected values instead of a single value.
