package com.victor.timetrack.service;

import com.victor.timetrack.dto.request.LoginRequest;
import com.victor.timetrack.dto.response.AuthResponse;
import com.victor.timetrack.exception.ResourceNotFoundException;
import com.victor.timetrack.exception.TooManyAttemptsException;
import com.victor.timetrack.model.User;
import com.victor.timetrack.repository.UserRepository;
import com.victor.timetrack.security.JwtUtil;
import com.victor.timetrack.security.LoginAttemptService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final LoginAttemptService loginAttemptService;

    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserRepository userRepository,
                       LoginAttemptService loginAttemptService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.loginAttemptService = loginAttemptService;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request, String ip) {
        String emailKey = request.getEmail().toLowerCase();

        if (loginAttemptService.isBlocked(emailKey) || loginAttemptService.isBlocked(ip)) {
            throw new TooManyAttemptsException("Too many failed login attempts. Try again later.");
        }

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            loginAttemptService.recordFailure(emailKey);
            loginAttemptService.recordFailure(ip);
            throw e;
        }

        loginAttemptService.reset(emailKey);
        loginAttemptService.reset(ip);

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        String token = jwtUtil.generateToken(user.getId());

        return new AuthResponse(token, user.getName(), user.getRole());

    }
}
