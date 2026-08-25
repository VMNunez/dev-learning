package com.victor.timetrack.service;

import com.victor.timetrack.dto.request.CreateProjectRequest;
import com.victor.timetrack.dto.request.UpdateProjectRequest;
import com.victor.timetrack.dto.response.ProjectResponse;
import com.victor.timetrack.exception.DuplicateResourceException;
import com.victor.timetrack.exception.ResourceNotFoundException;
import com.victor.timetrack.model.Project;
import com.victor.timetrack.repository.ProjectRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;
    private static final Sort NAME_ASC = Sort.by("name").ascending();

    public ProjectService(ProjectRepository projectRepository, AuthenticatedUserProvider authenticatedUserProvider) {
        this.projectRepository = projectRepository;
        this.authenticatedUserProvider = authenticatedUserProvider;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAll() {
        boolean isManager = authenticatedUserProvider.isManager();

        return isManager
                ? projectRepository.findAll(NAME_ASC).stream().map(this::toResponse).toList()
                : projectRepository.findByActiveTrue(NAME_ASC).stream().map(this::toResponse).toList();

    }

    @Transactional(readOnly = true)
    public ProjectResponse getById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        boolean isManager = authenticatedUserProvider.isManager();

        if (!isManager && !project.isActive()) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }

        return toResponse(project);

    }

    @Transactional
    public ProjectResponse create(CreateProjectRequest request) {
        String name = request.getName().trim();
        if (projectRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateResourceException("name", "A project with this name already exists");
        }

        Project project = new Project();
        project.setName(name);
        project.setDescription(request.getDescription());

        Project saved = projectRepository.saveAndFlush(project);

        return toResponse(saved);
    }

    @Transactional
    public ProjectResponse update(Long id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        String name = request.getName().trim();

        if (request.getActive() != null) {
            project.setActive(request.getActive());
        }

        if (!project.getName().equalsIgnoreCase(name)
                && projectRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateResourceException("name", "A project with this name already exists");
        }

        project.setName(name);
        project.setDescription(request.getDescription());

        Project saved = projectRepository.save(project);

        return toResponse(saved);
    }

    @Transactional
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
        response.setActive(project.isActive());
        response.setCreatedAt(project.getCreatedAt());
        return response;
    }
}
