package com.victor.timetrack.dto.response;

import java.math.BigDecimal;

public interface UserHoursReportResponse {
    Long getUserId();
    String getUserName();
    BigDecimal getTotalHours();
    boolean isActive();
}
