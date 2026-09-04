import { effect, Injectable, signal } from '@angular/core';
import type { Employee } from '../../models/employee.model';
import { readStoredArray } from '../../shared/utils/storage.util';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employees = signal<Employee[]>(readStoredArray<Employee>('employees'));

  constructor() {
    effect(() => {
      localStorage.setItem('employees', JSON.stringify(this.employees()));
    });
  }

  addEmployee(employee: Omit<Employee, 'id'>) {
    const newEmployee = {
      ...employee,
      id: crypto.randomUUID(),
    };

    this.employees.update((employees) => [...employees, newEmployee]);
  }

  deleteEmployee(employeeId: string) {
    this.employees.update((employees) =>
      employees.filter((employee) => employee.id !== employeeId),
    );
  }

  editEmployee(updatedEmployee: Employee) {
    this.employees.update((employees) =>
      employees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee,
      ),
    );
  }

  emailExists(email: string, excludeId?: string) {
    return this.employees().some(
      (employee) =>
        employee.id !== excludeId &&
        employee.email.toLowerCase().trim() === email.toLowerCase().trim(),
    );
  }
}
