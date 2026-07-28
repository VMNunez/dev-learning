package com.victor.timetrack.service;

import com.victor.timetrack.dto.request.CreateUserRequest;
import com.victor.timetrack.dto.request.UpdateUserRequest;
import com.victor.timetrack.dto.response.UserResponse;
import com.victor.timetrack.exception.ResourceNotFoundException;
import com.victor.timetrack.model.User;
import com.victor.timetrack.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
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

    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

        if (!user.getEmail().equals(request.getEmail())) {
            Optional<User> userExist = userRepository.findByEmail(request.getEmail());

            if (userExist.isPresent()) {
                throw new DataIntegrityViolationException("Email already in use");
            }
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        User saved = userRepository.save(user);

        return toResponse(saved);

    }

    @Transactional
    public void delete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

        user.setActive(false);
        userRepository.save(user);
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
