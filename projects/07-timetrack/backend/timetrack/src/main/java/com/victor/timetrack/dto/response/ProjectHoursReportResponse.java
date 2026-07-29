package com.victor.timetrack.dto.response;

import java.math.BigDecimal;

public interface ProjectHoursReportResponse {
    Long getProjectId();
    String getProjectName();
    BigDecimal getTotalHours();
    boolean isActive();
}
