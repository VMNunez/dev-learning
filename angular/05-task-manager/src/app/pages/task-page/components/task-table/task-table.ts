import { Component, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Task } from '../../../../models/task.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-table',
  imports: [MatTableModule, MatButtonModule, NgClass, DatePipe],
  templateUrl: './task-table.html',
  styleUrl: './task-table.css',
})
export class TaskTable {
  private dialog = inject(MatDialog);
  displayedColumns = ['name', 'status', 'priority', 'assignee', 'createdAt', 'actions'];

  tasks = input<Task[]>([]);

  taskId = output<number>();
  taskToEdit = output<Task>();

  deleteTask(id: number) {
    this.taskId.emit(id);
  }

  editTask(task: Task) {
    this.taskToEdit.emit(task);
  }

  openConfirmDialog(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      autoFocus: false,
      data: { task },
    });

    dialogRef.afterClosed().subscribe({
      next: (confirmDelete) => {
        if (confirmDelete) {
          this.deleteTask(task.id);
        }
      },
    });
  }
}
