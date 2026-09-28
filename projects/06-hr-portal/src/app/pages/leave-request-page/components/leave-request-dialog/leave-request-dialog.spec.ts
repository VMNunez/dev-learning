import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { LeaveRequestDialog } from './leave-request-dialog';

describe('LeaveRequestDialog', () => {
  let component: LeaveRequestDialog;
  let fixture: ComponentFixture<LeaveRequestDialog>;

  // Stands in for the ref `MatDialog.open()` would have created. This dialog is always
  // opened without `data`, so it injects no `MAT_DIALOG_DATA` and the spec provides none.
  // No `DateAdapter` is provided either: the component declares its own in `providers`,
  // so it travels with the component into the TestBed.
  const dialogRef = { close: (_result?: unknown) => {} };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestDialog],
      providers: [{ provide: MatDialogRef, useValue: dialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveRequestDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
