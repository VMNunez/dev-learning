package com.victor.timetrack.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false,unique = true)
    private String name;

    private String description;
    private Boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

}
