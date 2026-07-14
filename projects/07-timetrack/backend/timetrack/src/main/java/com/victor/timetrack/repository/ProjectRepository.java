package com.victor.timetrack.repository;

import com.victor.timetrack.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project,Long> {
    List<Project> findByActiveTrue();
}
