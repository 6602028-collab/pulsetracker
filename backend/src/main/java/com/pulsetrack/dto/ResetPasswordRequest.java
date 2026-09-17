package com.pulsetrack.dto;

public class ResetPasswordRequest {
    private String email;
    private String role;
    private String newPassword;

    public ResetPasswordRequest() {}

    public ResetPasswordRequest(String email, String role, String newPassword) {
        this.email = email;
        this.role = role;
        this.newPassword = newPassword;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
