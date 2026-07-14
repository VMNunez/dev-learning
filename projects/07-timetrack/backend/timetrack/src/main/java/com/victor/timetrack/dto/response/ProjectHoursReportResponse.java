package com.victor.timetrack.dto.response;

import java.math.BigDecimal;

public interface ProjectHoursReportResponse {
    String getProjectName();
    BigDecimal getTotalHours();
}
