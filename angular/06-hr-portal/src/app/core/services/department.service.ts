import { effect, Injectable, signal } from '@angular/core';
import type { Department } from '../../models/department.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  departments = signal<Department[]>(JSON.parse(localStorage.getItem('departments') || '[]'));

  constructor() {
    effect(() => {
      localStorage.setItem('departments', JSON.stringify(this.departments()));
    });
  }

  nameExists(name: string, excludeId?: number) {
    return this.departments().some(
      (department) =>
        department.id !== excludeId &&
        department.name.toLowerCase().trim() === name.toLowerCase().trim(),
    );
  }

  addDepartment(department: Department) {
    this.departments.update((departments) => [...departments, department]);
  }

  deleteDepartment(id: number) {
    this.departments.update((departments) =>
      departments.filter((department) => department.id !== id),
    );
  }

  editDepartment(updatedDepartment: Department) {
    this.departments.update((departments) =>
      departments.map((department) => {
        return department.id === updatedDepartment.id ? updatedDepartment : department;
      }),
    );
  }

  getById(id: number) {
    return this.departments().find((department) => department.id === id);
  }
}
