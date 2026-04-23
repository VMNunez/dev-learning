import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { TaskStatus, TaskPriority, Task } from '../../../../models/task.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { TaskService } from '../../services/task.service';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-task-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatAnchor,
  ],
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.css',
})
export class TaskDialog {
  private taskService = inject(TaskService);
  private dialogRef = inject(MatDialogRef);

  members: string[] = this.taskService.members;

  newTaskForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    status: new FormControl<TaskStatus | ''>('', Validators.required),
    priority: new FormControl<TaskPriority | ''>('', Validators.required),
    assignee: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', Validators.required),
  });

  onSubmit() {
    if (this.newTaskForm.valid) {
      const formValue = this.newTaskForm.value;
      const task: Task = {
        id: Date.now(),
        name: formValue.name as string,
        status: formValue.status as TaskStatus,
        priority: formValue.priority as TaskPriority,
        description: formValue.description as string,
        assignee: formValue.assignee as string,
        createdAt: new Date().toISOString().split('T')[0],
      };

      this.dialogRef.close(task);
    }
  }
}
