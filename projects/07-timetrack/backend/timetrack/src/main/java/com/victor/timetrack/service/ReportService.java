package com.victor.timetrack.service;

import com.victor.timetrack.dto.response.EmployeeHoursReportResponse;
import com.victor.timetrack.dto.response.ProjectHoursReportResponse;
import com.victor.timetrack.dto.response.ReportSummaryResponse;
import com.victor.timetrack.model.EntryStatus;
import com.victor.timetrack.model.TimeEntry;
import com.victor.timetrack.repository.TimeEntryRepository;
import com.victor.timetrack.repository.TimeEntrySpecifications;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class ReportService {
    private final TimeEntryRepository timeEntryRepository;

    public ReportService(TimeEntryRepository timeEntryRepository) {
        this.timeEntryRepository = timeEntryRepository;
    }

    public List<ProjectHoursReportResponse> getHoursByProject(YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        return timeEntryRepository.getHoursByProject(start, end);
    }

    public List<EmployeeHoursReportResponse> getHoursByEmployee(YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        return timeEntryRepository.getHoursByEmployee(start, end);
    }

    public ReportSummaryResponse getSummary(YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();

        Specification<TimeEntry> spec = Specification
                .where(TimeEntrySpecifications.dateBetween(start, end));

        List<TimeEntry> entries = timeEntryRepository.findAll(spec);

        BigDecimal approvedHours = entries.stream()
                .filter(e -> e.getStatus() == EntryStatus.APPROVED)
                .map(TimeEntry::getHours)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pendingHours = entries.stream()
                .filter(e -> e.getStatus() == EntryStatus.SUBMITTED)
                .map(TimeEntry::getHours)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalHours = approvedHours.add(pendingHours);

        int totalEntries = (int) entries.stream()
                .filter(e -> e.getStatus() == EntryStatus.APPROVED || e.getStatus() == EntryStatus.SUBMITTED)
                .count();

        ReportSummaryResponse response = new ReportSummaryResponse();
        response.setTotalHours(totalHours);
        response.setTotalEntries(totalEntries);
        response.setApprovedHours(approvedHours);
        response.setPendingHours(pendingHours);

        return response;
    }
}
