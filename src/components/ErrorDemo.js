import React, { useState } from 'react';
import { trackButtonClick } from '../utils/ga4';

/**
 * ErrorDemo Component
 * This component demonstrates error tracking and error boundary functionality
 * Uncomment the import and usage in App.js to test error tracking
 */
const ErrorDemo = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  const handleThrowError = () => {
    trackButtonClick('Throw Error', 'Error Demo');
    setShouldThrow(true);
  };

  const handleAsyncError = () => {
    trackButtonClick('Async Error', 'Error Demo');
    setTimeout(() => {
      throw new Error('This is a simulated async error!');
    }, 100);
  };

  const handlePromiseRejection = () => {
    trackButtonClick('Promise Rejection', 'Error Demo');
    Promise.reject(new Error('This is a simulated promise rejection!'));
  };

  if (shouldThrow) {
    throw new Error('This is a simulated React error caught by Error Boundary!');
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Error Tracking Demo</h3>
      <p style={styles.description}>
        Click these buttons to test different types of error tracking:
      </p>
      <div style={styles.buttonGroup}>
        <button onClick={handleThrowError} style={styles.button}>
          Throw React Error
        </button>
        <button onClick={handleAsyncError} style={styles.button}>
          Throw Async Error
        </button>
        <button onClick={handlePromiseRejection} style={styles.button}>
          Promise Rejection
        </button>
      </div>
      <p style={styles.note}>
        Note: All errors are tracked in GA4 and logged to the console.
      </p>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    padding: '20px',
    marginTop: '20px',
    maxWidth: '600px',
    margin: '20px auto',
  },
  title: {
    color: '#856404',
    marginTop: 0,
    marginBottom: '10px',
  },
  description: {
    color: '#856404',
    marginBottom: '15px',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  note: {
    fontSize: '12px',
    color: '#856404',
    marginTop: '15px',
    marginBottom: 0,
    fontStyle: 'italic',
  },
};

export default ErrorDemo;
