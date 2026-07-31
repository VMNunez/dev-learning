package com.victor.timetrack.controller;

import com.victor.timetrack.dto.response.UserHoursReportResponse;
import com.victor.timetrack.dto.response.ProjectHoursReportResponse;
import com.victor.timetrack.dto.response.ReportSummaryResponse;
import com.victor.timetrack.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reportService;

    public  ReportController(ReportService reportService){
        this.reportService = reportService;
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/by-project")
    public ResponseEntity<List<ProjectHoursReportResponse>> getHoursByProject(@RequestParam YearMonth month){
        return ResponseEntity.ok(reportService.getHoursByProject(month));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/by-user")
    public ResponseEntity<List<UserHoursReportResponse>> getHoursByUser(@RequestParam YearMonth month){
        return ResponseEntity.ok(reportService.getHoursByUser(month));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/summary")
    public ResponseEntity<ReportSummaryResponse> getSummary(@RequestParam YearMonth month){
        return ResponseEntity.ok(reportService.getSummary(month));
    }
}
