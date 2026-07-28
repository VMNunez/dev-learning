package com.victor.timetrack.service;

import com.victor.timetrack.dto.request.CreateTimeEntryRequest;
import com.victor.timetrack.dto.response.TimeEntryResponse;
import com.victor.timetrack.exception.BusinessRuleViolationException;
import com.victor.timetrack.exception.InvalidStateTransitionException;
import com.victor.timetrack.exception.ResourceNotFoundException;
import com.victor.timetrack.exception.UnauthorizedException;
import com.victor.timetrack.model.*;
import com.victor.timetrack.repository.ProjectRepository;
import com.victor.timetrack.repository.TimeEntryRepository;
import com.victor.timetrack.repository.TimeEntrySpecifications;
import com.victor.timetrack.repository.UserRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
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

    @Transactional
    public TimeEntryResponse create(CreateTimeEntryRequest request) {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Project not found with id " + request.getProjectId()));

        if (request.getDate().isAfter(LocalDate.now())) {
            throw new BusinessRuleViolationException("Date cannot be in the future");
        }

        if (!project.isActive()) {
            throw new BusinessRuleViolationException("Project is not active");
        }

        BigDecimal min = new BigDecimal("0.5");
        BigDecimal max = new BigDecimal("24");

        if (request.getHours().compareTo(min) < 0 || request.getHours().compareTo(max) > 0) {
            throw new BusinessRuleViolationException("Hours must be between 0.5 and 24");
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

    @Transactional
    public TimeEntryResponse submit(Long id) {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
        TimeEntry timeEntry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

        if (!timeEntry.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only submit your own time entries");
        }

        if (timeEntry.getStatus() != EntryStatus.DRAFT) {
            throw new InvalidStateTransitionException("Employee can only submit DRAFT entries");
        }

        if (!timeEntry.getProject().isActive()) {
            throw new BusinessRuleViolationException("Cannot submit an entry for an inactive project");
        }

        timeEntry.setStatus(EntryStatus.SUBMITTED);

        TimeEntry saved = timeEntryRepository.save(timeEntry);

        return toResponse(saved);

    }

    @Transactional
    public TimeEntryResponse approve(Long id) {
        TimeEntry timeEntry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

        if (!timeEntry.getStatus().equals(EntryStatus.SUBMITTED)) {
            throw new InvalidStateTransitionException("Manager can only approve SUBMITTED entries");
        }

        timeEntry.setStatus(EntryStatus.APPROVED);

        TimeEntry saved = timeEntryRepository.save(timeEntry);

        return toResponse(saved);
    }

    @Transactional
    public TimeEntryResponse reject(Long id, String rejectionNote) {
        TimeEntry timeEntry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

        if (!timeEntry.getStatus().equals(EntryStatus.SUBMITTED)) {
            throw new InvalidStateTransitionException("Manager can only reject SUBMITTED entries");
        }

        timeEntry.setStatus(EntryStatus.REJECTED);
        timeEntry.setRejectionNote(rejectionNote);

        TimeEntry saved = timeEntryRepository.save(timeEntry);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<TimeEntryResponse> findByFilter(Long userId, Long projectId, EntryStatus status, YearMonth month) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean isManager = Objects.requireNonNull(auth).getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_MANAGER"));

        LocalDate start = null;
        LocalDate end = null;

        if (month != null) {
            start = month.atDay(1);
            end = month.atEndOfMonth();
        }

        if (!isManager) {
            String email = auth.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
            userId = user.getId();
        }

        Specification<TimeEntry> spec = Specification
                .where(TimeEntrySpecifications.hasUserId(userId))
                .and(TimeEntrySpecifications.hasProjectId(projectId))
                .and(TimeEntrySpecifications.hasStatus(status))
                .and(TimeEntrySpecifications.dateBetween(start, end))
                .and(TimeEntrySpecifications.fetchUserAndProject());


        return timeEntryRepository.findAll(spec)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TimeEntryResponse update(Long id, CreateTimeEntryRequest request) {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Project not found with id " + request.getProjectId()));
        TimeEntry timeEntry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

        if (!timeEntry.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only update your own time entries");
        }

        if (!timeEntry.getStatus().equals(EntryStatus.DRAFT)) {
            throw new InvalidStateTransitionException("You can only update DRAFT entries");
        }

        if (request.getDate().isAfter(LocalDate.now())) {
            throw new BusinessRuleViolationException("Date cannot be in the future");
        }

        if (!project.isActive()) {
            throw new BusinessRuleViolationException("Project is not active");
        }

        BigDecimal min = new BigDecimal("0.5");
        BigDecimal max = new BigDecimal("24");

        if (request.getHours().compareTo(min) < 0 || request.getHours().compareTo(max) > 0) {
            throw new BusinessRuleViolationException("Hours must be between 0.5 and 24");
        }

        timeEntry.setProject(project);
        timeEntry.setDate(request.getDate());
        timeEntry.setHours(request.getHours());
        timeEntry.setDescription(request.getDescription());

        TimeEntry saved = timeEntryRepository.save(timeEntry);
        return toResponse(saved);
    }

    @Transactional
    public TimeEntryResponse reopen(Long id) {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
        TimeEntry timeEntry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

        if (!timeEntry.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only reopen your own entries");
        }

        if (timeEntry.getStatus() != EntryStatus.REJECTED) {
            throw new InvalidStateTransitionException("Employee can only reopen REJECTED entries");
        }

        timeEntry.setStatus(EntryStatus.DRAFT);
        timeEntry.setRejectionNote(null);

        TimeEntry saved = timeEntryRepository.save(timeEntry);

        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
        TimeEntry timeEntry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

        if (!timeEntry.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only delete your own time entries");
        }

        if (!timeEntry.getStatus().equals(EntryStatus.DRAFT)) {
            throw new InvalidStateTransitionException("You can only delete DRAFT entries");
        }

        timeEntryRepository.deleteById(id);
    }

    private TimeEntryResponse toResponse(TimeEntry timeEntry) {
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
