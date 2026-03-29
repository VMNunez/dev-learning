import { Injectable } from '@angular/core';
import type { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasks: Task[] = [
    { id: 1, title: 'Learn Angular', completed: false },
    { id: 2, title: 'Build a to-do app', completed: false },
    { id: 3, title: 'Get a job in Spain', completed: false },
  ];
}
