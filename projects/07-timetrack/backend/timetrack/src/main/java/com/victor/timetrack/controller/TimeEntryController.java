package com.victor.timetrack.controller;

import com.victor.timetrack.dto.request.CreateTimeEntryRequest;
import com.victor.timetrack.dto.request.RejectRequest;
import com.victor.timetrack.dto.response.TimeEntryResponse;
import com.victor.timetrack.model.EntryStatus;
import com.victor.timetrack.service.TimeEntryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/entries")
public class TimeEntryController {
    private final TimeEntryService timeEntryService;

    public TimeEntryController(TimeEntryService timeEntryService) {
        this.timeEntryService = timeEntryService;
    }

    @GetMapping
    public ResponseEntity<List<TimeEntryResponse>> findByFilter(@RequestParam(required = false) Long userId,
                                                                @RequestParam(required = false) Long projectId,
                                                                @RequestParam(required = false) EntryStatus status,
                                                                @RequestParam(required = false) YearMonth month) {
        return ResponseEntity.status(200).body(timeEntryService.findByFilter(userId, projectId, status, month));

    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping
    public ResponseEntity<TimeEntryResponse> create(@Valid @RequestBody CreateTimeEntryRequest request) {
        return ResponseEntity.status(201).body(timeEntryService.create(request));
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PatchMapping("/{id}/submit")
    public ResponseEntity<TimeEntryResponse> submit(@PathVariable Long id) {
        return ResponseEntity.status(200).body(timeEntryService.submit(id));
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PatchMapping("/{id}/reopen")
    public ResponseEntity<TimeEntryResponse> reopen(@PathVariable Long id){
        return ResponseEntity.status(200).body(timeEntryService.reopen(id));
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

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/{id}")
    public ResponseEntity<TimeEntryResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody CreateTimeEntryRequest request) {
        return ResponseEntity.status(200).body(timeEntryService.update(id, request));
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        timeEntryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
