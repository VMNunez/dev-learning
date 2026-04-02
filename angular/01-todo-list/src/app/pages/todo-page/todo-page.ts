import { Component } from '@angular/core';
import { TaskList } from './components/task-list/task-list';
import { TaskForm } from './components/task-form/task-form';

@Component({
  selector: 'app-todo-page',
  imports: [TaskList, TaskForm],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.css',
})
export class TodoPage {}
