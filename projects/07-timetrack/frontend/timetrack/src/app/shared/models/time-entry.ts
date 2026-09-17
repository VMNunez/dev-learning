export const ENTRY_STATUSES = ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'] as const;

export type EntryStatus = (typeof ENTRY_STATUSES)[number];

export interface TimeEntry {
  id: number;
  userId: number;
  userName: string;
  projectId: number;
  projectName: string;
  date: string;
  hours: number;
  description: string;
  status: EntryStatus;
  rejectionNote: string | null;
}
