package com.victor.timetrack.dto.response;

import com.victor.timetrack.model.Role;
import lombok.Data;
import lombok.ToString;

@Data
public class CreateUserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean active;
    @ToString.Exclude
    private String generatedPassword;
}
