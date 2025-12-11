import React, { useEffect } from 'react';
import FormComponent from './components/FormComponent';
import ErrorBoundary from './components/ErrorBoundary';
import { initGA4, trackPageView, trackError } from './utils/ga4';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize GA4 on app mount
    initGA4();
    
    // Track initial page view
    trackPageView(window.location.pathname, 'Form GA4 App');

    // Set up global error handler for uncaught errors
    const handleError = (event) => {
      trackError(event.error || event.message, 'Global Error Handler', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    // Set up handler for unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      trackError(event.reason, 'Unhandled Promise Rejection', {
        promise: event.promise?.toString(),
      });
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h2>React Form with GA4 Tracking</h2>
          <p>All interactions, validations, and errors are tracked</p>
        </header>
        <main className="App-main">
          <FormComponent />
        </main>
        <footer className="App-footer">
          <p>© 2025 Form GA4 Demo - All events are tracked with Google Analytics 4</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
