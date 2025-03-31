import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import '../stylesheets/animations.css';

// Toast context for app-wide usage
const ToastContext = React.createContext({
  showToast: () => {},
});

export const useToast = () => React.useContext(ToastContext);

// Toast Provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Auto-remove toasts after their duration
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id);
      }, 3000); // Match this with CSS animation time
      return () => clearTimeout(timer);
    }
  }, [toasts, removeToast]);

  // Show a new toast
  const showToast = useCallback(({ type = 'info', title, message }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, type, title, message }]);
  }, []);

  // Toast component
  const Toast = ({ id, type, title, message }) => {
    // Choose icon based on toast type
    const getIcon = () => {
      switch (type) {
        case 'success':
          return '✓';
        case 'error':
          return '✕';
        case 'warning':
          return '⚠';
        default:
          return 'ℹ';
      }
    };

    return (
      <div className={`toast toast-${type}`}>
        <div className="toast-icon">{getIcon()}</div>
        <div className="toast-content">
          {title && <h4 className="toast-title">{title}</h4>}
          {message && <p className="toast-message">{message}</p>}
        </div>
        <button className="toast-close" onClick={() => removeToast(id)}>
          ×
        </button>
      </div>
    );
  };

  // Render toasts with portal to avoid z-index issues
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {ReactDOM.createPortal(
        <div className="toast-container">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};