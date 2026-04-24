# Angular — Reactive Forms

Official docs: https://angular.dev/guide/forms/reactive-forms

## What are reactive forms?

Reactive forms let you manage form state in TypeScript — not in the template. You have full control over validation, values and state.

## Import

Add `ReactiveFormsModule` to the `imports` array of the component that contains the form — without it, `[formGroup]` and `formControlName` will not work.

```typescript
@Component({
  imports: [ReactiveFormsModule],
  ...
})
```

## FormGroup and FormControl

```typescript
transactionForm = new FormGroup({
  description: new FormControl<string | null>('', Validators.required),
  amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
  type: new FormControl<string | null>('', Validators.required),
  date: new FormControl(new Date().toISOString().split('T')[0], Validators.required),
});
```

- `FormGroup` — groups all controls into one object
- `FormControl` — one field with an initial value and validators
- Always use an explicit generic type: `FormControl<string | null>`

## Bind to the template

`[formGroup]` connects the form element to your `FormGroup` object in TypeScript.
`formControlName` connects each input to its `FormControl` by name.
`(ngSubmit)` calls a method when the form is submitted — you must create this method in the component.

```html
<form [formGroup]="transactionForm" (ngSubmit)="onSubmit()">
  <input formControlName="description" />
  <select formControlName="type">...</select>
  <button type="submit">Save</button>
</form>
```

## Built-in validators

```typescript
Validators.required        // field cannot be empty
Validators.min(0.01)       // minimum value for numbers
Validators.max(100)        // maximum value
Validators.minLength(3)    // minimum text length
Validators.email           // valid email format
```

Multiple validators — pass an array:
```typescript
new FormControl(null, [Validators.required, Validators.min(0.01)])
```

## Getters — access controls cleanly in the template

Instead of writing `this.transactionForm.get('description')` everywhere, create a getter in the component. A getter is a method that looks like a property — you access it without `()`.

```typescript
// in the component
get description() {
  return this.transactionForm.get('description');
}
```

Now in the template you can write `description` instead of `transactionForm.get('description')`:

```html
@if (description?.touched && description?.hasError('required')) {
  <p class="error-msg">Description is required</p>
}
```

- `touched` — true after the user has clicked the field and left it. Use this so errors only appear after the user has interacted with the field, not immediately on page load.
- `hasError('required')` — true if the required validator failed
- `?.` — safe navigation operator, because `get()` can return `null` if the control does not exist

## Validation state

In the examples below, `description` is a getter that returns a `FormControl`. Replace it with the name of your own getter.

| Property | What it means |
|----------|--------------|
| `description.valid` | All validators pass |
| `description.invalid` | At least one validator fails |
| `description.touched` | User clicked the field and left |
| `description.dirty` | User typed something |
| `description.hasError('required')` | The required validator failed |
| `description.hasError('min')` | The min validator failed |

You can also check the whole form instead of a specific field:

```typescript
if (this.transactionForm.valid) {
  // all fields pass — safe to submit
}

if (this.transactionForm.invalid) {
  // at least one field has an error
}
```

This is the standard check inside `onSubmit()` — if the form is invalid, stop and show errors.

`valid`, `invalid`, `touched` and `dirty` all work on both individual controls and the whole form. `hasError()` only works on individual controls — the form itself does not have validators.

### Error names in `hasError()`

The name you pass to `hasError()` always matches the validator name in lowercase:

| Validator | Error name | Example |
|-----------|-----------|---------|
| `Validators.required` | `'required'` | `description.hasError('required')` |
| `Validators.min(n)` | `'min'` | `amount.hasError('min')` |
| `Validators.max(n)` | `'max'` | `amount.hasError('max')` |
| `Validators.minLength(n)` | `'minlength'` | `name.hasError('minlength')` |
| `Validators.email` | `'email'` | `email.hasError('email')` |

## onSubmit — handle form submission

```typescript
onSubmit() {
  this.transactionForm.markAllAsTouched(); // show all errors
  if (this.transactionForm.valid) {
    this.myOutput.emit(this.transactionForm.value as NewTransaction);
    this.transactionForm.reset(); // reset to initial values
  }
}
```

## patchValue() — fill the form with existing values

Use `patchValue()` when you need to pre-fill a form with data that already exists — for example, when editing a record.

```typescript
this.myForm.patchValue({
  name: 'Fix login bug',
  status: 'in-progress',
});
```

Angular matches each key to the form control with the same name and sets its value. Fields you don't include stay unchanged.

If the object already has the same field names as your form, you can pass it directly:

```typescript
this.myForm.patchValue(this.existingTask);
```

**`patchValue()` vs `setValue()`**

| Method | Behaviour |
|--------|-----------|
| `patchValue()` | Only updates the fields you pass — ignores missing ones |
| `setValue()` | Requires **all** fields — throws an error if any is missing |

Use `patchValue()` when editing. Use `setValue()` only when you are sure you have every field.

---

## reset()

`reset()` resets all fields to their initial values (the ones you passed to `FormControl`).

```typescript
this.transactionForm.reset();

// or reset to specific values
this.transactionForm.reset({
  description: '',
  amount: null,
  type: '',
  date: new Date().toISOString().split('T')[0]
});
```

---

## TypeScript tip — Omit

When the form does not include all fields of an interface (e.g. `id` is generated later), create a derived type:

```typescript
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export type NewTransaction = Omit<Transaction, 'id'>;
// Result: { description, amount, type, date }
```

Use `NewTransaction` for the form output, `Transaction` for stored data.
