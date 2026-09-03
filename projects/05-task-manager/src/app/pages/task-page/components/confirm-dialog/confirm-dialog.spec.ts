import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ConfirmDialog } from './confirm-dialog';
import type { ConfirmDialogData } from '../../../../models/task.model';

const data: ConfirmDialogData = {
  title: 'Delete task',
  message: 'This action cannot be undone.',
  cancelLabel: 'Cancel',
  confirmLabel: 'Delete',
  danger: true,
};

describe('ConfirmDialog', () => {
  let component: ConfirmDialog;
  let fixture: ComponentFixture<ConfirmDialog>;
  const dialogRef = { close: vi.fn() };

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

  it('should render the labels it was opened with', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Delete task');
    expect(compiled.textContent).toContain('This action cannot be undone.');
  });

  it('should close with true when confirmed', () => {
    component.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
