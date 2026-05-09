import { Component, inject, computed } from '@angular/core';
import { LeaveRequestService } from '../../core/services/leave-request.service';
import { AuthService } from '../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LeaveRequestDialog } from './components/leave-request-dialog/leave-request-dialog';
import { LeaveRequestTable } from './components/leave-request-table/leave-request-table';
import { LeaveRequestStatus } from '../../models/leave-request.model';

@Component({
  selector: 'app-leave-request-page',
  imports: [MatButtonModule, LeaveRequestTable],
  templateUrl: './leave-request-page.html',
  styleUrl: './leave-request-page.css',
})
export class LeaveRequestPage {
  private leaveRequestService = inject(LeaveRequestService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  currentUser = this.authService.currentUser;
  leaveRequests = this.leaveRequestService.leaveRequests;
  role = this.authService.getUserRole();

  filteredLeaveRequests = computed(() => {
    return this.leaveRequests().filter(
      (liveRequest) => liveRequest.employeeEmail === this.currentUser()?.email,
    );
  });

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
        }
      },
    });
  }

  onStatusChange(id: number, status: LeaveRequestStatus) {
    this.leaveRequestService.updateStatus(id, status);
  }
}
