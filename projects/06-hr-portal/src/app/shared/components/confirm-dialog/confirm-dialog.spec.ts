import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ConfirmDialog, ConfirmDialogData } from './confirm-dialog';

describe('ConfirmDialog', () => {
  let component: ConfirmDialog;
  let fixture: ComponentFixture<ConfirmDialog>;

  // `MatDialogRef` is created by `MatDialog.open()`, so mounting the component directly
  // leaves it unprovided. A `useValue` double stands in for it: the unit is tested
  // without opening a real dialog, and `close()` can be observed.
  const dialogRef = { close: (_result?: boolean) => {} };

  // The dialog's own `ConfirmDialogData` contract — every caller passes all four labels.
  const data: ConfirmDialogData = {
    title: 'Delete department',
    message: 'This cannot be undone.',
    cancelLabel: 'Cancel',
    confirmLabel: 'Delete',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
