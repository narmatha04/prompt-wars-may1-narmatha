import React, { useState, useEffect } from 'react';
import './index.css';
import TaskBoard from './components/TaskBoard/TaskBoard';
import LandingPage from './components/Auth/LandingPage';
import { useTheme } from './context/ThemeContext';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [currentView, setCurrentView] = useState('command-center');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-valhalla-parchment dark:bg-valhalla-void">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-valhalla-gold dark:border-valhalla-neon"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-valhalla-parchment dark:bg-valhalla-void transition-colors duration-300">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-valhalla-ink/10 dark:border-white/10 p-6 flex flex-col glass relative z-10">
        <div className="mb-8">
          <h2 className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-valhalla-gold to-amber-700 dark:from-valhalla-neon dark:to-purple-500">
            VALHALLA
          </h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-valhalla-ink/50 dark:text-gray-400 mt-1">
            Coordinate. Conquer.
          </p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <button 
            onClick={() => setCurrentView('command-center')}
            className={`text-left font-medium p-3 rounded-lg transition-colors ${
              currentView === 'command-center' 
                ? 'bg-white/50 dark:bg-white/10 text-valhalla-ink dark:text-white shadow-sm' 
                : 'text-valhalla-ink/60 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/5'
            }`}>
            Command Center
          </button>
          <button 
            onClick={() => setCurrentView('task-board')}
            className={`text-left font-medium p-3 rounded-lg transition-colors ${
              currentView === 'task-board' 
                ? 'bg-white/50 dark:bg-white/10 text-valhalla-ink dark:text-white shadow-sm' 
                : 'text-valhalla-ink/60 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/5'
            }`}>
            Task Board
          </button>
          <button 
            disabled
            className="text-left font-medium p-3 rounded-lg text-valhalla-ink/30 dark:text-gray-600 cursor-not-allowed">
            The Runes (Decisions)
          </button>
          <button 
            disabled
            className="text-left font-medium p-3 rounded-lg text-valhalla-ink/30 dark:text-gray-600 cursor-not-allowed">
            AI Oracle (Standups)
          </button>
        </nav>

        {/* User Profile & Theme Toggle */}
        <div className="mt-auto border-t border-valhalla-ink/10 dark:border-white/10 pt-4 flex flex-col gap-4">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-2 text-sm font-medium text-valhalla-ink/70 dark:text-gray-300 hover:text-valhalla-ink dark:hover:text-white transition-colors"
          >
            {theme === 'light' ? '🌙 Switch to Void' : '☀️ Switch to Light'}
          </button>
          
          <div className="flex items-center justify-between group cursor-pointer" onClick={handleSignOut} title="Click to sign out">
            <div className="flex items-center gap-3">
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-valhalla-gold dark:border-valhalla-neon"
              />
              <span className="text-sm font-semibold truncate w-32 dark:text-gray-200">
                {user.displayName || 'Warrior'}
              </span>
            </div>
            <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-red-500 font-bold">
              Exit
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-8 relative">
        {currentView === 'command-center' ? (
          <div className="max-w-6xl mx-auto animate-fade-in">
            <header className="mb-10">
              <h1 className="text-3xl font-bold dark:text-white">Welcome back, {user.displayName?.split(' ')[0] || 'Warrior'}.</h1>
              <p className="text-valhalla-ink/60 dark:text-gray-400 mt-2 text-lg">Here is your guild's pulse for today.</p>
            </header>

            {/* Dashboard Pulse Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-valhalla-gold/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-valhalla-ink/50 dark:text-gray-400 mb-2">My Active Quests</h3>
                <p className="text-5xl font-black dark:text-white">4</p>
              </div>
              
              <div className="glass p-6 rounded-2xl border-l-4 border-l-red-500 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-valhalla-ink/50 dark:text-gray-400 mb-2">Blocked Quests</h3>
                <p className="text-5xl font-black text-red-500 dark:text-red-400">1</p>
              </div>
              
              <div className="glass p-6 rounded-2xl border-l-4 border-l-green-500 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-valhalla-ink/50 dark:text-gray-400 mb-2">Guild Sync</h3>
                <p className="text-5xl font-black text-green-600 dark:text-green-400">100%</p>
              </div>
            </div>
            
            {/* AI Assistant Placeholder for later */}
            <div className="mt-12 glass p-8 rounded-2xl border-t-4 border-t-valhalla-gold dark:border-t-valhalla-neon">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                <span className="text-2xl">🔮</span> Oracle Insights
              </h2>
              <p className="text-valhalla-ink/70 dark:text-gray-300">
                Your AI Task Assistant is being summoned. Soon it will reveal hidden blockers and summarize your daily priorities here.
              </p>
            </div>

          </div>
        ) : (
          <div className="max-w-full h-full animate-fade-in">
            <TaskBoard />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
