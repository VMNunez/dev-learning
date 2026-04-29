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
  <select formControlName="type">
    ...
  </select>
  <button type="submit">Save</button>
</form>
```

## Built-in validators

Angular provides validators for the most common cases. You pass them to `FormControl` as the second argument.

```typescript
Validators.required        // field cannot be empty
Validators.min(0.01)       // minimum value for numbers
Validators.max(100)        // maximum value
Validators.minLength(3)    // minimum text length
Validators.email           // valid email format
```

One validator — pass it directly:

```typescript
new FormControl('', Validators.required)
```

Multiple validators — pass an array:

```typescript
new FormControl(null, [Validators.required, Validators.min(0.01)])
```

## Accessing form values

### Getters — access a single control cleanly

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

- `?.` — safe navigation operator, because `get()` can return `null` if the control does not exist

### .value — access all fields at once

When you need all form values together (for example, to save or emit them), use `.value`:

```typescript
onSubmit() {
  const formValue = this.transactionForm.value;
  // { description: 'Lunch', amount: 12.5, type: 'expense', date: '2026-04-17' }
}
```

You can also cast it to a type:

```typescript
this.myOutput.emit(this.transactionForm.value as NewTransaction);
```

---

## Error handling patterns

There are three related patterns that work together. Understanding each one is important.

### 1. Show errors when the user interacts — `touched` + `hasError()`

Do not show errors immediately on page load — only after the user has interacted with the field. The standard check is:

```html
@if (description?.touched && description?.hasError('required')) {
  <p class="error-msg">Description is required</p>
}
```

- `touched` — becomes `true` when the user clicks the field and then leaves it (blur). It does NOT require typing.
- `hasError('required')` — returns `true` if the required validator failed

Combining both means: "show the error only after the user has left the field AND it is invalid."

### 2. Show all errors when submitting — `markAllAsTouched()` + `form.valid`

When the user clicks Submit without filling any field, no field is `touched` yet — so no errors would appear. The fix is to call `markAllAsTouched()` first:

```typescript
onSubmit() {
  this.transactionForm.markAllAsTouched(); // force all fields to show their errors
  if (this.transactionForm.valid) {
    // form is valid — proceed
  }
}
```

This is the standard `onSubmit` pattern:
1. Mark all fields as touched (so all errors are visible)
2. Then check `form.valid` before doing anything

### 3. Warn before discarding changes — `dirty`

`dirty` becomes `true` the moment the user types anything. Use it when you want to warn the user before they close or navigate away from a form they have started filling.

```typescript
onCancel() {
  if (this.myForm.dirty) {
    // open a confirm dialog — only close if the user confirms
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      autoFocus: false,
      data: {
        title: 'Discard changes',
        message: 'You have unsaved changes. Are you sure you want to cancel?',
        confirmLabel: 'Discard',
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (confirmed) => {
        if (confirmed) this.dialogRef.close();
      },
    });
  } else {
    this.dialogRef.close(); // nothing changed — close immediately
  }
}
```

> `dirty` vs `touched`: a field can be `touched` (clicked and left) without being `dirty` (typed into). A field is `dirty` only if the user actually changed its value.

---

## Validation state

In the examples below, `description` is a getter that returns a `FormControl`. Replace it with the name of your own getter.

| Property                           | What it means                   |
| ---------------------------------- | ------------------------------- |
| `description.valid`                | All validators pass             |
| `description.invalid`              | At least one validator fails    |
| `description.touched`              | User clicked the field and left |
| `description.dirty`                | User typed something            |
| `description.hasError('required')` | The required validator failed   |
| `description.hasError('min')`      | The min validator failed        |

`valid`, `invalid`, `touched` and `dirty` all work on both individual controls and the whole form. `hasError()` only works on individual controls — the form itself does not have validators.

```typescript
if (this.transactionForm.valid) {
  // all fields pass — safe to submit
}

if (this.transactionForm.invalid) {
  // at least one field has an error
}
```

### Error names in `hasError()`

The name you pass to `hasError()` always matches the validator name in lowercase:

| Validator                 | Error name    | Example                            |
| ------------------------- | ------------- | ---------------------------------- |
| `Validators.required`     | `'required'`  | `description.hasError('required')` |
| `Validators.min(n)`       | `'min'`       | `amount.hasError('min')`           |
| `Validators.max(n)`       | `'max'`       | `amount.hasError('max')`           |
| `Validators.minLength(n)` | `'minlength'` | `name.hasError('minlength')`       |
| `Validators.email`        | `'email'`     | `email.hasError('email')`          |

---

## onSubmit — handle form submission

```typescript
onSubmit() {
  this.transactionForm.markAllAsTouched(); // trigger error display on all fields
  if (this.transactionForm.valid) {        // only proceed if everything passes
    this.myOutput.emit(this.transactionForm.value as NewTransaction);
    this.transactionForm.reset();          // clear the form after submitting
  }
}
```

---

## reset()

`reset()` resets all fields to their initial values (the ones you passed to `FormControl`). It also resets `touched`, `dirty`, and validation state — the form goes back to a pristine state.

```typescript
this.transactionForm.reset();

// or reset to specific values
this.transactionForm.reset({
  description: '',
  amount: null,
  type: '',
  date: new Date().toISOString().split('T')[0],
});
```

---

## patchValue() — fill the form with existing values

Use `patchValue()` when you need to pre-fill a form with data that already exists — for example, when editing a record.

`patchValue()` is a method on `FormGroup` — you do not inject or import it separately. It is available because your form IS a `FormGroup`.

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

### Why call patchValue() in the constructor?

When the dialog opens, the data is already available — `MAT_DIALOG_DATA` is injected at construction time. There is no reason to wait for `ngOnInit`. The constructor is the right place when all the data is ready immediately.

You would use `ngOnInit` instead if the data came from a route param or an HTTP call that needed time to complete.

```typescript
constructor() {
  if (this.data) {
    this.myForm.patchValue(this.data.task); // pre-fill all fields with existing task data
  }
}
```

**`patchValue()` vs `setValue()`**

| Method         | Behaviour                                                   |
| -------------- | ----------------------------------------------------------- |
| `patchValue()` | Only updates the fields you pass — ignores missing ones     |
| `setValue()`   | Requires **all** fields — throws an error if any is missing |

Use `patchValue()` when editing. Use `setValue()` only when you are sure you have every field.

---

## TypeScript utilities

> These TypeScript patterns appear throughout Angular code. They deserve their own reference file — see `notes/typescript/` (to be created). For now they live here.

### Omit — create a type without some fields

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

---

## Handling input events — (input) vs (change) vs (keyup)

For real-time search or live filtering, use `(input)` — it fires on every character typed, pasted, or deleted:

```html
<input (input)="onSearch($event)" />
```

| Event      | When it fires                          | Use for                        |
| ---------- | -------------------------------------- | ------------------------------ |
| `(input)`  | Every keystroke, paste, delete         | Real-time search, live filter  |
| `(keyup)`  | Every key release — misses mouse paste | Less reliable, avoid           |
| `(change)` | When the field loses focus             | Not useful for live filtering  |

`(input)` is the best choice for live filtering. `(keyup)` misses clipboard paste with the mouse. `(change)` only fires once after the user leaves the field.

### TypeScript cast — $event.target.value

Angular templates do not support TypeScript type assertions (`as`). This does not work in a template:

```html
<!-- ERROR in template -->
<input (input)="search(($event.target as HTMLInputElement).value)" />
```

Move the cast to TypeScript instead:

```html
<!-- template — pass the whole event -->
<input (input)="search($event)" />
```

```typescript
// TypeScript — cast here
search(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  this.searchTerm.set(value);
}
```
