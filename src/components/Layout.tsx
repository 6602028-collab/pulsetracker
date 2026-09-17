import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Laptop,
  LayoutDashboard,
  Users,
  Activity,
  Clock,
  ClipboardList,
  FolderKanban,
  Settings,
  Shield,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
} from 'lucide-react';
import { useAuth } from '../lib/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const adminNav = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/employees', label: 'Employees', icon: Users },
    { to: '/activity', label: 'Live Activity', icon: Activity },
    { to: '/attendance', label: 'Attendance', icon: Clock },
    { to: '/tasks', label: 'Tasks', icon: ClipboardList },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const employerNav = [
    { to: '/my-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'My Tasks', icon: ClipboardList },
    { to: '/attendance', label: 'Attendance', icon: Clock },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const navItems = user?.role === 'admin' ? adminNav : employerNav;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed z-50 top-0 bottom-0 left-0 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-sm shadow-cyan-500/20">
              <Laptop className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight">PulseTrack</p>
              <p className="text-[10px] text-slate-500">WFH Monitoring</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Pill */}
        <div className="px-3 pt-3">
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
              user?.role === 'admin'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
            }`}
          >
            {user?.role === 'admin' ? (
              <Shield className="h-3.5 w-3.5" />
            ) : (
              <UserIcon className="h-3.5 w-3.5" />
            )}
            <span className="capitalize">{user?.role ?? 'User'} Panel</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive =
              item.to === '/' || item.to === '/my-dashboard'
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/' || item.to === '/my-dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer User Profile & Logout */}
        <div className="border-t border-slate-800 p-3">
          <div className="rounded-lg bg-slate-900/80 border border-slate-800/60 p-3">
            <div className="flex items-center gap-2.5">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';
                  }}
                  className="h-8 w-8 rounded-full object-cover shrink-0 border border-slate-700"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shrink-0">
                  <Shield className="h-4 w-4" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white">{user?.name}</p>
                <p className="truncate text-[10px] text-slate-500">{user?.email}</p>
              </div>
              <button
                type="button"
                id="sidebar-logout-btn"
                onClick={handleLogout}
                title="Sign out"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Topbar Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/80 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search Bar */}
            <div className="relative hidden w-72 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  user?.role === 'admin'
                    ? 'Search employees, devices...'
                    : 'Search tasks, projects...'
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-900 py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-400">Live</span>
            </div>

            {/* Notifications */}
            <button
              type="button"
              title="Notifications"
              className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan-500" />
            </button>

            {/* Profile Avatar & Logout Shortcut */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover border border-slate-700"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs font-bold">
                  {user?.name.charAt(0)}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-slate-200">{user?.name}</p>
                <p className="text-[10px] text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
