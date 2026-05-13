import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LeaveRequestStatus } from '../../../../models/leave-request.model';
import { TitleCasePipe } from '@angular/common';
import { Role } from '../../../../models/user.model';

@Component({
  selector: 'app-leave-request-filters',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, TitleCasePipe],
  templateUrl: './leave-request-filters.html',
  styleUrl: './leave-request-filters.css',
})
export class LeaveRequestFilters {
  selectedStatus = input<LeaveRequestStatus | 'all'>('all');
  role = input<Role | undefined>(undefined);
  statusChange = output<LeaveRequestStatus | 'all'>();
  searchChange = output<string>();
  statusOptions = ['all', 'pending', 'approved', 'rejected'];
}
