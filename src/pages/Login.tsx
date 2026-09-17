import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Laptop,
  Activity,
  Users,
  Clock,
  CheckCircle2,
  Shield,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { resetPassword, useAuth } from '../lib/auth';
import { UserRole } from '../types';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showResetNotice, setShowResetNotice] = useState(false);
  const [resetPasswordValue, setResetPasswordValue] = useState('');
  const [resetPasswordConfirmation, setResetPasswordConfirmation] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password, role);
    if (result.success) {
      navigate(role === 'admin' ? '/' : '/my-dashboard');
    } else {
      setError(result.error ?? 'Login failed. Please check your credentials.');
    }
    setIsLoading(false);
  }

  async function handlePasswordReset() {
    setResetError('');
    setResetSuccess('');

    if (resetPasswordValue !== resetPasswordConfirmation) {
      setResetError('Passwords do not match.');
      return;
    }

    setIsResetting(true);
    try {
      const result = await resetPassword(email, role, resetPasswordValue);
      setResetSuccess(result.message);
      setPassword('');
      setResetPasswordValue('');
      setResetPasswordConfirmation('');
    } catch (resetRequestError) {
      setResetError(resetRequestError instanceof Error ? resetRequestError.message : 'Unable to reset password.');
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Left side hero branding banner (hidden on mobile, lg:flex) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 p-12 lg:flex">
        {/* Animated background glowing ambient blurs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-20 right-0 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl"
          />
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Laptop className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-white tracking-tight">PulseTrack</p>
            <p className="text-xs text-slate-400">WFH Employee Monitoring</p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="relative z-10 max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold leading-tight text-white tracking-tight"
          >
            Monitor, manage, and empower your remote workforce.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-slate-400 leading-relaxed"
          >
            Real-time activity tracking, attendance management, task assignment, project tracking, meetings, and team communication — all in one platform.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 grid grid-cols-2 gap-3"
          >
            {[
              { icon: Activity, label: 'Live Monitoring' },
              { icon: Users, label: 'Team Management' },
              { icon: Clock, label: 'Attendance Tracking' },
              { icon: CheckCircle2, label: 'Task & Projects' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2.5 backdrop-blur"
              >
                <item.icon className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-slate-300">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 flex gap-8">
          {[
            { value: '8+', label: 'Employees' },
            { value: '6', label: 'Projects' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-white tabular-nums">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side login form */}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile brand header (shows on smaller screens) */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-md shadow-cyan-500/20">
              <Laptop className="h-5 w-5 text-white" />
            </div>
            <p className="text-lg font-bold text-white">PulseTrack</p>
          </div>

          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-400">Sign in to access your dashboard</p>

          {/* Role selector buttons */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-900 p-1.5">
            <button
              type="button"
              id="admin-tab-btn"
              onClick={() => {
                setRole('admin');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition cursor-pointer ${
                role === 'admin'
                  ? 'bg-cyan-500/15 text-cyan-400 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="h-4 w-4" /> Admin
            </button>
            <button
              type="button"
              id="employer-tab-btn"
              onClick={() => {
                setRole('employer');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition cursor-pointer ${
                role === 'employer'
                  ? 'bg-violet-500/15 text-violet-400 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="h-4 w-4" /> Employer
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="email-input"
                className="mb-1.5 block text-xs font-medium text-slate-400"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'admin' ? 'admin@acme.io' : 'sarah.chen@acme.io'}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password-input"
                className="mb-1.5 block text-xs font-medium text-slate-400"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-10 text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition"
                  required
                />
                <button
                  type="button"
                  id="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-400"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="text-xs">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 focus:ring-offset-0 accent-cyan-500 cursor-pointer"
                />
                Remember me
              </label>
              <button
                type="button"
                id="forgot-password-btn"
                onClick={() => {
                  setShowResetNotice(true);
                  setResetError('');
                  setResetSuccess('');
                }}
                className="text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

              {/* Password reset form */}
            <AnimatePresence>
              {showResetNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs text-cyan-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-cyan-200">Reset {role === 'admin' ? 'admin' : 'employer'} password</p>
                        <p className="mt-1 text-cyan-300/80">Enter the account email and choose a new password.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowResetNotice(false)}
                        className="text-cyan-400 hover:text-white font-bold px-1"
                        aria-label="Close password reset"
                      >
                        ×
                      </button>
                    </div>
                    <input
                      type="password"
                      value={resetPasswordValue}
                      onChange={(e) => setResetPasswordValue(e.target.value)}
                      placeholder="New password (6+ characters)"
                      minLength={6}
                      required
                      className="w-full rounded-lg border border-cyan-500/20 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
                    />
                    <input
                      type="password"
                      value={resetPasswordConfirmation}
                      onChange={(e) => setResetPasswordConfirmation(e.target.value)}
                      placeholder="Confirm new password"
                      minLength={6}
                      required
                      className="w-full rounded-lg border border-cyan-500/20 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
                    />
                    {resetError && <p className="text-rose-300">{resetError}</p>}
                    {resetSuccess && <p className="text-emerald-300">{resetSuccess}</p>}
                    <button
                      type="button"
                      onClick={() => void handlePasswordReset()}
                      disabled={isResetting}
                      className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-400 disabled:opacity-60"
                    >
                      {isResetting ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <button
              type="submit"
              id="submit-login-btn"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:opacity-60 cursor-pointer shadow-md shadow-cyan-500/20"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                />
              ) : (
                <>
                  Sign in as {role === 'admin' ? 'Admin' : 'Employer'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

        </motion.div>
      </div>
    </div>
  );
}
