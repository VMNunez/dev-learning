package com.victor.timetrack.service;

import com.victor.timetrack.dto.request.CreateProjectRequest;
import com.victor.timetrack.dto.request.UpdateProjectRequest;
import com.victor.timetrack.dto.response.ProjectResponse;
import com.victor.timetrack.model.Project;
import com.victor.timetrack.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectResponse> getAll() {
        return projectRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProjectResponse getById(Long id) {
        return projectRepository.findById(id).map(this::toResponse).orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

    }

    public ProjectResponse create(CreateProjectRequest request) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project saved = projectRepository.save(project);

        return toResponse(saved);
    }

    public ProjectResponse update(Long id,UpdateProjectRequest request){
        Project project = projectRepository.findById(id).orElseThrow(()-> new RuntimeException("Project not found with id: "+ id));
        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project saved = projectRepository.save(project);

        return toResponse(saved);
    }

    public void delete(Long id){
        Project project = projectRepository.findById(id).orElseThrow(()-> new RuntimeException("Project not found with id: "+ id));
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
