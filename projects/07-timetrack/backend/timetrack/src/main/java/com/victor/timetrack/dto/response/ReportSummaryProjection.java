package com.victor.timetrack.dto.response;

import java.math.BigDecimal;

public interface ReportSummaryProjection {
    BigDecimal getApprovedHours();
    BigDecimal getPendingHours();
    int getTotalEntries();
}
