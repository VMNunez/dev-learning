package com.victor.timetrack.service;

import com.victor.timetrack.dto.response.UserHoursReportResponse;
import com.victor.timetrack.dto.response.ProjectHoursReportResponse;
import com.victor.timetrack.dto.response.ReportSummaryResponse;
import com.victor.timetrack.dto.response.ReportSummaryProjection;
import com.victor.timetrack.repository.TimeEntryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.RoundingMode;
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
        MonthRange range = MonthRange.of(month);

        return timeEntryRepository.getHoursByProject(range.start(), range.end());
    }

    @Transactional(readOnly = true)
    public List<UserHoursReportResponse> getHoursByUser(YearMonth month) {
        MonthRange range = MonthRange.of(month);

        return timeEntryRepository.getHoursByUser(range.start(), range.end());
    }

    @Transactional(readOnly = true)
    public ReportSummaryResponse getSummary(YearMonth month) {
        MonthRange range = MonthRange.of(month);

        Long userId = null;
        if (!authenticatedUserProvider.isManager()) {
            userId = authenticatedUserProvider.currentUser().getId();
        }

        ReportSummaryProjection summary =
                timeEntryRepository.getSummary(range.start(), range.end(), userId);

        ReportSummaryResponse response = new ReportSummaryResponse();
        response.setTotalEntries(summary.getTotalEntries());
        response.setApprovedHours(summary.getApprovedHours().setScale(2, RoundingMode.HALF_UP));
        response.setPendingHours(summary.getPendingHours().setScale(2, RoundingMode.HALF_UP));
        
        return response;
    }

    private record MonthRange(LocalDate start, LocalDate end) {
        static MonthRange of(YearMonth month) {
            return new MonthRange(month.atDay(1), month.atEndOfMonth());
        }
    }
}
