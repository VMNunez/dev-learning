package com.victor.timetrack.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateTimeEntryRequest {
    @NotNull
    private Long projectId;

    @NotNull
    private LocalDate date;

    @NotNull
    private BigDecimal hours;

    @NotBlank
    private String description;
}
