package com.pulsetrack.controller;

import com.pulsetrack.model.Employee;
import com.pulsetrack.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private static final String DEFAULT_ROLE = "Employee";
    private static final String DEFAULT_DEPARTMENT = "General";
    private static final String DEFAULT_AVATAR = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80";

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public List<Employee> getAllEmployees(@RequestParam(required = false) String department) {
        if (department != null && !department.equalsIgnoreCase("All")) {
            return employeeRepository.findByDepartment(department);
        }
        return employeeRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Map<String, Object> payload) {
        String name = extractString(payload, "name");
        String email = extractString(payload, "email").toLowerCase(Locale.ROOT);
        String password = extractString(payload, "password");
        String role = extractString(payload, "role", DEFAULT_ROLE);
        String department = extractString(payload, "department", DEFAULT_DEPARTMENT);

        if (name.isBlank() || email.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        if (employeeRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Employee employee = new Employee(
                "EMP-" + System.currentTimeMillis(),
                name,
                email,
                password,
                role,
                department,
                DEFAULT_AVATAR,
                "active",
                "Workstation Laptop",
                "Windows 11",
                "10.0.0.24",
                "Remote",
                "09:00",
                "17:00",
                "09:12",
                null,
                21600,
                1200,
                600,
                84,
                "Just now",
                32,
                56,
                49,
                88,
                true,
                true,
                12500,
                5100,
                "PulseTrack",
                "Team Dashboard"
        );

        return ResponseEntity.ok(employeeRepository.save(employee));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable String id) {
        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable String id, @RequestBody Map<String, Object> payload) {
        return employeeRepository.findById(id)
                .map(employee -> {
                    String email = extractString(payload, "email").toLowerCase(Locale.ROOT);
                    if (email.isBlank() || extractString(payload, "name").isBlank()) {
                        return ResponseEntity.badRequest().<Employee>build();
                    }

                    if (!email.equalsIgnoreCase(employee.getEmail())
                            && employeeRepository.findByEmail(email).isPresent()) {
                        return ResponseEntity.status(HttpStatus.CONFLICT).<Employee>build();
                    }

                    employee.setName(extractString(payload, "name"));
                    employee.setEmail(email);
                    employee.setRole(extractString(payload, "role", DEFAULT_ROLE));
                    employee.setDepartment(extractString(payload, "department", DEFAULT_DEPARTMENT));

                    String password = extractString(payload, "password");
                    if (!password.isBlank()) {
                        employee.setPassword(password);
                    }

                    return ResponseEntity.ok(employeeRepository.save(employee));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String id) {
        if (!employeeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        employeeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Employee> updateStatus(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        return employeeRepository.findById(id)
                .map(employee -> {
                    if (updates.containsKey("status")) {
                        employee.setStatus(String.valueOf(updates.get("status")));
                    }
                    if (updates.containsKey("online")) {
                        boolean online = Boolean.parseBoolean(String.valueOf(updates.get("online")));
                        employee.setOnline(online);
                        employee.setStatus(online ? "active" : "offline");
                        employee.setLastActivity(online ? "Just now" : "Offline");
                    }
                    if (updates.containsKey("clockIn")) {
                        employee.setClockIn(String.valueOf(updates.get("clockIn")));
                    }
                    if (updates.containsKey("clockOut")) {
                        employee.setClockOut(String.valueOf(updates.get("clockOut")));
                    }
                    return ResponseEntity.ok(employeeRepository.save(employee));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private String extractString(Map<String, Object> payload, String key) {
        return payload.get(key) == null ? "" : payload.get(key).toString().trim();
    }

    private String extractString(Map<String, Object> payload, String key, String defaultValue) {
        String value = extractString(payload, key);
        return value.isBlank() ? defaultValue : value;
    }
}
