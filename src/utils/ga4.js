import ReactGA from 'react-ga4';

let isInitialized = false;

/**
 * Initialize Google Analytics 4
 */
export const initGA4 = () => {
  const measurementId = process.env.REACT_APP_GA4_MEASUREMENT_ID;
  
  if (!measurementId) {
    console.warn('GA4 Measurement ID is not set. Please add REACT_APP_GA4_MEASUREMENT_ID to your .env file');
    return;
  }

  if (isInitialized) {
    console.warn('GA4 is already initialized');
    return;
  }

  try {
    ReactGA.initialize(measurementId, {
      gaOptions: {
        debug_mode: process.env.NODE_ENV === 'development',
      },
    });
    isInitialized = true;
    console.log('GA4 initialized successfully');
  } catch (error) {
    console.error('Failed to initialize GA4:', error);
    trackError(error, 'GA4 Initialization');
  }
};

/**
 * Track a page view
 * @param {string} path - The page path
 * @param {string} title - The page title
 */
export const trackPageView = (path, title) => {
  console.log('📊 [GA4] Page view tracked:', path, { title });

  if (!isInitialized) {
    console.warn('GA4 is not initialized - event logged to console only');
    return;
  }

  try {
    ReactGA.send({ 
      hitType: 'pageview', 
      page: path,
      title: title 
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

/**
 * Track a custom event
 * @param {string} eventName - The name of the event
 * @param {object} parameters - Additional event parameters
 */
export const trackEvent = (eventName, parameters = {}) => {
  console.log('📊 [GA4] Event tracked:', eventName, parameters);

  if (!isInitialized) {
    console.warn('GA4 is not initialized - event logged to console only');
    return;
  }

  try {
    ReactGA.event(eventName, parameters);
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

/**
 * Track a button click
 * @param {string} buttonName - The name/label of the button
 * @param {string} location - Where the button is located
 * @param {object} additionalData - Additional data to track
 */
export const trackButtonClick = (buttonName, location, additionalData = {}) => {
  trackEvent('button_click', {
    button_name: buttonName,
    button_location: location,
    ...additionalData,
  });
};

/**
 * Track an error
 * @param {Error|string} error - The error object or message
 * @param {string} context - Where the error occurred
 * @param {object} additionalData - Additional error context
 */
export const trackError = (error, context = '', additionalData = {}) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : '';

  trackEvent('error_occurred', {
    error_message: errorMessage,
    error_context: context,
    error_stack: errorStack?.substring(0, 500), // Limit stack trace length
    error_type: error instanceof Error ? error.constructor.name : 'Unknown',
    ...additionalData,
  });

  console.error(`Error in ${context}:`, error);
};

/**
 * Track form interactions
 * @param {string} action - The form action (submit, reset, etc.)
 * @param {object} formData - Data about the form
 */
export const trackFormInteraction = (action, formData = {}) => {
  trackEvent('form_interaction', {
    form_action: action,
    ...formData,
  });
};

/**
 * Track timing/performance
 * @param {string} name - Name of the timing metric
 * @param {number} duration - Duration in milliseconds
 * @param {string} category - Category of the timing
 */
export const trackTiming = (name, duration, category = 'performance') => {
  trackEvent('timing_complete', {
    timing_name: name,
    timing_duration: duration,
    timing_category: category,
  });
};

const ga4Utils = {
  initGA4,
  trackPageView,
  trackEvent,
  trackButtonClick,
  trackError,
  trackFormInteraction,
  trackTiming,
};

export default ga4Utils;
