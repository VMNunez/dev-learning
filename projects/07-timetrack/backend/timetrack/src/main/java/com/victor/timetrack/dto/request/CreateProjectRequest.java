package com.victor.timetrack.dto.request;

import lombok.Data;

@Data
public class CreateProjectRequest {

    private String name;
    private String description;
}
