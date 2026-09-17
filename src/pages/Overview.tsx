import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Activity,
  FolderKanban,
  Clock,
  TrendingUp,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Search,
} from 'lucide-react';
import { getStoredEmployees } from '../lib/auth';
import { Employee } from '../types';

export default function Overview() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      const currentEmployees = await getStoredEmployees();
      setEmployees(currentEmployees);
      setLastUpdated(new Date());
    };

    loadEmployees();

    const refreshInterval = window.setInterval(loadEmployees, 5000);
    return () => window.clearInterval(refreshInterval);
  }, []);
  const [filter, setFilter] = useState<'all' | 'active' | 'meeting' | 'idle' | 'offline'>('all');
  const [search, setSearch] = useState('');

  const onlineCount = employees.filter((e) => e.online).length;
  const avgProductivity = Math.round(
    employees.length > 0
      ? employees.reduce((acc, e) => acc + e.productivity, 0) / employees.length
      : 0
  );

  const filteredEmployees = employees.filter((e) => {
    const matchesFilter = filter === 'all' ? true : e.status === filter;
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-slate-400">
          Real-time monitoring of {employees.length} remote employees ·{' '}
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading live data...'}
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Online Now
              </p>
              <p className="mt-1 text-2xl font-bold text-white tabular-nums">
                {onlineCount}/{employees.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">{employees.length - onlineCount} offline</p>
            </div>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Avg Productivity
              </p>
              <p className="mt-1 text-2xl font-bold text-white tabular-nums">{avgProductivity}%</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+4% vs last week</span>
              </div>
            </div>
            <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Active Projects
              </p>
              <p className="mt-1 text-2xl font-bold text-white tabular-nums">6</p>
              <p className="mt-1 text-xs text-slate-400">All milestones on schedule</p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <FolderKanban className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Hours Tracked Today
              </p>
              <p className="mt-1 text-2xl font-bold text-white tabular-nums">48.2h</p>
              <p className="mt-1 text-xs text-slate-400">Across active shifts</p>
            </div>
            <div className="rounded-lg bg-violet-500/10 p-2 text-violet-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Employees Table Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
        {/* Table Header Controls */}
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white">Live Remote Workforce</h2>
            <p className="text-xs text-slate-400">Active desktop telemetry, windows and keystroke velocity</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Filter members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-950 py-1 pl-8 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-1 text-xs">
              {(['all', 'active', 'meeting', 'idle', 'offline'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilter(st)}
                  className={`rounded-md px-2.5 py-1 capitalize transition ${
                    filter === st
                      ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Current Application</th>
                <th className="px-4 py-3">Productivity</th>
                <th className="px-4 py-3">Device & OS</th>
                <th className="px-4 py-3">Shift Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/30 transition">
                  {/* Name & Avatar */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';
                          }}
                          className="h-9 w-9 rounded-full object-cover border border-slate-700"
                        />
                        <span
                          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-900 ${
                            emp.status === 'active'
                              ? 'bg-emerald-500'
                              : emp.status === 'meeting'
                              ? 'bg-blue-500'
                              : emp.status === 'idle'
                              ? 'bg-amber-500'
                              : 'bg-slate-600'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{emp.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {emp.role} · {emp.department}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                        emp.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : emp.status === 'meeting'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : emp.status === 'idle'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {emp.status}
                    </span>
                  </td>

                  {/* Current App */}
                  <td className="px-4 py-3 max-w-xs truncate">
                    <div className="flex items-center gap-2 text-slate-200">
                      <Monitor className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span className="font-medium">{emp.currentApp}</span>
                    </div>
                    <p className="truncate text-[11px] text-slate-500">{emp.currentWindow}</p>
                  </td>

                  {/* Productivity */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            emp.productivity >= 85
                              ? 'bg-emerald-500'
                              : emp.productivity >= 70
                              ? 'bg-cyan-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${emp.productivity}%` }}
                        />
                      </div>
                      <span className="font-semibold text-white">{emp.productivity}%</span>
                    </div>
                  </td>

                  {/* Device */}
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Laptop className="h-3.5 w-3.5 text-slate-500" />
                      <span>{emp.device}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{emp.location}</p>
                  </td>

                  {/* Shift Time */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-white">In: {emp.clockIn ?? '—'}</p>
                    <p className="text-[11px] text-slate-500">Shift: {emp.shiftStart} - {emp.shiftEnd}</p>
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
