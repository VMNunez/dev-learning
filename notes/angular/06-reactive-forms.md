# Angular — Reactive Forms

## What are reactive forms?

Reactive forms let you manage form state in TypeScript — not in the template. You have full control over validation, values and state.

## Import

```typescript
imports: [ReactiveFormsModule]
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

```typescript
get description() {
  return this.transactionForm.get('description');
}
```

```html
@if (description?.touched && description?.hasError('required')) {
  <p class="error-msg">Description is required</p>
}
```

## Validation state

| Property | What it means |
|----------|--------------|
| `control.valid` | All validators pass |
| `control.invalid` | At least one validator fails |
| `control.touched` | User clicked the field and left |
| `control.dirty` | User typed something |
| `control.hasError('required')` | The required validator failed |
| `control.hasError('min')` | The min validator failed |

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
