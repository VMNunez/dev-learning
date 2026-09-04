import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';

import { EmployeeDialog } from './employee-dialog';

describe('EmployeeDialog', () => {
  let component: EmployeeDialog;
  let fixture: ComponentFixture<EmployeeDialog>;

  // Stands in for the ref `MatDialog.open()` would have created. The double has to answer
  // every member the unit actually reaches: the constructor subscribes to `backdropClick()`,
  // so a bare `{ close }` throws before the component is built. `EMPTY` never emits, which
  // is the honest stand-in for a backdrop that is never clicked in this spec.
  const dialogRef = { close: (_result?: unknown) => {}, backdropClick: () => EMPTY };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        // `undefined` is not an omission: the token is typed `EmployeeDialogData | undefined`
        // and the create branch is exactly the one that opens with no `data`.
        { provide: MAT_DIALOG_DATA, useValue: undefined },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
