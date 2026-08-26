package com.victor.timetrack.exception;

import lombok.Getter;

import java.util.Objects;

@Getter
public class InvalidPasswordException extends RuntimeException {
    private final String field;

    public InvalidPasswordException(String field, String message) {
        super(message);
        this.field = Objects.requireNonNull(field, "field must not be null");
    }
}
