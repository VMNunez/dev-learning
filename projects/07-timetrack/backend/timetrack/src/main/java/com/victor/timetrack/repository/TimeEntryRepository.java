package com.victor.timetrack.repository;

import com.victor.timetrack.dto.response.ProjectHoursReportResponse;
import com.victor.timetrack.model.TimeEntry;
import com.victor.timetrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {
    List<TimeEntry> findByUser(User user);

    @Query("""
            SELECT te.project.name AS projectName, SUM(te.hours) AS totalHours
            FROM TimeEntry te
            WHERE te.date BETWEEN :start AND :end
            GROUP BY te.project.name
            """)
    List<ProjectHoursReportResponse> getHoursByProject(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
