'use client';

export default function Header({ totalTasks, completedTasks, onNewTask }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">T</div>
        <div>
          <h1 className="header-title">Tasker</h1>
          <p className="header-subtitle">Smart Task Manager</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="header-stats-badge">
          <span>📊</span>
          <span><span className="count">{completedTasks}</span> / {totalTasks} done</span>
        </div>
        <button
          id="new-task-btn"
          className="btn btn-primary btn-lg"
          onClick={onNewTask}
        >
          <span>＋</span>
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
