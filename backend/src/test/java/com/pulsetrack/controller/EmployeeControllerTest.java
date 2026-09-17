package com.pulsetrack.controller;

import com.pulsetrack.model.Employee;
import com.pulsetrack.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeControllerTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeController employeeController;

    @Test
    void updateStatusSetsOnlineAndActiveState() {
        Employee employee = employee("EMP-001");
        when(employeeRepository.findById("EMP-001")).thenReturn(Optional.of(employee));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<Employee> response = employeeController.updateStatus(
                "EMP-001", Map.of("online", true));

        assertEquals(200, response.getStatusCode().value());
        assertTrue(employee.isOnline());
        assertEquals("active", employee.getStatus());
        assertEquals("Just now", employee.getLastActivity());
        verify(employeeRepository).save(employee);
    }

    @Test
    void updateStatusSetsOfflineState() {
        Employee employee = employee("EMP-001");
        when(employeeRepository.findById("EMP-001")).thenReturn(Optional.of(employee));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(invocation -> invocation.getArgument(0));

        employeeController.updateStatus("EMP-001", Map.of("online", false));

        assertFalse(employee.isOnline());
        assertEquals("offline", employee.getStatus());
        assertEquals("Offline", employee.getLastActivity());
    }

    @Test
    void updateStatusReturnsNotFoundForUnknownEmployee() {
        when(employeeRepository.findById(eq("missing"))).thenReturn(Optional.empty());

        ResponseEntity<Employee> response = employeeController.updateStatus("missing", Map.of("online", true));

        assertEquals(404, response.getStatusCode().value());
    }

    private Employee employee(String id) {
        Employee employee = new Employee();
        employee.setId(id);
        employee.setStatus("offline");
        employee.setOnline(false);
        return employee;
    }
}
