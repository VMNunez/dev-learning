package com.victor.timetrack.service;

import com.victor.timetrack.dto.response.UserHoursReportResponse;
import com.victor.timetrack.dto.response.ProjectHoursReportResponse;
import com.victor.timetrack.dto.response.ReportSummaryResponse;
import com.victor.timetrack.model.EntryStatus;
import com.victor.timetrack.model.TimeEntry;
import com.victor.timetrack.repository.TimeEntryRepository;
import com.victor.timetrack.repository.TimeEntrySpecifications;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class ReportService {
    private final TimeEntryRepository timeEntryRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;


    public ReportService(TimeEntryRepository timeEntryRepository, AuthenticatedUserProvider authenticatedUserProvider) {
        this.timeEntryRepository = timeEntryRepository;
        this.authenticatedUserProvider = authenticatedUserProvider;
    }

    @Transactional(readOnly = true)
    public List<ProjectHoursReportResponse> getHoursByProject(YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        return timeEntryRepository.getHoursByProject(start, end);
    }

    @Transactional(readOnly = true)
    public List<UserHoursReportResponse> getHoursByUser(YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        return timeEntryRepository.getHoursByUser(start, end);
    }

    @Transactional(readOnly = true)
    public ReportSummaryResponse getSummary(YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();

        Long userId = null;
        if (!authenticatedUserProvider.isManager()) {
            userId = authenticatedUserProvider.currentUser().getId();
        }

        Specification<TimeEntry> spec = Specification
                .where(TimeEntrySpecifications.dateBetween(start, end))
                .and(TimeEntrySpecifications.hasUserId(userId));

        List<TimeEntry> entries = timeEntryRepository.findAll(spec);

        BigDecimal approvedHours = entries.stream()
                .filter(e -> e.getStatus() == EntryStatus.APPROVED)
                .map(TimeEntry::getHours)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pendingHours = entries.stream()
                .filter(e -> e.getStatus() == EntryStatus.SUBMITTED)
                .map(TimeEntry::getHours)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalEntries = (int) entries.stream()
                .filter(e -> e.getStatus() == EntryStatus.APPROVED)
                .count();

        ReportSummaryResponse response = new ReportSummaryResponse();
        response.setTotalEntries(totalEntries);
        response.setApprovedHours(approvedHours);
        response.setPendingHours(pendingHours);

        return response;
    }
}
