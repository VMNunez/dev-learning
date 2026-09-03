export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  employeeEmail: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveRequestStatus;
}
