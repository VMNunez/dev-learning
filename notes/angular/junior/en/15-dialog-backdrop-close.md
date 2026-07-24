# 15 — Protecting dialogs from accidental close

## The problem

Angular Material dialogs close automatically when the user:
- Clicks the backdrop (outside the dialog)
- Presses Escape

If the dialog has a form with data, the user can lose their work without any warning.

Your `onCancel()` method protects against the Cancel button, but backdrop click and Escape bypass it completely.

## The fix — two steps

### 1. `disableClose: true` when opening the dialog

```ts
const dialogRef = this.dialog.open(EmployeeDialog, {
  width: '500px',
  autoFocus: false,
  disableClose: true, // prevents backdrop click and Escape from closing automatically
});
```

This tells Material: do not close this dialog on backdrop click or Escape. Now the only way to close it is via `dialogRef.close()` in code.

### 2. `backdropClick()` in the dialog constructor

`MatDialogRef` exposes a `backdropClick()` observable that emits when the user clicks outside. Subscribe to it and route it through `onCancel()`:

```ts
constructor() {
  this.dialogRef.backdropClick().subscribe(() => this.onCancel());
}
```

Now backdrop click goes through the same dirty check as the Cancel button.

## Result — all three close paths are protected

| How the user tries to close | What happens |
|---|---|
| Cancel button | `onCancel()` → dirty check → confirm dialog if needed |
| Click outside | `backdropClick()` → `onCancel()` → same flow |
| Escape key | Blocked by `disableClose: true` |

## Where it is used in the HR portal

`EmployeeDialog` — `employee-page.ts` sets `disableClose: true`; `employee-dialog.ts` subscribes to `backdropClick()` in the constructor.

## When to use this pattern

Any dialog that contains a form with user input. If the dialog is read-only (confirmation, info), you do not need it — let Material close it normally.

## Official docs

- [MatDialog — disableClose](https://material.angular.io/components/dialog/api#MatDialogConfig)
- [MatDialogRef — backdropClick](https://material.angular.io/components/dialog/api#MatDialogRef)
