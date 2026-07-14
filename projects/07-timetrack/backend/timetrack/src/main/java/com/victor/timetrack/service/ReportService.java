package com.victor.timetrack.service;

import com.victor.timetrack.dto.response.EmployeeHoursReportResponse;
import com.victor.timetrack.dto.response.ProjectHoursReportResponse;
import com.victor.timetrack.repository.TimeEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class ReportService {
    private final TimeEntryRepository timeEntryRepository;

    public ReportService(TimeEntryRepository timeEntryRepository){
        this.timeEntryRepository = timeEntryRepository;
    }

    public List<ProjectHoursReportResponse> getHoursByProject(YearMonth month){
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        return  timeEntryRepository.getHoursByProject(start,end);
    }

    public List<EmployeeHoursReportResponse> getHoursByEmployee(YearMonth month){
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        return timeEntryRepository.getHoursByEmployee(start,end);
    }
}
