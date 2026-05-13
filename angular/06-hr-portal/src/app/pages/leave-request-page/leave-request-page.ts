import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { LeaveRequestService } from '../../core/services/leave-request.service';
import { AuthService } from '../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LeaveRequestDialog } from './components/leave-request-dialog/leave-request-dialog';
import { LeaveRequestTable } from './components/leave-request-table/leave-request-table';
import type { LeaveRequestStatus } from '../../models/leave-request.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeaveRequestFilters } from './components/leave-request-filters/leave-request-filters';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leave-request-page',
  imports: [MatButtonModule, LeaveRequestTable, LeaveRequestFilters],
  templateUrl: './leave-request-page.html',
  styleUrl: './leave-request-page.css',
})
export class LeaveRequestPage implements OnInit {
  private route = inject(ActivatedRoute);
  private leaveRequestService = inject(LeaveRequestService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  selectedStatus = signal<LeaveRequestStatus | 'all'>('all');
  searchTerm = signal<string>('');
  currentUser = this.authService.currentUser;
  leaveRequests = this.leaveRequestService.leaveRequests;
  role = this.authService.getUserRole();

  hasActiveFilters = computed(() => this.selectedStatus() !== 'all' || this.searchTerm() !== '');

  filteredLeaveRequests = computed(() => {
    const byStatus =
      this.selectedStatus() === 'all'
        ? this.leaveRequests()
        : this.leaveRequests().filter((r) => r.status === this.selectedStatus());

    const byEmail =
      this.searchTerm() === ''
        ? byStatus
        : byStatus.filter((r) =>
            r.employeeEmail.toLowerCase().trim().includes(this.searchTerm().toLowerCase().trim()),
          );

    return this.role === 'admin'
      ? byEmail
      : byEmail.filter((r) => r.employeeEmail === this.currentUser()?.email);
  });

  totalFilteredLeaveRequests = computed(() => this.filteredLeaveRequests().length);

  totalLeaveRequests = computed(() => this.leaveRequests().length);

  clearFilters() {
    this.selectedStatus.set('all');
    this.searchTerm.set('');
  }

  ngOnInit(): void {
    const initialStatus = this.route.snapshot.queryParamMap.get('status');

    if (initialStatus) {
      this.selectedStatus.set(initialStatus as LeaveRequestStatus | 'all');
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(LeaveRequestDialog, {
      width: '500px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          this.leaveRequestService.addLeaveRequest({
            employeeEmail: this.currentUser()!.email,
            startDate: data.startDate,
            endDate: data.endDate,
            reason: data.reason,
          });
          this.snackBar.open('Leave request added', 'Close', { duration: 3000 });
        }
      },
    });
  }

  onStatusChange(id: number, status: LeaveRequestStatus) {
    this.leaveRequestService.updateStatus(id, status);
    this.snackBar.open(`Leave request ${status}`, 'Close', { duration: 3000 });
  }

  onStatusFilterChange(status: LeaveRequestStatus | 'all') {
    this.selectedStatus.set(status);
  }

  onSearchChange(term: string) {
    this.searchTerm.set(term);
  }
}
