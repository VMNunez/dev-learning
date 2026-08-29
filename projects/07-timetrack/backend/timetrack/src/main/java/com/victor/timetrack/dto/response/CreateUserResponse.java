package com.victor.timetrack.dto.response;

import com.victor.timetrack.model.Role;
import lombok.Data;

@Data
public class CreateUserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean active;
    private String generatedPassword;
}
