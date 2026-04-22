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

## Basic usage

Three components work together:

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

| Component | Role |
|-----------|------|
| `mat-form-field` | Wrapper — gives the Material style (border, label) |
| `mat-label` | Label inside the field |
| `mat-select` | The dropdown |
| `mat-option` | Each option inside the dropdown |

## Two ways to handle the selected value

**Option 1 — `selectionChange` event:**
```html
<mat-select (selectionChange)="onStatusChange($event.value)">
```
You need a method in the component to update the signal manually:
```typescript
onStatusChange(status: FilterStatus): void {
  this.selectedStatus.set(status);
}
```

**Option 2 — `[(value)]` two-way binding:**
```html
<mat-select [(value)]="selectedStatus">
```
No method needed — Angular keeps the signal in sync automatically. Cleaner when you just need to store the selected value.

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

Add an option with no value to let the user clear the selection:

```html
<mat-select>
  <mat-option>None</mat-option>  <!-- no value = resets the select -->
  <mat-option value="pending">Pending</mat-option>
  <mat-option value="done">Done</mat-option>
</mat-select>
```

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
<mat-select multiple>
```

The value becomes an array of selected values instead of a single value.