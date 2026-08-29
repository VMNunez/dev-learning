package com.victor.timetrack.security;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {
    private static final int MAX_ATTEMPTS = 5;
    private static final Duration COOLDOWN = Duration.ofMinutes(1);

    private final Map<String, Attempts> attempts = new ConcurrentHashMap<>();

    private record Attempts(int count, Instant lastFailure) {
    }

    public boolean isBlocked(String key) {
        Attempts current = attempts.get(key);
        if (current == null) {
            return false;
        }
        if (expired(current)) {
            attempts.remove(key, current);
            return false;
        }
        return current.count() >= MAX_ATTEMPTS;
    }

    public void recordFailure(String key) {
        attempts.compute(key, (k, current) ->
                (current == null || expired(current))
                        ? new Attempts(1, Instant.now())
                        : new Attempts(current.count() + 1, Instant.now()));
    }

    public void reset(String key) {
        attempts.remove(key);
    }

    private boolean expired(Attempts current) {
        return current.lastFailure().plus(COOLDOWN).isBefore(Instant.now());
    }
}
