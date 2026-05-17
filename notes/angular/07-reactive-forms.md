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

You define the form in the TypeScript component class — not in the template. The template only binds to it with `[formGroup]`.

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
Validators.required; // field cannot be empty
Validators.min(0.01); // minimum value for numbers
Validators.max(100); // maximum value
Validators.minLength(3); // minimum text length
Validators.email; // valid email format
```

One validator — pass it directly:

```typescript
new FormControl('', Validators.required);
```

Multiple validators — pass an array:

```typescript
new FormControl(null, [Validators.required, Validators.min(0.01)]);
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

You can also cast it to a type and emit all values at once:

```typescript
this.myOutput.emit(this.transactionForm.value as NewTransaction);
```

Yes — this sends all form values at once with one expression. The `as NewTransaction` is a TypeScript type assertion: it tells TypeScript "treat this object as `NewTransaction`". It does not change the data — it only satisfies the type checker. This works because the form controls match the `NewTransaction` fields exactly.

---

### Ways to access form values — summary

| Approach | Code | When to use |
| --- | --- | --- |
| Get the `FormControl` | `this.form.get('name')` | Validation state — `.hasError()`, `.touched`, `.dirty` |
| Access one value | `this.form.value.name` | Quick read of a single field |
| Store all values | `const formValue = this.form.value` | `onSubmit()` — access multiple fields cleanly |
| Destructure | `const { name, description } = this.form.value` | When you need several fields individually |

**Which is used most?**

- In `onSubmit()` → `const formValue = this.form.value` — most common and most readable
- In the template for validation → `this.form.get('name')` via a getter
- Destructuring → useful but rare in real projects

The key difference: `get()` returns the `FormControl` object — use it for validation state. `.value` returns the actual data — use it when you need to save or emit the form content.

---

## Two ways to access a FormControl in the template

To call `.hasError()`, `.touched`, `.dirty`, etc. in the template, you first need to get the `FormControl` object. There are two ways:

| Approach | Template code | TypeScript needed |
|---|---|---|
| Getter | `name?.hasError('required')` | `get name() { return this.form.get('name'); }` |
| Direct | `departmentForm.controls.name.hasError('required')` | Nothing extra |

Both do exactly the same thing. The difference is readability:
- Use a **getter** when you access the same control in many places — the template stays short
- Use **direct** (`controls.name`) when you only use the control once or twice — no extra code needed

In both cases, use `?.` (safe navigation) because `get()` can return `null` if the control name is wrong.

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

`setValue()` is useful when you are replacing the entire form state and you are sure you have every field:

```typescript
// setValue requires every field — throws an error if any is missing
this.myForm.setValue({
  name: task.name,
  status: task.status,
  priority: task.priority,
  description: task.description,
});
```

In practice, `patchValue()` is the safer choice because it does not throw an error if a field is missing or your interface changes. Use `setValue()` only when you are certain you have all fields.

Use `patchValue()` when editing. Use `setValue()` only when you are sure you have every field.

---

## TypeScript utilities

See [`notes/typescript/01-typescript-utilities.md`](../typescript/01-typescript-utilities.md) — `Omit`, type assertions (`as`), optional fields, union types.

---

## setErrors() vs signal — when to use each

When you need to show an error that is not from a built-in validator, you have two tools. The choice depends on one question: **does this error belong to a specific field, or to the whole form?**

### Error on a specific field → `setErrors()`

Use this when the error is clearly about one input. For example: "this email is already taken" belongs to the email field — it makes sense to show it directly below that input.

```typescript
// in onSubmit() — after checking for duplicates
this.form.controls.email.setErrors({ duplicateEmail: true });
return;
```

```html
<!-- inside the email mat-form-field -->
@if (email?.hasError('duplicateEmail')) {
  <mat-error>Email already exists</mat-error>
}
```

`mat-error` shows the message below the field automatically. The user sees exactly which field has the problem.

---

### Error on the whole form → signal

Use this when the error is not about one field in particular. For example:

- **Login failure** — "Wrong email or password." You do not want to highlight one field specifically, because you do not know which one is wrong.
- **API or server error** — "Something went wrong. Try again." This has nothing to do with any individual field.
- **Permission error** — "You do not have access to do this."

In these cases, there is no form control to attach the error to. A signal is the right tool:

```typescript
// in the component class
loginError = signal<string | null>(null);
```

```typescript
// in onSubmit() — reset first, then set if something fails
this.loginError.set(null);        // clear previous error
// ... login attempt fails:
this.loginError.set('Wrong email or password.');
```

```html
<!-- outside any mat-form-field, at the top or bottom of the form -->
@if (loginError()) {
  <p class="error">{{ loginError() }}</p>
}
```

Always reset the signal to `null` at the start of `onSubmit()` so old errors do not stay visible when the user tries again.

---

### Real examples in this project

The **login page** uses the signal pattern — when credentials are wrong, one message appears below the form, not below any specific field:

```typescript
hasError = signal(false);
```
```html
@if (hasError()) {
  <p class="error">Invalid email or password</p>
}
```

The **employee dialog** uses `setErrors()` for duplicate email — because the error belongs to the email field specifically.

---

### Summary

| Question | Tool |
|---|---|
| Does the error belong to a specific field? | `setErrors()` + `mat-error` inside `mat-form-field` |
| Is the error about the whole form or operation? | `signal` + `@if` paragraph outside the fields |

---

## Custom form errors — setErrors()

Built-in validators (`required`, `min`, `email`) cover most cases. But sometimes you need a custom check that validators cannot do — for example, checking if a name is already taken in a database or a list.

For this, Angular lets you set a custom error directly on a form control using `setErrors()`.

### Setting a custom error

Call `setErrors()` on the form control with an object. The key is your custom error name — you choose it.

```typescript
this.departmentForm.controls.name.setErrors({ duplicateName: true });
```

Breaking down the chain:

```
this.departmentForm            → the FormGroup (the whole form)
  .controls                    → access all FormControls inside it
  .name                        → the specific FormControl for the "name" field
  .setErrors({ ... })          → set a custom error on that control
```

`.controls.name` works for any field in your form — replace `name` with `description`, `email`, or whatever your control is called.

This does two things at once:
1. Marks the control as invalid — so `mat-error` will show automatically
2. Stores the error under the key `'duplicateName'` — so you can check it with `hasError()`

### Checking a custom error in the template

> **Custom error keys are case-sensitive.** The key in `setErrors()` must match exactly what you use in `hasError()`. `'duplicateName'` and `'duplicatename'` are different — the second one will never match. Use the key exactly as you declared it.

`hasError()` works with custom keys exactly the same way as built-in ones:

```html
<mat-error @if (departmentForm.controls.name.hasError('required'))>
  Name is required
</mat-error>
<mat-error @if (departmentForm.controls.name.hasError('duplicateName'))>
  A department with this name already exists
</mat-error>
```

### How errors clear automatically

When the user types again, Angular re-runs all validators on the control. This **replaces the errors object** — including your custom error. So you do not need to clear `setErrors()` manually. The moment the user changes the field, the custom error disappears.

---

## Duplicate check pattern in onSubmit()

When you have a service-level duplicate check (see [04-services.md](./04-services.md)), the standard pattern in `onSubmit()` is:

1. Reset any previous error state
2. Check for the duplicate **before** the save logic
3. If duplicate → set the error on the control, then `return` to stop everything
4. If not duplicate → proceed with the save normally

```typescript
onSubmit() {
  this.departmentForm.markAllAsTouched();

  if (this.departmentForm.valid) {
    const formValue = this.departmentForm.value;

    // 1. Check for duplicate — covers both add and edit with one call
    const isDuplicate = this.departmentService.nameExists(
      formValue.name as string,
      this.editId() ?? undefined  // pass id in edit mode, undefined in add mode
    );

    // 2. If duplicate — mark the field as invalid and stop
    if (isDuplicate) {
      this.departmentForm.controls.name.setErrors({ duplicateName: true });
      return;  // stops here — no save, no navigate, no markAsPristine
    }

    // 3. Only reaches here if no duplicate — proceed with save
    if (this.editId()) {
      this.departmentService.editDepartment({ id: this.editId() as number, ...data });
    } else {
      this.departmentService.addDepartment({ id: Date.now(), ...data });
    }

    this.departmentForm.markAsPristine();
    this.router.navigate(['departments']);
  }
}
```

Key points:
- The `return` is essential — without it, `markAsPristine()` and `router.navigate()` would still run even when a duplicate was found
- The duplicate check runs **before** the `if (this.editId())` block so it covers both add and edit
- `?? undefined` converts `null` (add mode) to `undefined` — `??` returns the right side only when the left side is `null` or `undefined`. See [TypeScript notes — `??`](../typescript/01-typescript-utilities.md#--nullish-coalescing-operator)

---

## Handling input events — (input) vs (change) vs (keyup)

For real-time search or live filtering, use `(input)` — it fires on every character typed, pasted, or deleted:

```html
<input (input)="onSearch($event)" />
```

| Event      | When it fires                          | Use for                       |
| ---------- | -------------------------------------- | ----------------------------- |
| `(input)`  | Every keystroke, paste, delete         | Real-time search, live filter |
| `(keyup)`  | Every key release — misses mouse paste | Less reliable, avoid          |
| `(change)` | When the field loses focus             | Not useful for live filtering |

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

---

## FormArray — dynamic lists of controls

Official docs: https://angular.dev/guide/forms/reactive-forms#creating-dynamic-forms

`FormGroup` holds a fixed set of named controls. `FormArray` holds a **dynamic list** of controls — you add and remove them at runtime by index.

### When to use it

Use `FormArray` when the number of fields is not known upfront — for example:
- A form where the user adds multiple phone numbers
- A list of skills or tags the user can grow
- Any "add another" pattern

For forms with a fixed set of fields (employee name, hire date, department) `FormGroup` is always enough.

### Setup

```typescript
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

// define the form
form = new FormGroup({
  name: new FormControl('', Validators.required),
  phones: new FormArray([
    new FormControl('', Validators.required)  // start with one field
  ])
});

// getter — shortcut to avoid casting everywhere
get phones() {
  return this.form.get('phones') as FormArray;
}
```

### Add and remove controls

```typescript
addPhone() {
  this.phones.push(new FormControl('', Validators.required));
}

removePhone(index: number) {
  this.phones.removeAt(index);
}
```

### Template

```html
<form [formGroup]="form">
  <input formControlName="name" />

  <div formArrayName="phones">
    @for (control of phones.controls; track $index) {
      <div>
        <input [formControlName]="$index" />
        <button type="button" (click)="removePhone($index)">Remove</button>
      </div>
    }
  </div>

  <button type="button" (click)="addPhone()">Add phone</button>
  <button type="submit">Save</button>
</form>
```

Key points:
- `formArrayName="phones"` on the container div connects it to the `FormArray`
- Each control uses `[formControlName]="$index"` — the index is the key, not a name
- `phones.controls` is the array you loop over in `@for`
- Access the value in `onSubmit()` with `this.form.value.phones` — it is a plain array of values
