import React, { Component } from 'react';

/**
 * React Error Boundary to catch JavaScript errors anywhere in the child component tree,
 * log those errors, and display a premium fallback UI.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 px-4 text-center">
          <div className="max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-150 space-y-6">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-2xl font-bold border border-rose-100">
              !
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Something went wrong</h1>
              <p className="text-sm text-gray-550 leading-relaxed">
                An unexpected interface error occurred. Please try reloading the page or return to the main dashboard.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all text-sm"
              >
                Reload Page
              </button>
              <a
                href="/"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all text-sm block"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
