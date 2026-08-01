package com.victor.timetrack.repository;

import com.victor.timetrack.dto.response.UserHoursReportResponse;
import com.victor.timetrack.dto.response.ProjectHoursReportResponse;
import com.victor.timetrack.model.EntryStatus;
import com.victor.timetrack.model.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long>, JpaSpecificationExecutor<TimeEntry> {
    boolean existsByUserIdAndStatusIn(Long userId, Collection<EntryStatus> statuses);

    @Query("""
            SELECT te.project.id AS projectId, te.project.name AS projectName, SUM(te.hours) AS totalHours, te.project.active AS active
            FROM TimeEntry te
            WHERE te.date BETWEEN :start AND :end AND te.status = com.victor.timetrack.model.EntryStatus.APPROVED
            GROUP BY te.project.id, te.project.name, te.project.active
            ORDER BY SUM(te.hours) DESC, te.project.name ASC
            """)
    List<ProjectHoursReportResponse> getHoursByProject(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("""
            SELECT te.user.name AS userName, te.user.id AS userId, SUM(te.hours) AS totalHours, te.user.active AS active
            FROM TimeEntry te
            WHERE te.date BETWEEN :start AND :end AND te.status = com.victor.timetrack.model.EntryStatus.APPROVED
            GROUP BY te.user.id, te.user.name, te.user.active
            ORDER BY SUM(te.hours) DESC, te.user.name ASC
            """)
    List<UserHoursReportResponse> getHoursByUser(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
