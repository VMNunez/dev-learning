import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  LEAVE_REQUEST_FILTERS,
  type LeaveRequestFilter,
} from '../../../../models/leave-request.model';
import { TitleCasePipe } from '@angular/common';
import { Role } from '../../../../models/user.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-leave-request-filters',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, TitleCasePipe, MatButtonModule],
  templateUrl: './leave-request-filters.html',
  styleUrl: './leave-request-filters.css',
})
export class LeaveRequestFilters {
  role = input<Role | undefined>(undefined);
  selectedStatus = input<LeaveRequestFilter>('all');
  searchTerm = input<string>('');
  hasActiveFilters = input<boolean>(false);
  totalFilteredLeaveRequests = input<number>(0);
  totalLeaveRequests = input<number>(0);
  statusChange = output<LeaveRequestFilter>();
  searchChange = output<string>();
  clearAll = output<void>();
  statusOptions = LEAVE_REQUEST_FILTERS;

  clearFilters() {
    this.clearAll.emit();
  }
}
