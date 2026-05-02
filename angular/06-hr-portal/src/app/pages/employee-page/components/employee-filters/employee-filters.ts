import { Component, output, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-employee-filters',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './employee-filters.html',
  styleUrl: './employee-filters.css',
})
export class EmployeeFilters {
  departments = input<string[]>([]);
  searchChange = output<string>();
  departmentChange = output<string>();
  statusChange = output<'active' | 'inactive'>();
}
