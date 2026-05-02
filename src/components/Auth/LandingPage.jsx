import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useTheme } from '../../context/ThemeContext';

export default function LandingPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      aria-label="Valhalla landing page"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-valhalla-parchment dark:bg-valhalla-void transition-colors duration-500"
    >
      {/* Decorative background — hidden from assistive tech */}
      <div aria-hidden="true" className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-valhalla-gold/10 dark:bg-valhalla-neon/10 rounded-full blur-3xl"></div>
      <div aria-hidden="true" className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 dark:bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 glass max-w-md w-full p-10 rounded-2xl text-center shadow-2xl border-valhalla-gold/30 dark:border-valhalla-neon/30">

        <div className="mb-8">
          <h1 className="text-5xl font-black mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-valhalla-gold to-amber-700 dark:from-valhalla-neon dark:to-purple-500">
            VALHALLA
          </h1>
          <p className="text-valhalla-ink/70 dark:text-gray-400 tracking-widest uppercase text-sm mt-4 font-medium">
            Coordinate. Conquer.
          </p>
        </div>

        <div className="space-y-6">
          <p className="text-valhalla-ink/80 dark:text-gray-300">
            Enter the grand hall. Sync your team, track your quests, and eliminate the meeting tax.
          </p>

          {error && (
            <div role="alert" className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <button
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
            aria-busy={loading}
            aria-label="Sign in with Google"
            className={`w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-bold transition-all duration-200
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}
              bg-valhalla-ink text-white hover:bg-black
              dark:bg-valhalla-neon dark:text-valhalla-void dark:hover:bg-cyan-400`}
          >
            {loading ? (
              <span>Opening the Gates...</span>
            ) : (
              <>
                <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-valhalla-ink/10 dark:border-white/10">
          <p className="text-xs text-valhalla-ink/50 dark:text-gray-500">
            By entering, you agree to conquer your tasks efficiently.
          </p>
        </div>
      </div>
    </main>
  );
}

LandingPage.propTypes = {};
