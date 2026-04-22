'use client';

import TaskCard from './TaskCard';

export default function TaskList({
  tasks,
  loading,
  sort,
  setSort,
  onToggle,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="task-list-container">
        <div className="task-list-header">
          <div className="skeleton" style={{ width: 150, height: 24 }} />
          <div className="skeleton" style={{ width: 120, height: 32 }} />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <div>
          <span className="task-list-title">Tasks</span>
          <span className="task-list-count"> ({tasks.length})</span>
        </div>
        <select
          id="sort-select"
          className="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">By Priority</option>
          <option value="title">By Title</option>
          <option value="dueDate">By Due Date</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3 className="empty-title">No tasks found</h3>
          <p className="empty-description">
            Create your first task to get started, or adjust your filters to see existing tasks.
          </p>
        </div>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
