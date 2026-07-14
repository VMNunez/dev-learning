package com.victor.timetrack.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProjectRequest {

    @NotBlank
    private String name;

    private String description;
}
