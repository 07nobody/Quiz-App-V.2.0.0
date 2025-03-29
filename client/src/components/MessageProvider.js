import React, { createContext, useContext, useCallback, useMemo, useRef } from 'react';
import { message as antMessage } from 'antd';

// Create a context for the message API
const MessageContext = createContext(null);

// Configure message globally to prevent excessive re-renders
antMessage.config({
  maxCount: 2,  // Reduce max count to 2
  duration: 2.5,  // Slightly shorter duration
  rtl: false,
});

/**
 * Custom hook to use the optimized message API
 * @returns {Object} Optimized message API
 */
export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

/**
 * MessageProvider component that provides an optimized message API
 * to prevent performance issues with Ant Design's message component
 */
export const MessageProvider = ({ children }) => {
  // Use refs to track last message time and content to prevent duplicates
  const lastMessageRef = useRef({
    time: 0,
    content: '',
    type: ''
  });
  
  // Throttle function to limit message frequency
  const throttleMessage = (type, content, duration, onClose) => {
    const now = Date.now();
    const lastMessage = lastMessageRef.current;
    
    // Prevent duplicate messages within 1 second
    if (
      content === lastMessage.content && 
      type === lastMessage.type && 
      now - lastMessage.time < 1000
    ) {
      return;
    }
    
    // Update last message info
    lastMessageRef.current = {
      time: now,
      content,
      type
    };
    
    // Use setTimeout instead of requestAnimationFrame for more predictable timing
    setTimeout(() => {
      antMessage[type](content, duration, onClose);
    }, 0);
  };
  
  // Create optimized message functions
  const success = useCallback((content, duration, onClose) => {
    throttleMessage('success', content, duration, onClose);
  }, []);
  
  const error = useCallback((content, duration, onClose) => {
    throttleMessage('error', content, duration, onClose);
  }, []);
  
  const warning = useCallback((content, duration, onClose) => {
    throttleMessage('warning', content, duration, onClose);
  }, []);
  
  const info = useCallback((content, duration, onClose) => {
    throttleMessage('info', content, duration, onClose);
  }, []);
  
  const loading = useCallback((content, duration, onClose) => {
    throttleMessage('loading', content, duration, onClose);
  }, []);

  // Create a memoized value for the context to prevent unnecessary re-renders
  const messageApi = useMemo(() => ({
    success,
    error,
    warning,
    info,
    loading,
    // Provide direct access to the original API for advanced use cases
    destroy: antMessage.destroy,
  }), [success, error, warning, info, loading]);

  return (
    <MessageContext.Provider value={messageApi}>
      {children}
    </MessageContext.Provider>
  );
};

// Example usage in components:
/*
import { useMessage } from '../components/MessageProvider';

function MyComponent() {
  const message = useMessage();
  
  const handleClick = () => {
    message.success('Operation completed successfully!');
  };
  
  return (
    <Button onClick={handleClick}>Submit</Button>
  );
}
*/
