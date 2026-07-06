package com.victor.timetrack.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateTimeEntryRequest {
    private Long projectId;
    private LocalDate date;
    private BigDecimal hours;
    private String description;
}
