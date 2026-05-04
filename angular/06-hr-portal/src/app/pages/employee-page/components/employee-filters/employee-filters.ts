import { Component, output, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import type { Employee } from '../../../../models/employee.model';

@Component({
  selector: 'app-employee-filters',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './employee-filters.html',
  styleUrl: './employee-filters.css',
})
export class EmployeeFilters {
  departments = input<string[]>([]);
  searchTerm = input<string>('');
  selectedDepartment = input<string>('');
  selectedStatus = input<string>('');
  hasActiveFilters = input<boolean>(false);
  totalEmployees = input<number>(0);
  totalFilteredEmployees = input<number>(0);
  searchChange = output<string>();
  departmentChange = output<string>();
  statusChange = output<string>();
  clearAll = output<void>();

  clearFilters() {
    this.clearAll.emit();
  }
}
