# Angular Material — Checkbox and Radio Button

Official docs: https://material.angular.io/components/checkbox/overview

Checkboxes and radio buttons are the two ways to let the user pick from fixed options inside a form. The rule is simple: a **checkbox** is for an independent yes/no choice (or "tick all that apply"); a **radio group** is for "pick exactly one". Both plug into reactive forms with `formControlName`, exactly like a text input.

```typescript
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
```

## mat-checkbox — independent boolean choice

Docs: https://material.angular.io/components/checkbox/overview — read: "Use with @angular/forms"

You bind a checkbox the same way as any other control — with `formControlName` in a reactive form, or `[(ngModel)]` for a standalone field. The control value is a `boolean`.

```html
<form [formGroup]="form">
  <mat-checkbox formControlName="acceptTerms">
    I accept the terms and conditions
  </mat-checkbox>
</form>
```

```typescript
form = new FormGroup({
  acceptTerms: new FormControl(false, Validators.requiredTrue),
});
```

> `Validators.required` is not enough for a checkbox — an unticked box is `false`, which `required` treats as "filled". Use **`Validators.requiredTrue`** when the box must actually be ticked (the classic "accept terms" case).

### indeterminate — the "select all" third state

A checkbox has a third visual state beyond checked/unchecked: **indeterminate**, shown as a dash instead of a tick. You use it for a header "select all" checkbox when only *some* rows below are selected — it signals partial selection.

```html
<mat-checkbox
  [checked]="allSelected()"
  [indeterminate]="someSelected() && !allSelected()"
  (change)="toggleAll($event.checked)">
  Select all
</mat-checkbox>
```

```typescript
allSelected = computed(() => this.rows().every(r => r.selected));
someSelected = computed(() => this.rows().some(r => r.selected));
```

`indeterminate` is purely visual — the control's value is still `true` or `false`. You drive it from a `computed()`: show the dash when *some but not all* rows are selected.

## mat-radio-group — pick exactly one

Docs: https://material.angular.io/components/radio/overview — read: "Radio-button label"

Radio buttons must live inside a `mat-radio-group`. The group is what makes them mutually exclusive — and it is the group, not each button, that you bind to the form control.

```html
<mat-radio-group formControlName="status">
  <mat-radio-button value="active">Active</mat-radio-button>
  <mat-radio-button value="inactive">Inactive</mat-radio-button>
  <mat-radio-button value="on-leave">On leave</mat-radio-button>
</mat-radio-group>
```

The form value is the `value` of the selected button — here a string like `'active'`.

> **Why not skip the group wrapper?** Without `mat-radio-group`, each `mat-radio-button` becomes independently selectable — the user could tick all three at once, and there is nothing to bind to the form. The group is what enforces "only one" and connects to `formControlName`.

## Checkbox vs radio — which to use

| Situation | Control |
|---|---|
| One yes/no decision ("accept terms", "is admin") | `mat-checkbox` |
| Tick several from a list ("notify by email, SM, push") | several `mat-checkbox` |
| Pick exactly one from a small fixed set (status with 3 values) | `mat-radio-group` |
| Pick exactly one from many options (country, department) | `mat-select` (see [05-select.md](./05-select.md)) |

The interview version: for a status field with **3 fixed values**, use radio buttons (or `mat-select` if the list grows long). Use a checkbox only when the answer is a single true/false.
