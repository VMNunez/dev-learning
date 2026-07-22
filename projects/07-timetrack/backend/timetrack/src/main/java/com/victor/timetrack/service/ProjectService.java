package com.victor.timetrack.service;

import com.victor.timetrack.dto.request.CreateProjectRequest;
import com.victor.timetrack.dto.request.UpdateProjectRequest;
import com.victor.timetrack.dto.response.ProjectResponse;
import com.victor.timetrack.exception.ResourceNotFoundException;
import com.victor.timetrack.model.Project;
import com.victor.timetrack.repository.ProjectRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectResponse> getAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean isManager = Objects.requireNonNull(auth).getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_MANAGER"));


        return isManager
                ? projectRepository.findAll().stream().map(this::toResponse).toList()
                : projectRepository.findByActiveTrue().stream().map(this::toResponse).toList();

    }

    public ProjectResponse getById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean isManager = Objects.requireNonNull(auth).getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_MANAGER"));


        if (!isManager && !project.getActive()) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }

        return toResponse(project);

    }

    public ProjectResponse create(CreateProjectRequest request) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project saved = projectRepository.save(project);

        return toResponse(saved);
    }

    public ProjectResponse update(Long id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project saved = projectRepository.save(project);

        return toResponse(saved);
    }

    public void delete(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        project.setActive(false);
        projectRepository.save(project);
    }

    private ProjectResponse toResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        response.setActive(project.getActive());
        response.setCreatedAt(project.getCreatedAt());
        return response;
    }
}
