import { Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Task } from '../../../../models/task.model';

@Component({
  selector: 'app-task-table',
  imports: [MatTableModule],
  templateUrl: './task-table.html',
  styleUrl: './task-table.css',
})
export class TaskTable {
  displayedColumns = ['name', 'status', 'priority', 'assignee', 'createdAt', 'actions'];

  tasks = input<Task[]>([]);
}
