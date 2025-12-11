import React from 'react';
import { trackError } from '../utils/ga4';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to GA4
    trackError(error, 'React Error Boundary', {
      component_stack: errorInfo.componentStack?.substring(0, 500),
      error_boundary: true,
    });

    // Update state with error details
    this.setState(prevState => ({
      error: error,
      errorInfo: errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Also log to console
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    trackError('User reset error boundary', 'Error Boundary', {
      action: 'reset',
      error_count: this.state.errorCount,
    });

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div style={styles.container}>
          <div style={styles.errorBox}>
            <h1 style={styles.title}>Oops! Something went wrong</h1>
            <p style={styles.message}>
              We're sorry, but something unexpected happened. The error has been logged and tracked.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details (Development Mode)</summary>
                <div style={styles.errorDetails}>
                  <p><strong>Error:</strong> {this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <>
                      <p><strong>Component Stack:</strong></p>
                      <pre style={styles.pre}>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div style={styles.buttonGroup}>
              <button onClick={this.handleReset} style={styles.button}>
                Try Again
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                style={{...styles.button, ...styles.secondaryButton}}
              >
                Go Home
              </button>
            </div>

            <p style={styles.errorCount}>
              Error count this session: {this.state.errorCount}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  errorBox: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '40px',
    maxWidth: '600px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    color: '#e74c3c',
    marginBottom: '16px',
    fontSize: '24px',
  },
  message: {
    color: '#555',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  details: {
    marginTop: '20px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #dee2e6',
  },
  summary: {
    cursor: 'pointer',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },
  errorDetails: {
    marginTop: '10px',
    fontSize: '14px',
  },
  pre: {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '4px',
    overflow: 'auto',
    fontSize: '12px',
    border: '1px solid #ddd',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
    transition: 'background-color 0.3s',
  },
  secondaryButton: {
    backgroundColor: '#95a5a6',
  },
  errorCount: {
    marginTop: '20px',
    fontSize: '12px',
    color: '#999',
    textAlign: 'center',
  },
};

export default ErrorBoundary;
