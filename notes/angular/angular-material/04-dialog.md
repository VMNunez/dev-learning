# Angular Material — Dialog

Official docs: https://material.angular.io/components/dialog/overview

Add this to the component that opens the dialog:

```typescript
import { MatDialog } from '@angular/material/dialog';
```

## How it works

`MatDialog` is a service — you inject it and call `open()` to show a dialog. The dialog content is a separate component that you create yourself.

## Opening a dialog

```typescript
private dialog = inject(MatDialog);

openDialog(): void {
  const dialogRef= this.dialog.open(TaskDialogComponent, {
    width: '500px',
    data: { task: this.selectedTask }  // optional — pass data to the dialog
  });
}
```

`open()` returns a `MatDialogRef` — a reference to the opened dialog. You can use it to listen for when the dialog closes.

## Listening for the result

When the dialog closes, it can return a value. Use `afterClosed()` to handle it:

```typescript
const dialogRef = this.dialog.open(TaskDialogComponent, { width: '500px' });

dialogRef.afterClosed().subscribe((result) => {
  if (result) {
    this.taskService.addTask(result);
  }
});
```

`afterClosed()` returns an Observable that emits once when the dialog closes, with the value passed to `close()`.

## Passing data to the dialog

Pass data via the `data` option in `open()`:

```typescript
this.dialog.open(TaskDialogComponent, {
  data: { task: this.selectedTask },
});
```

Inside the dialog component, read it with `MAT_DIALOG_DATA`:

```typescript
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

data = inject<{ task: Task }>(MAT_DIALOG_DATA);
```

## Inside the dialog component

The dialog component is a normal Angular component. Use these directives to structure it:

| Directive              | Role                                                                 |
| ---------------------- | -------------------------------------------------------------------- |
| `mat-dialog-title`     | Applied to a heading — sets the dialog title                         |
| `<mat-dialog-content>` | The main scrollable body of the dialog                               |
| `<mat-dialog-actions>` | Container for buttons at the bottom                                  |
| `mat-dialog-close`     | Applied to a button — closes the dialog, optionally passing a result |

```html
<h2 mat-dialog-title>Add Task</h2>

<mat-dialog-content>
  <!-- form goes here -->
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button matButton mat-dialog-close>Cancel</button>
  <button matButton="filled" (click)="onSubmit()">Save</button>
</mat-dialog-actions>
```

## Closing the dialog from inside it

Inject `MatDialogRef` inside the dialog component and call `close()`:

```typescript
private dialogRef = inject(MatDialogRef);

onSubmit(): void {
  this.dialogRef.close(this.formValue); // pass result back to the opener
}

onCancel(): void {
  this.dialogRef.close(); // close with no result
}
```

The value passed to `close()` is what `afterClosed()` receives in the opener.
