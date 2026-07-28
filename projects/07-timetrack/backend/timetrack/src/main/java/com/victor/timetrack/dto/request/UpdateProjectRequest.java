package com.victor.timetrack.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProjectRequest {
    @NotBlank
    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String description;
    private Boolean active;
}
