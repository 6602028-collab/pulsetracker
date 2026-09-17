package com.pulsetrack.controller;

import com.pulsetrack.dto.AuthResponse;
import com.pulsetrack.dto.LoginRequest;
import com.pulsetrack.dto.ResetPasswordRequest;
import com.pulsetrack.model.Employee;
import com.pulsetrack.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String ADMIN_EMAIL = "admin@pulsetrack.com";
    private static final String ADMIN_ROLE = "admin";
    private static final String EMPLOYER_ROLE = "employer";
    private static final String INVALID_PASSWORD_MESSAGE = "Incorrect password. Please try again.";

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminPasswordHash;
    private final String devAdminPassword;

    public AuthController(EmployeeRepository employeeRepository,
                          PasswordEncoder passwordEncoder,
                          @Value("${pulsetrack.admin.password-hash:}") String adminPasswordHash,
                          @Value("${pulsetrack.admin.password:}") String devAdminPassword) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminPasswordHash = adminPasswordHash == null ? "" : adminPasswordHash;
        this.devAdminPassword = devAdminPassword == null ? "" : devAdminPassword;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        if (request == null || isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            return ResponseEntity.badRequest().body(AuthResponse.fail("Email and password are required."));
        }

        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        String password = request.getPassword();
        String requestedRole = request.getRole() == null ? null : request.getRole().trim().toLowerCase(Locale.ROOT);

        if (ADMIN_EMAIL.equals(email)) {
            return handleAdminLogin(password, requestedRole);
        }

        return handleEmployeeLogin(email, password, requestedRole);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request == null || isBlank(request.getEmail()) || isBlank(request.getRole()) || isBlank(request.getNewPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email, role, and new password are required."));
        }

        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        String role = request.getRole().trim().toLowerCase(Locale.ROOT);
        String newPassword = request.getNewPassword();

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters."));
        }

        if (ADMIN_ROLE.equals(role)) {
            if (!ADMIN_EMAIL.equals(email) || adminPasswordHash.isBlank()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "No admin account found with this email."));
            }
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                    .body(Map.of("error", "Password reset requires a verified reset token."));
        }

        if (!EMPLOYER_ROLE.equals(role)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Role must be admin or employer."));
        }

        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body(Map.of("error", "Password reset requires a verified reset token."));
    }

    private ResponseEntity<AuthResponse> handleAdminLogin(String password, String requestedRole) {
        boolean validPassword = !adminPasswordHash.isBlank()
            ? passwordEncoder.matches(password, adminPasswordHash)
            : !devAdminPassword.isBlank() && devAdminPassword.equals(password);
        if (!validPassword) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.fail(INVALID_PASSWORD_MESSAGE));
        }

        String role = ADMIN_ROLE;
        if (requestedRole != null && !role.equalsIgnoreCase(requestedRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(AuthResponse.fail(
                    "This account is registered as " + role + ", not " + requestedRole + "."
            ));
        }

        Map<String, Object> user = Map.of(
            "id", "admin-001",
            "name", "Admin Console",
            "email", ADMIN_EMAIL,
            "role", ADMIN_ROLE,
            "department", "Operations",
            "employeeId", "ADM-001"
        );
        return ResponseEntity.ok(AuthResponse.ok("jwt_token_admin_" + System.currentTimeMillis(), user));
    }

    private ResponseEntity<AuthResponse> handleEmployeeLogin(String email, String password, String requestedRole) {
        Employee employee = employeeRepository.findByEmail(email).orElse(null);
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.fail("No account found with this email address."));
        }

        if (employee.getPassword() == null || !passwordEncoder.matches(password, employee.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.fail(INVALID_PASSWORD_MESSAGE));
        }

        if (requestedRole != null && !EMPLOYER_ROLE.equalsIgnoreCase(requestedRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(AuthResponse.fail(
                    "This account is registered as employer, not " + requestedRole + "."
            ));
        }

        Map<String, Object> user = new HashMap<>();
        user.put("id", employee.getId());
        user.put("name", employee.getName());
        user.put("email", employee.getEmail());
        user.put("role", EMPLOYER_ROLE);
        user.put("avatar", employee.getAvatar());
        user.put("department", employee.getDepartment());
        user.put("employeeId", employee.getId());

        return ResponseEntity.ok(AuthResponse.ok("jwt_token_employer_" + System.currentTimeMillis(), user));
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
