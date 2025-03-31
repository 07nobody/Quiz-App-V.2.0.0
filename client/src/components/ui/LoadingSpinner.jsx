import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

/**
 * LoadingSpinner Component
 * A consistent loading indicator to use throughout the application
 */
const LoadingSpinner = ({ 
  size = 'default', 
  text = 'Loading...', 
  fullScreen = false,
  transparent = false,
  className = ''
}) => {
  // Determine spinner size
  const spinnerSizes = {
    small: 16,
    default: 24,
    large: 32,
    xlarge: 48
  };

  const spinnerSize = spinnerSizes[size] || spinnerSizes.default;
  const spinIcon = <LoadingOutlined spin style={{ fontSize: spinnerSize }} />;
  
  // Handle full screen loading state
  if (fullScreen) {
    return (
      <div className={`
        fixed top-0 left-0 w-full h-full 
        flex flex-col items-center justify-center z-50
        ${transparent ? 'bg-white/70 dark:bg-neutral-900/70' : 'bg-white dark:bg-neutral-900'}
        ${className}
      `}>
        <Spin indicator={spinIcon} />
        {text && <div className="mt-4 text-text-secondary">{text}</div>}
      </div>
    );
  }
  
  // Handle inline loading state
  return (
    <div className={`flex flex-col items-center justify-center py-4 ${className}`}>
      <Spin indicator={spinIcon} />
      {text && <div className="mt-2 text-text-secondary">{text}</div>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'large', 'xlarge']),
  text: PropTypes.string,
  fullScreen: PropTypes.bool,
  transparent: PropTypes.bool,
  className: PropTypes.string,
};

export default LoadingSpinner;