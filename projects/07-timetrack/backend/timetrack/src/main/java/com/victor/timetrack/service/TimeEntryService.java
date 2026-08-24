package com.victor.timetrack.service;

import com.victor.timetrack.dto.request.CreateTimeEntryRequest;
import com.victor.timetrack.dto.request.UpdateTimeEntryRequest;
import com.victor.timetrack.dto.response.TimeEntryResponse;
import com.victor.timetrack.exception.BusinessRuleViolationException;
import com.victor.timetrack.exception.ForbiddenOperationException;
import com.victor.timetrack.exception.InvalidStateTransitionException;
import com.victor.timetrack.exception.ResourceNotFoundException;
import com.victor.timetrack.model.EntryStatus;
import com.victor.timetrack.model.Project;
import com.victor.timetrack.model.TimeEntry;
import com.victor.timetrack.model.User;
import com.victor.timetrack.repository.ProjectRepository;
import com.victor.timetrack.repository.TimeEntryRepository;
import com.victor.timetrack.repository.TimeEntrySpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

@Service
public class TimeEntryService {
    private final TimeEntryRepository timeEntryRepository;
    private final ProjectRepository projectRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;
    private static final BigDecimal MIN_HOURS = new BigDecimal("0.5");
    private static final BigDecimal MAX_HOURS = new BigDecimal("24");


    public TimeEntryService(
            TimeEntryRepository timeEntryRepository,
            ProjectRepository projectRepository,
            AuthenticatedUserProvider authenticatedUserProvider) {
        this.timeEntryRepository = timeEntryRepository;
        this.projectRepository = projectRepository;
        this.authenticatedUserProvider = authenticatedUserProvider;
    }

    @Transactional
    public TimeEntryResponse create(CreateTimeEntryRequest request) {
        User user = authenticatedUserProvider.currentUser();
        Project project = resolveProject(request.getProjectId(), false);

        validateEntryData(request.getDate(), request.getHours());

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
        User user = authenticatedUserProvider.currentUser();
        TimeEntry timeEntry = findOwnedEntry(id, user);

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
        User user = authenticatedUserProvider.currentUser();
        TimeEntry timeEntry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

        if (timeEntry.getUser().getId().equals(user.getId())) {
            throw new ForbiddenOperationException("Managers cannot approve their own time entries");
        }

        if (timeEntry.getStatus() != EntryStatus.SUBMITTED) {
            throw new InvalidStateTransitionException("Manager can only approve SUBMITTED entries");
        }

        timeEntry.setStatus(EntryStatus.APPROVED);

        TimeEntry saved = timeEntryRepository.save(timeEntry);

        return toResponse(saved);
    }

    @Transactional
    public TimeEntryResponse reject(Long id, String rejectionNote) {
        User user = authenticatedUserProvider.currentUser();
        TimeEntry timeEntry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

        if (timeEntry.getUser().getId().equals(user.getId())) {
            throw new ForbiddenOperationException("Managers cannot reject their own time entries");
        }

        if (timeEntry.getStatus() != EntryStatus.SUBMITTED) {
            throw new InvalidStateTransitionException("Manager can only reject SUBMITTED entries");
        }

        timeEntry.setStatus(EntryStatus.REJECTED);
        timeEntry.setRejectionNote(rejectionNote);

        TimeEntry saved = timeEntryRepository.save(timeEntry);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<TimeEntryResponse> findByFilter(Long userId, Long projectId, EntryStatus status, YearMonth month,
                                                Pageable pageable) {
        boolean isManager = authenticatedUserProvider.isManager();

        LocalDate start = null;
        LocalDate end = null;

        if (month != null) {
            start = month.atDay(1);
            end = month.atEndOfMonth();
        }

        if (!isManager) {
            User user = authenticatedUserProvider.currentUser();
            userId = user.getId();
        }

        Specification<TimeEntry> spec = Specification
                .where(TimeEntrySpecifications.hasUserId(userId))
                .and(TimeEntrySpecifications.hasProjectId(projectId))
                .and(TimeEntrySpecifications.hasStatus(status))
                .and(TimeEntrySpecifications.dateBetween(start, end))
                .and(TimeEntrySpecifications.fetchUserAndProject());

        return timeEntryRepository.findAll(spec, pageable)
                .map(this::toResponse);
    }

    @Transactional
    public TimeEntryResponse update(Long id, UpdateTimeEntryRequest request) {
        User user = authenticatedUserProvider.currentUser();
        TimeEntry timeEntry = findOwnedEntry(id, user);

        boolean callerKnowsItExists = timeEntry.getProject().getId().equals(request.getProjectId());
        Project project = resolveProject(request.getProjectId(), callerKnowsItExists);

        if (timeEntry.getStatus() != EntryStatus.DRAFT) {
            throw new InvalidStateTransitionException("You can only update DRAFT entries");
        }

        validateEntryData(request.getDate(), request.getHours());

        timeEntry.setProject(project);
        timeEntry.setDate(request.getDate());
        timeEntry.setHours(request.getHours());
        timeEntry.setDescription(request.getDescription());

        TimeEntry saved = timeEntryRepository.save(timeEntry);
        return toResponse(saved);
    }

    @Transactional
    public TimeEntryResponse reopen(Long id) {
        User user = authenticatedUserProvider.currentUser();
        TimeEntry timeEntry = findOwnedEntry(id, user);

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
        User user = authenticatedUserProvider.currentUser();
        TimeEntry timeEntry = findOwnedEntry(id, user);
        if (timeEntry.getStatus() != EntryStatus.DRAFT) {
            throw new InvalidStateTransitionException("You can only delete DRAFT entries");
        }

        timeEntryRepository.deleteById(id);
    }

    private TimeEntry findOwnedEntry(Long id, User user) {
        return timeEntryRepository.findById(id)
                .filter(entry -> entry.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));
    }

    private void validateEntryData(LocalDate date, BigDecimal hours) {
        if (date.isAfter(LocalDate.now())) {
            throw new BusinessRuleViolationException("Date cannot be in the future");
        }

        if (hours.compareTo(MIN_HOURS) < 0 || hours.compareTo(MAX_HOURS) > 0) {
            throw new BusinessRuleViolationException("Hours must be between 0.5 and 24");
        }
    }

    private Project resolveProject(Long projectId, boolean callerKnowsItExists) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + projectId));

        if (!project.isActive() && !callerKnowsItExists) {
            throw new ResourceNotFoundException("Project not found with id " + projectId);
        }

        if (!project.isActive()) {
            throw new BusinessRuleViolationException("Project is not active");
        }

        return project;
    }


    private TimeEntryResponse toResponse(TimeEntry timeEntry) {
        TimeEntryResponse response = new TimeEntryResponse();
        response.setId(timeEntry.getId());
        response.setUserId(timeEntry.getUser().getId());
        response.setUserName(timeEntry.getUser().getName());
        response.setProjectId(timeEntry.getProject().getId());
        response.setProjectName(timeEntry.getProject().getName());
        response.setDate(timeEntry.getDate());
        response.setHours(timeEntry.getHours());
        response.setDescription(timeEntry.getDescription());
        response.setStatus(timeEntry.getStatus());
        response.setRejectionNote(timeEntry.getRejectionNote());

        return response;
    }

}
