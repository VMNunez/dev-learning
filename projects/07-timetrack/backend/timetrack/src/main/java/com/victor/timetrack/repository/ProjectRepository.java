package com.victor.timetrack.repository;

import com.victor.timetrack.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project,Long> {
}
