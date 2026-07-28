package com.victor.timetrack.dto.request;

import jakarta.validation.constraints.*;
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
    @DecimalMin("0.5")
    @DecimalMax("24")
    @Digits(integer = 2,fraction = 2)
    private BigDecimal hours;

    @NotBlank
    private String description;
}
