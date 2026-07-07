package com.victor.timetrack.service;

import com.victor.timetrack.dto.request.CreateTimeEntryRequest;
import com.victor.timetrack.dto.response.TimeEntryResponse;
import com.victor.timetrack.model.Project;
import com.victor.timetrack.model.TimeEntry;
import com.victor.timetrack.model.User;
import com.victor.timetrack.repository.ProjectRepository;
import com.victor.timetrack.repository.TimeEntryRepository;
import com.victor.timetrack.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

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

    public TimeEntryResponse create(CreateTimeEntryRequest request) {


        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email " + email));
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found with id " + request.getProjectId()));

        if (request.getDate().isAfter(LocalDate.now())) {
            throw new RuntimeException("Date cannot be in the future");
        }

        if(!project.getActive()){
            throw new RuntimeException("Project is not active");
        }

        BigDecimal min = new BigDecimal("0.5");
        BigDecimal max = new BigDecimal("24");

        if(request.getHours().compareTo(min) < 0 || request.getHours().compareTo(max)>0){
            throw new RuntimeException("Hours must be between 0.5 and 24");
        }

        TimeEntry timeEntry = new TimeEntry();
        timeEntry.setUser(user);
        timeEntry.setProject(project);
        timeEntry.setDate(request.getDate());
        timeEntry.setHours(request.getHours());
        timeEntry.setDescription(request.getDescription());

        TimeEntry saved = timeEntryRepository.save(timeEntry);

        return toResponse(saved);
    }

    private TimeEntryResponse toResponse (TimeEntry timeEntry){
        TimeEntryResponse response = new TimeEntryResponse();
        response.setId(timeEntry.getId());
        response.setUserName(timeEntry.getUser().getName());
        response.setProjectName(timeEntry.getProject().getName());
        response.setDate(timeEntry.getDate());
        response.setHours(timeEntry.getHours());
        response.setDescription(timeEntry.getDescription());
        response.setStatus(timeEntry.getStatus());
        response.setRejectionNote(timeEntry.getRejectionNote());

        return response;
    }

}
