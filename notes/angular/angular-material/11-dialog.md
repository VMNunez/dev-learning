# Angular Material — Dialog

Official docs: https://material.angular.io/components/dialog/overview

## How it works

A dialog is a modal window that appears on top of the page. Angular Material handles it through two things:

- **`MatDialog`** — a service you inject in the **parent** component. It opens the dialog.
- **`MatDialogRef`** — injected inside the **dialog** component. It closes the dialog and can return data.

The dialog content is a **separate Angular component** that you create yourself.

---

## Build the dialog component template

The imports below go in the **dialog component** (the child) — not in the parent that opens it.

```typescript
// dialog component imports
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatDialogModule, MatButtonModule],
  ...
})
```

If the dialog has a form (which is almost always the case), also add the reactive forms and Material form imports:

```typescript
// add these for a dialog with a form
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
```

Then use these directives to structure the template. Each one has a specific place:

| Directive              | Where it goes                               | Role                                                     |
| ---------------------- | ------------------------------------------- | -------------------------------------------------------- |
| `mat-dialog-title`     | Attribute on a `<h2>` at the top            | Shows the title                                          |
| `<mat-dialog-content>` | After the title, wraps the form or content  | The main scrollable body                                 |
| `<mat-dialog-actions>` | After `mat-dialog-content`, at the bottom   | Container for the action buttons                         |
| `mat-dialog-close`     | Attribute on a Cancel button                | Closes the dialog immediately with no result             |

> `mat-dialog-title`, `mat-dialog-content` and `mat-dialog-actions` must be **siblings** — never nest one inside another. Material applies different padding, scroll and sticky behaviour to each block, and nesting breaks all of it.

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

> Because the submit button is outside `<form>`, `type="submit"` does not work. Use `(click)="onSubmit()"` on the button instead, and remove `(ngSubmit)` from the form tag.

> The Cancel button uses `mat-dialog-close` — it closes the dialog immediately and returns nothing, with no TypeScript needed. If you need to check whether the user has unsaved changes before closing, replace `mat-dialog-close` with a custom `(click)="onCancel()"` method. See the dirty check pattern in the reactive forms notes.

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

// edit: pass the existing task as data so the dialog can pre-fill the form
onEditTask(task: Task): void {
  const dialogRef = this.dialog.open(TaskDialog, {
    width: '500px',
    data: { task }, // the dialog will read this with MAT_DIALOG_DATA
  });

  dialogRef.afterClosed().subscribe({
    next: (result) => {
      if (result) this.taskService.editTask(result);
    },
  });
}
```

**Dialog — read the data and pre-fill the form**

Inside the dialog, inject `MAT_DIALOG_DATA`. This is how the dialog reads the data passed by the parent. It is `null` when adding and contains the task when editing:

```typescript
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

// MAT_DIALOG_DATA is the token that holds whatever the parent passed in data: { task }
data = inject<{ task: Task } | null>(MAT_DIALOG_DATA);

constructor() {
  if (this.data) {
    this.myForm.patchValue(this.data.task); // pre-fill all fields with the existing task
  }
}
```

`patchValue()` fills each form control with the matching field from the task object. See the [reactive forms notes](../../06-reactive-forms.md) for more detail.

The `onSubmit()` and `dialogRef.close()` stay exactly the same — the parent decides what to do with the result.

---

## Confirmation dialog pattern

A confirmation dialog is a small reusable dialog with no form — just a message and two buttons. It is used before destructive actions like delete.

Because it is reusable, the parent passes the text as data — `title`, `message`, and `confirmLabel` — so the same component can say "Delete task", "Discard changes", or anything else.

**The dialog component** — reads the data from the parent and returns `true` on confirm:

```typescript
export class ConfirmDialog {
  private dialogRef = inject(MatDialogRef);
  // title, message and confirmLabel come from the parent — this makes the dialog reusable
  data = inject<{ title: string; message: string; confirmLabel: string }>(MAT_DIALOG_DATA);

  confirm() {
    this.dialogRef.close(true); // return true so the parent knows the user confirmed
  }
}
```

**The template** — Cancel first, then the confirm action (Material Design convention: the safe option is always on the left):

```html
<h2 mat-dialog-title>{{ data.title }}</h2>
<mat-dialog-content>
  <p>{{ data.message }}</p>
</mat-dialog-content>
<mat-dialog-actions align="end">
  <button matButton mat-dialog-close>Cancel</button>
  <button matButton="outlined" (click)="confirm()">{{ data.confirmLabel }}</button>
</mat-dialog-actions>
```

> Always put the destructive action last (on the right). The user reads left to right — Cancel is the safe option and should come first.

> Pass `confirmLabel` from the parent so the button says "Delete", "Discard", or whatever fits the context. This makes the component truly reusable.

**The parent** — open the confirm dialog with the right text, then act only if the user confirmed:

```typescript
// delete confirmation — opens ConfirmDialog and passes the text as data
openConfirmDialog(task: Task) {
  const dialogRef = this.dialog.open(ConfirmDialog, {
    width: '400px',
    autoFocus: false, // prevents focus ring appearing on the button when the dialog opens
    data: {
      title: 'Delete task',
      message: 'Are you sure you want to delete this task?',
      confirmLabel: 'Delete',
    },
  });

  dialogRef.afterClosed().subscribe({
    next: (confirmed) => {
      if (confirmed) this.deleteTask(task.id); // only delete if user clicked confirm
    },
  });
}

// discard changes confirmation (called from inside another dialog)
onCancel() {
  if (this.myForm.dirty) {
    // form has unsaved changes — ask before closing
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
        if (confirmed) this.dialogRef.close(); // close the outer dialog only if confirmed
      },
    });
  } else {
    this.dialogRef.close(); // nothing changed — close immediately
  }
}
```

> `autoFocus: false` — by default Angular Material focuses the first button when a dialog opens, which shows the browser focus ring on it. Disabling it looks cleaner for simple confirm dialogs.

> You can open a dialog from inside another dialog — just inject `MatDialog` in the dialog component.

---

## Controlling when errors appear — ErrorStateMatcher

Official docs: https://material.angular.io/components/input/overview#changing-when-error-messages-are-shown

By default, Angular Material shows a `mat-error` when a field is **invalid and touched**. A field becomes `touched` the moment it loses focus (blur). This means clicking outside the dialog or pressing Cancel can trigger errors — which looks strange.

`ErrorStateMatcher` is a class that decides when to show an error. It has one method: `isErrorState()`. Angular Material calls this method to check whether errors should be visible. If it returns `true`, the error is shown.

### Show errors only after the user tries to submit

The idea: create a custom matcher that holds a `submitted` flag. Errors only show when `submitted` is `true`. You set `submitted = true` in `onSubmit()`.

```typescript
import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';

class SubmitOnlyErrorStateMatcher implements ErrorStateMatcher {
  submitted = false; // starts as false — no errors shown yet

  isErrorState(
    control: AbstractControl | null,
    _form: FormGroupDirective | NgForm | null
  ): boolean {
    // show error only when the control is invalid AND the user has tried to submit
    return !!(control && control.invalid && this.submitted);
  }
}
```

Add it to the component and set `submitted = true` when the user clicks submit:

```typescript
errorMatcher = new SubmitOnlyErrorStateMatcher();

onSubmit() {
  this.errorMatcher.submitted = true; // now errors will appear
  if (this.myForm.valid) {
    this.dialogRef.close(this.myForm.value);
  }
}
```

Apply it to every `matInput` and `mat-select` in the template with `[errorStateMatcher]`:

```html
<input matInput formControlName="name" [errorStateMatcher]="errorMatcher" />

<mat-select formControlName="status" [errorStateMatcher]="errorMatcher"> ... </mat-select>
```

> `[errorStateMatcher]` is a property that Angular Material exposes on `matInput` and `mat-select` specifically for this purpose — it is part of their official API, not a hack.

Now errors only appear after the user clicks the submit button — not on blur, not on Cancel, not when clicking outside.
