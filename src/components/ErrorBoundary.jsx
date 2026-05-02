import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Valhalla Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-screen flex items-center justify-center bg-valhalla-parchment dark:bg-valhalla-void p-8"
        >
          <div className="glass max-w-md w-full p-8 rounded-2xl text-center border-t-4 border-t-red-500">
            <h1 className="text-2xl font-black mb-4 dark:text-white">⚠️ The Hall Has Fallen</h1>
            <p className="text-valhalla-ink/70 dark:text-gray-300 mb-4">
              An unexpected error has occurred. Please refresh the page to return to Valhalla.
            </p>
            <pre className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-left overflow-auto mb-6">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="bg-valhalla-ink dark:bg-valhalla-neon text-white dark:text-valhalla-void font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Return to Valhalla
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
