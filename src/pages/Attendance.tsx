import React, { useEffect, useState } from 'react';
import { Clock, Calendar, CheckCircle2, AlertTriangle, UserCheck } from 'lucide-react';
import { getStoredEmployees } from '../lib/auth';
import { Employee } from '../types';

export default function Attendance() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const loadEmployees = async () => {
      setEmployees(await getStoredEmployees());
    };
    loadEmployees();
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Attendance & Timesheets</h1>
        <p className="text-sm text-slate-400">Shift schedules, clock-in records, and remote hours validation</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-medium uppercase text-slate-500">Present Today</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">7/8</p>
          <p className="mt-1 text-xs text-slate-400">87.5% attendance rate</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-medium uppercase text-slate-500">On Time</p>
          <p className="mt-1 text-2xl font-bold text-cyan-400">6</p>
          <p className="mt-1 text-xs text-slate-400">Punctual clock-ins</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-medium uppercase text-slate-500">Late Arrivals</p>
          <p className="mt-1 text-2xl font-bold text-amber-400">1</p>
          <p className="mt-1 text-xs text-slate-400">Grace period active</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-medium uppercase text-slate-500">Planned Leave</p>
          <p className="mt-1 text-2xl font-bold text-slate-300">0</p>
          <p className="mt-1 text-xs text-slate-400">No active leaves today</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Today's Clock-in Log (Sep 10)</h2>
          <span className="text-xs text-slate-500">Auto-synchronized via Agent Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Scheduled Shift</th>
                <th className="px-4 py-3">Clock-In Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Active Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="h-7 w-7 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <p className="font-semibold text-white">{emp.name}</p>
                        <p className="text-[10px] text-slate-400">{emp.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-400">
                    {emp.shiftStart} - {emp.shiftEnd}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-white">
                    {emp.clockIn ?? '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        emp.clockIn
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {emp.clockIn ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-200">
                    {Math.floor(emp.activeTimeSec / 3600)}h {Math.floor((emp.activeTimeSec % 3600) / 60)}m
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
