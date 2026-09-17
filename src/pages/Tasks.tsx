import React, { useState } from 'react';
import { ClipboardList, Plus, CheckCircle2, Circle, Clock } from 'lucide-react';
import { INITIAL_TASKS } from '../data/mockData';
import { TaskItem } from '../types';

export default function Tasks() {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'done' ? 'in-progress' : 'done' }
          : t
      )
    );
  }

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'all') return true;
    return t.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Team Tasks & Deliverables</h1>
          <p className="text-sm text-slate-400">Track tasks, assignments, deadlines, and completion</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(['all', 'todo', 'in-progress', 'done'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
              activeTab === tab
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((t) => (
          <div
            key={t.id}
            onClick={() => toggleTask(t.id)}
            className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm hover:border-slate-700 transition cursor-pointer"
          >
            <button
              type="button"
              className="text-slate-400 hover:text-cyan-400 transition"
              aria-label="Toggle task completion"
            >
              {t.status === 'done' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <Circle className="h-5 w-5 text-slate-500" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold ${
                  t.status === 'done' ? 'line-through text-slate-500' : 'text-white'
                }`}
              >
                {t.title}
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                <span>{t.project}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="h-3 w-3" /> Due {t.dueDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
                  t.priority === 'high'
                    ? 'bg-rose-500/10 text-rose-400'
                    : 'bg-cyan-500/10 text-cyan-400'
                }`}
              >
                {t.priority}
              </span>

              <div className="flex items-center gap-2">
                <img
                  src={t.assigneeAvatar}
                  alt={t.assigneeName}
                  className="h-6 w-6 rounded-full object-cover border border-slate-700"
                />
                <span className="hidden sm:inline text-xs text-slate-300 font-medium">
                  {t.assigneeName}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
