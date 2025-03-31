import { useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to track and optimize UI performance
 * Helps identify slow event handlers and render performance issues
 * 
 * @param {Object} options Configuration options
 * @param {boolean} options.trackHandlers Whether to track event handler performance
 * @param {boolean} options.trackRendering Whether to track component rendering performance
 * @param {number} options.warningThreshold Duration threshold in ms before logging warnings
 * @returns {Object} Performance tracking methods
 */
const usePerformanceTracker = ({
  trackHandlers = true,
  trackRendering = true,
  warningThreshold = 150
} = {}) => {
  const componentName = useRef('Component');
  const renderCount = useRef(0);
  const renderStart = useRef(null);
  
  // Set the component name for better logging
  const setComponentName = useCallback((name) => {
    componentName.current = name;
  }, []);
  
  // Start tracking a specific operation
  const trackOperation = useCallback((operationName) => {
    const trackId = `${componentName.current}-${operationName}-${Date.now()}`;
    performance.mark(`${trackId}-start`);
    return trackId;
  }, []);
  
  // End tracking an operation and log if it's slow
  const endTracking = useCallback((trackId) => {
    try {
      performance.mark(`${trackId}-end`);
      performance.measure(
        trackId,
        `${trackId}-start`,
        `${trackId}-end`
      );
      
      const entries = performance.getEntriesByName(trackId);
      if (entries.length > 0) {
        const duration = entries[0].duration;
        if (duration > warningThreshold) {
          console.warn(`⚠️ Performance: ${trackId.split('-')[1]} took ${Math.round(duration)}ms (threshold: ${warningThreshold}ms)`);
        }
        performance.clearMarks(`${trackId}-start`);
        performance.clearMarks(`${trackId}-end`);
        performance.clearMeasures(trackId);
        return duration;
      }
    } catch (e) {
      // Ignore errors in performance measurement
    }
    return 0;
  }, [warningThreshold]);
  
  // Create a wrapped event handler that tracks performance
  const trackHandler = useCallback((handlerName, handler) => {
    if (!trackHandlers) return handler;
    
    return (...args) => {
      const trackId = trackOperation(`${handlerName}-handler`);
      try {
        return handler(...args);
      } finally {
        endTracking(trackId);
      }
    };
  }, [trackHandlers, trackOperation, endTracking]);
  
  // Track component rendering
  useEffect(() => {
    if (trackRendering) {
      renderCount.current++;
      
      if (renderStart.current) {
        const renderTime = performance.now() - renderStart.current;
        if (renderTime > warningThreshold) {
          console.warn(`⚠️ Performance: ${componentName.current} render #${renderCount.current} took ${Math.round(renderTime)}ms`);
        }
      }
      
      renderStart.current = performance.now();
    }
  });
  
  // Setup global performance monitoring on mount
  useEffect(() => {
    // Detect slow event handlers
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    
    if (trackHandlers) {
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (typeof listener === 'function') {
          const wrappedListener = function(...args) {
            const start = performance.now();
            try {
              return listener.apply(this, args);
            } finally {
              const duration = performance.now() - start;
              if (duration > warningThreshold) {
                console.warn(`⚠️ Performance: '${type}' handler took ${Math.round(duration)}ms`);
              }
            }
          };
          
          // Store reference for removal
          if (!listener.__wrapped) {
            listener.__wrapped = wrappedListener;
          }
          
          return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
      
      // Support removing wrapped event listeners
      EventTarget.prototype.removeEventListener = function(type, listener, options) {
        if (typeof listener === 'function' && listener.__wrapped) {
          return originalRemoveEventListener.call(this, type, listener.__wrapped, options);
        }
        return originalRemoveEventListener.call(this, type, listener, options);
      };
    }
    
    return () => {
      // Cleanup
      if (trackHandlers) {
        EventTarget.prototype.addEventListener = originalAddEventListener;
        EventTarget.prototype.removeEventListener = originalRemoveEventListener;
      }
    };
  }, [trackHandlers, warningThreshold]);
  
  return {
    trackOperation,
    endTracking,
    trackHandler,
    setComponentName
  };
};

export default usePerformanceTracker;