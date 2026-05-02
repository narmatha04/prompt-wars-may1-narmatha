import React, { useState } from 'react';
import './TaskBoard.css';

// Initial Dummy Data to set up the Kanban View
const initialTasks = [
  { id: '1', title: 'Design Database Schema', status: 'todo', owner: 'Alex', priority: 'P1', confidence: 'On Track' },
  { id: '2', title: 'Set up GitHub Actions', status: 'in-progress', owner: 'You', priority: 'P2', confidence: 'On Track' },
  { id: '3', title: 'Configure Firebase Auth', status: 'blocked', owner: 'Sam', priority: 'P1', confidence: 'At Risk' },
  { id: '4', title: 'Write MVP Spec', status: 'done', owner: 'Alex', priority: 'P3', confidence: 'On Track' },
];

export default function TaskBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'blocked', title: 'Blocked' },
    { id: 'done', title: 'Done' }
  ];

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'todo',
      owner: 'Unassigned',
      priority: 'P2',
      confidence: 'On Track'
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const getConfidenceColor = (confidence) => {
    if (confidence === 'On Track') return 'var(--status-on-track)';
    if (confidence === 'At Risk') return 'var(--status-at-risk)';
    return 'var(--status-off-track)';
  };

  return (
    <div className="task-board-container">
      <header className="board-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Platform Development MVP</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Goal: The single surface where teams stay aligned without the meeting tax.</p>
        </div>
        
        <form onSubmit={handleAddTask} className="quick-add-form">
          <input 
            type="text" 
            placeholder="+ Quick Add Task..." 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="quick-add-input"
          />
          <button type="submit" className="btn-primary">Add</button>
        </form>
      </header>

      <div className="kanban-grid">
        {columns.map(column => (
          <div key={column.id} className="kanban-column glass">
            <div className="column-header">
              <h3 className="column-title">{column.title}</h3>
              <span className="task-count">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </div>
            
            <div className="task-list">
              {tasks.filter(t => t.status === column.id).map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <span className="task-priority">{task.priority}</span>
                    <span 
                      className="confidence-dot" 
                      style={{ backgroundColor: getConfidenceColor(task.confidence) }}
                      title={`Confidence: ${task.confidence}`}
                    />
                  </div>
                  <h4 className="task-title">{task.title}</h4>
                  
                  <div className="task-footer">
                    <div className="task-owner">
                      <div className="avatar-placeholder">{task.owner.charAt(0)}</div>
                      <span>{task.owner}</span>
                    </div>
                    
                    {/* Simple mock move buttons for the prototype */}
                    <div className="move-actions">
                      {column.id !== 'todo' && <button onClick={() => moveTask(task.id, 'todo')}>←</button>}
                      {column.id !== 'done' && <button onClick={() => moveTask(task.id, 'done')}>→</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
