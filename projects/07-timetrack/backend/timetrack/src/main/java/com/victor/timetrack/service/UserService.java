package com.victor.timetrack.service;

import com.victor.timetrack.dto.request.CreateUserRequest;
import com.victor.timetrack.dto.response.UserResponse;
import com.victor.timetrack.model.User;
import com.victor.timetrack.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> getAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UserResponse create(CreateUserRequest request) {
        Optional<User> user = userRepository.findByEmail(request.getEmail());

        if (user.isPresent()) {
            throw new DataIntegrityViolationException("Email already in use");
        }

        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(request.getRole());

        User saved = userRepository.save(newUser);

        return toResponse(saved);
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setActive(user.isActive());

        return response;
    }
}
