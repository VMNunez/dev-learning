package com.victor.timetrack.repository;

import java.math.BigDecimal;

public interface ReportSummaryProjection {
    BigDecimal getApprovedHours();
    BigDecimal getPendingHours();
    int getTotalEntries();
}
