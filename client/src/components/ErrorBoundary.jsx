import React from 'react';
import { Button, Result } from 'antd';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

function ErrorFallback({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
    resetErrorBoundary();
  };

  return (
    <div className="error-fallback animate-fade-in">
      <Result
        status="error"
        title="Something went wrong"
        subTitle={error?.message || "We're sorry, an unexpected error has occurred."}
        extra={[
          <Button key="home" type="primary" onClick={handleGoHome}>
            Go to Home
          </Button>,
          <Button key="retry" onClick={resetErrorBoundary}>
            Try again
          </Button>,
        ]}
      />
      
      <div className="error-details">
        <p className="text-sm text-neutral-500 mt-8">Error details (for developers):</p>
        <pre className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-md overflow-auto max-h-32 text-xs">
          {error?.stack || error?.toString() || 'Unknown error'}
        </pre>
      </div>
      
      <style jsx="true">{`
        .error-fallback {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
          padding: 1rem;
        }
        
        .error-details {
          width: 100%;
          max-width: 800px;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}

function ErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}

export default ErrorBoundary;