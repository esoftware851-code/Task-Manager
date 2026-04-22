'use client';

export default function Sidebar({
  stats,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  searchQuery,
  setSearchQuery,
}) {
  const circumference = 2 * Math.PI * 40;
  const progress = stats ? circumference - (stats.completionRate / 100) * circumference : circumference;

  return (
    <aside className="sidebar">
      {/* Search */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Search</div>
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="search-input"
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Overview</div>

        {/* Completion Ring */}
        <div className="completion-ring">
          <svg className="ring-svg" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <circle className="ring-track" cx="50" cy="50" r="40" />
            <circle
              className="ring-progress"
              cx="50"
              cy="50"
              r="40"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
            />
          </svg>
          <div style={{ textAlign: 'center', marginTop: '-8px' }}>
            <div className="ring-text">{stats?.completionRate || 0}%</div>
            <div className="ring-label">Completed</div>
          </div>
        </div>

        <div className="stats-grid" style={{ marginTop: '16px' }}>
          <div className="stat-card">
            <div className="stat-value">{stats?.totalTasks || 0}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.activeTasks || 0}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.completedTasks || 0}</div>
            <div className="stat-label">Done</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: stats?.overdueTasks > 0 ? 'var(--danger)' : undefined }}>
              {stats?.overdueTasks || 0}
            </div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Status</div>
        <div className="filter-group">
          {[
            { key: 'all', label: '📋 All Tasks', count: stats?.totalTasks || 0 },
            { key: 'active', label: '⚡ Active', count: stats?.activeTasks || 0 },
            { key: 'completed', label: '✅ Completed', count: stats?.completedTasks || 0 },
          ].map((f) => (
            <button
              key={f.key}
              id={`filter-status-${f.key}`}
              className={`filter-btn ${statusFilter === f.key ? 'active' : ''}`}
              onClick={() => setStatusFilter(f.key)}
            >
              <span className="filter-label">{f.label}</span>
              <span className="filter-count">{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Priority Filter */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Priority</div>
        <div className="filter-group">
          {[
            { key: 'all', label: 'All Priorities', color: null },
            { key: 'critical', label: 'Critical', color: 'critical' },
            { key: 'high', label: 'High', color: 'high' },
            { key: 'medium', label: 'Medium', color: 'medium' },
            { key: 'low', label: 'Low', color: 'low' },
          ].map((f) => (
            <button
              key={f.key}
              id={`filter-priority-${f.key}`}
              className={`filter-btn ${priorityFilter === f.key ? 'active' : ''}`}
              onClick={() => setPriorityFilter(f.key)}
            >
              <span className="filter-label">
                {f.color && <span className={`priority-dot ${f.color}`} />}
                {f.label}
              </span>
              <span className="filter-count">
                {f.key === 'all'
                  ? stats?.totalTasks || 0
                  : stats?.priorities?.[f.key] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
