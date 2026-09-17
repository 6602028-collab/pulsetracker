import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Monitor,
  ShieldCheck,
  Cpu,
  HardDrive,
  Battery,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { getStoredEmployees } from '../lib/auth';
import { Employee } from '../types';

interface AvailabilityEvent {
  id: string;
  employeeName: string;
  online: boolean;
  timestamp: Date;
}

export default function LiveActivity() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [availabilityEvents, setAvailabilityEvents] = useState<AvailabilityEvent[]>([]);
  const previousAvailability = useRef<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    const loadEmployees = async () => {
      const currentEmployees = await getStoredEmployees();
      if (cancelled) return;

      const changes = currentEmployees.flatMap((employee) => {
        const previousOnline = previousAvailability.current[employee.id];
        if (previousOnline === undefined || previousOnline === employee.online) return [];

        return [{
          id: `${employee.id}-${employee.online}-${Date.now()}`,
          employeeName: employee.name,
          online: employee.online,
          timestamp: new Date(),
        }];
      });

      if (changes.length > 0) {
        setAvailabilityEvents((previous) => [...changes, ...previous].slice(0, 20));
      }

      previousAvailability.current = Object.fromEntries(
        currentEmployees.map((employee) => [employee.id, employee.online])
      );
      setEmployees(currentEmployees);
    };

    loadEmployees();
    const refreshInterval = window.setInterval(loadEmployees, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(refreshInterval);
    };
  }, []);

  const activeMembers = employees.filter((e) => e.online);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Live Activity Stream</h1>
        <p className="text-sm text-slate-400">
          Real-time application telemetry and employee availability changes · Refreshes every 3 seconds
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Availability Changes</h2>
            <p className="text-xs text-slate-400">Employees appear here when they go online or offline.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>
        </div>

        {availabilityEvents.length > 0 ? (
          <div className="mt-4 divide-y divide-slate-800/70">
            {availabilityEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className={`rounded-lg p-2 ${event.online ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  {event.online ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-200">
                    <span className="font-semibold text-white">{event.employeeName}</span>{' '}
                    {event.online ? 'came online' : 'went offline'}
                  </p>
                  <p className="text-[11px] text-slate-500">{event.timestamp.toLocaleTimeString()}</p>
                </div>
                <span className={`text-[11px] font-semibold uppercase ${event.online ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {event.online ? 'Online' : 'Offline'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-slate-800 px-4 py-5 text-center text-xs text-slate-500">
            Waiting for the next availability change...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeMembers.map((emp) => (
          <div
            key={emp.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="h-8 w-8 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <p className="text-xs font-semibold text-white">{emp.name}</p>
                  <p className="text-[10px] text-slate-400">{emp.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </div>
            </div>

            {/* Mock Screen Tile */}
            <div className="relative aspect-video rounded-lg border border-slate-800 bg-slate-950 p-3 flex flex-col justify-between overflow-hidden group">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-mono">{emp.currentApp}</span>
                <span>Last updated: {emp.lastActivity}</span>
              </div>

              <div className="py-2 text-center">
                <p className="text-xs font-mono font-medium text-cyan-300 truncate">
                  {emp.currentWindow}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Keystroke velocity: High (84 wpm)</p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" /> Secure Sandbox
                </span>
                <span>{emp.ip}</span>
              </div>
            </div>

            {/* System Resources */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/60">
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                  <Cpu className="h-3 w-3 text-cyan-400" /> CPU
                </div>
                <p className="font-semibold text-white mt-0.5">{emp.cpuUsage}%</p>
              </div>

              <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/60">
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                  <HardDrive className="h-3 w-3 text-blue-400" /> RAM
                </div>
                <p className="font-semibold text-white mt-0.5">{emp.ramUsage}%</p>
              </div>

              <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/60">
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                  <Battery className="h-3 w-3 text-emerald-400" /> Battery
                </div>
                <p className="font-semibold text-white mt-0.5">{emp.battery}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
