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
  <form [formGroup]="myForm" (ngSubmit)="onSubmit()">
    <mat-form-field>
      <mat-label>Name</mat-label>
      <input matInput formControlName="name" />
    </mat-form-field>

    <mat-dialog-actions align="end">
      <button type="submit" matButton="filled">Save</button>
      <button type="button" matButton mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  </form>
</mat-dialog-content>
```

> `mat-dialog-actions` goes **inside** the form so that `type="submit"` works correctly. If the button is outside the `<form>` tags, `type="submit"` does nothing — you would need `(click)="onSubmit()"` as a workaround instead.

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
