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
  
  // Store pending messages to avoid overflow
  const pendingMessagesRef = useRef([]);
  
  // Track if we're currently processing messages
  const isProcessingRef = useRef(false);
  
  // Process message queue with requestIdleCallback when browser is idle
  const processMessageQueue = useCallback(() => {
    if (pendingMessagesRef.current.length === 0) {
      isProcessingRef.current = false;
      return;
    }
    
    isProcessingRef.current = true;
    const { type, content, duration, onClose } = pendingMessagesRef.current.shift();
    
    // Use setTimeout with 0 delay to defer to next event loop but not block rendering
    setTimeout(() => {
      antMessage[type](content, duration, onClose);
      
      // Process next message in queue after a small delay to prevent UI blocking
      setTimeout(processMessageQueue, 50);
    }, 0);
  }, []);
  
  // Throttle function to limit message frequency
  const throttleMessage = useCallback((type, content, duration, onClose) => {
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
    
    // Add to queue instead of showing immediately
    pendingMessagesRef.current.push({ type, content, duration, onClose });
    
    // Start processing queue if not already doing so
    if (!isProcessingRef.current) {
      processMessageQueue();
    }
  }, [processMessageQueue]);
  
  // Create optimized message functions
  const success = useCallback((content, duration, onClose) => {
    throttleMessage('success', content, duration, onClose);
  }, [throttleMessage]);
  
  const error = useCallback((content, duration, onClose) => {
    throttleMessage('error', content, duration, onClose);
  }, [throttleMessage]);
  
  const warning = useCallback((content, duration, onClose) => {
    throttleMessage('warning', content, duration, onClose);
  }, [throttleMessage]);
  
  const info = useCallback((content, duration, onClose) => {
    throttleMessage('info', content, duration, onClose);
  }, [throttleMessage]);
  
  const loading = useCallback((content, duration, onClose) => {
    throttleMessage('loading', content, duration, onClose);
  }, [throttleMessage]);

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
