import { CanDeactivateFn } from '@angular/router';
import { DepartmentForm } from '../../pages/department-page/department-form/department-form';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { map } from 'rxjs';

export const deactivateGuard: CanDeactivateFn<DepartmentForm> = (
  component,
  _currentRoute,
  _currentState,
  _nextState,
) => {
  const dialog = inject(MatDialog);
  if (component.departmentForm.dirty) {
    const dialogRef = dialog.open(ConfirmDialog, {
      width: '500px',
      autoFocus: false,
      data: {
        title: 'Unsaved changes',
        message: 'You have unsaved changes. Are you sure you want to leave?',
        cancelLabel: 'Stay',
        confirmLabel: 'Leave',
      },
    });

    return dialogRef.afterClosed().pipe(map((result) => !!result));
  } else {
    return true;
  }
};
