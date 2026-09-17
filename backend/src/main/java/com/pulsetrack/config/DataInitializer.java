package com.pulsetrack.config;

import com.pulsetrack.model.Employee;
import com.pulsetrack.model.Task;
import com.pulsetrack.repository.EmployeeRepository;
import com.pulsetrack.repository.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
@Profile("dev")
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(EmployeeRepository empRepo, TaskRepository taskRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            if (empRepo.count() > 0 || taskRepo.count() > 0) {
                return;
            }

            List<Employee> employees = List.of(
                new Employee(
                    "EMP-001", "Sarah Chen", "sarah.chen@acme.io", "Senior Frontend Engineer", "Engineering",
                    "/avatars/emp1.jpg", "active", "MacBook Pro 16\"", "macOS Sonoma 14.4", "192.168.1.42",
                    "Austin, TX", "09:00", "17:00", "08:52", null, 24300, 1800, 600, 87, "1 min ago",
                    34, 62, 71, 78, true, true, 18420, 8240, "VS Code", "App.tsx — PulseTrack"
                ),
                new Employee(
                    "EMP-002", "Marcus Johnson", "marcus.j@acme.io", "Financial Analyst", "Finance",
                    "/avatars/emp2.jpg", "meeting", "Dell Latitude 7440", "Windows 11 Pro", "10.0.4.118",
                    "Denver, CO", "08:30", "17:00", "08:24", null, 26100, 2100, 1200, 76, "3 mins ago",
                    52, 71, 64, 45, true, true, 12100, 6420, "Microsoft Teams", "Q3 Financial Review Call"
                ),
                new Employee(
                    "EMP-003", "Priya Patel", "priya.patel@acme.io", "UX Designer", "Design",
                    "/avatars/emp3.jpg", "active", "MacBook Air 15\"", "macOS Ventura 13.6", "172.16.8.22",
                    "Seattle, WA", "09:00", "17:00", "09:05", null, 22400, 1500, 900, 92, "Just now",
                    28, 54, 48, 91, true, true, 14200, 11200, "Figma", "PulseTrack Mobile Mockups — v2.4"
                ),
                new Employee(
                    "EMP-004", "David Kim", "david.kim@acme.io", "Backend Architect", "Engineering",
                    "/avatars/emp4.jpg", "active", "ThinkPad X1 Carbon", "Ubuntu 22.04 LTS", "192.168.2.15",
                    "San Francisco, CA", "09:30", "17:30", "09:18", null, 21800, 900, 300, 94, "Just now",
                    68, 79, 82, 100, true, true, 22100, 4100, "Terminal", "nvim src/services/telemetry.go"
                ),
                new Employee(
                    "EMP-005", "Elena Rodriguez", "elena.r@acme.io", "DevOps Specialist", "Engineering",
                    "/avatars/emp5.jpg", "idle", "MacBook Pro 14\"", "macOS Sonoma 14.3", "192.168.1.99",
                    "Miami, FL", "09:00", "17:00", "08:45", null, 19400, 3600, 1800, 78, "12 mins ago",
                    19, 45, 53, 64, true, true, 8900, 3200, "Google Chrome", "AWS Console — CloudWatch Alarms"
                ),
                new Employee(
                    "EMP-006", "James Wilson", "james.w@acme.io", "Product Manager", "Product",
                    "/avatars/emp6.jpg", "away", "Surface Laptop 5", "Windows 11", "10.0.1.55",
                    "Chicago, IL", "08:30", "16:30", "08:29", null, 18200, 4200, 2400, 72, "24 mins ago",
                    15, 40, 35, 88, true, false, 9100, 5200, "Slack", "#product-roadmap-2026"
                ),
                new Employee(
                    "EMP-007", "Aisha Mohammed", "aisha.m@acme.io", "QA Engineer", "Engineering",
                    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                    "offline", "MacBook Pro 13\"", "macOS Monterey 12.7", "192.168.3.10",
                    "Boston, MA", "09:00", "17:00", "09:01", "17:02", 28800, 1200, 600, 89, "2 hrs ago",
                    0, 0, 60, 100, false, false, 15400, 7800, "Offline", "Shift Completed"
                ),
                new Employee(
                    "EMP-008", "Thomas Müller", "thomas.m@acme.io", "Security Analyst", "Security",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                    "active", "ThinkPad T14", "Fedora Linux 39", "10.0.8.91",
                    "New York, NY", "10:00", "18:00", "09:55", null, 19500, 800, 400, 96, "Just now",
                    45, 66, 58, 95, true, true, 19800, 3900, "Wireshark", "Live Endpoint Monitoring Packet Log"
                )
            );
            employees.forEach(employee -> employee.setPassword(passwordEncoder.encode("dev-only-change-me")));
            empRepo.saveAll(employees);

            taskRepo.saveAll(List.of(
                new Task("task-1", "Migrate state management to unified signals", "PulseTrack Web Core", "high", "in-progress", "Today, 5:00 PM", "EMP-001", "Sarah Chen", "/avatars/emp1.jpg"),
                new Task("task-2", "Refactor telemetry websocket client reconnection", "PulseTrack Agent", "high", "in-progress", "Tomorrow", "EMP-004", "David Kim", "/avatars/emp4.jpg"),
                new Task("task-3", "Design high-density employee activity timeline", "PulseTrack Design System", "medium", "in-progress", "Sep 14", "EMP-003", "Priya Patel", "/avatars/emp3.jpg"),
                new Task("task-4", "Conduct weekly financial runway reconciliation", "Q3 Financial Audit", "medium", "done", "Sep 10", "EMP-002", "Marcus Johnson", "/avatars/emp2.jpg"),
                new Task("task-5", "Automate container image vulnerability scanning", "Security & Compliance", "high", "todo", "Sep 16", "EMP-008", "Thomas Müller", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80")
            ));
        };
    }
}
