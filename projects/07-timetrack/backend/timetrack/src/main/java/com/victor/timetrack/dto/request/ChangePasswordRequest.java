package com.victor.timetrack.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.ToString;

@Data
public class ChangePasswordRequest {
    @ToString.Exclude
    @NotBlank
    @Size(max = 72)
    private String currentPassword;
    
    @ToString.Exclude
    @NotBlank
    @Size(min = 8, max = 72)
    private String newPassword;
}
