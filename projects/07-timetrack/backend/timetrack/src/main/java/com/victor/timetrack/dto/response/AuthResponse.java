package com.victor.timetrack.dto.response;

import com.victor.timetrack.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    @ToString.Exclude
    private String token;
    private String name;
    private Role role;
}
