# Angular Material — Snackbar

Official docs: https://material.angular.io/components/snack-bar/overview

## What is it?

`MatSnackBar` is a service that shows a small notification at the bottom of the screen. It appears for a few seconds and then disappears automatically.

**Use it when:** the user completed an action and needs confirmation that it worked.

**Use `MatDialog` instead when:** you need the user to read something carefully or make a decision.

| | `MatSnackBar` | `MatDialog` |
|---|---|---|
| Blocks the user | No | Yes |
| Requires interaction | No | Yes |
| Closes automatically | Yes | No |
| Use for | Feedback after an action | Forms, confirmations |

---

## Setup

`MatSnackBar` is a **service** — you do not add anything to the `imports` array. Just import the type and inject it.

```typescript
import { MatSnackBar } from '@angular/material/snack-bar';

private snackBar = inject(MatSnackBar);
```

---

## Basic usage

```typescript
this.snackBar.open('Employee added', 'Close', { duration: 3000 });
```

| Parameter | What it is |
|---|---|
| `'Employee added'` | The message shown to the user |
| `'Close'` | The label of the action button (dismisses the snackbar) |
| `{ duration: 3000 }` | Auto-close after 3000ms (3 seconds) |

If you omit `duration`, the snackbar stays open until the user clicks the action button.

---

## Typical use cases

```typescript
// after adding a record
this.snackBar.open('Employee added', 'Close', { duration: 3000 });

// after editing a record
this.snackBar.open('Employee updated', 'Close', { duration: 3000 });

// after deleting a record
this.snackBar.open('Employee deleted', 'Close', { duration: 3000 });

// after a form submit
this.snackBar.open('Leave request submitted', 'Close', { duration: 3000 });

// after an approval action
this.snackBar.open('Leave request approved', 'Close', { duration: 3000 });
```

---

## Where to call it — the coordinator pattern

Always call `snackBar.open()` from the **page component** (the coordinator), never from inside a dialog or a service.

The dialog closes and returns data to the page. The page is the one that knows the action completed — that is the right moment to show the toast.

```typescript
// ✓ correct — called in the page after the dialog closes
openDialog() {
  const dialogRef = this.dialog.open(EmployeeDialog, { width: '500px' });

  dialogRef.afterClosed().subscribe({
    next: (newEmployee) => {
      if (newEmployee) {
        this.employeeService.addEmployee(newEmployee);
        this.snackBar.open('Employee added', 'Close', { duration: 3000 }); // here
      }
    },
  });
}
```

```typescript
// ✗ wrong — called inside the dialog
onSubmit() {
  this.snackBar.open('Employee added', ...); // the dialog does not know if the save succeeded
  this.dialogRef.close(formValue);
}
```

---

## Only one snackbar at a time

Angular Material only shows one snackbar at a time. If a new one opens while another is visible, the old one is dismissed automatically. You do not need to manage this yourself.
