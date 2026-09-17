import React from 'react';
import { FolderKanban, Users, Calendar, ArrowUpRight } from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/mockData';

export default function Projects() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Active Remote Projects</h1>
        <p className="text-sm text-slate-400">Roadmap progress, milestones, and deliverable pacing</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {INITIAL_PROJECTS.map((proj) => (
          <div
            key={proj.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm hover:border-slate-700 transition space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                  {proj.department}
                </span>
                <h3 className="font-semibold text-white text-base mt-2">{proj.name}</h3>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                  proj.status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : proj.status === 'on-track'
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}
              >
                {proj.status.replace('-', ' ')}
              </span>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {proj.description}
            </p>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Completion</span>
                <span className="font-semibold text-white">{proj.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-slate-500" /> {proj.teamSize} members
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-500" /> Due {proj.dueDate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
