package com.victor.timetrack.controller;

import com.victor.timetrack.dto.request.CreateTimeEntryRequest;
import com.victor.timetrack.dto.response.TimeEntryResponse;
import com.victor.timetrack.service.TimeEntryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
