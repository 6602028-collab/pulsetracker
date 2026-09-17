package com.pulsetrack.controller;

import com.pulsetrack.model.Task;
import com.pulsetrack.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public List<Task> getAllTasks(@RequestParam(required = false) String assignedTo) {
        if (assignedTo != null) {
            return taskRepository.findByAssignedTo(assignedTo);
        }
        return taskRepository.findAll();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Task> toggleTaskStatus(@PathVariable String id) {
        return taskRepository.findById(id).map(task -> {
            String nextStatus = "done".equalsIgnoreCase(task.getStatus()) ? "in-progress" : "done";
            task.setStatus(nextStatus);
            return ResponseEntity.ok(taskRepository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }
}
