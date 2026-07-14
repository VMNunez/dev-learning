package com.victor.timetrack.repository;

import com.victor.timetrack.model.TimeEntry;
import com.victor.timetrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimeEntryRepository extends JpaRepository<TimeEntry,Long> {
    List<TimeEntry> findByUser(User user);
}
