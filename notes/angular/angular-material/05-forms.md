# Angular Material — Forms

Official docs: https://material.angular.io/components/form-field/overview

Angular Material provides styled wrappers for form inputs. The main building blocks are `mat-form-field`, `matInput`, `mat-label`, `mat-error`, and `mat-hint`.

## Imports

```typescript
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  ...
})
```

- `MatFormFieldModule` — the wrapper (`mat-form-field`, `mat-label`, `mat-error`, `mat-hint`)
- `MatInputModule` — the `matInput` directive that styles a native `<input>` or `<textarea>`

---

## mat-form-field — the wrapper

`mat-form-field` wraps a single input and gives it Material styling: the animated border, floating label, and space for error messages.

It does not work alone — it always needs a control inside it:

```html
<mat-form-field>
  <mat-label>Email</mat-label>
  <input matInput formControlName="email" type="email" />
</mat-form-field>
```

### matInput — styles a native input

`matInput` is an attribute directive — you add it to a native `<input>` or `<textarea>` to give it Material styling inside `mat-form-field`.

```html
<!-- text input -->
<input matInput formControlName="name" />

<!-- password -->
<input matInput formControlName="password" type="password" />

<!-- number -->
<input matInput formControlName="amount" type="number" />

<!-- textarea — must use explicit closing tag, not self-closing -->
<textarea matInput formControlName="description" rows="3"></textarea>
```

> Always use explicit closing tags with `<textarea matInput>` — self-closing `<textarea />` does not work correctly in HTML.

---

## mat-label — floating label

`mat-label` sits inside `mat-form-field`. When the input is empty, the label appears inside the field. When the input is focused or has a value, it floats to the top.

```html
<mat-form-field>
  <mat-label>Task name</mat-label>
  <input matInput formControlName="name" />
</mat-form-field>
```

---

## mat-error — show validation errors

`mat-error` shows an error message below the input. Angular Material shows it automatically when the input is invalid and touched — you do not need to add `@if` around it.

```html
<mat-form-field>
  <mat-label>Name</mat-label>
  <input matInput formControlName="name" />
  <mat-error>Name is required</mat-error>
</mat-form-field>
```

To show different messages for different errors, use multiple `mat-error` elements with `@if`:

```html
<mat-form-field>
  <mat-label>Email</mat-label>
  <input matInput formControlName="email" type="email" />
  @if (email?.hasError('required')) {
    <mat-error>Email is required</mat-error>
  }
  @if (email?.hasError('email')) {
    <mat-error>Enter a valid email address</mat-error>
  }
</mat-form-field>
```

Where `email` is a getter in the component:

```typescript
get email() {
  return this.myForm.get('email');
}
```

> `mat-error` relies on Angular Material's error detection logic — by default, it shows when the field is `invalid` and `touched`. To change when errors appear (for example, only on submit), use `ErrorStateMatcher`. See the [dialog notes](./04-dialog.md) for the pattern.

---

## mat-hint — helper text

`mat-hint` shows a small grey text below the field — useful for instructions or character counts.

```html
<mat-form-field>
  <mat-label>Username</mat-label>
  <input matInput formControlName="username" />
  <mat-hint>Must be at least 3 characters</mat-hint>
</mat-form-field>
```

---

## Complete form example

```typescript
@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  ...
})
export class TaskDialog {
  myForm = new FormGroup({
    name: new FormControl<string | null>('', Validators.required),
    description: new FormControl<string | null>(''),
    status: new FormControl<string | null>('pending', Validators.required),
  });

  get name() { return this.myForm.get('name'); }
  get status() { return this.myForm.get('status'); }
}
```

```html
<form [formGroup]="myForm">
  <mat-form-field>
    <mat-label>Task name</mat-label>
    <input matInput formControlName="name" />
    <mat-error>Name is required</mat-error>
  </mat-form-field>

  <mat-form-field>
    <mat-label>Description</mat-label>
    <textarea matInput formControlName="description" rows="3"></textarea>
    <mat-hint>Optional</mat-hint>
  </mat-form-field>

  <mat-form-field>
    <mat-label>Status</mat-label>
    <mat-select formControlName="status">
      <mat-option value="pending">Pending</mat-option>
      <mat-option value="in-progress">In Progress</mat-option>
      <mat-option value="done">Done</mat-option>
    </mat-select>
    <mat-error>Status is required</mat-error>
  </mat-form-field>
</form>
```

---

## Summary

| Element          | Role                                                        |
| ---------------- | ----------------------------------------------------------- |
| `mat-form-field` | Wrapper — gives Material styling to the control inside      |
| `mat-label`      | Floating label that moves up when the field has focus/value |
| `matInput`       | Directive on `<input>` or `<textarea>` to style it          |
| `mat-error`      | Error message — shown automatically when invalid + touched  |
| `mat-hint`       | Helper text below the field — always visible                |
