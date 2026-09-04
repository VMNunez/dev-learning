export const LEAVE_REQUEST_STATUSES = ['pending', 'approved', 'rejected'] as const;

export type LeaveRequestStatus = (typeof LEAVE_REQUEST_STATUSES)[number];

export const LEAVE_REQUEST_FILTERS = ['all', ...LEAVE_REQUEST_STATUSES] as const;

export type LeaveRequestFilter = (typeof LEAVE_REQUEST_FILTERS)[number];

export function isLeaveRequestFilter(value: string | null): value is LeaveRequestFilter {
  return LEAVE_REQUEST_FILTERS.includes(value as LeaveRequestFilter);
}

export interface LeaveRequest {
  id: string;
  employeeEmail: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveRequestStatus;
}
