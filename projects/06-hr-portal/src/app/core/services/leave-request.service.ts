import { effect, Injectable, signal } from '@angular/core';
import type { LeaveRequest, LeaveRequestStatus } from '../../models/leave-request.model';
import { readStoredArray } from '../../shared/utils/storage.util';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestService {
  leaveRequests = signal<LeaveRequest[]>(readStoredArray<LeaveRequest>('leaveRequests'));

  constructor() {
    effect(() => {
      localStorage.setItem('leaveRequests', JSON.stringify(this.leaveRequests()));
    });
  }

  addLeaveRequest(newLeaveRequest: Omit<LeaveRequest, 'id' | 'status'>) {
    this.leaveRequests.update((leaveRequests) => [
      ...leaveRequests,
      {
        id: crypto.randomUUID(),
        status: 'pending',
        ...newLeaveRequest,
      },
    ]);
  }

  /**
   * Applies an admin decision to a leave request.
   *
   * `pending` is the only state with outgoing transitions: `approved` and `rejected` are terminal,
   * so a decided request can never be re-decided or re-opened. The rule lives here, where the state
   * actually changes, rather than only in the template that hides the buttons.
   *
   * @returns `true` when the transition was applied, `false` when it was refused.
   */
  updateStatus(id: string, newStatus: LeaveRequestStatus): boolean {
    const leaveRequest = this.leaveRequests().find((request) => request.id === id);

    if (!leaveRequest || leaveRequest.status !== 'pending' || newStatus === 'pending') {
      return false;
    }

    this.leaveRequests.update((leaveRequests) =>
      leaveRequests.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request,
      ),
    );

    return true;
  }
}
