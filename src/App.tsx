import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import Login from './pages/Login';
import Overview from './pages/Overview';
import EmployerDashboard from './pages/EmployerDashboard';
import Employees from './pages/Employees';
import LiveActivity from './pages/LiveActivity';
import Tasks from './pages/Tasks';
import Attendance from './pages/Attendance';
import Projects from './pages/Projects';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'admin') {
    return <Navigate to="/my-dashboard" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Login Route: if already logged in, redirect to home/dashboard */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'admin' ? '/' : '/my-dashboard'} replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Admin Overview Route */}
      <Route
        path="/"
        element={
          <AdminOnly>
            <Layout>
              <Overview />
            </Layout>
          </AdminOnly>
        }
      />

      {/* Employer / Employee Dashboard Route */}
      <Route
        path="/my-dashboard"
        element={
          <RequireAuth>
            <Layout>
              <EmployerDashboard />
            </Layout>
          </RequireAuth>
        }
      />

      {/* Employees Directory Route */}
      <Route
        path="/employees"
        element={
          <RequireAuth>
            <Layout>
              <Employees />
            </Layout>
          </RequireAuth>
        }
      />

      {/* Live Activity Route */}
      <Route
        path="/activity"
        element={
          <RequireAuth>
            <Layout>
              <LiveActivity />
            </Layout>
          </RequireAuth>
        }
      />

      {/* Tasks Route */}
      <Route
        path="/tasks"
        element={
          <RequireAuth>
            <Layout>
              <Tasks />
            </Layout>
          </RequireAuth>
        }
      />

      {/* Attendance Route */}
      <Route
        path="/attendance"
        element={
          <RequireAuth>
            <Layout>
              <Attendance />
            </Layout>
          </RequireAuth>
        }
      />

      {/* Projects Route */}
      <Route
        path="/projects"
        element={
          <RequireAuth>
            <Layout>
              <Projects />
            </Layout>
          </RequireAuth>
        }
      />

      {/* Settings Route */}
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <Layout>
              <Settings />
            </Layout>
          </RequireAuth>
        }
      />

      {/* Catch-all */}
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? (user?.role === 'admin' ? '/' : '/my-dashboard') : '/login'}
            replace
          />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
