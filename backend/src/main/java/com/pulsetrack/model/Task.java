package com.pulsetrack.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    private String id;
    private String title;
    private String project;
    private String priority;
    private String status;
    private String dueDate;
    private String assignedTo;
    private String assigneeName;
    private String assigneeAvatar;

    public Task() {}

    public Task(String id, String title, String project, String priority, String status,
                String dueDate, String assignedTo, String assigneeName, String assigneeAvatar) {
        this.id = id;
        this.title = title;
        this.project = project;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
        this.assignedTo = assignedTo;
        this.assigneeName = assigneeName;
        this.assigneeAvatar = assigneeAvatar;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getProject() { return project; }
    public void setProject(String project) { this.project = project; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
    public String getAssigneeName() { return assigneeName; }
    public void setAssigneeName(String assigneeName) { this.assigneeName = assigneeName; }
    public String getAssigneeAvatar() { return assigneeAvatar; }
    public void setAssigneeAvatar(String assigneeAvatar) { this.assigneeAvatar = assigneeAvatar; }
}
