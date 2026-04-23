import { Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Task } from '../../../../models/task.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-table',
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './task-table.html',
  styleUrl: './task-table.css',
})
export class TaskTable {
  displayedColumns = ['name', 'status', 'priority', 'assignee', 'createdAt', 'actions'];

  tasks = input<Task[]>([]);

  taskId = output<number>();

  deleteTask(id: number) {
    this.taskId.emit(id);
  }
}
