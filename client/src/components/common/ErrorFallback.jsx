import React from 'react';
import { Button } from '@ui';
import { useNavigate } from 'react-router-dom';

/**
 * Error Fallback Component
 * Displays when a component error occurs, providing a graceful UI for error scenarios
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  // Handle going back to home/dashboard
  const handleGoHome = () => {
    // Try to navigate to home page
    navigate('/');
    // Also reset the error boundary
    resetErrorBoundary();
  };

  // Extract a more user-friendly message from the error
  const getFriendlyErrorMessage = () => {
    if (error?.message?.includes('Network Error')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
    if (error?.response?.status === 401) {
      return 'Your session has expired. Please log in again.';
    }
    if (error?.response?.status === 403) {
      return 'You do not have permission to access this resource.';
    }
    if (error?.response?.status === 404) {
      return 'The requested resource was not found.';
    }
    if (error?.response?.status >= 500) {
      return 'Server error. Our team has been notified and is working on it.';
    }
    
    return 'Something went wrong. Please try again or contact support if the issue persists.';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="mb-6">
          <svg 
            className="mx-auto h-16 w-16 text-danger" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-text-primary dark:text-white mb-3">
          Oops! Something went wrong
        </h2>
        
        <p className="text-text-secondary dark:text-gray-300 mb-6">
          {getFriendlyErrorMessage()}
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
          <Button
            variant="primary"
            onClick={resetErrorBoundary}
          >
            Try Again
          </Button>
          
          <Button
            variant="outline"
            onClick={handleGoHome}
          >
            Go to Home
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded text-xs text-left overflow-auto">
            <p className="font-semibold mb-2">Technical details (development only):</p>
            <pre className="whitespace-pre-wrap break-words">
              {error?.message || 'Unknown error'}
            </pre>
            <pre className="whitespace-pre-wrap break-words mt-2">
              {error?.stack?.split('\n').slice(0, 3).join('\n')}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;