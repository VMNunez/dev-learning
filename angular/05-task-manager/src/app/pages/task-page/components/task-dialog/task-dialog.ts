import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type { TaskStatus, TaskPriority, Task } from '../../../../models/task.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { TaskService } from '../../services/task.service';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

class SubmitOnlyErrorStateMatcher implements ErrorStateMatcher {
  submitted = false;
  isErrorState(
    control: AbstractControl | null,
    _form: FormGroupDirective | NgForm | null,
  ): boolean {
    return !!(control && control.invalid && this.submitted);
  }
}

@Component({
  selector: 'app-task-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.css',
})
export class TaskDialog {
  private taskService = inject(TaskService);
  private dialogRef = inject(MatDialogRef);
  private dialog = inject(MatDialog);
  data = inject<{ task: Task } | undefined>(MAT_DIALOG_DATA);
  members: string[] = this.taskService.members;
  errorMatcher = new SubmitOnlyErrorStateMatcher();

  newTaskForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    status: new FormControl<TaskStatus | ''>('', Validators.required),
    priority: new FormControl<TaskPriority | ''>('', Validators.required),
    assignee: new FormControl<string>('', Validators.required),
    description: new FormControl<string>(''),
  });

  constructor() {
    if (this.data) {
      this.newTaskForm.patchValue({
        name: this.data.task.name,
        status: this.data.task.status,
        priority: this.data.task.priority,
        description: this.data.task.description,
        assignee: this.data.task.assignee,
      });
    }
  }

  onSubmit() {
    this.errorMatcher.submitted = true;
    if (this.newTaskForm.valid) {
      const formValue = this.newTaskForm.value;
      const task: Task = {
        id: this.data ? this.data.task.id : Date.now(),
        name: formValue.name as string,
        status: formValue.status as TaskStatus,
        priority: formValue.priority as TaskPriority,
        description: formValue.description as string,
        assignee: formValue.assignee as string,
        createdAt: this.data ? this.data.task.createdAt : new Date().toISOString().split('T')[0],
      };

      this.dialogRef.close(task);
    }
  }

  onCancel() {
    if (this.newTaskForm.dirty) {
      const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '500px',
        autoFocus: false,
        data: {
          title: 'Discard changes',
          message: 'You have unsaved changes. Are you sure you want to cancel?',
          cancelLabel: 'Keep Editing',
          confirmLabel: 'Discard Changes',
          danger: false,
        },
      });

      dialogRef.afterClosed().subscribe({
        next: (confirmed) => {
          if (confirmed) {
            this.dialogRef.close();
          }
        },
      });
    } else {
      this.dialogRef.close();
    }
  }
}
