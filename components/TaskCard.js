'use client';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

    const formatted = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    if (diffDays < 0 && !task.completed) {
      return { text: `${formatted} (overdue)`, isOverdue: true };
    }
    if (diffDays === 0) {
      return { text: `${formatted} (today)`, isOverdue: false };
    }
    if (diffDays === 1) {
      return { text: `${formatted} (tomorrow)`, isOverdue: false };
    }
    return { text: formatted, isOverdue: false };
  };

  const dateInfo = formatDate(task.dueDate);

  return (
    <div
      id={`task-${task._id}`}
      className={`task-card priority-${task.priority} ${task.completed ? 'completed' : ''}`}
    >
      <div className="task-card-top">
        <label className="task-checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task._id, !task.completed)}
            aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="checkmark" />
        </label>

        <div className="task-content">
          <div className="task-title">{task.title}</div>
          {task.description && (
            <div className="task-description">{task.description}</div>
          )}
          <div className="task-meta">
            <span className={`task-badge priority-${task.priority}`}>
              {task.priority}
            </span>
            {task.category && task.category !== 'General' && (
              <span className="task-badge category">
                {task.category}
              </span>
            )}
            {dateInfo && (
              <span className={`task-date ${dateInfo.isOverdue ? 'overdue' : ''}`}>
                📅 {dateInfo.text}
              </span>
            )}
          </div>
        </div>

        <div className="task-actions">
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => onDelete(task._id, task.title)}
            title="Delete task"
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
