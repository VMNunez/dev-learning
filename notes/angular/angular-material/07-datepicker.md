# Angular Material — Datepicker

Official docs: https://material.angular.io/components/datepicker/overview

## How it works

`MatDatepicker` opens a calendar popup where the user can pick a date. It needs three things to work:

1. A **date adapter** — tells Angular Material how to handle dates
2. The **`MatDatepickerModule`** import in your component
3. Three elements inside `mat-form-field` in the template

---

## Setup — date adapter

Add `provideNativeDateAdapter()` to your `app.config.ts` providers. This uses JavaScript's built-in `Date` object — no extra libraries needed.

```typescript
// app.config.ts
import { provideNativeDateAdapter } from '@angular/material/core';

providers: [
  provideNativeDateAdapter(),
  // ...other providers
]
```

Without this, you get the error:
```
Error: MatDatepicker: No provider found for DateAdapter
```

---

## Template structure

Three elements go inside `mat-form-field`:

```html
<mat-form-field appearance="outline">
  <mat-label>Start Date</mat-label>
  <input matInput [matDatepicker]="startPicker" formControlName="startDate" />
  <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
  <mat-datepicker #startPicker></mat-datepicker>
  <mat-error>Start date is required</mat-error>
</mat-form-field>
```

- `[matDatepicker]="startPicker"` — connects the input to the calendar
- `#startPicker` — template reference, used by the toggle and the input to find each other
- `matIconSuffix` — places the calendar icon on the right side of the field
- `[for]="startPicker"` — tells the toggle which datepicker to open

If you have two date fields (start and end), use different template references (`#startPicker`, `#endPicker`).

---

## TypeScript import

```typescript
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  imports: [MatDatepickerModule, ...]
})
```

---

## Important: the value is a Date object, not a string

`MatDatepicker` stores the selected date as a JavaScript `Date` object. But `FormControl` is usually typed as `string | null` (because you initialise it with `''`). This mismatch means a direct `as Date` cast fails — TypeScript says the types do not overlap.

The solution is a two-step cast through `unknown` (see [TypeScript notes — double assertion](../../typescript/01-typescript-utilities.md)):

```typescript
dateFormat(date: Date): string {
  return date.toISOString().split('T')[0]; // "2026-05-09"
}

onSubmit() {
  const raw = this.form.value;
  this.dialogRef.close({
    startDate: this.dateFormat(raw.startDate as unknown as Date),
    endDate: this.dateFormat(raw.endDate as unknown as Date),
  });
}
```

- `as unknown as Date` — first cast to `unknown` (compatible with everything), then to `Date`
- `.toISOString()` returns `"2026-05-09T00:00:00.000Z"`
- `.split('T')[0]` keeps only the date part: `"2026-05-09"`

### Date validation — end must be after start

When you have two date fields, validate the range before closing the dialog:

```typescript
onSubmit() {
  this.form.markAllAsTouched();
  if (!this.form.valid) return;

  const raw = this.form.value;
  if (raw.endDate! < raw.startDate!) {
    this.form.controls.endDate.setErrors({ invalidDate: true });
    return;
  }

  this.dialogRef.close({ ... });
}
```

In the template, add a second `mat-error` for the custom error key:

```html
<mat-error>
  @if (form.controls.endDate.hasError('required')) { End date is required }
  @else if (form.controls.endDate.hasError('invalidDate')) { End date must be after start date }
</mat-error>
```
