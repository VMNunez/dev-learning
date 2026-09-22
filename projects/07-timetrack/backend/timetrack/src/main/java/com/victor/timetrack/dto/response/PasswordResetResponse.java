package com.victor.timetrack.dto.response;

import lombok.Data;
import lombok.ToString;

// The one-time plaintext of a password a manager reset. Like `CreateUserResponse`, it exists in this
// response and nowhere else — the database keeps only its hash — so the manager passes it on once.
@Data
public class PasswordResetResponse {
    @ToString.Exclude
    private String generatedPassword;
}
