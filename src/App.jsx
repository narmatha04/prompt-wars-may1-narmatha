import React, { useState } from 'react';
import './index.css';
import TaskBoard from './components/TaskBoard/TaskBoard';

function App() {
  const [currentView, setCurrentView] = useState('command-center');

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside style={{ width: '250px', borderRight: '1px solid var(--border-light)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '2rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CoordinationOS
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setCurrentView('command-center')}
            style={{ 
              textAlign: 'left', border: 'none', cursor: 'pointer',
              color: currentView === 'command-center' ? 'var(--text-primary)' : 'var(--text-secondary)', 
              padding: '0.5rem', borderRadius: 'var(--radius-md)', 
              background: currentView === 'command-center' ? 'var(--bg-surface)' : 'transparent' 
            }}>
            Command Center
          </button>
          <button 
            onClick={() => setCurrentView('task-board')}
            style={{ 
              textAlign: 'left', border: 'none', cursor: 'pointer',
              color: currentView === 'task-board' ? 'var(--text-primary)' : 'var(--text-secondary)', 
              padding: '0.5rem', borderRadius: 'var(--radius-md)', 
              background: currentView === 'task-board' ? 'var(--bg-surface)' : 'transparent' 
            }}>
            Task Board
          </button>
          <button 
            style={{ textAlign: 'left', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.5rem', background: 'transparent' }} disabled>
            Decision Log (Coming Soon)
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {currentView === 'command-center' ? (
          <>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: '600' }}>Command Center</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back. Here's your team's pulse.</p>
              </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>My Tasks</h3>
                <p style={{ fontSize: '2rem', fontWeight: '700' }}>4</p>
              </div>
              <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Blocked Tasks</h3>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--status-off-track)' }}>1</p>
              </div>
              <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Standup Completion</h3>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--status-on-track)' }}>100%</p>
              </div>
            </div>
          </>
        ) : (
          <TaskBoard />
        )}
      </main>
    </div>
  );
}

export default App;
