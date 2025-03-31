import { useState, useMemo } from 'react';
import { PAGINATION } from '../utils/constants/appConstants';

/**
 * Custom hook to manage pagination state and logic
 * @param {Object} options - Pagination options
 * @param {Array} options.data - The complete data array to paginate
 * @param {number} options.initialPageSize - Initial number of items per page
 * @param {Function} options.fetchData - Optional async function for server-side pagination
 * @param {boolean} options.serverSide - Whether pagination is server-side or client-side
 * @returns {Object} Pagination state and handlers
 */
const usePagination = (options = {}) => {
  const {
    data = [],
    initialPageSize = PAGINATION.PAGE_SIZE,
    fetchData,
    serverSide = false
  } = options;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(serverSide ? 0 : data.length);
  const [loading, setLoading] = useState(false);
  
  // For client-side pagination, calculate paginated data
  const paginatedData = useMemo(() => {
    if (serverSide) return data;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize, serverSide]);
  
  // Handle page change
  const handlePageChange = async (page) => {
    setCurrentPage(page);
    
    if (serverSide && fetchData) {
      setLoading(true);
      try {
        const result = await fetchData({
          page,
          pageSize
        });
        
        // If the function returns total count, update it
        if (result && typeof result.total === 'number') {
          setTotalItems(result.total);
        }
      } catch (error) {
        console.error('Error fetching paginated data:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Handle page size change
  const handlePageSizeChange = async (current, size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
    
    if (serverSide && fetchData) {
      setLoading(true);
      try {
        const result = await fetchData({
          page: 1,
          pageSize: size
        });
        
        // If the function returns total count, update it
        if (result && typeof result.total === 'number') {
          setTotalItems(result.total);
        }
      } catch (error) {
        console.error('Error fetching paginated data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Return pagination state and handlers
  return {
    currentPage,
    pageSize,
    totalItems,
    loading,
    paginatedData,
    handlePageChange,
    handlePageSizeChange,
    // For use with Ant Design Table or Pagination components
    pagination: {
      current: currentPage,
      pageSize: pageSize,
      total: totalItems,
      onChange: handlePageChange,
      onShowSizeChange: handlePageSizeChange,
      showSizeChanger: true,
      showTotal: (total) => `Total ${total} items`,
      pageSizeOptions: PAGINATION.PAGE_SIZE_OPTIONS,
    }
  };
};

export default usePagination;