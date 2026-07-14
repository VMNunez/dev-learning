package com.victor.timetrack.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectRequest {
    @NotBlank
    private String rejectionNote;
}
