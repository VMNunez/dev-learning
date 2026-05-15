# Angular Material — Stepper

Official docs: https://material.angular.io/components/stepper/overview

## What is it?

`MatStepper` breaks a long form into steps. Each step has its own form group and validation — the user cannot move to the next step until the current one is valid.

Use it when a form has many fields and it makes sense to split them into logical groups.

---

## Setup

Add `MatStepperModule` to the component's `imports` array:

```typescript
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  imports: [MatStepperModule, ...]
})
```

---

## Basic structure

```html
<mat-stepper [linear]="true" #stepper>
  <mat-step [stepControl]="firstFormGroup">
    <form [formGroup]="firstFormGroup">
      <!-- fields for step 1 -->
    </form>
  </mat-step>

  <mat-step [stepControl]="secondFormGroup">
    <form [formGroup]="secondFormGroup">
      <!-- fields for step 2 -->
    </form>
  </mat-step>
</mat-stepper>
```

- `[linear]="true"` — the user must complete each step before moving to the next one
- `[stepControl]="formGroup"` — links the step to a form group; Material uses it to know if the step is valid
- `#stepper` — template reference variable; gives you access to the stepper from anywhere in the template

Each step has its own `<form>` with its own `[formGroup]`.

---

## Two form groups in TypeScript

With `FormBuilder`:

```typescript
private formBuilder = inject(FormBuilder);

firstFormGroup = this.formBuilder.group({
  firstName: ['', Validators.required],
  lastName: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
});

secondFormGroup = this.formBuilder.group({
  department: ['', Validators.required],
  position: ['', Validators.required],
});
```

`FormBuilder.group()` shorthand: `['defaultValue', validators]` — equivalent to `new FormControl('', validators)`.

---

## Navigation buttons

### Option 1 — directives inside the step (simple)

```html
<mat-step [stepControl]="firstFormGroup">
  <form [formGroup]="firstFormGroup">...</form>
  <button matButton matStepperNext>Next</button>
</mat-step>
```

`matStepperNext` and `matStepperPrevious` are directives. When inside a step, they check `[stepControl]` automatically before moving — no TypeScript needed.

### Option 2 — buttons outside the stepper (coordinator pattern)

When navigation buttons are in `mat-dialog-actions` (outside `<mat-stepper>`), the directives cannot find the stepper automatically. Use a method instead:

```typescript
import { MatStepper } from '@angular/material/stepper';

onNext(stepper: MatStepper) {
  this.firstFormGroup.markAllAsTouched();
  if (this.firstFormGroup.valid) {
    stepper.next(); // only move if valid
  }
}
```

Pass the `#stepper` reference from the template:

```html
<button matButton="filled" (click)="onNext(stepper)">Next</button>
<button matButton (click)="stepper.previous()">Back</button>
```

`stepper.next()` and `stepper.previous()` are methods on the `MatStepper` instance. Use them when you need custom logic before navigating (e.g. duplicate checks).

> **Important:** `stepper.next()` does NOT check `[stepControl]` — it moves unconditionally. Always validate manually before calling it.

---

## Showing different buttons per step

Use `stepper.selectedIndex` to know which step is active — `0` for the first, `1` for the second, and so on:

```html
<mat-dialog-actions align="end">
  <button matButton (click)="onCancel()">Cancel</button>
  @if (stepper.selectedIndex === 0) {
    <button matButton="filled" (click)="onNext(stepper)">Next</button>
  } @else {
    <button matButton (click)="stepper.previous()">Back</button>
    <button matButton="filled" (click)="onSubmit()">Submit</button>
  }
</mat-dialog-actions>
```

`stepper.selectedIndex` is available in the template because `#stepper` is a template reference variable — accessible anywhere in the same template, even outside `<mat-stepper>`.

---

## Pre-filling data in edit mode

When opening the dialog with existing data, patch both form groups in the constructor:

```typescript
constructor() {
  if (this.data) {
    const { firstName, email, department, position } = this.data.employee;
    this.firstFormGroup.patchValue({ firstName, email });
    this.secondFormGroup.patchValue({ department, position });
  }
}
```

---

## Reading values from both form groups on submit

```typescript
onSubmit() {
  this.firstFormGroup.markAllAsTouched();
  this.secondFormGroup.markAllAsTouched();

  if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
    const first = this.firstFormGroup.value;
    const second = this.secondFormGroup.value;

    // combine values from both groups
    const employee = {
      firstName: first.firstName as string,
      department: second.department as string,
      // ...
    };
  }
}
```
