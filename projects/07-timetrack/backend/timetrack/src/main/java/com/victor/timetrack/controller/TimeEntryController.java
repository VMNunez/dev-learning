package com.victor.timetrack.controller;

import com.victor.timetrack.dto.request.CreateTimeEntryRequest;
import com.victor.timetrack.dto.request.RejectRequest;
import com.victor.timetrack.dto.request.UpdateTimeEntryRequest;
import com.victor.timetrack.dto.response.TimeEntryResponse;
import com.victor.timetrack.exception.BusinessRuleViolationException;
import com.victor.timetrack.model.EntryStatus;
import com.victor.timetrack.service.TimeEntryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;

@RestController
@RequestMapping("/api/entries")
public class TimeEntryController {
    private final TimeEntryService timeEntryService;

    public TimeEntryController(TimeEntryService timeEntryService) {
        this.timeEntryService = timeEntryService;
    }

    // The public sort keys and the entity path each one orders by. A key is a name in the API contract,
    // never a path the client composes: `employee` orders by `user.name`, while `user.name` itself — and
    // with it `user.password` — is refused like any other unknown key.
    private static final Map<String, String> SORT_KEYS = Map.of(
            "date", "date",
            "hours", "hours",
            "status", "status",
            "id", "id",
            "employee", "user.name",
            "project", "project.name");

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<Page<TimeEntryResponse>> findByFilter(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) EntryStatus status,
            @RequestParam(required = false) YearMonth month,
            @PageableDefault(size = 20, sort = {"date", "id"},
                    direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Pageable resolved = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                withIdTiebreaker(toEntitySort(pageable.getSort())));
        return ResponseEntity.ok(timeEntryService.findByFilter(userId, projectId, status, month, resolved));
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping
    public ResponseEntity<TimeEntryResponse> create(@Valid @RequestBody CreateTimeEntryRequest request) {
        TimeEntryResponse created = timeEntryService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PatchMapping("/{id}/submit")
    public ResponseEntity<TimeEntryResponse> submit(@PathVariable Long id) {
        return ResponseEntity.ok(timeEntryService.submit(id));
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PatchMapping("/{id}/reopen")
    public ResponseEntity<TimeEntryResponse> reopen(@PathVariable Long id) {
        return ResponseEntity.ok(timeEntryService.reopen(id));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PatchMapping("/{id}/approve")
    public ResponseEntity<TimeEntryResponse> approve(@PathVariable Long id) {
        return ResponseEntity.ok(timeEntryService.approve(id));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PatchMapping("/{id}/reject")
    public ResponseEntity<TimeEntryResponse> reject(@PathVariable Long id, @Valid @RequestBody RejectRequest request) {
        return ResponseEntity.ok(timeEntryService.reject(id, request.getRejectionNote()));
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/{id}")
    public ResponseEntity<TimeEntryResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody UpdateTimeEntryRequest request) {
        return ResponseEntity.ok(timeEntryService.update(id, request));
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        timeEntryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Sort toEntitySort(Sort sort) {
        List<Sort.Order> orders = new ArrayList<>();
        for (Sort.Order order : sort) {
            String path = SORT_KEYS.get(order.getProperty());
            if (path == null) {
                throw new BusinessRuleViolationException(
                        "Invalid sort property '" + order.getProperty()
                                + "'. Allowed: " + String.join(", ", new TreeSet<>(SORT_KEYS.keySet())));
            }
            orders.add(order.withProperty(path));
        }
        return Sort.by(orders);
    }

    private Sort withIdTiebreaker(Sort sort) {
        if (sort.getOrderFor("id") != null) {
            return sort;
        }
        return sort.and(Sort.by(Sort.Order.desc("id")));
    }

}
