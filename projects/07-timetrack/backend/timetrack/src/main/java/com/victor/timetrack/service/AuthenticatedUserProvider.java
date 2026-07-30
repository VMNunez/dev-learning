package com.victor.timetrack.service;

import com.victor.timetrack.exception.ResourceNotFoundException;
import com.victor.timetrack.model.Role;
import com.victor.timetrack.model.User;
import com.victor.timetrack.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class AuthenticatedUserProvider {
    private final UserRepository userRepository;

    public AuthenticatedUserProvider(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User currentUser() {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
    }

    public boolean isManager() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        return Objects.requireNonNull(auth).getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_" + Role.MANAGER.name()));
    }
}
