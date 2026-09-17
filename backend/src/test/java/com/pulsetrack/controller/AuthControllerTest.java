package com.pulsetrack.controller;

import com.pulsetrack.dto.AuthResponse;
import com.pulsetrack.dto.LoginRequest;
import com.pulsetrack.model.Employee;
import com.pulsetrack.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    @Mock
    private EmployeeRepository employeeRepository;

    private AuthController authController;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        authController = new AuthController(employeeRepository, passwordEncoder,
            passwordEncoder.encode("admin123"), "");
    }

    @Test
    void adminLoginReturnsTokenAndUser() {
        ResponseEntity<AuthResponse> response = authController.login(
                new LoginRequest(" admin@pulsetrack.com ", "admin123", "ADMIN"));
        AuthResponse body = response.getBody();
        assertNotNull(body);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(body.isSuccess());
        assertEquals("admin", body.getUser().get("role"));
        assertTrue(body.getToken().startsWith("jwt_token_admin_"));
    }

    @Test
    void adminLoginRejectsIncorrectPassword() {
        ResponseEntity<AuthResponse> response = authController.login(
                new LoginRequest("admin@pulsetrack.com", "wrong", "admin"));
        AuthResponse body = response.getBody();
        assertNotNull(body);

        assertEquals(401, response.getStatusCode().value());
        assertEquals("Incorrect password. Please try again.", body.getError());
    }

    @Test
    void loginRejectsRoleMismatch() {
        ResponseEntity<AuthResponse> response = authController.login(
                new LoginRequest("admin@pulsetrack.com", "admin123", "employer"));
        AuthResponse body = response.getBody();
        assertNotNull(body);

        assertEquals(403, response.getStatusCode().value());
        assertTrue(body.getError().contains("registered as admin"));
    }

    @Test
    void employeeLoginReturnsEmployerUser() {
        Employee employee = employee("EMP-001", "employee@acme.io", "secret");
        when(employeeRepository.findByEmail("employee@acme.io")).thenReturn(Optional.of(employee));

        ResponseEntity<AuthResponse> response = authController.login(
                new LoginRequest("employee@acme.io", "secret", "employer"));
        AuthResponse body = response.getBody();
        assertNotNull(body);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("employer", body.getUser().get("role"));
        assertEquals("EMP-001", body.getUser().get("employeeId"));
    }

    @Test
    void loginRejectsMissingCredentials() {
        ResponseEntity<AuthResponse> response = authController.login(new LoginRequest(null, null, null));
        AuthResponse body = response.getBody();
        assertNotNull(body);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Email and password are required.", body.getError());
    }

    private Employee employee(String id, String email, String password) {
        Employee employee = new Employee();
        employee.setId(id);
        employee.setEmail(email);
        employee.setPassword(passwordEncoder.encode(password));
        employee.setName("Test Employee");
        employee.setDepartment("Engineering");
        employee.setRole("Engineer");
        employee.setAvatar("/avatar.png");
        return employee;
    }
}
