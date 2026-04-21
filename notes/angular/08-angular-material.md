# Angular — Angular Material

Official docs: https://material.angular.io/

## What is Angular Material

A component library made by the Angular team. It gives you ready-made UI components — buttons, tables, dialogs, forms — that follow Google's Material Design guidelines.

Used in enterprise Angular apps in Spain (NTT Data, Capgemini, etc.).

## Install

```bash
ng add @angular/material
```

This installs the package and updates `angular.json` and `styles.css` automatically. Choose a color theme when prompted.

## How to use components

Each component has its own import. Import only what you need in your component's `imports` array.

```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
```

---

## Button — `matButton`

```html
<button matButton>Text</button>
<button matButton="filled">Filled</button>
<button matButton="outlined">Outlined</button>
<button matButton="elevated">Elevated</button>
```

Import: `MatButtonModule` from `@angular/material/button`

---

## Select (dropdown) — `mat-select`

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

Import: `MatSelectModule` from `@angular/material/select` — includes `MatOption` automatically.

`selectionChange` fires when the user picks an option. Use `$event.value` to get the selected value.

---

## Form Field — `mat-form-field`

Wraps inputs and selects to give them Material styling. Always use it with `mat-label`.

Import: `MatFormFieldModule` from `@angular/material/form-field`
