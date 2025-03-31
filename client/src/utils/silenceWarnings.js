/**
 * Utility to silence specific React warnings in development mode
 * 
 * This is useful for suppressing known warnings that you've already addressed
 * but still appear due to third-party libraries or complex component structures.
 */

const originalConsoleWarn = console.warn;

// List of warning messages to silence
const warningsToSilence = [
  'React Router Future Flag Warning',
  'Instance created by `useForm` is not connected to any Form element'
];

/**
 * Override console.warn to filter out specific warnings
 */
export function setupWarningFilters() {
  if (process.env.NODE_ENV === 'development') {
    console.warn = function filterWarnings(...args) {
      if (args.length > 0 && typeof args[0] === 'string') {
        const warningMessage = args[0];
        
        // Check if the warning message includes any of our silence patterns
        const shouldSilence = warningsToSilence.some(pattern => 
          warningMessage.includes(pattern)
        );
        
        if (shouldSilence) {
          return; // Don't output this warning
        }
      }
      
      // For all other warnings, use the original console.warn
      originalConsoleWarn.apply(console, args);
    };
  }
}

/**
 * Restore the original console.warn function
 */
export function restoreWarnings() {
  console.warn = originalConsoleWarn;
}