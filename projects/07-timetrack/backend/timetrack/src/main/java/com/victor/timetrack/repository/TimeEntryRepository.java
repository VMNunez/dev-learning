package com.victor.timetrack.repository;

import com.victor.timetrack.dto.response.EmployeeHoursReportResponse;
import com.victor.timetrack.dto.response.ProjectHoursReportResponse;
import com.victor.timetrack.model.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long>, JpaSpecificationExecutor<TimeEntry> {

    @Query("""
            SELECT te.project.id AS projectId, te.project.name AS projectName, SUM(te.hours) AS totalHours
            FROM TimeEntry te
            WHERE te.date BETWEEN :start AND :end AND te.status = com.victor.timetrack.model.EntryStatus.APPROVED
            GROUP BY te.project.id, te.project.name
            
            """)
    List<ProjectHoursReportResponse> getHoursByProject(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("""
            SELECT te.user.name AS employeeName,te.user.id AS userId, SUM(te.hours) AS totalHours
            FROM TimeEntry te
            WHERE te.date BETWEEN :start AND :end AND te.status = com.victor.timetrack.model.EntryStatus.APPROVED
            GROUP BY te.user.id, te.user.name
            """)
    List<EmployeeHoursReportResponse> getHoursByEmployee(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
