import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LeaveRequestStatus } from '../../../../models/leave-request.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-leave-request-filters',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, TitleCasePipe],
  templateUrl: './leave-request-filters.html',
  styleUrl: './leave-request-filters.css',
})
export class LeaveRequestFilters {
  selectedStatus = input<LeaveRequestStatus | 'all'>('all');
  statusChange = output<LeaveRequestStatus | 'all'>();
  statusOptions = ['all', 'pending', 'approved', 'rejected'];
}
