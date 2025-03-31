/**
 * Custom hooks for optimizing render performance
 */
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * Hook for virtualizing large lists to improve performance
 * @param {Array} items - The full list of items
 * @param {number} itemHeight - Height of each item in pixels
 * @param {number} overscan - Number of items to render beyond visible area
 * @returns {Object} Virtual list helpers and visible items
 */
export const useVirtualList = (items = [], itemHeight = 50, overscan = 5) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
      
      const handleResize = () => {
        setContainerHeight(containerRef.current.clientHeight);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [containerRef]);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  const totalHeight = useMemo(() => {
    return items.length * itemHeight;
  }, [items.length, itemHeight]);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, itemHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange.startIndex, visibleRange.endIndex]);

  const offsetY = useMemo(() => {
    return visibleRange.startIndex * itemHeight;
  }, [visibleRange.startIndex, itemHeight]);

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex: visibleRange.startIndex,
  };
};

/**
 * Hook for handling pagination with optimized rendering
 * @param {Array} items - The full list of items to paginate
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} Pagination state and handlers
 */
export const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / itemsPerPage));
  }, [items.length, itemsPerPage]);
  
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);
  
  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [goToPage, currentPage]);
  
  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [goToPage, currentPage]);
  
  // Reset to page 1 when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);
  
  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
};

/**
 * Hook to debounce function calls for better performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @param {boolean} immediate - Whether to call immediately on leading edge
 * @returns {Function} Debounced function
 */
export const useDebounce = (func, wait = 300, immediate = false) => {
  const timeout = useRef();
  
  return useCallback(
    (...args) => {
      const later = () => {
        timeout.current = null;
        if (!immediate) func(...args);
      };
      
      const callNow = immediate && !timeout.current;
      
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      
      timeout.current = setTimeout(later, wait);
      
      if (callNow) func(...args);
    },
    [func, wait, immediate]
  );
};

/**
 * Hook for efficient search and filtering of large datasets
 * @param {Array} data - Data array to search through
 * @param {Object} options - Search configuration
 * @returns {Object} Search state and filtered results
 */
export const useSearch = (data = [], options = {}) => {
  const {
    keys = [],
    debounceMs = 300,
    minQueryLength = 1,
  } = options;
  
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedSearch = useDebounce((searchQuery) => {
    setIsSearching(false);
  }, debounceMs);
  
  const handleQueryChange = useCallback((e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (newQuery.length >= minQueryLength) {
      setIsSearching(true);
      debouncedSearch(newQuery);
    }
  }, [minQueryLength, debouncedSearch]);
  
  const filteredData = useMemo(() => {
    if (!query || query.length < minQueryLength) return data;
    
    const lowerCaseQuery = query.toLowerCase();
    
    return data.filter(item => {
      // If no keys specified, do a general search
      if (keys.length === 0) {
        return Object.values(item).some(value =>
          String(value).toLowerCase().includes(lowerCaseQuery)
        );
      }
      
      // Otherwise, only search in specified keys
      return keys.some(key => {
        const value = item[key];
        return value && String(value).toLowerCase().includes(lowerCaseQuery);
      });
    });
  }, [data, keys, query, minQueryLength]);
  
  return {
    query,
    setQuery,
    handleQueryChange,
    filteredData,
    isSearching,
    resultCount: filteredData.length,
  };
};

export default {
  useVirtualList,
  usePagination,
  useDebounce,
  useSearch
};