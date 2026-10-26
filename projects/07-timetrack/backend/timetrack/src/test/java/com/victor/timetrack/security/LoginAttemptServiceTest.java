package com.victor.timetrack.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class LoginAttemptServiceTest {
    @Test
    void isBlocked_returnsFalseForUnknownKey() {
        LoginAttemptService service = new LoginAttemptService();

        boolean blocked = service.isBlocked("nobody@timetrack.com");

        assertThat(blocked).isFalse();
    }

    @Test
    void isBlocked_returnsTrueAfterFiveFailures() {
        LoginAttemptService service = new LoginAttemptService();

        String email = "ana@timetrack.com";
        for (int i = 0; i < 5; i++) {
            service.recordFailure(email);
        }

        boolean blocked = service.isBlocked(email);

        assertThat(blocked).isTrue();

    }

    @Test
    void isBlocked_returnsFalseAfterFourFailures(){
        LoginAttemptService service = new LoginAttemptService();

        String email = "ana@timetrack.com";
        for(int i = 0; i < 4; i++){
            service.recordFailure(email);
        }

        boolean blocked = service.isBlocked(email);

        assertThat(blocked).isFalse();
    }

    @Test
    void isBlocked_doesNotBlockADifferentKey(){
        LoginAttemptService service = new LoginAttemptService();
        String blockedEmail = "ana@timetrack.com";
        String otherEmail = "luis@timetrack.com";

        for(int i = 0 ; i < 5; i++){
            service.recordFailure(blockedEmail);
        }

        boolean anaBlocked = service.isBlocked(blockedEmail);
        boolean otherBlocked = service.isBlocked(otherEmail);

        assertThat(anaBlocked).isTrue();
        assertThat(otherBlocked).isFalse();
    }

    @Test
    void reset_unblocksTheKeyImmediately(){
        LoginAttemptService service = new LoginAttemptService();

        String email = "ana@timetrack.com";
        for(int i = 0; i < 5; i++){
            service.recordFailure(email);
        }
        boolean blocked = service.isBlocked(email);
        assertThat(blocked).isTrue();

        service.reset(email);

        blocked = service.isBlocked(email);
        assertThat(blocked).isFalse();
    }
}
