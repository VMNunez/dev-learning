import { Component, output, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
  searchChange = output<string>();
  departmentChange = output<string>();
  statusChange = output<string>();
  clearAll = output<void>();

  clearFilters() {
    this.clearAll.emit();
  }
}
