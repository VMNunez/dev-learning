export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: number;
  employeeEmail: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveRequestStatus;
}
