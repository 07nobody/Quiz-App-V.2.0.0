import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { ROUTES } from '@constants';

/**
 * ProtectedRoute component for securing routes based on authentication and roles
 * Redirects to login page if not authenticated
 * Validates role-based access
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useSelector(state => state.users);
  const location = useLocation();
  const isLoading = useSelector(state => state.loader.loading);

  // Check authentication status
  const isAuthenticated = !!user;
  
  // Check role authorization if allowedRoles array exists and is non-empty
  const isAuthorized = 
    !allowedRoles.length || 
    (user && allowedRoles.includes(user.role));

  // Store current location for redirect-after-login feature
  useEffect(() => {
    if (!isAuthenticated) {
      // Save the location they tried to access for redirection after login
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [isAuthenticated, location.pathname]);

  // Show loading spinner when global loader is active
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  
  // If authenticated but not authorized for this route
  if (!isAuthorized) {
    // Redirect admins to admin dashboard
    if (user.role === 'admin') {
      return <Navigate to={ROUTES.HOME} replace />;
    }
    // Redirect regular users to available exams
    return <Navigate to={ROUTES.USER_EXAMS} replace />;
  }

  // If authenticated and authorized, render the route
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;