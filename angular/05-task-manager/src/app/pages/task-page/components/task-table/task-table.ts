import { Component, effect, inject, input, output, ViewChild, AfterViewInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Task } from '../../../../models/task.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { DatePipe } from '@angular/common';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-task-table',
  imports: [MatTableModule, MatButtonModule, NgClass, DatePipe, MatSortModule],
  templateUrl: './task-table.html',
  styleUrl: './task-table.css',
})
export class TaskTable implements AfterViewInit {
  private dialog = inject(MatDialog);
  private _liveAnnouncer = inject(LiveAnnouncer);

  dataSource = new MatTableDataSource<Task>([]);
  displayedColumns = ['name', 'status', 'priority', 'assignee', 'createdAt', 'actions'];
  tasks = input<Task[]>([]);
  taskId = output<number>();
  taskToEdit = output<Task>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    effect(() => {
      this.dataSource.data = this.tasks();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

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
      data: {
        title: task.name,
        message: 'Are you sure you want to delete this task?',
        cancelLabel: 'Cancel',
        confirmLabel: 'Delete',
        danger: true,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (confirmDelete) => {
        if (confirmDelete) {
          this.deleteTask(task.id);
        }
      },
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
