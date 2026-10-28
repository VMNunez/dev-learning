package com.victor.timetrack.service;

import com.victor.timetrack.dto.request.CreateProjectRequest;
import com.victor.timetrack.dto.response.ProjectResponse;
import com.victor.timetrack.model.Project;
import com.victor.timetrack.repository.ProjectRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {
    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private AuthenticatedUserProvider authenticatedUserProvider;

    @InjectMocks
    private ProjectService projectService;

    @Test
    void create_savesTheProjectWithATrimmedName() {
        CreateProjectRequest request = new CreateProjectRequest();
        request.setName(" Website redesign ");
        request.setDescription("Corporate site rebuild");

        when(projectRepository.existsByNameIgnoreCase("Website redesign")).thenReturn(false);
        when(projectRepository.saveAndFlush(any(Project.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ProjectResponse response = projectService.create(request);

        assertThat(response.getName()).isEqualTo("Website redesign");
        assertThat(response.getDescription()).isEqualTo("Corporate site rebuild");
        assertThat(response.isActive()).isTrue();
    }
}
