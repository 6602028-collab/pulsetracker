import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Laptop, Mail, MapPin, Pencil, Trash2 } from 'lucide-react';
import { deleteEmployeeAccount, getStoredEmployees, createEmployeeAccount, updateEmployeeAccount } from '../lib/auth';
import { Employee } from '../types';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    roleTitle: '',
    department: 'Engineering',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEmployees = async () => {
      const data = await getStoredEmployees();
      setEmployees(data);
    };

    loadEmployees();
  }, []);

  const departments = useMemo(
    () => ['All', ...Array.from(new Set(employees.map((emp) => emp.department)))],
    [employees]
  );

  const filtered = employees.filter((emp) => {
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const input = {
        name: form.name,
        email: form.email,
        password: form.password,
        roleTitle: form.roleTitle,
        department: form.department,
      };
      const saved = editingEmployee
        ? await updateEmployeeAccount(editingEmployee.id, input)
        : await createEmployeeAccount(input);

      setEmployees((prev) =>
        editingEmployee
          ? prev.map((employee) => (employee.id === saved.id ? saved : employee))
          : [saved, ...prev]
      );
      setForm({ name: '', email: '', password: '', roleTitle: '', department: 'Engineering' });
      setEditingEmployee(null);
      setShowForm(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create employee.');
    }
  }

  function openCreateForm() {
    setEditingEmployee(null);
    setForm({ name: '', email: '', password: '', roleTitle: '', department: 'Engineering' });
    setError('');
    setShowForm(true);
  }

  function openEditForm(employee: Employee) {
    setEditingEmployee(employee);
    setForm({
      name: employee.name,
      email: employee.email,
      password: '',
      roleTitle: employee.role,
      department: employee.department,
    });
    setError('');
    setShowForm(true);
  }

  async function handleDelete(employee: Employee) {
    if (!window.confirm(`Delete ${employee.name}? This cannot be undone.`)) return;

    setDeletingId(employee.id);
    setError('');
    try {
      await deleteEmployeeAccount(employee.id);
      setEmployees((prev) => prev.filter((item) => item.id !== employee.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete employee.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Team Directory</h1>
          <p className="text-sm text-slate-400">Manage all registered remote team members & devices</p>
        </div>

        <button
          type="button"
          onClick={showForm && !editingEmployee ? () => setShowForm(false) : openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-cyan-400 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {showForm && !editingEmployee ? 'Close Form' : 'Add Employee'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">{editingEmployee ? 'Edit employee' : 'Create employee'}</h2>
            {editingEmployee && <span className="text-xs text-slate-500">ID: {editingEmployee.id}</span>}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs text-slate-400">Full name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-slate-400">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-slate-400">
                Password {editingEmployee && <span className="text-slate-500">(leave blank to keep current)</span>}
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                required={!editingEmployee}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-slate-400">Job title</label>
              <input
                value={form.roleTitle}
                onChange={(e) => setForm((prev) => ({ ...prev, roleTitle: e.target.value }))}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                placeholder="Frontend Engineer"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs text-slate-400">Department</label>
              <select
                value={form.department}
                onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              >
                <option>Engineering</option>
                <option>Finance</option>
                <option>Design</option>
                <option>Product</option>
                <option>Security</option>
                <option>Operations</option>
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400"
            >
              {editingEmployee ? 'Save Changes' : 'Create Employee'}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, role, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                selectedDept === dept
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((emp) => (
          <div
            key={emp.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between">
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
                    className="h-12 w-12 rounded-full object-cover border border-slate-700"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 ${
                      emp.online ? 'bg-emerald-500' : 'bg-slate-600'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{emp.name}</h3>
                  <p className="text-xs text-slate-400">{emp.role}</p>
                  <span className="mt-1 inline-block text-[10px] rounded bg-slate-800 px-1.5 py-0.5 text-slate-400">
                    {emp.department}
                  </span>
                </div>
              </div>

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                  emp.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : emp.status === 'meeting'
                    ? 'bg-blue-500/10 text-blue-400'
                    : emp.status === 'idle'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {emp.status}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500">Employee ID</span>
                <span className="font-mono text-slate-300">{emp.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-500" />
                <span className="truncate">{emp.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Laptop className="h-3.5 w-3.5 text-slate-500" />
                <span>{emp.device}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                <span>{emp.location}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500">Password</span>
                <span className="font-mono text-slate-300">{emp.password || 'Managed by employee'}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-400">Productivity Score</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{emp.productivity}%</span>
                <button
                  type="button"
                  title={`Edit ${emp.name}`}
                  onClick={() => openEditForm(emp)}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title={`Delete ${emp.name}`}
                  onClick={() => handleDelete(emp)}
                  disabled={deletingId === emp.id}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
