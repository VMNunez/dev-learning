package com.victor.timetrack.dto.response;

import java.math.BigDecimal;

public interface EmployeeHoursReportResponse {
    Long getUserId();
    String getEmployeeName();
    BigDecimal getTotalHours();
}
