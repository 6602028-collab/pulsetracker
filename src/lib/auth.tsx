import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Employee } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export async function getStoredEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch(`${API_BASE}/employees`);
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    const data = (await response.json()) as Employee[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function createEmployeeAccount(input: {
  name: string;
  email: string;
  password: string;
  roleTitle: string;
  department: string;
}) {
  const email = input.email.trim().toLowerCase();

  if (!email || !input.password.trim()) {
    throw new Error('Email and password are required.');
  }

  const response = await fetch(`${API_BASE}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: input.name,
      email,
      password: input.password,
      role: input.roleTitle || 'Employee',
      department: input.department || 'General',
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Unable to create employee.');
  }

  return data as Employee;
}

export async function updateEmployeeAccount(employeeId: string, input: {
  name: string;
  email: string;
  password?: string;
  roleTitle: string;
  department: string;
}) {
  const response = await fetch(`${API_BASE}/employees/${encodeURIComponent(employeeId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: input.name,
      email: input.email.trim().toLowerCase(),
      password: input.password || '',
      role: input.roleTitle || 'Employee',
      department: input.department || 'General',
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Unable to update employee.');
  }

  return data as Employee;
}

export async function deleteEmployeeAccount(employeeId: string) {
  const response = await fetch(`${API_BASE}/employees/${encodeURIComponent(employeeId)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Unable to delete employee.');
  }
}

export async function updateEmployeeAvailability(employeeId: string, online: boolean) {
  const response = await fetch(`${API_BASE}/employees/${encodeURIComponent(employeeId)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ online }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Unable to update availability.');
  }

  return data as Employee;
}

export async function resetPassword(email: string, role: UserRole, newPassword: string) {
  const response = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role, newPassword }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Unable to reset password.');
  }

  return data as { message: string };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('pulsetrack_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('pulsetrack_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('pulsetrack_user');
      }
    } catch {
      // ignore
    }
  }, [user]);

  async function login(emailInput: string, passwordInput: string, roleInput: UserRole) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput,
          role: roleInput,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return { success: false, error: data?.error || 'Login failed.' };
      }

      const responseUser = data.user as User;
      setUser({
        id: responseUser.id,
        name: responseUser.name,
        email: responseUser.email,
        role: responseUser.role,
        avatar: responseUser.avatar || '',
        department: responseUser.department,
        employeeId: responseUser.employeeId,
      });

      return { success: true };
    } catch {
      return { success: false, error: 'Unable to reach the backend server.' };
    }
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
