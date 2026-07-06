package com.victor.timetrack.service;

import com.victor.timetrack.dto.request.CreateTimeEntryRequest;
import com.victor.timetrack.model.Project;
import com.victor.timetrack.model.TimeEntry;
import com.victor.timetrack.model.User;
import com.victor.timetrack.repository.ProjectRepository;
import com.victor.timetrack.repository.TimeEntryRepository;
import com.victor.timetrack.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class TimeEntryService {
    private final TimeEntryRepository timeEntryRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TimeEntryService(
            TimeEntryRepository timeEntryRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository) {
        this.timeEntryRepository = timeEntryRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public TimeEntry create(CreateTimeEntryRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email " + email));
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found with id " + request.getProjectId()));

        TimeEntry timeEntry = new TimeEntry();
        timeEntry.setUser(user);
        timeEntry.setProject(project);
        timeEntry.setDate(request.getDate());
        timeEntry.setHours(request.getHours());
        timeEntry.setDescription(request.getDescription());

        TimeEntry saved = timeEntryRepository.save(timeEntry);

        return saved;
    }

}
