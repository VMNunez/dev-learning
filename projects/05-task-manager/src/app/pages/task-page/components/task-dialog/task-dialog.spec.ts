import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TaskDialog } from './task-dialog';

describe('TaskDialog', () => {
  let component: TaskDialog;
  let fixture: ComponentFixture<TaskDialog>;
  const dialogRef = { close: vi.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not close while the form is invalid', () => {
    component.onSubmit();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close with the new task once the form is valid', () => {
    component.newTaskForm.setValue({
      name: 'Write the specs',
      status: 'pending',
      priority: 'high',
      assignee: 'Ana',
      description: '',
    });

    component.onSubmit();

    expect(dialogRef.close).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Write the specs', status: 'pending', priority: 'high' }),
    );
  });
});
