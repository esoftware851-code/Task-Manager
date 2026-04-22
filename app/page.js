'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';

export default function HomePage() {
  // State
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState('newest');

  // Form / Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // === Show toast ===
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // === Fetch tasks ===
  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (priorityFilter !== 'all') params.set('priority', priorityFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('sort', sort);

      const res = await fetch(`/api/tasks?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setTasks(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError('Failed to connect to the server. Make sure MongoDB is running.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, searchQuery, sort]);

  // === Fetch stats ===
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch {
      // Stats are non-critical, silently fail
    }
  }, []);

  // === Fetch on mount and filter changes ===
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  // === Debounced search ===
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchTasks]);

  // === Create or Update task ===
  const handleSubmitTask = async (formData) => {
    try {
      let res;
      if (editingTask) {
        res = await fetch(`/api/tasks/${editingTask._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();

      if (data.success) {
        showToast(
          editingTask ? 'Task updated successfully!' : 'Task created successfully!'
        );
        setIsFormOpen(false);
        setEditingTask(null);
        fetchTasks();
        fetchStats();
      } else {
        showToast(data.error || 'Something went wrong', 'error');
      }
    } catch {
      showToast('Failed to save task. Check your connection.', 'error');
    }
  };

  // === Toggle task completion ===
  const handleToggle = async (id, completed) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });

      const data = await res.json();

      if (data.success) {
        showToast(completed ? 'Task completed! 🎉' : 'Task reopened');
        fetchTasks();
        fetchStats();
      }
    } catch {
      showToast('Failed to update task', 'error');
    }
  };

  // === Edit task ===
  const handleEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // === Delete task ===
  const handleDeleteConfirm = (id, title) => {
    setDeleteConfirm({ id, title });
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const res = await fetch(`/api/tasks/${deleteConfirm.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        showToast('Task deleted');
        setDeleteConfirm(null);
        fetchTasks();
        fetchStats();
      }
    } catch {
      showToast('Failed to delete task', 'error');
    }
  };

  // === Open new task form ===
  const handleNewTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  return (
    <>
      <Header
        totalTasks={stats?.totalTasks || 0}
        completedTasks={stats?.completedTasks || 0}
        onNewTask={handleNewTask}
      />

      <main className="main-content">
        <Sidebar
          stats={stats}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <section>
          {error && (
            <div className="connection-error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setLoading(true);
                  fetchTasks();
                  fetchStats();
                }}
                style={{ marginLeft: 'auto' }}
              >
                Retry
              </button>
            </div>
          )}

          <TaskList
            tasks={tasks}
            loading={loading}
            sort={sort}
            setSort={setSort}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDeleteConfirm}
          />
        </section>
      </main>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmitTask}
        editingTask={editingTask}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div
          className="confirm-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteConfirm(null);
          }}
        >
          <div className="confirm-dialog">
            <h3>Delete Task?</h3>
            <p>
              Are you sure you want to delete &quot;{deleteConfirm.title}&quot;? This
              action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.type === 'success' ? '✅' : '❌'}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
