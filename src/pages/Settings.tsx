import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Monitor, Key, Check } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function Settings() {
  const { user } = useAuth();
  const [screenshotInterval, setScreenshotInterval] = useState('10');
  const [trackKeystrokes, setTrackKeystrokes] = useState(true);
  const [blurSensitiveWindows, setBlurSensitiveWindows] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Organization Settings</h1>
        <p className="text-sm text-slate-400">Configure telemetry thresholds, privacy rules, and account info</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Account Details */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span>Profile Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                disabled
                defaultValue={user?.name}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-slate-300 opacity-80"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Account Email</label>
              <input
                type="text"
                disabled
                defaultValue={user?.email}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-slate-300 opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Monitoring & Privacy */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Monitor className="h-4 w-4 text-cyan-400" />
            <span>Monitoring & Privacy Policies</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800/80 bg-slate-950/60">
              <div>
                <p className="font-semibold text-slate-200">Random Screenshot Interval</p>
                <p className="text-slate-500">How frequently the agent captures desktop thumbnail verification</p>
              </div>
              <select
                value={screenshotInterval}
                onChange={(e) => setScreenshotInterval(e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="5">Every 5 minutes</option>
                <option value="10">Every 10 minutes</option>
                <option value="15">Every 15 minutes</option>
                <option value="30">Every 30 minutes</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800/80 bg-slate-950/60">
              <div>
                <p className="font-semibold text-slate-200">Keystroke Activity Counting</p>
                <p className="text-slate-500">Record velocity only (individual characters are never captured)</p>
              </div>
              <input
                type="checkbox"
                checked={trackKeystrokes}
                onChange={(e) => setTrackKeystrokes(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800/80 bg-slate-950/60">
              <div>
                <p className="font-semibold text-slate-200">Auto-blur Sensitive Windows</p>
                <p className="text-slate-500">Automatically blurs password managers and banking tabs in screen previews</p>
              </div>
              <input
                type="checkbox"
                checked={blurSensitiveWindows}
                onChange={(e) => setBlurSensitiveWindows(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-cyan-400 cursor-pointer"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" /> Preferences Saved!
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  );
}
