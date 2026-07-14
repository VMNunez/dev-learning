package com.victor.timetrack.dto.response;

import java.math.BigDecimal;

public interface EmployeeHoursReportResponse {
    String getEmployeeName();
    BigDecimal getTotalHours();
}
