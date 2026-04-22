'use client';

import { useState, useEffect, useRef } from 'react';

export default function TaskForm({ isOpen, onClose, onSubmit, editingTask }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'General',
    dueDate: '',
  });

  const titleRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setFormData({
          title: editingTask.title || '',
          description: editingTask.description || '',
          priority: editingTask.priority || 'medium',
          category: editingTask.category || 'General',
          dueDate: editingTask.dueDate
            ? new Date(editingTask.dueDate).toISOString().split('T')[0]
            : '',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          category: 'General',
          dueDate: '',
        });
      }
      // Focus title input after a short delay
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen, editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const data = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate || null,
    };

    onSubmit(data);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" role="dialog" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">
              Title *
            </label>
            <input
              ref={titleRef}
              id="task-title"
              name="title"
              type="text"
              className="form-input"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              name="description"
              className="form-textarea"
              placeholder="Add any extra details..."
              value={formData.description}
              onChange={handleChange}
              maxLength={500}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="task-priority">
                Priority
              </label>
              <select
                id="task-priority"
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="critical">🔴 Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-category">
                Category
              </label>
              <input
                id="task-category"
                name="category"
                type="text"
                className="form-input"
                placeholder="e.g., Work, Personal"
                value={formData.category}
                onChange={handleChange}
                maxLength={30}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-due-date">
              Due Date
            </label>
            <input
              id="task-due-date"
              name="dueDate"
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              id="submit-task-btn"
              type="submit"
              className="btn btn-primary btn-lg"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
