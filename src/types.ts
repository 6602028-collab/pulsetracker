export type UserRole = 'admin' | 'employer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  employeeId?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  department: string;
  avatar: string;
  status: 'active' | 'meeting' | 'idle' | 'away' | 'offline';
  device: string;
  os: string;
  ip: string;
  location: string;
  shiftStart: string;
  shiftEnd: string;
  clockIn: string | null;
  clockOut: string | null;
  activeTimeSec: number;
  idleTimeSec: number;
  awayTimeSec: number;
  productivity: number;
  lastActivity: string;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  battery: number;
  online: boolean;
  webcamVerified: boolean;
  keystrokes: number;
  mouseClicks: number;
  currentApp?: string;
  currentWindow?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  project: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
  assignedTo: string;
  assigneeName: string;
  assigneeAvatar: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  department: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
  dueDate: string;
  teamSize: number;
  leadName: string;
}

export interface AttendanceDay {
  date: string;
  dayOfWeek: string;
  status: 'present' | 'remote' | 'late' | 'leave' | 'weekend';
  clockIn?: string;
  clockOut?: string;
  duration?: string;
}

export interface MeetingItem {
  id: string;
  title: string;
  time: string;
  duration: string;
  attendees: string[];
  status: 'scheduled' | 'live' | 'completed';
  link: string;
}
