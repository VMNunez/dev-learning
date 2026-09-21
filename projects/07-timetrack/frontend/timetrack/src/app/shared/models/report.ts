export interface ReportSummary {
  totalEntries: number;
  approvedHours: number;
  pendingHours: number;
}

// Mirrors `ProjectHoursReportResponse`: APPROVED hours only (§8), and a deactivated project stays in the
// report with its hours, flagged by `active`, because the hours were genuinely worked.
export interface ProjectHours {
  projectId: number;
  projectName: string;
  totalHours: number;
  active: boolean;
}

// Mirrors `UserHoursReportResponse`, on the same terms: a deactivated account keeps its row.
export interface UserHours {
  userId: number;
  userName: string;
  totalHours: number;
  active: boolean;
}
