import { effect, Injectable, signal } from '@angular/core';
import type { Department } from '../../models/department.model';
import { readStoredArray } from '../../shared/utils/storage.util';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  departments = signal<Department[]>(readStoredArray<Department>('departments'));

  constructor() {
    effect(() => {
      localStorage.setItem('departments', JSON.stringify(this.departments()));
    });
  }

  nameExists(name: string, excludeId?: string) {
    return this.departments().some(
      (department) =>
        department.id !== excludeId &&
        department.name.toLowerCase().trim() === name.toLowerCase().trim(),
    );
  }

  addDepartment(department: Omit<Department, 'id'>) {
    const newDepartment: Department = {
      ...department,
      id: crypto.randomUUID(),
    };

    this.departments.update((departments) => [...departments, newDepartment]);
  }

  deleteDepartment(id: string) {
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

  getById(id: string) {
    return this.departments().find((department) => department.id === id);
  }
}
