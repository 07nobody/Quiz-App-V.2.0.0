import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ui';
import { motion } from 'framer-motion';

/**
 * NotFoundPage - 404 Error Page
 * Displays when a user navigates to a non-existent route
 */
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-primary text-9xl font-bold mb-4">404</div>
          
          <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-3">
            Page Not Found
          </h1>
          
          <p className="text-text-secondary dark:text-gray-300 mb-8">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          
          <div className="space-x-4">
            <Button
              variant="primary"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              Go Back
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Go to Home
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-text-secondary dark:text-gray-400 text-sm">
            If you believe this is an error, please contact support.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;