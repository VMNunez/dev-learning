package com.victor.timetrack.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ReportSummaryResponse {
    private BigDecimal totalHours;
    private int totalEntries;
    private BigDecimal approvedHours;
    private BigDecimal pendingHours;
}
