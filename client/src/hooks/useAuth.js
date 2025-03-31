import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SetUser } from '../redux/usersSlice';
import { getUserInfo } from '../services/api/usersService';

/**
 * Custom hook to handle authentication logic
 * Centralizes auth-related functionality like checking auth status, logout, etc.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');
  
  // Load user data if authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && !user) {
        setLoading(true);
        try {
          const response = await getUserInfo();
          if (response.data.success) {
            dispatch(SetUser(response.data.data));
          } else {
            // If token is invalid, clear it
            localStorage.removeItem('token');
            setError('Session expired. Please login again.');
            navigate('/login');
          }
        } catch (error) {
          setError('Failed to load user data');
          localStorage.removeItem('token');
          navigate('/login');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserData();
  }, [dispatch, navigate, isAuthenticated, user]);

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    dispatch(SetUser(null));
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    logout
  };
};

export default useAuth;