import { effect, Injectable, signal } from '@angular/core';
import type { LeaveRequest, LeaveRequestStatus } from '../../models/leave-request.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestService {
  leaveRequests = signal<LeaveRequest[]>(JSON.parse(localStorage.getItem('leaveRequests') ?? '[]'));

  constructor() {
    effect(() => {
      localStorage.setItem('leaveRequests', JSON.stringify(this.leaveRequests()));
    });
  }

  addLeaveRequest(newLeaveRequest: Omit<LeaveRequest, 'id' | 'status'>) {
    this.leaveRequests.update((leaveRequests) => [
      ...leaveRequests,
      {
        id: Date.now(),
        status: 'pending',
        ...newLeaveRequest,
      },
    ]);
  }

  updateStatus(id: number, newStatus: LeaveRequestStatus) {
    this.leaveRequests.update((leaveRequests) => {
      return leaveRequests.map((leaveRequest) => {
        if (leaveRequest.id === id) {
          return {
            ...leaveRequest,
            status: newStatus,
          };
        } else {
          return leaveRequest;
        }
      });
    });
  }
}
