package com.pulsetrack.dto;

import java.util.Map;

public class AuthResponse {
    private boolean success;
    private String token;
    private Map<String, Object> user;
    private String error;

    public AuthResponse() {}

    public static AuthResponse ok(String token, Map<String, Object> user) {
        AuthResponse response = new AuthResponse();
        response.success = true;
        response.token = token;
        response.user = user;
        return response;
    }

    public static AuthResponse fail(String error) {
        AuthResponse response = new AuthResponse();
        response.success = false;
        response.error = error;
        return response;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Map<String, Object> getUser() { return user; }
    public void setUser(Map<String, Object> user) { this.user = user; }
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}
