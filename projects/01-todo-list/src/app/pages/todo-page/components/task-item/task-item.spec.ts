import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItem } from './task-item';
import type { Task } from '../../models/task.model';

describe('TaskItem', () => {
  let component: TaskItem;
  let fixture: ComponentFixture<TaskItem>;

  const task: Task = { id: 1, title: 'Test task', completed: false };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItem],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', task);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
