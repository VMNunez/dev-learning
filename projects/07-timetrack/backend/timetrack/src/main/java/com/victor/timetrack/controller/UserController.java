package com.victor.timetrack.controller;

import com.victor.timetrack.dto.request.CreateUserRequest;
import com.victor.timetrack.dto.request.UpdateUserRequest;
import com.victor.timetrack.dto.response.UserResponse;
import com.victor.timetrack.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAll(){
        return ResponseEntity.status(200).body(userService.getAll());
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest request){
        return ResponseEntity.status(201).body(userService.create(request));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request){
        return ResponseEntity.status(200).body(userService.update(id,request));
    }

}
