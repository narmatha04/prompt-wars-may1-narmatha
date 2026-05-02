import React, { useState, lazy, Suspense } from 'react';
import './index.css';
import TaskBoard from './components/TaskBoard/TaskBoard';
import LandingPage from './components/Auth/LandingPage';
import ErrorBoundary from './components/ErrorBoundary';
import { useTheme } from './context/ThemeContext';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect } from 'react';

// Lazy-load the AI assistant to improve initial page load performance
const AIAssistant = lazy(() => import('./components/AIAssistant/AIAssistant'));

const DEMO_TASKS = [
  { id: '1', title: 'Design Database Schema', status: 'todo', owner: 'Alex', priority: 'P1', confidence: 'On Track', dueDate: new Date(Date.now() + 86400000).toISOString() },
  { id: '2', title: 'Set up GitHub Actions', status: 'in-progress', owner: 'You', priority: 'P2', confidence: 'On Track', dueDate: new Date(Date.now() + 486400000).toISOString() },
  { id: '3', title: 'Configure Firebase Auth', status: 'blocked', owner: 'Sam', priority: 'P1', confidence: 'At Risk', dueDate: new Date(Date.now() + 864000000).toISOString() },
];

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
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading Valhalla"
        className="min-h-screen flex items-center justify-center bg-valhalla-parchment dark:bg-valhalla-void"
      >
        <div aria-hidden="true" className="animate-spin rounded-full h-12 w-12 border-b-2 border-valhalla-gold dark:border-valhalla-neon"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <ErrorBoundary>
      {/* Skip to main content for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-valhalla-gold focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold"
      >
        Skip to main content
      </a>

      <div className="flex h-screen overflow-hidden bg-valhalla-parchment dark:bg-valhalla-void transition-colors duration-300">
        {/* Sidebar Navigation */}
        <aside aria-label="Sidebar navigation" className="w-64 border-r border-valhalla-ink/10 dark:border-white/10 p-6 flex flex-col glass relative z-10">
          <div className="mb-8">
            <h2 className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-valhalla-gold to-amber-700 dark:from-valhalla-neon dark:to-purple-500">
              VALHALLA
            </h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-valhalla-ink/50 dark:text-gray-400 mt-1">
              Coordinate. Conquer.
            </p>
          </div>

          <nav aria-label="Main navigation">
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  id="nav-command-center"
                  onClick={() => setCurrentView('command-center')}
                  aria-current={currentView === 'command-center' ? 'page' : undefined}
                  className={`w-full text-left font-medium p-3 rounded-lg transition-colors ${
                    currentView === 'command-center'
                      ? 'bg-white/50 dark:bg-white/10 text-valhalla-ink dark:text-white shadow-sm'
                      : 'text-valhalla-ink/60 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/5'
                  }`}
                >
                  Command Center
                </button>
              </li>
              <li>
                <button
                  id="nav-task-board"
                  onClick={() => setCurrentView('task-board')}
                  aria-current={currentView === 'task-board' ? 'page' : undefined}
                  className={`w-full text-left font-medium p-3 rounded-lg transition-colors ${
                    currentView === 'task-board'
                      ? 'bg-white/50 dark:bg-white/10 text-valhalla-ink dark:text-white shadow-sm'
                      : 'text-valhalla-ink/60 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/5'
                  }`}
                >
                  Task Board
                </button>
              </li>
              <li>
                <button
                  disabled
                  aria-disabled="true"
                  className="w-full text-left font-medium p-3 rounded-lg text-valhalla-ink/30 dark:text-gray-600 cursor-not-allowed"
                >
                  The Runes (Decisions)
                </button>
              </li>
              <li>
                <button
                  disabled
                  aria-disabled="true"
                  className="w-full text-left font-medium p-3 rounded-lg text-valhalla-ink/30 dark:text-gray-600 cursor-not-allowed"
                >
                  AI Oracle (Standups)
                </button>
              </li>
            </ul>
          </nav>

          {/* Theme toggle & user profile */}
          <div className="mt-auto border-t border-valhalla-ink/10 dark:border-white/10 pt-4 flex flex-col gap-4">
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              className="flex items-center gap-2 text-sm font-medium text-valhalla-ink/70 dark:text-gray-300 hover:text-valhalla-ink dark:hover:text-white transition-colors"
            >
              {theme === 'light' ? '🌙 Switch to Void' : '☀️ Switch to Light'}
            </button>

            <div
              role="button"
              tabIndex={0}
              onClick={handleSignOut}
              onKeyDown={(e) => e.key === 'Enter' && handleSignOut()}
              title="Click to sign out"
              aria-label={`Signed in as ${user.displayName || 'Warrior'}. Click to sign out.`}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=random`}
                  alt={`${user.displayName || 'User'} profile picture`}
                  loading="lazy"
                  className="w-8 h-8 rounded-full border border-valhalla-gold dark:border-valhalla-neon"
                />
                <span className="text-sm font-semibold truncate w-32 dark:text-gray-200">
                  {user.displayName || 'Warrior'}
                </span>
              </div>
              <span aria-hidden="true" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-red-500 font-bold">
                Exit
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main id="main-content" className="flex-1 overflow-auto p-8 relative" tabIndex={-1}>
          {currentView === 'command-center' ? (
            <div className="max-w-6xl mx-auto">
              <header className="mb-10">
                <h1 className="text-3xl font-bold dark:text-white">
                  Welcome back, {user.displayName?.split(' ')[0] || 'Warrior'}.
                </h1>
                <p className="text-valhalla-ink/60 dark:text-gray-400 mt-2 text-lg">
                  Here is your guild&apos;s pulse for today.
                </p>
              </header>

              <section aria-label="Dashboard metrics">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass p-6 rounded-2xl relative overflow-hidden group">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-valhalla-ink/50 dark:text-gray-400 mb-2">
                      My Active Quests
                    </h3>
                    <p className="text-5xl font-black dark:text-white" aria-label="4 active quests">4</p>
                  </div>
                  <div className="glass p-6 rounded-2xl border-l-4 border-l-red-500">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-valhalla-ink/50 dark:text-gray-400 mb-2">
                      Blocked Quests
                    </h3>
                    <p className="text-5xl font-black text-red-500 dark:text-red-400" aria-label="1 blocked quest">1</p>
                  </div>
                  <div className="glass p-6 rounded-2xl border-l-4 border-l-green-500">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-valhalla-ink/50 dark:text-gray-400 mb-2">
                      Guild Sync
                    </h3>
                    <p className="text-5xl font-black text-green-600 dark:text-green-400" aria-label="100% guild sync">100%</p>
                  </div>
                </div>
              </section>

              {/* AI Oracle */}
              <section aria-label="AI Oracle Insights" className="mt-12 glass p-8 rounded-2xl border-t-4 border-t-valhalla-gold dark:border-t-valhalla-neon">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                  <span aria-hidden="true" className="text-2xl">🔮</span> Oracle Insights
                </h2>
                <Suspense fallback={
                  <div role="status" aria-label="Loading Oracle" className="text-valhalla-ink/50 dark:text-gray-400 animate-pulse">
                    Summoning the Oracle...
                  </div>
                }>
                  <AIAssistant tasks={DEMO_TASKS} />
                </Suspense>
              </section>
            </div>
          ) : (
            <TaskBoard />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
