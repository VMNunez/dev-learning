package com.victor.timetrack.repository;

import com.victor.timetrack.model.EntryStatus;
import com.victor.timetrack.model.TimeEntry;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;


public class TimeEntrySpecifications {
    public static Specification<TimeEntry> hasUserId(Long userId) {
        return ((root, query, criteriaBuilder) ->
                userId == null ?
                        criteriaBuilder.conjunction() :
                        criteriaBuilder.equal(root.get("user").get("id"), userId));
    }

    public static Specification<TimeEntry> hasProjectId(Long projectId) {
        return ((root, query, criteriaBuilder) ->
                projectId == null ?
                        criteriaBuilder.conjunction() :
                        criteriaBuilder.equal(root.get("project").get("id"), projectId));
    }

    public static Specification<TimeEntry> hasStatus(EntryStatus status) {
        return ((root, query, criteriaBuilder) ->
                status == null ?
                        criteriaBuilder.conjunction() :
                        criteriaBuilder.equal(root.get("status"), status));
    }

    public static Specification<TimeEntry> dateBetween(LocalDate start, LocalDate end){
        return ((root, query, criteriaBuilder) ->
                (start == null || end == null)?
                        criteriaBuilder.conjunction():
                        criteriaBuilder.between(root.get("date"),start,end));
    }
}
