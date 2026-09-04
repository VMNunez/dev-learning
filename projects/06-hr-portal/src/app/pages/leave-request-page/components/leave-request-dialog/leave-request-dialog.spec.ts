import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';

import { LeaveRequestDialog } from './leave-request-dialog';

describe('LeaveRequestDialog', () => {
  let component: LeaveRequestDialog;
  let fixture: ComponentFixture<LeaveRequestDialog>;

  // Stands in for the ref `MatDialog.open()` would have created. This dialog is always
  // opened without `data`, so it injects no `MAT_DIALOG_DATA` and the spec provides none.
  const dialogRef = { close: (_result?: unknown) => {} };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        // The template renders two `matDatepicker` inputs, which resolve a `DateAdapter`.
        // The app supplies it globally in `app.config.ts`; the TestBed must supply its own.
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveRequestDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
