package com.pulsetrack.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    private String id;
    private String name;
    private String email;
    @JsonIgnore
    private String password;
    private String role;
    private String department;
    private String avatar;
    private String status;
    private String device;
    private String os;
    private String ip;
    private String location;
    private String shiftStart;
    private String shiftEnd;
    private String clockIn;
    private String clockOut;
    private long activeTimeSec;
    private long idleTimeSec;
    private long awayTimeSec;
    private int productivity;
    private String lastActivity;
    private int cpuUsage;
    private int ramUsage;
    private int diskUsage;
    private int battery;
    private boolean online;
    private boolean webcamVerified;
    private long keystrokes;
    private long mouseClicks;
    private String currentApp;
    private String currentWindow;

    public Employee() {}

    public Employee(String id, String name, String email, String role, String department, String avatar,
                    String status, String device, String os, String ip, String location, String shiftStart,
                    String shiftEnd, String clockIn, String clockOut, long activeTimeSec, long idleTimeSec,
                    long awayTimeSec, int productivity, String lastActivity, int cpuUsage, int ramUsage,
                    int diskUsage, int battery, boolean online, boolean webcamVerified, long keystrokes,
                    long mouseClicks, String currentApp, String currentWindow) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.department = department;
        this.avatar = avatar;
        this.status = status;
        this.device = device;
        this.os = os;
        this.ip = ip;
        this.location = location;
        this.shiftStart = shiftStart;
        this.shiftEnd = shiftEnd;
        this.clockIn = clockIn;
        this.clockOut = clockOut;
        this.activeTimeSec = activeTimeSec;
        this.idleTimeSec = idleTimeSec;
        this.awayTimeSec = awayTimeSec;
        this.productivity = productivity;
        this.lastActivity = lastActivity;
        this.cpuUsage = cpuUsage;
        this.ramUsage = ramUsage;
        this.diskUsage = diskUsage;
        this.battery = battery;
        this.online = online;
        this.webcamVerified = webcamVerified;
        this.keystrokes = keystrokes;
        this.mouseClicks = mouseClicks;
        this.currentApp = currentApp;
        this.currentWindow = currentWindow;
    }

    public Employee(String id, String name, String email, String password, String role, String department,
                    String avatar, String status, String device, String os, String ip, String location,
                    String shiftStart, String shiftEnd, String clockIn, String clockOut, long activeTimeSec,
                    long idleTimeSec, long awayTimeSec, int productivity, String lastActivity, int cpuUsage,
                    int ramUsage, int diskUsage, int battery, boolean online, boolean webcamVerified,
                    long keystrokes, long mouseClicks, String currentApp, String currentWindow) {
        this(id, name, email, role, department, avatar, status, device, os, ip, location, shiftStart,
                shiftEnd, clockIn, clockOut, activeTimeSec, idleTimeSec, awayTimeSec, productivity,
                lastActivity, cpuUsage, ramUsage, diskUsage, battery, online, webcamVerified,
                keystrokes, mouseClicks, currentApp, currentWindow);
        this.password = password;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDevice() { return device; }
    public void setDevice(String device) { this.device = device; }
    public String getOs() { return os; }
    public void setOs(String os) { this.os = os; }
    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getShiftStart() { return shiftStart; }
    public void setShiftStart(String shiftStart) { this.shiftStart = shiftStart; }
    public String getShiftEnd() { return shiftEnd; }
    public void setShiftEnd(String shiftEnd) { this.shiftEnd = shiftEnd; }
    public String getClockIn() { return clockIn; }
    public void setClockIn(String clockIn) { this.clockIn = clockIn; }
    public String getClockOut() { return clockOut; }
    public void setClockOut(String clockOut) { this.clockOut = clockOut; }
    public long getActiveTimeSec() { return activeTimeSec; }
    public void setActiveTimeSec(long activeTimeSec) { this.activeTimeSec = activeTimeSec; }
    public long getIdleTimeSec() { return idleTimeSec; }
    public void setIdleTimeSec(long idleTimeSec) { this.idleTimeSec = idleTimeSec; }
    public long getAwayTimeSec() { return awayTimeSec; }
    public void setAwayTimeSec(long awayTimeSec) { this.awayTimeSec = awayTimeSec; }
    public int getProductivity() { return productivity; }
    public void setProductivity(int productivity) { this.productivity = productivity; }
    public String getLastActivity() { return lastActivity; }
    public void setLastActivity(String lastActivity) { this.lastActivity = lastActivity; }
    public int getCpuUsage() { return cpuUsage; }
    public void setCpuUsage(int cpuUsage) { this.cpuUsage = cpuUsage; }
    public int getRamUsage() { return ramUsage; }
    public void setRamUsage(int ramUsage) { this.ramUsage = ramUsage; }
    public int getDiskUsage() { return diskUsage; }
    public void setDiskUsage(int diskUsage) { this.diskUsage = diskUsage; }
    public int getBattery() { return battery; }
    public void setBattery(int battery) { this.battery = battery; }
    public boolean isOnline() { return online; }
    public void setOnline(boolean online) { this.online = online; }
    public boolean isWebcamVerified() { return webcamVerified; }
    public void setWebcamVerified(boolean webcamVerified) { this.webcamVerified = webcamVerified; }
    public long getKeystrokes() { return keystrokes; }
    public void setKeystrokes(long keystrokes) { this.keystrokes = keystrokes; }
    public long getMouseClicks() { return mouseClicks; }
    public void setMouseClicks(long mouseClicks) { this.mouseClicks = mouseClicks; }
    public String getCurrentApp() { return currentApp; }
    public void setCurrentApp(String currentApp) { this.currentApp = currentApp; }
    public String getCurrentWindow() { return currentWindow; }
    public void setCurrentWindow(String currentWindow) { this.currentWindow = currentWindow; }
}
