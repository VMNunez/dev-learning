package com.victor.timetrack.controller;

import com.victor.timetrack.dto.request.CreateProjectRequest;
import com.victor.timetrack.dto.request.UpdateProjectRequest;
import com.victor.timetrack.dto.response.ProjectResponse;
import com.victor.timetrack.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService){
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>>  getAll(){
        return ResponseEntity.ok(projectService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable Long id){
        return ResponseEntity.ok(projectService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> create(@RequestBody CreateProjectRequest request){
        return ResponseEntity.status(201).body(projectService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(@PathVariable Long id, @RequestBody UpdateProjectRequest request){
        return ResponseEntity.ok(projectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
