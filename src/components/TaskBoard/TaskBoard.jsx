import React, { useState } from 'react';

// Initial Dummy Data
const initialTasks = [
  { id: '1', title: 'Design Database Schema', status: 'todo', owner: 'Alex', priority: 'P1', confidence: 'On Track', dueDate: new Date(Date.now() + 86400000).toISOString() }, // Due tomorrow (Alert!)
  { id: '2', title: 'Set up GitHub Actions', status: 'in-progress', owner: 'You', priority: 'P2', confidence: 'On Track', dueDate: new Date(Date.now() + 486400000).toISOString() },
  { id: '3', title: 'Configure Firebase Auth', status: 'blocked', owner: 'Sam', priority: 'P1', confidence: 'At Risk', dueDate: new Date(Date.now() + 864000000).toISOString() },
  { id: '4', title: 'Write MVP Spec', status: 'done', owner: 'Alex', priority: 'P3', confidence: 'On Track', dueDate: new Date(Date.now() - 86400000).toISOString() },
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
      confidence: 'On Track',
      dueDate: new Date(Date.now() + 604800000).toISOString() // Default 1 week
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const getConfidenceColor = (confidence) => {
    if (confidence === 'On Track') return 'bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]';
    if (confidence === 'At Risk') return 'bg-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]';
    return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]';
  };

  const isDeadlineClose = (isoDate) => {
    const timeRemaining = new Date(isoDate).getTime() - Date.now();
    return timeRemaining > 0 && timeRemaining < 172800000; // Less than 48 hours
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Platform Development MVP</h2>
          <p className="text-valhalla-ink/60 dark:text-gray-400">Goal: The single surface where teams stay aligned.</p>
        </div>
        
        <form onSubmit={handleAddTask} className="flex gap-2">
          <input 
            type="text" 
            placeholder="+ Quick Add Task..." 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="bg-white/50 dark:bg-valhalla-slate/50 border border-valhalla-ink/20 dark:border-white/10 text-valhalla-ink dark:text-white px-4 py-2 rounded-lg outline-none w-64 focus:border-valhalla-gold dark:focus:border-valhalla-neon transition-colors"
          />
          <button type="submit" className="bg-valhalla-ink dark:bg-valhalla-neon text-white dark:text-valhalla-void px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity">
            Add
          </button>
        </form>
      </header>

      <div className="grid grid-cols-4 gap-6 flex-1 min-h-0">
        {columns.map(column => (
          <div key={column.id} className="flex flex-col rounded-2xl p-4 h-full max-h-full glass">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-valhalla-ink/10 dark:border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-valhalla-ink/50 dark:text-gray-400">{column.title}</h3>
              <span className="bg-white/50 dark:bg-white/10 text-valhalla-ink dark:text-gray-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto pr-1 pb-4">
              {tasks.filter(t => t.status === column.id).map(task => {
                const isUrgent = t.status !== 'done' && isDeadlineClose(task.dueDate);
                
                return (
                  <div 
                    key={task.id} 
                    className={`bg-white dark:bg-valhalla-slate border rounded-xl p-4 cursor-grab transition-all duration-200 hover:-translate-y-1 hover:shadow-md
                      ${isUrgent 
                        ? 'border-red-400 dark:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                        : 'border-valhalla-ink/10 dark:border-white/5 hover:border-valhalla-gold dark:hover:border-valhalla-neon'
                      }
                    `}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex gap-2 items-center">
                        <span className="text-[0.65rem] font-bold bg-gray-100 dark:bg-valhalla-void px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">
                          {task.priority}
                        </span>
                        {isUrgent && (
                          <span className="text-[0.65rem] font-bold text-red-500 flex items-center gap-1 animate-pulse">
                            ⚠️ DUE SOON
                          </span>
                        )}
                      </div>
                      <span 
                        className={`w-2 h-2 rounded-full ${getConfidenceColor(task.confidence)}`}
                        title={`Confidence: ${task.confidence}`}
                      />
                    </div>
                    
                    <h4 className="text-sm font-semibold mb-3 text-valhalla-ink dark:text-gray-100 leading-snug">
                      {task.title}
                    </h4>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-xs text-valhalla-ink/60 dark:text-gray-400">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-valhalla-gold to-amber-700 dark:from-valhalla-neon dark:to-purple-500 text-white flex items-center justify-center font-bold text-[0.6rem]">
                          {task.owner.charAt(0)}
                        </div>
                        <span>{task.owner}</span>
                      </div>
                      
                      <div className="flex gap-1">
                        {column.id !== 'todo' && (
                          <button onClick={() => moveTask(task.id, 'todo')} className="w-6 h-6 rounded flex items-center justify-center border border-valhalla-ink/10 dark:border-white/10 text-valhalla-ink/50 dark:text-gray-400 hover:bg-valhalla-ink/5 dark:hover:bg-white/5">
                            ←
                          </button>
                        )}
                        {column.id !== 'done' && (
                          <button onClick={() => moveTask(task.id, 'done')} className="w-6 h-6 rounded flex items-center justify-center border border-valhalla-ink/10 dark:border-white/10 text-valhalla-ink/50 dark:text-gray-400 hover:bg-valhalla-ink/5 dark:hover:bg-white/5">
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
