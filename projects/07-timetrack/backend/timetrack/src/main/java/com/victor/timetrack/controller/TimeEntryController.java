package com.victor.timetrack.controller;

import com.victor.timetrack.dto.request.CreateTimeEntryRequest;
import com.victor.timetrack.dto.request.RejectRequest;
import com.victor.timetrack.dto.response.TimeEntryResponse;
import com.victor.timetrack.service.TimeEntryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entries")
public class TimeEntryController {
    private final TimeEntryService timeEntryService;

    public TimeEntryController(TimeEntryService timeEntryService) {
        this.timeEntryService = timeEntryService;
    }

    @GetMapping
    public ResponseEntity<List<TimeEntryResponse>> getAll() {
        return ResponseEntity.status(200).body(timeEntryService.getAll());
    }

    @PostMapping
    public ResponseEntity<TimeEntryResponse> create(@Valid @RequestBody CreateTimeEntryRequest request) {
        return ResponseEntity.status(201).body(timeEntryService.create(request));
    }

    @PatchMapping("/{id}/submit")
    public ResponseEntity<TimeEntryResponse> submit(@PathVariable Long id) {
        return ResponseEntity.status(200).body(timeEntryService.submit(id));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PatchMapping("/{id}/approve")
    public ResponseEntity<TimeEntryResponse> approve(@PathVariable Long id) {
        return ResponseEntity.status(200).body(timeEntryService.approve(id));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PatchMapping("/{id}/reject")
    public ResponseEntity<TimeEntryResponse> reject(@PathVariable Long id, @Valid @RequestBody RejectRequest request) {
        return ResponseEntity.status(200).body(timeEntryService.reject(id, request.getRejectionNote()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeEntryResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody CreateTimeEntryRequest request) {
        return ResponseEntity.status(200).body(timeEntryService.update(id, request));
    }
}
