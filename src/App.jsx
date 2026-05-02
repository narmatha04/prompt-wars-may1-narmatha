import React from 'react';
import './index.css';

function App() {
  return (
    <div className="app-container">
      {/* Sidebar - Placeholder for now */}
      <aside style={{ width: '250px', borderRight: '1px solid var(--border-light)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '2rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CoordinationOS
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a href="#" style={{ color: 'var(--text-primary)', textDecoration: 'none', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>Command Center</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>Task Board</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>Decision Log</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>Team Pulse</a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '600' }}>Command Center</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome back. Here's what's happening today.</p>
          </div>
          <button className="btn-primary">+ New Task</button>
        </header>

        {/* Dashboard Grid Placeholder */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>My Tasks</h3>
            <p style={{ fontSize: '2rem', fontWeight: '700' }}>4</p>
          </div>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Blocked</h3>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--status-off-track)' }}>1</p>
          </div>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Team Health</h3>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--status-on-track)' }}>92%</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
