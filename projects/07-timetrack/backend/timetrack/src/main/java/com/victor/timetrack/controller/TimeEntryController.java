package com.victor.timetrack.controller;

import com.victor.timetrack.dto.request.CreateTimeEntryRequest;
import com.victor.timetrack.dto.response.TimeEntryResponse;
import com.victor.timetrack.service.TimeEntryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/entries")
public class TimeEntryController {
    private final TimeEntryService timeEntryService;

    public TimeEntryController(TimeEntryService timeEntryService){
        this.timeEntryService = timeEntryService;
    }

    @PostMapping
    public ResponseEntity<TimeEntryResponse> create(@RequestBody CreateTimeEntryRequest request){
        return ResponseEntity.status(201).body(timeEntryService.create(request));
    }

    @PatchMapping("/{id}/submit")
    public ResponseEntity<TimeEntryResponse> submit(@PathVariable Long id){
        return ResponseEntity.status(200).body(timeEntryService.submit(id));
    }

}
