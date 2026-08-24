package com.victor.timetrack.dto.response;

import com.victor.timetrack.model.EntryStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TimeEntryResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Long projectId;
    private String projectName;
    private LocalDate date;
    private BigDecimal hours;
    private String description;
    private EntryStatus status;
    private String rejectionNote;
}
