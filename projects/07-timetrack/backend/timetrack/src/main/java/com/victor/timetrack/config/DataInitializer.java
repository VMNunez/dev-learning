package com.victor.timetrack.config;

import com.victor.timetrack.model.Role;
import com.victor.timetrack.model.User;
import com.victor.timetrack.repository.UserRepository;
import com.victor.timetrack.util.EmailNormalizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;
    private final String adminName;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           @Value("${app.admin.email}") String adminEmail,
                           @Value("${app.admin.password}") String adminPassword,
                           @Value("${app.admin.name}") String adminName) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.adminName = adminName;
    }

    @Override
    public void run(String... args) {
        String email = EmailNormalizer.normalize(adminEmail);
        if (userRepository.existsByEmail(email)) {
            return;
        }
        User admin = new User();
        admin.setName(adminName);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.MANAGER);
        admin.setActive(true);

        userRepository.save(admin);
    }
}
