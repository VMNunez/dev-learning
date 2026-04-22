import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { TaskStatus, TaskPriority } from '../../../../models/task.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
  ],
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.css',
})
export class TaskDialog {
  private taskService = inject(TaskService);
  members: string[] = this.taskService.members;

  newTaskForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    status: new FormControl<TaskStatus | ''>('', Validators.required),
    priority: new FormControl<TaskPriority | ''>('', Validators.required),
    assignee: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', Validators.required),
  });
}
