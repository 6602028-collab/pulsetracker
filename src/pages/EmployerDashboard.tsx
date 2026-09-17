import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Video,
  Play,
  Pause,
  AlertCircle,
  TrendingUp,
  ExternalLink,
  Laptop,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { getStoredEmployees, updateEmployeeAvailability, useAuth } from '../lib/auth';
import { INITIAL_TASKS, INITIAL_MEETINGS, SARAH_ATTENDANCE } from '../data/mockData';
import { TaskItem } from '../types';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [availabilityBusy, setAvailabilityBusy] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [secondsActive, setSecondsActive] = useState(24350); // ~6h 45m

  useEffect(() => {
    let cancelled = false;

    const loadEmployeeStatus = async () => {
      if (!user?.employeeId) return;

      const employees = await getStoredEmployees();
      const employee = employees.find((item) => item.id === user.employeeId);
      if (!cancelled && employee) {
        setIsOnline(employee.online);
        setIsClockedIn(employee.online && employee.status !== 'offline');
      }
    };

    loadEmployeeStatus();
    return () => {
      cancelled = true;
    };
  }, [user?.employeeId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isClockedIn && isOnline) {
      interval = setInterval(() => {
        setSecondsActive((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, isOnline]);

  async function toggleAvailability() {
    if (!user?.employeeId || availabilityBusy) return;

    const nextOnline = !isOnline;
    setAvailabilityBusy(true);
    setAvailabilityError('');

    try {
      const updatedEmployee = await updateEmployeeAvailability(user.employeeId, nextOnline);
      setIsOnline(updatedEmployee.online);
      setIsClockedIn(updatedEmployee.online);
    } catch (error) {
      setAvailabilityError(error instanceof Error ? error.message : 'Unable to update availability.');
    } finally {
      setAvailabilityBusy(false);
    }
  }

  const hours = Math.floor(secondsActive / 3600);
  const minutes = Math.floor((secondsActive % 3600) / 60);
  const seconds = secondsActive % 60;

  function toggleTask(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'done' ? 'in-progress' : 'done' }
          : t
      )
    );
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  const myTasks = tasks.filter(
    (t) => t.assignedTo === user?.id || t.assignedTo === user?.employeeId
  );
  const displayTasks = myTasks.length > 0 ? myTasks : tasks.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, {firstName}!
          </h1>
          <p className="text-sm text-slate-400">
            {user?.department ?? 'Engineering'} · Employee ID: {user?.employeeId ?? 'EMP-001'} · Shift 09:00 - 17:00
          </p>
        </div>

        {/* Availability and shift controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOnline ? 'animate-ping bg-emerald-400' : 'bg-slate-500'
                }`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                }`}
              />
            </span>
            <span className="text-xs font-semibold text-white">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleAvailability}
            disabled={availabilityBusy || !user?.employeeId}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
              isOnline
                ? 'border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
            }`}
          >
            {isOnline ? <WifiOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
            {availabilityBusy ? 'Updating...' : isOnline ? 'Go Offline' : 'Go Online'}
          </button>

          <button
            type="button"
            onClick={() => setIsClockedIn(!isClockedIn)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
              isClockedIn
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            {isClockedIn ? (
              <>
                <Pause className="h-3.5 w-3.5" /> Pause / Break
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Resume Work
              </>
            )}
          </button>
        </div>
      </div>

      {availabilityError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
          <AlertCircle className="h-3.5 w-3.5" />
          {availabilityError}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Today's Logged Time
          </p>
          <p className="mt-1 text-2xl font-bold text-white font-mono tabular-nums">
            {hours}h {minutes.toString().padStart(2, '0')}m {seconds.toString().padStart(2, '0')}s
          </p>
          <p className="mt-1 text-xs text-slate-400">Clocked in at 08:52 AM</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Productivity Score
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-400 tabular-nums">87%</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <span>Top 10% in team</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Tasks Completed
          </p>
          <p className="mt-1 text-2xl font-bold text-white tabular-nums">
            {tasks.filter((t) => t.status === 'done').length}/{tasks.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">2 due by end of day</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Weekly Attendance
          </p>
          <p className="mt-1 text-2xl font-bold text-white tabular-nums">100%</p>
          <p className="mt-1 text-xs text-emerald-400">On time every day</p>
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: My Tasks & Meetings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tasks Widget */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">My Assigned Tasks</h2>
                <p className="text-xs text-slate-400">Click checkboxes to mark deliverables as finished</p>
              </div>
              <span className="rounded-full bg-cyan-500/10 text-cyan-400 px-2.5 py-1 text-xs font-medium">
                {displayTasks.filter((t) => t.status !== 'done').length} Pending
              </span>
            </div>

            <div className="space-y-2.5">
              {displayTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`flex items-start gap-3 rounded-lg border p-3 transition cursor-pointer ${
                    t.status === 'done'
                      ? 'border-slate-800/40 bg-slate-950/40 text-slate-500'
                      : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={t.status === 'done'}
                    onChange={() => {}}
                    className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-800 accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        t.status === 'done' ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      {t.title}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                      <span>{t.project}</span>
                      <span>·</span>
                      <span className="text-amber-400">{t.dueDate}</span>
                    </div>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      t.priority === 'high'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-cyan-500/10 text-cyan-400'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Meetings */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">Upcoming Video Syncs</h2>
                <p className="text-xs text-slate-400">Team standups, sprint reviews & 1-on-1s</p>
              </div>
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              {INITIAL_MEETINGS.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/80 p-3.5"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400 mt-0.5">
                      <Video className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{m.title}</p>
                      <p className="text-xs text-slate-400">{m.time} ({m.duration})</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        With: {m.attendees.join(', ')}
                      </p>
                    </div>
                  </div>

                  <a
                    href={m.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-400 hover:bg-cyan-500/20 transition"
                  >
                    Join
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Attendance History & Active Device Telemetry */}
        <div className="space-y-6">
          {/* Active Device Info */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <h2 className="text-base font-semibold text-white mb-1">Monitoring Telemetry</h2>
            <p className="text-xs text-slate-400 mb-4">Authenticated background device metrics</p>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Registered Machine</span>
                <span className="font-medium text-white">MacBook Pro 16" (M3 Max)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Operating System</span>
                <span className="font-medium text-white">macOS Sonoma 14.4</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Webcam Verification</span>
                <span className="font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Agent Status</span>
                <span className={`font-medium ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isOnline ? 'Online & Syncing' : 'Offline'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Keystroke Activity</span>
                <span className="font-medium text-cyan-400">18,420 events logged</span>
              </div>
            </div>
          </div>

          {/* Attendance Log */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <h2 className="text-base font-semibold text-white mb-1">Recent Timesheet</h2>
            <p className="text-xs text-slate-400 mb-4">Past shifts and remote clock-in logs</p>

            <div className="space-y-2.5">
              {SARAH_ATTENDANCE.map((day) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/60 last:border-0"
                >
                  <div>
                    <span className="font-semibold text-slate-200">{day.date}</span>
                    <span className="text-slate-500 ml-1.5">({day.dayOfWeek})</span>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-300 font-medium">{day.duration}</p>
                    <p className="text-[10px] text-slate-500">{day.clockIn} - {day.clockOut}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
