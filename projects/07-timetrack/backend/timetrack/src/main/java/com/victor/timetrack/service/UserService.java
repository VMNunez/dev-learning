package com.victor.timetrack.service;

import com.victor.timetrack.dto.request.ChangePasswordRequest;
import com.victor.timetrack.dto.request.CreateUserRequest;
import com.victor.timetrack.dto.request.UpdateUserRequest;
import com.victor.timetrack.dto.response.CreateUserResponse;
import com.victor.timetrack.dto.response.UserResponse;
import com.victor.timetrack.exception.DuplicateResourceException;
import com.victor.timetrack.exception.InvalidCurrentPasswordException;
import com.victor.timetrack.exception.InvalidStateTransitionException;
import com.victor.timetrack.exception.ResourceNotFoundException;
import com.victor.timetrack.model.EntryStatus;
import com.victor.timetrack.model.Role;
import com.victor.timetrack.model.User;
import com.victor.timetrack.repository.TimeEntryRepository;
import com.victor.timetrack.repository.UserRepository;
import com.victor.timetrack.util.EmailNormalizer;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final TimeEntryRepository timeEntryRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticatedUserProvider authenticatedUserProvider;
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    private static final Sort TEAM_ORDER = Sort.by(
            Sort.Order.desc("active"),
            Sort.Order.asc("name"),
            Sort.Order.asc("id"));
    private static final Set<EntryStatus> NON_TERMINAL_STATUSES =
            EnumSet.of(EntryStatus.DRAFT, EntryStatus.REJECTED);
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticatedUserProvider authenticatedUserProvider, TimeEntryRepository timeEntryRepository) {
        this.userRepository = userRepository;
        this.timeEntryRepository = timeEntryRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticatedUserProvider = authenticatedUserProvider;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userRepository.findAll(TEAM_ORDER).stream().map(this::toResponse).toList();
    }

    @Transactional
    public CreateUserResponse create(CreateUserRequest request) {
        String email = EmailNormalizer.normalize(request.getEmail());

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("email", "Email already in use");
        }

        String generatedPassword = generatePassword();

        User newUser = new User();
        newUser.setName(request.getName().trim());
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(generatedPassword));
        newUser.setRole(request.getRole());

        User saved = userRepository.save(newUser);

        CreateUserResponse response = new CreateUserResponse();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setEmail(saved.getEmail());
        response.setRole(saved.getRole());
        response.setActive(saved.isActive());
        response.setGeneratedPassword(generatedPassword);

        return response;
    }

    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

        String email = EmailNormalizer.normalize(request.getEmail());

        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("email", "Email already in use");
        }

        boolean promotedToManager = request.getRole() == Role.MANAGER
                && user.getRole() != Role.MANAGER;

        if (promotedToManager
                && timeEntryRepository.existsByUserIdAndStatusIn(user.getId(), NON_TERMINAL_STATUSES)) {
            throw new InvalidStateTransitionException(
                    "Cannot promote a user to MANAGER while they have DRAFT or REJECTED entries. "
                            + "The user must submit, delete or resubmit them first");
        }

        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setRole(request.getRole());
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }

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

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = authenticatedUserProvider.currentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidCurrentPasswordException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }


    private String generatePassword() {
        StringBuilder sb = new StringBuilder(12);
        for (int i = 0; i < 12; i++) {
            sb.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }
        return sb.toString();
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
