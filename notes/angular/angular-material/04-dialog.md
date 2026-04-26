# Angular Material — Dialog

Official docs: https://material.angular.io/components/dialog/overview

## How it works

A dialog is a modal window that appears on top of the page. Angular Material handles it through two things:

- **`MatDialog`** — a service you inject in the parent. It opens the dialog.
- **`MatDialogRef`** — injected inside the dialog component. It closes the dialog and can return data.

The dialog content is a **separate Angular component** that you create yourself.

---

## Build the dialog component template

The dialog component is a normal Angular component. Start by adding the imports:

```typescript
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatDialogModule, MatButtonModule],
  ...
})
```

If the dialog has a form (which is almost always the case), also add:

```typescript
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
```

Then use these directives to structure the template:

| Directive | Role |
|-----------|------|
| `mat-dialog-title` | Attribute on a heading — shows the title |
| `<mat-dialog-content>` | The main body of the dialog (scrollable) |
| `<mat-dialog-actions>` | Container for the buttons at the bottom |
| `mat-dialog-close` | Attribute on a button — closes the dialog with no result |

```html
<h2 mat-dialog-title>Add Task</h2>

<mat-dialog-content>
  <form [formGroup]="myForm">
    <mat-form-field>
      <mat-label>Name</mat-label>
      <input matInput formControlName="name" />
    </mat-form-field>
  </form>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button matButton="filled" (click)="onSubmit()">Save</button>
  <button matButton mat-dialog-close>Cancel</button>
</mat-dialog-actions>
```

> `mat-dialog-title`, `mat-dialog-content` and `mat-dialog-actions` must be **siblings** — never nest one inside another. Material applies different padding, scroll and sticky behaviour to each block, and nesting breaks all of it.

> Because the submit button is outside `<form>`, `type="submit"` does not work. Use `(click)="onSubmit()"` on the button instead, and remove `(ngSubmit)` from the form tag.

> The Cancel button uses `mat-dialog-close` — no TypeScript needed. It just closes the dialog and returns nothing.

---

## Close the dialog and return data

Inside the dialog component, inject `MatDialogRef` and call `close()` with the data you want to send back:

```typescript
import { MatDialogRef } from '@angular/material/dialog';

private dialogRef = inject(MatDialogRef);

onSubmit(): void {
  if (this.form.valid) {
    this.dialogRef.close(this.form.value); // sends data back to the parent
  }
}
```

Whatever you pass to `close()` is what the parent receives in `afterClosed()`.

---

## Open the dialog from the parent

In the parent component, inject `MatDialog` and call `open()`:

```typescript
import { MatDialog } from '@angular/material/dialog';

private dialog = inject(MatDialog);

openDialog(): void {
  const dialogRef = this.dialog.open(TaskDialog, {
    width: '500px',
  });

  dialogRef.afterClosed().subscribe({
    next: (result) => {
      if (result) this.taskService.addTask(result);
    },
  });
}
```

`open()` takes the **dialog component class** as the first argument — this is how Angular knows which component to open. The second argument is the config object (width, data, etc.).

`open()` returns a `MatDialogRef`. Call `afterClosed()` on it to listen for when the dialog closes.

`afterClosed()` always emits when the dialog closes — even if the user clicks Cancel or clicks outside. In those cases it emits `undefined`. That is why you always check `if (result)` before using the value.

---

## Edit flow — one dialog for add and edit

The same dialog component can handle both adding and editing. The difference is whether you pass data when opening it.

**Parent — two methods, same dialog**

```typescript
// add: no data passed
openAddDialog(): void {
  const dialogRef = this.dialog.open(TaskDialog, { width: '500px' });

  dialogRef.afterClosed().subscribe({
    next: (result) => {
      if (result) this.taskService.addTask(result);
    },
  });
}

// edit: task passed as data
onEditTask(task: Task): void {
  const dialogRef = this.dialog.open(TaskDialog, {
    width: '500px',
    data: { task },
  });

  dialogRef.afterClosed().subscribe({
    next: (result) => {
      if (result) this.taskService.editTask(result);
    },
  });
}
```

**Dialog — read the data and pre-fill the form**

Inside the dialog, inject `MAT_DIALOG_DATA`. It is `null` when adding and contains the task when editing:

```typescript
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

data = inject<{ task: Task } | null>(MAT_DIALOG_DATA);

constructor() {
  if (this.data) {
    this.myForm.patchValue(this.data.task); // pre-fill all fields
  }
}
```

`patchValue()` fills each form control with the matching field from the task object. See the [reactive forms notes](../../06-reactive-forms.md) for more detail.

The `onSubmit()` and `dialogRef.close()` stay exactly the same — the parent decides what to do with the result.

---

## Confirmation dialog pattern

A confirmation dialog is a small dialog with no form — just a message and two buttons. It is used before destructive actions like delete.

**The dialog component** — inject `MAT_DIALOG_DATA` for the message and `MatDialogRef` to return `true` on confirm:

```typescript
export class ConfirmDialog {
  private dialogRef = inject(MatDialogRef);
  data = inject<{ title: string; message: string }>(MAT_DIALOG_DATA);

  confirm() {
    this.dialogRef.close(true);
  }
}
```

**The template** — Cancel first, destructive action last (Material Design convention):

```html
<h2 mat-dialog-title>{{ data.title }}</h2>
<mat-dialog-content>
  <p>{{ data.message }}</p>
</mat-dialog-content>
<mat-dialog-actions align="end">
  <button matButton mat-dialog-close>Cancel</button>
  <button matButton="outlined" class="btn-danger" (click)="confirm()">Delete</button>
</mat-dialog-actions>
```

> Always put the destructive action last (on the right). The user reads left to right — Cancel is the safe option and should come first.

**The parent** — open the confirm dialog, then act only if the user confirmed:

```typescript
openConfirmDialog(task: Task) {
  const dialogRef = this.dialog.open(ConfirmDialog, {
    width: '400px',
    data: { task },
    autoFocus: false,
  });

  dialogRef.afterClosed().subscribe({
    next: (confirmed) => {
      if (confirmed) this.deleteTask(task.id);
    },
  });
}
```

> `autoFocus: false` — by default Angular Material focuses the first button when a dialog opens, which shows the browser focus ring on it. Disabling it looks cleaner for simple confirm dialogs.

---

## Controlling when errors appear — ErrorStateMatcher

Official docs: https://material.angular.io/components/input/overview#changing-when-error-messages-are-shown

By default, Angular Material shows a `mat-error` when a field is **invalid and touched**. A field becomes `touched` the moment it loses focus (blur). This means clicking outside the dialog or pressing Cancel can trigger errors — which looks strange.

`ErrorStateMatcher` is a class that decides when to show an error. It has one method: `isErrorState()`. If it returns `true`, the error is shown.

### Show errors only after the user tries to submit

Define a custom matcher in the same file as the dialog component:

```typescript
import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';

class SubmitOnlyErrorStateMatcher implements ErrorStateMatcher {
  submitted = false;
  isErrorState(control: AbstractControl | null, _form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && this.submitted);
  }
}
```

Add it to the component and set `submitted = true` when the user clicks submit:

```typescript
errorMatcher = new SubmitOnlyErrorStateMatcher();

onSubmit() {
  this.errorMatcher.submitted = true;
  if (this.myForm.valid) {
    this.dialogRef.close(this.myForm.value);
  }
}
```

Apply it to every `matInput` and `mat-select` in the template with `[errorStateMatcher]`:

```html
<input matInput formControlName="name" [errorStateMatcher]="errorMatcher" />

<mat-select formControlName="status" [errorStateMatcher]="errorMatcher">
  ...
</mat-select>
```

> `[errorStateMatcher]` is a property that Angular Material exposes on `matInput` and `mat-select` specifically for this purpose — it is part of their official API, not a hack. You bind to it using the same standard property binding syntax you already know: `[property]="value"`. You are just passing an object instead of a string or a signal.

Now errors only appear after the user clicks the submit button — not on blur, not on Cancel, not when clicking outside.
